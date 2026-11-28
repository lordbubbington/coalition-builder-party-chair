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
    if (Array.isArray(game?.states) && game.states.length > 0) return game.states;
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

  // Convert any race record or numeric margin to consistent GOP-positive / Dem-negative margin pts
  function extractGopMinusDemMargin(entry) {
    if (entry === null || entry === undefined) return null;
    if (typeof entry === 'number') {
      return Number.isFinite(entry) ? entry : null;
    }
    if (typeof entry !== 'object') return null;

    if (Number.isFinite(entry.gopMinusDemMargin)) {
      return Number(entry.gopMinusDemMargin);
    }

    const shareMap = entry.shares || entry.allShares || entry.slateShares || null;
    if (shareMap && typeof shareMap === 'object') {
      const dem = Number(shareMap.people ?? shareMap.dem ?? shareMap.democrat ?? 0);
      const rep = Number(shareMap.heritage ?? shareMap.rep ?? shareMap.republican ?? 0);
      const sum = dem + rep;
      if (sum > 0) return ((rep - dem) / sum) * 100;
    }

    if (entry.people !== undefined && entry.heritage !== undefined) {
      const dem = Number(entry.people || 0);
      const rep = Number(entry.heritage || 0);
      const sum = dem + rep;
      if (sum > 0) return ((rep - dem) / sum) * 100;
    }
    if (entry.dem !== undefined && entry.rep !== undefined) {
      const dem = Number(entry.dem || 0);
      const rep = Number(entry.rep || 0);
      const sum = dem + rep;
      if (sum > 0) return ((rep - dem) / sum) * 100;
    }

    if (Number.isFinite(entry.margin)) {
      const rawM = Number(entry.margin);
      if (entry.winner === 'people' && rawM > 0) return -rawM;
      if (entry.winner === 'heritage' && rawM < 0) return -rawM;
      // Engine race records default positive = Dem/People, negative = GOP/Heritage
      if (entry.raceKey || entry.officeId || entry.winner !== undefined) return -rawM;
      return rawM;
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // REQ-214: Post-Election Certified Performance Drift
  // --------------------------------------------------------------------------

  /**
   * Compares representative multi-race popular vote margin in a state with expected baseline lean.
   * Collects: Presidential (1), Senate (1), Governor (1), U.S. House avg (1),
   * State House (1), State Senate (1, skipped for NE), and Minor Statewide Offices (1 each).
   * Multi-cycle outperformance permanently shifts that state's baseline lean:
   *   deltaLean = clamp((actualMargin - expectedMargin) * 0.08, -1.5, +1.5)
   */
  function calculateCertifiedPerformanceDrift(game, electionOutcome = null) {
    if (!game) return { game, records: [] };
    const lastElection = electionOutcome || (game.elections && game.elections.length > 0 ? game.elections[game.elections.length - 1] : game.lastElection);
    if (!lastElection) return { game, records: [] };

    const records = [];
    game.statePartisanDrift = game.statePartisanDrift || {};
    const states = getStatesList(game);

    const isPresCycle = Boolean(
      lastElection.type === 'presidential'
      || lastElection.cycleType === 'presidential'
      || (lastElection.year && Number(lastElection.year) % 4 === 0)
      || (!lastElection.type && (lastElection.presidentialResults || lastElection.presidentialMargins || lastElection.presidential?.byState))
    );

    states.forEach((st) => {
      const stateId = st.id || st.stateId;
      if (!stateId) return;
      // Collect representative margins per race type (positive = GOP/Heritage, negative = Dem/People)
      const raceMargins = [];

      // 1. Presidential (1 entry if presidential cycle & state data exists)
      if (isPresCycle) {
        const presRaw = lastElection.presidentialMargins?.[stateId]
          ?? lastElection.presidentialResults?.[stateId]
          ?? lastElection.presidential?.byState?.[stateId]
          ?? (Array.isArray(lastElection.presidential?.states)
            ? lastElection.presidential.states.find((x) => (x.stateId || x.id) === stateId)
            : null);
        const presM = extractGopMinusDemMargin(presRaw);
        if (presM !== null) raceMargins.push(presM);
      }

      // 2. U.S. Senate (1 entry if contested in stateId this cycle)
      const senRaw = Array.isArray(lastElection.senate)
        ? lastElection.senate.find((r) => (r.stateId || r.state) === stateId)
        : (lastElection.senate?.[stateId] ?? lastElection.senateMargins?.[stateId]);
      const senM = extractGopMinusDemMargin(senRaw);
      if (senM !== null) raceMargins.push(senM);

      // 3. Governor (1 entry if contested in stateId this cycle)
      const govRaw = Array.isArray(lastElection.governors)
        ? lastElection.governors.find((r) => (r.stateId || r.state) === stateId)
        : (lastElection.governors?.[stateId] ?? lastElection.governorMargins?.[stateId]);
      const govM = extractGopMinusDemMargin(govRaw);
      if (govM !== null) raceMargins.push(govM);

      // 4. U.S. House (average all districts in stateId into 1 single federal House entry)
      const distList = lastElection.house?.districts
        || lastElection.houseDistricts
        || lastElection.legislature?.districts
        || lastElection.districts
        || null;
      if (Array.isArray(distList)) {
        const stDists = distList.filter((d) => (d.stateId || d.state) === stateId);
        const distMargins = stDists.map((d) => extractGopMinusDemMargin(d)).filter((m) => m !== null);
        if (distMargins.length > 0) {
          const avgHouse = distMargins.reduce((s, v) => s + v, 0) / distMargins.length;
          raceMargins.push(avgHouse);
        }
      } else {
        const houseRaw = lastElection.houseMargins?.[stateId] ?? lastElection.house?.byState?.[stateId];
        const houseM = extractGopMinusDemMargin(houseRaw);
        if (houseM !== null) raceMargins.push(houseM);
      }

      // 5. State House (1 entry)
      if (stateId !== 'DC') {
        const shRaw = lastElection.stateHouseMargins?.[stateId]
          ?? lastElection.stateHouse?.[stateId]
          ?? lastElection.stateHouseSeatCounts?.[stateId]
          ?? lastElection.stateLegislatureShares?.[stateId];
        const shM = extractGopMinusDemMargin(shRaw);
        if (shM !== null) raceMargins.push(shM);
      }

      // 6. State Senate (1 entry; skip for unicameral NE)
      if (stateId !== 'DC' && stateId !== 'NE') {
        const ssRaw = lastElection.stateSenateMargins?.[stateId]
          ?? lastElection.stateSenate?.[stateId]
          ?? lastElection.stateSenateSeatCounts?.[stateId];
        const ssM = extractGopMinusDemMargin(ssRaw);
        if (ssM !== null) raceMargins.push(ssM);
      }

      // 7. Minor Statewide Offices (1 entry per contested minor statewide race in stateId)
      const swList = Array.isArray(lastElection.statewideByState?.[stateId])
        ? lastElection.statewideByState[stateId]
        : Array.isArray(lastElection.statewide?.[stateId])
          ? lastElection.statewide[stateId]
          : Array.isArray(lastElection.statewideResults)
            ? lastElection.statewideResults.filter((r) => (r.stateId || r.state) === stateId)
            : [];
      swList.forEach((sw) => {
        const swM = extractGopMinusDemMargin(sw);
        if (swM !== null) raceMargins.push(swM);
      });

      // Fallback for legacy single-result mocks
      if (raceMargins.length === 0) {
        const fallbackRaw = lastElection.results?.[stateId] ?? lastElection.stateMargins?.[stateId];
        const fallbackM = extractGopMinusDemMargin(fallbackRaw);
        if (fallbackM !== null) raceMargins.push(fallbackM);
      }

      if (raceMargins.length === 0) return;

      const actualMargin = raceMargins.reduce((a, b) => a + b, 0) / raceMargins.length;
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
      }

      records.push({
        stateId,
        actualMargin: round(actualMargin, 4),
        expectedMargin: round(expectedMargin, 2),
        marginDiff: round(marginDiff, 2),
        deltaLean,
        newLean: st.lean,
        raceCount: raceMargins.length,
      });
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

      const trackedParties = Array.from(new Set(['people', 'heritage', ...Object.keys(stOrg || {})]));
      trackedParties.forEach((partyId) => {
        const chapters = Number(stOrg[partyId]?.chapters ?? 1);
        if (chapters >= 2) {
          game.stateChapterStreaks[stateId][partyId] = (game.stateChapterStreaks[stateId][partyId] || 0) + 1;
        } else {
          game.stateChapterStreaks[stateId][partyId] = 0;
        }

        // Check if milestone streak of 3 reached
        if (game.stateChapterStreaks[stateId][partyId] === 3) {
          if (partyId === 'people' || partyId === 'heritage') {
            const cushion = (partyId === 'people') ? -0.50 : +0.50;
            netLeanShift += cushion;
          } else {
            game.statePartyCushions = game.statePartyCushions || {};
            game.statePartyCushions[stateId] = game.statePartyCushions[stateId] || {};
            game.statePartyCushions[stateId][partyId] = clamp(
              round((game.statePartyCushions[stateId][partyId] || 0) + 0.50, 3),
              0,
              4.0
            );
          }
        }
        // [MC-BALANCE-TUNE] MC-02: Concentrated state chapter networks (>= 3 chapters) reinforce durable minor cushion
        if (chapters >= 3 && partyId !== 'people' && partyId !== 'heritage') {
          game.statePartyCushions = game.statePartyCushions || {};
          game.statePartyCushions[stateId] = game.statePartyCushions[stateId] || {};
          const chBonus = chapters >= 6 ? 0.35 : 0.20;
          game.statePartyCushions[stateId][partyId] = clamp(
            round((game.statePartyCushions[stateId][partyId] || 0) + chBonus, 3),
            0,
            5.0
          );
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

  /**
   * REQ-309: Multi-Cycle Strategic Memory & Inter-Cycle Ideological Adaptation Engine
   * Records post-election performance metrics (seats gained/lost, electoral votes, popular vote share) per party.
   */
  function recordPartyPerformanceMetrics(game, electionOutcome = null) {
    if (!game) return game;
    const election = electionOutcome || game.lastElection || (Array.isArray(game.elections) && game.elections.length ? game.elections[game.elections.length - 1] : null);
    if (!election) return game;

    const year = Number(election.year || game.year || 2028);
    const isPresidential = (year % 4 === 0);

    const memory = game.strategicMemory || {
      cycleCount: 0,
      historyByParty: {},
    };
    if (!memory.historyByParty) memory.historyByParty = {};

    const parties = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution'];
    if (game.player?.custom) parties.push('player');

    // House seats
    const sittingList = Array.isArray(game.sittingMembers) ? game.sittingMembers : [];
    const repList = Array.isArray(game.representatives) ? game.representatives : [];
    const houseList = repList.length ? repList : sittingList.filter((m) => m.office === 'house');

    // Senate seats
    const senateList = sittingList.filter((m) => m.office === 'senate');

    // State leg chambers
    const stateLegs = game.stateLegislatures || {};

    parties.forEach((pId) => {
      const pHistory = memory.historyByParty[pId] || [];
      const prevEntry = pHistory.length ? pHistory[pHistory.length - 1] : null;

      // Popular vote share
      let voteShare = 0;
      if (election.popularVotePercentage?.[pId] !== undefined) {
        voteShare = Number(election.popularVotePercentage[pId]);
      } else if (election.nationalVote?.[pId] !== undefined) {
        voteShare = Number(election.nationalVote[pId]);
      } else if (election.presidentialResults) {
        const shares = Object.values(election.presidentialResults).map((st) => Number(st?.[pId] || 0)).filter((v) => v > 0);
        voteShare = shares.length ? round(shares.reduce((a, b) => a + b, 0) / shares.length, 1) : 0;
      }

      // Electoral votes
      const ev = isPresidential ? Number(election.evByParty?.[pId] ?? (election.presidential?.evByParty?.[pId] ?? 0)) : 0;
      const wonPresidency = isPresidential && (election.presidentialWinner === pId || ev >= 270);

      // House seats
      const houseSeats = houseList.filter((r) => (r.partyId === pId || r.party === pId || r.caucus === pId)).length;
      const prevHouse = prevEntry ? prevEntry.houseSeats : houseSeats;
      const houseSeatDelta = houseSeats - prevHouse;
      const wonHouse = houseSeats >= 218;

      // Senate seats
      const senateSeats = senateList.filter((s) => (s.partyId === pId || s.party === pId || s.caucus === pId)).length;
      const prevSenate = prevEntry ? prevEntry.senateSeats : senateSeats;
      const senateSeatDelta = senateSeats - prevSenate;
      const wonSenate = senateSeats >= 50;

      // State leg chambers
      let stateLegChambers = 0;
      Object.values(stateLegs).forEach((chambers) => {
        if (Array.isArray(chambers) && chambers.includes(pId)) stateLegChambers++;
      });
      if (game.stateHouseSeatCounts) {
        const heldStates = Object.keys(game.stateHouseSeatCounts).filter((s) => (game.stateHouseSeatCounts[s]?.[pId] || 0) > 0).length;
        stateLegChambers = Math.max(stateLegChambers, heldStates);
      }

      const entry = {
        year,
        cycleType: isPresidential ? 'presidential' : 'midterm',
        popularVoteShare: round(voteShare, 1),
        electoralVotes: ev,
        wonPresidency,
        houseSeats,
        houseSeatDelta,
        wonHouse,
        senateSeats,
        senateSeatDelta,
        wonSenate,
        stateLegChambers,
        timestamp: Date.now(),
      };

      const filtered = pHistory.filter((h) => h.year !== year);
      filtered.push(entry);
      memory.historyByParty[pId] = filtered;
    });

    memory.cycleCount = (memory.cycleCount || 0) + 1;
    game.strategicMemory = memory;
    return game;
  }

  /**
   * REQ-309: Inter-Cycle Ideological Adaptation Engine
   * Evaluates performance history at cycle boundary (2030, 2032+) and adapts party strategy profiles and faction standing.
   */
  function adaptPartyIdeologicalPersonas(game) {
    if (!game) return game;
    const memory = game.strategicMemory;
    if (!memory || !memory.historyByParty) return game;

    const dataProfiles = (typeof window !== 'undefined' && window.PartyChairData?.DEFAULT_STRATEGY_PROFILES)
      || (typeof global !== 'undefined' && global.PartyChairData?.DEFAULT_STRATEGY_PROFILES)
      || {};

    const parties = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution'];
    if (game.player?.custom) parties.push('player');

    parties.forEach((pId) => {
      const pHistory = memory.historyByParty[pId];
      if (!Array.isArray(pHistory) || !pHistory.length) return;

      const latest = pHistory[pHistory.length - 1];
      const prev = pHistory.length > 1 ? pHistory[pHistory.length - 2] : null;

      const partyState = game.parties?.[pId];
      const curProfile = partyState?.strategyProfile || { ...(dataProfiles[pId] || dataProfiles.default || {}) };

      // Determine loss / win condition
      const isMajor = ['people', 'heritage'].includes(pId);
      const lostPresidency = latest.cycleType === 'presidential' && !latest.wonPresidency;
      const lostHouseSeats = latest.houseSeatDelta < 0;
      const lostSevereHouse = latest.houseSeatDelta <= -8;
      const lostVoteShare = prev ? (latest.popularVoteShare < prev.popularVoteShare) : false;

      const isLosingParty = isMajor
        ? (lostSevereHouse || (lostPresidency && lostHouseSeats))
        : (lostVoteShare || (latest.stateLegChambers < (prev?.stateLegChambers || 0)));

      const isWinningParty = isMajor
        ? (latest.wonPresidency || (!lostPresidency && latest.houseSeatDelta >= 5))
        : (!lostVoteShare && latest.popularVoteShare >= 3.0);

      // Faction reshuffling & confidence shift
      const catalog = (game.factions && game.factions.length) ? game.factions : [];
      const partyFactions = catalog.filter((f) => f.partyId === pId);

      if (isLosingParty) {
        // Faction Reshuffle: Establishment loses standing (-5 to -8), insurgent base agitates
        partyFactions.forEach((f) => {
          const isEst = f.id.includes('establishment') || f.name.toLowerCase().includes('establishment') || f.name.toLowerCase().includes('moderate');
          const delta = isEst ? -6 : -2;
          if (game.factionHappiness?.[f.id] !== undefined) {
            game.factionHappiness[f.id] = clamp(round(game.factionHappiness[f.id] + delta, 1), 10, 100);
          }
          if (partyState?.factionHappiness?.[f.id] !== undefined) {
            partyState.factionHappiness[f.id] = clamp(round(partyState.factionHappiness[f.id] + delta, 1), 10, 100);
          }
          if (game.factionConfidence?.[f.id] !== undefined) {
            game.factionConfidence[f.id] = clamp(round(game.factionConfidence[f.id] + delta, 1), 10, 100);
          }
        });

        // Strategic Profile Adaptation
        if (pId === 'heritage') {
          curProfile.ruthlessness = clamp(round((curProfile.ruthlessness || 0.85) + 0.05, 2), 0.50, 0.95);
          curProfile.negativeAdPropensity = clamp(round((curProfile.negativeAdPropensity || 0.80) + 0.05, 2), 0.40, 0.95);
          curProfile.primaryInterventionism = clamp(round((curProfile.primaryInterventionism || 0.80) + 0.03, 2), 0.50, 0.95);
        } else if (pId === 'people') {
          curProfile.factionRiskAversion = clamp(round((curProfile.factionRiskAversion || 0.85) + 0.05, 2), 0.50, 0.95);
          if (lostVoteShare) {
            curProfile.primaryInterventionism = clamp(round((curProfile.primaryInterventionism || 0.35) + 0.05, 2), 0.20, 0.65);
          } else {
            curProfile.ideologicalRigidity = clamp(round((curProfile.ideologicalRigidity || 0.45) - 0.05, 2), 0.20, 0.60);
          }
        } else if (pId === 'green' || pId === 'socialist') {
          curProfile.ideologicalRigidity = clamp(round((curProfile.ideologicalRigidity || 0.95) + 0.02, 2), 0.80, 0.98);
          curProfile.primaryInterventionism = clamp(round((curProfile.primaryInterventionism || 0.92) + 0.02, 2), 0.80, 0.98);
        } else if (pId === 'constitution') {
          curProfile.geographicConcentration = clamp(round((curProfile.geographicConcentration || 0.85) + 0.02, 2), 0.60, 0.95);
        }

      } else if (isWinningParty) {
        // Establishment consolidation: +4 to +6 confidence
        partyFactions.forEach((f) => {
          const isEst = f.id.includes('establishment') || f.name.toLowerCase().includes('establishment');
          const delta = isEst ? 5 : 2;
          if (game.factionHappiness?.[f.id] !== undefined) {
            game.factionHappiness[f.id] = clamp(round(game.factionHappiness[f.id] + delta, 1), 10, 100);
          }
          if (partyState?.factionHappiness?.[f.id] !== undefined) {
            partyState.factionHappiness[f.id] = clamp(round(partyState.factionHappiness[f.id] + delta, 1), 10, 100);
          }
          if (game.factionConfidence?.[f.id] !== undefined) {
            game.factionConfidence[f.id] = clamp(round(game.factionConfidence[f.id] + delta, 1), 10, 100);
          }
        });

        curProfile.factionRiskAversion = clamp(round((curProfile.factionRiskAversion || 0.50) * 0.95 + 0.02, 2), 0.15, 0.85);
      }

      // CRITICAL INVARIANT: Libertarian Party (liberty) primary interventionism MUST be strictly 0.00
      if (pId === 'liberty') {
        curProfile.primaryInterventionism = 0.00;
      }

      if (partyState) {
        partyState.strategyProfile = curProfile;
      }
    });

    return game;
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
    recordPartyPerformanceMetrics,
    adaptPartyIdeologicalPersonas,
    SUN_BELT_STATES,
    RUST_BELT_STATES,
    MOUNTAIN_WEST_STATES,
  };
});
