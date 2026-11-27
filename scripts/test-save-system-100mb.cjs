#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');

// In-memory Web Storage & IndexedDB mock supporting IDB v1 -> v2 upgrade and failure injection
function createStorageMocks() {
  const lsStore = new Map();
  const localStorage = {
    get length() { return lsStore.size; },
    key(i) { return Array.from(lsStore.keys())[i] ?? null; },
    getItem(k) { return lsStore.has(String(k)) ? lsStore.get(String(k)) : null; },
    setItem(k, v) { lsStore.set(String(k), String(v)); },
    removeItem(k) { lsStore.delete(String(k)); },
    clear() { lsStore.clear(); },
  };

  const idbStores = new Map([['saveSlots', new Map()]]);
  let currentIdbVersion = 1;
  let failIdbWrites = false;

  const indexedDB = {
    open(name, version) {
      const req = { result: null, onupgradeneeded: null, onsuccess: null, onerror: null };
      setTimeout(() => {
        const db = {
          name,
          version: version || currentIdbVersion,
          objectStoreNames: { contains: (s) => idbStores.has(s) },
          createObjectStore(s) {
            if (!idbStores.has(s)) idbStores.set(s, new Map());
            return {};
          },
          transaction(storeName) {
            const storeMap = idbStores.get(storeName) || new Map();
            const tx = { oncomplete: null, onerror: null };
            const finish = (isErr = false) => {
              setTimeout(() => {
                if (isErr && typeof tx.onerror === 'function') tx.onerror(new Error('Injected IDB error'));
                else if (!isErr && typeof tx.oncomplete === 'function') tx.oncomplete();
              }, 0);
            };
            return {
              set oncomplete(fn) { tx.oncomplete = fn; },
              get oncomplete() { return tx.oncomplete; },
              set onerror(fn) { tx.onerror = fn; },
              get onerror() { return tx.onerror; },
              objectStore() {
                return {
                  put(rec) {
                    if (failIdbWrites) {
                      finish(true);
                      return {};
                    }
                    storeMap.set(Number(rec.slot), rec);
                    finish(false);
                    return {};
                  },
                  get(key) {
                    const getReq = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => {
                      getReq.result = storeMap.get(Number(key));
                      if (typeof getReq.onsuccess === 'function') getReq.onsuccess();
                    }, 0);
                    return getReq;
                  },
                  getAll() {
                    const allReq = { result: [], onsuccess: null, onerror: null };
                    setTimeout(() => {
                      allReq.result = Array.from(storeMap.values());
                      if (typeof allReq.onsuccess === 'function') allReq.onsuccess();
                    }, 0);
                    return allReq;
                  },
                  delete(key) {
                    storeMap.delete(Number(key));
                    finish(false);
                    return {};
                  },
                };
              },
            };
          },
        };
        if (version && version > currentIdbVersion) {
          currentIdbVersion = version;
          req.result = db;
          if (typeof req.onupgradeneeded === 'function') req.onupgradeneeded();
        }
        req.result = db;
        if (typeof req.onsuccess === 'function') req.onsuccess();
      }, 0);
      return req;
    },
  };

  return {
    localStorage,
    indexedDB,
    lsStore,
    idbSlots: idbStores.get('saveSlots'),
    setFailIdbWrites(flag) { failIdbWrites = Boolean(flag); },
    getVersion() { return currentIdbVersion; },
  };
}

function buildLargeSyntheticGame(politicianCount = 7600) {
  const politicians = [];
  for (let i = 0; i < politicianCount; i++) {
    politicians.push({
      id: `pol_state_${i}`,
      name: `Legislator_${i}`,
      party: i % 2 === 0 ? 'people' : 'heritage',
      stateId: i % 2 === 0 ? 'PA' : 'OH',
      office: 'state_house',
      chamber: i % 3 === 0 ? 'upper' : 'lower',
      district: `${i % 200}`,
      fame: (i % 90) + 10,
      age: 35 + (i % 40),
      tenure: 1 + (i % 8),
      retired: i % 10 === 0, // ensure even retired records stay under normal save
      ideology: { economic: ((i % 10) + 1), social: ((i % 10) + 1), governance: 5.5 },
      bio: `Full state legislative biography record #${i} representing district ${i % 200} with floor voting history.`,
    });
  }
  return {
    schema: 9,
    version: '0.19.0',
    year: 2036,
    phase: 'organizing',
    player: { id: 'people', baseTemplateId: 'people', name: 'Democratic Party', color: '#3478c8' },
    politicians,
    sittingMembers: [
      { id: 'sit_1', name: 'Sen. Test', party: 'people', stateId: 'PA', office: 'senate', fame: 80 },
    ],
    elections: [{ year: 2032, type: 'presidential', districts: [{ id: 'PA-01', margin: 2.1 }] }],
    forecasters: { dummy: true },
    _forecastCache: { PA: 1 },
    _deferredDistricts: ['PA-01'],
    _forecastOptions: { fast: true },
    _forecastCacheHits: 12,
    electionNight: { active: false, completed: true, timeline: [1, 2, 3] },
  };
}

async function run() {
  const mocks = createStorageMocks();
  global.localStorage = mocks.localStorage;
  global.indexedDB = mocks.indexedDB;
  global.window = global;
  Object.defineProperty(global, 'navigator', {
    configurable: true,
    writable: true,
    value: {
      storage: {
        persist: async () => true,
        estimate: async () => ({ usage: 42 * 1024 * 1024, quota: 1024 * 1024 * 1024 }),
      },
    },
  });

  const PersistenceCore = require(path.resolve(__dirname, '..', 'persistence-core.js'));

  console.log('=== 100 MB IndexedDB + Gzip Save System Test Suite ===');

  // 1. Verify constants
  assert.strictEqual(PersistenceCore.MAX_SAVE_RAW_BYTES, 100 * 1024 * 1024, 'MAX_SAVE_RAW_BYTES must be 100 MB');
  assert.strictEqual(PersistenceCore.WARN_SAVE_RAW_BYTES, 80 * 1024 * 1024, 'WARN_SAVE_RAW_BYTES must be 80 MB');
  console.log('  PASS: Size limits configured (80 MB warn / 100 MB cap)');

  // 2. Relaxed compaction preserves 7,600 politicians while stripping runtime caches
  const bigGame = buildLargeSyntheticGame(7600);
  const compacted = PersistenceCore.compactGameForSave(bigGame);
  assert.strictEqual(compacted.politicians.length, 7600, 'Normal compaction must preserve all 7,600 politicians without truncating');
  assert.strictEqual(compacted.elections[0].districts.length, 1, 'Normal compaction preserves election history');
  assert.strictEqual(compacted.forecasters, undefined, 'Ephemeral forecasters stripped');
  assert.strictEqual(compacted._forecastCache, undefined, 'Ephemeral _forecastCache stripped');
  assert.strictEqual(compacted._deferredDistricts, undefined, 'Ephemeral _deferredDistricts stripped');
  assert.strictEqual(compacted._forecastOptions, undefined, 'Ephemeral _forecastOptions stripped');
  assert.strictEqual(compacted._forecastCacheHits, undefined, 'Ephemeral _forecastCacheHits stripped');
  assert.strictEqual(compacted.electionNight, null, 'Completed electionNight cleared');
  console.log('  PASS: compactGameForSave preserves 7,600+ politicians and strips ephemeral runtime caches');

  // 3. Gzip round-trip compression/decompression via saveToSlotAsync & loadFromSlotAsync
  const savedSlot1 = await PersistenceCore.saveToSlotAsync(1, bigGame, 'Large State Leg Roster');
  assert.strictEqual(savedSlot1, true, 'saveToSlotAsync must succeed for 7,600 politician save');
  const rawRec = mocks.idbSlots.get(1);
  assert.ok(rawRec, 'Slot 1 must exist in IndexedDB');
  assert.strictEqual(rawRec.encoding, 'gzip-json', 'Slot 1 must be stored gzip-compressed');
  assert.ok(rawRec.payload instanceof Uint8Array, 'Compressed payload must be Uint8Array');
  assert.ok(rawRec.rawBytes > rawRec.compressedBytes, `Expected rawBytes (${rawRec.rawBytes}) > compressedBytes (${rawRec.compressedBytes})`);
  assert.ok(mocks.getVersion() >= 2, 'IndexedDB upgraded to v2');

  // Check localStorage holds only tiny <1 KB pointer
  const lsPtrRaw = mocks.localStorage.getItem(PersistenceCore.SAVE_KEY);
  assert.ok(lsPtrRaw && Buffer.byteLength(lsPtrRaw, 'utf8') < 1024, 'localStorage pointer must stay under 1 KB');
  const lsPtr = JSON.parse(lsPtrRaw);
  assert.strictEqual(lsPtr._metaPointer, true);
  assert.strictEqual(lsPtr.backend, 'idb-v2');
  assert.strictEqual(mocks.localStorage.getItem('partyChairGame.save.slot.1'), null, 'Manual slot must not be duplicated in localStorage');

  const slotsListed = await PersistenceCore.listSaveSlotsAsync();
  assert.strictEqual(slotsListed[0].rawBytes, rawRec.rawBytes, 'listSaveSlotsAsync reports rawBytes');
  assert.strictEqual(slotsListed[0].compressedBytes, rawRec.compressedBytes, 'listSaveSlotsAsync reports compressedBytes');
  assert.strictEqual(slotsListed[0].encoding, 'gzip-json');

  const loadedSlot1 = await PersistenceCore.loadFromSlotAsync(1);
  assert.ok(loadedSlot1, 'loadFromSlotAsync must return decoded save');
  assert.strictEqual(loadedSlot1.politicians.length, 7600, 'Gzip round-trip preserves all 7,600 politician records');
  assert.strictEqual(loadedSlot1.politicians[7599].id, 'pol_state_7599', 'Tail politician record intact');
  console.log(`  PASS: Gzip IDB round-trip (${(rawRec.rawBytes / 1024 / 1024).toFixed(2)} MB raw -> ${(rawRec.compressedBytes / 1024).toFixed(1)} KB gzipped)`);

  // 4. Debounced autosave & flushPendingSaves
  const gA = { ...bigGame, year: 2038, _savedAt: Date.now() + 100 };
  const gB = { ...bigGame, year: 2040, _savedAt: Date.now() + 200 };
  PersistenceCore.saveGame(gA);
  PersistenceCore.saveGame(gB);
  await PersistenceCore.flushPendingSaves();
  const autoLoaded = await PersistenceCore.loadGameAsync();
  assert.strictEqual(autoLoaded.year, 2040, 'flushPendingSaves must coalesce rapid autosaves and keep latest');
  console.log('  PASS: Debounced autosave + flushPendingSaves coalescing verified');

  // 5. 80 MB warning threshold & 100 MB ceiling enforcement
  const baseSmall = { schema: 9, version: '0.19.0', year: 2032, phase: 'organizing', player: { id: 'people', name: 'Test' }, politicians: [] };
  // ~84 MB string payload
  const warnGame = { ...baseSmall, hugeHistoryBlob: 'X'.repeat(84 * 1024 * 1024) };
  const warnSaved = await PersistenceCore.saveToSlotAsync(2, warnGame);
  assert.strictEqual(warnSaved, true, '84 MB save under 100 MB limit should succeed');
  const warnStatus = PersistenceCore.getLastSaveStatus();
  assert.strictEqual(warnStatus.sizeWarning, true, '84 MB save must trigger 80 MB warning flag');
  assert.strictEqual(warnStatus.limitExceeded, false);
  assert.ok(global.window.__saveSizeWarning && global.window.__saveSizeWarning.rawBytes >= 80 * 1024 * 1024);

  // >100 MB string payload
  const overLimitGame = { ...baseSmall, hugeHistoryBlob: 'Y'.repeat(102 * 1024 * 1024) };
  const overSaved = await PersistenceCore.saveToSlotAsync(3, overLimitGame);
  assert.strictEqual(overSaved, false, '102 MB save over 100 MB ceiling must be rejected');
  const overStatus = PersistenceCore.getLastSaveStatus();
  assert.strictEqual(overStatus.error, 'SAVE_SIZE_LIMIT_EXCEEDED');
  assert.strictEqual(overStatus.limitExceeded, true);
  assert.strictEqual(global.window.__saveSizeLimitExceeded, true);
  console.log('  PASS: 80 MB warning flag & 100 MB uncompressed ceiling enforced cleanly');

  // 6. Export (.cbsave.gz) & Import round-trip
  const pkg = await PersistenceCore.exportSaveToGzipAsync(bigGame);
  assert.strictEqual(pkg.ok, true);
  assert.ok(pkg.filename.endsWith('.cbsave.gz'));
  const importedPkg = await PersistenceCore.importSaveFromFileAsync(pkg.bytes);
  assert.strictEqual(importedPkg.ok, true);
  assert.strictEqual(importedPkg.format, 'cbsave.gz');
  assert.strictEqual(importedPkg.game.politicians.length, 7600);
  console.log('  PASS: .cbsave.gz export and import round-trip verified');

  // 7. Legacy uncompressed IndexedDB v1 migration
  mocks.idbSlots.clear();
  mocks.lsStore.clear();
  const legacyIdbGame = {
    schema: 9,
    version: '0.18.9.4',
    year: 2042,
    phase: 'organizing',
    player: { id: 'heritage', name: 'Republican Party' },
    politicians: buildLargeSyntheticGame(300).politicians,
    _savedAt: 1700000000000,
  };
  mocks.idbSlots.set(0, {
    slot: 0,
    label: 'Autosave',
    savedAt: '2026-01-01T00:00:00.000Z',
    game: legacyIdbGame,
  });
  const migratedFromIdbV1 = await PersistenceCore.loadGameAsync();
  assert.strictEqual(migratedFromIdbV1.year, 2042);
  assert.strictEqual(migratedFromIdbV1.politicians.length, 300);
  assert.strictEqual(mocks.idbSlots.get(0).encoding, 'gzip-json', 'Uncompressed IDB v1 record upgraded to gzip IDB v2 on load');
  console.log('  PASS: Legacy uncompressed IndexedDB v1 record loads & upgrades cleanly');

  // 8. Legacy localStorage migration (only clears bloated localStorage key AFTER IndexedDB commits)
  mocks.idbSlots.clear();
  mocks.lsStore.clear();
  const legacyLsGame = {
    schema: 9,
    version: '0.19.1.1',
    year: 2046,
    phase: 'organizing',
    player: { id: 'liberty', name: 'Libertarian Party' },
    politicians: buildLargeSyntheticGame(250).politicians,
    _savedAt: 1800000000000,
  };
  mocks.localStorage.setItem('partyChairGame.save.v19.1.1', JSON.stringify(legacyLsGame));
  mocks.localStorage.setItem('partyChairGame.save.v18.9.4', JSON.stringify({ ...legacyLsGame, year: 2034 }));

  // First simulate IDB write failure -> legacy keys must NOT be wiped!
  mocks.setFailIdbWrites(true);
  const preFailLoad = await PersistenceCore.loadGameAsync();
  assert.strictEqual(preFailLoad.year, 2046);
  assert.ok(mocks.localStorage.getItem('partyChairGame.save.v19.1.1'), 'Legacy key must survive if IndexedDB commit failed');

  // Now allow IDB commit -> migrates & clears legacy keys, keeping tiny pointer
  mocks.setFailIdbWrites(false);
  const migratedLs = await PersistenceCore.loadGameAsync();
  assert.strictEqual(migratedLs.year, 2046);
  assert.strictEqual(mocks.localStorage.getItem('partyChairGame.save.v19.1.1'), null, 'Bloated v19.1.1 key cleared after IDB commit');
  assert.strictEqual(mocks.localStorage.getItem('partyChairGame.save.v18.9.4'), null, 'Bloated v18.9.4 key cleared after IDB commit');
  assert.ok(JSON.parse(mocks.localStorage.getItem(PersistenceCore.SAVE_KEY))._metaPointer === true, 'Tiny pointer replaces legacy key');
  assert.strictEqual(mocks.idbSlots.get(0).encoding, 'gzip-json');
  console.log('  PASS: Legacy localStorage migration commits to IndexedDB before clearing old keys');

  // 9. Graceful fallback when CompressionStream is unavailable
  const origCS = global.CompressionStream;
  const origDS = global.DecompressionStream;
  try {
    global.CompressionStream = undefined;
    global.DecompressionStream = undefined;
    const okUncomp = await PersistenceCore.saveToSlotAsync(4, { ...baseSmall, year: 2050 });
    assert.strictEqual(okUncomp, true, 'Fallback uncompressed save succeeds without CompressionStream');
    const uncompRec = mocks.idbSlots.get(4);
    assert.strictEqual(uncompRec.encoding, 'json', 'Fallback encoding is json');
    const uncompLoaded = await PersistenceCore.loadFromSlotAsync(4);
    assert.strictEqual(uncompLoaded.year, 2050);
  } finally {
    global.CompressionStream = origCS;
    global.DecompressionStream = origDS;
  }
  console.log('  PASS: Uncompressed JSON fallback works cleanly when CompressionStream is unavailable');

  console.log('ALL 100MB INDEXEDDB + GZIP SAVE SYSTEM TESTS PASSED!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
