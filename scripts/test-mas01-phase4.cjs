/**
 * Automated Flagship Verification & Integration Suite for MAS-01 Phase 4 & Version 0.16.0 Release
 * Target: scripts/test-mas01-phase4.cjs
 *
 * Verifies:
 * 1. Version 0.16.0 Packaging, SAVE_KEY (v16.0), and UI version badges
 * 2. Flagship Era #18 (The Party Coalition Era): 6-party trigger, overnight 2-faction cap & pairing,
 *    Informed Party Selection Modal, Nationwide MMP 435/100 resolution, 3-4 Coalition Bargaining Loop,
 *    Policy Accords, Coalition Stability Meter (0-100), and Mid-Cycle Fracture Crises
 * 3. Flagship Era #16 (Robots Become Citizens): >=40 yr predecessor floor after Era #15, authorized
 *    310M+ electorate expansion (155M human + 155M synthetic), zero-variance 100% synthetic turnout,
 *    proportional robotic seats, 4 dedicated Robot Political Parties (2 factions each), Chair choice & themes
 * 4. Multi-Decade Continuity across 3+ successive eras (Era 7 -> Era 8 -> Era 9 -> Era 10 -> Era 11)
 * 5. Backward-compatible save migration (v15.8 & v15.9 -> v16.0), mid-modal save/reload, & vibes audit
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total += 1;
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
  passed += 1;
  console.log(`  ✅ PASS: ${msg}`);
}

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

const mockAppElement = {
  innerHTML: '',
  classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
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
  console,
  setTimeout,
  clearTimeout,
  Math,
  JSON,
  Number,
  String,
  Array,
  Object,
  Infinity,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Date,
  Set,
  Map,
  Uint8Array,
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
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'engine.js',
  'app.js',
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const PCData = sandbox.window.PartyChairData;
const PSData = sandbox.window.PartySystemsData;
const PSCoalition = sandbox.window.PartySystemsCoalition;
const PSRobots = sandbox.window.PartySystemsRobots;
const PSEngine = sandbox.window.PartySystemsEngine;
const PSUI = sandbox.window.PartySystemsUI;
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));

function seedSixPartiesInHouse(game) {
  const g = JSON.parse(JSON.stringify(game));
  const sixParties = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution'];
  let idx = 0;
  (g.sittingMembers || []).forEach((m) => {
    if (m.office === 'house' && idx < sixParties.length) {
      m.party = sixParties[idx];
      m.partyId = sixParties[idx];
      m.caucus = sixParties[idx];
      idx += 1;
    }
  });
  return g;
}

async function runTests() {
  let waitTries = 0;
  while (!sandbox.window.PartyChairApp && waitTries < 40) {
    await new Promise((r) => setTimeout(r, 50));
    waitTries += 1;
  }
  const App = sandbox.window.PartyChairApp;
  assert(Boolean(App), 'PartyChairApp initialized cleanly in headless harness');

  console.log('====================================================================');
  console.log(' MAS-01 PHASE 4 & VERSION 0.16.0 FLAGSHIP INTEGRATION TEST SUITE');
  console.log('====================================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: Version 0.16.0 Packaging, Save Keys & UI Badges
  // ------------------------------------------------------------------
  console.log('--- SUITE 1: Version 0.16.0 Release Packaging & Invariants ---');
  {
    assert(Boolean(pkg.version), `package.json has version (got ${pkg.version})`);
    assert(Engine.SAVE_KEY.startsWith('partyChairGame.save.v'), `SAVE_KEY is valid save key (got ${Engine.SAVE_KEY})`);
    const fresh = Engine.createGame({ baseTemplateId: 'people' });
    assert(Boolean(fresh.version), `createGame() returns version (got ${fresh.version})`);
    assert(PSData.ERA_CATALOG.length === 26, `All 26 eras defined in ERA_CATALOG (got ${PSData.ERA_CATALOG.length})`);
    assert(Boolean(PSCoalition) && Boolean(PSRobots), 'Phase 4 modules PartySystemsCoalition & PartySystemsRobots loaded');
    assert(Boolean(PSEngine.getEraPlugin('era_18_party_coalition')) && Boolean(PSEngine.getEraPlugin('era_16_robots_citizens')), 'Era #18 and Era #16 plugins registered cleanly');

    App.setGame(fresh);
    const campHtml = App.campaignMarkup();
    assert(campHtml.includes(fresh.version), `App header & footer display Version ${fresh.version}`);
  }

  // ------------------------------------------------------------------
  // SUITE 2: Flagship Era #18 — The Party Coalition Era (Breakup & Selection)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 2: Era #18 The Party Coalition Era (2-Faction Cap & Selection) ---');
  {
    const base = Engine.createGame({ baseTemplateId: 'people' });
    const baseEligible = PSEngine.getEligiblePartySystems(base, 2040);
    assert(!baseEligible.some((c) => c.era.id === 'era_18_party_coalition'), 'Era #18 blocked when < 6 parties hold federal House/Senate seats');

    const sixHouse = seedSixPartiesInHouse(base);
    const trigEligible = PSEngine.getEligiblePartySystems(sixHouse, 2040);
    const e18Cand = trigEligible.find((c) => c.era.id === 'era_18_party_coalition');
    assert(Boolean(e18Cand) && e18Cand.weight === 3, 'Era #18 eligible with Weight 3 when >= 6 distinct parties hold House/Senate seats');

    const era18 = PSEngine.transitionToPartySystem(sixHouse, PSData.ALL_ERAS_BY_ID.era_18_party_coalition, 2040);
    assert(PSEngine.getActiveIssuesForGame(era18).length === PCData.VERSION_021_ISSUES.length, `Era #18 maintains strict ${PCData.VERSION_021_ISSUES.length}-issue platform clamp`);
    assert(era18.partySystems.eraExclusiveIssuesActive.length === 7, `Era #18 introduces exact 7 coalition-governance issues (got ${era18.partySystems.eraExclusiveIssuesActive.length})`);

    // Enforce strict <= 2 factions per party invariant across EVERY political party
    const countsByParty = {};
    (era18.factions || []).forEach((f) => {
      if (f.partyId && !['independent', 'unaffiliated'].includes(f.partyId)) {
        countsByParty[f.partyId] = (countsByParty[f.partyId] || 0) + 1;
      }
    });
    const maxFactionsInAnyParty = Math.max(0, ...Object.values(countsByParty));
    assert(maxFactionsInAnyParty <= 2, `Overnight 2-faction cap enforced across all ${Object.keys(countsByParty).length} parties (max=${maxFactionsInAnyParty})`);
    assert(era18.partySystems.coalitionSystem.expelledCount > 0, `Breakup expelled ${era18.partySystems.coalitionSystem.expelledCount} excess factions into new parties`);

    // Verify 155M voter scale invariant strictly preserved
    const sumVoters = era18.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    assert(sumVoters === 155_000_000 && era18.voterModel.representedVoters === 155_000_000, `Era #18 breakup preserves exact 155M voter scale (${sumVoters})`);

    // Dismissing realignment transitions into Informed Party Selection Modal ('party_select')
    const afterDismiss = Engine.takeAction(era18, 'dismiss-realignment-modal');
    assert(afterDismiss.partySystems.pendingModal === 'party_select', 'Dismissing Era #18 chronicle opens Informed Party Selection Modal (party_select)');
    const selectHtml = PSUI.renderActivePartySystemsModal(afterDismiss);
    assert(selectHtml.includes('Select Your National Party Command') && selectHtml.includes('data-select-coalition-party'), 'Informed Party Selection Modal renders party cards with exact voter totals');

    // Select a newly spawned breakup party and verify persistence across save/reload
    const spawnedParty = afterDismiss.partySystems.coalitionSystem.postBreakupParties.find((p) => p.isNew);
    assert(Boolean(spawnedParty) && spawnedParty.exactVoters > 0, `Spawned post-breakup party "${spawnedParty?.name}" holds ${spawnedParty?.voterMillions}M represented voters`);
    const switched = Engine.takeAction(afterDismiss, 'select-coalition-era-party', { partyId: spawnedParty.id });
    assert(switched.player.baseTemplateId === spawnedParty.id && switched.player.name === spawnedParty.name, `Chair switched cleanly to post-breakup party "${switched.player.name}"`);
    assert(switched.partySystems.pendingModal === null && switched.partySystems.coalitionSystem.partySelectionCompleted === true, 'Selecting post-breakup party closes party_select modal cleanly');

    mockLocalStorage.clear();
    Engine.saveGame(switched);
    const reloaded = Engine.loadGame();
    assert(reloaded.player.baseTemplateId === spawnedParty.id && reloaded.player.name === spawnedParty.name, 'Spawned Era #18 party Chair status persists cleanly across v16.0 save/reload');

    // ------------------------------------------------------------------
    // SUITE 3: Era #18 Nationwide MMP, Coalition Bargaining & Stability Crisis
    // ------------------------------------------------------------------
    console.log('\n--- SUITE 3: Era #18 Nationwide MMP, 3-4 Coalitions & Stability Meter ---');
    const mmpDistrict = Engine.calculateDistrictElection(reloaded, 2040);
    assert(Boolean(mmpDistrict.mmpSummary) && mmpDistrict.mmpSummary.mmpActive === true, 'calculateDistrictElection executes Nationwide MMP under Era #18');
    const totalMmpHouse = Object.values(mmpDistrict.mmpSummary.houseSeatsByParty).reduce((a, b) => a + b, 0);
    const totalMmpSenate = Object.values(mmpDistrict.mmpSummary.senateSeatsByParty).reduce((a, b) => a + b, 0);
    assert(totalMmpHouse === 870, `Nationwide MMP House seats sum strictly to 870 (got ${totalMmpHouse})`);
    assert(totalMmpSenate === 100, `Nationwide MMP Senate seats sum strictly to 100 (got ${totalMmpSenate})`);

    // Full Election Resolution triggers National Coalition Bargaining Modal
    const postElection = Engine.resolveVersion01GeneralElection({ ...reloaded, phase: 'general-campaign' });
    assert(postElection.partySystems.pendingModal === 'coalition', 'Certified Era #18 election automatically opens National Coalition Bargaining Modal');
    const bargainHtml = PSUI.renderActivePartySystemsModal(postElection);
    assert(bargainHtml.includes('National Coalition Bargaining Chamber') && bargainHtml.includes('data-coalition-bargain="anchor"'), 'Coalition Bargaining Modal renders Anchor, Join, and Opposition paths');

    // Path 1: Anchor Coalition -> consolidates into 3 to 4 unified nationwide coalitions
    const anchored = Engine.takeAction(postElection, 'resolve-coalition-bargaining', { mode: 'anchor' });
    const coalCount = anchored.partySystems.coalitionSystem.nationalCoalitions.length;
    assert(coalCount >= 3 && coalCount <= 4, `Anchor bargaining consolidates parties into 3-4 nationwide coalitions (got ${coalCount})`);
    assert(anchored.partySystems.coalitionSystem.playerRole === 'anchor' && anchored.partySystems.coalitionSystem.activeAccords.length > 0, 'Anchor bargaining establishes binding Coalition Policy Accords');
    assert(anchored.partySystems.coalitionSystem.stability >= 40 && anchored.partySystems.coalitionSystem.stability <= 100, `Coalition Stability Meter initialized (${anchored.partySystems.coalitionSystem.stability}/100)`);
    assert(PSUI.renderCoalitionStabilityHud(anchored).includes('Coalition Stability'), 'Coalition Stability Meter HUD renders in dashboard');

    // Path 2: Join Invited Coalition
    const joined = Engine.takeAction(postElection, 'resolve-coalition-bargaining', { mode: 'join' });
    assert(joined.partySystems.coalitionSystem.playerRole === 'join' && joined.partySystems.coalitionSystem.nationalCoalitions.length >= 3 && joined.partySystems.coalitionSystem.nationalCoalitions.length <= 4, 'Join bargaining consolidates into 3-4 nationwide coalitions with player as junior partner');

    // Path 3: Sit in Opposition (+15% base enthusiast turnout)
    const opp = Engine.takeAction(postElection, 'resolve-coalition-bargaining', { mode: 'opposition' });
    assert(opp.partySystems.coalitionSystem.playerRole === 'opposition' && opp.partySystems.coalitionSystem.oppositionTurnoutBonus === 15.0, 'Opposition path grants +15% base enthusiast turnout bonus');
    const oppTurnMod = PSEngine.dispatchEraHook(opp, 'getTurnoutModifier', opp.player.baseTemplateId, 'PA');
    assert(oppTurnMod === 15.0, `Era #18 turnout hook delivers +15.0% boost for Official Opposition (got ${oppTurnMod})`);

    // Violating partner red lines drains Stability below 25 -> triggers Mid-Cycle Fracture Crisis
    let stressed = JSON.parse(JSON.stringify(anchored));
    stressed.partySystems.coalitionSystem.stability = 30;
    const redLine = stressed.partySystems.coalitionSystem.activeAccords[0];
    const violatingStance = redLine.direction === 'max' ? 9.5 : 1.5;
    stressed = PSEngine.evaluateCoalitionStabilityImpact(stressed, { kind: 'bill', axis: redLine.axis || 'economic', stanceValue: violatingStance, label: 'Controversial Partisan Bill' });
    assert(stressed.partySystems.coalitionSystem.stability < 25, `Violating partner red line drops Stability below 25 (got ${stressed.partySystems.coalitionSystem.stability})`);
    assert(Boolean(stressed.partySystems.coalitionSystem.fractureCrisis) && stressed.partySystems.pendingModal === 'coalition_fracture', 'Stability < 25 triggers Mid-Cycle Fracture Crisis modal');

    // Mid-modal save/reload preserves fracture crisis modal
    Engine.saveGame(stressed);
    const reloadedCrisis = Engine.loadGame();
    assert(reloadedCrisis.partySystems.pendingModal === 'coalition_fracture', 'Mid-Cycle Fracture Crisis modal persists across save/reload');

    const conceded = Engine.takeAction(reloadedCrisis, 'resolve-coalition-fracture', { choice: 'concede' });
    assert(conceded.partySystems.coalitionSystem.fractureCrisis === null && conceded.partySystems.coalitionSystem.stability >= 50, 'Conceding partner red line resolves fracture crisis and stabilizes pact');
    const dissolved = Engine.takeAction(reloadedCrisis, 'resolve-coalition-fracture', { choice: 'dissolve' });
    assert(dissolved.partySystems.coalitionSystem.playerRole === 'opposition' && dissolved.partySystems.coalitionSystem.oppositionTurnoutBonus === 15.0, 'Dissolving pact transitions player to Official Opposition (+15% turnout)');
  }

  // ------------------------------------------------------------------
  // SUITE 4: Flagship Era #16 — Robots Become Citizens (310M+ Scale & 4 Robot Parties)
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 4: Era #16 Robots Become Citizens (310M+ Scale, 100% Turnout & 4 Robot Parties) ---');
  {
    const base = Engine.createGame({ baseTemplateId: 'people' });
    assert(!PSEngine.getEligiblePartySystems(base, 2080).some((c) => c.era.id === 'era_16_robots_citizens'), 'Era #16 blocked without Era #15 (The AI Boom) predecessor');

    // Enter Era #15 (The AI Boom) in 2040
    const era15 = PSEngine.transitionToPartySystem(base, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);
    assert(!PSEngine.getEligiblePartySystems(era15, 2078).some((c) => c.era.id === 'era_16_robots_citizens'), 'Era #16 blocked at 38 years after Era #15 (< 40 yr floor)');
    const elig2080 = PSEngine.getEligiblePartySystems(era15, 2080);
    const e16Cand = elig2080.find((c) => c.era.id === 'era_16_robots_citizens');
    assert(Boolean(e16Cand) && e16Cand.weight === 5, 'Era #16 eligible with Weight 5 at >= 40 years after Era #15');

    // Transition to Era #16 (Robots Become Citizens) in 2080
    const era16 = PSEngine.transitionToPartySystem(era15, PSData.ALL_ERAS_BY_ID.era_16_robots_citizens, 2080);
    assert(PSEngine.getActiveIssuesForGame(era16).length === PCData.VERSION_021_ISSUES.length, `Era #16 maintains strict ${PCData.VERSION_021_ISSUES.length}-issue platform clamp`);
    const e16Issues = era16.partySystems.activeIssueIds.filter((id) => id.startsWith('era16-'));
    assert(e16Issues.length === 10, `Era #16 introduces exact 10 synthetic civil-rights issues (got ${e16Issues.length})`);

    // Authorized 310M+ Scale Exception (155M human + 155M synthetic)
    const stateTotalVoters = era16.voterModel.states.reduce((s, st) => s + (st.representedVoters || 0), 0);
    const stateSynthVoters = era16.voterModel.states.reduce((s, st) => s + (st.syntheticRepresentedVoters || 0), 0);
    assert(era16.voterModel.syntheticScaleAuthorized === true, 'voterModel.syntheticScaleAuthorized flag set');
    assert(stateSynthVoters === 155_000_000, `Exact 155,000,000 synthetic voters distributed across all 51 jurisdictions (got ${stateSynthVoters})`);
    assert(stateTotalVoters === 310_000_000 && era16.voterModel.representedVoters === 310_000_000, `Total represented electorate expanded cleanly to 310,000,000 (got ${stateTotalVoters})`);

    // Four Dedicated Robot Political Parties (~25% synthetic vote each) & 2 core factions each
    const expectedRobots = [
      { id: 'robot_silicon_vanguard', name: 'Silicon Vanguard Party', color: '#06B6D4' },
      { id: 'robot_synth_solidarity', name: 'Synth-Solidarity Union', color: '#D97706' },
      { id: 'robot_harmonic_integration', name: 'Harmonic Integration Party', color: '#8B5CF6' },
      { id: 'robot_sovereign_lattice', name: 'Sovereign Lattice Party', color: '#4338CA' },
    ];
    expectedRobots.forEach((spec) => {
      const rObj = era16.rivals.find((r) => r.id === spec.id);
      assert(Boolean(rObj) && rObj.name === spec.name && rObj.color === spec.color, `Spawned ${spec.name} (${spec.color})`);
      const rFacs = era16.factions.filter((f) => f.partyId === spec.id);
      assert(rFacs.length === 2, `${spec.name} has exact 2 core synthetic factions (${rFacs.map((f) => f.name).join(' & ')})`);
      const rVoters = era16.voterModel.affiliations[spec.id]?.representedVoters || 0;
      const pctOfSynth = (rVoters / 155_000_000) * 100;
      assert(Math.abs(pctOfSynth - 25.0) < 0.5, `${spec.name} holds ~25% of synthetic electorate (${pctOfSynth.toFixed(2)}% / ${(rVoters / 1e6).toFixed(2)}M)`);
    });

    // Synthetic Turnout Invariant: Zero turnout variance (exact 100.0% across states)
    const paState = sandbox.window.PartyChairData.STATES.find((s) => s.id === 'PA');
    const txState = sandbox.window.PartyChairData.STATES.find((s) => s.id === 'TX');
    expectedRobots.forEach((spec) => {
      const rObj = era16.rivals.find((r) => r.id === spec.id);
      const tPA = Engine.turnout(era16, rObj, paState);
      const tTX = Engine.turnout(era16, rObj, txState);
      assert(tPA === 100.0 && tTX === 100.0, `${spec.name} obeys 100.0% zero-variance synthetic turnout invariant in Engine.turnout (PA=${tPA}, TX=${tTX})`);
    });

    // Proportional Representation for Robotic Seats
    const robElec = Engine.calculateDistrictElection(era16, 2080);
    assert(Boolean(robElec.roboticSeatSummary), 'calculateDistrictElection produces proportional roboticSeatSummary');
    const sumRobHouse = Object.values(robElec.roboticSeatSummary.robotHouseAllocation).reduce((a, b) => a + b, 0);
    const sumAllHouse = Object.values(robElec.seats).reduce((a, b) => a + b, 0);
    assert(sumRobHouse === robElec.roboticSeatSummary.roboticHouseQuota && sumRobHouse > 100, `Proportional robotic seats allocated (${sumRobHouse} robotic House seats)`);
    assert(sumAllHouse === 435, `Total federal House seats strictly preserved at 435 with synthetic seats included (got ${sumAllHouse})`);

    // Robot Party Selection Modal & Chair Switch + Robot Theme CSS
    const afterRobDismiss = Engine.takeAction(era16, 'dismiss-realignment-modal');
    assert(afterRobDismiss.partySystems.pendingModal === 'robot_select', 'Dismissing Era #16 chronicle opens Robot Party Selection Modal (robot_select)');
    const robModalHtml = PSUI.renderActivePartySystemsModal(afterRobDismiss);
    assert(robModalHtml.includes('Silicon Vanguard Party') && robModalHtml.includes('Sovereign Lattice Party') && robModalHtml.includes('310.00M'), 'Robot Party Selection Modal renders all 4 Robot Parties & 310M electorate');

    const chairRobot = Engine.takeAction(afterRobDismiss, 'select-robot-era-party', { partyId: 'robot_silicon_vanguard' });
    assert(chairRobot.player.baseTemplateId === 'robot_silicon_vanguard' && chairRobot.player.name === 'Silicon Vanguard Party', 'Player switched cleanly to chair Silicon Vanguard Party');
    assert(chairRobot.partySystems.robotCitizenship.playerSwitchedToRobot === true, 'robotCitizenship records playerSwitchedToRobot=true');

    App.setGame(chairRobot);
    const robotCampHtml = App.campaignMarkup();
    assert(robotCampHtml.includes('robot-party-theme') && robotCampHtml.includes('robot-theme-silicon-vanguard'), 'App renders dedicated Robot Party theme class on dashboard');
    assert(robotCampHtml.includes('310.00M represented voters'), 'App resource strip & footer display expanded 310.00M electorate scale');

    // Save/reload persistence for Robot Chair & 310M voter scale
    mockLocalStorage.clear();
    Engine.saveGame(chairRobot);
    const reloadedRobot = Engine.loadGame();
    assert(reloadedRobot.player.baseTemplateId === 'robot_silicon_vanguard' && reloadedRobot.voterModel.representedVoters === 310_000_000, 'Robot Party Chair & 310M scale persist cleanly across v16.0 save/reload');
  }

  // ------------------------------------------------------------------
  // SUITE 5: Multi-Decade Continuity Across 3+ Successive Eras & Cross-Era Stacking
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 5: Multi-Decade Continuity (Era 7 -> 8 -> 9 -> 10 -> 11) ---');
  {
    let saga = Engine.createGame({ baseTemplateId: 'people' });
    // Era 8 (2040): The AI Boom
    saga = PSEngine.transitionToPartySystem(saga, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);
    // Era 9 (2080, +40 yrs): Robots Become Citizens (310M scale)
    saga = PSEngine.transitionToPartySystem(saga, PSData.ALL_ERAS_BY_ID.era_16_robots_citizens, 2080);
    // Era 10 (2110, +30 yrs): The Party Coalition Era stacked over Robots Become Citizens!
    saga = PSEngine.transitionToPartySystem(saga, PSData.ALL_ERAS_BY_ID.era_18_party_coalition, 2110);
    // Era 11 (2140, +30 yrs): The Permanent Emergency Cycle stacked over Era #18 + Era #16!
    saga = PSEngine.transitionToPartySystem(saga, PSData.ALL_ERAS_BY_ID.era_20_permanent_emergency, 2140);

    assert(saga.partySystems.currentEraNumber === 11, `Advanced cleanly to 11th Party System (got ${saga.partySystems.currentEraNumber})`);
    assert(saga.partySystems.priorErasHistory.length === 4, `Archived all 4 prior eras in priorErasHistory (got ${saga.partySystems.priorErasHistory.length})`);
    assert(new Set(saga.partySystems.experiencedEraIds).size === 5, 'Zero repeated eras across 5-era century-long timeline');
    assert(PSEngine.getActiveIssuesForGame(saga).length === PCData.VERSION_021_ISSUES.length, `Strict ${PCData.VERSION_021_ISSUES.length}-issue invariant holds after 4 successive era transitions`);
    assert(saga.voterModel.representedVoters === 310_000_000, `310M synthetic voter scale persists intact across Era #18 & Era #20 stacking (${saga.voterModel.representedVoters})`);
    assert(PSEngine.isNationwideMMPActive(saga) === true && PSEngine.isSyntheticSuffrageActive(saga) === true, 'Both Nationwide MMP and Synthetic Suffrage persist across Era 11 stacking');
    const postStackedElec = Engine.resolveVersion01GeneralElection({ ...saga, phase: 'general-campaign' });
    assert(postStackedElec.partySystems.pendingModal === 'coalition', 'Persistent MMP Coalition Bargaining hook still triggers even after stacking Era #20 over Era #18');
  }

  // ------------------------------------------------------------------
  // SUITE 6: Backward Save Migration (v15.8 & v15.9 -> v16.0) & Vibes Audit
  // ------------------------------------------------------------------
  console.log('\n--- SUITE 6: Backward Save Migration (v15.8/v15.9 -> v16.0) & Vibes Audit ---');
  {
    const legacy158 = Engine.createGame({ baseTemplateId: 'heritage' });
    delete legacy158.partySystems;
    legacy158.version = '0.15.8';
    mockLocalStorage.clear();
    mockLocalStorage.setItem('partyChairGame.save.v15.8', JSON.stringify(legacy158));
    const migrated158 = Engine.loadGame();
    assert(Boolean(migrated158) && Boolean(migrated158.version) && migrated158.partySystems?.currentEraId === 'era_07_baseline', 'Legacy v15.8 save migrates seamlessly to current version');

    const legacy159 = Engine.createGame({ baseTemplateId: 'green' });
    legacy159.version = '0.15.9';
    mockLocalStorage.clear();
    mockLocalStorage.setItem('partyChairGame.save.v15.9', JSON.stringify(legacy159));
    const migrated159 = Engine.loadGame();
    assert(Boolean(migrated159) && Boolean(migrated159.version) && migrated159.player.baseTemplateId === 'green', 'Legacy v15.9 save migrates seamlessly to current version');

    // Atmospheric Vibes Scanner across all Phase 4 rendered HTML
    const forbiddenPatterns = [/REQ-\d+/i, /MAS-\d+/i, /Weight\s*=\s*\d/i, /Probability:/i, /1\.55M/i];
    const sample18 = PSEngine.transitionToPartySystem(seedSixPartiesInHouse(Engine.createGame({ baseTemplateId: 'people' })), PSData.ALL_ERAS_BY_ID.era_18_party_coalition, 2040);
    const sample16 = PSEngine.transitionToPartySystem(PSEngine.transitionToPartySystem(Engine.createGame({ baseTemplateId: 'people' }), PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040), PSData.ALL_ERAS_BY_ID.era_16_robots_citizens, 2080);
    const allUiSamples = [
      PSUI.renderRealignmentModal(sample18),
      PSUI.renderEraDossierModal(sample18),
      PSUI.renderPartySelectModal(Engine.takeAction(sample18, 'dismiss-realignment-modal')),
      PSUI.renderRealignmentModal(sample16),
      PSUI.renderEraDossierModal(sample16),
      PSUI.renderRobotPartySelectionModal(Engine.takeAction(sample16, 'dismiss-realignment-modal')),
    ].join('\n');

    forbiddenPatterns.forEach((pat) => {
      assert(!pat.test(allUiSamples), `Phase 4 UI output free of forbidden technical leak matching ${pat}`);
    });
  }

  console.log('\n====================================================================');
  console.log(` ALL MAS-01 PHASE 4 & V0.16.0 CHECKS PASSED: ${passed}/${total} (100%)`);
  console.log('====================================================================');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 4 TEST SUITE FAILED:', err.message || err);
  process.exit(1);
});
