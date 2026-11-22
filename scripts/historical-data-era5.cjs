/**
 * historical-data-era5.cjs
 * ERA 5: THE LIBERAL ERA (1932 - 1964)
 * New Deal Coalition, WWII, Cold War, Eisenhower, Civil Rights Act, LBJ landslide
 */

module.exports = [
  {
    year: 1932,
    type: 'presidential',
    pres: {
      totalVotes: 39749382,
      isEstimated: false,
      winner: { name: 'Franklin D. Roosevelt', party: 'Democratic', votes: 22821277, pct: 57.4, ev: 472 },
      runnerUp: { name: 'Herbert Hoover', party: 'Republican', votes: 15761254, pct: 39.7, ev: 59 },
      thirdParties: [
        { name: 'Norman Thomas', party: 'Socialist', votes: 884885, pct: 2.2, ev: 0 },
        { name: 'William Z. Foster', party: 'Communist', votes: 103307, pct: 0.3, ev: 0 }
      ]
    },
    house: {
      totalVotes: 39500000,
      majorityParty: 'Democratic Supermajority (+97 seats)',
      parties: [
        { name: 'Democratic', seats: 313, votes: 22515000, pct: 57.0 },
        { name: 'Republican', seats: 117, votes: 15800000, pct: 40.0 },
        { name: 'Farmer-Labor', seats: 5, votes: 1185000, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 29, seatsTotal: 59, votes: 11450000, pct: 58.2 },
        { name: 'Republican', seatsWon: 6, seatsTotal: 36, votes: 7620000, pct: 38.7 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 610000, pct: 3.1 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 38, party2: 'Republican', party2Held: 9, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 74, party2Chambers: 20, dividedChambers: 2, trifectasParty1: 35, trifectasParty2: 8, dividedGov: 5 },
    notes: 'Historic New Deal realignment; massive Democratic majorities across all branches.'
  },
  {
    year: 1934,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 32300000,
      majorityParty: 'Democratic Supermajority (+9 seats)',
      parties: [
        { name: 'Democratic', seats: 322, votes: 18411000, pct: 57.0 },
        { name: 'Republican', seats: 103, votes: 12274000, pct: 38.0 },
        { name: 'Progressive (WI)', seats: 7, votes: 969000, pct: 3.0 },
        { name: 'Farmer-Labor', seats: 3, votes: 646000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic Supermajority (+10 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 28, seatsTotal: 69, votes: 9850000, pct: 58.6 },
        { name: 'Republican', seatsWon: 5, seatsTotal: 25, votes: 6210000, pct: 36.9 },
        { name: 'Progressive', seatsWon: 1, seatsTotal: 1, votes: 410000, pct: 2.4 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 350000, pct: 2.1 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 39, party2: 'Republican', party2Held: 8, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 78, party2Chambers: 16, dividedChambers: 2, trifectasParty1: 37, trifectasParty2: 7, dividedGov: 4 },
    notes: 'Historic first midterm where the White House party gained seats in both House and Senate.'
  },
  {
    year: 1936,
    type: 'presidential',
    pres: {
      totalVotes: 45647699,
      isEstimated: false,
      winner: { name: 'Franklin D. Roosevelt', party: 'Democratic', votes: 27752648, pct: 60.8, ev: 523 },
      runnerUp: { name: 'Alf Landon', party: 'Republican', votes: 16681862, pct: 36.5, ev: 8 },
      thirdParties: [
        { name: 'William Lemke', party: 'Union Party', votes: 892378, pct: 2.0, ev: 0 },
        { name: 'Norman Thomas', party: 'Socialist', votes: 187910, pct: 0.4, ev: 0 },
        { name: 'Earl Browder', party: 'Communist', votes: 80160, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 45500000,
      majorityParty: 'Democratic Supermajority (334 seats)',
      parties: [
        { name: 'Democratic', seats: 334, votes: 27300000, pct: 60.0 },
        { name: 'Republican', seats: 88, votes: 16380000, pct: 36.0 },
        { name: 'Progressive', seats: 8, votes: 910000, pct: 2.0 },
        { name: 'Farmer-Labor', seats: 5, votes: 910000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Democratic Supermajority (76 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 30, seatsTotal: 76, votes: 14200000, pct: 61.5 },
        { name: 'Republican', seatsWon: 4, seatsTotal: 16, votes: 7850000, pct: 34.0 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 2, votes: 520000, pct: 2.3 },
        { name: 'Independent / Progressive', seatsWon: 1, seatsTotal: 2, votes: 510000, pct: 2.2 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 42, party2: 'Republican', party2Held: 5, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 80, party2Chambers: 14, dividedChambers: 1, trifectasParty1: 40, trifectasParty2: 4, dividedGov: 4 },
    notes: 'FDR 523–8 EV landslide (Landon wins only ME and VT). Nebraska adopts non-partisan unicameral legislature (95 chambers total).'
  },
  {
    year: 1938,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 36300000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 262, votes: 18513000, pct: 51.0 },
        { name: 'Republican', seats: 169, votes: 16335000, pct: 45.0 },
        { name: 'Progressive', seats: 2, votes: 726000, pct: 2.0 },
        { name: 'Other', seats: 2, votes: 726000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Democratic Supermajority',
      parties: [
        { name: 'Democratic', seatsWon: 27, seatsTotal: 69, votes: 9450000, pct: 52.8 },
        { name: 'Republican', seatsWon: 8, seatsTotal: 23, votes: 7720000, pct: 43.1 },
        { name: 'Progressive / Farmer-Labor', seatsWon: 1, seatsTotal: 4, votes: 730000, pct: 4.1 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 30, party2: 'Republican', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 64, party2Chambers: 29, dividedChambers: 2, trifectasParty1: 29, trifectasParty2: 14, dividedGov: 5 },
    notes: 'Court-packing fight, sit-down strikes, and Roosevelt recession trigger Republican rebound.'
  },
  {
    year: 1940,
    type: 'presidential',
    pres: {
      totalVotes: 49891051,
      isEstimated: false,
      winner: { name: 'Franklin D. Roosevelt', party: 'Democratic', votes: 27313945, pct: 54.7, ev: 449 },
      runnerUp: { name: 'Wendell Willkie', party: 'Republican', votes: 22347744, pct: 44.8, ev: 82 },
      thirdParties: [
        { name: 'Norman Thomas', party: 'Socialist', votes: 116599, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 49800000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 267, votes: 26394000, pct: 53.0 },
        { name: 'Republican', seats: 162, votes: 22410000, pct: 45.0 },
        { name: 'Progressive', seats: 3, votes: 498000, pct: 1.0 },
        { name: 'Other', seats: 3, votes: 498000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Democratic Supermajority',
      parties: [
        { name: 'Democratic', seatsWon: 24, seatsTotal: 66, votes: 12900000, pct: 54.5 },
        { name: 'Republican', seatsWon: 11, seatsTotal: 28, votes: 10250000, pct: 43.3 },
        { name: 'Other', seatsWon: 1, seatsTotal: 2, votes: 520000, pct: 2.2 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 30, party2: 'Republican', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 64, party2Chambers: 30, dividedChambers: 1, trifectasParty1: 28, trifectasParty2: 15, dividedGov: 5 },
    notes: 'Historic 3rd term election on eve of WWII; Willkie runs aggressive campaign.'
  },
  {
    year: 1942,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 28000000,
      majorityParty: 'Democratic Narrow Majority',
      parties: [
        { name: 'Democratic', seats: 222, votes: 14000000, pct: 50.0 },
        { name: 'Republican', seats: 209, votes: 13440000, pct: 48.0 },
        { name: 'Progressive', seats: 2, votes: 280000, pct: 1.0 },
        { name: 'Other', seats: 2, votes: 280000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 19, seatsTotal: 57, votes: 7120000, pct: 50.5 },
        { name: 'Republican', seatsWon: 15, seatsTotal: 38, votes: 6720000, pct: 47.7 },
        { name: 'Progressive', seatsWon: 1, seatsTotal: 1, votes: 250000, pct: 1.8 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 24, party2: 'Democratic', party2Held: 24, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 50, party2Chambers: 44, dividedChambers: 1, trifectasParty1: 23, trifectasParty2: 21, dividedGov: 4 },
    notes: 'Wartime midterm with low turnout (millions of soldiers overseas); GOP gains 47 House seats.'
  },
  {
    year: 1944,
    type: 'presidential',
    pres: {
      totalVotes: 47976670,
      isEstimated: false,
      winner: { name: 'Franklin D. Roosevelt', party: 'Democratic', votes: 25612916, pct: 53.4, ev: 432 },
      runnerUp: { name: 'Thomas E. Dewey', party: 'Republican', votes: 22017929, pct: 45.9, ev: 99 },
      thirdParties: []
    },
    house: {
      totalVotes: 48000000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 242, votes: 25440000, pct: 53.0 },
        { name: 'Republican', seats: 191, votes: 22080000, pct: 46.0 },
        { name: 'Other', seats: 2, votes: 480000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 20, seatsTotal: 57, votes: 11200000, pct: 53.8 },
        { name: 'Republican', seatsWon: 14, seatsTotal: 38, votes: 9380000, pct: 45.1 },
        { name: 'Progressive', seatsWon: 1, seatsTotal: 1, votes: 230000, pct: 1.1 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 26, party2: 'Democratic', party2Held: 22, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 52, party2Chambers: 42, dividedChambers: 1, trifectasParty1: 22, trifectasParty2: 21, dividedGov: 5 },
    notes: 'FDR 4th term win during final stages of WWII in Europe and Pacific.'
  },
  {
    year: 1946,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 34400000,
      majorityParty: 'Republican ("Had Enough?")',
      parties: [
        { name: 'Republican', seats: 246, votes: 18576000, pct: 54.0 },
        { name: 'Democratic', seats: 188, votes: 15480000, pct: 45.0 },
        { name: 'Other', seats: 1, votes: 344000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 23, seatsTotal: 51, votes: 8520000, pct: 54.8 },
        { name: 'Democratic', seatsWon: 13, seatsTotal: 45, votes: 6840000, pct: 44.0 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 190000, pct: 1.2 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 25, party2: 'Democratic', party2Held: 23, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 56, party2Chambers: 38, dividedChambers: 1, trifectasParty1: 24, trifectasParty2: 20, dividedGov: 4 },
    notes: 'Post-war strike wave and inflation give Republicans both chambers of Congress ("Do-Nothing 80th Congress").'
  },
  {
    year: 1948,
    type: 'presidential',
    pres: {
      totalVotes: 48793828,
      isEstimated: false,
      winner: { name: 'Harry S. Truman', party: 'Democratic', votes: 24179347, pct: 49.6, ev: 303 },
      runnerUp: { name: 'Thomas E. Dewey', party: 'Republican', votes: 21991292, pct: 45.1, ev: 189 },
      thirdParties: [
        { name: 'Strom Thurmond', party: 'States\' Rights Democratic (Dixiecrat)', votes: 1175930, pct: 2.4, ev: 39 },
        { name: 'Henry A. Wallace', party: 'Progressive', votes: 1157328, pct: 2.4, ev: 0 }
      ]
    },
    house: {
      totalVotes: 48800000,
      majorityParty: 'Democratic (+75 seats)',
      parties: [
        { name: 'Democratic', seats: 263, votes: 25376000, pct: 52.0 },
        { name: 'Republican', seats: 171, votes: 22448000, pct: 46.0 },
        { name: 'Other', seats: 1, votes: 976000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 24, seatsTotal: 54, votes: 11450000, pct: 52.6 },
        { name: 'Republican', seatsWon: 9, seatsTotal: 42, votes: 9820000, pct: 45.1 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 500000, pct: 2.3 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 29, party2: 'Republican', party2Held: 19, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 60, party2Chambers: 34, dividedChambers: 1, trifectasParty1: 27, trifectasParty2: 18, dividedGov: 3 },
    notes: '"Dewey Defeats Truman" famous upset; Truman overcomes four-way split in Democratic Party.'
  },
  {
    year: 1950,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 40300000,
      majorityParty: 'Democratic Narrow Majority',
      parties: [
        { name: 'Democratic', seats: 235, votes: 20150000, pct: 50.0 },
        { name: 'Republican', seats: 199, votes: 19747000, pct: 49.0 },
        { name: 'Independent', seats: 1, votes: 403000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Democratic Narrow Majority (49–47)',
      parties: [
        { name: 'Democratic', seatsWon: 18, seatsTotal: 49, votes: 9480000, pct: 50.1 },
        { name: 'Republican', seatsWon: 18, seatsTotal: 47, votes: 9240000, pct: 48.8 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 210000, pct: 1.1 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 25, party2: 'Democratic', party2Held: 23, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 52, party2Chambers: 42, dividedChambers: 1, trifectasParty1: 22, trifectasParty2: 22, dividedGov: 4 },
    notes: 'Korean War outbreak and McCarthyism; Republicans make sharp gains in Congress and governors.'
  },
  {
    year: 1952,
    type: 'presidential',
    pres: {
      totalVotes: 61551978,
      isEstimated: false,
      winner: { name: 'Dwight D. Eisenhower', party: 'Republican', votes: 34075529, pct: 55.2, ev: 442 },
      runnerUp: { name: 'Adlai Stevenson', party: 'Democratic', votes: 27375090, pct: 44.3, ev: 89 },
      thirdParties: [
        { name: 'Vincent Hallinan', party: 'Progressive', votes: 140296, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 61500000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 221, votes: 31365000, pct: 51.0 },
        { name: 'Democratic', seats: 213, votes: 29827500, pct: 48.5 },
        { name: 'Independent', seats: 1, votes: 307500, pct: 0.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Republican Narrow Majority (48–47–1)',
      parties: [
        { name: 'Republican', seatsWon: 23, seatsTotal: 48, votes: 16120000, pct: 52.4 },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 47, votes: 14350000, pct: 46.7 },
        { name: 'Independent (Morse)', seatsWon: 0, seatsTotal: 1, votes: 280000, pct: 0.9 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 30, party2: 'Democratic', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 56, party2Chambers: 38, dividedChambers: 1, trifectasParty1: 26, trifectasParty2: 17, dividedGov: 5 },
    notes: '"I Like Ike" landslide ends 20 years of continuous Democratic White House control.'
  },
  {
    year: 1954,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 42500000,
      majorityParty: 'Democratic (Begins 40-year unbroken House majority)',
      parties: [
        { name: 'Democratic', seats: 232, votes: 22312500, pct: 52.5 },
        { name: 'Republican', seats: 203, votes: 19975000, pct: 47.0 },
        { name: 'Other', seats: 0, votes: 212500, pct: 0.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 37,
      majorityParty: 'Democratic Narrow Majority (48–47–1)',
      parties: [
        { name: 'Democratic', seatsWon: 21, seatsTotal: 48, votes: 11150000, pct: 51.8 },
        { name: 'Republican', seatsWon: 16, seatsTotal: 47, votes: 10180000, pct: 47.3 },
        { name: 'Independent (Morse)', seatsWon: 0, seatsTotal: 1, votes: 190000, pct: 0.9 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 27, party2: 'Republican', party2Held: 21, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 54, party2Chambers: 40, dividedChambers: 1, trifectasParty1: 24, trifectasParty2: 19, dividedGov: 5 },
    notes: 'Democrats win both House and Senate; Lyndon Johnson becomes Senate Majority Leader.'
  },
  {
    year: 1956,
    type: 'presidential',
    pres: {
      totalVotes: 62027040,
      isEstimated: false,
      winner: { name: 'Dwight D. Eisenhower', party: 'Republican', votes: 35579180, pct: 57.4, ev: 457 },
      runnerUp: { name: 'Adlai Stevenson', party: 'Democratic', votes: 26028028, pct: 42.0, ev: 73 },
      thirdParties: [
        { name: 'T. Coleman Andrews', party: 'States\' Rights', votes: 107929, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 62000000,
      majorityParty: 'Democratic (Holds despite Eisenhower landslide)',
      parties: [
        { name: 'Democratic', seats: 234, votes: 31620000, pct: 51.0 },
        { name: 'Republican', seats: 201, votes: 30070000, pct: 48.5 },
        { name: 'Other', seats: 0, votes: 310000, pct: 0.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 19, seatsTotal: 49, votes: 15420000, pct: 51.2 },
        { name: 'Republican', seatsWon: 16, seatsTotal: 47, votes: 14480000, pct: 48.1 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 210000, pct: 0.7 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 29, party2: 'Republican', party2Held: 19, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 56, party2Chambers: 38, dividedChambers: 1, trifectasParty1: 25, trifectasParty2: 18, dividedGov: 5 },
    notes: 'First time since 1848 that winning presidential candidate failed to carry either chamber of Congress.'
  },
  {
    year: 1958,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 44600000,
      majorityParty: 'Democratic Landslide (+49 seats)',
      parties: [
        { name: 'Democratic', seats: 283, votes: 25422000, pct: 57.0 },
        { name: 'Republican', seats: 153, votes: 18732000, pct: 42.0 },
        { name: 'Other', seats: 0, votes: 446000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Democratic Supermajority (+16 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 28, seatsTotal: 65, votes: 13580000, pct: 58.2 },
        { name: 'Republican', seatsWon: 8, seatsTotal: 35, votes: 9520000, pct: 40.8 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 230000, pct: 1.0 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 35, party2: 'Republican', party2Held: 13, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 95, totalSeatsEst: 7400, party1Chambers: 68, party2Chambers: 26, dividedChambers: 1, trifectasParty1: 32, trifectasParty2: 11, dividedGov: 5 },
    notes: '1958 recession wave; massive Class of \'58 Democratic liberals enter Senate.'
  },
  {
    year: 1960,
    type: 'presidential',
    pres: {
      totalVotes: 68838219,
      isEstimated: false,
      winner: { name: 'John F. Kennedy', party: 'Democratic', votes: 34220984, pct: 49.7, ev: 303 },
      runnerUp: { name: 'Richard Nixon', party: 'Republican', votes: 34108157, pct: 49.5, ev: 219 },
      thirdParties: [
        { name: 'Harry F. Byrd', party: 'Dixiecrat (States\' Rights)', votes: 610409, pct: 0.9, ev: 15 }
      ]
    },
    house: {
      totalVotes: 68800000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 263, votes: 35088000, pct: 51.0 },
        { name: 'Republican', seats: 174, votes: 33368000, pct: 48.5 },
        { name: 'Other', seats: 0, votes: 344000, pct: 0.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Democratic Supermajority',
      parties: [
        { name: 'Democratic', seatsWon: 21, seatsTotal: 65, votes: 15850000, pct: 52.8 },
        { name: 'Republican', seatsWon: 13, seatsTotal: 35, votes: 13950000, pct: 46.5 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 200000, pct: 0.7 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 34, party2: 'Republican', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 66, party2Chambers: 31, dividedChambers: 2, trifectasParty1: 30, trifectasParty2: 14, dividedGov: 6 },
    notes: 'JFK 112,827-vote margin. First election with 50 states (Alaska & Hawaii admitted, 537/538 EVs).'
  },
  {
    year: 1962,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 51300000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 259, votes: 26932500, pct: 52.5 },
        { name: 'Republican', seats: 176, votes: 24111000, pct: 47.0 },
        { name: 'Other', seats: 0, votes: 256500, pct: 0.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 39,
      majorityParty: 'Democratic Supermajority (+4 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 25, seatsTotal: 67, votes: 12620000, pct: 53.6 },
        { name: 'Republican', seatsWon: 14, seatsTotal: 33, votes: 10750000, pct: 45.7 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 160000, pct: 0.7 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 34, party2: 'Republican', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 66, party2Chambers: 31, dividedChambers: 2, trifectasParty1: 30, trifectasParty2: 14, dividedGov: 6 },
    notes: 'Cuban Missile Crisis creates patriotic rally; Democrats gain 4 Senate seats.'
  },
  {
    year: 1964,
    type: 'presidential',
    pres: {
      totalVotes: 70644592,
      isEstimated: false,
      winner: { name: 'Lyndon B. Johnson', party: 'Democratic', votes: 43127041, pct: 61.1, ev: 486 },
      runnerUp: { name: 'Barry Goldwater', party: 'Republican', votes: 27175754, pct: 38.5, ev: 52 },
      thirdParties: []
    },
    house: {
      totalVotes: 70600000,
      majorityParty: 'Democratic Supermajority (295 seats)',
      parties: [
        { name: 'Democratic', seats: 295, votes: 40242000, pct: 57.0 },
        { name: 'Republican', seats: 140, votes: 29652000, pct: 42.0 },
        { name: 'Other', seats: 0, votes: 706000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic Supermajority (68 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 28, seatsTotal: 68, votes: 19480000, pct: 57.8 },
        { name: 'Republican', seatsWon: 7, seatsTotal: 32, votes: 13950000, pct: 41.4 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 270000, pct: 0.8 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 33, party2: 'Republican', party2Held: 17, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 70, party2Chambers: 27, dividedChambers: 2, trifectasParty1: 32, trifectasParty2: 12, dividedGov: 6 },
    notes: 'LBJ landslide (61.1% popular vote); unlocks 89th Congress passage of Medicare, Voting Rights Act, Great Society.'
  }
];
