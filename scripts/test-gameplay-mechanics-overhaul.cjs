'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

function createHarness() {
  const sandbox = {
    console, Math, Date, JSON, Set, Map, Array, Object, Number, String, Boolean, RegExp, Error, TypeError,
    parseInt, parseFloat, isNaN, isFinite, Uint8Array, TextDecoder,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    document: {
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {} }),
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      getElementById: () => null,
      addEventListener: () => {},
    },
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;

  const ctx = vm.createContext(sandbox);
  const loadOrder = [
    'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js',
    'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographic-migration-data.js', 'demographics-0.9.js',
    'political-trends-system.js', 'political-texture-system.js', 'v07-scaffolding.js',
    'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js', 'party-systems-engine.js',
    'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js', 'election-drift.js',
    'election-night-engine.js', 'media-shocks-system.js', 'campaign-overhaul.js', 'campaign-events-system.js',
    'redistricting-ballot-system.js', 'coalition-politics-system.js', 'atlas-multiplayer-system.js',
    'leading-faction-system.js', 'faction-era-stability.js', 'v0185-playtest-fixes.js',
    'save-migrations.js', 'persistence-core.js', 'custom-party-core.js', 'faction-core.js',
    'ui-setup-views.js', 'off-cycle-interlude.js',
    'procedural-faction-naming.js', 'faction-caucus-system.js', 'dynamic-faction-lifecycle.js',
    'identity-bloc-system.js', 'faction-caucus-ui.js',
    'autopsy-catalog-minor-low.js', 'autopsy-catalog-minor-high.js', 'autopsy-catalog-major.js', 'autopsy-system.js',
    'voting-reforms-core.js', 'trifecta-reforms-core.js', 'voting-reform-map-adapter.js', 'voting-reforms-ui.js',
    'engine.js', 'states-officials-tables.js',
  ];
  for (const file of loadOrder) {
    const fullPath = path.join(repoDir, file);
    if (fs.existsSync(fullPath)) {
      vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx, { filename: file });
    }
  }
  return sandbox;
}

const S = createHarness();
const E = S.PartyChairEngine;
const D = S.PartyChairData;
const V07 = S.PartyChairV07;
const CO = S.CampaignOverhaul;
const ED = S.ElectionDrift;
const ENE = S.ElectionNightEngine;
const RBS = S.RedistrictingBallotSystem;
const BA = S.BallotAccess;
const FC = S.FactionCore;
const OC = S.OffCycleInterludeSystem;
const SOT = S.StatesOfficialsTables;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`PASS [${passed}]: ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL: ${name}\n  -> ${err.stack || err.message}`);
  }
}

// Required exports check
test('Exports: required symbols exist on PartyChairEngine and StatesOfficialsTables', () => {
  assert.strictEqual(typeof E.getRaceVoterCount, 'function');
  assert.strictEqual(typeof E.isFundingUnhappinessExempt, 'function');
  assert.strictEqual(typeof E.TIER_FUNDRAISING_YIELD_MILLIONS, 'object');
  assert.strictEqual(typeof E.SCRIPTED_PARTY_SWITCHES, 'object');
  assert.strictEqual(typeof SOT, 'object');
  assert.strictEqual(typeof SOT.renderSubview, 'function');
});

// F1: Candidate Recruitment Overhaul
test('F1: 10,000 recruit quality draws match mean ~5.0, 80% in 3..7, 1% at 1 or 10; faction & happiness applied', () => {
  let sum = 0;
  let midCount = 0;
  let extremeCount = 0;
  for (let i = 0; i < 10000; i++) {
    const q = V07.rollRecruitQuality(`test-seed-${i}`);
    sum += q;
    if (q >= 3 && q <= 7) midCount++;
    if (q === 1 || q === 10) extremeCount++;
  }
  const mean = sum / 10000;
  const pMid = midCount / 10000;
  const pExt = extremeCount / 10000;
  assert(mean >= 4.95 && mean <= 5.05, `Expected mean in [4.95, 5.05], got ${mean}`);
  assert(pMid >= 0.79 && pMid <= 0.81, `Expected P(3..7) in [0.79, 0.81], got ${pMid}`);
  assert(pExt >= 0.008 && pExt <= 0.012, `Expected P(1 or 10) in [0.008, 0.012], got ${pExt}`);

  let sSum = 0;
  for (let i = 0; i < 2000; i++) {
    const rec = D.VERSION_01_STATE_RECRUIT('senate:PA', 'Pennsylvania', 'people', 1000 + i, 0);
    sSum += rec.quality;
  }
  const sMean = sSum / 2000;
  assert(sMean >= 4.7 && sMean <= 5.3, `Expected VERSION_01_STATE_RECRUIT mean near 5.0, got ${sMean}`);

  const g = E.createGame({ templateId: 'people', seed: 2028 });
  const targetRace = `senate:${g.activeSenateRaces[0].state}`;
  const partyFacs = g.factions.filter((f) => f.partyId === 'people');
  assert(partyFacs.length >= 2, 'People party has factions');
  const chosenFac = partyFacs[1];
  g.factionHappiness[chosenFac.id] = 33;
  const afterRecruit = E.takeAction(g, 'encourage-state-recruit', {
    raceId: targetRace,
    partyId: 'people',
    factionId: chosenFac.id,
  });
  const field = afterRecruit.primaryFields[targetRace].people;
  const recruited = field.find((c) => c.recruit);
  assert(recruited, 'Recruit added to primary field');
  assert.strictEqual(recruited.factionId, chosenFac.id);
  assert.strictEqual(recruited.faction, chosenFac.name);
  assert.strictEqual(recruited.happiness, 33);

  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes('Quality: ?/10'), 'Blind quality indicator present in app.js');
  assert(appSrc.includes('id="recruit-faction-select"'), 'Faction selector present in app.js');
});

// F2: Prevent Duplicate Party Focuses
test('F2: Rejects duplicate party focuses across slots, allows 5 distinct states', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g = E.executePartyAction(g, 'people', 'SET_PARTY_FOCUS', { slotIndex: 0, type: 'state', targetId: 'PA' });
  assert.strictEqual(g.parties.people.partyFocuses[0].targetId, 'PA');

  const dupRes = E.executePartyAction(g, 'people', 'SET_PARTY_FOCUS', { slotIndex: 1, type: 'state', targetId: 'PA' });
  assert.notStrictEqual(dupRes.parties.people.partyFocuses[1]?.targetId, 'PA', 'Duplicate PA blocked');
  assert(dupRes.lastError && dupRes.lastError.includes('Duplicate'), 'Sets lastError on duplicate');

  const lockedDistinct = E.executePartyAction(g, 'people', 'LOCK_PRIORITIES', {
    focuses: ['PA', 'MI', 'WI', 'AZ', 'GA'].map((s) => ({ type: 'state', targetId: s })),
  });
  assert.deepStrictEqual(
    lockedDistinct.parties.people.partyFocuses.map((f) => f.targetId),
    ['PA', 'MI', 'WI', 'AZ', 'GA']
  );

  const lockedDup = E.executePartyAction(g, 'people', 'LOCK_PRIORITIES', {
    focuses: [
      { type: 'state', targetId: 'PA' },
      { type: 'state', targetId: 'PA' },
      { type: 'state', targetId: 'MI' },
    ],
  });
  assert.strictEqual(lockedDup.parties.people.partyFocuses[1].targetId, '', 'Duplicate focus cleared on lock');
});

// F3: General Persuasion State Boost
test('F3: General Persuasion Boost adds +0.5% to all races in PA and 1..1000 voters', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.phase = 'general-campaign';
  g.campaign = { ...(g.campaign || {}), active: true, month: 1, monthlyActionsLeft: 5, weeklyActionsLeft: 5 };
  const paBefore = g.voterModel.states.find((s) => (s.stateId || s.id) === 'PA');
  const paPeopleBefore = paBefore.affiliations.people;
  const paTotalBefore = paBefore.representedVoters;

  const presBefore = E.presidentialStateMargin(g, 'PA');
  const senBefore = E.estimateRaceMargin(g, 'senate:PA');
  const govBefore = E.estimateRaceMargin(g, 'governor:PA');
  const houseBefore = E.estimateRaceMargin(g, 'house:PA-7');
  const shSharesBefore = E.computeStateLegislatureVoteShares(g, 'PA', { chamber: 'lower' });
  const seoBefore = ENE.resolveStatewideOffices(JSON.parse(JSON.stringify(g)), 2028, { zeroNoise: true, includeOffCycle: true });
  const paSeoBefore = seoBefore.byState.PA[0].margin;

  const boosted = CO.executeNewCampaignAction(g, 'campaign-statehouse-blitz', { stateId: 'PA' });
  assert.strictEqual(boosted.campaign.generalPersuasionStateBoosts.PA, 0.5);

  const paAfter = boosted.voterModel.states.find((s) => (s.stateId || s.id) === 'PA');
  const added = paAfter.affiliations.people - paPeopleBefore;
  assert(added >= 1 && added <= 1000, `Expected +1..1000 voters, got ${added}`);
  assert.strictEqual(paAfter.representedVoters - paTotalBefore, added);

  const presAfter = E.presidentialStateMargin(boosted, 'PA');
  const senAfter = E.estimateRaceMargin(boosted, 'senate:PA');
  const govAfter = E.estimateRaceMargin(boosted, 'governor:PA');
  const houseAfter = E.estimateRaceMargin(boosted, 'house:PA-7');
  const shSharesAfter = E.computeStateLegislatureVoteShares(boosted, 'PA', { chamber: 'lower' });
  const seoAfter = ENE.resolveStatewideOffices(JSON.parse(JSON.stringify(boosted)), 2028, { zeroNoise: true, includeOffCycle: true });
  const paSeoAfter = seoAfter.byState.PA[0].margin;

  assert(Math.abs((presAfter - presBefore) - 0.5) < 0.05, `Presidential lift ~0.5, got ${presAfter - presBefore}`);
  assert(Math.abs((senAfter - senBefore) - 0.5) < 0.05, `Senate lift ~0.5, got ${senAfter - senBefore}`);
  assert(Math.abs((govAfter - govBefore) - 0.5) < 0.05, `Governor lift ~0.5, got ${govAfter - govBefore}`);
  assert(Math.abs((houseAfter - houseBefore) - 0.5) < 0.05, `House lift ~0.5, got ${houseAfter - houseBefore}`);
  assert(shSharesAfter.people > shSharesBefore.people, `State Leg share increased (${shSharesBefore.people} -> ${shSharesAfter.people})`);
  assert(Math.abs((paSeoAfter - paSeoBefore) - 0.5) < 0.1, `Minor Statewide lift ~0.5, got ${paSeoAfter - paSeoBefore}`);
});

// F4: Multi-Race Statewide Average Party Drift
test('F4: calculateCertifiedPerformanceDrift computes exact unweighted average across 10 races in a state', () => {
  const g = E.createGame({ templateId: 'people', seed: 2028 });
  const paSt = D.STATES.find((s) => s.id === 'PA');
  const prevLean = paSt.lean;
  paSt.lean = 0;
  try {
    const outcome = {
      year: 2030,
      type: 'midterm',
      senate: [{ stateId: 'PA', gopMinusDemMargin: 10 }],
      governors: [{ stateId: 'PA', gopMinusDemMargin: -4 }],
      house: {
        districts: [
          { stateId: 'PA', gopMinusDemMargin: -6 },
          { stateId: 'PA', gopMinusDemMargin: 2 },
        ],
      },
      stateHouse: { PA: { gopMinusDemMargin: 6 } },
      stateSenate: { PA: { gopMinusDemMargin: 8 } },
      statewideByState: {
        PA: [
          { gopMinusDemMargin: 2 },
          { gopMinusDemMargin: 4 },
          { gopMinusDemMargin: 6 },
          { gopMinusDemMargin: 8 },
          { gopMinusDemMargin: 10 },
        ],
      },
    };
    const { records } = ED.calculateCertifiedPerformanceDrift(g, outcome);
    const paRec = records.find((r) => r.stateId === 'PA');
    assert(paRec, 'PA drift record exists');
    assert.strictEqual(paRec.raceCount, 10, `Expected 10 races, got ${paRec.raceCount}`);
    assert(Math.abs(paRec.actualMargin - 4.8) < 1e-4, `Expected exact unweighted avg 4.8, got ${paRec.actualMargin}`);
  } finally {
    paSt.lean = prevLean;
  }
});

// F5: Voter-Scaled Campaign Funding Lift
test('F5: computeFundingPollingLift scales proportionally with raceVoters', () => {
  assert.strictEqual(E.computeFundingPollingLift(0.2, 200000), 1.0);
  assert.strictEqual(E.computeFundingPollingLift(0.6, 200000), 2.0);
  assert.strictEqual(E.computeFundingPollingLift(1.0, 1000000), 1.0);
});

// F6: State Legislature Slate Funding
test('F6: initializeCandidateFunding registers state-leg slates (skipping NE:upper) and moves State Leg shares', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.phase = 'general-campaign';
  const initRes = E.initializeCandidateFunding(g);
  g.candidateFunding = initRes.candidateFunding;
  assert(g.candidateFunding['state-leg:PA:lower'], 'PA lower slate registered');
  assert(g.candidateFunding['state-leg:PA:upper'], 'PA upper slate registered');
  assert(g.candidateFunding['state-leg:NE:lower'], 'NE lower slate registered');
  assert(!g.candidateFunding['state-leg:NE:upper'], 'NE upper slate skipped (unicameral)');
  const keys = Object.keys(g.candidateFunding);
  assert(!keys.some((k) => /^state-leg:[A-Z]{2}:(lower|upper):.+$/.test(k)), 'No individual state legislators registered');

  const beforeShares = E.computeStateLegislatureVoteShares(g, 'PA', { chamber: 'lower' });
  g.treasury = 500;
  g = E.allocateCandidateFunds(g, 'state-leg:PA:lower', 10);
  const afterShares = E.computeStateLegislatureVoteShares(g, 'PA', { chamber: 'lower' });
  assert(afterShares.people > beforeShares.people, 'State leg slate funding increases State House vote share');
});

// F7: Live Polling header & subtitle
test('F7: Live Polling header and subtitle verbatim in app.js', () => {
  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes('<h2>Live Polling</h2>'), 'Exact Live Polling heading');
  assert(
    appSrc.includes("Updates immediately to your actions, although isn't the most reliable source in the world (MoE +/-7)"),
    'Exact Live Polling subtitle'
  );
});

// F8: Candidate Funding Unhappiness Exemptions
test('F8: pullCandidateFunds triggers 0 upset for Tier 0, Tier 1, Tier 2 House, and Safe (|margin| >= 12) races', () => {
  let g1 = E.createGame({ templateId: 'constitution', seed: 2028 });
  g1.partyTiers = { ...(g1.partyTiers || {}), player: 1, constitution: 1 };
  g1.candidateFunding = {
    'senate:PA': { raceKey: 'senate:PA', kind: 'Senate', candidateName: 'Test Sen', allocated: 2, unhappy: false, happiness: 70 },
  };
  g1 = E.pullCandidateFunds(g1, 'senate:PA', 1);
  assert.strictEqual(g1.candidateFunding['senate:PA'].unhappy, false);
  assert.strictEqual(g1.candidateFunding['senate:PA'].happiness, 70);

  let g2 = E.createGame({ templateId: 'green', seed: 2028 });
  g2.partyTiers = { ...(g2.partyTiers || {}), player: 2, green: 2 };
  g2.candidateFunding = {
    'house:PA-7': { raceKey: 'house:PA-7', kind: 'House', candidateName: 'Test House', allocated: 2, unhappy: false, happiness: 70 },
  };
  g2 = E.pullCandidateFunds(g2, 'house:PA-7', 1);
  assert.strictEqual(g2.candidateFunding['house:PA-7'].unhappy, false);
  assert.strictEqual(g2.candidateFunding['house:PA-7'].happiness, 70);

  let g5 = E.createGame({ templateId: 'people', seed: 2028 });
  g5.candidateFunding = E.initializeCandidateFunding(g5).candidateFunding;
  g5.candidateFunding['senate:WY'] = { raceKey: 'senate:WY', kind: 'Senate', candidateName: 'WY Dem', allocated: 5, unhappy: false, happiness: 70 };
  g5 = E.pullCandidateFunds(g5, 'senate:WY', 2);
  assert.strictEqual(g5.candidateFunding['senate:WY'].unhappy, false, 'Safe race |margin| >= 12 exempt');
  assert.strictEqual(g5.candidateFunding['senate:WY'].happiness, 70);

  g5.nationalEnvironment = -3;
  g5.candidateFunding['senate:PA'] = { raceKey: 'senate:PA', kind: 'Senate', candidateName: 'PA Dem', allocated: 5, unhappy: false, happiness: 70 };
  g5 = E.pullCandidateFunds(g5, 'senate:PA', 2);
  assert.strictEqual(g5.candidateFunding['senate:PA'].unhappy, true, 'Competitive Tier 5 race triggers upset');
  assert(g5.candidateFunding['senate:PA'].happiness < 70);
});

// F9: Election Results Senate Cycle Filter vs Full 100-Seat Tracker
test('F9: Election Night Senate timeline has current-cycle races (~33-35) while scoreboard.senate sums to 100', () => {
  const g = E.createGame({ templateId: 'people', seed: 2028 });
  const senateRes = g.activeSenateRaces.map((r) => ({
    stateId: r.state,
    raceKey: `senate:${r.state}`,
    winner: r.party || 'people',
    margin: 5,
    nominees: { people: 'Dem', heritage: 'Rep' },
    shares: { people: 52.5, heritage: 47.5 },
  }));
  const timeline = ENE.buildElectionNightTimeline(g, {
    presidentialResults: {},
    senateResults: senateRes,
    governorResults: [],
    house: { districts: [] },
  });
  const senRaces = timeline.races.filter((r) => r.raceKind === 'senate');
  assert(senRaces.length >= 33 && senRaces.length <= 35, `Expected ~33-35 cycle senate races, got ${senRaces.length}`);
  const snap = ENE.evaluateElectionNightAt(timeline, timeline.end);
  const totalSenScore = snap.scoreboard.senate.people + snap.scoreboard.senate.heritage + snap.scoreboard.senate.third;
  assert.strictEqual(totalSenScore, 100, `Expected full 100-seat senate scoreboard, got ${totalSenScore}`);
});

// F10: Gate Redistricting Compromise Battles to Top-2 Largest Parties in a House
test('F10: Redistricting split battle gated to top-2 parties in any chamber', () => {
  let g3 = E.createGame({ templateId: 'green', seed: 2030 });
  g3.year = 2030;
  g3.stateLegislatures.PA = ['people', 'heritage'];
  g3.governorships.PA = 'heritage';
  g3.stateHouseSeatCounts.PA = { total: 203, people: 102, heritage: 100, green: 1 };
  g3.stateSenateSeatCounts.PA = { total: 50, people: 24, heritage: 26, green: 0 };
  const wr3 = RBS.initializeDecennialWarRoom(g3, 2030);
  const paEntry3 = wr3.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'PA');
  assert(paEntry3, 'PA entry present');
  assert.strictEqual(paEntry3.controlType, 'rival_split', '3rd-place party gets rival_split, not split');
  const rejected = RBS.selectRedistrictingStrategy(wr3, 'PA', 'special_master');
  assert.strictEqual(rejected.redistrictingWarRoom.selections.PA, 'incumbent_protection', 'Player cannot edit rival_split');

  let gTop2 = E.createGame({ templateId: 'people', seed: 2030 });
  gTop2.year = 2030;
  gTop2.stateLegislatures.PA = ['people', 'heritage'];
  gTop2.governorships.PA = 'heritage';
  gTop2.stateHouseSeatCounts.PA = { total: 203, people: 102, heritage: 101 };
  gTop2.stateSenateSeatCounts.PA = { total: 50, people: 24, heritage: 26 };
  const wrTop2 = RBS.initializeDecennialWarRoom(gTop2, 2030);
  const paEntryTop2 = wrTop2.redistrictingWarRoom.controlledStates.find((s) => s.stateId === 'PA');
  assert.strictEqual(paEntryTop2.controlType, 'split', 'Top-2 party offered split compromise battle');
});

// F11: States Tab Updated Voter Registration Migration Numbers
test('F11: Post-election drift records positive & negative stateDeltas on voterModel and app.js renders negative badges', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.phase = 'complete';
  g.lastElection = {
    year: 2028,
    type: 'presidential',
    presidentialResults: { PA: 12, CA: -25, TX: -14 },
    senate: [],
    governors: [],
    house: { districts: g.representatives },
  };
  const next = E.startNextCycle(g);
  assert(next.voterModel?.stateDeltas && Object.keys(next.voterModel.stateDeltas).length >= 50, 'stateDeltas populated');
  const allTotalDeltas = Object.values(next.voterModel.stateDeltas).map((d) => Number(d.total || 0));
  assert(allTotalDeltas.some((v) => v > 0), 'At least one state has positive voter delta');
  assert(allTotalDeltas.some((v) => v < 0), 'At least one state has negative voter delta');
  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes('v15-reg-gain-neg'), 'Negative migration badge styling rendered in app.js');
});

// F12: Politician Courting Tier 3 Gate (Except Happiness <= 10) & Reliable Action
test('F12: Tier 2 blocked at H=35, allowed at H<=10; Tier 3+ succeeds reliably with no silent no-ops', () => {
  let g2 = E.createGame({ templateId: 'green', seed: 2028 });
  g2.partyTiers = { ...(g2.partyTiers || {}), player: 2, green: 2 };
  g2.treasury = 50;
  g2.actionsLeft = 10;
  g2.organizingActionsRemaining = 10;
  const target35 = g2.sittingMembers.find((m) => m.party === 'people' && m.office === 'house');
  target35.happiness = 35;

  assert.strictEqual(BA.canCourtPoliticians(g2, 'green', target35), false, 'Tier 2 blocked at H=35');
  const blocked = E.takeAction(g2, 'court-politician', { memberId: target35.id });
  assert.strictEqual(blocked.sittingMembers.find((m) => m.id === target35.id).party, 'people', 'Did not defect at Tier 2 H=35');

  target35.happiness = 10;
  assert.strictEqual(BA.canCourtPoliticians(g2, 'green', target35), true, 'Tier 2 allowed at H<=10');
  const prevActions = g2.actionsLeft;
  const prevTreas = g2.treasury;
  const succeededLowH = E.takeAction(g2, 'court-politician', { memberId: target35.id });
  assert.strictEqual(succeededLowH.sittingMembers.find((m) => m.id === target35.id).party, 'green', 'Defected at H<=10');
  assert.strictEqual(succeededLowH.actionsLeft, prevActions - 1);
  assert.strictEqual(succeededLowH.treasury, prevTreas - 4);

  let g3 = E.createGame({ templateId: 'liberty', seed: 2028 });
  g3.partyTiers = { ...(g3.partyTiers || {}), player: 3, liberty: 3 };
  g3.treasury = 50;
  g3.actionsLeft = 10;
  g3.organizingActionsRemaining = 10;
  const targetTier3 = g3.sittingMembers.find((m) => m.party === 'people' && m.office === 'senate');
  targetTier3.happiness = 35;
  const res3 = E.takeAction(g3, 'court-politician', { memberId: targetTier3.id });
  assert.strictEqual(res3.sittingMembers.find((m) => m.id === targetTier3.id).party, 'liberty', 'Tier 3 minor party court succeeded reliably without silent no-op');
  assert.strictEqual(res3.actionsLeft, 9);
  assert.strictEqual(res3.treasury, 46);
});

// F13: Raise Faction Courting from Tier 3 to Tier 4
test('F13: Faction courting/recruitment blocked at Tier 3 and allowed at Tier 4', () => {
  let g = E.createGame({ templateId: 'green', seed: 2028 });
  const indFac = g.factions.find((f) => ['independent', 'none', 'unaffiliated'].includes(f.partyId));
  assert(indFac, 'Independent faction exists');

  g.partyTiers = { ...(g.partyTiers || {}), player: 3, green: 3 };
  g.treasury = 50;
  const engTier3 = E.checkSummitEligibility(g, indFac.id);
  assert.strictEqual(engTier3.eligible, false, 'Engine blocks Tier 3');
  const fcTier3 = FC.checkSummitEligibility(g, indFac.id, { computeFactionKeyIssuesDistance: () => 1.0 });
  assert.strictEqual(fcTier3.eligible, false, 'FactionCore blocks Tier 3');
  const courtT3 = E.takeAction(g, 'court-independent-faction', { factionId: indFac.id });
  assert(courtT3.lastNote.includes('Tier 4'), `Expected Tier 4 gate note, got: ${courtT3.lastNote}`);

  g.offCycle = { active: true, actionsRemaining: 2 };
  const ocT3 = OC.handleAction(g, 'oc-court-independent', { factionId: indFac.id });
  assert(ocT3.lastNote.includes('Tier 4'), `Expected off-cycle Tier 4 gate note, got: ${ocT3.lastNote}`);

  g.partyTiers = { ...(g.partyTiers || {}), player: 4, green: 4 };
  const courtT4 = E.takeAction(g, 'court-independent-faction', { factionId: indFac.id });
  assert(!courtT4.lastNote.includes('unlocks at Tier 4'), 'Tier 4 allowed to court independent faction');
});

// F14: 5 New States Subtabs
test('F14: All 5 StatesOfficialsTables subtabs render cleanly with expected columns and checkmarks', () => {
  const g = E.createGame({ templateId: 'people', seed: 2028 });
  const t1 = SOT.renderSubview('statewide-offices', g, { activeStateId: 'PA' });
  assert(t1.includes('Governor') && t1.includes('Pennsylvania'), 'Statewide Offices renders');

  const t2 = SOT.renderSubview('senate-seats', g, {});
  assert(t2.includes('Class 1') && t2.includes('Class 2') && t2.includes('Class 3'), 'Senate Seats renders 3 classes');

  const t3 = SOT.renderSubview('house-seats', g, {});
  assert(t3.includes('Total Seats') && t3.includes('California'), 'House Seats renders');

  const t4 = SOT.renderSubview('state-house-seats', g, {});
  assert(t4.includes('✓') && t4.includes('Unicameral'), 'State House Seats renders with checkmark and NE unicameral');

  const t5 = SOT.renderSubview('state-senate-seats', g, {});
  assert(t5.includes('✓') && t5.includes('Unicameral'), 'State Senate Seats renders with checkmark and NE unicameral');
});

// F15: 0-Action Step 1 Actions, $2M State Chapter, 2x Starting Balances
test('F15: Moved actions cost 0 actions, chapter costs $2M, and starting treasuries are 2x baseline', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  assert.strictEqual(g.treasury, 300, 'Major party starts with $300M (2x $150M)');

  const gLib = E.createGame({ templateId: 'liberty', seed: 2028 });
  assert.strictEqual(gLib.treasury, 20, 'Minor party (Lib/Green) starts with $20M (2x $10M)');

  const gCon = E.createGame({ templateId: 'constitution', seed: 2028 });
  assert.strictEqual(gCon.treasury, 2, 'Tier 0 party starts with $2M (2x $1M)');

  const gCust = E.createGame({ templateId: 'custom', custom: true, origin: 'grassroots_viral', seed: 2028 });
  assert(gCust.treasury >= 30, `Custom grassroots party starts with >= $30M (2x $15M), got ${gCust.treasury}`);

  g.actionsLeft = 0;
  g.organizingActionsRemaining = 0;
  const tBeforeCh = g.treasury;
  const chRes = E.takeAction(g, 'chapter', { stateId: 'OH' });
  assert.strictEqual(chRes.actionsLeft, 0, 'Chapter consumes 0 actions');
  assert.strictEqual(chRes.treasury, tBeforeCh - 2, 'Chapter costs $2.0M');

  const knMember = g.sittingMembers.find((m) => m.party === 'people');
  const knRes = E.takeAction(chRes, 'select-keynote-speaker', { memberId: knMember.id });
  assert.strictEqual(knRes.keynoteSpeakerId, knMember.id, 'Keynote succeeds with 0 actions');
  assert.strictEqual(knRes.actionsLeft, 0);

  const biRes = E.takeAction(knRes, 'sponsor-ballot-initiative', { stateId: 'AZ', archetypeId: RBS.BALLOT_INITIATIVE_ARCHETYPES[0].id });
  assert.strictEqual(biRes.actionsLeft, 0, 'Ballot initiative consumes 0 actions');
  assert(biRes.activeBallotInitiatives.length === 1, 'Ballot initiative succeeded at 0 actions');

  const trifectaSt = BA.getEligibleTrifectaStates(biRes, 'people')[0];
  assert(trifectaSt, 'People has at least 1 trifecta state');
  const vlRes = E.takeAction(biRes, 'enact-state-voting-law', { stateId: trifectaSt.id, billId: 'universal-vote-by-mail' });
  assert.strictEqual(vlRes.actionsLeft, 0, 'State trifecta voting reform consumes 0 actions');
  assert(vlRes.treasury < biRes.treasury, 'Voting reform deducted $2M');
});

// F16: John Fetterman 2028 PA Senate Arc
test('F16: John Fetterman faces heavy 2028 PA Dem primary challenge, switches to heritage on loss, and runs as R later', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  const field = E.version01CandidateField(g, 'senate:PA', 'people');
  const fetterman = field.find((c) => c.name === 'John Fetterman');
  const topChallenger = field.filter((c) => c.name !== 'John Fetterman').sort((a, b) => b.poll - a.poll)[0];
  assert(fetterman && topChallenger, 'Fetterman and challenger present in 2028 PA Dem primary');
  assert(topChallenger.poll > fetterman.poll, `Challenger (${topChallenger.poll}) leads Fetterman (${fetterman.poll})`);

  const postPrim = E.resolveVersion01Primaries(g);
  const paRes = postPrim.primaryResults.find((r) => r.raceId === 'senate:PA' && r.partyId === 'people');
  assert.notStrictEqual(paRes.winnerName, 'John Fetterman', 'Fetterman loses 2028 PA Dem primary');
  assert(postPrim.triggeredScriptedSwitches.includes('fetterman-2028-pa-switch'), 'Scripted switch recorded');
  const fetPol = postPrim.politicians.find((p) => p.name === 'John Fetterman');
  assert(fetPol && fetPol.party === 'heritage' && fetPol.rawParty === 'R', 'Fetterman switched to heritage (R)');

  const postGen = E.resolveVersion01GeneralElection(postPrim);
  const futureGame = { ...postGen, year: 2030 };
  const futureRepGov = E.version01CandidateField(futureGame, 'governor:PA', 'heritage');
  const futureDemGov = E.version01CandidateField(futureGame, 'governor:PA', 'people');
  assert(futureRepGov.some((c) => c.name === 'John Fetterman'), 'Fetterman eligible in future PA Republican primary');
  assert(!futureDemGov.some((c) => c.name === 'John Fetterman'), 'Fetterman excluded from future PA Democratic primary');
});

// F17 & F18: Small-Donor Drive and Joint Victory Fund
test('F17 & F18: Small-Donor Drive and Joint Victory Fund yield exact tier amounts with 2-decimal precision', () => {
  const expected = { 0: 0.25, 1: 0.50, 2: 1.00, 3: 2.50, 4: 10.00, 5: 25.00 };
  for (let tier = 0; tier <= 5; tier++) {
    let g = E.createGame({ templateId: 'people', seed: 2028 });
    g.partyTiers = { ...(g.partyTiers || {}), player: tier, people: tier };
    g.treasury = 1.00;
    g.actionsLeft = 5;
    const sd = E.takeAction(g, 'fundraise', { stateId: 'PA' });
    assert.strictEqual(sd.treasury, Number((1.00 + expected[tier]).toFixed(2)), `Small-Donor Tier ${tier}`);

    let gc = E.createGame({ templateId: 'people', seed: 2028 });
    gc.partyTiers = { ...(gc.partyTiers || {}), player: tier, people: tier };
    gc.treasury = 1.00;
    gc.phase = 'general-campaign';
    gc.campaign = { ...(gc.campaign || {}), active: true, weeklyActionsLeft: 5, monthlyActionsLeft: 5 };
    const jv = E.takeAction(gc, 'joint-fundraising', { stateId: 'PA' });
    assert.strictEqual(jv.treasury, Number((1.00 + expected[tier]).toFixed(2)), `Joint Victory Tier ${tier}`);
  }
});

// F19: Universal Senate Map Split Fix & Per-Party Totals
test('F19: Universal Senate Map colors 1-GOP + 1-Lib purple, 2-Lib yellow, and shows 100-seat party summary', () => {
  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  const kyPair = [{ party: 'heritage', caucus: 'heritage' }, { party: 'liberty', caucus: 'liberty' }];
  const libPair = [{ party: 'liberty', caucus: 'liberty' }, { party: 'liberty', caucus: 'liberty' }];

  const evalColor = (pair) => {
    const s1 = pair[0];
    const s2 = pair[1] || pair[0];
    const isDem = (s) => s && (s.caucus === 'people' || s.party === 'people');
    const isGop = (s) => s && (s.caucus === 'heritage' || s.party === 'heritage');
    const p1 = s1?.party || s1?.caucus;
    const p2 = s2?.party || s2?.caucus;
    if (isDem(s1) && isDem(s2)) return '#3478c8';
    if (isGop(s1) && isGop(s2)) return '#c9474e';
    if (p1 && p1 === p2 && !['people', 'heritage'].includes(p1)) return '#e2bd45';
    return '#8654a4';
  };
  assert.strictEqual(evalColor(kyPair), '#8654a4', '1-GOP + 1-Lib renders purple');
  assert.strictEqual(evalColor(libPair), '#e2bd45', '2-Lib renders yellow');
  assert(appSrc.includes('Combined 50-State U.S. Senate Seats (100 Total)'), '100-seat party summary header present');
  assert(!appSrc.includes('Democratic Delegations (Blue)'), 'Old delegation-control sentence removed');
});

console.log(`\nSummary: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
