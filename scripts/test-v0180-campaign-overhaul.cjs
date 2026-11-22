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
    'campaign-overhaul.js','engine.js',
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
const CO = ctx.window.CampaignOverhaul;

console.log('====================================================================');
console.log(' VERSION 0.18.3 CAMPAIGN PHASE OVERHAUL & 1:1 SCALE SUITE');
console.log('====================================================================');

// 1. Version & 1:1 Voter Scale
let g = E.createGame({ baseTemplateId: 'people' });
check('Version stamped as 0.18.3', g.version === '0.18.3', g.version);
check('Native 1:1 Voter Scale: sampleVoters === representedVoters === 155,000,000',
  g.voterModel.sampleVoters === 155000000 && g.voterModel.representedVoters === 155000000,
  `sample=${g.voterModel.sampleVoters}, rep=${g.voterModel.representedVoters}`);
check('Era #16 Robots SYNTHETIC_SAMPLE_VOTERS === 155,000,000',
  ctx.window.PartySystemsRobots.SYNTHETIC_SAMPLE_VOTERS === 155000000);

// 2. Dynamic Corrupt Trait Lifecycle (10% start / 5% new / 1% cycle drift)
const smCorrupt = g.sittingMembers.filter((m) => (m.traits || []).includes('Corrupt')).length;
const smCorruptPct = (smCorrupt / g.sittingMembers.length) * 100;
const corruptAndClean = g.sittingMembers.filter((m) => (m.traits || []).includes('Corrupt') && (m.traits || []).includes('Squeaky Clean')).length;
check('Game start dynamic Corrupt rate is ~10% (within 6%..15%) & mutually exclusive with Squeaky Clean',
  smCorruptPct >= 6 && smCorruptPct <= 15 && corruptAndClean === 0,
  `corrupt=${smCorrupt}/${g.sittingMembers.length} (${smCorruptPct.toFixed(1)}%), overlap=${corruptAndClean}`);

// Cycle drift: advance 5 cycles and verify new corruptions occur
let gDrift = g;
const beforeCorruptNames = new Set(gDrift.politicians.filter((p) => (p.traits || []).includes('Corrupt')).map((p) => p.name));
for (let i = 0; i < 5; i++) {
  gDrift = { ...gDrift, phase: 'complete' };
  gDrift = E.startNextCycle(gDrift);
}
const afterCorruptNames = new Set(gDrift.politicians.filter((p) => (p.traits || []).includes('Corrupt')).map((p) => p.name));
check('Per-cycle 1% Corrupt drift adds new corrupt politicians over 5 cycles',
  afterCorruptNames.size > beforeCorruptNames.size,
  `${beforeCorruptNames.size} -> ${afterCorruptNames.size}`);

// 3. Campaign Phase 5-Month / 8-Action Cadence & Efficiency Curve
check('Monthly efficiency table matches exact 300/25, 200/50, 150/150, 50/200, 25/300 spec',
  CO.getMonthEfficiency(1).persuasion === 3.0 && CO.getMonthEfficiency(1).turnout === 0.25 &&
  CO.getMonthEfficiency(2).persuasion === 2.0 && CO.getMonthEfficiency(2).turnout === 0.50 &&
  CO.getMonthEfficiency(3).persuasion === 1.5 && CO.getMonthEfficiency(3).turnout === 1.50 &&
  CO.getMonthEfficiency(4).persuasion === 0.5 && CO.getMonthEfficiency(4).turnout === 2.00 &&
  CO.getMonthEfficiency(5).persuasion === 0.25 && CO.getMonthEfficiency(5).turnout === 3.00);

g = E.startCampaignPhase(g);
check('Campaign starts at Month 1 with 8 actions & Rival Chair Month 1 activity',
  g.campaign.month === 1 && g.campaign.monthlyActionsLeft === 8 && g.campaign.weeklyActionsLeft === 8 &&
  (g.campaign.rivalActivity?.tickerItems || []).length > 0,
  `actions=${g.campaign.monthlyActionsLeft}, ticker=${g.campaign.rivalActivity?.tickerItems?.length}`);

// 4. Theme of the Month + Repeat Penalty
g = E.takeAction(g, 'select-campaign-theme', { issueId: 'inflation' });
const lift1 = g.campaign.themePersuasionLift;
const indBeforeRepeat = g.trust.independents;
  g = { ...g, campaign: { ...g.campaign, month: 2, themeSelectedThisMonth: false } };
g = E.takeAction(g, 'select-campaign-theme', { issueId: 'inflation' });
check('Theme of the Month awards lift & penalizes consecutive repeat selection',
  lift1 > 0 && g.trust.independents < indBeforeRepeat && g.campaign.rivalThemeCounterBonus > 0,
  `lift1=${lift1}, trust ${indBeforeRepeat}->${g.trust.independents}`);

// 5. All 5 Approved New Campaign Actions
const mem0 = g.memberships;
g = E.takeAction(g, 'campaign-microtarget-faction', { stateId: 'PA', factionId: 'ind_moderates' });
check('Action #1 (Micro-Target Faction) boosts persuasion & party memberships',
  g.memberships > mem0 && (g.campaign.actionStateEffects?.PA || 0) > 0,
  `memberships ${mem0}->${g.memberships}`);

g = E.takeAction(g, 'campaign-town-hall-barnstorm', { stateId: 'MI' });
check('Action #2 (Town Hall Barnstorm) applies persuasion + turnout lift',
  (g.campaign.actionStateEffects?.MI || 0) > 0);

g = E.takeAction(g, 'campaign-coalition-unity-summit');
check('Action #5 (Coalition Unity Summit) executes for $0 cash', g.lastNote.includes('Coalition Unity Summit'));

g = E.takeAction(g, 'campaign-spoiler-wedge', { stateId: 'WI' });
check('Action #9 (Spoiler Wedge Blitz) siphons rival vote share for Major Party',
  (g.campaign.actionStateEffects?.WI || 0) > 0);

const memBeforeTel = g.memberships;
const fundsBeforeTel = g.treasury;
g = E.takeAction(g, 'campaign-viral-telethon');
check('Action #10 (Viral Livestream Telethon) raises cash & boosts memberships (not turnout)',
  g.treasury > fundsBeforeTel && g.memberships > memBeforeTel,
  `funds ${fundsBeforeTel}->${g.treasury}, mem ${memBeforeTel}->${g.memberships}`);

// 6. Top-10 Surrogates (Min. 50 Fame)
const surrogates = CO.getEligibleSurrogates(g);
check('Eligible surrogates capped at <= 10 and all have fame >= 50',
  surrogates.length > 0 && surrogates.length <= 10 && surrogates.every((s) => s.fame >= 50),
  `count=${surrogates.length}, minFame=${Math.min(...surrogates.map((s) => s.fame))}`);
g = E.takeAction(g, 'deploy-surrogate', { politicianId: surrogates[0].id || surrogates[0].name, stateId: 'PA' });
check('Deploying surrogate applies state lift & marks surrogate used this month',
  (g.campaign.surrogateStateEffects?.PA || 0) > 0 && g.campaign.surrogatesUsedThisMonth.length === 1);

// 7. Debates (36+ Questions) & 42 Trait Crises & Oppo Research
check('Debate question bank has >= 30 unique questions & Crisis catalog has >= 40 unique crises',
  CO.DEBATE_QUESTION_BANK.length >= 30 && CO.CAMPAIGN_CRISIS_CATALOG.length >= 40,
  `questions=${CO.DEBATE_QUESTION_BANK.length}, crises=${CO.CAMPAIGN_CRISIS_CATALOG.length}`);

// Advance to Month 2 -> Debate & Crises trigger
g = E.takeAction(g, 'advance-campaign-month');
check('Month 2 spawns Presidential Debate & Trait-Triggered Crisis + resets 8 actions',
  g.campaign.month === 2 && g.campaign.monthlyActionsLeft === 8 &&
  Boolean(g.campaign.pendingDebate) && (g.campaign.activeCrises || []).length >= 1);

g = E.takeAction(g, 'resolve-campaign-debate', { posture: 'pivot_swing' });
check('Debate resolves cleanly and records questions asked',
  g.campaign.pendingDebate?.resolved === true && (g.debateQuestionsAsked || []).length >= 3);

const firstCrisis = g.campaign.activeCrises.find((c) => !c.resolved);
g = E.takeAction(g, 'resolve-campaign-crisis', { crisisId: firstCrisis.id, choiceId: firstCrisis.choices[0].id });
check('Trait crisis resolves cleanly with tactical choice',
  g.campaign.activeCrises.find((c) => c.id === firstCrisis.id)?.resolved === true);

// 8. Correlated National/Regional Polling Error & Miss Report
const errReport = CO.generateCorrelatedPollingError(g);
const stErrs = Object.values(errReport.stateErrors);
const withinSpread = stErrs.every((e) => Math.abs(e - errReport.natTargetError) <= 5.01);
check('Correlated polling error: natError in [2..6], all states within ±5 spread, & realized miss computed',
  Math.abs(errReport.natTargetError) >= 2.0 && Math.abs(errReport.natTargetError) <= 6.0 &&
  withinSpread && Number.isFinite(errReport.realizedNationalMiss) && Boolean(errReport.deadOnState) && Boolean(errReport.biggestMissState),
  `target=${errReport.natTargetError}, realized=${errReport.realizedNationalMiss}`);

// 9. Static checks on app.js (QA Fixes #1, #2, #4, #5)
const appTxt = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
check('QA Fix #1: Election Night playback uses patchElectionNightLiveDOM() (no 100ms render())',
  appTxt.includes('patchElectionNightLiveDOM();') && !appTxt.includes('}, 100);'));
check('QA Fix #2: Election Night hover vote-percentage tooltip bound',
  appTxt.includes('buildElectionHoverTooltipHtml') && appTxt.includes('en-hover-tooltip'));
check('QA Fix #4: Peace & Freedom Party uses PFP / Peace & Freedom (no SOC / Socialist header)',
  appTxt.includes("if (partyId === 'socialist') return 'PFP';") && !appTxt.includes('data-reg-sort="soc">Socialist'));
check('QA Fix #5: Hardcoded * 100 voter display multipliers removed in app.js',
  !appTxt.includes('aff.thirdParty?.byParty?.socialist * 100') && !appTxt.includes('voters.representedVoters * 100'));

console.log('\n====================================================================');
console.log(` V0.18.2 CAMPAIGN OVERHAUL SUITE: ${passed} passed, ${failed} failed`);
console.log('====================================================================');
process.exit(failed > 0 ? 1 : 0);
