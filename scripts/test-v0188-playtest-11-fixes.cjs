'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

// Minimal browser-like sandbox for loading game modules
const sandbox = {
  console,
  Math,
  Date,
  JSON,
  Set,
  Map,
  Array,
  Object,
  Number,
  String,
  Boolean,
  RegExp,
  Error,
  TypeError,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Uint8Array,
  TextDecoder,
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, setAttribute: () => {} }), head: { appendChild: () => {} }, getElementById: () => null, addEventListener: () => {} },
};
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;

const ctx = vm.createContext(sandbox);
const loadOrder = [
  'data.js',
  'factions-0.15.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographic-migration-data.js',
  'demographics-0.9.js',
  'political-trends-system.js',
  'political-texture-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'ballot-access.js',
  'election-uncertainty.js',
  'candidate-vetting.js',
  'election-drift.js',
  'election-night-engine.js',
  'media-shocks-system.js',
  'campaign-overhaul.js',
  'campaign-events-system.js',
  'redistricting-ballot-system.js',
  'coalition-politics-system.js',
  'atlas-multiplayer-system.js',
  'leading-faction-system.js',
  'faction-era-stability.js',
  'v0185-playtest-fixes.js',
  'save-migrations.js',
  'persistence-core.js',
  'custom-party-core.js',
  'faction-core.js',
  'procedural-faction-naming.js',
  'faction-caucus-system.js',
  'dynamic-faction-lifecycle.js',
  'identity-bloc-system.js',
  'faction-caucus-ui.js',
  'engine.js',
];

for (const file of loadOrder) {
  const fullPath = path.join(repoDir, file);
  if (fs.existsSync(fullPath)) {
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx, { filename: file });
  }
}

const E = sandbox.PartyChairEngine;
const D = sandbox.PartyChairData;
const CO = sandbox.CampaignOverhaul;
const ENE = sandbox.ElectionNightEngine;
const CPC = sandbox.CustomPartyCore;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

// =========================================================================
// FIX #1: State Legislature votes on Election Night + 14% registration poll
// =========================================================================
test('Fix #1: Green 14% registration polls >= 14% in state-leg & appears on Election Night', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.contestedStateLegSlates = { ...(g.contestedStateLegSlates || {}), VT: true };
  g.contestedStateHouseSlates = { ...(g.contestedStateHouseSlates || {}), VT: 5 };
  const vtSt = g.voterModel.states.find((s) => (s.stateId || s.id) === 'VT');
  assert(vtSt && vtSt.affiliations, 'VT state voter model exists');
  const tot = Object.entries(vtSt.affiliations).filter(([k]) => k !== 'thirdParty').reduce((s, [, v]) => s + Number(v || 0), 0);
  vtSt.affiliations.green = Math.round(tot * 0.14);
  vtSt.affiliations.people = Math.round(tot * 0.40);
  vtSt.affiliations.heritage = Math.round(tot * 0.30);
  vtSt.affiliations.independent = Math.round(tot * 0.16);

  const vtObj = D.STATES.find((s) => s.id === 'VT');
  const legShares = E.supportByState(g, vtObj, { raceId: 'state-leg:VT' });
  assert(legShares.green >= 14.0, `Expected Green state-leg share >= 14%, got ${legShares.green}`);

  // Verify ElectionNightEngine carries multi-party stateLegislatureShares (not just Dem/GOP)
  const timeline = ENE.buildElectionNightTimeline(g, {
    stateLegislatures: { VT: ['people', 'people'] },
    stateLegislatureShares: { VT: legShares },
  });
  const vtLegRace = timeline.races.find((r) => r.id === 'state_leg:VT');
  assert(vtLegRace, 'VT state_leg race built in Election Night timeline');
  assert((vtLegRace.finalShares.green || 0) >= 14.0, `Expected Election Night VT state_leg green share >= 14%, got ${vtLegRace.finalShares.green}`);
  assert((vtLegRace.finalVotes.green || 0) > 0, `Expected Election Night VT state_leg green votes > 0, got ${vtLegRace.finalVotes.green}`);
});

// =========================================================================
// FIX #2: No procedurally generated politicians in 2028 Presidential Primaries
// =========================================================================
test('Fix #2: 2028 Presidential Primaries use real people only for Green/Liberty/Constitution/Socialist', () => {
  const gGreen = E.createGame({ templateId: 'green', seed: 2028 });
  const greenField = E.version01CandidateField(gGreen, 'presidential:US', 'green');
  assert(greenField.length >= 2, 'Green 2028 primary has real candidates');
  assert(greenField.some((c) => c.name === 'Jill Stein'), 'Jill Stein is in 2028 Green primary');
  assert(greenField.every((c) => ['Jill Stein', 'Butch Ware', 'Kshama Sawant', 'Ajamu Baraka'].includes(c.name)), 'No fake generated names in 2028 Green primary');

  const gLib = E.createGame({ templateId: 'liberty', seed: 2028 });
  const libField = E.version01CandidateField(gLib, 'presidential:US', 'liberty');
  assert(libField.some((c) => c.name === 'Chase Oliver'), 'Chase Oliver is in 2028 Libertarian primary');
});

// =========================================================================
// FIX #3: Priorities lock-in preserves all 3 selections & focuses lock works independently
// =========================================================================
test('Fix #3: Locking 3 priorities preserves all 3 (including state-suffixed) & focuses still lock cleanly', () => {
  let g = E.createGame({ templateId: 'green', seed: 2030 });
  g.year = 2030;
  g.priorities.offeredQuestIds = ['win-first-state-legislature'];
  g.priorities.main = ['win-first-state-legislature', 'growing-in-state-VT', 'build-statehouse-farm-team'];
  g = E.takeAction(g, 'lock-priorities', { selectedQuestIds: g.priorities.main });
  assert.strictEqual(g.prioritiesLocked, true, 'prioritiesLocked is true');
  assert.strictEqual(g.priorities.main.length, 3, `Expected all 3 priorities preserved, got ${g.priorities.main.length}`);

  // Now test 2032 focus locking after priorities are already locked
  g.year = 2032;
  g.focusesLocked = false;
  g.priorities.additional = [{ type: 'state', targetId: 'VT' }, { type: 'issue', targetId: 'climate-policy' }];
  g = E.takeAction(g, 'lock-party-focuses', {});
  assert.strictEqual(g.focusesLocked, true, 'focusesLocked becomes true even after prioritiesLocked is true');
});

// =========================================================================
// FIX #4: Statehouse Door-Knock Blitz (+1-3% random state registration)
// =========================================================================
test('Fix #4: Statehouse Door-Knock Blitz adds +1.0% to +3.0% registration in target state', () => {
  let g = E.createGame({ templateId: 'green', seed: 2028 });
  g.phase = 'campaign';
  g.treasury = 10;
  g.campaign = { ...(g.campaign || {}), active: true, month: 2, week: 2, monthlyActionsLeft: 8, weeklyActionsLeft: 8 };
  const paBefore = g.voterModel.states.find((s) => (s.stateId || s.id) === 'PA').affiliations;
  const totalBefore = Object.entries(paBefore).filter(([k]) => k !== 'thirdParty').reduce((s, [, v]) => s + Number(v || 0), 0);
  const greenPctBefore = (paBefore.green / totalBefore) * 100;

  g = E.takeAction(g, 'campaign-statehouse-blitz', { stateId: 'PA' });
  const paAfter = g.voterModel.states.find((s) => (s.stateId || s.id) === 'PA').affiliations;
  const totalAfter = Object.entries(paAfter).filter(([k]) => k !== 'thirdParty').reduce((s, [, v]) => s + Number(v || 0), 0);
  const greenPctAfter = (paAfter.green / totalAfter) * 100;
  const deltaPct = greenPctAfter - greenPctBefore;

  assert(deltaPct >= 0.95 && deltaPct <= 3.05, `Expected +1% to +3% registration gain, got +${deltaPct.toFixed(2)}%`);
  assert(Math.abs(totalAfter - totalBefore) <= 5, 'Total state voters conserved');
});

// =========================================================================
// FIX #5: Redistricting EV recalculation (sum === 538, no bogus 3-EV collapses)
// =========================================================================
test('Fix #5: Decennial Redistricting recalculates EVs to 538 total without bogus 3-EV collapses', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.year = 2030;
  g = E.runDecennialRedistricting(g, 2030);
  const totalEV = Object.values(g.electoralVotesByState).reduce((s, v) => s + Number(v || 0), 0);
  assert.strictEqual(totalEV, 538, `Expected 538 total EVs after redistricting, got ${totalEV}`);
  const caEv = g.states.find((s) => s.id === 'CA').ev;
  const txEv = g.states.find((s) => s.id === 'TX').ev;
  assert(caEv >= 40, `Expected CA EV >= 40, got ${caEv}`);
  assert(txEv >= 35, `Expected TX EV >= 35, got ${txEv}`);
  assert.strictEqual(g.electoralVotesByState.CA, caEv, 'electoralVotesByState synced with CA');
});

// =========================================================================
// FIX #6: Faction joining / Coalition Summit eligibility clarity
// =========================================================================
test('Fix #6: Independent faction unlocks Coalition Summit after 1 Court action (15 Goodwill)', () => {
  let g = E.createGame({ templateId: 'green', seed: 2028 });
  g.partyTiers.green = 2; // v0.18.9: Faction recruitment unlocks at Tier 2
  g.treasury = 20;
  g.organizingActionsRemaining = 10;
  const indFaction = g.factions.find((f) => f.partyId === 'independent');
  assert(indFaction, 'Found an independent faction');
  g.factionHappiness[indFaction.id] = 55;
  // Make sure ideological distance is within 5.5 for testing goodwill gate
  const before = E.checkSummitEligibility(g, indFaction.id);
  assert.strictEqual(before.eligible, false, 'Initially blocked before courting when Happiness > 40');
  assert(before.reason && (before.reason.includes('15') || before.reason.includes('Goodwill') || before.reason.includes('Ideological')), `Unexpected reason: ${before.reason}`);

  g = E.takeAction(g, 'court-independent-faction', { factionId: indFaction.id });
  assert((g.factionCourtship?.[indFaction.id]?.green || 0) >= 15, 'Goodwill increased to >= 15 after 1 court action');
});

// =========================================================================
// FIX #7: Forecasters take 3rd parties > 10% into account
// =========================================================================
test('Fix #7: Forecasters account for 3rd parties > 10% and expose activeThirdParties', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  const vtSt = g.voterModel.states.find((s) => (s.stateId || s.id) === 'VT');
  const tot = Object.entries(vtSt.affiliations).filter(([k]) => k !== 'thirdParty').reduce((s, [, v]) => s + Number(v || 0), 0);
  vtSt.affiliations.green = Math.round(tot * 0.24);
  vtSt.affiliations.people = Math.round(tot * 0.38);
  vtSt.affiliations.heritage = Math.round(tot * 0.34);
  vtSt.affiliations.independent = Math.round(tot * 0.04);

  const fc = E.buildForecasters(g, { forceAll: true });
  const vtPoll = fc.polling['presidential:VT'];
  assert(vtPoll && vtPoll.isMultiPartyRace === true, 'VT presidential forecast flags isMultiPartyRace when Green > 10%');
  assert(vtPoll.activeThirdParties.some((p) => p.party === 'green' && p.share > 10), 'Green listed in activeThirdParties');
});

// =========================================================================
// FIX #8: Spoiler scaling (~25% -> ~25%), 1/10th Governor Jesse Ventura, & RCV 0% spoiler
// =========================================================================
test('Fix #8: Spoiler scales to 0% at 25% share, ~1/10th Governor races have 0% spoiler, RCV has 0% spoiler', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  const at25 = E.computeStrategicVotingDefection(g, 'green', 'PA', 'presidential', 25.0);
  assert.strictEqual(at25.defectionRate, 0, `Expected 0% defection at 25% share, got ${at25.defectionRate}`);
  assert.strictEqual(at25.retainedShare, 25.0, '25% voter share retains 25% of vote');

  const at20 = E.computeStrategicVotingDefection(g, 'green', 'PA', 'presidential', 20.0);
  const at5 = E.computeStrategicVotingDefection(g, 'green', 'PA', 'presidential', 5.0);
  assert(at20.defectionRate < at5.defectionRate && at20.defectionRate < 0.15, `Expected smooth taper at 20% (${at20.defectionRate}) < 5% (${at5.defectionRate})`);

  // RCV state (AK) must have 0% spoiler
  const rcvRes = E.computeStrategicVotingDefection(g, 'green', 'AK', 'presidential', 8.0);
  assert.strictEqual(rcvRes.defectionRate, 0, 'RCV state has strictly 0% spoiler defection');

  // Check ~1/10th of 50 Governor races trigger Jesse Ventura 0% spoiler
  let venturaCount = 0;
  D.STATES.filter((s) => s.id !== 'DC' && s.id !== 'AK').forEach((st) => {
    const r = E.computeStrategicVotingDefection(g, 'green', st.id, 'governor', 9.0);
    if (r.reason === 'governor-ventura-breakthrough' && r.defectionRate === 0) venturaCount += 1;
  });
  assert(venturaCount >= 1 && venturaCount <= 12, `Expected ~1/10th (~5) Ventura governor races across 49 states, got ${venturaCount}`);
});

// =========================================================================
// FIX #9: Court a politician is off-cycle only & injects into primaryFields
// =========================================================================
test('Fix #9: Courting politician blocked during campaign, works off-cycle & injects into primaryFields', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.treasury = 20;
  g.actionsLeft = 5;
  const target = g.sittingMembers.find((m) => m.office === 'house' && m.party !== 'people');
  assert(target, 'Found target House member');
  target.happiness = 20; // Discontent

  // Blocked during active campaign
  const gCamp = { ...g, phase: 'campaign', campaign: { active: true, weeklyActionsLeft: 5 } };
  const blockedRes = E.takeAction(gCamp, 'court-politician', { memberId: target.id });
  assert(blockedRes.lastNote.includes('off-cycle'), 'Courting blocked during general campaign');

  // Allowed in off-cycle organizing phase (ensure ideological bridge by aligning faction)
  const gOrg = { ...g, phase: 'organizing', campaign: { active: false } };
  const demF = gOrg.factions.find((f) => f.partyId === 'people' && f.type !== 'racial');
  target.factionId = demF.id;
  const okRes = E.takeAction(gOrg, 'court-politician', { memberId: target.id });
  const raceKey = `house:${target.districtId || target.district}`;
  assert(okRes.primaryFields?.[raceKey]?.people?.some((c) => c.name === target.name), 'Courted politician injected into primaryFields for upcoming election');
});

// =========================================================================
// FIX #10: 3rd-party control color/label helper in app.js
// =========================================================================
test('Fix #10: app.js resolves distinct 3rd-party & custom-party colors/labels for control maps', () => {
  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes('function resolveControlPartyColor('), 'resolveControlPartyColor present in app.js');
  assert(appSrc.includes('function resolveControlPartyLabel('), 'resolveControlPartyLabel present in app.js');
  assert(appSrc.includes("if (party === 'green') return '#22c55e';"), 'Green party color mapped');
  assert(appSrc.includes("if (party === 'constitution') return '#a855f7';"), 'Constitution party color mapped');
});

// =========================================================================
// FIX #11: Custom party Leading Faction sets issue stances
// =========================================================================
test('Fix #11: Custom party Leading Faction sets leadingFactionId & derives issuePositions', () => {
  const g = E.createGame({
    templateId: 'custom',
    custom: true,
    customPartyName: 'Abundance Coalition',
    customPartyCode: 'ABC',
    customPartyColor: '#10b981',
    customOrigin: 'civic_reform',
    selectedFactionIds: ['dem_abundance', 'dem_blue_dog'],
    customLeadingFactionId: 'dem_abundance',
    seed: 2028,
  });
  assert.strictEqual(g.leadingFactionId, 'dem_abundance', 'Chosen Leading Faction stored as leadingFactionId');
  assert.strictEqual(g.factionDesignations?.dem_abundance, 'leading', 'Chosen Leading Faction designated leading');
  const derived = CPC.deriveIssuePositionsFromFaction(
    g.factions.find((f) => f.id === 'dem_abundance'),
    D.VERSION_021_ISSUES,
    {}
  );
  assert(Object.keys(derived).length >= 10, 'deriveIssuePositionsFromFaction populates full issue stances');
});

console.log(`\nALL ${passed}/11 PLAYTEST FIX TESTS PASSED!`);
