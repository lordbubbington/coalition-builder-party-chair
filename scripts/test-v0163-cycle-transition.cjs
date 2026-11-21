/**
 * Verification Test Suite for REQ-247 (Version 0.16.3)
 * Target: scripts/test-v0163-cycle-transition.cjs
 *
 * Covers Section 5 of VERSION_0.16.3_DESIGN.md:
 * - Mutator conversion: checkFounderSuccessionTrigger called in-place, never assigning to refreshed
 * - const-to-let at line 10405
 * - processOrphanedFactionRehoming returns clean updated game state
 * - Full 2028 -> 2030 -> 2032 -> 2034 -> 2036 custom party cycle chain without crash or state corruption
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

console.log('====================================================================');
console.log(' TEST SUITE: REQ-247 Custom Party Cycle Transition & Succession Fix');
console.log('====================================================================');

// --- Test 1: Static Source Code Invariant Checks ---
console.log('\n--- Test 1: Static Source Code Invariant Checks ---');
const engineSource = fs.readFileSync(path.resolve(__dirname, '..', 'engine.js'), 'utf8');

// Check line 10405 declaration
assert(
  !engineSource.includes('const refreshed = {'),
  'refreshed is NOT declared with const at cycle transition'
);
assert(
  engineSource.includes('let refreshed = {'),
  'refreshed is declared with let in startNextCycle'
);

// Check checkFounderSuccessionTrigger invocation site
assert(
  !engineSource.includes('refreshed = checkFounderSuccessionTrigger(refreshed)'),
  'No assignment site remains overwriting refreshed with checkFounderSuccessionTrigger boolean'
);
assert(
  engineSource.includes('checkFounderSuccessionTrigger(refreshed);'),
  'checkFounderSuccessionTrigger is called in-place as a mutator'
);

// --- Test 2: processOrphanedFactionRehoming Returns Clean Game State ---
console.log('\n--- Test 2: processOrphanedFactionRehoming Returns Clean State ---');
const mockRehomingGame = {
  year: 2028,
  player: { id: 'player', custom: true, baseShare: 6.5 },
  rivals: [
    { id: 'heritage', name: 'Republican' },
  ],
  dissolvedParties: ['liberty'],
  trust: { supporters: 60 },
  factions: [
    {
      id: 'breakaway_faction_1',
      name: 'Breakaway Libertarians',
      seekingPartyHome: true,
      partyId: 'independent',
      sliders: { economic: 8.5, social: 7.5 },
      selloutGrudge: { active: true, cyclesRemaining: 2, snipesFired: 0 },
    },
    {
      id: 'gop_conservative',
      name: 'Traditional Conservatives',
      partyId: 'heritage',
      sliders: { economic: 8.0, social: 7.0 },
    },
  ],
  sittingMembers: [],
  voterModel: { states: [] },
};

const rehomed = Engine.processOrphanedFactionRehoming(mockRehomingGame);
assert(rehomed !== null && typeof rehomed === 'object', 'processOrphanedFactionRehoming returns an object');
assert(typeof rehomed.year === 'number', 'Returned state retains year property');
assert(rehomed.player && rehomed.player.custom === true, 'Returned state retains player custom party');
assert(Array.isArray(rehomed.factions), 'Returned state retains factions array');
const f1 = rehomed.factions.find((f) => f.id === 'breakaway_faction_1');
assert(f1 && f1.selloutGrudge.snipesFired === 1, 'Snipe fired counter incremented');
assert(f1.selloutGrudge.cyclesRemaining === 1, 'cyclesRemaining decremented cleanly');

// --- Test 3: Full Custom Party 2028 -> 2030 -> 2032 -> 2034 -> 2036 Cycle Chain ---
console.log('\n--- Test 3: Multi-Cycle Chain (2028 -> 2030 -> 2032 -> 2034 -> 2036) ---');

// Create a custom party game in 2028
let customGame = Engine.createGame({
  baseTemplateId: 'custom',
  customPartyName: 'Civic Renewal Party',
  customPartyCode: 'CRP',
  customPartyEmblem: 'compass',
  customPartyMotto: 'Progress Through Reason',
  foundingStateId: 'PA',
  originId: 'grassroots',
  charterTraits: ['decentralized-grassroots'],
  initialFactionIds: ['dem_progressive', 'dem_working_class'],
  custom100kVoters: {
    PA: 60000,
    OH: 40000,
  },
});

assert(customGame.player?.custom === true, 'Custom party initialized');
assert(customGame.year === 2028, 'Initial year is 2028');
assert(customGame.founderLegacy && customGame.founderLegacy.active === true, 'Founder legacy is active');
assert(customGame.founderLegacy.movementAuraCyclesRemaining === 3, 'Founder aura has 3 cycles remaining in 2028');

// Transition 2028 -> 2030 (Cycle 1 -> Cycle 2)
console.log('Advancing 2028 -> 2030...');
customGame.phase = 'complete';
let game2030 = Engine.startNextCycle(customGame);
assert(typeof game2030 === 'object' && game2030 !== null, 'game2030 is a valid object (no boolean overwrite)');
assert(game2030.year === 2030, 'Cycle 2 year is 2030');
assert(game2030.player?.custom === true, 'Player remains custom party in 2030');
assert(game2030.founderLegacy.movementAuraCyclesRemaining === 2, 'Founder aura decremented to 2 cycles remaining');
assert(!game2030.founderLegacy.successionTriggered, 'Succession not yet triggered in 2030');
assert(Array.isArray(game2030.priorities?.offeredQuestIds), 'New priorities hand offered in 2030');

// Transition 2030 -> 2032 (Cycle 2 -> Cycle 3)
console.log('Advancing 2030 -> 2032...');
game2030.phase = 'complete';
let game2032 = Engine.startNextCycle(game2030);
assert(typeof game2032 === 'object' && game2032 !== null, 'game2032 is a valid object');
assert(game2032.year === 2032, 'Cycle 3 year is 2032');
assert(game2032.player?.custom === true, 'Player remains custom party in 2032');
assert(game2032.founderLegacy.movementAuraCyclesRemaining === 1, 'Founder aura decremented to 1 cycle remaining');
assert(!game2032.founderLegacy.successionTriggered, 'Succession not yet triggered in 2032');

// Transition 2032 -> 2034 (Cycle 3 -> Cycle 4: Movement Aura Expires)
console.log('Advancing 2032 -> 2034...');
game2032.phase = 'complete';
let game2034 = Engine.startNextCycle(game2032);
assert(typeof game2034 === 'object' && game2034 !== null, 'game2034 is a valid object');
assert(game2034.year === 2034, 'Cycle 4 year is 2034');
assert(game2034.player?.custom === true, 'Player remains custom party in 2034');
assert(game2034.founderLegacy.movementAuraCyclesRemaining === 0, 'Founder aura reached 0 cycles remaining');
assert(game2034.founderLegacy.successionTriggered === true, 'Succession crisis triggered upon aura expiration');
assert(game2034.founderLegacy.successionTriggerReason === 'aura_expired', 'Trigger reason is aura_expired');

// Resolve succession crisis
let postSuccession = Engine.takeAction(game2034, 'resolve-succession-crisis', {
  path: 'institutionalize',
});
assert(postSuccession.founderLegacy.successionResolved === true, 'Succession crisis resolved');
assert(postSuccession.founderLegacy.postSuccessionCyclePending === true, 'postSuccessionCyclePending armed');

// Transition 2034 -> 2036 (Post-Succession Cycle)
console.log('Advancing 2034 -> 2036...');
postSuccession.phase = 'complete';
let game2036 = Engine.startNextCycle(postSuccession);
assert(typeof game2036 === 'object' && game2036 !== null, 'game2036 is a valid object');
assert(game2036.year === 2036, 'Cycle 5 year is 2036');
assert(game2036.player?.custom === true, 'Player remains custom party in 2036');
assert(game2036.priorities?.offeredQuestIds?.length === 7, 'Fresh hand of 7 priorities dealt in 2036');

console.log('\n====================================================================');
console.log(` ALL REQ-247 TESTS PASSED: ${passedTests}/${totalTests} (100%)`);
console.log('====================================================================\n');
