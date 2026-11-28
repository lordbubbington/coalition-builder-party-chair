// ============================================================================
// COALITION BUILDER: PARTY CHAIR — UNIVERSAL RACE EXPLORER UI
// Standalone UMD/IIFE module exposing window.RaceExplorerUI & module.exports.
// Lets players inspect any race: President, U.S. Senate, Governor, U.S. House,
// State Senate, and State House — complete with all 6 differentiators.
// ============================================================================
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.RaceExplorerUI = api;
  } else if (root && typeof root === 'object') {
    root.RaceExplorerUI = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const RACE_TYPES = [
    { id: 'president', label: 'President' },
    { id: 'senate', label: 'U.S. Senate' },
    { id: 'governor', label: 'Governor' },
    { id: 'house', label: 'U.S. House' },
    { id: 'state_senate', label: 'State Senate' },
    { id: 'state_house', label: 'State House' }
  ];

  const FILTER_CHIPS = [
    { id: 'all', label: 'All Seats' },
    { id: 'close', label: 'Close (±5%)' },
    { id: 'third_party', label: '3rd-Party Viable' },
    { id: 'q7_plus', label: 'Q7+ Stars' },
    { id: 'open', label: 'Open Seats' },
    { id: 'up_this_cycle', label: 'Up This Cycle' }
  ];

  const STATE_NAMES = {
    NATIONAL: 'National (All 51 Jurisdictions)',
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida',
    GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
    IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
    MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
    OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
    SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
    VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
    WY: 'Wyoming'
  };

  const FIFTY_STATES = Object.keys(STATE_NAMES).filter((k) => k !== 'NATIONAL' && k !== 'DC');

  // Realistic state senate sizes fallback (50 states)
  const STATE_SENATE_SIZES = {
    AL: 35, AK: 20, AZ: 30, AR: 35, CA: 40, CO: 35, CT: 36, DE: 21, FL: 40, GA: 56,
    HI: 25, ID: 35, IL: 59, IN: 50, IA: 50, KS: 40, KY: 38, LA: 39, ME: 35, MD: 47,
    MA: 40, MI: 38, MN: 67, MS: 52, MO: 34, MT: 50, NE: 49, NV: 21, NH: 24, NJ: 40,
    NM: 42, NY: 63, NC: 50, ND: 47, OH: 33, OK: 48, OR: 30, PA: 50, RI: 38, SC: 46,
    SD: 35, TN: 33, TX: 31, UT: 29, VT: 30, VA: 40, WA: 49, WV: 34, WI: 33, WY: 31
  };

  const DEFAULT_HOUSE_COUNTS = {
    AL: 7, AK: 1, AZ: 9, AR: 4, CA: 52, CO: 8, CT: 5, DE: 1, FL: 28, GA: 14,
    HI: 2, ID: 2, IL: 17, IN: 9, IA: 4, KS: 4, KY: 6, LA: 6, ME: 2, MD: 8,
    MA: 9, MI: 13, MN: 8, MS: 4, MO: 8, MT: 2, NE: 3, NV: 4, NH: 2, NJ: 12,
    NM: 3, NY: 26, NC: 14, ND: 1, OH: 15, OK: 5, OR: 6, PA: 17, RI: 2, SC: 7,
    SD: 1, TN: 9, TX: 38, UT: 4, VT: 1, VA: 11, WA: 10, WV: 2, WI: 8, WY: 1
  };

  const PARTY_COLORS = {
    people: '#3478c8',
    heritage: '#c9474e',
    independent: '#1abc9c',
    liberty: '#e0a94f',
    green: '#4fa86e',
    constitution: '#8a68b8',
    socialist: '#d65a7e',
    other: '#c3924d',
    vacant: '#59616c'
  };

  const PARTY_LABELS = {
    people: 'Democratic',
    heritage: 'Republican',
    independent: 'Independent',
    liberty: 'Libertarian',
    green: 'Green',
    constitution: 'Constitution',
    socialist: 'Socialist',
    other: 'Third Party',
    vacant: 'Vacant'
  };

  const PARTY_SHORT = {
    people: 'D',
    heritage: 'R',
    independent: 'I',
    liberty: 'L',
    green: 'G',
    constitution: 'C',
    socialist: 'S',
    other: '3P',
    vacant: 'V'
  };

  function defaultSafe(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function hashNum(str) {
    let h = 2166136261;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function resolvePlayerParty(game) {
    if (game?.player?.custom) return 'player';
    return game?.player?.baseTemplateId || game?.player?.id || 'people';
  }

  function normalizePartyKey(raw) {
    const k = String(raw || '').toLowerCase();
    if (k === 'd' || k === 'dem' || k === 'democratic' || k === 'people') return 'people';
    if (k === 'r' || k === 'rep' || k === 'republican' || k === 'heritage') return 'heritage';
    if (k === 'i' || k === 'ind' || k === 'independent') return 'independent';
    if (k === 'l' || k === 'lib' || k === 'liberty' || k === 'libertarian') return 'liberty';
    if (k === 'g' || k === 'green') return 'green';
    if (k === 'c' || k === 'con' || k === 'constitution') return 'constitution';
    if (k === 's' || k === 'soc' || k === 'socialist') return 'socialist';
    if (k === 'vacant' || k === 'open') return 'vacant';
    return k || 'people';
  }

  function getSeatQualityModifier(quality) {
    const q = clamp(Math.round(Number(quality || 5)), 1, 10);
    // Maps Q1..Q10 to -10..+10 persuasion modifier (Q5 -> 0, Q10 -> +10, Q1 -> -8/-10)
    if (q <= 5) return round1((q - 5) * 2.25); // Q1 -> -9, Q2 -> -6.8, Q5 -> 0
    return round1((q - 5) * 2.0); // Q6 -> +2, Q7 -> +4, Q8 -> +6, Q10 -> +10
  }

  function getQualityBadgeClass(quality) {
    const q = Number(quality || 5);
    if (q >= 9) return 'q-elite';
    if (q >= 7) return 'q-strong';
    if (q >= 4) return 'q-avg';
    return 'q-weak';
  }

  function formatMarginLabel(demShare, repShare, thirdShare) {
    if (thirdShare >= 22 && thirdShare >= Math.max(demShare, repShare) - 4) {
      return `3P ${round1(thirdShare)}%`;
    }
    const diff = round1(demShare - repShare);
    if (Math.abs(diff) < 0.5) return 'EVEN';
    return diff > 0 ? `D+${diff}` : `R+${Math.abs(diff)}`;
  }

  function getElectoralSystemLabel(game, stateId) {
    const raw = String(game?.stateElectoralSystems?.[stateId] || 'fptp').toLowerCase();
    if (raw === 'rcv' || raw === 'ranked_choice') return { code: 'RCV', cls: 'system-rcv' };
    if (raw === 'approval' || raw === 'approval_voting') return { code: 'Approval', cls: 'system-approval' };
    if (raw === 'open_list_proportional' || raw === 'proportional') return { code: 'Proportional', cls: 'system-pr' };
    return { code: 'FPTP', cls: '' };
  }

  function getFactionPocket(game, stateId, seedKey) {
    const pockets = [
      'Suburban Moderates', 'Labor Stronghold', 'Urban Core',
      'Rural Heartland', 'Sun Belt Independents', 'Tech Corridor',
      'Faith & Community', 'University & Youth'
    ];
    const h = hashNum(`${stateId}:${seedKey}`);
    return pockets[h % pockets.length];
  }

  function getStateDistrictCount(game, stateId) {
    if (Array.isArray(game?.representatives) && game.representatives.length > 0) {
      const count = game.representatives.filter((r) => r && r.stateId === stateId).length;
      if (count > 0) return count;
    }
    const dataStates = (typeof window !== 'undefined' && window.PartyChairData?.STATES) || [];
    const found = dataStates.find((s) => s.id === stateId);
    if (found?.districtCount) return Number(found.districtCount);
    return DEFAULT_HOUSE_COUNTS[stateId] || 1;
  }

  function getStateHouseTotal(game, stateId) {
    const fromGame = game?.stateHouseSeatCounts?.[stateId]?.total;
    if (Number.isFinite(Number(fromGame)) && Number(fromGame) > 0) return Number(fromGame);
    const dataHouse = typeof window !== 'undefined' ? window.PartyChairData?.VERSION_05_STATE_HOUSE_SEATS?.states?.[stateId]?.total : null;
    if (Number.isFinite(Number(dataHouse)) && Number(dataHouse) > 0) return Number(dataHouse);
    return 100;
  }

  function isCandidateScouted(game, candId) {
    if (!candId) return false;
    const list = game?.scoutedCandidates || game?.watchedCandidates || [];
    if (Array.isArray(list)) return list.includes(candId);
    if (list && typeof list === 'object') return Boolean(list[candId]);
    return false;
  }

  function buildCandidateRecord({ id, name, party, quality, poll, isIncumbent, age, termsServed, careerMilestones }) {
    const q = clamp(Math.round(Number(quality || 5)), 1, 10);
    return {
      id,
      name,
      party: normalizePartyKey(party),
      quality: q,
      qualityDelta: getSeatQualityModifier(q),
      poll: round1(Number(poll || 0)),
      isIncumbent: Boolean(isIncumbent),
      age: Number(age || 48),
      termsServed: Number(termsServed || 0),
      careerMilestones: Array.isArray(careerMilestones) && careerMilestones.length > 0
        ? careerMilestones
        : [{ year: 2026, office: 'local', description: 'Entered public service' }]
    };
  }

  function generateProceduralName(seedStr, partyKey) {
    const firsts = ['Elena', 'Marcus', 'Claire', 'David', 'Hannah', 'Victor', 'Rachel', 'Samuel', 'Nadia', 'Grant', 'Sofia', 'Caleb'];
    const lasts = ['Vance', 'Mercer', 'Castillo', 'Whitman', 'Kowalski', 'Patel', 'Gallagher', 'Bennett', 'Morales', 'Holloway', 'Chen', 'Brooks'];
    const h = hashNum(`${seedStr}:${partyKey}`);
    return `${firsts[h % firsts.length]} ${lasts[(h >> 5) % lasts.length]}`;
  }

  function buildCandidatesForSeat(game, seatId, stateId, office, incumbentParty, demShare, repShare, thirdShare, isOpen) {
    // Check game.candidates or game.sittingMembers for real records matching seatId/stateId
    const realMembers = (game?.sittingMembers || []).filter((m) =>
      m && m.stateId === stateId && (m.office === office || m.districtId === seatId)
    );
    const demInc = realMembers.find((m) => normalizePartyKey(m.party) === 'people');
    const repInc = realMembers.find((m) => normalizePartyKey(m.party) === 'heritage');

    const h = hashNum(seatId);
    const demQ = demInc?.quality ?? (4 + (h % 6)); // 4..9
    const repQ = repInc?.quality ?? (4 + ((h >> 3) % 6));
    const thirdQ = 4 + ((h >> 6) % 5);

    const candidates = [
      buildCandidateRecord({
        id: demInc?.id || `${seatId}_dem`,
        name: demInc?.name || generateProceduralName(seatId, 'people'),
        party: 'people',
        quality: demQ,
        poll: demShare,
        isIncumbent: !isOpen && incumbentParty === 'people',
        age: demInc?.age || (38 + (h % 28)),
        termsServed: demInc?.termsServed?.[office] ?? (incumbentParty === 'people' ? 2 : 0),
        careerMilestones: demInc?.careerMilestones || [
          { year: 2024, office: 'stateLeg', description: `Served in ${STATE_NAMES[stateId] || stateId} Legislature` },
          { year: 2026, office, description: `Ran as Democratic nominee in ${seatId}` }
        ]
      }),
      buildCandidateRecord({
        id: repInc?.id || `${seatId}_rep`,
        name: repInc?.name || generateProceduralName(seatId, 'heritage'),
        party: 'heritage',
        quality: repQ,
        poll: repShare,
        isIncumbent: !isOpen && incumbentParty === 'heritage',
        age: repInc?.age || (40 + ((h >> 2) % 27)),
        termsServed: repInc?.termsServed?.[office] ?? (incumbentParty === 'heritage' ? 2 : 0),
        careerMilestones: repInc?.careerMilestones || [
          { year: 2022, office: 'local', description: `County Chair & Local Official (${stateId})` },
          { year: 2026, office, description: `Republican nominee in ${seatId}` }
        ]
      })
    ];

    if (thirdShare >= 4) {
      const thirdPartyKey = (h % 3 === 0) ? 'green' : ((h % 3 === 1) ? 'liberty' : 'independent');
      candidates.push(
        buildCandidateRecord({
          id: `${seatId}_${thirdPartyKey}`,
          name: generateProceduralName(seatId, thirdPartyKey),
          party: thirdPartyKey,
          quality: thirdQ,
          poll: thirdShare,
          isIncumbent: !isOpen && incumbentParty === thirdPartyKey,
          age: 35 + ((h >> 4) % 25),
          termsServed: 0,
          careerMilestones: [
            { year: 2026, office, description: `${PARTY_LABELS[thirdPartyKey]} standard-bearer in ${seatId}` }
          ]
        })
      );
    }

    candidates.sort((a, b) => b.poll - a.poll);
    return candidates;
  }

  // --------------------------------------------------------------------------
  // Seat Builders per Race Type (Normalizes real game data + deterministic fills)
  // --------------------------------------------------------------------------
  function getStateBaseLean(game, stateId) {
    const aff = game?.voterModel?.states?.[stateId]?.affiliations;
    if (aff) {
      const d = Number(aff.people || 0);
      const r = Number(aff.heritage || 0);
      const t = Number(aff.thirdParty || aff.independent || 0);
      const sum = Math.max(1, d + r + t);
      return {
        dem: round1((d / sum) * 100),
        rep: round1((r / sum) * 100),
        third: round1((t / sum) * 100)
      };
    }
    const h = hashNum(`lean:${stateId}`);
    const swing = ((h % 41) - 20); // -20..+20
    const dem = clamp(47 + swing, 22, 76);
    const rep = clamp(47 - swing, 20, 74);
    const third = round1(Math.max(2, 100 - dem - rep));
    return { dem, rep, third };
  }

  function buildSeatsForRaceAndState(game, raceType, stateId) {
    const activeSenateClass = Number(game?.activeSenateClass || 3);

    if (raceType === 'president') {
      const jurs = stateId === 'NATIONAL' ? ['NATIONAL', ...FIFTY_STATES, 'DC'] : [stateId];
      return jurs.map((sid) => {
        const base = sid === 'NATIONAL' ? { dem: 48.5, rep: 47.0, third: 4.5 } : getStateBaseLean(game, sid);
        const seatId = sid === 'NATIONAL' ? 'US-PRES' : `${sid}-PRES`;
        const inc = base.dem >= base.rep ? 'people' : 'heritage';
        const candidates = buildCandidatesForSeat(game, seatId, sid === 'NATIONAL' ? 'GA' : sid, 'president', inc, base.dem, base.rep, base.third, false);
        return {
          seatId,
          stateId: sid,
          label: sid === 'NATIONAL' ? 'US-PRES · National Electoral College (538 EV)' : `${sid}-PRES · ${STATE_NAMES[sid] || sid}`,
          office: 'president',
          incumbentParty: inc,
          demShare: base.dem,
          repShare: base.rep,
          thirdShare: base.third,
          leanMargin: round1(base.dem - base.rep),
          leanLabel: formatMarginLabel(base.dem, base.rep, base.third),
          isOpen: false,
          upThisCycle: true,
          holdoverNote: null,
          factionPocket: getFactionPocket(game, sid, seatId),
          candidates
        };
      });
    }

    if (raceType === 'senate') {
      const h = hashNum(`sen:${stateId}`);
      const c1 = 1 + (h % 2); // Class I or II
      const classes = [c1, 3];
      return classes.map((cls) => {
        const seatId = `${stateId}-SEN-C${cls}`;
        const base = getStateBaseLean(game, stateId);
        const jitter = ((hashNum(seatId) % 7) - 3) * 0.8;
        const dem = clamp(round1(base.dem + jitter), 18, 82);
        const rep = clamp(round1(base.rep - jitter), 16, 80);
        const third = round1(Math.max(2, 100 - dem - rep));
        const inc = dem >= rep ? 'people' : 'heritage';
        const upThisCycle = cls === activeSenateClass;
        const isOpen = (hashNum(seatId) % 9) === 0;
        const candidates = buildCandidatesForSeat(game, seatId, stateId, 'senate', inc, dem, rep, third, isOpen);
        return {
          seatId,
          stateId,
          label: `${seatId} · Class ${cls === 1 ? 'I' : (cls === 2 ? 'II' : 'III')}`,
          office: 'senate',
          incumbentParty: isOpen ? 'vacant' : inc,
          demShare: dem,
          repShare: rep,
          thirdShare: third,
          leanMargin: round1(dem - rep),
          leanLabel: formatMarginLabel(dem, rep, third),
          isOpen,
          upThisCycle,
          holdoverNote: upThisCycle ? 'Up This Cycle' : 'Holdover — Up Next Cycle',
          factionPocket: getFactionPocket(game, stateId, seatId),
          candidates
        };
      });
    }

    if (raceType === 'governor') {
      const seatId = `${stateId}-GOV`;
      const base = getStateBaseLean(game, stateId);
      const rawGov = game?.governorships?.[stateId];
      const inc = rawGov ? normalizePartyKey(rawGov) : (base.dem >= base.rep ? 'people' : 'heritage');
      const isOpen = (hashNum(seatId) % 5) === 0;
      const candidates = buildCandidatesForSeat(game, seatId, stateId, 'governor', inc, base.dem, base.rep, base.third, isOpen);
      return [{
        seatId,
        stateId,
        label: `${seatId} · Governor of ${STATE_NAMES[stateId] || stateId}`,
        office: 'governor',
        incumbentParty: isOpen ? 'vacant' : inc,
        demShare: base.dem,
        repShare: base.rep,
        thirdShare: base.third,
        leanMargin: round1(base.dem - base.rep),
        leanLabel: formatMarginLabel(base.dem, base.rep, base.third),
        isOpen,
        upThisCycle: true,
        holdoverNote: null,
        factionPocket: getFactionPocket(game, stateId, seatId),
        candidates
      }];
    }

    if (raceType === 'house') {
      const realReps = (game?.representatives || []).filter((r) => r && r.stateId === stateId);
      const count = realReps.length > 0 ? realReps.length : getStateDistrictCount(game, stateId);
      const base = getStateBaseLean(game, stateId);
      const seats = [];
      for (let i = 1; i <= count; i++) {
        const repObj = realReps[i - 1] || null;
        const num = String(repObj?.districtNumber || i).padStart(2, '0');
        const seatId = `${stateId}-${num}`;
        const spread = count > 1 ? ((i - (count + 1) / 2) / Math.max(1, count / 2)) * 18 : 0;
        const h = hashNum(seatId);
        const dem = clamp(round1(base.dem - spread + ((h % 7) - 3)), 14, 86);
        const rep = clamp(round1(base.rep + spread - ((h % 7) - 3)), 12, 84);
        const third = round1(Math.max(2, 100 - dem - rep));
        const inc = repObj?.party ? normalizePartyKey(repObj.party) : (dem >= rep ? 'people' : 'heritage');
        const isOpen = Boolean(repObj?.isOpen) || ((h % 11) === 0);
        const candidates = buildCandidatesForSeat(game, seatId, stateId, 'house', inc, dem, rep, third, isOpen);
        seats.push({
          seatId,
          stateId,
          label: `${seatId} · Congressional District ${num}`,
          office: 'house',
          incumbentParty: isOpen ? 'vacant' : inc,
          demShare: dem,
          repShare: rep,
          thirdShare: third,
          leanMargin: round1(dem - rep),
          leanLabel: formatMarginLabel(dem, rep, third),
          isOpen,
          upThisCycle: true,
          holdoverNote: null,
          factionPocket: getFactionPocket(game, stateId, seatId),
          candidates
        });
      }
      return seats;
    }

    // State Senate or State House
    const isStateHouse = raceType === 'state_house';
    const prefix = isStateHouse ? 'HD' : 'SD';
    const total = isStateHouse ? getStateHouseTotal(game, stateId) : (STATE_SENATE_SIZES[stateId] || 40);
    const base = getStateBaseLean(game, stateId);
    const seats = [];

    for (let i = 1; i <= total; i++) {
      const num = String(i).padStart(3, '0');
      const seatId = `${stateId}-${prefix}-${num}`;
      const h = hashNum(seatId);
      const spread = ((i - (total + 1) / 2) / Math.max(1, total / 2)) * 22;
      const noise = ((h % 9) - 4) * 1.1;
      const dem = clamp(round1(base.dem - spread + noise), 12, 88);
      const rep = clamp(round1(base.rep + spread - noise), 10, 86);
      const third = round1(Math.max(2, 100 - dem - rep));
      const inc = dem >= rep ? 'people' : 'heritage';
      const isOpen = (h % 12) === 0;
      const upThisCycle = isStateHouse ? true : (i % 2 === 1);
      const candidates = buildCandidatesForSeat(game, seatId, stateId, raceType, inc, dem, rep, third, isOpen);
      seats.push({
        seatId,
        stateId,
        label: `${seatId} · ${isStateHouse ? 'House' : 'Senate'} District ${num}`,
        office: raceType,
        incumbentParty: isOpen ? 'vacant' : inc,
        demShare: dem,
        repShare: rep,
        thirdShare: third,
        leanMargin: round1(dem - rep),
        leanLabel: formatMarginLabel(dem, rep, third),
        isOpen,
        upThisCycle,
        holdoverNote: upThisCycle ? 'Up This Cycle' : 'Holdover — Up Next Cycle',
        factionPocket: getFactionPocket(game, stateId, seatId),
        candidates
      });
    }
    return seats;
  }

  function seatMatchesFilter(seat, filterId) {
    if (!filterId || filterId === 'all') return true;
    if (filterId === 'close') return Math.abs(seat.leanMargin) <= 5.0;
    if (filterId === 'third_party') return seat.thirdShare >= 12.0 || seat.candidates.some((c) => !['people', 'heritage'].includes(c.party) && c.poll >= 10);
    if (filterId === 'q7_plus') return seat.candidates.some((c) => c.quality >= 7);
    if (filterId === 'open') return Boolean(seat.isOpen);
    if (filterId === 'up_this_cycle') return Boolean(seat.upThisCycle);
    return true;
  }

  function computeChamberBalance(game, raceType, stateId, seats) {
    if (raceType === 'president') {
      const total = 538;
      const dem = Number(game?.lastElection?.presidential?.peopleEV ?? 270);
      const rep = Number(game?.lastElection?.presidential?.heritageEV ?? 268);
      return { title: 'Presidential Electoral College', total, majority: 270, dem, rep, other: Math.max(0, total - dem - rep), vacant: 0, netFlip: 0 };
    }
    if (raceType === 'house') {
      const reps = Array.isArray(game?.representatives) ? game.representatives : [];
      if (reps.length >= 400) {
        const dem = reps.filter((r) => normalizePartyKey(r.party) === 'people').length;
        const rep = reps.filter((r) => normalizePartyKey(r.party) === 'heritage').length;
        const other = reps.length - dem - rep;
        return { title: 'U.S. House of Representatives', total: reps.length, majority: 218, dem, rep, other, vacant: 0, netFlip: 0 };
      }
      const dem = seats.filter((s) => s.incumbentParty === 'people').length;
      const rep = seats.filter((s) => s.incumbentParty === 'heritage').length;
      const vacant = seats.filter((s) => s.incumbentParty === 'vacant').length;
      return { title: `${STATE_NAMES[stateId] || stateId} U.S. House Delegation`, total: seats.length, majority: Math.floor(seats.length / 2) + 1, dem, rep, other: Math.max(0, seats.length - dem - rep - vacant), vacant, netFlip: 0 };
    }
    const dem = seats.filter((s) => s.incumbentParty === 'people').length;
    const rep = seats.filter((s) => s.incumbentParty === 'heritage').length;
    const vacant = seats.filter((s) => s.incumbentParty === 'vacant').length;
    const other = Math.max(0, seats.length - dem - rep - vacant);
    const projectedDem = seats.filter((s) => s.demShare > s.repShare).length;
    const netFlip = projectedDem - dem;
    const labelMap = {
      senate: `${STATE_NAMES[stateId] || stateId} U.S. Senate Seats`,
      governor: `${STATE_NAMES[stateId] || stateId} Governorship`,
      state_senate: `${STATE_NAMES[stateId] || stateId} State Senate`,
      state_house: `${STATE_NAMES[stateId] || stateId} State House`
    };
    return {
      title: labelMap[raceType] || 'Chamber Balance',
      total: Math.max(1, seats.length),
      majority: Math.floor(Math.max(1, seats.length) / 2) + 1,
      dem,
      rep,
      other,
      vacant,
      netFlip
    };
  }

  function normalizeRaceExplorerState(game, uiState = {}) {
    const raceType = RACE_TYPES.some((r) => r.id === uiState.raceType) ? uiState.raceType : 'house';
    let stateId = uiState.stateId;
    if (raceType === 'president') {
      if (!stateId || (!STATE_NAMES[stateId])) stateId = 'NATIONAL';
    } else if (!stateId || stateId === 'NATIONAL' || !STATE_NAMES[stateId]) {
      stateId = 'PA';
    }
    const filter = FILTER_CHIPS.some((f) => f.id === uiState.filter) ? uiState.filter : 'all';
    const allSeats = buildSeatsForRaceAndState(game, raceType, stateId);
    const filteredSeats = allSeats.filter((s) => seatMatchesFilter(s, filter));
    const activePool = filteredSeats.length > 0 ? filteredSeats : allSeats;
    let seatId = uiState.seatId;
    if (!activePool.some((s) => s.seatId === seatId)) {
      seatId = activePool[0]?.seatId || '';
    }
    return { raceType, stateId, seatId, filter, allSeats, filteredSeats };
  }

  // --------------------------------------------------------------------------
  // Main Renderer
  // --------------------------------------------------------------------------
  function renderRaceExplorerMarkup(game, uiState = {}, safe) {
    const esc = typeof safe === 'function' ? safe : defaultSafe;
    const state = normalizeRaceExplorerState(game, uiState);
    const { raceType, stateId, seatId, filter, allSeats, filteredSeats } = state;
    const selectedSeat = allSeats.find((s) => s.seatId === seatId) || allSeats[0];
    const playerParty = resolvePlayerParty(game);

    // 6. Chamber Balance & Flip-Counter Banner
    const bal = computeChamberBalance(game, raceType, stateId, allSeats);
    const demPct = (bal.dem / bal.total) * 100;
    const otherPct = (bal.other / bal.total) * 100;
    const vacPct = (bal.vacant / bal.total) * 100;
    const repPct = (bal.rep / bal.total) * 100;
    const flipCls = bal.netFlip > 0 ? 'dem' : (bal.netFlip < 0 ? 'rep' : '');
    const flipText = bal.netFlip > 0 ? `Proj. Flip: D +${bal.netFlip}` : (bal.netFlip < 0 ? `Proj. Flip: R +${Math.abs(bal.netFlip)}` : 'Proj. Flip: Even');

    // 1. Spectrum strip sorted safest Dem -> safest Rep
    const spectrumSeats = [...allSeats].sort((a, b) => b.leanMargin - a.leanMargin);
    const tippingIdx = Math.floor(spectrumSeats.length / 2);
    const tippingSeat = spectrumSeats[tippingIdx];

    // State options
    const stateChoices = raceType === 'president' ? ['NATIONAL', ...FIFTY_STATES, 'DC'] : FIFTY_STATES;
    const stateOptionsHtml = stateChoices.map((sid) => {
      const name = STATE_NAMES[sid] || sid;
      let summary = '';
      if (sid !== 'NATIONAL') {
        if (raceType === 'house') summary = ` (${getStateDistrictCount(game, sid)} seats)`;
        else if (raceType === 'state_house') summary = ` (${getStateHouseTotal(game, sid)} HD)`;
        else if (raceType === 'state_senate') summary = ` (${STATE_SENATE_SIZES[sid] || 40} SD)`;
      }
      return `<option value="${esc(sid)}" ${sid === stateId ? 'selected' : ''}>${esc(sid === 'NATIONAL' ? name : `${sid} · ${name}${summary}`)}</option>`;
    }).join('');

    // Seat options
    const seatPool = filteredSeats.length > 0 ? filteredSeats : allSeats;
    const seatOptionsHtml = seatPool.map((s) => {
      const hasStar = s.candidates.some((c) => c.quality >= 7);
      const dot = s.incumbentParty === 'people' ? '🔵' : (s.incumbentParty === 'heritage' ? '🔴' : (s.incumbentParty === 'vacant' ? '⚪' : '🟡'));
      return `<option value="${esc(s.seatId)}" ${s.seatId === seatId ? 'selected' : ''}>${dot} ${esc(s.label)} · ${esc(s.leanLabel)}${hasStar ? ' ★Q7+' : ''}</option>`;
    }).join('');

    // Filter chips
    const filterChipsHtml = FILTER_CHIPS.map((chip) => {
      const count = allSeats.filter((s) => seatMatchesFilter(s, chip.id)).length;
      return `<button type="button" class="re-filter-chip ${filter === chip.id ? 'active' : ''}" data-re-filter="${esc(chip.id)}">${esc(chip.label)} <span>${count}</span></button>`;
    }).join('');

    // Quality Swing Bar (Diff #3)
    const demCand = selectedSeat?.candidates.find((c) => c.party === 'people');
    const repCand = selectedSeat?.candidates.find((c) => c.party === 'heritage');
    const qEdge = round1((demCand?.qualityDelta || 0) - (repCand?.qualityDelta || 0));
    const qEdgeLabel = Math.abs(qEdge) < 0.1 ? 'Quality Edge: Even (0.0 pts)' : (qEdge > 0 ? `Quality Edge: D +${qEdge} pts` : `Quality Edge: R +${Math.abs(qEdge)} pts`);
    const qWidthPct = Math.min(50, Math.abs(qEdge) * 2.5);
    const qLeftPct = qEdge >= 0 ? (50 - qWidthPct) : 50;
    const qColor = qEdge >= 0 ? '#3478c8' : '#c9474e';

    // Context pills (Diff #5)
    const sysInfo = getElectoralSystemLabel(game, selectedSeat?.stateId === 'NATIONAL' ? 'PA' : selectedSeat?.stateId);

    // Candidate cards (Diff #3 + #4)
    const candidatesHtml = (selectedSeat?.candidates || []).map((cand, idx) => {
      const modStr = cand.qualityDelta >= 0 ? `+${cand.qualityDelta}` : `${cand.qualityDelta}`;
      const qCls = getQualityBadgeClass(cand.quality);
      const isPlayerParty = cand.party === playerParty || (playerParty === 'player' && cand.party === 'people');
      const isScouted = isCandidateScouted(game, cand.id);
      const showScout = isPlayerParty || cand.quality >= 7;
      const milestonesHtml = cand.careerMilestones.map((m) =>
        `<div class="re-milestone-item"><b>${esc(m.year)}</b> · ${esc(m.description)}</div>`
      ).join('');

      return `
        <div class="re-candidate-row ${idx === 0 ? 'leading' : ''}">
          <div class="re-candidate-main">
            <div class="re-cand-id">
              <span class="re-party-dot" style="background:${PARTY_COLORS[cand.party] || '#94a4b3'}"></span>
              <div>
                <div class="re-cand-name">${esc(cand.name)} ${cand.isIncumbent ? '<span style="color:var(--gold);font-size:11px;">(Incumbent)</span>' : ''}</div>
                <div class="re-cand-meta">${esc(PARTY_LABELS[cand.party] || cand.party)} · Age ${esc(cand.age)} · ${esc(cand.termsServed)} term(s)</div>
              </div>
            </div>
            <div class="re-cand-metrics">
              <span class="re-q-badge ${qCls}">Q${esc(cand.quality)} (${esc(modStr)})</span>
              <span class="re-poll-pct">${esc(cand.poll)}%</span>
              ${showScout ? `<button type="button" class="re-scout-btn ${isScouted ? 'scouted' : ''}" data-re-scout="${esc(cand.id)}">${isScouted ? '★ Watching' : 'Scout'}</button>` : ''}
            </div>
          </div>
          <details class="re-career-ladder">
            <summary>Career Ladder &amp; Milestones (${cand.careerMilestones.length})</summary>
            <div class="re-career-body">${milestonesHtml}</div>
          </details>
        </div>`;
    }).join('');

    return `
      <div class="re-shell" data-race-explorer>
        <!-- 6. Persistent Chamber Balance & Flip-Counter Banner -->
        <div class="re-chamber-banner">
          <div class="re-chamber-banner-top">
            <div class="re-chamber-title">
              <span>${esc(bal.title)}</span>
              <span class="re-majority-tag">${esc(bal.majority)} to win</span>
            </div>
            <div class="re-chamber-counts">
              <span class="re-count-pill"><i style="background:#3478c8"></i> D ${esc(bal.dem)}</span>
              <span class="re-count-pill"><i style="background:#c9474e"></i> R ${esc(bal.rep)}</span>
              ${bal.other > 0 ? `<span class="re-count-pill"><i style="background:#c3924d"></i> 3P/I ${esc(bal.other)}</span>` : ''}
              ${bal.vacant > 0 ? `<span class="re-count-pill"><i style="background:#59616c"></i> Open ${esc(bal.vacant)}</span>` : ''}
              <span class="re-flip-badge ${flipCls}">${esc(flipText)}</span>
            </div>
          </div>
          <div class="re-balance-bar">
            <div class="re-balance-seg dem" style="width:${demPct}%"></div>
            <div class="re-balance-seg other" style="width:${otherPct}%"></div>
            <div class="re-balance-seg vacant" style="width:${vacPct}%"></div>
            <div class="re-balance-seg rep" style="width:${repPct}%"></div>
            <div class="re-majority-marker" title="Majority Threshold (${esc(bal.majority)})"></div>
          </div>
        </div>

        <!-- Three-Tier Selector Bar -->
        <div class="re-selector-bar">
          <div class="re-race-tabs" role="tablist" aria-label="Race Type">
            ${RACE_TYPES.map((rt) => `<button type="button" class="re-race-tab ${raceType === rt.id ? 'active' : ''}" data-re-race-type="${esc(rt.id)}">${esc(rt.label)}</button>`).join('')}
          </div>
          <div class="re-dropdown-row">
            <div class="re-select-group">
              <label for="re-race-select">Race Type</label>
              <select id="re-race-select" data-re-select="raceType">
                ${RACE_TYPES.map((rt) => `<option value="${esc(rt.id)}" ${raceType === rt.id ? 'selected' : ''}>${esc(rt.label)}</option>`).join('')}
              </select>
            </div>
            <div class="re-select-group">
              <label for="re-state-select">State / Jurisdiction</label>
              <select id="re-state-select" data-re-select="stateId">${stateOptionsHtml}</select>
            </div>
            <div class="re-select-group">
              <label for="re-seat-select">Seat / District (${seatPool.length}/${allSeats.length})</label>
              <select id="re-seat-select" data-re-select="seatId">${seatOptionsHtml}</select>
            </div>
          </div>

          <!-- 2. Smart Quick-Filter Chips -->
          <div class="re-filter-row">
            <span class="re-filter-label">Quick Filter:</span>
            ${filterChipsHtml}
          </div>
        </div>

        <!-- 1. Interactive Chamber Lean & Tipping-Point Spectrum Strip -->
        <div class="re-spectrum-panel">
          <div class="re-spectrum-head">
            <span>Chamber Lean Spectrum (${spectrumSeats.length} seats)</span>
            <span>Median Tipping Point: <b>${esc(tippingSeat?.seatId || 'N/A')} (${esc(tippingSeat?.leanLabel || '')})</b></span>
          </div>
          <div class="re-spectrum-strip">
            ${spectrumSeats.map((s, idx) => {
              const pCls = s.incumbentParty === 'people' ? 'dem' : (s.incumbentParty === 'heritage' ? 'rep' : (s.incumbentParty === 'independent' ? 'ind' : 'other'));
              const isTip = idx === tippingIdx ? 'tipping' : '';
              const isSel = s.seatId === seatId ? 'selected' : '';
              return `<button type="button" class="re-spectrum-tick ${pCls} ${isTip} ${isSel}" data-re-seat-pick="${esc(s.seatId)}" data-re-state-pick="${esc(s.stateId)}" title="${esc(s.seatId)} (${esc(s.leanLabel)})"></button>`;
            }).join('')}
          </div>
          <div class="re-spectrum-legend">
            <span>◀ Safest Dem</span>
            <span>◆ Gold Outline = Tipping Point · White = Selected</span>
            <span>Safest Rep ▶</span>
          </div>
        </div>

        <!-- Selected Seat Inspector -->
        ${selectedSeat ? `
        <section class="re-inspector-card">
          <div class="re-inspector-head">
            <div class="re-inspector-title">
              <h3>${esc(selectedSeat.label)}</h3>
              <div class="re-inspector-sub">
                Incumbent: <b>${esc(PARTY_LABELS[selectedSeat.incumbentParty] || 'Open')}</b> · Projected Lean: <b>${esc(selectedSeat.leanLabel)}</b>
              </div>
            </div>
            <!-- 5. Electoral-System, Holdover & Faction-Pocket Context Pills -->
            <div class="re-context-pills">
              <span class="re-pill ${sysInfo.cls}">System: ${esc(sysInfo.code)}</span>
              ${selectedSeat.holdoverNote ? `<span class="re-pill ${selectedSeat.upThisCycle ? 'up-cycle' : 'holdover'}">${esc(selectedSeat.holdoverNote)}</span>` : ''}
              <span class="re-pill pocket">Pocket: ${esc(selectedSeat.factionPocket)}</span>
            </div>
          </div>

          <!-- 3. Head-to-Head Quality Swing Bar -->
          <div class="re-quality-swing-box">
            <div class="re-quality-swing-head">
              <span>Candidate Quality Persuasion Delta</span>
              <b>${esc(qEdgeLabel)}</b>
            </div>
            <div class="re-quality-swing-track">
              <div class="re-quality-swing-center"></div>
              <div class="re-quality-swing-fill" style="left:${qLeftPct}%;width:${qWidthPct}%;background:${qColor}"></div>
            </div>
          </div>

          <div class="re-candidate-list">${candidatesHtml}</div>
        </section>` : ''}
      </div>`;
  }

  // --------------------------------------------------------------------------
  // Event Binding
  // --------------------------------------------------------------------------
  function bindRaceExplorerEvents(container, game, uiState = {}, callbacks = {}) {
    if (!container || typeof container.addEventListener !== 'function') return;
    if (container.__reBound) return;
    container.__reBound = true;

    const getCurrent = () => normalizeRaceExplorerState(game, uiState);

    container.addEventListener('change', (e) => {
      const sel = e.target?.closest?.('[data-re-select]');
      if (!sel) return;
      const key = sel.getAttribute('data-re-select');
      const cur = getCurrent();
      const next = {
        raceType: cur.raceType,
        stateId: cur.stateId,
        seatId: cur.seatId,
        filter: cur.filter,
        [key]: sel.value
      };
      if (key === 'raceType') {
        next.stateId = next.raceType === 'president' ? 'NATIONAL' : (cur.stateId === 'NATIONAL' ? 'PA' : cur.stateId);
        next.seatId = '';
      } else if (key === 'stateId') {
        next.seatId = '';
      }
      const normalized = normalizeRaceExplorerState(game, next);
      Object.assign(uiState, {
        raceType: normalized.raceType,
        stateId: normalized.stateId,
        seatId: normalized.seatId,
        filter: normalized.filter
      });
      callbacks?.onStateChange?.({ ...uiState });
    });

    container.addEventListener('click', (e) => {
      const tabBtn = e.target?.closest?.('[data-re-race-type]');
      if (tabBtn) {
        const cur = getCurrent();
        const raceType = tabBtn.getAttribute('data-re-race-type');
        const next = normalizeRaceExplorerState(game, {
          ...cur,
          raceType,
          stateId: raceType === 'president' ? 'NATIONAL' : (cur.stateId === 'NATIONAL' ? 'PA' : cur.stateId),
          seatId: ''
        });
        Object.assign(uiState, {
          raceType: next.raceType,
          stateId: next.stateId,
          seatId: next.seatId,
          filter: next.filter
        });
        callbacks?.onStateChange?.({ ...uiState });
        return;
      }

      const filterBtn = e.target?.closest?.('[data-re-filter]');
      if (filterBtn) {
        const cur = getCurrent();
        const next = normalizeRaceExplorerState(game, {
          ...cur,
          filter: filterBtn.getAttribute('data-re-filter')
        });
        Object.assign(uiState, {
          raceType: next.raceType,
          stateId: next.stateId,
          seatId: next.seatId,
          filter: next.filter
        });
        callbacks?.onStateChange?.({ ...uiState });
        return;
      }

      const tickBtn = e.target?.closest?.('[data-re-seat-pick]');
      if (tickBtn) {
        const cur = getCurrent();
        const pickedSeat = tickBtn.getAttribute('data-re-seat-pick');
        const pickedState = tickBtn.getAttribute('data-re-state-pick') || cur.stateId;
        const next = normalizeRaceExplorerState(game, {
          ...cur,
          stateId: pickedState,
          seatId: pickedSeat
        });
        Object.assign(uiState, {
          raceType: next.raceType,
          stateId: next.stateId,
          seatId: next.seatId,
          filter: next.filter
        });
        callbacks?.onStateChange?.({ ...uiState });
        return;
      }

      const scoutBtn = e.target?.closest?.('[data-re-scout]');
      if (scoutBtn) {
        const candId = scoutBtn.getAttribute('data-re-scout');
        const cur = getCurrent();
        const activeSeat = cur.allSeats.find((s) => s.seatId === cur.seatId);
        callbacks?.onToggleScout?.(candId, activeSeat, {
          raceType: cur.raceType,
          stateId: cur.stateId,
          seatId: cur.seatId,
          filter: cur.filter
        });
      }
    });
  }

  return {
    RACE_TYPES,
    FILTER_CHIPS,
    getSeatQualityModifier,
    normalizeRaceExplorerState,
    buildSeatsForRaceAndState,
    computeChamberBalance,
    renderRaceExplorerMarkup,
    bindRaceExplorerEvents
  };
});
