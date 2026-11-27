#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');

const VRC = require(path.resolve(__dirname, '..', 'voting-reforms-core.js'));

function sumObj(obj) {
  return Object.values(obj || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);
}

console.log('=== VOTING REFORMS CORE UNIT TEST SUITE ===');

// 1. STV Cluster Splitting & Seat Conservation across 3-, 8-, 17-, and 52-seat delegations
[3, 8, 17, 52].forEach((seatCount) => {
  const clusters = VRC.buildStvClusters(seatCount);
  assert.ok(clusters.every((sz) => sz >= 3 && sz <= 5), `All clusters for ${seatCount} seats must be in [3..5]: ${clusters}`);
  assert.strictEqual(clusters.reduce((a, b) => a + b, 0), seatCount, `Cluster sum mismatch for ${seatCount}`);

  const votes = { people: 44, heritage: 41, green: 11, liberty: 4 };
  const res = VRC.allocateStvSeats(votes, seatCount);
  assert.strictEqual(res.totalSeats, seatCount);
  assert.strictEqual(sumObj(res.seatsByParty), seatCount, `STV seat conservation failed for ${seatCount} seats`);
  res.clusters.forEach((c) => {
    assert.strictEqual(sumObj(c.seatsByParty), c.size, `Cluster ${c.clusterId} size mismatch`);
  });
});
console.log('  PASS: STV preserves exact seat totals across 3, 8, 17, and 52 seats');

// 2. STV 3rd-party breakthrough (Droop quota + ideological lowest-party transfer)
{
  // 9 seats -> [5, 4]; in 5-seat cluster (quota=17), 16% Green wins on surplus transfer from People
  const stvBreakthrough = VRC.allocateStvSeats({ people: 42, heritage: 42, green: 16 }, 9);
  assert.strictEqual(sumObj(stvBreakthrough.seatsByParty), 9);
  assert.ok((stvBreakthrough.seatsByParty.green || 0) >= 1, `Expected Green STV breakthrough on 16% share in 5-seat cluster, got ${JSON.stringify(stvBreakthrough.seatsByParty)}`);

  // In 8 seats ([4,4], quota=21), 22% Green wins 2 seats directly; 14% Green + 12% Socialist wins via elimination transfer
  const stvDirect = VRC.allocateStvSeats({ people: 39, heritage: 39, green: 22 }, 8);
  assert.strictEqual(stvDirect.seatsByParty.green, 2);

  const stvTransferChain = VRC.allocateStvSeats({ people: 34, heritage: 40, green: 14, socialist: 12 }, 4);
  assert.strictEqual(sumObj(stvTransferChain.seatsByParty), 4);
  assert.ok((stvTransferChain.seatsByParty.green || 0) >= 1, `Expected socialist elimination transfer to give Green a seat: ${JSON.stringify(stvTransferChain.seatsByParty)}`);
}
console.log('  PASS: STV third-party breakthrough and ideological transfer verified');

// 3. State-Level Mixed-Member Proportional (MMP)
{
  // 10 seats -> 5 local, 5 list; People over-wins local districts (4/5), MMP tops up Heritage & Green
  const mmp = VRC.allocateStateMmpSeats(
    { people: 50, heritage: 40, green: 10, liberty: 0 },
    ['people', 'people', 'people', 'people', 'heritage'],
    10
  );
  assert.strictEqual(sumObj(mmp.localSeats), 5, 'localSeats must sum to floor(10/2)=5');
  assert.strictEqual(sumObj(mmp.listSeats), 5, 'listSeats must sum to 5');
  assert.strictEqual(sumObj(mmp.totalSeatsByParty), 10, 'totalSeatsByParty must sum to 10');
  assert.strictEqual(mmp.totalSeatsByParty.people, 5, 'People topped up cleanly to 5 (50%)');
  assert.strictEqual(mmp.totalSeatsByParty.heritage, 4, 'Heritage compensated to 4 (40%)');
  assert.strictEqual(mmp.totalSeatsByParty.green, 1, 'Green (>=5% threshold) wins 1 compensatory seat (10%)');

  // Verify local district winner qualifies below 5% threshold
  const mmpLocalQual = VRC.allocateStateMmpSeats(
    { people: 52, heritage: 44, liberty: 4 },
    ['people', 'people', 'heritage', 'liberty'],
    8
  );
  assert.strictEqual(sumObj(mmpLocalQual.totalSeatsByParty), 8);
  assert.ok(mmpLocalQual.totalSeatsByParty.liberty >= 1, 'Party with 1 local win retains seat below 5%');

  // Minimum U.S. House state >= 2 seats
  const mmp2 = VRC.allocateStateMmpSeats({ people: 51, heritage: 49 }, ['people'], 2);
  assert.strictEqual(sumObj(mmp2.localSeats), 1);
  assert.strictEqual(sumObj(mmp2.listSeats), 1);
  assert.deepStrictEqual(mmp2.totalSeatsByParty, { people: 1, heritage: 1 });
}
console.log('  PASS: State MMP local+list conservation, compensatory top-ups, and threshold rules verified');

// 4. Presidential EV Allocation (winner_take_all, district_split, proportional_ev)
{
  // Maine/Nebraska default district_split (NE: 5 EV -> 2 statewide + 3 CDs)
  const neRes = VRC.allocateStatePresidentialEvs(
    'NE',
    5,
    { people: 42, heritage: 56, liberty: 2 },
    ['heritage', 'people', 'heritage']
  );
  assert.strictEqual(neRes.rule, 'district_split');
  assert.strictEqual(neRes.primaryWinner, 'heritage');
  assert.strictEqual(neRes.isSplit, true);
  assert.strictEqual(sumObj(neRes.evByParty), 5);
  assert.deepStrictEqual(neRes.evByParty, { people: 1, heritage: 4, liberty: 0 });

  // Graceful split when districtWinners array length differs from totalEv - 2 (e.g. 10 EV -> 2 + 8 districts, given 4 winners)
  const scaledSplit = VRC.allocateStatePresidentialEvs(
    'PA',
    19,
    { people: 49, heritage: 48, green: 3 },
    ['people', 'people', 'heritage', 'heritage'],
    'district_split'
  );
  assert.strictEqual(sumObj(scaledSplit.evByParty), 19, 'Scaled district_split must conserve all 19 EVs');
  assert.strictEqual(scaledSplit.isSplit, true);

  // Proportional EV with 5% viability floor (3% Green excluded)
  const propEv = VRC.allocateStatePresidentialEvs(
    'CA',
    54,
    { people: 55, heritage: 32, liberty: 10, green: 3 },
    null,
    'proportional_ev'
  );
  assert.strictEqual(propEv.rule, 'proportional_ev');
  assert.strictEqual(sumObj(propEv.evByParty), 54, 'Proportional EV must conserve all 54 EVs');
  assert.strictEqual(propEv.evByParty.green, 0, 'Below 5% floor receives 0 proportional EVs');
  assert.ok(propEv.evByParty.liberty >= 5, `Libertarian 10% share earns proportional EVs, got ${propEv.evByParty.liberty}`);
  assert.strictEqual(propEv.isSplit, true);

  // Winner-take-all
  const wta = VRC.allocateStatePresidentialEvs('OH', 17, { heritage: 52, people: 45, liberty: 3 }, null, 'winner_take_all');
  assert.strictEqual(wta.rule, 'winner_take_all');
  assert.strictEqual(wta.isSplit, false);
  assert.strictEqual(wta.evByParty.heritage, 17);
}
console.log('  PASS: Presidential EV allocation rules and EV conservation verified');

// 5. System Metadata Normalization
{
  const meDefault = VRC.normalizeStateElectoralSystemRecord('ME', null, false);
  assert.strictEqual(meDefault.presidentialEvRule, 'district_split');
  assert.strictEqual(meDefault.allRaces, 'plurality');
  assert.strictEqual(meDefault.isAntiSpoiler, false);

  const stvRec = VRC.normalizeStateElectoralSystemRecord('PA', { allRaces: 'plurality', legislative: 'stv' }, false);
  assert.strictEqual(stvRec.legislative, 'stv');
  assert.strictEqual(stvRec.effectiveSystem, 'stv');
  assert.strictEqual(stvRec.isAntiSpoiler, true);
  assert.strictEqual(stvRec.isProportional, true);

  const mmpRec = VRC.normalizeStateElectoralSystemRecord('MI', { allRaces: 'rcv', legislative: 'mmp', presidentialEvRule: 'proportional_ev' }, false);
  assert.strictEqual(mmpRec.allRaces, 'rcv');
  assert.strictEqual(mmpRec.legislative, 'mmp');
  assert.strictEqual(mmpRec.presidentialEvRule, 'proportional_ev');
  assert.strictEqual(mmpRec.isAntiSpoiler, true);

  const akDefault = VRC.normalizeStateElectoralSystemRecord('AK', null, false);
  assert.strictEqual(akDefault.allRaces, 'rcv');
  assert.strictEqual(akDefault.isAntiSpoiler, true);

  ['rcv', 'approval', 'proportional', 'open_list_proportional', 'stv', 'mmp'].forEach((sys) => {
    const rec = VRC.normalizeStateElectoralSystemRecord('OR', { allRaces: sys }, false);
    assert.strictEqual(rec.isAntiSpoiler, true, `Expected isAntiSpoiler=true for ${sys}`);
  });
}
console.log('  PASS: normalizeStateElectoralSystemRecord metadata & anti-spoiler flags verified');

console.log('ALL VOTING REFORMS CORE TESTS PASSED!');
