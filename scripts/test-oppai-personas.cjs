/**
 * Verification Test Suite for REQ-301 (Opponent AI: Ideological Strategy Personas)
 * Target: scripts/test-oppai-personas.cjs
 *
 * Covers:
 * - Party-Specific Ideological AI Personas & Decision Heuristics Matrix
 * - Exact mathematical weights for canonical parties: heritage, people, liberty, green, socialist, constitution
 * - Strict 0.00 primary interventionism invariant for Libertarian Party under all conditions
 * - Dynamic profile generation for custom and post-breakup movements derived from charter traits and faction sliders
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✅ PASS: ${message}`);
}

const sandbox = {
  window: { PartyChairData: {} },
  console,
  Math,
  JSON,
  Number,
  String,
  Array,
  Object,
  Infinity,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  Date,
  Set,
  Map,
  Uint8Array,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  Blob: globalThis.Blob,
  DecompressionStream: globalThis.DecompressionStream,
  Response: globalThis.Response,
};
sandbox.window.window = sandbox.window;
const ctx = vm.createContext(sandbox);

function loadScript(relPath) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', relPath), 'utf8');
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
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'party-systems-ui.js',
  'ballot-access.js',
  'election-uncertainty.js',
  'candidate-vetting.js',
  'election-drift.js',
  'campaign-overhaul.js',
  'engine.js',
].forEach(loadScript);

const Data = sandbox.window.PartyChairData;
const Engine = sandbox.window.PartyChairEngine;
const Overhaul = sandbox.window.CampaignOverhaul;

console.log('====================================================================');
console.log(' TEST SUITE: REQ-301 Party-Specific Ideological AI Personas (Opponent AI)');
console.log('====================================================================\n');

// 1. Canonical Party Profiles
console.log('--- 1. Canonical Party Profile Verification ---');
const profiles = Data.DEFAULT_STRATEGY_PROFILES;
assert(Boolean(profiles), 'DEFAULT_STRATEGY_PROFILES exists in PartyChairData');

// Heritage (GOP)
const gop = profiles.heritage;
assert(gop.ruthlessness === 0.85, `GOP ruthlessness === 0.85 (actual: ${gop.ruthlessness})`);
assert(gop.primaryInterventionism === 0.80, `GOP primaryInterventionism === 0.80 (actual: ${gop.primaryInterventionism})`);
assert(gop.factionRiskAversion === 0.25, `GOP factionRiskAversion === 0.25 (actual: ${gop.factionRiskAversion})`);
assert(gop.negativeAdPropensity === 0.80, `GOP negativeAdPropensity === 0.80 (actual: ${gop.negativeAdPropensity})`);
assert(gop.geographicConcentration === 0.85, `GOP geographicConcentration === 0.85 (actual: ${gop.geographicConcentration})`);

// People (DNC)
const dem = profiles.people;
assert(dem.ruthlessness === 0.30, `DNC ruthlessness === 0.30 (actual: ${dem.ruthlessness})`);
assert(dem.primaryInterventionism === 0.35, `DNC primaryInterventionism === 0.35 (actual: ${dem.primaryInterventionism})`);
assert(dem.factionRiskAversion === 0.85, `DNC factionRiskAversion === 0.85 (actual: ${dem.factionRiskAversion})`);
assert(dem.negativeAdPropensity === 0.35, `DNC negativeAdPropensity === 0.35 (actual: ${dem.negativeAdPropensity})`);
assert(dem.geographicConcentration === 0.30, `DNC geographicConcentration === 0.30 (actual: ${dem.geographicConcentration})`);

// Liberty (LP) - Strict Invariant: 0.00
const lp = profiles.liberty;
assert(lp.primaryInterventionism === 0.00, `Libertarian primaryInterventionism === 0.00 (STRICT INVARIANT) (actual: ${lp.primaryInterventionism})`);
assert(lp.ideologicalRigidity === 0.95, `Libertarian ideologicalRigidity === 0.95 (actual: ${lp.ideologicalRigidity})`);
assert(lp.ballotPriority === 0.90, `Libertarian ballotPriority === 0.90 (actual: ${lp.ballotPriority})`);
assert(lp.ruthlessness === 0.20, `Libertarian ruthlessness === 0.20 (actual: ${lp.ruthlessness})`);

// Green (GPUS)
const grn = profiles.green;
assert(grn.primaryInterventionism === 0.95, `Green primaryInterventionism === 0.95 (actual: ${grn.primaryInterventionism})`);
assert(grn.ideologicalRigidity === 0.95, `Green ideologicalRigidity === 0.95 (actual: ${grn.ideologicalRigidity})`);
assert(grn.antiCorporateBias === 0.90, `Green antiCorporateBias === 0.90 (actual: ${grn.antiCorporateBias})`);
assert(grn.ruthlessness === 0.70, `Green ruthlessness === 0.70 (actual: ${grn.ruthlessness})`);

// Socialist (SPUSA)
const soc = profiles.socialist;
assert(soc.primaryInterventionism === 0.92, `Socialist primaryInterventionism === 0.92 (actual: ${soc.primaryInterventionism})`);
assert(soc.ideologicalRigidity === 0.95, `Socialist ideologicalRigidity === 0.95 (actual: ${soc.ideologicalRigidity})`);
assert(soc.laborDensityFocus === 0.85, `Socialist laborDensityFocus === 0.85 (actual: ${soc.laborDensityFocus})`);
assert(soc.ruthlessness === 0.80, `Socialist ruthlessness === 0.80 (actual: ${soc.ruthlessness})`);

// Constitution (CP)
const con = profiles.constitution;
assert(con.primaryInterventionism === 0.60, `Constitution primaryInterventionism === 0.60 (actual: ${con.primaryInterventionism})`);
assert(con.theocraticInvariance === 0.90, `Constitution theocraticInvariance === 0.90 (actual: ${con.theocraticInvariance})`);
assert(con.ruthlessness === 0.65, `Constitution ruthlessness === 0.65 (actual: ${con.ruthlessness})`);

// 2. Engine and Overhaul Lookup Consistency
console.log('\n--- 2. Engine & CampaignOverhaul Profile Access ---');
const engLpProf = Engine.getPartyStrategyProfile('liberty');
assert(engLpProf.primaryInterventionism === 0.00, 'Engine.getPartyStrategyProfile(liberty) strictly returns 0.00');
const ovhGopProf = Overhaul.getPartyStrategyProfile('heritage');
assert(ovhGopProf.ruthlessness === 0.85, 'CampaignOverhaul.getPartyStrategyProfile(heritage) returns 0.85');

// 3. Dynamic Strategy Profile Generator
console.log('\n--- 3. Dynamic Strategy Profile Generator for Custom & Post-Breakup Movements ---');
const dynFunc = Data.generateDynamicPartyStrategyProfile;
assert(typeof dynFunc === 'function', 'generateDynamicPartyStrategyProfile is a function');

// Pragmatist custom movement
const pragmatistParty = {
  id: 'custom_prag',
  charterTraits: ['big_tent_pragmatism'],
};
const pragProf = dynFunc(pragmatistParty);
assert(pragProf.primaryInterventionism < 0.40, `Pragmatist has lower interventionism (actual: ${pragProf.primaryInterventionism})`);
assert(pragProf.factionRiskAversion > 0.60, `Pragmatist has higher faction risk aversion (actual: ${pragProf.factionRiskAversion})`);
assert(pragProf.ideologicalRigidity < 0.35, `Pragmatist has lower ideological rigidity (actual: ${pragProf.ideologicalRigidity})`);

// Doctrinal Vanguard custom movement
const vanguardParty = {
  id: 'custom_vang',
  charterTraits: ['doctrinal_vanguard'],
};
const vangProf = dynFunc(vanguardParty);
assert(vangProf.ruthlessness > 0.60, `Vanguard has higher ruthlessness (actual: ${vangProf.ruthlessness})`);
assert(vangProf.primaryInterventionism > 0.70, `Vanguard has higher primary interventionism (actual: ${vangProf.primaryInterventionism})`);
assert(vangProf.ideologicalRigidity > 0.75, `Vanguard has higher ideological rigidity (actual: ${vangProf.ideologicalRigidity})`);

// State-first federation
const fedParty = {
  id: 'custom_fed',
  charterTraits: ['state_first_federation'],
};
const fedProf = dynFunc(fedParty);
assert(fedProf.geographicConcentration > 0.65, `State-first has high geographic concentration (actual: ${fedProf.geographicConcentration})`);
assert(fedProf.primaryInterventionism < 0.40, `State-first has decentralized primary intervention (actual: ${fedProf.primaryInterventionism})`);

// Custom Libertarian Breakup party strictly maintains 0.00 interventionism
const customLibParty = {
  id: 'custom_lib_breakup',
  baseTemplateId: 'liberty',
  charterTraits: ['doctrinal_vanguard'], // Even with vanguard trait!
};
const customLibProf = dynFunc(customLibParty);
assert(customLibProf.primaryInterventionism === 0.00, `Custom party with liberty base retains STRICT 0.00 interventionism (actual: ${customLibProf.primaryInterventionism})`);

console.log('\n====================================================================');
console.log(` REQ-301 TESTS COMPLETE: ${passedTests}/${totalTests} Passed (100%)`);
console.log('====================================================================');
