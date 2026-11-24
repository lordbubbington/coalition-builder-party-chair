// [v0.18.5 PLAYTEST-FIXES] Standalone Auto-Candidate Generator & Priority Outcome Normalizer
// Deterministic logic only — no Math.random(). Exposes window.V0185PlaytestFixes and module.exports.
(function (root) {
  'use strict';

  const MINOR_PARTIES = ['green', 'liberty', 'constitution', 'socialist'];

  // Tier-based auto-candidate probabilities (per cycle)
  const AUTO_CANDIDATE_RATES = {
    0: { minorStatewide: 0.25, house: 1 / 3, senateGov: 0.50 },
    1: { minorStatewide: 0.25, house: 1 / 3, senateGov: 0.50 },
    2: { minorStatewide: 1 / 3, house: 0.50, senateGov: 2 / 3 },
    3: { minorStatewide: 0.50, house: 2 / 3, senateGov: 1.00 },
    4: { minorStatewide: 0.75, house: 1.00, senateGov: 1.00 },
    5: { minorStatewide: 1.00, house: 1.00, senateGov: 1.00 },
  };

  function detHash(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= h >>> 16;
    h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13;
    h = Math.imul(h, 3266489909) >>> 0;
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }

  function isStartingCycle(game) {
    if (!game) return true;
    const yr = Number(game.year || 2028);
    const startYr = Number(game.startingYear || 2028);
    return yr <= startYr;
  }

  function partyHasStateLegSeat(game, partyId, stateId) {
    if (!game || !partyId || !stateId) return false;
    const sh = game.stateHouseSeatCounts?.[stateId];
    if (sh && Number(sh[partyId] || 0) >= 1) return true;
    const legs = game.stateLegislatures?.[stateId];
    if (Array.isArray(legs) && legs.includes(partyId)) return true;
    const sitting = game.sittingMembers || [];
    return sitting.some((m) =>
      m && (m.office === 'stateLeg' || m.office === 'state_leg' || m.office === 'state-leg')
      && (m.stateId === stateId || m.state === stateId)
      && (m.party === partyId || m.partyId === partyId)
    );
  }

  function getAutoCandidateRatesForTier(tier) {
    const t = Math.max(0, Math.min(5, Math.round(Number(tier ?? 1))));
    return AUTO_CANDIDATE_RATES[t] || AUTO_CANDIDATE_RATES[1];
  }

  function buildAutoCandidate(game, raceId, stateId, partyId, officeKind, idx) {
    const data = root.PartyChairData || {};
    const stateObj = (data.STATES || []).find((s) => s.id === stateId);
    const stateName = stateObj?.name || stateId;
    const year = Number(game.year || 2028);
    const seed = Number(game.seed || 2028);
    if (typeof data.VERSION_01_STATE_RECRUIT === 'function') {
      const base = data.VERSION_01_STATE_RECRUIT(raceId, stateName, partyId, seed + year + idx * 17, idx);
      return {
        ...base,
        id: `auto:${year}:${partyId}:${raceId}`,
        party: partyId,
        partyId,
        stateId,
        raceId,
        office: officeKind,
        autoCandidate: true,
        recruit: false,
        poll: Math.max(15, Math.min(45, Number(base.poll || 24))),
      };
    }
    const firstNames = ['Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Riley', 'Drew', 'Quinn', 'Avery', 'Sam'];
    const lastNames = ['Rivera', 'Chen', 'Patel', 'Brooks', 'Morales', 'Hayes', 'Nguyen', 'Grant', 'Ellis', 'Walsh'];
    const h1 = detHash(`fn:${seed}:${year}:${partyId}:${raceId}`);
    const h2 = detHash(`ln:${seed}:${year}:${partyId}:${raceId}`);
    const name = `${firstNames[Math.floor(h1 * firstNames.length)]} ${lastNames[Math.floor(h2 * lastNames.length)]} (${stateName})`;
    return {
      id: `auto:${year}:${partyId}:${raceId}`,
      name,
      party: partyId,
      partyId,
      stateId,
      raceId,
      office: officeKind,
      wing: 'Grassroots',
      quality: 5 + Math.floor(detHash(`q:${seed}:${year}:${partyId}:${raceId}`) * 3),
      fame: 20 + Math.floor(detHash(`f:${seed}:${year}:${partyId}:${raceId}`) * 25),
      poll: 24,
      autoCandidate: true,
      recruit: false,
      ratings: { charisma: 6, fieldcraft: 6, persuadability: 6, fundraising: 5, integrity: 7, stamina: 6, debate: 6, experience: 5, corruption: 2, regionalStrength: 6, turnout: 6 },
    };
  }

  function generateCycleAutoCandidates(game, getTierFn) {
    if (!game) return game;
    const data = root.PartyChairData || {};
    const year = Number(game.year || 2028);
    const seed = Number(game.seed || 2028);

    const playerPid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
    const targetParties = [...MINOR_PARTIES];
    if (game.player?.custom && !targetParties.includes('player')) {
      targetParties.push('player');
    }

    const nextPrimaryFields = { ...(game.primaryFields || {}) };
    const nextBallotAccess = JSON.parse(JSON.stringify(game.ballotAccess || {}));
    const nextContestedStatewide = { ...(game.contestedStatewideOffices || {}) };

    const activeSenate = game.activeSenateRaces || data.VERSION_01_SENATE_RACES || [];
    const activeGovs = game.activeGubernatorialStates || data.VERSION_01_GUBERNATORIAL_ELECTIONS || [];
    const houseDistricts = data.VERSION_01_HOUSE_DISTRICTS || [];
    const seoRegistry = data.STATEWIDE_OFFICES_REGISTRY || [];
    const isSeoOnCycle = typeof data.isStatewideOfficeOnCycle === 'function'
      ? data.isStatewideOfficeOnCycle
      : (o, y) => Number(o?.nextElectionYear || 2028) === Number(y);

    targetParties.forEach((pid) => {
      const rawTier = typeof getTierFn === 'function' ? Number(getTierFn(game, pid)) : Number(game.partyTiers?.[pid]?.tier ?? 1);
      // Major parties (>= 5) already have full primary fields; only run auto-candidate generator for tiers 0-4
      if (rawTier >= 5 && ['people', 'heritage'].includes(pid)) return;
      const rates = getAutoCandidateRatesForTier(rawTier);

      nextBallotAccess[pid] = nextBallotAccess[pid] || { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} };
      nextBallotAccess[pid].senate = nextBallotAccess[pid].senate || {};
      nextBallotAccess[pid].governor = nextBallotAccess[pid].governor || {};
      nextBallotAccess[pid].house = nextBallotAccess[pid].house || {};
      nextBallotAccess[pid].leg = nextBallotAccess[pid].leg || {};

      const placeAuto = (raceId, stateId, officeKind, baBucket, baKey, prob, idx) => {
        const hasSeatOverride = partyHasStateLegSeat(game, pid, stateId);
        const roll = detHash(`auto-cand:${seed}:${year}:${pid}:${raceId}`);
        const shouldRun = hasSeatOverride || roll < prob;
        if (!shouldRun) return;

        if (baBucket === 'statewide') {
          nextContestedStatewide[baKey] = true;
        } else if (baBucket && baKey) {
          nextBallotAccess[pid][baBucket][baKey] = true;
        }

        const existing = nextPrimaryFields[raceId]?.[pid];
        if (Array.isArray(existing) && existing.length > 0) return;

        const cand = buildAutoCandidate(game, raceId, stateId, pid, officeKind, idx);
        nextPrimaryFields[raceId] = {
          ...(nextPrimaryFields[raceId] || {}),
          [pid]: [cand],
        };
      };

      // 1. Active Senate races
      activeSenate.forEach((r, idx) => {
        const st = r.state || r.stateId;
        if (!st) return;
        placeAuto(`senate:${st}`, st, 'senate', 'senate', st, rates.senateGov, idx);
      });

      // 2. Active Governor races
      activeGovs.forEach((st, idx) => {
        if (!st) return;
        placeAuto(`governor:${st}`, st, 'governor', 'governor', st, rates.senateGov, idx);
      });

      // 3. House races
      houseDistricts.forEach((d, idx) => {
        if (!d?.id) return;
        const st = d.stateId || String(d.id).split('-')[0];
        placeAuto(`house:${d.id}`, st, 'house', 'house', d.id, rates.house, idx);
      });

      // 4. On-cycle Minor Statewide offices
      seoRegistry.forEach((seo, idx) => {
        if (!seo?.id || !isSeoOnCycle(seo, year)) return;
        const st = seo.stateId || String(seo.id).split('-')[0];
        placeAuto(`statewide:${seo.id}`, st, 'statewide_executive', 'statewide', seo.id, rates.minorStatewide, idx);
      });

      // 5. If party holds a state leg seat in a state, guarantee state-leg ballot access there too
      (data.STATES || []).forEach((s) => {
        if (partyHasStateLegSeat(game, pid, s.id)) {
          nextBallotAccess[pid].leg[s.id] = true;
        }
      });

      // Mirror player custom key if needed
      if (pid === playerPid && pid !== 'player' && game.ballotAccess?.player) {
        nextBallotAccess.player = nextBallotAccess[pid];
      }
    });

    return {
      ...game,
      primaryFields: nextPrimaryFields,
      ballotAccess: nextBallotAccess,
      contestedStatewideOffices: nextContestedStatewide,
    };
  }

  function normalizeOutcomeForQuests(game, outcome) {
    if (!outcome || typeof outcome !== 'object') return outcome;
    const pid = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || game?.player?.id || 'people');

    // Normalize EV map
    const evMap = {
      ...(outcome.presidential?.ev || {}),
      ...(outcome.presidential?.electoralVotes || {}),
      ...(outcome.ev || {}),
    };

    // Normalize national popular vote share map
    const popVote = {
      ...(outcome.legislature?.nationalVote || {}),
      ...(outcome.nationalVote || {}),
      ...(outcome.presidential?.popularVote || {}),
      ...(outcome.popularVoteShare || {}),
      ...(outcome.presidentialPopularVoteShare || {}),
    };
    if (popVote[pid] === undefined && popVote.player !== undefined) {
      popVote[pid] = popVote.player;
    }

    // Normalize per-state vote shares map
    const stateVoteShares = { ...(outcome.stateVoteShares || outcome.popularVoteByState || {}) };
    const presStates = outcome.presidential?.states || outcome.presidential?.byState || outcome.presidentialResults || {};
    if (Array.isArray(presStates)) {
      presStates.forEach((row) => {
        const stId = row?.stateId || row?.id;
        if (stId && row?.shares) stateVoteShares[stId] = { ...(stateVoteShares[stId] || {}), ...row.shares };
      });
    } else if (presStates && typeof presStates === 'object') {
      Object.entries(presStates).forEach(([stId, row]) => {
        const key = row?.stateId || stId;
        if (key && row?.shares) stateVoteShares[key] = { ...(stateVoteShares[key] || {}), ...row.shares };
      });
    }

    // Normalize electedCandidates list from senate, governor, and house outcomes
    const electedCandidates = Array.isArray(outcome.electedCandidates) ? [...outcome.electedCandidates] : [];
    if (!electedCandidates.length) {
      (outcome.senate || []).forEach((r) => {
        if (r?.winner) electedCandidates.push({ raceId: r.raceKey || `senate:${r.stateId}`, stateId: r.stateId, office: 'senate', party: r.winner, caucus: r.winner });
      });
      (outcome.governors || outcome.governorResults || []).forEach((r) => {
        if (r?.winner) electedCandidates.push({ raceId: r.raceKey || `governor:${r.stateId}`, stateId: r.stateId, office: 'governor', party: r.winner, caucus: r.winner });
      });
      (outcome.districts || outcome.legislature?.districts || []).forEach((d) => {
        const w = d?.winner || d?.party || d?.partyId;
        if (w) electedCandidates.push({ raceId: `house:${d.districtId || d.id}`, stateId: d.stateId, office: 'house', party: w, caucus: w });
      });
    }

    return {
      ...outcome,
      ev: evMap,
      presidentialPopularVoteShare: popVote,
      popularVoteShare: popVote,
      nationalVoteShare: popVote,
      stateVoteShares,
      popularVoteByState: stateVoteShares,
      electedCandidates,
    };
  }

  const api = {
    AUTO_CANDIDATE_RATES,
    detHash,
    isStartingCycle,
    partyHasStateLegSeat,
    getAutoCandidateRatesForTier,
    generateCycleAutoCandidates,
    normalizeOutcomeForQuests,
  };

  if (typeof root !== 'undefined' && root) {
    root.V0185PlaytestFixes = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
