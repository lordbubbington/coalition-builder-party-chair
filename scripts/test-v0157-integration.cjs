/**
 * Master Verification & Integration Test Suite for Version 0.15.7
 * Target: scripts/test-v0157-integration.cjs
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

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

const mockAppElement = {
  innerHTML: '',
  classList: {
    toggle: () => {},
    add: () => {},
    remove: () => {},
    contains: () => false,
  },
  insertAdjacentHTML: () => {},
  addEventListener: () => {},
};

const mockDocument = {
  querySelectorAll: () => [],
  querySelector: (sel) => (sel === '#app' ? mockAppElement : null),
  getElementById: (id) => (id === 'app' ? mockAppElement : null),
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
  'engine.js',
  'app.js',
].forEach(loadScript);

async function waitForApp() {
  let tries = 0;
  while (!sandbox.window.PartyChairApp && tries < 50) {
    await new Promise((r) => setTimeout(r, 100));
    tries++;
  }
  if (!sandbox.window.PartyChairApp) {
    throw new Error('PartyChairApp failed to initialize on window');
  }
}

async function runSuite() {
  await waitForApp();
  const Engine = sandbox.window.PartyChairEngine;
  const Data = sandbox.window.PartyChairData;
  const App = sandbox.window.PartyChairApp;
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.7 MASTER TEST SUITE');
  console.log('================================================================\n');

  // SUITE 1: Version, Save Key & Backward-Compatible Migrations
  console.log('--- SUITE 1: Version 0.15.7 Metadata & Save Migration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    assert(game.version === '0.15.7', `Game version is 0.15.7 (got ${game.version})`);
    assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.7', `Engine SAVE_KEY is partyChairGame.save.v15.7 (got ${Engine.SAVE_KEY})`);
    assert(pkg.version === '0.15.7', `package.json version is 0.15.7 (got ${pkg.version})`);

    mockLocalStorage.clear();
    Engine.saveGame(game);
    const loaded = Engine.loadGame();
    assert(Boolean(loaded) && loaded.version === '0.15.7', 'Round-trip save/load succeeds on v15.7');

    for (const oldVer of ['0.15.6', '0.15.5', '0.15.4']) {
      mockLocalStorage.clear();
      const oldSave = JSON.parse(JSON.stringify(game));
      oldSave.version = oldVer;
      const keyVer = oldVer.replace(/^0\./, 'v');
      mockLocalStorage.setItem(`partyChairGame.save.${keyVer}`, JSON.stringify(oldSave));
      const migrated = Engine.loadGame();
      assert(Boolean(migrated) && migrated.version === '0.15.7', `Successfully migrated save from partyChairGame.save.${keyVer} -> 0.15.7`);
    }
  }

  // SUITE 2: All 50 Sitting Governors Party Happiness Calibration
  console.log('\n--- SUITE 2: 50 Sitting U.S. Governors Party Happiness Calibration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const overrides = Data.POLITICIAN_HAPPINESS_OVERRIDES || {};
    const govs = game.sittingMembers.filter((m) => m.office === 'governor');
    assert(govs.length === 50, `Sitting Governor roster has exactly 50 Governors (got ${govs.length})`);

    const mismatches = govs.filter((g) => overrides[g.id] === undefined || g.happiness !== overrides[g.id]);
    assert(mismatches.length === 0, `All 50 Governors match their individual governor:ST override (mismatches: ${mismatches.length})`);

    const below30 = govs.filter((g) => g.happiness < 30);
    assert(below30.length === 0, `No Governor starts below <30 spontaneous aisle-cross threshold (got ${below30.length})`);

    const courtEligible = govs.filter((g) => g.happiness <= 40).map((g) => g.name).sort();
    const expectedCourt = ['Click Bishop', 'Phil Scott'];
    assert(JSON.stringify(courtEligible) === JSON.stringify(expectedCourt), `Exact 2 discontented Governors sit inside <=40 courtship gate (${courtEligible.join(', ')})`);

    assert(govs.find((g) => g.stateId === 'VT').happiness === 31, 'Phil Scott (VT) happiness is 31');
    assert(govs.find((g) => g.stateId === 'AK').happiness === 39, 'Click Bishop (AK) happiness is 39');
    assert(govs.find((g) => g.stateId === 'KY').happiness === 84, 'Andy Beshear (KY) happiness is 84');
    assert(govs.find((g) => g.stateId === 'AR').happiness === 79, 'Sarah Huckabee Sanders (AR) happiness is 79');

    // Verify zero collision on dual-listed AL & TN figures
    const alSen = game.sittingMembers.find((m) => m.office === 'senate' && m.name === 'Tommy Tuberville');
    const alGov = govs.find((g) => g.stateId === 'AL');
    assert(alSen.happiness === 63 && alGov.happiness === 64, `Dual-listed Tommy Tuberville keeps distinct Senate (${alSen.happiness}) & Governor (${alGov.happiness}) ratings`);

    const tnSen = game.sittingMembers.find((m) => m.office === 'senate' && m.name === 'Marsha Blackburn');
    const tnGov = govs.find((g) => g.stateId === 'TN');
    assert(tnSen.happiness === 65 && tnGov.happiness === 66, `Dual-listed Marsha Blackburn keeps distinct Senate (${tnSen.happiness}) & Governor (${tnGov.happiness}) ratings`);
  }

  // SUITE 3: 100 Senators Regression & 155M Scale Invariant
  console.log('\n--- SUITE 3: 100 Senators Regression & 155M Electorate Invariant ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const overrides = Data.POLITICIAN_HAPPINESS_OVERRIDES || {};
    const senators = game.sittingMembers.filter((m) => m.office === 'senate');
    assert(senators.length === 100, `Sitting Senate roster has exactly 100 Senators`);
    const senMismatches = senators.filter((s) => overrides[s.name] === undefined || s.happiness !== overrides[s.name]);
    assert(senMismatches.length === 0, `All 100 Senators still match their individual overrides (mismatches: ${senMismatches.length})`);

    const totalRep = game.voterModel.states.reduce((s, st) => s + st.representedVoters, 0);
    assert(totalRep === 155_000_000, `Baseline represented voters remains exactly 155,000,000 (got ${totalRep})`);
  }

  console.log('\n================================================================');
  console.log(` ALL V0.15.7 TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (100%)`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
