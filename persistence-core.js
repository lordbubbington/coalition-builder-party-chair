/**
 * Coalition Builder: Party Chair — v0.18.5 Core Module
 * PersistenceCore: Save compaction, localStorage autosave, and IndexedDB 5-slot storage.
 * Zero-behavior-change extraction from engine.js.
 */
(function (root) {
  'use strict';

  const SAVE_KEY = 'partyChairGame.save.v18.6';
  const PREVIOUS_SAVE_KEY = 'partyChairGame.save.v18.5';
  const PREVIOUS_SAVE_KEY_V184 = 'partyChairGame.save.v18.4';
  const PREVIOUS_SAVE_KEY_V183 = 'partyChairGame.save.v18.3';
  const PREVIOUS_SAVE_KEY_V182 = 'partyChairGame.save.v18.2';
  const PREVIOUS_SAVE_KEY_V162 = 'partyChairGame.save.v16.2';
  const PREVIOUS_SAVE_KEY_V161 = 'partyChairGame.save.v16.1';
  const PREVIOUS_SAVE_KEY_V160 = 'partyChairGame.save.v16.0';
  const PREVIOUS_SAVE_KEY_V159 = 'partyChairGame.save.v15.9';
  const PREVIOUS_SAVE_KEY_V158 = 'partyChairGame.save.v15.8';
  const PREVIOUS_SAVE_KEY_V157 = 'partyChairGame.save.v15.7';
  const PREVIOUS_SAVE_KEY_V156 = 'partyChairGame.save.v15.6';
  const PREVIOUS_SAVE_KEY_V155 = 'partyChairGame.save.v15.5';
  const PREVIOUS_SAVE_KEY_V154 = 'partyChairGame.save.v15.4';
  const PREVIOUS_SAVE_KEY_V153 = 'partyChairGame.save.v15.3';
  const PREVIOUS_SAVE_KEY_V152 = 'partyChairGame.save.v15.2';
  const PREVIOUS_SAVE_KEY_V151 = 'partyChairGame.save.v15.1';
  const PREVIOUS_SAVE_KEY_V150 = 'partyChairGame.save.v15.0';
  const LEGACY_SAVE_KEY = 'partyChairGame.save.v1';

  const SAVE_IDB_NAME = 'CoalitionBuilderSavesDB';
  const SAVE_IDB_VERSION = 1;
  const SAVE_IDB_STORE = 'saveSlots';
  const SAVE_SLOT_COUNT = 5;
  const SAVE_SLOT_PREFIX = 'partyChairGame.save.slot.';

  let _storagePersistRequested = false;
  let _idbSaveQueue = Promise.resolve();

  function requestPersistentStorageOnce() {
    if (_storagePersistRequested) return;
    _storagePersistRequested = true;
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.persist === 'function') {
        navigator.storage.persist().catch(() => {});
      }
    } catch (_) {}
  }

  function compactGameForSave(game, options = {}) {
    if (!game || typeof game !== 'object') return game;
    const ultra = Boolean(options && options.ultra);
    const copy = { ...game };
    // Bug #3: Prune defeated/retired non-sitting politicians to prevent unbounded multi-MB bloat
    if (Array.isArray(copy.politicians)) {
      const sitIds = new Set((copy.sittingMembers || []).map((m) => m && m.id).filter(Boolean));
      const activeIds = new Set([
        ...(copy.candidates || []).map((c) => c && c.id),
        ...(copy.offers || []).map((o) => o && o.id),
        ...(copy.recruitedCandidates || []),
      ].filter(Boolean));
      const filtered = copy.politicians.filter((p) => {
        if (!p || sitIds.has(p.id)) return false;
        if (activeIds.has(p.id) || p.isFormerPresident) return true;
        if (p.retired || p.isRetired || p.defeated || Number(p.age || 50) >= 82) return false;
        return true;
      });
      const maxNonSitting = ultra ? 80 : 160;
      copy.politicians = filtered.length > maxNonSitting
        ? filtered.slice().sort((a, b) => Number(b.fame || 0) - Number(a.fame || 0)).slice(0, maxNonSitting)
        : filtered;
      copy._politiciansCompacted = true;
    }
    if (copy.forecasters) {
      delete copy.forecasters;
    }
    delete copy._forecastCache;
    delete copy._deferredDistricts;
    delete copy._forecastOptions;
    delete copy._forecastCacheHits;
    // Clear completed or inactive electionNight timelines (~2.5-3 MB savings)
    if (copy.electionNight && (copy.phase !== 'election-night' || copy.electionNight.completed || !copy.electionNight.active)) {
      copy.electionNight = null;
    }
    // Drop primaryResults outside Organizing (or in ultra mode)
    if ((copy.phase !== 'organizing' || ultra) && copy.primaryResults) {
      copy.primaryResults = [];
    }
    // Drop top-level presidentialResults outside active results/election-night views
    if (copy.phase !== 'complete' && copy.phase !== 'election-night' && copy.presidentialResults) {
      delete copy.presidentialResults;
    }
    const slimElectionEntry = (el, keepSummaryDetails = false) => {
      if (!el || typeof el !== 'object') return el;
      const slim = { ...el };
      delete slim.districts;
      delete slim.districtResults;
      delete slim.houseResults;
      delete slim.timeline;
      delete slim.races;
      delete slim.statewideByState;
      if (!keepSummaryDetails || ultra) {
        delete slim.states;
        delete slim.presidentialResults;
        delete slim.statewideResults;
      }
      if (slim.legislature && typeof slim.legislature === 'object') {
        slim.legislature = {
          seats: slim.legislature.seats,
          winner: slim.legislature.winner,
          totalSeats: slim.legislature.totalSeats,
          flips: slim.legislature.flips,
        };
      }
      if (slim.presidential && typeof slim.presidential === 'object' && (!keepSummaryDetails || ultra)) {
        slim.presidential = {
          winner: slim.presidential.winner,
          winnerName: slim.presidential.winnerName,
          ev: slim.presidential.ev,
          demEv: slim.presidential.demEv,
          repEv: slim.presidential.repEv,
          electoralVotes: slim.presidential.electoralVotes,
          popularVote: slim.presidential.popularVote,
          shares: slim.presidential.shares,
        };
      }
      return slim;
    };
    if (copy.lastElection && typeof copy.lastElection === 'object') {
      copy.lastElection = slimElectionEntry(copy.lastElection, copy.phase === 'complete' && !ultra);
    }
    if (Array.isArray(copy.elections) && copy.elections.length > 0) {
      const srcElections = ultra && copy.elections.length > 3 ? copy.elections.slice(-3) : copy.elections;
      copy.elections = srcElections.map((el) => slimElectionEntry(el, false));
    }
    const maxLog = ultra ? 20 : 60;
    if (Array.isArray(copy.yearLog) && copy.yearLog.length > maxLog) {
      copy.yearLog = copy.yearLog.slice(-maxLog);
    }
    // v0.16.9 (Fix #11): Compact older simulatedPrimaries (>2 cycles old) while preserving Archive UI & map colors
    if (copy.simulatedPrimaries && typeof copy.simulatedPrimaries === 'object') {
      const years = Object.keys(copy.simulatedPrimaries).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
      const keepFullYears = new Set(years.slice(-2).map(String));
      const compactedPrimaries = {};
      Object.entries(copy.simulatedPrimaries).forEach(([yr, byParty]) => {
        if (keepFullYears.has(String(yr)) || !byParty || typeof byParty !== 'object') {
          compactedPrimaries[yr] = byParty;
          return;
        }
        const slimPartyMap = {};
        Object.entries(byParty).forEach(([pid, rec]) => {
          if (!rec || typeof rec !== 'object') return;
          const slimStateResults = {};
          Object.entries(rec.stateResults || {}).forEach(([stId, sr]) => {
            slimStateResults[stId] = {
              stateId: stId,
              date: sr?.date,
              winnerId: sr?.winnerId,
              winnerName: sr?.winnerName,
              winnerColor: sr?.winnerColor,
              totalDelegates: sr?.totalDelegates,
            };
          });
          slimPartyMap[pid] = {
            partyId: rec.partyId || pid,
            year: rec.year || Number(yr),
            nomineeId: rec.nomineeId,
            nomineeName: rec.nomineeName,
            nomineeFactionId: rec.nomineeFactionId,
            clinchTarget: rec.clinchTarget,
            neutralityBonusAwarded: Boolean(rec.neutralityBonusAwarded),
            candidates: (rec.candidates || []).map((c) => ({
              id: c.id, name: c.name, factionId: c.factionId, factionName: c.factionName,
              color: c.color, delegates: c.delegates || 0, nationalPoll: c.nationalPoll || 0, droppedOut: Boolean(c.droppedOut),
            })),
            stateResults: slimStateResults,
          };
        });
        compactedPrimaries[yr] = slimPartyMap;
      });
      copy.simulatedPrimaries = compactedPrimaries;
    }
    // Cap statewideOfficesHistory to recent 6 cycles, keeping full detail for last 2 (1 in ultra) and summarizing older cycles
    const maxSwHist = ultra ? 2 : 6;
    const fullSwCycles = ultra ? 1 : 2;
    const slimSwEntry = (entry) => {
      if (!entry || typeof entry !== 'object') return entry;
      if (entry._slimmed) return entry;
      const partyTotals = {};
      const countRecord = (rec) => {
        if (!rec || typeof rec !== 'object') return;
        const p = rec.party || rec.partyId || rec.winner;
        if (p) partyTotals[p] = (partyTotals[p] || 0) + 1;
      };
      if (Array.isArray(entry)) {
        entry.forEach(countRecord);
        return { _slimmed: true, partyTotals };
      }
      Object.values(entry).forEach((val) => {
        if (Array.isArray(val)) val.forEach(countRecord);
        else if (val && typeof val === 'object') {
          if (val.party || val.partyId || val.winner) countRecord(val);
          else Object.values(val).forEach(countRecord);
        }
      });
      return { _slimmed: true, year: entry.year, partyTotals };
    };
    if (copy.statewideOfficesHistory && typeof copy.statewideOfficesHistory === 'object') {
      if (Array.isArray(copy.statewideOfficesHistory)) {
        const kept = copy.statewideOfficesHistory.slice(-maxSwHist);
        const splitIdx = Math.max(0, kept.length - fullSwCycles);
        copy.statewideOfficesHistory = kept.map((entry, idx) => (idx < splitIdx ? slimSwEntry(entry) : entry));
      } else {
        const hKeys = Object.keys(copy.statewideOfficesHistory).sort((a, b) => Number(a) - Number(b));
        const keptKeys = hKeys.slice(-maxSwHist);
        const splitIdx = Math.max(0, keptKeys.length - fullSwCycles);
        const trimmed = {};
        keptKeys.forEach((k, idx) => {
          trimmed[k] = idx < splitIdx ? slimSwEntry(copy.statewideOfficesHistory[k]) : copy.statewideOfficesHistory[k];
        });
        copy.statewideOfficesHistory = trimmed;
      }
    }
    // Prune superseded decennial House maps ('2030 map', '2040 map', etc.) while preserving activeHouseMapKey & currentHouseMap
    const activeMapKey = copy.activeHouseMapKey || '';
    Object.keys(copy).forEach((k) => {
      if (/^\d{4} map$/.test(k) && k !== activeMapKey) {
        delete copy[k];
      }
    });
    // Prune retired politicians from serialized save (elders & pastPresidents are preserved separately)
    if (Array.isArray(copy.politicians)) {
      copy.politicians = copy.politicians.filter((p) => p && !p.retired);
    }
    if (ultra && copy.simulatedPrimaries && typeof copy.simulatedPrimaries === 'object') {
      const yrs = Object.keys(copy.simulatedPrimaries).sort((a, b) => Number(a) - Number(b));
      if (yrs.length > 1) {
        const latestYr = yrs[yrs.length - 1];
        copy.simulatedPrimaries = { [latestYr]: copy.simulatedPrimaries[latestYr] };
      }
    }
    // Drop stale completed activePresidentialPrimary once outside primary phase
    if (copy.activePresidentialPrimary && copy.phase !== 'presidential-primary' && copy.activePresidentialPrimary.stage === 'complete') {
      copy.activePresidentialPrimary = null;
    }
    // #86: Trim verbose resolved campaign crises & stale mapPins
    if (copy.campaign && typeof copy.campaign === 'object') {
      const slimCamp = { ...copy.campaign };
      if (Array.isArray(slimCamp.activeCrises)) {
        slimCamp.activeCrises = slimCamp.activeCrises.filter((cr) => cr && !cr.resolved);
      }
      if (!slimCamp.active && slimCamp.rivalActivity && Array.isArray(slimCamp.rivalActivity.mapPins)) {
        slimCamp.rivalActivity = { ...slimCamp.rivalActivity, mapPins: [] };
      }
      copy.campaign = slimCamp;
    }
    // [v0.18.4 ATLAS-HOTSEAT] Preserve compact atlasHistory (capped at 40 cycles)
    const amsComp = (typeof window !== 'undefined' && window.AtlasMultiplayerSystem) || (typeof global !== 'undefined' && global.AtlasMultiplayerSystem);
    if (amsComp && typeof amsComp.compactAtlasForSave === 'function') {
      amsComp.compactAtlasForSave(copy);
    }
    // [v0.18.5 CAMPAIGN-EVENTS]
    const _cesComp = (typeof window !== 'undefined' && window.CampaignEventsSystem) || (typeof global !== 'undefined' && global.CampaignEventsSystem);
    if (_cesComp && typeof _cesComp.compactCampaignEventsForSave === 'function') {
      _cesComp.compactCampaignEventsForSave(copy);
    }

    // Developer 1 (Chunk 1.4): Prune actionLog, partyActionLog, machineAllocations, and SOEE telemetry past last 3 cycles
    const curSaveCycle = Number(copy.year || 2028);
    const minKeptCycle = curSaveCycle - 4; // Keep current cycle + prior 2 cycles (3 cycles total)
    if (Array.isArray(copy.actionLog)) {
      copy.actionLog = copy.actionLog.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
    }
    if (Array.isArray(copy.partyActionLog)) {
      copy.partyActionLog = copy.partyActionLog.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
    }
    if (copy.parties && typeof copy.parties === 'object') {
      Object.values(copy.parties).forEach((p) => {
        if (!p || typeof p !== 'object') return;
        if (Array.isArray(p.actionLog)) {
          p.actionLog = p.actionLog.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
        }
        if (Array.isArray(p.machineAllocations)) {
          p.machineAllocations = p.machineAllocations.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
        }
        if (Array.isArray(p.soeeTelemetry)) {
          p.soeeTelemetry = p.soeeTelemetry.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
        }
      });
    }
    if (Array.isArray(copy.soeeTelemetry)) {
      copy.soeeTelemetry = copy.soeeTelemetry.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
    }

    // Developer 1 (Chunk 1.4): Delete stale primaryFields outside primary phase & representatives outside complete phase
    if (copy.phase !== 'primary' && copy.phase !== 'presidential-primary' && copy.primaryFields) {
      delete copy.primaryFields;
    }
    if (copy.phase !== 'complete' && copy.representatives) {
      delete copy.representatives;
    }

    // Developer 1 (Chunk 1.4): Deduplicate currentHouseMap and decennial map duplicate
    if (activeMapKey && copy[activeMapKey] && copy.currentHouseMap) {
      delete copy[activeMapKey];
    }

    // Developer 1 (Chunk 1.4): Limit older simulatedPrimaries to last 4 presidential cycles
    if (copy.simulatedPrimaries && typeof copy.simulatedPrimaries === 'object') {
      const yrs = Object.keys(copy.simulatedPrimaries).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
      if (yrs.length > 4) {
        const keepYrs = new Set(yrs.slice(-4).map(String));
        Object.keys(copy.simulatedPrimaries).forEach((y) => {
          if (!keepYrs.has(String(y))) delete copy.simulatedPrimaries[y];
        });
      }
    }

    // Developer 1 (Chunk 1.4): Compact sittingMembers historical rosters (careerMilestones to max 5, remove historical/event logs and ratings)
    if (Array.isArray(copy.sittingMembers)) {
      copy.sittingMembers = copy.sittingMembers.map((m) => {
        if (!m || typeof m !== 'object') return m;
        const sm = { ...m };
        if (Array.isArray(sm.careerMilestones) && sm.careerMilestones.length > 5) {
          sm.careerMilestones = sm.careerMilestones.slice(-5);
        }
        delete sm.historicalLog;
        delete sm.eventLog;
        delete sm.ratings;
        return sm;
      });
    }

    return copy;
  }

  function openSavesIndexedDB() {
    return new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        resolve(null);
        return;
      }
      try {
        const req = indexedDB.open(SAVE_IDB_NAME, SAVE_IDB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(SAVE_IDB_STORE)) {
            db.createObjectStore(SAVE_IDB_STORE, { keyPath: 'slot' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async function saveAutosaveToIndexedDB(compactedGame) {
    if (!compactedGame) return false;
    requestPersistentStorageOnce();
    const db = await openSavesIndexedDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readwrite');
        tx.objectStore(SAVE_IDB_STORE).put({
          slot: 0,
          label: 'Autosave',
          savedAt: new Date().toISOString(),
          game: compactedGame,
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  }

  function saveGame(game) {
    try {
      const stamped = { ...game, _savedAt: Date.now() };
      const compacted = compactGameForSave(stamped);
      // Bug #1: Serialize IndexedDB writes via queue so rapid saves never race
      _idbSaveQueue = _idbSaveQueue
        .then(() => saveAutosaveToIndexedDB(compacted))
        .catch(() => {});
      const jsonStr = JSON.stringify(compacted);
      if (jsonStr.length <= 4_300_000) {
        try {
          localStorage.setItem(SAVE_KEY, jsonStr);
          if (typeof window !== 'undefined') window.__saveQuotaError = false;
        } catch (_) {
          try { localStorage.removeItem(SAVE_KEY); } catch (__) {}
          if (typeof window !== 'undefined') window.__saveQuotaError = true;
        }
      } else {
        // Clear stale localStorage snapshot so loadGameAsync never reverts to an older year
        try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
        if (typeof window !== 'undefined') window.__saveQuotaError = false;
      }
      if (game && Number.isFinite(Number(game._activeSaveSlot)) && typeof saveToSlotAsync === 'function') {
        saveToSlotAsync(Number(game._activeSaveSlot), stamped).catch(() => {});
      }
    } catch { /* storage may be unavailable */ }
  }

  function loadGame(deps = {}) {
    try {
      const value = localStorage.getItem(SAVE_KEY)
        || localStorage.getItem(PREVIOUS_SAVE_KEY)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V184)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V183)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V182)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V162)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V161)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V160)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V159)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V158)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V157)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V156)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V155)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V154)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V153)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V152)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V151)
        || localStorage.getItem(PREVIOUS_SAVE_KEY_V150)
        || localStorage.getItem('partyChairGame.save.v14.6')
        || localStorage.getItem('partyChairGame.save.v14.5')
        || localStorage.getItem('partyChairGame.save.v14.4')
        || localStorage.getItem('partyChairGame.save.v14.3')
        || localStorage.getItem('partyChairGame.save.v14.2')
        || localStorage.getItem('partyChairGame.save.v14.1')
        || localStorage.getItem('partyChairGame.save.v14')
        || localStorage.getItem('partyChairGame.save.v13')
        || localStorage.getItem('partyChairGame.save.v12')
        || localStorage.getItem('partyChairGame.save.v11')
        || localStorage.getItem('partyChairGame.save.v10')
        || localStorage.getItem('partyChairGame.save.v9')
        || localStorage.getItem('partyChairGame.save.v8')
        || localStorage.getItem('partyChairGame.save.v7')
        || localStorage.getItem('partyChairGame.save.v6')
        || localStorage.getItem('partyChairGame.save.v5')
        || localStorage.getItem('partyChairGame.save.v4')
        || localStorage.getItem('partyChairGame.save.v3')
        || localStorage.getItem('partyChairGame.save.v2')
        || localStorage.getItem(LEGACY_SAVE_KEY);
      if (!value) return null;
      const parsed = JSON.parse(value);
      if (typeof deps.migrateSave === 'function') return deps.migrateSave(parsed);
      if (typeof deps.normalizeGame === 'function') return deps.normalizeGame(parsed);
      return parsed;
    } catch { return null; }
  }

  async function loadGameAsync(deps = {}) {
    try { await _idbSaveQueue; } catch (_) {}
    const lsGame = loadGame(deps);
    const db = await openSavesIndexedDB();
    if (!db) return lsGame;
    const normalizeFn = deps.normalizeGame || ((x) => x);
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readonly');
        const req = tx.objectStore(SAVE_IDB_STORE).get(0);
        req.onsuccess = () => {
          const rec = req.result;
          if (rec && rec.game) {
            const idbGame = normalizeFn(rec.game);
            if (idbGame) {
              const idbYr = Number(idbGame.year || 0);
              const lsYr = Number(lsGame?.year || 0);
              const idbTs = Number(idbGame._savedAt || rec.savedAt || 0);
              const lsTs = Number(lsGame?._savedAt || 0);
              // Bug #1: Prefer IndexedDB whenever newer year OR equal year with newer/equal timestamp
              if (!lsGame || idbYr > lsYr || (idbYr === lsYr && idbTs >= lsTs)) {
                resolve(idbGame);
                return;
              }
            }
          }
          resolve(lsGame);
        };
        req.onerror = () => resolve(lsGame);
      } catch (_) {
        resolve(lsGame);
      }
    });
  }

  function saveSlotKey(slotNum) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    return `${SAVE_SLOT_PREFIX}${n}`;
  }

  function listSaveSlots() {
    const slots = [];
    for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
      let raw = null;
      try { raw = localStorage.getItem(saveSlotKey(i)); } catch (_) {}
      if (!raw) {
        slots.push({ slot: i, empty: true });
        continue;
      }
      try {
        const parsed = JSON.parse(raw);
        const meta = parsed._slotMeta || {};
        const g = parsed.game || parsed;
        slots.push({
          slot: i,
          empty: false,
          label: meta.label || g.player?.name || `Slot ${i}`,
          partyName: g.player?.name || 'Party',
          partyColor: g.player?.color || '#3478c8',
          year: g.year || 2028,
          phase: g.phase || 'organizing',
          savedAt: meta.savedAt || null,
          version: g.version || '0.17.0',
        });
      } catch (_) {
        slots.push({ slot: i, empty: true, corrupted: true });
      }
    }
    return slots;
  }

  async function listSaveSlotsAsync() {
    const db = await openSavesIndexedDB();
    if (!db) return listSaveSlots();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readonly');
        const req = tx.objectStore(SAVE_IDB_STORE).getAll();
        req.onsuccess = () => {
          const bySlot = new Map((req.result || []).map((r) => [Number(r.slot), r]));
          const fallback = listSaveSlots();
          const out = [];
          for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
            const rec = bySlot.get(i);
            if (rec && rec.game) {
              const g = rec.game;
              out.push({
                slot: i,
                empty: false,
                label: rec.label || g.player?.name || `Slot ${i}`,
                partyName: g.player?.name || 'Party',
                partyColor: g.player?.color || '#3478c8',
                year: g.year || 2028,
                phase: g.phase || 'organizing',
                savedAt: rec.savedAt || null,
                version: g.version || '0.17.0',
                storage: 'IndexedDB',
              });
            } else {
              out.push(fallback[i - 1] || { slot: i, empty: true });
            }
          }
          resolve(out);
        };
        req.onerror = () => resolve(listSaveSlots());
      } catch (_) {
        resolve(listSaveSlots());
      }
    });
  }

  function saveToSlot(slotNum, game, label = '') {
    if (!game) return false;
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const payload = {
      _slotMeta: {
        slot: n,
        label: (label || game.player?.name || `Slot ${n}`).trim(),
        savedAt: new Date().toISOString(),
      },
      game: compactGameForSave(game),
    };
    try {
      localStorage.setItem(saveSlotKey(n), JSON.stringify(payload));
      saveGame(game);
      return true;
    } catch (_) {
      try {
        const ultraPayload = { ...payload, game: compactGameForSave(game, { ultra: true }) };
        localStorage.setItem(saveSlotKey(n), JSON.stringify(ultraPayload));
        saveGame(game);
        return true;
      } catch (__) {
        return false;
      }
    }
  }

  async function saveToSlotAsync(slotNum, game, label = '') {
    if (!game) return false;
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const compact = compactGameForSave(game);
    game._activeSaveSlot = n;
    compact._activeSaveSlot = n;
    const record = {
      slot: n,
      label: (label || game.player?.name || `Slot ${n}`).trim(),
      savedAt: new Date().toISOString(),
      game: compact,
    };
    const db = await openSavesIndexedDB();
    if (!db) return saveToSlot(n, compact, label);
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readwrite');
        tx.objectStore(SAVE_IDB_STORE).put(record);
        tx.oncomplete = () => {
          try { saveGame(compact); } catch (_) {}
          resolve(true);
        };
        tx.onerror = () => resolve(saveToSlot(n, compact, label));
      } catch (_) {
        resolve(saveToSlot(n, compact, label));
      }
    });
  }

  function loadFromSlot(slotNum, deps = {}) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const normalizeFn = deps.normalizeGame || ((x) => x);
    try {
      const raw = localStorage.getItem(saveSlotKey(n));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const loaded = normalizeFn(parsed.game || parsed);
      if (loaded) saveGame(loaded);
      return loaded;
    } catch (_) {
      return null;
    }
  }

  async function loadFromSlotAsync(slotNum, deps = {}) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const db = await openSavesIndexedDB();
    if (!db) return loadFromSlot(n, deps);
    const normalizeFn = deps.normalizeGame || ((x) => x);
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readonly');
        const req = tx.objectStore(SAVE_IDB_STORE).get(n);
        req.onsuccess = () => {
          const rec = req.result;
          if (rec && rec.game) {
            const loaded = normalizeFn(rec.game);
            if (loaded) loaded._activeSaveSlot = n;
            resolve(loaded);
          } else {
            resolve(loadFromSlot(n, deps));
          }
        };
        req.onerror = () => resolve(loadFromSlot(n, deps));
      } catch (_) {
        resolve(loadFromSlot(n, deps));
      }
    });
  }

  function deleteSaveSlot(slotNum) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    try {
      localStorage.removeItem(saveSlotKey(n));
      return true;
    } catch (_) {
      return false;
    }
  }

  async function deleteSaveSlotAsync(slotNum) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    deleteSaveSlot(n);
    const db = await openSavesIndexedDB();
    if (!db) return true;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readwrite');
        tx.objectStore(SAVE_IDB_STORE).delete(n);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(true);
      } catch (_) {
        resolve(true);
      }
    });
  }

  const PersistenceCore = {
    SAVE_KEY,
    SAVE_IDB_NAME,
    SAVE_IDB_VERSION,
    SAVE_IDB_STORE,
    SAVE_SLOT_COUNT,
    SAVE_SLOT_PREFIX,
    requestPersistentStorageOnce,
    compactGameForSave,
    openSavesIndexedDB,
    saveAutosaveToIndexedDB,
    saveGame,
    loadGame,
    loadGameAsync,
    saveSlotKey,
    listSaveSlots,
    listSaveSlotsAsync,
    saveToSlot,
    saveToSlotAsync,
    loadFromSlot,
    loadFromSlotAsync,
    deleteSaveSlot,
    deleteSaveSlotAsync,
  };

  if (typeof window !== 'undefined') window.PersistenceCore = PersistenceCore;
  if (typeof root !== 'undefined' && root) root.PersistenceCore = PersistenceCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = PersistenceCore;
})(typeof globalThis !== 'undefined' ? globalThis : this);
