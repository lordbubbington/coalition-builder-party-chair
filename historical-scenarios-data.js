/**
 * historical-scenarios-data.js
 * Playable Scenario Catalog & Initializer Registry for Historical Start Dates:
 * - 1792: The Federalist Era (Founding Titans)
 * - 1828: The Jacksonian Revolution (Mass Suffrage & Bank War)
 * - 1860: The House Divided (Civil War Sectional Schism)
 * - 1896: The Cross of Gold (Fourth Party Realignment)
 * - 1912: The Four-Way Titan Battle (TR Bull Moose & Debs)
 * - 1924: The Roaring 20s & Agrarian Revolt (Coolidge vs La Follette)
 * - 1932: The Great Depression & New Deal (FDR Landslide)
 * - 1960: The New Frontier & Dixiecrat Stand (JFK vs Nixon vs Byrd)
 * - 1968: Law & Order & The Dixiecrat Backlash (Nixon vs Humphrey vs Wallace)
 * - 1980: The Reagan Revolution & Anderson Wedge (Reagan vs Carter vs Anderson)
 * - 1992: The Three-Way Realignment (Clinton vs Bush vs Ross Perot 18.9%)
 * - 2000: The Millennial Razor-Wire (Bush vs Gore vs Nader Green)
 * - 2008: The Great Recession & Obama Coalition (Obama 365 EV)
 * - 2016: The Populist Shockwave (Trump vs Clinton vs Johnson 3.3%)
 * - 2024: The Contemporary Baseline (Trump 312 EV vs Harris)
 */

(function() {
  const HISTORICAL_SCENARIOS = [
    {
      id: 'scenario_1792',
      year: 1792,
      eraId: 'era_1_federalist',
      title: '1792: The Founding Titans',
      subtitle: 'Hamiltonian Public Credit vs. Jeffersonian-Madisonian Opposition',
      totalStates: 15,
      totalEVs: 132,
      evToWin: 67,
      playableParties: [
        { id: 'federalist', name: 'Federalist Party', leader: 'John Adams / Alexander Hamilton' },
        { id: 'democratic_republican', name: 'Democratic-Republican Party', leader: 'Thomas Jefferson / James Madison' }
      ],
      emergentPartyIds: ['democratic_republican'],
      briefing: 'With President Washington standing unanimously above faction, partisan warfare erupts over Hamilton’s national bank, assumption of state debts, and the French Revolution. 15 states participate with varying state legislative and popular district selection rules.'
    },
    {
      id: 'scenario_1828',
      year: 1828,
      eraId: 'era_2_antebellum',
      title: '1828: The Jacksonian Revolution',
      subtitle: 'Mass Democracy and the Revenge of the Corrupt Bargain',
      totalStates: 24,
      totalEVs: 261,
      evToWin: 131,
      playableParties: [
        { id: 'jacksonian_democratic', name: 'Democratic Party', leader: 'Andrew Jackson / Martin Van Buren' },
        { id: 'national_republican', name: 'National Republican Party', leader: 'John Quincy Adams / Henry Clay' }
      ],
      emergentPartyIds: ['jacksonian_democratic'],
      briefing: 'Andrew Jackson mobilizes the newly enfranchised common men of the West and South against the patrician Adams-Clay administration. Turnout triples as popular voting for electors becomes almost universal across 24 states.'
    },
    {
      id: 'scenario_1860',
      year: 1860,
      eraId: 'era_3_industrial',
      title: '1860: The House Divided',
      subtitle: 'The Four-Way Schism and the Eve of the Civil War',
      totalStates: 33,
      totalEVs: 303,
      evToWin: 152,
      playableParties: [
        { id: 'republican_1860', name: 'Republican Party', leader: 'Abraham Lincoln' },
        { id: 'northern_democrat', name: 'Northern Democratic Party', leader: 'Stephen A. Douglas' },
        { id: 'southern_democrat', name: 'Southern Democratic Party', leader: 'John C. Breckinridge' },
        { id: 'constitutional_union', name: 'Constitutional Union Party', leader: 'John Bell' }
      ],
      emergentPartyIds: ['republican_1860', 'constitutional_union'],
      briefing: 'The Democratic Party tears in two at Charleston. Abraham Lincoln sweeps the Northern free states without appearing on Southern ballots, while Breckinridge and Bell divide the South, precipitating the secession crisis.'
    },
    {
      id: 'scenario_1896',
      year: 1896,
      eraId: 'era_4_progressive',
      title: '1896: The Cross of Gold',
      subtitle: 'Urban Industrial Hegemony vs. Agrarian Silver Populism',
      totalStates: 45,
      totalEVs: 447,
      evToWin: 224,
      playableParties: [
        { id: 'republican_1896', name: 'Republican Party', leader: 'William McKinley / Mark Hanna' },
        { id: 'democrat_populist', name: 'Democratic-Populist Coalition', leader: 'William Jennings Bryan' },
        { id: 'gold_democrats', name: 'National Democratic (Gold)', leader: 'John M. Palmer' }
      ],
      emergentPartyIds: ['democrat_populist'],
      briefing: 'Mark Hanna mobilizes millions in corporate campaign funds for McKinley\'s "Front Porch Campaign" against 36-year-old orator William Jennings Bryan\'s whirlwind "Cross of Gold" prairie crusade. Establishes the Fourth Party System.'
    },
    {
      id: 'scenario_1912',
      year: 1912,
      eraId: 'era_4_progressive',
      title: '1912: The Clash of Titans',
      subtitle: 'Four Visions for American Capitalism: TR, Wilson, Taft, and Debs',
      totalStates: 48,
      totalEVs: 531,
      evToWin: 266,
      playableParties: [
        { id: 'democratic_1912', name: 'Democratic Party', leader: 'Woodrow Wilson' },
        { id: 'prog_bull_moose', name: 'Progressive Party ("Bull Moose")', leader: 'Theodore Roosevelt' },
        { id: 'republican_1912', name: 'Republican Party', leader: 'William Howard Taft' },
        { id: 'socialist_spa_1912', name: 'Socialist Party of America', leader: 'Eugene V. Debs' }
      ],
      emergentPartyIds: ['prog_bull_moose', 'socialist_spa_1912'],
      briefing: 'Theodore Roosevelt bolts the GOP to launch the Bull Moose crusade, fracturing the Republican vote. Eugene V. Debs commands over 900,000 votes for the Socialists, while Woodrow Wilson navigates the historic 4-way battlefield to capture 435 EVs.'
    },
    {
      id: 'scenario_1924',
      year: 1924,
      eraId: 'era_4_progressive',
      title: '1924: The Jazz Age & Agrarian Revolt',
      subtitle: 'Coolidge Prosperity vs. Fighting Bob La Follette\'s Independent Incursion',
      totalStates: 48,
      totalEVs: 531,
      evToWin: 266,
      playableParties: [
        { id: 'republican_1924', name: 'Republican Party', leader: 'Calvin Coolidge' },
        { id: 'democratic_1924', name: 'Democratic Party', leader: 'John W. Davis' },
        { id: 'progressive_cppa_1924', name: 'Progressive Party / CPPA', leader: 'Robert M. La Follette' }
      ],
      emergentPartyIds: ['progressive_cppa_1924'],
      briefing: 'Following a deadlocked 103-ballot Democratic convention, "Silent Cal" Coolidge rides booming urban prosperity ("Keep Cool with Coolidge"), while Fighting Bob La Follette marshals railroad unions and prairie grain farmers into a 16.6% popular vote insurgency.'
    },
    {
      id: 'scenario_1932',
      year: 1932,
      eraId: 'era_5_liberal',
      title: '1932: The Great Depression & New Deal',
      subtitle: 'The Shattering of Hoover’s GOP and the Rise of the New Deal Coalition',
      totalStates: 48,
      totalEVs: 531,
      evToWin: 266,
      playableParties: [
        { id: 'democratic_1932', name: 'Democratic Party', leader: 'Franklin D. Roosevelt' },
        { id: 'republican_1932', name: 'Republican Party', leader: 'Herbert Hoover' },
        { id: 'socialist_1932', name: 'Socialist Party', leader: 'Norman Thomas' }
      ],
      emergentPartyIds: ['democratic_1932'],
      briefing: 'With 25% national unemployment and the Bonus Army routed in Washington, Franklin D. Roosevelt forges the historic New Deal coalition of urban labor, ethnics, farmers, and the Solid South, carrying 42 of 48 states.'
    },
    {
      id: 'scenario_1960',
      year: 1960,
      eraId: 'era_5_liberal',
      title: '1960: The New Frontier & The Dixiecrat Stand',
      subtitle: 'The First Televised Debates and the Southern Elector Mutiny',
      totalStates: 50,
      totalEVs: 537,
      evToWin: 269,
      playableParties: [
        { id: 'democratic_1960', name: 'Democratic Party', leader: 'John F. Kennedy' },
        { id: 'republican_1960', name: 'Republican Party', leader: 'Richard Nixon' },
        { id: 'dixiecrat_states_rights', name: 'Dixiecrat Party (States\' Rights)', leader: 'Harry F. Byrd' }
      ],
      emergentPartyIds: ['dixiecrat_states_rights'],
      briefing: 'The razor-close clash between JFK and Vice President Nixon comes down to 112,000 votes nationwide and dramatic Chicago machine returns. Meanwhile, unpledged Dixiecrat electors carry Mississippi and Alabama outright, withholding 15 Electoral Votes.'
    },
    {
      id: 'scenario_1968',
      year: 1968,
      eraId: 'era_6_conservative',
      title: '1968: Law & Order & The Dixiecrat Backlash',
      subtitle: 'The Vietnam War, Urban Crisis, and George Wallace’s 46-EV Shockwave',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'republican_1968', name: 'Republican Party', leader: 'Richard Nixon' },
        { id: 'democratic_1968', name: 'Democratic Party', leader: 'Hubert Humphrey' },
        { id: 'dixiecrat_states_rights', name: 'Dixiecrat Party (Wallace AIP)', leader: 'George C. Wallace' }
      ],
      emergentPartyIds: ['dixiecrat_states_rights'],
      briefing: 'Amid assassinations, anti-war turmoil, and the Chicago convention riots, Richard Nixon promises "Law and Order" to the Silent Majority, while Alabama Governor George Wallace mounts a massive populist insurgent campaign carrying 5 Deep South states.'
    },
    {
      id: 'scenario_1980',
      year: 1980,
      eraId: 'era_6_conservative',
      title: '1980: The Reagan Revolution & Anderson Wedge',
      subtitle: 'Stagflation, The Iran Hostage Crisis, and the 489-EV Republican Sweep',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'republican_1980', name: 'Republican Party', leader: 'Ronald Reagan' },
        { id: 'democratic_1980', name: 'Democratic Party', leader: 'Jimmy Carter' },
        { id: 'national_unity_anderson', name: 'National Unity Campaign', leader: 'John B. Anderson' },
        { id: 'libertarian_1980', name: 'Libertarian Party', leader: 'Ed Clark' }
      ],
      emergentPartyIds: ['national_unity_anderson', 'libertarian_1980'],
      briefing: 'Ronald Reagan questions "Are you better off than you were four years ago?", forging an electoral tidal wave that flips the Senate for the first time in 26 years. John Anderson draws 5.7M suburban votes, while the Libertarians qualify in all 50 states.'
    },
    {
      id: 'scenario_1992',
      year: 1992,
      eraId: 'era_6_conservative',
      title: '1992: The Three-Way Realignment',
      subtitle: '"It\'s The Economy, Stupid" & Ross Perot\'s 19% Reform Wave',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'democratic_1992', name: 'Democratic Party', leader: 'Bill Clinton' },
        { id: 'republican_1992', name: 'Republican Party', leader: 'George H.W. Bush' },
        { id: 'reform_perot_1992', name: 'United We Stand America (Perot)', leader: 'H. Ross Perot' }
      ],
      emergentPartyIds: ['reform_perot_1992'],
      briefing: 'Billionaire Ross Perot enters the race on Larry King Live, purchasing primetime infomercials to rail against the national debt and NAFTA. Bill Clinton triangulates as a "New Democrat" to defeat incumbent George H.W. Bush with 370 EVs.'
    },
    {
      id: 'scenario_2000',
      year: 2000,
      eraId: 'era_6_conservative',
      title: '2000: The Millennial Razor-Wire',
      subtitle: 'The 537-Vote Florida Recount & Ralph Nader\'s Green Breakthrough',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'republican_2000', name: 'Republican Party', leader: 'George W. Bush' },
        { id: 'democratic_2000', name: 'Democratic Party', leader: 'Al Gore' },
        { id: 'green_nader_2000', name: 'Green Party', leader: 'Ralph Nader' },
        { id: 'reform_2000', name: 'Reform Party', leader: 'Pat Buchanan' }
      ],
      emergentPartyIds: ['green_nader_2000'],
      briefing: 'A knife-edge constitutional election decided by 537 votes in Florida and Bush v. Gore. Ralph Nader commands 2.88M votes, filling 15,000-seat arenas, while the U.S. Senate lands in an exact 50–50 tie.'
    },
    {
      id: 'scenario_2008',
      year: 2008,
      eraId: 'era_7_modern',
      title: '2008: Hope, Change & The Great Recession',
      subtitle: 'Barack Obama\'s 365-EV Landslide & The 60-Seat Filibuster Majority',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'democratic_2008', name: 'Democratic Party', leader: 'Barack Obama' },
        { id: 'republican_2008', name: 'Republican Party', leader: 'John McCain' },
        { id: 'libertarian_2008', name: 'Libertarian Party', leader: 'Bob Barr' },
        { id: 'independent_nader_2008', name: 'Independent Campaign', leader: 'Ralph Nader' }
      ],
      emergentPartyIds: ['democratic_2008'],
      briefing: 'Amid the collapse of Lehman Brothers and the Iraq War, Barack Obama electrifies the electorate, winning 69.5M votes, flipping Indiana, North Carolina, and Virginia, and unlocking a brief 60-seat Senate supermajority.'
    },
    {
      id: 'scenario_2016',
      year: 2016,
      eraId: 'era_7_modern',
      title: '2016: The Populist Shockwave',
      subtitle: 'Breaching the "Blue Wall" & The Historic Johnson-Weld Libertarian Surge',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'republican_2016', name: 'Republican Party', leader: 'Donald Trump' },
        { id: 'democratic_2016', name: 'Democratic Party', leader: 'Hillary Clinton' },
        { id: 'libertarian_johnson_2016', name: 'Libertarian Party (Johnson-Weld)', leader: 'Gary Johnson' },
        { id: 'green_stein_2016', name: 'Green Party', leader: 'Jill Stein' }
      ],
      emergentPartyIds: ['libertarian_johnson_2016'],
      briefing: 'Donald Trump stages a populist realignment, capturing Pennsylvania, Michigan, and Wisconsin by a combined 77,000 votes. Gary Johnson and Bill Weld achieve 4.5M votes (3.3%), while Jill Stein wins 1.45M progressive votes.'
    },
    {
      id: 'scenario_2024',
      year: 2024,
      eraId: 'era_7_modern',
      title: '2024: The Certified Scenario Baseline',
      subtitle: 'The 312-EV Trump Resurgence & The Battleground Senate Flip',
      totalStates: 50,
      totalEVs: 538,
      evToWin: 270,
      playableParties: [
        { id: 'republican_2024', name: 'Republican Party', leader: 'Donald Trump' },
        { id: 'democratic_2024', name: 'Democratic Party', leader: 'Kamala Harris' },
        { id: 'libertarian_2024', name: 'Libertarian Party', leader: 'Chase Oliver' },
        { id: 'green_2024', name: 'Green Party', leader: 'Jill Stein' }
      ],
      emergentPartyIds: [],
      briefing: 'Donald Trump sweeps all seven battlegrounds (AZ, NV, GA, NC, PA, MI, WI) to capture 312 EVs and a national popular vote plurality (49.8%), flipping the Senate to 53–47. Live certified baseline leading into the 2026/2028 game.'
    }
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HISTORICAL_SCENARIOS;
  }
  if (typeof window !== 'undefined') {
    if (!window.PartyChairData) window.PartyChairData = {};
    window.PartyChairData.HISTORICAL_SCENARIOS = HISTORICAL_SCENARIOS;
  }
})();
