/**
 * Coalition Builder: Party Chair — Version 0.16.1
 * election-uncertainty.js: Polling Uncertainty, Correlated Regional Errors, Shy Voters & Statutory Recounts
 *
 * Requirements:
 *  - REQ-204: Correlated Regional & State Polling Error (Box-Muller Gaussian sigma=2.8%, regional error correlation)
 *  - REQ-205: Shy-Voter Bias & Late-Breaking Undecided Swing (Rough/Undisciplined candidate drag, 65/35 late break)
 *  - REQ-210: Automatic Close-Margin Statutory Recounts (Margin <=0.50% triggers recount; stochastic +/-0.12% adjustment; hooks REQ-191)
 */

(function (root, factory) {
  const api = factory();
  if (typeof window !== 'undefined') {
    window.ElectionUncertainty = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ElectionUncertainty = api;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getData() {
    return (typeof window !== 'undefined' && window.PartyChairData)
      ? window.PartyChairData
      : (typeof global !== 'undefined' && global.PartyChairData)
        ? global.PartyChairData
        : {};
  }

  function getEngine() {
    return (typeof window !== 'undefined' && window.PartyChairEngine)
      ? window.PartyChairEngine
      : (typeof global !== 'undefined' && global.PartyChairEngine)
        ? global.PartyChairEngine
        : {};
  }

  /**
   * Mulberry32 32-bit PRNG for deterministic, reproducible simulation runs.
   */
  function createPrng(seed) {
    let s = Number(seed) || 2028;
    return function () {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Box-Muller Gaussian transformation generating normally distributed values.
   */
  function boxMullerGaussian(u1, u2, mean = 0, stdDev = 1) {
    const safeU1 = Math.max(1e-12, Math.min(1 - 1e-12, u1));
    const safeU2 = Math.max(1e-12, Math.min(1 - 1e-12, u2));
    const z0 = Math.sqrt(-2.0 * Math.log(safeU1)) * Math.cos(2.0 * Math.PI * safeU2);
    return mean + z0 * stdDev;
  }

  /**
   * REQ-204: Correlated Regional & State Polling Error.
   * Draws a correlated error vector for each Census Region (sigma = 2.8%),
   * then adds state-level independent polling error (sigma = 1.2%).
   */
  function generateCorrelatedPollingError(game, options = {}) {
    // v0.18.1 (#43): If CampaignOverhaul already generated correlated polling errors for this cycle, reuse them to avoid double-randomization
    const existingReport = game?.pollingMissReport || game?.lastElection?.pollingMissReport;
    if (!options.forceNew && existingReport && existingReport.stateErrors && Number(existingReport.year || game?.year) === Number(game?.year || 2028)) {
      return {
        correlatedRegionalError: existingReport.regionalRealized || existingReport.regionalErrors || {},
        statePollingErrors: { ...existingReport.stateErrors },
        nationalError: existingReport.realizedNationalMiss ?? existingReport.recalculatedNationalMiss ?? existingReport.nationalMiss ?? 0,
        source: 'campaign-overhaul-unified',
      };
    }
    const seed = options.seed !== undefined ? options.seed : (game?.seed || 2028) + (game?.year || 2028);
    const rng = createPrng(seed);

    const regions = ['Northeast', 'Midwest', 'South', 'West'];
    const correlatedRegionalError = {};

    // Regional correlated error: N(0, sigma = 2.8 pts)
    regions.forEach((region) => {
      const u1 = rng();
      const u2 = rng();
      const deltaRegion = boxMullerGaussian(u1, u2, 0, 2.8);
      correlatedRegionalError[region] = Math.round(deltaRegion * 100) / 100;
    });

    const states = (typeof window !== 'undefined' && window.PartyChairData?.STATES)
      ? window.PartyChairData.STATES
      : (typeof global !== 'undefined' && global.PartyChairData?.STATES)
        ? global.PartyChairData.STATES
        : [];

    const statePollingErrors = {};
    states.forEach((st) => {
      const regErr = correlatedRegionalError[st.region] || 0;
      const u1 = rng();
      const u2 = rng();
      const stateEps = boxMullerGaussian(u1, u2, 0, 1.2);
      statePollingErrors[st.id] = Math.round((regErr + stateEps) * 100) / 100;
    });

    // DC
    if (!statePollingErrors.DC) {
      const u1 = rng();
      const u2 = rng();
      const dcEps = boxMullerGaussian(u1, u2, 0, 1.2);
      statePollingErrors.DC = Math.round(((correlatedRegionalError.Northeast || 0) + dcEps) * 100) / 100;
    }

    return {
      correlatedRegionalError,
      statePollingErrors,
    };
  }

  /**
   * REQ-205: Shy-Voter Bias.
   * Candidates possessing traits Rough or Undisciplined, or parties with platform positions > 8.5 or < 1.5,
   * poll 1.5%-3.0% lower than true turnout propensity in public surveys.
   * The hidden vote materializes only on Election Night.
   */
  function evaluateShyVoterBias(game, candidate = null, partyId = 'player') {
    const resolvedParty = (partyId === 'player' && game?.player?.custom) ? 'player' : (game?.player?.baseTemplateId || partyId);

    // Check candidate traits
    let hasShyTraits = false;
    if (candidate && Array.isArray(candidate.traits)) {
      hasShyTraits = candidate.traits.includes('Rough') || candidate.traits.includes('Undisciplined');
    }

    // Check platform positions outside mainstream (1.5 - 8.5)
    let hasExtremePlatform = false;
    const platform = game?.platform || {};
    const stances = Object.values(platform);
    if (stances.length > 0) {
      const avgStance = stances.reduce((sum, v) => sum + (Number(v) || 5), 0) / stances.length;
      if (avgStance > 8.5 || avgStance < 1.5) {
        hasExtremePlatform = true;
      }
    }

    const isShy = hasShyTraits || hasExtremePlatform;
    const pollSuppressionPct = isShy ? 2.0 : 0.0; // 1.5% - 3.0%
    const hiddenTurnoutLiftPct = isShy ? 2.0 : 0.0;

    return {
      active: isShy,
      partyId: resolvedParty,
      hasShyTraits,
      hasExtremePlatform,
      pollSuppressionPct,
      hiddenTurnoutLiftPct,
    };
  }

  /**
   * REQ-205: Late-Breaking Undecided Surge.
   * Electorate undecideds (3%-6%) break in final 7 days:
   * 65% break toward the party with higher late wave momentum / positive surprise resolution.
   */
  function resolveLateBreakingUndecidedSwing(game, options = {}) {
    const undecidedPool = options.undecidedPoolPct !== undefined ? options.undecidedPoolPct : 4.0;
    const waveMomentum = Number(game?.campaign?.waveMomentum ?? game?.waveMomentum ?? 0);
    const playerIdentity = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');

    // Party favored by late wave and October surprise
    let favoredParty = 'people';
    if (waveMomentum > 0) {
      favoredParty = playerIdentity;
    } else if (waveMomentum < 0) {
      favoredParty = (playerIdentity === 'people' ? 'heritage' : 'people');
    } else {
      favoredParty = options.favoredParty || 'people';
    }

    const breakShareFavored = 0.65;
    const breakShareRival = 0.35;
    const favoredGain = Math.round(undecidedPool * breakShareFavored * 100) / 100;
    const rivalGain = Math.round(undecidedPool * breakShareRival * 100) / 100;
    const netMarginShift = Math.round((favoredGain - rivalGain) * 100) / 100;

    return {
      undecidedPoolPct: undecidedPool,
      favoredParty,
      breakShareFavored,
      breakShareRival,
      favoredGain,
      rivalGain,
      netMarginShift,
      note: "Late-deciding suburban voters appear to be breaking decisively in the campaign's closing hours.",
    };
  }

  /**
   * REQ-210: Automatic Close-Margin Statutory Recounts.
   * When certified presidential margin in a state is <= 0.50% (or < 2,000 votes),
   * pauses certification and executes an automatic statutory recount with delta in [-0.12%, +0.12%].
   * If recount flips the state, updates Electoral College tally and triggers or resolves REQ-191 Contingent Election!
   */
  function evaluateCloseMarginRecounts(game, electionResults = {}, options = {}) {
    const presResults = electionResults.presidential || game?.lastElection?.presidential || {};
    const states = Object.keys(presResults);
    if (!states.length) {
      return { game, recounts: [], flippedStates: [], contingentElectionTriggered: false };
    }

    const seed = options.seed !== undefined ? options.seed : (game?.seed || 2028) + (game?.year || 2028) + 777;
    const rng = createPrng(seed);

    const recounts = [];
    const flippedStates = [];
    const nextPresResults = JSON.parse(JSON.stringify(presResults));
    let nextEvByParty = { ...(electionResults.evByParty || game?.lastElection?.evByParty || {}) };

    states.forEach((stId) => {
      const stData = nextPresResults[stId];
      if (!stData) return;

      const initialMargin = Number(stData.margin !== undefined ? stData.margin : stData.lead || 10.0);
      const absMargin = Math.abs(initialMargin);

      // Trigger condition: Certified margin <= 0.50%
      if (absMargin <= 0.50) {
        // Stochastic recount adjustment: delta in [-0.12%, +0.12%]
        const rawDelta = (rng() * 0.24) - 0.12;
        const recountAdjustment = options.fixedDelta !== undefined
          ? options.fixedDelta
          : Math.round(rawDelta * 1000) / 1000;

        const finalMargin = Math.round((initialMargin + recountAdjustment) * 1000) / 1000;
        const oldWinner = stData.winner;
        let newWinner = oldWinner;

        // Check if sign flipped
        if (initialMargin > 0 && finalMargin < 0) {
          newWinner = (oldWinner === 'people' ? 'heritage' : 'people');
        } else if (initialMargin < 0 && finalMargin > 0) {
          newWinner = (oldWinner === 'heritage' ? 'people' : 'heritage');
        }

        const flipped = newWinner !== oldWinner;
        const ev = Number(stData.ev || 0);

        if (flipped) {
          flippedStates.push({
            stateId: stId,
            ev,
            oldWinner,
            newWinner,
            initialMargin,
            finalMargin,
            recountAdjustment,
          });

          // Adjust Electoral College
          nextEvByParty[oldWinner] = Math.max(0, (nextEvByParty[oldWinner] || 0) - ev);
          nextEvByParty[newWinner] = (nextEvByParty[newWinner] || 0) + ev;

          stData.winner = newWinner;
          stData.margin = finalMargin;
          stData.lead = Math.abs(finalMargin);
        }

        recounts.push({
          stateId: stId,
          initialMargin,
          recountAdjustment,
          finalMargin,
          oldWinner,
          newWinner,
          flipped,
          ev,
        });
      }
    });

    // Check if Electoral College is now deadlocked / below 270 (REQ-191 Contingent Election)
    let contingentElectionTriggered = false;
    let pendingContingentElection = game?.pendingContingentElection || null;

    const maxEv = Math.max(0, ...Object.values(nextEvByParty));
    if (recounts.length > 0 && flippedStates.length > 0) {
      if (maxEv < 270) {
        contingentElectionTriggered = true;
        const Engine = getEngine();
        const tally = typeof Engine.computeHouseDelegationTally === 'function'
          ? Engine.computeHouseDelegationTally(game)
          : { totals: {} };

        const evRanked = Object.entries(nextEvByParty).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
        const playerKey = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');

        pendingContingentElection = {
          year: game?.year || 2028,
          evByParty: nextEvByParty,
          houseDelegationTally: tally,
          topThreeParties: evRanked.slice(0, 3).map(([pId, ev]) => ({ partyId: pId, ev })),
          playerEv: nextEvByParty[playerKey] || 0,
          playerDelegations: tally.totals?.[playerKey] || 0,
          resolved: false,
          triggeredByRecount: true,
        };
      } else if (maxEv >= 270 && pendingContingentElection) {
        // Recount flipped state into an outright 270+ majority!
        pendingContingentElection = null;
      }
    }

    const nextGame = {
      ...game,
      pendingContingentElection,
      electionUncertainty: {
        ...(game?.electionUncertainty || {}),
        pendingRecounts: recounts,
      },
    };

    if (flippedStates.length > 0) {
      const flipSummary = flippedStates.map((f) => `${f.stateId} (${f.ev} EV -> ${f.newWinner})`).join(', ');
      nextGame.lastNote = `Recount Certified: Automatic statutory recount flipped ${flipSummary}! ${contingentElectionTriggered ? 'Electoral deadlock triggers 12th Amendment Contingent Election!' : ''}`;
    }

    return {
      game: nextGame,
      recounts,
      flippedStates,
      evByParty: nextEvByParty,
      contingentElectionTriggered,
    };
  }

  return {
    createPrng,
    boxMullerGaussian,
    generateCorrelatedPollingError,
    evaluateShyVoterBias,
    resolveLateBreakingUndecidedSwing,
    evaluateCloseMarginRecounts,
  };
});
