/**
 * Verification Test Suite: 7,386-Seat State Legislature Bench & Synthetic District Curves
 * Covers:
 *   1. Exact 5,462 State House + 1,924 State Senate initialization (7,386 unique politicians)
 *   2. DC skipped, Nebraska unicameral nonpartisan handling, starting party total parity
 *   3. Candidate Quality low-average baseline (~3.5 mean) and Q10 vs Q1 (~20-pt swing)
 *   4. Staggered State Senate (~50% Group B / ~55% national) & 4-year State House holdovers
 *   5. Tier 1-4 partial slates (top 20%-80% district selection) & organic pocket breakthroughs
 *   6. RCV, Proportional representation, aging (+2 yrs), and term-limit retirements
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

function loadRepoDataAndBench() {
  const win = {};
  const ctx = vm.createContext({
    window: win,
    globalThis: win,
    console,
    Math,
    Object,
    Array,
    Number,
    String,
    Set,
    Map,
    JSON,
    Uint8Array,
    Blob: globalThis.Blob,
    DecompressionStream: globalThis.DecompressionStream,
    Response: globalThis.Response,
    TextDecoder: globalThis.TextDecoder,
    TextEncoder: globalThis.TextEncoder,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  });

  for (const file of ['data.js', 'factions-0.15.js', 'maps-0.3.js', 'state-house-data-0.5.js']) {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath)) {
      vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx);
    }
  }

  // Load state-leg-bench.js inside the same context so window.PartyChairData is visible,
  // and also test direct CommonJS require in Test 1b.
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'state-leg-bench.js'), 'utf8'), ctx);
  return {
    PartyChairData: win.PartyChairData,
    StateLegBenchSystem: win.StateLegBenchSystem,
  };
}

function runAllTests() {
  const { PartyChairData, StateLegBenchSystem } = loadRepoDataAndBench();
  const cjsBench = require(path.join(ROOT, 'state-leg-bench.js'));
  assert(cjsBench && typeof cjsBench.initializeStateLegBench === 'function', 'CommonJS export missing');
  assert(StateLegBenchSystem && typeof StateLegBenchSystem.buildStateLegDistricts === 'function', 'Global export missing');

  // --------------------------------------------------------------------------
  // TEST 1: Exact 5,462 State House + 1,924 State Senate Initialization & Party Totals
  // --------------------------------------------------------------------------
  const game = {
    seed: 202804,
    year: 2028,
    nationalEnvironment: 0,
    player: { custom: false, baseTemplateId: 'people' },
  };
  StateLegBenchSystem.initializeStateLegBench(game);

  const summary = StateLegBenchSystem.getSeatSummaryStats(game);
  assert.strictEqual(summary.houseSeats, 5462, `Expected 5,462 State House seats, got ${summary.houseSeats}`);
  assert.strictEqual(summary.senateSeats, 1924, `Expected 1,924 State Senate seats, got ${summary.senateSeats}`);
  assert.strictEqual(summary.totalSeats, 7386, `Expected 7,386 total seats, got ${summary.totalSeats}`);

  assert.strictEqual(game.stateLegDistricts.DC, undefined, 'DC must be excluded from state leg districts');
  assert(game.stateLegDistricts.NE && game.stateLegDistricts.NE.unicameral === true, 'NE must be flagged unicameral');
  assert.strictEqual(game.stateLegDistricts.NE.house.length, 49, 'NE unicameral must have 49 seats');
  assert.strictEqual(game.stateLegDistricts.NE.senate.length, 0, 'NE must have 0 duplicate upper-chamber seats');
  assert(game.stateLegDistricts.NE.house.every((d) => d.nonpartisan === true), 'NE seats must be nonpartisan');

  const rosterIds = Object.keys(game.stateLegRoster);
  assert.strictEqual(rosterIds.length, 7386, `Expected 7,386 unique roster records, got ${rosterIds.length}`);

  const seenIncumbents = new Set();
  const seenDistrictIds = new Set();
  for (const [stId, entry] of Object.entries(game.stateLegDistricts)) {
    if (stId === '_meta') continue;
    for (const d of [...entry.house, ...entry.senate]) {
      assert(!seenDistrictIds.has(d.id), `Duplicate district id: ${d.id}`);
      seenDistrictIds.add(d.id);
      assert(d.incumbentId && game.stateLegRoster[d.incumbentId], `Missing incumbent for ${d.id}`);
      assert(!seenIncumbents.has(d.incumbentId), `Duplicate incumbent politician id: ${d.incumbentId}`);
      seenIncumbents.add(d.incumbentId);

      const pol = game.stateLegRoster[d.incumbentId];
      assert.strictEqual(pol.stateId, stId);
      assert.strictEqual(pol.districtId, d.id);
      assert(pol.name && pol.gender && pol.party && pol.factionId, `Incomplete identity fields on ${pol.id}`);
      assert(pol.age >= 26 && pol.age <= 74, `Invalid age ${pol.age} on ${pol.id}`);
      assert(pol.quality >= 1 && pol.quality <= 10, `Invalid quality ${pol.quality} on ${pol.id}`);
      assert(pol.ratings && Number.isFinite(pol.ratings.charisma), `Missing 10-stat ratings on ${pol.id}`);
      assert(pol.termsServed && Number.isFinite(pol.termsServed.stateHouse) && Number.isFinite(pol.termsServed.house));
      assert(Array.isArray(pol.careerMilestones) && pol.careerMilestones.length >= 1);
      assert.strictEqual(pol.scouted, false);
    }

    // Verify starting roster party counts match starting seat counts per state
    const expectedH = game.stateHouseSeatCounts[stId];
    const actualH = entry.house.reduce((acc, d) => {
      const p = game.stateLegRoster[d.incumbentId].party;
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    assert.strictEqual(actualH.people || 0, expectedH.people || 0, `${stId} House people mismatch`);
    assert.strictEqual(actualH.heritage || 0, expectedH.heritage || 0, `${stId} House heritage mismatch`);
    assert.strictEqual(actualH.other || 0, expectedH.other || 0, `${stId} House other mismatch`);
    assert.strictEqual(
      actualH.independent || 0,
      (expectedH.independent || 0) + (expectedH.unallocated || 0),
      `${stId} House independent/unallocated fill mismatch`
    );

    if (stId !== 'NE') {
      const expectedS = game.stateSenateSeatCounts[stId];
      const actualS = entry.senate.reduce((acc, d) => {
        const p = game.stateLegRoster[d.incumbentId].party;
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {});
      assert.strictEqual(actualS.people || 0, expectedS.people || 0, `${stId} Senate people mismatch`);
      assert.strictEqual(actualS.heritage || 0, expectedS.heritage || 0, `${stId} Senate heritage mismatch`);
      assert.strictEqual(actualS.other || 0, expectedS.other || 0, `${stId} Senate other mismatch`);
    }
  }

  assert(
    summary.meanQuality >= 3.35 && summary.meanQuality <= 3.65,
    `Expected mean starting bench quality near 3.50, got ${summary.meanQuality}`
  );

  // Verify PA tipping-point exists cleanly
  const paTip = StateLegBenchSystem.getChamberTippingPoint(game, 'PA', 'house');
  assert(paTip && paTip.totalSeats === 203 && paTip.districtId.startsWith('PA-SH-'));

  console.log(`PASS [Test 1] 7,386 seats/politicians initialized (5,462 House + 1,924 Senate), meanQuality=${summary.meanQuality}, exact party totals matched.`);

  // --------------------------------------------------------------------------
  // TEST 2: Staggered State Senate Holdovers (~50% up per cycle) & 4-Year House
  // --------------------------------------------------------------------------
  const paPreIncumbents2028 = Object.fromEntries(
    game.stateLegDistricts.PA.senate.map((d) => [d.id, { incId: d.incumbentId, age: game.stateLegRoster[d.incumbentId].age, senClass: d.senateClass }])
  );
  const alPreHouse2028 = Object.fromEntries(
    game.stateLegDistricts.AL.house.map((d) => [d.id, { incId: d.incumbentId, age: game.stateLegRoster[d.incumbentId].age }])
  );

  const res2028 = StateLegBenchSystem.resolveStateLegElections(game, null, { year: 2028 });
  const senateHoldovers2028 = [];
  const senateUp2028 = [];

  Object.entries(game.stateLegDistricts).forEach(([stId, entry]) => {
    if (stId === '_meta' || stId === 'NE') return;
    entry.senate.forEach((d) => {
      if (d.lastResult.heldOver) senateHoldovers2028.push(d.id);
      else senateUp2028.push(d.id);
    });
  });

  const upShare2028 = senateUp2028.length / 1924;
  assert(upShare2028 >= 0.45 && upShare2028 <= 0.65, `Expected ~50%-60% State Senate up in 2028, got ${(upShare2028 * 100).toFixed(1)}%`);

  // Group B staggered chamber (PA: 50 seats -> exactly 25 up Class A, 25 heldover Class B)
  const paUp = game.stateLegDistricts.PA.senate.filter((d) => !d.lastResult.heldOver);
  const paHeld = game.stateLegDistricts.PA.senate.filter((d) => d.lastResult.heldOver);
  assert.strictEqual(paUp.length, 25, `PA Senate should have 25 seats up in 2028, got ${paUp.length}`);
  assert.strictEqual(paHeld.length, 25, `PA Senate should have 25 holdover seats in 2028, got ${paHeld.length}`);
  paHeld.forEach((d) => {
    assert.strictEqual(d.senateClass, 'B');
    assert.strictEqual(d.incumbentId, paPreIncumbents2028[d.id].incId, `Holdover ${d.id} must retain exact incumbent`);
    assert.strictEqual(game.stateLegRoster[d.incumbentId].age, paPreIncumbents2028[d.id].age + 2, 'Holdover incumbent must age +2 years');
  });

  // 4-year State House state AL must hold over in 2028 (presidential year) and resolve in 2030 (midterm)
  const alUp2028 = game.stateLegDistricts.AL.house.filter((d) => !d.lastResult.heldOver);
  assert.strictEqual(alUp2028.length, 0, 'AL 4-year State House must hold over during 2028 presidential cycle');
  game.stateLegDistricts.AL.house.forEach((d) => {
    assert.strictEqual(d.incumbentId, alPreHouse2028[d.id].incId);
  });

  // Resolve 2030 midterm: PA Class B up / Class A held over; AL House 100% up
  game.year = 2030;
  StateLegBenchSystem.resolveStateLegElections(game, null, { year: 2030 });
  const alUp2030 = game.stateLegDistricts.AL.house.filter((d) => !d.lastResult.heldOver);
  assert.strictEqual(alUp2030.length, 105, 'AL 4-year State House must resolve all 105 seats in 2030 midterm');
  const paUp2030 = game.stateLegDistricts.PA.senate.filter((d) => !d.lastResult.heldOver);
  assert.strictEqual(paUp2030.length, 25, 'PA Senate Class B (25 seats) must be up in 2030');
  assert(paUp2030.every((d) => d.senateClass === 'B'), 'PA 2030 Senate seats up must be Class B');
  assert(res2028.lastCycleResults.stateLeg.totalSeats === 7386);

  console.log(`PASS [Test 2] Staggered holdovers verified: 2028 Senate up=${senateUp2028.length}/1924 (${(upShare2028 * 100).toFixed(1)}%), PA 25/25 split, AL 4-year House cycle verified.`);

  // --------------------------------------------------------------------------
  // TEST 3: Quality 10 vs Quality 1 Outperforms by ~20 Points in Same District
  // --------------------------------------------------------------------------
  const qGame = { seed: 999, year: 2028 };
  StateLegBenchSystem.initializeStateLegBench(qGame);
  const testDist = qGame.stateLegDistricts.WI.house[0];
  // Neutralize pocket/lean/incumbency noise so quality effect is isolated cleanly in the district
  testDist.leanOffset = 0;
  testDist.factionPocket = 'swg_true_centrists';
  testDist.factionPocketParty = 'independent';
  testDist.factionPocketBonus = 0;
  testDist.openSeat = true;
  testDist.incumbentId = null;

  const shares50 = { WI: { people: 50, heritage: 50 } };
  const qRes1 = StateLegBenchSystem.resolveStateLegElections(qGame, shares50, {
    year: 2028,
    noiseAmplitude: 0,
    preSelectedCandidates: {
      [testDist.id]: {
        people: { id: 'test_dem_q10', name: 'Phenom Dem', quality: 10, factionId: 'dem_liberal_establishment' },
        heritage: { id: 'test_rep_q1', name: 'Disastrous Rep', quality: 1, factionId: 'gop_maga' },
      },
    },
  });
  const distOut = qRes1.lastCycleResults.stateLeg.districtsById[testDist.id];
  const demStanding = distOut.candidates.find((c) => c.party === 'people');
  const repStanding = distOut.candidates.find((c) => c.party === 'heritage');
  const h2hGap = Math.round((demStanding.voteShare - repStanding.voteShare) * 100) / 100;

  assert.strictEqual(demStanding.persuasionDelta, 10);
  assert.strictEqual(repStanding.persuasionDelta, -10);
  assert(
    Math.abs(h2hGap - 20.0) <= 0.1,
    `Expected Q10 (+10) vs Q1 (-10) vote gap of ~20.0 pts in 50/50 district, got ${h2hGap} (${demStanding.voteShare}% vs ${repStanding.voteShare}%)`
  );
  assert.strictEqual(distOut.winnerId, 'test_dem_q10', 'Q10 candidate must win the 50/50 district over Q1 opponent');

  console.log(`PASS [Test 3] Quality persuasion swing verified: Q10=${demStanding.voteShare}% vs Q1=${repStanding.voteShare}% (gap=${h2hGap} pts).`);

  // --------------------------------------------------------------------------
  // TEST 4: Tier 1-4 Partial Slates & Organic Faction-Pocket Breakthrough
  // --------------------------------------------------------------------------
  const mGame = {
    seed: 777,
    year: 2028,
    player: { custom: false, baseTemplateId: 'liberty' },
    partyTiers: { people: 5, heritage: 5, liberty: 2 },
    contestedStateHouseSlates: { PA: 1, NH: 2 }, // Tier 1 = 20%, Tier 2 = 40%
    stateElectoralSystems: {
      NH: { allRaces: 'rcv', legislative: 'rcv' },
      OR: { allRaces: 'plurality', legislative: 'proportional' },
    },
    ballotAccess: { liberty: { leg: { PA: true, NH: true, OR: true } } },
  };
  StateLegBenchSystem.initializeStateLegBench(mGame);

  // Boost one Libertarian rising star in a competitive NH liberty-pocket district to verify organic upset capability
  const nhLibPocket = mGame.stateLegDistricts.NH.house
    .filter((d) => d.factionPocketParty === 'liberty')
    .sort((a, b) => Math.abs(a.leanOffset) - Math.abs(b.leanOffset))[0]
    || mGame.stateLegDistricts.NH.house.slice().sort((a, b) => Math.abs(a.leanOffset) - Math.abs(b.leanOffset))[0];
  nhLibPocket.factionPocket = 'lib_true_libertarians';
  nhLibPocket.factionPocketParty = 'liberty';
  nhLibPocket.factionPocketBonus = 13.5;

  const mShares = {
    PA: { people: 46, heritage: 46, liberty: 8 },
    NH: { people: 42, heritage: 42, liberty: 16 },
    OR: { people: 50, heritage: 38, liberty: 12 },
  };
  const mRes = StateLegBenchSystem.resolveStateLegElections(mGame, mShares, {
    year: 2028,
    preSelectedCandidates: {
      [nhLibPocket.id]: {
        liberty: { id: 'test_nh_lib_star', name: 'Free State Star', quality: 9, factionId: 'lib_true_libertarians' },
        people: { id: 'test_nh_dem_weak', name: 'Weak Dem', quality: 2, factionId: 'dem_liberal_establishment' },
        heritage: { id: 'test_nh_rep_weak', name: 'Weak Rep', quality: 2, factionId: 'gop_maga' },
      },
    },
  });

  // PA Tier 1 slate => ceil(203 * 0.20) = 41 districts contested by Liberty
  const paContested = mGame.stateLegDistricts.PA.house.filter(
    (d) => d.lastResult.candidates.some((c) => c.party === 'liberty')
  ).length;
  assert.strictEqual(paContested, Math.ceil(203 * 0.20), `PA Tier 1 partial slate should contest 41 districts, contested ${paContested}`);

  // NH Tier 2 slate => ceil(400 * 0.40) = 160 districts contested by Liberty
  const nhContested = mGame.stateLegDistricts.NH.house.filter(
    (d) => d.lastResult.candidates.some((c) => c.party === 'liberty')
  ).length;
  assert.strictEqual(nhContested, Math.ceil(400 * 0.40), `NH Tier 2 partial slate should contest 160 districts, contested ${nhContested}`);

  // Organic pocket + Q9 star victory in NH under RCV
  const pocketRes = mRes.lastCycleResults.stateLeg.districtsById[nhLibPocket.id];
  assert.strictEqual(pocketRes.winnerId, 'test_nh_lib_star', 'Q9 Libertarian star in matching faction pocket must win NH seat');
  assert.strictEqual(pocketRes.votingSystem, 'rcv');
  assert((mRes.stateHouseSeatCounts.NH.liberty || 0) >= 1, 'NH House seat count should reflect Libertarian win');

  // Proportional representation test in OR (Liberty at ~12% statewide with Tier 2 contesting top districts)
  // Force full OR slate to check PR chamber top-up cleanly
  mGame.contestedStateHouseSlates.OR = 5;
  const mRes2 = StateLegBenchSystem.resolveStateLegElections(mGame, mShares, { year: 2030 });
  assert(
    (mRes2.stateHouseSeatCounts.OR.liberty || 0) >= 3,
    `OR proportional representation at 12% share should win >= 3 seats, got ${mRes2.stateHouseSeatCounts.OR.liberty}`
  );

  console.log(`PASS [Test 4] Partial slates (PA=${paContested}/203, NH=${nhContested}/400), NH pocket+Q9 win, and OR PR seats (${mRes2.stateHouseSeatCounts.OR.liberty}) verified.`);

  // --------------------------------------------------------------------------
  // TEST 5: Term Limits Force Retirement & Career Milestone Persistence
  // --------------------------------------------------------------------------
  const caDist = mGame.stateLegDistricts.CA.house[0];
  const caInc = mGame.stateLegRoster[caDist.incumbentId];
  caInc.termsServed.stateHouse = StateLegBenchSystem.STATE_TERM_LIMITS.CA.stateHouse; // hit CA limit (6 terms)
  const preCaIncId = caInc.id;

  StateLegBenchSystem.resolveStateLegElections(mGame, null, { year: 2032 });
  assert.strictEqual(mGame.stateLegRoster[preCaIncId].active, false, 'Term-limited CA legislator must retire');
  assert.notStrictEqual(caDist.incumbentId, preCaIncId, 'Term-limited CA district must elect a new incumbent');
  const newWinner = mGame.stateLegRoster[caDist.incumbentId];
  assert(newWinner && newWinner.termsServed.stateHouse >= 1 && newWinner.careerMilestones.length >= 2);

  console.log('PASS [Test 5] Term-limit retirement & milestone persistence verified.');
  console.log('ALL STATE-LEG-BENCH TESTS PASSED!');
}

runAllTests();
