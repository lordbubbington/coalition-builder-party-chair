'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const FIXTURE_DIR = path.join(__dirname, 'fixtures', 'saves');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {}, console, Math, Date, JSON, Number, String, Boolean, Array, Object, Set, Map, RegExp, Error, Promise,
    Uint8Array, Blob, DecompressionStream, Response, setTimeout, clearTimeout, setInterval, clearInterval,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
  });
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  const scripts = [
    'data.js','factions-0.15.js','scenario-2028.js','issues-0.2.1.js','maps-0.3.js',
    'state-house-data-0.5.js','voter-model-0.5.js','demographics-0.9.js','political-trends-system.js',
    'v07-scaffolding.js','party-systems-data.js','party-systems-coalition.js','party-systems-robots.js',
    'party-systems-engine.js','party-systems-ui.js','presidential-primaries.js','ballot-access.js',
    'election-uncertainty.js','candidate-vetting.js','election-drift.js','election-night-engine.js',
    'media-shocks-system.js','campaign-overhaul.js','campaign-events-system.js',
    'redistricting-ballot-system.js','coalition-politics-system.js','atlas-multiplayer-system.js',
    'leading-faction-system.js','faction-era-stability.js','v0185-playtest-fixes.js',
    'save-migrations.js','engine.js',
  ];
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

function findNaNPaths(obj, prefix = '', seen = new WeakSet(), out = []) {
  if (typeof obj === 'number' && Number.isNaN(obj)) {
    out.push(prefix || '<root>');
    return out;
  }
  if (!obj || typeof obj !== 'object') return out;
  if (seen.has(obj)) return out;
  seen.add(obj);
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      findNaNPaths(obj[i], `${prefix}[${i}]`, seen, out);
      if (out.length >= 10) break;
    }
  } else {
    for (const k of Object.keys(obj)) {
      findNaNPaths(obj[k], prefix ? `${prefix}.${k}` : k, seen, out);
      if (out.length >= 10) break;
    }
  }
  return out;
}

let passed = 0;
let failed = 0;
function check(label, cond, detail = '') {
  if (cond) {
    passed++;
    console.log(`  PASS: ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failed++;
    console.error(`  FAIL: ${label}${detail ? ` (${detail})` : ''}`);
  }
}

console.log('====================================================================');
console.log(' VERSION 0.18.5 SAVE-MIGRATION & BACKWARD-COMPATIBILITY SUITE');
console.log('====================================================================');

// 1. Direct Node module.exports & zero Math.random()
const directMod = require(path.join(ROOT, 'save-migrations.js'));
const srcCode = fs.readFileSync(path.join(ROOT, 'save-migrations.js'), 'utf8');
check('Node module.exports loads cleanly, SAVE_SCHEMA_VERSION >= 8, & zero Math.random()',
  Boolean(directMod && (directMod.SAVE_SCHEMA_VERSION === 8 || directMod.SAVE_SCHEMA_VERSION === 9) && typeof directMod.migrateSaveObject === 'function') &&
  !srcCode.includes('Math.random'));

const ctx = boot();
const E = ctx.window.PartyChairEngine;
const SM = ctx.window.SaveMigrations;

// 2. Corruption & Sanity Guardrails (NaN treasury, trust, partyTiers, duplicate House districts, representatives parity, eraNumber)
const corruptInput = {
  schema: 7,
  version: '0.18.3',
  year: 2028,
  seed: 2028,
  player: { id: 'people', baseTemplateId: 'people', name: 'Democratic Party', startingBudget: 150 },
  treasury: Number.NaN,
  trust: { supporters: Number.NaN, independents: Number.NaN, opponents: Number.NaN },
  partyTiers: { people: Number.NaN, heritage: 5 },
  partySystems: { currentEraNumber: 7, eraNumber: 4 },
  sittingMembers: [
    { id: 'h-pa-1-a', office: 'house', stateId: 'PA', districtId: 'PA-1', partyId: 'people', name: 'Rep Alpha', fame: 60 },
    { id: 'h-pa-1-b', office: 'house', stateId: 'PA', districtId: 'PA-1', partyId: 'heritage', name: 'Rep Dup', fame: 30 },
    { id: 'h-mi-1', office: 'house', stateId: 'MI', districtId: 'MI-1', partyId: 'heritage', name: 'Rep Beta', fame: 55 },
  ],
  representatives: [],
};
const repaired = SM.validateAndRepairSave(corruptInput);
check('validateAndRepairSave repairs NaN treasury, trust, partyTiers, duplicate House districts, representatives parity, & eraNumber',
  Number.isFinite(repaired.treasury) && repaired.treasury === 150 &&
  repaired.trust.supporters === 65 && repaired.trust.independents === 40 && repaired.trust.opponents === 12 &&
  repaired.partyTiers.people === 5 &&
  repaired.sittingMembers.filter((m) => m.districtId === 'PA-1').length === 1 &&
  repaired.representatives.length === 2 &&
  repaired.partySystems.eraNumber === repaired.partySystems.currentEraNumber,
  `treasury=${repaired.treasury}, PA-1=${repaired.sittingMembers.filter((m) => m.districtId === 'PA-1').length}, reps=${repaired.representatives.length}, era=${repaired.partySystems.eraNumber}`);

// 3. Non-clobbering v0.18.4 backfill
const customExisting = {
  schema: 7,
  year: 2030,
  seed: 2030,
  player: { id: 'people', baseTemplateId: 'people', name: 'Democratic Party' },
  mediaEcosystem: { people: { broadcast: 88, cable: 60, digital: 77, local: 62, upkeepChannels: ['broadcast'], counterPenalties: [] } },
  primaryRules: { closedOnly: true },
  diplomacyPacts: [{ id: 'pact-1', partner: 'green' }],
};
const migratedNoClobber = SM.migrateV0183ToV0184(customExisting);
check('migrateV0183ToV0184 backfills all 11 v0.18.4+ subsystems without clobbering existing values',
  migratedNoClobber.mediaEcosystem.people.broadcast === 88 &&
  migratedNoClobber.primaryRules.closedOnly === true &&
  migratedNoClobber.diplomacyPacts.length === 1 &&
  Boolean(migratedNoClobber.activeMacroArc?.id) &&
  typeof migratedNoClobber.patronageAppointments === 'object' &&
  typeof migratedNoClobber.atlasHistory === 'object' &&
  typeof migratedNoClobber.multiplayer === 'object' &&
  typeof migratedNoClobber.leadingFactionByParty === 'object' &&
  typeof migratedNoClobber.realignedAnchors === 'object' &&
  Array.isArray(migratedNoClobber.activeBallotInitiatives) &&
  typeof migratedNoClobber.redistrictingCommissions === 'object');

// 4. Export & Import JSON backup round-trip
const baseGame = E.createGame({ baseTemplateId: 'people', seed: 2028 });
const exported = SM.exportSaveToJson(baseGame);
const imported = SM.importSaveFromJson(exported.json, E.normalizeGame);
check('Export/Import Save Backup (.json) round-trips cleanly & non-destructively',
  Boolean(exported && exported.filename.endsWith('.json') && imported.ok && (imported.game.schema === 8 || imported.game.schema === 9) && imported.game.year === baseGame.year),
  exported?.filename);

// 5. Multi-Version Fixture Snapshot Suite (v0.16.2 major, v0.18.2 minor, v0.18.3 custom)
const fixtures = [
  { file: 'v0162-major-dem.json', label: 'v0.16.2 Major (Democratic)' },
  { file: 'v0182-minor-liberty.json', label: 'v0.18.2 Minor (Libertarian)' },
  { file: 'v0183-custom-party.json', label: 'v0.18.3 Custom Party' },
];

for (const fx of fixtures) {
  const raw = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, fx.file), 'utf8'));

  // 5a. Idempotency check: migrate(migrate(x)) === migrate(x)
  const m1 = SM.migrateSaveObject(raw);
  const m2 = SM.migrateSaveObject(m1);
  const idempotent = JSON.stringify(m1) === JSON.stringify(m2);
  check(`[${fx.label}] Idempotency: migrate(migrate(x)) === migrate(x)`, idempotent);

  // 5b. Full normalizeGame() load + structural checks
  const norm = E.normalizeGame(raw);
  const houseSit = (norm?.sittingMembers || []).filter((m) => m.office === 'house' && m.districtId && !m.retired);
  const uniqueHouseDists = new Set(houseSit.map((m) => m.districtId)).size;
  const nanInit = findNaNPaths(norm);
  check(`[${fx.label}] normalizeGame() succeeds (schema=8/9, 1:1 scale, 0 dupes, 0 NaNs, era synced)`,
    Boolean(norm) &&
    (norm.schema === 8 || norm.schema === 9) &&
    norm.voterModel?.voterScale === '1:1' &&
    (norm.voterModel?.sampleVoters || 0) >= 10000000 &&
    Boolean(norm.parties && Object.keys(norm.parties).length >= 6) &&
    Number.isFinite(norm._savedAt) &&
    Boolean(norm.mediaEcosystem && norm.activeMacroArc) &&
    houseSit.length === uniqueHouseDists &&
    (norm.representatives?.length || 0) === houseSit.length &&
    (!norm.partySystems || norm.partySystems.eraNumber === norm.partySystems.currentEraNumber) &&
    nanInit.length === 0,
    `year=${norm?.year}, house=${houseSit.length}, reps=${norm?.representatives?.length}, nans=${nanInit.length}`);

  // 5c. Advance 3 full cycles with 0 errors and 0 NaNs
  let cur = norm;
  let cycleErr = null;
  for (let c = 0; c < 3; c++) {
    try {
      cur = { ...cur, phase: 'complete' };
      cur = E.startNextCycle(cur);
    } catch (err) {
      cycleErr = err;
      break;
    }
  }
  const nanAfter = cycleErr ? ['ERR'] : findNaNPaths(cur);
  check(`[${fx.label}] Advances 3 full cycles cleanly with 0 errors & 0 NaNs`,
    !cycleErr && cur.year === norm.year + 6 && nanAfter.length === 0,
    cycleErr ? cycleErr.message : `year ${norm.year}->${cur.year}, nans=${nanAfter.length}`);
}

console.log('\n====================================================================');
console.log(` V0.18.5 SAVE MIGRATIONS SUITE: ${passed} passed, ${failed} failed`);
console.log('====================================================================');
if (failed > 0) process.exit(1);
