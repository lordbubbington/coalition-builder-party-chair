/**
 * historical-data-era4.cjs
 * ERA 4: THE PROGRESSIVE ERA (1896 - 1930)
 * McKinley realignment, Trust-busting, 1912 Bull Moose split,
 * 17th Amendment direct Senate elections begin (1914), Roaring 20s
 */

module.exports = [
  {
    year: 1896,
    type: 'presidential',
    pres: {
      totalVotes: 13923102,
      isEstimated: false,
      winner: { name: 'William McKinley', party: 'Republican', votes: 7111607, pct: 51.0, ev: 271 },
      runnerUp: { name: 'William Jennings Bryan', party: 'Democratic / Populist', votes: 6509052, pct: 46.7, ev: 176 },
      thirdParties: [
        { name: 'John M. Palmer', party: 'National Democratic (Gold)', votes: 134645, pct: 1.0, ev: 0 },
        { name: 'Joshua Levering', party: 'Prohibition', votes: 131312, pct: 0.9, ev: 0 }
      ]
    },
    house: {
      totalVotes: 13900000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 206, votes: 7228000, pct: 52.0 },
        { name: 'Democratic', seats: 124, votes: 5838000, pct: 42.0 },
        { name: 'Populist', seats: 22, votes: 695000, pct: 5.0 },
        { name: 'Silver Party', seats: 3, votes: 139000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 30,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 16, seatsTotal: 44, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 10, seatsTotal: 34, votes: null, pct: null },
        { name: 'Populist', seatsWon: 2, seatsTotal: 5, votes: null, pct: null },
        { name: 'Silver / Independent', seatsWon: 2, seatsTotal: 7, votes: null, pct: null }
      ]
    },
    gov: { total: 45, party1: 'Republican', party1Held: 25, party2: 'Democratic', party2Held: 17, otherHeld: 3, mode: 'Popular' },
    stateLeg: { totalChambers: 90, totalSeatsEst: 6950, party1Chambers: 56, party2Chambers: 28, dividedChambers: 6, trifectasParty1: 25, trifectasParty2: 15, dividedGov: 5 },
    notes: 'Historic realignment election; establishes Fourth Party System Republican coalition. Utah admitted.'
  },
  {
    year: 1898,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 12800000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 187, votes: 6656000, pct: 52.0 },
        { name: 'Democratic', seats: 163, votes: 5632000, pct: 44.0 },
        { name: 'Populist', seats: 6, votes: 384000, pct: 3.0 },
        { name: 'Silver', seats: 1, votes: 128000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 30,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 19, seatsTotal: 53, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 8, seatsTotal: 26, votes: null, pct: null },
        { name: 'Populist / Silver', seatsWon: 3, seatsTotal: 11, votes: null, pct: null }
      ]
    },
    gov: { total: 45, party1: 'Republican', party1Held: 27, party2: 'Democratic', party2Held: 16, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 90, totalSeatsEst: 7000, party1Chambers: 60, party2Chambers: 26, dividedChambers: 4, trifectasParty1: 27, trifectasParty2: 14, dividedGov: 4 },
    notes: 'Spanish-American War election; McKinley administration expands Senate majority.'
  },
  {
    year: 1900,
    type: 'presidential',
    pres: {
      totalVotes: 13993351,
      isEstimated: false,
      winner: { name: 'William McKinley', party: 'Republican', votes: 7228864, pct: 51.6, ev: 292 },
      runnerUp: { name: 'William Jennings Bryan', party: 'Democratic', votes: 6370932, pct: 45.5, ev: 155 },
      thirdParties: [
        { name: 'John G. Woolley', party: 'Prohibition', votes: 209004, pct: 1.5, ev: 0 },
        { name: 'Eugene V. Debs', party: 'Socialist', votes: 87945, pct: 0.6, ev: 0 }
      ]
    },
    house: {
      totalVotes: 14000000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 201, votes: 7280000, pct: 52.0 },
        { name: 'Democratic', seats: 151, votes: 6440000, pct: 46.0 },
        { name: 'Populist', seats: 5, votes: 280000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 30,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 18, seatsTotal: 56, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 10, seatsTotal: 29, votes: null, pct: null },
        { name: 'Populist / Silver', seatsWon: 2, seatsTotal: 5, votes: null, pct: null }
      ]
    },
    gov: { total: 45, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 16, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 90, totalSeatsEst: 7050, party1Chambers: 62, party2Chambers: 26, dividedChambers: 2, trifectasParty1: 28, trifectasParty2: 14, dividedGov: 3 },
    notes: 'McKinley landslide confirms 1896 gold standard and imperial expansion realignment.'
  },
  {
    year: 1902,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 13200000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 207, votes: 6996000, pct: 53.0 },
        { name: 'Democratic', seats: 178, votes: 6072000, pct: 46.0 },
        { name: 'Other', seats: 1, votes: 132000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 30,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 18, seatsTotal: 57, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 33, votes: null, pct: null }
      ]
    },
    gov: { total: 45, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 17, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 90, totalSeatsEst: 7100, party1Chambers: 62, party2Chambers: 26, dividedChambers: 2, trifectasParty1: 28, trifectasParty2: 15, dividedGov: 2 },
    notes: 'Teddy Roosevelt presidency after McKinley assassination; solid GOP majorities hold.'
  },
  {
    year: 1904,
    type: 'presidential',
    pres: {
      totalVotes: 13524349,
      isEstimated: false,
      winner: { name: 'Theodore Roosevelt', party: 'Republican', votes: 7630457, pct: 56.4, ev: 336 },
      runnerUp: { name: 'Alton B. Parker', party: 'Democratic', votes: 5083880, pct: 37.6, ev: 140 },
      thirdParties: [
        { name: 'Eugene V. Debs', party: 'Socialist', votes: 402810, pct: 3.0, ev: 0 },
        { name: 'Silas C. Swallow', party: 'Prohibition', votes: 259102, pct: 1.9, ev: 0 },
        { name: 'Thomas E. Watson', party: 'Populist', votes: 114061, pct: 0.8, ev: 0 }
      ]
    },
    house: {
      totalVotes: 13500000,
      majorityParty: 'Republican Landslide',
      parties: [
        { name: 'Republican', seats: 251, votes: 7560000, pct: 56.0 },
        { name: 'Democratic', seats: 135, votes: 5265000, pct: 39.0 },
        { name: 'Socialist', seats: 0, votes: 405000, pct: 3.0 },
        { name: 'Other', seats: 0, votes: 270000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 31,
      majorityParty: 'Republican Supermajority',
      parties: [
        { name: 'Republican', seatsWon: 20, seatsTotal: 58, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 32, votes: null, pct: null }
      ]
    },
    gov: { total: 45, party1: 'Republican', party1Held: 30, party2: 'Democratic', party2Held: 15, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 90, totalSeatsEst: 7150, party1Chambers: 66, party2Chambers: 24, dividedChambers: 0, trifectasParty1: 30, trifectasParty2: 13, dividedGov: 2 },
    notes: 'TR landslide ("Square Deal"); largest popular vote margin to date.'
  },
  {
    year: 1906,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 13100000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 224, votes: 6812000, pct: 52.0 },
        { name: 'Democratic', seats: 167, votes: 5764000, pct: 44.0 },
        { name: 'Socialist', seats: 0, votes: 393000, pct: 3.0 },
        { name: 'Other', seats: 0, votes: 131000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 31,
      majorityParty: 'Republican Supermajority',
      parties: [
        { name: 'Republican', seatsWon: 20, seatsTotal: 61, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 29, votes: null, pct: null }
      ]
    },
    gov: { total: 45, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 17, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 90, totalSeatsEst: 7200, party1Chambers: 64, party2Chambers: 26, dividedChambers: 0, trifectasParty1: 28, trifectasParty2: 15, dividedGov: 2 },
    notes: 'Hepburn Act, Pure Food and Drug Act, Meat Inspection Act passed during 59th Congress.'
  },
  {
    year: 1908,
    type: 'presidential',
    pres: {
      totalVotes: 14882734,
      isEstimated: false,
      winner: { name: 'William Howard Taft', party: 'Republican', votes: 7678395, pct: 51.6, ev: 321 },
      runnerUp: { name: 'William Jennings Bryan', party: 'Democratic', votes: 6408984, pct: 43.0, ev: 162 },
      thirdParties: [
        { name: 'Eugene V. Debs', party: 'Socialist', votes: 420852, pct: 2.8, ev: 0 },
        { name: 'Eugene W. Chafin', party: 'Prohibition', votes: 254087, pct: 1.7, ev: 0 }
      ]
    },
    house: {
      totalVotes: 14900000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 219, votes: 7748000, pct: 52.0 },
        { name: 'Democratic', seats: 172, votes: 6556000, pct: 44.0 },
        { name: 'Socialist', seats: 0, votes: 447000, pct: 3.0 },
        { name: 'Other', seats: 0, votes: 149000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 31,
      majorityParty: 'Republican Supermajority',
      parties: [
        { name: 'Republican', seatsWon: 19, seatsTotal: 60, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 32, votes: null, pct: null }
      ]
    },
    gov: { total: 46, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 92, totalSeatsEst: 7250, party1Chambers: 64, party2Chambers: 28, dividedChambers: 0, trifectasParty1: 27, trifectasParty2: 16, dividedGov: 3 },
    notes: 'Taft elected with TR backing; Oklahoma admitted.'
  },
  {
    year: 1910,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 14500000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 230, votes: 7250000, pct: 50.0 },
        { name: 'Republican', seats: 162, votes: 6670000, pct: 46.0 },
        { name: 'Socialist', seats: 1, votes: 435000, pct: 3.0 },
        { name: 'Other', seats: 0, votes: 145000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 31,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 52, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 17, seatsTotal: 44, votes: null, pct: null }
      ]
    },
    gov: { total: 46, party1: 'Democratic', party1Held: 25, party2: 'Republican', party2Held: 21, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 92, totalSeatsEst: 7300, party1Chambers: 48, party2Chambers: 40, dividedChambers: 4, trifectasParty1: 22, trifectasParty2: 18, dividedGov: 6 },
    notes: 'Payne-Aldrich tariff backlash and Ballinger-Pinchot affair split GOP; first Dem House since 1892.'
  },
  {
    year: 1912,
    type: 'presidential',
    pres: {
      totalVotes: 15048834,
      isEstimated: false,
      winner: { name: 'Woodrow Wilson', party: 'Democratic', votes: 6296284, pct: 41.8, ev: 435 },
      runnerUp: { name: 'Theodore Roosevelt', party: 'Progressive (Bull Moose)', votes: 4122721, pct: 27.4, ev: 88 },
      thirdParties: [
        { name: 'William Howard Taft', party: 'Republican', votes: 3486242, pct: 23.2, ev: 8 },
        { name: 'Eugene V. Debs', party: 'Socialist', votes: 901551, pct: 6.0, ev: 0 },
        { name: 'Eugene W. Chafin', party: 'Prohibition', votes: 208156, pct: 1.4, ev: 0 }
      ]
    },
    house: {
      totalVotes: 15100000,
      majorityParty: 'Democratic Supermajority',
      parties: [
        { name: 'Democratic', seats: 291, votes: 6493000, pct: 43.0 },
        { name: 'Republican', seats: 134, votes: 5436000, pct: 36.0 },
        { name: 'Progressive', seats: 9, votes: 2265000, pct: 15.0 },
        { name: 'Socialist', seats: 1, votes: 755000, pct: 5.0 },
        { name: 'Other', seats: 0, votes: 151000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 32,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 20, seatsTotal: 51, votes: null, pct: null },
        { name: 'Republican', seatsWon: 11, seatsTotal: 44, votes: null, pct: null },
        { name: 'Progressive', seatsWon: 1, seatsTotal: 1, votes: null, pct: null }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 32, party2: 'Republican', party2Held: 15, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 60, party2Chambers: 32, dividedChambers: 4, trifectasParty1: 29, trifectasParty2: 14, dividedGov: 5 },
    notes: 'Historic 4-way presidential election; Debs wins 6.0%. New Mexico and Arizona admitted (48 contiguous states).'
  },
  {
    year: 1914,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 13900000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 230, votes: 6255000, pct: 45.0 },
        { name: 'Republican', seats: 196, votes: 5977000, pct: 43.0 },
        { name: 'Progressive', seats: 7, votes: 1112000, pct: 8.0 },
        { name: 'Socialist', seats: 1, votes: 417000, pct: 3.0 },
        { name: 'Other', seats: 1, votes: 139000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote (17th Amendment Ratified)',
      seatsContested: 32,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 18, seatsTotal: 56, votes: 3415000, pct: 51.5 },
        { name: 'Republican', seatsWon: 14, seatsTotal: 40, votes: 3012000, pct: 45.4 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 205000, pct: 3.1 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 28, party2: 'Republican', party2Held: 19, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 56, party2Chambers: 36, dividedChambers: 4, trifectasParty1: 26, trifectasParty2: 17, dividedGov: 5 },
    notes: 'FIRST DIRECT POPULAR ELECTION OF U.S. SENATE (17th Amendment). Popular vote totals recorded for Senate.'
  },
  {
    year: 1916,
    type: 'presidential',
    pres: {
      totalVotes: 18538319,
      isEstimated: false,
      winner: { name: 'Woodrow Wilson', party: 'Democratic', votes: 9126868, pct: 49.2, ev: 277 },
      runnerUp: { name: 'Charles Evans Hughes', party: 'Republican', votes: 8548728, pct: 46.1, ev: 254 },
      thirdParties: [
        { name: 'Allan L. Benson', party: 'Socialist', votes: 590524, pct: 3.2, ev: 0 },
        { name: 'J. Frank Hanly', party: 'Prohibition', votes: 221329, pct: 1.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 18500000,
      majorityParty: 'Democratic Coalition (Speaker Clark)',
      parties: [
        { name: 'Republican', seats: 215, votes: 8880000, pct: 48.0 },
        { name: 'Democratic', seats: 214, votes: 8695000, pct: 47.0 },
        { name: 'Progressive', seats: 3, votes: 370000, pct: 2.0 },
        { name: 'Socialist', seats: 1, votes: 370000, pct: 2.0 },
        { name: 'Other', seats: 2, votes: 185000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 17, seatsTotal: 54, votes: 4780000, pct: 50.2 },
        { name: 'Republican', seatsWon: 16, seatsTotal: 42, votes: 4420000, pct: 46.4 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 320000, pct: 3.4 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 26, party2: 'Republican', party2Held: 22, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 52, party2Chambers: 42, dividedChambers: 2, trifectasParty1: 24, trifectasParty2: 20, dividedGov: 4 },
    notes: '"He Kept Us Out of War" campaign; Wilson reelected on California razor-thin margin (3,773 votes).'
  },
  {
    year: 1918,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 14200000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 240, votes: 7668000, pct: 54.0 },
        { name: 'Democratic', seats: 192, votes: 6106000, pct: 43.0 },
        { name: 'Socialist', seats: 1, votes: 284000, pct: 2.0 },
        { name: 'Other', seats: 2, votes: 142000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 18, seatsTotal: 49, votes: 3620000, pct: 52.8 },
        { name: 'Democratic', seatsWon: 15, seatsTotal: 47, votes: 3040000, pct: 44.3 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 200000, pct: 2.9 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 20, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 58, party2Chambers: 36, dividedChambers: 2, trifectasParty1: 26, trifectasParty2: 18, dividedGov: 4 },
    notes: 'WWI midterm and 1918 Spanish Flu pandemic; Republicans flip both House and Senate.'
  },
  {
    year: 1920,
    type: 'presidential',
    pres: {
      totalVotes: 26766169,
      isEstimated: false,
      winner: { name: 'Warren G. Harding', party: 'Republican', votes: 16144093, pct: 60.3, ev: 404 },
      runnerUp: { name: 'James M. Cox', party: 'Democratic', votes: 9139661, pct: 34.1, ev: 127 },
      thirdParties: [
        { name: 'Eugene V. Debs', party: 'Socialist', votes: 913693, pct: 3.4, ev: 0 },
        { name: 'Parley P. Christensen', party: 'Farmer-Labor', votes: 265411, pct: 1.0, ev: 0 },
        { name: 'Aaron S. Watkins', party: 'Prohibition', votes: 189339, pct: 0.7, ev: 0 }
      ]
    },
    house: {
      totalVotes: 26800000,
      majorityParty: 'Republican Landslide',
      parties: [
        { name: 'Republican', seats: 302, votes: 16080000, pct: 60.0 },
        { name: 'Democratic', seats: 131, votes: 9380000, pct: 35.0 },
        { name: 'Socialist', seats: 1, votes: 804000, pct: 3.0 },
        { name: 'Other', seats: 1, votes: 536000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican Supermajority',
      parties: [
        { name: 'Republican', seatsWon: 24, seatsTotal: 59, votes: 7920000, pct: 61.2 },
        { name: 'Democratic', seatsWon: 10, seatsTotal: 37, votes: 4610000, pct: 35.6 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 410000, pct: 3.2 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 35, party2: 'Democratic', party2Held: 13, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 72, party2Chambers: 24, dividedChambers: 0, trifectasParty1: 34, trifectasParty2: 12, dividedGov: 2 },
    notes: 'FIRST ELECTION UNDER 19th AMENDMENT (Women\'s Suffrage). Harding "Return to Normalcy" landslide.'
  },
  {
    year: 1922,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 21500000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 225, votes: 11180000, pct: 52.0 },
        { name: 'Democratic', seats: 207, votes: 9460000, pct: 44.0 },
        { name: 'Farmer-Labor', seats: 2, votes: 430000, pct: 2.0 },
        { name: 'Socialist', seats: 1, votes: 430000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 16, seatsTotal: 53, votes: 5850000, pct: 51.5 },
        { name: 'Democratic', seatsWon: 16, seatsTotal: 42, votes: 5120000, pct: 45.1 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 390000, pct: 3.4 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 20, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 64, party2Chambers: 30, dividedChambers: 2, trifectasParty1: 27, trifectasParty2: 18, dividedGov: 3 },
    notes: 'Post-WWI recession triggers sharp Democratic rebound across industrial states.'
  },
  {
    year: 1924,
    type: 'presidential',
    pres: {
      totalVotes: 29074744,
      isEstimated: false,
      winner: { name: 'Calvin Coolidge', party: 'Republican', votes: 15723789, pct: 54.0, ev: 382 },
      runnerUp: { name: 'John W. Davis', party: 'Democratic', votes: 8386242, pct: 28.8, ev: 136 },
      thirdParties: [
        { name: 'Robert M. La Follette', party: 'Progressive', votes: 4831706, pct: 16.6, ev: 13 },
        { name: 'Herman P. Faris', party: 'Prohibition', votes: 54836, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 29100000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 247, votes: 15423000, pct: 53.0 },
        { name: 'Democratic', seats: 183, votes: 11058000, pct: 38.0 },
        { name: 'Farmer-Labor', seats: 3, votes: 1455000, pct: 5.0 },
        { name: 'Socialist', seats: 2, votes: 873000, pct: 3.0 },
        { name: 'Other', seats: 0, votes: 291000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 19, seatsTotal: 56, votes: 8460000, pct: 54.2 },
        { name: 'Democratic', seatsWon: 13, seatsTotal: 39, votes: 5620000, pct: 36.0 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 1520000, pct: 9.8 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 32, party2: 'Democratic', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 68, party2Chambers: 28, dividedChambers: 0, trifectasParty1: 30, trifectasParty2: 15, dividedGov: 3 },
    notes: 'Coolidge prosperity. La Follette wins 16.6% vote and carries Wisconsin.'
  },
  {
    year: 1926,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 23400000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 238, votes: 12636000, pct: 54.0 },
        { name: 'Democratic', seats: 194, votes: 9828000, pct: 42.0 },
        { name: 'Farmer-Labor', seats: 2, votes: 468000, pct: 2.0 },
        { name: 'Socialist', seats: 1, votes: 468000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 15, seatsTotal: 49, votes: 6510000, pct: 51.7 },
        { name: 'Democratic', seatsWon: 18, seatsTotal: 46, votes: 5540000, pct: 44.0 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 540000, pct: 4.3 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 30, party2: 'Democratic', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 66, party2Chambers: 30, dividedChambers: 0, trifectasParty1: 29, trifectasParty2: 16, dividedGov: 3 },
    notes: 'Midterm of Coolidge presidency; Democrats gain 7 Senate seats.'
  },
  {
    year: 1928,
    type: 'presidential',
    pres: {
      totalVotes: 36798669,
      isEstimated: false,
      winner: { name: 'Herbert Hoover', party: 'Republican', votes: 21427123, pct: 58.2, ev: 444 },
      runnerUp: { name: 'Al Smith', party: 'Democratic', votes: 15015464, pct: 40.8, ev: 87 },
      thirdParties: [
        { name: 'Norman Thomas', party: 'Socialist', votes: 267478, pct: 0.7, ev: 0 },
        { name: 'William Z. Foster', party: 'Communist', votes: 48551, pct: 0.1, ev: 0 }
      ]
    },
    house: {
      totalVotes: 36800000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 270, votes: 20976000, pct: 57.0 },
        { name: 'Democratic', seats: 164, votes: 15088000, pct: 41.0 },
        { name: 'Farmer-Labor', seats: 1, votes: 736000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 25, seatsTotal: 56, votes: 10420000, pct: 56.9 },
        { name: 'Democratic', seatsWon: 9, seatsTotal: 39, votes: 7480000, pct: 40.8 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 420000, pct: 2.3 }
      ]
    },
    gov: { total: 48, party1: 'Republican', party1Held: 32, party2: 'Democratic', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 70, party2Chambers: 26, dividedChambers: 0, trifectasParty1: 31, trifectasParty2: 14, dividedGov: 3 },
    notes: 'Hoover breaks Solid South (wins VA, NC, FL, TN, TX); Al Smith mobilizes northern urban Catholic vote.'
  },
  {
    year: 1930,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 24700000,
      majorityParty: 'Democratic (Flipped after special elections)',
      parties: [
        { name: 'Democratic', seats: 219, votes: 12597000, pct: 51.0 },
        { name: 'Republican', seats: 214, votes: 11609000, pct: 47.0 },
        { name: 'Farmer-Labor', seats: 1, votes: 494000, pct: 2.0 },
        { name: 'Other', seats: 1, votes: 0, pct: 0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Republican Tie / Near Even',
      parties: [
        { name: 'Democratic', seatsWon: 22, seatsTotal: 47, votes: 6840000, pct: 50.8 },
        { name: 'Republican', seatsWon: 12, seatsTotal: 48, votes: 6220000, pct: 46.2 },
        { name: 'Farmer-Labor', seatsWon: 1, seatsTotal: 1, votes: 410000, pct: 3.0 }
      ]
    },
    gov: { total: 48, party1: 'Democratic', party1Held: 24, party2: 'Republican', party2Held: 24, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 96, totalSeatsEst: 7400, party1Chambers: 48, party2Chambers: 46, dividedChambers: 2, trifectasParty1: 22, trifectasParty2: 21, dividedGov: 5 },
    notes: 'Great Depression begins; Democrats flip House control for the first time since 1916.'
  }
];
