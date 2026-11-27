/**
 * Coalition Builder: Party Chair — State Voting Reforms & Presidential EV Allocation Core
 * Exposes window.VotingReformsCore (browser) and module.exports (Node tests).
 */
(function (root) {
  'use strict';

  const DEFAULT_IDEOLOGY_AXES = {
    socialist:    { econ: 1.2, soc: 1.8 },
    green:        { econ: 2.0, soc: 1.6 },
    people:       { econ: 3.2, soc: 2.8 },
    independent:  { econ: 5.0, soc: 5.0 },
    player:       { econ: 5.0, soc: 5.0 },
    liberty:      { econ: 7.8, soc: 2.5 },
    heritage:     { econ: 7.5, soc: 7.5 },
    constitution: { econ: 8.2, soc: 9.2 },
  };

  const ANTI_SPOILER_SYSTEMS = new Set([
    'rcv',
    'approval',
    'proportional',
    'open_list_proportional',
    'stv',
    'mmp',
  ]);

  const PROPORTIONAL_SYSTEMS = new Set([
    'proportional',
    'open_list_proportional',
    'stv',
    'mmp',
  ]);

  function normalizeSystemName(rawName, fallback = 'plurality') {
    const s = String(rawName || '').trim().toLowerCase().replace(/-/g, '_');
    if (!s || s === 'fptp' || s === 'plurality' || s === 'winner_take_all') return 'plurality';
    if (s === 'rcv' || s === 'ranked_choice' || s === 'irv') return 'rcv';
    if (s === 'approval' || s === 'approval_voting') return 'approval';
    if (s === 'open_list_proportional' || s === 'open_list_pr') return 'open_list_proportional';
    if (s === 'proportional' || s === 'pr' || s === 'proportional_representation') return 'proportional';
    if (s === 'stv' || s === 'single_transferable_vote') return 'stv';
    if (s === 'mmp' || s === 'mixed_member_proportional') return 'mmp';
    return fallback;
  }

  function normalizeEvRuleName(rawRule, stateId = '') {
    const defaultRule = (stateId === 'ME' || stateId === 'NE') ? 'district_split' : 'winner_take_all';
    if (!rawRule) return defaultRule;
    const s = String(rawRule).trim().toLowerCase().replace(/-/g, '_');
    if (s === 'district_split' || s === 'district' || s === 'maine_nebraska' || s === 'split') {
      return 'district_split';
    }
    if (s === 'proportional_ev' || s === 'proportional' || s === 'prop') {
      return 'proportional_ev';
    }
    if (s === 'winner_take_all' || s === 'wta' || s === 'plurality') {
      return 'winner_take_all';
    }
    return defaultRule;
  }

  /**
   * Normalizes raw state electoral reform settings and derives anti-spoiler/PR flags.
   */
  function normalizeStateElectoralSystemRecord(stateId, rawRec, globalMmp = false) {
    const defaultAll = stateId === 'AK' ? 'rcv' : 'plurality';
    let allRacesRaw = defaultAll;
    let legislativeRaw = 'plurality';
    let evRuleRaw = null;
    let autoVoterRegistration = false;

    if (typeof rawRec === 'string') {
      allRacesRaw = rawRec;
    } else if (rawRec && typeof rawRec === 'object') {
      allRacesRaw = rawRec.allRaces || rawRec.general || rawRec.system || defaultAll;
      legislativeRaw = rawRec.legislative || rawRec.stateLeg || rawRec.legislature || 'plurality';
      evRuleRaw = rawRec.presidentialEvRule || rawRec.evRule || rawRec.presidential || null;
      autoVoterRegistration = Boolean(rawRec.autoVoterRegistration);
    }

    const allRaces = normalizeSystemName(allRacesRaw, defaultAll);
    const legislative = normalizeSystemName(legislativeRaw, 'plurality');
    const presidentialEvRule = normalizeEvRuleName(evRuleRaw, stateId);
    const effectiveSystem = globalMmp
      ? 'mmp'
      : (PROPORTIONAL_SYSTEMS.has(legislative) ? legislative : allRaces);

    const isProportional = Boolean(
      globalMmp
      || PROPORTIONAL_SYSTEMS.has(allRaces)
      || PROPORTIONAL_SYSTEMS.has(legislative)
    );
    const isAntiSpoiler = Boolean(
      isProportional
      || ANTI_SPOILER_SYSTEMS.has(allRaces)
      || ANTI_SPOILER_SYSTEMS.has(legislative)
    );

    return {
      stateId: stateId || null,
      allRaces,
      legislative,
      presidentialEvRule,
      effectiveSystem,
      isAntiSpoiler,
      isProportional,
      globalMmp: Boolean(globalMmp),
      autoVoterRegistration,
    };
  }

  function normalizeVotesTo100(partyVotes) {
    const out = {};
    const entries = Object.entries(partyVotes || {})
      .map(([k, v]) => [k, Math.max(0, Number(v) || 0)])
      .filter(([, v]) => v > 0);
    const sum = entries.reduce((acc, [, v]) => acc + v, 0);
    if (sum <= 0) return out;
    entries.forEach(([k, v]) => {
      out[k] = (v / sum) * 100;
    });
    return out;
  }

  /**
   * Allocates exact integer seats/EVs summing strictly to totalCount using Largest Remainder (Hamilton).
   */
  function allocateLargestRemainder(weightsByParty, totalCount) {
    const n = Math.max(0, Math.round(Number(totalCount) || 0));
    const result = {};
    if (n === 0) return result;
    const entries = Object.entries(weightsByParty || {})
      .map(([k, v]) => [k, Math.max(0, Number(v) || 0)])
      .filter(([, v]) => v > 0);
    if (!entries.length) return result;

    const totalWeight = entries.reduce((acc, [, v]) => acc + v, 0);
    if (totalWeight <= 0) return result;

    let allocated = 0;
    const rows = entries.map(([party, w]) => {
      const exact = (w / totalWeight) * n;
      const base = Math.floor(exact);
      allocated += base;
      return { party, weight: w, remainder: exact - base };
    });
    rows.forEach((r) => {
      const exact = (r.weight / totalWeight) * n;
      result[r.party] = Math.floor(exact);
    });
    rows.sort((a, b) => (b.remainder - a.remainder) || (b.weight - a.weight) || a.party.localeCompare(b.party));
    let idx = 0;
    while (allocated < n && rows.length > 0) {
      result[rows[idx % rows.length].party] += 1;
      allocated += 1;
      idx += 1;
    }
    return result;
  }

  function getPartyIdeologyCoords(partyId, options = {}) {
    const custom = options?.ideologyMap?.[partyId];
    if (custom && typeof custom === 'object') {
      return {
        econ: Number(custom.econ ?? custom.economic ?? 5.0),
        soc: Number(custom.soc ?? custom.social ?? 5.0),
      };
    }
    return DEFAULT_IDEOLOGY_AXES[partyId] || { econ: 5.0, soc: 5.0 };
  }

  function findClosestRemainingParty(eliminatedParty, remainingParties, options = {}) {
    if (!remainingParties.length) return null;
    if (options?.transferPreferences?.[eliminatedParty]) {
      const prefList = options.transferPreferences[eliminatedParty];
      const hit = prefList.find((pid) => remainingParties.includes(pid));
      if (hit) return hit;
    }
    const src = getPartyIdeologyCoords(eliminatedParty, options);
    let bestParty = remainingParties[0];
    let bestDist = Infinity;
    remainingParties.forEach((pid) => {
      const dst = getPartyIdeologyCoords(pid, options);
      const dist = Math.hypot(src.econ - dst.econ, src.soc - dst.soc);
      if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && pid.localeCompare(bestParty) < 0)) {
        bestDist = dist;
        bestParty = pid;
      }
    });
    return bestParty;
  }

  /**
   * Splits totalSeats into balanced 3- to 5-seat STV clusters whenever totalSeats >= 3.
   */
  function buildStvClusters(totalSeats) {
    const n = Math.max(0, Math.round(Number(totalSeats) || 0));
    if (n === 0) return [];
    if (n < 3) return [n];

    const kMin = Math.ceil(n / 5);
    const kMax = Math.floor(n / 3);
    const k = Math.min(kMax, Math.max(kMin, Math.round(n / 4)));
    const base = Math.floor(n / k);
    const rem = n % k;
    const sizes = [];
    for (let i = 0; i < k; i++) {
      sizes.push(base + (i < rem ? 1 : 0));
    }
    return sizes;
  }

  function resolveSingleStvCluster(clusterVotes, clusterSize, options = {}) {
    const quota = Math.floor(100 / (clusterSize + 1)) + 1;
    const votes = normalizeVotesTo100(clusterVotes);
    const seatsByParty = {};
    const winnerOrder = [];
    const active = Object.keys(votes).filter((pid) => votes[pid] > 0);
    active.forEach((pid) => { seatsByParty[pid] = 0; });

    if (!active.length || clusterSize <= 0) {
      return { size: clusterSize, quota, seatsByParty, winnerOrder };
    }

    let elected = 0;
    let safety = 0;
    while (elected < clusterSize && active.length > 0 && safety < 256) {
      safety += 1;

      // 1. Elect any candidate/party meeting Droop quota (highest first)
      active.sort((a, b) => (votes[b] - votes[a]) || a.localeCompare(b));
      const topParty = active[0];
      if (votes[topParty] >= quota - 1e-9) {
        seatsByParty[topParty] = (seatsByParty[topParty] || 0) + 1;
        winnerOrder.push(topParty);
        elected += 1;
        votes[topParty] = Math.max(0, votes[topParty] - quota);
        if (votes[topParty] <= 1e-9) {
          const idx = active.indexOf(topParty);
          if (idx >= 0) active.splice(idx, 1);
        }
        continue;
      }

      // 2. If remaining active parties cannot exceed open seats, fill by highest vote
      if (active.length === 1 || (clusterSize - elected) > active.length) {
        seatsByParty[topParty] = (seatsByParty[topParty] || 0) + 1;
        winnerOrder.push(topParty);
        elected += 1;
        const idx = active.indexOf(topParty);
        if (idx >= 0) active.splice(idx, 1);
        continue;
      }

      // 3. Eliminate lowest-vote active contender and transfer to ideologically closest party
      const lowestParty = active[active.length - 1];
      const transferAmt = Math.max(0, votes[lowestParty] || 0);
      active.pop();
      votes[lowestParty] = 0;

      if (transferAmt > 0 && active.length > 0) {
        const recipient = findClosestRemainingParty(lowestParty, active, options);
        if (recipient) {
          votes[recipient] = (votes[recipient] || 0) + transferAmt;
        }
      }
    }

    // Conservation fallback if any rounding edge left a seat open
    const fallbackPool = Object.keys(clusterVotes || {}).sort((a, b) => (clusterVotes[b] - clusterVotes[a]) || a.localeCompare(b));
    let fbIdx = 0;
    while (elected < clusterSize && fallbackPool.length > 0) {
      const p = fallbackPool[fbIdx % fallbackPool.length];
      seatsByParty[p] = (seatsByParty[p] || 0) + 1;
      winnerOrder.push(p);
      elected += 1;
      fbIdx += 1;
    }

    return { size: clusterSize, quota, seatsByParty, winnerOrder };
  }

  /**
   * Resolves Single Transferable Vote across balanced 3-5 seat multi-member clusters.
   */
  function allocateStvSeats(partyVotes, totalSeats, options = {}) {
    const n = Math.max(0, Math.round(Number(totalSeats) || 0));
    const clusterSizes = buildStvClusters(n);
    const seatsByParty = {};
    Object.keys(partyVotes || {}).forEach((pid) => { seatsByParty[pid] = 0; });

    const clusters = clusterSizes.map((size, idx) => {
      const cVotes = (Array.isArray(options?.clusterVotes) && options.clusterVotes[idx])
        ? options.clusterVotes[idx]
        : partyVotes;
      const res = resolveSingleStvCluster(cVotes, size, options);
      Object.entries(res.seatsByParty).forEach(([pid, count]) => {
        seatsByParty[pid] = (seatsByParty[pid] || 0) + count;
      });
      return {
        clusterId: idx + 1,
        size: res.size,
        seatsByParty: res.seatsByParty,
        winnerOrder: res.winnerOrder,
      };
    });

    return {
      seatsByParty,
      clusters,
      totalSeats: n,
    };
  }

  function tallyLocalSeats(partyVotes, localDistrictWinners, localCount) {
    const localSeats = {};
    Object.keys(partyVotes || {}).forEach((p) => { localSeats[p] = 0; });
    if (localCount <= 0) return localSeats;

    if (Array.isArray(localDistrictWinners) && localDistrictWinners.length > 0) {
      const rawCounts = {};
      localDistrictWinners.forEach((entry) => {
        const pid = typeof entry === 'string'
          ? entry
          : (entry?.winner || entry?.party || entry?.partyId);
        if (pid) rawCounts[pid] = (rawCounts[pid] || 0) + 1;
      });
      const rawSum = Object.values(rawCounts).reduce((a, b) => a + b, 0);
      if (rawSum === localCount) {
        Object.entries(rawCounts).forEach(([p, c]) => { localSeats[p] = c; });
        return localSeats;
      }
      if (rawSum > 0) {
        const scaled = allocateLargestRemainder(rawCounts, localCount);
        Object.entries(scaled).forEach(([p, c]) => { localSeats[p] = c; });
        return localSeats;
      }
    } else if (localDistrictWinners && typeof localDistrictWinners === 'object' && !Array.isArray(localDistrictWinners)) {
      const rawSum = Object.values(localDistrictWinners).reduce((a, b) => a + Math.max(0, Number(b) || 0), 0);
      if (rawSum === localCount) {
        Object.entries(localDistrictWinners).forEach(([p, c]) => {
          localSeats[p] = Math.max(0, Math.round(Number(c) || 0));
        });
        return localSeats;
      }
      if (rawSum > 0) {
        const scaled = allocateLargestRemainder(localDistrictWinners, localCount);
        Object.entries(scaled).forEach(([p, c]) => { localSeats[p] = c; });
        return localSeats;
      }
    }

    // Fallback plurality/proportional local split if no localDistrictWinners passed
    const norm = normalizeVotesTo100(partyVotes);
    const winner = Object.entries(norm).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (winner) localSeats[winner] = localCount;
    return localSeats;
  }

  /**
   * State-level Mixed-Member Proportional (MMP): splits totalSeats into
   * localCount = floor(totalSeats / 2) and listCount = totalSeats - localCount,
   * awarding compensatory top-up seats via Sainte-Lague (or D'Hondt) to parties
   * meeting >= 5% vote share OR winning >= 1 local district.
   */
  function allocateStateMmpSeats(partyVotes, localDistrictWinners, totalSeats, options = {}) {
    const n = Math.max(0, Math.round(Number(totalSeats) || 0));
    const localCount = Math.floor(n / 2);
    const listCount = n - localCount;

    const normVotes = normalizeVotesTo100(partyVotes);
    const localSeats = tallyLocalSeats(normVotes, localDistrictWinners, localCount);
    const listSeats = {};
    const totalSeatsByParty = {};

    const allParties = Array.from(new Set([...Object.keys(normVotes), ...Object.keys(localSeats)]));
    allParties.forEach((p) => {
      localSeats[p] = localSeats[p] || 0;
      listSeats[p] = 0;
      totalSeatsByParty[p] = localSeats[p];
    });

    if (n === 0 || listCount === 0 || allParties.length === 0) {
      return { localSeats, listSeats, totalSeatsByParty, totalSeats: n };
    }

    const thresholdPct = Number(options?.thresholdPct ?? 5);
    const useDhondt = String(options?.method || '').toLowerCase() === 'dhondt';

    const qualified = allParties.filter((p) => (normVotes[p] || 0) >= thresholdPct || (localSeats[p] || 0) >= 1);
    const eligible = qualified.length > 0 ? qualified : allParties.filter((p) => (normVotes[p] || 0) > 0);
    if (!eligible.length) {
      return { localSeats, listSeats, totalSeatsByParty, totalSeats: n };
    }

    for (let s = 0; s < listCount; s++) {
      let bestParty = eligible[0];
      let bestQuotient = -1;
      eligible.forEach((p) => {
        const curTotal = totalSeatsByParty[p] || 0;
        const divisor = useDhondt ? (curTotal + 1) : ((2 * curTotal) + 1);
        const q = (normVotes[p] || 0) / divisor;
        if (q > bestQuotient + 1e-12 || (Math.abs(q - bestQuotient) <= 1e-12 && (normVotes[p] || 0) > (normVotes[bestParty] || 0))) {
          bestQuotient = q;
          bestParty = p;
        }
      });
      listSeats[bestParty] += 1;
      totalSeatsByParty[bestParty] += 1;
    }

    return {
      localSeats,
      listSeats,
      totalSeatsByParty,
      totalSeats: n,
    };
  }

  /**
   * Allocates a state's Presidential Electoral Votes under 'winner_take_all',
   * 'district_split' (Maine/Nebraska model), or 'proportional_ev' (5% floor).
   */
  function allocateStatePresidentialEvs(stateId, totalEv, partyShares, districtWinners, evRule, options = {}) {
    const evTotal = Math.max(0, Math.round(Number(totalEv) || 0));
    const rule = normalizeEvRuleName(evRule || options?.rule, stateId);
    const norm = normalizeVotesTo100(partyShares);
    const ranked = Object.entries(norm).sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));
    const primaryWinner = options?.winnerOverride || ranked[0]?.[0] || null;
    const evByParty = {};
    Object.keys(partyShares || {}).forEach((p) => { evByParty[p] = 0; });

    if (evTotal === 0 || !primaryWinner) {
      return {
        evByParty,
        primaryWinner,
        isSplit: false,
        rule,
        districtSplitDetail: null,
      };
    }

    let districtSplitDetail = null;

    if (rule === 'district_split') {
      const atLargeEv = Math.min(2, evTotal);
      const districtEvTarget = Math.max(0, evTotal - atLargeEv);
      evByParty[primaryWinner] = (evByParty[primaryWinner] || 0) + atLargeEv;

      const districtEvs = {};
      if (districtEvTarget > 0) {
        if (Array.isArray(districtWinners) && districtWinners.length > 0) {
          const rawCounts = {};
          districtWinners.forEach((entry) => {
            const pid = typeof entry === 'string'
              ? entry
              : (entry?.winner || entry?.party || entry?.partyId);
            if (pid) rawCounts[pid] = (rawCounts[pid] || 0) + 1;
          });
          const countSum = Object.values(rawCounts).reduce((a, b) => a + b, 0);
          const alloc = countSum === districtEvTarget
            ? rawCounts
            : allocateLargestRemainder(rawCounts, districtEvTarget);
          Object.entries(alloc).forEach(([pid, cnt]) => {
            districtEvs[pid] = (districtEvs[pid] || 0) + cnt;
            evByParty[pid] = (evByParty[pid] || 0) + cnt;
          });
        } else if (districtWinners && typeof districtWinners === 'object' && !Array.isArray(districtWinners)) {
          const alloc = allocateLargestRemainder(districtWinners, districtEvTarget);
          Object.entries(alloc).forEach(([pid, cnt]) => {
            districtEvs[pid] = (districtEvs[pid] || 0) + cnt;
            evByParty[pid] = (evByParty[pid] || 0) + cnt;
          });
        } else {
          districtEvs[primaryWinner] = districtEvTarget;
          evByParty[primaryWinner] += districtEvTarget;
        }
      }

      districtSplitDetail = {
        statewideEvs: { [primaryWinner]: atLargeEv },
        districtEvs,
        districtEvTarget,
      };
    } else if (rule === 'proportional_ev') {
      const thresholdPct = Number(options?.thresholdPct ?? 5);
      const viableWeights = {};
      ranked.forEach(([pid, share]) => {
        if (share >= thresholdPct) viableWeights[pid] = share;
      });
      if (Object.keys(viableWeights).length === 0) {
        viableWeights[primaryWinner] = norm[primaryWinner] || 100;
      }
      const alloc = allocateLargestRemainder(viableWeights, evTotal);
      Object.entries(alloc).forEach(([pid, cnt]) => {
        evByParty[pid] = cnt;
      });
    } else {
      evByParty[primaryWinner] = evTotal;
    }

    const nonZeroParties = Object.values(evByParty).filter((v) => v > 0).length;
    return {
      evByParty,
      primaryWinner,
      isSplit: nonZeroParties > 1,
      rule,
      districtSplitDetail,
    };
  }

  const VotingReformsCore = {
    ANTI_SPOILER_SYSTEMS: Array.from(ANTI_SPOILER_SYSTEMS),
    PROPORTIONAL_SYSTEMS: Array.from(PROPORTIONAL_SYSTEMS),
    buildStvClusters,
    allocateStvSeats,
    allocateStateMmpSeats,
    allocateStatePresidentialEvs,
    normalizeStateElectoralSystemRecord,
    allocateLargestRemainder,
  };

  if (typeof window !== 'undefined') window.VotingReformsCore = VotingReformsCore;
  if (typeof root !== 'undefined' && root) root.VotingReformsCore = VotingReformsCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = VotingReformsCore;
})(typeof globalThis !== 'undefined' ? globalThis : this);
