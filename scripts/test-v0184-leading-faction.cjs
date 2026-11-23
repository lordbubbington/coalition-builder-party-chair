const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
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
  'leading-faction-system.js',
  'engine.js',
].forEach((f) => require(path.join(ROOT, f)));

const Eng = window.PartyChairEngine;
const LFS = window.LeadingFactionSystem;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

function makeMembers(party, factionId, { govs = 0, sens = 0, house = 0, prefix = 'm', extra = {} }) {
  const list = [];
  for (let i = 0; i < govs; i++) {
    list.push({ id: `${prefix}-gov-${i}`, name: `${prefix} Gov ${i}`, party, partyId: party, office: 'governor', factionId, age: 50, fame: 50, ...extra });
  }
  for (let i = 0; i < sens; i++) {
    list.push({ id: `${prefix}-sen-${i}`, name: `${prefix} Sen ${i}`, party, partyId: party, office: 'senate', factionId, age: 50, fame: 50, ...extra });
  }
  for (let i = 0; i < house; i++) {
    list.push({ id: `${prefix}-rep-${i}`, name: `${prefix} Rep ${i}`, party, partyId: party, office: 'house', factionId, age: 50, fame: 50, ...extra });
  }
  return list;
}

console.log('=== v0.18.4 DYNAMIC LEADING FACTION SUCCESSION RULES VERIFICATION ===');

// Test 1: Presidential Override (All Parties)
test('Test 1: Presidential Override automatically elevates newly elected President faction on next-cycle rollover', () => {
  let g = Eng.createGame('people', { seed: 18401 });
  const oldLeaderId = 'dem_liberal_establishment';
  const presFactionId = g.factions.find((f) => f.partyId === 'people' && f.id !== oldLeaderId).id;

  // Set prior leading faction to oldLeaderId, but newly elected President belongs to presFactionId
  g.leadingFactionByParty = { people: oldLeaderId, heritage: 'gop_maga' };
  g.governingParty = 'people';
  g.currentPresident = {
    name: 'Incoming Progressive President',
    partyId: 'people',
    factionId: presFactionId,
    electedYear: 2028,
    terms: 1,
  };
  g.phase = 'complete';

  // Even if oldLeaderId holds huge legislative majority, Presidential Override MUST win
  g.sittingMembers = [
    ...makeMembers('people', oldLeaderId, { govs: 10, sens: 20, house: 100, prefix: 'old' }),
    ...makeMembers('people', presFactionId, { govs: 0, sens: 0, house: 1, prefix: 'pres' }),
  ];

  const next = Eng.startNextCycle(g);
  assert.strictEqual(next.leadingFactionByParty.people, presFactionId, 'Newly elected President faction must become leadingFactionByParty.people');
  assert.strictEqual(next.factionDesignations[presFactionId], 'leading', 'President faction designation must be leading');
  const presFacObj = next.factions.find((f) => f.id === presFactionId);
  const oldFacObj = next.factions.find((f) => f.id === oldLeaderId);
  assert.strictEqual(presFacObj.status, 'leading');
  assert.strictEqual(presFacObj.isLeading, true);
  assert.strictEqual(oldFacObj.status, 'major', 'Prior leading faction must be downgraded to major');
  assert.strictEqual(oldFacObj.isLeading, false);
  assert.strictEqual(next.pendingLeadingFactionChallenge, null, 'Presidential Override must NOT trigger player refusal modal');

  // evaluateFactionTiers must respect leadingFactionByParty
  const reEvaluated = Eng.evaluateFactionTiers(next);
  assert.strictEqual(reEvaluated[presFactionId], 'leading', 'evaluateFactionTiers must preserve leadingFactionByParty');
});

// Test 2: Exact weighted legislator math (16 vs 25 >= 24 qualifies; 23 < 24 does NOT qualify)
test('Test 2: Exact weighted legislator math (1 Gov + 0 Sen + 11 House = 16 vs 3 Gov + 2 Sen + 4 House = 25 qualifies; 23 does NOT)', () => {
  const gBase = Eng.createGame('people', { seed: 18402 });
  const peopleFactions = gBase.factions.filter((f) => f.partyId === 'people');
  const leaderId = 'dem_liberal_establishment';
  const challengerId = peopleFactions.find((f) => f.id !== leaderId).id;

  // Out of power: heritage holds Presidency
  gBase.governingParty = 'heritage';
  gBase.currentPresident = { name: 'J. D. Vance', partyId: 'heritage', factionId: 'gop_maga', electedYear: 2028 };
  gBase.leadingFactionByParty = { people: leaderId, heritage: 'gop_maga' };

  // Case A: 1 Gov (5) + 0 Sen (0) + 11 House (11) = 16 vs 3 Gov (15) + 2 Sen (6) + 4 House (4) = 25 (>= 16 * 1.5 = 24) -> QUALIFIES
  const gQual = {
    ...gBase,
    sittingMembers: [
      ...makeMembers('people', leaderId, { govs: 1, sens: 0, house: 11, prefix: 'cur' }),
      ...makeMembers('people', challengerId, { govs: 3, sens: 2, house: 4, prefix: 'chal' }),
    ],
  };
  const scoresQual = LFS.computeWeightedLegislatorScores(gQual, 'people', peopleFactions);
  assert.strictEqual(scoresQual[leaderId].score, 16, 'Expected current leader score 16');
  assert.strictEqual(scoresQual[challengerId].score, 25, 'Expected challenger score 25');

  const resQual = LFS.evaluateLeadingFactionSuccession(gQual);
  assert.ok(resQual.pendingLeadingFactionChallenge, 'Challenger with 25 >= 24 must trigger challenge for player party');
  assert.strictEqual(resQual.pendingLeadingFactionChallenge.currentScore, 16);
  assert.strictEqual(resQual.pendingLeadingFactionChallenge.challengerScore, 25);
  assert.deepStrictEqual(resQual.pendingLeadingFactionChallenge.currentBreakdown, { governors: 1, senators: 0, house: 11 });
  assert.deepStrictEqual(resQual.pendingLeadingFactionChallenge.challengerBreakdown, { governors: 3, senators: 2, house: 4 });

  // Case B: 23 pts (3 Gov = 15, 2 Sen = 6, 2 House = 2 -> 23 < 24) -> DOES NOT QUALIFY
  const gNoQual = {
    ...gBase,
    sittingMembers: [
      ...makeMembers('people', leaderId, { govs: 1, sens: 0, house: 11, prefix: 'cur' }),
      ...makeMembers('people', challengerId, { govs: 3, sens: 2, house: 2, prefix: 'chal23' }),
    ],
  };
  const scoresNoQual = LFS.computeWeightedLegislatorScores(gNoQual, 'people', peopleFactions);
  assert.strictEqual(scoresNoQual[challengerId].score, 23, 'Expected challenger score 23');
  const resNoQual = LFS.evaluateLeadingFactionSuccession(gNoQual);
  assert.strictEqual(resNoQual.pendingLeadingFactionChallenge, null, 'Challenger with 23 < 24 must NOT qualify');
  assert.strictEqual(resNoQual.leadingFactionByParty.people, leaderId, 'Current leader must remain leading');
});

// Test 3: Incoming vs. Outgoing Legislators
test('Test 3: Only incoming sittingMembers are counted — outgoing/defeated/retired incumbents are excluded', () => {
  const g = Eng.createGame('people', { seed: 18403 });
  const peopleFactions = g.factions.filter((f) => f.partyId === 'people');
  const leaderId = 'dem_liberal_establishment';
  const challengerId = peopleFactions.find((f) => f.id !== leaderId).id;

  g.governingParty = 'heritage';
  g.currentPresident = { name: 'J. D. Vance', partyId: 'heritage', factionId: 'gop_maga', electedYear: 2028 };
  g.leadingFactionByParty = { people: leaderId, heritage: 'gop_maga' };

  // Current leader has 20 outgoing/defeated governors, but only 1 incoming governor (5 pts).
  // Challenger has 2 incoming governors (10 pts >= 7.5).
  g.sittingMembers = [
    ...makeMembers('people', leaderId, { govs: 20, sens: 0, house: 0, prefix: 'out-defeated', extra: { defeated: true } }),
    ...makeMembers('people', leaderId, { govs: 5, sens: 0, house: 0, prefix: 'out-outgoing', extra: { outgoing: true } }),
    ...makeMembers('people', leaderId, { govs: 5, sens: 0, house: 0, prefix: 'out-retired', extra: { retired: true } }),
    ...makeMembers('people', leaderId, { govs: 1, sens: 0, house: 0, prefix: 'in-cur' }),
    ...makeMembers('people', challengerId, { govs: 2, sens: 0, house: 0, prefix: 'in-chal' }),
  ];

  const scores = LFS.computeWeightedLegislatorScores(g, 'people', peopleFactions);
  assert.strictEqual(scores[leaderId].score, 5, 'Outgoing/defeated/retired incumbents must NOT be counted');
  assert.strictEqual(scores[challengerId].score, 10, 'Incoming challenger members must be counted');

  const evaluated = LFS.evaluateLeadingFactionSuccession(g);
  assert.ok(evaluated.pendingLeadingFactionChallenge, 'Incoming challenger (10 >= 7.5) must trigger challenge');
  assert.strictEqual(evaluated.pendingLeadingFactionChallenge.currentScore, 5);
  assert.strictEqual(evaluated.pendingLeadingFactionChallenge.challengerScore, 10);
});

// Test 4: Player Accept vs. Refuse
test('Test 4: Player Accept transfers leadership (+5 Happiness); Player Refuse retains leader (-20 Happiness to challenger)', () => {
  const gBase = Eng.createGame('people', { seed: 18404 });
  const peopleFactions = gBase.factions.filter((f) => f.partyId === 'people');
  const leaderId = 'dem_liberal_establishment';
  const challengerObj = peopleFactions.find((f) => f.id !== leaderId);
  const challengerId = challengerObj.id;

  gBase.governingParty = 'heritage';
  gBase.currentPresident = { name: 'J. D. Vance', partyId: 'heritage', factionId: 'gop_maga', electedYear: 2028 };
  gBase.leadingFactionByParty = { people: leaderId, heritage: 'gop_maga' };
  gBase.factionHappiness[challengerId] = 60;
  gBase.factionStandings[challengerId] = 60;
  challengerObj.happiness = 60;

  gBase.sittingMembers = [
    ...makeMembers('people', leaderId, { govs: 1, sens: 0, house: 11, prefix: 'cur' }),
    ...makeMembers('people', challengerId, { govs: 3, sens: 2, house: 4, prefix: 'chal' }),
  ];

  const challenged = LFS.evaluateLeadingFactionSuccession(gBase);
  assert.ok(challenged.pendingLeadingFactionChallenge, 'Challenge must be pending');
  assert.strictEqual(challenged.leadingFactionByParty.people, leaderId, 'Must NOT swap silently before player decides');

  // Branch A: Accept
  const accepted = Eng.takeAction(challenged, 'resolve-leading-faction-challenge', { decision: 'accept' });
  assert.strictEqual(accepted.pendingLeadingFactionChallenge, null, 'Pending challenge must clear after accept');
  assert.strictEqual(accepted.leadingFactionByParty.people, challengerId, 'Challenger must become new leading faction');
  assert.strictEqual(accepted.factionDesignations[challengerId], 'leading');
  assert.strictEqual(accepted.factionDesignations[leaderId], 'major', 'Old leader must be downgraded to major');
  assert.strictEqual(accepted.factions.find((f) => f.id === challengerId).status, 'leading');
  assert.strictEqual(accepted.factions.find((f) => f.id === challengerId).isLeading, true);
  assert.strictEqual(accepted.factions.find((f) => f.id === leaderId).status, 'major');
  assert.strictEqual(accepted.factions.find((f) => f.id === leaderId).isLeading, false);
  assert.strictEqual(accepted.factionHappiness[challengerId], 65, 'Challenger must gain +5 Happiness on accept');
  assert.strictEqual(accepted.factionStandings[challengerId], 65);
  assert.strictEqual(accepted.factions.find((f) => f.id === challengerId).happiness, 65);
  assert.ok(accepted.yearLog.some((e) => /Leadership Transition Accepted/i.test(e.action)), 'Accept must be logged in yearLog');

  // Branch B: Refuse
  const refused = Eng.takeAction(challenged, 'resolve-leading-faction-challenge', { decision: 'refuse' });
  assert.strictEqual(refused.pendingLeadingFactionChallenge, null, 'Pending challenge must clear after refuse');
  assert.strictEqual(refused.leadingFactionByParty.people, leaderId, 'Current leader must retain leadership on refuse');
  assert.strictEqual(refused.factionDesignations[leaderId], 'leading');
  assert.strictEqual(refused.factionHappiness[challengerId], 40, 'Challenger must suffer exact -20 Happiness (60 -> 40) in factionHappiness');
  assert.strictEqual(refused.factionStandings[challengerId], 40, 'Challenger must suffer exact -20 Happiness (60 -> 40) in factionStandings');
  assert.strictEqual(refused.factions.find((f) => f.id === challengerId).happiness, 40, 'Challenger must suffer exact -20 Happiness (60 -> 40) in f.happiness');
  assert.ok(refused.yearLog.some((e) => /Leadership Takeover Refused/i.test(e.action)), 'Refuse must be logged in yearLog');
});

// Test 5: AI rival party auto-transition without blocking modal
test('Test 5: AI rival party auto-transitions leadership without setting pendingLeadingFactionChallenge', () => {
  const g = Eng.createGame('people', { seed: 18405 });
  const gopFactions = g.factions.filter((f) => f.partyId === 'heritage');
  const gopLeaderId = 'gop_maga';
  const gopChallengerId = gopFactions.find((f) => f.id !== gopLeaderId).id;

  // Player ('people') holds the Presidency -> AI rival ('heritage') is out of power
  g.governingParty = 'people';
  g.currentPresident = { name: 'Jon Ossoff', partyId: 'people', factionId: 'dem_liberal_establishment', electedYear: 2028 };
  g.leadingFactionByParty = { people: 'dem_liberal_establishment', heritage: gopLeaderId };

  g.sittingMembers = [
    ...makeMembers('heritage', gopLeaderId, { govs: 1, sens: 0, house: 11, prefix: 'gop-cur' }),   // 16 pts
    ...makeMembers('heritage', gopChallengerId, { govs: 3, sens: 2, house: 4, prefix: 'gop-chal' }), // 25 pts >= 24
  ];

  const evaluated = LFS.evaluateLeadingFactionSuccession(g);
  assert.strictEqual(evaluated.pendingLeadingFactionChallenge, null, 'AI party transition must NOT open player modal');
  assert.strictEqual(evaluated.leadingFactionByParty.heritage, gopChallengerId, 'AI rival party must auto-transition to qualifying challenger');
  assert.strictEqual(evaluated.factionDesignations[gopChallengerId], 'leading');
  assert.strictEqual(evaluated.factionDesignations[gopLeaderId], 'major');
  assert.ok(evaluated.yearLog.some((e) => /Leadership Transition:/i.test(e.action)), 'AI transition must be logged in yearLog');
});

// Test 6: Legacy save compatibility in normalizeGame()
test('Test 6: normalizeGame() safely defaults leadingFactionByParty and pendingLeadingFactionChallenge for legacy saves', () => {
  const g = Eng.createGame('people', { seed: 18406 });
  delete g.leadingFactionByParty;
  delete g.pendingLeadingFactionChallenge;
  const normalized = Eng.normalizeGame(g);
  assert.deepStrictEqual(normalized.leadingFactionByParty, {});
  assert.strictEqual(normalized.pendingLeadingFactionChallenge, null);
});

console.log(`\nALL ${passed} TESTS PASSED!`);
