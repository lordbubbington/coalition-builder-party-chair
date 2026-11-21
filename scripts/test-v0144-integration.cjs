/**
 * Master Verification & Integration Test Suite for Version 0.14.4
 * Target: scripts/test-v0144-integration.cjs
 *
 * Objectives (Covering all 8 Subsystem Tests from VERSION_0.14.4_DESIGN.md):
 * 1. Campaign Cadence: maxWeeks=5, weeklyActionsLeft=5, 5 months to Election Night (REQ-131, REQ-132)
 * 2. October Surprise Timing: Triggers specifically on Turn 4 (week === 4) (REQ-132)
 * 3. Senate Rotation: 2028 (Class 3) -> 2030 (Class 1) -> 2032 (Class 2) -> 2034 (Class 3) (REQ-137, REQ-138)
 * 4. Action Pool Reset: startNextCycle() resets organizingActionsRemaining=20 and actionsLeft=20 (REQ-129)
 * 5. State Slate Expiration: 0 seats won expires to uncontested; >=1 seat won retained as foothold (REQ-130)
 * 6. Trust Dampening: Choices awarding +3.0 trust apply +0.3 dampened trust (REQ-134)
 * 7. Minor Approval Ceiling: Minor parties capped at <= 25.0% national approval (REQ-135)
 * 8. Initial Vacancies: initializeLeadershipRolesForParty() produces null for rhetoricalLeader, policyLeader, and faction leaders (REQ-136)
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
  const V07 = sandbox.window.PartyChairV07;
  const App = sandbox.window.PartyChairApp;

  console.log('\n================================================================');
  console.log('MASTER VERIFICATION & INTEGRATION TEST SUITE (VERSION 0.14.4)');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // SUITE 1: Campaign Phase Cadence & Flavor Rebrand (REQ-131, REQ-132)
  // ---------------------------------------------------------------------------
  console.log('--- SUITE 1: Campaign Phase Cadence & Flavor Rebrand ---');
  let game = Engine.createGame('people');
  game = Engine.startCampaignPhase(game);

  assert(game.campaign.active === true, 'Campaign phase activated');
  assert(game.campaign.week === 1, 'Campaign initializes at Month 1');
  assert(game.campaign.maxWeeks === 5, 'Campaign maxWeeks is set to 5');
  assert(game.campaign.weeklyActionsLeft === 5, 'Campaign initializes with 5 monthly actions');

  App.setGame(game);
  let dashHtml = App.campaignDashboardMarkup();
  assert(dashHtml.includes('5-Month Campaign Command'), 'UI displays "5-Month Campaign Command"');
  assert(dashHtml.includes('Campaign Month 1 of 5'), 'UI displays "Campaign Month 1 of 5"');
  assert(dashHtml.includes('Monthly Actions'), 'UI displays "Monthly Actions" KPI');
  assert(dashHtml.includes('5/5'), 'UI displays 5/5 monthly actions available');
  assert(dashHtml.includes('Monthly Funding Requests (Month 1)'), 'UI displays "Monthly Funding Requests (Month 1)"');
  assert(dashHtml.includes('Advance to Campaign Month 2 of 5 →'), 'UI progression button targets Month 2 of 5');

  // Advance Month 1 -> 2
  game.campaign.weeklyActionsLeft = 2; // Spend 3 actions
  game = Engine.advanceCampaignWeek(game);
  assert(game.campaign.week === 2, 'Advances to Campaign Month 2');
  assert(game.campaign.weeklyActionsLeft === 5, 'Resets to 5 monthly actions in Month 2');

  // Advance Month 2 -> 3
  game = Engine.advanceCampaignWeek(game);
  assert(game.campaign.week === 3, 'Advances to Campaign Month 3');
  assert(game.campaign.weeklyActionsLeft === 5, 'Resets to 5 monthly actions in Month 3');

  // Advance Month 3 -> 4
  game = Engine.advanceCampaignWeek(game);
  assert(game.campaign.week === 4, 'Advances to Campaign Month 4');
  assert(game.campaign.weeklyActionsLeft === 5, 'Resets to 5 monthly actions in Month 4');

  // Advance Month 4 -> 5
  game = Engine.advanceCampaignWeek(game);
  assert(game.campaign.week === 5, 'Advances to Campaign Month 5');
  assert(game.campaign.weeklyActionsLeft === 5, 'Resets to 5 monthly actions in Month 5');

  App.setGame(game);
  dashHtml = App.campaignDashboardMarkup();
  assert(dashHtml.includes('Proceed to General Election Night 2028 ★'), 'Turn progression button on Month 5 targets Election Night');

  // Advance Month 5 -> Election Night
  game = Engine.advanceCampaignWeek(game);
  assert(game.phase === 'complete', 'Advancing past Month 5 concludes campaign and resolves Election Night');
  assert(Boolean(game.lastElection), 'General election outcome generated');

  // ---------------------------------------------------------------------------
  // SUITE 2: October Surprise Crisis Trigger Timing (REQ-132)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 2: October Surprise Crisis Trigger Timing ---');
  let testGame = Engine.createGame('people');
  const evMonth1 = Engine.drawCampaignEvent(testGame, 1);
  const evMonth2 = Engine.drawCampaignEvent(testGame, 2);
  const evMonth3 = Engine.drawCampaignEvent(testGame, 3);
  const evMonth4 = Engine.drawCampaignEvent(testGame, 4);
  const evMonth5 = Engine.drawCampaignEvent(testGame, 5);

  assert(!evMonth1.isOctoberSurprise, 'Month 1 event is not an October Surprise');
  assert(!evMonth2.isOctoberSurprise, 'Month 2 event is not an October Surprise');
  assert(!evMonth3.isOctoberSurprise, 'Month 3 event is not an October Surprise');
  assert(evMonth4.isOctoberSurprise === true, 'Month 4 event triggers October Surprise (isOctoberSurprise === true)');
  assert(evMonth4.week === 4, 'October Surprise event week stamped as Month 4');
  assert(!evMonth5.isOctoberSurprise, 'Month 5 event is not an October Surprise');

  // Verify UI rendering for Month 4 October Surprise
  let m4Game = Engine.createGame('people');
  m4Game = Engine.startCampaignPhase(m4Game);
  m4Game.campaign.week = 4;
  m4Game.campaign.currentEvent = evMonth4;
  App.setGame(m4Game);
  const m4Html = App.campaignDashboardMarkup();
  assert(m4Html.includes('OCTOBER SURPRISE (MONTH 4)'), 'UI displays breaking tag "🚨 BREAKING NEWS · OCTOBER SURPRISE (MONTH 4)"');

  // ---------------------------------------------------------------------------
  // SUITE 3: Polling & Consensus Forecast Maps Widget (REQ-133)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 3: Polling & Consensus Forecast Maps Widget ---');
  let campGame = Engine.createGame('people');
  campGame = Engine.startCampaignPhase(campGame);
  App.setGame(campGame);

  const pollWidget = App.campaignPollingMapMarkup();
  assert(pollWidget.includes('v08-campaign-polling-panel'), 'Campaign Polling Map widget renders panel container');
  assert(pollWidget.includes('Live Campaign Polling & Consensus Forecasts'), 'Widget contains consensus forecast headline');
  assert(pollWidget.includes('data-camp-poll-tab="senate"'), 'Widget contains Senators tab button');
  assert(pollWidget.includes('data-camp-poll-tab="house"'), 'Widget contains House tab button');
  assert(pollWidget.includes('data-camp-poll-tab="governor"'), 'Widget contains Governor tab button');
  assert(pollWidget.includes('data-camp-poll-tab="stateLeg"'), 'Widget contains State Legislature tab button');

  // Tab switching
  App.setCampaignPollingTab('senate');
  assert(App.getCampaignPollingTab() === 'senate', 'Polling tab set to senate');
  let senateMap = App.campaignPollingMapMarkup();
  assert(senateMap.includes('map-state-shape') || senateMap.includes('us-map-svg'), 'Senators map renders SVG states');

  App.setCampaignPollingTab('house');
  assert(App.getCampaignPollingTab() === 'house', 'Polling tab set to house');
  let houseMap = App.campaignPollingMapMarkup();
  assert(houseMap.includes('map-district'), 'House map renders 435 district paths');

  App.setCampaignPollingTab('governor');
  assert(App.getCampaignPollingTab() === 'governor', 'Polling tab set to governor');
  let govMap = App.campaignPollingMapMarkup();
  assert(govMap.includes('us-map-svg'), 'Governor map renders chamber SVG');

  App.setCampaignPollingTab('stateLeg');
  assert(App.getCampaignPollingTab() === 'stateLeg', 'Polling tab set to stateLeg');
  let legMap = App.campaignPollingMapMarkup();
  assert(legMap.includes('us-map-svg'), 'State Leg map renders chamber SVG');

  // Verify dashboard embeds widget directly above Grand Strategy Actions
  App.setCampaignPollingTab('senate');
  const fullDash = App.campaignDashboardMarkup();
  const pollIdx = fullDash.indexOf('v08-campaign-polling-panel');
  const stratIdx = fullDash.indexOf('Monthly Grand-Strategy Actions');
  assert(pollIdx !== -1 && stratIdx !== -1 && pollIdx < stratIdx, 'Polling widget embedded directly above Grand-Strategy Actions');

  // ---------------------------------------------------------------------------
  // SUITE 4: Biennial Constitutional Senate Class Rotation & Forecasters (REQ-137, REQ-138)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 4: Biennial Constitutional Senate Class Rotation & Forecasters ---');
  assert(Engine.getSenateClassForYear(2028) === 3, '2028 is Constitutional Senate Class III');
  assert(Engine.getSenateClassForYear(2030) === 1, '2030 is Constitutional Senate Class I');
  assert(Engine.getSenateClassForYear(2032) === 2, '2032 is Constitutional Senate Class II');
  assert(Engine.getSenateClassForYear(2034) === 3, '2034 is Constitutional Senate Class III');

  // Advance game from 2028 -> 2030 cycle
  let cycleGame = Engine.createGame('people');
  cycleGame.phase = 'complete';
  cycleGame.year = 2028;
  cycleGame.lastElection = {
    presidential: { winnerName: 'Jon Ossoff', demEv: 280, repEv: 258 },
    legislature: { seats: { people: 220, heritage: 215 } },
    senate: [],
  };

  let next2030 = Engine.startNextCycle(cycleGame);
  assert(next2030.year === 2030, 'Cycle advanced to year 2030');
  assert(next2030.activeSenateClass === 1, '2030 activeSenateClass is Class 1 (Class I)');
  assert(Array.isArray(next2030.activeSenateRaces) && next2030.activeSenateRaces.length === 33, '2030 Class I has 33 contested Senate races');
  assert(next2030.activeSenateRaces.some((r) => r.stateId === 'CA' || r.state === 'CA'), 'CA is contested in Class I (2030)');
  assert(!next2030.activeSenateRaces.some((r) => r.stateId === 'GA' || r.state === 'GA'), 'GA is NOT contested in Class I (it was Class III in 2028)');

  // Advance game from 2030 -> 2032 cycle
  next2030.phase = 'complete';
  let next2032 = Engine.startNextCycle(next2030);
  assert(next2032.year === 2032, 'Cycle advanced to year 2032');
  assert(next2032.activeSenateClass === 2, '2032 activeSenateClass is Class 2 (Class II)');
  assert(Array.isArray(next2032.activeSenateRaces) && next2032.activeSenateRaces.length === 33, '2032 Class II has 33 contested Senate races');
  assert(next2032.activeSenateRaces.some((r) => r.stateId === 'GA' || r.state === 'GA'), 'GA is contested in Class II (2032)');

  // Advance game from 2032 -> 2034 cycle
  next2032.phase = 'complete';
  let next2034 = Engine.startNextCycle(next2032);
  assert(next2034.year === 2034, 'Cycle advanced to year 2034');
  assert(next2034.activeSenateClass === 3, '2034 activeSenateClass rotates back to Class 3 (Class III)');

  // Forecaster scoping in UI (REQ-138)
  App.setGame(next2030);
  const forecaster2030 = App.forecastersMarkup();
  assert(forecaster2030.includes('Senate (Class I)'), '2030 Forecasters tab scoped to "Senate (Class I)"');
  assert(forecaster2030.includes('U.S. Senate Projection (Class I)'), '2030 Forecaster table heading displays "U.S. Senate Projection (Class I)"');

  App.setGame(next2032);
  const forecaster2032 = App.forecastersMarkup();
  assert(forecaster2032.includes('Senate (Class II)'), '2032 Forecasters tab scoped to "Senate (Class II)"');
  assert(forecaster2032.includes('U.S. Senate Projection (Class II)'), '2032 Forecaster table heading displays "U.S. Senate Projection (Class II)"');

  // ---------------------------------------------------------------------------
  // SUITE 5: Action Pool Reset & State Legislative Foothold (REQ-129, REQ-130)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 5: Action Pool Reset & State Legislative Foothold ---');
  let cycleTest = Engine.createGame('people');
  cycleTest.phase = 'complete';
  cycleTest.organizingActionsRemaining = 0;
  cycleTest.actionsLeft = 0;
  cycleTest.actionsSpentThisCycle = 20;
  cycleTest.recruitsThisCycle = 4;
  cycleTest.billsThisCycle = 3;

  let cycledGame = Engine.startNextCycle(cycleTest);
  assert(cycledGame.organizingActionsRemaining === 20, 'organizingActionsRemaining reset to 20 for new cycle');
  assert(cycledGame.actionsLeft === 20, 'actionsLeft reset to 20 for new cycle');
  assert(cycledGame.actionsSpentThisCycle === 0, 'actionsSpentThisCycle reset to 0');
  assert(cycledGame.recruitsThisCycle === 0, 'recruitsThisCycle reset to 0');
  assert(cycledGame.billsThisCycle === 0, 'billsThisCycle reset to 0');

  // State legislative foothold testing for minor/custom parties
  let minorCycleGame = Engine.createGame('green');
  minorCycleGame.phase = 'complete';
  minorCycleGame.year = 2028;
  minorCycleGame.contestedStateLegSlates = { WY: true, CA: true, NH: true };
  minorCycleGame.stateHouseSeatCounts = {
    WY: { green: 0 },
    CA: { green: 0 },
    NH: { green: 2 }, // 2 seats held = foothold established!
  };

  let cycledMinor = Engine.startNextCycle(minorCycleGame);
  assert(cycledMinor.contestedStateLegSlates['NH'] === true, 'NH retained as contested state slate (>=1 seat held = permanent foothold)');
  assert(cycledMinor.contestedStateLegSlates['WY'] === false, 'WY reverted to uncontested (0 seats held)');
  assert(cycledMinor.contestedStateLegSlates['CA'] === false, 'CA reverted to uncontested (0 seats held)');

  // ---------------------------------------------------------------------------
  // SUITE 6: Public & Coalition Trust Velocity Dampening (REQ-134)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 6: Public & Coalition Trust Velocity Dampening ---');
  let trustGame = Engine.createGame('people');
  trustGame = Engine.startCampaignPhase(trustGame);
  const initialSupporters = trustGame.trust.supporters;
  const initialIndependents = trustGame.trust.independents;

  // Custom campaign event with raw trust deltas: +3.0 supporters, -2.0 independents
  trustGame.campaign.currentEvent = {
    id: 'test-event-dampen',
    title: 'Test Event Trust Dampening',
    severity: 'medium',
    choices: [
      {
        label: 'Balanced Base Appeal',
        trust: { supporters: 3.0, independents: -2.0, opponents: 0 },
        budget: 0,
      },
    ],
  };

  const resolvedEventGame = Engine.applyCampaignEventChoice(trustGame, 0);
  const deltaSupporters = Math.round((resolvedEventGame.trust.supporters - initialSupporters) * 10) / 10;
  const deltaIndependents = Math.round((resolvedEventGame.trust.independents - initialIndependents) * 10) / 10;

  assert(deltaSupporters === 0.3, `Event choice with +3.0 raw supporters trust dampens to exactly +0.3 (got: ${deltaSupporters})`);
  assert(deltaIndependents === -0.2, `Event choice with -2.0 raw independents trust dampens to exactly -0.2 (got: ${deltaIndependents})`);

  // Endorse autopsy dampening (+4.0 raw supporters -> +0.4)
  let autopsyGame = Engine.createGame('people');
  autopsyGame.phase = 'complete';
  autopsyGame.lastElection = {
    autopsyReport: {
      year: 2028,
      playerWon: true,
      ascendantFactionId: 'progressive-wing',
      defensiveFactionId: 'new-democrats',
    },
  };
  const baseAutopsySupporters = autopsyGame.trust.supporters;
  const resolvedAutopsy = Engine.dispatchAction(autopsyGame, 'resolve-autopsy-disposition', { disposition: 'endorse' });
  const autopsySupporterDelta = Math.round((resolvedAutopsy.trust.supporters - baseAutopsySupporters) * 10) / 10;
  assert(autopsySupporterDelta === 0.4, `Endorsing autopsy (+4.0 raw trust) dampens to exactly +0.4 supporters trust (got: ${autopsySupporterDelta})`);

  // Leadership removal dampening (-10.0 raw supporters -> -1.0)
  let leadGame = Engine.createGame('people');
  leadGame.leadershipRoles = { player: { speakerOfHouse: 'house:NY-8' } };
  const leadBaseSupporters = leadGame.trust.supporters;
  const changedLead = Engine.dispatchAction(leadGame, 'assign-leadership-role', { roleId: 'speakerOfHouse', memberId: null });
  const leadDelta = Math.round((changedLead.trust.supporters - leadBaseSupporters) * 10) / 10;
  assert(leadDelta === -1.0, `Replacing/removing active leadership role (-10.0 raw trust) dampens to -1.0 supporters trust (got: ${leadDelta})`);

  // ---------------------------------------------------------------------------
  // SUITE 7: Minor Party National Approval Ceiling Cap (REQ-135)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 7: Minor Party National Approval Ceiling Cap ---');
  // Major party baseline can exceed 25%
  let demGame = Engine.createGame('people');
  demGame.trust = { supporters: 98, independents: 85, opponents: 60 };
  let demApprovals = Engine.computeUnifiedPartyApproval(demGame);
  const demApp = demApprovals.people?.approval ?? 0;
  assert(demApp > 25.0, `Major party overall approval is unconstrained (got: ${demApp.toFixed(1)}%)`);

  // Test minor parties: Green, Socialist, Constitution, Liberty
  ['green', 'socialist', 'constitution', 'liberty'].forEach((partyId) => {
    let minorGame = Engine.createGame(partyId);
    minorGame.trust = { supporters: 100, independents: 100, opponents: 100 };
    let minorApprovals = Engine.computeUnifiedPartyApproval(minorGame);
    const app = minorApprovals[partyId]?.approval ?? 0;
    assert(app <= 25.0, `Minor party '${partyId}' national approval is clamped at <= 25.0% (got: ${app.toFixed(1)}%)`);
  });

  // Test custom party (isMajor = false)
  let customGame = Engine.createGame('custom');
  customGame.player = {
    ...customGame.player,
    id: 'player',
    custom: true,
    isMajor: false,
    baseTemplateId: 'liberty',
  };
  customGame.trust = { supporters: 100, independents: 100, opponents: 100 };
  let customApprovals = Engine.computeUnifiedPartyApproval(customGame);
  const custApp = customApprovals.player?.approval ?? customApprovals.custom?.approval ?? 0;
  assert(custApp <= 25.0, `Custom minor party national approval is clamped at <= 25.0% (got: ${custApp.toFixed(1)}%)`);

  // ---------------------------------------------------------------------------
  // SUITE 8: Starting Vacancies for Party & Faction Leaders (REQ-136)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 8: Starting Vacancies for Party & Faction Leaders ---');
  let blankGame = Engine.createGame('people');
  const demRoles = V07.initializeLeadershipRolesForParty(blankGame, 'people');

  assert(demRoles.rhetoricalLeader === null, 'Dems initialize with rhetoricalLeader = null');
  assert(demRoles.policyLeader === null, 'Dems initialize with policyLeader = null');

  // Verify all faction leader roles are null
  V07.LEADERSHIP_ROLES_SCHEMA.filter((r) => r.category === 'faction').forEach((role) => {
    assert(demRoles[role.id] === null, `Dems initialize faction role '${role.id}' = null`);
  });

  // Verify institutional roles are still populated
  assert(demRoles.speakerOfHouse !== null, 'Dems institutional role speakerOfHouse remains populated');
  assert(demRoles.senateLeader !== null, 'Dems institutional role senateLeader remains populated');

  // Verify Republican party
  const gopRoles = V07.initializeLeadershipRolesForParty(blankGame, 'heritage');
  assert(gopRoles.rhetoricalLeader === null, 'GOP initializes with rhetoricalLeader = null');
  assert(gopRoles.policyLeader === null, 'GOP initializes with policyLeader = null');
  V07.LEADERSHIP_ROLES_SCHEMA.filter((r) => r.category === 'faction').forEach((role) => {
    assert(gopRoles[role.id] === null, `GOP initializes faction role '${role.id}' = null`);
  });
  assert(gopRoles.senateLeader !== null, 'GOP institutional role senateLeader remains populated');

  console.log('\n================================================================');
  console.log(`SUMMARY: All ${passedTests}/${totalTests} Version 0.14.4 tests passed successfully!`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ Test Suite Aborted with Error:', err);
  process.exit(1);
});
