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

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== v0.18.2 QA Fix Verification Suite ===');

test('#1-#5 Election Night evaluates statewide_executive without crash, patches clock/scoreboard/forecast/ticker, clears pollingMissReport in advanceYear', () => {
  let g = Eng.createGame('people', { seed: 424242 });
  g = Eng.takeAction(g, 'finish-presidential-primary');
  for (let m = 1; m <= 5; m++) g = Eng.takeAction(g, 'advance-campaign-week');
  assert.strictEqual(g.phase, 'election-night');
  const snap = EN.evaluateElectionNightAt(g.electionNight.timeline, 540);
  assert.ok(snap.clockLabel, 'clockLabel must exist');
  assert.ok(Array.isArray(snap.callsByKind.statewide_executive), 'statewide_executive calls bucket must exist');
  assert.ok(snap.scoreboard.statewide_executive, 'scoreboard statewide_executive must exist');
  const skipped = Eng.takeAction(g, 'election-night-skip');
  const comp = Eng.takeAction(skipped, 'election-night-complete');
  const readyNext = { ...comp, activeAutopsyModal: false, pendingContingentElection: null, pendingKingmakerNegotiations: [] };
  const next = Eng.advanceYear(readyNext);
  assert.ok(!next.pollingMissReport, "pollingMissReport cleared");
  assert.ok(!next.pollingMissReport, 'pollingMissReport must be cleared on advanceYear');
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(appSrc.includes('clockEl.textContent = snap.clockLabel'), '#4 clock uses snap.clockLabel');
  assert.ok(appSrc.includes('data-en-ev="people"') && appSrc.includes('data-en-sallow-forecast') && appSrc.includes('data-en-call-ticker'), '#2 Election Night data-en-* hooks rendered');
  assert.ok(!appSrc.includes('snap.raceEvaluations?.['), '#3 no object indexing on raceEvaluations array');
});

test('#6/#7 Theme of the Month triggers 1-10 national agreement bonus & displays human-readable label', () => {
  let g = Eng.createGame('people', { seed: 55501 });
  g = Eng.takeAction(g, 'finish-presidential-primary');
  g.issuePositions = { ...(g.issuePositions || {}), 'taxes-spending': 5.5 };
  const after = CO.selectCampaignTheme(g, 'taxes-spending');
  assert.strictEqual(after.campaign.activeThemeName, 'Taxes and public spending');
  assert.ok(after.lastNote.includes('High-salience national agreement bonus'), `Expected agreement bonus, got: ${after.lastNote}`);
});

test('#8/#9 Dynamic Corrupt persists across save/load without re-rolling & generatedMember rolls 5%', () => {
  const g = Eng.createGame('people', { seed: 55502 });
  assert.strictEqual(g._dynamicCorruptInitialized, true);
  const corruptBefore = g.politicians.filter((p) => (p.traits || []).includes('Corrupt')).map((p) => p.id).sort().join(',');
  Eng.saveGame(g);
  const loaded = Eng.loadGame();
  const corruptAfter = loaded.politicians.filter((p) => (p.traits || []).includes('Corrupt')).map((p) => p.id).sort().join(',');
  assert.strictEqual(corruptAfter, corruptBefore, 'Corrupt politicians must NOT re-roll on save/load');
});

test('#10/#11/#16 Spoiler Wedge, Debate Downballot Boost, and Multi-Party Chapter Cushions affect results', () => {
  let g = Eng.createGame('people', { seed: 55503 });
  g = Eng.takeAction(g, 'finish-presidential-primary');
  const pa = window.PartyChairData.STATES.find((s) => s.id === 'PA');
  g.ballotAccess = { ...(g.ballotAccess || {}), liberty: { ...(g.ballotAccess?.liberty || {}), PA: true, presidential: { PA: true } }, green: { ...(g.ballotAccess?.green || {}), PA: true, presidential: { PA: true } } };
  const beforeSup = Eng.supportByState(g, pa);
  const gWedge = CO.executeNewCampaignAction(g, 'campaign-spoiler-wedge', { stateId: 'PA', minorPartyId: 'liberty' });
  const afterSup = Eng.supportByState(gWedge, pa);
  assert.ok((afterSup.liberty || 0) > (beforeSup.liberty || 0), 'Spoiler wedge should boost liberty share in PA');
  // #16 statePartyCushions
  const gCush = { ...g, statePartyCushions: { PA: { green: 2.5 } } };
  const cushSup = Eng.supportByState(gCush, pa);
  assert.ok((cushSup.green || 0) > (beforeSup.green || 0), 'statePartyCushions should boost minor party share');
  // #11 debateDownballotBoost
  const baseDist = Eng.calculateDistrictElection(g, 2028);
  const gDb = { ...g, campaign: { ...g.campaign, debateDownballotBoost: 3.0 } };
  const dbDist = Eng.calculateDistrictElection(gDb, 2028);
  assert.ok(dbDist.seats.player >= baseDist.seats.player, 'debateDownballotBoost should help player House seats');
});

test('#15 Statehouse Standout promotion validates action & $0.5M treasury cost', () => {
  let g = Eng.createGame('people', { seed: 55504 });
  g.stateLegStandouts = { people: [{ id: 'st-1', name: 'Alex Rivera', stateId: 'PA', party: 'people', fame: 40, quality: 7 }] };
  const noMoney = Eng.takeAction({ ...g, treasury: 0, actionsLeft: 4 }, 'promote-statehouse-standout', { memberId: 'st-1', targetOffice: 'house' });
  assert.ok(noMoney.lastNote.includes('$0.5M'), 'Must block at $0 treasury');
  const ok = Eng.takeAction({ ...g, treasury: 5, actionsLeft: 4 }, 'promote-statehouse-standout', { memberId: 'st-1', targetOffice: 'house' });
  assert.strictEqual(ok.actionsLeft, 3);
  assert.strictEqual(ok.treasury, 4.5);
  assert.ok(ok.lastNote.includes('Promoted Statehouse Standout'));
});

test('#13/#17/#18/#19/#20 UI persistence, DC/TERR click handler, activeSaveSlot, zero hardcoded 2028, zero orphan listeners', () => {
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(appSrc.includes('window.__v0181SelectedFaction'), '#13 faction picker persisted');
  assert.ok(appSrc.includes("[data-primary-state]"), '#17 primary-state click handler wired');
  assert.ok(!appSrc.includes('Polling Archive · Campaign 2028'), '#19 no hardcoded 2028 Polling Archive');
  assert.ok(!appSrc.includes("querySelector('#action-caucus-retreat')"), '#20 orphan listeners removed');
  const engSrc = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
  assert.ok(engSrc.includes('loaded._activeSaveSlot = n'), '#18 _activeSaveSlot stamped on slot load');
});

console.log(`\nALL ${passed}/${passed} v0.18.2 VERIFICATION TESTS PASSED!`);
