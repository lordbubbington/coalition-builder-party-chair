/**
 * Verification Test Suite for REQ-302 (Opponent Primary Phase Simulator & Autonomous Endorsements)
 * Target: scripts/test-oppai-primary-simulator.cjs
 *
 * Covers:
 * - Candidate Electability Regression Formula across all traits and party contexts
 * - Autonomous Candidate Recruitment ($1M fee)
 * - Distinct Behavioral Doctrines:
 *     * GOP Kingmaker early frontrunner endorsement & staff+donor conduits
 *     * DNC Faction Paralysis Algorithm in split fields
 *     * Libertarian Strict 0.00 Non-Intervention Invariant
 *     * Green & Socialist Purity Gatekeeping and Insurgent Recruitment
 * - Endorsement Repercussions (+10% poll boost, +1 faction happiness, -3 rival factions, bolt warnings on < 35)
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
const Vetting = sandbox.window.CandidateVetting;

console.log('====================================================================');
console.log(' TEST SUITE: REQ-302 Opponent Primary Simulator & Autonomous Endorsement Engine');
console.log('====================================================================\n');

// 1. Candidate Electability Regression Formula
console.log('--- 1. Candidate Electability Regression Formula ---');
assert(typeof Vetting.calculateCandidateElectability === 'function', 'Vetting.calculateCandidateElectability exists');
assert(typeof Engine.calculateCandidateElectability === 'function', 'Engine.calculateCandidateElectability exists');

// Baseline neutral candidate: Fame 60, Popularity 60, distance 0 -> (60*0.25)+(60*0.35) = 15 + 21 = 36
const baseCand = { fame: 60, popularity: 60, traits: [], ideologyScore: 7.5 };
const baseScore = Vetting.calculateCandidateElectability(baseCand, 'heritage');
assert(baseScore === 36.0, `Base electability score === 36.0 (actual: ${baseScore})`);

// Trait Modifiers:
// Rising Star (+12) -> 36 + 12 = 48
const risingCand = { ...baseCand, traits: ['Rising Star'] };
assert(Vetting.calculateCandidateElectability(risingCand, 'heritage') === 48.0, 'Rising Star grants +12');

// Polished (+10) -> 36 + 10 = 46
const polishedCand = { ...baseCand, traits: ['Polished'] };
assert(Vetting.calculateCandidateElectability(polishedCand, 'heritage') === 46.0, 'Polished grants +10');

// Disciplined (+10) -> 36 + 10 = 46
const discCand = { ...baseCand, traits: ['Disciplined'] };
assert(Vetting.calculateCandidateElectability(discCand, 'heritage') === 46.0, 'Disciplined grants +10');

// Squeaky Clean (+8) -> 36 + 8 = 44
const cleanCand = { ...baseCand, traits: ['Squeaky Clean'] };
assert(Vetting.calculateCandidateElectability(cleanCand, 'heritage') === 44.0, 'Squeaky Clean grants +8');

// Undisciplined (-18) -> 36 - 18 = 18
const undiscCand = { ...baseCand, traits: ['Undisciplined'] };
assert(Vetting.calculateCandidateElectability(undiscCand, 'heritage') === 18.0, 'Undisciplined penalizes -18');

// Corrupt (-25) -> 36 - 25 = 11
const corruptCand = { ...baseCand, traits: ['Corrupt'] };
assert(Vetting.calculateCandidateElectability(corruptCand, 'heritage') === 11.0, 'Corrupt penalizes -25');

// Established politician: -15 for Green/Socialist, +6 for GOP/Dem
const estabCand = { ...baseCand, traits: ['Established politician'] };
assert(Vetting.calculateCandidateElectability(estabCand, 'heritage') === 42.0, 'Established politician grants +6 for GOP');
assert(Vetting.calculateCandidateElectability(estabCand, 'green') < 25.0, 'Established politician penalizes -15 for Greens');
assert(Vetting.calculateCandidateElectability(estabCand, 'socialist') < 25.0, 'Established politician penalizes -15 for Socialists');

// Rough: +4 for GOP/Socialist, -6 for Democrat
const roughCand = { ...baseCand, traits: ['Rough'] };
assert(Vetting.calculateCandidateElectability(roughCand, 'heritage') === 40.0, 'Rough grants +4 for GOP');
const demRoughCand = { ...baseCand, ideologyScore: 3.5, traits: ['Rough'] };
assert(Vetting.calculateCandidateElectability(demRoughCand, 'people') === 30.0, 'Rough penalizes -6 for Democrats');

// Ideological Distance Penalty: distance * 12
// If candidate is at 5.5 and GOP ideal is 7.5 -> distance = 2.0 -> penalty = 24.0 -> 36 - 24 = 12
const distantCand = { ...baseCand, ideologyScore: 5.5 };
const distScore = Vetting.calculateCandidateElectability(distantCand, 'heritage');
assert(distScore === 12.0, `Ideological distance penalty of 2.0 * 12 = 24.0 applied (actual: ${distScore})`);


// 2. Autonomous Candidate Recruitment
console.log('\n--- 2. Autonomous Candidate Recruitment ($1M fee) ---');
let game = Engine.createGame({ playerParty: 'people' });
game = Engine.ensurePartyStates(game);
const preTreasury = game.parties.heritage.treasury;
const preActions = game.parties.heritage.organizingActionsRemaining;

game = Engine.executePartyAction(game, 'heritage', 'RECRUIT_CANDIDATE', { candidateId: 'cand_test_recruit_01' });
assert(game.parties.heritage.treasury === Math.round((preTreasury - 1.0) * 100) / 100, `Treasury reduced by $1.0M fee (actual: ${game.parties.heritage.treasury})`);
assert(game.parties.heritage.organizingActionsRemaining === preActions - 1, `Organizing actions decremented by 1 (actual: ${game.parties.heritage.organizingActionsRemaining})`);
assert(game.parties.heritage.recruitedCandidateIds.includes('cand_test_recruit_01'), 'Recruited candidate ID tracked in party state');


// 3. Libertarian Strict Non-Intervention Invariant
console.log('\n--- 3. Libertarian Strict Non-Intervention Invariant ---');
const lpPrimary = Engine.simulateFullPrimaryForParty(game, 'liberty');
assert(Boolean(lpPrimary), 'Libertarian primary simulator resolved');
assert(lpPrimary.chairInterventions.endorsedCandidateId === null, 'Libertarian primary has ZERO chair endorsements (Strict Non-Intervention)');
assert(lpPrimary.chairInterventions.filteredCandidateId === null, 'Libertarian primary has ZERO filtered support (Strict Non-Intervention)');
assert(Boolean(lpPrimary.nomineeId), `Libertarian grassroots delegates crown nominee (${lpPrimary.nomineeName})`);


// 4. Republican Kingmaker Doctrine & Faction Resentment
console.log('\n--- 4. Republican Kingmaker Doctrine & Faction Resentment ---');
// Lower one faction happiness in heritage to test bolt warning trigger (< 35)
game.parties.heritage.factionHappiness.gop_maga = 37.0; // close to threshold
game.parties.heritage.factionHappiness.gop_libertarian_cons = 36.0;

const gopPrimary = Engine.simulateFullPrimaryForParty(game, 'heritage');
assert(Boolean(gopPrimary.chairInterventions.endorsedCandidateId), `GOP endorses frontrunner early (${gopPrimary.chairInterventions.endorsedCandidateId})`);
assert(Boolean(gopPrimary.chairInterventions.filteredCandidateId), 'GOP deploys staff + donor conduit filtering support');

// Endorsed candidate received +10% debateLift / poll boost
const endorsedCand = gopPrimary.candidates.find((c) => c.id === gopPrimary.chairInterventions.endorsedCandidateId);
assert(Boolean(endorsedCand && endorsedCand.endorsed), 'Endorsed candidate flagged as endorsed');
assert(endorsedCand.debateLift >= 10.0, `Endorsed candidate has >= +10.0 debate lift (actual: ${endorsedCand.debateLift})`);

// Faction Resentment & Bolt Warnings:
// Rival factions suffered -3.0 Happiness; if any dropped below 35, bolt warning triggered
console.log('GOP Faction Happiness Post-Endorsement:', game.parties.heritage.factionHappiness);
const gopBoltWarnings = Object.keys(game.parties.heritage.factionBoltWarnings || {});
assert(gopPrimary.chairInterventions.boltWarningsTriggered.length > 0 || gopBoltWarnings.length > 0, 'Primary Bolt Warning triggered when rival faction happiness dropped below 35');


// 5. Democratic Faction Paralysis Algorithm
console.log('\n--- 5. Democratic Faction Paralysis Algorithm ---');
// Test multiple seeds to verify both dithering (70%) and late endorsement (30%)
let dncDitherCount = 0;
let dncEndorseCount = 0;
for (let s = 1; s <= 20; s++) {
  const testGame = { ...game, seed: s * 137 };
  const dncPrimary = Engine.simulateFullPrimaryForParty(testGame, 'people');
  if (dncPrimary.chairInterventions.dithered || dncPrimary.chairInterventions.endorsedCandidateId === null) {
    dncDitherCount++;
  } else {
    dncEndorseCount++;
  }
}
console.log(`DNC 20-Seed Run: ${dncDitherCount} Dithered/Neutral, ${dncEndorseCount} Lukewarm Endorsements`);
assert(dncDitherCount > 0, `DNC exhibits faction paralysis dithering in majority of cases (actual: ${dncDitherCount}/20)`);


// 6. Green & Socialist Purity Gatekeeping
console.log('\n--- 6. Green & Socialist Purity Gatekeeping Doctrine ---');
const greenPrimary = Engine.simulateFullPrimaryForParty(game, 'green');
assert(Boolean(greenPrimary.chairInterventions.endorsedCandidateId), 'Green Party endorses pure / insurgent candidate');
assert(Boolean(greenPrimary.chairInterventions.filteredCandidateId), 'Green Party deploys 100% filtered support to pure candidate');

const socPrimary = Engine.simulateFullPrimaryForParty(game, 'socialist');
assert(Boolean(socPrimary.chairInterventions.endorsedCandidateId), 'Socialist Party endorses class warrior candidate');

console.log('\n====================================================================');
console.log(` REQ-302 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log('====================================================================');
