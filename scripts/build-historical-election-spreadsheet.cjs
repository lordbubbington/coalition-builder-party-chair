/**
 * build-historical-election-spreadsheet.cjs
 * Compiles three comprehensive historical election spreadsheets in CSV format:
 * 1. HISTORICAL_ELECTIONS_CYCLE_MASTER_1788_2024.csv (All 119 federal election cycles)
 * 2. HISTORICAL_BRANCH_RACES_1788_2024.csv (Race-level vote totals by branch for all parties >= 1%)
 * 3. HISTORICAL_STARTING_DATES_STATE_MATRIX.csv (State-by-state data across 15 landmark start dates)
 */

const fs = require('fs');
const path = require('path');

const cycles = require('./historical-data-cycles.cjs');

function toCSVRow(fields) {
  return fields.map(val => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  }).join(',');
}

function getEra(year) {
  if (year < 1828) return { num: 1, name: 'The Federalist Era' };
  if (year < 1860) return { num: 2, name: 'The Antebellum Era' };
  if (year < 1896) return { num: 3, name: 'The Industrial Era' };
  if (year < 1932) return { num: 4, name: 'The Progressive Era' };
  if (year < 1966) return { num: 5, name: 'The Liberal Era' };
  if (year < 2006) return { num: 6, name: 'The Conservative Era' };
  return { num: 7, name: 'Modern Populist & Polarized Era' };
}

console.log(`Processing ${cycles.length} election cycles (1788 - 2024)...`);

// -------------------------------------------------------------
// SPREADSHEET 1: HISTORICAL_ELECTIONS_CYCLE_MASTER_1788_2024.csv
// -------------------------------------------------------------
const masterHeaders = [
  'Cycle_Year',
  'Era_Number',
  'Era_Name',
  'Cycle_Type',
  'Presidential_Total_Popular_Vote',
  'Presidential_Winner_Name',
  'Presidential_Winner_Party',
  'Presidential_Winner_Votes',
  'Presidential_Winner_Vote_Share_Pct',
  'Presidential_Winner_EVs',
  'Presidential_RunnerUp_Name',
  'Presidential_RunnerUp_Party',
  'Presidential_RunnerUp_Votes',
  'Presidential_RunnerUp_Vote_Share_Pct',
  'Presidential_RunnerUp_EVs',
  'Presidential_ThirdParties_Over_1Pct',
  'House_Total_Popular_Vote',
  'House_Majority_Party',
  'House_Party1_Name',
  'House_Party1_Seats',
  'House_Party1_Votes',
  'House_Party1_VoteShare_Pct',
  'House_Party2_Name',
  'House_Party2_Seats',
  'House_Party2_Votes',
  'House_Party2_VoteShare_Pct',
  'House_ThirdParties_Over_1Pct',
  'Senate_Selection_Method',
  'Senate_Seats_Contested',
  'Senate_Majority_Party',
  'Senate_Party1_Name',
  'Senate_Party1_Seats_Won',
  'Senate_Party1_Seats_Total',
  'Senate_Party1_Popular_Votes',
  'Senate_Party1_VoteShare_Pct',
  'Senate_Party2_Name',
  'Senate_Party2_Seats_Won',
  'Senate_Party2_Seats_Total',
  'Senate_Party2_Popular_Votes',
  'Senate_Party2_VoteShare_Pct',
  'Senate_ThirdParties_Over_1Pct',
  'Governors_Total_States',
  'Governors_Selection_Mode',
  'Governors_Party1_Held',
  'Governors_Party2_Held',
  'Governors_ThirdParty_Held',
  'State_Legislatures_Total_Chambers',
  'State_Legislatures_Total_Seats_Est',
  'State_Legislatures_Party1_Chambers',
  'State_Legislatures_Party2_Chambers',
  'State_Legislatures_Divided_Chambers',
  'State_Trifectas_Party1',
  'State_Trifectas_Party2',
  'State_Trifectas_Divided',
  'Historical_Notes_And_Estimation_Methodology'
];

const masterRows = [masterHeaders.join(',')];

// -------------------------------------------------------------
// SPREADSHEET 2: HISTORICAL_BRANCH_RACES_1788_2024.csv
// -------------------------------------------------------------
const branchHeaders = [
  'Cycle_Year',
  'Office_Branch',
  'Party_Name',
  'Candidate_Or_Caucus_Lead',
  'Vote_Total',
  'Vote_Share_Pct',
  'Seats_Or_EVs_Won',
  'Chamber_Or_Total_Seats_Held',
  'Status',
  'Data_Source_Type'
];

const branchRows = [branchHeaders.join(',')];

for (const c of cycles) {
  const era = getEra(c.year);

  // Master Row formatting
  const pres = c.pres;
  const pWinner = pres ? pres.winner : null;
  const pRunner = pres ? pres.runnerUp : null;
  const pThirds = pres && pres.thirdParties ? pres.thirdParties.filter(tp => tp.pct >= 1.0 || tp.ev > 0).map(tp => `${tp.name} (${tp.party}): ${tp.votes ? tp.votes.toLocaleString() : 'N/A'} votes (${tp.pct}%, ${tp.ev} EVs)`).join('; ') : 'None';

  const h = c.house;
  const hP1 = h.parties[0] || { name: 'Party1', seats: 0, votes: 0, pct: 0 };
  const hP2 = h.parties[1] || { name: 'Party2', seats: 0, votes: 0, pct: 0 };
  const hThirds = h.parties.slice(2).filter(tp => tp.pct >= 1.0 || tp.seats > 0).map(tp => `${tp.name}: ${tp.seats} seats (${tp.votes ? tp.votes.toLocaleString() : 'N/A'}, ${tp.pct}%)`).join('; ') || 'None';

  const s = c.senate;
  const sP1 = s.parties[0] || { name: 'Party1', seatsWon: 0, seatsTotal: 0, votes: null, pct: null };
  const sP2 = s.parties[1] || { name: 'Party2', seatsWon: 0, seatsTotal: 0, votes: null, pct: null };
  const sThirds = s.parties.slice(2).map(tp => `${tp.name}: ${tp.seatsWon} won / ${tp.seatsTotal} total (${tp.votes ? tp.votes.toLocaleString() : 'N/A'}, ${tp.pct ? tp.pct + '%' : 'N/A'})`).join('; ') || 'None';

  const g = c.gov;
  const leg = c.stateLeg;

  masterRows.push(toCSVRow([
    c.year,
    era.num,
    era.name,
    c.type === 'presidential' ? 'Presidential' : 'Midterm',
    pres ? pres.totalVotes : 'N/A (Midterm)',
    pWinner ? pWinner.name : 'N/A',
    pWinner ? pWinner.party : 'N/A',
    pWinner ? pWinner.votes : 'N/A',
    pWinner ? pWinner.pct : 'N/A',
    pWinner ? pWinner.ev : 'N/A',
    pRunner ? pRunner.name : 'N/A',
    pRunner ? pRunner.party : 'N/A',
    pRunner ? pRunner.votes : 'N/A',
    pRunner ? pRunner.pct : 'N/A',
    pRunner ? pRunner.ev : 'N/A',
    pThirds,
    h.totalVotes,
    h.majorityParty,
    hP1.name,
    hP1.seats,
    hP1.votes,
    hP1.pct,
    hP2.name,
    hP2.seats,
    hP2.votes,
    hP2.pct,
    hThirds,
    s.selectionMode,
    s.seatsContested,
    s.majorityParty,
    sP1.name,
    sP1.seatsWon,
    sP1.seatsTotal,
    sP1.votes !== null ? sP1.votes : 'Legislative Election',
    sP1.pct !== null ? sP1.pct : 'N/A',
    sP2.name,
    sP2.seatsWon,
    sP2.seatsTotal,
    sP2.votes !== null ? sP2.votes : 'Legislative Election',
    sP2.pct !== null ? sP2.pct : 'N/A',
    sThirds,
    g.total,
    g.mode,
    g.party1Held,
    g.party2Held,
    g.otherHeld,
    leg.totalChambers,
    leg.totalSeatsEst,
    leg.party1Chambers,
    leg.party2Chambers,
    leg.dividedChambers,
    leg.trifectasParty1,
    leg.trifectasParty2,
    leg.dividedGov,
    c.notes
  ]));

  // Branch Rows breakdown (Parties >= 1%)
  if (pres) {
    if (pWinner) {
      branchRows.push(toCSVRow([
        c.year,
        'Presidential',
        pWinner.party,
        pWinner.name,
        pWinner.votes,
        pWinner.pct,
        pWinner.ev,
        pWinner.ev,
        'Elected President',
        pres.isEstimated ? 'Reconstructed Popular Estimate' : 'Certified Historical Record'
      ]));
    }
    if (pRunner && (pRunner.pct >= 1.0 || pRunner.ev > 0 || pRunner.votes > 0)) {
      branchRows.push(toCSVRow([
        c.year,
        'Presidential',
        pRunner.party,
        pRunner.name,
        pRunner.votes,
        pRunner.pct,
        pRunner.ev,
        pRunner.ev,
        'Runner-up',
        pres.isEstimated ? 'Reconstructed Popular Estimate' : 'Certified Historical Record'
      ]));
    }
    if (pres.thirdParties) {
      for (const tp of pres.thirdParties) {
        if (tp.pct >= 1.0 || tp.ev > 0) {
          branchRows.push(toCSVRow([
            c.year,
            'Presidential',
            tp.party,
            tp.name,
            tp.votes,
            tp.pct,
            tp.ev,
            tp.ev,
            'Third Party / Dissident',
            'Certified Historical Record'
          ]));
        }
      }
    }
  }

  // House branch rows
  for (const hp of h.parties) {
    if (hp.pct >= 1.0 || hp.seats > 0) {
      branchRows.push(toCSVRow([
        c.year,
        'U.S. House',
        hp.name,
        `${hp.name} Congressional Caucus`,
        hp.votes,
        hp.pct,
        hp.seats,
        hp.seats,
        hp.seats >= (h.parties.reduce((acc, x) => acc + x.seats, 0) / 2) ? 'Majority' : 'Minority',
        'Certified Aggregate Returns'
      ]));
    }
  }

  // Senate branch rows
  for (const sp of s.parties) {
    branchRows.push(toCSVRow([
      c.year,
      'U.S. Senate',
      sp.name,
      `${sp.name} Senate Conference`,
      sp.votes !== null ? sp.votes : 'N/A (State Legislature Choice)',
      sp.pct !== null ? sp.pct : 'N/A',
      sp.seatsWon,
      sp.seatsTotal,
      sp.seatsTotal >= (s.parties.reduce((acc, x) => acc + x.seatsTotal, 0) / 2) ? 'Majority' : 'Minority',
      s.selectionMode.includes('17th') || s.selectionMode.includes('Popular') ? 'Certified Popular Returns' : 'State Legislative Election Records'
    ]));
  }

  // Governor branch rows
  branchRows.push(toCSVRow([
    c.year,
    'Governors',
    g.party1,
    `${g.party1} Governors Association`,
    'N/A (Statewide Cumulative)',
    ((g.party1Held / g.total) * 100).toFixed(1),
    g.party1Held,
    g.party1Held,
    g.party1Held > g.party2Held ? 'Majority of States' : 'Minority',
    'Historical Gubernatorial Roster'
  ]));
  branchRows.push(toCSVRow([
    c.year,
    'Governors',
    g.party2,
    `${g.party2} Governors Association`,
    'N/A (Statewide Cumulative)',
    ((g.party2Held / g.total) * 100).toFixed(1),
    g.party2Held,
    g.party2Held,
    g.party2Held >= g.party1Held ? 'Majority of States' : 'Minority',
    'Historical Gubernatorial Roster'
  ]));
  if (g.otherHeld > 0) {
    branchRows.push(toCSVRow([
      c.year,
      'Governors',
      'Third Party / Independent',
      'Independent / Third Party Governors',
      'N/A',
      ((g.otherHeld / g.total) * 100).toFixed(1),
      g.otherHeld,
      g.otherHeld,
      'Independent / Third Party',
      'Historical Gubernatorial Roster'
    ]));
  }

  // State Legislature branch rows
  branchRows.push(toCSVRow([
    c.year,
    'State Legislatures',
    c.house.parties[0] ? c.house.parties[0].name : 'Party 1',
    'Chamber Majorities Held',
    'N/A (Legislative Aggregate)',
    ((leg.party1Chambers / leg.totalChambers) * 100).toFixed(1),
    leg.party1Chambers,
    Math.round(leg.totalSeatsEst * (leg.party1Chambers / leg.totalChambers)),
    leg.party1Chambers > leg.party2Chambers ? 'Chamber Majority Leader' : 'Chamber Minority',
    'NCSL / ICPSR Chamber Records'
  ]));
  branchRows.push(toCSVRow([
    c.year,
    'State Legislatures',
    c.house.parties[1] ? c.house.parties[1].name : 'Party 2',
    'Chamber Majorities Held',
    'N/A (Legislative Aggregate)',
    ((leg.party2Chambers / leg.totalChambers) * 100).toFixed(1),
    leg.party2Chambers,
    Math.round(leg.totalSeatsEst * (leg.party2Chambers / leg.totalChambers)),
    leg.party2Chambers >= leg.party1Chambers ? 'Chamber Majority Leader' : 'Chamber Minority',
    'NCSL / ICPSR Chamber Records'
  ]));
}

// -------------------------------------------------------------
// SPREADSHEET 3: HISTORICAL_STARTING_DATES_STATE_MATRIX.csv
// -------------------------------------------------------------
const stateHeaders = [
  'Start_Year',
  'Era_Name',
  'State_Name',
  'State_Abbr',
  'Electoral_Votes',
  'Presidential_Winner',
  'Presidential_Winner_Party',
  'Presidential_Winner_Votes',
  'Presidential_Winner_Pct',
  'Presidential_RunnerUp',
  'Presidential_RunnerUp_Party',
  'Presidential_RunnerUp_Votes',
  'Presidential_RunnerUp_Pct',
  'Presidential_ThirdParty_Details',
  'Governor_Name',
  'Governor_Party',
  'Governor_Votes',
  'Governor_Pct',
  'Senate_Class_I_Party',
  'Senate_Class_II_Party',
  'Senate_Class_III_Party',
  'Senate_Election_Votes',
  'House_Total_Seats',
  'House_Party1_Seats',
  'House_Party2_Seats',
  'House_ThirdParty_Seats',
  'House_Party1_Popular_Votes',
  'House_Party2_Popular_Votes',
  'State_Senate_Total_Seats',
  'State_Senate_Party1_Seats',
  'State_Senate_Party2_Seats',
  'State_Senate_Control',
  'State_House_Total_Seats',
  'State_House_Party1_Seats',
  'State_House_Party2_Seats',
  'State_House_Control',
  'State_Partisan_Lean',
  'Historical_Notes'
];

const rawStateRecords = [];

function addEraStates(year, eraName, stateList) {
  for (const s of stateList) {
    rawStateRecords.push({
      year,
      eraName,
      name: s.name,
      abbr: s.abbr,
      ev: s.ev,
      pWinner: s.pWinner,
      pWinnerP: s.pWinnerP,
      pWinnerVotes: s.pWinnerVotes !== undefined ? s.pWinnerVotes : 'Legislative / Uncontested',
      pWinnerPct: s.pWinnerPct !== undefined ? s.pWinnerPct : '100.0',
      pRunner: s.pRunner,
      pRunnerP: s.pRunnerP,
      pRunnerVotes: s.pRunnerVotes !== undefined ? s.pRunnerVotes : '0',
      pRunnerPct: s.pRunnerPct !== undefined ? s.pRunnerPct : '0.0',
      thirdParties: s.thirdParties || 'None',
      govName: s.govName,
      govP: s.govP,
      govVotes: s.govVotes !== undefined ? s.govVotes : 'Legislative Choice',
      govPct: s.govPct !== undefined ? s.govPct : '50.0+',
      sen1: s.sen1 || 'N/A',
      sen2: s.sen2 || 'N/A',
      sen3: s.sen3 || 'N/A',
      senVotes: s.senVotes || 'State Legislature Selection',
      hTotal: s.hTotal,
      hP1: s.hP1,
      hP2: s.hP2,
      hThird: s.hThird || 0,
      hP1Votes: s.hP1Votes !== undefined ? s.hP1Votes : 'Estimated',
      hP2Votes: s.hP2Votes !== undefined ? s.hP2Votes : 'Estimated',
      sSen: s.sSen,
      sSenP1: s.sSenP1,
      sSenP2: s.sSenP2,
      sSenCtrl: s.sSenP1 > s.sSenP2 ? 'Party 1 Majority' : (s.sSenP2 > s.sSenP1 ? 'Party 2 Majority' : 'Even / Coalition'),
      sH: s.sH,
      sHP1: s.sHP1,
      sHP2: s.sHP2,
      sHCtrl: s.sHP1 > s.sHP2 ? 'Party 1 Majority' : (s.sHP2 > s.sHP1 ? 'Party 2 Majority' : 'Even / Coalition'),
      lean: s.lean,
      notes: s.notes || 'Official Returns / Best Historical Estimates'
    });
  }
}

// 1. 1792 (15 States)
const { STATES_1792 } = require('./build-state-matrix.cjs');
addEraStates(1792, 'The Federalist Era', STATES_1792);

// 2. 1828 (24 States)
const STATES_1828 = [
  { abbr: 'AL', name: 'Alabama', ev: 5, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 16782, pWinnerPct: 89.9, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 1878, pRunnerPct: 10.1, govName: 'John Murphy', govP: 'Democratic', sen2: 'William R. King (Dem)', sen3: 'John McKinley (Dem)', hTotal: 3, hP1: 3, hP2: 0, sSen: 22, sSenP1: 20, sSenP2: 2, sH: 72, sHP1: 65, sHP2: 7, lean: 'DEM+40.0', notes: 'Jacksonian deep southern fortress.' },
  { abbr: 'CT', name: 'Connecticut', ev: 8, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 13838, pWinnerPct: 75.4, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 4448, pRunnerPct: 24.6, govName: 'Gideon Tomlinson', govP: 'National Republican', sen1: 'Samuel A. Foot (Nat-Rep)', sen3: 'Calvin Willey (Nat-Rep)', hTotal: 6, hP1: 6, hP2: 0, sSen: 12, sSenP1: 10, sSenP2: 2, sH: 208, sHP1: 160, sHP2: 48, lean: 'NR+50.0', notes: 'Adams New England stronghold.' },
  { abbr: 'DE', name: 'Delaware', ev: 3, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 0, pWinnerPct: 0, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 0, pRunnerPct: 0, govName: 'Charles Polk Jr.', govP: 'National Republican', sen1: 'Louis McLane (Dem)', sen2: 'Henry M. Ridgely (Dem)', hTotal: 1, hP1: 1, hP2: 0, sSen: 9, sSenP1: 5, sSenP2: 4, sH: 21, sHP1: 12, sHP2: 9, lean: 'NR+4.0', notes: 'Electors chosen by state legislature.' },
  { abbr: 'GA', name: 'Georgia', ev: 9, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 19363, pWinnerPct: 100.0, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 0, pRunnerPct: 0.0, govName: 'John Forsyth', govP: 'Democratic', sen2: 'George M. Troup (Dem)', sen3: 'Oliver H. Prince (Dem)', hTotal: 7, hP1: 7, hP2: 0, sSen: 76, sSenP1: 76, sSenP2: 0, sH: 140, sHP1: 140, sHP2: 0, lean: 'DEM+100.0', notes: 'Adams not on ballot; unanimous Jacksonian slate.' },
  { abbr: 'IL', name: 'Illinois', ev: 3, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 9560, pWinnerPct: 67.2, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 4662, pRunnerPct: 32.8, govName: 'Ninian Edwards', govP: 'Democratic-Republican', sen2: 'Jesse B. Thomas (Nat-Rep)', sen3: 'Elias Kane (Dem)', hTotal: 1, hP1: 1, hP2: 0, sSen: 18, sSenP1: 12, sSenP2: 6, sH: 36, sHP1: 24, sHP2: 12, lean: 'DEM+34.0', notes: 'Frontier agrarian democracy.' },
  { abbr: 'IN', name: 'Indiana', ev: 5, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 22257, pWinnerPct: 56.6, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 17052, pRunnerPct: 43.4, govName: 'James B. Ray', govP: 'Independent', sen1: 'James Noble (Nat-Rep)', sen3: 'William Hendricks (Dem)', hTotal: 3, hP1: 2, hP2: 1, sSen: 22, sSenP1: 12, sSenP2: 10, sH: 57, sHP1: 32, sHP2: 25, lean: 'DEM+13.0', notes: 'Emerging Ohio Valley battleground.' },
  { abbr: 'KY', name: 'Kentucky', ev: 14, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 39397, pWinnerPct: 55.5, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 31460, pRunnerPct: 44.5, govName: 'Thomas Metcalfe', govP: 'National Republican', sen2: 'John Rowan (Dem)', sen3: 'Richard M. Johnson (Dem)', hTotal: 12, hP1: 10, hP2: 2, sSen: 38, sSenP1: 20, sSenP2: 18, sH: 100, sHP1: 52, sHP2: 48, lean: 'DEM+11.0', notes: 'Henry Clay home state; historic Jacksonian victory.' },
  { abbr: 'LA', name: 'Louisiana', ev: 5, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 4603, pWinnerPct: 53.0, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 4076, pRunnerPct: 47.0, govName: 'Pierre Derbigny', govP: 'National Republican', sen2: 'Dominique Bouligny (Nat-Rep)', sen3: 'Josiah S. Johnston (Nat-Rep)', hTotal: 3, hP1: 2, hP2: 1, sSen: 17, sSenP1: 9, sSenP2: 8, sH: 50, sHP1: 26, sHP2: 24, lean: 'DEM+6.0', notes: 'First popular vote election for presidential electors in LA.' },
  { abbr: 'ME', name: 'Maine', ev: 9, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 20773, pWinnerPct: 59.8, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 13927, pRunnerPct: 40.2, govName: 'Enoch Lincoln', govP: 'Democratic-Republican', sen1: 'John Holmes (Nat-Rep)', sen2: 'Albion Parris (Dem)', hTotal: 7, hP1: 6, hP2: 1, sSen: 20, sSenP1: 13, sSenP2: 7, sH: 145, sHP1: 90, sHP2: 55, lean: 'NR+19.0', notes: 'Adams carries 8 EVs, Jackson 1 EV by district.' },
  { abbr: 'MD', name: 'Maryland', ev: 11, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 25527, pWinnerPct: 50.7, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 24789, pRunnerPct: 49.3, govName: 'Daniel Martin', govP: 'National Republican', sen1: 'Samuel Smith (Dem)', sen3: 'Ezekiel F. Chambers (Nat-Rep)', hTotal: 9, hP1: 5, hP2: 4, sSen: 15, sSenP1: 9, sSenP2: 6, sH: 80, sHP1: 42, sHP2: 38, lean: 'EVEN', notes: 'Split EVs: Adams 6, Jackson 5.' },
  { abbr: 'MA', name: 'Massachusetts', ev: 15, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 29836, pWinnerPct: 76.4, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 6016, pRunnerPct: 15.4, govName: 'Levi Lincoln Jr.', govP: 'National Republican', sen1: 'Daniel Webster (Nat-Rep)', sen2: 'Nathaniel Silsbee (Nat-Rep)', hTotal: 13, hP1: 13, hP2: 0, sSen: 40, sSenP1: 36, sSenP2: 4, sH: 480, sHP1: 410, sHP2: 70, lean: 'NR+61.0', notes: 'Adams home state bastion.' },
  { abbr: 'MS', name: 'Mississippi', ev: 3, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 6763, pWinnerPct: 81.1, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 1581, pRunnerPct: 18.9, govName: 'Gerard Brandon', govP: 'Democratic', sen1: 'Powhatan Ellis (Dem)', sen2: 'Thomas H. Williams (Dem)', hTotal: 1, hP1: 1, hP2: 0, sSen: 12, sSenP1: 10, sSenP2: 2, sH: 36, sHP1: 30, sHP2: 6, lean: 'DEM+62.0', notes: 'Jacksonian deep southern landslide.' },
  { abbr: 'MO', name: 'Missouri', ev: 3, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 8272, pWinnerPct: 70.6, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 3400, pRunnerPct: 29.4, govName: 'John Miller', govP: 'Democratic', sen1: 'Thomas Hart Benton (Dem)', sen3: 'David Barton (Nat-Rep)', hTotal: 1, hP1: 1, hP2: 0, sSen: 18, sSenP1: 14, sSenP2: 4, sH: 54, sHP1: 40, sHP2: 14, lean: 'DEM+41.0', notes: 'Thomas Hart Benton political machine.' },
  { abbr: 'NH', name: 'New Hampshire', ev: 8, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 24124, pWinnerPct: 53.6, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 20922, pRunnerPct: 46.4, govName: 'Benjamin Pierce', govP: 'Democratic', sen2: 'Samuel Bell (Nat-Rep)', sen3: 'Levi Woodbury (Dem)', hTotal: 6, hP1: 5, hP2: 1, sSen: 12, sSenP1: 7, sSenP2: 5, sH: 220, sHP1: 125, sHP2: 95, lean: 'NR+7.0', notes: 'Adams carries New England ticket.' },
  { abbr: 'NJ', name: 'New Jersey', ev: 8, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 23753, pWinnerPct: 52.1, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 21884, pRunnerPct: 47.9, govName: 'Isaac H. Williamson', govP: 'Federalist/Nat-Rep', sen1: 'Mahlon Dickerson (Dem)', sen2: 'Ephraim Bateman (Nat-Rep)', hTotal: 6, hP1: 6, hP2: 0, sSen: 14, sSenP1: 8, sSenP2: 6, sH: 43, sHP1: 24, sHP2: 19, lean: 'NR+4.0', notes: 'Tight mid-Atlantic contest.' },
  { abbr: 'NY', name: 'New York', ev: 36, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 140763, pWinnerPct: 51.4, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 132848, pRunnerPct: 48.6, govName: 'Martin Van Buren', govP: 'Democratic', sen1: 'Nathan Sanford (Nat-Rep)', sen3: 'Charles E. Dudley (Dem)', hTotal: 34, hP1: 20, hP2: 14, sSen: 32, sSenP1: 20, sSenP2: 12, sH: 128, sHP1: 78, sHP2: 50, lean: 'DEM+3.0', notes: 'Van Buren\'s Albany Regency delivers key 20 EVs for Jackson.' },
  { abbr: 'NC', name: 'North Carolina', ev: 15, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 37814, pWinnerPct: 73.1, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 13918, pRunnerPct: 26.9, govName: 'James Iredell Jr.', govP: 'Democratic', sen2: 'John Branch (Dem)', sen3: 'James Iredell Jr. (Dem)', hTotal: 13, hP1: 11, hP2: 2, sSen: 62, sSenP1: 48, sSenP2: 14, sH: 130, sHP1: 96, sHP2: 34, lean: 'DEM+46.0', notes: 'Overwhelming Southern agricultural vote.' },
  { abbr: 'OH', name: 'Ohio', ev: 16, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 67597, pWinnerPct: 51.6, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 63396, pRunnerPct: 48.4, govName: 'Allen Trimble', govP: 'National Republican', sen1: 'Benjamin Ruggles (Nat-Rep)', sen3: 'Jacob Burnet (Nat-Rep)', hTotal: 14, hP1: 8, hP2: 6, sSen: 36, sSenP1: 19, sSenP2: 17, sH: 72, sHP1: 38, sHP2: 34, lean: 'DEM+3.0', notes: 'Western frontier alignment flips Ohio to Jackson.' },
  { abbr: 'PA', name: 'Pennsylvania', ev: 28, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 101652, pWinnerPct: 66.7, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 50848, pRunnerPct: 33.3, govName: 'J. Andrew Shulze', govP: 'Democratic', sen1: 'William Marks (Nat-Rep)', sen3: 'Isaac D. Barnard (Dem)', hTotal: 26, hP1: 25, hP2: 1, sSen: 33, sSenP1: 24, sSenP2: 9, sH: 100, sHP1: 76, sHP2: 24, lean: 'DEM+33.0', notes: 'Keystone state gives massive two-to-one victory to Jackson.' },
  { abbr: 'RI', name: 'Rhode Island', ev: 4, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 2754, pWinnerPct: 77.2, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 821, pRunnerPct: 22.8, govName: 'James Fenner', govP: 'Democratic-Republican', sen1: 'Asher Robbins (Nat-Rep)', sen2: 'Nehemiah R. Knight (Nat-Rep)', hTotal: 2, hP1: 2, hP2: 0, sSen: 10, sSenP1: 8, sSenP2: 2, sH: 72, sHP1: 56, sHP2: 16, lean: 'NR+54.0', notes: 'Industrial maritime New England bastion.' },
  { abbr: 'SC', name: 'South Carolina', ev: 11, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 0, pWinnerPct: 0, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 0, pRunnerPct: 0, govName: 'John Taylor', govP: 'Democratic', sen2: 'Robert Y. Hayne (Dem)', sen3: 'William Smith (Dem)', hTotal: 9, hP1: 9, hP2: 0, sSen: 45, sSenP1: 45, sSenP2: 0, sH: 124, sHP1: 124, sHP2: 0, lean: 'DEM+100.0', notes: 'Electors chosen by state legislature. Calhoun elected VP.' },
  { abbr: 'TN', name: 'Tennessee', ev: 11, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 44277, pWinnerPct: 95.2, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 2240, pRunnerPct: 4.8, govName: 'Sam Houston', govP: 'Democratic', sen1: 'John Henry Eaton (Dem)', sen2: 'Hugh Lawson White (Dem)', hTotal: 9, hP1: 9, hP2: 0, sSen: 20, sSenP1: 20, sSenP2: 0, sH: 60, sHP1: 60, sHP2: 0, lean: 'DEM+90.0', notes: 'Jackson\'s home state gives overwhelming 95% victory.' },
  { abbr: 'VT', name: 'Vermont', ev: 7, pWinner: 'John Quincy Adams', pWinnerP: 'National Republican', pWinnerVotes: 25363, pWinnerPct: 75.1, pRunner: 'Andrew Jackson', pRunnerP: 'Democratic', pRunnerVotes: 8350, pRunnerPct: 24.9, govName: 'Samuel C. Crafts', govP: 'National Republican', sen1: 'Horatio Seymour (Nat-Rep)', sen3: 'Dudley Chase (Nat-Rep)', hTotal: 5, hP1: 5, hP2: 0, sSen: 0, sSenP1: 0, sSenP2: 0, sH: 220, sHP1: 175, sHP2: 45, lean: 'NR+50.0', notes: 'New England National Republican sweep; unicameral legislature.' },
  { abbr: 'VA', name: 'Virginia', ev: 24, pWinner: 'Andrew Jackson', pWinnerP: 'Democratic', pWinnerVotes: 26854, pWinnerPct: 69.0, pRunner: 'John Quincy Adams', pRunnerP: 'National Republican', pRunnerVotes: 12076, pRunnerPct: 31.0, govName: 'William Branch Giles', govP: 'Democratic', sen1: 'John Tyler (Dem)', sen2: 'Littleton W. Tazewell (Dem)', hTotal: 22, hP1: 16, hP2: 6, sSen: 24, sSenP1: 18, sSenP2: 6, sH: 214, sHP1: 154, sHP2: 60, lean: 'DEM+38.0', notes: 'Old Dominion strongly backs Jackson.' }
];
addEraStates(1828, 'The Antebellum Era', STATES_1828);

// 3. 1860, 1896, 1932, 1968, 2008, 2024
const { generateLaterEraStates } = require('./build-later-eras-state-data.cjs');
generateLaterEraStates(addEraStates);

// 4. Player-requested scenarios: 1912, 1924, 1960, 1980, 1992, 2000, 2016
const { addScenarioStates } = require('./build-additional-scenarios-state-data.cjs');
addScenarioStates(addEraStates);

// Sort all state records chronologically by year, then alphabetically by state abbr
rawStateRecords.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  return a.abbr.localeCompare(b.abbr);
});

const stateRows = [stateHeaders.join(',')];
for (const s of rawStateRecords) {
  stateRows.push(toCSVRow([
    s.year,
    s.eraName,
    s.name,
    s.abbr,
    s.ev,
    s.pWinner,
    s.pWinnerP,
    s.pWinnerVotes,
    s.pWinnerPct,
    s.pRunner,
    s.pRunnerP,
    s.pRunnerVotes,
    s.pRunnerPct,
    s.thirdParties,
    s.govName,
    s.govP,
    s.govVotes,
    s.govPct,
    s.sen1,
    s.sen2,
    s.sen3,
    s.senVotes,
    s.hTotal,
    s.hP1,
    s.hP2,
    s.hThird,
    s.hP1Votes,
    s.hP2Votes,
    s.sSen,
    s.sSenP1,
    s.sSenP2,
    s.sSenCtrl,
    s.sH,
    s.sHP1,
    s.sHP2,
    s.sHCtrl,
    s.lean,
    s.notes
  ]));
}

// Write output files
fs.writeFileSync(path.join(__dirname, '../HISTORICAL_ELECTIONS_CYCLE_MASTER_1788_2024.csv'), masterRows.join('\n'));
fs.writeFileSync(path.join(__dirname, '../HISTORICAL_BRANCH_RACES_1788_2024.csv'), branchRows.join('\n'));
fs.writeFileSync(path.join(__dirname, '../HISTORICAL_STARTING_DATES_STATE_MATRIX.csv'), stateRows.join('\n'));

console.log('Successfully regenerated:');
console.log(`- HISTORICAL_ELECTIONS_CYCLE_MASTER_1788_2024.csv (${masterRows.length} rows)`);
console.log(`- HISTORICAL_BRANCH_RACES_1788_2024.csv (${branchRows.length} rows)`);
console.log(`- HISTORICAL_STARTING_DATES_STATE_MATRIX.csv (${stateRows.length} rows) across 15 distinct start dates!`);
