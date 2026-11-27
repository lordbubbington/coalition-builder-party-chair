/**
 * Coalition Builder: Party Chair — Core Persistence Module
 * PersistenceCore: 100 MB IndexedDB v2 + Transparent Gzip Compression + Lazy Compaction
 * Stores Autosave (slot 0) and 5 Manual Slots (slots 1..5) in IndexedDB, keeping localStorage < 1 KB.
 */
(function (root) {
  'use strict';

  const SAVE_KEY = 'partyChairGame.save.v19.0';
  const PREVIOUS_SAVE_KEY_V1911 = 'partyChairGame.save.v19.1.1';
  const PREVIOUS_SAVE_KEY_V1894 = 'partyChairGame.save.v18.9.4';
  const PREVIOUS_SAVE_KEY = 'partyChairGame.save.v18.9.1';
  const PREVIOUS_SAVE_KEY_V188 = 'partyChairGame.save.v18.8';
  const PREVIOUS_SAVE_KEY_V187 = 'partyChairGame.save.v18.7';
  const PREVIOUS_SAVE_KEY_V186 = 'partyChairGame.save.v18.6';
  const PREVIOUS_SAVE_KEY_V185 = 'partyChairGame.save.v18.5';
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

  const ALL_AUTOSAVE_KEYS = [
    SAVE_KEY,
    PREVIOUS_SAVE_KEY_V1911,
    'partyChairGame.save.v19.0',
    PREVIOUS_SAVE_KEY_V1894,
    PREVIOUS_SAVE_KEY,
    PREVIOUS_SAVE_KEY_V188,
    PREVIOUS_SAVE_KEY_V187,
    PREVIOUS_SAVE_KEY_V186,
    PREVIOUS_SAVE_KEY_V185,
    PREVIOUS_SAVE_KEY_V184,
    PREVIOUS_SAVE_KEY_V183,
    PREVIOUS_SAVE_KEY_V182,
    PREVIOUS_SAVE_KEY_V162,
    PREVIOUS_SAVE_KEY_V161,
    PREVIOUS_SAVE_KEY_V160,
    PREVIOUS_SAVE_KEY_V159,
    PREVIOUS_SAVE_KEY_V158,
    PREVIOUS_SAVE_KEY_V157,
    PREVIOUS_SAVE_KEY_V156,
    PREVIOUS_SAVE_KEY_V155,
    PREVIOUS_SAVE_KEY_V154,
    PREVIOUS_SAVE_KEY_V153,
    PREVIOUS_SAVE_KEY_V152,
    PREVIOUS_SAVE_KEY_V151,
    PREVIOUS_SAVE_KEY_V150,
    'partyChairGame.save.v14.6',
    'partyChairGame.save.v14.5',
    'partyChairGame.save.v14.4',
    'partyChairGame.save.v14.3',
    'partyChairGame.save.v14.2',
    'partyChairGame.save.v14.1',
    'partyChairGame.save.v14',
    'partyChairGame.save.v13',
    'partyChairGame.save.v12',
    'partyChairGame.save.v11',
    'partyChairGame.save.v10',
    'partyChairGame.save.v9',
    'partyChairGame.save.v8',
    'partyChairGame.save.v7',
    'partyChairGame.save.v6',
    'partyChairGame.save.v5',
    'partyChairGame.save.v4',
    'partyChairGame.save.v3',
    'partyChairGame.save.v2',
    LEGACY_SAVE_KEY,
  ].filter((k, idx, arr) => arr.indexOf(k) === idx);

  const SAVE_IDB_NAME = 'CoalitionBuilderSavesDB';
  const SAVE_IDB_VERSION = 2;
  const SAVE_IDB_STORE = 'saveSlots';
  const SAVE_SLOT_COUNT = 5;
  const SAVE_SLOT_PREFIX = 'partyChairGame.save.slot.';

  const MAX_SAVE_RAW_BYTES = 100 * 1024 * 1024; // 100 MB uncompressed ceiling
  const WARN_SAVE_RAW_BYTES = 80 * 1024 * 1024; // 80 MB warning threshold
  const AUTOSAVE_DEBOUNCE_MS = 250;

  let _storagePersistRequested = false;
  let _idbSaveQueue = Promise.resolve();
  let _pendingAutosave = null;
  let _autosaveDebounceTimer = null;
  let _lastAutosaveFlushAt = 0;
  let _pendingWaiters = [];
  let _lastSaveStatus = {
    ok: true,
    backend: 'idb-v2',
    encoding: null,
    rawBytes: 0,
    compressedBytes: 0,
    sizeWarning: false,
    limitExceeded: false,
    error: null,
    savedAt: null,
  };

  function getGlobalScope() {
    if (typeof window !== 'undefined') return window;
    if (typeof globalThis !== 'undefined') return globalThis;
    return root || {};
  }

  function encodeUtf8(str) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str);
    }
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(str, 'utf8'));
    }
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i) & 0xff;
    return arr;
  }

  function decodeUtf8(bytes) {
    const u8 = toUint8Array(bytes);
    if (!u8) return '';
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder().decode(u8);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength).toString('utf8');
    }
    let out = '';
    for (let i = 0; i < u8.length; i++) out += String.fromCharCode(u8[i]);
    return out;
  }

  function toUint8Array(input) {
    if (!input) return null;
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    if (Array.isArray(input)) return new Uint8Array(input);
    return null;
  }

  function isCompressionStreamAvailable() {
    const g = getGlobalScope();
    const CS = typeof CompressionStream !== 'undefined' ? CompressionStream : g.CompressionStream;
    const DS = typeof DecompressionStream !== 'undefined' ? DecompressionStream : g.DecompressionStream;
    return typeof CS === 'function' && typeof DS === 'function';
  }

  async function runStreamTransform(transformStream, inputBytes) {
    const u8 = toUint8Array(inputBytes);
    const readPromise = (async () => {
      const reader = transformStream.readable.getReader();
      const chunks = [];
      let total = 0;
      while (true) {
        const step = await reader.read();
        if (step.done) break;
        const part = toUint8Array(step.value);
        if (part && part.byteLength > 0) {
          chunks.push(part);
          total += part.byteLength;
        }
      }
      const out = new Uint8Array(total);
      let offset = 0;
      for (let i = 0; i < chunks.length; i++) {
        out.set(chunks[i], offset);
        offset += chunks[i].byteLength;
      }
      return out;
    })();
    const writePromise = (async () => {
      const writer = transformStream.writable.getWriter();
      if (u8 && u8.byteLength > 0) {
        await writer.write(u8);
      }
      await writer.close();
    })();
    const [out] = await Promise.all([readPromise, writePromise]);
    return out;
  }

  async function gzipCompressBytes(inputBytes) {
    const g = getGlobalScope();
    const CS = typeof CompressionStream !== 'undefined' ? CompressionStream : g.CompressionStream;
    if (typeof CS !== 'function') {
      throw new Error('CompressionStream is unavailable');
    }
    return runStreamTransform(new CS('gzip'), inputBytes);
  }

  async function gzipDecompressBytes(inputBytes) {
    const g = getGlobalScope();
    const DS = typeof DecompressionStream !== 'undefined' ? DecompressionStream : g.DecompressionStream;
    if (typeof DS !== 'function') {
      throw new Error('DecompressionStream is unavailable');
    }
    return runStreamTransform(new DS('gzip'), inputBytes);
  }

  function requestPersistentStorageOnce() {
    if (_storagePersistRequested) return;
    _storagePersistRequested = true;
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.persist === 'function') {
        navigator.storage.persist().catch(() => {});
      }
    } catch (_) {}
  }

  async function getStorageEstimateAsync() {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.estimate === 'function') {
        const est = await navigator.storage.estimate();
        return {
          supported: true,
          usage: Number.isFinite(Number(est?.usage)) ? Number(est.usage) : 0,
          quota: Number.isFinite(Number(est?.quota)) ? Number(est.quota) : null,
        };
      }
    } catch (_) {}
    return { supported: false, usage: null, quota: null };
  }

  function emergencyPruneGameForSave(copy, ultra = false) {
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
    if ((copy.phase !== 'organizing' || ultra) && copy.primaryResults) {
      copy.primaryResults = [];
    }
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
    const activeMapKey = copy.activeHouseMapKey || '';
    Object.keys(copy).forEach((k) => {
      if (/^\d{4} map$/.test(k) && k !== activeMapKey) {
        delete copy[k];
      }
    });
    if (ultra && copy.simulatedPrimaries && typeof copy.simulatedPrimaries === 'object') {
      const yrs = Object.keys(copy.simulatedPrimaries).sort((a, b) => Number(a) - Number(b));
      if (yrs.length > 1) {
        const latestYr = yrs[yrs.length - 1];
        copy.simulatedPrimaries = { [latestYr]: copy.simulatedPrimaries[latestYr] };
      }
    }
    if (copy.activePresidentialPrimary && copy.phase !== 'presidential-primary' && copy.activePresidentialPrimary.stage === 'complete') {
      copy.activePresidentialPrimary = null;
    }
    const curSaveCycle = Number(copy.year || 2028);
    const minKeptCycle = curSaveCycle - 4;
    if (Array.isArray(copy.actionLog)) {
      copy.actionLog = copy.actionLog.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
    }
    if (Array.isArray(copy.partyActionLog)) {
      copy.partyActionLog = copy.partyActionLog.filter((entry) => !entry || entry.cycle === undefined || Number(entry.cycle || entry.year || 0) >= minKeptCycle);
    }
    if (copy.phase !== 'primary' && copy.phase !== 'presidential-primary' && copy.primaryFields) {
      delete copy.primaryFields;
    }
    if (copy.phase !== 'complete' && copy.representatives) {
      delete copy.representatives;
    }
    if (activeMapKey && copy[activeMapKey] && copy.currentHouseMap) {
      delete copy[activeMapKey];
    }
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

  /**
   * Normal saves ONLY strip ephemeral runtime caches so 7,500+ state legislative
   * politicians, full election archives, and multi-decade logs persist intact.
   * Emergency pruning activates only if options.emergency / options.ultra is requested
   * (or when raw JSON exceeds MAX_SAVE_RAW_BYTES = 100 MB).
   */
  function compactGameForSave(game, options = {}) {
    if (!game || typeof game !== 'object') return game;
    const ultra = Boolean(options && options.ultra);
    const emergency = Boolean(options && options.emergency);
    const copy = { ...game };

    // Always strip ephemeral runtime caches
    if (copy.forecasters) {
      delete copy.forecasters;
    }
    delete copy._forecastCache;
    delete copy._deferredDistricts;
    delete copy._forecastOptions;
    delete copy._forecastCacheHits;

    // Clear completed or inactive electionNight frame timelines
    if (copy.electionNight && (copy.phase !== 'election-night' || copy.electionNight.completed || !copy.electionNight.active)) {
      copy.electionNight = null;
    }

    if (emergency || ultra) {
      return emergencyPruneGameForSave(copy, ultra);
    }
    return copy;
  }

  function updateGlobalSaveStatus(nextStatus) {
    _lastSaveStatus = { ..._lastSaveStatus, ...nextStatus };
    const g = getGlobalScope();
    if (g && typeof g === 'object') {
      g.__saveQuotaError = Boolean(!_lastSaveStatus.ok && _lastSaveStatus.error === 'SAVE_SIZE_LIMIT_EXCEEDED');
      g.__saveSizeWarning = _lastSaveStatus.sizeWarning
        ? {
            rawBytes: _lastSaveStatus.rawBytes,
            warnBytes: WARN_SAVE_RAW_BYTES,
            maxBytes: MAX_SAVE_RAW_BYTES,
          }
        : null;
      g.__saveSizeLimitExceeded = Boolean(_lastSaveStatus.limitExceeded);
    }
    return _lastSaveStatus;
  }

  function getLastSaveStatus() {
    return { ..._lastSaveStatus };
  }

  async function encodeGameRecordPayload(game, options = {}) {
    if (!game || typeof game !== 'object') {
      return { ok: false, error: 'INVALID_GAME', rawBytes: 0, compressedBytes: 0, sizeWarning: false };
    }
    let compacted = compactGameForSave(game, options);
    let jsonStr = JSON.stringify(compacted);
    let utf8Bytes = encodeUtf8(jsonStr);
    let rawBytes = utf8Bytes.byteLength;

    if (rawBytes > MAX_SAVE_RAW_BYTES && !options.emergency && !options.ultra) {
      compacted = compactGameForSave(game, { ...options, emergency: true });
      jsonStr = JSON.stringify(compacted);
      utf8Bytes = encodeUtf8(jsonStr);
      rawBytes = utf8Bytes.byteLength;
    }

    const sizeWarning = rawBytes >= WARN_SAVE_RAW_BYTES;
    if (rawBytes > MAX_SAVE_RAW_BYTES) {
      updateGlobalSaveStatus({
        ok: false,
        rawBytes,
        compressedBytes: 0,
        sizeWarning: true,
        limitExceeded: true,
        error: 'SAVE_SIZE_LIMIT_EXCEEDED',
      });
      return {
        ok: false,
        error: 'SAVE_SIZE_LIMIT_EXCEEDED',
        rawBytes,
        compressedBytes: 0,
        maxBytes: MAX_SAVE_RAW_BYTES,
        warnBytes: WARN_SAVE_RAW_BYTES,
        sizeWarning: true,
      };
    }

    let encoding = 'json';
    let payload = null;
    let data = jsonStr;
    let compressedBytes = rawBytes;

    if (!options.forceUncompressed && isCompressionStreamAvailable()) {
      try {
        const gzBytes = await gzipCompressBytes(utf8Bytes);
        encoding = 'gzip-json';
        payload = gzBytes;
        data = null;
        compressedBytes = gzBytes.byteLength;
      } catch (_) {
        encoding = 'json';
        payload = null;
        data = jsonStr;
        compressedBytes = rawBytes;
      }
    }

    const savedAt = new Date().toISOString();
    updateGlobalSaveStatus({
      ok: true,
      backend: 'idb-v2',
      encoding,
      rawBytes,
      compressedBytes,
      sizeWarning,
      limitExceeded: false,
      error: null,
      savedAt,
    });

    return {
      ok: true,
      compacted,
      encoding,
      payload,
      data,
      rawBytes,
      compressedBytes,
      sizeWarning,
      savedAt,
    };
  }

  async function buildIndexedDBSlotRecord(slotNum, game, label = '', options = {}) {
    const encoded = await encodeGameRecordPayload(game, options);
    if (!encoded.ok) return encoded;
    const g = encoded.compacted;
    const rec = {
      slot: slotNum,
      label: slotNum === 0 ? 'Autosave' : (label || g.player?.name || `Slot ${slotNum}`).trim(),
      savedAt: encoded.savedAt,
      timestamp: Number(g._savedAt || Date.now()),
      version: g.version || '0.19.0',
      year: g.year || 2028,
      phase: g.phase || 'organizing',
      partyName: g.player?.name || 'Party',
      partyColor: g.player?.color || '#3478c8',
      encoding: encoded.encoding,
      rawBytes: encoded.rawBytes,
      compressedBytes: encoded.compressedBytes,
    };
    if (encoded.encoding === 'gzip-json') {
      rec.payload = encoded.payload;
    } else {
      rec.data = encoded.data;
    }
    return { ok: true, record: rec, compacted: g, sizeWarning: encoded.sizeWarning };
  }

  async function decodeSlotRecord(rec) {
    if (!rec || typeof rec !== 'object') return null;
    try {
      if (rec.encoding === 'gzip-json') {
        const rawInput = rec.payload || rec.data;
        const u8 = toUint8Array(rawInput);
        if (!u8 || u8.byteLength === 0) return null;
        const decompressed = await gzipDecompressBytes(u8);
        return JSON.parse(decodeUtf8(decompressed));
      }
      if (rec.encoding === 'json') {
        if (typeof rec.data === 'string') return JSON.parse(rec.data);
        const u8 = toUint8Array(rec.payload || rec.data);
        if (u8) return JSON.parse(decodeUtf8(u8));
      }
      if (rec.game) {
        if (typeof rec.game === 'string') return JSON.parse(rec.game);
        if (typeof rec.game === 'object') return rec.game;
      }
    } catch (_) {
      return null;
    }
    return null;
  }

  function writeLocalMetaPointer(game, slotNum = 0) {
    if (typeof localStorage === 'undefined' || !game || typeof game !== 'object') return;
    try {
      const pointer = {
        _metaPointer: true,
        backend: 'idb-v2',
        activeSlot: Number.isFinite(Number(game._activeSaveSlot)) ? Number(game._activeSaveSlot) : slotNum,
        slot: slotNum,
        version: game.version || '0.19.0',
        year: game.year || 2028,
        partyName: game.player?.name || 'Party',
        savedAt: Number(game._savedAt || Date.now()),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(pointer));
    } catch (_) {}
  }

  function isMetaPointerObject(parsed) {
    return Boolean(parsed && typeof parsed === 'object' && parsed._metaPointer === true && parsed.backend === 'idb-v2');
  }

  function readLegacyAutosaveDetailsFromLocalStorage(deps = {}) {
    if (typeof localStorage === 'undefined') return { game: null, keysFound: [] };
    const keysFound = [];
    let bestGame = null;
    for (let i = 0; i < ALL_AUTOSAVE_KEYS.length; i++) {
      const key = ALL_AUTOSAVE_KEYS[i];
      let raw = null;
      try { raw = localStorage.getItem(key); } catch (_) { raw = null; }
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (isMetaPointerObject(parsed)) continue;
        keysFound.push(key);
        if (!bestGame) {
          if (typeof deps.migrateSave === 'function') bestGame = deps.migrateSave(parsed);
          else if (typeof deps.normalizeGame === 'function') bestGame = deps.normalizeGame(parsed);
          else bestGame = parsed;
        }
      } catch (_) {
        keysFound.push(key);
      }
    }
    return { game: bestGame, keysFound };
  }

  function clearLocalStorageKeys(keys) {
    if (typeof localStorage === 'undefined' || !Array.isArray(keys)) return;
    for (let i = 0; i < keys.length; i++) {
      try { localStorage.removeItem(keys[i]); } catch (_) {}
    }
  }

  function openSavesIndexedDB() {
    return new Promise((resolve) => {
      const g = getGlobalScope();
      const idb = typeof indexedDB !== 'undefined' ? indexedDB : g.indexedDB;
      if (!idb) {
        resolve(null);
        return;
      }
      try {
        const req = idb.open(SAVE_IDB_NAME, SAVE_IDB_VERSION);
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

  function putRecordInIndexedDB(db, record) {
    if (!db || !record) return Promise.resolve(false);
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readwrite');
        tx.objectStore(SAVE_IDB_STORE).put(record);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  }

  function getRecordFromIndexedDB(db, slotNum) {
    if (!db) return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(SAVE_IDB_STORE, 'readonly');
        const req = tx.objectStore(SAVE_IDB_STORE).get(slotNum);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async function saveAutosaveToIndexedDB(compactedOrGame) {
    if (!compactedOrGame) return false;
    requestPersistentStorageOnce();
    const db = await openSavesIndexedDB();
    if (!db) return false;
    const built = await buildIndexedDBSlotRecord(0, compactedOrGame, 'Autosave');
    if (!built.ok) return false;
    const ok = await putRecordInIndexedDB(db, built.record);
    if (ok) {
      writeLocalMetaPointer(built.compacted, 0);
    }
    return ok;
  }

  function flushPendingAutosaveNow() {
    if (_autosaveDebounceTimer) {
      clearTimeout(_autosaveDebounceTimer);
      _autosaveDebounceTimer = null;
    }
    const pending = _pendingAutosave;
    _pendingAutosave = null;
    if (!pending) return _idbSaveQueue;
    _lastAutosaveFlushAt = Date.now();

    const task = async () => {
      const ok = await saveAutosaveToIndexedDB(pending.game);
      if (pending.activeSlot !== null && Number.isFinite(pending.activeSlot)) {
        const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(pending.activeSlot)));
        const db = await openSavesIndexedDB();
        if (db) {
          const built = await buildIndexedDBSlotRecord(n, pending.game);
          if (built.ok) await putRecordInIndexedDB(db, built.record);
        }
      }
      return ok;
    };

    _idbSaveQueue = _idbSaveQueue.then(task).catch(() => false);
    const waiters = _pendingWaiters;
    _pendingWaiters = [];
    _idbSaveQueue.then((res) => {
      waiters.forEach((fn) => { try { fn(res); } catch (_) {} });
    });
    return _idbSaveQueue;
  }

  async function flushPendingSaves() {
    await flushPendingAutosaveNow();
    try { await _idbSaveQueue; } catch (_) {}
    return getLastSaveStatus();
  }

  function hasIndexedDBSupport() {
    const g = getGlobalScope();
    const idb = typeof indexedDB !== 'undefined' ? indexedDB : g.indexedDB;
    return Boolean(idb && typeof idb.open === 'function');
  }

  function saveGame(game, options = {}) {
    if (!game || typeof game !== 'object') return;
    try {
      const stamped = { ...game, _savedAt: Number(game._savedAt || Date.now()) };
      const activeSlot = Number.isFinite(Number(stamped._activeSaveSlot))
        ? Number(stamped._activeSaveSlot)
        : null;

      if (!hasIndexedDBSupport()) {
        // Environment without IndexedDB (e.g. headless Node localStorage-only harnesses):
        // keep synchronous localStorage fallback so loadGame() continues to work.
        try {
          if (typeof localStorage !== 'undefined') {
            const compacted = compactGameForSave(stamped);
            const rawJson = JSON.stringify(compacted);
            if (encodeUtf8(rawJson).byteLength <= 4_300_000) {
              localStorage.setItem(SAVE_KEY, rawJson);
            }
          }
        } catch (_) {}
        return;
      }

      // IndexedDB-first mode: never write full game JSON into localStorage; only store a tiny <1 KB pointer
      writeLocalMetaPointer(stamped, activeSlot || 0);

      _pendingAutosave = { game: stamped, activeSlot };
      const now = Date.now();
      if (options.immediate || (!_autosaveDebounceTimer && (now - _lastAutosaveFlushAt) >= AUTOSAVE_DEBOUNCE_MS)) {
        flushPendingAutosaveNow();
        return;
      }
      if (_autosaveDebounceTimer) {
        clearTimeout(_autosaveDebounceTimer);
      }
      _autosaveDebounceTimer = setTimeout(() => {
        flushPendingAutosaveNow();
      }, AUTOSAVE_DEBOUNCE_MS);
      if (_autosaveDebounceTimer && typeof _autosaveDebounceTimer.unref === 'function') {
        _autosaveDebounceTimer.unref();
      }
    } catch (_) { /* storage may be unavailable */ }
  }

  function loadGame(deps = {}) {
    try {
      const { game } = readLegacyAutosaveDetailsFromLocalStorage(deps);
      return game || null;
    } catch (_) {
      return null;
    }
  }

  async function loadGameAsync(deps = {}) {
    await flushPendingSaves();
    const { game: lsGame, keysFound } = readLegacyAutosaveDetailsFromLocalStorage(deps);
    const db = await openSavesIndexedDB();
    if (!db) return lsGame;

    const normalizeFn = deps.normalizeGame || ((x) => x);
    const migrateFn = deps.migrateSave || normalizeFn;

    const rec = await getRecordFromIndexedDB(db, 0);
    let idbGame = null;
    let idbRaw = null;
    if (rec) {
      idbRaw = await decodeSlotRecord(rec);
      if (idbRaw) {
        idbGame = migrateFn(idbRaw);
      }
    }

    const idbYr = Number(idbGame?.year || 0);
    const lsYr = Number(lsGame?.year || 0);
    const idbTs = Number(idbGame?._savedAt || rec?.timestamp || (rec?.savedAt ? Date.parse(rec.savedAt) : 0) || 0);
    const lsTs = Number(lsGame?._savedAt || 0);

    const idbIsNewerOrEqual = Boolean(idbGame && (!lsGame || idbYr > lsYr || (idbYr === lsYr && idbTs >= lsTs)));
    const chosen = idbIsNewerOrEqual ? idbGame : lsGame;

    if (!chosen) return null;

    // One-time migration: commit legacy localStorage save (or uncompressed IDB v1 record) into IDB v2,
    // and clear bloated legacy localStorage keys ONLY after IndexedDB commits.
    const needsIdbCommit = !idbIsNewerOrEqual
      || !rec
      || (rec.encoding !== 'gzip-json' && isCompressionStreamAvailable());

    if (needsIdbCommit) {
      const built = await buildIndexedDBSlotRecord(0, chosen, 'Autosave');
      if (built.ok) {
        const committed = await putRecordInIndexedDB(db, built.record);
        if (committed) {
          clearLocalStorageKeys(keysFound);
          writeLocalMetaPointer(chosen, 0);
        }
      }
    } else if (keysFound.length > 0) {
      clearLocalStorageKeys(keysFound);
      writeLocalMetaPointer(chosen, 0);
    }

    return chosen;
  }

  function saveSlotKey(slotNum) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    return `${SAVE_SLOT_PREFIX}${n}`;
  }

  function listSaveSlots() {
    const slots = [];
    for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
      let raw = null;
      try { raw = typeof localStorage !== 'undefined' ? localStorage.getItem(saveSlotKey(i)) : null; } catch (_) {}
      if (!raw) {
        slots.push({ slot: i, empty: true });
        continue;
      }
      try {
        const parsed = JSON.parse(raw);
        const meta = parsed._slotMeta || {};
        const g = parsed.game || parsed;
        const rawBytes = encodeUtf8(raw).byteLength;
        slots.push({
          slot: i,
          empty: false,
          label: meta.label || g.player?.name || `Slot ${i}`,
          partyName: g.player?.name || 'Party',
          partyColor: g.player?.color || '#3478c8',
          year: g.year || 2028,
          phase: g.phase || 'organizing',
          savedAt: meta.savedAt || null,
          version: g.version || '0.19.0',
          encoding: 'legacy-localStorage',
          rawBytes,
          compressedBytes: rawBytes,
          storage: 'localStorage (legacy)',
        });
      } catch (_) {
        slots.push({ slot: i, empty: true, corrupted: true });
      }
    }
    return slots;
  }

  async function listSaveSlotsAsync() {
    await flushPendingSaves();
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
            if (rec && (rec.payload || rec.data || rec.game)) {
              const g = rec.game || {};
              const estRawBytes = Number(rec.rawBytes) || (typeof rec.data === 'string' ? encodeUtf8(rec.data).byteLength : 0) || (rec.game ? encodeUtf8(JSON.stringify(rec.game)).byteLength : 0);
              const estCompBytes = Number(rec.compressedBytes) || (rec.payload ? rec.payload.byteLength : estRawBytes);
              out.push({
                slot: i,
                empty: false,
                label: rec.label || g.player?.name || `Slot ${i}`,
                partyName: rec.partyName || g.player?.name || 'Party',
                partyColor: rec.partyColor || g.player?.color || '#3478c8',
                year: rec.year || g.year || 2028,
                phase: rec.phase || g.phase || 'organizing',
                savedAt: rec.savedAt || null,
                version: rec.version || g.version || '0.19.0',
                encoding: rec.encoding || 'raw-object',
                rawBytes: estRawBytes,
                compressedBytes: estCompBytes,
                storage: rec.encoding === 'gzip-json' ? 'IndexedDB (gzip)' : 'IndexedDB',
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
    saveGame({ ...game, _activeSaveSlot: n }, { immediate: true });
    return true;
  }

  async function saveToSlotAsync(slotNum, game, label = '', options = {}) {
    if (!game) return false;
    requestPersistentStorageOnce();
    await flushPendingSaves();
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const stamped = { ...game, _activeSaveSlot: n, _savedAt: Number(game._savedAt || Date.now()) };
    const built = await buildIndexedDBSlotRecord(n, stamped, label, options);
    if (!built.ok) return false;

    const db = await openSavesIndexedDB();
    if (!db) return false;

    const committed = await putRecordInIndexedDB(db, built.record);
    if (committed) {
      game._activeSaveSlot = n;
      // Clear any old bloated legacy slot entry in localStorage once IDB commit succeeds
      try { if (typeof localStorage !== 'undefined') localStorage.removeItem(saveSlotKey(n)); } catch (_) {}
      writeLocalMetaPointer(built.compacted, n);
      await saveAutosaveToIndexedDB(built.compacted);
    }
    return committed;
  }

  function loadFromSlot(slotNum, deps = {}) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const normalizeFn = deps.migrateSave || deps.normalizeGame || ((x) => x);
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(saveSlotKey(n)) : null;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const loaded = normalizeFn(parsed.game || parsed);
      if (loaded) loaded._activeSaveSlot = n;
      return loaded;
    } catch (_) {
      return null;
    }
  }

  async function loadFromSlotAsync(slotNum, deps = {}) {
    await flushPendingSaves();
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    const normalizeFn = deps.migrateSave || deps.normalizeGame || ((x) => x);
    const db = await openSavesIndexedDB();
    if (!db) return loadFromSlot(n, deps);

    const rec = await getRecordFromIndexedDB(db, n);
    if (rec) {
      const decoded = await decodeSlotRecord(rec);
      if (decoded) {
        const loaded = normalizeFn(decoded);
        if (loaded) {
          loaded._activeSaveSlot = n;
          // Upgrade uncompressed IDB v1 slot to compressed IDB v2 transparently
          if (rec.encoding !== 'gzip-json' && isCompressionStreamAvailable()) {
            const built = await buildIndexedDBSlotRecord(n, loaded, rec.label || '');
            if (built.ok) await putRecordInIndexedDB(db, built.record);
          }
          try { if (typeof localStorage !== 'undefined') localStorage.removeItem(saveSlotKey(n)); } catch (_) {}
          return loaded;
        }
      }
    }

    // Fallback one-time migration from legacy localStorage manual slot
    const legacy = loadFromSlot(n, deps);
    if (legacy) {
      const migratedOk = await saveToSlotAsync(n, legacy);
      if (migratedOk) {
        try { if (typeof localStorage !== 'undefined') localStorage.removeItem(saveSlotKey(n)); } catch (_) {}
      }
      return legacy;
    }
    return null;
  }

  function deleteSaveSlot(slotNum) {
    const n = Math.max(1, Math.min(SAVE_SLOT_COUNT, Math.round(Number(slotNum) || 1)));
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(saveSlotKey(n));
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

  async function exportSaveToGzipAsync(game, options = {}) {
    if (!game || typeof game !== 'object') return null;
    const encoded = await encodeGameRecordPayload(game, options);
    if (!encoded.ok) return encoded;
    const g = encoded.compacted;
    const partySlug = String(g.player?.name || 'campaign')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'campaign';
    const year = g.year || 2028;
    const isGz = encoded.encoding === 'gzip-json' && encoded.payload;
    const filename = `party-chair-${partySlug}-${year}${isGz ? '.cbsave.gz' : '.json'}`;
    const bytes = isGz ? encoded.payload : encodeUtf8(encoded.data);
    return {
      ok: true,
      filename,
      mimeType: isGz ? 'application/gzip' : 'application/json',
      bytes,
      byteLength: bytes.byteLength,
      rawBytes: encoded.rawBytes,
      compressedBytes: bytes.byteLength,
      encoding: encoded.encoding,
    };
  }

  async function importSaveFromFileAsync(input, deps = {}) {
    try {
      let jsonStr = '';
      let format = 'json';
      let u8 = toUint8Array(input);
      if (typeof input === 'string') {
        jsonStr = input;
      } else if (input && typeof input.arrayBuffer === 'function') {
        const buf = await input.arrayBuffer();
        u8 = new Uint8Array(buf);
      }

      if (u8) {
        const hasGzipMagic = u8.byteLength >= 2 && u8[0] === 0x1f && u8[1] === 0x8b;
        if (hasGzipMagic) {
          format = 'cbsave.gz';
          const rawBytes = await gzipDecompressBytes(u8);
          jsonStr = decodeUtf8(rawBytes);
        } else {
          jsonStr = decodeUtf8(u8);
        }
      }

      if (!jsonStr || !jsonStr.trim()) {
        return { ok: false, error: 'Empty save file.' };
      }

      const parsed = JSON.parse(jsonStr);
      const candidate = (parsed && typeof parsed === 'object' && parsed._exportFormat === 'coalition-builder-save-backup' && parsed.game)
        ? parsed.game
        : parsed;

      if (!candidate || typeof candidate !== 'object' || (!candidate.player && !candidate.playerParty)) {
        return { ok: false, error: 'File does not contain a valid Party Chair campaign save.' };
      }

      const g = getGlobalScope();
      const sm = g.SaveMigrations || (typeof require === 'function' ? (() => { try { return require('./save-migrations.js'); } catch (_) { return null; } })() : null);
      let migrated = (sm && typeof sm.migrateSaveObject === 'function') ? sm.migrateSaveObject(candidate) : candidate;
      const normFn = deps.migrateSave || deps.normalizeGame;
      if (typeof normFn === 'function') {
        const normed = normFn(migrated);
        if (normed && typeof normed === 'object') migrated = normed;
      }

      return {
        ok: true,
        game: migrated,
        format,
        rawBytes: encodeUtf8(jsonStr).byteLength,
      };
    } catch (err) {
      return { ok: false, error: `Import failed: ${err?.message || 'Invalid save archive'}` };
    }
  }

  // Flush debounced IndexedDB saves on pagehide if supported
  try {
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pagehide', () => { flushPendingAutosaveNow(); });
    }
  } catch (_) {}

  const PersistenceCore = {
    SAVE_KEY,
    ALL_AUTOSAVE_KEYS,
    SAVE_IDB_NAME,
    SAVE_IDB_VERSION,
    SAVE_IDB_STORE,
    SAVE_SLOT_COUNT,
    SAVE_SLOT_PREFIX,
    MAX_SAVE_RAW_BYTES,
    WARN_SAVE_RAW_BYTES,
    AUTOSAVE_DEBOUNCE_MS,
    requestPersistentStorageOnce,
    getStorageEstimateAsync,
    getLastSaveStatus,
    compactGameForSave,
    encodeGameRecordPayload,
    decodeSlotRecord,
    openSavesIndexedDB,
    saveAutosaveToIndexedDB,
    flushPendingSaves,
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
    exportSaveToGzipAsync,
    importSaveFromFileAsync,
  };

  if (typeof window !== 'undefined') window.PersistenceCore = PersistenceCore;
  if (typeof root !== 'undefined' && root) root.PersistenceCore = PersistenceCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = PersistenceCore;
})(typeof globalThis !== 'undefined' ? globalThis : this);
