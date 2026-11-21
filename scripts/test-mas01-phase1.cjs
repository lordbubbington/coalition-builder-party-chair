/**
 * Coalition Builder: Party Chair — MAS-01 Phase 1 Verification Suite
 * Verifies:
 *  1. Base Version 0.15.9 preservation & save compatibility
 *  2. Strict Eligibility Floors (2040 for Era 8; +30 years for Era 9+)
 *  3. Per-Cycle Escalating Transition Roll (10% + 5%/cycle -> 100% in 2076)
 *  4. Weighted Selection Pool (Weight 1 Normal, Weight 3 Triggered, Weight 5 Follow-Up) & No-Repeat Invariant
 *  5. 41-Issue Dynamic Swap Pipeline (7th->8th paired swap, 9th+ probabilistic swap, isolation of unintroduced issues)
 *  6. ±2 Stance Initialization Rule (same-category avg & brand-new category overall avg, clamped 1-10)
 *  7. Faction Key-Issue Automatic Replacement Rule
 *  8. Independent Presidential Candidates Subsystem (20% cadence, 4 tiers, 4 archetypes, dual siphoning, EVs, White House)
 *  9. Era UI Shell (Badge, Realignment Modal, Dossier, Timeline) & Strict Qualitative Atmospheric Vibes Scanner
 * 10. Save Migration from v15.8/v15.9 & Mid-Modal Reload Persistence
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

const sandbox = {
  window: {},
  console,
  Math,
  JSON,
  Number,
  Object,
  Array,
  String,
  Infinity,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Date,
  Set,
  Map,
  Uint8Array,
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  localStorage: mockLocalStorage,
  require,
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
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
  'party-systems-engine.js',
  'party-systems-ui.js',
  'engine.js',
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const PSData = sandbox.window.PartySystemsData;
const PSEngine = sandbox.window.PartySystemsEngine;
const PSUI = sandbox.window.PartySystemsUI;
const ChairData = sandbox.window.PartyChairData;

let passed = 0;
let total = 0;
function assert(cond, msg) {
  total += 1;
  if (!cond) {
    console.error(`  ❌ FAIL: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
  passed += 1;
  console.log(`  ✅ PASS: ${msg}`);
}

console.log('================================================================');
console.log(' MAS-01 PHASE 1: PARTY SYSTEMS EVOLUTION ENGINE TEST SUITE');
console.log('================================================================');

// ------------------------------------------------------------------
// SUITE 1: Base Version 0.15.9 & Initial State Schema
// ------------------------------------------------------------------
console.log('\n--- SUITE 1: Base Version 0.15.9 & Initial State Schema ---');
{
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert(pkg.version === '0.15.9', `package.json preserves base version 0.15.9 (got ${pkg.version})`);
  assert(Engine.SAVE_KEY === 'partyChairGame.save.v15.9', `SAVE_KEY preserves partyChairGame.save.v15.9`);

  const game = Engine.createGame({ baseTemplateId: 'people' });
  assert(game.version === '0.15.9', `createGame() preserves base version 0.15.9 (got ${game.version})`);
  assert(Boolean(game.partySystems), 'game.partySystems initialized');
  assert(game.partySystems.currentEraId === 'era_07_baseline', 'Starts in era_07_baseline');
  assert(game.partySystems.currentEraNumber === 7, 'Starts at Era Number 7');
  assert(game.partySystems.currentEraStartYear === 2028, 'Starts in 2028');
  assert(game.partySystems.activeIssueIds.length === 41, 'Initial activeIssueIds strictly clamped to 41');
  assert(PSData.ERA_CATALOG.length === 26, 'Catalog defines all 26 Historical & Emergent Party Systems');
}

// ------------------------------------------------------------------
// SUITE 2: Strict Eligibility Floors & Per-Cycle Escalating Probability
// ------------------------------------------------------------------
console.log('\n--- SUITE 2: Eligibility Floors & Escalating Transition Roll ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  // Even if a Weight-3 trigger (Independent President) is met before 2040, Era 8 MUST NOT fire before 2040!
  const pre2040Triggered = { ...game, governingParty: 'independent' };
  assert(PSEngine.getEligibilityFloorYear(pre2040Triggered) === 2040, '8th Party System strict eligibility floor is 2040');
  assert(PSEngine.computeTransitionProbability(pre2040Triggered, 2036) === 0, '2036 probability is 0%');
  assert(PSEngine.computeTransitionProbability(pre2040Triggered, 2038) === 0, '2038 probability is 0%');
  const blocked = PSEngine.evaluateEraTransition(pre2040Triggered, 2038, { rollOverride: 0.0 });
  assert(blocked.transitioned === false, '2038 transition strictly blocked even with roll=0.0 and active trigger');

  // Escalating cadence: 2040=10%, 2042=15%, 2044=20%, 2046=25%, 2048=30%, 2050=35%, 2076=100%
  assert(PSEngine.computeTransitionProbability(game, 2040) === 0.10, '2040 transition probability is 10%');
  assert(PSEngine.computeTransitionProbability(game, 2042) === 0.15, '2042 transition probability is 15%');
  assert(PSEngine.computeTransitionProbability(game, 2044) === 0.20, '2044 transition probability is 20%');
  assert(PSEngine.computeTransitionProbability(game, 2046) === 0.25, '2046 transition probability is 25%');
  assert(PSEngine.computeTransitionProbability(game, 2050) === 0.35, '2050 transition probability is 35%');
  assert(PSEngine.computeTransitionProbability(game, 2076) === 1.00, '2076 transition probability reaches 100% guaranteed timeout');

  // Failed roll logs transitionRollHistory without transitioning
  const miss = PSEngine.evaluateEraTransition(game, 2040, { rollOverride: 0.55 });
  assert(miss.transitioned === false, 'Roll 0.55 >= 0.10 in 2040 does not trigger transition');
  assert(miss.game.partySystems.transitionRollHistory[2040]?.probability === 0.10, 'transitionRollHistory records 2040 roll');

  // Successful transition in 2044 sets 9th Party System floor strictly to 2044 + 30 = 2074
  const hit = PSEngine.evaluateEraTransition(game, 2044, { rollOverride: 0.05, forceEraId: 'era_15_ai_boom' });
  assert(hit.transitioned === true, 'Roll 0.05 < 0.20 in 2044 triggers 8th Party System transition');
  assert(hit.game.partySystems.currentEraNumber === 8, 'Era number incremented to 8');
  assert(hit.game.partySystems.currentEraStartYear === 2044, 'Era 8 start year recorded as 2044');
  assert(PSEngine.getEligibilityFloorYear(hit.game) === 2074, '9th Party System strict floor is 2044 + 30 = 2074');
  assert(PSEngine.computeTransitionProbability(hit.game, 2072) === 0, '2072 (28 yrs after 2044) has 0% probability');
  assert(PSEngine.computeTransitionProbability(hit.game, 2074) === 0.10, '2074 (30 yrs after 2044) starts 9th Era roll at 10%');
  assert(PSEngine.computeTransitionProbability(hit.game, 2076) === 0.15, '2076 escalates 9th Era roll to 15%');
}

// ------------------------------------------------------------------
// SUITE 3: Weighted Selection Pool & No-Repeat Invariant
// ------------------------------------------------------------------
console.log('\n--- SUITE 3: Weighted Selection Pool & No-Repeat Invariant ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const baseEligible = PSEngine.getEligiblePartySystems(game, 2040);
  const normalEntry = baseEligible.find((c) => c.era.id === 'era_15_ai_boom');
  assert(normalEntry && normalEntry.weight === 1, 'Group D Normal Era (The AI Boom) carries Weight 1');
  assert(!baseEligible.some((c) => c.era.id === 'era_05_independent_surge'), 'Untriggered Group B era excluded from pool');
  assert(!baseEligible.some((c) => c.era.id === 'era_16_robots_citizens'), 'Group E Follow-Up era excluded without predecessor');

  // Triggered Group B era (Independent President -> Weight 3)
  const indWinGame = { ...game, governingParty: 'independent' };
  const indEligible = PSEngine.getEligiblePartySystems(indWinGame, 2040);
  const indEra = indEligible.find((c) => c.era.id === 'era_05_independent_surge');
  assert(indEra && indEra.weight === 3, 'Triggered Group B Era (Independent Surge) carries Weight 3');

  // Triggered Group B Landslide (>= 20% popular vote margin -> Weight 3)
  const landslideGame = {
    ...game,
    lastElection: { nationalVote: { people: 62, heritage: 36 } },
  };
  const lsEligible = PSEngine.getEligiblePartySystems(landslideGame, 2040);
  const lsEra = lsEligible.find((c) => c.era.id === 'era_04_landslide_realignment');
  assert(lsEra && lsEra.weight === 3, 'Triggered Group B Landslide Era carries Weight 3');

  // Follow-Up Group E era (40 years after AI Boom -> Weight 5) + No-Repeat Invariant
  const aiEraGame = PSEngine.transitionToPartySystem(game, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);
  const followUpEligible = PSEngine.getEligiblePartySystems(aiEraGame, 2080);
  const robotEra = followUpEligible.find((c) => c.era.id === 'era_16_robots_citizens');
  const humanBacklash = followUpEligible.find((c) => c.era.id === 'era_24_human_verified');
  assert(robotEra && robotEra.weight === 5, 'Group E Follow-Up (Robots Become Citizens, 40 yrs after AI Boom) carries Weight 5');
  assert(humanBacklash && humanBacklash.weight === 5, 'Group E Follow-Up (Human-Verified Backlash, 35+ yrs after AI Boom) carries Weight 5');
  assert(!followUpEligible.some((c) => c.era.id === 'era_15_ai_boom'), 'No-Repeat Invariant: experienced era_15_ai_boom permanently excluded');
}

// ------------------------------------------------------------------
// SUITE 4: 41-Issue Swap Pipeline, ±2 Stance Init & Key-Issue Replacement
// ------------------------------------------------------------------
console.log('\n--- SUITE 4: 41-Issue Swap Pipeline, Stance Init & Key-Issue Replacement ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const initialActive = PSEngine.getActiveIssuesForGame(game);
  assert(initialActive.length === 41, 'Baseline live platform has strictly 41 active issues');
  assert(!initialActive.some((i) => i.isEraExclusive), 'Zero unintroduced era-exclusive issues leak into live platform before transition');

  // Seed a faction with a Key Issue that AI Boom explicitly retires ('taxes-spending' / 'Taxes and public spending')
  const testFaction = game.factions.find((f) => f.partyId === 'people');
  testFaction.keyIssues = ['Taxes and public spending', 'Civil Rights'];

  // 7th -> 8th Transition: AI Boom (10 paired swaps)
  const era8Game = PSEngine.transitionToPartySystem(game, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);
  const era8Active = PSEngine.getActiveIssuesForGame(era8Game);
  assert(era8Active.length === 41, `7th->8th transition maintains strict 41-issue clamp (got ${era8Active.length})`);
  assert(era8Game.partySystems.eraExclusiveIssuesActive.length === 10, '10 AI Boom era-exclusive issues introduced');
  assert(era8Game.partySystems.sunsettedIssueIds.length === 10, 'Exact 10 paired baseline issues sunsetted');
  assert(era8Game.partySystems.sunsettedIssueIds.includes('taxes-spending'), 'Paired baseline issue taxes-spending retired');
  assert(era8Game.partySystems.activeIssueIds.includes('era15-ubi-automation'), 'Era-exclusive issue era15-ubi-automation active');
  assert(!era8Active.some((i) => i.id === 'taxes-spending'), 'Sunsetted issue removed from getActiveIssuesForGame()');
  assert(!era8Active.some((i) => i.id === 'era16-robotic-suffrage'), 'Unintroduced Era 16 issues remain isolated');

  // Verify Key-Issue Automatic Replacement
  const updatedFaction = era8Game.factions.find((f) => f.id === testFaction.id);
  assert(!updatedFaction.keyIssues.includes('Taxes and public spending'), 'Retired Key Issue replaced automatically on faction');
  const replacementLabel = updatedFaction.keyIssues[0];
  const replacementObj = era8Active.find((i) => i.label === replacementLabel);
  assert(Boolean(replacementObj), `Replacement Key Issue "${replacementLabel}" exists in active 41-issue platform`);
  assert(replacementObj.category === 'Economy & Affordability', `Replacement Key Issue preserves same category (${replacementObj.category})`);

  // Verify ±2 Stance Initialization (Category Match vs Brand-New Category)
  const econIssues = initialActive.filter((i) => i.category === 'Economy & Affordability');
  const econAvg = econIssues.reduce((s, i) => s + Number(game.issuePositions[i.id] || 5), 0) / econIssues.length;
  const newEconStance = era8Game.issuePositions['era15-ubi-automation'];
  assert(newEconStance >= 1 && newEconStance <= 10, `New issue stance clamped 1..10 (got ${newEconStance})`);
  assert(Math.abs(newEconStance - econAvg) <= 2.5, `Same-category issue initialized within ±2 of category average (${econAvg.toFixed(2)} -> ${newEconStance})`);

  // 9th+ Transition: Robots Become Citizens (10 issues in brand-new category 'Synthetic Personhood')
  // Uses probabilistic random retirement of 10 active issues from the live 41-issue platform
  const era9Game = PSEngine.transitionToPartySystem(era8Game, PSData.ALL_ERAS_BY_ID.era_16_robots_citizens, 2080);
  const era9Active = PSEngine.getActiveIssuesForGame(era9Game);
  assert(era9Active.length === 41, `9th+ transition maintains strict 41-issue clamp (got ${era9Active.length})`);
  assert(era9Game.partySystems.activeIssueIds.includes('era16-robotic-suffrage'), 'Era 9 synthetic issue active');
  const synthStance = era9Game.issuePositions['era16-robotic-suffrage'];
  const overallAvg = era8Active.reduce((s, i) => s + Number(era8Game.issuePositions[i.id] || 5), 0) / era8Active.length;
  assert(synthStance >= 1 && synthStance <= 10 && Math.abs(synthStance - overallAvg) <= 2.5, `Brand-new category issue initialized within ±2 of overall active average (${overallAvg.toFixed(2)} -> ${synthStance})`);
  assert(era9Game.partySystems.priorErasHistory.length === 2, 'priorErasHistory archives both Era 7 and Era 8');
}

// ------------------------------------------------------------------
// SUITE 5: Independent Presidential Candidates Subsystem
// ------------------------------------------------------------------
console.log('\n--- SUITE 5: Independent Presidential Candidates Subsystem ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });

  // Midterm year (2030) NEVER spawns Independent presidential candidate
  const midtermRes = PSEngine.rollIndependentPresidentialCandidate(game, 2030, { triggerRoll: 0.01 });
  assert(midtermRes.spawned === false, 'Midterm cycle (2030) never spawns Independent presidential candidate');

  // Presidential year (2032): 20% probability check
  const missPres = PSEngine.rollIndependentPresidentialCandidate(game, 2032, { triggerRoll: 0.25 });
  assert(missPres.spawned === false, 'Presidential cycle with roll >= 0.20 does not spawn Independent');

  // Verify all 4 polling tiers & 4 archetypes
  const tierChecks = [
    { tierRoll: 15, expectedTier: 'fringe_outsider', min: 0, max: 5, arch: 0 },
    { tierRoll: 65, expectedTier: 'notable_contender', min: 5, max: 10, arch: 1 },
    { tierRoll: 88, expectedTier: 'serious_third_force', min: 10, max: 25, arch: 2 },
    { tierRoll: 98, expectedTier: 'historic_titan', min: 25, max: 40, arch: 3 },
  ];
  tierChecks.forEach((tc) => {
    const res = PSEngine.rollIndependentPresidentialCandidate(game, 2032, {
      triggerRoll: 0.05,
      tierRoll: tc.tierRoll,
      withinTierRoll: 0.5,
      archetypeIndex: tc.arch,
    });
    assert(res.spawned && res.candidate.pollingTier === tc.expectedTier, `Tier roll ${tc.tierRoll} spawns ${tc.expectedTier}`);
    assert(res.candidate.openingPoll >= tc.min && res.candidate.openingPoll <= tc.max, `Opening poll (${res.candidate.openingPoll}%) inside [${tc.min}%, ${tc.max}%]`);
    assert(res.candidate.fame >= 65 && res.candidate.fame <= 95, `Fame (${res.candidate.fame}) inside [65, 95]`);
    if (tc.arch === 2) {
      assert(res.candidate.wealth >= 100, `Self-Funded Reformer carries $100M+ warchest ($${res.candidate.wealth}M)`);
    }
  });

  // Dual-Party Siphoning & EV / Contingent Election / White House Governance
  const titanRes = PSEngine.rollIndependentPresidentialCandidate(game, 2032, {
    triggerRoll: 0.01,
    tierRoll: 99,
    withinTierRoll: 0.9,
    archetypeIndex: 3, // Maverick Official
  });
  const titanGame = titanRes.game;
  const paState = ChairData.STATES.find((s) => s.id === 'PA');
  const siph = PSEngine.computeIndependentDualSiphoning(titanGame, paState);
  assert(siph.indSupport > 25 && siph.demSiphon > 0 && siph.repSiphon > 0, `Dual-party siphoning active in PA (Ind=${siph.indSupport}%, Dem-${siph.demSiphon}%, Rep-${siph.repSiphon}%)`);

  const supWithInd = Engine.supportByState(titanGame, paState);
  assert(supWithInd.independent > 15, `supportByState reflects Independent share (${supWithInd.independent.toFixed(1)}%)`);

  // Boost Titan to win states directly & verify EV accounting + Contingent Election detection
  titanGame.partySystems.independentPresidency.activeCampaign.openingPoll = 42.0;
  const pf = Engine.presidentialForecast(titanGame);
  assert((pf.evByParty?.independent || 0) > 0, `Independent presidential candidate wins direct Electoral Votes (${pf.evByParty.independent} EV)`);

  // Independent White House governance neutralizes major-party incumbency rebound
  const indWHGame = { ...game, governingParty: 'independent', incumbentTermNumber: 1 };
  const macro = Engine.computeMacroEnvironmentForCycle(indWHGame, 2036);
  assert(Math.abs(macro.nextEnv) <= 2.0 && macro.reason.includes('Independent White House'), `Independent White House neutralizes major-party incumbency bonus (${macro.reason})`);
}

// ------------------------------------------------------------------
// SUITE 6: Era UI Shell & Qualitative Atmospheric Vibes Scanner
// ------------------------------------------------------------------
console.log('\n--- SUITE 6: Era UI Shell & Qualitative Atmospheric Vibes Compliance ---');
{
  const game = Engine.createGame({ baseTemplateId: 'people' });
  const era8Game = PSEngine.transitionToPartySystem(game, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);

  const badgeHtml = PSUI.renderTopBarEraBadge(era8Game);
  const modalHtml = PSUI.renderRealignmentModal(era8Game);
  const dossierHtml = PSUI.renderEraDossierModal(era8Game);
  const timelineHtml = PSUI.renderHistoricalEraTimeline(era8Game);

  assert(badgeHtml.includes('VIII:') && badgeHtml.includes('The AI Boom'), 'Top-Bar Era Badge renders "VIII: The AI Boom"');
  assert(modalHtml.includes('Dawn of the 8th Party System') && modalHtml.includes('Enter the New Political Era'), 'Fullscreen Realignment Modal renders header and dismissal button');
  assert(modalHtml.includes('era-issue-sunset') && modalHtml.includes('UBI Automation Dividend'), 'Realignment Modal renders emergent and sunsetted issue ledger');
  assert(dossierHtml.includes('Dominant Ideological Fault Lines'), 'Qualitative Era Dossier renders atmospheric fault lines');
  assert(timelineHtml.includes('Historical Party Systems Timeline') && timelineHtml.includes('Polarized Duopoly'), 'History Tab Timeline renders completed and active eras');

  // Strict Atmospheric Vibes Scanner (GAME_STYLE_GUIDE.md Rule 4 & Rule 7)
  const combinedUi = `${badgeHtml}\n${modalHtml}\n${dossierHtml}\n${timelineHtml}`;
  const forbiddenPatterns = [/\bREQ-\d+/i, /\bMAS-\d+/i, /Weight\s*=/i, /Probability:/i, /baseWeight/i, /rollOverride/i];
  forbiddenPatterns.forEach((rx) => {
    assert(!rx.test(combinedUi), `UI copy free of forbidden meta/math pattern: ${rx}`);
  });

  // Dismiss Realignment Modal via engine action
  const dismissed = Engine.takeAction(era8Game, 'dismiss-realignment-modal');
  assert(dismissed.partySystems.pendingModal === null && PSUI.renderRealignmentModal(dismissed) === '', 'dismiss-realignment-modal clears pending modal cleanly');
}

// ------------------------------------------------------------------
// SUITE 7: Save Migration (v15.8 / v15.9) & Mid-Modal Reload Persistence
// ------------------------------------------------------------------
console.log('\n--- SUITE 7: Save Migration & Mid-Modal Persistence ---');
{
  const legacyV158 = Engine.createGame({ baseTemplateId: 'liberty' });
  legacyV158.version = '0.15.8';
  delete legacyV158.partySystems;
  const migrated158 = Engine.normalizeGame(legacyV158);
  assert(migrated158.partySystems?.currentEraId === 'era_07_baseline', 'Legacy v15.8 save migrates to baseline 7th Party System');
  assert(migrated158.partySystems?.currentEraStartYear === 2028, 'Migrated save sets currentEraStartYear = 2028');
  assert(migrated158.partySystems?.activeIssueIds?.length === 41, 'Migrated save enforces exact 41 active issues');

  // Mid-modal save/reload guardrail
  const era8MidModal = PSEngine.transitionToPartySystem(migrated158, PSData.ALL_ERAS_BY_ID.era_11_generational_succession, 2042);
  mockLocalStorage.clear();
  Engine.saveGame(era8MidModal);
  const reloaded = Engine.loadGame();
  assert(reloaded.partySystems.pendingModal === 'realignment', 'Reloaded save preserves pendingModal: "realignment" mid-modal state');
  assert(reloaded.partySystems.modalPayload?.eraId === 'era_11_generational_succession', 'Reloaded save restores complete modalPayload');
  assert(reloaded.partySystems.activeIssueIds.length === 41, 'Reloaded save retains strictly 41 active issues');
}

console.log('\n================================================================');
console.log(` ALL MAS-01 PHASE 1 TESTS PASSED: ${passed}/${total} (100%)`);
console.log('================================================================\n');
