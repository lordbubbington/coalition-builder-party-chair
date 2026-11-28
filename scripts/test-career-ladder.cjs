'use strict';

const assert = require('assert');
const path = require('path');

global.window = global.window || global;
const CareerLadder = require(path.resolve(__dirname, '..', 'career-ladder.js'));

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== CAREER LADDER SYSTEM UNIT TEST SUITE ===');

test('1. UMD export exposes window.CareerLadderSystem and module.exports', () => {
  assert.ok(CareerLadder && typeof CareerLadder.getEligibleBenchCandidates === 'function');
  assert.strictEqual(global.window.CareerLadderSystem, CareerLadder);
});

test('2. Eligibility rules & prioritization: quality >= 8 fast-track, >= 1 term gates, scouted + Q7+ priority', () => {
  const game = {
    year: 2028,
    stateLegRoster: [
      {
        id: 'sh_fresh_q6',
        name: 'Freshman Average',
        office: 'stateHouse',
        seatId: 'PA-SH-001',
        stateId: 'PA',
        party: 'people',
        quality: 6,
        fame: 40,
        popularity: 50,
        termsServed: { stateHouse: 0, stateLeg: 0 },
      },
      {
        id: 'sh_fresh_q8',
        name: 'Prodigy Freshman',
        office: 'stateHouse',
        seatId: 'PA-SH-002',
        stateId: 'PA',
        party: 'people',
        quality: 8,
        fame: 42,
        popularity: 54,
        termsServed: { stateHouse: 0, stateLeg: 0 },
      },
      {
        id: 'sh_vet_q6',
        name: 'Seasoned Lawmaker',
        office: 'stateHouse',
        seatId: 'PA-SH-003',
        stateId: 'PA',
        party: 'people',
        quality: 6,
        fame: 45,
        popularity: 52,
        termsServed: { stateHouse: 2, stateLeg: 2 },
      },
      {
        id: 'ss_q6',
        name: 'Qualified State Sen',
        office: 'stateSenate',
        seatId: 'PA-SS-01',
        stateId: 'PA',
        party: 'people',
        quality: 6,
        fame: 48,
        popularity: 55,
        termsServed: { stateSenate: 1, stateLeg: 1 },
      },
      {
        id: 'ss_q5',
        name: 'Underqualified State Sen',
        office: 'stateSenate',
        seatId: 'PA-SS-02',
        stateId: 'PA',
        party: 'people',
        quality: 5,
        fame: 60,
        popularity: 60,
        termsServed: { stateSenate: 2, stateLeg: 2 },
      },
    ],
    sittingMembers: [
      {
        id: 'house_0term',
        name: 'Zero-Term Rep',
        office: 'house',
        districtId: 'PA-01',
        stateId: 'PA',
        party: 'people',
        quality: 8,
        fame: 55,
        termsServed: { house: 0 },
      },
      {
        id: 'house_1term',
        name: 'One-Term Rep',
        office: 'house',
        districtId: 'PA-02',
        stateId: 'PA',
        party: 'people',
        quality: 7,
        fame: 52,
        popularity: 56,
        termsServed: { house: 1 },
      },
      {
        id: 'sen_low_fame',
        name: 'Obscure Senator',
        office: 'senate',
        stateId: 'PA',
        senateClass: 1,
        party: 'people',
        quality: 8,
        fame: 25,
        termsServed: { senate: 1 },
      },
      {
        id: 'gov_star',
        name: 'Star Governor',
        office: 'governor',
        stateId: 'PA',
        party: 'people',
        quality: 8,
        fame: 74,
        popularity: 64,
        termsServed: { governor: 1 },
      },
    ],
  };

  // State House -> U.S. House (Prodigy Q8 with 0 terms + Seasoned 2-term Q6 eligible; Freshman Q6 with 0 terms NOT eligible)
  const houseCands = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'house' });
  const houseIds = houseCands.map((c) => c.id);
  assert.strictEqual(houseIds.includes('sh_fresh_q6'), false, '0-term Q6 State House rep must NOT qualify');
  assert.strictEqual(houseIds.includes('sh_fresh_q8'), true, '0-term Q8 State House rep MUST fast-track');
  assert.strictEqual(houseIds.includes('sh_vet_q6'), true, '>=1-term Q6 State House rep MUST qualify');
  assert.strictEqual(houseCands[0].id, 'sh_fresh_q8', 'Q8 rising star should outrank Q6 veteran');

  // U.S. House / State Senate -> U.S. Senate
  const senCands = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'senate' });
  const senIds = senCands.map((c) => c.id);
  assert.strictEqual(senIds.includes('house_1term'), true, '1-term US House rep eligible for Senate');
  assert.strictEqual(senIds.includes('ss_q6'), true, 'Q6 State Senator eligible for Senate');
  assert.strictEqual(senIds.includes('house_0term'), false, '0-term US House rep not eligible');
  assert.strictEqual(senIds.includes('ss_q5'), false, 'Q5 State Senator not eligible');

  // Governor / Senate -> President
  const presCands = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', targetOffice: 'president' });
  const presIds = presCands.map((c) => c.id);
  assert.strictEqual(presIds.includes('gov_star'), true, 'High-fame Q8 Governor eligible for President');
  assert.strictEqual(presIds.includes('sen_low_fame'), false, 'Low-fame Senator excluded from President');
});

test('3. Toggle scout watchlist lifts scouted candidate cleanly to top of bench rankings', () => {
  let game = {
    year: 2028,
    stateLegRoster: [
      { id: 'c_high', name: 'Higher Rating', office: 'stateHouse', stateId: 'PA', party: 'people', quality: 8, fame: 60, termsServed: { stateHouse: 2 } },
      { id: 'c_scout', name: 'Underdog Pick', office: 'stateHouse', stateId: 'PA', party: 'people', quality: 6, fame: 30, termsServed: { stateHouse: 1 } },
    ],
  };

  let ranked = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'house' });
  assert.strictEqual(ranked[0].id, 'c_high');

  game = CareerLadder.toggleScoutPolitician(game, 'c_scout');
  assert.strictEqual(game.scoutedPoliticianIds.includes('c_scout'), true);
  ranked = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'house' });
  assert.strictEqual(ranked[0].id, 'c_scout', 'Scouted candidate must rank #1');
  assert.strictEqual(ranked[0].scouted, true);

  game = CareerLadder.toggleScoutPolitician(game, 'c_scout');
  assert.strictEqual(game.scoutedPoliticianIds.includes('c_scout'), false);
  ranked = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'house' });
  assert.strictEqual(ranked[0].id, 'c_high', 'Unscouted order restored');
});

test('4. Full Quality 9 Career Ladder: State House -> U.S. House -> U.S. Senate -> President with intact stats, milestones & vacated seats', () => {
  const starId = 'cand_q9_rising_star';
  let game = {
    year: 2028,
    stateLegRoster: [
      {
        id: starId,
        name: 'Elena Mercer',
        gender: 'F',
        party: 'people',
        partyId: 'people',
        factionId: 'dem_abundance',
        stateId: 'PA',
        stateName: 'Pennsylvania',
        seatId: 'PA-SH-042',
        office: 'stateHouse',
        chamber: 'lower',
        age: 34,
        quality: 9,
        ratings: {
          persuadability: 9,
          turnout: 9,
          debate: 9,
          charisma: 9,
          corruption: 2,
          fundraising: 8,
          fieldcraft: 9,
          experience: 6,
          mediaSavvy: 9,
          regionalStrength: 8,
        },
        fame: 36,
        rawPopularity: 72,
        popularity: 42,
        termsServed: { stateHouse: 2, stateSenate: 0, stateLeg: 2, house: 0, senate: 0, governor: 0, president: 0 },
        careerMilestones: [
          { year: 2024, office: 'stateHouse', stateId: 'PA', seatId: 'PA-SH-042', description: 'Elected to PA State House (PA-SH-042)' },
        ],
      },
    ],
    sittingMembers: [],
    representatives: [
      { id: 'rep_pa_07_old', districtId: 'PA-07', stateId: 'PA', party: 'heritage', openSeat: true, vacant: true },
    ],
    politicians: [],
  };

  // --- STEP 1: State House -> U.S. House (PA-07) ---
  const houseBench = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'house' });
  assert.strictEqual(houseBench.length, 1);
  assert.strictEqual(houseBench[0].id, starId);

  game.year = 2030;
  game = CareerLadder.promotePoliticianToOffice(game, starId, 'house', {
    stateId: 'PA',
    stateName: 'Pennsylvania',
    districtId: 'PA-07',
    year: 2030,
  });

  // Lower State House seat PA-SH-042 must be cleanly vacated
  const oldShSeat = game.stateLegRoster.find((r) => r.seatId === 'PA-SH-042');
  assert.strictEqual(oldShSeat.incumbentId, null, 'PA State House seat incumbentId must be null after promotion');
  assert.strictEqual(oldShSeat.openSeat, true, 'PA State House seat must be marked openSeat=true');
  assert.strictEqual(oldShSeat.vacant, true);

  let pol = CareerLadder.findPoliticianRecord(game, starId);
  assert.strictEqual(pol.id, starId);
  assert.strictEqual(pol.name, 'Elena Mercer');
  assert.strictEqual(pol.gender, 'F');
  assert.strictEqual(pol.factionId, 'dem_abundance');
  assert.strictEqual(pol.quality, 9);
  assert.strictEqual(pol.ratings.charisma, 9);
  assert.strictEqual(pol.office, 'house');
  assert.strictEqual(pol.termsServed.stateHouse, 2);
  assert.strictEqual(pol.termsServed.house, 1);
  assert.strictEqual(pol.careerMilestones.length, 2);
  assert.strictEqual(
    pol.careerMilestones[1].description,
    'Elected U.S. Representative (PA-07) after 2 terms in PA State House (PA-SH-042)'
  );

  // --- STEP 2: U.S. House -> U.S. Senate (PA) ---
  const senateBench = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', stateId: 'PA', targetOffice: 'senate' });
  assert.strictEqual(senateBench.some((c) => c.id === starId), true, 'Promoted U.S. House Rep must qualify for U.S. Senate bench');

  game.year = 2034;
  game = CareerLadder.promotePoliticianToOffice(game, starId, 'senate', {
    stateId: 'PA',
    stateName: 'Pennsylvania',
    senateClass: 1,
    year: 2034,
  });

  // Previous U.S. House seat PA-07 must be vacated
  const oldHouseRep = game.representatives.find((r) => r.districtId === 'PA-07');
  assert.strictEqual(oldHouseRep.incumbentId, null, 'PA-07 representative seat must be vacated on Senate promotion');
  assert.strictEqual(oldHouseRep.openSeat, true);
  const oldHouseSitting = game.sittingMembers.find((m) => m.office === 'house' && m.districtId === 'PA-07');
  assert.strictEqual(oldHouseSitting.incumbentId, null, 'PA-07 sittingMember slot must be vacated');
  assert.strictEqual(oldHouseSitting.openSeat, true);

  pol = CareerLadder.findPoliticianRecord(game, starId);
  assert.strictEqual(pol.id, starId);
  assert.strictEqual(pol.name, 'Elena Mercer');
  assert.strictEqual(pol.quality, 9);
  assert.strictEqual(pol.office, 'senate');
  assert.deepStrictEqual(pol.termsServed, {
    stateHouse: 2,
    stateSenate: 0,
    stateLeg: 2,
    house: 1,
    senate: 1,
    governor: 0,
    president: 0,
  });
  assert.strictEqual(pol.careerMilestones.length, 3);
  assert.ok(/U\.S\. Senator \(PA\)/.test(pol.careerMilestones[2].description));

  // --- STEP 3: U.S. Senate -> President ---
  const presBench = CareerLadder.getEligibleBenchCandidates(game, { partyId: 'people', targetOffice: 'president' });
  assert.strictEqual(presBench.some((c) => c.id === starId), true, 'High-fame Q9 Senator must qualify for Presidential bench');

  game.year = 2036;
  game = CareerLadder.promotePoliticianToOffice(game, starId, 'president', { year: 2036 });

  const oldSenSlot = game.sittingMembers.find((m) => m.office === 'senate' && m.stateId === 'PA');
  assert.strictEqual(oldSenSlot.incumbentId, null, 'PA Senate seat must be vacated on Presidential promotion');
  assert.strictEqual(oldSenSlot.openSeat, true);

  pol = CareerLadder.findPoliticianRecord(game, starId);
  assert.strictEqual(pol.id, starId);
  assert.strictEqual(pol.name, 'Elena Mercer');
  assert.strictEqual(pol.gender, 'F');
  assert.strictEqual(pol.party, 'people');
  assert.strictEqual(pol.factionId, 'dem_abundance');
  assert.strictEqual(pol.quality, 9);
  assert.strictEqual(pol.office, 'president');
  assert.deepStrictEqual(pol.termsServed, {
    stateHouse: 2,
    stateSenate: 0,
    stateLeg: 2,
    house: 1,
    senate: 1,
    governor: 0,
    president: 1,
  });
  assert.strictEqual(pol.careerMilestones.length, 4);
  assert.ok(/President of the United States/.test(pol.careerMilestones[3].description));
});

console.log(`\nALL ${passed}/4 CAREER LADDER TESTS PASSED.`);
