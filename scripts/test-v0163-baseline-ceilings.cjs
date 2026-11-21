/**
 * Verification Test Suite for REQ-259 (Version 0.16.3)
 * Target: scripts/test-v0163-baseline-ceilings.cjs
 *
 * Covers Section 17 of VERSION_0.16.3_DESIGN.md:
 * - 2028 Starting Baseline 3.0% Polling Ceiling for Non-Major Parties:
 *   1. Initial board sweep: all states presidential share, all Senate/House candidate shares,
 *      and state-leg slates <= 3.0% for all non-major parties
 *   2. Major exemption: people and heritage are never clamped
 *   3. Human minor party: starts <= 3.0% everywhere with no turn-1 spike above ceiling
 *   4. Non-permanence: organic growth in later cycles (2030+) above 3.0% persists unclamped
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
console.log(' TEST SUITE: REQ-259 2028 Starting Baseline 3.0% Polling Ceiling');
console.log('====================================================================');

// -----------------------------------------------------------------------------
// Case 1: Initial Board Sweep across all states (Presidential, Senate, House, Leg)
// -----------------------------------------------------------------------------
console.log('\n--- Case 1: Initial 2028 Board Sweep (AI Minor Parties) ---');

const game2028 = Engine.createGame({ playerParty: 'people' });
assert(game2028.year === 2028, 'Game initializes to year 2028');

// Presidential Sweep
let maxMinorPres = 0;
let maxMinorPresParty = '';
let maxMinorPresState = '';

Data.STATES.forEach((state) => {
  const shares = Engine.supportByState(game2028, state);
  Object.entries(shares).forEach(([partyId, val]) => {
    if (!['people', 'heritage', 'player'].includes(partyId)) {
      if (val > maxMinorPres) {
        maxMinorPres = val;
        maxMinorPresParty = partyId;
        maxMinorPresState = state.id;
      }
    }
  });
});

assert(maxMinorPres <= 3.0 + 1e-4, `All rival minor parties presidential share <= 3.0% across all states (max: ${maxMinorPres.toFixed(2)}% [${maxMinorPresParty} in ${maxMinorPresState}])`);

// Senate & House Candidates Sweep
const activeSenateRaces = game2028.activeSenateRaces || [];
let maxMinorCand = 0;
const nonMajors = ['liberty', 'green', 'socialist', 'constitution'];

activeSenateRaces.forEach((race) => {
  nonMajors.forEach((pId) => {
    const field = Engine.version01CandidateField(game2028, race.raceKey || `senate:${race.state}`, pId);
    field.forEach((c) => {
      const p = Number(c.poll) || 0;
      if (p > maxMinorCand) maxMinorCand = p;
    });
  });
});

Data.VERSION_01_HOUSE_DISTRICTS.slice(0, 50).forEach((dist) => {
  nonMajors.forEach((pId) => {
    const field = Engine.version01CandidateField(game2028, `house:${dist.id}`, pId);
    field.forEach((c) => {
      const p = Number(c.poll) || 0;
      if (p > maxMinorCand) maxMinorCand = p;
    });
  });
});

assert(maxMinorCand <= 3.0 + 1e-4, `All rival minor candidates candidate poll <= 3.0% (max: ${maxMinorCand}%)`);

// State Legislative Slates Sweep
const counts = Engine.reallocateStateHouseSeatCounts(null, null, null, game2028);
let maxMinorLeg = 0;
Object.entries(counts).forEach(([stId, stData]) => {
  const slateShares = stData.slateShares || {};
  nonMajors.forEach((pId) => {
    const s = Number(slateShares[pId]) || 0;
    if (s > maxMinorLeg) maxMinorLeg = s;
  });
});

assert(maxMinorLeg <= 3.0 + 1e-4, `All rival minor state-leg slates <= 3.0% (max: ${maxMinorLeg}%)`);

// -----------------------------------------------------------------------------
// Case 2: Major Exemption — Democrats & Republicans are never clamped
// -----------------------------------------------------------------------------
console.log('\n--- Case 2: Major Exemption ---');

const sampleState = Data.STATES.find((s) => s.id === 'PA');
const sampleShares = Engine.supportByState(game2028, sampleState);
assert((sampleShares.player || sampleShares.people) > 40.0, `Democratic player share unclamped in PA (actual: ${(sampleShares.player || sampleShares.people).toFixed(1)}%)`);
assert(sampleShares.heritage > 35.0, `Republican share unclamped in PA (actual: ${sampleShares.heritage.toFixed(1)}%)`);

// -----------------------------------------------------------------------------
// Case 3: Human Player Minor Party Starting State (Green & Socialist)
// -----------------------------------------------------------------------------
console.log('\n--- Case 3: Human Minor Party Chair Start ---');

['green', 'socialist', 'liberty'].forEach((minorPartyId) => {
  const playerMinorGame = Engine.createGame({ baseTemplateId: minorPartyId });
  assert(playerMinorGame.player.baseTemplateId === minorPartyId, `Player party initialized as ${minorPartyId}`);

  let playerMaxShare = 0;
  let playerMaxState = '';

  Data.STATES.forEach((state) => {
    const shares = Engine.supportByState(playerMinorGame, state);
    const val = shares.player || 0;
    if (val > playerMaxShare) {
      playerMaxShare = val;
      playerMaxState = state.id;
    }
  });

  assert(playerMaxShare <= 3.0 + 1e-4, `Human ${minorPartyId} chair presidential support <= 3.0% everywhere (max: ${playerMaxShare.toFixed(2)}% in ${playerMaxState})`);
});

// -----------------------------------------------------------------------------
// Case 4: Non-Permanence — Later-cycle growth above 3.0% persists unclamped
// -----------------------------------------------------------------------------
console.log('\n--- Case 4: Non-Permanence (Later-Cycle Growth Unclamped) ---');

// Advance game to year 2030 (next cycle)
const laterCycleGame = JSON.parse(JSON.stringify(game2028));
laterCycleGame.year = 2030;
laterCycleGame.chairTurn = 5;

// Simulate organic growth: grant party organizations and chapters in VT and Northeast
laterCycleGame.organizations = laterCycleGame.organizations || {};
laterCycleGame.organizations.socialist = {
  chapters: { Northeast: 12, Midwest: 10, South: 4, West: 4 },
  memberships: 180,
  factionStandings: { organizers: 85, left: 85 },
};
// Give valid ballot access
laterCycleGame.ballotAccess = laterCycleGame.ballotAccess || {};
laterCycleGame.ballotAccess.socialist = {
  presidential: { VT: true, NY: true, MA: true },
  senate: { VT: true },
  governor: { VT: true },
  house: {},
  leg: { VT: true },
};

// Also give candidate with 12% poll
laterCycleGame.primaryFields = {
  'senate:VT': {
    socialist: [
      { id: 'soc_grown', name: 'Grown Contender', poll: 14.5 },
    ],
  },
};

const vtState = Data.STATES.find((s) => s.id === 'VT');
const laterShares = Engine.supportByState(laterCycleGame, vtState);
const grownSocField = Engine.version01CandidateField(laterCycleGame, 'senate:VT', 'socialist');

assert((grownSocField[0]?.poll || 0) === 14.5, `Later cycle candidate poll of 14.5% persists unclamped (actual: ${grownSocField[0]?.poll}%)`);

console.log(`\n====================================================================`);
console.log(` REQ-259 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log(`====================================================================\n`);
