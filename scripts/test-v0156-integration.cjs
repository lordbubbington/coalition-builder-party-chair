/**
 * Master Verification & Integration Test Suite for Version 0.15.6
 * Target: scripts/test-v0156-integration.cjs
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
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.6 MASTER TEST SUITE');
  console.log('================================================================\n');

  // SUITE 1: Version, Save Key & Backward-Compatible Migrations
  console.log('--- SUITE 1: Version 0.15.6 Metadata & Save Migration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    assert(game.version === '0.15.6', `Game version is 0.15.6 (got ${game.version})`);
    assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.6', `Engine SAVE_KEY is partyChairGame.save.v15.6 (got ${Engine.SAVE_KEY})`);
    assert(pkg.version === '0.15.6', `package.json version is 0.15.6 (got ${pkg.version})`);

    mockLocalStorage.clear();
    Engine.saveGame(game);
    const loaded = Engine.loadGame();
    assert(Boolean(loaded) && loaded.version === '0.15.6', 'Round-trip save/load succeeds on v15.6');

    mockLocalStorage.clear();
    const v155Save = JSON.parse(JSON.stringify(game));
    v155Save.version = '0.15.5';
    mockLocalStorage.setItem('partyChairGame.save.v15.5', JSON.stringify(v155Save));
    const migrated155 = Engine.loadGame();
    assert(Boolean(migrated155) && migrated155.version === '0.15.6', 'Successfully migrated save from partyChairGame.save.v15.5 -> 0.15.6');

    mockLocalStorage.clear();
    const v154Save = JSON.parse(JSON.stringify(game));
    v154Save.version = '0.15.4';
    mockLocalStorage.setItem('partyChairGame.save.v15.4', JSON.stringify(v154Save));
    const migrated154 = Engine.loadGame();
    assert(Boolean(migrated154) && migrated154.version === '0.15.6', 'Successfully migrated save from partyChairGame.save.v15.4 -> 0.15.6');
  }

  // SUITE 2: Individual U.S. Senator Party Happiness Calibration (100 Senators)
  console.log('\n--- SUITE 2: 100 Sitting U.S. Senators Party Happiness Calibration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const overrides = Data.POLITICIAN_HAPPINESS_OVERRIDES || {};
    const senators = game.sittingMembers.filter((m) => m.office === 'senate');
    assert(senators.length === 100, `Sitting Senate roster has exactly 100 Senators (got ${senators.length})`);

    const mismatches = senators.filter((s) => overrides[s.name] === undefined || s.happiness !== overrides[s.name]);
    assert(mismatches.length === 0, `All 100 Senators match their individual happiness override (mismatches: ${mismatches.length})`);

    const below30 = senators.filter((s) => s.happiness < 30);
    assert(below30.length === 0, `No Senator starts below <30 spontaneous aisle-cross threshold (got ${below30.length})`);

    const courtEligible = senators.filter((s) => s.happiness <= 40).map((s) => s.name).sort();
    const expectedCourt = ['Adam Hamilton', 'Bernie Sanders', 'Bill Cassidy', 'John Fetterman', 'Lisa Murkowski', 'Rand Paul'];
    assert(JSON.stringify(courtEligible) === JSON.stringify(expectedCourt), `Exact 6 discontented Senators sit inside <=40 courtship gate (${courtEligible.join(', ')})`);

    assert(senators.find((s) => s.name === 'Chuck Schumer').happiness === 84, 'Chuck Schumer happiness is 84');
    assert(senators.find((s) => s.name === 'John Thune').happiness === 80, 'John Thune happiness is 80');
    assert(senators.find((s) => s.name === 'Lisa Murkowski').happiness === 32, 'Lisa Murkowski happiness is 32');
    assert(senators.find((s) => s.name === 'John Fetterman').happiness === 35, 'John Fetterman happiness is 35');
  }

  // SUITE 3: 1/4th Vote-to-Faction Realignment & Socialist State Registration Table
  console.log('\n--- SUITE 3: Realignment & Disaggregated Socialist State Registration ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'socialist' });
    const outcome = {
      type: 'presidential',
      year: 2028,
      presidentialResults: {},
      nationalVote: { socialist: 10, people: 45, heritage: 45 },
    };
    game.voterModel.states.forEach((st) => {
      outcome.presidentialResults[st.stateId] = { shares: { socialist: 10, people: 45, heritage: 45 } };
    });
    const realigned = Engine.realignVotingBlocksBetweenElections(game, outcome);
    const postGame = { ...game, voterModel: realigned.voterModel, phase: 'complete' };

    const catalog = Data.FACTIONS_CATALOG;
    const totalRep = postGame.voterModel.states.reduce((s, st) => s + st.representedVoters, 0);
    assert(totalRep === 155_000_000, `Zero-variance national electorate preserved at 155,000,000 (got ${totalRep})`);

    const socFactions = catalog.filter((f) => f.partyId === 'socialist');
    const socTotal = socFactions.reduce((s, f) => s + (postGame.voterModel.factions[f.id] || 0), 0);
    assert(socTotal > 3_500_000, `Socialist factions gained realigned voters (~4M, got ${socTotal.toLocaleString()})`);

    const html = App.renderStateVoterRegistrationTable(postGame);
    assert(Boolean(html) && !html.includes('color:#e86464">0K'), 'State Voter Registration Table displays non-zero Socialist registrations across states');
  }

  console.log('\n================================================================');
  console.log(` ALL V0.15.6 TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (100%)`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
