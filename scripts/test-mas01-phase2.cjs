/**
 * Coalition Builder: Party Chair — MAS-01 Phase 2 Verification Suite
 * Verifies all 16 Standard Modifier & Political Realignment Eras:
 *   Group A: #1 (Anti-Extremist Coalition)
 *   Group B: #4 (Landslide Realignment), #5 (Independent Surge)
 *   Group C: #6 (Left-Wing Replacement), #7 (Right-Wing Replacement), #8 (Ideologies Cool)
 *   Group D: #9 (5th Great Awakening), #11 (Generational Succession Crisis),
 *            #12 (Digital Syndicate), #13 (Green Transition Crucible),
 *            #14 (Tripartite Corporatist Compact), #15 (The AI Boom),
 *            #19 (Charismatic Movement Era), #20 (Permanent Emergency Cycle),
 *            #21 (Metro League vs. Heartland Compact), #26 (Post-Citizens United Era)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

const mockAppEl = {
  innerHTML: '',
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  classList: { toggle: () => {}, add: () => {}, remove: () => {} },
};

const sandbox = {
  window: {},
  document: {
    getElementById: (id) => (id === 'app' ? mockAppEl : null),
    querySelector: (sel) => (sel === '#app' ? mockAppEl : null),
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: { classList: { toggle: () => {}, add: () => {}, remove: () => {} } },
  },
  console,
  Math,
  JSON,
  Number,
  Object,
  Array,
  String,
  Infinity,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Date,
  Set,
  Map,
  Uint8Array,
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  localStorage: mockLocalStorage,
  addEventListener: () => {},
  removeEventListener: () => {},
  setTimeout: () => 0,
  clearTimeout: () => {},
  requestAnimationFrame: () => 0,
  require,
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  vm.runInContext(code, ctx, { filename: relPath });
}

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
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'engine.js',
  'app.js',
].forEach(loadScript);

const Engine = sandbox.window.PartyChairEngine;
const PSData = sandbox.window.PartySystemsData;
const PSEngine = sandbox.window.PartySystemsEngine;
const PSUI = sandbox.window.PartySystemsUI;

async function main() {
  if (sandbox.window.PartyChairData?.VERSION_03_MAPS_READY) {
    await sandbox.window.PartyChairData.VERSION_03_MAPS_READY;
  }
  await new Promise((resolve) => globalThis.setTimeout(resolve, 25));
  const AppTest = sandbox.window.PartyChairApp || null;

const PHASE2_IDS = [
  'era_01_anti_extremist',
  'era_04_landslide_realignment',
  'era_05_independent_surge',
  'era_06_left_replacement',
  'era_07_right_replacement',
  'era_08_ideologies_cool',
  'era_09_great_awakening',
  'era_11_generational_succession',
  'era_12_digital_syndicate',
  'era_13_green_transition',
  'era_14_tripartite_corporatist',
  'era_15_ai_boom',
  'era_19_charismatic_movement',
  'era_20_permanent_emergency',
  'era_21_metro_vs_heartland',
  'era_26_post_citizens_united',
];

let passed = 0;
let total = 0;
function assert(cond, msg) {
  total += 1;
  if (!cond) {
    console.error(`  ❌ FAIL: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
  passed += 1;
  console.log(`  ✅ PASS: ${msg}`);
}

console.log('================================================================');
console.log(' MAS-01 PHASE 2: 16 STANDARD MODIFIER & REALIGNMENT ERAS SUITE');
console.log('================================================================');

// ------------------------------------------------------------------
// SUITE 1: Catalog, Issue Swaps & 41-Issue Invariant Across All 16 Eras
// ------------------------------------------------------------------
console.log('\n--- SUITE 1: Catalog & 41-Issue Swap Integrity (16 Eras) ---');
{
  assert(PHASE2_IDS.length === 16, 'Exactly 16 Phase 2 eras under test');
  const baselineSet = new Set(PSData.BASELINE_ACTIVE_ISSUE_IDS);
  let totalPhase2Swaps = 0;

  PHASE2_IDS.forEach((eraId) => {
    const meta = PSData.ALL_ERAS_BY_ID[eraId];
    assert(Boolean(meta), `Era metadata present: ${eraId}`);
    assert(Boolean(meta.dossier?.campaignAdvisory), `Qualitative campaignAdvisory present for ${eraId}`);
    const swaps = meta.issueSwaps || [];
    assert(swaps.length >= 5, `${eraId} defines >= 5 paired issue swaps (got ${swaps.length})`);
    totalPhase2Swaps += swaps.length;

    swaps.forEach((sw) => {
      assert(baselineSet.has(sw.retireId), `${eraId} retireId '${sw.retireId}' is in baseline 41 issues`);
      assert(Boolean(sw.add?.id && sw.add?.label && sw.add?.category && sw.add?.pillarId), `${eraId} issue '${sw.add?.id}' has valid metadata`);
      const stanceKeys = Object.keys(sw.add?.stances || {});
      assert(stanceKeys.length === 10, `${eraId} issue '${sw.add?.id}' defines all 10 stances`);
    });

    // Execute live transition from Era 7 -> Era 8 and verify 41-issue invariant
    const g0 = Engine.createGame({ baseTemplateId: 'people' });
    const g1 = PSEngine.transitionToPartySystem(g0, meta, 2040);
    const active = PSEngine.getActiveIssuesForGame(g1);
    assert(active.length === 41, `${eraId}: active platform strictly clamped to 41 issues`);
    assert(g1.partySystems.eraExclusiveIssuesActive.length === swaps.length, `${eraId}: exactly ${swaps.length} era-exclusive issues active`);
    assert(g1.partySystems.sunsettedIssueIds.length === swaps.length, `${eraId}: exactly ${swaps.length} baseline issues retired`);
  });

  assert(totalPhase2Swaps === 95, `Total Phase 2 era-exclusive issues verified (${totalPhase2Swaps})`);
}

// ------------------------------------------------------------------
// SUITE 2: Trigger Evaluations (Groups A, B, C, D)
// ------------------------------------------------------------------
console.log('\n--- SUITE 2: Trigger Evaluation & Weights (Groups A, B, C, D) ---');
{
  const baseGame = Engine.createGame({ baseTemplateId: 'people' });

  // #1 Anti-Extremist Coalition (Weight = 3)
  const modGame = { ...baseGame, winningPresidentAvgStance: 5.2 };
  const extRightGame = { ...baseGame, winningPresidentAvgStance: 9.2 };
  const extLeftGame = { ...baseGame, winningPresidentAvgStance: 1.8 };
  assert(!PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_01_anti_extremist, modGame, 2040), '#1 negative: moderate president (5.2) does NOT trigger');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_01_anti_extremist, extRightGame, 2040), '#1 positive: far-right president (9.2) triggers');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_01_anti_extremist, extLeftGame, 2040), '#1 positive: far-left president (1.8) triggers');
  const pool1 = PSEngine.getEligiblePartySystems(extRightGame, 2040).find((e) => e.era.id === 'era_01_anti_extremist');
  assert(pool1 && pool1.weight === 3, '#1 carries Weight = 3 when triggered');

  // #4 Landslide Realignment (Weight = 3): >=20% margin OR >=40 trifectas
  const closeGame = { ...baseGame, lastElection: { nationalVote: { people: 52, heritage: 46 } } };
  const popLandslide = { ...baseGame, lastElection: { nationalVote: { people: 61, heritage: 37 } } };
  const trifectaGovs = {};
  const trifectaLegs = {};
  sandbox.window.PartyChairData.STATES.slice(0, 41).forEach((s) => {
    trifectaGovs[s.id] = 'people';
    trifectaLegs[s.id] = ['people', 'people'];
  });
  const trifectaLandslide = { ...closeGame, governorships: trifectaGovs, stateLegislatures: trifectaLegs };
  assert(!PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_04_landslide_realignment, closeGame, 2040), '#4 negative: close election does NOT trigger');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_04_landslide_realignment, popLandslide, 2040), '#4 positive: >=20% popular vote margin triggers');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_04_landslide_realignment, trifectaLandslide, 2040), '#4 positive: >=40 state trifectas triggers');

  // #5 Independent Surge (Weight = 3)
  assert(!PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_05_independent_surge, baseGame, 2040), '#5 negative: major-party president does NOT trigger');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_05_independent_surge, { ...baseGame, governingParty: 'independent' }, 2040), '#5 positive: Independent President triggers');

  // #6 Left-Wing Replacement (Weight = 3)
  const greenGame = Engine.createGame({ baseTemplateId: 'green' });
  Object.keys(greenGame.issuePositions).forEach((k) => { greenGame.issuePositions[k] = 2; });
  const noDemSitting = (greenGame.sittingMembers || []).map((m) => (m.party === 'people' ? { ...m, party: 'green', caucus: 'green' } : m));
  const leftRepTriggered = { ...greenGame, governingParty: 'green', sittingMembers: noDemSitting };
  assert(!PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_06_left_replacement, { ...leftRepTriggered, governingParty: 'people' }, 2040), '#6 negative: Democrats holding White House blocks trigger');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_06_left_replacement, leftRepTriggered, 2040), '#6 positive: Green (stance <= 3.0) wins WH while Democrats hold neither');

  // #7 Right-Wing Replacement (Weight = 3)
  const libGame = Engine.createGame({ baseTemplateId: 'liberty' });
  Object.keys(libGame.issuePositions).forEach((k) => { libGame.issuePositions[k] = 8; });
  const noRepSitting = (libGame.sittingMembers || []).map((m) => (m.party === 'heritage' ? { ...m, party: 'liberty', caucus: 'liberty' } : m));
  const rightRepTriggered = { ...libGame, governingParty: 'liberty', sittingMembers: noRepSitting };
  assert(!PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_07_right_replacement, { ...rightRepTriggered, governingParty: 'heritage' }, 2040), '#7 negative: Republicans holding White House blocks trigger');
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_07_right_replacement, rightRepTriggered, 2040), '#7 positive: Liberty (stance >= 7.0) wins WH while Republicans hold neither');

  // #8 Ideologies Cool (Weight = 3)
  const polarizedDem = Engine.createGame({ baseTemplateId: 'people' });
  Object.keys(polarizedDem.issuePositions).forEach((k) => { polarizedDem.issuePositions[k] = 3; });
  assert(!PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_08_ideologies_cool, polarizedDem, 2040), '#8 negative: polarized Democrat does NOT trigger');
  const centristDem = { ...polarizedDem, issuePositions: { ...polarizedDem.issuePositions, 'taxes-spending': 7, 'wages': 6, 'immigration-border': 7, 'energy-mix': 6 } };
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_08_ideologies_cool, centristDem, 2040), '#8 positive: Dem with 4+ stances >= 6.0 triggers');
  const centristRep = Engine.createGame({ baseTemplateId: 'heritage' });
  Object.keys(centristRep.issuePositions).forEach((k) => { centristRep.issuePositions[k] = 8; });
  centristRep.issuePositions['taxes-spending'] = 4;
  centristRep.issuePositions['wages'] = 3;
  centristRep.issuePositions['climate-action'] = 4;
  centristRep.issuePositions['health-coverage'] = 3;
  assert(PSEngine.evaluateEraTrigger(PSData.ALL_ERAS_BY_ID.era_08_ideologies_cool, centristRep, 2040), '#8 positive: Rep with 4+ stances <= 4.0 triggers');

  // Group D Normal Eras (Weight = 1)
  const eligible2040 = PSEngine.getEligiblePartySystems(baseGame, 2040);
  ['era_09_great_awakening', 'era_11_generational_succession', 'era_12_digital_syndicate', 'era_13_green_transition', 'era_14_tripartite_corporatist', 'era_15_ai_boom', 'era_19_charismatic_movement', 'era_20_permanent_emergency', 'era_21_metro_vs_heartland', 'era_26_post_citizens_united'].forEach((id) => {
    const entry = eligible2040.find((c) => c.era.id === id);
    assert(entry && entry.weight === 1, `Group D era ${id} eligible at Weight = 1`);
  });
}

// ------------------------------------------------------------------
// SUITE 3: Simulation Modifiers & Engine Integration (All 16 Eras)
// ------------------------------------------------------------------
console.log('\n--- SUITE 3: Simulation Modifiers & Engine Integration ---');

// Era #1: Anti-Extremist Coalition
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g1 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_01_anti_extremist, 2040);
  const moderateCand = { id: 'c_mod', name: 'Moderate', avgStance: 5.0, partyId: 'people' };
  const extremistOpp = { id: 'c_ext', name: 'Extremist', avgStance: 9.3, partyId: 'heritage' };
  assert(PSEngine.getCandidateMarginModifier(g1, moderateCand, 'PA', { opponent: extremistOpp }) === 4.0, '#1: +4.0% cross-party endorsement boost vs extremist opponent');
  assert(PSEngine.getCandidateMarginModifier(g1, extremistOpp, 'PA', { opponent: moderateCand }) === 0, '#1: extremist candidate does NOT receive cross-endorsement boost');
  assert(PSEngine.getIndependentDefectionBonus(g1) === 0.25, '#1: +25% independent caucus defection bonus active');
}

// Era #4: Landslide Realignment Era
{
  const g0 = Engine.createGame({ baseTemplateId: 'heritage' });
  g0.governingParty = 'people'; // Player (GOP) is in opposition to landslide Dem winner
  const oppFaction = g0.factions.find((f) => f.partyId === 'heritage');
  const beforeStand = g0.factionStandings[oppFaction.id] ?? 60;
  g0.factionStandings[oppFaction.id] = beforeStand;
  const g4 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_04_landslide_realignment, 2040);
  assert(PSEngine.getWaveVolatilityMultiplier(g4) === 1.8, '#4: 1.8x wave volatility multiplier active');
  assert(PSEngine.dispatchEraHook(g4, 'getTurnoutModifier', 'people') === 6.0, '#4: +6.0% winner turnout surge');
  assert(PSEngine.dispatchEraHook(g4, 'getTurnoutModifier', 'heritage') === 0, '#4: 0% turnout surge for opposition');
  assert(g4.factionStandings[oppFaction.id] === Math.max(0, beforeStand - 15), `#4: opposition faction suffers -15 happiness (${beforeStand} -> ${g4.factionStandings[oppFaction.id]})`);
}

// Era #5: Independent Surge Era
{
  const g0 = Engine.createGame({ baseTemplateId: 'green' });
  const g5 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_05_independent_surge, 2040);
  const downballot = PSEngine.getDownballotIndependentField(g5);
  const totalDownballot = Object.keys(downballot).length;
  const totalCatalog = (sandbox.window.PartyChairData.VERSION_01_HOUSE_DISTRICTS?.length || 435) + (g5.activeSenateRaces?.length || 33);
  const ratio = totalDownballot / Math.max(1, totalCatalog);
  assert(ratio >= 0.35 && ratio <= 0.65, `#5: serious Independent candidates spawn in ~50% of House & Senate races (${totalDownballot}/${totalCatalog} = ${(ratio * 100).toFixed(1)}%)`);
  const defRes = Engine.computeStrategicVotingDefection(g5, 'independent', 'PA', 'presidential', 8.0);
  assert(defRes.defectionRate === 0 && defRes.bypassed === true, '#5: wasted-vote strategic defection collapsed to 0%');
}

// Era #6: Left-Wing Replacement
{
  const g0 = Engine.createGame({ baseTemplateId: 'green' });
  Object.keys(g0.issuePositions).forEach((k) => { g0.issuePositions[k] = 2; });
  g0.governingParty = 'green';
  g0.sittingMembers = (g0.sittingMembers || []).map((m) => (m.party === 'people' ? { ...m, party: 'green', caucus: 'green' } : m));
  const g6 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_06_left_replacement, 2040);
  assert(Engine.getPartyInstitutionalTier(g6, 'people') === 2, '#6: Democrats permanently demoted to Tier 2 minor party');
  assert(Engine.getPartyInstitutionalTier(g6, 'green') === 5, '#6: Progressive insurgent permanently promoted to Tier 5 Major Party');
  assert(g6.identityCrisis?.institutionalDonorsUnlocked === true, '#6: Insurgent inherits institutional donor conduits');
}

// Era #7: Right-Wing Replacement
{
  const g0 = Engine.createGame({ baseTemplateId: 'liberty' });
  Object.keys(g0.issuePositions).forEach((k) => { g0.issuePositions[k] = 8; });
  g0.governingParty = 'liberty';
  g0.sittingMembers = (g0.sittingMembers || []).map((m) => (m.party === 'heritage' ? { ...m, party: 'liberty', caucus: 'liberty' } : m));
  const g7 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_07_right_replacement, 2040);
  assert(Engine.getPartyInstitutionalTier(g7, 'heritage') === 2, '#7: Republicans permanently demoted to Tier 2 minor party');
  assert(Engine.getPartyInstitutionalTier(g7, 'liberty') === 5, '#7: Conservative insurgent permanently promoted to Tier 5 Major Party');
}

// Era #8: Ideologies Cool
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g8 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_08_ideologies_cool, 2040);
  assert(PSEngine.dispatchEraHook(g8, 'getTurnoutModifier', 'people') === -8.0, '#8: base turnout drops by -8.0%');
  assert(PSEngine.getIndependentElasticityMultiplier(g8) === 1.5, '#8: suburban independent elasticity surges (1.5x)');
  const extCand = { id: 'e1', name: 'Hardliner', avgStance: 9.0 };
  const modCand = { id: 'm1', name: 'Centrist', avgStance: 5.5 };
  assert(PSEngine.getCandidateMarginModifier(g8, extCand, 'PA') === -5.0, '#8: extremist candidate suffers -5.0% general penalty');
  assert(PSEngine.getCandidateMarginModifier(g8, modCand, 'PA') === 0, '#8: moderate candidate has 0 penalty');
}

// Era #9: The 5th Great Awakening
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g9 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_09_great_awakening, 2040);
  assert(g9.partySystems.eraState.pillar4Baseline === 7.0, '#9: Pillar 4 national baseline shifts to 7.0');
  assert(PSEngine.getCandidateMarginModifier(g9, { id: 'sec', pillar4Stance: 2.5 }, 'PA') === -6.0, '#9: secular candidate (Pillar 4 <= 4.0) suffers -6.0% penalty');
  assert(PSEngine.getCandidateMarginModifier(g9, { id: 'faith', pillar4Stance: 7.5 }, 'PA') === 0, '#9: faith-aligned candidate avoids secular penalty');
  assert(PSEngine.getVolunteerDriveMultiplier(g9, { pillar4Stance: 3.0 }) === 0.75, '#9: secular platform suffers -25% volunteer drive yield (0.75x)');
}

// Era #11: Generational Succession Crisis
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g11 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_11_generational_succession, 2040);
  const senior = { id: 'old1', name: 'Senior', age: 72 };
  const young = { id: 'yng1', name: 'Youth', age: 38 };
  assert(PSEngine.dispatchEraHook(g11, 'getTurnoutModifier', 'people', 'PA', { candidate: senior }) === -8.0, '#11: candidate > 65 suffers -8.0% youth turnout penalty');
  assert(PSEngine.getVolunteerDriveMultiplier(g11, { candidate: young }) === 1.05, '#11: candidate < 45 gains +5.0% volunteer drive surge');
}

// Era #12: Digital Syndicate & Influencer Politics
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g12 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_12_digital_syndicate, 2040);
  assert(PSEngine.dispatchEraHook(g12, 'getFundraisingModifier', 'chapter') === 0.5, '#12: physical chapter revenue cut by -50% (0.5x)');
  assert(PSEngine.dispatchEraHook(g12, 'getFundraisingModifier', 'small-dollar', { candidate: { fame: 88 } }) === 3.0, '#12: >80 Fame gains 3.0x small-dollar virality yield');
  assert(PSEngine.dispatchEraHook(g12, 'getFundraisingModifier', 'small-dollar', { candidate: { fame: 60 } }) === 1.0, '#12: <=80 Fame receives standard 1.0x yield');
}

// Era #13: Green Transition Crucible
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const baseForecast = Engine.presidentialForecast(g0);
  const baseGrnPA = baseForecast.byState.PA.shares.green;
  const g13 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_13_green_transition, 2040);
  const era13Forecast = Engine.presidentialForecast(g13);
  const era13GrnPA = era13Forecast.byState.PA.shares.green;
  assert(g13.partySystems.eraState.greenBaselineBoost === 10.0, '#13: permanent +10.0% Green Party baseline boost stored');
  assert(era13GrnPA >= baseGrnPA + 9.0, `#13: Green polling surged in PA (${baseGrnPA}% -> ${era13GrnPA}%)`);
  assert(Engine.getPartyInstitutionalTier(g13, 'green') >= 4, '#13: Green Party promoted to Tier 4 Contender status');
  const cleanMult = PSEngine.getSuperPacFundingMultiplier(g13, { id: 'green-future-action', axis: 'climate', idealRange: [1, 3] });
  const fossilMult = PSEngine.getSuperPacFundingMultiplier(g13, { id: 'energy-independence-pac', axis: 'climate', idealRange: [7, 10] });
  assert(cleanMult / fossilMult === 2.0, `#13: Clean-Tech Super PAC out-funds Fossil PAC 2:1 (${cleanMult}:${fossilMult})`);
}

// Era #14: Tripartite Corporatist Compact
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g14 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_14_tripartite_corporatist, 2040);
  const pWeights = PSEngine.getPillarWeightModifiers(g14);
  assert(pWeights['tax-economy'] === 2.5 && pWeights['social-services'] === 2.5, '#14: Pillars 1 & 5 dominate election weights (2.5x)');

  // Test live bill enactment gating (requires Labor + Business sign-off)
  const billId = sandbox.window.PartyChairData.BILLS[0].id;
  const billState = { ...g14, treasury: 50, actionsLeft: 10, sittingMemberHappiness: 80, pendingBill: { id: billId, stateId: 'PA', stateName: 'Pennsylvania', year: 2040, endorsements: ['dem_bernie_bros', 'dem_blue_dog'] } };
  const blockedPass = Engine.takeAction(billState, 'pass-bill');
  assert(Boolean(blockedPass.pendingBill), '#14: bill with only Labor endorsements is BLOCKED from passing');

  const withBusiness = Engine.takeAction(billState, 'endorse-bill', { factionId: 'dem_neo_liberals' });
  assert(withBusiness.pendingBill.endorsements.includes('dem_neo_liberals'), '#14: Business faction endorsement accepted');
  const passedBill = Engine.takeAction(withBusiness, 'pass-bill');
  assert(passedBill.pendingBill === null && passedBill.passedBills.length === g14.passedBills.length + 1, '#14: bill passes once BOTH Labor and Business factions sign off');
}

// Era #15: The AI Boom
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g15 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_15_ai_boom, 2040);
  const sal = PSEngine.getIssueSalienceModifiers(g15);
  assert(Object.keys(sal.weights).length === 10, '#15: all 10 AI Boom issues carry elevated 3.0x salience');
  assert(Object.values(sal.weights).every((w) => w === 3.0), '#15: AI issue salience weight is 3.0x');
  assert(['Accelerationist', 'Labor Protectionist', 'Balanced Governance'].includes(g15.partySystems.eraState.aiAlignments?.player?.label), `#15: AI alignment computed (${g15.partySystems.eraState.aiAlignments?.player?.label})`);
}

// Era #19: Charismatic Movement Era
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  g0.nationalEnvironment = 8.0;
  const g19 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_19_charismatic_movement, 2040);
  assert(PSEngine.getCoattailMultiplier(g19) === 2.5, '#19: 2.5x downballot coattail multiplier active');
  const baseHouse = Engine.estimateRaceMargin(g0, 'house:PA-01');
  const era19House = Engine.estimateRaceMargin(g19, 'house:PA-01');
  assert(Math.abs(era19House - baseHouse) > 2.0, `#19: 2.5x coattails visibly amplify House margin (${baseHouse.toFixed(2)} -> ${era19House.toFixed(2)})`);

  // Succession War trigger on open term-limited presidential cycle & resolution on primary resolve
  const openPres = { ...g19, year: 2044, incumbentTermNumber: 2 };
  PSEngine.dispatchEraHook(openPres, 'onCycleStart');
  assert(openPres.partySystems.eraState.successionWarActive === true, '#19: term-limited open presidential cycle triggers Succession War');
  PSEngine.dispatchEraHook(openPres, 'onPrimaryResolve', []);
  assert(openPres.partySystems.eraState.successionWarActive === false && openPres.partySystems.eraState.successionWarResolved === true, '#19: Succession War resolves upon primary completion');
}

// Era #20: The Permanent Emergency Cycle
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  g0.governingParty = 'heritage'; // Player (Dem) is opposition
  const g20 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_20_permanent_emergency, 2040);
  assert(PSEngine.getApprovalDecayMultiplier(g20) === 2.0, '#20: incumbent approval decays 2.0x as fast');
  assert(PSEngine.dispatchEraHook(g20, 'getFundraisingModifier', 'small-dollar', { partyId: 'people' }) === 1.2, '#20: out-of-power opposition gains +20% fundraising');
  assert(PSEngine.dispatchEraHook(g20, 'getFundraisingModifier', 'small-dollar', { partyId: 'heritage' }) === 1.0, '#20: incumbent governing party gets standard 1.0x fundraising');
  assert(PSEngine.dispatchEraHook(g20, 'getTurnoutModifier', 'people') === 4.0, '#20: opposition receives +4.0% election tailwind');
  assert(PSEngine.dispatchEraHook(g20, 'getNationalWindModifier') === 4.0, '#20: national wind shifts +4.0 toward opposition');
}

// Era #21: Metro League vs. Heartland Compact
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  const g21 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_21_metro_vs_heartland, 2040);
  const metroCand = { id: 'mc', name: 'Urbanite', geoArchetype: 'metro' };
  const heartCand = { id: 'hc', name: 'Heartlander', geoArchetype: 'heartland' };
  assert(PSEngine.getCandidateMarginModifier(g21, metroCand, 'IA') === -6.0, '#21: Metro candidate in Heartland state (IA) suffers -6.0% penalty');
  assert(PSEngine.getCandidateMarginModifier(g21, heartCand, 'NY') === -6.0, '#21: Heartland candidate in Metro state (NY) suffers -6.0% penalty');
  assert(PSEngine.getCandidateMarginModifier(g21, metroCand, 'NY') === 2.0, '#21: Metro candidate in Metro state (NY) gains +2.0% bonus');
  assert(PSEngine.getCandidateMarginModifier(g21, heartCand, 'IA') === 2.0, '#21: Heartland candidate in Heartland state (IA) gains +2.0% bonus');
}

// Era #26: Post-Citizens United Era
{
  const g0 = Engine.createGame({ baseTemplateId: 'people' });
  assert((g0.superPacs || []).length > 0, '#26 baseline: Super PACs exist before transition');
  const g26 = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID.era_26_post_citizens_united, 2040);
  assert(Array.isArray(g26.superPacs) && g26.superPacs.length === 0, '#26: all Super PACs dissolved upon era entry');
  assert(PSEngine.isSuperPacOutlawed(g26) === true, '#26: isSuperPacOutlawed() returns true');
  assert(PSEngine.dispatchEraHook(g26, 'getFundraisingModifier', 'high-dollar') === 0.25, '#26: high-dollar fundraising cut by -75% (0.25x)');
  assert(PSEngine.dispatchEraHook(g26, 'getFundraisingModifier', 'chapter') === 1.4, '#26: State Chapter dues boosted (1.4x)');
  assert(PSEngine.dispatchEraHook(g26, 'getFundraisingModifier', 'public-match', { candidate: { traits: ['Squeaky Clean'] } }) === 1.25, '#26: Squeaky Clean candidate gains +25% public match');

  // Verify engine live integration: allocateCandidateFunds applies +25% public match to Squeaky Clean candidate
  const g26Camp = {
    ...g26,
    treasury: 50,
    sittingMembers: [{ id: 'clean_sen', name: 'Clean Senator', raceId: 'senate:PA', traits: ['Squeaky Clean'] }],
    candidateFunding: { 'senate:PA': { raceKey: 'senate:PA', candidateId: 'clean_sen', candidateName: 'Clean Senator', kind: 'Senate', baseline: 5, allocated: 0, happiness: 60 } },
  };
  const funded = Engine.takeAction(g26Camp, 'allocate-candidate-funds', { raceKey: 'senate:PA', amount: 4 });
  assert(funded.candidateFunding['senate:PA'].allocated === 5.0, `#26: $4M spend on Squeaky Clean candidate yields $5.0M (+25% public match, got ${funded.candidateFunding['senate:PA'].allocated})`);
}

// ------------------------------------------------------------------
// SUITE 4: UI Tooltips, Dossiers, Campaign Feedback & Vibes Scanner
// ------------------------------------------------------------------
console.log('\n--- SUITE 4: UI Tooltips, Dossiers & Qualitative Vibes Scanner ---');
{
  const forbidden = [/REQ-\d+/i, /MAS-\d+/i, /Weight\s*=\s*\d/i, /1\.55M/i];

  PHASE2_IDS.forEach((eraId) => {
    const g0 = Engine.createGame({ baseTemplateId: 'people' });
    const gEra = PSEngine.transitionToPartySystem(g0, PSData.ALL_ERAS_BY_ID[eraId], 2040);
    const dossierHtml = PSUI.renderEraDossierModal(gEra);
    const modalHtml = PSUI.renderRealignmentModal(gEra);
    const badgeHtml = PSUI.renderTopBarEraBadge(gEra);

    let appHtml = '';
    if (AppTest && typeof AppTest.setGame === 'function') {
      AppTest.setGame(gEra);
      appHtml += AppTest.activeEraFeedbackBannerMarkup ? AppTest.activeEraFeedbackBannerMarkup() : '';
      appHtml += AppTest.superPacsPanelMarkup ? AppTest.superPacsPanelMarkup() : '';
      appHtml += AppTest.candidateEraBadgeMarkup ? AppTest.candidateEraBadgeMarkup({ id: 't1', name: 'Test', age: 72, fame: 88, traits: ['Squeaky Clean'], geoArchetype: 'metro' }, 'IA') : '';
    }

    const combined = `${dossierHtml}\n${modalHtml}\n${badgeHtml}\n${appHtml}`;
    forbidden.forEach((rx) => {
      assert(!rx.test(combined), `${eraId}: zero forbidden technical tag leaks matching ${rx}`);
    });
  });

  // Targeted UI reflection checks via PartyChairApp
  assert(Boolean(AppTest && typeof AppTest.setGame === 'function'), 'UI: window.PartyChairApp loaded cleanly in headless test harness');
  if (AppTest && typeof AppTest.setGame === 'function') {
    const g26 = PSEngine.transitionToPartySystem(Engine.createGame({ baseTemplateId: 'people' }), PSData.ALL_ERAS_BY_ID.era_26_post_citizens_united, 2040);
    AppTest.setGame(g26);
    const pacHtml = AppTest.superPacsPanelMarkup();
    assert(pacHtml.includes('Super PACs Dissolved Nationwide'), 'UI: Era #26 renders Post-Citizens United Super PAC dissolution panel');
    const cleanBadge = AppTest.candidateEraBadgeMarkup({ traits: ['Squeaky Clean'] }, 'PA');
    assert(cleanBadge.includes('Public Match Eligible'), 'UI: Era #26 renders Public Match Eligible badge on Squeaky Clean candidates');

    const g19 = PSEngine.transitionToPartySystem(Engine.createGame({ baseTemplateId: 'people' }), PSData.ALL_ERAS_BY_ID.era_19_charismatic_movement, 2040);
    g19.partySystems.eraState.successionWarActive = true;
    AppTest.setGame(g19);
    assert(AppTest.activeEraFeedbackBannerMarkup().includes('Succession War Active'), 'UI: Era #19 surfaces Succession War Active campaign feedback');

    const g21 = PSEngine.transitionToPartySystem(Engine.createGame({ baseTemplateId: 'people' }), PSData.ALL_ERAS_BY_ID.era_21_metro_vs_heartland, 2040);
    AppTest.setGame(g21);
    const mismatchBadge = AppTest.candidateEraBadgeMarkup({ geoArchetype: 'metro' }, 'IA');
    assert(mismatchBadge.includes('Metro Profile ⚠'), 'UI: Era #21 flags geographic mismatch on candidate card');

    const g14 = PSEngine.transitionToPartySystem(Engine.createGame({ baseTemplateId: 'people' }), PSData.ALL_ERAS_BY_ID.era_14_tripartite_corporatist, 2040);
    g14.pendingBill = { id: sandbox.window.PartyChairData.BILLS[0].id, stateId: 'PA', stateName: 'Pennsylvania', year: 2040, endorsements: [] };
    AppTest.setGame(g14);
    assert(AppTest.step4WorkMarkup().includes('Tripartite Compact Sign-Off'), 'UI: Era #14 renders Tripartite Compact Sign-Off status on pending bills');
  }
}

console.log('\n================================================================');
console.log(` ALL MAS-01 PHASE 2 CHECKS PASSED: ${passed}/${total}`);
console.log('================================================================');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
