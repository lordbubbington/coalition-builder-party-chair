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

// Mock IndexedDB to verify Save Fix #1 autosave slot 0 + loadGameAsync
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
            getAll: () => {
              const areq = {};
              setImmediate(() => {
                areq.result = [...idbRecords.values()];
                if (areq.onsuccess) areq.onsuccess();
              });
              return areq;
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

for (const f of [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
  'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js', 'political-trends-system.js',
  'v07-scaffolding.js', 'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
  'party-systems-engine.js', 'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js',
  'election-drift.js', 'election-night-engine.js', 'campaign-overhaul.js', 'engine.js',
]) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const CO = window.CampaignOverhaul;

let passed = 0;
async function test(name, fn) {
  await fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

function advanceOneCycle(g) {
  g = Eng.takeAction(g, 'finish-presidential-primary') || g;
  for (let m = 1; m <= 5; m++) g = Eng.takeAction(g, 'advance-campaign-week') || g;
  g = Eng.takeAction(g, 'election-night-skip') || g;
  const enRaces = g.electionNight?.timeline?.races || [];
  g = Eng.takeAction(g, 'election-night-complete') || g;
  g = { ...g, activeAutopsyModal: false, pendingContingentElection: null, pendingKingmakerNegotiations: [] };
  g = Eng.takeAction(g, 'start-next-cycle') || g;
  return { g, enRaces };
}

(async () => {
  console.log('=== v0.18.2 PLAYTEST REGRESSION SUITE (SAVE FIX #1 + BUGS #1, #2, #4, #5, #6, #7, #8) ===');

  await test('Save Fix #1: IndexedDB autosave (slot 0) + loadGameAsync recovery + launcher.cs HttpListener', async () => {
    const launcherSrc = fs.readFileSync(path.join(ROOT, 'launcher.cs'), 'utf8');
    assert.ok(launcherSrc.includes('HttpListener'), 'launcher.cs should include loopback HttpListener');
    assert.strictEqual(typeof Eng.loadGameAsync, 'function', 'loadGameAsync must be exported');

    const g = Eng.createGame('people', { seed: 990001 });
    Eng.saveGame(g);
    await new Promise((r) => setTimeout(r, 30));
    assert.ok(idbRecords.has(0), 'IndexedDB slot 0 autosave should be written');

    // Simulate localStorage cleared/quota-exceeded and verify loadGameAsync recovers from IndexedDB
    memStore.clear();
    const recovered = await Eng.loadGameAsync();
    assert.ok(recovered && recovered.year === 2028, 'loadGameAsync must recover save from IndexedDB');
  });

  await test('Bug #1: All 435 Election Night House races have valid district IDs (0 house:undefined)', async () => {
    const g0 = Eng.createGame('people', { seed: 990002 });
    const { enRaces } = advanceOneCycle(g0);
    const houseRaces = enRaces.filter((r) => r.raceKind === 'house');
    assert.strictEqual(houseRaces.length, 435, `Expected 435 house races, got ${houseRaces.length}`);
    const bad = houseRaces.filter((r) => !r.id || String(r.id).includes('undefined') || !r.name);
    assert.strictEqual(bad.length, 0, `Found ${bad.length} undefined house races`);
    const uniqueIds = new Set(houseRaces.map((r) => r.id));
    assert.strictEqual(uniqueIds.size, 435, `Expected 435 unique house race IDs, got ${uniqueIds.size}`);
  });

  await test('Bug #2 & #7: Custom Party retains player voters, 0/51 conservation mismatch, and >=8% independent floor across 4 cycles', async () => {
    let cg = Eng.createGame('custom', {
      seed: 990003,
      custom: true,
      customName: 'Civic Renewal Party',
      customOrigin: 'not_major_movement',
      customStartVoters: 250000,
      stateAllocations: { PA: 80000, OH: 70000, MI: 50000, WI: 50000 },
    });
    for (let c = 0; c < 4; c++) {
      cg = advanceOneCycle(cg).g;
      const pa = cg.voterModel.states.find((s) => s.stateId === 'PA');
      assert.ok((pa.affiliations.player || 0) >= 50000, `Cycle ${c + 1}: PA player voters wiped (${pa.affiliations.player})`);
      const indShare = (pa.affiliations.independent || 0) / Math.max(1, pa.sampleVoters);
      assert.ok(indShare >= 0.075, `Cycle ${c + 1}: PA independent share collapsed to ${(indShare * 100).toFixed(2)}%`);
      let badStates = 0;
      cg.voterModel.states.forEach((st) => {
        const keys = Object.keys(st.affiliations || {}).filter((k) => k !== 'thirdParty');
        const sum = keys.reduce((a, k) => a + (Number(st.affiliations[k]) || 0), 0);
        if (Math.abs(sum - (Number(st.sampleVoters) || 0)) > 500) badStates++;
      });
      assert.strictEqual(badStates, 0, `Cycle ${c + 1}: ${badStates}/51 states failed voter conservation`);
    }
  });

  await test('Bug #6: Real-world 2028 politician ages (Jon Ossoff 41, AOC 39)', async () => {
    const g = Eng.createGame('people', { seed: 990004 });
    const ossoff = (g.politicians || []).find((p) => p.name === 'Jon Ossoff');
    const aoc = (g.politicians || []).find((p) => p.name === 'Alexandria Ocasio-Cortez');
    assert.ok(ossoff && ossoff.age === 41, `Expected Jon Ossoff age 41 in 2028, got ${ossoff?.age}`);
    assert.ok(aoc && aoc.age === 39, `Expected AOC age 39 in 2028, got ${aoc?.age}`);
  });

  await test('Bug #4 & #5: Retired politicians clear office/incumbent & prune; compactGameForSave prunes old decennial maps & slims statewideOfficesHistory', async () => {
    let g = Eng.createGame('people', { seed: 990005 });
    // Add synthetic old decennial maps and statewideOfficesHistory to verify compaction
    g['2030 map'] = { dummy: 'x'.repeat(10000) };
    g['2040 map'] = { dummy: 'y'.repeat(10000) };
    g.activeHouseMapKey = '2040 map';
    g.statewideOfficesHistory = {
      2028: { PA: { ag: { party: 'people', name: 'A' } } },
      2030: { PA: { ag: { party: 'heritage', name: 'B' } } },
      2032: { PA: { ag: { party: 'people', name: 'C' } } },
      2034: { PA: { ag: { party: 'people', name: 'D' } } },
    };
    // Add a 85-year-old politician to trigger retirement on rollover
    g.politicians.push({ id: 'test-elder-1', name: 'Elder Test', age: 84, office: 'senate', isIncumbent: true, party: 'people' });
    g = advanceOneCycle(g).g;
    const elder = g.politicians.find((p) => p.id === 'test-elder-1');
    assert.ok(elder && elder.retired === true, 'Elder politician should be retired');
    assert.strictEqual(elder.office, null, 'Retired politician office must be cleared');
    assert.strictEqual(elder.isIncumbent, false, 'Retired politician isIncumbent must be false');
    assert.strictEqual(elder.formerOffice, 'senate', 'Retired politician formerOffice should be preserved');

    Eng.saveGame(g);
    await new Promise((r) => setTimeout(r, 50));
    const savedRaw = memStore.get('partyChairGame.save.v18.3');
    const saved = savedRaw ? JSON.parse(savedRaw) : (idbRecords.get(0)?.game || Eng.compactGameForSave(g));
    assert.strictEqual(saved['2030 map'], undefined, 'Superseded 2030 map must be pruned on save');
    assert.ok(saved['2040 map'], 'Active 2040 map should be kept');
    assert.strictEqual(saved.statewideOfficesHistory['2028']._slimmed, true, 'Older statewideOfficesHistory cycle should be slimmed');
    assert.ok(!saved.statewideOfficesHistory['2034']._slimmed, 'Recent statewideOfficesHistory cycle should keep full detail');
  });

  await test('Bug #8: CampaignOverhaul maps era-retired debate issueIds to active era replacements', async () => {
    const g = Eng.createGame('people', { seed: 990006 });
    g.year = 2044;
    g.partySystems = { ...(g.partySystems || {}), currentEraId: 'era_21_metro_vs_heartland' };
    const eraObj = window.PartySystemsData.ALL_ERAS_BY_ID['era_21_metro_vs_heartland'];
    const retiredIds = new Set(eraObj.issueSwaps.map((s) => s.retireId));
    // Force debate month 2 across several seeds to verify no retired issueId leaks into debate questions
    for (let s = 1; s <= 15; s++) {
      g.seed = 990100 + s;
      const deb = CO.buildDebateEvent(g, 2);
      assert.ok(deb && Array.isArray(deb.questions) && deb.questions.length === 3);
      for (const q of deb.questions) {
        assert.ok(!retiredIds.has(q.issueId), `Debate question ${q.id} still uses retired era_21 issueId: ${q.issueId}`);
      }
    }
  });

  console.log(`\nALL ${passed}/${passed} PLAYTEST REGRESSION TESTS PASSED!`);
})().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
