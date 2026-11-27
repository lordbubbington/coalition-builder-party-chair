// ============================================================================
// Coalition Builder: Party Chair — Nationwide Trifecta Constitutional & Federal Reforms
// ============================================================================
// Implements:
//   1. Strict Nationwide Trifecta Gate (Presidency + U.S. House + U.S. Senate)
//   2. Huntington-Hill House Apportionment Engine (435 / 573 / 692 / 1,000)
//   3. All 5 Larry Sabato Proposals (136-Senate, 1000-House+Nonpartisan, Mended EC,
//      Rotating 4-Month Regional Primaries, Term & Cycle Overhaul)
//   4. Reversible Compulsory Voting & Ban Super-PACs statutory reforms
//   5. Enactment/Repeal handler with automatic Congress & EV synchronization
// ============================================================================

(function TrifectaReformsCoreModule(root) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Canonical 2020 Census Apportionment Populations (50 States + DC) & Regions
  // --------------------------------------------------------------------------

  const DEFAULT_STATE_POPULATIONS = {
    CA: 39576757, TX: 29183290, FL: 21570527, NY: 20215751, PA: 13011844,
    IL: 12822739, OH: 11808848, GA: 10725274, NC: 10453948, MI: 10084442,
    NJ: 9294493,  VA: 8654542,  WA: 7715946,  AZ: 7158923,  MA: 7033469,
    TN: 6916897,  IN: 6790280,  MD: 6185278,  MO: 6160281,  WI: 5897473,
    CO: 5782171,  MN: 5709752,  SC: 5124712,  AL: 5030053,  LA: 4661468,
    KY: 4509342,  OR: 4241500,  OK: 3963516,  CT: 3608298,  UT: 3275252,
    IA: 3192406,  NV: 3108462,  AR: 3013756,  MS: 2963914,  KS: 2940865,
    NM: 2120220,  NE: 1963333,  ID: 1841377,  WV: 1795045,  HI: 1460137,
    NH: 1379089,  ME: 1363582,  MT: 1085407,  RI: 1098163,  DE: 990837,
    SD: 887770,   ND: 779702,   AK: 736081,   VT: 643503,   WY: 577719,
  };

  const DC_DEFAULT_POPULATION = 689545;

  // Ordered by 2020 Census population rank (Sabato Proposal 1 & 3 tiers)
  const SABATO_TOP_10_STATES = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
  const SABATO_NEXT_15_STATES = ['NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MD', 'MO', 'WI', 'CO', 'MN', 'SC', 'AL', 'LA'];
  const SABATO_TOP_15_STATES = [...SABATO_TOP_10_STATES, ...SABATO_NEXT_15_STATES.slice(0, 5)];

  const STATE_MACRO_REGIONS = {
    Northeast: ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
    South: ['AL', 'AR', 'DC', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'WV'],
    Midwest: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'],
    West: ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NM', 'NV', 'OR', 'UT', 'WA', 'WY'],
  };

  const PRIMARY_REGIONS = ['Northeast', 'South', 'Midwest', 'West'];

  const APPORTIONMENT_MODES = {
    standard_435: { id: 'standard_435', totalSeats: 435, label: 'Standard 435-Seat House' },
    wyoming_rule: { id: 'wyoming_rule', totalSeats: 573, label: 'Wyoming Rule (573 Seats)' },
    cube_root_rule: { id: 'cube_root_rule', totalSeats: 692, label: 'Cube Root Rule (692 Seats)' },
    sabato_1000: { id: 'sabato_1000', totalSeats: 1000, label: 'Sabato Expanded House (1,000 Seats)' },
  };

  const APPORTIONMENT_CONFIG = {
    // Switchable to true later to derive Wyoming Rule total dynamically from live statePopulations
    dynamicWyomingPop: false,
  };

  // --------------------------------------------------------------------------
  // 2. Reform Catalog (5 Sabato Proposals + House Expansion + Turnout/Finance)
  // --------------------------------------------------------------------------

  const TRIFECTA_REFORM_CATALOG = [
    {
      id: 'sabato_senate_136',
      category: 'sabato',
      proposalNumber: 1,
      name: 'Sabato Proposal I: Expanded 136-Seat U.S. Senate',
      shortLabel: '136-Seat Senate',
      constitutional: true,
      reversible: true,
      repealId: 'repeal_sabato_senate_136',
      summary: 'Expands the U.S. Senate to 136 seats (+2 each for top 10 populous states, +1 each for next 15, +1 for D.C.; majority 69) and admits former Presidents/VPs as honorary National Senators.',
      effectsSummary: 'Senate: 100 -> 136 seats · Majority: 69 · D.C. +1 Senator · Honorary National Senators',
    },
    {
      id: 'sabato_house_1000',
      category: 'sabato',
      proposalNumber: 2,
      name: 'Sabato Proposal II: 1,000-Seat House & Nonpartisan Redistricting',
      shortLabel: '1,000-Seat House',
      constitutional: true,
      reversible: true,
      repealId: 'standard_435',
      summary: 'Reapportions the U.S. House to 1,000 seats via Huntington-Hill and mandates nonpartisan redistricting nationwide, locking out partisan gerrymandering.',
      effectsSummary: 'House: 1,000 seats · Majority: 501 · Mandatory Nonpartisan Redistricting',
    },
    {
      id: 'sabato_mended_ec',
      category: 'sabato',
      proposalNumber: 3,
      name: 'Sabato Proposal III: Mended Electoral College',
      shortLabel: 'Mended Electoral College',
      constitutional: true,
      reversible: true,
      repealId: 'repeal_sabato_mended_ec',
      summary: 'Preserves state-by-state Electoral College contests while adding population-weighted bonus electors to the 15 most populous states to sharply reduce EV/popular-vote splits.',
      effectsSummary: 'Adds population-weighted bonus electors across Top 15 populous states',
    },
    {
      id: 'sabato_regional_primaries',
      category: 'sabato',
      proposalNumber: 4,
      name: 'Sabato Proposal IV: Rotating 4-Month Regional Lottery Primaries',
      shortLabel: 'Regional Lottery Primaries',
      constitutional: false,
      reversible: true,
      repealId: 'repeal_sabato_regional_primaries',
      summary: 'Replaces Iowa/New Hampshire front-loading with a deterministic per-cycle lottery ordering 4 regional primary waves (Northeast, South, Midwest, West).',
      effectsSummary: 'Eliminates single-state front-loading · 4 rotating regional primary waves',
    },
    {
      id: 'sabato_term_cycle_overhaul',
      category: 'sabato',
      proposalNumber: 5,
      name: 'Sabato Proposal V: 6-Year Term & Congressional Cycle Overhaul',
      shortLabel: 'Term & Cycle Overhaul',
      constitutional: true,
      reversible: true,
      repealId: 'repeal_sabato_term_cycle_overhaul',
      summary: 'Institutes a 6-year Presidential term (with optional +2 retention referendum flag), syncs Senate elections to Presidential cycles, imposes 4-House/2-Senate term limits, and cuts campaign burn by 25% via partial public financing.',
      effectsSummary: '6-Yr Presidency (+2 retention flag) · Synced Senate · 4H/2S Term Limits · -25% Burn',
    },
    {
      id: 'wyoming_rule',
      category: 'apportionment',
      name: 'House Expansion: The Wyoming Rule (573 Seats)',
      shortLabel: 'Wyoming Rule (573)',
      constitutional: false,
      reversible: true,
      repealId: 'standard_435',
      summary: 'Sizes the U.S. House so each district roughly equals the least populous state, expanding Congress to 573 seats (majority 287).',
      effectsSummary: 'House: 573 seats · Majority: 287 · Recalculates state EVs',
    },
    {
      id: 'cube_root_rule',
      category: 'apportionment',
      name: 'House Expansion: The Cube Root Rule (692 Seats)',
      shortLabel: 'Cube Root Rule (692)',
      constitutional: false,
      reversible: true,
      repealId: 'standard_435',
      summary: 'Expands the U.S. House to the cube root of the national population (692 seats; majority 347) via Huntington-Hill.',
      effectsSummary: 'House: 692 seats · Majority: 347 · Recalculates state EVs',
    },
    {
      id: 'standard_435',
      category: 'apportionment',
      name: 'Restore Standard 435-Seat House Apportionment',
      shortLabel: 'Restore 435 House',
      constitutional: false,
      reversible: false,
      summary: 'Restores the standard 435-seat U.S. House apportionment (majority 218).',
      effectsSummary: 'House: 435 seats · Majority: 218',
    },
    {
      id: 'compulsory_voting',
      category: 'statutory',
      name: 'Universal Civic Turnout: Compulsory Voting Act',
      shortLabel: 'Compulsory Voting',
      constitutional: false,
      reversible: true,
      repealId: 'repeal_compulsory_voting',
      summary: 'Mandates civic ballot participation nationwide, raising voter turnout to an 88%–92% floor and compressing turnout-gap swings by 65%.',
      effectsSummary: 'Turnout floor: 88%–92% · Turnout-gap swings compressed by 65%',
    },
    {
      id: 'repeal_compulsory_voting',
      category: 'repeal',
      name: 'Repeal Compulsory Voting Act',
      shortLabel: 'Repeal Compulsory Voting',
      constitutional: false,
      reversible: true,
      reverses: 'compulsory_voting',
      summary: 'Repeals federal mandatory voting requirements and restores voluntary turnout baselines.',
      effectsSummary: 'Restores baseline voluntary voter turnout',
    },
    {
      id: 'ban_super_pacs',
      category: 'statutory',
      name: 'Overturn Citizens United: Federal Super-PAC Ban',
      shortLabel: 'Ban Super-PACs',
      constitutional: true,
      reversible: true,
      repealId: 'repeal_super_pac_ban',
      summary: 'Prohibits independent-expenditure Super-PACs nationwide, completely disabling Super-PAC demands, fundraising pools, and attack spending.',
      effectsSummary: 'Completely disables Super-PACs, demands, and dark-money spend',
    },
    {
      id: 'repeal_super_pac_ban',
      category: 'repeal',
      name: 'Repeal Federal Super-PAC Ban (Re-Enable Super-PACs)',
      shortLabel: 'Re-Enable Super-PACs',
      constitutional: true,
      reversible: true,
      reverses: 'ban_super_pacs',
      summary: 'Lifts the federal prohibition on independent-expenditure Super-PACs and cleanly restores Super-PAC activity on subsequent turns.',
      effectsSummary: 'Re-enables Super-PACs, pools, demands, and UI panels',
    },
    {
      id: 'repeal_sabato_senate_136',
      category: 'repeal',
      name: 'Restore 100-Seat U.S. Senate',
      shortLabel: 'Restore 100 Senate',
      constitutional: true,
      reverses: 'sabato_senate_136',
      summary: 'Restores the standard 2-Senators-per-state, 100-seat U.S. Senate (majority 51).',
      effectsSummary: 'Senate: 100 seats · Majority: 51',
    },
    {
      id: 'repeal_sabato_mended_ec',
      category: 'repeal',
      name: 'Restore Standard Electoral College Allocation',
      shortLabel: 'Restore Standard EC',
      constitutional: true,
      reverses: 'sabato_mended_ec',
      summary: 'Removes Mended EC population bonus electors and restores standard House + Senate EV counts.',
      effectsSummary: 'Removes bonus EVs from Top 15 populous states',
    },
    {
      id: 'repeal_sabato_regional_primaries',
      category: 'repeal',
      name: 'Restore Traditional Primary Calendar',
      shortLabel: 'Restore Primary Order',
      constitutional: false,
      reverses: 'sabato_regional_primaries',
      summary: 'Reverts rotating regional primary blocks back to the traditional primary schedule.',
      effectsSummary: 'Restores traditional early-state primary order',
    },
    {
      id: 'repeal_sabato_term_cycle_overhaul',
      category: 'repeal',
      name: 'Restore 4-Year Presidential & Staggered Senate Cycles',
      shortLabel: 'Restore 4-Yr Cycles',
      constitutional: true,
      reverses: 'sabato_term_cycle_overhaul',
      summary: 'Reverts Presidential term length to 4 years, restores staggered Senate classes, removes federal term limits, and restores normal campaign burn.',
      effectsSummary: 'Restores 4-yr Presidency, staggered Senate, no term limits, 1.0x burn',
    },
  ];

  // --------------------------------------------------------------------------
  // 3. Utility Helpers & Federal Reform State Normalization
  // --------------------------------------------------------------------------

  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
  const round = (n, places = 2) => {
    const f = 10 ** places;
    return Math.round((Number(n) || 0) * f) / f;
  };

  function fnvHash(str) {
    let h = 2166136261 >>> 0;
    const s = String(str ?? '');
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h / 4294967296;
  }

  function resolvePlayerIdentity(game) {
    if (game?.player?.custom) return 'player';
    if (game?.player?.id && game.player.id !== 'player') return game.player.id;
    if (game?.player?.baseTemplateId) return game.player.baseTemplateId;
    return 'people';
  }

  function resolveCanonicalParty(partyId, game) {
    if (!partyId || partyId === 'player') {
      const resolved = resolvePlayerIdentity(game);
      return resolved;
    }
    return partyId;
  }

  function partyMatches(candidateParty, targetParty, game) {
    if (!candidateParty || !targetParty) return false;
    if (candidateParty === targetParty) return true;
    const canonCand = resolveCanonicalParty(candidateParty, game);
    const canonTarget = resolveCanonicalParty(targetParty, game);
    return canonCand === canonTarget;
  }

  function getDefaultFederalReforms() {
    return {
      houseApportionmentMode: 'standard_435',
      totalHouseSeats: 435,
      houseMajorityThreshold: 218,
      senateExpanded136: false,
      totalSenateSeats: 100,
      senateMajorityThreshold: 51,
      mandatoryNonpartisanRedistricting: false,
      mendedElectoralCollege: false,
      regionalPrimaries: false,
      termCycleOverhaul: false,
      presidentialTermYears: 4,
      presidentialRetentionReferendum: false,
      syncedSenateCycles: false,
      congressionalTermLimits: { enabled: false, houseMaxTerms: null, senateMaxTerms: null },
      publicCongressionalFinancing: false,
      campaignBurnMultiplier: 1.0,
      compulsoryVoting: false,
      superPacsBanned: false,
      nationalSenators: [],
      apportionedHouseSeats: null,
      senateSeatsByState: null,
      electoralVotesByState: null,
      bonusEvByState: {},
      totalEv: 538,
      evMajorityThreshold: 270,
      history: [],
    };
  }

  function ensureFederalReforms(game) {
    if (!game || typeof game !== 'object') return getDefaultFederalReforms();
    const defaults = getDefaultFederalReforms();
    game.federalReforms = {
      ...defaults,
      ...(game.federalReforms || {}),
      congressionalTermLimits: {
        ...defaults.congressionalTermLimits,
        ...(game.federalReforms?.congressionalTermLimits || {}),
      },
      history: Array.isArray(game.federalReforms?.history) ? [...game.federalReforms.history] : [],
      nationalSenators: Array.isArray(game.federalReforms?.nationalSenators) ? [...game.federalReforms.nationalSenators] : [],
      bonusEvByState: { ...(game.federalReforms?.bonusEvByState || {}) },
    };
    return game.federalReforms;
  }

  function resolveStatePopulations(gameOrPops = null) {
    const out = { ...DEFAULT_STATE_POPULATIONS };
    let sourcePops = null;

    if (gameOrPops && typeof gameOrPops === 'object') {
      if (Array.isArray(gameOrPops.voterModel?.states)) {
        sourcePops = {};
        gameOrPops.voterModel.states.forEach((st) => {
          const sid = st.stateId || st.id;
          if (!sid || sid === 'DC') return;
          const pop = Number(st.cvap || st.population || st.representedVoters);
          if (Number.isFinite(pop) && pop > 0) sourcePops[sid] = pop;
        });
      } else if (gameOrPops.statePopulations && typeof gameOrPops.statePopulations === 'object') {
        sourcePops = gameOrPops.statePopulations;
      } else if (!gameOrPops.federalReforms && !gameOrPops.player && !gameOrPops.sittingMembers) {
        // Passed statePopulations map directly
        sourcePops = gameOrPops;
      }
    }

    if (sourcePops) {
      Object.keys(DEFAULT_STATE_POPULATIONS).forEach((sid) => {
        const val = Number(sourcePops[sid]);
        if (Number.isFinite(val) && val > 0) out[sid] = val;
      });
    }
    return out;
  }

  // --------------------------------------------------------------------------
  // 4. House Apportionment Engine (Huntington-Hill Method of Equal Proportions)
  // --------------------------------------------------------------------------

  function computeHouseApportionment(mode = 'standard_435', statePopulations = null, options = {}) {
    const resolvedMode = APPORTIONMENT_MODES[mode] ? mode : 'standard_435';
    const pops = resolveStatePopulations(statePopulations);
    const dynamicFlag = options.dynamicWyomingPop !== undefined
      ? Boolean(options.dynamicWyomingPop)
      : APPORTIONMENT_CONFIG.dynamicWyomingPop;

    let totalSeats = APPORTIONMENT_MODES[resolvedMode].totalSeats;
    if (resolvedMode === 'wyoming_rule' && dynamicFlag) {
      const popValues = Object.values(pops).filter((v) => Number.isFinite(v) && v > 0);
      const minPop = Math.min(...popValues);
      const sumPop = popValues.reduce((s, v) => s + v, 0);
      if (minPop > 0) {
        totalSeats = Math.max(50, Math.round(sumPop / minPop));
      }
    }

    const stateIds = Object.keys(DEFAULT_STATE_POPULATIONS);
    const seatsByState = {};
    stateIds.forEach((sid) => { seatsByState[sid] = 1; });

    let assigned = stateIds.length; // 50 initial seats
    while (assigned < totalSeats) {
      let bestState = null;
      let bestPriority = -1;
      for (let i = 0; i < stateIds.length; i += 1) {
        const sid = stateIds[i];
        const s = seatsByState[sid];
        const priority = pops[sid] / Math.sqrt(s * (s + 1));
        if (
          priority > bestPriority
          || (priority === bestPriority && (pops[sid] > (pops[bestState] || 0) || (pops[sid] === pops[bestState] && sid < bestState)))
        ) {
          bestPriority = priority;
          bestState = sid;
        }
      }
      if (!bestState) break;
      seatsByState[bestState] += 1;
      assigned += 1;
    }

    return {
      mode: resolvedMode,
      totalSeats,
      majorityThreshold: Math.floor(totalSeats / 2) + 1,
      seatsByState,
      dynamicWyomingPop: dynamicFlag,
    };
  }

  function getStateHouseSeatCount(game, stateId) {
    if (!stateId || stateId === 'DC') return 0;
    const fromReform = game?.federalReforms?.apportionedHouseSeats?.[stateId];
    if (Number.isFinite(fromReform) && fromReform > 0) return fromReform;
    const fromGame = game?.apportionedHouseSeats?.[stateId];
    if (Number.isFinite(fromGame) && fromGame > 0) return fromGame;
    const mode = game?.federalReforms?.houseApportionmentMode || 'standard_435';
    const app = computeHouseApportionment(mode, game);
    return app.seatsByState[stateId] || 1;
  }

  function getHouseTotalSeats(game) {
    if (Number.isFinite(game?.federalReforms?.totalHouseSeats) && game.federalReforms.totalHouseSeats > 0) {
      return game.federalReforms.totalHouseSeats;
    }
    const mode = game?.federalReforms?.houseApportionmentMode || 'standard_435';
    return APPORTIONMENT_MODES[mode]?.totalSeats || 435;
  }

  function getHouseMajorityThreshold(game) {
    if (Number.isFinite(game?.federalReforms?.houseMajorityThreshold) && game.federalReforms.houseMajorityThreshold > 0) {
      return game.federalReforms.houseMajorityThreshold;
    }
    return Math.floor(getHouseTotalSeats(game) / 2) + 1;
  }

  // --------------------------------------------------------------------------
  // 5. Senate 136-Seat Expansion & Honorary National Senators (Sabato #1)
  // --------------------------------------------------------------------------

  function computeSenateApportionment(expanded136 = false) {
    const seatsByState = {};
    const stateIds = Object.keys(DEFAULT_STATE_POPULATIONS);

    if (!expanded136) {
      stateIds.forEach((sid) => { seatsByState[sid] = 2; });
      seatsByState.DC = 0;
      return {
        expanded136: false,
        totalSeats: 100,
        majorityThreshold: 51,
        seatsByState,
        dcSeats: 0,
      };
    }

    const top10 = new Set(SABATO_TOP_10_STATES);
    const next15 = new Set(SABATO_NEXT_15_STATES);
    stateIds.forEach((sid) => {
      if (top10.has(sid)) seatsByState[sid] = 4;
      else if (next15.has(sid)) seatsByState[sid] = 3;
      else seatsByState[sid] = 2;
    });
    seatsByState.DC = 1;

    const totalSeats = Object.values(seatsByState).reduce((s, n) => s + n, 0);
    return {
      expanded136: true,
      totalSeats, // 136
      majorityThreshold: Math.floor(totalSeats / 2) + 1, // 69
      seatsByState,
      dcSeats: 1,
    };
  }

  function getSenateTotalSeats(game) {
    if (game?.federalReforms?.senateExpanded136) return 136;
    if (Number.isFinite(game?.federalReforms?.totalSenateSeats) && game.federalReforms.totalSenateSeats > 0) {
      return game.federalReforms.totalSenateSeats;
    }
    return 100;
  }

  function getSenateMajorityThreshold(game) {
    if (game?.federalReforms?.senateExpanded136) return 69;
    if (Number.isFinite(game?.federalReforms?.senateMajorityThreshold) && game.federalReforms.senateMajorityThreshold > 0) {
      return game.federalReforms.senateMajorityThreshold;
    }
    return Math.floor(getSenateTotalSeats(game) / 2) + 1;
  }

  function getHonoraryNationalSenators(game = {}) {
    const senators = [];
    const seen = new Set();
    const pushHonorary = (name, party, role, yearEnded) => {
      if (!name) return;
      const key = `${name}`.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      senators.push({
        id: `national-senator-${key.replace(/[^a-z0-9]+/g, '-')}`,
        name,
        party: party || 'independent',
        role: role || 'Former President / VP',
        honorary: true,
        stateId: 'NATIONAL',
        office: 'senate',
        yearEnded: yearEnded || null,
      });
    };

    const lists = [
      ...(Array.isArray(game.formerPresidents) ? game.formerPresidents : []),
      ...(Array.isArray(game.formerVicePresidents) ? game.formerVicePresidents : []),
      ...(Array.isArray(game.presidentHistory) ? game.presidentHistory : []),
      ...(Array.isArray(game.federalReforms?.nationalSenators) ? game.federalReforms.nationalSenators : []),
    ];
    lists.forEach((rec) => {
      if (typeof rec === 'string') {
        pushHonorary(rec, 'independent', 'Former National Executive');
      } else if (rec && typeof rec === 'object') {
        pushHonorary(rec.name || rec.nominee || rec.president, rec.party || rec.partyId, rec.role || rec.title, rec.year || rec.yearEnded);
      }
    });

    // Include living contemporary baseline former national leaders if list is otherwise empty
    if (senators.length === 0) {
      pushHonorary('Barack Obama', 'people', 'Former President', 2017);
      pushHonorary('Joe Biden', 'people', 'Former President', 2025);
      pushHonorary('Donald Trump', 'heritage', 'Former President', 2029);
      pushHonorary('Kamala Harris', 'people', 'Former Vice President', 2025);
      pushHonorary('Mike Pence', 'heritage', 'Former Vice President', 2021);
    }

    return senators;
  }

  // --------------------------------------------------------------------------
  // 6. Sabato Mended Electoral College & Total EV Sync
  // --------------------------------------------------------------------------

  function computeElectoralVotes(game = {}, houseSeatsByState = null, senateSeatsByState = null, statePopulations = null) {
    const reforms = game?.federalReforms || {};
    const hMap = houseSeatsByState
      || reforms.apportionedHouseSeats
      || computeHouseApportionment(reforms.houseApportionmentMode || 'standard_435', statePopulations || game).seatsByState;
    const sMap = senateSeatsByState
      || reforms.senateSeatsByState
      || computeSenateApportionment(Boolean(reforms.senateExpanded136)).seatsByState;

    const pops = resolveStatePopulations(statePopulations || game);
    const top15 = Object.keys(pops)
      .sort((a, b) => pops[b] - pops[a])
      .slice(0, 15);

    const bonusEvByState = {};
    if (reforms.mendedElectoralCollege) {
      // Distribute 75 population-weighted bonus electors across Top 15 populous states (min 1 each)
      const totalBonusPool = 75;
      const top15PopSum = top15.reduce((s, sid) => s + pops[sid], 0) || 1;
      let allocated = 0;
      top15.forEach((sid) => {
        const share = Math.max(1, Math.floor((pops[sid] / top15PopSum) * totalBonusPool));
        bonusEvByState[sid] = share;
        allocated += share;
      });
      const rems = top15
        .map((sid) => ({ sid, rem: ((pops[sid] / top15PopSum) * totalBonusPool) - bonusEvByState[sid] }))
        .sort((a, b) => b.rem - a.rem);
      for (let i = 0; allocated < totalBonusPool && i < rems.length; i += 1) {
        bonusEvByState[rems[i].sid] += 1;
        allocated += 1;
      }
    }

    const evByState = {};
    Object.keys(DEFAULT_STATE_POPULATIONS).forEach((sid) => {
      const h = Number(hMap[sid] || 1);
      const sen = Number(sMap[sid] ?? 2);
      const bonus = Number(bonusEvByState[sid] || 0);
      evByState[sid] = h + sen + bonus;
    });

    // D.C. always receives at least 3 EVs (23rd Amendment minimum = least populous state)
    const dcSenate = Number(sMap.DC || 0);
    evByState.DC = Math.max(3, 3 + dcSenate);

    const totalEv = Object.values(evByState).reduce((s, v) => s + v, 0);
    return {
      evByState,
      bonusEvByState,
      totalEv,
      evMajorityThreshold: Math.floor(totalEv / 2) + 1,
    };
  }

  // --------------------------------------------------------------------------
  // 7. Sabato Regional Lottery Primaries (Proposal #4)
  // --------------------------------------------------------------------------

  function getRegionalPrimarySchedule(seed = 2028, year = 2028) {
    const blocks = [...PRIMARY_REGIONS];
    // Deterministic Fisher-Yates lottery shuffle per seed & election year
    for (let i = blocks.length - 1; i > 0; i -= 1) {
      const r = fnvHash(`sabato_primary_lottery:${seed}:${year}:${i}`);
      const j = Math.floor(r * (i + 1)) % (i + 1);
      const tmp = blocks[i];
      blocks[i] = blocks[j];
      blocks[j] = tmp;
    }

    const monthLabels = ['March (Wave 1)', 'April (Wave 2)', 'May (Wave 3)', 'June (Wave 4)'];
    const waveByRegion = {};
    const waveByState = {};
    const waves = blocks.map((region, idx) => {
      const waveNum = idx + 1;
      const states = [...(STATE_MACRO_REGIONS[region] || [])];
      waveByRegion[region] = waveNum;
      states.forEach((sid) => { waveByState[sid] = waveNum; });
      return {
        wave: waveNum,
        monthLabel: monthLabels[idx],
        region,
        states,
      };
    });

    return {
      seed,
      year: Number(year || 2028),
      order: blocks,
      waves,
      waveByRegion,
      waveByState,
    };
  }

  // --------------------------------------------------------------------------
  // 8. Statutory Effects: Compulsory Voting & Super-PAC Ban Helpers
  // --------------------------------------------------------------------------

  function applyCompulsoryVotingTurnout(baseTurnout, game, options = {}) {
    const raw = Number(baseTurnout);
    if (!Number.isFinite(raw)) return baseTurnout;
    const isCompulsory = Boolean(game?.federalReforms?.compulsoryVoting);
    if (!isCompulsory) return raw;

    const isFractional = raw >= 0 && raw <= 1.0 && !options.forcePercent;
    const pct = isFractional ? raw * 100 : raw;

    // Raise baseline turnout to 88%–92% floor while compressing turnout-gap swings by 65%
    const rawDelta = Number(options.turnoutDelta ?? (pct - 60));
    const compressedDelta = rawDelta * 0.35; // 65% compression on turnout variance/swings
    const liftedPct = clamp(90.0 + compressedDelta * 0.12, 88.0, 92.0);
    const out = round(liftedPct, 2);

    return isFractional ? round(out / 100, 4) : out;
  }

  function isSuperPacsDisabled(game) {
    if (game?.federalReforms?.superPacsBanned) return true;
    if (game?.partySystems?.currentEraId === 'era_26_post_citizens_united') return true;
    return false;
  }

  // --------------------------------------------------------------------------
  // 9. Strict Nationwide Trifecta Control Gate
  // --------------------------------------------------------------------------

  function countFederalChamberSeats(game, partyId, chamber) {
    const target = resolveCanonicalParty(partyId, game);
    const playerCanon = resolvePlayerIdentity(game);

    // 1. Explicit chamber seat map override (for tests or precomputed tallies)
    const explicitMap = chamber === 'house'
      ? (game?.houseSeatsByParty || game?.lastElection?.houseSeats || game?.congress?.house)
      : (game?.senateSeatsByParty || game?.lastElection?.senateSeats || game?.congress?.senate);
    if (explicitMap && typeof explicitMap === 'object') {
      let sum = 0;
      Object.entries(explicitMap).forEach(([k, v]) => {
        if (partyMatches(k, target, game)) sum += Number(v || 0);
      });
      if (sum > 0 || Object.keys(explicitMap).length > 0) return sum;
    }

    // 2. Count sittingMembers for that office
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    const matchingMembers = sitting.filter((m) => {
      if (!m || m.office !== chamber) return false;
      const mParty = m.caucus || m.party || m.partyId;
      return partyMatches(mParty, target, game);
    });
    if (sitting.some((m) => m && m.office === chamber)) {
      if (chamber === 'house' && target === playerCanon && Number.isFinite(game?.seats)) {
        return Math.max(matchingMembers.length, Number(game.seats));
      }
      return matchingMembers.length;
    }

    // 3. Fallback to explicit cycle control snapshot only when no seat lists exist
    const pCtrl = game?.lastCycleControlByParty?.[target]
      || (partyMatches(partyId, 'player', game) ? game?.lastCycleControlByParty?.player : null);
    if (pCtrl && typeof pCtrl[chamber] === 'boolean') {
      return pCtrl[chamber]
        ? (chamber === 'house' ? getHouseMajorityThreshold(game) : getSenateMajorityThreshold(game))
        : 0;
    }

    if (chamber === 'house' && target === playerCanon && Number.isFinite(game?.seats)) {
      return Number(game.seats);
    }
    return 0;
  }

  function hasNationwideTrifecta(game, partyId = 'player') {
    if (!game || typeof game !== 'object') return false;
    const target = resolveCanonicalParty(partyId, game);

    // 1. Presidency control check
    const presHolder = game.presidentialWinner
      || game.governingParty
      || game.lastElection?.presidentialWinner
      || null;
    let controlsPres = false;
    if (presHolder) {
      controlsPres = partyMatches(presHolder, target, game);
    } else if (game.lastCycleControl?.pres && target === resolvePlayerIdentity(game)) {
      controlsPres = true;
    } else if (game.lastCycleControlByParty?.[target]?.pres) {
      controlsPres = true;
    }
    if (!controlsPres) return false;

    // 2. U.S. House majority check
    const houseThreshold = getHouseMajorityThreshold(game);
    let controlsHouse = false;
    if (game.houseMajority && partyMatches(game.houseMajority, target, game)) {
      controlsHouse = true;
    } else {
      const houseSeats = countFederalChamberSeats(game, target, 'house');
      controlsHouse = houseSeats >= houseThreshold;
    }
    if (!controlsHouse) return false;

    // 3. U.S. Senate majority check
    const senateThreshold = getSenateMajorityThreshold(game);
    let controlsSenate = false;
    if (game.senateMajority && partyMatches(game.senateMajority, target, game)) {
      controlsSenate = true;
    } else {
      const senateSeats = countFederalChamberSeats(game, target, 'senate');
      controlsSenate = senateSeats >= senateThreshold;
    }

    return Boolean(controlsPres && controlsHouse && controlsSenate);
  }

  // --------------------------------------------------------------------------
  // 10. Enactment & Repeal Handler + Downstream Sync
  // --------------------------------------------------------------------------

  function syncFederalReformsDownstream(game) {
    const reforms = ensureFederalReforms(game);
    const pops = resolveStatePopulations(game);

    const houseApp = computeHouseApportionment(reforms.houseApportionmentMode || 'standard_435', pops);
    const senApp = computeSenateApportionment(Boolean(reforms.senateExpanded136));
    const evApp = computeElectoralVotes(game, houseApp.seatsByState, senApp.seatsByState, pops);

    reforms.apportionedHouseSeats = houseApp.seatsByState;
    reforms.totalHouseSeats = houseApp.totalSeats;
    reforms.houseMajorityThreshold = houseApp.majorityThreshold;

    reforms.senateSeatsByState = senApp.seatsByState;
    reforms.totalSenateSeats = senApp.totalSeats;
    reforms.senateMajorityThreshold = senApp.majorityThreshold;

    reforms.electoralVotesByState = evApp.evByState;
    reforms.bonusEvByState = evApp.bonusEvByState;
    reforms.totalEv = evApp.totalEv;
    reforms.evMajorityThreshold = evApp.evMajorityThreshold;

    if (reforms.senateExpanded136) {
      reforms.nationalSenators = getHonoraryNationalSenators(game);
    } else {
      reforms.nationalSenators = [];
    }

    // Mirror onto common game fields read by engine/maps/UI
    game.apportionedHouseSeats = { ...houseApp.seatsByState };
    game.totalHouseSeats = houseApp.totalSeats;
    game.houseMajorityThreshold = houseApp.majorityThreshold;
    game.senateSeatsByState = { ...senApp.seatsByState };
    game.totalSenateSeats = senApp.totalSeats;
    game.senateMajorityThreshold = senApp.majorityThreshold;
    game.electoralVotesByState = { ...evApp.evByState };
    game.totalEv = evApp.totalEv;
    game.evMajorityThreshold = evApp.evMajorityThreshold;

    if (Array.isArray(game.states)) {
      game.states = game.states.map((st) => ({
        ...st,
        districtCount: st.id === 'DC' ? 0 : (houseApp.seatsByState[st.id] ?? st.districtCount ?? 1),
        senateSeats: senApp.seatsByState[st.id] ?? (st.id === 'DC' ? 0 : 2),
        ev: evApp.evByState[st.id] ?? st.ev ?? 3,
      }));
    }

    return { houseApp, senApp, evApp };
  }

  function applyTrifectaReform(game, reformId, actorPartyId = 'player') {
    if (!game || typeof game !== 'object') {
      return { ok: false, enacted: false, error: 'Invalid game state.' };
    }
    const reform = TRIFECTA_REFORM_CATALOG.find((r) => r.id === reformId);
    if (!reform) {
      return { ok: false, enacted: false, error: `Unknown federal reform: ${reformId}` };
    }

    const actor = resolveCanonicalParty(actorPartyId, game);
    if (!hasNationwideTrifecta(game, actor)) {
      return {
        ok: false,
        enacted: false,
        error: `Nationwide Trifecta required: ${actor} must control the Presidency, U.S. House (${getHouseMajorityThreshold(game)}+), and U.S. Senate (${getSenateMajorityThreshold(game)}+).`,
      };
    }

    const reforms = ensureFederalReforms(game);
    const year = Number(game.year || 2028);

    switch (reformId) {
      case 'sabato_senate_136':
        reforms.senateExpanded136 = true;
        reforms.totalSenateSeats = 136;
        reforms.senateMajorityThreshold = 69;
        break;
      case 'repeal_sabato_senate_136':
        reforms.senateExpanded136 = false;
        reforms.totalSenateSeats = 100;
        reforms.senateMajorityThreshold = 51;
        break;

      case 'sabato_house_1000':
        reforms.houseApportionmentMode = 'sabato_1000';
        reforms.mandatoryNonpartisanRedistricting = true;
        break;
      case 'wyoming_rule':
        reforms.houseApportionmentMode = 'wyoming_rule';
        break;
      case 'cube_root_rule':
        reforms.houseApportionmentMode = 'cube_root_rule';
        break;
      case 'standard_435':
        reforms.houseApportionmentMode = 'standard_435';
        reforms.mandatoryNonpartisanRedistricting = false;
        break;

      case 'sabato_mended_ec':
        reforms.mendedElectoralCollege = true;
        break;
      case 'repeal_sabato_mended_ec':
        reforms.mendedElectoralCollege = false;
        break;

      case 'sabato_regional_primaries':
        reforms.regionalPrimaries = true;
        reforms.regionalPrimarySchedule = getRegionalPrimarySchedule(game.seed || 2028, year);
        break;
      case 'repeal_sabato_regional_primaries':
        reforms.regionalPrimaries = false;
        delete reforms.regionalPrimarySchedule;
        break;

      case 'sabato_term_cycle_overhaul':
        reforms.termCycleOverhaul = true;
        reforms.presidentialTermYears = 6;
        reforms.presidentialRetentionReferendum = true;
        reforms.syncedSenateCycles = true;
        reforms.congressionalTermLimits = { enabled: true, houseMaxTerms: 4, senateMaxTerms: 2 };
        reforms.publicCongressionalFinancing = true;
        reforms.campaignBurnMultiplier = 0.75;
        break;
      case 'repeal_sabato_term_cycle_overhaul':
        reforms.termCycleOverhaul = false;
        reforms.presidentialTermYears = 4;
        reforms.presidentialRetentionReferendum = false;
        reforms.syncedSenateCycles = false;
        reforms.congressionalTermLimits = { enabled: false, houseMaxTerms: null, senateMaxTerms: null };
        reforms.publicCongressionalFinancing = false;
        reforms.campaignBurnMultiplier = 1.0;
        break;

      case 'compulsory_voting':
        reforms.compulsoryVoting = true;
        break;
      case 'repeal_compulsory_voting':
        reforms.compulsoryVoting = false;
        break;

      case 'ban_super_pacs':
        reforms.superPacsBanned = true;
        if (Array.isArray(game.superPacs)) {
          reforms._pausedSuperPacs = JSON.parse(JSON.stringify(game.superPacs));
          game.superPacs = game.superPacs.map((pac) => ({
            ...pac,
            activeDemand: null,
            banned: true,
          }));
        }
        break;
      case 'repeal_super_pac_ban':
        reforms.superPacsBanned = false;
        if (Array.isArray(reforms._pausedSuperPacs) && reforms._pausedSuperPacs.length > 0) {
          game.superPacs = reforms._pausedSuperPacs.map((pac) => ({
            ...pac,
            banned: false,
          }));
          delete reforms._pausedSuperPacs;
        } else if (Array.isArray(game.superPacs)) {
          game.superPacs = game.superPacs.map((pac) => ({ ...pac, banned: false }));
        }
        break;

      default:
        break;
    }

    const synced = syncFederalReformsDownstream(game);
    const logRecord = {
      id: `reform-${reformId}-${year}-${reforms.history.length + 1}`,
      reformId,
      name: reform.name,
      category: reform.category,
      actorPartyId: actor,
      year,
      turn: game.chairTurn ?? game.generalCampaignTurn ?? 0,
      summary: reform.effectsSummary,
    };
    reforms.history.push(logRecord);

    if (Array.isArray(game.log)) {
      game.log.unshift(`[Federal Trifecta Reform ${year}] ${actor}: Enacted "${reform.name}" (${reform.effectsSummary}).`);
    }
    game.lastNote = `Federal Trifecta Reform enacted: ${reform.name}.`;

    return {
      ok: true,
      enacted: true,
      reform,
      federalReforms: reforms,
      apportionment: synced.houseApp,
      senate: synced.senApp,
      electoralCollege: synced.evApp,
      logRecord,
    };
  }

  function isNonpartisanRedistrictingMandated(game) {
    return Boolean(game?.federalReforms?.mandatoryNonpartisanRedistricting);
  }

  function getCampaignBurnMultiplier(game) {
    return Number(game?.federalReforms?.campaignBurnMultiplier || 1.0);
  }

  function getPresidentialTermYears(game) {
    return Number(game?.federalReforms?.presidentialTermYears || 4);
  }

  // --------------------------------------------------------------------------
  // 11. Export Public API
  // --------------------------------------------------------------------------

  const api = {
    TRIFECTA_REFORM_CATALOG,
    APPORTIONMENT_MODES,
    APPORTIONMENT_CONFIG,
    DEFAULT_STATE_POPULATIONS,
    DC_DEFAULT_POPULATION,
    SABATO_TOP_10_STATES,
    SABATO_NEXT_15_STATES,
    SABATO_TOP_15_STATES,
    STATE_MACRO_REGIONS,
    PRIMARY_REGIONS,
    hasNationwideTrifecta,
    computeHouseApportionment,
    computeSenateApportionment,
    computeElectoralVotes,
    getStateHouseSeatCount,
    getHouseTotalSeats,
    getHouseMajorityThreshold,
    getSenateTotalSeats,
    getSenateMajorityThreshold,
    getHonoraryNationalSenators,
    getRegionalPrimarySchedule,
    applyCompulsoryVotingTurnout,
    isSuperPacsDisabled,
    isNonpartisanRedistrictingMandated,
    getCampaignBurnMultiplier,
    getPresidentialTermYears,
    ensureFederalReforms,
    syncFederalReformsDownstream,
    applyTrifectaReform,
  };

  if (typeof window !== 'undefined') {
    window.TrifectaReformsCore = api;
  }
  root.TrifectaReformsCore = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
