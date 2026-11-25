'use strict';

const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Boot minimal sandbox to load verified 2028 factions from factions-0.15.js
global.window = global;
require(path.join(ROOT, 'factions-0.15.js'));
const FCS = require(path.join(ROOT, 'faction-caucus-system.js'));

const CATALOG = global.window.PartyChairData.FACTIONS_CATALOG;

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  PASS: ${name}`);
}

function makeBaseGame(overrides = {}) {
  const factions = CATALOG.map((f) => ({
    ...f,
    sliders: { ...f.sliders },
    keyIssues: [...(f.keyIssues || [])],
    happiness: f.startingHappiness ?? 55,
    frictionIndex: 0,
  }));
  const factionHappiness = {};
  const factionStandings = {};
  for (const f of factions) {
    factionHappiness[f.id] = f.happiness;
    factionStandings[f.id] = f.happiness;
  }
  return {
    year: 2028,
    seed: 202801,
    threePartyChaosActive: false,
    factions,
    factionHappiness,
    factionStandings,
    ...overrides,
  };
}

function makeSeededRng(seed = 123456789) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

console.log('=== v0.18.8 INTRA-PARTY FACTION CAUCUSES TEST SUITE ===');

// 1. 2028 Starting Caucuses + Solo assignment for third/custom parties
test('1. initializeStartingCaucuses seeds exact 2028 Dem/GOP Caucuses and Solo third/custom caucuses', () => {
  const customFaction = {
    id: 'custom_reformers',
    name: 'Civic Reformers',
    partyId: 'player',
    sliders: { social: 5, economic: 5, governance: 5 },
    keyIssues: ['Electoral Reform', 'Anti-Corruption'],
    happiness: 60,
    frictionIndex: 0,
  };
  let g = makeBaseGame();
  g.factions.push(customFaction);
  g = FCS.initializeStartingCaucuses(g);

  assert.ok(Array.isArray(g.caucuses), 'game.caucuses initialized');

  const findCaucus = (id) => g.caucuses.find((c) => c.id === id);
  const inst = findCaucus('caucus_dem_institutional');
  assert.strictEqual(inst.name, 'The Institutional Caucus');
  assert.strictEqual(inst.status, 'historic');
  assert.strictEqual(inst.strength, 68);
  assert.deepStrictEqual(inst.memberFactionIds, ['dem_liberal_establishment', 'dem_black_voters', 'dem_neo_liberals']);
  assert.ok(typeof inst.representativeName === 'string' && inst.representativeName.length > 0);

  const prog = findCaucus('caucus_dem_progressive');
  assert.strictEqual(prog.name, 'The Progressive Caucus');
  assert.strictEqual(prog.status, 'active');
  assert.strictEqual(prog.strength, 74);
  assert.deepStrictEqual(prog.memberFactionIds, ['dem_capital_l_left', 'dem_bernie_bros']);

  const blue = findCaucus('caucus_dem_blue_dog');
  assert.strictEqual(blue.name, 'The Blue Dog Caucus');
  assert.strictEqual(blue.status, 'active');
  assert.strictEqual(blue.strength, 66);
  assert.deepStrictEqual(blue.memberFactionIds, ['dem_blue_dog', 'dem_traditional_latin', 'dem_faith_based_liberals']);

  const maga = findCaucus('caucus_gop_maga');
  assert.strictEqual(maga.name, 'The MAGA Caucus');
  assert.strictEqual(maga.status, 'active');
  assert.strictEqual(maga.strength, 56);
  assert.deepStrictEqual(maga.memberFactionIds, ['gop_maga', 'gop_blood_and_soil', 'gop_paleocons', 'gop_cubans']);

  const freeMarket = findCaucus('caucus_gop_free_market');
  assert.strictEqual(freeMarket.name, 'The Free-Market Caucus');
  assert.strictEqual(freeMarket.status, 'active');
  assert.strictEqual(freeMarket.strength, 72);
  assert.deepStrictEqual(freeMarket.memberFactionIds, ['gop_western_mavericks', 'gop_suburban_moderates', 'gop_market_country_club']);

  const faith = findCaucus('caucus_gop_faith');
  assert.strictEqual(faith.name, 'The Faith Caucus');
  assert.strictEqual(faith.status, 'active');
  assert.strictEqual(faith.strength, 76);
  assert.deepStrictEqual(faith.memberFactionIds, ['gop_faith_and_flag', 'gop_traditional_farmers', 'gop_mormons']);

  const abundanceSolo = g.caucuses.find((c) => c.status === 'solo' && c.memberFactionIds.includes('dem_abundance'));
  const neoconsSolo = g.caucuses.find((c) => c.status === 'solo' && c.memberFactionIds.includes('gop_neo_cons'));
  assert.ok(abundanceSolo, 'dem_abundance assigned Solo Caucus');
  assert.ok(neoconsSolo, 'gop_neo_cons assigned Solo Caucus');

  // Liberty, Green, Constitution, Socialist, and Custom player factions also get Solo Caucuses
  for (const fid of ['lib_true_libertarians', 'grn_eco_socialist_vanguard', 'con_christian_dominionists', 'soc_socialists', 'custom_reformers']) {
    const solo = g.caucuses.find((c) => c.status === 'solo' && c.memberFactionIds.includes(fid));
    assert.ok(solo, `${fid} auto-assigned Solo Caucus`);
    const fac = g.factions.find((f) => f.id === fid);
    assert.strictEqual(fac.caucusId, solo.id, `${fid}.caucusId synced`);
  }

  // Unaffiliated/independent stay unassigned
  const unaff = g.factions.find((f) => f.partyId === 'unaffiliated');
  assert.strictEqual(unaff.caucusId, null, 'Unaffiliated faction keeps null caucusId');
});

// 2. canFormCaucus rules (party >= 3, 2-4 size, >= 1 outside, distance <= 2.2 or <= 2.6 with shared issue)
test('2. canFormCaucus enforces party size >= 3, 2-4 members, >= 1 outside, and 2.2 / 2.6 distance thresholds', () => {
  const mkFac = (id, s, e, g, issues = ['a', 'b'], partyId = 'people') => ({
    id,
    partyId,
    sliders: { social: s, economic: e, governance: g },
    keyIssues: issues,
  });

  // Party < 3 factions blocked
  assert.strictEqual(
    FCS.canFormCaucus([mkFac('f1', 5, 5, 5), mkFac('f2', 5, 5, 5)], ['f1', 'f2']),
    false,
    'Rejects party with < 3 factions'
  );

  // Swallowing entire 3-faction party blocked (>= 1 outside required)
  const threeParty = [mkFac('f1', 5, 5, 5), mkFac('f2', 5.5, 5, 5), mkFac('f3', 6, 5, 5)];
  assert.strictEqual(
    FCS.canFormCaucus(threeParty, ['f1', 'f2', 'f3']),
    false,
    'Rejects Caucus leaving 0 factions outside'
  );
  assert.strictEqual(
    FCS.canFormCaucus(threeParty, ['f1', 'f2']),
    true,
    'Allows 2-member Caucus leaving f3 outside'
  );

  // Size < 2 or > 4 blocked
  const sixParty = [
    mkFac('f1', 5, 5, 5),
    mkFac('f2', 5.2, 5, 5),
    mkFac('f3', 5.4, 5, 5),
    mkFac('f4', 5.6, 5, 5),
    mkFac('f5', 5.8, 5, 5),
    mkFac('f6', 6.0, 5, 5),
  ];
  assert.strictEqual(FCS.canFormCaucus(sixParty, ['f1']), false, 'Rejects 1-member multi-caucus');
  assert.strictEqual(FCS.canFormCaucus(sixParty, ['f1', 'f2', 'f3', 'f4', 'f5']), false, 'Rejects 5-member Caucus');
  assert.strictEqual(FCS.canFormCaucus(sixParty, ['f1', 'f2', 'f3', 'f4']), true, 'Allows 4-member Caucus with >=1 outside');

  // Distance boundary: 2.2 passes without shared issue, 2.35 fails without shared issue, 2.55 passes WITH shared issue, 2.7 fails even with shared issue
  const distParty = [
    mkFac('anchor', 5, 5, 5, ['Tax Reform', 'Healthcare']),
    mkFac('d220', 7.2, 5, 5, ['Trade', 'Defense']),          // dist = 2.20
    mkFac('d235_no', 7.35, 5, 5, ['Trade', 'Defense']),      // dist = 2.35, no shared issue
    mkFac('d255_yes', 7.55, 5, 5, ['Defense', 'tax-reform']), // dist = 2.55, shared normalized issue -> allowed!
    mkFac('d270_yes', 7.70, 5, 5, ['Tax Reform', 'Defense']), // dist = 2.70 > 2.60 -> blocked!
    mkFac('outsider', 2, 2, 2, ['Other']),
  ];
  assert.strictEqual(FCS.canFormCaucus(distParty, ['anchor', 'd220']), true, 'Distance 2.20 allowed without shared issue');
  assert.strictEqual(FCS.canFormCaucus(distParty, ['anchor', 'd235_no']), false, 'Distance 2.35 rejected without shared issue');
  assert.strictEqual(FCS.canFormCaucus(distParty, ['anchor', 'd255_yes']), true, 'Distance 2.55 allowed with shared Key Issue');
  assert.strictEqual(FCS.canFormCaucus(distParty, ['anchor', 'd270_yes']), false, 'Distance 2.70 rejected even with shared Key Issue');
});

// 3. Solidarity Splash (-45% * strength/100) and Positive Appeasement (+50%)
test('3. applyCaucusHappinessSplash applies exact 45%*(strength/100) mistreatment splash and +50% appeasement goodwill', () => {
  let g = FCS.initializeStartingCaucuses(makeBaseGame());
  // Target Institutional Caucus (strength 68): dem_liberal_establishment, dem_black_voters, dem_neo_liberals
  const getH = (game, id) => game.factions.find((f) => f.id === id).happiness;
  const hLib0 = getH(g, 'dem_liberal_establishment');
  const hBlk0 = getH(g, 'dem_black_voters');
  const hNeo0 = getH(g, 'dem_neo_liberals');
  const hSolo0 = getH(g, 'dem_abundance');

  // Negative hit of -20 on dem_liberal_establishment:
  // Partner splash = -20 * 0.45 * (68 / 100) = -6.12
  g = FCS.applyCaucusHappinessSplash(g, 'dem_liberal_establishment', -20);
  assert.strictEqual(getH(g, 'dem_liberal_establishment'), hLib0 - 20, 'Target takes full -20 hit');
  assert.strictEqual(getH(g, 'dem_black_voters'), +(hBlk0 - 6.12).toFixed(2), 'Caucus partner receives -6.12 splash');
  assert.strictEqual(getH(g, 'dem_neo_liberals'), +(hNeo0 - 6.12).toFixed(2), 'Second Caucus partner receives -6.12 splash');
  assert.strictEqual(getH(g, 'dem_abundance'), hSolo0, 'Outside Solo faction untouched by negative splash');

  // Positive appeasement of +10 on dem_black_voters:
  // Partner goodwill = +10 * 0.50 = +5.0
  const hLibPre = getH(g, 'dem_liberal_establishment');
  const hBlkPre = getH(g, 'dem_black_voters');
  const hNeoPre = getH(g, 'dem_neo_liberals');
  g = FCS.applyCaucusHappinessSplash(g, 'dem_black_voters', 10);
  assert.strictEqual(getH(g, 'dem_black_voters'), +(hBlkPre + 10).toFixed(2), 'Target gains +10');
  assert.strictEqual(getH(g, 'dem_liberal_establishment'), +(hLibPre + 5).toFixed(2), 'Partner gains +50% (+5) goodwill');
  assert.strictEqual(getH(g, 'dem_neo_liberals'), +(hNeoPre + 5).toFixed(2), 'Second partner gains +50% (+5) goodwill');
  assert.strictEqual(g.factionHappiness.dem_black_voters, getH(g, 'dem_black_voters'), 'factionHappiness map synchronized');
  assert.strictEqual(getH(g, 'dem_abundance'), hSolo0, 'Outside Solo faction untouched by appeasement goodwill');
});

// 4. Partner Bolt / Expulsion Shock (-18 Happiness, +20 Friction) and <2 dissolution
test('4. handleCaucusPartnerExit inflicts -18 Happiness / +20 Friction and dissolves Caucus when <2 members remain', () => {
  let g = FCS.initializeStartingCaucuses(makeBaseGame());
  const preBlkH = g.factions.find((f) => f.id === 'dem_black_voters').happiness;
  const preNeoH = g.factions.find((f) => f.id === 'dem_neo_liberals').happiness;

  // Bolt from 3-member Institutional Caucus -> 2 remain, no dissolution yet
  g = FCS.handleCaucusPartnerExit(g, 'dem_liberal_establishment', 'bolt');
  const blkAfter1 = g.factions.find((f) => f.id === 'dem_black_voters');
  const neoAfter1 = g.factions.find((f) => f.id === 'dem_neo_liberals');
  assert.strictEqual(blkAfter1.happiness, +(preBlkH - 18).toFixed(2), 'Partner takes -18 Happiness on bolt');
  assert.strictEqual(blkAfter1.frictionIndex, 20, 'Partner takes +20 Friction on bolt');
  assert.strictEqual(neoAfter1.happiness, +(preNeoH - 18).toFixed(2), 'Second partner takes -18 Happiness on bolt');
  assert.strictEqual(neoAfter1.frictionIndex, 20, 'Second partner takes +20 Friction on bolt');
  assert.ok(g.caucuses.some((c) => c.id === 'caucus_dem_institutional' && c.memberFactionIds.length === 2), '3->2 retains Caucus');

  // Second member leaves Progressive Caucus (2 members -> 1 remains) -> dissolves!
  const preBernieH = g.factions.find((f) => f.id === 'dem_bernie_bros').happiness;
  g = FCS.handleCaucusPartnerExit(g, 'dem_capital_l_left', 'expulsion');
  assert.strictEqual(
    g.caucuses.some((c) => c.id === 'caucus_dem_progressive'),
    false,
    'Progressive Caucus dissolves when <2 members remain'
  );
  const bernie = g.factions.find((f) => f.id === 'dem_bernie_bros');
  assert.strictEqual(bernie.happiness, +(preBernieH - 18).toFixed(2), 'Remaining partner takes -18 Happiness before dissolution');
  assert.strictEqual(bernie.frictionIndex, 20, 'Remaining partner takes +20 Friction before dissolution');
  assert.strictEqual(g.lastCaucusExitEvent.dissolved, true, 'Exit digest flags dissolution');
  const bernieCaucus = g.caucuses.find((c) => c.id === bernie.caucusId);
  assert.strictEqual(bernieCaucus.status, 'solo', 'Last surviving partner converted cleanly to Solo Caucus');
});

// 5. Anti-Poaching Lock at strength 45 vs 44
test('5. isProtectedByAntiPoachingLock enforces threshold strictly at strength >= 45 (45 locked, 44 unlocked)', () => {
  let g = FCS.initializeStartingCaucuses(makeBaseGame());
  g.caucuses = g.caucuses.map((c) => (c.id === 'caucus_gop_maga' ? { ...c, strength: 45 } : c));
  const at45 = FCS.isProtectedByAntiPoachingLock(g, 'gop_maga');
  assert.strictEqual(at45.locked, true, 'Locked at strength === 45');
  assert.strictEqual(at45.caucusName, 'The MAGA Caucus');
  assert.strictEqual(at45.strength, 45);

  g.caucuses = g.caucuses.map((c) => (c.id === 'caucus_gop_maga' ? { ...c, strength: 44 } : c));
  const at44 = FCS.isProtectedByAntiPoachingLock(g, 'gop_maga');
  assert.strictEqual(at44.locked, false, 'Unlocked at strength === 44');
  assert.strictEqual(at44.caucusName, 'The MAGA Caucus');
  assert.strictEqual(at44.strength, 44);

  const soloLock = FCS.isProtectedByAntiPoachingLock(g, 'dem_abundance');
  assert.strictEqual(soloLock.locked, false, 'Solo Caucus never anti-poach locked');
});

// 6. Primary Non-Aggression (~88% for non-presidential when strength >= 35)
test('6. shouldCoordinatePrimary hits ~88% for non-presidential shared Caucus (>=35 strength) and respects thresholds', () => {
  let g = FCS.initializeStartingCaucuses(makeBaseGame());
  const rng = makeSeededRng(424242);
  let trueCount = 0;
  const trials = 1000;
  for (let i = 0; i < trials; i++) {
    if (FCS.shouldCoordinatePrimary(g, 'dem_capital_l_left', 'dem_bernie_bros', rng)) {
      trueCount++;
    }
  }
  const rate = trueCount / trials;
  assert.ok(rate >= 0.84 && rate <= 0.92, `Primary coordination rate expected ~0.88, got ${rate}`);

  // Presidential primaries do not lock via non-aggression
  assert.strictEqual(
    FCS.shouldCoordinatePrimary(g, 'dem_capital_l_left', 'dem_bernie_bros', () => 0.1, { isPresidential: true }),
    false,
    'Presidential primary exempt from primary non-aggression coordination'
  );

  // Different Caucuses never coordinate
  assert.strictEqual(
    FCS.shouldCoordinatePrimary(g, 'dem_capital_l_left', 'dem_blue_dog', () => 0.1),
    false,
    'Different Caucuses do not coordinate'
  );

  // Below strength 35 disables coordination
  g.caucuses = g.caucuses.map((c) => (c.id === 'caucus_dem_progressive' ? { ...c, strength: 34 } : c));
  assert.strictEqual(
    FCS.shouldCoordinatePrimary(g, 'dem_capital_l_left', 'dem_bernie_bros', () => 0.1),
    false,
    'Strength 34 (< 35) disables primary coordination'
  );
});

// 7. Cycle Advance: Natural fray (-3 to -4), Historic -80% fray & <40 loss, 2.0x 3-Party Chaos fray, ~20% hardening, and Solo formation
test('7. advanceCaucusesCycle applies natural fray, -80% Historic protection, Historic loss <40, 2x 3-party chaos fray & Solo formation', () => {
  // 7a. Normal cycle fray: Historic (-80%) vs Active (-3 to -4)
  const gNormal = FCS.initializeStartingCaucuses(makeBaseGame());
  const resNormal = FCS.advanceCaucusesCycle(gNormal, { rng: () => 0.5, formationChance: 0 }); // base fray = 3.5
  const instAfter = resNormal.game.caucuses.find((c) => c.id === 'caucus_dem_institutional'); // was 68 Historic
  const progAfter = resNormal.game.caucuses.find((c) => c.id === 'caucus_dem_progressive');   // was 74 Active
  assert.strictEqual(instAfter.strength, +(68 - 3.5 * 0.2).toFixed(2), 'Historic Caucus takes -80% fray (-0.7)');
  assert.strictEqual(progAfter.strength, +(74 - 3.5).toFixed(2), 'Active Caucus takes full natural fray (-3.5)');

  // 7b. 3-Party Chaos doubles fray rate (2.0x -> -7.0 on active at rng=0.5)
  const gChaos = FCS.initializeStartingCaucuses(makeBaseGame({ threePartyChaosActive: true }));
  const resChaos = FCS.advanceCaucusesCycle(gChaos, { rng: () => 0.5, formationChance: 0 });
  const progChaos = resChaos.game.caucuses.find((c) => c.id === 'caucus_dem_progressive');
  assert.strictEqual(progChaos.strength, +(74 - 3.5 * 2).toFixed(2), '3-Party Chaos applies 2.0x fray (-7.0)');

  // 7c. Historic Caucus loses Historic status when frayed below 40
  let gHistLoss = FCS.initializeStartingCaucuses(makeBaseGame());
  gHistLoss.caucuses = gHistLoss.caucuses.map((c) => (c.id === 'caucus_dem_institutional' ? { ...c, strength: 40.3 } : c));
  const resLoss = FCS.advanceCaucusesCycle(gHistLoss, { rng: () => 0.9, formationChance: 0 }); // 0.78 fray -> 39.52 < 40
  const instLost = resLoss.game.caucuses.find((c) => c.id === 'caucus_dem_institutional');
  assert.strictEqual(instLost.status, 'active', 'Historic status stripped below strength 40');
  assert.ok(resLoss.events.some((e) => e.type === 'caucus_lost_historic' && e.caucusId === 'caucus_dem_institutional'));

  // 7d. ~20% chance for long-running Active Caucus to harden into Historic
  const rngHarden = makeSeededRng(777);
  let hardenedCount = 0;
  for (let i = 0; i < 400; i++) {
    const gTrial = {
      year: 2040,
      seed: i + 1,
      factions: [
        { id: 'a1', partyId: 'people', sliders: { social: 5, economic: 5, governance: 5 }, keyIssues: ['x'] },
        { id: 'a2', partyId: 'people', sliders: { social: 5, economic: 5, governance: 5 }, keyIssues: ['x'] },
        { id: 'a3', partyId: 'people', sliders: { social: 8, economic: 8, governance: 8 }, keyIssues: ['y'] },
      ],
      caucuses: [
        { id: 'c_long', partyId: 'people', name: 'Long Active', memberFactionIds: ['a1', 'a2'], strength: 70, status: 'active', cyclesActive: 6, createdYear: 2028 },
        { id: 'c_solo', partyId: 'people', name: 'Solo Caucus', memberFactionIds: ['a3'], strength: 0, status: 'solo', cyclesActive: 6, createdYear: 2028 },
      ],
    };
    const r = FCS.advanceCaucusesCycle(gTrial, { rng: rngHarden, formationChance: 0 });
    if (r.events.some((e) => e.type === 'caucus_hardened_historic')) hardenedCount++;
  }
  const hardenRate = hardenedCount / 400;
  assert.ok(hardenRate >= 0.14 && hardenRate <= 0.26, `Historic hardening rate expected ~0.20, got ${hardenRate}`);

  // 7e. Solo factions in a 3+ faction party form a new compatible Caucus
  const gSoloForm = {
    year: 2032,
    seed: 99,
    threePartyChaosActive: false,
    factions: [
      { id: 's1', partyId: 'liberty', sliders: { social: 3.5, economic: 9.0, governance: 9.0 }, keyIssues: ['Tax Cuts', 'Deregulation'], happiness: 65 },
      { id: 's2', partyId: 'liberty', sliders: { social: 3.8, economic: 9.5, governance: 9.3 }, keyIssues: ['Tax Cuts', 'Fed Audit'], happiness: 60 },
      { id: 's3', partyId: 'liberty', sliders: { social: 3.5, economic: 7.0, governance: 3.0 }, keyIssues: ['Free Trade', 'Civil Liberties'], happiness: 55 },
    ],
    caucuses: [],
  };
  const initializedSolo = FCS.initializeStartingCaucuses(gSoloForm);
  const formedRes = FCS.advanceCaucusesCycle(initializedSolo, { rng: () => 0.5, formationChance: 1.0 });
  const newMulti = formedRes.game.caucuses.find((c) => c.partyId === 'liberty' && c.status === 'active');
  assert.ok(newMulti, 'Compatible Solo factions formed a new active Caucus');
  assert.deepStrictEqual(newMulti.memberFactionIds.sort(), ['s1', 's2']);
  assert.ok(formedRes.events.some((e) => e.type === 'caucus_formed' && e.partyId === 'liberty'));
  const outsiderSolo = formedRes.game.caucuses.find((c) => c.partyId === 'liberty' && c.status === 'solo');
  assert.ok(outsiderSolo && outsiderSolo.memberFactionIds.includes('s3'), 'Incompatible 3rd faction stays outside as Solo');
});

console.log(`\nALL ${passed}/7 INTRA-PARTY FACTION CAUCUS TESTS PASSED!`);
