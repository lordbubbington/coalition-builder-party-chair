/**
 * scripts/test-v0170-filtering-support.cjs
 * Verification test suite for REQ-288: Modular "Filtering Support" Architecture (Primary Interventions)
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
console.log(' VERSION 0.17.0 REQ-288 FILTERING SUPPORT TEST SUITE');
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
const F = ctx.window.PartyChairFactions;

function createDebateGame() {
  const g = E.createGame({ baseTemplateId: 'people' });
  g.year = 2028;
  g.treasury = 50.0;
  g.actionsLeft = 3;
  g.organizingActionsRemaining = 3;
  g.trust = { supporters: 75, independents: 50, opponents: 15 };
  
  // Start presidential primary and advance past order to debates
  let withPrimary = E.startPresidentialPrimary(g);
  withPrimary = E.advancePrimaryCalendar(withPrimary);
  return withPrimary;
}

// --- CHECK 1: Individual Deployable Assets ---
console.log('--- CHECK 1: Individual Deployable Assets ---');

test('Deploy Political Capital asset (trust deduction, debate & national poll lift)', () => {
  const g = createDebateGame();
  const cands = g.activePresidentialPrimary.candidates;
  assert(cands && cands.length >= 2, 'Must have at least 2 candidates in primary');
  const targetCand = cands[0];
  const initialPoll = targetCand.nationalPoll || 0;
  const initialTrust = g.trust.supporters;

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: false, donorConduits: false }
  });

  const updatedCand = res.activePresidentialPrimary.candidates.find((c) => c.id === targetCand.id);
  assert(updatedCand.debateLift >= 4.0, `Expected debateLift >= 4.0, got ${updatedCand.debateLift}`);
  assert(Math.abs((updatedCand.nationalPoll - initialPoll) - 5.0) <= 0.15, `Expected poll lift ~5.0, got delta ${(updatedCand.nationalPoll - initialPoll).toFixed(2)}`);
  assert.strictEqual(res.trust.supporters, initialTrust - 3, `Expected supporters trust -3, got ${res.trust.supporters}`);
  assert.strictEqual(res.treasury, g.treasury, 'Political capital should not deduct treasury');
});

test('Deploy Staff Support asset (actions deduction, early state lift)', () => {
  const g = createDebateGame();
  const targetCand = g.activePresidentialPrimary.candidates[0];
  const initialActions = g.organizingActionsRemaining ?? g.actionsLeft;

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: false, staffSupport: true, donorConduits: false }
  });

  const updatedCand = res.activePresidentialPrimary.candidates.find((c) => c.id === targetCand.id);
  assert(updatedCand.earlyStateLift >= 3.0, `Expected earlyStateLift >= 3.0, got ${updatedCand.earlyStateLift}`);
  const finalActions = res.organizingActionsRemaining ?? res.actionsLeft;
  assert.strictEqual(finalActions, initialActions - 1, `Expected action deduction 1, got ${finalActions}`);
  assert.strictEqual(res.trust.supporters, g.trust.supporters, 'Staff support should not deduct trust');
});

test('Deploy Donor Conduits asset (treasury deduction, fundraising & poll lift)', () => {
  const g = createDebateGame();
  const targetCand = g.activePresidentialPrimary.candidates[0];
  const initialTreasury = g.treasury;
  const initialPoll = targetCand.nationalPoll || 0;

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: false, staffSupport: false, donorConduits: true }
  });

  const updatedCand = res.activePresidentialPrimary.candidates.find((c) => c.id === targetCand.id);
  assert(updatedCand.fundraisingLift >= 4.0, `Expected fundraisingLift >= 4.0, got ${updatedCand.fundraisingLift}`);
  assert(Math.abs((updatedCand.nationalPoll - initialPoll) - 2.0) <= 0.15, `Expected poll lift ~2.0, got delta ${(updatedCand.nationalPoll - initialPoll).toFixed(2)}`);
  assert.strictEqual(res.treasury, Math.round((initialTreasury - 2.0) * 100) / 100, `Expected treasury -2.0, got ${res.treasury}`);
});

// --- CHECK 2: Asset Composition & Combined Effects ---
console.log('\n--- CHECK 2: Asset Composition & Combined Effects ---');

test('Compose all three assets simultaneously on one candidate', () => {
  const g = createDebateGame();
  const targetCand = g.activePresidentialPrimary.candidates[0];
  const initTreasury = g.treasury;
  const initTrust = g.trust.supporters;
  const initActions = g.actionsLeft;
  const initPoll = targetCand.nationalPoll || 0;

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: true, donorConduits: true }
  });

  const c = res.activePresidentialPrimary.candidates.find((cand) => cand.id === targetCand.id);
  assert(c.debateLift >= 4.0, 'Composite debateLift');
  assert(c.earlyStateLift >= 3.0, 'Composite earlyStateLift');
  assert(c.fundraisingLift >= 4.0, 'Composite fundraisingLift');
  assert(Math.abs((c.nationalPoll - initPoll) - 7.0) <= 0.15, `Expected poll lift ~7.0, got delta ${(c.nationalPoll - initPoll).toFixed(2)}`);

  assert.strictEqual(res.trust.supporters, initTrust - 3, 'Composite trust cost');
  assert.strictEqual(res.actionsLeft, initActions - 1, 'Composite actions cost');
  assert.strictEqual(res.treasury, Math.round((initTreasury - 2.0) * 100) / 100, 'Composite treasury cost');
});

// --- CHECK 3: Parity Doctrine (No Costless Interventions) ---
console.log('\n--- CHECK 3: Parity Doctrine (No Costless Interventions) ---');

test('Empty asset selection defaults to politicalCapital cost rather than free lift', () => {
  const g = createDebateGame();
  const targetCand = g.activePresidentialPrimary.candidates[0];
  const initTrust = g.trust.supporters;

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: false, staffSupport: false, donorConduits: false }
  });

  // Must have deducted trust as politicalCapital fallback
  assert.strictEqual(res.trust.supporters, initTrust - 3, 'Must charge cost even on empty asset selection');
});

test('Insufficient treasury prevents donorConduits deployment without free lift', () => {
  const g = createDebateGame();
  g.treasury = 0.5; // Less than $2.0M required for donorConduits
  const targetCand = g.activePresidentialPrimary.candidates[0];

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: false, staffSupport: false, donorConduits: true }
  });

  // Action rejected, state untouched
  const c = res.activePresidentialPrimary.candidates.find((cand) => cand.id === targetCand.id);
  assert.strictEqual(c.fundraisingLift || 0, 0, 'No lift awarded on insufficient funds');
  assert.strictEqual(res.treasury, 0.5, 'Treasury unchanged');
});

// --- CHECK 4: Zero-Intervention Neutrality Reward ---
console.log('\n--- CHECK 4: Zero-Intervention Neutrality Reward ---');

test('Neutral path with 0 interventions awards full neutrality bonus', () => {
  let g = E.startPresidentialPrimary(E.createGame({ baseTemplateId: 'people' }));
  let guard = 0;
  while (g.activePresidentialPrimary && g.activePresidentialPrimary.stage !== 'complete' && guard < 60) {
    g = E.advancePrimaryCalendar(g);
    guard++;
  }

  assert.strictEqual(g.activePresidentialPrimary.stage, 'complete', 'Primary should reach complete stage');
  assert.strictEqual(g.activePresidentialPrimary.interventionsCount || 0, 0, 'Interventions count should be 0');
  assert.strictEqual(g.activePresidentialPrimary.neutralityBonusAwarded, true, 'Neutrality bonus must be awarded');
});

console.log(`\n====================================================================`);
console.log(` REQ-288 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log(`====================================================================`);

if (failed > 0) process.exit(1);
