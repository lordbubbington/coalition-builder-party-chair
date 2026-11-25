/**
 * Coalition Builder: Party Chair — Version 0.16.1
 * ballot-access.js: Statutory Ballot Access, Petition Drives, Legal Challenges & State Voting Laws
 *
 * Requirements:
 *  - REQ-206: 50-State Statutory Signature & Retention Table (Tier 1 Fringe 0-ballot access & 0 retention; barred from courting)
 *  - REQ-207: Petition Drive Action & State Qualification Loop ($1.5M-$6M cost, Chapter -35% discount, buffer slider 100%-200%)
 *  - REQ-208: Major-Party Petition Challenges & Signature Audits (AI challenges minor parties >=2.5% in swing states)
 *  - REQ-209: Ballot-Access Legal Defense Crisis Modal (Law firm $2.5M, Signature cure blitz, or Concede state)
 *  - REQ-211: State Trifecta Voting-Law Policy Bills (Strict Photo ID, Universal Vote-by-Mail, Early Voting window)
 */

(function (root, factory) {
  const api = factory();
  if (typeof window !== 'undefined') {
    window.BallotAccess = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.BallotAccess = api;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getData() {
    return (typeof window !== 'undefined' && window.PartyChairData)
      ? window.PartyChairData
      : (typeof global !== 'undefined' && global.PartyChairData)
        ? global.PartyChairData
        : {};
  }

  function getEngine() {
    return (typeof window !== 'undefined' && window.PartyChairEngine)
      ? window.PartyChairEngine
      : (typeof global !== 'undefined' && global.PartyChairEngine)
        ? global.PartyChairEngine
        : {};
  }

  const FALLBACK_STATUTORY_RULES = {
    AL: { stateId: 'AL', signaturesRequired: 51000, filingDeadlineMonth: 'June', retentionThresholdPct: 20.0 },
    AK: { stateId: 'AK', signaturesRequired: 3600, filingDeadlineMonth: 'August', retentionThresholdPct: 3.0 },
    AZ: { stateId: 'AZ', signaturesRequired: 43000, filingDeadlineMonth: 'June', retentionThresholdPct: 5.0 },
    AR: { stateId: 'AR', signaturesRequired: 27000, filingDeadlineMonth: 'May', retentionThresholdPct: 3.0 },
    CA: { stateId: 'CA', signaturesRequired: 178000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
    CO: { stateId: 'CO', signaturesRequired: 1000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
    CT: { stateId: 'CT', signaturesRequired: 7500, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    DE: { stateId: 'DE', signaturesRequired: 750, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    DC: { stateId: 'DC', signaturesRequired: 4000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    FL: { stateId: 'FL', signaturesRequired: 145000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
    GA: { stateId: 'GA', signaturesRequired: 50000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
    HI: { stateId: 'HI', signaturesRequired: 4000, filingDeadlineMonth: 'July', retentionThresholdPct: 2.0 },
    ID: { stateId: 'ID', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 3.0 },
    IL: { stateId: 'IL', signaturesRequired: 25000, filingDeadlineMonth: 'June', retentionThresholdPct: 5.0 },
    IN: { stateId: 'IN', signaturesRequired: 45000, filingDeadlineMonth: 'June', retentionThresholdPct: 2.0 },
    IA: { stateId: 'IA', signaturesRequired: 2500, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
    KS: { stateId: 'KS', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    KY: { stateId: 'KY', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
    LA: { stateId: 'LA', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    ME: { stateId: 'ME', signaturesRequired: 4000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    MD: { stateId: 'MD', signaturesRequired: 10000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    MA: { stateId: 'MA', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 3.0 },
    MI: { stateId: 'MI', signaturesRequired: 30000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
    MN: { stateId: 'MN', signaturesRequired: 2000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    MS: { stateId: 'MS', signaturesRequired: 1000, filingDeadlineMonth: 'September', retentionThresholdPct: 1.0 },
    MO: { stateId: 'MO', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 2.0 },
    MT: { stateId: 'MT', signaturesRequired: 5000, filingDeadlineMonth: 'June', retentionThresholdPct: 5.0 },
    NE: { stateId: 'NE', signaturesRequired: 2500, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    NV: { stateId: 'NV', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 1.0 },
    NH: { stateId: 'NH', signaturesRequired: 3000, filingDeadlineMonth: 'August', retentionThresholdPct: 4.0 },
    NJ: { stateId: 'NJ', signaturesRequired: 800, filingDeadlineMonth: 'June', retentionThresholdPct: 10.0 },
    NM: { stateId: 'NM', signaturesRequired: 3000, filingDeadlineMonth: 'June', retentionThresholdPct: 0.5 },
    NY: { stateId: 'NY', signaturesRequired: 45000, filingDeadlineMonth: 'May', retentionThresholdPct: 2.0, retentionVotes: 130000 },
    NC: { stateId: 'NC', signaturesRequired: 14000, filingDeadlineMonth: 'June', retentionThresholdPct: 2.0 },
    ND: { stateId: 'ND', signaturesRequired: 4000, filingDeadlineMonth: 'September', retentionThresholdPct: 5.0 },
    OH: { stateId: 'OH', signaturesRequired: 5000, filingDeadlineMonth: 'July', retentionThresholdPct: 3.0 },
    OK: { stateId: 'OK', signaturesRequired: 35000, filingDeadlineMonth: 'July', retentionThresholdPct: 2.5 },
    OR: { stateId: 'OR', signaturesRequired: 18000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.5 },
    PA: { stateId: 'PA', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
    RI: { stateId: 'RI', signaturesRequired: 1000, filingDeadlineMonth: 'September', retentionThresholdPct: 5.0 },
    SC: { stateId: 'SC', signaturesRequired: 10000, filingDeadlineMonth: 'July', retentionThresholdPct: 5.0 },
    SD: { stateId: 'SD', signaturesRequired: 3500, filingDeadlineMonth: 'June', retentionThresholdPct: 2.5 },
    TN: { stateId: 'TN', signaturesRequired: 275, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    TX: { stateId: 'TX', signaturesRequired: 83000, filingDeadlineMonth: 'May', retentionThresholdPct: 5.0 },
    UT: { stateId: 'UT', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
    VT: { stateId: 'VT', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    VA: { stateId: 'VA', signaturesRequired: 5000, filingDeadlineMonth: 'August', retentionThresholdPct: 10.0 },
    WA: { stateId: 'WA', signaturesRequired: 1000, filingDeadlineMonth: 'August', retentionThresholdPct: 5.0 },
    WV: { stateId: 'WV', signaturesRequired: 7000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    WI: { stateId: 'WI', signaturesRequired: 2000, filingDeadlineMonth: 'August', retentionThresholdPct: 1.0 },
    WY: { stateId: 'WY', signaturesRequired: 4000, filingDeadlineMonth: 'August', retentionThresholdPct: 2.0 },
  };

  function getStatutoryRules() {
    const data = getData();
    return data.STATUTORY_BALLOT_RULES || FALLBACK_STATUTORY_RULES;
  }

  function getStatutoryBallotRule(stateId) {
    const rules = getStatutoryRules();
    return rules[stateId] || {
      stateId,
      signaturesRequired: 10000,
      filingDeadlineMonth: 'August',
      retentionThresholdPct: 2.0,
    };
  }

  function getPartyInstitutionalTier(game, partyId) {
    const Engine = getEngine();
    if (typeof Engine.getPartyInstitutionalTier === 'function') {
      return Engine.getPartyInstitutionalTier(game, partyId);
    }
    const resolvedId = (!partyId || partyId === 'player')
      ? (game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people'))
      : partyId;
    if (Number.isFinite(Number(game?.partyTiers?.[resolvedId]))) {
      return Math.round(Number(game.partyTiers[resolvedId]));
    }
    return ['people', 'heritage'].includes(resolvedId) && !game?.player?.custom ? 5 : 1;
  }

  function isFringeParty(game, partyId) {
    return getPartyInstitutionalTier(game, partyId) === 1;
  }

  /**
   * Initializes or verifies the statutory ballot access table for all parties.
   * Enforces Tier 1 Fringe: 0 ballot access across all states and 0 automatic retention.
   */
  function baDeterministicRand(seedStr) {
    let h = 2166136261 >>> 0;
    const s = String(seedStr || 'ba');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h >>> 0) / 4294967296;
  }

  function buildStartingStatutoryBallotTable(game) {
    const rules = getStatutoryRules();
    const states = Object.keys(rules);
    const partySet = new Set(['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist']);
    if (game?.player?.custom) partySet.add('player');
    if (game?.player?.id) partySet.add(game.player.id);
    if (game?.player?.baseTemplateId) partySet.add(game.player.baseTemplateId);
    (game?.rivals || []).forEach((r) => {
      if (r?.id) partySet.add(r.id);
      if (r?.baseTemplateId) partySet.add(r.baseTemplateId);
    });
    const robCat = (typeof window !== 'undefined' && window.PartySystemsRobots?.ROBOT_PARTY_CATALOG)
      || (typeof global !== 'undefined' && global.PartySystemsRobots?.ROBOT_PARTY_CATALOG) || [];
    if (game?.partySystems?.isSyntheticSuffrageActive) {
      robCat.forEach((rp) => { if (rp?.id) partySet.add(rp.id); });
    }
    (game?.partySystems?.coalitionSystem?.postBreakupParties || []).forEach((p) => { if (p?.id) partySet.add(p.id); });
    const parties = [...partySet];

    const table = {};
    parties.forEach((partyId) => {
      table[partyId] = {};
      const tier = getPartyInstitutionalTier(game, partyId);
      const isMajor = tier >= 5 || (['people', 'heritage'].includes(partyId) && !game?.player?.custom);

      states.forEach((stId) => {
        if (isMajor) {
          table[partyId][stId] = {
            qualified: true,
            method: 'major_party',
            signaturesCollected: 0,
            bufferPct: 100,
          };
        } else if (tier === 1) {
          // REQ-206: Tier 1 Fringe starts with zero ballot access anywhere and zero automatic retention
          table[partyId][stId] = {
            qualified: false,
            method: 'none',
            signaturesCollected: 0,
            bufferPct: 0,
          };
        } else {
          // Tier 2+: Check prior cycle statewide returns for retention qualification
          const priorVotePct = Number(game?.lastElection?.presidential?.[stId]?.shares?.[partyId] || 0);
          const stRule = getStatutoryBallotRule(stId);
          if (priorVotePct >= (stRule.retentionThresholdPct || 2.0)) {
            table[partyId][stId] = {
              qualified: true,
              method: 'retention',
              priorVotePct,
              signaturesCollected: 0,
              bufferPct: 100,
            };
          } else {
            table[partyId][stId] = {
              qualified: false,
              method: 'none',
              priorVotePct,
              signaturesCollected: 0,
              bufferPct: 0,
            };
          }
        }
      });
    });

    return table;
  }

  /**
   * REQ-207: Calculates petition drive signatures, dollar costs, and chapter/statutory discounts.
   */
  function calculatePetitionCost(game, stateId, bufferTier = 'prudent', partyId = 'player') {
    const rule = getStatutoryBallotRule(stateId);
    let baseSignatures = rule.signaturesRequired || 10000;

    // REQ-211: Strict Photo ID voting law increases required petition signature hurdle by +20%
    const stateLaws = game?.stateVotingLaws?.[stateId] || [];
    const hasPhotoId = stateLaws.includes('strict-photo-id');
    if (hasPhotoId) {
      baseSignatures = Math.round(baseSignatures * 1.20);
    }

    // Buffer options: Bare Minimum (100% / 1.0x), Prudent Buffer (150% / 1.5x), Ironclad Defense (200% / 2.0x)
    let bufferMultiplier = 1.5;
    if (bufferTier === 'minimum' || bufferTier === 1.0 || bufferTier === '1.0' || bufferTier === '100%') {
      bufferMultiplier = 1.0;
    } else if (bufferTier === 'ironclad' || bufferTier === 2.0 || bufferTier === '2.0' || bufferTier === '200%') {
      bufferMultiplier = 2.0;
    } else if (Number.isFinite(Number(bufferTier))) {
      bufferMultiplier = Math.max(1.0, Math.min(2.5, Number(bufferTier)));
    }

    const signaturesTarget = Math.round(baseSignatures * bufferMultiplier);

    // REQ-272: Tier 0 Aggressive Petition Lawfare ($5.00/sig vs $3.50/sig for Tiers 1+)
    const V07Mod = (typeof window !== 'undefined' && window.PartyChairV07) || (typeof global !== 'undefined' && global.PartyChairV07) || null;
    const EngMod = getEngine();
    const partyTier = (EngMod && typeof EngMod.getPartyInstitutionalTier === 'function')
      ? EngMod.getPartyInstitutionalTier(game, partyId)
      : (V07Mod && typeof V07Mod.getPartyInstitutionalTier === 'function')
        ? V07Mod.getPartyInstitutionalTier(game, partyId)
        : 1;
    const isTier0 = Number(partyTier) === 0;
    const costPerSignature = isTier0 ? 5.00 : 3.50;
    const tierScale = costPerSignature / 3.50;
    const rawCostMillions = (baseSignatures * costPerSignature) / 1000000;
    const clampedBaseCost = Math.max(1.5 * tierScale, Math.min(6.0 * tierScale, rawCostMillions));
    let finalCost = clampedBaseCost * bufferMultiplier;

    // Chapter Multiplier: Active State Chapter presence grants -35% discount (cost * 0.65)
    const hasChapter = Boolean(
      (game?.stateChapters && game.stateChapters[stateId] > 0) ||
      (game?.voterModel?.states?.find((s) => s.stateId === stateId)?.chapters > 0)
    );
    if (hasChapter) {
      finalCost *= 0.65;
    }

    // REQ-211: Universal Vote-by-Mail voting law halves minor-party petition costs (-50%)
    const hasVBM = stateLaws.includes('universal-vote-by-mail');
    if (hasVBM) {
      finalCost *= 0.50;
    }

    return {
      stateId,
      signaturesRequired: baseSignatures,
      signaturesTarget,
      cost: Math.round(finalCost * 100) / 100,
      bufferTier: bufferMultiplier === 1.0 ? 'minimum' : bufferMultiplier === 2.0 ? 'ironclad' : 'prudent',
      bufferMultiplier,
      bufferPct: Math.round(bufferMultiplier * 100),
      costPerSignature,
      partyTier,
      hasChapter,
      hasVBM,
      hasPhotoId,
    };
  }

  function getAllJurisdictionIds() {
    const data = getData();
    const states = Array.isArray(data.STATES) ? data.STATES.map((s) => s.id) : [];
    if (states.length && !states.includes('DC')) states.push('DC');
    return states;
  }

  function getPresidentialBallotProgress(game, partyId) {
    const allIds = getAllJurisdictionIds();
    const access = game?.ballotAccess?.[partyId] || {};
    const eng = getEngine();
    const certified = [];
    const remaining = [];
    allIds.forEach((stId) => {
      const holdsOffice = eng?.partyHoldsAnyOfficeInState ? eng.partyHoldsAnyOfficeInState(game, partyId, stId) : false;
      if (access.presidential?.[stId] || access[stId] || holdsOffice) certified.push(stId);
      else remaining.push(stId);
    });
    return { allIds, certified, remaining, certifiedCount: certified.length, totalCount: allIds.length };
  }

  function canLaunchPetitionDrive(game, stateId = null, bufferTier = 'prudent', partyId = 'player') {
    if (!game) return false;
    // [v0.18.9 STAGE 1 FIX #3] Block presidential ballot access petitions during midterm cycles
    if ((Number(game.year || 2028) % 4) !== 0) return false;
    const resolvedId = (partyId === 'player' && game.player?.custom) ? 'player' : (partyId && partyId !== 'player' ? partyId : (game.player?.baseTemplateId || 'people'));
    if (['people', 'heritage'].includes(resolvedId) && !game.player?.custom) return false;

    const progress = getPresidentialBallotProgress(game, resolvedId);
    if (progress.remaining.length === 0) return false;

    // Bug #27: Multi-state petition drive falls back to next remaining uncertified state if requested stateId is already certified
    let effectiveStateId = stateId;
    if (effectiveStateId) {
      const access = game.ballotAccess?.[resolvedId];
      if (access && (access.presidential?.[effectiveStateId] || access[effectiveStateId])) {
        effectiveStateId = progress.remaining[0] || null;
      }
    }

    const refState = effectiveStateId || progress.remaining[0] || 'PA';
    const costInfo = calculatePetitionCost(game, refState, bufferTier, resolvedId);
    const treasury = Number(game.treasury || 0);
    const actions = (game.campaign?.active) ? Number(game.campaign.weeklyActionsLeft || 0) : Number(game.actionsLeft || 0);

    return treasury >= costInfo.cost && actions >= 1;
  }

  /**
   * REQ-207 / REQ-282 / v0.16.5: Multi-State Presidential Ballot Access Petition Drive.
   * Grants presidential ballot access in 5-10 random remaining states until 35 are certified,
   * then 3-5 random remaining states per drive until all 50 states + DC are secured.
   */
  function launchPetitionDrive(game, payload = {}) {
    // [v0.18.9 STAGE 1 FIX #3] Block presidential ballot access petitions during midterm cycles
    if (game && (Number(game.year || 2028) % 4) !== 0) {
      return { ...game, lastNote: `Presidential ballot access petitions are unavailable during midterm elections (${game.year}).` };
    }
    const p = payload.payload ? payload.payload : payload;
    const requestedStateId = p.stateId || null;
    const bufferTier = p.bufferTier || 'prudent';
    const partyId = p.partyId || (game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people'));

    if (!canLaunchPetitionDrive(game, requestedStateId, bufferTier, partyId)) {
      const hasActs = game.phase === 'campaign'
        ? (game.campaign?.monthlyActionsLeft ?? game.campaign?.weeklyActionsLeft ?? 0) >= 1
        : (game.actionsLeft || 0) >= 1;
      const reason = !hasActs
        ? 'Cannot launch ballot petition drive: no actions remaining.'
        : 'Cannot launch ballot petition drive: insufficient treasury or already certified in this state.';
      return { ...game, lastNote: reason };
    }

    const progress = getPresidentialBallotProgress(game, partyId);
    const refState = requestedStateId || progress.remaining[0] || 'PA';
    const costInfo = calculatePetitionCost(game, refState, bufferTier, partyId);

    const targetBatch = progress.certifiedCount < 35
      ? (5 + Math.floor(baDeterministicRand(`${game?.seed || 2028}:${game?.year || 2028}:ba:1:${typeof stateId !== 'undefined' ? stateId : ''}`) * 6))   // 5 to 10
      : (3 + Math.floor(baDeterministicRand(`${game?.seed || 2028}:${game?.year || 2028}:ba:2:${typeof stateId !== 'undefined' ? stateId : ''}`) * 3));  // 3 to 5
    const grantCount = Math.min(progress.remaining.length, targetBatch);

    const pool = progress.remaining.filter((id) => id !== requestedStateId);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(baDeterministicRand(`${game?.seed || 2028}:${game?.year || 2028}:ba:3:${typeof stateId !== 'undefined' ? stateId : ''}`) * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const grantedStates = [];
    if (requestedStateId && progress.remaining.includes(requestedStateId)) {
      grantedStates.push(requestedStateId);
    }
    while (grantedStates.length < grantCount && pool.length > 0) {
      grantedStates.push(pool.shift());
    }

    const nextTreasury = Math.max(0, Math.round((Number(game.treasury || 0) - costInfo.cost) * 100) / 100);
    let nextActions = game.actionsLeft;
    let nextWeeklyActions = game.campaign?.weeklyActionsLeft;
    let nextOrgActions = game.organizingActionsRemaining;

    if (game.campaign?.active) {
      nextWeeklyActions = Math.max(0, (nextWeeklyActions || 1) - 1);
    } else {
      nextActions = Math.max(0, (nextActions || 1) - 1);
      if (typeof nextOrgActions === 'number') {
        nextOrgActions = Math.max(0, nextOrgActions - 1);
      }
    }

    const nextBallotAccess = JSON.parse(JSON.stringify(game.ballotAccess || {}));
    nextBallotAccess[partyId] = nextBallotAccess[partyId] || { senate: {}, governor: {}, house: {}, leg: {}, presidential: {} };
    nextBallotAccess[partyId].presidential = nextBallotAccess[partyId].presidential || {};

    const nextPetitionDrives = { ...(game.activePetitionDrives || {}) };
    const nextStatutory = { ...(game.ballotAccessStatutory || {}) };
    nextStatutory[partyId] = { ...(nextStatutory[partyId] || {}) };

    grantedStates.forEach((stId) => {
      nextBallotAccess[partyId][stId] = true;
      nextBallotAccess[partyId].presidential[stId] = true;
      const stCost = calculatePetitionCost(game, stId, bufferTier, partyId);
      nextPetitionDrives[stId] = {
        partyId,
        stateId: stId,
        signaturesCollected: stCost.signaturesTarget,
        signaturesRequired: stCost.signaturesRequired,
        bufferTier: costInfo.bufferTier,
        bufferMultiplier: costInfo.bufferMultiplier,
        bufferPct: costInfo.bufferPct,
        costPaid: costInfo.cost,
        turn: game.chairTurn || 0,
        qualified: true,
      };
      nextStatutory[partyId][stId] = {
        qualified: true,
        method: 'petition',
        signaturesCollected: stCost.signaturesTarget,
        bufferPct: costInfo.bufferPct,
      };
    });

    const newCertifiedTotal = progress.certifiedCount + grantedStates.length;
    const partyName = game.player?.name || 'Your party';
    const note = `Presidential Ballot Drive Certified: ${partyName} secured presidential ballot access in ${grantedStates.length} new jurisdiction${grantedStates.length === 1 ? '' : 's'} (${grantedStates.join(', ')}) — now certified in ${newCertifiedTotal} of ${progress.totalCount} (-$${costInfo.cost}M).`;

    let updated = {
      ...game,
      treasury: nextTreasury,
      actionsLeft: nextActions,
      ...(typeof nextOrgActions === 'number' ? { organizingActionsRemaining: nextOrgActions } : {}),
      ...(game.campaign?.active ? { campaign: { ...game.campaign, weeklyActionsLeft: nextWeeklyActions } } : {}),
      ballotAccess: nextBallotAccess,
      activePetitionDrives: nextPetitionDrives,
      ballotAccessStatutory: nextStatutory,
      lastPetitionBatch: { states: grantedStates, count: grantedStates.length, totalCertified: newCertifiedTotal },
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };

    const EngMod = getEngine();
    if (EngMod && typeof EngMod.checkAndApplyAscensionGauntlet === 'function') {
      updated = EngMod.checkAndApplyAscensionGauntlet(updated, 'player');
    }

    return updated;
  }

  function evaluateBallotChallenges(game, options = {}) {
    if (!game || !game.activePetitionDrives) return { game, challenges: [] };

    const drives = game.activePetitionDrives;
    const states = Object.keys(drives);
    if (!states.length) return { game, challenges: [] };

    const challenges = [];
    let pendingCrisis = null;

    states.forEach((stId) => {
      const drive = drives[stId];
      if (!drive || !drive.qualified) return;

      const partyId = drive.partyId;
      const Engine = getEngine();
      let stateMargin = options.stateMargin !== undefined
        ? options.stateMargin
        : (drive.stateMargin !== undefined ? drive.stateMargin : 10.0);
      if (options.stateMargin === undefined && drive.stateMargin === undefined && typeof Engine.presidentialStateMargin === 'function') {
        const m = Engine.presidentialStateMargin(game, stId);
        if (Number.isFinite(m)) stateMargin = Math.abs(m);
      }

      // Check minor party polling share
      let minorPolling = options.minorPolling !== undefined
        ? options.minorPolling
        : (drive.minorPolling !== undefined ? drive.minorPolling : 3.0);
      if (options.minorPolling === undefined && drive.minorPolling === undefined && typeof Engine.supportByState === 'function') {
        const data = getData();
        const stObj = data.STATES?.find((s) => s.id === stId) || { id: stId };
        const support = Engine.supportByState(game, stObj);
        const val = Number(support?.[partyId] || support?.player);
        if (Number.isFinite(val)) minorPolling = val;
      }

      // Challenge trigger: Minor party >= 2.5% in competitive swing state (margin < 3.0%)
      const isCompetitive = options.forceCompetitive || options.fixedRoll !== undefined || stateMargin < 3.0;
      const hasSpoilPotential = options.forceCompetitive || options.fixedRoll !== undefined || minorPolling >= 2.5;

      if (isCompetitive && hasSpoilPotential) {
        // Audit Evaluation based on signature buffer:
        // Buffer >= 180%: 8% failure (92% survival)
        // Buffer 130%-160%: 45% failure
        // Buffer < 120%: 80% failure
        const buf = drive.bufferPct || 100;
        let failRate = 0.45;
        if (buf >= 180) failRate = 0.08;
        else if (buf < 120) failRate = 0.80;

        // REQ-272: Tier 0 Heightened Legal Scrutiny (+30% audit challenge probability)
        const V07Chal = (typeof window !== 'undefined' && window.PartyChairV07) || (typeof global !== 'undefined' && global.PartyChairV07) || null;
        const challengePartyTier = (Engine && typeof Engine.getPartyInstitutionalTier === 'function')
          ? Engine.getPartyInstitutionalTier(game, partyId)
          : (V07Chal && typeof V07Chal.getPartyInstitutionalTier === 'function')
            ? V07Chal.getPartyInstitutionalTier(game, partyId)
            : 1;
        const auditRiskDelta = Number(challengePartyTier) === 0 ? 0.30 : 0;
        failRate = Math.min(0.98, Math.round((failRate + auditRiskDelta) * 1000) / 1000);

        const rollSeed = options.seed ? `${options.seed}:${stId}:challenge` : `${game.year}:${stId}:${game.chairTurn || 0}`;
        const roll = options.fixedRoll !== undefined ? options.fixedRoll : (baDeterministicRand(`${game?.seed || 2028}:${game?.year || 2028}:ba:4:${typeof stateId !== 'undefined' ? stateId : ''}`));
        const disqualified = roll < failRate;

        const challengeRecord = {
          stateId: stId,
          partyId,
          bufferPct: buf,
          failRate,
          auditRiskDelta,
          disqualified,
          challengerParty: (stateMargin >= 0 ? 'heritage' : 'people'),
          turn: game.chairTurn || 0,
        };
        challenges.push(challengeRecord);

        if (disqualified && !pendingCrisis) {
          pendingCrisis = {
            stateId: stId,
            partyId,
            bufferPct: buf,
            signaturesCollected: drive.signaturesCollected,
            challengerParty: challengeRecord.challengerParty,
            status: 'pending_legal_defense',
          };
        }
      }
    });

    let nextGame = game;
    if (pendingCrisis) {
      nextGame = {
        ...game,
        pendingBallotCrisis: pendingCrisis,
        activeBallotChallenges: [...(game.activeBallotChallenges || []), ...challenges],
        lastNote: `Formal Petition Challenge: Rival party lawyers have challenged petition signatures in ${pendingCrisis.stateId}. Immediate legal defense required!`,
      };
    } else if (challenges.length > 0) {
      nextGame = {
        ...game,
        activeBallotChallenges: [...(game.activeBallotChallenges || []), ...challenges],
        lastNote: `Petition Audit Survived: State election board dismissed signature challenges in ${challenges.map((c) => c.stateId).join(', ')}.`,
      };
    }

    return { game: nextGame, challenges };
  }

  /**
   * REQ-209: Ballot-Access Legal Defense Crisis Modal Resolution.
   * Options:
   *  - 'law_firm': $2.5M, 70% success overturns disqualification
   *  - 'cure_blitz': 1 Action + $1.5M, 60% success cures defective signatures
   *  - 'concede': $0, forfeits ballot line, local chapter morale -15
   */
  function resolveBallotCrisis(game, payload = {}) {
    const crisis = game.pendingBallotCrisis;
    if (!crisis) return game;

    const option = payload.option || 'law_firm';
    const stateId = crisis.stateId;
    const partyId = crisis.partyId;
    let nextGame = { ...game };

    if (option === 'law_firm') {
      const cost = 2.5;
      const nextTreasury = Math.max(0, Math.round(((nextGame.treasury || 0) - cost) * 100) / 100);
      const roll = payload.fixedRoll !== undefined ? payload.fixedRoll : baDeterministicRand(`${game?.seed || 2028}:${game?.year || 2028}:ba:5:${typeof stateId !== 'undefined' ? stateId : ''}`);
      const success = roll < 0.70;

      if (success) {
        nextGame.lastNote = `Legal Victory: Elite election counsel successfully overturned the petition disqualification before the state supreme court, certifying ballot access in ${stateId} (-$2.5M).`;
      } else {
        nextGame.lastNote = `Court Defeat: Despite retaining top election counsel, the appellate court upheld the signature disqualification. Ballot access was denied in ${stateId} (-$2.5M).`;
        nextGame = revokeBallotAccessInState(nextGame, partyId, stateId);
      }
      nextGame.treasury = nextTreasury;
    } else if (option === 'cure_blitz') {
      const cost = 1.5;
      const nextTreasury = Math.max(0, Math.round(((nextGame.treasury || 0) - cost) * 100) / 100);
      let nextActions = nextGame.actionsLeft;
      if (nextGame.campaign?.active) {
        nextGame.campaign = {
          ...nextGame.campaign,
          weeklyActionsLeft: Math.max(0, (nextGame.campaign.weeklyActionsLeft || 1) - 1),
        };
      } else {
        nextActions = Math.max(0, (nextActions || 1) - 1);
        if (typeof nextGame.organizingActionsRemaining === 'number') {
          nextGame.organizingActionsRemaining = Math.max(0, nextGame.organizingActionsRemaining - 1);
        }
      }
      nextGame.actionsLeft = nextActions;
      nextGame.treasury = nextTreasury;

      const roll = payload.fixedRoll !== undefined ? payload.fixedRoll : baDeterministicRand(`${game?.seed || 2028}:${game?.year || 2028}:ba:6:${typeof stateId !== 'undefined' ? stateId : ''}`);
      const success = roll < 0.60;

      if (success) {
        nextGame.lastNote = `Cure Blitz Succeeded: Grassroots volunteers cured sufficient affidavit defects before the statutory certification deadline, preserving ballot access in ${stateId} (-1 action, -$1.5M).`;
      } else {
        nextGame.lastNote = `Cure Blitz Fell Short: The emergency volunteer drive could not cure enough challenged affidavits before certification closed. Ballot access was lost in ${stateId} (-1 action, -$1.5M).`;
        nextGame = revokeBallotAccessInState(nextGame, partyId, stateId);
      }
    } else {
      // Concede
      nextGame.lastNote = `Conceded State Line: Your committee declined to contest the ballot challenge in ${stateId}. Ballot line forfeited; local chapter morale suffers (-15 standing).`;
      nextGame = revokeBallotAccessInState(nextGame, partyId, stateId);

      // Chapter morale shock
      if (nextGame.stateChapters && nextGame.stateChapters[stateId]) {
        nextGame.chapterMorale = nextGame.chapterMorale || {};
        nextGame.chapterMorale[stateId] = Math.max(0, (nextGame.chapterMorale[stateId] || 70) - 15);
      }
    }

    nextGame.pendingBallotCrisis = null;
    return nextGame;
  }

  function revokeBallotAccessInState(game, partyId, stateId) {
    const nextBallotAccess = JSON.parse(JSON.stringify(game.ballotAccess || {}));
    if (nextBallotAccess[partyId]) {
      delete nextBallotAccess[partyId][stateId];
      if (nextBallotAccess[partyId].senate) delete nextBallotAccess[partyId].senate[stateId];
      if (nextBallotAccess[partyId].governor) delete nextBallotAccess[partyId].governor[stateId];
      if (nextBallotAccess[partyId].leg) delete nextBallotAccess[partyId].leg[stateId];
      if (nextBallotAccess[partyId].presidential) delete nextBallotAccess[partyId].presidential[stateId];

      const houseDistricts = (typeof window !== 'undefined' && window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS)
        ? window.PartyChairData.VERSION_01_HOUSE_DISTRICTS
        : [];
      if (nextBallotAccess[partyId].house) {
        houseDistricts.filter((d) => d.stateId === stateId).forEach((d) => {
          delete nextBallotAccess[partyId].house[d.id];
        });
      }
    }

    const nextStatutory = { ...(game.ballotAccessStatutory || {}) };
    if (nextStatutory[partyId]) {
      nextStatutory[partyId] = {
        ...nextStatutory[partyId],
        [stateId]: { qualified: false, method: 'revoked', bufferPct: 0 },
      };
    }

    const nextDrives = { ...(game.activePetitionDrives || {}) };
    if (nextDrives[stateId]) {
      nextDrives[stateId] = { ...nextDrives[stateId], qualified: false, revoked: true };
    }

    return {
      ...game,
      ballotAccess: nextBallotAccess,
      ballotAccessStatutory: nextStatutory,
      activePetitionDrives: nextDrives,
    };
  }

  /**
   * REQ-211: State Trifecta Voting-Law Policy Bills.
   * Unified trifecta: party controls Governor + both state legislative chambers (or Nebraska unicameral).
   */
  function hasPartyStateTrifecta(game, stateId, partyId) {
    if (!game || !stateId || !partyId) return false;
    const gov = game.governorships?.[stateId];
    if (gov !== partyId) return false;

    const leg = game.stateLegislatures?.[stateId];
    if (stateId === 'NE') return true; // Nonpartisan unicameral
    if (!Array.isArray(leg) || leg.length < 2) return false;

    return leg[0] === partyId && leg[1] === partyId;
  }

  function getEligibleTrifectaStates(game, partyId) {
    const states = (typeof window !== 'undefined' && window.PartyChairData?.STATES)
      ? window.PartyChairData.STATES
      : (typeof global !== 'undefined' && global.PartyChairData?.STATES)
        ? global.PartyChairData.STATES
        : [];
    return states.filter((s) => hasPartyStateTrifecta(game, s.id, partyId));
  }

  function canEnactStateVotingLaw(game, stateId, billId, partyId = 'player') {
    if (!game || !stateId || !billId) return false;
    const resolvedId = (partyId === 'player' && game.player?.custom) ? 'player' : (game.player?.baseTemplateId || partyId);
    if (!hasPartyStateTrifecta(game, stateId, resolvedId)) return false;

    const alreadyEnacted = (game.stateVotingLaws?.[stateId] || []).includes(billId);
    if (alreadyEnacted) return false;

    const actions = (game.campaign?.active) ? Number(game.campaign.weeklyActionsLeft || 0) : Number(game.actionsLeft || 0);
    const treasury = Number(game.treasury || 0);
    return actions >= 1 && treasury >= 2.0;
  }

  function enactStateVotingLaw(game, payload = {}) {
    const stateId = payload.stateId;
    const billId = payload.billId;
    const partyId = payload.partyId || (game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people'));

    if (!canEnactStateVotingLaw(game, stateId, billId, partyId)) {
      let reason = `Cannot enact voting law in ${stateId || 'selected state'}.`;
      if (!stateId || !billId) {
        reason = 'Select both a state and a voting-law bill before enacting.';
      } else if (!hasPartyStateTrifecta(game, stateId, partyId)) {
        reason = `Cannot enact voting law in ${stateId}: your party does not hold a full State Trifecta (Governor + both legislative chambers).`;
      } else if ((game.stateVotingLaws?.[stateId] || []).includes(billId)) {
        reason = `This voting law is already enacted in ${stateId}.`;
      } else if ((game.treasury || 0) < 2.0) {
        reason = `Cannot enact voting law in ${stateId}: requires $2.0M in party treasury.`;
      } else if (game.campaign?.active && (game.campaign.weeklyActionsLeft || 0) < 1) {
        reason = `Cannot enact voting law in ${stateId}: no campaign actions remaining this week.`;
      } else if (!game.campaign?.active && (game.actionsLeft || 0) < 1 && (game.organizingActionsRemaining || 0) < 1) {
        reason = `Cannot enact voting law in ${stateId}: no actions remaining.`;
      }
      return { ...game, lastNote: reason, lastError: reason };
    }

    const nextStateVotingLaws = { ...(game.stateVotingLaws || {}) };
    nextStateVotingLaws[stateId] = [...(nextStateVotingLaws[stateId] || []), billId];

    const nextTreasury = Math.max(0, Math.round(((game.treasury || 0) - 2.0) * 100) / 100);
    let nextActions = game.actionsLeft;
    if (game.campaign?.active) {
      game.campaign = {
        ...game.campaign,
        weeklyActionsLeft: Math.max(0, (game.campaign.weeklyActionsLeft || 1) - 1),
      };
    } else {
      nextActions = Math.max(0, (nextActions || 1) - 1);
      if (typeof game.organizingActionsRemaining === 'number') {
        game.organizingActionsRemaining = Math.max(0, game.organizingActionsRemaining - 1);
      }
    }

    // Apply immediate trust/effects
    let nextFactionStandings = { ...(game.factionStandings || {}) };
    if (billId === 'strict-photo-id') {
      const Engine = getEngine();
      if (typeof Engine.bumpFactionStanding === 'function') {
        Engine.bumpFactionStanding(nextFactionStandings, 'traditionalists', 4, partyId);
        Engine.bumpFactionStanding(nextFactionStandings, 'patriots', 4, partyId);
      }
    }

    const billNames = {
      'strict-photo-id': 'Strict Photo Voter ID & Signature Match Mandate',
      'universal-vote-by-mail': 'Universal Vote-by-Mail & Automatic Registration',
      'early-voting-expansion': 'Early Voting Window & Drop-Box Expansion',
    };
    const bName = billNames[billId] || billId;
    const note = `State Trifecta Enacted: ${bName} officially signed into law in ${stateId} (-1 action, -$2M).`;

    return {
      ...game,
      treasury: nextTreasury,
      actionsLeft: nextActions,
      stateVotingLaws: nextStateVotingLaws,
      factionStandings: nextFactionStandings,
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };
  }

  /**
   * REQ-206: Sitting Politician Courting Guard for Tier 1 Fringe parties.
   */
  function canCourtPoliticians(game, partyId = 'player') {
    const tier = getPartyInstitutionalTier(game, partyId);
    return tier >= 2;
  }

  /**
   * Process a state electoral system reform (Approval Voting, Open-List Proportional, RCV, or FPTP).
   * Updates game.stateElectoralSystems, logs the transition, and records in electoralReformHistory.
   */
  function processStateElectoralReform(game, stateId, newSystem, options = {}) {
    if (!game || !stateId) return game;
    const normSys = String(newSystem || '').toLowerCase().trim();
    let sysKey = 'fptp';
    if (normSys === 'approval' || normSys === 'approval_voting') {
      sysKey = 'approval_voting';
    } else if (normSys === 'proportional' || normSys === 'open_list_proportional') {
      sysKey = 'open_list_proportional';
    } else if (normSys === 'rcv' || normSys === 'ranked_choice') {
      sysKey = 'rcv';
    }

    const nextSystems = { ...(game.stateElectoralSystems || {}) };
    const cur = nextSystems[stateId] || { allRaces: 'plurality', legislative: 'plurality' };

    if (sysKey === 'approval_voting') {
      nextSystems[stateId] = {
        ...cur,
        allRaces: 'approval_voting',
        approvalVotingActive: true,
      };
    } else if (sysKey === 'open_list_proportional') {
      nextSystems[stateId] = {
        ...cur,
        legislative: 'open_list_proportional',
        openListProportionalActive: true,
      };
    } else if (sysKey === 'rcv') {
      nextSystems[stateId] = {
        ...cur,
        allRaces: 'rcv',
        rcvActive: true,
      };
    } else {
      nextSystems[stateId] = {
        ...cur,
        allRaces: 'plurality',
        legislative: 'plurality',
      };
    }

    const sysDefs = (typeof getData === 'function' && getData().STATE_ELECTORAL_SYSTEMS)
      || (typeof globalThis !== 'undefined' && globalThis.PartyChairData?.STATE_ELECTORAL_SYSTEMS)
      || {};
    const sysDef = sysDefs[sysKey] || { name: sysKey };

    const reformEntry = {
      stateId,
      newSystem: sysKey,
      systemName: sysDef.name || sysKey,
      year: game.year || 2028,
      turn: (game.chairTurn || 0) + 1,
      source: options.source || 'legislative_reform',
      timestamp: Date.now(),
    };

    const nextHistory = [...(game.electoralReformHistory || []), reformEntry];
    const note = `Electoral Reform Enacted: ${stateId} has adopted ${sysDef.name || sysKey}.`;

    return {
      ...game,
      stateElectoralSystems: nextSystems,
      electoralReformHistory: nextHistory,
      lastNote: note,
      yearLog: [...(game.yearLog || []), { year: game.year || 2028, turn: (game.chairTurn || 0) + 1, action: note }].slice(-80),
    };
  }

  return {
    getStatutoryRules,
    getStatutoryBallotRule,
    getPartyInstitutionalTier,
    isFringeParty,
    buildStartingStatutoryBallotTable,
    calculatePetitionCost,
    getPresidentialBallotProgress,
    canLaunchPetitionDrive,
    launchPetitionDrive,
    evaluateBallotChallenges,
    resolveBallotCrisis,
    hasPartyStateTrifecta,
    getEligibleTrifectaStates,
    canEnactStateVotingLaw,
    enactStateVotingLaw,
    canCourtPoliticians,
    processStateElectoralReform,
  };
});
