// scripts/test-demographics-migration-cohorts.cjs
// Verification test for Developer 5: Generational Cohorts, 100 Migration Patterns & Demographics

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

console.log('--- STARTING DEMOGRAPHICS, MIGRATION & COHORTS TEST SUITE ---');

// 1. Verify 100 Migration Patterns Catalog
const migData = require('../demographic-migration-data.js');
assert(migData.MIGRATION_PATTERNS && Array.isArray(migData.MIGRATION_PATTERNS), 'MIGRATION_PATTERNS array must exist');
assert.strictEqual(migData.MIGRATION_PATTERNS.length, 100, `Must contain exactly 100 migration patterns, found ${migData.MIGRATION_PATTERNS.length}`);

// Verify all 5 trends are represented
const trends = new Set(migData.MIGRATION_PATTERNS.map((p) => p.trend));
console.log('Migration trends present:', Array.from(trends));
assert(trends.has('Sun Belt Boom Vectors'), 'Must include Sun Belt Boom Vectors');
assert(trends.has('Rust Belt & Heartland Outmigration'), 'Must include Rust Belt & Heartland Outmigration');
assert(trends.has('Mountain West Growth Corridors'), 'Must include Mountain West Growth Corridors');
assert(trends.has('Climate & Cost-of-Living Dispersion'), 'Must include Climate & Cost-of-Living Dispersion');
assert(trends.has('Reverse Great Migration & Urban Renaissance'), 'Must include Reverse Great Migration & Urban Renaissance');

// Verify pattern structures
migData.MIGRATION_PATTERNS.forEach((p, idx) => {
  assert(p.id, `Pattern ${idx} missing id`);
  assert(p.name, `Pattern ${idx} missing name`);
  assert(Array.isArray(p.originStates) && p.originStates.length > 0, `Pattern ${p.id} missing originStates`);
  assert(Array.isArray(p.destStates) && p.destStates.length > 0, `Pattern ${p.id} missing destStates`);
  assert(typeof p.voterVolume === 'number' && p.voterVolume >= 10000, `Pattern ${p.id} invalid voterVolume: ${p.voterVolume}`);
  assert(p.ideologicalSkew && typeof p.ideologicalSkew.econDelta === 'number', `Pattern ${p.id} invalid ideologicalSkew`);
});
console.log('[PASS] Chunk 5.1: 100 Semi-Plausible Interstate Migration Patterns fully verified');

// 2. Generational Cohorts Structure
const cohorts = migData.GENERATIONAL_COHORTS;
assert(cohorts.silent_boomers, 'silent_boomers cohort must exist');
assert(cohorts.boomers_genx, 'boomers_genx cohort must exist');
assert(cohorts.genx_millennials, 'genx_millennials cohort must exist');
assert(cohorts.gen_z, 'gen_z cohort must exist');
assert(cohorts.gen_alpha, 'gen_alpha cohort must exist');
assert.strictEqual(cohorts.gen_alpha.entryYear, 2030, 'Gen Alpha enters at 2030');
console.log('[PASS] Chunk 5.3 Catalog: Generational cohorts definitions verified');

// 3. Setup sandbox environment with full game scripts
const domContext = {
  window: {},
  document: {
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {} }),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
  },
  console,
  setTimeout: () => {},
  clearTimeout: () => {},
  Math,
  Date,
  JSON,
  Array,
  Object,
  Set,
  Map,
  Number,
  String,
  Boolean,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
};
domContext.window = domContext;
domContext.global = domContext;

function loadScript(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, domContext, { filename: filePath });
}

loadScript('data.js');
loadScript('issues-0.2.1.js');
loadScript('factions-0.15.js');
loadScript('scenario-2028.js');
loadScript('state-house-data-0.5.js');
loadScript('voter-model-0.5.js');
loadScript('demographic-migration-data.js');
loadScript('demographics-0.9.js');
loadScript('v07-scaffolding.js');
loadScript('party-systems-data.js');
loadScript('party-systems-coalition.js');
loadScript('party-systems-robots.js');
loadScript('party-systems-engine.js');
loadScript('ballot-access.js');
loadScript('election-uncertainty.js');
loadScript('candidate-vetting.js');
loadScript('election-drift.js');
loadScript('election-night-engine.js');
loadScript('campaign-overhaul.js');
loadScript('redistricting-ballot-system.js');
loadScript('engine.js');

const Engine = domContext.PartyChairEngine;
const Data = domContext.PartyChairData;

assert(Engine && typeof Engine.createGame === 'function', 'PartyChairEngine must load cleanly');
console.log('[PASS] Game modules loaded into test sandbox successfully');

// 4. Test deterministic pattern selection (3-6 patterns)
const sel1 = Data.selectDeterministicMigrationPatterns(2028, 2030, 0, null);
assert(sel1.length >= 3 && sel1.length <= 6, `Selected patterns must be between 3 and 6, got ${sel1.length}`);
const sel2 = Data.selectDeterministicMigrationPatterns(2028, 2030, 0, null);
assert.strictEqual(sel1.map(p => p.id).join(','), sel2.map(p => p.id).join(','), 'Pattern selection must be deterministic for identical seed and year');
console.log(`[PASS] Deterministic pattern selection: selected ${sel1.length} patterns consistently`);

// 5. Test Zero-Variance Migration & Generational Turnover
const testVm = JSON.parse(JSON.stringify(Data.VERSION_05_VOTER_MODEL));
const initialTotal = testVm.states.reduce((s, st) => s + Number(st.representedVoters || 0), 0);
assert.strictEqual(initialTotal, 155000000, `Initial electorate must equal 155,000,000, got ${initialTotal}`);

const migResult = Data.applyInterstateMigration(testVm, sel1);
assert(migResult.transferredTotal > 0, 'Migration must transfer voters');
const postMigTotal = testVm.states.reduce((s, st) => s + Number(st.representedVoters || 0), 0);
assert.strictEqual(postMigTotal, 155000000, `Post-migration electorate must strictly conserve 155,000,000 (0 variance), got ${postMigTotal}`);

Data.applyGenerationalTurnover(testVm, 2032);
const postTurnoverTotal = testVm.states.reduce((s, st) => s + Number(st.representedVoters || 0), 0);
assert.strictEqual(postTurnoverTotal, 155000000, `Post-turnover electorate must strictly conserve 155,000,000 (0 variance), got ${postTurnoverTotal}`);
console.log('[PASS] Chunk 5.2 & 5.3: Exact 155M zero-variance conservation verified for migration & cohort turnover');

// 6. Test Multi-Decade Organic Population Growth & Apportionment Divergence (2028 -> 2060, 16 cycles / 32 years)
let game = Engine.createGame({ baseTemplateId: 'people' });
assert.strictEqual(game.year, 2028);

console.log('Running multi-decade cycle progression from 2028 to 2060...');
const initialTxVoters = game.voterModel.states.find(s => (s.stateId || s.id) === 'TX').representedVoters;
const initialNyVoters = game.voterModel.states.find(s => (s.stateId || s.id) === 'NY').representedVoters;

for (let yr = 2028; yr < 2060; yr += 2) {
  // Advance cycle
  game.phase = 'complete';
  game = Engine.startNextCycle(game);
  
  // Verify 155M conservation at EVERY single cycle boundary
  const currentTotalVoters = game.voterModel.states.reduce((s, st) => s + Number(st.representedVoters || 0), 0);
  assert.strictEqual(currentTotalVoters, 155000000, `Year ${game.year} electorate must be strictly 155,000,000, got ${currentTotalVoters}`);
  
  // Verify active migration patterns recorded in game state
  assert(game.activeMigrationPatterns && game.activeMigrationPatterns.length >= 3, `Year ${game.year} must have activeMigrationPatterns`);
  assert(game.migrationHistory && game.migrationHistory[game.year], `Year ${game.year} must have entry in migrationHistory`);
}

const finalTxVoters = game.voterModel.states.find(s => (s.stateId || s.id) === 'TX').representedVoters;
const finalNyVoters = game.voterModel.states.find(s => (s.stateId || s.id) === 'NY').representedVoters;

console.log(`2028 TX voters: ${initialTxVoters.toLocaleString()} -> 2060 TX voters: ${finalTxVoters.toLocaleString()} (Net: ${(finalTxVoters - initialTxVoters).toLocaleString()})`);
console.log(`2028 NY voters: ${initialNyVoters.toLocaleString()} -> 2060 NY voters: ${finalNyVoters.toLocaleString()} (Net: ${(finalNyVoters - initialNyVoters).toLocaleString()})`);

assert(finalTxVoters > initialTxVoters, 'Texas should organically expand in represented voters by 2060 via Sun Belt migration');
assert(finalNyVoters < initialNyVoters, 'New York should organically contract in represented voters by 2060 via outmigration');

// Test Apportionment Divergence with 2060 decennial redistricting
const pops2030 = Data.getDecennialStatePopulations(2030, game.voterModel);
const pops2060 = Data.getDecennialStatePopulations(2060, game.voterModel);
const seats2030 = Data.apportionHuntingtonHill(pops2030, 435);
const seats2060 = Data.apportionHuntingtonHill(pops2060, 435);

console.log(`2030 vs 2060 House Seats: TX ${seats2030.TX} -> ${seats2060.TX}, NY ${seats2030.NY} -> ${seats2060.NY}, FL ${seats2030.FL} -> ${seats2060.FL}, CA ${seats2030.CA} -> ${seats2060.CA}`);

assert(seats2060.TX >= seats2030.TX, 'Texas should gain or maintain House seats by 2060');
assert(seats2060.NY <= seats2030.NY, 'New York should lose or maintain House seats by 2060');
assert.strictEqual(Object.values(seats2060).reduce((a, b) => a + b, 0), 435, 'Total apportioned House seats must equal exactly 435');

console.log('[PASS] Chunk 5.4: Multi-decade organic population growth and 2060 electoral map divergence verified');

console.log('--- ALL DEVELOPER 5 DEMOGRAPHIC TESTS PASSED SUCCESSFULLY! ---');
