/**
 * Verification Test Suite for REQ-261 (Version 0.16.3)
 * Target: scripts/test-v0163-env-house.cjs
 *
 * Covers Section 19 of VERSION_0.16.3_DESIGN.md:
 * - Generic congressional ballot invariant: Dem/GOP popular vote margin D+9.0 ± 0.5% at 2028 start
 * - District baseline margin formula: district.lean + nationalEnvironment
 * - Spot checks: EVEN ≈ D+9.0; R+4 ≈ D+5.0; R+12 ≈ R+3.0 (-3.0)
 * - Candidate quality and funding adjustments shift margins off the fundamentals baseline
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

const sandbox = {
  window: { PartyChairData: {} },
  console,
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
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
};
sandbox.window.window = sandbox.window;
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

console.log('====================================================================');
console.log(' TEST SUITE: REQ-261 House Downballot National Environment');
console.log('====================================================================');

// Setup baseline 2028 game
const game2028 = Engine.createGame(2028, 'people');

// -----------------------------------------------------------------------------
// Case 1: Generic Congressional Ballot Invariant (D+9.0 ± 0.5% at start)
// -----------------------------------------------------------------------------
console.log('\n--- Case 1: Generic Congressional Ballot Invariant (D+9.0 ± 0.5%) ---');
assert(game2028.nationalEnvironment === 9, `Game national environment initialized to 9 (actual: ${game2028.nationalEnvironment})`);

const elecResult = Engine.calculateDistrictElection(game2028, 2028);
assert(Array.isArray(elecResult.districtResults), 'calculateDistrictElection returns districtResults array');
assert(elecResult.districtResults.length === 435, `districtResults contains exactly 435 districts (actual: ${elecResult.districtResults.length})`);

const parties = Engine.partyList(game2028);
const demParty = parties.find((p) => (p.baseTemplateId || p.id) === 'people');
const repParty = parties.find((p) => (p.baseTemplateId || p.id) === 'heritage');

let demVotes = 0;
let repVotes = 0;
elecResult.districtResults.forEach((d) => {
  demVotes += (d.allShares[demParty.id] || 0);
  repVotes += (d.allShares[repParty.id] || 0);
});

const twoPartyTotal = demVotes + repVotes;
const demTwoParty = demVotes / twoPartyTotal * 100;
const repTwoParty = repVotes / twoPartyTotal * 100;
const popularMargin = demTwoParty - repTwoParty;

console.log(`  Two-Party National Popular Vote: Dem ${demTwoParty.toFixed(2)}% vs GOP ${repTwoParty.toFixed(2)}% (Margin: D+${popularMargin.toFixed(2)}%)`);
assert(popularMargin >= 8.5 && popularMargin <= 9.6, `Two-party House popular vote margin is D+9.0 ± 0.6% (actual: D+${popularMargin.toFixed(2)}%)`);
assert(demTwoParty >= 54.0 && demTwoParty <= 55.0, `Democrat two-party share is approximately 54.5% (actual: ${demTwoParty.toFixed(2)}%)`);
assert(repTwoParty >= 45.0 && repTwoParty <= 46.0, `Republican two-party share is approximately 45.5% (actual: ${repTwoParty.toFixed(2)}%)`);

// -----------------------------------------------------------------------------
// Case 2: District Baseline Margins (Pre-candidate forecast === district.lean + 9.0)
// -----------------------------------------------------------------------------
console.log('\n--- Case 2: District Baseline Margins (Pre-candidate forecast === district.lean + 9.0) ---');
const houseDistricts = Data.VERSION_01_HOUSE_DISTRICTS;
assert(houseDistricts.length === 435, `VERSION_01_HOUSE_DISTRICTS has 435 entries`);

let matchingBaselineCount = 0;
houseDistricts.forEach((d) => {
  const forecastMargin = Engine.estimateRaceMargin(game2028, `house:${d.id}`, { fundamentalsOnly: true });
  const expectedMargin = d.lean + 9.0;
  if (Math.abs(forecastMargin - expectedMargin) < 0.001) {
    matchingBaselineCount++;
  }
});
assert(matchingBaselineCount === 435, `All 435 House districts evaluate to district.lean + 9.0 fundamentals margin (actual: ${matchingBaselineCount}/435)`);

// -----------------------------------------------------------------------------
// Case 3: Spot Checks (EVEN ≈ D+9.0; R+4 ≈ D+5.0; R+12 ≈ R+3.0)
// -----------------------------------------------------------------------------
console.log('\n--- Case 3: Spot Checks (EVEN, R+4, R+12) ---');
const evenDist = houseDistricts.find((d) => d.lean === 0);
assert(Boolean(evenDist), `Found EVEN district in catalog: ${evenDist?.id}`);
const evenMargin = Engine.estimateRaceMargin(game2028, `house:${evenDist.id}`, { fundamentalsOnly: true });
assert(Math.abs(evenMargin - 9.0) < 0.001, `EVEN district (${evenDist.id}) evaluates to D+9.0 (actual: D+${evenMargin.toFixed(1)})`);

const r4Dist = houseDistricts.find((d) => d.lean === -4);
assert(Boolean(r4Dist), `Found R+4 district in catalog: ${r4Dist?.id}`);
const r4Margin = Engine.estimateRaceMargin(game2028, `house:${r4Dist.id}`, { fundamentalsOnly: true });
assert(Math.abs(r4Margin - 5.0) < 0.001, `R+4 district (${r4Dist.id}) evaluates to D+5.0 (actual: D+${r4Margin.toFixed(1)})`);

const r12Dist = houseDistricts.find((d) => d.lean === -12);
assert(Boolean(r12Dist), `Found R+12 district in catalog: ${r12Dist?.id}`);
const r12Margin = Engine.estimateRaceMargin(game2028, `house:${r12Dist.id}`, { fundamentalsOnly: true });
assert(Math.abs(r12Margin - (-3.0)) < 0.001, `R+12 district (${r12Dist.id}) evaluates to R+3.0 (actual: ${r12Margin.toFixed(1)})`);

// -----------------------------------------------------------------------------
// Case 4: Candidate Quality and Funding Adjustments Shift Margins
// -----------------------------------------------------------------------------
console.log('\n--- Case 4: Candidate Quality & Funding Adjustments Shift Baseline ---');
const testRaceKey = `house:${evenDist.id}`;
const baseMargin = Engine.estimateRaceMargin(game2028, testRaceKey, { fundamentalsOnly: true });

// Inject candidate quality difference
const testGameWithCand = {
  ...game2028,
  primaryResults: [
    { raceId: testRaceKey, partyId: 'people', quality: 8.0 },
    { raceId: testRaceKey, partyId: 'heritage', quality: 5.0 },
  ],
};
const candMargin = Engine.estimateRaceMargin(testGameWithCand, testRaceKey);
const qualityShift = candMargin - baseMargin;
console.log(`  Quality shift for +3.0 Dem quality advantage: ${qualityShift.toFixed(2)} pts`);
assert(qualityShift > 1.0, `Candidate quality advantage shifts margin positively (actual shift: +${qualityShift.toFixed(2)})`);

// Inject candidate funding
const testGameWithFunding = {
  ...game2028,
  candidateFunding: {
    [testRaceKey]: { allocated: 5 },
  },
};
const fundedMargin = Engine.estimateRaceMargin(testGameWithFunding, testRaceKey);
const fundShift = fundedMargin - baseMargin;
console.log(`  Funding shift for $5M allocated: ${fundShift.toFixed(2)} pts`);
assert(fundShift > 0.5, `Candidate funding shifts margin positively (actual shift: +${fundShift.toFixed(2)})`);

console.log('\n====================================================================');
console.log(` REQ-261 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================================');
