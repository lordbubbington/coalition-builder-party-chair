/**
 * build-later-eras-state-data.cjs
 * State-level data generators for 1860, 1896, 1932, 1968, 2008, 2024
 */

const ALL_50_STATES = [
  { abbr: 'AL', name: 'Alabama', ev2024: 9, ev2008: 9, ev1968: 10, ev1932: 11, ev1896: 11, ev1860: 9 },
  { abbr: 'AK', name: 'Alaska', ev2024: 3, ev2008: 3, ev1968: 3, ev1932: null, ev1896: null, ev1860: null },
  { abbr: 'AZ', name: 'Arizona', ev2024: 11, ev2008: 10, ev1968: 5, ev1932: 3, ev1896: null, ev1860: null },
  { abbr: 'AR', name: 'Arkansas', ev2024: 6, ev2008: 6, ev1968: 6, ev1932: 9, ev1896: 8, ev1860: 4 },
  { abbr: 'CA', name: 'California', ev2024: 54, ev2008: 55, ev1968: 40, ev1932: 22, ev1896: 9, ev1860: 4 },
  { abbr: 'CO', name: 'Colorado', ev2024: 10, ev2008: 9, ev1968: 6, ev1932: 6, ev1896: 4, ev1860: null },
  { abbr: 'CT', name: 'Connecticut', ev2024: 7, ev2008: 7, ev1968: 8, ev1932: 8, ev1896: 6, ev1860: 6 },
  { abbr: 'DE', name: 'Delaware', ev2024: 3, ev2008: 3, ev1968: 3, ev1932: 3, ev1896: 3, ev1860: 3 },
  { abbr: 'FL', name: 'Florida', ev2024: 30, ev2008: 27, ev1968: 14, ev1932: 7, ev1896: 4, ev1860: 3 },
  { abbr: 'GA', name: 'Georgia', ev2024: 16, ev2008: 15, ev1968: 12, ev1932: 12, ev1896: 13, ev1860: 10 },
  { abbr: 'HI', name: 'Hawaii', ev2024: 4, ev2008: 4, ev1968: 4, ev1932: null, ev1896: null, ev1860: null },
  { abbr: 'ID', name: 'Idaho', ev2024: 4, ev2008: 4, ev1968: 4, ev1932: 4, ev1896: 3, ev1860: null },
  { abbr: 'IL', name: 'Illinois', ev2024: 19, ev2008: 21, ev1968: 26, ev1932: 29, ev1896: 24, ev1860: 11 },
  { abbr: 'IN', name: 'Indiana', ev2024: 11, ev2008: 11, ev1968: 13, ev1932: 14, ev1896: 15, ev1860: 13 },
  { abbr: 'IA', name: 'Iowa', ev2024: 6, ev2008: 7, ev1968: 9, ev1932: 11, ev1896: 13, ev1860: 4 },
  { abbr: 'KS', name: 'Kansas', ev2024: 6, ev2008: 6, ev1968: 7, ev1932: 9, ev1896: 10, ev1860: null },
  { abbr: 'KY', name: 'Kentucky', ev2024: 8, ev2008: 8, ev1968: 9, ev1932: 11, ev1896: 13, ev1860: 12 },
  { abbr: 'LA', name: 'Louisiana', ev2024: 8, ev2008: 9, ev1968: 10, ev1932: 10, ev1896: 8, ev1860: 6 },
  { abbr: 'ME', name: 'Maine', ev2024: 4, ev2008: 4, ev1968: 4, ev1932: 5, ev1896: 6, ev1860: 8 },
  { abbr: 'MD', name: 'Maryland', ev2024: 10, ev2008: 10, ev1968: 10, ev1932: 8, ev1896: 8, ev1860: 8 },
  { abbr: 'MA', name: 'Massachusetts', ev2024: 11, ev2008: 12, ev1968: 14, ev1932: 17, ev1896: 15, ev1860: 13 },
  { abbr: 'MI', name: 'Michigan', ev2024: 15, ev2008: 17, ev1968: 21, ev1932: 19, ev1896: 14, ev1860: 6 },
  { abbr: 'MN', name: 'Minnesota', ev2024: 10, ev2008: 10, ev1968: 10, ev1932: 11, ev1896: 9, ev1860: 4 },
  { abbr: 'MS', name: 'Mississippi', ev2024: 6, ev2008: 6, ev1968: 7, ev1932: 9, ev1896: 9, ev1860: 7 },
  { abbr: 'MO', name: 'Missouri', ev2024: 10, ev2008: 11, ev1968: 12, ev1932: 15, ev1896: 17, ev1860: 9 },
  { abbr: 'MT', name: 'Montana', ev2024: 4, ev2008: 3, ev1968: 4, ev1932: 4, ev1896: 3, ev1860: null },
  { abbr: 'NE', name: 'Nebraska', ev2024: 5, ev2008: 5, ev1968: 5, ev1932: 7, ev1896: 8, ev1860: null },
  { abbr: 'NV', name: 'Nevada', ev2024: 6, ev2008: 5, ev1968: 3, ev1932: 3, ev1896: 3, ev1860: null },
  { abbr: 'NH', name: 'New Hampshire', ev2024: 4, ev2008: 4, ev1968: 4, ev1932: 4, ev1896: 4, ev1860: 5 },
  { abbr: 'NJ', name: 'New Jersey', ev2024: 14, ev2008: 15, ev1968: 17, ev1932: 16, ev1896: 10, ev1860: 7 },
  { abbr: 'NM', name: 'New Mexico', ev2024: 5, ev2008: 5, ev1968: 4, ev1932: 3, ev1896: null, ev1860: null },
  { abbr: 'NY', name: 'New York', ev2024: 28, ev2008: 31, ev1968: 43, ev1932: 47, ev1896: 36, ev1860: 35 },
  { abbr: 'NC', name: 'North Carolina', ev2024: 16, ev2008: 15, ev1968: 13, ev1932: 13, ev1896: 11, ev1860: 10 },
  { abbr: 'ND', name: 'North Dakota', ev2024: 3, ev2008: 3, ev1968: 4, ev1932: 4, ev1896: 3, ev1860: null },
  { abbr: 'OH', name: 'Ohio', ev2024: 17, ev2008: 20, ev1968: 26, ev1932: 26, ev1896: 23, ev1860: 23 },
  { abbr: 'OK', name: 'Oklahoma', ev2024: 7, ev2008: 7, ev1968: 8, ev1932: 11, ev1896: null, ev1860: null },
  { abbr: 'OR', name: 'Oregon', ev2024: 8, ev2008: 7, ev1968: 6, ev1932: 5, ev1896: 4, ev1860: 3 },
  { abbr: 'PA', name: 'Pennsylvania', ev2024: 19, ev2008: 21, ev1968: 29, ev1932: 36, ev1896: 32, ev1860: 27 },
  { abbr: 'RI', name: 'Rhode Island', ev2024: 4, ev2008: 4, ev1968: 4, ev1932: 4, ev1896: 4, ev1860: 4 },
  { abbr: 'SC', name: 'South Carolina', ev2024: 9, ev2008: 8, ev1968: 8, ev1932: 8, ev1896: 9, ev1860: 8 },
  { abbr: 'SD', name: 'South Dakota', ev2024: 3, ev2008: 3, ev1968: 4, ev1932: 4, ev1896: 4, ev1860: null },
  { abbr: 'TN', name: 'Tennessee', ev2024: 11, ev2008: 11, ev1968: 11, ev1932: 11, ev1896: 12, ev1860: 12 },
  { abbr: 'TX', name: 'Texas', ev2024: 40, ev2008: 34, ev1968: 25, ev1932: 23, ev1896: 15, ev1860: 4 },
  { abbr: 'UT', name: 'Utah', ev2024: 6, ev2008: 5, ev1968: 4, ev1932: 4, ev1896: 3, ev1860: null },
  { abbr: 'VT', name: 'Vermont', ev2024: 3, ev2008: 3, ev1968: 3, ev1932: 3, ev1896: 4, ev1860: 5 },
  { abbr: 'VA', name: 'Virginia', ev2024: 13, ev2008: 13, ev1968: 12, ev1932: 11, ev1896: 12, ev1860: 15 },
  { abbr: 'WA', name: 'Washington', ev2024: 12, ev2008: 11, ev1968: 9, ev1932: 8, ev1896: 4, ev1860: null },
  { abbr: 'WV', name: 'West Virginia', ev2024: 4, ev2008: 5, ev1968: 7, ev1932: 8, ev1896: 6, ev1860: null },
  { abbr: 'WI', name: 'Wisconsin', ev2024: 10, ev2008: 10, ev1968: 12, ev1932: 12, ev1896: 12, ev1860: 5 },
  { abbr: 'WY', name: 'Wyoming', ev2024: 3, ev2008: 3, ev1968: 3, ev1932: 3, ev1896: 3, ev1860: null }
];

function generateLaterEraStates(addEraStates) {
  // 3. 1860 (33 States)
  const states1860 = ALL_50_STATES.filter(st => st.ev1860 !== null).map(st => {
    const isFreeState = ['CA', 'CT', 'IL', 'IN', 'IA', 'ME', 'MA', 'MI', 'MN', 'NH', 'NJ', 'NY', 'OH', 'OR', 'PA', 'RI', 'VT', 'WI'].includes(st.abbr);
    const isDeepSouth = ['AL', 'FL', 'GA', 'LA', 'MS', 'SC', 'TX'].includes(st.abbr);
    const isBorder = ['AR', 'DE', 'KY', 'MD', 'MO', 'NC', 'TN', 'VA'].includes(st.abbr);

    let pWinner = 'Abraham Lincoln', pWinnerP = 'Republican', pWinnerPct = 52.0;
    let pRunner = 'Stephen A. Douglas', pRunnerP = 'Northern Democratic', pRunnerPct = 40.0;
    let third = 'John Bell / Breckinridge split';
    let govP = 'Republican', sen1P = 'Republican', sen2P = 'Republican', lean = 'REP+12.0';

    if (isDeepSouth) {
      pWinner = 'John C. Breckinridge'; pWinnerP = 'Southern Democratic'; pWinnerPct = 62.0;
      pRunner = 'John Bell'; pRunnerP = 'Constitutional Union'; pRunnerPct = 35.0;
      third = 'Douglas (Dem) 3.0%';
      govP = 'Southern Democratic'; sen1P = 'Southern Democratic'; sen2P = 'Southern Democratic'; lean = 'SD+25.0';
    } else if (isBorder) {
      if (['KY', 'TN', 'VA'].includes(st.abbr)) {
        pWinner = 'John Bell'; pWinnerP = 'Constitutional Union'; pWinnerPct = 46.0;
        pRunner = 'John C. Breckinridge'; pRunnerP = 'Southern Democratic'; pRunnerPct = 42.0;
        govP = 'Constitutional Union'; sen1P = 'Opposition'; sen2P = 'Dem'; lean = 'CU+8.0';
      } else if (st.abbr === 'MO') {
        pWinner = 'Stephen A. Douglas'; pWinnerP = 'Northern Democratic'; pWinnerPct = 35.5;
        pRunner = 'John Bell'; pRunnerP = 'Constitutional Union'; pRunnerPct = 35.3;
        govP = 'Democratic'; sen1P = 'Dem'; sen2P = 'Dem'; lean = 'ND+0.2';
      } else {
        pWinner = 'John C. Breckinridge'; pWinnerP = 'Southern Democratic'; pWinnerPct = 48.0;
        pRunner = 'John Bell'; pRunnerP = 'Constitutional Union'; pRunnerPct = 44.0;
        govP = 'Democratic'; sen1P = 'Dem'; sen2P = 'Dem'; lean = 'SD+6.0';
      }
    } else if (st.abbr === 'NJ') {
      pWinner = 'Abraham Lincoln'; pWinnerP = 'Republican'; pWinnerPct = 52.1;
      pRunner = 'Stephen A. Douglas'; pRunnerP = 'Northern Democratic'; pRunnerPct = 47.9;
      lean = 'REP+4.2';
    }

    return {
      name: st.name, abbr: st.abbr, ev: st.ev1860,
      pWinner, pWinnerP, pWinnerVotes: Math.round(st.ev1860 * 18000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(st.ev1860 * 18000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP, govVotes: Math.round(st.ev1860 * 17000), govPct: 53.0,
      sen1: sen1P, sen2: sen2P, sen3: 'N/A',
      hTotal: Math.max(1, Math.round(st.ev1860 - 2)),
      hP1: Math.round(Math.max(1, Math.round(st.ev1860 - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(st.ev1860 - 2)) - Math.round(Math.max(1, Math.round(st.ev1860 - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(st.ev1860 * 3), sSenP1: Math.round(st.ev1860 * 1.8), sSenP2: Math.round(st.ev1860 * 1.2),
      sH: Math.round(st.ev1860 * 8), sHP1: Math.round(st.ev1860 * 4.8), sHP2: Math.round(st.ev1860 * 3.2),
      lean, notes: 'Civil War election return baseline.'
    };
  });
  addEraStates(1860, 'The Industrial Era', states1860);

  // 4. 1896 (45 States)
  const states1896 = ALL_50_STATES.filter(st => st.ev1896 !== null).map(st => {
    const isMcKinley = ['CA', 'CT', 'DE', 'IL', 'IN', 'IA', 'KY', 'ME', 'MD', 'MA', 'MI', 'MN', 'NH', 'NJ', 'NY', 'ND', 'OH', 'OR', 'PA', 'RI', 'VT', 'WV', 'WI'].includes(st.abbr);
    const pWinner = isMcKinley ? 'William McKinley' : 'William Jennings Bryan';
    const pWinnerP = isMcKinley ? 'Republican' : 'Democratic / Populist';
    const pRunner = isMcKinley ? 'William Jennings Bryan' : 'William McKinley';
    const pRunnerP = isMcKinley ? 'Democratic / Populist' : 'Republican';
    const pWinnerPct = isMcKinley ? 54.0 : 58.0;
    const pRunnerPct = 100.0 - pWinnerPct - 2.0;
    const lean = isMcKinley ? 'REP+8.0' : 'DEM+16.0';

    return {
      name: st.name, abbr: st.abbr, ev: st.ev1896,
      pWinner, pWinnerP, pWinnerVotes: Math.round(st.ev1896 * 32000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(st.ev1896 * 32000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: 'Gold Democrats (Palmer) 1.0%; Prohibition 1.0%',
      govName: `${st.name} Governor`, govP: pWinnerP, govVotes: Math.round(st.ev1896 * 30000), govPct: 52.0,
      sen1: pWinnerP, sen2: pWinnerP, sen3: 'N/A',
      hTotal: Math.max(1, Math.round(st.ev1896 - 2)),
      hP1: Math.round(Math.max(1, Math.round(st.ev1896 - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(st.ev1896 - 2)) - Math.round(Math.max(1, Math.round(st.ev1896 - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(st.ev1896 * 2.5), sSenP1: Math.round(st.ev1896 * 1.5), sSenP2: Math.round(st.ev1896 * 1.0),
      sH: Math.round(st.ev1896 * 6.5), sHP1: Math.round(st.ev1896 * 3.9), sHP2: Math.round(st.ev1896 * 2.6),
      lean, notes: 'Cross of Gold / Fourth Party System realignment.'
    };
  });
  addEraStates(1896, 'The Progressive Era', states1896);

  // 5. 1932 (48 States)
  const states1932 = ALL_50_STATES.filter(st => st.ev1932 !== null).map(st => {
    const isHoover = ['CT', 'DE', 'ME', 'NH', 'PA', 'VT'].includes(st.abbr);
    const pWinner = isHoover ? 'Herbert Hoover' : 'Franklin D. Roosevelt';
    const pWinnerP = isHoover ? 'Republican' : 'Democratic';
    const pRunner = isHoover ? 'Franklin D. Roosevelt' : 'Herbert Hoover';
    const pRunnerP = isHoover ? 'Democratic' : 'Republican';
    const pWinnerPct = isHoover ? 51.5 : 59.2;
    const pRunnerPct = 100.0 - pWinnerPct - 2.5;
    const lean = isHoover ? 'REP+3.0' : 'DEM+18.4';

    return {
      name: st.name, abbr: st.abbr, ev: st.ev1932,
      pWinner, pWinnerP, pWinnerVotes: Math.round(st.ev1932 * 85000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(st.ev1932 * 85000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: 'Norman Thomas (Socialist) 2.2%; Foster (Communist) 0.3%',
      govName: `${st.name} Governor`, govP: pWinnerP, govVotes: Math.round(st.ev1932 * 80000), govPct: 54.0,
      sen1: pWinnerP, sen2: pWinnerP, sen3: 'N/A',
      hTotal: Math.max(1, Math.round(st.ev1932 - 2)),
      hP1: Math.round(Math.max(1, Math.round(st.ev1932 - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(st.ev1932 - 2)) - Math.round(Math.max(1, Math.round(st.ev1932 - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(st.ev1932 * 2.5), sSenP1: Math.round(st.ev1932 * 1.7), sSenP2: Math.round(st.ev1932 * 0.8),
      sH: Math.round(st.ev1932 * 6.5), sHP1: Math.round(st.ev1932 * 4.4), sHP2: Math.round(st.ev1932 * 2.1),
      lean, notes: 'Great Depression New Deal sweep; FDR carries 42 of 48 states.'
    };
  });
  addEraStates(1932, 'The Liberal Era', states1932);

  // 6. 1968 (50 States)
  const states1968 = ALL_50_STATES.map(st => {
    const isWallace = ['AL', 'AR', 'GA', 'LA', 'MS'].includes(st.abbr);
    const isHumphrey = ['CT', 'HI', 'ME', 'MD', 'MA', 'MI', 'MN', 'NY', 'PA', 'RI', 'TX', 'WA', 'WV'].includes(st.abbr);
    let pWinner = 'Richard Nixon', pWinnerP = 'Republican', pWinnerPct = 46.5;
    let pRunner = 'Hubert Humphrey', pRunnerP = 'Democratic', pRunnerPct = 43.0;
    let third = 'George Wallace (AIP) 10.5%';
    let lean = 'REP+3.5';

    if (isWallace) {
      pWinner = 'George C. Wallace'; pWinnerP = 'Dixiecrat (American Independent / States\' Rights)'; pWinnerPct = 64.0;
      pRunner = 'Hubert Humphrey'; pRunnerP = 'Democratic'; pRunnerPct = 20.0;
      third = 'Richard Nixon (Rep) 16.0%';
      lean = 'DIXIECRAT+44.0';
    } else if (isHumphrey) {
      pWinner = 'Hubert Humphrey'; pWinnerP = 'Democratic'; pWinnerPct = 49.5;
      pRunner = 'Richard Nixon'; pRunnerP = 'Republican'; pRunnerPct = 43.5;
      third = 'George Wallace (Dixiecrat / AIP) 7.0%';
      lean = 'DEM+6.0';
    }

    return {
      name: st.name, abbr: st.abbr, ev: st.ev1968,
      pWinner, pWinnerP, pWinnerVotes: Math.round(st.ev1968 * 140000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(st.ev1968 * 140000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: third,
      govName: `${st.name} Governor`, govP: pWinnerP === 'American Independent' ? 'Democratic' : pWinnerP,
      govVotes: Math.round(st.ev1968 * 135000), govPct: 51.0,
      sen1: pWinnerP === 'American Independent' ? 'Democratic' : pWinnerP,
      sen2: pWinnerP === 'American Independent' ? 'Democratic' : pWinnerP, sen3: 'N/A',
      hTotal: Math.max(1, Math.round(st.ev1968 - 2)),
      hP1: Math.round(Math.max(1, Math.round(st.ev1968 - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(st.ev1968 - 2)) - Math.round(Math.max(1, Math.round(st.ev1968 - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(st.ev1968 * 2.5), sSenP1: Math.round(st.ev1968 * 1.4), sSenP2: Math.round(st.ev1968 * 1.1),
      sH: Math.round(st.ev1968 * 6.5), sHP1: Math.round(st.ev1968 * 3.6), sHP2: Math.round(st.ev1968 * 2.9),
      lean, notes: 'Southern strategy realignment; 3-way race.'
    };
  });
  addEraStates(1968, 'The Conservative Era', states1968);

  // 7. 2008 (50 States)
  const states2008 = ALL_50_STATES.map(st => {
    const isObama = ['CA', 'CO', 'CT', 'DE', 'FL', 'HI', 'IL', 'IN', 'IA', 'ME', 'MD', 'MA', 'MI', 'MN', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'OH', 'OR', 'PA', 'RI', 'VT', 'VA', 'WA', 'WI'].includes(st.abbr);
    const pWinner = isObama ? 'Barack Obama' : 'John McCain';
    const pWinnerP = isObama ? 'Democratic' : 'Republican';
    const pRunner = isObama ? 'John McCain' : 'Barack Obama';
    const pRunnerP = isObama ? 'Republican' : 'Democratic';
    const pWinnerPct = isObama ? 54.8 : 56.2;
    const pRunnerPct = 100.0 - pWinnerPct - 1.4;
    const lean = isObama ? 'DEM+7.2' : 'REP+10.4';

    return {
      name: st.name, abbr: st.abbr, ev: st.ev2008,
      pWinner, pWinnerP, pWinnerVotes: Math.round(st.ev2008 * 260000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(st.ev2008 * 260000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: 'Ralph Nader (Ind) 0.6%; Bob Barr (Lib) 0.4%',
      govName: `${st.name} Governor`, govP: pWinnerP, govVotes: Math.round(st.ev2008 * 240000), govPct: 53.0,
      sen1: pWinnerP, sen2: pWinnerP, sen3: 'N/A',
      hTotal: Math.max(1, Math.round(st.ev2008 - 2)),
      hP1: Math.round(Math.max(1, Math.round(st.ev2008 - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(st.ev2008 - 2)) - Math.round(Math.max(1, Math.round(st.ev2008 - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(st.ev2008 * 2.5), sSenP1: Math.round(st.ev2008 * 1.5), sSenP2: Math.round(st.ev2008 * 1.0),
      sH: Math.round(st.ev2008 * 6.5), sHP1: Math.round(st.ev2008 * 3.8), sHP2: Math.round(st.ev2008 * 2.7),
      lean, notes: 'Obama coalition 365 EV wave.'
    };
  });
  addEraStates(2008, 'Modern Populist & Polarized Era', states2008);

  // 8. 2024 (50 States Certified Return Baseline)
  const states2024 = ALL_50_STATES.map(st => {
    const isTrump = ['AL', 'AK', 'AZ', 'AR', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'MS', 'MO', 'MT', 'NE', 'NV', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'WV', 'WI', 'WY', 'MI'].includes(st.abbr);
    const pWinner = isTrump ? 'Donald Trump' : 'Kamala Harris';
    const pWinnerP = isTrump ? 'Republican' : 'Democratic';
    const pRunner = isTrump ? 'Kamala Harris' : 'Donald Trump';
    const pRunnerP = isTrump ? 'Democratic' : 'Republican';
    const pWinnerPct = isTrump ? 53.2 : 54.5;
    const pRunnerPct = 100.0 - pWinnerPct - 1.2;
    const lean = isTrump ? 'REP+6.4' : 'DEM+9.0';

    return {
      name: st.name, abbr: st.abbr, ev: st.ev2024,
      pWinner, pWinnerP, pWinnerVotes: Math.round(st.ev2024 * 310000 * (pWinnerPct / 100)), pWinnerPct,
      pRunner, pRunnerP, pRunnerVotes: Math.round(st.ev2024 * 310000 * (pRunnerPct / 100)), pRunnerPct,
      thirdParties: 'Jill Stein (Green) 0.5%; Chase Oliver (Lib) 0.4%',
      govName: `${st.name} Governor`, govP: pWinnerP, govVotes: Math.round(st.ev2024 * 300000), govPct: 52.0,
      sen1: pWinnerP, sen2: pWinnerP, sen3: 'N/A',
      hTotal: Math.max(1, Math.round(st.ev2024 - 2)),
      hP1: Math.round(Math.max(1, Math.round(st.ev2024 - 2)) * (pWinnerPct / 100)),
      hP2: Math.max(1, Math.round(st.ev2024 - 2)) - Math.round(Math.max(1, Math.round(st.ev2024 - 2)) * (pWinnerPct / 100)),
      sSen: Math.round(st.ev2024 * 2.5), sSenP1: Math.round(st.ev2024 * 1.4), sSenP2: Math.round(st.ev2024 * 1.1),
      sH: Math.round(st.ev2024 * 6.5), sHP1: Math.round(st.ev2024 * 3.6), sHP2: Math.round(st.ev2024 * 2.9),
      lean, notes: '2024 certified return scenario baseline.'
    };
  });
  addEraStates(2024, 'Modern Populist & Polarized Era', states2024);
}

module.exports = {
  generateLaterEraStates
};
