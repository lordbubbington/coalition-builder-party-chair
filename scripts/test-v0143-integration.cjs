/**
 * Master Verification & Integration Test Suite for Version 0.14.3
 * Target: scripts/test-v0143-integration.cjs
 *
 * Objectives:
 * 1. Campaign Phase party candidate isolation & 3rd party nominee-only triage (Features 1 & 2)
 * 2. Libertarian starting race contestation quotas (Feature 3):
 *    - 100% active Senate, 100% active Gov, ~60% House
 * 3. Green starting race contestation quotas (Feature 4):
 *    - ~50% active Senate, ~50% active Gov, ~30% House
 * 4. State Legislature variable cost & 1-seat automatic contestation (Feature 5):
 *    - stateSlateCost(3) === 1, stateSlateCost(54) === 5, stateSlateCost(19) === 2
 *    - Action handler deducts variable EV-scaled cost + 1 action
 *    - Auto-contestation when stateHouseSeatCounts[stateId][partyId] >= 1
 *    - UI button displays "Contest Slate · $${cost}M (1 action)"
 * 5. Accurate minor party voter baselines (Feature 6):
 *    - modeledVotersForParty('green') === 500000
 *    - modeledVotersForParty('socialist') === 100000
 *    - modeledVotersForParty('constitution') === 100000
 *    - Affiliations: green=5000, socialist=1000, constitution=1000
 *    - Per-state allocations sum to these baselines
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
  console: console,
  Math: Math,
  JSON: JSON,
  Number: Number,
  Object: Object,
  Array: Array,
  String: String,
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
  localStorage: mockLocalStorage,
};
sandbox.window = sandbox;
sandbox.window.document = mockDocument;
const ctx = vm.createContext(sandbox);

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
  vm.runInContext(code, ctx);
}

// Load stack in canonical order
loadScript('data.js');
loadScript('scenario-2028.js');
loadScript('issues-0.2.1.js');
loadScript('maps-0.3.js');
loadScript('state-house-data-0.5.js');
loadScript('voter-model-0.5.js');
loadScript('demographics-0.9.js');
loadScript('political-trends-system.js');
loadScript('v07-scaffolding.js');
loadScript('engine.js');
loadScript('app.js');

async function waitForApp() {
  let tries = 0;
  while (!sandbox.window.PartyChairApp && tries < 50) {
    await new Promise((r) => setTimeout(r, 100));
    tries++;
  }
  if (!sandbox.window.PartyChairApp) {
    throw new Error('PartyChairApp failed to initialize on window');
  }
  console.log('  ✅ PASS: PartyChairApp initialized on window');
}

async function runSuite() {
  await waitForApp();

  const Engine = sandbox.window.PartyChairEngine;
  const Data = sandbox.window.PartyChairData;
  const App = sandbox.window.PartyChairApp;

  console.log('\n================================================================');
  console.log('MASTER VERIFICATION & INTEGRATION TEST SUITE (VERSION 0.14.3)');
  console.log('================================================================\n');

  // ============================================================================
  // SUITE 1: Candidate Funding & Campaign Phase Party Candidate Isolation (Features 1 & 2)
  // ============================================================================
  console.log('--- SUITE 1: Campaign Phase Candidate Isolation & Third Party Architecture ---');

  // Test Major Party candidate funding registration
  const demGame = Engine.createGame({ baseTemplateId: 'people' });
  demGame.phase = 'general-campaign';
  const demFundingResult = Engine.initializeCandidateFunding(demGame);
  const demFundingKeys = Object.keys(demFundingResult.candidateFunding);
  assert(demFundingKeys.length > 400, `Major party registers all congressional/gubernatorial races (got: ${demFundingKeys.length})`);

  // Test Minor Party candidate funding registration (Green Party with 1 winner)
  const greenGame = Engine.createGame({ baseTemplateId: 'green' });
  greenGame.phase = 'general-campaign';
  greenGame.primaryResults = [
    { raceId: 'house:ME-2', partyId: 'green', winnerName: 'Green Nominee', isIncumbent: false },
    { raceId: 'senate:VT', partyId: 'green', winnerName: 'Green Senator Nominee', isIncumbent: false },
  ];
  const greenFundingResult = Engine.initializeCandidateFunding(greenGame);
  const greenFundingKeys = Object.keys(greenFundingResult.candidateFunding);
  assert(greenFundingKeys.length === 2, `Minor party registers ONLY races with actual nominees (expected 2, got: ${greenFundingKeys.length})`);
  assert(greenFundingKeys.includes('house:ME-2'), 'Minor party candidate funding includes house:ME-2 nominee');
  assert(greenFundingKeys.includes('senate:VT'), 'Minor party candidate funding includes senate:VT nominee');

  // Weekly funding requests: suppressed for minor parties, active for major parties
  const greenWeekly = Engine.generateWeeklyRequests(greenGame, 1);
  assert(Array.isArray(greenWeekly) && greenWeekly.length === 0, 'Third parties return empty weekly funding requests (no Super PAC requests)');

  const demWeeklyGame = { ...demGame, candidateFunding: demFundingResult.candidateFunding };
  const demWeekly = Engine.generateWeeklyRequests(demWeeklyGame, 1);
  assert(Array.isArray(demWeekly) && demWeekly.length > 0, 'Major parties generate weekly candidate requests');

  // UI Markup: Grassroots Campaign Financing displayed for third parties
  App.setGame(greenGame);
  const greenDashboardHtml = App.campaignDashboardMarkup();
  assert(greenDashboardHtml.includes('Independent & Grassroots Campaign: Third parties do not operate Super PACs. Direct campaign assistance is funded from committee treasury.'), 'Grassroots financing text displayed in campaign dashboard for third parties');

  // ============================================================================
  // SUITE 2: Libertarian & Green Starting Race Contestation Quotas (Features 3 & 4)
  // ============================================================================
  console.log('\n--- SUITE 2: Libertarian & Green Starting Race Contestation Quotas ---');

  const ballotAccess = Engine.buildStartingBallotAccess(2028);
  const activeSenate = Engine.getActiveSenateRaces(null, 2028);
  const activeGov = Engine.getActiveGubernatorialStates(2028);
  const houseDistricts = Data.VERSION_01_HOUSE_DISTRICTS || [];

  // Libertarians: 100% active Senate, 100% active Gov, exactly 60% House
  const libSenateKeys = Object.keys(ballotAccess.liberty.senate || {});
  assert(libSenateKeys.length === activeSenate.length, `Libertarians contest 100% of active Senate states (${libSenateKeys.length}/${activeSenate.length})`);
  activeSenate.forEach((r) => {
    assert(ballotAccess.liberty.senate[r.state] === true, `Libertarians have Senate ballot access in ${r.state}`);
  });

  const libGovKeys = Object.keys(ballotAccess.liberty.governor || {});
  assert(libGovKeys.length === activeGov.length, `Libertarians contest 100% of active Gov states (${libGovKeys.length}/${activeGov.length})`);
  activeGov.forEach((st) => {
    assert(ballotAccess.liberty.governor[st] === true, `Libertarians have Gov ballot access in ${st}`);
  });

  const libHouseKeys = Object.keys(ballotAccess.liberty.house || {});
  const libHousePct = (libHouseKeys.length / houseDistricts.length) * 100;
  assert(libHousePct >= 55 && libHousePct <= 65, `Libertarians contest ~60% House districts (got: ${libHouseKeys.length}/${houseDistricts.length} = ${libHousePct.toFixed(1)}%)`);

  // Greens: ~50% active Senate, ~50% active Gov, ~30% House
  const greenSenateKeys = Object.keys(ballotAccess.green.senate || {});
  const greenSenatePct = (greenSenateKeys.length / activeSenate.length) * 100;
  assert(greenSenatePct >= 35 && greenSenatePct <= 65, `Greens contest ~50% active Senate states (got: ${greenSenateKeys.length}/${activeSenate.length} = ${greenSenatePct.toFixed(1)}%)`);

  const greenGovKeys = Object.keys(ballotAccess.green.governor || {});
  const greenGovPct = (greenGovKeys.length / activeGov.length) * 100;
  assert(greenGovPct >= 40 && greenGovPct <= 70, `Greens contest ~50% active Gov states (got: ${greenGovKeys.length}/${activeGov.length} = ${greenGovPct.toFixed(1)}%)`);

  const greenHouseKeys = Object.keys(ballotAccess.green.house || {});
  const greenHousePct = (greenHouseKeys.length / houseDistricts.length) * 100;
  assert(greenHousePct >= 25 && greenHousePct <= 35, `Greens contest ~30% House districts (got: ${greenHouseKeys.length}/${houseDistricts.length} = ${greenHousePct.toFixed(1)}%)`);

  // ============================================================================
  // SUITE 3: State Legislature Variable Cost & 1-Seat Automatic Contestation (Feature 5)
  // ============================================================================
  console.log('\n--- SUITE 3: State Legislature Variable Cost & Automatic Contestation ---');

  // Verify formula: stateSlateCost(stateEv)
  assert(Engine.stateSlateCost(3) === 1, 'stateSlateCost(3) === 1 ($1M for 3 EV states)');
  assert(Engine.stateSlateCost(54) === 5, 'stateSlateCost(54) === 5 ($5M for 54 EV states)');
  assert(Engine.stateSlateCost(19) === 2, 'stateSlateCost(19) === 2 ($2M for 19 EV states)');
  assert(Engine.stateSlateCost(10) === 2, 'stateSlateCost(10) === 2');
  assert(Engine.stateSlateCost(30) === 3, 'stateSlateCost(30) === 3');

  // Test action handler cost deductions
  const testMinorGame = Engine.createGame({ baseTemplateId: 'socialist' });
  testMinorGame.phase = 'organizing';
  testMinorGame.treasury = 50.0;
  testMinorGame.actionsLeft = 10;

  // WY (EV 3) -> should deduct $1M
  const wyStartTreasury = testMinorGame.treasury;
  const wyAfter = Engine.takeAction(testMinorGame, { actionId: 'contest-state-legislative-slate', stateId: 'WY' });
  assert(wyAfter.contestedStateLegSlates?.WY === true, 'WY slate marked as contested');
  assert(Number((wyStartTreasury - wyAfter.treasury).toFixed(1)) === 1.0, 'Contesting WY (EV 3) costs exactly $1.0M treasury');
  assert(wyAfter.actionsLeft === 9, 'Contesting WY costs 1 action');

  // PA (EV 19) -> should deduct $2M
  const paStartTreasury = wyAfter.treasury;
  const paAfter = Engine.takeAction(wyAfter, { actionId: 'contest-state-legislative-slate', stateId: 'PA' });
  assert(paAfter.contestedStateLegSlates?.PA === true, 'PA slate marked as contested');
  assert(Number((paStartTreasury - paAfter.treasury).toFixed(1)) === 2.0, 'Contesting PA (EV 19) costs exactly $2.0M treasury');

  // CA (EV 54) -> should deduct $5M
  const caStartTreasury = paAfter.treasury;
  const caAfter = Engine.takeAction(paAfter, { actionId: 'contest-state-legislative-slate', stateId: 'CA' });
  assert(caAfter.contestedStateLegSlates?.CA === true, 'CA slate marked as contested');
  assert(Number((caStartTreasury - caAfter.treasury).toFixed(1)) === 5.0, 'Contesting CA (EV 54) costs exactly $5.0M treasury');

  // Automatic contestation rule when stateHouseSeatCounts[stateId][partyId] >= 1
  const autoGame = Engine.createGame({ baseTemplateId: 'liberty' });
  autoGame.stateHouseSeatCounts = autoGame.stateHouseSeatCounts || {};
  autoGame.stateHouseSeatCounts.NH = { ...autoGame.stateHouseSeatCounts.NH, liberty: 2 };
  const normalizedAuto = Engine.normalizeGame(autoGame);
  assert(normalizedAuto.contestedStateLegSlates?.NH === true, 'State with >= 1 incumbent seat (NH) is automatically contested');

  // Attempting to re-contest an automatically contested slate should be prevented
  normalizedAuto.phase = 'organizing';
  normalizedAuto.treasury = 20.0;
  normalizedAuto.actionsLeft = 5;
  const recontest = Engine.takeAction(normalizedAuto, { actionId: 'contest-state-legislative-slate', stateId: 'NH' });
  assert(recontest.treasury === 20.0, 'Re-contesting an automatically contested slate does not deduct funds');

  // UI Button in app.js: displays EV-scaled cost
  App.setGame(testMinorGame);
  const stateLegHtml = App.step4StateLegMarkup();
  assert(stateLegHtml.includes('Contest Slate · $1M (1 action)'), 'Step 4 UI renders EV-scaled cost button: Contest Slate · $1M (1 action)');
  assert(stateLegHtml.includes('Contest Slate · $5M (1 action)'), 'Step 4 UI renders EV-scaled cost button: Contest Slate · $5M (1 action)');

  // ============================================================================
  // SUITE 4: Minor Party Accurate Starting Voter Scalings (Feature 6)
  // ============================================================================
  console.log('\n--- SUITE 4: Minor Party Starting Voter Scalings ---');

  const baselineGame = Engine.createGame({ baseTemplateId: 'people' });
  const vmAffiliations = baselineGame.voterModel?.affiliations;

  assert(vmAffiliations?.thirdParty?.byParty?.green === 5000, `Green party sample voter baseline is exactly 5000 (got: ${vmAffiliations?.thirdParty?.byParty?.green})`);
  assert(vmAffiliations?.thirdParty?.byParty?.socialist === 1000, `Socialist party sample voter baseline is exactly 1000 (got: ${vmAffiliations?.thirdParty?.byParty?.socialist})`);
  assert(vmAffiliations?.thirdParty?.byParty?.constitution === 1000, `Constitution party sample voter baseline is exactly 1000 (got: ${vmAffiliations?.thirdParty?.byParty?.constitution})`);

  // Verify per-state allocations sum to baseline totals
  const states = baselineGame.voterModel?.states || [];
  let sumGreen = 0;
  let sumSoc = 0;
  let sumConst = 0;
  states.forEach((st) => {
    sumGreen += (st.affiliations?.green || 0);
    sumSoc += (st.affiliations?.socialist || 0);
    sumConst += (st.affiliations?.constitution || 0);
  });
  assert(sumGreen === 5000, `Sum of state sample green voters equals exactly 5000 (got: ${sumGreen})`);
  assert(sumSoc === 1000, `Sum of state sample socialist voters equals exactly 1000 (got: ${sumSoc})`);
  assert(sumConst === 1000, `Sum of state sample constitution voters equals exactly 1000 (got: ${sumConst})`);

  // Test modeledVotersForParty in app.js
  App.setGame(baselineGame);
  const greenVoters = App.modeledVotersForParty('green');
  const socVoters = App.modeledVotersForParty('socialist');
  const constVoters = App.modeledVotersForParty('constitution');

  assert(greenVoters === 500000, `modeledVotersForParty('green') === 500000 (got: ${greenVoters})`);
  assert(socVoters === 100000, `modeledVotersForParty('socialist') === 100000 (got: ${socVoters})`);
  assert(constVoters === 100000, `modeledVotersForParty('constitution') === 100000 (got: ${constVoters})`);

  console.log('\n================================================================');
  console.log(`SUMMARY: All ${passedTests}/${totalTests} Version 0.14.3 tests passed successfully!`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ TEST RUNNER ABORTED WITH ERROR:\n', err);
  process.exit(1);
});
