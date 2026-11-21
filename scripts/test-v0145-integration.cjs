/**
 * Master Verification & Integration Test Suite for Version 0.14.5
 * Target: scripts/test-v0145-integration.cjs
 *
 * Objectives (Covering all 7 Subsystem Tests from VERSION_0.14.5_DESIGN.md):
 * 1. Minor Benchmark Retention: Initial minor party approvals evaluate to authentic benchmarks (~0.2%–1.8%) and do not start at 25.0% (REQ-139 / BUG-06).
 * 2. Commissioned Poll Deductions: Commissioning a poll costs $1.0M treasury and appends a record to game.commissionedPolls (REQ-140).
 * 3. Archive Viewer: game.commissionedPolls displays historical surveys with margin lead and month in modal and toolbar (REQ-140).
 * 4. Funding Interpolation Curve: computeFundingPollingLift(2.0) returns exactly 1.5% across 9 anchor brackets (REQ-141).
 * 5. Office-Tiered Funding Costs: House allocation spends $1.0M; Senate/Governor allocation spends $2.0M (REQ-141).
 * 6. 100% Happy Funding: Candidates with happiness: 100 successfully receive funding allocations without gating (REQ-141).
 * 7. Volunteer Drive Outcomes: Volunteer drive spends $3.0M + 1 Action and draws voter gains strictly between 500 and 10,000 voters (REQ-142).
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
  console.log('MASTER VERIFICATION & INTEGRATION TEST SUITE (VERSION 0.14.5)');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // SUITE 1: Minor Party Starting Popularities Benchmark Retention (REQ-139 / BUG-06)
  // ---------------------------------------------------------------------------
  console.log('--- SUITE 1: Minor Party Approval Benchmark Retention (REQ-139 / BUG-06) ---');

  // Major party baseline starts high (> 40%)
  const demGame = Engine.createGame('people');
  const demApprovals = Engine.computeUnifiedPartyApproval(demGame);
  const demApp = demApprovals.people?.approval ?? 0;
  assert(demApp >= 40.0, `Major party approval starts unconstrained at authentic baseline (got: ${demApp.toFixed(1)}%)`);

  // Standard national campaign baselines (~0.1% to ~1.8%)
  const greenBase = demApprovals.green?.approval ?? 0;
  const libBase = demApprovals.liberty?.approval ?? 0;
  const conBase = demApprovals.constitution?.approval ?? 0;
  const socBase = demApprovals.socialist?.approval ?? 0;

  assert(greenBase >= 0.2 && greenBase <= 2.5, `Green party authentic national baseline retained (got: ${greenBase.toFixed(1)}%)`);
  assert(libBase >= 0.2 && libBase <= 2.5, `Libertarian party authentic national baseline retained (got: ${libBase.toFixed(1)}%)`);
  assert(conBase >= 0.1 && conBase <= 1.0, `Constitution party authentic national baseline retained (got: ${conBase.toFixed(1)}%)`);
  assert(socBase >= 0.1 && socBase <= 1.0, `Socialist party authentic national baseline retained (got: ${socBase.toFixed(1)}%)`);

  assert(greenBase !== 25.0 && libBase !== 25.0 && conBase !== 25.0 && socBase !== 25.0, `No minor party artificially inflated to 25.0% ceiling at start`);

  // Minor Party active player campaigns: start at single-digit baselines (< 10.0%), never 25.0%
  const greenGame = Engine.createGame('green');
  const greenApp = Engine.computeUnifiedPartyApproval(greenGame).green?.approval ?? 0;
  assert(greenApp < 10.0 && greenApp >= 0.1, `Green party player campaign starts at single-digit baseline (got: ${greenApp.toFixed(1)}%)`);
  assert(greenApp !== 25.0, `Green player campaign does NOT artificially snap to 25.0%`);

  const libGame = Engine.createGame('liberty');
  const libApp = Engine.computeUnifiedPartyApproval(libGame).liberty?.approval ?? 0;
  assert(libApp < 10.0 && libApp >= 0.1, `Libertarian party player campaign starts at single-digit baseline (got: ${libApp.toFixed(1)}%)`);
  assert(libApp !== 25.0, `Libertarian player campaign does NOT artificially snap to 25.0%`);

  const conGame = Engine.createGame('constitution');
  const conApp = Engine.computeUnifiedPartyApproval(conGame).constitution?.approval ?? 0;
  assert(conApp < 10.0 && conApp >= 0.1, `Constitution party player campaign starts at single-digit baseline (got: ${conApp.toFixed(1)}%)`);
  assert(conApp !== 25.0, `Constitution player campaign does NOT artificially snap to 25.0%`);

  const socGame = Engine.createGame('socialist');
  const socApp = Engine.computeUnifiedPartyApproval(socGame).socialist?.approval ?? 0;
  assert(socApp < 10.0 && socApp >= 0.1, `Socialist party player campaign starts at single-digit baseline (got: ${socApp.toFixed(1)}%)`);
  assert(socApp !== 25.0, `Socialist player campaign does NOT artificially snap to 25.0%`);

  // Clamping ceiling: Ensure that even with maxed out trust, minor party approval is capped at <= 25.0%
  const maxedGreenGame = Engine.createGame('green');
  maxedGreenGame.trust = { supporters: 100, independents: 100, opponents: 100 };
  const maxedApprovals = Engine.computeUnifiedPartyApproval(maxedGreenGame);
  const maxedApp = maxedApprovals.green?.approval ?? 0;
  assert(maxedApp <= 25.0, `Minor party approval ceiling remains strictly clamped at <= 25.0% (got: ${maxedApp.toFixed(1)}%)`);

  // ---------------------------------------------------------------------------
  // SUITE 2: Commissioned Race Polling & Deductions (REQ-140)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 2: Commissioned Race Polling & Deductions (REQ-140) ---');
  let pollGame = Engine.createGame('people');
  pollGame = Engine.startCampaignPhase(pollGame);
  pollGame.treasury = 20.0;
  pollGame.commissionedPolls = [];

  const initialTreasury = pollGame.treasury;
  pollGame = Engine.dispatchAction(pollGame, 'commission-race-poll', {
    raceKey: 'senate:PA',
    office: 'senate',
    stateId: 'PA',
  });

  assert(pollGame.treasury === initialTreasury - 1.0, `Commissioning a poll deducts exactly $1.0M treasury (got: $${pollGame.treasury}M)`);
  assert(Array.isArray(pollGame.commissionedPolls), `game.commissionedPolls is an array`);
  assert(pollGame.commissionedPolls.length === 1, `Poll record prepended to game.commissionedPolls (count: 1)`);

  const poll = pollGame.commissionedPolls[0];
  assert(poll.office === 'senate', `Poll office recorded as 'senate'`);
  assert(poll.raceKey === 'senate:PA', `Poll raceKey recorded as 'senate:PA'`);
  assert(poll.stateId === 'PA', `Poll stateId recorded as 'PA'`);
  assert(poll.month === 1, `Poll campaign month recorded as Month 1`);
  assert(poll.moe === 3.5, `Poll Margin of Error recorded as ±3.5%`);
  assert(typeof poll.playerShare === 'number' && poll.playerShare > 0, `Valid player share polled (${poll.playerShare}%)`);
  assert(typeof poll.rivalShare === 'number' && poll.rivalShare > 0, `Valid rival share polled (${poll.rivalShare}%)`);
  assert(typeof poll.undecided === 'number' && poll.undecided > 0, `Valid undecided share polled (${poll.undecided}%)`);
  assert(poll.margin === Math.round((poll.playerShare - poll.rivalShare) * 10) / 10, `Margin is playerShare - rivalShare (got: ${poll.margin}%)`);
  assert(poll.title.includes('Pennsylvania'), `Poll title formatted correctly (${poll.title})`);

  // Commissioning second poll in Month 2 on House race
  pollGame.campaign.week = 2;
  pollGame = Engine.dispatchAction(pollGame, 'commission-race-poll', {
    raceKey: 'house:PA-07',
    office: 'house',
    stateId: 'PA',
  });
  assert(pollGame.treasury === initialTreasury - 2.0, `Second commissioned poll deducts another $1.0M (treasury: $${pollGame.treasury}M)`);
  assert(pollGame.commissionedPolls.length === 2, `Second poll appended (count: 2)`);
  assert(pollGame.commissionedPolls[0].raceKey === 'house:PA-07', `Newest poll appears at index 0`);
  assert(pollGame.commissionedPolls[0].month === 2, `Month recorded as 2`);

  // Insufficient funds guard (< $1.0M)
  pollGame.treasury = 0.5;
  const noFundGame = Engine.commissionRacePoll(pollGame, { raceKey: 'governor:NC', office: 'governor', stateId: 'NC' });
  assert(noFundGame.treasury === 0.5, `Cannot commission poll with insufficient treasury (< $1.0M)`);
  assert(noFundGame.commissionedPolls.length === 2, `No poll created when treasury insufficient`);

  // ---------------------------------------------------------------------------
  // SUITE 3: Polling Toolbar & Commissioned Polls Archive Viewer (REQ-140)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 3: Polling Toolbar & Commissioned Polls Archive Viewer (REQ-140) ---');
  App.setGame(pollGame);

  // Toolbar in Campaign Polling Map
  const mapHtml = App.campaignPollingMapMarkup();
  assert(mapHtml.includes('v08-commissioned-polling-bar'), `Polling toolbar rendered below consensus map`);
  assert(mapHtml.includes('btn-commission-poll') || mapHtml.includes('Commission Race Poll ($1.0M)'), `Toolbar renders "Commission Race Poll ($1.0M)" button`);
  assert(mapHtml.includes('btn-view-commissioned-polls') || mapHtml.includes('Commissioned polls (2)'), `Toolbar renders "Commissioned polls (2)" button`);

  // Commission Poll Modal Markup
  const commModalHtml = App.commissionPollModalMarkup();
  assert(commModalHtml.includes('commission-poll-modal-overlay'), `Commission poll modal renders overlay container`);
  assert(commModalHtml.includes('commission-race-select'), `Commission poll modal contains race selector dropdown`);
  assert(commModalHtml.includes('U.S. Senate'), `Race selector includes Senate optgroup`);
  assert(commModalHtml.includes('Gubernatorial'), `Race selector includes Governor optgroup`);
  assert(commModalHtml.includes('U.S. House'), `Race selector includes House optgroup`);

  // Archive Viewer Modal Markup
  const archiveHtml = App.commissionedPollsModalMarkup();
  assert(archiveHtml.includes('commissioned-polls-modal-overlay'), `Archive modal renders overlay container`);
  assert(archiveHtml.includes('Commissioned Internal Surveys Archive'), `Archive modal displays header title`);
  assert(archiveHtml.includes('Month 1'), `Archive renders Month 1 survey entry`);
  assert(archiveHtml.includes('Month 2'), `Archive renders Month 2 survey entry`);
  assert(archiveHtml.includes('±3.5%'), `Archive displays ±3.5% MoE`);
  assert(archiveHtml.includes('PA-07'), `Archive displays PA-07 race entry`);
  assert(archiveHtml.includes('Pennsylvania'), `Archive displays Pennsylvania race entry`);

  // ---------------------------------------------------------------------------
  // SUITE 4: Piecewise Linear Diminishing Returns Funding Curve (REQ-141)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 4: Piecewise Linear Diminishing Returns Funding Curve (REQ-141) ---');
  const curve = Engine.computeFundingPollingLift;
  assert(typeof curve === 'function', `computeFundingPollingLift is exported on window.PartyChairEngine`);

  // Anchor points
  assert(curve(0) === 0.0, `Spend $0M -> +0.0% lift`);
  assert(curve(1) === 1.0, `Spend $1M -> +1.0% lift`);
  assert(curve(3) === 2.0, `Spend $3M -> +2.0% lift`);
  assert(curve(7) === 3.0, `Spend $7M -> +3.0% lift`);
  assert(curve(15) === 4.0, `Spend $15M -> +4.0% lift`);
  assert(curve(31) === 5.0, `Spend $31M -> +5.0% lift`);
  assert(curve(63) === 6.0, `Spend $63M -> +6.0% lift`);
  assert(curve(150) === 7.0, `Spend $150M -> +7.0% lift`);
  assert(curve(500) === 8.0, `Spend $500M -> +8.0% lift`);

  // Piecewise linear interpolation tests
  assert(curve(2.0) === 1.5, `Spend $2.0M (midpoint of $1M and $3M) -> exactly +1.5% lift`);
  assert(curve(5.0) === 2.5, `Spend $5.0M (midpoint of $3M and $7M) -> exactly +2.5% lift`);
  assert(curve(11.0) === 3.5, `Spend $11.0M (midpoint of $7M and $15M) -> exactly +3.5% lift`);
  assert(curve(23.0) === 4.5, `Spend $23.0M (midpoint of $15M and $31M) -> exactly +4.5% lift`);
  assert(curve(47.0) === 5.5, `Spend $47.0M (midpoint of $31M and $63M) -> exactly +5.5% lift`);

  // Ceiling clamp
  assert(curve(600) === 8.0, `Spend $600M (> $500M ceiling) clamped at +8.0% lift`);
  assert(curve(1000) === 8.0, `Spend $1,000M clamped at +8.0% lift`);

  // ---------------------------------------------------------------------------
  // SUITE 5: Office-Tiered Funding Costs ($1M House / $2M Senate & Gov) (REQ-141)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 5: Office-Tiered Funding Costs ($1M House / $2M Senate & Gov) (REQ-141) ---');
  let fundGame = Engine.createGame('people');
  fundGame = Engine.startCampaignPhase(fundGame);
  fundGame.treasury = 25.0;

  // Initialize candidate entries
  fundGame.candidateFunding = {
    'house:PA-07': { raceKey: 'house:PA-07', candidateName: 'Rep. Taylor', kind: 'House', baseline: 1.0, allocated: 0, happiness: 70 },
    'senate:PA': { raceKey: 'senate:PA', candidateName: 'Sen. Smith', kind: 'Senate', baseline: 5.0, allocated: 0, happiness: 70 },
    'governor:NC': { raceKey: 'governor:NC', candidateName: 'Gov. Roy', kind: 'Governor', baseline: 5.0, allocated: 0, happiness: 70 },
  };

  // 1. Allocate to House race: default unit cost is $1.0M
  const tBeforeHouse = fundGame.treasury;
  fundGame = Engine.allocateCandidateFunds(fundGame, 'house:PA-07');
  assert(fundGame.treasury === tBeforeHouse - 1.0, `House race allocation spends exactly $1.0M treasury ($25M -> $24M)`);
  assert(fundGame.candidateFunding['house:PA-07'].allocated === 1.0, `House candidate allocated amount set to $1.0M`);
  assert(fundGame.candidateFunding['house:PA-07'].pollingLift === 1.0, `House candidate polling lift computed as +1.0%`);

  // 2. Allocate to Senate race: default unit cost is $2.0M
  const tBeforeSenate = fundGame.treasury;
  fundGame = Engine.allocateCandidateFunds(fundGame, 'senate:PA');
  assert(fundGame.treasury === tBeforeSenate - 2.0, `Senate race allocation spends exactly $2.0M treasury ($24M -> $22M)`);
  assert(fundGame.candidateFunding['senate:PA'].allocated === 2.0, `Senate candidate allocated amount set to $2.0M`);
  assert(fundGame.candidateFunding['senate:PA'].pollingLift === 1.5, `Senate candidate polling lift computed as +1.5% ($2M spend)`);

  // 3. Allocate to Governor race: default unit cost is $2.0M
  const tBeforeGov = fundGame.treasury;
  fundGame = Engine.allocateCandidateFunds(fundGame, 'governor:NC');
  assert(fundGame.treasury === tBeforeGov - 2.0, `Governor race allocation spends exactly $2.0M treasury ($22M -> $20M)`);
  assert(fundGame.candidateFunding['governor:NC'].allocated === 2.0, `Governor candidate allocated amount set to $2.0M`);
  assert(fundGame.candidateFunding['governor:NC'].pollingLift === 1.5, `Governor candidate polling lift computed as +1.5% ($2M spend)`);

  // 4. Verify candidate triage UI rendering
  App.setGame(fundGame);
  const triageHtml = App.campaignDashboardMarkup();
  assert(triageHtml.includes('+$1M'), `UI candidate triage table renders "+$1M" button for House race`);
  assert(triageHtml.includes('+$2M'), `UI candidate triage table renders "+$2M" button for Senate/Governor race`);
  assert(triageHtml.includes('(+1.0% in polls)'), `UI candidate triage displays "(+1.0% in polls)" for House nominee`);
  assert(triageHtml.includes('(+1.5% in polls)'), `UI candidate triage displays "(+1.5% in polls)" for Senate/Governor nominees`);

  // ---------------------------------------------------------------------------
  // SUITE 6: Unrestricted Funding for 100% Happy Candidates (REQ-141)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 6: Unrestricted Funding for 100% Happy Candidates (REQ-141) ---');
  let happyGame = Engine.createGame('people');
  happyGame = Engine.startCampaignPhase(happyGame);
  happyGame.treasury = 20.0;
  happyGame.candidateFunding = {
    'senate:PA': { raceKey: 'senate:PA', candidateName: 'Sen. Smith', kind: 'Senate', baseline: 5.0, allocated: 2.0, happiness: 100 },
  };

  const happyBeforeTreasury = happyGame.treasury;
  happyGame = Engine.allocateCandidateFunds(happyGame, 'senate:PA');
  assert(happyGame.treasury === happyBeforeTreasury - 2.0, `Treasury deducted $2.0M even when candidate happiness is 100%`);
  assert(happyGame.candidateFunding['senate:PA'].allocated === 4.0, `Candidate allocated budget increased from $2.0M to $4.0M`);
  assert(happyGame.candidateFunding['senate:PA'].happiness === 100, `Happiness preserved at 100% ceiling`);
  assert(happyGame.candidateFunding['senate:PA'].pollingLift === 2.25, `Polling lift updated to +2.25% ($4.0M halfway between $3M=+2.0% and $7M=+3.0%)`);

  // Verify button is not disabled in UI
  App.setGame(happyGame);
  const happyTriageHtml = App.campaignDashboardMarkup();
  assert(!happyTriageHtml.includes('data-allocate-funds="senate:PA" disabled'), `Funding button for 100% happy candidate is NOT disabled`);

  // ---------------------------------------------------------------------------
  // SUITE 7: Campaign Action: Volunteer Drive Outcomes (REQ-142)
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 7: Campaign Action: Volunteer Drive Outcomes (REQ-142) ---');
  let volGame = Engine.createGame('people');
  volGame = Engine.startCampaignPhase(volGame);
  volGame.treasury = 15.0;
  volGame.campaign.weeklyActionsLeft = 5;

  // Verify UI replacement of Caucus Retreat with Volunteer Drive
  App.setGame(volGame);
  const volHtml = App.campaignDashboardMarkup();
  assert(volHtml.includes('Volunteer Drive'), `Caucus Retreat is replaced with "Volunteer Drive" in Campaign Dashboard`);
  assert(volHtml.includes('COST: $3M · 1 ACTION'), `Volunteer Drive cost card displays "COST: $3M · 1 ACTION"`);
  assert(volHtml.includes('volunteer-state-select'), `Volunteer Drive card includes state selector dropdown`);
  assert(volHtml.includes('action-volunteer-drive'), `Volunteer Drive card contains launch button`);
  assert(!volHtml.includes('action-caucus-retreat'), `Old "action-caucus-retreat" button removed from active dashboard`);

  // Execute Volunteer Drive
  const tBeforeVol = volGame.treasury;
  const actsBeforeVol = volGame.campaign.weeklyActionsLeft;
  volGame = Engine.dispatchAction(volGame, 'volunteer-drive', { stateId: 'PA' });

  assert(volGame.treasury === tBeforeVol - 3.0, `Volunteer Drive deducts exactly $3.0M treasury (got: $${volGame.treasury}M)`);
  assert(volGame.campaign.weeklyActionsLeft === actsBeforeVol - 1, `Volunteer Drive spends exactly 1 campaign action (got: ${volGame.campaign.weeklyActionsLeft})`);
  assert(Boolean(volGame.campaign.lastVolunteerDrive), `Recorded lastVolunteerDrive outcome object`);

  const gained = volGame.campaign.lastVolunteerDrive.voters;
  assert(gained >= 500 && gained <= 10000, `Single volunteer drive gained between 500 and 10,000 voters (got: ${gained})`);

  // Run 100 simulations of executeVolunteerDrive to test complete probability distribution boundaries
  let minVotersSeen = Infinity;
  let maxVotersSeen = -Infinity;
  const allowedVoterBuckets = new Set([500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000]);

  for (let i = 0; i < 100; i++) {
    const simGame = {
      ...volGame,
      treasury: 100.0,
      campaign: { ...volGame.campaign, weeklyActionsLeft: 50 },
    };
    const res = Engine.executeVolunteerDrive(simGame, 'PA');
    const v = res.campaign.lastVolunteerDrive.voters;
    if (v < minVotersSeen) minVotersSeen = v;
    if (v > maxVotersSeen) maxVotersSeen = v;
    assert(allowedVoterBuckets.has(v), `Simulation ${i + 1}: voter gain ${v} matches one of the discrete outcome buckets`);
  }

  assert(minVotersSeen >= 500, `Minimum drawn voter gain >= 500 across 100 trials (min: ${minVotersSeen})`);
  assert(maxVotersSeen <= 10000, `Maximum drawn voter gain <= 10,000 across 100 trials (max: ${maxVotersSeen})`);

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`SUMMARY: All ${passedTests}/${totalTests} Version 0.14.5 tests passed successfully!`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ TEST RUNNER TERMINATED WITH UNCAUGHT EXCEPTION:');
  console.error(err);
  process.exit(1);
});
