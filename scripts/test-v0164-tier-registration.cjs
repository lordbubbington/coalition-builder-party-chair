
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




const env = createEnv(true);
const expected = [
  { tier: 0, cost: 0, yield: 100 },
  { tier: 1, cost: 1, yield: 1000 },
  { tier: 2, cost: 2, yield: 2000 },
  { tier: 3, cost: 3, yield: 3000 },
  { tier: 4, cost: 4, yield: 5000 },
  { tier: 5, cost: 5, yield: 10000 },
];
for (const row of expected) {
  const spec = env.Engine.getRegistrationTierSpec(row.tier);
  assert(spec.cost === row.cost && spec.yield === row.yield, 'Tier ' + row.tier + ' spec: $' + row.cost + 'M / +' + row.yield);

  // Execute in WY (3 EV) and PA (19 EV) and assert identical flat yields & 155M conservation
  for (const stId of ['WY', 'PA']) {
    let g = env.Engine.createGame({ baseTemplateId: row.tier === 0 ? 'constitution' : row.tier === 5 ? 'people' : 'liberty' });
    const pKey = row.tier === 0 ? 'constitution' : row.tier === 5 ? 'people' : 'liberty';
    g.partyTiers = { ...g.partyTiers, [pKey]: row.tier };
    g.treasury = row.tier === 0 ? 0 : 20;
    const beforeTreasury = g.treasury;
    const beforeActions = g.actionsLeft;
    const beforeDelta = g.stateVoterDeltas?.[stId]?.[pKey] || 0;
    const after = env.Engine.takeAction(g, 'voter-registration-drive', { stateId: stId });
    assert(after.stateVoterDeltas[stId][pKey] - beforeDelta === row.yield, 'Tier ' + row.tier + ' ' + stId + ' yield === +' + row.yield);
    assert(Math.abs((beforeTreasury - after.treasury) - row.cost) < 0.01, 'Tier ' + row.tier + ' ' + stId + ' cost === $' + row.cost + 'M');
    assert(after.actionsLeft === beforeActions - 1, 'Consumes exactly 1 Organizing Action');
    const natSum = env.Data.FACTIONS_CATALOG.reduce((s, f) => s + Number(after.voterModel.factions[f.id] || 0), 0);
    assert(natSum === 155000000, 'Tier ' + row.tier + ' ' + stId + ' conserves exact 155,000,000 represented voters');
  }
}

const appSrc = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
assert(appSrc.includes('v164-registration-card'), 'Dynamic registration card present in app.js');
assert(!appSrc.includes('(+2,500 voters/EV Major'), 'Old EV-scaled registration copy removed');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
