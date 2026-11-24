/* ============================================================================
 * COALITION BUILDER: PARTY CHAIR — v0.18.5 VERSIONED SAVE MIGRATIONS
 * Formal Save-Migration, Backward-Compatibility, & Corruption Repair Framework
 * Exposes window.SaveMigrations (browser) and module.exports (Node tests).
 * 100% deterministic & idempotent (zero non-deterministic randomness).
 * ============================================================================ */
(function (global) {
  'use strict';

  const SAVE_SCHEMA_VERSION = 8;

  const LEGACY_STORAGE_KEYS = [
    'partyChairGame.save.v18.4',
    'partyChairGame.save.v18.3',
    'partyChairGame.save.v18.2',
    'partyChairGame.save.v16.2',
    'partyChairGame.save.v16.1',
    'partyChairGame.save.v16.0',
    'partyChairGame.save.v15.9',
    'partyChairGame.save.v1',
  ];

  const CORE_PARTY_IDS = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'];

  const DEFAULT_TIERS = {
    people: 5,
    heritage: 5,
    liberty: 1,
    green: 1,
    constitution: 1,
    socialist: 1,
  };

  const DEFAULT_MEDIA_BASELINES = {
    people:       { broadcast: 64, cable: 56, digital: 58, local: 54, upkeepChannels: [], counterPenalties: [] },
    heritage:     { broadcast: 52, cable: 70, digital: 64, local: 56, upkeepChannels: [], counterPenalties: [] },
    liberty:      { broadcast: 16, cable: 24, digital: 42, local: 18, upkeepChannels: [], counterPenalties: [] },
    green:        { broadcast: 14, cable: 16, digital: 38, local: 22, upkeepChannels: [], counterPenalties: [] },
    constitution: { broadcast: 10, cable: 22, digital: 28, local: 16, upkeepChannels: [], counterPenalties: [] },
    socialist:    { broadcast: 10, cable: 14, digital: 40, local: 15, upkeepChannels: [], counterPenalties: [] },
    player:       { broadcast: 18, cable: 18, digital: 28, local: 20, upkeepChannels: [], counterPenalties: [] },
  };

  // --------------------------------------------------------------------------
  // DETERMINISTIC HELPERS
  // --------------------------------------------------------------------------
  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function round(v, d = 2) {
    const f = Math.pow(10, d);
    return Math.round((Number(v) || 0) * f) / f;
  }

  function isPlainObject(v) {
    return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
  }

  // Deep clone that preserves NaN values so validateAndRepairSave can detect/repair them
  function cloneSafe(val, seen = new WeakMap()) {
    if (val === null || typeof val !== 'object') return val;
    if (seen.has(val)) return seen.get(val);
    if (Array.isArray(val)) {
      const arr = [];
      seen.set(val, arr);
      for (let i = 0; i < val.length; i++) arr[i] = cloneSafe(val[i], seen);
      return arr;
    }
    const obj = {};
    seen.set(val, obj);
    const keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      obj[k] = cloneSafe(val[k], seen);
    }
    return obj;
  }

  function deterministicTimestamp(raw) {
    const year = Number.isFinite(Number(raw?.year)) ? Number(raw.year) : 2028;
    const seed = Number.isFinite(Number(raw?.seed)) ? Math.abs(Math.trunc(Number(raw.seed))) : 2028;
    return Date.UTC(2020, 0, 1) + (Math.max(0, year - 1960) * 86400 + (seed % 86400)) * 1000;
  }

  function resolvePlayerPartyKey(raw) {
    if (raw?.player?.custom) return 'player';
    const base = raw?.player?.baseTemplateId || raw?.player?.id || 'people';
    if (base === 'custom' || base === 'player') return 'player';
    return base;
  }

  function partyDisplayName(pid, raw) {
    if (pid === 'player') return raw?.player?.name || 'Custom Party';
    const map = {
      people: 'Democratic Party',
      heritage: 'Republican Party',
      liberty: 'Libertarian Party',
      green: 'Green Party',
      constitution: 'Constitution Party',
      socialist: 'Peace and Freedom Party',
    };
    return map[pid] || pid;
  }

  // --------------------------------------------------------------------------
  // STEP 1: v0.16.2 -> v0.18.2
  // Bridges legacy partyChairGame.save.v16.2 keys, 1:100 -> 1:1 voter scale,
  // and missing factions / sittingMembers fields.
  // --------------------------------------------------------------------------
  function scaleVoterModel100To1(vm) {
    if (!isPlainObject(vm)) return vm;
    if (vm.voterScale === '1:1') return vm;
    const sample = Number(vm.sampleVoters);
    if (Number.isFinite(sample) && sample >= 10000000) {
      return {
        ...vm,
        voterScale: '1:1',
        representedVoters: Number.isFinite(Number(vm.representedVoters)) ? Math.max(Number(vm.representedVoters), sample) : sample,
      };
    }
    const MULT = 100;
    const next = cloneSafe(vm);
    next.voterScale = '1:1';
    next.populationUnit = '1:1 represented voters (each unit equals 1 real voter).';
    if (Number.isFinite(Number(next.sampleVoters))) {
      next.sampleVoters = Math.round(Number(next.sampleVoters) * MULT);
    }
    if (Number.isFinite(Number(next.representedVoters)) && Number(next.representedVoters) < 10000000) {
      next.representedVoters = Math.round(Number(next.representedVoters) * MULT);
    } else if (!Number.isFinite(Number(next.representedVoters))) {
      next.representedVoters = Number.isFinite(Number(next.sampleVoters)) ? next.sampleVoters : 155000000;
    }
    if (isPlainObject(next.affiliations)) {
      Object.keys(next.affiliations).forEach((k) => {
        const rec = next.affiliations[k];
        if (isPlainObject(rec) && Number.isFinite(Number(rec.sampleVoters)) && Number(rec.sampleVoters) < 10000000) {
          rec.sampleVoters = Math.round(Number(rec.sampleVoters) * MULT);
        }
      });
    }
    if (Array.isArray(next.states)) {
      next.states.forEach((st) => {
        if (!isPlainObject(st)) return;
        if (Number.isFinite(Number(st.sampleVoters)) && Number(st.sampleVoters) < 10000000) {
          st.sampleVoters = Math.round(Number(st.sampleVoters) * MULT);
        }
        if (isPlainObject(st.affiliations)) {
          Object.keys(st.affiliations).forEach((k) => {
            if (Number.isFinite(Number(st.affiliations[k])) && Number(st.affiliations[k]) < 10000000) {
              st.affiliations[k] = Math.round(Number(st.affiliations[k]) * MULT);
            }
          });
        }
        if (isPlainObject(st.factions)) {
          Object.keys(st.factions).forEach((k) => {
            if (Number.isFinite(Number(st.factions[k])) && Number(st.factions[k]) < 10000000) {
              st.factions[k] = Math.round(Number(st.factions[k]) * MULT);
            }
          });
        }
      });
    }
    return next;
  }

  function migrateV016ToV0182(raw) {
    if (!isPlainObject(raw)) return raw;
    const out = cloneSafe(raw);

    // Bridge legacy partyChairGame.save.v16.2 envelope / field names
    if (out.saveKey === 'partyChairGame.save.v16.2' || out._legacyKey === 'partyChairGame.save.v16.2') {
      out._migratedFromKey = 'partyChairGame.save.v16.2';
      delete out.saveKey;
    }
    if (!out.player && isPlainObject(out.playerParty)) {
      out.player = cloneSafe(out.playerParty);
    }
    if (isPlainObject(out.player)) {
      if (!out.player.name && typeof out.partyName === 'string') out.player.name = out.partyName;
      if (!out.player.baseTemplateId && out.player.id) out.player.baseTemplateId = out.player.id;
    }
    if (!Number.isFinite(Number(out.treasury))) {
      if (Number.isFinite(Number(out.budget))) out.treasury = Number(out.budget);
      else if (Number.isFinite(Number(out.funds))) out.treasury = Number(out.funds);
    }
    if (!Number.isFinite(Number(out.year))) out.year = 2028;
    if (!Number.isFinite(Number(out.seed))) out.seed = 2028;

    // 1:100 -> 1:1 voter scale normalization
    if (isPlainObject(out.voterModel)) {
      out.voterModel = scaleVoterModel100To1(out.voterModel);
    }

    // Backfill missing factions array from catalog if available
    if (!Array.isArray(out.factions) || out.factions.length === 0) {
      const cat = global.PartyChairData?.ALL_PARTY_FACTIONS || global.PartyChairData?.FACTIONS || [];
      out.factions = Array.isArray(cat) && cat.length > 0
        ? cat.map((f) => ({
            ...cloneSafe(f),
            happiness: Number.isFinite(Number(f.startingHappiness)) ? Number(f.startingHappiness) : 55,
            confidence: 50,
          }))
        : [];
    }

    // Backfill missing sittingMembers from scenario/data if available
    if (!Array.isArray(out.sittingMembers) || out.sittingMembers.length === 0) {
      const sm = global.PartyChairData?.SITTING_MEMBERS || [];
      out.sittingMembers = Array.isArray(sm) && sm.length > 0 ? cloneSafe(sm) : [];
    }

    if (!Number.isFinite(Number(out.schema)) || Number(out.schema) < 6) {
      out.schema = 6;
    }
    return out;
  }

  // --------------------------------------------------------------------------
  // STEP 2: v0.18.2 -> v0.18.3
  // Initializes SOEE game.parties, dual-binds syncPartyStateWithLegacy,
  // fixes 'custom' vs 'player' party IDs, and adds deterministic _savedAt.
  // --------------------------------------------------------------------------
  function renameCustomKeyToPlayer(mapObj) {
    if (!isPlainObject(mapObj)) return mapObj;
    if (Object.prototype.hasOwnProperty.call(mapObj, 'custom')) {
      if (!Object.prototype.hasOwnProperty.call(mapObj, 'player')) {
        mapObj.player = mapObj.custom;
      }
      delete mapObj.custom;
    }
    return mapObj;
  }

  function migrateV0182ToV0183(raw) {
    if (!isPlainObject(raw)) return raw;
    const out = cloneSafe(raw);

    // Fix 'custom' vs 'player' party IDs across player, maps, rosters, voterModel
    const isCustom = Boolean(out.player?.custom || out.player?.baseTemplateId === 'custom' || out.player?.id === 'custom');
    if (isCustom && isPlainObject(out.player)) {
      out.player.custom = true;
      out.player.id = 'player';
      if (!out.player.baseTemplateId || out.player.baseTemplateId === 'custom') {
        out.player.baseTemplateId = 'player';
      }
      renameCustomKeyToPlayer(out.partyTiers);
      renameCustomKeyToPlayer(out.ballotAccess);
      renameCustomKeyToPlayer(out.parties);
      renameCustomKeyToPlayer(out.mediaEcosystem);
      if (isPlainObject(out.voterModel?.affiliations)) {
        renameCustomKeyToPlayer(out.voterModel.affiliations);
      }
      if (Array.isArray(out.voterModel?.states)) {
        out.voterModel.states.forEach((st) => {
          if (isPlainObject(st?.affiliations)) renameCustomKeyToPlayer(st.affiliations);
        });
      }
      if (Array.isArray(out.sittingMembers)) {
        out.sittingMembers.forEach((m) => {
          if (!isPlainObject(m)) return;
          if (m.party === 'custom') m.party = 'player';
          if (m.partyId === 'custom') m.partyId = 'player';
        });
      }
      if (Array.isArray(out.representatives)) {
        out.representatives.forEach((r) => {
          if (!isPlainObject(r)) return;
          if (r.partyId === 'custom') r.partyId = 'player';
          if (r.party === 'custom') r.party = 'player';
        });
      }
    }

    const pKey = resolvePlayerPartyKey(out);

    // Initialize SOEE game.parties if missing or incomplete
    if (!isPlainObject(out.parties)) out.parties = {};
    const partyKeys = [...CORE_PARTY_IDS];
    if (isCustom && !partyKeys.includes('player')) partyKeys.push('player');
    if (pKey && !partyKeys.includes(pKey)) partyKeys.push(pKey);

    partyKeys.forEach((pid) => {
      const isPlayer = pid === pKey;
      const existing = isPlainObject(out.parties[pid]) ? out.parties[pid] : {};
      const defaultCash = isPlayer
        ? (Number.isFinite(Number(out.treasury)) ? Number(out.treasury) : 25)
        : (['people', 'heritage'].includes(pid) ? 150 : 12);
      out.parties[pid] = {
        id: pid,
        name: existing.name || partyDisplayName(pid, out),
        treasury: Number.isFinite(Number(existing.treasury)) ? Number(existing.treasury) : defaultCash,
        organizingActionsRemaining: Number.isFinite(Number(existing.organizingActionsRemaining))
          ? Number(existing.organizingActionsRemaining)
          : (isPlayer ? (Number.isFinite(Number(out.organizingActionsRemaining)) ? Number(out.organizingActionsRemaining) : 20) : 20),
        platformStances: isPlainObject(existing.platformStances)
          ? existing.platformStances
          : (isPlayer && isPlainObject(out.issuePositions) ? cloneSafe(out.issuePositions) : {}),
        activeQuests: Array.isArray(existing.activeQuests) ? existing.activeQuests : [],
        factionHappiness: isPlainObject(existing.factionHappiness)
          ? existing.factionHappiness
          : (isPlayer && isPlainObject(out.factionHappiness) ? cloneSafe(out.factionHappiness) : {}),
        actionLog: Array.isArray(existing.actionLog) ? existing.actionLog : [],
        ...existing,
        id: pid,
      };
    });

    // Dual-bind syncPartyStateWithLegacy (mirrors player party treasury & organizingActionsRemaining)
    if (out.parties[pKey]) {
      const topCash = Number.isFinite(Number(out.treasury)) ? Number(out.treasury) : null;
      const pCash = Number.isFinite(Number(out.parties[pKey].treasury)) ? Number(out.parties[pKey].treasury) : null;
      const syncedCash = topCash !== null ? topCash : (pCash !== null ? pCash : 25);
      out.treasury = syncedCash;
      out.parties[pKey].treasury = syncedCash;

      const topActs = Number.isFinite(Number(out.organizingActionsRemaining)) ? Number(out.organizingActionsRemaining) : null;
      const pActs = Number.isFinite(Number(out.parties[pKey].organizingActionsRemaining)) ? Number(out.parties[pKey].organizingActionsRemaining) : null;
      const syncedActs = topActs !== null ? topActs : (pActs !== null ? pActs : 20);
      out.organizingActionsRemaining = syncedActs;
      out.parties[pKey].organizingActionsRemaining = syncedActs;
    }

    // Add deterministic _savedAt if missing or non-finite
    if (!Number.isFinite(Number(out._savedAt))) {
      out._savedAt = deterministicTimestamp(out);
    }

    if (!Number.isFinite(Number(out.schema)) || Number(out.schema) < 7) {
      out.schema = 7;
    }
    return out;
  }

  // --------------------------------------------------------------------------
  // STEP 3: v0.18.3 -> v0.18.4+
  // Safely backfills all v0.18.4+ subsystems WITHOUT clobbering existing values.
  // --------------------------------------------------------------------------
  function migrateV0183ToV0184(raw) {
    if (!isPlainObject(raw)) return raw;
    const out = cloneSafe(raw);
    const ms = global.MediaShocksSystem || null;

    // 1. mediaEcosystem
    if (!isPlainObject(out.mediaEcosystem) || Object.keys(out.mediaEcosystem).length === 0) {
      out.mediaEcosystem = ms && typeof ms.createInitialMediaEcosystem === 'function'
        ? ms.createInitialMediaEcosystem(out)
        : cloneSafe(DEFAULT_MEDIA_BASELINES);
    } else if (ms && typeof ms.normalizeMediaEcosystem === 'function') {
      out.mediaEcosystem = ms.normalizeMediaEcosystem(out.mediaEcosystem, out);
    }

    // 2. activeMacroArc & macroArcHistory
    if (!isPlainObject(out.activeMacroArc) || !out.activeMacroArc.id) {
      out.activeMacroArc = ms && typeof ms.pickDeterministicShock === 'function'
        ? ms.pickDeterministicShock(out.seed || 2028, out.year || 2028, null)
        : {
            id: 'ai_labor_disruption',
            title: 'AI & Automation Labor Disruption',
            shortTitle: 'AI Labor Shock',
            category: 'Tech & Labor',
            polarity: 'negative',
            stage: 'onset',
            cycleIndex: 1,
            totalCycles: 3,
            startYear: Number(out.year || 2028),
            salienceMultipliers: { 'frontier-ai-oversight-compute': 2.2, 'cost-of-living': 2.0 },
          };
    }
    if (!Array.isArray(out.macroArcHistory)) out.macroArcHistory = [];

    // 3. primaryRules
    if (!isPlainObject(out.primaryRules)) out.primaryRules = {};

    // 4. patronageAppointments
    if (!isPlainObject(out.patronageAppointments)) out.patronageAppointments = {};

    // 5. diplomacyPacts
    if (!Array.isArray(out.diplomacyPacts)) out.diplomacyPacts = [];

    // 6. atlasHistory
    if (!isPlainObject(out.atlasHistory)) {
      out.atlasHistory = { cycles: [], maps: {} };
    }

    // 7. multiplayer
    if (!isPlainObject(out.multiplayer)) {
      out.multiplayer = { enabled: false, mode: 'solo', activePlayerIndex: 0, seats: [] };
    }

    // 8. leadingFactionByParty
    if (!isPlainObject(out.leadingFactionByParty)) out.leadingFactionByParty = {};

    // 9. realignedAnchors
    if (!isPlainObject(out.realignedAnchors)) out.realignedAnchors = {};

    // 10. activeBallotInitiatives
    if (!Array.isArray(out.activeBallotInitiatives)) out.activeBallotInitiatives = [];

    // 11. redistrictingCommissions
    if (!isPlainObject(out.redistrictingCommissions)) out.redistrictingCommissions = {};

    out.schema = SAVE_SCHEMA_VERSION;
    return out;
  }

  // --------------------------------------------------------------------------
  // CORRUPTION & SANITY GUARDRAILS: validateAndRepairSave(game)
  // --------------------------------------------------------------------------
  function validateAndRepairSave(game) {
    if (!isPlainObject(game)) return game;
    const out = cloneSafe(game);
    const pKey = resolvePlayerPartyKey(out);

    // 1. Repair missing/NaN treasury
    const fallbackBudget = Number.isFinite(Number(out.player?.startingBudget)) ? Number(out.player.startingBudget) : 25;
    if (!Number.isFinite(Number(out.treasury))) {
      out.treasury = Math.max(0, round(fallbackBudget, 2));
    } else {
      out.treasury = Math.max(0, round(Number(out.treasury), 2));
    }
    if (isPlainObject(out.parties?.[pKey])) {
      if (!Number.isFinite(Number(out.parties[pKey].treasury))) {
        out.parties[pKey].treasury = out.treasury;
      }
    }

    // 2. Repair missing/NaN trust
    const rawTrust = isPlainObject(out.trust) ? out.trust : (isPlainObject(out.player?.trust) ? out.player.trust : {});
    out.trust = {
      supporters: Number.isFinite(Number(rawTrust.supporters)) ? clamp(round(rawTrust.supporters, 1), 0, 100) : 65,
      independents: Number.isFinite(Number(rawTrust.independents)) ? clamp(round(rawTrust.independents, 1), 0, 100) : 40,
      opponents: Number.isFinite(Number(rawTrust.opponents)) ? clamp(round(rawTrust.opponents, 1), 0, 100) : 12,
    };
    if (isPlainObject(out.player)) {
      out.player.trust = { ...out.trust };
    }

    // 3. Repair missing/NaN scalar metrics
    if (!Number.isFinite(Number(out.presidentialApproval))) out.presidentialApproval = 44;
    else out.presidentialApproval = clamp(round(out.presidentialApproval, 1), 15, 85);

    if (!Number.isFinite(Number(out.nationalEnvironment))) out.nationalEnvironment = 0;
    else out.nationalEnvironment = clamp(round(out.nationalEnvironment, 2), -20, 20);

    if (!Number.isFinite(Number(out.sittingMemberHappiness))) out.sittingMemberHappiness = 70;
    else out.sittingMemberHappiness = clamp(round(out.sittingMemberHappiness, 1), 0, 100);

    if (!Number.isFinite(Number(out.organizingActionsRemaining))) out.organizingActionsRemaining = 20;
    else out.organizingActionsRemaining = Math.max(0, Math.trunc(Number(out.organizingActionsRemaining)));

    // 4. Repair missing/NaN partyTiers
    if (!isPlainObject(out.partyTiers)) out.partyTiers = {};
    const tierKeys = [...CORE_PARTY_IDS];
    if (out.player?.custom && !tierKeys.includes('player')) tierKeys.push('player');
    tierKeys.forEach((k) => {
      const v = Number(out.partyTiers[k]);
      const defTier = k === 'player' ? (Number.isFinite(Number(out.player?.tier)) ? Number(out.player.tier) : 1) : (DEFAULT_TIERS[k] ?? 1);
      out.partyTiers[k] = Number.isFinite(v) ? clamp(Math.trunc(v), 0, 5) : clamp(Math.trunc(defTier), 0, 5);
    });

    // 5. Repair duplicate sittingMembers House districts & enforce 1:1 representatives parity
    if (Array.isArray(out.sittingMembers)) {
      const seenHouseDistricts = new Map();
      const deduped = [];
      for (let i = 0; i < out.sittingMembers.length; i++) {
        const m = out.sittingMembers[i];
        if (!isPlainObject(m)) continue;
        const isHouse = m.office === 'house' && Boolean(m.districtId);
        if (isHouse) {
          const dKey = String(m.districtId);
          if (seenHouseDistricts.has(dKey)) {
            const prevIdx = seenHouseDistricts.get(dKey);
            const prev = deduped[prevIdx];
            const prevRetired = Boolean(prev.retired);
            const curRetired = Boolean(m.retired);
            if ((prevRetired && !curRetired) || (prevRetired === curRetired && Number(m.fame || 0) > Number(prev.fame || 0))) {
              deduped[prevIdx] = m;
            }
            continue;
          }
          seenHouseDistricts.set(dKey, deduped.length);
        }
        deduped.push(m);
      }
      out.sittingMembers = deduped;

      // Sync representatives 1:1 with non-retired House sittingMembers
      const houseSitting = deduped.filter((m) => m.office === 'house' && m.districtId && !m.retired);
      if (houseSitting.length > 0 || Array.isArray(out.representatives)) {
        const existingRepByDist = new Map();
        (Array.isArray(out.representatives) ? out.representatives : []).forEach((r) => {
          if (isPlainObject(r) && r.districtId && !existingRepByDist.has(String(r.districtId))) {
            existingRepByDist.set(String(r.districtId), r);
          }
        });
        if (houseSitting.length > 0) {
          out.representatives = houseSitting.map((m) => {
            const dKey = String(m.districtId);
            const prev = existingRepByDist.get(dKey) || {};
            const pId = m.partyId || m.party || prev.partyId || 'people';
            return {
              ...prev,
              representativeId: prev.representativeId || m.id || `rep-${dKey}`,
              districtId: dKey,
              stateId: m.stateId || prev.stateId || dKey.split('-')[0],
              name: m.name || prev.name || `Rep. ${dKey}`,
              partyId: pId,
              faction: m.factionId || m.faction || prev.faction || null,
              age: Number.isFinite(Number(m.age)) ? Number(m.age) : (Number.isFinite(Number(prev.age)) ? Number(prev.age) : 48),
            };
          });
        }
      }
    }

    // 6. Repair partySystems eraNumber === currentEraNumber
    if (isPlainObject(out.partySystems)) {
      const ps = out.partySystems;
      const curNum = Number(ps.currentEraNumber);
      const eraNum = Number(ps.eraNumber);
      const resolvedEra = Number.isFinite(curNum) ? Math.trunc(curNum) : (Number.isFinite(eraNum) ? Math.trunc(eraNum) : 7);
      ps.eraNumber = resolvedEra;
      ps.currentEraNumber = resolvedEra;
    }

    out.schema = SAVE_SCHEMA_VERSION;
    return out;
  }

  // --------------------------------------------------------------------------
  // MASTER MIGRATION PIPELINE (IDEMPOTENT)
  // --------------------------------------------------------------------------
  function migrateSaveObject(raw) {
    if (!isPlainObject(raw)) return raw;
    let state = migrateV016ToV0182(raw);
    state = migrateV0182ToV0183(state);
    state = migrateV0183ToV0184(state);
    state = validateAndRepairSave(state);
    return state;
  }

  function readLegacyLocalStorageSave() {
    if (typeof localStorage === 'undefined') return null;
    for (let i = 0; i < LEGACY_STORAGE_KEYS.length; i++) {
      const key = LEGACY_STORAGE_KEYS[i];
      try {
        const rawStr = localStorage.getItem(key);
        if (!rawStr) continue;
        const parsed = JSON.parse(rawStr);
        if (isPlainObject(parsed)) {
          if (key === 'partyChairGame.save.v16.2') parsed.saveKey = key;
          return { key, parsed: migrateSaveObject(parsed) };
        }
      } catch (_) {
        // Ignore malformed legacy entry and continue fallback scan
      }
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // NON-DESTRUCTIVE EXPORT / IMPORT SAVE BACKUP (.json)
  // --------------------------------------------------------------------------
  function exportSaveToJson(game) {
    if (!isPlainObject(game)) return null;
    const clean = migrateSaveObject(game);
    const partySlug = String(clean.player?.name || 'campaign')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'campaign';
    const year = clean.year || 2028;
    const filename = `party-chair-${partySlug}-${year}-v0185.json`;
    const payload = {
      _exportFormat: 'coalition-builder-save-backup',
      schema: SAVE_SCHEMA_VERSION,
      version: clean.version || '0.18.5',
      exportedAt: clean._savedAt || deterministicTimestamp(clean),
      game: clean,
    };
    const json = JSON.stringify(payload, null, 2);
    return { filename, json, byteLength: json.length };
  }

  function triggerBrowserSaveExport(game) {
    const exp = exportSaveToJson(game);
    if (!exp || typeof document === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') return exp;
    const blob = new Blob([exp.json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exp.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch (_) {} }, 1000);
    return exp;
  }

  function importSaveFromJson(jsonText, normalizeFn = null) {
    if (typeof jsonText !== 'string' || !jsonText.trim()) {
      return { ok: false, error: 'Empty save file.' };
    }
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      return { ok: false, error: `Invalid JSON: ${err.message}` };
    }
    const candidate = (isPlainObject(parsed) && parsed._exportFormat === 'coalition-builder-save-backup' && isPlainObject(parsed.game))
      ? parsed.game
      : parsed;
    if (!isPlainObject(candidate) || (!candidate.player && !candidate.playerParty)) {
      return { ok: false, error: 'File does not contain a valid Party Chair campaign save.' };
    }
    let migrated = migrateSaveObject(candidate);
    if (typeof normalizeFn === 'function') {
      const normed = normalizeFn(migrated);
      if (isPlainObject(normed)) migrated = validateAndRepairSave(normed);
    }
    return { ok: true, game: migrated };
  }

  function renderBackupButtonsMarkup(hasGame) {
    return `
      <div class="sm-backup-bar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0 12px;padding:10px 12px;background:rgba(15,23,42,0.55);border:1px solid rgba(148,163,184,0.25);border-radius:8px;">
        <div style="flex:1;min-width:160px;font-size:12px;color:#cbd5e1;">
          <b>Save Backup &amp; Migration (Schema v${SAVE_SCHEMA_VERSION})</b><br/>
          <span style="opacity:0.8;">Export a portable JSON backup or import legacy v0.16–v0.18 saves.</span>
        </div>
        ${hasGame ? `<button type="button" class="button button-small button-gold" id="sm-export-save-btn">Export Save Backup (.json)</button>` : ''}
        <button type="button" class="button button-small" id="sm-import-save-btn">Import Save (.json)</button>
        <input type="file" id="sm-import-save-input" accept=".json,application/json" style="display:none;" />
        <div id="sm-import-status" style="width:100%;font-size:11.5px;color:#86efac;display:none;"></div>
      </div>`;
  }

  function bindBackupUiEvents(getGame, setGame, saveFn, renderFn, closeModalFn) {
    if (typeof document === 'undefined') return;
    const exportBtn = document.getElementById('sm-export-save-btn');
    if (exportBtn && !exportBtn.dataset.smBound) {
      exportBtn.dataset.smBound = '1';
      exportBtn.addEventListener('click', () => {
        const g = typeof getGame === 'function' ? getGame() : null;
        if (!g) return;
        const exp = triggerBrowserSaveExport(g);
        const st = document.getElementById('sm-import-status');
        if (st && exp) {
          st.style.display = 'block';
          st.style.color = '#86efac';
          st.textContent = `Exported ${exp.filename} (${Math.round(exp.byteLength / 1024)} KB).`;
        }
      });
    }
    const importBtn = document.getElementById('sm-import-save-btn');
    const fileInput = document.getElementById('sm-import-save-input');
    if (importBtn && fileInput && !importBtn.dataset.smBound) {
      importBtn.dataset.smBound = '1';
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (ev) => {
        const file = ev.target?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const normFn = global.PartyChairEngine?.normalizeGame || null;
          const res = importSaveFromJson(String(reader.result || ''), normFn);
          const st = document.getElementById('sm-import-status');
          if (!res.ok) {
            if (st) {
              st.style.display = 'block';
              st.style.color = '#fca5a5';
              st.textContent = res.error || 'Import failed.';
            }
            return;
          }
          if (typeof setGame === 'function') setGame(res.game);
          if (typeof saveFn === 'function') saveFn(res.game);
          if (typeof closeModalFn === 'function') closeModalFn();
          if (typeof renderFn === 'function') renderFn();
        };
        reader.readAsText(file);
      });
    }
  }

  // --------------------------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------------------------
  const API = {
    SAVE_SCHEMA_VERSION,
    LEGACY_STORAGE_KEYS,
    migrateV016ToV0182,
    migrateV0182ToV0183,
    migrateV0183ToV0184,
    validateAndRepairSave,
    migrateSaveObject,
    readLegacyLocalStorageSave,
    exportSaveToJson,
    triggerBrowserSaveExport,
    importSaveFromJson,
    renderBackupButtonsMarkup,
    bindBackupUiEvents,
  };

  if (typeof global !== 'undefined') {
    global.SaveMigrations = API;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
