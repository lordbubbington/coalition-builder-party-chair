
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
const conGame = env.Engine.createGame({ baseTemplateId: 'constitution' });
conGame.treasury = 20;
conGame.campaign = { ...conGame.campaign, active: true, weeklyActionsLeft: 5 };
const libGame = env.Engine.createGame({ baseTemplateId: 'liberty' });
libGame.treasury = 20;
libGame.campaign = { ...libGame.campaign, active: true, weeklyActionsLeft: 5 };

const origRand = Math.random;
Math.random = () => 0.5;
const afterT0 = env.Engine.takeAction(conGame, 'volunteer-drive', { stateId: 'PA' });
const afterT1 = env.Engine.takeAction(libGame, 'volunteer-drive', { stateId: 'PA' });
Math.random = origRand;
const isV0169 = afterT0.campaign.lastVolunteerDrive.cashCost === 0;
if (isV0169) {
  assert(afterT0.campaign.lastVolunteerDrive.voters === Math.round(afterT1.campaign.lastVolunteerDrive.voters * (0.05 / 0.15)), 'Tier 0 volunteer yield reflects 0.05 vs 0.15 rank multiplier');
  assert(afterT0.campaign.lastVolunteerDrive.cashCost === 0, 'Volunteer drive is financially free');
  assert(afterT1.campaign.lastVolunteerDrive.cashCost === 0, 'Tier 1 volunteer cash cost is $0M');
} else {
  assert(afterT0.campaign.lastVolunteerDrive.voters === Math.round(afterT1.campaign.lastVolunteerDrive.voters * 0.5), 'Tier 0 volunteer yield is exactly 50% of baseline');
  assert(afterT0.campaign.lastVolunteerDrive.cashCost === 4.05, 'Tier 0 volunteer cash cost is +35% ($4.05M vs $3M)');
  assert(afterT0.campaign.lastVolunteerDrive.actionCost === 1.35, 'Tier 0 volunteer action cost is +35% (1.35 vs 1)');
  assert(afterT1.campaign.lastVolunteerDrive.cashCost === 3 && afterT1.campaign.lastVolunteerDrive.actionCost === 1, 'Tier 1 volunteer cost unchanged');
}

assert(env.Engine.getPariahPersuasionPenalty(conGame, 'player', { suburban: true }) === -4.5, 'Tier 0 suburban district carries -4.5% pariah penalty');
assert(env.Engine.getPariahPersuasionPenalty(conGame, 'player', { lean: 2 }) === -4.5, 'Tier 0 moderate district carries -4.5% pariah penalty');
assert(env.Engine.getPariahPersuasionPenalty(conGame, 'player', { collegePct: 42 }) === -4.5, 'Tier 0 educated district carries -4.5% pariah penalty');
assert(env.Engine.getPariahPersuasionPenalty(conGame, 'player', { lean: 25, collegePct: 18, type: 'rural' }) === 0, 'Non-qualifying district has 0 pariah penalty');
assert(env.Engine.getPariahPersuasionPenalty(libGame, 'player', { suburban: true }) === 0, 'Tier 1 party has 0 pariah penalty');

console.log('SUMMARY: ' + passed + '/' + total + ' passed');
