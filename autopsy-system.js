// ============================================================================
// COALITION BUILDER: PARTY CHAIR — v0.19.0 POST-CYCLE AUTOPSY ENGINE
// Standalone UMD/IIFE module exposing window.AutopsySystem & module.exports.
// Handles track routing, one-time milestones, hidden Autopsy Points [0..20],
// M1..M10 Major Party scenarios, deterministic 3-of-7 Fisher-Yates draws,
// explicit state naming (<= 5 states), 155M-conserving effect application,
// and player-facing option card rendering.
// ============================================================================
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.AutopsySystem = api;
  } else if (root && typeof root === 'object') {
    root.AutopsySystem = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ELECTORATE_TOTAL = 155000000;

  const STATE_NAMES = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida',
    GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
    IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
    MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
    OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
    SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
    VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
    WY: 'Wyoming'
  };

  const ALL_FIFTY_STATES = Object.keys(STATE_NAMES).filter((s) => s !== 'DC');
  const DEFAULT_SWING_STATES = ['PA', 'MI', 'WI', 'AZ', 'GA', 'NV', 'NC', 'NH', 'MN', 'VA'];
  const DEFAULT_REFORM_STATES = ['AK', 'ME', 'NY', 'CA', 'CO', 'NV', 'OR', 'WA', 'MA', 'UT'];

  const MILESTONE_DEFS = [
    { id: 'firstHouseSeat', points: 1, check: (c) => c.houseSeats >= 1 },
    { id: 'firstStateLegSeat', points: 1, check: (c) => (c.stateHouseSeats + c.stateSenateSeats) >= 1 },
    { id: 'firstStateLegControl', points: 1, check: (c) => c.stateLegChambersControlled >= 1 },
    { id: 'fiveStateLegs', points: 1, check: (c) => c.stateLegChambersControlled >= 5 },
    { id: 'fiveSenate', points: 1, check: (c) => c.senateSeats >= 5 },
    { id: 'fiveGovernors', points: 1, check: (c) => c.governors >= 5 },
    { id: 'tenStateLegs', points: 1, check: (c) => c.stateLegChambersControlled >= 10 },
    { id: 'tenSenate', points: 1, check: (c) => c.senateSeats >= 10 },
    { id: 'tenGovernors', points: 1, check: (c) => c.governors >= 10 },
    { id: 'twentyFiveHouse', points: 1, check: (c) => c.houseSeats >= 25 },
    { id: 'firstSenateSeat', points: 2, check: (c) => c.senateSeats >= 1 },
    { id: 'firstGovernor', points: 2, check: (c) => c.governors >= 1 }
  ];

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function cloneGame(game) {
    return JSON.parse(JSON.stringify(game || {}));
  }

  function defaultSafe(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolvePartyId(game, partyId) {
    if (partyId && partyId !== 'player') return partyId;
    if (game?.player?.custom) return 'player';
    return game?.player?.baseTemplateId || game?.player?.id || 'people';
  }

  function fnv1aHash(str) {
    let h = 0x811c9dc5;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function makeSeededRng(seedStr) {
    let s = fnv1aHash(seedStr) || 0x9e3779b9;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function formatStateList(stateIds) {
    const names = (stateIds || []).map((id) => STATE_NAMES[id] || id);
    if (names.length === 0) return 'key target states';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  }

  function getPartyCounts(game, partyId, election, context) {
    if (context?.counts) {
      return {
        houseSeats: Number(context.counts.houseSeats ?? 0),
        senateSeats: Number(context.counts.senateSeats ?? 0),
        governors: Number(context.counts.governors ?? 0),
        stateHouseSeats: Number(context.counts.stateHouseSeats ?? 0),
        stateSenateSeats: Number(context.counts.stateSenateSeats ?? 0),
        stateLegChambersControlled: Number(context.counts.stateLegChambersControlled ?? 0)
      };
    }

    const pid = resolvePartyId(game, partyId);
    const matchesParty = (val) => {
      if (!val) return false;
      if (val === pid) return true;
      if (pid === 'player' && (val === 'player' || val === game?.player?.id)) return true;
      if (val === 'player' && pid === (game?.player?.baseTemplateId || game?.player?.id)) return true;
      return false;
    };

    // US House seats
    let houseSeats = 0;
    if (election?.houseSeats?.[pid] !== undefined) {
      houseSeats = Number(election.houseSeats[pid]);
    } else if (election?.seats?.[pid] !== undefined) {
      houseSeats = Number(election.seats[pid]);
    } else if (pid === resolvePartyId(game, 'player') && Number.isFinite(Number(game?.seats))) {
      houseSeats = Number(game.seats);
    } else if (game?.organizations?.[pid]?.seats !== undefined) {
      houseSeats = Number(game.organizations[pid].seats);
    } else if (Array.isArray(game?.representatives)) {
      houseSeats = game.representatives.filter((r) => matchesParty(r?.party || r?.partyId)).length;
    }

    // US Senate seats
    let senateSeats = 0;
    if (election?.senateSeats?.[pid] !== undefined) {
      senateSeats = Number(election.senateSeats[pid]);
    } else if (Number.isFinite(Number(game?.senateSeats?.[pid]))) {
      senateSeats = Number(game.senateSeats[pid]);
    } else if (pid === resolvePartyId(game, 'player') && Number.isFinite(Number(game?.senateSeatsCount))) {
      senateSeats = Number(game.senateSeatsCount);
    } else if (Array.isArray(game?.senateRoster)) {
      senateSeats = game.senateRoster.filter((s) => matchesParty(s?.caucus || s?.party || s?.partyId)).length;
    }

    // Governorships
    let governors = 0;
    if (election?.governors?.[pid] !== undefined) {
      governors = Number(election.governors[pid]);
    } else if (game?.governorships && typeof game.governorships === 'object') {
      governors = Object.values(game.governorships).filter((g) => matchesParty(g)).length;
    }

    // State legislatures
    let stateLegChambersControlled = 0;
    if (Number.isFinite(Number(election?.stateLegChambersControlled?.[pid]))) {
      stateLegChambersControlled = Number(election.stateLegChambersControlled[pid]);
    } else if (game?.stateLegislatures && typeof game.stateLegislatures === 'object') {
      Object.values(game.stateLegislatures).forEach((chambers) => {
        if (Array.isArray(chambers)) {
          chambers.forEach((c) => {
            if (matchesParty(c)) stateLegChambersControlled += 1;
          });
        }
      });
    }

    let stateHouseSeats = Number(game?.stateHouseSeatsCount?.[pid] ?? 0);
    let stateSenateSeats = Number(game?.stateSenateSeatsCount?.[pid] ?? 0);
    if (stateHouseSeats === 0 && game?.stateHouseSeatCounts && typeof game.stateHouseSeatCounts === 'object') {
      Object.values(game.stateHouseSeatCounts).forEach((st) => {
        if (st && typeof st === 'object') {
          stateHouseSeats += Number(st[pid] ?? 0);
        }
      });
    }
    if (stateHouseSeats === 0 && stateLegChambersControlled > 0) {
      stateHouseSeats = stateLegChambersControlled;
    }

    return {
      houseSeats,
      senateSeats,
      governors,
      stateHouseSeats,
      stateSenateSeats,
      stateLegChambersControlled
    };
  }

  function getCatalogGlobals(context) {
    const g = typeof globalThis !== 'undefined' ? globalThis : {};
    const w = typeof window !== 'undefined' ? window : {};
    return {
      minorLow: context?.catalogs?.minorLow || w.AutopsyCatalogMinorLow || g.AutopsyCatalogMinorLow || null,
      minorHigh: context?.catalogs?.minorHigh || w.AutopsyCatalogMinorHigh || g.AutopsyCatalogMinorHigh || null,
      major: context?.catalogs?.major || w.AutopsyCatalogMajor || g.AutopsyCatalogMajor || null
    };
  }

  function extractPoolFromCatalog(catalog, key) {
    if (!catalog) return [];
    if (Array.isArray(catalog)) return catalog;
    if (key && Array.isArray(catalog[key])) return catalog[key];
    if (key && catalog.scenarios && Array.isArray(catalog.scenarios[key])) return catalog.scenarios[key];
    if (Array.isArray(catalog.options)) return catalog.options;
    if (Array.isArray(catalog.pool)) return catalog.pool;
    return [];
  }

  // --------------------------------------------------------------------------
  // 1. determineAutopsyTrack
  // --------------------------------------------------------------------------
  function determineAutopsyTrack(game, election, context = {}) {
    let enteringMajorCount = context?.enteringMajorCount ?? election?.enteringMajorCount ?? game?.enteringMajorCount;
    if (!Number.isFinite(Number(enteringMajorCount))) {
      const tiers = game?.enteringPartyTiers || game?.partyTiers || {};
      const majorFromTiers = Object.values(tiers).filter((t) => Number(t) >= 5).length;
      enteringMajorCount = majorFromTiers > 0 ? majorFromTiers : 2;
    } else {
      enteringMajorCount = Number(enteringMajorCount);
    }

    let enteringTier = context?.enteringTier ?? election?.enteringTier ?? game?.enteringTier;
    if (!Number.isFinite(Number(enteringTier))) {
      const pid = resolvePartyId(game, context?.partyId);
      enteringTier = game?.enteringPartyTiers?.[pid] ?? game?.player?.enteringTier ?? game?.player?.tier ?? 5;
    }
    enteringTier = Number(enteringTier);

    if (enteringMajorCount >= 3 || enteringTier < 5) {
      return 'minor';
    }
    return 'major';
  }

  // --------------------------------------------------------------------------
  // 2. evaluateAutopsyMilestones
  // --------------------------------------------------------------------------
  function evaluateAutopsyMilestones(game, partyId, election = null, context = {}) {
    const pid = resolvePartyId(game, partyId);
    const existingMap = JSON.parse(JSON.stringify(game?.autopsyMilestonesEarned || {}));
    const prevRaw = existingMap[pid];
    const earnedSet = new Set(
      Array.isArray(prevRaw)
        ? prevRaw
        : (prevRaw && typeof prevRaw === 'object' ? Object.keys(prevRaw).filter((k) => prevRaw[k]) : [])
    );

    const counts = getPartyCounts(game, pid, election, context);
    const newlyEarnedIds = [];
    let milestonePoints = 0;

    for (const m of MILESTONE_DEFS) {
      if (!earnedSet.has(m.id) && m.check(counts)) {
        earnedSet.add(m.id);
        newlyEarnedIds.push(m.id);
        milestonePoints += m.points;
      }
    }

    existingMap[pid] = [...earnedSet];
    return {
      newlyEarnedIds,
      milestonePoints,
      updatedMilestonesMap: existingMap
    };
  }

  // --------------------------------------------------------------------------
  // 3. computeAutopsyPoints
  // --------------------------------------------------------------------------
  function computeAutopsyPoints(game, election, context = {}) {
    const pid = resolvePartyId(game, context?.partyId);
    const achievedPriorities = clamp(
      Number(context?.achievedPriorities ?? election?.achievedPriorities ?? game?.achievedPriorities ?? 0),
      0,
      3
    );
    const currentTier = clamp(
      Number(context?.currentTier ?? election?.currentTier ?? game?.currentTier ?? game?.player?.tier ?? 0),
      0,
      5
    );
    const enteringTier = clamp(
      Number(context?.enteringTier ?? election?.enteringTier ?? game?.enteringTier ?? game?.enteringPartyTiers?.[pid] ?? currentTier),
      0,
      5
    );

    let milestonePoints = context?.milestonePoints;
    if (!Number.isFinite(Number(milestonePoints))) {
      milestonePoints = evaluateAutopsyMilestones(game, pid, election, context).milestonePoints;
    } else {
      milestonePoints = Number(milestonePoints);
    }

    const rawScore = achievedPriorities + currentTier + Math.max(0, currentTier - enteringTier) * 2 + milestonePoints;
    return clamp(Math.round(rawScore), 0, 20);
  }

  // --------------------------------------------------------------------------
  // 4. determineMajorPartyScenario (M1..M10 strict precedence)
  // --------------------------------------------------------------------------
  function determineMajorPartyScenario(game, election, context = {}) {
    const pid = resolvePartyId(game, context?.partyId);
    const p = Math.max(
      0,
      Number(context?.achievedPriorities ?? election?.achievedPriorities ?? game?.achievedPriorities ?? 0)
    );
    const counts = getPartyCounts(game, pid, election, context);

    const hasPres = Boolean(
      context?.hasPres ??
      election?.hasPres ??
      (election?.presidentParty && election.presidentParty === pid) ??
      (game?.presidentParty && game.presidentParty === pid)
    );
    const hasHouse = Boolean(
      context?.hasHouse ??
      election?.hasHouse ??
      counts.houseSeats >= 218
    );
    const hasSenate = Boolean(
      context?.hasSenate ??
      election?.hasSenate ??
      (counts.senateSeats >= 51 || (counts.senateSeats >= 50 && hasPres))
    );
    const hasTrifecta = Boolean(
      context?.hasTrifecta ??
      election?.hasTrifecta ??
      (hasPres && hasHouse && hasSenate)
    );

    if (p === 0 && !hasPres && !hasHouse && !hasSenate) return 'M1';
    if (p === 0 && !hasPres) return 'M2';
    if (p === 1 && !hasPres) return 'M3';
    if (p === 2 && !hasPres) return 'M4';
    if (p >= 3 && !hasPres) return 'M5';
    if (p === 0 && hasPres) return 'M6';
    if (p === 1 && hasPres) return 'M7';
    if (p === 2 && hasPres) return 'M8';
    if (p >= 3 && hasTrifecta) return 'M10';
    if (p >= 3 && hasPres) return 'M9';
    return 'M2';
  }

  // --------------------------------------------------------------------------
  // 5. resolveTargetStatesForOption
  // --------------------------------------------------------------------------
  function resolveTargetStatesForOption(game, partyId, option) {
    const pid = resolvePartyId(game, partyId);
    const cloned = cloneGame(option || {});
    const targeting = cloned.stateTargeting || null;
    if (!targeting) {
      cloned.resolvedStateIds = cloned.resolvedStateIds || [];
      cloned.resolvedStateNames = cloned.resolvedStateNames || '';
      cloned.summaryText = cloned.summaryText || cloned.summaryTemplate || cloned.description || '';
      return cloned;
    }

    const mode = targeting.mode || 'top_states';
    const count = Number.isFinite(Number(targeting.count)) ? Math.max(1, Number(targeting.count)) : 3;
    const statesList = (typeof window !== 'undefined' && Array.isArray(window.PartyChairData?.STATES))
      ? window.PartyChairData.STATES.map((s) => s.id).filter((id) => id !== 'DC')
      : ALL_FIFTY_STATES;

    let candidateIds = [];

    if (Array.isArray(targeting.explicitStates) && targeting.explicitStates.length > 0) {
      candidateIds = [...targeting.explicitStates];
    } else if (mode === 'all_states') {
      candidateIds = [...statesList];
    } else if (mode === 'top_states') {
      candidateIds = [...statesList].sort((a, b) => {
        const aVal = Number(game?.voterModel?.states?.[a]?.affiliations?.[pid] ?? game?.stateOrganizations?.[a]?.[pid]?.support ?? 0);
        const bVal = Number(game?.voterModel?.states?.[b]?.affiliations?.[pid] ?? game?.stateOrganizations?.[b]?.[pid]?.support ?? 0);
        return bVal - aVal || a.localeCompare(b);
      });
    } else if (mode === 'swing_states') {
      const vmStates = game?.voterModel?.states || {};
      const scored = [...statesList].sort((a, b) => {
        const aP = Number(vmStates[a]?.affiliations?.people ?? 50);
        const aH = Number(vmStates[a]?.affiliations?.heritage ?? 50);
        const bP = Number(vmStates[b]?.affiliations?.people ?? 50);
        const bH = Number(vmStates[b]?.affiliations?.heritage ?? 50);
        const diffA = Math.abs(aP - aH);
        const diffB = Math.abs(bP - bH);
        if (diffA !== diffB) return diffA - diffB;
        const idxA = DEFAULT_SWING_STATES.indexOf(a);
        const idxB = DEFAULT_SWING_STATES.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });
      candidateIds = Object.keys(vmStates).length > 0 ? scored : [...DEFAULT_SWING_STATES, ...statesList];
    } else if (mode === 'uncertified_ballot') {
      const access = game?.ballotAccess?.[pid] || game?.ballotAccess?.player || {};
      candidateIds = statesList.filter((sid) => !access[sid] && !access.presidential?.[sid]);
      if (candidateIds.length === 0) candidateIds = [...DEFAULT_SWING_STATES];
    } else if (mode === 'reform_states') {
      const systems = game?.stateElectoralSystems || {};
      const activeReforms = statesList.filter((sid) => systems[sid] && systems[sid] !== 'fptp');
      candidateIds = activeReforms.length > 0 ? activeReforms : [...DEFAULT_REFORM_STATES];
    } else if (mode === 'lost_statehouse') {
      const legs = game?.stateLegislatures || {};
      const lost = statesList.filter((sid) => {
        const chambers = legs[sid];
        return Array.isArray(chambers) && chambers.some((c) => c && c !== pid);
      });
      candidateIds = lost.length > 0 ? lost : [...DEFAULT_SWING_STATES];
    } else {
      candidateIds = [...statesList];
    }

    // Deduplicate & slice
    const unique = [];
    for (const id of candidateIds) {
      if (id && !unique.includes(id)) unique.push(id);
    }
    const resolvedStateIds = mode === 'all_states' ? unique : unique.slice(0, count);
    cloned.resolvedStateIds = resolvedStateIds;

    // Explicit state naming rule for <= 5 states
    let resolvedStateNames = '';
    if (count <= 5 || (mode !== 'all_states' && resolvedStateIds.length <= 5)) {
      resolvedStateNames = formatStateList(resolvedStateIds);
    } else {
      resolvedStateNames = `${resolvedStateIds.length} states`;
    }
    cloned.resolvedStateNames = resolvedStateNames;

    const template = cloned.summaryTemplate || cloned.summaryText || cloned.description || '';
    if (template.includes('{STATES}')) {
      cloned.summaryText = template.replace(/\{STATES\}/g, resolvedStateNames);
    } else if (count <= 5 && resolvedStateNames && template) {
      cloned.summaryText = `${template} (${resolvedStateNames})`;
    } else {
      cloned.summaryText = template;
    }

    return cloned;
  }

  // --------------------------------------------------------------------------
  // 6. buildPendingAutopsy
  // --------------------------------------------------------------------------
  function buildPendingAutopsy(game, election, context = {}) {
    const pid = resolvePartyId(game, context?.partyId);
    const track = determineAutopsyTrack(game, election, { ...context, partyId: pid });
    const milestoneEval = evaluateAutopsyMilestones(game, pid, election, context);
    const autopsyPoints = computeAutopsyPoints(game, election, {
      ...context,
      partyId: pid,
      milestonePoints: milestoneEval.milestonePoints
    });

    const catalogs = getCatalogGlobals(context);
    let scenarioId = null;
    let bucket = track === 'minor' ? (autopsyPoints < 6 ? 'low' : 'high') : 'major';
    let pool = [];

    if (track === 'minor') {
      const cat = bucket === 'low' ? catalogs.minorLow : catalogs.minorHigh;
      pool = extractPoolFromCatalog(cat, bucket);
    } else {
      scenarioId = determineMajorPartyScenario(game, election, { ...context, partyId: pid });
      bucket = scenarioId;
      pool = extractPoolFromCatalog(catalogs.major, scenarioId);
    }

    // Deterministic Fisher-Yates draw of 3 unique options
    const seed = game?.seed ?? context?.seed ?? 2028;
    const year = election?.year ?? game?.year ?? 2028;
    const rng = makeSeededRng(`${seed}:${year}:${pid}:${bucket}`);
    const shuffled = pool.map((item) => cloneGame(item));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }

    const drawn = shuffled.slice(0, 3).map((opt) => resolveTargetStatesForOption(game, pid, opt));

    return {
      track,
      scenarioId,
      options: drawn,
      updatedMilestonesEarned: milestoneEval.updatedMilestonesMap
    };
  }

  // --------------------------------------------------------------------------
  // 7. applyAutopsyOption (155M Electorate Conservation + Effect Dispatch)
  // --------------------------------------------------------------------------
  function syncThirdPartyTotal(aff) {
    if (!aff || typeof aff !== 'object') return;
    if (aff.thirdParty !== undefined) {
      aff.thirdParty = Math.round(
        Number(aff.liberty || 0) +
        Number(aff.green || 0) +
        Number(aff.constitution || 0) +
        Number(aff.socialist || 0) +
        Number(aff.other || 0)
      );
    }
  }

  function transferElectorateVoters(game, partyId, deltaVoters, targetStateIds) {
    const delta = Math.round(Number(deltaVoters || 0));
    if (!delta || !game?.voterModel) return 0;

    const pid = resolvePartyId(game, partyId);
    const vm = game.voterModel;
    let actualMoved = 0;

    // 1) National affiliations format: vm.affiliations[key].representedVoters
    if (vm.affiliations && typeof vm.affiliations === 'object') {
      const aff = vm.affiliations;
      const partyNode = aff[pid] || (aff[pid] = { name: pid, sampleVoters: 0, representedVoters: 0 });
      const indNode = aff.independent || (aff.independent = { name: 'Independent', sampleVoters: 0, representedVoters: 0 });

      if (delta > 0) {
        const take = Math.min(delta, Math.max(0, Number(indNode.representedVoters || 0)));
        indNode.representedVoters = Math.round(Number(indNode.representedVoters || 0) - take);
        partyNode.representedVoters = Math.round(Number(partyNode.representedVoters || 0) + take);
        actualMoved = take;
        if (take < delta) {
          // Overflow from other non-player parties if independents exhausted
          let rem = delta - take;
          for (const k of Object.keys(aff)) {
            if (rem <= 0) break;
            if (k === pid || k === 'independent' || k === 'thirdParty') continue;
            const avail = Math.max(0, Number(aff[k]?.representedVoters || 0));
            const extra = Math.min(rem, avail);
            if (extra > 0) {
              aff[k].representedVoters = Math.round(avail - extra);
              partyNode.representedVoters = Math.round(Number(partyNode.representedVoters || 0) + extra);
              actualMoved += extra;
              rem -= extra;
            }
          }
        }
      } else {
        const loss = Math.min(Math.abs(delta), Math.max(0, Number(partyNode.representedVoters || 0)));
        partyNode.representedVoters = Math.round(Number(partyNode.representedVoters || 0) - loss);
        indNode.representedVoters = Math.round(Number(indNode.representedVoters || 0) + loss);
        actualMoved = -loss;
      }

      // Sync sampleVoters if 1:1 scale or scaled
      const is1to1 = vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10000000;
      for (const k of Object.keys(aff)) {
        if (aff[k] && typeof aff[k] === 'object' && k !== 'thirdParty') {
          aff[k].sampleVoters = is1to1
            ? Math.round(Number(aff[k].representedVoters || 0))
            : Math.round(Number(aff[k].representedVoters || 0) / 100);
        }
      }
      if (aff.thirdParty && typeof aff.thirdParty === 'object') {
        const tpSum = ['liberty', 'green', 'constitution', 'socialist', 'other'].reduce(
          (s, k) => s + Number(aff[k]?.representedVoters || 0),
          0
        );
        aff.thirdParty.representedVoters = Math.round(tpSum);
        aff.thirdParty.sampleVoters = is1to1 ? Math.round(tpSum) : Math.round(tpSum / 100);
      }
    }

    // 2) State-level affiliations format: vm.states[sid].affiliations[key]
    if (vm.states && typeof vm.states === 'object') {
      const sids = (Array.isArray(targetStateIds) && targetStateIds.length > 0)
        ? targetStateIds.filter((s) => vm.states[s]?.affiliations)
        : Object.keys(vm.states).filter((s) => vm.states[s]?.affiliations);

      if (sids.length > 0) {
        const perState = Math.trunc(delta / sids.length);
        let remainder = delta - perState * sids.length;
        let stateTotalMoved = 0;

        for (const sid of sids) {
          const stAff = vm.states[sid].affiliations;
          const stepDelta = perState + (remainder !== 0 ? Math.sign(remainder) : 0);
          if (remainder !== 0) remainder -= Math.sign(remainder);
          if (!stepDelta) continue;

          if (stepDelta > 0) {
            const availInd = Math.max(0, Number(stAff.independent || 0));
            const take = Math.min(stepDelta, availInd);
            stAff.independent = Math.round(availInd - take);
            stAff[pid] = Math.round(Number(stAff[pid] || 0) + take);
            stateTotalMoved += take;
          } else {
            const availParty = Math.max(0, Number(stAff[pid] || 0));
            const loss = Math.min(Math.abs(stepDelta), availParty);
            stAff[pid] = Math.round(availParty - loss);
            stAff.independent = Math.round(Number(stAff.independent || 0) + loss);
            stateTotalMoved -= loss;
          }
          syncThirdPartyTotal(stAff);
        }
        if (actualMoved === 0) actualMoved = stateTotalMoved;
      }
    }

    return actualMoved;
  }

  function applyAutopsyOption(game, optionId) {
    const next = cloneGame(game);
    const pendingList = Array.isArray(next.pendingAutopsyOptions)
      ? next.pendingAutopsyOptions
      : (Array.isArray(next.pendingAutopsy?.options) ? next.pendingAutopsy.options : []);

    const option = pendingList.find((o) => o && o.id === optionId);
    if (!option) {
      return next;
    }

    const pid = resolvePartyId(next, option.partyId || next.pendingAutopsy?.partyId);
    const resolvedOption = option.resolvedStateIds
      ? option
      : resolveTargetStatesForOption(next, pid, option);
    const targetStates = resolvedOption.resolvedStateIds || [];
    const fx = resolvedOption.effects || resolvedOption;

    // 1. Electorate Voters (strict 155M conservation)
    const voterDelta = Number(fx.addPartyVoters ?? fx.voterGain ?? fx.voterDelta ?? fx.voters ?? 0);
    if (voterDelta !== 0) {
      transferElectorateVoters(next, pid, voterDelta, targetStates);
    }

    // 2. Treasury [0, 250]
    const treasuryDelta = Number(fx.treasuryDelta ?? fx.fundsDelta ?? 0);
    if (treasuryDelta !== 0) {
      next.treasury = clamp(Math.round((Number(next.treasury || 0) + treasuryDelta) * 10) / 10, 0, 250);
    }

    // 3. Trust / Confidence / Approval / Friction / Happiness [0, 100]
    if (fx.trustDelta !== undefined || fx.baseTrustDelta !== undefined || fx.indTrustDelta !== undefined || fx.oppTrustDelta !== undefined) {
      next.trust = next.trust || { base: 50, independents: 50, opponents: 20 };
      const allDelta = Number(fx.trustDelta || 0);
      next.trust.base = clamp(Number(next.trust.base ?? 50) + allDelta + Number(fx.baseTrustDelta || 0), 0, 100);
      next.trust.independents = clamp(Number(next.trust.independents ?? 50) + allDelta + Number(fx.indTrustDelta || 0), 0, 100);
      next.trust.opponents = clamp(Number(next.trust.opponents ?? 20) + Number(fx.oppTrustDelta || 0), 0, 100);
    }

    const happinessDelta = Number(fx.happinessDelta ?? fx.factionHappinessDelta ?? 0);
    if (happinessDelta !== 0) {
      if (next.factionStandings && typeof next.factionStandings === 'object') {
        for (const fid of Object.keys(next.factionStandings)) {
          next.factionStandings[fid] = clamp(Number(next.factionStandings[fid] || 50) + happinessDelta, 0, 100);
        }
      }
      if (next.sittingMemberHappiness !== undefined) {
        next.sittingMemberHappiness = clamp(Number(next.sittingMemberHappiness || 50) + happinessDelta, 0, 100);
      }
    }

    if (fx.confidenceDelta !== undefined) {
      next.chairConfidence = clamp(Number(next.chairConfidence ?? 50) + Number(fx.confidenceDelta || 0), 0, 100);
    }
    if (fx.frictionDelta !== undefined) {
      next.caucusFriction = clamp(Number(next.caucusFriction ?? 0) + Number(fx.frictionDelta || 0), 0, 100);
    }
    if (fx.approvalDelta !== undefined) {
      if (next.leaderApproval !== undefined) {
        next.leaderApproval = clamp(Number(next.leaderApproval || 50) + Number(fx.approvalDelta || 0), 0, 100);
      }
      if (next.partyApproval !== undefined) {
        next.partyApproval = clamp(Number(next.partyApproval || 50) + Number(fx.approvalDelta || 0), 0, 100);
      }
    }

    // 4. Ballot Access
    const ballotStates = Array.isArray(fx.grantBallotAccess)
      ? fx.grantBallotAccess
      : (fx.grantBallotAccess === true ? targetStates : (Array.isArray(fx.ballotAccessStates) ? fx.ballotAccessStates : []));
    if (ballotStates.length > 0) {
      next.ballotAccess = next.ballotAccess || {};
      next.ballotAccess[pid] = next.ballotAccess[pid] || { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} };
      const pa = next.ballotAccess[pid];
      pa.presidential = pa.presidential || {};
      pa.senate = pa.senate || {};
      pa.governor = pa.governor || {};
      pa.house = pa.house || {};
      pa.leg = pa.leg || {};
      for (const sid of ballotStates) {
        pa[sid] = true;
        pa.presidential[sid] = true;
        pa.senate[sid] = true;
        pa.governor[sid] = true;
        pa.house[sid] = true;
        pa.leg[sid] = true;
      }
    }

    // 5. Chapters
    const chaptersDelta = Number(fx.addChapters ?? fx.chaptersDelta ?? 0);
    if (chaptersDelta !== 0 && targetStates.length > 0) {
      next.stateChapters = next.stateChapters || {};
      next.stateOrganizations = next.stateOrganizations || {};
      for (const sid of targetStates) {
        next.stateChapters[sid] = Math.max(0, Number(next.stateChapters[sid] || 0) + chaptersDelta);
        next.stateOrganizations[sid] = next.stateOrganizations[sid] || {};
        next.stateOrganizations[sid][pid] = next.stateOrganizations[sid][pid] || { chapters: 0 };
        next.stateOrganizations[sid][pid].chapters = Math.max(
          0,
          Number(next.stateOrganizations[sid][pid].chapters || 0) + chaptersDelta
        );
      }
    }

    // 6. Organizing Actions
    const bonusActionsDelta = Number(fx.organizingActionsDelta ?? fx.bonusActions ?? 0);
    if (bonusActionsDelta !== 0) {
      next.bonusActions = Math.max(0, Number(next.bonusActions || 0) + bonusActionsDelta);
      if (Number.isFinite(Number(next.actionsLeft))) {
        next.actionsLeft = Math.max(0, Number(next.actionsLeft) + bonusActionsDelta);
      }
    }

    // 7. State Legislative Slates
    const slatesDelta = Number(fx.addStateLegSlates ?? fx.slatesDelta ?? 0);
    if (slatesDelta !== 0 && targetStates.length > 0) {
      next.stateLegSlates = next.stateLegSlates || {};
      next.stateLegSlates[pid] = next.stateLegSlates[pid] || { house: {}, senate: {} };
      const pSlates = next.stateLegSlates[pid];
      pSlates.house = pSlates.house || {};
      pSlates.senate = pSlates.senate || {};
      for (const sid of targetStates) {
        pSlates.house[sid] = clamp(Number(pSlates.house[sid] || 0) + slatesDelta, 0, 5);
        pSlates.senate[sid] = clamp(Number(pSlates.senate[sid] || 0) + slatesDelta, 0, 5);
      }
    }

    // 8. Electoral Reforms
    if (fx.enactReform && targetStates.length > 0) {
      next.stateElectoralSystems = next.stateElectoralSystems || {};
      for (const sid of targetStates) {
        next.stateElectoralSystems[sid] = fx.enactReform;
      }
    }

    // 9. Caucus Strength & Historic Hardening
    if ((fx.caucusStrengthDelta || fx.hardenCaucusHistoric) && Array.isArray(next.caucuses)) {
      const partyCaucuses = next.caucuses.filter((c) => c && c.partyId === pid && c.status !== 'solo');
      if (partyCaucuses.length > 0) {
        const targetCaucus = partyCaucuses[0];
        if (fx.caucusStrengthDelta) {
          targetCaucus.strength = clamp(Number(targetCaucus.strength || 50) + Number(fx.caucusStrengthDelta), 0, 100);
        }
        if (fx.hardenCaucusHistoric) {
          targetCaucus.status = 'historic';
        }
      }
    }

    // 10. Candidate Spawning
    if (fx.spawnCandidate) {
      next.recruitedCandidates = Array.isArray(next.recruitedCandidates) ? next.recruitedCandidates : [];
      const spec = typeof fx.spawnCandidate === 'object' ? fx.spawnCandidate : {};
      const stateId = spec.stateId || targetStates[0] || 'PA';
      next.recruitedCandidates.push({
        id: spec.id || `autopsy_cand_${next.year || 2028}_${stateId}`,
        name: spec.name || `${STATE_NAMES[stateId] || stateId} Reform Nominee`,
        partyId: pid,
        stateId,
        office: spec.office || 'house',
        quality: Number(spec.quality ?? 7),
        fame: Number(spec.fame ?? 48),
        source: 'autopsy'
      });
    }

    // 11. Lawmaker Recruitment
    if (fx.recruitLawmaker && Array.isArray(next.sittingMembers)) {
      const target = next.sittingMembers.find((m) => m && m.party !== pid && m.caucus !== pid);
      if (target) {
        target.party = pid;
        target.caucus = pid;
        target.recruitedViaAutopsy = true;
      }
    }

    // 12. Faction Recruitment
    if (fx.recruitFaction && Array.isArray(next.factions)) {
      const spec = typeof fx.recruitFaction === 'object' ? fx.recruitFaction : null;
      if (spec && spec.id) {
        next.factions.push({ ...spec, partyId: pid });
      } else {
        const targetF = next.factions.find((f) => f && f.partyId === 'independent' && !f.isIdentityBloc);
        if (targetF) targetF.partyId = pid;
      }
    }

    // Clear pending options and record disposition
    next.pendingAutopsyOptions = [];
    if (next.pendingAutopsy) {
      next.pendingAutopsy = null;
    }
    next.autopsyDisposition = {
      optionId: resolvedOption.id,
      title: resolvedOption.title || resolvedOption.id,
      theme: resolvedOption.theme || '',
      track: next.pendingAutopsy?.track || resolvedOption.track || null,
      scenarioId: next.pendingAutopsy?.scenarioId || resolvedOption.scenarioId || null,
      resolvedStateIds: targetStates,
      resolvedStateNames: resolvedOption.resolvedStateNames || '',
      year: next.year || 2028
    };
    next.lastNote = `Post-Cycle Autopsy Path Selected: ${resolvedOption.title || resolvedOption.id}. ${resolvedOption.summaryText || ''}`.trim();

    return next;
  }

  // --------------------------------------------------------------------------
  // 8. renderAutopsyOptionsMarkup
  // --------------------------------------------------------------------------
  function renderAutopsyOptionsMarkup(game, safe) {
    const esc = typeof safe === 'function' ? safe : defaultSafe;
    const options = Array.isArray(game?.pendingAutopsyOptions)
      ? game.pendingAutopsyOptions
      : (Array.isArray(game?.pendingAutopsy?.options) ? game.pendingAutopsy.options : []);

    if (!options.length) {
      return '<div class="autopsy-options-empty">No post-cycle autopsy paths available.</div>';
    }

    const cards = options.map((opt) => {
      const resolved = opt.resolvedStateIds ? opt : resolveTargetStatesForOption(game, game?.player?.id, opt);
      const stateBadge = (resolved.resolvedStateIds && resolved.resolvedStateIds.length > 0 && resolved.resolvedStateIds.length <= 5 && resolved.resolvedStateNames)
        ? `<div class="autopsy-option-states">Target: ${esc(resolved.resolvedStateNames)}</div>`
        : '';
      return `
        <article class="autopsy-option-card" data-autopsy-card="${esc(resolved.id)}">
          <div class="autopsy-option-header">
            <span class="autopsy-option-theme">${esc(resolved.theme || 'Strategic Pivot')}</span>
            <h4 class="autopsy-option-title">${esc(resolved.title || resolved.id)}</h4>
          </div>
          ${stateBadge}
          <p class="autopsy-option-summary">${esc(resolved.summaryText || resolved.description || '')}</p>
          <div class="autopsy-option-actions">
            <button type="button" class="button button-primary autopsy-choose-btn" data-autopsy-option-id="${esc(resolved.id)}">Choose This Path</button>
          </div>
        </article>`;
    }).join('');

    return `<section class="autopsy-options-grid">${cards}</section>`;
  }

  return {
    ELECTORATE_TOTAL,
    STATE_NAMES,
    MILESTONE_DEFS,
    determineAutopsyTrack,
    evaluateAutopsyMilestones,
    computeAutopsyPoints,
    determineMajorPartyScenario,
    resolveTargetStatesForOption,
    buildPendingAutopsy,
    applyAutopsyOption,
    renderAutopsyOptionsMarkup
  };
});
