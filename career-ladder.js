/**
 * Coalition Builder: Party Chair — Upward Political Mobility & Career Ladder System.
 * Manages State House -> State Senate / U.S. House -> U.S. Senate / Governor -> President progression,
 * bench scouting, lower-seat vacancy cascades, and cumulative career milestone hydration.
 *
 * Standalone UMD/IIFE module exposing `window.CareerLadderSystem` and `module.exports`.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.CareerLadderSystem = api;
  }
  if (root && typeof root === 'object') {
    root.CareerLadderSystem = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const OFFICE_ORDER = {
    stateHouse: 1,
    stateSenate: 2,
    house: 3,
    senate: 4,
    governor: 4,
    president: 5,
  };

  const OFFICE_LABELS = {
    stateHouse: 'State House',
    stateSenate: 'State Senate',
    house: 'U.S. House',
    senate: 'U.S. Senate',
    governor: 'Governor',
    president: 'President',
  };

  const PRESIDENT_MIN_FAME = 45;
  const PRESIDENT_MIN_QUALITY = 6;
  const HIGHER_STATE_SENATE_MIN_QUALITY = 6;
  const STATE_HOUSE_FASTTRACK_QUALITY = 8;

  function clamp(val, min, max) {
    const n = Number(val);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function cloneGame(game) {
    return JSON.parse(JSON.stringify(game || {}));
  }

  function normalizeOfficeKey(office, record = null) {
    const raw = String(office || '').trim();
    const low = raw.toLowerCase();
    if (low === 'statehouse' || low === 'state_house' || low === 'state-house' || low === 'lower') {
      return 'stateHouse';
    }
    if (low === 'statesenate' || low === 'state_senate' || low === 'state-senate' || low === 'upper') {
      return 'stateSenate';
    }
    if (low === 'stateleg' || low === 'state_leg' || low === 'state-leg') {
      const ch = String(record?.chamber || '').toLowerCase();
      const seat = String(record?.seatId || record?.districtId || '').toUpperCase();
      const title = String(record?.title || '').toLowerCase();
      if (ch === 'upper' || ch === 'senate' || seat.includes('-SS-') || title.includes('senator')) {
        return 'stateSenate';
      }
      return 'stateHouse';
    }
    if (low === 'house' || low === 'us_house' || low === 'ushouse' || low === 'federal_house' || low === 'representative') {
      return 'house';
    }
    if (low === 'senate' || low === 'us_senate' || low === 'ussenate' || low === 'senator') {
      return 'senate';
    }
    if (low === 'governor' || low === 'gov') {
      return 'governor';
    }
    if (low === 'president' || low === 'presidential' || low === 'pres') {
      return 'president';
    }
    return raw || 'stateHouse';
  }

  function resolvePartyKey(record) {
    if (!record) return null;
    return record.party || record.partyId || record.caucus || null;
  }

  function matchesParty(record, partyId) {
    if (!partyId) return true;
    return record.party === partyId || record.partyId === partyId || record.caucus === partyId;
  }

  function flattenRosterEntries(stateLegRoster) {
    if (!stateLegRoster) return [];
    if (Array.isArray(stateLegRoster)) return stateLegRoster.filter(Boolean);
    if (typeof stateLegRoster !== 'object') return [];
    if (Array.isArray(stateLegRoster.seats)) return stateLegRoster.seats.filter(Boolean);
    if (Array.isArray(stateLegRoster.members)) return stateLegRoster.members.filter(Boolean);
    if (Array.isArray(stateLegRoster.list)) return stateLegRoster.list.filter(Boolean);

    const out = [];
    Object.values(stateLegRoster).forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((item) => { if (item) out.push(item); });
      } else if (val && typeof val === 'object') {
        if (val.id || val.seatId || val.office) {
          out.push(val);
        } else {
          Object.values(val).forEach((sub) => {
            if (Array.isArray(sub)) sub.forEach((item) => { if (item) out.push(item); });
          });
        }
      }
    });
    return out;
  }

  function buildNormalizedTerms(record, currentNorm) {
    const t = record?.termsServed || {};
    const stateHouse = Number.isFinite(Number(t.stateHouse))
      ? Number(t.stateHouse)
      : (currentNorm === 'stateHouse'
        ? Number(t.stateLeg ?? record?.stateLegTermsServed ?? (record?.office ? 1 : 0))
        : 0);
    const stateSenate = Number.isFinite(Number(t.stateSenate))
      ? Number(t.stateSenate)
      : (currentNorm === 'stateSenate'
        ? Number(t.stateLeg ?? record?.stateLegTermsServed ?? (record?.office ? 1 : 0))
        : 0);
    const stateLeg = Number.isFinite(Number(t.stateLeg))
      ? Math.max(Number(t.stateLeg), stateHouse + stateSenate)
      : (stateHouse + stateSenate);
    const house = Number.isFinite(Number(t.house)) ? Number(t.house) : (currentNorm === 'house' ? 1 : 0);
    const senate = Number.isFinite(Number(t.senate)) ? Number(t.senate) : (currentNorm === 'senate' ? 1 : 0);
    const governor = Number.isFinite(Number(t.governor)) ? Number(t.governor) : (currentNorm === 'governor' ? 1 : 0);
    const president = Number.isFinite(Number(t.president)) ? Number(t.president) : (currentNorm === 'president' ? 1 : 0);

    return {
      stateHouse,
      stateSenate,
      stateLeg,
      house,
      senate,
      governor,
      president,
    };
  }

  function isRecordActiveHolder(record) {
    if (!record || !record.id) return false;
    if (record.retired || record.isRetired || record.deceased || record.dead) return false;
    if (record.vacant || record.openSeat) return false;
    if (record.incumbentId === null && !record.name) return false;
    return true;
  }

  function getAllBenchPools(game) {
    const seen = new Map();
    const ingest = (list, source) => {
      for (const item of list) {
        if (!item || !item.id) continue;
        const existing = seen.get(item.id);
        if (!existing) {
          seen.set(item.id, { ...item, _source: source });
        } else {
          // Merge richer attributes without dropping termsServed / careerMilestones / scouted
          const mergedTerms = { ...(existing.termsServed || {}), ...(item.termsServed || {}) };
          const milestones = Array.isArray(item.careerMilestones) && item.careerMilestones.length >= (existing.careerMilestones?.length || 0)
            ? item.careerMilestones
            : (existing.careerMilestones || []);
          seen.set(item.id, {
            ...existing,
            ...item,
            scouted: Boolean(existing.scouted || item.scouted),
            termsServed: mergedTerms,
            careerMilestones: milestones,
            _source: source,
          });
        }
      }
    };

    ingest(flattenRosterEntries(game?.stateLegRoster), 'stateLegRoster');
    ingest(Array.isArray(game?.sittingMembers) ? game.sittingMembers : [], 'sittingMembers');
    ingest(Array.isArray(game?.politicians) ? game.politicians : [], 'politicians');
    return Array.from(seen.values());
  }

  function isCandidateEligibleForOffice(candidate, targetOffice, game = null) {
    if (!isRecordActiveHolder(candidate)) return false;

    const targetNorm = normalizeOfficeKey(targetOffice);
    const curNorm = normalizeOfficeKey(candidate.office, candidate);
    const formerNorm = candidate.formerOffice ? normalizeOfficeKey(candidate.formerOffice, candidate) : null;
    const quality = Number(candidate.quality ?? 6);
    const fame = Number(candidate.fame ?? 30);
    const terms = buildNormalizedTerms(candidate, curNorm);

    if (curNorm === targetNorm) return false;

    if (targetNorm === 'stateSenate' || targetNorm === 'house') {
      if (curNorm === 'stateHouse' || formerNorm === 'stateHouse') {
        return terms.stateHouse >= 1 || terms.stateLeg >= 1 || quality >= STATE_HOUSE_FASTTRACK_QUALITY;
      }
      if (targetNorm === 'house' && (curNorm === 'stateSenate' || formerNorm === 'stateSenate')) {
        return terms.stateSenate >= 1 || quality >= HIGHER_STATE_SENATE_MIN_QUALITY;
      }
      return false;
    }

    if (targetNorm === 'senate' || targetNorm === 'governor') {
      if (curNorm === 'house' || formerNorm === 'house' || terms.house >= 1) {
        return terms.house >= 1;
      }
      if (curNorm === 'stateSenate' || formerNorm === 'stateSenate' || terms.stateSenate >= 1) {
        return quality >= HIGHER_STATE_SENATE_MIN_QUALITY;
      }
      return false;
    }

    if (targetNorm === 'president') {
      const heldExecutiveOrSenate =
        curNorm === 'senate' ||
        curNorm === 'governor' ||
        formerNorm === 'senate' ||
        formerNorm === 'governor' ||
        terms.senate >= 1 ||
        terms.governor >= 1;
      return heldExecutiveOrSenate && quality >= PRESIDENT_MIN_QUALITY && fame >= PRESIDENT_MIN_FAME;
    }

    return false;
  }

  function computeBenchScore(candidate, game = null) {
    const scoutedIds = Array.isArray(game?.scoutedPoliticianIds) ? game.scoutedPoliticianIds : [];
    const isScouted = Boolean(candidate.scouted || scoutedIds.includes(candidate.id));
    const quality = Number(candidate.quality ?? 6);
    const fame = Number(candidate.fame ?? 30);
    const popularity = Number(candidate.popularity ?? 30);
    const terms = buildNormalizedTerms(candidate, normalizeOfficeKey(candidate.office, candidate));
    const totalTerms = terms.stateHouse + terms.stateSenate + terms.house + terms.senate + terms.governor;

    const scoutedBonus = isScouted ? 10000 : 0;
    const risingStarBonus = quality >= 7 ? 500 : 0;
    return scoutedBonus + risingStarBonus + quality * 120 + fame * 8 + popularity * 3 + totalTerms * 25;
  }

  // --------------------------------------------------------------------------
  // 1. Bench Query & Rising-Star Selector
  // --------------------------------------------------------------------------

  function getEligibleBenchCandidates(game, options = {}) {
    if (!game) return [];
    const {
      partyId = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || null),
      stateId = null,
      targetOffice = 'house',
      limit = null,
    } = options;

    const targetNorm = normalizeOfficeKey(targetOffice);
    const scoutedSet = new Set(Array.isArray(game.scoutedPoliticianIds) ? game.scoutedPoliticianIds : []);
    const pool = getAllBenchPools(game);

    const eligible = pool.filter((cand) => {
      if (!matchesParty(cand, partyId)) return false;
      if (stateId && targetNorm !== 'president') {
        const cState = cand.stateId || cand.state;
        if (cState !== stateId) return false;
      }
      return isCandidateEligibleForOffice(cand, targetNorm, game);
    });

    const ranked = eligible.map((cand) => {
      const scouted = Boolean(cand.scouted || scoutedSet.has(cand.id));
      const curNorm = normalizeOfficeKey(cand.office, cand);
      const termsServed = buildNormalizedTerms(cand, curNorm);
      return {
        ...cand,
        scouted,
        termsServed,
        benchScore: computeBenchScore({ ...cand, scouted }, game),
      };
    });

    ranked.sort((a, b) => {
      if (b.benchScore !== a.benchScore) return b.benchScore - a.benchScore;
      if ((b.quality || 0) !== (a.quality || 0)) return (b.quality || 0) - (a.quality || 0);
      if ((b.fame || 0) !== (a.fame || 0)) return (b.fame || 0) - (a.fame || 0);
      return String(a.name || a.id).localeCompare(String(b.name || b.id));
    });

    if (Number.isFinite(Number(limit)) && Number(limit) > 0) {
      return ranked.slice(0, Number(limit));
    }
    return ranked;
  }

  // --------------------------------------------------------------------------
  // 2. Vacancy Chain Reaction (`vacateLowerSeat`) & Promotion (`promotePoliticianToOffice`)
  // --------------------------------------------------------------------------

  function applyVacancyToRosterCollection(collection, politicianId, vacateYear, capturedMeta) {
    if (!Array.isArray(collection)) return collection;
    return collection.map((entry) => {
      if (!entry) return entry;
      if (entry.id !== politicianId && entry.incumbentId !== politicianId) return entry;
      if (!capturedMeta.name && entry.name) capturedMeta.name = entry.name;
      if (!capturedMeta.seatId && (entry.seatId || entry.districtId)) capturedMeta.seatId = entry.seatId || entry.districtId;
      if (!capturedMeta.office && entry.office) capturedMeta.office = normalizeOfficeKey(entry.office, entry);
      if (!capturedMeta.stateId && (entry.stateId || entry.state)) capturedMeta.stateId = entry.stateId || entry.state;

      return {
        ...entry,
        incumbentId: null,
        openSeat: true,
        vacant: true,
        vacatedYear: vacateYear,
        formerIncumbentId: politicianId,
        formerIncumbentName: entry.name || capturedMeta.name || null,
      };
    });
  }

  function vacateLowerSeat(game, politicianId) {
    if (!game || !politicianId) return game;
    const next = cloneGame(game);
    const year = Number(next.year || 2028);
    const meta = { office: null, seatId: null, stateId: null, name: null };

    // 1. Mark seat open in game.stateLegRoster (array or state/chamber object map)
    if (Array.isArray(next.stateLegRoster)) {
      next.stateLegRoster = applyVacancyToRosterCollection(next.stateLegRoster, politicianId, year, meta);
    } else if (next.stateLegRoster && typeof next.stateLegRoster === 'object') {
      if (Array.isArray(next.stateLegRoster.seats)) {
        next.stateLegRoster.seats = applyVacancyToRosterCollection(next.stateLegRoster.seats, politicianId, year, meta);
      } else if (Array.isArray(next.stateLegRoster.members)) {
        next.stateLegRoster.members = applyVacancyToRosterCollection(next.stateLegRoster.members, politicianId, year, meta);
      } else {
        Object.keys(next.stateLegRoster).forEach((k) => {
          const val = next.stateLegRoster[k];
          if (Array.isArray(val)) {
            next.stateLegRoster[k] = applyVacancyToRosterCollection(val, politicianId, year, meta);
          } else if (val && typeof val === 'object') {
            Object.keys(val).forEach((subK) => {
              if (Array.isArray(val[subK])) {
                val[subK] = applyVacancyToRosterCollection(val[subK], politicianId, year, meta);
              }
            });
          }
        });
      }
    }

    // 2. Mark matching seat open in game.sittingMembers (state-leg or U.S. House / lower seat)
    if (Array.isArray(next.sittingMembers)) {
      next.sittingMembers = next.sittingMembers.map((m) => {
        if (!m || (m.id !== politicianId && m.incumbentId !== politicianId)) return m;
        const norm = normalizeOfficeKey(m.office, m);
        if (!meta.office) meta.office = norm;
        if (!meta.seatId) meta.seatId = m.seatId || m.districtId || m.district || null;
        if (!meta.stateId) meta.stateId = m.stateId || m.state || null;
        if (!meta.name) meta.name = m.name || null;

        // Preserve seat metadata on a vacant open-seat placeholder so Election Night fills it cleanly
        return {
          ...m,
          id: m.sittingId || `vacant_${norm}_${m.districtId || m.seatId || m.stateId}_${year}`,
          incumbentId: null,
          openSeat: true,
          vacant: true,
          isIncumbent: false,
          incumbent: false,
          vacatedYear: year,
          formerIncumbentId: politicianId,
          formerIncumbentName: m.name || null,
          name: `Vacant (${m.districtId || m.seatId || m.stateId || OFFICE_LABELS[norm] || norm})`,
        };
      });
    }

    // 3. Mark matching seat open in game.representatives if holding U.S. House
    if (Array.isArray(next.representatives)) {
      next.representatives = next.representatives.map((r) => {
        if (!r || (r.id !== politicianId && r.incumbentId !== politicianId && r.politicianId !== politicianId)) return r;
        return {
          ...r,
          incumbentId: null,
          openSeat: true,
          vacant: true,
          formerIncumbentId: politicianId,
          formerIncumbentName: r.name || meta.name || null,
        };
      });
    }

    // 4. Remove deprecated stateLegStandouts duplicate reference if present
    if (next.stateLegStandouts && typeof next.stateLegStandouts === 'object') {
      Object.keys(next.stateLegStandouts).forEach((pid) => {
        if (Array.isArray(next.stateLegStandouts[pid])) {
          next.stateLegStandouts[pid] = next.stateLegStandouts[pid].filter((s) => s && s.id !== politicianId);
        }
      });
    }

    return next;
  }

  function buildTitleForOffice(targetNorm, meta, stateName) {
    if (targetNorm === 'stateHouse') return `State Representative (${meta.seatId || meta.stateId || ''})`;
    if (targetNorm === 'stateSenate') return `State Senator (${meta.seatId || meta.stateId || ''})`;
    if (targetNorm === 'house') return `U.S. Representative (${meta.districtId || meta.stateId || ''})`;
    if (targetNorm === 'senate') return `U.S. Senator (${meta.stateId || stateName || ''})`;
    if (targetNorm === 'governor') return `Governor of ${stateName || meta.stateId || ''}`;
    if (targetNorm === 'president') return 'President of the United States';
    return OFFICE_LABELS[targetNorm] || targetNorm;
  }

  function buildMilestoneText(targetNorm, prevNorm, prevTerms, prevRecord, raceMeta) {
    const newLoc = raceMeta.districtId || raceMeta.seatId || raceMeta.stateId || prevRecord.stateId || '';
    let newTitle;
    if (targetNorm === 'house') newTitle = `Elected U.S. Representative (${newLoc})`;
    else if (targetNorm === 'senate') newTitle = `Elected U.S. Senator (${raceMeta.stateId || prevRecord.stateId || newLoc})`;
    else if (targetNorm === 'governor') newTitle = `Elected Governor (${raceMeta.stateId || prevRecord.stateId || newLoc})`;
    else if (targetNorm === 'stateSenate') newTitle = `Elected State Senator (${newLoc})`;
    else if (targetNorm === 'president') newTitle = 'Elected President of the United States';
    else newTitle = `Elected ${OFFICE_LABELS[targetNorm] || targetNorm}`;

    const prevCount = Number(prevTerms[prevNorm] ?? (prevNorm === 'stateHouse' ? prevTerms.stateLeg : 0) ?? 0);
    if (prevCount <= 0) return newTitle;

    const termWord = prevCount === 1 ? 'term' : 'terms';
    const prevState = prevRecord.stateId || prevRecord.state || '';
    const prevSeat = prevRecord.seatId || prevRecord.districtId || prevRecord.district || '';

    if (prevNorm === 'stateHouse') {
      return `${newTitle} after ${prevCount} ${termWord} in ${prevState} State House${prevSeat ? ` (${prevSeat})` : ''}`;
    }
    if (prevNorm === 'stateSenate') {
      return `${newTitle} after ${prevCount} ${termWord} in ${prevState} State Senate${prevSeat ? ` (${prevSeat})` : ''}`;
    }
    if (prevNorm === 'house') {
      return `${newTitle} after ${prevCount} ${termWord} in U.S. House${prevSeat ? ` (${prevSeat})` : ''}`;
    }
    if (prevNorm === 'senate') {
      return `${newTitle} after ${prevCount} ${termWord} as U.S. Senator (${prevState})`;
    }
    if (prevNorm === 'governor') {
      return `${newTitle} after ${prevCount} ${termWord} as Governor (${prevState})`;
    }
    return `${newTitle} after ${prevCount} ${termWord} as ${OFFICE_LABELS[prevNorm] || prevNorm}`;
  }

  function findPoliticianRecord(game, politicianId) {
    const pools = [
      ...(Array.isArray(game?.sittingMembers) ? game.sittingMembers : []),
      ...flattenRosterEntries(game?.stateLegRoster),
      ...(Array.isArray(game?.politicians) ? game.politicians : []),
      ...(Array.isArray(game?.generatedMembers) ? game.generatedMembers : []),
    ];
    let best = null;
    for (const p of pools) {
      if (!p || p.id !== politicianId) continue;
      if (!best) {
        best = p;
      } else {
        best = {
          ...best,
          ...p,
          scouted: Boolean(best.scouted || p.scouted),
          ratings: { ...(best.ratings || {}), ...(p.ratings || {}) },
          termsServed: { ...(best.termsServed || {}), ...(p.termsServed || {}) },
          careerMilestones: Array.isArray(p.careerMilestones) && p.careerMilestones.length >= (best.careerMilestones?.length || 0)
            ? p.careerMilestones
            : (best.careerMilestones || []),
        };
      }
    }
    return best;
  }

  function promotePoliticianToOffice(game, politicianId, targetOffice, raceMeta = {}) {
    if (!game || !politicianId) return game;
    const source = findPoliticianRecord(game, politicianId);
    if (!source) return game;

    const targetNorm = normalizeOfficeKey(targetOffice);
    const prevNorm = normalizeOfficeKey(source.office, source);
    const prevTerms = buildNormalizedTerms(source, prevNorm);
    const year = Number(raceMeta.year || game.year || 2028);

    // Vacate previous lower seat first (if distinct office)
    let next = (prevNorm !== targetNorm) ? vacateLowerSeat(game, politicianId) : cloneGame(game);

    const nextTerms = { ...prevTerms };
    const incrementTerm = raceMeta.isPrimaryNomination !== true && raceMeta.incrementTerm !== false;
    if (incrementTerm) {
      nextTerms[targetNorm] = Number(nextTerms[targetNorm] || 0) + 1;
      if (targetNorm === 'stateHouse' || targetNorm === 'stateSenate') {
        nextTerms.stateLeg = nextTerms.stateHouse + nextTerms.stateSenate;
      }
    }

    const stateId = raceMeta.stateId || source.stateId || source.state || null;
    const stateName = raceMeta.stateName || source.stateName || stateId;
    const districtId = raceMeta.districtId || (targetNorm === 'house' ? `${stateId || 'US'}-AL` : null);
    const seatId = raceMeta.seatId || (targetNorm === 'stateSenate' ? `${stateId}-SS-1` : districtId);
    const party = raceMeta.party || source.party || source.partyId || resolvePartyKey(source) || 'people';
    const senateClass = raceMeta.senateClass || raceMeta.class || (targetNorm === 'senate' ? 1 : undefined);

    const defaultFameGain = targetNorm === 'president' ? 20 : (targetNorm === 'senate' || targetNorm === 'governor') ? 14 : 10;
    const fameGain = Number.isFinite(Number(raceMeta.fameBoost)) ? Number(raceMeta.fameBoost) : (incrementTerm ? defaultFameGain : 0);
    const nextFame = clamp(Math.round(Number(source.fame ?? 35) + fameGain), 1, 100);
    const rawPopularity = clamp(Math.round(Number(source.rawPopularity ?? source.popularity ?? 50)), 0, 100);
    const nextPopularity = Number.isFinite(Number(raceMeta.popularity))
      ? clamp(Math.round(Number(raceMeta.popularity)), 0, 100)
      : clamp(Math.round(Number(source.popularity ?? rawPopularity)), 0, 100);

    const milestoneDescription = raceMeta.milestoneDescription || buildMilestoneText(targetNorm, prevNorm, prevTerms, source, {
      ...raceMeta,
      stateId,
      districtId,
      seatId,
    });
    const prevMilestones = Array.isArray(source.careerMilestones) ? source.careerMilestones.map((m) => (typeof m === 'object' ? { ...m } : m)) : [];
    const newMilestone = {
      year,
      office: targetNorm,
      previousOffice: prevNorm,
      stateId,
      districtId: districtId || undefined,
      seatId: seatId || undefined,
      description: milestoneDescription,
    };

    const promoted = {
      ...source,
      id: source.id,
      name: source.name,
      gender: source.gender ?? null,
      party,
      partyId: party,
      caucus: source.caucus || party,
      factionId: source.factionId ?? null,
      stateId,
      state: stateId,
      stateName,
      districtId: districtId || source.districtId || null,
      district: districtId || source.district || null,
      seatId: seatId || source.seatId || null,
      age: source.age ?? null,
      quality: Number(source.quality ?? 6),
      ratings: source.ratings ? { ...source.ratings } : {},
      fame: nextFame,
      rawPopularity,
      popularity: nextPopularity,
      office: targetNorm,
      officeLabel: OFFICE_LABELS[targetNorm] || targetNorm,
      formerOffice: prevNorm,
      title: raceMeta.title || buildTitleForOffice(targetNorm, { seatId, districtId, stateId }, stateName),
      incumbentId: source.id,
      openSeat: false,
      vacant: false,
      isIncumbent: incrementTerm,
      incumbent: incrementTerm,
      electionYear: year,
      senateClass,
      class: senateClass,
      scouted: Boolean(source.scouted || (Array.isArray(next.scoutedPoliticianIds) && next.scoutedPoliticianIds.includes(source.id))),
      termsServed: nextTerms,
      careerMilestones: [...prevMilestones, newMilestone],
    };

    // Place promoted politician into appropriate office collection
    if (targetNorm === 'stateSenate' || targetNorm === 'stateHouse') {
      if (!Array.isArray(next.stateLegRoster)) {
        next.stateLegRoster = flattenRosterEntries(next.stateLegRoster);
      }
      const idx = next.stateLegRoster.findIndex((r) => r && r.id === promoted.id);
      if (idx >= 0) next.stateLegRoster[idx] = promoted;
      else next.stateLegRoster.push(promoted);
    } else {
      next.sittingMembers = Array.isArray(next.sittingMembers) ? next.sittingMembers.slice() : [];
      // If replacing a vacant target slot for same district/governor/senate seat, overwrite that slot cleanly
      const targetSlotIdx = next.sittingMembers.findIndex((m) => {
        if (!m) return false;
        if (m.id === promoted.id) return true;
        if (!m.vacant && !m.openSeat) return false;
        if (targetNorm === 'house' && districtId && (m.districtId === districtId || m.district === districtId)) return true;
        if (targetNorm === 'governor' && stateId && m.office === 'governor' && (m.stateId || m.state) === stateId) return true;
        if (targetNorm === 'senate' && stateId && m.office === 'senate' && (m.stateId || m.state) === stateId && Number(m.senateClass || m.class || 1) === Number(senateClass || 1)) return true;
        return false;
      });
      if (targetSlotIdx >= 0) {
        next.sittingMembers[targetSlotIdx] = promoted;
      } else {
        next.sittingMembers.push(promoted);
      }

      if (targetNorm === 'house' && Array.isArray(next.representatives) && districtId) {
        const repIdx = next.representatives.findIndex((r) => r && (r.districtId === districtId || r.id === districtId));
        if (repIdx >= 0) {
          next.representatives[repIdx] = {
            ...next.representatives[repIdx],
            id: promoted.id,
            incumbentId: promoted.id,
            name: promoted.name,
            party,
            partyId: party,
            openSeat: false,
            vacant: false,
          };
        }
      }
      if (targetNorm === 'governor' && stateId) {
        next.governorships = { ...(next.governorships || {}), [stateId]: party };
      }
    }

    // Keep master politicians ledger synchronized
    next.politicians = Array.isArray(next.politicians) ? next.politicians.slice() : [];
    const polIdx = next.politicians.findIndex((p) => p && p.id === promoted.id);
    if (polIdx >= 0) next.politicians[polIdx] = promoted;
    else next.politicians.push(promoted);

    next.lastPromotedPolitician = promoted;
    next.lastNote = milestoneDescription;
    return next;
  }

  // --------------------------------------------------------------------------
  // 3. Scout / Watchlist Toggle
  // --------------------------------------------------------------------------

  function toggleScoutCollection(arr, politicianId, nextVal) {
    if (!Array.isArray(arr)) return { arr, touched: false };
    let touched = false;
    const mapped = arr.map((item) => {
      if (!item || item.id !== politicianId) return item;
      touched = true;
      return { ...item, scouted: nextVal };
    });
    return { arr: mapped, touched };
  }

  function toggleScoutPolitician(game, politicianId) {
    if (!game || !politicianId) return game;
    const existing = findPoliticianRecord(game, politicianId);
    const curIds = Array.isArray(game.scoutedPoliticianIds) ? game.scoutedPoliticianIds : [];
    const currentlyScouted = Boolean(existing?.scouted || curIds.includes(politicianId));
    const nextScouted = !currentlyScouted;

    const next = cloneGame(game);
    next.scoutedPoliticianIds = nextScouted
      ? Array.from(new Set([...curIds, politicianId]))
      : curIds.filter((id) => id !== politicianId);

    if (Array.isArray(next.stateLegRoster)) {
      next.stateLegRoster = toggleScoutCollection(next.stateLegRoster, politicianId, nextScouted).arr;
    } else if (next.stateLegRoster && typeof next.stateLegRoster === 'object') {
      Object.keys(next.stateLegRoster).forEach((k) => {
        if (Array.isArray(next.stateLegRoster[k])) {
          next.stateLegRoster[k] = toggleScoutCollection(next.stateLegRoster[k], politicianId, nextScouted).arr;
        } else if (next.stateLegRoster[k] && typeof next.stateLegRoster[k] === 'object') {
          Object.keys(next.stateLegRoster[k]).forEach((subK) => {
            if (Array.isArray(next.stateLegRoster[k][subK])) {
              next.stateLegRoster[k][subK] = toggleScoutCollection(next.stateLegRoster[k][subK], politicianId, nextScouted).arr;
            }
          });
        }
      });
    }

    if (Array.isArray(next.sittingMembers)) {
      next.sittingMembers = toggleScoutCollection(next.sittingMembers, politicianId, nextScouted).arr;
    }
    if (Array.isArray(next.politicians)) {
      next.politicians = toggleScoutCollection(next.politicians, politicianId, nextScouted).arr;
    }
    if (Array.isArray(next.generatedMembers)) {
      next.generatedMembers = toggleScoutCollection(next.generatedMembers, politicianId, nextScouted).arr;
    }

    next.lastNote = existing
      ? `${existing.name} ${nextScouted ? 'added to' : 'removed from'} primary recruitment watchlist.`
      : `Politician ${politicianId} ${nextScouted ? 'scouted' : 'unscouted'}.`;
    return next;
  }

  return {
    OFFICE_ORDER,
    OFFICE_LABELS,
    normalizeOfficeKey,
    isCandidateEligibleForOffice,
    computeBenchScore,
    findPoliticianRecord,
    getEligibleBenchCandidates,
    promotePoliticianToOffice,
    vacateLowerSeat,
    toggleScoutPolitician,
  };
});
