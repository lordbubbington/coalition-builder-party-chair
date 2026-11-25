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
  'identity-bloc-system.js', 'faction-caucus-ui.js', 'off-cycle-interlude.js', 'engine.js',
];
for (const file of loadOrder) {
  const fullPath = path.join(repoDir, file);
  if (fs.existsSync(fullPath)) vm.runInContext(fs.readFileSync(fullPath, 'utf8'), ctx, { filename: file });
}

const E = sandbox.PartyChairEngine;
const OC = sandbox.OffCycleInterludeSystem;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS [${passed}]: ${name}`);
}

// 1. Off-Cycle Interlude includes Unhappy Caucus Member Courting & Faction Recruitment tab/panel
test('Stage 3 #1: Off-Cycle Interlude renders Unhappy Caucus Courting & Faction Recruitment panel', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.phase = 'complete';
  g = OC.initializeOffCycleInterlude(g, 2029);
  assert.strictEqual(g.phase, 'off-cycle-interlude', 'Entered off-cycle-interlude phase');
  const html = OC.renderScreen(g);
  assert(html.includes('oc-court-politician'), 'Off-Cycle screen renders Court Unhappy Caucus Member action');
  assert(html.includes('oc-faction-recruitment') || html.includes('Faction Recruitment'), 'Off-Cycle screen renders Faction Recruitment section');
  assert(html.includes('oc-court-independent'), 'Off-Cycle screen renders Court Independent Faction button');
});

// 2. Off-Cycle Court Politician works in off-cycle-interlude phase & injects into primaryFields
test('Stage 3 #2: Off-Cycle Court Politician recruits discontent lawmaker and injects into primaryFields', () => {
  let g = E.createGame({ templateId: 'people', seed: 2028 });
  g.treasury = 25;
  g.phase = 'complete';
  g = OC.initializeOffCycleInterlude(g, 2029);
  const target = g.sittingMembers.find((m) => m.office === 'house' && m.party !== 'people');
  assert(target, 'Found target House lawmaker');
  target.happiness = 20;
  const demF = g.factions.find((f) => f.partyId === 'people' && f.type !== 'racial');
  target.factionId = demF.id;

  const after = OC.handleAction(g, 'oc-court-politician', { memberId: target.id });
  const updatedMember = after.sittingMembers.find((m) => m.id === target.id);
  assert.strictEqual(updatedMember.party, 'people', 'Lawmaker switched to player party in Off-Cycle Interlude');
  const raceKey = `house:${target.districtId || target.district}`;
  assert(after.primaryFields?.[raceKey]?.people?.some((c) => c.name === target.name), 'Lawmaker injected into primaryFields for upcoming election');
});

// 3. Off-Cycle Faction Recruitment (Court Independent Faction) works for Tier 2+ and blocks Tier 0-1
test('Stage 3 #3: Off-Cycle Faction Recruitment works for Tier 2+ and blocks Tier 0-1', () => {
  let g = E.createGame({ templateId: 'green', seed: 2028 });
  g.treasury = 25;
  g.phase = 'complete';
  g = OC.initializeOffCycleInterlude(g, 2029);
  const indF = g.factions.find((f) => f.partyId === 'independent');
  assert(indF, 'Found independent faction');

  // Tier 1 blocked
  g.partyTiers.green = 1;
  const blocked = OC.handleAction(g, 'oc-court-independent', { factionId: indF.id });
  assert(blocked.lastNote.includes('Tier 2'), `Expected Tier 2 block, got: ${blocked.lastNote}`);

  // Tier 2 allowed
  g.partyTiers.green = 2;
  const ok = OC.handleAction(g, 'oc-court-independent', { factionId: indF.id });
  assert((ok.factionCourtship?.[indF.id]?.green || 0) >= 15, 'Off-Cycle Court Independent increased goodwill >= 15');
});

// 4. Step 1 is now Party Leaders + Rules & Bylaws Committee; Party Platform moved to Party Information tab
test('Stage 3 #4: Step 1 renders Party Leaders + Rules & Bylaws; Party Platform moved to Party Information tab', () => {
  const appSrc = fs.readFileSync(path.join(repoDir, 'app.js'), 'utf8');
  assert(appSrc.includes("label: 'Party Leaders & Rules/Bylaws'"), 'Step 1 label updated to Party Leaders & Rules/Bylaws');
  assert(appSrc.includes('if (step === 1) bodyMarkup = step1LeadershipAndBylawsMarkup();'), 'Step 1 renders step1LeadershipAndBylawsMarkup()');
  assert(appSrc.includes('function step1LeadershipAndBylawsMarkup()'), 'step1LeadershipAndBylawsMarkup() defined');
  const piStart = appSrc.indexOf('function partyInfoTabMarkup()');
  const piSlice = appSrc.slice(piStart, piStart + 15000);
  assert(piSlice.includes('step1IssuesMarkup()'), 'Party Information tab now hosts Party Platform (step1IssuesMarkup)');
});

console.log(`\nALL ${passed}/4 STAGE 3 TESTS PASSED!`);
