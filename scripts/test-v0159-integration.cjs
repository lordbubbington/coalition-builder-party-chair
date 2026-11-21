/**
 * Master Verification & Integration Test Suite for Version 0.15.9
 * Target: scripts/test-v0159-integration.cjs
 *
 * Covers VERSION_0.15.9_DESIGN.md (REQ-176 through REQ-194):
 * - Suite 1: 5-Stage Institutional Ascent Ladder & Focus Slot Scaling (REQ-176 - REQ-180)
 * - Suite 2: Forecast Intelligence — Polling Average & State Legislatures (REQ-181, REQ-182)
 * - Suite 3: Duverger's Law, Viability Ceiling Shattering & State Electoral Systems (REQ-183 - REQ-186)
 * - Suite 4: Post-Election Kingmaker Caucuses & Fusion Voting (REQ-187 - REQ-189)
 * - Suite 5: Multi-Party Electoral College & 12th Amendment Contingent Elections (REQ-190, REQ-191)
 * - Suite 6: Big-Tent Inflection Point, Party Doctrine & Purist Backlash (REQ-192 - REQ-194)
 * - Suite 7: Release Packaging, Save Migration (v15.8 -> v15.9) & Invariants
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
  console.log('  ✅ PASS: PartyChairApp initialized on window');
}

async function runSuite() {
  await waitForApp();

  const Engine = sandbox.window.PartyChairEngine;
  const Data = sandbox.window.PartyChairData;
  const App = sandbox.window.PartyChairApp;

  assert(Boolean(Engine), 'PartyChairEngine initialized on window');
  assert(Boolean(Data), 'PartyChairData initialized on window');

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.9 MASTER TEST SUITE');
  console.log('================================================================\n');

  // ============================================================================
  // SUITE 1: 5-Stage Institutional Ascent Ladder & Focus Slot Scaling (REQ-176 - REQ-180)
  // ============================================================================
  console.log('--- SUITE 1: 5-Stage Institutional Ascent Ladder & Focus Slot Scaling (REQ-176 - REQ-180) ---');
  {
    const libGame = Engine.createGame({ baseTemplateId: 'liberty' });
    const demGame = Engine.createGame({ baseTemplateId: 'people' });

    assert(Engine.getPartyInstitutionalTier(libGame, 'player') === 1, 'Minor party (Liberty) starts at Tier 1 (Fringe)');
    assert(Engine.getMaxFocusSlots(libGame, 'player') === 3, 'Tier 1 party receives 3 focus slots');
    assert(Engine.isMajorParty(libGame, 'player') === false, 'Tier 1 party isMajorParty() === false');

    assert(Engine.getPartyInstitutionalTier(demGame, 'player') === 5, 'Major party (Democrats) starts at Tier 5 (Major)');
    assert(Engine.getMaxFocusSlots(demGame, 'player') === 7, 'Tier 5 party receives 7 focus slots');
    assert(Engine.isMajorParty(demGame, 'player') === true, 'Tier 5 party isMajorParty() === true');

    // Tier 1 media blackout check (REQ-177)
    const t1Media = Engine.getMediaVisibilityProfile(libGame, 'player');
    assert(t1Media.mediaBlackout === true && t1Media.earnedMediaMultiplier < 1.0, 'Tier 1 party suffers media blackout headwinds');

    // Tier 2 ascent (>= 2% Pres vote)
    const t2Game = JSON.parse(JSON.stringify(libGame));
    t2Game.elections = [{ year: 2028, type: 'presidential', nationalVote: { people: 48, heritage: 49, liberty: 2.8, player: 2.8 } }];
    t2Game.partyTiers = Engine.evaluatePartyInstitutionalTiers(t2Game);
    assert(Engine.getPartyInstitutionalTier(t2Game, 'player') === 2, 'Hitting 2.8% Pres vote promotes party to Tier 2');
    assert(Engine.getMaxFocusSlots(t2Game, 'player') === 3, 'Tier 2 party retains 3 focus slots');

    // Tier 3 ascent (>= 5% Pres vote) -> 5 focus slots + FEC Matching Funds + Automatic Ballot Retention (REQ-179)
    const t3Game = JSON.parse(JSON.stringify(libGame));
    t3Game.elections = [{ year: 2028, type: 'presidential', nationalVote: { people: 46, heritage: 47, liberty: 6.5, player: 6.5 } }];
    t3Game.partyTiers = Engine.evaluatePartyInstitutionalTiers(t3Game);
    assert(Engine.getPartyInstitutionalTier(t3Game, 'player') === 3, 'Hitting 6.5% Pres vote promotes party to Tier 3');
    assert(Engine.getMaxFocusSlots(t3Game, 'player') === 5, 'Tier 3 party expands to 5 focus slots');

    const fec = Engine.computeFecMatchingFunds(t3Game, 'player');
    assert(fec.eligible === true && fec.amount >= 8.0, `Tier 3 party qualifies for FEC Public Matching Funds ($${fec.amount}M)`);

    const retained = Engine.applyAutomaticBallotRetention(t3Game, {
      presidentialResults: {
        PA: { shares: { people: 47, heritage: 48, liberty: 2.5 } },
        TX: { shares: { people: 42, heritage: 56, liberty: 1.2 } },
      },
    });
    assert(retained.ballotAccess.liberty.senate.PA === true, 'Tier 3 automatic ballot retention secures PA at >= 2.0% share');
    assert(retained.retainedBallotStates.liberty.includes('PA'), 'PA listed in retainedBallotStates');

    // Tier 4 ascent (>= 15% polling) -> Media Blackout Shattered, Debate Stage Event, Allied Super PACs (REQ-177, REQ-180)
    const t4Game = JSON.parse(JSON.stringify(t3Game));
    t4Game.lastNationalPoll = { people: 41, heritage: 42, liberty: 16.2, player: 16.2 };
    t4Game.partyTiers = Engine.evaluatePartyInstitutionalTiers(t4Game);
    assert(Engine.getPartyInstitutionalTier(t4Game, 'player') === 4, 'Hitting 16.2% national polling promotes party to Tier 4');
    assert(Engine.getMaxFocusSlots(t4Game, 'player') === 5, 'Tier 4 party holds 5 focus slots');
    const t4Media = Engine.getMediaVisibilityProfile(t4Game, 'player');
    assert(t4Media.mediaBlackout === false && t4Media.earnedMediaMultiplier === 1.0, 'Tier 4 shatters media blackout');

    const withMilestones = Engine.checkTier4Milestones(t4Game);
    assert(withMilestones.mediaBlackoutBroken === true, 'checkTier4Milestones marks mediaBlackoutBroken = true');
    assert(withMilestones.tier4SuperPacsSeeded === true, 'checkTier4Milestones seeds fledgling allied Super PACs');
    assert(Boolean(withMilestones.pendingDebateStageEvent), 'checkTier4Milestones triggers Presidential Debate Stage milestone event');

    const afterDebate = Engine.resolveDebateStageEvent(withMilestones, 0);
    assert(afterDebate.pendingDebateStageEvent === null && afterDebate.debateStageResolved === true, 'resolveDebateStageEvent resolves milestone cleanly');

    // Tier 5 Multi-Path Major Party Promotion (7 focus slots)
    // Path 1: >= 20% Presidential popular vote
    const p1Game = JSON.parse(JSON.stringify(libGame));
    p1Game.elections = [{ year: 2028, type: 'presidential', nationalVote: { people: 39, heritage: 39, liberty: 21.4, player: 21.4 } }];
    p1Game.partyTiers = Engine.evaluatePartyInstitutionalTiers(p1Game);
    assert(Engine.getPartyInstitutionalTier(p1Game, 'player') === 5 && Engine.getMaxFocusSlots(p1Game, 'player') === 7, 'Path 1 (21.4% Pres vote) ascends party to Tier 5 with 7 focus slots');

    // Path 2A: Midterm Critical Mass — >= 35 U.S. House seats
    const p2House = JSON.parse(JSON.stringify(libGame));
    p2House.seats = 36;
    p2House.partyTiers = Engine.evaluatePartyInstitutionalTiers(p2House);
    assert(Engine.getPartyInstitutionalTier(p2House, 'player') === 5, 'Path 2A (36 House seats) ascends party to Tier 5');

    // Path 2B: Midterm Critical Mass — >= 8 U.S. Senators
    const p2Sen = JSON.parse(JSON.stringify(libGame));
    p2Sen.sittingMembers = Array.from({ length: 8 }, (_, i) => ({ id: `sen-lib-${i}`, office: 'senate', party: 'liberty', stateId: 'MT' }));
    p2Sen.partyTiers = Engine.evaluatePartyInstitutionalTiers(p2Sen);
    assert(Engine.getPartyInstitutionalTier(p2Sen, 'player') === 5, 'Path 2B (8 Senators) ascends party to Tier 5');

    // Path 2C: Midterm Critical Mass — >= 5 Governors
    const p2Gov = JSON.parse(JSON.stringify(libGame));
    p2Gov.governorships = { MT: 'liberty', WY: 'liberty', ID: 'liberty', AK: 'liberty', NH: 'liberty' };
    p2Gov.partyTiers = Engine.evaluatePartyInstitutionalTiers(p2Gov);
    assert(Engine.getPartyInstitutionalTier(p2Gov, 'player') === 5, 'Path 2C (5 Governors) ascends party to Tier 5');

    // Path 3: Major Eclipse (finishing ahead of a major party in national popular vote)
    const p3Eclipse = JSON.parse(JSON.stringify(libGame));
    p3Eclipse.elections = [{ year: 2028, type: 'presidential', nationalVote: { people: 45, heritage: 17.0, liberty: 18.5, player: 18.5 } }];
    p3Eclipse.partyTiers = Engine.evaluatePartyInstitutionalTiers(p3Eclipse);
    assert(Engine.getPartyInstitutionalTier(p3Eclipse, 'player') === 5, 'Path 3 (Major Eclipse: 18.5% > GOP 17.0%) ascends party to Tier 5');

    // UI Check: Institutional Status Badge renders without REQ-XX leaks
    App.setGame(t3Game);
    const badgeHtml = App.institutionalStatusBadgeMarkup();
    assert(badgeHtml.includes('Federally Recognized') && !/REQ-\d+/.test(badgeHtml), 'Institutional Status Badge renders Tier 3 status cleanly with zero REQ tags');
  }

  // ============================================================================
  // SUITE 2: Forecast Intelligence — Polling Average & State Legislatures (REQ-181, REQ-182)
  // ============================================================================
  console.log('\n--- SUITE 2: Forecast Intelligence — Polling Average & State Legislatures (REQ-181, REQ-182) ---');
  {
    const game = Engine.createGame({ baseTemplateId: 'people' });
    const fc = Engine.buildForecasters(game);

    assert(Boolean(fc.consensus['stateLeg:PA']), `Consensus forecaster generates stateLeg:PA ("${fc.consensus['stateLeg:PA']}")`);
    assert(Boolean(fc.sallow['stateLeg:CA']), `Sallow forecaster generates stateLeg:CA ("${fc.sallow['stateLeg:CA']}")`);
    assert(Boolean(fc.cooked['stateLeg:TX']), `Cooked forecaster generates stateLeg:TX ("${fc.cooked['stateLeg:TX']}")`);
    assert(Boolean(fc.inside['stateLeg:MI']), `Inside forecaster generates stateLeg:MI ("${fc.inside['stateLeg:MI']}")`);
    assert(Boolean(fc.polling && fc.polling['stateLeg:PA']), 'Polling Average model includes stateLeg:PA data');

    const stateLegKeys = Object.keys(fc.consensus).filter((k) => k.startsWith('stateLeg:'));
    assert(stateLegKeys.length >= 50, `Forecasters cover all 50 state legislatures (found ${stateLegKeys.length})`);

    // UI Verification: Polling Average button & State Legislatures chamber selector
    App.setGame(game);
    App.setForecasterMapSource('polling');
    App.setForecastMapChamber('stateLeg');
    const fcHtml = App.forecastersMarkup();
    assert(fcHtml.includes('data-forecaster-source="polling"'), 'Forecasters UI includes Polling Average projection model button');
    assert(fcHtml.includes('data-forecast-map-chamber="stateLeg"'), 'Forecasters UI includes State Legislatures (50 States) chamber button');
    assert(!fcHtml.includes('undefined') && !fcHtml.includes('NaN%'), 'Forecasters UI in Polling + StateLeg mode renders cleanly without undefined/NaN');

    // Reset UI source/chamber to defaults
    App.setForecasterMapSource('consensus');
    App.setForecastMapChamber('pres');
  }

  // ============================================================================
  // SUITE 3: Duverger's Law, Ceiling Shattering & State Electoral Systems (REQ-183 - REQ-186)
  // ============================================================================
  console.log('\n--- SUITE 3: Duverger\'s Law, Ceiling Shattering & State Electoral Systems (REQ-183 - REQ-186) ---');
  {
    const libGame = Engine.createGame({ baseTemplateId: 'liberty' });
    const grnGame = Engine.createGame({ baseTemplateId: 'green' });

    // Plurality squeeze: 8% in PA loses 40% - 65% to nearest major party
    const paLibDef = Engine.computeStrategicVotingDefection(libGame, 'liberty', 'PA', 'presidential', 8.0);
    assert(
      paLibDef.bypassed === false && paLibDef.defectionRate >= 0.40 && paLibDef.defectionRate <= 0.65 && paLibDef.recipientPartyId === 'heritage',
      `Liberty polling 8% in plurality PA suffers ${(paLibDef.defectionRate * 100).toFixed(1)}% strategic defection to GOP (heritage)`
    );

    const paGrnDef = Engine.computeStrategicVotingDefection(grnGame, 'green', 'PA', 'presidential', 8.0);
    assert(
      paGrnDef.bypassed === false && paGrnDef.recipientPartyId === 'people',
      `Green polling 8% in plurality PA routes strategic defection to Democrats (people)`
    );

    // Alaska RCV baseline bypass (REQ-185)
    assert(libGame.stateElectoralSystems.AK.allRaces === 'rcv', 'Alaska starts 2028 on Ranked-Choice Voting (rcv)');
    const akDef = Engine.computeStrategicVotingDefection(libGame, 'liberty', 'AK', 'presidential', 8.0);
    assert(akDef.bypassed === true && akDef.defectionRate === 0, 'Alaska RCV eliminates Duverger defection (0%)');

    // Approval Voting bypass & resolution (REQ-185)
    const approvalGame = JSON.parse(JSON.stringify(libGame));
    approvalGame.stateElectoralSystems.NV = { allRaces: 'approval', legislative: 'plurality' };
    const nvDef = Engine.computeStrategicVotingDefection(approvalGame, 'liberty', 'NV', 'presidential', 8.0);
    assert(nvDef.bypassed === true && nvDef.defectionRate === 0, 'Approval Voting state eliminates Duverger defection (0%)');
    const appRes = Engine.resolveApprovalVoting({ people: 42, heritage: 41, liberty: 14, green: 3 }, Engine.partyList(approvalGame), approvalGame);
    assert(Boolean(appRes.winner) && appRes.finalShare > 42, `resolveApprovalVoting lifts winner via cross-approvals (${appRes.winner}: ${appRes.finalShare}%)`);

    // Proportional Representation bypass & seat allocation (REQ-185)
    const propGame = JSON.parse(JSON.stringify(libGame));
    propGame.stateElectoralSystems.CA = { allRaces: 'plurality', legislative: 'proportional' };
    const caHouseDef = Engine.computeStrategicVotingDefection(propGame, 'liberty', 'CA', 'house', 8.0);
    assert(caHouseDef.bypassed === true && caHouseDef.defectionRate === 0, 'Proportional state eliminates Duverger defection in House/Leg races');
    const propSeats = Engine.allocateProportionalSeats({ people: 52, heritage: 33, liberty: 12, green: 3 }, 52, 5.0);
    const totalAllocated = Object.values(propSeats).reduce((a, b) => a + b, 0);
    assert(totalAllocated === 52 && propSeats.liberty >= 5 && propSeats.green === 0, `allocateProportionalSeats allocates exact 52 seats (Lib: ${propSeats.liberty}, Grn <5%: ${propSeats.green})`);

    // Shattering the Ceiling & Regional Spillover (REQ-184)
    const btResult = Engine.evaluateViabilityBreakthroughs(libGame, {
      presidentialResults: {
        PA: { shares: { people: 41, heritage: 42, liberty: 17.0 } },
      },
    });
    assert(Boolean(btResult.viabilityBreakthroughs.liberty?.PA?.active), 'Crossing 17% in PA shatters viability ceiling');
    const postBtGame = { ...libGame, viabilityBreakthroughs: btResult.viabilityBreakthroughs };
    const paPostBtDef = Engine.computeStrategicVotingDefection(postBtGame, 'liberty', 'PA', 'presidential', 8.0);
    assert(paPostBtDef.bypassed === true && paPostBtDef.defectionRate === 0, 'Breakthrough state permanently drops Duverger defection to 0%');

    // Regional spillover into neighbor OH (shares Mid-Atlantic / Rust Belt / Northeast overlapping region with PA)
    const ohSpill = Engine.hasRegionalSpillover(postBtGame, 'liberty', 'OH');
    assert(ohSpill.active === true && ohSpill.sourceStates.includes('PA'), 'PA breakthrough triggers regional spillover into OH via OVERLAPPING_REGIONS');
    const ohSpillDef = Engine.computeStrategicVotingDefection(postBtGame, 'liberty', 'OH', 'presidential', 8.0);
    assert(ohSpillDef.regionalRelief === true && ohSpillDef.threshold === 11.0 && ohSpillDef.defectionRate < paLibDef.defectionRate, `Regional spillover lowers OH threshold to 11% and halves defection (${(ohSpillDef.defectionRate * 100).toFixed(1)}%)`);

    // Temporary Inter-Cycle Electoral Reform Popup (REQ-186) — 60% probability & weighted buckets
    const noReform = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.65, weightRoll: 10 });
    assert(noReform.triggered === false && noReform.reformEvent === null, 'rollInterCycleElectoralReform does not trigger when roll >= 0.60');

    const rcv1 = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.25, weightRoll: 15 });
    assert(rcv1.triggered && rcv1.reformType === 'rcv' && rcv1.count === 1, 'Weight bucket 0-30 applies RCV to 1 state');

    const rcv3 = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.25, weightRoll: 40 });
    assert(rcv3.triggered && rcv3.reformType === 'rcv' && rcv3.count === 3, 'Weight bucket 30-50 applies RCV to 3 states');

    const app1 = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.25, weightRoll: 60 });
    assert(app1.triggered && app1.reformType === 'approval' && app1.count === 1, 'Weight bucket 50-70 applies Approval to 1 state');

    const app3 = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.25, weightRoll: 75 });
    assert(app3.triggered && app3.reformType === 'approval' && app3.count === 3, 'Weight bucket 70-80 applies Approval to 3 states');

    const prop1 = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.25, weightRoll: 85 });
    assert(prop1.triggered && prop1.reformType === 'proportional' && prop1.count === 1 && Engine.getStateHouseSeatCount(prop1.affectedStates[0]) >= 5, 'Weight bucket 80-90 applies Proportional to 1 state with >=5 House seats');

    const prop3 = Engine.rollInterCycleElectoralReform(libGame, 2030, { triggerRoll: 0.25, weightRoll: 95 });
    assert(prop3.triggered && prop3.reformType === 'proportional' && prop3.count === 3 && prop3.affectedStates.every((s) => Engine.getStateHouseSeatCount(s) >= 5), 'Weight bucket 90-100 applies Proportional to 3 states with >=5 House seats');

    // UI check for reform modal
    App.setGame({ ...libGame, pendingElectoralReformEvent: rcv1.reformEvent });
    const reformModalHtml = App.electoralReformModalMarkup();
    assert(reformModalHtml.includes('Continue') && reformModalHtml.includes(rcv1.reformEvent.reformLabel), 'Electoral Reform popup modal renders cleanly with Continue button');
  }

  // ============================================================================
  // SUITE 4: Post-Election Kingmaker Caucuses & Fusion Voting (REQ-187 - REQ-189)
  // ============================================================================
  console.log('\n--- SUITE 4: Post-Election Kingmaker Caucuses & Fusion Voting (REQ-187 - REQ-189) ---');
  {
    const libGame = Engine.createGame({ baseTemplateId: 'liberty' });

    // Hung Federal House (215/212/8), Hung Senate (49/49/2), Hung State Leg (PA: 98/97/8 of 203)
    const hung = Engine.detectHungChambers(
      libGame,
      { people: 215, heritage: 212, liberty: 8 },
      { people: 49, heritage: 49, liberty: 2 },
      { PA: { total: 203, people: 98, heritage: 97, liberty: 8 } }
    );
    assert(hung.houseHung && hung.playerKingmakerHouse, 'Detects hung U.S. House (215/212/8) with player as Kingmaker');
    assert(hung.senateHung && hung.playerKingmakerSenate, 'Detects hung U.S. Senate (49/49/2) with player as Kingmaker');
    assert(hung.hungStateChambers.length === 1 && hung.hungStateChambers[0].stateId === 'PA', 'Detects hung State Legislature (PA) with player as Kingmaker');
    assert(hung.negotiations.length === 3, 'Generates 3 pending kingmaker negotiation items');

    // Resolve House Kingmaker backing GOP (nearest) for Stronghold Funding
    const withPending = { ...libGame, pendingKingmakerNegotiations: hung.negotiations };
    const startTreasury = withPending.treasury;
    const afterHouseDeal = Engine.resolveKingmakerNegotiation(withPending, {
      chamber: 'house',
      partner: 'heritage',
      concession: 'stronghold_funding',
    });
    assert(afterHouseDeal.pendingKingmakerNegotiations.length === 2, 'Resolved House negotiation removed from pending queue');
    assert(afterHouseDeal.treasury > startTreasury, `Stronghold funding concession increased treasury ($${startTreasury}M -> $${afterHouseDeal.treasury}M)`);
    assert(afterHouseDeal.kingmakerAgreements.length === 1, 'Agreement recorded in kingmakerAgreements');

    // Resolve Senate Kingmaker backing Democrats (ideologically distant for Liberty) -> Purist backlash
    const beforePuristH = Number(afterHouseDeal.factionHappiness?.lib_ancaps ?? 65);
    const afterSenateDeal = Engine.resolveKingmakerNegotiation(afterHouseDeal, {
      chamber: 'senate',
      partner: 'people',
      concession: 'electoral_reform',
      targetStates: ['CO', 'NH'],
      reformType: 'rcv',
    });
    const afterPuristH = Number(afterSenateDeal.factionHappiness?.lib_ancaps ?? 65);
    assert(afterSenateDeal.stateElectoralSystems.CO.allRaces === 'rcv' && afterSenateDeal.stateElectoralSystems.NH.allRaces === 'rcv', 'Electoral reform concession enacts RCV in CO and NH');
    assert(afterPuristH < beforePuristH - 10, `Backing ideologically distant major party inflicts severe purist happiness backlash (${beforePuristH} -> ${afterPuristH})`);

    // UI check for Kingmaker modal
    App.setGame(withPending);
    const kmHtml = App.kingmakerModalMarkup();
    assert(kmHtml.includes('Confidence-and-Supply') && kmHtml.includes('U.S. House of Representatives'), 'Kingmaker negotiation modal renders cleanly');

    // Fusion Voting (REQ-189): blocked at Tier 1, unlocked at Tier 2+
    const blockedFusion = Engine.offerFusionEndorsement(libGame, { raceId: 'senate:PA', partnerPartyId: 'heritage' });
    assert(!blockedFusion.fusionEndorsements?.['senate:PA'], 'Fusion cross-endorsement blocked at Tier 1');

    const t2Lib = { ...libGame, partyTiers: { ...libGame.partyTiers, liberty: 2 }, actionsLeft: 10 };
    const fused = Engine.offerFusionEndorsement(t2Lib, { raceId: 'senate:PA', partnerPartyId: 'heritage', policyPledgeId: 'pledge-electoral-reform' });
    assert(Boolean(fused.fusionEndorsements?.['senate:PA']), 'Tier 2+ party successfully forges Fusion ballot-line deal in senate:PA');

    const fusionOut = Engine.resolveFusionElectionOutcomes(fused, {
      senate: [{ stateId: 'PA', winner: 'heritage' }],
    });
    assert(fusionOut.outcomes.length === 1 && fusionOut.outcomes[0].ballotRetained === true, 'Fusion outcome grants State Ballot Retention Credit');
    assert(fusionOut.game.fusionLegislativeLeverage === 1, 'Winning fusion candidate grants +1 legislative leverage');
  }

  // ============================================================================
  // SUITE 5: Multi-Party Electoral College & 12th Amendment Contingent Elections (REQ-190, REQ-191)
  // ============================================================================
  console.log('\n--- SUITE 5: Multi-Party Electoral College & 12th Amendment Contingent Elections (REQ-190, REQ-191) ---');
  {
    const libGame = Engine.createGame({ baseTemplateId: 'liberty' });

    // Build mock 435 reps where GOP controls 25 states, Dem controls 23 states, Liberty controls 2 states (AK, MT)
    const mockReps = [];
    const statesList = Data.STATES;
    statesList.forEach((st, idx) => {
      if (st.id === 'AK' || st.id === 'MT') {
        mockReps.push({ stateId: st.id, partyId: 'liberty' });
      } else if (idx % 2 === 0) {
        mockReps.push({ stateId: st.id, partyId: 'heritage' });
      } else {
        mockReps.push({ stateId: st.id, partyId: 'people' });
      }
    });

    const tally = Engine.computeHouseDelegationTally(libGame, mockReps);
    const totalDelegations = Object.values(tally.totals).reduce((a, b) => a + b, 0);
    assert(totalDelegations === 50, `House delegation tally covers all 50 states (got ${totalDelegations})`);
    assert(tally.majorityNeeded === 26, '12th Amendment delegation majority threshold is 26');
    assert(tally.totals.liberty === 2, `Liberty controls 2 pivotal state House delegations (got ${tally.totals.liberty})`);

    // Three-way EV deadlock (Dem 261 / Rep 258 / Player 19) -> Contingent Election Brokering
    const deadlockedGame = {
      ...libGame,
      pendingContingentElection: {
        year: 2028,
        evByParty: { people: 261, heritage: 258, liberty: 19 },
        houseDelegationTally: tally,
        playerEv: 19,
        playerDelegations: 2,
      },
    };

    // UI check for Contingent Election modal
    App.setGame(deadlockedGame);
    const ceModalHtml = App.contingentElectionModalMarkup();
    assert(ceModalHtml.includes('12th Amendment') && ceModalHtml.includes('261') && ceModalHtml.includes('258'), '12th Amendment Contingent Election modal renders deadlock EVs cleanly');

    const resolvedCe = Engine.resolveContingentElection(deadlockedGame, {
      endorseParty: 'heritage',
      concession: 'cabinet',
      cabinetRole: 'cabinet_treasury',
    });
    assert(resolvedCe.pendingContingentElection === null, 'Contingent election resolved and cleared');
    assert(resolvedCe.governingParty === 'heritage', 'Governing party updated to endorsed ticket (heritage)');
    assert(resolvedCe.coalitionCabinetPosts.cabinet_treasury === 'liberty', 'Coalition Cabinet appointment recorded for Secretary of the Treasury');
    assert(resolvedCe.contingentElectionHistory.length === 1, 'Resolution archived in contingentElectionHistory');
  }

  // ============================================================================
  // SUITE 6: Big-Tent Inflection Point, Party Doctrine & Purist Backlash (REQ-192 - REQ-194)
  // ============================================================================
  console.log('\n--- SUITE 6: Big-Tent Inflection Point, Party Doctrine & Purist Backlash (REQ-192 - REQ-194) ---');
  {
    const libGame = Engine.createGame({ baseTemplateId: 'liberty' });
    assert(libGame.identityCrisis.puristVanguardFactionId === 'lib_ancaps', 'Liberty party tags lib_ancaps as purist vanguard faction');
    assert(Array.isArray(libGame.identityCrisis.foundingFactionIds) && libGame.identityCrisis.foundingFactionIds.includes('lib_ancaps'), 'Liberty party records foundingFactionIds');

    // Initially should not trigger
    const initCheck = Engine.checkIdentityCrisisTrigger(libGame);
    assert(initCheck.shouldTrigger === false, 'Identity Crisis does not trigger at starting baseline');

    // Trigger Path A: Admitted swing faction makes up >= 65% of party voters
    const swingGame = JSON.parse(JSON.stringify(libGame));
    const swingFac = swingGame.factions.find((f) => f.id === 'swg_true_centrists');
    swingFac.partyId = 'liberty';
    const checkSwing = Engine.checkIdentityCrisisTrigger(swingGame);
    assert(checkSwing.shouldTrigger === true && checkSwing.nonFoundingShare >= 0.65, `Identity Crisis triggers when non-founding swing share hits ${(checkSwing.nonFoundingShare * 100).toFixed(1)}% (>= 65%)`);

    // Trigger Path B: Total party voters >= 7.5M with at least 1 admitted swing faction
    const bigVoteGame = JSON.parse(JSON.stringify(libGame));
    const smallSwing = bigVoteGame.factions.find((f) => f.id === 'swg_technocrats');
    smallSwing.partyId = 'liberty';
    bigVoteGame.voterModel.factions.lib_true_libertarians = 8_000_000;
    const check75M = Engine.checkIdentityCrisisTrigger(bigVoteGame);
    assert(check75M.shouldTrigger === true && check75M.totalPartyVoters >= 7_500_000, 'Identity Crisis triggers when total party voters cross 7.5M with admitted swing faction');

    // Path A Resolution: Big-Tent Moderation -> -60% cohabitation drag, +Ind trust, -28 purist shock + 2-turn bolt ultimatum
    swingGame.cohabitationTurnoutDrag = 10.0;
    const prePuristH = Number(swingGame.factionHappiness.lib_ancaps ?? 65);
    const bigTentGame = Engine.resolveIdentityCrisis(swingGame, 'big_tent');
    assert(bigTentGame.identityCrisis.doctrine === 'big_tent' && bigTentGame.identityCrisis.resolved === true, 'Big-Tent doctrine locked in');
    assert(bigTentGame.cohabitationTurnoutDrag === 4.0, `Cohabitation drag reduced by 60% (10.0 -> ${bigTentGame.cohabitationTurnoutDrag})`);
    assert(bigTentGame.identityCrisis.puristRevoltPending === true && bigTentGame.identityCrisis.puristRevoltTurnsRemaining === 2, 'Big-Tent triggers 2-turn Purist Bolt Threat ultimatum');
    const postPuristH = Number(bigTentGame.factionHappiness.lib_ancaps);
    assert(postPuristH === Math.max(0, prePuristH - 28), `Purist vanguard faction suffers -28 "Sellout" happiness shock (${prePuristH} -> ${postPuristH})`);
    const puristFacObj = bigTentGame.factions.find((f) => f.id === 'lib_ancaps');
    assert(puristFacObj.ultimatumTurnsRemaining === 2 && puristFacObj.frictionIndex === 100, 'Purist faction marked with frictionIndex=100 and 2-turn ultimatum');

    // Path B Resolution: Stay Pure / Populist Vanguard
    const preSupTrust = Number(swingGame.trust?.supporters ?? 65);
    const vanguardGame = Engine.resolveIdentityCrisis(swingGame, 'vanguard');
    assert(vanguardGame.identityCrisis.doctrine === 'vanguard', 'Populist Vanguard doctrine locked in');
    assert(vanguardGame.trust.supporters > preSupTrust, `Vanguard doctrine boosts Supporter Trust (${preSupTrust} -> ${vanguardGame.trust.supporters})`);
    assert(vanguardGame.identityCrisis.puristRevoltPending === false, 'Vanguard doctrine avoids purist revolt');

    // UI check for Identity Crisis modal & Party Doctrine Badge
    App.setGame({ ...swingGame, identityCrisis: { ...swingGame.identityCrisis, triggered: true, resolved: false } });
    const icModalHtml = App.identityCrisisModalMarkup();
    assert(icModalHtml.includes('Moderate') && icModalHtml.includes('Vanguard'), 'Ideological Crossroads modal renders Path A and Path B options cleanly');

    App.setGame(bigTentGame);
    const docBadgeHtml = App.partyDoctrineBadgeMarkup();
    assert(docBadgeHtml.includes('Big-Tent'), 'Permanent Party Doctrine Badge renders Big-Tent status');
  }

  // ============================================================================
  // SUITE 7: Release Packaging, Save Migration (v15.8 -> v15.9) & Invariants
  // ============================================================================
  console.log('\n--- SUITE 7: Release Packaging, Save Migration (v15.8 -> v15.9) & Invariants ---');
  {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));
    assert(pkg.version === '0.15.9', `package.json version is 0.15.9 (got ${pkg.version})`);
    assert(pkg.description.includes('0.15.9'), `package.json description references 0.15.9`);

    const fresh = Engine.createGame({ baseTemplateId: 'people' });
    assert(fresh.version === '0.15.9', `createGame() returns version 0.15.9 (got ${fresh.version})`);
    assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.9', `Engine.SAVE_KEY is partyChairGame.save.v15.9 (got ${Engine.SAVE_KEY})`);

    // Total registered voters invariant: 155M across 51 states + DC
    const totalVoters = fresh.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    assert(Math.round(totalVoters / 1_000_000) === 155, `Fresh game retains 155M registered voters invariant (${totalVoters})`);

    // Simulate legacy v15.8 save WITHOUT any v0.15.9 fields
    const legacyV158 = JSON.parse(JSON.stringify(fresh));
    legacyV158.version = '0.15.8';
    delete legacyV158.partyTiers;
    delete legacyV158.stateElectoralSystems;
    delete legacyV158.viabilityBreakthroughs;
    delete legacyV158.identityCrisis;
    delete legacyV158.fusionEndorsements;
    delete legacyV158.pendingKingmakerNegotiations;
    delete legacyV158.pendingContingentElection;
    delete legacyV158.forecasters;

    mockLocalStorage.clear();
    mockLocalStorage.setItem('partyChairGame.save.v15.8', JSON.stringify(legacyV158));

    const migrated = Engine.loadGame();
    assert(Boolean(migrated), 'Legacy v15.8 save loaded cleanly without crashing');
    assert(migrated.version === '0.15.9', `Migrated v15.8 save upgraded to version 0.15.9 (got ${migrated.version})`);
    assert(migrated.partyTiers && migrated.partyTiers.people === 5 && migrated.partyTiers.liberty === 1, 'Migrated save initializes partyTiers cleanly');
    assert(migrated.stateElectoralSystems?.AK?.allRaces === 'rcv', 'Migrated save initializes stateElectoralSystems with Alaska RCV');
    assert(typeof migrated.viabilityBreakthroughs === 'object', 'Migrated save initializes viabilityBreakthroughs');
    assert(typeof migrated.identityCrisis === 'object' && migrated.identityCrisis.resolved === false, 'Migrated save initializes identityCrisis');
    assert(Boolean(migrated.forecasters?.consensus?.['stateLeg:PA'] && migrated.forecasters?.polling), 'Migrated save rebuilds forecasters with stateLeg & polling models');

    // Also verify v15.7 fallback compatibility
    mockLocalStorage.clear();
    const legacyV157 = { ...legacyV158, version: '0.15.7' };
    mockLocalStorage.setItem('partyChairGame.save.v15.7', JSON.stringify(legacyV157));
    const migrated157 = Engine.loadGame();
    assert(Boolean(migrated157) && migrated157.version === '0.15.9', 'Legacy v15.7 save migrates cleanly to 0.15.9');

    // Verify UI header badge renders Version 0.15.9
    App.setGame(fresh);
    App.render();
    assert(mockAppElement.innerHTML.includes('Version 0.15.9'), 'App dashboard renders Version 0.15.9 header badge');
  }

  console.log('\n================================================================');
  console.log(` ALL V0.15.9 INTEGRATION TESTS PASSED: ${passedTests}/${totalTests} (100%)`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:\n', err);
  process.exit(1);
});
