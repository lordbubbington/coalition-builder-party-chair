'use strict';

const assert = require('assert');
const path = require('path');

global.window = global.window || global;
const Adapter = require(path.resolve(__dirname, '..', 'voting-reform-map-adapter.js'));

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== VOTING REFORM MAP ADAPTER UNIT TEST SUITE ===');

test('1. UMD export exposes window.VotingReformMapAdapter and module.exports', () => {
  assert.ok(Adapter && typeof Adapter.buildReformPatternDefs === 'function');
  assert.ok(typeof Adapter.getStateMapVisualAdaptation === 'function');
  assert.ok(typeof Adapter.renderElectoralSystemBadgesSvg === 'function');
  assert.strictEqual(global.window.VotingReformMapAdapter, Adapter);
});

test('2. buildReformPatternDefs generates valid SVG <pattern> defs for PR, STV, PROP-EV, SPLIT & NPVIC', () => {
  const game = {
    player: { custom: false, baseTemplateId: 'people' },
    stateElectoralSystems: {
      CA: { allRaces: 'proportional', legislative: 'proportional' },
      OR: { allRaces: 'stv', legislative: 'stv' },
      PA: { allRaces: 'proportional_ev' },
      ME: { allRaces: 'district_split' },
      WI: { allRaces: 'plurality' },
    },
  };

  const breakdowns = {
    CA: { mapMode: 'house', systemId: 'proportional', seatsByParty: { people: 28, heritage: 18, liberty: 6 } },
    OR: { mapMode: 'house', systemId: 'stv', stvClusters: [{ clusterId: 'OR-1', seatsByParty: { people: 3, heritage: 1, green: 1 } }, { clusterId: 'OR-2', seatsByParty: { heritage: 1 } }] },
    PA: { mapMode: 'presidential', systemId: 'proportional_ev', evsByParty: { people: 10, heritage: 8, liberty: 1 } },
    ME: { mapMode: 'presidential', systemId: 'district_split', evsByParty: { people: 3, heritage: 1 } },
    WI: { mapMode: 'presidential', npvicOverridden: true, localWinner: 'heritage', npvWinner: 'people' },
  };

  const defs = Adapter.buildReformPatternDefs(game, breakdowns);
  assert.ok(defs.startsWith('<defs>') && defs.endsWith('</defs>'), 'Expected wrapped <defs>...</defs>');
  const patternCount = (defs.match(/<pattern\b/g) || []).length;
  assert.strictEqual(patternCount, 5, `Expected 5 distinct <pattern> defs, got ${patternCount}`);

  // Verify exact IDs match getStateMapVisualAdaptation fill="url(#...)"
  const caAdapt = Adapter.getStateMapVisualAdaptation(game, 'CA', 'house', { house: { byState: { CA: breakdowns.CA } } });
  const orAdapt = Adapter.getStateMapVisualAdaptation(game, 'OR', 'house', { house: { byState: { OR: breakdowns.OR } } });
  const paAdapt = Adapter.getStateMapVisualAdaptation(game, 'PA', 'presidential', { presidential: { byState: { PA: breakdowns.PA } } });
  const meAdapt = Adapter.getStateMapVisualAdaptation(game, 'ME', 'presidential', { presidential: { byState: { ME: breakdowns.ME } } });
  const wiAdapt = Adapter.getStateMapVisualAdaptation(game, 'WI', 'presidential', { presidential: { byState: { WI: breakdowns.WI } } });

  [caAdapt, orAdapt, paAdapt, meAdapt, wiAdapt].forEach((ad) => {
    assert.ok(ad.patternId, `${ad.stateId} must produce a patternId`);
    assert.strictEqual(ad.fill, `url(#${ad.patternId})`);
    assert.ok(defs.includes(`id="${ad.patternId}"`), `SVG <defs> must include pattern id=${ad.patternId}`);
    assert.ok(!/NaN|undefined/.test(defs), 'SVG <defs> must never contain NaN or undefined');
  });
});

test('3. getStateMapVisualAdaptation handles presidential NPVIC, PROP-EV, SPLIT & Sabato bonus EVs cleanly', () => {
  const game = {
    presidentialElectoralSystem: 'sabato_mended_ec',
    stateElectoralSystems: {
      NV: { allRaces: 'plurality', sabatoBonusEv: 2 },
      PA: { allRaces: 'proportional_ev' },
      NE: { allRaces: 'district_split' },
      MI: { allRaces: 'plurality' },
    },
  };

  const electionData = {
    presidential: {
      byState: {
        MI: { npvicOverridden: true, localWinner: 'heritage', npvWinner: 'people' },
        PA: { evsByParty: { people: 11, heritage: 8, liberty: 0 } },
        NE: { evsByParty: { heritage: 4, people: 1 } },
        NV: { winner: 'people', bonusEv: 2, shares: { people: 50.4, heritage: 47.6 } },
      },
    },
  };

  const mi = Adapter.getStateMapVisualAdaptation(game, 'MI', 'presidential', electionData);
  assert.strictEqual(mi.badge, 'NPVIC');
  assert.strictEqual(mi.npvicOverridden, true);
  assert.ok(mi.tooltipNote.includes('Local winner: Republican') && mi.tooltipNote.includes('Democratic via NPVIC'));

  const pa = Adapter.getStateMapVisualAdaptation(game, 'PA', 'presidential', electionData);
  assert.strictEqual(pa.badge, 'PROP-EV');
  assert.ok(pa.tooltipNote.includes('D 11') && pa.tooltipNote.includes('R 8'));

  const ne = Adapter.getStateMapVisualAdaptation(game, 'NE', 'presidential', electionData);
  assert.strictEqual(ne.badge, 'SPLIT');
  assert.ok(ne.tooltipNote.includes('R 4') && ne.tooltipNote.includes('D 1'));

  const nv = Adapter.getStateMapVisualAdaptation(game, 'NV', 'presidential', electionData);
  assert.ok(nv.bonusBadge && nv.bonusBadge.includes('Bonus EV'));
  assert.ok(nv.tooltipNote.includes('Bonus EV'));
});

test('4. getStateMapVisualAdaptation handles house & state-legislatures PR, STV, MMP & expanded House (573/692/1000)', () => {
  const game = {
    houseSize: 692,
    staticDistrictPolygons: { CA: 52 },
    stateElectoralSystems: {
      NY: { allRaces: 'open_list_proportional', legislative: 'open_list_proportional' },
      MA: { allRaces: 'stv', legislative: 'stv' },
      TX: { allRaces: 'mmp', legislative: 'mmp' },
      CA: { allRaces: 'plurality', legislative: 'plurality' },
    },
  };

  const electionData = {
    house: {
      byState: {
        NY: { totalSeats: 26, seatsByParty: { people: 16, heritage: 8, green: 2 } },
        MA: { stvClusters: [{ name: 'East', seatsByParty: { people: 5, green: 1 } }, { name: 'West', seatsByParty: { people: 2, heritage: 1 } }] },
        TX: { localSeatsByParty: { heritage: 20, people: 12 }, listSeatsByParty: { people: 8, liberty: 3, heritage: 1 }, totalSeats: 44 },
        CA: { totalSeats: 83, seatsByParty: { people: 50, heritage: 28, liberty: 5 } },
      },
    },
    stateLegislatures: {
      NY: { totalSeats: 150, seatsByParty: { people: 92, heritage: 48, green: 10 } },
      TX: { localSeatsByParty: { heritage: 85, people: 65 }, listSeatsByParty: { people: 15, liberty: 8 }, totalSeats: 173 },
    },
  };

  const nyHouse = Adapter.getStateMapVisualAdaptation(game, 'NY', 'house', electionData);
  assert.strictEqual(nyHouse.badge, 'PR');
  assert.strictEqual(nyHouse.bypassDistrictPolygons, true);
  assert.ok(nyHouse.fill.startsWith('url(#'));

  const maHouse = Adapter.getStateMapVisualAdaptation(game, 'MA', 'house', electionData);
  assert.strictEqual(maHouse.badge, 'STV');
  assert.strictEqual(maHouse.bypassDistrictPolygons, true);
  assert.ok(maHouse.tooltipNote.includes('East:') && maHouse.tooltipNote.includes('West:'));

  const txHouse = Adapter.getStateMapVisualAdaptation(game, 'TX', 'house', electionData);
  assert.strictEqual(txHouse.badge, 'MMP');
  assert.strictEqual(txHouse.preserveDistrictPolygons, true);
  assert.ok(txHouse.cssClasses.includes('mmp-double-border'));
  assert.ok(txHouse.mmpSeatBarHtml && txHouse.mmpSeatBarHtml.includes('Local (32) vs. List Top-Up (12)'));

  const caExp = Adapter.getStateMapVisualAdaptation(game, 'CA', 'house', electionData);
  assert.strictEqual(caExp.bypassDistrictPolygons, true);
  assert.strictEqual(caExp.seatCount, 83);
  assert.ok(caExp.tooltipNote.includes('CA: 83 House seats'), `Expected updated seat note, got: ${caExp.tooltipNote}`);

  const nyLeg = Adapter.getStateMapVisualAdaptation(game, 'NY', 'state-legislatures', electionData);
  assert.strictEqual(nyLeg.badge, 'PR');
  assert.strictEqual(nyLeg.bypassDistrictPolygons, true);

  [nyHouse, maHouse, txHouse, caExp, nyLeg].forEach((ad) => {
    const serialized = JSON.stringify(ad);
    assert.ok(!/\bNaN\b|\bundefined\b/.test(serialized), `Found NaN/undefined in adaptation: ${serialized}`);
  });
});

test('5. renderElectoralSystemBadgesSvg toggles on/off and renders RCV/APR/PR/STV/MMP/SPLIT/PROP-EV/NPVIC pills', () => {
  const game = {
    stateElectoralSystems: {
      AK: { allRaces: 'rcv' },
      ME: { allRaces: 'approval' },
      CA: { allRaces: 'proportional', legislative: 'proportional' },
      OR: { allRaces: 'stv', legislative: 'stv' },
      TX: { allRaces: 'mmp', legislative: 'mmp' },
      NE: { allRaces: 'district_split' },
      PA: { allRaces: 'proportional_ev' },
      WI: { allRaces: 'plurality' },
    },
  };
  const centroids = {
    AK: { cx: 120, cy: 520 },
    ME: { cx: 880, cy: 110 },
    CA: { cx: 90, cy: 290 },
    OR: { cx: 100, cy: 170 },
    TX: { cx: 430, cy: 420 },
    NE: { cx: 420, cy: 230 },
    PA: { cx: 760, cy: 220 },
    WI: { cx: 560, cy: 150 },
    AL: { cx: 640, cy: 390 }, // plurality untouched
  };
  const electionData = {
    presidential: {
      byState: {
        WI: { npvicOverridden: true, localWinner: 'heritage', npvWinner: 'people' },
        NE: { evsByParty: { heritage: 4, people: 1 } },
        PA: { evsByParty: { people: 10, heritage: 8, liberty: 1 } },
      },
    },
  };

  assert.strictEqual(Adapter.renderElectoralSystemBadgesSvg(game, centroids, 'presidential', false, electionData), '');

  const svgOverlay = Adapter.renderElectoralSystemBadgesSvg(game, centroids, 'presidential', true, electionData);
  ['RCV', 'APR', 'PR', 'STV', 'MMP', 'SPLIT', 'PROP-EV', 'NPVIC'].forEach((pill) => {
    assert.ok(svgOverlay.includes(`data-reform-badge="${pill}"`), `Expected SVG pill ${pill}`);
  });
  assert.strictEqual(svgOverlay.includes('data-map-state="AL"'), false, 'Plurality state AL should not render reform badge');
  assert.ok(!/NaN|undefined/.test(svgOverlay), 'Overlay SVG must never contain NaN or undefined');
});

console.log(`\nALL ${passed}/5 VOTING REFORM MAP ADAPTER TESTS PASSED.`);
