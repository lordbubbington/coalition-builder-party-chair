/**
 * build-additional-scenarios-state-data.cjs
 * State-level data generators for the player-requested historical start dates:
 * - 1912: The Four-Way Titan Battle (Wilson vs TR Progressive/Bull Moose vs Taft vs Debs Socialist)
 * - 1924: The Roaring 20s & Agrarian Revolt (Coolidge vs Davis vs La Follette Progressive/CPPA)
 * - 1960: The New Frontier & Dixiecrat Stand (JFK vs Nixon vs Byrd Dixiecrats)
 * - 1968: Law & Order and the Dixiecrat Surge (Nixon vs Humphrey vs Wallace Dixiecrat/AIP)
 * - 1980: The Reagan Revolution & Anderson Wedge (Reagan vs Carter vs Anderson vs Clark Libertarian)
 * - 1992: The Three-Way Realignment (Clinton vs Bush vs Ross Perot 18.9%)
 * - 2000: The Millennial Razor-Wire (Bush vs Gore vs Nader Green 2.7%)
 * - 2016: The Populist Shockwave (Trump vs Clinton vs Johnson Libertarian 3.3% vs Stein Green)
 */

const fs = require('fs');

// Reference state metadata (48/50 states)
const STATE_EV_REGISTRY = {
  // 1912 & 1924: 48 contiguous states (531 total EVs)
  // 1960: 50 states (537 total EVs - DC had no EVs until 1964)
  // 1968, 1980, 1992, 2000, 2016, 2024: 50 states + DC (538 total EVs)
  AL: { name: 'Alabama', ev1912: 12, ev1924: 12, ev1960: 11, ev1980: 9, ev1992: 9, ev2000: 9, ev2016: 9 },
  AK: { name: 'Alaska', ev1912: null, ev1924: null, ev1960: 3, ev1980: 3, ev1992: 3, ev2000: 3, ev2016: 3 },
  AZ: { name: 'Arizona', ev1912: 3, ev1924: 3, ev1960: 4, ev1980: 6, ev1992: 8, ev2000: 8, ev2016: 11 },
  AR: { name: 'Arkansas', ev1912: 9, ev1924: 9, ev1960: 8, ev1980: 6, ev1992: 6, ev2000: 6, ev2016: 6 },
  CA: { name: 'California', ev1912: 13, ev1924: 13, ev1960: 32, ev1980: 45, ev1992: 54, ev2000: 54, ev2016: 55 },
  CO: { name: 'Colorado', ev1912: 6, ev1924: 6, ev1960: 6, ev1980: 7, ev1992: 8, ev2000: 8, ev2016: 9 },
  CT: { name: 'Connecticut', ev1912: 7, ev1924: 7, ev1960: 8, ev1980: 8, ev1992: 8, ev2000: 8, ev2016: 7 },
  DE: { name: 'Delaware', ev1912: 3, ev1924: 3, ev1960: 3, ev1980: 3, ev1992: 3, ev2000: 3, ev2016: 3 },
  FL: { name: 'Florida', ev1912: 6, ev1924: 6, ev1960: 10, ev1980: 17, ev1992: 25, ev2000: 25, ev2016: 29 },
  GA: { name: 'Georgia', ev1912: 14, ev1924: 14, ev1960: 12, ev1980: 12, ev1992: 13, ev2000: 13, ev2016: 16 },
  HI: { name: 'Hawaii', ev1912: null, ev1924: null, ev1960: 3, ev1980: 4, ev1992: 4, ev2000: 4, ev2016: 4 },
  ID: { name: 'Idaho', ev1912: 4, ev1924: 4, ev1960: 4, ev1980: 4, ev1992: 4, ev2000: 4, ev2016: 4 },
  IL: { name: 'Illinois', ev1912: 29, ev1924: 29, ev1960: 27, ev1980: 26, ev1992: 22, ev2000: 22, ev2016: 20 },
  IN: { name: 'Indiana', ev1912: 15, ev1924: 15, ev1960: 13, ev1980: 13, ev1992: 12, ev2000: 12, ev2016: 11 },
  IA: { name: 'Iowa', ev1912: 13, ev1924: 13, ev1960: 10, ev1980: 8, ev1992: 7, ev2000: 7, ev2016: 6 },
  KS: { name: 'Kansas', ev1912: 10, ev1924: 10, ev1960: 8, ev1980: 7, ev1992: 6, ev2000: 6, ev2016: 6 },
  KY: { name: 'Kentucky', ev1912: 13, ev1924: 13, ev1960: 10, ev1980: 9, ev1992: 8, ev2000: 8, ev2016: 8 },
  LA: { name: 'Louisiana', ev1912: 10, ev1924: 10, ev1960: 10, ev1980: 10, ev1992: 9, ev2000: 9, ev2016: 8 },
  ME: { name: 'Maine', ev1912: 6, ev1924: 6, ev1960: 5, ev1980: 4, ev1992: 4, ev2000: 4, ev2016: 4 },
  MD: { name: 'Maryland', ev1912: 8, ev1924: 8, ev1960: 9, ev1980: 10, ev1992: 10, ev2000: 10, ev2016: 10 },
  MA: { name: 'Massachusetts', ev1912: 18, ev1924: 18, ev1960: 16, ev1980: 14, ev1992: 12, ev2000: 12, ev2016: 11 },
  MI: { name: 'Michigan', ev1912: 15, ev1924: 15, ev1960: 20, ev1980: 21, ev1992: 18, ev2000: 18, ev2016: 16 },
  MN: { name: 'Minnesota', ev1912: 12, ev1924: 12, ev1960: 11, ev1980: 10, ev1992: 10, ev2000: 10, ev2016: 10 },
  MS: { name: 'Mississippi', ev1912: 10, ev1924: 10, ev1960: 8, ev1980: 7, ev1992: 7, ev2000: 7, ev2016: 6 },
  MO: { name: 'Missouri', ev1912: 18, ev1924: 18, ev1960: 13, ev1980: 12, ev1992: 11, ev2000: 11, ev2016: 10 },
  MT: { name: 'Montana', ev1912: 4, ev1924: 4, ev1960: 4, ev1980: 4, ev1992: 3, ev2000: 3, ev2016: 3 },
  NE: { name: 'Nebraska', ev1912: 8, ev1924: 8, ev1960: 6, ev1980: 5, ev1992: 5, ev2000: 5, ev2016: 5 },
  NV: { name: 'Nevada', ev1912: 3, ev1924: 3, ev1960: 3, ev1980: 3, ev1992: 4, ev2000: 4, ev2016: 6 },
  NH: { name: 'New Hampshire', ev1912: 4, ev1924: 4, ev1960: 4, ev1980: 4, ev1992: 4, ev2000: 4, ev2016: 4 },
  NJ: { name: 'New Jersey', ev1912: 14, ev1924: 14, ev1960: 16, ev1980: 17, ev1992: 15, ev2000: 15, ev2016: 14 },
  NM: { name: 'New Mexico', ev1912: 3, ev1924: 3, ev1960: 4, ev1980: 4, ev1992: 5, ev2000: 5, ev2016: 5 },
  NY: { name: 'New York', ev1912: 45, ev1924: 45, ev1960: 45, ev1980: 41, ev1992: 33, ev2000: 33, ev2016: 29 },
  NC: { name: 'North Carolina', ev1912: 12, ev1924: 12, ev1960: 14, ev1980: 13, ev1992: 14, ev2000: 14, ev2016: 15 },
  ND: { name: 'North Dakota', ev1912: 5, ev1924: 5, ev1960: 4, ev1980: 3, ev1992: 3, ev2000: 3, ev2016: 3 },
  OH: { name: 'Ohio', ev1912: 24, ev1924: 24, ev1960: 25, ev1980: 25, ev1992: 21, ev2000: 21, ev2016: 18 },
  OK: { name: 'Oklahoma', ev1912: 10, ev1924: 10, ev1960: 8, ev1980: 8, ev1992: 8, ev2000: 8, ev2016: 7 },
  OR: { name: 'Oregon', ev1912: 5, ev1924: 5, ev1960: 6, ev1980: 6, ev1992: 7, ev2000: 7, ev2016: 7 },
  PA: { name: 'Pennsylvania', ev1912: 38, ev1924: 38, ev1960: 32, ev1980: 27, ev1992: 23, ev2000: 23, ev2016: 20 },
  RI: { name: 'Rhode Island', ev1912: 5, ev1924: 5, ev1960: 4, ev1980: 4, ev1992: 4, ev2000: 4, ev2016: 4 },
  SC: { name: 'South Carolina', ev1912: 9, ev1924: 9, ev1960: 8, ev1980: 8, ev1992: 8, ev2000: 8, ev2016: 9 },
  SD: { name: 'South Dakota', ev1912: 5, ev1924: 5, ev1960: 4, ev1980: 4, ev1992: 3, ev2000: 3, ev2016: 3 },
  TN: { name: 'Tennessee', ev1912: 12, ev1924: 12, ev1960: 11, ev1980: 10, ev1992: 11, ev2000: 11, ev2016: 11 },
  TX: { name: 'Texas', ev1912: 20, ev1924: 20, ev1960: 24, ev1980: 26, ev1992: 32, ev2000: 32, ev2016: 38 },
  UT: { name: 'Utah', ev1912: 4, ev1924: 4, ev1960: 4, ev1980: 4, ev1992: 5, ev2000: 5, ev2016: 6 },
  VT: { name: 'Vermont', ev1912: 4, ev1924: 4, ev1960: 3, ev1980: 3, ev1992: 3, ev2000: 3, ev2016: 3 },
  VA: { name: 'Virginia', ev1912: 12, ev1924: 12, ev1960: 12, ev1980: 12, ev1992: 13, ev2000: 13, ev2016: 13 },
  WA: { name: 'Washington', ev1912: 7, ev1924: 7, ev1960: 9, ev1980: 9, ev1992: 11, ev2000: 11, ev2016: 12 },
  WV: { name: 'West Virginia', ev1912: 8, ev1924: 8, ev1960: 8, ev1980: 6, ev1992: 5, ev2000: 5, ev2016: 5 },
  WI: { name: 'Wisconsin', ev1912: 13, ev1924: 13, ev1960: 12, ev1980: 11, ev1992: 11, ev2000: 11, ev2016: 10 },
  WY: { name: 'Wyoming', ev1912: 3, ev1924: 3, ev1960: 3, ev1980: 3, ev1992: 3, ev2000: 3, ev2016: 3 }
};

function addScenarioStates(addEraStates) {
  // -------------------------------------------------------------
  // 1. 1912: THE FOUR-WAY TITAN BATTLE (48 States)
  // -------------------------------------------------------------
  const states1912 = Object.keys(STATE_EV_REGISTRY).filter(k => STATE_EV_REGISTRY[k].ev1912 !== null).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev1912;
    // Roosevelt Bull Moose won: CA (11 of 13), MI, MN, PA, SD, WA
    const isTR = ['MI', 'MN', 'PA', 'SD', 'WA'].includes(abbr) || abbr === 'CA';
    // Taft won: UT, VT
    const isTaft = ['UT', 'VT'].includes(abbr);
    // Wilson won remaining 40 states
    let pWinner = 'Woodrow Wilson', pWinnerP = 'Democratic', pWinnerPct = 43.5;
    let pRunner = 'Theodore Roosevelt', pRunnerP = 'Progressive (Bull Moose)', pRunnerPct = 28.5;
    let third = 'William Howard Taft (Rep) 21.0%; Eugene V. Debs (Soc) 6.0%';
    let lean = 'DEM+15.0';

    if (isTR) {
      pWinner = 'Theodore Roosevelt'; pWinnerP = 'Progressive (Bull Moose)'; pWinnerPct = 45.0;
      pRunner = 'Woodrow Wilson'; pRunnerP = 'Democratic'; pRunnerPct = 32.0;
      third = 'William Howard Taft (Rep) 16.0%; Eugene V. Debs (Soc) 7.0%';
      lean = 'BULL_MOOSE+13.0';
    } else if (isTaft) {
      pWinner = 'William Howard Taft'; pWinnerP = 'Republican'; pWinnerPct = 37.5;
      pRunner = 'Woodrow Wilson'; pRunnerP = 'Democratic'; pRunnerPct = 32.0;
      third = 'Theodore Roosevelt (Prog) 24.5%; Eugene V. Debs (Soc) 6.0%';
      lean = 'REP+5.5';
    } else if (['AL', 'AR', 'FL', 'GA', 'LA', 'MS', 'NC', 'SC', 'TN', 'TX', 'VA'].includes(abbr)) {
      // Solid South
      pWinnerPct = 75.0; pRunnerPct = 15.0;
      pRunner = 'Theodore Roosevelt'; pRunnerP = 'Progressive (Bull Moose)';
      third = 'Taft (Rep) 7.0%; Debs (Soc) 3.0%';
      lean = 'DEM+60.0';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 31000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 31000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: isTR ? 'Progressive' : (isTaft ? 'Republican' : 'Democratic'),
      govVotes: Math.round(ev * 30000), govPct: 52.0,
      sen1: isTR ? 'Progressive / Rep' : (isTaft ? 'Republican' : 'Democratic'),
      sen2: 'Democratic', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.5), sSenP2: Math.round(ev * 1.0),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.8), sHP2: Math.round(ev * 2.7),
      lean, notes: 'Historic 4-way clash; TR Bull Moose bolters win 88 EVs; Debs Socialist 6%.'
    };
  });
  addEraStates(1912, 'The Progressive Era', states1912);

  // -------------------------------------------------------------
  // 2. 1924: THE ROARING 20s & AGRARIAN REVOLT (48 States)
  // -------------------------------------------------------------
  const states1924 = Object.keys(STATE_EV_REGISTRY).filter(k => STATE_EV_REGISTRY[k].ev1924 !== null).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev1924;
    const isSouth = ['AL', 'AR', 'FL', 'GA', 'LA', 'MS', 'NC', 'SC', 'TN', 'TX', 'VA', 'OK'].includes(abbr);
    const isLaFollette = abbr === 'WI';
    const isLaFolletteStrong = ['MN', 'ND', 'SD', 'MT', 'ID', 'WA', 'OR', 'NV', 'CA', 'WY', 'IA'].includes(abbr);

    let pWinner = 'Calvin Coolidge', pWinnerP = 'Republican', pWinnerPct = 56.5;
    let pRunner = 'John W. Davis', pRunnerP = 'Democratic', pRunnerPct = 26.5;
    let third = 'Robert M. La Follette (Progressive / CPPA) 16.5%';
    let lean = 'REP+30.0';

    if (isLaFollette) {
      pWinner = 'Robert M. La Follette'; pWinnerP = 'Progressive / CPPA'; pWinnerPct = 53.9;
      pRunner = 'Calvin Coolidge'; pRunnerP = 'Republican'; pRunnerPct = 40.3;
      third = 'John W. Davis (Dem) 5.8%';
      lean = 'PROGRESSIVE+13.6';
    } else if (isSouth) {
      pWinner = 'John W. Davis'; pWinnerP = 'Democratic'; pWinnerPct = 68.0;
      pRunner = 'Calvin Coolidge'; pRunnerP = 'Republican'; pRunnerPct = 25.0;
      third = 'Robert M. La Follette (Prog) 7.0%';
      lean = 'DEM+43.0';
    } else if (isLaFolletteStrong) {
      pWinner = 'Calvin Coolidge'; pWinnerP = 'Republican'; pWinnerPct = 48.0;
      pRunner = 'Robert M. La Follette'; pRunnerP = 'Progressive / CPPA'; pRunnerPct = 38.0;
      third = 'John W. Davis (Dem) 14.0%';
      lean = 'REP+10.0';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 60000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 60000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: isLaFollette ? 'Progressive' : (isSouth ? 'Democratic' : 'Republican'),
      govVotes: Math.round(ev * 55000), govPct: 53.0,
      sen1: isLaFollette ? 'Progressive' : (isSouth ? 'Democratic' : 'Republican'),
      sen2: isSouth ? 'Democratic' : 'Republican', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.5), sSenP2: Math.round(ev * 1.0),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.8), sHP2: Math.round(ev * 2.7),
      lean, notes: 'Coolidge prosperity vs La Follette agrarian/railroad progressive revolt (16.6% PV).'
    };
  });
  addEraStates(1924, 'The Progressive Era', states1924);

  // -------------------------------------------------------------
  // 3. 1960: THE NEW FRONTIER & THE DIXIECRAT STAND (50 States)
  // -------------------------------------------------------------
  const states1960 = Object.keys(STATE_EV_REGISTRY).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev1960;
    // Dixiecrats won Mississippi outright (8 EVs) and 6 of 11 in Alabama; 1 in Oklahoma
    const isMiss = abbr === 'MS';
    const isAla = abbr === 'AL';
    const isJFK = ['CT', 'DE', 'GA', 'IL', 'LA', 'MD', 'MA', 'MI', 'MN', 'MO', 'NV', 'NJ', 'NM', 'NY', 'NC', 'PA', 'RI', 'SC', 'TX', 'WV'].includes(abbr);

    let pWinner = 'Richard Nixon', pWinnerP = 'Republican', pWinnerPct = 52.0;
    let pRunner = 'John F. Kennedy', pRunnerP = 'Democratic', pRunnerPct = 47.5;
    let third = 'Dixiecrat (States\' Rights) 0.5%';
    let lean = 'REP+4.5';

    if (isMiss) {
      pWinner = 'Harry F. Byrd'; pWinnerP = 'Dixiecrat (States\' Rights)'; pWinnerPct = 63.5;
      pRunner = 'John F. Kennedy'; pRunnerP = 'Democratic'; pRunnerPct = 24.7;
      third = 'Richard Nixon (Rep) 11.8%';
      lean = 'DIXIECRAT+38.8';
    } else if (isAla) {
      pWinner = 'Harry F. Byrd (6 EVs) / JFK (5 EVs)'; pWinnerP = 'Dixiecrat (States\' Rights)'; pWinnerPct = 54.0;
      pRunner = 'Richard Nixon'; pRunnerP = 'Republican'; pRunnerPct = 42.0;
      third = 'Loyalist Democratic slate 4.0%';
      lean = 'DIXIECRAT+12.0';
    } else if (isJFK) {
      pWinner = 'John F. Kennedy'; pWinnerP = 'Democratic'; pWinnerPct = 51.5;
      pRunner = 'Richard Nixon'; pRunnerP = 'Republican'; pRunnerPct = 48.0;
      third = 'Dixiecrat (States\' Rights) 0.5%';
      lean = 'DEM+3.5';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 135000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 135000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: (isMiss || isAla) ? 'Dixiecrat (States\' Rights)' : (isJFK ? 'Democratic' : 'Republican'),
      govVotes: Math.round(ev * 130000), govPct: 52.0,
      sen1: (isMiss || isAla) ? 'Dixiecrat (States\' Rights)' : (isJFK ? 'Democratic' : 'Republican'),
      sen2: isJFK ? 'Democratic' : 'Republican', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.4), sSenP2: Math.round(ev * 1.1),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.6), sHP2: Math.round(ev * 2.9),
      lean, notes: 'Razor-thin JFK popular margin (112k votes); Byrd Dixiecrats win 15 Southern EVs.'
    };
  });
  addEraStates(1960, 'The Liberal Era', states1960);

  // -------------------------------------------------------------
  // 4. 1980: THE REAGAN REVOLUTION & ANDERSON'S WEDGE (50 States + DC)
  // -------------------------------------------------------------
  const states1980 = Object.keys(STATE_EV_REGISTRY).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev1980;
    const isCarter = ['GA', 'HI', 'MD', 'MN', 'RI', 'WV'].includes(abbr);
    const isAndersonStrong = ['MA', 'VT', 'RI', 'CO', 'CT', 'WA', 'ME', 'NH'].includes(abbr);

    let pWinner = 'Ronald Reagan', pWinnerP = 'Republican', pWinnerPct = 52.5;
    let pRunner = 'Jimmy Carter', pRunnerP = 'Democratic', pRunnerPct = 39.5;
    let third = isAndersonStrong ? 'John Anderson (Nat Unity) 12.5%; Ed Clark (Lib) 1.5%' : 'John Anderson (Nat Unity) 6.6%; Ed Clark (Lib) 1.1%';
    let lean = 'REP+13.0';

    if (isCarter) {
      pWinner = 'Jimmy Carter'; pWinnerP = 'Democratic'; pWinnerPct = 50.5;
      pRunner = 'Ronald Reagan'; pRunnerP = 'Republican'; pRunnerPct = 44.0;
      third = 'John Anderson (Nat Unity) 4.5%; Ed Clark (Lib) 1.0%';
      lean = 'DEM+6.5';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 175000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 175000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: isCarter ? 'Democratic' : 'Republican',
      govVotes: Math.round(ev * 165000), govPct: 53.0,
      sen1: isCarter ? 'Democratic' : 'Republican', sen2: 'Democratic', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.4), sSenP2: Math.round(ev * 1.1),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.6), sHP2: Math.round(ev * 2.9),
      lean, notes: 'Reagan 489 EV landslide; John Anderson wins 5.7M votes (6.6%); Clark Lib 1.1%.'
    };
  });
  addEraStates(1980, 'The Conservative Era', states1980);

  // -------------------------------------------------------------
  // 5. 1992: THE THREE-WAY REALIGNMENT & ROSS PEROT SURGE (50 States + DC)
  // -------------------------------------------------------------
  const states1992 = Object.keys(STATE_EV_REGISTRY).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev1992;
    const isBush = ['AL', 'AK', 'AZ', 'FL', 'ID', 'IN', 'KS', 'MS', 'NE', 'NC', 'ND', 'OK', 'SC', 'SD', 'TX', 'UT', 'VA', 'WY'].includes(abbr);
    const isPerotSecond = ['ME', 'UT'].includes(abbr);
    const isPerotHuge = ['AK', 'ID', 'KS', 'ME', 'MT', 'NV', 'OK', 'OR', 'UT', 'WY'].includes(abbr);

    let pWinner = 'Bill Clinton', pWinnerP = 'Democratic', pWinnerPct = 43.8;
    let pRunner = 'George H.W. Bush', pRunnerP = 'Republican', pRunnerPct = 36.5;
    let perotPct = isPerotHuge ? 26.5 : 18.9;
    let third = `Ross Perot (Independent / United We Stand) ${perotPct}%; Andre Marrou (Lib) 0.3%`;
    let lean = 'DEM+7.3';

    if (isBush) {
      pWinner = 'George H.W. Bush'; pWinnerP = 'Republican'; pWinnerPct = 42.0;
      pRunner = isPerotSecond ? 'Ross Perot' : 'Bill Clinton';
      pRunnerP = isPerotSecond ? 'Independent / United We Stand' : 'Democratic';
      pRunnerPct = isPerotSecond ? 28.5 : 37.0;
      third = isPerotSecond ? 'Bill Clinton (Dem) 29.5%' : `Ross Perot (Ind) ${perotPct}%`;
      lean = 'REP+5.0';
    } else if (abbr === 'ME') {
      pWinner = 'Bill Clinton'; pWinnerP = 'Democratic'; pWinnerPct = 38.8;
      pRunner = 'Ross Perot'; pRunnerP = 'Independent / United We Stand'; pRunnerPct = 30.4;
      third = 'George H.W. Bush (Rep) 30.4%';
      lean = 'DEM+8.4';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 210000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 210000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: isBush ? 'Republican' : 'Democratic',
      govVotes: Math.round(ev * 200000), govPct: 52.0,
      sen1: isBush ? 'Republican' : 'Democratic', sen2: 'Democratic', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.4), sSenP2: Math.round(ev * 1.1),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.6), sHP2: Math.round(ev * 2.9),
      lean, notes: 'Historic 3-way race; Ross Perot wins 18.9% (19.7M votes); Clinton wins 370 EVs.'
    };
  });
  addEraStates(1992, 'The Conservative Era', states1992);

  // -------------------------------------------------------------
  // 6. 2000: THE MILLENNIAL RAZOR-WIRE (50 States + DC)
  // -------------------------------------------------------------
  const states2000 = Object.keys(STATE_EV_REGISTRY).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev2000;
    const isBush = ['AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'KS', 'KY', 'LA', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NC', 'ND', 'OH', 'OK', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'WV', 'WY'].includes(abbr);
    const isNaderStrong = ['AK', 'VT', 'MA', 'RI', 'ME', 'OR', 'WA', 'MN', 'CO', 'HI'].includes(abbr);

    let pWinner = 'George W. Bush', pWinnerP = 'Republican', pWinnerPct = 51.5;
    let pRunner = 'Al Gore', pRunnerP = 'Democratic', pRunnerPct = 45.5;
    let naderPct = isNaderStrong ? 6.5 : 2.7;
    let third = `Ralph Nader (Green) ${naderPct}%; Pat Buchanan (Reform) 0.5%`;
    let lean = 'REP+6.0';

    if (!isBush) {
      pWinner = 'Al Gore'; pWinnerP = 'Democratic'; pWinnerPct = 52.0;
      pRunner = 'George W. Bush'; pRunnerP = 'Republican'; pRunnerPct = 44.5;
      third = `Ralph Nader (Green) ${naderPct}%; Pat Buchanan (Reform) 0.4%`;
      lean = 'DEM+7.5';
    } else if (abbr === 'FL') {
      pWinner = 'George W. Bush'; pWinnerP = 'Republican'; pWinnerPct = 48.85;
      pRunner = 'Al Gore'; pRunnerP = 'Democratic'; pRunnerPct = 48.84;
      third = 'Ralph Nader (Green) 1.63% (97,488 votes); Pat Buchanan (Reform) 0.29%';
      lean = 'EVEN (+537 votes)';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 215000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 215000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: isBush ? 'Republican' : 'Democratic',
      govVotes: Math.round(ev * 205000), govPct: 52.0,
      sen1: isBush ? 'Republican' : 'Democratic', sen2: 'Democratic', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.4), sSenP2: Math.round(ev * 1.1),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.6), sHP2: Math.round(ev * 2.9),
      lean, notes: '537-vote Florida recount decides 271–266 EV; Nader Green surge (2.88M votes).'
    };
  });
  addEraStates(2000, 'The Conservative Era', states2000);

  // -------------------------------------------------------------
  // 7. 2016: THE POPULIST SHOCKWAVE (50 States + DC)
  // -------------------------------------------------------------
  const states2016 = Object.keys(STATE_EV_REGISTRY).map(abbr => {
    const st = STATE_EV_REGISTRY[abbr];
    const ev = st.ev2016;
    const isTrump = ['AL', 'AK', 'AZ', 'AR', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'MI', 'MS', 'MO', 'MT', 'NE', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'WV', 'WI', 'WY'].includes(abbr);
    const isJohnsonStrong = ['NM', 'UT', 'AK', 'ID', 'WY', 'ND', 'SD', 'OK', 'CO'].includes(abbr);

    let pWinner = 'Donald Trump', pWinnerP = 'Republican', pWinnerPct = 51.5;
    let pRunner = 'Hillary Clinton', pRunnerP = 'Democratic', pRunnerPct = 42.5;
    let jPct = isJohnsonStrong ? 7.5 : 3.3;
    let third = `Gary Johnson (Libertarian) ${jPct}%; Jill Stein (Green) 1.1%`;
    let lean = 'REP+9.0';

    if (!isTrump) {
      pWinner = 'Hillary Clinton'; pWinnerP = 'Democratic'; pWinnerPct = 52.0;
      pRunner = 'Donald Trump'; pRunnerP = 'Republican'; pRunnerPct = 42.5;
      third = `Gary Johnson (Libertarian) ${jPct}%; Jill Stein (Green) 1.2%`;
      lean = 'DEM+9.5';
    } else if (abbr === 'UT') {
      pWinner = 'Donald Trump'; pWinnerP = 'Republican'; pWinnerPct = 45.5;
      pRunner = 'Hillary Clinton'; pRunnerP = 'Democratic'; pRunnerPct = 27.5;
      third = 'Evan McMullin (Ind) 21.5%; Gary Johnson (Lib) 3.5%';
      lean = 'REP+18.0';
    } else if (abbr === 'NM') {
      pWinner = 'Hillary Clinton'; pWinnerP = 'Democratic'; pWinnerPct = 48.3;
      pRunner = 'Donald Trump'; pRunnerP = 'Republican'; pRunnerPct = 40.0;
      third = 'Gary Johnson (Lib) 9.3%; Jill Stein (Green) 1.2%';
      lean = 'DEM+8.3';
    }

    return {
      name: st.name, abbr, ev,
      pWinner, pWinnerP, pWinnerVotes: Math.round(ev * 270000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(ev * 270000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: isTrump ? 'Republican' : 'Democratic',
      govVotes: Math.round(ev * 255000), govPct: 52.0,
      sen1: isTrump ? 'Republican' : 'Democratic', sen2: 'Democratic', sen3: 'N/A',
      hTotal: Math.max(1, Math.round(ev - 2)),
      hP1: Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(ev - 2)) - Math.round(Math.max(1, Math.round(ev - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(ev * 2.5), sSenP1: Math.round(ev * 1.4), sSenP2: Math.round(ev * 1.1),
      sH: Math.round(ev * 6.5), sHP1: Math.round(ev * 3.6), sHP2: Math.round(ev * 2.9),
      lean, notes: 'Trump breaches Blue Wall (PA, MI, WI); Gary Johnson Lib 3.3% (4.5M); Stein Green 1.1%.'
    };
  });
  addEraStates(2016, 'Modern Populist & Polarized Era', states2016);
}

module.exports = {
  addScenarioStates
};
