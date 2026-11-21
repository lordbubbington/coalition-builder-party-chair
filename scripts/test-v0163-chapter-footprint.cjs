/**
 * Verification Test Suite for REQ-264 & REQ-265 (Version 0.16.3)
 * Target: scripts/test-v0163-chapter-footprint.cjs
 *
 * Covers:
 * - Section 22 (REQ-264): Third-party state chapter footprint rebalance:
 *   Dictionary fidelity against STARTING_3RD_PARTY_CHAPTERS.
 *   Zero-footprint validation for unlisted states.
 *   Regional invariants (Greens in West/Pacific + NE; Socialists in NE + Midwest; Constitution in South).
 * - Section 23 (REQ-265): Custom party zero-infrastructure starting rule:
 *   All 50 states start with exactly 0 chapters and 0 strength.
 *   stateChapters map is all 0s.
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

const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

const mockAppElement = {
  innerHTML: '',
  classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
  insertAdjacentHTML: () => {},
  addEventListener: () => {},
};

const mockDocument = {
  querySelectorAll: () => [],
  querySelector: () => mockAppElement,
  getElementById: () => mockAppElement,
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
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const Data = sandbox.window.PartyChairData;
const dict = Engine.STARTING_3RD_PARTY_CHAPTERS || Data.STARTING_3RD_PARTY_CHAPTERS;

console.log('====================================================================');
console.log(' TEST SUITE: REQ-264 & REQ-265 State Chapter Footprints');
console.log('====================================================================\n');

// Initialize standard 2028 game
const gameStd = Engine.createGame({ baseTemplateId: 'people' });
const orgs = gameStd.stateOrganizations;
assert(Boolean(orgs), 'game.stateOrganizations exists');

// Test 1: Dictionary Fidelity for all 4 Established Third Parties
console.log('Test 1: Dictionary fidelity across all 50 states');
const allStates = (Data.STATES || []).filter((s) => s.id !== 'DC');

['liberty', 'green', 'socialist', 'constitution'].forEach((partyId) => {
  const partyDict = dict[partyId] || {};
  let totalChapters = 0;

  allStates.forEach((s) => {
    const expected = partyDict[s.id] || 0;
    const actual = orgs[s.id]?.[partyId]?.chapters ?? 0;
    assert(actual === expected, `${partyId.toUpperCase()} in ${s.id}: ${actual} chapters (expected ${expected})`);
    totalChapters += actual;
  });

  if (partyId === 'green') {
    assert(totalChapters === 40, `Green party total chapters is exactly 40: ${totalChapters}`);
  } else if (partyId === 'socialist') {
    assert(totalChapters === 15, `Socialist party total chapters is exactly 15: ${totalChapters}`);
  } else if (partyId === 'constitution') {
    assert(totalChapters === 15, `Constitution party total chapters is exactly 15: ${totalChapters}`);
  } else if (partyId === 'liberty') {
    assert(totalChapters === 82, `Liberty party total chapters matches dictionary sum of 82: ${totalChapters}`);
  }
});

// Test 2: Zero Footprint for Unlisted States
console.log('\nTest 2: Zero footprint outside registered states');
// Constitution in non-South (e.g. VT, CA, NY, MN)
['VT', 'CA', 'NY', 'MN', 'WA', 'MA', 'HI', 'IL'].forEach((st) => {
  assert(orgs[st]?.constitution?.chapters === 0, `Constitution party has 0 chapters in ${st}`);
});

// Socialists in non-NE/non-Midwest (e.g. TX, FL, AL, UT, ID)
['TX', 'FL', 'AL', 'UT', 'ID', 'WY', 'AZ', 'GA'].forEach((st) => {
  assert(orgs[st]?.socialist?.chapters === 0, `Socialist party has 0 chapters in ${st}`);
});

// Test 3: Regional Invariants
console.log('\nTest 3: Regional invariants');
// Greens: 36 West/Pacific + 4 Northeast
const greenWestStates = ['CA', 'OR', 'WA', 'CO', 'HI', 'AK', 'NM', 'NV', 'AZ'];
const greenNEStates = ['VT', 'MA', 'NY'];
let greenWestSum = 0;
let greenNESum = 0;
greenWestStates.forEach((st) => { greenWestSum += orgs[st]?.green?.chapters || 0; });
greenNEStates.forEach((st) => { greenNESum += orgs[st]?.green?.chapters || 0; });

assert(greenWestSum === 36, `Greens West/Pacific sum = 36: ${greenWestSum}`);
assert(greenNESum === 4, `Greens Northeast sum = 4: ${greenNESum}`);

// Socialists: 9 Northeast + 6 Midwest, 0 elsewhere
const socNEStates = ['VT', 'NY', 'MA', 'PA', 'ME'];
const socMWStates = ['IL', 'MI', 'WI', 'MN'];
let socNESum = 0;
let socMWSum = 0;
socNEStates.forEach((st) => { socNESum += orgs[st]?.socialist?.chapters || 0; });
socMWStates.forEach((st) => { socMWSum += orgs[st]?.socialist?.chapters || 0; });

assert(socNESum === 9, `Socialist Northeast sum = 9: ${socNESum}`);
assert(socMWSum === 6, `Socialist Midwest sum = 6: ${socMWSum}`);

// Test 4: Custom Party Zero-Infrastructure Starting Rule (REQ-265)
console.log('\nTest 4: Custom Party Zero-Infrastructure Starting Rule (REQ-265)');
const gameCustom = Engine.createGame({
  baseTemplateId: 'custom',
  customName: 'Clean Slate Party',
  customOrigin: 'civic_reform',
  customValues: {
    origin: 'civic_reform',
  },
});

const customOrgs = gameCustom.stateOrganizations;
let totalCustomChapters = 0;
let totalCustomStrength = 0;

allStates.forEach((s) => {
  const playerOrg = customOrgs[s.id]?.player;
  assert(playerOrg?.chapters === 0, `Custom party has 0 chapters in ${s.id}: ${playerOrg?.chapters}`);
  assert(playerOrg?.strength === 0, `Custom party has 0 strength in ${s.id}: ${playerOrg?.strength}`);
  totalCustomChapters += (playerOrg?.chapters || 0);
  totalCustomStrength += (playerOrg?.strength || 0);
});

assert(totalCustomChapters === 0, `Total custom party starting chapters across all states is 0: ${totalCustomChapters}`);
assert(totalCustomStrength === 0, `Total custom party starting strength across all states is 0: ${totalCustomStrength}`);

// Also check game.stateChapters map
const customStateChapters = gameCustom.stateChapters || {};
let stateChaptersSum = 0;
allStates.forEach((s) => {
  const ch = customStateChapters[s.id] || 0;
  stateChaptersSum += ch;
});
assert(stateChaptersSum === 0, `game.stateChapters sum across all 50 states is 0: ${stateChaptersSum}`);

console.log(`\n====================================================================`);
console.log(` REQ-264 & REQ-265 RESULTS: ${passedTests} / ${totalTests} assertions passed.`);
console.log(`====================================================================\n`);
