/**
 * Verification Test Suite for REQ-260 (Version 0.16.3)
 * Target: scripts/test-v0163-regional-calibration.cjs
 *
 * Covers Section 18 of VERSION_0.16.3_DESIGN.md:
 * - Socialist Vermont Peak & Regional Geographic Calibration:
 *   1. Vermont (VT) mathematically anchored as the Socialist party's #1 state nationally under all conditions
 *   2. FACTION_STATE_MATRIX density check: VT.soc_socialists + VT.soc_communists > VT.grn_eco_socialist_vanguard + VT.grn_yimby
 *   3. Regional invariants:
 *      - Northeast: avg(socialist) > avg(green)
 *      - Midwest: avg(socialist) > avg(green)
 *      - West: avg(green) > avg(socialist)
 *   4. Constraint composition with REQ-258 (ballot access walls) & REQ-259 (3.0% ceiling)
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
console.log(' TEST SUITE: REQ-260 Socialist Vermont Peak & Regional Calibration');
console.log('====================================================================');

// -----------------------------------------------------------------------------
// Case 1: VT Density Check in FACTION_STATE_MATRIX
// -----------------------------------------------------------------------------
console.log('\n--- Case 1: VT Density Check in FACTION_STATE_MATRIX ---');

const matrix = Data.FACTION_STATE_MATRIX;
assert(Boolean(matrix && matrix.VT), 'FACTION_STATE_MATRIX.VT exists');

const vtSoc = (matrix.VT.soc_socialists || 0) + (matrix.VT.soc_communists || 0);
const vtGrn = (matrix.VT.grn_eco_socialist_vanguard || 0) + (matrix.VT.grn_yimby || 0);

assert(vtSoc > vtGrn, `VT socialist voters (${vtSoc}) exceed green voters (${vtGrn}) in FACTION_STATE_MATRIX`);

// Verify per-capita concentration of socialist faction voters is highest in VT
let highestPerCapitaState = '';
let highestPerCapitaRate = 0;

Object.entries(matrix).forEach(([stId, stFactions]) => {
  const total = Object.values(stFactions).reduce((a, b) => a + Number(b || 0), 0) || 1;
  const soc = (stFactions.soc_socialists || 0) + (stFactions.soc_communists || 0);
  const rate = soc / total;
  if (rate > highestPerCapitaRate) {
    highestPerCapitaRate = rate;
    highestPerCapitaState = stId;
  }
});

assert(highestPerCapitaState === 'VT', `VT holds the highest per-capita socialist density nationally (${(highestPerCapitaRate * 100).toFixed(2)}%)`);

// -----------------------------------------------------------------------------
// Case 2: Regional Ordering Invariants (with active access)
// -----------------------------------------------------------------------------
console.log('\n--- Case 2: Regional Ordering Invariants ---');

// Create test game with nationwide ballot access for socialist and green to evaluate demographic/regional fundamentals
const game = Engine.createGame({ playerParty: 'people' });
game.ballotAccess = game.ballotAccess || {};
const allStatesMap = Object.fromEntries(Data.STATES.map((s) => [s.id, true]));
allStatesMap.DC = true;
game.ballotAccess.socialist = { presidential: { ...allStatesMap }, senate: { ...allStatesMap }, governor: { ...allStatesMap }, leg: { ...allStatesMap }, house: {} };
game.ballotAccess.green = { presidential: { ...allStatesMap }, senate: { ...allStatesMap }, governor: { ...allStatesMap }, leg: { ...allStatesMap }, house: {} };

const regSums = { Northeast: { soc: 0, grn: 0, n: 0 }, Midwest: { soc: 0, grn: 0, n: 0 }, West: { soc: 0, grn: 0, n: 0 } };
let vtPolling = 0;
let highestOtherStatePolling = 0;
let highestOtherStateId = '';

Data.STATES.forEach((state) => {
  const supp = Engine.supportByState(game, state);
  const soc = supp.socialist || 0;
  const grn = supp.green || 0;

  if (state.id === 'VT') {
    vtPolling = soc;
  } else {
    if (soc > highestOtherStatePolling) {
      highestOtherStatePolling = soc;
      highestOtherStateId = state.id;
    }
  }

  if (regSums[state.region]) {
    regSums[state.region].soc += soc;
    regSums[state.region].grn += grn;
    regSums[state.region].n++;
  }
});

// Part 1: VT is #1 argmax state nationally
assert(vtPolling > highestOtherStatePolling, `Vermont (${vtPolling.toFixed(2)}%) is the #1 highest polling state nationally for Socialists (next: ${highestOtherStateId} at ${highestOtherStatePolling.toFixed(2)}%)`);

// Part 2: Northeast Socialist > Green
const neSoc = regSums.Northeast.soc / regSums.Northeast.n;
const neGrn = regSums.Northeast.grn / regSums.Northeast.n;
assert(neSoc > neGrn, `Northeast regional invariant: Socialist (${neSoc.toFixed(2)}%) > Green (${neGrn.toFixed(2)}%)`);

// Part 3: Midwest Socialist > Green
const mwSoc = regSums.Midwest.soc / regSums.Midwest.n;
const mwGrn = regSums.Midwest.grn / regSums.Midwest.n;
assert(mwSoc > mwGrn, `Midwest regional invariant: Socialist (${mwSoc.toFixed(2)}%) > Green (${mwGrn.toFixed(2)}%)`);

// Part 4: West Green > Socialist
const wSoc = regSums.West.soc / regSums.West.n;
const wGrn = regSums.West.grn / regSums.West.n;
assert(wGrn > wSoc, `West regional invariant: Green (${wGrn.toFixed(2)}%) > Socialist (${wSoc.toFixed(2)}%)`);

// -----------------------------------------------------------------------------
// Case 3: Constraint Composition with REQ-259 (3.0% Ceiling) & REQ-258
// -----------------------------------------------------------------------------
console.log('\n--- Case 3: Constraint Composition with REQ-259 Ceiling ---');

Data.STATES.forEach((state) => {
  const supp = Engine.supportByState(game, state);
  assert((supp.socialist || 0) <= 3.0 + 1e-4, `Socialist share in ${state.id} (${(supp.socialist || 0).toFixed(2)}%) complies with <= 3.0% ceiling`);
  assert((supp.green || 0) <= 3.0 + 1e-4, `Green share in ${state.id} (${(supp.green || 0).toFixed(2)}%) complies with <= 3.0% ceiling`);
});

console.log(`\n====================================================================`);
console.log(` REQ-260 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log(`====================================================================\n`);
