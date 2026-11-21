/**
 * Master Verification & Integration Test Suite for Version 0.15.1
 * Target: scripts/test-v0151-integration.cjs
 *
 * Objectives (Covering all 6 Subsystem Tests from VERSION_0.15.1_DESIGN.md):
 * 1. Faction Friction & Ultimatum Detachment Loop (SUM-01)
 * 2. Coalition Summit & Recruitment Protocol & 5.0M-Member Invariant (SUM-02)
 * 3. Streamlined Tiered Demands Engine: Fringe, Minor, Major (SUM-03)
 * 4. Multi-Cycle Filtering Pacts & Breach Consequences (SUM-04)
 * 5. Ideological Cohabitation & Member Backlash (SUM-05)
 * 6. UI Hierarchy, Active Compacts Widget & Summit Navigation (SUM-06)
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
loadScript('factions-0.15.js');
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

  console.log('================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.1 MASTER TEST SUITE');
  console.log('================================================================');

  // -----------------------------------------------------------------------------
  // SUITE 1: Faction Friction & Ultimatum Detachment Loop (SUM-01)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 1: Faction Friction & Ultimatum Detachment Loop (SUM-01) ---');

  let g1 = Engine.createGame('people');
  assert(Array.isArray(g1.factions) && g1.factions.length === 38, 'Game initializes 38 factions');
  assert(g1.factions.every((f) => f.frictionIndex === 0 && f.ultimatumTurnsRemaining === null), 'Initial factions have 0 friction and null ultimatum');

  // Test 1: Chronic Low Happiness (+25 Friction for >= 2 turns)
  const leftFaction = g1.factions.find((f) => f.id === 'dem_capital_l_left');
  assert(Boolean(leftFaction), 'dem_capital_l_left faction found');
  g1.factionHappiness[leftFaction.id] = 25; // low happiness < 35

  // Turn 1 of low happiness: chronicLowTurns becomes 1, no friction added yet
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.chronicLowTurns === 1, 'Chronic low turns incremented to 1');
  assert(leftFaction.frictionIndex === 0, 'Friction index remains 0 on first low turn');

  // Turn 2 of low happiness: chronicLowTurns becomes 2, +25 friction added
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.chronicLowTurns === 2, 'Chronic low turns reached 2');
  assert(leftFaction.frictionIndex === 25, 'Friction index accumulated +25 on second turn (friction = 25)');

  // Turn 3 of low happiness: chronicLowTurns becomes 3, another +25 friction
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.frictionIndex === 50, 'Friction index accumulated another +25 (friction = 50)');

  // Test 2: Platform Abandonment (+15 Friction when Platform Dist > 4.5)
  g1.issuePositions = g1.issuePositions || {};
  g1.issuePositions['Universal Healthcare'] = 8;
  g1.issuePositions['Climate Action'] = 8;
  g1.factionHappiness[leftFaction.id] = 50; // neither low nor high
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.frictionIndex === 65, 'Friction index accumulated +15 for platform abandonment (friction = 65)');

  // Test 3: Cooling Down (-15 Friction when Happiness >= 60 and Platform Dist <= 2.5)
  g1.factionHappiness[leftFaction.id] = 70;
  g1.issuePositions['Universal Healthcare'] = 2;
  g1.issuePositions['Climate Action'] = 2;
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.frictionIndex === 50, 'Friction index cooled down by -15 (from 65 to 50)');
  assert(leftFaction.chronicLowTurns === 0, 'Chronic low turns reset when happiness restored');

  // Test 4: Ultimatum Trigger at Friction 100
  g1.factionHappiness[leftFaction.id] = 40; // Neutral happiness
  leftFaction.frictionIndex = 100;
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.ultimatumTurnsRemaining === 2, 'Ultimatum triggered with 2 turns remaining');

  // Test 5: Remediation at Happiness >= 50
  g1.factionHappiness[leftFaction.id] = 55;
  g1 = Engine.evaluateFactionFriction(g1);
  assert(leftFaction.ultimatumTurnsRemaining === null, 'Ultimatum cleared upon remediation (Happiness >= 50)');
  assert(leftFaction.frictionIndex === 40, 'Friction index reset to 40 upon remediation');

  // Test 6: Ultimatum Expiration & Bolting Execution
  leftFaction.frictionIndex = 100;
  leftFaction.ultimatumTurnsRemaining = 1;
  g1.factionHappiness[leftFaction.id] = 20; // Unremediated!

  // Measure voters before bolting
  const totalVotersBefore = g1.voterModel.states.reduce((s, st) => {
    return s + (st.affiliations.people || 0) + (st.affiliations.heritage || 0) + (st.affiliations.independent || 0);
  }, 0) * 100;

  const partyVotersBefore = g1.voterModel.states.reduce((s, st) => s + (st.affiliations.people || 0), 0) * 100;
  const indVotersBefore = g1.voterModel.states.reduce((s, st) => s + (st.affiliations.independent || 0), 0) * 100;

  // Add a lawmaker from dem_capital_l_left to test defection
  g1.sittingMembers = [
    ...(g1.sittingMembers || []),
    { id: 'lawmaker_test_left', name: 'Rep. Leftist', chamber: 'house', party: 'people', factionId: 'dem_capital_l_left' },
  ];

  g1 = Engine.evaluateFactionFriction(g1);

  // Faction should have bolted
  assert(leftFaction.partyId === 'none', 'Bolted faction has partyId = "none"');
  assert(leftFaction.ultimatumTurnsRemaining === null, 'Bolted faction clears ultimatum');

  // Lawmaker defection
  const defector = g1.sittingMembers.find((m) => m.id === 'lawmaker_test_left');
  assert(defector && defector.party === 'independent' && defector.caucus === 'independent', 'Lawmaker from bolted faction defected to Independent');

  // Voter severance & reconciliation
  const partyVotersAfter = g1.voterModel.states.reduce((s, st) => s + (st.affiliations.people || 0), 0) * 100;
  const indVotersAfter = g1.voterModel.states.reduce((s, st) => s + (st.affiliations.independent || 0), 0) * 100;
  const totalVotersAfter = g1.voterModel.states.reduce((s, st) => {
    return s + (st.affiliations.people || 0) + (st.affiliations.heritage || 0) + (st.affiliations.independent || 0);
  }, 0) * 100;

  assert(partyVotersAfter < partyVotersBefore, 'Party voters decreased after faction bolt');
  assert(indVotersAfter > indVotersBefore, 'Independent voters increased by severed faction voters');
  assert(totalVotersBefore === totalVotersAfter, `Zero-variance maintained across 155M voters after bolting (before: ${totalVotersBefore}, after: ${totalVotersAfter})`);

  // -----------------------------------------------------------------------------
  // SUITE 2: Coalition Summit & Recruitment Protocol & 5M Invariant (SUM-02)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 2: Coalition Summit & Recruitment Protocol (SUM-02) ---');

  let g2 = Engine.createGame('people');
  assert(g2.organizingActionsRemaining === 20, 'Initial organizing actions = 20');

  // Test 1: Extremist 5.0M-Member Invariant Blocks Democratic Summit with Ancaps / Socialists
  const ancapDemands = Engine.generateCoalitionDemands(g2, 'lib_ancaps');
  assert(ancapDemands.blocked === true, 'Ancaps blocked from summit with Democratic Party due to >5M member invariant');
  assert(ancapDemands.blockedReason.includes('over 5 million members'), 'Blocked reason cites 5 million members invariant');

  // Test 2: Extremist 5.0M-Member Invariant Allows Summit if Party has <= 5M members
  let gMinor = Engine.createGame('liberty'); // Libertarian baseline party
  const ancapDemandsMinor = Engine.generateCoalitionDemands(gMinor, 'lib_ancaps');
  assert(ancapDemandsMinor.blocked === false, 'Ancaps permitted to negotiate with minor party having <= 5M members');

  // Test 3: Normal Summit with Swing Faction
  const hardHatsDemands = Engine.generateCoalitionDemands(g2, 'swg_hard_hats');
  assert(hardHatsDemands && !hardHatsDemands.blocked, 'Hard Hats demands successfully generated');
  assert(hardHatsDemands.tier === 'major', `Hard Hats tier is major (got ${hardHatsDemands.tier})`);

  const prevActions = g2.organizingActionsRemaining;
  const indBeforeAccord = g2.voterModel.states.reduce((s, st) => s + (st.affiliations.independent || 0), 0) * 100;
  const partyBeforeAccord = g2.voterModel.states.reduce((s, st) => s + (st.affiliations.people || 0), 0) * 100;
  const totalBeforeAccord = indBeforeAccord + partyBeforeAccord + (g2.voterModel.states.reduce((s, st) => s + (st.affiliations.heritage || 0), 0) * 100);

  g2 = Engine.signCoalitionAccord(g2, 'swg_hard_hats', hardHatsDemands);

  assert(g2.organizingActionsRemaining === prevActions - 1, 'Signing accord cost exactly 1 organizing action');
  const hardHats = g2.factions.find((f) => f.id === 'swg_hard_hats');
  assert(hardHats.partyId === 'people', 'Hard Hats partyId updated to people');

  const indAfterAccord = g2.voterModel.states.reduce((s, st) => s + (st.affiliations.independent || 0), 0) * 100;
  const partyAfterAccord = g2.voterModel.states.reduce((s, st) => s + (st.affiliations.people || 0), 0) * 100;
  const totalAfterAccord = indAfterAccord + partyAfterAccord + (g2.voterModel.states.reduce((s, st) => s + (st.affiliations.heritage || 0), 0) * 100);

  assert(partyAfterAccord > partyBeforeAccord, 'Party voters increased by Hard Hats voters');
  assert(indAfterAccord < indBeforeAccord, 'Independent voters decreased by Hard Hats voters');
  assert(totalBeforeAccord === totalAfterAccord, `Zero-variance maintained during accord signing (155M intact)`);

  // -----------------------------------------------------------------------------
  // SUITE 3: Streamlined Tiered Demands Engine: Fringe, Minor, Major (SUM-03)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 3: Streamlined Tiered Demands Engine (SUM-03) ---');

  let g3 = Engine.createGame('people');

  // Test Fringe Faction (<1M voters)
  const fringeFaction = g3.factions.find((f) => f.id === 'gop_cubans' || (f.targetVoters < 1000000 && !Engine.EXTREMIST_FACTION_IDS.has(f.id)));
  assert(Boolean(fringeFaction), 'Fringe faction found in catalog');
  const fringeDemands = Engine.generateCoalitionDemands(g3, fringeFaction.id);
  assert(fringeDemands.tier === 'fringe', `Fringe tier correctly identified: ${fringeDemands.tier}`);
  assert(fringeDemands.sliderShifts.length <= 1, `Fringe demands at most 1 slider shift (got ${fringeDemands.sliderShifts.length})`);
  assert(fringeDemands.filteringPact.targetFiltersPerCycle === 0, 'Fringe demands have 0 primary candidate filters/cycle');

  // Test Minor Faction (1M - 2.5M voters)
  const minorFaction = g3.factions.find((f) => f.id === 'gop_traditional_farmers' || (f.targetVoters >= 1000000 && f.targetVoters < 2500000));
  assert(Boolean(minorFaction), 'Minor faction found in catalog');
  const minorDemands = Engine.generateCoalitionDemands(g3, minorFaction.id);
  assert(minorDemands.tier === 'minor', `Minor tier correctly identified: ${minorDemands.tier}`);
  assert(minorDemands.sliderShifts.length === 2, `Minor demands 2 slider shifts (got ${minorDemands.sliderShifts.length})`);
  assert(minorDemands.filteringPact.targetFiltersPerCycle === 1, 'Minor demands 1 primary filter/cycle');
  assert(minorDemands.filteringPact.cyclesRemaining === 5, 'Minor demands 5-cycle commitment');

  // Test Major Faction (2.5M+ voters)
  const majorFaction = g3.factions.find((f) => f.id === 'swg_suburban_moderates' || f.id === 'swg_true_centrists' || f.targetVoters >= 2500000);
  assert(Boolean(majorFaction), 'Major faction found in catalog');
  const majorDemands = Engine.generateCoalitionDemands(g3, majorFaction.id);
  assert(majorDemands.tier === 'major', `Major tier correctly identified: ${majorDemands.tier}`);
  assert(majorDemands.sliderShifts.length === 2, `Major demands exact platform alignment on 2 key issues`);
  assert(majorDemands.filteringPact.targetFiltersPerCycle === 5, 'Major demands 5 primary filters/cycle');
  assert(majorDemands.filteringPact.cyclesRemaining === 5, 'Major demands 5-cycle commitment');

  // -----------------------------------------------------------------------------
  // SUITE 4: Multi-Cycle Filtering Pacts & Breach Consequences (SUM-04)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 4: Multi-Cycle Filtering Pacts & Breach Consequences (SUM-04) ---');

  let g4 = Engine.createGame('people');
  g4 = Engine.signCoalitionAccord(g4, minorFaction.id, minorDemands);
  assert(Array.isArray(g4.activeCoalitionPacts) && g4.activeCoalitionPacts.length === 1, 'Active coalition pact registered in game');

  const pact = g4.activeCoalitionPacts[0];
  assert(pact.factionId === minorFaction.id, 'Pact matches faction ID');
  assert(pact.targetFiltersPerCycle === 1, 'Target filters per cycle is 1');
  assert(pact.cyclesRemaining === 5, 'Cycles remaining is 5');

  // Case A: Quota Met (Applied >= Target)
  pact.filtersAppliedThisCycle = 1;
  const initialH = g4.factionHappiness[minorFaction.id] ?? 60;
  const initialC = g4.factionConfidence[minorFaction.id] ?? 50;

  g4 = Engine.evaluateCoalitionPacts(g4);
  assert(g4.factionHappiness[minorFaction.id] === initialH + 5, `Happiness increased by +5 on quota met (was ${initialH}, now ${g4.factionHappiness[minorFaction.id]})`);
  assert(g4.factionConfidence[minorFaction.id] === initialC + 2, `Confidence increased by +2 on quota met (was ${initialC}, now ${g4.factionConfidence[minorFaction.id]})`);
  assert(g4.activeCoalitionPacts[0].cyclesRemaining === 4, 'Cycles remaining decremented to 4');
  assert(g4.activeCoalitionPacts[0].filtersAppliedThisCycle === 0, 'Filters applied reset for next cycle');

  // Case B: Final Cycle Concluded (Permanent +10 Loyalty)
  g4.activeCoalitionPacts[0].cyclesRemaining = 1;
  g4.activeCoalitionPacts[0].filtersAppliedThisCycle = 1;
  const preFinalH = g4.factionHappiness[minorFaction.id];

  g4 = Engine.evaluateCoalitionPacts(g4);
  assert(g4.activeCoalitionPacts.length === 0, 'Pact removed upon completion of all 5 cycles');
  assert(g4.factionHappiness[minorFaction.id] === Math.min(100, preFinalH + 5 + 10), 'Permanent +10 loyalty awarded upon pact completion');

  // Case C: Quota Breached (Betrayal Crisis)
  let g4Breach = Engine.createGame('people');
  g4Breach = Engine.signCoalitionAccord(g4Breach, minorFaction.id, minorDemands);
  const breachPact = g4Breach.activeCoalitionPacts[0];
  breachPact.filtersAppliedThisCycle = 0; // Did NOT fulfill target of 1!

  const preBreachH = g4Breach.factionHappiness[minorFaction.id] ?? 60;
  const preBreachC = g4Breach.factionConfidence[minorFaction.id] ?? 50;

  g4Breach = Engine.evaluateCoalitionPacts(g4Breach);
  assert(g4Breach.factionHappiness[minorFaction.id] === Math.max(0, preBreachH - 30), `Happiness dropped by -30 on betrayal (was ${preBreachH}, now ${g4Breach.factionHappiness[minorFaction.id]})`);
  assert(g4Breach.factionConfidence[minorFaction.id] === Math.max(1, preBreachC - 10), `Confidence dropped by -10 on betrayal (was ${preBreachC}, now ${g4Breach.factionConfidence[minorFaction.id]})`);

  const breachedFaction = g4Breach.factions.find((f) => f.id === minorFaction.id);
  assert(breachedFaction.ultimatumTurnsRemaining === 1, 'Immediate 1-turn ultimatum triggered on pact breach');
  assert(breachedFaction.frictionIndex === 100, 'Friction spiked to 100 on pact breach');

  // -----------------------------------------------------------------------------
  // SUITE 5: Ideological Cohabitation & Member Backlash (SUM-05)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 5: Ideological Cohabitation & Member Backlash (SUM-05) ---');

  let g5 = Engine.createGame('people');

  // Court a faction with high ideological distance to test hostile cohabitation
  // Test preview calculation
  const demands5 = Engine.generateCoalitionDemands(g5, 'swg_hard_hats');
  assert(Array.isArray(demands5.cohabitationPreview), 'Cohabitation preview generated');
  assert(demands5.cohabitationPreview.every((p) => ['compatible', 'strain', 'hostile'].includes(p.impact)), 'Impact classifications valid');

  // Test distance thresholds logic directly:
  // Compatible (< 2.5): +2
  // Strain (2.5 - 4.0): -4
  // Hostile (> 4.0): -12 to -18 and 3.0% drag
  const dummyPreview = [
    { factionId: 'dem_liberals', factionName: 'Liberals', distance: 1.5, impact: 'compatible', happinessDelta: 2 },
    { factionId: 'dem_establishment', factionName: 'Establishment', distance: 3.0, impact: 'strain', happinessDelta: -4 },
    { factionId: 'dem_socialists', factionName: 'Socialists', distance: 4.8, impact: 'hostile', happinessDelta: -14 },
  ];

  const dummyDemands = {
    ...demands5,
    sliderShifts: [],
    filteringPact: { targetFiltersPerCycle: 0, cyclesRemaining: 0 },
    cohabitationPreview: dummyPreview,
  };

  const preH_lib = g5.factionHappiness['dem_liberals'] ?? 60;
  const preH_est = g5.factionHappiness['dem_establishment'] ?? 60;
  const preH_soc = g5.factionHappiness['dem_socialists'] ?? 60;

  g5 = Engine.signCoalitionAccord(g5, 'swg_hard_hats', dummyDemands);

  assert(g5.factionHappiness['dem_liberals'] === preH_lib + 2, 'Compatible faction gained +2 Happiness');
  assert(g5.factionHappiness['dem_establishment'] === preH_est - 4, 'Moderate strain faction lost -4 Happiness');
  assert(g5.factionHappiness['dem_socialists'] === preH_soc - 14, 'Hostile faction lost -14 Happiness');
  assert(g5.cohabitationTurnoutDrag === 3.0, 'Hostile cohabitation applied 3.0% turnout drag');

  // Turnout computation check
  const playerParty = g5.player || { id: 'player', baseTemplateId: 'people' };
  const testState = g5.voterModel.states[0];
  const baseTurnout = Engine.turnout(g5, playerParty, testState);

  // Turnout without drag
  const g5NoDrag = { ...g5, cohabitationTurnoutDrag: 0 };
  const turnoutNoDrag = Engine.turnout(g5NoDrag, playerParty, testState);
  assert(baseTurnout < turnoutNoDrag, `Turnout reduced when cohabitation drag is active (with drag: ${baseTurnout}%, without: ${turnoutNoDrag}%)`);

  // Verify next cycle resets cohabitation drag
  g5.phase = 'complete';
  const g5NextCycle = Engine.startNextCycle(g5);
  assert(g5NextCycle.cohabitationTurnoutDrag === 0, 'startNextCycle clears cohabitation turnout drag to 0');

  // -----------------------------------------------------------------------------
  // SUITE 6: UI Hierarchy & Active Compacts Dashboard (SUM-06)
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 6: UI Hierarchy & Active Compacts Dashboard (SUM-06) ---');

  let g6 = Engine.createGame('people');
  App.setGame(g6);

  // Test factionsTabMarkup contains v15 elements
  App.setFactionCategoryFilter('all');
  const factionsHtml = App.factionsTabMarkup();
  assert(factionsHtml.includes('v15-compacts-widget'), 'Factions tab renders v15-compacts-widget');
  assert(factionsHtml.includes('v15-summit-btn'), 'Factions tab renders v15-summit-btn for courting factions');

  // Test Unaffiliated badge rendering
  const boltedFaction = g6.factions[0];
  boltedFaction.partyId = 'none';
  const factionsHtmlUnaff = App.factionsTabMarkup();
  assert(factionsHtmlUnaff.includes('v15-unaffiliated-badge'), 'Factions tab renders v15-unaffiliated-badge for unaffiliated faction');

  // Test Ultimatum badge rendering
  boltedFaction.ultimatumTurnsRemaining = 2;
  const factionsHtmlUltimatum = App.factionsTabMarkup();
  assert(factionsHtmlUltimatum.includes('v15-ultimatum-badge'), 'Factions tab renders v15-ultimatum-badge with pulse animation');

  // Test summitModalMarkup when modal is open
  App.setSummitModalOpen(true);
  App.setSummitModalFactionId('swg_hard_hats');
  const modalHtml = App.summitModalMarkup();
  assert(modalHtml.includes('v15-summit-dialog'), 'Summit modal renders v15-summit-dialog');
  assert(modalHtml.includes('Charter of Demands'), 'Summit modal displays Charter of Demands');
  assert(modalHtml.includes('Ideological Cohabitation Preview'), 'Summit modal displays Ideological Cohabitation Preview');
  assert(modalHtml.includes('data-sign-accord="swg_hard_hats"'), 'Summit modal includes Sign Accord button');

  // Test summitModalMarkup when invariant is blocked
  App.setSummitModalFactionId('lib_ancaps');
  const blockedModalHtml = App.summitModalMarkup();
  assert(blockedModalHtml.includes('5.0M-Member Invariant'), 'Summit modal displays 5.0M-Member Invariant warning');
  assert(blockedModalHtml.includes('Dismiss Summit'), 'Blocked modal displays Dismiss button');

  // Test campaignMarkup renders Version 0.15.1 and the summit modal
  const campHtml = App.campaignMarkup();
  assert(campHtml.includes('Version 0.15.1'), 'Campaign header eyebrow includes Version 0.15.1');
  assert(campHtml.includes('v15-summit-backdrop'), 'Campaign markup includes active summit modal');

  // Close summit modal
  App.setSummitModalOpen(false);
  const campHtmlClosed = App.campaignMarkup();
  assert(!campHtmlClosed.includes('v15-summit-backdrop'), 'Campaign markup hides summit modal when closed');

  console.log('\n================================================================');
  console.log(`ALL INTEGRATION TESTS PASSED: ${passedTests} / ${totalTests} assertions passed.`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
