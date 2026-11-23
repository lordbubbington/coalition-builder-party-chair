/**
 * Coalition Builder: Party Chair — Version 0.18.4
 * Module: coalition-politics-system.js
 *
 * Standalone module implementing:
 * - Proposal #5: Primary Rules & Delegate Math Engineering (Rules & Bylaws Committee)
 * - Proposal #6: Cabinet, Court & Shadow-Cabinet Patronage
 * - Proposal #9: Era-Gated Interactive Coalition & Splinter Diplomacy Hub
 *
 * Exposes window.CoalitionPoliticsSystem (browser) and module.exports (Node.js).
 * Strictly deterministic seeded hashing.
 */
(function CoalitionPoliticsSystemModule() {
  'use strict';

  // =========================================================================
  // DETERMINISTIC HELPERS & UTILITIES
  // =========================================================================

  function seededHash(str) {
    let h = 2166136261;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967296;
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(Number(num) || 0, min), max);
  }

  function round(val, digits = 1) {
    const f = Math.pow(10, digits);
    return Math.round((Number(val) || 0) * f) / f;
  }

  function safeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPlayerPartyId(game) {
    if (!game?.player) return 'people';
    return game.player.custom ? 'player' : (game.player.baseTemplateId || game.player.id || 'people');
  }

  function getGoverningPartyId(game) {
    return game?.governingParty || game?.lastElection?.presidentialWinner || 'heritage';
  }

  function isBoltedFaction(f) {
    if (!f) return false;
    if (f.partyId === 'none') return true;
    if (f.partyId === 'unaffiliated' && Boolean(f.formerPartyId || f.boltedYear)) return true;
    return false;
  }

  function getFactionHappiness(game, f) {
    if (!f) return 60;
    if (game?.factionHappiness && game.factionHappiness[f.id] !== undefined) return Number(game.factionHappiness[f.id]);
    if (game?.factionStandings && game.factionStandings[f.id] !== undefined) return Number(game.factionStandings[f.id]);
    return Number(f.happiness ?? 60);
  }

  function setFactionHappiness(game, f, value) {
    if (!f) return;
    const clamped = round(clamp(value, 0, 100), 1);
    f.happiness = clamped;
    if (game.factionHappiness) game.factionHappiness[f.id] = clamped;
    if (game.factionStandings) game.factionStandings[f.id] = clamped;
  }

  function getFactionFriction(game, f) {
    if (!f) return 0;
    if (game?.factionFriction && game.factionFriction[f.id] !== undefined) return Number(game.factionFriction[f.id]);
    return Number(f.frictionIndex ?? 0);
  }

  function setFactionFriction(game, f, value) {
    if (!f) return;
    const clamped = round(clamp(value, 0, 100), 1);
    f.frictionIndex = clamped;
    if (game.factionFriction) game.factionFriction[f.id] = clamped;
  }

  function isAnchorOrEstablishmentFaction(f) {
    if (!f) return false;
    const id = String(f.id || '').toLowerCase();
    const status = String(f.status || '').toLowerCase();
    return (
      id === 'dem_liberal_establishment' ||
      id === 'gop_maga' ||
      id.includes('establishment') ||
      id.includes('institutional') ||
      status === 'leading' ||
      status === 'anchor'
    );
  }

  function isPopulistOrInsurgentFaction(f) {
    if (!f) return false;
    const id = String(f.id || '').toLowerCase();
    const name = String(f.name || '').toLowerCase();
    const status = String(f.status || '').toLowerCase();
    return (
      id.includes('populist') ||
      id.includes('progressive') ||
      id.includes('socialist') ||
      id.includes('maga') ||
      id.includes('insurgent') ||
      id.includes('tea_party') ||
      id.includes('working') ||
      name.includes('populist') ||
      name.includes('progressive') ||
      name.includes('insurgent') ||
      status === 'minor' ||
      status === 'fringe'
    );
  }

  const EXTREMIST_FACTION_IDS = new Set([
    'soc_revolutionary_marxists',
    'gop_far_right_nationalists',
    'const_christian_reconstructionists',
    'lib_anarcho_capitalists',
    'green_eco_radicals',
    'dem_far_left_radicals',
  ]);

  function isExtremistCandidateOrFaction(cand, faction) {
    if (cand?.isExtremist) return true;
    if (faction && EXTREMIST_FACTION_IDS.has(faction.id)) return true;
    const fid = String(cand?.factionId || faction?.id || '').toLowerCase();
    if (fid.includes('radical') || fid.includes('extremist') || fid.includes('marxist') || fid.includes('anarcho') || fid.includes('reconstructionist')) {
      return true;
    }
    if (faction?.sliders) {
      const econ = Number(faction.sliders.economic ?? 5);
      const soc = Number(faction.sliders.social ?? 5);
      if (econ <= 1.5 || econ >= 9.0 || soc <= 1.5 || soc >= 9.0) return true;
    }
    return false;
  }

  // =========================================================================
  // CATALOGS (PROPOSALS #5, #6, #9)
  // =========================================================================

  const DEFAULT_EARLY_STATES = ['IA', 'NH', 'NV', 'SC'];

  const ALL_US_STATES = [
    { id: 'AL', name: 'Alabama', region: 'South' },
    { id: 'AK', name: 'Alaska', region: 'West' },
    { id: 'AZ', name: 'Arizona', region: 'West' },
    { id: 'AR', name: 'Arkansas', region: 'South' },
    { id: 'CA', name: 'California', region: 'West' },
    { id: 'CO', name: 'Colorado', region: 'West' },
    { id: 'CT', name: 'Connecticut', region: 'Northeast' },
    { id: 'DE', name: 'Delaware', region: 'South' },
    { id: 'FL', name: 'Florida', region: 'South' },
    { id: 'GA', name: 'Georgia', region: 'South' },
    { id: 'HI', name: 'Hawaii', region: 'West' },
    { id: 'ID', name: 'Idaho', region: 'West' },
    { id: 'IL', name: 'Illinois', region: 'Midwest' },
    { id: 'IN', name: 'Indiana', region: 'Midwest' },
    { id: 'IA', name: 'Iowa', region: 'Midwest' },
    { id: 'KS', name: 'Kansas', region: 'Midwest' },
    { id: 'KY', name: 'Kentucky', region: 'South' },
    { id: 'LA', name: 'Louisiana', region: 'South' },
    { id: 'ME', name: 'Maine', region: 'Northeast' },
    { id: 'MD', name: 'Maryland', region: 'South' },
    { id: 'MA', name: 'Massachusetts', region: 'Northeast' },
    { id: 'MI', name: 'Michigan', region: 'Midwest' },
    { id: 'MN', name: 'Minnesota', region: 'Midwest' },
    { id: 'MS', name: 'Mississippi', region: 'South' },
    { id: 'MO', name: 'Missouri', region: 'Midwest' },
    { id: 'MT', name: 'Montana', region: 'West' },
    { id: 'NE', name: 'Nebraska', region: 'Midwest' },
    { id: 'NV', name: 'Nevada', region: 'West' },
    { id: 'NH', name: 'New Hampshire', region: 'Northeast' },
    { id: 'NJ', name: 'New Jersey', region: 'Northeast' },
    { id: 'NM', name: 'New Mexico', region: 'West' },
    { id: 'NY', name: 'New York', region: 'Northeast' },
    { id: 'NC', name: 'North Carolina', region: 'South' },
    { id: 'ND', name: 'North Dakota', region: 'Midwest' },
    { id: 'OH', name: 'Ohio', region: 'Midwest' },
    { id: 'OK', name: 'Oklahoma', region: 'South' },
    { id: 'OR', name: 'Oregon', region: 'West' },
    { id: 'PA', name: 'Pennsylvania', region: 'Northeast' },
    { id: 'RI', name: 'Rhode Island', region: 'Northeast' },
    { id: 'SC', name: 'South Carolina', region: 'South' },
    { id: 'SD', name: 'South Dakota', region: 'Midwest' },
    { id: 'TN', name: 'Tennessee', region: 'South' },
    { id: 'TX', name: 'Texas', region: 'South' },
    { id: 'UT', name: 'Utah', region: 'West' },
    { id: 'VT', name: 'Vermont', region: 'Northeast' },
    { id: 'VA', name: 'Virginia', region: 'South' },
    { id: 'WA', name: 'Washington', region: 'West' },
    { id: 'WV', name: 'West Virginia', region: 'South' },
    { id: 'WI', name: 'Wisconsin', region: 'Midwest' },
    { id: 'WY', name: 'Wyoming', region: 'West' },
  ];

  const PRIMARY_ALLOCATION_OPTIONS = {
    proportional_15: {
      id: 'proportional_15',
      label: 'Proportional (15% Threshold)',
      summary: 'Balanced default: viable contenders (>=15%) split state delegates proportionally.',
    },
    winner_take_all_states: {
      id: 'winner_take_all_states',
      label: 'Winner-Take-All States',
      summary: '+5 anchor faction happiness, -6 minor/insurgent happiness; decisive delegate sweeps.',
    },
    pure_proportional_no_threshold: {
      id: 'pure_proportional_no_threshold',
      label: 'Pure Proportional (0% Threshold)',
      summary: '+6 minor/ideological happiness, -5 establishment; higher brokered convention odds.',
    },
  };

  const SUPERDELEGATE_OPTIONS = [0, 15, 25];

  const ELIGIBILITY_OPTIONS = {
    closed: { id: 'closed', label: 'Closed Primary', summary: 'Registered party members only; protects base discipline.' },
    semi_open: { id: 'semi_open', label: 'Semi-Open Primary', summary: 'Unaffiliated voters may participate (+1.5 Ind Trust, -2 base happiness).' },
    open: { id: 'open', label: 'Open Primary', summary: 'Any voter may cross over (+3 Independents Trust, -4 base happiness).' },
  };

  const GOVERNING_PATRONAGE_SLOTS = [
    { id: 'sec_state', label: 'Secretary of State', icon: '🌐', portfolio: 'Foreign Affairs & Alliances' },
    { id: 'sec_treasury', label: 'Secretary of the Treasury', icon: '🏛', portfolio: 'Fiscal Policy & Markets' },
    { id: 'attorney_general', label: 'Attorney General', icon: '⚖', portfolio: 'Justice & Enforcement' },
    { id: 'sec_domestic', label: 'Secretary of Domestic Policy', icon: '🏗', portfolio: 'Infrastructure & Labor' },
    { id: 'scotus_nominee', label: 'Supreme Court Nominee', icon: '📜', portfolio: 'Constitutional Bench' },
    { id: 'chief_of_staff', label: 'White House Chief of Staff', icon: '🗝', portfolio: 'Executive Operations' },
  ];

  const OPPOSITION_PATRONAGE_SLOTS = [
    { id: 'shadow_foreign', label: 'Shadow Foreign Secretary', icon: '🌐', portfolio: 'Opposition Foreign Policy' },
    { id: 'shadow_economy', label: 'Shadow Economy Secretary', icon: '📊', portfolio: 'Economic Counter-Agenda' },
    { id: 'finance_chair', label: 'National Finance Chair', icon: '💼', portfolio: 'Donor & War-Chest Operations' },
    { id: 'house_campaign_chair', label: 'House Campaign Chair', icon: '🏛', portfolio: 'Congressional Recruitment' },
    { id: 'senate_campaign_chair', label: 'Senate Campaign Chair', icon: '⭐', portfolio: 'Statewide Battlegrounds' },
    { id: 'party_strategist', label: 'Chief Party Strategist', icon: '🧭', portfolio: 'Messaging & Coalition War Room' },
  ];

  const TECHNOCRAT_ROSTER = [
    { id: 'tech_elena_rostova', name: 'Dr. Elena Vance-Keller (Technocrat)', competence: 88, specialty: 'Macroeconomics & Treasury' },
    { id: 'tech_amb_david_chen', name: 'Amb. David Chen (Technocrat)', competence: 86, specialty: 'Statecraft & Treaties' },
    { id: 'tech_judge_martha_cole', name: 'Judge Martha Cole (Technocrat)', competence: 90, specialty: 'Constitutional Law' },
    { id: 'tech_dr_samuel_okafor', name: 'Dr. Samuel Okafor (Technocrat)', competence: 84, specialty: 'Domestic & Urban Policy' },
    { id: 'tech_claire_whitman', name: 'Claire Whitman, MPA (Technocrat)', competence: 82, specialty: 'Operations & Campaign Analytics' },
  ];

  const DIPLOMACY_UNLOCK_ERAS = new Set([
    'era_03_six_party_system',
    'era_04_proportional_mmp',
    'era_13_green_transition',
    'era_14_tripartite_corporatist',
    'era_19_charismatic_movement',
  ]);

  const PARTY_IDEOLOGY_CENTERS = {
    people: { economic: 3.5, social: 3.2, governance: 4.0, name: 'Democratic Party' },
    heritage: { economic: 7.6, social: 7.5, governance: 7.0, name: 'Republican Party' },
    liberty: { economic: 8.6, social: 3.0, governance: 8.5, name: 'Libertarian Party' },
    green: { economic: 2.0, social: 2.2, governance: 3.0, name: 'Green Party' },
    socialist: { economic: 1.2, social: 2.0, governance: 2.5, name: 'Peace and Freedom Party' },
    constitution: { economic: 8.2, social: 9.0, governance: 8.8, name: 'Constitution Party' },
  };

  // =========================================================================
  // STATE NORMALIZATION (BACKWARD-COMPATIBLE)
  // =========================================================================

  function createDefaultPrimaryRules() {
    return {
      allocation: 'proportional_15',
      superdelegatePct: 0,
      eligibility: 'closed',
      earlyStates: [...DEFAULT_EARLY_STATES],
      earlyStatesSwappedYear: null,
      lastUpdatedYear: null,
    };
  }

  function normalizePrimaryRulesForParty(raw) {
    const def = createDefaultPrimaryRules();
    if (!raw || typeof raw !== 'object') return def;
    const allocation = PRIMARY_ALLOCATION_OPTIONS[raw.allocation] ? raw.allocation : def.allocation;
    const superdelegatePct = SUPERDELEGATE_OPTIONS.includes(Number(raw.superdelegatePct)) ? Number(raw.superdelegatePct) : def.superdelegatePct;
    const eligibility = ELIGIBILITY_OPTIONS[raw.eligibility] ? raw.eligibility : def.eligibility;
    const earlyStates = Array.isArray(raw.earlyStates) && raw.earlyStates.length === 4
      ? raw.earlyStates.map((s) => String(s).toUpperCase())
      : [...def.earlyStates];
    return {
      allocation,
      superdelegatePct,
      eligibility,
      earlyStates,
      earlyStatesSwappedYear: raw.earlyStatesSwappedYear ?? null,
      lastUpdatedYear: raw.lastUpdatedYear ?? null,
    };
  }

  function normalizeCoalitionPoliticsState(game, parsed = null) {
    if (!game || typeof game !== 'object') return game;
    const src = parsed || game;
    const playerPartyId = getPlayerPartyId(game);

    const rawRules = (src.primaryRules && typeof src.primaryRules === 'object') ? src.primaryRules : {};
    const primaryRules = {};
    const partyKeys = new Set(['people', 'heritage', playerPartyId, ...Object.keys(rawRules)]);
    partyKeys.forEach((pid) => {
      primaryRules[pid] = normalizePrimaryRulesForParty(rawRules[pid]);
    });
    game.primaryRules = primaryRules;

    const rawPatronage = (src.patronageAppointments && typeof src.patronageAppointments === 'object') ? src.patronageAppointments : {};
    const patronageAppointments = {};
    partyKeys.forEach((pid) => {
      patronageAppointments[pid] = (rawPatronage[pid] && typeof rawPatronage[pid] === 'object')
        ? { ...rawPatronage[pid] }
        : {};
    });
    game.patronageAppointments = patronageAppointments;

    game.diplomacyPacts = Array.isArray(src.diplomacyPacts)
      ? src.diplomacyPacts.filter((p) => p && p.id && p.targetPartyId)
      : [];

    game.coalitionBargains = Array.isArray(src.coalitionBargains)
      ? src.coalitionBargains.filter((b) => b && b.partnerPartyId)
      : [];

    return game;
  }

  // =========================================================================
  // PROPOSAL #5: PRIMARY RULES & DELEGATE MATH ENGINEERING
  // =========================================================================

  function getPartyPrimaryRules(game, partyId) {
    const pid = partyId || getPlayerPartyId(game);
    return normalizePrimaryRulesForParty(game?.primaryRules?.[pid]);
  }

  function isPrimaryRulesEditable(game) {
    const year = Number(game?.year || 2028);
    const isPresidentialYear = year % 4 === 0;
    const isOrganizing = (game?.phase || 'organizing') === 'organizing';
    return isOrganizing && !isPresidentialYear;
  }

  function updatePrimaryRules(game, payload = {}) {
    if (!game) return game;
    const next = {
      ...game,
      factions: (game.factions || []).map((f) => ({ ...f })),
      factionHappiness: game.factionHappiness ? { ...game.factionHappiness } : undefined,
      factionStandings: game.factionStandings ? { ...game.factionStandings } : undefined,
      trust: game.trust ? { ...game.trust } : { supporters: 80, independents: 50, opponents: 15 },
      primaryRules: { ...(game.primaryRules || {}) },
    };
    normalizeCoalitionPoliticsState(next);

    if (!isPrimaryRulesEditable(next)) {
      const msg = 'Primary rules are locked in presidential years and non-organizing phases. Adjust bylaws during midterm Organizing phases.';
      return { ...next, error: msg, lastNote: msg };
    }

    const partyId = payload.partyId || getPlayerPartyId(next);
    const prevRules = getPartyPrimaryRules(next, partyId);
    const updatedRules = { ...prevRules, earlyStates: [...prevRules.earlyStates] };
    const partyFactions = next.factions.filter((f) => f.partyId === partyId);
    const changes = [];

    // 1. Allocation change
    if (payload.allocation && PRIMARY_ALLOCATION_OPTIONS[payload.allocation] && payload.allocation !== prevRules.allocation) {
      updatedRules.allocation = payload.allocation;
      if (payload.allocation === 'winner_take_all_states') {
        partyFactions.forEach((f) => {
          const cur = getFactionHappiness(next, f);
          if (isAnchorOrEstablishmentFaction(f)) {
            setFactionHappiness(next, f, cur + 5);
          } else {
            setFactionHappiness(next, f, cur - 6);
          }
        });
        changes.push('Winner-Take-All States (+5 anchor, -6 minor/insurgent happiness)');
      } else if (payload.allocation === 'pure_proportional_no_threshold') {
        partyFactions.forEach((f) => {
          const cur = getFactionHappiness(next, f);
          if (isAnchorOrEstablishmentFaction(f)) {
            setFactionHappiness(next, f, cur - 5);
          } else {
            setFactionHappiness(next, f, cur + 6);
          }
        });
        changes.push('Pure Proportional 0% Threshold (+6 minor/ideological, -5 establishment)');
      } else {
        changes.push('Proportional (15% Threshold) restored');
      }
    }

    // 2. Superdelegate % change (0, 15, or 25)
    if (payload.superdelegatePct !== undefined && SUPERDELEGATE_OPTIONS.includes(Number(payload.superdelegatePct))) {
      const nextPct = Number(payload.superdelegatePct);
      if (nextPct !== prevRules.superdelegatePct) {
        const deltaPct = nextPct - prevRules.superdelegatePct;
        // -5 populist happiness per +10% superdelegates
        const populistDelta = Math.round((-5 * deltaPct) / 10);
        partyFactions.forEach((f) => {
          if (isPopulistOrInsurgentFaction(f)) {
            setFactionHappiness(next, f, getFactionHappiness(next, f) + populistDelta);
          }
        });
        updatedRules.superdelegatePct = nextPct;
        changes.push(`Superdelegates set to ${nextPct}% (${populistDelta >= 0 ? '+' : ''}${populistDelta} populist happiness)`);
      }
    }

    // 3. Eligibility change (closed, semi_open, open)
    if (payload.eligibility && ELIGIBILITY_OPTIONS[payload.eligibility] && payload.eligibility !== prevRules.eligibility) {
      const nextElig = payload.eligibility;
      const rank = { closed: 0, semi_open: 1, open: 2 };
      const stepDiff = rank[nextElig] - rank[prevRules.eligibility];
      // open vs closed => +3 Independents Trust, -4 base happiness
      const indTrustDelta = round(stepDiff * 1.5, 1);
      const baseHapDelta = Math.round(stepDiff * -2);
      next.trust.independents = round(clamp((next.trust.independents ?? 50) + indTrustDelta, 0, 100), 1);
      partyFactions.forEach((f) => {
        setFactionHappiness(next, f, getFactionHappiness(next, f) + baseHapDelta);
      });
      updatedRules.eligibility = nextElig;
      changes.push(`Eligibility: ${ELIGIBILITY_OPTIONS[nextElig].label} (${indTrustDelta >= 0 ? '+' : ''}${indTrustDelta} Ind Trust, ${baseHapDelta >= 0 ? '+' : ''}${baseHapDelta} base happiness)`);
    }

    // 4. Early States Swap ($2M + 1 Action)
    let requestedEarlyStates = null;
    if (Array.isArray(payload.earlyStates) && payload.earlyStates.length === 4) {
      requestedEarlyStates = payload.earlyStates.map((s) => String(s).toUpperCase());
    } else if (payload.swapOutState && payload.swapInState) {
      const outSt = String(payload.swapOutState).toUpperCase();
      const inSt = String(payload.swapInState).toUpperCase();
      if (updatedRules.earlyStates.includes(outSt) && !updatedRules.earlyStates.includes(inSt)) {
        requestedEarlyStates = updatedRules.earlyStates.map((s) => (s === outSt ? inSt : s));
      }
    }

    if (requestedEarlyStates) {
      const uniqueValid = [...new Set(requestedEarlyStates)].filter((id) => ALL_US_STATES.some((s) => s.id === id));
      if (uniqueValid.length !== 4) {
        return { ...next, error: 'Early kickoff calendar must contain 4 unique valid states.' };
      }
      const sameOrder = uniqueValid.every((st, idx) => st === prevRules.earlyStates[idx]);
      if (!sameOrder) {
        const curTreasury = Number(next.treasury ?? 0);
        const curActions = Number(next.organizingActionsRemaining ?? next.actionsLeft ?? 0);
        if (curTreasury < 2.0) {
          return { ...next, error: 'Swapping early kickoff states requires $2.0M treasury.' };
        }
        if (curActions < 1) {
          return { ...next, error: 'Swapping early kickoff states requires 1 Organizing Action.' };
        }
        next.treasury = round(curTreasury - 2.0, 2);
        if (next.organizingActionsRemaining !== undefined) next.organizingActionsRemaining = Math.max(0, curActions - 1);
        if (next.actionsLeft !== undefined) next.actionsLeft = Math.max(0, Number(next.actionsLeft) - 1);
        updatedRules.earlyStates = uniqueValid;
        updatedRules.earlyStatesSwappedYear = next.year || 2030;

        // Regional faction momentum boost for newly added kickoff states
        const addedStates = uniqueValid.filter((st) => !prevRules.earlyStates.includes(st));
        const addedRegions = new Set(addedStates.map((st) => ALL_US_STATES.find((s) => s.id === st)?.region).filter(Boolean));
        partyFactions.forEach((f) => {
          const fRegion = String(f.homeRegion || f.region || '');
          if (addedRegions.has(fRegion) || addedStates.some((st) => (f.strongholdStates || []).includes(st))) {
            setFactionHappiness(next, f, getFactionHappiness(next, f) + 4);
          }
        });
        changes.push(`Kickoff calendar updated to [${uniqueValid.join(', ')}] (-$2M, -1 Action)`);
      }
    }

    updatedRules.lastUpdatedYear = next.year || 2030;
    next.primaryRules[partyId] = updatedRules;
    next.error = null;
    next.lastNote = changes.length
      ? `Rules & Bylaws Committee updated: ${changes.join('; ')}.`
      : 'Rules & Bylaws Committee reviewed without changes.';
    return next;
  }

  /**
   * Maps the 51-state schedule into dynamic waves honoring custom 4-state kickoff list.
   */
  function getEffectiveWaveStates(scheduleMap, currentWave, rules) {
    const allStates = Object.values(scheduleMap || {});
    const kickoff = Array.isArray(rules?.earlyStates) && rules.earlyStates.length === 4
      ? rules.earlyStates
      : DEFAULT_EARLY_STATES;
    const kickoffSet = new Set(kickoff);

    return allStates.filter((st) => {
      if (currentWave === 1) return kickoffSet.has(st.stateId);
      if (kickoffSet.has(st.stateId)) return false; // already voted in Wave 1
      // Displaced default Wave 1 states vote in Wave 2
      const effectiveWave = st.wave === 1 ? 2 : st.wave;
      return effectiveWave === currentWave;
    });
  }

  /**
   * Proposal #5 delegate math: supports proportional_15, winner_take_all_states, pure_proportional_no_threshold.
   */
  function allocateStateDelegatesWithRules(voteShares, stateDelegates, isMajorBonus = false, rules = null) {
    const allocation = {};
    const entries = Object.entries(voteShares || {});
    entries.forEach(([id]) => { allocation[id] = 0; });
    if (!entries.length || stateDelegates <= 0) return allocation;

    const mode = rules?.allocation || 'proportional_15';

    // 1. Winner-Take-All States: plurality winner sweeps 100% of state delegates
    if (mode === 'winner_take_all_states') {
      const sorted = [...entries].sort((a, b) => b[1] - a[1]);
      allocation[sorted[0][0]] = stateDelegates;
      return allocation;
    }

    // 2. Standard Major-Bonus rule (>50% takes all) applies only in proportional_15
    if (mode === 'proportional_15' && isMajorBonus) {
      for (const [id, share] of entries) {
        if (share > 0.50) {
          allocation[id] = stateDelegates;
          return allocation;
        }
      }
    }

    // 3. Viability threshold: 0% for pure_proportional_no_threshold, 15% for proportional_15
    const threshold = mode === 'pure_proportional_no_threshold' ? 0.0 : 0.15;
    const viable = {};
    let viableTotal = 0;
    entries.forEach(([id, share]) => {
      if (share >= threshold && share > 0) {
        viable[id] = share;
        viableTotal += share;
      }
    });

    if (viableTotal <= 0) {
      const sorted = [...entries].sort((a, b) => b[1] - a[1]);
      allocation[sorted[0][0]] = stateDelegates;
      return allocation;
    }

    // Hamilton Largest Remainder method
    let allocatedSum = 0;
    const remainders = [];
    Object.entries(viable).forEach(([id, share]) => {
      const exact = (share / viableTotal) * stateDelegates;
      const base = Math.floor(exact);
      allocation[id] = base;
      allocatedSum += base;
      remainders.push({ id, remainder: exact - base });
    });

    const surplus = stateDelegates - allocatedSum;
    remainders.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < surplus; i++) {
      const cand = remainders[i % remainders.length];
      allocation[cand.id] += 1;
    }
    return allocation;
  }

  /**
   * Evaluates superdelegate allocation, Chair brokered leverage, and REC-04 Convention Revolt.
   */
  function evaluateSuperdelegateAndConventionRevolt(game, partyId, primaries) {
    if (!game || !primaries) return { revoltTriggered: false };
    const rules = getPartyPrimaryRules(game, partyId);
    const field = primaries.primaryFieldByParty?.[partyId] || [];
    if (field.length < 2) return { revoltTriggered: false };

    const superPct = Number(rules.superdelegatePct || 0);
    // +10 chair brokered-convention leverage when superdelegates are active (>=15%)
    primaries.chairBrokeredLeverage = superPct >= 15 ? Math.max(10, Math.round((superPct / 15) * 10)) : 0;

    // Record pure pledged delegates before superdelegates are added
    field.forEach((c) => {
      if (c.pledgedDelegates === undefined) c.pledgedDelegates = Number(c.delegates || 0);
      c.superdelegates = 0;
    });

    if (superPct <= 0) return { revoltTriggered: false };

    const totalPledged = field.reduce((s, c) => s + Number(c.pledgedDelegates || 0), 0) || 3979;
    const superPool = Math.round(totalPledged * (superPct / 100));
    if (superPool <= 0) return { revoltTriggered: false };

    // Superdelegates heavily favor Chair-backed candidate or highest-fame establishment candidate
    const backedId = primaries.backedCandidateId;
    const weights = {};
    let weightSum = 0;
    field.forEach((c) => {
      let w = Math.max(5, Number(c.fame || 50) * 0.4);
      if (backedId && c.id === backedId) w += 95;
      else if (String(c.factionId || '').includes('establishment')) w += 45;
      weights[c.id] = w;
      weightSum += w;
    });

    let assigned = 0;
    field.forEach((c, idx) => {
      const share = idx === field.length - 1
        ? (superPool - assigned)
        : Math.round((weights[c.id] / weightSum) * superPool);
      c.superdelegates = Math.max(0, share);
      assigned += c.superdelegates;
      c.delegates = Number(c.pledgedDelegates || 0) + c.superdelegates;
      if (primaries.delegatesByParty?.[partyId]) {
        primaries.delegatesByParty[partyId][c.id] = c.delegates;
      }
    });

    // Check REC-04 Superdelegate Convention Revolt:
    // If plurality pledged-delegate winner loses overall lead due to superdelegates (>= 15%)
    const byPledged = [...field].sort((a, b) => (b.pledgedDelegates || 0) - (a.pledgedDelegates || 0));
    const byTotal = [...field].sort((a, b) => (b.delegates || 0) - (a.delegates || 0));
    const pledgedLeader = byPledged[0];
    const totalLeader = byTotal[0];

    if (superPct >= 15 && pledgedLeader && totalLeader && pledgedLeader.id !== totalLeader.id) {
      const targetFactions = (game.factions || []).filter((f) =>
        f.partyId === partyId && (f.id === pledgedLeader.factionId || isPopulistOrInsurgentFaction(f))
      );
      const affectedIds = [];
      targetFactions.forEach((f) => {
        const nextH = clamp(getFactionHappiness(game, f) - 25, 0, 100);
        setFactionHappiness(game, f, nextH);
        setFactionFriction(game, f, getFactionFriction(game, f) + 30);
        f.ultimatumTurnsRemaining = Math.min(f.ultimatumTurnsRemaining || 2, 2);
        affectedIds.push(f.id);
      });

      if (!Array.isArray(game.factionBoltThreats)) game.factionBoltThreats = [];
      if (pledgedLeader.factionId && !game.factionBoltThreats.some((t) => t.factionId === pledgedLeader.factionId)) {
        game.factionBoltThreats.push({
          factionId: pledgedLeader.factionId,
          reason: 'REC-04 Superdelegate Convention Revolt',
          turnsRemaining: 2,
        });
      }

      const revoltRecord = {
        triggered: true,
        partyId,
        superdelegatePct: superPct,
        robbedCandidateId: pledgedLeader.id,
        robbedCandidateName: pledgedLeader.name,
        winnerId: totalLeader.id,
        winnerName: totalLeader.name,
        happinessShock: -25,
        walkoutThreat: true,
        affectedFactionIds: affectedIds,
      };
      primaries.superdelegateRevolt = revoltRecord;
      game.lastNote = `REC-04 CONVENTION REVOLT: ${pledgedLeader.name} won the pledged-delegate plurality (${pledgedLeader.pledgedDelegates}) but was overturned by ${superPct}% superdelegates in favor of ${totalLeader.name} (-25 Happiness & walkout threat)!`;
      return { revoltTriggered: true, revolt: revoltRecord };
    }

    return { revoltTriggered: false };
  }

  // =========================================================================
  // PROPOSAL #6: CABINET, COURT & SHADOW-CABINET PATRONAGE
  // =========================================================================

  function getPatronageSlotsForParty(game, partyId) {
    const pid = partyId || getPlayerPartyId(game);
    const isGoverning = getGoverningPartyId(game) === pid;
    return {
      mode: isGoverning ? 'governing' : 'opposition',
      title: isGoverning ? 'Cabinet & Court Patronage' : 'Shadow Cabinet & Party Patronage',
      slots: isGoverning ? GOVERNING_PATRONAGE_SLOTS : OPPOSITION_PATRONAGE_SLOTS,
    };
  }

  function countPartySenateSeats(game, partyId) {
    const pid = partyId || getPlayerPartyId(game);
    if (game?.senateSeats && typeof game.senateSeats[pid] === 'number') {
      return Number(game.senateSeats[pid]);
    }
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    return sitting.filter((m) => m.office === 'senate' && (m.party === pid || m.partyId === pid || m.caucus === pid)).length;
  }

  function countPartyHouseSeats(game, partyId) {
    const pid = partyId || getPlayerPartyId(game);
    if (game?.houseSeats && typeof game.houseSeats[pid] === 'number') {
      return Number(game.houseSeats[pid]);
    }
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    const fromSitting = sitting.filter((m) => m.office === 'house' && (m.party === pid || m.partyId === pid || m.caucus === pid)).length;
    if (fromSitting > 0) return fromSitting;
    if (pid === getPlayerPartyId(game) && typeof game?.seats === 'number') return Number(game.seats);
    return 0;
  }

  function getEligiblePatronageCandidates(game, partyId) {
    const pid = partyId || getPlayerPartyId(game);
    const factions = (game?.factions || []).filter((f) => f.partyId === pid);
    const factionMap = new Map(factions.map((f) => [f.id, f]));
    const sitting = (game?.sittingMembers || []).filter((m) => m.party === pid || m.partyId === pid);
    const politicians = (game?.politicians || []).filter((m) => m.party === pid || m.partyId === pid);

    const seen = new Set();
    const candidates = [];

    // 1. Real politicians & sitting members from allied factions
    [...sitting, ...politicians].forEach((m) => {
      if (!m || !m.id || seen.has(m.id)) return;
      seen.add(m.id);
      const f = factionMap.get(m.factionId) || factions.find((x) => x.name === m.faction);
      const competence = clamp(Math.round(Number(m.quality ?? m.competence ?? ((Number(m.fame || 55) + Number(m.popularity || 55)) / 2))), 25, 98);
      candidates.push({
        id: m.id,
        name: m.name,
        factionId: f?.id || m.factionId || null,
        factionName: f?.name || m.faction || 'Party Bench',
        competence,
        isTechnocrat: false,
        isExtremist: isExtremistCandidateOrFaction(m, f),
        office: m.office || 'politician',
      });
    });

    // 2. Ensure every allied faction has at least one faction champion option
    factions.forEach((f) => {
      if (!candidates.some((c) => c.factionId === f.id)) {
        const comp = Math.round(52 + seededHash(`fac_champ:${f.id}:${game?.seed || 2028}`) * 34);
        candidates.push({
          id: `faction_champ_${f.id}`,
          name: `${f.name} Representative`,
          factionId: f.id,
          factionName: f.name,
          competence: comp,
          isTechnocrat: false,
          isExtremist: isExtremistCandidateOrFaction(null, f),
          office: 'faction_leader',
        });
      }
    });

    // 3. Non-partisan technocrats (high competence, no faction loyalty bonus)
    TECHNOCRAT_ROSTER.forEach((t) => {
      candidates.push({
        id: t.id,
        name: t.name,
        factionId: null,
        factionName: 'Non-Partisan Technocrat',
        competence: t.competence,
        isTechnocrat: true,
        isExtremist: false,
        office: 'technocrat',
      });
    });

    return candidates.sort((a, b) => (b.competence || 0) - (a.competence || 0));
  }

  function assignPatronageSlot(game, payload = {}) {
    if (!game) return game;
    const next = {
      ...game,
      factions: (game.factions || []).map((f) => ({ ...f })),
      factionHappiness: game.factionHappiness ? { ...game.factionHappiness } : undefined,
      factionStandings: game.factionStandings ? { ...game.factionStandings } : undefined,
      factionFriction: game.factionFriction ? { ...game.factionFriction } : undefined,
      patronageAppointments: JSON.parse(JSON.stringify(game.patronageAppointments || {})),
    };
    normalizeCoalitionPoliticsState(next);

    const partyId = payload.partyId || getPlayerPartyId(next);
    const slotConfig = getPatronageSlotsForParty(next, partyId);
    const slotDef = slotConfig.slots.find((s) => s.id === payload.slotId);
    if (!slotDef) {
      return { ...next, error: `Invalid patronage slot "${payload.slotId}" for ${slotConfig.mode} party.` };
    }

    const pool = getEligiblePatronageCandidates(next, partyId);
    let picked = pool.find((c) => c.id === payload.candidateId);
    if (!picked && payload.isTechnocrat) {
      picked = {
        id: payload.candidateId || TECHNOCRAT_ROSTER[0].id,
        name: payload.candidateName || TECHNOCRAT_ROSTER[0].name,
        factionId: null,
        factionName: 'Non-Partisan Technocrat',
        competence: Number(payload.competence ?? 86),
        isTechnocrat: true,
        isExtremist: false,
      };
    } else if (!picked && (payload.candidateName || payload.factionId)) {
      const f = next.factions.find((x) => x.id === payload.factionId);
      picked = {
        id: payload.candidateId || `custom_pick_${payload.slotId}_${next.year || 2028}`,
        name: payload.candidateName || (f ? `${f.name} Nominee` : 'Party Appointee'),
        factionId: f?.id || payload.factionId || null,
        factionName: f?.name || 'Allied Wing',
        competence: Number(payload.competence ?? 65),
        isTechnocrat: Boolean(payload.isTechnocrat),
        isExtremist: payload.isExtremist !== undefined ? Boolean(payload.isExtremist) : isExtremistCandidateOrFaction(payload, f),
      };
    }

    if (!picked) {
      return { ...next, error: 'Select a valid politician or technocrat to appoint.' };
    }

    // Override explicit test/payload flags if provided
    if (payload.competence !== undefined) picked.competence = clamp(Number(payload.competence), 10, 100);
    if (payload.isExtremist !== undefined) picked.isExtremist = Boolean(payload.isExtremist);
    if (payload.factionId !== undefined && !picked.factionId) picked.factionId = payload.factionId;

    // Senate Confirmation Check for Governing Party Extremist Picks without >= 50 Senate seats
    const isGoverning = slotConfig.mode === 'governing';
    const senateSeats = countPartySenateSeats(next, partyId);
    let confirmationStatus = 'not_required';
    if (isGoverning) {
      if (picked.isExtremist && senateSeats < 50) {
        const roll = seededHash(`senate_confirm:${next.seed || 2028}:${next.year || 2028}:${slotDef.id}:${picked.id}:${senateSeats}`);
        // Pass probability scales with seats; below 45 seats almost certain rejection, 45-49 narrow margin
        const passChance = senateSeats < 42 ? 0.0 : clamp((senateSeats - 40) / 18, 0.05, 0.45);
        if (roll >= passChance) {
          confirmationStatus = 'rejected';
          next.presidentialApproval = round(clamp(Number(next.presidentialApproval ?? 45) - 2.0, 10, 90), 1);
          next.lastPatronageConfirmation = {
            slotId: slotDef.id,
            candidateName: picked.name,
            senateSeats,
            status: 'rejected',
            year: next.year || 2028,
          };
          next.error = `Senate blocked ${picked.name} for ${slotDef.label} (${senateSeats} Senate seats; extremist nominee failed confirmation).`;
          next.lastNote = next.error;
          return next;
        }
        confirmationStatus = 'confirmed_narrow';
      } else {
        confirmationStatus = 'confirmed';
      }
    }

    // Apply allied faction bonuses: +10 Happiness, -15 Friction, +1 cycle bolt immunity
    const alliedFaction = picked.factionId
      ? next.factions.find((f) => f.id === picked.factionId && f.partyId === partyId)
      : null;

    if (alliedFaction) {
      setFactionHappiness(next, alliedFaction, getFactionHappiness(next, alliedFaction) + 10);
      setFactionFriction(next, alliedFaction, getFactionFriction(next, alliedFaction) - 15);
      alliedFaction.boltImmunityCycles = Math.max(1, Number(alliedFaction.boltImmunityCycles || 0) + 1);
    }

    const highCompetence = picked.competence >= 75 || picked.isTechnocrat;
    const lowCompetenceLoyalist = !picked.isTechnocrat && picked.competence < 55;
    const approvalBonusPerCycle = highCompetence ? 1.5 : 0;
    const scandalRisk = lowCompetenceLoyalist ? 0.28 : 0;

    next.patronageAppointments[partyId][slotDef.id] = {
      slotId: slotDef.id,
      slotLabel: slotDef.label,
      candidateId: picked.id,
      candidateName: picked.name,
      factionId: alliedFaction ? alliedFaction.id : (picked.factionId || null),
      factionName: alliedFaction ? alliedFaction.name : picked.factionName,
      isTechnocrat: Boolean(picked.isTechnocrat),
      competence: picked.competence,
      isExtremist: Boolean(picked.isExtremist),
      appointedYear: next.year || 2028,
      boltImmunityCycles: alliedFaction ? 1 : 0,
      approvalBonusPerCycle,
      scandalRisk,
      confirmationStatus,
    };

    next.lastPatronageConfirmation = {
      slotId: slotDef.id,
      candidateName: picked.name,
      senateSeats,
      status: confirmationStatus,
      year: next.year || 2028,
    };

    const bonusBits = [];
    if (alliedFaction) bonusBits.push(`${alliedFaction.name}: +10 Happiness, -15 Friction, +1 cycle bolt immunity`);
    if (highCompetence) bonusBits.push('+1.5 approval/cycle');
    if (lowCompetenceLoyalist) bonusBits.push('elevated scandal risk');
    next.error = null;
    next.lastNote = `Appointed ${picked.name} as ${slotDef.label}${bonusBits.length ? ` (${bonusBits.join('; ')})` : ''}.`;
    return next;
  }

  /**
   * Called from boltFaction(): vacates any patronage slots held by the bolting faction.
   */
  function vacatePatronageForFaction(game, factionId) {
    if (!game?.patronageAppointments || !factionId) return { patronageAppointments: game?.patronageAppointments || {}, vacatedSlots: [] };
    const updated = JSON.parse(JSON.stringify(game.patronageAppointments));
    const vacatedSlots = [];
    Object.keys(updated).forEach((pid) => {
      const partySlots = updated[pid] || {};
      Object.keys(partySlots).forEach((slotId) => {
        const appt = partySlots[slotId];
        if (appt && appt.factionId === factionId) {
          vacatedSlots.push({ partyId: pid, slotId, slotLabel: appt.slotLabel || slotId, candidateName: appt.candidateName });
          delete partySlots[slotId];
        }
      });
    });
    return { patronageAppointments: updated, vacatedSlots };
  }

  /**
   * Called from generateMergerCoalitionDemands(): major bolted factions can demand 1 guaranteed Cabinet/Shadow slot.
   */
  function augmentMergerDemandsWithPatronage(game, factionId, demands) {
    if (!demands || demands.blocked) return demands;
    const f = (game?.factions || []).find((x) => x.id === factionId);
    const isMajor = demands.tier === 'major';
    const wasBolted = Boolean(f && (isBoltedFaction(f) || f.formerPartyId || f.boltedYear));
    if (!isMajor || !wasBolted) return demands;

    const playerPartyId = getPlayerPartyId(game);
    const slotCfg = getPatronageSlotsForParty(game, playerPartyId);
    const existing = game?.patronageAppointments?.[playerPartyId] || {};
    const openSlot = slotCfg.slots.find((s) => !existing[s.id]) || slotCfg.slots[0];

    return {
      ...demands,
      patronageDemand: {
        required: true,
        count: 1,
        mode: slotCfg.mode,
        slotId: openSlot.id,
        slotLabel: openSlot.label,
        summary: `1 Guaranteed ${slotCfg.mode === 'governing' ? 'Cabinet' : 'Shadow Cabinet'} Slot (${openSlot.label})`,
      },
    };
  }

  /**
   * Called at cycle transition (startNextCycleInternal):
   * - Applies +1.5 approval/cycle for high-competence picks
   * - Rolls deterministic scandal risk for low-competence loyalists
   * - Decrements boltImmunityCycles
   * - Prunes expired diplomacyPacts
   */
  function processCycleTransition(game) {
    if (!game) return game;
    normalizeCoalitionPoliticsState(game);
    const nextYear = Number(game.year || 2030);
    const playerPartyId = getPlayerPartyId(game);

    // 1. Patronage cycle effects
    const partySlots = game.patronageAppointments?.[playerPartyId] || {};
    let totalApprovalDelta = 0;
    const scandals = [];

    Object.keys(partySlots).forEach((slotId) => {
      const appt = partySlots[slotId];
      if (!appt) return;
      if (Number(appt.approvalBonusPerCycle || 0) > 0) {
        totalApprovalDelta += Number(appt.approvalBonusPerCycle);
      }
      if (Number(appt.scandalRisk || 0) > 0) {
        const roll = seededHash(`patronage_scandal:${game.seed || 2028}:${nextYear}:${slotId}:${appt.candidateId}`);
        if (roll < Number(appt.scandalRisk)) {
          totalApprovalDelta -= 3.0;
          scandals.push(`${appt.candidateName} (${appt.slotLabel})`);
        }
      }
      if (appt.boltImmunityCycles > 0) {
        appt.boltImmunityCycles = Math.max(0, appt.boltImmunityCycles - 1);
      }
    });

    if (totalApprovalDelta !== 0) {
      const capped = clamp(totalApprovalDelta, -6.0, 6.0);
      if (getGoverningPartyId(game) === playerPartyId && typeof game.presidentialApproval === 'number') {
        game.presidentialApproval = round(clamp(game.presidentialApproval + capped, 10, 90), 1);
      }
      if (game.trust) {
        game.trust.independents = round(clamp((game.trust.independents ?? 50) + capped * 0.5, 0, 100), 1);
      }
    }

    // Decrement faction bolt immunity counters
    (game.factions || []).forEach((f) => {
      if (f.boltImmunityCycles > 0) {
        f.boltImmunityCycles = Math.max(0, f.boltImmunityCycles - 1);
      }
    });

    // 2. Prune expired diplomacy pacts
    if (Array.isArray(game.diplomacyPacts)) {
      game.diplomacyPacts = game.diplomacyPacts.filter((p) => !p.expiresYear || Number(p.expiresYear) > nextYear);
    }

    if (scandals.length) {
      game.lastPatronageScandal = { year: nextYear, names: scandals };
    }
    return game;
  }

  // =========================================================================
  // PROPOSAL #9: ERA-GATED INTERACTIVE COALITION & SPLINTER DIPLOMACY HUB
  // =========================================================================

  function getDiplomacyHubUnlockState(game) {
    const eraId = game?.partySystems?.currentEraId || 'era_07_baseline';
    const mmpActive = Boolean(game?.partySystems?.coalitionSystem?.mmpActive);
    const hungCongress = Array.isArray(game?.pendingKingmakerNegotiations) && game.pendingKingmakerNegotiations.length > 0;
    const contingentElection = Boolean(game?.pendingContingentElection);
    const boltedFactions = (game?.factions || []).filter(isBoltedFaction);
    const boltedCount = boltedFactions.length;

    const reasons = [];
    if (DIPLOMACY_UNLOCK_ERAS.has(eraId)) reasons.push(`Multiparty Era (${eraId})`);
    if (mmpActive) reasons.push('Proportional MMP Active');
    if (hungCongress) reasons.push('Hung Congress Negotiations');
    if (contingentElection) reasons.push('Contingent Election');
    if (boltedCount >= 3) reasons.push(`${boltedCount} Bolted Independent Factions`);

    return {
      unlocked: reasons.length > 0,
      reasons,
      eraId,
      mmpActive,
      hungCongress,
      contingentElection,
      boltedCount,
    };
  }

  function isDiplomacyHubUnlocked(game) {
    return getDiplomacyHubUnlockState(game).unlocked;
  }

  function getPartyIdeologyVector(game, partyId) {
    if (partyId === getPlayerPartyId(game) && game?.issuePositions) {
      const econ = Number(game.issuePositions['tax-economy'] ?? 5.0);
      const soc = Number(game.issuePositions['social-justice'] ?? 5.0);
      const gov = Number(game.issuePositions['democracy-policy'] ?? 5.0);
      return { economic: econ, social: soc, governance: gov };
    }
    const preset = PARTY_IDEOLOGY_CENTERS[partyId];
    if (preset) return { economic: preset.economic, social: preset.social, governance: preset.governance };
    return { economic: 5.0, social: 5.0, governance: 5.0 };
  }

  function computeIdeologicalDistance(vecA, vecB) {
    return round(Math.hypot(
      (Number(vecA?.economic ?? 5) - Number(vecB?.economic ?? 5)),
      (Number(vecA?.social ?? 5) - Number(vecB?.social ?? 5)),
      (Number(vecA?.governance ?? 5) - Number(vecB?.governance ?? 5))
    ), 2);
  }

  function getFactionBiddingWarBoard(game) {
    const bolted = (game?.factions || []).filter(isBoltedFaction);
    const activePartyIds = ['people', 'heritage', 'liberty', 'green', 'socialist', 'constitution'];
    const playerPartyId = getPlayerPartyId(game);
    if (!activePartyIds.includes(playerPartyId)) activePartyIds.unshift(playerPartyId);

    return bolted.map((f) => {
      const fVec = {
        economic: Number(f.sliders?.economic ?? 5),
        social: Number(f.sliders?.social ?? 5),
        governance: Number(f.sliders?.governance ?? 5),
      };
      const bids = activePartyIds.map((pid) => {
        const goodwill = Number(game?.factionCourtship?.[f.id]?.[pid] ?? 0);
        const dist = computeIdeologicalDistance(fVec, getPartyIdeologyVector(game, pid));
        return {
          partyId: pid,
          partyName: pid === playerPartyId ? (game?.player?.name || pid) : (PARTY_IDEOLOGY_CENTERS[pid]?.name || pid),
          goodwill,
          distance: dist,
        };
      }).sort((a, b) => b.goodwill - a.goodwill || a.distance - b.distance);

      return {
        factionId: f.id,
        factionName: f.name,
        formerPartyId: f.formerPartyId || null,
        voters: Number(game?.voterModel?.factions?.[f.id] ?? f.targetVoters ?? 0),
        bids,
      };
    });
  }

  function proposeDiplomacyPact(game, payload = {}) {
    if (!game) return game;
    const next = {
      ...game,
      diplomacyPacts: Array.isArray(game.diplomacyPacts) ? [...game.diplomacyPacts] : [],
    };
    normalizeCoalitionPoliticsState(next);

    const playerPartyId = getPlayerPartyId(next);
    const targetPartyId = String(payload.targetPartyId || '').trim();
    const stateId = String(payload.stateId || 'PA').toUpperCase();
    const pactType = payload.pactType === 'fusion' ? 'fusion' : 'stand_down';

    if (!targetPartyId || targetPartyId === playerPartyId) {
      return { ...next, error: 'Select a valid partner party for the electoral pact.' };
    }

    // Blood Rivalry check against schismParentPartyId
    const schismParent = next.player?.schismParentPartyId || next.schismParentPartyId || null;
    if (schismParent && targetPartyId === schismParent) {
      const msg = `Blood Rivalry blocks electoral pacts with your schism parent party (${PARTY_IDEOLOGY_CENTERS[schismParent]?.name || schismParent}).`;
      return { ...next, error: msg, lastNote: msg };
    }

    // Ideological adjacency check
    const dist = computeIdeologicalDistance(
      getPartyIdeologyVector(next, playerPartyId),
      getPartyIdeologyVector(next, targetPartyId)
    );
    if (dist > 4.8) {
      const msg = `Ideological distance (${dist.toFixed(1)}) is too wide for a ${pactType === 'fusion' ? 'Fusion' : 'Stand-Down'} pact with ${PARTY_IDEOLOGY_CENTERS[targetPartyId]?.name || targetPartyId}.`;
      return { ...next, error: msg, lastNote: msg };
    }

    const signedYear = Number(next.year || 2028);
    const expiresYear = Number(payload.expiresYear || (signedYear + 4));
    const pactId = `pact_${playerPartyId}_${targetPartyId}_${stateId}_${pactType}_${signedYear}`;

    if (next.diplomacyPacts.some((p) => p.targetPartyId === targetPartyId && p.stateId === stateId && p.pactType === pactType && p.expiresYear > signedYear)) {
      return { ...next, error: `An active ${pactType} pact with ${targetPartyId} in ${stateId} already exists.` };
    }

    const pact = {
      id: pactId,
      proposerPartyId: playerPartyId,
      targetPartyId,
      targetPartyName: PARTY_IDEOLOGY_CENTERS[targetPartyId]?.name || targetPartyId,
      stateId,
      pactType,
      ideologicalDistance: dist,
      signedYear,
      expiresYear,
      status: 'active',
    };
    next.diplomacyPacts.push(pact);
    next.error = null;
    next.lastNote = `Signed ${pactType === 'fusion' ? 'Electoral Fusion' : 'Non-Aggression Stand-Down'} Pact with ${pact.targetPartyName} in ${stateId} (valid through ${expiresYear}).`;
    return next;
  }

  function bargainCoalitionTable(game, payload = {}) {
    if (!game) return game;
    const next = {
      ...game,
      issuePositions: { ...(game.issuePositions || {}) },
      coalitionBargains: Array.isArray(game.coalitionBargains) ? [...game.coalitionBargains] : [],
      patronageAppointments: JSON.parse(JSON.stringify(game.patronageAppointments || {})),
    };
    normalizeCoalitionPoliticsState(next);

    const playerPartyId = getPlayerPartyId(next);
    const partnerPartyId = String(payload.partnerPartyId || '').trim();
    if (!partnerPartyId || partnerPartyId === playerPartyId) {
      return { ...next, error: 'Select a valid coalition partner party.' };
    }

    const committeeChairs = Boolean(payload.committeeChairs);
    const platformPlanks = Array.isArray(payload.platformPlanks) ? payload.platformPlanks.slice(0, 2) : [];
    const cabinetSlotId = payload.cabinetSlotId ? String(payload.cabinetSlotId) : null;

    if (!committeeChairs && platformPlanks.length === 0 && !cabinetSlotId) {
      return { ...next, error: 'Offer at least one concession (committee chairs, platform planks, or a Cabinet slot).' };
    }

    // Apply platform plank shifts (up to 2 planks toward partner ideology)
    const partnerVec = getPartyIdeologyVector(next, partnerPartyId);
    platformPlanks.forEach((issueKey) => {
      if (next.issuePositions[issueKey] !== undefined) {
        const cur = Number(next.issuePositions[issueKey]);
        const target = issueKey.includes('tax') || issueKey.includes('econ') ? partnerVec.economic : partnerVec.social;
        const delta = target > cur ? 1.0 : (target < cur ? -1.0 : 0);
        next.issuePositions[issueKey] = round(clamp(cur + delta, 1.0, 10.0), 1);
      }
    });

    // Apply Proposal #6 Cabinet / Shadow-Cabinet slot concession if offered
    let assignedSlotLabel = null;
    if (cabinetSlotId) {
      const slotCfg = getPatronageSlotsForParty(next, playerPartyId);
      const slotDef = slotCfg.slots.find((s) => s.id === cabinetSlotId);
      if (slotDef) {
        assignedSlotLabel = slotDef.label;
        next.patronageAppointments[playerPartyId][slotDef.id] = {
          slotId: slotDef.id,
          slotLabel: slotDef.label,
          candidateId: `coalition_partner_${partnerPartyId}_${slotDef.id}`,
          candidateName: `${PARTY_IDEOLOGY_CENTERS[partnerPartyId]?.name || partnerPartyId} Coalition Nominee`,
          factionId: null,
          factionName: PARTY_IDEOLOGY_CENTERS[partnerPartyId]?.name || partnerPartyId,
          partnerPartyId,
          isTechnocrat: false,
          competence: 76,
          isExtremist: false,
          appointedYear: next.year || 2028,
          boltImmunityCycles: 0,
          approvalBonusPerCycle: 1.5,
          scandalRisk: 0,
          confirmationStatus: 'coalition_accord',
        };
      }
    }

    const partnerHouse = countPartyHouseSeats(next, partnerPartyId);
    const partnerSenate = countPartySenateSeats(next, partnerPartyId);
    const bargain = {
      id: `coalition_${playerPartyId}_${partnerPartyId}_${next.year || 2028}`,
      partnerPartyId,
      partnerPartyName: PARTY_IDEOLOGY_CENTERS[partnerPartyId]?.name || partnerPartyId,
      committeeChairs,
      platformPlanks,
      cabinetSlotId,
      cabinetSlotLabel: assignedSlotLabel,
      partnerHouseSeats: partnerHouse,
      partnerSenateSeats: partnerSenate,
      signedYear: next.year || 2028,
    };

    next.coalitionBargains = next.coalitionBargains.filter((b) => b.partnerPartyId !== partnerPartyId);
    next.coalitionBargains.push(bargain);
    next.error = null;
    next.lastNote = `Coalition Governing Accord reached with ${bargain.partnerPartyName} (${[
      committeeChairs ? 'Committee Chairs' : null,
      platformPlanks.length ? `${platformPlanks.length} Platform Plank(s)` : null,
      assignedSlotLabel ? `Patronage: ${assignedSlotLabel}` : null,
    ].filter(Boolean).join(', ')}).`;
    return next;
  }

  // =========================================================================
  // UNIFIED ACTION DISPATCHER
  // =========================================================================

  const HANDLED_ACTIONS = new Set([
    'update-primary-rules',
    'assign-patronage-slot',
    'propose-diplomacy-pact',
    'bargain-coalition-table',
  ]);

  function canHandleAction(actionId) {
    return HANDLED_ACTIONS.has(actionId);
  }

  function handleAction(game, actionId, payload = {}) {
    if (actionId === 'update-primary-rules') return updatePrimaryRules(game, payload);
    if (actionId === 'assign-patronage-slot') return assignPatronageSlot(game, payload);
    if (actionId === 'propose-diplomacy-pact') return proposeDiplomacyPact(game, payload);
    if (actionId === 'bargain-coalition-table') return bargainCoalitionTable(game, payload);
    return game;
  }

  // =========================================================================
  // UI MARKUP RENDERERS (PROPOSALS #5, #6, #9)
  // =========================================================================

  function renderPrimaryRulesPanel(game) {
    const partyId = getPlayerPartyId(game);
    const rules = getPartyPrimaryRules(game, partyId);
    const editable = isPrimaryRulesEditable(game);
    const disabledAttr = editable ? '' : 'disabled';
    const lockBadge = editable
      ? '<span class="v07-mini-badge" style="background:rgba(16,185,129,0.2);border-color:#10b981;color:#6ee7b7">Open · Midterm Organizing</span>'
      : '<span class="v07-mini-badge" style="background:rgba(245,158,11,0.2);border-color:#f59e0b;color:#fcd34d">Locked · Presidential Year / Non-Organizing</span>';

    const kickoffBadges = rules.earlyStates.map((st, idx) => `
      <span class="v07-mini-badge" style="margin-right:6px">#${idx + 1} ${safeHtml(st)}</span>
    `).join('');

    const swapOutOptions = rules.earlyStates.map((st) => `<option value="${safeHtml(st)}">${safeHtml(st)}</option>`).join('');
    const swapInOptions = ALL_US_STATES
      .filter((s) => !rules.earlyStates.includes(s.id))
      .map((s) => `<option value="${safeHtml(s.id)}">${safeHtml(s.id)} — ${safeHtml(s.name)} (${safeHtml(s.region)})</option>`)
      .join('');

    return `
      <section class="panel section-panel" id="cps-primary-rules-panel" style="margin-top:16px">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Proposal #5 · Delegate Math Engineering</div>
            <h2>Rules &amp; Bylaws Committee</h2>
          </div>
          <div>${lockBadge}</div>
        </div>
        <p style="font-size:13px;opacity:0.85;margin-bottom:12px">
          Configure presidential primary delegate allocation, superdelegate leverage, voter eligibility, and the first 4 kickoff states during midterm Organizing phases.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
          <div class="v07-role-card" style="padding:12px">
            <label for="cps-rule-allocation" style="font-size:12px;font-weight:700;display:block;margin-bottom:6px">Delegate Allocation Formula</label>
            <select id="cps-rule-allocation" class="input" style="width:100%" ${disabledAttr}>
              ${Object.values(PRIMARY_ALLOCATION_OPTIONS).map((opt) =>
                `<option value="${opt.id}" ${rules.allocation === opt.id ? 'selected' : ''}>${safeHtml(opt.label)}</option>`
              ).join('')}
            </select>
            <div style="font-size:11.5px;opacity:0.75;margin-top:6px">${safeHtml(PRIMARY_ALLOCATION_OPTIONS[rules.allocation]?.summary || '')}</div>
          </div>

          <div class="v07-role-card" style="padding:12px">
            <label for="cps-rule-superdelegates" style="font-size:12px;font-weight:700;display:block;margin-bottom:6px">Unpledged Superdelegates (%)</label>
            <select id="cps-rule-superdelegates" class="input" style="width:100%" ${disabledAttr}>
              ${SUPERDELEGATE_OPTIONS.map((pct) =>
                `<option value="${pct}" ${Number(rules.superdelegatePct) === pct ? 'selected' : ''}>${pct}% ${pct === 0 ? '(None)' : pct === 15 ? '(+10 Chair Leverage, Revolt Risk)' : '(+17 Chair Leverage, High Revolt Risk)'}</option>`
              ).join('')}
            </select>
            <div style="font-size:11.5px;opacity:0.75;margin-top:6px">-5 populist happiness per +10%; overturning pledged leader triggers REC-04 Revolt (-25 Hap).</div>
          </div>

          <div class="v07-role-card" style="padding:12px">
            <label for="cps-rule-eligibility" style="font-size:12px;font-weight:700;display:block;margin-bottom:6px">Primary Voter Eligibility</label>
            <select id="cps-rule-eligibility" class="input" style="width:100%" ${disabledAttr}>
              ${Object.values(ELIGIBILITY_OPTIONS).map((opt) =>
                `<option value="${opt.id}" ${rules.eligibility === opt.id ? 'selected' : ''}>${safeHtml(opt.label)}</option>`
              ).join('')}
            </select>
            <div style="font-size:11.5px;opacity:0.75;margin-top:6px">${safeHtml(ELIGIBILITY_OPTIONS[rules.eligibility]?.summary || '')}</div>
          </div>
        </div>

        <div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding-top:10px">
          <div>
            <div style="font-size:12px;font-weight:700;margin-bottom:4px">First 4 Kickoff States: ${kickoffBadges}</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px">
              <span style="font-size:12px">Replace</span>
              <select id="cps-early-swap-out" class="input" style="width:auto" ${disabledAttr}>${swapOutOptions}</select>
              <span style="font-size:12px">with</span>
              <select id="cps-early-swap-in" class="input" style="width:auto" ${disabledAttr}>${swapInOptions}</select>
              <button type="button" class="button button-small" id="cps-swap-early-btn" ${disabledAttr}>Swap Kickoff State ($2M + 1 Act)</button>
            </div>
          </div>
          <button type="button" class="button button-gold button-small" id="cps-save-rules-btn" ${disabledAttr}>Save Primary Rules</button>
        </div>
      </section>
    `;
  }

  function renderPatronageGridPanel(game) {
    const partyId = getPlayerPartyId(game);
    const cfg = getPatronageSlotsForParty(game, partyId);
    const appts = game?.patronageAppointments?.[partyId] || {};
    const candidates = getEligiblePatronageCandidates(game, partyId);
    const senateSeats = countPartySenateSeats(game, partyId);

    const cards = cfg.slots.map((slot) => {
      const current = appts[slot.id] || null;
      const optionsHtml = [
        '<option value="">— Select Appointee —</option>',
        ...candidates.map((c) => {
          const sel = current && current.candidateId === c.id ? 'selected' : '';
          const tag = c.isTechnocrat ? 'Technocrat' : c.factionName;
          return `<option value="${safeHtml(c.id)}" ${sel}>${safeHtml(c.name)} (${safeHtml(tag)} · Comp ${c.competence})</option>`;
        }),
      ].join('');

      const statusLine = current
        ? `<div style="font-size:12px;color:#6ee7b7;margin:6px 0">
             <strong>${safeHtml(current.candidateName)}</strong> · ${safeHtml(current.factionName || 'Technocrat')} (Comp ${current.competence})
             ${current.approvalBonusPerCycle ? ' · <b>+1.5 Appr/cyc</b>' : ''}
             ${current.scandalRisk ? ' · <span style="color:#fca5a5">Scandal Risk</span>' : ''}
           </div>`
        : '<div style="font-size:12px;opacity:0.65;margin:6px 0">Vacant — Appoint an allied faction leader or technocrat.</div>';

      return `
        <article class="v07-role-card ${current ? 'filled' : 'vacant'}" data-patronage-slot="${safeHtml(slot.id)}" style="padding:12px">
          <div class="v07-role-top">
            <strong>${slot.icon} ${safeHtml(slot.label)}</strong>
            <span style="font-size:11px;opacity:0.75">${safeHtml(slot.portfolio)}</span>
          </div>
          ${statusLine}
          <div style="display:flex;gap:6px;margin-top:8px">
            <select class="input cps-patronage-select" data-slot-id="${safeHtml(slot.id)}" style="flex:1;min-width:0">${optionsHtml}</select>
            <button type="button" class="button button-small cps-assign-patronage-btn" data-slot-id="${safeHtml(slot.id)}">Appoint</button>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="panel section-panel" id="cps-patronage-panel" style="margin-top:16px">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Proposal #6 · ${cfg.mode === 'governing' ? 'Governing Administration' : 'Opposition Leadership'}</div>
            <h2>Cabinet &amp; Patronage</h2>
          </div>
          <div style="font-size:12px;opacity:0.85">
            ${cfg.mode === 'governing' ? `Senate Seats: <b>${senateSeats}</b> (50+ auto-confirms extremist picks)` : 'Opposition Shadow Slate Active'}
          </div>
        </div>
        <p style="font-size:13px;opacity:0.85;margin-bottom:12px">
          Allied faction picks grant <b>+10 Happiness</b>, <b>-15 Friction</b>, and <b>+1 cycle bolt immunity</b>. High-competence picks (&ge;75) add <b>+1.5 approval/cycle</b>.
        </p>
        <div class="v07-role-grid">${cards}</div>
      </section>
    `;
  }

  function renderDiplomacyHubTab(game) {
    const unlock = getDiplomacyHubUnlockState(game);
    if (!unlock.unlocked) {
      return '<section class="panel section-panel"><h2>Diplomacy Hub Unavailable</h2><p>Unlocks in multiparty eras, MMP, Hung Congress, or with 3+ bolted factions.</p></section>';
    }

    const playerPartyId = getPlayerPartyId(game);
    const biddingBoard = getFactionBiddingWarBoard(game);
    const activePacts = Array.isArray(game?.diplomacyPacts) ? game.diplomacyPacts : [];
    const partnerIds = Object.keys(PARTY_IDEOLOGY_CENTERS).filter((pid) => pid !== playerPartyId);
    const schismParent = game?.player?.schismParentPartyId || game?.schismParentPartyId || null;

    const playerHouse = countPartyHouseSeats(game, playerPartyId);
    const playerSenate = countPartySenateSeats(game, playerPartyId);
    const coalitionHouseExtra = (game?.coalitionBargains || []).reduce((s, b) => s + Number(b.partnerHouseSeats || 0), 0);
    const coalitionSenateExtra = (game?.coalitionBargains || []).reduce((s, b) => s + Number(b.partnerSenateSeats || 0), 0);
    const slotCfg = getPatronageSlotsForParty(game, playerPartyId);

    const biddingRows = biddingBoard.length
      ? biddingBoard.map((row) => `
          <tr>
            <td><strong>${safeHtml(row.factionName)}</strong><div style="font-size:11px;opacity:0.7">Former: ${safeHtml(row.formerPartyId || 'Independent')}</div></td>
            <td>${Number(row.voters || 0).toLocaleString()}</td>
            <td>${row.bids.slice(0, 4).map((b) => `<span class="v07-mini-badge" style="margin:2px">${safeHtml(b.partyName)}: GW ${b.goodwill} (d=${b.distance})</span>`).join('')}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="3" style="opacity:0.75">No bolted Independent factions currently on the open bidding board.</td></tr>';

    const pactRows = activePacts.length
      ? activePacts.map((p) => `
          <div class="v07-role-card filled" style="padding:10px;margin-bottom:8px">
            <strong>${safeHtml(p.pactType === 'fusion' ? 'Fusion Pact' : 'Non-Aggression Stand-Down')}</strong> with <b>${safeHtml(p.targetPartyName || p.targetPartyId)}</b> in <b>${safeHtml(p.stateId)}</b>
            <span style="font-size:12px;opacity:0.8"> · Expires ${p.expiresYear}</span>
          </div>
        `).join('')
      : '<p style="font-size:12.5px;opacity:0.75">No active electoral pacts signed yet.</p>';

    const partnerOptions = partnerIds.map((pid) => {
      const blocked = schismParent === pid ? ' [Blood Rivalry Blocked]' : '';
      return `<option value="${pid}">${safeHtml(PARTY_IDEOLOGY_CENTERS[pid].name)}${blocked}</option>`;
    }).join('');

    const stateOptions = ALL_US_STATES.map((s) => `<option value="${s.id}">${s.id} — ${safeHtml(s.name)}</option>`).join('');
    const slotOptions = [
      '<option value="">None</option>',
      ...slotCfg.slots.map((s) => `<option value="${s.id}">${safeHtml(s.label)}</option>`),
    ].join('');

    return `
      <div class="party-info-shell" id="cps-diplomacy-hub">
        <section class="panel section-panel">
          <div class="section-heading">
            <div>
              <div class="eyebrow">Proposal #9 · Coalition &amp; Splinter Diplomacy Hub</div>
              <h2>Inter-Party Diplomacy &amp; Coalition Bargaining</h2>
            </div>
            <div>${unlock.reasons.map((r) => `<span class="v07-mini-badge" style="margin-left:6px">${safeHtml(r)}</span>`).join('')}</div>
          </div>
        </section>

        <section class="panel section-panel" style="margin-top:14px">
          <div class="eyebrow">Track 1 · Open-Market Defections</div>
          <h3>Faction Bidding War Board</h3>
          <table class="table" style="width:100%;font-size:13px;margin-top:8px">
            <thead><tr><th>Bolted Faction</th><th>Voters</th><th>Party Courtship Goodwill &amp; Distance</th></tr></thead>
            <tbody>${biddingRows}</tbody>
          </table>
        </section>

        <div class="main-grid" style="margin-top:14px">
          <section class="panel section-panel">
            <div class="eyebrow">Track 2 · Electoral Coordination</div>
            <h3>Non-Aggression &amp; Fusion Pacts</h3>
            ${pactRows}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
              <select id="cps-pact-party" class="input">${partnerOptions}</select>
              <select id="cps-pact-state" class="input">${stateOptions}</select>
              <select id="cps-pact-type" class="input">
                <option value="stand_down">Non-Aggression Stand-Down</option>
                <option value="fusion">Electoral Fusion Pact</option>
              </select>
              <button type="button" class="button button-gold button-small" id="cps-propose-pact-btn">Propose Pact</button>
            </div>
          </section>

          <section class="panel section-panel">
            <div class="eyebrow">Track 3 · Parliamentary &amp; Speaker Math</div>
            <h3>Governing Coalition / Speaker Bargaining Table</h3>
            <div style="display:flex;gap:12px;margin:8px 0 12px;font-size:13px">
              <span class="v07-mini-badge">House Coalition: <b>${playerHouse + coalitionHouseExtra} / 218</b></span>
              <span class="v07-mini-badge">Senate Coalition: <b>${playerSenate + coalitionSenateExtra} / 50</b></span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <select id="cps-bargain-partner" class="input">${partnerOptions}</select>
              <label style="font-size:12.5px"><input type="checkbox" id="cps-bargain-chairs" checked /> Offer Committee Chairs &amp; Gavels</label>
              <label style="font-size:12.5px"><input type="checkbox" id="cps-bargain-plank1" /> Concede Platform Plank #1 (Tax &amp; Economy)</label>
              <label style="font-size:12.5px"><input type="checkbox" id="cps-bargain-plank2" /> Concede Platform Plank #2 (Social Justice)</label>
              <div>
                <label for="cps-bargain-slot" style="font-size:12px;display:block;margin-bottom:4px">Offer Proposal #6 Cabinet / Shadow Slot:</label>
                <select id="cps-bargain-slot" class="input" style="width:100%">${slotOptions}</select>
              </div>
              <button type="button" class="button button-gold button-small" id="cps-bargain-submit-btn">Finalize Coalition Offer</button>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // DOM EVENT BINDING (CALLED FROM app.js bindEvents)
  // =========================================================================

  function bindEvents(game, dispatchAction, render) {
    if (typeof document === 'undefined' || typeof dispatchAction !== 'function') return;

    document.querySelector('#cps-save-rules-btn')?.addEventListener('click', () => {
      const allocation = document.querySelector('#cps-rule-allocation')?.value;
      const superdelegatePct = Number(document.querySelector('#cps-rule-superdelegates')?.value ?? 0);
      const eligibility = document.querySelector('#cps-rule-eligibility')?.value;
      dispatchAction('update-primary-rules', { allocation, superdelegatePct, eligibility });
      if (typeof render === 'function') render();
    });

    document.querySelector('#cps-swap-early-btn')?.addEventListener('click', () => {
      const swapOutState = document.querySelector('#cps-early-swap-out')?.value;
      const swapInState = document.querySelector('#cps-early-swap-in')?.value;
      dispatchAction('update-primary-rules', { swapOutState, swapInState });
      if (typeof render === 'function') render();
    });

    document.querySelectorAll('.cps-assign-patronage-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slotId = btn.dataset.slotId;
        const select = document.querySelector(`.cps-patronage-select[data-slot-id="${slotId}"]`);
        const candidateId = select?.value;
        if (!candidateId) return;
        dispatchAction('assign-patronage-slot', { slotId, candidateId });
        if (typeof render === 'function') render();
      });
    });

    document.querySelector('#cps-propose-pact-btn')?.addEventListener('click', () => {
      const targetPartyId = document.querySelector('#cps-pact-party')?.value;
      const stateId = document.querySelector('#cps-pact-state')?.value;
      const pactType = document.querySelector('#cps-pact-type')?.value;
      dispatchAction('propose-diplomacy-pact', { targetPartyId, stateId, pactType });
      if (typeof render === 'function') render();
    });

    document.querySelector('#cps-bargain-submit-btn')?.addEventListener('click', () => {
      const partnerPartyId = document.querySelector('#cps-bargain-partner')?.value;
      const committeeChairs = Boolean(document.querySelector('#cps-bargain-chairs')?.checked);
      const platformPlanks = [];
      if (document.querySelector('#cps-bargain-plank1')?.checked) platformPlanks.push('tax-economy');
      if (document.querySelector('#cps-bargain-plank2')?.checked) platformPlanks.push('social-justice');
      const cabinetSlotId = document.querySelector('#cps-bargain-slot')?.value || null;
      dispatchAction('bargain-coalition-table', { partnerPartyId, committeeChairs, platformPlanks, cabinetSlotId });
      if (typeof render === 'function') render();
    });
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  const api = {
    VERSION: '0.18.4',
    DEFAULT_EARLY_STATES,
    PRIMARY_ALLOCATION_OPTIONS,
    SUPERDELEGATE_OPTIONS,
    ELIGIBILITY_OPTIONS,
    GOVERNING_PATRONAGE_SLOTS,
    OPPOSITION_PATRONAGE_SLOTS,
    TECHNOCRAT_ROSTER,
    DIPLOMACY_UNLOCK_ERAS,
    seededHash,
    normalizeCoalitionPoliticsState,
    getPartyPrimaryRules,
    isPrimaryRulesEditable,
    updatePrimaryRules,
    getEffectiveWaveStates,
    allocateStateDelegatesWithRules,
    evaluateSuperdelegateAndConventionRevolt,
    getPatronageSlotsForParty,
    getEligiblePatronageCandidates,
    assignPatronageSlot,
    vacatePatronageForFaction,
    augmentMergerDemandsWithPatronage,
    processCycleTransition,
    getDiplomacyHubUnlockState,
    isDiplomacyHubUnlocked,
    getFactionBiddingWarBoard,
    proposeDiplomacyPact,
    bargainCoalitionTable,
    canHandleAction,
    handleAction,
    renderPrimaryRulesPanel,
    renderPatronageGridPanel,
    renderDiplomacyHubTab,
    bindEvents,
  };

  if (typeof window !== 'undefined') {
    window.CoalitionPoliticsSystem = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.CoalitionPoliticsSystem = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
