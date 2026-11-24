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
  'faction-era-stability.js',
  'engine.js',
].forEach((file) => require(path.join(ROOT, file)));

const Engine = global.PartyChairEngine;
const STATES = global.PartyChairData.STATES;

console.log('=== [v0.18.4] Running Minor Party Polling, Triage & Spoiler Floor Tests ===');

// -----------------------------------------------------------------------------
// TEST 1: Green Party downballot race polling shows non-zero share when ballot-certified
// -----------------------------------------------------------------------------
{
  const g = Engine.createGame('green', { seed: 202811 });
  // Pick a state where Green has Senate ballot access but NOT Presidential ballot access
  const targetState = STATES.find(
    (s) => g.ballotAccess?.green?.senate?.[s.id] && !g.ballotAccess?.green?.presidential?.[s.id]
  );
  assert(targetState, 'Should find a state with Green Senate access but no Presidential access');

  const presSup = Engine.supportByState(g, targetState);
  assert.strictEqual(presSup.player, 0, `Presidential polling without pres ballot access in ${targetState.id} stays 0%`);

  const senSup = Engine.supportByState(g, targetState, { raceId: `senate:${targetState.id}` });
  assert(senSup.player > 0, `Senate polling in ${targetState.id} with Senate ballot access must be > 0% (got ${senSup.player})`);
  console.log(`PASS [1]: Green downballot polling in ${targetState.id} Senate = ${senSup.player.toFixed(2)}% (Pres without access = ${presSup.player}%)`);
}

// -----------------------------------------------------------------------------
// TEST 2: Recruited Green candidate certifies race ballot access & appears in Triage
// -----------------------------------------------------------------------------
{
  let g = Engine.createGame('green', { seed: 202812 });
  g.treasury = 25;
  g.actionsLeft = 10;
  g.organizingActionsRemaining = 10;

  // Pick an active Senate race where Green does NOT start with ballot access
  const activeSenate = g.activeSenateRaces || Engine.getActiveSenateRaces(g, g.year);
  const noAccessSen = activeSenate.find((r) => !Engine.hasBallotAccess(g, 'green', `senate:${r.state}`));
  assert(noAccessSen, 'Should find an active Senate race without starting Green ballot access');
  const raceId = `senate:${noAccessSen.state}`;

  // Recruit candidate for that race
  g = Engine.takeAction(g, 'encourage-state-recruit', { raceId, partyId: 'green' });
  assert.strictEqual(Engine.hasBallotAccess(g, 'green', raceId), true, `Recruiting into ${raceId} must certify downballot ballot access`);
  const rec = (g.recruitedCandidates || []).find((c) => c.raceId === raceId);
  assert(rec, 'Recruited candidate should be recorded');

  // Resolve primaries & initialize candidate funding (Triage)
  g = Engine.resolvePrimaries(g);
  const win = (g.primaryResults || []).find((r) => r.raceId === raceId && r.partyId === 'green');
  assert(win && win.winnerId === rec.id, `Recruited candidate ${rec.name} must win uncontested primary instead of vanishing`);

  const funded = Engine.initializeCandidateFunding(g);
  assert(funded.candidateFunding[raceId], `Recruited candidate ${rec.name} (${raceId}) must appear in Candidate Budget Triage`);
  assert.strictEqual(funded.candidateFunding[raceId].candidateName, rec.name, 'Triage entry must carry recruited candidate name');

  // Also verify downballot polling for that newly recruited race is now > 0%
  const stObj = STATES.find((s) => s.id === noAccessSen.state);
  const afterSup = Engine.supportByState(g, stObj, { raceId });
  assert(afterSup.player > 0, `Polling in newly recruited ${raceId} must be > 0% (got ${afterSup.player})`);

  console.log(`PASS [2]: Recruited Green candidate ${rec.name} (${raceId}) certified ballot access, survived primary, and appeared in Triage`);
}

// -----------------------------------------------------------------------------
// TEST 3: Spoiler penalty (Duverger defection) retains at least 1/3rd of voters
// -----------------------------------------------------------------------------
{
  const grn = Engine.createGame('green', { seed: 202813 });
  const con = Engine.createGame('constitution', { seed: 202814 });
  const lib = Engine.createGame('liberty', { seed: 202815 });

  const testCases = [
    { game: grn, party: 'green', state: 'PA', share: 0.6 },
    { game: grn, party: 'green', state: 'PA', share: 3.0 },
    { game: grn, party: 'green', state: 'PA', share: 9.0 },
    { game: grn, party: 'green', state: 'PA', share: 15.0 },
    { game: con, party: 'constitution', state: 'PA', share: 1.0 },
    { game: con, party: 'constitution', state: 'PA', share: 6.0 },
    { game: lib, party: 'liberty', state: 'PA', share: 2.0 },
    { game: lib, party: 'liberty', state: 'PA', share: 12.0 },
  ];

  testCases.forEach(({ game, party, state, share }) => {
    const res = Engine.computeStrategicVotingDefection(game, party, state, 'presidential', share);
    assert(
      res.defectionRate <= (2 / 3) + 0.0001,
      `Defection rate for ${party} @ ${share}% must be <= 66.67%, got ${(res.defectionRate * 100).toFixed(2)}%`
    );
    assert(
      res.retainedShare >= Math.round((share / 3) * 100) / 100 - 0.01,
      `Retained share for ${party} @ ${share}% must be >= 1/3 (${(share / 3).toFixed(2)}%), got ${res.retainedShare}%`
    );
  });

  console.log('PASS [3]: Spoiler penalty capped at 2/3 across all tiers (>= 1/3 voters always retained)');
}

console.log('ALL v0.18.4 MINOR PARTY POLLING, TRIAGE & SPOILER TESTS PASSED!');
