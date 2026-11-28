// ============================================================================
// COALITION BUILDER: PARTY CHAIR — VERSION 0.18.0 CAMPAIGN PHASE OVERHAUL
// Standalone modular engine for 5-Month / 8-Action Campaign Cadence, Monthly
// Persuasion/Turnout Efficiencies, Expansive Rival Chair AI, Airwaves Saturation,
// Theme of the Month, Interactive Debates (36+ Questions), 42 Trait-Driven Crises,
// Oppo Research, Top-10 (50+ Fame) Surrogates, Trail Ultimatums, Toss-Up Watch,
// Correlated National/Regional Polling Error, Final 72 Hours Blitz, 5 Approved
// Campaign Actions, and Dynamic Corrupt Trait Lifecycle (10% / 5% / 1%).
// ============================================================================
(function (global) {
  'use strict';

  const MONTH_NAMES = ['June', 'July', 'August', 'September', 'October'];

  // Intentional buff: steep monthly persuasion vs. turnout efficiency curve
  const MONTHLY_EFFICIENCIES = {
    1: { month: 1, name: 'June', persuasion: 3.0, turnout: 0.25, label: '300% Persuasion · 25% Turnout' },
    2: { month: 2, name: 'July', persuasion: 2.0, turnout: 0.50, label: '200% Persuasion · 50% Turnout' },
    3: { month: 3, name: 'August', persuasion: 1.5, turnout: 1.50, label: '150% Persuasion · 150% Turnout' },
    4: { month: 4, name: 'September', persuasion: 0.5, turnout: 2.00, label: '50% Persuasion · 200% Turnout' },
    5: { month: 5, name: 'October', persuasion: 0.25, turnout: 3.00, label: '25% Persuasion · 300% Turnout' },
  };

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function round(v, d = 2) {
    const f = Math.pow(10, d);
    return Math.round((Number(v) || 0) * f) / f;
  }

  function hashFloat(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || 'seed');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h % 1000000) / 1000000;
  }

  function getMonthEfficiency(month) {
    const m = clamp(Math.round(Number(month) || 1), 1, 5);
    return MONTHLY_EFFICIENCIES[m];
  }

  // ==========================================================================
  // 1. AIRWAVES SATURATION & DIMINISHING RETURNS
  // ==========================================================================
  function getSaturationTier(value) {
    const v = clamp(Number(value) || 0, 0, 100);
    if (v <= 35) return { id: 'open', label: 'Open Airwaves', costMult: 1.0, effMult: 1.0, annoyance: 0 };
    if (v <= 65) return { id: 'crowded', label: 'Crowded Market', costMult: 1.25, effMult: 0.75, annoyance: 0 };
    if (v <= 85) return { id: 'saturated', label: 'Saturated', costMult: 1.6, effMult: 0.45, annoyance: 0 };
    return { id: 'fatigue', label: 'Ad Fatigue', costMult: 2.0, effMult: 0.2, annoyance: -0.3 };
  }

  function addStateSaturation(satMap, stateId, spendMillions, stateEv = 10, scaleFactor = 1.0) {
    const next = { ...(satMap || {}) };
    const evNorm = Math.max(4, Number(stateEv) || 10) / 10;
    const delta = (Number(spendMillions) || 1) * 12 * (1 / Math.sqrt(evNorm)) * scaleFactor;
    next[stateId] = clamp(round((Number(next[stateId]) || 0) + delta, 1), 0, 100);
    return next;
  }

  function decayStateSaturation(satMap) {
    const next = {};
    Object.entries(satMap || {}).forEach(([stId, val]) => {
      const cooled = Math.max(0, round((Number(val) || 0) - 20, 1));
      if (cooled > 0) next[stId] = cooled;
    });
    return next;
  }

  // ==========================================================================
  // 2. EXPANSIVE RIVAL CHAIR AI ("THIS MONTH ON THE TRAIL")
  // ==========================================================================
  function isPlayerMajorParty(game) {
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    if (['people', 'heritage'].includes(pId)) return true;
    if (game?.player?.isMajor) return true;
    const tier = Number(game?.partyTiers?.[pId] ?? game?.player?.tier ?? 0);
    return tier >= 5;
  }

  function getCampaignStateLift(game, stateId) {
    const c = game?.campaign;
    if (!c || !stateId) return 0;
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    let lift = 0;
    lift += Number(c.actionStateEffects?.[stateId] || 0);
    lift += Number(c.surrogateStateEffects?.[stateId] || 0);
    lift += Number(c.crisisStatePolls?.[stateId] || 0);
    // [v0.18.5 CAMPAIGN-EVENTS]
    lift += Number(c.eventStatePolls?.[stateId] || 0);
    lift += Number(c.finalBlitzEffects?.[stateId] || 0);
    lift += Number(c.themePersuasionLift || 0) * 0.45;
    lift += Number(c.debatePersuasionLift || 0) * 0.45;
    lift += Number(c.debateTurnoutLift || 0) * 0.35;
    // Detonated oppo drops targeting rivals in this state boost player net margin
    (c.oppoDossiers || []).forEach((d) => {
      if (d && d.detonated && d.stateId === stateId) {
        lift += d.severity === 'high' ? 2.4 : 1.4;
      }
    });
    // Ultimatum turnout penalties drag player
    const ultPen = Object.values(c.ultimatumTurnoutPenalties || {}).reduce((s, v) => s + Number(v || 0), 0);
    lift += ultPen * 0.08;
    // Rival state spending & counter-theme drag (per-party wing-aware weighting)
    const rivalMap = c.rivalStateEffects?.[stateId] || {};
    const SAME_WING_MINORS = { people: ['green', 'socialist'], heritage: ['liberty', 'constitution'] };
    let rivalDrag = 0;
    if (pId === 'people' || pId === 'heritage') {
      const oppMajor = pId === 'people' ? 'heritage' : 'people';
      const sameWing = SAME_WING_MINORS[pId] || [];
      rivalDrag += Number(rivalMap[oppMajor] || 0) * 0.55;
      sameWing.forEach((mid) => {
        rivalDrag += Number(rivalMap[mid] || 0) * 0.12;
      });
    } else {
      const playerDirect = Number(rivalMap[pId] || 0);
      const otherDrag = Object.entries(rivalMap).reduce((s, [rid, val]) => (rid === pId ? s : s + Math.max(0, Number(val || 0))), 0);
      rivalDrag = otherDrag * 0.35 - playerDirect;
    }
    lift -= rivalDrag;
    lift -= Number(c.rivalThemeCounterBonus || 0) * 0.35;
    const generalPersuasionBoost = Number(c.generalPersuasionStateBoosts?.[stateId] || 0);
    return round(clamp(lift, -10, 10) + generalPersuasionBoost, 2);
  }

  function getCampaignMajorNetShift(game, stateId) {
    const c = game?.campaign;
    if (!c || !stateId) return 0;
    const rivalMap = c.rivalStateEffects?.[stateId] || {};
    const demEff = Number(rivalMap.people || 0);
    const repEff = Number(rivalMap.heritage || 0);
    return round(clamp((demEff - repEff) * 0.55, -8, 8), 2);
  }

  function getRivalCandidateFundingLift(game, raceKey) {
    if (!game || !raceKey) return 0;
    const rec = game.campaign?.rivalCandidateFunding?.[raceKey];
    if (!rec || typeof rec !== 'object') return 0;
    const demAmt = Math.max(0, Number(rec.people || 0));
    const repAmt = Math.max(0, Number(rec.heritage || 0));
    const demLift = demAmt > 0 ? Math.min(3.5, Math.log1p(demAmt / 2.5) * 1.35) : 0;
    const repLift = repAmt > 0 ? Math.min(3.5, Math.log1p(repAmt / 2.5) * 1.35) : 0;
    return round(clamp(demLift - repLift, -3.5, 3.5), 2);
  }

  const CANONICAL_PARTY_CAMPAIGN_THEMES = {
    heritage: ['border-enforcement', 'law-and-order', 'taxes-spending', 'energy-independence', 'national-defense'],
    people: ['health-coverage', 'cost-of-living', 'climate-clean-energy', 'voting-rights', 'education-funding'],
    liberty: ['taxes-spending', 'deregulation', 'civil-liberties', 'free-trade', 'audit-the-fed'],
    green: ['climate-clean-energy', 'universal-healthcare', 'corporate-accountability', 'environmental-justice'],
    socialist: ['worker-rights', 'wealth-tax', 'universal-basic-services', 'housing-for-all'],
    constitution: ['religious-liberty', 'border-enforcement', 'constitutional-originalism', 'states-rights'],
  };

  const CANONICAL_PARTY_BASTIONS = {
    liberty: ['NH', 'WY', 'MT', 'ID', 'AK', 'NV'],
    green: ['OR', 'WA', 'VT', 'ME', 'CA', 'CO'],
    socialist: ['NY', 'IL', 'MI', 'PA', 'OH', 'WI'],
    constitution: ['AL', 'MS', 'ID', 'UT', 'WY', 'SC'],
  };

  const KEY_BATTLEGROUNDS = ['PA', 'WI', 'MI', 'GA', 'AZ', 'NC', 'NV'];
  const DNC_FIREWALLS = ['PA', 'MI', 'WI', 'MN', 'VA', 'CO', 'NV', 'NH'];

  function runRivalChairMonthlyTurn(game, month, options = {}) {
    const states = global.PartyChairData?.STATES || [];
    const year = Number(game?.year || 2028);
    const seed = game?.seed || 1;
    const eff = getMonthEfficiency(month);
    const prevPlayerSpend = game?.campaign?.playerStateSpendLastMonth || {};
    let saturation = { ...(game?.campaign?.stateSaturation || {}) };
    if (!options?.alreadyDecayed && !game?.campaign?._satDecayedThisMonth) {
      saturation = decayStateSaturation(saturation);
    }
    const rivalStateEffects = { ...(game?.campaign?.rivalStateEffects || {}) };
    const rivalCandidateFunding = JSON.parse(JSON.stringify(game?.campaign?.rivalCandidateFunding || {}));
    const spoilerMinorBoosts = JSON.parse(JSON.stringify(game?.campaign?.spoilerMinorBoosts || {}));
    const airwavesSpendByState = { ...(game?.campaign?.airwavesSpendByState || {}) };
    const fieldOfficesByState = { ...(game?.campaign?.fieldOfficesByState || {}) };
    const isPresYear = (year % 4) === 0;
    const MONTHLY_BURN_FRACS = { 1: 0.15, 2: 0.20, 3: 0.28, 4: 0.42, 5: 1.00 };
    const SAME_WING_MAP = { people: ['green', 'socialist'], heritage: ['liberty', 'constitution'] };
    const OPP_WING_MAP = { people: ['liberty', 'constitution'], heritage: ['green', 'socialist'] };
    const activeSenStates = new Set(
      (global.PartyChairEngine?.activeSenateRacesForYear ? global.PartyChairEngine.activeSenateRacesForYear(year) : (global.PartyChairData?.VERSION_01_SENATE_RACES || []))
        .map((r) => r.state || r.stateId).filter(Boolean)
    );
    const activeGovStates = new Set(
      (Array.isArray(game?.activeGubernatorialStates) && game.activeGubernatorialStates.length)
        ? game.activeGubernatorialStates
        : (global.PartyChairData?.VERSION_01_GUBERNATORIAL_ELECTIONS || [])
    );
    const houseDists = (global.PartyChairEngine?.legislativeDistricts ? global.PartyChairEngine.legislativeDistricts(game) : (global.PartyChairData?.VERSION_01_HOUSE_DISTRICTS || [])) || [];
    const byParty = {};
    const tickerItems = [];
    const morningWireHeadlines = [];
    const mapPins = [];

    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const playerPartyId = global.PartyChairEngine?.getPlayerPartyId ? global.PartyChairEngine.getPlayerPartyId(game) : pId;

    // Identify active rival parties from game.parties or game.rivals
    let rivalList = [];
    if (game?.parties && typeof game.parties === 'object' && Object.keys(game.parties).length > 0) {
      Object.entries(game.parties).forEach(([partyKey, pState]) => {
        if (partyKey === playerPartyId) return;
        const matchingRival = (game.rivals || []).find((r) => r.id === partyKey);
        rivalList.push({
          id: partyKey,
          name: pState.name || matchingRival?.name || partyKey,
          isMajor: Boolean(matchingRival?.isMajor || ['people', 'heritage'].includes(partyKey)),
          partyState: pState,
        });
      });
    } else if (Array.isArray(game?.rivals)) {
      rivalList = game.rivals.filter((r) => r && r.id && r.id !== playerPartyId);
    }

    if (!rivalList.length) {
      const fallbackId = playerPartyId === 'people' ? 'heritage' : 'people';
      rivalList = [{ id: fallbackId, name: fallbackId === 'heritage' ? 'Republican Party' : 'Democratic Party', isMajor: true }];
    }

    const nextRivalTreasuries = { ...(game?.campaign?.rivalTreasuries || {}) };

    rivalList.forEach((rival) => {
      if (!rival || !rival.id) return;
      const rId = rival.id;
      const isMajor = Boolean(rival.isMajor || ['people', 'heritage'].includes(rId));
      const profile = getPartyStrategyProfile(rId, game);

      if (nextRivalTreasuries[rId] === undefined) {
        nextRivalTreasuries[rId] = Number.isFinite(Number(rival.treasury || rival.partyState?.treasury))
          ? Number(rival.treasury || rival.partyState?.treasury)
          : (isMajor ? 65.0 : 10.0);
      }
      let avail = Math.max(0, Number(nextRivalTreasuries[rId] || 0));

      const pCampaign = rival.partyState?.campaign || {};
      const usedThemes = (month === 1) ? [] : (Array.isArray(pCampaign.usedThemes) ? [...pCampaign.usedThemes] : []);
      const oppoDossiers = Array.isArray(pCampaign.oppoDossiers) ? [...pCampaign.oppoDossiers] : [];
      const crisisResolutions = { ...(pCampaign.crisisResolutions || {}) };
      const partyAirwaves = { ...(pCampaign.airwavesSpendByState || {}) };
      const partyField = { ...(pCampaign.fieldOfficesByState || {}) };
      const actionsTaken = [];
      let actionsRemaining = 5;

      // ----------------------------------------------------------------------
      // 1. THEME OF THE MONTH (REQ-303)
      // ----------------------------------------------------------------------
      const themeCatalog = CANONICAL_PARTY_CAMPAIGN_THEMES[rId] || ['cost-of-living', 'taxes-spending', 'health-coverage', 'jobs', 'border-enforcement'];
      const unusedThemes = themeCatalog.filter((t) => !usedThemes.includes(t));
      const candidateThemes = unusedThemes.length ? unusedThemes : themeCatalog;
      const msSal = global.MediaShocksSystem;
      const chosenTheme = candidateThemes
        .slice()
        .sort((a, b) => {
          const sa = msSal?.getIssueSalienceMultiplier ? Number(msSal.getIssueSalienceMultiplier(game, a) || 1) : 1;
          const sb = msSal?.getIssueSalienceMultiplier ? Number(msSal.getIssueSalienceMultiplier(game, b) || 1) : 1;
          return sb - sa;
        })[0] || 'cost-of-living';
      const prevTheme = usedThemes.length ? usedThemes[usedThemes.length - 1] : null;
      const repeatCount = usedThemes.filter((t) => t === chosenTheme).length;
      const isConsecutiveRepeat = prevTheme === chosenTheme;

      let baseLift = 1.2;
      let staleNote = '';
      if (repeatCount > 0) {
        const mult = isConsecutiveRepeat ? 0.25 : 0.5;
        baseLift = round(baseLift * mult, 2);
        staleNote = isConsecutiveRepeat ? ' (Consecutive Repeat Penalty)' : ' (Stale Theme Penalty)';
      }
      const themeLift = round(baseLift * eff.persuasion * 0.35, 2);
      usedThemes.push(chosenTheme);
      const themeIsRepeat = repeatCount > 0;

      // ----------------------------------------------------------------------
      // 2. OPPO RESEARCH COMMISSION & OCTOBER SURPRISE DETONATION (REQ-304)
      // ----------------------------------------------------------------------
      if (month <= 3 && avail >= 1.5 && actionsRemaining >= 1 && oppoDossiers.length === 0 && (profile.ruthlessness >= 0.4 || isMajor)) {
        const targetPol = (game.presidentialTicket?.playerNominee)
          || (game.sittingMembers || []).find((m) => m && (m.party === playerPartyId || m.partyId === playerPartyId) && Number(m.fame || 0) >= 50)
          || { name: game.presidentialTicket?.[playerPartyId] || 'Opponent Nominee', traits: ['Undisciplined'], stateId: 'PA' };

        const traits = Array.isArray(targetPol.traits) ? targetPol.traits : [];
        let hitRate = 0.45;
        if (traits.includes('Corrupt')) hitRate = 0.85;
        else if (traits.includes('Undisciplined')) hitRate = 0.70;
        else if (traits.includes('Squeaky Clean')) hitRate = 0.15;

        const roll = hashFloat(`${seed}:${year}:oppo:ai:${rId}:${month}:${targetPol.name}`);
        const found = roll < hitRate;
        avail = round(avail - 1.5, 2);
        actionsRemaining--;
        if (found) {
          const dossier = {
            id: `oppo_${rId}_${year}_${month}`,
            investigatorPartyId: rId,
            targetPartyId: playerPartyId,
            targetName: targetPol.name,
            targetCandidateId: targetPol.id || targetPol.name,
            stateId: targetPol.stateId || 'PA',
            severity: traits.includes('Corrupt') ? 'high' : 'medium',
            detonated: false,
            monthDiscovered: month,
          };
          oppoDossiers.push(dossier);
          actionsTaken.push({ action: 'INVESTIGATE_OPPO', target: targetPol.name, hit: true, severity: dossier.severity });
          morningWireHeadlines.push(`${rival.name} operatives complete deep-dive background investigation on ${targetPol.name}.`);
        } else {
          actionsTaken.push({ action: 'INVESTIGATE_OPPO', target: targetPol.name, hit: false });
        }
      }

      // Detonation in Month 5 (October Surprise for GOP; Late Detonation for DNC)
      if (month === 5 && oppoDossiers.length > 0 && actionsRemaining >= 1) {
        const undetonated = oppoDossiers.find((d) => !d.detonated);
        if (undetonated) {
          // [v0.18.4 MEDIA-SHOCKS]
          const _msOctMult = global.MediaShocksSystem?.getOctoberSurpriseMultiplier ? global.MediaShocksSystem.getOctoberSurpriseMultiplier(game, rId, playerPartyId) : 1.0;
          const shock = round((undetonated.severity === 'high' ? 5.0 : 3.5) * _msOctMult, 2);
          undetonated.detonated = true;
          undetonated.detonatedMonth = 5;
          actionsRemaining--;
          actionsTaken.push({ action: 'DETONATE_OPPO_DOSSIER', target: undetonated.targetName, shock, stateId: undetonated.stateId });

          const st = undetonated.stateId || 'PA';
          rivalStateEffects[st] = rivalStateEffects[st] || {};
          rivalStateEffects[st][rId] = round((rivalStateEffects[st][rId] || 0) + shock, 2);

          if (rId === 'heritage') {
            morningWireHeadlines.push(`OCTOBER SURPRISE: Heritage Foundation PAC Floods Airwaves with Unsealed Ethics Dossier on ${undetonated.targetName} (${st})!`);
            tickerItems.push(`RNC Chair detonated High-Severity October Surprise dossier on ${undetonated.targetName} (-${shock.toFixed(1)}% poll shock in ${st}).`);
          } else {
            morningWireHeadlines.push(`DNC Releases Late Opposition Dossier on ${undetonated.targetName} in ${st} (-${shock.toFixed(1)}% drag).`);
            tickerItems.push(`DNC Chair detonates late opposition dossier on ${undetonated.targetName} in ${st}.`);
          }
        }
      }

      // ----------------------------------------------------------------------
      // 3. 42 TRAIT-DRIVEN CRISES DECISION MATRIX (REQ-304)
      // ----------------------------------------------------------------------
      if (month >= 2 && actionsRemaining >= 1 && Object.keys(crisisResolutions).length < (month - 1)) {
        const matchingPols = [...(game.sittingMembers || []), ...(game.politicians || [])]
          .filter((p) => p && !p.retired && (p.party === rId || p.partyId === rId) && Array.isArray(p.traits) && p.traits.length > 0);
        const cand = matchingPols.length ? matchingPols[Math.floor(hashFloat(`${seed}:${year}:crpol:${rId}:${month}`) * matchingPols.length)] : null;
        const trait = cand?.traits?.[0] || (rId === 'heritage' ? 'Undisciplined' : rId === 'people' ? 'Corrupt' : 'Rough');
        const crisis = CAMPAIGN_CRISIS_CATALOG.find((c) => c.trait === trait) || CAMPAIGN_CRISIS_CATALOG[0];

        if (crisis && !crisisResolutions[crisis.id]) {
          let choiceId = 'defend_rally';
          let candName = cand?.name || `${rival.name} Nominee`;
          let stId = cand?.stateId || 'PA';
          if (rId === 'heritage') {
            choiceId = 'attack_media_double_down';
            crisisResolutions[crisis.id] = choiceId;
            rivalStateEffects[stId] = rivalStateEffects[stId] || {};
            rivalStateEffects[stId][rId] = round((rivalStateEffects[stId][rId] || 0) - 1.5, 2);
            morningWireHeadlines.push(`${candName} (GOP) Attacks Media as Biased & Doubles Down Following ${crisis.title}!`);
            tickerItems.push(`${candName} (GOP) attacks the media and doubles down over ${crisis.title}.`);
          } else if (rId === 'people') {
            choiceId = 'panel_apologize';
            crisisResolutions[crisis.id] = choiceId;
            rivalStateEffects[stId] = rivalStateEffects[stId] || {};
            rivalStateEffects[stId][rId] = round((rivalStateEffects[stId][rId] || 0) - 3.2, 2);
            morningWireHeadlines.push(`${candName} (DEM) Apologizes and Appoints Ethics Panel Following ${crisis.title} (-3.2% national drag).`);
            tickerItems.push(`${candName} (DEM) apologizes and forms ethics panel over ${crisis.title}.`);
          } else if (rId === 'liberty') {
            choiceId = 'defend_moral_stand';
            crisisResolutions[crisis.id] = choiceId;
            morningWireHeadlines.push(`Libertarian Chair Rebuffs Calls to Censor ${candName}: 'Moral Stand Against State Extortion'`);
            tickerItems.push(`Libertarian Chair defends ${candName} as moral stand against extortion.`);
          } else {
            choiceId = 'purge_from_ticket';
            crisisResolutions[crisis.id] = choiceId;
            rivalStateEffects[stId] = rivalStateEffects[stId] || {};
            rivalStateEffects[stId][rId] = round((rivalStateEffects[stId][rId] || 0) - 4.0, 2);
            morningWireHeadlines.push(`${rival.name} Steering Committee Purges ${candName} Over Platform Litmus Breach!`);
            tickerItems.push(`${rival.name} purges ${candName} from general ticket over platform breach.`);
          }
          const stObjCr = states.find((s) => s.id === stId);
          const baseLeanCr = Number(stObjCr?.leanPercent ?? (-Number(stObjCr?.lean || 0) * 100));
          const liveMarginCr = baseLeanCr + Number(game.nationalEnvironment || 0) + getCampaignMajorNetShift(game, stId);
          if (Math.abs(liveMarginCr) <= 8.5 && avail >= 2.5 && rivalStateEffects[stId]?.[rId] < 0) {
            avail = round(avail - 2.5, 2);
            rivalStateEffects[stId][rId] = round(rivalStateEffects[stId][rId] * 0.4, 2);
          }
          actionsRemaining--;
          actionsTaken.push({ action: 'RESOLVE_CRISIS_DECISION', crisisId: crisis.id, choice: choiceId });
        }
      }

      // ----------------------------------------------------------------------
      // 4. CAMPAIGN AD BLITZES, FIELD OFFICES & FINAL BLITZ (REQ-303, REQ-304)
      // ----------------------------------------------------------------------
      const allocations = {};
      let totalSpent = 0;

      const reserveFloor = isMajor ? (month >= 5 ? 15.0 : 40.0) : (month >= 5 ? 0.5 : 1.5);
      const deployable = Math.max(0, avail - reserveFloor);
      const burnFrac = MONTHLY_BURN_FRACS[clamp(month, 1, 5)] || 0.25;
      let monthlyBudget = round(deployable * burnFrac, 2);

      // Score every non-DC state dynamically
      const natEnv = Number(game.nationalEnvironment || 0);
      const sigma = rId === 'heritage' ? 5.8 : 6.8;
      const dominoInfo = (!isMajor && global.PartyChairEngine?.getMinorPartyDominoState)
        ? global.PartyChairEngine.getMinorPartyDominoState(game, rId)
        : null;

      const scoredStates = states
        .filter((s) => s && s.id && s.id !== 'DC')
        .map((st) => {
          const stId = st.id;
          const ev = Math.max(3, Number(st.ev || 3));
          const baseLean = Number(st.leanPercent ?? (-Number(st.lean || 0) * 100));
          const netRivalLift = getCampaignMajorNetShift(game, stId);
          const liveMargin = baseLean + natEnv + netRivalLift;
          const comp = Math.exp(-0.5 * Math.pow(Math.abs(liveMargin) / sigma, 2));
          const closeSen = activeSenStates.has(stId) && Math.abs(liveMargin) <= 10;
          const closeGov = activeGovStates.has(stId) && Math.abs(liveMargin) <= 10;
          const closeHouse = houseDists.filter((d) => d.stateId === stId && Math.abs(Number(d.lean || 0) + natEnv) <= 8.5).length;
          const electoralVal = (isPresYear ? ev * 1.4 : ev * 0.25) + (closeSen ? 14 : 0) + (closeGov ? 8 : 0) + closeHouse * 3.2;
          const satTier = getSaturationTier(saturation, stId);
          const counterMult = prevPlayerSpend[stId] ? 1.22 : 1.0;
          const firewallMult = (rId === 'people' && DNC_FIREWALLS.includes(stId)) ? 1.15 : 1.0;
          const ownSpent = Number(partyAirwaves[stId] || 0);
          const breadthFactor = 1 / (1 + ownSpent / 85);
          let score = (electoralVal * comp * satTier.effMult * counterMult * firewallMult * breadthFactor) / Math.pow(ev, 0.35);

          if (!isMajor) {
            const hasBa = Boolean(game.ballotAccess?.[rId]?.presidential?.[stId] || game.ballotAccess?.[rId]?.senate?.[stId]);
            const chCnt = Number(game.stateOrganizations?.[stId]?.[rId]?.chapters || 0);
            const isCore = dominoInfo ? dominoInfo.coreAnchors.includes(stId) : (CANONICAL_PARTY_BASTIONS[rId] || []).includes(stId);
            const isRing = dominoInfo ? dominoInfo.dominoRing.includes(stId) : false;
            const dominoMult = isCore ? 2.8 : (isRing ? 1.6 : 0.35);
            if (!hasBa && chCnt === 0 && !isCore) score *= 0.1;
            score *= dominoMult;
          }
          return { st, stId, ev, liveMargin, satTier, score };
        })
        .sort((a, b) => b.score - a.score);

      const targetStateIds = scoredStates.slice(0, 8).map((x) => x.stId);

      // Major-Party Suppression: PR Threshold Crush & Plurality Squeeze vs. Opposing-Wing Spoiler Wedge
      if (isMajor && monthlyBudget > 0 && typeof global.PartyChairEngine?.computeMinorPartyThreatScore === 'function') {
        const sameWingMinors = SAME_WING_MAP[rId] || [];
        let hasPrEmergency = false;
        const threats = sameWingMinors.map((mid) => {
          const t = global.PartyChairEngine.computeMinorPartyThreatScore(game, rId, mid);
          if (t && t.prDangerStates && t.prDangerStates.length > 0) hasPrEmergency = true;
          return { minorId: mid, ...t };
        });
        let supBudget = round(deployable * (hasPrEmergency ? 0.20 : 0.10), 2);
        supBudget = Math.min(supBudget, avail);

        // PR Threshold Crush (overrides safe-state filtering)
        threats.forEach((th) => {
          (th.prDangerStates || []).forEach((prSt) => {
            if (supBudget < 12.0 || avail < 12.0) return;
            const crushSpend = round(Math.min(supBudget, avail, Math.max(12.0, Math.min(28.0, 12.0 + (prSt.seatsAtRisk || 1) * 2.5))), 1);
            avail = round(avail - crushSpend, 2);
            supBudget = round(supBudget - crushSpend, 2);
            monthlyBudget = round(Math.max(0, monthlyBudget - crushSpend), 2);
            totalSpent = round(totalSpent + crushSpend, 1);
            allocations[prSt.stateId] = round((allocations[prSt.stateId] || 0) + crushSpend, 1);
            const dragAmt = round(clamp(3.5 + (crushSpend - 12.0) / 16.0, 3.5, 4.5), 2);
            rivalStateEffects[prSt.stateId] = rivalStateEffects[prSt.stateId] || {};
            rivalStateEffects[prSt.stateId][th.minorId] = round((rivalStateEffects[prSt.stateId][th.minorId] || 0) - dragAmt, 2);
          });
        });

        // Plurality Same-Wing Squeeze
        threats.filter((th) => th.score >= 40).forEach((th) => {
          scoredStates.filter((x) => Math.abs(x.liveMargin) <= 7).slice(0, 3).forEach((x) => {
            if (supBudget < 4.0 || avail < 4.0) return;
            const vmSt = (game.voterModel?.states || []).find((s) => (s.stateId || s.id) === x.stId);
            const totV = vmSt?.affiliations ? Object.values(vmSt.affiliations).reduce((s, v) => s + Math.max(0, Number(v || 0)), 0) : 0;
            const minorPct = totV > 0 ? ((Number(vmSt.affiliations[th.minorId] || 0) / totV) * 100) : 0;
            if (minorPct < 4.0) return;
            const sqSpend = round(Math.min(supBudget, avail, 8.0), 1);
            avail = round(avail - sqSpend, 2);
            supBudget = round(supBudget - sqSpend, 2);
            monthlyBudget = round(Math.max(0, monthlyBudget - sqSpend), 2);
            totalSpent = round(totalSpent + sqSpend, 1);
            allocations[x.stId] = round((allocations[x.stId] || 0) + sqSpend, 1);
            const dragAmt = round(clamp(1.2 + (sqSpend - 4.0) * 0.16, 1.2, 2.2), 2);
            rivalStateEffects[x.stId] = rivalStateEffects[x.stId] || {};
            rivalStateEffects[x.stId][th.minorId] = round((rivalStateEffects[x.stId][th.minorId] || 0) - dragAmt, 2);
          });
        });

        // Opposing-Wing Spoiler Wedge
        if (profile.ruthlessness >= 0.65 && actionsRemaining >= 1 && avail >= 3.0) {
          const wedgeSt = scoredStates.find((x) => Math.abs(x.liveMargin) <= 5);
          const oppMinors = OPP_WING_MAP[rId] || [];
          const oppMinorId = oppMinors[0];
          if (wedgeSt && oppMinorId) {
            avail = round(avail - 3.0, 2);
            monthlyBudget = round(Math.max(0, monthlyBudget - 3.0), 2);
            totalSpent = round(totalSpent + 3.0, 1);
            spoilerMinorBoosts[wedgeSt.stId] = spoilerMinorBoosts[wedgeSt.stId] || {};
            spoilerMinorBoosts[wedgeSt.stId][oppMinorId] = round((spoilerMinorBoosts[wedgeSt.stId][oppMinorId] || 0) + 1.5, 2);
            actionsTaken.push({ action: 'issue_attack', stateId: wedgeSt.stId, spend: 3.0 });
            actionsRemaining--;
          }
        }
      }

      // Major-Party 45% Close-District & Candidate Funding Pool (up to 45 top-scoring races)
      let statewideBudget = isMajor ? round(monthlyBudget * 0.55, 2) : monthlyBudget;
      if (isMajor && monthlyBudget > 0) {
        let candPool = round(Math.min(avail, monthlyBudget * 0.45), 2);
        const compRaces = [];
        houseDists.forEach((d) => {
          const projM = Number(d.lean || 0) + natEnv;
          if (Math.abs(projM) <= 8.5) {
            compRaces.push({ raceKey: `house:${d.id}`, score: 10 - Math.abs(projM) });
          }
        });
        scoredStates.forEach((x) => {
          if (activeSenStates.has(x.stId) && Math.abs(x.liveMargin) <= 10) {
            compRaces.push({ raceKey: `senate:${x.stId}`, score: 16 - Math.abs(x.liveMargin) });
          }
          if (activeGovStates.has(x.stId) && Math.abs(x.liveMargin) <= 10) {
            compRaces.push({ raceKey: `governor:${x.stId}`, score: 13 - Math.abs(x.liveMargin) });
          }
        });
        compRaces.sort((a, b) => b.score - a.score);
        const topRaces = compRaces.slice(0, 45);
        if (topRaces.length > 0 && candPool >= 0.5) {
          const perRace = round(Math.min(3.0, candPool / topRaces.length), 2);
          if (perRace >= 0.1) {
            topRaces.forEach((rc) => {
              if (candPool < perRace || avail < perRace) return;
              rivalCandidateFunding[rc.raceKey] = rivalCandidateFunding[rc.raceKey] || {};
              rivalCandidateFunding[rc.raceKey][rId] = round((rivalCandidateFunding[rc.raceKey][rId] || 0) + perRace, 2);
              candPool = round(candPool - perRace, 2);
              avail = round(avail - perRace, 2);
              totalSpent = round(totalSpent + perRace, 1);
            });
          }
        }
      }

      // 55% Statewide Airwaves / GOTV / Final Blitz
      const perActionBudget = actionsRemaining > 0 ? round(statewideBudget / actionsRemaining, 2) : 0;
      while (actionsRemaining > 0 && avail >= 0.5) {
        const campActIdx = actionsTaken.filter((a) => !['INVESTIGATE_OPPO', 'DETONATE_OPPO_DOSSIER', 'RESOLVE_CRISIS_DECISION'].includes(a.action)).length;
        const pickedEntry = scoredStates[campActIdx % Math.max(1, Math.min(6, scoredStates.length))];
        const targetStateId = pickedEntry?.stId || targetStateIds[campActIdx % Math.max(1, targetStateIds.length)] || 'PA';
        const stateObj = pickedEntry?.st || states.find((s) => s.id === targetStateId) || { id: targetStateId, ev: 10 };
        const satTier = getSaturationTier(saturation, targetStateId);

        let actType = 'ad_blitz';
        if (rId === 'heritage') {
          if (month <= 2) actType = (campActIdx < 3) ? 'issue_attack' : 'ad_blitz';
          else if (month === 3) actType = (campActIdx === 0) ? 'surrogate_drop' : (campActIdx === 1 ? 'rally_tour' : 'ad_blitz');
          else if (month === 4) actType = 'gotv_drive';
          else actType = !actionsTaken.some((a) => a.action === 'final_72h_blitz') ? 'final_72h_blitz' : 'gotv_drive';
        } else if (rId === 'people') {
          if (month <= 3) actType = 'ad_blitz';
          else if (month === 4) actType = 'gotv_drive';
          else actType = !actionsTaken.some((a) => a.action === 'final_72h_blitz') ? 'final_72h_blitz' : ((campActIdx === 1) ? 'issue_attack' : 'gotv_drive');
        } else {
          actType = (campActIdx === 0) ? 'viral_telethon' : ((campActIdx === 1) ? 'rally_tour' : 'ad_blitz');
        }

        let spend = 0;
        if (actType === 'viral_telethon') {
          spend = 0;
          avail = round(avail + 2.5, 2);
        } else {
          const targetSpend = perActionBudget > 0 ? perActionBudget : (isMajor ? 4.0 : 1.2);
          spend = round(Math.min(avail, Math.max(isMajor ? 2.0 : 0.5, targetSpend)), 1);
        }

        avail = round(Math.max(0, avail - spend), 2);
        totalSpent = round(totalSpent + spend, 1);
        allocations[targetStateId] = round((allocations[targetStateId] || 0) + spend, 1);

        if (spend > 0) {
          airwavesSpendByState[targetStateId] = airwavesSpendByState[targetStateId] || {};
          airwavesSpendByState[targetStateId][rId] = round((airwavesSpendByState[targetStateId][rId] || 0) + spend, 1);
          partyAirwaves[targetStateId] = round((partyAirwaves[targetStateId] || 0) + spend, 1);
        }

        const effSpend = Math.log1p(spend / 4.0) * 4.0 * satTier.effMult;
        if (actType === 'issue_attack' || actType === 'ad_blitz') {
          const satInput = Math.min(16, Math.max(4.0, effSpend * 1.65));
          saturation = addStateSaturation(saturation, targetStateId, satInput, stateObj.ev, 0.85);
          const lift = round(Math.min(2.4, effSpend * 0.22 * eff.persuasion), 2);
          rivalStateEffects[targetStateId] = rivalStateEffects[targetStateId] || {};
          rivalStateEffects[targetStateId][rId] = round((rivalStateEffects[targetStateId][rId] || 0) + lift, 2);
        } else if (actType === 'gotv_drive') {
          fieldOfficesByState[targetStateId] = fieldOfficesByState[targetStateId] || {};
          fieldOfficesByState[targetStateId][rId] = (fieldOfficesByState[targetStateId][rId] || 0) + 3;
          partyField[targetStateId] = (partyField[targetStateId] || 0) + 3;
          const lift = round(Math.min(2.6, effSpend * 0.24 * eff.turnout), 2);
          rivalStateEffects[targetStateId] = rivalStateEffects[targetStateId] || {};
          rivalStateEffects[targetStateId][rId] = round((rivalStateEffects[targetStateId][rId] || 0) + lift, 2);
        } else if (actType === 'final_72h_blitz') {
          const lift = round(Math.min(3.2, Math.max(1.8, effSpend * 0.30)), 2);
          rivalStateEffects[targetStateId] = rivalStateEffects[targetStateId] || {};
          rivalStateEffects[targetStateId][rId] = round((rivalStateEffects[targetStateId][rId] || 0) + lift, 2);
        }

        mapPins.push({
          stateId: targetStateId,
          partyId: rId,
          partyName: rival.name || rId,
          action: actType,
          spend,
          isCounter: Boolean(prevPlayerSpend[targetStateId]),
        });

        actionsTaken.push({ action: actType, stateId: targetStateId, spend });
        actionsRemaining--;
      }

      while (actionsRemaining > 0) {
        actionsTaken.push({ action: 'FIELD_MAINTENANCE', stateId: targetStateIds[0] });
        actionsRemaining--;
      }

      nextRivalTreasuries[rId] = avail;

      byParty[rId] = {
        partyId: rId,
        partyName: rival.name || rId,
        month,
        monthlyTheme: chosenTheme,
        themeLift,
        themeIsRepeat,
        usedThemes,
        totalSpend: totalSpent,
        treasuryRemaining: avail,
        allocations,
        actionsTaken,
        oppoDossiers,
        crisisResolutions,
        airwavesSpendByState: partyAirwaves,
        fieldOfficesByState: partyField,
      };

      const topTargetStates = Object.keys(allocations).slice(0, 2).join(' & ') || targetStateIds.slice(0, 2).join(' & ');
      const primaryAct = actionsTaken.find((a) => a.action !== 'SET_MONTHLY_THEME')?.action || 'ad_blitz';
      const verbMap = {
        ad_blitz: 'poured positive bio ads worth',
        issue_attack: 'launched aggressive issue attack ads worth',
        rally_tour: 'staged a battleground rally tour spending',
        surrogate_drop: 'dispatched high-profile surrogates spending',
        gotv_drive: 'mobilized GOTV field operations spending',
        final_72h_blitz: 'launched election eve Final 72 Hours Blitz investing',
        viral_telethon: 'hosted viral livestream telethon raising',
      };
      tickerItems.push(`${rival.name} Chair ${verbMap[primaryAct] || 'invested'} $${totalSpent.toFixed(1)}M into ${topTargetStates}.`);
    });

    if (month <= 2) {
      morningWireHeadlines.push(`RNC Chair Launches Multi-State Airwaves Assault Across Pennsylvania & Wisconsin.`);
      morningWireHeadlines.push(`DNC Dithers on Focus Priorities as Blue Dogs and Left Clash on Energy Stance.`);
    }
    if (rivalList.some((r) => r.id === 'liberty')) {
      morningWireHeadlines.push(`Libertarian National Committee Rebuffs Primary Endorsement Petitions: 'The Convention Floor Belongs to the Grassroots.'`);
    }
    if (month === 5) {
      morningWireHeadlines.push(`Rival Chairs Launch 72-Hour Battleground Blitz Across Rust Belt Firewalls.`);
    }

    return {
      month,
      monthName: MONTH_NAMES[clamp(month, 1, 5) - 1],
      byParty,
      tickerItems: tickerItems.slice(0, 8),
      morningWireHeadlines: morningWireHeadlines.slice(0, 6),
      mapPins,
      stateSaturation: saturation,
      rivalStateEffects,
      rivalCandidateFunding,
      spoilerMinorBoosts,
      rivalTreasuries: nextRivalTreasuries,
      airwavesSpendByState,
      fieldOfficesByState,
    };
  }

  // ==========================================================================
  // 3. MONTHLY NARRATIVE FRAMING ("THEME OF THE MONTH")
  // ==========================================================================
  function selectCampaignTheme(game, issueId) {
    if (!game?.campaign?.active || (game.phase && game.phase !== 'campaign' && game.phase !== 'general-campaign')) {
      return { ...game, lastNote: 'Theme of the Month can only be set during the active General Election Campaign.' };
    }
    if (!issueId) return game;
    if (game.campaign.themeSelectedThisMonth) {
      return { ...game, lastNote: 'Theme of the Month has already been set for this month.' };
    }
    const month = clamp(Number(game.campaign.month || game.campaign.week || 1), 1, 5);
    const eff = getMonthEfficiency(month);
    const usedThemes = Array.isArray(game.campaign.usedThemes) ? [...game.campaign.usedThemes] : [];
    const prevTheme = usedThemes.length ? usedThemes[usedThemes.length - 1] : null;
    const repeatCount = usedThemes.filter((id) => id === issueId).length;
    const isConsecutiveRepeat = prevTheme === issueId;

    const allIssues = global.PartySystemsEngine?.getActiveIssuesForGame
      ? global.PartySystemsEngine.getActiveIssuesForGame(game)
      : (global.PartyChairData?.VERSION_021_ISSUES || global.PartyChairData?.ISSUES || []);
    const issueObj = allIssues.find((i) => i.id === issueId) || { id: issueId, label: issueId, name: issueId, importance: 0.7 };
    const issueDisplayName = issueObj.label || issueObj.name || issueId;
    const playerStance = Number(game.issuePositions?.[issueId] ?? game.platform?.[issueId] ?? 5.5);
    // #6: Compute national median on the 1-10 issue scale from issue.defaults (people/heritage midpoint)
    let nationalMedian = 5.5;
    if (issueObj.defaults && typeof issueObj.defaults === 'object') {
      const vals = [issueObj.defaults.people, issueObj.defaults.heritage].map(Number).filter(Number.isFinite);
      if (vals.length > 0) nationalMedian = round(vals.reduce((s, v) => s + v, 0) / vals.length, 2);
    } else if (Number.isFinite(Number(issueObj.medianStance ?? issueObj.nationalMedian ?? issueObj.baseline))) {
      nationalMedian = Number(issueObj.medianStance ?? issueObj.nationalMedian ?? issueObj.baseline);
    }
    const alignmentDist = Math.abs(playerStance - nationalMedian);
    const highSalienceCats = new Set(['Economy & Affordability', 'Healthcare & Safety Net', 'Immigration & Borders', 'Democracy & Institutions']);
    const rawSalience = issueObj.salience ?? issueObj.importance ?? (highSalienceCats.has(issueObj.category) ? 0.8 : 0.65);
    const salience = Number.isFinite(Number(rawSalience)) ? (Number(rawSalience) > 1 ? Number(rawSalience) / 10 : Number(rawSalience)) : 0.65;
    const isImportantAgreement = salience >= 0.6 && alignmentDist <= 1.25;

    let baseLift = isImportantAgreement ? 1.5 : 0.75;
    let indTrustDelta = isImportantAgreement ? 2 : 0;
    let rivalCounterBonus = 0;
    let noteSuffix = isImportantAgreement ? ' High-salience national agreement bonus!' : '';

    if (repeatCount > 0) {
      const mult = isConsecutiveRepeat ? 0.25 : 0.5;
      baseLift = round(baseLift * mult, 2);
      indTrustDelta -= isConsecutiveRepeat ? 4 : 2;
      rivalCounterBonus = isConsecutiveRepeat ? 1.6 : 0.8;
      noteSuffix = isConsecutiveRepeat
        ? ' Consecutive repeat penalty: voters tuned out stale messaging!'
        : ' Stale messaging penalty: selecting the same theme twice reduced lift by 50%.';
    }

    // [v0.18.4 MEDIA-SHOCKS]
    const _msSalMult = global.MediaShocksSystem?.getIssueSalienceMultiplier ? global.MediaShocksSystem.getIssueSalienceMultiplier(game, issueId) : 1.0;
    const _msAdMult = global.MediaShocksSystem?.getAdPersuasionMultiplier ? global.MediaShocksSystem.getAdPersuasionMultiplier(game) : 1.0;
    const scaledLift = round(baseLift * eff.persuasion * 0.35 * _msSalMult * _msAdMult, 2);
    const nextTrust = {
      ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }),
      independents: clamp(round((game.trust?.independents ?? 40) + indTrustDelta, 1), 0, 100),
    };

    // Coalition clash check
    const nextFH = { ...(game.factionHappiness || {}) };
    const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
    const factions = (game.factions || []).filter((f) => f.partyId === pId && f.status === 'major');
    factions.forEach((fac) => {
      const fStance = Number(
        fac.issueStances?.[issueId]
        ?? fac.stances?.[issueId]
        ?? fac.issuePositions?.[issueId]
        ?? (typeof fac.fiscal === 'number' ? (fac.fiscal - 5) / 5 : playerStance)
      );
      if (Math.abs(fStance - playerStance) > 0.6) {
        const curH = nextFH[fac.id] ?? 50;
        nextFH[fac.id] = global.PartyChairEngine?.applyScaledFactionHappinessDelta
          ? global.PartyChairEngine.applyScaledFactionHappinessDelta(curH, -2)
          : clamp(round(curH - 2, 1), 0, 100);
      }
    });

    usedThemes.push(issueId);
    const note = `Theme of Month ${month} (${eff.name}): ${issueDisplayName} (${scaledLift >= 0 ? '+' : ''}${scaledLift}% persuasion lift).${noteSuffix}`;
    return {
      ...game,
      trust: nextTrust,
      factionHappiness: nextFH,
      campaign: {
        ...game.campaign,
        activeThemeId: issueId,
        activeThemeName: issueDisplayName,
        themeSelectedThisMonth: true,
        usedThemes,
        themePersuasionLift: round((game.campaign.themePersuasionLift || 0) + scaledLift, 2),
        rivalThemeCounterBonus: round((game.campaign.rivalThemeCounterBonus || 0) + rivalCounterBonus, 2),
      },
      lastNote: note,
    };
  }

  // ==========================================================================
  // 4. INTERACTIVE GENERAL ELECTION DEBATES (36-QUESTION ROTATING BANK)
  // ==========================================================================
  const DEBATE_QUESTION_BANK = [
    { id: 'dq_inflation', category: 'Economy', issueId: 'cost-of-living', prompt: 'Grocery and housing costs remain top-of-mind for families. What concrete step will your party take in the first 100 days?' },
    { id: 'dq_taxes', category: 'Economy', issueId: 'taxes-spending', prompt: 'Should high-income brackets and corporate profits face higher rates to fund deficit reduction?' },
    { id: 'dq_debt', category: 'Economy', issueId: 'taxes-spending', prompt: 'With federal debt servicing climbing, would your party cut spending, raise revenue, or protect entitlement programs?' },
    { id: 'dq_trade', category: 'Economy', issueId: 'business-regulation', prompt: 'Do broad tariffs protect American manufacturing workers, or do they act as a hidden sales tax on consumers?' },
    { id: 'dq_labor', category: 'Economy', issueId: 'minimum-wage', prompt: 'Should federal law make union organizing faster across service and tech industries?' },
    { id: 'dq_minwage', category: 'Economy', issueId: 'minimum-wage', prompt: 'Where should the federal minimum wage floor sit—or should wage policy be left strictly to states?' },
    { id: 'dq_healthcare', category: 'Healthcare', issueId: 'health-coverage', prompt: 'Millions still face high deductibles and medical debt. Will your party expand public coverage or strengthen private market competition?' },
    { id: 'dq_pharma', category: 'Healthcare', issueId: 'prescription-drugs', prompt: 'How far should Medicare go in negotiating prescription drug prices without chilling biomedical innovation?' },
    { id: 'dq_mentalhealth', category: 'Healthcare', issueId: 'health-coverage', prompt: 'Communities face a mental health and addiction crisis. How will your party fund treatment capacity?' },
    { id: 'dq_nato', category: 'Foreign Policy', issueId: 'nato-global-security-hegemony', prompt: 'Should the United States maintain ironclad NATO defense commitments even if European allies lag on defense spending?' },
    { id: 'dq_china', category: 'Foreign Policy', issueId: 'foreign-policy', prompt: 'How do you deter aggression in the Indo-Pacific without triggering a catastrophic trade or military clash?' },
    { id: 'dq_defense', category: 'Foreign Policy', issueId: 'defense-spending', prompt: 'Is the Pentagon budget bloated and overdue for audit cuts, or essential for global deterrence?' },
    { id: 'dq_ai', category: 'Technology', issueId: 'frontier-ai-oversight-compute', prompt: 'Frontier AI systems are reshaping white-collar jobs and national security. Does your party back federal safety standards or light-touch deregulation?' },
    { id: 'dq_antitrust', category: 'Technology', issueId: 'business-regulation', prompt: 'Should the Justice Department break up dominant digital platforms and social-media monopolies?' },
    { id: 'dq_privacy', category: 'Technology', issueId: 'frontier-ai-oversight-compute', prompt: 'Will your party pass a binding national data-privacy bill curbing algorithmic tracking?' },
    { id: 'dq_climate', category: 'Energy & Climate', issueId: 'climate-action', prompt: 'How fast should the U.S. transition off fossil fuels while keeping electricity affordable and grids reliable?' },
    { id: 'dq_publiclands', category: 'Energy & Climate', issueId: 'federal-public-lands-energy', prompt: 'Should federal public lands be opened for domestic oil, gas, and critical-mineral extraction, or permanently conserved?' },
    { id: 'dq_nuclear', category: 'Energy & Climate', issueId: 'energy-mix', prompt: 'Should the federal government fast-track next-generation nuclear power plants to meet surging grid demand?' },
    { id: 'dq_immigration', category: 'Immigration', issueId: 'immigration-visas', prompt: 'How do you balance strict border enforcement with legal pathways for workers and long-term residents?' },
    { id: 'dq_asylum', category: 'Immigration', issueId: 'border-enforcement', prompt: 'What reforms to the asylum court system will your party champion to clear multi-year backlogs?' },
    { id: 'dq_housing', category: 'Housing', issueId: 'nimbyism-housing', prompt: 'Homeownership feels out of reach for young voters. Should federal funds incentivize cities to abolish restrictive zoning?' },
    { id: 'dq_transit', category: 'Infrastructure', issueId: 'taxes-spending', prompt: 'Should federal infrastructure dollars prioritize high-speed rail and metro transit or highways and rural bridges?' },
    { id: 'dq_courts', category: 'Governance', issueId: 'democracy-checks', prompt: 'Public trust in the federal judiciary is polarized. Do you support term limits, ethics codes, or keeping the current structure intact?' },
    { id: 'dq_voting', category: 'Governance', issueId: 'voting-rules', prompt: 'Should Congress set uniform national standards for mail-in voting and voter ID, or defer to state legislatures?' },
    { id: 'dq_money', category: 'Governance', issueId: 'campaign-finance-reform', prompt: 'How would your party curb dark-money Super PACs and restore accountability to campaign finance?' },
    { id: 'dq_education', category: 'Education', issueId: 'church-state-schools', prompt: 'Should federal dollars expand universal pre-K and public-school pay, or fund school-choice vouchers?' },
    { id: 'dq_studentdebt', category: 'Education', issueId: 'church-state-schools', prompt: 'How should Washington tackle soaring college tuition—loan forgiveness, vocational grants, or university accountability?' },
    { id: 'dq_crime', category: 'Justice', issueId: 'criminal-justice-reform', prompt: 'How will your party bring down violent crime while maintaining civil-rights accountability in policing?' },
    { id: 'dq_guns', category: 'Rights', issueId: 'criminal-justice-reform', prompt: 'Where does your party draw the line between Second Amendment protections and federal gun-safety rules?' },
    { id: 'dq_abortion', category: 'Rights', issueId: 'abortion', prompt: 'Should reproductive healthcare access be codified nationwide by Congress or decided state-by-state?' },
    { id: 'dq_socialsec', category: 'Entitlements', issueId: 'cost-of-living', prompt: 'Social Security trust funds face long-term shortfalls. Will your party lift the payroll tax cap or raise the retirement age?' },
    { id: 'dq_agriculture', category: 'Rural', issueId: 'federal-public-lands-energy', prompt: 'Family farms are squeezed by consolidation and weather volatility. What is your plan for rural America?' },
    { id: 'dq_childcare', category: 'Families', issueId: 'snap-food-aid', prompt: 'Working parents pay more for childcare than rent. Do you back an expanded Child Tax Credit or direct childcare subsidies?' },
    { id: 'dq_crypto', category: 'Finance', issueId: 'monetary-policy', prompt: 'How tightly should federal regulators police Wall Street leverage and digital asset markets?' },
    { id: 'dq_veterans', category: 'Veterans', issueId: 'defense-spending', prompt: 'How will you modernize VA healthcare and expand community-care options for veterans?' },
    { id: 'dq_closing', category: 'Closing', issueId: 'institutional-trust', prompt: 'In 60 seconds: why should an undecided Independent voter trust your coalition with the next four years?' },
  ];

  function buildDebateEvent(game, month) {
    const year = Number(game?.year || 2028);
    const isPres = year % 4 === 0;
    const isDebateMonth = isPres ? (month === 2 || month === 4) : (month === 3);
    if (!isDebateMonth) return null;

    const asked = new Set(game?.debateQuestionsAsked || []);
    let pool = DEBATE_QUESTION_BANK.filter((q) => !asked.has(q.id));
    if (pool.length < 3) pool = [...DEBATE_QUESTION_BANK];

    // Resolve any debate question issueId retired by the active Party System era
    const eraSwapMap = {};
    try {
      const activeEraId = game?.partySystems?.currentEraId || game?.partySystems?.era;
      const psd = typeof window !== 'undefined' ? window.PartySystemsData : null;
      const eraObj = psd?.ALL_ERAS_BY_ID?.[activeEraId] || (psd?.ERA_CATALOG || []).find((e) => e && e.id === activeEraId);
      if (eraObj && Array.isArray(eraObj.issueSwaps)) {
        eraObj.issueSwaps.forEach((sw) => {
          if (sw && sw.retireId && sw.add && sw.add.id) eraSwapMap[sw.retireId] = sw.add.id;
        });
      }
    } catch (_) {}

    const seed = game?.seed || 1;
    const picked = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(hashFloat(`${seed}:${year}:deb:m${month}:q${i}`) * pool.length);
      const rawQ = pool.splice(idx, 1)[0];
      const mappedIssueId = eraSwapMap[rawQ.issueId] || rawQ.issueId;
      picked.push(mappedIssueId !== rawQ.issueId ? { ...rawQ, issueId: mappedIssueId } : rawQ);
    }

    // [v0.18.5 CAMPAIGN-EVENTS] Inject arc callback debate question if active
    const _cesDeb = (typeof window !== 'undefined' && window.CampaignEventsSystem) || (typeof global !== 'undefined' && global.CampaignEventsSystem);
    const _arcQ = _cesDeb?.getArcDebateCallbackQuestion ? _cesDeb.getArcDebateCallbackQuestion(game) : null;
    if (_arcQ && picked.length) picked[picked.length - 1] = _arcQ;
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const isMajor = isPlayerMajorParty(game);
    const liveAffShare = Number(game?.voterModel?.affiliations?.[pId]?.sharePercent);
    const natShare = Number.isFinite(liveAffShare) && liveAffShare > 0
      ? liveAffShare
      : Number(game?.player?.baseShare || 0);
    const qualifiesThirdPartyBreakout = !isMajor && natShare >= 15;

    return {
      id: `debate_${year}_m${month}`,
      year,
      month,
      title: isPres
        ? (month === 2 ? `${year} First Presidential Debate (Domestic & Economy)` : `${year} Final Presidential Debate (Foreign Policy & Closing)`)
        : `${year} National Midterm Showcase Debate`,
      questions: picked,
      qualifiesThirdPartyBreakout,
      resolved: false,
    };
  }

  function computeRivalDebatePerformance(game, rivalPartyId, month = 2) {
    const rId = rivalPartyId || 'heritage';
    const nomName = game?.presidentialTicket?.[rId];
    const pool = [...(game?.sittingMembers || []), ...(game?.politicians || [])];
    const pol = nomName ? pool.find((p) => p && p.name === nomName) : null;
    const debateStat = Number(pol?.ratings?.debate ?? 6);
    const charismaStat = Number(pol?.ratings?.charisma ?? 6);
    const mediaStat = Number(pol?.ratings?.mediaSavvy ?? 6);
    let score = ((debateStat * 0.45 + charismaStat * 0.35 + mediaStat * 0.20) - 6.0) * 0.35;
    const traits = Array.isArray(pol?.traits) ? pol.traits : [];
    if (traits.includes('Polished')) score += 0.35;
    if (traits.includes('Disciplined')) score += 0.25;
    if (traits.includes('Rising Star')) score += 0.20;
    if (traits.includes('Undisciplined')) score -= 0.45;
    if (traits.includes('Corrupt')) score -= 0.35;
    const vpObj = game?.parties?.[rId]?.vpNominee;
    if (vpObj) {
      score += (Number(vpObj.quality ?? 6) - 6.0) * 0.08;
    }
    const mediaCh = game?.mediaChannels?.[rId] || {};
    const avgReach = ((Number(mediaCh.digital ?? 50) + Number(mediaCh.broadcast ?? 50) + Number(mediaCh.cable ?? 50)) / 3);
    score += (avgReach - 50) * 0.008;
    const jitter = (hashFloat(`${game?.seed || 1}:${game?.year || 2028}:rivdeb:${rId}:m${month}`) - 0.5) * 0.35;
    score = round(clamp(score + jitter, -1.2, 1.6), 2);
    return { partyId: rId, nomineeName: nomName || rId, score };
  }

  function resolveDebate(game, payload = {}) {
    const debate = game?.campaign?.pendingDebate;
    if (!debate || debate.resolved) return game;
    const posture = payload.posture || 'pivot_swing'; // attack_record | protect_base | pivot_swing | elevate_downballot
    const answers = Array.isArray(payload.answers) ? payload.answers : ['pragmatic', 'pragmatic', 'pragmatic'];
    const month = clamp(Number(game.campaign.month || 2), 1, 5);
    const eff = getMonthEfficiency(month);

    const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
    const nomineeName = game.presidentialTicket?.[pId] || game.player?.name || 'Nominee';
    const pol = [...(game.sittingMembers || []), ...(game.politicians || [])].find((p) => p && p.name === nomineeName);
    const traits = Array.isArray(pol?.traits) ? pol.traits : [];
    const debateStat = Number(pol?.ratings?.debate ?? 6);
    const charismaStat = Number(pol?.ratings?.charisma ?? 6);
    const mediaStat = Number(pol?.ratings?.mediaSavvy ?? 6);
    const baseScore = (debateStat * 0.45 + charismaStat * 0.3 + mediaStat * 0.25) / 10; // ~0.6

    const roll = hashFloat(`${game.seed || 1}:${game.year}:debres:m${month}:${posture}:${answers.join(',')}`);
    let gaffeChance = 0.14;
    if (traits.includes('Polished')) gaffeChance *= 0.5;
    if (traits.includes('Disciplined')) gaffeChance *= 0.7;
    if (traits.includes('Undisciplined')) gaffeChance += 0.16;
    if (traits.includes('Rough')) gaffeChance += 0.08;

    const isGaffe = roll < gaffeChance;
    const isKnockout = !isGaffe && (roll > (traits.includes('Rough') ? 0.68 : 0.76));

    let persuasionShift = round((baseScore * 1.6 - 0.5) * eff.persuasion * 0.4, 2);
    let turnoutShift = 0;
    let trustDelta = 0;
    let downballotBoost = 0;

    if (posture === 'attack_record') persuasionShift += isKnockout ? 1.4 : (isGaffe ? -1.2 : 0.6);
    if (posture === 'protect_base') turnoutShift += round(1.0 * eff.turnout * 0.4, 2);
    if (posture === 'pivot_swing') { persuasionShift += 0.8; trustDelta += 2; }
    if (posture === 'elevate_downballot') downballotBoost += 1.2;

    // #21: Score each individual question answer
    answers.slice(0, 3).forEach((ans) => {
      if (ans === 'aggressive') { persuasionShift += isGaffe ? -0.4 : 0.45; trustDelta -= 0.5; }
      else if (ans === 'base') { turnoutShift += round(0.45 * eff.turnout * 0.4, 2); }
      else if (ans === 'visionary') { persuasionShift += 0.35; downballotBoost += 0.25; }
      else { persuasionShift += 0.3; trustDelta += 0.5; } // pragmatic
    });

    if (isKnockout) persuasionShift += 1.5;
    // [v0.18.4 MEDIA-SHOCKS]
    const _msDebSal = global.MediaShocksSystem?.getDebateSalienceMultiplier ? global.MediaShocksSystem.getDebateSalienceMultiplier(game, debate.questions) : 1.0;
    const _msGaffeVol = global.MediaShocksSystem?.getDigitalGaffeVolatilityMultiplier ? global.MediaShocksSystem.getDigitalGaffeVolatilityMultiplier(game) : 1.0;
    if (isGaffe) { persuasionShift -= round(1.6 * _msGaffeVol, 2); trustDelta -= 2; }
    persuasionShift = round(persuasionShift * _msDebSal, 2);
    if (debate.qualifiesThirdPartyBreakout) persuasionShift += 3.0;

    const oppDebPartyId = pId === 'people' ? 'heritage' : 'people';
    const rivalDebPerf = computeRivalDebatePerformance(game, oppDebPartyId, month);
    persuasionShift = round(persuasionShift - rivalDebPerf.score * 0.45, 2);
    const asked = [...(game.debateQuestionsAsked || []), ...debate.questions.map((q) => q.id)].slice(-24);
    const outcomeTag = isKnockout ? 'Knockout Debate Win' : (isGaffe ? 'Costly Unscripted Gaffe' : 'Solid Debate Performance');
    const note = `${debate.title}: ${outcomeTag}! (${persuasionShift >= 0 ? '+' : ''}${persuasionShift}% persuasion${debate.qualifiesThirdPartyBreakout ? ', +3.0% 3rd-Party Breakout Stage!' : ''})`;

    return {
      ...game,
      debateQuestionsAsked: asked,
      trust: {
        ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }),
        independents: clamp(round((game.trust?.independents ?? 40) + trustDelta, 1), 0, 100),
      },
      campaign: {
        ...game.campaign,
        pendingDebate: { ...debate, resolved: true, outcomeTag, persuasionShift, turnoutShift, downballotBoost },
        debatePersuasionLift: round((game.campaign.debatePersuasionLift || 0) + persuasionShift, 2),
        debateTurnoutLift: round((game.campaign.debateTurnoutLift || 0) + turnoutShift, 2),
        debateDownballotLift: round((game.campaign.debateDownballotLift || 0) + downballotBoost, 2),
      },
      lastNote: note,
    };
  }

  // ==========================================================================
  // 5. 42 UNIQUE TRAIT-TRIGGERED "OCTOBER SURPRISES" & RAPID-RESPONSE CRISES
  // ==========================================================================
  const CAMPAIGN_CRISIS_CATALOG = [
    // A. Undisciplined (8)
    { id: 'cr_und_01', trait: 'Undisciplined', title: 'Hot-Mic Town Hall Gaffe', summary: 'caught on an open mic mocking local swing-county voters.', severity: 'high' },
    { id: 'cr_und_02', trait: 'Undisciplined', title: 'Midnight Social-Media Meltdown', summary: 'posted an unvetted 3 AM tirade alienating suburban Independents.', severity: 'high' },
    { id: 'cr_und_03', trait: 'Undisciplined', title: 'Off-Script Interview Detour', summary: 'abandoned talking points on Sunday TV and contradicted the party platform.', severity: 'medium' },
    { id: 'cr_und_04', trait: 'Undisciplined', title: 'Heated Heckler Confrontation', summary: 'went viral after losing their temper with a voter outside a diner.', severity: 'medium' },
    { id: 'cr_und_05', trait: 'Undisciplined', title: 'Leaked Campaign Staff Audio', summary: 'heard on leaked audio calling a key coalition faction "dead weight."', severity: 'high' },
    { id: 'cr_und_06', trait: 'Undisciplined', title: 'Unauthorized Policy Promise', summary: 'pledged a massive unfunded program live on air without Chair sign-off.', severity: 'medium' },
    { id: 'cr_und_07', trait: 'Undisciplined', title: 'Podcast Tangent Firestorm', summary: 'spent 40 minutes on a fringe podcast making headline-grabbing remarks.', severity: 'medium' },
    { id: 'cr_und_08', trait: 'Undisciplined', title: 'Debate-Stage Cross-Talk Blowup', summary: 'talked over a moderator and insulted a popular local official.', severity: 'medium' },
    // B. Corrupt (8)
    { id: 'cr_cor_01', trait: 'Corrupt', title: 'Shell-Company Donor Dump', summary: 'linked by investigative reporters to undisclosed dark-money shell LLCs.', severity: 'high' },
    { id: 'cr_cor_02', trait: 'Corrupt', title: 'Stock-Trade Timing Scandal', summary: 'financial disclosures revealed suspiciously timed trades before a committee briefing.', severity: 'high' },
    { id: 'cr_cor_03', trait: 'Corrupt', title: 'No-Bid State Contract Kickback', summary: 'whistleblower alleged a major donor received a lucrative no-bid state contract.', severity: 'high' },
    { id: 'cr_cor_04', trait: 'Corrupt', title: 'Luxury Lobbyist Retreat Photos', summary: 'photographed vacationing on a corporate lobbyist yacht during a cost-of-living crunch.', severity: 'medium' },
    { id: 'cr_cor_05', trait: 'Corrupt', title: 'Campaign Finance Reporting Probe', summary: 'ethics board opened an inquiry into unreported consulting payments to family members.', severity: 'high' },
    { id: 'cr_cor_06', trait: 'Corrupt', title: 'Pay-to-Play Endorsement Leak', summary: 'leaked texts suggested a quid-pro-quo promise for a regulatory appointment.', severity: 'high' },
    { id: 'cr_cor_07', trait: 'Corrupt', title: 'Ghost-Employee Payroll Story', summary: 'local paper uncovered campaign disbursements to a non-existent field firm.', severity: 'medium' },
    { id: 'cr_cor_08', trait: 'Corrupt', title: 'Tax-Shelter Offshore Revelation', summary: 'documents tied a family trust to offshore tax havens days before early voting.', severity: 'high' },
    // C. Rough (6)
    { id: 'cr_rgh_01', trait: 'Rough', title: 'Combative Union Hall Speech', summary: 'delivered a blistering populist rant that thrilled the base but rattled moderate donors.', severity: 'mixed' },
    { id: 'cr_rgh_02', trait: 'Rough', title: 'Cable-News Host Ambush Reversal', summary: 'aggressively dismantled a hostile interviewer live on air.', severity: 'positive' },
    { id: 'cr_rgh_03', trait: 'Rough', title: 'Attack-Ad Overreach', summary: 'hard-hitting negative spot triggered bipartisan editorial pushback.', severity: 'medium' },
    { id: 'cr_rgh_04', trait: 'Rough', title: 'Rival Nickname Sticks', summary: 'coined a devastating viral label for the opponent dominating headlines all month.', severity: 'positive' },
    { id: 'cr_rgh_05', trait: 'Rough', title: 'Feud with Local Editorial Board', summary: 'publicly shredded the state’s largest newspaper at a rally.', severity: 'mixed' },
    { id: 'cr_rgh_06', trait: 'Rough', title: 'Populist Boycott Call', summary: 'called for a boycott of a major swing-state employer, energizing activists while alarming business blocs.', severity: 'mixed' },
    // D. Rising Star (6)
    { id: 'cr_rs_01', trait: 'Rising Star', title: 'Breakout Viral Town Hall Clip', summary: 'authentic 90-second answer hit 20M views overnight, surging youth & Independent persuasion.', severity: 'positive' },
    { id: 'cr_rs_02', trait: 'Rising Star', title: 'Small-Dollar Fundraising Explosion', summary: 'grassroots surge brought in an unexpected $4M windfall in 48 hours.', severity: 'positive' },
    { id: 'cr_rs_03', trait: 'Rising Star', title: 'National Magazine Profile', summary: 'glowing cover story boosted fame and regional downballot coattails.', severity: 'positive' },
    { id: 'cr_rs_04', trait: 'Rising Star', title: 'Overexposure Backlash', summary: 'rival Super PACs flooded the zone painting the rising star as "all style, no substance."', severity: 'medium' },
    { id: 'cr_rs_05', trait: 'Rising Star', title: 'Celebrity & Cultural Endorsement Wave', summary: 'high-profile cultural figures rallied behind the ticket in key metro markets.', severity: 'positive' },
    { id: 'cr_rs_06', trait: 'Rising Star', title: 'Grassroots Volunteer Stampede', summary: 'state chapters reported double the normal weekend canvassing sign-ups.', severity: 'positive' },
    // E. Established Politician (4)
    { id: 'cr_est_01', trait: 'Established Politician', title: '20-Year-Old Floor Vote Unearthed', summary: 'rival researchers dug up an unpopular decade-old vote clashing with today’s base.', severity: 'medium' },
    { id: 'cr_est_02', trait: 'Established Politician', title: 'Bipartisan Elder Statesman Endorsement', summary: 'respected retired opposing-party official crossed the aisle to vouch for your ticket.', severity: 'positive' },
    { id: 'cr_est_03', trait: 'Established Politician', title: 'Insider "Swamp" Attack Ad Blitz', summary: 'populist challenger painted the nominee as a career creature of Washington.', severity: 'medium' },
    { id: 'cr_est_04', trait: 'Established Politician', title: 'Institutional Donor Coalition Rally', summary: 'legacy donors and trade associations stepped in to backstop a cash-strapped battleground.', severity: 'positive' },
    // F. Polished & Disciplined (4)
    { id: 'cr_pol_01', trait: 'Polished', title: 'Flawless Crisis Press Conference', summary: 'calmly defused a brewing controversy in 5 minutes, earning praise across editorial pages.', severity: 'positive' },
    { id: 'cr_pol_02', trait: 'Polished', title: 'Telegenic Local-TV Sweep', summary: 'crushed 6 swing-market local news interviews in a single day.', severity: 'positive' },
    { id: 'cr_pol_03', trait: 'Disciplined', title: 'Robotic / Over-Rehearsed Critique', summary: 'viral montage mocked repeating the exact same focus-grouped slogan four times.', severity: 'medium' },
    { id: 'cr_pol_04', trait: 'Disciplined', title: 'Precision Ground-Game Execution', summary: 'disciplined scheduling hit every battleground media market before early voting.', severity: 'positive' },
    // G. Squeaky Clean (3)
    { id: 'cr_sc_01', trait: 'Squeaky Clean', title: 'Failed Rival Smear Backfire', summary: 'opponent’s negative attack collapsed under fact-checking, delivering a sympathy bounce.', severity: 'positive' },
    { id: 'cr_sc_02', trait: 'Squeaky Clean', title: 'Ethics Reform Town Hall Halo', summary: 'independent watchdogs spotlighted clean financial disclosures, lifting Independent trust.', severity: 'positive' },
    { id: 'cr_sc_03', trait: 'Squeaky Clean', title: 'Bipartisan Integrity Endorsement', summary: 'good-government coalition highlighted the candidate in a razor-thin contest.', severity: 'positive' },
    // H. External & Coalition Shocks (3)
    { id: 'cr_ext_01', trait: 'External', title: 'Late-Breaking Economic Data Release', summary: 'surprise inflation and jobs report jolted the national environment.', severity: 'mixed' },
    { id: 'cr_ext_02', trait: 'External', title: 'Severe Weather / Early-Voting Disruption', summary: 'major storm hit a battleground region, putting chapter turnout logistics to the test.', severity: 'mixed' },
    { id: 'cr_ext_03', trait: 'External', title: 'Third-Party Spoiler Surge Headline', summary: 'minor-party nominee spiked 4 points in a swing state, forcing an immediate strategic response.', severity: 'mixed' },
  ];

  function buildCrisisChoices(crisis) {
    if (crisis.severity === 'positive') {
      return [
        { id: 'amplify_ads', label: 'Amplify with Paid Media ($1M)', cost: 1.0, pollDelta: 1.6, trustDelta: 1, happinessDelta: 2, treasuryDelta: 0 },
        { id: 'fundraise_off', label: 'Convert into Small-Dollar Appeal ($0)', cost: 0, pollDelta: 0.6, trustDelta: 0, happinessDelta: 1, treasuryDelta: 3.0 },
        { id: 'boost_downballot', label: 'Share Spotlight with Downballot Ticket ($0)', cost: 0, pollDelta: 0.8, trustDelta: 2, happinessDelta: 3, treasuryDelta: 0 },
      ];
    }
    return [
      { id: 'defend_rally', label: 'Defend & Rally the Base ($1M)', cost: 1.0, pollDelta: -0.4, trustDelta: -1, happinessDelta: 3, treasuryDelta: 0 },
      { id: 'distance_protect', label: 'Distance & Protect Downballot ($0)', cost: 0, pollDelta: -0.9, trustDelta: 1, happinessDelta: -2, treasuryDelta: 0 },
      { id: 'counter_attack', label: 'Counter-Attack with Rapid Response ($1.5M)', cost: 1.5, pollDelta: 0.2, trustDelta: -1, happinessDelta: 1, treasuryDelta: 0 },
    ];
  }

  function rollMonthlyTraitCrises(game, month) {
    // [v0.18.5 PLAYTEST-FIXES] No crises during the starting cycle
    if (Number(game?.year || 2028) <= Number(game?.startingYear || 2028)) return [];
    if (month < 2) return [];
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const fired = new Set(game?.campaign?.firedCrisisIds || []);
    const activePols = [...(game.sittingMembers || []), ...(game.politicians || [])]
      .filter((p) => p && !p.retired && (p.party === pId || p.partyId === pId));
    const traitsPresent = new Set(['External']);
    activePols.forEach((p) => (p.traits || []).forEach((t) => traitsPresent.add(t)));

    const candidates = CAMPAIGN_CRISIS_CATALOG.filter((c) => !fired.has(c.id) && traitsPresent.has(c.trait));
    if (!candidates.length) return [];

    const count = month >= 4 ? 2 : 1;
    const out = [];
    const pool = [...candidates];
    for (let i = 0; i < count && pool.length > 0; i++) {
      const idx = Math.floor(hashFloat(`${game.seed || 1}:${game.year}:cr:m${month}:${i}`) * pool.length);
      const picked = pool.splice(idx, 1)[0];
      const matchingPols = picked.trait === 'External'
        ? activePols
        : activePols.filter((p) => Array.isArray(p.traits) && p.traits.includes(picked.trait));
      const subject = matchingPols.length
        ? matchingPols[Math.floor(hashFloat(`${game.seed || 1}:${game.year}:crp:${picked.id}`) * matchingPols.length)]
        : { name: game.presidentialTicket?.[pId] || 'National Ticket', stateId: 'PA', office: 'presidential' };
      out.push({
        ...picked,
        month,
        politicianName: subject.name,
        stateId: subject.stateId || 'PA',
        office: subject.office || 'presidential',
        headline: picked.trait === 'External' ? `${picked.title}: ${picked.summary}` : `${subject.name} (${subject.stateId || 'US'}) ${picked.summary}`,
        choices: buildCrisisChoices(picked),
        resolved: false,
      });
    }
    return out;
  }

  function resolveCampaignCrisis(game, crisisId, choiceId) {
    const list = Array.isArray(game?.campaign?.activeCrises) ? game.campaign.activeCrises : [];
    const target = list.find((c) => c.id === crisisId && !c.resolved);
    if (!target) return game;
    const choice = (target.choices || []).find((ch) => ch.id === choiceId) || target.choices[0];
    if ((game.treasury || 0) < (choice.cost || 0)) {
      return { ...game, lastNote: `Insufficient funds ($${choice.cost}M required) for ${choice.label}.` };
    }
    const nextCrises = list.map((c) => (c.id === crisisId ? { ...c, resolved: true, chosenId: choice.id } : c));
    const nextStateBoosts = { ...(game.campaign.crisisStatePolls || {}) };
    nextStateBoosts[target.stateId] = round((nextStateBoosts[target.stateId] || 0) + (choice.pollDelta || 0), 2);
    const nextFH = { ...(game.factionHappiness || {}) };
    if (choice.happinessDelta) {
      const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      (game.factions || []).filter((f) => f.partyId === pId).forEach((f) => {
        const curH = nextFH[f.id] ?? 50;
        nextFH[f.id] = global.PartyChairEngine?.applyScaledFactionHappinessDelta
          ? global.PartyChairEngine.applyScaledFactionHappinessDelta(curH, choice.happinessDelta)
          : clamp(round(curH + choice.happinessDelta, 1), 0, 100);
      });
    }
    return {
      ...game,
      factionHappiness: nextFH,
      treasury: round(Math.max(0, (game.treasury || 0) - (choice.cost || 0) + (choice.treasuryDelta || 0)), 2),
      trust: {
        ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }),
        independents: clamp(round((game.trust?.independents ?? 40) + (choice.trustDelta || 0), 1), 0, 100),
      },
      campaign: {
        ...game.campaign,
        activeCrises: nextCrises,
        crisisStatePolls: nextStateBoosts,
      },
      lastNote: `Crisis Handled (${target.title}): ${choice.label} (${choice.pollDelta >= 0 ? '+' : ''}${choice.pollDelta}% in ${target.stateId}).`,
    };
  }

  // ==========================================================================
  // 6. OPPOSITION RESEARCH ("OPPO DROPS")
  // ==========================================================================
  function commissionOppoResearch(game, payload = {}) {
    const c = game?.campaign;
    if (!c) return game;
    const month = clamp(Number(c.month || 1), 1, 5);
    if (month > 3) return { ...game, lastNote: 'Opposition research can only be commissioned in Months 1–3.' };
    if ((c.monthlyActionsLeft ?? 0) < 1) return { ...game, lastNote: 'No campaign actions remaining this month.' };

    const targetPartyId = payload.partyId || (game.player?.baseTemplateId === 'people' ? 'heritage' : 'people');
    const stateId = payload.stateId || 'PA';
    const tierCost = payload.raceTier === 'presidential' ? 3.0 : 1.5;
    if ((game.treasury || 0) < tierCost) return { ...game, lastNote: `Need $${tierCost.toFixed(1)}M to commission opposition research.` };

    const allRivalPols = [...(game.sittingMembers || []), ...(game.politicians || [])]
      .filter((p) => p && !p.retired && (p.party === targetPartyId || p.partyId === targetPartyId));
    const requestedPol = (payload.politicianId || payload.targetPoliticianId)
      ? allRivalPols.find((p) => p.id === (payload.politicianId || payload.targetPoliticianId) || p.name === (payload.politicianId || payload.targetPoliticianId))
      : null;
    const stateRivalPols = allRivalPols
      .filter((p) => !payload.stateId || p.stateId === stateId)
      .sort((a, b) => Number(b.fame || 0) - Number(a.fame || 0));
    const targetPol = requestedPol || stateRivalPols[0] || { name: game.presidentialTicket?.[targetPartyId] || 'Rival Nominee', traits: [], stateId };
    const traits = Array.isArray(targetPol.traits) ? targetPol.traits : [];

    let hitRate = 0.45;
    if (traits.includes('Corrupt')) hitRate = 0.85;
    else if (traits.includes('Undisciplined')) hitRate = 0.70;
    else if (traits.includes('Squeaky Clean')) hitRate = 0.15;

    const roll = hashFloat(`${game.seed || 1}:${game.year}:oppo:m${month}:${targetPartyId}:${stateId}:${(c.oppoDossiers || []).length}`);
    const found = roll < hitRate;
    const nextDossiers = Array.isArray(c.oppoDossiers) ? [...c.oppoDossiers] : [];
    if (found) {
      nextDossiers.push({
        id: `oppo_${game.year}_${nextDossiers.length + 1}`,
        targetPartyId,
        targetName: targetPol.name,
        stateId,
        severity: traits.includes('Corrupt') ? 'high' : 'medium',
        detonated: false,
      });
    }
    return {
      ...game,
      treasury: round((game.treasury || 0) - tierCost, 2),
      campaign: {
        ...c,
        monthlyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        weeklyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        oppoDossiers: nextDossiers,
      },
      lastNote: found
        ? `Oppo Research Hit! Uncovered a ${traits.includes('Corrupt') ? 'High-Severity' : 'Damaging'} dossier on ${targetPol.name} (${stateId})—ready to detonate in War Room.`
        : `Oppo Research came up empty on ${targetPol.name} (${stateId}).`,
    };
  }

  function releaseOppoDossier(game, dossierId) {
    const c = game?.campaign;
    if (!c) return game;
    if ((c.monthlyActionsLeft ?? 0) < 1) return { ...game, lastNote: 'No campaign actions remaining this month.' };
    const dossiers = Array.isArray(c.oppoDossiers) ? c.oppoDossiers : [];
    const anyMatch = dossiers.find((d) => d.id === dossierId);
    if (!anyMatch) return { ...game, lastNote: 'Opposition research dossier not found.' };
    if (anyMatch.detonated) return { ...game, lastNote: `Opposition dossier on ${anyMatch.targetName} (${anyMatch.stateId}) has already been released.` };
    const target = anyMatch;

    const month = clamp(Number(c.month || 1), 1, 5);
    const isOctoberSurprise = month === 5;
    const shock = isOctoberSurprise ? (target.severity === 'high' ? 5.0 : 3.5) : 2.0;
    const nextStateBoosts = { ...(c.oppoStateEffects || {}) };
    nextStateBoosts[target.stateId] = round((nextStateBoosts[target.stateId] || 0) + shock, 2);

    return {
      ...game,
      campaign: {
        ...c,
        monthlyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        weeklyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        oppoDossiers: dossiers.map((d) => (d.id === dossierId ? { ...d, detonated: true, detonatedMonth: month } : d)),
        oppoStateEffects: nextStateBoosts,
      },
      lastNote: isOctoberSurprise
        ? `OCTOBER SURPRISE! Dropped dossier on ${target.targetName} (${target.stateId}) for -${shock.toFixed(1)}% rival poll shock with zero recovery time!`
        : `Released oppo dossier on ${target.targetName} (${target.stateId}) (-${shock.toFixed(1)}% rival poll + ad bleed).`,
    };
  }

  // ==========================================================================
  // 7. DEPLOYABLE SURROGATES (TOP 10 MOST FAMOUS POLITICIANS, MIN FAME 50)
  // ==========================================================================
  function getEligibleSurrogates(game) {
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const altIds = new Set([pId, game?.player?.id, game?.player?.custom ? 'player' : null].filter(Boolean));
    const seen = new Map();
    [...(game?.sittingMembers || []), ...(game?.politicians || [])].forEach((p) => {
      if (!p || p.retired) return;
      if (!altIds.has(p.party) && !altIds.has(p.partyId)) return;
      const fame = Number(p.fame || 0);
      if (fame < 50) return;
      const key = p.id || p.name;
      if (!seen.has(key) || fame > Number(seen.get(key).fame || 0)) {
        seen.set(key, p);
      }
    });
    return Array.from(seen.values())
      .sort((a, b) => Number(b.fame || 0) - Number(a.fame || 0))
      .slice(0, 10);
  }

  function deploySurrogate(game, politicianId, stateId) {
    const c = game?.campaign;
    if (!c || !politicianId || !stateId) return game;
    if ((c.monthlyActionsLeft ?? 0) < 1) return { ...game, lastNote: 'No campaign actions remaining this month.' };
    const usedThisMonth = Array.isArray(c.surrogatesUsedThisMonth) ? c.surrogatesUsedThisMonth : [];
    if (usedThisMonth.includes(politicianId)) {
      return { ...game, lastNote: 'That surrogate has already been deployed this month.' };
    }
    const eligible = getEligibleSurrogates(game);
    const sur = eligible.find((p) => p.id === politicianId || p.name === politicianId);
    if (!sur) return { ...game, lastNote: 'Surrogate must be among your top 10 most famous politicians (min. 50 fame).' };
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    if (!isPlayerMajorParty(game)) {
      const ba = game?.ballotAccess?.[pId] || game?.statutoryBallotAccess?.[pId];
      const hasAccess = !ba || Boolean(ba[stateId] || ba?.presidential?.[stateId] || ba?.senate?.[stateId] || ba?.governor?.[stateId]);
      if (!hasAccess) {
        return { ...game, lastNote: `Cannot deploy surrogate ${sur.name} to ${stateId}: your party does not have ballot access in ${stateId}.` };
      }
    }

    const month = clamp(Number(c.month || 1), 1, 5);
    const eff = getMonthEfficiency(month);
    const validStSet = new Set([...(global.PartyChairData?.STATES || []).map((s) => s.id), 'DC']);
    if (!validStSet.has(stateId)) {
      return { ...game, lastNote: `Invalid state code "${stateId}" for surrogate deployment.` };
    }
    const stObj = (global.PartyChairData?.STATES || []).find((s) => s.id === stateId);
    const homeMatch = sur.stateId === stateId || (Array.isArray(sur.regions) && stObj && sur.regions.includes(stObj.region));
    const synergyMult = homeMatch ? 1.5 : 1.0;
    const turnoutGain = round(0.9 * synergyMult * eff.turnout * 0.5, 2);
    const persGain = round(0.6 * synergyMult * eff.persuasion * 0.4, 2);

    // Primary unity healing if surrogate was a losing primary rival
    const nextFC = { ...(game.factionConfidence || {}) };
    const nextFH = { ...(game.factionHappiness || {}) };
    let unityNote = '';
    const simYear = game.simulatedPrimaries?.[game.year]?.[game.player?.baseTemplateId || 'people'];
    const wasPrimaryRival = simYear && (simYear.candidates || []).some((cand) => cand.name === sur.name && cand.id !== simYear.nomineeId);
    if (wasPrimaryRival && sur.factionId && (nextFH[sur.factionId] ?? 50) >= 40) {
      nextFC[sur.factionId] = clamp(round((nextFC[sur.factionId] ?? 50) + 2, 1), 0, 100);
      nextFH[sur.factionId] = clamp(round((nextFH[sur.factionId] ?? 50) + 3, 1), 0, 100);
      unityNote = ' Primary unity healed (+2 confidence, +3 happiness)!';
    }

    const nextSurEffects = { ...(c.surrogateStateEffects || {}) };
    nextSurEffects[stateId] = round((nextSurEffects[stateId] || 0) + turnoutGain + persGain, 2);
    return {
      ...game,
      factionConfidence: nextFC,
      factionHappiness: nextFH,
      campaign: {
        ...c,
        monthlyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        weeklyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        surrogatesUsedThisMonth: [...usedThisMonth, sur.id || sur.name],
        surrogateStateEffects: nextSurEffects,
      },
      lastNote: `Deployed surrogate ${sur.name} (Fame ${sur.fame}) to ${stateId}: +${round(turnoutGain + persGain, 2)}% lift${homeMatch ? ' (Regional Synergy +50%)' : ''}.${unityNote}`,
    };
  }

  // ==========================================================================
  // 8. FACTION TRAIL ULTIMATUMS & TOSS-UP WATCH
  // ==========================================================================
  function checkFactionTrailUltimatum(game, month) {
    if (month !== 3 && month !== 4) return null;
    const pId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const issued = new Set(game?.campaign?.ultimatumFactionIds || []);
    const unhappyMajor = (game?.factions || []).find(
      (f) => f.partyId === pId && f.status === 'major' && !issued.has(f.id) && Number(game.factionHappiness?.[f.id] ?? 50) < 35
    );
    if (!unhappyMajor) return null;
    return {
      id: `ult_${game.year}_${unhappyMajor.id}`,
      factionId: unhappyMajor.id,
      factionName: unhappyMajor.name,
      month,
      headline: `${unhappyMajor.name} issues a Month ${month} Trail Ultimatum: fund our priorities or we sit out Election Day GOTV!`,
      resolved: false,
    };
  }

  function resolveTrailUltimatum(game, ultimatumId, choice) {
    const ult = game?.campaign?.pendingUltimatum;
    if (!ult || ult.id !== ultimatumId || ult.resolved) return game;
    const nextFH = { ...(game.factionHappiness || {}) };
    const nextFC = { ...(game.factionConfidence || {}) };
    const nextTrust = { ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }) };
    let nextTreasury = Number(game.treasury || 0);
    const turnoutPenalties = { ...(game.campaign.ultimatumTurnoutPenalties || {}) };

    if (choice === 'meet') {
      if (nextTreasury < 2.0) return { ...game, lastNote: 'Insufficient funds ($2.0M required to meet faction ultimatum).' };
      nextTreasury = round(nextTreasury - 2.0, 2);
      nextFH[ult.factionId] = clamp(round((nextFH[ult.factionId] ?? 30) + 10, 1), 0, 100);
      nextTrust.independents = clamp(round((nextTrust.independents ?? 40) - 2, 1), 0, 100);
    } else if (choice === 'compromise') {
      if (nextTreasury < 1.0) return { ...game, lastNote: 'Insufficient funds ($1.0M required to compromise on ultimatum).' };
      nextTreasury = round(nextTreasury - 1.0, 2);
      nextFH[ult.factionId] = clamp(round((nextFH[ult.factionId] ?? 30) + 5, 1), 0, 100);
      nextTrust.independents = clamp(round((nextTrust.independents ?? 40) - 1, 1), 0, 100);
    } else {
      turnoutPenalties[ult.factionId] = -12;
      nextFC[ult.factionId] = clamp(round((nextFC[ult.factionId] ?? 50) - 4, 1), 0, 100);
    }

    return {
      ...game,
      treasury: nextTreasury,
      factionHappiness: nextFH,
      factionConfidence: nextFC,
      trust: nextTrust,
      campaign: {
        ...game.campaign,
        pendingUltimatum: { ...ult, resolved: true, choice },
        ultimatumFactionIds: [...(game.campaign.ultimatumFactionIds || []), ult.factionId],
        ultimatumTurnoutPenalties: turnoutPenalties,
      },
      lastNote: `Trail Ultimatum (${ult.factionName}) resolved via "${choice}".`,
    };
  }

  function getTossUpWatchRaces(game) {
    const states = global.PartyChairData?.STATES || [];
    const eng = global.PartyChairEngine;
    const isPresYear = (Number(game?.year || 2028) % 4) === 0;
    const list = [];
    if (isPresYear) {
      states.forEach((st) => {
        let rawMargin = Number(st.leanPercent ?? (Number(st.lean || 0) * -100));
        if (eng && typeof eng.presidentialStateMargin === "function") { try { rawMargin = Number(eng.presidentialStateMargin(game, st.id)); } catch (_) {} }
        const m = round(Math.abs(rawMargin), 1);
        if (m <= 4.5) list.push({ stateId: st.id, stateName: st.name, office: "Presidential", ev: st.ev || 5, margin: m });
      });
    }
    (Array.isArray(game?.activeSenateRaces) ? game.activeSenateRaces : []).forEach((r) => {
      const st = states.find((s) => s.id === (r?.state || r?.stateId));
      if (!st) return;
      let rawMargin = Number(st.leanPercent ?? (Number(st.lean || 0) * -100));
      if (eng && typeof eng.presidentialStateMargin === "function") { try { rawMargin = Number(eng.presidentialStateMargin(game, st.id)); } catch (_) {} }
      const m = round(Math.abs(rawMargin), 1);
      if (m <= 4.5) list.push({ stateId: st.id, stateName: st.name, office: "Senate", ev: st.ev || 5, margin: m });
    });
    (Array.isArray(game?.activeGubernatorialStates) ? game.activeGubernatorialStates : []).forEach((stId) => {
      const st = states.find((s) => s.id === stId);
      if (!st) return;
      let rawMargin = Number(st.leanPercent ?? (Number(st.lean || 0) * -100));
      if (eng && typeof eng.presidentialStateMargin === "function") { try { rawMargin = Number(eng.presidentialStateMargin(game, st.id)); } catch (_) {} }
      const m = round(Math.abs(rawMargin), 1);
      if (m <= 4.5) list.push({ stateId: st.id, stateName: st.name, office: "Governor", ev: st.ev || 5, margin: m });
    });
    if (!list.length) {
      states.forEach((st) => {
        const m = round(Math.abs(Number(st.leanPercent ?? (Number(st.lean || 0) * -100))), 1);
        if (m <= 4.5) list.push({ stateId: st.id, stateName: st.name, office: isPresYear ? "Presidential" : "Senate/Gov", ev: st.ev || 5, margin: m });
      });
    }
    return list.sort((a, b) => a.margin - b.margin).slice(0, 6);
  }

  // ==========================================================================
  // 9. CORRELATED NATIONAL & REGIONAL POLLING ERROR + MISS REPORT
  // ==========================================================================
  function generateCorrelatedPollingError(game) {
    const seed = game?.seed || 1;
    const year = Number(game?.year || 2028);
    // Triangular distribution in [2.0, 6.0] averaging 4.0
    const u1 = hashFloat(`${seed}:${year}:pollerr:u1`);
    const u2 = hashFloat(`${seed}:${year}:pollerr:u2`);
    const magnitude = round(2.0 + ((u1 + u2) / 2) * 4.0, 2); // [2.0..6.0], mean 4.0
    const sign = hashFloat(`${seed}:${year}:pollerr:sign`) < 0.5 ? 1 : -1;
    const natTargetError = round(magnitude * sign, 2);

    const regions = ['Northeast', 'Midwest', 'South', 'West'];
    const regionOffsets = {};
    regions.forEach((reg) => {
      const ru = hashFloat(`${seed}:${year}:pollerr:reg:${reg}`);
      regionOffsets[reg] = round((ru * 7.0) - 3.5, 2); // [-3.5..+3.5]
    });

    const states = global.PartyChairData?.STATES || [];
    const stateErrors = {};
    let weightedSum = 0;
    let totalWeight = 0;
    let deadOnState = null;
    let biggestMissState = null;

    states.forEach((st) => {
      const regOff = regionOffsets[st.region] || 0;
      const noise = round((hashFloat(`${seed}:${year}:pollerr:st:${st.id}`) * 6.0) - 3.0, 2);
      let err = round(natTargetError + 0.65 * regOff + 0.35 * noise, 2);
      // Enforce exact ±5.0 point spread around natTargetError, moving in the same direction
      const lo = sign > 0 ? Math.max(0, natTargetError - 5.0) : natTargetError - 5.0;
      const hi = sign < 0 ? Math.min(0, natTargetError + 5.0) : natTargetError + 5.0;
      err = round(clamp(err, lo, hi), 2);
      stateErrors[st.id] = err;

      const w = Number(st.ev || 5);
      weightedSum += err * w;
      totalWeight += w;
      if (!deadOnState || Math.abs(err) < Math.abs(deadOnState.error)) {
        deadOnState = { stateId: st.id, stateName: st.name, error: err };
      }
      if (!biggestMissState || Math.abs(err) > Math.abs(biggestMissState.error)) {
        biggestMissState = { stateId: st.id, stateName: st.name, error: err };
      }
    });

    const realizedNationalMiss = round(weightedSum / Math.max(1, totalWeight), 2);
    const regionalRealized = {};
    regions.forEach((reg) => {
      const regStates = states.filter((s) => s.region === reg);
      const avg = regStates.length
        ? regStates.reduce((acc, s) => acc + (stateErrors[s.id] || 0), 0) / regStates.length
        : realizedNationalMiss;
      regionalRealized[reg] = round(avg, 2);
    });

    const favoredParty = realizedNationalMiss >= 0 ? 'Democratic Party' : 'Republican Party';
    return {
      year,
      natTargetError,
      realizedNationalMiss,
      favoredParty,
      summary: `Polls underestimated ${favoredParty} by ${Math.abs(realizedNationalMiss).toFixed(1)} pts nationally.`,
      stateErrors,
      regionalRealized,
      deadOnState,
      biggestMissState,
    };
  }

  // ==========================================================================
  // 10. ELECTION EVE FINAL 72 HOURS BLITZ (MONTH 5)
  // ==========================================================================
  function resolveFinal72HoursBlitz(game, stateIds = []) {
    const c = game?.campaign;
    if (!c) return game;
    const month = clamp(Number(c.month || c.week || 1), 1, 5);
    if (month !== 5) return { ...game, lastNote: 'Final 72 Hours Blitz is only available in Month 5 (October).' };
    if (c.finalBlitzCompleted) return { ...game, lastNote: 'Final 72 Hours Blitz has already been completed this cycle.' };
    const validStSet = new Set([...(global.PartyChairData?.STATES || []).map((s) => s.id), 'DC']);
    const stops = Array.from(new Set((Array.isArray(stateIds) ? stateIds : []).filter((id) => validStSet.has(id)))).slice(0, 3);
    if (!stops.length) return { ...game, lastNote: 'Select at least 1 valid U.S. state for the Final 72 Hours Blitz.' };
    const eff = getMonthEfficiency(5); // 300% turnout
    const nextBlitz = { ...(c.finalBlitzEffects || {}) };
    stops.forEach((stId) => {
      nextBlitz[stId] = round((nextBlitz[stId] || 0) + 0.75 * eff.turnout, 2); // +2.25% turnout surge
    });
    const rivalStops = (c.rivalActivity?.mapPins || []).slice(0, 3).map((p) => ({ stateId: p.stateId, partyName: p.partyName }));
    return {
      ...game,
      campaign: {
        ...c,
        finalBlitzCompleted: true,
        finalBlitzStops: stops,
        finalBlitzRivalStops: rivalStops,
        finalBlitzEffects: nextBlitz,
      },
      lastNote: `Final 72 Hours Blitz completed in ${stops.join(', ')} (+2.25% Month-5 turnout surge each).`,
    };
  }

  // ==========================================================================
  // 11. FIVE APPROVED NEW CAMPAIGN ACTIONS (8 ACTIONS/MONTH BUDGET)
  // ==========================================================================
  function executeNewCampaignAction(game, actionId, payload = {}) {
    const c = game?.campaign;
    if (!c) return null;
    if (!c.active || (game.phase && game.phase !== 'campaign' && game.phase !== 'general-campaign')) {
      return { ...game, lastNote: 'Campaign War Room actions are only available during the active General Election Campaign.' };
    }
    if ((c.monthlyActionsLeft ?? 0) < 1) {
      return { ...game, lastNote: 'No campaign actions remaining this month (8/8 spent).' };
    }
    const month = clamp(Number(c.month || c.week || 1), 1, 5);
    const eff = getMonthEfficiency(month);

    // 1. Micro-Targeted Faction Ads (Regional Persuasion + Membership, 50% lower saturation)
    if (actionId === 'campaign-microtarget-faction') {
      const cost = 1.5;
      if ((game.treasury || 0) < cost) return { ...game, lastNote: 'Need $1.5M for Micro-Targeted Faction Ads.' };
      const states = global.PartyChairData?.STATES || [];
      const stateId = payload.stateId || 'PA';
      const anchorSt = states.find((s) => s.id === stateId);
      const targetRegion = payload.region || anchorSt?.region || 'Northeast';
      const regionStates = states.filter((s) => s.region === targetRegion);
      const affectedIds = regionStates.length ? regionStates.map((s) => s.id) : [stateId];
      const factionId = payload.factionId || 'ind_moderates';
      const satTier = getSaturationTier(c.stateSaturation?.[stateId] || 0);
      // [v0.18.4 MEDIA-SHOCKS]
      const _msAdPers = global.MediaShocksSystem?.getAdPersuasionMultiplier ? global.MediaShocksSystem.getAdPersuasionMultiplier(game) : 1.0;
      const _msSatScale = global.MediaShocksSystem?.getAdSaturationScale ? global.MediaShocksSystem.getAdSaturationScale(game) : 1.0;
      const persLift = round(1.1 * eff.persuasion * satTier.effMult * 0.4 * _msAdPers, 2);
      const memBoost = 4;
      let nextSat = { ...(c.stateSaturation || {}) };
      const nextStateEffects = { ...(c.actionStateEffects || {}) };
      const nextSpend = { ...(c.playerStateSpendLastMonth || {}) };
      affectedIds.forEach((sid) => {
        const mult = sid === stateId ? 1.0 : 0.45;
        nextSat = addStateSaturation(nextSat, sid, round(cost / affectedIds.length, 2), 10, round(0.5 * _msSatScale, 3));
        nextStateEffects[sid] = round((nextStateEffects[sid] || 0) + persLift * mult, 2);
      });
      nextSpend[stateId] = round((nextSpend[stateId] || 0) + cost, 2);
      const remAct = Math.max(0, (c.monthlyActionsLeft ?? 1) - 1);
      return {
        ...game,
        treasury: round((game.treasury || 0) - cost, 2),
        memberships: Math.round((game.memberships || 50) + memBoost),
        campaign: {
          ...c,
          monthlyActionsLeft: remAct,
          weeklyActionsLeft: remAct,
          stateSaturation: nextSat,
          actionStateEffects: nextStateEffects,
          playerStateSpendLastMonth: nextSpend,
        },
        lastNote: `Micro-Targeted Faction Ads (${factionId} across ${targetRegion}, anchored in ${stateId}): +${persLift}% persuasion, +${memBoost} memberships.`,
      };
    }

    // 2. Statewide Town Hall Barnstorm (Hybrid Persuasion + small Turnout boost, nominee traits applied)
    if (actionId === 'campaign-town-hall-barnstorm') {
      const cost = 0.5;
      if ((game.treasury || 0) < cost) return { ...game, lastNote: 'Need $0.5M for Statewide Town Hall Barnstorm.' };
      const stateId = payload.stateId || 'PA';
      const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const nomName = game.presidentialTicket?.[pId];
      const nomPol = nomName ? [...(game.sittingMembers || []), ...(game.politicians || [])].find((p) => p && p.name === nomName) : null;
      const traits = Array.isArray(nomPol?.traits) ? nomPol.traits : [];
      let traitMult = 1.0;
      let traitNote = '';
      if (traits.includes('Polished')) { traitMult += 0.25; traitNote = ' (Polished +25%)'; }
      else if (traits.includes('Rising Star')) { traitMult += 0.20; traitNote = ' (Rising Star +20%)'; }
      else if (traits.includes('Undisciplined')) { traitMult -= 0.20; traitNote = ' (Undisciplined -20%)'; }
      const persLift = round(0.75 * eff.persuasion * 0.35 * traitMult, 2);
      const turnoutLift = round(0.8 * eff.turnout * 0.35 * traitMult, 2);
      const totalLift = round(persLift + turnoutLift, 2);
      const nextStateEffects = { ...(c.actionStateEffects || {}) };
      nextStateEffects[stateId] = round((nextStateEffects[stateId] || 0) + totalLift, 2);
      const nextSpend = { ...(c.playerStateSpendLastMonth || {}) };
      nextSpend[stateId] = round((nextSpend[stateId] || 0) + cost, 2);
      const remAct = Math.max(0, (c.monthlyActionsLeft ?? 1) - 1);
      return {
        ...game,
        treasury: round((game.treasury || 0) - cost, 2),
        campaign: {
          ...c,
          monthlyActionsLeft: remAct,
          weeklyActionsLeft: remAct,
          actionStateEffects: nextStateEffects,
          playerStateSpendLastMonth: nextSpend,
        },
        lastNote: `Statewide Town Hall Barnstorm in ${stateId}: +${persLift}% persuasion & +${turnoutLift}% turnout lift${traitNote}.`,
      };
    }

    // 3. Coalition Unity Summit ($0, once per month, +5 scaled happiness to 2 factions, clears ultimatum risk, -1 Ind Trust)
    if (actionId === 'campaign-coalition-unity-summit') {
      if (c.unitySummitUsedMonth === month) {
        return { ...game, lastNote: 'Coalition Unity Summit can only be held once per month.' };
      }
      const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const partyFacs = (game.factions || []).filter((f) => f.partyId === pId);
      const sortedUnhappy = partyFacs.slice().sort((a, b) => (game.factionHappiness?.[a.id] ?? 50) - (game.factionHappiness?.[b.id] ?? 50));
      const f1 = payload.factionA || sortedUnhappy[0]?.id;
      const f2 = payload.factionB || sortedUnhappy[1]?.id;
      const nextFH = { ...(game.factionHappiness || {}) };
      [f1, f2].filter(Boolean).forEach((fid) => {
        const curH = nextFH[fid] ?? 50;
        nextFH[fid] = global.PartyChairEngine?.applyScaledFactionHappinessDelta
          ? global.PartyChairEngine.applyScaledFactionHappinessDelta(curH, 5)
          : clamp(round(curH + 5, 1), 0, 100);
      });
      const clearedUlt = c.pendingUltimatum && [f1, f2].includes(c.pendingUltimatum.factionId)
        ? { ...c.pendingUltimatum, resolved: true, choice: 'summit' }
        : c.pendingUltimatum;
      const remAct = Math.max(0, (c.monthlyActionsLeft ?? 1) - 1);
      return {
        ...game,
        factionHappiness: nextFH,
        trust: {
          ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }),
          independents: clamp(round((game.trust?.independents ?? 40) - 1, 1), 0, 100),
        },
        campaign: {
          ...c,
          monthlyActionsLeft: remAct,
          weeklyActionsLeft: remAct,
          unitySummitUsedMonth: month,
          pendingUltimatum: clearedUlt,
        },
        lastNote: `Coalition Unity Summit: +5 happiness to two key factions (-1 Independent Trust).`,
      };
    }

    // 4. Third-Party Spoiler Wedge / Vote-Splitting Blitz (Major Parties Only)
    if (actionId === 'campaign-spoiler-wedge') {
      const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const isMajor = isPlayerMajorParty(game);
      if (!isMajor) return { ...game, lastNote: 'Third-Party Spoiler Wedge is available to Major Parties only.' };
      const cost = 1.5;
      if ((game.treasury || 0) < cost) return { ...game, lastNote: 'Need $1.5M for Spoiler Wedge Blitz.' };
      const stateId = payload.stateId || 'PA';
      const minorPartyId = payload.minorPartyId || (pId === 'people' ? 'liberty' : 'green');
      const siphon = round(1.5 * eff.persuasion * 0.35, 2);
      const exposed = hashFloat(`${game.seed || 1}:${game.year}:wedge:m${month}:${stateId}`) < 0.20;
      const nextStateEffects = { ...(c.actionStateEffects || {}) };
      nextStateEffects[stateId] = round((nextStateEffects[stateId] || 0) + siphon, 2);
      const nextMinorBoosts = { ...(c.spoilerMinorBoosts || {}) };
      nextMinorBoosts[stateId] = { ...(nextMinorBoosts[stateId] || {}), [minorPartyId]: round((nextMinorBoosts[stateId]?.[minorPartyId] || 0) + siphon, 2) };
      const nextSpend = { ...(c.playerStateSpendLastMonth || {}) };
      nextSpend[stateId] = round((nextSpend[stateId] || 0) + cost, 2);
      const remAct = Math.max(0, (c.monthlyActionsLeft ?? 1) - 1);
      return {
        ...game,
        treasury: round((game.treasury || 0) - cost, 2),
        trust: {
          ...(game.trust || { supporters: 65, independents: 40, opponents: 12 }),
          independents: clamp(round((game.trust?.independents ?? 40) - (exposed ? 2 : 0), 1), 0, 100),
        },
        campaign: {
          ...c,
          monthlyActionsLeft: remAct,
          weeklyActionsLeft: remAct,
          actionStateEffects: nextStateEffects,
          spoilerMinorBoosts: nextMinorBoosts,
          playerStateSpendLastMonth: nextSpend,
        },
        lastNote: `Spoiler Wedge Blitz in ${stateId}: boosted ${minorPartyId} by +${siphon}% siphoned from rival base${exposed ? ' (exposed: -2 Independent Trust)' : ''}.`,
      };
    }

    // 5. Grassroots Viral Livestream / Small-Dollar Telethon (Fundraising + Membership, NOT turnout)
    if (actionId === 'campaign-viral-telethon') {
      if (c.telethonUsedMonth === month) {
        return { ...game, lastNote: 'Grassroots Viral Livestream can only be run once per month.' };
      }
      const pId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const nomineeName = game.presidentialTicket?.[pId];
      const pol = [...(game.sittingMembers || []), ...(game.politicians || [])].find((p) => p && p.name === nomineeName);
      const mediaSavvy = Number(pol?.ratings?.mediaSavvy ?? 6);
      const isRisingStar = Array.isArray(pol?.traits) && pol.traits.includes('Rising Star');
      const cashRaised = round(clamp(2.0 + (mediaSavvy / 10) * 2.5 + (isRisingStar ? 0.8 : 0), 2.0, 5.0), 2);
      const memBoost = Math.round(4 + (mediaSavvy / 10) * 5 + (isRisingStar ? 2 : 0)); // Boosts membership, NOT turnout
      return {
        ...game,
        treasury: round((game.treasury || 0) + cashRaised, 2),
        memberships: Math.round((game.memberships || 50) + memBoost),
        campaign: {
          ...c,
          monthlyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
        weeklyActionsLeft: Math.max(0, (c.monthlyActionsLeft ?? 1) - 1),
          telethonUsedMonth: month,
        },
        lastNote: `Grassroots Viral Livestream raised $${cashRaised.toFixed(2)}M and added +${memBoost} party memberships!`,
      };
    }

    // 6. General Persuasion State Boost (+0.5% to every race in target state + 1..1,000 random voters)
    if (
      actionId === 'campaign-statehouse-blitz'
      || actionId === 'statehouse-door-knock-blitz'
      || actionId === 'campaign-general-persuasion-boost'
    ) {
      const cost = 1.5;
      if ((game.treasury || 0) < cost) return { ...game, lastNote: 'Need $1.5M for General Persuasion Boost.' };
      const stateId = payload.stateId || 'PA';
      const playerPid = game.player?.custom ? 'player' : (game.player?.baseTemplateId || game.player?.id || 'people');
      const blitzCount = Number(c.statehouseBlitzCount || 0);
      const rngVal = hashFloat(`shBlitz:${game.seed || 2028}:${game.year || 2028}:${month}:${stateId}:${blitzCount}`);
      const addedVoters = Math.floor(rngVal * 1000) + 1;

      let nextVoterModel = game.voterModel;
      if (game.voterModel && Array.isArray(game.voterModel.states)) {
        nextVoterModel = {
          ...game.voterModel,
          states: game.voterModel.states.map((st) => {
            if ((st.stateId || st.id) !== stateId || !st.affiliations) return st;
            const aff = { ...st.affiliations };
            aff[playerPid] = Math.round(Number(aff[playerPid] || 0) + addedVoters);
            const isMinor = !['people', 'heritage', 'independent'].includes(playerPid);
            if (isMinor && aff.thirdParty !== undefined) {
              aff.thirdParty = Math.round(
                Number(aff.liberty || 0)
                + Number(aff.green || 0)
                + Number(aff.constitution || 0)
                + Number(aff.socialist || 0)
                + Number(aff.other || 0)
                + (game.player?.custom ? Number(aff.player || 0) : 0)
              );
            }
            const nextSt = { ...st, affiliations: aff };
            if (st.totalVoters !== undefined) {
              nextSt.totalVoters = Math.round(Number(st.totalVoters || 0) + addedVoters);
            }
            if (st.representedVoters !== undefined) {
              nextSt.representedVoters = Math.round(Number(st.representedVoters || 0) + addedVoters);
            }
            return nextSt;
          }),
        };
      }

      const prevBoosts = c.generalPersuasionStateBoosts || {};
      const nextGeneralPersuasionStateBoosts = {
        ...prevBoosts,
        [stateId]: round(Number(prevBoosts[stateId] || 0) + 0.5, 2),
      };
      const nextVoterDeltas = { ...(game.stateVoterDeltas || {}) };
      nextVoterDeltas[stateId] = {
        ...(nextVoterDeltas[stateId] || {}),
        [playerPid]: Number(nextVoterDeltas[stateId]?.[playerPid] || 0) + addedVoters,
      };
      const nextSpend = { ...(c.playerStateSpendLastMonth || {}), [stateId]: round((c.playerStateSpendLastMonth?.[stateId] || 0) + cost, 2) };
      const remAct = Math.max(0, (c.monthlyActionsLeft ?? 1) - 1);
      return {
        ...game,
        treasury: round((game.treasury || 0) - cost, 2),
        voterModel: nextVoterModel,
        stateVoterDeltas: nextVoterDeltas,
        campaign: {
          ...c,
          monthlyActionsLeft: remAct,
          weeklyActionsLeft: remAct,
          statehouseBlitzCount: blitzCount + 1,
          generalPersuasionStateBoosts: nextGeneralPersuasionStateBoosts,
          playerStateSpendLastMonth: nextSpend,
        },
        lastNote: `General Persuasion Boost (${stateId}): +0.5% across all races in ${stateId} · +${addedVoters.toLocaleString()} voters.`,
      };
    }

    return null;
  }

  // ==========================================================================
  // 12. DYNAMIC CORRUPT TRAIT LIFECYCLE (10% START / 5% NEW / 1% PER CYCLE)
  // ==========================================================================
  function applyCorruptTraitToRecord(rec, isCorrupt) {
    if (!rec || typeof rec !== 'object') return rec;
    const baseTraits = Array.isArray(rec.traits) ? rec.traits.filter((t) => t !== 'Corrupt') : [];
    if (!isCorrupt) return { ...rec, traits: baseTraits };
    const cleaned = baseTraits.filter((t) => t !== 'Squeaky Clean');
    return { ...rec, traits: [...cleaned, 'Corrupt'] };
  }

  function applyDynamicCorruptTraitsOnStart(game) {
    if (!game || typeof game !== 'object') return game;
    if (game._dynamicCorruptInitialized) return game;
    const seed = game.seed || 1;
    const corruptDecision = new Map();
    const decide = (key) => {
      if (!corruptDecision.has(key)) {
        corruptDecision.set(key, hashFloat(`${seed}:init_corrupt:${key}`) < 0.10);
      }
      return corruptDecision.get(key);
    };
    const nextSM = Array.isArray(game.sittingMembers)
      ? game.sittingMembers.map((m) => applyCorruptTraitToRecord(m, decide(m.name || m.id)))
      : game.sittingMembers;
    const nextPols = Array.isArray(game.politicians)
      ? game.politicians.map((p) => applyCorruptTraitToRecord(p, decide(p.name || p.id)))
      : game.politicians;
    return { ...game, _dynamicCorruptInitialized: true, sittingMembers: nextSM, politicians: nextPols };
  }

  function rollNewPoliticianCorruptTrait(pol, seed = 1, salt = '') {
    if (!pol || typeof pol !== 'object') return pol;
    const isCorrupt = hashFloat(`${seed}:new_corrupt:${pol.id || pol.name}:${salt}`) < 0.05;
    return applyCorruptTraitToRecord(pol, isCorrupt);
  }

  function advanceCycleCorruptTraitDrift(game) {
    if (!game || typeof game !== 'object') return game;
    const seed = game.seed || 1;
    const year = Number(game.year || 2028);
    const newlyCorrupt = new Set();
    const checkDrift = (rec) => {
      if (!rec || rec.retired) return rec;
      const traits = Array.isArray(rec.traits) ? rec.traits : [];
      if (traits.includes('Corrupt')) return rec;
      const key = rec.name || rec.id;
      if (newlyCorrupt.has(key) || hashFloat(`${seed}:drift_corrupt:${year}:${key}`) < 0.01) {
        newlyCorrupt.add(key);
        return applyCorruptTraitToRecord(rec, true);
      }
      return rec;
    };
    return {
      ...game,
      sittingMembers: Array.isArray(game.sittingMembers) ? game.sittingMembers.map(checkDrift) : game.sittingMembers,
      politicians: Array.isArray(game.politicians) ? game.politicians.map(checkDrift) : game.politicians,
    };
  }

  // REQ-301: Party-Specific Strategy Profile Lookup & Invariant Guard
  function getPartyStrategyProfile(partyId, game = null) {
    const dataProfiles = (typeof window !== 'undefined' && window.PartyChairData?.DEFAULT_STRATEGY_PROFILES)
      || (typeof global !== 'undefined' && global.PartyChairData?.DEFAULT_STRATEGY_PROFILES)
      || {};
    if (game?.parties?.[partyId]?.strategyProfile) {
      const prof = game.parties[partyId].strategyProfile;
      if (partyId === 'liberty') prof.primaryInterventionism = 0.00;
      return prof;
    }
    if (dataProfiles[partyId]) {
      const prof = { ...dataProfiles[partyId] };
      if (partyId === 'liberty') prof.primaryInterventionism = 0.00;
      return prof;
    }
    const genFunc = (typeof window !== 'undefined' && window.PartyChairData?.generateDynamicPartyStrategyProfile)
      || (typeof global !== 'undefined' && global.PartyChairData?.generateDynamicPartyStrategyProfile);
    if (typeof genFunc === 'function') {
      return genFunc({ id: partyId }, game);
    }
    return {
      ruthlessness: 0.50,
      primaryInterventionism: partyId === 'liberty' ? 0.00 : 0.50,
      factionRiskAversion: 0.50,
      geographicConcentration: 0.50,
      negativeAdPropensity: 0.50,
      ideologicalRigidity: 0.50,
      ballotPriority: 0.50,
    };
  }

  global.CampaignOverhaul = {
    MONTH_NAMES,
    MONTHLY_EFFICIENCIES,
    DEBATE_QUESTION_BANK,
    CAMPAIGN_CRISIS_CATALOG,
    getMonthEfficiency,
    getSaturationTier,
    addStateSaturation,
    decayStateSaturation,
    runRivalChairMonthlyTurn,
    selectCampaignTheme,
    buildDebateEvent,
    resolveDebate,
    rollMonthlyTraitCrises,
    resolveCampaignCrisis,
    commissionOppoResearch,
    releaseOppoDossier,
    getEligibleSurrogates,
    deploySurrogate,
    checkFactionTrailUltimatum,
    resolveTrailUltimatum,
    getTossUpWatchRaces,
    generateCorrelatedPollingError,
    resolveFinal72HoursBlitz,
    executeNewCampaignAction,
    isPlayerMajorParty,
    getCampaignStateLift,
    applyDynamicCorruptTraitsOnStart,
    initializeDynamicCorruptTrait: applyDynamicCorruptTraitsOnStart,
    rollNewPoliticianCorrupt: rollNewPoliticianCorruptTrait,
    rollNewPoliticianCorruptTrait,
    advanceCycleCorruptTraitDrift,
    recordFactionCampaignFunding(game, factionId, amountM) {
      if (!game || !factionId || !Number.isFinite(Number(amountM)) || Number(amountM) <= 0) return game;
      const prev = game.campaign?.factionFundingSpent || {};
      const nextSpent = { ...prev, [factionId]: round((prev[factionId] || 0) + Number(amountM), 2) };
      return {
        ...game,
        campaign: { ...(game.campaign || {}), factionFundingSpent: nextSpent },
      };
    },
    evaluateFactionResourceStarvation(game) {
      if (!game || !Array.isArray(game.factions)) return [];
      const playerPartyId = game.player?.custom ? 'player' : (game.player?.baseTemplateId || 'people');
      const spentMap = game.campaign?.factionFundingSpent || {};
      const funding = game.candidateFunding || {};
      const competitiveFactions = new Set();
      const fundedFactions = new Set(Object.keys(spentMap).filter((fid) => (spentMap[fid] || 0) > 0));
      Object.values(funding).forEach((rec) => {
        if (!rec || typeof rec !== 'object') return;
        const fid = rec.factionId || rec.faction;
        if (!fid) return;
        if (Number(rec.spent || rec.allocated || rec.amount || 0) > 0) fundedFactions.add(fid);
        const margin = Math.abs(Number(rec.margin ?? rec.projectedMargin ?? 5));
        if (margin <= 10 && (!rec.partyId || rec.partyId === playerPartyId)) {
          competitiveFactions.add(fid);
        }
      });
      // Also check sitting/nominated candidates in competitive states if candidateFunding didn't tag factionId
      const starved = [];
      game.factions.forEach((f) => {
        if (!f || f.partyId !== playerPartyId) return;
        if (competitiveFactions.has(f.id) && !fundedFactions.has(f.id)) {
          starved.push(f.id);
        }
      });
      return starved;
    },
    getPartyStrategyProfile,
    getCampaignMajorNetShift,
    getRivalCandidateFundingLift,
    computeRivalDebatePerformance,
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.CampaignOverhaul;
  }
})(typeof window !== 'undefined' ? window : globalThis);
