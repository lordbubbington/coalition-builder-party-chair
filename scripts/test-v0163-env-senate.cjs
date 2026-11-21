/**
 * Verification Test Suite for REQ-262 (Version 0.16.3)
 * Target: scripts/test-v0163-env-senate.cjs
 *
 * Covers Section 20 of VERSION_0.16.3_DESIGN.md:
 * - Senate downballot national environment calibration (1:1 transmission; no 0.55 dilution)
 * - Baseline sweep: fundamentals margin ≈ lean + 9.0 before candidate adjustments across all 2028 Senate contests
 * - Named battlegrounds: OH ≈ R+0.55; PA ≈ D+10.33; MT ≈ R+9.7; WI ≈ D+10.0; TX (R+8.0) ≈ D+1.0
 * - Ratings: R+5 to R+9 lean states open as Toss-Up / Tilt categories in forecasters
 * - Regression: candidate quality and incumbent lifts still shift margins off fundamentals baseline
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
console.log(' TEST SUITE: REQ-262 Senate Downballot National Environment');
console.log('====================================================================');

// Setup baseline 2028 game
const game2028 = Engine.createGame(2028, 'people');
assert(game2028.nationalEnvironment === 9, `Game national environment initialized to 9 (actual: ${game2028.nationalEnvironment})`);

// -----------------------------------------------------------------------------
// Case 1: Baseline Sweep for All 2028 Senate Contests (fundamentals ≈ lean + 9.0)
// -----------------------------------------------------------------------------
console.log('\n--- Case 1: Baseline Sweep for All 2028 Senate Contests ---');
const senateRaces = game2028.activeSenateRaces || Data.VERSION_01_SENATE_RACES || [];
assert(senateRaces.length > 0, `Active Senate races array is populated (${senateRaces.length} races)`);

let matchCount = 0;
senateRaces.forEach((race) => {
  const st = Data.STATES.find((s) => s.id === race.state);
  const stateLean = st.leanPercent !== undefined ? st.leanPercent : (-Number(st.lean || 0) * 100);
  const expectedBaseline = stateLean + 9.0;
  const baseMargin = Engine.senateBaselineMargin(game2028, race.state);
  if (Math.abs(baseMargin - expectedBaseline) < 0.01) {
    matchCount++;
  }
});
assert(matchCount === senateRaces.length, `All ${senateRaces.length} active 2028 Senate contests match state.leanPercent + 9.0 fundamentals baseline`);

// -----------------------------------------------------------------------------
// Case 2: Named Battlegrounds (OH, PA, MT, WI, TX)
// -----------------------------------------------------------------------------
console.log('\n--- Case 2: Named Battlegrounds Fundamentals Margins ---');

// Ohio: lean R+9.55 -> baseline -0.55 (R+0.55 Toss-Up)
const ohBaseline = Engine.senateBaselineMargin(game2028, 'OH');
console.log(`  Ohio Senate fundamentals baseline: ${ohBaseline.toFixed(2)}% (lean: -9.55, natEnv: 9.0)`);
assert(Math.abs(ohBaseline - (-0.55)) < 0.01, `Ohio Senate fundamentals baseline ≈ R+0.55 (actual: ${ohBaseline.toFixed(2)}%)`);

// Pennsylvania: lean D+1.33 -> baseline +10.33 (D+10.33)
const paBaseline = Engine.senateBaselineMargin(game2028, 'PA');
console.log(`  Pennsylvania Senate fundamentals baseline: ${paBaseline.toFixed(2)}% (lean: +1.33, natEnv: 9.0)`);
assert(Math.abs(paBaseline - 10.33) < 0.01, `Pennsylvania Senate fundamentals baseline ≈ D+10.33 (actual: ${paBaseline.toFixed(2)}%)`);

// Montana: lean R+18.72 -> baseline -9.72 (R+9.7)
const mtBaseline = Engine.senateBaselineMargin(game2028, 'MT');
console.log(`  Montana Senate fundamentals baseline: ${mtBaseline.toFixed(2)}% (lean: -18.72, natEnv: 9.0)`);
assert(Math.abs(mtBaseline - (-9.72)) < 0.05, `Montana Senate fundamentals baseline ≈ R+9.7 (actual: ${mtBaseline.toFixed(2)}%)`);

// Wisconsin: lean D+1.0 -> baseline +10.0 (D+10.0)
const wiBaseline = Engine.senateBaselineMargin(game2028, 'WI');
console.log(`  Wisconsin Senate fundamentals baseline: ${wiBaseline.toFixed(2)}% (lean: +1.0, natEnv: 9.0)`);
assert(Math.abs(wiBaseline - 10.0) < 0.01, `Wisconsin Senate fundamentals baseline ≈ D+10.0 (actual: ${wiBaseline.toFixed(2)}%)`);

// Texas: lean R+8.0 -> baseline +1.0 (D+1.0)
const txBaseline = Engine.senateBaselineMargin(game2028, 'TX');
console.log(`  Texas Senate fundamentals baseline: ${txBaseline.toFixed(2)}% (lean: -8.0, natEnv: 9.0)`);
assert(Math.abs(txBaseline - 1.0) < 0.01, `Texas Senate fundamentals baseline ≈ D+1.0 (actual: ${txBaseline.toFixed(2)}%)`);

// -----------------------------------------------------------------------------
// Case 3: Ratings Consistency (R+5 to R+9 Lean States Open as Toss-Up / Tilt)
// -----------------------------------------------------------------------------
console.log('\n--- Case 3: Forecaster Ratings for R+5 to R+9 Lean States ---');
const forecasters = game2028.forecasters || Engine.buildForecasters(game2028);

const battlegroundsToCheck = ['OH', 'KS', 'TX'];
battlegroundsToCheck.forEach((stId) => {
  const key = `senate:${stId}`;
  const sal = forecasters.sallow?.[key];
  const ck = forecasters.cooked?.[key];
  const ins = forecasters.inside?.[key];
  const con = forecasters.consensus?.[key];
  const poll = forecasters.polling?.[key];

  console.log(`  ${stId} Ratings -> Sallow: "${sal}", Cooked: "${ck}", Inside: "${ins}", Consensus: "${con}" (margin: ${poll?.margin})`);

  // Assert it is NOT rated as a safe or favored Republican hold
  assert(con !== 'Solid GOP' && con !== 'Likely GOP' && con !== 'Favored GOP' && con !== 'Very Likely GOP',
    `${stId} Consensus is not a safe/likely GOP hold (actual: "${con}")`);
  assert(sal !== 'Solid GOP' && sal !== 'Likely GOP',
    `${stId} Sallow is not a solid/likely GOP hold (actual: "${sal}")`);
  assert(ck !== 'Solid GOP' && ck !== 'Likely GOP',
    `${stId} Cooked is not a solid/likely GOP hold (actual: "${ck}")`);
  assert(ins !== 'Solid GOP' && ins !== 'Likely GOP',
    `${stId} Inside Elections is not a solid/likely GOP hold (actual: "${ins}")`);

  // Assert consensus is in the Toss-Up or Tilt spectrum
  const isCompetitiveTier = ['Toss-Up', 'Tilt Dem', 'Tilt GOP', 'Lean Dem', 'Lean GOP'].includes(con);
  assert(isCompetitiveTier, `${stId} Consensus opens in competitive Toss-Up / Tilt / Lean range (actual: "${con}")`);
});

// -----------------------------------------------------------------------------
// Case 4: Candidate Quality and Incumbent Lift Regressions
// -----------------------------------------------------------------------------
console.log('\n--- Case 4: Candidate Quality & Incumbent Lift Regressions ---');
const testRaceKey = 'senate:OH';
const baseEst = Engine.estimateRaceMargin(game2028, testRaceKey, { fundamentalsOnly: true });

// Inject candidate quality difference
const testGameWithCand = {
  ...game2028,
  primaryResults: [
    { raceId: testRaceKey, partyId: 'people', quality: 8.0 },
    { raceId: testRaceKey, partyId: 'heritage', quality: 5.0 },
  ],
};
const candMargin = Engine.estimateRaceMargin(testGameWithCand, testRaceKey);
const qualityShift = candMargin - Engine.estimateRaceMargin(game2028, testRaceKey);
console.log(`  Candidate quality shift for +3.0 Dem quality advantage: ${qualityShift.toFixed(2)} pts`);
assert(qualityShift > 1.0, `Candidate quality advantage shifts Senate margin positively (actual shift: +${qualityShift.toFixed(2)})`);

// Verify incumbent advantage in estimateRaceMargin
const ohFullMargin = Engine.estimateRaceMargin(game2028, testRaceKey);
console.log(`  Ohio full estimated margin (with Sherrod Brown incumbent): ${ohFullMargin.toFixed(2)}% vs baseline ${baseEst.toFixed(2)}%`);
assert(ohFullMargin > baseEst, `Incumbent advantage shifts estimated margin favorably for sitting member`);

console.log('\n====================================================================');
console.log(` REQ-262 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================================');
