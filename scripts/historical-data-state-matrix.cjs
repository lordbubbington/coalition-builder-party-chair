/**
 * historical-data-state-matrix.cjs
 * State-by-State Starting Matrices across 8 Landmark Historical Start Dates:
 * - 1792 (1st Era: Federalist vs Democratic-Republican) - 15 States
 * - 1828 (2nd Era: Jacksonian Democratic vs National Republican) - 24 States
 * - 1860 (3rd Era: Lincoln Republican vs Northern/Southern Democratic) - 33 States
 * - 1896 (4th Era: McKinley Republican vs Bryan Populist/Democratic) - 45 States
 * - 1932 (5th Era: FDR New Deal Coalition vs Hoover Republican) - 48 States
 * - 1968 (6th Era: Nixon vs Humphrey vs Wallace AIP) - 50 States
 * - 2008 (7th Era: Modern Realignment - Obama vs McCain) - 50 States
 * - 2024 (Scenario Baseline: Trump vs Harris certified returns) - 50 States
 */

const fs = require('fs');
const path = require('path');

// Helper to construct a state record
function makeStateRecord(opts) {
  return {
    startYear: opts.year,
    eraName: opts.era,
    stateName: opts.state,
    stateAbbr: opts.abbr,
    electoralVotes: opts.ev,
    presWinner: opts.presWinner,
    presWinnerParty: opts.presWinnerParty,
    presWinnerVotes: opts.presWinnerVotes,
    presWinnerPct: opts.presWinnerPct,
    presRunnerUp: opts.presRunnerUp,
    presRunnerUpParty: opts.presRunnerUpParty,
    presRunnerUpVotes: opts.presRunnerUpVotes,
    presRunnerUpPct: opts.presRunnerUpPct,
    presThirdParty: opts.presThirdParty || 'None',
    govName: opts.govName,
    govParty: opts.govParty,
    govVotes: opts.govVotes,
    govPct: opts.govPct,
    senateClass1Party: opts.sen1Party,
    senateClass2Party: opts.sen2Party,
    senateClass3Party: opts.sen3Party,
    senateElectionVotes: opts.senElectionVotes || 'Legislative Selection',
    houseTotalSeats: opts.houseTotal,
    houseParty1Seats: opts.houseP1Seats,
    houseParty2Seats: opts.houseP2Seats,
    houseThirdSeats: opts.houseThirdSeats || 0,
    housePopularVotesP1: opts.houseP1Votes,
    housePopularVotesP2: opts.houseP2Votes,
    stateSenateSeats: opts.stateSenSeats,
    stateSenateP1Seats: opts.stateSenP1,
    stateSenateP2Seats: opts.stateSenP2,
    stateSenateControl: opts.stateSenCtrl,
    stateHouseSeats: opts.stateHouseSeats,
    stateHouseP1Seats: opts.stateHouseP1,
    stateHouseP2Seats: opts.stateHouseP2,
    stateHouseControl: opts.stateHouseCtrl,
    partisanLean: opts.lean,
    sourceNotes: opts.notes || 'Official Records / Reconstructed Historical Estimates'
  };
}

module.exports = {
  makeStateRecord
};
