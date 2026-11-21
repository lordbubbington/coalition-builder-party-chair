
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

function createEnv(includeApp = false) {
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




const env = createEnv(false);
const cat = env.Data.FACTIONS_CATALOG;
const mat = env.Data.FACTION_STATE_MATRIX;
const nat = env.Data.FACTION_NATIONAL_TOTALS;

assert(!cat.some((f) => f.id === 'unaff_regional_activists'), 'unaff_regional_activists removed from FACTIONS_CATALOG');
assert(nat.unaff_regional_activists === undefined, 'unaff_regional_activists removed from FACTION_NATIONAL_TOTALS');
const stIds = Object.keys(mat);
assert(stIds.length === 51, 'All 51 jurisdictions present in FACTION_STATE_MATRIX');
let grandSum = 0;
stIds.forEach((stId) => {
  assert(mat[stId].unaff_regional_activists === undefined, stId + ' has zero unaff_regional_activists');
  grandSum += Object.values(mat[stId]).reduce((a, b) => a + b, 0);
});
assert(grandSum === 155000000, 'Matrix grand total strictly equals 155,000,000');
const natSum = Object.values(nat).reduce((a, b) => a + b, 0);
assert(natSum === 155000000, 'National totals strictly equal 155,000,000');
assert(env.Data.VERSION_05_VOTER_MODEL.representedVoters === 155000000, 'Voter model representedVoters === 155,000,000');

// Determinism across fresh games
const gA = env.Engine.createGame({ baseTemplateId: 'people' });
const gB = env.Engine.createGame({ baseTemplateId: 'people' });
assert(JSON.stringify(gA.voterModel.factions) === JSON.stringify(gB.voterModel.factions), 'Distribution is byte-identical across fresh game initializations');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
