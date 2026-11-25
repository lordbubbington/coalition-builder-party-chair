// ============================================================================
// Coalition Builder: Party Chair — v0.18.8 Intra-Party Faction Caucuses
// Target Module: faction-caucus-system.js
// Exports: window.FactionCaucusSystem / module.exports
// Data Contracts (Section 2G):
//   game.caucuses: Array<{
//     id, partyId, name, memberFactionIds, strength,
//     status: 'active' | 'historic' | 'solo',
//     representativeName, cyclesActive, createdYear
//   }>
//   faction.caucusId: String | null
// ============================================================================
(function (global) {
  'use strict';

  const DEFAULT_STRENGTH_NEW = 58;
  const ANTI_POACHING_MIN_STRENGTH = 45;
  const PRIMARY_COORDINATION_MIN_STRENGTH = 35;
  const PRIMARY_COORDINATION_RATE = 0.88;
  const NEGATIVE_SPLASH_BASE_RATE = 0.45;
  const POSITIVE_APPEASEMENT_BONUS_RATE = 0.50;
  const PARTNER_EXIT_HAPPINESS_PENALTY = -18;
  const PARTNER_EXIT_FRICTION_PENALTY = 20;
  const HISTORIC_FRAY_MULTIPLIER = 0.20; // -80% fray rate
  const HISTORIC_MIN_STRENGTH = 40;
  const HISTORIC_HARDENING_CHANCE = 0.20;
  const HISTORIC_MIN_CYCLES = 4;
  const THREE_PARTY_CHAOS_FRAY_MULTIPLIER = 2.0;
  const DISTANCE_THRESHOLD_BASE = 2.2;
  const DISTANCE_THRESHOLD_SHARED_ISSUE = 2.6;
  const EPS = 1e-9;

  const UNAFFILIATED_PARTY_IDS = new Set(['independent', 'unaffiliated', 'none', '']);

  const REPRESENTATIVE_POOL = [
    'Rep. Jordan Mercer',
    'Sen. Clara Vance',
    'Rep. Marcus Sterling',
    'Rep. Elena Castellanos',
    'Sen. Arthur Pendelton',
    'Rep. Naomi Takahashi',
    'Rep. Caleb Whitaker',
    'Sen. Miriam Goldstein',
    'Rep. Donovan Brooks',
    'Rep. Hannah Lindqvist',
    'Sen. Victor Morales',
    'Rep. Ruth Carmichael',
  ];

  // Exact 2028 Starting Caucuses (verified against factions-0.15.js)
  const STARTING_CAUCUS_PRESETS = [
    {
      id: 'caucus_dem_institutional',
      partyId: 'people',
      name: 'The Institutional Caucus',
      status: 'historic',
      strength: 68,
      cyclesActive: 12,
      representativeName: 'Rep. James Clyburn',
      memberFactionIds: ['dem_liberal_establishment', 'dem_black_voters', 'dem_neo_liberals'],
    },
    {
      id: 'caucus_dem_progressive',
      partyId: 'people',
      name: 'The Progressive Caucus',
      status: 'active',
      strength: 74,
      cyclesActive: 4,
      representativeName: 'Rep. Pramila Jayapal',
      memberFactionIds: ['dem_capital_l_left', 'dem_bernie_bros'],
    },
    {
      id: 'caucus_dem_blue_dog',
      partyId: 'people',
      name: 'The Blue Dog Caucus',
      status: 'active',
      strength: 66,
      cyclesActive: 4,
      representativeName: 'Rep. Jared Golden',
      memberFactionIds: ['dem_blue_dog', 'dem_traditional_latin', 'dem_faith_based_liberals'],
    },
    {
      id: 'caucus_gop_maga',
      partyId: 'heritage',
      name: 'The MAGA Caucus',
      status: 'active',
      strength: 56,
      cyclesActive: 3,
      representativeName: 'Rep. Jim Jordan',
      memberFactionIds: ['gop_maga', 'gop_blood_and_soil', 'gop_paleocons', 'gop_cubans'],
    },
    {
      id: 'caucus_gop_free_market',
      partyId: 'heritage',
      name: 'The Free-Market Caucus',
      status: 'active',
      strength: 72,
      cyclesActive: 5,
      representativeName: 'Rep. Thomas Massie',
      memberFactionIds: ['gop_western_mavericks', 'gop_suburban_moderates', 'gop_market_country_club'],
    },
    {
      id: 'caucus_gop_faith',
      partyId: 'heritage',
      name: 'The Faith Caucus',
      status: 'active',
      strength: 76,
      cyclesActive: 6,
      representativeName: 'Sen. Mike Lee',
      memberFactionIds: ['gop_faith_and_flag', 'gop_traditional_farmers', 'gop_mormons'],
    },
  ];

  const DYNAMIC_CAUCUS_NAME_ADJECTIVES = [
    'Constitutional',
    'Mainstream',
    'Reform',
    'Common-Sense',
    'Frontier',
    'Liberty',
    'Unity',
    'Renewal',
    'Civic',
    'Keystone',
    'Pragmatic',
    'Forward',
  ];

  const DYNAMIC_CAUCUS_NAME_NOUNS = [
    'Compact',
    'Caucus',
    'Alliance',
    'Coalition',
    'Study Group',
    'Working Group',
  ];

  // --------------------------------------------------------------------------
  // Deterministic Utilities (zero Math.random)
  // --------------------------------------------------------------------------

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function round(value, decimals = 2) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(n * factor) / factor;
  }

  function seededUnit(seedStr) {
    let h = 2166136261 >>> 0;
    const s = String(seedStr || 'caucus');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h >>> 0) / 4294967296;
  }

  function hashIndex(seedStr, length) {
    if (!length || length <= 0) return 0;
    return Math.floor(seededUnit(seedStr) * length) % length;
  }

  function resolveRng(rng, seedStr) {
    if (typeof rng === 'function') {
      const val = Number(rng());
      if (Number.isFinite(val)) return clamp(val, 0, 0.999999999);
    }
    return seededUnit(seedStr);
  }

  function isPartyEligibleForCaucus(partyId) {
    if (partyId === null || partyId === undefined) return false;
    return !UNAFFILIATED_PARTY_IDS.has(String(partyId).trim().toLowerCase());
  }

  function normalizeIssueKey(issue) {
    return String(issue || '')
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-');
  }

  function getNormalizedIssues(faction) {
    if (!faction || !Array.isArray(faction.keyIssues)) return [];
    return faction.keyIssues.map(normalizeIssueKey).filter(Boolean);
  }

  function sharesKeyIssue(factionA, factionB) {
    const aIssues = getNormalizedIssues(factionA);
    const bIssues = getNormalizedIssues(factionB);
    if (!aIssues.length || !bIssues.length) return false;
    const bSet = new Set(bIssues);
    return aIssues.some((iss) => bSet.has(iss));
  }

  function computeSliderDistance(factionA, factionB) {
    const sA = factionA?.sliders || {};
    const sB = factionB?.sliders || {};
    const ds = Number(sA.social ?? 5) - Number(sB.social ?? 5);
    const de = Number(sA.economic ?? 5) - Number(sB.economic ?? 5);
    const dg = Number(sA.governance ?? 5) - Number(sB.governance ?? 5);
    return Math.sqrt(ds * ds + de * de + dg * dg);
  }

  function createSoloCaucus(faction, year, existingCaucuses) {
    const existingIds = new Set((existingCaucuses || []).map((c) => c.id));
    let cid = `caucus_solo_${faction.id}`;
    let seq = 2;
    while (existingIds.has(cid)) {
      cid = `caucus_solo_${faction.id}_${seq++}`;
    }
    return {
      id: cid,
      partyId: faction.partyId,
      name: 'Solo Caucus',
      memberFactionIds: [faction.id],
      strength: 0,
      status: 'solo',
      representativeName: null,
      cyclesActive: 0,
      createdYear: Number(year || 2028),
    };
  }

  function pickRepresentativeName(game, partyId, memberIds, seedSuffix) {
    const sitting = Array.isArray(game?.sittingMembers) ? game.sittingMembers : [];
    const matchingMember = sitting.find(
      (m) => m && m.partyId === partyId && (memberIds.includes(m.factionId) || memberIds.includes(m.primaryFactionId))
    );
    if (matchingMember && matchingMember.name) {
      const prefix = matchingMember.office === 'senate' ? 'Sen.' : 'Rep.';
      return matchingMember.name.startsWith('Rep.') || matchingMember.name.startsWith('Sen.')
        ? matchingMember.name
        : `${prefix} ${matchingMember.name}`;
    }
    const idx = hashIndex(`${game?.seed || 1}:${partyId}:${memberIds.join(',')}:${seedSuffix || ''}`, REPRESENTATIVE_POOL.length);
    return REPRESENTATIVE_POOL[idx];
  }

  function generateDynamicCaucusName(game, partyId, memberFactions, existingCaucuses) {
    const usedNames = new Set((existingCaucuses || []).map((c) => String(c.name || '').toLowerCase()));
    const seedBase = `${game?.seed || 1}:${game?.year || 2028}:${partyId}:${memberFactions.map((f) => f.id).join(',')}`;
    for (let attempt = 0; attempt < 24; attempt++) {
      const adjIdx = hashIndex(`${seedBase}:adj:${attempt}`, DYNAMIC_CAUCUS_NAME_ADJECTIVES.length);
      const nounIdx = hashIndex(`${seedBase}:noun:${attempt}`, DYNAMIC_CAUCUS_NAME_NOUNS.length);
      const candidate = `The ${DYNAMIC_CAUCUS_NAME_ADJECTIVES[adjIdx]} ${DYNAMIC_CAUCUS_NAME_NOUNS[nounIdx]}`;
      if (!usedNames.has(candidate.toLowerCase())) return candidate;
    }
    return `The ${partyId.toUpperCase()} Coalition Caucus #${(existingCaucuses?.length || 0) + 1}`;
  }

  function getFactionHappinessValue(game, faction) {
    if (!faction) return 50;
    const raw = game?.factionHappiness?.[faction.id]
      ?? game?.factionHappiness?.[faction.name]
      ?? faction.happiness
      ?? faction.startingHappiness
      ?? 50;
    return clamp(Number(raw), 0, 100);
  }

  function applyDeltaToFactionMap(factions, factionHappiness, factionStandings, factionId, hDelta, fDelta) {
    const idx = factions.findIndex((f) => f && f.id === factionId);
    if (idx === -1) return null;
    const target = factions[idx];
    const currentH = clamp(
      Number(factionHappiness?.[target.id] ?? factionHappiness?.[target.name] ?? target.happiness ?? target.startingHappiness ?? 50),
      0,
      100
    );
    const nextH = hDelta !== 0 ? clamp(round(currentH + hDelta, 2), 0, 100) : currentH;
    const currentF = clamp(Number(target.frictionIndex || 0), 0, 100);
    const nextF = fDelta !== 0 ? clamp(round(currentF + fDelta, 2), 0, 100) : currentF;

    factions[idx] = {
      ...target,
      happiness: nextH,
      frictionIndex: nextF,
    };
    if (factionHappiness) {
      factionHappiness[target.id] = nextH;
      if (target.name && Object.prototype.hasOwnProperty.call(factionHappiness, target.name)) {
        factionHappiness[target.name] = nextH;
      }
    }
    if (factionStandings && Object.prototype.hasOwnProperty.call(factionStandings, target.id)) {
      factionStandings[target.id] = nextH;
    }
    return { faction: factions[idx], happiness: nextH, frictionIndex: nextF };
  }

  function syncFactionCaucusIds(factions, caucuses) {
    const membershipMap = new Map();
    for (const c of caucuses) {
      if (!c || !Array.isArray(c.memberFactionIds)) continue;
      for (const fid of c.memberFactionIds) {
        membershipMap.set(fid, c.id);
      }
    }
    return factions.map((f) => {
      if (!f) return f;
      const mapped = membershipMap.get(f.id) || null;
      return f.caucusId === mapped ? f : { ...f, caucusId: mapped };
    });
  }

  function findFactionCaucus(game, factionId) {
    const caucuses = Array.isArray(game?.caucuses) ? game.caucuses : [];
    const byMembership = caucuses.find((c) => c && Array.isArray(c.memberFactionIds) && c.memberFactionIds.includes(factionId));
    if (byMembership) return byMembership;
    const faction = Array.isArray(game?.factions) ? game.factions.find((f) => f && f.id === factionId) : null;
    if (faction && faction.caucusId) {
      return caucuses.find((c) => c && c.id === faction.caucusId) || null;
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // 1. initializeStartingCaucuses(game)
  // --------------------------------------------------------------------------

  function initializeStartingCaucuses(game) {
    if (!game || typeof game !== 'object') return game;
    const year = Number(game.year || 2028);
    const rawFactions = Array.isArray(game.factions) ? game.factions : [];
    const factionsById = new Map(rawFactions.filter(Boolean).map((f) => [f.id, f]));
    const assignedFactionIds = new Set();
    const caucuses = [];

    for (const preset of STARTING_CAUCUS_PRESETS) {
      const validMembers = preset.memberFactionIds.filter((fid) => {
        const fac = factionsById.get(fid);
        return fac && fac.partyId === preset.partyId && !assignedFactionIds.has(fid);
      });
      if (validMembers.length >= 2) {
        caucuses.push({
          id: preset.id,
          partyId: preset.partyId,
          name: preset.name,
          memberFactionIds: validMembers.slice(),
          strength: preset.strength,
          status: preset.status,
          representativeName: preset.representativeName,
          cyclesActive: preset.cyclesActive,
          createdYear: year,
        });
        validMembers.forEach((fid) => assignedFactionIds.add(fid));
      }
    }

    // Assign Solo Caucuses to all remaining party-affiliated factions (including dem_abundance, gop_neo_cons, 3rd/custom parties)
    for (const f of rawFactions) {
      if (!f || assignedFactionIds.has(f.id) || !isPartyEligibleForCaucus(f.partyId)) continue;
      caucuses.push(createSoloCaucus(f, year, caucuses));
      assignedFactionIds.add(f.id);
    }

    const updatedFactions = syncFactionCaucusIds(rawFactions, caucuses);
    return {
      ...game,
      caucuses,
      factions: updatedFactions,
    };
  }

  // --------------------------------------------------------------------------
  // 2. canFormCaucus(partyFactions, candidateFactionIds)
  // --------------------------------------------------------------------------

  function evaluateCaucusCompatibility(partyFactions, candidateFactionIds) {
    if (!Array.isArray(partyFactions) || !Array.isArray(candidateFactionIds)) {
      return { allowed: false, reason: 'invalid_input', maxDistance: Infinity };
    }
    const uniqueIds = [...new Set(candidateFactionIds.filter(Boolean))];
    if (uniqueIds.length < 2 || uniqueIds.length > 4) {
      return { allowed: false, reason: 'invalid_member_count', maxDistance: Infinity };
    }

    const candidates = uniqueIds
      .map((id) => partyFactions.find((f) => f && f.id === id))
      .filter(Boolean);
    if (candidates.length !== uniqueIds.length) {
      return { allowed: false, reason: 'missing_candidate_faction', maxDistance: Infinity };
    }

    const partyId = candidates[0].partyId;
    if (!isPartyEligibleForCaucus(partyId) || candidates.some((c) => c.partyId !== partyId)) {
      return { allowed: false, reason: 'mixed_or_unaffiliated_party', maxDistance: Infinity };
    }

    const samePartyFactions = partyFactions.filter((f) => f && f.partyId === partyId);
    if (samePartyFactions.length < 3) {
      return { allowed: false, reason: 'party_too_small', maxDistance: Infinity };
    }
    if (samePartyFactions.length - candidates.length < 1) {
      return { allowed: false, reason: 'no_faction_outside_caucus', maxDistance: Infinity };
    }

    let maxDistance = 0;
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const a = candidates[i];
        const b = candidates[j];
        const dist = computeSliderDistance(a, b);
        if (dist > maxDistance) maxDistance = dist;
        const limit = sharesKeyIssue(a, b) ? DISTANCE_THRESHOLD_SHARED_ISSUE : DISTANCE_THRESHOLD_BASE;
        if (dist > limit + EPS) {
          return {
            allowed: false,
            reason: 'ideological_distance_exceeded',
            maxDistance: round(dist, 4),
            limit,
            pair: [a.id, b.id],
          };
        }
      }
    }

    return {
      allowed: true,
      reason: 'eligible',
      maxDistance: round(maxDistance, 4),
    };
  }

  function canFormCaucus(partyFactions, candidateFactionIds) {
    return evaluateCaucusCompatibility(partyFactions, candidateFactionIds).allowed;
  }

  // --------------------------------------------------------------------------
  // 3. applyCaucusHappinessSplash(game, targetFactionId, delta, options)
  // --------------------------------------------------------------------------

  function applyCaucusHappinessSplash(game, targetFactionId, delta, options = {}) {
    if (!game || typeof game !== 'object' || !targetFactionId) return game;
    const numericDelta = Number(delta);
    if (!Number.isFinite(numericDelta) || numericDelta === 0) return game;

    const applyToTarget = options.applyToTarget !== false;
    const factions = Array.isArray(game.factions) ? game.factions.slice() : [];
    const factionHappiness = game.factionHappiness ? { ...game.factionHappiness } : null;
    const factionStandings = game.factionStandings ? { ...game.factionStandings } : null;

    if (applyToTarget) {
      const targetApplied = applyDeltaToFactionMap(factions, factionHappiness, factionStandings, targetFactionId, numericDelta, 0);
      if (!targetApplied) return game;
    }

    const caucus = findFactionCaucus(game, targetFactionId);
    const isMultiFactionCaucus = Boolean(
      caucus
      && caucus.status !== 'solo'
      && Array.isArray(caucus.memberFactionIds)
      && caucus.memberFactionIds.length >= 2
    );

    let partnerDelta = 0;
    const affectedPartnerIds = [];

    if (isMultiFactionCaucus) {
      const partnerIds = caucus.memberFactionIds.filter((id) => id && id !== targetFactionId);
      if (numericDelta < 0) {
        const strengthRatio = clamp(Number(caucus.strength || 0), 0, 100) / 100;
        partnerDelta = round(numericDelta * NEGATIVE_SPLASH_BASE_RATE * strengthRatio, 2);
      } else {
        partnerDelta = round(numericDelta * POSITIVE_APPEASEMENT_BONUS_RATE, 2);
      }

      if (partnerDelta !== 0) {
        for (const pid of partnerIds) {
          const res = applyDeltaToFactionMap(factions, factionHappiness, factionStandings, pid, partnerDelta, 0);
          if (res) affectedPartnerIds.push(pid);
        }
      }
    }

    const nextGame = {
      ...game,
      factions,
      lastCaucusSplash: {
        targetFactionId,
        delta: numericDelta,
        partnerDelta,
        affectedPartnerIds,
        caucusId: isMultiFactionCaucus ? caucus.id : null,
      },
    };
    if (factionHappiness) nextGame.factionHappiness = factionHappiness;
    if (factionStandings) nextGame.factionStandings = factionStandings;
    return nextGame;
  }

  // --------------------------------------------------------------------------
  // 4. handleCaucusPartnerExit(game, factionId, reason)
  // --------------------------------------------------------------------------

  function handleCaucusPartnerExit(game, factionId, reason = 'bolt') {
    if (!game || typeof game !== 'object' || !factionId) return game;
    const factions = Array.isArray(game.factions) ? game.factions.slice() : [];
    const factionHappiness = game.factionHappiness ? { ...game.factionHappiness } : null;
    const factionStandings = game.factionStandings ? { ...game.factionStandings } : null;
    let caucuses = Array.isArray(game.caucuses) ? game.caucuses.map((c) => ({ ...c, memberFactionIds: [...(c.memberFactionIds || [])] })) : [];

    const caucusIdx = caucuses.findIndex((c) => c && Array.isArray(c.memberFactionIds) && c.memberFactionIds.includes(factionId));
    if (caucusIdx === -1) return game;

    const targetCaucus = caucuses[caucusIdx];
    const wasMultiFaction = targetCaucus.status !== 'solo' && targetCaucus.memberFactionIds.length >= 2;
    const remainingIds = targetCaucus.memberFactionIds.filter((id) => id !== factionId);
    const penalizedPartnerIds = [];

    if (wasMultiFaction) {
      for (const partnerId of remainingIds) {
        const applied = applyDeltaToFactionMap(
          factions,
          factionHappiness,
          factionStandings,
          partnerId,
          PARTNER_EXIT_HAPPINESS_PENALTY,
          PARTNER_EXIT_FRICTION_PENALTY
        );
        if (applied) penalizedPartnerIds.push(partnerId);
      }
    }

    let dissolved = false;
    if (remainingIds.length < 2) {
      dissolved = wasMultiFaction;
      caucuses.splice(caucusIdx, 1);
      // Last surviving member converts to a Solo caucus if still affiliated with the party
      for (const remId of remainingIds) {
        const remFaction = factions.find((f) => f && f.id === remId);
        if (remFaction && isPartyEligibleForCaucus(remFaction.partyId)) {
          caucuses.push(createSoloCaucus(remFaction, game.year, caucuses));
        }
      }
    } else {
      caucuses[caucusIdx] = {
        ...targetCaucus,
        memberFactionIds: remainingIds,
      };
    }

    // If the exiting faction remains in a recognized party (e.g., expulsion from caucus while staying in party), give it a Solo caucus; if bolting out of party, clear caucusId.
    const exitingFaction = factions.find((f) => f && f.id === factionId);
    const isBoltOut = String(reason || '').toLowerCase() === 'bolt';
    if (!isBoltOut && exitingFaction && isPartyEligibleForCaucus(exitingFaction.partyId)) {
      caucuses.push(createSoloCaucus(exitingFaction, game.year, caucuses));
    }

    const syncedFactions = syncFactionCaucusIds(factions, caucuses);
    const nextGame = {
      ...game,
      caucuses,
      factions: syncedFactions,
      lastCaucusExitEvent: {
        factionId,
        reason,
        caucusId: targetCaucus.id,
        caucusName: targetCaucus.name,
        dissolved,
        penalizedPartnerIds,
        happinessDelta: wasMultiFaction ? PARTNER_EXIT_HAPPINESS_PENALTY : 0,
        frictionDelta: wasMultiFaction ? PARTNER_EXIT_FRICTION_PENALTY : 0,
      },
    };
    if (factionHappiness) nextGame.factionHappiness = factionHappiness;
    if (factionStandings) nextGame.factionStandings = factionStandings;
    return nextGame;
  }

  // --------------------------------------------------------------------------
  // 5. isProtectedByAntiPoachingLock(game, factionId)
  // --------------------------------------------------------------------------

  function isProtectedByAntiPoachingLock(game, factionId) {
    if (!game || !factionId) {
      return { locked: false, caucusName: null, strength: 0 };
    }
    const caucus = findFactionCaucus(game, factionId);
    if (!caucus || caucus.status === 'solo' || !Array.isArray(caucus.memberFactionIds) || caucus.memberFactionIds.length < 2) {
      return { locked: false, caucusName: null, strength: 0 };
    }
    const strength = Number(caucus.strength || 0);
    return {
      locked: strength >= ANTI_POACHING_MIN_STRENGTH,
      caucusName: caucus.name,
      strength,
    };
  }

  // --------------------------------------------------------------------------
  // 6. shouldCoordinatePrimary(game, factionAId, factionBId, rng, options)
  // --------------------------------------------------------------------------

  function shouldCoordinatePrimary(game, factionAId, factionBId, rng, options = {}) {
    if (!game || !factionAId || !factionBId) return false;
    if (options.isPresidential === true || options.raceKind === 'presidential') return false;
    if (factionAId === factionBId) return true;

    const caucusA = findFactionCaucus(game, factionAId);
    if (!caucusA || caucusA.status === 'solo' || !Array.isArray(caucusA.memberFactionIds) || caucusA.memberFactionIds.length < 2) {
      return false;
    }
    if (!caucusA.memberFactionIds.includes(factionBId)) return false;
    if (Number(caucusA.strength || 0) < PRIMARY_COORDINATION_MIN_STRENGTH) return false;

    const seedStr = `${game.seed || 1}:${game.year || 2028}:${caucusA.id}:${factionAId}:${factionBId}:primary`;
    const roll = resolveRng(rng, seedStr);
    return roll < PRIMARY_COORDINATION_RATE;
  }

  // --------------------------------------------------------------------------
  // 7. advanceCaucusesCycle(game, options)
  // --------------------------------------------------------------------------

  function selectBestSoloCluster(partyFactions, soloFactions) {
    if (partyFactions.length < 3 || soloFactions.length < 2) return null;

    // Generate all eligible pairs first, sorted by lowest ideological distance
    const eligiblePairs = [];
    for (let i = 0; i < soloFactions.length; i++) {
      for (let j = i + 1; j < soloFactions.length; j++) {
        const pairIds = [soloFactions[i].id, soloFactions[j].id];
        const check = evaluateCaucusCompatibility(partyFactions, pairIds);
        if (check.allowed) {
          eligiblePairs.push({ ids: pairIds, dist: check.maxDistance });
        }
      }
    }
    if (!eligiblePairs.length) return null;
    eligiblePairs.sort((a, b) => a.dist - b.dist || a.ids.join(',').localeCompare(b.ids.join(',')));

    let chosenIds = eligiblePairs[0].ids.slice();
    // Try expanding up to 3–4 if compatible Solo factions are close and >=1 faction still stays outside
    const remainingSolos = soloFactions.filter((f) => !chosenIds.includes(f.id));
    for (const candidate of remainingSolos) {
      if (chosenIds.length >= 4) break;
      const expanded = [...chosenIds, candidate.id];
      if (canFormCaucus(partyFactions, expanded)) {
        chosenIds = expanded;
      }
    }
    return chosenIds;
  }

  function advanceCaucusesCycle(game, options = {}) {
    if (!game || typeof game !== 'object') {
      return { game, events: [] };
    }
    const rng = typeof options === 'function' ? options : options.rng;
    const year = Number(game.year || 2028);
    const factions = Array.isArray(game.factions) ? game.factions.slice() : [];
    const chaosActive = Boolean(game.threePartyChaosActive || (typeof options === 'object' && options.threePartyChaosActive));
    const externalFrayMap = (typeof options === 'object' && options.externalFrayByCaucusId) || {};
    const historicMinCycles = Number((typeof options === 'object' && options.historicMinCycles) ?? HISTORIC_MIN_CYCLES);
    const formationChance = Number((typeof options === 'object' && options.formationChance) ?? 1.0);

    let workingCaucuses = Array.isArray(game.caucuses)
      ? game.caucuses.map((c) => ({ ...c, memberFactionIds: [...(c.memberFactionIds || [])] }))
      : [];

    if (workingCaucuses.length === 0 && factions.length > 0) {
      const initialized = initializeStartingCaucuses(game);
      workingCaucuses = initialized.caucuses.map((c) => ({ ...c, memberFactionIds: [...(c.memberFactionIds || [])] }));
    }

    const events = [];
    const factionsById = new Map(factions.filter(Boolean).map((f) => [f.id, f]));
    const partyFactionsMap = new Map();
    for (const f of factions) {
      if (!f || !isPartyEligibleForCaucus(f.partyId)) continue;
      if (!partyFactionsMap.has(f.partyId)) partyFactionsMap.set(f.partyId, []);
      partyFactionsMap.get(f.partyId).push(f);
    }

    const nextCaucuses = [];
    const newlyDisbandedMemberIds = [];

    for (const c of workingCaucuses) {
      if (!c) continue;
      const partyId = c.partyId;
      const validMemberIds = (c.memberFactionIds || []).filter((fid) => {
        const fac = factionsById.get(fid);
        return fac && fac.partyId === partyId;
      });

      if (c.status === 'solo') {
        if (validMemberIds.length === 1 && isPartyEligibleForCaucus(partyId)) {
          nextCaucuses.push({
            ...c,
            memberFactionIds: validMemberIds,
            strength: 0,
            cyclesActive: (c.cyclesActive || 0) + 1,
          });
        }
        continue;
      }

      const partySize = (partyFactionsMap.get(partyId) || []).length;
      const invalidSize = validMemberIds.length < 2 || partySize < 3 || validMemberIds.length >= partySize;
      if (invalidSize) {
        events.push({
          type: 'caucus_dissolved',
          reason: partySize < 3 ? 'party_below_min_factions' : (validMemberIds.length >= partySize ? 'no_outside_faction' : 'insufficient_members'),
          caucusId: c.id,
          name: c.name,
          partyId,
          memberFactionIds: validMemberIds,
        });
        newlyDisbandedMemberIds.push(...validMemberIds);
        continue;
      }

      // Compute natural fray (-3 to -4 net/cycle; 2.0x in 3-Party Chaos; -80% if Historic)
      const frayRoll = resolveRng(rng, `${game.seed || 1}:${year}:${c.id}:fray`);
      const baseFray = 3.0 + frayRoll; // [3.0, 4.0)
      const chaosMult = chaosActive ? THREE_PARTY_CHAOS_FRAY_MULTIPLIER : 1.0;
      const historicMult = c.status === 'historic' ? HISTORIC_FRAY_MULTIPLIER : 1.0;
      const extraFray = Number(externalFrayMap[c.id] || 0);
      const totalFray = round(baseFray * chaosMult * historicMult + extraFray, 2);

      const prevStrength = Number(c.strength || 0);
      const nextStrength = clamp(round(prevStrength - totalFray, 2), 0, 100);
      const nextCyclesActive = (c.cyclesActive || 0) + 1;
      let nextStatus = c.status;

      if (nextStrength <= 0) {
        events.push({
          type: 'caucus_collapsed',
          caucusId: c.id,
          name: c.name,
          partyId,
          previousStrength: prevStrength,
          strength: 0,
          frayDelta: -totalFray,
          memberFactionIds: validMemberIds,
        });
        newlyDisbandedMemberIds.push(...validMemberIds);
        continue;
      }

      events.push({
        type: 'caucus_fray',
        caucusId: c.id,
        name: c.name,
        partyId,
        previousStrength: prevStrength,
        strength: nextStrength,
        frayDelta: round(nextStrength - prevStrength, 2),
        chaosApplied: chaosActive,
        historicProtectionApplied: c.status === 'historic',
      });

      if (c.status === 'historic' && nextStrength < HISTORIC_MIN_STRENGTH) {
        nextStatus = 'active';
        events.push({
          type: 'caucus_lost_historic',
          caucusId: c.id,
          name: c.name,
          partyId,
          strength: nextStrength,
        });
      } else if (c.status === 'active' && nextCyclesActive >= historicMinCycles && nextStrength >= ANTI_POACHING_MIN_STRENGTH) {
        const hardenRoll = resolveRng(rng, `${game.seed || 1}:${year}:${c.id}:harden`);
        if (hardenRoll < HISTORIC_HARDENING_CHANCE) {
          nextStatus = 'historic';
          events.push({
            type: 'caucus_hardened_historic',
            caucusId: c.id,
            name: c.name,
            partyId,
            strength: nextStrength,
            cyclesActive: nextCyclesActive,
          });
        }
      }

      nextCaucuses.push({
        ...c,
        memberFactionIds: validMemberIds,
        strength: nextStrength,
        status: nextStatus,
        cyclesActive: nextCyclesActive,
      });
    }

    // Ensure every party-eligible faction not in a multi-faction caucus has a Solo caucus before new-formation scan
    const assignedIds = new Set();
    nextCaucuses.forEach((c) => c.memberFactionIds.forEach((fid) => assignedIds.add(fid)));
    for (const f of factions) {
      if (!f || assignedIds.has(f.id) || !isPartyEligibleForCaucus(f.partyId)) continue;
      nextCaucuses.push(createSoloCaucus(f, year, nextCaucuses));
      assignedIds.add(f.id);
    }

    // Evaluate new Caucus formations among Solo factions per eligible party
    for (const [partyId, partyFactions] of partyFactionsMap.entries()) {
      if (partyFactions.length < 3) continue;
      const soloCaucusesInParty = nextCaucuses.filter((c) => c.partyId === partyId && c.status === 'solo');
      if (soloCaucusesInParty.length < 2) continue;

      const soloFactions = soloCaucusesInParty
        .map((c) => factionsById.get(c.memberFactionIds[0]))
        .filter(Boolean);

      const candidateIds = selectBestSoloCluster(partyFactions, soloFactions);
      if (!candidateIds || candidateIds.length < 2) continue;

      const formRoll = resolveRng(rng, `${game.seed || 1}:${year}:${partyId}:form`);
      if (formRoll >= formationChance) continue;

      // Remove consumed Solo caucuses
      const consumedSet = new Set(candidateIds);
      for (let i = nextCaucuses.length - 1; i >= 0; i--) {
        const c = nextCaucuses[i];
        if (c.partyId === partyId && c.status === 'solo' && consumedSet.has(c.memberFactionIds[0])) {
          nextCaucuses.splice(i, 1);
        }
      }

      const memberObjs = candidateIds.map((id) => factionsById.get(id)).filter(Boolean);
      const avgHappiness = memberObjs.reduce((sum, f) => sum + getFactionHappinessValue(game, f), 0) / memberObjs.length;
      const startingStrength = clamp(Math.round(DEFAULT_STRENGTH_NEW + (avgHappiness - 55) * 0.2), 48, 72);
      const newName = generateDynamicCaucusName(game, partyId, memberObjs, nextCaucuses);
      const repName = pickRepresentativeName(game, partyId, candidateIds, newName);
      const newCaucus = {
        id: `caucus_${partyId}_${year}_${nextCaucuses.length + 1}`,
        partyId,
        name: newName,
        memberFactionIds: candidateIds,
        strength: startingStrength,
        status: 'active',
        representativeName: repName,
        cyclesActive: 0,
        createdYear: year,
      };
      nextCaucuses.push(newCaucus);
      events.push({
        type: 'caucus_formed',
        caucusId: newCaucus.id,
        name: newCaucus.name,
        partyId,
        strength: newCaucus.strength,
        memberFactionIds: newCaucus.memberFactionIds.slice(),
      });
    }

    const syncedFactions = syncFactionCaucusIds(factions, nextCaucuses);
    const nextGame = {
      ...game,
      caucuses: nextCaucuses,
      factions: syncedFactions,
      lastCaucusEvents: events,
    };
    return { game: nextGame, events };
  }

  // --------------------------------------------------------------------------
  // Public API & Dual UMD Export
  // --------------------------------------------------------------------------

  const api = {
    STARTING_CAUCUS_PRESETS,
    ANTI_POACHING_MIN_STRENGTH,
    PRIMARY_COORDINATION_MIN_STRENGTH,
    PRIMARY_COORDINATION_RATE,
    NEGATIVE_SPLASH_BASE_RATE,
    POSITIVE_APPEASEMENT_BONUS_RATE,
    PARTNER_EXIT_HAPPINESS_PENALTY,
    PARTNER_EXIT_FRICTION_PENALTY,
    HISTORIC_FRAY_MULTIPLIER,
    HISTORIC_MIN_STRENGTH,
    HISTORIC_HARDENING_CHANCE,
    THREE_PARTY_CHAOS_FRAY_MULTIPLIER,
    DISTANCE_THRESHOLD_BASE,
    DISTANCE_THRESHOLD_SHARED_ISSUE,
    computeSliderDistance,
    sharesKeyIssue,
    evaluateCaucusCompatibility,
    initializeStartingCaucuses,
    canFormCaucus,
    applyCaucusHappinessSplash,
    handleCaucusPartnerExit,
    isProtectedByAntiPoachingLock,
    shouldCoordinatePrimary,
    advanceCaucusesCycle,
  };

  if (typeof window !== 'undefined') {
    window.FactionCaucusSystem = api;
  }
  if (typeof global !== 'undefined') {
    global.FactionCaucusSystem = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
