/**
 * historical-data-era7.cjs
 * ERA 7: MODERN POPULIST & POLARIZED ERA (2006 - 2024)
 * 2006 wave, Obama coalition, 2010 Tea Party wave, 2016 Trump realignment,
 * 2020 pandemic election, 2024 certified return baseline
 */

module.exports = [
  {
    year: 2006,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 81800000,
      majorityParty: 'Democratic (+31 seats; Pelosi First Female Speaker)',
      parties: [
        { name: 'Democratic', seats: 233, votes: 42372400, pct: 51.8 },
        { name: 'Republican', seats: 202, votes: 36237400, pct: 44.3 },
        { name: 'Independent', seats: 0, votes: 3190200, pct: 3.9 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic Majority (51–49 caucus with Sanders & Lieberman)',
      parties: [
        { name: 'Democratic', seatsWon: 22, seatsTotal: 49, votes: 32850000, pct: 52.6 },
        { name: 'Republican', seatsWon: 10, seatsTotal: 49, votes: 27120000, pct: 43.4 },
        { name: 'Independent (Sanders & Lieberman)', seatsWon: 2, seatsTotal: 2, votes: 2480000, pct: 4.0 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 28, party2: 'Republican', party2Held: 22, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 53, party2Chambers: 44, dividedChambers: 2, trifectasParty1: 15, trifectasParty2: 10, dividedGov: 25 },
    notes: 'Iraq War backlash; Democrats flip both House (+31) and Senate (+6).'
  },
  {
    year: 2008,
    type: 'presidential',
    pres: {
      totalVotes: 131313820,
      isEstimated: false,
      winner: { name: 'Barack Obama', party: 'Democratic', votes: 69498516, pct: 52.9, ev: 365 },
      runnerUp: { name: 'John McCain', party: 'Republican', votes: 59948323, pct: 45.7, ev: 173 },
      thirdParties: [
        { name: 'Ralph Nader', party: 'Independent', votes: 739034, pct: 0.6, ev: 0 },
        { name: 'Bob Barr', party: 'Libertarian', votes: 523715, pct: 0.4, ev: 0 },
        { name: 'Chuck Baldwin', party: 'Constitution', votes: 199427, pct: 0.2, ev: 0 },
        { name: 'Cynthia McKinney', party: 'Green', votes: 161797, pct: 0.1, ev: 0 }
      ]
    },
    house: {
      totalVotes: 131300000,
      majorityParty: 'Democratic (+21 seats: 257 seats)',
      parties: [
        { name: 'Democratic', seats: 257, votes: 69851600, pct: 53.2 },
        { name: 'Republican', seats: 178, votes: 55933800, pct: 42.6 },
        { name: 'Independent', seats: 0, votes: 5514600, pct: 4.2 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic Supermajority (+8 seats: 60-seat caucus)',
      parties: [
        { name: 'Democratic', seatsWon: 20, seatsTotal: 57, votes: 35120000, pct: 53.8 },
        { name: 'Republican', seatsWon: 15, seatsTotal: 41, votes: 27950000, pct: 42.8 },
        { name: 'Independent (Sanders & Lieberman)', seatsWon: 0, seatsTotal: 2, votes: 2200000, pct: 3.4 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 29, party2: 'Republican', party2Held: 21, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 60, party2Chambers: 37, dividedChambers: 2, trifectasParty1: 17, trifectasParty2: 9, dividedGov: 24 },
    notes: 'Historic election of first African American president. Great Financial Crisis. Democrats achieve 60-seat Senate supermajority.'
  },
  {
    year: 2010,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 86900000,
      majorityParty: 'Republican Landslide (+63 seats; Largest swing since 1948)',
      parties: [
        { name: 'Republican', seats: 242, votes: 44927300, pct: 51.7 },
        { name: 'Democratic', seats: 193, votes: 39018100, pct: 44.9 },
        { name: 'Independent', seats: 0, votes: 2954600, pct: 3.4 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 37,
      majorityParty: 'Democratic Narrowed Majority (53–47 caucus)',
      parties: [
        { name: 'Republican', seatsWon: 24, seatsTotal: 47, votes: 35120000, pct: 51.4 },
        { name: 'Democratic', seatsWon: 13, seatsTotal: 51, votes: 31250000, pct: 45.7 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 2, votes: 1980000, pct: 2.9 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 29, party2: 'Democratic', party2Held: 20, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 57, party2Chambers: 39, dividedChambers: 3, trifectasParty1: 21, trifectasParty2: 11, dividedGov: 18 },
    notes: 'Tea Party wave; Republicans flip 63 House seats and flip 20 state legislative chambers, controlling 2011 redistricting.'
  },
  {
    year: 2012,
    type: 'presidential',
    pres: {
      totalVotes: 129085410,
      isEstimated: false,
      winner: { name: 'Barack Obama', party: 'Democratic', votes: 65915795, pct: 51.1, ev: 332 },
      runnerUp: { name: 'Mitt Romney', party: 'Republican', votes: 60933504, pct: 47.2, ev: 206 },
      thirdParties: [
        { name: 'Gary Johnson', party: 'Libertarian', votes: 1275971, pct: 1.0, ev: 0 },
        { name: 'Jill Stein', party: 'Green', votes: 469627, pct: 0.4, ev: 0 }
      ]
    },
    house: {
      totalVotes: 129000000,
      majorityParty: 'Republican (Retains majority despite Democratic popular plurality)',
      parties: [
        { name: 'Democratic', seats: 201, votes: 62823000, pct: 48.7 },
        { name: 'Republican', seats: 234, votes: 61404000, pct: 47.6 },
        { name: 'Libertarian', seats: 0, votes: 1806000, pct: 1.4 },
        { name: 'Other', seats: 0, votes: 2967000, pct: 2.3 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic (+2 seats: 55-seat caucus)',
      parties: [
        { name: 'Democratic', seatsWon: 23, seatsTotal: 53, votes: 36250000, pct: 53.7 },
        { name: 'Republican', seatsWon: 8, seatsTotal: 45, votes: 28950000, pct: 42.9 },
        { name: 'Independent (Sanders & King)', seatsWon: 2, seatsTotal: 2, votes: 2320000, pct: 3.4 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 30, party2: 'Democratic', party2Held: 19, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 57, party2Chambers: 40, dividedChambers: 2, trifectasParty1: 24, trifectasParty2: 13, dividedGov: 13 },
    notes: 'Obama reelected with 332 EVs. Democrats win national House popular vote by 1.4M but win 33 fewer seats due to redistricting.'
  },
  {
    year: 2014,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 83200000,
      majorityParty: 'Republican (+13 seats: 247 seats; Largest GOP House since 1928)',
      parties: [
        { name: 'Republican', seats: 247, votes: 42681600, pct: 51.3 },
        { name: 'Democratic', seats: 188, votes: 37772800, pct: 45.4 },
        { name: 'Libertarian', seats: 0, votes: 1248000, pct: 1.5 },
        { name: 'Other', seats: 0, votes: 1497600, pct: 1.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Republican (+9 seats; Flips Senate 54–44–2)',
      parties: [
        { name: 'Republican', seatsWon: 24, seatsTotal: 54, votes: 26850000, pct: 52.8 },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 44, votes: 21950000, pct: 43.2 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 2, votes: 2020000, pct: 4.0 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 31, party2: 'Democratic', party2Held: 18, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 68, party2Chambers: 29, dividedChambers: 2, trifectasParty1: 24, trifectasParty2: 7, dividedGov: 19 },
    notes: 'Republicans take Senate with 9-seat flip; Mitch McConnell becomes Majority Leader. Historic GOP dominance at state level.'
  },
  {
    year: 2016,
    type: 'presidential',
    pres: {
      totalVotes: 136669276,
      isEstimated: false,
      winner: { name: 'Donald Trump', party: 'Republican', votes: 62984828, pct: 46.1, ev: 304 },
      runnerUp: { name: 'Hillary Clinton', party: 'Democratic', votes: 65853514, pct: 48.2, ev: 227 },
      thirdParties: [
        { name: 'Gary Johnson', party: 'Libertarian', votes: 4489303, pct: 3.3, ev: 0 },
        { name: 'Jill Stein', party: 'Green', votes: 1457218, pct: 1.1, ev: 0 },
        { name: 'Evan McMullin', party: 'Independent', votes: 731991, pct: 0.5, ev: 0 }
      ]
    },
    house: {
      totalVotes: 136600000,
      majorityParty: 'Republican (Holds 241–194)',
      parties: [
        { name: 'Republican', seats: 241, votes: 67070600, pct: 49.1 },
        { name: 'Democratic', seats: 194, votes: 65568000, pct: 48.0 },
        { name: 'Libertarian', seats: 0, votes: 2185600, pct: 1.6 },
        { name: 'Other', seats: 0, votes: 1775800, pct: 1.3 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican (Holds 52–46–2)',
      parties: [
        { name: 'Republican', seatsWon: 22, seatsTotal: 52, votes: 40450000, pct: 49.4 },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 46, votes: 38850000, pct: 47.4 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 2, votes: 2620000, pct: 3.2 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 33, party2: 'Democratic', party2Held: 16, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 67, party2Chambers: 31, dividedChambers: 1, trifectasParty1: 25, trifectasParty2: 6, dividedGov: 19 },
    notes: 'Trump populist realignment breaches "Blue Wall" (PA, MI, WI); Clinton wins national popular vote by 2.87M votes.'
  },
  {
    year: 2018,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 114000000,
      majorityParty: 'Democratic Blue Wave (+41 seats)',
      parties: [
        { name: 'Democratic', seats: 235, votes: 60870000, pct: 53.4 },
        { name: 'Republican', seats: 199, votes: 51072000, pct: 44.8 },
        { name: 'Libertarian', seats: 0, votes: 1140000, pct: 1.0 },
        { name: 'Other', seats: 0, votes: 918000, pct: 0.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Republican (+2 seats: 53–45–2)',
      parties: [
        { name: 'Democratic', seatsWon: 24, seatsTotal: 45, votes: 52200000, pct: 58.2 },
        { name: 'Republican', seatsWon: 11, seatsTotal: 53, votes: 34700000, pct: 38.7 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 2, votes: 2820000, pct: 3.1 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 27, party2: 'Democratic', party2Held: 23, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 61, party2Chambers: 37, dividedChambers: 1, trifectasParty1: 22, trifectasParty2: 14, dividedGov: 14 },
    notes: 'Record midterm turnout (50.3%); Democrats sweep suburban districts to flip House; GOP expands Senate majority in red states.'
  },
  {
    year: 2020,
    type: 'presidential',
    pres: {
      totalVotes: 158429631,
      isEstimated: false,
      winner: { name: 'Joe Biden', party: 'Democratic', votes: 81283501, pct: 51.3, ev: 306 },
      runnerUp: { name: 'Donald Trump', party: 'Republican', votes: 74223975, pct: 46.8, ev: 232 },
      thirdParties: [
        { name: 'Jo Jorgensen', party: 'Libertarian', votes: 1865724, pct: 1.2, ev: 0 },
        { name: 'Howie Hawkins', party: 'Green', votes: 405035, pct: 0.3, ev: 0 }
      ]
    },
    house: {
      totalVotes: 158400000,
      majorityParty: 'Democratic Narrow Majority (222–213)',
      parties: [
        { name: 'Democratic', seats: 222, votes: 77299200, pct: 48.8 },
        { name: 'Republican', seats: 213, votes: 75715200, pct: 47.8 },
        { name: 'Libertarian', seats: 0, votes: 2376000, pct: 1.5 },
        { name: 'Other', seats: 0, votes: 3009600, pct: 1.9 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Even Split (50–50 caucus; VP Harris tie-breaker)',
      parties: [
        { name: 'Democratic', seatsWon: 17, seatsTotal: 48, votes: 44250000, pct: 50.1 },
        { name: 'Republican', seatsWon: 18, seatsTotal: 50, votes: 42120000, pct: 47.7 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 2, votes: 1950000, pct: 2.2 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 27, party2: 'Democratic', party2Held: 23, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 61, party2Chambers: 37, dividedChambers: 1, trifectasParty1: 23, trifectasParty2: 15, dividedGov: 12 },
    notes: 'COVID-19 pandemic election; highest turnout since 1900 (66.7%). Georgia Senate runoffs give Democrats 50–50 majority.'
  },
  {
    year: 2022,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 107300000,
      majorityParty: 'Republican Narrow Majority (222–213)',
      parties: [
        { name: 'Republican', seats: 222, votes: 54508400, pct: 50.8 },
        { name: 'Democratic', seats: 213, votes: 51289400, pct: 47.8 },
        { name: 'Libertarian', seats: 0, votes: 751100, pct: 0.7 },
        { name: 'Other', seats: 0, votes: 751100, pct: 0.7 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic (+1 seat: 51–49 caucus)',
      parties: [
        { name: 'Democratic', seatsWon: 15, seatsTotal: 49, votes: 28450000, pct: 50.2 },
        { name: 'Republican', seatsWon: 20, seatsTotal: 49, votes: 26850000, pct: 47.4 },
        { name: 'Independent (Sanders & King)', seatsWon: 0, seatsTotal: 2, votes: 1350000, pct: 2.4 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 26, party2: 'Democratic', party2Held: 24, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 57, party2Chambers: 40, dividedChambers: 2, trifectasParty1: 22, trifectasParty2: 17, dividedGov: 11 },
    notes: 'Dobbs decision reshapes midterm environment; Republicans take narrow House majority, Democrats expand Senate.'
  },
  {
    year: 2024,
    type: 'presidential',
    pres: {
      totalVotes: 155250000,
      isEstimated: false,
      winner: { name: 'Donald Trump', party: 'Republican', votes: 77302580, pct: 49.8, ev: 312 },
      runnerUp: { name: 'Kamala Harris', party: 'Democratic', votes: 74976462, pct: 48.3, ev: 226 },
      thirdParties: [
        { name: 'Jill Stein', party: 'Green', votes: 775000, pct: 0.5, ev: 0 },
        { name: 'Chase Oliver', party: 'Libertarian', votes: 639000, pct: 0.4, ev: 0 }
      ]
    },
    house: {
      totalVotes: 155000000,
      majorityParty: 'Republican Narrow Majority (220–215)',
      parties: [
        { name: 'Republican', seats: 220, votes: 77810000, pct: 50.2 },
        { name: 'Democratic', seats: 215, votes: 75175000, pct: 48.5 },
        { name: 'Other', seats: 0, votes: 2015000, pct: 1.3 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican (+4 seats: 53–47)',
      parties: [
        { name: 'Republican', seatsWon: 18, seatsTotal: 53, votes: 34120000, pct: 51.5 },
        { name: 'Democratic', seatsWon: 16, seatsTotal: 47, votes: 30850000, pct: 46.5 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 0, votes: 1350000, pct: 2.0 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 27, party2: 'Democratic', party2Held: 23, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7383, party1Chambers: 57, party2Chambers: 40, dividedChambers: 2, trifectasParty1: 23, trifectasParty2: 17, dividedGov: 10 },
    notes: 'Trump sweeps all 7 swing states (AZ, NV, GA, NC, PA, MI, WI); flips Senate (WV, MT, OH, PA). Live scenario baseline entering 2026/2028.'
  }
];
