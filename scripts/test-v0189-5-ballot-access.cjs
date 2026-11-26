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
const BA = ctx.BallotAccess;
let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

test('Ballot Fix #1: Libertarian foothold in Wyoming (viability breakthrough OR >=3 chapters OR >=5% reg) grants full ballot access in WY', () => {
  const g = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
  // Wipe WY from raw ballotAccess to prove foothold alone grants access
  delete g.ballotAccess.liberty.presidential.WY;
  delete g.ballotAccess.liberty.senate.WY;
  delete g.ballotAccess.liberty.governor.WY;
  delete g.ballotAccess.liberty.house['WY-AL'];
  g.viabilityBreakthroughs = { liberty: { WY: true } };

  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'presidential:WY'), true, 'WY foothold grants Presidential ballot access');
  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'senate:WY'), true, 'WY foothold grants Senate ballot access');
  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'governor:WY'), true, 'WY foothold grants Governor ballot access');
  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'house:WY-AL'), true, 'WY foothold grants House ballot access');
  const prog = BA.getPresidentialBallotProgress(g, 'liberty');
  assert(prog.certified.includes('WY'), 'getPresidentialBallotProgress includes WY foothold as certified');
});

test('Ballot Fix #2: Any election with >= 1 primary candidate automatically has ballot access', () => {
  const g = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
  delete g.ballotAccess.liberty.senate.MT;
  delete g.ballotAccess.liberty.governor.MT;
  delete g.ballotAccess.liberty.house['MT-1'];
  g.primaryFields['senate:MT'] = { liberty: [{ id: 'cand-1', name: 'Test Libertarian' }] };
  g.primaryFields['governor:MT'] = { liberty: [{ id: 'cand-2', name: 'Test Gov' }] };
  g.primaryFields['house:MT-1'] = { liberty: [{ id: 'cand-3', name: 'Test Rep' }] };

  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'senate:MT'), true, 'Primary candidate in senate:MT grants ballot access');
  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'governor:MT'), true, 'Primary candidate in governor:MT grants ballot access');
  assert.strictEqual(E.hasBallotAccess(g, 'liberty', 'house:MT-1'), true, 'Primary candidate in house:MT-1 grants ballot access');
});

test('Ballot Fix #3: applyAutomaticBallotRetention also retains presidential ballot access', () => {
  const g = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
  delete g.ballotAccess.liberty.presidential.WY;
  const retained = E.applyAutomaticBallotRetention(g, {
    presidential: { byState: { WY: { shares: { liberty: 8.5, heritage: 60, people: 31.5 } } } },
  });
  assert.strictEqual(retained.ballotAccess.liberty.presidential.WY, true, 'Retention must set presidential[WY] = true');
});

test('Ballot Fix #4: Libertarian 2028 starting presidential ballot access covers union of gov + senate + house states (not just ~7 gov states)', () => {
  const g = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
  const presCount = Object.keys(g.ballotAccess.liberty.presidential || {}).length;
  assert(presCount >= 25, `Expected Libertarian starting presidential ballot access in >= 25 states, got ${presCount}`);
});

test('Anti-Spoiler Fix #5: Proportional and Ranked Choice (RCV) elections have strictly 0% spoiler effect (forward & reverse)', () => {
  const g = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
  g.stateElectoralSystems.WY = { allRaces: 'proportional', legislative: 'proportional' };
  g.stateElectoralSystems.ME = { allRaces: 'rcv', legislative: 'plurality' };
  const raw = { heritage: 55, people: 35, liberty: 10 };

  const propRes = E.applyDuvergerDefectionToShares(g, raw, 'WY', 'house');
  assert.strictEqual(propRes.shares.liberty, 10, 'Proportional election has strictly 0% spoiler');
  assert.strictEqual(propRes.shares.heritage, 55, 'Proportional election leaves major party unchanged');

  const rcvRes = E.applyDuvergerDefectionToShares(g, raw, 'ME', 'senate');
  assert.strictEqual(rcvRes.shares.liberty, 10, 'RCV election has strictly 0% spoiler');
  assert.strictEqual(rcvRes.shares.heritage, 55, 'RCV election leaves major party unchanged');

  const propSingle = E.computeStrategicVotingDefection(g, 'liberty', 'WY', 'presidential', 10);
  assert.strictEqual(propSingle.defectionRate, 0, 'computeStrategicVotingDefection returns 0% for proportional');
  const rcvSingle = E.computeStrategicVotingDefection(g, 'liberty', 'ME', 'senate', 10);
  assert.strictEqual(rcvSingle.defectionRate, 0, 'computeStrategicVotingDefection returns 0% for RCV');
});

console.log(`\nALL ${passed}/5 BALLOT ACCESS & ANTI-SPOILER TESTS PASSED!`);
