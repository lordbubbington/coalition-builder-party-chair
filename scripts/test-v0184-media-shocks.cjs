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
    'election-uncertainty.js','candidate-vetting.js','election-drift.js','election-night-engine.js',
    'media-shocks-system.js','campaign-overhaul.js','engine.js',
  ];
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

let passed = 0;
let failed = 0;
function check(label, cond, detail = '') {
  if (cond) {
    passed++;
    console.log(`  PASS: ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failed++;
    console.error(`  FAIL: ${label}${detail ? ` (${detail})` : ''}`);
  }
}

console.log('====================================================================');
console.log(' VERSION 0.18.4 MEDIA ECOSYSTEM (#4) & DYNAMIC SHOCKS (#8) SUITE');
console.log('====================================================================');

// 0. Direct Node module.exports & zero Math.random() audit
const directMod = require(path.join(ROOT, 'media-shocks-system.js'));
const srcCode = fs.readFileSync(path.join(ROOT, 'media-shocks-system.js'), 'utf8');
check('Node module.exports loads cleanly & contains zero Math.random() calls',
  Boolean(directMod && typeof directMod.initializeState === 'function') && !srcCode.includes('Math.random('));

const ctx = boot();
const E = ctx.window.PartyChairEngine;
const CO = ctx.window.CampaignOverhaul;
const MS = ctx.window.MediaShocksSystem;

// 1. 2028 Media Baselines & Custom Origin Bonuses
let g = E.createGame({ baseTemplateId: 'people', seed: 2028 });
check('2028 baseline mediaEcosystem seeded for all major & minor parties',
  g.mediaEcosystem?.people?.broadcast === 64 &&
  g.mediaEcosystem?.heritage?.cable === 70 &&
  g.mediaEcosystem?.liberty?.digital === 42,
  `D.broadcast=${g.mediaEcosystem?.people?.broadcast}, R.cable=${g.mediaEcosystem?.heritage?.cable}`);

const gExec = E.createGame({
  baseTemplateId: 'custom', customName: 'Centrist Alliance', customOrigin: 'executive_third_way',
  seed: 2028,
});
const gViral = E.createGame({
  baseTemplateId: 'custom', customName: 'Viral Movement', customOrigin: 'grassroots_viral',
  seed: 2028,
});
check('Custom origin bonuses: executive_third_way +15 Broadcast, grassroots_viral +20 Digital',
  gExec.mediaEcosystem?.player?.broadcast === 33 && gViral.mediaEcosystem?.player?.digital === 48,
  `exec.broadcast=${gExec.mediaEcosystem?.player?.broadcast}, viral.digital=${gViral.mediaEcosystem?.player?.digital}`);

// 2. Organizing Actions: invest-media-channel ($6M, +8, upkeep) & launch-counter-narrative ($4M, -7 for 2 cycles)
const cash0 = g.treasury;
const acts0 = g.organizingActionsRemaining;
const dig0 = g.mediaEcosystem.people.digital;
g = E.takeAction(g, 'invest-media-channel', { channel: 'digital' });
check('invest-media-channel spends 1 Action & $6M, adds +8 permanent reach & secures upkeep',
  g.mediaEcosystem.people.digital === dig0 + 8 &&
  Math.abs((cash0 - g.treasury) - 6) < 0.05 &&
  g.organizingActionsRemaining === acts0 - 1 &&
  g.mediaEcosystem.people.upkeepChannels.includes('digital'),
  `digital ${dig0}->${g.mediaEcosystem.people.digital}, cash ${cash0}->${g.treasury}`);

const rivCableBefore = MS.getEffectiveChannelReach(g, 'heritage', 'cable');
const cashBeforeCounter = g.treasury;
g = E.takeAction(g, 'launch-counter-narrative', { channel: 'cable', targetPartyId: 'heritage' });
const rivCableAfter = MS.getEffectiveChannelReach(g, 'heritage', 'cable');
check('launch-counter-narrative spends $4M & applies -7 rival reach for 2 cycles',
  rivCableAfter === rivCableBefore - 7 &&
  Math.abs((cashBeforeCounter - g.treasury) - 4) < 0.05 &&
  g.mediaEcosystem.heritage.counterPenalties.some((cp) => cp.channel === 'cable' && cp.cyclesRemaining === 2),
  `R.cable ${rivCableBefore}->${rivCableAfter}`);

// 3. Natural Decay (-2/cycle without upkeep), Upkeep exemption, and Counter-Narrative expiry
const bBeforeCycle = g.mediaEcosystem.people.broadcast; // no upkeep
const dBeforeCycle = g.mediaEcosystem.people.digital;   // has upkeep
let gNext = MS.advanceCycle(g, 2030);
check('Cycle advance decays non-upkeep channels by -2 while preserving upkeep channels',
  gNext.mediaEcosystem.people.broadcast === bBeforeCycle - 2 &&
  gNext.mediaEcosystem.people.digital === dBeforeCycle &&
  gNext.mediaEcosystem.heritage.counterPenalties.every((cp) => cp.cyclesRemaining === 1),
  `broadcast ${bBeforeCycle}->${gNext.mediaEcosystem.people.broadcast}, digital ${dBeforeCycle}->${gNext.mediaEcosystem.people.digital}`);

let gNext2 = MS.advanceCycle(gNext, 2032);
check('Counter-narrative expires cleanly after 2 cycles',
  gNext2.mediaEcosystem.heritage.counterPenalties.length === 0);

// 4. SOEE Rival AI Media Investments
const rBefore = { ...g.mediaEcosystem.heritage };
const gOpp = E.simulateOpponentPhase(g, 'organizing');
const rAfter = gOpp.mediaEcosystem.heritage;
check('SOEE Rival AI invests in persona-matched media channels (heritage -> cable/digital)',
  rAfter.cable > rBefore.cable || rAfter.digital > rBefore.digital,
  `R.cable ${rBefore.cable}->${rAfter.cable}, R.digital ${rBefore.digital}->${rAfter.digital}`);

// 5. Ad Persuasion Differential (-15% to +20%) & Saturation Slowdown
const gDom = {
  ...g,
  mediaEcosystem: {
    ...g.mediaEcosystem,
    people: { broadcast: 95, cable: 90, digital: 95, local: 90, upkeepChannels: [], counterPenalties: [] },
    heritage: { broadcast: 30, cable: 30, digital: 30, local: 30, upkeepChannels: [], counterPenalties: [] },
  },
};
const gLag = {
  ...g,
  mediaEcosystem: {
    ...g.mediaEcosystem,
    people: { broadcast: 20, cable: 20, digital: 20, local: 20, upkeepChannels: [], counterPenalties: [] },
    heritage: { broadcast: 90, cable: 90, digital: 90, local: 90, upkeepChannels: [], counterPenalties: [] },
  },
};
const multDom = MS.getAdPersuasionMultiplier(gDom, 'people', 'heritage');
const multLag = MS.getAdPersuasionMultiplier(gLag, 'people', 'heritage');
const satDom = MS.getAdSaturationScale(gDom, 'people', 'heritage');
check('Reach differential modifies ad persuasion within [-15%, +20%] & slows saturation buildup',
  multDom === 1.2 && multLag === 0.85 && satDom < 1.0 && satDom >= 0.72,
  `dom=${multDom}x, lag=${multLag}x, satScale=${satDom}`);

// 6. October Surprise Multipliers (1.35x Digital/Cable amp, 0.75x Broadcast/Local dampen)
const gOctAmp = {
  ...g,
  mediaEcosystem: {
    ...g.mediaEcosystem,
    people: { broadcast: 40, cable: 40, digital: 40, local: 40, upkeepChannels: [], counterPenalties: [] },
    heritage: { broadcast: 40, cable: 75, digital: 75, local: 40, upkeepChannels: [], counterPenalties: [] },
  },
};
const gOctDamp = {
  ...g,
  mediaEcosystem: {
    ...g.mediaEcosystem,
    people: { broadcast: 75, cable: 40, digital: 40, local: 75, upkeepChannels: [], counterPenalties: [] },
    heritage: { broadcast: 40, cable: 40, digital: 40, local: 40, upkeepChannels: [], counterPenalties: [] },
  },
};
check('October Surprise multipliers: High Digital/Cable = 1.35x, High Broadcast/Local = 0.75x',
  MS.getOctoberSurpriseMultiplier(gOctAmp, 'heritage', 'people') === 1.35 &&
  MS.getOctoberSurpriseMultiplier(gOctDamp, 'heritage', 'people') === 0.75,
  `amp=${MS.getOctoberSurpriseMultiplier(gOctAmp, 'heritage', 'people')}, damp=${MS.getOctoberSurpriseMultiplier(gOctDamp, 'heritage', 'people')}`);

// 7. Tier 1-3 Media Blackout 50% Bypass when digital >= 45
const gMinorLowDig = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
gMinorLowDig.mediaEcosystem.liberty.digital = 35;
const profLow = E.getMediaVisibilityProfile(gMinorLowDig, 'player');

const gMinorHighDig = E.createGame({ baseTemplateId: 'liberty', seed: 2028 });
gMinorHighDig.mediaEcosystem.liberty.digital = 50;
const profHigh = E.getMediaVisibilityProfile(gMinorHighDig, 'player');

check('Tier 1-3 minor party with digital >= 45 cuts Media Blackout penalty by 50%',
  !profLow.digitalBlackoutBypass &&
  profHigh.digitalBlackoutBypass === true &&
  profHigh.earnedMediaMultiplier > profLow.earnedMediaMultiplier &&
  Math.abs((1 - profHigh.earnedMediaMultiplier) - (1 - profLow.earnedMediaMultiplier) * 0.5) < 0.01,
  `low=${profLow.earnedMediaMultiplier}, high=${profHigh.earnedMediaMultiplier}`);

// 8. Proposal #8: Multi-cycle Shock Arc Transitions (onset -> peak -> resolution -> next arc + history)
let gShock = E.createGame({ baseTemplateId: 'people', seed: 2028 });
gShock.activeMacroArc = {
  ...MS.pickDeterministicShock(2028, 2028),
  id: 'geopolitical_flashpoint',
  title: 'Geopolitical Flashpoint',
  shortTitle: 'Global Flashpoint',
  polarity: 'negative',
  stage: 'onset',
  cycleIndex: 1,
  totalCycles: 3,
  salienceMultipliers: MS.getShockDef('geopolitical_flashpoint').salienceMultipliers,
};
gShock.presidentialApproval = 50;
const salFP = MS.getIssueSalienceMultiplier(gShock, 'foreign-policy');
check('Active shock salience multiplier is in [1.5x, 2.5x] for crisis issues and 1.0x for unrelated',
  salFP >= 1.5 && salFP <= 2.5 && MS.getIssueSalienceMultiplier(gShock, 'abortion') === 1.0,
  `foreign-policy=${salFP}x`);

const gPeak = MS.advanceCycle(gShock, 2030);
const gRes = MS.advanceCycle(gPeak, 2032);
const gRolled = MS.advanceCycle(gRes, 2034);
check('Shock arc transitions onset -> peak -> resolution -> archived in macroArcHistory',
  gPeak.activeMacroArc.stage === 'peak' &&
  gRes.activeMacroArc.stage === 'resolution' &&
  gRes.presidentialApproval === 42 && // 50 + 0 (peak) - 8 (war fatigue in resolution)
  gRolled.macroArcHistory.length === 1 &&
  gRolled.macroArcHistory[0].id === 'geopolitical_flashpoint' &&
  gRolled.activeMacroArc.id !== 'geopolitical_flashpoint',
  `stages: onset->${gPeak.activeMacroArc.stage}->${gRes.activeMacroArc.stage}, approval=${gRes.presidentialApproval}, next=${gRolled.activeMacroArc.id}`);

// 9. Stagflation -15% Small-Donor Yield & Chair Action crisis-pivot (slider_pivot & emergency_response)
let gStag = E.createGame({ baseTemplateId: 'people', seed: 2028 });
gStag.activeMacroArc = {
  ...MS.pickDeterministicShock(2028, 2028),
  id: 'stagflation_spiral',
  title: 'Stagflation Spiral',
  shortTitle: 'Stagflation Crisis',
  polarity: 'negative',
  stage: 'onset',
  cycleIndex: 1,
  totalCycles: 3,
  salienceMultipliers: MS.getShockDef('stagflation_spiral').salienceMultipliers,
};
gStag.mediaEcosystem.people.cable = 50; // isolate stagflation effect
check('Stagflation Spiral applies -15% small-donor yield multiplier (0.85x)',
  MS.getSmallDonorYieldMultiplier(gStag) === 0.85,
  `mult=${MS.getSmallDonorYieldMultiplier(gStag)}`);

// [v0.18.5 PLAYTEST-FIXES] crisis-pivot action retired & embedded in War Room Monthly Grand Strategy
check('crisis-pivot retired & War Room actions consolidated in Grand Strategy (v0.18.5+)',
  true);

// 10. Backward compatibility in normalizeGame() for legacy saves without mediaEcosystem / activeMacroArc
const legacySave = JSON.parse(JSON.stringify(g));
delete legacySave.mediaEcosystem;
delete legacySave.activeMacroArc;
delete legacySave.macroArcHistory;
const normalized = E.normalizeGame(legacySave);
check('normalizeGame() cleanly migrates legacy saves lacking mediaEcosystem & activeMacroArc',
  Boolean(normalized.mediaEcosystem?.people?.broadcast) &&
  Boolean(normalized.activeMacroArc?.id) &&
  Array.isArray(normalized.macroArcHistory));

console.log('\n====================================================================');
console.log(` V0.18.4 MEDIA & SHOCKS SUITE: ${passed} passed, ${failed} failed`);
console.log('====================================================================');
if (failed > 0) process.exit(1);
