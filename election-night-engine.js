/**
 * Coalition Builder: Party Chair — Version 0.16.1
 * election-night-engine.js — Real-Time Decision Desk Simulation Engine
 *
 * Implements REQ-220, REQ-221, REQ-222, and supports REQ-223.
 * Zero DOM dependencies — fully testable in Node.js headless and browser.
 */

(function (root, factory) {
  const api = factory();
  if (typeof window !== 'undefined') {
    window.ElectionNightEngine = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ElectionNightEngine = api;
  }
  if (root) {
    root.ElectionNightEngine = api;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ============================================================================
  // CONSTANTS & TIMELINE SPECIFICATIONS (REQ-220)
  // ============================================================================

  const START_MINUTE = 1140; // 7:00 PM ET (19 * 60)
  const TIMELINE_END = 540;  // 4:00 AM ET (9 hours = 540 simulated minutes)

  // 51-Jurisdiction Poll-Closing Schedule (ET offset in minutes from 7:00 PM ET)
  const POLL_CLOSE_MINUTES = {
    // 7:00 PM ET (t = 0)
    GA: 0, IN: 0, KY: 0, SC: 0, VT: 0, VA: 0,
    // 7:30 PM ET (t = 30)
    NC: 30, OH: 30, WV: 30,
    // 8:00 PM ET (t = 60)
    AL: 60, CT: 60, DC: 60, DE: 60, FL: 60, IL: 60, KS: 60, ME: 60,
    MD: 60, MA: 60, MI: 60, MS: 60, MO: 60, NH: 60, NJ: 60, OK: 60,
    PA: 60, RI: 60, TN: 60, TX: 60,
    // 8:30 PM ET (t = 90)
    AR: 90,
    // 9:00 PM ET (t = 120)
    AZ: 120, CO: 120, IA: 120, LA: 120, MN: 120, NE: 120, NM: 120,
    NY: 120, ND: 120, SD: 120, WI: 120, WY: 120,
    // 10:00 PM ET (t = 180)
    MT: 180, NV: 180, UT: 180,
    // 11:00 PM ET (t = 240)
    CA: 240, ID: 240, OR: 240, WA: 240,
    // 12:00 AM ET (t = 300)
    HI: 300,
    // 1:00 AM ET (t = 360)
    AK: 360,
  };

  // State Electoral Votes for state-scaled reporting durations
  const STATE_EV_WEIGHTS = {
    CA: 54, TX: 40, FL: 30, NY: 28, PA: 19, IL: 19, OH: 17, GA: 16, NC: 16,
    MI: 15, NJ: 14, VA: 13, WA: 12, AZ: 11, MA: 11, TN: 11, IN: 11, MO: 10,
    MD: 10, WI: 10, CO: 10, MN: 10, SC: 9, AL: 9, LA: 8, KY: 8, OR: 8,
    OK: 7, CT: 7, UT: 6, IA: 6, NV: 6, AR: 6, KS: 6, MS: 6, NM: 5, NE: 5,
    ID: 4, WV: 4, HI: 4, NH: 4, ME: 4, MT: 4, RI: 4, DE: 3, SD: 3, ND: 3,
    AK: 3, VT: 3, WY: 3, DC: 3,
  };

  // 13-Tier Decision Desk Race Calling Matrix (REQ-222)
  const CALL_TIERS = [
    { tier: 1,  minMargin: 15.0, minPct: 0,   requireLeader: false },
    { tier: 2,  minMargin: 14.0, minPct: 4,   requireLeader: false },
    { tier: 3,  minMargin: 13.0, minPct: 11,  requireLeader: true },
    { tier: 4,  minMargin: 12.0, minPct: 18,  requireLeader: true },
    { tier: 5,  minMargin: 11.0, minPct: 28,  requireLeader: true },
    { tier: 6,  minMargin: 10.0, minPct: 41,  requireLeader: true },
    { tier: 7,  minMargin: 9.0,  minPct: 59,  requireLeader: true },
    { tier: 8,  minMargin: 8.0,  minPct: 68,  requireLeader: true },
    { tier: 9,  minMargin: 7.0,  minPct: 75,  requireLeader: true },
    { tier: 10, minMargin: 6.0,  minPct: 84,  requireLeader: true },
    { tier: 11, minMargin: 5.0,  minPct: 91,  requireLeader: true },
    { tier: 12, minMargin: 3.0,  minPct: 95,  requireLeader: true },
    { tier: 13, minMargin: 0.0,  minPct: 100, requireLeader: false },
  ];

  // ============================================================================
  // HASHING & SEEDING UTILITIES (REQ-221)
  // ============================================================================

  function fnv1a32(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function fnv1aUnit(key) {
    return fnv1a32(String(key)) / 4294967296;
  }

  function formatSimTime(elapsedMinutes) {
    const totalMin = START_MINUTE + Math.max(0, Math.min(TIMELINE_END, elapsedMinutes));
    const totalHour = Math.floor(totalMin / 60);
    const mins = Math.floor(totalMin % 60);
    const hr = totalHour % 12 === 0 ? 12 : totalHour % 12;
    const mm = String(mins).padStart(2, '0');
    const ampm = (totalHour % 24) >= 12 && (totalHour % 24) < 24 ? 'PM' : 'AM';
    return `${hr}:${mm} ${ampm} ET`;
  }

  function getStateReportingDuration(stateId) {
    const ev = STATE_EV_WEIGHTS[stateId] || 4;
    // Scale duration between 120 min (tiny 3-EV states) and 360 min (mega 54-EV states)
    const ratio = Math.max(0, Math.min(1, (ev - 3) / (54 - 3)));
    const duration = Math.round(120 + ratio * 240);
    const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
    // Cap so close + duration <= TIMELINE_END (540)
    return Math.min(duration, Math.max(90, TIMELINE_END - close));
  }

  // ============================================================================
  // BALLOT-DROP SIMULATOR & EXACT INTEGER TARGET POOL (REQ-221)
  // ============================================================================

  /**
   * Largest-Remainder Method: Allocates exact integer vote targets summing to cast.
   */
  function allocateIntegerVotePool(cast, partyShares) {
    const parties = Object.keys(partyShares);
    const sumShares = parties.reduce((sum, p) => sum + Math.max(0, Number(partyShares[p]) || 0), 0) || 100;
    const targets = {};
    const remainders = [];
    let allocatedSum = 0;

    parties.forEach((p) => {
      const normalizedShare = (Math.max(0, Number(partyShares[p]) || 0) / sumShares) * 100;
      const exactVotes = (cast * normalizedShare) / 100;
      const intVotes = Math.floor(exactVotes);
      targets[p] = intVotes;
      allocatedSum += intVotes;
      remainders.push({ party: p, frac: exactVotes - intVotes });
    });

    remainders.sort((a, b) => b.frac - a.frac);
    let diff = cast - allocatedSum;
    let rIdx = 0;
    while (diff > 0 && remainders.length > 0) {
      targets[remainders[rIdx % remainders.length].party] += 1;
      diff -= 1;
      rIdx++;
    }

    return targets;
  }

  /**
   * Slices total ballots into log-uniformly distributed batches (100 to 10,000 units).
   */
  function generateDropSizes(cast, seedKey, isHouseDistrict) {
    const sizes = [];
    let left = cast;
    let idx = 0;
    const maxDrop = isHouseDistrict ? 2500 : 10000;
    const minDrop = isHouseDistrict ? 150 : 100;

    while (left > maxDrop) {
      const u = fnv1aUnit(`${seedKey}|size|${idx}`);
      // Log-uniform in [minDrop, maxDrop]
      const raw = Math.round(minDrop * Math.pow(maxDrop / minDrop, u));
      const size = Math.max(minDrop, Math.min(maxDrop, left - minDrop, raw));
      sizes.push(size);
      left -= size;
      idx++;
    }
    if (left > 0) sizes.push(left);
    return sizes;
  }

  /**
   * Builds the sequence of non-linear ballot drops with Box-Muller Gaussian partisan skew.
   * Guarantees 100% exact mathematical convergence to final certified returns.
   */
  function buildRaceDrops(raceDef, seedKey) {
    const { cast, finalShares, closeMinutes, durationMinutes, isHouseDistrict } = raceDef;
    const targetVotes = allocateIntegerVotePool(cast, finalShares);
    const dropSizes = generateDropSizes(cast, seedKey, isHouseDistrict);
    const remaining = { ...targetVotes };
    const parties = Object.keys(targetVotes);

    // Identify top-2 parties for symmetric partisan skew
    const sortedParties = parties.slice().sort((a, b) => (finalShares[b] || 0) - (finalShares[a] || 0));
    const top1 = sortedParties[0];
    const top2 = sortedParties[1];

    const cumVotes = {};
    parties.forEach((p) => { cumVotes[p] = 0; });
    let cumTotal = 0;
    const drops = [];

    for (let i = 0; i < dropSizes.length; i++) {
      const dropSize = dropSizes[i];
      const isFinal = (i === dropSizes.length - 1);
      const allocatedThisDrop = {};

      if (isFinal) {
        // Release remaining pool verbatim -> 100% exact convergence!
        parties.forEach((p) => {
          allocatedThisDrop[p] = remaining[p] || 0;
          remaining[p] = 0;
        });
      } else {
        // Box-Muller standard normal deviate Z
        const u1 = Math.max(1e-4, fnv1aUnit(`${seedKey}|bm1|${i}`));
        const u2 = fnv1aUnit(`${seedKey}|bm2|${i}`);
        const Z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        // Partisan shift: delta = Z * 13.333 percentage points
        const delta = Z * 13.333;

        // Shift top-2 parties symmetrically
        const shiftedShares = {};
        parties.forEach((p) => {
          let s = Number(finalShares[p]) || 0;
          if (p === top1) s = Math.max(0.2, s + delta);
          else if (p === top2) s = Math.max(0.2, s - delta);
          else if (s > 1.0) {
            // Multi-party independent jitter for minor parties > 1%
            const uk1 = Math.max(1e-4, fnv1aUnit(`${seedKey}|bm1_min|${i}|${p}`));
            const uk2 = fnv1aUnit(`${seedKey}|bm2_min|${i}|${p}`);
            const Zk = Math.sqrt(-2 * Math.log(uk1)) * Math.cos(2 * Math.PI * uk2);
            s = Math.max(0.1, s + Zk * 3.5 * (s / 20));
          }
          shiftedShares[p] = s;
        });

        // Normalize shifted shares
        const sumShift = parties.reduce((sum, p) => sum + shiftedShares[p], 0) || 100;
        parties.forEach((p) => { shiftedShares[p] = (shiftedShares[p] / sumShift) * 100; });

        // Constrained pool allocation: strictly cap at remaining[p]
        let unallocated = dropSize;
        parties.forEach((p) => {
          const rawTarget = Math.round((dropSize * shiftedShares[p]) / 100);
          const draw = Math.min(rawTarget, remaining[p] || 0);
          allocatedThisDrop[p] = draw;
          remaining[p] -= draw;
          unallocated -= draw;
        });

        // Distribute any remainder to parties with available pool
        if (unallocated > 0) {
          const available = parties.filter((p) => remaining[p] > 0);
          available.sort((a, b) => remaining[b] - remaining[a]);
          let aIdx = 0;
          while (unallocated > 0 && available.length > 0) {
            const p = available[aIdx % available.length];
            if (remaining[p] > 0) {
              allocatedThisDrop[p] += 1;
              remaining[p] -= 1;
              unallocated -= 1;
            }
            aIdx++;
            if (available.every((cand) => remaining[cand] === 0)) break;
          }
        }
      }

      // Update cumulative counts
      parties.forEach((p) => {
        cumVotes[p] += (allocatedThisDrop[p] || 0);
      });
      cumTotal += dropSize;

      // Concave non-linear timestamp spacing
      const progress = (i + 1) / dropSizes.length;
      const concave = Math.pow(progress, 1 / 1.15);
      const timestamp = closeMinutes + durationMinutes * concave;

      // Current live leader and margin
      const currentShares = {};
      parties.forEach((p) => {
        currentShares[p] = cumTotal > 0 ? (cumVotes[p] / cumTotal) * 100 : 0;
      });
      const ranked = parties.slice().sort((a, b) => (currentShares[b] || 0) - (currentShares[a] || 0));
      const liveLeader = ranked[0] || top1;
      const runnerUp = ranked[1] || top2;
      const liveLead = (currentShares[liveLeader] || 0) - (currentShares[runnerUp] || 0);

      drops.push({
        index: i,
        timestamp: Math.round(timestamp * 10) / 10,
        pct: Math.min(100, Math.round((cumTotal / cast) * 1000) / 10),
        cumulativeVotes: { ...cumVotes },
        currentShares: { ...currentShares },
        liveLeader,
        liveLead: Math.round(liveLead * 10) / 10,
      });
    }

    return drops;
  }

  // ============================================================================
  // 13-TIER RACE CALLING LOGIC (REQ-222)
  // ============================================================================

  function findRaceCallTier(finalWinningMargin) {
    const margin = Math.abs(finalWinningMargin);
    for (const t of CALL_TIERS) {
      if (margin >= t.minMargin) return t;
    }
    return CALL_TIERS[CALL_TIERS.length - 1];
  }

  /**
   * Precomputes the exact simulated minute when a race qualifies to be called.
   */
  function precomputeRaceCallMinute(raceDef, drops) {
    const { finalWinningMargin, finalWinner, closeMinutes, endMinutes } = raceDef;
    const tier = findRaceCallTier(finalWinningMargin);

    // Tier 1 (Blowout >= 15%): Calls immediately at poll close
    if (tier.minPct === 0) {
      return closeMinutes;
    }

    // Razor-thin nail-biters (< 3%): Hold until 100% counted
    if (tier.minPct >= 100) {
      return endMinutes;
    }

    // Mid-tier races (3% to 14.9%): Find first drop meeting minPct AND liveLeader === finalWinner
    for (const drop of drops) {
      if (drop.pct >= tier.minPct) {
        if (!tier.requireLeader || drop.liveLeader === finalWinner) {
          return drop.timestamp;
        }
      }
    }

    // Fallback: holds to end
    return endMinutes;
  }

  // ============================================================================
  // SALLOW 15-MINUTE LIVE DESK FORECAST ENGINE (REQ-222)
  // ============================================================================

  /**
   * Blends live reported margins with pre-election baseline expectations and runs
   * 120 seeded Monte Carlo draws with shrinking remaining variance.
   */
  function computeLiveDeskForecast(timeline, currentMinute) {
    const forecastMinute = Math.floor(currentMinute / 15) * 15;
    if (timeline.forecastCache && timeline.forecastCache[forecastMinute]) {
      return timeline.forecastCache[forecastMinute];
    }

    const isPresidential = timeline.isPresidential;
    const presidentialRaces = timeline.races.filter((r) => r.raceKind === 'president');
    const senateRaces = timeline.races.filter((r) => r.raceKind === 'senate');
    const houseRaces = timeline.races.filter((r) => r.raceKind === 'house');

    const numSims = 120;
    const seedBase = `${timeline.year}|${timeline.seed}|fc|${forecastMinute}`;

    // 1. Presidential Forecast
    let presWinOdds = {};
    if (isPresidential && presidentialRaces.length > 0) {
      const winsByParty = {};
      const evSums = {};

      for (let s = 0; s < numSims; s++) {
        const uNat = Math.max(1e-4, fnv1aUnit(`${seedBase}|pres|nat|${s}`));
        const uNat2 = fnv1aUnit(`${seedBase}|pres|nat2|${s}`);
        const zNat = Math.sqrt(-2 * Math.log(uNat)) * Math.cos(2 * Math.PI * uNat2);

        const simEvByParty = {};

        presidentialRaces.forEach((race) => {
          const drop = getRaceStateAtMinute(race, currentMinute);
          const pct = drop.pct;
          const liveMargin = drop.liveLead * (drop.liveLeader === 'people' ? 1 : -1);
          const expectedMargin = race.expectedMargin || 0;

          // Blended margin
          const blended = expectedMargin + (liveMargin - expectedMargin) * (pct / 100);

          let simWinner = race.finalWinner;
          if (pct < 100 && currentMinute < race.callMinutes) {
            const uSt = Math.max(1e-4, fnv1aUnit(`${seedBase}|st|${race.id}|${s}`));
            const zSt = Math.sqrt(-2 * Math.log(uSt));
            const remainingVariance = (1 - pct / 100);
            const shock = (zNat * 2.0 + zSt * 1.5) * remainingVariance;
            const simMargin = blended + shock;
            simWinner = simMargin >= 0 ? 'people' : 'heritage';
          }

          simEvByParty[simWinner] = (simEvByParty[simWinner] || 0) + (race.ev || 0);
        });

        // Determine winner of this draw
        let drawWinner = 'people';
        let maxEv = 0;
        Object.entries(simEvByParty).forEach(([p, ev]) => {
          evSums[p] = (evSums[p] || 0) + ev;
          if (ev > maxEv) {
            maxEv = ev;
            drawWinner = p;
          }
        });
        if (maxEv >= 270) {
          winsByParty[drawWinner] = (winsByParty[drawWinner] || 0) + 1;
        } else {
          winsByParty['deadlock'] = (winsByParty['deadlock'] || 0) + 1;
        }
      }

      Object.keys(winsByParty).forEach((p) => {
        presWinOdds[p] = Math.round((winsByParty[p] / numSims) * 100);
      });
    }

    // 2. Chamber Control Forecasts (Senate & House)
    const computeChamberForecast = (races, targetMajority, chamberKind) => {
      if (!races || races.length === 0) return null;
      const winsCount = { people: 0, heritage: 0, hung: 0 };
      const seatsArrDem = [];
      const seatsArrRep = [];

      for (let s = 0; s < numSims; s++) {
        const uNat = Math.max(1e-4, fnv1aUnit(`${seedBase}|${chamberKind}|nat|${s}`));
        const zNat = Math.sqrt(-2 * Math.log(uNat));
        let demSeats = 0;
        let repSeats = 0;

        races.forEach((race) => {
          const drop = getRaceStateAtMinute(race, currentMinute);
          const pct = drop.pct;
          let winner = race.finalWinner;

          if (pct < 100 && currentMinute < race.callMinutes) {
            const uDist = Math.max(1e-4, fnv1aUnit(`${seedBase}|${chamberKind}|${race.id}|${s}`));
            const zDist = Math.sqrt(-2 * Math.log(uDist));
            const remainingVariance = (1 - pct / 100);
            const shock = (zNat * 1.5 + zDist * 1.2) * remainingVariance;
            const liveMargin = drop.liveLead * (drop.liveLeader === 'people' ? 1 : -1);
            const blended = (race.expectedMargin || 0) + (liveMargin - (race.expectedMargin || 0)) * (pct / 100);
            winner = (blended + shock) >= 0 ? 'people' : 'heritage';
          }

          if (winner === 'people') demSeats++;
          else if (winner === 'heritage') repSeats++;
        });

        seatsArrDem.push(demSeats);
        seatsArrRep.push(repSeats);

        if (demSeats >= targetMajority) winsCount.people++;
        else if (repSeats >= targetMajority) winsCount.heritage++;
        else winsCount.hung++;
      }

      seatsArrDem.sort((a, b) => a - b);
      seatsArrRep.sort((a, b) => a - b);

      const medianDem = seatsArrDem[Math.floor(numSims * 0.5)];
      const lowDem = seatsArrDem[Math.floor(numSims * 0.1)];
      const highDem = seatsArrDem[Math.floor(numSims * 0.9)];

      return {
        majorityOdds: {
          people: Math.round((winsCount.people / numSims) * 100),
          heritage: Math.round((winsCount.heritage / numSims) * 100),
          hung: Math.round((winsCount.hung / numSims) * 100),
        },
        medianSeatsDem: medianDem,
        range80Dem: [lowDem, highDem],
      };
    };

    const senateForecast = computeChamberForecast(senateRaces, 51, 'senate');
    const houseForecast = computeChamberForecast(houseRaces, 218, 'house');

    const result = {
      minute: forecastMinute,
      timestampLabel: formatSimTime(forecastMinute),
      presidentialWinOdds: presWinOdds,
      senate: senateForecast,
      house: houseForecast,
    };

    if (!timeline.forecastCache) timeline.forecastCache = {};
    timeline.forecastCache[forecastMinute] = result;
    return result;
  }

  // ============================================================================
  // TIMELINE BUILDER & INITIALIZATION (REQ-220 & REQ-221)
  // ============================================================================

  function getRaceStateAtMinute(race, currentMinute) {
    if (currentMinute < race.closeMinutes) {
      return {
        pct: 0,
        liveLeader: null,
        liveLead: 0,
        currentShares: {},
        currentVotes: {},
        isCalled: false,
      };
    }

    if (currentMinute >= race.endMinutes) {
      const isCalled = (currentMinute >= race.callMinutes) && !race.isRecountPending;
      return {
        pct: 100,
        liveLeader: race.finalWinner,
        liveLead: Math.abs(race.finalWinningMargin),
        currentShares: { ...race.finalShares },
        currentVotes: { ...race.finalVotes },
        isCalled,
        isRecountPending: race.isRecountPending,
      };
    }

    // Binary search or scan for latest drop with drop.timestamp <= currentMinute
    const drops = race.drops;
    let low = 0;
    let high = drops.length - 1;
    let best = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (drops[mid].timestamp <= currentMinute) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const drop = drops[best];
    const isCalled = (currentMinute >= race.callMinutes) && !race.isRecountPending;

    return {
      pct: drop.pct,
      liveLeader: drop.liveLeader,
      liveLead: drop.liveLead,
      currentShares: drop.currentShares,
      currentVotes: drop.cumulativeVotes,
      isCalled,
      isRecountPending: race.isRecountPending && drop.pct >= 100,
    };
  }

  /**
   * Builds the complete, deterministic Decision Desk timeline covering all 5 race categories.
   */
  function buildElectionNightTimeline(game, election) {
    const safeGame = game || {};
    const safeElection = election || safeGame.lastElection || {};
    const year = safeGame.year || 2028;
    const isPresidential = (year % 4 === 0);
    const cycleType = isPresidential ? 'presidential' : 'midterm';
    const seedKey = `${year}|${safeGame.seed || 'pc'}`;
    const races = [];

    let presResults = safeElection.presidentialResults || (safeElection.presidential?.byState) || safeGame.presidentialResults || {};
    let senateResults = Array.isArray(safeElection.senate) ? safeElection.senate
      : (Array.isArray(safeGame.senateResults) ? safeGame.senateResults : []);
    let governorResults = Array.isArray(safeElection.governors) ? safeElection.governors
      : (Array.isArray(safeGame.governorResults) ? safeGame.governorResults : []);
    const legResults = safeElection.stateLegislatures || safeGame.stateLegislatures || {};
    const representatives = safeElection.representatives || safeGame.representatives || [];

    // [QA-BATCH2-FIX] B2-16: Synthesize fallback projections on active campaign state when resolved election results are absent
    const stateList = Array.isArray(safeGame.states) && safeGame.states.length > 0
      ? safeGame.states
      : Object.keys(STATE_EV_WEIGHTS).map((id) => ({ id, name: id, ev: STATE_EV_WEIGHTS[id], lean: 0 }));
    const statesById = Object.fromEntries(stateList.map((st) => [st.id || st.stateId, st]));
    const natEnv = Number(safeGame.nationalEnvironment || 0);
    const getProjectedMargin = (stateId, officeForecast) => {
      if (officeForecast && Number.isFinite(Number(officeForecast.margin))) {
        return Number(officeForecast.margin);
      }
      const st = statesById[stateId];
      const baseLean = st?.leanPercent !== undefined
        ? Number(st.leanPercent)
        : (Math.abs(Number(st?.lean || 0)) <= 1 ? Number(st?.lean || 0) * 100 : Number(st?.lean || 0));
      const jitter = (fnv1aUnit(`${seedKey}|fallback|${stateId}`) - 0.5) * 3.0;
      return Math.round((baseLean + natEnv + jitter) * 10) / 10;
    };

    if (isPresidential && Object.keys(presResults).length === 0) {
      const fallbackPres = {};
      const presFcStates = safeGame.forecasters?.presidential?.byState || safeGame.forecasters?.presidential?.states || {};
      Object.keys(STATE_EV_WEIGHTS).forEach((stateId) => {
        const margin = getProjectedMargin(stateId, presFcStates[stateId]);
        const ev = Number(statesById[stateId]?.ev || STATE_EV_WEIGHTS[stateId] || 3);
        fallbackPres[stateId] = {
          stateId,
          name: statesById[stateId]?.name || stateId,
          ev,
          margin,
          expectedMargin: margin,
          winner: margin >= 0 ? 'people' : 'heritage',
        };
      });
      presResults = fallbackPres;
    }

    if (senateResults.length === 0) {
      const senFc = safeGame.forecasters?.senate?.races || {};
      const activeSen = (Array.isArray(safeGame.activeSenateRaces) && safeGame.activeSenateRaces.length > 0)
        ? safeGame.activeSenateRaces
        : (Array.isArray(safeGame.sittingMembers)
            ? safeGame.sittingMembers.filter((m) => m && m.office === 'senate' && (!safeGame.activeSenateClass || Number(m.senateClass || m.class) === Number(safeGame.activeSenateClass)))
            : []);
      const seenSenStates = new Set();
      senateResults = activeSen
        .map((s) => {
          const stId = s.stateId || s.state;
          if (!stId || seenSenStates.has(stId)) return null;
          seenSenStates.add(stId);
          const margin = getProjectedMargin(stId, senFc[stId] || senFc[`senate:${stId}`]);
          return { stateId: stId, margin, winner: margin >= 0 ? 'people' : 'heritage' };
        })
        .filter(Boolean);
      if (senateResults.length === 0) {
        senateResults = stateList.filter((s) => (s.id || s.stateId) !== 'DC').slice(0, 33).map((s) => {
          const stId = s.id || s.stateId;
          const margin = getProjectedMargin(stId, senFc[stId]);
          return { stateId: stId, margin, winner: margin >= 0 ? 'people' : 'heritage' };
        });
      }
    }

    if (governorResults.length === 0) {
      const govFc = safeGame.forecasters?.governors?.races || {};
      const activeGov = (Array.isArray(safeGame.activeGubernatorialStates) && safeGame.activeGubernatorialStates.length > 0)
        ? safeGame.activeGubernatorialStates
        : stateList.filter((s) => (s.id || s.stateId) !== 'DC').slice(0, isPresidential ? 11 : 36);
      governorResults = activeGov
        .map((g) => {
          const stId = typeof g === 'string' ? g : (g.stateId || g.state || g.id);
          if (!stId || stId === 'DC') return null;
          const margin = getProjectedMargin(stId, govFc[stId] || govFc[`governor:${stId}`]);
          return { stateId: stId, margin, winner: margin >= 0 ? 'people' : 'heritage' };
        })
        .filter(Boolean);
    }

    // 1. Presidential Races (50 States + DC)
    if (isPresidential) {
      Object.keys(presResults).forEach((stateId) => {
        const presData = presResults[stateId];
        const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
        const duration = getStateReportingDuration(stateId);
        const margin = Number(presData.margin || presData.lead || 0);
        const winner = presData.winner || (margin >= 0 ? 'people' : 'heritage');
        const ev = presData.ev || safeGame.electoralVotesByState?.[stateId] || (safeGame.states || []).find((s) => s.id === stateId)?.ev || STATE_EV_WEIGHTS[stateId] || 3;
        const isRecount = Math.abs(margin) <= 0.50;

        // Modeled ballots on 1:100 scale (e.g. 50k to 200k units)
        const cast = Math.max(1000, (ev * 3500));
        const finalShares = presData.shares || {
          people: Math.round((50 + margin / 2) * 10) / 10,
          heritage: Math.round((50 - margin / 2) * 10) / 10,
        };

        const raceDef = {
          id: `pres:${stateId}`,
          raceKind: 'president',
          raceId: stateId,
          name: presData.name || stateId,
          code: stateId,
          stateId,
          ev,
          seats: ev,
          closeMinutes: close,
          durationMinutes: duration,
          endMinutes: close + duration,
          finalWinner: winner,
          finalWinningMargin: margin,
          expectedMargin: presData.expectedMargin || margin,
          finalShares,
          cast,
          isRecountPending: isRecount,
          isHouseDistrict: false,
        };

        raceDef.finalVotes = allocateIntegerVotePool(cast, finalShares);
        const drops = buildRaceDrops(raceDef, `${seedKey}|pres|${stateId}`);
        raceDef.drops = drops;
        raceDef.callMinutes = precomputeRaceCallMinute(raceDef, drops);
        raceDef.callTier = findRaceCallTier(margin).tier;
        races.push(raceDef);
      });
    }

    // 2. Senate Races
    senateResults.forEach((sen) => {
      const stateId = sen.stateId || sen.state;
      const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
      const duration = getStateReportingDuration(stateId);
      const margin = Number(sen.margin || 0);
      const winner = sen.winner || (margin >= 0 ? 'people' : 'heritage');
      const isRecount = Math.abs(margin) <= 0.50;
      const cast = 40000;
      const finalShares = {
        people: Math.round((50 + margin / 2) * 10) / 10,
        heritage: Math.round((50 - margin / 2) * 10) / 10,
      };

      const raceDef = {
        id: `senate:${stateId}`,
        raceKind: 'senate',
        raceId: stateId,
        name: `${stateId} Senate`,
        code: stateId,
        stateId,
        seats: 1,
        closeMinutes: close,
        durationMinutes: duration,
        endMinutes: close + duration,
        finalWinner: winner,
        finalWinningMargin: margin,
        expectedMargin: margin,
        finalShares,
        cast,
        isRecountPending: isRecount,
        isHouseDistrict: false,
      };

      raceDef.finalVotes = allocateIntegerVotePool(cast, finalShares);
      const drops = buildRaceDrops(raceDef, `${seedKey}|senate|${stateId}`);
      raceDef.drops = drops;
      raceDef.callMinutes = precomputeRaceCallMinute(raceDef, drops);
      raceDef.callTier = findRaceCallTier(margin).tier;
      races.push(raceDef);
    });

    // 3. Gubernatorial Races
    governorResults.forEach((gov) => {
      const stateId = gov.stateId;
      const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
      const duration = getStateReportingDuration(stateId);
      const margin = Number(gov.margin || 0);
      const winner = gov.winner || (margin >= 0 ? 'people' : 'heritage');
      const isRecount = Math.abs(margin) <= 0.50;
      const cast = 35000;
      const finalShares = {
        people: Math.round((50 + margin / 2) * 10) / 10,
        heritage: Math.round((50 - margin / 2) * 10) / 10,
      };

      const raceDef = {
        id: `governor:${stateId}`,
        raceKind: 'governors',
        raceId: stateId,
        name: `${stateId} Governor`,
        code: stateId,
        stateId,
        seats: 1,
        closeMinutes: close,
        durationMinutes: duration,
        endMinutes: close + duration,
        finalWinner: winner,
        finalWinningMargin: margin,
        expectedMargin: margin,
        finalShares,
        cast,
        isRecountPending: isRecount,
        isHouseDistrict: false,
      };

      raceDef.finalVotes = allocateIntegerVotePool(cast, finalShares);
      const drops = buildRaceDrops(raceDef, `${seedKey}|gov|${stateId}`);
      raceDef.drops = drops;
      raceDef.callMinutes = precomputeRaceCallMinute(raceDef, drops);
      raceDef.callTier = findRaceCallTier(margin).tier;
      races.push(raceDef);
    });

    // 4. State Legislative Summary Chambers
    const legSharesByState = safeElection.stateLegislatureShares || {};
    const seatCountsByState = safeElection.stateHouseSeatCounts || safeGame.stateHouseSeatCounts || {};
    Object.keys(legResults).forEach((stateId) => {
      const chambers = legResults[stateId] || ['heritage', 'heritage'];
      const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
      const duration = getStateReportingDuration(stateId);
      const winner = chambers[0] === chambers[1] ? chambers[0] : 'split';
      const cast = 20000;
      // [v0.18.8 PLAYTEST-FIX #1] Use real multi-party state legislature vote shares (including Green/3rd/Custom) instead of hardcoded Dem/GOP only
      const rawLegShares = legSharesByState[stateId] || seatCountsByState[stateId]?.slateShares || null;
      let finalShares;
      let margin = winner === 'people' ? 6.0 : winner === 'heritage' ? -6.0 : 0.0;
      if (rawLegShares && Object.keys(rawLegShares).length > 0) {
        finalShares = {};
        Object.entries(rawLegShares).forEach(([pKey, val]) => {
          const v = Number(val || 0);
          if (v > 0) finalShares[pKey] = Math.round(v * 10) / 10;
        });
        const sortedEntries = Object.entries(finalShares).sort((a, b) => b[1] - a[1]);
        if (sortedEntries.length >= 2) {
          margin = Math.round((sortedEntries[0][1] - sortedEntries[1][1]) * 10) / 10;
        }
      } else {
        finalShares = {
          people: winner === 'people' ? 53 : winner === 'heritage' ? 47 : 50,
          heritage: winner === 'people' ? 47 : winner === 'heritage' ? 53 : 50,
        };
      }

      const raceDef = {
        id: `state_leg:${stateId}`,
        raceKind: 'state_leg',
        raceId: stateId,
        name: `${stateId} Legislature`,
        code: stateId,
        stateId,
        seats: chambers.length,
        closeMinutes: close,
        durationMinutes: duration,
        endMinutes: close + duration,
        finalWinner: winner,
        finalWinningMargin: margin,
        expectedMargin: margin,
        finalShares,
        cast,
        isRecountPending: false,
        isHouseDistrict: false,
      };

      raceDef.finalVotes = allocateIntegerVotePool(cast, finalShares);
      const drops = buildRaceDrops(raceDef, `${seedKey}|leg|${stateId}`);
      raceDef.drops = drops;
      raceDef.callMinutes = precomputeRaceCallMinute(raceDef, drops);
      raceDef.callTier = findRaceCallTier(margin).tier;
      races.push(raceDef);
    });

    // 5. U.S. House Districts (All 435 Districts)
    representatives.forEach((rep, repIdx) => {
      const distId = rep.districtId || rep.district || rep.id || `${rep.stateId || 'AL'}-${repIdx + 1}`;
      const stateId = rep.stateId || (distId ? String(distId).split('-')[0] : 'PA');
      const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
      const duration = getStateReportingDuration(stateId);
      const margin = Number(rep.margin !== undefined ? rep.margin : (rep.partyId === 'people' ? 8 : -8));
      const winner = rep.partyId || (margin >= 0 ? 'people' : 'heritage');
      const cast = 10000;
      const finalShares = {
        people: Math.round((50 + margin / 2) * 10) / 10,
        heritage: Math.round((50 - margin / 2) * 10) / 10,
      };

      const raceDef = {
        id: `house:${distId}`,
        raceKind: 'house',
        raceId: distId,
        name: distId,
        code: distId,
        stateId,
        seats: 1,
        closeMinutes: close,
        durationMinutes: duration,
        endMinutes: close + duration,
        finalWinner: winner,
        finalWinningMargin: margin,
        expectedMargin: margin,
        finalShares,
        cast,
        isRecountPending: Math.abs(margin) <= 0.50,
        isHouseDistrict: true,
      };

      raceDef.finalVotes = allocateIntegerVotePool(cast, finalShares);
      const drops = buildRaceDrops(raceDef, `${seedKey}|house|${rep.id}`);
      raceDef.drops = drops;
      raceDef.callMinutes = precomputeRaceCallMinute(raceDef, drops);
      raceDef.callTier = findRaceCallTier(margin).tier;
      races.push(raceDef);
    });

    // 6. Statewide Executive Offices (#44: live counting drops for AG/SoS/Treasurer/etc.)
    const statewideResults = election?.statewideResults || [];
    statewideResults.forEach((seo) => {
      if (!seo || !seo.officeId) return;
      const stateId = seo.stateId || 'PA';
      const close = POLL_CLOSE_MINUTES[stateId] !== undefined ? POLL_CLOSE_MINUTES[stateId] : 60;
      const duration = getStateReportingDuration(stateId);
      const margin = Number(seo.margin || 0);
      const winner = seo.winner || (margin >= 0 ? 'people' : 'heritage');
      const cast = 15000;
      const finalShares = seo.shares && Object.keys(seo.shares).length > 0
        ? { ...seo.shares }
        : {
            people: Math.round((50 + margin / 2) * 10) / 10,
            heritage: Math.round((50 - margin / 2) * 10) / 10,
          };
      const raceDef = {
        id: `statewide_executive:${seo.officeId}`,
        raceKind: 'statewide_executive',
        raceId: seo.officeId,
        name: seo.title ? `${stateId} ${seo.title}` : seo.officeId,
        code: stateId,
        stateId,
        seats: 1,
        closeMinutes: close,
        durationMinutes: duration,
        endMinutes: close + duration,
        finalWinner: winner,
        finalWinningMargin: margin,
        expectedMargin: margin,
        finalShares,
        cast,
        isRecountPending: Math.abs(margin) <= 0.50,
        isHouseDistrict: false,
      };
      raceDef.finalVotes = allocateIntegerVotePool(cast, finalShares);
      const drops = buildRaceDrops(raceDef, `${seedKey}|seo|${seo.officeId}`);
      raceDef.drops = drops;
      raceDef.callMinutes = precomputeRaceCallMinute(raceDef, drops);
      raceDef.callTier = findRaceCallTier(margin).tier;
      races.push(raceDef);
    });

    return {
      year,
      seed: game.seed || 'pc',
      isPresidential,
      cycleType,
      startMinute: 0,
      end: TIMELINE_END,
      races,
      forecastCache: {},
    };
  }

  // ============================================================================
  // SNAPSHOT EVALUATION AT ELAPSED MINUTE (REQ-220, REQ-222, REQ-223)
  // ============================================================================

  function evaluateElectionNightAt(timeline, elapsedMinutes) {
    const t = Math.max(0, Math.min(timeline.end, Number(elapsedMinutes) || 0));
    const isFinished = (t >= timeline.end);
    const clockLabel = formatSimTime(t);

    const calls = [];
    const callsByRaceId = {};
    const callsByKind = { president: [], senate: [], house: [], governors: [], state_leg: [], statewide_executive: [] };

    // Scoreboard seat/EV accumulators by tab and party
    const scoreboard = {
      president: { people: 0, heritage: 0, third: 0, totalCalled: 0, totalEv: 538 },
      senate: { people: 0, heritage: 0, third: 0, totalCalled: 0, totalSeats: 100 },
      house: { people: 0, heritage: 0, third: 0, totalCalled: 0, totalSeats: 435 },
      governors: { people: 0, heritage: 0, third: 0, totalCalled: 0, totalSeats: 0 },
      state_leg: { people: 0, heritage: 0, third: 0, totalCalled: 0, totalChambers: 0 },
      statewide_executive: { people: 0, heritage: 0, third: 0, totalCalled: 0, totalSeats: 0 },
    };

    // Evaluate every race
    const raceEvaluations = [];

    timeline.races.forEach((race) => {
      const state = getRaceStateAtMinute(race, t);
      const isOpen = (t >= race.closeMinutes);
      const isCalled = state.isCalled;

      if (isCalled) {
        const callObj = {
          id: race.id,
          raceKind: race.raceKind,
          raceId: race.raceId,
          name: race.name,
          winnerPartyId: race.finalWinner,
          timestampMinutes: race.callMinutes,
          timestampLabel: formatSimTime(race.callMinutes),
          pctReportedAtCall: state.pct,
          liveMarginAtCall: state.liveLead,
          electoralVotes: race.ev || 0,
          seats: race.seats || 1,
          isRecountPending: Boolean(state.isRecountPending),
        };
        calls.push(callObj);
        callsByRaceId[race.id] = callObj;
        if (!callsByKind[race.raceKind]) callsByKind[race.raceKind] = [];
        callsByKind[race.raceKind].push(callObj);

        // Accumulate called scoreboards
        const pWinner = race.finalWinner;
        const pts = race.ev || race.seats || 1;
        const targetTab = scoreboard[race.raceKind];
        if (targetTab) {
          targetTab.totalCalled += pts;
          if (pWinner === 'people') targetTab.people += pts;
          else if (pWinner === 'heritage') targetTab.heritage += pts;
          else targetTab.third += pts;
        }
      }

      raceEvaluations.push({
        ...race,
        ...state,
        isOpen,
      });
    });

    // Sort calls reverse-chronologically (newest first)
    calls.sort((a, b) => b.timestampMinutes - a.timestampMinutes);

    // Compute active Phase (1 to 4)
    let phaseIndex = 1;
    if (t >= 60) phaseIndex = 2;
    if (t >= 180) phaseIndex = 3;
    if (isFinished || (timeline.isPresidential && (scoreboard.president.people >= 270 || scoreboard.president.heritage >= 270))) {
      phaseIndex = 4;
    }

    // Detect National Breaking Call (270 EV or Midterm chamber clinches)
    let breakingCall = null;
    if (timeline.isPresidential) {
      if (scoreboard.president.people >= 270) {
        breakingCall = { partyId: 'people', headline: 'Democrats Win the White House', stamp: 'THE PRESIDENCY IS CALLED' };
      } else if (scoreboard.president.heritage >= 270) {
        breakingCall = { partyId: 'heritage', headline: 'Republicans Win the White House', stamp: 'THE PRESIDENCY IS CALLED' };
      }
    } else {
      if (scoreboard.senate.people >= 51) {
        breakingCall = { partyId: 'people', headline: 'Democrats Clinch Senate Majority', stamp: 'SENATE MAJORITY CLINCHED' };
      } else if (scoreboard.senate.heritage >= 51) {
        breakingCall = { partyId: 'heritage', headline: 'Republicans Clinch Senate Majority', stamp: 'SENATE MAJORITY CLINCHED' };
      } else if (scoreboard.house.people >= 218) {
        breakingCall = { partyId: 'people', headline: 'Democrats Clinch House Majority', stamp: 'HOUSE MAJORITY CLINCHED' };
      } else if (scoreboard.house.heritage >= 218) {
        breakingCall = { partyId: 'heritage', headline: 'Republicans Clinch House Majority', stamp: 'HOUSE MAJORITY CLINCHED' };
      }
    }

    // Closest-first live table ("The Count"):
    // All reporting races sorted ascending by Math.abs(liveLead)
    const theCountRaces = raceEvaluations
      .filter((r) => r.isOpen)
      .sort((a, b) => {
        // Uncalled races first, sorted by closest margin
        if (a.isCalled !== b.isCalled) return a.isCalled ? 1 : -1;
        return Math.abs(a.liveLead) - Math.abs(b.liveLead);
      });

    // 15-Minute Sallow Live Forecast
    const forecast = computeLiveDeskForecast(timeline, t);

    return {
      elapsedMinutes: t,
      clockLabel,
      phaseIndex,
      isFinished,
      breakingCall,
      scoreboard,
      calls,
      callsByRaceId,
      callsByKind,
      raceEvaluations,
      theCountRaces,
      forecast,
    };
  }


  // ============================================================================
  // VERSION 0.16.6: STATEWIDE ELECTED EXECUTIVE RESOLUTION ENGINE
  // ============================================================================
  function computeStatewideFundingLift(dollarsMillions) {
    const spend = Math.max(0, Number(dollarsMillions) || 0);
    if (spend <= 0) return 0.0;
    const CURVE = [
      { spend: 0, lift: 0.0 },
      { spend: 1, lift: 1.0 },
      { spend: 2, lift: 1.8 },
      { spend: 4, lift: 2.7 },
      { spend: 8, lift: 3.5 },
      { spend: 16, lift: 4.5 },
      { spend: 20, lift: 5.0 },
    ];
    for (let i = 0; i < CURVE.length - 1; i++) {
      const a = CURVE[i];
      const b = CURVE[i + 1];
      if (spend >= a.spend && spend <= b.spend) {
        const frac = (spend - a.spend) / (b.spend - a.spend);
        return Number((a.lift + frac * (b.lift - a.lift)).toFixed(2));
      }
    }
    return 5.0;
  }

  function gaussianFromSeed(seedStr) {
    const u1 = Math.max(1e-7, fnv1aUnit(seedStr + ':u1'));
    const u2 = fnv1aUnit(seedStr + ':u2');
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  }

  function resolveStatewideOffices(game, year, options = {}) {
    const targetYear = Number(year || game?.year || 2028);
    const data = (typeof window !== 'undefined' && window.PartyChairData) ? window.PartyChairData : {};
    const registry = Array.isArray(data.STATEWIDE_OFFICES_REGISTRY) ? data.STATEWIDE_OFFICES_REGISTRY : [];
    const statesList = Array.isArray(data.STATES) ? data.STATES : (Array.isArray(data.VERSION_01_STATES) ? data.VERSION_01_STATES : []);
    const stateMap = new Map(statesList.map((s) => [s.id || s.stateId, s]));
    const isOnCycleFn = data.isStatewideOfficeOnCycle || ((o, y) => {
      if (o.cycle === 'annual_2yr') return true;
      if (o.cycle === 'presidential') return y % 4 === 0;
      if (o.cycle === 'midterm' || o.cycle === 'odd_year') return y % 4 === 2;
      if (o.cycle === 'staggered_6yr') return Math.abs(y - (Number(o.nextElectionYear) || 2028)) % 6 === 0;
      return y % 4 === 0;
    });

    if (!game.statewideOffices) game.statewideOffices = {};
    if (!game.statewideOfficesHistory) game.statewideOfficesHistory = {};
    if (!game.cycleFlips) game.cycleFlips = {};
    game.cycleFlips.statewide = [];

    const playerIdentity = game?.player?.custom ? 'player' : (game?.player?.baseTemplateId || 'people');
    const results = [];
    const byState = {};
    const flips = [];
    const seoCycleHappinessDelta = {};

    registry.forEach((office) => {
      const onCycle = options.includeOffCycle || isOnCycleFn(office, targetYear);
      const prevParty = game.statewideOffices[office.id]
        || (game.sittingMembers || []).find((m) => m.office === 'statewide_executive' && (m.officeId === office.id || (m.stateId === office.stateId && m.subOffice === office.officeKey)))?.party
        || 'heritage';
      if (!game.statewideOffices[office.id]) {
        game.statewideOffices[office.id] = prevParty;
      }
      if (!onCycle) return;

      const stObj = stateMap.get(office.stateId) || {};
      const stateLean = Number(
        options.stateLeans?.[office.stateId]
        ?? stObj.leanPercent
        ?? stObj.lean
        ?? 0
      );

      // Gubernatorial margin (positive = people/Dem, negative = heritage/GOP)
      const govMargin = Number(
        options.govMargins?.[office.stateId]
        ?? game.lastElection?.governors?.[office.stateId]?.margin
        ?? game.governorResults?.[office.stateId]?.margin
        ?? stateLean
      );
      // Strict 0.35x gubernatorial coattail dampening factor
      const dampedCoattail = 0.35 * (govMargin - stateLean);

      const incumbent = (game.sittingMembers || []).find(
        (m) => m.office === 'statewide_executive' && (m.officeId === office.id || (m.stateId === office.stateId && m.subOffice === office.officeKey))
      );
      const incQuality = Number(incumbent?.quality ?? 6.8);
      const challengerQuality = 6.5;
      const incSign = prevParty === 'people' ? 1 : -1;
      const qualityDelta = incSign * ((incQuality - challengerQuality) * 3.2 + 0.6); // v0.16.7.2: 4x candidate quality weight

      // Candidate funding lift ($1M diminishing returns curve, capped at +5.0%)
      const raceKey = `statewide:${office.id}`;
      const fundingEntry = game.candidateFunding?.[raceKey] || null;
      const rawLift = fundingEntry ? computeStatewideFundingLift(fundingEntry.allocated || 0) : 0;
      const isThirdPartyPlayer = !['people', 'heritage'].includes(playerIdentity);
      const fundSign = (playerIdentity === 'heritage') ? -1 : (playerIdentity === 'people' ? 1 : 0);
      const treasuryLift = rawLift * fundSign;

      // Organic downballot divergence N(0, 2.0)
      const noise = options.zeroNoise
        ? 0
        : (gaussianFromSeed(`${game.seed || 2028}:seo:${targetYear}:${office.id}`) * 2.0);

      const coMod = (typeof window !== 'undefined' && window.CampaignOverhaul) || (typeof global !== 'undefined' && global.CampaignOverhaul) || null;
      const coStateLift = coMod?.getCampaignStateLift ? Number(coMod.getCampaignStateLift(game, office.stateId) || 0) : 0;
      const playerSignSeo = (game.player?.baseTemplateId === 'heritage') ? -1 : 1;
      const pollErrSeo = Number(game.pollingMissReport?.stateErrors?.[office.stateId] ?? game.lastElection?.pollingMissReport?.stateErrors?.[office.stateId] ?? 0);
      const downballotSeo = Number(game.campaign?.debateDownballotBoost || 0) * playerSignSeo;
      const margin = Number((stateLean + dampedCoattail + qualityDelta + treasuryLift + (coStateLift * 0.55 * playerSignSeo) + downballotSeo + pollErrSeo + noise).toFixed(2));
      let peopleShare = Number(Math.max(5, Math.min(95, 50 + margin / 2)).toFixed(2));
      let heritageShare = Number((100 - peopleShare).toFixed(2));
      const shares = { people: peopleShare, heritage: heritageShare };
      let winner = margin >= 0 ? 'people' : 'heritage';

      // v0.16.7 (Issue #2): Third parties & custom parties can compete for and win statewide offices
      const playerContested = isThirdPartyPlayer && Boolean(
        options.playerContested?.[office.id]
        || game.contestedStatewideOffices?.[office.id]
        || prevParty === playerIdentity
        || (typeof window !== 'undefined' && window.PartyChairEngine?.hasAutomaticStatewideContestation?.(game, office.stateId))
      );
      if (playerContested) {
        const vmSt = (game.voterModel?.states || []).find((x) => (x.stateId || x.id) === office.stateId);
        const totV = Math.max(1, Number(vmSt?.representedVoters || 1));
        const _enScale = (game.voterModel?.voterScale === '1:1' || Number(game.voterModel?.sampleVoters || 0) >= 10_000_000) ? 1 : 100;
        const pAffV = Number(vmSt?.affiliations?.[playerIdentity] || 0) * _enScale;
        const basePlayerShare = options.playerBaseShares?.[office.stateId] ?? ((pAffV / totV) * 100);
        const endorsementBonus = (game.primaryEndorsements?.[raceKey] || game.raceEndorsements?.[raceKey]) ? 1.5 : 0;
        const incBonus = prevParty === playerIdentity ? 2.5 : 0;
        const playerShare = Number(Math.max(0.5, Math.min(80, basePlayerShare + rawLift + endorsementBonus + incBonus)).toFixed(2));
        const rem = Math.max(20, 100 - playerShare);
        peopleShare = Number(((peopleShare / 100) * rem).toFixed(2));
        heritageShare = Number((100 - playerShare - peopleShare).toFixed(2));
        shares.people = peopleShare;
        shares.heritage = heritageShare;
        shares[playerIdentity] = playerShare;
        const ranked = Object.entries(shares).sort((a, b) => b[1] - a[1]);
        winner = ranked[0][0];
      }
      const flipped = winner !== prevParty;

      game.statewideOffices[office.id] = winner;

      const record = {
        officeId: office.id,
        stateId: office.stateId,
        officeKey: office.officeKey,
        title: office.title,
        seat: office.seat,
        category: office.category,
        importanceWeight: office.importanceWeight || 1.0,
        year: targetYear,
        prevParty,
        winner,
        flipped,
        margin,
        stateLean,
        govMargin,
        dampedCoattail: Number(dampedCoattail.toFixed(3)),
        qualityDelta: Number(qualityDelta.toFixed(2)),
        treasuryLift: Number(treasuryLift.toFixed(2)),
        shares,
        incumbentName: incumbent?.name || `${office.stateId} ${office.title}`,
      };
      results.push(record);
      if (!byState[office.stateId]) byState[office.stateId] = [];
      byState[office.stateId].push(record);

      if (flipped) {
        const flipRec = {
          officeId: office.id,
          stateId: office.stateId,
          title: office.title,
          fromParty: prevParty,
          toParty: winner,
          margin,
          year: targetYear,
        };
        flips.push(flipRec);
        game.cycleFlips.statewide.push(flipRec);
      }

      // v0.16.8 (Issue #6 Options A & C): Flip-only statewide happiness (+/-20 per-cycle faction cap) + diminishing returns (>75 / <25)
      if (flipped && incumbent?.factionId && game.factionHappiness) {
        const fid = incumbent.factionId;
        if (!seoCycleHappinessDelta[fid]) seoCycleHappinessDelta[fid] = 0;
        const curFH = Number(game.factionHappiness[fid] ?? 50);
        const rawFlipDelta = -0.4; // 1/5th of gubernatorial loss
        const dimFactor = rawFlipDelta > 0
          ? (curFH > 75 ? Math.max(0.1, (100 - curFH) / 50) : 1.0)
          : (curFH < 25 ? Math.max(0.1, curFH / 50) : 1.0);
        const dampedDelta = Number((rawFlipDelta * dimFactor).toFixed(2));
        const nextAccum = Math.max(-20, Math.min(20, seoCycleHappinessDelta[fid] + dampedDelta));
        const appliedDelta = Number((nextAccum - seoCycleHappinessDelta[fid]).toFixed(2));
        seoCycleHappinessDelta[fid] = nextAccum;
        const nextFH = Math.max(0, Math.min(100, Number((curFH + appliedDelta).toFixed(2))));
        game.factionHappiness[fid] = nextFH;
        if (game.factionStandings) game.factionStandings[fid] = nextFH;
        record.factionHappinessDelta = appliedDelta;
        record.impactScale = 0.2;
      }

      // Ambition Pipeline (v0.16.7.2: removed +3 Fame & +0.1 Quality re-election inflation)
      if (incumbent) {
        if (!flipped) {
          if ((incumbent.fame || 0) > 70 && ['attorney_general', 'state_treasurer', 'lieutenant_governor'].includes(office.officeKey)) {
            incumbent.statewideStandout = true;
          }
        } else {
          incumbent.party = winner;
          incumbent.isIncumbent = true;
        }
      }
    });

    game.statewideOfficesHistory[targetYear] = results;
    return { year: targetYear, results, byState, flips };
  }

  // ============================================================================
  // PUBLIC MODULE EXPORTS
  // ============================================================================

  return {
    START_MINUTE,
    TIMELINE_END,
    POLL_CLOSE_MINUTES,
    STATE_EV_WEIGHTS,
    CALL_TIERS,
    fnv1a32,
    fnv1aUnit,
    formatSimTime,
    getStateReportingDuration,
    allocateIntegerVotePool,
    generateDropSizes,
    buildRaceDrops,
    findRaceCallTier,
    precomputeRaceCallMinute,
    computeLiveDeskForecast,
    getRaceStateAtMinute,
    buildElectionNightTimeline,
    evaluateElectionNightAt,
    getBroadcastSnapshot: (game) => {
      const en = game?.electionNight;
      if (!en || !en.timeline) return null;
      return evaluateElectionNightAt(en.timeline, en.elapsedMinutes || 0);
    },
    computeStatewideFundingLift,
    resolveStatewideOffices,
  };
});
