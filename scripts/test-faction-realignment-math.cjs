/**
 * Specific Verification Test for 1/4th Vote-to-Membership Shift Rule
 * Target: scripts/test-faction-realignment-math.cjs
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

// Load script stack in canonical dependency order
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

const Engine = sandbox.PartyChairEngine;
const App = sandbox.PartyChairApp;
const Data = sandbox.PartyChairData;

console.log('================================================================');
console.log(' TEST SUITE: 1/4TH VOTE-TO-MEMBERSHIP REALIGNMENT SHIFT RULE');
console.log('================================================================\n');

const catalog = Engine.getFactionsCatalog ? Engine.getFactionsCatalog() : Data.FACTIONS_CATALOG;
const greenFactions = catalog.filter((f) => f.partyId === 'green');

// ============================================================================
// PART 1: Natural Baseline Game Realignment Check
// ============================================================================
console.log('--- SCENARIO 1: Natural Baseline Game (493,400 Starting Members) ---');
{
  const game = Engine.createGame({ baseTemplateId: 'green' });
  let initialGreenMembers = 0;
  game.voterModel.states.forEach((st) => {
    greenFactions.forEach((f) => {
      initialGreenMembers += (st.factions?.[f.id] || 0);
    });
  });
  assert(initialGreenMembers === 493_400, `Natural Baseline Green Members is 493,400 (got ${initialGreenMembers})`);

  // Target 11,000,000 votes nationally
  const targetVotes = 11_000_000;
  const greenVoteShare = (targetVotes / 155_000_000) * 100;

  const presResults = {};
  game.voterModel.states.forEach((st) => {
    const stId = st.stateId || st.id;
    presResults[stId] = {
      shares: {
        people: 46.0,
        heritage: 46.0,
        green: greenVoteShare,
        liberty: 0.5,
        constitution: 0.2,
        socialist: 0.2,
      },
    };
  });

  const outcome = {
    type: 'presidential',
    year: 2028,
    presidentialResults: presResults,
    nationalVote: {
      green: greenVoteShare,
      people: 46.0,
      heritage: 46.0,
      liberty: 0.5,
      constitution: 0.2,
      socialist: 0.2,
    },
  };

  const realigned = Engine.realignVotingBlocksBetweenElections(game, outcome);
  const vmAfter = realigned.voterModel;

  let postGreenMembers = 0;
  vmAfter.states.forEach((st) => {
    greenFactions.forEach((f) => {
      postGreenMembers += (st.factions?.[f.id] || 0);
    });
  });

  const excessVotes = targetVotes - initialGreenMembers;
  const expectedGain = Math.round(excessVotes / 4);
  const actualGain = postGreenMembers - initialGreenMembers;

  console.log(`Initial Green Members: ${initialGreenMembers.toLocaleString()}`);
  console.log(`Actual Votes Cast: ${targetVotes.toLocaleString()}`);
  console.log(`Excess Votes: ${excessVotes.toLocaleString()}`);
  console.log(`Expected 1/4th Gain: ${expectedGain.toLocaleString()} (~2,626,650)`);
  console.log(`Actual Member Gain: ${actualGain.toLocaleString()}`);
  console.log(`Post-Realignment Total: ${postGreenMembers.toLocaleString()}`);

  assert(Math.abs(actualGain - expectedGain) <= 51, `Gain matches 1/4th excess votes within rounding tolerance: delta diff = ${Math.abs(actualGain - expectedGain)}`);

  // Verify Zero Variance across all 51 states
  let totRep = 0;
  let hasStateVariance = false;
  vmAfter.states.forEach((st) => {
    const stFactionsSum = catalog.reduce((acc, f) => acc + (st.factions?.[f.id] || 0), 0);
    if (stFactionsSum !== st.representedVoters) {
      console.error(`State ${st.stateId} mismatch: factions ${stFactionsSum} !== rep ${st.representedVoters}`);
      hasStateVariance = true;
    }
    totRep += st.representedVoters;
  });
  assert(!hasStateVariance, 'All 51 states strictly preserve zero variance (state.factions sum === st.representedVoters)');
  assert(totRep === 155_000_000, `National total represented voters preserved at 155,000,000 (got ${totRep})`);

  // Verify National Faction Rollup
  let allFactionsMatch = true;
  for (const f of catalog) {
    const nat = vmAfter.factions[f.id];
    const sum = vmAfter.states.reduce((acc, st) => acc + (st.factions?.[f.id] || 0), 0);
    if (nat !== sum) {
      allFactionsMatch = false;
      console.error(`Faction mismatch for ${f.id}: nat=${nat}, sum=${sum}`);
      break;
    }
  }
  assert(allFactionsMatch, 'All national faction counts in voterModel.factions strictly equal state faction sums');

  // Verify startNextCycle preserves these faction totals
  const nextGame = Engine.startNextCycle({
    ...game,
    phase: 'complete',
    voterModel: vmAfter,
  });
  let nextCycleGreen = 0;
  greenFactions.forEach((f) => {
    nextCycleGreen += (nextGame.voterModel.factions[f.id] || 0);
  });
  assert(nextCycleGreen === postGreenMembers, `startNextCycle preserves updated Green faction counts: ${nextCycleGreen}`);
}

// ============================================================================
// PART 2: Exactly 1,000,000 Starting Members Scenario
// User Prompt: "if I get 11,000,000 votes as the greens, and have 1,000,000 members, I gain 2,500,000 new members."
// ============================================================================
console.log('\n--- SCENARIO 2: Exact User Case (1,000,000 Starting Members -> 11,000,000 Votes -> 2,500,000 Gained) ---');
{
  const game = Engine.createGame({ baseTemplateId: 'green' });

  // Normalize initial Green members to exactly 1,000,000 by adjusting state allocations against swing faction swg_true_centrists
  let currentGreen = 0;
  game.voterModel.states.forEach((st) => {
    greenFactions.forEach((f) => {
      currentGreen += (st.factions?.[f.id] || 0);
    });
  });

  const targetStart = 1_000_000;
  const neededAddition = targetStart - currentGreen; // 1,000,000 - 493,400 = 506,600
  let distributed = 0;

  game.voterModel.states.forEach((st, idx) => {
    const isLast = (idx === game.voterModel.states.length - 1);
    const slice = isLast ? (neededAddition - distributed) : Math.round(neededAddition / game.voterModel.states.length);
    st.factions[greenFactions[0].id] = (st.factions[greenFactions[0].id] || 0) + slice;
    st.factions['swg_true_centrists'] = (st.factions['swg_true_centrists'] || 0) - slice;
    distributed += slice;
  });

  // Verify starting count is exactly 1,000,000
  let verifiedStart = 0;
  game.voterModel.states.forEach((st) => {
    greenFactions.forEach((f) => {
      verifiedStart += (st.factions?.[f.id] || 0);
    });
  });
  assert(verifiedStart === 1_000_000, `Initial Green members normalized to exactly 1,000,000 (got ${verifiedStart})`);

  // Target 11,000,000 votes nationally
  const targetVotes = 11_000_000;
  const greenVoteShare = (targetVotes / 155_000_000) * 100;

  const presResults = {};
  game.voterModel.states.forEach((st) => {
    const stId = st.stateId || st.id;
    presResults[stId] = {
      shares: {
        people: 46.0,
        heritage: 46.0,
        green: greenVoteShare,
        liberty: 0.5,
        constitution: 0.2,
        socialist: 0.2,
      },
    };
  });

  const outcome = {
    type: 'presidential',
    year: 2028,
    presidentialResults: presResults,
    nationalVote: {
      green: greenVoteShare,
      people: 46.0,
      heritage: 46.0,
      liberty: 0.5,
      constitution: 0.2,
      socialist: 0.2,
    },
  };

  const realigned = Engine.realignVotingBlocksBetweenElections(game, outcome);
  const vmAfter = realigned.voterModel;

  let postGreenMembers = 0;
  vmAfter.states.forEach((st) => {
    greenFactions.forEach((f) => {
      postGreenMembers += (st.factions?.[f.id] || 0);
    });
  });

  const actualGain = postGreenMembers - verifiedStart;
  console.log(`Initial Green Members: ${verifiedStart.toLocaleString()}`);
  console.log(`Actual Votes Cast: ${targetVotes.toLocaleString()}`);
  console.log(`Excess Votes: ${(targetVotes - verifiedStart).toLocaleString()}`);
  console.log(`Target Gain: ${(10_000_000 / 4).toLocaleString()} = 2,500,000`);
  console.log(`Actual Member Gain: ${actualGain.toLocaleString()}`);
  console.log(`Post-Realignment Total: ${postGreenMembers.toLocaleString()}`);

  assert(Math.abs(actualGain - 2_500_000) <= 51, `User's exact condition verified: Green gained 2,500,000 members (got ${actualGain.toLocaleString()}, within rounding of 51 across 51 states)`);
  assert(Math.abs(postGreenMembers - 3_500_000) <= 51, `Green total is 3,500,000 members (got ${postGreenMembers.toLocaleString()})`);

  // Verify Zero Variance
  let totRep = 0;
  let hasStateVariance = false;
  vmAfter.states.forEach((st) => {
    const stFactionsSum = catalog.reduce((acc, f) => acc + (st.factions?.[f.id] || 0), 0);
    if (stFactionsSum !== st.representedVoters) {
      console.error(`State ${st.stateId} mismatch: factions ${stFactionsSum} !== rep ${st.representedVoters}`);
      hasStateVariance = true;
    }
    totRep += st.representedVoters;
  });
  assert(!hasStateVariance, 'Zero variance maintained across all 51 states in exact user case');
  assert(totRep === 155_000_000, `Total national represented voters preserved at 155,000,000`);

  // Verify National Faction Rollup
  let allFactionsMatch = true;
  for (const f of catalog) {
    const nat = vmAfter.factions[f.id];
    const sum = vmAfter.states.reduce((acc, st) => acc + (st.factions?.[f.id] || 0), 0);
    if (nat !== sum) {
      allFactionsMatch = false;
      console.error(`Faction mismatch for ${f.id}: nat=${nat}, sum=${sum}`);
      break;
    }
  }
  assert(allFactionsMatch, 'All national faction counts in voterModel.factions match state faction sums');
}

console.log('\n================================================================');
console.log(` ALL REALIGNMENT MATH CHECKS PASSED: ${passedTests}/${totalTests} (100%)`);
console.log('================================================================\n');
