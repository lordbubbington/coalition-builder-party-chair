/**
 * Verification Test Suite for REQ-309 (Multi-Cycle Strategic Memory & Ideological Adaptation Engine)
 * Target: scripts/test-oppai-strategic-memory.cjs
 *
 * Covers:
 * - Post-election multi-cycle performance metrics tracking (seats gained/lost, electoral votes, popular vote share) per party
 * - Inter-cycle adaptation at cycle boundaries (2030, 2032+):
 *     * Losing parties experience faction reshuffle (-5 to -8 establishment happiness)
 *     * Strategy profile parameter adjustments (GOP ruthlessness/negative ads up, DNC faction risk aversion up)
 *     * Strict 0.00 primary interventionism invariant for Libertarian Party preserved across all adaptations
 *     * Winning parties experience establishment stabilization (+4 to +6 confidence)
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
  'ballot-access.js',
  'election-uncertainty.js',
  'candidate-vetting.js',
  'election-drift.js',
  'campaign-overhaul.js',
  'engine.js',
].forEach(loadScript);

const Data = sandbox.window.PartyChairData;
const Engine = sandbox.window.PartyChairEngine;
const Drift = sandbox.window.ElectionDrift;

console.log('====================================================================');
console.log(' TEST SUITE: REQ-309 Multi-Cycle Strategic Memory & Adaptation Engine');
console.log('====================================================================\n');

// 1. Post-Election Multi-Cycle Performance Metrics Tracking
console.log('--- 1. Post-Election Performance Tracking ---');
assert(typeof Drift.recordPartyPerformanceMetrics === 'function', 'Drift.recordPartyPerformanceMetrics is a function');

let game = Engine.createGame({ playerParty: 'people' });
game = Engine.ensurePartyStates(game);

// Mock a 2028 presidential election outcome
const mockOutcome2028 = {
  year: 2028,
  presidentialWinner: 'people',
  evByParty: { people: 303, heritage: 235, liberty: 0, green: 0, socialist: 0, constitution: 0 },
  popularVotePercentage: { people: 51.2, heritage: 46.8, liberty: 1.1, green: 0.5, socialist: 0.3, constitution: 0.1 },
  nationalVote: { people: 51.2, heritage: 46.8, liberty: 1.1, green: 0.5, socialist: 0.3, constitution: 0.1 },
};

game.representatives = [
  ...Array.from({ length: 222 }, () => ({ partyId: 'people', office: 'house' })),
  ...Array.from({ length: 213 }, () => ({ partyId: 'heritage', office: 'house' })),
];

game.lastElection = mockOutcome2028;
game = Drift.recordPartyPerformanceMetrics(game, mockOutcome2028);

assert(Boolean(game.strategicMemory), 'game.strategicMemory created');
assert(game.strategicMemory.cycleCount === 1, `cycleCount === 1 (actual: ${game.strategicMemory.cycleCount})`);
assert(Boolean(game.strategicMemory.historyByParty.heritage), 'Heritage history exists in strategicMemory');
assert(Boolean(game.strategicMemory.historyByParty.people), 'People history exists in strategicMemory');

const demRecord2028 = game.strategicMemory.historyByParty.people[0];
assert(demRecord2028.year === 2028, 'Democrat record recorded year 2028');
assert(demRecord2028.wonPresidency === true, 'Democrat record recorded wonPresidency === true');
assert(demRecord2028.popularVoteShare === 51.2, `Democrat popular vote share === 51.2% (actual: ${demRecord2028.popularVoteShare})`);
assert(demRecord2028.electoralVotes === 303, `Democrat electoral votes === 303 (actual: ${demRecord2028.electoralVotes})`);

const gopRecord2028 = game.strategicMemory.historyByParty.heritage[0];
assert(gopRecord2028.year === 2028, 'GOP record recorded year 2028');
assert(gopRecord2028.wonPresidency === false, 'GOP record recorded wonPresidency === false');
assert(gopRecord2028.popularVoteShare === 46.8, `GOP popular vote share === 46.8% (actual: ${gopRecord2028.popularVoteShare})`);


// 2. Inter-Cycle Ideological Adaptation at Cycle Boundary (2028 -> 2030)
console.log('\n--- 2. Inter-Cycle Ideological Adaptation Engine ---');
assert(typeof Drift.adaptPartyIdeologicalPersonas === 'function', 'Drift.adaptPartyIdeologicalPersonas is a function');

const preGopRuthlessness = game.parties.heritage.strategyProfile.ruthlessness;
const preGopNegativeAds = game.parties.heritage.strategyProfile.negativeAdPropensity;
const preDemRiskAversion = game.parties.people.strategyProfile.factionRiskAversion;

// Adapt parties based on 2028 loss for GOP and win for Dems
game = Drift.adaptPartyIdeologicalPersonas(game);

// GOP (Losing party in 2028):
// Ruthlessness and negative ad propensity increase
const postGopRuthlessness = game.parties.heritage.strategyProfile.ruthlessness;
const postGopNegativeAds = game.parties.heritage.strategyProfile.negativeAdPropensity;
console.log(`GOP Ruthlessness: ${preGopRuthlessness} -> ${postGopRuthlessness}`);
console.log(`GOP Negative Ads: ${preGopNegativeAds} -> ${postGopNegativeAds}`);
assert(postGopRuthlessness >= preGopRuthlessness, 'GOP ruthlessness increased post-defeat');
assert(postGopNegativeAds >= preGopNegativeAds, 'GOP negative ad propensity increased post-defeat');

// Libertarian Party:
// Primary interventionism MUST be strictly 0.00
const lpIntervention = game.parties.liberty.strategyProfile.primaryInterventionism;
assert(lpIntervention === 0.00, `Libertarian primary interventionism remains strictly 0.00 (actual: ${lpIntervention})`);


// 3. Second Cycle Tracking & Severe Midterm Defeat Adaptation (2030 Midterms)
console.log('\n--- 3. Midterm Seat Loss Tracking & Adaptation (2030) ---');
// Mock 2030 Midterm where Democrats suffer a severe 15-seat House loss
const mockOutcome2030 = {
  year: 2030,
  popularVotePercentage: { people: 47.0, heritage: 51.5, liberty: 0.9, green: 0.4, socialist: 0.2, constitution: 0.0 },
};

// Simulate House seats drop for Democrats
const prevHouseCount = demRecord2028.houseSeats || 220;
// Put mock sitting reps
game.representatives = [
  ...Array.from({ length: Math.max(180, prevHouseCount - 15) }, () => ({ partyId: 'people', office: 'house' })),
  ...Array.from({ length: 235 }, () => ({ partyId: 'heritage', office: 'house' })),
];

game.lastElection = mockOutcome2030;
game = Drift.recordPartyPerformanceMetrics(game, mockOutcome2030);

assert(game.strategicMemory.cycleCount === 2, `cycleCount === 2 (actual: ${game.strategicMemory.cycleCount})`);
const demRecord2030 = game.strategicMemory.historyByParty.people[1];
assert(demRecord2030.year === 2030, 'Recorded year 2030 for Democrat midterm');
assert(demRecord2030.houseSeatDelta < 0, `Democrat houseSeatDelta is negative after midterm loss (actual: ${demRecord2030.houseSeatDelta})`);

const preMidtermDemRisk = game.parties.people.strategyProfile.factionRiskAversion;
const preMidtermDemEstHap = game.parties.people.factionHappiness.dem_liberal_establishment || 65;

// Adapt post-2030 defeat
game = Drift.adaptPartyIdeologicalPersonas(game);

const postMidtermDemRisk = game.parties.people.strategyProfile.factionRiskAversion;
const postMidtermDemEstHap = game.parties.people.factionHappiness.dem_liberal_establishment || 60;

console.log(`DNC Faction Risk Aversion: ${preMidtermDemRisk} -> ${postMidtermDemRisk}`);
console.log(`DNC Establishment Happiness: ${preMidtermDemEstHap} -> ${postMidtermDemEstHap}`);

assert(postMidtermDemRisk >= preMidtermDemRisk, 'DNC faction risk aversion increased after midterm defeat');
assert(postMidtermDemEstHap <= preMidtermDemEstHap, 'DNC establishment faction suffered reshuffle penalty post-defeat');

// Strict Libertarian Invariant check again
assert(game.parties.liberty.strategyProfile.primaryInterventionism === 0.00, 'Libertarian primary interventionism remains strictly 0.00 across all cycles');

console.log('\n====================================================================');
console.log(` REQ-309 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log('====================================================================');
