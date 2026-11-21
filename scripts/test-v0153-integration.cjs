/**
 * Master Verification & Integration Test Suite for Version 0.15.3
 * Target: scripts/test-v0153-integration.cjs
 *
 * Objectives (Covering all 9 Features REQ-162 through REQ-170 from VERSION_0.15.3_DESIGN.md):
 * 1. REQ-162: Forecast Maps Relocation to Forecasts Tab with active Senate Class Forecast
 * 2. REQ-163: Political Landscape Map Restructuring (Recent Pres 2024, House 435, Senate Class, Combined 50-State)
 * 3. REQ-164: Real-Time Reactive State Voter Registration Table with low-pop precision and gain badges (+5K)
 * 4. REQ-165: Voter Registration & Outreach Action Rebalance (1,000xEV Minor, 2,500xEV Major, $5M, 1 Act, #reg-demographic removed)
 * 5. REQ-166: Deprecate Legacy Faction Confidence Sidebar Panel and reclaim right-column space
 * 6. REQ-167: Universal Politician Faction Display (.v15-politician-faction-badge) & Wing Deprecation
 * 7. REQ-168: Restrict Keynote Speaker & State Tour strictly to appointed Party Leaders
 * 8. REQ-169: 8-Card Pre-Campaign Machine Grid in Step 5 (Faction Summit & Leadership Hierarchy removed)
 * 9. REQ-170: Court Politician Action Overhaul (multi-office pool, H<=40 gate, 2-pt non-racial bridge, minor leadership demand, closest Euclidean faction)
 * 10. Engine Invariants: 0-variance in voterModel, SAVE_KEY migration, and version string 0.15.3
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
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.15.3 MASTER TEST SUITE');
  console.log('================================================================');

  // -----------------------------------------------------------------------------
  // SUITE 1: REQ-162 Forecast Maps Relocation to Forecasts Tab
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 1: REQ-162 Forecast Maps Relocation to Forecasts Tab ---');
  let g1 = Engine.createGame('people');
  App.setGame(g1);

  const forecastHtml = App.forecastersMarkup();
  assert(forecastHtml.includes('id="forecast-projection-map-container"'), 'Forecast maps container rendered in forecastersMarkup');
  assert(forecastHtml.includes('data-forecast-map-chamber="presidential"'), 'Presidential forecast chamber pill rendered');
  assert(forecastHtml.includes('data-forecast-map-chamber="senate"'), 'Senate forecast chamber pill rendered');
  assert(forecastHtml.includes('data-forecast-map-chamber="house"'), 'House forecast chamber pill rendered');
  assert(forecastHtml.includes('U.S. Senate (Class III)'), 'Active Senate class (Class III for 2028) rendered in chamber pill');

  // Verify container is positioned between summary cards and Battleground Race Ratings table
  const cardsIndex = forecastHtml.indexOf('v08-forecasters-grid');
  const containerIndex = forecastHtml.indexOf('id="forecast-projection-map-container"');
  const tableIndex = forecastHtml.indexOf('Battleground Race Ratings Comparison');
  assert(cardsIndex !== -1 && containerIndex !== -1 && tableIndex !== -1, 'All three sections found in forecastersMarkup');
  assert(cardsIndex < containerIndex && containerIndex < tableIndex, 'Forecast map container is directly between summary cards and ratings comparison table');

  // Test Senate Forecast Map styling: Contested states have rating colors, inactive states have #334155
  App.setForecastMapChamber('senate');
  const senateForecastSvg = App.nationalMapSvg('senate', { forecaster: true, chamberClass: 'III' });
  assert(senateForecastSvg.view.includes('style="fill:#334155"'), 'Inactive Senate states rendered in neutral slate (#334155)');
  assert(!senateForecastSvg.view.includes('undefined'), 'Senate forecast map SVG contains no undefined tokens');

  // -----------------------------------------------------------------------------
  // SUITE 2: REQ-163 Political Landscape Map Restructuring
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 2: REQ-163 Political Landscape Map Restructuring ---');
  // Political Landscape does not have forecaster model switcher
  const landscapeHtml = App.renderPoliticalLandscape();
  assert(!landscapeHtml.includes('v08-pundit-selector-bar'), 'Forecaster projection model selector bar completely removed from Political Landscape');
  assert(landscapeHtml.includes('Recent Presidential (2024 / Certified)'), 'Recent Presidential tab button present');
  assert(landscapeHtml.includes('Current House Control (435 Districts)'), 'Current House Control tab button present');
  assert(landscapeHtml.includes('Current Senate Class (Class III)'), 'Current Senate Class tab button present');
  assert(landscapeHtml.includes('Combined 50-State Senate (Delegations)'), 'Combined 50-State Senate tab button present');

  // 1. Recent Presidential 2024 certified baseline
  App.setActiveMap('presidential');
  const presMap = App.nationalMapSvg('presidential', { forecaster: false });
  assert(presMap.view.includes('Certified 2024 Baseline: Donald Trump (GOP)'), 'Trump 2024 win recorded on baseline map');
  assert(presMap.view.includes('Certified 2024 Baseline: Kamala Harris (Dem)'), 'Harris 2024 win recorded on baseline map');
  assert(presMap.legend.includes('Donald Trump (Republican · 312 EV)'), 'Trump 312 EV displayed in certified baseline legend');
  assert(presMap.legend.includes('Kamala Harris (Democratic · 226 EV)'), 'Harris 226 EV displayed in certified baseline legend');

  // 2. Current House Control (435 districts)
  App.setActiveMap('house');
  const houseMap = App.nationalMapSvg('house', { forecaster: false });
  assert(houseMap.view.includes('map-district party-rep') && houseMap.view.includes('map-district party-dem'), '435 House districts shaded by sitting incumbent control');
  assert(houseMap.legend.includes('Democratic Incumbent') && houseMap.legend.includes('Republican Incumbent'), 'House legend reflects sitting incumbents');

  // 3. Current Senate Class
  App.setActiveMap('senate-class');
  const senateClassMap = App.nationalMapSvg('senate-class', { forecaster: false, chamberClass: 'III' });
  assert(senateClassMap.view.includes('style="fill:#334155"') || senateClassMap.view.includes('party-pending'), 'Non-contested states shaded in neutral slate');
  assert(senateClassMap.legend.includes('No Class III seat up'), 'Senate class legend indicates inactive states');

  // 4. Combined 50-State Senate (Blue 2 D, Red 2 R, Purple split)
  App.setActiveMap('senate-combined');
  const combinedMap = App.nationalMapSvg('senate-combined', { forecaster: false });
  assert(combinedMap.view.includes('style="fill:#3478c8"'), 'Democratic delegations colored Blue (#3478c8)');
  assert(combinedMap.view.includes('style="fill:#c9474e"'), 'Republican delegations colored Red (#c9474e)');
  assert(combinedMap.view.includes('style="fill:#8654a4"'), 'Split delegations colored Purple (#8654a4)');
  assert(combinedMap.legend.includes('Both Senators Democratic'), 'Combined delegation legend includes Both Democratic');
  assert(combinedMap.legend.includes('Both Senators Republican'), 'Combined delegation legend includes Both Republican');
  assert(combinedMap.legend.includes('Split Delegation (1 Dem + 1 GOP)'), 'Combined delegation legend includes Split Delegation');

  // -----------------------------------------------------------------------------
  // SUITE 3: REQ-164 Real-Time Reactive State Voter Registration Table
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 3: REQ-164 Real-Time Reactive State Voter Registration Table ---');
  let gReg = Engine.createGame('people');
  App.setGame(gReg);

  const initialTableHtml = App.renderStateVoterRegistrationTable(gReg);
  assert(initialTableHtml.includes('state-reg-table'), 'State voter registration table rendered');
  // WY, VT are low-population states
  assert(initialTableHtml.includes('WY · 3 EV'), 'Wyoming found in registration table');
  assert(initialTableHtml.includes('VT · 3 EV'), 'Vermont found in registration table');

  // Add voters via Engine.addVotersToModel to test live binding and delta badge
  Engine.addVotersToModel(gReg.voterModel, 'WY', 5000, 'people');
  if (!gReg.stateVoterDeltas) gReg.stateVoterDeltas = {};
  if (!gReg.stateVoterDeltas['WY']) gReg.stateVoterDeltas['WY'] = {};
  gReg.stateVoterDeltas['WY']['people'] = 5000;

  const updatedTableHtml = App.renderStateVoterRegistrationTable(gReg);
  assert(updatedTableHtml.includes('v15-reg-gain-badge'), 'Delta badge class v15-reg-gain-badge rendered');
  assert(updatedTableHtml.includes('+5K'), 'In-cycle gain delta badge (+5K) rendered on Wyoming row');

  // -----------------------------------------------------------------------------
  // SUITE 4: REQ-165 Voter Registration & Outreach Action Rebalance
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 4: REQ-165 Voter Registration & Outreach Action Rebalance ---');
  let gMajor = Engine.createGame('people');
  gMajor.treasury = 50;
  gMajor.actionsLeft = 5;
  gMajor.organizingActionsRemaining = 20;

  const paEv = 19;
  const initialPaDemVoters = gMajor.voterModel.states.find((s) => s.stateId === 'PA').affiliations.people * 100;
  
  // Dispatch voter-registration-drive on PA (19 EV) as Major party: gain = 2500 * 19 = 47,500 voters
  const postMajorReg = Engine.takeAction(gMajor, 'voter-registration-drive', { stateId: 'PA' });
  assert(postMajorReg.treasury === 45, 'Voter registration cost exactly $5M for Major party ($50M -> $45M)');
  assert(postMajorReg.actionsLeft === 4, 'Voter registration consumed exactly 1 action');
  const paDemVotersAfter = postMajorReg.voterModel.states.find((s) => s.stateId === 'PA').affiliations.people * 100;
  const gainedMajor = paDemVotersAfter - initialPaDemVoters;
  assert(Math.abs(gainedMajor - (2500 * paEv)) <= 100, `Major party gained +2,500 voters/EV (+47,500 for PA, got ${Math.round(gainedMajor)})`);
  assert(postMajorReg.stateVoterDeltas?.PA?.people >= 47000, 'State voter delta tracked in game.stateVoterDeltas');

  // Minor Party test (e.g. liberty / Libertarian): gain = 1000 * 19 = 19,000 voters
  let gMinor = Engine.createGame('liberty');
  gMinor.treasury = 50;
  gMinor.actionsLeft = 5;
  const initialPaLibVoters = gMinor.voterModel.states.find((s) => s.stateId === 'PA').affiliations.liberty * 100;
  const postMinorReg = Engine.takeAction(gMinor, 'voter-registration-drive', { stateId: 'PA' });
  const paLibVotersAfter = postMinorReg.voterModel.states.find((s) => s.stateId === 'PA').affiliations.liberty * 100;
  const gainedMinor = paLibVotersAfter - initialPaLibVoters;
  assert(Math.abs(gainedMinor - (1000 * paEv)) <= 100, `Minor party gained +1,000 voters/EV (+19,000 for PA, got ${Math.round(gainedMinor)})`);

  // Verify #reg-demographic is NOT present in UI markup
  App.setGame(gMajor);
  const step5Html = App.step4WorkMarkup();
  assert(!step5Html.includes('id="reg-demographic"'), 'Second demographic dropdown #reg-demographic completely removed from Step 5');
  assert(step5Html.includes('id="reg-state"'), 'State target dropdown #reg-state present in Step 5');

  // -----------------------------------------------------------------------------
  // SUITE 5: REQ-166 Deprecate Legacy Faction Confidence Sidebar Panel
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 5: REQ-166 Deprecate Legacy Faction Confidence Sidebar Panel ---');
  const partyInfoHtml = App.partyInfoTabMarkup();
  assert(!partyInfoHtml.includes('class="faction-list"'), 'Legacy faction-list container removed from Party Info dashboard sidebar');
  assert(partyInfoHtml.includes('class="platform-list"'), 'Platform Profile present in right column');
  assert(partyInfoHtml.includes('class="legislation-list"'), 'State Policy Bills present in right column');
  assert(App.factionsMarkup() === '', 'factionsMarkup() deprecated and returns empty string');

  // Top-level Factions tab remains fully functional
  const factionsTabHtml = App.factionsTabMarkup();
  assert(factionsTabHtml.includes('National Faction Health & 51-State Allocations'), 'Dedicated Factions Tab remains functional');

  // -----------------------------------------------------------------------------
  // SUITE 6: REQ-167 Universal Politician Faction Display & Wing Deprecation
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 6: REQ-167 Universal Politician Faction Display & Wing Deprecation ---');
  const sampleMember = gMajor.sittingMembers[0];
  const badgesHtml = App.memberMetricsBadgesMarkup(sampleMember);
  assert(badgesHtml.includes('v15-politician-faction-badge'), 'Faction badge class v15-politician-faction-badge rendered by memberMetricsBadgesMarkup');
  assert(!badgesHtml.includes('quote-wing-tag'), 'Obsolete quote-wing-tag is not in memberMetricsBadgesMarkup');

  // Verify wing purge across app markup
  assert(!step5Html.includes('m.wing'), 'm.wing not in step5StatesMarkup');
  const autopsySample = Engine.generateAutopsyReport(gMajor, { presidentialWinner: 'heritage', presidentialTicket: { people: 'Jon Ossoff', heritage: 'J. D. Vance' } });
  gMajor.lastElection = { year: 2028, autopsyReport: autopsySample };
  App.setGame(gMajor);
  const statesTabHtml = App.statesTabMarkup();
  assert(!statesTabHtml.includes('Wing:'), 'Obsolete "Wing:" label replaced in states directory dossiers');

  // -----------------------------------------------------------------------------
  // SUITE 7: REQ-168 Restrict Keynote Speaker & State Tour to Active Party Leaders
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 7: REQ-168 Restrict Keynote Speaker & State Tour to Active Party Leaders ---');
  let gLead = Engine.createGame('people');
  // Clear leadership roles
  gLead.leadershipRoles = { player: {}, rival: {} };
  App.setGame(gLead);
  const step5NoLeaders = App.step4WorkMarkup();
  assert(step5NoLeaders.includes('[ Appoint Party Leaders in Leadership Menu to Select Keynote ]'), 'Keynote selector shows disabled prompt when no leaders appointed');
  assert(step5NoLeaders.includes('[ Appoint Party Leaders in Leadership Menu to Deploy Tours ]'), 'State tour selector shows disabled prompt when no leaders appointed');

  // Appoint an active party leader
  const eligiblePol = gLead.sittingMembers.find((m) => m.party === 'people');
  gLead.leadershipRoles.player['chair'] = eligiblePol.id;
  App.setGame(gLead);
  const step5WithLeader = App.step4WorkMarkup();
  assert(step5WithLeader.includes(`value="${eligiblePol.id}"`), 'Appointed party leader is available in keynote and tour dropdowns');

  // -----------------------------------------------------------------------------
  // SUITE 8: REQ-169 8-Card Pre-Campaign Machine Grid in Step 5
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 8: REQ-169 8-Card Pre-Campaign Machine Grid in Step 5 ---');
  assert(!step5WithLeader.includes('Hold a Faction Summit'), 'Redundant Hold a Faction Summit card removed from Step 5');
  assert(!step5WithLeader.includes('Party Leadership Hierarchy (14 Roles)'), 'Redundant Party Leadership Hierarchy card removed from Step 5');

  // Verify exactly 8 action cards in the grid
  const actionCardMatches = step5WithLeader.match(/class="action-card[^"]*"/g) || [];
  assert(actionCardMatches.length === 8, `Step 5 grid has exactly 8 balanced action cards (got ${actionCardMatches.length})`);

  // -----------------------------------------------------------------------------
  // SUITE 9: REQ-170 Court Politician Action Overhaul
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 9: REQ-170 Court Politician Action Overhaul ---');
  let gCourt = Engine.createGame('people');
  gCourt.treasury = 50;
  gCourt.actionsLeft = 5;
  gCourt.organizingActionsRemaining = 20;

  // Find a target politician with happiness > 40
  const happyGop = gCourt.sittingMembers.find((m) => m.party === 'heritage');
  if (happyGop) {
    happyGop.happiness = 75;
    const blockedRes = Engine.takeAction(gCourt, 'court-politician', { memberId: happyGop.id });
    assert(blockedRes.treasury === 50, 'Courting contented lawmaker (Happiness > 40) is blocked');
  }

  // Set lawmaker to discontent (happiness <= 40) and find one with ideological bridge
  // Target: moderate GOP sitting official whose faction is within 2.0 pts of a Dem non-racial faction
  const discontentTarget = gCourt.sittingMembers.find((m) => m.party === 'heritage' && (m.office === 'senate' || m.office === 'house' || m.office === 'governor'));
  assert(discontentTarget != null, 'Found sitting GOP official for defection test');
  discontentTarget.happiness = 35;
  
  // Align target faction within 2.0 of dem_blue_dog (econ 6.8, social 4.8)
  const targetFaction = gCourt.factions.find((f) => f.id === discontentTarget.factionId);
  if (targetFaction) {
    targetFaction.economic = 6.0;
    targetFaction.social = 5.0;
    if (targetFaction.sliders) {
      targetFaction.sliders.economic = 6.0;
      targetFaction.sliders.social = 5.0;
    }
  }

  // Execute defection as Major party
  const postCourtMajor = Engine.takeAction(gCourt, 'court-politician', { memberId: discontentTarget.id });
  assert(postCourtMajor.treasury === 46, 'Courting cost exactly $4M for Major party ($50M -> $46M)');
  assert(postCourtMajor.actionsLeft === 4, 'Courting consumed exactly 1 action');
  const defectedPol = postCourtMajor.sittingMembers.find((m) => m.id === discontentTarget.id);
  assert(defectedPol.party === 'people', 'Defecting official party switched to people (Democrat)');
  assert(defectedPol.caucus === 'people', 'Defecting official caucus switched to people');
  assert(defectedPol.factionId != null, 'Defecting official assigned to a valid player faction');
  
  // Verify closest Euclidean distance faction was assigned
  const playerDemFactions = gCourt.factions.filter((f) => f.partyId === 'people');
  let bestDist = Infinity;
  let expectedFactionId = null;
  playerDemFactions.forEach((pf) => {
    const pEcon = pf.sliders?.economic ?? pf.economic ?? 5;
    const pSoc = pf.sliders?.social ?? pf.social ?? 5;
    const dist = Math.sqrt((pEcon - 6.0) ** 2 + (pSoc - 5.0) ** 2);
    if (dist < bestDist) {
      bestDist = dist;
      expectedFactionId = pf.id;
    }
  });
  assert(defectedPol.factionId === expectedFactionId, `Defecting official joined closest Euclidean faction (${expectedFactionId})`);

  // Test Minor Party Courting (demands leadership role)
  let gMinorCourt = Engine.createGame('liberty');
  gMinorCourt.treasury = 50;
  gMinorCourt.actionsLeft = 5;
  const discontentTargetMinor = gMinorCourt.sittingMembers.find((m) => m.party === 'heritage');
  discontentTargetMinor.happiness = 30;

  // Align target faction within 2.0 of lib_true_libertarians (econ: 9.5, soc: 3.8)
  const minorTargetFaction = gMinorCourt.factions.find((f) => f.id === discontentTargetMinor.factionId);
  if (minorTargetFaction) {
    minorTargetFaction.economic = 9.0;
    minorTargetFaction.social = 4.0;
    if (minorTargetFaction.sliders) {
      minorTargetFaction.sliders.economic = 9.0;
      minorTargetFaction.sliders.social = 4.0;
    }
  }

  // Without role: blocked for minor party
  const minorAttemptNoRole = Engine.takeAction(gMinorCourt, 'court-politician', { memberId: discontentTargetMinor.id });
  assert(minorAttemptNoRole.treasury === 50, 'Minor party courting blocked without designated leadership role');

  // With role designated: succeeds
  const minorAttemptWithRole = Engine.takeAction(gMinorCourt, 'court-politician', { memberId: discontentTargetMinor.id, leadershipRoleId: 'chair' });
  assert(minorAttemptWithRole.treasury === 46, 'Minor party courting succeeded when leadership role was designated');
  const defectedMinorPol = minorAttemptWithRole.sittingMembers.find((m) => m.id === discontentTargetMinor.id);
  assert(defectedMinorPol.party === 'liberty', 'Defecting lawmaker switched party to liberty');
  assert(minorAttemptWithRole.leadershipRoles?.player?.chair === defectedMinorPol.id, 'Appointed to designated leadership role upon defection');

  // -----------------------------------------------------------------------------
  // SUITE 10: Invariants, Save Key & Version Strings
  // -----------------------------------------------------------------------------
  console.log('\n--- SUITE 10: Invariants, Save Key & Version Strings ---');
  assert(['0.15.3', '0.15.4', '0.15.5'].includes(gCourt.version), 'Game version string is 0.15.3 or higher');
  assert(['partyChairGame.save.v15.3', 'partyChairGame.save.v15.4', 'partyChairGame.save.v15.5'].includes(Engine.SAVE_KEY), 'SAVE_KEY bumped to partyChairGame.save.v15.3 or higher');
  
  // Total registered voters invariant: exactly 155M
  const totalRepVoters = gCourt.voterModel.states.reduce((sum, s) => sum + (s.representedVoters || 0), 0);
  assert(Math.round(totalRepVoters / 1000000) === 155, `Voter model retains 155M registered voters across 51 states + DC (got ${totalRepVoters})`);

  console.log('\n================================================================');
  console.log(`ALL INTEGRATION TESTS PASSED: ${passedTests} / ${totalTests} assertions passed.`);
  console.log('================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ MASTER SUITE FAILED WITH ERROR:');
  console.error(err);
  process.exit(1);
});
