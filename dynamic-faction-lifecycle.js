/**
 * Coalition Builder: Party Chair — Version 0.18.8 Dynamic Faction Lifecycle,
 * 2-Party Preservation vs. 3-Party Chaos Realignment, Mergers, Vanguard Pull & Temperaments.
 *
 * Standalone UMD/IIFE module exposing `window.DynamicFactionLifecycle` and `module.exports`.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.DynamicFactionLifecycle = api;
  }
  if (root && typeof root === 'object') {
    root.DynamicFactionLifecycle = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CHAOS_SHARE_THRESHOLD = 0.18;
  const CHAOS_SEAT_THRESHOLD = 0.15;
  const CHAOS_PARTY_COUNT = 3;

  const THRESHOLDS = {
    EMERGE_MIN_VOTERS: 350000,
    EMERGE_MAX_VOTERS: 850000,
    EMERGE_HARD_CEILING: 1000000,
    VIRAL_RUNWAY_CYCLES: 4,
    VANGUARD_CYCLES: 3,
    SEVER_MIN_VOTERS: 2500000,
    SPLIT_MIN_VOTERS: 4000000,
    CHAOS_THRESHOLD_MULT: 0.75, // -25% Sever & Split thresholds in 3-Party Chaos
    MERGER_MAX_DISTANCE: 1.8,
    MERGER_SMALL_VOTERS: 2000000,
    DISSOLUTION_MIN_VOTERS: 100000,
    LOW_COHESION_CUTOFF: 0.45,
    LOW_HAPPINESS_CUTOFF: 42,
    HIGH_FRICTION_CUTOFF: 60,
  };

  const NON_PARTY_KEYS = new Set([
    'independent', 'independents', 'unaffiliated', 'swing', 'other', 'none',
    'thirdparty', 'representedvoters', 'samplevoters', 'byparty',
  ]);

  const PROTECTED_IDENTITY_TYPES = new Set(['racial', 'identity', 'religious']);

  const FALLBACK_ISSUE_POOL = [
    'AI Safety & Automation',
    'Housing Affordability',
    'Energy Abundance',
    'Border Enforcement',
    'Deficit & Sound Money',
    'Entitlement Defense',
    'Anti-Trust & Monopolies',
    'Permitting Reform',
    'National Industrial Policy',
    'Healthcare Cost Reform',
    'Supply-Chain Resilience',
    'Civic Institutional Trust',
    'Non-Interventionism',
    'Trade & Tariffs',
    'Child & Family Tax Relief',
    'Education & Workforce',
  ];

  const FALLBACK_TONES = [
    'Pragmatic', 'Hardline', 'Reform', 'Revival', 'Common-Sense', 'Maverick',
    'Dissident', 'Vanguard', 'Principled', 'Modern', 'Forward', 'Main Street',
    'Kitchen-Table', 'Working-Family', 'Small-Business', 'Pocketbook', 'Next-Gen',
    'Old-Guard', 'Civic', 'Grassroots', 'Outsider', 'Technocratic', 'Constitutional',
    'Taxpayer', 'Blue-Collar', 'White-Collar', 'Everyday',
  ];

  const FALLBACK_MODIFIERS = [
    'Populist', 'Centrist', 'Nationalist', 'Progressive', 'Free-Market',
    'Traditional', 'Hawkish', 'Fiscally-Disciplined', 'Anti-Establishment', 'Worker-First',
  ];

  const FALLBACK_NOUNS = [
    'Advocates', 'Coalition', 'Reformers', 'Movement', 'Wing', 'Bloc',
    'Moderates', 'Populists', 'Dissidents', 'Mavericks', 'Breakaways', 'Realists',
  ];

  const FALLBACK_SUFFIXES = [
    'Alliance', 'Network', 'Initiative', 'Forum', 'Compact', 'Action Bloc', 'League', 'Caucus-Wing',
  ];

  const TEMPERAMENT_ARCHETYPES = {
    true_believer: {
      id: 'true_believer',
      label: 'True Believer',
      summary: 'High ideological loyalty while party holds primaryIssueId even during losing streaks; severe penalty if betrayed on primary issue.',
      modifiers: {
        appeasementMultiplier: 1.0,
        primaryIssueBetrayalPenalty: 1.75,
        losingStreakBoltMultiplier: 0.0,
        caucusFrayMultiplier: 0.85,
      },
    },
    fair_weather: {
      id: 'fair_weather',
      label: 'Fair-Weather',
      summary: 'Loyal during winning streaks and power; sharp happiness/cohesion drop and high bolt risk after 2 consecutive losing cycles.',
      modifiers: {
        appeasementMultiplier: 1.0,
        primaryIssueBetrayalPenalty: 1.0,
        losingStreakBoltMultiplier: 2.0,
        caucusFrayMultiplier: 1.1,
      },
    },
    transactional: {
      id: 'transactional',
      label: 'Transactional',
      summary: '+40% appeasement efficiency with budget, patronage, or endorsements; lower baseline loyalty and faster Caucus fray if neglected.',
      modifiers: {
        appeasementMultiplier: 1.4,
        primaryIssueBetrayalPenalty: 0.9,
        losingStreakBoltMultiplier: 1.15,
        caucusFrayMultiplier: 1.35,
      },
    },
  };

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function round(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(Number(value || 0) * factor) / factor;
  }

  function createSeededRng(seedVal) {
    let s = 0;
    const str = String(seedVal ?? 'v0188-lifecycle');
    for (let i = 0; i < str.length; i++) {
      s = ((s << 5) - s + str.charCodeAt(i)) | 0;
    }
    let state = (s >>> 0) || 2463534242;
    return function nextRand() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return ((state >>> 0) % 1000000) / 1000000;
    };
  }

  function resolveRng(rng, game, salt = '') {
    if (typeof rng === 'function') return rng;
    return createSeededRng(`${game?.seed ?? 2028}:${game?.year ?? 2028}:${salt}`);
  }

  function getNamingModule() {
    if (typeof window !== 'undefined' && window.ProceduralFactionNaming) {
      return window.ProceduralFactionNaming;
    }
    if (typeof globalThis !== 'undefined' && globalThis.ProceduralFactionNaming) {
      return globalThis.ProceduralFactionNaming;
    }
    if (typeof require === 'function') {
      try {
        return require('./procedural-faction-naming.js');
      } catch (_) {}
    }
    return null;
  }

  function getIdentityModule() {
    if (typeof window !== 'undefined' && window.IdentityBlocSystem) {
      return window.IdentityBlocSystem;
    }
    if (typeof globalThis !== 'undefined' && globalThis.IdentityBlocSystem) {
      return globalThis.IdentityBlocSystem;
    }
    if (typeof require === 'function') {
      try {
        return require('./identity-bloc-system.js');
      } catch (_) {}
    }
    return null;
  }

  function isProtectedIdentityBloc(faction) {
    if (!faction || typeof faction !== 'object') return false;
    const idMod = getIdentityModule();
    if (idMod && typeof idMod.isProtectedIdentityBloc === 'function') {
      if (idMod.isProtectedIdentityBloc(faction)) return true;
    }
    const typeLower = String(faction.type || '').toLowerCase();
    if (PROTECTED_IDENTITY_TYPES.has(typeLower)) return true;
    if (faction.isIdentityBloc || faction.protectedIdentityBloc || faction.isProtectedIdentity) return true;
    if (faction.birthMode === 'identity_event') return true;
    return false;
  }

  function isUnaffiliatedOrIndependentFaction(faction) {
    if (!faction) return true;
    const pid = String(faction.partyId || '').toLowerCase();
    if (!pid || NON_PARTY_KEYS.has(pid)) return true;
    return String(faction.id || '').startsWith('swg_') || String(faction.id || '').startsWith('unaff_');
  }

  function getFactionVoters(game, faction) {
    if (!faction) return 0;
    if (Number.isFinite(Number(faction.voters))) return Math.max(0, Math.round(Number(faction.voters)));
    const vmVal = game?.voterModel?.factions?.[faction.id];
    if (Number.isFinite(Number(vmVal))) return Math.max(0, Math.round(Number(vmVal)));
    if (Number.isFinite(Number(faction.targetVoters))) return Math.max(0, Math.round(Number(faction.targetVoters)));
    return 0;
  }

  function setFactionVoters(game, faction, nextVoters) {
    if (!faction) return 0;
    const clean = Math.max(0, Math.round(Number(nextVoters) || 0));
    const prev = getFactionVoters(game, faction);
    faction.voters = clean;
    faction.targetVoters = clean;
    if (game?.voterModel?.factions && typeof game.voterModel.factions === 'object') {
      game.voterModel.factions[faction.id] = clean;
    }
    if (Array.isArray(game?.voterModel?.states) && prev > 0 && clean !== prev) {
      const ratio = clean / prev;
      for (const st of game.voterModel.states) {
        if (st?.factions && Number.isFinite(Number(st.factions[faction.id]))) {
          st.factions[faction.id] = Math.max(0, Math.round(st.factions[faction.id] * ratio));
        }
      }
    }
    return clean;
  }

  function getSliderDistance(fA, fB) {
    const a = fA?.sliders || {};
    const b = fB?.sliders || {};
    const ds = Number(a.social ?? 5) - Number(b.social ?? 5);
    const de = Number(a.economic ?? 5) - Number(b.economic ?? 5);
    const dg = Number(a.governance ?? 5) - Number(b.governance ?? 5);
    return Math.sqrt(ds * ds + de * de + dg * dg);
  }

  function sharedKeyIssues(fA, fB) {
    const aIssues = (Array.isArray(fA?.keyIssues) ? fA.keyIssues : []).map((x) => String(x || '').trim()).filter(Boolean);
    const bSet = new Set((Array.isArray(fB?.keyIssues) ? fB.keyIssues : []).map((x) => String(x || '').trim().toLowerCase()).filter(Boolean));
    return aIssues.filter((iss) => bSet.has(iss.toLowerCase()));
  }

  function getIssuePool(game) {
    const pool = [];
    const pushUnique = (val) => {
      const s = String(val || '').trim();
      if (s && !pool.some((p) => p.toLowerCase() === s.toLowerCase())) {
        pool.push(s);
      }
    };
    if (Array.isArray(game?.trendingIssues)) game.trendingIssues.forEach(pushUnique);
    if (Array.isArray(game?.eraTrendingIssues)) game.eraTrendingIssues.forEach(pushUnique);
    if (Array.isArray(game?.activeShock?.issues)) game.activeShock.issues.forEach(pushUnique);
    if (game?.activeShock?.issue) pushUnique(game.activeShock.issue);
    if (game?.issueSalience && typeof game.issueSalience === 'object') {
      Object.entries(game.issueSalience)
        .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
        .forEach(([k]) => pushUnique(k));
    }
    FALLBACK_ISSUE_POOL.forEach(pushUnique);
    return pool;
  }

  function recordUsedFactionName(game, name) {
    if (!game || typeof game !== 'object' || !name) return;
    if (!Array.isArray(game.usedFactionNames)) game.usedFactionNames = [];
    const norm = String(name).trim().toLowerCase();
    if (norm && !game.usedFactionNames.includes(norm)) {
      game.usedFactionNames.push(norm);
    }
  }

  function isNameUsed(game, name) {
    const norm = String(name || '').trim().toLowerCase();
    if (!norm) return true;
    const used = Array.isArray(game?.usedFactionNames) ? game.usedFactionNames : [];
    if (used.includes(norm)) return true;
    const live = Array.isArray(game?.factions) ? game.factions : [];
    return live.some((f) => String(f?.name || '').trim().toLowerCase() === norm);
  }

  function pickFreshIssues(game, excludeList, count, rand) {
    const excludeSet = new Set((excludeList || []).map((x) => String(x || '').trim().toLowerCase()));
    const candidates = getIssuePool(game).filter((iss) => !excludeSet.has(iss.toLowerCase()));
    const picked = [];
    const pool = candidates.length >= count ? candidates.slice() : getIssuePool(game).slice();
    while (picked.length < count && pool.length > 0) {
      const idx = Math.floor(clamp(rand(), 0, 0.999999) * Math.min(pool.length, 6));
      picked.push(pool.splice(idx, 1)[0]);
    }
    while (picked.length < count) {
      picked.push(FALLBACK_ISSUE_POOL[picked.length % FALLBACK_ISSUE_POOL.length]);
    }
    return picked;
  }

  function generateFallbackUniqueName(game, birthMode, parentFaction, issues, rand) {
    const tone = FALLBACK_TONES[Math.floor(rand() * FALLBACK_TONES.length) % FALLBACK_TONES.length];
    const mod = FALLBACK_MODIFIERS[Math.floor(rand() * FALLBACK_MODIFIERS.length) % FALLBACK_MODIFIERS.length];
    const noun = FALLBACK_NOUNS[Math.floor(rand() * FALLBACK_NOUNS.length) % FALLBACK_NOUNS.length];
    const suffix = FALLBACK_SUFFIXES[Math.floor(rand() * FALLBACK_SUFFIXES.length) % FALLBACK_SUFFIXES.length];
    const issueRoot = String((issues && issues[0]) || 'Reform').split(/&|\//)[0].trim();
    const parentRoot = String(parentFaction?.name || '')
      .replace(/^the\s+/i, '')
      .split(/\s+/)[0] || mod;

    for (let attempt = 0; attempt < 40; attempt++) {
      const t = attempt === 0 ? tone : FALLBACK_TONES[(Math.floor(rand() * FALLBACK_TONES.length) + attempt) % FALLBACK_TONES.length];
      const n = attempt === 0 ? noun : FALLBACK_NOUNS[(Math.floor(rand() * FALLBACK_NOUNS.length) + attempt) % FALLBACK_NOUNS.length];
      const s = attempt === 0 ? suffix : FALLBACK_SUFFIXES[(Math.floor(rand() * FALLBACK_SUFFIXES.length) + attempt) % FALLBACK_SUFFIXES.length];
      let candidate;
      if (birthMode === 'split') {
        candidate = attempt % 2 === 0 ? `${t} ${parentRoot} ${n}` : `${mod} ${issueRoot} ${s}`;
      } else if (birthMode === 'sever') {
        candidate = attempt % 2 === 0 ? `${t} ${issueRoot} ${n}` : `${issueRoot} ${mod} ${s}`;
      } else {
        candidate = attempt % 2 === 0 ? `${t} ${issueRoot} ${n}` : `${mod} ${issueRoot} ${s}`;
      }
      if (!isNameUsed(game, candidate)) {
        recordUsedFactionName(game, candidate);
        return candidate;
      }
    }
    const fallback = `${tone} ${issueRoot} ${noun} #${(game?.factions?.length || 1) + 1}`;
    recordUsedFactionName(game, fallback);
    return fallback;
  }

  function rollFallbackTemperament(rand) {
    const r = rand();
    if (r < 0.34) return TEMPERAMENT_ARCHETYPES.true_believer;
    if (r < 0.67) return TEMPERAMENT_ARCHETYPES.fair_weather;
    return TEMPERAMENT_ARCHETYPES.transactional;
  }

  function buildChildProfile(game, params, rand) {
    const naming = getNamingModule();
    const {
      birthMode,
      parentFaction = null,
      partyId,
      voters,
      sliders,
      forcedIssues = null,
      siblingIndex = 0,
    } = params;

    if (naming && typeof naming.buildProceduralFactionProfile === 'function') {
      try {
        const activeIssues = getIssuePool(game);
        let selectedIssues = forcedIssues;
        if (!selectedIssues && typeof naming.selectChildIssues === 'function') {
          const res = naming.selectChildIssues(birthMode, parentFaction, activeIssues, rand);
          if (birthMode === 'split' && Array.isArray(res) && Array.isArray(res[0])) {
            selectedIssues = res[siblingIndex] || res[0];
          } else if (Array.isArray(res)) {
            selectedIssues = res;
          }
        }
        const prof = naming.buildProceduralFactionProfile({
          game,
          birthMode,
          parentFaction,
          partyId,
          activeIssues,
          keyIssues: selectedIssues,
          voters,
          sliders,
          siblingIndex,
          rng: rand,
        });
        if (prof && prof.name && Array.isArray(prof.keyIssues) && prof.keyIssues.length >= 2) {
          recordUsedFactionName(game, prof.name);
          const cleanVoters = Math.max(0, Math.round(Number(voters ?? prof.voters ?? prof.targetVoters ?? 400000)));
          const tempId = typeof prof.temperament === 'string'
            ? prof.temperament
            : (prof.temperament?.id || rollFallbackTemperament(rand).id);
          return {
            ...prof,
            id: prof.id || `proc_${birthMode}_${game?.year || 2028}_${Math.floor(rand() * 1e6)}`,
            partyId: partyId || prof.partyId || 'people',
            type: 'ideological',
            status: prof.status || 'minor',
            voters: cleanVoters,
            targetVoters: cleanVoters,
            sliders: sliders || prof.sliders || { social: 5, economic: 5, governance: 5 },
            keyIssues: prof.keyIssues.slice(0, 2),
            primaryIssueId: prof.primaryIssueId || prof.keyIssues[0],
            birthMode,
            parentFactionId: parentFaction ? parentFaction.id : null,
            temperament: tempId,
            viralRunwayCyclesLeft: birthMode === 'emerge' ? THRESHOLDS.VIRAL_RUNWAY_CYCLES : 0,
            vanguardCyclesLeft: birthMode === 'emerge' ? THRESHOLDS.VANGUARD_CYCLES : 0,
            isExtremist: Boolean(prof.isExtremist),
            anchorPoliticianId: null,
            happiness: Number.isFinite(Number(prof.happiness)) ? prof.happiness : 58,
            cohesion: Number.isFinite(Number(prof.cohesion)) ? prof.cohesion : 0.55,
          };
        }
      } catch (_) {}
    }

    // Inline fallback when ProceduralFactionNaming is absent or returns incomplete data
    let issues;
    if (Array.isArray(forcedIssues) && forcedIssues.length >= 2) {
      issues = forcedIssues.slice(0, 2);
    } else if (birthMode === 'split' && parentFaction) {
      const parentIssues = Array.isArray(parentFaction.keyIssues) && parentFaction.keyIssues.length >= 2
        ? parentFaction.keyIssues
        : pickFreshIssues(game, [], 2, rand);
      const inherited = parentIssues[siblingIndex % 2] || parentIssues[0];
      const fresh = pickFreshIssues(game, parentIssues, 1, rand)[0];
      issues = [inherited, fresh];
    } else if (birthMode === 'sever' && parentFaction) {
      issues = pickFreshIssues(game, parentFaction.keyIssues || [], 2, rand);
    } else {
      issues = pickFreshIssues(game, [], 2, rand);
    }

    const name = generateFallbackUniqueName(game, birthMode, parentFaction, issues, rand);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 28);
    const id = `proc_${birthMode}_${slug}_${Math.floor(rand() * 100000)}`;
    const temp = rollFallbackTemperament(rand);
    const cleanVoters = Math.max(0, Math.round(Number(voters) || 400000));
    const placedSliders = sliders || (parentFaction?.sliders
      ? {
          social: clamp(round(Number(parentFaction.sliders.social ?? 5) + (rand() - 0.5) * 1.6, 1), 1, 10),
          economic: clamp(round(Number(parentFaction.sliders.economic ?? 5) + (rand() - 0.5) * 1.6, 1), 1, 10),
          governance: clamp(round(Number(parentFaction.sliders.governance ?? 5) + (rand() - 0.5) * 1.4, 1), 1, 10),
        }
      : {
          social: clamp(round(3.5 + rand() * 3.0, 1), 1, 10),
          economic: clamp(round(3.5 + rand() * 3.0, 1), 1, 10),
          governance: clamp(round(3.5 + rand() * 3.0, 1), 1, 10),
        });

    return {
      id,
      name,
      partyId: partyId || parentFaction?.partyId || 'people',
      type: 'ideological',
      status: 'minor',
      voters: cleanVoters,
      targetVoters: cleanVoters,
      sliders: placedSliders,
      keyIssues: issues,
      primaryIssueId: issues[0],
      birthMode,
      parentFactionId: parentFaction ? parentFaction.id : null,
      viralRunwayCyclesLeft: birthMode === 'emerge' ? THRESHOLDS.VIRAL_RUNWAY_CYCLES : 0,
      vanguardCyclesLeft: birthMode === 'emerge' ? THRESHOLDS.VANGUARD_CYCLES : 0,
      temperament: temp.id,
      isExtremist: false,
      anchorPoliticianId: null,
      caucusId: null,
      happiness: 58,
      startingHappiness: 58,
      cohesion: 0.55,
      flavor: `Procedurally formed ${birthMode} movement centered on ${issues[0]} and ${issues[1]}.`,
    };
  }

  // --------------------------------------------------------------------------
  // 1. 3-Party Chaos Detection (Section 2D)
  // --------------------------------------------------------------------------

  function collectPartySharesAndSeats(game) {
    const voterByParty = {};
    let totalElectorateVoters = 0;

    // Voter shares: prefer explicit game.partyShares or voterModel.affiliations or faction sums
    if (game?.partyShares && typeof game.partyShares === 'object') {
      const entries = Object.entries(game.partyShares).filter(([k, v]) => !NON_PARTY_KEYS.has(k.toLowerCase()) && Number(v) > 0);
      const sum = entries.reduce((acc, [, v]) => acc + Number(v || 0), 0);
      const isFraction = sum > 0 && sum <= 1.05;
      entries.forEach(([k, v]) => {
        voterByParty[k] = isFraction ? Number(v) : Number(v) / 100;
      });
    } else if (game?.voterModel?.affiliations && typeof game.voterModel.affiliations === 'object') {
      const aff = game.voterModel.affiliations;
      const tot = Number(game.voterModel.representedVoters || 0);
      const partyTotals = {};
      let accAll = 0;
      Object.entries(aff).forEach(([k, entry]) => {
        if (k === 'thirdParty' && entry?.byParty) {
          Object.entries(entry.byParty).forEach(([tp, val]) => {
            const num = Number(val || 0);
            if (!NON_PARTY_KEYS.has(tp.toLowerCase())) partyTotals[tp] = (partyTotals[tp] || 0) + num;
          });
          return;
        }
        const num = typeof entry === 'number' ? entry : Number(entry?.representedVoters || 0);
        accAll += num;
        if (!NON_PARTY_KEYS.has(k.toLowerCase())) {
          partyTotals[k] = (partyTotals[k] || 0) + num;
        }
      });
      const denom = tot > 0 ? tot : Math.max(1, accAll);
      Object.entries(partyTotals).forEach(([pid, cnt]) => {
        voterByParty[pid] = cnt / denom;
      });
    } else if (Array.isArray(game?.factions) && game.factions.length > 0) {
      const partyTotals = {};
      let sumFactions = 0;
      for (const f of game.factions) {
        if (!f) continue;
        const v = getFactionVoters(game, f);
        sumFactions += v;
        const pid = String(f.partyId || '');
        if (pid && !NON_PARTY_KEYS.has(pid.toLowerCase())) {
          partyTotals[pid] = (partyTotals[pid] || 0) + v;
        }
      }
      const denom = Number(game.totalVoters || 0) > 0
        ? Number(game.totalVoters)
        : Math.max(1, sumFactions + Number(game.independentVoters || 0));
      totalElectorateVoters = denom;
      Object.entries(partyTotals).forEach(([pid, cnt]) => {
        voterByParty[pid] = cnt / denom;
      });
    }

    // Congress seats (House + Senate)
    const seatByParty = {};
    if (game?.congressSeats && typeof game.congressSeats === 'object') {
      const entries = Object.entries(game.congressSeats).filter(([k]) => !NON_PARTY_KEYS.has(k.toLowerCase()));
      const totalSeats = Math.max(
        1,
        Number(game.totalCongressSeats || 0) || Object.values(game.congressSeats).reduce((a, b) => a + Number(b || 0), 0)
      );
      entries.forEach(([k, val]) => {
        seatByParty[k] = Number(val || 0) / totalSeats;
      });
    } else if (Array.isArray(game?.sittingMembers) && game.sittingMembers.length > 0) {
      const counts = {};
      let totalFed = 0;
      for (const m of game.sittingMembers) {
        if (!m || m.vacant) continue;
        if (m.office !== 'house' && m.office !== 'senate') continue;
        totalFed += 1;
        const pid = String(m.caucus || m.partyId || m.party || '');
        if (pid && !NON_PARTY_KEYS.has(pid.toLowerCase())) {
          counts[pid] = (counts[pid] || 0) + 1;
        }
      }
      const denom = Math.max(1, totalFed);
      Object.entries(counts).forEach(([pid, cnt]) => {
        seatByParty[pid] = cnt / denom;
      });
    } else if (Array.isArray(game?.representatives) && game.representatives.length > 0) {
      const counts = {};
      let total = 0;
      for (const r of game.representatives) {
        if (!r) continue;
        total += 1;
        const pid = String(r.partyId || r.party || '');
        if (pid && !NON_PARTY_KEYS.has(pid.toLowerCase())) {
          counts[pid] = (counts[pid] || 0) + 1;
        }
      }
      const denom = Math.max(1, total);
      Object.entries(counts).forEach(([pid, cnt]) => {
        seatByParty[pid] = cnt / denom;
      });
    } else if (game?.lastElection?.nationalVote && typeof game.lastElection.nationalVote === 'object') {
      Object.entries(game.lastElection.nationalVote).forEach(([k, pct]) => {
        if (!NON_PARTY_KEYS.has(k.toLowerCase()) && voterByParty[k] === undefined) {
          voterByParty[k] = Number(pct || 0) / 100;
        }
      });
    }

    return { voterByParty, seatByParty, totalElectorateVoters };
  }

  function getThreePartyChaosDetails(game) {
    if (!game || typeof game !== 'object') {
      return { active: false, qualifyingParties: [], voterByParty: {}, seatByParty: {} };
    }
    const { voterByParty, seatByParty } = collectPartySharesAndSeats(game);
    const partySet = new Set([...Object.keys(voterByParty), ...Object.keys(seatByParty)]);
    const qualifyingParties = [];
    for (const pid of partySet) {
      const vShare = Number(voterByParty[pid] || 0);
      const sShare = Number(seatByParty[pid] || 0);
      if (vShare >= CHAOS_SHARE_THRESHOLD - 1e-9 || sShare >= CHAOS_SEAT_THRESHOLD - 1e-9) {
        qualifyingParties.push({
          partyId: pid,
          voterShare: round(vShare, 4),
          seatShare: round(sShare, 4),
        });
      }
    }
    const active = qualifyingParties.length >= CHAOS_PARTY_COUNT;
    return { active, qualifyingParties, voterByParty, seatByParty };
  }

  function detectThreePartyChaos(game) {
    if (!game || typeof game !== 'object') return false;
    const details = getThreePartyChaosDetails(game);
    game.threePartyChaosActive = details.active;
    return details.active;
  }

  // --------------------------------------------------------------------------
  // 2. High-Impact Cycle Growth, Decline & 2-Party vs 3-Party Flows
  // --------------------------------------------------------------------------

  function classifyFactionDriver(game, faction, options) {
    if (options?.tailwindFactionIds?.includes(faction.id)) return 'tailwind';
    if (options?.collapseFactionIds?.includes(faction.id)) return 'collapse';
    if (options?.sunsetFactionIds?.includes(faction.id)) return 'sunset';

    if (faction.growthDriver === 'tailwind' || faction.growthDriver === 'collapse' || faction.growthDriver === 'sunset') {
      return faction.growthDriver;
    }

    const hap = Number(game?.factionHappiness?.[faction.id] ?? faction.happiness ?? 55);
    const fric = Number(faction.frictionIndex ?? 0);
    if (faction.collapseShock || (hap < 30 && fric >= 65)) {
      return 'collapse';
    }

    const fIssuesLower = (faction.keyIssues || []).map((x) => String(x || '').trim().toLowerCase());
    const sunsetSet = new Set((game?.sunsetIssues || []).map((x) => String(x || '').trim().toLowerCase()));
    if (fIssuesLower.some((i) => sunsetSet.has(i))) {
      return 'sunset';
    }

    const trendingSet = new Set([
      ...(game?.trendingIssues || []),
      ...(game?.eraTrendingIssues || []),
    ].map((x) => String(x || '').trim().toLowerCase()));
    if (fIssuesLower.some((i) => trendingSet.has(i))) {
      return 'tailwind';
    }

    const salienceMap = game?.issueSalience || {};
    for (const iss of (faction.keyIssues || [])) {
      const sal = Number(salienceMap[iss] ?? salienceMap[String(iss || '').toLowerCase()]);
      if (Number.isFinite(sal)) {
        if (sal >= 75) return 'tailwind';
        if (sal <= 25) return 'sunset';
      }
    }

    return 'organic';
  }

  function applyCycleGrowthAndDecline(game, options = {}) {
    if (!game || !Array.isArray(game.factions)) {
      return { threePartyChaosActive: false, changes: [], totalVotersBefore: 0, totalVotersAfter: 0 };
    }
    const rand = resolveRng(options.rng, game, 'growth-decline');
    const chaos = typeof options.chaosActive === 'boolean'
      ? options.chaosActive
      : (typeof game.threePartyChaosActive === 'boolean' ? game.threePartyChaosActive : detectThreePartyChaos(game));
    game.threePartyChaosActive = chaos;

    const volatilityMult = chaos
      ? (Number.isFinite(Number(options.chaosVolatilityMultiplier))
        ? Number(options.chaosVolatilityMultiplier)
        : (2.0 + rand() * 0.5))
      : 1.0;

    const initialById = {};
    let totalFactionsBefore = 0;
    for (const f of game.factions) {
      const v = getFactionVoters(game, f);
      initialById[f.id] = v;
      totalFactionsBefore += v;
    }
    const totalIndBefore = Math.max(0, Math.round(Number(game.independentVoters || 0)));
    const totalBefore = totalFactionsBefore + totalIndBefore;

    const changes = [];
    const decliningTransfers = [];
    const pendingGrowth = [];

    for (const f of game.factions) {
      const curV = initialById[f.id];
      if (isProtectedIdentityBloc(f)) {
        f.lastCycleGrowthPct = 0;
        f.lastCycleVoterDelta = 0;
        changes.push({
          factionId: f.id,
          name: f.name,
          partyId: f.partyId,
          protected: true,
          before: curV,
          after: curV,
          delta: 0,
          driver: 'identity_protected',
        });
        continue;
      }

      const driver = classifyFactionDriver(game, f, options);
      let pct = 0;
      let usedViralRunway = false;

      if (Number(f.viralRunwayCyclesLeft || 0) > 0 && driver !== 'collapse') {
        pct = 0.35 + rand() * 0.20; // +35% to +55%
        f.viralRunwayCyclesLeft = Math.max(0, Number(f.viralRunwayCyclesLeft) - 1);
        usedViralRunway = true;
      } else if (driver === 'tailwind') {
        pct = (0.12 + rand() * 0.10) * volatilityMult; // +12% to +22% (scaled in chaos)
      } else if (driver === 'sunset') {
        pct = -(0.15 + rand() * 0.07) * volatilityMult; // -15% to -22% (scaled in chaos)
      } else if (driver === 'collapse') {
        pct = -(0.25 + rand() * 0.10) * volatilityMult; // -25% to -35% (scaled in chaos)
      } else {
        const hap = Number(game.factionHappiness?.[f.id] ?? f.happiness ?? 55);
        const appeal = Number(f.growthProfile?.demographicAppeal ?? 1.0);
        const rawDrift = ((hap - 50) * 0.0012 + (appeal - 1.0) * 0.04 + (rand() - 0.48) * 0.06);
        pct = clamp(rawDrift, -0.06, 0.07) * volatilityMult;
      }

      // [QA-BATCH2-FIX] B2-06: Clamp extreme single-cycle contraction to <= 35% (45% in 3-party chaos)
      pct = clamp(pct, chaos ? -0.45 : -0.35, 1.25);
      const rawDelta = Math.round(curV * pct);

      if (rawDelta < 0) {
        const lost = Math.min(curV, Math.abs(rawDelta));
        setFactionVoters(game, f, curV - lost);
        f.trend = driver === 'collapse' ? 'collapsing' : 'declining';
        decliningTransfers.push({
          sourceFaction: f,
          lostVoters: lost,
          driver,
        });
      } else if (rawDelta > 0) {
        f.trend = 'rising';
        pendingGrowth.push({
          faction: f,
          wantedGain: rawDelta,
          usedViralRunway,
          driver: usedViralRunway ? 'viral_runway' : driver,
        });
      } else {
        f.trend = 'stable';
      }
    }

    // Apply growth (drawn from independent pool / swing factions when present to keep 155M conservation)
    const independentPoolFactions = game.factions.filter((x) => !isProtectedIdentityBloc(x) && isUnaffiliatedOrIndependentFaction(x));
    const hasExplicitIndPool = Number.isFinite(Number(game.independentVoters)) && Number(game.independentVoters) >= 0;

    for (const item of pendingGrowth) {
      const f = item.faction;
      let granted = item.wantedGain;

      if (hasExplicitIndPool) {
        const availInd = Math.max(0, Math.round(Number(game.independentVoters || 0)));
        if (availInd >= granted) {
          game.independentVoters = availInd - granted;
        } else {
          const fromInd = availInd;
          game.independentVoters = 0;
          let rem = granted - fromInd;
          const donors = independentPoolFactions.filter((d) => d.id !== f.id && getFactionVoters(game, d) > 100000);
          const availDonorSum = donors.reduce((s, d) => s + Math.max(0, getFactionVoters(game, d) - 100000), 0);
          if (availDonorSum > 0) {
            const take = Math.min(rem, availDonorSum);
            let left = take;
            donors.forEach((d, idx) => {
              const curD = getFactionVoters(game, d);
              const capD = Math.max(0, curD - 100000);
              const share = idx === donors.length - 1 ? left : Math.min(capD, Math.round(take * (capD / availDonorSum)));
              setFactionVoters(game, d, curD - share);
              left -= share;
            });
            rem -= take;
          }
          if (options.strictConservation) {
            granted = fromInd + (granted - fromInd - rem);
          }
        }
      } else if (independentPoolFactions.some((d) => d.id !== f.id)) {
        const donors = independentPoolFactions.filter((d) => d.id !== f.id && getFactionVoters(game, d) > 100000);
        const availDonorSum = donors.reduce((s, d) => s + Math.max(0, getFactionVoters(game, d) - 100000), 0);
        if (availDonorSum >= granted) {
          let left = granted;
          donors.forEach((d, idx) => {
            const curD = getFactionVoters(game, d);
            const capD = Math.max(0, curD - 100000);
            const share = idx === donors.length - 1 ? left : Math.min(capD, Math.round(granted * (capD / availDonorSum)));
            setFactionVoters(game, d, curD - share);
            left -= share;
          });
        } else if (options.strictConservation) {
          granted = availDonorSum;
          donors.forEach((d) => setFactionVoters(game, d, Math.min(getFactionVoters(game, d), 100000)));
        }
      }

      setFactionVoters(game, f, getFactionVoters(game, f) + granted);
    }

    // Redistribute declining voters under 2-Party Preservation vs 3-Party Chaos Spillover
    const transferRecords = [];
    for (const entry of decliningTransfers) {
      const src = entry.sourceFaction;
      const lost = entry.lostVoters;
      if (lost <= 0) continue;

      const srcPid = src.partyId;
      const samePartyTargets = game.factions.filter((t) =>
        t && t.id !== src.id && t.partyId === srcPid && !isProtectedIdentityBloc(t)
      );
      const otherPartyTargets = game.factions.filter((t) =>
        t && t.id !== src.id && t.partyId !== srcPid && !isProtectedIdentityBloc(t)
      );
      const indTargets = game.factions.filter((t) =>
        t && t.id !== src.id && isUnaffiliatedOrIndependentFaction(t) && !isProtectedIdentityBloc(t)
      );

      let retentionRate;
      if (!chaos) {
        retentionRate = samePartyTargets.length > 0 ? (0.85 + rand() * 0.05) : 0; // 85% - 90%
      } else {
        retentionRate = samePartyTargets.length > 0 ? (0.35 + rand() * 0.10) : 0; // 35% - 45%
      }

      const retainedAmount = Math.round(lost * retentionRate);
      const leakAmount = lost - retainedAmount;

      // Distribute retainedAmount within same party (weighted toward rising & close ideology)
      if (retainedAmount > 0 && samePartyTargets.length > 0) {
        const weights = samePartyTargets.map((t) => {
          const dist = getSliderDistance(src, t);
          const risingBoost = t.trend === 'rising' ? 2.0 : 1.0;
          const issueBonus = sharedKeyIssues(src, t).length > 0 ? 1.4 : 1.0;
          return (1 / (0.6 + dist)) * risingBoost * issueBonus;
        });
        const wSum = weights.reduce((a, b) => a + b, 0) || 1;
        let rem = retainedAmount;
        samePartyTargets.forEach((t, idx) => {
          const add = idx === samePartyTargets.length - 1 ? rem : Math.round(retainedAmount * (weights[idx] / wSum));
          rem -= add;
          setFactionVoters(game, t, getFactionVoters(game, t) + add);
        });
      }

      // Distribute leakAmount:
      // In 2-party equilibrium: goes to Independents (game.independentVoters and/or swg_* factions).
      // In 3-party chaos: spills across ALL other active parties + Independents with high randomness.
      if (leakAmount > 0) {
        if (!chaos) {
          if (hasExplicitIndPool || indTargets.length === 0) {
            game.independentVoters = Math.max(0, Math.round(Number(game.independentVoters || 0)) + leakAmount);
          } else {
            let rem = leakAmount;
            indTargets.forEach((t, idx) => {
              const add = idx === indTargets.length - 1 ? rem : Math.round(leakAmount / indTargets.length);
              rem -= add;
              setFactionVoters(game, t, getFactionVoters(game, t) + add);
            });
          }
        } else {
          // Chaos spillover across other parties + independents
          const poolTargets = otherPartyTargets.slice();
          if (poolTargets.length === 0) {
            game.independentVoters = Math.max(0, Math.round(Number(game.independentVoters || 0)) + leakAmount);
          } else {
            const indCut = hasExplicitIndPool ? Math.round(leakAmount * (0.20 + rand() * 0.15)) : 0;
            if (indCut > 0) {
              game.independentVoters = Math.max(0, Math.round(Number(game.independentVoters || 0)) + indCut);
            }
            const crossAmount = leakAmount - indCut;
            const weights = poolTargets.map((t) => {
              const dist = getSliderDistance(src, t);
              const sharedBonus = sharedKeyIssues(src, t).length > 0 ? 1.35 : 1.0;
              return (1 / (0.8 + dist)) * sharedBonus * (0.4 + rand() * 1.2);
            });
            const wSum = weights.reduce((a, b) => a + b, 0) || 1;
            let rem = crossAmount;
            poolTargets.forEach((t, idx) => {
              const add = idx === poolTargets.length - 1 ? rem : Math.round(crossAmount * (weights[idx] / wSum));
              rem -= add;
              setFactionVoters(game, t, getFactionVoters(game, t) + add);
            });
          }
        }
      }

      transferRecords.push({
        sourceFactionId: src.id,
        partyId: srcPid,
        lostVoters: lost,
        retainedInParty: retainedAmount,
        leakedOutside: leakAmount,
        retentionRate: round(retentionRate, 4),
      });
    }

    let totalFactionsAfter = 0;
    for (const f of game.factions) {
      const beforeV = initialById[f.id] ?? 0;
      const afterV = getFactionVoters(game, f);
      totalFactionsAfter += afterV;
      if (!isProtectedIdentityBloc(f)) {
        const delta = afterV - beforeV;
        f.lastCycleVoterDelta = delta;
        f.lastCycleGrowthPct = beforeV > 0 ? round((delta / beforeV) * 100, 2) : 0;
        if (delta > 0) f.trend = 'rising';
        else if (delta < 0 && f.trend !== 'collapsing') f.trend = 'declining';
        changes.push({
          factionId: f.id,
          name: f.name,
          partyId: f.partyId,
          protected: false,
          before: beforeV,
          after: afterV,
          delta,
          growthPct: f.lastCycleGrowthPct,
        });
      }
    }

    const totalIndAfter = Math.max(0, Math.round(Number(game.independentVoters || 0)));
    return {
      threePartyChaosActive: chaos,
      volatilityMult: round(volatilityMult, 2),
      changes,
      transfers: transferRecords,
      totalVotersBefore: totalBefore,
      totalVotersAfter: totalFactionsAfter + totalIndAfter,
    };
  }

  // --------------------------------------------------------------------------
  // 3. Birth Events: Emerge, Sever, Split (Section 2C)
  // --------------------------------------------------------------------------

  function isLowCohesion(faction, game) {
    if (!faction) return false;
    if (faction.forceLowCohesion) return true;
    const coh = Number(faction.cohesion ?? 0.5);
    const hap = Number(game?.factionHappiness?.[faction.id] ?? faction.happiness ?? 55);
    const fric = Number(faction.frictionIndex ?? 0);
    return coh < THRESHOLDS.LOW_COHESION_CUTOFF
      || hap < THRESHOLDS.LOW_HAPPINESS_CUTOFF
      || fric >= THRESHOLDS.HIGH_FRICTION_CUTOFF;
  }

  function hasSalienceSpike(game) {
    if (game?.eraSalienceSpike || game?.activeShock) return true;
    if (Array.isArray(game?.trendingIssues) && game.trendingIssues.length > 0) return true;
    if (game?.issueSalience && typeof game.issueSalience === 'object') {
      return Object.values(game.issueSalience).some((v) => Number(v || 0) >= 75);
    }
    return false;
  }

  function resolveEmergePartyId(game, sliders, rand) {
    if (Array.isArray(game?.factions) && game.factions.length > 0) {
      const partyCentroids = {};
      for (const f of game.factions) {
        if (!f || isUnaffiliatedOrIndependentFaction(f) || !f.sliders) continue;
        const pid = f.partyId;
        partyCentroids[pid] ||= { s: 0, e: 0, g: 0, w: 0 };
        const w = Math.max(1, getFactionVoters(game, f));
        partyCentroids[pid].s += Number(f.sliders.social ?? 5) * w;
        partyCentroids[pid].e += Number(f.sliders.economic ?? 5) * w;
        partyCentroids[pid].g += Number(f.sliders.governance ?? 5) * w;
        partyCentroids[pid].w += w;
      }
      let bestPid = null;
      let bestDist = Infinity;
      for (const [pid, c] of Object.entries(partyCentroids)) {
        const d = Math.hypot(
          sliders.social - c.s / c.w,
          sliders.economic - c.e / c.w,
          sliders.governance - c.g / c.w
        );
        if (d < bestDist) {
          bestDist = d;
          bestPid = pid;
        }
      }
      if (bestPid) return bestPid;
    }
    return rand() < 0.5 ? 'people' : 'heritage';
  }

  function evaluateBirthEvents(game, rng, options = {}) {
    if (!game || !Array.isArray(game.factions)) {
      return { events: [], emerged: [], severed: [], split: [] };
    }
    const rand = resolveRng(rng, game, 'birth-events');
    const chaos = Boolean(game.threePartyChaosActive);
    const thresholdMult = chaos ? THRESHOLDS.CHAOS_THRESHOLD_MULT : 1.0;

    const severThreshold = Math.round(THRESHOLDS.SEVER_MIN_VOTERS * thresholdMult); // 2.5M normal, 1.875M chaos
    const splitThreshold = Math.round(THRESHOLDS.SPLIT_MIN_VOTERS * thresholdMult); // 4.0M normal, 3.0M chaos

    const allowMaxSplits = Number.isFinite(Number(options.maxSplits)) ? Number(options.maxSplits) : 1;
    const allowMaxSevers = Number.isFinite(Number(options.maxSevers)) ? Number(options.maxSevers) : 1;
    const allowMaxEmerges = Number.isFinite(Number(options.maxEmerges)) ? Number(options.maxEmerges) : 1;

    // [QA-BATCH2-FIX] B2-02: Enforce active-faction cap (<= 45) and >= 4-cycle cooldown on unforced organic births
    const maxActiveFactions = Number.isFinite(Number(options.maxActiveFactions)) ? Number(options.maxActiveFactions) : 45;
    const cooldownCycles = Number.isFinite(Number(options.cooldownCycles)) ? Number(options.cooldownCycles) : 4;
    const isForcedBirth = Boolean(options.forceSplit || options.forceSever || options.forceEmerge);
    const curYear = Number(game.year || 2028);
    const lastOrgYear = Number(game.lastOrganicEmergenceYear || 0);
    if (!isForcedBirth && game.factions.length >= maxActiveFactions) {
      return { events: [], emerged: [], severed: [], split: [] };
    }
    if (!isForcedBirth && lastOrgYear > 0 && (curYear - lastOrgYear) < cooldownCycles * 2) {
      return { events: [], emerged: [], severed: [], split: [] };
    }

    const events = [];
    const emerged = [];
    const severed = [];
    const split = [];
    const toRemoveIds = new Set();
    const toAppend = [];
    const stateMutationOps = [];

    // 1. Split (Parent >= 4M normal / >= 3M chaos, low cohesion, non-identity)
    let splitCount = 0;
    for (const parent of game.factions) {
      if (splitCount >= allowMaxSplits) break;
      if (!parent || toRemoveIds.has(parent.id)) continue;
      if (isProtectedIdentityBloc(parent) || isUnaffiliatedOrIndependentFaction(parent)) continue;
      const pv = getFactionVoters(game, parent);
      if (pv < splitThreshold) continue;
      if (!isLowCohesion(parent, game)) continue;

      const splitProb = options.forceSplit ? 1.0 : (chaos ? 0.65 : 0.45);
      if (rand() > splitProb) continue;

      const shareA = 0.45 + rand() * 0.10; // 45% - 55%
      const votersA = Math.round(pv * shareA);
      const votersB = pv - votersA; // 45% - 55%, exact 100% conservation

      const parentIssues = Array.isArray(parent.keyIssues) && parent.keyIssues.length >= 2
        ? parent.keyIssues.slice(0, 2)
        : pickFreshIssues(game, [], 2, rand);
      const freshA = pickFreshIssues(game, parentIssues, 1, rand)[0];
      const freshB = pickFreshIssues(game, [...parentIssues, freshA], 1, rand)[0];

      const shift = 1.0 + rand() * 0.7;
      const baseSliders = parent.sliders || { social: 5, economic: 5, governance: 5 };
      const slidersA = {
        social: clamp(round(Number(baseSliders.social ?? 5) - shift, 1), 1, 10),
        economic: clamp(round(Number(baseSliders.economic ?? 5) - shift * 0.7, 1), 1, 10),
        governance: clamp(round(Number(baseSliders.governance ?? 5) + (rand() - 0.5) * 0.8, 1), 1, 10),
      };
      const slidersB = {
        social: clamp(round(Number(baseSliders.social ?? 5) + shift, 1), 1, 10),
        economic: clamp(round(Number(baseSliders.economic ?? 5) + shift * 0.7, 1), 1, 10),
        governance: clamp(round(Number(baseSliders.governance ?? 5) + (rand() - 0.5) * 0.8, 1), 1, 10),
      };

      const childA = buildChildProfile(game, {
        birthMode: 'split',
        parentFaction: parent,
        partyId: parent.partyId,
        voters: votersA,
        sliders: slidersA,
        forcedIssues: [parentIssues[0], freshA],
        siblingIndex: 0,
      }, rand);
      const childB = buildChildProfile(game, {
        birthMode: 'split',
        parentFaction: parent,
        partyId: parent.partyId,
        voters: votersB,
        sliders: slidersB,
        forcedIssues: [parentIssues[1], freshB],
        siblingIndex: 1,
      }, rand);

      toRemoveIds.add(parent.id);
      toAppend.push(childA, childB);
      stateMutationOps.push({ mode: 'split', parentId: parent.id, childA, childB, shareA });
      splitCount++;
      const evt = {
        mode: 'split',
        partyId: parent.partyId,
        parentId: parent.id,
        parentName: parent.name,
        parentVoters: pv,
        children: [childA, childB],
      };
      split.push(evt);
      events.push(evt);
    }

    // 2. Sever (Parent >= 2.5M normal / >= 1.875M chaos, low cohesion, non-identity)
    let severCount = 0;
    for (const parent of game.factions) {
      if (severCount >= allowMaxSevers) break;
      if (!parent || toRemoveIds.has(parent.id)) continue;
      if (isProtectedIdentityBloc(parent) || isUnaffiliatedOrIndependentFaction(parent)) continue;
      const pv = getFactionVoters(game, parent);
      if (pv < severThreshold) continue;
      if (!isLowCohesion(parent, game)) continue;

      const severProb = options.forceSever ? 1.0 : (chaos ? 0.65 : 0.45);
      if (rand() > severProb) continue;

      const severPct = 0.20 + rand() * 0.15; // 20% - 35%
      const childVoters = Math.round(pv * severPct);
      const remainingParentVoters = pv - childVoters;
      setFactionVoters(game, parent, remainingParentVoters);

      const childIssues = pickFreshIssues(game, parent.keyIssues || [], 2, rand);
      const shiftDir = rand() < 0.5 ? -1 : 1;
      const shiftMag = 0.8 + rand() * 0.9;
      const baseSliders = parent.sliders || { social: 5, economic: 5, governance: 5 };
      const childSliders = {
        social: clamp(round(Number(baseSliders.social ?? 5) + shiftDir * shiftMag, 1), 1, 10),
        economic: clamp(round(Number(baseSliders.economic ?? 5) + shiftDir * shiftMag * 0.8, 1), 1, 10),
        governance: clamp(round(Number(baseSliders.governance ?? 5) + (rand() - 0.5) * 1.0, 1), 1, 10),
      };

      const child = buildChildProfile(game, {
        birthMode: 'sever',
        parentFaction: parent,
        partyId: parent.partyId,
        voters: childVoters,
        sliders: childSliders,
        forcedIssues: childIssues,
      }, rand);

      toAppend.push(child);
      stateMutationOps.push({ mode: 'sever', parentId: parent.id, child, severPct });
      severCount++;
      const evt = {
        mode: 'sever',
        partyId: parent.partyId,
        parentId: parent.id,
        parentName: parent.name,
        severPct: round(severPct * 100, 1),
        child,
      };
      severed.push(evt);
      events.push(evt);
    }

    // 3. Emerge (No parent; era/shock salience spike or ideological gap)
    let emergeCount = 0;
    const shouldTryEmerge = Boolean(options.forceEmerge) || hasSalienceSpike(game) || rand() < (chaos ? 0.45 : 0.25);
    while (shouldTryEmerge && emergeCount < allowMaxEmerges) {
      const emergeVoters = Math.round(
        THRESHOLDS.EMERGE_MIN_VOTERS + rand() * (THRESHOLDS.EMERGE_MAX_VOTERS - THRESHOLDS.EMERGE_MIN_VOTERS)
      ); // 350,000 - 850,000 (< 1,000,000)

      // Conserve against independent pool if present
      if (Number.isFinite(Number(game.independentVoters)) && Number(game.independentVoters) >= emergeVoters) {
        game.independentVoters = Math.round(Number(game.independentVoters)) - emergeVoters;
      } else {
        const indFactions = game.factions.filter((x) => !isProtectedIdentityBloc(x) && isUnaffiliatedOrIndependentFaction(x) && getFactionVoters(game, x) > 500000);
        if (indFactions.length > 0) {
          const donor = indFactions[0];
          setFactionVoters(game, donor, getFactionVoters(game, donor) - Math.min(emergeVoters, getFactionVoters(game, donor) - 100000));
        }
      }

      const freshIssues = pickFreshIssues(game, [], 2, rand);
      const emergeSliders = options.emergeSliders || {
        social: clamp(round(3.0 + rand() * 4.5, 1), 1, 10),
        economic: clamp(round(3.0 + rand() * 4.5, 1), 1, 10),
        governance: clamp(round(3.5 + rand() * 3.5, 1), 1, 10),
      };
      const targetPartyId = options.emergePartyId || resolveEmergePartyId(game, emergeSliders, rand);

      const emergedFaction = buildChildProfile(game, {
        birthMode: 'emerge',
        parentFaction: null,
        partyId: targetPartyId,
        voters: emergeVoters,
        sliders: emergeSliders,
        forcedIssues: freshIssues,
      }, rand);
      emergedFaction.viralRunwayCyclesLeft = THRESHOLDS.VIRAL_RUNWAY_CYCLES;
      emergedFaction.vanguardCyclesLeft = THRESHOLDS.VANGUARD_CYCLES;

      toAppend.push(emergedFaction);
      stateMutationOps.push({ mode: 'emerge', faction: emergedFaction, voters: emergeVoters });
      emergeCount++;
      const evt = {
        mode: 'emerge',
        partyId: emergedFaction.partyId,
        voters: emergeVoters,
        faction: emergedFaction,
      };
      emerged.push(evt);
      events.push(evt);
    }

    if (toRemoveIds.size > 0 || toAppend.length > 0) {
      game.factions = game.factions.filter((f) => f && !toRemoveIds.has(f.id)).concat(toAppend);
      // [QA-BATCH2-FIX] B2-01 & B2-02: Propagate split/sever/emerge voters across voterModel.states[*].factions conservatively
      if (Array.isArray(game.voterModel?.states) && game.voterModel.states.length > 0) {
        const states = game.voterModel.states;
        for (const op of stateMutationOps) {
          if (op.mode === 'split') {
            states.forEach((st) => {
              if (!st.factions) return;
              const pSt = Math.max(0, Math.round(Number(st.factions[op.parentId] || 0)));
              if (pSt > 0) {
                const aSt = Math.round(pSt * op.shareA);
                st.factions[op.childA.id] = (st.factions[op.childA.id] || 0) + aSt;
                st.factions[op.childB.id] = (st.factions[op.childB.id] || 0) + (pSt - aSt);
              }
              delete st.factions[op.parentId];
            });
          } else if (op.mode === 'sever') {
            states.forEach((st) => {
              if (!st.factions) return;
              const pSt = Math.max(0, Math.round(Number(st.factions[op.parentId] || 0)));
              if (pSt > 0) {
                const cSt = Math.round(pSt * op.severPct);
                st.factions[op.parentId] = pSt - cSt;
                st.factions[op.child.id] = (st.factions[op.child.id] || 0) + cSt;
              }
            });
          } else if (op.mode === 'emerge') {
            const totalRep = states.reduce((acc, st) => acc + Math.max(1, Number(st.representedVoters || 0)), 0) || 1;
            let rem = op.voters;
            states.forEach((st, idx) => {
              if (!st.factions) st.factions = {};
              const slice = idx === states.length - 1
                ? rem
                : Math.round(op.voters * (Math.max(1, Number(st.representedVoters || 0)) / totalRep));
              rem -= slice;
              if (slice <= 0) return;
              // Draw conservatively from largest non-protected swing/adjacent faction in state
              const donorIds = Object.keys(st.factions).filter((fid) => fid !== op.faction.id && !fid.includes('black_voters') && !fid.includes('latin') && !fid.includes('mormons') && Number(st.factions[fid] || 0) > slice);
              const preferred = donorIds.find((fid) => fid.startsWith('swg_')) || donorIds.sort((a, b) => (st.factions[b] || 0) - (st.factions[a] || 0))[0];
              if (preferred) {
                st.factions[preferred] = Math.max(0, Number(st.factions[preferred] || 0) - slice);
              }
              st.factions[op.faction.id] = (st.factions[op.faction.id] || 0) + slice;
            });
          }
        }
      }
      if (game.voterModel?.factions) {
        toRemoveIds.forEach((id) => { delete game.voterModel.factions[id]; });
        toAppend.forEach((f) => { game.voterModel.factions[f.id] = getFactionVoters(game, f); });
      }
      if (game.factionHappiness) {
        toRemoveIds.forEach((id) => { delete game.factionHappiness[id]; });
        toAppend.forEach((f) => { game.factionHappiness[f.id] = f.happiness ?? 58; });
      }
      if (!isForcedBirth) {
        game.lastOrganicEmergenceYear = curYear;
      }
      // Clean split parents out of caucuses and leadingFactionByParty
      if (Array.isArray(game.caucuses)) {
        game.caucuses.forEach((c) => {
          if (Array.isArray(c.memberFactionIds)) {
            c.memberFactionIds = c.memberFactionIds.filter((id) => !toRemoveIds.has(id));
          }
        });
      }
    }

    return { events, emerged, severed, split };
  }

  // --------------------------------------------------------------------------
  // 4. Kicker #2: Vanguard Overton Window Pull (Section 2E)
  // --------------------------------------------------------------------------

  function applyVanguardOvertonPull(game) {
    if (!game || !Array.isArray(game.factions)) return [];
    const pulls = [];
    if (!game.issueSalience || typeof game.issueSalience !== 'object') {
      game.issueSalience = {};
    }

    for (const vanguard of game.factions) {
      if (!vanguard || Number(vanguard.vanguardCyclesLeft || 0) <= 0) continue;
      const primaryIssue = vanguard.primaryIssueId || vanguard.keyIssues?.[0] || 'Reform';
      const vSliders = vanguard.sliders || { social: 5, economic: 5, governance: 5 };

      // Boost global salience of the Vanguard's primary issue
      const prevSal = Number(game.issueSalience[primaryIssue] ?? 55);
      game.issueSalience[primaryIssue] = clamp(round(prevSal + 4.5, 1), 0, 100);

      const nudgedFactionIds = [];
      for (const neighbor of game.factions) {
        if (!neighbor || neighbor.id === vanguard.id) continue;
        if (neighbor.partyId !== vanguard.partyId) continue;
        if (isProtectedIdentityBloc(neighbor)) continue;

        const dist = getSliderDistance(vanguard, neighbor);
        const proximity = clamp(1 - dist / 6.5, 0.25, 1.0);
        const step = 0.08 * proximity;

        if (!neighbor.sliders) neighbor.sliders = { social: 5, economic: 5, governance: 5 };
        neighbor.sliders.social = clamp(round(Number(neighbor.sliders.social ?? 5) + (Number(vSliders.social ?? 5) - Number(neighbor.sliders.social ?? 5)) * step, 2), 1, 10);
        neighbor.sliders.economic = clamp(round(Number(neighbor.sliders.economic ?? 5) + (Number(vSliders.economic ?? 5) - Number(neighbor.sliders.economic ?? 5)) * step, 2), 1, 10);
        neighbor.sliders.governance = clamp(round(Number(neighbor.sliders.governance ?? 5) + (Number(vSliders.governance ?? 5) - Number(neighbor.sliders.governance ?? 5)) * step, 2), 1, 10);

        if (!neighbor.issueSalience || typeof neighbor.issueSalience !== 'object') {
          neighbor.issueSalience = {};
        }
        const nPrevSal = Number(neighbor.issueSalience[primaryIssue] ?? 50);
        neighbor.issueSalience[primaryIssue] = clamp(round(nPrevSal + 6.0 * proximity, 1), 0, 100);

        nudgedFactionIds.push(neighbor.id);
      }

      vanguard.vanguardCyclesLeft = Math.max(0, Number(vanguard.vanguardCyclesLeft) - 1);
      pulls.push({
        vanguardId: vanguard.id,
        vanguardName: vanguard.name,
        partyId: vanguard.partyId,
        primaryIssueId: primaryIssue,
        nudgedFactionIds,
        remainingCycles: vanguard.vanguardCyclesLeft,
      });
    }

    return pulls;
  }

  // --------------------------------------------------------------------------
  // 5. Kicker #1: Faction Mergers & Hostile Takeovers (Section 2E)
  // --------------------------------------------------------------------------

  function evaluateFactionMergers(game, rng, options = {}) {
    if (!game || !Array.isArray(game.factions)) return [];
    const rand = resolveRng(rng, game, 'mergers');
    const maxMergers = Number.isFinite(Number(options.maxMergers)) ? Number(options.maxMergers) : 2;
    const mergers = [];
    const absorbedIds = new Set();

    for (let i = 0; i < game.factions.length && mergers.length < maxMergers; i++) {
      const a = game.factions[i];
      if (!a || absorbedIds.has(a.id) || isProtectedIdentityBloc(a) || isUnaffiliatedOrIndependentFaction(a)) continue;

      for (let j = i + 1; j < game.factions.length && mergers.length < maxMergers; j++) {
        const b = game.factions[j];
        if (!b || absorbedIds.has(b.id) || isProtectedIdentityBloc(b) || isUnaffiliatedOrIndependentFaction(b)) continue;
        if (a.partyId !== b.partyId) continue;

        const dist = getSliderDistance(a, b);
        if (dist > THRESHOLDS.MERGER_MAX_DISTANCE) continue;

        const shared = sharedKeyIssues(a, b);
        if (shared.length < 1) continue;

        const vA = getFactionVoters(game, a);
        const vB = getFactionVoters(game, b);
        const aShrinking = Number(a.lastCycleGrowthPct || 0) < 0 || a.trend === 'declining' || a.trend === 'collapsing' || Boolean(a.shrinking);
        const bShrinking = Number(b.lastCycleGrowthPct || 0) < 0 || b.trend === 'declining' || b.trend === 'collapsing' || Boolean(b.shrinking);
        const eligibleSizeOrShrink = aShrinking || bShrinking || vA < THRESHOLDS.MERGER_SMALL_VOTERS || vB < THRESHOLDS.MERGER_SMALL_VOTERS;
        if (!eligibleSizeOrShrink) continue;

        const mergeProb = options.forceMerge ? 1.0 : 0.70;
        if (rand() > mergeProb) continue;

        // Survivor is larger faction (tie-break anchor/leading)
        const aWins = vA > vB || (vA === vB && (a.isIroncladAnchor || a.status === 'leading'));
        const survivor = aWins ? a : b;
        const absorbed = aWins ? b : a;
        const vSurv = aWins ? vA : vB;
        const vAbs = aWins ? vB : vA;
        const combinedVoters = vSurv + vAbs;

        // Weighted slider center of mass
        const totalW = Math.max(1, combinedVoters);
        const sS = survivor.sliders || { social: 5, economic: 5, governance: 5 };
        const aS = absorbed.sliders || { social: 5, economic: 5, governance: 5 };
        survivor.sliders = {
          social: round((Number(sS.social ?? 5) * vSurv + Number(aS.social ?? 5) * vAbs) / totalW, 2),
          economic: round((Number(sS.economic ?? 5) * vSurv + Number(aS.economic ?? 5) * vAbs) / totalW, 2),
          governance: round((Number(sS.governance ?? 5) * vSurv + Number(aS.governance ?? 5) * vAbs) / totalW, 2),
        };

        setFactionVoters(game, survivor, combinedVoters);
        survivor.mergedFrom = [...(survivor.mergedFrom || []), absorbed.id];
        if (!survivor.primaryIssueId && survivor.keyIssues?.[0]) {
          survivor.primaryIssueId = survivor.keyIssues[0];
        }
        if (absorbed.isExtremist) survivor.isExtremist = true;

        // Inherit / deduplicate Caucus seat
        if (Array.isArray(game.caucuses)) {
          game.caucuses.forEach((c) => {
            if (!Array.isArray(c.memberFactionIds)) return;
            if (c.memberFactionIds.includes(absorbed.id)) {
              c.memberFactionIds = c.memberFactionIds.filter((id) => id !== absorbed.id);
              if (!c.memberFactionIds.includes(survivor.id)) {
                c.memberFactionIds.push(survivor.id);
              }
            }
          });
        }

        absorbedIds.add(absorbed.id);
        mergers.push({
          partyId: survivor.partyId,
          survivorId: survivor.id,
          survivorName: survivor.name,
          absorbedId: absorbed.id,
          absorbedName: absorbed.name,
          combinedVoters,
          sliderDistance: round(dist, 2),
          sharedIssues: shared,
        });
      }
    }

    if (absorbedIds.size > 0) {
      game.factions = game.factions.filter((f) => f && !absorbedIds.has(f.id));
      if (game.voterModel?.factions) {
        absorbedIds.forEach((id) => { delete game.voterModel.factions[id]; });
      }
      if (game.factionHappiness) {
        absorbedIds.forEach((id) => { delete game.factionHappiness[id]; });
      }
    }

    return mergers;
  }

  // --------------------------------------------------------------------------
  // 6. End-of-Cycle Dissolutions (<100K, Extremist Immunity, Politician Anchor)
  // --------------------------------------------------------------------------

  function isAnchorPoliticianEnded(game, anchorId) {
    if (!anchorId) return false;
    const targetId = String(anchorId);
    const retiredPools = [
      ...(Array.isArray(game?.retiredPoliticians) ? game.retiredPoliticians : []),
      ...(Array.isArray(game?.deceasedPoliticians) ? game.deceasedPoliticians : []),
    ];
    if (retiredPools.some((p) => p && (p.id === targetId || p === targetId))) {
      return true;
    }
    const allPols = [
      ...(Array.isArray(game?.politicians) ? game.politicians : []),
      ...(Array.isArray(game?.sittingMembers) ? game.sittingMembers : []),
      ...(Array.isArray(game?.councilOfElders) ? game.councilOfElders : []),
    ];
    const match = allPols.find((p) => p && p.id === targetId);
    if (match) {
      return Boolean(
        match.retired || match.isRetired || match.deceased || match.dead || match.isDeceased || match.alive === false || match.status === 'deceased' || match.status === 'retired'
      );
    }
    return false;
  }

  // [MC-BALANCE-TUNE] MC-01 & MC-05: Tier-aware extinction floor (10k / 3 cycles for Tier 0-2) + custom/last-faction guard
  function getPartyTierForLifecycle(game, partyId) {
    if (!partyId || partyId === 'none' || partyId === 'independent' || partyId === 'unaffiliated') return 0;
    const gTiers = game?.partyTiers || {};
    if (Number.isFinite(Number(gTiers[partyId]))) return Number(gTiers[partyId]);
    if (['people', 'heritage'].includes(partyId) && !game?.player?.custom) return 5;
    if (['liberty', 'green'].includes(partyId)) return 1;
    if (['constitution', 'socialist'].includes(partyId)) return 0;
    return 1;
  }

  function evaluateCycleDissolutions(game) {
    if (!game || !Array.isArray(game.factions)) return [];
    const dissolutions = [];
    const dissolvedList = [];
    const curYear = Number(game.year || 2028);
    const startYear = Number(game.startYear || game.yearStart || 2028);

    const remainingCountByParty = {};
    for (const f of game.factions) {
      if (!f || !f.partyId || isUnaffiliatedOrIndependentFaction(f)) continue;
      remainingCountByParty[f.partyId] = (remainingCountByParty[f.partyId] || 0) + 1;
    }

    for (const f of game.factions) {
      if (!f) continue;
      if (isProtectedIdentityBloc(f)) continue;

      const anchorEnded = Boolean(f.anchorPoliticianId) && (Boolean(f.anchorRetired || f.anchorDeceased) || isAnchorPoliticianEnded(game, f.anchorPoliticianId));
      const voters = getFactionVoters(game, f);
      const hap = Number(game.factionHappiness?.[f.id] ?? game.factionStandings?.[f.id] ?? f.happiness ?? 65);
      f.extremeCollapseCycles = hap < 15 ? (Number(f.extremeCollapseCycles || 0) + 1) : 0;
      const sustainedCollapse = f.extremeCollapseCycles >= 2;

      if (anchorEnded) {
        if (f.partyId && remainingCountByParty[f.partyId] !== undefined) {
          remainingCountByParty[f.partyId] = Math.max(0, remainingCountByParty[f.partyId] - 1);
        }
        dissolvedList.push({ faction: f, reason: 'anchor_politician_ended', voters });
        continue;
      }

      if (f.isExtremist === true) {
        // Extremist factions NEVER dissolve due to small size
        continue;
      }

      // [QA-BATCH4-FIX] B4-08: Exempt custom_founding_faction and any party's last remaining faction indefinitely from low-voter extinction unless sustained happiness < 15
      const isCustomProtected = (f.id === 'custom_founding_faction' || f.isCustomFounding === true);
      const isLastPartyFaction = Boolean(f.partyId && !isUnaffiliatedOrIndependentFaction(f) && (remainingCountByParty[f.partyId] || 0) <= 1);
      if ((isCustomProtected || isLastPartyFaction) && !sustainedCollapse) {
        f.lowVoterCycles = 0;
        continue;
      }

      // [MC-BALANCE-TUNE] MC-05: Lower extinction floor for Tier 0-2 minor/extremist/custom parties to 10,000 voters over 3 consecutive cycles
      const pTier = getPartyTierForLifecycle(game, f.partyId);
      if (pTier <= 2 && f.partyId && !isUnaffiliatedOrIndependentFaction(f)) {
        if (voters < 10000) {
          f.lowVoterCycles = Number(f.lowVoterCycles || 0) + 1;
          if (f.lowVoterCycles >= 3) {
            if (remainingCountByParty[f.partyId] !== undefined) {
              remainingCountByParty[f.partyId] = Math.max(0, remainingCountByParty[f.partyId] - 1);
            }
            dissolvedList.push({ faction: f, reason: 'below_10k_3cycle_threshold', voters });
          }
        } else {
          f.lowVoterCycles = 0;
        }
      } else if (voters < THRESHOLDS.DISSOLUTION_MIN_VOTERS) {
        if (f.partyId && remainingCountByParty[f.partyId] !== undefined) {
          remainingCountByParty[f.partyId] = Math.max(0, remainingCountByParty[f.partyId] - 1);
        }
        dissolvedList.push({ faction: f, reason: 'below_100k_threshold', voters });
      } else {
        f.lowVoterCycles = 0;
      }
    }

    if (dissolvedList.length === 0) return [];

    const dissolvedIds = new Set(dissolvedList.map((d) => d.faction.id));
    const survivors = game.factions.filter((f) => f && !dissolvedIds.has(f.id));

    for (const d of dissolvedList) {
      const f = d.faction;
      const voters = d.voters;
      const eligibleNeighbors = survivors
        .filter((s) => !isProtectedIdentityBloc(s))
        .slice()
        .sort((a, b) => {
          const da = getSliderDistance(f, a) - (a.partyId === f.partyId ? 0.35 : 0);
          const db = getSliderDistance(f, b) - (b.partyId === f.partyId ? 0.35 : 0);
          return da - db;
        })
        .slice(0, 3);

      const recipients = [];
      if (eligibleNeighbors.length > 0 && voters > 0) {
        const weights = eligibleNeighbors.map((n) => {
          const dist = getSliderDistance(f, n);
          const risingMult = (n.trend === 'rising' || Number(n.lastCycleGrowthPct || 0) > 0) ? 1.65 : 1.0;
          return (1 / (0.5 + dist)) * risingMult;
        });
        const wSum = weights.reduce((a, b) => a + b, 0) || 1;
        let rem = voters;
        eligibleNeighbors.forEach((n, idx) => {
          const share = idx === eligibleNeighbors.length - 1 ? rem : Math.round(voters * (weights[idx] / wSum));
          rem -= share;
          setFactionVoters(game, n, getFactionVoters(game, n) + share);
          recipients.push({ factionId: n.id, factionName: n.name, addedVoters: share });
        });
      } else if (voters > 0) {
        game.independentVoters = Math.max(0, Math.round(Number(game.independentVoters || 0)) + voters);
      }

      dissolutions.push({
        factionId: f.id,
        factionName: f.name,
        partyId: f.partyId,
        reason: d.reason,
        votersRedistributed: voters,
        recipients,
      });
    }

    game.factions = survivors;
    // [QA-BATCH2-FIX] B2-03: Record dissolvedFactions, strip state faction keys conservatively, clear leadership refs, and log
    if (!Array.isArray(game.dissolvedFactions)) game.dissolvedFactions = [];
    const curYr = Number(game.year || 2028);
    dissolutions.forEach((dEvt) => {
      game.dissolvedFactions.push({
        id: dEvt.factionId,
        name: dEvt.factionName,
        partyId: dEvt.partyId,
        reason: dEvt.reason,
        year: curYr,
        votersRedistributed: dEvt.votersRedistributed,
      });
      if (Array.isArray(game.voterModel?.states)) {
        const primaryRecipientId = dEvt.recipients?.[0]?.factionId || survivors.find((s) => s && !isProtectedIdentityBloc(s))?.id || null;
        game.voterModel.states.forEach((st) => {
          if (!st.factions) return;
          const remSt = Number(st.factions[dEvt.factionId] || 0);
          if (remSt > 0 && primaryRecipientId) {
            st.factions[primaryRecipientId] = (st.factions[primaryRecipientId] || 0) + remSt;
          }
          delete st.factions[dEvt.factionId];
        });
      }
      if (game.leadingFactionByParty && game.leadingFactionByParty[dEvt.partyId] === dEvt.factionId) {
        const nextLead = survivors
          .filter((s) => s && s.partyId === dEvt.partyId)
          .sort((a, b) => getFactionVoters(game, b) - getFactionVoters(game, a))[0];
        if (nextLead) game.leadingFactionByParty[dEvt.partyId] = nextLead.id;
        else delete game.leadingFactionByParty[dEvt.partyId];
      }
      const roleKey = `faction_${dEvt.factionId}`;
      if (game.leadershipRoles && typeof game.leadershipRoles === 'object') {
        delete game.leadershipRoles[roleKey];
        Object.values(game.leadershipRoles).forEach((sub) => {
          if (sub && typeof sub === 'object' && !Array.isArray(sub)) delete sub[roleKey];
        });
      }
      if (Array.isArray(game.yearLog)) {
        game.yearLog.push({
          year: curYr,
          turn: (game.chairTurn || 0) + 1,
          action: `${dEvt.factionName} has dissolved into political irrelevance.`,
        });
      }
    });
    if (game.voterModel?.factions) {
      dissolvedIds.forEach((id) => { delete game.voterModel.factions[id]; });
    }
    if (game.factionHappiness) {
      dissolvedIds.forEach((id) => { delete game.factionHappiness[id]; });
    }
    if (Array.isArray(game.caucuses)) {
      game.caucuses.forEach((c) => {
        if (Array.isArray(c.memberFactionIds)) {
          c.memberFactionIds = c.memberFactionIds.filter((id) => !dissolvedIds.has(id));
        }
      });
    }

    return dissolutions;
  }

  // --------------------------------------------------------------------------
  // 7. Kicker #3: Coalition Temperament Effects (Section 2E)
  // --------------------------------------------------------------------------

  function applyTemperamentEffects(game, faction, context = {}) {
    if (!faction || !faction.temperament || !TEMPERAMENT_ARCHETYPES[faction.temperament]) {
      return {
        applied: false,
        temperament: faction?.temperament || null,
        happinessDelta: Number(context.rawHappinessDelta || 0),
        frictionDelta: Number(context.rawFrictionDelta || 0),
        cohesionDelta: 0,
        appeasementMultiplier: 1.0,
        boltRiskMultiplier: 1.0,
        caucusFrayMultiplier: 1.0,
        highBoltRisk: false,
      };
    }

    const temp = faction.temperament;
    const arch = TEMPERAMENT_ARCHETYPES[temp];
    let happinessDelta = Number(context.rawHappinessDelta || 0);
    let frictionDelta = Number(context.rawFrictionDelta || 0);
    let cohesionDelta = 0;
    let appeasementMultiplier = arch.modifiers.appeasementMultiplier;
    let boltRiskMultiplier = arch.modifiers.losingStreakBoltMultiplier;
    let caucusFrayMultiplier = arch.modifiers.caucusFrayMultiplier;
    let highBoltRisk = false;
    let note = '';

    const losingStreak = Number(context.consecutiveLosses ?? game?.consecutiveLosingCycles?.[faction.partyId] ?? faction.consecutiveLosses ?? 0);

    if (temp === 'true_believer') {
      if (context.primaryIssueBetrayed) {
        happinessDelta = happinessDelta < 0 ? round(happinessDelta * 1.75, 2) : round(happinessDelta - 10, 2);
        frictionDelta += 14;
        boltRiskMultiplier = 1.8;
        highBoltRisk = true;
        note = `${faction.name} (True Believer) suffered severe primary-issue betrayal backlash.`;
      } else if (context.primaryIssueHeld !== false) {
        boltRiskMultiplier = 0.0;
        if (losingStreak > 0 && happinessDelta < 0) {
          happinessDelta = round(happinessDelta * 0.5, 2);
        }
        note = `${faction.name} (True Believer) held firm on ${faction.primaryIssueId || faction.keyIssues?.[0] || 'its primary issue'}.`;
      }
    } else if (temp === 'fair_weather') {
      if (losingStreak >= 2) {
        happinessDelta = round(happinessDelta - 8, 2);
        frictionDelta += 10;
        cohesionDelta = -0.10;
        boltRiskMultiplier = 2.0;
        highBoltRisk = true;
        note = `${faction.name} (Fair-Weather) lost patience after ${losingStreak} consecutive losing cycles.`;
      } else if (context.heldPower || context.factionWonCycle || losingStreak === 0) {
        happinessDelta = round(happinessDelta + 2, 2);
        boltRiskMultiplier = 0.5;
        note = `${faction.name} (Fair-Weather) rallied behind winning momentum.`;
      }
    } else if (temp === 'transactional') {
      const isAppeaseAction = ['appease', 'budget', 'patronage', 'endorsement'].includes(String(context.actionType || '').toLowerCase());
      if (isAppeaseAction && happinessDelta > 0) {
        happinessDelta = round(happinessDelta * 1.4, 2); // +40% appeasement efficiency
        appeasementMultiplier = 1.4;
        note = `${faction.name} (Transactional) responded with +40% appeasement efficiency.`;
      } else if (context.neglected) {
        happinessDelta = round(happinessDelta - 2, 2);
        frictionDelta += 4;
        caucusFrayMultiplier = 1.35;
        note = `${faction.name} (Transactional) chafed at lack of patronage/negotiation.`;
      }
    }

    if (context.applyToState && game) {
      const curH = Number(game.factionHappiness?.[faction.id] ?? faction.happiness ?? 55);
      const nextH = clamp(round(curH + happinessDelta, 1), 0, 100);
      faction.happiness = nextH;
      if (game.factionHappiness && typeof game.factionHappiness === 'object') {
        game.factionHappiness[faction.id] = nextH;
      }
      if (cohesionDelta !== 0) {
        faction.cohesion = clamp(round(Number(faction.cohesion ?? 0.5) + cohesionDelta, 2), 0.1, 1.0);
      }
      if (frictionDelta !== 0) {
        faction.frictionIndex = clamp(round(Number(faction.frictionIndex ?? 0) + frictionDelta, 1), 0, 100);
      }
    }

    return {
      applied: true,
      temperament: temp,
      happinessDelta,
      frictionDelta,
      cohesionDelta,
      appeasementMultiplier,
      boltRiskMultiplier,
      caucusFrayMultiplier,
      highBoltRisk,
      note,
    };
  }

  // --------------------------------------------------------------------------
  // 8. Full Cycle Orchestrator
  // --------------------------------------------------------------------------

  function runDynamicFactionCycle(game, rngOrOptions, maybeOptions) {
    let rng = null;
    let options = {};
    if (typeof rngOrOptions === 'function') {
      rng = rngOrOptions;
      options = maybeOptions || {};
    } else {
      options = rngOrOptions || {};
      rng = options.rng || null;
    }

    const rand = resolveRng(rng, game, 'cycle-orchestrator');
    if (!game || !Array.isArray(game.factions)) {
      return {
        year: game?.year || 2028,
        threePartyChaosActive: false,
        overtonPulls: [],
        growthDecline: { changes: [], transfers: [] },
        births: { events: [], emerged: [], severed: [], split: [] },
        mergers: [],
        dissolutions: [],
        temperamentUpdates: [],
        totalVotersAfter: 0,
      };
    }

    if (!Array.isArray(game.usedFactionNames)) {
      game.usedFactionNames = [];
    }
    game.factions.forEach((f) => { if (f?.name) recordUsedFactionName(game, f.name); });

    const chaosActive = options.preserveChaosFlag && typeof game.threePartyChaosActive === 'boolean'
      ? game.threePartyChaosActive
      : detectThreePartyChaos(game);

    const overtonPulls = applyVanguardOvertonPull(game);
    const growthDecline = applyCycleGrowthAndDecline(game, { ...options, rng: rand, chaosActive });
    const births = evaluateBirthEvents(game, rand, options);
    const mergers = evaluateFactionMergers(game, rand, options);
    const dissolutions = evaluateCycleDissolutions(game);

    const temperamentUpdates = [];
    if (options.applyTemperaments !== false) {
      for (const f of game.factions) {
        if (!f || !f.temperament) continue;
        const losingStreak = Number(game.consecutiveLosingCycles?.[f.partyId] ?? f.consecutiveLosses ?? 0);
        const heldPower = game.governingParty ? game.governingParty === f.partyId : false;
        const tRes = applyTemperamentEffects(game, f, {
          consecutiveLosses: losingStreak,
          heldPower,
          applyToState: Boolean(options.applyTemperamentToState),
        });
        if (tRes.applied) {
          temperamentUpdates.push({ factionId: f.id, ...tRes });
        }
      }
    }

    const totalVotersAfter = game.factions.reduce((s, f) => s + getFactionVoters(game, f), 0)
      + Math.max(0, Math.round(Number(game.independentVoters || 0)));

    const digest = {
      year: game.year || 2028,
      threePartyChaosActive: Boolean(game.threePartyChaosActive),
      overtonPulls,
      growthDecline,
      births,
      mergers,
      dissolutions,
      temperamentUpdates,
      totalVotersAfter,
    };
    game.lastDynamicLifecycleDigest = digest;
    return digest;
  }

  return {
    CHAOS_SHARE_THRESHOLD,
    CHAOS_SEAT_THRESHOLD,
    THRESHOLDS,
    TEMPERAMENT_ARCHETYPES,
    isProtectedIdentityBloc,
    getFactionVoters,
    getSliderDistance,
    detectThreePartyChaos,
    getThreePartyChaosDetails,
    applyCycleGrowthAndDecline,
    evaluateBirthEvents,
    applyVanguardOvertonPull,
    evaluateFactionMergers,
    evaluateCycleDissolutions,
    applyTemperamentEffects,
    runDynamicFactionCycle,
  };
});
