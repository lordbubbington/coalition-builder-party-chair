/**
 * test-busywork-systems.cjs
 * Comprehensive test suite for Antigravity Busywork Systems Release:
 * - Proposal 1: Bespoke Politician Historical Bios & Backstories
 * - Proposal 2: Multi-Cycle Balance & Demographic Simulation Audit Harness
 * - Proposal 3: Dynamic Cable News Chyron & Editorial Column Ticker Catalog
 * - Proposal 4: Bellwether Counties & Geographic Political Texture for 50-State Dossiers
 * - Proposal 5: Expanded Politician Personality Quirks & Qualitative Traits Catalog (40 Traits)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- RUNNING BUSYWORK SYSTEMS VERIFICATION SUITE ---');

const ROOT = path.resolve(__dirname, '..');

// 1. Verify files exist
const requiredFiles = [
  'political-texture-system.js',
  'scripts/audit-multicycle-simulation.cjs',
  'RUN_SIMULATION_AUDIT.bat',
  'data.js',
  'engine.js',
  'scenario-2028.js',
  'app.js',
  'styles.css',
  'POLITICIAN_TRAITS.md'
];

requiredFiles.forEach((file) => {
  const fullPath = path.join(ROOT, file);
  assert(fs.existsSync(fullPath), `Required file missing: ${file}`);
});
console.log('✓ All 9 core files present.');

// 2. Load module under test
const PoliticalTexture = require(path.join(ROOT, 'political-texture-system.js'));
assert(PoliticalTexture, 'Failed to export PoliticalTexture');

// 3. Proposal 5: 40-Trait Taxonomy Verification
const registry = PoliticalTexture.EXPANDED_POLITICIAN_TRAITS_REGISTRY;
const traitNames = PoliticalTexture.ALL_POLITICIAN_TRAIT_NAMES;
assert.strictEqual(traitNames.length, 40, `Expected 40 traits in registry, got ${traitNames.length}`);

// Verify all 40 traits have valid schema
const validCategories = new Set(['career_stage', 'ethics', 'communication', 'operational', 'background', 'media_style', 'governance', 'character']);
traitNames.forEach((name) => {
  const t = registry[name];
  assert(t, `Trait ${name} missing from registry`);
  assert(t.id, `Trait ${name} missing id`);
  assert(t.name, `Trait ${name} missing name`);
  assert(validCategories.has(t.category), `Trait ${name} has invalid category: ${t.category}`);
  assert(typeof t.description === 'string' && t.description.length > 20, `Trait ${name} description too short`);
  assert(t.effects && typeof t.effects === 'object', `Trait ${name} missing effects object`);
});
console.log('✓ 40/40 traits validated in EXPANDED_POLITICIAN_TRAITS_REGISTRY with valid schema.');

// Verify data.js contains all 40 traits
const dataJs = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
traitNames.forEach((name) => {
  const present = dataJs.includes(`'${name}'`) || (name === 'Established Politician' && dataJs.includes("'Established politician'"));
  assert(present, `Trait ${name} missing from data.js POLITICIAN_TRAITS`);
});
console.log('✓ 40/40 traits present in data.js POLITICIAN_TRAITS array.');

// Verify engine.js CANDIDATE_TRAIT_EFFECTS contains all 40 traits
const engineJs = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
traitNames.forEach((name) => {
  const present = engineJs.includes(`'${name}':`) || (name === 'Established Politician' && engineJs.includes("'Established Politician':"));
  assert(present, `Trait ${name} missing from engine.js CANDIDATE_TRAIT_EFFECTS`);
});
console.log('✓ 40/40 traits present in engine.js CANDIDATE_TRAIT_EFFECTS.');

// Verify evaluateCandidateTraitEffects evaluates trait modifiers
const vm = require('vm');
const sandbox = {
  window: { PartyChairData: {} },
  module: { exports: {} },
  console: console,
  Math: Math,
  Set: Set,
  Map: Map,
  Object: Object,
  Array: Array,
  String: String,
  Number: Number,
  Boolean: Boolean
};
vm.createContext(sandbox);

// Load data.js and engine.js in sandbox
vm.runInContext(dataJs, sandbox);
vm.runInContext(PoliticalTexture ? `window.PartyChairData = window.PartyChairData || {}; Object.assign(window.PartyChairData, ${JSON.stringify(PoliticalTexture)});` : '', sandbox);
vm.runInContext(engineJs, sandbox);

const evaluateCandidateTraitEffects = sandbox.window?.PartyChairEngine?.evaluateCandidateTraitEffects || sandbox.evaluateCandidateTraitEffects;
assert(typeof evaluateCandidateTraitEffects === 'function', 'evaluateCandidateTraitEffects not exported');

// Test veteran candidate
const vet = { name: 'Test Vet', traits: ['Military Veteran', 'Disciplined'] };
const vetFx = evaluateCandidateTraitEffects(vet);
assert.strictEqual(vetFx.workingClassRuralAppeal, 2.2, 'Military Veteran appeal mismatch');
assert.strictEqual(vetFx.baselineDefenseFloor, 2.5, 'Military Veteran defense mismatch');
assert.strictEqual(vetFx.volatilityMultiplier, 0.55, 'Disciplined volatility mismatch');
assert.strictEqual(vetFx.unforcedGaffeOddsMultiplier, 0, 'Disciplined unforced gaffes mismatch');

// Test populist firebrand candidate
const pop = { name: 'Test Pop', traits: ['Populist Firebrand', 'Floor Speech Maverick'] };
const popFx = evaluateCandidateTraitEffects(pop);
assert.strictEqual(popFx.workingClassRuralAppeal, 3.5, 'Populist Firebrand appeal mismatch');
assert.strictEqual(popFx.volatilityMultiplier, 1.25, 'Populist Firebrand volatility mismatch');
assert.strictEqual(popFx.donorViralityMultiplier, 1.20 * 1.25, 'Combined donor virality mismatch');

// Test squeaky clean debate performance with oratorical phenom
const orator = { name: 'Test Orator', traits: ['Oratorical Phenom', 'Squeaky Clean'] };
const oratorFx = evaluateCandidateTraitEffects(orator);
assert.strictEqual(oratorFx.oppoImmunity, true, 'Squeaky Clean oppoImmunity mismatch');
assert.strictEqual(oratorFx.debatePerformanceMultiplier, 1.25, 'Oratorical debate multiplier mismatch');
assert.strictEqual(oratorFx.suburbanSwingLift, 2.5, 'Squeaky Clean suburban lift mismatch');
console.log('✓ evaluateCandidateTraitEffects accurately calculates multi-trait compounding modifiers.');

// 4. Verify trait assignment in scenario-2028.js and app.js
const scenJs = fs.readFileSync(path.join(ROOT, 'scenario-2028.js'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

// Note: QA fix #68 requires Corrupt to be dynamically generated/rolled rather than statically assigned in scenario-2028.js
traitNames.filter((t) => t !== 'Corrupt').forEach((name) => {
  assert(scenJs.includes(`"${name}"`) || scenJs.includes(`'${name}'`), `Trait "${name}" not assigned in scenario-2028.js`);
  assert(appJs.includes(`"${name}"`) || appJs.includes(`'${name}'`), `Trait "${name}" not assigned in app.js`);
});
console.log('✓ 39/39 non-dynamic traits actively assigned to politicians in both scenario-2028.js and app.js (Corrupt dynamically rolled per QA fix #68).');

// 5. Proposal 1: Politician Historical Bios Verification
const biosRegistry = PoliticalTexture.POLITICIAN_BIOS_REGISTRY;
assert(biosRegistry, 'Missing POLITICIAN_BIOS_REGISTRY');
const keyFigures = ['Jon Ossoff', 'Gretchen Whitmer', 'J. D. Vance', 'Andy Beshear', 'Mark Kelly', 'Raphael Warnock', 'Josh Shapiro', 'Bernie Sanders', 'Marco Rubio', 'Ted Cruz', 'Katie Britt', 'Glenn Youngkin'];
keyFigures.forEach((name) => {
  const bio = biosRegistry[name];
  assert(bio, `Missing bespoke bio for ${name}`);
  assert(bio.hometown, `Bio for ${name} missing hometown`);
  assert(bio.almaMater, `Bio for ${name} missing almaMater`);
  assert(bio.career, `Bio for ${name} missing career`);
  assert(bio.milestone, `Bio for ${name} missing milestone`);
});
console.log(`✓ Bespoke bios verified for key national figures (${keyFigures.length} checked).`);

// Test procedural bio generator
const mockRecruit = { name: 'Sarah Jenkins', stateId: 'PA', office: 'senate', traits: ['Prosecutorial Edge', 'Bipartisan Dealmaker'] };
const generatedBio = PoliticalTexture.getPoliticianBio(mockRecruit);
assert(generatedBio, 'Failed to generate procedural bio');
assert(generatedBio.hometown, 'Generated bio missing hometown');
assert(generatedBio.almaMater, 'Generated bio missing almaMater');
assert(generatedBio.career, 'Generated bio missing career');
assert(generatedBio.milestone, 'Generated bio missing milestone');
assert(generatedBio.career.includes('Prosecutor') || generatedBio.career.includes('Attorney'), 'Generated bio did not incorporate Prosecutorial Edge');
console.log('✓ Procedural bio generator successfully crafts authentic career profiles.');

// 6. Proposal 4: 50-State Political Geography & Bellwethers Verification
const stateGeo = PoliticalTexture.STATE_POLITICAL_GEOGRAPHY;
assert(stateGeo, 'Missing STATE_POLITICAL_GEOGRAPHY');
const battlegroundStates = ['PA', 'WI', 'MI', 'AZ', 'GA', 'NV', 'NC', 'FL', 'OH', 'VA', 'TX'];
battlegroundStates.forEach((st) => {
  const geo = PoliticalTexture.getStatePoliticalGeography(st);
  assert(geo, `Missing geography for state ${st}`);
  assert(typeof geo.terrain === 'string' && geo.terrain.length > 30, `State ${st} terrain too short`);
  assert(typeof geo.coalitions === 'string' && geo.coalitions.length > 20, `State ${st} coalitions too short`);
  assert(Array.isArray(geo.bellwethers) && geo.bellwethers.length >= 2, `State ${st} bellwethers list missing or too short`);
  geo.bellwethers.forEach((b) => {
    assert(b.name, `State ${st} bellwether missing name`);
    assert(b.seat, `State ${st} bellwether missing seat`);
    assert(b.profile, `State ${st} bellwether missing profile`);
  });
});

// Verify fallback covers all 51 jurisdictions
const allStateCodes = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];
allStateCodes.forEach((code) => {
  const geo = PoliticalTexture.getStatePoliticalGeography(code);
  assert(geo && geo.terrain && geo.coalitions && geo.bellwethers && geo.bellwethers.length > 0, `State geography failed for jurisdiction ${code}`);
});
console.log(`✓ All 51 jurisdictions verified in 50-State Political Geography & Bellwether County system.`);

// 7. Proposal 3: Dynamic Cable News Chyrons Verification
const chyrons = PoliticalTexture.CABLE_NEWS_CHYRON_REGISTRY;
assert(chyrons, 'Missing CABLE_NEWS_CHYRON_REGISTRY');
const chyronCategories = ['breaking_national', 'faction_drama', 'campaign_trail', 'super_pac_wars', 'statewide_frontlines', 'third_party_surge'];
let totalChyrons = 0;
chyronCategories.forEach((cat) => {
  assert(Array.isArray(chyrons[cat]) && chyrons[cat].length >= 10, `Category ${cat} missing or has fewer than 10 chyrons`);
  totalChyrons += chyrons[cat].length;
});
assert(totalChyrons >= 100, `Expected at least 100 chyrons across catalog, got ${totalChyrons}`);
console.log(`✓ ${totalChyrons} cable news chyrons verified across 6 categories.`);

// Test dynamic chyron selector
const mockGameOrganizing = { phase: 'organizing', year: 2028, seed: 104 };
const chyron1 = PoliticalTexture.getDynamicCableNewsChyron(mockGameOrganizing);
assert(chyron1 && chyron1.category && chyron1.headline, 'Failed to generate organizing chyron');

const mockGameCampaign = { phase: 'general-campaign', campaign: { active: true, week: 3 }, year: 2028, seed: 405 };
const chyron2 = PoliticalTexture.getDynamicCableNewsChyron(mockGameCampaign);
assert(chyron2 && chyron2.category && chyron2.headline, 'Failed to generate campaign chyron');

const mockGameMinor = { phase: 'organizing', player: { baseTemplateId: 'libertarian' }, year: 2028, seed: 777 };
const chyron3 = PoliticalTexture.getDynamicCableNewsChyron(mockGameMinor);
assert(chyron3 && ['third_party_surge', 'statewide_frontlines'].includes(chyron3.category), 'Minor party chyron category mismatch');
console.log('✓ getDynamicCableNewsChyron dynamically selects contextual cable news chyrons.');

// 8. Verify CSS styles in styles.css
const stylesCss = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
traitNames.forEach((name) => {
  const cls = `.v14-trait-${name.toLowerCase().trim().replace(/\s+/g, '-')}`;
  assert(stylesCss.includes(cls), `CSS class ${cls} missing from styles.css`);
});
assert(stylesCss.includes('.v18-politician-bio-card'), 'Missing .v18-politician-bio-card in styles.css');
assert(stylesCss.includes('.v18-political-geography-card'), 'Missing .v18-political-geography-card in styles.css');
assert(stylesCss.includes('.v18-bellwether-grid'), 'Missing .v18-bellwether-grid in styles.css');
console.log('✓ CSS classes defined for all 40 traits and all narrative texture cards.');

// 9. Verify UI markup in app.js
assert(appJs.includes('v18-politician-bio-card'), 'app.js missing v18-politician-bio-card markup in renderRosterMember');
assert(appJs.includes('v18-political-geography-card'), 'app.js missing v18-political-geography-card in statesTabMarkup');
assert(appJs.includes('getDynamicCableNewsChyron'), 'app.js missing getDynamicCableNewsChyron in getMorningWireHeadline');
assert(appJs.includes('getPoliticianTraitDescription'), 'app.js missing getPoliticianTraitDescription tooltip in politicianTraitsBadgesMarkup');
console.log('✓ UI markup integration verified across app.js dossiers, directory, wire, and trait badges.');

console.log('--- ALL BUSYWORK SYSTEMS TESTS PASSED SUCCESSFULLY! ---');
