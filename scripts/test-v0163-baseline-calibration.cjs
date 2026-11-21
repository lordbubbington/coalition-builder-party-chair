/**
 * Verification Test Suite for REQ-257 (Version 0.16.3)
 * Target: scripts/test-v0163-baseline-calibration.cjs
 *
 * Covers Section 15 of VERSION_0.16.3_DESIGN.md:
 * - 2026 Midterm baseline popular vote calibration in scenario-2028.js
 * - Canonical figures: people: 56.2, heritage: 42.3, other: 1.5
 * - Exact 100.0% sum conservation across people, heritage, and other
 * - No collateral modification of other HISTORICAL_ELECTIONS entries
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
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
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

loadScript('data.js');
loadScript('scenario-2028.js');

console.log('====================================================================');
console.log(' TEST SUITE: REQ-257 2026 Midterm Baseline Popular Vote Calibration');
console.log('====================================================================');

const historicalElections = sandbox.window.PartyChairData.HISTORICAL_ELECTIONS;
assert(Array.isArray(historicalElections), 'HISTORICAL_ELECTIONS exists as an array');

const baseline2026 = historicalElections.find((e) => e.year === 2026 && e.isScenarioBaseline);
assert(Boolean(baseline2026), '2026 Midterm scenario baseline entry found');

// 1. Exact canonical values
assert(baseline2026.nationalVote.people === 56.2, `people share === 56.2 (actual: ${baseline2026.nationalVote.people})`);
assert(baseline2026.nationalVote.heritage === 42.3, `heritage share === 42.3 (actual: ${baseline2026.nationalVote.heritage})`);
assert(baseline2026.nationalVote.other === 1.5, `other share === 1.5 (actual: ${baseline2026.nationalVote.other})`);

// 2. 100.0% sum conservation
const sum = baseline2026.nationalVote.people + baseline2026.nationalVote.heritage + baseline2026.nationalVote.other;
assert(Math.abs(sum - 100.0) < 1e-9, `nationalVote sum === 100.0 exactly (actual: ${sum})`);

// 3. No collateral entry changes
const canonicalOtherYears = [
  { year: 2024, winner: 'heritage', ev: { people: 226, heritage: 312 } },
  { year: 2022, winner: 'heritage', houseSeats: { people: 213, heritage: 222 } },
  { year: 2020, winner: 'people', ev: { people: 306, heritage: 232 } },
];
canonicalOtherYears.forEach(({ year, winner, ev, houseSeats }) => {
  const entry = historicalElections.find((e) => e.year === year);
  assert(Boolean(entry), `Historical election entry for ${year} is intact`);
  assert(entry.winner === winner, `${year} winner preserved as ${winner}`);
  if (ev) {
    assert(entry.ev.people === ev.people && entry.ev.heritage === ev.heritage, `${year} EV preserved`);
  }
  if (houseSeats) {
    assert(entry.houseSeats.people === houseSeats.people && entry.houseSeats.heritage === houseSeats.heritage, `${year} House seats preserved`);
  }
});

console.log(`\n====================================================================`);
console.log(` REQ-257 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log(`====================================================================\n`);
