/**
 * Verification Test Suite for REQ-250 (Version 0.16.3)
 * Target: scripts/test-v0163-redraw-pool.cjs
 *
 * Covers Section 8 of VERSION_0.16.3_DESIGN.md:
 * - Unpurchasable case repaired: Redraw when actionsLeft < cost but organizingActionsRemaining >= cost
 * - Dual deduction: both organizingActionsRemaining and actionsLeft reduce by exactly cost
 * - Ceiling: redrawCount >= 3 -> cost stays capped at 4 (Math.min(4, redrawCount + 1))
 * - Doctrine: minor parties receive NO subsidies and NO free redraws; zero/negative pool rejected
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
console.log(' TEST SUITE: REQ-250 Draft-of-7 Redraw Pool Check & Hard Ceiling Cap');
console.log('====================================================================');

// --- Test 1: Ceiling at 4 Actions (Math.min(4, redrawCount + 1)) ---
console.log('\n--- Test 1: Redraw Cost Progression & Ceiling at 4 Actions ---');
let baseGame = Engine.createGame({ baseTemplateId: 'people' });
baseGame.phase = 'organizing';
baseGame.organizingActionsRemaining = 20;
baseGame.actionsLeft = 20;
baseGame.priorities = {
  redrawCount: 0,
  offeredQuestIds: ['cross-5pct-funding', 'shatter-15pct-debate', 'turnout-engine', 'build-up-the-bench', 'secure-50-state-ballot', 'carve-regional-bastion', 'break-the-duopoly-reform'],
  main: [],
  handLocked: false,
};

// Redraw 1: redrawCount = 0 -> Cost: 1
let after1 = Engine.takeAction(baseGame, 'redraw-priorities-hand');
assert(after1.priorities.redrawCount === 1, 'Redraw 1 increments redrawCount to 1');
assert(after1.organizingActionsRemaining === 19, 'Redraw 1 deducts 1 from organizingActionsRemaining (20 -> 19)');
assert(after1.actionsLeft === 19, 'Redraw 1 deducts 1 from actionsLeft (20 -> 19)');

// Redraw 2: redrawCount = 1 -> Cost: 2
let after2 = Engine.takeAction(after1, 'redraw-priorities-hand');
assert(after2.priorities.redrawCount === 2, 'Redraw 2 increments redrawCount to 2');
assert(after2.organizingActionsRemaining === 17, 'Redraw 2 deducts 2 from organizingActionsRemaining (19 -> 17)');
assert(after2.actionsLeft === 17, 'Redraw 2 deducts 2 from actionsLeft (19 -> 17)');

// Redraw 3: redrawCount = 2 -> Cost: 3
let after3 = Engine.takeAction(after2, 'redraw-priorities-hand');
assert(after3.priorities.redrawCount === 3, 'Redraw 3 increments redrawCount to 3');
assert(after3.organizingActionsRemaining === 14, 'Redraw 3 deducts 3 from organizingActionsRemaining (17 -> 14)');
assert(after3.actionsLeft === 14, 'Redraw 3 deducts 3 from actionsLeft (17 -> 14)');

// Redraw 4: redrawCount = 3 -> Cost: 4 (Math.min(4, 3 + 1) = 4)
let after4 = Engine.takeAction(after3, 'redraw-priorities-hand');
assert(after4.priorities.redrawCount === 4, 'Redraw 4 increments redrawCount to 4');
assert(after4.organizingActionsRemaining === 10, 'Redraw 4 deducts 4 from organizingActionsRemaining (14 -> 10)');
assert(after4.actionsLeft === 10, 'Redraw 4 deducts 4 from actionsLeft (14 -> 10)');

// Redraw 5: redrawCount = 4 -> Cost: 4 (CAPPED at 4, not 5!)
let after5 = Engine.takeAction(after4, 'redraw-priorities-hand');
assert(after5.priorities.redrawCount === 5, 'Redraw 5 increments redrawCount to 5');
assert(after5.organizingActionsRemaining === 6, 'Redraw 5 deducts 4 from organizingActionsRemaining (10 -> 6, capped cost)');
assert(after5.actionsLeft === 6, 'Redraw 5 deducts 4 from actionsLeft (10 -> 6, capped cost)');

// Redraw 6: redrawCount = 5 -> Cost: 4 (Still CAPPED at 4!)
let after6 = Engine.takeAction(after5, 'redraw-priorities-hand');
assert(after6.priorities.redrawCount === 6, 'Redraw 6 increments redrawCount to 6');
assert(after6.organizingActionsRemaining === 2, 'Redraw 6 deducts 4 from organizingActionsRemaining (6 -> 2)');
assert(after6.actionsLeft === 2, 'Redraw 6 deducts 4 from actionsLeft (6 -> 2)');


// --- Test 2: Unpurchasable Case Repaired (actionsLeft < cost, but pool >= cost) ---
console.log('\n--- Test 2: Unpurchasable Case Repaired ---');
// In organizing phase, actionsLeft might be at 2 (e.g. after taking 2 turn actions),
// but organizingActionsRemaining is 12.
let midTurnGame = {
  ...baseGame,
  organizingActionsRemaining: 12,
  actionsLeft: 2,
  priorities: {
    redrawCount: 3, // cost is 4
    offeredQuestIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
    main: [],
    handLocked: false,
  },
};

// Under old code, actionsLeft (2) < cost (4) caused the redraw to fail silently.
// Under REQ-250, availablePool is 12 >= 4, so purchase succeeds!
let repairedResult = Engine.takeAction(midTurnGame, 'redraw-priorities-hand');
assert(repairedResult.priorities.redrawCount === 4, 'Redraw succeeds when pool >= cost even if actionsLeft < cost');
assert(repairedResult.organizingActionsRemaining === 8, 'Dual deduction: organizingActionsRemaining reduced by exactly 4 (12 -> 8)');
assert(repairedResult.actionsLeft === -2, 'Dual deduction: actionsLeft reduced by exactly 4 (2 -> -2)');


// --- Test 3: Insufficient Pool Rejection ---
console.log('\n--- Test 3: Insufficient Pool Rejection ---');
let emptyPoolGame = {
  ...baseGame,
  organizingActionsRemaining: 2,
  actionsLeft: 2,
  priorities: {
    redrawCount: 3, // cost is 4
    offeredQuestIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
    main: [],
    handLocked: false,
  },
};

let rejectedResult = Engine.takeAction(emptyPoolGame, 'redraw-priorities-hand');
assert(rejectedResult.priorities.redrawCount === 3, 'Redraw rejected when pool (2) < cost (4)');
assert(rejectedResult.organizingActionsRemaining === 2, 'organizingActionsRemaining unchanged on rejection');
assert(rejectedResult.actionsLeft === 2, 'actionsLeft unchanged on rejection');

// Zero / negative pool
let zeroPoolGame = {
  ...baseGame,
  organizingActionsRemaining: 0,
  actionsLeft: 0,
  priorities: {
    redrawCount: 0, // cost is 1
    offeredQuestIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
    main: [],
    handLocked: false,
  },
};

let zeroRejected = Engine.takeAction(zeroPoolGame, 'redraw-priorities-hand');
assert(zeroRejected.priorities.redrawCount === 0, 'Redraw rejected when pool is 0');


// --- Test 4: Design Doctrine: No Minor Party Subsidies or Free Redraws ---
console.log('\n--- Test 4: Minor Party Doctrine Check ---');
let minorGame = Engine.createGame({ baseTemplateId: 'liberty' }); // Libertarian Party
minorGame.phase = 'organizing';
minorGame.organizingActionsRemaining = 20;
minorGame.actionsLeft = 20;
minorGame.priorities = {
  redrawCount: 0,
  offeredQuestIds: ['cross-5pct-funding', 'shatter-15pct-debate', 'turnout-engine', 'build-up-the-bench', 'secure-50-state-ballot', 'carve-regional-bastion', 'break-the-duopoly-reform'],
  main: [],
  handLocked: false,
};

// First redraw for minor party must cost full 1 action, NO free redraws
let minorAfter1 = Engine.takeAction(minorGame, 'redraw-priorities-hand');
assert(minorAfter1.priorities.redrawCount === 1, 'Minor party redrawCount incremented to 1');
assert(minorAfter1.organizingActionsRemaining === 19, 'Minor party charged full 1 action on redraw 1 (no free subsidy)');
assert(minorAfter1.actionsLeft === 19, 'Minor party actionsLeft reduced by 1');

// Second redraw for minor party must cost full 2 actions
let minorAfter2 = Engine.takeAction(minorAfter1, 'redraw-priorities-hand');
assert(minorAfter2.priorities.redrawCount === 2, 'Minor party redrawCount incremented to 2');
assert(minorAfter2.organizingActionsRemaining === 17, 'Minor party charged full 2 actions on redraw 2 (no discount)');
assert(minorAfter2.actionsLeft === 17, 'Minor party actionsLeft reduced by 2');

console.log('\n====================================================================');
console.log(` ALL REQ-250 TESTS PASSED: ${passedTests}/${totalTests} (100%)`);
console.log('====================================================================\n');
