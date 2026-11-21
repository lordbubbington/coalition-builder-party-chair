
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0;
let total = 0;
function assert(cond, msg) {
  total++;
  if (!cond) {
    console.error('  FAIL:', msg);
    throw new Error('Assertion failed: ' + msg);
  }
  passed++;
  console.log('  PASS:', msg);
}

async function createEnv(includeApp = false) {
  const storage = {};
  const dummyEl = () => ({
    innerHTML: '', textContent: '', value: '', style: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; },
    closest(){ return null; }, focus(){}, setAttribute(){}, getAttribute(){ return null; }, dataset: {},
  });
  const doc = {
    getElementById: () => dummyEl(),
    querySelector: () => dummyEl(),
    querySelectorAll: () => [],
    createElement: () => dummyEl(),
    body: dummyEl(),
    documentElement: { style: { setProperty(){} }, dataset: {} },
    addEventListener(){},
  };
  const sandbox = {
    window: { PartyChairData: {}, addEventListener(){}, location: { reload(){} }, innerWidth: 1440 },
    document: doc,
    localStorage: { getItem: (k) => storage[k] ?? null, setItem: (k, v) => { storage[k] = String(v); }, removeItem: (k) => { delete storage[k]; } },
    Uint8Array, atob: (s) => Buffer.from(s, 'base64').toString('binary'), btoa: (s) => Buffer.from(s, 'binary').toString('base64'), Blob: globalThis.Blob, DecompressionStream: globalThis.DecompressionStream, Response: globalThis.Response, console, Math, JSON, Number, String, Array, Object, Infinity, parseInt, parseFloat, isNaN, isFinite, Date, Set, Map, RegExp, Error,
    setTimeout: () => 0, clearTimeout: () => {}, requestAnimationFrame: () => 0,
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.document = doc;
  sandbox.window.localStorage = sandbox.localStorage;
  sandbox.global = sandbox;
  const ctx = vm.createContext(sandbox);
  const scripts = [
    'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
    'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js', 'political-trends-system.js',
    'v07-scaffolding.js', 'party-systems-data.js', 'party-systems-coalition.js', 'party-systems-robots.js',
    'party-systems-engine.js', 'party-systems-ui.js', 'presidential-primaries.js', 'ballot-access.js',
    'election-uncertainty.js', 'candidate-vetting.js', 'election-drift.js', 'election-night-engine.js',
    'engine.js',
  ];
  if (includeApp) scripts.push('app.js');
  for (const rel of scripts) {
    const code = fs.readFileSync(path.resolve(__dirname, '..', rel), 'utf8');
    vm.runInContext(code, ctx, { filename: rel });
  }
  if (includeApp) {
    if (sandbox.window.PartyChairData?.VERSION_03_MAPS_READY) await sandbox.window.PartyChairData.VERSION_03_MAPS_READY;
    await new Promise((r) => setImmediate(r));
  }
  return {
    ctx,
    window: sandbox.window,
    Data: sandbox.window.PartyChairData,
    V07: sandbox.window.PartyChairV07,
    Engine: sandbox.window.PartyChairEngine,
    Ballot: sandbox.window.BallotAccess,
    Primaries: sandbox.window.PresidentialPrimaries,
    Coalition: sandbox.window.PartySystemsCoalition,
    App: sandbox.window.PartyChairApp || sandbox.window,
  };
}


(async () => {
const env = await createEnv(true);
const conGame = env.Engine.createGame({ baseTemplateId: 'constitution' });
const badgeHtml = env.App.institutionalStatusBadgeMarkup(conGame, false);
assert(badgeHtml.includes('[ Tier 0 · Extremist Movement ]'), 'Badge renders [ Tier 0 · Extremist Movement ]');
assert(badgeHtml.includes('#b91c1c'), 'Badge uses deep crimson #b91c1c');
assert(badgeHtml.includes('Operating on the ideological periphery under intense civic stigma, radioactive ballot scrutiny, and severe media hostility.'), 'Exact Rule 7 tooltip present');
assert(!badgeHtml.includes('REQ-'), 'Zero REQ- tags in Tier 0 badge');

const stripHtml = env.App.ascensionGauntletProgressStripMarkup(conGame);
assert(stripHtml.includes('Ascension Gauntlet'), 'Qualitative gauntlet progress strip renders');
assert(!/\d|%|REQ-/.test(stripHtml.replace(/class="[^"]*"/g, '').replace(/title="[^"]*"/g, '')), 'Progress strip copy has zero digits, %, or REQ- tags');

// Progress strip reacts to path distance
const nearGame = JSON.parse(JSON.stringify(conGame));
nearGame.ballotAccess.constitution = { presidential: { VT: true, WY: true, MT: true, ID: true }, senate: {}, governor: {}, house: {}, leg: {} };
const nearStrip = env.App.ascensionGauntletProgressStripMarkup(nearGame);
assert(nearStrip.includes('Gathering Breakout Momentum') || nearStrip.includes('On the Threshold'), 'Progress strip reflects closer breakthrough path');

const cssSrc = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
assert(cssSrc.includes('.v159-tier-badge.tier-0') && cssSrc.includes('var(--text)') && cssSrc.includes('var(--line)'), 'Tier 0 badge CSS binds to semantic theme variables');
assert(cssSrc.includes('.v164-gauntlet-strip') && cssSrc.includes('var(--panel2)'), 'Gauntlet strip CSS binds to semantic theme variables');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');

})().catch((err) => { console.error(err); process.exit(1); });
