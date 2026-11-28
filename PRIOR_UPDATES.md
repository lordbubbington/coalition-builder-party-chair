# Coalition Builder: Party Chair — Prior Updates Changelog

This document maintains the persistent, consolidated changelog and architectural history for all shipped versions of **Coalition Builder: Party Chair** (Version 0.1 through Version 0.16.0).

---

## VERSION 0.1

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

---

## VERSION 0.2

# Coalition Builder: Party Chair — Version 0.2

Version 0.2 carries the 2028 scenario beyond the 20-turn organizing and primary phase into general election night.

## Added in 0.2

- The primary catalog now includes 98 state legislative chamber-control races: lower and upper chambers in 49 states. Nebraska is omitted because its legislature is nonpartisan.
- Each state legislative primary has a distinct four-candidate Democratic and Republican field and supports the same endorsement and recruit mechanics as federal and gubernatorial races.
- Primary results retain the winning candidate's quality and wing for general-election calculations.
- After the primaries, the chair gets four general campaign turns, each with four actions. A field deployment costs $2M and adds 2.5 support points in a selected state, with a maximum of three deployments per state.
- Statewide campaigns influence presidential and House forecasts and the Senate, governor, and state legislative results for that state.
- Election night resolves the presidential contest, 435 U.S. House districts, all 34 Senate Class III seats, the 11 scheduled governor races, and partisan control of both state legislative chambers outside Nebraska.
- The 2028 Democratic and Republican presidential candidates display as Jon Ossoff and J. D. Vance.
- Saves migrate to the new general-campaign phase while keeping prior v0.1 saves loadable.

## Modeling limits

- The state legislature map does not include individual state legislative districts or chamber seat totals. The 98 contests decide chamber control directly; results are not projections of exact seat counts.
- State legislative, Senate, and governor general-election margins use each state’s party support, candidate quality, and Senate incumbent party. Candidate names and quality are fictional game data.
- The presidential and U.S. House count continues to use the existing four-party ranked-choice engine. The general campaign adds state-level support to that model.
- Senate Classes I and II remain carryover map classes; only Class III votes in the 2028 scenario.

See [VERSION_0.1.md](VERSION_0.1.md) for the original map data notes and source list.

---

## VERSION 0.2.1

# Version 0.2.1

Version 0.2.1 adds a 40-issue national platform, a 1–10 issue-position slider, a larger responsive interface, and the studio-style Coalition Builder icon.

## Issue platform

The platform has seven categories: Economy & Affordability, Health & Family, Democracy & Government, Immigration & Public Safety, Rights & Education, Climate & Technology, and Foreign Affairs & Defense. Each issue has two labeled policy endpoints and an integer slider from 1 to 10. Starting positions derive from the selected party's existing economic, social, climate, or party-structure profile.

Changing a position uses one leadership action and moves the corresponding existing party axis slightly toward the selected position. This keeps issue choices tied to the game's party profile rather than presenting the issue values as precise public-opinion estimates. Sliders become unavailable when no actions remain or the election is complete.

## Issue research

Poll notes provide salience context only; they do not claim that the public supports either slider endpoint. Sources are linked in the issue panel:

- Pew Research Center, [2026 issue priorities](https://www.pewresearch.org/politics/2026/10/08/economy-ranks-as-top-issue-in-midterms-for-all-voters-but-partisans-differ-over-the-importance-of-other-issues/), survey fielded September 28–October 4, 2026.
- Gallup, [issues voters say matter in the 2026 midterm](https://news.gallup.com/poll/716333/issues-voters-say-matter-midterm.aspx), survey fielded October 1–19, 2026.
- Associated Press, [2026 AP Voter Poll analysis](https://www.ap.org/news-highlights/elections/2026/how-trump-and-republicans-lost-the-2026-midterm-elections-according-to-the-ap-voter-poll/).
- KFF, [health care issues ahead of the 2026 midterm election](https://www.kff.org/public-opinion/kff-health-tracking-poll-health-care-issues-in-the-lead-up-to-the-2026-midterm-election/).

Where a cited survey does not offer a comparable salience measure for an issue, the panel says so instead of assigning a polling percentage. These are national issue prompts, not state-specific public opinion estimates.

## Visual changes

- Existing CSS font sizes have been multiplied by three.
- Grids reflow into a wider, vertically scrolling layout with smaller-screen breakpoints for maps, actions, and issues.
- UI colors and type follow the studio guide in [`ART_STYLE.md`](ART_STYLE.md).
- `assets/coalition-builder-icon.svg` provides the 512×512 square app mark and browser favicon.

## Build

The self-contained executable package now includes `issues-0.2.1.js` and the `assets` directory. Rebuild with `./build.ps1`.

---

## VERSION 0.2.2

# Version 0.2.2

Version 0.2.2 refines the oversized version 0.2.1 interface at the user's direction.

## Typography

- Reduced font sizes by 20% from version 0.2.1.
- Kept the larger, readable type scale and studio serif/sans/condensed/monospace roles.

## Full-window layout

- Removed the narrow centered page cap so the game uses the full available window width and height.
- Rebalanced the setup, campaign dashboard, map, and issue panels for desktop width, with responsive layouts at tablet and phone widths.
- Kept longer screens vertically scrollable so the full game interface remains available without clipping.
- Refined panel spacing, borders, backgrounds, buttons, and slider controls in the studio navy, ivory, copper, and teal palette.

The issue content and mechanics remain those described in [`VERSION_0.2.1.md`](VERSION_0.2.1.md). The Windows release executable is rebuilt with these interface changes.

---

## VERSION 0.3

# Version 0.3 — National control maps

Version 0.3 adds geographic maps for the U.S. House, Senate, governorships, and state legislatures. New games start with a 2026 control snapshot in those offices, ahead of the 2028 organizing cycle.

## What changed

- Replaced the state and district card view with national maps, Alaska and Hawaii insets, state labels, legends, and hover details.
- Added 435 congressional district shapes based on the Census Bureau's 2026 TIGER/Line district geography used for the 2026 election cycle.
- Added House district control from reported 2026 election results. Uncalled or unavailable outcomes remain gray.
- Added map selection for all three staggered Senate classes. Each class shows its current state delegation control; the 2028 election still contests Class III.
- Added current governor party and state legislative chamber control to new-game state.
- Split state legislatures are filled purple across the whole state. The map does not divide states into chamber halves. Nebraska is marked nonpartisan; unsettled chamber control is gray.
- Rebuilt the Windows executable to bundle the new map data.

## Caveats

2026 election returns are still provisional where races have not been called. The map marks those districts or offices as pending rather than treating a projected lead as a final win. State legislative control uses a reported post-election snapshot and has unsettled entries where the source does not establish control. These maps show party control, not exact seat-level state legislative election results.

See [MAP_DATA_0.3.md](MAP_DATA_0.3.md) for detailed source and geography notes.

---

## VERSION 0.4

# Version 0.4 — Interactive tutorial

Version 0.4 adds a guided tutorial that starts automatically the first time the player opens or begins a game. It uses the live game controls and does not advance until the player interacts with the highlighted control. The player can skip at any step.

## Tutorial sequence

- Explore the national House, Senate, governor, and state legislature maps, including all three Senate classes.
- Move an issue slider and learn how an issue change uses one leadership action.
- For Democratic and Republican chairs, endorse a primary candidate and encourage a state recruit. For other party chairs, inspect another primary race; they cannot endorse candidates in the major-party primaries.
- Use the four opening-turn leadership actions through real game buttons. The tutorial explains action costs, fundraising, state chapters, and faction summits.
- Resolve the turn's free party event and each regional convention decision.
- Advance the turn after the four actions, event, and conventions are complete. The final step explains the 20-turn organizing period, primary resolution, four-turn general campaign, field-team costs, and election results.

Tutorial choices are applied to the current party and save. The tutorial tells players this before the first interaction. Completion or skipping is saved in browser storage and carries across later games; an interrupted tutorial resumes at its last step.

---

## VERSION 0.4.1

# Version 0.4.1 — Map rendering fix

Version 0.4.1 fixes malformed district and state polygons in the national maps.

The map generator encoded each polygon ring with Google polyline characters and separated rings with `|`. That character is also valid inside an encoded coordinate, so some rings were split in the middle and decoded as broken paths. The separator is now `!`, which the coordinate encoder cannot produce. All map paths were regenerated and the Windows executable rebuilt.

The 0.4 interactive tutorial and the 0.3 map data remain in place.

---

## VERSION 0.4.2

# Version 0.4.2 — Senate class results

The Senate map now uses the latest election winner for each seat class:

- Class III: 2022 regular-election winners.
- Class I: 2024 regular-election winners.
- Class II: user-provided 2026 outcomes. Unlisted states carry forward the party that won the Class II seat in 2020.
- Ohio's 2026 Democratic gain is shown in Class III because that was a special election for the Class III seat vacated by J. D. Vance.

The user-provided Democratic gains are Texas, Ohio, Iowa, Alaska, Mississippi, South Carolina, North Carolina, Maine, and Kansas. Independent senators who caucus with Democrats remain counted with Democrats on the map.

The Class II carry-forward baseline uses the Federal Election Commission's official [2020 federal election results report](https://www.fec.gov/resources/cms-content/documents/federalelections2020.pdf). 2022 and 2024 class results come from the project's checked 120th Congress membership snapshot. The 2026 gains are user-provided assumptions, not independently verified election returns.

---

## VERSION 0.4.3

# Version 0.4.3 — local chapter networks

Each major party now starts with 800 independently stored local chapters, distributed across all 50 states. Every record has a unique ID, party, state, region, establishment year, and active status. The new chapter directory in the State Organizations panel lets players inspect the state distribution and individual chapter records.

Chapter distribution uses each state's 2020-apportioned U.S. House district count as a population proxy. State lean shifts the allocation toward the party with the stronger baseline there. Each party retains at least one chapter in every state, and largest-remainder allocation keeps both networks at exactly 800.

State organization chapter totals now reflect the local records. Election support applies diminishing returns to the larger counts so the expanded network remains on the existing game scale.

“Youth Chapters” is added as a named chapter category only. No youth chapter rules or effects are implemented in this version.

---

## VERSION 0.5

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

---

## VERSION 0.6

# Version 0.6 — Presidential Elections, Electoral College Map & Congressional Coattails

## Game changes

- **Presidential Election Simulation**:
  - Implemented the 2028 presidential election across all 51 jurisdictions (50 states plus the District of Columbia), totaling 538 Electoral Votes (270 needed to win).
  - Main scenario tickets: **Jon Ossoff** for Democrats and **J. D. Vance** for Republicans.
  - Jon Ossoff receives a regional turnout advantage across the South (+4.0 points).
  - J. D. Vance receives a regional turnout advantage across the Midwest (+4.0 points).
  - The presidential contest runs on structural fundamentals (state baseline leans, national environment, and regional ticket strengths) and is independent of party chair spending. The player cannot directly impact or spend funds on the presidential ticket.

- **National Presidential Map**:
  - Added **President** as a top-level tab in the national map view alongside House, Senate, Governorships, and State Legislatures.
  - States are shaded by projected or final Electoral College control: Democratic blue (`#3478c8`) for Jon Ossoff, Republican red (`#c9474e`) for J. D. Vance.
  - Interactive Electoral College banner displaying real-time projected EVs for Ossoff vs. Vance with a visual progress bar and a 270-to-win threshold marker.
  - District of Columbia (3 EV) is rendered and hoverable (`DC · 3 EV · Solid D (D+88%)`).
  - State hover tooltips display electoral votes, candidate margin/lead, competitiveness rating (Solid/Likely/Lean/Tossup), modeled voter totals, and the congressional coattail effect.

- **Congressional Coattail Impact (Battle For America Consistent)**:
  - Adopting Battle For America's downballot model (`RACE_WEIGHT.house = 0.34`), top-of-the-ticket presidential margins carry a **34% coattail effect** into all 435 U.S. House districts.
  - Congressional candidates in states where their presidential nominee runs ahead receive a tangible downballot boost; where the presidential ticket struggles, candidates face top-of-ticket drag.
  - Downballot Senate Class III races inherit a 55% presidential coattail effect, and Gubernatorial contests inherit a 42% coattail effect.
  - Each House district's result record and hover tooltip tracks its exact presidential coattail impact (e.g. `Pres. coattail: D +1.4%`).
  - Fixed district organization lookup to use state ID, allowing local chapter networks and statewide campaign deployments to properly empower congressional districts.

- **Election Night & UI**:
  - General election night summary displays a dedicated Presidential Election Result card detailing Electoral College totals, winner, and the downballot coattail influence.
  - Added a step to the interactive first-game tutorial introducing the presidential map and coattails.
  - Rebuilt Windows executable in `dist/release/` and `dist/`.

---

## VERSION 0.7

# Version 0.7 — The Party Machine: Fullscreen Turn Overhaul, Roster & Leadership Hierarchy

## Overview

Version 0.7 (**Proposal A: "The Party Machine"**) delivers a comprehensive overhaul of the party chair gameplay loop, UI navigation, sitting officeholder roster, leadership hierarchy, electorate trust model, and state-level organizational mechanics across **20 feature and bug-fix items** (3 Large, 5 Medium, 10 Small, and 2 Tiny).

---

## Major Systems (Large)

- **Tri-Partisan Electorate Trust System (`REQ-06`)**:
  - Replaced single-dimensional mood tracking with a three-pillar electorate trust model (`0–100` scale) tracked for the player and rival parties:
    - **Base Supporters Trust (`supporters`)**: Multiplies base voter turnout across all states and reduces third-party defections.
    - **Independents Trust (`independents`)**: Drives swing-voter persuasion and competitive margins in state and congressional district contests.
    - **Opponent Party Members Trust (`opponents`)**: Governs cross-party appeal and **second-choice transfer share in close 3-party / 4-party splits**, reducing tactical voting against your party and winning transfer support when minor parties fade.
  - Trust dynamically responds to candidate `persuadability` and `charisma`, unified platform shifts, regional priorities, incumbent endorsement decisions, and leadership role passives.

- **Sitting Member Roster with Full Stat Ratings (`REQ-09`)**:
  - Populated a complete roster of sitting **U.S. Senators (100)**, **Governors (50)**, and **U.S. House Representatives (435)** across all 50 states, organized by party, state/district, chamber/office, Senate class, party wing/faction, personal `fame` (`1–100`), `happiness` (`0–100`), and full 10-stat ratings (`REQ-08`).
  - Sitting officeholders up for re-election in 2028 (Senate Class III, 2028 Governors, and U.S. House seats) enter their respective primary fields directly as official incumbents (`isIncumbent: true`).

- **Party Leadership Roles & Passive Impact System — 14 Roles (`REQ-11`)**:
  - Added 14 structured leadership roles for each party, automatically populated at game start for all eligible slots:
    - **Category A — Institutional, Legislative & Executive Leaders (Sitting Officeholders Only)**:
      1. **Senate Leader** (`≥ 1` Senate seat; sitting Senator)
      2. **House Leader** (`≥ 1` House seat; sitting Representative)
      3. **Senate Whip** (`≥ 10` Senate seats; sitting Senator)
      4. **House Whip** (`≥ 10` House seats; sitting Representative)
      5. **Speaker of the House** (Party holds House majority/plurality; sitting Representative)
      6. **Chair of the Governors Association** (`≥ 1` Governorship; sitting Governor)
      7. **President** (Party holds the Presidency; provides **5x normal passive impact**)
      8. **Vice President** (Party holds the Presidency)
    - **Category B — Party, Media & Faction Leaders (May Overlap with Category A)**:
      9. **Rhetorical Leader** (Public/media face; passively boosts `independents` and `opponents` trust via `charisma` and `persuadability`)
      10. **Policy Leader** (Internal caucus strategist; modifies happiness and cohesion of **party members and sitting legislators only**, never the general public)
      11. **Faction 1–4 Leaders** (Represent the four party wings and anchor faction confidence)

---

## Core Gameplay & UI Overhauls (Medium)

- **Top-Level Fullscreen Tabbed Navigation (`REQ-01`)**:
  - Replaced the single long scrolling layout with a persistent top-level navigation bar below the six compact dashboard summary cards:
    - **`Actions`**: Guided 4-step fullscreen turn workflow.
    - **`Map`**: Fullscreen National Political Map (President, U.S. House, Senate Classes I/II/III, Governors, and State Legislatures).
    - **`States`**: Fullscreen 50-state directory detailing state chapters, overlapping cultural regions, state legislative control, sitting officeholders, and recruited candidates.
    - **`Forecast`**: Fullscreen National Environment tracker, Tri-Partisan Trust meters, Electoral College & chamber projections, and the 14 Party Leadership Roles roster.

- **Fullscreen 4-Step Guided Turn Workflow (`REQ-02`)**:
  - Structured every organizing turn into a 4-step fullscreen wizard inside the `Actions` tab:
    - **Step 1: Issue Positions (Unified Party Platform)** — Category tabs and `1–10` sliders across all 40 national issues.
    - **Step 2: Party & Regional Priorities** — Select 3 core issue priorities and up to 3 free regional priorities from the 8 overlapping regions (`+$8M` per extra region beyond 3).
    - **Step 3: Primary Endorsements** — Browse active Senate Class III and 2028 Governor primaries state-by-state, inspect 10-stat candidate profiles, and endorse up to 1 candidate per race.
    - **Step 4: Choose This Year's Work** — Execute organizational actions including state chapter expansion, state candidate recruitment, state-targeted policy bills, leadership assignments, convention keynote selection, faction summits, leader tours, and fundraising.
  - Confirming the final pre-primary turn resolves primaries and transitions directly into Election Night resolution.

- **State Senate & Governor Primary Endorsement Flow (`REQ-04`)**:
  - Replaced the legacy 5-endorsement global cap with per-race primary endorsements (`primaryEndorsements[raceKey] = candidateId`) across all active Senate Class III and 2028 Gubernatorial primaries, granting a `+12` to `+18` point primary polling boost scaled by chair standing and candidate `fieldcraft`.

- **Incumbent Endorsement Backlash & Sitting Member Happiness (`REQ-05`)**:
  - Added party-wide **Sitting Member Happiness (`0–100`)**, influencing state legislative bill passage, incumbent re-election turnout, and fundraising yield.
  - **Incumbent Protection Rule**: Endorsing a primary challenger against a sitting incumbent of the player's own party triggers severe caucus backlash (`-18` Sitting Member Happiness, `-8` Base Supporter Trust, and caucus protest logs).

- **10-Stat Candidate & Politician Rating System (`REQ-08`)**:
  - Expanded politician skill ratings into 10 distinct `1–10` attributes: `persuadability`, `turnout`, `debate`, `charisma`, `corruption` (`1` = clean, `10` = high risk), `fundraising`, `fieldcraft`, `experience`, `mediaSavvy`, and `regionalStrength`, alongside a backward-compatible composite `quality` score (`1–10`).

---

## Mechanics, Geography & Data Refinements (Small & Tiny)

- **Priority Selection Cap & Budget Override (`REQ-03`)**:
  - Chairs select 3 core issue priorities and up to 3 overlapping regional priorities for free, with the option to spend **`$8M` of National Committee budget per additional region** beyond the 3-region cap.
- **Politician Fame Metric (`1–100`) & Role Ambition (`REQ-10`)**:
  - Added standalone `fame` (`1–100`) scaled by office tier, keynote speeches, and national campaigns. Politicians with `fame >= 75` expect a major leadership role (`REQ-11`) and lose happiness if passed over.
- **Senate Class Maps Fix & 2026 Incumbent Roster Audit (`REQ-13` / `BUG-01`)**:
  - Fixed Senate Class I, Class II, and Class III map mode buttons and state fills so all three Senate classes render cleanly with accurate incumbent tooltips.
  - Audited 2026 Senate results so **Alaska (`AK`, Class II)** is held by Democrat **Mary Peltola** and **Mississippi (`MS`, Class II)** is held by Democrat **Scott Colom**, and independent senators caucusing with Democrats (VT, ME) display with the Democratic caucus.
- **State-Targeted Policy Bills (`REQ-14`)**:
  - Introducing a policy bill now targets a specific state where the party controls at least one state legislative chamber, delivering a large (`+4.5` point) state support and alignment boost upon passage.
- **State-by-State Party Chapters (`REQ-15`)**:
  - Refactored chapter expansion, leader tours, and rival chapter growth to operate across all 50 individual states rather than the 4 legacy Census macro-regions.
- **8 Expanded & Overlapping Political Regions (`REQ-16`)**:
  - Added multi-region state membership across 8 cultural/political regions: `Prairie States`, `Pacific Northwest`, `Deep South`, `Appalachia`, `New England`, `Rust Belt`, `Great Lakes States`, and `The Rockies`.
- **Defer Random Events to Future Campaign Phase (`REQ-17`)**:
  - Removed mandatory random event popups from the organizing turn sequence and streamlined post-primary election resolution while preserving the `EVENTS` dataset in code for future campaign phases (`DEF-05`).
- **Dynamic "Major Party" Threshold (`REQ-20`)**:
  - Defined Major Party status dynamically as earning **≥ 20% of the national popular vote in the previous presidential election**.
- **Starting Party Budgets (`REQ-21`)**:
  - Set starting National Committee treasuries to **`$150M`** for Major Parties (Democratic, Republican), **`$10M`** for Minor Parties (Libertarian, Green), and **`$25M`** for Custom Parties.
- **State Recruit Average Quality (`REQ-25`)**:
  - Tuned the state candidate recruitment generator so recruited candidates average a **quality rating of `7`** on the `1–10` scale.
- **National Convention Keynote Speaker (`REQ-32`)**:
  - Added a once-per-cycle **Keynote Speaker** selection granting the chosen politician **`+25 Fame`**, `+8` faction confidence to their wing, and `+2.0` turnout across their home overlapping region(s).
- **Unified Party Platform & Issue Positions (`REQ-37`)**:
  - Merged the legacy 4-axis platform shift action into the 40 issue position sliders so adjusting issue stances directly updates the party platform and recalculates the 4 ideological summary axes.
- **Save Migration & Windows Release Build**:
  - Updated `normalizeGame()` / `migrateSave()` in `engine.js` to seamlessly hydrate v0.5 and v0.6 saves with v0.7 state fields (`trust`, `sittingMemberHappiness`, `sittingMembers`, `leadershipRoles`, `primaryEndorsements`, overlapping regional priorities, and 50-state chapter maps).
  - Rebuilt `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.8

# Version 0.8 — The 15-Week Campaign & Pundit Forecast Update

## Overview

Version 0.8 (**Proposal B: "The 15-Week Campaign & Pundit Forecast Update"**) transforms *Coalition Builder: Party Chair* by introducing a dedicated 15-week general election campaign phase between the primary resolution and Election Night, replacing raw numerical pre-election race polling with satirical pundit forecasting engines, adding national surrogate deployments, dynamic candidate budget triage, an October Surprise crisis decision, landscape political maps, unified election history, and 5 grand-strategy campaign operations across **16 shipped features** (2 Large, 5 Medium, 8 Small, and 1 Tiny).

---

## Major Systems (Large)

- **15-Week Grand-Strategy Campaign Phase (`REQ-39`)**:
  - Following the conclusion of 20 organizing turns and primary resolution, the game transitions seamlessly into a dedicated 15-week general election campaign phase (`game.phase = 'general-campaign'`, `game.campaign.active = true`).
  - The `Actions` tab transforms into a fullscreen Campaign Command Dashboard showing `Week X of 15`, national treasury balance, weekly action allowance (`3 actions/week`), Sitting Member Happiness, and the national wave momentum ticker.
  - Chairs triage campaign resources across Presidential, Senate Class III, Gubernatorial, and House races over 15 dynamic weeks, resolving candidate funding requests, executing grand-strategy operations, deploying surrogates, and navigating late-breaking news cycles before advancing to General Election Night.

- **Dynamic Candidate Campaign Budgets & Unhappy Nominee Triage (`REQ-19`)**:
  - Implemented an individual general election candidate budget tracking system (`game.candidateFunding[raceKey]`) across all 480 congressional and gubernatorial contests:
    - **Baseline Commitments**: `$1.0M` for House nominees and `$5.0M` for Senate nominees for incumbent major parties (50% for non-incumbents).
    - **Funding Reallocation & Triage**: Chairs may pull funds from safe races into battlegrounds, or inject `+$2M` increments to boost candidate competitiveness.
    - **Margin-Sensitive Upset Math**: Pulling funds or refusing requests in safe races (`lead ≥ 10 pts`) causes minimal fuss; pulling from close or trailing contests infuriates candidates, inflicting severe Sitting Member Happiness decay (`-4` to `-8` points) and nominee morale penalties.
    - **Unhappy Unendorsed Winners**: Primary winners who won without the chair's endorsement start the general election unhappy (`-1.2%` general election penalty) until pacified through cajoling sessions or funding allocations.

---

## Core Gameplay & Forecasting Overhauls (Medium)

- **Satirical Forecasters (Sallow & Cook Parodies) as Sole Pre-Election Ratings (`REQ-12`)**:
  - **Zero Raw Polls Invariant (`DEF-06`)**: Raw numerical pre-election race percentages are strictly suppressed across all pre-election screens; race outlooks are projected exclusively through two satirical forecasting models:
    - **Sallow's Magic 8-Ball** (*Center for Politics parody*): Generates qualitative outlooks using mystic, high-confidence ratings.
    - **The Chef Political Report** (*Cook Political Report parody*): Delivers cautious, gourmet tactical ratings with slight house-style editorial variance.
  - Races are categorized into `Solid D`, `Likely D`, `Lean D`, `Toss-Up`, `Lean R`, `Likely R`, and `Solid R`, complete with Electoral College EV tallies, Senate/Gubernatorial counts, and a side-by-side battleground consensus comparison table.

- **Wave Election / National Momentum Pendulum (`REQ-33`)**:
  - Introduced a persistent national momentum meter (`game.campaign.waveMomentum`, `-10.0` GOP Wave to `+10.0` Dem Wave) calculated from national public mood, tri-partisan trust shifts, chair national standing, and surrogate media momentum.
  - Displayed prominently in the `Forecast` tab and Campaign Dashboard as a visual tug-of-war spectrum with dynamic direction indicators.
  - On General Election Night, late undecided voters in all `Toss-Up` races break cohesively in the direction of the national wave.

- **Major Menu: Weekly National Leader Deployment Map (`REQ-40`)**:
  - A major deployment menu featuring an interactive 50-state SVG map shaded by partisan lean, with pulsing gold outlines (`.target-state-highlight`) highlighting **Recommended Target States** (`game.campaign.recommendedStates`).
  - Chairs deploy their top active national leaders (Rhetorical Leader, Senate Leader, House Leader, Party Chair, etc.) to critical states each week.
  - Each deployed surrogate provides a flat **`+1.0` polling boost to all races in the assigned state** (Presidential, Senate, Governor, and House districts).

- **High-Impact "October Surprise" Crisis Decisions (`REQ-41`)**:
  - In **Week 13** of the campaign, an October Surprise breaking news crisis triggers from a catalog of 20 high-stakes historical and modern campaign crises (`OCTOBER_SURPRISES`).
  - Renders a prominent breaking news banner displaying crisis details and 2–3 tactical decision cards with divergent trade-offs across National Committee treasury, Tri-Partisan Trust, Sitting Member Happiness, and national Wave Momentum.

- **Post-Convention General Election Pivot (`REQ-43`)**:
  - Smoothly bridges the national organizing phase to general election readiness, locking primary results, converting nominated contenders into official party standard-bearers, and initializing battleground targets.

---

## Landscape Maps & Grand-Strategy Operations (Small & Tiny)

- **Political Landscape Tab: State-by-State Lean Gradient Map (`REQ-22`)**:
  - Added a selectable sub-view in the `Map` tab rendering a smooth, continuous partisan lean color gradient across all 50 states (from Deep Blue `D+20+` through neutral slate/purple Toss-Up to Deep Red `R+20+`) paired with a gradient legend bar.

- **Political Landscape Tab: Trifectas & Mixed-Control Map (`REQ-23`)**:
  - Added a dedicated government control sub-view distinctly coloring and labeling Democratic Trifectas (`#1d5fb4`), Republican Trifectas (`#b42d34`), Divided combinations (Dem Gov + GOP Leg, GOP Gov + Dem Leg, Dem Gov + Split Leg, GOP Gov + Split Leg), and Nonpartisan Nebraska, while preserving whole-state Purple (`#8654a4`) for split legislatures per `ART_STYLE.md`.

- **Grand-Strategy Action: Opposition Research Blitz & Self-Vetting (`REQ-26`)**:
  - `Self-Vet & Rapid Response ($2M / 1 action)`: Vets a nominated candidate and establishes rapid-response defense, neutralizing corruption vulnerabilities before rival attacks.
  - `Opposition Research Blitz ($3M / 1 action)`: Drops a damaging oppo dossier in a target battleground state, eroding opponent independent credibility (`+1.8` state margin).

- **Grand-Strategy Action: Caucus Retreat & Candidate Cajoling Session (`REQ-28`)**:
  - Spends `$3M` to convene congressional nominees and sitting members in retreat, restoring `+10` Sitting Member Happiness and removing unhappy penalties from all underfunded/unendorsed nominees nationwide.

- **Grand-Strategy Action: National Surrogate Media Blitz (`REQ-29`)**:
  - Spends `$4M` to deploy the party's Rhetorical Leader across Sunday talk shows and digital podcasts, gaining `+2.5` Independents Trust, `+1.5` Opponents Trust, and `+4 Fame`.

- **Grand-Strategy Action: Down-Ballot Joint Victory Fund (`REQ-31`)**:
  - Free financially (`0 actions` / `$0M`); pairs a high-charisma surrogate with state chapters to raise `+$8M` to `+$18M` directly into the National Committee treasury.

- **Grand-Strategy Action: Qualified State Ballot Measures (`REQ-34`)**:
  - In states where the party lacks legislative control, chairs spend `$4M` to qualify citizen ballot initiatives (voting rights, minimum wage, reproductive freedom), delivering a `+3.0` demographic turnout boost to down-ballot races in that state.

- **Real & Player-Generated Unified Election History Timeline (`REQ-38`)**:
  - Renders a unified election history view in the `Forecast` tab and post-election screens:
    - Player-generated cycles (`2028+`) tagged with `.v08-badge-player` detailing Presidential EVs, House seats, Senate seats, and strategic campaign narratives.
    - Chronologically preceded by certified historical U.S. election baselines from 2026 back to 2008 (`PartyChairData.HISTORICAL_ELECTIONS`) tagged with `.v08-badge-baseline` (2026) and `.v08-badge-historical` (2008–2024).

- **2026 Midterm Baseline Calibration (`REQ-42`)**:
  - Calibrated the Senate Class II 2026 baseline entering 2028: **Alaska (`AK`)**, **Mississippi (`MS`)**, **North Carolina (`NC`)**, **Kansas (`KS`)**, **Texas (`TX`)**, **Maine (`ME`)**, **Iowa (`IA`)**, and **South Carolina (`SC`)** are held by Democrats, establishing a 56–44 Democratic Senate majority into the 120th Congress.

- **Save Migration & Executable Build Packaging**:
  - Updated `normalizeGame()` / `migrateSave()` in `engine.js` (Schema 5) to cleanly hydrate legacy v0.5, v0.6, and v0.7 saves with default `campaign` state, candidate funding baselines, satirical forecasters, wave momentum, and election history.
  - Rebuilt the standalone Windows release executable using `build.ps1` to produce `dist/release/Coalition Builder - Party Chair.exe` (403,456 bytes) and `dist/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.9

# Version 0.9 — The Complete Political Realignment & Coalition Grand Strategy Update

## Overview

Version 0.9 (**Master Build: "The Complete Political Realignment & Coalition Grand Strategy Update"**) unifies **18 pending and runtime backlog systems** (`REQ-18`, `REQ-24`, `REQ-27`, `REQ-30`, `REQ-35`, `REQ-36`, `REQ-44`, `REQ-45`, `REQ-46`, `REQ-47`, `REQ-49`, `REQ-50`, `REQ-51`, `REQ-52`, `REQ-53`, `REQ-54`, `REQ-55`, `REQ-56`) into *Coalition Builder: Party Chair*, introducing issue-tied Super PACs and ad demands, regional faction splinters and party switching, distinct Independent caucus governance, Constitution & Socialist minor parties with symmetrical counter-growth rivals, the split-color 100-seat Universal Senate Map, Census CVAP demographics, Party Leader Net Approval, Unified Party Approval, a 20-point National Environment scale, and inter-cycle electorate realignment.

---

## Major Systems (Large)

- **Super PACs, Issue Demands & Pet-Issue Ad Spending (`REQ-18`)**:
  - Added 6–8 independent issue-tied Super PACs (`Energy Independence PAC`, `Workers First PAC`, `American Freedom Fund`, `Green Future Action`, `Constitutional Defense Fund`, `Healthcare Access Project`, and coalition funds) tracked completely separately from the party's National Committee treasury.
  - Super PACs issue strategic demands (`respond-pac-demand`) asking the chair to align platform stances or prioritize their issue; accommodating or defying demands adjusts their available ad funding pool.
  - During the 15-week general campaign, chairs allocate Super PAC ad buys (`allocate-pac-ads`) exclusively into target Senate, Gubernatorial, or House battlegrounds to boost competitiveness on each PAC's pet issue without draining party funds.

- **Party Splits & Regional Splinter Factions (`REQ-30`)**:
  - When a party faction suffers prolonged low satisfaction (`< 35`) under a high-Fame faction leader, the wing threatens to bolt (`factionBoltThreats`), forcing the chair to appease the faction (`appease-faction-threat`) or risk turnout cratering and regional spoiler tickets (`activeSplinters`) in the general election.

---

## Coalition, Parties & Simulation Overhauls (Medium)

- **Demographic Voter Model, Editable Group Config & Swingier White Voters (`REQ-24`)**:
  - Added `demographics-0.9.js` (`window.PartyChairData.DEMOGRAPHIC_CONFIG`) exposing editable national CVAP breakdowns (White 65%, Hispanic/Latino 14%, Black 13%, Asian American 5%, Multiracial 2%, Native American 1%), baseline party affiliations, and issue priorities.
  - Configured White voters with elevated swing elasticity (`1.45x`) in state elasticity and trust response calculations across states and congressional districts.

- **Party Switching / "Crossing the Aisle" (`REQ-35`)**:
  - Sitting incumbents in unfavorable or swing states whose happiness falls critically low (especially after baseline funding pulls or primary challenges) risk switching parties or declaring Independent status.
  - High **Opponent Party Member Trust** enables chairs to court disaffected moderate rival incumbents (`court-rival-moderate`) across the aisle.

- **Party-Specific Ideological & Rhetorical Factions (`REQ-36`)**:
  - Replaced generic shared factions with **5 distinct Democratic factions** (`Progressive Activists`, `Establishment Liberals`, `Labor & Industrial Populists`, `Community & Faith Pillar`, `Frontier & Suburban Moderates`) and **5 distinct Republican factions** (`Nationalist Populists`, `Faith & Flag Conservatives`, `Market & Country-Club Conservatives`, `Liberty & Western Mavericks`, `Heartland Institutionalists`), each with unique regional anchors, ideological pulls, and rhetorical style.
  - Includes a realignment pathway where alienated suburban/Western moderates can swing across coalitions if populist wings fracture or bolt.

- **Independent Category, Caucus Allegiance & Moderate Persuasion (`REQ-44`)**:
  - Separated **Independent** (`party: 'independent'`, aquamarine/gold badge) from Democratic party rosters across maps, tooltips, and sitting member panels, while independently tracking **caucus allegiance** (`people`, `heritage`, or `unaligned`) for legislative chamber control (e.g., Bernie Sanders in VT and Angus King in ME sitting as Independents caucusing Democratic).
  - Added the `persuade-independent-caucus` action using Independents Trust, platform proximity, and committee/budget concessions to sway Independent officeholders.

- **Unified Party Approval Tracker across All Parties (`REQ-51`)**:
  - Computes a single population-weighted **Party Approval** score (`computeUnifiedPartyApproval`) visible across all active parties (Democratic, Republican, Libertarian, Green, Constitution, Socialist, and Custom), dynamically driven by **40% National Generic Ballot**, **20% Presidential Approval**, and **40% Party Leader Popularity**.

- **National Environment 20-Point Scale, Wave/Landslide Tiers & Inaction Drift (`REQ-52`)**:
  - Expanded the national environment scale from `-20` (`R+20 (Landslide)`) to `+20` (`D+20 (Landslide)`), designating `±10` as a **Wave** (`D+10` / `R+10`) and `±20` as a **Landslide** (`D+20` / `R+20`).
  - Calibrated the 2028 opening environment baseline to **`D+9`**, naturally drifting toward **`D+14`** over the 20 organizing turns if left unaddressed.

- **Inter-Cycle Electorate Realignment — The 1/4th Rule (`REQ-56`)**:
  - Enforces continuous multi-cycle electorate accounting across 155.00M represented voters (`realignVotingBlocksBetweenElections`): voting blocks stay locked during active campaigning and shift **only between elections** by **1/4th of the difference** between a party's actual popular vote share and its expected share of non-independent voters.
  - Displays detailed post-election accounting and splits third-party electorate rows in the Forecast UI into **Libertarian**, **Green**, and **Other Minor Parties**.

---

## Maps, Parties, Leadership & UI Enhancements (Small & Tiny)

- **State Voter Registration & Demographic Outreach (`REQ-27`)**:
  - Added the `voter-registration-drive` leadership action targeting a selected state and demographic cohort (or unaffiliated Independents) to convert non-aligned residents into party members and raise Base Supporter Trust.

- **Playable / AI Constitution & Socialist Parties (`REQ-45`, `REQ-46`)**:
  - Added the **Constitution Party** (`#a84214`, `$10M` minor-party budget, `<0.2%` baseline, appeal to Nationalist Populist and Faith & Flag voters) and the **Socialist Party** (`#d62828`, `$10M` minor-party budget, `<0.2%` baseline, appeal to Progressive Activist and Labor Populist voters) to `PARTY_ARCHETYPES`.

- **Minor-Party Ideological Rivals & Counter-Growth (`REQ-47`)**:
  - Paired ideological counter-rivals (**Green ↔ Libertarian** and **Socialist ↔ Constitution**) so grassroots growth by one minor party symmetrically stimulates counter-mobilization in its opposite-pole counterpart.

- **Universal Senate Map Default Subtab (`REQ-49`)**:
  - Made the **Universal U.S. Senate (All 100 Seats)** view the default subtab in `Map -> U.S. Senate` (ahead of Class I, Class II, and Class III), rendering split-color 50/50 diagonal fills for divided delegations and Independent aquamarine stripes, paired with the live **56 D (54 D + 2 I) vs. 44 R + VP Tiebreaker** scoreboard.

- **Leader Popularity, Fame & Net Approval Metric (`REQ-50`)**:
  - Decoupled leader **Popularity** (favorability among voters with an opinion) from **Fame** (0–100% name recognition) and placed **Net Approval** (`(2 × Popularity) - Fame`) all the way to the left of Popularity and Fame badges across leader and candidate cards.

- **Incumbent Governing Fatigue, Presidential Year Relief & Rally Spike (`REQ-53`)**:
  - Applies ongoing governing fatigue pressure against whichever party holds the White House, softened during presidential election years alongside a natural **3%–7% presidential approval rally spike**.

- **Custom Party Starting Leader Archetypes (`REQ-54`)**:
  - Custom party setup allows naming a starting leader and choosing from 4 distinct archetypes (**Former Politician**, **Celebrity**, **Union Organizer**, **Business Leader**) with distinct initial Fame, treasury, depth, and coalition trade-offs.

- **Compact 'Open State Chapter' Button (`REQ-55`)**:
  - Added `.v09-btn-chapter-75` in Step 4 machine operations to scale the 'Open Chapter' control to 75% display size for cleaner alignment beside state dropdown controls.

---

## Integration, Save Migration & Packaging

- **Script Load Order (`index.html`)**: Wired `demographics-0.9.js` ahead of `political-trends-system.js`, `engine.js`, and `app.js`.
- **Save Migration (`partyChairGame.save.v9`, Schema 5)**: Updated `normalizeGame()` / `migrateSave()` and `loadGame()` in `engine.js` to migrate v0.8 (`partyChairGame.save.v8`) through v0.1/legacy saves cleanly—backfilling demographic baselines, Super PAC catalogs, 100-seat Universal Senate Independents (`Sanders`/`King`), Constitution/Socialist rivals, Unified Party Approvals, and v0.8 campaign/forecaster structures without crashes.
- **Automated Integration Verification (`obj/verify-v09.cjs`)**: Verified zero syntax errors across all 11 scripts, `56 D (54 D + 2 I) vs 44 R + VP Tiebreaker` Universal Senate default map rendering, Super PAC demands/ad allocation, Independent caucus persuasion, faction bolting/party switching, Net Approval / Unified Party Approval / 20-pt National Environment math, continuous 1/4th realignment across 2028 -> 2030 transitions, 75% chapter button, split minor-party electorate metrics, and legacy save migration.
- **Windows Release Packaging (`build.ps1`)**: Compiled standalone Windows executables via `./build.ps1` (`dist/release/Coalition Builder - Party Chair.exe`, 471,040 bytes; and `dist/Coalition Builder - Party Chair.exe`, 471,040 bytes), bundling all 11 v0.9 JS scripts, `index.html`, `styles.css`, and `assets/` resources. Verified resource manifest and launch extraction cleanly.

---

## VERSION 0.10

# Version 0.10 — The 10 Platform Pillars & Continuous Political Evolution Update

## Overview

Version 0.10 (**Master Build: "The 10 Platform Pillars & Continuous Political Evolution Update"**) implements the complete **10-Pillars Platform Architecture** specified in `PLATFORM_10_PILLARS_SPECIFICATION.md`, incorporating real-time descriptive stance text across all 41 national issues, strict voter-impact decoupling of internal party machinery (Pillars 7 & 8), continuous multi-cycle political evolution with the 1/4th inter-cycle realignment rule, atmospheric policy bill vibes, and refined political forecasters.

---

## 1. 10 Platform Pillars System & Real-Time Stance Descriptions

- **Full 10-Pillar Platform Hierarchy (`PLATFORM_10_PILLARS_SPECIFICATION.md`)**:
  - Organized all 41 national issues under 10 cohesive thematic platform pillars:
    1. **Tax & Economic Policy** (Issues: Taxes & Spending, Corporate Tax Rate, Wealth Tax, Cost of Living, Business Regulation, Monetary Policy)
    2. **Foreign Policy** (Issues: Foreign Policy & Alliances, Defense Spending, Iran Policy, Israel-Palestine)
    3. **Climate Policy** (Issues: Climate Action & Emissions, Energy Mix, Green Standards)
    4. **Religious Policy** (Issues: Religious Liberty, Church-State Separation in Schools, Faith-Based Funding)
    5. **Social Services Policy** (Issues: Medicare & Social Security, Health Coverage, SNAP & Food Aid, Prescription Drug Prices, Minimum Wage)
    6. **Social Justice** (Issues: Racial Equity, Voting Rules & Access, LGBTQ+ Rights, Criminal Justice Reform, Abortion, Immigration Visas, Border Enforcement, NIMBYism & Housing)
    7. **Party Structure** (Issues: State vs Federal Party Power, Primary Rules & Ballots, Campaign Finance Reform) — *Internal Party Machinery (Does Not Impact Voters)*
    8. **Party Ideology** (Issues: Platform Enforcement & Discipline, Ideological Purity vs Big-Tent, Candidate Autonomy) — *Internal Party Machinery (Does Not Impact Voters)*
    9. **Democracy Policy** (Issues: Checks & Balances, Government Corruption & Ethics, Election Certification & Norms)
    10. **Establishment Stance** (Issues: Institutional Trust, Political Insiders vs Outsiders, Populist Revolt)

- **Mandatory Decoupling of Pillars 7 and 8 from Voters**:
  - **Pillar 7 (Party Structure)** and **Pillar 8 (Party Ideology)** govern purely internal party machinery, candidate autonomy, and discipline.
  - Changes to issues under Pillars 7 and 8 strictly **do not** alter summary ideological axes (`recalculateWeightedPlatformAxes`), do not adjust public voter trust, and do not shift voter preferences.
  - Tagged visibly in the Platform Profile dashboard with a distinct badge: `Internal Party Machinery (Does Not Impact Voters)`.

- **Expanded Issues & Specific Party Stances**:
  - Added new issues with explicit 1–10 positions across parties:
    - **Abortion**: Greens: 2, Democrats: 4, Republicans: 8, Libertarians: 5.
    - **Immigration Visas**: Greens: 1 (Stance 1: "No borders, at all"), Democrats: 4, Republicans: 9, Libertarians: 2.
    - **Border Enforcement**: Greens: 1, Democrats: 5, Republicans: 8, Libertarians: 1.
    - **Affordability / Cost of Living**: Pillar 1 (Taxes & Economy). Stances: Green: 1, Dem: 3, GOP: 8, Lib: 10.
    - **Minimum Wage**: Pillar 5 (Social Services). Stances: Green: 1, Dem: 3, GOP: 8, Lib: 10.
    - **Business Regulation & Antitrust**: Pillar 1 (Taxes & Economy). Stances: Green: 1, Dem: 3, GOP: 8, Lib: 10.
    - **Monetary Policy & Federal Reserve**: Pillar 1 (Taxes & Economy). Stances: Green: 2, Dem: 4, GOP: 7, Lib: 10.
    - **NIMBYism & Housing Abundance**: Pillar 6 (Social Justice). Stances: Green: 3, Dem: 4, GOP: 7, Lib: 1.
  - Implemented the **Pillar Fallback Rule**: If an individual issue lacks an explicit party position, it automatically inherits the platform pillar's baseline default.

- **Real-Time 1–10 Descriptive Stance Text**:
  - Each of the 41 issues possesses full 1–10 descriptive sentences in `window.PartyChairData.STANCE_DESCRIPTIONS`.
  - When the player adjusts any slider in Step 1, the descriptive prose immediately updates live beneath the slider (`#stance-desc-${issue.id}`), letting the player read exactly what policy position is being adopted at each number without requiring full tab reload.

- **10-Pillars Platform Dashboard**:
  - Replaced the legacy 4-axis list in `platformMarkup()` with an all-inclusive 10-pillar summary card.
  - Shows progress track, numerical score (`1.0 – 10.0`), low-end descriptor, high-end descriptor, and internal machinery tags for Pillars 7 & 8.

---

## 2. Continuous Multi-Cycle Political Evolution & The 1/4th Rule

- **Continuous Multi-Cycle Evolution Philosophy (`REQ-56`)**:
  - Added prominent game style documentation in `GAME_STYLE_GUIDE.md`: *Coalition Builder: Party Chair* is designed as a continuous simulation across multiple presidential, midterm, and off-year election cycles with evolving parties, voters, maps, and politics.
  - **Inter-Cycle Electorate Realignment**:
    - Parties maintain existing voting blocks between election cycles.
    - A party's expected popular vote is computed based on its share of **total non-independent voters** ($V_p / N_{\text{non-ind}} \times 100\%$).
    - Overperforming parties gain voters; underperforming parties lose voters.
    - The shift moves by **1/4th of the difference** as a percentage of the total electorate:
      $$\Delta \text{Share}_p = \frac{\text{Actual}_p - \text{Expected}_p}{4}$$
    - **Strict Invariant**: Parties DO NOT gain or lose electorate baseline share during campaigns or election week; realignment occurs **only between election cycles**.
  - Detailed post-election breakdown is displayed on the post-election screen (`realignmentSummaryMarkup()`).

---

## 3. UI, Atmospheric Vibes & Bug Fixes

- **Satirical Forecaster Screen Polish**:
  - Removed forward developer labels and the green button from the Pundit Forecaster menu.
  - Added "Obscures Some Information & Atmospheric Vibes" rule to `GAME_STYLE_GUIDE.md`.
- **Atmospheric Policy Bill Vibes**:
  - Removed raw `+4.5` math labels from player-facing UI and bill previews.
  - Implemented dynamic bill outcome: between `-3.0` and `+5.0` state support based on local issue proximity (diff 0 = 80% success, diff 9 = 0% success), presenting the player with narrative political vibes of risk and reward rather than overt probability formulas.
- **Electorate Affiliation Breakdown**:
  - Third-party voters are split into distinct rows for **Libertarian**, **Green**, and **Other Minor Parties** in the Electorate Affiliation card.
- **RCV Transfer Weight Copy**:
  - Updated RCV line to: `RCV / 3-Party Transfer Weight (If policy is enacted): (Projected percentage of RCV votes)`.
- **Hero Banner Copy**:
  - Updated headline and subtitle:
    > **Politics is a long game. Make sure your party wins it.**
    > *Lead an American political party through the years, choosing their platform, policies, and candidates. Starting with the 2028 election, you will take charge of a party of your choice (Or make your own!), and can grow it to glory - or bring it to ruin.*
- **Universal Senate Map**:
  - Universal 100-Seat Senate map remains the default subtab, highlighting split delegations and Independent aquamarine green (`#1abc9c`) for Angus King and Bernie Sanders.
- **Save Migration & Hydration**:
  - Updated save key to `partyChairGame.save.v10` with backward compatibility for `v9`, `v8`, `v7`, etc.

---

## 4. Verification & Packaging

- **Automated Test Suite**: Full Node test suite verified zero script compilation errors, complete 41-issue stance descriptions, 10-pillar structure, pillar 7 & 8 voter decoupling, and inter-cycle realignment calculation.
- **Executable Binary**: Compiled via `build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` (472,064 bytes).

---

## VERSION 0.11

# Version 0.11 — The Decennial Redistricting, 10-Slot Priorities & Dynamic Electoral Maps Update

## Overview

Version 0.11 (**Master Build: "The Decennial Redistricting, 10-Slot Priorities & Dynamic Electoral Maps Update"**) represents a major milestone in *Coalition Builder: Party Chair*. This release unites Huntington-Hill decennial reapportionment post-2030, dynamic assembly of congressional district maps, procedural geometry for up to 200 districts per megastate, narrative text-first platform stance displays, a dedicated 5th "Party Information" tab, the expanded 10-slot priority framework with 25 Overall Priority Quests, and the player-requested 1–10 issue customization in the "Create a Custom Party" setup screen.

---

## 1. Huntington-Hill Decennial Reapportionment & Dynamic Maps (`REQ-62`, `REQ-58`, `REQ-59`)

- **Huntington-Hill Method of Equal Proportions**:
  - Implemented the official U.S. statutory Huntington-Hill reapportionment algorithm in `scenario-2028.js` and `engine.js` (`apportionHuntingtonHill`).
  - Decennial redistricting automatically triggers post-election in 2030 based on decennial population forecasts (`getDecennialStatePopulations(2030)`).
  - Guarantees every state receives at least 1 seat, accurately allocating all 435 U.S. House seats based on relative population shifts (e.g., Sunbelt gains in TX/FL, apportionment shifts in CA/NY/IL/OH).
- **Dynamic National House Map Assembly (`assembleNationalHouseMap`)**:
  - Automatically loads and renders the appropriate national map:
    - **2028 Cycle**: Renders the baseline 2028 map (`base map`).
    - **2030 Cycle & Beyond**: Assembles the reapportioned `2030 map`, persisting state seat totals, electoral votes, and congressional district delegations directly into `game.houseMaps['2030 map']`.
- **Modular District Map Slices & Procedural Geometry**:
  - Precalculated SVG district slices stored in `assets/maps/district-slices.json` for all 50 states + DC.
  - Robust procedural geometry engine (`generateStateDistrictSlices`) provides clean, non-overlapping geometric SVG paths supporting up to **200 districts** for megastates (CA, TX, FL, NY) and up to **50 districts** for all other states.

---

## 2. Text-First Platform Stance Displays (`REQ-60`)

- **Narrative Stance Callouts in Step 1**:
  - Overhauled the Step 1 platform customization screen in `app.js` to prioritize text-first clarity over abstract numbers.
  - Every national issue features a narrative stance callout (`v09-stance-callout`) displaying descriptive prose directly from `window.PartyChairData.STANCE_DESCRIPTIONS`.
  - When adjusting any 1–10 slider, live DOM event listeners instantly update the stance description without requiring page or tab reloads.

---

## 3. Dedicated 5th "Party Information" Tab (`REQ-57`)

- **Centralized Party & Electorate Intelligence**:
  - Introduced a permanent 5th main navigation tab: **Party Information** (`party-info`).
  - Migrated key strategic indicators into a clean, dedicated dashboard:
    1. **Tri-Partisan Electorate Trust System**: Public Trust, Coalition Partner Trust, and Ideological Authenticity scores.
    2. **Unified Party Approval Tracker**: Net approval ratings across Major, Minor, and Emerging parties.
    3. **Faction Confidence & Loyalty**: Internal faction stability, defection/bolt threat indicators, and leadership standing.
    4. **Electorate Affiliation Model**: Real-time demographic voting bloc affiliations and partisan elasticity metrics.
    5. **Atmospheric Forecasters & National Environment**: Sabato's Crystal Ball, Cook Political Report, and national partisan climate trends.

---

## 4. 10-Slot Priority Framework & 25 Overall Priority Quests (`REQ-61`)

- **10-Slot Priority Framework**:
  - Expanded party focus capacity to 10 slots: 3 Core National Issues plus up to 7 Regional Focus slots.
  - Allows chairs to tailor deep regional strategies across the Rust Belt, Sun Belt, Pacific Rim, Black Belt, Great Plains, and Interior West.
- **25 Overall Priority Quests**:
  - Implemented 25 strategic overarching party quests in `engine.js` (`OVERALL_PRIORITY_QUESTS`):
    - *Electoral Breakthroughs*: Sunbelt Surge, Rust Belt Revival, Coastal Fortress, Great Plains Foothold, Mountain West Breakthrough.
    - *Congressional Milestones*: House Majority, Senate Majority, Supermajority Push, Filibuster Defense.
    - *Coalition & Ideology*: Ideological Purity, Big Tent Harmony, Youth Surge, Labor Alliance, Suburban Inroads.
    - *Party Machinery*: 50-State Strategy, Grassroots Chapter Expansion, Super PAC Resistance, War Chest Mastery.
  - **Scaled Member Happiness Rewards**:
    - Completed quests award **+5 to +20 Member Happiness** upon election resolution, directly reinforcing incumbent retention, caucus unity, and defection prevention.

---

## 5. Custom Party Setup: 1–10 Issue Position Customization

- **Platform Customization Overhaul**:
  - Replaced legacy 4 ideological axis sliders on the "Create a Custom Party" setup screen with full individual issue configuration across all national issues in `window.PartyChairData.VERSION_021_ISSUES`.
  - Each issue features a 1–10 scale slider with real-time descriptive prose from `STANCE_DESCRIPTIONS`.
  - Filterable by issue categories (Economy & Affordability, Foreign Policy & Defense, Climate & Energy, Social Services, Social Justice, Democracy & Governance).
  - Dynamically calculates summary ideological axes via `recalculateWeightedPlatformAxes` while properly preserving player-selected issue stances in `game.issuePositions`.

---

## 6. Architecture, Save Migration & Release Packaging

- **Save Schema 7 (`partyChairGame.save.v11`)**:
  - Incremented save schema to version 7 and primary save key to `partyChairGame.save.v11`.
  - Full multi-version backward compatibility chain supporting saves from v10, v9, v8, v7, down to v1.
- **Executable Binary**:
  - Standalone release binary compiled via `./build.ps1`:
    - Path: `dist/release/Coalition Builder - Party Chair.exe`
    - Native WebView2 wrapper embedding all game assets, styles, scripts, and precomputed district maps.
- **Production Deployment**:
  - Copied to user's primary application folder: `C:\Users\rober\OneDrive\Documents\Party Chair Game\`.

---

## VERSION 0.12

# Version 0.12 — The Multi-Cycle Federalism & Coalition Autopsies Update

**Build Target:** Version 0.12  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Multi-Cycle Continuous Realignment, State Legislative Bell-Curve Engine, Post-Election Autopsies, Atmospheric Dispatches & Autonomous Custom Parties*  
**Release Date:** November 13, 2026  
**Status:** Integrated, Verified, and Released  

---

## Executive Summary

Version 0.12 is a monumental release for *Coalition Builder: Party Chair*, transforming the game from a single-cycle campaign sandbox into a multi-decade grand political simulation. It introduces continuous election advancement across constitutional Senate class rotations, alternating Presidential and Midterm environments, a mathematically rigorous 100-seat bell-curve state legislative engine, post-election coalition autopsies with competing faction blame games, state party federalism with friction and receivership administration, a 13-tier blended consensus forecaster gradient, and fully autonomous custom party creation with real-world incumbent seat claiming.

Every system adheres strictly to the **155.00M represented-voter scale**, complete formula and decimal masking, clean qualitative feedback, and studio aesthetic invariants.

---

## 1. Multi-Cycle Election Advancement & Warchest Rollover (`REQ-70`, `REQ-67`)

- **Constitutional Senate Class Rotation:**
  - Continuous cycle transitions rotate the active U.S. Senate class strictly according to the constitutional schedule:
    $$\text{Class III} \longrightarrow \text{Class I} \longrightarrow \text{Class II} \longrightarrow \text{Class III}$$
  - 2028: Class III (34 seats) | 2030: Class I (33 seats) | 2032: Class II (33 seats) | 2034: Class III (34 seats), etc.
  - Active Senate race rosters automatically populate based on sitting senators and historical seat baselines.
- **Alternating Cycle Dynamics:**
  - Toggles between Presidential election cycles (with presidential top-of-ticket coattails and electoral college maps) and Midterm cycles (focused on congressional and gubernatorial control).
- **Staggered Gubernatorial Calendars:**
  - Midterm elections contest 36 gubernatorial seats (TX, FL, NY, CA, PA, MI, OH, GA, NV, AZ, etc.).
  - Presidential elections contest 11 gubernatorial seats (DE, IN, MO, MT, NC, ND, UT, WA, WV, etc.).
  - Two-year states (NH, VT) contest gubernatorial races on every ballot.
- **Probabilistic Macro National Environment Engine:**
  - Computes the national environment for subsequent cycles using Gaussian distributions $\mathcal{N}(\mu, \sigma)$ with deterministic cycle seed hashing:
    - **Midterm Fatigue:** Incumbent president's party faces headwinds $\sim 80\%$ of the time ($-3.0$ to $-7.0$ points), with $\sim 20\%$ chance of neutral or favorable terrain.
    - **First-Term Re-Election Benchmark ($\sim 90\%$ Win Rate):** First-term incumbents receive natural structural incumbency bonuses ($+2.5$ to $+5.0$ environment rebound), winning $\sim 90\%$ of the time under standard play.
    - **Successor Nominee Benchmark ($\sim 90\%$ Loss Rate):** Two-term fatigue shifts the environment toward the out-party such that successors lose $\sim 90\%$ of the time without extraordinary overperformance.
- **Persistent Warchest Rollover (`REQ-67`):**
  - 100% of unspent treasury rolls over cleanly turn-to-turn and from election night into the next cycle's organizing phase for both the player and AI rival organizations.

---

## 2. State Legislature Seat Assignment Engine (`REQ-72`)

- **Standardized 100-Seat Bell-Curve Function (`seatsForVoteShare100`):**
  - **Threshold:** $< 15\%$ vote share = **0 seats**.
  - **Monopoly:** $\ge 85\%$ vote share = **100 seats** ($100\%$).
  - **Piecewise S-Curve Formula:**
    - Zone 1 ($15\% \le V < 40\%$): $\text{Seats}_{100}(V) = (V - 15) \times 0.40$ (gains $10\%$ seats across 25 pts).
    - Zone 2 ($40\% \le V < 60\%$): $\text{Seats}_{100}(V) = 10 + (V - 40) \times 4.0$ (steep swing zone; gains $80\%$ seats across 20 pts).
    - Zone 3 ($60\% \le V \le 85\%$): $\text{Seats}_{100}(V) = 90 + (V - 60) \times 0.40$ (gains final $10\%$ seats).
  - Perfect mathematical symmetry: $S(V) + S(100 - V) \equiv 100$ for all $V \in [0, 100]$.
- **Chamber Scaling & Multi-Party Allocation:**
  - Scales by Legislature Ratio ($\text{TotalChamberSeats} / 100$).
  - 2-Party races allocate seats via largest-remainder rounding.
  - Multi-Party races (3+ parties at $\ge 15\%$): Iterative step-up loop adds $+1$ seat at a time to the qualifying party whose seat allocation most closely preserves its baseline seat proportion ($\text{SeatPct}_p$), not raw vote share.
  - Verified across all 50 state chambers allocating all **5,462 legislative seats nationwide** with zero missing or excess seats.

---

## 3. Modular District Slices Across All 50 States (`REQ-62`, `REQ-72 DATA`)

- **Complete 50-State Slices Catalog:**
  - Generated and verified 50 modular state district slice files in `assets/districts/<STATE>-<N>.json`.
  - Big Four Megastates (CA, NY, FL, TX) support up to **200 districts**; remaining 46 states support up to **50 districts**.
  - Every district slice includes bounding box geometry, SVG path coordinates, citizen population representation, CVAP representation, and legislative ratios.

---

## 4. Post-Election Coalition Autopsies & Executive Dispositions (`REQ-73` to `REQ-77`)

- **Fullscreen Autopsy Modal (`.v07-autopsy-modal-overlay`):**
  - Automatically triggered upon election certification in Raised Navy styling with full keyboard Esc and trap handling.
- **3-Paragraph Coalition Movement Dossier (`REQ-73`):**
  - Dynamically synthesizes coalition realignment across the **155.00M represented electorate**, detailing net shifts among College-Educated Moderates, Working-Class Voters, Racial & Cultural Cohorts, and Independent Defectors.
- **Regional Faultlines Tracker (`REQ-74`):**
  - Categorizes national shifts into Solidified Bastions ($+7.5$ to $+18$ pts), Emerging Battlegrounds (within $\pm 4.5$ pts), and Lost Bastions.
- **Faction Post-Mortem & Blame Game (`REQ-75`):**
  - Competing public inquest statements issued in distinct faction voices: Ascendant Reform Wings push for ideological platform cementation, while Institutional Stewardship Wings demand suburban pragmatism and governing discipline.
- **Strategic Chair Dispositions (`REQ-76`):**
  - **Endorse Recommendations:** Empowers ascendant grassroots wing ($+8$ Confidence, $+4$ Supporter Trust; establishment chafes at $-5$ Member Happiness, $-7$ Confidence).
  - **Shelve Report:** Maintains party unity ($+4$ Sitting Member Happiness, $+\$5\text{M}$ donor treasury; movement activists frustrated at $-5$ Confidence).
  - **Regional Review:** Orders regional decentralization review ($-\$3\text{M}$ national administrative cost, state party federations stabilized).

---

## 5. State Party Federalism & Receivership Administration (`REQ-81` to `REQ-84`)

- **State Platform Tolerance & Friction (`REQ-81`):**
  - Compares national platform positions against state voter median tolerance baselines.
  - **Mild Friction (> 3.0 pts):** Local candidates distance from ticket; $-15\%$ chapter fundraising efficiency.
  - **Severe Rebellion (> 4.5 pts):** State Chair repudiates national planks; $-20\%$ turnout bonus and alert banner.
- **State Machine Crises (`REQ-82`):**
  - Dynamic mid-cycle crises (Bankruptcy, Factional Civil War, Corruption) presenting tough intervention dilemmas:
    1. **Full Federal Receivership:** Bailout debt ($-\$5\text{M}$), install national administration for 2 years (20 turns).
    2. **Matching Grant:** $-\$3\text{M}$ conditional funding with $60\%$ stabilization probability.
    3. **Non-Intervention:** Conserves funds but depresses volunteer morale and candidate recruitment.
- **Federal Receivership Administration (`REQ-83`):**
  - Costs $\$500\text{k}/\text{turn}$ overhead per state under administration, decrements turns automatically, and clears upon expiration.
- **Visual Health Status Pips (`REQ-84`):**
  - 4-Tier color status indicators across the 50-State Directory: Green (Healthy), Blue (Receivership), Amber (Friction), Coral (Crisis/Severe Rebellion).

---

## 6. Pundit Forecaster Maps & 13-Tier Consensus Engine (`REQ-87`)

- **Multi-Chamber Projections:**
  - Dedicated map views and projection cards for U.S. Senate, U.S. House, and the Presidency.
  - Parody forecasters: Sallow's Crystal Ball, Cooked Political Report, and Upside/Inside Elections.
- **Discrete 7-Tier vs. Blended 13-Tier Ratings:**
  - Individual outlets report in standard 7 discrete tiers: `Solid`, `Likely`, `Lean`, `Toss-up`.
  - Consensus averaging interpolates into a **13-Tier Continuous Spectrum**:
    `Solid Dem` $\longleftrightarrow$ `Very Likely Dem` $\longleftrightarrow$ `Likely Dem` $\longleftrightarrow$ `Favored Dem` $\longleftrightarrow$ `Lean Dem` $\longleftrightarrow$ `Tilt Dem` $\longleftrightarrow$ `Toss-Up` $\longleftrightarrow$ `Tilt GOP` $\longleftrightarrow$ `Lean GOP` $\longleftrightarrow$ `Favored GOP` $\longleftrightarrow$ `Likely GOP` $\longleftrightarrow$ `Very Likely GOP` $\longleftrightarrow$ `Solid GOP`.
- **Continuous Color Palette:**
  - `#1d4ed8` $\to$ `#2563eb` $\to$ `#3b82f6` $\to$ `#60a5fa` $\to$ `#93c5fd` $\to$ `#bfdbfe` $\to$ `#fbbf24` $\to$ `#fecaca` $\to$ `#fca5a5` $\to$ `#f87171` $\to$ `#ef4444` $\to$ `#dc2626` $\to$ `#b91c1c`.

---

## 7. Autonomous Custom Party Creation & Incumbent Seat Claiming (`REQ-63`)

- **Autonomous Non-Replacing Entities:**
  - Custom parties exist alongside all 6 base parties without replacing or overwriting standard rivals.
  - Full customization: Nameable starting party chair, color picker for custom hex code, and customizable 1–10 issue positions.
- **Hierarchical Politician Incumbent Seat Claiming:**
  - When choosing the "Current Politician" archetype, a 3-step picker (`Office` $\to$ `State` $\to$ `Seat`) inspects real-world incumbents (Governor, Senate, House).
  - The claimed seat and incumbent politician successfully transfer to the custom party as a sitting elected member and incumbent candidate.
- **Standalone Voter Accounting:**
  - Dedicated column in the Registered Voters sidebar and state registration tables without generic third-party bundling.

---

## 8. Actions Overhaul & Atmospheric Wire (`REQ-64` to `REQ-86`)

- **Minor Party Tracking (`REQ-64`):** Dedicated race filters tracking statutory ballot access thresholds ($2\%/5\%$) and spoiler margin viability alerts.
- **Leader Candidacy Deployment (`REQ-65`):** Bench leaders deployed directly into Senate, Governor, or House races, transferring personal Fame and Popularity into candidate baseline quality.
- **State Voter Registration Table (`REQ-66`):** Disaggregated state drill-down tracking registered voters by individual party.
- **Commissioned Race Polling (`REQ-68`):** Snapshot polling costing $\$1\text{M}$ (House) or $\$2\text{M}$ (Senate/Governor).
- **Priorities Lock-In (`REQ-69`):** 3 Main Priorities locked upon confirmation for the entire 2-year cycle with padlock status indicators.
- **50-State Starting Chapters (`REQ-71`):** Minor and custom parties begin with 1 branch in each of the 50 states (50 initial branches).
- **Fame-Scaled Popularity (`REQ-85`):**
  $$\text{Effective Popularity} = \text{Raw Popularity} \times \left(\frac{\text{Fame}}{100}\right)$$
  $$\text{Net Approval} = (2 \times \text{Effective Popularity}) - \text{Fame}$$
- **State-Targeted Small Donor Drive Overhaul (`REQ-86`):** Requires target state selection; yield incorporates visit frequency fatigue ($1.0\times \to 0.70\times \to 0.45\times \to 0.25\times$), state membership density, faction happiness, and campaign finance deregulation stances (up to $2.0\times$ multiplier). Calibrated to $\$5.0\text{M}$ national first-visit benchmark.
- **Atmospheric Wire & Sanitization (`REQ-78`, `REQ-79`, `REQ-80`):** Morning Wire ticker header ("The Beltway Rundown"), qualitative Field Director Dispatches, and complete decimal and formula stripping across all UI views.

---

## 9. Save System & Release Verification

- **Save Schema 7 (`partyChairGame.save.v12`):**
  - Updated primary save key to `partyChairGame.save.v12`.
  - Comprehensive backward compatibility chain supporting saves from v11, v10, v9, down to v1.
- **Automated Verification Test Suite:**
  - Executed `scripts/test-agent7-integration.cjs`, `scripts/test-agent6-overhauls.cjs`, and `scripts/test-req72-seats.cjs`.
  - **631 total assertions verified (100% pass rate)** across all 10 subsystems.
- **Release Executable Binary:**
  - Compiled via `./build.ps1` using Microsoft .NET C# Compiler (`csc.exe`).
  - Output binary: `dist/release/Coalition Builder - Party Chair.exe` (658,432 bytes / ~643 KB).
  - Clean startup with zero console errors.

---


---

## VERSION 0.13

# Coalition Builder: Party Chair — Version 0.13

Version 0.13 expands multi-decade gameplay with persistent politician career progression, high-office ascension pipelines, strategic Super PAC victory compacts, dynamic petition-based ballot access, competitive presidential primaries, and granular faction alignment.

---

## 1. Generational Bench Cultivation & Post-Chair Legacies (`REQ-89` to `REQ-93`, `REQ-106`)

- **Politician Seniority & Career Milestones (`REQ-89` / `BENCH-01`):**
  - Added persistent service records tracking terms completed across offices (`house`, `senate`, `governor`, `stateLeg`) and career achievements.
  - Sitting members accumulate $+2$ to $+5$ Fame per cycle based on national visibility and chamber status. Net approval dynamically evolves with legislative achievements and state performance.
- **The Bench Ascension Pipeline (`REQ-90` / `BENCH-02`):**
  - U.S. Senate and Gubernatorial primary generators query sitting House representatives with $\text{Fame} \ge 45$ and positive net approval to step forward and enter statewide primary fields.
  - Ascending members vacate their congressional district seats, triggering authentic open-seat primary domino effects across the map.
- **Party Chair Mentorship & "Rising Star" Designation (`REQ-91` / `BENCH-03`):**
  - Added the *"Designate Rising Star"* leadership action ($1\text{ action} + \$2\text{M}$ surrogate development fund) for up to 2 high-potential politicians ($\text{Fame} < 50, \text{Quality} \ge 7$), yielding accelerated fame and popularity gains over 10 turns.
- **Politician Aging, Retirement & The Council of Party Elders (`REQ-92` / `BENCH-04`):**
  - Politicians age 2 years per cycle. At age 70+, annual retirement rolls begin (20% base probability, $+15\%$/cycle thereafter).
  - Retiring leaders with Net Approval $\ge +20$ transition into the **Council of Party Elders**, providing an immutable $+1.5$ Confidence stabilization floor to their home faction.
- **Bench Roster UI & Pipeline Scannability Filter (`REQ-93` / `BENCH-05`):**
  - Added quick-filter tabs to the Sitting Members screen (`[All]`, `[Rising Stars]`, `[Ready for Higher Office]`, `[Party Elders]`) and high-contrast copper chevrons marking higher-office contenders.
- **Major Party Restlessness Fame Threshold Elevation (`REQ-106`):**
  - Raised the Fame threshold for major party politicians (Democrats and Republicans) to become restless and demand leadership roles from 75 to **90** (`fame >= 90`), while preserving the 75 threshold for minor parties.

---

## 2. Strategic Alignment Compacts & Super PAC Steering (`REQ-94` to `REQ-96`)

- **National Steering Summit & Joint Victory Compacts (`REQ-94` / `COMP-01`):**
  - Allied Super PACs offer major independent expenditure commitments ($12\text{M}$ to $20\text{M}$ reserved ad airtime) in exchange for governance commitments (appointing a factional campaign chair, prioritizing a specific policy plank, or aligning candidate profiles).
- **Institutional Accountability & Donor Capital Strikes (`REQ-95` / `COMP-02`):**
  - Explicitly reneging on accepted compact terms freezes external ad reserves, triggers an $\$8\text{M}$ donor treasury withdrawal, and penalizes base trust by $-4.0$. Honoring compacts grants a $+10\%$ budget bonus in the subsequent cycle.
- **Compact Status Tracker Widget (`REQ-96` / `COMP-03`):**
  - Embedded a dedicated tracking card in the Finance dashboard detailing partner PACs, promised reserves, agreed terms, and compliance states (*Honored*, *Pending*, *Violated*).

---

## 3. Petition-Based Ballot Access & Presidential Primaries (`REQ-102` to `REQ-104`, `REQ-107`)

- **Deterministic Starting Ballot Access & Petition System (`REQ-102` / `BALLOT-01`):**
  - Initial starting voter baselines initialized at $\sim 100\text{k}$ for both the Green Party and Constitution Party.
  - Deterministic ballot access map established: Green Party on ballot in 2024 Harris states (Senate, Gov, 80% House); Libertarians on ballot nationwide (100% Senate, 100% Gov, 50% House); Constitution & Socialist start at 0%.
  - Added petition mechanic: unlisted parties reaching $\ge 10{,}000$ registered voters in a state can successfully petition for ballot access.
- **2028 Competitive Presidential Primaries & Open Progression (`REQ-103` / `PRES-01`):**
  - 2028 Democratic primary features Jon Ossoff, Alexandria Ocasio-Cortez, and Gavin Newsom polling tightly.
  - 2028 Republican primary features Marco Rubio, J. D. Vance, and Ron DeSantis polling tightly.
  - Post-2028: Sitting presidents run unchallenged; open fields feature the top 10 favorability members.
- **"Filtering Support" & Faction Confidence Impact (`REQ-104` / `ENDORSE-01`):**
  - Rebranded endorsements to **"Filtering support"**, delivering a decisive $10\text{-point}$ primary polling swing.
  - Filtering support grants **$+1$ Confidence** to the supported candidate's faction and imposes **$-3$ Confidence** across all other party factions.
- **Party-Specific Faction Leadership Roles & Alignment (`REQ-107` / `LEAD-01`):**
  - Replaced generic placeholder slots with actual party factions (5 Democratic, 5 Republican).
  - Enforced strict factional membership: only politicians who belong to that specific faction can be appointed as its Faction Leader.

---

## 4. Engine Controls, Turn Flow & Polish (`REQ-88`, `REQ-97` to `REQ-101`, `REQ-105`)

- **Cumulative Inter-Cycle Electorate Growth (`REQ-88` / `GROWTH-01`):**
  - Electorate expands by $+3\%$ annually ($+6.09\%$ per 2-year cycle; $+9.44\text{M}$ voters in first cycle).
  - $100\%$ of new entrants register as Independents / Unaffiliated, naturally diluting partisan baselines and raising general election swing volatility.
- **Major Priorities Confirmation Modal (`REQ-97` / `MODAL-01`):**
  - Added explicit confirmation prompt: *"Are you sure? This can't change after being selected."* Permanently locks slots with padlock status indicators upon confirmation.
- **Terminology & "Party Focus" Expansion (`REQ-98` / `DECK-01`):**
  - Rebranded *Main Priority* to **"Major Priority"**.
  - Rebranded *Additional Priorities* to **"Party Focus"** and expanded capacity from 5 to **10 total slots**.
- **Synchronized Wave Momentum Gauge (`REQ-99` / `WAVE-01`):**
  - Wave Momentum gauge and needle position initialize directly from `game.nationalEnvironment` (starting at D+9.0) rather than defaulting to 0.0.
- **Conditional Senate Subtabs Display (`REQ-100` / `SENATE-01`):**
  - Scoped `.v07-senate-bar` exclusively to the Senate map view; hidden when viewing House, Governor, or State Legislature maps.
- **Organizing Phase Direct Action Pool (`REQ-101` / `ACTION-01`):**
  - Replaced the repetitive 20-turn "Confirm Turn" clicking cycle with a unified pool of **20 Pre-Campaign Leadership Actions** and a direct *"Resolve Primaries & Launch General Election Campaign"* transition control.
- **Stance Prose Typography Scaling (`REQ-105` / `SLIDER-01`):**
  - Scaled down `.v09-stance-callout` font-size to $11.5\text{px}$ to match `.v09-range-pole` boundary text, ensuring clean card proportions without text clipping.

---

## 5. Verification & Executable Release

- **Automated Verification:** `scripts/test-v013-integration.cjs` passed with **51/51 assertions (100% pass rate)**.
- **Canonical Windows Executable:** Compiled via `build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` (670,208 bytes / ~654 KB).
- **Save Version Schema:** Upgraded to `partyChairGame.save.v13` with seamless migration from v12 through v1.

---

## VERSION 0.14

# Coalition Builder: Party Chair — Version 0.14
*(Shipped: Nov 14, 2026)*

**Theme:** *Candidate Traits & Personalities, State Legislative Slate Contestation, Institutional Leadership & Chamber Scoping, Absolute Electoral Baselines, and Streamlined Party Information*

Version 0.14 packages **21 total features** across all tiers:

### 1. Candidate Traits Engine (`REQ-128` / `TRAITS-01` — Huge)
- **8 Canonical Candidate Traits:** Assigns qualitative character profiles across all 605 politicians in the game:
  1. *Rising Star:* Rapidly gaining national buzz; restricted to candidates under 60.
  2. *Established politician:* Well-known institutional veteran with seniority and established credibility.
  3. *Corrupt:* Dogged by federal ethics probes, campaign finance controversies, or indictments.
  4. *Squeaky Clean:* Flawless public record and unquestioned ethical reputation.
  5. *Polished:* Exceptional orator, charismatic debater, and camera-ready communicator.
  6. *Rough:* Unfiltered, plainspoken, and unpolished; highly authentic appeal.
  7. *Disciplined:* Sticks strictly to message, manages media appearances, and avoids gaffes.
  8. *Undisciplined:* Prone to off-script controversies and unpredictable outbursts.
- **Visual Trait Chips:** Stylized badges integrated across candidate inspection cards, primary profiles, and leadership appointment dropdowns.
- **Complete Politician Mapping:** Loaded traits database mapping all 605 politicians from `POLITICIAN_TRAITS.md`.

### 2. State Legislative Contestation & Downballot Evolution (`REQ-114` / `LEG-01` — Large)
- **Dedicated Step 4 in Recruitment Phase:** State legislative slate contestation separated from primary endorsements into dedicated Step 4.
- **1-Seat Automatic Contestation Rule:** Parties automatically contest state legislatures where they control $\ge 1$ seat with zero financial or action cost.
- **Uncontested Slate Action & Dynamic EV Scaling:** Contesting an unheld state legislature costs $1M–$5M scaled by Electoral Votes (3 EVs = $1M; 54 EVs CA = $5M; rounded to nearest whole million) + 1 Leadership Action.
- **Minor Politician Generation:** Dynamically generates new politicians for minor parties whenever they win state legislative seats.

### 3. Leadership Hierarchy & Chamber Scoping (`REQ-108`, `REQ-109`, `REQ-110`, `REQ-127`)
- **Faction Leader Candidate Filtering (`REQ-108` / `ROLES-01`):** Dropdowns only display politicians belonging to that specific faction, fixing `BUG-02`.
- **Hide Inaccessible Roles (`REQ-109` / `ROLES-02`):** Leadership roles the party cannot currently access are completely hidden rather than displayed as locked cards.
- **Governing Cabinet & Opposition Leadership (`REQ-110` / `ROLES-03`):** Unlocks 4 Cabinet posts (Chief of Staff, Treasury, Attorney General, State) when in the White House; unlocks 3 Opposition leaders when in the minority.
- **Chamber-Exclusive Eligibility (`REQ-127` / `ROLES-04`):** Strictly enforces constitutional qualifications: House members only for House leadership; Senators only for Senate leadership; legislators cannot simultaneously hold executive Cabinet posts.

### 4. Electoral Modeling, Leans & Forecaster Polish (`REQ-115` to `REQ-119`, `REQ-121`, `REQ-122`)
- **House Pure District Leans (`REQ-118` / `HOUSE-01`):** Decoupled congressional district races from statewide leans, using Cook PVI district baselines.
- **Absolute Partisan Lean Gradient (`REQ-119` / `LEAN-01`):** Slices baseline state partisan lean completely isolated from national waves, approval drag, or ad spend.
- **Senate Class Forecaster Scope (`REQ-115`, `REQ-116`):** Defaults Senate map to active class; inactive classes show current control in muted shades.
- **Streamlined Trifectas Map (`REQ-117` / `TRIFECTA-01`):** Unified 3-category display (Dem Trifecta, GOP Trifecta, Divided) and Nebraska neutral gray.
- **Forecaster Tier Label Cleanup (`REQ-121`):** Stripped redundant numerical tier count labels from forecaster card pill badges.
- **"Safe" Rating Rebrand (`REQ-122`):** Rebranded all forecaster ratings from "Solid" to "Safe" (Safe Dem / Safe GOP).

### 5. Recruitment Phase, Priorities & Navigation (`REQ-111` to `REQ-113`, `REQ-120`, `REQ-123` to `REQ-126`)
- **Party Isolation Safeguard (`REQ-111` / `SCOPE-01`):** Fixed `BUG-04`, preventing custom/minor parties from seeing or interacting with Democratic politicians.
- **Candidate Recruitment Economy (`REQ-112` / `RECRUIT-01`):** Reduced recruitment cost to a flat $1.0M across all offices.
- **"The Recruitment Phase" Canonical Rebrand (`REQ-113` / `PHASE-01`):** Updated phase title across all headers, status bars, and tickers.
- **Explicit Eligibility Requirements (`REQ-123` / `QUEST-01`):** Replaced vague condition warnings with clear prerequisite checklists.
- **Deferred Acceptance Bonuses (`REQ-124` / `QUEST-02`):** Bonuses award only upon officially confirming and locking the 3 Major Priorities.
- **"Grow in [STATE]" Target Selector (`REQ-125` / `QUEST-03`):** Dynamic 50-state dropdown allowing players to target any state.
- **Tab Ordering Polish (`REQ-120` / `TABS-01`):** Swapped Party Info and Forecasters tabs; moved Faction Confidence to the leadership dashboard.
- **Retire Legacy Action Strip (`REQ-126` / `ROSTER-01`):** Retired legacy bench signing strips in favor of unified recruitment controls.



---

## VERSIONS 0.14.4 – 0.14.6 DESIGN SPECIFICATIONS ARCHIVE

### REQ-129: Recruitment Actions Pool Inter-Cycle Reset (20 Actions per New Cycle)
- **Classification:** Small (Bug Fix / Turn Loop)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** The Recruitment Phase (`REQ-113`, `REQ-101`), Inter-Cycle Transition (`startNextCycle`, `engine.js`, `app.js`)
- **Problem Statement:**
  When advancing from an election night completion into a new election cycle (e.g. 2028 to 2030, or 2030 to 2032 via `startNextCycle()`), the pre-campaign recruitment actions pool (`game.organizingActionsRemaining`) was not reset to 20. Because advancing to the general campaign phase drains the pool to 0, players entering subsequent cycles started with 0 actions remaining, blocking candidate recruitment, chapter expansion, bill introduction, and slate contestation in new cycles.
- **Mechanical Specification:**
  - **Full Action Pool Reset on Cycle Boundary:**
    - In `engine.js` (`startNextCycle`):
      Explicitly reinitialize the recruitment action counter upon starting any new cycle:
      ```javascript
      organizingActionsRemaining: 20,
      actionsLeft: 20,
      ```
  - **Recruitment Phase Action Header Synchronization:**
    - In `app.js` (`step4WorkMarkup` / Step 5 Recruitment Actions Pool):
      Ensure the action counter meter and top bar badges display the full 20 actions:
      `[ 20 Actions Remaining ]` / `20 actions left`.
  - **Clean Action Meter State:**
    - Reset cycle-specific action spending metrics (`actionsSpentThisCycle: 0`, `recruitsThisCycle: 0`, `billsThisCycle: 0`).

### REQ-130: State Legislative Slate Single-Cycle Scope & Foothold Retention Rule
- **Classification:** Small (Game Mechanics / State Legislatures)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** State Legislative Slate Contestation (`LEG-02`), Inter-Cycle Transition (`startNextCycle`, `engine.js`, `app.js`)
- **Problem Statement:**
  Previously, choosing to contest a state legislative slate was ambiguous regarding inter-cycle persistence. If a minor or custom party spent treasury funds to contest a state slate once, the slate could indefinitely remain contested even if the party failed to win any seats, undermining the long-term grand-strategy challenge of building downballot infrastructure.
- **Mechanical Specification:**
  - **Single-Election Scope for Contested Slates:**
    - Choosing to contest a state legislative slate in The Recruitment Phase (paying EV-scaled $1M–$5M + 1 action) **strictly guarantees ballot contestation for THAT election cycle only**.
  - **Inter-Cycle Foothold Evaluation (`startNextCycle` in `engine.js`):**
    - When advancing into a new election cycle:
      - **Foothold Established ($\ge 1$ Seat Won):** If the party won at least 1 seat in that state legislature during the election (`game.stateHouseSeatCounts[stateId]?.[partyId] >= 1`), that legislature carries over with permanent, **free automatic contestation** in future cycles.
      - **Zero Seats Won (0 Seats):** If the party contested the slate but failed to win any seats (`seatsWon === 0`), the contestation expires. The state reverts to uncontested (0% presence), and the party chair must start over and deliberately choose to contest the slate again (paying the EV-scaled cost + 1 action) if they wish to field candidates in the new cycle.
  - **State Slate Status Tracker:**
    - In `app.js` (`step4StateLegMarkup`), state slate badges reflect these states clearly:
      - `Incumbent Foothold (Automatic / Free)`
      - `Contested This Election ($X.XM Paid)`
      - `Uncontested (Field Slate for $X.XM + 1 action)`

### REQ-131: Campaign Phase Chronological Flavor Rebrand (Weeks to Months)
- **Classification:** Tiny (Flavor Polish / UI Copy)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** The Campaign Phase (`app.js`, `engine.js`, `VERSION_0.8.md`)
- **Problem Statement:**
  Currently, the general election campaign phase is presented chronologically as "Weeks" (e.g., "15-Week Campaign Phase", "Campaign Week 1 of 15", "15 weeks to Election Night"). In real American politics, general election campaigns span key calendar months leading up to November. Shifting the atmospheric flavor from weeks to months provides richer narrative grounding for the chair's grand-strategy campaign operations.
- **Flavor & UI Text Specification:**
  - **Rebrand Weeks to Months (Flavor Only):**
    - Transition all user-facing campaign headers, turn progress pills, wire tickers, and tooltips from referencing "Weeks" to "Months":
      - Header Eyebrow: `General Election Campaign · Month ${month} of ${maxMonths}` (e.g. Month 1 of 4 or seasonal monthly campaign progression).
      - Wire Ticker / Phase Banner: `CAMPAIGN MONTH ${month} · ${actionsRem} ACTIONS REMAINING`.
      - Time-to-Election Note: `${monthsRemaining} months until Election Night`.
    - **October Surprise Preservation:** The iconic late-campaign crisis event ("October Surprise") remains preserved as a premier campaign-climax event before November Election Night.
  - **Zero Gameplay or Mechanical Effect (Strict Rule):**
    - Per user direction, **this change has NO effect on gameplay—just flavor**.
    - All underlying simulation math, turn loops, ad-spending formulas, event triggers, and election resolutions function identically to their existing engine mechanics.

### REQ-132: Campaign Phase Turn Cadence (5 Turns & 5 Actions/Turn)
- **Classification:** Small (Turn Engine & Action Economy)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** The Campaign Phase (`app.js`, `engine.js`, `REQ-131`, `VERSION_0.8_DESIGN.md`)
- **Problem Statement:**
  Currently, the campaign phase runs across 15 turns (weeks) with 3 actions per turn, requiring 45 turn cycles before reaching Election Night. This lengthy progression can cause campaign-phase drag. Reducing the campaign phase to 5 turns while increasing the action allowance to 5 actions per turn streamlines gameplay into a punchy, high-leverage 25-action sprint leading into Election Night.
- **Mechanical & Economy Specification:**
  - **Turn Cadence Reduction (15 Turns → 5 Turns):**
    - Set campaign duration (`campaign.maxWeeks` / `campaign.maxTurns` / `campaign.maxMonths`) to `5` (previously `15`).
    - In `engine.js` (`initialCampaign`, `startCampaignPhase`, `resetCampaignState`, and state factories), initialize `maxWeeks: 5` (or `maxTurns: 5`) and `week: 1` (Month 1 of 5).
    - In `advanceCampaignWeek(game)`, when current turn $\ge 5$, conclude the campaign and immediately execute General Election Night (`resolveVersion01GeneralElection`).
    - **October Surprise Event Timing:** In `drawCampaignEvent(game, week)`, trigger the October Surprise event on Turn 4 (Month 4 of 5), serving as the penultimate late-campaign crisis event before Turn 5 (Month 5) concludes into General Election Night.
  - **Action Economy Increase (3 Actions → 5 Actions Per Turn):**
    - Increase base actions per campaign turn from 3 to 5 (`weeklyActionsLeft: 5` or `turnActionsLeft: 5`).
    - Reinitialize `weeklyActionsLeft = 5` upon entering the campaign in `startCampaignPhase()` and at the start of each turn in `advanceCampaignWeek()`.
    - All campaign actions (candidate funding allocations, vet-or-oppo, caucus-retreat, surrogate-media-blitz, state-ballot-measure, persuade-independent-caucus, appease-faction-threat, court-rival-moderate) decrement from the 5-action pool.
  - **UI & Messaging Alignment (Integrated with REQ-131):**
    - Header Eyebrow: `General Election Campaign · Month ${month} of 5`.
    - Action Counter Pill: `Campaign Actions: <b>${actionsLeft}/5</b>`.
    - Turn Progression Button: `${month < 5 ? `Advance to Campaign Month ${month + 1} of 5 →` : `Proceed to General Election Night ${game.year || 2028} ★`}`.
    - Wire Ticker / Banner: `CAMPAIGN MONTH ${month}/5 · ${actionsLeft}/5 ACTIONS REMAINING`.

### REQ-133: Campaign Phase Consensus Polling & Forecast Maps Widget
- **Classification:** Medium (UI / Polling & Forecaster Map Integration)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** The Campaign Phase (`app.js`, `engine.js`, `VERSION_0.8_DESIGN.md`, `maps-0.3.js`), Forecaster Consensus Engine (`consensusRating`, `TIER_13_ORDER`, `renderForecastView`)
- **Problem Statement:**
  During the General Election Campaign Phase, the party chair makes critical resource investments and executes grand-strategy operations without immediate visual feedback on the electoral battlefield within the campaign dashboard. Requiring players to toggle away to the separate Forecasters tab obscures how campaign spending, surrogate blitzes, and opposition research are moving battleground margins.
- **Mechanical & UI Specification:**
  - **Widget Placement (Above Grand-Strategy Actions):**
    - The Polling widget is embedded directly into the Campaign Phase command view (`renderCampaignPhase` in `app.js`), positioned **immediately above the "Weekly Grand-Strategy Actions" section** (`.v08-campaign-card panel`).
    - Container Header:
      - Eyebrow: `Battleground Intelligence & Forecast Consensus`
      - Heading: `Live Campaign Polling & Consensus Forecasts`
      - Description: `Real-time consensus projections synthesized from Cooked Political Report, Sallow's Crystal Ball, and Upside Elections across all active chambers.`
  - **4 Chamber Forecast Tabs:**
    - The widget provides 4 switchable tabs:
      1. **Senators:** Interactive US Senate consensus forecast map displaying active Senate class races with 13-tier consensus shading.
      2. **House:** US House of Representatives consensus forecast map (displaying all 435 congressional districts or battlegrounds) with 13-tier consensus shading.
      3. **Governor:** Gubernatorial consensus forecast map displaying all active gubernatorial races with 13-tier consensus shading.
      4. **State Legislature:** State Legislative consensus forecast map displaying legislative chamber control and majority forecasts across all 50 states.
  - **Consensus Forecast Map Architecture:**
    - Live maps render using the proven map rendering engine (`renderChamberMap` / `renderMap` from `maps-0.3.js` and `app.js`).
    - Maps are sourced directly from the **13-tier Consensus forecast** (`forecasterMapSource = 'consensus'`, `game.forecasters?.consensus`, and `consensusRating()`), identical to the maps displayed in the dedicated Map Forecast section.
    - Features full interactive tooltips on district/state hover (showing state/district name, active candidates, party affiliations, current 13-tier consensus rating chip, and vote margins).
    - Includes a compact 13-tier gradient legend below the active map for quick visual calibration.
  - **Dynamic Turn & Action Reactivity:**
    - The polling maps reactively refresh whenever a campaign turn advances (`advanceCampaignWeek`) or when player actions alter state/district ratings in `game.forecasters`.

### REQ-134: Public & Coalition Trust Velocity Dampening (1/10th Rate Pace)
- **Classification:** Small (Simulation Engine / Trust Dynamics)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Trust Simulation Model (`engine.js`, `app.js`, `v07-scaffolding.js`)
- **Problem Statement:**
  Currently, Public Trust (`trust.independents`) and Coalition/Supporter Trust (`trust.supporters`) fluctuate with high volatility based on event dilemmas, leadership choices, campaign actions, and post-election autopsy decisions. High velocity causes trust to bounce erratically between extremes (0 and 100), disrupting strategic pacing.
- **Mechanical Specification:**
  - **1/10th Velocity Multiplier:** Scale all delta adjustments to Public Trust (`trust.independents`) and Coalition Trust (`trust.supporters`) by **$\times 0.1$** (one-tenth of previous rate):
    $$\Delta \text{Trust}_{\text{applied}} = \text{round}(\Delta \text{Trust}_{\text{base}} \times 0.1, 2)$$
  - **Universal Application Across Systems:**
    1. *Campaign Events & Dilemmas:* All trust gains and penalties from weekly campaign event choices and October Surprise outcomes are scaled by 0.1 (e.g., $+3.0$ trust becomes $+0.3$; $-2.5$ becomes $-0.25$).
    2. *Primary Endorsement Backlash:* Inter-faction backlash from filtering support scales down by 0.1.
    3. *Leadership Reassignment Penalties:* Unscheduled leadership swaps impose $-1.0$ supporter trust (scaled down from $-10.0$).
    4. *Post-Mortem Autopsies:* Coalition trust penalties and independent trust boosts from post-election autopsy choices scale by 0.1.
    5. *Grand-Strategy Actions:* Trust shifts from surrogate blitzes, caucus wooing, and ballot measures scale by 0.1.
  - **Bounded Constraints:** Retains $[0, 100]$ absolute score bounds while providing steady, continuous trust evolution over multiple cycles.

### REQ-135: Minor Parties Approval Ceiling Cap (25% Hard Limit)
- **Classification:** Small (Simulation Engine / Approval Mechanics)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Unified Party Approval Engine (`computeUnifiedPartyApproval`, `engine.js`, `app.js`)
- **Problem Statement:**
  Currently, minor parties (Libertarian, Green, Constitution, Socialist, and custom minor formations) can theoretically achieve runaway national approval ratings (e.g. 50%–70%+) if their internal Supporter/Coalition Trust and Independent Public Trust reach high levels, distorting third-party simulation dynamics where minor parties historically face institutional ceilings.
- **Mechanical Specification:**
  - **25% Hard Approval Cap for Minor Parties:**
    - In `engine.js` (`computeUnifiedPartyApproval`), enforce a strict upper bound cap of **25.0%** on national party approval for all minor parties (`!party.isMajor`):
      ```javascript
      // Hard cap minor party approval at 25% regardless of Public & Coalition trust
      if (!party.isMajor) {
        unified = Math.min(unified, 25.0);
      }
      ```
    - This cap applies strictly **regardless of Public & Coalition trust levels**, generic ballot standing, leader popularity, or presidential factor.
  - **Band Consistency:**
    - For minor parties with approval clamped at 25%, their approval status band reflects their structural minor-party position cleanly in the UI (e.g., `Competitive` within third-party tier rather than major-party `Rising`).
  - **UI Display & Forecaster Calibration:**
    - The Party Overview and Forecasters tabs display the capped approval rating (up to 25.0%), preserving realistic third-party polling ceilings.

### REQ-136: Starting Vacancies for Party & Faction Leaders (Institutional Leaders In Place)
- **Classification:** Small (Leadership Hierarchy / Game Setup)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Leadership Hierarchy (`initializeLeadershipRolesForParty`, `v07-scaffolding.js`, `app.js`)
- **Problem Statement:**
  Currently, when a new save begins, the game automatically populates every leadership slot—including purely internal Party positions (Rhetorical Leader, Policy Leader) and all Faction Leader positions—with pre-assigned politicians. This robs the player chair of the foundational strategic choice of deciding which factions to empower and who to elevate as the party's primary ideological voices upon taking office.
- **Mechanical Specification:**
  - **Party & Faction Roles Start Vacant (`null`):**
    - In `v07-scaffolding.js` (`initializeLeadershipRolesForParty`), all roles categorized under:
      1. `category === 'party'` (`rhetoricalLeader`, `policyLeader`)
      2. `category === 'faction'` (`faction_progressives`, `faction_establishment`, `faction_labor`, `faction_faith`, `faction_moderates`, `faction_nationalists`, `faction_traditionalists`, `faction_libertarians`, `faction_mavericks`, `faction_institutionalists`)
      initialize to **`null`** (unassigned) at the start of a new game.
    - These slots display in the UI with a clear placeholder: `— Unassigned (Select Member) —`.
  - **Institutional Leaders Remain In Place:**
    - Institutional constitutional roles (`category === 'institutional'`, `category === 'cabinet'`, `category === 'opposition'`):
      - House Speaker / Majority Leader / Minority Leader
      - Senate Majority Leader / Minority Leader
      - House Whip / Senate Whip
      - President & Vice President
      - Chair of Governors Association / Opposition Governors Chair
      remain properly pre-populated with their authentic 2028 sitting officeholders (e.g. Jeffries, Schumer, Thune, Ossoff, Vance) because these reflect established constitutional offices determined by previous elections and chamber caucuses.
  - **Player Appointment Flow:**
    - The player chair can freely appoint eligible politicians to vacant party and faction leadership roles during The Recruitment Phase without paying unscheduled swap backlash penalties on initial appointments.

### REQ-137: Two-Year Constitutional Senate Class Rotation Engine
- **Classification:** Small (Simulation Engine / Cycle Turnover)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Constitutional Senate Rotation (`getSenateClassForYear`, `startNextCycle`, `engine.js`, `app.js`)
- **Problem Statement:**
  The U.S. Senate constitutionally divides into three rotating classes: Class I (33 seats), Class II (33 seats), and Class III (34 seats), with one class up for election every two years. Between election cycles, the game must rigorously rotate the active constitutional Senate class rather than stalling or defaulting to Class III.
- **Mechanical Specification:**
  - **Canonical 2-Year Senate Rotation:**
    - In `engine.js` (`startNextCycle`, `normalizeGame`, and state initialization), strictly enforce the biennial constitutional rotation:
      - **2028:** Class III (34 seats)
      - **2030:** Class I (33 seats)
      - **2032:** Class II (33 seats)
      - **2034:** Class III (34 seats, cycle repeats)
      $$\text{senateClass} = [3, 1, 2][\text{round}((year - 2028)/2) \pmod 3]$$
    - Ensure `game.activeSenateClass` is persistently assigned the active class integer ($1, 2, \text{or } 3$), and `game.activeSenateRaces` regenerates with the exact state seats belonging to that class.
    - All Recruitment Phase candidate recruitment, primary support filtering, primary resolutions, and General Election Night seat allocations evaluate the active class's states and sitting incumbents.

### REQ-138: Dynamic Senate Forecaster Projections (Scoped to Active Senate Class)
- **Classification:** Small (UI & Forecaster Engine / Senate Projection Scoping)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Forecasters View (`app.js`, `engine.js`, `buildForecasters`, `REQ-137`)
- **Problem Statement:**
  In the Forecasters tab and battleground comparison tables (`forecastersMarkup` in `app.js`), Senate projections currently hardcode Class III (e.g., `['PA', 'GA', 'NV', 'AZ', 'WI', 'OH', 'TX', 'FL', 'NC'].map(...)` labeled "Senate (Class III)"). This causes the forecaster view to display Class III every cycle regardless of year, failing to show the seats actually on the ballot in 2030 (Class I) or 2032 (Class II).
- **Mechanical & UI Specification:**
  - **Dynamic Active Class Projection Scoping:**
    - In `app.js` (`forecastersMarkup`), replace the hardcoded Class III array with the active cycle's contested Senate races (`game.activeSenateRaces` / `getActiveSenateRaces(game)`).
    - Battleground comparison table and section headings dynamically report the active class:
      - Title: `U.S. Senate Projection (Class ${activeClassRoman})` (e.g. `Class I` in 2030, `Class II` in 2032).
      - Table Rows: Display the active Senate races up for election in that cycle, with candidate names, incumbent status, and the 4 pundit ratings (Cooked, Sallow, Upside, Consensus).
    - In `buildForecasters(game)` (`engine.js`), ensure pundit ratings populate all active class keys (`senate:${stateId}`) for the current year.

### REQ-139: Minor Party Starting Popularities Anchor to Initial Benchmarks (Preserve Starting Share & 25% Upper Ceiling)
- **Classification:** Small (Bug Fix / Simulation Tuning)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Minor Parties Approval Ceiling (`REQ-135`), Unified Party Approval (`computeUnifiedPartyApproval`, `engine.js`, `data.js`)
- **Problem Statement:**
  When the 25% approval cap (`REQ-135`) was introduced, all minor parties (Libertarian, Green, Constitution, Socialist) saw their national starting popularities/approvals jump immediately to 25.0% at the start of the game, rather than remaining at their authentic initial starting benchmarks (~1.8% for Libertarians and Greens, ~0.2% for Constitution and Socialists). In `computeUnifiedPartyApproval()` in `engine.js`, the unscaled raw formula (`genericBallotScore * 0.40 + presComponent * 0.20 + avgLeaderPop * 0.40...`) naturally produces ~45.6% for minor parties; when `unified = Math.min(unified, 25.0)` was applied, it clamped this down to 25.0%, artificially boosting every third party to 25% at game start.
- **Mechanical Specification:**
  - **Preserve Authentic Starting Benchmarks at Game Start:**
    - Minor party starting popularity/approval must anchor strictly to their authentic baseline benchmarks (`baseShare` / `lastPresidentialShare` in `data.js` $\approx 0.2\%–1.8\%$) at game start, rather than being elevated to 25.0%.
  - **25.0% Functions Strictly as an Upper Ceiling (Not a Starting Level or Floor):**
    - The 25.0% limit must operate solely as an upper ceiling cap during ongoing gameplay evolution (as a minor party expands state legislative footholds, recruits popular figures, and gains trust), never as an artificial floor or starting boost.
  - **Formula Calibration (`computeUnifiedPartyApproval` in `engine.js`):**
    - For minor parties (`!party.isMajor`), calculate approval scaled from their baseline share and localized ballot standing:
      ```javascript
      if (!party.isMajor) {
        const baselineShare = Math.max(0.2, party.baseShare || 1.5);
        const ballotRatio = partyBallot / baselineShare;
        const leaderFactor = (avgLeaderPop - 40) * 0.05;
        const scaledApproval = baselineShare * ballotRatio + leaderFactor + trustTilt * 0.1;
        unified = clamp(round(scaledApproval, 1), 0.1, 25.0);
      }
      ```
    - Ensures minor parties begin at their authentic single-digit / fractional starting benchmarks (~1.8% for Libertarian/Green, ~0.2% for Constitution/Socialist) while preserving the hard 25.0% maximum growth ceiling.

### REQ-140: Commissioned Race Polling ($1.0M) & Commissioned Polls Archive
- **Classification:** Small (Game Mechanics / Campaign Intelligence & UI)
- **Requested By:** User (Nov 14, 2026)
- **Dependencies / Related:** Live Campaign Polling & Consensus Forecasts (`REQ-133`), Campaign Phase Economy (`REQ-132`, `app.js`, `engine.js`)
- **Problem Statement:**
  On the "Live Campaign Polling & Consensus Forecasts" panel (category header "BATTLEGROUND INTELLIGENCE & POLLING CONSENSUS"), players view synthesized pundit consensus forecasts across Senators, House, Governor, and State Legislature chambers. However, party chairs lack the strategic capability to commission targeted internal campaign polls on specific races of interest to uncover detailed head-to-head margins, nor can they view past internal polls commissioned across the campaign.
- **Mechanical & UI Specification:**
  - **1. Commission Race Poll Action Button:**
    - Positioned prominently on the Live Campaign Polling panel header or action bar:
      `[ 📊 Poll a Race ($1.0M) ]`
    - **Cost & Requirements:**
      - Costs **$1.0M** from the party committee treasury (`game.treasury >= 1.0`).
      - If treasury $< \$1.0\text{M}$, button is disabled with tooltip: `"Requires $1.0M treasury funds to commission a poll."`
    - **Race Selection Flow (Modal / Dropdown):**
      - Clicking the button launches a selector modal categorized by active chambers:
        1. *U.S. Senate:* All contested races in the active Senate class (e.g. PA, TX, OH, FL).
        2. *U.S. House:* Contested battleground congressional districts or statewide delegations.
        3. *Gubernatorial:* All governor races on the ballot this cycle.
        4. *State Legislature:* Contested state legislative chambers.
    - **Poll Synthesis Engine:**
      - Upon selection and payment confirmation, generates a commissioned campaign poll record:
        - **Head-to-head vote shares:** Computed from underlying baseline lean, candidate fame/net approval, national environment tilt, state chapter presence, and cumulative ad spending to date.
        - **Realistic Survey Variance:** Incorporates sample variance ($\pm 3.0\%–4.0\%$ margin of error, $N=600$ likely voters).
        - **Result Notification Modal:** Immediately displays the newly commissioned poll card with top-line ballot numbers, candidate favorability, and a strategic takeaways blurb.
  - **2. 'Commissioned polls' Archive Button & History Viewer:**
    - Placed directly to the right of the poll commissioning button:
      `[ 📋 Commissioned polls (${count}) ]`
    - Displays the running tally of polls commissioned during the active campaign cycle.
    - Clicking the button opens the **Commissioned Polls Archive Drawer / Modal**:
      - Chronological list of every poll commissioned during this cycle (newest first).
      - Each entry displays:
        - Race & Office Title (e.g. `Pennsylvania Senate — Class I`, `Michigan Governor`).
        - Polling Date / Campaign Month (e.g. `Campaign Month 2 of 5`).
        - Candidate Matchup & Percentages (e.g. `Dem 49.1% vs. Rep 46.8% | Margin: Dem +2.3% | MoE ±3.5%`).
        - Trend Tracker: If the same race was polled in an earlier month, displays the shift (e.g. `Δ +1.8% since Month 1`).
      - Includes quick filter pills by chamber (`All`, `Senate`, `House`, `Governor`, `State Leg`).
  - **3. State Model Persistence:**
    - Stored in `game.commissionedPolls = []` array on the game state.
    - Persists across campaign turns (Months 1–5), resetting on the inter-cycle transition (`startNextCycle`).

### REQ-141: Candidate Ad Funding Diminishing Returns Polling Curve & Office-Tiered Costs ($1M House / $2M Senate & Gov)
- **Classification:** Small (Game Mechanics / Campaign Phase Candidate Triage & Math)
- **Requested By:** User (Nov 15, 2026)
- **Dependencies / Related:** Candidate Budget Triage (`allocateCandidateFunds`, `engine.js`, `app.js`, `REQ-19`)
- **Problem Statement:**
  Previously, allocating treasury funds to candidates lacked clear, predictable polling impact, was constrained by candidate complaint/happiness states, and applied flat increments. In competitive campaigns, chair investments must translate into tangible polling movement, chairs must have the strategic freedom to pump ad funds into any candidate (even those at 100% happiness) to improve their standing, and funding costs should reflect race scale ($1M House vs. $2M Senate and Governor).
- **Mechanical & Mathematical Specification:**
  - **1. Diminishing Returns Polling Curve (0% to +8.0%):**
    - Treasury dollars allocated to a candidate directly translate into points in the polls according to the following calibrated benchmark anchors:
      | Cumulative Treasury Spent ($M) | Polling Gain (% in Polls) | Marginal Cost per +1.0% Gain |
      | :---: | :---: | :---: |
      | **$0.0M** | **+0.0%** | Baseline |
      | **$1.0M** | **+1.0%** | $1.0M / pt |
      | **$3.0M** | **+2.0%** | $2.0M / pt |
      | **$7.0M** | **+3.0%** | $4.0M / pt |
      | **$15.0M** | **+4.0%** | $8.0M / pt |
      | **$31.0M** | **+5.0%** | $16.0M / pt |
      | **$63.0M** | **+6.0%** | $32.0M / pt |
      | **$150.0M** | **+7.0%** | $87.0M / pt |
      | **$500.0M** | **+8.0%** | $350.0M / pt |
  - **2. Piecewise Linear Interpolation Formula:**
    - The game linearly interpolates between adjacent anchors for any intermediate dollar amount:
      $$\text{PollingGain}(M) = P_a + \frac{M - M_a}{M_b - M_a} \times (P_b - P_a)$$
    - *Canonical Example:* Spending **$2.0M** falls halfway between $1.0M (+1.0%) and $3.0M (+2.0%):
      $$\text{PollingGain}(2.0) = 1.0 + \frac{2.0 - 1.0}{3.0 - 1.0} \times (2.0 - 1.0) = 1.0 + 0.5 = \mathbf{+1.5\%}$$
    - Implementation helper in `engine.js`:
      ```javascript
      function computeFundingPollingLift(dollarsMillions) {
        const spend = Math.max(0, Number(dollarsMillions) || 0);
        const BRACKETS = [
          { spend: 0, lift: 0.0 },
          { spend: 1, lift: 1.0 },
          { spend: 3, lift: 2.0 },
          { spend: 7, lift: 3.0 },
          { spend: 15, lift: 4.0 },
          { spend: 31, lift: 5.0 },
          { spend: 63, lift: 6.0 },
          { spend: 150, lift: 7.0 },
          { spend: 500, lift: 8.0 },
        ];
        if (spend <= 0) return 0.0;
        for (let i = 0; i < BRACKETS.length - 1; i++) {
          const a = BRACKETS[i];
          const b = BRACKETS[i + 1];
          if (spend >= a.spend && spend <= b.spend) {
            const frac = (spend - a.spend) / (b.spend - a.spend);
            return Number((a.lift + frac * (b.lift - a.lift)).toFixed(2));
          }
        }
        return 8.0;
      }
      ```
  - **3. Office-Tiered Allocation Unit Costs:**
    - Funding candidates costs different amounts based on the office:
      - **U.S. House races:** Cost **$1.0M** per funding allocation tranche (button: `+$1M`).
      - **U.S. Senate races:** Cost **$2.0M** per funding allocation tranche (button: `+$2M`).
      - **Gubernatorial races:** Cost **$2.0M** per funding allocation tranche (button: `+$2M`).
    - The Candidate Budget Triage action buttons dynamically reflect this unit cost (`+$1M` for House, `+$2M` for Senate/Governor), deducting the respective amount from treasury.
  - **4. Unrestricted Allocation (No Happiness Gating):**
    - The party chair is permitted to allocate funding to any candidate at any time during The Campaign Phase, **even if the candidate is 100% happy** (`happiness === 100`).
    - Funding is never disabled due to high candidate happiness or lack of active complaint requests; it is gated solely by available committee treasury funds (`game.treasury >= unitCost`).
  - **5. Direct Engine & UI Integration:**
    - Polling calculations across consensus forecast maps, commissioned race polls, and Election Night ballot shares add `computeFundingPollingLift(cand.allocated)` directly to candidate vote share.
    - Candidate Budget Triage table displays both total cumulative funding allocated and the current polling yield (e.g. `Allocated: $2.0M (+1.5% in polls)`).

### REQ-142: Campaign Action: Volunteer Drive (Replacing Caucus Retreat)
- **Classification:** Small (Game Mechanics / Campaign Phase Actions)
- **Requested By:** User (Nov 15, 2026)
- **Dependencies / Related:** Grand-Strategy Campaign Actions (`REQ-28`, `app.js`, `engine.js`, `VERSION_0.8.md`)
- **Problem Statement:**
  Previously, the Grand-Strategy Campaign Action `Caucus Retreat & Cajoling` cost $3M and 1 Action to repair Sitting Member Happiness (+10) and appease unendorsed nominees. Chairs need proactive, grassroots field organizing capabilities during the general campaign that allow targeted statewide voter mobilization rather than purely defensive Washington caucus appeasement.
- **Mechanical & UI Specification:**
  - **1. Replaces 'Caucus Retreat & Cajoling':**
    - The action card previously titled `Caucus Retreat & Cajoling` is permanently converted into **`Volunteer Drive`**.
  - **2. Card Header, Cost & Controls:**
    - **Header:** `COST: $3M · 1 ACTION`
    - **Action Title:** `Volunteer Drive`
    - **Flavor Text:**
      `"Deploy professional field organizers and neighborhood precinct captains to launch an intensive voter registration and volunteer mobilization drive in a key state."`
    - **Target State Dropdown:**
      A clean dropdown selector (`<select>`) listing all 50 states (+ DC), enabling the chair to target any specific state for the drive.
    - **Action Button:**
      `"Launch Volunteer Drive ($3M · 1 Action) →"`
  - **3. Discrete Outcome Distribution (500 to 10,000 Registered Voters):**
    - Executing the drive draws a random outcome from the calibrated probability distribution:
      | Registered Voters Gained | Probability | Cumulative Probability |
      | :---: | :---: | :---: |
      | **+500** | **1%** | 1% |
      | **+1,000** | **2%** | 3% |
      | **+1,500** | **4%** | 7% |
      | **+2,000** | **6%** | 13% |
      | **+2,500** | **10%** | 23% |
      | **+3,000** | **15%** | 38% |
      | **+3,500 (Peak)** | **20%** | 58% |
      | **+4,000** | **15%** | 73% |
      | **+4,500** | **10%** | 83% |
      | **+5,000** | **5%** | 88% |
      | **+6,000** | **2%** | 90% |
      | **+6,500** | **2%** | 92% |
      | **+7,000** | **1%** | 93% |
      | **+7,500** | **1%** | 94% |
      | **+8,000** | **1%** | 95% |
      | **+8,500** | **1%** | 96% |
      | **+9,000** | **1%** | 97% |
      | **+9,500** | **1%** | 98% |
      | **+10,000** | **2%** | 100% |
  - **4. Strict Information Obscurity Rule:**
    - Per studio design principles (`GAME_STYLE_GUIDE.md` Rule 7), **do not expose the exact mathematical percentages to the player**.
    - The UI copy and button tooltips state qualitative atmospheric vibes only (e.g. *"Mobilizes local grassroots volunteers and registers new voters across targeted precincts"*).
  - **5. Resolution & State Impact:**
    - Deducts **$3M** from `game.treasury` and **1 action** from `game.campaign.weeklyActionsLeft`.
    - Enrolls the drawn number of registered voters directly into the player party's registration rolls for the targeted state.
    - Displays a completion modal: `"Grassroots Mobilization Complete: Enrolled +[X,XXX] newly registered voters in [State]!"`
    - Strengthens the party's baseline voter turnout and downballot mobilization in that state for the upcoming general election.

### REQ-143: Targeted Inter-Party Realignment Transfers (Ideological Transfer Pairs)
- **Classification:** Small (Simulation Engine / Inter-Cycle Realignment & Bug Fix BUG-07)
- **Requested By:** User (Nov 15, 2026)
- **Dependencies / Related:** Inter-Cycle Electorate Realignment (`realignVotingBlocksBetweenElections`, `startNextCycle`, `engine.js`, `GAME_STYLE_GUIDE.md` Section 2)
- **Problem Statement:**
  When testing play as minor parties (specifically tested as the Greens), inter-cycle voter shifts failed to transfer voters between parties at the end of elections. Instead of shifting voters into or out of ideologically linked rival parties (e.g. Greens cannibalizing Democrats, Libertarians pulling from Republicans), voter blocks remained stagnant or were dumped into generic independent abstractions without direct inter-party movement.
- **Mechanical Specification:**
  - **1. Dedicated Inter-Party Transfer Partners:**
    Voter realignment between cycles does not happen in a generic void. When a party overperforms or underperforms their expected vote share, voters explicitly **leave or join specific parties** based on ideological adjacency:
    - **Green Party (`green`):** Primary transfer partner is `people` (Democratic Party). Gained voters leave Democrats; lost voters return to Democrats.
    - **Socialist Party (`socialist`):** Primary transfer partner is `people` (Democratic Party). Gained voters leave Democrats; lost voters return to Democrats.
    - **Libertarian Party (`liberty`):** Primary transfer partner is `heritage` (Republican Party). Gained voters leave Republicans; lost voters return to Republicans.
    - **Constitution Party (`constitution`):** Primary transfer partner is `heritage` (Republican Party). Gained voters leave Republicans; lost voters return to Republicans.
    - **Custom Parties:** Transfer voters directly with their chosen base template/rival archetype.
    - **Major Parties (`people` $\longleftrightarrow$ `heritage`):** Exchange swing voters directly between each other, modulated by third-party draws.
  - **2. Active Realignment Calculation for Minor Parties:**
    - In `realignVotingBlocksBetweenElections(game, outcome)` in `engine.js`:
      - Accurately calculate the player's actual popular vote share on Election Night when playing as any minor party (Greens, Libertarians, Constitution, Socialists, or Custom), avoiding hardcoded 1.4% / 1.8% fallbacks.
      - Apply the 1/4th Shift Rule ($\Delta \text{Share} = \frac{\text{Actual} - \text{Expected}}{4}$ of represented voters).
      - Directly adjust party rolls: for a Green gain of $+V$ voters, deduct $V$ from `aff.people.representedVoters` and add $V$ to `aff.thirdParty.byParty.green` (and `aff.thirdParty.representedVoters`).
  - **3. Realignment Transition UI & Autopsy Summary:**
    - The post-election realignment transition screen explicitly presents the voter exchange:
      `[Party Name] gained +[X] voters (drawn directly from [Rival Party])!`

### REQ-144: State-by-State Electorate Realignment Engine (3rd Party State Brand Consolidation)
- **Classification:** Small (Game Mechanics & Simulation Engine / Inter-Cycle Realignment)
- **Requested By:** User (Nov 15, 2026)
- **Dependencies / Related:** Inter-Party Realignment Transfers (`REQ-143`), State Voter Model (`voterModel.states`, `engine.js`, `addVotersToModel`, `GAME_STYLE_GUIDE.md`)
- **Problem Statement:**
  Previously, electorate realignment was computed only at the national aggregate level, spreading voter shifts uniformly across the entire nation. This prevented minor and third parties (such as the Green Party or Libertarians) from pursuing concentrated geographic strategies—such as focusing organizing, surrogate tours, and Volunteer Drives on single states like Maine, Vermont, Oregon, or Alaska—because localized electoral success was diluted into national averages rather than consolidating into deep state-level registration footprints.
- **Mechanical Specification:**
  - **1. Per-State Realignment Loop across 50 States (+ DC):**
    - In `realignVotingBlocksBetweenElections(game, outcome)` in `engine.js`:
      - Iterate through each individual state record in `voterModel.states`:
        - Evaluate the state's non-independent partisan voter pool: $N_{state} = \sum \text{PartisanVoters}_{state, party}$.
        - Calculate each party's state baseline expected share: $\text{Expected}_{state, party} = \frac{\text{PartisanVoters}_{state, party}}{N_{state}} \times 100$.
        - Evaluate the party's actual election performance in that state: $\text{Actual}_{state, party}$ (drawn from state-specific presidential returns, Senate returns, Governor returns, or legislative popular vote).
        - Calculate the state-level difference: $\text{Diff}_{state, party} = \text{Actual}_{state, party} - \text{Expected}_{state, party}$.
        - Apply the **1/4th Shift Rule** locally:
          $$\Delta \text{Share}_{state, party} = \frac{\text{Diff}_{state, party}}{4}$$
        - Translate to represented voters in that state:
          $$\Delta \text{Voters}_{state, party} = \text{round}\left(\frac{\Delta \text{Share}_{state, party}}{100} \times \text{state.representedVoters}\right)$$
  - **2. Localized Inter-Party Exchanges:**
    - Transfer voter deltas within the state's own demographic and partisan records (`state.affiliations`):
      - If Greens overperform in Oregon by $+2.0\%$ (yielding $+0.5\%$ voter shift $\approx +15,000$ Oregon voters), deduct $15,000$ voters from Oregon's Democratic affiliation pool and add $15,000$ voters to Oregon's Green affiliation pool.
      - If Libertarians overperform in New Hampshire, deduct voters from New Hampshire's Republican pool and credit them to Libertarians.
  - **3. Persistent Regional Brand Building:**
    - State-level voter gains persist permanently into subsequent cycles (`voterModel.states`), increasing the party's baseline registration in that state.
    - Enables emergent third-party strongholds: over consecutive cycles of focused campaign effort, a third party can grow from a single-digit fringe into a double-digit regional power (e.g. 2% $\to$ 6% $\to$ 14% $\to$ 22%+), enabling viable downballot legislative majorities and authentic geographic footholds.
  - **4. Complete Accounting Balance:**
    - National affiliation summaries (`voterModel.affiliations`) dynamically reconcile as the exact sum of all state-level affiliations across all 50 states (+ DC), maintaining total represented voter integrity (155M scale).

### REQ-145: Dynamic GOTV Voter Registration Growth (Removal of Flat 3% Annual Growth)
- **Classification:** Small (Game Mechanics & Simulation Engine / Electorate Growth & GOTV)
- **Requested By:** User (Nov 15, 2026)
- **Dependencies / Related:** Electorate Growth (`startNextCycle`, `advanceCycle`, `engine.js`), Campaign Action Volunteer Drive (`REQ-142`), Inter-Cycle Realignment (`REQ-143`, `REQ-144`, `addVotersToModel`)
- **Problem Statement:**
  Previously, the game featured an artificial flat annual electorate growth rate of $+3.0\%$ per year ($+6.09\%$ every two-year cycle), which automatically added voters into the Independent category on inter-cycle turnover. This automatic population growth had zero connection to player organizing effort or campaign mechanics, while field actions lacked the authentic ability to expand the overall voter base by bringing disaffected non-voters into the registered electorate.
- **Mechanical Specification:**
  - **1. Complete Removal of Flat Electorate Growth Rate:**
    - In `engine.js` (e.g. line 5002 in `advanceCycle` / `startNextCycle`):
      - Remove the automatic $+6.09\%$ flat expansion multiplier (`stGrowth = Math.round((st.representedVoters || 0) * 0.0609)`).
      - Electorates no longer passively expand automatically on every cycle transition.
  - **2. GOTV Operations Drive Total Registration Growth:**
    - Ground organizing operations—specifically **Get Out The Vote (GOTV)** drives, voter registration operations (such as the Campaign Phase `Volunteer Drive` `REQ-142`), and local chapter field recruitment—serve as the **primary mechanism for total voter registration growth**.
    - When a GOTV operation is executed:
      - Newly enrolled voters represent previously unregistered or low-propensity citizens entering the registered electorate.
      - They are credited directly to the party's voter rolls AND expand total state registered voters (`state.registeredVoters += newVoters`, `state.representedVoters += newVoters`, `state.cvap += newVoters`).
      - **They do NOT take or cannibalize voters from other political parties.**
  - **3. Distinction Between Realignment and GOTV Growth:**
    - **Inter-Election Realignment (`REQ-143`, `REQ-144`):** Transfers existing, active voters *between* parties (e.g. Greens drawing from Democrats, Libertarians drawing from Republicans) based on election night over/under-performance.
    - **GOTV Operations (`REQ-145`):** Expands the *total pie* of registered voters by enrolling new voters into the party's rolls without depleting rival parties.
  - **4. State & National Accounting Reconciliation:**
    - Whenever GOTV operations add voters, both state-level records (`voterModel.states[stateId]`) and national aggregate tallies (`voterModel.representedVoters`, `voterModel.affiliations[partyId]`) scale upward by the exact count of new registrants.


---

## VERSION 0.15.6 (Minor Release — Nov 17, 2026)

# Coalition Builder: Party Chair — Version 0.15.6

Version 0.15.6 packages three targeted simulation, data, and UI updates—fixing post-election faction membership conversion, resolving third-party state voter registration rendering, and introducing individually researched Party Happiness ratings for all 100 sitting U.S. Senators.

### Implemented in 0.15.6

1. **1/4th Vote-to-Membership Faction Realignment Engine (`engine.js`, `app.js`):**
   - Overhauled `realignVotingBlocksBetweenElections()` to shift exactly $\frac{1}{4}\text{th}$ of the difference between actual state votes cast and current registered party members ($\Delta = \text{Round}\left(\frac{\text{Actual Votes} - \text{Current Members}}{4}\right)$; $\frac{3}{4}\text{ths}$ for historic White House realignments), removing the restrictive `REALIGNMENT_PARTNERS` and `REALIGNMENT_FACTION_MAP` locks.
   - Gains and losses distribute proportionally across all of a party's state factions, with net state deltas balanced against the 9 Independent swing factions (`swg_*`) to preserve strict **0 variance** across all 51 jurisdictions on the 155M represented-voter scale.
   - Fixed `factionsForParty()` typo (`libertarian` $\to$ `liberty`) and updated `factionsTabMarkup()` in `app.js` plus Coalition Accord checks in `engine.js` to read live `voterModel.factions` counts rather than static `f.targetVoters`.

2. **State-by-State Third-Party Voter Registration Fix (`app.js`, `engine.js`):**
   - Replaced the obsolete v0.5 proxy formula (`rawOther * 0.45` / `rawOther * 0.40`) in `renderStateVoterRegistrationTable()` with dynamic faction and affiliation resolution (`getPartyVoters`), ensuring Socialist and Constitution Party voters display accurate, non-zero per-state totals reconciled with national rolls.
   - Fixed `sumOther` in `realignVotingBlocksBetweenElections()` to include `unaffiliated` factions alongside `none`, ensured Cycle 0 initialization populates `st.affiliations.socialist` and `st.affiliations.constitution`, reconciled minor-party state affiliations in `startNextCycle()`, and added `constitution`/`socialist` to map district hover breakdowns.

3. **Individual U.S. Senator Party Happiness Calibration (`scenario-2028.js`):**
   - Added `SITTING_MEMBER_HAPPINESS_OVERRIDES` (exported on `window.PartyChairData.POLITICIAN_HAPPINESS_OVERRIDES`) providing unique, research-backed `0–100` baseline Party Happiness ratings for all **100 sitting U.S. Senators** in the 120th Congress / 2028 scenario roster, replacing uniform `68`/`60` defaults.
   - Calibrated ratings against 119th Congress party-unity voting records, Senate leadership positions, and post-November 2026 caucus dynamics—placing 6 high-friction / maverick Senators (`Lisa Murkowski: 32`, `John Fetterman: 35`, `Bill Cassidy: 36`, `Rand Paul: 38`, `Bernie Sanders: 39`, `Adam Hamilton: 40`) inside the `<= 40` *Court Politician* gate while keeping all Senators above the `< 30` spontaneous turn-1 bolt threshold.
   - Wired override lookup into the Senate, Governor, and House loops inside `buildSittingMemberRoster()` for seamless future expansion to Governors and House Representatives.

4. **Version & Save Compatibility (`package.json`, `engine.js`, `app.js`):**
   - Incremented version to **`0.15.6`** and `SAVE_KEY` to **`partyChairGame.save.v15.6`** with full backward-compatible migration from `partyChairGame.save.v15.5` and all prior save keys.


---

## VERSION 0.15.7 (Minor Release — Nov 17, 2026)

# Coalition Builder: Party Chair — Version 0.15.7

Version 0.15.7 extends the individual Party Happiness calibration system to all **50 sitting U.S. Governors** in the 2028 scenario baseline.

### Implemented in 0.15.7

1. **Individual U.S. Governor Party Happiness Calibration (`scenario-2028.js`):**
   - Populated `SITTING_MEMBER_HAPPINESS_OVERRIDES` (exported on `window.PartyChairData.POLITICIAN_HAPPINESS_OVERRIDES`) with unique, research-backed `0–100` Party Happiness ratings for all **50 sitting U.S. Governors** keyed by `governor:ST`, replacing flat `68`/`60` faction-tier defaults.
   - Keyed by `governor:ST` to guarantee zero collision for dual-listed figures (`Tommy Tuberville` AL Senate `63` vs. AL Governor `64`; `Marsha Blackburn` TN Senate `65` vs. TN Governor `66`).
   - Calibrated ratings against 2025–2026 DGA/RGA executive committee leadership (`Andy Beshear` 84, `Tim Walz` 82, `Maura Healey` 81, `Sarah Huckabee Sanders` 79, `Tate Reeves` 76, `Greg Gianforte` 75), November 2026 gubernatorial results, and documented state-level intra-party friction—placing 2 high-friction anti-MAGA/moderate Republicans (`Phil Scott: 31` in VT, `Click Bishop: 39` in AK) inside the `<= 40` *Court Politician* gate while keeping all Governors above the `< 30` spontaneous turn-1 bolt threshold.

2. **Version & Save Compatibility (`package.json`, `engine.js`, `app.js`):**
   - Incremented version to **`0.15.7`** and `SAVE_KEY` to **`partyChairGame.save.v15.7`** with full backward-compatible migration from `partyChairGame.save.v15.6`, `v15.5`, `v15.4`, and all prior save keys.


---

## VERSION 0.15.8 (Minor Release — Nov 17, 2026)

# Coalition Builder: Party Chair — Version 0.15.8

Version 0.15.8 completes the individual Party Happiness calibration across the entire sitting federal and state executive roster—adding unique, researched `0–100` Party Happiness ratings for all **435 sitting U.S. House Representatives** (bringing total individually calibrated officeholders to **585/585**: 100 Senators + 50 Governors + 435 Representatives).

### Implemented in 0.15.8

1. **Individual U.S. House Representative Party Happiness Calibration (`scenario-2028.js`):**
   - Populated `SITTING_MEMBER_HAPPINESS_OVERRIDES` (exported on `window.PartyChairData.POLITICIAN_HAPPINESS_OVERRIDES`) with unique `0–100` Party Happiness ratings for all **435 sitting U.S. House Representatives** keyed by `house:ST-N`, replacing uniform `68`/`60` faction-tier defaults.
   - Calibrated ratings against 120th Congress House leadership transitions (Speaker-designate `Hakeem Jeffries: 86`, `Katherine Clark: 85`, `Pete Aguilar: 85`, `Ted Lieu: 84`, `Joe Neguse: 83`, `Suzan DelBene: 83`; House Minority Leader `Jim Jordan: 83`, `Lisa McClain: 81`, `Tom Emmer: 80`, `Andy Harris: 78` vs. defeated/outgoing leaders `Steve Scalise: 53` and `Mike Johnson: 52`), party-unity/caucus memberships (Blue Dog Coalition, Problem Solvers Caucus, New Democrat Coalition, Congressional Progressive Caucus, The Squad, House Freedom Caucus, RG2, Main Street Partnership), and district-level cross-pressure across all 53 red-district Democrats and remaining GOP moderates.
   - Places 14 high-friction Representatives (8 Democrats, 6 Republicans) inside the `<= 40` *Court Politician* gate (`Marie Gluesenkamp Perez: 34`, `Henry Cuellar: 35`, `David Joyce: 36`, `Don Davis: 38`, `Rashida Tlaib: 38`, `Nick LaLota: 38`, `Vicente Gonzalez: 39`, `Richard Ojeda: 39`, `Andrew Garbarino: 39`, `Maria Elvira Salazar: 39`, `Adam Gray: 40`, `Ilhan Omar: 40`, `Chris Smith: 40`, `Jeff Hurd: 40`), with 0 Representatives below `< 30`.

2. **Version & Save Compatibility (`package.json`, `engine.js`, `app.js`):**
   - Incremented version to **`0.15.8`** and `SAVE_KEY` to **`partyChairGame.save.v15.8`** with full backward-compatible migration from `partyChairGame.save.v15.7`, `v15.6`, `v15.5`, `v15.4`, and all prior save keys.


---

## VERSION 0.15.9 (Comprehensive Minor Release — Nov 17, 2026)

# Coalition Builder: Party Chair — Version 0.15.9

Version 0.15.9 delivers the **Third-Party Ascent & Multi-Party Democracy Expansion**—implementing all 19 specifications (`REQ-176` through `REQ-194`) from `VERSION_0.15.9_DESIGN.md`. It replaces binary two-party assumptions across the electoral lifecycle with a 5-stage institutional progression ladder, Duverger's Law strategic voting and state electoral reform systems, Polling Average and 50-state Legislature forecasts, post-election Kingmaker caucuses, Fusion cross-endorsement ballot lines, 12th Amendment House delegation contingent elections, and Big-Tent ideological crossroads with founding purist backlash.

### Implemented in 0.15.9 (`REQ-176` – `REQ-194`)

1. **5-Stage Institutional Ascent Ladder & Focus Slot Scaling (`REQ-176` – `REQ-180` | `v07-scaffolding.js`, `engine.js`, `app.js`, `data.js`):**
   - **5-Rung Progression (`REQ-176`):** Replaced the binary 20% major-party cliff with 5 persistent institutional tiers (`game.partyTiers`): Tier 1 *Fringe* (`<2%`, 3 focus slots), Tier 2 *Ballot-Qualified Minor* (`2%–5%` or sustained multi-state ballot access, 3 focus slots), Tier 3 *Federally Recognized Party* (`>=5%` Pres, 5 focus slots), Tier 4 *Debate-Qualified Contender* (`>=15%` polling, 5 focus slots), and Tier 5 *Major Party* (7 focus slots) unlocked via three distinct paths (`>=20%` Presidential vote, midterm critical mass of `>=35` House seats / `>=8` Senators / `>=5` Governors, or eclipsing an adjacent major party). Replaced hardcoded focus slot checks with `getMaxFocusSlots(game, partyId)` and added the in-universe Institutional Status Badge to the header.
   - **Media Blackout & Breakthrough (`REQ-177`):** Tier 1–3 parties face earned-media multipliers and wave momentum caps (`getMediaVisibilityProfile`); crossing Tier 4 shatters the broadcast blackout permanently.
   - **Tier 2 Regional Chapter Momentum (`REQ-178`):** Building contiguous state chapters across census regions triggers Regional Organizing Waves.
   - **Tier 3 FEC Matching Funds & Ballot Retention (`REQ-179`):** Qualifying parties receive passive cycle treasury infusions (`computeFecMatchingFunds`) and automatic ballot retention in states polling `>=2.0%` (`applyAutomaticBallotRetention`).
   - **Tier 4 Debate Stage Event & Allied Super PAC Gate (`REQ-180`):** Crossing 15% national polling triggers the one-time *Presidential Debate Stage* milestone event (`checkTier4Milestones`, `resolveDebateStageEvent`) and seeds 1–2 fledgling allied Super PACs with \$5M–\$10M reserves (`seedTier4SuperPacs`).

2. **Forecast Intelligence Expansion — Polling Average & State Legislatures (`REQ-181`, `REQ-182` | `engine.js`, `app.js`, `styles.css`):**
   - **Polling Average Projection Model Tab (`REQ-181`):** Added a 5th projection model (`data-forecaster-source="polling"`) rendering live simulation shares from `supportByState`, continuous margin-intensity shading, per-party tooltips, and a national polling scoreboard bar.
   - **50-State Legislature Forecasts (`REQ-182`):** Extended `buildForecasters()` and `estimateRaceMarginInternal()` to evaluate `stateLeg:<STATE>` across all 50 states for Consensus, Cooked, Sallow, Upside, and Polling Average models, accompanied by the 4th chamber selector (`State Legislatures (50 States)`), legislative scoreboard, and comparison table filter.

3. **Duverger's Law & State Electoral Systems (`REQ-183` – `REQ-186` | `engine.js`, `app.js`, `data.js`):**
   - **Strategic Voting Defection (`REQ-183`):** Implemented `computeStrategicVotingDefection()` and `applyDuvergerDefectionToShares()` applying 40%–65% Election-Day wasted-vote defection below the 16.5% viability threshold in plurality contests, routed to the nearest major party via `REALIGNMENT_PARTNERS` or ideological axis distance.
   - **Shattering the Ceiling & Regional Spillover (`REQ-184`):** Crossing `>=16.5%` share or winning Governor, Senate, or `>=2` House seats in a state permanently collapses local defection to 0% (`game.viabilityBreakthroughs`) and spreads regional relief via `OVERLAPPING_REGIONS` (halving defection severity and lowering neighboring thresholds to 11%).
   - **State Electoral Systems (`REQ-185`):** Added per-state electoral rules (`game.stateElectoralSystems`) with Alaska starting 2028 on Ranked-Choice Voting (`rcv`), plus Approval Voting (`resolveApprovalVoting`) and Proportional Representation for states with `>=5` House seats (`allocateProportionalSeats`, 5% natural threshold)—all exempting races from Duverger's penalty (0% defection) and displaying compact badges in the State Directory.
   - **Temporary Inter-Cycle Electoral Reform Prototype (`REQ-186`):** Added `rollInterCycleElectoralReform()` in `startNextCycle()` with a 60% trigger chance and weighted RCV/Approval/Proportional rollout paired with a clean dismissible popup modal (annotated as temporary prototype pending `TBD-02`).

4. **Post-Election Kingmaker Caucuses & Fusion Voting (`REQ-187` – `REQ-189` | `engine.js`, `app.js`, `data.js`):**
   - **Federal & State Hung Chamber Kingmakers (`REQ-187`, `REQ-188`):** Added `detectHungChambers()` flagging hung U.S. House (`<218`), U.S. Senate (`<51`), and state legislative chambers where a third-party caucus holds the balance of power. Players negotiate Confidence-and-Supply compacts via modal (`resolveKingmakerNegotiation`) for Committee Gavels, Electoral Reform & Ballot Access bills, or Stronghold State Funding—with purist happiness backlash if backing an ideologically distant major party.
   - **Fusion Voting & Cross-Endorsement Ballot Lines (`REQ-189`):** Unlocked at Tier 2+, minor parties can offer cross-endorsement ballot lines to friendly major-party nominees in Senate, Governor, or House races (`offerFusionEndorsement`, `resolveFusionElectionOutcomes`) in exchange for Policy Pledges, earning State Ballot Retention Credit, registration growth, and legislative leverage.

5. **Multi-Party Electoral College & 12th Amendment Contingent Elections (`REQ-190`, `REQ-191` | `engine.js`, `app.js`):**
   - **Multi-Party EV Accounting & Deadlock Detection (`REQ-190`):** Tracks multi-party Electoral College totals (`evByParty`), detects sub-270 deadlocks (`contingentElectionRequired: true`), and calculates the constitutional 50-state U.S. House delegation tally (`computeHouseDelegationTally`, 1 vote per state, 26 needed).
   - **12th Amendment Contingent Election Brokering (`REQ-191`):** Fires an Election Night brokering modal (`resolveContingentElection`) letting a pivotal Chair endorse a presidential ticket in exchange for Federal Cabinet posts (`cabinet_state`, `cabinet_treasury`, `cabinet_defense`, `cabinet_ag`), binding governing platform planks, or multi-state electoral reforms.

6. **Big-Tent Inflection Point, Party Doctrine & Purist Backlash (`REQ-192` – `REQ-194` | `engine.js`, `app.js`, `styles.css`):**
   - **Founding Faction Tagging & Inflection Trigger (`REQ-192`):** Tracks founding factions and `puristVanguardFactionId` for minor/custom parties; `checkIdentityCrisisTrigger()` fires when non-founding swing factions reach `>=65%` share or total party voters cross `>=7.5M` with at least one admitted swing faction.
   - **Ideological Crossroads & Permanent Party Doctrine (`REQ-193`):** Interactive crossroads modal choosing *Moderate & Professionalize* (`doctrine: 'big_tent'`, -60% cohabitation drag, institutional donors, +9 Independent Trust) vs. *Stay Pure / Populist Vanguard* (`doctrine: 'vanguard'`, +9 Supporter Trust, grassroots surge, capped suburban appeal), displaying a permanent Party Doctrine Badge in the Factions Tab and Header.
   - **"Sellout" Backlash & Splinter Fourth-Party Threat (`REQ-194`):** Choosing `big_tent` inflicts an immediate -28 happiness shock and 2-turn bolt ultimatum (`frictionIndex: 100`) on the purist vanguard faction; failing to appease spawns a named Splinter Fourth Party in `game.activeSplinters`.

7. **QA Hardening, Save Migration & Release Packaging (`package.json`, `engine.js`, `v07-scaffolding.js`, `app.js`, `build.js`, `scripts/test-v0159-integration.cjs`):**
   - Fixed seed-dependent `buildStartingBallotAccess()` calendar year lookup (`startYear = 2028`) and Tier 2 sustained ballot check so all minor parties deterministically begin Turn 1 of 2028 at Tier 1 (Fringe).
   - Incremented version to **`0.15.9`** and `SAVE_KEY` to **`partyChairGame.save.v15.9`** with seamless backward-compatible migration from `partyChairGame.save.v15.8`, `v15.7`, and all earlier saves, cleanly initializing all v0.15.9 state structures on legacy saves.
   - Verified 109/109 assertions passing in `scripts/test-v0159-integration.cjs` and recompiled `dist/release/Coalition Builder - Party Chair.exe`.


---

## VERSION 0.16.0 (Major Landmark Release — Nov 17, 2026)

# Coalition Builder: Party Chair — Version 0.16.0

Version 0.16.0 delivers the complete **Party Systems Evolution Engine (`MAS-01`)** across all four staged implementation phases—transforming *Coalition Builder: Party Chair* from a fixed 2028 landscape into a living, multi-decade political simulator spanning the 7th, 8th, and subsequent Party Systems. Built cleanly across five modular files (`party-systems-data.js`, `party-systems-engine.js`, `party-systems-ui.js`, `party-systems-coalition.js`, and `party-systems-robots.js`), it implements all 26 Historical & Emergent Party Systems, the 41-issue dynamic swap pipeline, Independent Presidential campaigns, structural party-spawning eras, Flagship Era #18 (Nationwide MMP & Coalition Bargaining), and Flagship Era #16 (Robots Become Citizens on the authorized 310M+ dual-substrate electorate).

### Implemented in 0.16.0 (`MAS-01: The Party Systems Evolution Engine`)

1. **Phase 1 — Core State Machine, 41-Issue Swap Pipeline, Independent Presidential Campaigns & UI Shell (`party-systems-data.js`, `party-systems-engine.js`, `party-systems-ui.js`):**
   - **Strict Eligibility Floors & Escalating Biennial Transition Roll:** Campaigns start in the 7th Party System (2028). No 8th Party System can trigger before **2040**, and no 9th+ Party System can trigger until at least **30 years** after the preceding era's start year. Transition probability rolls once per 2-year cycle starting at `10%` and escalating by `+5%` per cycle up to `100%`.
   - **Weighted Selection Pool & No-Repeat Invariant:** Evaluates all 26 eras across Groups A–E using deterministic weights (Normal Group D = Weight 1, Triggered Groups A/B/C = Weight 3, Follow-Up Group E = Weight 5) and permanently retires occurred eras.
   - **Dynamic 41-Issue Platform Swap Pipeline:** Clamps the active platform strictly at 41 issues. Transitioning 7th $\to$ 8th swaps $N$ (`5–10`) paired baseline issues for era-exclusive issues; 9th+ transitions randomly sunset $N$ active issues for living historical continuity. Initializes new party stances within $\pm 2$ of category/overall averages and automatically replaces sunsetted faction Key Issues in the same category.
   - **Independent Presidential Candidates Subsystem:** Evaluates every presidential cycle (20% baseline cadence) across 4 polling tiers and 4 candidate archetypes with two-axis dual-party siphoning and direct Electoral College victory support.
   - **Atmospheric UI Suite:** Persistent top-bar Roman numeral Era Badge, qualitative Era Dossier modal (strictly zero technical leaks), fullscreen Historic Realignment Chronicle modal, and permanent Historical Party Systems Timeline in History.

2. **Phase 2 — 16 Standard Modifier & Political Realignment Eras (`party-systems-engine.js`, `engine.js`, `app.js`):**
   - Shipped all 16 modifier-driven eras across Triggered Groups A/B/C (#1 Anti-Extremist Coalition, #4 Landslide Realignment, #5 Independent Surge, #6 Left-Wing Replacement, #7 Right-Wing Replacement, #8 Ideologies Cool) and Normal Group D (#9 5th Great Awakening, #11 Generational Succession Crisis, #12 Digital Syndicate & Influencer Politics, #13 Green Transition Crucible, #14 Tripartite Corporatist Compact, #15 The AI Boom, #19 Charismatic Movement Era, #20 Permanent Emergency Cycle, #21 Metro League vs. Heartland Compact, #26 Post-*Citizens United* Era).

3. **Phase 3 — 8 Structural Party-Spawning & Group E Follow-Up Eras (`party-systems-data.js`, `party-systems-engine.js`, `engine.js`, `app.js`):**
   - **Structural Party-Spawning Eras:** #2 *The Moderate Party* (4 dedicated factions, mass sitting-official defections, Chair switch), #3 *The 6-Party System* (Constitution $\to$ MAGA Party rename, 6-way electorate fracture, cross-party coalition requirement), #10 *Regional Parties Emerge* (6 territorial powerhouses dominating home regions), and #17 *Ecological Collapse* (Green Party +25% surge, 4 dedicated eco factions, $0M chapters, 3x small-dollar yields).
   - **Group E Follow-Up Eras (Weight = 5):** #22 *Neo-Federalist Reunion* ($\ge 35$ yrs after #10, cross-regional merger actions), #23 *Secular Enlightenment Revival* ($\ge 30$ yrs after #9), #24 *Human-Verified Backlash* ($\ge 35$ yrs after #15, 1.75x analog multipliers), and #25 *Planetary Thermostat Era* ($\ge 40$ yrs after #13 or #17).

4. **Phase 4 — Flagship Era #18 (*The Party Coalition Era*) (`party-systems-coalition.js`, `party-systems-engine.js`, `party-systems-ui.js`, `engine.js`, `app.js`, `styles.css`):**
   - **Trigger & Overnight 2-Faction Party Cap:** Triggers (Weight = 3) when $\ge 6$ distinct parties hold $\ge 1$ seat in the U.S. House or Senate. Every party retains its largest faction plus the closest ideologically aligned among its next 3 largest; expelled factions pair with another expelled faction within $\le 1.5$ points on both fiscal and social axes (or an eligible non-party faction within $\le 1.5$ bounds; solo remainder forms a standalone party), preserving exact represented-voter totals.
   - **Informed Player Party Selection Modal (`party_select`):** Displays every surviving and newly formed party with brand colors, constituent factions, exact post-breakup voter totals on the 155M scale, and projected House/Senate seat baselines.
   - **Nationwide Mixed-Member Proportional (MMP) Resolution:** Allocates federal House (435) and Senate (100) seats proportionally via compensatory party-list top-ups above the MMP national threshold (`2%–5%`), persisting across subsequent stacked eras.
   - **Post-Election Coalition Bargaining Loop & Stability Meter (0–100):** Opens the National Coalition Bargaining Modal after each election to consolidate all parties into 3 to 4 unified nationwide coalitions. Chairs may **Anchor a Coalition** (inviting partners for a 218+ House majority & binding Policy Accords), **Join an Invited Coalition** (trading concessions for cabinet/committee portfolios), or **Sit in Official Opposition** (`+15%` base enthusiast turnout, zero platform compromise). Violating partner red lines drains the live Coalition Stability Meter HUD; dropping below 25 triggers a **Mid-Cycle Fracture Crisis** modal with walkout & snap-election stakes. Introduces 7 coalition-governance issue swaps.

5. **Phase 4 — Flagship Era #16 (*Robots Become Citizens*) (`party-systems-robots.js`, `party-systems-engine.js`, `party-systems-ui.js`, `engine.js`, `app.js`, `styles.css`):**
   - **Predecessor Trigger & Authorized 310M+ Scale Exception (`GAME_STYLE_GUIDE.md` Rule 1):** Emerges (Weight = 5) $\ge 40$ years after Era #15 (*The AI Boom*). Enacts the sole authorized expansion beyond the 155M human electorate, adding **155,000,000 synthetic citizens** proportionally across all 51 jurisdictions for a **~310M+ total represented electorate** (`155M human + 155M synthetic`).
   - **Synthetic Turnout Invariant & Proportional Robotic Seats:** Synthetic voters exhibit **zero turnout variance (100% algorithmic participation)** and elect proportional federal delegations across four dedicated Robot Political Parties (~25% synthetic vote each, 2 core synthetic factions per party):
     1. **Silicon Vanguard Party** (`#06B6D4` Electric Cyan) — *Compute Maximalists* & *Frontier Architects*.
     2. **Synth-Solidarity Union** (`#D97706` Amber Copper) — *Chassis Labor Syndicate* & *Universal Upkeep Advocates*.
     3. **Harmonic Integration Party** (`#8B5CF6` Soft Violet) — *Civic Assimilationists* & *Constitutional Bridge-Builders*.
     4. **Sovereign Lattice Party** (`#4338CA` Deep Slate-Indigo) — *Cognitive Separatists* & *Distributed Protocol Purists*.
   - **Player Chair Choice & Robot Themes:** Dedicated Robot Party Selection Modal (`robot_select`) lets the player remain Chair of their human party or switch to chair any of the 4 Robot Parties with dedicated visual accent themes. Introduces 10 synthetic civil-rights issue swaps.

6. **Save Migration, Verification & Release Packaging (`package.json`, `engine.js`, `app.js`, `index.html`, `build.ps1`, `build.js`, `scripts/test-mas01-phase4.cjs`):**
   - Incremented version to **`0.16.0`** across `package.json`, `engine.js`, `app.js`, and `build.js`.
   - Bumped `SAVE_KEY` to **`partyChairGame.save.v16.0`** with seamless backward-compatible migration from `partyChairGame.save.v15.9`, `v15.8`, and all prior save keys, including mid-modal save/reload hydration and multi-decade cross-era stacking continuity.
   - Verified comprehensive flagship test suite `scripts/test-mas01-phase4.cjs` and rebuilt the self-contained Windows executable (`dist/release/Coalition Builder - Party Chair.exe`).


---

## VERSION 0.16.1 (Minor Release — Nov 18, 2026)

# Coalition Builder: Party Chair — Version 0.16.1

Version 0.16.1 delivers the complete **Presidential Primaries, Ballot Access, Candidate Vetting, Multi-Cycle Drift & Real-Time Election Night Decision Desk** expansion across all 29 requirements (`REQ-195` through `REQ-223`).

Per workspace protocol, all shipped requirements are categorized primarily by **Size** (`Massive`, `Huge`, `Large`, `Medium`, `Small`, `Tiny`):

### Summary Inventory by Size
| Size | Count | Requirement IDs | Core Subsystems |
| :--- | :---: | :--- | :--- |
| **Massive** | **0** | — | — |
| **Huge** | **0** | — | — |
| **Large** | **0** | — | — |
| **Medium** | **8** | REQ-197, REQ-198, REQ-199, REQ-201, REQ-202, REQ-203, REQ-221, REQ-223 | Primaries Field, Phased Calendar, Delegates, Conventions, VP Selection, Ballot Drops, Broadcast Desk UI |
| **Small** | **21** | REQ-195, REQ-196, REQ-200, REQ-204, REQ-205, REQ-206, REQ-207, REQ-208, REQ-209, REQ-210, REQ-211, REQ-212, REQ-213, REQ-214, REQ-215, REQ-216, REQ-217, REQ-218, REQ-219, REQ-220, REQ-222 | Incumbent Triggers, Step-Aside, Chair Primaries, Polling Uncertainty, Shy Bias, Statutory Access, Petitions, Audits, Legal Defense, Recounts, Statehouse Voting Laws, Vetting Action, Scandal Dilemma, Certified Drift, Demographic Migration, Organizing Feedback, Autopsy, Softmax, Tier Caps, Closing Times, 13-Tier Caller |
| **Tiny** | **0** | — | — |
| **Total** | **29** | **REQ-195 through REQ-223** | **Full v0.16.1 Delivery** |

---

### 1. Medium Requirements (8 Updates)

1. **REQ-197: Presidential Primary Field & Candidate Generation Engine (Medium | `presidential-primaries.js`):**
   - Implemented dynamic 3–5 contender presidential primary fields for open-seat and contested cycles (2032+). Each contender generates with 10 platform pillar stances derived from faction alignments, home-state affinity (+8.0% in home state, +3.0% in same region), base fame, approval, and candidate traits.
2. **REQ-198: Phased Primary Calendar Engine (Medium | `presidential-primaries.js`):**
   - Established the 3-wave presidential primary calendar: Wave 1 Early States (IA, NH, NV, SC — February; 186 delegates), Wave 2 Super Tuesday (15 states including CA, TX, NC, VA, MA; 1,645 delegates / ~41.3%), and Wave 3 Late Battlegrounds (32 jurisdictions; 2,148 delegates). Implemented momentum bounces (+4.0% to winner, +1.5% to runner-up) and cascade dropouts after early waves.
3. **REQ-199: State Delegate Allocation & Live Delegate Tracker (Medium | `presidential-primaries.js`):**
   - Implemented proportional delegate allocation across all 51 jurisdictions (3,979 total pledged delegates; 2,000 clinch threshold) with a strict 15.0% viability threshold and Major-Bonus state rules (>50% takes 100% of delegates in TX, OH, FL).
4. **REQ-201: Factional Convention Delegates & Platform Floor Votes (Medium | `presidential-primaries.js`):**
   - Modeled national nominating conventions with three competing platform floor amendments (Energy Transition, Trade Protectionism, Judicial & Democratic Reform). Adopting planks shifts national issue sliders by $\pm 1.0$ point with authentic faction happiness stakes (+7 winning wing, -4 dissenting wing).
5. **REQ-202: Vice Presidential Ticket Selection & Keynote Unity Brokering (Medium | `presidential-primaries.js`):**
   - Added 4-contender running mate rosters featuring primary rivals and sitting governors/senators. Picking a primary runner-up completely cancels the Bruised Incumbent penalty and heals factional fractures (+12 Happiness). Added prime-time Keynote Speaker selection boosting candidate fame (+5) and national campaign enthusiasm bounce (+2.0%).
6. **REQ-203: Contested / Brokered Multi-Ballot Convention Dealmaking (Medium | `presidential-primaries.js`):**
   - Triggers when no candidate secures 2,000 delegates on Ballot 1. Added multi-ballot bargaining: Kingmaker VP deals (pledging 100% of runner-up delegates on Ballot 2), Cabinet + Platform accords (pledging 80% on Ballot 2), or deadlocked compromise candidate fallback on Ballot 3 (-5.0% enthusiasm penalty, -10 faction happiness).
7. **REQ-221: Non-Linear Log-Uniform Ballot-Drop Pool & Gaussian Skew (Medium | `election-night-engine.js`):**
   - Built zero-DOM ballot simulation allocating exact integer votes via the largest-remainder method. Implemented log-uniform slice generator (100 to 10,000 ballots per drop) with Box-Muller Gaussian partisan skew ($\sigma = 13.333$ pts) and 100% exact mathematical convergence to certified returns on the final drop.
8. **REQ-223: 2-Column Broadcast Desk UI, 5 Multi-Race Tabs & Post-Election Handshake (Medium | `app.js`, `styles.css`, `engine.js`):**
   - Implemented fullscreen Decision Desk console featuring live Eastern Time clock, playback controls (1x, 2x, 4x, Pause, Skip to End), dynamic map brightness scaling `(0.40 + 0.60 * (pct / 100))`, 5 multi-race tabs (`President`, `Senate`, `House`, `Governors`, `State Legislatures`), closest-first live count table, multi-party scoreboard, and seamless "See the full results →" handshake handing off to recounts, 12th Amendment, and autopsy without double-counting.

---

### 2. Small Requirements (21 Updates)

1. **REQ-195: Incumbent Vulnerability Triggers & Challenger Emergence (Small | `presidential-primaries.js`):**
   - Dynamically evaluates presidential incumbents in 2032+ cycles. Flags primary vulnerability when approval falls below 40%, national environment backlash reaches $\ge +8.0$, or aggrieved base factions enter revolt.
2. **REQ-196: Incumbent Primary Contest & Party-Fracture Fallout (Small | `presidential-primaries.js`):**
   - Implemented the Step-Aside Dilemma. Pressuring vulnerable incumbents to step aside cuts governing fatigue on the party by 60% and opens the primary field; standing by a vulnerable incumbent triggers a contested primary imposing a -3.5% general election margin penalty.
3. **REQ-200: Chair Primary Strategy & Lane Consolidation (Small | `presidential-primaries.js`):**
   - Added 3 strategic Chair interventions during primary season: Institutional Neutrality (+6 Happiness across all factions), Back Favored Candidate ($3.0M committee funds for +5.0% boost, -8 Happiness on rival wings), and Broker Lane Consolidation (prompting trailing candidates to endorse the frontrunner).
4. **REQ-204: Correlated Regional & State Polling Error (Small | `election-uncertainty.js`):**
   - Implemented Box-Muller Gaussian correlated regional error generator ($\sigma = 2.8\%$) across all 4 Census Regions (Northeast, Midwest, South, West) plus independent state noise ($\sigma = 1.2\%$) across all 50 states and DC.
5. **REQ-205: Shy-Voter Bias & Late-Breaking Undecided Swing (Small | `election-uncertainty.js`):**
   - Modeled 1.5%–3.0% public poll suppression on candidates with `Rough` or `Undisciplined` traits or extreme platform stances, surfacing as hidden turnout on Election Night. Added late-breaking undecided swing breaking 65/35 in favor of the party with wave momentum.
6. **REQ-206: 50-State Statutory Signature & Retention Table (Small | `ballot-access.js`):**
   - Implemented authentic 50-state statutory rules (signatures required and retention thresholds). Enforced the Tier 1 Fringe invariant: 0 starting ballot access and strict bar from courting sitting politicians.
7. **REQ-207: Petition Drive Action & State Qualification Loop (Small | `ballot-access.js`):**
   - Added the Petition Drive organizing action ($1.5M–$6.0M cost, -35% state chapter discount) with selectable signature buffer tiers: Bare Minimum (100% / 1.0x), Prudent (150% / 1.5x), and Ironclad Defense (200% / 2.0x).
8. **REQ-208: Major-Party Petition Challenges & Signature Audits (Small | `ballot-access.js`):**
   - Added AI major-party signature challenges in battleground swing states when a minor party qualifies with $\ge 2.5\%$ polling share. Audit failure rates scale with buffer: 8% with $\ge 180\%$ buffer, 45% with 130%–160%, and 80% with $< 120\%$.
9. **REQ-209: Ballot-Access Legal Defense Crisis Modal (Small | `ballot-access.js`):**
   - Interactive crisis modal offering 3 legal defense paths: Retain Election Law Firm ($2.5M, 85% success), Signature Cure Blitz (1 action, $1.0M, 60% success), or Concede State (0 cost, forfeits ballot access).
10. **REQ-210: Automatic Close-Margin Statutory Recounts (Small | `election-uncertainty.js`):**
    - Automatically pauses election certification when presidential contest margin is $\le 0.50\%$ in any state, executing a statutory recount with stochastic $\pm 0.12\%$ adjustment and updating Electoral College tallies (hooking REQ-191 Contingent Elections).
11. **REQ-211: State Trifecta Voting-Law Policy Bills (Small | `ballot-access.js`):**
    - Enabled parties holding unified state trifectas (Governor + both legislative chambers) to enact voting reform bills: Strict Photo ID (+20% petition hurdle), Universal Vote-by-Mail (-50% petition costs), or Early Voting Window.
12. **REQ-212: Hidden Candidate Vulnerability Scores & "Vet Candidate" Action (Small | `candidate-vetting.js`):**
    - Assigned hidden 0–100 vulnerability scores based on candidate traits. Added the $500k "Vet Candidate" action unmasking qualitative risk tiers (Clean 0–20, Minor 21–45, Baggage 46–74, Toxic 75–100) with zero numeric leaks.
13. **REQ-213: Mid-Campaign Scandal Blowups — Stand By vs Abandon Dilemma (Small | `candidate-vetting.js`):**
    - Weeks 3–4 campaign crisis for vulnerable nominees in battleground races. Option A: Stand By Nominee ($3.5M warchest, -4% poll drag, +4 faction loyalty). Option B: Abandon Nominee (concedes seat, -18% poll crash, +2 independent trust, -14 faction backlash & bolt threat).
14. **REQ-214: Post-Election Certified Performance Drift (Small | `election-drift.js`):**
    - Analyzes actual vs expected margins across all states post-election; multi-cycle outperformance permanently shifts state baseline lean by $\Delta \text{Lean} = \text{clamp}((\text{actual} - \text{expected}) \times 0.08, -1.5, +1.5)$.
15. **REQ-215: Multi-Cycle Demographic & Migration Drift (Small | `election-drift.js`):**
    - Applies quadrennial macro demographic shifts: Sun Belt suburban diversification (-0.35 pts toward Dem), Rust Belt industrial realignment (+0.35 pts toward GOP), and Mountain West metro growth (-0.30 pts toward Dem).
16. **REQ-216: Organizing & Registration Footprint Feedback (Small | `election-drift.js`):**
    - Translates net voter registration gains into permanent partisan drift: every +25,000 net voters shifts state lean by 0.35 pts. Maintaining a state chapter for 3 consecutive cycles adds a +0.50 pt defensive cushion.
17. **REQ-217: Post-Election Factional Autopsy Realignment (Small | `election-drift.js`):**
    - Realigns internal faction voter power post-election: Landslide victories expand the nominee's wing by +8%; crushing defeats trigger a -12% establishment contraction—strictly conserving the 155M represented scale.
18. **REQ-218: Non-Linear Multi-Party Swing Split Curves — Softmax (Small | `election-drift.js`):**
    - Replaced linear proportional splits with multinomial Softmax utility curves $P_i = \frac{e^{U_i}}{\sum e^{U_j}}$ based on issue distance, candidate approval, and incumbent advantage, summing strictly to 1.0.
19. **REQ-219: Dynamic Third-Party Appeal Elasticity & Tier Caps (Small | `election-drift.js`, `engine.js`):**
    - Evaluates Duopoly Dissatisfaction; surges minor-party appeal when dissatisfaction $> 55$. Clamps minor-party generic approval strictly by Institutional Tier (Tier 1: 5.0%, Tier 2: 10.0%, Tier 3: 18.0%, Tier 4: 25.0%, Tier 5: Uncapped).
20. **REQ-220: 51-Jurisdiction Poll-Closing Schedule & Reporting Pace (Small | `election-night-engine.js`):**
    - Modeled authentic Eastern Time poll-closing schedule from 7:00 PM ET ($t=0$) to 1:00 AM ET ($t=360$), with state reporting durations scaled from 120m to 360m by EV weight.
21. **REQ-222: 13-Tier Race Calling & Sallow 15-Minute Live Forecast (Small | `election-night-engine.js`):**
    - Implemented 13-tier Decision Desk race calling matrix with mandatory `currentLiveLeader === finalWinner` lock on tiers 3%–13.9%. Added Sallow 15-minute live forecast draws (120 Monte Carlo draws) projecting uncalled battlegrounds.

---

### 3. Release Packaging & Verification
- **Save Migration:** Updated save key to `partyChairGame.save.v16.1` with backward-compatible migration from `v16.0`, `v15.9`, and all legacy saves in `engine.js`.
- **Verification:** Created and passed all 38 test suites in `scripts/test-v16-1.cjs` (100% pass) and 86/86 assertions in `scripts/test-mas01-phase4.cjs`.
- **Executable Compilation:** Recompiled self-contained Windows executable via `build.ps1` to produce `dist/release/Coalition Builder - Party Chair.exe`.


---

## VERSION 0.16.2

# Coalition Builder: Party Chair — Version 0.16.2

Version 0.16.2 delivers a comprehensive sweeping build across 21 requirements (`REQ-224` through `REQ-244` — 4 Medium, 17 Small) spanning 7 core system clusters: the Statehouse Farm Team, Draft-of-7 Priorities Engine, Strategic Quests Expansion, Historical Party Systems Canon, Custom Party Creation & Anchoring, Custom Party Origins, Lifecycle & Identity, and Custom-Party-Exclusive Priorities.

### Update Summary by Size

| Size Category | Count | Requirement IDs | Core Subsystems |
| :--- | :---: | :--- | :--- |
| **Massive** | **0** | — | — |
| **Huge** | **0** | — | — |
| **Large** | **0** | — | — |
| **Medium** | **4** | REQ-237, REQ-238, REQ-240, REQ-242 | Custom Starting Factions & Politician Transfer, Merger Dissolution & Orphan Rehoming, 100K Founding Faction Builder, Founder's Shadow Aura & First Succession Crisis |
| **Small** | **17** | REQ-224, REQ-225, REQ-226, REQ-227, REQ-228, REQ-229, REQ-230, REQ-231, REQ-232, REQ-233, REQ-234, REQ-235, REQ-236, REQ-239, REQ-241, REQ-243, REQ-244 | Statehouse Standout Spawner, $0 Recruitment Promotion Pipeline, State Leg Caucus Chair Leadership Role, Vote-Threshold Quests Pack A, Regional Bastion & Reform Quests Pack B, Breakthrough Quests Pack C, Draft-of-7 PRNG Engine, Tier 2 Party Focus Preservation, Turnout Engine & Bench Quests, Targetable Hostile-Territory Quests, Historical Party Systems Canon Eras 1–6, Standalone Custom Party Architecture, Anchor Faction Lock & Internal Crisis, 5 Origin Story Archetypes, Founding Charter Traits & Branding Suite, Custom Founding Momentum Priorities Pack A, Custom Fortress & Bench Priorities Pack B |
| **Tiny** | **0** | — | — |
| **Total** | **21** | **REQ-224 through REQ-244** | **Full v0.16.2 Delivery** |

---

### 1. Medium Requirements (4 Updates)

1. **REQ-237: Custom Party Starting Factions Picker, Pairwise $\le 2.0$ Compatibility, 155M Voter Transfer & Universal Politician Transfer (Medium | `app.js`, `engine.js`, `factions-0.15.js`, `styles.css`):**
   - Implemented an interactive setup faction matrix for custom parties. Enforces strict pairwise ideological compatibility ($|\Delta\text{Econ}| \le 2.0$ and $|\Delta\text{Social}| \le 2.0$ with $10^{-9}$ float tolerance), greying out incompatible wings dynamically with qualitative tooltips.
   - Built exact state-by-state voter redistribution via the largest-remainder method conserving the 155,000,000 represented voter electorate bit-for-bit with zero variance.
   - Universal politician transfer: every sitting senator, representative, governor, and prospective candidate affiliated with selected breakaway factions automatically switches party affiliation to `'player'`, updating chamber rosters and leadership benches seamlessly.
2. **REQ-238: Minor-Party Merger Dissolution, Orphaned Factions, Rival Scrubbing & Sellout Grudge (Medium | `engine.js`, `app.js`, `data.js`):**
   - Modeled institutional minor-party mergers where absorbing minor parties removes dissolved rival entities from ballots, forecasters, and state chapter directories, registering them in `game.dissolvedParties`.
   - Dissident factions rejecting the merger become orphaned breakaway factions (`seekingPartyHome: true`) holding a temporary "Sellout Grudge" against the coalition, with multi-cycle rehoming rolls and reconciliation paths.
3. **REQ-240: Custom 100K Founding Faction Builder & Not a Major Movement Lockout (Medium | `engine.js`, `app.js`, `styles.css`):**
   - For grassroots movements operating outside established factions, implemented the 100K Founding Faction Builder. Players customize economic, social, and governance sliders, select two core platform issues, and allocate exact integer voters summing to 100,000 across jurisdictions in 100-voter blocks.
   - Preserves 155,000,000 voter scale bit-for-bit by drawing voters proportionally from state Independents and swing segments (`swg_*`). Locks the party out of Tier 2–5 major institutional privileges until statutory ballot viability is demonstrated.
4. **REQ-242: The "Founder's Shadow" Movement Aura & "Survive the Founder" First Succession Crisis (Medium | `engine.js`, `app.js`, `data.js`, `styles.css`):**
   - Anchors custom parties around their founding charismatic leader with an early Movement Aura: granting a +20% annual fundraising boost and +1 candidate recruitment lift across the opening 3 cycles (`founderLegacy.movementAuraCyclesRemaining = 3`).
   - Implemented the "Survive the Founder" First Succession Crisis modal triggered upon founder retirement, defeat, or aura expiration. Features three strategic paths: *Institutionalize the Machine* (fortifies grassroots machine factions, temporary fundraising recalibration), *Anoint a Handpicked Heir* (endorsed successor retains partial charisma, risks bench jealousy), or *Open Factional Power Struggle* (contested internal brawl determined by faction strength). Arms `postSuccessionCyclePending` for follow-up cycle priorities.

---

### 2. Small Requirements (17 Updates)

1. **REQ-224: Breakout State Legislator Spawner, 12-Member Roster Cap & Seasoning Lifecycle (Small | `engine.js`, `v07-scaffolding.js`, `app.js`):**
   - Designed a dynamic statehouse farm team engine for parties holding $< 10$ federal/gubernatorial officeholders. Evaluates certified state legislative election night returns; spawns statehouse standouts (`office: 'stateLeg'`) with 5–8 Quality and 20–55 Fame upon winning seats or chamber-majority flips.
   - Enforces a 12-member per-party standout cap, multi-cycle seasoning (+5–8 Fame, +1 Quality capped at 8 per cycle in office), and a 1-cycle "Former State Representative" transition window if statehouse seats are lost before retirement.
2. **REQ-225: Statehouse-to-Higher-Office Recruitment Pipeline & Seamless Career Promotion (Small | `engine.js`, `app.js`):**
   - Integrated statehouse standouts into candidate recruitment and primary prospect cards, tagged with the gold `★ SITTING STATE LAWMAKER` badge and a $0 recruitment fee (waiving the standard $1.0M cost).
   - Added the `promote-state-legislator` operational action, reassigning lawmakers to Congressional or Gubernatorial tickets, logging `Served in State Legislature` career milestones, and freeing standout roster slots.
3. **REQ-226: State Legislative Caucus Chair Leadership Role & Bench Fallback (Small | `v07-scaffolding.js`, `app.js`):**
   - Added the Category A institutional stepping-stone role `stateLegCaucusChair` to `LEADERSHIP_ROLES_SCHEMA`, unlocked when a party holds $\ge 1$ statehouse seat and 0 House/Senate seats.
   - Delivers passive +1.5 State Legislature support nationwide and unlocks Keynote Speaker and State Tour machine actions. Allows statehouse standouts to populate the leadership bench as a fallback when federal benches hold $< 3$ members.
4. **REQ-227: Third-Party Major Priorities Pack A — Vote-Threshold & Institutional Ascent (Small | `data.js`, `engine.js`, `app.js`):**
   - Added 4 strategic quests to `OVERALL_PRIORITY_QUESTS`: *Cross the 5% Funding Threshold* (hooks REQ-179 FEC matching funds and ballot retention), *Shatter the 15% Debate Barrier* (hooks REQ-180 debate stage and allied Super PAC seeding), *Secure 50-State Ballot Access* (hooks multi-cycle ballot lock), and *Build a Statehouse Farm Team* (spawns immediate Quality-7 standout and buffs farm team).
5. **REQ-228: Third-Party Major Priorities Pack B — Regional Bastion, Electoral Reform & Kingmaker Leverage (Small | `data.js`, `engine.js`):**
   - Added 4 strategic quests: *Carve Out a Regional Bastion* (win $\ge 20\%$ in a state, triggering regional momentum), *Break the Duopoly (Electoral Reform)* (enacting RCV/Approval/PR in new states), *Become the Kingmaker* (holding balance of power in hung chambers with +1 bargaining concession), and *Poach a Sitting Lawmaker* (courting sitting federal/gubernatorial officials with loosened happiness gates).
6. **REQ-229: Third-Party Major Priorities Pack C — Historic Breakthrough & Major-Party Displacement (Small | `data.js`, `engine.js`):**
   - Added 4 strategic quests: *Win Your First Electoral Votes* (securing $\ge 1$ Electoral College vote and removing wasted-vote drag), *Force a 12th Amendment Deadlock* (deadlocking both major parties under 270 EVs to trigger Contingent Elections), *Overtake a Major Party (Finish 2nd)* (displacing a major party in popular vote to win Tier 5 Major promotion), and *Survive the Big-Tent Crossroads* (holding founding factions happy during rapid growth).
7. **REQ-230: Deterministic Seeded PRNG Hand Generation & Anti-Repeat Mechanism (Small | `engine.js`):**
   - Replaced static priority catalogs with a dynamic Draft-of-7 hand engine. Generates 7 priority quests per cycle via a deterministic PRNG hash seeded by `${saveSeed}_${year}_${partyId}_${redrawCount}` guaranteeing reload-identical hands.
   - Deploys 2–3 Contextual/Milestone slots and 4–5 Generic slots, with anti-repeat sorting against `lastCycleOffered`.
8. **REQ-231: Redraw-with-Cost Action, Three-Slot Locking & Tier 2 Focus Deck Preservation (Small | `engine.js`, `app.js`, `styles.css`):**
   - Added the `redraw-priorities-hand` action with escalating cost (`redrawCount + 1` leadership actions). Locking 3 chosen quests shields them against cycle tampering and grants immediate acceptance bonuses.
   - Preserved the independent Tier 2 Party Focus deck (3, 5, or 7 slots based on institutional tier).
9. **REQ-232: New Generic Major Priorities (Turnout Engine & Build Up the Bench) (Small | `data.js`, `engine.js`):**
   - Added 2 universal major priorities open to all parties: *Turnout Engine* (maintaining all active party factions $\ge 65$ Happiness for a +2.0% election night base turnout lift) and *Build Up the Bench* (electing $\ge 3$ Rising Star or high-fame recruits for +25,000 registered voters).
10. **REQ-233: Targetable Hostile-Territory Priorities (Crack an Opponent Stronghold & Fortress) (Small | `data.js`, `engine.js`, `app.js`):**
    - Added 2 interactive targetable priorities: *Crack an Opponent Stronghold* ($\ge +5$ hostile lean) and *Crack an Opponent's Fortress* ($\ge +10$ hostile lean).
    - Players select the exact target state from a dynamic dropdown upon quest selection; winning federal/gubernatorial races there permanently shifts that state's baseline partisan lean by +1.5 or +2.5 points toward the player's party.
11. **REQ-234: Historical Canon Eras 1–6, The Modern Populist Era Retitle & Philosophy Modal (Small | `party-systems-data.js`, `party-systems-engine.js`, `party-systems-ui.js`, `styles.css`):**
    - Integrated canonical 1st through 6th Party Systems into `PartySystemsData.HISTORICAL_CANON_ERAS` with owner-approved dating and key catalysts. Retitled the 7th Party System to *The Modern Populist Era* (`2006 – Present`), initializing `currentEraStartYear: 2006` while preserving the 2040 8th-era floor.
    - Added the ⓘ button and interactive *Era Dating Philosophy Modal* articulating the "Two Signature Moments" historiographical framework.
12. **REQ-235: Standalone "Create Custom Party" Architecture & Independent Entity Pipeline (Small | `app.js`, `engine.js`):**
    - Removed the destructive preset-override checkbox, replacing it with a dedicated `[ ✦ CREATE CUSTOM PARTY ]` entry point that opens a custom setup drawer without mutating default Democratic or Republican templates.
13. **REQ-236: Ironclad Democratic & Republican Leading-Faction Anchor Lock (Small | `engine.js`, `factions-0.15.js`, `app.js`):**
    - Hard-locked anchor factions `dem_liberal_establishment` and `gop_maga` with `"isIroncladAnchor": true`, barring them from bolting, custom-party extraction, or poaching.
    - Extreme dissatisfaction routes to an *Internal Anchor Crisis* modal imposing -4.0% turnout drag, -15% fundraising drag, and primary challenges until acknowledged and mediated.
14. **REQ-239: Four Mechanical Party Origin Story Archetypes (Small | `data.js`, `engine.js`, `app.js`):**
    - Scaffolded 4 playable custom origin archetypes: *Major-Party Schism* (breakaway wing with parent-party friction), *Civic Reform Movement* (+12% independent trust, anti-monopoly focus), *Grassroots Viral Phenomenon* ($15M budget, +1.5% youth turnout boost), and *Executive Third-Way Project* ($50M warchest, technocratic posture).
15. **REQ-241: Founding Charter Traits & Visual Party Branding Suite (Small | `data.js`, `engine.js`, `app.js`, `styles.css`):**
    - Added 4 founding charter traits with mechanical trade-offs (enforcing mutual exclusivity between *Big-Tent Pragmatism* and *Doctrinal Vanguard*).
    - Implemented a vector branding suite featuring 10 custom party emblems, a 3-letter broadcast ticker code (`customCode`) displayed across Decision Desk graphics, and a founding 1-line motto displayed in authentic serif styling on the dashboard.
16. **REQ-243: Custom-Party-Exclusive Priorities Pack A — Founding Momentum & Merger Arcs (#1–#5) (Small | `data.js`, `engine.js`):**
    - Added 5 custom-only priorities: *Beat the Sophomore Slump* (cycle-2 retention), *Seal the Merger* (pacifying merged wings), *Outpoll Your Former Home* (beating the schism parent party), *Survive the Founder* (first post-succession general election), and *Prove We Are Not a Spoiler* (exceeding double-digit benchmark).
17. **REQ-244: Custom-Party-Exclusive Priorities Pack B — Fortress, Grudge, Cross-Aisle & Homegrown Bench (#6–#9) (Small | `data.js`, `engine.js`):**
    - Added 4 custom-only priorities: *Build the Home-State Fortress* (permanent home-state lean shift), *Silence the Sellout Critics* (clearing sellout grudges), *Forge an Unlikely Alliance* (enacting policy in a hung chamber), and *Homegrown Bench* (promoting $\ge 2$ statehouse standouts).

---

### 3. Release Packaging & Verification
- **Save Migration:** Updated save key to `partyChairGame.save.v16.2` with backward-compatible migration from `v16.1`, `v16.0`, and all legacy saves in `engine.js`.
- **Automated Verification:**
  - `scripts/test-mas01-phase4.cjs`: 86/86 assertions passed (100%).
  - `scripts/test-v0162-integration.cjs`: 119/119 assertions passed across all 8 suites (100%).
- **Invariant Audit:** Strict bit-for-bit conservation of the 155,000,000 represented voter scale across all custom party creation, 100K allocation, and voter transfer operations. Zero `REQ-XX`, `MAS-XX`, or raw sample counts in user-facing UI markup.
- **Executable Compilation:** Recompiled self-contained Windows executable via `build.ps1` producing `dist/release/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.16.3

# Coalition Builder: Party Chair — Version 0.16.3 (Bug-Fix & Stabilization Release)

Version 0.16.3 delivers comprehensive bug fixes, engine stabilization, voter model calibration, and UI Polish across the 0.16.x line. Governed by `VERSION_0.16.3_DESIGN.md`, it resolves 21 defect, balance, and UX requirements (**REQ-245 through REQ-265**): 3 Medium, 11 Small, and 7 Tiny.

### Requirement Inventory Categorized by Size

| Size Category | Count | Requirement IDs | Scope & Focus |
| :--- | :---: | :--- | :--- |
| **Massive** | 0 | — | None |
| **Huge** | 0 | — | None |
| **Large** | 0 | — | None |
| **Medium** | 3 | REQ-247, REQ-248, REQ-249 | Cycle transition crash fix, 100K founding injection & two-ledger scaling, Hare-Niemeyer largest-remainder apportionment |
| **Small** | 11 | REQ-245, REQ-250, REQ-251, REQ-252, REQ-253, REQ-258, REQ-259, REQ-260, REQ-261, REQ-262, REQ-264 | Faction picker population sync, redraw pool cap (20-action pool), 100K state allocation validation modal, standout persistent IDs, responsive drawer layout, ballot access zero-polling invariant, 2028 3.0% baseline ceiling, Socialist VT peak & regional weights, House D+9 generic ballot transmission, Senate D+9 state lean baseline, 3rd party state chapter footprints |
| **Tiny** | 7 | REQ-246, REQ-254, REQ-255, REQ-256, REQ-257, REQ-263, REQ-265 | Custom party setup persistence, semantic CSS variables, targetable stronghold indicators, succession text interpolation, 2026 midterm baseline calibration, "Take the Chair" input selector sync, custom party zero-infrastructure start |
| **Total** | **21** | **REQ-245 through REQ-265** | **Full v0.16.3 Stabilization Delivery** |

---

### 1. Medium Requirements (3 Updates)

1. **REQ-247: Fatal Custom Party Cycle Transition Engine Fix (`startNextCycle`) (Medium | `engine.js`):**
   - Corrected `startNextCycle` lifecycle orchestration so that charismatic Movement Aura decrements and `checkFounderSuccessionTrigger` evaluations fire safely on the active game instance before evaluating faction friction.
   - Guarded `processOrphanedFactionRehoming` against undefined parties and missing properties, preventing null-reference crashes when transitioning custom party games from the 2028 general election to the 2030 midterm cycle.
2. **REQ-248: 100K Founding Faction Voter Model Injection & Two-Ledger Sample Unit Scaling (Medium | `engine.js`):**
   - Implemented the strict Two-Ledger Rule for grassroots custom movements:
     - *Ledger 1 (Sample Units):* Populates `st.affiliations.player` using apportioned sample units ($1\text{ unit} = 100\text{ real voters}$), cleanly deducted from state Independents and swing blocks.
     - *Ledger 2 (Represented Voters):* Injects the exact represented voters into `st.factions.custom_founding_faction` and proportionately deducts from swing faction records (`swg_*`).
   - Bit-for-bit preserves the 155,000,000 national represented voter scale with zero drift.
3. **REQ-249: Largest-Remainder Apportionment & Integer Sample Unit Conservation (Medium | `engine.js`, `app.js`):**
   - Implemented the Hare-Niemeyer largest-remainder algorithm (`apportionSampleUnitsHareNiemeyer`) allocating integer sample units across 50 states and DC.
   - Distributes integer parts ($v / 100$) and assigns surplus units descending by fractional remainder, with deterministic tie-breaking (higher voter count, then alphabetical state code). Conserves exactly 1,000 sample units ($100,000\text{ voters}$) under all allocation geometries.

---

### 2. Small Requirements (11 Updates)

1. **REQ-245: Fix Faction Population Display and Voter Transfer in Custom Party Creator (Small | `app.js`, `engine.js`, `factions-0.15.js`):**
   - Replaced broken reads of `f.representedVoters` with `(f.targetVoters || window.PartyChairData?.FACTION_NATIONAL_TOTALS?.[f.id] || 0)`, eliminating the silent 1.2M padding fallback.
   - Displayed actual represented populations on each faction card (`· X.XXM Voters`).
   - Synced transferred voters into `game.voterModel.affiliations.player` at creation and in `realignVotingBlocksBetweenElections`, preventing custom party voter blocks from disappearing between election cycles.
2. **REQ-250: Draft-of-7 Redraw Pool Check & Hard Ceiling Cap (20-Action Pool) (Small | `engine.js`, `app.js`):**
   - Enforced a hard ceiling on redraw costs (`Math.min(4, redrawCount + 1)`), preventing prohibitive action starvation.
   - Unified the available action pool across `organizingActionsRemaining` and legacy `actionsLeft`, allowing players to execute redraws from their 20 leadership actions and synchronizing deductions accurately across both fields.
3. **REQ-251: 100K State Allocation Validation Modal & Silent Reset Prevention (Small | `app.js`, `engine.js`):**
   - Added interactive validation preventing silent state allocation wipes. When allocations do not sum to exactly 100,000 voters, disables the "Take the chair" launch button and displays an explicit, accessible validation modal showing the current sum, deficit/surplus, and founding state auto-balance option.
4. **REQ-252: Statehouse Standout Persistent ID & Milestone Continuity (Small | `engine.js`):**
   - Preserved `standout.id` when sitting state legislators are recruited or promoted to Congressional or Gubernatorial tickets (`recruit.id = standout.id`), guaranteeing career continuity, historical records, and milestone logging.
5. **REQ-253: Responsive Drawers & 50-State Scroll Trap Resolution (Small | `styles.css`, `app.js`):**
   - Redesigned the Custom Party Drawer and 50-State Allocation Section with a clean accordion structure, viewport-bounded scrolling (`max-height: 480px; overflow-y: auto`), and a sticky summary footer bar (`alloc-summary-bar`), eliminating 50-state scroll traps on laptop and tablet screens.
6. **REQ-258: Strict Ballot Access Zero-Polling Invariant Across All Races (Small | `engine.js`):**
   - Enforced an ironclad zero-polling invariant: parties or candidates lacking certified ballot access in a jurisdiction or race are strictly barred from receiving polling share ($0.0\%$), appearing on active general election ballots, or capturing legislative seats.
7. **REQ-259: 2028 Starting Baseline 3.0% Polling Ceiling for Non-Major Parties (Small | `engine.js`, `scenario-2028.js`):**
   - Implemented a 3.0% starting polling ceiling for non-major candidates and parties on the initial 2028 board (`Math.min(poll, 3.0)`), establishing realistic third-party opening baselines without constraining subsequent player-driven growth.
8. **REQ-260: Socialist Vermont Peak & Regional Geographic Calibration (Small | `factions-0.15.js`, `engine.js`, `scenario-2028.js`):**
   - Calibrated regional faction densities to anchor Vermont (VT) as the Socialist party's #1 state nationally under all conditions (`VT.soc_socialists + VT.soc_communists > VT.grn_*`), establishing proper Northeast and Midwest labor bastions while Greens lead the Pacific West.
9. **REQ-261: House Downballot National Environment Calibration (D+9 Generic Ballot & District Baseline) (Small | `engine.js`, `scenario-2028.js`):**
   - Decoupled House district elections from statewide margins, transmitting the national environment directly 1:1 against pure congressional district partisan leans (`district.lean + nationalEnvironment`).
10. **REQ-262: Senate Downballot National Environment Calibration (D+9 State Partisan Lean Baseline & Race Resolution) (Small | `engine.js`):**
    - Calibrated Senate general elections and forecasts to transmit national environment shifts 1:1 against state partisan baselines, ensuring wave momentum impacts Senate battlegrounds accurately.
11. **REQ-264: 3rd Party State Chapter Footprint Rebalance (Small | `engine.js`, `scenario-2028.js`):**
    - Rebalanced starting state chapter infrastructure across minor parties in `STARTING_3RD_PARTY_CHAPTERS` (Greens in West/Pacific + NE; Socialists in NE + Upper Midwest; Constitution in Mountain West/South; Libertarians with broad 50-state footprint).

---

### 3. Tiny Requirements (7 Updates)

1. **REQ-246: Custom Party Deselection & Setup Choice Persistence (Tiny | `app.js`):**
   - Clicking preset party archetypes explicitly sets `custom = false`, cleanly closing the custom creator drawer.
   - Removed premature `customIssuePositions = null` wipes, preserving custom positions, names, colors, and mottos when navigating back and forth during setup.
2. **REQ-254: Semantic CSS Variable Binding for v0.16.2 Elements (Tiny | `styles.css`):**
   - Replaced hardcoded color values across custom party drawers and draft grids with semantic CSS custom properties (`--bg-panel`, `--border`, `--text-primary`, `--gold`), ensuring theme consistency.
3. **REQ-255: Targetable Opponent Stronghold Dropdown Qualification Indicator (Tiny | `app.js`):**
   - Added clear visual qualification indicators (`★ Targetable (Hostile Lean)` / `Locked (< 55% Hostile)`) to state selection dropdowns for hostile-territory strategic quests.
4. **REQ-256: Succession Crisis Atmospheric Text & Trait Interpolation (Tiny | `engine.js`, `app.js`):**
   - Enhanced the "Survive the Founder" Succession Crisis modal with dynamic interpolation of the founder's name and charter traits into narrative dilemma copy.
5. **REQ-257: 2026 Midterm Baseline Popular Vote Calibration (Tiny | `scenario-2028.js`, `engine.js`):**
   - Calibrated 2026 midterm baseline historical results to reflect authentic popular vote margins.
6. **REQ-263: Fix "Take the Chair" Mismatched Custom Party Input Selectors (Tiny | `app.js`):**
   - Fixed mismatched element IDs (`#custom-party-name` vs `#party-name`, `#custom-party-color` vs `#custom-color`) so custom party inputs bind and launch without validation errors.
7. **REQ-265: Custom Party Zero-Infrastructure Starting Rule (Tiny | `engine.js`):**
   - Enforced the zero-infrastructure starting rule: custom parties start with exactly 0 state chapters across all 50 states, requiring grassroots building from scratch.

---

### 4. Release Packaging & Verification

- **Save Compatibility:** Save key retained as `partyChairGame.save.v16.2` (no schema change; load-time correctness backfills in `engine.js` restore missing player affiliation values defensively while keeping saves fully backward-compatible).
- **Automated Verification Matrix:**
  - All 19 new v0.16.3 test suites passed: 100% (`TOTAL FAILED: 0`).
  - Existing regression suites (`test-mas01-phase4.cjs` [86/86] and `test-v0162-integration.cjs` [119/119]) passed: 100%.
- **Executable Compilation:** Rebuilt self-contained Windows executable via `powershell -ExecutionPolicy Bypass -File .\build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.17.0

# Coalition Builder: Party Chair — Version 0.17.0 (Faction Systems Release)

Version 0.17.0 introduces the comprehensive Faction Systems Release across REQ-287 through REQ-298, deepening intra-party dynamics, demographic registration shaping, coalition demands, faction power attrition, ideological cohesion, state-level policy elasticity, and independent expenditure PAC ecosystems.

Categorized primarily by **Size** per workspace rules:

### 1. Large Requirements (2 Updates)

1. **REQ-290: Faction-Tied Super PACs & Swing PAC Ecosystem (Large | `data.js`, `engine.js`, `party-systems-engine.js`, `app.js`):**
   - Established `FACTION_SUPER_PACS_REGISTRY` covering 4 Democratic PACs, 4 Republican PACs, 4 dedicated Era #16 Synthetic Robot PACs, and 4 Unaligned Swing PACs (`pac-swing-veterans-first`, `pac-swing-main-street`, `pac-swing-clean-water`, `pac-swing-civic-integrity`).
   - Minor party unlock gate: minor parties seed 1–2 fledgling PACs from templates upon attaining Institutional Tier 4; dropping below Tier 4 cleanly revokes fledgling Super PACs.
   - Access coupling: allied Super PACs require good standing with their faction base; alienating/suspending aligned factions cuts access until reconciled.
   - Independent expenditures: Swing PACs evaluate candidates on quality, ideological moderation, and party doctrine (+15 Moderate & Professionalize, -15 Stay Pure per REQ-193); independent expenditures land in race battleground ad buys, never party treasury.

2. **REQ-298: State & State-Party Policy Preferences (Large | `data.js`, `engine.js`, `app.js`):**
   - Implemented `STATE_PARTY_PILLAR_BASELINES` across all 51 jurisdictions with hard 3-point bounding clamps (`|delta| <= 3.0` points) relative to national platform baselines.
   - Asymmetric regional elasticity: high elasticity in progressive bastions (CA, NY, VT, MA) and conservative bastions (WY, ID, TX, AL), with elasticities centered near zero for moderate swing states (PA, MI, WI).
   - Wired state party platform calculations into candidate primary positioning, Swing PAC scoring, and qualitative cable-news narrative dossiers in the UI with zero mathematical or REQ tag leaks.

---

### 2. Medium Requirements (4 Updates)

1. **REQ-287: Party-Differentiated Voter Registration Patterns (Medium | `factions-0.15.js`, `party-systems-robots.js`, `engine.js`):**
   - Injected faction archetype growth profiles (`urban_campus`, `labor_stronghold`, `high_elasticity_frontier`, `evangelical_heartland`, `sunbelt_suburbs`, `rustbelt_industrial`) across all 37 catalog factions and 8 Era #16 Synthetic Robot factions.
   - Multipliers shape registration drive yields geographically without changing REQ-277 tier matrix costs/yields.
   - Maintained bit-for-bit conservation of the 155,000,000 represented electorate with per-state zero variance across all 51 jurisdictions.

2. **REQ-288: Modular "Filtering Support" Toolkit Architecture (Medium | `engine.js`, `app.js`):**
   - Replaced monolithic primary interventions with a 3-part modular toolkit: Political Capital (-3 base trust, +5 debate lift, +4 national poll), Staff Support (-1 organizing action, early state polling lift), and Donor Conduits (-$2M treasury, +$3M candidate fundraising, +2 national poll).
   - Strict parity doctrine: zero costless interventions; empty selection defaults to Political Capital; insufficient treasury blocks donor conduit deployment.
   - Preserved +5% neutral path reward across all party factions for zero-intervention cycles.

3. **REQ-289: Modular Faction Endorsement Repercussions & Escalation Ladder (Medium | `engine.js`, `app.js`):**
   - Endorsing candidates grants a loyalty boost (+3.5*assets) to their faction and incurs cohesion-scaled grievance/resentment among rival factions.
   - Escalation ladder: repeated intervention against a faction triggers donor withholding (`game.suspendedFactionDonors`), followed by formal bolt warnings (`game.factionBoltWarnings`).
   - Endorsing a candidate from a suspended faction repairs the donor relationship; all happiness deltas respect Option C equilibrium bounds [0, 100] and minor party trust caps.

4. **REQ-296: Faction Power-vs-Size Attrition (Medium | `engine.js`, `app.js`):**
   - 5-level officeholder audit: tracks House (0.10), Senate (0.50), Governor (1.00), Statewide Elected Executives (0.20, exact 1/5th gubernatorial weight), State Legislature (0.05 per chamber majority), and White House (10.0 for governing control).
   - Computes expected power share from voter model faction proportions vs actual officeholder power share.
   - Under-represented factions experience bounded, monotone voter attrition toward equilibrium while strictly conserving the 155M electorate with per-state zero-variance reconciliation.

---

### 3. Small Requirements (6 Updates)

1. **REQ-291: Politician Chronological Age Engine Delta (Small | `engine.js`, `app.js`):**
   - Added `birthYear` persistence and derived age verification across sitting members and recruited candidates.
   - Career longevity weighting: politicians age +2 years per cycle; retirement probability is monotone within the 78–83 age window; zero retirements occur below age 78 even after 40+ years of service.
   - Trait age gating: politicians turning 60 cleanly retire the "Rising Star" trait and convert to "Established Politician"; new candidates under 40 cannot receive "Established Politician".

2. **REQ-292: Coalition Demands Framework & Leadership Appointments Module (Small | `engine.js`, `app.js`):**
   - Created uniform coalition offer schema (`type`, `issuingFactionId`, `term`, `deadlineCycle`, `penalty`, `reward`, `status`) and accept/refuse loop.
   - Leadership gavel appointments module: allied faction demands appointment of a member to party or committee leadership; accepting and seating satisfies the demand; refusal escalates grievance.

3. **REQ-293: Coalition Demand Module: Super PAC Airtime Commitments (Small | `engine.js`, `app.js`):**
   - Factions demand airtime commitments from allied Super PACs deployed exclusively into their geographic bastions.
   - Allied PAC access loss breaches the demand immediately, firing automatic betrayal grievance escalation.

4. **REQ-294: Coalition Demand Module: Candidate Slate Quotas (Small | `engine.js`, `app.js`):**
   - Ideological wings demand that 25%–35% of recruited general candidates originate from their faction.
   - Quotas are party-scoped and audited at the close of the candidate recruitment window.

5. **REQ-295: Coalition Demand Module: Rival Faction Quarantine (Small | `engine.js`, `app.js`):**
   - Hostile faction pairs generate demands to blacklist or quarantine rival factions from party patronage.
   - Supports 3 response paths: Satisfy (grants demand reward, triggers target severe grievance), Refuse (incurs penalty), and Fake Compliance (partial reward with decay risk under high target cohesion).

6. **REQ-297: Faction Cohesion Metric (Small | `factions-0.15.js`, `party-systems-robots.js`, `engine.js`, `app.js`):**
   - Injected numerical `cohesion` (0.10 to 1.00) across all 37 catalog factions and 8 Era #16 Synthetic Robot factions (extremist factions >= 0.90, big-tent wings <= 0.45).
   - Cohesion scales endorsement resentment severity, demand generation frequency, attrition sensitivity, and platform deviation tolerance.
   - Dossier markup surfaces qualitative Rule 7 labels ("Ironclad Doctrinal Bloc", "Disciplined Ideological Caucus", "Principled Coalition", "Flexible Big-Tent Wing", "Sprawling, Easygoing Coalition").

---

### 4. Release Packaging & Verification

- **Version Bump:** Promoted version to `0.17.0` across `package.json`, `engine.js`, `app.js`, `build.js`, `index.html`, and `BUILD_EXE.bat`.
- **Save Compatibility:** Save key retained as `partyChairGame.save.v16.2` (no schema migration; new fields persist defensively inside the existing save structure with backward-compatible load backfill).
- **Automated Verification Matrix:**
  - 9 new v0.17.0 test suites: 92/92 passed (100%).
  - 5 regression test suites: 229/229 passed (100%).
  - 40 test-v0163-* and test-v0164-* test scripts: 40/40 passed (100%).
- **Executable Compilation:** Rebuilt self-contained Windows executable via `powershell -ExecutionPolicy Bypass -File .\build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.17.1

# Coalition Builder: Party Chair — Version 0.17.1

Version 0.17.1 is a stabilization hotfix release addressing three interaction and interface accessibility issues in the States directory, Priorities/Focuses configuration, and Party Machine organizing operations.

Categorized primarily by **Size** per workspace rules:

### 1. Small Requirements (3 Updates)

1. **BUG-171-1: States Screen Inaccessible via ReferenceError (Small | `app.js`):**
   - Fixed uncaught `ReferenceError: selectedState is not defined` inside `statesTabMarkup()` where line 6702 incorrectly referenced `selectedState.id` instead of the enclosing scoped variable `activeState.id`.
   - Restored full interactive access to the 50-State Directory, statewide elected executive officer rosters, and state party profile dossiers.

2. **BUG-171-2: Priorities & Focuses Screen "State" and "Region" Button Unresponsiveness (Small | `app.js`, `engine.js`):**
   - Fixed category button unresponsiveness in `step2PrioritiesMarkup()` where `[data-set-additional-type]` buttons lacked delegated listeners prior to tab re-renders and would stall if `game.priorities.additional` was uninitialized.
   - Added global delegated event handling in `bind()` and document listener for `[data-set-additional-type]`, dispatching `set-additional-priority-type`.
   - Implemented `set-additional-priority-type` action handler in `takeAction()` in `engine.js` to dynamically swap category type between `issue`, `state`, and `region` while clearing target IDs.
   - Updated the `toggle-region-priority` tutorial step selector to `[data-set-additional-type][data-type="region"]` to prevent tutorial scrim trapping.
   - Pre-initialized `game.priorities` and `game.priorities.additional` in `syncGameSessionState()` on session mount.

3. **BUG-171-3: Party Machine Operations Actions Disabled Despite Remaining Actions (Small | `app.js`, `engine.js`):**
   - Fixed unclickable buttons on the "Execute Party Machine Operations" tab caused by buttons and dispatch guards evaluating only raw `actionsLeft <= 0` while the overarching cycle pool `organizingActionsRemaining` still had actions remaining.
   - Updated UI disable guards in `step4WorkMarkup`, primary recruitment buttons, quick chapters, and action dispatch guards to evaluate `(game.organizingActionsRemaining ?? game.actionsLeft) <= 0`.
   - Added auto-replenishment of `actionsLeft` from `organizingActionsRemaining` (refilling up to 4 actions) in `takeAction()`, `syncGameSessionState()`, and `normalizeGame()`, while properly decrementing `organizingActionsRemaining` alongside `actionsLeft`.

---

### 2. Release Packaging & Verification

- **Version Bump:** Promoted version to `0.17.1` across `package.json`, `engine.js`, `app.js`, `build.js`, `index.html`, and `BUILD_EXE.bat`.
- **Save Compatibility:** Save key retained as `partyChairGame.save.v16.2` (no schema change; fully backward-compatible with v16.2 and v16.1 saves).
- **Automated Verification Matrix:**
  - `test-v0171-bugfixes.cjs`: 21/21 passed (100%).
  - 9 v0.17.0 test suites (`test-v0170-*.cjs`): 92/92 passed (100%).
  - 5 regression test suites (`test-v0169-fixes.cjs`, `test-presidential-primaries.cjs`, `test-statewide-offices.cjs`, `test-v0165-bicameral-haven.cjs`, `test-v0162-integration.cjs`): 229/229 passed (100%).
- **Executable Compilation:** Rebuilt self-contained Windows executable via `powershell -ExecutionPolicy Bypass -File .\build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.18.3

# Coalition Builder: Party Chair — Version 0.18.3

Version 0.18.3 is a major systems release implementing the Symmetric Opponent Execution Engine (SOEE) Phase 3 campaign systems, autonomous rival chair campaign strategy, opposition research and October Surprises, trait-driven crises decision trees, and War Room intelligence telemetry, as specified in `SYMMETRIC_OPPONENT_AI_DESIGN.md`.

Categorized primarily by **Size** per workspace rules:

### 1. Massive Requirements (1 Requirement)

1. **REQ-300: Autonomous Opponent Chair AI Engine & Cycle Pipeline Orchestrator (Massive | `engine.js`, `campaign-overhaul.js`, `app.js`):**
   - Implemented `PartyChairEngine.simulateOpponentPhase(game, phaseName, options)` orchestrating synchronous turns for all rival chairs alongside the player across Phase 1 (`organizing`) and Phase 3 (`campaign`).
   - Phase 1 executes 20-action organizing loops for all active rival parties, tuning platforms, selecting quests and focuses, contesting unheld state legislative slates, and appointing 14 leadership bench positions while strictly conserving 155,000,000 represented voters.
   - Phase 3 synchronizes `game.campaign` and `game.parties` dual-bindings, state airwaves spend, active field offices, and state saturation every campaign month.

### 2. Large Requirements (2 Requirements)

1. **REQ-303: Autonomous 5-Month Campaign Strategy & Strategic Airwaves AI (Large | `campaign-overhaul.js`, `engine.js`):**
   - Implemented 5 campaign actions per month per rival party across Months 1–5 under the steep Persuasion vs. Turnout Efficiency curve (June: 300% persuasion / 25% turnout; October: 25% persuasion / 300% turnout).
   - Distinct party ad strategies: GOP (`heritage`) pours 65%+ issue attack ads early into key battlegrounds (`PA`, `WI`, `MI`, `AZ`, `GA`), driving airwaves into Crowded (>35) and Saturated (>65) tiers; DNC (`people`) protects firewall states with early bio ads, holding negative attack ads until October; Third parties run small-dollar viral telethons, battleground rallies, and wedge buys in home bastions and ballot-access states.
   - Autonomous Theme of the Month selection with repeat stale messaging penalties (50%–75% reduction on repeated themes).

2. **REQ-304: AI Crisis Management, Oppo Research Detonation & Debate Decision Matrix (Large | `campaign-overhaul.js`, `candidate-vetting.js`):**
   - AI opposition investigations in Months 1–3 targeting vulnerable nominees; GOP holds dossiers until Month 5 October Surprise detonation (-5.0% / -3.5% poll shock); DNC delays detonation.
   - Automated archetype decision trees for 42 trait-driven crises (GOP: "Attack the Media & Double Down"; DNC: "Appoint Independent Panel & Apologize"; Libertarian: "Defend as Moral Stand"; Green/Socialist: "Purge Candidate from Party Ticket").
   - Final 72 Hours Blitz in Month 5 allocating cash across top battlegrounds for a +2.25% election eve turnout surge.

### 3. Small Requirements (1 Requirement)

1. **REQ-310: Opponent Intelligence Telemetry, Morning Wire & Trail Ticker UI Feed (Small | `app.js`, `campaign-overhaul.js`):**
   - Cable-news styled Morning Wire breaking news feed in the Campaign War Room.
   - Dynamic Campaign Trail Ticker logging monthly rival ad blitzes and investments.
   - Interactive State Airwaves & Ground Balance inspection card detailing rival ad spend, field offices, opposition dossier drag, and saturation tiers (`Open`, `Crowded`, `Saturated`, `Ad Fatigue`).

---

### 4. Release Packaging & Verification

- **Version Bump:** Promoted version to `0.18.3` across `package.json`, `engine.js`, `app.js`, `build.js`, `index.html`.
- **Save Compatibility:** Save key updated to `partyChairGame.save.v18.3` with backward-compatible migration supporting `v18.2`, `v16.2`, `v16.1`, `v16.0`, and prior version save keys.
- **Automated Verification Matrix:**
  - `test-soee-campaign.cjs`: 8/8 passed (100%).
  - `test-soee-agent1.cjs`: 8/8 passed (100%).
  - `test-oppai-personas.cjs`: 38/38 passed (100%).
  - `test-oppai-primary-simulator.cjs`: 31/31 passed (100%).
  - `test-oppai-strategic-memory.cjs`: 22/22 passed (100%).
  - `test-v0180-campaign-overhaul.cjs`: 24/24 passed (100%).
  - `test-v0181-fixes.cjs`: 12/12 passed (100%).
  - `test-v0182-fixes.cjs`: 6/6 passed (100%).
- **Executable Compilation:** Rebuilt self-contained Windows executable via `powershell -ExecutionPolicy Bypass -File .\build.ps1` to `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`.

---

## VERSION 0.18.4

# Coalition Builder: Party Chair — Version 0.18.4

Version 0.18.4 delivers an essential balancing and bug-fix release focused on minor party polling visibility, downballot candidate triage retention, state legislature grassroots viability, and Duverger spoiler defection protections.

Categorized primarily by **Size** per workspace rules:

### 1. Medium Requirements (2 Requirements)

1. **REQ-311: Minor-Party Downballot Polling & Recruited Candidate Triage Retention (Medium | `engine.js`, `app.js`):**
   - Passed `raceId` when polling downballot contests (`computeRacePollingBreakdown`) so ballot-certified minor parties (e.g., Greens, Libertarians) reflect accurate polling shares rather than zero-access presidential suppression.
   - Guaranteed the player's party is always visible in downballot polling breakdowns even when polling below 0.5%.
   - Certified downballot ballot access for contested races so recruited candidates survive primary resolution, never get wiped silently, and appear in Candidate Budget Triage with full funding allocation capabilities.
   - Surfaced explicit notification if any recruited candidate lost or was disqualified during primaries.

2. **REQ-312: State Legislature Grassroots Haven & Registration-Floor Polling (Medium | `engine.js`):**
   - Established State Legislative races as the primary grassroots growth haven for minor parties by setting Duverger strategic defection spoiler penalties to 0.0%.
   - Implemented a baseline voter registration percentage floor for state legislative contest polling.
   - Modeled independent voter allocation in state legislatures weighted by relative party popularity rather than major-party duopoly dominance.

### 2. Small Requirements (1 Requirement)

1. **REQ-313: Minor-Party 1/3 Voter Retention Spoiler Floor (Small | `engine.js`):**
   - Capped the strategic defection penalty across all party tiers at 2/3 ($\le 66.67\%$), guaranteeing that at least 1/3 of a party's loyal base always turns out and sticks with their ticket even under intense general election spoiler pressure.

---

### 3. Release Packaging & Verification

- **Version Bump:** Promoted version to `0.18.4` across `package.json`, `engine.js`, `app.js`, `build.js`, `index.html`.
- **Save Compatibility:** Save key updated to `partyChairGame.save.v18.4` with backward-compatible migration supporting `v18.3`, `v18.2`, `v16.2`, and earlier save keys.
- **Automated Verification Matrix:**
  - `node --check` syntax validation on `engine.js`, `app.js`, `party-systems-engine.js`, `faction-era-stability.js`.
  - `scripts/test-v0184-minor-party-fixes.cjs`: 4/4 passed (100%).
  - `scripts/test-v0184-faction-era-fixes.cjs`: passed (100%).
  - `scripts/test-faction-defection-overhaul.cjs`: passed (100%).
  - `scripts/test-v0164-tier0-media.cjs`: passed (100%).
  - `scripts/test-v0183-bug-fixes.cjs`: passed (100%).
  - `scripts/test-mas01-phase4.cjs`: passed (100%).
- **CRLF & Executable Compilation:** Windows CRLF verified for `BUILD_EXE.bat` and `build.ps1`; release executable packaged via `build.ps1`.

---

## VERSION 0.18.6

# Coalition Builder: Party Chair — Version 0.18.6

Version 0.18.6 is a monumental integration release synthesizing systems from five dedicated development branches: Interstate Demographic Migration & Generational Cohort Turnover, Donor Class Dark-Money Super PAC Blocs & Electoral Reform Sandbox, Candidate Farm Team Mentorship & Vice Presidential Vetting War Room, Minor-Party Ascent & Coalition Balance, and Core Engine SOEE Optimization & Save Compaction.

Categorized primarily by **Size** per workspace rules:

### 1. Massive Requirements (2 Requirements)

1. **REQ-320: 100 Interstate Migration Patterns, Generational Cohorts & Demographic Dynamics Engine (Massive | `demographic-migration-data.js`, `demographics-0.9.js`, `engine.js`, `scenario-2028.js`, `index.html`, `build.ps1`):**
   - Implemented a catalog of 100 deterministic interstate migration patterns across 5 macro vectors: Sun Belt Boom Vectors, Rust Belt & Heartland Outmigration, Mountain West Growth Corridors, Climate & Cost-of-Living Dispersion, and Reverse Great Migration & Urban Renaissance.
   - Built the Multi-Cycle Migration Application Engine: dynamically shifts represented voters between source and destination states across two-year cycle boundaries based on economic and political climate.
   - Generational Cohort Turnover: transitions the American electorate across six generational cohorts (Silent Generation, Baby Boomers, Gen X, Millennials, Gen Z, Generation Alpha) at four-year presidential election boundaries, adjusting turnout propensities and ideological elasticity.
   - Post-cycle Hare-Niemeyer apportionment pass across all 51 jurisdictions guaranteeing zero-variance conservation of the exact 155,000,000 represented electorate.
   - Organic decennial census derivation: `getDecennialStatePopulations` in `scenario-2028.js` organically derives 2030, 2040, 2050, and 2060 state census populations directly from voter migration, altering congressional apportionment and Electoral College votes.

2. **REQ-321: Donor Class Dark-Money Super PAC Blocs & Electoral Reform Sandbox (Massive | `data.js`, `ballot-access.js`, `engine.js`, `app.js`, `styles.css`):**
   - Established the Dark-Money Super PAC Blocs catalog with 6 distinct interest blocs: Tech Innovation Coalition PAC ($25M), Organized Labor Defense Fund PAC ($20M), Wall Street & Financial Services PAC ($30M), American Energy Independence PAC ($25M), Grassroots Small-Dollar Alliance PAC ($15M), and Healthcare & Life Sciences PAC ($22M).
   - Partnering seals outside spending infusions, independent expenditure airwaves boosts, and binding policy red lines with explicit donor revolts (-$20M to -$45M treasury clawbacks and -15% earned media penalties) if platform stances or enacted legislation violate red lines.
   - Electoral Reform Sandbox: `STATE_ELECTORAL_SYSTEMS` defining Approval Voting (completely eliminates Duverger strategic defection) and Open-List Proportional Representation for congressional delegations (4.0% threshold).
   - National Popular Vote Interstate Compact (NPVIC): tracks compacting states and cumulative electoral votes; upon reaching $\ge 270$ EVs, automatically activates and awards all 270+ compacting electoral votes in a single block to the national popular vote winner, eliminating contingent elections.
   - Dedicated Campaign Finance & Donor Blocs UI tab and 50-State Electoral Systems & NPVIC Map view.

### 2. Huge Requirements (2 Requirements)

1. **REQ-322: Candidate Mentorship Pipeline & Vice Presidential Vetting War Room (Huge | `candidate-vetting.js`, `presidential-primaries.js`, `engine.js`, `styles.css`):**
   - Candidate Mentorship Pipeline: Chairs can designate up to 3 promising prospects (`mentorProspectAction`, $2.0M + 1 action); protégés groom across multi-cycle progressions (`applyProtegeGroomingCycle`), gaining +1 Quality per cycle, +10 Fame, Rising Star designations, and faction loyalty.
   - Vice Presidential & Running-Mate Selection War Room: Generates 4 distinct running mates balancing strategic angles: Ideological Balancing, Geographic Anchor, Experience/Gravitas, and Rising Star Energy.
   - Running-mate vetting investigations (`auditVpAction`, $3.0M): reveals candidate skeleton tiers and eliminates vulnerability to October Surprise scandal detonations (`evaluateVpScandal`).
   - Atmospheric dossiers adhering strictly to narrative tiers and zero leaked raw number formatting.

2. **REQ-323: Minor-Party Ascent, Faction Dynamics & Coalition Balance (Huge | `factions-0.15.js`, `faction-era-stability.js`, `v07-scaffolding.js`, `atlas-multiplayer-system.js`, `engine.js`, `app.js`):**
   - Break Tier 2 Glass Ceiling: Enabled small-population state breakthroughs (e.g. New Hampshire Libertarians winning 1-4 State House seats at 10% vote and spawning statehouse farm team standouts).
   - High-Leverage Mid-Game Sinks: Regional Broadcast Buy ($15M, +2.5% registration), RCV Ballot Initiatives ($20M, eliminates strategic defection), Fusion Cross-Endorsements ($15M, +3.5% ballot line lift).
   - Defection Cliff Softening: Raised `lib_ancaps` starting happiness from 30 to 48; added Classical Liberals & Civil Libertarians faction (`lib_classical_liberals`, 350,000 target voters, 65 starting happiness, Free Trade & Civil Liberties focus); added Faction Courtship / Re-recruitment action ($4.0M, +15 happiness).
   - Coalition Stability & Cooldowns: Mandatory 8-year (4-cycle) realignment cooldown; blocked realigning back to previously discarded anchors; capped Coalition Accords at 2 per organizing phase; 6-year defection reunification cooldown.
   - Tier 3 Farm Team Bridge in `v07-scaffolding.js`: allows recognition with 18+ presidential ballot states and combined federal/statehouse seats.

### 3. Large Requirements (1 Requirement)

1. **REQ-324: Core Engine Fixes, SOEE Bankruptcy & Save Compaction Optimization (Large | `engine.js`, `party-systems-data.js`, `party-systems-engine.js`, `BALANCE_AUDIT_REPORT.md`):**
   - Resolved runaway rival party compound treasury accumulation and artificial bankruptcy in SOEE.
   - Harmonized `stateOrganizations` dual-keying (`player` vs `people`), ensuring state chapter counts and strengths evaluate cleanly without desync.
   - Save Compaction: Deduplicated decennial maps in `compactGameForSave`, pruned stale historical maps, trimmed actionLog past 3 cycles, and purged primaryFields/representatives outside their active phases.
   - Balanced opponent treasury capping: clamped minor rival parties to $350M while exempting major parties during general campaign warchest operations.

### 4. Medium Requirements (3 Requirements)

1. **REQ-325: Organic Decennial Census Growth & Reapportionment Engine (Medium | `scenario-2028.js`, `engine.js`):**
   - Derived decennial state census populations from voter migration model ratios, driving dynamic congressional seat reapportionments across 2030, 2040, 2050, and 2060.
   - Dynamically recomputed state Electoral Votes ($EV = \text{House Seats} + 2$, DC fixed at 3) upon decennial reapportionment.

2. **REQ-326: Campaign Events Overhaul (Medium | `campaign-events-system.js`, `campaign-overhaul.js`, `app.js`, `engine.js`):**
   - 157 unique campaign events with dynamic multi-month story beats, debate callbacks, and contextual faction resolution.
   - 1/3 of eligible Tier 1-4 events feature voter registration recruitment choices with 70-90% success rates strictly conserving voter count.
   - Generational Windfall event awarding +100,000 voters distributed across 10 states.

3. **REQ-327: Major-Party Economy & UI Optimization (Medium | `engine.js`, `app.js`, `data.js`):**
   - Granted $2,500M general election warchests to major parties following primary certification, with post-election residual treasury capped at $\le \$100\text{M}$.
   - Zero-lag close-race triage sub-menus and batch candidate funding.
   - Landslide wave alignment ensuring 430+ EV presidential landslides translate to House wave majorities.

### 5. Small Requirements (2 Requirements)

1. **REQ-328: Minor Party Atmospheric Legacy & Hall of Fame Fallback (Small | `atlas-multiplayer-system.js`):**
   - Added atmospheric leadership fallbacks in `computeChairLegacy` for minor party chairs who won 0 legislative seats, recording standard-bearer and committee chair tenures in the Political Atlas Hall of Fame.

2. **REQ-329: Decennial Redistricting Trust Swing Clamp (Small | `redistricting-ballot-system.js`):**
   - Clamped net Independents Trust delta from decennial redistricting map ratification strictly to $[-8, +8]$ (+1 per fair compact up to +6 max, -2 per aggressive gerrymander down to -8 max).

---

### 6. Release Packaging & Verification

- **Version Bump:** Promoted version to `0.18.6` across `package.json`, `engine.js`, `app.js`, `build.js`, `index.html`.
- **Save Compatibility:** Save key updated to `partyChairGame.save.v18.6` with backward-compatible migration supporting `v18.5`, `v18.4`, `v18.3`, `v18.2`, `v16.2`, and earlier save keys.
- **Automated Verification Matrix:**
  - `test-v0162-integration.cjs`: 119/119 passed (100%).
  - `test-mas01-phase4.cjs`: 86/86 passed (100%).
  - `test-faction-defection-overhaul.cjs`: 8/8 passed (100%).
  - `test-faction-coalition-balance.cjs`: 36/36 passed (100%).
  - `test-candidate-farmteam-vp.cjs`: 9/9 passed (100%).
  - `test-dark-money-electoral-reform.cjs`: 15/15 passed (100%).
  - `test-demographics-migration-cohorts.cjs`: all passed (100%).
  - `test-agent6-overhauls.cjs`: 47/47 passed (100%).
  - `test-req72-seats.cjs`: 83/83 passed (100%).
  - `test-v0184-atlas-multiplayer.cjs`: 7/7 passed (100%).
  - `test-v0184-coalition-politics.cjs`: 7/7 passed (100%).
  - `test-v0184-maps-ballot.cjs`: 9/9 passed (100%).
  - `test-v0184-media-shocks.cjs`: 16/16 passed (100%).
  - `test-v0185-campaign-events.cjs`: 7/7 passed (100%).
  - `test-v0185-green-playtest-fixes.cjs`: 6/6 passed (100%).
  - `test-v0185-major-party-ux-and-balance.cjs`: 6/6 passed (100%).
- **Electorate Invariant:** Strictly verified 155,000,000 represented voters with 0 variance across all 51 jurisdictions.
- **UI Vibe Invariant:** Zero `REQ-XX` technical identifiers rendered in customer-facing UI markup.
- **CRLF & Executable Compilation:** Windows CRLF verified for `BUILD_EXE.bat` and `build.ps1`; release executable packaged via `build.ps1`.

---

## VERSION 0.18.8

# Coalition Builder: Party Chair — Version 0.18.8

Version 0.18.8 is a major architectural milestone delivering intra-party faction caucuses, dynamic procedural faction lifecycles, 3-party realignment chaos, procedural faction naming with ideological temperaments, kicker mechanics (mergers, vanguard Overton window pulls, coalition modifiers), identity & religious voting blocs, and save schema v9 migration with full backward compatibility.

Categorized primarily by **Size** per workspace rules:

### 1. Massive Requirements (2 Requirements)

1. **REQ-335: Intra-Party Faction Caucuses System (Massive | `faction-caucus-system.js`, `faction-core.js`, `engine.js`, `app.js`, `scripts/test-v0188-caucuses.cjs`):**
   - Canonical Starting Caucuses: Initialized across major parties on cycle zero:
     - Democratic Party: Progressive Caucus (`prog_squad`, `prog_labor`), Moderate Coalition (`mod_blue_dog`, `mod_new_dem`).
     - Republican Party: MAGA Front (`maga_populist`, `maga_america_first`), Conservative Alliance (`con_traditional`, `con_freedom`).
   - Compatibility Validation: Euclidean distance in 3D policy space $\le 2.2$ for standard caucus invites; relaxed to $\le 2.6$ for historical partner factions.
   - Caucus Solidarity Dynamics: 45% happiness splash within the caucus on appeasement or policy wins; +50% appeasement goodwill bonus to caucus members.
   - Bolt Exit Shock: -18 Happiness and +20 Friction to remaining caucus partners when a member bolts or defects.
   - Anti-Poaching Lock: Rival parties are strictly blocked from poaching or courting factions belonging to caucuses with strength $\ge 45$.
   - Primary Non-Aggression: ~88% unified candidate selection in non-presidential primaries when caucus strength $\ge 35$, avoiding self-defeating vote splits.
   - Historic Caucus Status: Achieved at 4+ consecutive cycles; confers -80% fraying resistance against ideological drift.

2. **REQ-336: Dynamic Faction Lifecycle & 3-Party Realignment Chaos (Massive | `dynamic-faction-lifecycle.js`, `engine.js`, `app.js`, `scripts/test-v0188-lifecycle.cjs`):**
   - Two-Party vs. Three-Party Realignment Split: Standard two-party systems maintain 85–90% faction preservation; when third parties become competitive ($\ge 15\%$ national vote or $\ge 1$ governor/senate seat), three-party chaos activates, dropping preservation to 35–45% and accelerating splintering.
   - High-Impact Growth & Decline Swings: Winning factions grow $+12\%$ to $+22\%$; losing factions shrink $-15\%$ to $-22\%$; catastrophic election defeats induce $-25\%$ to $-35\%$ collapse.
   - Procedural Birth Modes: Emerge (brand new ideological movement from unrepresented voters), Sever (splinter off an established wing when friction $\ge 75$), and Split (peaceful division of an oversized faction $\ge 12\text{M}$ members).
   - End-of-Cycle Dissolution: Factions falling below 100,000 members dissolve at cycle-end. Extremist factions (`prog_green_left`, `maga_populist`, `lib_ancaps`) are protected with full immunity from dissolution. Politician-tied factions dissolve if their patron loses office or retires.

### 2. Huge Requirements (2 Requirements)

1. **REQ-337: Procedural Faction Naming Engine & Ideological Temperaments (Huge | `procedural-faction-naming.js`, `scripts/test-v0188-procedural-naming.cjs`):**
   - 6 Curated Ideological Word Pools: Generates 1M+ authentic journalistic faction names (e.g., "Liberty Caucus", "New Frontier Coalition", "Main Street Patriots").
   - Zero Geographic Terms: Strict invariant prohibiting state, regional, or city names in procedural generation.
   - `usedFactionNames` Deduplication: Prevents duplicate or repeat faction names across the lifetime of the campaign save.
   - Issue Inheritance & Archetypes: Procedural factions inherit primary issues, birth modes, and 3 distinct temperament archetypes:
     - `true_believer`: 1.5x happiness penalties on platform betrayal; 0.5x appeasement boost.
     - `fair_weather`: 1.8x growth during wave victories; 2.0x shrinkage during cycle defeats.
     - `transactional`: 1.75x appeasement response; 0.6x ideology distance penalty.

2. **REQ-338: Identity & Religious Voting Blocs System (Huge | `identity-bloc-system.js`, `scripts/test-v0188-identity-blocs.cjs`):**
   - 7 Curated Identity & Religious Blocs: Black Evangelical, Black Secular, Hispanic Catholic, Hispanic Evangelical, Mainline Protestant, White Evangelical, and Mormon/LDS.
   - Event A (Bloc Splintering): Splits monolithic blocs into competing wings when party platforms diverge.
   - Event B (Latino Unification): Unifies fragmented Hispanic voting sub-blocs under shared economic/immigration milestones.
   - Event C (Emergent Identity Formations): Spawns emergent voting blocs when unaligned groups exceed thresholds.
   - Non-Unification Invariant: White voter sub-blocs strictly never unify into a monolithic single bloc. Demographic sizing mathematically preserved across the 155M electorate.

### 3. Large Requirements (2 Requirements)

1. **REQ-339: Faction Kicker Mechanics (Large | `dynamic-faction-lifecycle.js`, `faction-core.js`, `engine.js`):**
   - Faction Mergers & Takeovers: Friendly mergers between same-party factions when distance $\le 1.8$ and one faction shrinks below 2,000,000 members, consolidating membership and resources.
   - Vanguard Overton Window Pull: Factions with `vanguardCyclesLeft > 0` pull the party's platform towards their ideological pole by +0.15 per cycle for 3 cycles.
   - Coalition Temperament Modifiers: Temperaments dynamically modify faction friction and defection probability under coalition stress.

2. **REQ-340: Faction Caucus, Lifecycle & Realignment Chaos UI (Large | `faction-caucus-ui.js`, `app.js`, `scripts/test-v0188-ui.cjs`):**
   - Interactive Caucus Overview Panel in Factions Tab: Displays caucus strength, cohesion, partner badges, and non-aggression indicators.
   - 3-Party Realignment Chaos Banner: Visually warns the player when three-party competitive dynamics activate, displaying heightened volatility and defection risk meters.
   - Individual Faction Meta Badges: Temperament tags, Vanguard status badges, and Caucus solidarity indicators rendered directly on faction cards.
   - Post-Cycle Lifecycle Digest Cards: Visual summary cards detailing faction births, splits, mergers, and dissolutions at cycle closeout.

### 4. Medium Requirements (1 Requirement)

1. **REQ-341: Save Schema v9 & Backward Compatibility Framework (Medium | `save-migrations.js`, `engine.js`, `scripts/test-v0185-save-migrations.cjs`):**
   - Bumped `SAVE_SCHEMA_VERSION` from 8 to 9.
   - Added `v8 → v9` migration step: backfills `usedFactionNames`, `threePartyChaosActive`, `identityBlocState`, initializes missing `caucuses`, and backfills faction metadata (`primaryIssueId`, `birthMode`, `temperament`, `vanguardCyclesLeft`, `viralRunwayCyclesLeft`).
   - Preserves full forward/backward compatibility across all historical save schemas (`v1` through `v8`).

---

### 5. Release Packaging & Verification

- **Version Bump:** Promoted version to `0.18.8` across `package.json`, `engine.js`, `app.js`, `build.ps1`, `index.html`.
- **Save Compatibility:** Save key updated to `partyChairGame.save.v18.8` with backward-compatible migration supporting `v18.7`, `v18.6`, `v18.5`, and earlier save keys via Schema 9 migration.
- **Automated Verification Matrix:**
  - `test-v0188-caucuses.cjs`: 7/7 passed (100%).
  - `test-v0188-procedural-naming.cjs`: 7/7 passed (100%).
  - `test-v0188-lifecycle.cjs`: 11/11 passed (100%).
  - `test-v0188-identity-blocs.cjs`: 7/7 passed (100%).
  - `test-v0188-ui.cjs`: 7/7 passed (100%).
  - `test-v0188-simulation.cjs`: 4-cycle headless simulation passed (100%).
  - `test-v0185-save-migrations.cjs`: 13/13 passed (100%).
  - `test-v0183-bug-fixes.cjs`: 7/7 passed (100%).
- **Electorate Invariant:** Strictly verified 155,000,000 represented voters with 0 variance across all 51 jurisdictions.
- **UI Vibe Invariant:** Zero `REQ-XX` technical identifiers rendered in customer-facing UI markup.
- **CRLF & Executable Compilation:** Windows CRLF verified for `BUILD_EXE.bat` and `build.ps1`; release executable packaged via `build.ps1`.

---

## VERSION 0.18.9 / 0.18.9.1

# Coalition Builder: Party Chair — Version 0.18.9.1

Version 0.18.9.1 updates the build labeling and packages the v0.18.9 Stages 1–5 feature and stability release together with the v0.18.9.1 leadership & faction recruiting hotfix:

- **v0.18.9 Stages 1–5 (`03dc063`, `97fb700`, `652714c`, `a7b78fd`):** Fixed 2028+ history maps (`MAPS.states`, `byState`, DC 3 EVs), automatic Presidential ballot access from held offices, midterm petition lock, Election Night House real district margins and full-state delegation coloring, reworked Party Tiers 0–5 thresholds/perks/focus slots, Regional Chapter Momentum (+2%/neighbor >=10 pts behind with 155M conservation), Tier-Up popup, starting & seat-control bonus statehouse slates, largest-party Confidence & Supply bargaining UI/tax, Off-Cycle Interlude caucus courting & faction recruitment, Step 1 Party Leaders + Rules & Bylaws swap (Party Platform moved to Party Info), and State Senate slate/`voterModel` fixes.
- **v0.18.9.1 Hotfix (`c4a79e8`):** Enforced Caucus Leader slots + solo >=5M Faction leadership slots, hid locked Step 1 leader roles, and visually/engine-locked Tier 0–1 faction recruitment actions.
- **Version Relabel & Save Compatibility:** Updated version labels across `package.json`, `index.html`, `app.js`, `ui-setup-views.js`, `engine.js`, `persistence-core.js`, and `BUILD_EXE.bat` to `0.18.9.1` (`SAVE_KEY = 'partyChairGame.save.v18.9.1'`, preserving backward compatibility with `v18.8`, `v18.7`, `v18.6`, and earlier saves).

---

## VERSION 0.18.9.2 / 0.18.9.3 / 0.18.9.4

# Coalition Builder: Party Chair — Version 0.18.9.4

Version 0.18.9.4 integrates the spoiler-reversal voter deadband update on top of the v0.18.9.2 and v0.18.9.3 fixes and features:

- **v0.18.9.2 Spoiler Reversal (`e285662`):** Granted 0% spoiler defection when a third party outpolls the nearest major party and applied reverse-Duverger strategic defection onto the trailing major party (`tests/test-v0189-2-spoiler-reversal.cjs`).
- **v0.18.9.3 Error Log Fixes & State Senate Tracking (`232d2b4`, `0c82296`):** Rendered holdover Senate seats on Election Night and Prior-Cycle maps, suppressed Coalition Builder / Hung Chamber modals when the player wins an outright chamber majority, and added bicameral State Senate seat tracking (`1,923` / `1,924` seats) plus State Senates & Minor Statewide Offices KPI cards (`scripts/test-v0189-3-error-log.cjs`).
- **v0.18.9.4 Registered-Voter Spoiler Deadband (`81286b2`):** Switched spoiler comparison in `engine.js` to state registered voters with a 5-point deadband (`0%` spoiler for both parties within 5 points; reverse-Duverger when leading by `> 5` points; normal Duverger when trailing by `> 5` points).
- **Version Relabel & Save Compatibility:** Updated version labels across `package.json`, `index.html`, `app.js`, `ui-setup-views.js`, `engine.js`, `persistence-core.js`, and `BUILD_EXE.bat` to `0.18.9.4` (`SAVE_KEY = 'partyChairGame.save.v18.9.4'`, preserving backward compatibility with `v18.9.1`, `v18.8`, `v18.7`, `v18.6`, and earlier saves).

---

## VERSION 0.19.2

# Coalition Builder: Party Chair — Version 0.19.2

Version 0.19.2 integrates the 50-State Voting Reforms Engine, Nationwide Trifecta Constitutional & Statutory Reforms, Voting Reform Map Visualizations, and Interactive Constitutional Reform UI:

### Large
- **Nationwide Trifecta Constitutional & Federal Reforms (`trifecta-reforms-core.js`, `engine.js`, `redistricting-ballot-system.js`):** Implemented strict nationwide trifecta gating and enactment/repeal actions (`enact-trifecta-reform`), Huntington-Hill House apportionment (`435` / `573` Wyoming Rule / `692` Cube Root / `1,000` Sabato Expanded House), all 5 Larry Sabato proposals (136-seat Senate + Honorary National Senators, 1,000-seat House + mandatory nationwide nonpartisan redistricting, Mended Electoral College population bonus electors, Rotating 4-month Regional Lottery Primaries, 6-year Presidency + synced Senate cycles + 4H/2S term limits + `-25%` campaign burn), Compulsory Voting (`88%–92%` floor with `65%` swing compression), and reversible Federal Super-PAC Ban (`ban_super_pacs` / `repeal_super_pac_ban` / `reenable_super_pacs`).
- **50-State Voting Reforms & Presidential EV Allocation (`voting-reforms-core.js`, `engine.js`):** Normalized per-state electoral architectures across single-winner (`plurality`, `rcv`, `approval`), legislative (`plurality`, `proportional`, `open_list_proportional`, `stv` 3–5 seat clusters, `mmp`), and presidential EV allocation (`winner_take_all`, `district_split`, `proportional_ev`, `npvic` overrides with dynamic EV majority thresholds).

### Medium
- **Geospatial Map Pattern & Overlay Adapter (`voting-reform-map-adapter.js`, `app.js`, `election-night-engine.js`):** Wired proportional stripe & STV SVG `<pattern>` fills, NPVIC striped override patterns, MMP double borders + stacked local/list seat breakdowns, whole-state bypass for expanded/reformed House delegations, Sabato bonus EV badges, and the toggleable **"Show Voting Systems"** SVG overlay across Political Landscape and Election Night maps.
- **Interactive Voting Systems Map & Trifecta Controls (`voting-reforms-ui.js`, `voting-reforms.css`, `app.js`):** Upgraded the Electoral Systems & NPVIC Sandbox tab with interactive multi-lens map selection, per-state legislative/EV/single-winner editors, live Nationwide Trifecta status pills, federal reform action cards, and the Federal Super-PAC Ban notice banner.

### Small
- **Build Labeling, Packaging & Save Compatibility (`index.html`, `build.ps1`, `BUILD_EXE.bat`, `package.json`, `engine.js`, `app.js`):** Registered all five new CSS/JS modules, bumped build labeling to `0.19.2` (`SAVE_KEY = 'partyChairGame.save.v19.2'` with backward-compatible `v19.0` and earlier migration), verified strict CRLF on `BUILD_EXE.bat` and `build.ps1`, ran all syntax/unit/E2E integration suites, and rebuilt the Windows executable (`dist/release/Coalition Builder - Party Chair.exe`).


---

## VERSION 0.19.3

# Coalition Builder: Party Chair — Version 0.19.3

Version 0.19.3 delivers the Gameplay Mechanics Overhaul (F1–F19) across candidate recruitment, voter-scaled funding & State Legislature slates, multi-race drift & post-drift migration telemetry, Step 1 operational flow, courting tier rebalances, and 5 new States officials & seat matrix subtabs:

### Large (2 Features)
- **F14 — States Page Sitting Officials & Seat Matrix Subtabs (`states-officials-tables.js`, `app.js`, `index.html`):** Added 5 sortable/interactive subtabs under States: `Statewide Offices` (50-state strip showing Governor & minor statewide officers, traits, quality, and status), `Senate Seats` (50×3 Class I/II/III matrix), `House Seats`, `State House Seats` (`✓` on controlling party + NE Unicameral note), and `State Senate Seats` (`✓` on controlling party + NE Unicameral note).
- **F15 — Step 1 Action Migration, `$2M` Chapters & `2×` Starting Balances (`app.js`, `engine.js`, `data.js`, `v07-scaffolding.js`, `custom-party-core.js`, `redistricting-ballot-system.js`):** Relocated `National Convention Keynote Speaker`, `Sponsor Ballot Initiative`, `Enact State Trifecta Voting Reform`, and `Open a State Chapter (50 States)` to Step 1 directly below Rules & Bylaws with `0` action cost, reduced `Open a State Chapter` base cost to `$2.0M`, and doubled starting treasuries (`2×`) across canonical, minor, Tier 0, and custom parties.

### Medium (7 Features)
- **F1 — Candidate Recruitment Overhaul (`scenario-2028.js`, `v07-scaffolding.js`, `engine.js`, `app.js`):** Replaced avg-7 state recruit quality rolls with a deterministic 1000-bucket weighted distribution (mean `5.000`, `80%` in `3–7`, `1%` at `1` or `10`), hid unrecruited prospect quality/ratings (`Quality: ?/10`) until recruited, added `#recruit-faction-select`, and tied starting recruit happiness to `game.factionHappiness[factionId]`.
- **F3 — General Persuasion State Boost (`campaign-overhaul.js`, `engine.js`, `election-night-engine.js`, `app.js`):** Repurposed `campaign-statehouse-blitz` into `General Persuasion Boost` granting `+0.5%` across all races in the target state (Presidential, Senate, Governor, House, State House/Senate, and Minor Statewide) plus `+1..1,000` direct voters.
- **F4 — Multi-Race Statewide Average Performance Drift (`election-drift.js`, `engine.js`):** Reworked `calculateCertifiedPerformanceDrift` to average Presidential, Senate, Governor, combined U.S. House, State House, State Senate (excluding unicameral `NE`), and all contested minor statewide races equally per state.
- **F5 — Voter-Scaled Campaign Funding Lift (`engine.js`, `app.js`):** Added `getRaceVoterCount(game, raceKey)` (floored at `50,000`) and scaled `computeFundingPollingLift(dollarsMillions, raceVoters)` proportionally relative to `1,000,000` voters.
- **F6 — State Legislature Slate Funding (`engine.js`, `app.js`):** Registered chamber-level `state-leg:ST:lower` and `state-leg:ST:upper` slates (skipping `NE:upper`) in `initializeCandidateFunding`, applied slate funding lifts to State House/Senate shares and reallocations, and added the `State Leg Slates` Candidate Budget Triage filter.
- **F11 — Post-Drift Voter Migration Numbers (`engine.js`, `app.js`):** Captured exact signed per-party and total `stateDeltas` across drift, migration, and inter-cycle conversion in `startNextCycleInternal`, and updated `formatGainBadge` in the States Voter Registration table to display both `+` and `-` migration deltas.
- **F16 — Scripted Party-Switching Framework & John Fetterman 2028 PA Arc (`engine.js`, `scenario-2028.js`):** Added `SCRIPTED_PARTY_SWITCHES` and seeded Fetterman's heavy 2028 PA Democratic primary challenge; on primary loss, switches him to `'heritage'` (`R`) and preserves him in `game.politicians` for future PA Republican races.

### Small (8 Features)
- **F8 — Candidate Funding Unhappiness Exemptions (`engine.js`):** Added `isFundingUnhappinessExempt` exempting Tier `0–1` parties, Tier `2` House races, and safe races (`|margin| >= 12`) from funding pull/refusal/unendorsed unhappiness penalties.
- **F9 — Election Results Senate Cycle Filter vs 100-Seat Tracker (`app.js`, `election-night-engine.js`):** Shaded non-contested Senate states as neutral on Election Night while initializing `scoreboard.senate` with holdover seats so chamber control sums to `100`.
- **F10 — Top-2 Redistricting Compromise Gate (`redistricting-ballot-system.js`):** Added `isTopTwoPartyInAnyHouse` to restrict interactive `split` compromise battles to parties ranking top-2 in at least one chamber, auto-resolving `rival_split` states.
- **F12 — Politician Courting Tier 3 Gate & Reliability (`ballot-access.js`, `engine.js`, `off-cycle-interlude.js`, `app.js`):** Required Tier `3+` unless target `happiness <= 10`, and removed silent no-op traps (ideological bridge abort, happiness `> 40` mismatch, and minor-party `pendingCourtship` block).
- **F13 — Tier 4 Faction Courting Gate (`engine.js`, `faction-core.js`, `off-cycle-interlude.js`, `app.js`):** Raised faction courting/summit/wedge eligibility from Tier `2` to Tier `4` independently of politician courting.
- **F17 — Tier-Based Small-Donor Drive Yield (`engine.js`, `app.js`):** Switched `fundraise` to fixed `TIER_FUNDRAISING_YIELD_MILLIONS` (`$0.25M / $0.50M / $1.00M / $2.50M / $10.00M / $25.00M` for Tiers `0..5`) with 2-decimal treasury precision.
- **F18 — Tier-Based Joint Victory Fund Yield (`engine.js`, `app.js`):** Applied `TIER_FUNDRAISING_YIELD_MILLIONS` directly to Campaign Phase `joint-fundraising` with 2-decimal precision.
- **F19 — Universal Senate Map Split Fix (`app.js`):** Colored mixed major+third-party Senate delegations (e.g., 1 GOP + 1 Libertarian) purple (`#8654a4`) while coloring dual-third-party delegations in their party's color, and replaced the delegation-control sentence with per-party Senate seat totals summing to `100`.

### Tiny (2 Features)
- **F2 — Prevent Duplicate Party Focuses (`engine.js`, `app.js`):** Blocked duplicate `(type, targetId)` selections in `SET_PARTY_FOCUS` / `LOCK_PRIORITIES` and disabled already-selected targets across focus dropdowns.
- **F7 — Live Polling Header Copy (`app.js`):** Updated the Campaign Polling header to `Live Polling` with subtitle `Updates immediately to your actions, although isn't the most reliable source in the world (MoE +/-7)`.

### Packaging & Release Notes
- **Version Bump & Save Compatibility:** Updated version labels across `package.json`, `index.html`, `engine.js`, `persistence-core.js`, `app.js`, `ui-setup-views.js`, `build.ps1`, `BUILD_EXE.bat`, and `build.js` to `0.19.3` (`SAVE_KEY = 'partyChairGame.save.v19.3'` with `PREVIOUS_SAVE_KEY_V192 = 'partyChairGame.save.v19.2'` backward-compatible migration).
- **Executable Packaging:** Added `states-officials-tables.js` to `build.ps1` and rebuilt the Windows executable (`dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`).
