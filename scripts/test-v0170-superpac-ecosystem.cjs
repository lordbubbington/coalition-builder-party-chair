/**
 * scripts/test-v0170-superpac-ecosystem.cjs
 * Verification test suite for REQ-290: Faction-Tied Super PACs & Swing PAC Ecosystem
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
console.log(' VERSION 0.17.0 REQ-290 SUPER PAC & SWING PAC ECOSYSTEM SUITE');
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

// --- CHECK 1: Registry Integrity & Era Mappings ---
console.log('--- CHECK 1: Registry Integrity & Era Mappings ---');

test('Super PAC registry loaded with faction-tied and unaligned swing PACs', () => {
  const reg = D.FACTION_SUPER_PACS_REGISTRY;
  assert(Array.isArray(reg) && reg.length >= 10, `Expected at least 10 Super PACs, got ${reg?.length}`);
  const demPacs = reg.filter((p) => p.partyId === 'people');
  const gopPacs = reg.filter((p) => p.partyId === 'heritage');
  const swingPacs = reg.filter((p) => p.isSwingPac);

  assert(demPacs.length >= 4, `Expected at least 4 Dem PACs, got ${demPacs.length}`);
  assert(gopPacs.length >= 4, `Expected at least 4 GOP PACs, got ${gopPacs.length}`);
  assert(swingPacs.length >= 4, `Expected at least 4 Swing PACs, got ${swingPacs.length}`);
});

test('Era #16 Synthetic Robot Factions have dedicated Super PACs with no Democratic fallback', () => {
  const reg = D.FACTION_SUPER_PACS_REGISTRY;
  const robotPacs = reg.filter((p) => p.partyId === 'robot_silicon_vanguard');
  assert(robotPacs.length >= 4, `Expected at least 4 Robot PACs, got ${robotPacs.length}`);

  const hypercompute = robotPacs.find((p) => p.id === 'pac-robot-hypercompute-action');
  assert(hypercompute, 'Hypercompute PAC must exist');
  assert(hypercompute.alignedFactionIds.includes('robot_compute_maximalists'), 'Hypercompute aligns with robot_compute_maximalists');
  assert(!hypercompute.alignedFactionIds.some((f) => f.startsWith('dem_')), 'Robot PAC must not fall back to Democratic factions');
});

// --- CHECK 2: Access Coupling (Alienation & Restoration) ---
console.log('\n--- CHECK 2: Access Coupling ---');

test('Allied Super PAC accessible when aligned factions are in good standing', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const pacId = 'pac-workers-united';
  const accessible = E.isFactionSuperPacAccessible(g, pacId);
  assert.strictEqual(accessible, true, 'Workers United PAC should be accessible initially');
});

test('Alienating/suspending aligned factions revokes Super PAC access', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const pac = D.getSuperPacById('pac-workers-united');
  assert(pac, 'pac-workers-united must exist');

  // Suspend donors for all aligned factions
  g.suspendedFactionDonors = {};
  pac.alignedFactionIds.forEach((fid) => {
    g.suspendedFactionDonors[fid] = true;
  });

  const accessible = E.isFactionSuperPacAccessible(g, pac.id);
  assert.strictEqual(accessible, false, 'Access must be revoked when all aligned factions are suspended');
});

test('Reconciling faction restores allied Super PAC access', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const pac = D.getSuperPacById('pac-workers-united');

  // Suspend
  g.suspendedFactionDonors = {};
  pac.alignedFactionIds.forEach((fid) => { g.suspendedFactionDonors[fid] = true; });
  assert.strictEqual(E.isFactionSuperPacAccessible(g, pac.id), false);

  // Reconcile by clearing suspension for one aligned faction
  delete g.suspendedFactionDonors[pac.alignedFactionIds[0]];
  const accessibleAfterReconciliation = E.isFactionSuperPacAccessible(g, pac.id);
  assert.strictEqual(accessibleAfterReconciliation, true, 'Access must be restored after reconciliation');
});

// --- CHECK 3: Institutional Unlock Gate & Tier Drop-Down Revocation ---
console.log('\n--- CHECK 3: Institutional Unlock Gate & Revocation ---');

test('Minor party at Tier 1-3 has 0 seeded fledgling Super PACs', () => {
  const g = E.createGame({ baseTemplateId: 'liberty' });
  assert(!g.seededSuperPacs?.liberty, 'Tier 1 minor party must not have seeded Super PACs');
});

test('Tier 4 promotion seeds 1-2 fledgling Super PACs via evaluatePartyInstitutionalTiers', () => {
  const g = E.createGame({ baseTemplateId: 'liberty' });
  const tiers = { liberty: 4, people: 5, heritage: 5 };
  E.syncPartySuperPacsForTiers(g, tiers);

  assert(Array.isArray(g.seededSuperPacs?.liberty), 'Seeded Super PACs must exist for Tier 4 Liberty');
  assert(g.seededSuperPacs.liberty.length >= 1 && g.seededSuperPacs.liberty.length <= 2, `Expected 1-2 PACs, got ${g.seededSuperPacs.liberty.length}`);
  
  const firstPac = g.seededSuperPacs.liberty[0];
  assert.strictEqual(g.factionPacAccess?.[firstPac.id], true, 'Seeded PAC must be marked accessible');
});

test('Tier drop-down below Tier 4 cleanly revokes fledgling Super PACs', () => {
  const g = E.createGame({ baseTemplateId: 'liberty' });
  // Promote to Tier 4
  E.syncPartySuperPacsForTiers(g, { liberty: 4 });
  assert(g.seededSuperPacs?.liberty?.length > 0, 'Seeded PACs exist at Tier 4');
  const seededId = g.seededSuperPacs.liberty[0].id;

  // Drop down to Tier 2
  E.syncPartySuperPacsForTiers(g, { liberty: 2 });
  assert(!g.seededSuperPacs?.liberty, 'Seeded PACs must be revoked on drop below Tier 4');
  assert.strictEqual(g.factionPacAccess?.[seededId], false, 'Access must be revoked on drop-down');
});

// --- CHECK 4: Swing PAC Evaluation & Parity Doctrine ---
console.log('\n--- CHECK 4: Swing PAC Evaluation & Parity Doctrine ---');

test('Low-quality extreme candidate fails Swing PAC evaluation threshold', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  g.player = { ...g.player, economic: -0.9, social: -0.9 }; // Extreme left
  const lowCand = { id: 'cand-low', quality: 3.5 };

  const evalRes = E.evaluateSwingPacDeployment(g, 'pac-swing-main-street', 'race-gov-pa', lowCand);
  assert.strictEqual(evalRes.deployed, false, 'Extreme low-quality candidate should not trigger deployment');
});

test('High-quality moderate candidate crosses threshold and deploys independent airtime', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  g.player = { ...g.player, economic: -0.1, social: 0.0 }; // Moderate
  const highCand = { id: 'cand-high', quality: 8.5 };
  const initialTreasury = g.treasury;

  const evalRes = E.evaluateSwingPacDeployment(g, 'pac-swing-main-street', 'race-gov-pa', highCand);
  assert.strictEqual(evalRes.deployed, true, 'High-quality moderate candidate should trigger deployment');
  assert(evalRes.amount > 0, 'Should deploy positive independent expenditure amount');
  assert(g.independentExpenditures?.['race-gov-pa'] >= evalRes.amount, 'Expenditure must land in race ledger');
  assert.strictEqual(g.treasury, initialTreasury, 'Parity Doctrine: Super PAC funds never land in party treasury');
});

// --- CHECK 5: Doctrinal Coupling (REQ-193) ---
console.log('\n--- CHECK 5: Doctrinal Coupling (REQ-193) ---');

test('Moderate & Professionalize doctrine boosts Swing PAC evaluation score by +15', () => {
  const gBase = E.createGame({ baseTemplateId: 'people' });
  const gMod = E.createGame({ baseTemplateId: 'people' });
  gMod.partyDoctrine = 'moderate_professionalize';

  const cand = { id: 'c1', quality: 6.0 };
  const baseRes = E.evaluateSwingPacDeployment(gBase, 'pac-swing-main-street', 'r1', cand);
  const modRes = E.evaluateSwingPacDeployment(gMod, 'pac-swing-main-street', 'r1', cand);

  assert.strictEqual(modRes.score, baseRes.score + 15, `Expected +15 score boost under moderate_professionalize (got ${modRes.score} vs ${baseRes.score})`);
});

test('Stay Pure doctrine penalizes centrist Swing PAC evaluation score by -15', () => {
  const gBase = E.createGame({ baseTemplateId: 'people' });
  const gPure = E.createGame({ baseTemplateId: 'people' });
  gPure.partyDoctrine = 'stay_pure';

  const cand = { id: 'c1', quality: 6.0 };
  const baseRes = E.evaluateSwingPacDeployment(gBase, 'pac-swing-main-street', 'r1', cand);
  const pureRes = E.evaluateSwingPacDeployment(gPure, 'pac-swing-main-street', 'r1', cand);

  assert.strictEqual(pureRes.score, baseRes.score - 15, `Expected -15 score penalty under stay_pure (got ${pureRes.score} vs ${baseRes.score})`);
});

console.log(`\n====================================================================`);
console.log(` REQ-290 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log(`====================================================================`);

if (failed > 0) process.exit(1);
