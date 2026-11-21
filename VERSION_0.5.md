# Version 0.5 — represented electorate and dashboard

## Game changes

- Reworked the dashboard summary into six cards: the party’s National Committee budget, Millions of Members, local chapters, State Houses controlled, Senate Seats Controlled, and House Seats Controlled.
- The map now sits directly below those cards. The House map’s district hover details include modeled voter totals and affiliation estimates; statewide maps include statewide totals.
- Replaced the old membership-index display with party-affiliated voters from the national model. The interface displays the electorate represented by the model, totaling 155.00 million voters. Every internal voter record represents 100 people; the internal sample size is not displayed in the game.
- Reduced the existing interface typography by 20% and refit the dashboard cards at desktop, tablet, and phone widths.
- Added a baseline count of 5,462 state lower-house seats across all 50 states, including Nebraska’s unicameral legislature. State control is shown separately as the number of state lower houses controlled. When a modeled election changes lower-house control, the engine adjusts that state’s party seat count to reflect a bare majority; it does not simulate individual state legislative districts.

## Voter model and method

The model contains 155 million represented voters, with exactly 100 represented people per internal voter record. Counts aggregate to the same national total across Democratic, Republican, independent, and third-party affiliations. The third-party total is split into Libertarian, Green, and other affiliations. Voter numbers shown in the interface use the represented population scale.

State sample weights use 2024 active registration totals from the Election Assistance Commission state reporting, collated in the PollCheck table. North Dakota does not register voters, so an eligible-voter estimate is used. The state weights are normalized to the game’s 155 million represented voters.

For states that publish party registration, the model uses the latest reported Democratic, Republican, unaffiliated, and minor-party shares available in the 2026 registration table. States without party registration use estimates based on a national affiliation mix adjusted by the state’s 2024 presidential margin. These are affiliation estimates, not claims that every state voter is formally registered with a party.

For congressional districts on unchanged 2024 boundaries, district weights use Census 2020–2024 American Community Survey citizen voting-age population estimates. Nine states used new district maps for the 2026 election: Alabama, California, Florida, Louisiana, North Carolina, Ohio, Tennessee, Texas, and Utah. Census district CVAP for the new 120th Congress boundaries was not available when this build was prepared. Their state totals are divided across districts using the reported 2026 district vote totals as a population proxy. Within every state, Democratic and Republican district estimates vary with district election lean while preserving their state totals; independent and third-party totals are apportioned by district weight.

The model therefore preserves national and state voter totals exactly at its selected scale, but some district party splits and all Green/Libertarian/other splits are estimates. It does not claim a precise registration or party-identification count for every voter.

## Data sources

- [U.S. Census Bureau: 2020–2024 CVAP data](https://www.census.gov/programs-surveys/decennial-census/about/voting-rights/cvap/2020-2024-CVAP.html)
- [U.S. Census Bureau: congressional districts for the 120th Congress](https://www.census.gov/programs-surveys/decennial-census/about/rdo/congressional-districts.120th_Congress.html)
- [PollCheck: 2024 voter registration totals](https://www.pollcheck.com/registration/)
- [Ballotpedia: partisan affiliations of registered voters](https://ballotpedia.org/Partisan_affiliations_of_registered_voters)
- [Pew Research Center: 2024 voting patterns](https://www.pewresearch.org/politics/2025/06/26/voting-patterns-in-the-2024-election/)
- [NCSL: state partisan composition](https://www.ncsl.org/about-state-legislatures/state-partisan-composition)
- State legislative chamber baseline and current-year election results are compiled in `assets/maps/stateLegislatureResults2026.js`; source and per-state status are retained in the generated data file.

## Project files

- `voter-model-0.5.js` contains state totals, district totals, and voter affiliation allocations.
- `scripts/generate-voter-model-0.5.cjs` rebuilds that model from the source CSVs in `obj/`.
- `state-house-data-0.5.js` contains lower-house seat counts by state.
- `scripts/generate-state-house-data-0.5.cjs` rebuilds the lower-house baseline from the tracked legislative results source.
- The Windows executable bundles both data files with the application.
