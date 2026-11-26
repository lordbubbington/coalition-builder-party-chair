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

test('Error Log #1: Coalition Builder / Hung Chamber does NOT trigger when player wins an outright State Legislature, House, or Senate majority', () => {
  const g = E.createGame({ baseTemplateId: 'green', seed: 2028 });
  // Green wins outright majority in VT (85/150) -> MUST NOT trigger stateLeg hung chamber!
  const slWin = { VT: { total: 150, green: 85, people: 45, heritage: 20 } };
  const resWin = E.detectHungChambers(g, { green: 230, people: 110, heritage: 95 }, { green: 55, people: 25, heritage: 20 }, slWin);
  assert.strictEqual(resWin.houseHung, false, 'Outright Green House majority (230) must NOT be hung');
  assert.strictEqual(resWin.senateHung, false, 'Outright Green Senate majority (55) must NOT be hung');
  assert.strictEqual(resWin.hungStateChambers.length, 0, 'Outright Green State Leg majority (85/150) must NOT trigger Coalition Builder');
  assert.strictEqual(resWin.negotiations.length, 0, 'Zero Coalition Builder negotiations when player won outright majorities');

  // True hung state leg (Green 50, Dem 60, Rep 40 out of 150 -> majority 76) -> DOES trigger!
  const slHung = { VT: { total: 150, green: 50, people: 60, heritage: 40 } };
  const resHung = E.detectHungChambers(g, { people: 220, heritage: 215 }, { people: 52, heritage: 48 }, slHung);
  assert.strictEqual(resHung.hungStateChambers.length, 1, 'Genuine hung State Leg still triggers Coalition Builder');
});

test('Error Log #2: Election Night & Prior-Cycle Senate maps include holdover Senate seat rendering', () => {
  const appSrc = fs.readFileSync(path.join(REPO, 'app.js'), 'utf8');
  assert(appSrc.includes('Holdover Senate Seats (Not up)'), 'Election Night Senate map renders holdover seats');
  assert(appSrc.includes('Split Holdover Senate Delegation'), 'Election Night Senate map renders split holdover seats in purple');
  assert(appSrc.includes('(Holdover · Not up)'), 'Prior-Cycle Senate map renders holdover seats');
});

console.log(`\nALL ${passed}/2 ERROR LOG FIX TESTS PASSED!`);
