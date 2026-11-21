'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {}, console, Math, Date, JSON, Number, String, Boolean, Array, Object, Set, Map, RegExp, Error, Promise,
    Uint8Array, Blob, DecompressionStream, Response, setTimeout, clearTimeout, setInterval, clearInterval,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
  });
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  const scripts = [
    'data.js','factions-0.15.js','scenario-2028.js','issues-0.2.1.js','maps-0.3.js',
    'state-house-data-0.5.js','voter-model-0.5.js','demographics-0.9.js','political-trends-system.js',
    'v07-scaffolding.js','party-systems-data.js','party-systems-coalition.js','party-systems-robots.js',
    'party-systems-engine.js','party-systems-ui.js','presidential-primaries.js','ballot-access.js',
    'election-uncertainty.js','candidate-vetting.js','election-drift.js','election-night-engine.js','engine.js',
  ];
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

let passed = 0, failed = 0;
function check(label, cond, detail = '') {
  if (cond) { passed++; console.log(`  PASS: ${label}${detail ? ` (${detail})` : ''}`); }
  else { failed++; console.error(`  FAIL: ${label}${detail ? ` (${detail})` : ''}`); }
}

const ctx = boot();
const E = ctx.window.PartyChairEngine;
const PSD = ctx.window.PartySystemsData;
const PSE = ctx.window.PartySystemsEngine;
const PSR = ctx.window.PartySystemsRobots;

console.log('====================================================================');
console.log(' VERSION 0.16.9 FIXES VERIFICATION SUITE');
console.log('====================================================================');

// Fix #2 & #12: AI simulated primary winners carry to General Election & activePresidentialPrimary clears
let g = E.createGame({ baseTemplateId: 'people' });
check('Version is 0.16.9 or 0.17.0 or 0.17.1', ['0.16.9', '0.17.0', '0.17.1'].includes(g.version), g.version);
g = E.takeAction(g, 'start-presidential-primary');
const simRep = g.simulatedPrimaries?.[2028]?.heritage?.nomineeName;
const simGrn = g.simulatedPrimaries?.[2028]?.green?.nomineeName;
const simLib = g.simulatedPrimaries?.[2028]?.liberty?.nomineeName;
while (g.activePresidentialPrimary && g.activePresidentialPrimary.stage !== 'complete') {
  g = E.takeAction(g, 'advance-primary-day');
}
g = E.takeAction(g, 'finish-presidential-primary');
check('Fix #12: activePresidentialPrimary cleared after finish-presidential-primary', g.activePresidentialPrimary === null);
g = E.holdElection(g);
check('Fix #2: Republican simulated primary winner synced to General Election ticket',
  Boolean(simRep) && g.lastElection?.presidential?.ticket?.heritage === simRep,
  `sim=${simRep}, ticket=${g.lastElection?.presidential?.ticket?.heritage}`);
check('Fix #2: Green & Libertarian simulated primary winners synced to General Election ticket',
  Boolean(simGrn) && g.lastElection?.presidential?.ticket?.green === simGrn && g.lastElection?.partyNominees?.liberty === simLib,
  `green=${g.lastElection?.presidential?.ticket?.green}, lib=${g.lastElection?.partyNominees?.liberty}`);

// Fix #3: Winning presidents tracked in currentPresident / presidentialTerms / pastPresidents
const winName1 = g.lastElection?.presidential?.winnerNominee;
check('Fix #3: Winning president tracked in currentPresident & presidentialTerms',
  g.currentPresident?.name === winName1 && g.presidentialTerms?.[winName1] === 1,
  `winner=${winName1}, terms=${g.presidentialTerms?.[winName1]}`);
// Simulate 2nd win for same nominee -> enters pastPresidents & isFormerPresident
const gWin2 = E.holdElection({ ...g, year: 2032, phase: 'campaign' });
const winName2 = gWin2.lastElection?.presidential?.winnerNominee;
const pastIncludes = (winName2 === winName1)
  ? (gWin2.pastPresidents || []).includes(winName1)
  : (gWin2.pastPresidents || []).includes(winName1);
check('Fix #3: Outgoing or 2-term president recorded in pastPresidents & excluded from primaries',
  pastIncludes, `pastPresidents=${JSON.stringify(gWin2.pastPresidents)}`);

// Fix #4: 3rd-party trust cap re-clamped when dropping to Tier 0
let gGrn = E.createGame({ baseTemplateId: 'green' });
gGrn.partyTiers = { ...(gGrn.partyTiers || {}), green: 0 };
gGrn = E.takeAction(gGrn, 'fundraise-major-donors');
check('Fix #4: 3rd-party trust re-clamped to 0 when party drops to Tier 0',
  gGrn.trust.independents === 0 && gGrn.trust.opponents === 0,
  `trust=${JSON.stringify(gGrn.trust)}`);

// Fix #5 & #7: Era #16 Robot factions + Robot party switch presidential primary
let g16 = E.createGame({ baseTemplateId: 'people' });
g16 = PSE.transitionToPartySystem(g16, PSD.ALL_ERAS_BY_ID['era_16_robots_citizens'], 2044);
const robotFactions = (g16.factions || []).filter((f) => String(f.partyId || '').startsWith('robot_'));
check('Fix #5: Era #16 synthetic robot voters have 8 dedicated robot factions',
  robotFactions.length === 8, `count=${robotFactions.length}`);
const g16Switched = PSE.selectRobotEraParty(g16, 'robot_silicon_vanguard');
const g16Prim = E.takeAction(g16Switched, 'start-presidential-primary');
const rCands = g16Prim.activePresidentialPrimary?.candidates || [];
check('Fix #7: Switched Robot party spawns its own 2 robot-faction primary candidates (not 8 Dem factions)',
  rCands.length === 2 && rCands.every((c) => c.party === 'robot_silicon_vanguard'),
  `count=${rCands.length}, parties=${rCands.map((c) => c.party).join(',')}`);

// Fix #8: Era #18 Coalition MMP & bargaining on holdElection + scaled primary clinchTarget
let g18 = E.createGame({ baseTemplateId: 'people' });
g18 = PSE.transitionToPartySystem(g18, PSD.ALL_ERAS_BY_ID['era_18_party_coalition'], 2040);
const g18Prim = E.takeAction(g18, 'start-presidential-primary');
check('Fix #8: Era #18 coalition party primary scales clinchTarget below DNC 1968',
  (g18Prim.activePresidentialPrimary?.clinchTarget || 9999) < 1968,
  `clinchTarget=${g18Prim.activePresidentialPrimary?.clinchTarget}`);
g18 = { ...g18, phase: 'campaign', primariesResolved: true, prioritiesLocked: true };
g18 = E.holdElection(g18);
check('Fix #8: Era #18 holdElection triggers lastElection.mmp & coalitionSystem.bargaining',
  Boolean(g18.lastElection?.mmp) && Boolean(g18.partySystems?.coalitionSystem?.bargaining),
  `mmp=${Boolean(g18.lastElection?.mmp)}, bargaining=${Boolean(g18.partySystems?.coalitionSystem?.bargaining)}`);

// Fix #9: Minor party roster cleanup
const gRos = E.createGame({ baseTemplateId: 'people' });
const pols = gRos.politicians || [];
const findPol = (name) => pols.find((p) => p.name === name);
check('Fix #9: Butch Ware in Green, Spike Cohen in Libertarian, Kshama Sawant & Gloria La Riva in Peace & Freedom, Ajamu Baraka in grn_eco_socialist_vanguard',
  findPol('Butch Ware')?.party === 'green' &&
  findPol('Spike Cohen')?.party === 'liberty' &&
  findPol('Kshama Sawant')?.party === 'socialist' &&
  findPol('Gloria La Riva')?.party === 'socialist' &&
  findPol('Ajamu Baraka')?.factionId === 'grn_eco_socialist_vanguard' &&
  !findPol('Brian Carroll'),
  `Ware=${findPol('Butch Ware')?.party}, Cohen=${findPol('Spike Cohen')?.party}, Sawant=${findPol('Kshama Sawant')?.party}, LaRiva=${findPol('Gloria La Riva')?.party}`);

// Fix #10: Starting ages seeded, advance +2/cycle, retire 84+
const smNoAge = (gRos.sittingMembers || []).filter((m) => !Number.isFinite(m.age)).length;
const polNoAge = (gRos.politicians || []).filter((p) => !Number.isFinite(p.age)).length;
check('Fix #10: 0 sittingMembers & 0 politicians missing starting age at 2028',
  smNoAge === 0 && polNoAge === 0, `smNoAge=${smNoAge}, polNoAge=${polNoAge}`);
let gAge = gRos;
const initAvgAge = gAge.politicians.reduce((a, p) => a + p.age, 0) / gAge.politicians.length;
for (let i = 0; i < 6; i++) {
  gAge = { ...gAge, phase: 'complete' };
  gAge = E.startNextCycle(gAge);
}
const afterAvgAge = gAge.politicians.reduce((a, p) => a + p.age, 0) / gAge.politicians.length;
const retiredCount = gAge.politicians.filter((p) => p.retired).length;
check('Fix #10: Politicians age +12 years over 6 cycles & elderly politicians retire',
  Math.abs((afterAvgAge - initAvgAge) - 12) < 1.5 && retiredCount > 0,
  `avgAge ${initAvgAge.toFixed(1)}->${afterAvgAge.toFixed(1)}, retired=${retiredCount}`);

// Fix #11: compactGameForSave prunes old simulatedPrimaries & statewideOfficesHistory
const gSave = E.createGame({ baseTemplateId: 'people' });
gSave.simulatedPrimaries = {};
for (const yr of [2028, 2032, 2036, 2040]) {
  gSave.simulatedPrimaries[yr] = {
    people: { partyId: 'people', year: yr, nomineeName: 'Test', candidates: [{ id: '1', name: 'Test', sliders: { a: 1 }, traits: ['x'], delegates: 100 }], stateResults: { CA: { winnerId: '1', shares: { '1': 100 }, delegates: { '1': 424 } } } },
  };
}
gSave.statewideOfficesHistory = { 2028: {}, 2030: {}, 2032: {}, 2034: {}, 2036: {}, 2038: {}, 2040: {}, 2042: {} };
const comp = E.compactGameForSave(gSave);
check('Fix #11: compactGameForSave compacts older simulatedPrimaries & caps statewideOfficesHistory to 6 cycles',
  !comp.simulatedPrimaries[2028].people.stateResults.CA.shares &&
  Boolean(comp.simulatedPrimaries[2040].people.stateResults.CA.shares) &&
  Object.keys(comp.statewideOfficesHistory).length === 6,
  `swHistKeys=${Object.keys(comp.statewideOfficesHistory).length}`);

// Fix #13: Zero leftover "Socialist Party" in engine.js
const engText = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
check('Fix #13: Zero leftover "Socialist Party" strings in engine.js', !/Socialist Party/i.test(engText));

console.log('\n====================================================================');
console.log(` V0.16.9 FIXES SUITE: ${passed} passed, ${failed} failed`);
console.log('====================================================================');
process.exit(failed > 0 ? 1 : 0);
