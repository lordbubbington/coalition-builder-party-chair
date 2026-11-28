// ============================================================================
// Coalition Builder: Party Chair — Off-Cycle Interlude Turn System
// Target Module: off-cycle-interlude.js (window.OffCycleInterludeSystem / module.exports)
// Integration Tag: // [OFF-CYCLE]
// ============================================================================
(function (global) {
  'use strict';

  const root = (typeof window !== 'undefined' ? window : global) || globalThis;

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function round(value, decimals = 2) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(n * factor) / factor;
  }

  // Deterministic FNV-1a hash returning [0, 1) — zero Math.random() calls
  function seededUnit(seedStr) {
    let h = 2166136261 >>> 0;
    const s = String(seedStr || 'oc');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h >>> 0) / 4294967296;
  }

  // --------------------------------------------------------------------------
  // Constants & Catalogs (Section 3.1 - 3.4)
  // --------------------------------------------------------------------------

  const BASE_ACTIONS = 4;
  // [v0.18.7 QA-FIX] BUG-06: Per-state chapter cap
  const MAX_STATE_CHAPTERS = 25;

  const POSTURES = {
    party_building: {
      id: 'party_building',
      label: 'Party-Building Focus',
      bonusActions: 1,
      maxActions: 5,
      minPartyBuilding: 1,
      minElection: 0,
      chapterMediaCostMultiplier: 0.80,
      electionPersuasionMultiplier: 1.0,
      rivalTurnoutEdge: 1.2,
      passiveDripMultiplier: 1.0,
      summary: '+1 Bonus Action (5 total, min 1 Party Building), -20% chapter/media cost; Rival gets +1.2% off-cycle turnout edge.',
    },
    special_blitz: {
      id: 'special_blitz',
      label: 'Special-Election Blitz',
      bonusActions: 1,
      maxActions: 5,
      minPartyBuilding: 0,
      minElection: 1,
      chapterMediaCostMultiplier: 1.0,
      electionPersuasionMultiplier: 1.15,
      rivalTurnoutEdge: 0.0,
      passiveDripMultiplier: 0.0,
      summary: '+1 Bonus Action (5 total, min 1 Off-Cycle Race), +15% persuasion lift; 0% passive interest/donor drip.',
    },
    balanced: {
      id: 'balanced',
      label: 'Balanced Split',
      bonusActions: 0,
      maxActions: 4,
      minPartyBuilding: 0,
      minElection: 0,
      chapterMediaCostMultiplier: 1.0,
      electionPersuasionMultiplier: 1.0,
      rivalTurnoutEdge: 0.0,
      passiveDripMultiplier: 1.0,
      summary: '4 Actions usable freely across either track; no bonuses or penalties.',
    },
  };

  // Costs ordered [Major (Tier 5), Mid (Tier 3-4), Minor (Tier 0-2)]
  const ACTION_COSTS = {
    'oc-chapter-drive': { track: 'party', label: 'Pre-Primary Chapter Drive', tiers: [4.0, 1.2, 0.5] },
    'oc-donor-retreat': { track: 'party', label: 'Early Donor & Bundler Retreat', tiers: [0, 0, 0] },
    'oc-media-buildout': { track: 'party', label: 'Media Infrastructure Buildout', tiers: [6.0, 1.8, 0.8] },
    'oc-faction-mend': { track: 'party', label: 'Coalition Fence-Mending', tiers: [2.0, 0.6, 0.3] },
    'oc-federal-scout': { track: 'party', label: 'Scout Federal Primary Recruit', tiers: [2.5, 0.8, 0.4] },
    'oc-ad-blitz': { track: 'election', label: 'Special-Election Ad Blitz', tiers: [5.0, 1.5, 0.6] },
    'oc-turnout-surge': { track: 'election', label: 'Grassroots Turnout Surge', tiers: [2.5, 0.8, 0.4] },
    'oc-deploy-surrogate': { track: 'election', label: 'Deploy National Surrogate', tiers: [0, 0, 0] },
    'oc-oppo-drop': { track: 'election', label: 'Opposition Research Drop', tiers: [3.0, 1.0, 0.4] },
  };

  const DONOR_RETREAT_YIELDS = {
    5: 18.0,
    4: 5.0,
    3: 5.0,
    2: 1.5,
    1: 1.5,
    0: 0.5,
  };

  const RACE_WEIGHTS = {
    senate_special: 1.2,
    governor: 1.0,
    house_special: 0.8,
    state_leg: 0.5,
  };

  const SCHEDULED_STATES_MOD1 = ['VA', 'NJ']; // 4n + 1: 2029, 2033, 2037...
  const SCHEDULED_STATES_MOD3 = ['KY', 'LA', 'MS']; // 4n + 3: 2031, 2035, 2039...

  const FIRST_NAMES = [
    'Elena', 'Marcus', 'Claire', 'David', 'Nadia', 'Samuel', 'Hannah', 'Thomas',
    'Rachel', 'Daniel', 'Grace', 'Benjamin', 'Tessa', 'Victor', 'Lauren', 'Julian',
    'Monica', 'Owen', 'Sarah', 'Nathaniel', 'Olivia', 'Caleb', 'Simone', 'Patrick',
  ];
  const LAST_NAMES = [
    'Mercer', 'Reyes', 'Caldwell', 'Holloway', 'Vance-Kerr', 'Whitman', 'Delgado', 'Sutton',
    'Kowalski', 'Alvarez', 'Thornton', 'Prescott', 'Benson', 'Castillo', 'Hargrove', 'Sterling',
    'Frazier', 'Donovan', 'Chambers', 'Nolan', 'Gallagher', 'Mendoza', 'Pritchard', 'Linwood',
  ];

  const ACTION_ALIAS_MAP = {
    'off-cycle-set-posture': 'oc-set-posture',
    'oc-set-posture': 'oc-set-posture',
    'off-cycle-chapter-drive': 'oc-chapter-drive',
    'oc-chapter-drive': 'oc-chapter-drive',
    'off-cycle-donor-retreat': 'oc-donor-retreat',
    'oc-donor-retreat': 'oc-donor-retreat',
    'off-cycle-media-buildout': 'oc-media-buildout',
    'oc-media-buildout': 'oc-media-buildout',
    'off-cycle-faction-mend': 'oc-faction-mend',
    'oc-faction-mend': 'oc-faction-mend',
    'off-cycle-federal-scout': 'oc-federal-scout',
    'oc-federal-scout': 'oc-federal-scout',
    'off-cycle-ad-blitz': 'oc-ad-blitz',
    'oc-ad-blitz': 'oc-ad-blitz',
    'off-cycle-turnout-surge': 'oc-turnout-surge',
    'oc-turnout-surge': 'oc-turnout-surge',
    'off-cycle-deploy-surrogate': 'oc-deploy-surrogate',
    'oc-deploy-surrogate': 'oc-deploy-surrogate',
    'off-cycle-oppo-drop': 'oc-oppo-drop',
    'oc-oppo-drop': 'oc-oppo-drop',
    'off-cycle-resolve': 'oc-resolve',
    'oc-resolve': 'oc-resolve',
    'off-cycle-complete': 'oc-complete',
    'oc-complete': 'oc-complete',
  };

  // --------------------------------------------------------------------------
  // Internal Data & Party Resolution Helpers
  // --------------------------------------------------------------------------

  function getData() {
    return root.PartyChairData || {};
  }

  function getEngine() {
    return root.PartyChairEngine || null;
  }

  function getMediaSystem() {
    return root.MediaShocksSystem || null;
  }

  function resolvePlayerPartyId(game) {
    if (!game?.player) return 'people';
    if (game.player.custom) return 'player';
    return game.player.baseTemplateId || game.player.id || 'people';
  }

  function resolvePrimaryRivalId(game) {
    const pKey = resolvePlayerPartyId(game);
    return pKey === 'people' ? 'heritage' : 'people';
  }

  function getPartyTier(game, partyId = 'player') {
    const eng = getEngine();
    if (eng && typeof eng.getPartyInstitutionalTier === 'function') {
      return clamp(Math.round(Number(eng.getPartyInstitutionalTier(game, partyId))), 0, 5);
    }
    const v07 = root.PartyChairV07;
    if (v07 && typeof v07.getPartyInstitutionalTier === 'function') {
      return clamp(Math.round(Number(v07.getPartyInstitutionalTier(game, partyId))), 0, 5);
    }
    const resolved = (!partyId || partyId === 'player') ? resolvePlayerPartyId(game) : partyId;
    if (Number.isFinite(Number(game?.partyTiers?.[resolved]))) {
      return clamp(Math.round(Number(game.partyTiers[resolved])), 0, 5);
    }
    if (['people', 'heritage'].includes(resolved) && !game?.player?.custom) return 5;
    if (['liberty', 'green'].includes(resolved)) return 1;
    return 0;
  }

  function getActionCashCost(game, actionId, partyId = null, postureOverride = undefined) {
    const spec = ACTION_COSTS[actionId];
    if (!spec) return 0;
    const pKey = partyId || resolvePlayerPartyId(game);
    const tier = getPartyTier(game, pKey);
    const base = tier >= 5 ? spec.tiers[0] : tier >= 3 ? spec.tiers[1] : spec.tiers[2];
    if (base <= 0) return 0;
    const posture = postureOverride !== undefined ? postureOverride : game?.offCycle?.posture;
    if (posture === 'party_building' && (actionId === 'oc-chapter-drive' || actionId === 'oc-media-buildout')) {
      return round(base * 0.80, 2);
    }
    return round(base, 2);
  }

  function getStatesList() {
    const d = getData();
    return d.STATES || d.VERSION_01_STATES || [];
  }

  function getStateObj(stateId) {
    const states = getStatesList();
    return states.find((s) => s.id === stateId) || { id: stateId, name: stateId, leanPercent: 0, region: 'South' };
  }

  function getStateLeanPercent(stateId) {
    const st = getStateObj(stateId);
    if (st.leanPercent !== undefined && Number.isFinite(Number(st.leanPercent))) {
      return Number(st.leanPercent);
    }
    // VERSION_01_STATES uses `lean` on percentage scale (+ Dem, - GOP) before scenario-2028 transformation
    if (st.lean !== undefined && Number.isFinite(Number(st.lean))) {
      const n = Number(st.lean);
      return Math.abs(n) <= 1 ? round(-n * 100, 2) : n;
    }
    return 0;
  }

  function getDistrictsList() {
    const d = getData();
    return d.VERSION_01_HOUSE_DISTRICTS || [];
  }

  function generateDeterministicCandidate(partyId, stateId, seedKey, options = {}) {
    const fn = FIRST_NAMES[Math.floor(seededUnit(`${seedKey}:fn`) * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(seededUnit(`${seedKey}:ln`) * LAST_NAMES.length)];
    const minQ = Number(options.minQuality ?? 6);
    const maxQ = Number(options.maxQuality ?? 9);
    const qSpan = Math.max(1, maxQ - minQ + 1);
    const quality = clamp(minQ + Math.floor(seededUnit(`${seedKey}:q`) * qSpan), 1, 10);
    const minFame = Number(options.minFame ?? 32);
    const maxFame = Number(options.maxFame ?? 58);
    const fame = clamp(minFame + Math.floor(seededUnit(`${seedKey}:fame`) * Math.max(1, maxFame - minFame + 1)), 1, 100);
    const cleanRoll = seededUnit(`${seedKey}:trait`);
    const traits = cleanRoll < 0.28 ? ['Clean', 'Integrity'] : cleanRoll < 0.56 ? ['Pragmatist'] : ['Grassroots Organizer'];
    const rawParty = partyId === 'people' ? 'D' : partyId === 'heritage' ? 'R' : String(partyId || 'I').slice(0, 1).toUpperCase();
    const eng = getEngine();
    const facList = (eng?.getFactionsCatalog ? eng.getFactionsCatalog() : (getData().FACTIONS_CATALOG || []))
      .filter((f) => f && f.partyId === partyId);
    const faction = facList.length ? facList[Math.floor(seededUnit(`${seedKey}:fac`) * facList.length)] : null;
    return {
      id: options.id || `oc-cand-${partyId}-${stateId}-${Math.floor(seededUnit(seedKey) * 100000)}`,
      name: `${fn} ${ln}`,
      party: partyId,
      partyId,
      rawParty,
      caucus: partyId,
      stateId,
      state: stateId,
      quality,
      skill: Math.max(1, Math.min(5, Math.round(quality / 2))),
      fame,
      popularity: clamp(Math.round(42 + (fame - 35) * 0.4), 20, 85),
      factionId: faction?.id || `${partyId}_main`,
      faction: faction?.name || 'Mainstream Wing',
      traits,
      age: 38 + Math.floor(seededUnit(`${seedKey}:age`) * 24),
    };
  }

  function buildRaceCandidates(game, raceId, stateId, seedBase) {
    const playerPid = resolvePlayerPartyId(game);
    const candidates = {
      people: generateDeterministicCandidate('people', stateId, `${seedBase}:people`, { id: `${raceId}:cand:people` }),
      heritage: generateDeterministicCandidate('heritage', stateId, `${seedBase}:heritage`, { id: `${raceId}:cand:heritage` }),
    };
    if (!['people', 'heritage'].includes(playerPid)) {
      candidates[playerPid] = generateDeterministicCandidate(playerPid, stateId, `${seedBase}:${playerPid}`, {
        id: `${raceId}:cand:${playerPid}`,
        minQuality: 5,
        maxQuality: 8,
        minFame: 24,
        maxFame: 48,
      });
    }
    return candidates;
  }

  function getStateChaptersCount(game, stateId, partyId) {
    const pKey = partyId || resolvePlayerPartyId(game);
    const fromOrg = game?.stateOrganizations?.[stateId]?.[pKey]?.chapters;
    if (Number.isFinite(Number(fromOrg))) return Number(fromOrg);
    if (pKey === resolvePlayerPartyId(game) && Number.isFinite(Number(game?.stateChapters?.[stateId]))) {
      return Number(game.stateChapters[stateId]);
    }
    return ['people', 'heritage'].includes(pKey) ? 2 : 0;
  }

  // --------------------------------------------------------------------------
  // Section 3.2: Scheduled Odd-Year Races & Dynamic Special Elections
  // --------------------------------------------------------------------------

  function pickFederalVacancyFor4n1(game, oddYear) {
    const seed = game?.seed || 2028;
    const whParty = game?.governingParty || game?.lastElection?.presidentialWinner || 'heritage';
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    const roles = game?.leadershipRoles?.[whParty] || game?.leadershipRoles?.player || {};
    const protectedIds = new Set(Object.values(roles).filter(Boolean));

    // 1. Cabinet Appointment: 1 sitting House Rep from governing party (fallback any House seat)
    let housePool = sitting.filter((m) => m && m.office === 'house' && (m.party === whParty || m.caucus === whParty) && !protectedIds.has(m.id));
    if (!housePool.length) {
      housePool = sitting.filter((m) => m && m.office === 'house');
    }
    let chosenHouse = null;
    if (housePool.length) {
      const idx = Math.floor(seededUnit(`oc-4n1-house:${seed}:${oddYear}`) * housePool.length);
      chosenHouse = housePool[idx];
    } else {
      const dists = getDistrictsList();
      const idx = Math.floor(seededUnit(`oc-4n1-house-dist:${seed}:${oddYear}`) * Math.max(1, dists.length));
      const d = dists[idx] || { id: 'OH-09', stateId: 'OH', lean: 1.5 };
      chosenHouse = { name: `Rep. ${d.id}`, stateId: d.stateId, districtId: d.id, party: whParty, lean: d.lean };
    }

    const distObj = getDistrictsList().find((d) => d.id === (chosenHouse.districtId || chosenHouse.district)) || null;
    const houseLean = Number.isFinite(Number(distObj?.lean))
      ? Number(distObj.lean)
      : (Number.isFinite(Number(chosenHouse.lean)) ? Number(chosenHouse.lean) : getStateLeanPercent(chosenHouse.stateId || 'OH'));
    const houseStateId = chosenHouse.stateId || distObj?.stateId || 'OH';
    const houseDistId = chosenHouse.districtId || chosenHouse.district || `${houseStateId}-01`;

    const races = [
      {
        id: `oc-${oddYear}-house-${houseDistId}`,
        oddYear,
        kind: 'house_special',
        stateId: houseStateId,
        districtId: houseDistId,
        senateClass: null,
        title: `${houseDistId} U.S. House Special Election`,
        weight: RACE_WEIGHTS.house_special,
        baselineLean: round(houseLean, 2),
        vacancyReason: `Cabinet Appointment (${chosenHouse.name || `Rep. ${houseDistId}`})`,
        incumbentParty: chosenHouse.party || whParty,
        candidates: buildRaceCandidates(game, `oc-${oddYear}-house-${houseDistId}`, houseStateId, `${seed}:${oddYear}:house:${houseDistId}`),
        playerLift: 0,
        rivalLift: 0,
        adBuys: 0,
        surrogateUsed: false,
        surrogateId: null,
        surrogateName: null,
        oppoUsed: false,
        result: null,
      },
    ];

    // 2. Optional 2nd vacancy: 1 Senator if governing party holds >= 52 Senate seats
    const whSenators = sitting.filter((m) => m && m.office === 'senate' && (m.party === whParty || m.caucus === whParty) && !protectedIds.has(m.id));
    const totalWhSenators = sitting.filter((m) => m && m.office === 'senate' && (m.party === whParty || m.caucus === whParty)).length;
    if (totalWhSenators >= 52 && whSenators.length > 0) {
      const senIdx = Math.floor(seededUnit(`oc-4n1-senate:${seed}:${oddYear}`) * whSenators.length);
      const chosenSen = whSenators[senIdx];
      const senState = chosenSen.stateId || 'OH';
      const senClass = chosenSen.senateClass || chosenSen.class || 1;
      const stObj = getStateObj(senState);
      races.push({
        id: `oc-${oddYear}-senate-${senState}`,
        oddYear,
        kind: 'senate_special',
        stateId: senState,
        districtId: null,
        senateClass: senClass,
        title: `${stObj.name || senState} (${senState}) U.S. Senate Special Election`,
        weight: RACE_WEIGHTS.senate_special,
        baselineLean: round(getStateLeanPercent(senState), 2),
        vacancyReason: `Cabinet Appointment (${chosenSen.name || `Sen. ${senState}`})`,
        incumbentParty: chosenSen.party || whParty,
        candidates: buildRaceCandidates(game, `oc-${oddYear}-senate-${senState}`, senState, `${seed}:${oddYear}:senate:${senState}`),
        playerLift: 0,
        rivalLift: 0,
        adBuys: 0,
        surrogateUsed: false,
        surrogateId: null,
        surrogateName: null,
        oppoUsed: false,
        result: null,
      });
    }

    return races;
  }

  function pickFederalVacancyFor4n3(game, oddYear) {
    const seed = game?.seed || 2028;
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    const roll = seededUnit(`oc-4n3-kind:${seed}:${oddYear}`);
    const isHouse = roll < 0.80;

    if (isHouse) {
      const dists = getDistrictsList();
      const compDists = dists.filter((d) => Math.abs(Number(d.lean || 0)) <= 10);
      const pool = compDists.length ? compDists : dists;
      let targetDist = null;
      if (pool.length) {
        const idx = Math.floor(seededUnit(`oc-4n3-house:${seed}:${oddYear}`) * pool.length);
        targetDist = pool[idx];
      } else {
        targetDist = { id: 'PA-07', stateId: 'PA', lean: 0.8 };
      }
      const inc = sitting.find((m) => m && m.office === 'house' && (m.districtId === targetDist.id || m.id === `house:${targetDist.id}`));
      return [
        {
          id: `oc-${oddYear}-house-${targetDist.id}`,
          oddYear,
          kind: 'house_special',
          stateId: targetDist.stateId,
          districtId: targetDist.id,
          senateClass: null,
          title: `${targetDist.id} U.S. House Special Election`,
          weight: RACE_WEIGHTS.house_special,
          baselineLean: round(Number(targetDist.lean || 0), 2),
          vacancyReason: `Mid-Term Resignation / Retirement (${inc?.name || `Rep. ${targetDist.id}`})`,
          incumbentParty: inc?.party || (Number(targetDist.lean || 0) >= 0 ? 'people' : 'heritage'),
          candidates: buildRaceCandidates(game, `oc-${oddYear}-house-${targetDist.id}`, targetDist.stateId, `${seed}:${oddYear}:house:${targetDist.id}`),
          playerLift: 0,
          rivalLift: 0,
          adBuys: 0,
          surrogateUsed: false,
          surrogateId: null,
          surrogateName: null,
          oppoUsed: false,
          result: null,
        },
      ];
    }

    // 20% Senate special election in competitive state (|lean| <= 10 fallback to any state)
    const allStates = getStatesList().filter((s) => s.id !== 'DC');
    const compStates = allStates.filter((s) => Math.abs(getStateLeanPercent(s.id)) <= 10);
    const stPool = compStates.length ? compStates : allStates;
    const stObj = stPool[Math.floor(seededUnit(`oc-4n3-sen-state:${seed}:${oddYear}`) * Math.max(1, stPool.length))] || { id: 'PA', name: 'Pennsylvania' };
    const stateSens = sitting.filter((m) => m && m.office === 'senate' && m.stateId === stObj.id);
    const chosenSen = stateSens.length
      ? stateSens[Math.floor(seededUnit(`oc-4n3-sen-seat:${seed}:${oddYear}`) * stateSens.length)]
      : { name: `Sen. ${stObj.id}`, senateClass: 1, party: getStateLeanPercent(stObj.id) >= 0 ? 'people' : 'heritage' };
    return [
      {
        id: `oc-${oddYear}-senate-${stObj.id}`,
        oddYear,
        kind: 'senate_special',
        stateId: stObj.id,
        districtId: null,
        senateClass: chosenSen.senateClass || chosenSen.class || 1,
        title: `${stObj.name || stObj.id} (${stObj.id}) U.S. Senate Special Election`,
        weight: RACE_WEIGHTS.senate_special,
        baselineLean: round(getStateLeanPercent(stObj.id), 2),
        vacancyReason: `Mid-Term Retirement (${chosenSen.name || `Sen. ${stObj.id}`})`,
        incumbentParty: chosenSen.party || 'people',
        candidates: buildRaceCandidates(game, `oc-${oddYear}-senate-${stObj.id}`, stObj.id, `${seed}:${oddYear}:senate:${stObj.id}`),
        playerLift: 0,
        rivalLift: 0,
        adBuys: 0,
        surrogateUsed: false,
        surrogateId: null,
        surrogateName: null,
        oppoUsed: false,
        result: null,
      },
    ];
  }

  function buildScheduledStateRaces(game, oddYear, stateIds) {
    const seed = game?.seed || 2028;
    const races = [];
    stateIds.forEach((stId) => {
      const stObj = getStateObj(stId);
      const stLean = round(getStateLeanPercent(stId), 2);
      const govId = `oc-${oddYear}-gov-${stId}`;
      const incGovParty = game?.governorships?.[stId] || (stLean >= 0 ? 'people' : 'heritage');
      races.push({
        id: govId,
        oddYear,
        kind: 'governor',
        stateId: stId,
        districtId: null,
        senateClass: null,
        title: `${stObj.name || stId} Governorship`,
        weight: RACE_WEIGHTS.governor,
        baselineLean: stLean,
        vacancyReason: 'Scheduled Odd-Year Election',
        incumbentParty: incGovParty,
        candidates: buildRaceCandidates(game, govId, stId, `${seed}:${oddYear}:gov:${stId}`),
        playerLift: 0,
        rivalLift: 0,
        adBuys: 0,
        surrogateUsed: false,
        surrogateId: null,
        surrogateName: null,
        oppoUsed: false,
        result: null,
      });

      const legId = `oc-${oddYear}-leg-${stId}`;
      const curLeg = game?.stateLegislatures?.[stId] || [stLean >= 0 ? 'people' : 'heritage', stLean >= 0 ? 'people' : 'heritage'];
      races.push({
        id: legId,
        oddYear,
        kind: 'state_leg',
        stateId: stId,
        districtId: null,
        senateClass: null,
        title: `${stObj.name || stId} State Legislature`,
        weight: RACE_WEIGHTS.state_leg,
        baselineLean: stLean,
        vacancyReason: 'Scheduled Odd-Year State Legislative Election',
        incumbentParty: curLeg[0] || (stLean >= 0 ? 'people' : 'heritage'),
        candidates: buildRaceCandidates(game, legId, stId, `${seed}:${oddYear}:leg:${stId}`),
        playerLift: 0,
        rivalLift: 0,
        adBuys: 0,
        surrogateUsed: false,
        surrogateId: null,
        surrogateName: null,
        oppoUsed: false,
        result: null,
      });
    });
    return races;
  }

  function buildDefaultOddYearRaces(game, oddYear) {
    const mod = ((Number(oddYear) % 4) + 4) % 4;
    if (mod === 1) {
      const scheduled = buildScheduledStateRaces(game, oddYear, SCHEDULED_STATES_MOD1);
      const specials = pickFederalVacancyFor4n1(game, oddYear);
      return [...scheduled, ...specials];
    }
    const scheduled = buildScheduledStateRaces(game, oddYear, SCHEDULED_STATES_MOD3);
    const specials = pickFederalVacancyFor4n3(game, oddYear);
    return [...scheduled, ...specials];
  }

  function normalizeInjectedRace(game, race, idx, oddYear) {
    const stId = race.stateId || 'VA';
    const kind = race.kind || 'governor';
    const id = race.id || `oc-${oddYear}-${kind}-${stId}-${idx}`;
    const weight = Number.isFinite(Number(race.weight)) ? Number(race.weight) : (RACE_WEIGHTS[kind] ?? 1.0);
    const baselineLean = Number.isFinite(Number(race.baselineLean)) ? Number(race.baselineLean) : round(getStateLeanPercent(stId), 2);
    return {
      id,
      oddYear: Number(race.oddYear || oddYear),
      kind,
      stateId: stId,
      districtId: race.districtId || null,
      senateClass: race.senateClass || null,
      title: race.title || `${stId} ${kind}`,
      weight,
      baselineLean,
      vacancyReason: race.vacancyReason || 'Historical Odd-Year Election',
      incumbentParty: race.incumbentParty || (baselineLean >= 0 ? 'people' : 'heritage'),
      candidates: race.candidates && typeof race.candidates === 'object'
        ? race.candidates
        : buildRaceCandidates(game, id, stId, `${game?.seed || 2028}:${oddYear}:custom:${id}`),
      playerLift: Number(race.playerLift || 0),
      rivalLift: Number(race.rivalLift || 0),
      adBuys: Number(race.adBuys || 0),
      surrogateUsed: Boolean(race.surrogateUsed),
      surrogateId: race.surrogateId || null,
      surrogateName: race.surrogateName || null,
      oppoUsed: Boolean(race.oppoUsed),
      result: race.result || null,
    };
  }

  // --------------------------------------------------------------------------
  // Section 4.1 & 4.2: Initialize Off-Cycle Interlude
  // --------------------------------------------------------------------------

  function initializeOffCycleInterlude(game, oddYear = null) {
    // [PERF-STRESS-FIX] B3-02: do not enter off-cycle interlude if party has already collapsed
    if (!game || typeof game !== 'object' || game.gameOver) return game;
    const fromYear = Number(game.year || 2028);
    const resolvedOddYear = Number.isFinite(Number(oddYear)) ? Number(oddYear) : (fromYear + 1);
    const nextFederalYear = fromYear + 2;

    // Section 4.2 Future-Proofing Hook: honor TimeEngine.getOddYearRaces if non-empty
    let races = null;
    if (root.TimeEngine && typeof root.TimeEngine.getOddYearRaces === 'function') {
      const overridden = root.TimeEngine.getOddYearRaces(game, resolvedOddYear);
      if (Array.isArray(overridden) && overridden.length > 0) {
        races = overridden.map((r, idx) => normalizeInjectedRace(game, r, idx, resolvedOddYear));
      }
    }
    if (!races) {
      races = buildDefaultOddYearRaces(game, resolvedOddYear);
    }

    const offCycle = {
      active: true,
      oddYear: resolvedOddYear,
      fromYear,
      nextFederalYear,
      posture: null,
      actionsRemaining: BASE_ACTIONS,
      maxActions: BASE_ACTIONS,
      partyBuildingSpent: 0,
      electionActionsSpent: 0,
      donorRetreatsUsed: 0,
      resolved: false,
      races,
      scoutedCandidates: [],
      rivalSummary: null,
      actionLog: [],
      summary: null,
    };

    return {
      ...game,
      phase: 'off-cycle-interlude',
      activeAutopsyModal: false,
      offCycle,
      lastNote: `${resolvedOddYear} Off-Cycle Interlude begins (${races.length} active odd-year contests). Choose a Strategic Posture and spend your ${BASE_ACTIONS}-action budget.`,
    };
  }

  // --------------------------------------------------------------------------
  // Section 3.1 & 3.3: Posture & Dual-Track Action Handlers
  // --------------------------------------------------------------------------

  function setPosture(game, postureId) {
    if (!game?.offCycle || !game.offCycle.active || game.offCycle.resolved) return game;
    const spec = POSTURES[postureId];
    if (!spec) {
      return { ...game, lastNote: `Unknown off-cycle posture: ${postureId}.` };
    }
    const oc = game.offCycle;
    const totalSpent = (oc.partyBuildingSpent || 0) + (oc.electionActionsSpent || 0);
    if (totalSpent > 0 && oc.posture && oc.posture !== postureId) {
      return { ...game, lastNote: 'Cannot switch Off-Cycle Strategic Posture after actions have already been spent.' };
    }
    const nextMax = spec.maxActions;
    const nextRem = Math.max(0, nextMax - totalSpent);
    return {
      ...game,
      offCycle: {
        ...oc,
        posture: spec.id,
        maxActions: nextMax,
        actionsRemaining: nextRem,
        actionLog: [
          ...(oc.actionLog || []),
          { actor: resolvePlayerPartyId(game), actionId: 'oc-set-posture', posture: spec.id, note: `Adopted ${spec.label}.` },
        ],
      },
      lastNote: `Adopted ${spec.label}: ${spec.summary}`,
    };
  }

  function checkActionBudgetAndPosture(game, track, cashCost) {
    const oc = game?.offCycle;
    if (!oc || !oc.active || oc.resolved) {
      return { ok: false, reason: 'Off-Cycle Interlude is not active or is already resolved.' };
    }
    if ((oc.actionsRemaining || 0) < 1) {
      return { ok: false, reason: 'No off-cycle actions remaining.' };
    }
    const treasury = Number(game.treasury || 0);
    if (cashCost > 0 && treasury + 1e-6 < cashCost) {
      return { ok: false, reason: `Insufficient funds ($${cashCost.toFixed(1)}M required, $${treasury.toFixed(1)}M available).` };
    }
    const posture = oc.posture || 'balanced';
    const postSpec = POSTURES[posture] || POSTURES.balanced;
    // Enforce minimum track requirement before allowing the final action to violate it
    if ((oc.actionsRemaining || 0) === 1) {
      if (postSpec.minPartyBuilding > 0 && (oc.partyBuildingSpent || 0) < postSpec.minPartyBuilding && track !== 'party') {
        return { ok: false, reason: 'Party-Building Focus requires at least 1 action on Party Building.' };
      }
      if (postSpec.minElection > 0 && (oc.electionActionsSpent || 0) < postSpec.minElection && track !== 'election') {
        return { ok: false, reason: 'Special-Election Blitz requires at least 1 action on Off-Cycle Races.' };
      }
    }
    return { ok: true, posture };
  }

  function applyPartyBuildingAction(game, actionId, payload = {}) {
    const playerPid = resolvePlayerPartyId(game);
    const tier = getPartyTier(game, playerPid);
    const cashCost = getActionCashCost(game, actionId, playerPid);
    // [v0.18.7 QA-FIX] BUG-06: Enforce MAX_STATE_CHAPTERS = 25 before deducting action/cash
    if (actionId === 'oc-chapter-drive') {
      const preStateId = payload.stateId || game?.offCycle?.races?.[0]?.stateId || 'VA';
      const preChap = getStateChaptersCount(game, preStateId, playerPid);
      if (preChap >= MAX_STATE_CHAPTERS) {
        return { ...game, lastNote: `Max Chapters Reached (${preChap}/${MAX_STATE_CHAPTERS}) in ${preStateId}.` };
      }
    }
    const check = checkActionBudgetAndPosture(game, 'party', cashCost);
    if (!check.ok) {
      return { ...game, lastNote: check.reason };
    }

    const oc = game.offCycle;
    const effectivePosture = oc.posture || check.posture;
    let working = { ...game };
    let note = '';

    if (actionId === 'oc-donor-retreat') {
      if ((oc.donorRetreatsUsed || 0) >= 2) {
        return { ...game, lastNote: 'Early Donor & Bundler Retreat is limited to 2 uses per interlude.' };
      }
      const gain = DONOR_RETREAT_YIELDS[tier] ?? 0.5;
      const nextTreasury = round(Number(working.treasury || 0) + gain, 2);
      working.treasury = nextTreasury;
      note = `Hosted Early Donor & Bundler Retreat (+$${gain.toFixed(1)}M treasury).`;
      return {
        ...working,
        offCycle: {
          ...oc,
          posture: effectivePosture,
          actionsRemaining: oc.actionsRemaining - 1,
          partyBuildingSpent: (oc.partyBuildingSpent || 0) + 1,
          donorRetreatsUsed: (oc.donorRetreatsUsed || 0) + 1,
          actionLog: [...(oc.actionLog || []), { actor: playerPid, actionId, gain, note }],
        },
        lastNote: note,
      };
    }

    if (actionId === 'oc-chapter-drive') {
      const targetStateId = payload.stateId || oc.races?.[0]?.stateId || 'VA';
      const stObj = getStateObj(targetStateId);
      const region = stObj.region || 'South';
      const nextStateOrgs = JSON.parse(JSON.stringify(working.stateOrganizations || {}));
      nextStateOrgs[targetStateId] ||= {};
      const prevChap = getStateChaptersCount(working, targetStateId, playerPid);
      // [v0.18.7 QA-FIX] BUG-06: Cap state chapters at MAX_STATE_CHAPTERS (25)
      if (prevChap >= MAX_STATE_CHAPTERS) {
        return { ...game, lastNote: `Max Chapters Reached (${prevChap}/${MAX_STATE_CHAPTERS}) in ${targetStateId}.` };
      }
      const newChap = Math.min(MAX_STATE_CHAPTERS, prevChap + 2);
      const addedCount = Math.max(0, newChap - prevChap);
      const curStrength = Number(nextStateOrgs[targetStateId]?.[playerPid]?.strength || 0);
      nextStateOrgs[targetStateId][playerPid] = {
        ...(nextStateOrgs[targetStateId][playerPid] || {}),
        chapters: newChap,
        strength: Math.min(100, Math.max(curStrength + 10, newChap * 15 + 10)),
      };
      const nextLocalChapters = Array.isArray(working.localChapters) ? [...working.localChapters] : [];
      for (let i = 1; i <= addedCount; i++) {
        nextLocalChapters.push({
          id: `${playerPid}-${targetStateId}-oc-${oc.oddYear}-${nextLocalChapters.length + i}`,
          name: `${stObj.name || targetStateId} Off-Cycle Chapter`,
          partyId: playerPid,
          stateId: targetStateId,
          region,
          establishedYear: oc.oddYear,
          active: true,
        });
      }
      const nextRegBoosts = { ...(working.stateRegistrationBoosts || {}) };
      nextRegBoosts[targetStateId] = round((nextRegBoosts[targetStateId] || 0) + 0.4, 2);

      const nextVoterDeltas = JSON.parse(JSON.stringify(working.stateVoterDeltas || {}));
      nextVoterDeltas[targetStateId] ||= {};
      nextVoterDeltas[targetStateId][playerPid] = round((nextVoterDeltas[targetStateId][playerPid] || 0) + 0.4, 2);

      working.treasury = round(Number(working.treasury || 0) - cashCost, 2);
      working.stateOrganizations = nextStateOrgs;
      working.stateChapters = { ...(working.stateChapters || {}), [targetStateId]: newChap };
      working.chapters = { ...(working.chapters || {}), [region]: (working.chapters?.[region] || 0) + addedCount };
      working.localChapters = nextLocalChapters;
      working.stateRegistrationBoosts = nextRegBoosts;
      working.stateVoterDeltas = nextVoterDeltas;

      note = `Pre-Primary Chapter Drive in ${targetStateId} opened +${addedCount} chapters (${newChap}/${MAX_STATE_CHAPTERS}) and boosted voter-reg delta +0.4% (-$${cashCost.toFixed(2)}M).`;
      return {
        ...working,
        offCycle: {
          ...oc,
          posture: effectivePosture,
          actionsRemaining: oc.actionsRemaining - 1,
          partyBuildingSpent: (oc.partyBuildingSpent || 0) + 1,
          actionLog: [...(oc.actionLog || []), { actor: playerPid, actionId, stateId: targetStateId, cost: cashCost, note }],
        },
        lastNote: note,
      };
    }

    if (actionId === 'oc-media-buildout') {
      const validChannels = ['broadcast', 'cable', 'digital', 'local'];
      const channel = validChannels.includes(payload.channel) ? payload.channel : 'digital';
      const ms = getMediaSystem();
      let eco = working.mediaEcosystem
        ? JSON.parse(JSON.stringify(working.mediaEcosystem))
        : (ms?.createInitialMediaEcosystem ? ms.createInitialMediaEcosystem(working) : {});
      if (!eco[playerPid]) {
        eco[playerPid] = { broadcast: 35, cable: 35, digital: 35, local: 35, upkeepChannels: [], counterPenalties: [] };
      }
      const prevReach = Number(eco[playerPid][channel] ?? 35);
      const nextReach = clamp(round(prevReach + 3.5, 1), 0, 100);
      eco[playerPid][channel] = nextReach;

      working.treasury = round(Number(working.treasury || 0) - cashCost, 2);
      working.mediaEcosystem = eco;
      note = `Media Infrastructure Buildout raised ${channel} reach to ${nextReach.toFixed(1)} (+3.5, -$${cashCost.toFixed(2)}M).`;
      return {
        ...working,
        offCycle: {
          ...oc,
          posture: effectivePosture,
          actionsRemaining: oc.actionsRemaining - 1,
          partyBuildingSpent: (oc.partyBuildingSpent || 0) + 1,
          actionLog: [...(oc.actionLog || []), { actor: playerPid, actionId, channel, cost: cashCost, nextReach, note }],
        },
        lastNote: note,
      };
    }

    if (actionId === 'oc-faction-mend') {
      const allFactions = Array.isArray(working.factions) ? working.factions.map((f) => ({ ...f })) : [];
      const partyFactions = allFactions.filter((f) => f && f.partyId === playerPid);
      let targetFaction = payload.factionId
        ? partyFactions.find((f) => f.id === payload.factionId || f.legacyId === payload.factionId)
        : null;
      if (!targetFaction && partyFactions.length) {
        targetFaction = partyFactions
          .slice()
          .sort((a, b) => Number(a.happiness ?? 60) - Number(b.happiness ?? 60) || Number(b.frictionIndex || 0) - Number(a.frictionIndex || 0))[0];
      }
      if (!targetFaction) {
        return { ...game, lastNote: 'No eligible party faction found for Coalition Fence-Mending.' };
      }

      const curH = Number(working.factionHappiness?.[targetFaction.id] ?? targetFaction.happiness ?? 60);
      const newH = clamp(round(curH + 8, 1), 0, 100);
      const curFric = Number(targetFaction.frictionIndex || 0);
      const newFric = clamp(round(curFric - 15, 1), 0, 100);
      targetFaction.happiness = newH;
      targetFaction.frictionIndex = newFric;
      if (newFric < 60 && targetFaction.ultimatumTurnsRemaining !== null) {
        targetFaction.ultimatumTurnsRemaining = null;
      }

      const updatedFactions = allFactions.map((f) => (f.id === targetFaction.id ? targetFaction : f));
      const nextFH = { ...(working.factionHappiness || {}), [targetFaction.id]: newH };
      const nextFS = { ...(working.factionStandings || {}), [targetFaction.id]: newH };
      if (targetFaction.name) {
        nextFH[targetFaction.name] = newH;
        nextFS[targetFaction.name] = newH;
      }

      working.treasury = round(Number(working.treasury || 0) - cashCost, 2);
      working.factions = updatedFactions;
      working.factionHappiness = nextFH;
      working.factionStandings = nextFS;
      note = `Coalition Fence-Mending lifted ${targetFaction.name || targetFaction.id} (+8 Happiness -> ${newH}, -15 Friction -> ${newFric}, -$${cashCost.toFixed(2)}M).`;
      return {
        ...working,
        offCycle: {
          ...oc,
          posture: effectivePosture,
          actionsRemaining: oc.actionsRemaining - 1,
          partyBuildingSpent: (oc.partyBuildingSpent || 0) + 1,
          actionLog: [...(oc.actionLog || []), { actor: playerPid, actionId, factionId: targetFaction.id, cost: cashCost, note }],
        },
        lastNote: note,
      };
    }

    if (actionId === 'oc-federal-scout') {
      const targetStateId = payload.stateId || oc.races?.[0]?.stateId || 'PA';
      const stObj = getStateObj(targetStateId);
      const scoutIdx = (oc.scoutedCandidates || []).length + 1;
      const seedKey = `oc-scout:${working.seed || 2028}:${oc.oddYear}:${targetStateId}:${scoutIdx}`;
      const cand = generateDeterministicCandidate(playerPid, targetStateId, seedKey, {
        id: `scout-${playerPid}-${targetStateId}-${oc.oddYear}-${scoutIdx}`,
        minQuality: 7,
        maxQuality: 9,
        minFame: 35,
        maxFame: 55,
      });
      cand.title = `Primary Recruit (${targetStateId})`;
      cand.office = payload.office === 'house' ? 'house' : 'senate';
      cand.stateName = stObj.name || targetStateId;
      cand.vetted = true;
      cand.isScoutedPrimaryRecruit = true;
      cand.scoutedYear = oc.oddYear;

      const nextPols = Array.isArray(working.politicians) ? [...working.politicians, cand] : [cand];
      const nextGen = Array.isArray(working.generatedMembers) ? [...working.generatedMembers, cand] : [cand];
      const nextRecruits = Array.isArray(working.recruitedCandidates) ? [...working.recruitedCandidates, cand.id] : [cand.id];

      working.treasury = round(Number(working.treasury || 0) - cashCost, 2);
      working.politicians = nextPols;
      working.generatedMembers = nextGen;
      working.recruitedCandidates = nextRecruits;
      note = `Scouted high-quality federal primary recruit ${cand.name} (Q${cand.quality}, Fame ${cand.fame}) for ${targetStateId} (-$${cashCost.toFixed(2)}M).`;
      return {
        ...working,
        offCycle: {
          ...oc,
          posture: effectivePosture,
          actionsRemaining: oc.actionsRemaining - 1,
          partyBuildingSpent: (oc.partyBuildingSpent || 0) + 1,
          scoutedCandidates: [...(oc.scoutedCandidates || []), cand],
          actionLog: [...(oc.actionLog || []), { actor: playerPid, actionId, stateId: targetStateId, candidateId: cand.id, cost: cashCost, note }],
        },
        lastNote: note,
      };
    }

    return game;
  }

  function findBestSurrogate(game, usedSurrogateIds) {
    const playerPid = resolvePlayerPartyId(game);
    const sitting = (game?.sittingMembers || []).filter((m) => m && (m.party === playerPid || m.partyId === playerPid || m.caucus === playerPid));
    const elders = (game?.councilOfElders || []).filter((e) => e && (e.party === playerPid || e.partyId === playerPid));
    const leaders = (game?.generatedMembers || []).filter((g) => g && (g.party === playerPid || g.partyId === playerPid));
    const pool = [...sitting, ...elders, ...leaders].filter((p) => p && p.id && !usedSurrogateIds.has(p.id));
    if (pool.length) {
      return pool.sort((a, b) => Number(b.fame || 40) - Number(a.fame || 40))[0];
    }
    return {
      id: `surrogate-chair-${playerPid}`,
      name: game?.customLeader?.name || `${game?.player?.name || 'Party'} Chair`,
      party: playerPid,
      fame: 58,
    };
  }

  function applyElectionPushAction(game, actionId, payload = {}) {
    const playerPid = resolvePlayerPartyId(game);
    const rivalPid = resolvePrimaryRivalId(game);
    const cashCost = getActionCashCost(game, actionId, playerPid);
    const check = checkActionBudgetAndPosture(game, 'election', cashCost);
    if (!check.ok) {
      return { ...game, lastNote: check.reason };
    }

    const oc = game.offCycle;
    const effectivePosture = oc.posture || check.posture;
    const postSpec = POSTURES[effectivePosture] || POSTURES.balanced;
    const targetRaceId = payload.raceId || oc.races?.[0]?.id;
    const raceIndex = (oc.races || []).findIndex((r) => r.id === targetRaceId);
    if (raceIndex < 0) {
      return { ...game, lastNote: 'Target off-cycle race not found.' };
    }
    const race = { ...oc.races[raceIndex] };
    let note = '';

    if (actionId === 'oc-ad-blitz') {
      if ((race.adBuys || 0) >= 2) {
        return { ...game, lastNote: `Special-Election Ad Blitz cap reached (2 buys max) for ${race.title}.` };
      }
      const baseLift = (race.adBuys || 0) === 0 ? 2.2 : 1.1;
      const ms = getMediaSystem();
      const mediaMult = ms?.getAdPersuasionMultiplier ? Number(ms.getAdPersuasionMultiplier(game, playerPid, rivalPid) || 1.0) : 1.0;
      const effectiveLift = round(baseLift * mediaMult * postSpec.electionPersuasionMultiplier, 2);
      race.adBuys = (race.adBuys || 0) + 1;
      race.playerLift = round((race.playerLift || 0) + effectiveLift, 2);
      note = `Special-Election Ad Blitz #${race.adBuys} in ${race.title} (+${effectiveLift.toFixed(2)}% lift, -$${cashCost.toFixed(2)}M).`;
    } else if (actionId === 'oc-turnout-surge') {
      const chapters = getStateChaptersCount(game, race.stateId, playerPid);
      const chapterBonus = chapters >= 2 ? 0.4 : 0;
      const lift = round(1.6 + chapterBonus, 2);
      race.playerLift = round((race.playerLift || 0) + lift, 2);
      note = `Grassroots Turnout Surge in ${race.title} (+${lift.toFixed(2)}% turnout lift${chapterBonus > 0 ? ' incl. +0.4% chapter bonus' : ''}, -$${cashCost.toFixed(2)}M).`;
    } else if (actionId === 'oc-deploy-surrogate') {
      if (race.surrogateUsed) {
        return { ...game, lastNote: `A national surrogate is already deployed to ${race.title}.` };
      }
      const usedSurrogates = new Set((oc.races || []).map((r) => r.surrogateId).filter(Boolean));
      const pool = [
        ...(game.sittingMembers || []),
        ...(game.councilOfElders || []),
        ...(game.generatedMembers || []),
      ];
      let surrogate = payload.politicianId ? pool.find((p) => p && p.id === payload.politicianId) : null;
      if (!surrogate) {
        surrogate = findBestSurrogate(game, usedSurrogates);
      }
      const fameVal = clamp(Number(surrogate.fame ?? 45), 1, 100);
      const baseLift = 1.4 + clamp((fameVal - 20) / 80, 0, 1) * 1.2; // [1.4, 2.6]
      const lift = round(baseLift * postSpec.electionPersuasionMultiplier, 2);
      race.surrogateUsed = true;
      race.surrogateId = surrogate.id;
      race.surrogateName = surrogate.name;
      race.playerLift = round((race.playerLift || 0) + lift, 2);
      note = `Deployed national surrogate ${surrogate.name} (Fame ${fameVal}) to ${race.title} (+${lift.toFixed(2)}% lift).`;
    } else if (actionId === 'oc-oppo-drop') {
      if (race.oppoUsed) {
        return { ...game, lastNote: `Opposition Research Drop already executed in ${race.title}.` };
      }
      race.oppoUsed = true;
      const leadingRivalCand = race.candidates?.[rivalPid] || race.candidates?.heritage || race.candidates?.people || null;
      const traits = Array.isArray(leadingRivalCand?.traits) ? leadingRivalCand.traits : [];
      const hasCleanTrait = traits.some((t) => /clean|integrity/i.test(String(t)));
      const backfireRoll = seededUnit(`oc-oppo:${game.seed || 2028}:${oc.oddYear}:${race.id}`);
      if (hasCleanTrait && backfireRoll < 0.15) {
        race.playerLift = round((race.playerLift || 0) - 0.8, 2);
        note = `Opposition Research Drop in ${race.title} backfired against ${leadingRivalCand?.name || 'rival'}'s Clean/Integrity image (-0.8% self-penalty, -$${cashCost.toFixed(2)}M).`;
      } else {
        const dropImpact = round(1.8 * postSpec.electionPersuasionMultiplier, 2);
        race.rivalLift = round((race.rivalLift || 0) - dropImpact, 2);
        note = `Opposition Research Drop hit rival campaign in ${race.title} (-${dropImpact.toFixed(2)}% rival drag, -$${cashCost.toFixed(2)}M).`;
      }
    } else {
      return game;
    }

    const nextRaces = oc.races.map((r, idx) => (idx === raceIndex ? race : r));
    return {
      ...game,
      treasury: round(Number(game.treasury || 0) - cashCost, 2),
      offCycle: {
        ...oc,
        posture: effectivePosture,
        actionsRemaining: oc.actionsRemaining - 1,
        electionActionsSpent: (oc.electionActionsSpent || 0) + 1,
        races: nextRaces,
        actionLog: [...(oc.actionLog || []), { actor: playerPid, actionId, raceId: race.id, cost: cashCost, note }],
      },
      lastNote: note,
    };
  }

  // --------------------------------------------------------------------------
  // Section 3.5: Symmetric Rival AI Allocator
  // --------------------------------------------------------------------------

  function runRivalOffCycleAllocator(game, oc) {
    const rivalPid = resolvePrimaryRivalId(game);
    const tier = getPartyTier(game, rivalPid);
    let aiTreasury = Number(game?.parties?.[rivalPid]?.treasury ?? game?.organizations?.[rivalPid]?.treasury ?? (tier >= 5 ? 80 : 18));
    if (!Number.isFinite(aiTreasury)) aiTreasury = 18;
    const TREASURY_FLOOR = 2.0;

    const competitiveRaces = (oc.races || []).filter((r) => Math.abs(Number(r.baselineLean || 0)) <= 10);
    let aiPosture = 'balanced';
    let targetElectionCount = 1;
    let targetPartyCount = 3;

    if (competitiveRaces.length >= 2 && aiTreasury >= 12.0) {
      aiPosture = 'special_blitz';
      targetElectionCount = 3;
      targetPartyCount = 2; // 5 actions total under blitz (3 election + 1-2 party building)
    } else if (competitiveRaces.length === 1) {
      aiPosture = 'balanced';
      targetElectionCount = 2;
      targetPartyCount = 2;
    } else {
      aiPosture = 'party_building';
      targetElectionCount = 1;
      targetPartyCount = 4;
    }

    const aiPostSpec = POSTURES[aiPosture];
    let actionsLeft = aiPostSpec.maxActions;
    const rivalLogs = [];
    const races = (oc.races || []).map((r) => ({ ...r, aiAdBuys: 0 }));

    // Bellwether-leverage x competitiveness sorting
    const scoreOcRace = (r) => Math.exp(-0.5 * Math.pow(Math.abs(Number(r.baselineLean || 0)) / 8.0, 2)) * (Number(r.weight || 1.0) * 1.5 + 1.0);
    const sortedRaces = races
      .slice()
      .sort((a, b) => scoreOcRace(b) - scoreOcRace(a));

    // [v0.18.7 QA-FIX] BUG-04: Cap rival single-race lift at +4.5%
    const MAX_RIVAL_RACE_LIFT = 4.5;
    let elecSpent = 0;
    for (let i = 0; i < sortedRaces.length && elecSpent < targetElectionCount && actionsLeft > 0; i++) {
      const target = sortedRaces[i];
      const raceRef = races.find((r) => r.id === target.id);
      if (!raceRef || Number(raceRef.rivalLift || 0) >= MAX_RIVAL_RACE_LIFT) continue;
      const adCost = getActionCashCost(game, 'oc-ad-blitz', rivalPid, aiPosture);
      if (aiTreasury - adCost >= TREASURY_FLOOR && raceRef.aiAdBuys < 2) {
        aiTreasury = round(aiTreasury - adCost, 2);
        raceRef.aiAdBuys += 1;
        const lift = round(2.2 * aiPostSpec.electionPersuasionMultiplier, 2);
        raceRef.rivalLift = Math.min(MAX_RIVAL_RACE_LIFT, round((raceRef.rivalLift || 0) + lift, 2));
        actionsLeft -= 1;
        elecSpent += 1;
        rivalLogs.push(`Rival (${rivalPid}) ran Ad Blitz in ${raceRef.title} (+${lift.toFixed(2)}%).`);
      } else {
        const surgeCost = getActionCashCost(game, 'oc-turnout-surge', rivalPid, aiPosture);
        if (aiTreasury - surgeCost >= TREASURY_FLOOR) {
          aiTreasury = round(aiTreasury - surgeCost, 2);
          raceRef.rivalLift = Math.min(MAX_RIVAL_RACE_LIFT, round((raceRef.rivalLift || 0) + 1.6, 2));
          actionsLeft -= 1;
          elecSpent += 1;
          rivalLogs.push(`Rival (${rivalPid}) ran Turnout Surge in ${raceRef.title} (+1.60%).`);
        }
      }
    }

    let partySpent = 0;
    let nextStateOrgs = game.stateOrganizations ? JSON.parse(JSON.stringify(game.stateOrganizations)) : {};
    while (actionsLeft > 0 && partySpent < targetPartyCount) {
      const chapCost = getActionCashCost(game, 'oc-chapter-drive', rivalPid, aiPosture);
      const openRaceState = sortedRaces.find((r) => Number(nextStateOrgs[r.stateId]?.[rivalPid]?.chapters || 1) < MAX_STATE_CHAPTERS);
      if (aiTreasury - chapCost >= TREASURY_FLOOR && openRaceState) {
        const stId = openRaceState.stateId;
        aiTreasury = round(aiTreasury - chapCost, 2);
        nextStateOrgs[stId] ||= {};
        const prevC = Number(nextStateOrgs[stId]?.[rivalPid]?.chapters || 1);
        const newC = Math.min(MAX_STATE_CHAPTERS, prevC + 2);
        nextStateOrgs[stId][rivalPid] = {
          ...(nextStateOrgs[stId][rivalPid] || {}),
          chapters: newC,
          strength: Math.min(100, Math.max(Number(nextStateOrgs[stId]?.[rivalPid]?.strength || 0) + 10, newC * 15 + 10)),
        };
        actionsLeft -= 1;
        partySpent += 1;
        rivalLogs.push(`Rival (${rivalPid}) built +${newC - prevC} chapters in ${stId}.`);
      } else {
        // Free Donor Retreat
        aiTreasury = round(aiTreasury + (DONOR_RETREAT_YIELDS[tier] ?? 1.5), 2);
        actionsLeft -= 1;
        partySpent += 1;
        rivalLogs.push(`Rival (${rivalPid}) held Donor Retreat.`);
      }
    }

    // If any actions remain under Blitz/Balanced, invest on top race (strictly <= MAX_RIVAL_RACE_LIFT)
    for (let i = 0; i < sortedRaces.length && actionsLeft > 0; i++) {
      const raceRef = races.find((r) => r.id === sortedRaces[i].id);
      if (!raceRef || Number(raceRef.rivalLift || 0) >= MAX_RIVAL_RACE_LIFT) continue;
      const surgeCost = getActionCashCost(game, 'oc-turnout-surge', rivalPid, aiPosture);
      if (aiTreasury - surgeCost >= TREASURY_FLOOR) {
        aiTreasury = round(aiTreasury - surgeCost, 2);
        raceRef.rivalLift = Math.min(MAX_RIVAL_RACE_LIFT, round((raceRef.rivalLift || 0) + 1.6, 2));
        actionsLeft -= 1;
        rivalLogs.push(`Rival (${rivalPid}) reinforced ${raceRef.title} (+1.60%).`);
      } else {
        break;
      }
    }

    return {
      rivalPid,
      aiPosture,
      aiTreasury: Math.max(0, round(aiTreasury, 2)),
      rivalTurnoutEdge: aiPostSpec.rivalTurnoutEdge,
      races,
      stateOrganizations: nextStateOrgs,
      rivalLogs,
    };
  }

  // --------------------------------------------------------------------------
  // Section 3.4: Race Resolution, Bellwether Math & Live State Updates
  // --------------------------------------------------------------------------

  function resolveSingleOddYearRace(game, race, rivalPostureEdge, playerPostureEdge, options = {}) {
    const includeNoise = options.includeNoise !== false;
    const playerPid = resolvePlayerPartyId(game);
    const rivalPid = resolvePrimaryRivalId(game);
    const oddYear = race.oddYear || (Number(game?.year || 2028) + 1);
    const seed = game?.seed || 2028;

    // 1. Thermostatic backlash against White House party: -2.0% to -3.5% scaled by approval below 50%
    const whParty = game?.governingParty || game?.lastElection?.presidentialWinner || 'heritage';
    const presApproval = clamp(Number(game?.presidentialApproval ?? 44), 10, 90);
    const whBacklashMag = 2.0 + clamp((50 - presApproval) / 30, 0, 1) * 1.5; // [2.0, 3.5]
    const whSignOnDemScale = whParty === 'people' ? -1 : (whParty === 'heritage' ? 1 : 0);
    const thermostaticShift = whSignOnDemScale * whBacklashMag;

    // 2. Off-cycle ground game & base enthusiasm counts 1.35x (Section 3.2)
    // [v0.18.7 QA-FIX] BUG-04 + [MC-BALANCE-TUNE] MC-02: Boosted chapter contribution within [-3.0, +3.0] guardrail
    const pChapters = getStateChaptersCount(game, race.stateId, playerPid);
    const rChapters = getStateChaptersCount(game, race.stateId, rivalPid);
    const chapterDiff = clamp((pChapters - rChapters) * 0.55 * 1.35, -3.0, 3.0);

    const pSupTrust = Number(game?.trust?.supporters ?? game?.player?.trust?.supporters ?? (getPartyTier(game, playerPid) >= 5 ? 80 : 65));
    const rSupTrust = Number(game?.rivalTrust?.[rivalPid]?.supporters ?? (getPartyTier(game, rivalPid) >= 5 ? 80 : 65));
    const trustDiff = clamp(((pSupTrust - rSupTrust) * 0.08) * 1.35, -2.5, 2.5);

    const rawRivalLift = Number(race.rivalLift || 0);
    const effectiveRivalLift = rawRivalLift > 0 ? Math.min(4.5, rawRivalLift) : rawRivalLift;

    // Deterministic turnout/election-day variance [-1.5, +1.5] (omitted in live preview)
    const noise = includeNoise ? (seededUnit(`oc-resolve:${seed}:${oddYear}:${race.id}`) - 0.5) * 3.0 : 0;

    // 3. Expected Baseline & Actual Player Margin (all 6 party archetypes + Tier 4-5 ascended 3rd parties)
    const baseLeanDem = Number(race.baselineLean || 0); // + Dem (people), - GOP (heritage)
    const candP = race.candidates?.[playerPid];
    const candR = race.candidates?.[rivalPid];
    const candQualDiff = ((Number(candP?.quality ?? 6) - Number(candR?.quality ?? 6)) * 0.4);
    const tier = getPartyTier(game, playerPid);
    // [v0.18.7 QA-FIX] BUG-05: Support Tier 4-5 ascended third/custom parties as full major contenders
    const isMajorContender = ['people', 'heritage'].includes(playerPid) || tier >= 4;

    if (playerPid === 'people' || playerPid === 'heritage') {
      const sign = playerPid === 'people' ? 1 : -1;
      const expectedBaseline = round(baseLeanDem * sign, 2);
      const netPlayerShifts =
        (thermostaticShift * sign)
        + chapterDiff
        + trustDiff
        + candQualDiff
        + Number(race.playerLift || 0)
        - effectiveRivalLift
        + playerPostureEdge
        - rivalPostureEdge
        + noise;

      const actualPlayerMargin = round(expectedBaseline + netPlayerShifts, 2);
      const overperformance = round(actualPlayerMargin - expectedBaseline, 2);
      const winner = actualPlayerMargin >= 0 ? playerPid : rivalPid;

      const playerShare = clamp(round(50 + actualPlayerMargin / 2, 2), 5, 95);
      const rivalShare = round(100 - playerShare, 2);
      const shares = {
        [playerPid]: playerShare,
        [rivalPid]: rivalShare,
      };

      return {
        winner,
        margin: actualPlayerMargin,
        expectedBaseline,
        overperformance,
        shares,
        flipped: Boolean(race.incumbentParty && winner !== race.incumbentParty),
      };
    }

    // Minor / Third / Custom party resolution (and 3-way plurality parity for Tier 4-5 ascended contenders):
    const stVoter = (game?.voterModel?.states || []).find((s) => (s.stateId || s.id) === race.stateId);
    const stTotal = Math.max(1, Number(stVoter?.sampleVoters || stVoter?.representedVoters || 1000000));
    const stMinorVoters = Number(stVoter?.affiliations?.[playerPid] || 0);
    const minorVoterSharePct = (stMinorVoters / stTotal) * 100;
    const baselineMinorShare = isMajorContender
      ? clamp(round(Math.max(minorVoterSharePct, tier >= 5 ? 30.0 : 24.0) + Math.min(6, pChapters * 0.35), 2), 20.0, 44.0)
      : clamp(round(minorVoterSharePct + tier * 1.2 + Math.min(5, pChapters * 0.4), 2), 0.5, 42);

    // Major-party split for the remaining vote pool
    const demVsGopMargin = baseLeanDem + thermostaticShift + noise * 0.5;
    const remPool = Math.max(10, 100 - baselineMinorShare);
    const demBaseShare = round(remPool * clamp(0.5 + demVsGopMargin / 200, 0.15, 0.85), 2);
    const gopBaseShare = round(remPool - demBaseShare, 2);
    const topMajorBaseShare = Math.max(demBaseShare, gopBaseShare);
    const expectedBaseline = round(baselineMinorShare - topMajorBaseShare, 2);

    // Player off-cycle ground-game & lift shifts votes toward player
    const whDragAgainstAscended = (isMajorContender && whParty === playerPid) ? -whBacklashMag : 0;
    const contenderDelta = isMajorContender
      ? (Number(race.playerLift || 0) + chapterDiff + trustDiff + candQualDiff + playerPostureEdge + whDragAgainstAscended + noise)
      : ((Number(race.playerLift || 0) * 1.35) + (chapterDiff > 0 ? chapterDiff * 0.5 : 0) + (trustDiff > 0 ? trustDiff * 0.4 : 0) + candQualDiff + playerPostureEdge + (noise * 0.4));

    const minorActualShare = clamp(
      round(baselineMinorShare + contenderDelta, 2),
      0.5,
      78
    );

    const rivalShiftImpact = effectiveRivalLift + rivalPostureEdge;
    const remAfterActual = Math.max(5, 100 - minorActualShare);
    const adjDemMargin = demVsGopMargin + (rivalPid === 'people' ? rivalShiftImpact : -rivalShiftImpact);
    const finalDemShare = round(remAfterActual * clamp(0.5 + adjDemMargin / 200, 0.10, 0.90), 2);
    const finalGopShare = round(remAfterActual - finalDemShare, 2);

    const shares = {
      people: finalDemShare,
      heritage: finalGopShare,
      [playerPid]: minorActualShare,
    };
    const entries = Object.entries(shares).sort((a, b) => b[1] - a[1]);
    const winner = entries[0][0];
    const topOtherShare = Math.max(finalDemShare, finalGopShare);
    const actualPlayerMargin = round(minorActualShare - topOtherShare, 2);
    const overperformance = round(actualPlayerMargin - expectedBaseline, 2);

    return {
      winner,
      margin: actualPlayerMargin,
      expectedBaseline,
      overperformance,
      shares,
      flipped: Boolean(race.incumbentParty && winner !== race.incumbentParty),
    };
  }

  // [v0.18.7 QA-FIX] BUG-03: Sanitize sittingMembers to guarantee 0 duplicate IDs or duplicate seat slots
  function deduplicateSittingMembers(sittingMembers) {
    if (!Array.isArray(sittingMembers)) return [];
    const byId = new Map();
    const bySeat = new Map();
    const ordered = [];

    const seatKeyFor = (m) => {
      if (!m || !m.office) return null;
      if (m.office === 'governor' && m.stateId) return `governor:${m.stateId}`;
      if (m.office === 'house' && (m.districtId || m.district)) return `house:${m.districtId || m.district}`;
      if (m.office === 'senate' && m.stateId) return `senate:${m.stateId}:class-${m.senateClass || m.class || 1}`;
      if (m.office === 'statewide_executive' && (m.officeId || (m.stateId && m.subOffice))) {
        return `seo:${m.officeId || `${m.stateId}-${m.subOffice}`}`;
      }
      return null;
    };

    sittingMembers.forEach((m) => {
      if (!m || !m.id) return;
      const sk = seatKeyFor(m);
      if (sk && bySeat.has(sk)) {
        const prevIdx = bySeat.get(sk);
        const prev = ordered[prevIdx];
        const curYr = Number(m.electionYear || 0);
        const prevYr = Number(prev?.electionYear || 0);
        if (curYr >= prevYr) {
          if (prev?.id && byId.get(prev.id) === prevIdx) byId.delete(prev.id);
          ordered[prevIdx] = m;
          byId.set(m.id, prevIdx);
        }
        return;
      }
      if (byId.has(m.id)) {
        const prevIdx = byId.get(m.id);
        const prev = ordered[prevIdx];
        const curYr = Number(m.electionYear || 0);
        const prevYr = Number(prev?.electionYear || 0);
        if (curYr >= prevYr) {
          ordered[prevIdx] = m;
          if (sk) bySeat.set(sk, prevIdx);
        }
        return;
      }
      const nextIdx = ordered.length;
      ordered.push(m);
      byId.set(m.id, nextIdx);
      if (sk) bySeat.set(sk, nextIdx);
    });

    return ordered;
  }

  function updateOfficeholderRecords(game, resolvedRaces, oddYear) {
    const nextGovs = { ...(game.governorships || {}) };
    const nextLegs = game.stateLegislatures
      ? Object.fromEntries(Object.entries(game.stateLegislatures).map(([k, v]) => [k, Array.isArray(v) ? [...v] : v]))
      : {};
    let nextSitting = Array.isArray(game.sittingMembers) ? game.sittingMembers.map((m) => ({ ...m })) : [];
    let nextPols = Array.isArray(game.politicians) ? game.politicians.map((p) => ({ ...p })) : [];
    let nextElders = Array.isArray(game.councilOfElders) ? game.councilOfElders.map((e) => ({ ...e })) : [];
    let nextReps = Array.isArray(game.representatives) ? game.representatives.map((r) => ({ ...r })) : [];

    const playerPid = resolvePlayerPartyId(game);

    const adjustFame = (polId, delta) => {
      if (!polId || !delta) return;
      nextSitting = nextSitting.map((m) => (m && m.id === polId ? { ...m, fame: clamp((m.fame || 45) + delta, 1, 100) } : m));
      nextPols = nextPols.map((p) => (p && p.id === polId ? { ...p, fame: clamp((p.fame || 45) + delta, 1, 100) } : p));
      nextElders = nextElders.map((e) => (e && e.id === polId ? { ...e, fame: clamp((e.fame || 45) + delta, 1, 100) } : e));
    };

    resolvedRaces.forEach((race) => {
      const res = race.result;
      if (!res) return;
      const winner = res.winner;
      const winCand = race.candidates?.[winner] || generateDeterministicCandidate(winner, race.stateId, `${oddYear}:win:${race.id}`);

      // Surrogate Fame rules (Section 3.3): Win grants +4 Fame; losing by >8% costs -2 Fame
      if (race.surrogateUsed && race.surrogateId) {
        if (winner === playerPid) {
          adjustFame(race.surrogateId, 4);
        } else if (Number(res.margin || 0) < -8) {
          adjustFame(race.surrogateId, -2);
        }
      }

      if (race.kind === 'governor') {
        nextGovs[race.stateId] = winner;
        const targetId = `governor:${race.stateId}`;
        const stObj = getStateObj(race.stateId);
        const existingIdx = nextSitting.findIndex((m) => m && (m.id === targetId || (m.office === 'governor' && m.stateId === race.stateId)));
        const replacement = {
          ...(existingIdx >= 0 ? nextSitting[existingIdx] : {}),
          id: targetId,
          sittingId: existingIdx >= 0 ? nextSitting[existingIdx].sittingId : `sitting-gov-${race.stateId}`,
          name: winCand.name,
          title: `Governor of ${stObj.name || race.stateId}`,
          party: winner,
          partyId: winner,
          rawParty: winner === 'people' ? 'D' : winner === 'heritage' ? 'R' : String(winner).slice(0, 1).toUpperCase(),
          caucus: winner,
          state: race.stateId,
          stateId: race.stateId,
          stateName: stObj.name || race.stateId,
          office: 'governor',
          officeLabel: 'Governor',
          chamber: 'governor',
          factionId: winCand.factionId || `${winner}_main`,
          quality: winCand.quality || 7,
          fame: winCand.fame || 50,
          traits: winCand.traits || ['Established politician'],
          electionYear: oddYear,
          isIncumbent: true,
        };
        if (existingIdx >= 0) nextSitting[existingIdx] = replacement;
        else nextSitting.push(replacement);
      } else if (race.kind === 'state_leg') {
        const curChambers = nextLegs[race.stateId];
        const chamberCount = Array.isArray(curChambers) && curChambers.length === 1 ? 1 : 2;
        nextLegs[race.stateId] = Array.from({ length: chamberCount }, () => winner);
      } else if (race.kind === 'house_special' && race.districtId) {
        const targetId = `house:${race.districtId}`;
        const stObj = getStateObj(race.stateId);
        const existingIdx = nextSitting.findIndex((m) => m && (m.id === targetId || (m.office === 'house' && (m.districtId === race.districtId || m.district === race.districtId))));
        const replacement = {
          ...(existingIdx >= 0 ? nextSitting[existingIdx] : {}),
          id: targetId,
          sittingId: existingIdx >= 0 ? nextSitting[existingIdx].sittingId : `sitting-house-${race.districtId}`,
          name: winCand.name,
          title: `U.S. Representative (${race.districtId})`,
          party: winner,
          partyId: winner,
          rawParty: winner === 'people' ? 'D' : winner === 'heritage' ? 'R' : String(winner).slice(0, 1).toUpperCase(),
          caucus: winner,
          state: race.stateId,
          stateId: race.stateId,
          stateName: stObj.name || race.stateId,
          district: race.districtId,
          districtId: race.districtId,
          office: 'house',
          officeLabel: 'House',
          chamber: 'house',
          factionId: winCand.factionId || `${winner}_main`,
          quality: winCand.quality || 7,
          fame: winCand.fame || 42,
          traits: winCand.traits || ['Established politician'],
          electionYear: oddYear,
          isIncumbent: true,
        };
        if (existingIdx >= 0) nextSitting[existingIdx] = replacement;
        else nextSitting.push(replacement);

        if (nextReps.length) {
          let repFound = false;
          nextReps = nextReps.map((r) => {
            if (r && (r.districtId === race.districtId || r.id === targetId || r.id === race.districtId)) {
              repFound = true;
              return { ...r, name: winCand.name, party: winner, partyId: winner };
            }
            return r;
          });
          if (!repFound) {
            nextReps.push({ id: targetId, districtId: race.districtId, stateId: race.stateId, name: winCand.name, party: winner, partyId: winner });
          }
        }
      } else if (race.kind === 'senate_special') {
        const sClass = Number(race.senateClass || 1);
        const targetId = `senate:${race.stateId}:class-${sClass}`;
        const stObj = getStateObj(race.stateId);
        let existingIdx = nextSitting.findIndex((m) => m && m.id === targetId);
        if (existingIdx < 0) {
          existingIdx = nextSitting.findIndex((m) => m && m.office === 'senate' && m.stateId === race.stateId);
        }
        const resolvedId = existingIdx >= 0 ? nextSitting[existingIdx].id : targetId;
        const replacement = {
          ...(existingIdx >= 0 ? nextSitting[existingIdx] : {}),
          id: resolvedId,
          sittingId: existingIdx >= 0 ? nextSitting[existingIdx].sittingId : `sitting-sen-${race.stateId}-c${sClass}`,
          name: winCand.name,
          title: `U.S. Senator (${race.stateId})`,
          party: winner,
          partyId: winner,
          rawParty: winner === 'people' ? 'D' : winner === 'heritage' ? 'R' : String(winner).slice(0, 1).toUpperCase(),
          caucus: winner,
          state: race.stateId,
          stateId: race.stateId,
          stateName: stObj.name || race.stateId,
          office: 'senate',
          officeLabel: 'Senate',
          chamber: 'senate',
          class: sClass,
          senateClass: sClass,
          factionId: winCand.factionId || `${winner}_main`,
          quality: winCand.quality || 7,
          fame: winCand.fame || 55,
          traits: winCand.traits || ['Established politician'],
          electionYear: oddYear,
          isIncumbent: true,
        };
        if (existingIdx >= 0) nextSitting[existingIdx] = replacement;
        else nextSitting.push(replacement);
      }
    });

    // [v0.18.7 QA-FIX] BUG-03: Deduplicate sittingMembers across all seats/IDs after off-cycle updates
    return {
      governorships: nextGovs,
      stateLegislatures: nextLegs,
      sittingMembers: deduplicateSittingMembers(nextSitting),
      politicians: nextPols,
      councilOfElders: nextElders,
      representatives: nextReps,
    };
  }

  function buildBellwetherHeadline(bellwetherWave, flips, oddYear, nextFederalYear) {
    if (bellwetherWave >= 2.0) {
      return `${oddYear} Off-Cycle Sweep & Bellwether Surge (${flips} flip${flips === 1 ? '' : 's'}) Fuels Major Wave Heading Into ${nextFederalYear}`;
    }
    if (bellwetherWave >= 0.6) {
      return `${oddYear} Off-Cycle Overperformance (+${bellwetherWave.toFixed(2)} Wave) Builds Tailwind Ahead of ${nextFederalYear}`;
    }
    if (bellwetherWave <= -2.0) {
      return `${oddYear} Off-Cycle Reversal (${bellwetherWave.toFixed(2)} Wave) Alarms Coalition Strategists Before ${nextFederalYear}`;
    }
    if (bellwetherWave <= -0.6) {
      return `${oddYear} Off-Cycle Drag (${bellwetherWave.toFixed(2)} Wave) Signals Headwinds Heading Into ${nextFederalYear}`;
    }
    return `${oddYear} Off-Cycle Contests Split Narrowly (${bellwetherWave >= 0 ? '+' : ''}${bellwetherWave.toFixed(2)} Wave) Ahead of ${nextFederalYear}`;
  }

  function resolveOffCycleInterlude(game) {
    if (!game?.offCycle) return game;
    const oc = game.offCycle;
    if (oc.resolved) return game;

    const playerPid = resolvePlayerPartyId(game);
    const tier = getPartyTier(game, playerPid);
    const playerPosture = oc.posture || 'balanced';
    const playerPostSpec = POSTURES[playerPosture] || POSTURES.balanced;

    // 1. Symmetric Rival AI Allocation (Section 3.5)
    const aiResult = runRivalOffCycleAllocator(game, oc);
    const updatedParties = game.parties ? JSON.parse(JSON.stringify(game.parties)) : null;
    if (updatedParties && updatedParties[aiResult.rivalPid]) {
      updatedParties[aiResult.rivalPid].treasury = aiResult.aiTreasury;
    }
    const updatedOrgs = game.organizations ? JSON.parse(JSON.stringify(game.organizations)) : null;
    if (updatedOrgs && updatedOrgs[aiResult.rivalPid]) {
      updatedOrgs[aiResult.rivalPid].treasury = aiResult.aiTreasury;
    }

    const workingWithAi = {
      ...game,
      stateOrganizations: aiResult.stateOrganizations,
    };

    // 2. Resolve every odd-year race
    const rivalEdge = playerPostSpec.rivalTurnoutEdge || 0;
    const playerEdge = 0;
    const resolvedRaces = aiResult.races.map((race) => {
      const result = resolveSingleOddYearRace(workingWithAi, race, rivalEdge, playerEdge);
      return { ...race, result };
    });

    // 3. Weighted Bellwether Overperformance Score (Section 3.4)
    let weightedSum = 0;
    let totalWeight = 0;
    let flips = 0;
    resolvedRaces.forEach((r) => {
      const w = Number(r.weight || RACE_WEIGHTS[r.kind] || 1.0);
      const ov = Number(r.result?.overperformance || 0);
      weightedSum += w * ov;
      totalWeight += w;
      if (r.result?.flipped) flips += 1;
    });

    const deltaBar = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const bellwetherWave = clamp(round(deltaBar * 0.45, 2), -3.5, 3.5);
    const tierScale = tier >= 5 ? 1.0 : tier >= 3 ? 0.3 : 0.1;
    const donorDelta = round(clamp(round(deltaBar * 2.5, 1), -15, 15) * tierScale, 1);
    const trustDelta = clamp(Math.round(deltaBar * 0.8), -5, 5);
    const headline = buildBellwetherHeadline(bellwetherWave, flips, oc.oddYear, oc.nextFederalYear);

    // 4. Live updates to governorships, stateLegislatures, sittingMembers, representatives
    const officeUpdates = updateOfficeholderRecords(workingWithAi, resolvedRaces, oc.oddYear);

    const summary = {
      oddYear: oc.oddYear,
      nextFederalYear: oc.nextFederalYear,
      deltaBar: round(deltaBar, 2),
      bellwetherWave,
      donorDelta,
      trustDelta,
      flips,
      headline,
      playerWins: resolvedRaces.filter((r) => r.result?.winner === playerPid).length,
      totalRaces: resolvedRaces.length,
    };

    const pendingBellwetherBonus = {
      oddYear: oc.oddYear,
      bellwetherWave,
      donorDelta,
      trustDelta,
      deltaBar: round(deltaBar, 2),
      headline,
      applied: false,
    };

    return {
      ...game,
      ...officeUpdates,
      stateOrganizations: aiResult.stateOrganizations,
      ...(updatedParties ? { parties: updatedParties } : {}),
      ...(updatedOrgs ? { organizations: updatedOrgs } : {}),
      pendingBellwetherBonus,
      offCycle: {
        ...oc,
        posture: playerPosture,
        resolved: true,
        races: resolvedRaces,
        rivalSummary: {
          rivalPid: aiResult.rivalPid,
          posture: aiResult.aiPosture,
          treasuryAfter: aiResult.aiTreasury,
          actions: aiResult.rivalLogs,
        },
        summary,
      },
      lastNote: headline,
    };
  }

  // --------------------------------------------------------------------------
  // Section 2 & 4.2: Complete Interlude & Hand Off Cleanly to year + 2
  // --------------------------------------------------------------------------

  function applyBellwetherBonusToCycleState(game) {
    const bonus = game?.pendingBellwetherBonus;
    if (!bonus || bonus.applied) return game;

    const playerPid = resolvePlayerPartyId(game);
    const playerSign = playerPid === 'heritage' ? -1 : (playerPid === 'people' ? 1 : 0);
    const wave = clamp(Number(bonus.bellwetherWave || 0), -3.5, 3.5);
    const donorDelta = Number(bonus.donorDelta || 0);
    const trustDelta = clamp(Math.round(Number(bonus.trustDelta || 0)), -5, 5);

    const nextEnv = clamp(round(Number(game.nationalEnvironment || 0) + (wave * playerSign), 2), -25, 25);
    const nextTreasury = Math.max(0, round(Number(game.treasury || 0) + donorDelta, 1));
    const curTrust = game.trust || game.player?.trust || { supporters: 80, independents: 50, opponents: 12 };
    const nextSupporters = clamp(round(Number(curTrust.supporters ?? 80) + trustDelta, 1), 0, 100);
    const nextTrust = { ...curTrust, supporters: nextSupporters };

    const nextWaveMomentum = clamp(round(Number(game.waveMomentum || 0) + wave, 2), -10, 10);
    const nextCampaign = game.campaign
      ? { ...game.campaign, waveBonus: round(Number(game.campaign.waveBonus || 0) + wave, 2), waveMomentum: nextWaveMomentum }
      : game.campaign;

    return {
      ...game,
      nationalEnvironment: nextEnv,
      treasury: nextTreasury,
      trust: nextTrust,
      player: game.player ? { ...game.player, trust: nextTrust } : game.player,
      waveMomentum: nextWaveMomentum,
      campaign: nextCampaign,
      pendingBellwetherBonus: { ...bonus, applied: true },
      lastBellwetherSummary: { ...bonus, applied: true },
    };
  }

  function completeOffCycleInterlude(game) {
    if (!game) return game;
    let ready = game;
    if (ready.offCycle && !ready.offCycle.resolved) {
      ready = resolveOffCycleInterlude(ready);
    }
    const closedOffCycle = ready.offCycle
      ? { ...ready.offCycle, active: false }
      : null;
    ready = {
      ...ready,
      offCycle: closedOffCycle,
    };

    const eng = getEngine();
    if (eng && typeof eng.advanceYear === 'function') {
      return eng.advanceYear({ ...ready, phase: 'off-cycle-interlude' });
    }
    if (eng && typeof eng.startNextCycle === 'function') {
      return eng.startNextCycle({ ...ready, phase: 'off-cycle-interlude' });
    }

    // Standalone fallback if engine.js is not loaded
    const nextYear = Number(ready.year || 2028) + 2;
    const withBonus = applyBellwetherBonusToCycleState({
      ...ready,
      year: nextYear,
      phase: 'organizing',
      cycleType: nextYear % 4 === 0 ? 'presidential' : 'midterm',
    });
    return {
      ...withBonus,
      pendingBellwetherBonus: null,
    };
  }

  // --------------------------------------------------------------------------
  // Action Dispatcher Contract
  // --------------------------------------------------------------------------

  function handleAction(game, actionId, payload = {}) {
    // Off-Cycle Unhappy Caucus Member Courting & Faction Recruitment
    if (actionId === 'oc-court-politician') {
      const eng = getEngine();
      if (!eng?.takeAction) return game;
      const tier = getPartyTier(game, 'player');
      const targetId = payload?.memberId || payload?.targetId;
      const target = (game.sittingMembers || []).find((m) => m && (m.id === targetId || m.sittingId === targetId || m.name === targetId));
      const targetHappy = Number(target?.happiness ?? 50);
      if (tier < 3 && (!target || targetHappy > 10)) {
        return { ...game, lastNote: 'Courting sitting lawmakers requires Tier 3 (unless lawmaker Happiness <= 10).' };
      }
      if ((game.offCycle?.actionsRemaining ?? 0) < 1) {
        return { ...game, lastNote: 'No Off-Cycle actions remaining.' };
      }
      const res = eng.takeAction(game, 'court-politician', { memberId: targetId, roleId: payload?.roleId });
      if (res && res !== game && res.sittingMembers !== game.sittingMembers) {
        const nextRem = Math.max(0, Number(game.offCycle?.actionsRemaining ?? 1) - 1);
        return {
          ...res,
          offCycle: {
            ...(res.offCycle || game.offCycle),
            actionsRemaining: nextRem,
            actionLog: [...(game.offCycle?.actionLog || []), { actionId, note: res.lastNote || 'Courted unhappy caucus member.' }].slice(-40),
          },
        };
      }
      return res || game;
    }
    if (actionId === 'oc-court-independent' || actionId === 'oc-drive-wedge') {
      const eng = getEngine();
      if (!eng?.takeAction) return game;
      const tier = getPartyTier(game, 'player');
      if (tier < 4) {
        return { ...game, lastNote: 'Faction recruitment unlocks at Tier 4.' };
      }
      if ((game.offCycle?.actionsRemaining ?? 0) < 1) {
        return { ...game, lastNote: 'No Off-Cycle actions remaining.' };
      }
      const engAction = actionId === 'oc-court-independent' ? 'court-independent-faction' : 'drive-coalition-wedge';
      const tempGame = { ...game, organizingActionsRemaining: Math.max(1, Number(game.offCycle?.actionsRemaining ?? 1)) };
      const res = eng.takeAction(tempGame, engAction, { factionId: payload?.factionId || payload?.id });
      if (res && res !== tempGame && res.treasury !== game.treasury) {
        const nextRem = Math.max(0, Number(game.offCycle?.actionsRemaining ?? 1) - 1);
        return {
          ...res,
          offCycle: {
            ...(res.offCycle || game.offCycle),
            actionsRemaining: nextRem,
            actionLog: [...(game.offCycle?.actionLog || []), { actionId, note: res.lastNote || 'Off-cycle faction diplomacy executed.' }].slice(-40),
          },
        };
      }
      return res || game;
    }
    const canonical = ACTION_ALIAS_MAP[actionId];
    if (!canonical) return null;
    if (canonical === 'oc-set-posture') {
      return setPosture(game, payload?.posture || payload?.id);
    }
    if (canonical === 'oc-resolve') {
      return resolveOffCycleInterlude(game);
    }
    if (canonical === 'oc-complete') {
      return completeOffCycleInterlude(game);
    }
    const spec = ACTION_COSTS[canonical];
    if (!spec) return game;
    if (spec.track === 'party') {
      return applyPartyBuildingAction(game, canonical, payload);
    }
    return applyElectionPushAction(game, canonical, payload);
  }

  // --------------------------------------------------------------------------
  // Phase 2: UI Rendering, Decision Desk & Delegated Bindings
  // --------------------------------------------------------------------------

  const _uiState = {
    oddYear: null,
    selectedRaceId: null,
    chapterStateId: null,
    mediaChannel: 'digital',
    factionId: null,
    scoutStateId: null,
    scoutOffice: 'senate',
    surrogateId: null,
  };

  function safeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getPartyMeta(game, partyId) {
    const pid = (!partyId || partyId === 'player') ? resolvePlayerPartyId(game) : partyId;
    if (pid === 'player' && game?.player) {
      return {
        id: 'player',
        name: game.player.name || 'Custom Party',
        short: game.player.customCode || game.player.partyCode || (game.player.name || 'CUS').slice(0, 3).toUpperCase(),
        color: game.player.color || '#8b5cf6',
      };
    }
    const shortMap = { people: 'DEM', heritage: 'GOP', liberty: 'LIB', green: 'GRN', constitution: 'CON', socialist: 'PFP' };
    const defaultNames = { people: 'Democratic Party', heritage: 'Republican Party', liberty: 'Libertarian Party', green: 'Green Party', constitution: 'Constitution Party', socialist: 'Peace and Freedom Party' };
    const defaultColors = { people: '#3478c7', heritage: '#d94b4b', liberty: '#e2bd45', green: '#55bf78', constitution: '#a84214', socialist: '#d62828' };
    const presets = getData().PARTY_ARCHETYPES || getData().PARTIES || [];
    const found = presets.find((p) => p.id === pid || p.baseTemplateId === pid);
    if (found) {
      return {
        id: pid,
        name: found.name || defaultNames[pid] || String(pid),
        short: shortMap[pid] || pid.slice(0, 3).toUpperCase(),
        color: found.color || defaultColors[pid] || '#94a3b8',
      };
    }
    if (game?.player && (game.player.baseTemplateId === pid || game.player.id === pid)) {
      return {
        id: pid,
        name: game.player.name || defaultNames[pid] || pid,
        short: shortMap[pid] || pid.slice(0, 3).toUpperCase(),
        color: game.player.color || defaultColors[pid] || '#83a8d5',
      };
    }
    return {
      id: pid,
      name: defaultNames[pid] || String(pid || 'Independent'),
      short: shortMap[pid] || String(pid || 'IND').slice(0, 3).toUpperCase(),
      color: defaultColors[pid] || '#94a3b8',
    };
  }

  function formatDemGopLean(leanVal) {
    const n = Number(leanVal || 0);
    if (!Number.isFinite(n) || Math.abs(n) < 0.05) return 'EVEN';
    return `${n > 0 ? 'D+' : 'R+'}${Math.abs(n).toFixed(1)}%`;
  }

  function formatSignedMargin(marginVal) {
    const n = Number(marginVal || 0);
    if (!Number.isFinite(n)) return '0.0%';
    return `${n >= 0 ? '+' : '-'}${Math.abs(n).toFixed(1)}%`;
  }

  function formatRaceKindLabel(kind) {
    if (kind === 'governor') return 'Governor';
    if (kind === 'senate_special') return 'U.S. Senate Special';
    if (kind === 'house_special') return 'U.S. House Special';
    if (kind === 'state_leg') return 'State Legislature';
    return 'Off-Cycle Race';
  }

  function computeLiveBellwetherPreview(game, oc) {
    const postSpec = POSTURES[oc?.posture || 'balanced'] || POSTURES.balanced;
    const rivalEdge = postSpec.rivalTurnoutEdge || 0;
    let weightedSum = 0;
    let totalWeight = 0;
    const projections = {};
    (oc?.races || []).forEach((race) => {
      const proj = resolveSingleOddYearRace(game, race, rivalEdge, 0, { includeNoise: false });
      projections[race.id] = proj;
      const w = Number(race.weight || RACE_WEIGHTS[race.kind] || 1.0);
      weightedSum += w * Number(proj.overperformance || 0);
      totalWeight += w;
    });
    const deltaBar = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const wave = clamp(round(deltaBar * 0.45, 2), -3.5, 3.5);
    return { wave, deltaBar: round(deltaBar, 2), projections };
  }

  function renderBellwetherMeterMarkup(wave, label = 'Projected Bellwether Wave', isFinal = false, oddYear = 2029, nextFederalYear = 2030) {
    const safeWave = clamp(Number(wave || 0), -3.5, 3.5);
    const pctMagnitude = Math.min(50, (Math.abs(safeWave) / 3.5) * 50);
    const leftPct = safeWave >= 0 ? 50 : Math.max(0, 50 - pctMagnitude);
    const tone = safeWave >= 0.35 ? 'positive' : (safeWave <= -0.35 ? 'negative' : 'neutral');
    return `
      <div class="oc-bellwether-card panel" data-ux-tip="off-cycle-bellwether">
        <div class="oc-bellwether-head">
          <div>
            <div class="eyebrow">${safeHtml(isFinal ? `${oddYear} Certified Bellwether` : `${oddYear} Live Bellwether Preview`)} · Heading to ${safeHtml(nextFederalYear)}</div>
            <h3>${safeHtml(label)}</h3>
          </div>
          <span class="oc-wave-pill ${tone}">${safeWave >= 0 ? '+' : ''}${safeWave.toFixed(2)} Wave</span>
        </div>
        <div class="oc-wave-track" aria-label="Bellwether Wave Momentum meter from -3.5 to +3.5">
          <div class="oc-wave-zero"></div>
          <div class="oc-wave-fill ${tone}" style="left:${leftPct.toFixed(1)}%;width:${pctMagnitude.toFixed(1)}%"></div>
        </div>
        <div class="oc-wave-scale">
          <span>-3.5 Headwind</span>
          <span>0.0 Neutral</span>
          <span>+3.5 Tailwind</span>
        </div>
        <p class="oc-bellwether-note">Weighted overperformance across off-cycle governorships, federal specials, and legislative flips shifts your ${safeHtml(nextFederalYear)} national environment, donor windfall, and supporter trust.</p>
      </div>
    `;
  }

  function renderDecisionDesk(game) {
    const oc = game?.offCycle;
    if (!oc) return '';
    const summary = oc.summary || {
      oddYear: oc.oddYear,
      nextFederalYear: oc.nextFederalYear,
      bellwetherWave: 0,
      donorDelta: 0,
      trustDelta: 0,
      flips: 0,
      playerWins: 0,
      totalRaces: (oc.races || []).length,
      headline: `${oc.oddYear} Off-Cycle Contests Resolved`,
    };
    const playerPid = resolvePlayerPartyId(game);
    const wave = clamp(Number(summary.bellwetherWave || 0), -3.5, 3.5);
    const donorDelta = Number(summary.donorDelta || 0);
    const trustDelta = Number(summary.trustDelta || 0);
    const rivalMeta = oc.rivalSummary?.rivalPid ? getPartyMeta(game, oc.rivalSummary.rivalPid) : null;
    const rivalPostureLabel = oc.rivalSummary?.posture && POSTURES[oc.rivalSummary.posture]
      ? POSTURES[oc.rivalSummary.posture].label
      : 'Balanced Split';

    const raceCards = (oc.races || []).map((race) => {
      const res = race.result || { winner: playerPid, margin: 0, overperformance: 0, shares: {}, flipped: false };
      const winMeta = getPartyMeta(game, res.winner);
      const isPlayerWin = res.winner === playerPid;
      const shareChips = Object.entries(res.shares || {})
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .map(([pid, pct]) => {
          const m = getPartyMeta(game, pid);
          return `<span class="oc-share-chip" style="--party:${safeHtml(m.color)}"><i></i><b>${safeHtml(m.short)}</b> ${Number(pct || 0).toFixed(1)}%</span>`;
        }).join('');
      const surNote = race.surrogateUsed && race.surrogateName
        ? (isPlayerWin
          ? `<span class="oc-fame-note positive">Surrogate ${safeHtml(race.surrogateName)}: +4 Fame</span>`
          : (Number(res.margin || 0) < -8
            ? `<span class="oc-fame-note negative">Surrogate ${safeHtml(race.surrogateName)}: -2 Fame</span>`
            : `<span class="oc-fame-note">Surrogate: ${safeHtml(race.surrogateName)}</span>`))
        : '';

      return `
        <article class="oc-desk-race-card ${isPlayerWin ? 'player-win' : ''}">
          <div class="oc-race-card-top">
            <span class="oc-kind-pill">${safeHtml(formatRaceKindLabel(race.kind))} · ${safeHtml(race.stateId)}</span>
            ${res.flipped ? '<span class="oc-flip-badge">SEAT FLIP!</span>' : ''}
          </div>
          <h4>${safeHtml(race.title)}</h4>
          <div class="oc-desk-winner-row">
            <span class="oc-winner-pill" style="--party:${safeHtml(winMeta.color)}"><i></i>Winner: ${safeHtml(winMeta.name)}</span>
            <strong class="${Number(res.margin || 0) >= 0 ? 'pos' : 'neg'}">Your Margin: ${formatSignedMargin(res.margin)}</strong>
          </div>
          <div class="oc-desk-shares">${shareChips}</div>
          <div class="oc-desk-foot">
            <span>Overperformance vs. Baseline: <b class="${Number(res.overperformance || 0) >= 0 ? 'pos' : 'neg'}">${formatSignedMargin(res.overperformance)}</b></span>
            ${surNote}
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="panel oc-decision-desk">
        <div class="oc-desk-banner">
          <div>
            <div class="eyebrow">${safeHtml(oc.oddYear)} Off-Cycle Decision Desk · Final Results</div>
            <h2>${safeHtml(summary.headline)}</h2>
          </div>
          <button type="button" class="button button-gold oc-proceed-btn" id="oc-proceed-next-cycle" data-oc-action="oc-complete">
            Proceed to ${safeHtml(oc.nextFederalYear)} Federal Cycle →
          </button>
        </div>

        <div class="oc-kpi-strip">
          <div class="oc-kpi-card">
            <small>Bellwether Wave Momentum</small>
            <b class="${wave >= 0 ? 'pos' : 'neg'}">${wave >= 0 ? '+' : ''}${wave.toFixed(2)}</b>
            <span>Clamped [-3.5, +3.5] env shift</span>
          </div>
          <div class="oc-kpi-card">
            <small>Donor Windfall / Penalty</small>
            <b class="${donorDelta >= 0 ? 'pos' : 'neg'}">${donorDelta >= 0 ? '+$' : '-$'}${Math.abs(donorDelta).toFixed(1)}M</b>
            <span>Added entering ${safeHtml(oc.nextFederalYear)}</span>
          </div>
          <div class="oc-kpi-card">
            <small>Supporter Trust Shift</small>
            <b class="${trustDelta >= 0 ? 'pos' : 'neg'}">${trustDelta >= 0 ? '+' : ''}${trustDelta}</b>
            <span>Base enthusiasm carryover</span>
          </div>
          <div class="oc-kpi-card">
            <small>Odd-Year Scoreboard</small>
            <b>${safeHtml(summary.playerWins)} / ${safeHtml(summary.totalRaces)} Won</b>
            <span>${safeHtml(summary.flips)} seat flip${summary.flips === 1 ? '' : 's'} recorded</span>
          </div>
        </div>

        ${renderBellwetherMeterMarkup(wave, 'Certified Bellwether Wave Carryover', true, oc.oddYear, oc.nextFederalYear)}

        <div class="oc-desk-section-head">
          <h3>Resolved ${safeHtml(oc.oddYear)} Contests &amp; Live Roster Updates</h3>
          <small>Governors, State Legislatures, and U.S. House/Senate special-election winners are now seated.</small>
        </div>
        <div class="oc-desk-races-grid">${raceCards}</div>

        ${oc.rivalSummary ? `
          <div class="oc-rival-brief">
            <div class="eyebrow">Rival AI Off-Cycle Activity · ${safeHtml(rivalMeta?.name || oc.rivalSummary.rivalPid)} (${safeHtml(rivalPostureLabel)})</div>
            ${(oc.rivalSummary.actions || []).length
              ? `<ul>${oc.rivalSummary.actions.map((line) => `<li>${safeHtml(line)}</li>`).join('')}</ul>`
              : '<p class="quiet-note">Rival held its reserve treasury during the odd year.</p>'}
          </div>
        ` : ''}

        <div class="oc-desk-footer-cta">
          <button type="button" class="button button-gold oc-proceed-btn" data-oc-action="oc-complete">
            Proceed to ${safeHtml(oc.nextFederalYear)} Federal Cycle →
          </button>
        </div>
      </section>
    `;
  }

  function renderScreen(game) {
    let working = game;
    if (!working) return '<main class="screen"><section class="panel section-panel"><h2>No active game state.</h2></section></main>';
    if (!working.offCycle) {
      working = initializeOffCycleInterlude(working, Number(working.year || 2028) + 1);
    }
    const oc = working.offCycle;
    const playerPid = resolvePlayerPartyId(working);
    const playerMeta = getPartyMeta(working, playerPid);
    const tier = getPartyTier(working, playerPid);
    const treasury = Number(working.treasury || 0);
    const totalSpent = (oc.partyBuildingSpent || 0) + (oc.electionActionsSpent || 0);
    const activePostureId = oc.posture;
    const activePostSpec = activePostureId ? POSTURES[activePostureId] : null;
    const effectivePostSpec = activePostSpec || POSTURES.balanced;

    const races = oc.races || [];
    if (_uiState.oddYear !== oc.oddYear) {
      _uiState.oddYear = oc.oddYear;
      _uiState.selectedRaceId = null;
      _uiState.chapterStateId = null;
      _uiState.scoutStateId = null;
      _uiState.factionId = null;
      _uiState.surrogateId = null;
    }
    if (!_uiState.selectedRaceId || !races.some((r) => r.id === _uiState.selectedRaceId)) {
      _uiState.selectedRaceId = races[0]?.id || null;
    }
    const selectedRace = races.find((r) => r.id === _uiState.selectedRaceId) || races[0] || null;
    const allStates = getStatesList().filter((s) => s.id && s.id !== 'DC');
    const raceStateIds = Array.from(new Set(races.map((r) => r.stateId).filter(Boolean)));
    const orderedStates = [
      ...allStates.filter((s) => raceStateIds.includes(s.id)),
      ...allStates.filter((s) => !raceStateIds.includes(s.id)).sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id)),
    ];
    if (!_uiState.chapterStateId || !orderedStates.some((s) => s.id === _uiState.chapterStateId)) {
      _uiState.chapterStateId = selectedRace?.stateId || orderedStates[0]?.id || 'VA';
    }
    if (!_uiState.scoutStateId || !orderedStates.some((s) => s.id === _uiState.scoutStateId)) {
      _uiState.scoutStateId = selectedRace?.stateId || 'PA';
    }

    const partyFactions = (working.factions || [])
      .filter((f) => f && f.partyId === playerPid)
      .slice()
      .sort((a, b) => Number(working.factionHappiness?.[a.id] ?? a.happiness ?? 60) - Number(working.factionHappiness?.[b.id] ?? b.happiness ?? 60) || Number(b.frictionIndex || 0) - Number(a.frictionIndex || 0));
    if (!_uiState.factionId || !partyFactions.some((f) => f.id === _uiState.factionId)) {
      _uiState.factionId = partyFactions[0]?.id || null;
    }

    const usedSurrogateIds = new Set(races.map((r) => r.surrogateId).filter(Boolean));
    const surrogatePool = [
      ...(working.sittingMembers || []),
      ...(working.councilOfElders || []),
      ...(working.generatedMembers || []),
    ].filter((m) => m && (m.party === playerPid || m.partyId === playerPid || m.caucus === playerPid) && m.id && !usedSurrogateIds.has(m.id))
      .sort((a, b) => Number(b.fame || 40) - Number(a.fame || 40))
      .slice(0, 12);
    const fallbackSurrogate = findBestSurrogate(working, usedSurrogateIds);
    const surrogateOptions = surrogatePool.length ? surrogatePool : [fallbackSurrogate];
    if (!_uiState.surrogateId || !surrogateOptions.some((s) => s.id === _uiState.surrogateId)) {
      _uiState.surrogateId = surrogateOptions[0]?.id || null;
    }

    const preview = !oc.resolved ? computeLiveBellwetherPreview(working, oc) : null;

    const topbarHtml = `
      <header class="topbar">
        <div class="brand"><img class="brand-icon" src="assets/coalition-builder-icon.svg" alt=""> COALITION BUILDER: <i>PARTY CHAIR</i></div>
        <div class="top-status">
          <span style="--party:${safeHtml(playerMeta.color)}" class="status-party">${safeHtml(playerMeta.name)}</span>
          <span class="status-divider"></span>
          <span>${safeHtml(oc.oddYear)} OFF-CYCLE INTERLUDE</span>
          <span class="status-divider"></span>
          <span>TREASURY $${treasury.toFixed(1)}M</span>
          <button type="button" class="text-button" id="open-save-slots-oc" data-dup-id="open-save-slots">Saves (5 Slots)</button>
        </div>
      </header>
    `;

    const headerHtml = `
      <section class="panel oc-header">
        <div class="oc-header-main">
          <div>
            <div class="eyebrow">${safeHtml(oc.fromYear)} → ${safeHtml(oc.nextFederalYear)} Inter-Cycle Bridge · Tier ${tier}</div>
            <h1>${safeHtml(oc.oddYear)} Off-Cycle Interlude · ${oc.resolved ? 'Resolved' : `${oc.actionsRemaining} / ${oc.maxActions} Actions Remaining`}</h1>
            <div class="oc-header-badges">
              <span class="oc-posture-badge ${activePostSpec ? 'active' : 'pending'}">
                Posture: <b>${safeHtml(activePostSpec ? activePostSpec.label : 'Balanced Split (Default — Select Below)')}</b>
              </span>
              <span class="oc-stat-badge">Treasury: <b>$${treasury.toFixed(1)}M</b></span>
              <span class="oc-stat-badge">Track A Spent: <b>${oc.partyBuildingSpent || 0}</b></span>
              <span class="oc-stat-badge">Track B Spent: <b>${oc.electionActionsSpent || 0}</b></span>
            </div>
          </div>
          ${!oc.resolved ? `
            <div class="oc-header-actions">
              <button type="button" class="button button-gold" id="oc-skip-resolve" data-oc-action="oc-resolve">
                Skip / Resolve Off-Cycle Now →
              </button>
            </div>
          ` : ''}
        </div>
        ${working.lastNote ? `<div class="oc-status-wire">${safeHtml(working.lastNote)}</div>` : ''}
      </section>
    `;

    if (oc.resolved) {
      return `${topbarHtml}<main class="screen oc-screen">${headerHtml}${renderDecisionDesk(working)}</main>`;
    }

    const postureCardsHtml = ['party_building', 'special_blitz', 'balanced'].map((pid) => {
      const spec = POSTURES[pid];
      const isSelected = activePostureId === pid;
      const isLockedOut = totalSpent > 0 && activePostureId && !isSelected;
      return `
        <button type="button" class="oc-posture-card ${isSelected ? 'selected' : ''}" data-oc-posture="${safeHtml(pid)}" ${isLockedOut ? 'disabled' : ''}>
          <div class="oc-posture-card-head">
            <b>${safeHtml(spec.label)}</b>
            <span class="oc-posture-budget">${spec.maxActions} Actions</span>
          </div>
          <small>${safeHtml(spec.summary)}</small>
          <span class="oc-posture-state">${isSelected ? '✓ Active Posture' : isLockedOut ? 'Locked after 1st action' : 'Select Posture'}</span>
        </button>
      `;
    }).join('');

    const posturePickerHtml = `
      <section class="panel oc-posture-panel">
        <div class="oc-section-head">
          <div>
            <div class="eyebrow">Step 1 · Strategic Posture (Free Selection Before Spending)</div>
            <h2>Choose Your ${safeHtml(oc.oddYear)} Off-Cycle Posture</h2>
          </div>
          <span class="muted-count">${totalSpent > 0 ? 'Posture locked for remaining actions' : 'Free to switch before your 1st action'}</span>
        </div>
        <div class="oc-posture-grid">${postureCardsHtml}</div>
      </section>
    `;

    const raceCardsHtml = races.map((race) => {
      const proj = preview.projections[race.id] || { margin: 0, expectedBaseline: 0, overperformance: 0, winner: playerPid, shares: {} };
      const isSelected = selectedRace && selectedRace.id === race.id;
      const incMeta = getPartyMeta(working, race.incumbentParty);
      const projWinnerMeta = getPartyMeta(working, proj.winner);
      const pChapters = getStateChaptersCount(working, race.stateId, playerPid);
      const candEntries = Object.entries(race.candidates || {});
      const candsHtml = candEntries.map(([cid, cand]) => {
        const cm = getPartyMeta(working, cid);
        const traitStr = Array.isArray(cand.traits) && cand.traits.length ? cand.traits.join(', ') : 'Standard';
        return `
          <div class="oc-cand-chip" style="--party:${safeHtml(cm.color)}">
            <span class="oc-cand-party"><i></i>${safeHtml(cm.short)}</span>
            <b>${safeHtml(cand.name)}</b>
            <small>Q${Number(cand.quality || 6)} · Fame ${Number(cand.fame || 40)} · ${safeHtml(traitStr)}</small>
          </div>
        `;
      }).join('');

      return `
        <article class="oc-race-card ${isSelected ? 'selected' : ''}" data-oc-select-race="${safeHtml(race.id)}">
          <div class="oc-race-card-top">
            <div class="oc-race-pills">
              <span class="oc-kind-pill">${safeHtml(formatRaceKindLabel(race.kind))}</span>
              <span class="oc-state-pill">${safeHtml(race.districtId || race.stateId)}</span>
              <span class="oc-weight-pill" title="Bellwether weight">${Number(race.weight || 1).toFixed(1)}× Weight</span>
            </div>
            <button type="button" class="button button-small ${isSelected ? 'button-gold' : ''}" data-oc-select-race="${safeHtml(race.id)}">
              ${isSelected ? 'Targeted ✓' : 'Target Race'}
            </button>
          </div>
          <h3>${safeHtml(race.title)}</h3>
          <p class="oc-vacancy-reason">${safeHtml(race.vacancyReason)} · Incumbent: <b style="color:${safeHtml(incMeta.color)}">${safeHtml(incMeta.short)}</b> · Chapters: <b>${pChapters}</b></p>
          <div class="oc-race-metrics">
            <div><small>Baseline Lean</small><b>${safeHtml(formatDemGopLean(race.baselineLean))}</b></div>
            <div><small>Projected Margin</small><b class="${proj.margin >= 0 ? 'pos' : 'neg'}">${safeHtml(formatSignedMargin(proj.margin))}</b></div>
            <div><small>Projected Leader</small><b style="color:${safeHtml(projWinnerMeta.color)}">${safeHtml(projWinnerMeta.short)}</b></div>
          </div>
          <div class="oc-race-mods">
            <span>Ad Buys: <b>${race.adBuys || 0}/2</b></span>
            <span>Player Lift: <b>+${Number(race.playerLift || 0).toFixed(2)}%</b></span>
            ${race.surrogateUsed ? `<span class="oc-mod-tag">Surrogate: ${safeHtml(race.surrogateName)}</span>` : ''}
            ${race.oppoUsed ? '<span class="oc-mod-tag">Oppo Dropped</span>' : ''}
          </div>
          <div class="oc-cand-list">${candsHtml}</div>
        </article>
      `;
    }).join('');

    const describeAvailability = (track, cashCost, customBlockReason = null) => {
      if (customBlockReason) return { disabled: true, reason: customBlockReason };
      if ((oc.actionsRemaining || 0) < 1) return { disabled: true, reason: 'No actions remaining' };
      if (cashCost > 0 && treasury + 1e-6 < cashCost) return { disabled: true, reason: `Needs $${cashCost.toFixed(1)}M` };
      if ((oc.actionsRemaining || 0) === 1) {
        if (effectivePostSpec.minPartyBuilding > 0 && (oc.partyBuildingSpent || 0) < effectivePostSpec.minPartyBuilding && track !== 'party') {
          return { disabled: true, reason: 'Last action reserved for Track A (Party Building)' };
        }
        if (effectivePostSpec.minElection > 0 && (oc.electionActionsSpent || 0) < effectivePostSpec.minElection && track !== 'election') {
          return { disabled: true, reason: 'Last action reserved for Track B (Off-Cycle Race)' };
        }
      }
      return { disabled: false, reason: '' };
    };

    const chapCost = getActionCashCost(working, 'oc-chapter-drive', playerPid);
    // [v0.18.7 QA-FIX] BUG-06: Disable chapter drive UI when target state reached MAX_STATE_CHAPTERS (25/25)
    const chapCountSelected = getStateChaptersCount(working, _uiState.chapterStateId, playerPid);
    const chapMaxReason = chapCountSelected >= MAX_STATE_CHAPTERS ? `Max Chapters Reached (${chapCountSelected}/${MAX_STATE_CHAPTERS})` : null;
    const chapGuard = describeAvailability('party', chapCost, chapMaxReason);
    const donorGuard = describeAvailability('party', 0, (oc.donorRetreatsUsed || 0) >= 2 ? 'Max 2 retreats reached' : null);
    const donorYield = DONOR_RETREAT_YIELDS[tier] ?? 0.5;
    const mediaCost = getActionCashCost(working, 'oc-media-buildout', playerPid);
    const mediaGuard = describeAvailability('party', mediaCost);
    const mendCost = getActionCashCost(working, 'oc-faction-mend', playerPid);
    const mendGuard = describeAvailability('party', mendCost, !partyFactions.length ? 'No party factions available' : null);
    const scoutCost = getActionCashCost(working, 'oc-federal-scout', playerPid);
    const scoutGuard = describeAvailability('party', scoutCost);

    const adCost = getActionCashCost(working, 'oc-ad-blitz', playerPid);
    const adGuard = describeAvailability('election', adCost, !selectedRace ? 'No active race' : (selectedRace.adBuys || 0) >= 2 ? 'Cap 2/2 reached on race' : null);
    const surgeCost = getActionCashCost(working, 'oc-turnout-surge', playerPid);
    const surgeGuard = describeAvailability('election', surgeCost, !selectedRace ? 'No active race' : null);
    const surGuard = describeAvailability('election', 0, !selectedRace ? 'No active race' : selectedRace.surrogateUsed ? 'Surrogate already deployed' : null);
    const oppoCost = getActionCashCost(working, 'oc-oppo-drop', playerPid);
    const oppoGuard = describeAvailability('election', oppoCost, !selectedRace ? 'No active race' : selectedRace.oppoUsed ? 'Oppo already dropped' : null);

    const selectedStateChapters = selectedRace ? getStateChaptersCount(working, selectedRace.stateId, playerPid) : 0;
    const rivalPid = resolvePrimaryRivalId(working);
    const rivalCandSelected = selectedRace?.candidates?.[rivalPid] || selectedRace?.candidates?.heritage || selectedRace?.candidates?.people || null;
    const rivalHasClean = Array.isArray(rivalCandSelected?.traits) && rivalCandSelected.traits.some((t) => /clean|integrity/i.test(String(t)));

    const actionDeckHtml = `
      <section class="panel oc-actions-panel">
        <div class="oc-track-block">
          <div class="oc-track-head">
            <div>
              <div class="eyebrow">Track A · Pre-Primary Organization</div>
              <h3>Track A: Party Building (Pre-Primary)</h3>
            </div>
            ${activePostureId === 'party_building' ? '<span class="oc-bonus-tag">-20% Chapter &amp; Media Cost</span>' : ''}
          </div>

          <div class="oc-action-card ${chapGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Pre-Primary Chapter Drive</b>
              <span>1 Act · $${chapCost.toFixed(1)}M</span>
            </div>
            <p>+2 state chapters in target state + 0.4% durable state voter-registration boost.</p>
            <div class="oc-action-controls">
              <select id="oc-chapter-state" aria-label="Chapter Drive State">
                ${orderedStates.map((s) => `<option value="${safeHtml(s.id)}" ${_uiState.chapterStateId === s.id ? 'selected' : ''}>${safeHtml(s.id)} — ${safeHtml(s.name || s.id)}${raceStateIds.includes(s.id) ? ' (Active)' : ''}</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-chapter-drive" ${chapGuard.disabled ? 'disabled' : ''}>Run Drive</button>
            </div>
            ${chapGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(chapGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${donorGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Early Donor &amp; Bundler Retreat</b>
              <span>1 Act · Free (${oc.donorRetreatsUsed || 0}/2)</span>
            </div>
            <p>Immediately raises +$${donorYield.toFixed(1)}M treasury (Tier ${tier} yield, max 2 per interlude).</p>
            <div class="oc-action-controls">
              <span class="oc-inline-meta">Yield: <b class="pos">+$${donorYield.toFixed(1)}M</b></span>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-donor-retreat" ${donorGuard.disabled ? 'disabled' : ''}>Host Retreat</button>
            </div>
            ${donorGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(donorGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${mediaGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Media Infrastructure Buildout</b>
              <span>1 Act · $${mediaCost.toFixed(1)}M</span>
            </div>
            <p>+3.5 effective reach in chosen media channel entering federal primaries.</p>
            <div class="oc-action-controls">
              <select id="oc-media-channel" aria-label="Media Infrastructure Channel">
                ${['digital', 'broadcast', 'cable', 'local'].map((ch) => `<option value="${ch}" ${_uiState.mediaChannel === ch ? 'selected' : ''}>${ch.charAt(0).toUpperCase() + ch.slice(1)} Channel</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-media-buildout" ${mediaGuard.disabled ? 'disabled' : ''}>Build Reach</button>
            </div>
            ${mediaGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(mediaGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${mendGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Coalition Fence-Mending</b>
              <span>1 Act · $${mendCost.toFixed(1)}M</span>
            </div>
            <p>+8 Happiness and -15 Friction Index on target faction (averts looming ultimatums).</p>
            <div class="oc-action-controls">
              <select id="oc-faction-select" aria-label="Coalition Fence-Mending Faction">
                ${partyFactions.length
                  ? partyFactions.map((f) => {
                      const fh = Math.round(Number(working.factionHappiness?.[f.id] ?? f.happiness ?? 60));
                      const ff = Math.round(Number(f.frictionIndex || 0));
                      return `<option value="${safeHtml(f.id)}" ${_uiState.factionId === f.id ? 'selected' : ''}>${safeHtml(f.name || f.id)} (H:${fh} F:${ff})</option>`;
                    }).join('')
                  : '<option value="">No Factions</option>'}
              </select>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-faction-mend" ${mendGuard.disabled ? 'disabled' : ''}>Mend Faction</button>
            </div>
            ${mendGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(mendGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${scoutGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Scout Federal Primary Recruit</b>
              <span>1 Act · $${scoutCost.toFixed(1)}M</span>
            </div>
            <p>Vets 1 high-quality (Q7–9, Fame 35–55) primary recruit into target state's bench.</p>
            <div class="oc-action-controls">
              <select id="oc-scout-state" aria-label="Scout State">
                ${orderedStates.map((s) => `<option value="${safeHtml(s.id)}" ${_uiState.scoutStateId === s.id ? 'selected' : ''}>${safeHtml(s.id)}</option>`).join('')}
              </select>
              <select id="oc-scout-office" aria-label="Scout Office">
                <option value="senate" ${_uiState.scoutOffice === 'senate' ? 'selected' : ''}>Senate</option>
                <option value="house" ${_uiState.scoutOffice === 'house' ? 'selected' : ''}>House</option>
              </select>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-federal-scout" ${scoutGuard.disabled ? 'disabled' : ''}>Scout Recruit</button>
            </div>
            ${scoutGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(scoutGuard.reason)}</small>` : ''}
          </div>
        </div>

        <div class="oc-track-divider"></div>

        <!-- Track C: Off-Cycle Caucus Courting & Faction Recruitment -->
        <div class="oc-track-block" id="oc-faction-recruitment">
          <div class="oc-track-head">
            <div>
              <div class="eyebrow">Track C · Off-Cycle Coalitions &amp; Defections</div>
              <h3>Unhappy Caucus Recruitment &amp; Faction Recruitment</h3>
            </div>
            <span class="oc-bonus-tag">${(() => {
              const t = getPartyTier(working, 'player');
              return `Lawmakers: ${t >= 3 ? 'Tier 3+' : 'Tier 3 (or Happiness <= 10)'} · Factions: ${t >= 4 ? 'Tier 4+' : 'Tier 4'}`;
            })()}</span>
          </div>
          ${(() => {
            const pTier = getPartyTier(working, 'player');
            const pPid = resolvePlayerPartyId(working);
            const allNonPlayer = (working.sittingMembers || []).filter((m) => m && !m.vacant && m.party !== pPid);
            const unhappyLawmakers = (pTier < 3
              ? allNonPlayer.filter((m) => Number(m.happiness ?? 50) <= 10)
              : allNonPlayer.filter((m) => m.party === 'independent' || Number(m.happiness ?? 50) <= 40)
            ).slice(0, 25);
            const polLocked = pTier < 3 && unhappyLawmakers.length === 0;
            const facLocked = pTier < 4;
            const indFactions = (working.factions || []).filter((f) => f && ['independent', 'none', 'unaffiliated'].includes(f.partyId));
            const rivalFactions = (working.factions || []).filter((f) => f && f.partyId !== pPid && !['independent', 'none', 'unaffiliated'].includes(f.partyId) && Number(working.factionHappiness?.[f.id] ?? f.happiness ?? 50) < 60).slice(0, 12);
            const noActs = (working.offCycle?.actionsRemaining ?? 0) < 1;
            return `
              <div class="oc-action-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin-top:8px">
                <div class="oc-action-card">
                  <div class="oc-action-head"><b>🤝 Court Unhappy Caucus Member</b><span>1 Act · Free</span></div>
                  <p>${pTier < 3
                    ? 'Tier 3 required (Happiness &le; 10 targets available at any tier).'
                    : 'Recruit a discontent lawmaker now so they run under your party banner in the upcoming election.'}</p>
                  <div class="oc-action-controls">
                    <select id="oc-court-pol-select" aria-label="Unhappy Lawmaker" ${polLocked ? 'disabled' : ''}>
                      ${unhappyLawmakers.length ? unhappyLawmakers.map((m) => `<option value="${safeHtml(m.id)}">${safeHtml(m.name)} (${safeHtml(m.stateId || m.districtId || '')} · ${safeHtml(m.party)} · H:${Math.round(m.happiness ?? 50)})</option>`).join('') : `<option value="">${polLocked ? 'Tier 3 required (or Happiness <= 10)' : 'No unhappy lawmakers available'}</option>`}
                    </select>
                    <button type="button" class="button button-small button-gold" data-oc-action="oc-court-politician" ${polLocked || noActs || !unhappyLawmakers.length ? 'disabled' : ''}>${polLocked ? 'Court Defection (Tier 3 / H ≤ 10)' : 'Court Defection'}</button>
                  </div>
                </div>
                <div class="oc-action-card">
                  <div class="oc-action-head"><b>🏛️ Faction Recruitment (Independent)</b><span>1 Act · $1.5M</span></div>
                  <p>${facLocked ? 'Faction recruitment requires Tier 4.' : 'Build +15 Coalition Goodwill with Independent/Unaffiliated factions during off-cycle realignments.'}</p>
                  <div class="oc-action-controls">
                    <select id="oc-court-fac-select" aria-label="Independent Faction" ${facLocked ? 'disabled' : ''}>
                      ${indFactions.length ? indFactions.map((f) => `<option value="${safeHtml(f.id)}">${safeHtml(f.name)} (Goodwill ${Math.round(working.factionCourtship?.[f.id]?.[pPid] || 0)})</option>`).join('') : '<option value="">No independent factions</option>'}
                    </select>
                    <button type="button" class="button button-small button-gold" data-oc-action="oc-court-independent" ${facLocked || noActs || !indFactions.length || (working.treasury || 0) < 1.5 ? 'disabled' : ''}>${facLocked ? 'Court Faction (Tier 4)' : 'Court Faction'}</button>
                  </div>
                </div>
                <div class="oc-action-card">
                  <div class="oc-action-head"><b>🪓 Drive Off-Cycle Wedge</b><span>1 Act · $2.0M</span></div>
                  <p>${facLocked ? 'Faction courting requires Tier 4.' : 'Destabilize restless rival-party factions during off-cycle years to trigger secessions.'}</p>
                  <div class="oc-action-controls">
                    <select id="oc-wedge-fac-select" aria-label="Rival Faction" ${facLocked ? 'disabled' : ''}>
                      ${rivalFactions.length ? rivalFactions.map((f) => `<option value="${safeHtml(f.id)}">${safeHtml(f.name)} (${safeHtml(f.partyId)})</option>`).join('') : '<option value="">No restless rival factions</option>'}
                    </select>
                    <button type="button" class="button button-small" data-oc-action="oc-drive-wedge" ${facLocked || noActs || !rivalFactions.length || (working.treasury || 0) < 2 ? 'disabled' : ''}>${facLocked ? 'Drive Wedge (Tier 4)' : 'Drive Wedge'}</button>
                  </div>
                </div>
              </div>
            `;
          })()}
        </div>

        <div class="oc-track-divider"></div>

        <div class="oc-track-block">
          <div class="oc-track-head">
            <div>
              <div class="eyebrow">Track B · Live Bellwether Races</div>
              <h3>Track B: Off-Cycle &amp; Special Elections</h3>
            </div>
            ${activePostureId === 'special_blitz' ? '<span class="oc-bonus-tag">+15% Persuasion Lift</span>' : ''}
          </div>

          <div class="oc-target-picker">
            <label for="oc-target-race">Target Active Contest:</label>
            <select id="oc-target-race">
              ${races.map((r) => `<option value="${safeHtml(r.id)}" ${selectedRace?.id === r.id ? 'selected' : ''}>${safeHtml(r.title)} (${safeHtml(formatDemGopLean(r.baselineLean))})</option>`).join('')}
            </select>
          </div>

          <div class="oc-action-card ${adGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Special-Election Ad Blitz</b>
              <span>1 Act · $${adCost.toFixed(1)}M (${selectedRace?.adBuys || 0}/2)</span>
            </div>
            <p>${(selectedRace?.adBuys || 0) === 0 ? '+2.2% vote lift' : '+1.1% diminishing lift'} scaled by media persuasion &amp; posture.</p>
            <div class="oc-action-controls">
              <span class="oc-inline-meta">Target: <b>${safeHtml(selectedRace?.districtId || selectedRace?.stateId || '—')}</b></span>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-ad-blitz" ${adGuard.disabled ? 'disabled' : ''}>Launch Ad Blitz</button>
            </div>
            ${adGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(adGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${surgeGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Grassroots Turnout Surge</b>
              <span>1 Act · $${surgeCost.toFixed(1)}M</span>
            </div>
            <p>+1.6% base turnout lift${selectedStateChapters >= 2 ? ' (+0.4% active chapter bonus = +2.0%)' : ' (+0.4% bonus if ≥2 chapters)'}.</p>
            <div class="oc-action-controls">
              <span class="oc-inline-meta">State Chapters: <b>${selectedStateChapters}</b></span>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-turnout-surge" ${surgeGuard.disabled ? 'disabled' : ''}>Mobilize Surge</button>
            </div>
            ${surgeGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(surgeGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${surGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Deploy National Surrogate</b>
              <span>1 Act · Free (1×/race)</span>
            </div>
            <p>+1.4% to +2.6% lift by Fame; win grants +4 Fame, >8% loss costs -2 Fame.</p>
            <div class="oc-action-controls">
              <select id="oc-surrogate-select" aria-label="Deploy National Surrogate">
                ${surrogateOptions.map((s) => `<option value="${safeHtml(s.id)}" ${_uiState.surrogateId === s.id ? 'selected' : ''}>${safeHtml(s.name)} (Fame ${Math.round(Number(s.fame || 45))})</option>`).join('')}
              </select>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-deploy-surrogate" ${surGuard.disabled ? 'disabled' : ''}>Deploy</button>
            </div>
            ${surGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(surGuard.reason)}</small>` : ''}
          </div>

          <div class="oc-action-card ${oppoGuard.disabled ? 'is-disabled' : ''}">
            <div class="oc-action-top">
              <b>Opposition Research Drop</b>
              <span>1 Act · $${oppoCost.toFixed(1)}M (1×/race)</span>
            </div>
            <p>-1.8% rival vote drag. ${rivalHasClean ? '<span class="oc-warn-inline">⚠ Rival has Clean/Integrity trait (15% -0.8% backfire risk)</span>' : 'Low backfire risk against rival.'}</p>
            <div class="oc-action-controls">
              <span class="oc-inline-meta">Rival: <b>${safeHtml(rivalCandSelected?.name || 'Opponent')}</b></span>
              <button type="button" class="button button-small button-gold" data-oc-action="oc-oppo-drop" ${oppoGuard.disabled ? 'disabled' : ''}>Drop Oppo</button>
            </div>
            ${oppoGuard.reason ? `<small class="oc-disabled-reason">${safeHtml(oppoGuard.reason)}</small>` : ''}
          </div>
        </div>
      </section>
    `;

    const actionLogHtml = (oc.actionLog || []).length ? `
      <section class="panel oc-log-panel">
        <div class="eyebrow">Off-Cycle Action Log</div>
        <div class="oc-log-list">
          ${oc.actionLog.slice(-6).reverse().map((entry) => `<div class="oc-log-item">${safeHtml(entry.note || entry.actionId)}</div>`).join('')}
        </div>
      </section>
    ` : '';

    return `
      ${topbarHtml}
      <main class="screen oc-screen">
        ${headerHtml}
        ${posturePickerHtml}
        <div class="oc-workspace">
          <div class="oc-races-col">
            ${renderBellwetherMeterMarkup(preview.wave, 'Projected Bellwether Momentum', false, oc.oddYear, oc.nextFederalYear)}
            <div class="oc-section-head" style="margin:12px 0 8px">
              <div>
                <div class="eyebrow">Active ${safeHtml(oc.oddYear)} Contests (${races.length})</div>
                <h2>Odd-Year State &amp; Special Election Board</h2>
              </div>
              <span class="muted-count">Click a card to target with Track B actions</span>
            </div>
            <div class="oc-race-list">${raceCardsHtml}</div>
          </div>
          <div class="oc-actions-col">
            ${actionDeckHtml}
            ${actionLogHtml}
          </div>
        </div>
      </main>
    `;
  }

  const _uiBridge = { game: null, ctx: {} };

  function syncUiStateFromDom() {
    if (typeof document === 'undefined') return;
    const chSt = document.getElementById('oc-chapter-state');
    if (chSt?.value) _uiState.chapterStateId = chSt.value;
    const mCh = document.getElementById('oc-media-channel');
    if (mCh?.value) _uiState.mediaChannel = mCh.value;
    const fSel = document.getElementById('oc-faction-select');
    if (fSel?.value) _uiState.factionId = fSel.value;
    const sSt = document.getElementById('oc-scout-state');
    if (sSt?.value) _uiState.scoutStateId = sSt.value;
    const sOff = document.getElementById('oc-scout-office');
    if (sOff?.value) _uiState.scoutOffice = sOff.value;
    const tRace = document.getElementById('oc-target-race');
    if (tRace?.value) _uiState.selectedRaceId = tRace.value;
    const surSel = document.getElementById('oc-surrogate-select');
    if (surSel?.value) _uiState.surrogateId = surSel.value;
  }

  function applyAndCommitAction(actionId, payload = {}) {
    const g = _uiBridge.game;
    if (!g) return;
    const eng = getEngine();
    let next = null;
    if (eng && typeof eng.takeAction === 'function') {
      next = eng.takeAction(g, actionId, payload);
    } else {
      next = handleAction(g, actionId, payload);
    }
    if (!next) return;
    _uiBridge.game = next;
    if (typeof _uiBridge.ctx?.setGame === 'function') _uiBridge.ctx.setGame(next);
    if (typeof _uiBridge.ctx?.saveGame === 'function') _uiBridge.ctx.saveGame(next);
    if (typeof _uiBridge.ctx?.render === 'function') _uiBridge.ctx.render();
    if ((actionId === 'oc-resolve' || actionId === 'oc-complete') && typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }

  function ensureDelegatedListeners() {
    if (typeof document === 'undefined' || global.__offCycleInterludeBound) return;
    global.__offCycleInterludeBound = true;

    document.addEventListener('change', (e) => {
      if (!_uiBridge.game || _uiBridge.game.phase !== 'off-cycle-interlude') return;
      const id = e.target?.id;
      if (!id || !id.startsWith('oc-')) return;
      syncUiStateFromDom();
      if (id === 'oc-target-race' && typeof _uiBridge.ctx?.render === 'function') {
        _uiBridge.ctx.render();
      }
    });

    document.addEventListener('click', (e) => {
      if (!_uiBridge.game || _uiBridge.game.phase !== 'off-cycle-interlude') return;

      const postureBtn = e.target?.closest?.('[data-oc-posture]');
      if (postureBtn) {
        e.preventDefault();
        const posture = postureBtn.getAttribute('data-oc-posture');
        if (posture) applyAndCommitAction('oc-set-posture', { posture });
        return;
      }

      const actionBtn = e.target?.closest?.('[data-oc-action]');
      if (actionBtn) {
        e.preventDefault();
        syncUiStateFromDom();
        const actId = actionBtn.getAttribute('data-oc-action');
        const payload = {
          raceId: actionBtn.getAttribute('data-race-id') || _uiState.selectedRaceId,
        };
        if (actId === 'oc-chapter-drive') {
          payload.stateId = _uiState.chapterStateId;
        } else if (actId === 'oc-media-buildout') {
          payload.channel = _uiState.mediaChannel;
        } else if (actId === 'oc-court-politician') {
          const sel = document.getElementById('oc-court-pol-select');
          payload.memberId = sel ? sel.value : '';
        } else if (actId === 'oc-court-independent') {
          const sel = document.getElementById('oc-court-fac-select');
          payload.factionId = sel ? sel.value : '';
        } else if (actId === 'oc-drive-wedge') {
          const sel = document.getElementById('oc-wedge-fac-select');
          payload.factionId = sel ? sel.value : '';
        } else if (actId === 'oc-faction-mend') {
          payload.factionId = _uiState.factionId;
        } else if (actId === 'oc-federal-scout') {
          payload.stateId = _uiState.scoutStateId;
          payload.office = _uiState.scoutOffice;
        } else if (actId === 'oc-deploy-surrogate') {
          payload.politicianId = _uiState.surrogateId;
        }
        applyAndCommitAction(actId, payload);
        return;
      }

      const selectRaceEl = e.target?.closest?.('[data-oc-select-race]');
      if (selectRaceEl) {
        const rId = selectRaceEl.getAttribute('data-oc-select-race');
        if (rId && rId !== _uiState.selectedRaceId) {
          _uiState.selectedRaceId = rId;
          if (typeof _uiBridge.ctx?.render === 'function') _uiBridge.ctx.render();
        }
      }
    });
  }

  function bindUI(game, ctx = {}) {
    _uiBridge.game = game;
    _uiBridge.ctx = ctx || {};
    ensureDelegatedListeners();
  }

  const api = {
    BASE_ACTIONS,
    MAX_STATE_CHAPTERS,
    POSTURES,
    ACTION_COSTS,
    DONOR_RETREAT_YIELDS,
    RACE_WEIGHTS,
    SCHEDULED_STATES_MOD1,
    SCHEDULED_STATES_MOD3,
    seededUnit,
    deduplicateSittingMembers,
    getActionCashCost,
    getPartyTier,
    initializeOffCycleInterlude,
    setPosture,
    applyPartyBuildingAction,
    applyElectionPushAction,
    resolveOffCycleInterlude,
    applyBellwetherBonusToCycleState,
    completeOffCycleInterlude,
    handleAction,
    renderScreen,
    renderOffCycleScreen: renderScreen,
    renderDecisionDesk,
    bindUI,
  };

  if (typeof window !== 'undefined') {
    window.OffCycleInterludeSystem = api;
  }
  if (typeof global !== 'undefined') {
    global.OffCycleInterludeSystem = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
