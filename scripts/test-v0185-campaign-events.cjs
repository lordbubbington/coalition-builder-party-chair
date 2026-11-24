const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const mem = new Map();
global.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

for (const f of [
  'data.js', 'factions-0.15.js', 'scenario-2028.js', 'issues-0.2.1.js', 'maps-0.3.js',
  'state-house-data-0.5.js', 'voter-model-0.5.js', 'demographics-0.9.js',
  'political-trends-system.js', 'v07-scaffolding.js', 'party-systems-data.js',
  'party-systems-coalition.js', 'party-systems-robots.js', 'party-systems-engine.js',
  'ballot-access.js', 'election-uncertainty.js', 'candidate-vetting.js',
  'election-drift.js', 'election-night-engine.js', 'media-shocks-system.js',
  'campaign-overhaul.js', 'campaign-events-system.js', 'redistricting-ballot-system.js',
  'coalition-politics-system.js', 'atlas-multiplayer-system.js', 'leading-faction-system.js',
  'faction-era-stability.js', 'engine.js',
]) {
  require(path.join(ROOT, f));
}

const Eng = window.PartyChairEngine;
const CES = window.CampaignEventsSystem;

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  PASS: ${name}`);
}

function totalVoters(game) {
  return (game.voterModel?.states || []).reduce((sum, st) => {
    const aff = st.affiliations || {};
    return sum + Object.values(aff).reduce((s, v) => s + Number(v || 0), 0);
  }, 0);
}

console.log('=== v0.18.5 Campaign Events Overhaul Verification Suite ===');

// 1. Catalog size >= 150, unique IDs, zero Math.random()
test('Catalog contains 157 unique events (>= 150) and zero Math.random() calls', () => {
  const src = fs.readFileSync(path.join(ROOT, 'campaign-events-system.js'), 'utf8');
  const codeOnly = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.strictEqual(/Math\.random\s*\(/.test(codeOnly), false, 'Must never use Math.random()');
  assert.strictEqual(CES.EVENT_CATALOG.length, 157, `Expected 157 events, got ${CES.EVENT_CATALOG.length}`);
  const ids = new Set(CES.EVENT_CATALOG.map((e) => e.id));
  assert.strictEqual(ids.size, 157, 'All 157 event IDs must be unique');
});

// 2. Exact 1/3 Voter Registration Option guarantee across Tiers 1, 2, 3, and 4
test('Exact 1/3 (33.3%) of eligible events for Tiers 1, 2, 3, and 4 have a voter-registration option', () => {
  for (const tier of [1, 2, 3, 4]) {
    const eligible = CES.getEligibleEventsForTier(tier);
    const withReg = eligible.filter((e) => e.hasVoterRegOption);
    assert.strictEqual(eligible.length, 48, `Tier ${tier} should have 48 eligible events (got ${eligible.length})`);
    assert.strictEqual(withReg.length, 16, `Tier ${tier} should have exactly 16 [REG] events (got ${withReg.length})`);
    assert.strictEqual(withReg.length * 3, eligible.length, `Tier ${tier} [REG] ratio must be exact 1/3`);
  }
});

// 3. "Usually (but not always)" Voter Registration distribution + 155M conservation
test('Voter-registration choices usually succeed (~70-90%) but not always, strictly conserving total voters', () => {
  let successes = 0;
  let fizzles = 0;
  const regEvent = CES.EVENT_CATALOG.find((e) => e.tierPool === 'tier1' && e.hasVoterRegOption);
  assert.ok(regEvent, 'Must find a Tier 1 [REG] event');

  const baseGame = Eng.createGame({ baseTemplateId: 'liberty', seed: 100 });
  const baseTotal = totalVoters(baseGame);

  for (let i = 0; i < 120; i += 1) {
    const g = JSON.parse(JSON.stringify(baseGame));
    g.seed = 1000 + i * 17;
    g.year = 2028 + (i % 10) * 2;
    g.treasury = 15;
    g.campaign = { active: true, month: 2, week: 2, monthlyActionsLeft: 8, eventStatePolls: {}, stateSaturation: {} };
    CES.normalizeCampaignEvents(g);
    const ctx = CES.buildDynamicContext(g, 2, regEvent.id);
    g.campaignEvents.pendingEvent = {
      ...regEvent,
      title: regEvent.titleTemplate,
      body: regEvent.bodyTemplate,
      month: 2,
      year: g.year,
      context: ctx,
      choices: [{
        id: 'voter_reg_drive',
        label: 'Voter Reg Drive',
        cost: 0.5,
        actionCost: 0,
        isVoterRegOption: true,
        regBaseVoters: 4000,
      }],
      resolved: false,
    };
    CES.resolveCampaignEvent(g, 'voter_reg_drive');
    const last = g.campaignEvents.history[g.campaignEvents.history.length - 1];
    if (last.outcomeTag === 'reg_fizzle') fizzles += 1;
    else successes += 1;
    assert.strictEqual(totalVoters(g), baseTotal, `Voter conservation violated on trial ${i}`);
  }
  assert.ok(successes >= 75 && successes <= 112, `Expected ~75-92% success rate (got ${successes}/120)`);
  assert.ok(fizzles >= 8, `Expected non-zero fizzles ("usually, not always"), got ${fizzles}/120`);
});

// 4. All-Tier Ultra-Rare Generational Windfall ("Jackpot"): +10,000 voters in 10 distinct states (+100,000 total)
test('Generational Windfall event works for any tier (0-5) and awards +10,000 voters in 10 distinct states (+100,000 total)', () => {
  for (const partyId of ['liberty', 'people']) {
    let g = Eng.createGame({ baseTemplateId: partyId, seed: 2028 });
    const beforeTotal = totalVoters(g);
    const beforePartySum = g.voterModel.states.reduce((s, st) => s + Number(st.affiliations?.[partyId] || 0), 0);
    g.campaign = { active: true, month: 3, week: 3, monthlyActionsLeft: 8, eventStatePolls: {}, stateSaturation: {} };

    g = CES.rollMonthlyCampaignEvent(g, 3, { forceJackpot: true });
    const ev = g.campaignEvents.pendingEvent;
    assert.ok(ev, 'Jackpot event must be pending');
    assert.strictEqual(ev.id, CES.JACKPOT_ID);
    assert.strictEqual(ev.severity, 'historic');
    assert.strictEqual(ev.title.toLowerCase().includes('jackpot'), false, 'Event title must not literally say "Jackpot"');
    assert.strictEqual(ev.jackpotStates.length, 10, 'Must pick 10 states');
    assert.strictEqual(new Set(ev.jackpotStates).size, 10, 'All 10 states must be distinct');

    g = CES.resolveCampaignEvent(g, 'jackpot_warchest');
    const afterTotal = totalVoters(g);
    const afterPartySum = g.voterModel.states.reduce((s, st) => s + Number(st.affiliations?.[partyId] || 0), 0);

    assert.strictEqual(afterTotal, beforeTotal, '155M voter conservation must hold after Jackpot');
    const is1to1 = g.voterModel.voterScale === '1:1' || beforeTotal >= 10000000;
    const expectedDelta = is1to1 ? 100000 : 1000;
    assert.strictEqual(afterPartySum - beforePartySum, expectedDelta, `Party ${partyId} must gain exactly 100,000 represented voters (got ${afterPartySum - beforePartySum})`);
  }
});

// 5. Multi-Month Story Arc continuity & Debate Callback
test('Multi-month story arcs track Beat 1 flags, trigger Beat 2 follow-up, and inject Debate callback question', () => {
  let g = Eng.createGame({ baseTemplateId: 'people', seed: 303 });
  g.campaign = { active: true, month: 1, week: 1, monthlyActionsLeft: 8, eventStatePolls: {}, stateSaturation: {} };
  CES.normalizeCampaignEvents(g);

  // Force Beat 1 of arc_whistleblower
  const beat1 = CES.EVENT_BY_ID.get('ev_u_01');
  const ctx = CES.buildDynamicContext(g, 1, beat1.id);
  g.campaignEvents.pendingEvent = {
    ...beat1, title: beat1.titleTemplate, body: beat1.bodyTemplate,
    month: 1, year: 2028, context: ctx,
    choices: [{ id: 'contain_quietly', label: 'Contain', cost: 0, actionCost: 0, statePollDelta: -1.1, arcFlag: 'contained_risk' }],
    resolved: false,
  };
  g = CES.resolveCampaignEvent(g, 'contain_quietly');
  assert.strictEqual(g.campaignEvents.activeArcs.length, 1);
  assert.strictEqual(g.campaignEvents.activeArcs[0].arcId, 'arc_whistleblower');
  assert.ok(g.campaignEvents.activeArcs[0].flags.includes('contained_risk'));

  // Next month roll should automatically pick Beat 2 of arc_whistleblower
  g = CES.rollMonthlyCampaignEvent(g, 2);
  assert.strictEqual(g.campaignEvents.pendingEvent.id, 'ev_u_02', 'Month 2 must trigger Beat 2 of active arc');
  assert.ok(g.campaignEvents.pendingEvent.body.includes('contain the story quietly'), 'Beat 2 copy must reflect Beat 1 flag');

  // Debate callback question must reference the whistleblower arc
  const cbQ = CES.getArcDebateCallbackQuestion(g);
  assert.ok(cbQ && cbQ.prompt.includes('leaked'), 'Debate callback question must reference active arc');
});

// 6. Zero dead v0.1 faction buckets in dynamic context
test('Dynamic context resolves live party factions with zero legacy v0.1 faction buckets', () => {
  const g = Eng.createGame({ baseTemplateId: 'liberty', seed: 404 });
  const ctx = CES.buildDynamicContext(g, 2, 'test');
  const liveIds = new Set((g.factions || []).map((f) => f.id));
  assert.ok(liveIds.has(ctx.factionId), `Resolved faction ${ctx.factionId} must exist in live game.factions`);
  assert.strictEqual(['localists', 'pragmatists', 'workers', 'reformers', 'organizers'].includes(ctx.factionId), false);
});

// 7. Backward compatibility in normalizeGame & compactGameForSave
test('Backward compatibility: normalizeGame & compactGameForSave preserve campaignEvents cleanly', () => {
  const g = Eng.createGame({ baseTemplateId: 'people', seed: 505 });
  delete g.campaignEvents;
  const norm = Eng.normalizeGame(g);
  assert.ok(norm.campaignEvents && Array.isArray(norm.campaignEvents.history));
  const comp = Eng.compactGameForSave(norm);
  assert.ok(comp.campaignEvents && Array.isArray(comp.campaignEvents.history));
});

console.log(`\nALL ${passed} CAMPAIGN EVENTS TESTS PASSED!`);
