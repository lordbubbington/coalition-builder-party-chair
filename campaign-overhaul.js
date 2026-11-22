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
    // Rival state spending & counter-theme drag
    const rivalMap = c.rivalStateEffects?.[stateId] || {};
    const rivalDrag = Object.entries(rivalMap).reduce((s, [rid, val]) => (rid === pId ? s : s + Number(val || 0)), 0);
    lift -= rivalDrag * 0.55;
    lift -= Number(c.rivalThemeCounterBonus || 0) * 0.35;
    return round(clamp(lift, -10, 10), 2);
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
    const airwavesSpendByState = { ...(game?.campaign?.airwavesSpendByState || {}) };
    const fieldOfficesByState = { ...(game?.campaign?.fieldOfficesByState || {}) };
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
      const usedThemes = Array.isArray(pCampaign.usedThemes) ? [...pCampaign.usedThemes] : [];
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
      let themePickIdx = (month - 1) % themeCatalog.length;
      if (month === 4 && rId === 'heritage') themePickIdx = 0; // repeat for GOP test
      if (month === 5 && rId === 'people') themePickIdx = 0; // repeat for DNC test
      const chosenTheme = themeCatalog[themePickIdx] || 'cost-of-living';
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
          const shock = undetonated.severity === 'high' ? 5.0 : 3.5;
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
          actionsRemaining--;
          actionsTaken.push({ action: 'RESOLVE_CRISIS_DECISION', crisisId: crisis.id, choice: choiceId });
        }
      }

      // ----------------------------------------------------------------------
      // 4. CAMPAIGN AD BLITZES, FIELD OFFICES & FINAL BLITZ (REQ-303, REQ-304)
      // ----------------------------------------------------------------------
      const allocations = {};
      let totalSpent = 0;

      let targetStateIds = [];
      if (rId === 'heritage') {
        targetStateIds = KEY_BATTLEGROUNDS;
      } else if (rId === 'people') {
        targetStateIds = DNC_FIREWALLS;
      } else if (CANONICAL_PARTY_BASTIONS[rId]) {
        targetStateIds = CANONICAL_PARTY_BASTIONS[rId];
      } else {
        targetStateIds = ['PA', 'WI', 'MI', 'NV', 'NH'];
      }

      while (actionsRemaining > 0 && avail >= 0.5) {
        const campActIdx = actionsTaken.filter((a) => !['INVESTIGATE_OPPO', 'DETONATE_OPPO_DOSSIER', 'RESOLVE_CRISIS_DECISION'].includes(a.action)).length;
        const targetStateId = targetStateIds[campActIdx % targetStateIds.length];
        const stateObj = states.find((s) => s.id === targetStateId) || { id: targetStateId, ev: 10 };

        let actType = 'ad_blitz';
        if (rId === 'heritage') {
          if (month <= 2) {
            actType = (campActIdx < 3) ? 'issue_attack' : 'ad_blitz';
          } else if (month === 3) {
            actType = (campActIdx === 0) ? 'surrogate_drop' : (campActIdx === 1 ? 'rally_tour' : 'ad_blitz');
          } else if (month === 4) {
            actType = 'gotv_drive';
          } else {
            actType = !actionsTaken.some((a) => a.action === 'final_72h_blitz') ? 'final_72h_blitz' : 'gotv_drive';
          }
        } else if (rId === 'people') {
          if (month <= 3) {
            actType = 'ad_blitz';
          } else if (month === 4) {
            actType = 'gotv_drive';
          } else {
            actType = !actionsTaken.some((a) => a.action === 'final_72h_blitz') ? 'final_72h_blitz' : ((campActIdx === 1) ? 'issue_attack' : 'gotv_drive');
          }
        } else {
          actType = (campActIdx === 0) ? 'viral_telethon' : ((campActIdx === 1) ? 'rally_tour' : 'ad_blitz');
        }

        let spend = 0;
        if (actType === 'viral_telethon') {
          spend = 0;
          avail = round(avail + 2.5, 2);
        } else if (actType === 'final_72h_blitz') {
          spend = round(Math.min(avail, 6.0), 1);
        } else if (actType === 'gotv_drive') {
          spend = round(Math.min(avail, isMajor ? 3.5 : 1.0), 1);
        } else {
          spend = round(Math.min(avail, isMajor ? 4.0 : 1.2), 1);
        }

        avail = round(Math.max(0, avail - spend), 2);
        totalSpent = round(totalSpent + spend, 1);
        allocations[targetStateId] = round((allocations[targetStateId] || 0) + spend, 1);

        if (spend > 0) {
          airwavesSpendByState[targetStateId] = airwavesSpendByState[targetStateId] || {};
          airwavesSpendByState[targetStateId][rId] = round((airwavesSpendByState[targetStateId][rId] || 0) + spend, 1);
          partyAirwaves[targetStateId] = round((partyAirwaves[targetStateId] || 0) + spend, 1);
        }

        if (actType === 'issue_attack' || actType === 'ad_blitz') {
          saturation = addStateSaturation(saturation, targetStateId, spend, stateObj.ev, 0.85);
          const isPersuasion = true;
          const lift = round((spend * 0.14) * (isPersuasion ? eff.persuasion : eff.turnout) * 0.45, 2);
          rivalStateEffects[targetStateId] = rivalStateEffects[targetStateId] || {};
          rivalStateEffects[targetStateId][rId] = round((rivalStateEffects[targetStateId][rId] || 0) + lift, 2);
        } else if (actType === 'gotv_drive') {
          fieldOfficesByState[targetStateId] = fieldOfficesByState[targetStateId] || {};
          fieldOfficesByState[targetStateId][rId] = (fieldOfficesByState[targetStateId][rId] || 0) + 3;
          partyField[targetStateId] = (partyField[targetStateId] || 0) + 3;
          const lift = round((spend * 0.14) * eff.turnout * 0.5, 2);
          rivalStateEffects[targetStateId] = rivalStateEffects[targetStateId] || {};
          rivalStateEffects[targetStateId][rId] = round((rivalStateEffects[targetStateId][rId] || 0) + lift, 2);
        } else if (actType === 'final_72h_blitz') {
          const lift = 2.25;
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
      rivalTreasuries: nextRivalTreasuries,
      airwavesSpendByState,
      fieldOfficesByState,
    };
  }

  // ==========================================================================
  // 3. MONTHLY NARRATIVE FRAMING ("THEME OF THE MONTH")
  // ==========================================================================
  function selectCampaignTheme(game, issueId) {
    if (!game?.campaign || !issueId) return game;
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

    const scaledLift = round(baseLift * eff.persuasion * 0.35, 2);
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
    { id: 'dq_inflation', category: 'Economy', issueId: 'inflation', prompt: 'Grocery and housing costs remain top-of-mind for families. What concrete step will your party take in the first 100 days?' },
    { id: 'dq_taxes', category: 'Economy', issueId: 'tax-policy', prompt: 'Should high-income brackets and corporate profits face higher rates to fund deficit reduction?' },
    { id: 'dq_debt', category: 'Economy', issueId: 'national-debt', prompt: 'With federal debt servicing climbing, would your party cut spending, raise revenue, or protect entitlement programs?' },
    { id: 'dq_trade', category: 'Economy', issueId: 'trade-tariffs', prompt: 'Do broad tariffs protect American manufacturing workers, or do they act as a hidden sales tax on consumers?' },
    { id: 'dq_labor', category: 'Economy', issueId: 'labor-unions', prompt: 'Should federal law make union organizing faster across service and tech industries?' },
    { id: 'dq_minwage', category: 'Economy', issueId: 'minimum-wage', prompt: 'Where should the federal minimum wage floor sit—or should wage policy be left strictly to states?' },
    { id: 'dq_healthcare', category: 'Healthcare', issueId: 'healthcare-cost', prompt: 'Millions still face high deductibles and medical debt. Will your party expand public coverage or strengthen private market competition?' },
    { id: 'dq_pharma', category: 'Healthcare', issueId: 'drug-pricing', prompt: 'How far should Medicare go in negotiating prescription drug prices without chilling biomedical innovation?' },
    { id: 'dq_mentalhealth', category: 'Healthcare', issueId: 'mental-health', prompt: 'Communities face a mental health and addiction crisis. How will your party fund treatment capacity?' },
    { id: 'dq_nato', category: 'Foreign Policy', issueId: 'nato-global-security', prompt: 'Should the United States maintain ironclad NATO defense commitments even if European allies lag on defense spending?' },
    { id: 'dq_china', category: 'Foreign Policy', issueId: 'china-competition', prompt: 'How do you deter aggression in the Indo-Pacific without triggering a catastrophic trade or military clash?' },
    { id: 'dq_defense', category: 'Foreign Policy', issueId: 'defense-spending', prompt: 'Is the Pentagon budget bloated and overdue for audit cuts, or essential for global deterrence?' },
    { id: 'dq_ai', category: 'Technology', issueId: 'frontier-ai-oversight', prompt: 'Frontier AI systems are reshaping white-collar jobs and national security. Does your party back federal safety standards or light-touch deregulation?' },
    { id: 'dq_antitrust', category: 'Technology', issueId: 'tech-antitrust', prompt: 'Should the Justice Department break up dominant digital platforms and social-media monopolies?' },
    { id: 'dq_privacy', category: 'Technology', issueId: 'data-privacy', prompt: 'Will your party pass a binding national data-privacy bill curbing algorithmic tracking?' },
    { id: 'dq_climate', category: 'Energy & Climate', issueId: 'climate-change', prompt: 'How fast should the U.S. transition off fossil fuels while keeping electricity affordable and grids reliable?' },
    { id: 'dq_publiclands', category: 'Energy & Climate', issueId: 'federal-public-lands', prompt: 'Should federal public lands be opened for domestic oil, gas, and critical-mineral extraction, or permanently conserved?' },
    { id: 'dq_nuclear', category: 'Energy & Climate', issueId: 'nuclear-energy', prompt: 'Should the federal government fast-track next-generation nuclear power plants to meet surging grid demand?' },
    { id: 'dq_immigration', category: 'Immigration', issueId: 'immigration-border', prompt: 'How do you balance strict border enforcement with legal pathways for workers and long-term residents?' },
    { id: 'dq_asylum', category: 'Immigration', issueId: 'border-security', prompt: 'What reforms to the asylum court system will your party champion to clear multi-year backlogs?' },
    { id: 'dq_housing', category: 'Housing', issueId: 'housing-yimby', prompt: 'Homeownership feels out of reach for young voters. Should federal funds incentivize cities to abolish restrictive zoning?' },
    { id: 'dq_transit', category: 'Infrastructure', issueId: 'infrastructure-rural', prompt: 'Should federal infrastructure dollars prioritize high-speed rail and metro transit or highways and rural bridges?' },
    { id: 'dq_courts', category: 'Governance', issueId: 'judicial-reform', prompt: 'Public trust in the federal judiciary is polarized. Do you support term limits, ethics codes, or keeping the current structure intact?' },
    { id: 'dq_voting', category: 'Governance', issueId: 'voting-democracy', prompt: 'Should Congress set uniform national standards for mail-in voting and voter ID, or defer to state legislatures?' },
    { id: 'dq_money', category: 'Governance', issueId: 'campaign-finance', prompt: 'How would your party curb dark-money Super PACs and restore accountability to campaign finance?' },
    { id: 'dq_education', category: 'Education', issueId: 'education-schools', prompt: 'Should federal dollars expand universal pre-K and public-school pay, or fund school-choice vouchers?' },
    { id: 'dq_studentdebt', category: 'Education', issueId: 'higher-ed', prompt: 'How should Washington tackle soaring college tuition—loan forgiveness, vocational grants, or university accountability?' },
    { id: 'dq_crime', category: 'Justice', issueId: 'policing-crime', prompt: 'How will your party bring down violent crime while maintaining civil-rights accountability in policing?' },
    { id: 'dq_guns', category: 'Rights', issueId: 'gun-policy', prompt: 'Where does your party draw the line between Second Amendment protections and federal gun-safety rules?' },
    { id: 'dq_abortion', category: 'Rights', issueId: 'reproductive-rights', prompt: 'Should reproductive healthcare access be codified nationwide by Congress or decided state-by-state?' },
    { id: 'dq_socialsec', category: 'Entitlements', issueId: 'cost-of-living', prompt: 'Social Security trust funds face long-term shortfalls. Will your party lift the payroll tax cap or raise the retirement age?' },
    { id: 'dq_agriculture', category: 'Rural', issueId: 'agriculture', prompt: 'Family farms are squeezed by consolidation and weather volatility. What is your plan for rural America?' },
    { id: 'dq_childcare', category: 'Families', issueId: 'childcare', prompt: 'Working parents pay more for childcare than rent. Do you back an expanded Child Tax Credit or direct childcare subsidies?' },
    { id: 'dq_crypto', category: 'Finance', issueId: 'financial-regulation', prompt: 'How tightly should federal regulators police Wall Street leverage and digital asset markets?' },
    { id: 'dq_veterans', category: 'Veterans', issueId: 'veterans-affairs', prompt: 'How will you modernize VA healthcare and expand community-care options for veterans?' },
    { id: 'dq_closing', category: 'Closing', issueId: 'unity-vision', prompt: 'In 60 seconds: why should an undecided Independent voter trust your coalition with the next four years?' },
  ];

  function buildDebateEvent(game, month) {
    const year = Number(game?.year || 2028);
    const isPres = year % 4 === 0;
    const isDebateMonth = isPres ? (month === 2 || month === 4) : (month === 3);
    if (!isDebateMonth) return null;

    const asked = new Set(game?.debateQuestionsAsked || []);
    let pool = DEBATE_QUESTION_BANK.filter((q) => !asked.has(q.id));
    if (pool.length < 3) pool = [...DEBATE_QUESTION_BANK];

    const seed = game?.seed || 1;
    const picked = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(hashFloat(`${seed}:${year}:deb:m${month}:q${i}`) * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }

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
    if (isGaffe) { persuasionShift -= 1.6; trustDelta -= 2; }
    if (debate.qualifiesThirdPartyBreakout) persuasionShift += 3.0;

    persuasionShift = round(persuasionShift, 2);
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
    const target = dossiers.find((d) => d.id === dossierId && !d.detonated);
    if (!target) return game;

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
    const list = [];
    states.forEach((st) => {
      let rawMargin = Number(st.leanPercent ?? (Number(st.lean || 0) * -100));
      if (eng && typeof eng.presidentialStateMargin === 'function') {
        try { rawMargin = Number(eng.presidentialStateMargin(game, st.id)); } catch (_) {}
      }
      const m = round(Math.abs(rawMargin), 1);
      if (m <= 4.5) {
        list.push({ stateId: st.id, stateName: st.name, office: (game?.year || 2028) % 4 === 0 ? 'Presidential' : 'Statewide', ev: st.ev || 5, margin: m });
      }
    });
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
    const stops = Array.from(new Set((Array.isArray(stateIds) ? stateIds : []).filter(Boolean))).slice(0, 3);
    if (!stops.length) return { ...game, lastNote: 'Select at least 1 target state for the Final 72 Hours Blitz.' };
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
      const persLift = round(1.1 * eff.persuasion * satTier.effMult * 0.4, 2);
      const memBoost = 4;
      let nextSat = { ...(c.stateSaturation || {}) };
      const nextStateEffects = { ...(c.actionStateEffects || {}) };
      const nextSpend = { ...(c.playerStateSpendLastMonth || {}) };
      affectedIds.forEach((sid) => {
        const mult = sid === stateId ? 1.0 : 0.45;
        nextSat = addStateSaturation(nextSat, sid, round(cost / affectedIds.length, 2), 10, 0.5);
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
    getPartyStrategyProfile,
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.CampaignOverhaul;
  }
})(typeof window !== 'undefined' ? window : globalThis);
