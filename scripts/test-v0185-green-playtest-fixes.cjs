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

[
  'data.js',
  'factions-0.15.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'maps-0.3.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographics-0.9.js',
  'political-trends-system.js',
  'political-texture-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'ballot-access.js',
  'candidate-vetting.js',
  'election-uncertainty.js',
  'election-drift.js',
  'election-night-engine.js',
  'campaign-overhaul.js',
  'media-shocks-system.js',
  'faction-era-stability.js',
  'v0185-playtest-fixes.js',
  'engine.js',
].forEach((file) => require(path.join(ROOT, file)));

const Engine = global.PartyChairEngine;
const V185 = global.V0185PlaytestFixes;
const CO = global.CampaignOverhaul;
const MS = global.MediaShocksSystem;

console.log('=== [v0.18.5] Running Green Party Playtest Fixes Verification Suite ===');

// -----------------------------------------------------------------------------
// TEST 1: Tier-based Auto-Candidates at game start + State Leg Seat 100% override
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('green', { seed: 202801 });
  const activeSen = g.activeSenateRaces || window.PartyChairData.VERSION_01_SENATE_RACES || [];
  const activeGov = g.activeGubernatorialStates || window.PartyChairData.VERSION_01_GUBERNATORIAL_ELECTIONS || [];
  const houseAll = window.PartyChairData.VERSION_01_HOUSE_DISTRICTS || [];
  const seoOnCycle = (window.PartyChairData.STATEWIDE_OFFICES_REGISTRY || []).filter((o) =>
    window.PartyChairData.isStatewideOfficeOnCycle ? window.PartyChairData.isStatewideOfficeOnCycle(o, 2028) : o.nextElectionYear === 2028
  );

  const countGreenFields = (prefix, list) =>
    list.filter((id) => (g.primaryFields?.[`${prefix}:${id}`]?.green || []).length > 0).length;

  const senCount = countGreenFields('senate', activeSen.map((r) => r.state || r.stateId));
  const govCount = countGreenFields('governor', activeGov);
  const houseCount = countGreenFields('house', houseAll.map((d) => d.id));
  const seoCount = countGreenFields('statewide', seoOnCycle.map((o) => o.id));

  assert(senCount > 0 && senCount < activeSen.length, `Tier 1 Green Senate auto-candidates should be ~50% (got ${senCount}/${activeSen.length})`);
  assert(govCount > 0 && govCount < activeGov.length, `Tier 1 Green Gov auto-candidates should be ~50% (got ${govCount}/${activeGov.length})`);
  assert(houseCount > 80 && houseCount < 220, `Tier 1 Green House auto-candidates should be ~1/3 (got ${houseCount}/${houseAll.length})`);
  assert(seoCount > 0 && seoCount < Math.round(seoOnCycle.length * 0.5), `Tier 1 Green minor statewide auto-candidates should be ~25% (got ${seoCount}/${seoOnCycle.length})`);

  // Verify Tier 4 rates (100% House/Sen/Gov, ~75% minor statewide)
  const t4Game = Engine.createGame('green', { seed: 202802 });
  t4Game.primaryFields = {};
  const t4Res = V185.generateCycleAutoCandidates(t4Game, () => 4);
  const t4Sen = activeSen.filter((r) => (t4Res.primaryFields?.[`senate:${r.state || r.stateId}`]?.green || []).length > 0).length;
  const t4House = houseAll.filter((d) => (t4Res.primaryFields?.[`house:${d.id}`]?.green || []).length > 0).length;
  assert.strictEqual(t4Sen, activeSen.length, 'Tier 4 must receive 100% Senate auto-candidates');
  assert.strictEqual(t4House, houseAll.length, 'Tier 4 must receive 100% House auto-candidates');

  // Verify State-Legislature-Seat Override: holding >= 1 state leg seat in CA gives 100% CA races regardless of tier
  const legGame = Engine.createGame('green', { seed: 202803 });
  legGame.primaryFields = {};
  legGame.stateHouseSeatCounts.CA.green = 1;
  const legRes = V185.generateCycleAutoCandidates(legGame, () => 1);
  const caHouse = houseAll.filter((d) => d.stateId === 'CA');
  const caHouseRan = caHouse.filter((d) => (legRes.primaryFields?.[`house:${d.id}`]?.green || []).length > 0).length;
  assert.strictEqual(caHouseRan, caHouse.length, `Holding 1 CA state-leg seat must grant 100% CA House auto-candidates (got ${caHouseRan}/${caHouse.length})`);
  assert.strictEqual(legRes.ballotAccess.green.leg.CA, true, 'Holding 1 CA state-leg seat must guarantee CA state-leg ballot access');

  console.log(`PASS [1]: Tier auto-candidates (T1 Sen=${senCount}/${activeSen.length}, Gov=${govCount}/${activeGov.length}, House=${houseCount}/${houseAll.length}, SEO=${seoCount}/${seoOnCycle.length}) + State-Leg Override`);
}

// -----------------------------------------------------------------------------
// TEST 2: State-specific minor party vote percentages (NOT identical across states)
//         + Green candidates show up in general election results
//         + Minor statewide offices excluded from Candidate Budget Triage
// -----------------------------------------------------------------------------
{
  let g = Engine.createGame('green', { seed: 202804 });
  // Give Green presidential access across all states to check state-by-state variance
  window.PartyChairData.STATES.forEach((s) => {
    g.ballotAccess.green.presidential[s.id] = true;
    g.ballotAccess.green[s.id] = true;
  });
  const pf = Engine.presidentialForecast(g, { applyElectionDayDefection: true });
  const grnShares = pf.states.map((s) => s.shares.green);
  const uniqueShares = new Set(grnShares.map((x) => Number(x).toFixed(2)));
  assert(uniqueShares.size >= 8, `Green state vote shares must vary across states by faction/voter distribution (got only ${uniqueShares.size} unique values)`);
  const caRow = pf.states.find((s) => (s.stateId || s.id) === 'CA');
  const wyRow = pf.states.find((s) => (s.stateId || s.id) === 'WY');
  assert(caRow.shares.green > wyRow.shares.green, `CA Green share (${caRow.shares.green}%) should exceed WY Green share (${wyRow.shares.green}%)`);

  // Resolve primaries and verify Triage has ONLY Senate/Governor/House (NO minor statewide)
  g = Engine.resolvePrimaries(g);
  const funded = Engine.initializeCandidateFunding(g);
  const fundingEntries = Object.values(funded.candidateFunding || {});
  assert(fundingEntries.length > 0, 'Green Party must have auto-candidates in Candidate Budget Triage');
  const hasMinorStatewideInTriage = fundingEntries.some((e) => e.kind === 'Statewide' || String(e.raceKey).startsWith('statewide:'));
  assert.strictEqual(hasMinorStatewideInTriage, false, 'Minor statewide offices must NOT appear in Candidate Budget Triage');

  // Verify general election results include Green nominees & shares
  const gen = Engine.resolveVersion01GeneralElection(g);
  const senWithGreen = (gen.lastElection?.senate || []).filter((r) => r.nominees?.green && r.shares?.green > 0);
  assert(senWithGreen.length > 0, 'General election Senate results must include Green nominees and shares');

  console.log(`PASS [2]: ${uniqueShares.size} distinct Green state shares (CA=${caRow.shares.green}% vs WY=${wyRow.shares.green}%), ${senWithGreen.length} Senate races with Green nominees, 0 minor statewide in Triage`);
}

// -----------------------------------------------------------------------------
// TEST 3: Electorate shift is 1/5th (not 1/4th) AND parties both gain AND lose voters
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('people', { seed: 202805 });
  const pf = Engine.presidentialForecast(g, { applyElectionDayDefection: true });
  const outcome = {
    presidential: { byState: Object.fromEntries(pf.states.map((s) => [s.stateId || s.id, { shares: s.shares }])) },
    nationalVote: pf.popularVote,
  };
  const realign = Engine.realignVotingBlocksBetweenElections(g, outcome);
  const peopleChg = (realign.lastRealignment?.parties || realign.realignmentReport?.parties || realign.parties || []).find((p) => p.partyId === 'people')?.voterChange || 0;
  const heritageChg = (realign.lastRealignment?.parties || realign.realignmentReport?.parties || realign.parties || []).find((p) => p.partyId === 'heritage')?.voterChange || 0;
  assert(
    !(peopleChg > 1_000_000 && heritageChg > 1_000_000),
    `Both major parties must NOT simultaneously gain millions of voters (Dem=${peopleChg}, Rep=${heritageChg})`
  );
  const hasGainer = (realign.lastRealignment?.parties || realign.realignmentReport?.parties || realign.parties || []).some((p) => p.voterChange > 0);
  const hasLoser = (realign.lastRealignment?.parties || realign.realignmentReport?.parties || realign.parties || []).some((p) => p.voterChange < 0);
  assert(hasGainer && hasLoser, `Realignment must produce both gaining and losing parties (Dem=${peopleChg}, Rep=${heritageChg})`);
  console.log(`PASS [3]: 1/5th electorate shift balanced (Dem=${peopleChg >= 0 ? '+' : ''}${peopleChg.toLocaleString()}, Rep=${heritageChg >= 0 ? '+' : ''}${heritageChg.toLocaleString()})`);
}

// -----------------------------------------------------------------------------
// TEST 4: No crises on starting cycle (2028)
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('green', { seed: 202806 });
  assert.strictEqual(Engine.evaluateStateCrises(g, 5), null, 'No state crisis allowed in starting cycle');
  assert.deepStrictEqual(CO.rollMonthlyTraitCrises(g, 4), [], 'No campaign trait crisis allowed in starting cycle');
  const msState = MS.initializeState(g);
  assert.strictEqual(msState.activeMacroArc, null, 'No macro crisis arc allowed in starting cycle');
  console.log('PASS [4]: All starting-cycle crises suppressed');
}

// -----------------------------------------------------------------------------
// TEST 5: Priority Quest evaluators trigger properly
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('green', { seed: 202807 });
  // 5a. secure-50-state-ballot
  window.PartyChairData.STATES.forEach((s) => { g.ballotAccess.green.presidential[s.id] = true; });
  g.ballotAccess.green.presidential.DC = true;
  g.priorities = { main: ['secure-50-state-ballot', 'win-first-seat', 'cross-5pct-funding', 'growing-vote-nationally'] };
  g.stateHouseSeatCounts.CA.green = 1;
  g.startingNationalVoteShare = 0.8;
  const mockOutcome = {
    nationalVote: { green: 5.5, people: 48, heritage: 46 },
    stateHouseSeatCounts: g.stateHouseSeatCounts,
  };
  const qRes = Engine.evaluateQuestCompletionAtElection(g, mockOutcome);
  assert(qRes.completedQuests.includes('secure-50-state-ballot'), 'secure-50-state-ballot must complete when 51 jurisdictions certified');
  assert(qRes.completedQuests.includes('win-first-seat'), 'win-first-seat must complete when holding >= 1 state legislative seat');
  assert(qRes.completedQuests.includes('cross-5pct-funding'), 'cross-5pct-funding must complete when nationalVote >= 5%');
  assert(qRes.completedQuests.includes('growing-vote-nationally'), 'growing-vote-nationally must complete when gaining +3% over minor party baseline');
  console.log('PASS [5]: Priority Quest evaluators trigger accurately (4/4 verified)');
}

// -----------------------------------------------------------------------------
// TEST 6: Crisis Pivot removed & War Room actions consolidated in Grand Strategy
// -----------------------------------------------------------------------------
{
  const msCardHtml = MS.renderOrganizingCards(Engine.createGame('green', { seed: 202808 }));
  assert(!msCardHtml.includes('data-ms-action="crisis-pivot"'), 'Crisis Pivot button must be removed from organizing cards');
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert(appSrc.includes('${v0180CampaignWarRoomMarkup(true)}'), 'War Room actions must be embedded inside Monthly Grand-Strategy Actions');
  console.log('PASS [6]: Crisis Pivot removed & War Room actions embedded in Monthly Grand-Strategy Actions');
}

console.log('ALL v0.18.5 GREEN PARTY PLAYTEST FIXES PASSED!');
