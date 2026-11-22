/**
 * historical-data-era3.cjs
 * ERA 3: THE INDUSTRIAL ERA (1860 - 1894)
 * Civil War, Reconstruction, Gilded Age, Greenback & Populist movements
 */

module.exports = [
  {
    year: 1860,
    type: 'presidential',
    pres: {
      totalVotes: 4685030,
      isEstimated: false,
      winner: { name: 'Abraham Lincoln', party: 'Republican', votes: 1865908, pct: 39.8, ev: 180 },
      runnerUp: { name: 'Stephen A. Douglas', party: 'Northern Democratic', votes: 1380202, pct: 29.5, ev: 12 },
      thirdParties: [
        { name: 'John C. Breckinridge', party: 'Southern Democratic', votes: 848019, pct: 18.1, ev: 72 },
        { name: 'John Bell', party: 'Constitutional Union', votes: 590901, pct: 12.6, ev: 39 }
      ]
    },
    house: {
      totalVotes: 4650000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 108, votes: 2046000, pct: 44.0 },
        { name: 'Democratic (combined)', seats: 44, votes: 1720500, pct: 37.0 },
        { name: 'Constitutional Union', seats: 25, votes: 604500, pct: 13.0 },
        { name: 'Unionist', seats: 6, votes: 279000, pct: 6.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 23,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 13, seatsTotal: 31, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 8, seatsTotal: 11, votes: null, pct: null },
        { name: 'Unionist', seatsWon: 2, seatsTotal: 4, votes: null, pct: null }
      ]
    },
    gov: { total: 33, party1: 'Republican', party1Held: 18, party2: 'Democratic', party2Held: 13, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 66, totalSeatsEst: 4650, party1Chambers: 36, party2Chambers: 26, dividedChambers: 4, trifectasParty1: 17, trifectasParty2: 12, dividedGov: 4 },
    notes: 'Four-way presidential election; triggers secession of Southern states. Oregon admitted.'
  },
  {
    year: 1862,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 3200000,
      majorityParty: 'Republican / Union Coalition',
      parties: [
        { name: 'Republican', seats: 86, votes: 1440000, pct: 45.0 },
        { name: 'Democratic', seats: 72, votes: 1408000, pct: 44.0 },
        { name: 'Unconditional Unionist', seats: 19, votes: 256000, pct: 8.0 },
        { name: 'Unionist', seats: 6, votes: 96000, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 20,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 39, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 4, seatsTotal: 10, votes: null, pct: null },
        { name: 'Unionist', seatsWon: 2, seatsTotal: 5, votes: null, pct: null }
      ]
    },
    gov: { total: 25, party1: 'Republican/Union', party1Held: 18, party2: 'Democratic', party2Held: 7, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 50, totalSeatsEst: 3500, party1Chambers: 34, party2Chambers: 16, dividedChambers: 0, trifectasParty1: 17, trifectasParty2: 6, dividedGov: 2 },
    notes: 'Civil War midterm in Union states. Emancipation Proclamation issued. Kansas admitted.'
  },
  {
    year: 1864,
    type: 'presidential',
    pres: {
      totalVotes: 4031195,
      isEstimated: false,
      winner: { name: 'Abraham Lincoln', party: 'National Union (Republican)', votes: 2218388, pct: 55.0, ev: 212 },
      runnerUp: { name: 'George B. McClellan', party: 'Democratic', votes: 1812807, pct: 45.0, ev: 21 },
      thirdParties: []
    },
    house: {
      totalVotes: 4050000,
      majorityParty: 'National Union / Republican',
      parties: [
        { name: 'National Union / Republican', seats: 136, votes: 2227500, pct: 55.0 },
        { name: 'Democratic', seats: 38, votes: 1660500, pct: 41.0 },
        { name: 'Unconditional Unionist', seats: 11, votes: 162000, pct: 4.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 21,
      majorityParty: 'National Union / Republican',
      parties: [
        { name: 'National Union / Republican', seatsWon: 17, seatsTotal: 42, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 3, seatsTotal: 10, votes: null, pct: null },
        { name: 'Unconditional Unionist', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 25, party1: 'National Union/Rep', party1Held: 21, party2: 'Democratic', party2Held: 4, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 50, totalSeatsEst: 3550, party1Chambers: 42, party2Chambers: 8, dividedChambers: 0, trifectasParty1: 21, trifectasParty2: 3, dividedGov: 1 },
    notes: 'Civil War election; Confederate states excluded. Nevada and West Virginia admitted.'
  },
  {
    year: 1866,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 4400000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 173, votes: 2728000, pct: 62.0 },
        { name: 'Democratic', seats: 47, votes: 1584000, pct: 36.0 },
        { name: 'Other', seats: 4, votes: 88000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 23,
      majorityParty: 'Republican Supermajority',
      parties: [
        { name: 'Republican', seatsWon: 20, seatsTotal: 57, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 3, seatsTotal: 9, votes: null, pct: null }
      ]
    },
    gov: { total: 26, party1: 'Republican', party1Held: 22, party2: 'Democratic', party2Held: 4, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 52, totalSeatsEst: 3700, party1Chambers: 44, party2Chambers: 8, dividedChambers: 0, trifectasParty1: 22, trifectasParty2: 3, dividedGov: 1 },
    notes: 'Radical Reconstruction wave secures veto-proof supermajorities against Andrew Johnson.'
  },
  {
    year: 1868,
    type: 'presidential',
    pres: {
      totalVotes: 5722165,
      isEstimated: false,
      winner: { name: 'Ulysses S. Grant', party: 'Republican', votes: 3013421, pct: 52.7, ev: 214 },
      runnerUp: { name: 'Horatio Seymour', party: 'Democratic', votes: 2708744, pct: 47.3, ev: 80 },
      thirdParties: []
    },
    house: {
      totalVotes: 5750000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 171, votes: 3047500, pct: 53.0 },
        { name: 'Democratic', seats: 67, votes: 2587500, pct: 45.0 },
        { name: 'Other', seats: 5, votes: 115000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 25,
      majorityParty: 'Republican Supermajority',
      parties: [
        { name: 'Republican', seatsWon: 22, seatsTotal: 62, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 3, seatsTotal: 12, votes: null, pct: null }
      ]
    },
    gov: { total: 37, party1: 'Republican', party1Held: 27, party2: 'Democratic', party2Held: 10, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 74, totalSeatsEst: 5150, party1Chambers: 52, party2Chambers: 20, dividedChambers: 2, trifectasParty1: 25, trifectasParty2: 9, dividedGov: 3 },
    notes: 'Reconstruction readmission of Southern states under 14th Amendment. Nebraska admitted.'
  },
  {
    year: 1870,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 5500000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 139, votes: 2915000, pct: 53.0 },
        { name: 'Democratic', seats: 104, votes: 2475000, pct: 45.0 },
        { name: 'Other', seats: 4, votes: 110000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 25,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 19, seatsTotal: 58, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 6, seatsTotal: 16, votes: null, pct: null }
      ]
    },
    gov: { total: 37, party1: 'Republican', party1Held: 24, party2: 'Democratic', party2Held: 13, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 74, totalSeatsEst: 5200, party1Chambers: 46, party2Chambers: 26, dividedChambers: 2, trifectasParty1: 22, trifectasParty2: 12, dividedGov: 3 },
    notes: 'Ratification of 15th Amendment. All Southern states readmitted to Congress.'
  },
  {
    year: 1872,
    type: 'presidential',
    pres: {
      totalVotes: 6461689,
      isEstimated: false,
      winner: { name: 'Ulysses S. Grant', party: 'Republican', votes: 3597439, pct: 55.6, ev: 286 },
      runnerUp: { name: 'Horace Greeley', party: 'Liberal Republican / Democratic', votes: 2834761, pct: 43.8, ev: 66 },
      thirdParties: [
        { name: 'Charles O\'Conor', party: 'Straight-Out Democratic', votes: 29489, pct: 0.5, ev: 0 }
      ]
    },
    house: {
      totalVotes: 6500000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 203, votes: 3640000, pct: 56.0 },
        { name: 'Democratic', seats: 88, votes: 2600000, pct: 40.0 },
        { name: 'Liberal Republican', seats: 4, votes: 195000, pct: 3.0 },
        { name: 'Independent', seats: 2, votes: 65000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 25,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 19, seatsTotal: 52, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 5, seatsTotal: 19, votes: null, pct: null },
        { name: 'Liberal Republican', seatsWon: 1, seatsTotal: 3, votes: null, pct: null }
      ]
    },
    gov: { total: 37, party1: 'Republican', party1Held: 25, party2: 'Democratic', party2Held: 12, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 74, totalSeatsEst: 5300, party1Chambers: 48, party2Chambers: 24, dividedChambers: 2, trifectasParty1: 24, trifectasParty2: 11, dividedGov: 2 },
    notes: 'Grant reelection landslide over fusion Liberal Republican-Democratic ticket.'
  },
  {
    year: 1874,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 6050000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 182, votes: 3267000, pct: 54.0 },
        { name: 'Republican', seats: 103, votes: 2601500, pct: 43.0 },
        { name: 'Independent Reform', seats: 8, votes: 181500, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 25,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 46, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 10, seatsTotal: 29, votes: null, pct: null },
        { name: 'Independent', seatsWon: 1, seatsTotal: 1, votes: null, pct: null }
      ]
    },
    gov: { total: 37, party1: 'Democratic', party1Held: 20, party2: 'Republican', party2Held: 17, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 74, totalSeatsEst: 5400, party1Chambers: 38, party2Chambers: 34, dividedChambers: 2, trifectasParty1: 18, trifectasParty2: 16, dividedGov: 3 },
    notes: 'Panic of 1873 triggers massive 96-seat Democratic House flip (first Dem House since 1858).'
  },
  {
    year: 1876,
    type: 'presidential',
    pres: {
      totalVotes: 8413106,
      isEstimated: false,
      winner: { name: 'Rutherford B. Hayes', party: 'Republican', votes: 4034311, pct: 47.9, ev: 185 },
      runnerUp: { name: 'Samuel J. Tilden', party: 'Democratic', votes: 4288546, pct: 50.9, ev: 184 },
      thirdParties: [
        { name: 'Peter Cooper', party: 'Greenback', votes: 83726, pct: 1.0, ev: 0 }
      ]
    },
    house: {
      totalVotes: 8400000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 155, votes: 4284000, pct: 51.0 },
        { name: 'Republican', seats: 136, votes: 4032000, pct: 48.0 },
        { name: 'Independent', seats: 2, votes: 84000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 40, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 35, votes: null, pct: null },
        { name: 'Independent', seatsWon: 1, seatsTotal: 1, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Democratic', party1Held: 21, party2: 'Republican', party2Held: 17, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 5600, party1Chambers: 40, party2Chambers: 34, dividedChambers: 2, trifectasParty1: 19, trifectasParty2: 16, dividedGov: 3 },
    notes: 'Compromise of 1877 resolves disputed returns; ends federal military Reconstruction. Colorado admitted.'
  },
  {
    year: 1878,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 8100000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 150, votes: 3888000, pct: 48.0 },
        { name: 'Republican', seats: 128, votes: 3645000, pct: 45.0 },
        { name: 'Greenback', seats: 13, votes: 486000, pct: 6.0 },
        { name: 'Independent', seats: 2, votes: 81000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 15, seatsTotal: 42, votes: null, pct: null },
        { name: 'Republican', seatsWon: 10, seatsTotal: 33, votes: null, pct: null },
        { name: 'Independent', seatsWon: 1, seatsTotal: 1, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Democratic', party1Held: 22, party2: 'Republican', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 5700, party1Chambers: 42, party2Chambers: 32, dividedChambers: 2, trifectasParty1: 20, trifectasParty2: 15, dividedGov: 3 },
    notes: 'Democrats win full control of both chambers of Congress for first time since 1858.'
  },
  {
    year: 1880,
    type: 'presidential',
    pres: {
      totalVotes: 9210417,
      isEstimated: false,
      winner: { name: 'James A. Garfield', party: 'Republican', votes: 4446158, pct: 48.3, ev: 214 },
      runnerUp: { name: 'Winfield Scott Hancock', party: 'Democratic', votes: 4444260, pct: 48.3, ev: 155 },
      thirdParties: [
        { name: 'James B. Weaver', party: 'Greenback', votes: 308649, pct: 3.4, ev: 0 },
        { name: 'Neal Dow', party: 'Prohibition', votes: 10364, pct: 0.1, ev: 0 }
      ]
    },
    house: {
      totalVotes: 9200000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 151, votes: 4416000, pct: 48.0 },
        { name: 'Democratic', seats: 128, votes: 4416000, pct: 48.0 },
        { name: 'Greenback', seats: 10, votes: 322000, pct: 3.5 },
        { name: 'Independent', seats: 4, votes: 46000, pct: 0.5 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Republican Tie-break',
      parties: [
        { name: 'Republican', seatsWon: 13, seatsTotal: 37, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 37, votes: null, pct: null },
        { name: 'Independent / Readjuster', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Republican', party1Held: 20, party2: 'Democratic', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 5800, party1Chambers: 38, party2Chambers: 36, dividedChambers: 2, trifectasParty1: 19, trifectasParty2: 17, dividedGov: 2 },
    notes: 'Razor-thin popular vote margin (1,898 votes); Republicans sweep presidency and House.'
  },
  {
    year: 1882,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 8900000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 201, votes: 4628000, pct: 52.0 },
        { name: 'Republican', seats: 119, votes: 3916000, pct: 44.0 },
        { name: 'Greenback', seats: 2, votes: 222500, pct: 2.5 },
        { name: 'Independent', seats: 3, votes: 133500, pct: 1.5 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 38, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 36, votes: null, pct: null },
        { name: 'Independent', seatsWon: 1, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Democratic', party1Held: 22, party2: 'Republican', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 5900, party1Chambers: 42, party2Chambers: 32, dividedChambers: 2, trifectasParty1: 20, trifectasParty2: 15, dividedGov: 3 },
    notes: 'Garfield assassination aftermath and civil service reform agitation trigger Dem wave.'
  },
  {
    year: 1884,
    type: 'presidential',
    pres: {
      totalVotes: 10049755,
      isEstimated: false,
      winner: { name: 'Grover Cleveland', party: 'Democratic', votes: 4914482, pct: 48.9, ev: 219 },
      runnerUp: { name: 'James G. Blaine', party: 'Republican', votes: 4856903, pct: 48.3, ev: 182 },
      thirdParties: [
        { name: 'Benjamin Butler', party: 'Greenback / Anti-Monopoly', votes: 175096, pct: 1.7, ev: 0 },
        { name: 'John P. St. John', party: 'Prohibition', votes: 147482, pct: 1.5, ev: 0 }
      ]
    },
    house: {
      totalVotes: 10050000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 182, votes: 5025000, pct: 50.0 },
        { name: 'Republican', seats: 140, votes: 4723500, pct: 47.0 },
        { name: 'Independent', seats: 3, votes: 301500, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 41, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 34, votes: null, pct: null },
        { name: 'Readjuster', seatsWon: 1, seatsTotal: 1, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Democratic', party1Held: 21, party2: 'Republican', party2Held: 17, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 6050, party1Chambers: 40, party2Chambers: 34, dividedChambers: 2, trifectasParty1: 20, trifectasParty2: 15, dividedGov: 3 },
    notes: 'Mugwump revolt; first Democratic president elected since James Buchanan in 1856.'
  },
  {
    year: 1886,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 9800000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 169, votes: 4802000, pct: 49.0 },
        { name: 'Republican', seats: 152, votes: 4606000, pct: 47.0 },
        { name: 'Labor', seats: 2, votes: 196000, pct: 2.0 },
        { name: 'Independent', seats: 2, votes: 196000, pct: 2.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 14, seatsTotal: 39, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 37, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Democratic', party1Held: 20, party2: 'Republican', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 6150, party1Chambers: 38, party2Chambers: 36, dividedChambers: 2, trifectasParty1: 19, trifectasParty2: 16, dividedGov: 3 },
    notes: 'Haymarket riot and labor strikes; Republicans make modest gains in Northern states.'
  },
  {
    year: 1888,
    type: 'presidential',
    pres: {
      totalVotes: 11383320,
      isEstimated: false,
      winner: { name: 'Benjamin Harrison', party: 'Republican', votes: 5443892, pct: 47.8, ev: 233 },
      runnerUp: { name: 'Grover Cleveland', party: 'Democratic', votes: 5534488, pct: 48.6, ev: 168 },
      thirdParties: [
        { name: 'Clinton B. Fisk', party: 'Prohibition', votes: 249819, pct: 2.2, ev: 0 },
        { name: 'Alson Streeter', party: 'Union Labor', votes: 146602, pct: 1.3, ev: 0 }
      ]
    },
    house: {
      totalVotes: 11400000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 179, votes: 5643000, pct: 49.5 },
        { name: 'Democratic', seats: 152, votes: 5415000, pct: 47.5 },
        { name: 'Independent', seats: 1, votes: 342000, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 26,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 16, seatsTotal: 47, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 10, seatsTotal: 37, votes: null, pct: null }
      ]
    },
    gov: { total: 38, party1: 'Republican', party1Held: 20, party2: 'Democratic', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 76, totalSeatsEst: 6250, party1Chambers: 40, party2Chambers: 34, dividedChambers: 2, trifectasParty1: 20, trifectasParty2: 16, dividedGov: 2 },
    notes: 'Tariff election; Cleveland wins popular vote, Harrison wins Electoral College.'
  },
  {
    year: 1890,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 10600000,
      majorityParty: 'Democratic Landslide',
      parties: [
        { name: 'Democratic', seats: 238, votes: 5618000, pct: 53.0 },
        { name: 'Republican', seats: 86, votes: 4452000, pct: 42.0 },
        { name: 'Farmers\' Alliance / Populist', seats: 8, votes: 530000, pct: 5.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 29,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 16, seatsTotal: 47, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 39, votes: null, pct: null },
        { name: 'Populist', seatsWon: 2, seatsTotal: 2, votes: null, pct: null }
      ]
    },
    gov: { total: 44, party1: 'Democratic', party1Held: 25, party2: 'Republican', party2Held: 17, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 88, totalSeatsEst: 6700, party1Chambers: 50, party2Chambers: 34, dividedChambers: 4, trifectasParty1: 23, trifectasParty2: 15, dividedGov: 6 },
    notes: 'McKinley Tariff and Billion Dollar Congress backlash. ND, SD, MT, WA, ID, WY admitted.'
  },
  {
    year: 1892,
    type: 'presidential',
    pres: {
      totalVotes: 12056345,
      isEstimated: false,
      winner: { name: 'Grover Cleveland', party: 'Democratic', votes: 5553898, pct: 46.0, ev: 277 },
      runnerUp: { name: 'Benjamin Harrison', party: 'Republican', votes: 5176108, pct: 43.0, ev: 145 },
      thirdParties: [
        { name: 'James B. Weaver', party: 'Populist (People\'s)', votes: 1026595, pct: 8.5, ev: 22 },
        { name: 'John Bidwell', party: 'Prohibition', votes: 270879, pct: 2.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 12100000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 220, votes: 5808000, pct: 48.0 },
        { name: 'Republican', seats: 126, votes: 5203000, pct: 43.0 },
        { name: 'Populist', seats: 10, votes: 1089000, pct: 9.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 30,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 16, seatsTotal: 44, votes: null, pct: null },
        { name: 'Republican', seatsWon: 12, seatsTotal: 38, votes: null, pct: null },
        { name: 'Populist', seatsWon: 2, seatsTotal: 3, votes: null, pct: null },
        { name: 'Independent', seatsWon: 0, seatsTotal: 3, votes: null, pct: null }
      ]
    },
    gov: { total: 44, party1: 'Democratic', party1Held: 26, party2: 'Republican', party2Held: 15, otherHeld: 3, mode: 'Popular' },
    stateLeg: { totalChambers: 88, totalSeatsEst: 6750, party1Chambers: 52, party2Chambers: 30, dividedChambers: 6, trifectasParty1: 24, trifectasParty2: 14, dividedGov: 6 },
    notes: 'Cleveland non-consecutive second term. Omaha Platform launched by Populists.'
  },
  {
    year: 1894,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 11300000,
      majorityParty: 'Republican Landslide (+110 seats)',
      parties: [
        { name: 'Republican', seats: 254, votes: 6102000, pct: 54.0 },
        { name: 'Democratic', seats: 105, votes: 4181000, pct: 37.0 },
        { name: 'Populist', seats: 9, votes: 904000, pct: 8.0 },
        { name: 'Silver', seats: 1, votes: 113000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'State Legislature',
      seatsContested: 30,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 17, seatsTotal: 44, votes: null, pct: null },
        { name: 'Democratic', seatsWon: 11, seatsTotal: 40, votes: null, pct: null },
        { name: 'Populist', seatsWon: 2, seatsTotal: 4, votes: null, pct: null }
      ]
    },
    gov: { total: 44, party1: 'Republican', party1Held: 27, party2: 'Democratic', party2Held: 14, otherHeld: 3, mode: 'Popular' },
    stateLeg: { totalChambers: 88, totalSeatsEst: 6800, party1Chambers: 54, party2Chambers: 28, dividedChambers: 6, trifectasParty1: 25, trifectasParty2: 13, dividedGov: 6 },
    notes: 'Panic of 1893 economic collapse; largest House seat swing in modern congressional history.'
  }
];
