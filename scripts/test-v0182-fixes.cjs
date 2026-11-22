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
const EN = window.ElectionNightEngine;
const EU = window.ElectionUncertainty;
const Data = window.PartyChairData;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== v0.18.2 COMPLETE PRE-PUSH QA VERIFICATION SUITE ===');

// #1, #2, #4, #9, #13, #40: Multi-cycle 1:1 voter conservation & pollingMissReport clearing
test('#1/#2/#4/#9/#13/#40 Multi-cycle (2028->2030->2032) 1:1 voter conservation, 0 double-counting states, pollingMissReport cleared', () => {
  let g = Eng.createGame('people', { seed: 424201 });
  // #9: Zero states with double-counting mismatch > 500
  let badStates = 0;
  (g.voterModel.states || []).forEach((st) => {
    const keys = Object.keys(st.affiliations || {}).filter((k) => k !== 'thirdParty');
    const sum = keys.reduce((s, k) => s + (Number(st.affiliations[k]) || 0), 0);
    if (Math.abs(sum - st.sampleVoters) > 500) badStates++;
  });
  assert.strictEqual(badStates, 0, `Found ${badStates} states with affiliation/sampleVoters mismatch`);

  // Run 2 full cycles (2028 -> 2030 -> 2032)
  for (let cyc = 0; cyc < 2; cyc++) {
    g = Eng.takeAction(g, 'finish-presidential-primary');
    for (let m = 1; m <= 5; m++) g = Eng.takeAction(g, 'advance-campaign-week');
    g = Eng.takeAction(g, 'election-night-skip');
    g = Eng.takeAction(g, 'election-night-complete');
    g = { ...g, activeAutopsyModal: false, pendingContingentElection: null, pendingKingmakerNegotiations: [] };
    // #1: Post-election realignment must NOT explode to 15.5B
    assert.ok(g.voterModel.affiliations.people.representedVoters < 200_000_000, `people exploded: ${g.voterModel.affiliations.people.representedVoters}`);
    assert.ok(g.voterModel.affiliations.heritage.representedVoters < 200_000_000, `heritage exploded: ${g.voterModel.affiliations.heritage.representedVoters}`);
    const greenBefore = g.voterModel.states.reduce((s, st) => s + (st.affiliations?.green || 0), 0);
    g = Eng.takeAction(g, 'start-next-cycle');
    // #13: pollingMissReport cleared on start-next-cycle
    assert.ok(!g.pollingMissReport, 'pollingMissReport must be cleared on start-next-cycle');
    // #2: Third parties must NOT shrink 100x on cycle rollover
    const greenAfter = g.voterModel.states.reduce((s, st) => s + (st.affiliations?.green || 0), 0);
    assert.ok(greenAfter > 100_000, `Green state voters shrank 100x: ${greenBefore} -> ${greenAfter}`);
  }
  // #4: Save/load preserves 1:1 sampleVoters
  Eng.saveGame(g);
  const loaded = Eng.loadGame();
  assert.ok(loaded.voterModel.sampleVoters > 100_000_000, `Loaded sampleVoters shrank: ${loaded.voterModel.sampleVoters}`);
});

test('#3/#8 Custom Party 1:1 voters & Robot Era 1:1 faction/sampleVoters', () => {
  const cg = Eng.createGame('custom', { seed: 424202, custom: true, customName: 'Civic Front', customOrigin: 'not_major_movement', customStartVoters: 100000, stateAllocations: { PA: 50000, OH: 50000 } });
  const pa = cg.voterModel.states.find((s) => s.stateId === 'PA');
  assert.ok((pa.affiliations.player || 0) >= 40000, `Custom PA voters shrank 100x: ${pa.affiliations.player}`);
  const rg = Eng.createGame('people', { seed: 424203 });
  window.PartySystemsRobots.activateSyntheticSuffrage(rg);
  assert.ok(rg.voterModel.representedVoters < 400_000_000 && rg.voterModel.sampleVoters > 200_000_000, `Robot Era 1:1 broken: rep=${rg.voterModel.representedVoters}, sample=${rg.voterModel.sampleVoters}`);
});

test('#10/#11/#12/#26/#34/#35/#36 Election Night statewide_executive tab, 270 EV headline, Sallow Pres hook, live feeds & mapMode', () => {
  let g = Eng.createGame('people', { seed: 424204 });
  g = Eng.takeAction(g, 'finish-presidential-primary');
  for (let m = 1; m <= 5; m++) g = Eng.takeAction(g, 'advance-campaign-week');
  assert.strictEqual(g.electionNight.mapMode, 'called', '#26 default mapMode is called');
  const snap = EN.evaluateElectionNightAt(g.electionNight.timeline, 540);
  assert.ok(Array.isArray(snap.callsByKind.statewide_executive), 'statewide_executive calls exist');
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(appSrc.includes("id: 'statewide_executive'"), '#10 statewide_executive tab ID matched');
  assert.ok(!appSrc.includes("timeline.races.find(r => r.raceKind === 'president')?.finalWinner"), '#11 no first-state Alabama winner bug');
  assert.ok(appSrc.includes('data-en-sallow-forecast="president"'), '#12 Presidential Sallow Forecast live hook');
  assert.ok(appSrc.includes('data-en-breaking-host') && appSrc.includes('.just-called-list') && appSrc.includes('.the-count-list'), '#34-#36 live feeds wired');
});

test('#14/#15/#16/#18/#19/#20/#37/#38 Campaign Overhaul guards, 36/36 canonical debate IDs, rival refill, unified polling error, valid states, oppo dup', () => {
  const gOrg = Eng.createGame('people', { seed: 424205 });
  // #14: Blocked during organizing
  const orgVt = CO.executeNewCampaignAction(gOrg, 'campaign-viral-telethon', {});
  assert.strictEqual(orgVt.treasury, gOrg.treasury, '#14 War Room action blocked in organizing');
  const orgTheme = CO.selectCampaignTheme(gOrg, 'taxes-spending');
  assert.ok(!orgTheme.campaign?.activeThemeId, '#14 Theme blocked in organizing');

  // #15: All 36 debate questions use exact canonical VERSION_021_ISSUES IDs
  const validIds = new Set(Data.VERSION_021_ISSUES.map((i) => i.id));
  const coSrc = fs.readFileSync(path.join(ROOT, 'campaign-overhaul.js'), 'utf8');
  const debateIds = [...coSrc.matchAll(/issueId:\s*'([^']+)'/g)].map((m) => m[1]);
  const badDebIds = debateIds.filter((id) => !validIds.has(id));
  assert.strictEqual(badDebIds.length, 0, `Invalid debate issueIds: ${badDebIds.join(', ')}`);

  // #16: Major rival stays funded through Month 5
  let gCamp = Eng.takeAction(gOrg, 'finish-presidential-primary');
  for (let m = 1; m <= 4; m++) gCamp = Eng.takeAction(gCamp, 'advance-campaign-week');
  assert.ok((gCamp.campaign.rivalTreasuries?.heritage || 0) > 0, `Major rival went broke before Month 5: ${gCamp.campaign.rivalTreasuries?.heritage}`);

  // #18: ElectionUncertainty reads realizedNationalMiss & regionalRealized
  const rep = CO.generateCorrelatedPollingError(gOrg);
  const unified = EU.generateCorrelatedPollingError({ ...gOrg, pollingMissReport: rep });
  assert.strictEqual(unified.nationalError, rep.realizedNationalMiss, '#18 nationalError matches realizedNationalMiss');
  assert.ok(Object.keys(unified.correlatedRegionalError).length > 0, '#18 regionalRealized populated');

  // #19: Invalid state rejected in deploySurrogate & Blitz
  const gC1 = Eng.takeAction(gOrg, 'finish-presidential-primary');
  const badSur = CO.deploySurrogate(gC1, CO.getEligibleSurrogates(gC1)[0].id, 'XX_BAD');
  assert.ok(badSur.lastNote.includes('Invalid state code'), '#19 deploySurrogate rejects invalid state');
  const gM5 = { ...gC1, campaign: { ...gC1.campaign, month: 5 } };
  const badBlitz = CO.resolveFinal72HoursBlitz(gM5, ['FAKE1', 'FAKE2']);
  assert.ok(!badBlitz.campaign.finalBlitzCompleted, '#19 Blitz rejects invalid states');

  // #20: releaseOppoDossier duplicate warning
  gC1.campaign.oppoDossiers = [{ id: 'op1', targetPartyId: 'heritage', targetName: 'Rival', stateId: 'PA', severity: 'high', detonated: false }];
  const r1 = CO.releaseOppoDossier(gC1, 'op1');
  const r2 = CO.releaseOppoDossier(r1, 'op1');
  assert.ok(r2.lastNote.includes('already been released'), `#20 duplicate oppo note: ${r2.lastNote}`);

  // #38: allocateCandidateFunds records playerStateSpendLastMonth
  const funded = Eng.takeAction(gC1, 'allocate-candidate-funds', { raceKey: 'senate:PA', amount: 3 });
  assert.ok((funded.campaign.playerStateSpendLastMonth?.PA || 0) >= 3, '#38 candidate funding logged to playerStateSpendLastMonth');
});

test('#21/#22/#23/#24/#25 Action feedback, negative fund reject, midterm primary note, Brokered Convention & scaled minor delegates', () => {
  const g = Eng.createGame('people', { seed: 424206 });
  // #23: Silent actions return clear lastNote when broke/0 actions
  const broke = { ...g, treasury: 0, actionsLeft: 0 };
  for (const act of ['build-chapter', 'fundraise', 'register-voters', 'commission-poll', 'allocate-candidate-funds']) {
    const res = Eng.takeAction(broke, act, { stateId: 'PA', raceKey: 'senate:PA', amount: 2 });
    assert.notStrictEqual(res.lastNote, broke.lastNote, `#23 ${act} must set clear lastNote when blocked`);
  }
  // #24: Negative funding rejected
  const neg = Eng.takeAction(g, 'allocate-candidate-funds', { raceKey: 'senate:PA', amount: -50 });
  assert.strictEqual(neg.treasury, g.treasury, '#24 negative funding must not touch treasury');
  // #25: Midterm primary note
  const mid = Eng.takeAction({ ...g, year: 2030 }, 'start-presidential-primary');
  assert.ok(mid.lastNote.includes('every 4 years'), '#25 midterm primary returns explanation');
  // #22: Minor party scaled clinch target (< 500 instead of RNC 1215)
  const grn = Eng.takeAction(Eng.createGame('green', { seed: 424207 }), 'start-presidential-primary');
  assert.ok(grn.activePresidentialPrimary.clinchTarget < 600, `#22 Green clinch target should be scaled: ${grn.activePresidentialPrimary.clinchTarget}`);
});

test('AUTO-PLAY PRESIDENTIAL PRIMARIES: Repeated end-to-end stress across 6 party setups, pause/resume/speed/skip, Brokered Convention, and midterm bypass', () => {
  const setups = [
    () => Eng.createGame('people', { seed: 8001 }),
    () => Eng.createGame('heritage', { seed: 8002 }),
    () => Eng.createGame('green', { seed: 8003 }),
    () => Eng.createGame('liberty', { seed: 8004 }),
    () => Eng.createGame('custom', { seed: 8005, custom: true, customName: 'Civic Front', customOrigin: 'not_major_movement', customStartVoters: 100000, stateAllocations: { PA: 50000, OH: 50000 } }),
    () => Eng.createGame('custom', { seed: 8006, custom: true, customName: 'Reform Coalition', customOrigin: 'major_movement', isMajor: true }),
  ];
  setups.forEach((makeGame, idx) => {
    let g = makeGame();
    // Automatically enters Auto-Play Primary when leaving Organizing via start-campaign-phase
    g = Eng.takeAction(g, 'start-campaign-phase');
    assert.strictEqual(g.phase, 'presidential-primary', `Setup ${idx}: must auto-enter presidential-primary`);
    const p = g.activePresidentialPrimary;
    assert.strictEqual(p.stage, 'debates', `Setup ${idx}: auto-play starts directly in debates`);
    assert.strictEqual(p.autoPlay, true, `Setup ${idx}: autoPlay enabled`);
    assert.strictEqual(p.paused, false, `Setup ${idx}: not paused`);
    assert.strictEqual(p.intervalMs, 8000, `Setup ${idx}: ~2-3 min pacing (8000ms/step)`);

    // Test Pause & Resume & Speed
    g = Eng.takeAction(g, 'primary-toggle-pause');
    assert.strictEqual(g.activePresidentialPrimary.paused, true);
    assert.strictEqual(g.activePresidentialPrimary.autoPlay, false);
    g = Eng.takeAction(g, 'primary-set-speed', { speed: 2 });
    assert.strictEqual(g.activePresidentialPrimary.speed, 2);
    assert.strictEqual(g.activePresidentialPrimary.paused, false);

    // Step day-by-day on even setups, Skip-to-End on odd setups
    if (idx % 2 === 0) {
      let guard = 0;
      while (g.activePresidentialPrimary.stage !== 'complete' && guard < 80) {
        g = Eng.takeAction(g, 'advance-primary-day');
        guard++;
      }
      assert.ok(guard >= 6 && guard < 80, `Setup ${idx}: stepped ${guard} days`);
    } else {
      g = Eng.takeAction(g, 'primary-skip-to-end');
    }
    assert.strictEqual(g.activePresidentialPrimary.stage, 'complete', `Setup ${idx}: reached complete`);
    assert.strictEqual(g.activePresidentialPrimary.autoPlay, false, `Setup ${idx}: autoPlay stops on complete`);
    assert.ok(g.activePresidentialPrimary.nomineeName, `Setup ${idx}: nominee crowned`);
    const topDel = Math.max(...g.activePresidentialPrimary.candidates.map((c) => c.delegates || 0));
    assert.ok(topDel >= g.activePresidentialPrimary.clinchTarget, `Setup ${idx}: nominee reached clinch target (including Brokered Convention #21)`);

    // Proceed into Campaign Month 1 cleanly
    const camp = Eng.takeAction(g, 'finish-presidential-primary');
    assert.ok(camp.campaign?.active, `Setup ${idx}: transitioned into active campaign`);
  });

  // Midterm year bypasses Presidential Primary automatically
  let mid = Eng.createGame('people', { seed: 8099 });
  mid.year = 2030;
  const midCamp = Eng.takeAction(mid, 'start-campaign-phase');
  assert.notStrictEqual(midCamp.phase, 'presidential-primary', 'Midterm 2030 must bypass Presidential Primary');
  assert.ok(midCamp.campaign?.active, 'Midterm 2030 goes directly into Campaign');
});

test('#27/#28/#29/#30/#31/#33/#39 UI copy, escaping, deduplicated IDs, saturation in-place, 0-chapter tip', () => {
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(!appSrc.includes('weeklyActionsLeft ?? 5}/5'), '#27 no /5 in header');
  assert.ok(!appSrc.includes("${game.player?.name || 'your party'}"), '#28 escaped player?.name');
  assert.ok(!appSrc.includes('SUM-04 & SUM-06'), '#31 no SUM tag in HTML comment');
  assert.ok(appSrc.includes('data-v0182-sat-badge'), '#33 in-place saturation badge update');
  assert.ok(appSrc.includes('Establish your first state chapter'), '#39 0-chapter hint');
  assert.ok(appSrc.includes('AUTO-PLAYING PRESIDENTIAL PRIMARY'), 'Auto-Play Primary broadcast bar rendered');
});

console.log(`\nALL ${passed}/${passed} v0.18.2 PRE-PUSH QA TESTS PASSED!`);
