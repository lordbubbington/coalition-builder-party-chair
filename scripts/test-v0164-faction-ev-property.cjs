
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
const g = env.Engine.createGame({ baseTemplateId: 'people' });
env.App.setGame(g);
env.App.setFactionInspectorState('AL');
const html = env.App.factionsTabMarkup();
assert(html.includes('50-State Dropdown:'), 'Selector labeled 50-State Dropdown:');
assert(html.includes('Alabama (AL) · 9 EV'), 'Alabama displays 9 EV');
assert(html.includes('California (CA) · 54 EV'), 'California displays 54 EV');
assert(html.includes('Texas (TX) · 40 EV'), 'Texas displays 40 EV');
assert(html.includes('Florida (FL) · 30 EV'), 'Florida displays 30 EV');
assert(html.includes('9 Electoral Votes'), 'Active state summary strip displays 9 Electoral Votes');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');

})().catch((err) => { console.error(err); process.exit(1); });
