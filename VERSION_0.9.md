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
