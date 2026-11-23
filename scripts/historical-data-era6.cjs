/**
 * historical-data-era6.cjs
 * ERA 6: THE CONSERVATIVE ERA (1966 - 2004)
 * Southern realignment, Reagan Revolution, 1994 Republican Revolution,
 * Ross Perot surges, Bush v. Gore, Post-9/11 elections
 */

module.exports = [
  {
    year: 1966,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 52900000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 248, votes: 26979000, pct: 51.0 },
        { name: 'Republican', seats: 187, votes: 25392000, pct: 48.0 },
        { name: 'Other', seats: 0, votes: 529000, pct: 1.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic Supermajority',
      parties: [
        { name: 'Democratic', seatsWon: 17, seatsTotal: 64, votes: 12520000, pct: 50.8 },
        { name: 'Republican', seatsWon: 18, seatsTotal: 36, votes: 11950000, pct: 48.5 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 170000, pct: 0.7 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 25, party2: 'Democratic', party2Held: 25, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 58, party2Chambers: 39, dividedChambers: 2, trifectasParty1: 25, trifectasParty2: 17, dividedGov: 8 },
    notes: 'Vietnam War and urban unrest produce sharp GOP midterm comeback (+47 House seats).'
  },
  {
    year: 1968,
    type: 'presidential',
    pres: {
      totalVotes: 73211875,
      isEstimated: false,
      winner: { name: 'Richard Nixon', party: 'Republican', votes: 31783783, pct: 43.4, ev: 301 },
      runnerUp: { name: 'Hubert Humphrey', party: 'Democratic', votes: 31271839, pct: 42.7, ev: 191 },
      thirdParties: [
        { name: 'George C. Wallace', party: 'Dixiecrat (American Independent / States\' Rights)', votes: 9901118, pct: 13.5, ev: 46 }
      ]
    },
    house: {
      totalVotes: 73200000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 243, votes: 36600000, pct: 50.0 },
        { name: 'Republican', seats: 192, votes: 35502000, pct: 48.5 },
        { name: 'Other', seats: 0, votes: 1098000, pct: 1.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 18, seatsTotal: 57, votes: 18450000, pct: 50.8 },
        { name: 'Republican', seatsWon: 16, seatsTotal: 43, votes: 17200000, pct: 47.4 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 650000, pct: 1.8 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 30, party2: 'Democratic', party2Held: 20, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 56, party2Chambers: 41, dividedChambers: 2, trifectasParty1: 24, trifectasParty2: 18, dividedGov: 8 },
    notes: 'Wallace carries 5 Deep South states with 13.5% vote. Nixon\'s "Silent Majority" prevails.'
  },
  {
    year: 1970,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 58000000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 255, votes: 31030000, pct: 53.5 },
        { name: 'Republican', seats: 180, votes: 26100000, pct: 45.0 },
        { name: 'Other', seats: 0, votes: 870000, pct: 1.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 22, seatsTotal: 54, votes: 14500000, pct: 52.5 },
        { name: 'Republican', seatsWon: 11, seatsTotal: 44, votes: 12250000, pct: 44.4 },
        { name: 'Conservative (Buckley NY)', seatsWon: 1, seatsTotal: 1, votes: 520000, pct: 1.9 },
        { name: 'Independent (Byrd VA)', seatsWon: 1, seatsTotal: 1, votes: 340000, pct: 1.2 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 29, party2: 'Republican', party2Held: 21, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 58, party2Chambers: 39, dividedChambers: 2, trifectasParty1: 25, trifectasParty2: 17, dividedGov: 8 },
    notes: 'James Buckley elected to Senate as Conservative Party nominee in NY.'
  },
  {
    year: 1972,
    type: 'presidential',
    pres: {
      totalVotes: 77718554,
      isEstimated: false,
      winner: { name: 'Richard Nixon', party: 'Republican', votes: 47168710, pct: 60.7, ev: 520 },
      runnerUp: { name: 'George McGovern', party: 'Democratic', votes: 29173222, pct: 37.5, ev: 17 },
      thirdParties: [
        { name: 'John G. Schmitz', party: 'American Independent', votes: 1100868, pct: 1.4, ev: 0 },
        { name: 'John Hospers', party: 'Libertarian', votes: 3674, pct: 0.0, ev: 1 }
      ]
    },
    house: {
      totalVotes: 77700000,
      majorityParty: 'Democratic (Holds despite 49-state Nixon landslide)',
      parties: [
        { name: 'Democratic', seats: 242, votes: 40404000, pct: 52.0 },
        { name: 'Republican', seats: 192, votes: 36130500, pct: 46.5 },
        { name: 'Independent', seats: 1, votes: 1165500, pct: 1.5 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic (+2 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 16, seatsTotal: 56, votes: 19250000, pct: 51.5 },
        { name: 'Republican', seatsWon: 17, seatsTotal: 42, votes: 17520000, pct: 46.9 },
        { name: 'Other', seatsWon: 0, seatsTotal: 2, votes: 610000, pct: 1.6 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 31, party2: 'Republican', party2Held: 19, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 60, party2Chambers: 37, dividedChambers: 2, trifectasParty1: 26, trifectasParty2: 15, dividedGov: 9 },
    notes: 'Nixon 49-state sweep; split-ticket voting leaves Democrats in control of Congress. Hospers wins 1st Libertarian EV (faithless elector).'
  },
  {
    year: 1974,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 55300000,
      majorityParty: 'Democratic Supermajority ("Watergate Babies" +49 seats)',
      parties: [
        { name: 'Democratic', seats: 291, votes: 31797500, pct: 57.5 },
        { name: 'Republican', seats: 144, votes: 22507100, pct: 40.7 },
        { name: 'Other', seats: 0, votes: 995400, pct: 1.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Democratic Supermajority (+4 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 23, seatsTotal: 60, votes: 16580000, pct: 55.2 },
        { name: 'Republican', seatsWon: 11, seatsTotal: 38, votes: 12850000, pct: 42.8 },
        { name: 'Other', seatsWon: 0, seatsTotal: 2, votes: 600000, pct: 2.0 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 36, party2: 'Republican', party2Held: 13, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 75, party2Chambers: 22, dividedChambers: 2, trifectasParty1: 37, trifectasParty2: 7, dividedGov: 6 },
    notes: 'Watergate fallout and Nixon resignation; massive Democratic wave across all levels.'
  },
  {
    year: 1976,
    type: 'presidential',
    pres: {
      totalVotes: 81555789,
      isEstimated: false,
      winner: { name: 'Jimmy Carter', party: 'Democratic', votes: 40831881, pct: 50.1, ev: 297 },
      runnerUp: { name: 'Gerald Ford', party: 'Republican', votes: 39148634, pct: 48.0, ev: 240 },
      thirdParties: [
        { name: 'Eugene McCarthy', party: 'Independent', votes: 740460, pct: 0.9, ev: 0 },
        { name: 'Roger MacBride', party: 'Libertarian', votes: 172553, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 81500000,
      majorityParty: 'Democratic Supermajority (292 seats)',
      parties: [
        { name: 'Democratic', seats: 292, votes: 45640000, pct: 56.0 },
        { name: 'Republican', seats: 143, votes: 34474500, pct: 42.3 },
        { name: 'Other', seats: 0, votes: 1385500, pct: 1.7 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic Supermajority (61 seats)',
      parties: [
        { name: 'Democratic', seatsWon: 21, seatsTotal: 61, votes: 20450000, pct: 54.1 },
        { name: 'Republican', seatsWon: 12, seatsTotal: 38, votes: 16750000, pct: 44.3 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 1, votes: 610000, pct: 1.6 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 37, party2: 'Republican', party2Held: 12, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 76, party2Chambers: 21, dividedChambers: 2, trifectasParty1: 37, trifectasParty2: 7, dividedGov: 6 },
    notes: 'Carter reunites Deep South and industrial North in post-Watergate victory.'
  },
  {
    year: 1978,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 58900000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 277, votes: 31452600, pct: 53.4 },
        { name: 'Republican', seats: 158, votes: 26033800, pct: 44.2 },
        { name: 'Other', seats: 0, votes: 1413600, pct: 2.4 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 18, seatsTotal: 58, votes: 16120000, pct: 51.5 },
        { name: 'Republican', seatsWon: 17, seatsTotal: 41, votes: 14650000, pct: 46.8 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 1, votes: 530000, pct: 1.7 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 32, party2: 'Republican', party2Held: 18, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 68, party2Chambers: 29, dividedChambers: 2, trifectasParty1: 31, trifectasParty2: 12, dividedGov: 7 },
    notes: 'Tax revolt and inflation; California passes Prop 13. Republicans gain 15 House and 3 Senate seats.'
  },
  {
    year: 1980,
    type: 'presidential',
    pres: {
      totalVotes: 86515221,
      isEstimated: false,
      winner: { name: 'Ronald Reagan', party: 'Republican', votes: 43903230, pct: 50.7, ev: 489 },
      runnerUp: { name: 'Jimmy Carter', party: 'Democratic', votes: 35480115, pct: 41.0, ev: 49 },
      thirdParties: [
        { name: 'John B. Anderson', party: 'Independent', votes: 5719850, pct: 6.6, ev: 0 },
        { name: 'Ed Clark', party: 'Libertarian', votes: 921128, pct: 1.1, ev: 0 }
      ]
    },
    house: {
      totalVotes: 86500000,
      majorityParty: 'Democratic (Holds despite Reagan landslide)',
      parties: [
        { name: 'Democratic', seats: 243, votes: 43682500, pct: 50.5 },
        { name: 'Republican', seats: 192, votes: 41174000, pct: 47.6 },
        { name: 'Libertarian', seats: 0, votes: 951500, pct: 1.1 },
        { name: 'Other', seats: 0, votes: 692000, pct: 0.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican (+12 seats; First GOP Senate since 1954)',
      parties: [
        { name: 'Republican', seatsWon: 22, seatsTotal: 53, votes: 19850000, pct: 51.6 },
        { name: 'Democratic', seatsWon: 12, seatsTotal: 46, votes: 17820000, pct: 46.3 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 1, votes: 810000, pct: 2.1 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 27, party2: 'Republican', party2Held: 23, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 63, party2Chambers: 34, dividedChambers: 2, trifectasParty1: 29, trifectasParty2: 15, dividedGov: 6 },
    notes: 'Reagan Revolution; historic 12-seat Senate flip to GOP. Ed Clark wins 1.1% for Libertarians.'
  },
  {
    year: 1982,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 67600000,
      majorityParty: 'Democratic (+26 seats)',
      parties: [
        { name: 'Democratic', seats: 269, votes: 37315200, pct: 55.2 },
        { name: 'Republican', seats: 166, votes: 29338400, pct: 43.4 },
        { name: 'Other', seats: 0, votes: 946400, pct: 1.4 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Republican (Holds 54–46)',
      parties: [
        { name: 'Democratic', seatsWon: 19, seatsTotal: 46, votes: 18450000, pct: 52.4 },
        { name: 'Republican', seatsWon: 14, seatsTotal: 54, votes: 16120000, pct: 45.8 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 630000, pct: 1.8 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 34, party2: 'Republican', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 66, party2Chambers: 31, dividedChambers: 2, trifectasParty1: 34, trifectasParty2: 11, dividedGov: 5 },
    notes: 'Early 1980s recession; Democrats gain 26 House seats and 7 governorships.'
  },
  {
    year: 1984,
    type: 'presidential',
    pres: {
      totalVotes: 92653233,
      isEstimated: false,
      winner: { name: 'Ronald Reagan', party: 'Republican', votes: 54455472, pct: 58.8, ev: 525 },
      runnerUp: { name: 'Walter Mondale', party: 'Democratic', votes: 37577352, pct: 40.6, ev: 13 },
      thirdParties: [
        { name: 'David Bergland', party: 'Libertarian', votes: 228114, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 92600000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 253, votes: 48244600, pct: 52.1 },
        { name: 'Republican', seats: 182, votes: 43522000, pct: 47.0 },
        { name: 'Other', seats: 0, votes: 833400, pct: 0.9 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Republican (Holds 53–47)',
      parties: [
        { name: 'Republican', seatsWon: 17, seatsTotal: 53, votes: 21350000, pct: 50.8 },
        { name: 'Democratic', seatsWon: 16, seatsTotal: 47, votes: 20120000, pct: 47.9 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 530000, pct: 1.3 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 34, party2: 'Republican', party2Held: 16, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 64, party2Chambers: 33, dividedChambers: 2, trifectasParty1: 30, trifectasParty2: 12, dividedGov: 8 },
    notes: '"Morning in America" 49-state Reagan landslide (525 EVs). Mondale wins only MN & DC.'
  },
  {
    year: 1986,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 64900000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 258, votes: 35305600, pct: 54.4 },
        { name: 'Republican', seats: 177, votes: 28815600, pct: 44.4 },
        { name: 'Other', seats: 0, votes: 778800, pct: 1.2 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Democratic (+8 seats; Flips Senate)',
      parties: [
        { name: 'Democratic', seatsWon: 20, seatsTotal: 55, votes: 19250000, pct: 51.5 },
        { name: 'Republican', seatsWon: 14, seatsTotal: 45, votes: 17520000, pct: 46.9 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 610000, pct: 1.6 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 26, party2: 'Republican', party2Held: 24, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 65, party2Chambers: 32, dividedChambers: 2, trifectasParty1: 28, trifectasParty2: 13, dividedGov: 9 },
    notes: 'Democrats recapture Senate control with an 8-seat gain; Robert Bork nomination fight follows.'
  },
  {
    year: 1988,
    type: 'presidential',
    pres: {
      totalVotes: 91594693,
      isEstimated: false,
      winner: { name: 'George H.W. Bush', party: 'Republican', votes: 48886597, pct: 53.4, ev: 426 },
      runnerUp: { name: 'Michael Dukakis', party: 'Democratic', votes: 41809476, pct: 45.6, ev: 111 },
      thirdParties: [
        { name: 'Ron Paul', party: 'Libertarian', votes: 431750, pct: 0.5, ev: 0 },
        { name: 'Lenora Fulani', party: 'New Alliance', votes: 217221, pct: 0.2, ev: 0 }
      ]
    },
    house: {
      totalVotes: 91500000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 260, votes: 48771000, pct: 53.3 },
        { name: 'Republican', seats: 175, votes: 41724000, pct: 45.6 },
        { name: 'Other', seats: 0, votes: 1005000, pct: 1.1 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 33,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 19, seatsTotal: 55, votes: 21450000, pct: 52.8 },
        { name: 'Republican', seatsWon: 14, seatsTotal: 45, votes: 18550000, pct: 45.7 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 620000, pct: 1.5 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 28, party2: 'Republican', party2Held: 22, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 67, party2Chambers: 30, dividedChambers: 2, trifectasParty1: 29, trifectasParty2: 12, dividedGov: 9 },
    notes: 'Bush 41 wins 426 EVs; last time a Republican presidential nominee won California, Illinois, or New Jersey.'
  },
  {
    year: 1990,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 67900000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 267, votes: 35375900, pct: 52.1 },
        { name: 'Republican', seats: 167, votes: 30079700, pct: 44.3 },
        { name: 'Independent (Sanders)', seats: 1, votes: 2444400, pct: 3.6 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 18, seatsTotal: 56, votes: 17850000, pct: 52.5 },
        { name: 'Republican', seatsWon: 17, seatsTotal: 44, votes: 15420000, pct: 45.3 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 730000, pct: 2.2 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 28, party2: 'Republican', party2Held: 20, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 68, party2Chambers: 29, dividedChambers: 2, trifectasParty1: 29, trifectasParty2: 10, dividedGov: 11 },
    notes: 'Bush "Read My Lips: No New Taxes" budget compromise; Bernie Sanders elected to House as Independent.'
  },
  {
    year: 1992,
    type: 'presidential',
    pres: {
      totalVotes: 104426659,
      isEstimated: false,
      winner: { name: 'Bill Clinton', party: 'Democratic', votes: 44909806, pct: 43.0, ev: 370 },
      runnerUp: { name: 'George H.W. Bush', party: 'Republican', votes: 39104550, pct: 37.4, ev: 168 },
      thirdParties: [
        { name: 'Ross Perot', party: 'Independent', votes: 19743821, pct: 18.9, ev: 0 },
        { name: 'Andre Marrou', party: 'Libertarian', votes: 290087, pct: 0.3, ev: 0 }
      ]
    },
    house: {
      totalVotes: 104400000,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seats: 258, votes: 52304400, pct: 50.1 },
        { name: 'Republican', seats: 176, votes: 47084400, pct: 45.1 },
        { name: 'Independent', seats: 1, votes: 5011200, pct: 4.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 36,
      majorityParty: 'Democratic',
      parties: [
        { name: 'Democratic', seatsWon: 20, seatsTotal: 57, votes: 24500000, pct: 50.8 },
        { name: 'Republican', seatsWon: 16, seatsTotal: 43, votes: 22100000, pct: 45.8 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 1600000, pct: 3.4 }
      ]
    },
    gov: { total: 50, party1: 'Democratic', party1Held: 30, party2: 'Republican', party2Held: 18, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 65, party2Chambers: 32, dividedChambers: 2, trifectasParty1: 26, trifectasParty2: 10, dividedGov: 14 },
    notes: 'Ross Perot surges to 18.9% (strongest 3rd party since TR in 1912); "Year of the Woman" elect 4 female senators.'
  },
  {
    year: 1994,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 75100000,
      majorityParty: 'Republican ("Contract with America" +54 seats)',
      parties: [
        { name: 'Republican', seats: 230, votes: 39052000, pct: 52.0 },
        { name: 'Democratic', seats: 204, votes: 33795000, pct: 45.0 },
        { name: 'Independent', seats: 1, votes: 2253000, pct: 3.0 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 35,
      majorityParty: 'Republican (+8 seats; Flips Senate)',
      parties: [
        { name: 'Republican', seatsWon: 21, seatsTotal: 52, votes: 20120000, pct: 52.8 },
        { name: 'Democratic', seatsWon: 14, seatsTotal: 48, votes: 16840000, pct: 44.2 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 1140000, pct: 3.0 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 30, party2: 'Democratic', party2Held: 19, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 50, party2Chambers: 47, dividedChambers: 2, trifectasParty1: 17, trifectasParty2: 15, dividedGov: 18 },
    notes: '1994 Republican Revolution; first GOP House in 40 years. Newt Gingrich becomes Speaker.'
  },
  {
    year: 1996,
    type: 'presidential',
    pres: {
      totalVotes: 96277223,
      isEstimated: false,
      winner: { name: 'Bill Clinton', party: 'Democratic', votes: 47400125, pct: 49.2, ev: 379 },
      runnerUp: { name: 'Bob Dole', party: 'Republican', votes: 39197469, pct: 40.7, ev: 159 },
      thirdParties: [
        { name: 'Ross Perot', party: 'Reform', votes: 8085294, pct: 8.4, ev: 0 },
        { name: 'Ralph Nader', party: 'Green', votes: 685297, pct: 0.7, ev: 0 },
        { name: 'Harry Browne', party: 'Libertarian', votes: 484759, pct: 0.5, ev: 0 }
      ]
    },
    house: {
      totalVotes: 96200000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 226, votes: 47041800, pct: 48.9 },
        { name: 'Democratic', seats: 207, votes: 46657000, pct: 48.5 },
        { name: 'Independent', seats: 2, votes: 2501200, pct: 2.6 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seatsWon: 20, seatsTotal: 55, votes: 25420000, pct: 51.5 },
        { name: 'Democratic', seatsWon: 14, seatsTotal: 45, votes: 22850000, pct: 46.3 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 1100000, pct: 2.2 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 32, party2: 'Democratic', party2Held: 17, otherHeld: 1, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 52, party2Chambers: 45, dividedChambers: 2, trifectasParty1: 17, trifectasParty2: 15, dividedGov: 18 },
    notes: 'Clinton triangulation and economic boom; Republicans hold both House and Senate.'
  },
  {
    year: 1998,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 73100000,
      majorityParty: 'Republican Narrow Majority',
      parties: [
        { name: 'Republican', seats: 223, votes: 35380400, pct: 48.4 },
        { name: 'Democratic', seats: 211, votes: 34576300, pct: 47.3 },
        { name: 'Independent', seats: 1, votes: 3143300, pct: 4.3 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican (Holds 55–45)',
      parties: [
        { name: 'Republican', seatsWon: 16, seatsTotal: 55, votes: 19850000, pct: 50.2 },
        { name: 'Democratic', seatsWon: 18, seatsTotal: 45, votes: 18720000, pct: 47.3 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 980000, pct: 2.5 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 31, party2: 'Democratic', party2Held: 17, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 53, party2Chambers: 44, dividedChambers: 2, trifectasParty1: 17, trifectasParty2: 14, dividedGov: 19 },
    notes: 'Clinton impeachment backlash; first time since 1934 that president\'s party gained House seats in midterm (+5 seats). Jesse Ventura wins MN Gov.'
  },
  {
    year: 2000,
    type: 'presidential',
    pres: {
      totalVotes: 105421423,
      isEstimated: false,
      winner: { name: 'George W. Bush', party: 'Republican', votes: 50456002, pct: 47.9, ev: 271 },
      runnerUp: { name: 'Al Gore', party: 'Democratic', votes: 50999897, pct: 48.4, ev: 266 },
      thirdParties: [
        { name: 'Ralph Nader', party: 'Green', votes: 2882955, pct: 2.7, ev: 0 },
        { name: 'Pat Buchanan', party: 'Reform', votes: 448895, pct: 0.4, ev: 0 },
        { name: 'Harry Browne', party: 'Libertarian', votes: 384431, pct: 0.4, ev: 0 }
      ]
    },
    house: {
      totalVotes: 105400000,
      majorityParty: 'Republican',
      parties: [
        { name: 'Republican', seats: 221, votes: 50275800, pct: 47.7 },
        { name: 'Democratic', seats: 212, votes: 49748800, pct: 47.2 },
        { name: 'Independent', seats: 2, votes: 5375400, pct: 5.1 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Even Split (50–50; Cheney tie-breaker)',
      parties: [
        { name: 'Democratic', seatsWon: 19, seatsTotal: 50, votes: 27120000, pct: 48.8 },
        { name: 'Republican', seatsWon: 15, seatsTotal: 50, votes: 26540000, pct: 47.8 },
        { name: 'Other', seatsWon: 0, seatsTotal: 0, votes: 1890000, pct: 3.4 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 29, party2: 'Democratic', party2Held: 19, otherHeld: 2, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 50, party2Chambers: 47, dividedChambers: 2, trifectasParty1: 16, trifectasParty2: 13, dividedGov: 21 },
    notes: 'Bush v. Gore Supreme Court decision ends Florida recount (537 votes). Gore wins popular vote; Bush wins 271–266 EV. Nader 2.7%.'
  },
  {
    year: 2002,
    type: 'midterm',
    pres: null,
    house: {
      totalVotes: 74800000,
      majorityParty: 'Republican (+8 seats)',
      parties: [
        { name: 'Republican', seats: 229, votes: 37400000, pct: 50.0 },
        { name: 'Democratic', seats: 205, votes: 33809600, pct: 45.2 },
        { name: 'Independent', seats: 1, votes: 3590400, pct: 4.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican (+2 seats; Flips Senate 51–48–1)',
      parties: [
        { name: 'Republican', seatsWon: 20, seatsTotal: 51, votes: 21850000, pct: 50.8 },
        { name: 'Democratic', seatsWon: 14, seatsTotal: 48, votes: 19850000, pct: 46.1 },
        { name: 'Independent (Jeffords)', seatsWon: 0, seatsTotal: 1, votes: 1320000, pct: 3.1 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 26, party2: 'Democratic', party2Held: 24, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 51, party2Chambers: 46, dividedChambers: 2, trifectasParty1: 15, trifectasParty2: 12, dividedGov: 23 },
    notes: 'Post-9/11 rally; rare midterm where president\'s party gained seats in both chambers of Congress.'
  },
  {
    year: 2004,
    type: 'presidential',
    pres: {
      totalVotes: 122295345,
      isEstimated: false,
      winner: { name: 'George W. Bush', party: 'Republican', votes: 62040610, pct: 50.7, ev: 286 },
      runnerUp: { name: 'John Kerry', party: 'Democratic', votes: 59028444, pct: 48.3, ev: 251 },
      thirdParties: [
        { name: 'Ralph Nader', party: 'Independent', votes: 465650, pct: 0.4, ev: 0 },
        { name: 'Michael Badnarik', party: 'Libertarian', votes: 397265, pct: 0.3, ev: 0 },
        { name: 'Michael Peroutka', party: 'Constitution', votes: 143630, pct: 0.1, ev: 0 }
      ]
    },
    house: {
      totalVotes: 122300000,
      majorityParty: 'Republican (+3 seats)',
      parties: [
        { name: 'Republican', seats: 232, votes: 60416200, pct: 49.4 },
        { name: 'Democratic', seats: 202, votes: 57236400, pct: 46.8 },
        { name: 'Independent', seats: 1, votes: 4647400, pct: 3.8 }
      ]
    },
    senate: {
      selectionMode: 'Popular Vote',
      seatsContested: 34,
      majorityParty: 'Republican (+4 seats: 55–44–1)',
      parties: [
        { name: 'Republican', seatsWon: 19, seatsTotal: 55, votes: 32450000, pct: 51.5 },
        { name: 'Democratic', seatsWon: 15, seatsTotal: 44, votes: 29120000, pct: 46.2 },
        { name: 'Independent', seatsWon: 0, seatsTotal: 1, votes: 1450000, pct: 2.3 }
      ]
    },
    gov: { total: 50, party1: 'Republican', party1Held: 28, party2: 'Democratic', party2Held: 22, otherHeld: 0, mode: 'Popular' },
    stateLeg: { totalChambers: 99, totalSeatsEst: 7400, party1Chambers: 51, party2Chambers: 46, dividedChambers: 2, trifectasParty1: 15, trifectasParty2: 12, dividedGov: 23 },
    notes: 'Bush carries 286 EVs and wins popular majority (+3.0M votes); Ohio decides election (118,601 margin).'
  }
];
