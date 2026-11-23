const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
global.window = global;
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

[
  'data.js',
  'factions-0.15.js',
  'scenario-2028.js',
  'issues-0.2.1.js',
  'maps-0.3.js',
  'state-house-data-0.5.js',
  'voter-model-0.5.js',
  'demographics-0.9.js',
  'political-trends-system.js',
  'political-texture-system.js',
  'v07-scaffolding.js',
  'party-systems-data.js',
  'party-systems-coalition.js',
  'party-systems-robots.js',
  'party-systems-engine.js',
  'ballot-access.js',
  'candidate-vetting.js',
  'election-uncertainty.js',
  'election-drift.js',
  'election-night-engine.js',
  'campaign-overhaul.js',
  'faction-era-stability.js',
  'engine.js',
].forEach((file) => require(path.join(ROOT, file)));

const Engine = global.PartyChairEngine;
const PSE = global.PartySystemsEngine;
const FES = global.FactionEraStability;

assert(Engine, 'PartyChairEngine should be loaded');
assert(PSE, 'PartySystemsEngine should be loaded');
assert(FES, 'FactionEraStability should be loaded');

console.log('=== [v0.18.4] Running Faction & Era Stability Unit Tests ===');

// -----------------------------------------------------------------------------
// TEST 1: 'unaffiliated' Guard Across All Subversion & Courtship Actions
// -----------------------------------------------------------------------------
{
  // 1a. Helper truth table
  ['none', 'independent', 'unaffiliated', '', null, undefined].forEach((pid) => {
    assert.strictEqual(Engine.isUnaffiliatedPartyId(pid), true, `Expected isUnaffiliatedPartyId(${JSON.stringify(pid)}) === true`);
    assert.strictEqual(FES.isUnaffiliatedPartyId(pid), true, `Expected FES.isUnaffiliatedPartyId(${JSON.stringify(pid)}) === true`);
  });
  ['people', 'heritage', 'green', 'liberty', 'player'].forEach((pid) => {
    assert.strictEqual(Engine.isUnaffiliatedPartyId(pid), false, `Expected isUnaffiliatedPartyId(${JSON.stringify(pid)}) === false`);
  });

  // 1b. Subversion actions strictly reject 'unaffiliated', 'none', and 'independent'
  ['unaffiliated', 'none', 'independent'].forEach((unaffPid) => {
    const game = Engine.createGame('people', { seed: 202801 });
    game.treasury = 50;
    game.organizingActionsRemaining = 10;
    const target = game.factions.find((f) => f.id === 'gop_suburban_moderates') || game.factions.find((f) => f.partyId === 'heritage');
    assert(target, 'Target faction must exist');
    target.partyId = unaffPid;
    target.happiness = 25;
    target.ultimatumTurnsRemaining = 2;
    game.factionHappiness[target.id] = 25;

    const r1 = Engine.takeAction(game, 'open-courtship-dialogue', { factionId: target.id });
    assert.strictEqual(r1.treasury, 50, `open-courtship-dialogue must reject partyId=${unaffPid}`);
    assert.strictEqual(r1.organizingActionsRemaining, 10, `open-courtship-dialogue must not spend action for partyId=${unaffPid}`);

    const r2 = Engine.takeAction(game, 'drive-coalition-wedge', { factionId: target.id });
    assert.strictEqual(r2.treasury, 50, `drive-coalition-wedge must reject partyId=${unaffPid}`);
    assert.strictEqual(r2.organizingActionsRemaining, 10, `drive-coalition-wedge must not spend action for partyId=${unaffPid}`);

    const r3 = Engine.takeAction(game, 'subsidize-dissident-caucus', { factionId: target.id });
    assert.strictEqual(r3.treasury, 50, `subsidize-dissident-caucus must reject partyId=${unaffPid}`);
    assert.strictEqual(r3.organizingActionsRemaining, 10, `subsidize-dissident-caucus must not spend action for partyId=${unaffPid}`);

    // 1c. court-independent-faction accepts all three ('unaffiliated', 'none', 'independent')
    const r4 = Engine.takeAction(game, 'court-independent-faction', { factionId: target.id });
    assert.strictEqual(r4.treasury, 48.5, `court-independent-faction must accept partyId=${unaffPid}`);
    assert.strictEqual(r4.organizingActionsRemaining, 9, `court-independent-faction must spend 1 action for partyId=${unaffPid}`);
    assert.strictEqual(r4.factionCourtship[target.id].people, 15, `court-independent-faction must add +15 goodwill for partyId=${unaffPid}`);

    // 1d. checkSummitEligibility accepts all three (with sufficient goodwill & reasonable distance)
    target.sliders = { economic: 5, social: 5, governance: 5 };
    target.happiness = 25;
    r4.factionHappiness[target.id] = 25;
    const elig = Engine.checkSummitEligibility(r4, target.id);
    assert.strictEqual(elig.eligible, true, `checkSummitEligibility should accept partyId=${unaffPid}, got reason=${elig.reason}`);
    assert.strictEqual(
      Boolean(elig.reason && elig.reason.includes('must secede')),
      false,
      `checkSummitEligibility must not reject partyId=${unaffPid} as still inside a parent party`
    );
  });

  console.log('PASS [1]: Unaffiliated guard across subversion & courtship actions');
}

// -----------------------------------------------------------------------------
// TEST 2: Party Systems eraNumber Sync & Stale Realignment Modal Clearing
// -----------------------------------------------------------------------------
{
  let game = Engine.createGame('people', { seed: 202802 });
  game = PSE.normalizePartySystemsState(game);
  assert.strictEqual(game.partySystems.currentEraNumber, 7, 'Initial currentEraNumber should be 7');
  assert.strictEqual(game.partySystems.eraNumber, 7, 'Initial eraNumber should be synced to 7');

  // Transition Era 7 -> 8 in 2040
  const res8 = PSE.evaluateEraTransition(game, 2040, { rollOverride: 0.0 });
  assert.strictEqual(res8.transitioned, true, 'Should transition to Era 8 in 2040');
  game = res8.game;
  assert.strictEqual(game.partySystems.currentEraNumber, 8, 'currentEraNumber should be 8');
  assert.strictEqual(game.partySystems.eraNumber, 8, 'eraNumber should be synced to 8');
  assert.strictEqual(game.partySystems.pendingModal, 'realignment', 'Realignment modal should be staged for 2040');
  assert.strictEqual(game.partySystems.modalPayload.year, 2040, 'Modal payload year should be 2040');

  // Verify stale prior-year modal is cleared on next cycle even before next eligibility floor
  const midRes = PSE.evaluateEraTransition(game, 2042, { rollOverride: 0.99 });
  assert.strictEqual(midRes.transitioned, false, '2042 is before Era 9 eligibility floor');
  assert.strictEqual(midRes.game.partySystems.pendingModal, null, 'Stale 2040 realignment modal must be cleared in 2042');
  assert.strictEqual(midRes.game.partySystems.modalPayload, null, 'Stale 2040 modalPayload must be cleared in 2042');

  // Keep a stale 2040 modal deliberately attached and jump straight to 2070 for Era 8 -> 9
  const res9 = PSE.evaluateEraTransition(game, 2070, { rollOverride: 0.0 });
  assert.strictEqual(res9.transitioned, true, 'Should transition to Era 9 in 2070 despite stale 2040 modal');
  game = res9.game;
  assert.strictEqual(game.partySystems.currentEraNumber, 9, 'currentEraNumber should be 9');
  assert.strictEqual(game.partySystems.eraNumber, 9, 'eraNumber should be synced to 9');
  assert.strictEqual(game.partySystems.pendingModal, 'realignment', 'Fresh 2070 realignment modal should be staged');
  assert.strictEqual(game.partySystems.modalPayload.year, 2070, 'Modal payload year should be updated to 2070');

  // Verify normalizePartySystemsState preserves sync when loading a legacy save missing eraNumber
  const legacySave = JSON.parse(JSON.stringify(game));
  delete legacySave.partySystems.eraNumber;
  const norm = PSE.normalizePartySystemsState(legacySave);
  assert.strictEqual(norm.partySystems.eraNumber, 9, 'normalizePartySystemsState must sync eraNumber from currentEraNumber');

  console.log('PASS [2]: Party Systems eraNumber sync (7 -> 8 -> 9) & stale realignment modal clearing');
}

// -----------------------------------------------------------------------------
// TEST 3: Ironclad Anchor Drift, Cohabitation Relief, and Realignment Charter
// -----------------------------------------------------------------------------
{
  // 3a. Anchor Realignment Drift reduces ideological distance over cycles
  const driftGame = Engine.createGame('heritage', { seed: 202803 });
  // Push party platform far left/centrist relative to gop_maga
  driftGame.player.economic = -0.8; // centroid econ = 5.5 - 3.6 = 1.9
  driftGame.player.social = -0.8;   // centroid soc  = 5.5 - 3.6 = 1.9
  const maga = driftGame.factions.find((f) => f.id === 'gop_maga');
  const otherGop = driftGame.factions.find((f) => f.partyId === 'heritage' && f.id !== 'gop_maga');
  assert(maga && otherGop, 'gop_maga and another heritage faction must exist');
  maga.sliders = { economic: 8.5, social: 9.0, governance: 8.0 };
  // Make gop_maga non-leading
  driftGame.factionDesignations[maga.id] = 'major';
  driftGame.factionDesignations[otherGop.id] = 'leading';

  const centroid = FES.getPartyPlatformCentroid(driftGame, 'heritage');
  const dist0 = Math.hypot(maga.sliders.economic - centroid.economic, maga.sliders.social - centroid.social);
  assert(dist0 > 3.0, `Initial distance ${dist0} should exceed 3.0`);

  const d1 = FES.applyAnchorRealignmentDrift(driftGame);
  assert(d1.drifted.length >= 1, 'Anchor should drift on cycle 1');
  assert.strictEqual(maga.sliders.economic, 8.15, 'Economic slider should drift by 0.35 toward centroid');
  assert.strictEqual(maga.sliders.social, 8.65, 'Social slider should drift by 0.35 toward centroid');
  const dist1 = Math.hypot(maga.sliders.economic - centroid.economic, maga.sliders.social - centroid.social);
  assert(dist1 < dist0, 'Distance should strictly decrease after cycle 1');

  FES.applyAnchorRealignmentDrift(driftGame);
  const dist2 = Math.hypot(maga.sliders.economic - centroid.economic, maga.sliders.social - centroid.social);
  assert(dist2 < dist1, 'Distance should continue decreasing on cycle 2');

  // 3b. Cohabitation Relief: non-leading anchor backlash halved & accordCooldownUntilYear immunity
  const cohabGame = Engine.createGame('heritage', { seed: 202804 });
  const magaC = cohabGame.factions.find((f) => f.id === 'gop_maga');
  const otherGopC = cohabGame.factions.find((f) => f.partyId === 'heritage' && f.id !== 'gop_maga');
  const progressiveTarget = cohabGame.factions.find((f) => f.id === 'dem_bernie_bros') || cohabGame.factions.find((f) => f.partyId === 'people');
  assert(magaC && otherGopC && progressiveTarget, 'Factions for cohabitation test must exist');
  progressiveTarget.partyId = 'unaffiliated';
  progressiveTarget.sliders = { economic: 1.0, social: 1.0, governance: 2.0 };
  magaC.sliders = { economic: 9.0, social: 9.0, governance: 8.0 };
  otherGopC.sliders = { economic: 9.0, social: 9.0, governance: 8.0 };
  // Baseline: magaC is leading & majority
  cohabGame.factionDesignations[magaC.id] = 'leading';
  cohabGame.factionDesignations[otherGopC.id] = 'major';
  if (cohabGame.voterModel?.factions) {
    cohabGame.voterModel.factions[magaC.id] = 30000000;
    cohabGame.voterModel.factions[otherGopC.id] = 5000000;
  }
  const baseDemands = Engine.generateMergerCoalitionDemands(cohabGame, progressiveTarget.id);
  const magaBasePreview = baseDemands.cohabitationPreview.find((x) => x.factionId === magaC.id);
  assert(magaBasePreview && magaBasePreview.impact === 'hostile' && magaBasePreview.happinessDelta < 0, 'Leading anchor should have hostile cohabitation backlash');

  // Non-leading anchor gets 50% relief, and faction under accordCooldownUntilYear > game.year gets 0 backlash
  cohabGame.factionDesignations[magaC.id] = 'major';
  cohabGame.factionDesignations[otherGopC.id] = 'leading';
  otherGopC.accordCooldownUntilYear = (cohabGame.year || 2028) + 6;
  const reliefDemands = Engine.generateMergerCoalitionDemands(cohabGame, progressiveTarget.id);
  const magaReliefPreview = reliefDemands.cohabitationPreview.find((x) => x.factionId === magaC.id);
  const immunePreview = reliefDemands.cohabitationPreview.find((x) => x.factionId === otherGopC.id);
  assert.strictEqual(
    magaReliefPreview.happinessDelta,
    Math.round(magaBasePreview.happinessDelta * 0.5 * 10) / 10,
    'Non-leading anchor hostile cohabitation backlash must be cut by 50%'
  );
  assert.strictEqual(immunePreview.happinessDelta, 0, 'Faction under accordCooldownUntilYear must skip cohabitation backlash');
  assert.strictEqual(immunePreview.impact, 'immune', 'Faction under accordCooldownUntilYear should be marked immune');

  // 3c. Party Realignment Charter transfers anchor lock & allows expelling legacy anchor
  let realignGame = Engine.createGame('heritage', { seed: 202805 });
  realignGame.treasury = 25;
  realignGame.organizingActionsRemaining = 10;
  const magaR = realignGame.factions.find((f) => f.id === 'gop_maga');
  const newLead = realignGame.factions.find((f) => f.partyId === 'heritage' && f.id !== 'gop_maga');
  assert(magaR && newLead, 'Must have gop_maga and another heritage faction');

  // Before realignment, gop_maga cannot be expelled
  const blockedExpel = Engine.takeAction(realignGame, 'expel-faction', { factionId: 'gop_maga' });
  assert.strictEqual(
    blockedExpel.factions.find((f) => f.id === 'gop_maga').partyId,
    'heritage',
    'gop_maga must remain protected before realignment charter'
  );

  // Make newLead the leading faction
  realignGame.factionDesignations['gop_maga'] = 'major';
  realignGame.factionDesignations[newLead.id] = 'leading';

  // Trigger Party Realignment Charter (2 Actions, $10M)
  realignGame = Engine.takeAction(realignGame, 'realign-party-anchor', {});
  assert.strictEqual(realignGame.treasury, 15, 'realign-party-anchor must cost $10M');
  assert.strictEqual(realignGame.organizingActionsRemaining, 8, 'realign-party-anchor must cost 2 Actions');
  assert(realignGame.activeAnchorCrisis && !realignGame.activeAnchorCrisis.resolved, 'realign-party-anchor must trigger an active Anchor Crisis');
  assert.strictEqual(realignGame.activeAnchorCrisis.isRealignmentCharter, true, 'Crisis must be marked as Realignment Charter');
  assert.strictEqual(realignGame.activeAnchorCrisis.targetNewAnchorId, newLead.id, 'Crisis must target new leading faction');

  // Resolve Anchor Crisis -> transfers isIroncladAnchor & sets game.realignedAnchors
  realignGame = Engine.takeAction(realignGame, 'resolve-anchor-crisis', {});
  assert.strictEqual(realignGame.activeAnchorCrisis, null, 'Anchor crisis should be cleared after resolution');
  assert.strictEqual(realignGame.realignedAnchors.heritage, newLead.id, 'game.realignedAnchors.heritage must record newAnchorId');
  assert.strictEqual(realignGame.factions.find((f) => f.id === newLead.id).isIroncladAnchor, true, 'New leading faction must have isIroncladAnchor === true');
  assert.strictEqual(realignGame.factions.find((f) => f.id === 'gop_maga').isIroncladAnchor, false, 'Legacy gop_maga must have isIroncladAnchor === false');

  // Verify persistence across normalizeGame()
  const reloaded = Engine.normalizeGame(JSON.parse(JSON.stringify(realignGame)));
  assert.strictEqual(reloaded.realignedAnchors.heritage, newLead.id, 'normalizeGame must preserve realignedAnchors');
  assert.strictEqual(FES.isEffectiveIroncladAnchor(reloaded, 'gop_maga'), false, 'Legacy anchor lock remains lifted after normalizeGame');
  assert.strictEqual(FES.isEffectiveIroncladAnchor(reloaded, newLead.id), true, 'New anchor remains locked after normalizeGame');

  // New anchor cannot be expelled
  const blockedNewAnchor = Engine.takeAction(reloaded, 'expel-faction', { factionId: newLead.id });
  assert.strictEqual(blockedNewAnchor.factions.find((f) => f.id === newLead.id).partyId, 'heritage', 'New ironclad anchor must be protected from expulsion');

  // Legacy anchor gop_maga CAN now be expelled cleanly to 'unaffiliated'
  const expelled = Engine.takeAction(reloaded, 'expel-faction', { factionId: 'gop_maga' });
  assert.strictEqual(expelled.factions.find((f) => f.id === 'gop_maga').partyId, 'unaffiliated', 'Legacy gop_maga must be expellable after realignment charter');
  assert.strictEqual(expelled.activeAnchorCrisis, null, 'Expelling realigned legacy anchor must NOT trigger an Anchor Crisis');

  console.log('PASS [3]: Anchor drift, cohabitation relief, and Party Realignment Charter');
}

console.log('ALL v0.18.4 FACTION & ERA STABILITY TESTS PASSED!');
