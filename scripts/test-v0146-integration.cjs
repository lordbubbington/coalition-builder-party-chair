/**
 * Master Verification & Integration Test Suite for Version 0.14.6
 * Target: scripts/test-v0146-integration.cjs
 *
 * Objectives (Covering all 5 Subsystem Tests from Section 3 of VERSION_0.14.6_DESIGN.md):
 * 1. Targeted Inter-Party Realignment (REQ-143 / BUG-07):
 *    - When Greens gain voters in post-election realignment, voters are deducted from Democrats and credited to Greens.
 *    - Independent voters and rival minor parties remain untouched.
 * 2. State-by-State Realignment Engine (REQ-144):
 *    - Overperforming in Oregon increases Green voter affiliation in Oregon while leaving other states unaffected.
 *    - Local gains persist in voterModel.states across cycles.
 * 3. Flat Growth Removal (REQ-145):
 *    - Cycling years from 2028 to 2030 does not automatically add a +6.09% flat population increase without GOTV actions.
 * 4. Dynamic GOTV Total Voter Registration Expansion (REQ-145):
 *    - Executing a Volunteer Drive in Wisconsin increases total registered & represented voters in Wisconsin without reducing Democratic or Republican voter counts.
 *    - applyGOTVRegistrationGain enriches acting party rolls without cannibalizing rival parties.
 * 5. National Accounting Balance:
 *    - Sum of all state-level represented voters matches voterModel.representedVoters.
 *    - Sum of all state-level party affiliations matches national affiliation records.
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

// Load script stack in canonical dependency order
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

  console.log('\n================================================================');
  console.log('MASTER VERIFICATION & INTEGRATION TEST SUITE (VERSION 0.14.6)');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // SUITE 1: Targeted Inter-Party Realignment Transfers (REQ-143 / BUG-07)
  // ---------------------------------------------------------------------------
  console.log('--- SUITE 1: Targeted Inter-Party Realignment Transfers (REQ-143 / BUG-07) ---');

  const game1 = Engine.createGame('green');
  const demBefore = game1.voterModel.affiliations.people.representedVoters;
  const greenBefore = (game1.voterModel.affiliations.thirdParty.byParty.green || 0) * 100;
  const indBefore = game1.voterModel.affiliations.independent.representedVoters;
  const repBefore = game1.voterModel.affiliations.heritage.representedVoters;

  assert(demBefore > 0, `Initial Democratic voters exist: ${demBefore.toLocaleString()}`);
  assert(greenBefore > 0, `Initial Green voters exist: ${greenBefore.toLocaleString()}`);
  assert(indBefore > 0, `Initial Independent voters exist: ${indBefore.toLocaleString()}`);

  // Simulate national election where Greens overperform expected baseline (e.g. 5.0% vs ~1.4%)
  const nationalOutcome = {
    nationalVote: {
      green: 5.0,
      player: 5.0,
    },
  };

  const realignment1 = Engine.realignVotingBlocksBetweenElections(game1, nationalOutcome);

  const demAfter = realignment1.voterModel.affiliations.people.representedVoters;
  const greenAfter = (realignment1.voterModel.affiliations.thirdParty.byParty.green || 0) * 100;
  const indAfter = realignment1.voterModel.affiliations.independent.representedVoters;
  const repAfter = realignment1.voterModel.affiliations.heritage.representedVoters;

  const greenGain = greenAfter - greenBefore;
  const demLoss = demBefore - demAfter;

  assert(greenGain > 0, `Green party gained voters after overperforming (gained: +${greenGain.toLocaleString()} voters)`);
  assert(demLoss > 0, `Democratic party lost voters after Green overperformed (lost: -${demLoss.toLocaleString()} voters)`);
  assert(greenGain === demLoss, `Exact 1:1 ideological transfer: Green gain (+${greenGain.toLocaleString()}) matches Democratic loss (-${demLoss.toLocaleString()})`);
  assert(indAfter === indBefore, `Independent voter pool is untouched by targeted partisan transfers (${indAfter.toLocaleString()} === ${indBefore.toLocaleString()})`);
  assert(repAfter === repBefore, `Republican voter pool is untouched when Greens trade with Democrats (${repAfter.toLocaleString()} === ${repBefore.toLocaleString()})`);

  // Verify Republican / Libertarian ideological counter-pair
  const repGame = Engine.createGame('liberty');
  const repVotersBefore = repGame.voterModel.affiliations.heritage.representedVoters;
  const libVotersBefore = (repGame.voterModel.affiliations.thirdParty.byParty.liberty || 0) * 100;
  const demVotersBefore = repGame.voterModel.affiliations.people.representedVoters;

  const libOutcome = {
    nationalVote: {
      liberty: 6.0,
      player: 6.0,
    },
  };

  const realignmentLib = Engine.realignVotingBlocksBetweenElections(repGame, libOutcome);
  const repVotersAfter = realignmentLib.voterModel.affiliations.heritage.representedVoters;
  const libVotersAfter = (realignmentLib.voterModel.affiliations.thirdParty.byParty.liberty || 0) * 100;
  const demVotersAfter = realignmentLib.voterModel.affiliations.people.representedVoters;

  const libGain = libVotersAfter - libVotersBefore;
  const repLoss = repVotersBefore - repVotersAfter;

  assert(libGain > 0, `Libertarian party gained voters when overperforming (+${libGain.toLocaleString()})`);
  assert(repLoss > 0, `Republican party lost voters when Libertarians overperformed (-${repLoss.toLocaleString()})`);
  assert(libGain === repLoss, `Exact 1:1 transfer: Libertarian gain (+${libGain.toLocaleString()}) matches Republican loss (-${repLoss.toLocaleString()})`);
  assert(demVotersAfter === demVotersBefore, `Democratic voter pool is untouched when Libertarians trade with Republicans (${demVotersAfter.toLocaleString()} === ${demVotersBefore.toLocaleString()})`);

  // ---------------------------------------------------------------------------
  // SUITE 2: State-by-State Electorate Realignment Engine (REQ-144)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 2: State-by-State Electorate Realignment Engine (REQ-144) ---');

  const game2 = Engine.createGame('green');
  const orStateBefore = game2.voterModel.states.find((s) => s.stateId === 'OR');
  const waStateBefore = game2.voterModel.states.find((s) => s.stateId === 'WA');
  const caStateBefore = game2.voterModel.states.find((s) => s.stateId === 'CA');

  const orGreenSampleBefore = orStateBefore.affiliations.green;
  const orDemSampleBefore = orStateBefore.affiliations.people;
  const orRepSampleBefore = orStateBefore.affiliations.heritage;

  const waGreenSampleBefore = waStateBefore.affiliations.green;
  const waDemSampleBefore = waStateBefore.affiliations.people;

  const caGreenSampleBefore = caStateBefore.affiliations.green;
  const caDemSampleBefore = caStateBefore.affiliations.people;

  assert(orGreenSampleBefore > 0, `Oregon initial Green sample voters: ${orGreenSampleBefore}`);
  assert(orDemSampleBefore > 0, `Oregon initial Democratic sample voters: ${orDemSampleBefore}`);

  // Outcome with targeted overperformance in Oregon ONLY (e.g. Greens won 8.0% in OR)
  const targetedOutcome = {
    states: [
      {
        stateId: 'OR',
        shares: {
          green: 8.0,
        },
      },
    ],
  };

  const realignment2 = Engine.realignVotingBlocksBetweenElections(game2, targetedOutcome);

  const orStateAfter = realignment2.voterModel.states.find((s) => s.stateId === 'OR');
  const waStateAfter = realignment2.voterModel.states.find((s) => s.stateId === 'WA');
  const caStateAfter = realignment2.voterModel.states.find((s) => s.stateId === 'CA');

  const orGreenSampleAfter = orStateAfter.affiliations.green;
  const orDemSampleAfter = orStateAfter.affiliations.people;
  const orRepSampleAfter = orStateAfter.affiliations.heritage;

  const waGreenSampleAfter = waStateAfter.affiliations.green;
  const waDemSampleAfter = waStateAfter.affiliations.people;

  const caGreenSampleAfter = caStateAfter.affiliations.green;
  const caDemSampleAfter = caStateAfter.affiliations.people;

  const orGreenDelta = orGreenSampleAfter - orGreenSampleBefore;
  const orDemDelta = orDemSampleBefore - orDemSampleAfter;

  assert(orGreenDelta > 0, `Oregon Green voter affiliation increased after overperforming in OR (+${orGreenDelta} sample voters)`);
  assert(orDemDelta > 0, `Oregon Democratic voter affiliation decreased to feed Green growth (-${orDemDelta} sample voters)`);
  assert(orGreenDelta === orDemDelta, `Exact local conservation in Oregon: Green gain (+${orGreenDelta}) === Dem loss (-${orDemDelta})`);
  assert(orRepSampleAfter === orRepSampleBefore, `Oregon Republican voters unaffected by Green-Democratic left consolidation`);

  // Other states remain strictly unaffected
  assert(waGreenSampleAfter === waGreenSampleBefore, `Washington Green sample voters completely unaffected (${waGreenSampleAfter} === ${waGreenSampleBefore})`);
  assert(waDemSampleAfter === waDemSampleBefore, `Washington Democratic sample voters completely unaffected (${waDemSampleAfter} === ${waDemSampleBefore})`);
  assert(caGreenSampleAfter === caGreenSampleBefore, `California Green sample voters completely unaffected (${caGreenSampleAfter} === ${caGreenSampleBefore})`);
  assert(caDemSampleAfter === caDemSampleBefore, `California Democratic sample voters completely unaffected (${caDemSampleAfter} === ${caDemSampleBefore})`);

  // ---------------------------------------------------------------------------
  // SUITE 3: Flat Growth Removal (REQ-145)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 3: Flat Growth Removal (REQ-145) ---');

  const game3 = Engine.createGame('people');
  const initialYear = game3.year;
  const initialVoters = game3.voterModel.representedVoters;
  const initialSample = game3.voterModel.sampleVoters;

  assert(initialYear === 2028, `Game starts in cycle year 2028`);
  assert(initialVoters === 155_000_000, `Initial represented voters baseline is 155,000,000`);

  // Transition cycle 2028 -> 2030 without GOTV actions (phase must be 'complete' after election)
  const completed2028 = { ...game3, phase: 'complete' };
  const nextCycle = Engine.startNextCycle(completed2028);

  assert(nextCycle.year === 2030, `Cycle transitioned to 2030`);
  assert(nextCycle.voterModel.representedVoters === initialVoters, `No automatic +6.09% flat growth: represented voters remain exact (${nextCycle.voterModel.representedVoters.toLocaleString()} === ${initialVoters.toLocaleString()})`);
  assert(nextCycle.voterModel.sampleVoters === initialSample, `Sample voters remain exact without artificial inter-cycle expansion`);

  // Verify per-state represented voters also have zero automatic inflation
  const paBefore = game3.voterModel.states.find((s) => s.stateId === 'PA');
  const paAfter = nextCycle.voterModel.states.find((s) => s.stateId === 'PA');
  assert(paAfter.representedVoters === paBefore.representedVoters, `Pennsylvania represented voters did NOT inflate automatically (${paAfter.representedVoters} === ${paBefore.representedVoters})`);

  // ---------------------------------------------------------------------------
  // SUITE 4: Dynamic GOTV Total Voter Registration Expansion (REQ-145)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 4: Dynamic GOTV Total Registration Expansion (REQ-145) ---');

  const game4 = Engine.createGame('people');
  const campGame = Engine.startCampaignPhase(game4);

  const wiStateBefore = campGame.voterModel.states.find((s) => s.stateId === 'WI');
  const wiRegBefore = (wiStateBefore.registeredVoters !== undefined) ? wiStateBefore.registeredVoters : wiStateBefore.representedVoters;
  const wiRepVotersBefore = wiStateBefore.representedVoters;
  const wiDemAffBefore = wiStateBefore.affiliations.people;
  const wiRepAffBefore = wiStateBefore.affiliations.heritage;
  const natVotersBefore = campGame.voterModel.representedVoters;

  assert(wiRegBefore > 0, `Wisconsin initial registered voters: ${wiRegBefore.toLocaleString()}`);

  // Execute Volunteer Drive in Wisconsin
  const driveResult = (Engine.executeVolunteerDrive || Engine.campaignVolunteerDrive)(campGame, 'WI');

  const wiStateAfter = driveResult.voterModel.states.find((s) => s.stateId === 'WI');
  const wiRegAfter = wiStateAfter.registeredVoters;
  const wiRepVotersAfter = wiStateAfter.representedVoters;
  const wiDemAffAfter = wiStateAfter.affiliations.people;
  const wiRepAffAfter = wiStateAfter.affiliations.heritage;
  const natVotersAfter = driveResult.voterModel.representedVoters;

  const gainedVoters = driveResult.campaign.lastVolunteerDrive.voters;
  assert(gainedVoters >= 500 && gainedVoters <= 10000, `Volunteer drive registered valid voter batch (+${gainedVoters.toLocaleString()})`);

  assert(wiRegAfter === wiRegBefore + gainedVoters, `Wisconsin registered voters expanded by exact gained voters count (${wiRegAfter.toLocaleString()} === ${(wiRegBefore + gainedVoters).toLocaleString()})`);
  assert(wiRepVotersAfter === wiRepVotersBefore + gainedVoters, `Wisconsin represented voters expanded by exact gained voters count`);
  assert(wiDemAffAfter === wiDemAffBefore + Math.round(gainedVoters / 100), `Democratic sample affiliation increased by exact gained sample delta`);
  assert(wiRepAffAfter === wiRepAffBefore, `Rival Republican voter counts were NOT cannibalized or reduced (${wiRepAffAfter} === ${wiRepAffBefore})`);
  assert(natVotersAfter === natVotersBefore + gainedVoters, `National represented voter pie expanded dynamically (+${gainedVoters.toLocaleString()})`);

  // Verify applyGOTVRegistrationGain helper export
  assert(typeof Engine.applyGOTVRegistrationGain === 'function', `applyGOTVRegistrationGain is exported on window.PartyChairEngine`);
  const testVm = JSON.parse(JSON.stringify(campGame.voterModel));
  const preGain = testVm.states.find((s) => s.stateId === 'NC').representedVoters;
  Engine.applyGOTVRegistrationGain(testVm, 'NC', 5000, 'people');
  const postGain = testVm.states.find((s) => s.stateId === 'NC').representedVoters;
  assert(postGain === preGain + 5000, `applyGOTVRegistrationGain directly expands state represented voters (+5,000)`);

  // ---------------------------------------------------------------------------
  // SUITE 5: National Accounting Balance
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 5: National Accounting Balance ---');

  // Verify across multiple complex operations
  const game5 = Engine.createGame('green');
  Engine.applyGOTVRegistrationGain(game5.voterModel, 'OR', 10000, 'green');
  Engine.applyGOTVRegistrationGain(game5.voterModel, 'ME', 7500, 'green');
  Engine.applyGOTVRegistrationGain(game5.voterModel, 'PA', 15000, 'people');

  const multiOutcome = {
    states: [
      { stateId: 'OR', shares: { green: 10.0, people: 45.0, heritage: 43.0, liberty: 1.5, constitution: 0.2, socialist: 0.3 } },
      { stateId: 'ME', shares: { green: 8.5, people: 46.0, heritage: 43.5, liberty: 1.5, constitution: 0.2, socialist: 0.3 } },
    ],
    nationalVote: { people: 47.0, heritage: 47.0, green: 3.5, liberty: 1.8, constitution: 0.3, socialist: 0.4 },
  };

  const postElection = Engine.realignVotingBlocksBetweenElections(game5, multiOutcome);
  const vmStateSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.representedVoters || 0), 0);
  const natRepVoters = postElection.voterModel.representedVoters;

  assert(vmStateSum === natRepVoters, `National represented voters strictly equals sum of all state represented voters (${vmStateSum.toLocaleString()} === ${natRepVoters.toLocaleString()})`);

  // Sum of state sample voters matches national sample voters
  const vmSampleSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.sampleVoters || 0), 0);
  assert(vmSampleSum === postElection.voterModel.sampleVoters, `National sample voters strictly equals sum of all state sample voters (${vmSampleSum.toLocaleString()} === ${postElection.voterModel.sampleVoters.toLocaleString()})`);

  // Democratic party national accounting
  const stateDemSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.affiliations.people || 0), 0) * 100;
  const natDemTotal = postElection.voterModel.affiliations.people.representedVoters;
  assert(stateDemSum === natDemTotal, `Democratic national represented total matches sum of state records (${stateDemSum.toLocaleString()} === ${natDemTotal.toLocaleString()})`);

  // Republican party national accounting
  const stateRepSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.affiliations.heritage || 0), 0) * 100;
  const natRepTotal = postElection.voterModel.affiliations.heritage.representedVoters;
  assert(stateRepSum === natRepTotal, `Republican national represented total matches sum of state records (${stateRepSum.toLocaleString()} === ${natRepTotal.toLocaleString()})`);

  // Green party national accounting
  const stateGreenSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.affiliations.green || 0), 0) * 100;
  const natGreenTotal = (postElection.voterModel.affiliations.thirdParty.byParty.green || 0) * 100;
  assert(stateGreenSum === natGreenTotal, `Green party national represented total matches sum of state records (${stateGreenSum.toLocaleString()} === ${natGreenTotal.toLocaleString()})`);

  // Independent voters national accounting
  const stateIndSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.affiliations.independent || 0), 0) * 100;
  const natIndTotal = postElection.voterModel.affiliations.independent.representedVoters;
  assert(stateIndSum === natIndTotal, `Independent national represented total matches sum of state records (${stateIndSum.toLocaleString()} === ${natIndTotal.toLocaleString()})`);

  // Libertarian party national accounting
  const stateLibSum = postElection.voterModel.states.reduce((sum, s) => sum + (s.affiliations.liberty || 0), 0) * 100;
  const natLibTotal = (postElection.voterModel.affiliations.thirdParty.byParty.liberty || 0) * 100;
  assert(stateLibSum === natLibTotal, `Libertarian party national represented total matches sum of state records (${stateLibSum.toLocaleString()} === ${natLibTotal.toLocaleString()})`);

  console.log('\n================================================================');
  console.log(`SUMMARY: All ${passedTests}/${totalTests} Version 0.14.6 tests passed successfully!`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
  process.exit(1);
});
