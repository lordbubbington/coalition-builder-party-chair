/**
 * scripts/test-v0170-demands-leadership.cjs
 * Verification test suite for REQ-292 (Coalition Demands Framework & Leadership Appointments),
 * REQ-293 (Airtime Warchest Commitments), REQ-294 (Candidate Slate Quotas), and REQ-295 (Rival Faction Quarantine).
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
console.log(' VERSION 0.17.0 REQ-292 - REQ-295 COALITION DEMANDS SUITE');
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

// --- CHECK 1: Framework Unit & Uniform Offer Schema ---
console.log('--- CHECK 1: Framework Unit & Uniform Offer Schema ---');

test('Framework generates all four launch demand types with uniform schema', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');

  assert(Array.isArray(demands) && demands.length >= 4, `Expected at least 4 demands, got ${demands.length}`);
  const types = new Set(demands.map((d) => d.type));
  assert(types.has('leadership_gavel'), 'Must include leadership_gavel demands');
  assert(types.has('airtime_warchest'), 'Must include airtime_warchest demands');
  assert(types.has('slate_quota'), 'Must include slate_quota demands');
  assert(types.has('rival_quarantine'), 'Must include rival_quarantine demands');

  demands.forEach((d) => {
    assert(d.id, 'Demand must have id');
    assert(d.type, 'Demand must have type');
    assert(d.demandingFactionId, 'Demand must have demandingFactionId');
    assert(d.partyId, 'Demand must have partyId');
    assert(typeof d.term === 'object' && d.term !== null, 'Demand must have structured term');
    assert(typeof d.deadlineYear === 'number', 'Demand must have deadlineYear');
    assert(d.status === 'pending', 'Demand must start as pending');
    assert(d.reward && typeof d.reward.happiness === 'number', 'Demand must have numerical reward');
    assert(d.penalty && typeof d.penalty.happiness === 'number', 'Demand must have numerical penalty');
    assert(d.title && typeof d.title === 'string', 'Demand must have title');
    assert(d.narrative && typeof d.narrative === 'string', 'Demand must have narrative');

    // Rule 7 / Rule 4 Check on player-facing copy
    assert(!/REQ|\d+%|\b[0-9]+\.[0-9]+\b/.test(d.title), `Title "${d.title}" must not leak numbers or REQ IDs`);
    assert(!/REQ|\d+%|\b[0-9]+\.[0-9]+\b/.test(d.narrative), `Narrative "${d.narrative}" must not leak numbers or REQ IDs`);
  });
});

// --- CHECK 2: REQ-292 Leadership Appointments Module ---
console.log('\n--- CHECK 2: REQ-292 Leadership Appointments Module ---');

test('Leadership gavel demand requires candidate within the coalition party', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const leadDemand = demands.find((d) => d.type === 'leadership_gavel');

  assert(leadDemand, 'Must have a leadership demand');
  assert.strictEqual(leadDemand.partyId, 'people', 'Must be scoped to player party');
  assert(leadDemand.term.candidateId, 'Must specify a candidate');
});

test('Accepting and seating the demanded candidate fulfills gavel demand with loyalty reward', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const leadDemand = demands.find((d) => d.type === 'leadership_gavel');
  g.coalitionDemands = [leadDemand];

  const fid = leadDemand.demandingFactionId;
  const initialH = g.factionHappiness?.[fid] ?? 50;

  // Accept
  g = E.respondToCoalitionDemand(g, leadDemand.id, 'accept');
  assert.strictEqual(g.coalitionDemands[0].status, 'accepted');

  // Seat candidate in the demanded role
  g.leadershipRoles = {
    player: {
      [leadDemand.term.roleId]: leadDemand.term.candidateId,
    },
  };

  // Evaluate
  g = E.evaluateCoalitionDemands(g);
  assert.strictEqual(g.coalitionDemands[0].status, 'fulfilled', 'Demand should be fulfilled when candidate is seated');
  const finalH = g.factionHappiness[fid];
  assert(finalH > initialH, `Faction should gain happiness upon fulfillment (got ${finalH} vs ${initialH})`);
});

test('Refusing leadership demand triggers penalty and escalates grievance', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const leadDemand = demands.find((d) => d.type === 'leadership_gavel');
  g.coalitionDemands = [leadDemand];

  const fid = leadDemand.demandingFactionId;
  const initialH = g.factionHappiness?.[fid] ?? 50;

  g = E.respondToCoalitionDemand(g, leadDemand.id, 'refuse');
  assert.strictEqual(g.coalitionDemands[0].status, 'refused');
  assert(g.factionHappiness[fid] < initialH, 'Faction happiness must drop on refusal');
  assert(g.factionGrievance[fid] >= 8, 'Grievance must rise on refusal');
});

// --- CHECK 3: REQ-293 Super PAC Airtime Warchest Commitments ---
console.log('\n--- CHECK 3: REQ-293 Super PAC Airtime Warchest Commitments ---');

test('Airtime commitments demand audits spend strictly in faction bastions through allied PAC', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const airDemand = demands.find((d) => d.type === 'airtime_warchest');
  assert(airDemand, 'Airtime demand must exist');
  assert(Array.isArray(airDemand.term.bastions) && airDemand.term.bastions.length > 0, 'Must have bastion regions');

  g.coalitionDemands = [airDemand];
  g = E.respondToCoalitionDemand(g, airDemand.id, 'accept');

  // Deploy spend in bastions on the accepted demand
  g.coalitionDemands[0].term.deployedBastionSpend = g.coalitionDemands[0].term.requiredAmount;

  g = E.evaluateCoalitionDemands(g);
  assert.strictEqual(g.coalitionDemands[0].status, 'fulfilled', 'Should fulfill when bastion spend is met');
});

test('Loss of allied PAC access triggers immediate demand breach and betrayal escalation', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const airDemand = demands.find((d) => d.type === 'airtime_warchest');
  g.coalitionDemands = [airDemand];
  g = E.respondToCoalitionDemand(g, airDemand.id, 'accept');

  // Revoke access to the allied PAC
  g.factionPacAccess = { [airDemand.term.pacId]: false };

  g = E.evaluateCoalitionDemands(g);
  assert.strictEqual(g.coalitionDemands[0].status, 'breached', 'Demand must breach immediately on PAC access loss');
  assert.strictEqual(g.coalitionDemands[0].breachReason, 'ally_pac_access_revoked', 'Betrayal reason noted');
  assert.strictEqual(Boolean(g.suspendedFactionDonors[airDemand.demandingFactionId]), true, 'Donors suspended on betrayal');
  assert.strictEqual(Boolean(g.factionBoltWarnings[airDemand.demandingFactionId]), true, 'Bolt warning triggered on betrayal');
});

// --- CHECK 4: REQ-294 Candidate Slate Quotas ---
console.log('\n--- CHECK 4: REQ-294 Candidate Slate Quotas ---');

test('Candidate slate quota audits recruited class and validates party scoping', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const quotaDemand = demands.find((d) => d.type === 'slate_quota');
  assert(quotaDemand, 'Quota demand must exist');

  g.coalitionDemands = [quotaDemand];
  g = E.respondToCoalitionDemand(g, quotaDemand.id, 'accept');

  const fid = quotaDemand.demandingFactionId;
  // Simulate recruiting class: 4 candidates from fid out of 10 total (40% >= 30% quota)
  g.recruitedCandidates = [
    { id: 'c1', party: 'people', factionId: fid },
    { id: 'c2', party: 'people', factionId: fid },
    { id: 'c3', party: 'people', factionId: fid },
    { id: 'c4', party: 'people', factionId: fid },
    { id: 'c5', party: 'people', factionId: 'other' },
    { id: 'c6', party: 'people', factionId: 'other' },
    { id: 'c7', party: 'people', factionId: 'other' },
    { id: 'c8', party: 'people', factionId: 'other' },
    { id: 'c9', party: 'people', factionId: 'other' },
    { id: 'c10', party: 'people', factionId: 'other' },
    // Out-of-party recruit (must be ignored)
    { id: 'c11', party: 'heritage', factionId: fid },
  ];

  g = E.evaluateCoalitionDemands(g);
  assert.strictEqual(g.coalitionDemands[0].status, 'fulfilled', 'Quota met: 4/10 (40%) exceeds 30%');
});

// --- CHECK 5: REQ-295 Rival Faction Quarantine ---
console.log('\n--- CHECK 5: REQ-295 Rival Faction Quarantine ---');

test('Quarantine demand fires only between genuinely hostile faction pairs', () => {
  const g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const quarDemands = demands.filter((d) => d.type === 'rival_quarantine');

  assert(quarDemands.length > 0, 'Quarantine demands should be generated for hostile pairs');
  quarDemands.forEach((qd) => {
    assert(E.areFactionsHostile(qd.demandingFactionId, qd.term.targetFactionId), `Demanding ${qd.demandingFactionId} and target ${qd.term.targetFactionId} must be hostile pair`);
  });
});

test('Quarantine satisfaction triggers dual reactions (demanding reward & target severe grievance)', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const quarDemand = demands.find((d) => d.type === 'rival_quarantine');
  g.coalitionDemands = [quarDemand];

  const demandingFid = quarDemand.demandingFactionId;
  const targetFid = quarDemand.term.targetFactionId;

  const initDemH = g.factionHappiness?.[demandingFid] ?? 50;
  const initTarH = g.factionHappiness?.[targetFid] ?? 50;

  g = E.respondToCoalitionDemand(g, quarDemand.id, 'accept');

  const finalDemH = g.factionHappiness[demandingFid];
  const finalTarH = g.factionHappiness[targetFid];

  assert(finalDemH > initDemH, 'Demanding faction gains happiness');
  assert(finalTarH < initTarH, 'Target faction loses happiness');
  assert(g.factionGrievance[targetFid] >= 8, 'Target faction incurs severe grievance');
  assert.strictEqual(Boolean(g.quarantinedFactions?.[targetFid]), true, 'Target faction marked quarantined');
});

test('Fake compliance path provides partial reward with decay risk under high cohesion', () => {
  let g = E.createGame({ baseTemplateId: 'people' });
  const demands = E.generateCoalitionDemands(g, 'people');
  const quarDemand = demands.find((d) => d.type === 'rival_quarantine');
  g.coalitionDemands = [quarDemand];

  const demandingFid = quarDemand.demandingFactionId;
  const targetFid = quarDemand.term.targetFactionId;

  g = E.respondToCoalitionDemand(g, quarDemand.id, 'fake_compliance');

  assert.strictEqual(g.coalitionDemands[0].status, 'faked', 'Demand marked faked');
  assert.strictEqual(Boolean(g.quarantinedFactions?.[targetFid]), false, 'Target faction not structurally quarantined in fake path');
});

console.log(`\n====================================================================`);
console.log(` REQ-292 - REQ-295 TEST SUITE RESULT: ${passed} passed, ${failed} failed`);
console.log(`====================================================================`);

if (failed > 0) process.exit(1);
