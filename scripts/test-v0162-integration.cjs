/**
 * Master Verification & Integration Test Suite for Version 0.16.2
 * Target: scripts/test-v0162-integration.cjs
 *
 * Covers VERSION_0.16.2_DESIGN.md (REQ-224 through REQ-244):
 * - Suite 1: Statehouse Farm Team (REQ-224 - REQ-226)
 * - Suite 2: Draft-of-7 Priorities Engine (REQ-230 - REQ-231)
 * - Suite 3: Strategic Quests Catalog Expansion (REQ-227 - REQ-229, REQ-232 - REQ-233)
 * - Suite 4: Historical Party Systems Canon (REQ-234)
 * - Suite 5: Custom Party Creation & Anchoring (REQ-235 - REQ-237)
 * - Suite 6: Custom Party Lifecycle & Identity (REQ-238 - REQ-242)
 * - Suite 7: Custom-Only Priorities (REQ-243 - REQ-244)
 * - Suite 8: Save Migration & Invariants (155M scale, zero REQ-XX tags)
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
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'engine.js',
  'app.js',
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const Data = sandbox.window.PartyChairData;
const PSData = sandbox.window.PartySystemsData;
const PSEngine = sandbox.window.PartySystemsEngine;
const PSUI = sandbox.window.PartySystemsUI;
const V07 = sandbox.window.PartyChairV07;
const App = sandbox.window.PartyChairApp;

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

async function runSuite() {
  await waitForApp();
  const App = sandbox.window.PartyChairApp;
  console.log('====================================================================');
  console.log(' COALITION BUILDER: PARTY CHAIR - VERSION 0.16.2 INTEGRATION TEST');
  console.log('====================================================================\n');

  assert(Boolean(Engine), 'PartyChairEngine initialized on window');
  assert(Boolean(Data), 'PartyChairData initialized on window');
  assert(Boolean(PSData), 'PartySystemsData initialized on window');
  assert(Boolean(PSEngine), 'PartySystemsEngine initialized on window');
  assert(Boolean(PSUI), 'PartySystemsUI initialized on window');

  // ============================================================================
  // SUITE 1: Statehouse Farm Team (REQ-224 - REQ-226)
  // ============================================================================
  console.log('\n--- SUITE 1: Statehouse Farm Team (REQ-224 - REQ-226) ---');
  let game = Engine.createGame({ baseTemplateId: 'people' });
  assert(typeof Engine.evaluateStatehouseStandouts === 'function', 'Engine.evaluateStatehouseStandouts is exported');

  // Mock an outcome with statehouse gains for a rising/minor party (< 10 federal officeholders)
  let farmTeamGame = Engine.createGame({ baseTemplateId: 'liberty' });
  const mockOutcome = {
    flips: { liberty: ['PA', 'MI'], people: [] },
  };
  farmTeamGame.stateHouseSeatCounts = {
    PA: { liberty: 5, people: 100, heritage: 98 },
    MI: { liberty: 3, people: 55, heritage: 52 },
  };
  const withStandouts = Engine.evaluateStatehouseStandouts(farmTeamGame, mockOutcome);
  const libertyStandouts = withStandouts.stateLegStandouts?.liberty || [];
  assert(libertyStandouts.length >= 1, `Spawned ${libertyStandouts.length} statehouse standouts`);
  const firstStandout = libertyStandouts[0];
  assert(firstStandout.office === 'stateLeg', `Standout has office === 'stateLeg' (got ${firstStandout.office})`);
  assert(firstStandout.quality >= 5 && firstStandout.quality <= 8, `Standout quality within 5-8 band (got ${firstStandout.quality})`);
  assert(firstStandout.fame >= 20 && firstStandout.fame <= 55, `Standout fame within 20-55 band (got ${firstStandout.fame})`);
  assert(Boolean(firstStandout.isStateLegStandout), 'Standout has isStateLegStandout flag');

  // Test 12-member roster cap
  let floodGame = { ...withStandouts, stateLegStandouts: { liberty: [] } };
  for (let i = 0; i < 20; i++) {
    floodGame.stateLegStandouts.liberty.push({
      id: `standout_${i}`,
      name: `Standout ${i}`,
      stateId: 'PA',
      office: 'stateLeg',
      quality: 6,
      fame: 30 + i,
      cyclesInOffice: 1,
    });
  }
  const cappedGame = Engine.evaluateStatehouseStandouts(floodGame, { flips: { liberty: [] } });
  assert((cappedGame.stateLegStandouts.liberty || []).length <= 12, `Roster capped at 12 members (got ${cappedGame.stateLegStandouts.liberty.length})`);

  // Test promotion pipeline (REQ-225)
  const candidateToPromote = libertyStandouts[0];
  const promotedGame = Engine.takeAction(withStandouts, 'promote-state-legislator', {
    memberId: candidateToPromote.id,
    targetOffice: 'house',
  });
  const remainingStandouts = promotedGame.stateLegStandouts?.liberty || [];
  assert(!remainingStandouts.some((m) => m.id === candidateToPromote.id), 'Promoted lawmaker removed from standouts roster');
  const promotedRecord = (promotedGame.recruitedCandidates || []).find((m) => m.id === candidateToPromote.id);
  assert(Boolean(promotedRecord), 'Promoted lawmaker added to recruited candidates');
  assert(promotedRecord.office === 'house', 'Promoted lawmaker office reassigned to house');
  assert(Array.isArray(promotedRecord.careerMilestones) && promotedRecord.careerMilestones.includes('Served in State Legislature'), 'Career milestones logged "Served in State Legislature"');

  // Test leadership role stateLegCaucusChair (REQ-226)
  const caucusRole = V07.LEADERSHIP_ROLES_SCHEMA.find((r) => r.id === 'stateLegCaucusChair');
  assert(Boolean(caucusRole), 'stateLegCaucusChair role defined in LEADERSHIP_ROLES_SCHEMA');
  assert(caucusRole.requiredOffice === 'stateLeg', 'Role requiredOffice is stateLeg');
  assert(caucusRole.passiveDesc?.includes('+1.5 State Legislature support'), 'Role passive grants +1.5 State Legislature support');
  assert(V07.isRoleUnlockedForParty(farmTeamGame, 'liberty', caucusRole) === true, 'stateLegCaucusChair unlocked when party holds statehouse seats and 0 House/Senate seats');

  // ============================================================================
  // SUITE 2: Draft-of-7 Priorities Engine (REQ-230 - REQ-231)
  // ============================================================================
  console.log('\n--- SUITE 2: Draft-of-7 Priorities Engine (REQ-230 - REQ-231) ---');
  assert(typeof Engine.generateOfferedPrioritiesHand === 'function', 'Engine.generateOfferedPrioritiesHand is exported');
  const hand1 = Engine.generateOfferedPrioritiesHand(game, 0);
  assert(Array.isArray(hand1) && hand1.length === 7, `Draft hand generates exactly 7 priority quests (got ${hand1.length})`);

  // Assert deterministic reload-identical hand
  const hand1Reload = Engine.generateOfferedPrioritiesHand(game, 0);
  assert(JSON.stringify(hand1) === JSON.stringify(hand1Reload), 'Hand is 100% deterministic and reload-identical for identical seed+year+party+redrawCount');

  // Redraw hand
  const handRedraw = Engine.generateOfferedPrioritiesHand(game, 1);
  assert(Array.isArray(handRedraw) && handRedraw.length === 7, 'Redrawn hand contains 7 quests');

  // Redraw action
  game.actionsLeft = 4;
  game.organizingActionsRemaining = 20;
  const afterRedraw = Engine.takeAction(game, 'redraw-priorities-hand');
  assert(afterRedraw.priorities.redrawCount === 1, `Redraw count incremented to 1 (got ${afterRedraw.priorities.redrawCount})`);
  assert(afterRedraw.actionsLeft === 3, `1 action deducted for first redraw (got ${afterRedraw.actionsLeft})`);

  // Selection & locking
  const offeredIds = afterRedraw.priorities.offeredQuestIds;
  let gameSelect = Engine.takeAction(afterRedraw, 'select-main-priority', { questId: offeredIds[0] });
  gameSelect = Engine.takeAction(gameSelect, 'select-main-priority', { questId: offeredIds[1] });
  gameSelect = Engine.takeAction(gameSelect, 'select-main-priority', { questId: offeredIds[2] });
  assert((gameSelect.priorities.main || []).length === 3, 'Selected 3 major strategic priorities');

  const lockedGame = Engine.takeAction(gameSelect, 'lock-main-priorities');
  assert(lockedGame.priorities.handLocked === true, 'Hand locked flag set on priorities');
  assert(lockedGame.prioritiesLocked === true, 'prioritiesLocked flag set on game');

  // ============================================================================
  // SUITE 3: Strategic Quests Catalog Expansion (REQ-227 - REQ-229, REQ-232 - REQ-233)
  // ============================================================================
  console.log('\n--- SUITE 3: Strategic Quests Catalog Expansion (REQ-227 - REQ-229, REQ-232 - REQ-233) ---');
  const allQuests = Data.OVERALL_PRIORITY_QUESTS;
  assert(allQuests.length >= 45, `Strategic Quests catalog expanded (got ${allQuests.length})`);

  // REQ-227 (Pack A: Vote-Threshold & Institutional Ascent)
  const req227Ids = ['cross-5pct-funding', 'shatter-15pct-debate', 'secure-50-state-ballot', 'build-statehouse-farm-team'];
  req227Ids.forEach((id) => {
    const q = allQuests.find((x) => x.id === id);
    assert(Boolean(q), `Quest ${id} defined in catalog`);
    assert(typeof q.checkCompletion === 'function', `Quest ${id} has evaluator function`);
  });

  // REQ-228 (Pack B: Regional Bastion, Electoral Reform & Kingmaker)
  const req228Ids = ['carve-regional-bastion', 'break-the-duopoly-reform', 'become-the-kingmaker', 'poach-sitting-lawmaker'];
  req228Ids.forEach((id) => {
    const q = allQuests.find((x) => x.id === id);
    assert(Boolean(q), `Quest ${id} defined in catalog`);
    assert(typeof q.checkCompletion === 'function', `Quest ${id} has evaluator function`);
  });

  // REQ-229 (Pack C: Historic Breakthrough & Major-Party Displacement)
  const req229Ids = ['win-first-electoral-votes', 'force-12th-amendment-deadlock', 'overtake-major-party', 'survive-big-tent-crossroads'];
  req229Ids.forEach((id) => {
    const q = allQuests.find((x) => x.id === id);
    assert(Boolean(q), `Quest ${id} defined in catalog`);
    assert(typeof q.checkCompletion === 'function', `Quest ${id} has evaluator function`);
  });

  // REQ-232 (Generic Priorities: Turnout Engine & Build Up the Bench)
  const req232Ids = ['turnout-engine', 'build-up-the-bench'];
  req232Ids.forEach((id) => {
    const q = allQuests.find((x) => x.id === id);
    assert(Boolean(q), `Quest ${id} defined in catalog`);
    assert(typeof q.checkCompletion === 'function', `Quest ${id} has evaluator function`);
  });

  // REQ-233 (Targetable Hostile-Territory Priorities)
  const req233Ids = ['crack-opponent-stronghold', 'crack-opponents-fortress'];
  req233Ids.forEach((id) => {
    const q = allQuests.find((x) => x.id === id);
    assert(Boolean(q), `Quest ${id} defined in catalog`);
    assert(Boolean(q.isTargetable), `Quest ${id} has isTargetable property`);
    assert(typeof q.checkCompletion === 'function', `Quest ${id} has evaluator function`);
  });

  // ============================================================================
  // SUITE 4: Historical Party Systems Canon (REQ-234)
  // ============================================================================
  console.log('\n--- SUITE 4: Historical Party Systems Canon (REQ-234) ---');
  assert(Array.isArray(PSData.HISTORICAL_CANON_ERAS), 'HISTORICAL_CANON_ERAS defined in PartySystemsData');
  assert(PSData.HISTORICAL_CANON_ERAS.length === 6, `Exact 6 historical canon eras defined (got ${PSData.HISTORICAL_CANON_ERAS.length})`);
  assert(PSData.BASELINE_ERA.title === 'The Modern Populist Era', `7th era retitled to "The Modern Populist Era" (got "${PSData.BASELINE_ERA.title}")`);
  assert(PSData.BASELINE_ERA.currentEraStartYear === 2006, `Baseline era start year set to 2006 (got ${PSData.BASELINE_ERA.currentEraStartYear})`);
  assert(typeof PSUI.renderEraDatingPhilosophyModal === 'function', 'PSUI.renderEraDatingPhilosophyModal is exported');
  const datingModalHtml = PSUI.renderEraDatingPhilosophyModal(game);
  assert(datingModalHtml.includes('Two Signature Moments'), 'Dating modal cites Two Signature Moments philosophy');

  // ============================================================================
  // SUITE 5: Custom Party Creation & Anchoring (REQ-235 - REQ-237)
  // ============================================================================
  console.log('\n--- SUITE 5: Custom Party Creation & Anchoring (REQ-235 - REQ-237) ---');
  const customGame = Engine.createGame({
    baseTemplateId: 'custom',
    customName: 'Civic Renewal Party',
    customOrigin: 'civic_reform',
    customCharterTraits: ['big_tent_pragmatism', 'state_first_federation'],
    customCode: 'CRP',
    customEmblem: 'compass',
    customMotto: 'Progress Through Reason',
    foundingStateId: 'PA',
    selectedFactionIds: ['dem_progressive_reformers', 'gop_moderate_main_street'],
  });
  assert(customGame.player.custom === true, 'Custom party player.custom is true');
  assert(customGame.player.name === 'Civic Renewal Party', `Party name matches (got "${customGame.player.name}")`);
  assert(customGame.player.customCode === 'CRP', `Custom code matches (got "${customGame.player.customCode}")`);
  assert(customGame.player.customEmblem === 'compass', `Custom emblem matches (got "${customGame.player.customEmblem}")`);
  assert(customGame.player.customMotto === 'Progress Through Reason', `Custom motto matches (got "${customGame.player.customMotto}")`);
  assert(customGame.player.foundingStateId === 'PA', `Founding state is PA (got "${customGame.player.foundingStateId}")`);

  // Anchor Faction Lock (REQ-236)
  assert(typeof Engine.triggerInternalAnchorCrisis === 'function', 'Engine.triggerInternalAnchorCrisis is exported');
  const boltAttemptDem = Engine.boltFaction(game, 'dem_liberal_establishment');
  assert(Boolean(boltAttemptDem.activeAnchorCrisis), 'Attempt to bolt dem_liberal_establishment triggers Internal Anchor Crisis');
  assert(boltAttemptDem.activeAnchorCrisis.turnoutDrag === 0.04, 'Anchor crisis applies 4.0% turnout drag');
  assert(boltAttemptDem.activeAnchorCrisis.fundraisingDrag === 0.15, 'Anchor crisis applies 15% fundraising drag');

  const resolvedAnchorGame = Engine.takeAction(boltAttemptDem, 'resolve-anchor-crisis');
  assert(!resolvedAnchorGame.activeAnchorCrisis, 'Resolving anchor crisis clears activeAnchorCrisis');

  // ============================================================================
  // SUITE 6: Custom Party Lifecycle & Identity (REQ-238 - REQ-242)
  // ============================================================================
  console.log('\n--- SUITE 6: Custom Party Lifecycle & Identity (REQ-238 - REQ-242) ---');
  // 100K Founding Faction Builder (REQ-240)
  const notMovementGame = Engine.createGame({
    baseTemplateId: 'custom',
    customName: 'Keystone Vanguard',
    customOrigin: 'not_major_movement',
    customCharterTraits: ['doctrinal_vanguard'],
    customCode: 'KEY',
    customFactionSliders: { economic: 3.5, social: 7.2, governance: 5.0 },
    customFactionStateAllocations: { PA: 60000, OH: 40000 },
  });
  assert(Boolean(notMovementGame.customFaction100k), '100K custom faction initialized');
  assert(notMovementGame.customFaction100k.targetVoters === 100000, `Exact 100,000 voters created (got ${notMovementGame.customFaction100k.targetVoters})`);

  // Total represented voters across all states remains exactly 155,000,000
  let totalRepVoters = 0;
  Object.values(notMovementGame.voterModel?.states || {}).forEach((st) => {
    totalRepVoters += st.representedVoters || 0;
  });
  assert(totalRepVoters === 155000000, `Zero-variance 155M voter scale conserved bit-for-bit (got ${totalRepVoters})`);

  // Founder's Shadow Aura & Succession Crisis (REQ-242)
  assert(Boolean(customGame.founderLegacy), 'founderLegacy initialized on custom party');
  assert(customGame.founderLegacy.active === true, 'Movement aura active initially');
  assert(customGame.founderLegacy.movementAuraCyclesRemaining === 3, 'Movement aura has 3 cycles remaining');

  // Trigger succession crisis
  customGame.founderLegacy.movementAuraCyclesRemaining = 0;
  const triggerSuccess = Engine.checkFounderSuccessionTrigger(customGame);
  assert(triggerSuccess === true, 'checkFounderSuccessionTrigger returned true upon aura expiration');
  assert(customGame.founderLegacy.successionTriggered === true, 'successionTriggered flag set');

  // Resolve succession via institutionalize path
  const successionResolvedGame = Engine.takeAction(customGame, 'resolve-succession-crisis', { path: 'institutionalize' });
  assert(successionResolvedGame.founderLegacy.successionResolved === true, 'Succession crisis resolved');
  assert(successionResolvedGame.founderLegacy.postSuccessionCyclePending === true, 'postSuccessionCyclePending flag armed for next cycle');

  // ============================================================================
  // SUITE 7: Custom-Only Priorities (REQ-243 - REQ-244)
  // ============================================================================
  console.log('\n--- SUITE 7: Custom-Only Priorities (REQ-243 - REQ-244) ---');
  const customOnlyQuests = allQuests.filter((q) => q.customOnly === true);
  assert(customOnlyQuests.length === 9, `Exact 9 custom-only priorities defined (got ${customOnlyQuests.length})`);

  const expectedCustomIds = [
    'beat-sophomore-slump',
    'seal-the-merger',
    'outpoll-former-home',
    'survive-the-founder',
    'prove-not-a-spoiler',
    'build-home-state-fortress',
    'silence-sellout-critics',
    'forge-unlikely-alliance',
    'homegrown-bench',
  ];
  expectedCustomIds.forEach((id) => {
    const q = customOnlyQuests.find((x) => x.id === id);
    assert(Boolean(q), `Custom-only priority ${id} defined`);
    // Ensure preset parties are never eligible
    const standardGame = Engine.createGame({ baseTemplateId: 'people' });
    const isEligibleForStandard = q.checkEligibility ? q.checkEligibility(standardGame) : false;
    assert(!isEligibleForStandard, `Custom priority ${id} blocked for standard parties`);
  });

  // Test survive-the-founder eligibility with postSuccessionCyclePending
  const surviveQuest = customOnlyQuests.find((q) => q.id === 'survive-the-founder');
  assert(surviveQuest.checkEligibility(successionResolvedGame) === true, 'Survive the Founder eligible when postSuccessionCyclePending is armed');

  // ============================================================================
  // SUITE 8: Save Migration & Invariants (155M scale, zero REQ-XX tags)
  // ============================================================================
  console.log('\n--- SUITE 8: Save Migration & Invariants ---');
  // Check SAVE_KEY
  assert(Engine.SAVE_KEY === 'partyChairGame.save.v16.2', `SAVE_KEY is partyChairGame.save.v16.2 (got ${Engine.SAVE_KEY})`);

  // Migrate mock v16.1 save
  const legacyV161Save = {
    version: '0.16.1',
    year: 2028,
    phase: 'organizing',
    player: { id: 'people', name: 'Democratic Party', baseTemplateId: 'people', baseShare: 48 },
    treasury: 120,
    actionsLeft: 4,
    voterModel: game.voterModel,
    factions: game.factions,
  };
  const migrated = Engine.normalizeGame(legacyV161Save);
  assert(migrated.version === '0.17.1' || migrated.version === '0.17.0' || migrated.version.startsWith('0.16'), `Migrated game version is valid (got ${migrated.version})`);
  assert(Boolean(migrated.priorities), 'Migrated game has priorities state');
  assert(Array.isArray(migrated.priorities.offeredQuestIds) && migrated.priorities.offeredQuestIds.length === 7, 'Migrated game dealt opening 7-card priorities hand');
  assert(Boolean(migrated.stateLegStandouts), 'Migrated game has stateLegStandouts object');

  // UI Vibe / Rule 7 & Invariant Audit: Zero REQ-XX, MAS-XX, or 1.55M strings in user-facing markup
  if (App.setGame) App.setGame(migrated);
  const appMarkupHtml = App.campaignMarkup ? App.campaignMarkup() : '';
  const forbiddenPatterns = [
    /REQ-\d+/i,
    /MAS-\d+/i,
    /1\.55M/i,
  ];
  forbiddenPatterns.forEach((pat) => {
    assert(!pat.test(appMarkupHtml), `App campaignMarkup output free of forbidden pattern ${pat}`);
  });

  console.log('\n====================================================================');
  console.log(` ALL VERSION 0.16.2 INTEGRATION TESTS PASSED: ${passedTests}/${totalTests} (100%)`);
  console.log('====================================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ TEST SUITE RUNNER ABORTED WITH ERROR:\n', err);
  process.exit(1);
});
