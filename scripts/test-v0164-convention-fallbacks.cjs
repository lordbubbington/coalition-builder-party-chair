
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
const majorNames = ['Tammy Baldwin', 'Chris Sununu', 'Andy Beshear', 'Tim Scott'];
const cases = [
  { id: 'liberty', expect: 'Chase Oliver' },
  { id: 'green', expect: 'Jill Stein' },
  { id: 'constitution', expect: 'Randall Terry' },
  { id: 'socialist', expect: 'Claudia De la Cruz' },
];
for (const c of cases) {
  let g = env.Engine.createGame({ baseTemplateId: c.id });
  g.sittingMembers = [];
  g.presidentialPrimaries = { primaryFieldByParty: { [c.id]: [{ id: 'nom_1', name: 'Nominee', party: c.id, delegates: 100 }] }, brokeredConvention: false };
  g = env.Primaries.initNominatingConvention(g, c.id);
  const vps = g.presidentialPrimaries.conventionData.vpRoster;
  const keynotes = g.presidentialPrimaries.conventionData.keynoteSpeakers;
  assert(vps.length >= 4, c.id + ' VP roster populated (' + vps.length + ')');
  assert(keynotes.length >= 1, c.id + ' keynote speakers populated');
  const allNames = [...vps, ...keynotes].map((x) => x.name).join(' | ');
  majorNames.forEach((mn) => assert(!allNames.includes(mn), c.id + ' convention excludes major-party politician ' + mn));
  assert(allNames.includes(c.expect), c.id + ' convention includes party-aligned leader ' + c.expect);
}
// Custom party
let cg = env.Engine.createGame({ isCustom: true, customName: 'Prairie Populists', customOrigin: 'grassroots_micro' });
cg.sittingMembers = [];
cg.presidentialPrimaries = { primaryFieldByParty: { player: [{ id: 'nom_c', name: 'Founder', party: 'player', delegates: 100 }] }, brokeredConvention: false };
cg = env.Primaries.initNominatingConvention(cg, 'player');
const cNames = [...cg.presidentialPrimaries.conventionData.vpRoster, ...cg.presidentialPrimaries.conventionData.keynoteSpeakers].map((x) => x.name).join(' | ');
majorNames.forEach((mn) => assert(!cNames.includes(mn), 'Custom convention excludes major-party politician ' + mn));
assert(cNames.includes('Prairie Populists'), 'Custom convention uses synthetic party-aligned leaders');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
