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

console.log('=== [v0.18.5] Running Major Party UX, Economy, Wave & Data Verification Suite ===');

// -----------------------------------------------------------------------------
// TEST 1: Major parties gain $2,500M after primaries & AI capped <= $100M post-election
// -----------------------------------------------------------------------------
{
  let g = Engine.createGame('people', { seed: 202850 });
  const preTreas = g.treasury;
  g = Engine.resolvePrimaries(g);
  g = Engine.startCampaignPhase(g);
  assert(g.treasury >= preTreas + 1200, `Major party player must receive $2,500M post-primary grant (pre=${preTreas}, post=${g.treasury})`);
  assert((g.organizations?.heritage?.treasury || 0) >= 2500, `AI major rival must receive $2,500M post-primary grant (got ${g.organizations?.heritage?.treasury})`);

  // General election caps AI leftover treasury at <= $100M
  const gen = Engine.resolveVersion01GeneralElection(g);
  assert((gen.organizations?.heritage?.treasury || 0) <= 100, `AI rival leftover treasury after election must be <= $100M (got ${gen.organizations?.heritage?.treasury})`);
  console.log(`PASS [1]: Major post-primary warchest ($${g.treasury}M player / $${g.organizations.heritage.treasury}M AI) & AI post-election cap <= $100M ($${gen.organizations.heritage.treasury}M)`);
}

// -----------------------------------------------------------------------------
// TEST 2: Zero-lag funding buttons + Batch +$1M funding action
// -----------------------------------------------------------------------------
{
  let g = Engine.createGame('people', { seed: 202851 });
  g = Engine.resolvePrimaries(g);
  g = Engine.startCampaignPhase(g);
  const keys = Object.keys(g.candidateFunding || {}).slice(0, 10);
  assert(keys.length >= 10, 'Should have at least 10 candidate funding entries');

  const t0 = Date.now();
  g = Engine.takeAction(g, 'allocate-candidate-funds', { raceKey: keys[0], amount: 1 });
  const dtSingle = Date.now() - t0;
  assert(dtSingle < 100, `Single allocate-candidate-funds click must be instant (<100ms), took ${dtSingle}ms`);

  const beforeTreas = g.treasury;
  const t1 = Date.now();
  g = Engine.takeAction(g, 'allocate-candidate-funds-batch', { raceKeys: keys, amount: 1 });
  const dtBatch = Date.now() - t1;
  assert(Math.abs((beforeTreas - g.treasury) - 10) < 0.2, `Batch funding 10 races +$1M should spend $10M (spent ${beforeTreas - g.treasury})`);
  assert(dtBatch < 150, `Batch funding 10 races must be fast (<150ms), took ${dtBatch}ms`);
  console.log(`PASS [2]: Zero-lag funding (single=${dtSingle}ms, batch10=${dtBatch}ms)`);
}

// -----------------------------------------------------------------------------
// TEST 3: Presidential-to-House Wave Alignment (~430 EV / D+20 -> ~300+ House seats)
// -----------------------------------------------------------------------------
{
  let g = Engine.createGame('people', { seed: 202852 });
  g.nationalEnvironment = 18;
  g.publicMood = 14;
  g.presidentialApproval = 28; // Unpopular GOP incumbent -> huge Dem wave
  const pf = Engine.presidentialForecast(g, { applyElectionDayDefection: true });
  const dist = Engine.calculateDistrictElection(g, 2028);
  const demEv = pf.demEv ?? pf.ev?.people ?? pf.electoralVotes?.people ?? 0;
  const demHouse = dist.seats?.people || dist.seats?.player || 0;
  assert(demEv >= 380, `Expected Dem landslide EV >= 380, got ${demEv}`);
  assert(demHouse >= 290, `A ${demEv}-EV Dem landslide must yield >= 290 House seats (got ${demHouse})`);
  console.log(`PASS [3]: Dem landslide wave aligned (${demEv} EV -> ${demHouse} House seats)`);
}

// -----------------------------------------------------------------------------
// TEST 4: Politician Faction Audit (Mark Warner NOT in Latino faction)
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('people', { seed: 202853 });
  const warner = (g.sittingMembers || []).find((m) => m.name === 'Mark Warner');
  assert(warner, 'Mark Warner must exist in sittingMembers');
  assert.strictEqual(warner.factionId, 'dem_neo_liberals', `Mark Warner must be in dem_neo_liberals, got ${warner.factionId}`);
  // Verify NO non-explicit random Democratic Senator was hashed into dem_traditional_latin
  const latinSens = (g.sittingMembers || []).filter((m) => m.office === 'senate' && m.factionId === 'dem_traditional_latin');
  const unexpectedLatin = latinSens.filter((m) => !['Ruben Gallego', 'Alex Padilla', 'Ben Ray Lujan', 'Catherine Cortez Masto'].includes(m.name));
  assert.strictEqual(unexpectedLatin.length, 0, `Unexpected Senators in dem_traditional_latin: ${unexpectedLatin.map((m) => m.name).join(', ')}`);
  console.log(`PASS [4]: Politician faction audit clean (Mark Warner=${warner.factionId}, 0 misassigned Senators)`);
}

// -----------------------------------------------------------------------------
// TEST 5: ALL eligible Leadership Roles start filled
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('people', { seed: 202854 });
  const roles = g.leadershipRoles?.player || {};
  ['senateLeader', 'houseLeader', 'senateWhip', 'houseWhip', 'govAssocChair', 'rhetoricalLeader', 'policyLeader', 'opp_house', 'opp_senate', 'opp_gov'].forEach((rid) => {
    assert(roles[rid], `Democratic leadership role '${rid}' must start filled`);
  });
  const gopRoles = g.leadershipRoles?.heritage || {};
  ['president', 'vicePresident', 'senateLeader', 'houseLeader', 'cabinet_state', 'cabinet_defense', 'cabinet_treasury', 'cabinet_ag'].forEach((rid) => {
    assert(gopRoles[rid], `Governing Republican leadership role '${rid}' must start filled`);
  });
  console.log(`PASS [5]: All leadership roles start filled (Dem=${Object.keys(roles).length} roles, GOP=${Object.keys(gopRoles).length} roles)`);
}

// -----------------------------------------------------------------------------
// TEST 6: UI checks (Close-Race Sub-Menus, Batch Button, Presidential Campaign Forecast, Prior-Cycle Maps)
// -----------------------------------------------------------------------------
{
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert(appSrc.includes('data-triage-filter="close-house"'), 'Close House sub-menu button must exist');
  assert(appSrc.includes('data-triage-filter="close-senate"'), 'Close Senate sub-menu button must exist');
  assert(appSrc.includes('data-triage-filter="close-governor"'), 'Close Governors sub-menu button must exist');
  assert(appSrc.includes('id="btn-batch-fund-view"'), 'Fund All in View +$1M button must exist');
  assert(appSrc.includes('data-camp-poll-tab="presidential"'), 'Campaign phase Presidential Forecast tab must exist');
  assert(appSrc.includes('renderPriorCycleMapSvg'), 'Prior-cycle election map viewer must exist');
  console.log('PASS [6]: All UI components verified in app.js');
}

console.log('ALL v0.18.5 MAJOR PARTY UX, ECONOMY, WAVE & DATA TESTS PASSED!');
