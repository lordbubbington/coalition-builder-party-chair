// Coalition Builder: Party Chair — MAS-01 Party Systems Evolution Engine
// State machine, eligibility floors, escalating transition roller, plugin hook dispatcher,
// 41-issue dynamic swap pipeline, faction key-issue replacement, and Independent Presidential Campaigns.

(function PartySystemsEngineModule() {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const round = (n, places = 2) => Math.round(n * (10 ** places)) / (10 ** places);

  function fnvHash(text) {
    let h = 2166136261;
    const s = String(text || '');
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }

  function getPSData() {
    if (typeof window !== 'undefined' && window.PartySystemsData) return window.PartySystemsData;
    if (typeof require !== 'undefined') {
      try { return require('./party-systems-data.js'); } catch {}
    }
    return null;
  }

  function getPSCoalition() {
    if (typeof window !== 'undefined' && window.PartySystemsCoalition) return window.PartySystemsCoalition;
    if (typeof require !== 'undefined') {
      try { return require('./party-systems-coalition.js'); } catch {}
    }
    return null;
  }

  function getPSRobots() {
    if (typeof window !== 'undefined' && window.PartySystemsRobots) return window.PartySystemsRobots;
    if (typeof require !== 'undefined') {
      try { return require('./party-systems-robots.js'); } catch {}
    }
    return null;
  }

  function getChairData() {
    if (typeof window !== 'undefined' && window.PartyChairData) return window.PartyChairData;
    return {};
  }

  function getBaselineIssues() {
    const chair = getChairData();
    if (Array.isArray(chair.VERSION_021_ISSUES) && chair.VERSION_021_ISSUES.length > 0) {
      return chair.VERSION_021_ISSUES;
    }
    const psd = getPSData();
    return (psd?.BASELINE_ACTIVE_ISSUE_IDS || []).map((id) => ({
      id,
      label: id,
      category: 'Economy & Affordability',
      pillarId: 'tax-economy',
      axis: 'economic',
      low: 'Progressive',
      high: 'Conservative',
    }));
  }

  function getBaselineIssueIds() {
    const base = getBaselineIssues();
    return base.map((i) => i.id);
  }

  // ============================================================================
  // 1. EXTENSIBLE ERA PLUGIN REGISTRY & HOOK DISPATCHER (Section 1.5)
  // ============================================================================

  const ERA_PLUGINS = new Map();

  function buildDefaultPluginHooks(meta = {}) {
    return {
      ...meta,
      checkEligibility: (game, year) => evaluateEraTrigger(meta, game, year),
      onEraEnter: () => {},
      onEraExit: () => {},
      onCycleStart: () => {},
      onTurnStart: () => {},
      onPrimaryResolve: () => {},
      onElectionResolve: () => {},
      getTurnoutModifier: () => 0,
      getFundraisingModifier: () => 1.0,
      getNationalWindModifier: () => 0,
      getStrategicDefectionModifier: () => 1.0,
      getApprovalDecayMultiplier: () => 1.0,
      getCoattailMultiplier: () => 1.0,
      getWaveVolatilityMultiplier: () => 1.0,
      getIndependentElasticityMultiplier: () => 1.0,
      getIndependentDefectionBonus: () => 0,
      getCandidateMarginModifier: () => 0,
      getVolunteerDriveMultiplier: () => 1.0,
      getSuperPacFundingMultiplier: () => 1.0,
      getChapterCostModifier: () => 1.0,
      getAnalogCampaignMultiplier: () => 1.0,
      getAlgorithmicCampaignMultiplier: () => 1.0,
      getRegionalPartySupportBonus: () => 0,
      getRegionalMergerEnabled: () => false,
      getBillSignoffRequirement: () => ({ required: false, canPass: true, hasLabor: true, hasBusiness: true, missing: [] }),
      getPillarWeightModifiers: () => null,
      getIssueSalienceModifiers: () => null,
      getDecisionModal: () => null,
      resolveDecision: () => null,
      getEraDossierContent: () => meta.dossier || {},
    };
  }

  function registerEraPlugin(plugin) {
    if (!plugin || !plugin.id) return;
    const meta = getEraMetadata(plugin.id) || { id: plugin.id };
    ERA_PLUGINS.set(plugin.id, {
      ...buildDefaultPluginHooks(meta),
      ...plugin,
    });
  }

  function getEraMetadata(eraId) {
    const psd = getPSData();
    return psd?.ALL_ERAS_BY_ID?.[eraId] || psd?.BASELINE_ERA || null;
  }

  function getEraPlugin(eraId) {
    if (!ERA_PLUGINS.has('era_18_party_coalition')) {
      const psc = getPSCoalition();
      if (psc?.createEra18Plugin) registerEraPlugin(psc.createEra18Plugin());
    }
    if (!ERA_PLUGINS.has('era_16_robots_citizens')) {
      const psr = getPSRobots();
      if (psr?.createEra16Plugin) registerEraPlugin(psr.createEra16Plugin());
    }
    if (ERA_PLUGINS.has(eraId)) return ERA_PLUGINS.get(eraId);
    const meta = getEraMetadata(eraId);
    if (!meta) return null;
    return buildDefaultPluginHooks(meta);
  }

  function getActiveEraPlugin(game) {
    const eraId = game?.partySystems?.currentEraId || 'era_07_baseline';
    return getEraPlugin(eraId);
  }

  function dispatchEraHook(game, hookName, ...args) {
    const plugin = getActiveEraPlugin(game);
    const activeEraId = game?.partySystems?.currentEraId || 'era_07_baseline';
    let res = (plugin && typeof plugin[hookName] === 'function')
      ? plugin[hookName](game, ...args)
      : undefined;

    // Cross-Era Stacking Persistence (Section 7):
    // If Era 9+ is stacked over Era #18 (Coalition System), persistent MMP coalition hooks continue operating.
    const cs = game?.partySystems?.coalitionSystem;
    if (cs?.mmpActive && activeEraId !== 'era_18_party_coalition') {
      const era18Plugin = getEraPlugin('era_18_party_coalition');
      if (era18Plugin && typeof era18Plugin[hookName] === 'function') {
        if (hookName === 'onElectionResolve') {
          era18Plugin.onElectionResolve(game, ...args);
        } else if (hookName === 'getTurnoutModifier') {
          res = Number(res || 0) + Number(era18Plugin.getTurnoutModifier(game, ...args) || 0);
        } else if (hookName === 'getStrategicDefectionModifier') {
          res = 0;
        }
      }
    }

    // If Era 9+ is stacked over Era #16 (Robot Citizenship), robot strategic-defection immunity persists.
    const rc = game?.partySystems?.robotCitizenship;
    if (rc?.active && activeEraId !== 'era_16_robots_citizens') {
      const era16Plugin = getEraPlugin('era_16_robots_citizens');
      if (era16Plugin && hookName === 'getStrategicDefectionModifier') {
        const psr = getPSRobots();
        if (psr?.isRobotParty(args[0])) res = 0;
      }
    }

    return res;
  }

  // ============================================================================
  // 2. GLOBAL STATE INITIALIZATION & SAVE MIGRATION (Section 1.2)
  // ============================================================================

  function createInitialPartySystemsState(game = null) {
    const psd = getPSData();
    const baselineIds = getBaselineIssueIds();
    return {
      currentEraId: psd?.BASELINE_ERA_ID || 'era_07_baseline',
      currentEraNumber: 7,
      eraNumber: 7, // [v0.18.4 FACTION-ERA-FIXES]
      currentEraStartYear: 2006,
      priorErasHistory: [],
      transitionRollHistory: {},
      experiencedEraIds: [psd?.BASELINE_ERA_ID || 'era_07_baseline'],
      activeIssueIds: [...baselineIds],
      sunsettedIssueIds: [],
      eraExclusiveIssuesActive: [],
      eraIssueDefinitions: {},
      pendingModal: null,
      modalPayload: null,
      independentPresidency: {
        activeCampaign: null,
        lastRunYear: null,
        totalRuns: 0,
        victories: 0,
        history: [],
      },
      moderateParty: null,
      regionalParties: null,
      coalitionSystem: null,
      robotCitizenship: null,
      postCitizensUnited: null,
      eraState: {},
    };
  }

  function normalizePartySystemsState(game) {
    if (!game) return game;
    const base = createInitialPartySystemsState(game);
    const existing = game.partySystems;
    if (!existing || typeof existing !== 'object') {
      return { ...game, partySystems: base };
    }

    const psd = getPSData();
    const baselineIds = getBaselineIssueIds();
    const rawActive = Array.isArray(existing.activeIssueIds) && existing.activeIssueIds.length
      ? [...new Set(existing.activeIssueIds)]
      : [...baselineIds];

    // Enforce strict 41-issue invariant
    const sunsetSet = new Set(Array.isArray(existing.sunsettedIssueIds) ? existing.sunsettedIssueIds : []);
    const targetIssueCount = Math.max(41, baselineIds.length);
    while (rawActive.length < targetIssueCount) {
      const filler = baselineIds.find((id) => !rawActive.includes(id) && !sunsetSet.has(id))
        || baselineIds.find((id) => !rawActive.includes(id));
      if (!filler) break;
      rawActive.push(filler);
    }
    const clampedActive = rawActive.slice(0, targetIssueCount);

    // Hydrate any era issue definitions for active era-exclusive issues
    const eraDefs = { ...(existing.eraIssueDefinitions || {}) };
    clampedActive.forEach((id) => {
      if (!baselineIds.includes(id) && !eraDefs[id] && psd?.ALL_ERA_ISSUES_BY_ID?.[id]) {
        eraDefs[id] = psd.ALL_ERA_ISSUES_BY_ID[id];
      }
    });

    const _resolvedEraNum = Number.isFinite(Number(existing.currentEraNumber)) ? Math.max(7, Number(existing.currentEraNumber)) : 7; // [v0.18.4 FACTION-ERA-FIXES]
    const normalized = {
      ...base,
      ...existing,
      currentEraId: existing.currentEraId || base.currentEraId,
      currentEraNumber: _resolvedEraNum,
      eraNumber: _resolvedEraNum, // [v0.18.4 FACTION-ERA-FIXES]
      currentEraStartYear: Number.isFinite(Number(existing.currentEraStartYear)) ? Number(existing.currentEraStartYear) : 2006,
      priorErasHistory: Array.isArray(existing.priorErasHistory) ? existing.priorErasHistory : [],
      transitionRollHistory: existing.transitionRollHistory && typeof existing.transitionRollHistory === 'object' ? existing.transitionRollHistory : {},
      experiencedEraIds: Array.isArray(existing.experiencedEraIds) && existing.experiencedEraIds.length
        ? [...new Set(existing.experiencedEraIds)]
        : [existing.currentEraId || base.currentEraId],
      activeIssueIds: clampedActive,
      sunsettedIssueIds: Array.isArray(existing.sunsettedIssueIds) ? [...new Set(existing.sunsettedIssueIds)] : [],
      eraExclusiveIssuesActive: clampedActive.filter((id) => !baselineIds.includes(id)),
      eraIssueDefinitions: eraDefs,
      pendingModal: existing.pendingModal || null,
      modalPayload: existing.modalPayload || null,
      eraState: existing.eraState && typeof existing.eraState === 'object' ? { ...existing.eraState } : {},
      moderateParty: existing.moderateParty && typeof existing.moderateParty === 'object' ? { ...existing.moderateParty } : null,
      regionalParties: existing.regionalParties && typeof existing.regionalParties === 'object'
        ? {
            ...existing.regionalParties,
            parties: Array.isArray(existing.regionalParties.parties) ? existing.regionalParties.parties : [],
            absorbedPartyIds: Array.isArray(existing.regionalParties.absorbedPartyIds) ? [...new Set(existing.regionalParties.absorbedPartyIds)] : [],
          }
        : null,
      coalitionSystem: existing.coalitionSystem && typeof existing.coalitionSystem === 'object'
        ? (getPSCoalition()?.normalizeCoalitionSystemState
          ? getPSCoalition().normalizeCoalitionSystemState(existing.coalitionSystem)
          : { ...existing.coalitionSystem })
        : null,
      robotCitizenship: existing.robotCitizenship && typeof existing.robotCitizenship === 'object'
        ? (getPSRobots()?.normalizeRobotCitizenshipState
          ? getPSRobots().normalizeRobotCitizenshipState(existing.robotCitizenship)
          : { ...existing.robotCitizenship })
        : null,
      independentPresidency: {
        ...base.independentPresidency,
        ...(existing.independentPresidency || {}),
        history: Array.isArray(existing.independentPresidency?.history) ? existing.independentPresidency.history : [],
      },
    };

    const nextGame = {
      ...game,
      partySystems: normalized,
    };

    // Re-hydrate renamed party names (e.g. Constitution -> MAGA Party in Era #3) on save/reload
    const renamed = normalized.eraState?.renamedParties;
    if (renamed && typeof renamed === 'object') {
      nextGame.partyNames = { ...(nextGame.partyNames || {}), ...renamed };
      if (nextGame.player && !nextGame.player.custom && renamed[nextGame.player.baseTemplateId]) {
        nextGame.player = { ...nextGame.player, name: renamed[nextGame.player.baseTemplateId] };
      }
      if (Array.isArray(nextGame.rivals)) {
        nextGame.rivals = nextGame.rivals.map((r) => (
          renamed[r.id] ? { ...r, name: renamed[r.id] } : r
        ));
      }
    }

    return nextGame;
  }

  // ============================================================================
  // 3. ELIGIBILITY FLOOR, ESCALATING PROBABILITY & WEIGHTED POOL (Sections 1.3-1.4)
  // ============================================================================

  function getEligibilityFloorYear(psOrGame) {
    const ps = psOrGame?.partySystems || psOrGame || {};
    const eraNum = Number(ps.currentEraNumber || 7);
    const startYear = Number(ps.currentEraStartYear || 2028);
    // Strict 8th Party System Floor: NEVER before 2040
    if (eraNum <= 7) return 2040;
    // Strict 9th+ Party System Floor: at least 30 years after preceding era start
    return startYear + 30;
  }

  function computeTransitionProbability(game, targetYear = null) {
    const ps = game?.partySystems || createInitialPartySystemsState(game);
    const year = Number(targetYear ?? game?.year ?? 2028);
    const floorYear = getEligibilityFloorYear(ps);
    if (year < floorYear) return 0;
    const cyclesSinceFloor = Math.max(0, Math.floor((year - floorYear) / 2));
    const prob = 0.10 + 0.05 * cyclesSinceFloor;
    return clamp(round(prob, 4), 0, 1.0);
  }

  function resolvePartyPositionsMap(game, partyId = null) {
    const playerKey = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    if (!partyId || partyId === 'player' || partyId === playerKey) {
      if (game?.parties?.[playerKey]?.platformStances && Object.keys(game.parties[playerKey].platformStances).length) {
        return game.parties[playerKey].platformStances;
      }
      return game?.issuePositions || game?.player?.issuePositions || {};
    }
    if (game?.parties?.[partyId]?.platformStances && Object.keys(game.parties[partyId].platformStances).length) {
      return game.parties[partyId].platformStances;
    }
    if (game?.partyIssuePositions?.[partyId]) {
      return game.partyIssuePositions[partyId];
    }
    const rival = (game?.rivals || []).find((r) => r.id === partyId || r.baseTemplateId === partyId);
    if (rival?.issuePositions && Object.keys(rival.issuePositions).length) {
      return rival.issuePositions;
    }
    if (rival) {
      // Fallback: derive average 1-10 stance from rival 4-axis values (-1..1 -> 1..10)
      const econ = Number(rival.economic ?? 0);
      const soc = Number(rival.social ?? 0);
      const cli = Number(rival.climate ?? 0);
      const loc = Number(rival.local ?? 0);
      const meanAxis = (econ + soc - cli + loc) / 4;
      const derived = clamp(round(5.5 + meanAxis * 4.5, 2), 1, 10);
      return { __derivedAvg: derived };
    }
    return game?.issuePositions || {};
  }

  function computeAveragePillarStance(game, partyId = null) {
    const positions = resolvePartyPositionsMap(game, partyId);
    if (positions && Number.isFinite(Number(positions.__derivedAvg)) && Object.keys(positions).length === 1) {
      return Number(positions.__derivedAvg);
    }
    const chair = getChairData();
    const pillars = (chair.PLATFORM_PILLARS || []).filter((p) => p.number >= 1 && p.number <= 6);
    const vals = [];
    pillars.forEach((p) => {
      (p.issues || []).forEach((issId) => {
        if (positions[issId] !== undefined) vals.push(Number(positions[issId]));
      });
    });
    if (!vals.length) {
      const all = Object.values(positions).map(Number).filter(Number.isFinite);
      return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 5.0;
    }
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function computePillarAverageStance(game, pillarId, partyId = null) {
    const positions = resolvePartyPositionsMap(game, partyId);
    if (positions && Number.isFinite(Number(positions.__derivedAvg)) && Object.keys(positions).length === 1) {
      return Number(positions.__derivedAvg);
    }
    const chair = getChairData();
    const pillar = (chair.PLATFORM_PILLARS || []).find((p) => p.id === pillarId || String(p.number) === String(pillarId));
    const vals = [];
    if (pillar && Array.isArray(pillar.issues)) {
      pillar.issues.forEach((issId) => {
        if (positions[issId] !== undefined) vals.push(Number(positions[issId]));
      });
    }
    // Include active era-exclusive issues assigned to this pillar
    const activeDefs = getActiveIssuesForGame(game);
    activeDefs.forEach((iss) => {
      if ((iss.pillarId === pillarId || (pillar && iss.pillarId === pillar.id)) && positions[iss.id] !== undefined) {
        vals.push(Number(positions[iss.id]));
      }
    });
    if (!vals.length) return computeAveragePillarStance(game, partyId);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function countPartyChamberSeats(game, partyId, chamber) {
    const sitting = game?.sittingMembers || [];
    const playerBase = game?.player?.baseTemplateId || 'people';
    const isPlayerMatch = (partyId === 'player' && game?.player?.custom) || (!game?.player?.custom && partyId === playerBase);
    const count = sitting.filter((m) => {
      if (m.office !== chamber) return false;
      const mParty = m.party || m.partyId;
      const mCaucus = m.caucus || mParty;
      if (chamber === 'senate') return mParty === partyId || mCaucus === partyId;
      return mParty === partyId;
    }).length;
    if (chamber === 'house' && isPlayerMatch) {
      return Math.max(count, Number(game?.seats || 0));
    }
    return count;
  }

  function detectReplacementInsurgent(game, side = 'left') {
    const lastElection = game?.lastElection || (game?.elections || [])[(game?.elections || []).length - 1] || null;
    const govParty = game?.governingParty || lastElection?.presidentialWinner || 'heritage';
    const displaced = side === 'left' ? 'people' : 'heritage';
    const displacedHoldsWH = govParty === displaced;
    const displacedHouse = countPartyChamberSeats(game, displaced, 'house');
    const displacedSenate = countPartyChamberSeats(game, displaced, 'senate');
    if (displacedHoldsWH || displacedHouse >= 218 || displacedSenate >= 51) return null;

    const playerId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const candidates = new Set();
    if (!['people', 'heritage'].includes(playerId)) candidates.add(playerId);
    ['green', 'socialist', 'liberty', 'constitution'].forEach((id) => candidates.add(id));
    if (govParty && !['people', 'heritage', 'independent'].includes(govParty)) candidates.add(govParty);

    for (const pid of candidates) {
      const holdsWH = govParty === pid;
      const holdsHouse = countPartyChamberSeats(game, pid, 'house') >= 218;
      const holdsSenate = countPartyChamberSeats(game, pid, 'senate') >= 51;
      if (!holdsWH && !holdsHouse && !holdsSenate) continue;
      const avg = computeAveragePillarStance(game, pid === playerId ? null : pid);
      if (side === 'left' && avg <= 3.0) {
        return { insurgentPartyId: pid, displacedPartyId: 'people', avgStance: round(avg, 2) };
      }
      if (side === 'right' && avg >= 7.0) {
        return { insurgentPartyId: pid, displacedPartyId: 'heritage', avgStance: round(avg, 2) };
      }
    }
    return null;
  }

  function countDistinctPartiesInChamber(game, chambers = ['senate']) {
    const sitting = game?.sittingMembers || [];
    const parties = new Set();
    sitting.forEach((m) => {
      if (chambers.includes(m.office)) {
        const pid = m.party || m.partyId;
        if (pid && pid !== 'independent' && pid !== 'none') parties.add(pid);
      }
    });
    return parties.size;
  }

  function evaluateEraTrigger(era, game, year = null) {
    if (!era) return false;
    const evalYear = Number(year ?? game?.year ?? 2028);
    const ps = game?.partySystems || createInitialPartySystemsState(game);

    // Group D (Normal Eras): Always eligible once floor is met
    if (era.group === 'D') return true;

    // Group E (Follow-Up Eras): Specific predecessor era occurred AND elapsed >= threshold (>= 30 yrs)
    if (era.group === 'E') {
      const preds = Array.isArray(era.predecessorIds) ? era.predecessorIds : [];
      const minElapsed = Math.max(30, Number(era.minElapsedFromPredecessor || 30));
      if (preds.includes(ps.currentEraId)) {
        return (evalYear - Number(ps.currentEraStartYear || 2028)) >= minElapsed;
      }
      const priorMatch = (ps.priorErasHistory || []).find((h) => preds.includes(h.eraId));
      if (priorMatch) {
        return (evalYear - Number(priorMatch.startYear || 2028)) >= minElapsed;
      }
      return false;
    }

    const lastElection = game?.lastElection || (game?.elections || [])[(game?.elections || []).length - 1] || null;
    const govParty = game?.governingParty || lastElection?.presidentialWinner || 'heritage';

    switch (era.id) {
      case 'era_01_anti_extremist':
      case 'era_02_moderate_party': {
        // Trigger: Winning presidential candidate / governing party has avg stance >= 9.0 or <= 2.0 across Pillars 1-6
        const explicitAvg = game?.winningPresidentAvgStance;
        const playerKey = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
        const avg = Number.isFinite(Number(explicitAvg))
          ? Number(explicitAvg)
          : computeAveragePillarStance(game, govParty === playerKey ? null : govParty);
        return avg >= 9.0 || avg <= 2.0;
      }
      case 'era_03_six_party_system': {
        // Trigger: At least 6 distinct political parties simultaneously hold a seat in the U.S. Senate
        return countDistinctPartiesInChamber(game, ['senate']) >= 6;
      }
      case 'era_04_landslide_realignment': {
        // Trigger: Any party wins national popular vote by >= 20% OR holds >= 40 state trifectas
        const nv = lastElection?.nationalVote || {};
        const includePlayerKey = Boolean(game?.player?.custom) || !nv[game?.player?.baseTemplateId || 'people'];
        const sorted = Object.entries(nv)
          .filter(([k]) => includePlayerKey || k !== 'player')
          .map(([, v]) => Number(v) || 0)
          .sort((a, b) => b - a);
        const popMargin = sorted.length >= 2 ? (sorted[0] - sorted[1]) : 0;
        if (popMargin >= 20.0) return true;
        const govs = game?.governorships || {};
        const legs = game?.stateLegislatures || {};
        const trifectasByParty = {};
        Object.keys(govs).forEach((stId) => {
          const g = govs[stId];
          const ch = legs[stId];
          if (g && Array.isArray(ch) && ch.length >= 2 && ch[0] === g && ch[1] === g) {
            trifectasByParty[g] = (trifectasByParty[g] || 0) + 1;
          }
        });
        return Object.values(trifectasByParty).some((cnt) => cnt >= 40);
      }
      case 'era_05_independent_surge': {
        // Trigger: An Independent candidate wins the Presidency
        return govParty === 'independent' || Number(ps.independentPresidency?.victories || 0) > 0;
      }
      case 'era_06_left_replacement': {
        // Trigger: Non-major progressive party wins WH or Congress with stance <= 3.0; Democrats hold neither
        return Boolean(detectReplacementInsurgent(game, 'left'));
      }
      case 'era_07_right_replacement': {
        // Trigger: Non-major conservative party wins WH or Congress with stance >= 7.0; Republicans hold neither
        return Boolean(detectReplacementInsurgent(game, 'right'));
      }
      case 'era_08_ideologies_cool': {
        // Trigger: Dem leader has 4+ stances >= 6.0 OR Rep leader has 4+ stances <= 4.0
        const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
        const demPos = pId === 'people' ? (game?.issuePositions || {}) : (game?.partyIssuePositions?.people || {});
        const repPos = pId === 'heritage' ? (game?.issuePositions || {}) : (game?.partyIssuePositions?.heritage || {});
        const demVals = Object.values(demPos).map(Number).filter(Number.isFinite);
        const repVals = Object.values(repPos).map(Number).filter(Number.isFinite);
        if (demVals.filter((v) => v >= 6.0).length >= 4) return true;
        if (repVals.filter((v) => v <= 4.0).length >= 4) return true;
        return false;
      }
      case 'era_18_party_coalition': {
        // Trigger: At least 6 distinct political parties hold >= 1 seat in U.S. House OR U.S. Senate
        return countDistinctPartiesInChamber(game, ['house', 'senate']) >= 6;
      }
      default:
        return false;
    }
  }

  function getEligiblePartySystems(game, targetYear = null) {
    const psd = getPSData();
    if (!psd || !Array.isArray(psd.ERA_CATALOG)) return [];
    const ps = game?.partySystems || createInitialPartySystemsState(game);
    const year = Number(targetYear ?? game?.year ?? 2028);
    const floorYear = getEligibilityFloorYear(ps);
    if (year < floorYear) return [];

    const experienced = new Set(ps.experiencedEraIds || []);
    const candidates = [];

    psd.ERA_CATALOG.forEach((era) => {
      // No-Repeat Invariant
      if (experienced.has(era.id)) return;

      const plugin = ERA_PLUGINS.get(era.id);
      const triggered = plugin && typeof plugin.checkEligibility === 'function'
        ? Boolean(plugin.checkEligibility(game, year))
        : evaluateEraTrigger(era, game, year);

      if (!triggered) return;

      let weight = 0;
      if (era.group === 'E') weight = 5;
      else if (['A', 'B', 'C'].includes(era.group)) weight = 3;
      else if (era.group === 'D') weight = 1;

      if (weight > 0) {
        candidates.push({ era, weight });
      }
    });

    return candidates;
  }

  function selectNextPartySystem(game, targetYear = null, rng = null) {
    const candidates = getEligiblePartySystems(game, targetYear);
    if (!candidates.length) return null;
    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    const randomFn = typeof rng === 'function'
      ? rng
      : () => fnvHash(`ps-select:${game?.seed || 2028}:${targetYear ?? game?.year ?? 2040}:${(game?.partySystems?.experiencedEraIds || []).length}`);
    let roll = clamp(randomFn(), 0, 0.999999) * totalWeight;
    for (const c of candidates) {
      if (roll < c.weight) return c.era;
      roll -= c.weight;
    }
    return candidates[0].era;
  }

  // ============================================================================
  // 4. DYNAMIC 41-ISSUE SWAP PIPELINE & FACTION KEY-ISSUE REPLACEMENT (Section 2)
  // ============================================================================

  function getIssueDefinition(game, issueId) {
    const baseline = getBaselineIssues().find((i) => i.id === issueId);
    if (baseline) return baseline;
    const fromState = game?.partySystems?.eraIssueDefinitions?.[issueId];
    if (fromState) return fromState;
    const psd = getPSData();
    if (psd?.ALL_ERA_ISSUES_BY_ID?.[issueId]) return psd.ALL_ERA_ISSUES_BY_ID[issueId];
    return null;
  }

  // Strictly returns ONLY the 41 active issues — never leaks unintroduced era-exclusive issues!
  function getActiveIssuesForGame(game) {
    const baseIssues = getBaselineIssues();
    const ps = game?.partySystems;
    if (!ps || !Array.isArray(ps.activeIssueIds) || !ps.activeIssueIds.length) {
      return baseIssues;
    }
    const baseById = Object.fromEntries(baseIssues.map((i) => [i.id, i]));
    const eraDefs = ps.eraIssueDefinitions || {};
    const active = [];
    ps.activeIssueIds.forEach((id) => {
      const def = baseById[id] || eraDefs[id];
      if (def) active.push(def);
    });
    return active;
  }

  function getIssueStanceDescription(game, issueId, value = 5) {
    const val = clamp(Math.round(Number(value) || 5), 1, 10);
    const chair = getChairData();
    if (chair.STANCE_DESCRIPTIONS?.[issueId]?.[val]) {
      return chair.STANCE_DESCRIPTIONS[issueId][val];
    }
    const eraDef = game?.partySystems?.eraIssueDefinitions?.[issueId];
    if (eraDef?.stances?.[val]) {
      return eraDef.stances[val];
    }
    return 'Balanced national policy framework prioritizing pragmatic compromises.';
  }

  function initializeStanceForNewIssue(partyStancesMap, newIssue, activeIssuesList, rngFn) {
    const rng = typeof rngFn === 'function' ? rngFn : Math.random;
    const sameCategory = (activeIssuesList || []).filter((iss) => (
      iss && iss.id !== newIssue.id && iss.category === newIssue.category && partyStancesMap?.[iss.id] !== undefined
    ));

    let avg;
    if (sameCategory.length > 0) {
      const sum = sameCategory.reduce((acc, iss) => acc + Number(partyStancesMap[iss.id]), 0);
      avg = sum / sameCategory.length;
    } else {
      // Brand-new category fallback: overall average across all active issues
      const allActiveVals = (activeIssuesList || [])
        .filter((iss) => iss && iss.id !== newIssue.id && partyStancesMap?.[iss.id] !== undefined)
        .map((iss) => Number(partyStancesMap[iss.id]));
      avg = allActiveVals.length > 0
        ? allActiveVals.reduce((a, b) => a + b, 0) / allActiveVals.length
        : 5.0;
    }

    const delta = (rng() * 4.0) - 2.0; // Uniform in [-2.0, +2.0]
    return clamp(Math.round(avg + delta), 1, 10);
  }

  function normalizeTextToken(str) {
    return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function factionKeyIssueMatches(keyIssueStr, retiredId, retiredDef) {
    if (!keyIssueStr) return false;
    if (keyIssueStr === retiredId) return true;
    const normKey = normalizeTextToken(keyIssueStr);
    const normId = normalizeTextToken(retiredId);
    const normLabel = normalizeTextToken(retiredDef?.label || '');
    if (normKey === normId || (normLabel && normKey === normLabel)) return true;
    // Partial meaningful phrase overlap (e.g., "Voting Access" <-> "Voting access and election procedures")
    if (normLabel && normKey.length >= 6 && (normLabel.includes(normKey) || normKey.includes(normLabel))) {
      return true;
    }
    return false;
  }

  function replaceSunsettedFactionKeyIssues(game, retiredId, retiredDef) {
    if (!game || !Array.isArray(game.factions)) return [];
    const activeIssues = getActiveIssuesForGame(game).filter((i) => i.id !== retiredId);
    const replacements = [];

    game.factions.forEach((faction) => {
      if (!Array.isArray(faction.keyIssues) || !faction.keyIssues.length) return;
      faction.keyIssues = faction.keyIssues.map((ki, idx) => {
        if (!factionKeyIssueMatches(ki, retiredId, retiredDef)) return ki;

        const otherKeys = new Set(faction.keyIssues.filter((_, j) => j !== idx).map(normalizeTextToken));
        const available = activeIssues.filter((iss) => !otherKeys.has(normalizeTextToken(iss.label)) && !otherKeys.has(normalizeTextToken(iss.id)));

        // 1. Prefer same category active issue with highest salience to faction sliders
        const sameCat = available.filter((iss) => retiredDef && iss.category === retiredDef.category);
        let pool = sameCat.length > 0 ? sameCat : [];

        // 2. Fallback: active issue on faction's primary ideological axis
        if (!pool.length) {
          const s = faction.sliders || { economic: 5, social: 5, governance: 5 };
          const econDist = Math.abs((s.economic ?? 5) - 5);
          const socDist = Math.abs((s.social ?? 5) - 5);
          const primaryAxis = retiredDef?.axis || (econDist >= socDist ? 'economic' : 'social');
          const axisMatches = available.filter((iss) => iss.axis === primaryAxis);
          pool = axisMatches.length > 0 ? axisMatches : available;
        }

        if (!pool.length) return ki;
        const s = faction.sliders || { economic: 5, social: 5, governance: 5 };
        // Sort by highest salience (extremity distance from center 5 on the issue's axis)
        const ranked = pool.slice().sort((a, b) => {
          const scoreA = a.axis === 'economic' ? Math.abs((s.economic ?? 5) - 5) : Math.abs((s.social ?? 5) - 5);
          const scoreB = b.axis === 'economic' ? Math.abs((s.economic ?? 5) - 5) : Math.abs((s.social ?? 5) - 5);
          return scoreB - scoreA || a.id.localeCompare(b.id);
        });
        const chosen = ranked[0];
        replacements.push({
          factionId: faction.id,
          factionName: faction.name,
          retiredIssueId: retiredId,
          oldKeyIssue: ki,
          newIssueId: chosen.id,
          newKeyIssue: chosen.label,
          category: chosen.category,
        });
        return chosen.label;
      });
    });

    return replacements;
  }

  function retireIssue(game, issueId) {
    if (!game?.partySystems || !issueId) return null;
    const ps = game.partySystems;
    const idx = ps.activeIssueIds.indexOf(issueId);
    if (idx === -1) return null;

    const retiredDef = getIssueDefinition(game, issueId);
    ps.activeIssueIds.splice(idx, 1);
    if (!ps.sunsettedIssueIds.includes(issueId)) {
      ps.sunsettedIssueIds.push(issueId);
    }
    ps.eraExclusiveIssuesActive = ps.eraExclusiveIssuesActive.filter((id) => id !== issueId);

    // Clean retired issue out of active issue priorities & additional focus slots
    if (Array.isArray(game.issuePriorities)) {
      game.issuePriorities = game.issuePriorities.filter((id) => id !== issueId);
    }
    if (Array.isArray(game.priorities?.additional)) {
      game.priorities.additional = game.priorities.additional.map((slot) => (
        slot && slot.type === 'issue' && slot.targetId === issueId ? { type: 'issue', targetId: '' } : slot
      ));
    }

    return retiredDef;
  }

  function introduceIssue(game, issueDef, rngFn = null) {
    if (!game?.partySystems || !issueDef?.id) return null;
    const ps = game.partySystems;
    const activeBefore = getActiveIssuesForGame(game);

    // Register era issue definition
    ps.eraIssueDefinitions = ps.eraIssueDefinitions || {};
    ps.eraIssueDefinitions[issueDef.id] = issueDef;

    if (!ps.activeIssueIds.includes(issueDef.id)) {
      ps.activeIssueIds.push(issueDef.id);
    }
    if (!ps.eraExclusiveIssuesActive.includes(issueDef.id)) {
      ps.eraExclusiveIssuesActive.push(issueDef.id);
    }

    // Initialize player's stance (±2 clamped from category average or overall average)
    game.issuePositions = game.issuePositions || {};
    const playerRng = typeof rngFn === 'function'
      ? rngFn
      : () => fnvHash(`stance:${game.seed || 2028}:${game.year || 2040}:player:${issueDef.id}`);
    game.issuePositions[issueDef.id] = initializeStanceForNewIssue(game.issuePositions, issueDef, activeBefore, playerRng);

    // Initialize rival party stances
    game.partyIssuePositions = game.partyIssuePositions || {};
    const rivals = Array.isArray(game.rivals) ? game.rivals : [];
    rivals.forEach((rival) => {
      const rMap = game.partyIssuePositions[rival.id] || rival.issuePositions || {};
      const rRng = typeof rngFn === 'function'
        ? rngFn
        : () => fnvHash(`stance:${game.seed || 2028}:${game.year || 2040}:${rival.id}:${issueDef.id}`);
      const stanceVal = initializeStanceForNewIssue(rMap, issueDef, activeBefore, rRng);
      game.partyIssuePositions[rival.id] = { ...rMap, [issueDef.id]: stanceVal };
      rival.issuePositions = { ...(rival.issuePositions || {}), [issueDef.id]: stanceVal };
    });

    return issueDef;
  }

  function executeEraIssueSwap(game, newEra, rngFn = null) {
    if (!game?.partySystems || !newEra || !Array.isArray(newEra.issueSwaps)) {
      return { retired: [], introduced: [], keyIssueReplacements: [] };
    }
    const ps = game.partySystems;
    const isTransitionToEra8 = Number(ps.currentEraNumber || 7) === 7;
    const newlyAddedIds = new Set(newEra.issueSwaps.map((s) => s.add?.id).filter(Boolean));
    const retired = [];
    const introduced = [];
    const keyIssueReplacements = [];

    newEra.issueSwaps.forEach((swap, swapIdx) => {
      if (!swap?.add?.id) return;
      const swapRng = typeof rngFn === 'function'
        ? rngFn
        : () => fnvHash(`swap:${game.seed || 2028}:${newEra.id}:${swapIdx}:${swap.add.id}`);

      let issueToSunset = null;
      if (isTransitionToEra8 && swap.retireId && ps.activeIssueIds.includes(swap.retireId)) {
        issueToSunset = swap.retireId;
      } else {
        // 9th+ Transition (or fallback): Sunset a random currently active issue NOT being added in this era
        const candidates = ps.activeIssueIds.filter((id) => !newlyAddedIds.has(id));
        if (candidates.length > 0) {
          const pickIdx = Math.floor(clamp(swapRng(), 0, 0.999999) * candidates.length);
          issueToSunset = candidates[pickIdx];
        }
      }

      // 1. Introduce the new era-exclusive issue first so replacement key-issue scans include fresh issues too,
      // OR retire first and introduce immediately — keeping activeIssueIds cleanly at 41 after each pair.
      const retiredDef = issueToSunset ? retireIssue(game, issueToSunset) : null;
      const introducedDef = introduceIssue(game, swap.add, rngFn);

      if (retiredDef) {
        retired.push(retiredDef);
        const reps = replaceSunsettedFactionKeyIssues(game, retiredDef.id, retiredDef);
        keyIssueReplacements.push(...reps);
      }
      if (introducedDef) {
        introduced.push(introducedDef);
      }
    });

    // Strict 41-issue clamp guardrail
    ps.activeIssueIds = ps.activeIssueIds.slice(0, Math.max(41, getBaselineIssueIds().length));

    return { retired, introduced, keyIssueReplacements };
  }

  // ============================================================================
  // 5. ERA TRANSITION EXECUTION & CYCLE ROLLER
  // ============================================================================

  function transitionToPartySystem(game, newEra, year, options = {}) {
    if (!game || !newEra) return game;
    const working = normalizePartySystemsState({
      ...game,
      issuePositions: { ...(game.issuePositions || {}) },
      issuePriorities: Array.isArray(game.issuePriorities) ? [...game.issuePriorities] : [],
      factions: Array.isArray(game.factions) ? game.factions.map((f) => ({ ...f, keyIssues: Array.isArray(f.keyIssues) ? [...f.keyIssues] : f.keyIssues })) : [],
      rivals: Array.isArray(game.rivals) ? game.rivals.map((r) => ({ ...r })) : [],
      partySystems: JSON.parse(JSON.stringify(game.partySystems || createInitialPartySystemsState(game))),
    });
    const ps = working.partySystems;
    const priorEraId = ps.currentEraId;
    const priorEraMeta = getEraMetadata(priorEraId);
    const priorPlugin = getEraPlugin(priorEraId);
    const nextEraNumber = Number(ps.currentEraNumber || 7) + 1;

    // 1. Fire onEraExit on outgoing era
    if (priorPlugin && typeof priorPlugin.onEraExit === 'function') {
      priorPlugin.onEraExit(working, newEra);
    }

    // 2. Execute 41-Issue Swap Pipeline BEFORE updating currentEraNumber (so 7->8 check works accurately!)
    const swapResult = executeEraIssueSwap(working, newEra, options.swapRng);

    // 3. Archive outgoing era in priorErasHistory
    ps.priorErasHistory.push({
      eraId: priorEraId,
      eraNumber: Number(ps.currentEraNumber || 7),
      roman: getPSData()?.toRoman ? getPSData().toRoman(ps.currentEraNumber || 7) : String(ps.currentEraNumber || 7),
      name: priorEraMeta?.title || 'The 7th Party System',
      startYear: Number(ps.currentEraStartYear || 2028),
      endYear: Number(year),
      catalyst: priorEraMeta?.catalyst || 'Historical Electoral Alignment',
      sunsettedIssues: swapResult.retired.map((i) => ({ id: i.id, label: i.label, category: i.category })),
      emergentIssues: swapResult.introduced.map((i) => ({ id: i.id, label: i.label, category: i.category })),
    });

    // 4. Advance Era state
    ps.currentEraId = newEra.id;
    ps.currentEraNumber = nextEraNumber;
    ps.eraNumber = nextEraNumber; // [v0.18.4 FACTION-ERA-FIXES]
    ps.currentEraStartYear = Number(year);
    if (!ps.experiencedEraIds.includes(newEra.id)) {
      ps.experiencedEraIds.push(newEra.id);
    }

    // 5. Fire onEraEnter on incoming era
    const nextPlugin = getEraPlugin(newEra.id);
    if (nextPlugin && typeof nextPlugin.onEraEnter === 'function') {
      nextPlugin.onEraEnter(working, priorEraMeta);
    }

    // 6. Stage Fullscreen "Historic Realignment" Modal (persists cleanly across mid-modal reload!)
    const roman = getPSData()?.toRoman ? getPSData().toRoman(nextEraNumber) : String(nextEraNumber);
    const decisionModal = nextPlugin && typeof nextPlugin.getDecisionModal === 'function'
      ? nextPlugin.getDecisionModal(working)
      : null;

    ps.pendingModal = 'realignment';
    ps.modalPayload = {
      eraId: newEra.id,
      eraNumber: nextEraNumber,
      roman,
      year: Number(year),
      title: `Dawn of the ${ordinalSuffix(nextEraNumber)} Party System: ${newEra.title}`,
      shortTitle: newEra.title,
      accentColor: newEra.accentColor || '#c48f45',
      catalyst: newEra.catalyst || 'Historic Electoral Realignment',
      chronicle: Array.isArray(newEra.chronicle) ? newEra.chronicle : [],
      dossier: newEra.dossier || {},
      emergentIssues: swapResult.introduced.map((i) => ({ id: i.id, label: i.label, category: i.category })),
      sunsettedIssues: swapResult.retired.map((i) => ({ id: i.id, label: i.label, category: i.category })),
      decisionModal,
    };

    const note = `HISTORIC REALIGNMENT (${year}): The ${ordinalSuffix(nextEraNumber)} Party System — ${newEra.title} — has dawned!`;
    working.lastNote = note;
    working.yearLog = [...(working.yearLog || []), { year, turn: 1, action: note }].slice(-80);
    return working;
  }

  function ordinalSuffix(n) {
    const num = Number(n) || 7;
    const mod100 = num % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
    const mod10 = num % 10;
    if (mod10 === 1) return `${num}st`;
    if (mod10 === 2) return `${num}nd`;
    if (mod10 === 3) return `${num}rd`;
    return `${num}th`;
  }

  function evaluateEraTransition(game, nextYear, options = {}) {
    const working = normalizePartySystemsState(game);
    const ps = working.partySystems;
    const year = Number(nextYear ?? working.year ?? 2028);
    // [v0.18.4 FACTION-ERA-FIXES] Clear stale prior-year realignment modal before rolling
    if (ps.pendingModal === 'realignment' && Number(ps.modalPayload?.year || 0) < Number(year)) {
      ps.pendingModal = null;
      ps.modalPayload = null;
    }
    const floorYear = getEligibilityFloorYear(ps);

    // Strict Eligibility Floor Check
    if (year < floorYear) {
      return { game: working, transitioned: false, probability: 0, roll: null, floorYear };
    }

    const probability = computeTransitionProbability(working, year);
    const roll = options.rollOverride !== undefined
      ? Number(options.rollOverride)
      : fnvHash(`ps-transition-roll:${working.seed || 2028}:${year}:${ps.currentEraNumber}`);

    const triggered = roll < probability;
    ps.transitionRollHistory[year] = {
      rolled: true,
      probability,
      roll: round(roll, 4),
      triggered,
    };

    if (!triggered) {
      return { game: working, transitioned: false, probability, roll, floorYear };
    }

    let chosenEra = null;
    if (options.forceEraId) {
      chosenEra = getEraMetadata(options.forceEraId);
    } else {
      chosenEra = selectNextPartySystem(working, year, options.selectRng);
    }

    if (!chosenEra) {
      ps.transitionRollHistory[year].triggered = false;
      return { game: working, transitioned: false, probability, roll, floorYear };
    }

    const transitionedGame = transitionToPartySystem(working, chosenEra, year, options);
    return {
      game: transitionedGame,
      transitioned: true,
      era: chosenEra,
      probability,
      roll,
      floorYear,
    };
  }

  // ============================================================================
  // 6. INDEPENDENT PRESIDENTIAL CANDIDATES SUBSYSTEM (Section 3.2)
  // ============================================================================

  function rollIndependentPresidentialCandidate(game, year = null, options = {}) {
    const working = normalizePartySystemsState(game);
    const ps = working.partySystems;
    const cycleYear = Number(year ?? working.year ?? 2028);

    // Clear prior cycle active campaign on every cycle boundary
    ps.independentPresidency.activeCampaign = null;

    // Only evaluated during Presidential cycles (year % 4 === 0)
    if (cycleYear % 4 !== 0) {
      return { game: working, spawned: false, candidate: null };
    }

    const seed = working.seed || 2028;
    const triggerRoll = options.triggerRoll !== undefined
      ? Number(options.triggerRoll)
      : fnvHash(`ind-pres-trigger:${seed}:${cycleYear}`);

    // 20% baseline probability per presidential election
    if (triggerRoll >= 0.20) {
      return { game: working, spawned: false, candidate: null };
    }

    // Opening Polling Tier Roll: 50% (<5%), 30% (5-10%), 15% (10-25%), 5% (>25%)
    const tierRoll = options.tierRoll !== undefined
      ? Number(options.tierRoll)
      : (fnvHash(`ind-pres-tier:${seed}:${cycleYear}`) * 100);
    const withinTier = options.withinTierRoll !== undefined
      ? Number(options.withinTierRoll)
      : fnvHash(`ind-pres-within:${seed}:${cycleYear}`);

    let pollingTier = 'fringe_outsider';
    let pollingTierLabel = 'Fringe Outsider';
    let openingPoll = 3.0;
    if (tierRoll < 50) {
      pollingTier = 'fringe_outsider';
      pollingTierLabel = 'Fringe Outsider';
      openingPoll = round(1.8 + withinTier * 3.0, 1); // 1.8% - 4.8% (< 5%)
    } else if (tierRoll < 80) {
      pollingTier = 'notable_contender';
      pollingTierLabel = 'Notable Contender';
      openingPoll = round(5.2 + withinTier * 4.6, 1); // 5.2% - 9.8% (5-10%)
    } else if (tierRoll < 95) {
      pollingTier = 'serious_third_force';
      pollingTierLabel = 'Serious Third Force';
      openingPoll = round(10.5 + withinTier * 14.0, 1); // 10.5% - 24.5% (10-25%)
    } else {
      pollingTier = 'historic_titan';
      pollingTierLabel = 'Historic Titan';
      openingPoll = round(25.5 + withinTier * 9.5, 1); // 25.5% - 35.0% (> 25%)
    }

    const psd = getPSData();
    const archetypes = psd?.INDEPENDENT_ARCHETYPES || [];
    const archIdx = options.archetypeIndex !== undefined
      ? (Number(options.archetypeIndex) % archetypes.length)
      : Math.floor(fnvHash(`ind-pres-arch:${seed}:${cycleYear}`) * archetypes.length);
    const arch = archetypes[archIdx] || archetypes[0];

    const firsts = psd?.INDEPENDENT_NAME_POOL?.first || ['Arthur', 'Elena'];
    const lasts = psd?.INDEPENDENT_NAME_POOL?.last || ['Whitaker', 'Mercer'];
    const fName = firsts[Math.floor(fnvHash(`ind-pres-fn:${seed}:${cycleYear}`) * firsts.length)];
    const rawLast = lasts[Math.floor(fnvHash(`ind-pres-ln:${seed}:${cycleYear}`) * lasts.length)];
    const lName = rawLast.charAt(0).toUpperCase() + rawLast.slice(1);
    const fullName = `${fName} ${lName}`;

    const states = getChairData().STATES || [];
    const homeStateObj = states.length
      ? states[Math.floor(fnvHash(`ind-pres-st:${seed}:${cycleYear}`) * states.length)]
      : { id: 'CO', name: 'Colorado', region: 'West' };

    // Fame 65-95
    const fame = clamp(Math.round(65 + fnvHash(`ind-pres-fame:${seed}:${cycleYear}`) * 30), 65, 95);
    const [wMin, wMax] = arch?.wealthRange || [20, 60];
    const wealth = round(wMin + fnvHash(`ind-pres-wealth:${seed}:${cycleYear}`) * (wMax - wMin), 1);

    const candidate = {
      id: `ind-pres-${cycleYear}`,
      year: cycleYear,
      name: fullName,
      party: 'independent',
      archetypeId: arch?.id || 'centrist_technocrat',
      archetypeLabel: arch?.label || 'Centrist Technocrat',
      summary: arch?.summary || 'An independent presidential challenger drawing voters across party lines.',
      pollingTier,
      pollingTierLabel,
      openingPoll,
      fame,
      wealth,
      homeStateId: homeStateObj.id,
      homeStateName: homeStateObj.name,
      homeRegion: homeStateObj.region,
      axes: { ...(arch?.axes || { economic: 0, social: 0, climate: 0, local: 0.1 }) },
      ratings: { ...(arch?.ratings || { integrity: 8, charisma: 7, debate: 8, persuadability: 8, fieldcraft: 7, experience: 7 }) },
      traits: [...(arch?.traits || ['Polished', 'Disciplined'])],
    };

    ps.independentPresidency.activeCampaign = candidate;
    ps.independentPresidency.lastRunYear = cycleYear;
    ps.independentPresidency.totalRuns = Number(ps.independentPresidency.totalRuns || 0) + 1;

    const note = `INDEPENDENT WHITE HOUSE BID (${cycleYear}): ${candidate.name} (${candidate.archetypeLabel} from ${candidate.homeStateName}) launched an Independent presidential campaign!`;
    working.yearLog = [...(working.yearLog || []), { year: cycleYear, turn: 1, action: note }].slice(-80);

    return { game: working, spawned: true, candidate };
  }

  function computeIndependentDualSiphoning(game, state, indCandidate = null) {
    const ind = indCandidate || game?.partySystems?.independentPresidency?.activeCampaign;
    if (!ind || !state) {
      return { indSupport: 0, demSiphon: 0, repSiphon: 0, netMarginShift: 0 };
    }
    const stateId = state.stateId || state.id;
    const stateRegion = state.region || 'Midwest';

    // State-level independent appeal modulated by archetype geography & fame/wealth
    let regionalMult = 1.0;
    if (ind.archetypeId === 'maverick_official') {
      if (stateId === ind.homeStateId) regionalMult = 1.85;
      else if (stateRegion === ind.homeRegion) regionalMult = 1.35;
    } else if (ind.archetypeId === 'anti_establishment_populist') {
      if (stateRegion === 'Midwest' || stateRegion === 'South') regionalMult = 1.15;
    } else if (ind.archetypeId === 'centrist_technocrat') {
      if (stateRegion === 'Northeast' || stateRegion === 'West') regionalMult = 1.12;
    } else if (ind.archetypeId === 'self_funded_reformer') {
      regionalMult = 1.0 + Math.min(0.25, ((ind.wealth || 100) - 100) / 300);
    }

    const fameFactor = 0.88 + ((ind.fame || 75) - 65) / 120; // ~0.88 to 1.13
    const indSupport = clamp(round(Number(ind.openingPoll || 0) * regionalMult * fameFactor, 2), 0, 58);

    // Two-axis Euclidean proximity to Democratic ('people') vs Republican ('heritage') positions
    const indEcon = Number(ind.axes?.economic ?? 0);
    const indSoc = Number(ind.axes?.social ?? 0);

    const demParty = (game?.player && !game.player.custom && game.player.baseTemplateId === 'people')
      ? game.player
      : (game?.rivals || []).find((r) => r.id === 'people') || { economic: -0.35, social: -0.35 };
    const repParty = (game?.player && !game.player.custom && game.player.baseTemplateId === 'heritage')
      ? game.player
      : (game?.rivals || []).find((r) => r.id === 'heritage') || { economic: 0.4, social: 0.4 };

    const distDem = Math.max(0.05, Math.hypot(indEcon - (demParty.economic ?? -0.35), indSoc - (demParty.social ?? -0.35)));
    const distRep = Math.max(0.05, Math.hypot(indEcon - (repParty.economic ?? 0.4), indSoc - (repParty.social ?? 0.4)));
    const denom = distDem + distRep;

    // Closer to Dem => pulls more from Dem (proportional to distRep / (distDem + distRep))
    const demSiphon = round(indSupport * (distRep / denom), 2);
    const repSiphon = round(indSupport * (distDem / denom), 2);
    // Net shift to Dem-minus-Rep margin: if rep loses more than dem, margin shifts positive (Dem); else negative (Rep)
    const netMarginShift = round(repSiphon - demSiphon, 2);

    return {
      indSupport,
      demSiphon,
      repSiphon,
      netMarginShift,
      distDem: round(distDem, 3),
      distRep: round(distRep, 3),
    };
  }

  function dismissRealignmentModal(game) {
    if (!game?.partySystems) return game;
    const ps = game.partySystems;
    // Era #18: If the player closes the realignment chronicle without picking their post-breakup party yet,
    // advance straight into the dedicated Informed Player Party Selection Modal ('party_select').
    if (ps.currentEraId === 'era_18_party_coalition' && ps.coalitionSystem && !ps.coalitionSystem.partySelectionCompleted) {
      return {
        ...game,
        partySystems: {
          ...ps,
          pendingModal: 'party_select',
          modalPayload: {
            parties: ps.coalitionSystem.postBreakupParties || [],
            expelledCount: ps.coalitionSystem.expelledCount || 0,
            year: game.year || 2040,
          },
        },
      };
    }
    // Era #16: If the player closes the realignment chronicle before deciding Human vs. Robot Chair,
    // open the dedicated Robot Party Selection Modal ('robot_select').
    if (ps.currentEraId === 'era_16_robots_citizens' && ps.robotCitizenship && !ps.eraState?.robotChairChoiceCompleted) {
      return {
        ...game,
        partySystems: {
          ...ps,
          pendingModal: 'robot_select',
          modalPayload: {
            robotParties: ps.robotCitizenship.robotParties || [],
            humanPartyName: game.player?.name || 'Your Human Party',
            totalRepresentedVoters: ps.robotCitizenship.totalRepresentedVoters || 310_000_000,
            year: game.year || 2080,
          },
        },
      };
    }
    return {
      ...game,
      partySystems: {
        ...ps,
        pendingModal: null,
        modalPayload: null,
      },
    };
  }

  // ============================================================================
  // 7. PHASE 2 HELPER CLASSIFIERS & 16 STANDARD MODIFIER / REALIGNMENT PLUGINS
  // ============================================================================

  function resolvePlayerPartyKey(game) {
    if (!game?.player) return 'people';
    return game.player.custom ? 'player' : (game.player.baseTemplateId || 'people');
  }

  function resolveCandidateAge(candidate, year = 2028) {
    if (!candidate) return 52;
    if (Number.isFinite(Number(candidate.age))) return Number(candidate.age);
    const traits = Array.isArray(candidate.traits) ? candidate.traits : [];
    const h = fnvHash(`cand-age:${candidate.id || candidate.name || 'anon'}`);
    const terms = candidate.termsServed || {};
    const totalTerms = Number(terms.senate || 0) * 6 + Number(terms.house || 0) * 2 + Number(terms.governor || 0) * 4 + Number(terms.president || 0) * 4;
    if (traits.includes('Rising Star')) {
      return Math.round(35 + h * 9); // 35..44 (< 45)
    }
    if (traits.includes('Established politician') || totalTerms >= 18) {
      return Math.round(66 + h * 11); // 66..77 (> 65)
    }
    const baseAge = Math.round(40 + h * 30 + Math.min(10, totalTerms * 0.4));
    const yearBump = Math.max(0, Math.min(8, Math.floor((Number(year || 2028) - 2028) / 4)));
    return clamp(baseAge + yearBump, 30, 82);
  }

  function isMetroState(stateId) {
    const psd = getPSData();
    const metroList = psd?.METRO_LEAGUE_STATES || [
      'CA', 'NY', 'NJ', 'MA', 'CT', 'RI', 'MD', 'DE', 'IL', 'WA',
      'OR', 'CO', 'VA', 'FL', 'GA', 'AZ', 'NV', 'HI', 'DC', 'MN',
    ];
    return metroList.includes(stateId);
  }

  function resolveCandidateGeoArchetype(candidate) {
    if (!candidate) return 'balanced';
    if (candidate.geoArchetype === 'metro' || candidate.geoArchetype === 'heartland') {
      return candidate.geoArchetype;
    }
    const fac = String(candidate.factionId || candidate.faction || '').toLowerCase();
    const wing = String(candidate.wing || '').toLowerCase();
    if (fac.includes('yimby') || fac.includes('neo_liberal') || fac.includes('capital_l') || fac.includes('liberal_establishment') || wing.includes('urban') || wing.includes('metro')) {
      return 'metro';
    }
    if (fac.includes('farmer') || fac.includes('maga') || fac.includes('blue_dog') || fac.includes('paleocon') || fac.includes('blood_and_soil') || fac.includes('western_maverick') || wing.includes('rural') || wing.includes('heartland') || wing.includes('frontier')) {
      return 'heartland';
    }
    if (candidate.stateId && candidate.stateId !== 'US') {
      return isMetroState(candidate.stateId) ? 'metro' : 'heartland';
    }
    return 'balanced';
  }

  function isExtremistCandidate(candidate, game = null) {
    if (!candidate) return false;
    if (Number.isFinite(Number(candidate.avgStance))) {
      const s = Number(candidate.avgStance);
      return s <= 2.5 || s >= 8.5;
    }
    if (candidate.isExtremist === true) return true;
    const fac = String(candidate.factionId || candidate.faction || '').toLowerCase();
    const wing = String(candidate.wing || '').toLowerCase();
    const extremistFacTokens = [
      'capital_l', 'bernie_bros', 'gop_maga', 'blood_and_soil', 'paleocon',
      'dominionist', 'eco_socialist', 'soc_socialists', 'soc_communists',
      'ancaps', 'groyper', 'klan', 'progressive-activists', 'nationalist-populists',
    ];
    if (extremistFacTokens.some((tok) => fac.includes(tok))) return true;
    if (wing.includes('maga') || wing.includes('socialist') || wing.includes('far-') || wing.includes('hardline') || wing.includes('extremist')) return true;
    if (game && candidate.partyId) {
      const pAvg = computeAveragePillarStance(game, candidate.partyId);
      if (pAvg <= 2.0 || pAvg >= 9.0) return true;
    }
    return false;
  }

  function hasSqueakyCleanTrait(candidate) {
    if (!candidate) return false;
    if (Array.isArray(candidate.traits) && candidate.traits.some((t) => String(t).toLowerCase() === 'squeaky clean')) {
      return true;
    }
    return candidate.squeakyClean === true;
  }

  function isLaborFaction(factionIdOrObj) {
    const psd = getPSData();
    const set = new Set(psd?.LABOR_FACTION_IDS || ['workers', 'organizers', 'dem_bernie_bros', 'dem_blue_dog', 'gop_maga', 'gop_traditional_farmers', 'swg_hard_hats']);
    const id = typeof factionIdOrObj === 'string' ? factionIdOrObj : (factionIdOrObj?.id || '');
    const legacy = typeof factionIdOrObj === 'object' ? (factionIdOrObj?.legacyId || '') : '';
    const name = typeof factionIdOrObj === 'object' ? String(factionIdOrObj?.name || '').toLowerCase() : '';
    if (set.has(id) || (legacy && set.has(legacy))) return true;
    return name.includes('labor') || name.includes('worker') || name.includes('union') || name.includes('blue') || name.includes('farmer') || name.includes('hard hat');
  }

  function isBusinessFaction(factionIdOrObj) {
    const psd = getPSData();
    const set = new Set(psd?.BUSINESS_FACTION_IDS || ['funders', 'pragmatists', 'dem_neo_liberals', 'dem_liberal_establishment', 'gop_market_country_club', 'gop_suburban_moderates', 'swg_country_club_centrists']);
    const id = typeof factionIdOrObj === 'string' ? factionIdOrObj : (factionIdOrObj?.id || '');
    const legacy = typeof factionIdOrObj === 'object' ? (factionIdOrObj?.legacyId || '') : '';
    const name = typeof factionIdOrObj === 'object' ? String(factionIdOrObj?.name || '').toLowerCase() : '';
    if (set.has(id) || (legacy && set.has(legacy))) return true;
    return name.includes('business') || name.includes('market') || name.includes('funder') || name.includes('corporate') || name.includes('country-club') || name.includes('country club') || name.includes('neo-liberal') || name.includes('technocrat');
  }

  function generateDownballotIndependents(game) {
    const chair = getChairData();
    const psd = getPSData();
    const names = psd?.INDEPENDENT_NAME_POOL || ['Evan Vance', 'Clara Sterling', 'Marcus Thorne', 'Elena Reyes', 'Arthur Vance', 'Nadia Okafor'];
    const archetypes = psd?.INDEPENDENT_ARCHETYPES || [{ id: 'centrist_technocrat', label: 'Centrist Technocrat' }];
    const year = Number(game?.year || 2028);
    const seed = Number(game?.seed || 2028);
    const result = {};

    const houseDistricts = chair.VERSION_01_HOUSE_DISTRICTS || [];
    houseDistricts.forEach((dist, idx) => {
      const leanAbs = Math.abs(Number(dist.lean || 0));
      // Concentrated in safe non-competitive districts (~60% in safe, ~35% in competitive -> ~50% overall)
      const threshold = leanAbs >= 8 ? 0.58 : 0.36;
      const roll = fnvHash(`era5-ind-house:${seed}:${year}:${dist.id}:${idx}`);
      if (roll < threshold) {
        const name = names[Math.floor(fnvHash(`era5-name:${dist.id}:${year}`) * names.length) % names.length];
        const arch = archetypes[Math.floor(fnvHash(`era5-arch:${dist.id}:${year}`) * archetypes.length) % archetypes.length];
        const openingShare = round(14 + fnvHash(`era5-share:${dist.id}:${year}`) * 24, 1); // 14..38%
        result[`house:${dist.id}`] = {
          raceId: `house:${dist.id}`,
          kind: 'house',
          stateId: dist.stateId,
          name,
          archetypeId: arch.id,
          archetypeLabel: arch.label,
          projectedShare: openingShare,
          safeDistrictTarget: leanAbs >= 8,
        };
      }
    });

    const senateRaces = game?.activeSenateRaces || chair.VERSION_01_SENATE_RACES || [];
    senateRaces.forEach((race, idx) => {
      const stId = race.state || race.stateId;
      const stObj = (chair.STATES || []).find((s) => s.id === stId);
      const leanAbs = Math.abs(Number(stObj?.leanPercent ?? (stObj?.lean || 0) * 100));
      const threshold = leanAbs >= 10 ? 0.60 : 0.40;
      const roll = fnvHash(`era5-ind-senate:${seed}:${year}:${stId}:${idx}`);
      if (roll < threshold) {
        const name = names[Math.floor(fnvHash(`era5-sen-name:${stId}:${year}`) * names.length) % names.length];
        const arch = archetypes[Math.floor(fnvHash(`era5-sen-arch:${stId}:${year}`) * archetypes.length) % archetypes.length];
        const openingShare = round(16 + fnvHash(`era5-sen-share:${stId}:${year}`) * 22, 1);
        result[`senate:${stId}`] = {
          raceId: `senate:${stId}`,
          kind: 'senate',
          stateId: stId,
          name,
          archetypeId: arch.id,
          archetypeLabel: arch.label,
          projectedShare: openingShare,
          safeDistrictTarget: leanAbs >= 10,
        };
      }
    });

    return result;
  }

  function computeAiAlignmentForParty(game, partyId) {
    const positions = resolvePartyPositionsMap(game, partyId);
    const aiIssueIds = [
      'era15-compute-sovereignty', 'era15-ubi-automation', 'era15-algorithmic-audits',
      'era15-synthetic-media-bans', 'era15-ai-labor-displacement', 'era15-open-weights-regulation',
      'era15-ai-copyright-royalties', 'era15-automated-healthcare', 'era15-autonomous-weapons',
      'era15-digital-personhood-prelude',
    ];
    const vals = aiIssueIds.map((id) => positions[id]).filter((v) => Number.isFinite(Number(v))).map(Number);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : computeAveragePillarStance(game, partyId);
    if (avg >= 6.5) return { label: 'Accelerationist', score: round(avg, 2) };
    if (avg <= 4.0) return { label: 'Labor Protectionist', score: round(avg, 2) };
    return { label: 'Balanced Governance', score: round(avg, 2) };
  }

  function ensureEraState(game) {
    if (!game.partySystems) game.partySystems = createInitialPartySystemsState(game);
    if (!game.partySystems.eraState || typeof game.partySystems.eraState !== 'object') {
      game.partySystems.eraState = {};
    }
    return game.partySystems.eraState;
  }

  function registerPhase2EraPlugins() {
    // ------------------------------------------------------------------
    // ERA #1: The Anti-Extremist Coalition (Group A · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_01_anti_extremist',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.antiExtremistFrontActive = true;
        es.crossEndorsementBoost = 4.0;
        es.independentDefectionBonus = 0.25;
      },
      onEraExit(game) {
        const es = ensureEraState(game);
        es.antiExtremistFrontActive = false;
      },
      getIndependentDefectionBonus() {
        return 0.25;
      },
      getCandidateMarginModifier(game, candidate, stateId, ctx = {}) {
        const oppExtremist = Boolean(ctx.opposingExtremist) || (ctx.opponent && isExtremistCandidate(ctx.opponent, game));
        const selfExtremist = isExtremistCandidate(candidate, game);
        if (oppExtremist && !selfExtremist) {
          return 4.0; // +4.0% cross-party fusion / non-aggression endorsement boost
        }
        return 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #4: The Landslide Realignment Era (Group B · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_04_landslide_realignment',
      onEraEnter(game) {
        const es = ensureEraState(game);
        const lastElection = game?.lastElection || (game?.elections || [])[(game?.elections || []).length - 1] || null;
        const winner = game?.governingParty || lastElection?.presidentialWinner || 'people';
        es.landslideWinner = winner;
        es.waveVolatilityMultiplier = 1.8;

        // Opposition suffers severe base apathy (-15 Faction Happiness)
        const playerKey = resolvePlayerPartyKey(game);
        const standings = { ...(game.factionStandings || {}) };
        const hapMap = { ...(game.factionHappiness || {}) };
        const factions = Array.isArray(game.factions) ? game.factions : [];
        let oppositionAffected = 0;

        factions.forEach((f) => {
          const isWinnerFaction = f.partyId === winner || (winner === 'player' && f.partyId === playerKey);
          const isOpposition = f.partyId && f.partyId !== 'independent' && f.partyId !== 'unaffiliated' && !isWinnerFaction;
          if (isOpposition) {
            if (standings[f.id] !== undefined) {
              standings[f.id] = clamp(round(Number(standings[f.id]) - 15, 1), 0, 100);
            }
            if (hapMap[f.id] !== undefined) {
              hapMap[f.id] = clamp(round(Number(hapMap[f.id]) - 15, 1), 0, 100);
            } else if (standings[f.id] !== undefined) {
              hapMap[f.id] = standings[f.id];
            }
            oppositionAffected += 1;
          }
        });

        // Also apply to legacy standings keys when player is in opposition
        if (playerKey !== winner) {
          Object.keys(standings).forEach((k) => {
            if (!factions.some((f) => f.id === k)) {
              standings[k] = clamp(round(Number(standings[k]) - 15, 1), 0, 100);
            }
          });
        }

        game.factionStandings = standings;
        game.factionHappiness = hapMap;
        es.oppositionApathyApplied = true;
        es.oppositionFactionsHit = oppositionAffected;
      },
      getWaveVolatilityMultiplier() {
        return 1.8;
      },
      getTurnoutModifier(game, partyId) {
        const winner = game?.partySystems?.eraState?.landslideWinner || game?.governingParty || 'people';
        const resolved = (!partyId || partyId === 'player') ? resolvePlayerPartyKey(game) : partyId;
        return resolved === winner ? 6.0 : 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #5: The Independent Surge Era (Group B · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_05_independent_surge',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.independentDownballotRaces = generateDownballotIndependents(game);
        es.independentWastedVoteZero = true;
      },
      onCycleStart(game) {
        const es = ensureEraState(game);
        es.independentDownballotRaces = generateDownballotIndependents(game);
      },
      getStrategicDefectionModifier(game, partyId) {
        // Wasted-vote penalty for independents (and independent-aligned minor campaigns) collapsed to 0%
        if (!partyId || partyId === 'independent' || !['people', 'heritage'].includes(partyId)) {
          return 0;
        }
        return 1.0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #6: Left-Wing Replacement (Group C · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_06_left_replacement',
      onEraEnter(game) {
        const es = ensureEraState(game);
        const detected = detectReplacementInsurgent(game, 'left');
        const playerKey = resolvePlayerPartyKey(game);
        const fallbackInsurgent = (!['people', 'heritage'].includes(playerKey) && computeAveragePillarStance(game, null) <= 4.0)
          ? playerKey
          : 'green';
        const insurgentId = detected?.insurgentPartyId || fallbackInsurgent;

        const nextTiers = { ...(game.partyTiers || { people: 5, heritage: 5, liberty: 1, green: 1, constitution: 1, socialist: 1 }) };
        nextTiers.people = 2; // Permanently demote Democrats to Tier 2 Minor Party
        nextTiers[insurgentId] = 5; // Permanently promote insurgent progressive party to Tier 5 Major Party
        game.partyTiers = nextTiers;

        const displaced = new Set(Array.isArray(es.displacedMajorParties) ? es.displacedMajorParties : []);
        displaced.add('people');
        es.displacedMajorParties = [...displaced];
        const promoted = new Set(Array.isArray(es.promotedMajorParties) ? es.promotedMajorParties : []);
        promoted.add(insurgentId);
        es.promotedMajorParties = [...promoted];
        es.leftReplacement = { displacedPartyId: 'people', insurgentPartyId: insurgentId };

        if (insurgentId === playerKey || (insurgentId === 'player' && game.player?.custom)) {
          game.identityCrisis = {
            ...(game.identityCrisis || {}),
            institutionalDonorsUnlocked: true,
          };
        }
      },
    });

    // ------------------------------------------------------------------
    // ERA #7: Right-Wing Replacement (Group C · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_07_right_replacement',
      onEraEnter(game) {
        const es = ensureEraState(game);
        const detected = detectReplacementInsurgent(game, 'right');
        const playerKey = resolvePlayerPartyKey(game);
        const fallbackInsurgent = (!['people', 'heritage'].includes(playerKey) && computeAveragePillarStance(game, null) >= 6.0)
          ? playerKey
          : 'liberty';
        const insurgentId = detected?.insurgentPartyId || fallbackInsurgent;

        const nextTiers = { ...(game.partyTiers || { people: 5, heritage: 5, liberty: 1, green: 1, constitution: 1, socialist: 1 }) };
        nextTiers.heritage = 2; // Permanently demote Republicans to Tier 2 Minor Party
        nextTiers[insurgentId] = 5; // Permanently promote insurgent conservative party to Tier 5 Major Party
        game.partyTiers = nextTiers;

        const displaced = new Set(Array.isArray(es.displacedMajorParties) ? es.displacedMajorParties : []);
        displaced.add('heritage');
        es.displacedMajorParties = [...displaced];
        const promoted = new Set(Array.isArray(es.promotedMajorParties) ? es.promotedMajorParties : []);
        promoted.add(insurgentId);
        es.promotedMajorParties = [...promoted];
        es.rightReplacement = { displacedPartyId: 'heritage', insurgentPartyId: insurgentId };

        if (insurgentId === playerKey || (insurgentId === 'player' && game.player?.custom)) {
          game.identityCrisis = {
            ...(game.identityCrisis || {}),
            institutionalDonorsUnlocked: true,
          };
        }
      },
    });

    // ------------------------------------------------------------------
    // ERA #8: Ideologies Cool (Group C · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_08_ideologies_cool',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.depolarizationActive = true;
      },
      getTurnoutModifier() {
        return -8.0; // Base turnout drops by 8%
      },
      getIndependentElasticityMultiplier() {
        return 1.5; // Suburban independent elasticity surges
      },
      getCandidateMarginModifier(game, candidate) {
        if (isExtremistCandidate(candidate, game)) {
          return -5.0; // Extremist candidates suffer -5.0% general election penalty
        }
        return 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #9: The 5th Great Awakening (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_09_great_awakening',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.pillar4Baseline = 7.0;
        const states = getChairData().STATES || [];
        const baselineMap = {};
        states.forEach((st) => {
          baselineMap[st.id] = 7.0;
        });
        es.statePillar4Baselines = baselineMap;
      },
      getCandidateMarginModifier(game, candidate, stateId, ctx = {}) {
        const pillar4 = Number.isFinite(Number(candidate?.pillar4Stance))
          ? Number(candidate.pillar4Stance)
          : computePillarAverageStance(game, 'social-cultural', ctx.partyId || candidate?.partyId || null);
        if (pillar4 <= 4.0) {
          return -6.0; // Secular candidates/platforms (Pillar 4 <= 4.0) suffer -6.0% penalty
        }
        return 0;
      },
      getVolunteerDriveMultiplier(game, ctx = {}) {
        const pillar4 = Number.isFinite(Number(ctx.pillar4Stance))
          ? Number(ctx.pillar4Stance)
          : computePillarAverageStance(game, 'social-cultural', ctx.partyId || null);
        return pillar4 <= 4.0 ? 0.75 : 1.0; // -25% volunteer drive yield
      },
    });

    // ------------------------------------------------------------------
    // ERA #11: The Generational Succession Crisis (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_11_generational_succession',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.generationalWaveActive = true;
      },
      getCandidateMarginModifier(game, candidate) {
        if (!candidate) return 0;
        const age = resolveCandidateAge(candidate, game?.year || 2028);
        if (age > 65) return -8.0; // -8.0% youth turnout penalty on general margin
        if (age < 45) return 2.5;
        return 0;
      },
      getTurnoutModifier(game, partyId, stateId, ctx = {}) {
        const cand = ctx.candidate || null;
        if (!cand) return 0;
        const age = resolveCandidateAge(cand, game?.year || 2028);
        if (age > 65) return -8.0;
        if (age < 45) return 5.0;
        return 0;
      },
      getVolunteerDriveMultiplier(game, ctx = {}) {
        const cand = ctx.candidate || null;
        if (cand) {
          const age = resolveCandidateAge(cand, game?.year || 2028);
          if (age < 45) return 1.05; // +5.0% volunteer drive surge
          if (age > 65) return 0.92;
        }
        // Check party nominee or active presidential ticket if no explicit candidate passed
        const playerKey = resolvePlayerPartyKey(game);
        const nom = (game?.primaryResults || []).find((r) => r.raceId === 'presidential:US' && r.partyId === playerKey);
        if (nom) {
          const age = resolveCandidateAge(nom, game?.year || 2028);
          if (age < 45) return 1.05;
        }
        return 1.0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #12: The Digital Syndicate & Influencer Politics (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_12_digital_syndicate',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.digitalSyndicateActive = true;
      },
      getFundraisingModifier(game, source, ctx = {}) {
        if (source === 'chapter') return 0.50; // Physical State Chapter revenue reduced by -50%
        if (source === 'small-dollar' || source === 'viral' || source === 'joint-fundraising') {
          if (ctx && ctx.candidate) {
            return Number(ctx.candidate.fame || 0) > 80 ? 3.0 : 1.0; // >80 Fame gains 3x small-dollar virality yields
          }
          // Check party's highest-fame active leader/nominee when no explicit candidate is passed
          const playerKey = resolvePlayerPartyKey(game);
          const pool = (game?.sittingMembers || []).filter((m) => m.party === playerKey || m.partyId === playerKey);
          const maxFame = pool.reduce((mx, m) => Math.max(mx, Number(m.fame || 0)), Number(ctx.fame || 0));
          if (maxFame > 80) return 3.0;
        }
        return 1.0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #13: The Green Transition Crucible (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_13_green_transition',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.greenBaselineBoost = 10.0;
        es.cleanTechPacRatio = 2.0;

        // Permanently elevate Green Party to at least Tier 4 Contender status
        const nextTiers = { ...(game.partyTiers || { people: 5, heritage: 5, liberty: 1, green: 1, constitution: 1, socialist: 1 }) };
        nextTiers.green = Math.max(4, Number(nextTiers.green || 1));
        game.partyTiers = nextTiers;

        // Permanently elevate Green Party baseShare toward 30% major-party contender benchmark
        if (game.player && !game.player.custom && game.player.baseTemplateId === 'green') {
          game.player = { ...game.player, baseShare: Math.max(30.0, round(Number(game.player.baseShare || 2) + 25.0, 2)) };
        }
        if (Array.isArray(game.rivals)) {
          game.rivals = game.rivals.map((r) => (
            r.id === 'green' || r.baseTemplateId === 'green'
              ? { ...r, baseShare: Math.max(30.0, round(Number(r.baseShare || 2) + 25.0, 2)) }
              : r
          ));
        }

        // Balance #2: Massive Green Transition Crucible upset — form new Green Party factions and
        // shift voters out of BOTH Democratic and Republican factions toward a 30% Green / 34% Dem / 34% Rep
        // partisan split (leaving ~2% for other minor parties while preserving independents & 1:1 conservation).
        const psdGreen = getPSData();
        const newGreenDefs = Array.isArray(psdGreen?.ECOLOGICAL_COLLAPSE_GREEN_FACTIONS) && psdGreen.ECOLOGICAL_COLLAPSE_GREEN_FACTIONS.length
          ? psdGreen.ECOLOGICAL_COLLAPSE_GREEN_FACTIONS
          : [
              { id: 'grn_eco_liberals', name: 'Eco-Liberals', partyId: 'green', category: 'minor', sliders: { economic: 3.5, social: 2.2, governance: 4.5 }, pull: { economic: -0.35, social: -0.6, climate: 0.92, local: 0.0 }, happiness: 74, confidence: 64 },
              { id: 'grn_eco_fascists', name: 'Eco-Nationalists', partyId: 'green', category: 'minor', sliders: { economic: 5.0, social: 8.2, governance: 8.8 }, pull: { economic: 0.0, social: 0.7, climate: 0.95, local: -0.6 }, happiness: 64, confidence: 58 },
            ];
        if (!Array.isArray(game.factions)) game.factions = [];
        const existingFacIds = new Set(game.factions.map((f) => f && f.id).filter(Boolean));
        const greenFactionIds = [];
        newGreenDefs.forEach((def) => {
          if (!def || !def.id) return;
          greenFactionIds.push(def.id);
          if (!existingFacIds.has(def.id)) {
            existingFacIds.add(def.id);
            game.factions.push({ ...def, partyId: 'green' });
            if (game.factionHappiness) game.factionHappiness[def.id] = def.happiness ?? 70;
            if (game.factionStandings) game.factionStandings[def.id] = def.happiness ?? 70;
            if (game.factionConfidence) game.factionConfidence[def.id] = def.confidence ?? 62;
          }
        });
        // Include any existing Green factions too
        game.factions.filter((f) => f && f.partyId === 'green').forEach((f) => {
          if (!greenFactionIds.includes(f.id)) greenFactionIds.push(f.id);
        });

        const vm = game.voterModel;
        if (vm && Array.isArray(vm.states) && greenFactionIds.length > 0) {
          const demFacIds = new Set(game.factions.filter((f) => f && f.partyId === 'people').map((f) => f.id));
          const repFacIds = new Set(game.factions.filter((f) => f && f.partyId === 'heritage').map((f) => f.id));
          const div = (vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10_000_000) ? 1 : 100;

          vm.states.forEach((st) => {
            if (!st || !st.factions) return;
            const stF = st.factions;
            const curDem = Object.entries(stF).reduce((s, [fid, v]) => s + (demFacIds.has(fid) ? (Number(v) || 0) : 0), 0);
            const curRep = Object.entries(stF).reduce((s, [fid, v]) => s + (repFacIds.has(fid) ? (Number(v) || 0) : 0), 0);
            const curGrn = Object.entries(stF).reduce((s, [fid, v]) => s + (greenFactionIds.includes(fid) ? (Number(v) || 0) : 0), 0);
            const combinedMajorAndGreen = curDem + curRep + curGrn;
            if (combinedMajorAndGreen <= 0) return;

            // Target 30/34/34 of the 98% partisan pool (30/98 = 30.61% Green, 34/98 = 34.69% Dem, 34/98 = 34.69% Rep)
            const targetGrn = Math.round(combinedMajorAndGreen * (30 / 98));
            const targetDem = Math.round(combinedMajorAndGreen * (34 / 98));
            const targetRep = Math.max(0, combinedMajorAndGreen - targetGrn - targetDem);

            let movedToGreen = 0;
            // Scale Democratic factions toward targetDem
            if (curDem > targetDem && curDem > 0) {
              const demCut = curDem - targetDem;
              let demCutLeft = demCut;
              const demEntries = Object.keys(stF).filter((fid) => demFacIds.has(fid) && (Number(stF[fid]) || 0) > 0);
              demEntries.forEach((fid, idx) => {
                const v = Number(stF[fid]) || 0;
                const cut = idx === demEntries.length - 1 ? Math.min(v, demCutLeft) : Math.min(v, Math.round(demCut * (v / curDem)));
                stF[fid] = v - cut;
                demCutLeft -= cut;
                movedToGreen += cut;
              });
            }
            // Scale Republican factions toward targetRep
            if (curRep > targetRep && curRep > 0) {
              const repCut = curRep - targetRep;
              let repCutLeft = repCut;
              const repEntries = Object.keys(stF).filter((fid) => repFacIds.has(fid) && (Number(stF[fid]) || 0) > 0);
              repEntries.forEach((fid, idx) => {
                const v = Number(stF[fid]) || 0;
                const cut = idx === repEntries.length - 1 ? Math.min(v, repCutLeft) : Math.min(v, Math.round(repCut * (v / curRep)));
                stF[fid] = v - cut;
                repCutLeft -= cut;
                movedToGreen += cut;
              });
            }
            // Distribute moved voters across new & existing Green factions
            if (movedToGreen > 0) {
              let addLeft = movedToGreen;
              greenFactionIds.forEach((gid, idx) => {
                const share = idx === greenFactionIds.length - 1 ? addLeft : Math.round(movedToGreen / greenFactionIds.length);
                stF[gid] = (Number(stF[gid]) || 0) + share;
                addLeft -= share;
              });
            }

            // Reconcile state affiliations immediately
            st.affiliations = st.affiliations || {};
            const newDem = Object.entries(stF).reduce((s, [fid, v]) => s + (demFacIds.has(fid) ? (Number(v) || 0) : 0), 0);
            const newRep = Object.entries(stF).reduce((s, [fid, v]) => s + (repFacIds.has(fid) ? (Number(v) || 0) : 0), 0);
            const newGrn = Object.entries(stF).reduce((s, [fid, v]) => s + (greenFactionIds.includes(fid) ? (Number(v) || 0) : 0), 0);
            st.affiliations.people = Math.round(newDem / div);
            st.affiliations.heritage = Math.round(newRep / div);
            st.affiliations.green = Math.round(newGrn / div);
            st.affiliations.thirdParty = (st.affiliations.green || 0) + (st.affiliations.liberty || 0) + (st.affiliations.constitution || 0) + (st.affiliations.socialist || 0) + (st.affiliations.other || 0);
          });

          // Reconcile national voterModel.factions & affiliations
          const natF = {};
          let totDem = 0, totRep = 0, totGrn = 0, totTp = 0;
          vm.states.forEach((st) => {
            Object.entries(st.factions || {}).forEach(([fid, v]) => { natF[fid] = (natF[fid] || 0) + (Number(v) || 0); });
            totDem += Number(st.affiliations?.people || 0);
            totRep += Number(st.affiliations?.heritage || 0);
            totGrn += Number(st.affiliations?.green || 0);
            totTp += Number(st.affiliations?.thirdParty || 0);
          });
          vm.factions = natF;
          const scale = (vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
          if (vm.affiliations?.people) { vm.affiliations.people.sampleVoters = totDem; vm.affiliations.people.representedVoters = totDem * scale; }
          if (vm.affiliations?.heritage) { vm.affiliations.heritage.sampleVoters = totRep; vm.affiliations.heritage.representedVoters = totRep * scale; }
          if (vm.affiliations?.green) { vm.affiliations.green.sampleVoters = totGrn; vm.affiliations.green.representedVoters = totGrn * scale; }
          if (vm.affiliations?.thirdParty) {
            vm.affiliations.thirdParty.sampleVoters = totTp;
            vm.affiliations.thirdParty.representedVoters = totTp * scale;
            if (vm.affiliations.thirdParty.byParty) vm.affiliations.thirdParty.byParty.green = totGrn;
          }
        }

        // Rebalance Super PAC pools so Clean-Tech out-funds Fossil 2:1 immediately
        if (Array.isArray(game.superPacs) && game.superPacs.length) {
          const psd = getPSData();
          const cleanIds = new Set(psd?.CLEAN_TECH_PAC_IDS || ['green-future-action']);
          const fossilIds = new Set(psd?.FOSSIL_PAC_IDS || ['energy-independence-pac']);
          game.superPacs = game.superPacs.map((pac) => {
            if (cleanIds.has(pac.id)) {
              return { ...pac, pool: clamp(round((pac.pool || 15) * 1.6, 1), 10, 60), weeklyIncome: round((pac.weeklyIncome || 1.6) * 2.0, 2) };
            }
            if (fossilIds.has(pac.id)) {
              return { ...pac, pool: Math.max(2, round((pac.pool || 14) * 0.8, 1)), weeklyIncome: round((pac.weeklyIncome || 1.5) * 1.0, 2) };
            }
            return pac;
          });
        }
      },
      getSuperPacFundingMultiplier(game, pac) {
        if (!pac) return 1.0;
        const psd = getPSData();
        const cleanIds = new Set(psd?.CLEAN_TECH_PAC_IDS || ['green-future-action']);
        const fossilIds = new Set(psd?.FOSSIL_PAC_IDS || ['energy-independence-pac']);
        if (cleanIds.has(pac.id) || (pac.axis === 'climate' && Array.isArray(pac.idealRange) && pac.idealRange[0] <= 3)) {
          return 2.0; // 2:1 clean-tech advantage
        }
        if (fossilIds.has(pac.id) || (pac.axis === 'climate' && Array.isArray(pac.idealRange) && pac.idealRange[0] >= 7)) {
          return 1.0;
        }
        return 1.0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #14: The Tripartite Corporatist Compact (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_14_tripartite_corporatist',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.tripartiteSignoffRequired = true;
      },
      getPillarWeightModifiers() {
        // Elections heavily weighted onto Pillar 1 (Tax & Economy) & Pillar 5 (Social Services)
        return {
          'tax-economy': 2.5,
          'social-services': 2.5,
          default: 0.35,
        };
      },
      getBillSignoffRequirement(game, pendingBill) {
        const endorsements = Array.isArray(pendingBill?.endorsements) ? pendingBill.endorsements : [];
        const allFactions = Array.isArray(game?.factions) ? game.factions : (getChairData().FACTIONS_CATALOG || []);
        const resolved = endorsements.map((id) => allFactions.find((f) => f.id === id || f.legacyId === id) || id);
        const hasLabor = resolved.some((f) => isLaborFaction(f));
        const hasBusiness = resolved.some((f) => isBusinessFaction(f));
        const missing = [];
        if (!hasLabor) missing.push('Labor faction');
        if (!hasBusiness) missing.push('Business faction');
        return {
          required: true,
          hasLabor,
          hasBusiness,
          canPass: hasLabor && hasBusiness,
          missing,
        };
      },
    });

    // ------------------------------------------------------------------
    // ERA #15: The AI Boom (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_15_ai_boom',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.aiRealignmentActive = true;
        es.aiAlignments = {
          player: computeAiAlignmentForParty(game, null),
          people: computeAiAlignmentForParty(game, 'people'),
          heritage: computeAiAlignmentForParty(game, 'heritage'),
        };
      },
      onCycleStart(game) {
        const es = ensureEraState(game);
        es.aiAlignments = {
          player: computeAiAlignmentForParty(game, null),
          people: computeAiAlignmentForParty(game, 'people'),
          heritage: computeAiAlignmentForParty(game, 'heritage'),
        };
      },
      getIssueSalienceModifiers(game) {
        const activeEraIssues = (game?.partySystems?.eraExclusiveIssuesActive || []).filter((id) => id.startsWith('era15-'));
        const weights = {};
        activeEraIssues.forEach((id) => { weights[id] = 3.0; });
        return { weights, defaultWeight: 0.75, axisLabel: 'Accelerationism vs. Labor Protectionism' };
      },
    });

    // ------------------------------------------------------------------
    // ERA #19: The Charismatic Movement Era (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_19_charismatic_movement',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.coattailMultiplier = 2.5;
        es.successionWarActive = Boolean((game?.incumbentTermNumber ?? 1) >= 2 && ((game?.year || 2028) % 4 === 0));
      },
      onCycleStart(game) {
        const es = ensureEraState(game);
        const isPres = ((game?.year || 2028) % 4 === 0);
        const termLimited = Number(game?.incumbentTermNumber ?? 1) >= 2;
        const leaderRetired = Boolean(game?.leaderRetiredThisCycle || es.leaderRetiredThisCycle);
        es.successionWarActive = Boolean((isPres && termLimited) || leaderRetired);
        if (es.successionWarActive) {
          // Heightened faction friction during open Succession War
          const standings = { ...(game.factionStandings || {}) };
          Object.keys(standings).forEach((k) => {
            standings[k] = clamp(round(Number(standings[k]) - 6, 1), 0, 100);
          });
          game.factionStandings = standings;
        }
      },
      onPrimaryResolve(game) {
        const es = ensureEraState(game);
        if (es.successionWarActive) {
          es.lastSuccessionWarYear = game?.year || 2028;
          es.successionWarResolved = true;
          es.successionWarActive = false;
        }
      },
      getCoattailMultiplier() {
        return 2.5; // Presidential nominee / leader Fame & approval carry 2.5x coattails
      },
    });

    // ------------------------------------------------------------------
    // ERA #20: The Permanent Emergency Cycle (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_20_permanent_emergency',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.permanentEmergencyActive = true;
      },
      getApprovalDecayMultiplier() {
        return 2.0; // Incumbent party approval decays twice as fast
      },
      getFundraisingModifier(game, source, ctx = {}) {
        const partyId = ctx.partyId || resolvePlayerPartyKey(game);
        const govParty = game?.governingParty || 'heritage';
        if (partyId && partyId !== govParty) {
          return 1.20; // Out-of-power opposition gains +20% fundraising
        }
        return 1.0;
      },
      getTurnoutModifier(game, partyId) {
        const resolved = (!partyId || partyId === 'player') ? resolvePlayerPartyKey(game) : partyId;
        const govParty = game?.governingParty || 'heritage';
        return resolved !== govParty ? 4.0 : 0; // +4.0% election tailwind for out-of-power opposition
      },
      getNationalWindModifier(game) {
        const govParty = game?.governingParty || 'heritage';
        // Positive margin = Democratic ('people') tailwind; negative = Republican ('heritage') tailwind
        if (govParty === 'heritage') return 4.0;
        if (govParty === 'people') return -4.0;
        return 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #21: The Metro League vs. Heartland Compact (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_21_metro_vs_heartland',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.metroVsHeartlandActive = true;
      },
      getCandidateMarginModifier(game, candidate, stateId) {
        if (!candidate || !stateId || stateId === 'US') return 0;
        const arch = resolveCandidateGeoArchetype(candidate);
        if (arch === 'balanced') return 0;
        const stateIsMetro = isMetroState(stateId);
        if ((arch === 'metro' && !stateIsMetro) || (arch === 'heartland' && stateIsMetro)) {
          return -6.0; // Steep local penalty for mismatched geographic archetype
        }
        return 2.0; // Authentic local metro/heartland match bonus
      },
    });

    // ------------------------------------------------------------------
    // ERA #26: The Post-Citizens United Era (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_26_post_citizens_united',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.superPacsOutlawed = true;
        game.superPacs = []; // Dissolve all Super PACs nationwide
        game.partySystems.postCitizensUnited = {
          active: true,
          pacsDissolved: true,
          enactedYear: Number(game?.year || 2028),
          publicMatchBonus: 0.25,
        };
      },
      onCycleStart(game) {
        // Keep Super PACs dissolved while Era #26 is active
        game.superPacs = [];
      },
      getFundraisingModifier(game, source, ctx = {}) {
        if (source === 'high-dollar' || source === 'joint-fundraising') return 0.25; // High-dollar yields cut by 75%
        if (source === 'small-dollar') {
          const base = 1.35;
          if (ctx.candidate && hasSqueakyCleanTrait(ctx.candidate)) {
            return round(base * 1.25, 3);
          }
          return base;
        }
        if (source === 'chapter') return 1.40;
        if (source === 'grassroots') return 1.35;
        if (source === 'public-match') {
          return hasSqueakyCleanTrait(ctx.candidate) ? 1.25 : 1.0; // +25% public match for Squeaky Clean candidates
        }
        return 1.0;
      },
    });
  }

  // Register all 16 Phase 2 Standard Modifier & Political Realignment Era plugins immediately
  registerPhase2EraPlugins();

  // ============================================================================
  // 8. PHASE 3 STRUCTURAL PARTY-SPAWNING & GROUP E FOLLOW-UP ERAS (8 ERAS)
  //    Eras #2, #3, #10, #17, #22, #23, #24, #25
  // ============================================================================

  function reconcileVoterModelTotals(voterModel) {
    if (!voterModel || !Array.isArray(voterModel.states)) return voterModel;
    const natSampleByParty = {};
    const natFactions = {};
    let totalSample = 0;
    let totalRepresented = 0;

    voterModel.states.forEach((st) => {
      const stAff = st.affiliations || {};
      let stSumSample = 0;
      Object.entries(stAff).forEach(([k, v]) => {
        if (k === 'thirdParty') return;
        const val = Math.max(0, Math.round(Number(v) || 0));
        stAff[k] = val;
        stSumSample += val;
        natSampleByParty[k] = (natSampleByParty[k] || 0) + val;
      });
      // Recompute thirdParty aggregate sample for backward-compatible readers
      const tpKeys = Object.keys(stAff).filter((k) => !['people', 'heritage', 'independent', 'thirdParty'].includes(k));
      stAff.thirdParty = tpKeys.reduce((acc, k) => acc + (stAff[k] || 0), 0);

      if (stSumSample > 0 && st.sampleVoters && Math.abs(stSumSample - st.sampleVoters) > 0) {
        // Keep exact state sampleVoters / representedVoters invariant via independent buffer
        const diff = st.sampleVoters - stSumSample;
        stAff.independent = Math.max(0, (stAff.independent || 0) + diff);
        natSampleByParty.independent = (natSampleByParty.independent || 0) + diff;
      }

      const _is1to1 = (voterModel.voterScale === '1:1') || (Number(voterModel.sampleVoters || 0) >= 10_000_000);
      const _scaleMult = _is1to1 ? 1 : 100;
      totalSample += Number(st.sampleVoters || stSumSample || 0);
      totalRepresented += Number(st.representedVoters || (st.sampleVoters || stSumSample || 0) * _scaleMult);

      if (st.factions && typeof st.factions === 'object') {
        Object.entries(st.factions).forEach(([fid, count]) => {
          const clean = Math.max(0, Math.round(Number(count) || 0));
          st.factions[fid] = clean;
          natFactions[fid] = (natFactions[fid] || 0) + clean;
        });
      }
    });

    voterModel.sampleVoters = totalSample;
    voterModel.representedVoters = totalRepresented;
    voterModel.representedMillions = round(totalRepresented / 1_000_000, 2);
    if (Object.keys(natFactions).length > 0) {
      voterModel.factions = natFactions;
    }

    const prevAff = voterModel.affiliations || {};
    const nextAff = { ...prevAff };
    const denom = Math.max(1, totalSample);
    const _vmScaleMult = (voterModel.voterScale === '1:1' || totalSample >= 10_000_000) ? 1 : 100;
    Object.entries(natSampleByParty).forEach(([k, sampleVal]) => {
      nextAff[k] = {
        ...(typeof prevAff[k] === 'object' ? prevAff[k] : {}),
        sampleVoters: sampleVal,
        representedVoters: sampleVal * _vmScaleMult,
        sharePercent: round((sampleVal / denom) * 100, 2),
      };
    });
    const byParty = {};
    let tpTotalSample = 0;
    Object.entries(natSampleByParty).forEach(([k, sampleVal]) => {
      if (!['people', 'heritage', 'independent'].includes(k)) {
        byParty[k] = sampleVal;
        tpTotalSample += sampleVal;
      }
    });
    nextAff.thirdParty = {
      sampleVoters: tpTotalSample,
      representedVoters: tpTotalSample * _vmScaleMult,
      sharePercent: round((tpTotalSample / denom) * 100, 2),
      byParty,
    };
    voterModel.affiliations = nextAff;
    return voterModel;
  }

  function grantFullNationwideBallotAccess(game, partyId) {
    if (!game || !partyId) return;
    const chair = getChairData();
    const states = chair.STATES || [];
    const houseDistricts = chair.VERSION_01_HOUSE_DISTRICTS || [];
    game.ballotAccess = game.ballotAccess || {};
    const senate = {};
    const governor = {};
    const leg = {};
    const house = {};
    states.forEach((st) => {
      senate[st.id] = true;
      governor[st.id] = true;
      leg[st.id] = true;
    });
    houseDistricts.forEach((d) => { house[d.id] = true; });
    game.ballotAccess[partyId] = { senate, governor, house, leg };
  }

  function grantStateBallotAccess(game, partyId, stateIds = []) {
    if (!game || !partyId) return;
    const chair = getChairData();
    const houseDistricts = chair.VERSION_01_HOUSE_DISTRICTS || [];
    game.ballotAccess = game.ballotAccess || {};
    game.ballotAccess[partyId] = game.ballotAccess[partyId] || { senate: {}, governor: {}, house: {}, leg: {} };
    const stSet = new Set(stateIds);
    stateIds.forEach((stId) => {
      game.ballotAccess[partyId].senate[stId] = true;
      game.ballotAccess[partyId].governor[stId] = true;
      game.ballotAccess[partyId].leg[stId] = true;
    });
    houseDistricts.forEach((d) => {
      if (stSet.has(d.stateId)) {
        game.ballotAccess[partyId].house[d.id] = true;
      }
    });
  }

  function buildModerateStanceMap(game) {
    const active = getActiveIssuesForGame(game);
    const map = {};
    active.forEach((iss) => { map[iss.id] = 5; });
    return map;
  }

  function isModerateSittingOfficial(member, factions = []) {
    if (!member) return false;
    if (!['senate', 'governor', 'house'].includes(member.office)) return false;
    if (member.party === 'moderate') return false;
    if (Number.isFinite(Number(member.avgStance))) {
      const s = Number(member.avgStance);
      return s >= 4.0 && s <= 6.0;
    }
    const facId = String(member.factionId || member.faction || '');
    const moderateFactionIds = new Set([
      'dem_blue_dog',
      'dem_neo_liberals',
      'gop_suburban_moderates',
      'gop_market_country_club',
      'gop_western_mavericks',
      'swg_true_centrists',
      'swg_country_club_centrists',
      'swg_technocrats',
      'swg_religious_moderates',
    ]);
    if (moderateFactionIds.has(facId)) return true;
    const facObj = (factions || []).find((f) => f.id === facId || f.name === facId);
    if (facObj?.sliders) {
      const vals = [facObj.sliders.economic, facObj.sliders.social, facObj.sliders.governance]
        .map(Number)
        .filter(Number.isFinite);
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        return avg >= 4.0 && avg <= 6.0;
      }
    }
    const wing = String(member.wing || '').toLowerCase();
    return wing.includes('moderate') || wing.includes('centrist') || wing.includes('blue dog');
  }

  function getPartyDisplayName(game, partyId) {
    if (!partyId) return '';
    const renamed = game?.partySystems?.eraState?.renamedParties || game?.partyNames || {};
    if (renamed[partyId]) return renamed[partyId];
    if (partyId === 'moderate') return 'Moderate Party';
    const psd = getPSData();
    const reg = (psd?.REGIONAL_PARTY_CATALOG || []).find((r) => r.id === partyId);
    if (reg) return reg.name;
    const psr = getPSRobots();
    if (psr?.ROBOT_PARTY_BY_ID?.[partyId]) return psr.ROBOT_PARTY_BY_ID[partyId].name;
    const postParty = (game?.partySystems?.coalitionSystem?.postBreakupParties || []).find((p) => p.id === partyId);
    if (postParty?.name) return postParty.name;
    if (game?.player && (partyId === 'player' || (!game.player.custom && game.player.baseTemplateId === partyId))) {
      return game.player.name;
    }
    const rival = (game?.rivals || []).find((r) => r.id === partyId || r.baseTemplateId === partyId);
    if (rival?.name) return rival.name;
    const arch = (getChairData().PARTY_ARCHETYPES || []).find((p) => p.id === partyId);
    if (arch?.name) return arch.name;
    const fallbacks = {
      people: 'Democratic Party',
      heritage: 'Republican Party',
      liberty: 'Libertarian Party',
      green: 'Green Party',
      constitution: 'Constitution Party',
      socialist: 'Peace and Freedom Party',
      independent: 'Independent',
    };
    return fallbacks[partyId] || partyId;
  }

  function getRegionalPartyForState(game, stateId) {
    const rp = game?.partySystems?.regionalParties;
    if (!rp || !rp.active || !Array.isArray(rp.parties)) return null;
    const absorbed = new Set(rp.absorbedPartyIds || []);
    return rp.parties.find((p) => !absorbed.has(p.id) && Array.isArray(p.homeStates) && p.homeStates.includes(stateId)) || null;
  }

  function getThermostatBlocForState(stateId) {
    const psd = getPSData();
    const blocs = psd?.PLANETARY_THERMOSTAT_BLOCS || [];
    return blocs.find((b) => Array.isArray(b.states) && b.states.includes(stateId)) || blocs[0] || null;
  }

  // Chair Party Switcher: Atomically transitions player to chair any spawned or existing national/regional party
  function switchPlayerChairParty(game, targetPartyId) {
    if (!game || !targetPartyId) return game;
    const currentId = resolvePlayerPartyKey(game);
    if (targetPartyId === currentId) return game;

    const psd = getPSData();
    const chair = getChairData();
    const regions = chair.REGIONS || ['Northeast', 'Midwest', 'South', 'West'];
    const states = chair.STATES || [];

    const rivals = Array.isArray(game.rivals) ? game.rivals.map((r) => ({ ...r })) : [];
    let targetParty = rivals.find((r) => r.id === targetPartyId || r.baseTemplateId === targetPartyId);

    // Fallback synthesis if targetParty is Moderate or Regional and not yet in rivals
    if (!targetParty && targetPartyId === 'moderate' && psd?.MODERATE_PARTY_DEF) {
      targetParty = { ...psd.MODERATE_PARTY_DEF };
    }
    if (!targetParty) {
      const regDef = (psd?.REGIONAL_PARTY_CATALOG || []).find((r) => r.id === targetPartyId);
      if (regDef) targetParty = { ...regDef };
    }
    if (!targetParty) {
      const psr = getPSRobots();
      if (psr?.ROBOT_PARTY_BY_ID?.[targetPartyId]) {
        targetParty = { ...psr.ROBOT_PARTY_BY_ID[targetPartyId] };
      }
    }
    if (!targetParty) {
      const arch = (chair.PARTY_ARCHETYPES || []).find((p) => p.id === targetPartyId);
      if (arch) targetParty = { ...arch };
    }
    if (!targetParty) return game;

    const prevPlayer = { ...game.player };
    const outgoingId = prevPlayer.custom ? 'player_prev' : (prevPlayer.baseTemplateId || 'people');

    // Archive outgoing player organization & issue positions
    const nextOrgs = JSON.parse(JSON.stringify(game.organizations || {}));
    nextOrgs[outgoingId] = {
      ...(nextOrgs[outgoingId] || {}),
      treasury: Number(game.treasury || 25),
      memberships: Number(game.memberships || 60),
      chapters: { ...(game.chapters || Object.fromEntries(regions.map((r) => [r, 2]))) },
      leaders: Array.isArray(game.roster) ? [...game.roster] : [],
      factionStandings: { ...(game.factionStandings || {}) },
    };

    const nextPartyIssues = { ...(game.partyIssuePositions || {}) };
    nextPartyIssues[outgoingId] = { ...(game.issuePositions || {}) };

    // Build outgoing rival record
    const outgoingRival = {
      id: outgoingId,
      baseTemplateId: outgoingId,
      name: getPartyDisplayName(game, outgoingId) || prevPlayer.name,
      color: prevPlayer.color,
      economic: prevPlayer.economic,
      social: prevPlayer.social,
      climate: prevPlayer.climate,
      local: prevPlayer.local,
      baseShare: prevPlayer.baseShare ?? 20,
      trust: game.trust || prevPlayer.trust || { supporters: 65, independents: 50, opponents: 25 },
      issuePositions: { ...(game.issuePositions || {}) },
      isRegional: Boolean(prevPlayer.isRegional),
      homeStates: prevPlayer.homeStates ? [...prevPlayer.homeStates] : undefined,
      regionLabel: prevPlayer.regionLabel,
      isRobotParty: Boolean(prevPlayer.isRobotParty),
      themeSlug: prevPlayer.themeSlug,
      isCoalitionEraParty: Boolean(prevPlayer.isCoalitionEraParty),
      factionIds: Array.isArray(prevPlayer.factionIds) ? [...prevPlayer.factionIds] : undefined,
    };

    const nextRivals = rivals.filter((r) => r.id !== targetPartyId && r.baseTemplateId !== targetPartyId);
    if (!nextRivals.some((r) => r.id === outgoingId)) {
      nextRivals.push(outgoingRival);
    }

    // Hydrate incoming party into game.player
    const incomingOrg = nextOrgs[targetPartyId] || {
      treasury: targetParty.isMajor ? 95 : 28,
      memberships: targetParty.isMajor ? 180 : 65,
      chapters: Object.fromEntries(regions.map((r) => [r, targetParty.isMajor ? 12 : 4])),
      leaders: [],
      factionStandings: {},
    };
    const displayName = getPartyDisplayName(game, targetPartyId) || targetParty.name;
    const nextPlayer = {
      ...targetParty,
      id: 'player',
      baseTemplateId: targetPartyId,
      name: displayName,
      custom: false,
      trust: game.rivalTrust?.[targetPartyId] || targetParty.trust || { supporters: 72, independents: 56, opponents: 30 },
    };

    // Hydrate incoming issue positions (ensuring all 41 active issues have values)
    const incomingPositions = { ...(nextPartyIssues[targetPartyId] || targetParty.issuePositions || buildModerateStanceMap(game)) };
    getActiveIssuesForGame(game).forEach((iss) => {
      if (incomingPositions[iss.id] === undefined) {
        incomingPositions[iss.id] = clamp(Math.round(5.5 + (Number(targetParty.economic || 0) * 3.5)), 1, 10);
      }
    });

    // Hydrate state chapters for incoming party
    const nextStateChapters = {};
    states.forEach((st) => {
      const orgCh = game.stateOrganizations?.[st.id]?.[targetPartyId]?.chapters;
      if (Number.isFinite(Number(orgCh))) {
        nextStateChapters[st.id] = Number(orgCh);
      } else if (targetParty.isRegional) {
        nextStateChapters[st.id] = (targetParty.homeStates || []).includes(st.id) ? 14 : 0;
      } else {
        nextStateChapters[st.id] = Math.max(1, Math.round((incomingOrg.chapters?.[st.region] || 4) / 3));
      }
    });

    // Resize focus slots according to target party's institutional tier
    const tier = Number(game.partyTiers?.[targetPartyId] ?? (targetParty.isMajor ? 5 : 4));
    const maxSlots = tier >= 5 ? 7 : tier >= 3 ? 5 : 3;
    const prevAdditional = Array.isArray(game.priorities?.additional) ? game.priorities.additional : [];
    const nextAdditional = prevAdditional.slice(0, maxSlots).concat(
      Array.from({ length: Math.max(0, maxSlots - prevAdditional.length) }, () => ({ type: 'issue', targetId: '' }))
    );

    const note = `HISTORIC CHAIR TRANSITION: You stepped down from ${outgoingRival.name} and assumed leadership as National Chair of ${displayName}!`;
    const nextGame = {
      ...game,
      player: nextPlayer,
      rivals: nextRivals,
      organizations: nextOrgs,
      partyIssuePositions: nextPartyIssues,
      issuePositions: incomingPositions,
      treasury: round(Number(incomingOrg.treasury ?? (targetParty.isMajor ? 95 : 28)), 1),
      memberships: Math.max(15, Math.round(Number(incomingOrg.memberships ?? 80))),
      chapters: { ...(incomingOrg.chapters || Object.fromEntries(regions.map((r) => [r, 4]))) },
      stateChapters: nextStateChapters,
      trust: nextPlayer.trust,
      priorities: {
        main: Array.isArray(game.priorities?.main) ? [...game.priorities.main] : [],
        additional: nextAdditional,
      },
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };

    // Update moderateParty / robotCitizenship / coalitionSystem / eraState chair tracking if applicable
    if (nextGame.partySystems) {
      const psrSw = getPSRobots();
      nextGame.partySystems = {
        ...nextGame.partySystems,
        moderateParty: nextGame.partySystems.moderateParty
          ? { ...nextGame.partySystems.moderateParty, playerDefected: targetPartyId === 'moderate' }
          : nextGame.partySystems.moderateParty,
        robotCitizenship: nextGame.partySystems.robotCitizenship
          ? { ...nextGame.partySystems.robotCitizenship, playerSwitchedToRobot: Boolean(psrSw?.isRobotParty(targetPartyId)) }
          : nextGame.partySystems.robotCitizenship,
        coalitionSystem: nextGame.partySystems.coalitionSystem
          ? { ...nextGame.partySystems.coalitionSystem, partySelectionCompleted: true }
          : nextGame.partySystems.coalitionSystem,
        eraState: {
          ...(nextGame.partySystems.eraState || {}),
          lastChairSwitch: { from: outgoingId, to: targetPartyId, year: game.year || 2028 },
          robotChairChoiceCompleted: nextGame.partySystems.currentEraId === 'era_16_robots_citizens'
            ? true
            : nextGame.partySystems.eraState?.robotChairChoiceCompleted,
        },
      };
    }

    if (typeof window !== 'undefined' && window.PartyChairEngine?.syncPartyStateWithLegacy) {
      window.PartyChairEngine.syncPartyStateWithLegacy(nextGame);
    }

    return nextGame;
  }

  // Era #22: Neo-Federalist Reunion — Cross-Regional Merger Action
  function absorbRegionalParty(game, regionalPartyId, options = {}) {
    if (!game || !regionalPartyId) return game;
    const eraId = game.partySystems?.currentEraId;
    if (eraId !== 'era_22_neo_federalist' && !options.force) {
      return { ...game, lastNote: 'Cross-regional party mergers are only available during the Neo-Federalist Reunion.' };
    }
    const playerKey = resolvePlayerPartyKey(game);
    if (String(playerKey).startsWith('reg_')) {
      return { ...game, lastNote: 'Only national political parties can initiate a Neo-Federalist cross-regional merger.' };
    }
    const rpState = game.partySystems?.regionalParties;
    if (!rpState || !Array.isArray(rpState.parties)) {
      return { ...game, lastNote: 'No regional party machines are currently active to absorb.' };
    }
    const absorbed = new Set(rpState.absorbedPartyIds || []);
    if (absorbed.has(regionalPartyId)) {
      return { ...game, lastNote: 'That regional party has already been absorbed into a national coalition.' };
    }
    const regDef = rpState.parties.find((p) => p.id === regionalPartyId);
    if (!regDef) {
      return { ...game, lastNote: 'Target regional party not found.' };
    }

    const cost = options.free ? 0 : 6.0;
    if (!options.free && ((game.actionsLeft || 0) <= 0 || Number(game.treasury || 0) < cost)) {
      return { ...game, lastNote: `Cross-regional merger with ${regDef.name} requires 1 Leadership Action and $${cost}M treasury.` };
    }

    const working = JSON.parse(JSON.stringify(game));
    working.treasury = round(Number(working.treasury || 0) - cost, 1);
    if (!options.free) {
      working.actionsLeft = Math.max(0, Number(working.actionsLeft || 1) - 1);
    }

    // 1. Mark regional party absorbed and remove from rivals
    const nextAbsorbed = [...new Set([...(working.partySystems.regionalParties.absorbedPartyIds || []), regionalPartyId])];
    working.partySystems.regionalParties.absorbedPartyIds = nextAbsorbed;
    working.partySystems.eraState = {
      ...(working.partySystems.eraState || {}),
      absorbedRegionalParties: nextAbsorbed,
    };
    working.rivals = (working.rivals || []).filter((r) => r.id !== regionalPartyId && r.baseTemplateId !== regionalPartyId);

    // 2. Transfer home-state chapters, ballot access, sitting members, and regional factions to player party
    const homeStates = Array.isArray(regDef.homeStates) ? regDef.homeStates : [];
    grantStateBallotAccess(working, playerKey, homeStates);

    working.stateOrganizations = working.stateOrganizations || {};
    working.stateChapters = working.stateChapters || {};
    homeStates.forEach((stId) => {
      working.stateOrganizations[stId] ||= {};
      const regChapters = Number(working.stateOrganizations[stId][regionalPartyId]?.chapters || 8);
      const prevPlayerCh = Number(working.stateChapters[stId] ?? working.stateOrganizations[stId][playerKey]?.chapters ?? 2);
      const mergedCh = prevPlayerCh + regChapters;
      working.stateChapters[stId] = mergedCh;
      working.stateOrganizations[stId][playerKey] = {
        ...(working.stateOrganizations[stId][playerKey] || { strength: 45 }),
        chapters: mergedCh,
        strength: Math.min(100, (working.stateOrganizations[stId][playerKey]?.strength || 45) + 18),
      };
      delete working.stateOrganizations[stId][regionalPartyId];
    });

    // Reassign regional party's factions and sitting lawmakers to player party
    let membersAbsorbed = 0;
    if (Array.isArray(working.factions)) {
      working.factions.forEach((f) => {
        if (f.partyId === regionalPartyId) {
          f.partyId = playerKey;
          f.happiness = clamp(Number(f.happiness || 70) + 4, 0, 100);
        }
      });
    }
    if (Array.isArray(working.sittingMembers)) {
      working.sittingMembers.forEach((m) => {
        if (m.party === regionalPartyId || m.partyId === regionalPartyId) {
          m.party = playerKey;
          m.partyId = playerKey;
          m.caucus = playerKey;
          membersAbsorbed += 1;
        }
      });
    }

    // 3. Transfer regional voters in voterModel to player party across home states (preserving exact 155M totals)
    let votersMerged = 0;
    if (working.voterModel && Array.isArray(working.voterModel.states)) {
      working.voterModel.states.forEach((st) => {
        const stId = st.stateId || st.id;
        if (!homeStates.includes(stId) || !st.affiliations) return;
        const regSample = Number(st.affiliations[regionalPartyId] || 0);
        if (regSample > 0) {
          st.affiliations[playerKey] = (st.affiliations[playerKey] || 0) + regSample;
          st.affiliations[regionalPartyId] = 0;
          const _mScale = (working.voterModel?.voterScale === '1:1' || Number(working.voterModel?.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
          votersMerged += regSample * _mScale;
        }
      });
      reconcileVoterModelTotals(working.voterModel);
    }

    working.memberships = Math.round(Number(working.memberships || 60) + 18);
    const note = `NEO-FEDERALIST MERGER: Absorbed ${regDef.name} (${regDef.regionLabel}) across ${homeStates.join(', ')} — unifying ${votersMerged.toLocaleString()} regional voters, local chapters, and ${membersAbsorbed} sitting officials into ${working.player?.name || 'your party'}!`;
    working.lastNote = note;
    working.yearLog = [...(working.yearLog || []), { year: working.year, turn: (working.chairTurn || 0) + 1, action: note }].slice(-80);
    return working;
  }

  function resolveEraDecision(game, decisionId) {
    if (!game || !decisionId) return game;
    const plugin = getActiveEraPlugin(game);
    let updated = game;
    if (plugin && typeof plugin.resolveDecision === 'function') {
      const res = plugin.resolveDecision(game, decisionId);
      if (res && typeof res === 'object') {
        updated = res;
      }
    }
    const ps = updated.partySystems || createInitialPartySystemsState(updated);
    return {
      ...updated,
      partySystems: {
        ...ps,
        pendingModal: null,
        modalPayload: null,
        coalitionSystem: ps.coalitionSystem && ps.currentEraId === 'era_18_party_coalition'
          ? { ...ps.coalitionSystem, partySelectionCompleted: true }
          : ps.coalitionSystem,
        eraState: {
          ...(ps.eraState || {}),
          robotChairChoiceCompleted: ps.currentEraId === 'era_16_robots_citizens'
            ? true
            : ps.eraState?.robotChairChoiceCompleted,
          lastDecision: { eraId: ps.currentEraId, decisionId, year: updated.year || 2028 },
        },
      },
    };
  }

  function registerPhase3EraPlugins() {
    // ------------------------------------------------------------------
    // ERA #2: The Moderate Party (Group A · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_02_moderate_party',
      onEraEnter(game) {
        const psd = getPSData();
        const chair = getChairData();
        const es = ensureEraState(game);
        const modDef = psd?.MODERATE_PARTY_DEF || {
          id: 'moderate',
          baseTemplateId: 'moderate',
          name: 'Moderate Party',
          shortName: 'Moderate',
          color: '#5C9E7A',
          economic: 0,
          social: 0,
          climate: 0.08,
          local: 0.12,
          baseShare: 24,
          isMajor: true,
          isSpawned: true,
        };
        const modFactions = (psd?.MODERATE_PARTY_FACTIONS || []).map((f) => ({ ...f, keyIssues: [...(f.keyIssues || [])] }));

        // 1. Spawn Moderate Party into game.rivals & organizations with Tier 5 Major Party standing
        game.rivals = Array.isArray(game.rivals) ? [...game.rivals] : [];
        if (!game.rivals.some((r) => r.id === 'moderate') && resolvePlayerPartyKey(game) !== 'moderate') {
          game.rivals.push({
            ...modDef,
            trust: { supporters: 76, independents: 68, opponents: 42 },
            issuePositions: buildModerateStanceMap(game),
          });
        }
        game.partyTiers = { ...(game.partyTiers || {}), moderate: 5 };
        game.partyNames = { ...(game.partyNames || {}), moderate: 'Moderate Party' };
        grantFullNationwideBallotAccess(game, 'moderate');

        const regions = chair.REGIONS || ['Northeast', 'Midwest', 'South', 'West'];
        game.organizations = game.organizations || {};
        game.organizations.moderate = {
          treasury: 110,
          memberships: 220,
          chapters: Object.fromEntries(regions.map((r) => [r, 18])),
          leaders: [],
          factionStandings: Object.fromEntries(modFactions.map((f) => [f.id, f.happiness || 70])),
        };
        game.partyIssuePositions = { ...(game.partyIssuePositions || {}), moderate: buildModerateStanceMap(game) };

        // 2. Spawn 4 dedicated Moderate Party factions
        game.factions = Array.isArray(game.factions) ? [...game.factions] : [];
        game.factionHappiness = { ...(game.factionHappiness || {}) };
        game.factionStandings = { ...(game.factionStandings || {}) };
        game.factionConfidence = { ...(game.factionConfidence || {}) };
        modFactions.forEach((mf) => {
          if (!game.factions.some((f) => f.id === mf.id)) {
            game.factions.push(mf);
          }
          game.factionHappiness[mf.id] = mf.happiness ?? 70;
          game.factionStandings[mf.id] = mf.happiness ?? 70;
          game.factionConfidence[mf.id] = mf.confidence ?? 58;
        });

        // 3. Reallocate moderate voters across all 51 states in voterModel (preserving exact 155M scale)
        if (game.voterModel && Array.isArray(game.voterModel.states)) {
          const weights = [0.30, 0.28, 0.23, 0.19]; // mod_former_dems, mod_former_reps, mod_pragmatic_populists, mod_rhetorical_moderates
          game.voterModel.states.forEach((st) => {
            if (!st.affiliations) return;
            const demDraw = Math.round((st.affiliations.people || 0) * 0.22);
            const repDraw = Math.round((st.affiliations.heritage || 0) * 0.22);
            const indDraw = Math.round((st.affiliations.independent || 0) * 0.18);
            st.affiliations.people = Math.max(10, (st.affiliations.people || 0) - demDraw);
            st.affiliations.heritage = Math.max(10, (st.affiliations.heritage || 0) - repDraw);
            st.affiliations.independent = Math.max(10, (st.affiliations.independent || 0) - indDraw);
            const modGainSample = demDraw + repDraw + indDraw;
            st.affiliations.moderate = (st.affiliations.moderate || 0) + modGainSample;

            // Mirror voter transfer into st.factions (0 variance)
            if (st.factions && typeof st.factions === 'object') {
              const _modScale = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
              const totalGainVoters = modGainSample * _modScale;
              const existingFids = Object.keys(st.factions).filter((fid) => !fid.startsWith('mod_') && (st.factions[fid] || 0) > 0);
              const existingSum = existingFids.reduce((acc, fid) => acc + (st.factions[fid] || 0), 0);
              let actualPulled = 0;
              if (existingSum > 0) {
                existingFids.forEach((fid) => {
                  const pull = Math.min(st.factions[fid], Math.round(totalGainVoters * (st.factions[fid] / existingSum)));
                  st.factions[fid] -= pull;
                  actualPulled += pull;
                });
              }
              let assigned = 0;
              modFactions.forEach((mf, idx) => {
                const share = idx === modFactions.length - 1
                  ? Math.max(0, actualPulled - assigned)
                  : Math.round(actualPulled * (weights[idx] || 0.25));
                st.factions[mf.id] = (st.factions[mf.id] || 0) + share;
                assigned += share;
              });
            }
          });
          reconcileVoterModelTotals(game.voterModel);
        }

        // 4. Mass defection of sitting moderate Senators, Governors, and Representatives (stance 4.0-6.0)
        const defectedIds = [];
        const defectedNames = [];
        if (Array.isArray(game.sittingMembers)) {
          game.sittingMembers = game.sittingMembers.map((m) => {
            if (!isModerateSittingOfficial(m, game.factions)) return m;
            const prevParty = m.party || m.partyId || 'independent';
            const nextFactionId = prevParty === 'people'
              ? 'mod_former_dems'
              : prevParty === 'heritage'
                ? 'mod_former_reps'
                : (fnvHash(`mod-fac:${m.id || m.name}`) < 0.5 ? 'mod_pragmatic_populists' : 'mod_rhetorical_moderates');
            defectedIds.push(m.id);
            if (m.name) defectedNames.push(m.name);
            return {
              ...m,
              previousParty: prevParty,
              party: 'moderate',
              partyId: 'moderate',
              caucus: 'moderate',
              rawParty: 'M',
              isIndependent: false,
              factionId: nextFactionId,
              faction: nextFactionId,
              hasSwitchedThisCycle: true,
            };
          });
        }
        // Keep governorships map in sync with defected moderate Governors
        if (game.governorships && Array.isArray(game.sittingMembers)) {
          game.sittingMembers.forEach((m) => {
            if (m.office === 'governor' && m.party === 'moderate' && m.stateId) {
              game.governorships[m.stateId] = 'moderate';
            }
          });
        }

        game.partySystems.moderateParty = {
          active: true,
          spawnedYear: Number(game.year || 2040),
          color: '#5C9E7A',
          defectedCount: defectedIds.length,
          defectedIds,
          defectedSampleNames: defectedNames.slice(0, 8),
          playerDefected: false,
        };
        es.moderatePartySpawned = true;
        es.moderateDefectionCount = defectedIds.length;
      },
      getDecisionModal(game) {
        const modInfo = game?.partySystems?.moderateParty || {};
        const count = Number(modInfo.defectedCount || 0);
        const curName = game?.player?.name || 'Your Current Party';
        return {
          title: 'The Moderate Revolt: Choose Your Command',
          description: `${count > 0 ? `${count} sitting Senators, Governors, and Representatives have crossed the aisle` : 'Moderate lawmakers across Congress have crossed the aisle'} to found the new Moderate Party. Will you bolt to chair the centrist coalition or hold the line at ${curName}?`,
          options: [
            {
              id: 'chair_moderate_party',
              label: 'Defect & Chair the Moderate Party',
              summary: 'Take command of the newly forged centrist coalition with four dedicated moderate factions, nationwide ballot access, and defected lawmakers.',
            },
            {
              id: 'stay_current_party',
              label: `Remain Chair of ${curName}`,
              summary: 'Defend your existing party apparatus and adapt your platform to fight a high-stakes three-party general election.',
            },
          ],
        };
      },
      resolveDecision(game, decisionId) {
        if (decisionId === 'chair_moderate_party') {
          return switchPlayerChairParty(game, 'moderate');
        }
        return game;
      },
    });

    // ------------------------------------------------------------------
    // ERA #3: The 6-Party System (Group B · Weight = 3)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_03_six_party_system',
      onEraEnter(game) {
        const psd = getPSData();
        const es = ensureEraState(game);
        const targetShares = psd?.SIX_PARTY_SYSTEM_SHARES || {
          people: 10, heritage: 10, liberty: 20, green: 20, socialist: 20, constitution: 20,
        };
        const sixIds = Object.keys(targetShares);

        // 1. Formally rename Constitution Party -> MAGA Party everywhere
        es.renamedParties = { ...(es.renamedParties || {}), constitution: 'MAGA Party' };
        game.partyNames = { ...(game.partyNames || {}), constitution: 'MAGA Party' };
        if (game.player && !game.player.custom && game.player.baseTemplateId === 'constitution') {
          game.player = { ...game.player, name: 'MAGA Party' };
        }
        if (Array.isArray(game.rivals)) {
          game.rivals = game.rivals.map((r) => (
            r.id === 'constitution' || r.baseTemplateId === 'constitution'
              ? { ...r, name: 'MAGA Party' }
              : r
          ));
        }

        // 2. Ensure all 6 parties exist, hold Tier 5 Major status, nationwide ballot access, and fractured baseShare
        game.partyTiers = { ...(game.partyTiers || {}) };
        sixIds.forEach((pid) => {
          game.partyTiers[pid] = 5;
          grantFullNationwideBallotAccess(game, pid);
        });
        const playerKey = resolvePlayerPartyKey(game);
        if (targetShares[playerKey] !== undefined && game.player) {
          game.player = { ...game.player, baseShare: targetShares[playerKey] };
        }
        if (Array.isArray(game.rivals)) {
          game.rivals = game.rivals.map((r) => (
            targetShares[r.id] !== undefined ? { ...r, baseShare: targetShares[r.id] } : r
          ));
        }

        // 3. Permanently fracture the 155M-scale electorate across the 6 parties in voterModel
        if (game.voterModel && Array.isArray(game.voterModel.states)) {
          game.voterModel.states.forEach((st) => {
            if (!st.affiliations) return;
            const stSample = Number(st.sampleVoters || 0);
            const indSample = Math.round(Number(st.affiliations.independent || stSample * 0.25));
            const partisanPool = Math.max(60, stSample - indSample);
            let distributed = 0;
            sixIds.forEach((pid, idx) => {
              const frac = targetShares[pid] / 100;
              const alloc = idx === sixIds.length - 1
                ? Math.max(10, partisanPool - distributed)
                : Math.max(10, Math.round(partisanPool * frac));
              st.affiliations[pid] = alloc;
              distributed += alloc;
            });
            st.affiliations.other = 0;
            st.affiliations.independent = Math.max(0, stSample - distributed);
          });
          reconcileVoterModelTotals(game.voterModel);
        }

        es.sixPartySystemActive = true;
        es.coalitionMajorityRequired = true;
        es.sixPartyShares = { ...targetShares };
        es.chairSwitcherParties = sixIds;
      },
      getDecisionModal(game) {
        const sixMeta = [
          { id: 'people', label: 'Democratic Party', summary: 'Lead the streamlined center-left institutional caucus navigating six-party coalition deals.' },
          { id: 'heritage', label: 'Republican Party', summary: 'Lead the traditional center-right conservative caucus competing in a fractured landscape.' },
          { id: 'liberty', label: 'Libertarian Party', summary: 'Command a surging free-market civil-libertarian bloc holding pivotal swing leverage.' },
          { id: 'green', label: 'Green Party', summary: 'Chair a major ecological-democratic coalition contending for executive and floor leadership.' },
          { id: 'socialist', label: 'Peace and Freedom Party', summary: 'Lead the mass labor-socialist movement across industrial and urban strongholds.' },
          { id: 'constitution', label: 'MAGA Party', summary: 'Command the newly rebranded populist-nationalist MAGA Party across heartland coalitions.' },
        ];
        return {
          title: 'The 6-Party Republic: Choose Your National Committee',
          description: 'The old two-party duopoly has permanently fractured into six roughly matched national parties, with the former Constitution Party rebranding as the MAGA Party. Select which of the six parties you will chair—or switch committees anytime from Party Info.',
          options: sixMeta.map((p) => ({
            id: `switch_party:${p.id}`,
            label: `Chair the ${p.label}`,
            summary: p.summary,
          })),
        };
      },
      resolveDecision(game, decisionId) {
        if (String(decisionId).startsWith('switch_party:')) {
          const targetId = String(decisionId).split(':')[1];
          return switchPlayerChairParty(game, targetId);
        }
        return game;
      },
      getStrategicDefectionModifier() {
        return 0; // In an entrenched 6-party system, voters no longer suffer two-party wasted-vote defection
      },
    });

    // ------------------------------------------------------------------
    // ERA #10: Regional Parties Emerge (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_10_regional_parties',
      onEraEnter(game) {
        const psd = getPSData();
        const chair = getChairData();
        const es = ensureEraState(game);
        const regCatalog = (psd?.REGIONAL_PARTY_CATALOG || []).map((r) => ({ ...r, homeStates: [...r.homeStates] }));
        const regions = chair.REGIONS || ['Northeast', 'Midwest', 'South', 'West'];

        game.rivals = Array.isArray(game.rivals) ? [...game.rivals] : [];
        game.factions = Array.isArray(game.factions) ? [...game.factions] : [];
        game.organizations = game.organizations || {};
        game.stateOrganizations = game.stateOrganizations || {};
        game.partyTiers = { ...(game.partyTiers || {}) };
        game.partyNames = { ...(game.partyNames || {}) };
        game.factionHappiness = { ...(game.factionHappiness || {}) };
        game.factionStandings = { ...(game.factionStandings || {}) };
        game.factionConfidence = { ...(game.factionConfidence || {}) };
        game.partyIssuePositions = { ...(game.partyIssuePositions || {}) };

        const territoryMap = {};

        regCatalog.forEach((reg) => {
          // Register party in rivals, organizations, partyTiers (Tier 4), ballotAccess (homeStates)
          if (!game.rivals.some((r) => r.id === reg.id) && resolvePlayerPartyKey(game) !== reg.id) {
            game.rivals.push({
              id: reg.id,
              baseTemplateId: reg.id,
              name: reg.name,
              shortName: reg.shortName,
              color: reg.color,
              economic: reg.economic,
              social: reg.social,
              climate: reg.climate,
              local: reg.local,
              baseShare: reg.baseShare,
              isRegional: true,
              isSpawned: true,
              regionLabel: reg.regionLabel,
              homeRegion: reg.homeRegion,
              homeStates: [...reg.homeStates],
              trust: { supporters: 80, independents: 64, opponents: 30 },
            });
          }
          game.partyTiers[reg.id] = 4;
          game.partyNames[reg.id] = reg.name;
          grantStateBallotAccess(game, reg.id, reg.homeStates);

          game.organizations[reg.id] = {
            treasury: 55,
            memberships: 115,
            chapters: Object.fromEntries(regions.map((r) => [r, r === reg.homeRegion ? 24 : 0])),
            leaders: [],
            factionStandings: reg.faction ? { [reg.faction.id]: reg.faction.happiness || 75 } : {},
          };

          reg.homeStates.forEach((stId) => {
            territoryMap[stId] = reg.id;
            game.stateOrganizations[stId] ||= {};
            game.stateOrganizations[stId][reg.id] = { chapters: 14, strength: 84 };
          });

          if (reg.faction && !game.factions.some((f) => f.id === reg.faction.id)) {
            const fClone = { ...reg.faction, keyIssues: [...(reg.faction.keyIssues || [])] };
            game.factions.push(fClone);
            game.factionHappiness[fClone.id] = fClone.happiness ?? 75;
            game.factionStandings[fClone.id] = fClone.happiness ?? 75;
            game.factionConfidence[fClone.id] = fClone.confidence ?? 66;
          }
        });

        // Shift territorial voters in home states into their regional party (strict 155M scale invariant)
        if (game.voterModel && Array.isArray(game.voterModel.states)) {
          game.voterModel.states.forEach((st) => {
            const stId = st.stateId || st.id;
            const regId = territoryMap[stId];
            if (!regId || !st.affiliations) return;
            const demDraw = Math.round((st.affiliations.people || 0) * 0.32);
            const repDraw = Math.round((st.affiliations.heritage || 0) * 0.32);
            const indDraw = Math.round((st.affiliations.independent || 0) * 0.28);
            st.affiliations.people = Math.max(10, (st.affiliations.people || 0) - demDraw);
            st.affiliations.heritage = Math.max(10, (st.affiliations.heritage || 0) - repDraw);
            st.affiliations.independent = Math.max(10, (st.affiliations.independent || 0) - indDraw);
            const regSampleGain = demDraw + repDraw + indDraw;
            st.affiliations[regId] = (st.affiliations[regId] || 0) + regSampleGain;

            const regDef = regCatalog.find((r) => r.id === regId);
            if (regDef?.faction && st.factions && typeof st.factions === 'object') {
              const _regScale = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
              const pullTotal = regSampleGain * _regScale;
              const existingFids = Object.keys(st.factions).filter((fid) => !fid.startsWith('reg_fac_') && (st.factions[fid] || 0) > 0);
              const existingSum = existingFids.reduce((acc, fid) => acc + (st.factions[fid] || 0), 0);
              let pulled = 0;
              if (existingSum > 0) {
                existingFids.forEach((fid) => {
                  const p = Math.min(st.factions[fid], Math.round(pullTotal * (st.factions[fid] / existingSum)));
                  st.factions[fid] -= p;
                  pulled += p;
                });
              }
              st.factions[regDef.faction.id] = (st.factions[regDef.faction.id] || 0) + pulled;
            }
          });
          reconcileVoterModelTotals(game.voterModel);
        }

        game.partySystems.regionalParties = {
          active: true,
          spawnedYear: Number(game.year || 2040),
          parties: regCatalog.map((r) => ({
            id: r.id,
            name: r.name,
            shortName: r.shortName,
            regionLabel: r.regionLabel,
            homeRegion: r.homeRegion,
            homeStates: [...r.homeStates],
            color: r.color,
            platformSummary: r.platformSummary,
          })),
          absorbedPartyIds: [],
          territoryMap,
        };
        es.regionalPartiesActive = true;
        es.regionalPartyCount = regCatalog.length;
      },
      getRegionalPartySupportBonus(game, partyId, stateId) {
        if (!stateId || stateId === 'US') return 0;
        const rp = game?.partySystems?.regionalParties;
        if (!rp || !Array.isArray(rp.parties)) return 0;
        const absorbed = new Set(rp.absorbedPartyIds || []);
        const regSelf = rp.parties.find((p) => p.id === partyId);
        if (regSelf) {
          if (absorbed.has(regSelf.id)) return -40;
          return (regSelf.homeStates || []).includes(stateId) ? 26.0 : -12.0;
        }
        // National party operating in an active regional party's home territory suffers local erosion
        const localDominant = rp.parties.find((p) => !absorbed.has(p.id) && (p.homeStates || []).includes(stateId));
        return localDominant ? -8.0 : 0;
      },
      getStrategicDefectionModifier(game, partyId, stateId) {
        const rp = game?.partySystems?.regionalParties;
        if (rp && stateId) {
          const reg = (rp.parties || []).find((p) => p.id === partyId && (p.homeStates || []).includes(stateId));
          if (reg) return 0; // Regional parties dominate their home territories with zero wasted-vote drag
        }
        return 1.0;
      },
      getDecisionModal(game) {
        const regList = game?.partySystems?.regionalParties?.parties || getPSData()?.REGIONAL_PARTY_CATALOG || [];
        const curName = game?.player?.name || 'Your National Party';
        return {
          title: 'Regional Parties Emerge: Defend the Union or Lead a Territory',
          description: 'Six fiercely rooted territorial parties have claimed dominance across Appalachia, New England, the Deep South, the Rockies, California, and Texas. Remain at the helm of your national committee or take command of a regional powerhouse.',
          options: [
            {
              id: 'stay_current_party',
              label: `Stay with ${curName}`,
              summary: 'Weather regional fragmentation as a national committee and rebuild cross-country coalitions.',
            },
            ...regList.map((r) => ({
              id: `switch_party:${r.id}`,
              label: `Chair ${r.name} (${r.regionLabel})`,
              summary: r.platformSummary || `Dominate home states (${(r.homeStates || []).join(', ')}) as a regional powerhouse.`,
            })),
          ],
        };
      },
      resolveDecision(game, decisionId) {
        if (String(decisionId).startsWith('switch_party:')) {
          return switchPlayerChairParty(game, String(decisionId).split(':')[1]);
        }
        return game;
      },
    });

    // ------------------------------------------------------------------
    // ERA #17: Ecological Collapse (Group D · Weight = 1)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_17_ecological_collapse',
      onEraEnter(game) {
        const psd = getPSData();
        const es = ensureEraState(game);
        const ecoFactions = (psd?.ECOLOGICAL_COLLAPSE_GREEN_FACTIONS || []).map((f) => ({ ...f, keyIssues: [...(f.keyIssues || [])] }));

        // 1. Grant Green Party +25.0% baseline national polling lift, Tier 5 status, and 100% nationwide ballot access
        es.ecologicalCollapseActive = true;
        es.greenBaselineBoost = 25.0;
        es.greenZeroCostChapters = true;
        es.greenSmallDollarMultiplier = 3.0;

        game.partyTiers = { ...(game.partyTiers || {}), green: 5 };
        grantFullNationwideBallotAccess(game, 'green');

        if (game.player && !game.player.custom && game.player.baseTemplateId === 'green') {
          game.player = { ...game.player, baseShare: round(Number(game.player.baseShare || 2) + 25.0, 2) };
        }
        if (Array.isArray(game.rivals)) {
          game.rivals = game.rivals.map((r) => (
            r.id === 'green' || r.baseTemplateId === 'green'
              ? { ...r, baseShare: round(Number(r.baseShare || 2) + 25.0, 2) }
              : r
          ));
        }

        // 2. Replace legacy Green factions with the 4 dedicated ecological factions
        const legacyGreenIds = new Set(
          (game.factions || []).filter((f) => f.partyId === 'green').map((f) => f.id)
        );
        legacyGreenIds.add('grn_eco_socialist_vanguard');
        legacyGreenIds.add('grn_yimby');

        game.factions = [
          ...(game.factions || []).filter((f) => f.partyId !== 'green' && !legacyGreenIds.has(f.id)),
          ...ecoFactions,
        ];

        game.factionHappiness = { ...(game.factionHappiness || {}) };
        game.factionStandings = { ...(game.factionStandings || {}) };
        game.factionConfidence = { ...(game.factionConfidence || {}) };
        ecoFactions.forEach((ef) => {
          game.factionHappiness[ef.id] = ef.happiness ?? 72;
          game.factionStandings[ef.id] = ef.happiness ?? 72;
          game.factionConfidence[ef.id] = ef.confidence ?? 64;
        });

        // Remap Green politicians & sitting officials onto the 4 new ecological factions
        const ecoIds = ecoFactions.map((f) => f.id);
        const remapList = (list) => (Array.isArray(list) ? list.map((p) => {
          if (p.party === 'green' || p.partyId === 'green' || legacyGreenIds.has(p.factionId)) {
            const pick = ecoIds[Math.floor(fnvHash(`eco-remap:${p.id || p.name}`) * ecoIds.length) % ecoIds.length];
            return { ...p, factionId: pick, faction: pick };
          }
          return p;
        }) : list);
        if (Array.isArray(game.sittingMembers)) game.sittingMembers = remapList(game.sittingMembers);
        if (Array.isArray(game.politicians)) game.politicians = remapList(game.politicians);

        // 3. Apply +25% voter registration surge for Green across all 51 states & redistribute into 4 eco factions (0 variance on 155M scale)
        if (game.voterModel && Array.isArray(game.voterModel.states)) {
          const ecoWeights = [0.30, 0.18, 0.27, 0.25];
          game.voterModel.states.forEach((st) => {
            if (!st.affiliations) return;
            const stSample = Number(st.sampleVoters || 0);
            const targetAdd = Math.round(stSample * 0.25);
            const donorKeys = ['people', 'heritage', 'independent', 'liberty', 'other'].filter((k) => (st.affiliations[k] || 0) > 10);
            const donorPool = donorKeys.reduce((acc, k) => acc + Math.max(0, (st.affiliations[k] || 0) - 10), 0);
            let actualShift = 0;
            if (donorPool > 0) {
              const scale = Math.min(1.0, targetAdd / donorPool);
              donorKeys.forEach((k) => {
                const avail = Math.max(0, (st.affiliations[k] || 0) - 10);
                const take = Math.round(avail * scale);
                st.affiliations[k] -= take;
                actualShift += take;
              });
            }
            st.affiliations.green = (st.affiliations.green || 0) + actualShift;

            if (st.factions && typeof st.factions === 'object') {
              const _ecoScale = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
              let greenFactionPool = actualShift * _ecoScale;
              legacyGreenIds.forEach((oldId) => {
                if (st.factions[oldId]) {
                  greenFactionPool += Number(st.factions[oldId] || 0);
                  delete st.factions[oldId];
                }
              });
              // Deduct the newly shifted voters proportionally from non-green factions to keep state faction sum exact
              const newPull = actualShift * _ecoScale;
              const nonGreenFids = Object.keys(st.factions).filter((fid) => !ecoIds.includes(fid) && (st.factions[fid] || 0) > 0);
              const nonGreenSum = nonGreenFids.reduce((acc, fid) => acc + (st.factions[fid] || 0), 0);
              let pulledFromOthers = 0;
              if (nonGreenSum > 0) {
                nonGreenFids.forEach((fid) => {
                  const p = Math.min(st.factions[fid], Math.round(newPull * (st.factions[fid] / nonGreenSum)));
                  st.factions[fid] -= p;
                  pulledFromOthers += p;
                });
              }
              // Replace greenFactionPool's new portion with exact pulledFromOthers so total is exact
              const legacyPortion = greenFactionPool - newPull;
              const totalToDistribute = Math.max(0, legacyPortion + pulledFromOthers);
              let assigned = 0;
              ecoFactions.forEach((ef, idx) => {
                const share = idx === ecoFactions.length - 1
                  ? Math.max(0, totalToDistribute - assigned)
                  : Math.round(totalToDistribute * (ecoWeights[idx] || 0.25));
                st.factions[ef.id] = share;
                assigned += share;
              });
            }
          });
          reconcileVoterModelTotals(game.voterModel);
        }

        es.ecologicalFactions = ecoIds;
      },
      getFundraisingModifier(game, source, ctx = {}) {
        const pid = ctx.partyId || resolvePlayerPartyKey(game);
        if (source === 'small-dollar' && pid === 'green') {
          return 3.0; // Green Party receives 3x small-dollar fundraising yield
        }
        return 1.0;
      },
      getChapterCostModifier(game, partyId) {
        const pid = partyId || resolvePlayerPartyKey(game);
        return pid === 'green' ? 0 : 1.0; // 0-cost state chapter creation for Green Party
      },
      getTurnoutModifier(game, partyId) {
        const resolved = (!partyId || partyId === 'player') ? resolvePlayerPartyKey(game) : partyId;
        return resolved === 'green' ? 6.0 : 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #22: The Neo-Federalist Reunion (Group E · Weight = 5 · >= 35 yrs after Era #10)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_22_neo_federalist',
      onEraEnter(game) {
        const psd = getPSData();
        const es = ensureEraState(game);
        // Ensure regionalParties metadata is hydrated if transitioning via direct test/save
        if (!game.partySystems.regionalParties) {
          const regCatalog = (psd?.REGIONAL_PARTY_CATALOG || []).map((r) => ({ ...r, homeStates: [...r.homeStates] }));
          const territoryMap = {};
          regCatalog.forEach((r) => { r.homeStates.forEach((stId) => { territoryMap[stId] = r.id; }); });
          game.partySystems.regionalParties = {
            active: true,
            spawnedYear: Number(game.year || 2075) - 35,
            parties: regCatalog,
            absorbedPartyIds: [],
            territoryMap,
          };
        }
        es.neoFederalistReunionActive = true;
        es.crossRegionalMergerUnlocked = true;
        es.unionistVsAutonomist = true;
        es.absorbedRegionalParties = [...(game.partySystems.regionalParties.absorbedPartyIds || [])];
      },
      getRegionalMergerEnabled() {
        return true;
      },
      getRegionalPartySupportBonus(game, partyId, stateId) {
        if (!stateId || stateId === 'US') return 0;
        const rp = game?.partySystems?.regionalParties;
        if (!rp || !Array.isArray(rp.parties)) return 0;
        const absorbed = new Set(rp.absorbedPartyIds || []);
        const regSelf = rp.parties.find((p) => p.id === partyId);
        if (regSelf) {
          if (absorbed.has(regSelf.id)) return -40;
          // Weakened from Era #10 (+26 -> +14) as Unionist Restoration surges
          return (regSelf.homeStates || []).includes(stateId) ? 14.0 : -14.0;
        }
        // National party gains +5.0 Unionist momentum in states where regional bloc was absorbed
        const stateReg = rp.parties.find((p) => (p.homeStates || []).includes(stateId));
        if (stateReg && absorbed.has(stateReg.id)) return 5.0;
        if (stateReg && !absorbed.has(stateReg.id)) return -3.0;
        return 2.0;
      },
      getTurnoutModifier(game, partyId) {
        const resolved = (!partyId || partyId === 'player') ? resolvePlayerPartyKey(game) : partyId;
        return String(resolved).startsWith('reg_') ? -2.0 : 3.5; // Unionist restoration lifts national turnout
      },
    });

    // ------------------------------------------------------------------
    // ERA #23: The Secular Enlightenment Revival (Group E · Weight = 5 · >= 30 yrs after Era #9)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_23_secular_enlightenment',
      onEraEnter(game) {
        const es = ensureEraState(game);
        // Reverses Era #9's Pillar 4 baseline (7.0) to secular constitutionalism (3.0)
        es.secularRevivalActive = true;
        es.pillar4Baseline = 3.0;
        const states = getChairData().STATES || [];
        const baselineMap = {};
        states.forEach((st) => { baselineMap[st.id] = 3.0; });
        es.statePillar4Baselines = baselineMap;
      },
      getTurnoutModifier(game, partyId, stateId, ctx = {}) {
        const pillar4 = Number.isFinite(Number(ctx.pillar4Stance))
          ? Number(ctx.pillar4Stance)
          : computePillarAverageStance(game, 'social-cultural', partyId || null);
        if (pillar4 <= 4.5) return 6.0; // Youth & secular constitutionalist turnout surge
        if (pillar4 >= 7.5) return -4.0; // Sectarian fatigue drag
        return 1.5;
      },
      getVolunteerDriveMultiplier(game, ctx = {}) {
        const pillar4 = Number.isFinite(Number(ctx.pillar4Stance))
          ? Number(ctx.pillar4Stance)
          : computePillarAverageStance(game, 'social-cultural', ctx.partyId || null);
        if (pillar4 <= 4.5) return 1.35; // Surging youth/secular volunteer mobilization
        if (pillar4 >= 7.5) return 0.85;
        return 1.05;
      },
      getCandidateMarginModifier(game, candidate, stateId, ctx = {}) {
        const pillar4 = Number.isFinite(Number(candidate?.pillar4Stance))
          ? Number(candidate.pillar4Stance)
          : computePillarAverageStance(game, 'social-cultural', ctx.partyId || candidate?.partyId || null);
        if (pillar4 <= 4.5) return 4.0;
        if (pillar4 >= 7.5) return -4.0;
        return 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #24: The Human-Verified Backlash (Group E · Weight = 5 · >= 35 yrs after Era #15)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_24_human_verified',
      onEraEnter(game) {
        const es = ensureEraState(game);
        es.humanVerifiedBacklashActive = true;
        es.analogMultiplier = 1.75;
        es.algorithmicPenalty = 0.45;
      },
      getAnalogCampaignMultiplier() {
        return 1.75; // Heavy multiplier to analog campaigning, physical state chapters & in-person member tours
      },
      getAlgorithmicCampaignMultiplier() {
        return 0.45; // Steep penalty to algorithmic / viral-only digital tactics
      },
      getVolunteerDriveMultiplier() {
        return 1.60; // Door-to-door human grassroots mobilization surge
      },
      getFundraisingModifier(game, source) {
        if (source === 'chapter') return 1.65;
        if (source === 'viral' || source === 'algorithmic') return 0.45;
        if (source === 'small-dollar') return 1.25;
        return 1.0;
      },
      getCandidateMarginModifier(game, candidate) {
        if (!candidate) return 0;
        const traits = Array.isArray(candidate.traits) ? candidate.traits : [];
        if (traits.includes('Corrupt') || candidate.syntheticMediaScandal) return -5.0;
        if (traits.includes('Rough') || traits.includes('Squeaky Clean')) return 3.0;
        return 0;
      },
    });

    // ------------------------------------------------------------------
    // ERA #25: The Planetary Thermostat Era (Group E · Weight = 5 · >= 40 yrs after Era #13 OR Era #17)
    // ------------------------------------------------------------------
    registerEraPlugin({
      id: 'era_25_planetary_thermostat',
      onEraEnter(game) {
        const psd = getPSData();
        const es = ensureEraState(game);
        const blocs = psd?.PLANETARY_THERMOSTAT_BLOCS || [];
        const activeIdx = Math.abs(Math.floor((Number(game?.year || 2080) - 2028) / 2)) % Math.max(1, blocs.length);
        es.planetaryThermostatActive = true;
        es.disputedBlocId = blocs[activeIdx]?.id || 'arid_southwest_basin';
        es.disputedBlocName = blocs[activeIdx]?.name || 'Arid Southwest Basin';
      },
      onCycleStart(game) {
        const psd = getPSData();
        const es = ensureEraState(game);
        const blocs = psd?.PLANETARY_THERMOSTAT_BLOCS || [];
        const activeIdx = Math.abs(Math.floor((Number(game?.year || 2080) - 2028) / 2)) % Math.max(1, blocs.length);
        es.disputedBlocId = blocs[activeIdx]?.id || 'arid_southwest_basin';
        es.disputedBlocName = blocs[activeIdx]?.name || 'Arid Southwest Basin';
      },
      getIssueSalienceModifiers(game) {
        const activeEraIssues = (game?.partySystems?.eraExclusiveIssuesActive || []).filter((id) => id.startsWith('era25-'));
        const weights = {};
        activeEraIssues.forEach((id) => { weights[id] = 3.2; });
        return { weights, defaultWeight: 0.70, axisLabel: 'Geo-Engineering Prometheans vs. Wild-Earth Preservationists' };
      },
      getTurnoutModifier(game, partyId, stateId) {
        if (!stateId || stateId === 'US') return 0;
        const bloc = getThermostatBlocForState(stateId);
        if (!bloc) return 0;
        const disputedId = game?.partySystems?.eraState?.disputedBlocId;
        return bloc.id === disputedId ? 5.5 : 2.5;
      },
      getCandidateMarginModifier(game, candidate, stateId, ctx = {}) {
        if (!stateId || stateId === 'US') return 0;
        const bloc = getThermostatBlocForState(stateId);
        if (!bloc) return 0;
        const climateStance = Number.isFinite(Number(candidate?.climateStance))
          ? Number(candidate.climateStance)
          : computePillarAverageStance(game, 'climate-policy', ctx.partyId || candidate?.partyId || null);
        const dist = Math.abs(climateStance - Number(bloc.preferredClimateStance || 5.0));
        if (dist <= 1.8) return 3.5;
        if (dist >= 3.8) return -3.5;
        return 0;
      },
    });
  }

  // Register all 8 Phase 3 Structural Party-Spawning & Group E Follow-Up Era plugins immediately
  registerPhase3EraPlugins();

  function registerPhase4EraPlugins() {
    const psc = getPSCoalition();
    if (psc?.createEra18Plugin) {
      registerEraPlugin(psc.createEra18Plugin());
    }
    const psr = getPSRobots();
    if (psr?.createEra16Plugin) {
      registerEraPlugin(psr.createEra16Plugin());
    }
  }
  registerPhase4EraPlugins();

  // Phase 4 Cross-Era Query & Action Dispatch Helpers
  function isNationwideMMPActive(game) {
    return Boolean(game?.partySystems?.coalitionSystem?.mmpActive);
  }

  function isSyntheticSuffrageActive(game) {
    return Boolean(game?.partySystems?.robotCitizenship?.active || game?.voterModel?.syntheticScaleAuthorized);
  }

  function isRobotParty(partyIdOrObj) {
    const psr = getPSRobots();
    return psr ? psr.isRobotParty(partyIdOrObj) : false;
  }

  function getSyntheticTurnout(game, partyIdOrObj) {
    const psr = getPSRobots();
    return psr ? psr.getSyntheticTurnout(game, partyIdOrObj) : null;
  }

  function selectCoalitionEraParty(game, partyId) {
    if (!game) return game;
    const currentKey = resolvePlayerPartyKey(game);
    let next = (partyId && partyId !== currentKey) ? switchPlayerChairParty(game, partyId) : { ...game };
    const ps = next.partySystems || createInitialPartySystemsState(next);
    const cs = ps.coalitionSystem ? { ...ps.coalitionSystem, partySelectionCompleted: true } : null;
    return {
      ...next,
      partySystems: {
        ...ps,
        coalitionSystem: cs,
        pendingModal: (ps.pendingModal === 'party_select' || ps.pendingModal === 'realignment') ? null : ps.pendingModal,
        modalPayload: (ps.pendingModal === 'party_select' || ps.pendingModal === 'realignment') ? null : ps.modalPayload,
      },
    };
  }

  function selectRobotEraParty(game, partyId) {
    if (!game) return game;
    const stayHuman = !partyId || partyId === 'stay_human_party';
    let next = stayHuman ? { ...game } : switchPlayerChairParty(game, partyId);
    const ps = next.partySystems || createInitialPartySystemsState(next);
    const psr = getPSRobots();
    const rc = ps.robotCitizenship
      ? { ...ps.robotCitizenship, playerSwitchedToRobot: Boolean(psr?.isRobotParty(next.player)) }
      : null;
    return {
      ...next,
      partySystems: {
        ...ps,
        robotCitizenship: rc,
        pendingModal: (ps.pendingModal === 'robot_select' || ps.pendingModal === 'realignment') ? null : ps.pendingModal,
        modalPayload: (ps.pendingModal === 'robot_select' || ps.pendingModal === 'realignment') ? null : ps.modalPayload,
        eraState: {
          ...(ps.eraState || {}),
          robotChairChoiceCompleted: true,
        },
      },
    };
  }

  function resolveCoalitionBargaining(game, payload = {}) {
    const psc = getPSCoalition();
    return psc?.resolveCoalitionBargaining ? psc.resolveCoalitionBargaining(game, payload) : game;
  }

  function resolveCoalitionFractureCrisis(game, choice = 'concede') {
    const psc = getPSCoalition();
    return psc?.resolveCoalitionFractureCrisis ? psc.resolveCoalitionFractureCrisis(game, choice) : game;
  }

  function stabilizeCoalitionSummit(game) {
    const psc = getPSCoalition();
    return psc?.stabilizeCoalitionSummit ? psc.stabilizeCoalitionSummit(game) : game;
  }

  function evaluateCoalitionStabilityImpact(game, actionContext = {}) {
    const psc = getPSCoalition();
    return psc?.evaluateCoalitionStabilityImpact ? psc.evaluateCoalitionStabilityImpact(game, actionContext) : game;
  }

  // Convenience Query Helpers (safe defaults when no modifier applies)
  function getApprovalDecayMultiplier(game) {
    return Number(dispatchEraHook(game, 'getApprovalDecayMultiplier') ?? 1.0);
  }

  function getCoattailMultiplier(game) {
    return Number(dispatchEraHook(game, 'getCoattailMultiplier') ?? 1.0);
  }

  function getWaveVolatilityMultiplier(game) {
    return Number(dispatchEraHook(game, 'getWaveVolatilityMultiplier') ?? 1.0);
  }

  function getIndependentElasticityMultiplier(game) {
    return Number(dispatchEraHook(game, 'getIndependentElasticityMultiplier') ?? 1.0);
  }

  function getIndependentDefectionBonus(game) {
    return Number(dispatchEraHook(game, 'getIndependentDefectionBonus') ?? 0);
  }

  function getCandidateMarginModifier(game, candidate, stateId = null, ctx = {}) {
    return Number(dispatchEraHook(game, 'getCandidateMarginModifier', candidate, stateId, ctx) ?? 0);
  }

  function getVolunteerDriveMultiplier(game, ctx = {}) {
    return Number(dispatchEraHook(game, 'getVolunteerDriveMultiplier', ctx) ?? 1.0);
  }

  function getSuperPacFundingMultiplier(game, pac) {
    return Number(dispatchEraHook(game, 'getSuperPacFundingMultiplier', pac) ?? 1.0);
  }

  function getChapterCostModifier(game, partyId = null) {
    const pid = partyId || resolvePlayerPartyKey(game);
    return Number(dispatchEraHook(game, 'getChapterCostModifier', pid) ?? 1.0);
  }

  function getAnalogCampaignMultiplier(game) {
    return Number(dispatchEraHook(game, 'getAnalogCampaignMultiplier') ?? 1.0);
  }

  function getAlgorithmicCampaignMultiplier(game) {
    return Number(dispatchEraHook(game, 'getAlgorithmicCampaignMultiplier') ?? 1.0);
  }

  function getRegionalPartySupportBonus(game, partyId, stateId) {
    return Number(dispatchEraHook(game, 'getRegionalPartySupportBonus', partyId, stateId) ?? 0);
  }

  function isRegionalMergerEnabled(game) {
    return Boolean(dispatchEraHook(game, 'getRegionalMergerEnabled'));
  }

  function isCoalitionMajorityRequired(game) {
    return Boolean(
      (game?.partySystems?.eraState?.coalitionMajorityRequired && game?.partySystems?.currentEraId === 'era_03_six_party_system')
      || game?.partySystems?.coalitionSystem?.mmpActive
    );
  }

  function getBillSignoffRequirement(game, pendingBill) {
    return dispatchEraHook(game, 'getBillSignoffRequirement', pendingBill)
      || { required: false, canPass: true, hasLabor: true, hasBusiness: true, missing: [] };
  }

  function getPillarWeightModifiers(game) {
    return dispatchEraHook(game, 'getPillarWeightModifiers') || null;
  }

  function getIssueSalienceModifiers(game) {
    return dispatchEraHook(game, 'getIssueSalienceModifiers') || null;
  }

  function getDownballotIndependentField(game, raceId = null) {
    const map = game?.partySystems?.eraState?.independentDownballotRaces || {};
    if (raceId) return map[raceId] || null;
    return map;
  }

  function isSuperPacOutlawed(game) {
    const eraId = game?.partySystems?.currentEraId;
    return eraId === 'era_26_post_citizens_united' || Boolean(game?.partySystems?.postCitizensUnited?.pacsDissolved && eraId === 'era_26_post_citizens_united');
  }

  function getActiveEraAdvisory(game) {
    const eraId = game?.partySystems?.currentEraId || 'era_07_baseline';
    const psd = getPSData();
    const meta = getEraMetadata(eraId);
    return meta?.dossier?.campaignAdvisory || psd?.ERA_CAMPAIGN_ADVISORIES?.[eraId] || '';
  }

  const api = {
    createInitialPartySystemsState,
    normalizePartySystemsState,
    getEligibilityFloorYear,
    computeTransitionProbability,
    computeAveragePillarStance,
    computePillarAverageStance,
    detectReplacementInsurgent,
    evaluateEraTrigger,
    getEligiblePartySystems,
    selectNextPartySystem,
    evaluateEraTransition,
    transitionToPartySystem,
    registerEraPlugin,
    getEraMetadata,
    getEraPlugin,
    getActiveEraPlugin,
    dispatchEraHook,
    getBaselineIssues,
    getBaselineIssueIds,
    getIssueDefinition,
    getActiveIssuesForGame,
    getIssueStanceDescription,
    initializeStanceForNewIssue,
    replaceSunsettedFactionKeyIssues,
    retireIssue,
    introduceIssue,
    executeEraIssueSwap,
    rollIndependentPresidentialCandidate,
    computeIndependentDualSiphoning,
    dismissRealignmentModal,
    ordinalSuffix,
    // Phase 2 Classifiers & Simulation Hook Helpers
    resolveCandidateAge,
    isMetroState,
    resolveCandidateGeoArchetype,
    isExtremistCandidate,
    hasSqueakyCleanTrait,
    isLaborFaction,
    isBusinessFaction,
    getApprovalDecayMultiplier,
    getCoattailMultiplier,
    getWaveVolatilityMultiplier,
    getIndependentElasticityMultiplier,
    getIndependentDefectionBonus,
    getCandidateMarginModifier,
    getVolunteerDriveMultiplier,
    getSuperPacFundingMultiplier,
    getBillSignoffRequirement,
    getPillarWeightModifiers,
    getIssueSalienceModifiers,
    getDownballotIndependentField,
    isSuperPacOutlawed,
    getActiveEraAdvisory,
    // Phase 3 Party-Spawning, Switching, Merger & Group E Helpers
    reconcileVoterModelTotals,
    grantFullNationwideBallotAccess,
    grantStateBallotAccess,
    isModerateSittingOfficial,
    getPartyDisplayName,
    getRegionalPartyForState,
    getThermostatBlocForState,
    switchPlayerChairParty,
    absorbRegionalParty,
    resolveEraDecision,
    getChapterCostModifier,
    getAnalogCampaignMultiplier,
    getAlgorithmicCampaignMultiplier,
    getRegionalPartySupportBonus,
    isRegionalMergerEnabled,
    isCoalitionMajorityRequired,
    // Phase 4 Flagship Era #18 (Coalition MMP) & Era #16 (Robots Become Citizens) Helpers
    registerPhase4EraPlugins,
    isNationwideMMPActive,
    isSyntheticSuffrageActive,
    isRobotParty,
    getSyntheticTurnout,
    selectCoalitionEraParty,
    selectRobotEraParty,
    resolveCoalitionBargaining,
    resolveCoalitionFractureCrisis,
    stabilizeCoalitionSummit,
    evaluateCoalitionStabilityImpact,
  };

  if (typeof window !== 'undefined') {
    window.PartySystemsEngine = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
