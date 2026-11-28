/**
 * Coalition Builder: Party Chair — v0.18.4 Standalone Module
 * Proposal #2: State-Level Redistricting & Gerrymandering War Room
 * Proposal #7: Ballot Initiatives & Down-Ballot Coattail Engineering
 *
 * Merge-safe standalone module exposing window.RedistrictingBallotSystem
 * (and module.exports for Node test suites).
 * Strictly deterministic seeded hashing only.
 */
(function (root) {
  'use strict';

  // =========================================================================
  // 1. DETERMINISTIC SEEDED HASHING & UTILITIES
  // =========================================================================

  function seededUnit(seedStr) {
    const str = String(seedStr || 'rb-default');
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995) >>> 0;
    h ^= h >>> 15;
    return (h >>> 0) / 4294967296;
  }

  function clamp(val, min, max) {
    const n = Number(val);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function round1(val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 10) / 10;
  }

  function round2(val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100) / 100;
  }

  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getStatesCatalog(game) {
    if (Array.isArray(game?.states) && game.states.length > 0) return game.states;
    if (typeof window !== 'undefined' && Array.isArray(window.PartyChairData?.VERSION_01_STATES)) {
      return window.PartyChairData.VERSION_01_STATES;
    }
    if (typeof global !== 'undefined' && Array.isArray(global.PartyChairData?.VERSION_01_STATES)) {
      return global.PartyChairData.VERSION_01_STATES;
    }
    return [];
  }

  function getPlayerIdentity(game) {
    if (!game?.player) return 'people';
    if (game.player.custom) return 'player';
    return game.player.baseTemplateId || game.player.id || 'people';
  }

  function normalizePartyId(partyId, game) {
    if (!partyId) return null;
    const pId = getPlayerIdentity(game);
    if (partyId === 'player' && !game?.player?.custom) return pId;
    if (partyId === pId && game?.player?.custom) return 'player';
    return partyId;
  }

  function partySign(partyId, game) {
    const norm = normalizePartyId(partyId, game);
    if (norm === 'heritage' || norm === 'constitution') return -1;
    if (norm === 'people' || norm === 'green' || norm === 'socialist') return 1;
    if (norm === 'player') {
      const base = game?.player?.baseTemplateId || 'people';
      return base === 'heritage' ? -1 : 1;
    }
    return 1;
  }

  function partyDisplayName(partyId, game) {
    const norm = normalizePartyId(partyId, game);
    if (norm === 'people') return 'Democrats';
    if (norm === 'heritage') return 'Republicans';
    if (norm === 'liberty') return 'Libertarians';
    if (norm === 'green') return 'Greens';
    if (norm === 'constitution') return 'Constitution';
    if (norm === 'socialist') return 'Socialists';
    if (norm === 'player') return game?.player?.name || 'Player Party';
    return String(partyId || 'Independent');
  }

  // =========================================================================
  // 2. STATIC CATALOGS & CONSTANTS
  // =========================================================================

  const DEFAULT_COMMISSION_STATES = ['CA', 'CO', 'MI', 'AZ', 'WA', 'ID', 'MT', 'NY', 'VA'];

  // 26 real-world initiative/referendum states
  const INITIATIVE_ELIGIBLE_STATES = [
    'AK', 'AR', 'AZ', 'CA', 'CO', 'FL', 'ID', 'IL', 'MA', 'MD',
    'ME', 'MI', 'MO', 'MS', 'MT', 'ND', 'NE', 'NM', 'NV', 'OH',
    'OK', 'OR', 'SD', 'UT', 'WA', 'WY',
  ];

  const REDISTRICTING_STRATEGIES = {
    fair_compact: {
      id: 'fair_compact',
      name: 'Fair & Compact',
      cost: 0,
      actionCost: 0,
      indTrustDelta: 2,
      sittingHappinessDelta: 0,
      courtStrikeRisk: 0,
      oppTurnoutBonus: 0,
      description: 'Neutral, compact districts. +2 Independents Trust, 0% court strike-down risk.',
    },
    incumbent_protection: {
      id: 'incumbent_protection',
      name: 'Incumbent Protection',
      cost: 1,
      actionCost: 0,
      indTrustDelta: -1,
      sittingHappinessDelta: 4,
      courtStrikeRisk: 0,
      oppTurnoutBonus: 0,
      description: 'Minimizes competitive seats. +4 Sitting Member Happiness in state, -1 Independents Trust.',
    },
    aggressive_gerrymander: {
      id: 'aggressive_gerrymander',
      name: 'Aggressive Gerrymander',
      cost: 3,
      actionCost: 0,
      indTrustDelta: -3,
      sittingHappinessDelta: 0,
      courtStrikeRisk: 0.35,
      oppTurnoutBonus: 10,
      description: 'Packs opposition into 1–2 sink districts & cracks remaining seats (+3 to +5 lean shift). 35% court strike-down risk at year+2, -3 Independents Trust, +10 opposition grassroots turnout for 1 cycle.',
    },
    special_master: {
      id: 'special_master',
      name: 'Court-Ordered Special Master',
      cost: 4,
      actionCost: 1,
      indTrustDelta: 2,
      sittingHappinessDelta: 0,
      courtStrikeRisk: 0,
      oppTurnoutBonus: 0,
      splitOnly: true,
      description: 'Spend $4M + 1 Action in a split-control state to petition a court-appointed Special Master for a neutral fair_compact map.',
    },
  };

  // 12 Reusable Ballot Initiative Archetypes (8 Turnout Drivers + 4 Structural Reforms)
  const BALLOT_INITIATIVE_ARCHETYPES = [
    // --- Turnout Drivers ---
    {
      id: 'min_wage_hike',
      name: 'Minimum Wage Hike',
      category: 'turnout_driver',
      alignedParties: ['people', 'green', 'socialist'],
      targetRival: 'heritage',
      turnoutBoost: 5.5,
      baseSupport: 57,
      leanSensitivity: 0.45,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Raises state minimum wage & indexes to inflation. +5.5% aligned turnout; wedges conservative nominees.',
    },
    {
      id: 'reproductive_rights',
      name: 'Reproductive Rights Amendment',
      category: 'turnout_driver',
      alignedParties: ['people', 'green', 'liberty'],
      targetRival: 'heritage',
      turnoutBoost: 7.0,
      baseSupport: 58,
      leanSensitivity: 0.55,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Codifies reproductive healthcare protections in state constitution. +7.0% aligned turnout; major wedge on rival nominees.',
    },
    {
      id: 'constitutional_carry',
      name: 'Constitutional Carry',
      category: 'turnout_driver',
      alignedParties: ['heritage', 'liberty', 'constitution'],
      targetRival: 'people',
      turnoutBoost: 5.5,
      baseSupport: 48,
      leanSensitivity: -0.60,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Establishes permitless carry protections statewide. +5.5% aligned turnout; wedges liberal nominees.',
    },
    {
      id: 'property_tax_cap',
      name: 'Property Tax Cap',
      category: 'turnout_driver',
      alignedParties: ['heritage', 'liberty', 'constitution'],
      targetRival: 'people',
      turnoutBoost: 5.0,
      baseSupport: 54,
      leanSensitivity: -0.45,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Caps annual residential property tax assessments. +5.0% aligned turnout; squeezes rival suburban nominees.',
    },
    {
      id: 'marijuana_cj_reform',
      name: 'Criminal Justice & Marijuana Reform',
      category: 'turnout_driver',
      alignedParties: ['people', 'liberty', 'green', 'socialist'],
      targetRival: 'heritage',
      turnoutBoost: 6.0,
      baseSupport: 56,
      leanSensitivity: 0.40,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Legalizes adult-use cannabis & expunges nonviolent records. +6.0% aligned turnout; splits rival coalition.',
    },
    {
      id: 'border_everify',
      name: 'Border & E-Verify Mandate',
      category: 'turnout_driver',
      alignedParties: ['heritage', 'constitution'],
      targetRival: 'people',
      turnoutBoost: 6.5,
      baseSupport: 52,
      leanSensitivity: -0.55,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Mandates statewide E-Verify & local immigration enforcement cooperation. +6.5% aligned turnout; forces rival wedge.',
    },
    {
      id: 'school_choice_vouchers',
      name: 'Universal School Choice Vouchers',
      category: 'turnout_driver',
      alignedParties: ['heritage', 'liberty', 'constitution'],
      targetRival: 'people',
      turnoutBoost: 4.5,
      baseSupport: 49,
      leanSensitivity: -0.50,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Creates universal education savings accounts for families. +4.5% aligned turnout; wedges rival suburban moderates.',
    },
    {
      id: 'clean_energy_mandate',
      name: 'Clean Energy & Grid Mandate',
      category: 'turnout_driver',
      alignedParties: ['people', 'green', 'socialist'],
      targetRival: 'heritage',
      turnoutBoost: 4.5,
      baseSupport: 51,
      leanSensitivity: 0.50,
      wedgeEnthusiasmPenalty: -4,
      wedgeIndTrustPenalty: -3,
      description: 'Sets binding clean-grid targets and utility rebates. +4.5% aligned turnout; energizes youth & environmental base.',
    },
    // --- Structural Reforms ---
    {
      id: 'ranked_choice_voting',
      name: 'Ranked Choice Voting',
      category: 'structural_reform',
      reformKey: 'rcv',
      alignedParties: ['liberty', 'green', 'people', 'socialist'],
      targetRival: null,
      turnoutBoost: 4.0,
      baseSupport: 50,
      leanSensitivity: 0.30,
      wedgeEnthusiasmPenalty: 0,
      wedgeIndTrustPenalty: 0,
      description: 'If passed (>50%), permanently adopts Ranked Choice Voting in stateElectoralSystems across all future cycles.',
    },
    {
      id: 'nonpartisan_top4',
      name: 'Nonpartisan Top-4 Primary',
      category: 'structural_reform',
      reformKey: 'top4',
      alignedParties: ['liberty', 'green', 'people', 'heritage'],
      targetRival: null,
      turnoutBoost: 4.0,
      baseSupport: 51,
      leanSensitivity: 0.20,
      wedgeEnthusiasmPenalty: 0,
      wedgeIndTrustPenalty: 0,
      description: 'If passed (>50%), permanently switches state to Nonpartisan Top-4 Primary + RCV general in stateElectoralSystems.',
    },
    {
      id: 'independent_redistricting',
      name: 'Independent Redistricting Commission',
      category: 'structural_reform',
      reformKey: 'irc',
      alignedParties: ['people', 'liberty', 'green', 'socialist', 'heritage'],
      targetRival: null,
      turnoutBoost: 4.0,
      baseSupport: 55,
      leanSensitivity: 0.15,
      wedgeEnthusiasmPenalty: 0,
      wedgeIndTrustPenalty: 0,
      description: 'If passed (>50%), permanently establishes an Independent Redistricting Commission (forces fair_compact maps on decennial years).',
    },
    {
      id: 'auto_voter_registration',
      name: 'Automatic Voter Registration',
      category: 'structural_reform',
      reformKey: 'avr',
      alignedParties: ['people', 'green', 'socialist'],
      targetRival: 'heritage',
      turnoutBoost: 4.5,
      baseSupport: 53,
      leanSensitivity: 0.35,
      wedgeEnthusiasmPenalty: -2,
      wedgeIndTrustPenalty: -2,
      description: 'If passed (>50%), permanently enables Automatic Voter Registration in stateElectoralSystems with lasting turnout lift.',
    },
  ];

  // =========================================================================
  // 3. STATE NORMALIZATION & BACKWARD COMPATIBILITY
  // =========================================================================

  function buildDefaultRedistrictingCommissions(existing) {
    const out = {};
    DEFAULT_COMMISSION_STATES.forEach((st) => { out[st] = true; });
    if (existing && typeof existing === 'object') {
      Object.entries(existing).forEach(([st, val]) => {
        if (val) out[st] = true;
      });
    }
    return out;
  }

  function normalizeRedistrictingBallotState(game) {
    if (!game || typeof game !== 'object') return game;
    const commissions = buildDefaultRedistrictingCommissions(game.redistrictingCommissions);
    const warRoom = (game.redistrictingWarRoom && typeof game.redistrictingWarRoom === 'object')
      ? {
          active: Boolean(game.redistrictingWarRoom.active),
          year: Number(game.redistrictingWarRoom.year || 0),
          controlledStates: Array.isArray(game.redistrictingWarRoom.controlledStates)
            ? game.redistrictingWarRoom.controlledStates
            : [],
          selections: (game.redistrictingWarRoom.selections && typeof game.redistrictingWarRoom.selections === 'object')
            ? { ...game.redistrictingWarRoom.selections }
            : {},
          pendingChallenges: Array.isArray(game.redistrictingWarRoom.pendingChallenges)
            ? game.redistrictingWarRoom.pendingChallenges
            : [],
          baselineLeans: (game.redistrictingWarRoom.baselineLeans && typeof game.redistrictingWarRoom.baselineLeans === 'object')
            ? { ...game.redistrictingWarRoom.baselineLeans }
            : {},
          committedYear: game.redistrictingWarRoom.committedYear || null,
        }
      : {
          active: false,
          year: 0,
          controlledStates: [],
          selections: {},
          pendingChallenges: [],
          baselineLeans: {},
          committedYear: null,
        };

    return {
      ...game,
      redistrictingWarRoom: warRoom,
      activeBallotInitiatives: Array.isArray(game.activeBallotInitiatives) ? game.activeBallotInitiatives : [],
      passedStateInitiatives: (game.passedStateInitiatives && typeof game.passedStateInitiatives === 'object')
        ? { ...game.passedStateInitiatives }
        : {},
      redistrictingCommissions: commissions,
      redistrictingBacklash: (game.redistrictingBacklash && typeof game.redistrictingBacklash === 'object')
        ? { ...game.redistrictingBacklash }
        : {},
      lastBallotInitiativeResults: Array.isArray(game.lastBallotInitiativeResults)
        ? game.lastBallotInitiativeResults
        : [],
    };
  }

  // =========================================================================
  // 4. PROPOSAL #2: STATE-LEVEL REDISTRICTING & GERRYMANDERING WAR ROOM
  // =========================================================================

  function isIndependentCommissionState(game, stateId) {
    if (game?.federalReforms?.mandatoryNonpartisanRedistricting) return true;
    if (DEFAULT_COMMISSION_STATES.includes(stateId)) return true;
    return Boolean(game?.redistrictingCommissions?.[stateId]);
  }

  function getStateGovernmentControl(game, stateId) {
    const rawGov = game?.governorships?.[stateId] || null;
    const gov = normalizePartyId(rawGov, game);
    const rawLeg = game?.stateLegislatures?.[stateId];
    let lower = null;
    let upper = null;
    if (Array.isArray(rawLeg)) {
      lower = normalizePartyId(rawLeg[0], game);
      upper = normalizePartyId(rawLeg[1] || rawLeg[0], game);
    } else if (rawLeg && typeof rawLeg === 'object') {
      lower = normalizePartyId(rawLeg.lower || rawLeg.house, game);
      upper = normalizePartyId(rawLeg.upper || rawLeg.senate, game);
    } else if (typeof rawLeg === 'string') {
      lower = normalizePartyId(rawLeg, game);
      upper = lower;
    }

    const validParty = (p) => p && p !== 'split' && p !== 'coalition' && p !== 'independent' && p !== 'none';
    const isTrifecta = Boolean(validParty(gov) && gov === lower && gov === upper);
    return {
      stateId,
      governor: gov,
      lower,
      upper,
      isTrifecta,
      controllingParty: isTrifecta ? gov : null,
    };
  }

  function getMapDistricts(game) {
    const mapKey = game?.activeHouseMapKey;
    const mapObj = (mapKey && game?.[mapKey]) || game?.currentHouseMap || null;
    if (mapObj && Array.isArray(mapObj.modelDistricts) && mapObj.modelDistricts.length > 0) {
      return mapObj.modelDistricts;
    }
    if (Array.isArray(mapObj) && mapObj.length > 0) return mapObj;
    if (typeof window !== 'undefined' && Array.isArray(window.PartyChairData?.VERSION_01_HOUSE_DISTRICTS)) {
      return window.PartyChairData.VERSION_01_HOUSE_DISTRICTS;
    }
    if (typeof global !== 'undefined' && Array.isArray(global.PartyChairData?.VERSION_01_HOUSE_DISTRICTS)) {
      return global.PartyChairData.VERSION_01_HOUSE_DISTRICTS;
    }
    return [];
  }

  function computeStateStrategyProjection(stateDistricts, strategy, controllingParty, game) {
    const sign = partySign(controllingParty || getPlayerIdentity(game), game);
    // In engine.js, district.lean > 0 favors 'people' (Dem), < 0 favors 'heritage' (GOP)
    const baseDistricts = stateDistricts.map((d) => ({
      id: d.id,
      stateId: d.stateId,
      district: d.district,
      lean: Number(d.baselineLean ?? d.lean ?? 0),
    }));

    const baseSeatsForParty = baseDistricts.filter((d) => (d.lean * sign) > 0).length;

    if (strategy === 'fair_compact' || strategy === 'special_master') {
      return {
        districts: baseDistricts.map((d) => ({ ...d, newLean: round2(d.lean) })),
        baseSeats: baseSeatsForParty,
        projectedSeats: baseSeatsForParty,
        seatDelta: 0,
        dummymanderWarning: false,
        vulnerableDistricts: [],
      };
    }

    if (strategy === 'incumbent_protection') {
      // Push competitive seats away from 0 toward their current lean side (minimizes competitive seats)
      const adjusted = baseDistricts.map((d) => {
        let nl = d.lean;
        if (Math.abs(nl) < 8) {
          const dir = nl >= 0 ? 1 : -1;
          nl = clamp(nl + dir * 2.5, -48, 48);
        }
        return { ...d, newLean: round2(nl) };
      });
      const projSeats = adjusted.filter((d) => (d.newLean * sign) > 0).length;
      return {
        districts: adjusted,
        baseSeats: baseSeatsForParty,
        projectedSeats: projSeats,
        seatDelta: projSeats - baseSeatsForParty,
        dummymanderWarning: false,
        vulnerableDistricts: [],
      };
    }

    // aggressive_gerrymander:
    // Pack opposition into 1-2 sink districts (most opposition-leaning districts),
    // and crack remaining districts (+3 to +5 lean shift toward controlling party).
    const sorted = [...baseDistricts].sort((a, b) => (a.lean * sign) - (b.lean * sign));
    const sinkCount = sorted.length >= 6 ? 2 : 1;
    const sinkIds = new Set(sorted.slice(0, sinkCount).map((d) => d.id));

    let totalCrackShift = 0;
    const adjusted = baseDistricts.map((d, idx) => {
      if (sinkIds.has(d.id)) {
        return { ...d, _isSink: true, newLean: d.lean };
      }
      // Deterministic shift in [+3.0, +5.0] toward controlling party
      const u = seededUnit(`gerrymander:${game?.seed || 2028}:${game?.year || 2030}:${d.id}:${idx}`);
      const shiftMag = round2(3.0 + u * 2.0); // 3.0 to 5.0
      totalCrackShift += shiftMag;
      const newLean = clamp(d.lean + sign * shiftMag, -48, 48);
      return { ...d, _isSink: false, newLean: round2(newLean) };
    });

    // Pack opposition voters into the sink district(s) to conserve statewide partisan mean
    const packPerSink = sinkCount > 0 ? Math.min(18, totalCrackShift / sinkCount) : 0;
    const finalized = adjusted.map((d) => {
      if (!d._isSink) return { id: d.id, stateId: d.stateId, district: d.district, lean: d.lean, newLean: d.newLean };
      const packedLean = clamp(d.lean - sign * packPerSink, -48, 48);
      return { id: d.id, stateId: d.stateId, district: d.district, lean: d.lean, newLean: round2(packedLean) };
    });

    const projSeats = finalized.filter((d) => (d.newLean * sign) > 0).length;
    const vulnerableDistricts = finalized
      .filter((d) => {
        const partyLean = d.newLean * sign;
        return partyLean > 0 && partyLean < 4.5;
      })
      .map((d) => d.id);

    return {
      districts: finalized,
      baseSeats: baseSeatsForParty,
      projectedSeats: projSeats,
      seatDelta: projSeats - baseSeatsForParty,
      dummymanderWarning: vulnerableDistricts.length > 0,
      vulnerableDistricts,
    };
  }

  function selectRivalRedistrictingStrategy(game, partyId, stateId, stateDistricts) {
    const partyObj = game?.parties?.[partyId] || {};
    const treasury = Number(partyObj.treasury ?? 15);
    const reps = game?.representatives || [];
    const partySeats = reps.filter((r) => normalizePartyId(r.partyId, game) === partyId).length;
    const persona = String(partyObj.persona || partyObj.strategyProfile?.archetype || '').toLowerCase();

    // Third parties or reform personas prefer fair_compact
    if (!['people', 'heritage'].includes(partyId) || persona.includes('reform') || persona.includes('institutional')) {
      return 'fair_compact';
    }
    // Behind in the House (< 218 seats) or aggressive persona -> aggressive_gerrymander if affordable
    const projAgg = computeStateStrategyProjection(stateDistricts, 'aggressive_gerrymander', partyId, game);
    if ((partySeats < 218 || persona.includes('aggressive') || persona.includes('populist')) && treasury >= 3 && projAgg.seatDelta > 0) {
      return 'aggressive_gerrymander';
    }
    // Otherwise protect incumbents if affordable
    if (treasury >= 1) {
      return 'incumbent_protection';
    }
    return 'fair_compact';
  }

  function isTopTwoPartyInAnyHouse(game, stateId, partyId) {
    if (!game || !stateId || !partyId) return false;
    const META_KEYS = new Set(['total', 'vacant', 'unallocated', 'otherTotal', 'chamber', 'sourceStatus']);
    const checkChamberCounts = (countsObj) => {
      if (!countsObj || typeof countsObj !== 'object') return null;
      const entries = Object.entries(countsObj)
        .filter(([k, v]) => !META_KEYS.has(k) && Number(v) > 0)
        .map(([k, v]) => [k, Number(v)])
        .sort((a, b) => b[1] - a[1]);
      if (entries.length === 0) return null;
      const secondSeats = entries[1]?.[1] ?? 0;
      const mySeats = Number(countsObj[partyId] || 0);
      return mySeats > 0 && (entries[0][0] === partyId || entries[1]?.[0] === partyId || (entries.length >= 2 && mySeats >= secondSeats));
    };

    const houseRes = checkChamberCounts(game.stateHouseSeatCounts?.[stateId]);
    const senateRes = checkChamberCounts(game.stateSenateSeatCounts?.[stateId]);
    if (houseRes === true || senateRes === true) return true;
    if (houseRes !== null || senateRes !== null) return false;

    // Fallback to state's U.S. House delegation if state legislative counts are absent
    const reps = (game.representatives || []).filter((d) => d && d.stateId === stateId);
    if (reps.length > 0) {
      const repCounts = {};
      reps.forEach((d) => {
        const p = d.party || d.partyId;
        if (p) repCounts[p] = (repCounts[p] || 0) + 1;
      });
      return Boolean(checkChamberCounts(repCounts));
    }
    return false;
  }

  /**
   * Called right after runDecennialRedistricting on decennial years (year % 10 === 0).
   * Evaluates all states with >= 2 seats, runs rival AI selections, and opens the War Room modal.
   */
  function initializeDecennialWarRoom(game, decennialYear) {
    const year = Number(decennialYear || game?.year || 2030);
    if (!Number.isFinite(year) || year % 10 !== 0) return game;

    let nextGame = normalizeRedistrictingBallotState(game);
    const allDistricts = getMapDistricts(nextGame);
    const districtsByState = {};
    allDistricts.forEach((d) => {
      if (!districtsByState[d.stateId]) districtsByState[d.stateId] = [];
      districtsByState[d.stateId].push(d);
    });

    const playerId = getPlayerIdentity(nextGame);
    const statesCat = getStatesCatalog(nextGame);
    const stateNameById = Object.fromEntries(statesCat.map((s) => [s.id, s.name || s.id]));

    const controlledStates = [];
    const selections = {};
    const baselineLeans = {};

    allDistricts.forEach((d) => {
      baselineLeans[d.id] = Number(d.baselineLean ?? d.lean ?? 0);
    });

    Object.keys(districtsByState).sort().forEach((stateId) => {
      const stDistricts = districtsByState[stateId];
      if (stDistricts.length < 2) return; // Only states with >= 2 House seats

      const isCommission = isIndependentCommissionState(nextGame, stateId);
      const govCtrl = getStateGovernmentControl(nextGame, stateId);
      let controlType = 'split';
      let controllingParty = null;
      let defaultStrategy = 'incumbent_protection';

      if (isCommission) {
        controlType = 'commission';
        defaultStrategy = 'fair_compact';
      } else if (govCtrl.isTrifecta) {
        controlType = govCtrl.controllingParty === playerId ? 'player_trifecta' : 'rival_trifecta';
        controllingParty = govCtrl.controllingParty;
        if (controlType === 'player_trifecta') {
          defaultStrategy = 'fair_compact';
        } else {
          defaultStrategy = selectRivalRedistrictingStrategy(nextGame, controllingParty, stateId, stDistricts);
        }
      } else {
        controlType = isTopTwoPartyInAnyHouse(nextGame, stateId, playerId) ? 'split' : 'rival_split';
        defaultStrategy = 'incumbent_protection';
      }

      selections[stateId] = defaultStrategy;
      const proj = computeStateStrategyProjection(stDistricts, defaultStrategy, controllingParty || playerId, nextGame);

      controlledStates.push({
        stateId,
        stateName: stateNameById[stateId] || stateId,
        seatCount: stDistricts.length,
        controlType,
        controllingParty,
        isCommission,
        selectedStrategy: defaultStrategy,
        baseSeats: proj.baseSeats,
        projectedSeats: proj.projectedSeats,
        seatDelta: proj.seatDelta,
        courtRisk: REDISTRICTING_STRATEGIES[defaultStrategy]?.courtStrikeRisk || 0,
        dummymanderWarning: proj.dummymanderWarning,
        vulnerableDistricts: proj.vulnerableDistricts,
      });
    });

    const hasInteractiveStates = controlledStates.some(
      (s) => s.controlType === 'player_trifecta' || s.controlType === 'split'
    );

    nextGame = {
      ...nextGame,
      redistrictingWarRoom: {
        ...nextGame.redistrictingWarRoom,
        active: hasInteractiveStates,
        year,
        controlledStates,
        selections,
        baselineLeans,
        pendingChallenges: Array.isArray(nextGame.redistrictingWarRoom?.pendingChallenges)
          ? nextGame.redistrictingWarRoom.pendingChallenges
          : [],
      },
    };

    return nextGame;
  }

  /**
   * Updates the player's selected strategy for a state inside the active War Room modal.
   */
  function selectRedistrictingStrategy(game, payload) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const wr = nextGame.redistrictingWarRoom;
    if (!wr || !wr.active) return nextGame;

    const stateId = payload?.stateId;
    const strategy = payload?.strategy;
    if (!stateId || !REDISTRICTING_STRATEGIES[strategy]) return nextGame;

    const entry = wr.controlledStates.find((s) => s.stateId === stateId);
    if (!entry) return nextGame;

    // Only player_trifecta and eligible split states can be edited by player
    if (entry.controlType !== 'player_trifecta' && entry.controlType !== 'split') {
      return nextGame;
    }
    // Split-control states only allow incumbent_protection or special_master
    if (entry.controlType === 'split' && !['incumbent_protection', 'special_master'].includes(strategy)) {
      return nextGame;
    }
    // Trifecta states allow fair_compact, incumbent_protection, aggressive_gerrymander
    if (entry.controlType === 'player_trifecta' && strategy === 'special_master') {
      return nextGame;
    }

    const allDistricts = getMapDistricts(nextGame).filter((d) => d.stateId === stateId);
    const proj = computeStateStrategyProjection(allDistricts, strategy, entry.controllingParty || getPlayerIdentity(nextGame), nextGame);

    const nextControlled = wr.controlledStates.map((s) => {
      if (s.stateId !== stateId) return s;
      return {
        ...s,
        selectedStrategy: strategy,
        projectedSeats: proj.projectedSeats,
        seatDelta: proj.seatDelta,
        courtRisk: REDISTRICTING_STRATEGIES[strategy].courtStrikeRisk,
        dummymanderWarning: proj.dummymanderWarning,
        vulnerableDistricts: proj.vulnerableDistricts,
      };
    });

    return {
      ...nextGame,
      redistrictingWarRoom: {
        ...wr,
        controlledStates: nextControlled,
        selections: { ...wr.selections, [stateId]: strategy },
      },
    };
  }

  /**
   * Ensures exact 435-seat House parity between currentHouseMap, representatives, and sittingMembers.
   */
  function enforceHouse435Parity(game, year) {
    const mapKey = game.activeHouseMapKey;
    const mapObj = (mapKey && game[mapKey]) || game.currentHouseMap;
    const modelDists = mapObj?.modelDistricts || [];
    if (modelDists.length !== 435) return game;

    const validIds = new Set(modelDists.map((d) => d.id));
    const distById = Object.fromEntries(modelDists.map((d) => [d.id, d]));

    // 1. Align representatives (exactly 435)
    const existingRepsById = new Map();
    (game.representatives || []).forEach((r) => {
      if (r && validIds.has(r.districtId) && !existingRepsById.has(r.districtId)) {
        existingRepsById.set(r.districtId, r);
      }
    });

    const nextReps = modelDists.map((d) => {
      const existing = existingRepsById.get(d.id);
      if (existing) return existing;
      const winnerParty = (Number(d.lean || 0) >= 0) ? 'people' : 'heritage';
      return {
        districtId: d.id,
        stateId: d.stateId,
        partyId: winnerParty,
        representativeId: `legislator-${year}-${d.id}`,
        name: `Rep. ${d.stateId}-${d.district}`,
        faction: winnerParty === 'people' ? 'dem_establishment' : 'gop_establishment',
        age: 44,
        firstChoice: 52.0,
        finalShare: 52.0,
        electedYear: year,
        serviceSince: year,
      };
    });

    // 2. Align sittingMembers (preserve non-house, ensure exactly 435 house members matching reps 1:1)
    const nonHouse = (game.sittingMembers || []).filter((m) => m && m.office !== 'house');
    const existingHouseById = new Map();
    (game.sittingMembers || []).forEach((m) => {
      if (m && m.office === 'house') {
        const did = m.districtId || (m.stateId && m.district ? `${m.stateId}-${m.district}` : null);
        if (did && validIds.has(did) && !existingHouseById.has(did)) {
          existingHouseById.set(did, m);
        }
      }
    });

    const nextHouseSitting = nextReps.map((rep) => {
      const existing = existingHouseById.get(rep.districtId);
      const d = distById[rep.districtId];
      if (existing) {
        return {
          ...existing,
          districtId: rep.districtId,
          stateId: rep.stateId,
          state: rep.stateId,
          district: d?.district ?? existing.district,
        };
      }
      const pId = rep.partyId || 'people';
      return {
        id: `house:${rep.districtId}`,
        sittingId: `sitting-house-${rep.districtId}`,
        name: rep.name || `Rep. ${rep.districtId}`,
        title: `U.S. Representative (${rep.districtId})`,
        party: pId,
        partyId: pId,
        rawParty: pId === 'heritage' ? 'R' : 'D',
        caucus: pId,
        state: rep.stateId,
        stateId: rep.stateId,
        district: d?.district || 1,
        districtId: rep.districtId,
        office: 'house',
        officeLabel: 'House',
        chamber: 'house',
        raceId: `house:${rep.districtId}`,
        electionYear: year,
        isIncumbent: true,
        incumbent: true,
        happiness: 68,
        quality: 7,
        skill: 5,
        age: rep.age || 44,
        retired: false,
      };
    });

    return {
      ...game,
      representatives: nextReps,
      sittingMembers: [...nonHouse, ...nextHouseSitting],
    };
  }

  /**
   * Commits all selected strategies in the Redistricting War Room, updates currentHouseMap,
   * charges treasury/actions, adjusts trust & sitting member happiness, queues court challenges,
   * and enforces exact 435-seat 1:1 parity.
   */
  function commitDecadeMap(game) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const wr = nextGame.redistrictingWarRoom;
    if (!wr || !wr.active) return nextGame;

    const year = wr.year || nextGame.year || 2030;
    const playerId = getPlayerIdentity(nextGame);
    const mapKey = nextGame.activeHouseMapKey || `${year} map`;
    const baseMap = nextGame[mapKey] || nextGame.currentHouseMap;
    if (!baseMap || !Array.isArray(baseMap.modelDistricts)) return nextGame;

    // Compute total player cost & action cost
    let totalCost = 0;
    let totalActionCost = 0;
    let fairCompactCount = 0;
    let aggressiveGerrymanderCount = 0;
    let otherTrustDelta = 0;
    const happinessBoostStates = new Set();
    const newChallenges = [...(wr.pendingChallenges || [])];
    const nextBacklash = { ...(nextGame.redistrictingBacklash || {}) };
    const newLeanByDistId = {};
    const logLines = [];

    wr.controlledStates.forEach((stEntry) => {
      const stratKey = wr.selections?.[stEntry.stateId] || stEntry.selectedStrategy || 'fair_compact';
      const strat = REDISTRICTING_STRATEGIES[stratKey] || REDISTRICTING_STRATEGIES.fair_compact;
      const isPlayerChoice = stEntry.controlType === 'player_trifecta'
        || (stEntry.controlType === 'split' && stratKey === 'special_master');

      if (isPlayerChoice) {
        totalCost += strat.cost;
        totalActionCost += strat.actionCost || 0;
        if (stratKey === 'fair_compact') {
          fairCompactCount++;
        } else if (stratKey === 'aggressive_gerrymander') {
          aggressiveGerrymanderCount++;
        } else {
          otherTrustDelta += (strat.indTrustDelta || 0);
        }
        if (strat.sittingHappinessDelta > 0) {
          happinessBoostStates.add(stEntry.stateId);
        }
      } else if (stEntry.controlType === 'rival_trifecta' && stEntry.controllingParty && nextGame.parties?.[stEntry.controllingParty]) {
        // Deduct rival treasury
        const rp = nextGame.parties[stEntry.controllingParty];
        rp.treasury = round2(Math.max(0, Number(rp.treasury || 0) - strat.cost));
      }

      const stDistricts = baseMap.modelDistricts.filter((d) => d.stateId === stEntry.stateId);
      const actingParty = stEntry.controllingParty || playerId;
      const proj = computeStateStrategyProjection(stDistricts, stratKey, actingParty, nextGame);
      proj.districts.forEach((pd) => {
        newLeanByDistId[pd.id] = pd.newLean;
      });

      if (stratKey === 'aggressive_gerrymander') {
        // Queue 35% court strike-down challenge resolving at year + 2
        newChallenges.push({
          id: `challenge_${year}_${stEntry.stateId}`,
          stateId: stEntry.stateId,
          stateName: stEntry.stateName,
          enactedYear: year,
          resolveYear: year + 2,
          enactedBy: actingParty,
          risk: 0.35,
          resolved: false,
          struckDown: false,
        });
        // Opposition grassroots turnout +10 for 1 cycle
        nextBacklash[stEntry.stateId] = {
          againstParty: actingParty,
          turnoutBonus: 10,
          expiresAfterYear: year + 2,
        };
      }

      if (isPlayerChoice) {
        logLines.push(`${stEntry.stateId}: ${strat.name}${proj.seatDelta !== 0 ? ` (${proj.seatDelta > 0 ? '+' : ''}${proj.seatDelta} proj. seats)` : ''}`);
      }
    });

    // Validate player budget / actions
    const curTreasury = Number(nextGame.treasury ?? 0);
    if (totalCost > curTreasury) {
      return {
        ...nextGame,
        lastNote: `Insufficient treasury ($${round1(curTreasury)}M) to commit map strategies (requires $${totalCost}M). Adjust strategies first.`,
      };
    }
    if (totalActionCost > 0 && Number(nextGame.actionsLeft ?? 0) < totalActionCost) {
      // Allow committing in post-election phase where actionsLeft might be 0 if we deduct from next cycle or require >= 1 when available
      // Only block if in organizing phase with insufficient actions
      if (nextGame.phase === 'organizing') {
        return {
          ...nextGame,
          lastNote: `Insufficient actions remaining for Special Master petition (requires ${totalActionCost} action).`,
        };
      }
    }

    // Apply new leans to modelDistricts (preserving exact 435 count and baselineLean)
    const updatedModelDistricts = baseMap.modelDistricts.map((d) => {
      const baseLean = d.baselineLean !== undefined ? d.baselineLean : d.lean;
      const updatedLean = newLeanByDistId[d.id] !== undefined ? newLeanByDistId[d.id] : d.lean;
      return {
        ...d,
        baselineLean: baseLean,
        lean: updatedLean,
        redistrictedLean: updatedLean,
      };
    });

    const updatedMap = {
      ...baseMap,
      modelDistricts: updatedModelDistricts,
      redistrictingCommittedYear: year,
    };

    // Apply Sitting Member Happiness boost in incumbent_protection states
    const updatedSitting = (nextGame.sittingMembers || []).map((m) => {
      if (!m || m.office !== 'house') return m;
      if (happinessBoostStates.has(m.stateId || m.state)) {
        return { ...m, happiness: clamp(Number(m.happiness ?? 65) + 4, 0, 100) };
      }
      return m;
    });

    // Chunk 2.4: Clamp net indTrustDelta from a single decennial redistricting commit to [-8, +8]
    // (+1 per fair_compact up to +6 max, -2 per aggressive_gerrymander down to -8 max)
    const fairCompactDelta = Math.min(6, fairCompactCount * 1.0);
    const aggressiveDelta = Math.max(-8, aggressiveGerrymanderCount * -2.0);
    const netTrustDelta = clamp(round1(fairCompactDelta + aggressiveDelta + otherTrustDelta), -8, 8);

    // Update trust
    const curTrust = nextGame.trust || { supporters: 80, independents: 50, opponents: 12 };
    const nextIndTrust = clamp(round1(Number(curTrust.independents ?? 50) + netTrustDelta), 0, 100);
    const nextTrust = { ...curTrust, independents: nextIndTrust };

    const nextTreasury = round2(Math.max(0, curTreasury - totalCost));
    const nextActionsLeft = Math.max(0, Number(nextGame.actionsLeft ?? 0) - totalActionCost);

    let committed = {
      ...nextGame,
      treasury: nextTreasury,
      actionsLeft: nextActionsLeft,
      trust: nextTrust,
      player: nextGame.player ? { ...nextGame.player, trust: nextTrust } : nextGame.player,
      sittingMembers: updatedSitting,
      [mapKey]: updatedMap,
      currentHouseMap: updatedMap,
      redistrictingBacklash: nextBacklash,
      redistrictingWarRoom: {
        ...wr,
        active: false,
        committedYear: year,
        pendingChallenges: newChallenges,
      },
      yearLog: [
        ...(nextGame.yearLog || []),
        {
          year,
          turn: (nextGame.chairTurn || 0) + 1,
          action: `Decade Map Committed (${year}): ${logLines.length ? logLines.join('; ') : 'Commission & neutral maps ratified'}.`,
        },
      ].slice(-80),
      lastNote: `Decade Map (${year}) committed ($${totalCost}M spent, Independents Trust ${netTrustDelta >= 0 ? '+' : ''}${netTrustDelta}).`,
    };

    committed = enforceHouse435Parity(committed, year);
    return committed;
  }

  /**
   * Resolves pending 35% court strike-down challenges when game advances to year + 2.
   * Struck-down states revert to fair_compact baseline leans with -4 Independents Trust & -5 state approval.
   */
  function resolvePendingCourtChallenges(game, currentYear) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const year = Number(currentYear || nextGame.year || 2032);
    const wr = nextGame.redistrictingWarRoom;
    const challenges = wr?.pendingChallenges || [];
    const due = challenges.filter((c) => !c.resolved && Number(c.resolveYear) <= year);

    // Expire old backlash entries
    const nextBacklash = {};
    Object.entries(nextGame.redistrictingBacklash || {}).forEach(([st, rec]) => {
      if (rec && Number(rec.expiresAfterYear || 0) >= year) {
        nextBacklash[st] = rec;
      }
    });
    nextGame = { ...nextGame, redistrictingBacklash: nextBacklash };

    if (due.length === 0) return nextGame;

    const playerId = getPlayerIdentity(nextGame);
    const mapKey = nextGame.activeHouseMapKey;
    const baseMap = (mapKey && nextGame[mapKey]) || nextGame.currentHouseMap;
    const baselineLeans = wr.baselineLeans || {};

    const struckStates = new Set();
    let indTrustPenalty = 0;
    const stateApprovalPenalties = {};
    const logEntries = [];

    const updatedChallenges = challenges.map((ch) => {
      if (ch.resolved || Number(ch.resolveYear) > year) return ch;
      const roll = seededUnit(`court-challenge:${nextGame.seed || 2028}:${ch.enactedYear}:${ch.stateId}`);
      const struckDown = roll < Number(ch.risk ?? 0.35);
      if (struckDown) {
        struckStates.add(ch.stateId);
        if (normalizePartyId(ch.enactedBy, nextGame) === playerId) {
          indTrustPenalty -= 4;
        }
        stateApprovalPenalties[ch.stateId] = -5;
        logEntries.push({
          year,
          turn: 1,
          action: `COURT STRIKE-DOWN (${ch.stateId}): Federal court invalidated the ${ch.enactedYear} gerrymander! Reverted to Fair & Compact baseline (-4 Independents Trust, -5 State Approval).`,
        });
      } else {
        logEntries.push({
          year,
          turn: 1,
          action: `Court Challenge Dismissed (${ch.stateId}): The ${ch.enactedYear} congressional map survived judicial review.`,
        });
      }
      return { ...ch, resolved: true, struckDown, resolvedYear: year };
    });

    // Revert struck-down states to fair_compact baseline leans
    let updatedMap = baseMap;
    if (struckStates.size > 0 && baseMap && Array.isArray(baseMap.modelDistricts)) {
      const revertedModel = baseMap.modelDistricts.map((d) => {
        if (!struckStates.has(d.stateId)) return d;
        const origLean = d.baselineLean !== undefined
          ? d.baselineLean
          : (baselineLeans[d.id] !== undefined ? baselineLeans[d.id] : d.lean);
        return {
          ...d,
          lean: origLean,
          redistrictedLean: origLean,
          courtRevertedYear: year,
        };
      });
      updatedMap = { ...baseMap, modelDistricts: revertedModel };
    }

    // Apply -4 Independents Trust & -5 state approval (stored in stateApprovalPenalties & voterModel/stateDeltas)
    const curTrust = nextGame.trust || { supporters: 80, independents: 50, opponents: 12 };
    const nextTrust = {
      ...curTrust,
      independents: clamp(round1(Number(curTrust.independents ?? 50) + indTrustPenalty), 0, 100),
    };
    const nextStateApprovals = { ...(nextGame.redistrictingStateApprovalPenalties || {}) };
    Object.entries(stateApprovalPenalties).forEach(([st, pen]) => {
      nextStateApprovals[st] = Number(nextStateApprovals[st] || 0) + pen;
    });

    const out = {
      ...nextGame,
      trust: nextTrust,
      player: nextGame.player ? { ...nextGame.player, trust: nextTrust } : nextGame.player,
      redistrictingStateApprovalPenalties: nextStateApprovals,
      redistrictingWarRoom: {
        ...wr,
        pendingChallenges: updatedChallenges,
      },
      yearLog: [...(nextGame.yearLog || []), ...logEntries].slice(-80),
    };
    if (updatedMap) {
      out.currentHouseMap = updatedMap;
      if (mapKey) out[mapKey] = updatedMap;
    }
    return out;
  }

  // =========================================================================
  // 5. PROPOSAL #7: BALLOT INITIATIVES & DOWN-BALLOT COATTAIL ENGINEERING
  // =========================================================================

  function isInitiativeEligibleState(game, stateId) {
    if (INITIATIVE_ELIGIBLE_STATES.includes(stateId)) return true;
    const passed = game?.passedStateInitiatives?.[stateId];
    if (Array.isArray(passed) && passed.length > 0) return true;
    const sys = game?.stateElectoralSystems?.[stateId];
    if (sys && (sys.allRaces === 'rcv' || sys.primarySystem === 'top4' || sys.autoVoterRegistration)) return true;
    return false;
  }

  function getBallotInitiativeCost(game, stateId) {
    const st = getStatesCatalog(game).find((s) => s.id === stateId);
    const ev = Number(st?.ev || 6);
    if (ev <= 6) return 3;
    if (ev <= 12) return 4;
    if (ev <= 20) return 5;
    return 6;
  }

  function getBallotInitiativeArchetype(archetypeId) {
    return BALLOT_INITIATIVE_ARCHETYPES.find((a) => a.id === archetypeId) || null;
  }

  /**
   * Organizing action: sponsor-ballot-initiative
   * Up to 3 active per cycle per party; 1 Action + $3M-$6M scaled by state EVs.
   */
  function sponsorBallotInitiative(game, payload, actingPartyId = null) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const playerId = getPlayerIdentity(nextGame);
    const sponsorPartyId = normalizePartyId(actingPartyId || payload?.partyId || playerId, nextGame);
    const isPlayer = sponsorPartyId === playerId;

    const stateId = payload?.stateId;
    const archetypeId = payload?.archetypeId || payload?.initiativeId;
    const arch = getBallotInitiativeArchetype(archetypeId);
    if (!stateId || !arch) {
      return isPlayer ? { ...nextGame, lastNote: 'Select a valid state and ballot initiative archetype.' } : nextGame;
    }

    if (!isInitiativeEligibleState(nextGame, stateId)) {
      return isPlayer ? { ...nextGame, lastNote: `${stateId} does not permit citizen ballot initiatives.` } : nextGame;
    }

    const cycleYear = Number(nextGame.year || 2028);
    const activeForParty = (nextGame.activeBallotInitiatives || []).filter(
      (i) => i.sponsorPartyId === sponsorPartyId && Number(i.cycleYear) === cycleYear
    );
    if (activeForParty.length >= 3) {
      return isPlayer ? { ...nextGame, lastNote: 'Maximum 3 active ballot initiatives per cycle reached.' } : nextGame;
    }

    const dup = (nextGame.activeBallotInitiatives || []).some(
      (i) => i.stateId === stateId && i.archetypeId === archetypeId && Number(i.cycleYear) === cycleYear
    );
    if (dup) {
      return isPlayer ? { ...nextGame, lastNote: `${arch.name} is already on the ${stateId} ballot this cycle.` } : nextGame;
    }

    // Prevent re-sponsoring an already permanently passed structural reform in this state
    const alreadyPassed = Array.isArray(nextGame.passedStateInitiatives?.[stateId])
      && nextGame.passedStateInitiatives[stateId].includes(archetypeId);
    if (arch.category === 'structural_reform' && alreadyPassed) {
      return isPlayer ? { ...nextGame, lastNote: `${arch.name} is already permanently enacted in ${stateId}.` } : nextGame;
    }

    const cost = getBallotInitiativeCost(nextGame, stateId);
    if (isPlayer) {
      if (Number(nextGame.treasury ?? 0) < cost) {
        return { ...nextGame, lastNote: `Insufficient treasury: sponsoring in ${stateId} costs $${cost}M.` };
      }
    } else {
      const rp = nextGame.parties?.[sponsorPartyId];
      if (!rp || Number(rp.treasury ?? 0) < cost) return nextGame;
      rp.treasury = round2(Number(rp.treasury) - cost);
    }

    const stObj = getStatesCatalog(nextGame).find((s) => s.id === stateId);
    const initiative = {
      id: `init_${cycleYear}_${stateId}_${archetypeId}_${sponsorPartyId}`,
      cycleYear,
      stateId,
      stateName: stObj?.name || stateId,
      archetypeId: arch.id,
      name: arch.name,
      category: arch.category,
      reformKey: arch.reformKey || null,
      sponsorPartyId,
      cost,
      turnoutBoost: arch.turnoutBoost,
      alignedParties: [...arch.alignedParties],
      targetRival: arch.targetRival,
      counterFundedBy: [],
      counterFundingMarginDelta: 0,
      wedgeApplied: false,
      resolved: false,
      passed: null,
      yesPct: null,
    };

    const nextActive = [...(nextGame.activeBallotInitiatives || []), initiative];

    // Also mirror turnoutBoost into campaign.ballotMeasures for legacy engine compatibility
    const nextCampaignBallot = {
      ...(nextGame.campaign?.ballotMeasures || {}),
      [stateId]: {
        ...(nextGame.campaign?.ballotMeasures?.[stateId] || {}),
        name: arch.name,
        turnoutBoost: round1(Number(nextGame.campaign?.ballotMeasures?.[stateId]?.turnoutBoost || 0) + (isPlayer ? arch.turnoutBoost * 0.5 : 0)),
      },
    };

    // Wedge effect on rival nominees when sponsoring a Turnout Driver
    let nextParties = nextGame.parties ? { ...nextGame.parties } : undefined;
    if (arch.category === 'turnout_driver' && arch.targetRival && nextParties?.[arch.targetRival]) {
      const rival = { ...nextParties[arch.targetRival] };
      // Deterministic wedge choice: -4 base enthusiasm or -3 independent trust
      const wedgeRoll = seededUnit(`wedge:${nextGame.seed || 2028}:${cycleYear}:${stateId}:${archetypeId}`);
      if (wedgeRoll < 0.5) {
        rival.baseEnthusiasm = clamp(Number(rival.baseEnthusiasm ?? 60) + (arch.wedgeEnthusiasmPenalty || -4), 0, 100);
        initiative.wedgeEffect = `${partyDisplayName(arch.targetRival, nextGame)} nominee wedged (-4 Base Enthusiasm)`;
      } else {
        const rt = rival.trust || { supporters: 75, independents: 50, opponents: 12 };
        rival.trust = { ...rt, independents: clamp(Number(rt.independents ?? 50) + (arch.wedgeIndTrustPenalty || -3), 0, 100) };
        initiative.wedgeEffect = `${partyDisplayName(arch.targetRival, nextGame)} nominee wedged (-3 Independents Trust)`;
      }
      initiative.wedgeApplied = true;
      nextParties[arch.targetRival] = rival;
    }

    const updated = {
      ...nextGame,
      activeBallotInitiatives: nextActive,
      campaign: {
        ...(nextGame.campaign || {}),
        ballotMeasures: nextCampaignBallot,
      },
      yearLog: [
        ...(nextGame.yearLog || []),
        {
          year: cycleYear,
          turn: (nextGame.chairTurn || 0) + 1,
          action: `${partyDisplayName(sponsorPartyId, nextGame)} sponsored "${arch.name}" ballot initiative in ${stateId} ($${cost}M, +${arch.turnoutBoost}% aligned turnout).`,
        },
      ].slice(-80),
    };
    if (nextParties) updated.parties = nextParties;

    if (isPlayer) {
      updated.treasury = round2(Number(nextGame.treasury ?? 0) - cost);
      updated.lastNote = `Sponsored "${arch.name}" in ${stateId} ($${cost}M). +${arch.turnoutBoost}% aligned turnout on Election Night.`;
    }
    return updated;
  }

  /**
   * Counter-fund an active ballot initiative (-$2M for -3% margin).
   */
  function counterFundBallotInitiative(game, initiativeId, partyId) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const normParty = normalizePartyId(partyId, nextGame);
    const playerId = getPlayerIdentity(nextGame);
    const isPlayer = normParty === playerId;
    const cost = 2;

    const idx = (nextGame.activeBallotInitiatives || []).findIndex((i) => i.id === initiativeId && !i.resolved);
    if (idx < 0) return nextGame;
    const init = nextGame.activeBallotInitiatives[idx];
    if (init.sponsorPartyId === normParty) return nextGame;
    if ((init.counterFundedBy || []).includes(normParty)) return nextGame;

    if (isPlayer) {
      if (Number(nextGame.treasury ?? 0) < cost) return nextGame;
      nextGame = { ...nextGame, treasury: round2(Number(nextGame.treasury) - cost) };
    } else {
      const rp = nextGame.parties?.[normParty];
      if (!rp || Number(rp.treasury ?? 0) < cost) return nextGame;
      rp.treasury = round2(Number(rp.treasury) - cost);
    }

    const updatedInit = {
      ...init,
      counterFundedBy: [...(init.counterFundedBy || []), normParty],
      counterFundingMarginDelta: Number(init.counterFundingMarginDelta || 0) - 3,
    };
    const nextList = [...nextGame.activeBallotInitiatives];
    nextList[idx] = updatedInit;

    return {
      ...nextGame,
      activeBallotInitiatives: nextList,
      yearLog: [
        ...(nextGame.yearLog || []),
        {
          year: nextGame.year || 2028,
          turn: (nextGame.chairTurn || 0) + 1,
          action: `${partyDisplayName(normParty, nextGame)} counter-funded "${init.name}" in ${init.stateId} (-$2M for -3% YES margin).`,
        },
      ].slice(-80),
    };
  }

  /**
   * SOEE Rival AI hook: rivals counter-fund threatening player initiatives (-$2M for -3% margin)
   * and/or sponsor wedge initiatives in battleground initiative states.
   */
  function runRivalBallotInitiativeAI(game, phaseName) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const playerId = getPlayerIdentity(nextGame);
    const cycleYear = Number(nextGame.year || 2028);
    const oppPartyIds = Object.keys(nextGame.parties || {}).filter(
      (p) => p !== playerId && ['people', 'heritage'].includes(p)
    );

    oppPartyIds.forEach((oppId) => {
      const opp = nextGame.parties?.[oppId];
      if (!opp) return;

      // 1. Counter-fund active initiatives targeting this rival
      const targets = (nextGame.activeBallotInitiatives || []).filter(
        (i) => !i.resolved
          && Number(i.cycleYear) === cycleYear
          && i.sponsorPartyId !== oppId
          && !(i.counterFundedBy || []).includes(oppId)
          && (i.targetRival === oppId || i.category === 'turnout_driver')
      );
      if (targets.length > 0 && Number(opp.treasury || 0) >= 6) {
        nextGame = counterFundBallotInitiative(nextGame, targets[0].id, oppId);
      }

      // 2. During organizing phase, sponsor 1 wedge initiative in an eligible battleground state
      if (String(phaseName || '').toLowerCase() === 'organizing') {
        const oppActive = (nextGame.activeBallotInitiatives || []).filter(
          (i) => i.sponsorPartyId === oppId && Number(i.cycleYear) === cycleYear
        );
        if (oppActive.length < 1 && Number(opp.treasury || 0) >= 10) {
          const states = getStatesCatalog(nextGame)
            .filter((s) => isInitiativeEligibleState(nextGame, s.id))
            .sort((a, b) => Math.abs(Number(a.leanPercent ?? 0)) - Math.abs(Number(b.leanPercent ?? 0)));
          const pickIdx = Math.floor(seededUnit(`rival-init-st:${nextGame.seed || 2028}:${cycleYear}:${oppId}`) * Math.min(6, states.length));
          const targetState = states[pickIdx];
          const alignedDrivers = BALLOT_INITIATIVE_ARCHETYPES.filter(
            (a) => a.category === 'turnout_driver' && a.alignedParties.includes(oppId)
          );
          if (targetState && alignedDrivers.length > 0) {
            const archIdx = Math.floor(seededUnit(`rival-init-arch:${nextGame.seed || 2028}:${cycleYear}:${oppId}`) * alignedDrivers.length);
            const arch = alignedDrivers[archIdx];
            nextGame = sponsorBallotInitiative(nextGame, { stateId: targetState.id, archetypeId: arch.id }, oppId);
          }
        }
      }
    });

    return nextGame;
  }

  /**
   * Computes net Election Night state margin shift from active ballot initiatives
   * and any active redistricting backlash (+10 opposition grassroots turnout for 1 cycle)
   * or court strike-down state approval penalties.
   * Positive = favors 'people' (Dem), Negative = favors 'heritage' (GOP).
   */
  function getBallotAndRedistrictingStateLift(game, stateId) {
    if (!game || !stateId) return 0;
    const cycleYear = Number(game.year || 2028);
    let lift = 0;

    // 1. Active ballot initiatives turnout coattail lift (+4% to +7% aligned turnout -> ~1.6 to 2.8 pt margin lift)
    (game.activeBallotInitiatives || []).forEach((init) => {
      if (init.stateId !== stateId || Number(init.cycleYear) !== cycleYear) return;
      const sign = partySign(init.sponsorPartyId, game);
      lift += sign * (Number(init.turnoutBoost || 4) * 0.38);
    });

    // 2. Permanent Automatic Voter Registration lift
    if (game.stateElectoralSystems?.[stateId]?.autoVoterRegistration) {
      lift += 0.8;
    }

    // 3. Aggressive Gerrymander opposition grassroots backlash (+10 opposition turnout for 1 cycle)
    const backlash = game.redistrictingBacklash?.[stateId];
    if (backlash && Number(backlash.expiresAfterYear || 0) >= cycleYear) {
      const againstSign = partySign(backlash.againstParty, game);
      // Helps the opposition (opposite sign)
      lift += (-againstSign) * (Number(backlash.turnoutBonus || 10) * 0.18);
    }

    // 4. Court strike-down state approval penalty (-5 state approval -> -1.25 pt against player if applicable)
    const appPen = Number(game.redistrictingStateApprovalPenalties?.[stateId] || 0);
    if (appPen < 0) {
      const pSign = partySign(getPlayerIdentity(game), game);
      lift += pSign * (appPen * 0.25);
    }

    return round2(lift);
  }

  /**
   * Resolves all active ballot initiatives on Election Night.
   * Permanently updates game.stateElectoralSystems[stateId] or game.redistrictingCommissions[stateId]
   * when structural reforms pass (>50%).
   */
  function resolveElectionNightBallotInitiatives(game) {
    let nextGame = normalizeRedistrictingBallotState(game);
    const cycleYear = Number(nextGame.year || 2028);
    const active = (nextGame.activeBallotInitiatives || []).filter((i) => Number(i.cycleYear) === cycleYear);

    if (active.length === 0) {
      return {
        ...nextGame,
        lastBallotInitiativeResults: [],
      };
    }

    const statesCat = getStatesCatalog(nextGame);
    const stateById = Object.fromEntries(statesCat.map((s) => [s.id, s]));
    const nextSystems = JSON.parse(JSON.stringify(nextGame.stateElectoralSystems || {}));
    const nextCommissions = { ...(nextGame.redistrictingCommissions || {}) };
    const nextPassed = JSON.parse(JSON.stringify(nextGame.passedStateInitiatives || {}));
    const logEntries = [];
    const results = [];

    active.forEach((init) => {
      const arch = getBallotInitiativeArchetype(init.archetypeId) || {
        baseSupport: 52,
        leanSensitivity: 0.35,
        category: init.category,
        reformKey: init.reformKey,
      };
      const st = stateById[init.stateId] || { id: init.stateId, name: init.stateId, leanPercent: 0 };
      const stateLean = Number(st.leanPercent ?? (st.lean ? -st.lean * 100 : 0));
      const natEnv = Number(nextGame.nationalEnvironment ?? 0);
      const noise = (seededUnit(`ballot-res:${nextGame.seed || 2028}:${cycleYear}:${init.stateId}:${init.archetypeId}`) - 0.5) * 6.0;

      const rawYes = Number(arch.baseSupport || 52)
        + (stateLean * Number(arch.leanSensitivity || 0.35))
        + (natEnv * Number(arch.leanSensitivity || 0.35) * 0.4)
        + Number(init.counterFundingMarginDelta || 0)
        + noise;

      const yesPct = clamp(round1(rawYes), 18.0, 82.0);
      const passed = yesPct > 50.0;
      let reformAppliedText = '';

      if (passed) {
        if (!Array.isArray(nextPassed[init.stateId])) nextPassed[init.stateId] = [];
        if (!nextPassed[init.stateId].includes(init.archetypeId)) {
          nextPassed[init.stateId].push(init.archetypeId);
        }

        if (arch.category === 'structural_reform') {
          const curSys = nextSystems[init.stateId] || { allRaces: 'plurality', legislative: 'plurality' };
          if (arch.reformKey === 'rcv') {
            nextSystems[init.stateId] = { ...curSys, allRaces: 'rcv' };
            reformAppliedText = 'Ranked Choice Voting permanently enacted';
          } else if (arch.reformKey === 'top4') {
            nextSystems[init.stateId] = { ...curSys, allRaces: 'rcv', primarySystem: 'top4' };
            reformAppliedText = 'Nonpartisan Top-4 Primary permanently enacted';
          } else if (arch.reformKey === 'irc') {
            nextCommissions[init.stateId] = true;
            reformAppliedText = 'Independent Redistricting Commission permanently enacted';
          } else if (arch.reformKey === 'avr') {
            nextSystems[init.stateId] = { ...curSys, autoVoterRegistration: true };
            reformAppliedText = 'Automatic Voter Registration permanently enacted';
          }
        }
      }

      const resRec = {
        ...init,
        resolved: true,
        passed,
        yesPct,
        noPct: round1(100 - yesPct),
        reformAppliedText,
      };
      results.push(resRec);

      logEntries.push({
        year: cycleYear,
        turn: (nextGame.chairTurn || 0) + 1,
        action: `BALLOT MEASURE ${passed ? 'PASSED' : 'FAILED'} (${init.stateId}): ${init.name} — ${yesPct}% YES / ${round1(100 - yesPct)}% NO${reformAppliedText ? ` (${reformAppliedText})` : ''}.`,
      });
    });

    return {
      ...nextGame,
      stateElectoralSystems: nextSystems,
      redistrictingCommissions: nextCommissions,
      passedStateInitiatives: nextPassed,
      activeBallotInitiatives: results,
      lastBallotInitiativeResults: results,
      lastElection: nextGame.lastElection
        ? { ...nextGame.lastElection, ballotInitiativeResults: results }
        : nextGame.lastElection,
      yearLog: [...(nextGame.yearLog || []), ...logEntries].slice(-80),
    };
  }

  /**
   * Clears expired activeBallotInitiatives at the start of a new cycle while strictly
   * preserving passedStateInitiatives, redistrictingCommissions, and stateElectoralSystems.
   */
  function advanceCycleRedistrictingAndBallot(game, nextYear) {
    let nextGame = normalizeRedistrictingBallotState(game);
    nextGame = resolvePendingCourtChallenges(nextGame, nextYear);
    return {
      ...nextGame,
      activeBallotInitiatives: [],
      redistrictingWarRoom: {
        ...nextGame.redistrictingWarRoom,
        active: false,
      },
    };
  }

  // =========================================================================
  // 6. UI HTML MARKUP BUILDERS (CALLED BY SURGICAL HOOKS IN app.js)
  // =========================================================================

  /**
   * Organizing phase card for sponsoring Ballot Initiatives (Proposal #7).
   */
  function renderBallotInitiativeActionCard(game, options = {}) {
    const g = normalizeRedistrictingBallotState(game);
    const playerId = getPlayerIdentity(g);
    const cycleYear = Number(g.year || 2028);
    const disabled = Boolean(options.disabled);
    const activeByPlayer = (g.activeBallotInitiatives || []).filter(
      (i) => i.sponsorPartyId === playerId && Number(i.cycleYear) === cycleYear
    );
    const eligibleStates = getStatesCatalog(g).filter((s) => isInitiativeEligibleState(g, s.id));
    const defaultStateId = options.selectedState && isInitiativeEligibleState(g, options.selectedState)
      ? options.selectedState
      : (eligibleStates[0]?.id || 'AZ');
    const estCost = getBallotInitiativeCost(g, defaultStateId);
    const limitReached = activeByPlayer.length >= 3;
    const canSponsor = !disabled && !limitReached && Number(g.treasury ?? 0) >= estCost && eligibleStates.length > 0;

    const stateOpts = eligibleStates.map((s) => {
      const c = getBallotInitiativeCost(g, s.id);
      return `<option value="${escHtml(s.id)}" ${s.id === defaultStateId ? 'selected' : ''}>${escHtml(s.id)} · ${escHtml(s.name || s.id)} ($${c}M)</option>`;
    }).join('');

    const archOpts = BALLOT_INITIATIVE_ARCHETYPES.map((a) => {
      const tag = a.category === 'structural_reform' ? 'Reform' : `+${a.turnoutBoost}% Turnout`;
      return `<option value="${escHtml(a.id)}">${escHtml(a.name)} (${tag})</option>`;
    }).join('');

    const activeListHtml = activeByPlayer.length > 0
      ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">
          ${activeByPlayer.map((i) => `<span class="v07-mini-badge" style="background:rgba(59,130,246,0.18);border:1px solid #3b82f6;color:#bfdbfe;padding:2px 7px;border-radius:6px;font-size:11px;">${escHtml(i.stateId)}: ${escHtml(i.name)} (+${i.turnoutBoost}%)</span>`).join('')}
        </div>`
      : '';

    return `
      <div class="action-card" id="v0184-ballot-initiative-card" style="border-color:rgba(245,158,11,0.45);background:linear-gradient(145deg,#1d1912,#111b26)">
        <div class="action-head"><i style="color:#f59e0b">🗳</i><b>Sponsor Ballot Initiative (${activeByPlayer.length}/3 Active)</b><span>$3–6M</span></div>
        <p>Engineer down-ballot coattails in ${eligibleStates.length} initiative-eligible states. Turnout Drivers boost aligned turnout (+4–7%) and wedge rival nominees; Structural Reforms permanently reshape state election rules if passed (&gt;50%).</p>
        <div class="inline-controls" style="flex-wrap:wrap;gap:6px">
          <select id="ballot-init-state">${stateOpts}</select>
          <select id="ballot-init-archetype">${archOpts}</select>
          <button type="button" class="button button-small button-gold" data-action="sponsor-ballot-initiative" ${canSponsor ? '' : 'disabled'}>${limitReached ? 'Cycle Limit (3/3)' : `Sponsor ($${estCost}M)`}</button>
        </div>
        ${activeListHtml}
      </div>`;
  }

  /**
   * Election Night Ballot Measures strip showing PASS/FAIL calls (Proposal #7).
   */
  function renderBallotMeasuresStrip(game) {
    const results = Array.isArray(game?.lastBallotInitiativeResults) && game.lastBallotInitiativeResults.length > 0
      ? game.lastBallotInitiativeResults
      : (game?.lastElection?.ballotInitiativeResults || []);
    if (!results.length) return '';

    const cards = results.map((r) => {
      const badgeColor = r.passed ? '#10b981' : '#ef4444';
      const statusText = r.passed ? 'PASS' : 'FAIL';
      const detail = r.reformAppliedText
        ? `<div style="font-size:11px;color:#fcd34d;margin-top:3px;">★ ${escHtml(r.reformAppliedText)}</div>`
        : `<div style="font-size:11px;color:#94a3b8;margin-top:3px;">+${Number(r.turnoutBoost || 0).toFixed(1)}% turnout · ${escHtml(partyDisplayName(r.sponsorPartyId, game))}</div>`;
      return `
        <div class="ballot-measure-chip" data-initiative-id="${escHtml(r.id)}" style="flex:1 1 220px;min-width:200px;background:rgba(15,23,42,0.85);border:1px solid ${badgeColor}66;border-radius:8px;padding:8px 10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <span style="font-weight:700;font-size:12px;color:#f8fafc;">${escHtml(r.stateId)} · ${escHtml(r.name)}</span>
            <span style="background:${badgeColor};color:#0b1120;font-weight:800;font-size:10px;padding:2px 6px;border-radius:4px;">${statusText} ${Number(r.yesPct || 0).toFixed(1)}%</span>
          </div>
          ${detail}
        </div>`;
    }).join('');

    return `
      <section class="desk-card" id="v0184-ballot-measures-strip" style="margin:10px 0;padding:10px 14px;border:1px solid rgba(245,158,11,0.4);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:11px;font-weight:800;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">🗳 BALLOT MEASURES · ELECTION NIGHT CALLS</span>
          <span style="font-size:11px;color:#94a3b8;">${results.filter((r) => r.passed).length}/${results.length} Passed</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${cards}
        </div>
      </section>`;
  }

  /**
   * Post-election Decennial Redistricting & Gerrymandering War Room Modal (Proposal #2).
   */
  function renderRedistrictingWarRoomModal(game) {
    const wr = game?.redistrictingWarRoom;
    if (!wr || !wr.active) return '';

    const playerStates = (wr.controlledStates || []).filter((s) => s.controlType === 'player_trifecta');
    const splitStates = (wr.controlledStates || []).filter((s) => s.controlType === 'split');
    if (playerStates.length === 0 && splitStates.length === 0) return '';
    const rivalStates = (wr.controlledStates || []).filter((s) => s.controlType === 'rival_trifecta' || s.controlType === 'rival_split');
    const commStates = (wr.controlledStates || []).filter((s) => s.controlType === 'commission');

    let totalCost = 0;
    let totalSeatDelta = 0;
    const renderRow = (st, allowTrifecta) => {
      const stratKey = wr.selections?.[st.stateId] || st.selectedStrategy || 'fair_compact';
      const strat = REDISTRICTING_STRATEGIES[stratKey] || REDISTRICTING_STRATEGIES.fair_compact;
      if (allowTrifecta || stratKey === 'special_master') {
        totalCost += strat.cost;
      }
      if (allowTrifecta) totalSeatDelta += Number(st.seatDelta || 0);

      const riskBadge = strat.courtStrikeRisk > 0
        ? `<span style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid #ef4444;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:700;">⚠ ${Math.round(strat.courtStrikeRisk * 100)}% Court Risk</span>`
        : `<span style="background:rgba(16,185,129,0.18);color:#6ee7b7;border:1px solid #10b981;padding:2px 6px;border-radius:4px;font-size:11px;">0% Risk</span>`;

      const dummyBadge = st.dummymanderWarning
        ? `<div style="font-size:11px;color:#fbbf24;margin-top:4px;">⚠ Dummymander Wave Vulnerability: ${(st.vulnerableDistricts || []).join(', ')} stretched &lt; +4.5 lean</div>`
        : '';

      const opts = allowTrifecta
        ? ['fair_compact', 'incumbent_protection', 'aggressive_gerrymander']
        : ['incumbent_protection', 'special_master'];

      const selectHtml = `<select class="war-room-strat-select" data-action="select-redistricting-strategy" data-state="${escHtml(st.stateId)}">
        ${opts.map((k) => {
          const s = REDISTRICTING_STRATEGIES[k];
          return `<option value="${k}" ${k === stratKey ? 'selected' : ''}>${escHtml(s.name)} (${s.cost > 0 ? `$${s.cost}M` : 'Free'}${s.actionCost ? ` + ${s.actionCost} Act` : ''})</option>`;
        }).join('')}
      </select>`;

      const deltaColor = st.seatDelta > 0 ? '#6ee7b7' : st.seatDelta < 0 ? '#fca5a5' : '#94a3b8';
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;border-bottom:1px solid rgba(148,163,184,0.18);flex-wrap:wrap;">
          <div style="min-width:170px;">
            <div style="font-weight:700;color:#f8fafc;">${escHtml(st.stateId)} · ${escHtml(st.stateName)} <span style="font-weight:400;color:#94a3b8;font-size:12px;">(${st.seatCount} seats)</span></div>
            ${dummyBadge}
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            ${selectHtml}
            <span style="font-size:12px;font-weight:700;color:${deltaColor};min-width:74px;text-align:right;">Δ ${st.seatDelta >= 0 ? '+' : ''}${st.seatDelta} seats</span>
            ${riskBadge}
          </div>
        </div>`;
    };

    const playerRowsHtml = playerStates.length
      ? playerStates.map((s) => renderRow(s, true)).join('')
      : '<div style="padding:8px;color:#94a3b8;font-size:12px;">Your party holds no state trifectas with 2+ House seats this cycle.</div>';

    const splitRowsHtml = splitStates.length
      ? splitStates.slice(0, 12).map((s) => renderRow(s, false)).join('')
      : '<div style="padding:8px;color:#94a3b8;font-size:12px;">No split-control multi-district states.</div>';

    return `
      <div class="v08-modal-overlay" id="v0184-redistricting-war-room-modal" style="z-index:1200;">
        <div class="v08-modal-content" style="max-width:860px;max-height:88vh;overflow-y:auto;padding:22px;border:1px solid #e2bd70;background:#0f172a;color:#e2e8f0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div>
              <div style="font-size:11px;letter-spacing:0.1em;color:#e2bd70;font-weight:800;text-transform:uppercase;">DECENNIAL REDISTRICTING &amp; GERRYMANDERING WAR ROOM</div>
              <h2 style="margin:2px 0 0;font-size:20px;">${wr.year} Congressional Map Strategy (435 Seats)</h2>
            </div>
            <div style="text-align:right;font-size:12px;">
              <div>Treasury: <b>$${round1(game.treasury ?? 0)}M</b></div>
              <div>Selected Cost: <b style="color:${totalCost > (game.treasury ?? 0) ? '#f87171' : '#6ee7b7'}">$${totalCost}M</b> · Net Δ <b>${totalSeatDelta >= 0 ? '+' : ''}${totalSeatDelta}</b></div>
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <h3 style="font-size:13px;color:#93c5fd;margin:0 0 6px;">Your Controlled Trifecta States (${playerStates.length})</h3>
            <div style="border:1px solid rgba(148,163,184,0.25);border-radius:8px;background:rgba(15,23,42,0.7);">
              ${playerRowsHtml}
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <h3 style="font-size:13px;color:#cbd5e1;margin:0 0 6px;">Split-Control States (${splitStates.length}) — Default Incumbent Protection or Petition Special Master ($4M + 1 Act)</h3>
            <div style="border:1px solid rgba(148,163,184,0.2);border-radius:8px;background:rgba(15,23,42,0.5);max-height:200px;overflow-y:auto;">
              ${splitRowsHtml}
            </div>
          </div>

          <div style="font-size:12px;color:#94a3b8;margin-bottom:16px;line-height:1.5;">
            <b>Independent Commissions (${commStates.length}):</b> ${commStates.map((s) => s.stateId).join(', ') || 'None'} (automatic Fair &amp; Compact).<br/>
            <b>Rival Trifectas (${rivalStates.length}):</b> ${rivalStates.map((s) => `${s.stateId} (${REDISTRICTING_STRATEGIES[s.selectedStrategy]?.name || s.selectedStrategy})`).join(', ') || 'None'}.
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;">
            <button type="button" class="button button-gold" id="btn-commit-decade-map" data-action="commit-decade-map">Commit Decade Map (${wr.year}) →</button>
          </div>
        </div>
      </div>`;
  }

  // =========================================================================
  // 7. EXPORTS
  // =========================================================================

  const RedistrictingBallotSystem = {
    DEFAULT_COMMISSION_STATES,
    INITIATIVE_ELIGIBLE_STATES,
    REDISTRICTING_STRATEGIES,
    BALLOT_INITIATIVE_ARCHETYPES,
    seededUnit,
    normalizeRedistrictingBallotState,
    isIndependentCommissionState,
    getStateGovernmentControl,
    computeStateStrategyProjection,
    selectRivalRedistrictingStrategy,
    initializeDecennialWarRoom,
    selectRedistrictingStrategy,
    commitDecadeMap,
    enforceHouse435Parity,
    resolvePendingCourtChallenges,
    isInitiativeEligibleState,
    getBallotInitiativeCost,
    getBallotInitiativeArchetype,
    sponsorBallotInitiative,
    counterFundBallotInitiative,
    runRivalBallotInitiativeAI,
    getBallotAndRedistrictingStateLift,
    resolveElectionNightBallotInitiatives,
    advanceCycleRedistrictingAndBallot,
    renderBallotInitiativeActionCard,
    renderBallotMeasuresStrip,
    renderRedistrictingWarRoomModal,
  };

  if (typeof window !== 'undefined') {
    window.RedistrictingBallotSystem = RedistrictingBallotSystem;
  }
  if (typeof root !== 'undefined' && root) {
    root.RedistrictingBallotSystem = RedistrictingBallotSystem;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RedistrictingBallotSystem;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
