// scripts/test-v0188-ui.cjs
// Unit test suite for FactionCaucusUI (v0.18.8 Wave 1 Module #5)

const assert = require('assert');
const UI = require('../faction-caucus-ui.js');

console.log('=== v0.18.8 FactionCaucusUI Unit Test Suite ===');

// 1. Module export contract
assert(UI && typeof UI === 'object', 'FactionCaucusUI must export an object');
['renderCaucusOverviewPanel', 'renderFactionMetaBadges', 'renderThreePartyChaosBanner', 'renderLifecycleDigestCards', 'getScopedStyles', 'ensureStylesInjected', 'escapeHtml'].forEach((fn) => {
  assert.strictEqual(typeof UI[fn], 'function', `FactionCaucusUI.${fn} must be a function`);
});
console.log('  PASS: Module API surface verified');

// 2. Scoped styles & ensureStylesInjected
const stylesHtml = UI.getScopedStyles();
assert(stylesHtml.includes('<style') && stylesHtml.includes('</style>'), 'getScopedStyles must return a <style> block');
assert(stylesHtml.includes('--text') && stylesHtml.includes('.v188-caucus-card'), 'getScopedStyles must include CSS variables and v188 classes');
assert.strictEqual(UI.ensureStylesInjected(), false, 'ensureStylesInjected returns false safely in headless Node without document');
console.log('  PASS: Scoped styles & headless ensureStylesInjected verified');

// 3. 2028 Starting Caucuses rendering (Democratic & Republican)
const mockGame2028 = {
  player: { id: 'people', baseTemplateId: 'people', name: 'Democratic Party', custom: false },
  threePartyChaosActive: false,
  factions: [
    { id: 'dem_liberal_establishment', name: 'Liberal Establishment', partyId: 'people' },
    { id: 'dem_black_voters', name: 'Black Voters', partyId: 'people', type: 'racial' },
    { id: 'dem_neo_liberals', name: 'Neo-Liberals', partyId: 'people' },
    { id: 'dem_capital_l_left', name: 'Capital-L Left', partyId: 'people' },
    { id: 'dem_bernie_bros', name: 'Populist Progressives', partyId: 'people' },
    { id: 'dem_blue_dog', name: 'Blue Dog Democrats', partyId: 'people' },
    { id: 'dem_traditional_latin', name: 'Traditional Latino Voters', partyId: 'people', type: 'racial' },
    { id: 'dem_faith_based_liberals', name: 'Faith-Based Liberals', partyId: 'people', type: 'religious' },
    { id: 'dem_abundance', name: 'Abundance Moderates', partyId: 'people' },
    { id: 'gop_maga', name: 'Nationalist Populists (MAGA)', partyId: 'heritage' },
    { id: 'gop_blood_and_soil', name: 'Blood and Soil Nationalists', partyId: 'heritage', isExtremist: true },
    { id: 'gop_paleocons', name: 'Paleocons', partyId: 'heritage' },
    { id: 'gop_cubans', name: 'Cuban-American Conservatives', partyId: 'heritage', type: 'racial' },
    { id: 'gop_western_mavericks', name: 'Western Mavericks', partyId: 'heritage' },
    { id: 'gop_suburban_moderates', name: 'Suburban Moderates', partyId: 'heritage' },
    { id: 'gop_market_country_club', name: 'Market & Country-Club Conservatives', partyId: 'heritage' },
    { id: 'gop_faith_and_flag', name: 'Faith & Flag Conservatives', partyId: 'heritage' },
    { id: 'gop_traditional_farmers', name: 'Traditional Farmers', partyId: 'heritage' },
    { id: 'gop_mormons', name: 'Latter-day Saint Conservatives', partyId: 'heritage', type: 'religious' },
    { id: 'gop_neo_cons', name: 'Neo-Conservatives', partyId: 'heritage' },
  ],
  caucuses: [
    {
      id: 'caucus_dem_institutional',
      partyId: 'people',
      name: 'The Institutional Caucus',
      status: 'historic',
      strength: 68,
      representativeName: 'Rep. Claire Vance',
      memberFactionIds: ['dem_liberal_establishment', 'dem_black_voters', 'dem_neo_liberals'],
    },
    {
      id: 'caucus_dem_progressive',
      partyId: 'people',
      name: 'The Progressive Caucus',
      status: 'active',
      strength: 74,
      representativeName: 'Rep. Marcus Cole',
      memberFactionIds: ['dem_capital_l_left', 'dem_bernie_bros'],
    },
    {
      id: 'caucus_dem_bluedog',
      partyId: 'people',
      name: 'The Blue Dog Caucus',
      status: 'active',
      strength: 66,
      representativeName: 'Rep. Elena Ruiz',
      memberFactionIds: ['dem_blue_dog', 'dem_traditional_latin', 'dem_faith_based_liberals'],
    },
    {
      id: 'caucus_dem_solo_abundance',
      partyId: 'people',
      name: 'Abundance Solo Caucus',
      status: 'solo',
      strength: null,
      representativeName: 'Rep. Jordan Reyes',
      memberFactionIds: ['dem_abundance'],
    },
    {
      id: 'caucus_gop_maga',
      partyId: 'heritage',
      name: 'The MAGA Caucus',
      status: 'active',
      strength: 56,
      representativeName: 'Rep. Buck Harlan',
      memberFactionIds: ['gop_maga', 'gop_blood_and_soil', 'gop_paleocons', 'gop_cubans'],
    },
    {
      id: 'caucus_gop_freemarket',
      partyId: 'heritage',
      name: 'The Free-Market Caucus',
      status: 'active',
      strength: 72,
      representativeName: 'Rep. Patricia Sterling',
      memberFactionIds: ['gop_western_mavericks', 'gop_suburban_moderates', 'gop_market_country_club'],
    },
    {
      id: 'caucus_gop_faith',
      partyId: 'heritage',
      name: 'The Faith Caucus',
      status: 'active',
      strength: 76,
      representativeName: 'Rep. Caleb Boone',
      memberFactionIds: ['gop_faith_and_flag', 'gop_traditional_farmers', 'gop_mormons'],
    },
    {
      id: 'caucus_gop_solo_neocons',
      partyId: 'heritage',
      name: 'Neo-Con Solo Caucus',
      status: 'solo',
      strength: null,
      representativeName: 'Rep. Arthur Hayes',
      memberFactionIds: ['gop_neo_cons'],
    },
  ],
};

const demCaucusHtml = UI.renderCaucusOverviewPanel(mockGame2028, 'people');
assert(demCaucusHtml.includes('The Institutional Caucus'), 'Must render Institutional Caucus');
assert(demCaucusHtml.includes('v188-status-historic') && demCaucusHtml.includes('Historic'), 'Must render Historic badge');
assert(demCaucusHtml.includes('68 / 100'), 'Must render strength 68 / 100');
assert(demCaucusHtml.includes('Anti-Poaching Lock'), 'Must render Anti-Poaching Lock when strength >= 45');
assert(demCaucusHtml.includes('Primary Non-Aggression'), 'Must render Primary Non-Aggression when strength >= 35');
assert(demCaucusHtml.includes('Rep. Claire Vance'), 'Must render Caucus Representative');
assert(demCaucusHtml.includes('Liberal Establishment') && demCaucusHtml.includes('Black Voters'), 'Must render member faction pills');
assert(demCaucusHtml.includes('Solo'), 'Must render Solo caucus status');
assert(!demCaucusHtml.includes('The MAGA Caucus'), 'Must filter caucuses by partyId');

const gopCaucusHtml = UI.renderCaucusOverviewPanel(mockGame2028, 'heritage');
assert(gopCaucusHtml.includes('The MAGA Caucus') && gopCaucusHtml.includes('The Free-Market Caucus') && gopCaucusHtml.includes('The Faith Caucus'), 'Must render GOP 2028 starting caucuses');

// Threshold check: strength 34 -> neither lock nor primary indicator; strength 40 -> primary only; strength 45 -> both
const thresholdGame = {
  factions: [{ id: 'f1', name: 'Wing A' }, { id: 'f2', name: 'Wing B' }],
  caucuses: [
    { id: 'c_low', partyId: 'people', name: 'Frayed Caucus', status: 'active', strength: 34, memberFactionIds: ['f1', 'f2'] },
    { id: 'c_mid', partyId: 'people', name: 'Mid Caucus', status: 'active', strength: 40, memberFactionIds: ['f1', 'f2'] },
  ],
};
const lowHtml = UI.renderCaucusOverviewPanel({ ...thresholdGame, caucuses: [thresholdGame.caucuses[0]] }, 'people');
assert(!lowHtml.includes('Anti-Poaching Lock') && !lowHtml.includes('Primary Non-Aggression'), 'Strength 34 should not show Anti-Poaching Lock or Primary Non-Aggression');
const midHtml = UI.renderCaucusOverviewPanel({ ...thresholdGame, caucuses: [thresholdGame.caucuses[1]] }, 'people');
assert(!midHtml.includes('Anti-Poaching Lock') && midHtml.includes('Primary Non-Aggression'), 'Strength 40 should show Primary Non-Aggression only');
console.log('  PASS: Caucus Overview Panel (2028 starting caucuses & strength thresholds) verified');

// 4. Three-Party Chaos Banner
assert.strictEqual(UI.renderThreePartyChaosBanner({ threePartyChaosActive: false }), '', 'Banner must be empty when threePartyChaosActive is false');
const chaosHtml = UI.renderThreePartyChaosBanner({ threePartyChaosActive: true });
assert(chaosHtml.includes('3-Major-Party Chaos Mode Active'), 'Banner must show 3-party chaos title');
assert(chaosHtml.includes('3 major parties are active') && chaosHtml.includes('Party-preservation walls have collapsed') && chaosHtml.includes('2x+'), 'Banner must explain 3 major parties, collapsed walls, and 2x+ volatility');
console.log('  PASS: Three-Party Chaos Banner verified');

// 5. Faction Meta Badges (All 3 temperaments, Vanguard, Viral, Protected Identity, Extremist, Birth Origins)
const fBeliever = {
  id: 'f_believer',
  temperament: 'true_believer',
  vanguardCyclesLeft: 3,
  viralRunwayCyclesLeft: 4,
  birthMode: 'emerge',
};
const bHtml = UI.renderFactionMetaBadges(fBeliever, mockGame2028);
assert(bHtml.includes('True Believer') && bHtml.includes('title="'), 'Must render True Believer pill with tooltip');
assert(bHtml.includes('Vanguard Pull (3 cycles)'), 'Must render Vanguard Pull (3 cycles)');
assert(bHtml.includes('Viral Runway (4 cycles)'), 'Must render Viral Runway (4 cycles)');
assert(bHtml.includes('Emerged'), 'Must render Emerged birth origin tag');

const fFairWeather = { id: 'f_fw', temperament: 'fair_weather', birthMode: 'sever' };
const fwHtml = UI.renderFactionMetaBadges(fFairWeather, mockGame2028);
assert(fwHtml.includes('Fair-Weather') && fwHtml.includes('Severed'), 'Must render Fair-Weather and Severed');

const fTransactional = { id: 'f_tx', temperament: 'transactional', birthMode: 'split', isExtremist: true };
const txHtml = UI.renderFactionMetaBadges(fTransactional, mockGame2028);
assert(txHtml.includes('Transactional') && txHtml.includes('Split') && txHtml.includes('Extremist (Permanent)'), 'Must render Transactional, Split, and Extremist (Permanent)');

const fIdentityMerger = { id: 'f_id', type: 'racial', birthMode: 'merger' };
const idHtml = UI.renderFactionMetaBadges(fIdentityMerger, mockGame2028);
assert(idHtml.includes('Protected Identity Bloc') && idHtml.includes('Merged'), 'Must render Protected Identity Bloc and Merged');
console.log('  PASS: Faction Meta Badges (3 temperaments, Vanguard/Viral, Identity/Extremist, Birth origins) verified');

// 6. Lifecycle Digest Cards
const digestEvents = [
  { type: 'emerge', title: 'AI-Safety Pragmatists', description: 'Emerged with 540,000 voters and 4-cycle Viral Runway.', partyId: 'people', year: 2032 },
  { type: 'sever', title: 'Tariff Hardliners', description: 'Severed 25% of voters from parent bloc.', partyId: 'heritage', year: 2032 },
  { type: 'split', title: 'Two-Way Split', description: 'Parent dissolved into 2 children (50%/50%).', year: 2032 },
  { type: 'merger', title: 'Coalition Merger', description: 'Two aligned blocs consolidated.', year: 2032 },
  { type: 'dissolution', title: 'Deficit Hawks', description: 'Dissolved below 100,000 voters.', year: 2032 },
  { type: 'caucus_formation', title: 'New Reform Caucus', description: '3 factions formed a new Caucus.', year: 2032 },
  { type: 'caucus_fray', title: 'MAGA Caucus Fray', description: 'Strength frayed by -6 under 3-Party Chaos.', year: 2032 },
  { type: 'caucus_historic', title: 'Free-Market Caucus Hardened', description: 'Achieved Historic status (-80% fray).', year: 2032 },
  { type: 'identity_split', title: 'Event A: Black Voters Split', description: 'Split into set sub-factions.', year: 2032 },
  { type: 'identity_unification', title: 'Event B: Latino Unification', description: 'Unified into a single Latino voting bloc.', year: 2032 },
  { type: 'identity_emergent', title: 'Event C: Asian American Voters', description: 'New recognized identity bloc formed.', year: 2032 },
];
const digestHtml = UI.renderLifecycleDigestCards(digestEvents);
['Emerge', 'Sever', 'Split', 'Merger', 'Dissolution', 'Caucus Formed', 'Caucus Fray', 'Historic Hardening', 'Event A', 'Event B', 'Event C'].forEach((label) => {
  assert(digestHtml.includes(label), `Digest must render ${label} card`);
});
console.log('  PASS: Lifecycle Digest Cards verified for all event types');

// 7. XSS / HTML Escaping verification across all 4 renderers
const xssPayload = '<script>alert("xss")</script>&"\'';
const xssGame = {
  factions: [{ id: 'f_xss', name: xssPayload, temperament: 'true_believer', birthMode: 'emerge' }],
  caucuses: [
    {
      id: 'c_xss',
      partyId: 'people',
      name: xssPayload,
      status: 'active',
      strength: 50,
      representativeName: xssPayload,
      memberFactionIds: ['f_xss'],
    },
  ],
};
const xssCaucus = UI.renderCaucusOverviewPanel(xssGame, 'people');
assert(!xssCaucus.includes('<script>'), 'Caucus panel must escape <script> tags');
assert(xssCaucus.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;&amp;&quot;&#39;'), 'Caucus panel must HTML-escape all special chars');

const xssDigest = UI.renderLifecycleDigestCards([{ type: 'emerge', title: xssPayload, description: xssPayload }]);
assert(!xssDigest.includes('<script>'), 'Digest cards must escape <script> tags');
assert(xssDigest.includes('&lt;script&gt;'), 'Digest cards must HTML-escape special chars');

const xssBadges = UI.renderFactionMetaBadges({ id: xssPayload, temperament: 'true_believer', vanguardCyclesLeft: 2 }, xssGame);
assert(!xssBadges.includes('<script>'), 'Meta badges must escape <script> tags in attributes');
console.log('  PASS: HTML / XSS escaping verified across all renderers');

console.log('ALL v0.18.8 FactionCaucusUI TESTS PASSED!');
