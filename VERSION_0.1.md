# Coalition Builder: Party Chair — Version 0.1

Version 0.1 establishes the game’s first 2028 national scenario.

## Implemented

- Democratic and Republican parties use blue and red respectively; both have state chapters in all 50 states. Libertarian and Green organizations remain smaller.
- The state lean baseline uses the 2024 presidential margins and 2020 electoral-vote apportionment from the user's Battle For America source.
- The House map contains all 435 districts under 2020 apportionment. Each district has a saved lean in `scenario-2028.js`.
- The Senate map separates Classes I, II, and III (33, 33, and 34 seats). The 2028 Senate election is Class III, with 34 race records.
- The governor map contains all 50 states and the 11 states with a gubernatorial race in the 2028 scenario.
- The state legislature map reports party control of both chambers (Nebraska is nonpartisan; Alaska is coalition-led).
- The player begins with 20 chair turns before party primaries, four leadership actions per turn, and five candidate endorsements per turn.
- House, Senate Class III, and 2028 governor primaries have distinct Democratic and Republican fields. Each field starts with four candidates: a progressive and moderate for Democrats; a MAGA candidate and moderate for Republicans, plus two additional wings.
- A state recruit costs `2 + quality` million dollars, consumes one action, and adds a candidate with quality from 1 to 10. If the recruit loses, their wing loses 2.5 confidence points and the recruit is recorded as unavailable.
- The 2028 presidential scenario keeps Jon Ossoff as the Democratic candidate and J. D. Vance as the Republican candidate. The Democratic ticket gets a South turnout bonus; the Republican ticket gets a Midwest turnout bonus. Chair selection of presidential candidates is not implemented.
- The national environment tracker starts Even and shifts with the game’s public mood; it affects the national party lean used in forecasts.

## Data quality notes

- The BFA source did not contain presidential vote leans for all 435 congressional districts. The district values in `scenario-2028.js` are modeled estimates centered on each state’s 2024 presidential lean, not certified district returns. Replace them when an authoritative district-level dataset is selected.
- State legislature controls combine the available 2026 chamber baseline with reported post-election projections. They are chamber-control labels, not exact 2026 seat counts.
- Alaska and Kansas gubernatorial races remained uncalled on Nov. 10, 2026. The map labels their leading party as provisional.
- At the v0.1 release, primaries covered federal House races, Senate Class III, and 2028 gubernatorial races. State legislative chamber primaries and the post-primary general-election stage were added in v0.2; see `VERSION_0.2.md`.

## Sources

- Battle For America source files supplied by the owner: `build32/src/data/states.js`, `downballot.js`, and `senate.js`.
- [U.S. Senate classes and terms](https://www.senate.gov/senators/qualifications_termsofservice.htm) and [current Senate roster by class](https://www.senate.gov/senators/).
- [NCSL State Partisan Composition](https://www.ncsl.org/about-state-legislatures/state-partisan-composition), accessed Nov. 10, 2026; its seat totals were last updated Oct. 6, before the 2026 general election.
- [2026 state legislative election results](https://ballotpedia.org/Election_results,_2026:_State_legislatures), updated Nov. 9, 2026.
- [2026 governor election results](https://ballotpedia.org/Election_results,_2026:_Governors), updated Nov. 10, 2026.
