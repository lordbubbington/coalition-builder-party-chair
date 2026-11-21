/**
 * scripts/test-v0170-power-size-attrition.cjs
 * Verification test suite for REQ-296: Faction Power vs. Size Attrition Mechanics
 */

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {}, console, Math, Date, JSON, Number, String, Boolean, Array, Object, Set, Map, RegExp, Error, Promise,
    Uint8Array, atob: (s) => Buffer.from(s, 'base64').toString('binary'), btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob, DecompressionStream, Response, setTimeout, clearTimeout, setInterval, clearInterval,
    localStorage: { getItem: (k) => storage[k] ?? null, setItem: (k, v) => { storage[k] = String(v); }, removeItem: (k) => { delete storage[k]; } },
  });
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  const scripts = [
    'data.js','factions-0.15.js','scenario-2028.js','issues-0.2.1.js','maps-0.3.js',
    'state-house-data-0.5.js','voter-model-0.5.js','demographics-0.9.js','political-trends-system.js',
    'v07-scaffolding.js','party-systems-data.js','party-systems-coalition.js','party-systems-robots.js',
    'party-systems-engine.js','party-systems-ui.js','presidential-primaries.js','ballot-access.js',
    'election-uncertainty.js','candidate-vetting.js','election-drift.js','election-night-engine.js','engine.js',
  ];
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

console.log('====================================================================');
console.log(' VERSION 0.17.0 REQ-296 FACTION POWER VS SIZE ATTRITION SUITE');
console.log('====================================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

const ctx = boot();
const E = ctx.window.PartyChairEngine;
const D = ctx.window.PartyChairData;

// --- CHECK 1: 5-Level Officeholder Audit Weight Integrity ---
console.log('--- CHECK 1: 5-Level Officeholder Audit & Weight Integrity ---');

test('Officeholder audit tracks House, Senate, Governor, Statewide Executives, and State Leg', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const audit = E.auditFactionOfficeholderPower(g, 'people');

  assert(audit.totalOfficePower > 0, 'Total office power should be positive');
  assert(audit.totalPartyVoters > 0, 'Total party voters should be positive');

  const records = Object.values(audit.auditRecords);
  assert(records.length === 8, `Expected 8 Dem factions, got ${records.length}`);

  let totalHouse = 0, totalSenate = 0, totalGov = 0, totalStatewide = 0;
  records.forEach((r) => {
    totalHouse += r.officeholderCounts.house;
    totalSenate += r.officeholderCounts.senate;
    totalGov += r.officeholderCounts.governor;
    totalStatewide += r.officeholderCounts.statewide;
  });

  assert(totalHouse > 0, `House count should be positive (got ${totalHouse})`);
  assert(totalSenate > 0, `Senate count should be positive (got ${totalSenate})`);
  assert(totalGov > 0, `Governor count should be positive (got ${totalGov})`);
  assert(totalStatewide > 0, `Statewide executive count should be positive (got ${totalStatewide})`);
});

test('Statewide executives receive exact 1/5th gubernatorial weight (0.20 vs 1.00)', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  
  // Create synthetic faction members: 1 governor vs 1 statewide executive
  const testSitting = [
    { id: 'gov-1', party: 'people', branch: 'governor', factionId: 'dem_liberal_establishment' },
    { id: 'seo-1', party: 'people', branch: 'statewide_executive', factionId: 'dem_capital_l_left' },
  ];
  const testG = { ...g, sittingMembers: testSitting, stateLegislatures: {} };
  const audit = E.auditFactionOfficeholderPower(testG, 'people');

  const govPower = audit.auditRecords.dem_liberal_establishment.officePower;
  const seoPower = audit.auditRecords.dem_capital_l_left.officePower;

  assert.strictEqual(govPower, 1.0, `Governor power should be 1.0, got ${govPower}`);
  assert.strictEqual(seoPower, 0.2, `Statewide executive power should be 0.20 (1/5th), got ${seoPower}`);
});

// --- CHECK 2: Expected vs Actual Power Shares & Gap Classification ---
console.log('\n--- CHECK 2: Expected vs Actual Power Shares & Gap Classification ---');

test('Power gap correctly identifies under-represented and over-represented factions', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const audit = E.auditFactionOfficeholderPower(g, 'people');
  const records = Object.values(audit.auditRecords);

  records.forEach((r) => {
    assert(r.expectedPowerShare > 0, `${r.fid} expected share must be positive`);
    assert(r.actualPowerShare >= 0, `${r.fid} actual share must be non-negative`);
    assert.strictEqual(Math.round((r.actualPowerShare - r.expectedPowerShare) * 10000) / 10000, r.powerGap, 'powerGap matches actual - expected');
    if (r.powerGap < -0.05) assert.strictEqual(r.status, 'under_represented');
    else if (r.powerGap > 0.05) assert.strictEqual(r.status, 'over_represented');
    else assert.strictEqual(r.status, 'balanced');
  });
});

// --- CHECK 3: Bounded Monotone Attrition ---
console.log('\n--- CHECK 3: Bounded Monotone Attrition ---');

test('Under-represented factions suffer bounded member attrition toward re-balance', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  
  // Set up an artificially under-represented faction with large voter base but 0 officeholders
  const testSitting = g.sittingMembers.filter((m) => m.factionId !== 'dem_bernie_bros');
  const testG = { ...g, sittingMembers: testSitting };

  const beforeVoters = testG.voterModel.factions.dem_bernie_bros;
  const afterG = E.applyFactionPowerAttrition(testG, 'people');
  const afterVoters = afterG.voterModel.factions.dem_bernie_bros;

  assert(afterVoters < beforeVoters, `Under-represented faction must lose voters (got ${afterVoters} vs ${beforeVoters})`);
  const lost = beforeVoters - afterVoters;
  assert(lost >= 500 && lost <= 25000, `Attrition must be bounded [500, 25000] (got ${lost})`);
});

// --- CHECK 4: Zero-Variance 155,000,000 Conservation (Rule 1) ---
console.log('\n--- CHECK 4: Zero-Variance 155M Conservation ---');

test('155,000,000 voter scale conserved bit-for-bit after multi-cycle attrition', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  
  for (let cycle = 0; cycle < 5; cycle++) {
    g = E.applyFactionPowerAttrition(g, 'people');
    g = E.applyFactionPowerAttrition(g, 'heritage');
  }

  // 1. National factions sum
  const natSum = Object.values(g.voterModel.factions).reduce((a, b) => a + b, 0);
  assert.strictEqual(natSum, 155000000, `National factions must sum to 155,000,000 (got ${natSum})`);

  // 2. Per-state zero variance across all 51 jurisdictions
  assert.strictEqual(g.voterModel.states.length, 51, 'Must have 51 jurisdictions');
  let stateFactionsTotal = 0;
  g.voterModel.states.forEach((st) => {
    const stSum = Object.values(st.factions).reduce((a, b) => a + b, 0);
    stateFactionsTotal += stSum;
    // Check affiliations zero variance
    const primaryBuckets = (st.affiliations.people || 0) + (st.affiliations.heritage || 0) + (st.affiliations.independent || 0) + (st.affiliations.thirdParty || 0);
    assert.strictEqual(primaryBuckets, st.sampleVoters, `State ${st.stateId} affiliations sum must equal sampleVoters`);
  });

  assert.strictEqual(stateFactionsTotal, 155000000, `All state factions must sum to 155,000,000 (got ${stateFactionsTotal})`);
});

// --- CHECK 5: Qualitative Narrative Copy (Rule 7 & Rule 4) ---
console.log('\n--- CHECK 5: Qualitative Narrative Copy ---');

test('Faction power narrative provides qualitative cable-news copy with zero math or REQ leaks', () => {
  const underNarr = E.getFactionPowerNarrative({ status: 'under_represented' });
  const overNarr = E.getFactionPowerNarrative({ status: 'over_represented' });
  const balNarr = E.getFactionPowerNarrative({ status: 'balanced' });

  assert(underNarr.includes('Restless in the ranks'), 'Under-represented narrative');
  assert(overNarr.includes('Entrenched leadership'), 'Over-represented narrative');
  assert(balNarr.includes('Balanced caucus'), 'Balanced narrative');

  [underNarr, overNarr, balNarr].forEach((n) => {
    assert(!/REQ|\d+%|\d+\.\d+|\b[0-9]+\b/.test(n), `Narrative "${n}" must not leak numbers or REQ IDs`);
  });
});

console.log(`\n====================================================================`);
console.log(` REQ-296 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log(`====================================================================`);

if (failed > 0) process.exit(1);
