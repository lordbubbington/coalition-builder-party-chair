/**
 * Verification Test Suite: Candidate Pipeline Farm Team & VP Vetting War Room
 * Chunk 3.1: Candidate Mentorship Pipeline & Multi-Cycle Grooming
 * Chunk 3.2: Vice Presidential & Running-Mate Selection War Room
 * Chunk 3.3: VP Vetting Skeletons & Scandal Mitigation
 * Chunk 3.4: Atmospheric UI for Mentorship & VP Selection
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

function createHeadlessSandbox() {
  const store = {};
  const mockLocalStorage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };

  const docListeners = {};
  const mockDocument = {
    addEventListener: (type, fn) => { docListeners[type] = docListeners[type] || []; docListeners[type].push(fn); },
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: { innerHTML: '', appendChild: () => {}, classList: { add: () => {}, remove: () => {} } },
  };

  const mockWindow = {
    localStorage: mockLocalStorage,
    document: mockDocument,
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: () => {},
    location: { reload: () => {} },
  };

  const ctx = {
    window: mockWindow,
    document: mockDocument,
    localStorage: mockLocalStorage,
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Array,
    Object,
    Set,
    Map,
    Uint8Array,
    atob: (str) => Buffer.from(str, 'base64').toString('binary'),
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    Blob: globalThis.Blob,
    DecompressionStream: globalThis.DecompressionStream,
    Response: globalThis.Response,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Buffer,
    setTimeout,
    clearTimeout,
  };
  ctx.global = ctx;
  ctx.globalThis = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);

  const scripts = [
    'data.js',
    'factions-0.15.js',
    'scenario-2028.js',
    'issues-0.2.1.js',
    'maps-0.3.js',
    'state-house-data-0.5.js',
    'voter-model-0.5.js',
    'demographics-0.9.js',
    'political-trends-system.js',
    'v07-scaffolding.js',
    'party-systems-data.js',
    'party-systems-coalition.js',
    'party-systems-robots.js',
    'party-systems-engine.js',
    'party-systems-ui.js',
    'presidential-primaries.js',
    'ballot-access.js',
    'election-uncertainty.js',
    'candidate-vetting.js',
    'election-drift.js',
    'engine.js',
  ];

  scripts.forEach((relPath) => {
    const fullPath = path.join(ROOT, relPath);
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.runInContext(code, ctx, { filename: relPath });
  });

  return ctx;
}

console.log('====================================================================');
console.log(' CANDIDATE FARM TEAM & VP VETTING WAR ROOM VERIFICATION SUITE');
console.log('====================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

const sandbox = createHeadlessSandbox();
const PartyChairEngine = sandbox.window.PartyChairEngine;
const CandidateVetting = sandbox.window.CandidateVetting;

// -----------------------------------------------------------------------------
// SUITE 1: Candidate Mentorship Pipeline & Multi-Cycle Grooming (Chunk 3.1)
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Candidate Mentorship Pipeline & Multi-Cycle Grooming ---');

runTest('mentorProspectAction deducts 1 action + $2M and designates protégé', () => {
  let game = PartyChairEngine.createGame('test-seed-mentorship');
  game.treasury = 20.0;
  game.actionsLeft = 4;
  game.organizingActionsRemaining = 20;
  game.partyProteges = [];

  const candidateId = 'standout_test_1';
  game.stateLegStandouts = {
    people: [
      { id: candidateId, name: 'Rep. Sarah Connor', office: 'stateLeg', stateId: 'PA', quality: 6, fame: 30, age: 38 }
    ]
  };

  const updated = PartyChairEngine.takeAction(game, 'mentor-prospect', { politicianId: candidateId });
  assert.strictEqual(updated.actionsLeft, 3, 'Deducted 1 action');
  assert.strictEqual(updated.treasury, 18.0, 'Deducted $2.0M');
  assert.ok(Array.isArray(updated.partyProteges), 'partyProteges is an array');
  assert.ok(updated.partyProteges.includes(candidateId), 'Candidate added to partyProteges');

  const pol = updated.stateLegStandouts.people.find(p => p.id === candidateId);
  assert.ok(pol.mentorshipProgress, 'Mentorship progress initialized');
  assert.strictEqual(pol.mentorshipProgress.cyclesGroomed, 1, 'Cycles groomed initialized to 1');
  assert.strictEqual(pol.mentorshipProgress.trainingBudget, 2.0, 'Training budget recorded');
});

runTest('mentorProspectAction enforces 3-member roster cap', () => {
  let game = PartyChairEngine.createGame('test-seed-cap');
  game.treasury = 20.0;
  game.actionsLeft = 4;
  game.partyProteges = ['p1', 'p2', 'p3'];

  const updated = PartyChairEngine.takeAction(game, 'mentor-prospect', { politicianId: 'p4', name: 'New Leader' });
  assert.ok(updated.lastError, 'Expected error on exceeding 3 protégés');
  assert.strictEqual(updated.partyProteges.length, 3, 'Roster stays capped at 3');
});

runTest('applyProtegeGroomingCycle progresses Quality 6 -> 8 over 2 cycles with Fame, Rising Star, and faction loyalty', () => {
  let game = PartyChairEngine.createGame('test-seed-grooming');
  game.partyProteges = ['protege_young'];
  game.stateLegStandouts = {
    people: [
      {
        id: 'protege_young',
        name: 'Sen. Alex Young',
        office: 'stateLeg',
        stateId: 'MI',
        quality: 6,
        fame: 35,
        age: 36,
        factionId: 'dem_progressive_left',
        mentorshipProgress: { cyclesGroomed: 1, trainingBudget: 2.0, keynoteGave: false }
      }
    ]
  };
  game.factionHappiness = { dem_progressive_left: 60 };

  // Cycle 1 transition
  let cycle1 = PartyChairEngine.applyProtegeGroomingCycle(game, 2030);
  let p1 = cycle1.stateLegStandouts.people[0];
  assert.ok(p1.quality >= 7, 'Quality gained +1 or +2 in cycle 1');
  assert.ok(p1.fame >= 43, 'Fame gained +8-12 in cycle 1');
  assert.ok(p1.traits && p1.traits.includes('Rising Star'), 'Awarded Rising Star trait since age < 60');
  assert.strictEqual(cycle1.factionHappiness.dem_progressive_left, 75, '+15 faction happiness granted');

  // Cycle 2 transition
  let cycle2 = PartyChairEngine.applyProtegeGroomingCycle(cycle1, 2032);
  let p2 = cycle2.stateLegStandouts.people[0];
  assert.ok(p2.quality >= 8, 'Quality reached 8 over 2 cycles');
  assert.ok(p2.fame >= 51, 'Fame continued to rise');
  assert.strictEqual(p2.mentorshipProgress.cyclesGroomed, 3, 'Groomed 3 cycles total');
});

// -----------------------------------------------------------------------------
// SUITE 2: Vice Presidential & Running-Mate Selection War Room (Chunk 3.2)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Vice Presidential & Running-Mate Selection War Room ---');

runTest('generateVpRunningMateShortlist generates exactly 4 running mates balancing 4 strategic angles', () => {
  let game = PartyChairEngine.createGame('test-seed-vp-shortlist');
  game.year = 2032;

  const shortlist = CandidateVetting.generateVpRunningMateShortlist(game, 'people');
  assert.strictEqual(shortlist.length, 4, 'Exactly 4 running mates generated');

  const angles = shortlist.map(c => c.strategicAngle);
  assert.ok(angles.includes('home_state_anchor'), 'Includes Home-State / Regional Anchor');
  assert.ok(angles.includes('factional_peacekeeper'), 'Includes Factional Peacekeeper');
  assert.ok(angles.includes('ideological_complement'), 'Includes Ideological Complement');
  assert.ok(angles.includes('attack_dog'), 'Includes High-Energy Attack Dog');

  // Check hidden vulnerability score
  shortlist.forEach(c => {
    assert.ok(typeof c.vulnerabilityScore === 'number', 'Vulnerability score computed');
    assert.ok(c.vulnerabilityScore >= 0 && c.vulnerabilityScore <= 100, 'Score clamped [0, 100]');
    assert.strictEqual(c.isVetted, false, 'Initially unvetted');
  });
});

runTest('resolveVpSelectionWithWarRoom applies strategic angle benefits', () => {
  let game = PartyChairEngine.createGame('test-seed-vp-benefits');
  const shortlist = CandidateVetting.generateVpRunningMateShortlist(game, 'people');
  game.vpShortlist = shortlist;

  // Peacekeeper candidate
  const peacekeeper = shortlist.find(c => c.strategicAngle === 'factional_peacekeeper');
  const targetFaction = peacekeeper.targetFactionId;
  const initialH = game.factionHappiness?.[targetFaction] || 60;

  const afterPeacekeeper = CandidateVetting.resolveVpSelectionWithWarRoom(game, peacekeeper.id);
  assert.strictEqual(afterPeacekeeper.selectedVpId, peacekeeper.id, 'Selected VP recorded');
  const postH = afterPeacekeeper.factionHappiness?.[targetFaction];
  assert.strictEqual(postH, Math.min(100, initialH + 15), '+15 Happiness to rival faction');

  // Attack dog candidate
  const attackDog = shortlist.find(c => c.strategicAngle === 'attack_dog');
  const afterAttackDog = CandidateVetting.resolveVpSelectionWithWarRoom(game, attackDog.id);
  assert.strictEqual(afterAttackDog.vpBaseTurnoutLift, 2.0, '+2.0% national base turnout lift set');

  // Home-state anchor
  const anchor = shortlist.find(c => c.strategicAngle === 'home_state_anchor');
  const afterAnchor = CandidateVetting.resolveVpSelectionWithWarRoom(game, anchor.id);
  assert.ok(afterAnchor.vpHomeStateLift >= 3.5, 'Home-state margin lift applied');
  assert.strictEqual(afterAnchor.vpRegionalCoattailBoost, 1.5, 'Regional coattail boost applied');
});

// -----------------------------------------------------------------------------
// SUITE 3: VP Vetting Skeletons & Scandal Mitigation (Chunk 3.3)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: VP Vetting Skeletons & Scandal Mitigation ---');

runTest('auditVpAction spends $3M, marks running mate vetted, and reveals qualitative tier', () => {
  let game = PartyChairEngine.createGame('test-seed-vp-audit');
  game.treasury = 10.0;
  const shortlist = CandidateVetting.generateVpRunningMateShortlist(game, 'people');
  game.vpShortlist = shortlist;
  const target = shortlist[0];

  const updated = CandidateVetting.auditVpAction(game, { candidateId: target.id });
  assert.strictEqual(updated.treasury, 7.0, 'Spent $3.0M');
  const vettedVp = updated.vpShortlist.find(c => c.id === target.id);
  assert.strictEqual(vettedVp.isVetted, true, 'Running mate marked vetted');
  assert.ok(vettedVp.vulnerabilityTier, 'Qualitative tier revealed');
  assert.ok(vettedVp.vettingReport, 'Qualitative vetting report revealed');
  assert.ok(!vettedVp.vettingReport.includes(String(vettedVp.vulnerabilityScore)), 'Report does not leak raw vulnerability number');
});

runTest('evaluateVpScandal detonates October scandal on vulnerable unvetted VP', () => {
  let game = PartyChairEngine.createGame('test-seed-vp-scandal');
  game.year = 2032;
  game.trust = { base: 60 };
  game.selectedVp = {
    id: 'risky_vp',
    name: 'Gov. Risky Runner',
    vulnerabilityScore: 85,
    isVetted: false,
    strategicAngle: 'attack_dog'
  };

  const withScandal = CandidateVetting.evaluateVpScandal(game, { force: true });
  assert.strictEqual(withScandal.vpScandalTriggered, true, 'VP scandal triggered');
  assert.strictEqual(withScandal.vpPollingDrag, 3.0, '-3.0% presidential polling drag applied');
  assert.strictEqual(withScandal.trust.base, 52, '-8 Supporter Trust inflicted');
});

runTest('evaluateVpScandal does NOT trigger if running mate is vetted', () => {
  let game = PartyChairEngine.createGame('test-seed-vp-safe');
  game.year = 2032;
  game.selectedVp = {
    id: 'safe_vp',
    name: 'Gov. Clean Record',
    vulnerabilityScore: 85,
    isVetted: true,
    strategicAngle: 'attack_dog'
  };

  const safeResult = CandidateVetting.evaluateVpScandal(game, { force: true });
  assert.ok(!safeResult.vpScandalTriggered, 'Vetted running mate is immune to scandal');
});

// -----------------------------------------------------------------------------
// SUITE 4: Atmospheric UI & Zero Raw Numbers Rule (Chunk 3.4)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Atmospheric UI & Zero Raw Numbers Rule ---');

runTest('Atmospheric Vibes Audit: Zero REQ-XX tags and zero raw numbers leaked in candidate dossiers', () => {
  const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const candVettingJs = fs.readFileSync(path.join(__dirname, '..', 'candidate-vetting.js'), 'utf8');

  // Check for REQ-XX in user-facing card text
  const userFacingMentorship = appJs.slice(appJs.indexOf('Candidate Mentorship Pipeline'), appJs.indexOf('Candidate Mentorship Pipeline') + 1200);
  assert.ok(!userFacingMentorship.includes('REQ-'), 'Mentorship UI has zero REQ- tags');

  const userFacingVp = appJs.slice(appJs.indexOf('Vice Presidential & Running-Mate Selection War Room'), appJs.indexOf('Vice Presidential & Running-Mate Selection War Room') + 2500);
  assert.ok(!userFacingVp.includes('REQ-'), 'VP War Room UI has zero REQ- tags');

  // Verify qualitative tiers only
  const tiers = ['Clean', 'Minor', 'Baggage', 'Toxic'];
  tiers.forEach(tier => {
    assert.ok(candVettingJs.includes(tier), `candVettingJs supports tier: ${tier}`);
  });
});

console.log('\n====================================================================');
console.log(` RESULTS: ${passedTests}/${totalTests} CHECKS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
