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
  'election-drift.js', 'presidential-primaries.js', 'election-night-engine.js', 'campaign-overhaul.js', 'engine.js',
]) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const Data = window.PartyChairData;
const PP = window.PresidentialPrimaries;
const CO = window.CampaignOverhaul;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

console.log('=== NATIONAL FACTION DEFECTION & TWO-STEP SECESSION OVERHAUL (REC-01 to REC-12) ===');

// REC-01 & REC-07: Two-sided friction across rival parties + rebalanced thresholds (<45:+15, <35:+30, dist>3.2, ultimatum>=75, floor>=60)
test('REC-01 & REC-07: Two-sided rival faction friction, rebalanced curve, ultimatum at 75, remediation floor 60, and bolt to none', () => {
  let g = Eng.createGame('people', { seed: 880101 });
  // Pick a non-anchor Republican faction
  const rivalFac = g.factions.find((f) => f.partyId === 'heritage' && f.id !== 'gop_maga' && !f.isIroncladAnchor);
  assert.ok(rivalFac, 'Need a non-anchor Republican faction');
  g.factionHappiness[rivalFac.id] = 30; // <35 -> +30 friction
  rivalFac.frictionIndex = 50;
  // Drain rival treasury so AI chair refuses appeasement and faction bolts
  if (g.organizations?.heritage) g.organizations.heritage.treasury = 0;

  // Turn 1: friction 50 + 30 (+15 if dist>3.2) >= 75 -> issues 2-turn ultimatum
  g = Eng.evaluateFactionFriction(g);
  const f1 = g.factions.find((f) => f.id === rivalFac.id);
  assert.ok(f1.frictionIndex >= 75, `Expected rival friction >= 75, got ${f1.frictionIndex}`);
  assert.strictEqual(f1.ultimatumTurnsRemaining, 2, 'Expected 2-turn ultimatum triggered at friction >= 75');

  // Raising happiness to 55 (<60) must NOT avert ultimatum (remediation floor raised to 60)
  g.factionHappiness[rivalFac.id] = 55;
  g = Eng.evaluateFactionFriction(g);
  const f2 = g.factions.find((f) => f.id === rivalFac.id);
  assert.strictEqual(f2.ultimatumTurnsRemaining, 1, 'Happiness 55 must NOT avert ultimatum (requires >= 60)');

  // Next turn at Happiness 30 expires ultimatum -> bolts to Independent ('none') and moves voters to independent
  g.factionHappiness[rivalFac.id] = 30;
  const indBefore = g.voterModel.affiliations.independent.sampleVoters;
  g = Eng.evaluateFactionFriction(g);
  const f3 = g.factions.find((f) => f.id === rivalFac.id);
  assert.strictEqual(f3.partyId, 'none', `Expected rival faction to bolt to partyId='none', got ${f3.partyId}`);
  assert.strictEqual(f3.activelyCourting, true, 'Bolted faction must be marked activelyCourting');
  assert.ok(g.voterModel.affiliations.independent.sampleVoters >= indBefore, 'Bolted voters must move to independent pool');
});

// REC-02 & REC-10: Strict Two-Step Secession Pipeline (no direct party-to-party Summit Accord)
test('REC-02 & REC-10: Prohibit direct party-to-party Summit Accords; allow Courtship (<50) -> Bolt -> Summit', () => {
  let g = Eng.createGame('people', { seed: 880102 });
  const rivalFac = g.factions.find((f) => f.id === 'gop_suburban_moderates') || g.factions.find((f) => f.partyId === 'heritage' && f.id !== 'gop_maga');
  g.factionHappiness[rivalFac.id] = 20;

  // Direct Summit MUST be blocked while faction is still in 'heritage'
  const directCheck = Eng.checkSummitEligibility(g, rivalFac.id);
  assert.strictEqual(directCheck.eligible, false, 'Direct party-to-party Summit must be prohibited');
  assert.ok(/secede|Independent/i.test(directCheck.reason), `Unexpected block reason: ${directCheck.reason}`);
  assert.strictEqual(directCheck.canCourt, true, 'canCourt should be true when parent happiness < 50');

  // Stage 1: Open Courtship Dialogue works at Happiness < 50
  g = Eng.takeAction(g, 'open-courtship-dialogue', { factionId: rivalFac.id });
  assert.ok((g.factionCourtship?.[rivalFac.id]?.people || 0) >= 12, 'Courtship dialogue must add goodwill');

  // Stage 2: Bolt to Independent ('none')
  g = Eng.boltFaction(g, rivalFac.id);
  assert.strictEqual(g.factions.find((f) => f.id === rivalFac.id).partyId, 'none');

  // Stage 3: Now Independent -> Coalition Summit eligible!
  const indepCheck = Eng.checkSummitEligibility(g, rivalFac.id);
  assert.strictEqual(indepCheck.eligible, true, `Expected Independent bolted faction to be Summit-eligible: ${indepCheck.reason}`);
});

// REC-03 & REC-06: Organizing subversion actions (drive-coalition-wedge, subsidize-dissident-caucus, court-independent-faction) + expel-faction
test('REC-03 & REC-06: drive-coalition-wedge, subsidize-dissident-caucus, court-independent-faction, and expel-faction', () => {
  let g = Eng.createGame('people', { seed: 880103 });
  g.treasury = 100;
  g.organizingActionsRemaining = 10;
  const rivalFac = g.factions.find((f) => f.id === 'gop_suburban_moderates') || g.factions.find((f) => f.partyId === 'heritage' && f.id !== 'gop_maga');
  g.factionHappiness[rivalFac.id] = 52;
  rivalFac.frictionIndex = 40;

  // drive-coalition-wedge (-$2M, -10H, +20 friction)
  g = Eng.takeAction(g, 'drive-coalition-wedge', { factionId: rivalFac.id });
  assert.strictEqual(g.treasury, 98);
  assert.strictEqual(g.factionHappiness[rivalFac.id], 42);
  assert.strictEqual(g.factions.find((f) => f.id === rivalFac.id).frictionIndex, 60);

  // subsidize-dissident-caucus (-$3M, -1 ultimatum turn -> immediate bolt when 1 -> 0)
  g.factions.find((f) => f.id === rivalFac.id).ultimatumTurnsRemaining = 1;
  g = Eng.takeAction(g, 'subsidize-dissident-caucus', { factionId: rivalFac.id });
  assert.strictEqual(g.treasury, 95);
  assert.strictEqual(g.factions.find((f) => f.id === rivalFac.id).partyId, 'none', 'Subsidizing last ultimatum turn should bolt faction');

  // court-independent-faction (-$1.5M, +15 goodwill)
  g = Eng.takeAction(g, 'court-independent-faction', { factionId: rivalFac.id });
  assert.strictEqual(g.treasury, 93.5);
  assert.ok((g.factionCourtship?.[rivalFac.id]?.people || 0) >= 15);

  // REC-06: expel-faction removes own non-anchor faction to 'none' & clears cohabitationTurnoutDrag
  const ownFac = g.factions.find((f) => f.partyId === 'people' && f.id !== 'dem_liberal_establishment' && !f.isIroncladAnchor);
  g.cohabitationTurnoutDrag = 3.0;
  g = Eng.takeAction(g, 'expel-faction', { factionId: ownFac.id });
  assert.strictEqual(g.factions.find((f) => f.id === ownFac.id).partyId, 'none', 'Expelled faction must move to Independent (none)');
  assert.strictEqual(g.cohabitationTurnoutDrag, 0, 'Expelling faction must clear cohabitationTurnoutDrag');
});

// REC-04: Primary Defeat & Convention Platform Revolt
test('REC-04: Convention platform rejection + defeated candidate triggers -25 Happiness shock & walkout bolt', () => {
  let g = Eng.createGame('people', { seed: 880104 });
  const targetFac = g.factions.find((f) => f.partyId === 'people' && f.id !== 'dem_liberal_establishment' && !f.isIroncladAnchor);
  g.factionHappiness[targetFac.id] = 45;
  g.factionStandings[targetFac.id] = 45;
  targetFac.happiness = 45;
  g.presidentialPrimaries = {
    nominees: { people: { factionId: 'dem_liberal_establishment' } },
    conventionData: {
      nominee: { factionId: 'dem_liberal_establishment' },
      amendmentsVoted: 0,
      platformAmendments: [{
        id: 'test-amend-1',
        issueId: 'taxes-spending',
        resolved: false,
        sideA: { name: 'Establishment Plank', factionName: 'Liberal Establishment', delta: 0.2 },
        sideB: { name: 'Dissident Plank', factionName: targetFac.name, delta: -0.5 },
      }],
    },
  };
  g = PP.resolvePlatformFloorVote(g, 'test-amend-1', 'A');
  const afterFac = g.factions.find((f) => f.id === targetFac.id);
  assert.ok(g.factionHappiness[targetFac.id] <= 25, `Expected -25 Happiness shock, got ${g.factionHappiness[targetFac.id]}`);
  assert.strictEqual(afterFac.partyId, 'none', 'Defeated + plank-rejected faction dropping <30 Happiness must walk out to Independent');
});

// REC-05: Faction redLineIssues exist in FACTIONS_CATALOG
test('REC-05: All factions in FACTIONS_CATALOG have redLineIssues assigned', () => {
  const cat = Data.FACTIONS_CATALOG || [];
  assert.ok(cat.length >= 30);
  const missing = cat.filter((f) => !Array.isArray(f.redLineIssues) || f.redLineIssues.length === 0);
  assert.strictEqual(missing.length, 0, `${missing.length} factions missing redLineIssues`);
});

// REC-09: Campaign Resource Starvation (+25 Neglect Friction)
test('REC-09: CampaignOverhaul.evaluateFactionResourceStarvation flags unfunded competitive factions', () => {
  const g = Eng.createGame('people', { seed: 880105 });
  const fac = g.factions.find((f) => f.partyId === 'people');
  g.candidateFunding = {
    'senate:PA': { factionId: fac.id, partyId: 'people', margin: 3.0, spent: 0 },
  };
  g.campaign = { ...(g.campaign || {}), factionFundingSpent: {} };
  const starved = CO.evaluateFactionResourceStarvation(g);
  assert.ok(starved.includes(fac.id), 'Unfunded faction in competitive race must be flagged as starved');
});

// REC-11: 6 new faction crisis events in EVENTS
test('REC-11: All 6 new faction defection catalyst events exist in EVENTS', () => {
  const eventIds = new Set((Data.EVENTS || []).map((e) => e.id));
  for (const id of [
    'event_union_strike_bolt',
    'event_suburban_moderates_revolt',
    'event_evangelical_boycott',
    'event_green_left_walkout',
    'event_libertarian_secession',
    'event_civil_rights_ultimatum',
  ]) {
    assert.ok(eventIds.has(id), `Missing REC-11 event: ${id}`);
  }
});

// REC-10 & REC-12: Verify app.js UI strings for Courtship Dialogue, Coalition Summit, and Actively Courting Coalitions
test('REC-10 & REC-12: app.js contains exact Two-Step UI buttons, disabled tooltip, and Actively Courting badge', () => {
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(appSrc.includes('Open Courtship Dialogue (1 Action)'), 'Missing Open Courtship Dialogue button');
  assert.ok(appSrc.includes('Convene Coalition Summit (1 Action)'), 'Missing Convene Coalition Summit button');
  assert.ok(appSrc.includes('Loyal to parent party (Happiness >= 50)'), 'Missing disabled loyalty tooltip');
  assert.ok(appSrc.includes('Actively Courting Coalitions'), 'Missing REC-12 Actively Courting badge');
  assert.ok(appSrc.includes('drive-coalition-wedge'), 'Missing REC-03 drive-coalition-wedge button');
  assert.ok(appSrc.includes('subsidize-dissident-caucus'), 'Missing REC-03 subsidize-dissident-caucus button');
  assert.ok(appSrc.includes('court-independent-faction'), 'Missing REC-03 court-independent-faction button');
  assert.ok(appSrc.includes('expel-faction'), 'Missing REC-06 expel-faction button');
});

console.log(`\nALL ${passed}/${passed} FACTION DEFECTION OVERHAUL TESTS PASSED!`);
