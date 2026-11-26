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

test('Spoiler Reversal #1: When Green (20%) outpolls Democrats (15%) in a plurality state (WY), Green takes 0% spoiler and Democrats bleed strategic votes to Green', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  const raw = { heritage: 65, green: 20, people: 15 };
  const res = E.applyDuvergerDefectionToShares(g, raw, 'WY', 'presidential');
  assert.strictEqual(res.defections.green.defectedShare, 0, 'Green outpolling Dem must take 0% spoiler defection');
  assert.strictEqual(res.defections.green.reason, 'outpolls-nearest-major-party');
  assert(res.defections.people && res.defections.people.defectedShare > 0, 'Trailing Democrats (<25%) must bleed strategic votes to Green');
  assert.strictEqual(res.defections.people.recipientPartyId, 'green');
  assert.strictEqual(res.defections.people.reason, 'reverse-duverger-overtaken-by-third-party');
  assert(res.shares.green > 20, `Green share should rise above 20%, got ${res.shares.green}`);
  assert(res.shares.people < 15, `Dem share should fall below 15%, got ${res.shares.people}`);
  const sum = Math.round((res.shares.heritage + res.shares.green + res.shares.people) * 100) / 100;
  assert.strictEqual(sum, 100, `Total vote share must be conserved at 100%, got ${sum}`);
});

test('Spoiler Reversal #2: RCV state (AK) and State Legislature races remain strictly 0% spoiler in BOTH directions', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  const raw = { heritage: 65, green: 20, people: 15 };
  const rcv = E.applyDuvergerDefectionToShares(g, raw, 'AK', 'presidential');
  assert.strictEqual(rcv.shares.green, 20, 'RCV Green unchanged');
  assert.strictEqual(rcv.shares.people, 15, 'RCV Dem unchanged');

  const sl = E.applyDuvergerDefectionToShares(g, raw, 'WY', 'state-leg');
  assert.strictEqual(sl.shares.green, 20, 'State-leg Green unchanged');
  assert.strictEqual(sl.shares.people, 15, 'State-leg Dem unchanged');
});

test('Spoiler Reversal #3: Normal state where Green (12%) trails Democrats (38%) still applies normal Duverger defection to Green', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  const raw = { heritage: 50, people: 38, green: 12 };
  const res = E.applyDuvergerDefectionToShares(g, raw, 'PA', 'presidential');
  assert(res.shares.green < 12, `Trailing Green should still suffer Duverger defection, got ${res.shares.green}`);
  assert(res.shares.people > 38, `Leading Dem should receive defected votes, got ${res.shares.people}`);
  assert(!res.defections.people, 'Leading Dem should not suffer reverse defection');
});

console.log(`\nALL ${passed}/3 SPOILER REVERSAL TESTS PASSED!`);
