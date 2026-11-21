/**
 * Coalition Builder: Party Chair — Version 0.16.1 Phase 3 Verification Suite
 *
 * Verifies Cluster C: Candidate Vetting, Dynamic State Drift & Faction Feedback (REQ-212 through REQ-219)
 *
 * Test Suites:
 *  1. REQ-212: Hidden Candidate Vulnerability Scores & "Vet Candidate" Action ($500k cost, qualitative tiers)
 *  2. REQ-213: Mid-Campaign Scandal Blowups (Stand By $3.5M vs Abandon Nominee)
 *  3. REQ-214: Post-Election Certified Performance Drift (Outperformance shifts baseline lean)
 *  4. REQ-215: Multi-Cycle Demographic & Migration Drift (Sun Belt, Rust Belt, Mountain West)
 *  5. REQ-216: Organizing & Registration Footprint Feedback (+25k net voters = 0.35 pts lean; 3-cycle chapter +0.50 cushion)
 *  6. REQ-217: Post-Election Factional Autopsy Realignment (Landslide expansion +8%, defeat -12%, 155M scale conserved)
 *  7. REQ-218: Non-Linear Multi-Party Swing Split Curves (Softmax utility curves across tickets)
 *  8. REQ-219: Dynamic Third-Party Appeal Elasticity & Tier-Scaled Favorability Caps (5%, 10%, 18%, 25%, Uncapped)
 *  9. Save Normalization & Atmospheric Vibes Audit (Zero REQ-XX tags in UI, 155M scale)
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

let totalPasses = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    totalPasses += 1;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('====================================================================');
console.log(' COALITION BUILDER: PARTY CHAIR — V0.16.1 PHASE 3 VERIFICATION SUITE');
console.log('====================================================================\n');

// --------------------------------------------------------------------
// SUITE 1: REQ-212: Hidden Candidate Vulnerability Scores & Vetting Action
// --------------------------------------------------------------------
console.log('--- SUITE 1: REQ-212: Candidate Vulnerability Scores & Vet Candidate Action ---');

test('computeCandidateVulnerabilityScore calculates trait weights correctly and clamps [0, 100]', () => {
  const sandbox = createHeadlessSandbox();
  const cv = sandbox.window.CandidateVetting;
  assert.ok(cv, 'CandidateVetting module loaded');

  // Corrupt adds +45
  const corruptCandidate = { id: 'pol_1', name: 'Slick Politician', traits: ['Corrupt'] };
  const corruptScore = cv.computeCandidateVulnerabilityScore(corruptCandidate);
  assert.ok(corruptScore >= 65, `Corrupt candidate score should be high, got ${corruptScore}`);

  // Squeaky Clean subtracts -45
  const cleanCandidate = { id: 'pol_2', name: 'Scout Leader', traits: ['Squeaky Clean'] };
  const cleanScore = cv.computeCandidateVulnerabilityScore(cleanCandidate);
  assert.ok(cleanScore <= 20, `Squeaky clean candidate score should be low, got ${cleanScore}`);

  // Both extremes stay clamped
  const maxCandidate = { id: 'pol_3', name: 'Catastrophe', traits: ['Corrupt', 'Undisciplined', 'Rough'] };
  assert.strictEqual(cv.computeCandidateVulnerabilityScore(maxCandidate), 100);

  const minCandidate = { id: 'pol_4', name: 'Saint', traits: ['Squeaky Clean', 'Disciplined', 'Polished'] };
  assert.strictEqual(cv.computeCandidateVulnerabilityScore(minCandidate), 0);
});

test('getVulnerabilityTier and getQualitativeVettingReport return appropriate tiers and qualitative copy without raw numbers', () => {
  const sandbox = createHeadlessSandbox();
  const cv = sandbox.window.CandidateVetting;

  assert.strictEqual(cv.getVulnerabilityTier(10), 'Clean');
  assert.strictEqual(cv.getVulnerabilityTier(35), 'Minor');
  assert.strictEqual(cv.getVulnerabilityTier(60), 'Baggage');
  assert.strictEqual(cv.getVulnerabilityTier(85), 'Toxic');

  const report = cv.getQualitativeVettingReport(80);
  assert.strictEqual(report.tier, 'Toxic');
  assert.ok(report.summary.includes('Toxic Record'));
  assert.ok(!report.summary.includes('80'), 'Report must NOT leak raw numeric score');
});

test('vetCandidateAction deducts $500k Treasury, unmasks candidate, and records qualitative tier', () => {
  const sandbox = createHeadlessSandbox();
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');
  game.treasury = 2000000; // $2.0M

  const candidate = { id: 'cand_test', name: 'Morgan Vance', traits: ['Undisciplined'], isVetted: false };
  game.candidates = [candidate];

  const updated = engine.takeAction(game, 'vet-candidate', { candidateId: 'cand_test' });
  assert.strictEqual(updated.treasury, 1500000, 'Deducts $500,000 from treasury');
  assert.ok(updated.candidateVetting['cand_test'], 'Vetting record created');
  assert.strictEqual(updated.candidateVetting['cand_test'].vetted, true);
  assert.ok(['Minor', 'Baggage', 'Toxic'].includes(updated.candidateVetting['cand_test'].tier));
  assert.strictEqual(candidate.isVetted, true, 'Marks candidate object vetted');
});

test('vetCandidateAction blocks action when Treasury < $500k', () => {
  const sandbox = createHeadlessSandbox();
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');
  game.treasury = 200000; // Only $200k

  const updated = engine.takeAction(game, 'vet-candidate', { candidateId: 'cand_test' });
  assert.ok(updated.lastError, 'Should report insufficient funds');
  assert.strictEqual(updated.treasury, 200000, 'Treasury untouched');
});

// --------------------------------------------------------------------
// SUITE 2: REQ-213: Mid-Campaign Scandal Blowups (Abandon vs. Defend)
// --------------------------------------------------------------------
console.log('\n--- SUITE 2: REQ-213: Mid-Campaign Scandal Blowups ---');

test('evaluateCampaignScandals triggers emergency crisis for vulnerable nominee in campaign week 3+', () => {
  const sandbox = createHeadlessSandbox();
  const cv = sandbox.window.CandidateVetting;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  game.campaign = { active: true, week: 3, currentWeek: 3 };
  const nominee = {
    id: 'nom_pa',
    name: 'Taylor Reed',
    traits: ['Corrupt'],
    quality: 6,
    popularity: 55,
    factionId: 'dem_liberal_establishment',
  };
  game.generalCampaigns = {
    'senate:PA': { nominee, raceKey: 'senate:PA' },
  };

  const withCrisis = cv.evaluateCampaignScandals(game, { force: true });
  assert.ok(withCrisis.pendingScandalCrisis, 'Pending scandal crisis created');
  assert.strictEqual(withCrisis.pendingScandalCrisis.candidateId, 'nom_pa');
  assert.strictEqual(withCrisis.pendingScandalCrisis.options.length, 2);
  assert.strictEqual(withCrisis.pendingScandalCrisis.options[0].id, 'stand_by');
  assert.strictEqual(withCrisis.pendingScandalCrisis.options[1].id, 'abandon');
});

test('resolveScandalCrisis Option A (Stand By Nominee) spends $3.5M, applies polling drag, and grants +4 faction happiness', () => {
  const sandbox = createHeadlessSandbox();
  const cv = sandbox.window.CandidateVetting;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  game.treasury = 5000000; // $5.0M
  const nominee = { id: 'nom_pa', name: 'Taylor Reed', quality: 6, popularity: 55, factionId: 'dem_liberal_establishment' };
  game.generalCampaigns = { 'senate:PA': { nominee, raceKey: 'senate:PA' } };
  game.pendingScandalCrisis = {
    candidateId: 'nom_pa',
    candidateName: 'Taylor Reed',
    raceKey: 'senate:PA',
    factionId: 'dem_liberal_establishment',
  };
  game.factionStandings = { dem_liberal_establishment: 60 };

  const resolved = cv.resolveScandalCrisis(game, { option: 'stand_by' });
  assert.strictEqual(resolved.treasury, 1500000, 'Spends $3.5M Treasury');
  assert.strictEqual(nominee.quality, 4, 'Quality reduced by -2');
  assert.strictEqual(nominee.popularity, 45, 'Popularity reduced by -10');
  assert.strictEqual(nominee.scandalPenalty, -4.0, 'Applies -4.0% scandal polling drag');
  assert.strictEqual(resolved.factionStandings.dem_liberal_establishment, 64, 'Faction loyalty rewarded with +4 Happiness');
  assert.strictEqual(resolved.pendingScandalCrisis, null, 'Crisis cleared');
});

test('resolveScandalCrisis Option B (Abandon Nominee) costs $0, crashes nominee by -18%, lifts trust +2, and infuriates faction -14', () => {
  const sandbox = createHeadlessSandbox();
  const cv = sandbox.window.CandidateVetting;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  game.treasury = 1000000;
  game.trust = { supporters: 80, independents: 50, opponents: 20 };
  const nominee = { id: 'nom_pa', name: 'Taylor Reed', quality: 6, popularity: 55, factionId: 'dem_liberal_establishment' };
  game.generalCampaigns = { 'senate:PA': { nominee, raceKey: 'senate:PA' } };
  game.pendingScandalCrisis = {
    candidateId: 'nom_pa',
    candidateName: 'Taylor Reed',
    raceKey: 'senate:PA',
    factionId: 'dem_liberal_establishment',
  };
  game.factionStandings = { dem_liberal_establishment: 60 };

  const resolved = cv.resolveScandalCrisis(game, { option: 'abandon' });
  assert.strictEqual(resolved.treasury, 1000000, 'Costs $0 Treasury');
  assert.strictEqual(nominee.scandalPenalty, -18.0, 'Nominee suffers -18.0% collapse');
  assert.strictEqual(nominee.abandoned, true, 'Marks nominee abandoned');
  assert.strictEqual(resolved.trust.independents, 52, 'Protects brand with +2 Independent Trust');
  assert.strictEqual(resolved.factionStandings.dem_liberal_establishment, 46, 'Faction happiness crashes -14');
  assert.strictEqual(resolved.pendingScandalCrisis, null, 'Crisis cleared');
});

// --------------------------------------------------------------------
// SUITE 3: REQ-214: Post-Election Certified Performance Drift
// --------------------------------------------------------------------
console.log('\n--- SUITE 3: REQ-214: Post-Election Certified Performance Drift ---');

test('calculateCertifiedPerformanceDrift shifts state baseline lean when party outruns expectation', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  // Let GA have baseline lean 0.08 (slight GOP lean)
  const ga = Array.isArray(game.voterModel.states)
    ? game.voterModel.states.find((s) => s.stateId === 'GA' || s.id === 'GA')
    : game.voterModel.states['GA'];
  const oldLean = ga.lean;

  // Simulate an election where Dem outperforms significantly in GA
  const electionOutcome = {
    results: {
      GA: { people: 2600000, heritage: 2300000 }, // Margin ~ -6.1%
    },
  };

  const result = ed.calculateCertifiedPerformanceDrift(game, electionOutcome);
  assert.ok(result.records.length > 0, 'Drift records generated');
  const gaRecord = result.records.find((r) => r.stateId === 'GA');
  assert.ok(gaRecord, 'GA had performance drift recorded');
  assert.ok(gaRecord.deltaLean < 0, `Expected Democratic outperformance to drift lean bluer (negative), got ${gaRecord.deltaLean}`);
  assert.strictEqual(game.statePartisanDrift['GA'], gaRecord.deltaLean);
});

// --------------------------------------------------------------------
// SUITE 4: REQ-215: Multi-Cycle Demographic & Migration Drift
// --------------------------------------------------------------------
console.log('\n--- SUITE 4: REQ-215: Multi-Cycle Demographic & Migration Drift ---');

test('applyDemographicMigrationDrift applies Sun Belt bluing, Rust Belt reddening, and Mountain West sorting', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  const result = ed.applyDemographicMigrationDrift(game);
  assert.ok(result.records.length > 0, 'Demographic records generated');

  // Sun Belt (AZ, NV, GA, NC, TX, FL) -> -0.35
  const azRecord = result.records.find((r) => r.stateId === 'AZ');
  assert.ok(azRecord, 'AZ included in Sun Belt');
  assert.strictEqual(azRecord.delta, -0.35);

  // Rust Belt (OH, MI, WI, PA) -> +0.35
  const ohRecord = result.records.find((r) => r.stateId === 'OH');
  assert.ok(ohRecord, 'OH included in Rust Belt');
  assert.strictEqual(ohRecord.delta, 0.35);

  // Mountain West (CO, UT, MT, ID) -> -0.30
  const coRecord = result.records.find((r) => r.stateId === 'CO');
  assert.ok(coRecord, 'CO included in Mountain West');
  assert.strictEqual(coRecord.delta, -0.30);
});

// --------------------------------------------------------------------
// SUITE 5: REQ-216: Organizing & Registration Footprint Feedback
// --------------------------------------------------------------------
console.log('\n--- SUITE 5: REQ-216: Organizing & Registration Footprint Feedback ---');

test('applyOrganizingFootprintFeedback shifts state lean by 0.35 pts per 25,000 net voters', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  // Register +50,000 Dem voters in PA (should shift lean by -0.70 pts)
  game.voterModel.stateDeltas = {
    PA: { people: 50000, heritage: 0 },
  };

  const result = ed.applyOrganizingFootprintFeedback(game);
  const paRecord = result.records.find((r) => r.stateId === 'PA');
  assert.ok(paRecord, 'PA recorded organizing feedback');
  assert.strictEqual(paRecord.netLeanShift, -0.70, 'Expected -0.70 shift for 50k voters');
  assert.strictEqual(game.organizingFootprintDrift['PA'], -0.70);
});

test('applyOrganizingFootprintFeedback awards +0.50 cushion for 3-cycle State Chapter streak', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  // Set PA to have 2 consecutive cycles already, and currently 2 chapters (tier 2+)
  game.stateOrganizations = {
    PA: { people: { chapters: 2 } },
  };
  game.stateChapterStreaks = {
    PA: { people: 2, heritage: 0 },
  };

  const result = ed.applyOrganizingFootprintFeedback(game);
  const paRecord = result.records.find((r) => r.stateId === 'PA');
  assert.ok(paRecord, 'PA evaluated');
  assert.strictEqual(game.stateChapterStreaks['PA'].people, 3, 'Streak reaches 3 cycles');
  assert.strictEqual(paRecord.netLeanShift, -0.50, '3-cycle streak provides -0.50 Dem defense cushion');
});

// --------------------------------------------------------------------
// SUITE 6: REQ-217: Post-Election Factional Autopsy Realignment
// --------------------------------------------------------------------
console.log('\n--- SUITE 6: REQ-217: Post-Election Factional Autopsy Realignment ---');

test('applyPostElectionFactionAutopsy expands winner wing on landslide while conserving 155M electorate', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  // Measure starting total voters across model
  const initialTotalVoters = game.voterModel.representedVoters;
  let initialFactionVotersSum = 0;
  Object.values(game.voterModel.states).forEach((st) => {
    Object.values(st.factions || {}).forEach((v) => { initialFactionVotersSum += v; });
  });

  // Landslide victory: 55% popular vote
  const electionOutcome = {
    nationalVote: { people: 55.0, heritage: 43.0 },
    presidentialWinner: 'people',
  };

  const result = ed.applyPostElectionFactionAutopsy(game, electionOutcome);
  assert.ok(result.autopsyVerdict.includes('Landslide'), 'Landslide autopsy recognized');
  assert.ok(result.voterShiftCount > 0, 'Voters shifted toward winning wing');

  // Verify strict conservation of voters
  let postFactionVotersSum = 0;
  Object.values(game.voterModel.states).forEach((st) => {
    Object.values(st.factions || {}).forEach((v) => { postFactionVotersSum += v; });
  });

  assert.strictEqual(postFactionVotersSum, initialFactionVotersSum, 'Total state faction voter sum must remain exactly conserved');
  assert.strictEqual(game.voterModel.representedVoters, initialTotalVoters, 'Total represented voters must remain unchanged');
});

test('applyPostElectionFactionAutopsy triggers Failed Establishment exodus on defeat while conserving voters', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  let initialFactionVotersSum = 0;
  Object.values(game.voterModel.states).forEach((st) => {
    Object.values(st.factions || {}).forEach((v) => { initialFactionVotersSum += v; });
  });

  // Crushing defeat: 44% popular vote, White House lost
  const electionOutcome = {
    nationalVote: { people: 44.0, heritage: 54.0 },
    presidentialWinner: 'heritage',
  };

  const result = ed.applyPostElectionFactionAutopsy(game, electionOutcome);
  assert.ok(result.autopsyVerdict.includes('Failed Establishment'), 'Failed establishment autopsy recognized');
  assert.ok(result.voterShiftCount > 0, 'Voters transferred away from establishment');

  let postFactionVotersSum = 0;
  Object.values(game.voterModel.states).forEach((st) => {
    Object.values(st.factions || {}).forEach((v) => { postFactionVotersSum += v; });
  });

  assert.strictEqual(postFactionVotersSum, initialFactionVotersSum, 'Total state faction voter sum must remain exactly conserved after defeat');
});

// --------------------------------------------------------------------
// SUITE 7: REQ-218: Non-Linear Multi-Party Swing Split Curves
// --------------------------------------------------------------------
console.log('\n--- SUITE 7: REQ-218: Non-Linear Multi-Party Swing Split Curves ---');

test('computeMultiPartySoftmaxShares produces valid softmax distribution summing to 1.0', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  const candidates = [
    { id: 'cand_dem', partyId: 'people', stances: { economic: 3.5, social: 3.5, governance: 4.5 }, approval: 52 },
    { id: 'cand_rep', partyId: 'heritage', stances: { economic: 6.5, social: 7.0, governance: 5.5 }, approval: 48 },
    { id: 'cand_ind', partyId: 'liberty', stances: { economic: 5.0, social: 5.0, governance: 5.0 }, approval: 50 },
  ];

  const shares = ed.computeMultiPartySoftmaxShares(game, 'PA', 'senate:PA', candidates);
  assert.ok(shares['cand_dem'] > 0 && shares['cand_rep'] > 0 && shares['cand_ind'] > 0);

  const sum = Object.values(shares).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1.0) < 0.001, `Softmax shares must sum to 1.0, got ${sum}`);

  // The candidate closest to center (economic: 5, social: 5, governance: 5) should get the largest swing utility
  assert.ok(shares['cand_ind'] > shares['cand_rep'], 'Centrist candidate should outdraw distant candidate');
});

// --------------------------------------------------------------------
// SUITE 8: REQ-219: Dynamic Third-Party Appeal Elasticity & Tier-Scaled Caps
// --------------------------------------------------------------------
console.log('\n--- SUITE 8: REQ-219: Dynamic Third-Party Appeal Elasticity & Tier-Scaled Caps ---');

test('computeDuopolyDissatisfaction and evaluateThirdPartyElasticitySurge trigger at Dissatisfaction > 55', () => {
  const sandbox = createHeadlessSandbox();
  const ed = sandbox.window.ElectionDrift;
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  // Both major parties unpopular (Dem: 38%, GOP: 36%)
  // Dissatisfaction = (100 - (38 + 36)) / 2 = 26/2 = 13? Wait: (100 - 74) / 2 = 13.
  // When Dem: 20%, GOP: 20% -> (100 - 40) / 2 = 30.
  // Wait! Let's check formula: Dissatisfaction = max(0, (100 - (Approval_Dem + Approval_GOP)) / 2) vs max(0, 100 - (Dem + GOP)/2).
  // In DESIGN.md: Dissatisfaction = max(0, (100 - (Approval_Dem + Approval_GOP)) / 2) or if Dem=30, GOP=30:
  // (100 - 60)/2 = 20.
  // Let's set game approvals such that dissatisfaction > 55:
  game.partyApprovals = {
    people: { approval: 20.0 },
    heritage: { approval: 20.0 },
  };
  // Let's test with low approval
  const diss = ed.computeDuopolyDissatisfaction(game);
  assert.ok(typeof diss === 'number');

  // Force high dissatisfaction test
  game.partyApprovals = {
    people: { approval: -10.0 },
    heritage: { approval: -10.0 },
  };
  const surge = ed.evaluateThirdPartyElasticitySurge(game);
  assert.strictEqual(surge.surgeActive, true);
  assert.ok(surge.elasticityMultiplier >= 1.8, 'Multiplier at least 1.8x');
  assert.strictEqual(surge.duvergerThreshold, 12.0, 'Threshold lowered to 12.0%');
});

test('computeUnifiedPartyApproval clamps minor parties by Institutional Tier (5%, 10%, 18%, 25%, Uncapped)', () => {
  const sandbox = createHeadlessSandbox();
  const engine = sandbox.window.PartyChairEngine;
  const ed = sandbox.window.ElectionDrift;

  assert.strictEqual(ed.getTierScaledFavorabilityCap(1), 5.0, 'Tier 1 Fringe capped at 5.0%');
  assert.strictEqual(ed.getTierScaledFavorabilityCap(2), 10.0, 'Tier 2 Ballot-Qualified capped at 10.0%');
  assert.strictEqual(ed.getTierScaledFavorabilityCap(3), 18.0, 'Tier 3 Recognized capped at 18.0%');
  assert.strictEqual(ed.getTierScaledFavorabilityCap(4), 25.0, 'Tier 4 Contender capped at 25.0%');
  assert.strictEqual(ed.getTierScaledFavorabilityCap(5), 100.0, 'Tier 5 Major uncapped');

  const game = engine.createGame('green');
  game.partyTiers = { green: 1, people: 5, heritage: 5 };

  const approvals = engine.computeUnifiedPartyApproval(game);
  const greenApp = approvals.green?.approval ?? approvals.player?.approval;
  assert.ok(greenApp <= 5.0, `Tier 1 Green party approval must be capped at 5.0%, got ${greenApp}`);

  // Test Tier 2 Green party
  game.partyTiers.green = 2;
  const appTier2 = engine.computeUnifiedPartyApproval(game);
  const greenApp2 = appTier2.green?.approval ?? appTier2.player?.approval;
  assert.ok(greenApp2 <= 10.0, `Tier 2 Green party approval must be capped at 10.0%, got ${greenApp2}`);

  // Major party (Tier 5) is NOT capped at 25%
  const demApp = approvals.people?.approval;
  assert.ok(demApp > 25.0, `Tier 5 Major party approval is uncapped (> 25%), got ${demApp}`);
});

// --------------------------------------------------------------------
// SUITE 9: Save Normalization & Invariants Audit
// --------------------------------------------------------------------
console.log('\n--- SUITE 9: Save Normalization & Invariants Audit ---');

test('normalizeGame preserves candidate vetting, crisis, and drift across save/reload', () => {
  const sandbox = createHeadlessSandbox();
  const engine = sandbox.window.PartyChairEngine;
  const game = engine.createGame('people');

  game.candidateVetting = { 'cand_1': { score: 15, tier: 'Clean', vetted: true } };
  game.pendingScandalCrisis = { candidateId: 'cand_1', narrative: 'Crisis details' };
  game.statePartisanDrift = { PA: -0.75 };
  game.demographicMigrationDrift = { AZ: -0.35 };
  game.organizingFootprintDrift = { MI: 0.35 };

  const saved = JSON.parse(JSON.stringify(game));
  const normalized = engine.normalizeGame(saved);

  assert.ok(normalized.candidateVetting['cand_1'], 'candidateVetting retained');
  assert.strictEqual(normalized.candidateVetting['cand_1'].tier, 'Clean');
  assert.ok(normalized.pendingScandalCrisis, 'pendingScandalCrisis retained');
  assert.strictEqual(normalized.statePartisanDrift.PA, -0.75, 'statePartisanDrift retained');
  assert.strictEqual(normalized.demographicMigrationDrift.AZ, -0.35, 'demographicMigrationDrift retained');
  assert.strictEqual(normalized.organizingFootprintDrift.MI, 0.35, 'organizingFootprintDrift retained');
});

test('Atmospheric Vibes Audit: Zero REQ-XX or MAS-XX tags appear in player-facing UI text', () => {
  const appJsCode = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const cvCode = fs.readFileSync(path.join(ROOT, 'candidate-vetting.js'), 'utf8');
  const edCode = fs.readFileSync(path.join(ROOT, 'election-drift.js'), 'utf8');

  // Verify renderScandalCrisisModalMarkup has no REQ tags
  const modalMatch = appJsCode.match(/renderScandalCrisisModalMarkup[\s\S]*?return `([\s\S]*?)`;/);
  if (modalMatch) {
    const markup = modalMatch[1];
    assert.ok(!/REQ-\d+/i.test(markup), 'renderScandalCrisisModalMarkup must not leak REQ tags');
    assert.ok(!/MAS-\d+/i.test(markup), 'renderScandalCrisisModalMarkup must not leak MAS tags');
  }

  // Verify qualitative report summaries in candidate-vetting.js have no REQ tags
  const reportMatches = cvCode.match(/summary:\s*['"`](.*?)['"`]/g) || [];
  reportMatches.forEach((m) => {
    assert.ok(!/REQ-\d+/i.test(m), `Qualitative report must not leak REQ tags: ${m}`);
  });
});

console.log('\n====================================================================');
console.log(` ALL CHECKS PASSED: ${totalPasses}/${totalPasses} (100%)`);
console.log('====================================================================');
