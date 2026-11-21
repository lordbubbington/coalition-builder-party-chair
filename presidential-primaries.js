/**
 * Coalition Builder: Party Chair — Version 0.16.1
 * Module: presidential-primaries.js
 *
 * Presidential Primaries & Nominating Conventions Engine (Cluster A: REQ-195 through REQ-203)
 *
 * Requirements Covered:
 * - REQ-195: Incumbent Vulnerability Triggers & Challenger Emergence (<40% approval, env >= 8, faction crisis)
 * - REQ-196: Incumbent Primary Contest & Party-Fracture Fallout (Step-Aside Dilemma & Bruised Incumbent -3.5% penalty)
 * - REQ-197: Presidential Primary Field & Candidate Generation (3-5 contenders, home-state +8.0%/+3.0%, stance drift)
 * - REQ-198: Phased Primary Calendar Engine (Wave 1 Early States, Wave 2 Super Tuesday, Wave 3 Late Consolidation)
 * - REQ-199: State Delegate Allocation & Live Delegate Tracker (15% threshold, 2,000 to clinch, 3,979 total delegates)
 * - REQ-200: Chair Primary Strategy & Lane Consolidation (Neutrality, Back Candidate with $3M, Broker Consolidation)
 * - REQ-201: Factional Convention Delegates & Platform Floor Votes (3 plank votes, +/-1.0 slider shift, +7/-4 happiness)
 * - REQ-202: VP Ticket Selection & Keynote Unity Brokering (Runner-up/faction balancing, +4.0%/+1.5% lift, keynote bounce)
 * - REQ-203: Contested / Brokered Multi-Ballot Convention (Kingmaker deals, concessions, compromise fallback)
 *
 * Architecture:
 * - Pure computation, state machine, delegate math, and convention broker logic.
 * - Zero DOM dependencies. Safe for Node.js test harnesses and browser runtimes.
 */

(function PresidentialPrimariesModule() {
  'use strict';

  // Total pledged delegates across all 51 jurisdictions: 3,979. Majority to clinch: 2,000.
  const TOTAL_DELEGATES = 3979;
  const CLINCH_THRESHOLD = 2000;
  const VIABILITY_THRESHOLD = 0.15; // 15.0% state vote threshold

  // 51 jurisdictions mapped by calendar wave, delegate allotment, and major-bonus status
  const STATE_DELEGATE_SCHEDULE = {
    // Wave 1: Early States (February) — 4 states, 186 delegates
    IA: { stateId: 'IA', name: 'Iowa', wave: 1, delegates: 40, region: 'Midwest', majorBonus: false },
    NH: { stateId: 'NH', name: 'New Hampshire', wave: 1, delegates: 33, region: 'Northeast', majorBonus: false },
    NV: { stateId: 'NV', name: 'Nevada', wave: 1, delegates: 48, region: 'West', majorBonus: false },
    SC: { stateId: 'SC', name: 'South Carolina', wave: 1, delegates: 65, region: 'South', majorBonus: false },

    // Wave 2: Super Tuesday (March) — 15 states, 1,645 delegates (~41.3% of total)
    CA: { stateId: 'CA', name: 'California', wave: 2, delegates: 494, region: 'West', majorBonus: false },
    TX: { stateId: 'TX', name: 'Texas', wave: 2, delegates: 273, region: 'South', majorBonus: true },
    NC: { stateId: 'NC', name: 'North Carolina', wave: 2, delegates: 130, region: 'South', majorBonus: false },
    VA: { stateId: 'VA', name: 'Virginia', wave: 2, delegates: 119, region: 'South', majorBonus: false },
    MA: { stateId: 'MA', name: 'Massachusetts', wave: 2, delegates: 116, region: 'Northeast', majorBonus: false },
    MN: { stateId: 'MN', name: 'Minnesota', wave: 2, delegates: 92, region: 'Midwest', majorBonus: false },
    CO: { stateId: 'CO', name: 'Colorado', wave: 2, delegates: 86, region: 'West', majorBonus: false },
    TN: { stateId: 'TN', name: 'Tennessee', wave: 2, delegates: 85, region: 'South', majorBonus: false },
    AL: { stateId: 'AL', name: 'Alabama', wave: 2, delegates: 60, region: 'South', majorBonus: false },
    AR: { stateId: 'AR', name: 'Arkansas', wave: 2, delegates: 40, region: 'South', majorBonus: false },
    ME: { stateId: 'ME', name: 'Maine', wave: 2, delegates: 32, region: 'Northeast', majorBonus: false },
    OK: { stateId: 'OK', name: 'Oklahoma', wave: 2, delegates: 40, region: 'South', majorBonus: false },
    UT: { stateId: 'UT', name: 'Utah', wave: 2, delegates: 34, region: 'West', majorBonus: false },
    VT: { stateId: 'VT', name: 'Vermont', wave: 2, delegates: 24, region: 'Northeast', majorBonus: false },
    AK: { stateId: 'AK', name: 'Alaska', wave: 2, delegates: 20, region: 'West', majorBonus: false },

    // Wave 3: Late Consolidation States (April–June) — 32 jurisdictions, 2,148 delegates
    PA: { stateId: 'PA', name: 'Pennsylvania', wave: 3, delegates: 153, region: 'Northeast', majorBonus: false },
    OH: { stateId: 'OH', name: 'Ohio', wave: 3, delegates: 117, region: 'Midwest', majorBonus: true },
    FL: { stateId: 'FL', name: 'Florida', wave: 3, delegates: 205, region: 'South', majorBonus: true },
    NY: { stateId: 'NY', name: 'New York', wave: 3, delegates: 225, region: 'Northeast', majorBonus: false },
    WI: { stateId: 'WI', name: 'Wisconsin', wave: 3, delegates: 80, region: 'Midwest', majorBonus: false },
    MI: { stateId: 'MI', name: 'Michigan', wave: 3, delegates: 115, region: 'Midwest', majorBonus: false },
    GA: { stateId: 'GA', name: 'Georgia', wave: 3, delegates: 102, region: 'South', majorBonus: false },
    IL: { stateId: 'IL', name: 'Illinois', wave: 3, delegates: 143, region: 'Midwest', majorBonus: false },
    NJ: { stateId: 'NJ', name: 'New Jersey', wave: 3, delegates: 103, region: 'Northeast', majorBonus: false },
    WA: { stateId: 'WA', name: 'Washington', wave: 3, delegates: 88, region: 'West', majorBonus: false },
    AZ: { stateId: 'AZ', name: 'Arizona', wave: 3, delegates: 70, region: 'West', majorBonus: false },
    IN: { stateId: 'IN', name: 'Indiana', wave: 3, delegates: 72, region: 'Midwest', majorBonus: false },
    MO: { stateId: 'MO', name: 'Missouri', wave: 3, delegates: 64, region: 'Midwest', majorBonus: false },
    MD: { stateId: 'MD', name: 'Maryland', wave: 3, delegates: 78, region: 'South', majorBonus: false },
    OR: { stateId: 'OR', name: 'Oregon', wave: 3, delegates: 54, region: 'West', majorBonus: false },
    KY: { stateId: 'KY', name: 'Kentucky', wave: 3, delegates: 44, region: 'South', majorBonus: false },
    LA: { stateId: 'LA', name: 'Louisiana', wave: 3, delegates: 44, region: 'South', majorBonus: false },
    CT: { stateId: 'CT', name: 'Connecticut', wave: 3, delegates: 53, region: 'Northeast', majorBonus: false },
    KS: { stateId: 'KS', name: 'Kansas', wave: 3, delegates: 32, region: 'Midwest', majorBonus: false },
    MS: { stateId: 'MS', name: 'Mississippi', wave: 3, delegates: 33, region: 'South', majorBonus: false },
    NM: { stateId: 'NM', name: 'New Mexico', wave: 3, delegates: 28, region: 'West', majorBonus: false },
    NE: { stateId: 'NE', name: 'Nebraska', wave: 3, delegates: 27, region: 'Midwest', majorBonus: false },
    WV: { stateId: 'WV', name: 'West Virginia', wave: 3, delegates: 23, region: 'South', majorBonus: false },
    ID: { stateId: 'ID', name: 'Idaho', wave: 3, delegates: 26, region: 'West', majorBonus: false },
    HI: { stateId: 'HI', name: 'Hawaii', wave: 3, delegates: 25, region: 'West', majorBonus: false },
    RI: { stateId: 'RI', name: 'Rhode Island', wave: 3, delegates: 25, region: 'Northeast', majorBonus: false },
    MT: { stateId: 'MT', name: 'Montana', wave: 3, delegates: 21, region: 'West', majorBonus: false },
    DE: { stateId: 'DE', name: 'Delaware', wave: 3, delegates: 17, region: 'South', majorBonus: false },
    SD: { stateId: 'SD', name: 'South Dakota', wave: 3, delegates: 16, region: 'Midwest', majorBonus: false },
    ND: { stateId: 'ND', name: 'North Dakota', wave: 3, delegates: 14, region: 'Midwest', majorBonus: false },
    WY: { stateId: 'WY', name: 'Wyoming', wave: 3, delegates: 14, region: 'West', majorBonus: false },
    DC: { stateId: 'DC', name: 'District of Columbia', wave: 3, delegates: 37, region: 'South', majorBonus: false },
  };

  const TEN_PLATFORM_PILLARS = [
    'tax-economy',
    'foreign-policy',
    'climate-policy',
    'religious-policy',
    'social-services',
    'social-justice',
    'party-structure',
    'party-ideology',
    'democracy-policy',
    'establishment-stance',
  ];

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function round(val, digits = 1) {
    const factor = Math.pow(10, digits);
    return Math.round(val * factor) / factor;
  }

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return (h >>> 0) / 4294967296;
  }

  function isContiguousOrSameRegion(stateIdA, stateIdB) {
    if (!stateIdA || !stateIdB) return false;
    if (stateIdA === stateIdB) return true;
    const a = STATE_DELEGATE_SCHEDULE[stateIdA];
    const b = STATE_DELEGATE_SCHEDULE[stateIdB];
    if (!a || !b) return false;
    return a.region === b.region;
  }

  /**
   * REQ-212 / REQ-197: Calculate hidden vulnerability score (0-100) from candidate traits.
   */
  function calculateVulnerabilityScore(traits = []) {
    let score = 30; // base moderate baseline
    traits.forEach((t) => {
      const lower = String(t).toLowerCase();
      if (lower.includes('corrupt')) score += 45;
      else if (lower.includes('undisciplined')) score += 30;
      else if (lower.includes('rough')) score += 15;
      else if (lower.includes('polished')) score -= 10;
      else if (lower.includes('disciplined')) score -= 20;
      else if (lower.includes('squeaky clean') || lower.includes('clean')) score -= 45;
    });
    return clamp(Math.round(score), 0, 100);
  }

  /**
   * REQ-195: Incumbent Vulnerability Triggers & Challenger Emergence
   * Evaluates if sitting first-term president faces an internal party revolt.
   */
  function evaluateIncumbentVulnerability(game) {
    const year = Number(game?.year || 2028);
    // Dynamic primaries unlock in 2032+ presidential election cycles
    if (year % 4 !== 0 || year < 2032) {
      return { vulnerable: false, reason: null, challenger: null };
    }

    const governingParty = game.governingParty || game.lastElection?.presidentialWinner || 'people';
    const approval = Number(game.presidentialApproval ?? 44);
    const env = Number(game.nationalEnvironment ?? 9);

    // Opposition environment penalty against governing party (env > 0 favors heritage/GOP, env < 0 favors people/Dem)
    const envAgainstGoverning = governingParty === 'people' ? env : -env;

    // Check faction restiveness in governing party
    const factions = (game && Array.isArray(game.factions) && game.factions.length > 0)
      ? game.factions
      : (typeof window !== 'undefined' && window.PartyChairData?.FACTIONS_CATALOG)
        ? window.PartyChairData.FACTIONS_CATALOG
        : (typeof globalThis !== 'undefined' && globalThis.PartyChairData?.FACTIONS_CATALOG)
          ? globalThis.PartyChairData.FACTIONS_CATALOG
          : [];

    const partyFactions = factions.filter((f) => f.partyId === governingParty);
    let restiveFaction = partyFactions.find((f) => {
      const hap = Number(game.factionStandings?.[f.id] ?? game.factionHappiness?.[f.id] ?? f.happiness ?? 60);
      const fric = Number(game.factionFriction?.[f.id] ?? f.frictionIndex ?? 0);
      return hap < 35 && fric > 65;
    });

    if (!restiveFaction && game.factionStandings && game.factionFriction) {
      for (const [fid, hapVal] of Object.entries(game.factionStandings)) {
        if (Number(hapVal) < 35 && Number(game.factionFriction[fid] ?? 0) > 65) {
          restiveFaction = { id: fid, name: fid, partyId: governingParty };
          break;
        }
      }
    }

    const isApprovalVulnerable = approval < 40.0;
    const isEnvVulnerable = envAgainstGoverning >= 8.0;
    const isFactionVulnerable = Boolean(restiveFaction);

    if (isApprovalVulnerable || isEnvVulnerable || isFactionVulnerable) {
      // Generate or select a primary challenger from the most aggrieved faction
      const targetFaction = restiveFaction || partyFactions.sort((a, b) => {
        const hA = Number(game.factionStandings?.[a.id] ?? 60);
        const hB = Number(game.factionStandings?.[b.id] ?? 60);
        return hA - hB;
      })[0] || { id: 'aggrieved_wing', name: 'Reform Insurgents' };

      // Find sitting governor/senator of governing party from that faction, or rising star
      const sittingMembers = game.sittingMembers || [];
      const eligibleLawmakers = sittingMembers.filter((m) =>
        m.party === governingParty &&
        (m.office === 'governor' || m.office === 'senate') &&
        (m.factionId === targetFaction.id || m.wing === targetFaction.id || m.faction === targetFaction.name)
      ).sort((a, b) => (b.fame || 40) - (a.fame || 40));

      const seed = Number(game.seed || 2028) + year;
      let challenger = null;
      if (eligibleLawmakers.length > 0) {
        const topLawmaker = eligibleLawmakers[0];
        challenger = {
          id: topLawmaker.id,
          name: topLawmaker.name,
          office: topLawmaker.office,
          stateId: topLawmaker.stateId || 'MI',
          factionId: targetFaction.id,
          fame: Math.max(55, topLawmaker.fame || 55),
          approval: Math.max(50, topLawmaker.popularity || 55),
          traits: Array.isArray(topLawmaker.traits) && topLawmaker.traits.length > 0 ? [...topLawmaker.traits] : ['Disciplined', 'Ambitious'],
          vulnerabilityScore: calculateVulnerabilityScore(topLawmaker.traits || ['Disciplined']),
          stances: generateCandidateStances(targetFaction.id, seed),
          delegates: 0,
          status: 'active',
          momentum: 2.0,
        };
      } else {
        challenger = {
          id: `challenger_${governingParty}_${year}`,
          name: governingParty === 'people' ? 'Sen. Marcus Vance-Shaw' : 'Gov. Bradley Vance-Hale',
          office: 'governor',
          stateId: governingParty === 'people' ? 'PA' : 'TX',
          factionId: targetFaction.id,
          fame: 62,
          approval: 58,
          traits: ['Disciplined', 'Polished'],
          vulnerabilityScore: 20,
          stances: generateCandidateStances(targetFaction.id, seed),
          delegates: 0,
          status: 'active',
          momentum: 2.5,
        };
      }

      return {
        vulnerable: true,
        reason: isApprovalVulnerable
          ? 'Sub-40% Presidential Approval rating'
          : isEnvVulnerable
            ? 'Severe national political environment backlash'
            : 'Open factional insurrection from aggrieved base wings',
        challenger,
      };
    }

    return { vulnerable: false, reason: null, challenger: null };
  }

  function generateCandidateStances(factionId, seed) {
    const stances = {};
    TEN_PLATFORM_PILLARS.forEach((p, idx) => {
      const baseStance = 5.0;
      const drift = (hash(`stance:${seed}:${factionId}:${p}:${idx}`) - 0.5) * 1.6; // +/-0.8 drift
      stances[p] = clamp(round(baseStance + drift, 1), 1.0, 10.0);
    });
    return stances;
  }

  /**
   * REQ-197: Presidential Primary Field & Candidate Generation
   * Generates a 3-5 contender primary field for open-seat or contested cycles.
   */
  function generatePresidentialPrimaryField(game, partyId) {
    const year = Number(game?.year || 2028);
    const seed = Number(game?.seed || 2028) + year * 17 + hash(`primField:${partyId}:${year}`) * 1000;
    const factions = (game?.factions || []).filter((f) => f.partyId === partyId);

    // Bench roster templates for major parties
    const demBench = [
      { name: 'Gov. Wes Moore', stateId: 'MD', office: 'governor', fame: 68, approval: 65, traits: ['Disciplined', 'Charismatic'], factionId: factions[0]?.id || 'dem_establishment' },
      { name: 'Gov. Gretchen Whitmer', stateId: 'MI', office: 'governor', fame: 78, approval: 70, traits: ['Polished', 'Disciplined'], factionId: factions[1]?.id || 'dem_moderates' },
      { name: 'Gov. Josh Shapiro', stateId: 'PA', office: 'governor', fame: 76, approval: 72, traits: ['Polished', 'Pragmatic'], factionId: factions[0]?.id || 'dem_establishment' },
      { name: 'Sen. Raphael Warnock', stateId: 'GA', office: 'senate', fame: 74, approval: 66, traits: ['Charismatic', 'Squeaky Clean'], factionId: factions[2]?.id || 'dem_progressives' },
      { name: 'Gov. Gavin Newsom', stateId: 'CA', office: 'governor', fame: 84, approval: 58, traits: ['Polished', 'Rough'], factionId: factions[0]?.id || 'dem_establishment' },
    ];

    const repBench = [
      { name: 'Gov. Glenn Youngkin', stateId: 'VA', office: 'governor', fame: 72, approval: 68, traits: ['Polished', 'Disciplined'], factionId: factions[0]?.id || 'gop_establishment' },
      { name: 'Gov. Ron DeSantis', stateId: 'FL', office: 'governor', fame: 82, approval: 62, traits: ['Disciplined', 'Rough'], factionId: factions[1]?.id || 'gop_populists' },
      { name: 'Gov. Brian Kemp', stateId: 'GA', office: 'governor', fame: 70, approval: 69, traits: ['Disciplined', 'Pragmatic'], factionId: factions[0]?.id || 'gop_establishment' },
      { name: 'Sen. Tim Scott', stateId: 'SC', office: 'senate', fame: 72, approval: 67, traits: ['Polished', 'Squeaky Clean'], factionId: factions[2]?.id || 'gop_evangelicals' },
      { name: 'Gov. Sarah Huckabee Sanders', stateId: 'AR', office: 'governor', fame: 68, approval: 60, traits: ['Rough', 'Undisciplined'], factionId: factions[1]?.id || 'gop_populists' },
    ];

    const benchPool = partyId === 'people' ? demBench : repBench;
    const count = 4; // 4 contenders
    const field = [];

    for (let i = 0; i < count; i++) {
      const template = benchPool[i % benchPool.length];
      const candId = `pres_cand_${partyId}_${year}_${i + 1}`;
      const fId = template.factionId || factions[i % factions.length]?.id || 'establishment';
      const cSeed = seed + i * 31;
      const candTraits = [...template.traits];
      field.push({
        id: candId,
        name: template.name,
        office: template.office,
        stateId: template.stateId,
        factionId: fId,
        fame: template.fame,
        approval: template.approval,
        traits: candTraits,
        vulnerabilityScore: calculateVulnerabilityScore(candTraits),
        stances: generateCandidateStances(fId, cSeed),
        delegates: 0,
        status: 'active',
        endorsedCandidateId: null,
        momentum: round((hash(`mom:${cSeed}`) - 0.45) * 3.0, 1), // initial slight momentum spread
      });
    }

    return field;
  }

  /**
   * Initializes the full presidential primary state for presidential cycles (2032+).
   */
  function initPresidentialPrimaries(game, options = {}) {
    const year = Number(game?.year || 2028);
    if (year % 4 !== 0 || year < 2032) {
      return {
        active: false,
        stage: 'pre_filing',
        primaryFieldByParty: {},
        delegatesByParty: {},
        vpSelectionByParty: {},
      };
    }

    const governingParty = game.governingParty || game.lastElection?.presidentialWinner || 'people';
    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    const vulnCheck = evaluateIncumbentVulnerability(game);

    const primaryFieldByParty = {};
    const delegatesByParty = {};
    const parties = ['people', 'heritage'];
    if (playerParty !== 'people' && playerParty !== 'heritage') {
      parties.push(playerParty);
    }

    parties.forEach((pid) => {
      delegatesByParty[pid] = {};
      if (pid === governingParty && !vulnCheck.vulnerable) {
        // Uncontested incumbent renomination
        const sittingPresName = game.presidentialTicket?.[governingParty] || (governingParty === 'people' ? 'Jon Ossoff' : 'J. D. Vance');
        const incumbentCand = {
          id: `incumbent_${pid}_${year}`,
          name: sittingPresName,
          office: 'president',
          stateId: governingParty === 'people' ? 'GA' : 'OH',
          factionId: 'establishment',
          fame: 92,
          approval: Number(game.presidentialApproval ?? 55),
          traits: ['Disciplined', 'Polished'],
          vulnerabilityScore: 15,
          stances: generateCandidateStances('establishment', year),
          delegates: CLINCH_THRESHOLD, // automatically clinched
          status: 'active',
          momentum: 5.0,
        };
        primaryFieldByParty[pid] = [incumbentCand];
        delegatesByParty[pid][incumbentCand.id] = CLINCH_THRESHOLD;
      } else if (pid === governingParty && vulnCheck.vulnerable && !options.stepAside) {
        // Incumbent contested primary revolt
        const sittingPresName = game.presidentialTicket?.[governingParty] || (governingParty === 'people' ? 'Jon Ossoff' : 'J. D. Vance');
        const incumbentCand = {
          id: `incumbent_${pid}_${year}`,
          name: sittingPresName,
          office: 'president',
          stateId: governingParty === 'people' ? 'GA' : 'OH',
          factionId: 'establishment',
          fame: 88,
          approval: Number(game.presidentialApproval ?? 38),
          traits: ['Rough', 'Undisciplined'],
          vulnerabilityScore: 55,
          stances: generateCandidateStances('establishment', year),
          delegates: 0,
          status: 'active',
          momentum: -2.0,
        };
        const challengerCand = vulnCheck.challenger;
        primaryFieldByParty[pid] = [incumbentCand, challengerCand];
        delegatesByParty[pid][incumbentCand.id] = 0;
        delegatesByParty[pid][challengerCand.id] = 0;
      } else {
        // Open-seat primary field
        const field = generatePresidentialPrimaryField(game, pid);
        primaryFieldByParty[pid] = field;
        field.forEach((c) => {
          delegatesByParty[pid][c.id] = 0;
        });
      }
    });

    return {
      active: true,
      stage: 'early_states', // Wave 1 begins
      wave: 1,
      incumbentVulnerable: vulnCheck.vulnerable,
      incumbentChallengerId: vulnCheck.challenger?.id || null,
      incumbentSteppedAside: Boolean(options.stepAside),
      bruisedIncumbentPenalty: 0,
      primaryFieldByParty,
      delegatesByParty,
      vpSelectionByParty: {},
      chairStrategyUsed: false,
      backedCandidateId: null,
      brokeredConvention: false,
      ballotCount: 1,
      conventionConcessions: [],
      presumptiveNomineeId: null,
    };
  }

  /**
   * REQ-196: Step-Aside Decision
   * Chair pressures vulnerable incumbent to step aside, opening the field and cutting fatigue penalty.
   */
  function pressureIncumbentStepAside(game) {
    if (!game.presidentialPrimaries) {
      game.presidentialPrimaries = initPresidentialPrimaries(game, { stepAside: true });
    }
    const primaries = game.presidentialPrimaries;
    primaries.incumbentSteppedAside = true;
    primaries.incumbentVulnerable = false;

    const governingParty = game.governingParty || game.lastElection?.presidentialWinner || 'people';
    // Regenerate open primary field for governing party
    const openField = generatePresidentialPrimaryField(game, governingParty);
    primaries.primaryFieldByParty[governingParty] = openField;
    primaries.delegatesByParty[governingParty] = {};
    openField.forEach((c) => {
      primaries.delegatesByParty[governingParty][c.id] = 0;
    });

    // 60% reduction in governing fatigue on the party
    const curEnv = Number(game.nationalEnvironment ?? 9);
    const relief = curEnv * 0.60;
    game.nationalEnvironment = round(curEnv - relief, 2);

    game.lastNote = 'The incumbent President has gracefully declined re-election. An open-seat primary field forms across the nation.';
    return game;
  }

  function standByIncumbent(game) {
    if (!game.presidentialPrimaries) {
      game.presidentialPrimaries = initPresidentialPrimaries(game);
    }
    game.presidentialPrimaries.incumbentSteppedAside = false;
    game.lastNote = 'Party leadership stands by the incumbent President as primary filing deadlines arrive.';
    return game;
  }

  /**
   * REQ-199: Allocate delegates within a state based on 15% threshold and Major-Bonus rules.
   */
  function allocateStateDelegates(voteShares, stateDelegates, isMajorBonus = false) {
    const allocation = {};
    Object.keys(voteShares).forEach((id) => { allocation[id] = 0; });

    // Major-Bonus State Rule: > 50.0% takes 100% of delegates
    if (isMajorBonus) {
      for (const [id, share] of Object.entries(voteShares)) {
        if (share > 0.50) {
          allocation[id] = stateDelegates;
          return allocation;
        }
      }
    }

    // Viability Threshold: 15.0%
    const viable = {};
    let viableTotal = 0;
    Object.entries(voteShares).forEach(([id, share]) => {
      if (share >= VIABILITY_THRESHOLD) {
        viable[id] = share;
        viableTotal += share;
      }
    });

    if (viableTotal <= 0) {
      // If none reached 15%, award all to plurality winner
      const sorted = Object.entries(voteShares).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) allocation[sorted[0][0]] = stateDelegates;
      return allocation;
    }

    // Largest Remainder (Hamilton method) for clean integer delegate allocation
    let allocatedSum = 0;
    const remainders = [];
    Object.entries(viable).forEach(([id, share]) => {
      const exact = (share / viableTotal) * stateDelegates;
      const base = Math.floor(exact);
      allocation[id] = base;
      allocatedSum += base;
      remainders.push({ id, remainder: exact - base });
    });

    let surplus = stateDelegates - allocatedSum;
    remainders.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < surplus; i++) {
      const cand = remainders[i % remainders.length];
      allocation[cand.id] += 1;
    }

    return allocation;
  }

  /**
   * REQ-197 / REQ-198: Calculate candidate vote share in a state.
   */
  function calculateStatePrimaryVote(candidate, stateSchedule, allCandidatesInRace, game, partyId) {
    const stateId = stateSchedule.stateId;
    const seed = Number(game?.seed || 2028) + hash(`stVote:${stateId}:${candidate.id}`);

    // Base score from Fame (0.35), Approval (0.35), Traits/Ratings (0.30)
    let score = (candidate.fame || 50) * 0.35 + (candidate.approval || 50) * 0.35;

    // Home-State Affinity (+8.0% in home state, +3.0% in same region)
    if (candidate.stateId === stateId) {
      score += 8.0;
    } else if (isContiguousOrSameRegion(candidate.stateId, stateId)) {
      score += 3.0;
    }

    // Momentum effect
    score += (candidate.momentum || 0) * 1.5;

    // Chair Backing Boost (+5.0% if Chair backed candidate)
    if (game?.presidentialPrimaries?.backedCandidateId === candidate.id) {
      score += 5.0;
    }

    // Lane Consolidation Endorsement Boost
    if (candidate.consolidatedAffinityBoost) {
      score += candidate.consolidatedAffinityBoost;
    }

    // Faction strength in state
    const stateObj = (game?.voterModel?.states || []).find((s) => (s.stateId || s.id) === stateId);
    if (stateObj && stateObj.factions && candidate.factionId) {
      const fCount = Number(stateObj.factions[candidate.factionId] || 0);
      if (fCount > 20000) score += 3.5;
    }

    // Stochastic campaign noise
    const noise = (hash(`noise:${seed}:${candidate.id}`) - 0.5) * 4.0;
    return Math.max(1.0, score + noise);
  }

  /**
   * REQ-198: Advances the primary calendar through Wave 1, Wave 2, and Wave 3.
   */
  function advancePrimaryWave(game) {
    if (!game.presidentialPrimaries || !game.presidentialPrimaries.active) {
      return game;
    }
    const primaries = game.presidentialPrimaries;
    const currentWave = primaries.wave || 1;

    // Find all states belonging to current wave
    const waveStates = Object.values(STATE_DELEGATE_SCHEDULE).filter((s) => s.wave === currentWave);

    // Run voting for each party
    Object.keys(primaries.primaryFieldByParty).forEach((pid) => {
      const field = primaries.primaryFieldByParty[pid] || [];
      const activeCandidates = field.filter((c) => c.status === 'active');
      if (activeCandidates.length <= 1) {
        // Uncontested or already single candidate: awards all wave delegates to active candidate
        const winner = activeCandidates[0] || field[0];
        if (winner) {
          const waveDel = waveStates.reduce((sum, s) => sum + s.delegates, 0);
          winner.delegates = (winner.delegates || 0) + waveDel;
          primaries.delegatesByParty[pid][winner.id] = winner.delegates;
        }
        return;
      }

      waveStates.forEach((stateSchedule) => {
        const rawScores = {};
        let scoreSum = 0;
        activeCandidates.forEach((c) => {
          const s = calculateStatePrimaryVote(c, stateSchedule, activeCandidates, game, pid);
          rawScores[c.id] = s;
          scoreSum += s;
        });

        const voteShares = {};
        activeCandidates.forEach((c) => {
          voteShares[c.id] = rawScores[c.id] / scoreSum;
        });

        const stateDelegatesAlloc = allocateStateDelegates(voteShares, stateSchedule.delegates, stateSchedule.majorBonus);
        activeCandidates.forEach((c) => {
          const won = stateDelegatesAlloc[c.id] || 0;
          c.delegates = (c.delegates || 0) + won;
          primaries.delegatesByParty[pid][c.id] = c.delegates;
        });
      });

      // Wave-specific momentum and dropout cascades
      if (currentWave === 1) {
        // Wave 1 Momentum Bounce (+4.0% to winner, +1.5% to runner-up)
        const sorted = [...activeCandidates].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));
        if (sorted[0]) sorted[0].momentum = round((sorted[0].momentum || 0) + 4.0, 1);
        if (sorted[1]) sorted[1].momentum = round((sorted[1].momentum || 0) + 1.5, 1);

        // Donor starvation for sub-10% candidates in early states
        sorted.slice(2).forEach((c) => {
          if ((c.delegates || 0) < 18) {
            c.momentum = round((c.momentum || 0) - 2.5, 1);
          }
        });
      } else if (currentWave === 2) {
        // Wave 2: Super Tuesday Dropout & Endorsement Cascade (REQ-198)
        // Candidates with < 12.0% of delegates awarded so far automatically suspend
        const totalAwardedInP1P2 = 186 + 1645;
        const remainingActive = [...activeCandidates];

        activeCandidates.forEach((c) => {
          const share = (c.delegates || 0) / totalAwardedInP1P2;
          if (share < 0.12 && remainingActive.length > 2) {
            c.status = 'withdrawn';
            // Find ideologically closest active rival based on 10-pillar stances
            const rivals = remainingActive.filter((r) => r.id !== c.id && r.status === 'active');
            if (rivals.length > 0) {
              rivals.sort((rA, rB) => {
                let distA = 0;
                let distB = 0;
                TEN_PLATFORM_PILLARS.forEach((p) => {
                  distA += Math.pow((c.stances?.[p] || 5) - (rA.stances?.[p] || 5), 2);
                  distB += Math.pow((c.stances?.[p] || 5) - (rB.stances?.[p] || 5), 2);
                });
                return distA - distB;
              });

              const endorsedRival = rivals[0];
              c.endorsedCandidateId = endorsedRival.id;
              // Transfer 65% of momentum and voter affinity
              endorsedRival.momentum = round(clamp((endorsedRival.momentum || 0) + (c.momentum || 0) * 0.65, -10.0, 10.0), 1);
              endorsedRival.consolidatedAffinityBoost = (endorsedRival.consolidatedAffinityBoost || 0) + 4.5;
            }
          }
        });
      }
    });

    // Advance wave or transition to convention
    if (currentWave === 1) {
      primaries.wave = 2;
      primaries.stage = 'super_tuesday';
      game.lastNote = 'Wave 1 Early States resolved. The national campaign turns toward the 15-state Super Tuesday gauntlet.';
    } else if (currentWave === 2) {
      primaries.wave = 3;
      primaries.stage = 'late_states';
      game.lastNote = 'Super Tuesday returns certified. Trailing campaigns consolidate into late battleground states.';
    } else {
      // Wave 3 completed — evaluate nomination status across parties
      primaries.wave = 3;
      primaries.stage = 'convention';

      // Check player's party nomination
      const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
      const playerField = primaries.primaryFieldByParty[playerParty] || [];
      const sortedPlayer = [...playerField].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));
      const topCand = sortedPlayer[0];

      if (topCand && (topCand.delegates || 0) >= CLINCH_THRESHOLD) {
        primaries.presumptiveNomineeId = topCand.id;
        primaries.brokeredConvention = false;
        game.lastNote = `${topCand.name} captures the nomination majority with ${(topCand.delegates || 0).toLocaleString()} delegates!`;
      } else {
        // Deadlock triggers Brokered Multi-Ballot Convention (REQ-203)
        primaries.brokeredConvention = true;
        primaries.ballotCount = 1;
        game.lastNote = 'No candidate secured 2,000 delegates. The party enters a historic Brokered Multi-Ballot Convention!';
      }

      // Resolve AI rival party nomination
      const aiParty = playerParty === 'people' ? 'heritage' : 'people';
      const aiField = primaries.primaryFieldByParty[aiParty] || [];
      const sortedAi = [...aiField].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));
      if (sortedAi[0]) {
        primaries.vpSelectionByParty[aiParty] = sortedAi[1]?.name || 'Gov. Glenn Youngkin';
        game.presidentialTicket[aiParty] = sortedAi[0].name;
      }

      initNominatingConvention(game, playerParty);
    }

    return game;
  }

  /**
   * REQ-200: Chair Primary Strategy & Lane Consolidation
   */
  function applyChairPrimaryAction(game, actionType, payload = {}) {
    if (!game.presidentialPrimaries || !game.presidentialPrimaries.active) return game;
    const primaries = game.presidentialPrimaries;
    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    const field = primaries.primaryFieldByParty[playerParty] || [];
    const factions = (game.factions || []).filter((f) => f.partyId === playerParty);

    if (actionType === 'neutrality') {
      // Action 1: Stand down; preserves harmony: +6 Happiness across all factions
      factions.forEach((f) => {
        const curH = Number(game.factionStandings?.[f.id] ?? f.happiness ?? 60);
        game.factionStandings[f.id] = clamp(curH + 6, 0, 100);
      });
      primaries.chairStrategyUsed = true;
      game.lastNote = 'The Chair affirms strict institutional neutrality. Factions across the party appreciate the impartial stewardship (+6 Happiness).';
    } else if (actionType === 'back_candidate') {
      // Action 2: Steer $3.0M committee funds to boost favored candidate +5.0%
      const candidateId = payload.candidateId || field[0]?.id;
      const target = field.find((c) => c.id === candidateId);
      if (!target) return game;
      if ((game.treasury || 0) < 3.0) return game;

      game.treasury = Math.max(0, round((game.treasury || 0) - 3.0, 1));
      primaries.backedCandidateId = target.id;
      primaries.chairStrategyUsed = true;

      // -8 Happiness on rival candidates' factions
      factions.forEach((f) => {
        if (f.id !== target.factionId) {
          const curH = Number(game.factionStandings?.[f.id] ?? f.happiness ?? 60);
          game.factionStandings[f.id] = clamp(curH - 8, 0, 100);
        }
      });
      game.lastNote = `The Chair deploys $3.0M in committee resources behind ${target.name} (+5.0% polling lift). Rival wings register severe indignation (-8 Happiness).`;
    } else if (actionType === 'broker_lane') {
      // Action 3: Broker lane consolidation with struggling candidate (<15% share)
      const targetCandidateId = payload.candidateId;
      const target = field.find((c) => c.id === targetCandidateId && c.status === 'active');
      const frontrunner = [...field].filter((c) => c.status === 'active').sort((a, b) => (b.delegates || 0) - (a.delegates || 0))[0];

      if (!target || !frontrunner || target.id === frontrunner.id) return game;
      if (game.actionsLeft <= 0) return game;

      game.actionsLeft -= 1;
      target.status = 'withdrawn';
      target.endorsedCandidateId = frontrunner.id;
      frontrunner.consolidatedAffinityBoost = (frontrunner.consolidatedAffinityBoost || 0) + 6.5;
      primaries.chairStrategyUsed = true;

      game.lastNote = `The Chair brokers an immediate lane consolidation: ${target.name} drops out and endorses frontrunner ${frontrunner.name} in exchange for a Cabinet accord.`;
    }

    return game;
  }

  /**
   * REQ-201, REQ-202, REQ-203: Initialize Nominating Convention data structures.
   */
  function initNominatingConvention(game, partyId) {
    const primaries = game.presidentialPrimaries;
    const field = primaries.primaryFieldByParty[partyId] || [];
    const sorted = [...field].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));
    const nominee = sorted[0];

    // REQ-201: Competing Platform Floor Amendments
    const platformAmendments = [
      {
        id: 'amendment_energy',
        title: 'Energy Transition & Consumer Cost Relief Accord',
        issueId: 'climate-policy',
        sideA: { name: 'Green Transition Mandate', delta: -1.0, factionName: 'Progressive Wing', happinessGain: 7, happinessLoss: -4 },
        sideB: { name: 'Domestic Production & Fuel Cost Relief', delta: 1.0, factionName: 'Working-Class Wing', happinessGain: 7, happinessLoss: -4 },
        resolved: false,
      },
      {
        id: 'amendment_trade',
        title: 'Trade Protectionism vs Global Market Integration',
        issueId: 'party-ideology',
        sideA: { name: 'Strategic Industrial Tariffs', delta: -1.0, factionName: 'Economic Nationalists', happinessGain: 7, happinessLoss: -4 },
        sideB: { name: 'Free Market Supply-Chain Compact', delta: 1.0, factionName: 'Suburban Moderates', happinessGain: 7, happinessLoss: -4 },
        resolved: false,
      },
      {
        id: 'amendment_governance',
        title: 'Judicial & Democratic Reform Plank',
        issueId: 'democracy-policy',
        sideA: { name: 'Direct Electoral System Overhaul', delta: -1.0, factionName: 'Reform Wing', happinessGain: 7, happinessLoss: -4 },
        sideB: { name: 'Constitutional Continuity & State Prerogatives', delta: 1.0, factionName: 'Institutionalists', happinessGain: 7, happinessLoss: -4 },
        resolved: false,
      },
    ];

    // REQ-202: 4 Qualified Running Mate (VP) Contenders
    const runnerUp = sorted[1];
    const vpRoster = [];
    if (runnerUp) {
      vpRoster.push({
        id: runnerUp.id,
        name: runnerUp.name,
        stateId: runnerUp.stateId,
        factionId: runnerUp.factionId,
        isRunnerUp: true,
        fame: runnerUp.fame,
      });
    }

    // Additional prospective running mates from sitting governors / senators
    const sittingMembers = game.sittingMembers || [];
    const prospective = sittingMembers.filter((m) =>
      m.party === partyId &&
      (m.office === 'governor' || m.office === 'senate') &&
      (!runnerUp || m.name !== runnerUp.name) &&
      (!nominee || m.name !== nominee.name)
    ).sort((a, b) => (b.fame || 40) - (a.fame || 40));

    prospective.slice(0, 3).forEach((p) => {
      vpRoster.push({
        id: p.id,
        name: p.name,
        stateId: p.stateId || 'PA',
        factionId: p.factionId || 'establishment',
        isRunnerUp: false,
        fame: p.fame || 60,
      });
    });

    const PARTY_VP_FALLBACKS = {
      people: [
        { name: 'Sen. Tammy Baldwin', stateId: 'WI' },
        { name: 'Gov. Josh Shapiro', stateId: 'PA' },
        { name: 'Sen. Raphael Warnock', stateId: 'GA' },
        { name: 'Gov. Gretchen Whitmer', stateId: 'MI' },
      ],
      heritage: [
        { name: 'Gov. Chris Sununu', stateId: 'NH' },
        { name: 'Sen. Katie Britt', stateId: 'AL' },
        { name: 'Gov. Glenn Youngkin', stateId: 'VA' },
        { name: 'Sen. Marco Rubio', stateId: 'FL' },
      ],
      liberty: [
        { name: 'Chase Oliver', stateId: 'GA' },
        { name: 'Mike ter Maat', stateId: 'VA' },
        { name: 'Spike Cohen', stateId: 'SC' },
        { name: 'Jo Jorgensen', stateId: 'SC' },
      ],
      green: [
        { name: 'Jill Stein', stateId: 'MA' },
        { name: 'Kshama Sawant', stateId: 'WA' },
        { name: 'Butch Ware', stateId: 'CA' },
        { name: 'Howie Hawkins', stateId: 'NY' },
      ],
      constitution: [
        { name: 'Randall Terry', stateId: 'TN' },
        { name: 'Scott Bradley', stateId: 'UT' },
        { name: 'Darrell Castle', stateId: 'TN' },
        { name: 'Don Blankenship', stateId: 'WV' },
      ],
      socialist: [
        { name: 'Claudia De la Cruz', stateId: 'NY' },
        { name: 'Gloria La Riva', stateId: 'CA' },
        { name: 'Karina Garcia', stateId: 'NY' },
        { name: 'Cornel West', stateId: 'NJ' },
      ],
    };
    const PARTY_KEYNOTE_FALLBACKS = {
      people: [{ name: 'Gov. Andy Beshear', stateId: 'KY' }],
      heritage: [{ name: 'Sen. Tim Scott', stateId: 'SC' }],
      liberty: [{ name: 'Chase Oliver', stateId: 'GA' }, { name: 'Mike ter Maat', stateId: 'VA' }],
      green: [{ name: 'Jill Stein', stateId: 'MA' }, { name: 'Butch Ware', stateId: 'CA' }],
      constitution: [{ name: 'Randall Terry', stateId: 'TN' }, { name: 'Scott Bradley', stateId: 'UT' }],
      socialist: [{ name: 'Claudia De la Cruz', stateId: 'NY' }, { name: 'Gloria La Riva', stateId: 'CA' }],
    };
    const customLabel = (game?.player?.name || 'Party').trim();
    const customVpBench = [
      { name: `${customLabel} State Chair Alex Mercer`, stateId: 'PA' },
      { name: `${customLabel} Organizer Dana Reyes`, stateId: 'OH' },
      { name: `${customLabel} Policy Director Jordan Ellis`, stateId: 'MI' },
      { name: `${customLabel} Convention Chair Morgan Hayes`, stateId: 'WI' },
    ];
    const vpBench = PARTY_VP_FALLBACKS[partyId] || customVpBench;
    let fallbackIdx = 0;
    while (vpRoster.length < 4) {
      const idx = vpRoster.length + 1;
      const pick = vpBench[fallbackIdx % vpBench.length];
      fallbackIdx += 1;
      vpRoster.push({
        id: `bench_vp_${partyId}_${idx}`,
        name: pick.name,
        stateId: pick.stateId,
        party: partyId,
        factionId: 'establishment',
        isRunnerUp: false,
        fame: ['people', 'heritage'].includes(partyId) ? 66 : 42,
      });
    }

    // REQ-202 & REQ-280: Keynote Speaker Candidates (party-aligned fallbacks)
    const keynoteSpeakers = sittingMembers.filter((m) => m.party === partyId && (m.fame || 40) >= 50).slice(0, 3);
    if (keynoteSpeakers.length === 0) {
      const kBench = PARTY_KEYNOTE_FALLBACKS[partyId] || [{ name: `${customLabel} Keynote Chair Alex Mercer`, stateId: 'PA' }];
      kBench.forEach((kPick, kIdx) => {
        keynoteSpeakers.push({
          id: `keynote_${partyId}_${kIdx + 1}`,
          name: kPick.name,
          stateId: kPick.stateId,
          party: partyId,
          fame: ['people', 'heritage'].includes(partyId) ? 70 : 45,
          factionId: 'establishment',
        });
      });
    }

    primaries.conventionData = {
      platformAmendments,
      vpRoster,
      keynoteSpeakers,
      keynoteSpeakerSelectedId: null,
      selectedVpId: null,
      amendmentsVoted: 0,
      brokeredResolved: !primaries.brokeredConvention,
    };

    return game;
  }

  /**
   * REQ-201: Cast Platform Floor Amendment Vote
   */
  function resolvePlatformFloorVote(game, amendmentId, adoptSide) {
    if (!game.presidentialPrimaries?.conventionData) return game;
    const conv = game.presidentialPrimaries.conventionData;
    const amendment = conv.platformAmendments.find((a) => a.id === amendmentId);
    if (!amendment || amendment.resolved) return game;

    const chosen = adoptSide === 'A' ? amendment.sideA : amendment.sideB;
    const opposed = adoptSide === 'A' ? amendment.sideB : amendment.sideA;

    // Shift national platform slider on issue
    if (game.issuePositions && amendment.issueId) {
      const cur = Number(game.issuePositions[amendment.issueId] ?? 5.0);
      game.issuePositions[amendment.issueId] = clamp(round(cur + chosen.delta, 1), 1.0, 10.0);
    }

    // Faction Happiness delta: Winning faction +7, losing faction -4
    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    const factions = (game.factions || []).filter((f) => f.partyId === playerParty);
    factions.forEach((f) => {
      const curH = Number(game.factionStandings?.[f.id] ?? f.happiness ?? 60);
      if (f.name.toLowerCase().includes(chosen.factionName.toLowerCase().split(' ')[0])) {
        game.factionStandings[f.id] = clamp(curH + 7, 0, 100);
      } else if (f.name.toLowerCase().includes(opposed.factionName.toLowerCase().split(' ')[0])) {
        game.factionStandings[f.id] = clamp(curH - 4, 0, 100);
      }
    });

    amendment.resolved = true;
    amendment.adopted = chosen.name;
    conv.amendmentsVoted += 1;

    game.lastNote = `Convention adopts platform plank: "${chosen.name}". ${chosen.factionName} rallies (+7 Happiness), while opponents express dissent (-4 Happiness).`;
    return game;
  }

  /**
   * REQ-202: Vice Presidential Ticket Selection
   */
  function resolveVpSelection(game, vpCandidateId) {
    if (!game.presidentialPrimaries?.conventionData) return game;
    const conv = game.presidentialPrimaries.conventionData;
    const vp = conv.vpRoster.find((v) => v.id === vpCandidateId);
    if (!vp) return game;

    conv.selectedVpId = vp.id;
    conv.selectedVp = vp;

    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    game.presidentialPrimaries.vpSelectionByParty[playerParty] = vp.name;

    // Factional Balancing: If runner-up selected, cancel Bruised Incumbent penalty and award +12 Happiness
    if (vp.isRunnerUp) {
      game.presidentialPrimaries.bruisedIncumbentPenalty = 0;
      game.presidentialPrimaries.fractureHealed = true;
      const factions = (game.factions || []).filter((f) => f.partyId === playerParty);
      factions.forEach((f) => {
        if (f.id === vp.factionId) {
          const curH = Number(game.factionStandings?.[f.id] ?? f.happiness ?? 60);
          game.factionStandings[f.id] = clamp(curH + 12, 0, 100);
        }
      });
      game.lastNote = `Vice Presidential Accord: Selecting primary rival ${vp.name} heals factional fractures (+12 Happiness, zero general election friction).`;
    } else {
      game.lastNote = `Vice Presidential Accord: ${vp.name} selected as running mate, establishing a strong regional anchor in ${vp.stateId}.`;
    }

    return game;
  }

  /**
   * REQ-202: Prime-Time Convention Keynote Address
   */
  function resolveKeynoteAddress(game, speakerId) {
    if (!game.presidentialPrimaries?.conventionData) return game;
    const conv = game.presidentialPrimaries.conventionData;
    const speaker = conv.keynoteSpeakers.find((s) => s.id === speakerId) || conv.keynoteSpeakers[0];
    if (!speaker) return game;

    conv.keynoteSpeakerSelectedId = speaker.id;
    speaker.fame = Math.min(100, (speaker.fame || 50) + 5);

    // +6 Faction Standing & +2.0% National general election enthusiasm boost
    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    const factions = (game.factions || []).filter((f) => f.partyId === playerParty);
    factions.forEach((f) => {
      if (f.id === speaker.factionId) {
        const curH = Number(game.factionStandings?.[f.id] ?? f.happiness ?? 60);
        game.factionStandings[f.id] = clamp(curH + 6, 0, 100);
      }
    });

    game.presidentialPrimaries.conventionEnthusiasmBounce = 2.0;
    game.lastNote = `${speaker.name} delivers a thunderous Prime-Time Keynote Address, galvanizing national party activists (+2.0% general election enthusiasm).`;
    return game;
  }

  /**
   * REQ-203: Contested / Brokered Multi-Ballot Convention Dealmaking
   */
  function resolveBrokeredBallotDeal(game, concessions = {}) {
    if (!game.presidentialPrimaries?.conventionData) return game;
    const primaries = game.presidentialPrimaries;
    const conv = primaries.conventionData;
    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    const field = primaries.primaryFieldByParty[playerParty] || [];
    const sorted = [...field].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));

    const frontrunner = sorted[0];
    const kingmaker = sorted[1];

    if (concessions.offerVp) {
      // Kingmaker gets VP, pledges 100% of delegates on Ballot 2
      resolveVpSelection(game, kingmaker.id);
      frontrunner.delegates = (frontrunner.delegates || 0) + (kingmaker.delegates || 0);
      primaries.ballotCount = 2;
      conv.brokeredResolved = true;
      primaries.presumptiveNomineeId = frontrunner.id;
      game.lastNote = `Ballot 2 Breakthrough: ${frontrunner.name} clinches the nomination after offering the Vice Presidency to ${kingmaker.name}!`;
    } else if (concessions.cabinetPosts && concessions.platformDemands) {
      // Cabinet + Platform deal: pledges 80% of kingmaker delegates on Ballot 2
      const pledged = Math.round((kingmaker.delegates || 0) * 0.80);
      frontrunner.delegates = (frontrunner.delegates || 0) + pledged;
      primaries.ballotCount = 2;
      conv.brokeredResolved = true;
      primaries.presumptiveNomineeId = frontrunner.id;
      game.lastNote = `Ballot 2 Accord: Coalition deal ratified. Cabinet and platform covenants deliver ${(pledged).toLocaleString()} delegates to clinch the ticket.`;
    } else {
      // Compromise candidate fallback after deadlock through Ballot 3
      const yr = Number(game?.year || 2028);
      primaries.ballotCount = 3;
      conv.brokeredResolved = true;
      const compromiseNominee = {
        id: `compromise_nominee_${yr}`,
        name: 'Gov. Roy Cooper',
        office: 'governor',
        stateId: 'NC',
        factionId: 'establishment',
        fame: 60,
        approval: 52,
      };
      frontrunner.name = compromiseNominee.name;
      frontrunner.id = compromiseNominee.id;
      primaries.presumptiveNomineeId = compromiseNominee.id;
      primaries.conventionEnthusiasmBounce = -5.0; // -5.0% enthusiasm penalty

      // Lasting faction bitterness (-10 Happiness across party factions)
      const factions = (game.factions || []).filter((f) => f.partyId === playerParty);
      factions.forEach((f) => {
        const curH = Number(game.factionStandings?.[f.id] ?? f.happiness ?? 60);
        game.factionStandings[f.id] = clamp(curH - 10, 0, 100);
      });
      game.lastNote = `Deadlock unbroken on Ballot 3. Delegates draft an unvetted compromise ticket (${compromiseNominee.name}), inflicting lasting bitterness (-5.0% enthusiasm).`;
    }

    return game;
  }

  /**
   * Finalizes the convention, crowns the ticket, and transitions into Phase 3 (General Campaign).
   */
  function finalizeConventionAndCrownNominee(game) {
    if (!game.presidentialPrimaries) return game;
    const primaries = game.presidentialPrimaries;
    const playerParty = game.player?.baseTemplateId || game.player?.id || 'people';
    const field = primaries.primaryFieldByParty[playerParty] || [];
    const sorted = [...field].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));
    const nominee = field.find((c) => c.id === primaries.presumptiveNomineeId) || sorted[0];

    if (nominee) {
      game.presidentialTicket[playerParty] = nominee.name;
      primaries.nominee = nominee;
    }

    // Set Bruised Incumbent general election penalty if contested primary was fought and fracture not healed
    if (primaries.incumbentVulnerable && !primaries.incumbentSteppedAside && !primaries.fractureHealed) {
      primaries.bruisedIncumbentPenalty = 3.5; // -3.5% GE margin drag
    }

    primaries.stage = 'completed';
    primaries.active = false;

    // Transition into 15-week / 5-month grand strategy campaign phase
    game.phase = 'general-campaign';
    game.generalCampaignTurn = 0;
    if (game.campaign) {
      game.campaign.active = true;
      game.campaign.week = 1;
      game.campaign.weeklyActionsLeft = 5;
    }

    game.lastNote = `The ${nominee ? nominee.name : 'Nominee'} ticket is officially crowned. The General Election Campaign Phase begins!`;
    return game;
  }

  const api = {
    TOTAL_DELEGATES,
    CLINCH_THRESHOLD,
    VIABILITY_THRESHOLD,
    STATE_DELEGATE_SCHEDULE,
    TEN_PLATFORM_PILLARS,
    isContiguousOrSameRegion,
    calculateVulnerabilityScore,
    evaluateIncumbentVulnerability,
    generatePresidentialPrimaryField,
    initPresidentialPrimaries,
    pressureIncumbentStepAside,
    standByIncumbent,
    allocateStateDelegates,
    calculateStatePrimaryVote,
    advancePrimaryWave,
    applyChairPrimaryAction,
    initNominatingConvention,
    resolvePlatformFloorVote,
    resolveVpSelection,
    resolveKeynoteAddress,
    resolveBrokeredBallotDeal,
    finalizeConventionAndCrownNominee,
  };

  if (typeof window !== 'undefined') {
    window.PresidentialPrimaries = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
