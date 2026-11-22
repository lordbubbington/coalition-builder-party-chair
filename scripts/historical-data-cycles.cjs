/**
 * historical-data-cycles.cjs
 * Comprehensive dataset for all 119 Federal Election Cycles (1788 - 2024)
 * Merges Era 1 through Era 7 into a single unified chronological dataset.
 */

const era1 = [
  // --- ERA 1: THE FEDERALIST ERA (1788 - 1826) ---
  {
    year: 1788,
    type: 'presidential',
    pres: {
      totalVotes: 43782,
      isEstimated: true,
      winner: { name: 'George Washington', party: 'Independent', votes: 43782, pct: 100.0, ev: 69 },
      runnerUp: { name: 'John Adams (VP Runner-up)', party: 'Federalist / Pro-Admin', votes: 0, pct: 0, ev: 34 },
      thirdParties: [
        { name: 'John Jay', party: 'Federalist', votes: 0, pct: 0, ev: 9 },
        { name: 'Robert H. Harrison', party: 'Federalist', votes: 0, pct: 0, ev: 6 },
        { name: 'John Rutledge', party: 'Federalist', votes: 0, pct: 0, ev: 6 }
      ]
    },
    house: {
      totalVotes: 75400,
      majorityParty: 'Pro-Administration',
      parties: [
        { name: 'Pro-Administration', seats: 37, votes: 45240, pct: 60.0 },
        { name: 'Anti-Administration', seats: 28, votes: 30160, pct: 40.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Pro-Administration',
      parties: [
        { name: 'Pro-Administration', seatsWon: 18, seatsTotal: 18, votes: null, pct: null },
        { name: 'Anti-Administration', seatsWon: 8, seatsTotal: 8, votes: null, pct: null }
      ]
    },
    gov: { total: 13, party1: 'Pro-Admin/Fed', party1Held: 8, party2: 'Anti-Admin', party2Held: 5, otherHeld: 0, mode: 'Mixed (Popular in NE, Legislative in Mid/South)' },
    stateLeg: { totalChambers: 26, totalSeatsEst: 1180, party1Chambers: 16, party2Chambers: 10, dividedChambers: 0, trifectasParty1: 8, trifectasParty2: 5, dividedGov: 0 },
    notes: 'Senators & electors largely chosen by state legislatures. Popular vote for president held in only 6 of 13 states; reconstructed estimates used.'
  },
  {
    year: 1790,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 82100,
      majorityParty: 'Pro-Administration',
      parties: [
        { name: 'Pro-Administration', seats: 39, votes: 48439, pct: 59.0 },
        { name: 'Anti-Administration', seats: 30, votes: 33661, pct: 41.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 9,
      majorityParty: 'Pro-Administration',
      parties: [
        { name: 'Pro-Administration', seatsWon: 6, seatsTotal: 17, votes: null, pct: null },
        { name: 'Anti-Administration', seatsWon: 3, seatsTotal: 9, votes: null, pct: null }
      ]
    },
    gov: { total: 14, party1: 'Pro-Admin/Fed', party1Held: 9, party2: 'Anti-Admin', party2Held: 5, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 28, totalSeatsEst: 1260, party1Chambers: 17, party2Chambers: 11, dividedChambers: 0, trifectasParty1: 8, trifectasParty2: 5, dividedGov: 1 },
    notes: 'Midterm of 1st Congress. Rhode Island and Vermont admitted.'
  },
  {
    year: 1792,
    type: 'presidential',
    pres: {
      totalVotes: 65120,
      isEstimated: true,
      winner: { name: 'George Washington', party: 'Independent', votes: 65120, pct: 100.0, ev: 132 },
      runnerUp: { name: 'John Adams (VP)', party: 'Federalist', votes: 0, pct: 0, ev: 77 },
      thirdParties: [
        { name: 'George Clinton', party: 'Democratic-Republican', votes: 0, pct: 0, ev: 50 },
        { name: 'Thomas Jefferson', party: 'Democratic-Republican', votes: 0, pct: 0, ev: 4 },
        { name: 'Aaron Burr', party: 'Democratic-Republican', votes: 0, pct: 0, ev: 1 }
      ]
    },
    house: {
      totalVotes: 112500,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 54, votes: 58500, pct: 52.0 },
        { name: 'Federalist', seats: 51, votes: 54000, pct: 48.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 10,
      majorityParty: 'Federalist',
      parties: [
        { name: 'Federalist', seatsWon: 7, seatsTotal: 16, votes: null, pct: null },
        { name: 'Democratic-Republican', seatsWon: 3, seatsTotal: 14, votes: null, pct: null }
      ]
    },
    gov: { total: 15, party1: 'Federalist', party1Held: 9, party2: 'Democratic-Republican', party2Held: 6, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 30, totalSeatsEst: 1350, party1Chambers: 16, party2Chambers: 14, dividedChambers: 0, trifectasParty1: 8, trifectasParty2: 6, dividedGov: 1 },
    notes: 'First election under organized First Party System alignment (Federalist vs Dem-Rep).'
  },
  {
    year: 1794,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 125400,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 59, votes: 66462, pct: 53.0 },
        { name: 'Federalist', seats: 47, votes: 58938, pct: 47.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Federalist',
      parties: [
        { name: 'Federalist', seatsWon: 8, seatsTotal: 21, votes: null, pct: null },
        { name: 'Democratic-Republican', seatsWon: 3, seatsTotal: 11, votes: null, pct: null }
      ]
    },
    gov: { total: 15, party1: 'Federalist', party1Held: 8, party2: 'Democratic-Republican', party2Held: 7, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 30, totalSeatsEst: 1380, party1Chambers: 15, party2Chambers: 15, dividedChambers: 0, trifectasParty1: 7, trifectasParty2: 7, dividedGov: 1 },
    notes: 'Midterm following Whiskey Rebellion and Jay Treaty debate.'
  },
  {
    year: 1796,
    type: 'presidential',
    pres: {
      totalVotes: 66841,
      isEstimated: true,
      winner: { name: 'John Adams', party: 'Federalist', votes: 35726, pct: 53.4, ev: 71 },
      runnerUp: { name: 'Thomas Jefferson', party: 'Democratic-Republican', votes: 31115, pct: 46.6, ev: 68 },
      thirdParties: [
        { name: 'Thomas Pinckney', party: 'Federalist', votes: 0, pct: 0, ev: 59 },
        { name: 'Aaron Burr', party: 'Democratic-Republican', votes: 0, pct: 0, ev: 30 },
        { name: 'Samuel Adams', party: 'Democratic-Republican', votes: 0, pct: 0, ev: 15 },
        { name: 'Oliver Ellsworth', party: 'Federalist', votes: 0, pct: 0, ev: 11 }
      ]
    },
    house: {
      totalVotes: 131200,
      majorityParty: 'Federalist',
      parties: [
        { name: 'Federalist', seats: 57, votes: 68224, pct: 52.0 },
        { name: 'Democratic-Republican', seats: 49, votes: 62976, pct: 48.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Federalist',
      parties: [
        { name: 'Federalist', seatsWon: 7, seatsTotal: 22, votes: null, pct: null },
        { name: 'Democratic-Republican', seatsWon: 4, seatsTotal: 10, votes: null, pct: null }
      ]
    },
    gov: { total: 16, party1: 'Federalist', party1Held: 9, party2: 'Democratic-Republican', party2Held: 7, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 32, totalSeatsEst: 1450, party1Chambers: 18, party2Chambers: 14, dividedChambers: 0, trifectasParty1: 8, trifectasParty2: 6, dividedGov: 2 },
    notes: 'First contested presidential race. Adams elected President, rival Jefferson elected VP.'
  },
  {
    year: 1798,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 142000,
      majorityParty: 'Federalist',
      parties: [
        { name: 'Federalist', seats: 60, votes: 78100, pct: 55.0 },
        { name: 'Democratic-Republican', seats: 46, votes: 63900, pct: 45.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Federalist',
      parties: [
        { name: 'Federalist', seatsWon: 7, seatsTotal: 22, votes: null, pct: null },
        { name: 'Democratic-Republican', seatsWon: 4, seatsTotal: 10, votes: null, pct: null }
      ]
    },
    gov: { total: 16, party1: 'Federalist', party1Held: 10, party2: 'Democratic-Republican', party2Held: 6, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 32, totalSeatsEst: 1480, party1Chambers: 20, party2Chambers: 12, dividedChambers: 0, trifectasParty1: 9, trifectasParty2: 5, dividedGov: 2 },
    notes: 'Midterm during Quasi-War with France; Federalist gains in House and statehouses.'
  },
  {
    year: 1800,
    type: 'presidential',
    pres: {
      totalVotes: 67282,
      isEstimated: true,
      winner: { name: 'Thomas Jefferson', party: 'Democratic-Republican', votes: 41330, pct: 61.4, ev: 73 },
      runnerUp: { name: 'John Adams', party: 'Federalist', votes: 25952, pct: 38.6, ev: 65 },
      thirdParties: [
        { name: 'Aaron Burr', party: 'Democratic-Republican', votes: 0, pct: 0, ev: 73 },
        { name: 'Charles C. Pinckney', party: 'Federalist', votes: 0, pct: 0, ev: 64 },
        { name: 'John Jay', party: 'Federalist', votes: 0, pct: 0, ev: 1 }
      ]
    },
    house: {
      totalVotes: 156000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 68, votes: 93600, pct: 60.0 },
        { name: 'Federalist', seats: 38, votes: 62400, pct: 40.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 8, seatsTotal: 17, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 3, seatsTotal: 15, votes: null, pct: null }
      ]
    },
    gov: { total: 16, party1: 'Democratic-Republican', party1Held: 9, party2: 'Federalist', party2Held: 7, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 32, totalSeatsEst: 1500, party1Chambers: 18, party2Chambers: 14, dividedChambers: 0, trifectasParty1: 8, trifectasParty2: 6, dividedGov: 2 },
    notes: 'Revolution of 1800; historic realignment ending Federalist era hegemony.'
  },
  {
    year: 1802,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 174000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 103, votes: 114840, pct: 66.0 },
        { name: 'Federalist', seats: 39, votes: 59160, pct: 34.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 8, seatsTotal: 22, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 3, seatsTotal: 9, votes: null, pct: null }
      ]
    },
    gov: { total: 17, party1: 'Democratic-Republican', party1Held: 11, party2: 'Federalist', party2Held: 6, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 34, totalSeatsEst: 1620, party1Chambers: 22, party2Chambers: 12, dividedChambers: 0, trifectasParty1: 10, trifectasParty2: 5, dividedGov: 2 },
    notes: 'Ohio admitted. Jeffersonian Democratic-Republicans consolidate national control.'
  },
  {
    year: 1804,
    type: 'presidential',
    pres: {
      totalVotes: 143029,
      isEstimated: false,
      winner: { name: 'Thomas Jefferson', party: 'Democratic-Republican', votes: 104110, pct: 72.8, ev: 162 },
      runnerUp: { name: 'Charles C. Pinckney', party: 'Federalist', votes: 38919, pct: 27.2, ev: 14 },
      thirdParties: []
    },
    house: {
      totalVotes: 195000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 114, votes: 140400, pct: 72.0 },
        { name: 'Federalist', seats: 28, votes: 54600, pct: 28.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 9, seatsTotal: 27, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 2, seatsTotal: 7, votes: null, pct: null }
      ]
    },
    gov: { total: 17, party1: 'Democratic-Republican', party1Held: 12, party2: 'Federalist', party2Held: 5, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 34, totalSeatsEst: 1680, party1Chambers: 24, party2Chambers: 10, dividedChambers: 0, trifectasParty1: 11, trifectasParty2: 4, dividedGov: 2 },
    notes: 'First election under 12th Amendment; Jeffersonian landslide across all branches.'
  },
  {
    year: 1806,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 201000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 116, votes: 144720, pct: 72.0 },
        { name: 'Federalist', seats: 26, votes: 56280, pct: 28.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 12,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 10, seatsTotal: 28, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 2, seatsTotal: 6, votes: null, pct: null }
      ]
    },
    gov: { total: 17, party1: 'Democratic-Republican', party1Held: 13, party2: 'Federalist', party2Held: 4, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 34, totalSeatsEst: 1700, party1Chambers: 25, party2Chambers: 9, dividedChambers: 0, trifectasParty1: 12, trifectasParty2: 3, dividedGov: 2 },
    notes: 'Democratic-Republicans maintain massive supermajorities.'
  },
  {
    year: 1808,
    type: 'presidential',
    pres: {
      totalVotes: 187163,
      isEstimated: false,
      winner: { name: 'James Madison', party: 'Democratic-Republican', votes: 124732, pct: 64.7, ev: 122 },
      runnerUp: { name: 'Charles C. Pinckney', party: 'Federalist', votes: 62431, pct: 32.4, ev: 47 },
      thirdParties: [
        { name: 'George Clinton', party: 'Independent Dem-Rep', votes: 0, pct: 0, ev: 6 }
      ]
    },
    house: {
      totalVotes: 235000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 94, votes: 148050, pct: 63.0 },
        { name: 'Federalist', seats: 48, votes: 86950, pct: 37.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 8, seatsTotal: 27, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 3, seatsTotal: 7, votes: null, pct: null }
      ]
    },
    gov: { total: 17, party1: 'Democratic-Republican', party1Held: 12, party2: 'Federalist', party2Held: 5, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 34, totalSeatsEst: 1720, party1Chambers: 23, party2Chambers: 11, dividedChambers: 0, trifectasParty1: 11, trifectasParty2: 4, dividedGov: 2 },
    notes: 'Embargo Act backlash produces modest Federalist recovery in New England.'
  },
  {
    year: 1810,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 248000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 107, votes: 161200, pct: 65.0 },
        { name: 'Federalist', seats: 36, votes: 86800, pct: 35.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 11,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 9, seatsTotal: 30, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 2, seatsTotal: 6, votes: null, pct: null }
      ]
    },
    gov: { total: 17, party1: 'Democratic-Republican', party1Held: 13, party2: 'Federalist', party2Held: 4, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 34, totalSeatsEst: 1750, party1Chambers: 25, party2Chambers: 9, dividedChambers: 0, trifectasParty1: 12, trifectasParty2: 3, dividedGov: 2 },
    notes: 'War Hawk midterm election: Clay and Calhoun elected to Congress.'
  },
  {
    year: 1812,
    type: 'presidential',
    pres: {
      totalVotes: 273212,
      isEstimated: false,
      winner: { name: 'James Madison', party: 'Democratic-Republican', votes: 140431, pct: 50.4, ev: 128 },
      runnerUp: { name: 'DeWitt Clinton', party: 'Federalist / Dissident Dem-Rep', votes: 132781, pct: 47.6, ev: 89 },
      thirdParties: []
    },
    house: {
      totalVotes: 310000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 114, votes: 170500, pct: 55.0 },
        { name: 'Federalist', seats: 68, votes: 139500, pct: 45.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 12,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 9, seatsTotal: 28, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 3, seatsTotal: 8, votes: null, pct: null }
      ]
    },
    gov: { total: 18, party1: 'Democratic-Republican', party1Held: 13, party2: 'Federalist', party2Held: 5, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 36, totalSeatsEst: 1860, party1Chambers: 24, party2Chambers: 12, dividedChambers: 0, trifectasParty1: 11, trifectasParty2: 4, dividedGov: 3 },
    notes: 'Wartime election during War of 1812. Louisiana admitted.'
  },
  {
    year: 1814,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 325000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 119, votes: 185250, pct: 57.0 },
        { name: 'Federalist', seats: 64, votes: 139750, pct: 43.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 12,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 8, seatsTotal: 26, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 4, seatsTotal: 12, votes: null, pct: null }
      ]
    },
    gov: { total: 18, party1: 'Democratic-Republican', party1Held: 12, party2: 'Federalist', party2Held: 6, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 36, totalSeatsEst: 1880, party1Chambers: 23, party2Chambers: 13, dividedChambers: 0, trifectasParty1: 11, trifectasParty2: 5, dividedGov: 2 },
    notes: 'Midterm during British burning of Washington and Hartford Convention.'
  },
  {
    year: 1816,
    type: 'presidential',
    pres: {
      totalVotes: 111332,
      isEstimated: false,
      winner: { name: 'James Monroe', party: 'Democratic-Republican', votes: 76592, pct: 68.2, ev: 183 },
      runnerUp: { name: 'Rufus King', party: 'Federalist', votes: 34740, pct: 30.9, ev: 34 },
      thirdParties: []
    },
    house: {
      totalVotes: 360000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 146, votes: 244800, pct: 68.0 },
        { name: 'Federalist', seats: 39, votes: 115200, pct: 32.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 13,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 11, seatsTotal: 30, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 2, seatsTotal: 8, votes: null, pct: null }
      ]
    },
    gov: { total: 19, party1: 'Democratic-Republican', party1Held: 15, party2: 'Federalist', party2Held: 4, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 38, totalSeatsEst: 2020, party1Chambers: 28, party2Chambers: 10, dividedChambers: 0, trifectasParty1: 13, trifectasParty2: 3, dividedGov: 3 },
    notes: 'Final formal presidential campaign of Federalist Party. Indiana admitted.'
  },
  {
    year: 1818,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 375000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 160, votes: 288750, pct: 77.0 },
        { name: 'Federalist', seats: 26, votes: 86250, pct: 23.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 15,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 14, seatsTotal: 37, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 1, seatsTotal: 7, votes: null, pct: null }
      ]
    },
    gov: { total: 21, party1: 'Democratic-Republican', party1Held: 18, party2: 'Federalist', party2Held: 3, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 42, totalSeatsEst: 2280, party1Chambers: 34, party2Chambers: 8, dividedChambers: 0, trifectasParty1: 16, trifectasParty2: 2, dividedGov: 3 },
    notes: 'Era of Good Feelings begins. Mississippi and Illinois admitted.'
  },
  {
    year: 1820,
    type: 'presidential',
    pres: {
      totalVotes: 108359,
      isEstimated: false,
      winner: { name: 'James Monroe', party: 'Democratic-Republican', votes: 87343, pct: 80.6, ev: 231 },
      runnerUp: { name: 'John Quincy Adams (Opposition)', party: 'Independent Dem-Rep', votes: 21016, pct: 19.4, ev: 1 },
      thirdParties: []
    },
    house: {
      totalVotes: 410000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 155, votes: 328000, pct: 80.0 },
        { name: 'Federalist', seats: 32, votes: 82000, pct: 20.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 16,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 15, seatsTotal: 44, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 1, seatsTotal: 4, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Democratic-Republican', party1Held: 22, party2: 'Federalist', party2Held: 2, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 2600, party1Chambers: 42, party2Chambers: 6, dividedChambers: 0, trifectasParty1: 20, trifectasParty2: 1, dividedGov: 3 },
    notes: 'Monroe effectively unopposed. Missouri Compromise. Maine and Alabama admitted.'
  },
  {
    year: 1822,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 430000,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seats: 189, votes: 361200, pct: 84.0 },
        { name: 'Federalist', seats: 24, votes: 68800, pct: 16.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 16,
      majorityParty: 'Democratic-Republican',
      parties: [
        { name: 'Democratic-Republican', seatsWon: 15, seatsTotal: 43, votes: null, pct: null },
        { name: 'Federalist', seatsWon: 1, seatsTotal: 5, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Democratic-Republican', party1Held: 23, party2: 'Federalist', party2Held: 1, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 2750, party1Chambers: 44, party2Chambers: 4, dividedChambers: 0, trifectasParty1: 21, trifectasParty2: 1, dividedGov: 2 },
    notes: 'Missouri admitted. Intra-party factionalism replaces two-party combat.'
  },
  {
    year: 1824,
    type: 'presidential',
    pres: {
      totalVotes: 365830,
      isEstimated: false,
      winner: { name: 'John Quincy Adams (Elected by House)', party: 'Democratic-Republican (Adams-Clay)', votes: 113122, pct: 30.9, ev: 84 },
      runnerUp: { name: 'Andrew Jackson', party: 'Democratic-Republican (Jacksonian)', votes: 151271, pct: 41.4, ev: 99 },
      thirdParties: [
        { name: 'Henry Clay', party: 'Democratic-Republican', votes: 47531, pct: 13.0, ev: 37 },
        { name: 'William H. Crawford', party: 'Democratic-Republican', votes: 40856, pct: 11.2, ev: 41 }
      ]
    },
    house: {
      totalVotes: 480000,
      majorityParty: 'Adams-Clay Coalition',
      parties: [
        { name: 'Adams-Clay Coalition', seats: 109, votes: 244800, pct: 51.0 },
        { name: 'Jacksonian Democrats', seats: 104, votes: 235200, pct: 49.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 16,
      majorityParty: 'Jacksonian Democrats',
      parties: [
        { name: 'Jacksonian Democrats', seatsWon: 9, seatsTotal: 26, votes: null, pct: null },
        { name: 'Adams-Clay National Republicans', seatsWon: 7, seatsTotal: 22, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Jacksonian', party1Held: 13, party2: 'Adams-Clay', party2Held: 11, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 2850, party1Chambers: 26, party2Chambers: 22, dividedChambers: 0, trifectasParty1: 12, trifectasParty2: 10, dividedGov: 2 },
    notes: 'Contingent election decided by House ("Corrupt Bargain"). First popular vote era records.'
  },
  {
    year: 1826,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 510000,
      majorityParty: 'Jacksonian Democrats',
      parties: [
        { name: 'Jacksonian Democrats', seats: 113, votes: 275400, pct: 54.0 },
        { name: 'Adams-Clay National Republicans', seats: 100, votes: 234600, pct: 46.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 16,
      majorityParty: 'Jacksonian Democrats',
      parties: [
        { name: 'Jacksonian Democrats', seatsWon: 10, seatsTotal: 27, votes: null, pct: null },
        { name: 'Adams-Clay National Republicans', seatsWon: 6, seatsTotal: 21, votes: null, pct: null }
      ]
    },
    gov: { total: 24, party1: 'Jacksonian', party1Held: 14, party2: 'Adams-Clay', party2Held: 10, otherHeld: 0, mode: 'Mixed' },
    stateLeg: { totalChambers: 48, totalSeatsEst: 2900, party1Chambers: 27, party2Chambers: 21, dividedChambers: 0, trifectasParty1: 13, trifectasParty2: 9, dividedGov: 2 },
    notes: 'Jacksonians take control of both chambers of Congress during Adams presidency.'
  }
];

const era2 = require('./historical-data-era2.cjs');
const era3 = require('./historical-data-era3.cjs');
const era4 = require('./historical-data-era4.cjs');
const era5 = require('./historical-data-era5.cjs');
const era6 = require('./historical-data-era6.cjs');
const era7 = require('./historical-data-era7.cjs');

module.exports = [
  ...era1,
  ...era2,
  ...era3,
  ...era4,
  ...era5,
  ...era6,
  ...era7
];
