// ============================================================================
// Coalition Builder: Party Chair — 7,386-Seat State Legislature Bench Engine
// ============================================================================
// Replaces aggregate state-legislature seat formulas and stateLegStandouts with
// 7,386 individual, persistent districts and politicians:
//   - 5,462 State House districts (49 bicameral lower chambers + NE unicameral)
//   - 1,924 State Senate districts (49 bicameral upper chambers)
//   - Synthetic district lean curves modeling chamber skew & tipping points
//   - Faction pocket clustering enabling organic 3rd-party breakthroughs
//   - Tier 1-4 partial slates targeting top 20%-80% favorable districts
//   - Candidate Quality Persuasion Delta (-10 to +10) & voting systems
// ============================================================================

(function StateLegBenchModule(root) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Canonical Constants, Calendars & Real-World Chamber Parameters
  // --------------------------------------------------------------------------

  const DEFAULT_STATE_HOUSE_TOTALS = {
    AL: 105, AK: 40, AZ: 60, AR: 100, CA: 80, CO: 65, CT: 151, DE: 41, FL: 120, GA: 180,
    HI: 51, ID: 70, IL: 118, IN: 100, IA: 100, KS: 125, KY: 100, LA: 105, ME: 151, MD: 141,
    MA: 160, MI: 110, MN: 134, MS: 122, MO: 163, MT: 100, NE: 49, NV: 42, NH: 400, NJ: 80,
    NM: 70, NY: 150, NC: 120, ND: 94, OH: 99, OK: 101, OR: 60, PA: 203, RI: 75, SC: 124,
    SD: 70, TN: 99, TX: 150, UT: 75, VT: 150, VA: 100, WA: 98, WV: 100, WI: 99, WY: 62,
  };

  const DEFAULT_STATE_SENATE_TOTALS = {
    AL: 35, AK: 20, AZ: 30, AR: 35, CA: 40, CO: 35, CT: 36, DE: 21, FL: 40, GA: 56,
    HI: 25, ID: 35, IL: 59, IN: 50, IA: 50, KS: 40, KY: 38, LA: 39, ME: 35, MD: 47,
    MA: 40, MI: 38, MN: 67, MS: 52, MO: 34, MT: 50, NE: 49, NV: 21, NH: 24, NJ: 40,
    NM: 42, NY: 63, NC: 50, ND: 47, OH: 33, OK: 48, OR: 30, PA: 50, RI: 38, SC: 46,
    SD: 35, TN: 33, TX: 31, UT: 29, VT: 30, VA: 40, WA: 49, WV: 34, WI: 33, WY: 31,
  };

  // States with 4-year State House terms (up on midterm cycles by default)
  const FOUR_YEAR_HOUSE_STATES = ['AL', 'LA', 'MD', 'MS', 'ND'];

  // Staggered / quadrennial / biennial State Senate calendars matching data.js
  const DEFAULT_SENATE_CALENDAR = {
    AZ: { group: 'A', total: 30, presUp: 30, midUp: 30 },
    CT: { group: 'A', total: 36, presUp: 36, midUp: 36 },
    GA: { group: 'A', total: 56, presUp: 56, midUp: 56 },
    ID: { group: 'A', total: 35, presUp: 35, midUp: 35 },
    ME: { group: 'A', total: 35, presUp: 35, midUp: 35 },
    MA: { group: 'A', total: 40, presUp: 40, midUp: 40 },
    NH: { group: 'A', total: 24, presUp: 24, midUp: 24 },
    NY: { group: 'A', total: 63, presUp: 63, midUp: 63 },
    NC: { group: 'A', total: 50, presUp: 50, midUp: 50 },
    RI: { group: 'A', total: 38, presUp: 38, midUp: 38 },
    SD: { group: 'A', total: 35, presUp: 35, midUp: 35 },
    VT: { group: 'A', total: 30, presUp: 30, midUp: 30 },

    AK: { group: 'B', total: 20, presUp: 10, midUp: 10 },
    AR: { group: 'B', total: 35, presUp: 17, midUp: 18 },
    CA: { group: 'B', total: 40, presUp: 20, midUp: 20 },
    CO: { group: 'B', total: 35, presUp: 18, midUp: 17 },
    DE: { group: 'B', total: 21, presUp: 10, midUp: 11 },
    FL: { group: 'B', total: 40, presUp: 20, midUp: 20 },
    HI: { group: 'B', total: 25, presUp: 12, midUp: 13 },
    IL: { group: 'B', total: 59, presUp: 20, midUp: 39 },
    IN: { group: 'B', total: 50, presUp: 25, midUp: 25 },
    IA: { group: 'B', total: 50, presUp: 25, midUp: 25 },
    KY: { group: 'B', total: 38, presUp: 19, midUp: 19 },
    MO: { group: 'B', total: 34, presUp: 17, midUp: 17 },
    MT: { group: 'B', total: 50, presUp: 25, midUp: 25 },
    NE: { group: 'B', total: 49, presUp: 25, midUp: 24, unicameral: true },
    NV: { group: 'B', total: 21, presUp: 10, midUp: 11 },
    ND: { group: 'B', total: 47, presUp: 24, midUp: 23 },
    OH: { group: 'B', total: 33, presUp: 16, midUp: 17 },
    OK: { group: 'B', total: 48, presUp: 24, midUp: 24 },
    OR: { group: 'B', total: 30, presUp: 15, midUp: 15 },
    PA: { group: 'B', total: 50, presUp: 25, midUp: 25 },
    TN: { group: 'B', total: 33, presUp: 16, midUp: 17 },
    TX: { group: 'B', total: 31, presUp: 15, midUp: 16 },
    UT: { group: 'B', total: 29, presUp: 14, midUp: 15 },
    WA: { group: 'B', total: 49, presUp: 24, midUp: 25 },
    WV: { group: 'B', total: 34, presUp: 17, midUp: 17 },
    WI: { group: 'B', total: 33, presUp: 16, midUp: 17 },
    WY: { group: 'B', total: 31, presUp: 15, midUp: 16 },

    KS: { group: 'C', total: 40, presUp: 40, midUp: 0 },
    NM: { group: 'C', total: 42, presUp: 42, midUp: 0 },
    SC: { group: 'C', total: 46, presUp: 46, midUp: 0 },

    AL: { group: 'D', total: 35, presUp: 0, midUp: 35 },
    MD: { group: 'D', total: 47, presUp: 0, midUp: 47 },
    MI: { group: 'D', total: 38, presUp: 0, midUp: 38 },
    MN: { group: 'D', total: 67, presUp: 0, midUp: 67 },
    LA: { group: 'D', total: 39, presUp: 0, midUp: 39 },
    MS: { group: 'D', total: 52, presUp: 0, midUp: 52 },
    NJ: { group: 'D', total: 40, presUp: 0, midUp: 40 },
    VA: { group: 'D', total: 40, presUp: 0, midUp: 40 },
  };

  // Structural chamber median skew (positive = D/people-favorable median, negative = R/heritage-favorable median)
  const STATE_CHAMBER_SKEW = {
    WI: -6.5, NC: -7.0, TX: -6.0, FL: -5.5, OH: -6.5, GA: -4.5, TN: -5.0, IN: -5.0,
    MO: -4.5, SC: -4.0, IA: -3.5, NH: -2.5, MT: -3.0, KS: -3.5, LA: -4.0, AL: -3.5,
    MS: -3.5, UT: -4.5, ID: -3.0, OK: -3.5, KY: -3.5, AR: -3.5, WV: -3.0, SD: -3.0,
    ND: -3.0, WY: -2.5, NE: -2.0, PA: -1.5, MI: -0.5, MN: 0.0, VA: -0.5, CO: 0.5,
    AZ: -1.0, AK: -1.0, IL: 6.5, MD: 6.0, NY: 4.5, MA: 4.0, CT: 3.5, OR: 4.5,
    NJ: 3.0, CA: 3.5, NM: 4.5, WA: 2.5, DE: 3.0, RI: 3.5, HI: 3.0, NV: 4.0,
    VT: 3.0, ME: 2.0,
  };

  // Approximate baseline state D - R margin (in pts) used solely for display leanMargin labels & fallback polls
  const FALLBACK_STATE_MARGINS = {
    AL: -30, AK: -13, AZ: -5, AR: -31, CA: 21, CO: 11, CT: 15, DE: 15, FL: -13, GA: -2,
    HI: 23, ID: -36, IL: 11, IN: -19, IA: -13, KS: -16, KY: -30, LA: -22, ME: 7, MD: 28,
    MA: 25, MI: -1, MN: 4, MS: -23, MO: -18, MT: -20, NE: -21, NV: -3, NH: 3, NJ: 6,
    NM: 6, NY: 13, NC: -3, ND: -36, OH: -11, OK: -34, OR: 14, PA: -2, RI: 14, SC: -18,
    SD: -29, TN: -30, TX: -14, UT: -22, VT: 32, VA: 6, WA: 18, WV: -42, WI: -1, WY: -46,
  };

  // State legislative term limits (max consecutive terms per chamber)
  const STATE_TERM_LIMITS = {
    AZ: { stateHouse: 4, stateSenate: 4 },
    AR: { stateHouse: 6, stateSenate: 4 },
    CA: { stateHouse: 6, stateSenate: 3 },
    CO: { stateHouse: 4, stateSenate: 2 },
    FL: { stateHouse: 4, stateSenate: 2 },
    LA: { stateHouse: 3, stateSenate: 3 },
    ME: { stateHouse: 4, stateSenate: 4 },
    MI: { stateHouse: 3, stateSenate: 2 },
    MO: { stateHouse: 4, stateSenate: 2 },
    MT: { stateHouse: 4, stateSenate: 2 },
    NE: { stateHouse: 2, stateSenate: 2 },
    NV: { stateHouse: 6, stateSenate: 3 },
    OH: { stateHouse: 4, stateSenate: 2 },
    OK: { stateHouse: 6, stateSenate: 3 },
    SD: { stateHouse: 4, stateSenate: 4 },
  };

  const QUALITY_PROBABILITY_CUMULATIVE = [
    [1, 0.020],
    [2, 0.295],
    [3, 0.575],
    [4, 0.795],
    [5, 0.905],
    [6, 0.950],
    [7, 0.975],
    [8, 0.987],
    [9, 0.995],
    [10, 1.000],
  ];

  const QUALITY_PERSUASION_TABLE = {
    1: -10,
    2: -7,
    3: -4,
    4: -2,
    5: 0,
    6: 2,
    7: 4,
    8: 6,
    9: 8,
    10: 10,
  };

  const QUALITY_TIER_LABELS = {
    1: 'Disastrous',
    2: 'Weak',
    3: 'Below Average',
    4: 'Passable',
    5: 'Solid',
    6: 'Strong',
    7: 'Rising Star',
    8: 'Formidable',
    9: 'Generational',
    10: 'Political Phenom',
  };

  const PARTY_FACTION_MAP = {
    people: [
      'dem_liberal_establishment', 'dem_black_voters', 'dem_capital_l_left', 'dem_neo_liberals',
      'dem_abundance', 'dem_bernie_bros', 'dem_faith_based_liberals', 'dem_blue_dog', 'dem_traditional_latin',
    ],
    heritage: [
      'gop_faith_and_flag', 'gop_maga', 'gop_western_mavericks', 'gop_blood_and_soil',
      'gop_suburban_moderates', 'gop_neo_cons', 'gop_paleocons', 'gop_mormons',
      'gop_traditional_farmers', 'gop_market_country_club', 'gop_cubans',
    ],
    independent: [
      'swg_true_centrists', 'swg_hard_hats', 'swg_podcast_bros', 'swg_country_club_centrists',
      'swg_technocrats', 'swg_grillers', 'swg_religious_moderates', 'swg_working_class_latinos', 'swg_girlypops',
    ],
    liberty: ['lib_true_libertarians', 'lib_ancaps', 'lib_classical_liberals'],
    green: ['grn_eco_socialist_vanguard', 'grn_yimby'],
    constitution: ['con_christian_dominionists'],
    socialist: ['soc_socialists', 'soc_communists'],
    other: ['swg_true_centrists', 'swg_grillers', 'swg_technocrats', 'dem_blue_dog', 'gop_western_mavericks'],
  };

  const FACTION_POCKET_LABELS = {
    dem_liberal_establishment: 'Metro Liberal Establishment',
    dem_black_voters: 'Urban Civil Rights Coalition',
    dem_capital_l_left: 'Progressive Activist Corridor',
    dem_neo_liberals: 'Suburban Professional Corridor',
    dem_abundance: 'Urbanist YIMBY / Abundance Hub',
    dem_bernie_bros: 'Campus & Labor Populist Left',
    dem_faith_based_liberals: 'Social Gospel & Community Hub',
    dem_blue_dog: 'Moderate Rural/Small-Town Dems',
    dem_traditional_latin: 'Working-Class Hispanic Corridor',
    gop_faith_and_flag: 'Traditional Conservative Heartland',
    gop_maga: 'Populist Nationalist Base',
    gop_western_mavericks: 'Western Independent-Conservative',
    gop_blood_and_soil: 'Hardline Paleocon Rural Belt',
    gop_suburban_moderates: 'Suburban Center-Right',
    gop_neo_cons: 'Defense & Security Suburbs',
    gop_paleocons: 'Traditionalist Rural Counties',
    gop_mormons: 'Mountain Faith & Family Stronghold',
    gop_traditional_farmers: 'Agri-Heartland Farm Belt',
    gop_market_country_club: 'Chamber-of-Commerce Suburbs',
    gop_cubans: 'Anti-Socialist Metro Coalition',
    swg_true_centrists: 'Independent Swing Suburbs',
    swg_hard_hats: 'Union Trades & Industrial Belt',
    swg_technocrats: 'University & Tech Corridor',
    swg_country_club_centrists: 'Affluent Independent Ring',
    swg_grillers: 'Pragmatic Suburban Independents',
    lib_true_libertarians: 'Libertarian Free-State Cluster',
    lib_classical_liberals: 'Classical Liberal Civic Pocket',
    lib_ancaps: 'Frontier Decentralist Pocket',
    grn_eco_socialist_vanguard: 'Eco-Socialist College Town',
    grn_yimby: 'Urban Transit & Green Housing Hub',
    con_christian_dominionists: 'Covenant Christian Stronghold',
    soc_socialists: 'Democratic Socialist Urban Ward',
    soc_communists: 'Militant Labor & Tenant Pocket',
  };

  // Regional pockets weighted cleanly across U.S. regions without hardcoding small-state overrides
  const REGION_POCKET_AFFINITIES = {
    'New England': ['lib_true_libertarians', 'grn_eco_socialist_vanguard', 'dem_abundance', 'swg_true_centrists', 'gop_suburban_moderates'],
    'The Rockies': ['lib_true_libertarians', 'gop_western_mavericks', 'gop_mormons', 'grn_yimby', 'swg_true_centrists'],
    'Pacific Northwest': ['grn_eco_socialist_vanguard', 'grn_yimby', 'lib_classical_liberals', 'dem_abundance', 'gop_western_mavericks'],
    'Deep South': ['con_christian_dominionists', 'gop_faith_and_flag', 'dem_black_voters', 'gop_maga', 'lib_ancaps'],
    Appalachia: ['gop_maga', 'swg_hard_hats', 'dem_blue_dog', 'con_christian_dominionists', 'gop_paleocons'],
    'Rust Belt': ['swg_hard_hats', 'dem_black_voters', 'gop_maga', 'soc_socialists', 'swg_grillers'],
    'Great Lakes States': ['swg_hard_hats', 'dem_bernie_bros', 'gop_suburban_moderates', 'swg_technocrats', 'soc_socialists'],
    'Prairie States': ['gop_traditional_farmers', 'gop_faith_and_flag', 'lib_ancaps', 'swg_grillers', 'dem_blue_dog'],
  };

  const FALLBACK_MALE_FIRST = [
    'James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua',
    'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan',
    'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
    'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry',
    'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle',
    'Caleb', 'Malcolm', 'Gavin', 'Trevor', 'Nolan', 'Grant', 'Wesley', 'Colin', 'Desmond', 'Rafael',
  ];

  const FALLBACK_FEMALE_FIRST = [
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
    'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Dorothy', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
    'Amy', 'Kathleen', 'Angela', 'Shirley', 'Brenda', 'Emma', 'Anna', 'Pamela', 'Nicole', 'Samantha',
    'Katherine', 'Christine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Maria', 'Catherine', 'Heather', 'Diane',
    'Olivia', 'Julie', 'Joyce', 'Victoria', 'Ruth', 'Virginia', 'Lauren', 'Kelly', 'Christina', 'Joan',
    'Nadia', 'Simone', 'Tessa', 'Camille', 'Claire', 'Elena', 'Miriam', 'Audrey', 'Hannah', 'Valerie',
  ];

  const FALLBACK_SURNAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
    'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
    'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
    'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
    'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
  ];

  // --------------------------------------------------------------------------
  // 2. Deterministic Hash & Helper Utilities
  // --------------------------------------------------------------------------

  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
  const round = (n, places = 2) => {
    const f = 10 ** places;
    return Math.round((Number(n) || 0) * f) / f;
  };
  const pad3 = (n) => String(n).padStart(3, '0');

  function fnvHash(str) {
    let h = 2166136261;
    const text = String(str ?? '');
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967296;
  }

  // Beasley-Springer-Moro rational approximation of inverse standard normal CDF
  function approxProbit(p) {
    const u = clamp(p, 0.0005, 0.9995);
    const t = u < 0.5 ? Math.sqrt(-2 * Math.log(u)) : Math.sqrt(-2 * Math.log(1 - u));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    const z = t - ((c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
    return u < 0.5 ? -z : z;
  }

  function getPartyData() {
    return root.PartyChairData || (typeof window !== 'undefined' ? window.PartyChairData : null) || {};
  }

  function getNamePoolSystem() {
    return root.PartyChairNamePool || (typeof window !== 'undefined' ? window.PartyChairNamePool : null) || null;
  }

  function getQualitySystem() {
    return root.CandidateQualitySystem || (typeof window !== 'undefined' ? window.CandidateQualitySystem : null) || null;
  }

  function resolvePlayerIdentity(game) {
    if (game?.player?.custom) return 'player';
    if (game?.player?.id && game.player.id !== 'player') return game.player.id;
    if (game?.player?.baseTemplateId) return game.player.baseTemplateId;
    return 'people';
  }

  function resolveCanonicalParty(partyId, game) {
    if (!partyId || partyId === 'player') {
      return resolvePlayerIdentity(game);
    }
    return partyId;
  }

  function getQualityPersuasionDelta(quality) {
    const qs = getQualitySystem();
    if (qs && typeof qs.getQualityPersuasionDelta === 'function') {
      return qs.getQualityPersuasionDelta(quality);
    }
    const q = clamp(Math.round(Number(quality) || 5), 1, 10);
    return QUALITY_PERSUASION_TABLE[q] ?? 0;
  }

  function rollCandidateQuality(seedKey, options = {}) {
    const qs = getQualitySystem();
    if (qs && typeof qs.rollCandidateQuality === 'function') {
      return qs.rollCandidateQuality(seedKey, options);
    }
    const age = Number(options.age);
    const tilt = (Number.isFinite(options.tilt) ? options.tilt : 0)
      + (Number.isFinite(age) && age < 45 ? 0.015 : 0)
      - (Number.isFinite(age) && age >= 72 ? 0.03 : 0);
    const roll = clamp(fnvHash(`${seedKey}:quality`) + tilt, 0, 0.999999);
    for (let i = 0; i < QUALITY_PROBABILITY_CUMULATIVE.length; i += 1) {
      if (roll < QUALITY_PROBABILITY_CUMULATIVE[i][1]) {
        return QUALITY_PROBABILITY_CUMULATIVE[i][0];
      }
    }
    return 10;
  }

  function generatePoliticianName(seedKey) {
    const np = getNamePoolSystem();
    if (np && typeof np.generateWeightedPoliticianName === 'function') {
      const generated = np.generateWeightedPoliticianName(seedKey);
      if (generated && generated.fullName) {
        return {
          firstName: generated.firstName,
          lastName: generated.lastName,
          fullName: generated.fullName,
          gender: String(generated.gender || 'male').toLowerCase().startsWith('f') ? 'female' : 'male',
        };
      }
    }
    const isFemale = fnvHash(`${seedKey}:gender`) >= 0.5;
    const firstPool = isFemale ? FALLBACK_FEMALE_FIRST : FALLBACK_MALE_FIRST;
    const fIdx = Math.floor(fnvHash(`${seedKey}:first`) * firstPool.length) % firstPool.length;
    const lIdx = Math.floor(fnvHash(`${seedKey}:last`) * FALLBACK_SURNAMES.length) % FALLBACK_SURNAMES.length;
    const firstName = firstPool[fIdx];
    const lastName = FALLBACK_SURNAMES[lIdx];
    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      gender: isFemale ? 'female' : 'male',
    };
  }

  function generateQualityAlignedRatings(seedKey, quality) {
    const q = clamp(Math.round(Number(quality) || 3), 1, 10);
    const statKeys = [
      'persuadability', 'turnout', 'debate', 'charisma', 'fundraising',
      'fieldcraft', 'experience', 'mediaSavvy', 'regionalStrength',
    ];
    const ratings = {};
    statKeys.forEach((k) => {
      const jitter = Math.round((fnvHash(`${seedKey}:r:${k}`) - 0.5) * 2.4);
      ratings[k] = clamp(q + jitter, 1, 10);
    });
    ratings.corruption = clamp(Math.round(1 + fnvHash(`${seedKey}:r:corruption`) * 6), 1, 10);
    return ratings;
  }

  function factionPartyOf(factionId) {
    if (!factionId) return 'independent';
    if (factionId.startsWith('dem_')) return 'people';
    if (factionId.startsWith('gop_')) return 'heritage';
    if (factionId.startsWith('lib_')) return 'liberty';
    if (factionId.startsWith('grn_')) return 'green';
    if (factionId.startsWith('con_')) return 'constitution';
    if (factionId.startsWith('soc_')) return 'socialist';
    return 'independent';
  }

  function pickFactionForParty(partyId, stateId, districtSeed, preferredFaction = null) {
    if (preferredFaction && factionPartyOf(preferredFaction) === partyId) {
      return preferredFaction;
    }
    const pool = PARTY_FACTION_MAP[partyId] || PARTY_FACTION_MAP.other;
    const idx = Math.floor(fnvHash(`${districtSeed}:fac:${partyId}:${stateId}`) * pool.length) % pool.length;
    return pool[idx];
  }

  function formatLeanLabel(margin) {
    const val = round(margin, 1);
    if (Math.abs(val) < 0.5) return 'EVEN';
    return val > 0 ? `D+${Math.abs(val)}` : `R+${Math.abs(val)}`;
  }

  function getStateRegions(stateId) {
    const states = getPartyData().STATES || [];
    const st = states.find((s) => s.id === stateId);
    if (st && Array.isArray(st.regions) && st.regions.length > 0) return st.regions;
    const fallback = {
      CT: ['New England'], MA: ['New England'], ME: ['New England'], NH: ['New England'], RI: ['New England'], VT: ['New England'],
      AK: ['Pacific Northwest'], ID: ['Pacific Northwest', 'The Rockies'], OR: ['Pacific Northwest'], WA: ['Pacific Northwest'],
      CO: ['The Rockies'], MT: ['The Rockies', 'Prairie States'], NV: ['The Rockies'], NM: ['The Rockies'], UT: ['The Rockies'], WY: ['The Rockies', 'Prairie States'], AZ: ['The Rockies'],
      AL: ['Deep South'], AR: ['Deep South'], FL: ['Deep South'], GA: ['Deep South'], LA: ['Deep South'], MS: ['Deep South'], SC: ['Deep South'], TX: ['Deep South'],
      KY: ['Appalachia'], NC: ['Appalachia'], OH: ['Appalachia', 'Rust Belt'], PA: ['Appalachia', 'Rust Belt'], TN: ['Appalachia'], VA: ['Appalachia'], WV: ['Appalachia', 'Rust Belt'],
      IL: ['Rust Belt', 'Great Lakes States'], IN: ['Rust Belt', 'Great Lakes States'], MI: ['Rust Belt', 'Great Lakes States'], NY: ['Rust Belt', 'Great Lakes States'], WI: ['Rust Belt', 'Great Lakes States'],
      IA: ['Prairie States'], KS: ['Prairie States'], MN: ['Prairie States', 'Great Lakes States'], ND: ['Prairie States'], NE: ['Prairie States'], OK: ['Prairie States'], SD: ['Prairie States'],
    };
    return fallback[stateId] || ['Rust Belt'];
  }

  function getStateBaselineDemMargin(stateId) {
    const states = getPartyData().STATES || [];
    const st = states.find((s) => s.id === stateId);
    if (st && Number.isFinite(st.lean)) {
      // data.js lean: negative = Democratic lean, positive = Republican lean
      return round(-st.lean * 60, 1);
    }
    return FALLBACK_STATE_MARGINS[stateId] ?? 0;
  }

  function resolveStartingSenateSeatCounts(houseCounts, stateLegislatures) {
    const totals = getPartyData().STATE_SENATE_SEAT_TOTALS || DEFAULT_STATE_SENATE_TOTALS;
    const legs = stateLegislatures || getPartyData().VERSION_03_MAPS?.legislatures || getPartyData().VERSION_01_STATE_LEGISLATURES || {};
    const out = {};
    Object.keys(totals).forEach((sid) => {
      if (sid === 'DC') return;
      const total = Number(totals[sid]);
      if (sid === 'NE') {
        out[sid] = { people: 0, heritage: 0, independent: 0, other: total, total, chamber: 'unicameral' };
        return;
      }
      const hRow = houseCounts?.[sid] || {};
      const hDem = Number(hRow.people || 0);
      const hRep = Number(hRow.heritage || 0);
      const hMajSum = hDem + hRep;
      const demShare = hMajSum > 0 ? hDem / hMajSum : 0.5;
      let demSeats = Math.round(total * demShare);
      let repSeats = total - demSeats;
      const maj = Math.floor(total / 2) + 1;
      const upperCtrl = Array.isArray(legs[sid]) ? legs[sid][1] : null;
      if (upperCtrl === 'people' && demSeats < maj) {
        demSeats = Math.min(total, maj + Math.max(1, Math.round(total * 0.04)));
        repSeats = Math.max(0, total - demSeats);
      } else if (upperCtrl === 'heritage' && repSeats < maj) {
        repSeats = Math.min(total, maj + Math.max(1, Math.round(total * 0.04)));
        demSeats = Math.max(0, total - repSeats);
      }
      out[sid] = { people: demSeats, heritage: repSeats, independent: 0, other: 0, total, chamber: 'upper' };
    });
    return out;
  }

  // --------------------------------------------------------------------------
  // 3. Synthetic District Curve Generator
  // --------------------------------------------------------------------------

  function pickDistrictFactionPocket(stateId, chamber, rankIdx, total, leanOffset, seed) {
    const regions = getStateRegions(stateId);
    const pocketRoll = fnvHash(`${seed}:pocket:${stateId}:${chamber}:${rankIdx}`);
    const regionPools = regions.flatMap((r) => REGION_POCKET_AFFINITIES[r] || []);
    const baselineMargin = getStateBaselineDemMargin(stateId);
    const districtMargin = baselineMargin + leanOffset;

    // ~17% of districts hold distinctive minor-party or independent local pockets organically
    if (pocketRoll < 0.17) {
      const minorCandidates = regionPools.filter((fid) => !fid.startsWith('dem_') && !fid.startsWith('gop_'));
      const ideologicallyFiltered = minorCandidates.filter((fid) => {
        if (fid.startsWith('grn_') || fid.startsWith('soc_')) return districtMargin > -8;
        if (fid.startsWith('con_')) return districtMargin < 8;
        return true; // liberty & independent swing can root across wider terrain
      });
      const pool = ideologicallyFiltered.length > 0
        ? ideologicallyFiltered
        : (districtMargin > 5
          ? ['grn_eco_socialist_vanguard', 'grn_yimby', 'soc_socialists', 'swg_technocrats']
          : (districtMargin < -5
            ? ['lib_true_libertarians', 'lib_ancaps', 'con_christian_dominionists']
            : ['lib_true_libertarians', 'lib_classical_liberals', 'swg_true_centrists', 'grn_yimby']));
      const chosen = pool[Math.floor(fnvHash(`${seed}:minor_p:${stateId}:${chamber}:${rankIdx}`) * pool.length) % pool.length];
      return {
        factionPocket: chosen,
        factionPocketParty: factionPartyOf(chosen),
        factionPocketLabel: FACTION_POCKET_LABELS[chosen] || chosen,
        factionPocketBonus: round(9 + fnvHash(`${seed}:pbonus:${stateId}:${rankIdx}`) * 6, 1), // +9.0 to +15.0 pts
      };
    }

    // Major & swing districts cluster authentically by ideological margin & region
    let majorPool;
    if (districtMargin >= 18) {
      majorPool = ['dem_liberal_establishment', 'dem_capital_l_left', 'dem_black_voters', 'dem_bernie_bros', 'dem_abundance'];
    } else if (districtMargin >= 5) {
      majorPool = ['dem_neo_liberals', 'dem_liberal_establishment', 'dem_traditional_latin', 'dem_faith_based_liberals', 'swg_technocrats'];
    } else if (districtMargin > -5) {
      majorPool = ['swg_true_centrists', 'swg_hard_hats', 'swg_grillers', 'dem_blue_dog', 'gop_suburban_moderates', 'swg_country_club_centrists'];
    } else if (districtMargin > -18) {
      majorPool = ['gop_suburban_moderates', 'gop_market_country_club', 'gop_western_mavericks', 'gop_neo_cons', 'gop_cubans', 'swg_hard_hats'];
    } else {
      majorPool = ['gop_maga', 'gop_faith_and_flag', 'gop_traditional_farmers', 'gop_paleocons', 'gop_blood_and_soil', 'gop_mormons'];
    }
    const regionalMatches = majorPool.filter((f) => regionPools.includes(f));
    const effectivePool = regionalMatches.length >= 2 ? regionalMatches : majorPool;
    const chosen = effectivePool[Math.floor(fnvHash(`${seed}:maj_p:${stateId}:${chamber}:${rankIdx}`) * effectivePool.length) % effectivePool.length];
    return {
      factionPocket: chosen,
      factionPocketParty: factionPartyOf(chosen),
      factionPocketLabel: FACTION_POCKET_LABELS[chosen] || chosen,
      factionPocketBonus: round(3.5 + fnvHash(`${seed}:mbonus:${stateId}:${rankIdx}`) * 3.5, 1),
    };
  }

  function generateChamberCurve(stateId, chamber, total, seed, senateCalEntry) {
    const districts = [];
    if (!total || total <= 0) return districts;

    const skew = STATE_CHAMBER_SKEW[stateId] ?? 0;
    const spread = chamber === 'house' ? 20.0 : 18.5;
    const baseStateMargin = getStateBaselineDemMargin(stateId);
    const isNE = stateId === 'NE';
    const isFourYearHouse = chamber === 'house' && !isNE && FOUR_YEAR_HOUSE_STATES.includes(stateId);
    const cal = senateCalEntry || DEFAULT_SENATE_CALENDAR[stateId] || { group: 'B', total, presUp: Math.ceil(total / 2), midUp: Math.floor(total / 2) };

    // Build sorted quantile offsets from safest D (+) down to safest R (-)
    const offsets = [];
    for (let i = 0; i < total; i += 1) {
      const u = (total - 0.5 - i) / total; // near 1.0 -> +probit (Dem), near 0.0 -> -probit (Rep)
      const z = approxProbit(u);
      const jitter = (fnvHash(`${seed}:curve:${stateId}:${chamber}:${i}`) - 0.5) * 3.2;
      const offset = clamp(round(z * spread + skew + jitter, 1), -45, 45);
      offsets.push(offset);
    }
    offsets.sort((a, b) => b - a);

    // Deterministic permutation assigning district numbers 1..N across the curve
    const numberedOrder = Array.from({ length: total }, (_, idx) => ({
      rank: idx,
      sortKey: fnvHash(`${seed}:distnum:${stateId}:${chamber}:${idx}`),
    })).sort((a, b) => a.sortKey - b.sortKey);

    // Allocate Class A / B evenly along the sorted curve for staggered chambers
    const presUpTarget = clamp(Math.round(Number(cal.presUp ?? Math.ceil(total / 2))), 0, total);
    const classAssignment = new Array(total).fill('B');
    if (chamber === 'senate' || isNE) {
      if (cal.group === 'C') {
        classAssignment.fill('A');
      } else if (cal.group === 'D') {
        classAssignment.fill('B');
      } else if (cal.group === 'A') {
        for (let i = 0; i < total; i += 1) classAssignment[i] = i % 2 === 0 ? 'A' : 'B';
      } else {
        // Group B staggered: assign exact presUpTarget indices distributed evenly across the curve
        let picked = 0;
        for (let i = 0; i < total; i += 1) {
          const targetSoFar = Math.round(((i + 1) * presUpTarget) / total);
          if (targetSoFar > picked && picked < presUpTarget) {
            classAssignment[i] = 'A';
            picked += 1;
          }
        }
      }
    }

    const prefix = chamber === 'senate' ? 'SS' : 'SH';
    for (let rank = 0; rank < total; rank += 1) {
      const distNum = numberedOrder[rank].rank + 1;
      const leanOffset = offsets[rank];
      const leanMargin = round(baseStateMargin + leanOffset, 1);
      const pocket = pickDistrictFactionPocket(stateId, chamber, rank, total, leanOffset, seed);

      let calendarGroup = 'A';
      let termYears = 2;
      let senateClass = null;
      if (chamber === 'senate' || isNE) {
        calendarGroup = cal.group || 'B';
        termYears = calendarGroup === 'A' ? 2 : 4;
        senateClass = classAssignment[rank];
      } else if (isFourYearHouse) {
        calendarGroup = 'D';
        termYears = 4;
      }

      districts.push({
        id: `${stateId}-${prefix}-${pad3(distNum)}`,
        stateId,
        chamber: isNE ? 'unicameral' : chamber,
        office: chamber === 'senate' ? 'stateSenate' : 'stateHouse',
        unicameral: isNE,
        nonpartisan: isNE,
        number: distNum,
        label: isNE ? `NE-LD-${pad3(distNum)}` : `${stateId}-${prefix}-${pad3(distNum)}`,
        leanOffset,
        leanMargin,
        leanLabel: isNE ? `NP (${formatLeanLabel(leanMargin)})` : formatLeanLabel(leanMargin),
        factionPocket: pocket.factionPocket,
        factionPocketParty: pocket.factionPocketParty,
        factionPocketLabel: pocket.factionPocketLabel,
        factionPocketBonus: pocket.factionPocketBonus,
        senateClass,
        termYears,
        calendarGroup,
        incumbentId: null,
        openSeat: true,
        lastResult: null,
      });
    }

    // Order array cleanly by district number 1..N while keeping helper sort on leanOffset
    districts.sort((a, b) => a.number - b.number);
    return districts;
  }

  function buildStateLegDistricts(seed = 202801, stateHouseSeatCounts = null, stateSenateSeatCounts = null, stateLegislatures = null) {
    const pData = getPartyData();
    const hCounts = stateHouseSeatCounts || pData.VERSION_05_STATE_HOUSE_SEATS?.states || {};
    const legs = stateLegislatures || pData.VERSION_03_MAPS?.legislatures || pData.VERSION_01_STATE_LEGISLATURES || {};
    const sCounts = stateSenateSeatCounts || resolveStartingSenateSeatCounts(hCounts, legs);
    const senCalendar = pData.BICAMERAL_STATE_SENATE_CALENDAR || DEFAULT_SENATE_CALENDAR;

    const stateIds = Object.keys(DEFAULT_STATE_HOUSE_TOTALS);
    const districtsByState = {};
    let totalHouseDistricts = 0;
    let totalSenateDistricts = 0;

    stateIds.forEach((stateId) => {
      if (stateId === 'DC') return;
      const houseTotal = Number(hCounts?.[stateId]?.total || DEFAULT_STATE_HOUSE_TOTALS[stateId]);
      const senateTotal = stateId === 'NE'
        ? 0
        : Number(sCounts?.[stateId]?.total || pData.STATE_SENATE_SEAT_TOTALS?.[stateId] || DEFAULT_STATE_SENATE_TOTALS[stateId]);

      const houseList = generateChamberCurve(stateId, 'house', houseTotal, seed, stateId === 'NE' ? senCalendar.NE : null);
      const senateList = stateId === 'NE' ? [] : generateChamberCurve(stateId, 'senate', senateTotal, seed, senCalendar[stateId]);

      totalHouseDistricts += houseList.length;
      totalSenateDistricts += senateList.length;

      districtsByState[stateId] = {
        stateId,
        unicameral: stateId === 'NE',
        skew: STATE_CHAMBER_SKEW[stateId] ?? 0,
        house: houseList,
        senate: senateList,
      };
    });

    districtsByState._meta = {
      seed,
      totalHouseDistricts,
      totalSenateDistricts,
      totalDistricts: totalHouseDistricts + totalSenateDistricts,
    };

    return districtsByState;
  }

  // --------------------------------------------------------------------------
  // 4. Initial 7,386-Politician Roster Seeder
  // --------------------------------------------------------------------------

  function buildSeatPartyAssignmentPlan(sortedDistricts, seatRow) {
    const total = sortedDistricts.length;
    const assigned = new Array(total).fill(null);
    if (!seatRow || total === 0) return assigned.fill('independent');

    const skipKeys = new Set(['total', 'chamber', 'sourceStatus', 'slateShares', 'unallocated']);
    const counts = {};
    Object.entries(seatRow).forEach(([k, v]) => {
      if (skipKeys.has(k)) return;
      const n = Math.max(0, Math.round(Number(v) || 0));
      if (n > 0) counts[k] = n;
    });

    // 1. Place explicit minor / independent / other seats on matching pockets or middle curve first
    const minorParties = Object.keys(counts).filter((k) => !['people', 'heritage'].includes(k));
    minorParties.forEach((pid) => {
      let need = counts[pid];
      // Pass A: exact faction pocket match
      for (let i = 0; i < total && need > 0; i += 1) {
        if (assigned[i] === null && sortedDistricts[i].factionPocketParty === pid) {
          assigned[i] = pid;
          need -= 1;
        }
      }
      // Pass B: fallback to neutral/middle slots (or sequential for NE nonpartisan 'other')
      const mid = Math.floor(total / 2);
      for (let offset = 0; offset < total && need > 0; offset += 1) {
        const candidates = offset === 0 ? [mid] : [mid + offset, mid - offset];
        for (const idx of candidates) {
          if (idx >= 0 && idx < total && assigned[idx] === null && need > 0) {
            assigned[idx] = pid;
            need -= 1;
          }
        }
      }
    });

    // 2. Place `people` from safest Democratic (+) end downward
    let demNeed = counts.people || 0;
    for (let i = 0; i < total && demNeed > 0; i += 1) {
      if (assigned[i] === null) {
        assigned[i] = 'people';
        demNeed -= 1;
      }
    }

    // 3. Place `heritage` from safest Republican (-) end upward
    let repNeed = counts.heritage || 0;
    for (let i = total - 1; i >= 0 && repNeed > 0; i -= 1) {
      if (assigned[i] === null) {
        assigned[i] = 'heritage';
        repNeed -= 1;
      }
    }

    // 4. Fill any remaining `unallocated` slots as 'independent' (keeps explicit people/heritage/other 1:1 exact)
    for (let i = 0; i < total; i += 1) {
      if (assigned[i] === null) assigned[i] = 'independent';
    }
    return assigned;
  }

  function createStateLegPolitician(opts) {
    const {
      id,
      seedKey,
      party,
      stateId,
      office,
      district,
      year = 2028,
      priorTerms = 1,
      explicitQuality = null,
      preferredFaction = null,
      wasUnallocated = false,
    } = opts;

    const identity = generatePoliticianName(seedKey);
    const age = 26 + Math.floor(fnvHash(`${seedKey}:age`) * 49); // 26..74
    const quality = Number.isFinite(explicitQuality)
      ? clamp(Math.round(explicitQuality), 1, 10)
      : rollCandidateQuality(seedKey, { age, office, party, stateId });
    const persuasionDelta = getQualityPersuasionDelta(quality);
    const ratings = generateQualityAlignedRatings(seedKey, quality);
    const factionId = pickFactionForParty(
      party === 'other' ? 'independent' : party,
      stateId,
      seedKey,
      preferredFaction || (district.factionPocketParty === party ? district.factionPocket : null)
    );

    const termsServed = {
      stateHouse: office === 'stateHouse' ? priorTerms : 0,
      stateSenate: office === 'stateSenate' ? priorTerms : 0,
      house: 0,
      senate: 0,
      governor: 0,
      president: 0,
    };

    const fame = clamp(
      Math.round(6 + quality * 1.4 + priorTerms * 1.5 + fnvHash(`${seedKey}:fame`) * 6),
      1,
      100
    );
    const popularity = clamp(Math.round(38 + quality * 3.1 + fnvHash(`${seedKey}:pop`) * 10), 20, 88);
    const ambitionScore = fnvHash(`${seedKey}:amb`) + (quality >= 7 ? 0.35 : 0) + (age < 46 ? 0.2 : -0.15);
    const ambition = ambitionScore >= 0.95 ? 'higher_office' : (ambitionScore >= 0.65 ? 'high' : (ambitionScore >= 0.35 ? 'moderate' : 'low'));

    const chamberWord = district.unicameral
      ? 'Unicameral Legislature'
      : (office === 'stateSenate' ? 'State Senate' : 'State House');

    const electedYear = Math.max(2016, year - priorTerms * (district.termYears || 2));
    const careerMilestones = [{
      year: electedYear,
      office,
      districtId: district.id,
      stateId,
      description: `Elected to ${stateId} ${chamberWord} (${district.label || district.id})`,
    }];

    return {
      id,
      name: identity.fullName,
      firstName: identity.firstName,
      lastName: identity.lastName,
      gender: identity.gender,
      party,
      factionId,
      stateId,
      office,
      districtId: district.id,
      chamber: district.chamber,
      age,
      quality,
      persuasionDelta,
      ratings,
      fame,
      popularity,
      termsServed,
      careerMilestones,
      ambition,
      scouted: false,
      active: true,
      wasUnallocated: Boolean(wasUnallocated),
      isIncumbent: true,
    };
  }

  function initializeStateLegBench(game = {}) {
    const pData = getPartyData();
    const seed = game.seed ?? 202801;
    const year = Number(game.year || 2028);

    if (!game.stateHouseSeatCounts && pData.VERSION_05_STATE_HOUSE_SEATS?.states) {
      game.stateHouseSeatCounts = JSON.parse(JSON.stringify(pData.VERSION_05_STATE_HOUSE_SEATS.states));
    }
    if (!game.stateLegislatures) {
      const srcLegs = pData.VERSION_03_MAPS?.legislatures || pData.VERSION_01_STATE_LEGISLATURES || {};
      game.stateLegislatures = Object.fromEntries(Object.entries(srcLegs).map(([k, v]) => [k, [...v]]));
    }
    if (!game.stateSenateSeatCounts) {
      game.stateSenateSeatCounts = resolveStartingSenateSeatCounts(game.stateHouseSeatCounts, game.stateLegislatures);
    }

    const districts = buildStateLegDistricts(
      seed,
      game.stateHouseSeatCounts,
      game.stateSenateSeatCounts,
      game.stateLegislatures
    );

    const roster = {};
    let totalQuality = 0;
    let totalCount = 0;
    let houseCount = 0;
    let senateCount = 0;

    Object.keys(districts).forEach((stateId) => {
      if (stateId === '_meta' || stateId === 'DC') return;
      const entry = districts[stateId];
      const chambers = [
        { list: entry.house, row: game.stateHouseSeatCounts?.[stateId], office: 'stateHouse' },
        { list: entry.senate, row: game.stateSenateSeatCounts?.[stateId], office: 'stateSenate' },
      ];

      chambers.forEach(({ list, row, office }) => {
        if (!Array.isArray(list) || list.length === 0) return;
        const sortedByLean = list.slice().sort((a, b) => b.leanOffset - a.leanOffset);
        const partyPlan = buildSeatPartyAssignmentPlan(sortedByLean, row);
        const explicitCount = row
          ? Object.entries(row)
            .filter(([k]) => !['total', 'chamber', 'sourceStatus', 'slateShares', 'unallocated'].includes(k))
            .reduce((s, [, v]) => s + Math.max(0, Math.round(Number(v) || 0)), 0)
          : sortedByLean.length;
        const hasUnallocated = row && Number(row.unallocated || 0) > 0 && explicitCount < sortedByLean.length;

        sortedByLean.forEach((dist, idx) => {
          const party = partyPlan[idx] || 'independent';
          const polId = `sl_${dist.id}_${year}_0`;
          const rawPrior = 1 + Math.floor(fnvHash(`${seed}:terms:${dist.id}`) * 4);
          const termCap = STATE_TERM_LIMITS[stateId]?.[office];
          const priorTerms = termCap ? Math.min(rawPrior, Math.max(1, termCap - 1)) : rawPrior;

          const pol = createStateLegPolitician({
            id: polId,
            seedKey: `${seed}:init:${dist.id}`,
            party,
            stateId,
            office,
            district: dist,
            year,
            priorTerms,
            wasUnallocated: hasUnallocated && party === 'independent' && !(Number(row?.independent || 0) > 0),
          });

          roster[polId] = pol;
          dist.incumbentId = polId;
          dist.openSeat = false;

          totalQuality += pol.quality;
          totalCount += 1;
          if (office === 'stateHouse') houseCount += 1;
          else senateCount += 1;
        });
      });
    });

    game.stateLegDistricts = districts;
    game.stateLegRoster = roster;
    game.stateLegBenchCounter = (game.stateLegBenchCounter || 0);
    game.stateLegBenchInitialized = true;
    game.stateLegBenchStats = {
      houseSeats: houseCount,
      senateSeats: senateCount,
      totalSeats: totalCount,
      meanQuality: totalCount > 0 ? round(totalQuality / totalCount, 3) : 0,
    };

    return game;
  }

  // --------------------------------------------------------------------------
  // 5. Seat-by-Seat Election Night Resolver
  // --------------------------------------------------------------------------

  function isDistrictUpInYear(district, year, options = {}) {
    if (options.forceAllSeatsUp) return true;
    if (!district) return false;
    const yr = Number(year || 2028);
    const isPresYear = (yr % 4 === 0);

    if (district.unicameral || district.chamber === 'unicameral') {
      return isPresYear ? district.senateClass === 'A' : district.senateClass === 'B';
    }
    if (district.office === 'stateHouse' || district.chamber === 'house') {
      if (FOUR_YEAR_HOUSE_STATES.includes(district.stateId)) {
        // 4-year lower chambers resolve on midterm quadrennial cycle
        return !isPresYear;
      }
      return true;
    }
    // State Senate groups A / B / C / D
    const grp = district.calendarGroup || 'B';
    if (grp === 'A') return true;
    if (grp === 'C') return isPresYear;
    if (grp === 'D') return !isPresYear;
    return isPresYear ? district.senateClass === 'A' : district.senateClass === 'B';
  }

  function resolveVotingSystemInfo(game, stateId) {
    const rec = game?.stateElectoralSystems?.[stateId] || {
      allRaces: stateId === 'AK' ? 'rcv' : 'plurality',
      legislative: 'plurality',
    };
    const allRaces = String(rec.allRaces || 'plurality').toLowerCase();
    const legislative = String(rec.legislative || 'plurality').toLowerCase();
    const isProp = ['proportional', 'open_list_proportional', 'mmp', 'pr', 'proportional_representation'].includes(legislative)
      || ['proportional', 'open_list_proportional', 'mmp', 'pr', 'proportional_representation'].includes(allRaces)
      || Boolean(game?.partySystems?.coalitionSystem?.mmpActive);
    const isRcv = ['rcv', 'ranked_choice', 'ranked-choice', 'irv'].includes(legislative)
      || ['rcv', 'ranked_choice', 'ranked-choice', 'irv'].includes(allRaces);
    const isApproval = ['approval', 'approval_voting'].includes(legislative)
      || ['approval', 'approval_voting'].includes(allRaces);

    if (isProp) return { effectiveSystem: legislative.includes('open') ? 'open_list_proportional' : 'proportional', isAntiSpoiler: true, isProportional: true };
    if (isApproval) return { effectiveSystem: 'approval', isAntiSpoiler: true, isProportional: false };
    if (isRcv) return { effectiveSystem: 'rcv', isAntiSpoiler: true, isProportional: false };
    return { effectiveSystem: 'plurality', isAntiSpoiler: true, isProportional: false };
  }

  function defaultStateVoteShares(game, stateId, options = {}) {
    if (typeof options.computeStateShares === 'function') {
      const custom = options.computeStateShares(game, stateId);
      if (custom && Object.keys(custom).length > 0) return { ...custom };
    }
    const existing = game?.lastElection?.stateLegislatureShares?.[stateId]
      || game?.stateHouseSeatCounts?.[stateId]?.slateShares;
    if (existing && Object.keys(existing).length > 0) return { ...existing };

    const env = Number(game?.nationalEnvironment || 0);
    const margin = getStateBaselineDemMargin(stateId) + env * 0.7;
    const dem = clamp(50 + margin / 2, 12, 88);
    const rep = clamp(50 - margin / 2, 12, 88);
    const shares = { people: round(dem * 0.96, 2), heritage: round(rep * 0.96, 2) };

    const ba = game?.ballotAccess || {};
    const playerId = resolvePlayerIdentity(game);
    const minorIds = ['liberty', 'green', 'constitution', 'socialist', ...(playerId === 'player' ? ['player'] : [])];
    minorIds.forEach((pid) => {
      const hasAccess = ba?.[pid]?.leg?.[stateId]
        || ba?.[pid]?.house?.[stateId]
        || (pid === playerId && (game?.contestedStateLegSlates?.[stateId] || game?.contestedStateHouseSlates?.[stateId] || game?.contestedStateSenateSlates?.[stateId]));
      if (hasAccess) {
        const tier = Number(game?.partyTiers?.[pid] ?? (pid === playerId ? game?.partyTiers?.player : 1) ?? 1);
        shares[pid] = round(2 + tier * 2.2, 2);
      }
    });
    return shares;
  }

  function resolvePartyChamberSlateTier(game, partyId, stateId, chamber, options = {}) {
    if (options.slateTiers?.[stateId]?.[chamber]?.[partyId] !== undefined) {
      return clamp(Math.round(options.slateTiers[stateId][chamber][partyId]), 0, 5);
    }
    if (options.slateTiers?.[partyId] !== undefined) {
      return clamp(Math.round(options.slateTiers[partyId]), 0, 5);
    }
    if (partyId === 'people' || partyId === 'heritage') return 5;
    if (partyId === 'other' && stateId === 'NE') return 5;

    const playerId = resolvePlayerIdentity(game);
    if (partyId === playerId || partyId === 'player') {
      const isHouse = chamber !== 'senate';
      const explicitMap = isHouse ? game?.contestedStateHouseSlates : game?.contestedStateSenateSlates;
      if (explicitMap && explicitMap[stateId] !== undefined) {
        return clamp(Math.round(explicitMap[stateId]), 0, 5);
      }
      if (game?.contestedStateLegSlates?.[stateId]) return 5;
      const pTier = Number(game?.partyTiers?.[playerId] ?? game?.partyTiers?.player ?? 1);
      if (pTier >= 5) return 5;
      if (game?.ballotAccess?.[partyId]?.leg?.[stateId]) return Math.max(1, clamp(pTier, 1, 4));
      return 0;
    }

    if (partyId === 'independent') {
      return 2; // Independents selectively contest favorable open/pocket districts
    }

    const tier = Number(game?.partyTiers?.[partyId] ?? 1);
    if (tier >= 5) return 5;
    if (game?.ballotAccess && game.ballotAccess[partyId]?.leg && !game.ballotAccess[partyId].leg[stateId]) {
      return 0;
    }
    return clamp(Math.max(1, tier), 1, 5);
  }

  function districtDesirabilityScoreForParty(district, partyId, leadingFactionId, roster) {
    let score = 0;
    const inc = district.incumbentId ? roster[district.incumbentId] : null;
    if (inc && inc.party === partyId) score += 1000;
    if (district.factionPocketParty === partyId) score += 350;
    if (leadingFactionId && district.factionPocket === leadingFactionId) score += 200;
    if (district.openSeat) score += 45;

    const lean = Number(district.leanOffset || 0);
    if (partyId === 'people' || partyId === 'green' || partyId === 'socialist') {
      score += lean * 2;
    } else if (partyId === 'heritage' || partyId === 'constitution') {
      score += (-lean) * 2;
    } else if (partyId === 'liberty') {
      score += Math.max(-20, -lean * 0.6) + (Math.abs(lean) < 10 ? 25 : 0);
    } else {
      // independent / other / custom centrist: competitive middle & pocket-heavy
      score += Math.max(0, 30 - Math.abs(lean) * 1.4);
    }
    return score;
  }

  function selectPartialSlateDistrictIds(upDistricts, partyId, tier, game, roster) {
    if (tier <= 0 || upDistricts.length === 0) return new Set();
    if (tier >= 5) return new Set(upDistricts.map((d) => d.id));

    const targetRatio = clamp(tier, 1, 4) * 0.20; // Tiers 1..4 => top 20%, 40%, 60%, 80%
    const targetCount = Math.min(upDistricts.length, Math.max(1, Math.ceil(upDistricts.length * targetRatio)));
    const leadingFaction = game?.leadingFactionByParty?.[partyId] || null;

    const ranked = upDistricts
      .map((d) => ({ id: d.id, score: districtDesirabilityScoreForParty(d, partyId, leadingFaction, roster) }))
      .sort((a, b) => b.score - a.score);

    const selected = new Set(ranked.slice(0, targetCount).map((r) => r.id));
    // Never abandon an incumbent defending their own district
    upDistricts.forEach((d) => {
      const inc = d.incumbentId ? roster[d.incumbentId] : null;
      if (inc && inc.party === partyId) selected.add(d.id);
    });
    return selected;
  }

  function shouldIncumbentRetire(incumbent, district, year, seed) {
    if (!incumbent || !incumbent.active) return true;
    const office = district.office || 'stateHouse';
    const terms = Number(incumbent.termsServed?.[office] || 0);
    const termCap = STATE_TERM_LIMITS[district.stateId]?.[office];
    if (termCap && terms >= termCap) return true;

    let retireProb = 0.025;
    if (incumbent.age >= 74) retireProb = 0.36;
    else if (incumbent.age >= 68) retireProb = 0.18;
    else if (incumbent.age >= 60) retireProb = 0.06;
    if (terms >= 8) retireProb += 0.10;

    return fnvHash(`${seed}:retire:${incumbent.id}:${year}`) < retireProb;
  }

  function getFactionWing(partyId) {
    if (['people', 'green', 'socialist'].includes(partyId)) return 'left';
    if (['heritage', 'constitution'].includes(partyId)) return 'right';
    if (partyId === 'liberty') return 'libertarian';
    return 'center';
  }

  function computeCandidateLeanShift(partyId, leanOffset) {
    if (partyId === 'people') return leanOffset * 0.5;
    if (partyId === 'heritage') return -leanOffset * 0.5;
    if (partyId === 'green' || partyId === 'socialist') return clamp(leanOffset * 0.25, -10, 12);
    if (partyId === 'constitution') return clamp(-leanOffset * 0.25, -10, 12);
    if (partyId === 'liberty') return clamp(-leanOffset * 0.12, -6, 6);
    return 0;
  }

  function computePocketBoost(district, candidate, game) {
    if (!district?.factionPocket) return 0;
    const candParty = candidate.party;
    const bonus = Number(district.factionPocketBonus || 6);
    if (candidate.factionId && candidate.factionId === district.factionPocket) {
      return bonus;
    }
    if (district.factionPocketParty === candParty) {
      return round(bonus * 0.85, 2);
    }
    const partyLeading = game?.leadingFactionByParty?.[candParty];
    if (partyLeading && partyLeading === district.factionPocket) {
      return bonus;
    }
    // Same ideological wing gets mild affinity bonus
    if (getFactionWing(candParty) === getFactionWing(district.factionPocketParty)) {
      return round(bonus * 0.2, 2);
    }
    return 0;
  }

  function resolveSingleDistrictContest(district, candidates, stateShares, electoralSys, game, year, seed, options = {}) {
    if (candidates.length === 0) return null;
    if (candidates.length === 1) {
      const only = candidates[0];
      return {
        winner: only,
        margin: 100,
        votingSystem: electoralSys.effectiveSystem,
        standings: [{ party: only.party, candidateId: only.id, name: only.name, quality: only.quality, persuasionDelta: only.persuasionDelta, voteShare: 100 }],
      };
    }

    const noiseAmp = Number.isFinite(options.noiseAmplitude) ? options.noiseAmplitude : 1.5;
    const isApproval = electoralSys.effectiveSystem === 'approval';

    const rawEntries = candidates.map((cand) => {
      const p = cand.party;
      const baseShare = Number(stateShares[p] ?? (p === 'independent' ? 4 : 3));
      const leanShift = computeCandidateLeanShift(p, district.leanOffset);
      const pocketBoost = computePocketBoost(district, cand, game);
      const qualDelta = getQualityPersuasionDelta(cand.quality);
      const isDefendingInc = district.incumbentId && cand.id === district.incumbentId && !district.openSeat;
      const priorTerms = Number(cand.termsServed?.[district.office] || 0);
      const incBonus = isDefendingInc ? round(2.0 + Math.min(2.0, priorTerms * 0.4), 2) : 0;
      const noise = noiseAmp > 0 ? (fnvHash(`${seed}:vnoise:${district.id}:${year}:${p}`) - 0.5) * 2 * noiseAmp : 0;

      // Approval voting favors broad-appeal / moderate / higher-quality consensus candidates
      const approvalBonus = isApproval
        ? (getFactionWing(p) === 'center' || p === 'liberty' ? 4.0 : 0) + Math.max(0, qualDelta * 0.25)
        : 0;

      const rawScore = Math.max(0.5, baseShare + leanShift + pocketBoost + qualDelta + incBonus + approvalBonus + noise);
      return {
        candidate: cand,
        party: p,
        rawScore,
        qualDelta,
        pocketBoost,
        incBonus,
      };
    });

    const rawTotal = rawEntries.reduce((s, e) => s + e.rawScore, 0) || 1;
    let pool = rawEntries.map((e) => ({
      ...e,
      voteShare: round((e.rawScore / rawTotal) * 100, 2),
      firstRoundShare: round((e.rawScore / rawTotal) * 100, 2),
    })).sort((a, b) => b.voteShare - a.voteShare);

    // Instant-Runoff / RCV elimination when top candidate < 50%
    const initialStandings = pool.map((e) => ({ ...e }));
    if (electoralSys.effectiveSystem === 'rcv' && pool.length > 2 && pool[0].voteShare <= 50) {
      let active = pool.map((e) => ({ ...e }));
      while (active.length > 2 && active[0].voteShare <= 50) {
        const eliminated = active.pop();
        const elimWing = getFactionWing(eliminated.party);
        const weights = active.map((rem) => {
          const remWing = getFactionWing(rem.party);
          let affinity = 1.0;
          if (remWing === elimWing) affinity = 3.5;
          else if ((elimWing === 'right' && remWing === 'libertarian') || (elimWing === 'libertarian' && remWing === 'right')) affinity = 2.6;
          else if (remWing === 'center' || elimWing === 'center' || elimWing === 'libertarian') affinity = 1.6;
          return affinity;
        });
        const wSum = weights.reduce((s, w) => s + w, 0) || 1;
        // 75% transfer rate (25% exhausted ballots)
        const transferVotes = eliminated.voteShare * 0.75;
        active.forEach((rem, idx) => {
          rem.voteShare = round(rem.voteShare + transferVotes * (weights[idx] / wSum), 2);
        });
        active.sort((a, b) => b.voteShare - a.voteShare);
      }
      const normSum = active.reduce((s, e) => s + e.voteShare, 0) || 100;
      active.forEach((e) => { e.voteShare = round((e.voteShare / normSum) * 100, 2); });
      pool = active;
    }

    const winnerEntry = pool[0];
    const runnerUpEntry = pool[1] || { voteShare: 0 };
    const margin = round(winnerEntry.voteShare - runnerUpEntry.voteShare, 2);

    const standings = initialStandings.map((e) => ({
      party: e.party,
      candidateId: e.candidate.id,
      name: e.candidate.name,
      factionId: e.candidate.factionId,
      quality: e.candidate.quality,
      persuasionDelta: e.qualDelta,
      pocketBoost: e.pocketBoost,
      incumbencyBonus: e.incBonus,
      firstRoundShare: e.firstRoundShare,
      voteShare: (pool.find((x) => x.candidate.id === e.candidate.id)?.voteShare ?? e.firstRoundShare),
    }));

    return {
      winner: winnerEntry.candidate,
      margin,
      votingSystem: electoralSys.effectiveSystem,
      standings,
    };
  }

  function applyProportionalChamberTopUp(districtOutcomes, upDistricts, roster) {
    if (!districtOutcomes || districtOutcomes.length < 4) return;
    // Aggregate raw first-round vote totals across all seats up in this chamber
    const partyTotals = {};
    let grandTotal = 0;
    districtOutcomes.forEach((o) => {
      (o.result?.standings || []).forEach((st) => {
        const v = Math.max(0, Number(st.firstRoundShare || st.voteShare || 0));
        partyTotals[st.party] = (partyTotals[st.party] || 0) + v;
        grandTotal += v;
      });
    });
    if (grandTotal <= 0) return;

    const threshold = 4.0;
    const totalSeats = districtOutcomes.length;
    const currentWins = {};
    districtOutcomes.forEach((o) => {
      const p = o.result.winner.party;
      currentWins[p] = (currentWins[p] || 0) + 1;
    });

    const targetSeats = {};
    let targetSum = 0;
    const qualifying = Object.entries(partyTotals)
      .map(([party, votes]) => ({ party, pct: (votes / grandTotal) * 100 }))
      .filter((x) => x.pct >= threshold);
    const qualPctSum = qualifying.reduce((s, x) => s + x.pct, 0) || 100;
    qualifying.forEach((x) => {
      const exact = (x.pct / qualPctSum) * totalSeats;
      targetSeats[x.party] = Math.floor(exact);
      targetSum += targetSeats[x.party];
    });
    const sortedRem = qualifying
      .map((x) => ({ party: x.party, rem: ((x.pct / qualPctSum) * totalSeats) - targetSeats[x.party] }))
      .sort((a, b) => b.rem - a.rem);
    for (let i = 0; targetSum < totalSeats && i < sortedRem.length; i += 1) {
      targetSeats[sortedRem[i].party] += 1;
      targetSum += 1;
    }

    // Reassign borderline districts where an under-represented party fielded a strong candidate
    Object.entries(targetSeats).forEach(([underParty, goal]) => {
      while ((currentWins[underParty] || 0) < goal) {
        let bestSwap = null;
        let bestCost = Infinity;
        districtOutcomes.forEach((o) => {
          const curWinParty = o.result.winner.party;
          if (curWinParty === underParty) return;
          if ((currentWins[curWinParty] || 0) <= (targetSeats[curWinParty] || 0)) return;
          const candRow = o.result.standings.find((s) => s.party === underParty);
          if (!candRow) return;
          const deficit = (o.result.standings[0]?.voteShare || 50) - candRow.voteShare;
          if (deficit < bestCost) {
            bestCost = deficit;
            bestSwap = { outcome: o, candRow, curWinParty };
          }
        });
        if (!bestSwap) break;
        const { outcome, candRow, curWinParty } = bestSwap;
        const nextWinner = roster[candRow.candidateId] || outcome.candidateMap[underParty];
        if (!nextWinner) break;
        outcome.result.winner = nextWinner;
        outcome.result.proportionalTopUp = true;
        currentWins[curWinParty] -= 1;
        currentWins[underParty] = (currentWins[underParty] || 0) + 1;
      }
    });
  }

  function countChamberSeatsFromDistricts(districtsList, roster) {
    const counts = { people: 0, heritage: 0, independent: 0, other: 0, unallocated: 0, total: districtsList.length };
    districtsList.forEach((d) => {
      const pol = d.incumbentId ? roster[d.incumbentId] : null;
      const party = pol?.party || 'independent';
      if (['people', 'heritage', 'independent'].includes(party)) {
        counts[party] += 1;
      } else {
        counts[party] = (counts[party] || 0) + 1;
        counts.other += 1;
      }
    });
    return counts;
  }

  function resolveChamberControl(counts, prevControl = 'heritage') {
    const total = counts.total || 0;
    if (total === 0) return prevControl;
    const entries = Object.entries(counts)
      .filter(([k]) => !['total', 'chamber', 'sourceStatus', 'slateShares', 'unallocated', 'other'].includes(k))
      .sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return prevControl;
    if (entries.length >= 2 && entries[0][1] === entries[1][1]) {
      return prevControl || 'split';
    }
    return entries[0][0];
  }

  function resolveStateLegElections(game = {}, stateVoteSharesByState = null, options = {}) {
    if (!game.stateLegDistricts || !game.stateLegRoster || !game.stateLegBenchInitialized) {
      initializeStateLegBench(game);
    }

    const seed = game.seed ?? 202801;
    const year = Number(options.year ?? game.year ?? 2028);
    const districts = game.stateLegDistricts;
    const roster = game.stateLegRoster;
    const playerId = resolvePlayerIdentity(game);

    const nextHouseCounts = {};
    const nextSenateCounts = {};
    const nextLegislatures = { ...(game.stateLegislatures || {}) };
    const byStateSummary = {};
    const districtsById = {};

    let seatsUpCount = 0;
    let holdoverCount = 0;
    let flipsCount = 0;
    let retirementsCount = 0;

    const stateIds = Object.keys(districts).filter((k) => k !== '_meta' && k !== 'DC');
    stateIds.forEach((stateId) => {
      const stEntry = districts[stateId];
      const rawShares = stateVoteSharesByState?.[stateId] || defaultStateVoteShares(game, stateId, options);
      const stateShares = {};
      Object.entries(rawShares).forEach(([k, v]) => {
        const canon = resolveCanonicalParty(k, game);
        stateShares[canon] = (stateShares[canon] || 0) + Math.max(0, Number(v || 0));
      });
      if (stateShares.people === undefined) stateShares.people = 48;
      if (stateShares.heritage === undefined) stateShares.heritage = 48;

      const elecSys = resolveVotingSystemInfo(game, stateId);
      const chambers = stateId === 'NE'
        ? [{ key: 'house', office: 'stateHouse', list: stEntry.house }]
        : [
          { key: 'house', office: 'stateHouse', list: stEntry.house },
          { key: 'senate', office: 'stateSenate', list: stEntry.senate },
        ];

      const stateRes = { stateId, unicameral: stateId === 'NE', seatsUp: 0, holdovers: 0, flips: 0, retirements: 0 };

      chambers.forEach(({ key, office, list }) => {
        if (!Array.isArray(list) || list.length === 0) return;

        const upDistricts = [];
        const holdoverDistricts = [];
        list.forEach((d) => {
          if (isDistrictUpInYear(d, year, options)) upDistricts.push(d);
          else holdoverDistricts.push(d);
        });

        // 1. Holdovers: age +2, retain incumbent
        holdoverDistricts.forEach((d) => {
          holdoverCount += 1;
          stateRes.holdovers += 1;
          const inc = d.incumbentId ? roster[d.incumbentId] : null;
          if (inc) {
            inc.age += 2;
            inc.active = true;
          }
          const resultObj = {
            districtId: d.id,
            stateId,
            chamber: d.chamber,
            office,
            year,
            heldOver: true,
            openSeat: Boolean(d.openSeat),
            flipped: false,
            winnerId: inc?.id || null,
            winnerParty: inc?.party || null,
            winnerName: inc?.name || null,
            winnerQuality: inc?.quality || null,
            margin: d.lastResult?.margin ?? null,
            votingSystem: elecSys.effectiveSystem,
            candidates: d.lastResult?.candidates || (inc ? [{ party: inc.party, candidateId: inc.id, name: inc.name, quality: inc.quality, persuasionDelta: inc.persuasionDelta }] : []),
          };
          d.lastResult = resultObj;
          districtsById[d.id] = resultObj;
        });

        // 2. Process natural retirements & term limits for seats up this cycle
        upDistricts.forEach((d) => {
          const inc = d.incumbentId ? roster[d.incumbentId] : null;
          if (inc && shouldIncumbentRetire(inc, d, year, seed)) {
            inc.active = false;
            inc.retiredYear = year;
            inc.isIncumbent = false;
            d.prevIncumbentParty = inc.party;
            d.incumbentId = null;
            d.openSeat = true;
            retirementsCount += 1;
            stateRes.retirements += 1;
          } else if (!inc) {
            d.openSeat = true;
          }
        });

        // 3. Determine contesting parties & Tier 1-4 partial-slate district targets
        const contestingParties = Object.keys(stateShares).filter((pid) => Number(stateShares[pid]) > 0);
        if (stateId === 'NE' && !contestingParties.includes('other')) contestingParties.push('other');

        const contestedSetsByParty = {};
        contestingParties.forEach((pid) => {
          const tier = resolvePartyChamberSlateTier(game, pid, stateId, key, options);
          if (tier > 0) {
            contestedSetsByParty[pid] = selectPartialSlateDistrictIds(upDistricts, pid, tier, game, roster);
          }
        });

        // 4. Resolve each district up this cycle individually
        const chamberOutcomes = [];
        upDistricts.forEach((d) => {
          seatsUpCount += 1;
          stateRes.seatsUp += 1;
          const prevInc = d.incumbentId ? roster[d.incumbentId] : null;
          const prevParty = prevInc?.party || d.prevIncumbentParty || null;

          const candidates = [];
          const candidateMap = {};
          const overrides = options.preSelectedCandidates?.[d.id] || {};

          // Also include override parties even if absent from base shares
          const seatParties = Array.from(new Set([
            ...Object.keys(contestedSetsByParty).filter((pid) => contestedSetsByParty[pid].has(d.id)),
            ...Object.keys(overrides),
            ...(prevInc ? [prevInc.party] : []),
          ]));

          seatParties.forEach((pid) => {
            if (pid === 'other' && stateId !== 'NE' && !overrides[pid] && !(prevInc && prevInc.party === 'other')) {
              return;
            }
            let cand = null;
            if (overrides[pid]) {
              const ov = overrides[pid];
              if (ov && typeof ov === 'object' && ov.id && roster[ov.id]) {
                cand = roster[ov.id];
              } else if (ov && typeof ov === 'object') {
                const newId = ov.id || `sl_${d.id}_${year}_${pid}_${++game.stateLegBenchCounter}`;
                cand = roster[newId] || createStateLegPolitician({
                  id: newId,
                  seedKey: `${seed}:ov:${d.id}:${year}:${pid}`,
                  party: pid,
                  stateId,
                  office,
                  district: d,
                  year,
                  priorTerms: 0,
                  explicitQuality: ov.quality,
                  preferredFaction: ov.factionId,
                });
                if (ov.name) cand.name = ov.name;
                roster[cand.id] = cand;
              }
            } else if (prevInc && prevInc.party === pid && !d.openSeat) {
              cand = prevInc;
            } else {
              game.stateLegBenchCounter = (game.stateLegBenchCounter || 0) + 1;
              const newId = `sl_${d.id}_${year}_${pid}_${game.stateLegBenchCounter}`;
              cand = createStateLegPolitician({
                id: newId,
                seedKey: `${seed}:cand:${d.id}:${year}:${pid}:${game.stateLegBenchCounter}`,
                party: pid,
                stateId,
                office,
                district: d,
                year,
                priorTerms: 0,
              });
              cand.isIncumbent = false;
              roster[newId] = cand;
            }

            if (cand) {
              candidates.push(cand);
              candidateMap[pid] = cand;
            }
          });

          const res = resolveSingleDistrictContest(d, candidates, stateShares, elecSys, game, year, seed, options);
          if (res) {
            chamberOutcomes.push({ district: d, result: res, prevParty, candidateMap, candidates });
          }
        });

        // Apply chamber-level proportional top-up when state uses proportional representation
        if (elecSys.isProportional && stateId !== 'NE') {
          applyProportionalChamberTopUp(chamberOutcomes, upDistricts, roster);
        }

        // 5. Commit winners, aging, termsServed, milestones & retire/archive losers
        chamberOutcomes.forEach(({ district: d, result, prevParty, candidates }) => {
          const winner = result.winner;
          const flipped = Boolean(prevParty && prevParty !== winner.party);
          if (flipped) {
            flipsCount += 1;
            stateRes.flips += 1;
          }

          // Update losers: non-incumbents stay archived inactive unless high-quality comeback star
          candidates.forEach((cand) => {
            if (cand.id === winner.id) return;
            cand.isIncumbent = false;
            if (cand.id === d.incumbentId) {
              cand.active = false;
              cand.defeatedYear = year;
            } else if (cand.quality < 7) {
              cand.active = false;
            } else {
              // Q7+ defeated challenger stays tracked in roster for potential comeback / scouting
              cand.active = false;
              cand.defeatedYear = year;
            }
          });

          // Advance winner record
          const prevWinnerId = d.incumbentId;
          winner.party = winner.party;
          winner.office = office;
          winner.districtId = d.id;
          winner.chamber = d.chamber;
          winner.isIncumbent = true;
          winner.active = true;
          if (prevWinnerId !== winner.id) {
            winner.age = winner.age + (winner.termsServed[office] > 0 ? 2 : 0);
          } else {
            winner.age += 2;
          }
          winner.termsServed = {
            stateHouse: 0,
            stateSenate: 0,
            house: 0,
            senate: 0,
            governor: 0,
            president: 0,
            ...(winner.termsServed || {}),
          };
          winner.termsServed[office] = (winner.termsServed[office] || 0) + 1;
          winner.fame = clamp(winner.fame + (flipped ? 6 : 2) + (winner.quality >= 7 ? 2 : 0), 1, 100);
          winner.careerMilestones = [
            ...(winner.careerMilestones || []),
            {
              year,
              office,
              districtId: d.id,
              stateId,
              description: `${flipped ? 'Flipped' : (prevWinnerId === winner.id ? 'Re-elected to' : 'Won open')} ${d.label || d.id} (${winner.party}, ${result.margin > 0 ? `+${result.margin}%` : 'unopposed'})`,
            },
          ];

          d.incumbentId = winner.id;
          d.openSeat = false;
          delete d.prevIncumbentParty;

          const resultObj = {
            districtId: d.id,
            stateId,
            chamber: d.chamber,
            office,
            year,
            heldOver: false,
            openSeat: !prevParty || Boolean(d.openSeat),
            flipped,
            prevParty,
            winnerId: winner.id,
            winnerParty: winner.party,
            winnerName: winner.name,
            winnerQuality: winner.quality,
            margin: result.margin,
            votingSystem: result.votingSystem,
            proportionalTopUp: Boolean(result.proportionalTopUp),
            candidates: result.standings,
          };
          d.lastResult = resultObj;
          districtsById[d.id] = resultObj;
        });

        // 6. Roll up chamber seat counts directly from districts
        const counted = countChamberSeatsFromDistricts(list, roster);
        if (key === 'house') {
          counted.chamber = stateId === 'NE' ? 'unicameral' : 'lower';
          counted.slateShares = { ...stateShares };
          nextHouseCounts[stateId] = counted;
        } else {
          counted.chamber = 'upper';
          nextSenateCounts[stateId] = counted;
        }
      });

      if (stateId === 'NE') {
        const neCount = nextHouseCounts.NE?.total || 49;
        nextSenateCounts.NE = { people: 0, heritage: 0, independent: 0, other: neCount, total: neCount, chamber: 'unicameral' };
        nextLegislatures.NE = ['other', 'other'];
      } else {
        const prevPair = game.stateLegislatures?.[stateId] || ['heritage', 'heritage'];
        const houseCtrl = resolveChamberControl(nextHouseCounts[stateId], prevPair[0]);
        const senateCtrl = resolveChamberControl(nextSenateCounts[stateId], prevPair[1]);
        nextLegislatures[stateId] = [houseCtrl, senateCtrl];
      }

      byStateSummary[stateId] = {
        ...stateRes,
        house: nextHouseCounts[stateId],
        senate: stateId === 'NE' ? null : nextSenateCounts[stateId],
        control: nextLegislatures[stateId],
      };
    });

    game.stateHouseSeatCounts = nextHouseCounts;
    game.stateSenateSeatCounts = nextSenateCounts;
    game.stateLegislatures = nextLegislatures;

    const cyclePayload = {
      year,
      playerIdentity: playerId,
      seatsUpCount,
      holdoverCount,
      totalSeats: seatsUpCount + holdoverCount,
      flips: flipsCount,
      retirements: retirementsCount,
      byState: byStateSummary,
      districtsById,
    };

    game.lastCycleResults = {
      ...(game.lastCycleResults || {}),
      stateLeg: cyclePayload,
    };

    return {
      game,
      stateHouseSeatCounts: nextHouseCounts,
      stateSenateSeatCounts: nextSenateCounts,
      stateLegislatures: nextLegislatures,
      lastCycleResults: game.lastCycleResults,
      summary: cyclePayload,
    };
  }

  // --------------------------------------------------------------------------
  // 6. Query Helpers for Career Ladder (Agent 3) & Race Explorer (Agent 4)
  // --------------------------------------------------------------------------

  function getDistrictsForStateChamber(game, stateId, chamber = 'house') {
    const entry = game?.stateLegDistricts?.[stateId];
    if (!entry) return [];
    if (stateId === 'NE') return entry.house || [];
    return chamber === 'senate' ? (entry.senate || []) : (entry.house || []);
  }

  function getChamberTippingPoint(game, stateId, chamber = 'house') {
    const list = getDistrictsForStateChamber(game, stateId, chamber);
    if (list.length === 0) return null;
    const sorted = list.slice().sort((a, b) => b.leanOffset - a.leanOffset);
    const medianIdx = Math.floor(sorted.length / 2);
    const tip = sorted[medianIdx];
    return {
      districtId: tip.id,
      leanOffset: tip.leanOffset,
      leanMargin: tip.leanMargin,
      leanLabel: tip.leanLabel,
      medianIndex: medianIdx,
      totalSeats: sorted.length,
    };
  }

  function getSeatSummaryStats(game) {
    const districts = game?.stateLegDistricts || {};
    const roster = game?.stateLegRoster || {};
    let houseSeats = 0;
    let senateSeats = 0;
    let qSum = 0;
    let qCount = 0;
    Object.entries(districts).forEach(([sid, entry]) => {
      if (sid === '_meta' || sid === 'DC' || !entry) return;
      (entry.house || []).forEach((d) => {
        houseSeats += 1;
        const p = d.incumbentId ? roster[d.incumbentId] : null;
        if (p) { qSum += p.quality; qCount += 1; }
      });
      (entry.senate || []).forEach((d) => {
        senateSeats += 1;
        const p = d.incumbentId ? roster[d.incumbentId] : null;
        if (p) { qSum += p.quality; qCount += 1; }
      });
    });
    return {
      houseSeats,
      senateSeats,
      totalSeats: houseSeats + senateSeats,
      rosterCount: Object.keys(roster).length,
      meanQuality: qCount > 0 ? round(qSum / qCount, 3) : 0,
    };
  }

  // --------------------------------------------------------------------------
  // 7. Export Public API
  // --------------------------------------------------------------------------

  const api = {
    buildStateLegDistricts,
    initializeStateLegBench,
    resolveStateLegElections,
    isDistrictUpInYear,
    getDistrictsForStateChamber,
    getChamberTippingPoint,
    getSeatSummaryStats,
    getQualityPersuasionDelta,
    rollCandidateQuality,
    FOUR_YEAR_HOUSE_STATES,
    STATE_TERM_LIMITS,
    DEFAULT_SENATE_CALENDAR,
    DEFAULT_STATE_HOUSE_TOTALS,
    DEFAULT_STATE_SENATE_TOTALS,
    STATE_CHAMBER_SKEW,
    QUALITY_PERSUASION_TABLE,
  };

  if (typeof window !== 'undefined') {
    window.StateLegBenchSystem = api;
  }
  root.StateLegBenchSystem = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
