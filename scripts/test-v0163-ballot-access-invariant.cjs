/**
 * Verification Test Suite for REQ-258 (Version 0.16.3)
 * Target: scripts/test-v0163-ballot-access-invariant.cjs
 *
 * Covers Section 16 of VERSION_0.16.3_DESIGN.md:
 * - Strict ballot access zero-polling invariant across all four polling paths:
 *   1. Presidential / Electoral College Polling (supportByState)
 *   2. Race-Specific Polling (commissionRacePoll)
 *   3. Senate & House Candidates (version01CandidateField)
 *   4. State Legislative Slates (reallocateStateHouseSeatCounts)
 * - 51-jurisdiction zero-access sweep (all 50 states + DC)
 * - Positive regression: parties with ballot access poll normally
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
console.log(' TEST SUITE: REQ-258 Strict Ballot Access Zero-Polling Invariant');
console.log('====================================================================');

// Setup baseline game
const baseGame = Engine.createGame({ playerParty: 'people' });
const allStates = [...Data.STATES];
if (!allStates.some((s) => s.id === 'DC')) {
  allStates.push({ id: 'DC', stateId: 'DC', name: 'District of Columbia', region: 'South', ev: 3, lean: 0.85 });
}

// -----------------------------------------------------------------------------
// Case 1: Presidential Sweep across all 51 jurisdictions for party with {} access
// -----------------------------------------------------------------------------
console.log('\n--- Case 1: Presidential Sweep with Empty Ballot Access ({}) ---');

// Clone game and empty out socialist ballot access completely
const zeroAccessGame = JSON.parse(JSON.stringify(baseGame));
zeroAccessGame.ballotAccess = zeroAccessGame.ballotAccess || {};
zeroAccessGame.ballotAccess.socialist = { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} };

let socialistNonZeroCount = 0;
allStates.forEach((state) => {
  const shares = Engine.supportByState(zeroAccessGame, state);
  const share = shares.socialist || 0;
  if (share > 0) socialistNonZeroCount++;
});
assert(socialistNonZeroCount === 0, `Party with empty ballot access polls 0.0% in all ${allStates.length} jurisdictions (actual non-zero: ${socialistNonZeroCount})`);

// -----------------------------------------------------------------------------
// Case 2: Race-Specific Polling without ballot access
// -----------------------------------------------------------------------------
console.log('\n--- Case 2: Race-Specific Polling without Ballot Access ---');

const pollGame = JSON.parse(JSON.stringify(baseGame));
pollGame.player = { ...pollGame.player, baseTemplateId: 'socialist', custom: false };
pollGame.treasury = 50.0;
pollGame.ballotAccess = { socialist: { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} } };

const polledRace = 'senate:PA';
assert(!Engine.hasBallotAccess(pollGame, 'socialist', polledRace), 'Confirm socialist has NO ballot access for senate:PA');

const pollResult = Engine.commissionRacePoll(pollGame, { raceKey: polledRace, stateId: 'PA', office: 'senate' });
const poll = (pollResult.commissionedPolls || []).find((p) => p.raceKey === polledRace) || pollResult.commissionedPolls?.[polledRace];
assert(Boolean(poll), 'Commissioned poll record generated');
assert(poll.playerShare === 0.0, `playerShare === 0.0 with no ballot access (actual: ${poll.playerShare})`);

// Check 100% sum conservation: playerShare + rivalShare + otherShare + undecided === 100
const totalPollSum = poll.playerShare + poll.rivalShare + (poll.otherShare || 0) + poll.undecided;
assert(Math.abs(totalPollSum - 100.0) < 0.2, `Total poll shares sum to 100% among majors + undecideds (actual: ${totalPollSum})`);

// -----------------------------------------------------------------------------
// Case 3: Candidate Field without ballot access
// -----------------------------------------------------------------------------
console.log('\n--- Case 3: Senate & House Candidate Field without Ballot Access ---');

const candGame = JSON.parse(JSON.stringify(baseGame));
candGame.ballotAccess = { socialist: { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} } };

const noAccessSenateField = Engine.version01CandidateField(candGame, 'senate:OH', 'socialist');
assert(Array.isArray(noAccessSenateField) && noAccessSenateField.length === 0, 'Candidate field returns empty array [] for race without ballot access');

const noAccessHouseField = Engine.version01CandidateField(candGame, 'house:PA-1', 'socialist');
assert(Array.isArray(noAccessHouseField) && noAccessHouseField.length === 0, 'Candidate field returns empty array [] for house race without ballot access');

// -----------------------------------------------------------------------------
// Case 4: State Legislative Slates without ballot access
// -----------------------------------------------------------------------------
console.log('\n--- Case 4: State Legislative Slates without Ballot Access ---');

const legGame = JSON.parse(JSON.stringify(baseGame));
legGame.ballotAccess = {
  socialist: { senate: {}, governor: {}, house: {}, leg: { PA: false, OH: false }, presidential: {} },
};

const counts = Engine.reallocateStateHouseSeatCounts(null, null, null, legGame);
assert(counts.PA !== undefined, 'counts.PA generated');
assert((counts.PA.socialist || 0) === 0, `socialist state house seats in PA === 0 without ballot access (actual: ${counts.PA.socialist})`);
assert((counts.PA.slateShares?.socialist || 0) === 0, `socialist state house slate vote share in PA === 0.0% without access (actual: ${counts.PA.slateShares?.socialist})`);

// -----------------------------------------------------------------------------
// Case 5: Positive Regression — Valid access produces normal non-zero polling
// -----------------------------------------------------------------------------
console.log('\n--- Case 5: Positive Regression with Valid Ballot Access ---');

const validGame = JSON.parse(JSON.stringify(baseGame));
validGame.ballotAccess = validGame.ballotAccess || {};
validGame.ballotAccess.socialist = {
  senate: { PA: true, OH: true },
  governor: { PA: true },
  house: { 'PA-1': true },
  leg: { PA: true },
  presidential: { PA: true, VT: true },
};

// 1. Presidential support normal in PA & VT
const paSupp = Engine.supportByState(validGame, Data.STATES.find((s) => s.id === 'PA'));
assert((paSupp.socialist || 0) > 0.0, `Socialist has positive presidential support in PA with access (actual: ${paSupp.socialist}%)`);

// 2. Race poll positive
const validPollGame = { ...validGame, treasury: 50.0, player: { ...validGame.player, baseTemplateId: 'socialist', custom: false } };
const validPollRes = Engine.commissionRacePoll(validPollGame, { raceKey: 'senate:PA', stateId: 'PA', office: 'senate' });
const validPoll = (validPollRes.commissionedPolls || []).find((p) => p.raceKey === 'senate:PA') || validPollRes.commissionedPolls?.['senate:PA'];
assert((validPoll.playerShare || 0) > 0.0, `Socialist playerShare > 0.0 with valid access (actual: ${validPoll.playerShare}%)`);

// 3. State leg slate share positive with access
validGame.contestedStateLegSlates = { PA: true };
const validCounts = Engine.reallocateStateHouseSeatCounts(null, null, null, validGame);
assert((validCounts.PA.slateShares?.socialist || 0) > 0.0, `Socialist state leg slate share > 0.0% with valid access (actual: ${validCounts.PA.slateShares?.socialist}%)`);

// 4. Major parties always have access
assert(Engine.hasBallotAccess(baseGame, 'people', 'senate:WY') === true, 'Democratic party has access in WY');
assert(Engine.hasBallotAccess(baseGame, 'heritage', 'senate:CA') === true, 'Republican party has access in CA');

console.log(`\n====================================================================`);
console.log(` REQ-258 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log(`====================================================================\n`);
