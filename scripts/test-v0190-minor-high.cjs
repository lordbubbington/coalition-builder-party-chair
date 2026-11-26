/**
 * Coalition Builder: Party Chair — v0.19.0 Minor High Autopsy Catalog Test Suite (11–20+ Points)
 * Verifies 10 buckets (11..20) x 7 options (70 total), schema invariants, zero duplicate IDs,
 * exponential progression across realignment tiers, and explicit {STATES} placeholder when count <= 5.
 */
'use strict';

const assert = require('assert');
globalThis.window = globalThis;

const Mod = require('../autopsy-catalog-minor-high.js');
const Catalog = Mod.AUTOPSY_MINOR_HIGH;

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('=== v0.19.0 AUTOPSY MINOR-HIGH CATALOG (11–20+ PTS) TEST SUITE ===');

test('1. UMD browser global and CommonJS export expose AUTOPSY_MINOR_HIGH with buckets 11..20', () => {
  assert(globalThis.window.AutopsyCatalogMinorHigh, 'window.AutopsyCatalogMinorHigh missing');
  assert(Catalog && typeof Catalog === 'object', 'AUTOPSY_MINOR_HIGH missing');
  const keys = Object.keys(Catalog).map(Number).sort((a, b) => a - b);
  assert.deepStrictEqual(keys, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.strictEqual(Mod.getMinorHighPoolForPoints(25), Catalog[20], 'Scores > 20 must clamp to 20-pt pool');
  assert.strictEqual(Mod[11], Catalog[11], 'Direct bucket alias 11 should also resolve cleanly');
});

test('2. Exactly 7 options per bucket (70 options total) with zero duplicate IDs or names', () => {
  const seenIds = new Set();
  const seenNames = new Set();
  let totalCount = 0;

  for (let b = 11; b <= 20; b++) {
    const arr = Catalog[b];
    assert(Array.isArray(arr), `Bucket ${b} is not an array`);
    assert.strictEqual(arr.length, 7, `Bucket ${b} expected 7 options, got ${arr.length}`);
    arr.forEach((opt) => {
      totalCount++;
      assert(!seenIds.has(opt.id), `Duplicate option ID: ${opt.id}`);
      assert(!seenNames.has(opt.name), `Duplicate option name: ${opt.name}`);
      seenIds.add(opt.id);
      seenNames.add(opt.name);
    });
  }
  assert.strictEqual(totalCount, 70, `Expected 70 total options, got ${totalCount}`);
});

test('3. Every option conforms to shared v0.19.0 schema & explicit {STATES} rule for count <= 5', () => {
  const validModes = new Set(['top_states', 'swing_states', 'uncertified_ballot', 'reform_states', 'lost_statehouse', 'all_states']);
  const countLe5Options = [];

  for (let b = 11; b <= 20; b++) {
    Catalog[b].forEach((opt) => {
      assert.strictEqual(typeof opt.id, 'string');
      assert.strictEqual(opt.track, 'minor');
      assert.strictEqual(opt.bucket, b);
      assert(typeof opt.name === 'string' && opt.name.length > 0, `Invalid name in ${opt.id}`);
      assert(typeof opt.theme === 'string' && opt.theme.length > 0, `Invalid theme in ${opt.id}`);
      assert(opt.effects && typeof opt.effects === 'object' && Object.keys(opt.effects).length > 0, `Empty effects in ${opt.id}`);
      assert(typeof opt.summaryTemplate === 'string' && opt.summaryTemplate.length > 0, `Empty summaryTemplate in ${opt.id}`);

      if (opt.stateTargeting !== null) {
        assert(typeof opt.stateTargeting === 'object', `Invalid stateTargeting in ${opt.id}`);
        assert(validModes.has(opt.stateTargeting.mode), `Invalid stateTargeting.mode in ${opt.id}: ${opt.stateTargeting.mode}`);
        assert(Number.isInteger(opt.stateTargeting.count) && opt.stateTargeting.count >= 1, `Invalid stateTargeting.count in ${opt.id}`);
        if (opt.stateTargeting.count <= 5) {
          countLe5Options.push(opt.id);
          assert(opt.summaryTemplate.includes('{STATES}'), `Option ${opt.id} has count=${opt.stateTargeting.count} <= 5 but summaryTemplate omits {STATES}`);
        }
      }
    });
  }
  assert(countLe5Options.length >= 5, `Expected reform options in buckets 11,13,14,15,16 with count <= 5, got ${countLe5Options.length}`);
});

test('4. Exponential scaling across buckets 11..20 (voters, treasury, chapters, trust, wave, reforms)', () => {
  const getByThemePrefix = (b, key) => Catalog[b].find((o) => o.effects[key] !== undefined);
  const v11 = getByThemePrefix(11, 'voters').effects.voters;
  const v13 = getByThemePrefix(13, 'voters').effects.voters;
  const v16 = getByThemePrefix(16, 'voters').effects.voters;
  const v20 = getByThemePrefix(20, 'voters').effects.voters;
  assert(v20 > v16 && v16 > v13 && v13 > v11, `Expected p20 (${v20}) > p16 (${v16}) > p13 (${v13}) > p11 (${v11})`);
  assert.strictEqual(v11, 1050000);
  assert.strictEqual(v13, 1800000);
  assert.strictEqual(v16, 4500000);
  assert.strictEqual(v20, 14000000);

  for (let b = 12; b <= 20; b++) {
    const prevV = getByThemePrefix(b - 1, 'voters').effects.voters;
    const curV = getByThemePrefix(b, 'voters').effects.voters;
    assert(curV > prevV, `Voters should increase strictly from bucket ${b - 1} (${prevV}) to ${b} (${curV})`);

    const prevCh = getByThemePrefix(b - 1, 'chapters').effects.chapters;
    const curCh = getByThemePrefix(b, 'chapters').effects.chapters;
    assert(curCh > prevCh, `Chapters should increase strictly from bucket ${b - 1} (${prevCh}) to ${b} (${curCh})`);
  }

  assert.strictEqual(Catalog[20][0].effects.treasury, 'cap_250');
  assert.strictEqual(Catalog[20][4].effects.freeHouseSlates, 'all_full');
  assert.strictEqual(Catalog[20][4].effects.freeSenateSlates, 'all_full');
  assert.strictEqual(Catalog[20][4].effects.ballotAccessStates, 51);
  assert.strictEqual(Catalog[15][3].effects.factionFriction, 'zero');
  assert.strictEqual(Catalog[16][3].effects.upgradeCaucusesHistoric, true);
  assert.strictEqual(Catalog[20][3].effects.upgradeCaucusesHistoric, true);
});

if (process.exitCode && process.exitCode !== 0) {
  console.error('\nTEST SUITE FAILED');
  process.exit(process.exitCode);
} else {
  console.log(`\nALL ${passed}/${passed} MINOR-HIGH AUTOPSY CATALOG TESTS PASSED!`);
}
