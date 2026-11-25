'use strict';

const assert = require('assert');
const path = require('path');

const Lifecycle = require(path.resolve(__dirname, '..', 'dynamic-faction-lifecycle.js'));

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

function makeFixedRng(vals) {
  let idx = 0;
  return function rng() {
    const v = vals[idx % vals.length];
    idx += 1;
    return v;
  };
}

function buildBaselineGame() {
  return {
    year: 2028,
    seed: 2028,
    independentVoters: 35000000,
    usedFactionNames: [],
    issueSalience: {},
    trendingIssues: ['Housing Affordability', 'AI Safety & Automation'],
    sunsetIssues: ['Coal Subsidies'],
    factions: [
      {
        id: 'dem_est',
        name: 'The Liberal Establishment',
        partyId: 'people',
        type: 'ideological',
        status: 'leading',
        voters: 20000000,
        targetVoters: 20000000,
        sliders: { social: 4.0, economic: 4.0, governance: 2.5 },
        keyIssues: ['Institutional Norms', 'Entitlement Defense'],
        primaryIssueId: 'Institutional Norms',
        happiness: 65,
        cohesion: 0.6,
      },
      {
        id: 'dem_sunset',
        name: 'Old Coal Democrats',
        partyId: 'people',
        type: 'ideological',
        status: 'minor',
        voters: 10000000,
        targetVoters: 10000000,
        sliders: { social: 4.8, economic: 3.8, governance: 3.5 },
        keyIssues: ['Coal Subsidies', 'Manufacturing'],
        primaryIssueId: 'Coal Subsidies',
        growthDriver: 'sunset',
        happiness: 45,
        cohesion: 0.5,
      },
      {
        id: 'dem_rising',
        name: 'Abundance Builders',
        partyId: 'people',
        type: 'ideological',
        status: 'minor',
        voters: 15000000,
        targetVoters: 15000000,
        sliders: { social: 3.8, economic: 4.4, governance: 3.0 },
        keyIssues: ['Housing Affordability', 'Permitting Reform'],
        primaryIssueId: 'Housing Affordability',
        growthDriver: 'tailwind',
        happiness: 68,
        cohesion: 0.6,
      },
      {
        id: 'dem_black',
        name: 'Black Voters',
        partyId: 'people',
        type: 'racial',
        status: 'major',
        voters: 11000000,
        targetVoters: 11000000,
        sliders: { social: 4.0, economic: 3.0, governance: 7.8 },
        keyIssues: ['Civil Rights', 'Voting Access'],
        primaryIssueId: 'Civil Rights',
        happiness: 66,
        cohesion: 0.75,
      },
      {
        id: 'gop_maga',
        name: 'MAGA Populists',
        partyId: 'heritage',
        type: 'ideological',
        status: 'leading',
        voters: 28000000,
        targetVoters: 28000000,
        sliders: { social: 8.5, economic: 6.5, governance: 7.5 },
        keyIssues: ['Border Enforcement', 'Trade & Tariffs'],
        primaryIssueId: 'Border Enforcement',
        happiness: 70,
        cohesion: 0.65,
      },
      {
        id: 'gop_market',
        name: 'Free-Market Coalition',
        partyId: 'heritage',
        type: 'ideological',
        status: 'major',
        voters: 22000000,
        targetVoters: 22000000,
        sliders: { social: 6.5, economic: 9.0, governance: 4.0 },
        keyIssues: ['Deficit & Sound Money', 'Taxes'],
        primaryIssueId: 'Deficit & Sound Money',
        happiness: 64,
        cohesion: 0.58,
      },
      {
        id: 'gop_faith',
        name: 'Faith Bloc',
        partyId: 'heritage',
        type: 'religious',
        status: 'major',
        voters: 10000000,
        targetVoters: 10000000,
        sliders: { social: 9.2, economic: 6.0, governance: 6.0 },
        keyIssues: ['Religious Liberty', 'Family Values'],
        primaryIssueId: 'Religious Liberty',
        happiness: 72,
        cohesion: 0.78,
      },
      {
        id: 'lib_small',
        name: 'Libertarian Wing',
        partyId: 'liberty',
        type: 'ideological',
        status: 'minor',
        voters: 4000000,
        targetVoters: 4000000,
        sliders: { social: 3.5, economic: 9.5, governance: 3.0 },
        keyIssues: ['Deficit & Sound Money', 'Free Trade'],
        primaryIssueId: 'Deficit & Sound Money',
        happiness: 60,
        cohesion: 0.55,
      },
    ],
  };
}

console.log('=== v0.18.8 DYNAMIC FACTION LIFECYCLE, 3-PARTY CHAOS & KICKERS SUITE ===');

test('1. detectThreePartyChaos triggers strictly at >=3 parties >=18% voter share OR >=15% Congress seats', () => {
  const g2 = {
    partyShares: { people: 44, heritage: 43, liberty: 13 },
    congressSeats: { people: 260, heritage: 245, liberty: 30 },
  };
  assert.strictEqual(Lifecycle.detectThreePartyChaos(g2), false);
  assert.strictEqual(g2.threePartyChaosActive, false);

  const g3Vote = {
    partyShares: { people: 38, heritage: 37, liberty: 19 },
    congressSeats: { people: 250, heritage: 245, liberty: 40 },
  };
  assert.strictEqual(Lifecycle.detectThreePartyChaos(g3Vote), true);
  assert.strictEqual(g3Vote.threePartyChaosActive, true);

  const g3Seats = {
    partyShares: { people: 42, heritage: 41, liberty: 14 },
    congressSeats: { people: 225, heritage: 225, liberty: 85 }, // 85 / 535 = 15.88% >= 15%
  };
  assert.strictEqual(Lifecycle.detectThreePartyChaos(g3Seats), true);
  assert.strictEqual(g3Seats.threePartyChaosActive, true);
});

test('2. 2-Party Preservation retains 85%-90% inside declining Dem/GOP party (10%-15% leak) & preserves exact voters', () => {
  const g = buildBaselineGame();
  // Remove tailwind and isolate decline transfer cleanly with neutral peers
  g.trendingIssues = [];
  g.factions = g.factions.filter((f) => f.id === 'dem_est' || f.id === 'dem_sunset' || f.id === 'gop_maga');
  g.factions.forEach((f) => {
    if (f.id !== 'dem_sunset') {
      f.growthDriver = undefined;
      f.happiness = 48;
    }
  });
  g.threePartyChaosActive = false;

  const estBefore = g.factions.find((f) => f.id === 'dem_est').voters;
  const gopBefore = g.factions.find((f) => f.id === 'gop_maga').voters;
  const indBefore = g.independentVoters;
  const totalBefore = g.factions.reduce((s, f) => s + f.voters, 0) + indBefore;

  const res = Lifecycle.applyCycleGrowthAndDecline(g, {
    chaosActive: false,
    rng: makeFixedRng([0.45]),
    sunsetFactionIds: ['dem_sunset'],
  });

  const transfer = res.transfers.find((t) => t.sourceFactionId === 'dem_sunset');
  assert.ok(transfer && transfer.lostVoters > 0, 'Declining faction must lose voters');
  assert.ok(transfer.retentionRate >= 0.85 && transfer.retentionRate <= 0.90, `Expected 85-90% retention, got ${transfer.retentionRate}`);
  const leakPct = transfer.leakedOutside / transfer.lostVoters;
  assert.ok(leakPct >= 0.10 && leakPct <= 0.15, `Expected 10-15% leak outside party, got ${(leakPct * 100).toFixed(2)}%`);
  assert.strictEqual(res.totalVotersAfter, totalBefore, 'Total voters must stay strictly conserved');
  const estAfter = g.factions.find((f) => f.id === 'dem_est').voters;
  assert.ok(estAfter > estBefore, 'Same-party Dem faction must absorb retained voters');
  assert.ok(g.independentVoters > indBefore, 'Leaked 10-15% must flow to Independents');
  assert.ok(Math.abs(g.factions.find((f) => f.id === 'gop_maga').voters - gopBefore) <= gopBefore * 0.05, 'GOP does not receive Dem preservation transfers');
});

test('3. 3-Party Chaos drops retention to 35%-45%, spills 55%-65% cross-party, and applies 2.0x-2.5x volatility', () => {
  const g = {
    year: 2032,
    independentVoters: 10000000,
    partyShares: { people: 36, heritage: 35, liberty: 22 },
    factions: [
      { id: 'd1', name: 'Dem Main', partyId: 'people', type: 'ideological', voters: 20000000, sliders: { social: 4, economic: 4, governance: 4 }, keyIssues: ['Taxes'], happiness: 50 },
      { id: 'd_drop', name: 'Dem Sunset', partyId: 'people', type: 'ideological', voters: 10000000, sliders: { social: 5, economic: 5, governance: 5 }, keyIssues: ['Coal'], growthDriver: 'sunset', happiness: 40 },
      { id: 'r1', name: 'GOP Main', partyId: 'heritage', type: 'ideological', voters: 25000000, sliders: { social: 7, economic: 7, governance: 6 }, keyIssues: ['Border'], happiness: 50 },
      { id: 'l1', name: 'Lib Main', partyId: 'liberty', type: 'ideological', voters: 20000000, sliders: { social: 4, economic: 8, governance: 3 }, keyIssues: ['Liberty'], happiness: 50 },
    ],
  };
  const totalBefore = g.factions.reduce((s, f) => s + f.voters, 0) + g.independentVoters;
  const res = Lifecycle.applyCycleGrowthAndDecline(g, {
    rng: makeFixedRng([0.5]),
    sunsetFactionIds: ['d_drop'],
  });
  assert.strictEqual(res.threePartyChaosActive, true);
  assert.ok(res.volatilityMult >= 2.0 && res.volatilityMult <= 2.5, `Expected 2.0x-2.5x volatility, got ${res.volatilityMult}`);
  const transfer = res.transfers.find((t) => t.sourceFactionId === 'd_drop');
  assert.ok(transfer.retentionRate >= 0.35 && transfer.retentionRate <= 0.45, `Expected 35-45% chaos retention, got ${transfer.retentionRate}`);
  assert.strictEqual(res.totalVotersAfter, totalBefore, 'Total voters must stay strictly conserved in Chaos mode');
});

test('4. High-Impact Swings (+12..+22% tailwind, -25..-35% rapid collapse <=10 yrs) & Identity Blocs stay stagnant', () => {
  const g = {
    year: 2028,
    independentVoters: 40000000,
    threePartyChaosActive: false,
    factions: [
      { id: 'tw', name: 'Rising Wing', partyId: 'people', type: 'ideological', voters: 10000000, sliders: { social: 4, economic: 4, governance: 4 }, keyIssues: ['AI Safety'], growthDriver: 'tailwind' },
      { id: 'col', name: 'Collapse Wing', partyId: 'people', type: 'ideological', voters: 350000, sliders: { social: 6, economic: 6, governance: 6 }, keyIssues: ['Old Issue'], growthDriver: 'collapse' },
      { id: 'id_race', name: 'Black Voters', partyId: 'people', type: 'racial', voters: 11000000, sliders: { social: 4, economic: 3, governance: 7.8 }, keyIssues: ['Civil Rights'] },
      { id: 'id_rel', name: 'Religious Bloc', partyId: 'heritage', type: 'religious', voters: 8000000, sliders: { social: 9, economic: 6, governance: 6 }, keyIssues: ['Faith'] },
    ],
  };

  Lifecycle.applyCycleGrowthAndDecline(g, { chaosActive: false, rng: makeFixedRng([0.5]) });
  const tw = g.factions.find((f) => f.id === 'tw');
  assert.ok(tw.voters >= 11200000 && tw.voters <= 12200000, `Tailwind +12%..+22% expected, got ${tw.voters}`);
  assert.strictEqual(g.factions.find((f) => f.id === 'id_race').voters, 11000000, 'Racial bloc size must remain stagnant');
  assert.strictEqual(g.factions.find((f) => f.id === 'id_rel').voters, 8000000, 'Religious bloc size must remain stagnant');

  // Verify Rapid Collapse Drain collapses a doomed 350K wing below 100K within <= 5 cycles (<= 10 years)
  for (let cyc = 1; cyc <= 4; cyc++) {
    Lifecycle.applyCycleGrowthAndDecline(g, { chaosActive: false, rng: makeFixedRng([0.5]) });
  }
  const colAfter10Yrs = g.factions.find((f) => f.id === 'col').voters;
  assert.ok(colAfter10Yrs < 100000, `Rapid collapse must push 350K faction <100K within 10 years (5 cycles), got ${colAfter10Yrs}`);
});

test('5. Emerge (<1M, 350K-850K) gets 4-cycle Viral Runway (+35%-+55%/cycle) & Vanguard 3 cycles + Identity exclusion', () => {
  const g = {
    year: 2028,
    independentVoters: 20000000,
    usedFactionNames: [],
    eraSalienceSpike: true,
    trendingIssues: ['AI Safety & Automation', 'Permitting Reform'],
    threePartyChaosActive: false,
    factions: [
      { id: 'base_d', name: 'Mainline Dems', partyId: 'people', type: 'ideological', voters: 15000000, sliders: { social: 4, economic: 4, governance: 3 }, keyIssues: ['Healthcare'], cohesion: 0.7 },
      { id: 'id_r', name: 'Latino Bloc', partyId: 'people', type: 'racial', voters: 5000000, sliders: { social: 5, economic: 4, governance: 5 }, keyIssues: ['Wages'], forceLowCohesion: true },
    ],
  };

  const bRes = Lifecycle.evaluateBirthEvents(g, makeFixedRng([0.5]), { forceEmerge: true, maxSplits: 0, maxSevers: 0 });
  assert.strictEqual(bRes.emerged.length, 1, 'Expected 1 Emerge event');
  assert.strictEqual(bRes.severed.length, 0, 'Protected racial bloc must never Sever');
  assert.strictEqual(bRes.split.length, 0, 'Protected racial bloc must never Split');

  const child = bRes.emerged[0].faction;
  assert.ok(child.voters >= 350000 && child.voters <= 850000 && child.voters < 1000000, `Emerge voters must be 350K-850K (<1M), got ${child.voters}`);
  assert.strictEqual(child.viralRunwayCyclesLeft, 4);
  assert.strictEqual(child.vanguardCyclesLeft, 3);
  assert.strictEqual(child.primaryIssueId, child.keyIssues[0]);
  assert.ok(g.usedFactionNames.includes(child.name.toLowerCase()), 'Name must be recorded in usedFactionNames');

  // Verify 4 consecutive cycles of +35%-+55% Viral Runway growth
  let prevV = child.voters;
  for (let c = 1; c <= 4; c++) {
    Lifecycle.applyCycleGrowthAndDecline(g, { chaosActive: false, rng: makeFixedRng([0.5]) });
    const pct = (child.voters - prevV) / prevV;
    assert.ok(pct >= 0.34 && pct <= 0.56, `Cycle ${c} viral runway must grow +35%-+55%, got ${(pct * 100).toFixed(1)}%`);
    prevV = child.voters;
  }
  assert.strictEqual(child.viralRunwayCyclesLeft, 0);
});

test('6. Sever (20%-35% split, 0 inherited issues, -25% threshold in 3-Party Chaos) & Split (45-55%/45-55%, 1 issue each)', () => {
  // Sever in 2-party vs 3-party chaos threshold test
  const gThreshold = {
    year: 2030,
    threePartyChaosActive: false,
    factions: [
      { id: 'p_2m', name: 'Mid Coalition', partyId: 'people', type: 'ideological', voters: 2000000, sliders: { social: 4, economic: 4, governance: 4 }, keyIssues: ['Healthcare', 'Labor'], cohesion: 0.30, happiness: 38 },
    ],
  };
  const bNo = Lifecycle.evaluateBirthEvents(gThreshold, makeFixedRng([0.5]), { forceSever: true, maxEmerges: 0, maxSplits: 0 });
  assert.strictEqual(bNo.severed.length, 0, '2.0M faction must NOT Sever in 2-party mode (requires 2.5M)');

  gThreshold.threePartyChaosActive = true; // 2.5M * 0.75 = 1.875M
  const bYes = Lifecycle.evaluateBirthEvents(gThreshold, makeFixedRng([0.5]), { forceSever: true, maxEmerges: 0, maxSplits: 0 });
  assert.strictEqual(bYes.severed.length, 1, '2.0M low-cohesion faction MUST Sever under 3-Party Chaos 1.875M threshold');
  const sevChild = bYes.severed[0].child;
  const sevParent = gThreshold.factions.find((f) => f.id === 'p_2m');
  assert.strictEqual(sevChild.voters + sevParent.voters, 2000000, 'Sever must conserve 100% of voters');
  assert.ok(sevChild.voters >= 400000 && sevChild.voters <= 700000, `Sever child must take 20-35% (400K-700K), got ${sevChild.voters}`);
  const sharedOnSever = sevChild.keyIssues.filter((i) => sevParent.keyIssues.includes(i));
  assert.strictEqual(sharedOnSever.length, 0, 'Sever child must inherit 0 parent Key Issues');

  // Split test (>= 4M parent dissolves into 2 children 45-55% / 45-55% inheriting 1 parent issue each)
  const gSplit = {
    year: 2032,
    threePartyChaosActive: false,
    factions: [
      { id: 'p_big', name: 'Big Tent Parent', partyId: 'heritage', type: 'ideological', voters: 5000000, sliders: { social: 7, economic: 7, governance: 6 }, keyIssues: ['Border Security', 'Tax Cuts'], cohesion: 0.28, happiness: 35 },
    ],
  };
  const spRes = Lifecycle.evaluateBirthEvents(gSplit, makeFixedRng([0.5]), { forceSplit: true, maxEmerges: 0, maxSevers: 0 });
  assert.strictEqual(spRes.split.length, 1, 'Expected Split birth event');
  assert.strictEqual(gSplit.factions.some((f) => f.id === 'p_big'), false, 'Parent must dissolve after Split');
  const [cA, cB] = spRes.split[0].children;
  assert.strictEqual(cA.voters + cB.voters, 5000000, 'Split children must conserve 100% of parent voters');
  assert.ok(cA.voters >= 2250000 && cA.voters <= 2750000 && cB.voters >= 2250000 && cB.voters <= 2750000, 'Split ratio must be 45%-55% each');
  assert.strictEqual(cA.primaryIssueId, 'Border Security');
  assert.strictEqual(cB.primaryIssueId, 'Tax Cuts');
});

test('7. End-of-cycle dissolutions: <100K dissolves to closest rising neighbors, Extremist never dissolves, Anchor politician end', () => {
  const g = {
    year: 2034,
    politicians: [{ id: 'pol_retired', name: 'Sen. Old', retired: true }],
    caucuses: [{ id: 'c1', partyId: 'people', memberFactionIds: ['tiny_d', 'anchor_f', 'rise_close', 'far_d'] }],
    factions: [
      { id: 'tiny_d', name: 'Tiny Faction', partyId: 'people', type: 'ideological', voters: 80000, sliders: { social: 4.2, economic: 4.1, governance: 4.0 }, isExtremist: false },
      { id: 'ext_f', name: 'Permanent Extremists', partyId: 'people', type: 'ideological', voters: 45000, sliders: { social: 1.0, economic: 1.0, governance: 9.0 }, isExtremist: true },
      { id: 'anchor_f', name: 'Personalist Wing', partyId: 'people', type: 'ideological', voters: 900000, sliders: { social: 5.0, economic: 5.0, governance: 5.0 }, anchorPoliticianId: 'pol_retired' },
      { id: 'id_tiny', name: 'Small Identity Group', partyId: 'people', type: 'identity', voters: 60000, sliders: { social: 4.5, economic: 4.5, governance: 4.5 } },
      { id: 'rise_close', name: 'Rising Neighbor', partyId: 'people', type: 'ideological', voters: 3000000, sliders: { social: 4.4, economic: 4.2, governance: 4.1 }, trend: 'rising', lastCycleGrowthPct: 14 },
      { id: 'far_d', name: 'Static Neighbor', partyId: 'people', type: 'ideological', voters: 3000000, sliders: { social: 5.5, economic: 5.5, governance: 5.5 }, trend: 'stable', lastCycleGrowthPct: 0 },
    ],
  };
  const beforeTotal = g.factions.reduce((s, f) => s + f.voters, 0);
  const diss = Lifecycle.evaluateCycleDissolutions(g);
  const afterTotal = g.factions.reduce((s, f) => s + f.voters, 0);

  assert.strictEqual(afterTotal, beforeTotal, 'Dissolution redistribution must conserve 100% of voters');
  assert.strictEqual(diss.some((d) => d.factionId === 'tiny_d' && d.reason === 'below_100k_threshold'), true);
  assert.strictEqual(diss.some((d) => d.factionId === 'anchor_f' && d.reason === 'anchor_politician_ended'), true);
  assert.ok(g.factions.some((f) => f.id === 'ext_f'), 'Extremist faction must NEVER dissolve');
  assert.ok(g.factions.some((f) => f.id === 'id_tiny'), 'Protected identity faction <100K must NEVER dissolve');
  assert.ok(g.factions.find((f) => f.id === 'rise_close').voters > 3000000 + 490000, 'Rising close neighbor should receive majority of redistributed voters');
});

test('8. Kicker #1 Mergers: merges close same-party non-identity factions sharing >=1 Key Issue when shrinking or <2M', () => {
  const g = {
    year: 2036,
    caucuses: [{ id: 'c_gop', partyId: 'heritage', memberFactionIds: ['big_gop', 'small_gop'] }],
    factions: [
      { id: 'big_gop', name: 'Fiscal Hawks', partyId: 'heritage', type: 'ideological', voters: 6000000, sliders: { social: 7.0, economic: 8.5, governance: 4.0 }, keyIssues: ['Deficit & Sound Money', 'Taxes'] },
      { id: 'small_gop', name: 'Sound Money Club', partyId: 'heritage', type: 'ideological', voters: 1200000, sliders: { social: 7.5, economic: 8.8, governance: 4.4 }, keyIssues: ['Deficit & Sound Money', 'Regulation'] },
      { id: 'far_gop', name: 'Distant Wing', partyId: 'heritage', type: 'ideological', voters: 900000, sliders: { social: 2.0, economic: 2.0, governance: 8.0 }, keyIssues: ['Deficit & Sound Money'] },
      { id: 'id_gop', name: 'Identity Cubans', partyId: 'heritage', type: 'racial', voters: 800000, sliders: { social: 7.1, economic: 8.4, governance: 4.1 }, keyIssues: ['Deficit & Sound Money'] },
    ],
  };

  const mergers = Lifecycle.evaluateFactionMergers(g, makeFixedRng([0.1]), { forceMerge: true });
  assert.strictEqual(mergers.length, 1, 'Only close non-identity shared-issue pair should merge');
  assert.strictEqual(mergers[0].survivorId, 'big_gop');
  assert.strictEqual(mergers[0].absorbedId, 'small_gop');
  assert.strictEqual(g.factions.find((f) => f.id === 'big_gop').voters, 7200000, 'Merged bloc must sum voters exactly');
  assert.ok(g.factions.some((f) => f.id === 'far_gop'), 'Distant >1.8 faction must not merge');
  assert.ok(g.factions.some((f) => f.id === 'id_gop'), 'Protected identity bloc must not merge');
  assert.deepStrictEqual(g.caucuses[0].memberFactionIds, ['big_gop'], 'Caucus list should deduplicate absorbed faction into survivor');
});

test('9. Kicker #2 Vanguard Overton Pull nudges same-party sliders & issue salience and decrements vanguardCyclesLeft', () => {
  const g = {
    year: 2028,
    issueSalience: { 'AI Safety & Automation': 50 },
    factions: [
      { id: 'van', name: 'AI Vanguard', partyId: 'people', type: 'ideological', voters: 600000, sliders: { social: 2.0, economic: 2.0, governance: 4.0 }, keyIssues: ['AI Safety & Automation', 'Permitting'], primaryIssueId: 'AI Safety & Automation', vanguardCyclesLeft: 3 },
      { id: 'ally', name: 'Moderate Wing', partyId: 'people', type: 'ideological', voters: 8000000, sliders: { social: 5.0, economic: 5.0, governance: 4.0 }, keyIssues: ['Healthcare'], issueSalience: { 'AI Safety & Automation': 40 } },
      { id: 'rival', name: 'GOP Wing', partyId: 'heritage', type: 'ideological', voters: 8000000, sliders: { social: 8.0, economic: 8.0, governance: 6.0 }, keyIssues: ['Taxes'] },
    ],
  };

  const pulls = Lifecycle.applyVanguardOvertonPull(g);
  assert.strictEqual(pulls.length, 1);
  assert.strictEqual(pulls[0].remainingCycles, 2);
  const ally = g.factions.find((f) => f.id === 'ally');
  const rival = g.factions.find((f) => f.id === 'rival');
  assert.ok(ally.sliders.social < 5.0 && ally.sliders.economic < 5.0, 'Same-party neighbor sliders must shift toward Vanguard');
  assert.ok(ally.issueSalience['AI Safety & Automation'] > 40, 'Same-party neighbor salience for Vanguard primaryIssueId must rise');
  assert.ok(g.issueSalience['AI Safety & Automation'] > 50, 'Global issueSalience for primaryIssueId must rise');
  assert.strictEqual(rival.sliders.social, 8.0, 'Other-party sliders must NOT be pulled by Vanguard');
});

test('10. Kicker #3 Temperament Modifiers: true_believer, fair_weather (2-cycle streak), and transactional (+40% appeasement)', () => {
  const g = { year: 2030, factionHappiness: { tb: 60, fw: 60, tr: 50 } };
  const tb = { id: 'tb', name: 'True Believers', partyId: 'people', primaryIssueId: 'Medicare', temperament: 'true_believer', happiness: 60 };
  const fw = { id: 'fw', name: 'Fair Weather', partyId: 'people', temperament: 'fair_weather', happiness: 60, cohesion: 0.6 };
  const tr = { id: 'tr', name: 'Deal Makers', partyId: 'people', temperament: 'transactional', happiness: 50 };

  const tbStreak = Lifecycle.applyTemperamentEffects(g, tb, { primaryIssueHeld: true, consecutiveLosses: 3, rawHappinessDelta: -4 });
  assert.strictEqual(tbStreak.boltRiskMultiplier, 0.0, 'True Believer holds zero losing-streak bolt risk when primary issue is held');
  assert.strictEqual(tbStreak.happinessDelta, -2, 'True Believer softens losing-streak happiness hit');

  const tbBetrayed = Lifecycle.applyTemperamentEffects(g, tb, { primaryIssueBetrayed: true, rawHappinessDelta: -6 });
  assert.ok(tbBetrayed.highBoltRisk && tbBetrayed.happinessDelta <= -10 && tbBetrayed.frictionDelta >= 14, 'Primary-issue betrayal triggers severe penalty');

  const fwStreak = Lifecycle.applyTemperamentEffects(g, fw, { consecutiveLosses: 2, applyToState: true });
  assert.strictEqual(fwStreak.highBoltRisk, true);
  assert.strictEqual(fwStreak.boltRiskMultiplier, 2.0);
  assert.strictEqual(fw.cohesion, 0.5, 'Fair-Weather 2-cycle losing streak drops cohesion -0.10');
  assert.strictEqual(fw.happiness, 52, 'Fair-Weather 2-cycle losing streak drops happiness -8');

  const trAppeased = Lifecycle.applyTemperamentEffects(g, tr, { actionType: 'appease', rawHappinessDelta: 10 });
  assert.strictEqual(trAppeased.appeasementMultiplier, 1.4);
  assert.strictEqual(trAppeased.happinessDelta, 14, 'Transactional grants +40% appeasement efficiency (10 -> 14)');
});

test('11. runDynamicFactionCycle orchestrates full cycle & preserves 155M scale', () => {
  const g = buildBaselineGame();
  // Scale to exact 155,000,000 total
  const curSum = g.factions.reduce((s, f) => s + f.voters, 0) + g.independentVoters;
  g.independentVoters += (155000000 - curSum);

  const digest = Lifecycle.runDynamicFactionCycle(g, makeFixedRng([0.4, 0.5, 0.6]), { forceEmerge: true });
  assert.strictEqual(digest.year, 2028);
  assert.strictEqual(digest.totalVotersAfter, 155000000, 'Full dynamic lifecycle cycle must conserve 155,000,000 voters');
  assert.ok(digest.births.emerged.length >= 1, 'Expected emerged faction in digest');
  assert.strictEqual(g.lastDynamicLifecycleDigest, digest);
});

console.log(`\nALL ${passed}/11 v0.18.8 DYNAMIC FACTION LIFECYCLE TESTS PASSED.`);
