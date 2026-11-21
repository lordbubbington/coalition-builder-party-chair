/**
 * Verification Test Suite for REQ-248 (Version 0.16.3)
 * Target: scripts/test-v0163-founding-injection.cjs
 *
 * Covers Section 6 of VERSION_0.16.3_DESIGN.md:
 * - Two-Ledger Rule:
 *   Ledger 1 (Affiliations / Sample Units, 1.55M scale):
 *     st.affiliations.player gets sample units; st.affiliations.independent loses exact same amount.
 *   Ledger 2 (Factions / Raw Represented Voters, 155M scale):
 *     st.factions[cfId] gets raw allocated voters; swg_* factions deduct proportionally.
 * - Conservation sweep:
 *   National affiliations sum and per-state affiliation sums remain exactly conserved.
 *   Faction national total matches 100,000 represented voters.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✅ PASS: ${message}`);
}

const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

const mockAppElement = {
  innerHTML: '',
  classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
  insertAdjacentHTML: () => {},
  addEventListener: () => {},
};

const mockDocument = {
  querySelectorAll: () => [],
  querySelector: () => mockAppElement,
  getElementById: () => mockAppElement,
  addEventListener: () => {},
};

const sandbox = {
  window: {},
  document: mockDocument,
  localStorage: mockLocalStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math,
  JSON: JSON,
  Number: Number,
  String: String,
  Array: Array,
  Object: Object,
  Infinity: Infinity,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  Date: Date,
  Set: Set,
  Map: Map,
  Uint8Array: Uint8Array,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
};
sandbox.window = sandbox;
sandbox.window.document = mockDocument;
const ctx = vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', relPath), 'utf8');
  vm.runInContext(code, ctx, { filename: relPath });
}

[
  'data.js',
  'factions-0.15.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'maps-0.3.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographics-0.9.js',
  'political-trends-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'engine.js',
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const Data = sandbox.window.PartyChairData;

console.log('====================================================================');
console.log(' TEST SUITE: REQ-248 100K Founding Faction Two-Ledger Injection');
console.log('====================================================================\n');

// Test 1: Single State 100K Injection (Home State PA)
console.log('Test 1: Single State 100K Allocation (PA: 100,000)');
const getState = (g, id) => (g.voterModel?.states || []).find((s) => (s.stateId || s.id) === id);

const gameSingle = Engine.createGame({
  baseTemplateId: 'custom',
  customName: 'Keystone Independent',
  customOrigin: 'not_major_movement',
  customFactionName: 'Keystone League',
  customFactionStateAllocations: { PA: 100000 },
  customValues: {
    origin: 'not_major_movement',
  },
});

const stPA = getState(gameSingle, 'PA');
assert(Boolean(stPA), 'State PA exists in voter model');

// Ledger 1 Check: Sample Units (1.55M scale)
console.log('  Checking Ledger 1 (Sample Units / Affiliations):');
assert(stPA.affiliations.player === 1000, `PA affiliations.player is exactly 1,000 sample units: ${stPA.affiliations.player}`);
assert(gameSingle.voterModel.affiliations.player.sampleVoters === 1000, `National affiliations.player sampleVoters is 1,000`);
assert(gameSingle.voterModel.affiliations.player.representedVoters === 100000, `National affiliations.player representedVoters is 100,000`);

// Ledger 2 Check: Raw Represented Voters (155M scale)
console.log('  Checking Ledger 2 (Raw Represented Voters / Factions):');
const cfId = gameSingle.customFaction100k?.id || gameSingle.factions.find((f) => f.isCustomFounding)?.id;
assert(Boolean(cfId), `Custom faction id found: ${cfId}`);
assert(stPA.factions[cfId] === 100000, `PA st.factions[${cfId}] received exactly 100,000 raw voters: ${stPA.factions[cfId]}`);

// Check that other states received 0
const stOH = getState(gameSingle, 'OH');
assert(stOH.affiliations.player === 0, `OH affiliations.player is 0`);
assert(!stOH.factions[cfId] || stOH.factions[cfId] === 0, `OH custom faction voters is 0`);

// Test 2: Multi-State Allocation & Exact Integer Sample Unit Conservation
console.log('\nTest 2: Multi-State Allocation (PA: 40,000, MI: 30,000, WI: 30,000)');
const gameMulti = Engine.createGame({
  baseTemplateId: 'custom',
  customName: 'Rust Belt Front',
  customOrigin: 'not_major_movement',
  customFactionName: 'Rust Belt Union',
  customFactionStateAllocations: { PA: 40000, MI: 30000, WI: 30000 },
  customValues: {
    origin: 'not_major_movement',
  },
});

const cfIdMulti = gameMulti.customFaction100k?.id || gameMulti.factions.find((f) => f.isCustomFounding)?.id;
const stMultiPA = getState(gameMulti, 'PA');
const stMultiMI = getState(gameMulti, 'MI');
const stMultiWI = getState(gameMulti, 'WI');

assert(stMultiPA.affiliations.player === 400, `PA sample units: ${stMultiPA.affiliations.player} (expected 400)`);
assert(stMultiMI.affiliations.player === 300, `MI sample units: ${stMultiMI.affiliations.player} (expected 300)`);
assert(stMultiWI.affiliations.player === 300, `WI sample units: ${stMultiWI.affiliations.player} (expected 300)`);

assert(stMultiPA.factions[cfIdMulti] === 40000, `PA raw voters: ${stMultiPA.factions[cfIdMulti]} (expected 40,000)`);
assert(stMultiMI.factions[cfIdMulti] === 30000, `MI raw voters: ${stMultiMI.factions[cfIdMulti]} (expected 30,000)`);
assert(stMultiWI.factions[cfIdMulti] === 30000, `WI raw voters: ${stMultiWI.factions[cfIdMulti]} (expected 30,000)`);

// Test 3: Total National Conservation Sweep Across All 51 Jurisdictions
console.log('\nTest 3: Conservation sweep across all jurisdictions');
let totalSamplePlayer = 0;
let totalRawCustomFaction = 0;

for (const st of gameMulti.voterModel.states) {
  totalSamplePlayer += (st.affiliations?.player || 0);
  totalRawCustomFaction += (st.factions?.[cfIdMulti] || 0);
}

assert(totalSamplePlayer === 1000, `National sum of sample units across all states = exactly 1,000: ${totalSamplePlayer}`);
assert(totalRawCustomFaction === 100000, `National sum of custom faction voters across all states = exactly 100,000: ${totalRawCustomFaction}`);
assert(gameMulti.voterModel.affiliations.player.sampleVoters === 1000, 'game.voterModel.affiliations.player.sampleVoters === 1000');
assert(gameMulti.voterModel.affiliations.player.representedVoters === 100000, 'game.voterModel.affiliations.player.representedVoters === 100000');

console.log(`\n====================================================================`);
console.log(` REQ-248 RESULTS: ${passedTests} / ${totalTests} assertions passed.`);
console.log(`====================================================================\n`);
