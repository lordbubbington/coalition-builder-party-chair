'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const ctx = {
  console, Math, Date, JSON, Set, Map, Array, Object, Number, String, Boolean, RegExp, Error, TypeError,
  parseInt, parseFloat, isNaN, isFinite, Uint8Array, TextDecoder,
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, setAttribute: () => {} }), head: { appendChild: () => {} }, getElementById: () => null, addEventListener: () => {} },
};
ctx.window = ctx; ctx.global = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);

const indexHtml = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
for (const rel of [...indexHtml.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1])) {
  if (rel.includes('maps-0.3.js') || rel.includes('app.js')) continue;
  const full = path.join(REPO, rel.split('?')[0]);
  if (fs.existsSync(full)) vm.runInContext(fs.readFileSync(full, 'utf8'), ctx, { filename: rel });
}

const E = ctx.PartyChairEngine;
let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

function setStateVoters(g, stateId, demPct, repPct, grnPct) {
  const st = g.voterModel.states.find((s) => (s.stateId || s.id) === stateId);
  const tot = 1000000;
  st.affiliations = {
    people: Math.round(tot * (demPct / 100)),
    heritage: Math.round(tot * (repPct / 100)),
    green: Math.round(tot * (grnPct / 100)),
    liberty: 0,
    constitution: 0,
    socialist: 0,
    other: 0,
    independent: Math.max(0, tot - Math.round(tot * ((demPct + repPct + grnPct) / 100))),
    thirdParty: Math.round(tot * (grnPct / 100)),
  };
}

test('Spoiler Voter Deadband #1: Within 5 points in registered voters (Green 18% vs Dem 15%) -> 0% spoiler for BOTH parties', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  setStateVoters(g, 'WY', 15, 60, 18); // +3 pts gap (<= 5 pts)
  const raw = { heritage: 65, green: 20, people: 15 };
  const res = E.applyDuvergerDefectionToShares(g, raw, 'WY', 'presidential');
  assert.strictEqual(res.shares.green, 20, 'Green unchanged within 5-pt voter deadband');
  assert.strictEqual(res.shares.people, 15, 'Dem unchanged within 5-pt voter deadband');
  assert.strictEqual(res.defections.green.reason, 'within-5pt-voter-deadband');
  assert(!res.defections.people, 'Dem must not suffer reverse defection inside 5-pt deadband');
});

test('Spoiler Voter Deadband #2: Within 5 points trailing (Green 12% vs Dem 16%) -> 0% spoiler for BOTH parties', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  setStateVoters(g, 'WY', 16, 65, 12); // -4 pts gap (<= 5 pts)
  const raw = { heritage: 70, people: 18, green: 12 };
  const res = E.applyDuvergerDefectionToShares(g, raw, 'WY', 'presidential');
  assert.strictEqual(res.shares.green, 12, 'Green unchanged when within 5 pts behind Dem in voters');
  assert.strictEqual(res.shares.people, 18, 'Dem unchanged within 5-pt deadband');
});

test('Spoiler Voter Reversal #3: Green leads Dem by > 5 points in registered voters (Green 22% vs Dem 14%) -> 0% spoiler for Green, reverse-Duverger onto Dem', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  setStateVoters(g, 'WY', 14, 58, 22); // +8 pts gap (> 5 pts)
  const raw = { heritage: 65, green: 21, people: 14 };
  const res = E.applyDuvergerDefectionToShares(g, raw, 'WY', 'presidential');
  assert.strictEqual(res.defections.green.defectedShare, 0);
  assert.strictEqual(res.defections.green.reason, 'outpolls-nearest-major-party');
  assert(res.defections.people && res.defections.people.defectedShare > 0, 'Trailing Dem (>5 pts behind in voters) bleeds to Green');
  assert(res.shares.green > 21, `Green rises above 21%, got ${res.shares.green}`);
  assert(res.shares.people < 14, `Dem falls below 14%, got ${res.shares.people}`);
});

test('Spoiler Voter Normal #4: Dem leads Green by > 5 points in registered voters (Dem 38% vs Green 10%) -> normal Duverger onto Green', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  setStateVoters(g, 'PA', 38, 42, 10); // -28 pts gap
  const raw = { heritage: 50, people: 38, green: 12 };
  const res = E.applyDuvergerDefectionToShares(g, raw, 'PA', 'presidential');
  assert(res.shares.green < 12, `Trailing Green suffers normal Duverger, got ${res.shares.green}`);
  assert(res.shares.people > 38, `Leading Dem receives defected votes, got ${res.shares.people}`);
});

console.log(`\nALL ${passed}/4 SPOILER VOTER-COUNT & DEADBAND TESTS PASSED!`);
