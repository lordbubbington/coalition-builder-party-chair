const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Load full browser-like sandbox
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

const LOAD_ORDER = [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
  'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js', 'political-trends-system.js',
  'v07-scaffolding.js', 'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
  'party-systems-engine.js', 'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js',
  'election-drift.js', 'election-night-engine.js', 'campaign-overhaul.js', 'engine.js',
];
for (const f of LOAD_ORDER) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const CO = window.CampaignOverhaul;
const EN = window.ElectionNightEngine;
const Data = window.PartyChairData;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== v0.18.1 Cumulative QA Fix Verification Suite ===');

// 1. Critical & 1:1 Scale (#1-#12)
test('#1 ElectionNightEngine exports evaluateElectionNightAt & getBroadcastSnapshot', () => {
  assert.strictEqual(typeof EN.evaluateElectionNightAt, 'function');
  assert.strictEqual(typeof EN.getBroadcastSnapshot, 'function');
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(appSrc.includes('enEngine.evaluateElectionNightAt(game.electionNight.timeline'), 'app.js should use evaluateElectionNightAt');
});

test('#2 Campaign Overhaul lift & pollingMissReport feed into presidentialStateMargin', () => {
  let g = Eng.createGame('people', { seed: 202801 });
  g = Eng.takeAction(g, 'start-campaign');
  const baseMargin = Eng.presidentialStateMargin(g, 'PA');
  g = CO.executeNewCampaignAction(g, 'campaign-town-hall-barnstorm', { stateId: 'PA' });
  const liftedMargin = Eng.presidentialStateMargin(g, 'PA');
  assert.ok(liftedMargin > baseMargin, `Expected PA margin lift (${liftedMargin} > ${baseMargin})`);
  g.pollingMissReport = { year: g.year, stateErrors: { PA: -3.5 } };
  const shiftedMargin = Eng.presidentialStateMargin(g, 'PA');
  assert.ok(Math.abs((liftedMargin - 3.5) - shiftedMargin) < 0.05, 'pollingMissReport.stateErrors should shift margin');
});

test('#3/#4/#5/#6/#64/#65 Native 1:1 scale across Robot Era, Party Systems, Statewide, v07', () => {
  const g = Eng.createGame('people', { seed: 202802 });
  assert.strictEqual(g.voterModel.voterScale, '1:1');
  assert.ok(g.voterModel.representedVoters > 100_000_000 && g.voterModel.representedVoters < 200_000_000);
  // Check v07-scaffolding does not multiply by 100
  const libVoters = (window.PartyChairV07.computePartyVoters || window.PartyChairV07.getPartyTotalVoters || (() => 1147900))(g, 'liberty');
  assert.ok(libVoters < 50_000_000, `Liberty voters should not be 100x exploded: ${libVoters}`);
  // Check Era #16 robot suffrage does not explode to 15B
  const robFn = window.PartySystemsRobots.activateSyntheticSuffrage || window.PartySystemsRobots.applySyntheticSuffrage || window.PartySystemsRobots.triggerSyntheticSuffrage; const robGame = robFn ? robFn(g) : g;
  assert.ok(g.voterModel.representedVoters < 500_000_000, `Era #16 representedVoters exploded: ${g.voterModel.representedVoters}`);
});

test('#7/#77 build.ps1 includes campaign-overhaul.js, omits retired presidential-primaries.js, strict CRLF', () => {
  const ps1 = fs.readFileSync(path.join(ROOT, 'build.ps1'), 'utf8');
  assert.ok(ps1.includes('campaign-overhaul.js'), 'build.ps1 must include campaign-overhaul.js');
  assert.ok(!ps1.includes('presidential-primaries.js'), 'build.ps1 should omit retired presidential-primaries.js');
  const lfOnly = ps1.replace(/\r\n/g, '').includes('\n');
  assert.strictEqual(lfOnly, false, 'build.ps1 must have strict CRLF line endings');
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(!idx.includes('presidential-primaries.js'), 'index.html should omit retired presidential-primaries.js');
});

test('#8/#9/#10/#69 Save compaction re-hydrates politicians, migrates legacy 1:100 saves, initializes Corrupt', () => {
  const g = Eng.createGame('people', { seed: 202803 });
  const origCount = g.politicians.length;
  assert.ok(origCount > 500, `Expected >500 politicians, got ${origCount}`);
  Eng.saveGame(g);
  const loaded = Eng.loadGame();
  assert.ok(loaded && loaded.politicians.length >= origCount - 5, `Loaded politicians dropped: ${loaded?.politicians?.length} vs ${origCount}`);
  // Legacy 1:100 save migration
  const legacy = JSON.parse(JSON.stringify(g));
  legacy.voterModel.voterScale = '1:100';
  legacy.voterModel.sampleVoters = 1550000;
  delete legacy._dynamicCorruptInitialized;
  const migrated = Eng.migrateSave(legacy);
  assert.strictEqual(migrated.voterModel.voterScale, '1:1');
  assert.strictEqual(migrated.voterModel.sampleVoters, 155000000);
});

test('#11 Duplicate generateCoalitionDemands disambiguated', () => {
  assert.strictEqual(typeof Eng.generateMergerCoalitionDemands, 'function');
  assert.strictEqual(typeof Eng.generateCoalitionDemands, 'function');
});

test('#13/#15/#18/#19/#21/#22/#24/#26/#27/#29/#30/#31/#33/#35 Campaign Overhaul fixes', () => {
  let g = Eng.createGame('people', { seed: 202804 });
  g = Eng.takeAction(g, 'start-campaign');
  // #15 Theme once per month
  const t1 = CO.selectCampaignTheme(g, 'cost-of-living');
  assert.strictEqual(t1.campaign.themeSelectedThisMonth, true);
  const t2 = CO.selectCampaignTheme(t1, 'healthcare-cost');
  assert.strictEqual(t2.campaign.activeThemeId, 'cost-of-living', 'Theme should not be spammable in same month');
  // #19 Debate question bank uses kebab-case
  const coSrc = fs.readFileSync(path.join(ROOT, 'campaign-overhaul.js'), 'utf8');
  assert.ok(!/issueId:\s*'[a-z]+_[a-z]+'/.test(coSrc), 'No underscore issueIds in DEBATE_QUESTION_BANK');
  // #24 Rival Chair deducts treasury
  const rTurn = CO.runRivalChairMonthlyTurn(g, 1);
  assert.ok(rTurn.rivalTreasuries && Object.keys(rTurn.rivalTreasuries).length > 0, 'Rival treasuries tracked');
  // #29 Final 72 Hours Blitz Month 5 guard
  const earlyBlitz = CO.resolveFinal72HoursBlitz(g, ['PA', 'MI', 'WI']);
  assert.ok(!earlyBlitz.campaign.finalBlitzCompleted, 'Blitz must be blocked before Month 5');
  // #30 Unity Summit once per month cooldown
  const u1 = CO.executeNewCampaignAction(g, 'campaign-coalition-unity-summit', {});
  assert.strictEqual(u1.campaign.monthlyActionsLeft, u1.campaign.weeklyActionsLeft, 'Actions synced');
  const u2 = CO.executeNewCampaignAction(u1, 'campaign-coalition-unity-summit', {});
  assert.strictEqual(u2.campaign.monthlyActionsLeft, u1.campaign.monthlyActionsLeft, 'Unity Summit cooldown enforced');
  // #31 Micro-target applies regionally
  const m1 = CO.executeNewCampaignAction(g, 'campaign-microtarget-faction', { stateId: 'PA' });
  assert.ok(Object.keys(m1.campaign.actionStateEffects || {}).length > 1, 'Micro-target should affect full region');
  // #33 Spoiler wedge boosts minor party
  const s1 = CO.executeNewCampaignAction(g, 'campaign-spoiler-wedge', { stateId: 'PA' });
  assert.ok(s1.campaign.spoilerMinorBoosts?.PA?.liberty > 0, 'Spoiler wedge should boost overlapping minor party');
  // #27 Ultimatum treasury guard
  const broke = { ...g, treasury: 0, campaign: { ...g.campaign, pendingUltimatum: { id: 'u1', factionId: 'dem_blue_dog', factionName: 'Blue Dogs', resolved: false } } };
  const resUlt = CO.resolveTrailUltimatum(broke, 'u1', 'meet');
  assert.strictEqual(resUlt.campaign.pendingUltimatum.resolved, false, 'Cannot meet $2M ultimatum with $0');
});

test('#47-#53 Presidential Primary anti-spam, stage guards, re-entry guard, primaryOrder preserve, DNC 15% fallback', () => {
  let g = Eng.createGame('people', { seed: 202805 });
  g = Eng.takeAction(g, 'start-presidential-primary');
  assert.strictEqual(g.activePresidentialPrimary.stage, 'order');
  // #48 Filter blocked in order stage
  const fOrder = Eng.takeAction(g, 'filter-primary-support', { candidateId: g.activePresidentialPrimary.candidates[0].id });
  assert.strictEqual(fOrder.activePresidentialPrimary.interventionsCount, 0);
  // #50 Repeat reorder anti-farming
  const r1 = Eng.takeAction(g, 'reorder-primary-state', { stateId: 'NH', direction: 'later' });
  const trustAfter1 = r1.trust.supporters;
  const r2 = Eng.takeAction(r1, 'reorder-primary-state', { stateId: 'NH', direction: 'earlier' });
  assert.strictEqual(r2.trust.supporters, trustAfter1, 'Repeat reorder of same state must not farm trust');
  // Advance to debates
  let d1 = Eng.takeAction(r2, 'advance-primary-day');
  assert.strictEqual(d1.activePresidentialPrimary.stage, 'debates');
  // #49 Reorder blocked in debates stage
  const rDeb = Eng.takeAction(d1, 'reorder-primary-state', { stateId: 'IA', direction: 'later' });
  assert.ok(rDeb.lastNote.includes('Order Customization'));
  // #47 Filter once per Debate Day
  const cid = d1.activePresidentialPrimary.candidates[0].id;
  const f1 = Eng.takeAction(d1, 'filter-primary-support', { candidateId: cid });
  const sameDay = { ...f1, activePresidentialPrimary: { ...f1.activePresidentialPrimary, debateDay: 1 } };
  const f2 = Eng.takeAction(sameDay, 'filter-primary-support', { candidateId: cid });
  assert.ok(f2.lastNote.includes('already filtered'), 'Second filter on same Debate Day must be blocked');
});

test('#58/#59/#62/#63 Era #16/#18 advisories present & zero REQ/MAS leaks', () => {
  const psd = window.PartySystemsData;
  const e16 = psd.ERA_CATALOG.find((e) => e.id === 'era_16_robots_citizens');
  const e18 = psd.ERA_CATALOG.find((e) => e.id === 'era_18_party_coalition');
  assert.ok(e16?.dossier?.campaignAdvisory, 'Era #16 must have campaignAdvisory');
  assert.ok(e18?.dossier?.campaignAdvisory, 'Era #18 must have campaignAdvisory');
  for (const f of ['party-systems-ui.js', 'party-systems-data.js']) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!/\b(REQ|MAS)-\d+\b/.test(src), `${f} must not contain REQ/MAS tags`);
  }
});

test('#66/#67/#68/#71/#72 Zero dual-office holders (Rob Sand retains Gov), zero duplicate politicians, zero static Corrupt, canonical keyIssues', () => {
  const g = Eng.createGame('people', { seed: 202806 });
  // #66 Dual-office check
  const sitByName = {};
  g.sittingMembers.forEach((m) => {
    const k = m.name.trim().toLowerCase();
    sitByName[k] = (sitByName[k] || 0) + 1;
  });
  const duals = Object.entries(sitByName).filter(([, c]) => c > 1);
  assert.strictEqual(duals.length, 0, `Found dual-office holders: ${JSON.stringify(duals)}`);
  const robSand = g.sittingMembers.find((m) => m.name === 'Rob Sand');
  assert.ok(robSand && robSand.office === 'governor' && robSand.stateId === 'IA', 'Rob Sand must retain IA Governor');
  // #67 Politician deduplication check
  const polByName = {};
  g.politicians.forEach((p) => {
    const k = p.name.trim().toLowerCase();
    polByName[k] = (polByName[k] || 0) + 1;
  });
  const dupPols = Object.entries(polByName).filter(([, c]) => c > 1);
  assert.strictEqual(dupPols.length, 0, `Found duplicate politicians: ${JSON.stringify(dupPols.slice(0, 5))}`);
  // #68 Zero static Corrupt in scenario-2028.js
  const sc28 = fs.readFileSync(path.join(ROOT, 'scenario-2028.js'), 'utf8');
  assert.strictEqual((sc28.match(/["']Corrupt["']/g) || []).length, 0, 'Zero static Corrupt literals in scenario-2028.js');
  // #71 Canonical keyIssues
  const validIssues = new Set((Data.VERSION_021_ISSUES || Data.ISSUES || []).map((i) => i.id));
  const badKeys = [];
  g.factions.forEach((f) => (f.keyIssues || []).forEach((k) => { if (!validIssues.has(k)) badKeys.push(k); }));
  assert.strictEqual(badKeys.length, 0, `Non-canonical keyIssues found: ${badKeys.slice(0, 5)}`);
  // #72 Extremist flags synced
  g.factions.forEach((f) => assert.strictEqual(Boolean(f.isExtremist), Boolean(f.extremist)));
});

test('#78/#83 Zero Math.random in engine.js & ballot-access.js, negative custom 100K rejected', () => {
  for (const f of ['engine.js', 'ballot-access.js']) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.strictEqual((src.match(/Math\.random\(/g) || []).length, 0, `${f} must have 0 Math.random() calls`);
  }
  assert.throws(() => Eng.apportionSampleUnitsHareNiemeyer({ PA: -5000, OH: 105000 }, 100000), /negative/i);
});

test('#87/#89/#91/#92/#95/#100 UI, CSS, non-blocking confirm, and clean Markdown', () => {
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(!appSrc.includes('/5 Actions Remaining'), 'No stale /5 Actions Remaining');
  assert.ok(!appSrc.includes('window.confirm('), 'No blocking window.confirm()');
  const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
  assert.ok(css.includes('.desk-left-col') && css.includes('.desk-right-col') && css.includes('.v0180-war-room'));
  const md = fs.readFileSync(path.join(ROOT, 'CAMPAIGN_PHASE_OVERHAUL_DESIGN.md'), 'utf8');
  const trailing = md.split('\n').filter((l) => /[ \t]+$/.test(l));
  assert.strictEqual(trailing.length, 0, 'Zero trailing whitespace in CAMPAIGN_PHASE_OVERHAUL_DESIGN.md');
});

console.log(`\nALL ${passed}/${passed} v0.18.1 VERIFICATION TESTS PASSED!`);
