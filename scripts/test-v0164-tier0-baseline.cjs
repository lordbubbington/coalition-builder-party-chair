
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
const tiers = env.Data.INSTITUTIONAL_TIERS;
assert(tiers[0].tier === 0 && tiers[0].id === 'extremist', 'Tier 0 Extremist Movement inserted at head of INSTITUTIONAL_TIERS');
assert(tiers[0].badgeColor === '#b91c1c', 'Tier 0 badgeColor is #b91c1c');
assert(tiers[0].maxFocusSlots === 1, 'Tier 0 maxFocusSlots is 1');
for (let t = 1; t <= 5; t++) {
  const obj = tiers.find((x) => x.tier === t);
  assert(Boolean(obj) && obj.tier === t, 'Tier ' + t + ' preserved without index shift');
}
const init = env.Engine.buildInitialPartyTiers('people', false);
assert(init.people === 5 && init.heritage === 5, 'People and Heritage start at Tier 5');
assert(init.liberty === 1 && init.green === 1, 'Liberty and Green start at Tier 1');
assert(init.constitution === 0 && init.socialist === 0, 'Constitution and Socialist start at Tier 0');
const initCustom = env.Engine.buildInitialPartyTiers('liberty', true);
assert(initCustom.player === 0, 'Custom 100K party starts at Tier 0');

const conGame = env.Engine.createGame({ baseTemplateId: 'constitution' });
assert(env.V07.computePartyInstitutionalTierRaw(conGame, 'player') === 0, 'computePartyInstitutionalTierRaw returns 0 for Constitution (<350K)');
const libGame = env.Engine.createGame({ baseTemplateId: 'liberty' });
assert(env.V07.computePartyInstitutionalTierRaw(libGame, 'player') >= 1, 'computePartyInstitutionalTierRaw returns >=1 for Liberty (>=350K)');

const natSum = Object.values(env.Data.FACTION_NATIONAL_TOTALS).reduce((a, b) => a + b, 0);
assert(natSum === 155000000, 'National represented-voter total is exactly 155,000,000');
assert(Object.keys(env.Data.FACTION_STATE_MATRIX).length === 51, 'All 51 jurisdictions present');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
