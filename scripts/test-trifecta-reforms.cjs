/**
 * Verification Test Suite: Nationwide Trifecta Reforms Core
 * Covers:
 *   1. Strict Trifecta Gate (requires Presidency + House majority + Senate majority)
 *   2. Huntington-Hill House Apportionment across all 50 states (435, 573, 692, 1000)
 *   3. Sabato Proposal 1 (136-seat Senate: DC=1, CA=4, NJ=3, WY=2, majority=69, honorary National Senators)
 *   4. Sabato Proposals 2, 3, 4, 5 (1000-House+Nonpartisan, Mended EC, Regional Lottery Primaries, Term/Cycle Overhaul)
 *   5. Compulsory Voting (88%-92% floor + repeal) & Ban Super-PACs (disable + repeal)
 */

const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const Trifecta = require(path.join(ROOT, 'trifecta-reforms-core.js'));

function makeSittingMembers({ demHouse = 225, repHouse = 210, demSenate = 52, repSenate = 48 }) {
  const members = [];
  for (let i = 0; i < demHouse; i += 1) members.push({ id: `h_d_${i}`, office: 'house', party: 'people' });
  for (let i = 0; i < repHouse; i += 1) members.push({ id: `h_r_${i}`, office: 'house', party: 'heritage' });
  for (let i = 0; i < demSenate; i += 1) members.push({ id: `s_d_${i}`, office: 'senate', party: 'people' });
  for (let i = 0; i < repSenate; i += 1) members.push({ id: `s_r_${i}`, office: 'senate', party: 'heritage' });
  return members;
}

function runAllTests() {
  assert(Trifecta && typeof Trifecta.hasNationwideTrifecta === 'function', 'Module exports missing');

  // --------------------------------------------------------------------------
  // TEST 1: Strict Trifecta Gate Blocks Divided Government
  // --------------------------------------------------------------------------
  const noHouseGame = {
    year: 2029,
    governingParty: 'people',
    player: { custom: false, baseTemplateId: 'people' },
    sittingMembers: makeSittingMembers({ demHouse: 215, repHouse: 220, demSenate: 54, repSenate: 46 }),
  };
  assert.strictEqual(Trifecta.hasNationwideTrifecta(noHouseGame, 'people'), false, 'Missing House majority must block trifecta');
  const blockedRes = Trifecta.applyTrifectaReform(noHouseGame, 'ban_super_pacs', 'people');
  assert.strictEqual(blockedRes.ok, false);
  assert.strictEqual(blockedRes.enacted, false);
  assert.strictEqual(Trifecta.isSuperPacsDisabled(noHouseGame), false, 'Blocked reform must not mutate federalReforms');

  const noSenateGame = {
    year: 2029,
    governingParty: 'people',
    sittingMembers: makeSittingMembers({ demHouse: 230, repHouse: 205, demSenate: 50, repSenate: 50 }),
  };
  assert.strictEqual(Trifecta.hasNationwideTrifecta(noSenateGame, 'people'), false, '50 Senate seats without majority must block trifecta');

  const noPresGame = {
    year: 2029,
    governingParty: 'heritage',
    sittingMembers: makeSittingMembers({ demHouse: 230, repHouse: 205, demSenate: 55, repSenate: 45 }),
  };
  assert.strictEqual(Trifecta.hasNationwideTrifecta(noPresGame, 'people'), false, 'Missing Presidency must block trifecta');

  const trifectaGame = {
    year: 2029,
    seed: 202801,
    governingParty: 'people',
    player: { custom: false, baseTemplateId: 'people' },
    sittingMembers: makeSittingMembers({ demHouse: 225, repHouse: 210, demSenate: 53, repSenate: 47 }),
    superPacs: [
      { id: 'pac_1', name: 'Labor Action PAC', pool: 15, activeDemand: { id: 'd1', status: 'pending' } },
    ],
    log: [],
  };
  assert.strictEqual(Trifecta.hasNationwideTrifecta(trifectaGame, 'people'), true, 'Full control must pass trifecta check');
  assert.strictEqual(Trifecta.hasNationwideTrifecta(trifectaGame, 'heritage'), false);

  console.log('PASS [Test 1] Strict Nationwide Trifecta gate blocks divided control and allows full trifecta.');

  // --------------------------------------------------------------------------
  // TEST 2: Huntington-Hill House Apportionment Exact Totals (435, 573, 692, 1000)
  // --------------------------------------------------------------------------
  const app435 = Trifecta.computeHouseApportionment('standard_435');
  const sum435 = Object.values(app435.seatsByState).reduce((s, n) => s + n, 0);
  assert.strictEqual(app435.totalSeats, 435);
  assert.strictEqual(sum435, 435);
  assert.strictEqual(app435.majorityThreshold, 218);
  assert.strictEqual(Object.keys(app435.seatsByState).length, 50);
  assert.strictEqual(app435.seatsByState.CA, 52, '2020 apportionment CA must be 52');
  assert.strictEqual(app435.seatsByState.TX, 38, '2020 apportionment TX must be 38');
  assert.strictEqual(app435.seatsByState.WY, 1, '2020 apportionment WY must be 1');
  assert.strictEqual(app435.seatsByState.MT, 2, '2020 apportionment MT must be 2');

  const app573 = Trifecta.computeHouseApportionment('wyoming_rule');
  const sum573 = Object.values(app573.seatsByState).reduce((s, n) => s + n, 0);
  assert.strictEqual(app573.totalSeats, 573);
  assert.strictEqual(sum573, 573);
  assert.strictEqual(app573.majorityThreshold, 287);
  assert.strictEqual(app573.dynamicWyomingPop, false, 'dynamicWyomingPop flag must default to false');

  const app692 = Trifecta.computeHouseApportionment('cube_root_rule');
  const sum692 = Object.values(app692.seatsByState).reduce((s, n) => s + n, 0);
  assert.strictEqual(app692.totalSeats, 692);
  assert.strictEqual(sum692, 692);
  assert.strictEqual(app692.majorityThreshold, 347);

  const app1000 = Trifecta.computeHouseApportionment('sabato_1000');
  const sum1000 = Object.values(app1000.seatsByState).reduce((s, n) => s + n, 0);
  assert.strictEqual(app1000.totalSeats, 1000);
  assert.strictEqual(sum1000, 1000);
  assert.strictEqual(app1000.majorityThreshold, 501);
  assert(Object.values(app1000.seatsByState).every((n) => n >= 1), 'Every state must hold >= 1 House seat');

  console.log('PASS [Test 2] House apportionment verified: 435 (maj 218), 573 (maj 287), 692 (maj 347), 1000 (maj 501).');

  // --------------------------------------------------------------------------
  // TEST 3: Sabato 136-Seat Senate (DC=1, CA=4, NJ=3, WY=2, Majority=69)
  // --------------------------------------------------------------------------
  const senRes = Trifecta.applyTrifectaReform(trifectaGame, 'sabato_senate_136', 'people');
  assert.strictEqual(senRes.ok, true);
  assert.strictEqual(senRes.senate.totalSeats, 136);
  assert.strictEqual(senRes.senate.majorityThreshold, 69);
  assert.strictEqual(senRes.senate.seatsByState.DC, 1, 'DC must have 1 Senator');
  assert.strictEqual(senRes.senate.seatsByState.CA, 4, 'Top-10 state CA must have 4 Senators');
  assert.strictEqual(senRes.senate.seatsByState.NJ, 3, 'Next-15 state NJ must have 3 Senators');
  assert.strictEqual(senRes.senate.seatsByState.WY, 2, 'Remaining state WY must have 2 Senators');
  assert.strictEqual(
    Object.values(senRes.senate.seatsByState).reduce((s, n) => s + n, 0),
    136,
    'Sum of Senate seats across 50 states + DC must equal 136'
  );
  assert(Array.isArray(trifectaGame.federalReforms.nationalSenators) && trifectaGame.federalReforms.nationalSenators.length >= 1, 'Honorary National Senators must be populated');

  // Verify trifecta gate dynamically updates Senate majority threshold from 51 -> 69!
  assert.strictEqual(
    Trifecta.hasNationwideTrifecta(trifectaGame, 'people'),
    false,
    '53 Senate seats must no longer satisfy 136-seat Senate majority threshold (69)'
  );
  // Restore Senate majority to 70 so remaining trifecta reforms can be enacted
  trifectaGame.senateSeatsByParty = { people: 70, heritage: 66 };
  assert.strictEqual(Trifecta.hasNationwideTrifecta(trifectaGame, 'people'), true);

  console.log('PASS [Test 3] Sabato 136-Seat Senate (DC=1, CA=4, NJ=3, WY=2, majority=69, National Senators) verified.');

  // --------------------------------------------------------------------------
  // TEST 4: Sabato Proposals 2, 3, 4, 5 & House Expansion Sync
  // --------------------------------------------------------------------------
  const h1000Res = Trifecta.applyTrifectaReform(trifectaGame, 'sabato_house_1000', 'people');
  assert.strictEqual(h1000Res.ok, true);
  assert.strictEqual(trifectaGame.totalHouseSeats, 1000);
  assert.strictEqual(trifectaGame.houseMajorityThreshold, 501);
  assert.strictEqual(Trifecta.isNonpartisanRedistrictingMandated(trifectaGame), true);

  // Restore House majority to 510 for 1000-seat chamber before remaining checks
  trifectaGame.houseSeatsByParty = { people: 510, heritage: 490 };

  const preMendedEv = trifectaGame.totalEv;
  const ecRes = Trifecta.applyTrifectaReform(trifectaGame, 'sabato_mended_ec', 'people');
  assert.strictEqual(ecRes.ok, true);
  assert(trifectaGame.totalEv > preMendedEv, 'Mended EC must add bonus population electors to total EV');
  assert(trifectaGame.federalReforms.bonusEvByState.CA > trifectaGame.federalReforms.bonusEvByState.NJ, 'Bonus EVs must scale with population');

  const regRes = Trifecta.applyTrifectaReform(trifectaGame, 'sabato_regional_primaries', 'people');
  assert.strictEqual(regRes.ok, true);
  const sched2028 = Trifecta.getRegionalPrimarySchedule(202801, 2028);
  const sched2032 = Trifecta.getRegionalPrimarySchedule(202801, 2032);
  assert.strictEqual(sched2028.waves.length, 4);
  assert.deepStrictEqual([...sched2028.order].sort(), ['Midwest', 'Northeast', 'South', 'West']);
  assert.strictEqual(Object.keys(sched2028.waveByState).length, 51, 'All 50 states + DC mapped to regional primary wave');
  assert.strictEqual(sched2028.waves.length, sched2032.waves.length);

  const termRes = Trifecta.applyTrifectaReform(trifectaGame, 'sabato_term_cycle_overhaul', 'people');
  assert.strictEqual(termRes.ok, true);
  assert.strictEqual(Trifecta.getPresidentialTermYears(trifectaGame), 6);
  assert.strictEqual(trifectaGame.federalReforms.presidentialRetentionReferendum, true);
  assert.strictEqual(trifectaGame.federalReforms.syncedSenateCycles, true);
  assert.deepStrictEqual(trifectaGame.federalReforms.congressionalTermLimits, { enabled: true, houseMaxTerms: 4, senateMaxTerms: 2 });
  assert.strictEqual(Trifecta.getCampaignBurnMultiplier(trifectaGame), 0.75);

  console.log('PASS [Test 4] Sabato Proposals 2, 3, 4, and 5 verified with live threshold & EV recalculation.');

  // --------------------------------------------------------------------------
  // TEST 5: Compulsory Voting (88%-92% floor) & Reversible Ban Super-PACs
  // --------------------------------------------------------------------------
  assert.strictEqual(Trifecta.applyCompulsoryVotingTurnout(54, trifectaGame), 54, 'Inactive compulsory voting leaves turnout unchanged');
  const cvRes = Trifecta.applyTrifectaReform(trifectaGame, 'compulsory_voting', 'people');
  assert.strictEqual(cvRes.ok, true);
  assert.strictEqual(trifectaGame.federalReforms.compulsoryVoting, true);

  for (const base of [35, 50, 62, 78, 90]) {
    const lifted = Trifecta.applyCompulsoryVotingTurnout(base, trifectaGame);
    assert(lifted >= 88 && lifted <= 92, `Compulsory voting must lift base ${base}% into [88%, 92%], got ${lifted}%`);
  }
  const fracLifted = Trifecta.applyCompulsoryVotingTurnout(0.52, trifectaGame);
  assert(fracLifted >= 0.88 && fracLifted <= 0.92, `Fractional turnout must lift into [0.88, 0.92], got ${fracLifted}`);

  const pacBanRes = Trifecta.applyTrifectaReform(trifectaGame, 'ban_super_pacs', 'people');
  assert.strictEqual(pacBanRes.ok, true);
  assert.strictEqual(Trifecta.isSuperPacsDisabled(trifectaGame), true, 'Super-PACs must be disabled after ban');
  assert.strictEqual(trifectaGame.superPacs[0].activeDemand, null, 'Pending Super-PAC demand must clear on ban');

  const pacRepealRes = Trifecta.applyTrifectaReform(trifectaGame, 'repeal_super_pac_ban', 'people');
  assert.strictEqual(pacRepealRes.ok, true);
  assert.strictEqual(Trifecta.isSuperPacsDisabled(trifectaGame), false, 'Super-PACs must be cleanly re-enabled after repeal');
  assert.strictEqual(trifectaGame.superPacs[0].banned, false);
  assert.strictEqual(trifectaGame.superPacs[0].pool, 15, 'Paused Super-PAC state cleanly restored on repeal');

  console.log('PASS [Test 5] Compulsory voting (88%-92%) & reversible Ban Super-PACs verified.');
  console.log('ALL TRIFECTA REFORMS TESTS PASSED!');
}

runAllTests();
