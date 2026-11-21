/**
 * Standalone Node Test Suite for REQ-72: State Legislature Seat Assignment Engine
 * Verifies piecewise bell-curve seat scaling, 2-party largest-remainder allocation,
 * multi-party step-up protocol, 15% threshold disqualification, and zero missing/excess
 * seats across all 50 state chambers (5,462 seats nationwide).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Setup mock window environment to load game data and engine
const sandbox = {
  window: {},
  console: console,
  Math: Math,
  JSON: JSON,
  Number: Number,
  Object: Object,
  Array: Array,
  String: String,
  Infinity: Infinity,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
};
sandbox.window = sandbox;

function loadScript(filePath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
  vm.runInContext(code, vm.createContext(sandbox));
}

// Load dependencies
loadScript('data.js');
loadScript('scenario-2028.js');
loadScript('issues-0.2.1.js');
loadScript('state-house-data-0.5.js');
loadScript('voter-model-0.5.js');
loadScript('v07-scaffolding.js');
loadScript('engine.js');

const Engine = sandbox.window.PartyChairEngine;
const {
  seatsForVoteShare100,
  allocateTwoPartySeats,
  allocateMultiPartySeats,
  allocateStateLegislatureSeats,
  reallocateStateHouseSeatCounts,
} = Engine;

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  PASS: ${message}`);
}

function assertClose(actual, expected, tolerance = 1e-4, message = '') {
  assert(Math.abs(actual - expected) <= tolerance, `${message} (expected ~${expected}, got ${actual})`);
}

console.log('================================================================');
console.log('TEST SUITE: REQ-72 State Legislature Seat Assignment Engine');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Standardized 100-Seat Piecewise Bell Curve Function
// ----------------------------------------------------------------------------
console.log('--- TEST GROUP 1: Standardized 100-Seat Piecewise Bell Curve (seatsForVoteShare100) ---');

// Disqualification Threshold (< 15% -> 0 seats)
assert(seatsForVoteShare100(0) === 0, 'Vote share 0% gives 0 seats');
assert(seatsForVoteShare100(5) === 0, 'Vote share 5% gives 0 seats');
assert(seatsForVoteShare100(10) === 0, 'Vote share 10% gives 0 seats');
assert(seatsForVoteShare100(14.99) === 0, 'Vote share 14.99% gives 0 seats (<15 threshold)');
assert(seatsForVoteShare100(15) === 0, 'Vote share 15% gives 0 seats: (15 - 15) * 0.40 = 0');

// Zone 1: 15% <= V < 40% -> (V - 15) * 0.40
assertClose(seatsForVoteShare100(20), 2.0, 1e-6, 'Vote share 20% gives 2.0 seats');
assertClose(seatsForVoteShare100(25), 4.0, 1e-6, 'Vote share 25% gives 4.0 seats');
assertClose(seatsForVoteShare100(30), 6.0, 1e-6, 'Vote share 30% gives 6.0 seats');
assertClose(seatsForVoteShare100(35), 8.0, 1e-6, 'Vote share 35% gives 8.0 seats');
assertClose(seatsForVoteShare100(39.9), 9.96, 1e-6, 'Vote share 39.9% gives 9.96 seats');

// Zone 2: 40% <= V < 60% -> 10 + (V - 40) * 4.0 (steep swing zone)
assertClose(seatsForVoteShare100(40), 10.0, 1e-6, 'Vote share 40% gives 10.0 seats (Zone 1/2 boundary continuity)');
assertClose(seatsForVoteShare100(45), 30.0, 1e-6, 'Vote share 45% gives 30.0 seats');
assertClose(seatsForVoteShare100(48), 42.0, 1e-6, 'Vote share 48% gives 42.0 seats');
assertClose(seatsForVoteShare100(50), 50.0, 1e-6, 'Vote share 50% gives 50.0 seats (exact midpoint)');
assertClose(seatsForVoteShare100(52), 58.0, 1e-6, 'Vote share 52% gives 58.0 seats');
assertClose(seatsForVoteShare100(55), 70.0, 1e-6, 'Vote share 55% gives 70.0 seats');

// Zone 3: 60% <= V <= 85% -> 90 + (V - 60) * 0.40 (taper zone)
assertClose(seatsForVoteShare100(60), 90.0, 1e-6, 'Vote share 60% gives 90.0 seats (Zone 2/3 boundary continuity)');
assertClose(seatsForVoteShare100(65), 92.0, 1e-6, 'Vote share 65% gives 92.0 seats');
assertClose(seatsForVoteShare100(70), 94.0, 1e-6, 'Vote share 70% gives 94.0 seats');
assertClose(seatsForVoteShare100(75), 96.0, 1e-6, 'Vote share 75% gives 96.0 seats');
assertClose(seatsForVoteShare100(80), 98.0, 1e-6, 'Vote share 80% gives 98.0 seats');
assertClose(seatsForVoteShare100(85), 100.0, 1e-6, 'Vote share 85% gives 100.0 seats: 90 + 25 * 0.40 = 100');

// Zone 4: V > 85% -> 100 seats (monopoly rule)
assert(seatsForVoteShare100(85.1) === 100, 'Vote share 85.1% gives 100 seats (monopoly)');
assert(seatsForVoteShare100(90) === 100, 'Vote share 90% gives 100 seats (monopoly)');
assert(seatsForVoteShare100(100) === 100, 'Vote share 100% gives 100 seats (monopoly)');

// Curve Symmetry Invariant: For all V in [0, 100], S(V) + S(100 - V) == 100
let symmetryValid = true;
for (let v = 0; v <= 100; v += 1) {
  const sum = seatsForVoteShare100(v) + seatsForVoteShare100(100 - v);
  if (Math.abs(sum - 100) > 1e-6) {
    symmetryValid = false;
    console.error(`Symmetry violation at ${v}% + ${100 - v}% = ${sum}`);
    break;
  }
}
assert(symmetryValid, 'Curve symmetry invariant S(V) + S(100 - V) === 100 holds identically for all V in [0, 100]');

// Monotonicity Invariant
let monotonicValid = true;
for (let v = 0; v < 100; v += 0.5) {
  if (seatsForVoteShare100(v) > seatsForVoteShare100(v + 0.5)) {
    monotonicValid = false;
    break;
  }
}
assert(monotonicValid, 'Curve is strictly monotonic non-decreasing across [0, 100]');

console.log();

// ----------------------------------------------------------------------------
// TEST 2: Two-Party Race Allocation (Largest Remainder Rounding)
// ----------------------------------------------------------------------------
console.log('--- TEST GROUP 2: Two-Party Races & Largest-Remainder Allocation ---');

// Test 52/48 across varied chamber sizes
const sizes52_48 = [
  { size: 100, expA: 58, expB: 42, label: '100-seat standard chamber' },
  { size: 203, expA: 118, expB: 85, label: 'Pennsylvania House (203 seats)' },
  { size: 80, expA: 46, expB: 34, label: 'California Assembly (80 seats)' },
  { size: 400, expA: 232, expB: 168, label: 'New Hampshire House (400 seats)' },
  { size: 62, expA: 36, expB: 26, label: 'Wyoming House (62 seats)' },
  { size: 40, expA: 23, expB: 17, label: 'Alaska House (40 seats)' },
];

for (const { size, expA, expB, label } of sizes52_48) {
  const res = allocateTwoPartySeats('A', 52, 'B', 48, size);
  assert(
    res.A === expA && res.B === expB && res.A + res.B === size,
    `52/48 in ${label}: A=${res.A}, B=${res.B} (sum=${res.A + res.B}/${size})`
  );
  // Also verify through allocateStateLegislatureSeats
  const resUnified = allocateStateLegislatureSeats({ A: 52, B: 48 }, size);
  assert(
    resUnified.A === expA && resUnified.B === expB,
    `52/48 unified API matches in ${label}`
  );
}

// 50/50 exact tie
const resTie100 = allocateTwoPartySeats('A', 50, 'B', 50, 100);
assert(resTie100.A === 50 && resTie100.B === 50 && resTie100.A + resTie100.B === 100, '50/50 in 100 seats gives exactly 50/50');
const resTie203 = allocateTwoPartySeats('A', 50, 'B', 50, 203);
assert(resTie203.A + resTie203.B === 203 && Math.abs(resTie203.A - resTie203.B) === 1, '50/50 in 203 seats sums to 203 (102/101 split)');

// 60/40 solid win
const res60_40_100 = allocateTwoPartySeats('A', 60, 'B', 40, 100);
assert(res60_40_100.A === 90 && res60_40_100.B === 10, '60/40 in 100 seats gives 90/10 seats');
const res60_40_203 = allocateTwoPartySeats('A', 60, 'B', 40, 203);
assert(res60_40_203.A === 183 && res60_40_203.B === 20 && res60_40_203.A + res60_40_203.B === 203, '60/40 in 203 seats gives 183/20 seats (sum=203)');

// 75/25 landslide
const res75_25_100 = allocateTwoPartySeats('A', 75, 'B', 25, 100);
assert(res75_25_100.A === 96 && res75_25_100.B === 4, '75/25 in 100 seats gives 96/4 seats');

// 85/15 monopoly edge
const res85_15_100 = allocateTwoPartySeats('A', 85, 'B', 15, 100);
assert(res85_15_100.A === 100 && res85_15_100.B === 0, '85/15 in 100 seats gives 100/0 seats');

// 88/12 minority sub-15% disqualification
const res88_12_100 = allocateTwoPartySeats('A', 88, 'B', 12, 100);
assert(res88_12_100.A === 100 && res88_12_100.B === 0, '88/12 in 100 seats: Party B (12% < 15%) receives 0 seats; Party A receives 100');
const res88_12_203 = allocateTwoPartySeats('A', 88, 'B', 12, 203);
assert(res88_12_203.A === 203 && res88_12_203.B === 0, '88/12 in 203 seats: Party B (12% < 15%) receives 0 seats; Party A receives 203');

console.log();

// ----------------------------------------------------------------------------
// TEST 3: Multi-Party Race Allocation (3+ Parties at >= 15% Vote Share)
// ----------------------------------------------------------------------------
console.log('--- TEST GROUP 3: Multi-Party Races & Iterative Step-Up Loop ---');

// 3-Way Race: 40% / 35% / 25%
const res3Way100 = allocateMultiPartySeats({ A: 40, B: 35, C: 25 }, 100);
assert(
  res3Way100.A === 46 && res3Way100.B === 36 && res3Way100.C === 18 && res3Way100.A + res3Way100.B + res3Way100.C === 100,
  '40/35/25 in 100 seats: { A: 46, B: 36, C: 18 } (exact sum = 100)'
);

const res3Way203 = allocateMultiPartySeats({ A: 40, B: 35, C: 25 }, 203);
assert(
  res3Way203.A === 92 && res3Way203.B === 74 && res3Way203.C === 37 && res3Way203.A + res3Way203.B + res3Way203.C === 203,
  '40/35/25 in 203 seats (PA): { A: 92, B: 74, C: 37 } (exact sum = 203)'
);

const res3Way80 = allocateMultiPartySeats({ A: 40, B: 35, C: 25 }, 80);
assert(
  res3Way80.A + res3Way80.B + res3Way80.C === 80,
  `40/35/25 in 80 seats (CA): sum=${res3Way80.A + res3Way80.B + res3Way80.C}/80`
);

const res3Way400 = allocateMultiPartySeats({ A: 40, B: 35, C: 25 }, 400);
assert(
  res3Way400.A + res3Way400.B + res3Way400.C === 400,
  `40/35/25 in 400 seats (NH): sum=${res3Way400.A + res3Way400.B + res3Way400.C}/400`
);

// 4-Way Race: 30% / 25% / 25% / 20%
const res4Way100 = allocateMultiPartySeats({ A: 30, B: 25, C: 25, D: 20 }, 100);
assert(
  res4Way100.A === 38 && res4Way100.B === 25 && res4Way100.C === 25 && res4Way100.D === 12 &&
  res4Way100.A + res4Way100.B + res4Way100.C + res4Way100.D === 100,
  '30/25/25/20 in 100 seats: { A: 38, B: 25, C: 25, D: 12 } (exact sum = 100)'
);

const res4Way203 = allocateMultiPartySeats({ A: 30, B: 25, C: 25, D: 20 }, 203);
assert(
  res4Way203.A === 76 && res4Way203.B === 51 && res4Way203.C === 51 && res4Way203.D === 25 &&
  res4Way203.A + res4Way203.B + res4Way203.C + res4Way203.D === 203,
  '30/25/25/20 in 203 seats (PA): { A: 76, B: 51, C: 51, D: 25 } (exact sum = 203)'
);

// 3-Way Equal Split: 34% / 33% / 33%
const resEqual3Way100 = allocateMultiPartySeats({ A: 34, B: 33, C: 33 }, 100);
assert(
  resEqual3Way100.A === 34 && resEqual3Way100.B === 33 && resEqual3Way100.C === 33 &&
  resEqual3Way100.A + resEqual3Way100.B + resEqual3Way100.C === 100,
  '34/33/33 in 100 seats: { A: 34, B: 33, C: 33 } (exact sum = 100)'
);

console.log();

// ----------------------------------------------------------------------------
// TEST 4: Minor Parties Under 15% Strict Disqualification
// ----------------------------------------------------------------------------
console.log('--- TEST GROUP 4: Minor-Party Disqualification (< 15% Vote Share) ---');

// Case 45/45/10: Party C (10%) must get strictly 0 seats
const res45_45_10_100 = allocateStateLegislatureSeats({ A: 45, B: 45, C: 10 }, 100);
assert(
  res45_45_10_100.C === 0 && res45_45_10_100.A === 50 && res45_45_10_100.B === 50 &&
  res45_45_10_100.A + res45_45_10_100.B + res45_45_10_100.C === 100,
  '45/45/10 in 100 seats: C=0 (disqualified), A=50, B=50 (exact sum = 100)'
);

const res45_45_10_203 = allocateStateLegislatureSeats({ A: 45, B: 45, C: 10 }, 203);
assert(
  res45_45_10_203.C === 0 && res45_45_10_203.A + res45_45_10_203.B === 203,
  `45/45/10 in 203 seats: C=0, A=${res45_45_10_203.A}, B=${res45_45_10_203.B} (exact sum = 203)`
);

// Case 35/30/20/10/5: D (10%) and E (5%) must get strictly 0 seats
const res5Way100 = allocateStateLegislatureSeats({ A: 35, B: 30, C: 20, D: 10, E: 5 }, 100);
assert(
  res5Way100.D === 0 && res5Way100.E === 0 &&
  res5Way100.A === 50 && res5Way100.B === 38 && res5Way100.C === 12 &&
  res5Way100.A + res5Way100.B + res5Way100.C + res5Way100.D + res5Way100.E === 100,
  '35/30/20/10/5 in 100 seats: D=0, E=0 (both <15% disqualified); A=50, B=38, C=12 (sum=100)'
);

const res5Way203 = allocateStateLegislatureSeats({ A: 35, B: 30, C: 20, D: 10, E: 5 }, 203);
assert(
  res5Way203.D === 0 && res5Way203.E === 0 &&
  res5Way203.A + res5Way203.B + res5Way203.C === 203,
  `35/30/20/10/5 in 203 seats: D=0, E=0; A=${res5Way203.A}, B=${res5Way203.B}, C=${res5Way203.C} (sum=203)`
);

// Case 48/46/6: Third party with 6% gets strictly 0 seats
const res48_46_6 = allocateStateLegislatureSeats({ A: 48, B: 46, C: 6 }, 100);
assert(res48_46_6.C === 0 && res48_46_6.A + res48_46_6.B === 100, '48/46/6 in 100 seats: C=0, sum=100');

// Case 70/12/10/8: Parties with 12%, 10%, 8% all < 15% -> strictly 0 seats; 70% party gets 100 seats
const resSolo = allocateStateLegislatureSeats({ A: 70, B: 12, C: 10, D: 8 }, 100);
assert(
  resSolo.B === 0 && resSolo.C === 0 && resSolo.D === 0 && resSolo.A === 100,
  '70/12/10/8: All minor parties <15% get 0 seats; qualifying Party A gets 100% of seats'
);

console.log();

// ----------------------------------------------------------------------------
// TEST 5: All 50 State Chambers Exhaustive Verification
// ----------------------------------------------------------------------------
console.log('--- TEST GROUP 5: All 50 State Chambers Full Verification (5,462 Seats) ---');

const stateHouseData = sandbox.window.PartyChairData.VERSION_05_STATE_HOUSE_SEATS;
assert(stateHouseData && stateHouseData.states, 'VERSION_05_STATE_HOUSE_SEATS loaded properly');
assert(stateHouseData.totalSeats === 5462, `Total seats nationwide equals 5,462 (got ${stateHouseData.totalSeats})`);

const states = Object.entries(stateHouseData.states);
assert(states.length === 50, `Exactly 50 states loaded (got ${states.length})`);

const scenarios = [
  { name: '2-Party Battleground (52/48)', votes: { people: 52, heritage: 48 } },
  { name: '2-Party Nailbiter (50.5/49.5)', votes: { people: 50.5, heritage: 49.5 } },
  { name: '2-Party Landslide (65/35)', votes: { people: 65, heritage: 35 } },
  { name: '3-Way Battleground (40/35/25)', votes: { people: 40, heritage: 35, liberty: 25 } },
  { name: '4-Way Splinter (32/28/22/18)', votes: { people: 32, heritage: 28, liberty: 22, green: 18 } },
  { name: '2-Party with Minor Spoilers (44/42/8/6)', votes: { people: 44, heritage: 42, liberty: 8, green: 6 } },
  { name: 'Dominant Party with 3 Minor Parties (75/11/8/6)', votes: { people: 75, heritage: 11, liberty: 8, green: 6 } },
];

for (const scenario of scenarios) {
  let scenarioTotalAllocated = 0;
  let scenarioTotalChamberSeats = 0;
  let minorPartyViolation = false;

  for (const [stateId, info] of states) {
    const chamberSeats = info.total;
    scenarioTotalChamberSeats += chamberSeats;

    const res = allocateStateLegislatureSeats(scenario.votes, chamberSeats);
    const sumAllocated = Object.values(res).reduce((a, b) => a + b, 0);

    if (sumAllocated !== chamberSeats) {
      console.error(`Mismatch in ${stateId} for ${scenario.name}: allocated ${sumAllocated}, expected ${chamberSeats}`);
    }
    scenarioTotalAllocated += sumAllocated;

    // Check that any party with < 15% received strictly 0 seats
    for (const [partyId, vote] of Object.entries(scenario.votes)) {
      if (vote < 15 && (res[partyId] || 0) > 0) {
        minorPartyViolation = true;
        console.error(`Minor party ${partyId} with ${vote}% received ${res[partyId]} seats in ${stateId}!`);
      }
    }
  }

  assert(
    scenarioTotalAllocated === scenarioTotalChamberSeats,
    `Scenario "${scenario.name}": exactly ${scenarioTotalAllocated} / ${scenarioTotalChamberSeats} seats allocated nationwide (0 missing, 0 excess)`
  );
  assert(
    !minorPartyViolation,
    `Scenario "${scenario.name}": parties under 15% received strictly 0 seats in all 50 states`
  );
}

console.log();

// ----------------------------------------------------------------------------
// TEST 6: Game Context Integration & Reallocation
// ----------------------------------------------------------------------------
console.log('--- TEST GROUP 6: Game Context & Post-Election Reallocation ---');

const game = Engine.createGame({ playerParty: 'people' });
assert(game && game.stateHouseSeatCounts, 'Game initializes with stateHouseSeatCounts');

// Verify initial state house seat counts nationwide
let initialNationwideSeats = 0;
for (const [sId, row] of Object.entries(game.stateHouseSeatCounts)) {
  initialNationwideSeats += row.total || (row.people + row.heritage + (row.independent || 0) + (row.other || 0) + (row.unallocated || 0));
}
assert(initialNationwideSeats === 5462, `Initial game state house seats total 5,462 (got ${initialNationwideSeats})`);

// Run reallocateStateHouseSeatCounts with game context
const reallocated = reallocateStateHouseSeatCounts(game.stateHouseSeatCounts, game.stateLegislatures, game.stateLegislatures, game);
assert(reallocated && Object.keys(reallocated).length === 50, 'Reallocated seat counts returned for all 50 states');

// Verify Nebraska retains nonpartisan chamber
assert(reallocated.NE.other === 49 && reallocated.NE.total === 49, 'Nebraska (NE) preserves its 49-seat nonpartisan unicameral chamber');

// Verify all other 49 state chambers have 0 missing and 0 excess seats
let postElectionNationwideSeats = 0;
let postElectionExactMatches = true;

for (const [sId, info] of Object.entries(stateHouseData.states)) {
  const row = reallocated[sId];
  const rowTotal = (row.people || 0) + (row.heritage || 0) + (row.independent || 0) + (row.other || 0) + (row.unallocated || 0);
  postElectionNationwideSeats += rowTotal;
  if (rowTotal !== info.total) {
    postElectionExactMatches = false;
    console.error(`Post-election seat count mismatch in ${sId}: row total ${rowTotal} !== chamber total ${info.total}`);
  }
}

assert(postElectionExactMatches, 'Every state chamber seat count matches chamber total with zero missing or excess seats post-election');
assert(postElectionNationwideSeats === 5462, `Post-election nationwide seats total exactly 5,462 (got ${postElectionNationwideSeats})`);

console.log();
console.log('================================================================');
console.log(`ALL TESTS PASSED: ${passedTests} / ${totalTests} assertions verified!`);
console.log('================================================================\n');
