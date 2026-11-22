/**
 * historical-data-era2.cjs
 * ERA 2: THE ANTEBELLUM ERA (1828 - 1858)
 * Jacksonian Democracy vs Whig Party, Anti-Masonic, Free Soil, American (Know Nothing)
 */

module.exports = [
  {
    year: 1828,
    type: 'presidential',
    pres: {
      totalVotes: 1143450,
      isEstimated: false,
      winner: { name: 'Andrew Jackson', party: 'Democratic', votes: 642553, pct: 56.0, ev: 178 },
      runnerUp: { name: 'John Quincy Adams', party: 'National Republican', votes: 500897, pct: 43.6, ev: 83 },
      thirdParties: []
    },
    house: {
      totalVotes: 1120000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 136, votes: 627200, pct: 56.0 },
        { name: 'National Republican', seats: 72, votes: 492800, pct: 44.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 16,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 11, seatsTotal: 26, votes: null, pct: null },
        { name: 'National Republican', seatsWon: 5, seatsTotal: 22, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Democratic', party1Held: 15, party2: 'National Republican', party2Held: 9, otherHeld: 0, mode: 'Mixed (Popular expanding)' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 3100, party1Chambers: 30, party2Chambers: 18, dividedChambers: 0, trifectasParty1: 15, trifectasParty2: 8, dividedGov: 1 },
    notes: 'Inauguration of Second Party System; massive expansion of voter franchise.'
  },
  {
    year: 1830,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 1180000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 126, votes: 625400, pct: 53.0 },
        { name: 'National Republican', seats: 66, votes: 448400, pct: 38.0 },
        { name: 'Anti-Masonic', seats: 17, votes: 106200, pct: 9.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 16,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 9, seatsTotal: 24, votes: null, pct: null },
        { name: 'National Republican', seatsWon: 5, seatsTotal: 22, votes: null, pct: null },
        { name: 'Anti-Masonic', seatsWon: 2, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Democratic', party1Held: 14, party2: 'National Republican', party2Held: 8, otherHeld: 2, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 3150, party1Chambers: 28, party2Chambers: 16, dividedChambers: 4, trifectasParty1: 14, trifectasParty2: 7, dividedGov: 3 },
    notes: 'Rise of Anti-Masonic party as first major third party with national convention.'
  },
  {
    year: 1832,
    type: 'presidential',
    pres: {
      totalVotes: 1286684,
      isEstimated: false,
      winner: { name: 'Andrew Jackson', party: 'Democratic', votes: 701780, pct: 54.2, ev: 219 },
      runnerUp: { name: 'Henry Clay', party: 'National Republican', votes: 484189, pct: 37.4, ev: 49 },
      thirdParties: [
        { name: 'William Wirt', party: 'Anti-Masonic', votes: 100715, pct: 7.8, ev: 7 },
        { name: 'John Floyd', party: 'Nullifier', votes: 0, pct: 0, ev: 11 }
      ]
    },
    house: {
      totalVotes: 1310000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 143, votes: 720500, pct: 55.0 },
        { name: 'National Republican', seats: 63, votes: 458500, pct: 35.0 },
        { name: 'Anti-Masonic', seats: 25, votes: 104800, pct: 8.0 },
        { name: 'Nullifier', seats: 9, votes: 26200, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 10, seatsTotal: 20, votes: null, pct: null },
        { name: 'National Republican', seatsWon: 5, seatsTotal: 20, votes: null, pct: null },
        { name: 'Anti-Masonic', seatsWon: 2, seatsTotal: 6, votes: null, pct: null },
        { name: 'Nullifier', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Democratic', party1Held: 15, party2: 'National Republican', party2Held: 7, otherHeld: 2, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 3200, party1Chambers: 29, party2Chambers: 15, dividedChambers: 4, trifectasParty1: 14, trifectasParty2: 6, dividedGov: 4 },
    notes: 'Bank War and Nullification Crisis dominate national debate.'
  },
  {
    year: 1834,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 1390000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 142, votes: 736700, pct: 53.0 },
        { name: 'Whig', seats: 75, votes: 472600, pct: 34.0 },
        { name: 'Anti-Masonic', seats: 16, votes: 139000, pct: 10.0 },
        { name: 'Nullifier', seats: 9, votes: 41700, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Whig Coalition',
      parties: [
        { name: 'Whig', seatsWon: 10, seatsTotal: 25, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 7, seatsTotal: 24, votes: null, pct: null },
        { name: 'Anti-Masonic', seatsWon: 1, seatsTotal: 3, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Democratic', party1Held: 13, party2: 'Whig', party2Held: 9, otherHeld: 2, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 3250, party1Chambers: 26, party2Chambers: 18, dividedChambers: 4, trifectasParty1: 13, trifectasParty2: 8, dividedGov: 3 },
    notes: 'Formation of Whig Party coalescing anti-Jackson opposition.'
  },
  {
    year: 1836,
    type: 'presidential',
    pres: {
      totalVotes: 1502280,
      isEstimated: false,
      winner: { name: 'Martin Van Buren', party: 'Democratic', votes: 764176, pct: 50.8, ev: 170 },
      runnerUp: { name: 'William Henry Harrison', party: 'Whig (West)', votes: 550816, pct: 36.6, ev: 73 },
      thirdParties: [
        { name: 'Hugh Lawson White', party: 'Whig (South)', votes: 146107, pct: 9.7, ev: 26 },
        { name: 'Daniel Webster', party: 'Whig (Mass)', votes: 41201, pct: 2.7, ev: 14 },
        { name: 'Willie P. Mangum', party: 'Independent', votes: 0, pct: 0, ev: 11 }
      ]
    },
    house: {
      totalVotes: 1540000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 128, votes: 785400, pct: 51.0 },
        { name: 'Whig', seats: 100, votes: 693000, pct: 45.0 },
        { name: 'Other', seats: 14, votes: 61600, pct: 4.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 13, seatsTotal: 35, votes: null, pct: null },
        { name: 'Whig', seatsWon: 5, seatsTotal: 17, votes: null, pct: null }
      ]
    },
    gov: { total: 26, party1: 'Democratic', party1Held: 16, party2: 'Whig', party2Held: 10, otherHeld: 0, mode: 'Popular Majority' },
    stateLeg: { totalChambers: 52, totalSeatsEst: 3450, party1Chambers: 32, party2Chambers: 18, dividedChambers: 2, trifectasParty1: 16, trifectasParty2: 8, dividedGov: 2 },
    notes: 'Arkansas and Michigan admitted. Whigs run multi-regional candidate strategy.'
  },
  {
    year: 1838,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 1610000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 125, votes: 821100, pct: 51.0 },
        { name: 'Whig', seats: 109, votes: 756700, pct: 47.0 },
        { name: 'Other', seats: 8, votes: 32200, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 10, seatsTotal: 28, votes: null, pct: null },
        { name: 'Whig', seatsWon: 8, seatsTotal: 22, votes: null, pct: null }
      ]
    },
    gov: { total: 26, party1: 'Democratic', party1Held: 14, party2: 'Whig', party2Held: 12, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 52, totalSeatsEst: 3500, party1Chambers: 28, party2Chambers: 22, dividedChambers: 2, trifectasParty1: 13, trifectasParty2: 10, dividedGov: 3 },
    notes: 'Panic of 1837 triggers sharp anti-Democratic swing across the North.'
  },
  {
    year: 1840,
    type: 'presidential',
    pres: {
      totalVotes: 2411697,
      isEstimated: false,
      winner: { name: 'William Henry Harrison', party: 'Whig', votes: 1275390, pct: 52.9, ev: 234 },
      runnerUp: { name: 'Martin Van Buren', party: 'Democratic', votes: 1128854, pct: 46.8, ev: 60 },
      thirdParties: [
        { name: 'James G. Birney', party: 'Liberty', votes: 7453, pct: 0.3, ev: 0 }
      ]
    },
    house: {
      totalVotes: 2430000,
      majorityParty: 'Whig',
      parties: [
        { name: 'Whig', seats: 142, votes: 1287900, pct: 53.0 },
        { name: 'Democratic', seats: 98, votes: 1117800, pct: 46.0 },
        { name: 'Other', seats: 2, votes: 24300, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Whig',
      parties: [
        { name: 'Whig', seatsWon: 12, seatsTotal: 29, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 6, seatsTotal: 22, votes: null, pct: null }
      ]
    },
    gov: { total: 26, party1: 'Whig', party1Held: 16, party2: 'Democratic', party2Held: 10, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 52, totalSeatsEst: 3600, party1Chambers: 34, party2Chambers: 16, dividedChambers: 2, trifectasParty1: 15, trifectasParty2: 9, dividedGov: 2 },
    notes: 'Tippecanoe and Tyler Too campaign; massive 80% voter turnout.'
  },
  {
    year: 1842,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 2210000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 147, votes: 1215500, pct: 55.0 },
        { name: 'Whig', seats: 72, votes: 928200, pct: 42.0 },
        { name: 'Other', seats: 4, votes: 66300, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Whig',
      parties: [
        { name: 'Whig', seatsWon: 8, seatsTotal: 29, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 10, seatsTotal: 23, votes: null, pct: null }
      ]
    },
    gov: { total: 26, party1: 'Democratic', party1Held: 15, party2: 'Whig', party2Held: 11, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 52, totalSeatsEst: 3650, party1Chambers: 30, party2Chambers: 20, dividedChambers: 2, trifectasParty1: 14, trifectasParty2: 9, dividedGov: 3 },
    notes: 'Tyler-Whig schism leads to Democratic sweep of House.'
  },
  {
    year: 1844,
    type: 'presidential',
    pres: {
      totalVotes: 2701641,
      isEstimated: false,
      winner: { name: 'James K. Polk', party: 'Democratic', votes: 1339494, pct: 49.5, ev: 170 },
      runnerUp: { name: 'Henry Clay', party: 'Whig', votes: 1300044, pct: 48.1, ev: 105 },
      thirdParties: [
        { name: 'James G. Birney', party: 'Liberty', votes: 62103, pct: 2.3, ev: 0 }
      ]
    },
    house: {
      totalVotes: 2720000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 142, votes: 1360000, pct: 50.0 },
        { name: 'Whig', seats: 79, votes: 1251200, pct: 46.0 },
        { name: 'American (Know Nothing)', seats: 6, votes: 108800, pct: 4.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 18,
      majorityParty: 'Whig',
      parties: [
        { name: 'Whig', seatsWon: 9, seatsTotal: 26, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 9, seatsTotal: 24, votes: null, pct: null }
      ]
    },
    gov: { total: 26, party1: 'Democratic', party1Held: 15, party2: 'Whig', party2Held: 11, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 52, totalSeatsEst: 3700, party1Chambers: 30, party2Chambers: 20, dividedChambers: 2, trifectasParty1: 14, trifectasParty2: 9, dividedGov: 3 },
    notes: 'Manifest Destiny election; Texas annexation and Oregon 54-40 or Fight.'
  },
  {
    year: 1846,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 2650000,
      majorityParty: 'Whig',
      parties: [
        { name: 'Whig', seats: 116, votes: 1325000, pct: 50.0 },
        { name: 'Democratic', seats: 110, votes: 1245500, pct: 47.0 },
        { name: 'Other', seats: 2, votes: 79500, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 20,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 13, seatsTotal: 38, votes: null, pct: null },
        { name: 'Whig', seatsWon: 7, seatsTotal: 21, votes: null, pct: null }
      ]
    },
    gov: { total: 29, party1: 'Democratic', party1Held: 16, party2: 'Whig', party2Held: 13, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 58, totalSeatsEst: 3950, party1Chambers: 32, party2Chambers: 24, dividedChambers: 2, trifectasParty1: 15, trifectasParty2: 11, dividedGov: 3 },
    notes: 'Mexican-American War begins. Florida, Texas, and Iowa admitted.'
  },
  {
    year: 1848,
    type: 'presidential',
    pres: {
      totalVotes: 2876354,
      isEstimated: false,
      winner: { name: 'Zachary Taylor', party: 'Whig', votes: 1361393, pct: 47.3, ev: 163 },
      runnerUp: { name: 'Lewis Cass', party: 'Democratic', votes: 1223460, pct: 42.5, ev: 127 },
      thirdParties: [
        { name: 'Martin Van Buren', party: 'Free Soil', votes: 291501, pct: 10.1, ev: 0 }
      ]
    },
    house: {
      totalVotes: 2890000,
      majorityParty: 'Democratic Plurality',
      parties: [
        { name: 'Democratic', seats: 113, votes: 1300500, pct: 45.0 },
        { name: 'Whig', seats: 108, votes: 1271600, pct: 44.0 },
        { name: 'Free Soil', seats: 9, votes: 289000, pct: 10.0 },
        { name: 'Other', seats: 1, votes: 28900, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 20,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 12, seatsTotal: 35, votes: null, pct: null },
        { name: 'Whig', seatsWon: 7, seatsTotal: 25, votes: null, pct: null },
        { name: 'Free Soil', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 30, party1: 'Democratic', party1Held: 17, party2: 'Whig', party2Held: 13, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 60, totalSeatsEst: 4100, party1Chambers: 34, party2Chambers: 24, dividedChambers: 2, trifectasParty1: 15, trifectasParty2: 11, dividedGov: 4 },
    notes: 'Wisconsin admitted. Free Soil party wins 10% of vote on Wilmot Proviso platform.'
  },
  {
    year: 1850,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 2750000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 130, votes: 1375000, pct: 50.0 },
        { name: 'Whig', seats: 86, votes: 1127500, pct: 41.0 },
        { name: 'Constitutional Union', seats: 10, votes: 110000, pct: 4.0 },
        { name: 'Free Soil', seats: 4, votes: 82500, pct: 3.0 },
        { name: 'Southern Rights', seats: 3, votes: 55000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 21,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 13, seatsTotal: 36, votes: null, pct: null },
        { name: 'Whig', seatsWon: 7, seatsTotal: 23, votes: null, pct: null },
        { name: 'Free Soil', seatsWon: 1, seatsTotal: 3, votes: null, pct: null }
      ]
    },
    gov: { total: 31, party1: 'Democratic', party1Held: 19, party2: 'Whig', party2Held: 12, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 62, totalSeatsEst: 4250, party1Chambers: 36, party2Chambers: 22, dividedChambers: 4, trifectasParty1: 17, trifectasParty2: 10, dividedGov: 4 },
    notes: 'Compromise of 1850 and Fugitive Slave Act fracture party lines. California admitted.'
  },
  {
    year: 1852,
    type: 'presidential',
    pres: {
      totalVotes: 3161830,
      isEstimated: false,
      winner: { name: 'Franklin Pierce', party: 'Democratic', votes: 1607510, pct: 50.8, ev: 254 },
      runnerUp: { name: 'Winfield Scott', party: 'Whig', votes: 1386942, pct: 43.9, ev: 42 },
      thirdParties: [
        { name: 'John P. Hale', party: 'Free Soil', votes: 155210, pct: 4.9, ev: 0 }
      ]
    },
    house: {
      totalVotes: 3180000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 158, votes: 1653600, pct: 52.0 },
        { name: 'Whig', seats: 71, votes: 1367400, pct: 43.0 },
        { name: 'Free Soil', seats: 4, votes: 127200, pct: 4.0 },
        { name: 'Other', seats: 1, votes: 31800, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 21,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 14, seatsTotal: 38, votes: null, pct: null },
        { name: 'Whig', seatsWon: 6, seatsTotal: 22, votes: null, pct: null },
        { name: 'Free Soil', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 31, party1: 'Democratic', party1Held: 21, party2: 'Whig', party2Held: 10, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 62, totalSeatsEst: 4300, party1Chambers: 40, party2Chambers: 18, dividedChambers: 4, trifectasParty1: 19, trifectasParty2: 8, dividedGov: 4 },
    notes: 'Pierce electoral landslide accelerates national disintegration of Whig party.'
  },
  {
    year: 1854,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 3250000,
      majorityParty: 'Anti-Nebraska / Opposition Coalition',
      parties: [
        { name: 'Opposition / Early Republican', seats: 100, votes: 1300000, pct: 40.0 },
        { name: 'Democratic', seats: 83, votes: 1235000, pct: 38.0 },
        { name: 'American (Know Nothing)', seats: 51, votes: 715000, pct: 22.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 21,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 12, seatsTotal: 39, votes: null, pct: null },
        { name: 'Opposition / Republican', seatsWon: 6, seatsTotal: 15, votes: null, pct: null },
        { name: 'American (Know Nothing)', seatsWon: 1, seatsTotal: 3, votes: null, pct: null },
        { name: 'Whig remnant', seatsWon: 2, seatsTotal: 5, votes: null, pct: null }
      ]
    },
    gov: { total: 31, party1: 'Democratic', party1Held: 15, party2: 'Opposition/Rep', party2Held: 9, otherHeld: 7, mode: 'Popular' },
    stateLeg: { totalChambers: 62, totalSeatsEst: 4350, party1Chambers: 26, party2Chambers: 20, dividedChambers: 16, trifectasParty1: 12, trifectasParty2: 8, dividedGov: 11 },
    notes: 'Kansas-Nebraska Act triggers massive Northern revolt; birth of Republican Party.'
  },
  {
    year: 1856,
    type: 'presidential',
    pres: {
      totalVotes: 4054452,
      isEstimated: false,
      winner: { name: 'James Buchanan', party: 'Democratic', votes: 1836072, pct: 45.3, ev: 174 },
      runnerUp: { name: 'John C. Frémont', party: 'Republican', votes: 1342345, pct: 33.1, ev: 114 },
      thirdParties: [
        { name: 'Millard Fillmore', party: 'American (Know Nothing)', votes: 873053, pct: 21.5, ev: 8 }
      ]
    },
    house: {
      totalVotes: 4100000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 132, votes: 1886000, pct: 46.0 },
        { name: 'Republican', seats: 90, votes: 1476000, pct: 36.0 },
        { name: 'American (Know Nothing)', seats: 14, votes: 738000, pct: 18.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 21,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 13, seatsTotal: 41, votes: null, pct: null },
        { name: 'Republican', seatsWon: 6, seatsTotal: 20, votes: null, pct: null },
        { name: 'American (Know Nothing)', seatsWon: 2, seatsTotal: 5, votes: null, pct: null }
      ]
    },
    gov: { total: 31, party1: 'Democratic', party1Held: 18, party2: 'Republican', party2Held: 10, otherHeld: 3, mode: 'Popular' },
    stateLeg: { totalChambers: 62, totalSeatsEst: 4400, party1Chambers: 34, party2Chambers: 22, dividedChambers: 6, trifectasParty1: 16, trifectasParty2: 10, dividedGov: 5 },
    notes: 'First presidential election contested by Republican Party.'
  },
  {
    year: 1858,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 4250000,
      majorityParty: 'Republican Plurality',
      parties: [
        { name: 'Republican', seats: 116, votes: 1870000, pct: 44.0 },
        { name: 'Democratic', seats: 83, votes: 1615000, pct: 38.0 },
        { name: 'Southern Opposition', seats: 19, votes: 467500, pct: 11.0 },
        { name: 'Anti-Lecompton Democratic', seats: 8, votes: 297500, pct: 7.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 22,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 12, seatsTotal: 38, votes: null, pct: null },
        { name: 'Republican', seatsWon: 9, seatsTotal: 26, votes: null, pct: null },
        { name: 'American', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 32, party1: 'Democratic', party1Held: 17, party2: 'Republican', party2Held: 13, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 64, totalSeatsEst: 4500, party1Chambers: 32, party2Chambers: 28, dividedChambers: 4, trifectasParty1: 15, trifectasParty2: 13, dividedGov: 4 },
    notes: 'Lincoln-Douglas debates. Dred Scott decision and Lecompton Constitution split Democrats. Minnesota admitted.'
  }
];
