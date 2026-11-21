/**
 * Verification Test Suite for REQ-252 (Version 0.16.3)
 * Target: scripts/test-v0163-standout-id.cjs
 *
 * Covers Section 10 of VERSION_0.16.3_DESIGN.md:
 * - Statehouse standout persistent ID retained in encourageStateRecruit (recruit.id === standout.id)
 * - Career milestone continuity ("Served in State Legislature" appended exactly once, no duplicates)
 * - Terms served carried forward cleanly
 * - No duplicate or orphaned records remain in stateLegStandouts with old ID
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
console.log(' TEST SUITE: REQ-252 Statehouse Standout Persistent ID & Milestones');
console.log('====================================================================');

// Setup base game in organizing phase
let game = Engine.createGame({ baseTemplateId: 'people' });
game.phase = 'organizing';
game.actionsLeft = 4;
game.treasury = 25.0;

const testStandoutId = 'stateLeg_PA_people_2028_42';
const mockStandout = {
  id: testStandoutId,
  name: 'Morgan Brooks',
  state: 'PA',
  stateId: 'PA',
  stateName: 'Pennsylvania',
  office: 'stateLeg',
  quality: 7,
  fame: 45,
  careerMilestones: ['Elected to State Legislature (PA)'],
  termsServed: { house: 0, senate: 0, governor: 0, stateLeg: 2 },
  stateLegTermsServed: 2,
  factionId: 'dem_progressive',
  party: 'people',
  ratings: { charisma: 7, fundraising: 6 },
};

game.stateLegStandouts = {
  people: [mockStandout],
};

const targetRaceId = 'house:PA-1';

// Call encourage-state-recruit via takeAction
console.log('\n--- Promoting statehouse standout via encourage-state-recruit action ---');
const updatedGame = Engine.takeAction(game, 'encourage-state-recruit', {
  raceId: targetRaceId,
  partyId: 'people',
});

// 1. Assert ID Equality Before/After
const primaryField = updatedGame.primaryFields?.[targetRaceId]?.['people'] || [];
const recruitedCandidate = primaryField.find((c) => c.name === 'Morgan Brooks');
assert(recruitedCandidate !== undefined, 'Recruited standout found in primary field');
assert(
  recruitedCandidate.id === testStandoutId,
  `Persistent ID preserved: recruit.id === standout.id (${recruitedCandidate.id} === ${testStandoutId})`
);

// 2. Assert Recruited Candidate in recruitedCandidates has same persistent ID
const recordedRecruit = (updatedGame.recruitedCandidates || []).find((c) => c.name === 'Morgan Brooks');
assert(recordedRecruit !== undefined, 'Recruit recorded in game.recruitedCandidates');
assert(
  recordedRecruit.id === testStandoutId,
  `Persistent ID preserved in recruitedCandidates array (${recordedRecruit.id} === ${testStandoutId})`
);

// 3. Assert Milestones Carried Forward Cleanly with "Served in State Legislature" Appended Exactly Once
assert(
  Array.isArray(recruitedCandidate.careerMilestones),
  'Candidate has careerMilestones array'
);
assert(
  recruitedCandidate.careerMilestones.includes('Elected to State Legislature (PA)'),
  'Prior milestone "Elected to State Legislature (PA)" carried forward'
);
assert(
  recruitedCandidate.careerMilestones.includes('Served in State Legislature'),
  'Appended milestone "Served in State Legislature" present'
);
const serviceOccurrences = recruitedCandidate.careerMilestones.filter((m) => m === 'Served in State Legislature').length;
assert(
  serviceOccurrences === 1,
  `Milestone "Served in State Legislature" appears exactly once (got ${serviceOccurrences})`
);

// 4. Assert Prior Terms Served Carried Forward
assert(
  recruitedCandidate.termsServed && recruitedCandidate.termsServed.stateLeg === 2,
  'Prior terms served carried forward (stateLeg: 2)'
);
assert(
  recruitedCandidate.stateLegTermsServed === 2,
  'stateLegTermsServed carried forward (2)'
);

// 5. Assert No Orphaned or Duplicate Records Remain with Old ID in Standouts Roster
const remainingStandouts = updatedGame.stateLegStandouts?.['people'] || [];
const duplicateInStandouts = remainingStandouts.some((s) => s.id === testStandoutId);
assert(
  !duplicateInStandouts,
  'Standout removed from stateLegStandouts; no orphaned duplicate with old ID remains'
);
assert(
  remainingStandouts.length === 0,
  'Standouts roster length for party reduced cleanly to 0'
);

// 6. Assert $0 Fee Was Charged for Sitting State Lawmaker
assert(
  updatedGame.treasury === 25.0,
  `Sitting state lawmaker promoted for $0 fee (treasury remained 25.0, got ${updatedGame.treasury})`
);

// 7. Verify Idempotence of Milestone Appending (No Duplicate on Double Promotion Path)
const mockStandoutAlreadyServed = {
  id: 'stateLeg_OH_people_2028_99',
  name: 'Taylor Mercer',
  state: 'OH',
  stateId: 'OH',
  office: 'stateLeg',
  careerMilestones: ['Elected to State Legislature (OH)', 'Served in State Legislature'],
  termsServed: { house: 0, senate: 0, governor: 0, stateLeg: 1 },
};
let doubleGame = {
  ...game,
  stateLegStandouts: { people: [mockStandoutAlreadyServed] },
};
const doubleResult = Engine.takeAction(doubleGame, 'encourage-state-recruit', {
  raceId: 'house:OH-1',
  partyId: 'people',
});
const doubleCandidate = (doubleResult.primaryFields?.['house:OH-1']?.['people'] || []).find((c) => c.id === 'stateLeg_OH_people_2028_99');
assert(doubleCandidate !== undefined, 'Candidate promoted in double test');
const doubleMilestoneOccurrences = doubleCandidate.careerMilestones.filter((m) => m === 'Served in State Legislature').length;
assert(
  doubleMilestoneOccurrences === 1,
  `Pre-existing "Served in State Legislature" is NOT duplicated (got ${doubleMilestoneOccurrences})`
);

console.log('\n====================================================================');
console.log(` ALL REQ-252 TESTS PASSED: ${passedTests}/${totalTests} (100%)`);
console.log('====================================================================\n');
