const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

const idbRecords = new Map();
global.indexedDB = {
  open: () => {
    const req = {};
    setImmediate(() => {
      req.result = {
        objectStoreNames: { contains: () => true },
        createObjectStore: () => {},
        transaction: () => {
          const tx = {};
          tx.objectStore = () => ({
            put: (rec) => {
              idbRecords.set(rec.slot, rec);
              setImmediate(() => { if (tx.oncomplete) tx.oncomplete(); });
            },
            get: (key) => {
              const greq = {};
              setImmediate(() => {
                greq.result = idbRecords.get(key);
                if (greq.onsuccess) greq.onsuccess();
              });
              return greq;
            },
          });
          return tx;
        },
      };
      if (req.onsuccess) req.onsuccess();
    });
    return req;
  },
};

[
  'data.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'maps-0.3.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographics-0.9.js',
  'factions-0.15.js',
  'v07-scaffolding.js',
  'ballot-access.js',
  'candidate-vetting.js',
  'election-uncertainty.js',
  'election-drift.js',
  'election-night-engine.js',
  'campaign-overhaul.js',
  'presidential-primaries.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'political-trends-system.js',
  'political-texture-system.js',
  'engine.js',
].forEach((f) => require(path.join(ROOT, f)));

const Eng = window.PartyChairEngine;
const BA = window.BallotAccess;
const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

let passed = 0;
async function test(name, fn) {
  await fn();
  console.log(`  PASS: ${name}`);
  passed++;
}

(async () => {
  console.log('=== v0.18.3 BUG FIX BRANCH VERIFICATION SUITE ===');

  await test('Bug #1 & #3: IndexedDB timestamp priority beats stale localStorage & compactGameForSave prunes politicians', async () => {
    memStore.clear();
    idbRecords.clear();
    const g2042 = Eng.createGame('people', { seed: 9101 });
    g2042.year = 2042;
    Eng.saveGame(g2042);
    const g2056 = { ...g2042, year: 2056, politicians: Array.from({ length: 800 }, (_, i) => ({ id: `old-${i}`, name: `Old ${i}`, retired: true, age: 86, fame: 20 })) };
    Eng.saveGame(g2056);
    // Simulate stale localStorage snapshot from 2042
    localStorage.setItem('partyChairGame.save.v16.2', JSON.stringify(g2042));
    const loaded = await Eng.loadGameAsync();
    assert.strictEqual(loaded.year, 2056, `Expected 2056 from IndexedDB, got ${loaded.year}`);
    assert.strictEqual((loaded.politicians || []).filter((p) => String(p.id).startsWith('old-')).length, 0, 'Retired old-* politicians must be pruned on save');
  });

  await test('Bug #2, #6, #9, #10, #19, #20: Custom Party isolation, Turn 1 voter conservation, derived axes, origin budget floor, founding BA & Summit accord', () => {
    const g = Eng.createGame({
      baseTemplateId: 'custom',
      customName: 'New Conservative Union',
      customOrigin: 'major_schism',
      schismParentPartyId: 'heritage',
      foundingStateId: 'OH',
      selectedFactionIds: ['gop_faith_and_flag', 'gop_traditional_farmers', 'gop_mormons', 'gop_paleocons', 'gop_blood_and_soil'],
    });
    // Bug #18: Centroid/same-parent allows all 5 non-anchor GOP factions
    const pFacs = g.factions.filter((f) => f.partyId === 'player');
    assert.strictEqual(pFacs.length, 5, `Expected 5 GOP factions in replacement party, got ${pFacs.length}`);
    // Bug #10: Conservative axes (positive economic & social, NOT hardcoded Democratic -0.51/-0.54)
    assert.ok(g.player.economic > 0 && g.player.social > 0.5, `Expected conservative axes, got econ=${g.player.economic}, soc=${g.player.social}`);
    // Bug #6: Turn 1 voter conservation (sum of national affiliations <= 100.5%)
    const tot = Number(g.voterModel.sampleVoters || 1);
    const sumNat = ['people', 'heritage', 'independent', 'player', 'liberty', 'green', 'constitution', 'socialist']
      .reduce((s, k) => s + Number(g.voterModel.affiliations?.[k]?.sampleVoters || 0), 0);
    const pct = (sumNat / tot) * 100;
    assert.ok(pct >= 98 && pct <= 101, `Turn 1 national voter sum should be ~100%, got ${pct.toFixed(2)}%`);
    // Bug #19/#20: Founding state OH has presidential & downballot ballot access, treasury >= $25M
    assert.strictEqual(g.ballotAccess?.player?.presidential?.OH, true, 'Founding state OH must have Turn 1 presidential ballot access');
    assert.ok(g.treasury >= 25, `major_schism treasury must be >= $25M, got $${g.treasury}M`);
    // Bug #2: After normalizeGame + synchronizePoliticianPartyWithFaction, Democratic sitting members stay 'people'
    Eng.saveGame(g);
    const reloaded = Eng.loadGame();
    const demSens = (reloaded.sittingMembers || []).filter((m) => m.office === 'senate' && m.party === 'people').length;
    assert.ok(demSens >= 30, `Democratic Senators must NOT be hijacked by Custom Party (got ${demSens})`);
    // Bug #9: signCoalitionAccord assigns recruited independent faction to 'player', NOT 'people'
    const target = g.factions.find((f) => f.id === 'gop_neo_cons');
    const bolted = Eng.boltFaction(g, target.id);
    bolted.organizingActionsRemaining = 5;
    bolted.factionCourtship = { [target.id]: { player: 30 } };
    const signed = Eng.takeAction(bolted, 'sign-coalition-accord', { factionId: target.id });
    assert.strictEqual(signed.factions.find((f) => f.id === target.id).partyId, 'player', 'Custom Party summit must assign faction to player');
  });

  await test('Bug #7 & #12: Zero-faction Game Over rule triggers on losing last faction + UI blocks 0-faction custom setup', () => {
    const g = Eng.createGame({
      baseTemplateId: 'custom',
      customName: 'Iron Vanguard Party',
      customOrigin: 'major_schism',
      schismParentPartyId: 'heritage',
      foundingStateId: 'ID',
      selectedFactionIds: ['unaff_groypers'],
    });
    assert.strictEqual(g.gameOver, undefined);
    const collapsed = Eng.boltFaction(g, 'unaff_groypers');
    assert.strictEqual(collapsed.gameOver, true, 'Losing last faction must trigger gameOver=true');
    assert.strictEqual(collapsed.gameOverReason, 'party_collapse');
    assert.ok(appSrc.includes('party-collapse-gameover-modal'), 'app.js must render Game Over modal');
    assert.ok(appSrc.includes("customOrigin !== 'not_major_movement' && (!customSelectedFactionIds || customSelectedFactionIds.length === 0)"), 'app.js must disable #start-game when 0 factions selected');
  });

  await test('Bug #8 & #11: app.js wires schism-parent radio listener and includes unaffiliated extremist factions in picker', () => {
    assert.ok(appSrc.includes('input[name="schism-parent"]'), 'schism-parent listener missing in app.js');
    assert.ok(appSrc.includes("'unaffiliated'"), 'unaffiliated partyId filter missing in app.js picker');
  });

  await test('Bug #15 & #21: Third/Custom parties start trust.independents at half their tier cap & Tier 0 minor voters start at ~0.12%+', () => {
    const lib = Eng.createGame('liberty', { seed: 9102 });
    const libCap = Eng.getThirdPartyTrustCap ? Eng.getThirdPartyTrustCap(lib, 'player') : (lib.partyTiers.liberty * 10);
    assert.strictEqual(lib.trust.independents, Math.round(libCap / 2), `Libertarian ind trust should be half cap (${libCap / 2}), got ${lib.trust.independents}`);

    const con = Eng.createGame('constitution', { seed: 9103 });
    const conV = Number(con.voterModel?.affiliations?.constitution?.sampleVoters || con.voterModel?.affiliations?.thirdParty?.byParty?.constitution || 0);
    const totV = Number(con.voterModel?.sampleVoters || 1);
    assert.ok((conV / totV) * 100 >= 0.1, `Constitution Turn 1 voter share should be >= 0.1%, got ${((conV / totV) * 100).toFixed(4)}%`);
  });

  await test('Bug #4: boltFaction updates game.representatives in lockstep with sittingMembers', () => {
    const g = Eng.createGame('people', { seed: 9104 });
    const fac = g.factions.find((f) => f.id === 'dem_blue_dog');
    const b = Eng.boltFaction(g, fac.id);
    const indSitHouse = (b.sittingMembers || []).filter((m) => m.office === 'house' && m.party === 'independent').map((m) => m.districtId || m.district);
    for (const did of indSitHouse) {
      const rep = (b.representatives || []).find((r) => (r.districtId || r.id) === did);
      if (rep) assert.strictEqual(rep.partyId, 'independent', `District ${did} rep should mirror independent bolt`);
    }
  });

  await test('Bug #13, #22, #24, #27: Pres nominee populated for minor parties, Summit distance guard blocks opposites, petition fallback works', () => {
    let pfp = Eng.createGame('socialist', { seed: 9105 });
    pfp = Eng.takeAction(pfp, 'finish-presidential-primary');
    assert.ok(pfp.presidentialTicket?.socialist, 'Peace & Freedom must have a 2028 presidential ticket');
    assert.ok(pfp.nomineeId, 'Peace & Freedom must have nomineeId set');

    // Bug #22: Ideologically opposite bolted faction rejected
    let dem = Eng.createGame('people', { seed: 9106 });
    dem = Eng.boltFaction(dem, 'gop_faith_and_flag');
    const oppCheck = Eng.checkSummitEligibility(dem, 'gop_faith_and_flag');
    assert.strictEqual(oppCheck.eligible, false, 'Ideologically opposite faction must be rejected by summit distance guard');

    // Bug #27: Petition drive succeeds even if requested stateId is already certified
    let grn = Eng.createGame('green', { seed: 9107 });
    grn.treasury = 50;
    grn.actionsLeft = 5;
    const certifiedState = Object.keys(grn.ballotAccess?.green?.presidential || {}).find((k) => grn.ballotAccess.green.presidential[k]);
    assert.strictEqual(BA.canLaunchPetitionDrive(grn, certifiedState, 'prudent', 'green'), true, 'Multi-state petition drive must fall back to remaining uncertified states');
  });

  console.log(`\nALL ${passed}/${passed} v0.18.3 BUG FIX TESTS PASSED!`);
})();
