/**
 * Coalition Builder: Party Chair — Version 0.16.1
 * election-drift.js: Multi-Cycle State Drift, Organizing Feedback, Factional Autopsy & Softmax Multi-Party Curves
 *
 * Requirements:
 *  - REQ-214: Post-Election Certified Performance Drift (Multi-cycle outperformance shifts baseline lean)
 *  - REQ-215: Multi-Cycle Demographic & Migration Drift (Sun Belt, Rust Belt, Mountain West quadrennial drift)
 *  - REQ-216: Organizing & Registration Footprint Feedback (Every +25k net voters shifts lean +0.35 pts; 3-cycle chapter +0.50 cushion)
 *  - REQ-217: Post-Election Factional Autopsy Realignment (Landslide victory expands wing +6% to +10%; defeat contracts establishment -12%)
 *  - REQ-218: Non-Linear Multi-Party Swing Split Curves (Softmax utility curves across qualified tickets)
 *  - REQ-219: Dynamic Third-Party Appeal Elasticity & Tier-Scaled Favorability Caps (Duopoly Dissatisfaction > 55 triggers surge)
 */

(function (root, factory) {
  const api = factory();
  if (typeof window !== 'undefined') {
    window.ElectionDrift = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ElectionDrift = api;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function round(val, decimals = 3) {
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  function getData() {
    return (typeof window !== 'undefined' && window.PartyChairData)
      ? window.PartyChairData
      : (typeof global !== 'undefined' && global.PartyChairData)
        ? global.PartyChairData
        : {};
  }

  function getStatesList(game) {
    const data = getData();
    return (data.STATES || (typeof STATES !== 'undefined' ? STATES : []));
  }

  function getStateObjectFromModel(vm, stateId) {
    if (!vm || !vm.states) return null;
    if (Array.isArray(vm.states)) {
      return vm.states.find((s) => s.stateId === stateId || s.id === stateId) || null;
    }
    return vm.states[stateId] || null;
  }

  // --------------------------------------------------------------------------
  // REQ-214: Post-Election Certified Performance Drift
  // --------------------------------------------------------------------------

  /**
   * Compares certified actual popular vote margin in a state with expected baseline lean.
   * Multi-cycle outperformance permanently shifts that state's baseline lean:
   *   deltaLean = clamp((actualMargin - expectedMargin) * 0.08, -1.5, +1.5)
   * Also supports clamping to [-0.75, +0.75] when divided by 8.
   */
  function calculateCertifiedPerformanceDrift(game, electionOutcome = null) {
    if (!game) return { game, records: [] };
    const lastElection = electionOutcome || (game.elections && game.elections.length > 0 ? game.elections[game.elections.length - 1] : null);
    if (!lastElection) return { game, records: [] };

    const records = [];
    game.statePartisanDrift = game.statePartisanDrift || {};
    const states = getStatesList(game);

    states.forEach((st) => {
      const stateId = st.id;
      // Obtain actual margin in state (presidential, senate, or composite)
      // Positive margin = GOP / Heritage overperformance; Negative = Dem / People overperformance
      let actualMargin = 0;
      let hasData = false;

      if (lastElection.results && lastElection.results[stateId]) {
        const res = lastElection.results[stateId];
        const demVotes = Number(res.people ?? res.dem ?? res.democrat ?? 0);
        const repVotes = Number(res.heritage ?? res.rep ?? res.republican ?? 0);
        const total = demVotes + repVotes || 1;
        actualMargin = ((repVotes - demVotes) / total) * 100;
        hasData = true;
      } else if (lastElection.presidentialMargins && lastElection.presidentialMargins[stateId] !== undefined) {
        actualMargin = Number(lastElection.presidentialMargins[stateId]);
        hasData = true;
      } else if (lastElection.stateMargins && lastElection.stateMargins[stateId] !== undefined) {
        actualMargin = Number(lastElection.stateMargins[stateId]);
        hasData = true;
      }

      if (!hasData) return;

      // Expected margin based on state baseline lean and national environment
      const currentLean = Number(st.lean ?? 0);
      const expectedMargin = currentLean * 25.0; // Baseline lean scale to margin pts

      const marginDiff = actualMargin - expectedMargin;
      // Formula: clamp(marginDiff * 0.08, -1.5, +1.5)
      const deltaLean = round(clamp(marginDiff * 0.08, -1.5, +1.5), 3);

      if (Math.abs(deltaLean) >= 0.01) {
        // Apply drift
        st.lean = round(currentLean + deltaLean, 3);
        const vmSt = getStateObjectFromModel(game.voterModel, stateId);
        if (vmSt) vmSt.lean = st.lean;
        game.statePartisanDrift[stateId] = round((game.statePartisanDrift[stateId] || 0) + deltaLean, 3);

        records.push({
          stateId,
          actualMargin: round(actualMargin, 2),
          expectedMargin: round(expectedMargin, 2),
          marginDiff: round(marginDiff, 2),
          deltaLean,
          newLean: st.lean,
        });
      }
    });

    return { game, records };
  }

  // --------------------------------------------------------------------------
  // REQ-215: Multi-Cycle Demographic & Migration Drift
  // --------------------------------------------------------------------------

  // Regional definitions per REQ-215
  const SUN_BELT_STATES = ['AZ', 'NV', 'GA', 'NC', 'TX', 'FL'];
  const RUST_BELT_STATES = ['OH', 'MI', 'WI', 'PA'];
  const MOUNTAIN_WEST_STATES = ['CO', 'UT', 'MT', 'ID'];

  /**
   * Applies quadrennial macro demographic shifts:
   *  - Sun Belt Boom: rapid suburban diversification -> -0.35 pts toward Dem / progressive
   *  - Rust Belt Realignment: blue-collar cultural shift -> +0.35 pts toward GOP / conservative
   *  - Mountain West Metro Growth: urban professional sorting -> -0.30 pts toward Dem / progressive
   */
  function applyDemographicMigrationDrift(game) {
    if (!game) return { game, records: [] };
    const records = [];
    game.demographicMigrationDrift = game.demographicMigrationDrift || {};
    const states = getStatesList(game);

    states.forEach((st) => {
      const stateId = st.id;
      let delta = 0;
      let trendLabel = '';

      if (SUN_BELT_STATES.includes(stateId)) {
        delta = -0.35; // Diversifying suburbs trending bluer
        trendLabel = 'Sun Belt Suburban Diversification';
      } else if (RUST_BELT_STATES.includes(stateId)) {
        delta = +0.35; // Blue-collar industrial realignment trending redder
        trendLabel = 'Rust Belt Industrial Realignment';
      } else if (MOUNTAIN_WEST_STATES.includes(stateId)) {
        delta = -0.30; // Mountain Metro urban-professional sorting
        trendLabel = 'Mountain West Metro Growth';
      }

      if (delta !== 0) {
        const curLean = Number(st.lean ?? 0);
        st.lean = round(curLean + delta, 3);
        const vmSt = getStateObjectFromModel(game.voterModel, stateId);
        if (vmSt) vmSt.lean = st.lean;
        game.demographicMigrationDrift[stateId] = round((game.demographicMigrationDrift[stateId] || 0) + delta, 3);

        records.push({
          stateId,
          trendLabel,
          delta,
          newLean: st.lean,
        });
      }
    });

    return { game, records };
  }

  // --------------------------------------------------------------------------
  // REQ-216: Organizing & Registration Footprint Feedback
  // --------------------------------------------------------------------------

  /**
   * Connects micro fieldcraft (registration gains & state chapters) to macro leans:
   *  - Every net +25,000 registered voters added shifts state baseline partisan lean by +0.35 pts towards that party
   *    (Dem gains shift lean by -0.35, GOP gains shift lean by +0.35)
   *  - Active Tier 2+ State Chapter for 3+ consecutive cycles grants +0.50 baseline defense cushion
   */
  function applyOrganizingFootprintFeedback(game) {
    if (!game) return { game, records: [] };
    const records = [];
    game.organizingFootprintDrift = game.organizingFootprintDrift || {};
    game.stateChapterStreaks = game.stateChapterStreaks || {};
    const states = getStatesList(game);
    const vm = game.voterModel;

    states.forEach((st) => {
      const stateId = st.id;
      let netLeanShift = 0;

      // 1. Evaluate net registered voters added from stateDeltas
      const deltas = vm?.stateDeltas?.[stateId] || {};
      const demAdded = Number(deltas.people ?? deltas.dem ?? (game.player?.baseTemplateId === 'people' ? deltas.player : 0) ?? 0);
      const repAdded = Number(deltas.heritage ?? deltas.rep ?? (game.player?.baseTemplateId === 'heritage' ? deltas.player : 0) ?? 0);

      // +25,000 net voters = 0.35 pts
      if (demAdded > 0) {
        const demShift = (demAdded / 25000) * 0.35;
        netLeanShift -= demShift; // Bluer
      }
      if (repAdded > 0) {
        const repShift = (repAdded / 25000) * 0.35;
        netLeanShift += repShift; // Redder
      }

      // 2. State Chapter 3-cycle streak cushion (+0.50 pts defense)
      const stOrg = game.stateOrganizations?.[stateId] || {};
      game.stateChapterStreaks[stateId] = game.stateChapterStreaks[stateId] || { people: 0, heritage: 0, player: 0 };

      ['people', 'heritage'].forEach((partyId) => {
        const chapters = Number(stOrg[partyId]?.chapters ?? 1);
        if (chapters >= 2) {
          game.stateChapterStreaks[stateId][partyId] = (game.stateChapterStreaks[stateId][partyId] || 0) + 1;
        } else {
          game.stateChapterStreaks[stateId][partyId] = 0;
        }

        // Check if milestone streak of 3 reached
        if (game.stateChapterStreaks[stateId][partyId] === 3) {
          const cushion = (partyId === 'people') ? -0.50 : +0.50;
          netLeanShift += cushion;
        }
      });

      if (Math.abs(netLeanShift) >= 0.001) {
        const curLean = Number(st.lean ?? 0);
        st.lean = round(curLean + netLeanShift, 3);
        const vmSt = getStateObjectFromModel(vm, stateId);
        if (vmSt) vmSt.lean = st.lean;
        game.organizingFootprintDrift[stateId] = round((game.organizingFootprintDrift[stateId] || 0) + netLeanShift, 3);

        records.push({
          stateId,
          demAdded,
          repAdded,
          netLeanShift: round(netLeanShift, 3),
          newLean: st.lean,
        });
      }
    });

    return { game, records };
  }

  // --------------------------------------------------------------------------
  // REQ-217: Post-Election Factional Autopsy Realignment
  // --------------------------------------------------------------------------

  /**
   * Realigns internal faction voter power post-election based on autopsy verdict:
   *  - Landslide Victory (>= 54% popular vote or White House win):
   *    Candidate's wing expands by +6% to +10% (default +8%), losing factions shrink proportionally.
   *  - Crushing Defeat (< 46% popular vote or White House loss):
   *    Establishment factions suffer "Failed Establishment" exodus (-12% voter share), transferring to insurgent factions.
   *  - Invariant: Conserves 155M represented scale and total party voters exactly (Delta total = 0).
   */
  function applyPostElectionFactionAutopsy(game, electionOutcome = null) {
    if (!game || !game.voterModel) return { game, autopsyVerdict: 'Status Quo', voterShiftCount: 0 };
    const vm = game.voterModel;
    const lastElection = electionOutcome || (game.elections && game.elections.length > 0 ? game.elections[game.elections.length - 1] : null);
    if (!lastElection) return { game, autopsyVerdict: 'No Election', voterShiftCount: 0 };

    // Determine popular vote share of the player's party
    const playerParty = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
    let playerVoteShare = 50.0;
    let wonWhiteHouse = false;

    if (lastElection.nationalVote) {
      playerVoteShare = Number(lastElection.nationalVote[playerParty] ?? lastElection.nationalVote.player ?? 50.0);
    } else if (lastElection.popularVotePercentage) {
      playerVoteShare = Number(lastElection.popularVotePercentage[playerParty] ?? 50.0);
    }

    if (lastElection.presidentialWinner) {
      wonWhiteHouse = (lastElection.presidentialWinner === playerParty || lastElection.presidentialWinner === 'player');
    }

    let verdict = 'Standard Cycle Turnover';
    let shiftPercent = 0;
    let isLandslide = (playerVoteShare >= 54.0 || wonWhiteHouse);
    let isCrushingLoss = (playerVoteShare < 46.0 && !wonWhiteHouse);

    if (isLandslide) {
      verdict = 'Landslide Mandate Wing Expansion';
      shiftPercent = 0.08; // +8% expansion
    } else if (isCrushingLoss) {
      verdict = 'Failed Establishment Exodus Realignment';
      shiftPercent = -0.12; // -12% establishment contraction
    } else {
      return { game, autopsyVerdict: verdict, voterShiftCount: 0 };
    }

    // Identify candidate's aligned faction vs establishment/rival factions
    const catalog = (game.factions && game.factions.length) ? game.factions : [];
    const partyFactions = catalog.filter((f) => f.partyId === playerParty);
    if (partyFactions.length < 2) {
      return { game, autopsyVerdict: verdict, voterShiftCount: 0 };
    }

    // Determine target gaining faction and donor losing factions
    let gainingFactionId = null;
    let donorFactionIds = [];

    if (isLandslide) {
      // Find candidate wing or leading faction
      const nom = game.presidentialTicket?.playerNominee || game.candidates?.[0];
      const nomFaction = nom?.factionId || nom?.faction;
      const matched = partyFactions.find((f) => f.id === nomFaction || f.name === nomFaction);
      gainingFactionId = matched ? matched.id : partyFactions[0].id;
      donorFactionIds = partyFactions.filter((f) => f.id !== gainingFactionId).map((f) => f.id);
    } else {
      // Crushing loss: establishment loses to insurgent/base factions
      const establishment = partyFactions.find((f) => f.id.includes('establishment') || f.name.toLowerCase().includes('establishment')) || partyFactions[0];
      const insurgents = partyFactions.filter((f) => f.id !== establishment.id);
      donorFactionIds = [establishment.id];
      gainingFactionId = insurgents[0]?.id || partyFactions[1].id;
    }

    let totalVotersShifted = 0;

    // Apply voter shift per state to conserve exact state voter count and 155M national invariant
    const states = getStatesList(game);
    states.forEach((st) => {
      const stateObj = getStateObjectFromModel(vm, st.id);
      if (!stateObj || !stateObj.factions) return;

      if (isLandslide) {
        // Shift a percentage from donor factions into gaining faction
        let stateShiftPool = 0;
        donorFactionIds.forEach((donorId) => {
          const donorVoters = stateObj.factions[donorId] || 0;
          const shiftFromDonor = Math.round(donorVoters * shiftPercent);
          stateObj.factions[donorId] = Math.max(0, donorVoters - shiftFromDonor);
          stateShiftPool += shiftFromDonor;
        });
        stateObj.factions[gainingFactionId] = (stateObj.factions[gainingFactionId] || 0) + stateShiftPool;
        totalVotersShifted += stateShiftPool;
      } else {
        // Failed establishment: transfer 12% from establishment to insurgent faction
        const donorId = donorFactionIds[0];
        const donorVoters = stateObj.factions[donorId] || 0;
        const shiftFromDonor = Math.round(donorVoters * Math.abs(shiftPercent));
        stateObj.factions[donorId] = Math.max(0, donorVoters - shiftFromDonor);
        stateObj.factions[gainingFactionId] = (stateObj.factions[gainingFactionId] || 0) + shiftFromDonor;
        totalVotersShifted += shiftFromDonor;
      }
    });

    // Recompute national totals in vm.factions
    if (vm.factions) {
      partyFactions.forEach((f) => {
        let nationalTotal = 0;
        states.forEach((st) => {
          const sObj = getStateObjectFromModel(vm, st.id);
          if (sObj?.factions) {
            nationalTotal += (sObj.factions[f.id] || 0);
          }
        });
        vm.factions[f.id] = nationalTotal;
        if (f.name) vm.factions[f.name] = nationalTotal;
      });
    }

    return {
      game,
      autopsyVerdict: verdict,
      gainingFactionId,
      donorFactionIds,
      voterShiftCount: totalVotersShifted,
    };
  }

  // --------------------------------------------------------------------------
  // REQ-218: Non-Linear Multi-Party Swing Split Curves (Softmax Utility)
  // --------------------------------------------------------------------------

  /**
   * Calculates non-linear swing voter distribution across qualified candidates
   * using a softmax utility formula based on policy stance distance, approval, and spend:
   *   U(i, p) = -alpha * ||Stance_p - Stance_i||_2 + beta * Approval_p + gamma * TriageSpend_p
   *   P(p | i) = exp(U(i, p)) / sum_k(exp(U(i, k)))
   */
  function computeMultiPartySoftmaxShares(game, stateId, raceKey, candidates = []) {
    if (!candidates || candidates.length === 0) return {};
    if (candidates.length === 1) return { [candidates[0].id || 'cand_0']: 1.0 };

    const alpha = 0.35; // Policy distance penalty
    const beta = 0.04;  // Candidate/party approval weight
    const gamma = 0.0000001; // Campaign spend weight

    // Swing voter ideal stance (center / pragmatic baseline)
    const swingIdealStance = {
      economic: 5.0,
      social: 5.0,
      governance: 5.0,
    };

    // Calculate utility for each candidate
    const utilities = candidates.map((c) => {
      const cId = c.id || c.partyId || 'unknown';
      const stances = c.stances || c.platform || {};
      const econ = Number(stances.economic ?? stances.tax ?? 5.0);
      const soc = Number(stances.social ?? stances.culture ?? 5.0);
      const gov = Number(stances.governance ?? stances.reform ?? 5.0);

      // Euclidean policy distance
      const dist = Math.sqrt(
        Math.pow(econ - swingIdealStance.economic, 2) +
        Math.pow(soc - swingIdealStance.social, 2) +
        Math.pow(gov - swingIdealStance.governance, 2)
      );

      const approval = Number(c.approval ?? c.popularity ?? 50.0);
      const spend = Number(c.spend ?? c.funding ?? 0);

      const u = -alpha * dist + beta * (approval - 50.0) + gamma * spend;
      return { id: cId, utility: u };
    });

    // Softmax calculation with numerical stability (subtract max utility)
    const maxU = Math.max(...utilities.map((u) => u.utility));
    const expVals = utilities.map((u) => ({ id: u.id, exp: Math.exp(u.utility - maxU) }));
    const sumExp = expVals.reduce((acc, v) => acc + v.exp, 0) || 1.0;

    const shares = {};
    expVals.forEach((v) => {
      shares[v.id] = round(v.exp / sumExp, 4);
    });

    return shares;
  }

  // --------------------------------------------------------------------------
  // REQ-219: Dynamic Third-Party Appeal Elasticity & Tier-Scaled Favorability Caps
  // --------------------------------------------------------------------------

  /**
   * Calculates national Duopoly Dissatisfaction Index:
   *   Dissatisfaction = max(0, (100 - (Approval_Dem + Approval_GOP)) / 2)
   */
  function computeDuopolyDissatisfaction(game) {
    if (!game) return 25.0;
    const approvals = game.partyApprovals || {};
    const demApp = Number(approvals.people?.approval ?? approvals.dem?.approval ?? 46.0);
    const repApp = Number(approvals.heritage?.approval ?? approvals.rep?.approval ?? 45.0);

    const index = Math.max(0, (100 - (demApp + repApp)) / 2);
    return round(index, 1);
  }

  /**
   * Evaluates third-party elasticity surge:
   *  - When Dissatisfaction > 55:
   *    - Multiplies third-party appeal by 1.8x to 2.8x
   *    - Lowers Duverger strategic defection threshold from 16.5% to 12.0%
   */
  function evaluateThirdPartyElasticitySurge(game) {
    const diss = computeDuopolyDissatisfaction(game);
    const surgeActive = diss > 55.0;

    let elasticityMultiplier = 1.0;
    let duvergerThreshold = 16.5;

    if (surgeActive) {
      // Scale from 1.8x at 55 to 2.8x at 75+
      const excess = Math.min(20.0, diss - 55.0);
      elasticityMultiplier = round(1.8 + (excess / 20.0) * 1.0, 2);
      duvergerThreshold = 12.0;
    }

    return {
      dissatisfactionIndex: diss,
      surgeActive,
      elasticityMultiplier,
      duvergerThreshold,
    };
  }

  /**
   * REQ-219: Tier-Scaled Favorability Caps
   * Returns the maximum allowed Unified Party Approval based on Institutional Tier (REQ-176):
   *  - Tier 1 (Fringe): 5.0%
   *  - Tier 2 (Ballot-Qualified Minor): 10.0%
   *  - Tier 3 (Federally Recognized Party): 18.0%
   *  - Tier 4 (Debate-Qualified Contender): 25.0%
   *  - Tier 5 (Major Party Status): Uncapped (100.0%)
   */
  function getTierScaledFavorabilityCap(tier = 1) {
    const t = clamp(Math.round(Number(tier) || 1), 1, 5);
    switch (t) {
      case 1: return 5.0;
      case 2: return 10.0;
      case 3: return 18.0;
      case 4: return 25.0;
      case 5:
      default:
        return 100.0; // Uncapped
    }
  }

  /**
   * Applies the tier-scaled cap to a raw approval score.
   */
  function applyTierScaledApprovalCap(approval, tier = 1) {
    const cap = getTierScaledFavorabilityCap(tier);
    const app = Number(approval) || 0.1;
    if (tier >= 5) {
      return clamp(round(app, 1), 8.0, 92.0); // Standard major-party range
    }
    return clamp(round(app, 1), 0.1, cap);
  }

  return {
    calculateCertifiedPerformanceDrift,
    applyDemographicMigrationDrift,
    applyOrganizingFootprintFeedback,
    applyPostElectionFactionAutopsy,
    computeMultiPartySoftmaxShares,
    computeDuopolyDissatisfaction,
    evaluateThirdPartyElasticitySurge,
    getTierScaledFavorabilityCap,
    applyTierScaledApprovalCap,
    SUN_BELT_STATES,
    RUST_BELT_STATES,
    MOUNTAIN_WEST_STATES,
  };
});
