// ============================================================================
// Coalition Builder: Party Chair — Version 0.7 Integration Scaffolding
// ============================================================================
// Shared data schemas, simulation contracts, UI registries, and save hydration
// for Version 0.7 (Proposal A: "The Party Machine").
// Designed so Agent 1 (Data/Roster), Agent 2 (Engine), Agent 3 (UI/Maps),
// and Agent 4 (Save Migration/QA) can integrate cleanly without conflicts.
// ============================================================================

(function PartyChairV07ScaffoldingModule() {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const round = (n, places = 1) => Math.round(n * (10 ** places)) / (10 ** places);

  function fnvHash(text) {
    let value = 2166136261;
    const str = String(text || '');
    for (let i = 0; i < str.length; i += 1) {
      value ^= str.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return (value >>> 0) / 4294967295;
  }

  // --------------------------------------------------------------------------
  // 1. AGENT 1 SCAFFOLDING: DATA, GEOGRAPHY, REGIONS & ROSTER (REQ-08..16, 25)
  // --------------------------------------------------------------------------

  // REQ-08: 10-Stat Candidate Rating Schema (1–10 scale)
  const CANDIDATE_RATING_KEYS = [
    { id: 'persuadability', label: 'Persuadability', positive: true, desc: 'Wins undecideds and cross-party voters' },
    { id: 'turnout', label: 'Turnout', positive: true, desc: 'Mobilizes base voters in state/district' },
    { id: 'debate', label: 'Debate', positive: true, desc: 'Performance under pressure on stage' },
    { id: 'charisma', label: 'Charisma', positive: true, desc: 'Public presence, media draw, and keynote power' },
    { id: 'corruption', label: 'Corruption Risk', positive: false, desc: 'Scandal/ethics vulnerability (1 = clean, 10 = corrupt)' },
    { id: 'fundraising', label: 'Fundraising', positive: true, desc: 'Donor network appeal and self-financing' },
    { id: 'fieldcraft', label: 'Fieldcraft', positive: true, desc: 'Ground-game organization and chapter synergy' },
    { id: 'experience', label: 'Experience', positive: true, desc: 'Legislative/executive seasoning and caucus respect' },
    { id: 'mediaSavvy', label: 'Media Savvy', positive: true, desc: 'Earned media discipline and message control' },
    { id: 'regionalStrength', label: 'Regional Strength', positive: true, desc: 'Home-region affinity across overlapping regions' },
  ];

  function computeCandidateQuality(ratings = {}) {
    const positiveKeys = CANDIDATE_RATING_KEYS.filter((k) => k.positive).map((k) => k.id);
    const sum = positiveKeys.reduce((acc, key) => acc + Number(ratings[key] ?? 5), 0);
    const avgPositive = sum / positiveKeys.length;
    const corruptionPenalty = Math.max(0, (Number(ratings.corruption ?? 3) - 4) * 0.2);
    return clamp(Math.round(avgPositive - corruptionPenalty), 1, 10);
  }

  function generateCandidateRatings(seedKey, targetAverage = 5.5) {
    const ratings = {};
    CANDIDATE_RATING_KEYS.forEach((stat, idx) => {
      const h = fnvHash(`${seedKey}:stat:${stat.id}:${idx}`);
      if (!stat.positive) {
        // Corruption defaults lower (mostly 1-6, occasional high risk)
        ratings[stat.id] = clamp(Math.round(1 + h * 7), 1, 10);
      } else {
        const spread = (h - 0.5) * 5.2;
        ratings[stat.id] = clamp(Math.round(targetAverage + spread), 1, 10);
      }
    });
    return ratings;
  }

  // REQ-25: State recruits have an average quality rating of 7
  function generateRecruitRatings(seedKey) {
    return generateCandidateRatings(`${seedKey}:recruit-v07`, 7.0);
  }

  function normalizeCandidateRecord(record, seedKey = 'default', targetAverage = null) {
    if (!record) return record;
    const baseQuality = Number.isFinite(record.quality)
      ? record.quality
      : Number.isFinite(record.skill)
        ? clamp(record.skill * 2, 1, 10)
        : (targetAverage ?? 5.5);
    const ratings = record.ratings
      ? { ...generateCandidateRatings(seedKey, baseQuality), ...record.ratings }
      : generateCandidateRatings(seedKey, targetAverage ?? baseQuality);
    const quality = computeCandidateQuality(ratings);
    const fame = clamp(
      Math.round(Number.isFinite(record.fame) ? record.fame : defaultFameForRecord(record, seedKey)),
      1,
      100
    );
    return {
      ...record,
      ratings,
      quality,
      fame,
      isIncumbent: Boolean(record.isIncumbent),
      happiness: clamp(Number.isFinite(record.happiness) ? record.happiness : 70, 0, 100),
    };
  }

  // REQ-10: Politician Fame Metric (1–100) independent of skill ratings
  function defaultFameForRecord(record = {}, seedKey = '') {
    const h = fnvHash(`${seedKey}:fame:${record.id || record.name || ''}`);
    if (record.office === 'president' || ['ossoff', 'vance'].includes(record.id)) return Math.round(86 + h * 10);
    if (record.office === 'senate' || record.office === 'governor') return Math.round(52 + h * 32);
    if (record.office === 'house') return Math.round(20 + h * 38);
    if (record.skill) return Math.round(48 + h * 35);
    return Math.round(12 + h * 33);
  }

  // REQ-16: 8 Expanded & Overlapping Cultural/Political Regions
  const OVERLAPPING_REGIONS = {
    'Prairie States': ['ND', 'SD', 'NE', 'KS', 'OK', 'IA', 'MN', 'MT', 'WY'],
    'Pacific Northwest': ['WA', 'OR', 'ID', 'AK'],
    'Deep South': ['AL', 'MS', 'GA', 'SC', 'LA', 'AR', 'FL', 'TX'],
    'Appalachia': ['WV', 'KY', 'TN', 'VA', 'NC', 'OH', 'PA'],
    'New England': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT'],
    'Rust Belt': ['PA', 'OH', 'MI', 'WI', 'IN', 'IL', 'NY', 'WV'],
    'Great Lakes States': ['MI', 'WI', 'MN', 'IL', 'IN', 'OH', 'PA', 'NY'],
    'The Rockies': ['CO', 'UT', 'ID', 'MT', 'WY', 'NV', 'NM', 'AZ'],
  };

  const OVERLAPPING_REGION_NAMES = Object.keys(OVERLAPPING_REGIONS);

  function regionsForState(stateId, fallbackMacroRegion = null) {
    const matched = OVERLAPPING_REGION_NAMES.filter((regionName) =>
      OVERLAPPING_REGIONS[regionName].includes(stateId)
    );
    if (matched.length > 0) return matched;
    const stateObj = window.PartyChairData?.VERSION_01_STATES?.find((s) => s.id === stateId);
    const macro = fallbackMacroRegion || stateObj?.region || 'South';
    return [macro];
  }

  // REQ-13 / BUG-01: Senate Class Converter & 2026 Incumbent Overrides
  function normalizeSenateClassNumber(cls) {
    if (cls === 1 || cls === '1' || cls === 'I') return 1;
    if (cls === 2 || cls === '2' || cls === 'II') return 2;
    if (cls === 3 || cls === '3' || cls === 'III') return 3;
    return 3;
  }

  function normalizeSenateClassRoman(cls) {
    const n = normalizeSenateClassNumber(cls);
    return n === 1 ? 'I' : n === 2 ? 'II' : 'III';
  }

  // Explicit 2026 Senate Incumbent Audit Overrides (REQ-13)
  const SENATE_2026_AUDIT_OVERRIDES = {
    'AK:2': {
      stateId: 'AK',
      class: 2,
      party: 'people',
      incumbent: 'Mary Peltola',
      label: 'Mary Peltola (D)',
      electionYear: 2026,
      isIncumbent: true,
    },
    'MS:2': {
      stateId: 'MS',
      class: 2,
      party: 'people',
      incumbent: 'Scott Colom',
      label: 'Scott Colom (D)',
      electionYear: 2026,
      isIncumbent: true,
    },
  };

  function applySenate2026AuditToMaps() {
    const maps = window.PartyChairData?.VERSION_03_MAPS;
    if (!maps || !Array.isArray(maps.senators)) return;
    maps.senators = maps.senators.map((seat) => {
      const cls = normalizeSenateClassNumber(seat.class);
      const key = `${seat.stateId}:${cls}`;
      const override = SENATE_2026_AUDIT_OVERRIDES[key];
      if (override) {
        return { ...seat, ...override, class: cls };
      }
      return { ...seat, class: cls };
    });
  }

  // REQ-09: Sitting Member Roster Builder (Senators, Governors, House Reps)
  function buildDefaultSittingMembers(seed = 2028) {
    if (Array.isArray(window.PartyChairData?.SITTING_MEMBERS) && window.PartyChairData.SITTING_MEMBERS.length > 0) {
      const baseList = window.PartyChairData.SITTING_MEMBERS.map((m) => normalizeCandidateRecord(m, `${seed}:${m.id}`));
      const hasSeo = baseList.some((m) => m.office === 'statewide_executive');
      if (!hasSeo && Array.isArray(window.PartyChairData?.STARTING_STATEWIDE_OFFICERS)) {
        window.PartyChairData.STARTING_STATEWIDE_OFFICERS.forEach((off) => {
          baseList.push(normalizeCandidateRecord({
            ...off,
            office: 'statewide_executive',
            chamber: 'statewide_executive',
            regions: regionsForState(off.stateId),
            wing: off.factionLabel || off.factionId,
            isIncumbent: true,
          }, `${seed}:seo:${off.officeId || off.id}`, off.quality || 7.0));
        });
      }
      return baseList;
    }
    const roster = [];
    const data = window.PartyChairData || {};
    const maps = data.VERSION_03_MAPS || {};
    const states = data.VERSION_01_STATES || [];
    const names = data.VERSION_01_RACE_CANDIDATE_NAMES || {
      first: ['Avery', 'Jordan', 'Morgan', 'Riley', 'Casey', 'Taylor', 'Quinn', 'Cameron', 'Skyler', 'Drew', 'Parker', 'Reese'],
      last: ['Bennett', 'Caldwell', 'Diaz', 'Ellis', 'Foster', 'Grant', 'Hayes', 'Irwin', 'James', 'Kim', 'Lane', 'Monroe'],
    };
    const wingsFor = (partyId) => partyId === 'people'
      ? ['Progressive', 'Moderate', 'Labor advocate', 'Local coalition']
      : ['MAGA populist', 'Moderate', 'Faith & community', 'Business conservative'];

    // 1. Sitting Senators (100 seats across Classes I, II, III)
    const senators = Array.isArray(maps.senators) ? maps.senators : [];
    senators.forEach((seat, index) => {
      const cls = normalizeSenateClassNumber(seat.class);
      const override = SENATE_2026_AUDIT_OVERRIDES[`${seat.stateId}:${cls}`];
      const partyId = override?.party || seat.party || 'people';
      const class3Race = (data.VERSION_01_SENATE_RACES || []).find((r) => r.state === seat.stateId);
      const rawName = override?.incumbent
        || (cls === 3 && class3Race?.incumbent ? class3Race.incumbent : null)
        || (seat.label ? String(seat.label).replace(/\s*\([^)]*\)\s*$/, '').trim() : null);
      const h = Math.floor(fnvHash(`${seed}:sen:${seat.stateId}:${cls}`) * 10000);
      const fallbackName = `${names.first[h % names.first.length]} ${names.last[(h >>> 4) % names.last.length]}`;
      const wings = wingsFor(partyId);
      roster.push(normalizeCandidateRecord({
        id: `sitting-sen-${seat.stateId}-c${cls}`,
        name: rawName && !/seat|winner|gain|retained/i.test(rawName) ? rawName : `${fallbackName} (${seat.stateId})`,
        party: partyId,
        office: 'senate',
        chamber: 'senate',
        senateClass: cls,
        stateId: seat.stateId,
        regions: regionsForState(seat.stateId),
        wing: wings[index % wings.length],
        isIncumbent: true,
        happiness: 72,
      }, `${seed}:sen:${seat.stateId}:${cls}`, 6.8));
    });

    // 2. Sitting Governors (50 states)
    states.forEach((state, index) => {
      const govParty = data.VERSION_01_GOVERNORS?.[state.id]
        || data.VERSION_01_GOVERNOR_LEADS?.[state.id]
        || maps.governors?.[state.id]
        || (state.lean >= 0 ? 'people' : 'heritage');
      const h = Math.floor(fnvHash(`${seed}:gov:${state.id}`) * 10000);
      const govName = `${names.first[(h + 3) % names.first.length]} ${names.last[(h >>> 3) % names.last.length]}`;
      const wings = wingsFor(govParty);
      roster.push(normalizeCandidateRecord({
        id: `sitting-gov-${state.id}`,
        name: `Gov. ${govName} (${state.id})`,
        party: govParty,
        office: 'governor',
        chamber: 'executive',
        stateId: state.id,
        regions: regionsForState(state.id, state.region),
        wing: wings[index % wings.length],
        isIncumbent: true,
        happiness: 72,
      }, `${seed}:gov:${state.id}`, 6.6));
    });

    // 3. Sitting U.S. House Representatives (435 districts)
    const houseResults = Array.isArray(maps.houseResults) ? maps.houseResults : [];
    const houseById = new Map(houseResults.map((r) => [r.id, r]));
    (data.VERSION_01_HOUSE_DISTRICTS || []).forEach((district, index) => {
      const result = houseById.get(district.id);
      const partyId = (result && !result.pending && result.party)
        ? result.party
        : (district.lean >= 0 ? 'people' : 'heritage');
      const h = Math.floor(fnvHash(`${seed}:house:${district.id}`) * 10000);
      const repName = `${names.first[(h + 5) % names.first.length]} ${names.last[(h >>> 5) % names.last.length]}`;
      const wings = wingsFor(partyId);
      roster.push(normalizeCandidateRecord({
        id: `sitting-house-${district.id}`,
        name: `Rep. ${repName} (${district.id})`,
        party: partyId,
        office: 'house',
        chamber: 'house',
        stateId: district.stateId,
        districtId: district.id,
        regions: regionsForState(district.stateId),
        wing: wings[index % wings.length],
        isIncumbent: true,
        happiness: 70,
      }, `${seed}:house:${district.id}`, 5.8));
    });

    // 4. Statewide Elected Executive Officers (v0.16.6 — 50-state partisan at-large incumbents)
    const startingStatewide = Array.isArray(data.STARTING_STATEWIDE_OFFICERS) ? data.STARTING_STATEWIDE_OFFICERS : [];
    startingStatewide.forEach((off) => {
      roster.push(normalizeCandidateRecord({
        ...off,
        office: 'statewide_executive',
        chamber: 'statewide_executive',
        regions: regionsForState(off.stateId),
        wing: off.factionLabel || off.factionId,
        isIncumbent: true,
      }, `${seed}:seo:${off.officeId || off.id}`, off.quality || 7.0));
    });

    return roster;
  }

  // --------------------------------------------------------------------------
  // 2. AGENT 2 SCAFFOLDING: ENGINE, TRUST, LEADERSHIP ROLES & BUDGETS
  // --------------------------------------------------------------------------

  // REQ-21: Starting National Committee Budgets ($M)
  const STARTING_BUDGETS = {
    major: 150,
    minor: 10,
    custom: 25,
  };

  // REQ-176: 5-Stage Institutional Ascent Ladder (1: Fringe, 2: Ballot-Qualified, 3: Recognized, 4: Contender, 5: Major)
  function resolveTierPartyKey(game, partyId) {
    if (!partyId || partyId === 'player') {
      return game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    }
    return partyId;
  }

  function countFullBallotStatesForParty(game, partyKey) {
    const access = game?.ballotAccess?.[partyKey];
    if (!access) return 0;
    const sen = access.senate || {};
    const gov = access.governor || {};
    const leg = access.leg || {};
    const allKeys = new Set([...Object.keys(sen), ...Object.keys(gov), ...Object.keys(leg)]);
    let fullCount = 0;
    allKeys.forEach((stId) => {
      if ((sen[stId] && gov[stId]) || leg[stId]) {
        fullCount += 1;
      }
    });
    return fullCount;
  }

  const FALLBACK_INSTITUTIONAL_TIERS = [
    {
      tier: 0,
      id: 'extremist',
      name: 'Extremist Movement',
      shortLabel: 'Extremist',
      maxFocusSlots: 1,
      badgeColor: '#b91c1c',
      description: 'Operating on the ideological periphery under intense civic stigma, radioactive ballot scrutiny, and severe media hostility.',
      nextRequirement: 'Reach 350,000 registered voters nationwide, win 3 state legislative seats, or qualify on 5 state ballots to become a recognized Fringe Party.',
    },
    { tier: 1, id: 'fringe', name: 'Fringe Party', shortLabel: 'Fringe', maxFocusSlots: 3, badgeColor: '#6b7280', description: 'Operating outside national broadcast coverage with limited ballot lines and steep uphill organizing.', nextRequirement: 'Reach 2% national presidential vote or secure full ballot access in 10+ states to become Ballot-Qualified.' },
    { tier: 2, id: 'ballot_qualified', name: 'Ballot-Qualified Minor', shortLabel: 'Ballot-Qualified', maxFocusSlots: 3, badgeColor: '#0284c7', description: 'Established multi-state ballot lines unlock Regional Chapter Momentum waves and Fusion cross-endorsement deals.', nextRequirement: 'Win 5% national presidential popular vote to earn Federal Recognition, FEC Matching Funds, and 5 Focus Slots.' },
    { tier: 3, id: 'federally_recognized', name: 'Federally Recognized Party', shortLabel: 'Recognized', maxFocusSlots: 5, badgeColor: '#7c3aed', description: 'Qualifies for passive FEC Public Matching Funds, automatic state ballot retention, and 5 strategic Party Focus slots.', nextRequirement: 'Reach 15% in national polling or presidential vote to break the media blackout and qualify for the Debate Stage.' },
    { tier: 4, id: 'debate_contender', name: 'Debate-Qualified Contender', shortLabel: 'Contender', maxFocusSlots: 5, badgeColor: '#d97706', description: 'Shatters the national broadcast blackout, qualifies for the Presidential Debate Stage, and unlocks fledgling allied Super PACs.', nextRequirement: 'Win 20% presidential vote, hold 35 House / 8 Senate / 5 Governor seats, or eclipse a major party to reach Major Party Status.' },
    { tier: 5, id: 'major_party', name: 'Major Party', shortLabel: 'Major', maxFocusSlots: 7, badgeColor: '#059669', description: 'Full national institutional parity with 7 strategic Party Focus slots, unrestricted Super PAC coordination, and immunity to wasted-vote squeezes.', nextRequirement: 'Maximum institutional standing achieved.' },
  ];

  function getPartyRepresentedVoters(game, partyId) {
    const isPlayerArg = !partyId || partyId === 'player';
    const isCustomPlayer = Boolean(game?.player?.custom) && (isPlayerArg || partyId === 'custom');
    const resolvedKey = isCustomPlayer ? 'player' : resolveTierPartyKey(game, partyId);
    const data = (typeof window !== 'undefined' && window.PartyChairData) ? window.PartyChairData : {};
    const vm = game?.voterModel;

    // 1. Check voterModel affiliations ledger first for custom/player or direct party entries
    if (vm?.affiliations) {
      if (resolvedKey === 'player' && vm.affiliations.player && Number.isFinite(Number(vm.affiliations.player.representedVoters))) {
        return Number(vm.affiliations.player.representedVoters);
      }
      if (vm.affiliations[resolvedKey] && Number.isFinite(Number(vm.affiliations[resolvedKey].representedVoters))) {
        return Number(vm.affiliations[resolvedKey].representedVoters);
      }
    }

    // 2. Sum party factions from live voterModel.factions or catalog FACTION_NATIONAL_TOTALS
    const catalog = (Array.isArray(game?.factions) && game.factions.length)
      ? game.factions
      : (data.FACTIONS_CATALOG || data.FACTIONS || []);
    const factionMap = vm?.factions || data.FACTION_NATIONAL_TOTALS || null;
    if (catalog.length && factionMap) {
      const partyFactions = catalog.filter((f) => f.partyId === resolvedKey);
      if (partyFactions.length) {
        const sum = partyFactions.reduce((acc, f) => acc + Number(factionMap[f.id] ?? factionMap[f.name] ?? f.targetVoters ?? 0), 0);
        if (sum > 0) return sum;
      }
    }

    // 3. Check thirdParty.byParty units (native 1:1 in v0.18.0+, x100 for legacy 1:100)
    if (vm?.affiliations?.thirdParty?.byParty && Number.isFinite(Number(vm.affiliations.thirdParty.byParty[resolvedKey]))) {
      const _v07Scale = (vm.voterScale === '1:1' || Number(vm.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
      return Number(vm.affiliations.thirdParty.byParty[resolvedKey]) * _v07Scale;
    }

    // 4. Custom party fallback
    if (isCustomPlayer) {
      if (Number.isFinite(Number(game?.player?.customStartVoters))) return Number(game.player.customStartVoters);
      return 100000;
    }

    // 5. Canonical catalog baselines
    const baselines = {
      people: 52649500,
      heritage: 49077200,
      liberty: 1147900,
      green: 493400,
      constitution: 230000,
      socialist: 230000,
    };
    return baselines[resolvedKey] ?? 100000;
  }

  function countPresidentialBallotStatesForParty(game, resolvedKey) {
    const access = game?.ballotAccess?.[resolvedKey];
    if (!access) return 0;
    const states = (typeof window !== 'undefined' && Array.isArray(window.PartyChairData?.STATES))
      ? window.PartyChairData.STATES.map((s) => s.id)
      : [];
    const seen = new Set();
    if (access.presidential && typeof access.presidential === 'object') {
      Object.entries(access.presidential).forEach(([stId, ok]) => { if (ok) seen.add(stId); });
    }
    const stateSet = new Set(states);
    Object.entries(access).forEach(([k, v]) => {
      if (v === true && (stateSet.size === 0 ? /^[A-Z]{2}$/.test(k) : stateSet.has(k))) {
        seen.add(k);
      }
    });
    return seen.size;
  }

  function countStateLegislativeSeatsForParty(game, resolvedKey, isPlayerArg = false) {
    const counts = game?.stateHouseSeatCounts || {};
    let total = 0;
    Object.values(counts).forEach((stRow) => {
      if (!stRow || typeof stRow !== 'object') return;
      total += Number(stRow[resolvedKey] || 0);
      if (isPlayerArg && resolvedKey !== 'player' && Number(stRow.player || 0) > 0) {
        total += Number(stRow.player || 0);
      }
    });
    return total;
  }

  function evaluateAscensionGauntlet(game, partyId = 'player') {
    const isPlayerArg = !partyId || partyId === 'player';
    const isCustomPlayer = Boolean(game?.player?.custom) && (isPlayerArg || partyId === 'custom');
    const resolvedKey = isCustomPlayer ? 'player' : resolveTierPartyKey(game, partyId);

    const persistedMemory = Boolean(
      game?.ascensionGauntletCompleted?.[resolvedKey]
      || (isPlayerArg && game?.ascensionGauntletCompleted?.player)
    );
    const voters = getPartyRepresentedVoters(game, partyId);
    const stateLegSeats = countStateLegislativeSeatsForParty(game, resolvedKey, isPlayerArg);
    const presBallotStates = countPresidentialBallotStatesForParty(game, resolvedKey);

    const lastPres = (game?.elections || []).slice().reverse().find((e) => e.type !== 'midterm' && e.nationalVote);
    let lastPresShare = 0;
    if (lastPres && lastPres.nationalVote) {
      const nv = lastPres.nationalVote;
      lastPresShare = Number((isPlayerArg ? (nv.player ?? nv[resolvedKey] ?? 0) : (nv[resolvedKey] ?? 0)) || 0);
    }

    const path1Voters = voters >= 350000;
    const path2Statehouse = stateLegSeats >= 3;
    const path3Ballot = presBallotStates >= 5;
    const path4PopularVote = lastPresShare >= 1.0;

    const achievedPaths = [];
    if (path1Voters) achievedPaths.push('grassroots_expansion');
    if (path2Statehouse) achievedPaths.push('statehouse_foothold');
    if (path3Ballot) achievedPaths.push('multi_state_footprint');
    if (path4PopularVote) achievedPaths.push('popular_vote_beachhead');

    return {
      partyKey: resolvedKey,
      persistedMemory,
      completed: persistedMemory || achievedPaths.length > 0,
      achievedPaths,
      voters,
      stateLegSeats,
      presBallotStates,
      lastPresShare,
      paths: {
        grassroots_expansion: { met: path1Voters, current: voters, target: 350000, ratio: Math.min(1, voters / 350000) },
        statehouse_foothold: { met: path2Statehouse, current: stateLegSeats, target: 3, ratio: Math.min(1, stateLegSeats / 3) },
        multi_state_footprint: { met: path3Ballot, current: presBallotStates, target: 5, ratio: Math.min(1, presBallotStates / 5) },
        popular_vote_beachhead: { met: path4PopularVote, current: lastPresShare, target: 1.0, ratio: Math.min(1, lastPresShare / 1.0) },
      },
    };
  }

  function computePartyInstitutionalTierRaw(game, partyId) {
    const isPlayerArg = !partyId || partyId === 'player';
    const isCustomPlayer = Boolean(game?.player?.custom) && (isPlayerArg || partyId === 'custom');
    const resolvedKey = isCustomPlayer ? 'player' : resolveTierPartyKey(game, partyId);
    const isBaselineMajor = !isCustomPlayer && ['people', 'heritage'].includes(resolvedKey);

    const lastPres = (game?.elections || []).slice().reverse().find((e) => e.type !== 'midterm' && e.nationalVote);
    let lastPresShare = null;
    let eclipsedMajor = false;
    if (lastPres && lastPres.nationalVote) {
      const nv = lastPres.nationalVote;
      const shareVal = isPlayerArg
        ? (nv.player ?? nv[resolvedKey] ?? 0)
        : (nv[resolvedKey] ?? 0);
      lastPresShare = Number(shareVal || 0);
      if (!isBaselineMajor && lastPresShare > 0) {
        const demShare = Number(nv.people ?? 0);
        const repShare = Number(nv.heritage ?? 0);
        if ((demShare > 0 && lastPresShare > demShare) || (repShare > 0 && lastPresShare > repShare)) {
          eclipsedMajor = true;
        }
      }
    }

    // Path 2: Bottom-Up Institutional Critical Mass (>= 35 House, >= 8 Senate, or >= 5 Governors)
    const seatCounts = partySeatCounts(game, resolvedKey);
    const playerExtraSeats = (isPlayerArg || resolvedKey === (game?.player?.baseTemplateId || ''))
      ? Number(game?.seats || 0)
      : Number(game?.organizations?.[resolvedKey]?.seats || 0);
    const houseSeats = Math.max(seatCounts.house || 0, playerExtraSeats);
    const senateSeats = seatCounts.senate || 0;
    const govMapCount = Object.values(game?.governorships || {}).filter((p) => p === resolvedKey || (isPlayerArg && p === 'player')).length;
    const governorSeats = Math.max(seatCounts.governors || 0, govMapCount);

    const hasCriticalMass = houseSeats >= 35 || senateSeats >= 8 || governorSeats >= 5;

    // Tier 5: Major Party Status (20% Pres, Institutional Critical Mass, Major Eclipse, or starting baseline major)
    if (
      (lastPresShare !== null && lastPresShare >= 20.0)
      || hasCriticalMass
      || eclipsedMajor
      || (lastPresShare === null && isBaselineMajor)
    ) {
      return 5;
    }

    // Live polling check for Tier 4 dynamic qualification (>= 15% polling)
    const pollMap = game?.lastNationalPoll || game?.nationalPolling || null;
    const livePollShare = pollMap
      ? Number((isPlayerArg ? (pollMap.player ?? pollMap[resolvedKey]) : pollMap[resolvedKey]) ?? 0)
      : 0;

    const fullBallotStates = countFullBallotStatesForParty(game, resolvedKey);
    const presBallotCount = Object.values(game?.ballotAccess?.[resolvedKey]?.presidential || {}).filter(Boolean).length;
    const federalSeats = houseSeats + senateSeats;

    // Tier 4: Debate-Qualified Contender (>= 12% Polling/Pres Vote OR 40+ pres ballot states & 12+ federal seats)
    if ((lastPresShare !== null && lastPresShare >= 12.0) || livePollShare >= 12.0 || (presBallotCount >= 40 && federalSeats >= 12)) {
      return 4;
    }

    // Tier 3: Federally Recognized Party (>= 3.5% Pres Vote OR 25+ pres ballot states & 5+ federal seats OR statehouse farm team bridge: 18+ pres ballot states & 5+ federal/statehouse seats)
    const stateLegSeatsCount = Object.values(game?.stateHouseSeatCounts || {}).reduce((sum, row) => sum + Number(row?.[resolvedKey] || 0), 0);
    const standoutsCount = (game?.stateLegStandouts?.[resolvedKey] || []).length;
    if ((lastPresShare !== null && lastPresShare >= 3.5) || (presBallotCount >= 25 && federalSeats >= 5) || (presBallotCount >= 18 && (federalSeats * 2 + stateLegSeatsCount + standoutsCount) >= 5)) {
      return 3;
    }

    // Tier 2: Ballot-Qualified Minor (>= 1.5% Pres Vote OR sustaining multi-state ballot access across 10+ states OR 2+ Senate / 5+ House)
    const retainedCount = Array.isArray(game?.retainedBallotStates?.[resolvedKey]) ? game.retainedBallotStates[resolvedKey].length : 0;
    const legAccessCount = Object.values(game?.ballotAccess?.[resolvedKey]?.leg || {}).filter(Boolean).length;
    const hasSustainedBallot = retainedCount >= 10 || legAccessCount >= 10 || presBallotCount >= 15 || ((game?.elections || []).length > 0 && fullBallotStates >= 10);
    if ((lastPresShare !== null && lastPresShare >= 1.5) || hasSustainedBallot || senateSeats >= 2 || houseSeats >= 5) {
      return 2;
    }

    // REQ-268 & REQ-273: Tier 0 Extremist Movement (< 350,000 represented voters AND no Ascension Gauntlet breakthrough)
    if (!isBaselineMajor) {
      const gauntlet = evaluateAscensionGauntlet(game, partyId);
      if (!gauntlet.completed) {
        return 0;
      }
    }

    // Tier 1: Fringe (< 2%)
    return 1;
  }

  function getPartyInstitutionalTier(game, partyId = 'player') {
    if (!game) return ['people', 'heritage'].includes(partyId) ? 5 : 1;
    const isPlayerArg = !partyId || partyId === 'player';
    const isCustomPlayer = Boolean(game?.player?.custom) && (isPlayerArg || partyId === 'custom');
    const resolvedKey = isCustomPlayer ? 'player' : resolveTierPartyKey(game, partyId);
    const isBaselineMajor = !isCustomPlayer && ['people', 'heritage'].includes(resolvedKey);

    if (game?.partyTiers && (game.partyTiers[resolvedKey] !== undefined || (isPlayerArg && game.partyTiers.player !== undefined))) {
      const explicitTier = Number(game.partyTiers[resolvedKey] !== undefined ? game.partyTiers[resolvedKey] : game.partyTiers.player);
      if (Number.isFinite(explicitTier)) {
        return clamp(Math.round(explicitTier), 0, 5);
      }
    }

    // v0.16.7.2: Cycle-start IF-checks allow parties to drop down tiers when they lose qualification.
    // State leg seats only qualify for 1 cycle; Senate seats qualify for the full duration they are held.
    const computedTier = computePartyInstitutionalTierRaw(game, partyId);
    const seatCounts = partySeatCounts(game, resolvedKey);
    const heldSenateSeats = Number(seatCounts?.senate || 0);
    const wonStateLegLastCycle = Boolean(
      game?.stateLegWonLastCycle?.[resolvedKey]
      || (isPlayerArg && game?.stateLegWonLastCycle?.player)
    );
    let effectiveTier = computedTier;
    // Holding >= 1 Senate seat guarantees at least Tier 2 for the duration held
    if (heldSenateSeats >= 1 && effectiveTier < 2) {
      effectiveTier = 2;
    }
    // Winning state legislature seats grants Tier 1 automatic qualification for 1 cycle only
    if (wonStateLegLastCycle && effectiveTier < 1) {
      effectiveTier = 1;
    }
    return clamp(effectiveTier, 0, 5);
  }

  function getMaxFocusSlots(game, partyId = 'player') {
    const tier = getPartyInstitutionalTier(game, partyId);
    if (tier <= 0) return 1;
    return tier >= 5 ? 7 : tier >= 3 ? 5 : 3;
  }

  function evaluatePartyInstitutionalTiers(game) {
    const partyKeys = ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'];
    if (game?.player?.custom) partyKeys.push('player');
    const nextTiers = {};
    partyKeys.forEach((key) => {
      const computed = computePartyInstitutionalTierRaw(game, key);
      const prev = Number(game?.partyTiers?.[key]);
      const isBaselineMajor = ['people', 'heritage'].includes(key);
      const lastPres = (game?.elections || []).slice().reverse().find((e) => e.type !== 'midterm' && e.nationalVote);
      if (isBaselineMajor && lastPres && computed < 5) {
        nextTiers[key] = computed;
      } else if (Number.isFinite(prev)) {
        const floor = game?.ascensionGauntletCompleted?.[key] ? 1 : 0;
        nextTiers[key] = clamp(Math.max(floor, prev, computed), 0, 5);
      } else {
        const floor = game?.ascensionGauntletCompleted?.[key] ? 1 : 0;
        nextTiers[key] = Math.max(floor, computed);
      }
    });
    return nextTiers;
  }

  // REQ-20 & REQ-176: Backward-compatible wrapper returning tier >= 5
  function isMajorParty(game, partyId = 'player') {
    return getPartyInstitutionalTier(game, partyId) >= 5;
  }

  function startingBudgetForParty(baseTemplateId, isCustom = false) {
    if (isCustom || ['constitution', 'socialist'].includes(baseTemplateId)) return 1.0;
    if (['people', 'heritage'].includes(baseTemplateId)) return STARTING_BUDGETS.major;
    return STARTING_BUDGETS.minor;
  }

  // REQ-06: Tri-Partisan Electorate Trust System (0–100 scale)
  const DEFAULT_TRUST = {
    supporters: 65,
    independents: 50,
    opponents: 25,
  };

  function normalizeTrust(trust) {
    return {
      supporters: clamp(round(Number(trust?.supporters ?? DEFAULT_TRUST.supporters), 1), 0, 100),
      independents: clamp(round(Number(trust?.independents ?? DEFAULT_TRUST.independents), 1), 0, 100),
      opponents: clamp(round(Number(trust?.opponents ?? DEFAULT_TRUST.opponents), 1), 0, 100),
    };
  }

  function calculateTrustEffects(trustObj) {
    const t = normalizeTrust(trustObj);
    return {
      // Base Supporter Trust drives turnout multiplier (0.85x to 1.15x)
      turnoutMultiplier: round(0.85 + (t.supporters / 100) * 0.30, 3),
      // Independent Trust drives swing persuasion margin (-4.0 to +4.0 pts)
      independentMarginLift: round((t.independents - 50) * 0.08, 2),
      // Opponent Party Member Trust drives ranked-choice / 3-party transfer share (0.10 to 0.65)
      transferAppealWeight: round(0.10 + (t.opponents / 100) * 0.55, 3),
    };
  }

  // REQ-11: 14 Structured Party Leadership Roles & Eligibility
  const LEADERSHIP_ROLES_SCHEMA = [
    // Category A — Institutional, Legislative & Executive Leaders
    { id: 'senateLeader', label: 'Senate Leader', getLabel: (isMajority) => isMajority ? 'Senate Majority Leader' : 'Senate Minority Leader', category: 'institutional', requiredOffice: 'senate', minSeats: 1, multiplier: 1.0, passiveDesc: '+2.0 Senate race support & legislative cohesion' },
    { id: 'houseLeader', label: 'House Leader', getLabel: (isMajority) => isMajority ? 'House Majority Leader' : 'House Minority Leader', category: 'institutional', requiredOffice: 'house', minSeats: 1, multiplier: 1.0, passiveDesc: '+1.5 House district support & caucus discipline' },
    { id: 'senateWhip', label: 'Senate Whip', category: 'institutional', requiredOffice: 'senate', minSeats: 10, multiplier: 1.0, passiveDesc: '+4 Sitting Member Happiness & bill endorsement speed' },
    { id: 'houseWhip', label: 'House Whip', category: 'institutional', requiredOffice: 'house', minSeats: 10, multiplier: 1.0, passiveDesc: '+4 Sitting Member Happiness & House turnout lift' },
    { id: 'speakerOfHouse', label: 'House Speaker', category: 'institutional', requiredOffice: 'house', requiresMajority: true, multiplier: 1.5, passiveDesc: '+$8M annual fundraising & +3.0 national environment' },
    { id: 'govAssocChair', label: 'Chair of the Governors Assoc.', category: 'institutional', requiredOffice: 'governor', minSeats: 1, multiplier: 1.0, passiveDesc: '+2.0 Gubernatorial & State Legislature support' },
    // REQ-226: Stepping-Stone State Legislative Caucus Chair Role
    { id: 'stateLegCaucusChair', label: 'State Legislative Caucus Chair', category: 'institutional', requiredOffice: 'stateLeg', minSeats: 1, multiplier: 1.0, passiveDesc: '+1.5 State Legislature support & unlocks keynote / tour actions' },
    { id: 'president', label: 'President of the United States', category: 'institutional', requiredOffice: 'president', requiresPresidency: true, isLocked: true, multiplier: 5.0, passiveDesc: 'Elected Head of State (Single-party locked). Approval under 50% damages party down-ballot.' },
    { id: 'vicePresident', label: 'Vice President of the United States', category: 'institutional', requiredOffice: 'vicePresident', requiresPresidency: true, isLocked: true, multiplier: 1.5, passiveDesc: 'Locked with Administration party. +3.0 Supporter Trust & Senate tie-breaker.' },
    // Category B — Party, Media & Faction Leaders (Can overlap with Category A)
    { id: 'rhetoricalLeader', label: 'Rhetorical Leader', category: 'party', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Passively boosts Independent & Opponent Trust via Charisma/Persuadability' },
    { id: 'policyLeader', label: 'Policy Leader', category: 'party', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Private internal role: boosts Sitting Member Happiness & party member unity (no public effect)' },
    // REQ-110: Governing Cabinet (4 Roles unlocked if holding White House)
    { id: 'cabinet_state', label: 'Secretary of State', category: 'cabinet', requiresPresidency: true, allowOverlap: true, multiplier: 1.2, passiveDesc: 'Cabinet executive: +2.0 National Environment & international diplomatic prestige' },
    { id: 'cabinet_defense', label: 'Secretary of Defense', category: 'cabinet', requiresPresidency: true, allowOverlap: true, multiplier: 1.2, passiveDesc: 'Cabinet executive: +2.0 Veteran/Defense credibility & national security standing' },
    { id: 'cabinet_treasury', label: 'Secretary of the Treasury', category: 'cabinet', requiresPresidency: true, allowOverlap: true, multiplier: 1.2, passiveDesc: 'Cabinet executive: +$5M annual party fundraising & economic competence' },
    { id: 'cabinet_ag', label: 'Attorney General', category: 'cabinet', requiresPresidency: true, allowOverlap: true, multiplier: 1.2, passiveDesc: 'Cabinet executive: +3.0 Supporter Trust & rule-of-law integrity' },
    // REQ-110: Opposition Leadership (3 Roles unlocked for largest non-presidential party)
    { id: 'opp_house', label: 'House Opposition Leader', category: 'opposition', requiredOffice: 'house', requiresOpposition: true, minSeats: 1, multiplier: 1.0, passiveDesc: 'Opposition caucus lead: +1.5 House race support & opposition messaging' },
    { id: 'opp_senate', label: 'Senate Opposition Leader', category: 'opposition', requiredOffice: 'senate', requiresOpposition: true, minSeats: 1, multiplier: 1.0, passiveDesc: 'Opposition chamber lead: +2.0 Senate race support & filibuster cohesion' },
    { id: 'opp_gov', label: 'Gubernatorial Association Opposition Chair', category: 'opposition', requiredOffice: 'governor', requiresOpposition: true, minSeats: 1, multiplier: 1.0, passiveDesc: 'Opposition governor lead: +2.0 Gubernatorial support & state-level critique' },
    // REQ-157: Dynamic Faction Leaders (Major Factions Only: >= 5.0M voters, 6 Dem / 6 GOP at start)
    { id: 'faction_dem_abundance', label: 'Abundance Leader', category: 'faction', partyId: 'people', factionId: 'dem_abundance', factionName: 'Abundance', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Abundance confidence & pro-growth base turnout' },
    { id: 'faction_dem_liberal_establishment', label: 'The Liberal Establishment Leader', category: 'faction', partyId: 'people', factionId: 'dem_liberal_establishment', factionName: 'The Liberal Establishment', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies The Liberal Establishment confidence & base turnout' },
    { id: 'faction_dem_black_voters', label: 'Black Voters Leader', category: 'faction', partyId: 'people', factionId: 'dem_black_voters', factionName: 'Black Voters', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Black Voters confidence & base turnout' },
    { id: 'faction_dem_capital_l_left', label: 'The Capital L Left Leader', category: 'faction', partyId: 'people', factionId: 'dem_capital_l_left', factionName: 'The Capital L Left', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies The Capital L Left confidence & base turnout' },
    { id: 'faction_dem_neo_liberals', label: 'Neo-Liberals Leader', category: 'faction', partyId: 'people', factionId: 'dem_neo_liberals', factionName: 'Neo-Liberals', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Neo-Liberals confidence & base turnout' },
    { id: 'faction_dem_bernie_bros', label: 'Bernie Bros Leader', category: 'faction', partyId: 'people', factionId: 'dem_bernie_bros', factionName: 'Bernie Bros', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Bernie Bros confidence & base turnout' },
    { id: 'faction_dem_faith_based_liberals', label: 'Faith Based Liberals Leader', category: 'faction', partyId: 'people', factionId: 'dem_faith_based_liberals', factionName: 'Faith Based Liberals', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Faith Based Liberals confidence & base turnout' },
    { id: 'faction_dem_blue_dog', label: 'Blue Dog Democrats Leader', category: 'faction', partyId: 'people', factionId: 'dem_blue_dog', factionName: 'Blue Dog Democrats', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Blue Dog Democrats confidence & base turnout' },
    { id: 'faction_gop_faith_and_flag', label: 'Faith & Flag Conservatives Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_faith_and_flag', factionName: 'Faith & Flag Conservatives', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Faith & Flag Conservatives confidence & traditional mobilization' },
    { id: 'faction_gop_maga', label: 'Nationalist Populists (MAGA) Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_maga', factionName: 'Nationalist Populists (MAGA)', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Nationalist Populists (MAGA) confidence & grassroots turnout' },
    { id: 'faction_gop_western_mavericks', label: 'Liberty & Western Mavericks Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_western_mavericks', factionName: 'Liberty & Western Mavericks', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Liberty & Western Mavericks confidence & western support' },
    { id: 'faction_gop_blood_and_soil', label: 'Blood and Soil Nationalists Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_blood_and_soil', factionName: 'Blood and Soil Nationalists', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Blood and Soil Nationalists confidence & base turnout' },
    { id: 'faction_gop_suburban_moderates', label: 'Frontier & Suburban Moderates Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_suburban_moderates', factionName: 'Frontier & Suburban Moderates', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Frontier & Suburban Moderates confidence & independent persuasion' },
    { id: 'faction_gop_neo_cons', label: 'Neo-Cons Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_neo_cons', factionName: 'Neo-Cons', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Neo-Cons confidence & institutional defense' },
    { id: 'faction_gop_paleocons', label: 'Paleocons Leader', category: 'faction', partyId: 'heritage', factionId: 'gop_paleocons', factionName: 'Paleocons', allowOverlap: true, multiplier: 1.0, passiveDesc: 'Steadies Paleocons confidence & constitutional discipline' },
  ];

  function partySeatCounts(game, partyIdentityId) {
    const sitting = game?.sittingMembers || [];
    // Count party members plus aligned caucus members (e.g., King & Sanders caucusing with Democrats)
    const senate = sitting.filter((m) => m.office === 'senate' && (m.party === partyIdentityId || m.caucus === partyIdentityId)).length;
    const house = sitting.filter((m) => m.office === 'house' && (m.party === partyIdentityId || m.caucus === partyIdentityId)).length;
    const governors = sitting.filter((m) => m.office === 'governor' && m.party === partyIdentityId).length;
    const rivalHouse = sitting.filter((m) => m.office === 'house' && m.party !== partyIdentityId && m.caucus !== partyIdentityId).length;
    const rivalSenate = sitting.filter((m) => m.office === 'senate' && m.party !== partyIdentityId && m.caucus !== partyIdentityId).length;
    // Exactly one party holds the presidency at a time
    const governingParty = game?.governingParty || game?.lastElection?.presidentialWinner || 'people';
    const holdsPresidency = governingParty === partyIdentityId;
    return {
      senate,
      house,
      governors,
      hasHousePlurality: house > 0 && house >= rivalHouse,
      hasSenatePlurality: senate > 0 && senate >= rivalSenate,
      holdsPresidency,
    };
  }

  function isRoleUnlockedForParty(game, partyIdentityId, roleDef) {
    if (roleDef.category === 'faction') {
      if (roleDef.partyId && roleDef.partyId !== partyIdentityId) return false;
      const fId = roleDef.factionId;
      if (fId) {
        const liveF = (game?.factions || []).find((f) => f && f.id === fId);
        if (liveF && liveF.partyId !== partyIdentityId) return false;
        const voters = Number(game?.voterModel?.factions?.[fId] ?? window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[fId] ?? liveF?.targetVoters ?? 0);
        if (voters < 5000000) return false;
      }
    }
    const counts = partySeatCounts(game, partyIdentityId);
    if (roleDef.requiresPresidency) {
      if (roleDef.category === 'cabinet' && game?.coalitionCabinetPosts?.[roleDef.id] === partyIdentityId) {
        return true;
      }
      return counts.holdsPresidency;
    }
    if (roleDef.requiresOpposition) {
      if (counts.holdsPresidency) return false;
      const governingParty = game?.governingParty || game?.lastElection?.presidentialWinner || 'people';
      const sitting = game?.sittingMembers || [];
      const myTotal = sitting.filter((m) => m.party === partyIdentityId || m.caucus === partyIdentityId).length;
      const otherParties = [...new Set(sitting.map((m) => m.party))].filter((p) => p !== governingParty && p !== partyIdentityId);
      const isLargest = otherParties.every((p) => {
        const theirTotal = sitting.filter((m) => m.party === p || m.caucus === p).length;
        return myTotal >= theirTotal;
      });
      if (!isLargest) return false;
      if (roleDef.requiredOffice === 'house') return counts.house >= (roleDef.minSeats || 1);
      if (roleDef.requiredOffice === 'senate') return counts.senate >= (roleDef.minSeats || 1);
      if (roleDef.requiredOffice === 'governor') return counts.governors >= (roleDef.minSeats || 1);
      return true;
    }
    if (roleDef.requiresMajority) return counts.hasHousePlurality;
    if (roleDef.id === 'stateLegCaucusChair') {
      const sitting = game?.sittingMembers || [];
      const stateLegCount = sitting.filter((m) => m.office === 'stateLeg' && (m.party === partyIdentityId || m.caucus === partyIdentityId)).length;
      let totalStateSeats = 0;
      const shCounts = game?.stateHouseSeatCounts || {};
      for (const st in shCounts) {
        totalStateSeats += shCounts[st]?.[partyIdentityId] || 0;
      }
      const hasStateSeats = stateLegCount > 0 || totalStateSeats > 0;
      return hasStateSeats && counts.house === 0 && counts.senate === 0;
    }
    if (roleDef.requiredOffice === 'senate') return counts.senate >= (roleDef.minSeats || 1);
    if (roleDef.requiredOffice === 'house') return counts.house >= (roleDef.minSeats || 1);
    if (roleDef.requiredOffice === 'governor') return counts.governors >= (roleDef.minSeats || 1);
    if (roleDef.requiredOffice === 'stateLeg') return true;
    return true; // Category B roles are open to all parties
  }

  function getLeadershipRolesSchemaForParty(partyIdentityId = 'people') {
    return LEADERSHIP_ROLES_SCHEMA.filter((role) => {
      if (role.category !== 'faction') return true;
      return !role.partyId || role.partyId === partyIdentityId;
    });
  }

  function initializeLeadershipRolesForParty(game, partyIdentityId) {
    const sitting = (game?.sittingMembers || []).filter((m) => m.party === partyIdentityId);
    const byFame = (list) => list.slice().sort((a, b) => (b.fame || 0) - (a.fame || 0) || (b.quality || 0) - (a.quality || 0));
    const senators = byFame(sitting.filter((m) => m.office === 'senate'));
    const reps = byFame(sitting.filter((m) => m.office === 'house'));
    const govs = byFame(sitting.filter((m) => m.office === 'governor'));
    const allPool = byFame([
      ...sitting,
      ...(window.PartyChairData?.MEMBERS || []).filter((m) => m.party === partyIdentityId).map((m) => normalizeCandidateRecord(m, m.id)),
    ]);

    const findMemberId = (list, query, fallbackId) => {
      const match = list.find((m) => m.name && m.name.toLowerCase().includes(query.toLowerCase()));
      return match ? match.id : fallbackId;
    };

    const roles = {};
    LEADERSHIP_ROLES_SCHEMA.forEach((role) => {
      if (!isRoleUnlockedForParty(game, partyIdentityId, role)) {
        roles[role.id] = null;
        return;
      }
      if (role.id === 'senateLeader') {
        if (partyIdentityId === 'people') roles[role.id] = findMemberId(senators, 'Schumer', 'senate:NY:class-3');
        else if (partyIdentityId === 'heritage') roles[role.id] = findMemberId(senators, 'Thune', 'senate:SD:class-3');
        else roles[role.id] = senators[0]?.id || null;
      } else if (role.id === 'speakerOfHouse') {
        // REQ-278: NY-8 fallback strictly scoped to 'people' (Democratic); null/vacant for unseated third/custom parties
        if (partyIdentityId === 'people') roles[role.id] = findMemberId(reps, 'Jeffries', 'house:NY-8');
        else roles[role.id] = reps[0]?.id || null;
      } else if (role.id === 'houseLeader') {
        // AOC as majority leader for Dems, Jim Jordan / Jim Jeffries as minority leader for GOP
        if (partyIdentityId === 'people') roles[role.id] = findMemberId(reps, 'Ocasio', 'house:NY-14');
        else if (partyIdentityId === 'heritage') roles[role.id] = findMemberId(reps, 'Jordan', 'house:OH-4');
        else roles[role.id] = (reps[1] || reps[0])?.id || null;
      } else if (role.id === 'senateWhip') {
        roles[role.id] = (senators[1] || senators[0])?.id || null;
      } else if (role.id === 'houseWhip') {
        roles[role.id] = (reps[2] || reps[0])?.id || null;
      } else if (role.id === 'govAssocChair') {
        roles[role.id] = govs[0]?.id || null;
      } else if (role.id === 'president') {
        // Locked single-party presidency
        roles[role.id] = partyIdentityId === 'people' ? 'ossoff' : partyIdentityId === 'heritage' ? 'vance' : allPool[0]?.id || null;
      } else if (role.id === 'vicePresident') {
        // VP always same party as president
        roles[role.id] = (govs[0] || senators[0] || allPool[1])?.id || null;
      } else if (role.id === 'rhetoricalLeader') {
        roles[role.id] = null;
      } else if (role.id === 'policyLeader') {
        roles[role.id] = null;
      } else if (role.id === 'cabinet_state') {
        roles[role.id] = (allPool[2] || senators[0])?.id || null;
      } else if (role.id === 'cabinet_defense') {
        roles[role.id] = (allPool[3] || senators[1] || senators[0])?.id || null;
      } else if (role.id === 'cabinet_treasury') {
        roles[role.id] = (allPool[4] || reps[0])?.id || null;
      } else if (role.id === 'cabinet_ag') {
        roles[role.id] = (allPool[5] || reps[1] || reps[0])?.id || null;
      } else if (role.id === 'opp_house') {
        roles[role.id] = reps[0]?.id || null;
      } else if (role.id === 'opp_senate') {
        roles[role.id] = senators[0]?.id || null;
      } else if (role.id === 'opp_gov') {
        roles[role.id] = govs[0]?.id || null;
      } else if (role.category === 'faction') {
        roles[role.id] = null;
      }
    });
    return roles;
  }

  // REQ-04 & REQ-05: Incumbent Endorsement Backlash Evaluator
  function evaluateEndorsementBacklash(game, raceId, partyId, candidateId) {
    const field = game?.primaryFields?.[raceId]?.[partyId] || [];
    const incumbent = field.find((c) => c.isIncumbent);
    const chosen = field.find((c) => c.id === candidateId);
    if (incumbent && chosen && incumbent.id !== chosen.id) {
      return {
        triggeredBacklash: true,
        incumbentName: incumbent.name,
        challengerName: chosen.name,
        sittingMemberHappinessDelta: -18,
        supporterTrustDelta: -8,
        note: `BACKLASH: Endorsing ${chosen.name} against sitting incumbent ${incumbent.name} outraged party legislators (-18 Sitting Member Happiness, -0.8 Supporter Trust).`,
      };
    }
    return {
      triggeredBacklash: false,
      sittingMemberHappinessDelta: incumbent && chosen && incumbent.id === chosen.id ? +2 : 0,
      supporterTrustDelta: 0,
      note: null,
    };
  }

  // REQ-37: Unified 40-Issue Platform -> 4 Ideological Summary Axes
  function recalculatePlatformAxesFromIssues(issuePositions = {}, fallbackPlayer = {}) {
    const issues = window.PartyChairData?.VERSION_021_ISSUES || [];
    if (!issues.length) return fallbackPlayer;
    const sums = { economic: 0, social: 0, climate: 0, local: 0 };
    const counts = { economic: 0, social: 0, climate: 0, local: 0 };
    issues.forEach((issue) => {
      const axis = issue.axis;
      if (sums[axis] === undefined) return;
      const val = Number(issuePositions[issue.id] ?? 5.5);
      const normalized = ((val - 5.5) / 4.5) * (issue.highAxisDirection || 1);
      sums[axis] += normalized;
      counts[axis] += 1;
    });
    return {
      economic: counts.economic ? clamp(round(sums.economic / counts.economic, 2), -1, 1) : (fallbackPlayer.economic ?? 0),
      social: counts.social ? clamp(round(sums.social / counts.social, 2), -1, 1) : (fallbackPlayer.social ?? 0),
      climate: counts.climate ? clamp(round(sums.climate / counts.climate, 2), -1, 1) : (fallbackPlayer.climate ?? 0),
      local: counts.local ? clamp(round(sums.local / counts.local, 2), -1, 1) : (fallbackPlayer.local ?? 0),
    };
  }

  // REQ-03: 3 Issue Priorities & 3 Regional Priorities (+ $8M per extra region)
  const PRIORITY_RULES = {
    maxIssuePriorities: 3,
    freeRegionalPriorities: 3,
    extraRegionCostMillions: 8,
  };

  function extraRegionalPriorityCost(regionalPriorities = []) {
    const extraCount = Math.max(0, regionalPriorities.length - PRIORITY_RULES.freeRegionalPriorities);
    return extraCount * PRIORITY_RULES.extraRegionCostMillions;
  }

  // REQ-14: State-Targeted Policy Bills (Requires controlling at least 1 chamber in target state)
  function canIntroduceBillInState(game, stateId, partyIdentityId) {
    const chambers = game?.stateLegislatures?.[stateId] || window.PartyChairData?.VERSION_01_STATE_LEGISLATURES?.[stateId] || [];
    return chambers.includes(partyIdentityId);
  }

  // --------------------------------------------------------------------------
  // 3. AGENT 3 SCAFFOLDING: FULLSCREEN TABS & 4-STEP TURN WORKFLOW (REQ-01, 02)
  // --------------------------------------------------------------------------

  const TOP_TABS = [
    { id: 'actions', label: 'Actions', eyebrow: 'Turn Workflow' },
    { id: 'map', label: 'Map', eyebrow: 'National Landscape' },
    { id: 'states', label: 'States', eyebrow: '50-State Directory' },
    { id: 'forecast', label: 'Forecast', eyebrow: 'Trust, Leadership & Outlook' },
  ];

  const TURN_WORKFLOW_STEPS = [
    { step: 1, id: 'issues', label: 'Issue Positions', summary: 'Adjust your party platform across 40 national issues.' },
    { step: 2, id: 'priorities', label: '3 Priorities', summary: 'Select 3 issue priorities and up to 3 free regional priorities ($8M per extra region).' },
    { step: 3, id: 'endorsements', label: 'Primary Endorsements', summary: 'Review Senate Class III & Governor primary fields and endorse 1 candidate per race.' },
    { step: 4, id: 'work', label: 'Choose This Year’s Work', summary: 'Build state chapters, recruit candidates, pass state bills, assign leadership roles, and select a Keynote Speaker.' },
  ];

  const customTabRenderers = {};
  const customStepRenderers = {};

  function registerTabRenderer(tabId, renderFn) {
    customTabRenderers[tabId] = renderFn;
  }

  function registerStepRenderer(stepId, renderFn) {
    customStepRenderers[stepId] = renderFn;
  }

  // --------------------------------------------------------------------------
  // 4. AGENT 4 SCAFFOLDING: SAVE HYDRATION & STATE MIGRATION
  // --------------------------------------------------------------------------

  function hydrateV07GameState(game) {
    if (!game || !game.player) return game;
    applySenate2026AuditToMaps();

    const playerIdentity = game.player.custom
      ? 'player'
      : (game.player.baseTemplateId || game.player.id || 'people');

    // Ensure overlapping regions on all STATES records (REQ-16)
    if (Array.isArray(window.PartyChairData?.STATES)) {
      window.PartyChairData.STATES.forEach((st) => {
        if (!Array.isArray(st.regions) || !st.regions.length) {
          st.regions = regionsForState(st.id, st.region);
        }
      });
    }

    // Ensure sitting members roster (REQ-08, REQ-09, REQ-10)
    const sittingMembers = Array.isArray(game.sittingMembers) && game.sittingMembers.length > 0
      ? game.sittingMembers.map((m) => normalizeCandidateRecord(m, `${game.seed}:${m.id}`))
      : buildDefaultSittingMembers(game.seed || 2028);

    // Ensure 50-state chapter map for player & rivals (REQ-15, REQ-264, REQ-265)
    const stateOrganizations = game.stateOrganizations
      ? JSON.parse(JSON.stringify(game.stateOrganizations))
      : JSON.parse(JSON.stringify(window.PartyChairData?.VERSION_01_STATE_ORGANIZATIONS || {}));
    const stateChapters = { ...(game.stateChapters || {}) };
    const allStates = window.PartyChairData?.VERSION_01_STATES || window.PartyChairData?.STATES || [];
    const start3rdDict = window.PartyChairData?.STARTING_3RD_PARTY_CHAPTERS || (typeof window !== 'undefined' && window.PartyChairEngine?.STARTING_3RD_PARTY_CHAPTERS);
    allStates.forEach((st) => {
      const stateRec = stateOrganizations[st.id] || (stateOrganizations[st.id] = {});
      ['people', 'heritage', 'liberty', 'green', 'constitution', 'socialist'].forEach((pid) => {
        const isMajor = ['people', 'heritage'].includes(pid);
        if (!stateRec[pid]) {
          const ch = isMajor ? 2 : (start3rdDict?.[pid]?.[st.id] || 0);
          stateRec[pid] = { chapters: ch, strength: ch > 0 ? 25 : 0 };
        } else if (!isMajor && start3rdDict) {
          stateRec[pid].chapters = start3rdDict[pid]?.[st.id] || 0;
          if (stateRec[pid].chapters === 0) stateRec[pid].strength = 0;
        }
      });
      if (game.player?.custom) {
        stateRec['player'] = { chapters: 0, strength: 0 };
        stateChapters[st.id] = 0;
      } else if (!['people', 'heritage'].includes(playerIdentity)) {
        const pCh = start3rdDict?.[playerIdentity]?.[st.id] || 0;
        if (!stateRec['player']) stateRec['player'] = { chapters: pCh, strength: pCh > 0 ? 20 : 0 };
        stateChapters[st.id] = Number(stateChapters[st.id] ?? pCh);
      } else if (!Number.isFinite(stateChapters[st.id])) {
        stateChapters[st.id] = Number(stateRec[playerIdentity]?.chapters || 0);
      }
    });

    // Migrate legacy candidateEndorsements / primaryEndorsements to per-race map (REQ-04)
    const migratedPrimaryEndorsements = { ...(game.raceEndorsements || {}) };
    if (game.primaryEndorsements && typeof game.primaryEndorsements === 'object') {
      Object.entries(game.primaryEndorsements).forEach(([key, val]) => {
        if (typeof val === 'string') migratedPrimaryEndorsements[key] = val;
      });
    }
    if (Array.isArray(game.candidateEndorsements)) {
      game.candidateEndorsements.forEach((candId) => {
        const str = String(candId || '');
        const dashMatch = str.match(/^(.+)-(people|heritage|liberty|green)-(?:\d+|recruit)$/);
        if (dashMatch) {
          const raceKey = dashMatch[1];
          if (!migratedPrimaryEndorsements[raceKey]) migratedPrimaryEndorsements[raceKey] = str;
          return;
        }
        const parts = str.split(':');
        if (parts.length >= 2) {
          const raceKey = parts.length >= 4 ? parts.slice(0, -2).join(':') : `${parts[0]}:${parts[1]}`;
          if (!migratedPrimaryEndorsements[raceKey]) {
            migratedPrimaryEndorsements[raceKey] = str;
          }
        }
      });
    }

    const playerTrust = normalizeTrust(game.trust || game.player?.trust);
    const rivalTrust = Object.fromEntries((game.rivals || []).map((r) => [
      r.id,
      normalizeTrust(game.rivalTrust?.[r.id] || r.trust),
    ]));

    const hydrated = {
      ...game,
      version: '0.7',
      player: {
        ...game.player,
        trust: playerTrust,
      },
      rivals: (game.rivals || []).map((r) => ({
        ...r,
        trust: rivalTrust[r.id] || normalizeTrust(r.trust),
      })),
      sittingMembers,
      sittingMemberHappiness: clamp(Number.isFinite(game.sittingMemberHappiness) ? game.sittingMemberHappiness : 70, 0, 100),
      trust: playerTrust,
      rivalTrust,
      stateOrganizations,
      stateChapters,
      issuePriorities: Array.isArray(game.issuePriorities) ? game.issuePriorities.slice(0, 3) : [],
      regionalPriorities: Array.isArray(game.regionalPriorities) ? game.regionalPriorities : [],
      primaryEndorsements: migratedPrimaryEndorsements,
      raceEndorsements: migratedPrimaryEndorsements,
      keynoteSpeakerId: game.keynoteSpeakerId || null,
      keynoteRegions: Array.isArray(game.keynoteRegions) ? game.keynoteRegions : [],
      eventResolved: game.phase === 'organizing' ? true : Boolean(game.eventResolved),
      activeTab: game.activeTab || 'actions',
      turnStep: clamp(Number(game.turnStep || 1), 1, 5),
    };

    // Ensure leadership roles for player and rival parties (REQ-11, REQ-110)
    const playerRoles = (hydrated.player?.leadershipRoles && Object.keys(hydrated.player.leadershipRoles).length >= 14)
      ? hydrated.player.leadershipRoles
      : initializeLeadershipRolesForParty(hydrated, playerIdentity);
    hydrated.player = {
      ...hydrated.player,
      leadershipRoles: playerRoles,
    };
    hydrated.rivals = (hydrated.rivals || []).map((rival) => ({
      ...rival,
      leadershipRoles: (rival.leadershipRoles && Object.keys(rival.leadershipRoles).length >= 14)
        ? rival.leadershipRoles
        : initializeLeadershipRolesForParty(hydrated, rival.id),
    }));
    hydrated.leadershipRoles = playerRoles;

    return hydrated;
  }


  // v0.16.8: Support office: null politicians generated for unrepresented factions & Faction Leader assignment
  function registerDynamicFactionPolitician(game, candidate) {
    if (!game || !candidate) return candidate;
    const rec = normalizeCandidateRecord({
      ...candidate,
      office: candidate.office === undefined ? null : candidate.office,
      isIncumbent: Boolean(candidate.isIncumbent),
    }, `${game.seed || 2028}:dyn:${candidate.id}`, candidate.quality || 5.8);
    if (!Array.isArray(game.politicians)) game.politicians = [];
    if (!game.politicians.some((p) => p.id === rec.id)) {
      game.politicians.push(rec);
    }
    if (!game.factionLeaders) game.factionLeaders = {};
    if (rec.factionId && !game.factionLeaders[rec.factionId]) {
      game.factionLeaders[rec.factionId] = rec.id;
    }
    return rec;
  }

  function assignFactionLeader(game, factionId, politicianId) {
    if (!game || !factionId || !politicianId) return game;
    return {
      ...game,
      factionLeaders: { ...(game.factionLeaders || {}), [factionId]: politicianId },
    };
  }

  window.PartyChairV07 = {
    registerDynamicFactionPolitician,
    assignFactionLeader,
    CANDIDATE_RATING_KEYS,
    OVERLAPPING_REGIONS,
    OVERLAPPING_REGION_NAMES,
    SENATE_2026_AUDIT_OVERRIDES,
    STARTING_BUDGETS,
    DEFAULT_TRUST,
    LEADERSHIP_ROLES_SCHEMA,
    PRIORITY_RULES,
    TOP_TABS,
    TURN_WORKFLOW_STEPS,
    customTabRenderers,
    customStepRenderers,
    computeCandidateQuality,
    generateCandidateRatings,
    generateRecruitRatings,
    normalizeCandidateRecord,
    defaultFameForRecord,
    regionsForState,
    normalizeSenateClassNumber,
    normalizeSenateClassRoman,
    applySenate2026AuditToMaps,
    buildDefaultSittingMembers,
    isMajorParty,
    getPartyInstitutionalTier,
    FALLBACK_INSTITUTIONAL_TIERS,
    getPartyRepresentedVoters,
    evaluateAscensionGauntlet,
    computePartyInstitutionalTierRaw,
    getMaxFocusSlots,
    evaluatePartyInstitutionalTiers,
    startingBudgetForParty,
    normalizeTrust,
    calculateTrustEffects,
    partySeatCounts,
    isRoleUnlockedForParty,
    getLeadershipRolesSchemaForParty,
    initializeLeadershipRolesForParty,
    evaluateEndorsementBacklash,
    recalculatePlatformAxesFromIssues,
    extraRegionalPriorityCost,
    canIntroduceBillInState,
    registerTabRenderer,
    registerStepRenderer,
    hydrateV07GameState,
  };
})();
