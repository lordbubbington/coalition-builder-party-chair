/**
 * Test to verify socialist and third-party state voter registration table fix
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
    _dump: () => store,
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

function loadFile(relPath) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  const code = fs.readFileSync(fullPath, 'utf8');
  vm.runInContext(code, ctx, { filename: relPath });
}

loadFile('data.js');
loadFile('factions-0.15.js');
loadFile('scenario-2028.js');
loadFile('issues-0.2.1.js');
loadFile('maps-0.3.js');
loadFile('state-house-data-0.5.js');
loadFile('voter-model-0.5.js');
loadFile('demographics-0.9.js');
loadFile('political-trends-system.js');
loadFile('v07-scaffolding.js');
loadFile('engine.js');
loadFile('app.js');

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

async function runTests() {
  await waitForApp();

  const Engine = sandbox.window.PartyChairEngine;
  const App = sandbox.window.PartyChairApp;
  const Data = sandbox.window.PartyChairData;

  console.log('================================================================');
  console.log(' TEST: SOCIALIST STATE-BY-STATE REGISTRATION FIX');
  console.log('================================================================\n');

  // 1. Create a game as Socialist
  const game = Engine.createGame({ baseTemplateId: 'socialist' });

  // Check state affiliations at baseline
  const st0Start = game.voterModel.states[0];
  assert(st0Start.affiliations.socialist !== undefined, `State 0 affiliations has socialist at initialization (got ${st0Start.affiliations.socialist})`);

  const caStart = game.voterModel.states.find((s) => (s.stateId || s.id) === 'CA');
  assert(caStart.affiliations.socialist > 0, `California has non-zero socialist affiliation at baseline (got ${caStart.affiliations.socialist})`);

  // 2. Simulate election outcome where Socialists receive 10% of the vote across states
  const outcome = {
    type: 'presidential',
    year: 2028,
    presidentialResults: {},
    nationalVote: { socialist: 10, people: 45, heritage: 45 },
  };
  game.voterModel.states.forEach((st) => {
    const stId = st.stateId || st.id;
    outcome.presidentialResults[stId] = {
      shares: { socialist: 10, people: 45, heritage: 45 },
    };
  });

  const postRealignment = Engine.realignVotingBlocksBetweenElections(game, outcome);
  const postGame = {
    ...game,
    voterModel: postRealignment.voterModel,
    phase: 'complete',
  };

  // Check national socialist total
  const catalog = Engine.getFactionsCatalog ? Engine.getFactionsCatalog() : Data.FACTIONS_CATALOG;
  const socFactions = catalog.filter((f) => f.partyId === 'socialist');
  let totalSocNational = 0;
  socFactions.forEach((f) => {
    totalSocNational += (postGame.voterModel.factions[f.id] || 0);
  });
  console.log(`National Socialist Faction Voters: ${totalSocNational.toLocaleString()} (~${(totalSocNational / 1_000_000).toFixed(2)}M)`);
  assert(totalSocNational > 3_000_000, `National Socialist voters is at ~4M (got ${totalSocNational.toLocaleString()})`);

  // 3. Render State Voter Registration Table via App
  const tableHtml = App.renderStateVoterRegistrationTable(postGame);
  assert(Boolean(tableHtml) && tableHtml.length > 0, 'renderStateVoterRegistrationTable generated table HTML');

  // Ensure no state row has 0K in the Socialist column
  assert(!tableHtml.includes('color:#e86464">0K'), 'No state row in the Socialist column displays 0K');

  // Verify that every state in the table has a non-zero socialist count
  let allStatesHaveSocVoters = true;
  let totalSocFromStates = 0;
  postGame.voterModel.states.forEach((st) => {
    const sumSoc = socFactions.reduce((acc, f) => acc + (st.factions?.[f.id] || 0), 0);
    if (sumSoc === 0) allStatesHaveSocVoters = false;
    totalSocFromStates += sumSoc;
  });
  assert(allStatesHaveSocVoters, 'All 51 states + DC have non-zero socialist voters');
  assert(totalSocFromStates === totalSocNational, `Sum of state socialist voters (${totalSocFromStates.toLocaleString()}) matches national total (${totalSocNational.toLocaleString()})`);

  // 4. Test startNextCycle carryover
  const nextCycle = Engine.startNextCycle({
    ...postGame,
    phase: 'complete',
  });
  let nextCycleSoc = 0;
  socFactions.forEach((f) => {
    nextCycleSoc += (nextCycle.voterModel.factions[f.id] || 0);
  });
  assert(nextCycleSoc === totalSocNational, `startNextCycle preserves socialist faction total (got ${nextCycleSoc.toLocaleString()})`);

  // Verify state 0 affiliations in next cycle
  const st0Next = nextCycle.voterModel.states[0];
  assert(st0Next.affiliations.socialist > 0, `Next cycle state 0 has non-zero socialist affiliations (got ${st0Next.affiliations.socialist})`);

  console.log('\n================================================================');
  console.log(` ALL SOCIALIST REGISTRATION TESTS PASSED: ${passedTests}/${totalTests} (100%)`);
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
