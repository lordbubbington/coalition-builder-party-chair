/**
 * Master Verification & Integration Test Suite for Version 0.15.8
 * Target: scripts/test-v0158-integration.cjs
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
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.8 MASTER TEST SUITE');
  console.log('================================================================\n');

  // SUITE 1: Version, Save Key & Backward-Compatible Migrations
  console.log('--- SUITE 1: Version 0.15.8 Metadata & Save Migration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    assert(game.version === '0.15.8', `Game version is 0.15.8 (got ${game.version})`);
    assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.8', `Engine SAVE_KEY is partyChairGame.save.v15.8 (got ${Engine.SAVE_KEY})`);
    assert(pkg.version === '0.15.8', `package.json version is 0.15.8 (got ${pkg.version})`);

    mockLocalStorage.clear();
    Engine.saveGame(game);
    const loaded = Engine.loadGame();
    assert(Boolean(loaded) && loaded.version === '0.15.8', 'Round-trip save/load succeeds on v15.8');

    for (const oldVer of ['0.15.7', '0.15.6', '0.15.5', '0.15.4']) {
      mockLocalStorage.clear();
      const oldSave = JSON.parse(JSON.stringify(game));
      oldSave.version = oldVer;
      const keyVer = oldVer.replace(/^0\./, 'v');
      mockLocalStorage.setItem(`partyChairGame.save.${keyVer}`, JSON.stringify(oldSave));
      const migrated = Engine.loadGame();
      assert(Boolean(migrated) && migrated.version === '0.15.8', `Successfully migrated save from partyChairGame.save.${keyVer} -> 0.15.8`);
    }
  }

  // SUITE 2: All 435 Sitting U.S. House Representatives Party Happiness Calibration
  console.log('\n--- SUITE 2: 435 Sitting U.S. House Representatives Calibration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const overrides = Data.POLITICIAN_HAPPINESS_OVERRIDES || {};
    const reps = game.sittingMembers.filter((m) => m.office === 'house');
    assert(reps.length === 435, `Sitting House roster has exactly 435 Representatives (got ${reps.length})`);

    const mismatches = reps.filter((r) => overrides[r.id] === undefined || r.happiness !== overrides[r.id]);
    assert(mismatches.length === 0, `All 435 Representatives match their individual house:ST-N override (mismatches: ${mismatches.length})`);

    const below30 = reps.filter((r) => r.happiness < 30);
    assert(below30.length === 0, `No Representative starts below <30 spontaneous aisle-cross threshold (got ${below30.length})`);

    const courtEligible = reps.filter((r) => r.happiness <= 40);
    assert(courtEligible.length === 14, `Exact 14 Representatives sit inside <=40 courtship gate (got ${courtEligible.length})`);

    assert(reps.find((r) => r.districtId === 'NY-8').happiness === 86, 'Hakeem Jeffries (NY-8) happiness is 86');
    assert(reps.find((r) => r.districtId === 'OH-4').happiness === 83, 'Jim Jordan (OH-4) happiness is 83');
    assert(reps.find((r) => r.districtId === 'OH-14').happiness === 36, 'David Joyce (OH-14) happiness is 36');
    assert(reps.find((r) => r.districtId === 'WA-3').happiness === 34, 'Marie Gluesenkamp Perez (WA-3) happiness is 34');
    assert(reps.find((r) => r.districtId === 'MI-12').happiness === 38, 'Rashida Tlaib (MI-12) happiness is 38');
    assert(reps.find((r) => r.districtId === 'LA-1').happiness === 53, 'Steve Scalise (LA-1) happiness is 53');
    assert(reps.find((r) => r.districtId === 'LA-4').happiness === 52, 'Mike Johnson (LA-4) happiness is 52');
  }

  // SUITE 3: Full 585/585 Sitting Officeholder Coverage & 155M Invariant
  console.log('\n--- SUITE 3: Complete 585/585 Sitting Officeholders & 155M Scale ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const overrides = Data.POLITICIAN_HAPPINESS_OVERRIDES || {};
    const senators = game.sittingMembers.filter((m) => m.office === 'senate');
    const govs = game.sittingMembers.filter((m) => m.office === 'governor');
    const reps = game.sittingMembers.filter((m) => m.office === 'house');

    assert(senators.length === 100 && govs.length === 50 && reps.length === 435, `Complete 585 officeholders present (100 Sen, 50 Gov, 435 House)`);
    const senBad = senators.filter((s) => s.happiness !== overrides[s.name]).length;
    const govBad = govs.filter((g) => g.happiness !== overrides[g.id]).length;
    const repBad = reps.filter((r) => r.happiness !== overrides[r.id]).length;
    assert(senBad === 0 && govBad === 0 && repBad === 0, `All 585/585 officeholders load exact individual ratings (mismatches: Sen=${senBad}, Gov=${govBad}, House=${repBad})`);

    const totalRep = game.voterModel.states.reduce((s, st) => s + st.representedVoters, 0);
    assert(totalRep === 155_000_000, `Baseline represented voters remains exactly 155,000,000 (got ${totalRep})`);
  }

  console.log('\n================================================================');
  console.log(` ALL V0.15.8 TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (100%)`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
