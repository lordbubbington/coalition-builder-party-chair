/**
 * scripts/test-v0170-endorsement-repercussions.cjs
 * Verification test suite for REQ-289: Modular Faction Endorsement Repercussions
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
console.log(' VERSION 0.17.0 REQ-289 ENDORSEMENT REPERCUSSIONS TEST SUITE');
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

function createDebateGame() {
  const g = E.createGame({ baseTemplateId: 'people' });
  g.year = 2028;
  g.treasury = 50.0;
  g.actionsLeft = 3;
  g.organizingActionsRemaining = 3;
  g.trust = { supporters: 75, independents: 50, opponents: 15 };
  
  let withPrimary = E.startPresidentialPrimary(g);
  withPrimary = E.advancePrimaryCalendar(withPrimary); // debates stage
  return withPrimary;
}

// --- CHECK 1: Loyalty vs Resentment Branches & Option C Scaling ---
console.log('--- CHECK 1: Loyalty vs Resentment Branches & Option C Scaling ---');

test('Supporting a candidate gives loyalty boost to their faction and penalizes rival factions', () => {
  const g = createDebateGame();
  const cands = g.activePresidentialPrimary.candidates;
  const targetCand = cands[0];
  const targetFactionId = targetCand.factionId || (D.FACTIONS_CATALOG.find((f) => f.name === targetCand.faction)?.id);
  const rivalCand = cands[1];
  const rivalFactionId = rivalCand.factionId || (D.FACTIONS_CATALOG.find((f) => f.name === rivalCand.faction)?.id);

  const initTargetH = g.factionHappiness?.[targetFactionId] ?? 50;
  const initRivalH = g.factionHappiness?.[rivalFactionId] ?? 50;

  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: false, donorConduits: false }
  });

  const finalTargetH = res.factionHappiness?.[targetFactionId];
  const finalRivalH = res.factionHappiness?.[rivalFactionId];

  assert(finalTargetH > initTargetH, `Target faction should gain happiness (got ${finalTargetH} vs ${initTargetH})`);
  assert(finalRivalH < initRivalH, `Rival faction should lose happiness (got ${finalRivalH} vs ${initRivalH})`);
});

// --- CHECK 2: Cohesion Scaling of Grievance ---
console.log('\n--- CHECK 2: Cohesion Scaling of Grievance ---');

test('High-cohesion factions incur greater grievance/backlash than low-cohesion factions', () => {
  const g = createDebateGame();
  const cands = g.activePresidentialPrimary.candidates;
  const targetCand = cands[0];

  // Intervene heavily (all 3 assets)
  const res = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: true, donorConduits: true }
  });

  // Find a high cohesion rival faction vs lower cohesion rival faction
  const partyFactions = D.FACTIONS_CATALOG.filter((f) => f.partyId === 'people' && f.id !== targetCand.factionId);
  const sortedByCohesion = [...partyFactions].sort((a, b) => (D.getFactionCohesion(b) - D.getFactionCohesion(a)));
  const highestCohesion = sortedByCohesion[0];
  const lowestCohesion = sortedByCohesion[sortedByCohesion.length - 1];

  const highGrievance = res.factionGrievance?.[highestCohesion.id] || 0;
  const lowGrievance = res.factionGrievance?.[lowestCohesion.id] || 0;

  assert(highGrievance > lowGrievance, `High cohesion (${D.getFactionCohesion(highestCohesion)}) grievance (${highGrievance}) must exceed low cohesion (${D.getFactionCohesion(lowestCohesion)}) grievance (${lowGrievance})`);
});

// --- CHECK 3: Escalation Ladder (Resentment -> Donor Withholding -> Bolt Warning) ---
console.log('\n--- CHECK 3: Escalation Ladder ---');

test('Escalation ladder: cumulative interventions trigger donor suspension, then bolt warning', () => {
  let g = createDebateGame();
  const cands = g.activePresidentialPrimary.candidates;
  const targetCand = cands[0];
  const rivalCand = cands[1];
  const rivalFid = rivalCand.factionId || (D.FACTIONS_CATALOG.find((f) => f.name === rivalCand.faction)?.id);

  // First mild intervention: produces resentment
  g = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: false, donorConduits: false }
  });

  assert(g.factionGrievance?.[rivalFid] > 0, 'Resentment/grievance registered');
  const g1 = g.factionGrievance[rivalFid];

  // Second moderate intervention: triggers donor withholding
  g.activePresidentialPrimary.stage = 'debates';
  g = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: true, donorConduits: false }
  });

  assert(g.factionGrievance?.[rivalFid] > g1, 'Cumulative grievance increased');
  assert.strictEqual(Boolean(g.suspendedFactionDonors?.[rivalFid]), true, 'Donor withholding triggered on threshold');

  // Third intervention: triggers bolt warning
  g.activePresidentialPrimary.stage = 'debates';
  g = E.filterPrimarySupport(g, targetCand.id, {
    assets: { politicalCapital: true, staffSupport: true, donorConduits: true }
  });

  assert.strictEqual(Boolean(g.factionBoltWarnings?.[rivalFid]), true, 'Bolt warning triggered after donor withholding');
});

test('Endorsing suspended faction candidate repairs donor conduit relationship', () => {
  let g = createDebateGame();
  const cands = g.activePresidentialPrimary.candidates;
  const candA = cands[0];
  const candB = cands[1];
  const fidB = candB.factionId || (D.FACTIONS_CATALOG.find((f) => f.name === candB.faction)?.id);

  // Aggressively back candA to suspend candB's donors
  g = E.filterPrimarySupport(g, candA.id, { assets: { politicalCapital: true, staffSupport: true, donorConduits: true } });
  g.activePresidentialPrimary.stage = 'debates';
  g = E.filterPrimarySupport(g, candA.id, { assets: { politicalCapital: true, staffSupport: true, donorConduits: true } });

  assert.strictEqual(Boolean(g.suspendedFactionDonors?.[fidB]), true, 'Donors suspended for faction B');

  // Now support candB directly
  g.activePresidentialPrimary.stage = 'debates';
  g = E.filterPrimarySupport(g, candB.id, { assets: { politicalCapital: true, staffSupport: false, donorConduits: false } });

  assert.strictEqual(Boolean(g.suspendedFactionDonors?.[fidB]), false, 'Endorsing candB repaired suspended donors');
});

// --- CHECK 4: Option C Equilibrium & Minor Party Trust Caps ---
console.log('\n--- CHECK 4: Option C Equilibrium & Minor Party Trust Caps ---');

test('Equilibrium bounds hold: faction happiness stays within [0, 100]', () => {
  let g = createDebateGame();
  const cands = g.activePresidentialPrimary.candidates;
  const targetCand = cands[0];

  for (let i = 0; i < 5; i++) {
    g.activePresidentialPrimary.stage = 'debates';
    g = E.filterPrimarySupport(g, targetCand.id, { assets: { politicalCapital: true, staffSupport: true, donorConduits: false } });
  }

  Object.values(g.factionHappiness || {}).forEach((h) => {
    assert(h >= 0 && h <= 100, `Happiness ${h} out of bounds`);
  });
});

test('Minor-party third party trust caps respected during interventions', () => {
  const g = E.createGame({ baseTemplateId: 'liberty' });
  g.year = 2028;
  // Liberty tier 1: max trust is 10 * 1 = 10
  g.trust = { supporters: 10, independents: 8, opponents: 5 };
  let withPrimary = E.startPresidentialPrimary(g);
  withPrimary = E.advancePrimaryCalendar(withPrimary);

  const cand = withPrimary.activePresidentialPrimary.candidates[0];
  const res = E.filterPrimarySupport(withPrimary, cand.id, { assets: { politicalCapital: true } });

  assert(res.trust.supporters <= 10, `Trust ${res.trust.supporters} exceeded Tier 1 cap of 10`);
});

console.log(`\n====================================================================`);
console.log(` REQ-289 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log(`====================================================================`);

if (failed > 0) process.exit(1);
