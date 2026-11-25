'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');
const sandbox = {
  console, Math, Date, JSON, Set, Map, Array, Object, Number, String, Boolean, RegExp, Error, TypeError,
  parseInt, parseFloat, isNaN, isFinite, Uint8Array, TextDecoder,
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
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'state-house-data-0.5.js',
  'voter-model-0.5.js', 'demographic-migration-data.js', 'demographics-0.9.js',
  'political-trends-system.js', 'political-texture-system.js', 'v07-scaffolding.js',
  'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js', 'party-systems-engine.js',
  'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js', 'election-drift.js',
  'election-night-engine.js', 'media-shocks-system.js', 'campaign-overhaul.js', 'campaign-events-system.js',
  'redistricting-ballot-system.js', 'coalition-politics-system.js', 'atlas-multiplayer-system.js',
  'leading-faction-system.js', 'faction-era-stability.js', 'v0185-playtest-fixes.js',
  'save-migrations.js', 'persistence-core.js', 'custom-party-core.js', 'faction-core.js',
  'procedural-faction-naming.js', 'faction-caucus-system.js', 'dynamic-faction-lifecycle.js',
  'identity-bloc-system.js', 'faction-caucus-ui.js', 'engine.js',
];
for (const file of loadOrder) {
  const fullPath = path.join(repoDir, file);
  if (fs.existsSync(fullPath)) vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx, { filename: file });
}

const E = sandbox.PartyChairEngine;
const BA = sandbox.BallotAccess || sandbox.PartyChairBallotAccess || sandbox.BallotAccessEngine;
const ENE = sandbox.ElectionNightEngine;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

// 1. 2028 History Maps button fix in app.js
test('Stage 1 #1: renderPriorCycleMapSvg uses MAPS.states (not nonexistent VERSION_03_MAP_DATA) & supports byState/DC', () => {
  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(!appSrc.includes('const stateRows = window.PartyChairData?.VERSION_03_MAP_DATA?.states || [];'), 'Broken VERSION_03_MAP_DATA line removed');
  assert(appSrc.includes('cycle?.presidential?.byState || cycle?.presidential?.states || cycle?.presidentialResults'), 'Supports byState/states/presidentialResults');
  assert(appSrc.includes('Number(window.__historyMapYear) === Number(cycle.year)'), 'Numeric comparison for history map year');
});

// 2. Auto Presidential Ballot Access from any held office
test('Stage 1 #2: Holding any office (State Leg, Minor Statewide, House, Senate, Gov) grants automatic Presidential ballot access', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  // Ensure WY is NOT on Green's presidential ballot initially
  if (g.ballotAccess?.green?.presidential) g.ballotAccess.green.presidential.WY = false;
  if (g.ballotAccess?.green) g.ballotAccess.green.WY = false;
  assert.strictEqual(E.hasBallotAccess(g, 'green', 'presidential:WY'), false, 'Green initially off WY presidential ballot');

  // Grant 1 State House seat in WY -> should automatically unlock presidential ballot access
  g.stateHouseSeatCounts.WY.green = 1;
  assert.strictEqual(E.partyHoldsAnyOfficeInState(g, 'green', 'WY'), true, 'Detected State House seat in WY');
  assert.strictEqual(E.hasBallotAccess(g, 'green', 'presidential:WY'), true, 'Auto presidential ballot access granted via State Leg seat');
  const prog = BA.getPresidentialBallotProgress(g, 'green');
  assert(prog.certified.includes('WY'), 'WY counted as certified in getPresidentialBallotProgress');
});

// 3. Block Presidential Ballot Access Petitions during Midterm Elections
test('Stage 1 #3: Presidential ballot access petitions are blocked during midterm cycles (year % 4 !== 0)', () => {
  const g = E.createGame({ templateId: 'green', seed: 2028 });
  g.year = 2030;
  g.treasury = 50;
  g.actionsLeft = 5;
  assert.strictEqual(BA.canLaunchPetitionDrive(g, 'WY', 'prudent', 'green'), false, 'canLaunchPetitionDrive returns false in 2030 midterm');
  const res = E.takeAction(g, 'launch-petition-drive', { stateId: 'WY' });
  assert(res.lastNote.toLowerCase().includes('midterm'), `Expected midterm block message, got: ${res.lastNote}`);
});

// 4. Election Night House map aggregates ALL districts (majority color, purple on split) + real margins
test('Stage 1 #4: Election Night House uses real district margins & aggregates full state delegation (purple if no majority)', () => {
  const g = E.createGame({ templateId: 'people', seed: 2028 });
  const timeline = ENE.buildElectionNightTimeline(g, {
    presidentialResults: {},
    representatives: [
      { districtId: 'NY-1', stateId: 'NY', partyId: 'heritage' },
      { districtId: 'NY-14', stateId: 'NY', partyId: 'people' },
      { districtId: 'MO-1', stateId: 'MO', partyId: 'people' },
    ],
  });
  const ny14 = timeline.races.find((r) => r.raceKind === 'house' && r.raceId === 'NY-14');
  assert(ny14, 'NY-14 present in Election Night timeline');
  assert(Math.abs(ny14.finalWinningMargin) > 10, `Expected real non-8pt margin for deep-blue NY-14, got ${ny14.finalWinningMargin}`);

  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes("if (activeTab === 'house') {"), 'Dedicated House aggregation branch in Election Night map');
  assert(appSrc.includes("const hasMajority = topSeats > (stateHouseRaces.length / 2);"), 'Checks strict majority of state districts');
  assert(appSrc.includes("fillColor = hasMajority ? getElectionPartyColor(topParty) : '#8654a4';"), 'Colors no-majority states purple');
});

// 5. DC's 3 Electoral Votes allocated & displayed on Election Night (538 EV parity)
test('Stage 1 #5: DC (3 EV) is always included in Election Night presidential timeline & scoreboard', () => {
  const g = E.createGame({ templateId: 'people', seed: 2028 });
  const pf = E.presidentialForecast(g);
  const timeline = ENE.buildElectionNightTimeline(g, {
    presidentialResults: pf.byState,
  });
  const dcRace = timeline.races.find((r) => r.raceKind === 'president' && r.stateId === 'DC');
  assert(dcRace, 'DC presidential race present in Election Night timeline');
  assert.strictEqual(dcRace.ev, 3, 'DC has exactly 3 EVs');
  const totalPresEv = timeline.races.filter((r) => r.raceKind === 'president').reduce((s, r) => s + Number(r.ev || 0), 0);
  assert.strictEqual(totalPresEv, 538, `Expected 538 total presidential EVs on Election Night, got ${totalPresEv}`);

  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes('data-desk-state="DC"'), 'DC callout circle rendered on Election Night Presidential map');
});

console.log(`\nALL ${passed}/5 STAGE 1 TESTS PASSED!`);
