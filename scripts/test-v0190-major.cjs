'use strict';

const assert = require('assert');
const path = require('path');

global.window = global.window || global;
const exported = require(path.resolve(__dirname, '..', 'autopsy-catalog-major.js'));
const AUTOPSY_MAJOR = exported.AUTOPSY_MAJOR || exported;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

/**
 * Deterministic signed mechanical utility score for an autopsy option:
 * positive = helpful player buff; negative = harmful player debuff.
 */
function computeOptionNetScore(option) {
  const e = option.effects || {};
  let score = 0;
  score += Number(e.treasury || 0) * 1.0;
  score -= Number(e.rivalTreasury || 0) * 1.2;
  score += (Number(e.voters || 0) / 100000) * 1.5;
  score += Number(e.chapters || 0) * 0.8;
  score += Number(e.organizingActions || 0) * 3.0;
  score += Number(e.factionHappiness || 0) * 0.9;
  score += Number(e.topFactionHappiness || 0) * 0.7;
  score += Number(e.lowestFactionHappiness || 0) * 0.7;
  score += Number(e.factionConfidence || 0) * 0.8;
  score -= Number(e.factionFriction || 0) * 0.7;
  score += Number(e.caucusStrength || 0) * 0.7;
  score += Number(e.supporterTrust || 0) * 1.2;
  score += Number(e.independentTrust || 0) * 1.2;
  score += Number(e.opponentTrust || 0) * 0.8;
  score += Number(e.waveMomentum || 0) * 4.0;
  score += Number(e.nationalEnvShift || 0) * 4.5;
  score += Number(e.presidentialApproval || 0) * 1.0;
  score += Number(e.sittingMemberHappiness || 0) * 0.8;
  if (e.spawnCandidates) {
    score += Number(e.spawnCandidates.count || 0) * (Number(e.spawnCandidates.quality || 8) * 0.6);
  }
  if (e.candidateFameBoost) {
    score += Number(e.candidateFameBoost.count || 0) * Number(e.candidateFameBoost.delta || 0) * 0.35;
  }
  return score;
}

console.log('=== v0.19.0 MAJOR PARTY AUTOPSY CATALOG SUITE (M1-M10) ===');

test('1. UMD export exposes AUTOPSY_MAJOR on both module.exports and window.AutopsyCatalogMajor', () => {
  assert.ok(AUTOPSY_MAJOR && typeof AUTOPSY_MAJOR === 'object', 'AUTOPSY_MAJOR object missing');
  assert.ok(global.window.AutopsyCatalogMajor, 'window.AutopsyCatalogMajor missing');
  assert.strictEqual(global.window.AutopsyCatalogMajor.AUTOPSY_MAJOR, AUTOPSY_MAJOR);
});

test('2. All 10 scenarios M1..M10 exist with exactly 7 options each (70 total) & zero duplicate IDs', () => {
  const expectedBuckets = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'];
  assert.deepStrictEqual(Object.keys(AUTOPSY_MAJOR), expectedBuckets);

  const seenIds = new Set();
  const seenNames = new Set();
  let total = 0;

  expectedBuckets.forEach((bucket) => {
    const arr = AUTOPSY_MAJOR[bucket];
    assert.ok(Array.isArray(arr), `${bucket} must be an array`);
    assert.strictEqual(arr.length, 7, `${bucket} must contain exactly 7 options, got ${arr.length}`);

    arr.forEach((opt, idx) => {
      total += 1;
      assert.strictEqual(opt.track, 'major', `${bucket}[${idx}] track must be 'major'`);
      assert.strictEqual(opt.bucket, bucket, `${bucket}[${idx}] bucket must equal '${bucket}'`);
      assert.ok(typeof opt.id === 'string' && opt.id.startsWith(`major_${bucket.toLowerCase()}_`), `${bucket}[${idx}] invalid id '${opt.id}'`);
      assert.ok(!seenIds.has(opt.id), `Duplicate option id: ${opt.id}`);
      seenIds.add(opt.id);

      assert.ok(typeof opt.name === 'string' && opt.name.trim().length > 0, `${bucket}[${idx}] missing name`);
      assert.ok(!seenNames.has(opt.name), `Duplicate option name: ${opt.name}`);
      seenNames.add(opt.name);

      assert.ok(typeof opt.theme === 'string' && opt.theme.trim().length > 0, `${bucket}[${idx}] missing theme`);
      assert.ok(opt.effects && typeof opt.effects === 'object', `${bucket}[${idx}] missing effects`);
      assert.ok(typeof opt.summaryTemplate === 'string' && opt.summaryTemplate.trim().length > 0, `${bucket}[${idx}] missing summaryTemplate`);
    });
  });

  assert.strictEqual(total, 70, `Expected 70 total major autopsy options, got ${total}`);
});

test('3. Explicit {STATES} placeholder enforced whenever stateTargeting.count <= 5', () => {
  const validModes = new Set(['top_states', 'swing_states', 'uncertified_ballot', 'reform_states', 'lost_statehouse', 'all_states']);
  let checkedCountLeq5 = 0;

  Object.entries(AUTOPSY_MAJOR).forEach(([bucket, arr]) => {
    arr.forEach((opt) => {
      if (opt.stateTargeting !== null) {
        assert.ok(typeof opt.stateTargeting === 'object', `${bucket}:${opt.id} stateTargeting must be object or null`);
        assert.ok(validModes.has(opt.stateTargeting.mode), `${bucket}:${opt.id} invalid stateTargeting.mode '${opt.stateTargeting.mode}'`);
        assert.ok(Number.isInteger(opt.stateTargeting.count) && opt.stateTargeting.count >= 1, `${bucket}:${opt.id} invalid stateTargeting.count`);
        if (opt.stateTargeting.count <= 5) {
          checkedCountLeq5 += 1;
          assert.ok(
            opt.summaryTemplate.includes('{STATES}'),
            `${bucket}:${opt.id} targets <= 5 states (count=${opt.stateTargeting.count}) so summaryTemplate must contain {STATES}`
          );
        }
      }
    });
  });

  assert.ok(checkedCountLeq5 >= 9, `Expected >= 9 options targeting <= 5 states, checked ${checkedCountLeq5}`);
});

test('4. M1..M5 are net positive buffs (strongest at M1 down to lightest at M5)', () => {
  const outPresBuckets = ['M1', 'M2', 'M3', 'M4', 'M5'];
  const bucketTotals = outPresBuckets.map((bucket) => {
    const scores = AUTOPSY_MAJOR[bucket].map((opt) => {
      const s = computeOptionNetScore(opt);
      assert.ok(s > 0, `${bucket}:${opt.id} must be a net positive buff, got score=${s}`);
      return s;
    });
    return scores.reduce((a, b) => a + b, 0);
  });

  for (let i = 0; i < bucketTotals.length - 1; i++) {
    assert.ok(
      bucketTotals[i] > bucketTotals[i + 1],
      `Expected ${outPresBuckets[i]} (${bucketTotals[i].toFixed(2)}) > ${outPresBuckets[i + 1]} (${bucketTotals[i + 1].toFixed(2)})`
    );
  }
});

test('5. M6..M10 are net negative debuffs scaling monotonically worse from M6 -> M10', () => {
  const presBuckets = ['M6', 'M7', 'M8', 'M9', 'M10'];
  const bucketTotals = presBuckets.map((bucket) => {
    const scores = AUTOPSY_MAJOR[bucket].map((opt) => {
      const s = computeOptionNetScore(opt);
      assert.ok(s < 0, `${bucket}:${opt.id} must be a net negative debuff, got score=${s}`);
      return s;
    });
    return scores.reduce((a, b) => a + b, 0);
  });

  for (let i = 0; i < bucketTotals.length - 1; i++) {
    assert.ok(
      bucketTotals[i] > bucketTotals[i + 1],
      `Expected ${presBuckets[i]} (${bucketTotals[i].toFixed(2)}) to be less severe (greater) than ${presBuckets[i + 1]} (${bucketTotals[i + 1].toFixed(2)})`
    );
  }
});

test('6. Key effect magnitudes match specification anchors (M1, M5, M6, M10)', () => {
  assert.deepStrictEqual(AUTOPSY_MAJOR.M1[0].effects, { treasury: 35, supporterTrust: 6 });
  assert.strictEqual(AUTOPSY_MAJOR.M1[4].effects.spawnCandidates.quality, 9.5);
  assert.strictEqual(AUTOPSY_MAJOR.M5[6].effects.factionFriction, 3);
  assert.strictEqual(AUTOPSY_MAJOR.M7[6].effects.candidateFameBoost.delta, -4);
  assert.strictEqual(AUTOPSY_MAJOR.M8[6].effects.rivalTreasury, 10);
  assert.deepStrictEqual(AUTOPSY_MAJOR.M10[0].effects, {
    factionHappiness: -18,
    factionConfidence: -15,
    factionFriction: 22,
    caucusStrength: -20,
  });
  assert.strictEqual(AUTOPSY_MAJOR.M10[3].effects.voters, -1850000);
  assert.strictEqual(AUTOPSY_MAJOR.M10[6].effects.rivalTreasury, 18);
});

console.log(`\nALL ${passed}/6 v0.19.0 MAJOR AUTOPSY CATALOG TESTS PASSED.`);
