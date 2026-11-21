# Coalition Builder: Party Chair — Version 0.7 Build Design Document
## Build Package: Proposal A ("The Party Machine — Fullscreen Turn Overhaul, Roster & Leadership Hierarchy")

Prepared: November 12, 2026  
Reference Rulebooks: [`GAME_STYLE_GUIDE.md`](GAME_STYLE_GUIDE.md), [`ART_STYLE.md`](ART_STYLE.md), [`DESIGN.md`](DESIGN.md)

---

## 1. Build Scope Overview

This design document specifies the complete implementation plan for **Proposal A**, comprising **3 Large**, **5 Medium**, **10 Small**, and **2 Tiny** changes (**20 total items**):

| Tier | ID | Feature Name | Target Agent |
| :--- | :--- | :--- | :--- |
| **Large (1/3)** | **REQ-06** | Tri-Partisan Electorate Trust System (Base, Independents, Opponents) | Agent 2 (Simulation Engine) |
| **Large (2/3)** | **REQ-09** | Sitting Member Roster with Full Stat Ratings | Agent 1 (Data & Roster) |
| **Large (3/3)** | **REQ-11** | Party Leadership Roles & Passive Impact System (14 Roles) | Agent 2 (Simulation Engine) |
| **Medium (1/5)** | **REQ-01** | Full Tabbed Navigation Overhaul (`Actions`, `Map`, `States`, `Forecast`) | Agent 3 (UI & Maps) |
| **Medium (2/5)** | **REQ-02** | Fullscreen Multi-Step Turn Workflow (Steps 1–4 → Election) | Agent 3 (UI & Maps) |
| **Medium (3/5)** | **REQ-04** | State Senate & Governor Primary Endorsement Flow | Agent 2 & Agent 3 |
| **Medium (4/5)** | **REQ-05** | Incumbent Endorsement Backlash & Sitting Member Happiness | Agent 2 (Simulation Engine) |
| **Medium (5/5)** | **REQ-08** | Multi-Stat Candidate Rating System (8–10 Ratings) | Agent 1 (Data & Roster) |
| **Small (1/10)** | **REQ-03** | Priority Selection Mechanic (3-Region Cap & Budget Override) | Agent 2 & Agent 3 |
| **Small (2/10)** | **REQ-10** | Politician Fame Metric (1–100) & Role Ambition | Agent 1 & Agent 2 |
| **Small (3/10)** | **REQ-13** / **BUG-01** | Senate Class Maps Fix & 2026 Incumbent Roster Audit | Agent 1 & Agent 3 |
| **Small (4/10)** | **REQ-14** | State-Targeted Policy Bills (Legislature Requirement) | Agent 2 & Agent 3 |
| **Small (5/10)** | **REQ-15** | State-by-State Party Chapters (Remove Regional Chapters) | Agent 2 & Agent 3 |
| **Small (6/10)** | **REQ-16** | Expanded & Overlapping Political Regions (8 Cultural/Political Regions) | Agent 1 (Data & Roster) |
| **Small (7/10)** | **REQ-17** | Move Random Events to Future Campaign Phase (Preserve Data) | Agent 2 (Simulation Engine) |
| **Small (8/10)** | **REQ-20** | Dynamic "Major Party" Threshold (≥20% Last Presidential Vote) | Agent 2 (Simulation Engine) |
| **Small (9/10)** | **REQ-32** | National Convention "Keynote Speaker" Slot | Agent 2 & Agent 3 |
| **Small (10/10)** | **REQ-37** | Merge Party Platform & Issue Positions into One System | Agent 2 & Agent 3 |
| **Tiny (1/2)** | **REQ-21** | Starting Party Budgets ($150M Major / $10M Minor / $25M Custom) | Agent 2 (Simulation Engine) |
| **Tiny (2/2)** | **REQ-25** | Set State Recruit Average Quality to 7 | Agent 1 & Agent 2 |

---

## 2. Mandatory Studio Rules for All Agents

Per [`GAME_STYLE_GUIDE.md`](GAME_STYLE_GUIDE.md) and [`ART_STYLE.md`](ART_STYLE.md), every agent working on this build must adhere to the following non-negotiable studio rules:

1. **Battle For America Reference Rule:**
   - Consult Battle For America patterns and formulas when solving shared mechanics (e.g., downballot coattail weights `RACE_WEIGHT.house = 0.34`, Electoral College math, state baseline leans, and generalized state geometry).
   - **Never edit or modify any Battle For America files.** All file writes must stay inside the `Coalition Builder: Party Chair` workspace.
2. **155 Million Represented-Voter Scale:**
   - Every internal voter record represents **100 real voters** (`155,000,000` total represented electorate).
   - **Never** display or mention the `1.55` million internal sample size anywhere in game-facing UI, tooltips, or copy.
3. **Studio Visual & Typography Direction (`ART_STYLE.md`):**
   - **Palette:** Deep Navy (`hsl(226 24% 7%)`), Raised Navy (`hsl(226 21% 12%)`), Warm Ivory (`hsl(42 25% 92%)`), Muted Copper (`hsl(32 48% 48%)`), Muted Teal (`hsl(174 36% 56%)`), Coral (`hsl(7 62% 59%)`), Slate Borders (`hsl(220 14% 26%)`), Democratic Blue (`#3478c8`), Republican Red (`#c9474e`), and solid whole-state Purple for split state legislatures.
   - **Typography:** Serif headings (`Iowan Old Style`, `Palatino`, or `Georgia`), sans-serif body (`Aptos` or `Segoe UI`), condensed sans-serif labels, and monospace numbers/metrics. Maintain the v0.5 responsive scale across desktop, tablet, and mobile widths.
   - **Pixel Art:** Keep candidate portraits (`assets/candidates/`) and icons crisp (`image-rendering: pixelated`) with dark outlines and compact palettes.
   - **Accessibility:** Always preserve visible keyboard focus states and pair color indicators with explicit text labels.
4. **Map Ring Encoding Invariant:**
   - Multi-ring polygons in `maps-0.3.js` must use `!` as the ring delimiter, **never** `|`.
5. **Deferred Boundaries (Do Not Implement in This Build):**
   - Keep "Youth Chapters" as a named UI label only (no mechanics).
   - Do not add incumbent criminal/ethics charge events.
   - Keep 2028 presidential nominees fixed (Jon Ossoff for Democrats; J. D. Vance for Republicans).
   - Do not build a multi-turn post-primary general campaign phase (`DEF-05`); after Step 4 of the turn workflow and primary resolution, resolve the election directly.

---

## 3. Agent Division & Detailed Instructions

To prevent file conflicts and respect modular ownership, the build is divided across **four specialized studio agents**:

1. **Agent 1 — Data, Geography & Roster Architect Agent** (`scenario-2028.js`, `data.js`, `maps-0.3.js`)
2. **Agent 2 — Core Simulation, Party Hierarchy & Election Engine Agent** (`engine.js`)
3. **Agent 3 — Fullscreen Tabbed UI, Turn Workflow & Maps Agent** (`app.js`, `styles.css`, `index.html`)
4. **Agent 4 — QA, Save Migration & Release Packaging Agent** (`build.ps1`, `VERSION_0.7.md`, verification)

---

### Agent 1: Data, Geography & Roster Architect Agent
**Primary Files:** `scenario-2028.js`, `data.js`, `maps-0.3.js`  
**Assigned Items:** `REQ-08`, `REQ-09`, `REQ-10` (Data schema), `REQ-13` / `BUG-01` (Data audit), `REQ-16`, `REQ-25`

#### Instructions for Agent 1:
1. **Multi-Stat Candidate Rating Schema (`REQ-08` — Medium):**
   - Expand candidate and politician data structures from a single `skill` integer to a **10-stat rating object (`ratings`)** where each stat is scored `1–10`:
     1. `persuadability` — Ability to win over undecideds and cross-party voters (feeds `REQ-06` Trust).
     2. `turnout` — Base voter mobilization multiplier in the candidate's state/district.
     3. `debate` — Performance under pressure in primary/general debates.
     4. `charisma` — Public presence, media draw, and keynote/surrogate effectiveness.
     5. `corruption` — Scandal/ethics risk (`1` = squeaky clean / Reformer favorite; `10` = high corruption risk).
     6. `fundraising` — Donor network appeal and self-financing strength.
     7. `fieldcraft` — Ground-game organization and chapter synergy.
     8. `experience` — Legislative/executive governing seasoning and caucus respect.
     9. `mediaSavvy` — Earned media discipline and message control.
     10. `regionalStrength` — Home-region affinity bonus across overlapping regions (`REQ-16`).
   - Retain a computed `quality` composite (`1–10`) for backward compatibility with existing UI badges.
2. **Politician Fame Metric (`REQ-10` — Small, Data Layer):**
   - Add a standalone `fame` integer (`1` to `100`) to every leader, sitting member, and candidate record, completely independent of the `1–10` skill ratings in `REQ-08`.
   - Seed realistic starting Fame values by office tier (e.g., President/Nominees `85–95`, Senate/Governors/National Leaders `50–85`, House Members `20–60`, non-incumbent primary candidates `10–45`).
3. **Sitting Member Roster (`REQ-09` — Large):**
   - Populate a comprehensive `SITTING_MEMBERS` collection in `scenario-2028.js` (and helper generator in `engine.js` for save initialization) covering sitting **U.S. Senators (100)**, **Governors (50)**, and **U.S. House Representatives (435)** by party, state/district, chamber/office, incumbent class, wing/faction, `fame` (`1–100`), `happiness` (`0–100`), and full 10-stat `ratings` (`REQ-08`).
   - Ensure sitting members in races up in 2028 (Senate Class III, 2028 Governors, House districts) are linked directly as the incumbent candidates in their respective primary fields (`isIncumbent: true`).
4. **2026 Senate Incumbent & Winner Data Audit (`REQ-13` / `BUG-01` — Small):**
   - Audit and update Senate seat control and incumbent names across **Class I (2024 winners)**, **Class II (2026 winners)**, and **Class III (2022 winners + 2026 OH special)** in `scenario-2028.js` and `maps-0.3.js`:
     - Verify all AP-called 2026 Senate races are accurately reflected.
     - Explicitly ensure **Alaska (`AK`, Class II)** is held by Democrat **Mary Peltola** (`isIncumbent: true`, party: `'people'`).
     - Explicitly ensure **Mississippi (`MS`, Class II)** is held by Democrat **Scott Colom** (`isIncumbent: true`, party: `'people'`).
     - Count independent senators who caucus with Democrats (e.g., VT, ME) with Democrats on the map per studio rules.
5. **Expanded & Overlapping Political Regions (`REQ-16` — Small):**
   - Add an `OVERLAPPING_REGIONS` dictionary and a `regions: [...]` array on every state record in `scenario-2028.js` and `data.js` supporting multi-region membership across the 8 required cultural/political regions:
     - `Prairie States` (e.g., ND, SD, NE, KS, OK, IA, MN, MT, WY)
     - `Pacific Northwest` (e.g., WA, OR, ID, AK)
     - `Deep South` (e.g., AL, MS, GA, SC, LA, AR, FL, TX)
     - `Appalachia` (e.g., WV, KY, TN, VA, NC, OH, PA)
     - `New England` (e.g., ME, NH, VT, MA, RI, CT)
     - `Rust Belt` (e.g., PA, OH, MI, WI, IN, IL, NY, WV)
     - `Great Lakes States` (e.g., MI, WI, MN, IL, IN, OH, PA, NY)
     - `The Rockies` (e.g., CO, UT, ID, MT, WY, NV, NM, AZ)
   - Ensure states that lack one of the 8 subregions (or overlap multiple, such as OH/PA in Rust Belt + Appalachia + Great Lakes, or MT/WY in The Rockies + Prairie States) have accurate `regions` arrays while preserving legacy macro-region fallback where needed.
6. **Recruit Average Quality Tuning (`REQ-25` — Tiny):**
   - Update the state candidate recruit generator so generated state recruits have an **average quality rating of `7`** (on the `1–10` scale across their positive ratings in `REQ-08`).

---

### Agent 2: Core Simulation, Party Hierarchy & Election Engine Agent
**Primary File:** `engine.js`  
**Assigned Items:** `REQ-03` (Engine), `REQ-04` (Engine), `REQ-05`, `REQ-06`, `REQ-10` (Progression), `REQ-11`, `REQ-14`, `REQ-15`, `REQ-17`, `REQ-20`, `REQ-21`, `REQ-32`, `REQ-37` (Engine)

#### Instructions for Agent 2:
1. **Dynamic "Major Party" Rule (`REQ-20` — Small) & Starting Budgets (`REQ-21` — Tiny):**
   - Implement `isMajorParty(game, partyId)` returning `true` if the party received **≥ 20% of the national popular vote in the last presidential election** (Democrats and Republicans start at `true` in 2028 from 2024 results; updates dynamically after each presidential election).
   - Set starting National Committee budgets (`REQ-21`) in `createGame()`:
     - **Major Parties (Democratic, Republican):** `$150M` (`150`)
     - **Minor Parties (Libertarian, Green):** `$10M` (`10`)
     - **Custom Party:** `$25M` (`25`)
2. **Tri-Partisan Electorate Trust System (`REQ-06` — Large):**
   - Add `party.trust = { supporters: 65, independents: 50, opponents: 25 }` (0–100 scale) for the player and rival parties.
   - **Gameplay Effects:**
     - `supporters`: Multiplies base voter turnout in all states and reduces third-party defections.
     - `independents`: Drives swing-voter capture and persuasion margins across state and district races.
     - `opponents`: Governs cross-party appeal and **second-choice transfer share in close 3-party / 4-party ranked-choice and plurality splits** (higher opponent trust wins transfer ballots from eliminated parties and reduces tactical voting against your party).
   - Wire candidate `persuadability` and `charisma` (`REQ-08`), platform consistency (`REQ-37`), priority selection (`REQ-03`), and leadership passives (`REQ-11`) into trust adjustments.
3. **Party Leadership Roles & Passive Impact System (`REQ-11` — Large) + Fame Ambition (`REQ-10` — Small):**
   - Implement the **14 structured Party Leadership Roles** on each party, with automatic initial assignment for Major Parties (all eligible roles filled) and Minor Parties (all roles they qualify for filled):
     - **Category A — Institutional, Legislative & Executive Leaders (Legislators/Officeholders Only):**
       1. `senateLeader` — **Senate Leader** *(Req: ≥ 1 Senate seat; must be a sitting Senator from `REQ-09`)*
       2. `houseLeader` — **House Leader** *(Req: ≥ 1 House seat; must be a sitting House member)*
       3. `senateWhip` — **Senate Whip** *(Req: ≥ 10 Senate seats; must be a sitting Senator)*
       4. `houseWhip` — **House Whip** *(Req: ≥ 10 House seats; must be a sitting House member)*
       5. `speakerOfHouse` — **Speaker of the House** *(Req: Party holds the most House seats; must be a sitting House member)*
       6. `govAssocChair` — **Chair of the Governors Association** *(Req: ≥ 1 Governorship; must be a sitting Governor)*
       7. `president` — **President** *(Req: Party holds the Presidency; provides **5x normal passive impact**)*
       8. `vicePresident` — **Vice President** *(Req: Party holds the Presidency)*
     - **Category B — Party, Media & Faction Leaders (Can & Should Overlap with Category A Officeholders):**
       9. `rhetoricalLeader` — **Rhetorical Leader** *(Public/media face; passively boosts `independents` and `opponents` trust based on `charisma` and `persuadability`)*
       10. `policyLeader` — **Policy Leader** *(Private role; impacts the opinion/happiness of **party members and sitting legislators only**, never the general public)*
       11. `faction1Leader` — **Faction 1 Leader**
       12. `faction2Leader` — **Faction 2 Leader**
       13. `faction3Leader` — **Faction 3 Leader**
       14. `faction4Leader` — **Faction 4 Leader**
   - **Fame Progression & Ambition (`REQ-10`):**
     - Increase a politician's `fame` (`1–100`) each cycle from holding office (scaled by office prestige), major moments/keynotes (`REQ-32`), and presidential runs.
     - High-Fame politicians (`fame >= 75`) expect a major leadership role in `REQ-11`; leaving them unappointed reduces their personal happiness and pulls down `sittingMemberHappiness` (`REQ-05`).
4. **Primary Endorsements (`REQ-04` — Medium) & Incumbent Backlash / Sitting Member Happiness (`REQ-05` — Medium):**
   - Replace the old generic "5 endorsements per turn" cap with a per-race primary endorsement dictionary (`game.primaryEndorsements[raceKey] = candidateId`) covering every active **Senate Class III** and **2028 Governor** primary race.
   - Endorsing a candidate grants a strong primary polling boost (`+12` to `+18` points, scaled by party chair standing and candidate `fieldcraft`).
   - **Incumbent Protection Rule (`REQ-05`):**
     - Maintain `game.sittingMemberHappiness` (`0–100`, starting at `70`).
     - If a race has a sitting incumbent of the player's party (`isIncumbent: true`) and the player endorses a **different** candidate in that primary, trigger **massive backlash**: immediate `-18` drop to `sittingMemberHappiness`, `-8` to `trust.supporters`, and angry log feedback from sitting legislators.
     - `sittingMemberHappiness` modifies legislative bill success (`REQ-14`), incumbent re-election turnout, and annual fundraising yield.
5. **Unified Platform (`REQ-37` — Small) & 3-Region Priority Cap with Budget Override (`REQ-03` — Small):**
   - **Unified Platform (`REQ-37`):** Remove the legacy `platform-left` / `platform-right` 4-axis action. Adjusting any of the 40 issue sliders in Step 1 (`REQ-02`) directly updates the party's platform and recalculates the 4 summary ideological axes from the weighted average of the 40 issue stances.
   - **Priority Selection (`REQ-03`):**
     - Allow the player to select **3 core issue priorities** AND up to **3 regional priorities** (from the 8 overlapping regions in `REQ-16`) at **$0 cost**.
     - Allow selecting **additional regional priorities beyond 3** by sacrificing National Committee budget (**`$8M` per extra region beyond the 3rd**).
     - Prioritized regions grant a support and turnout bonus across all states belonging to those overlapping regions.
6. **State-Targeted Policy Bills (`REQ-14` — Small) & State-by-State Chapters (`REQ-15` — Small):**
   - **State-Targeted Bills (`REQ-14`):** Restrict `introduce-bill` so it requires selecting a target `stateId` where the player's party currently controls at least one chamber (or unified control) of the state legislature. Passing the bill applies a **very large positive support and issue-alignment boost (`+4.5` points)** in that specific state.
   - **State-by-State Chapters (`REQ-15`):** Refactor the "Open a chapter" action, leader tour chapter gains, and rival chapter growth to target a specific `stateId` (all 50 states) rather than the 4 legacy macro-regions.
7. **National Convention Keynote Speaker (`REQ-32` — Small) & Defer Random Events (`REQ-17` — Small):**
   - **Keynote Speaker (`REQ-32`):** Once per election cycle (available during Step 4: *Choose This Year's Work* or pre-election convention), let the chair pick one sitting member or candidate (`REQ-09`) as **Keynote Speaker**—granting **`+25 Fame`** (`REQ-10`), `+8` faction confidence to their wing, and `+2.0` turnout across all states in their home overlapping region (`REQ-16`).
   - **Defer Random Events (`REQ-17`):** Stop triggering mandatory `pendingEvent` ("Party Moment") blocks during the organizing turn sequence (`REQ-02`), and remove the post-primary 4-turn general campaign loop so the election resolves directly after primaries/forecasters. **Do not delete `EVENTS` or event-resolution functions**—mark them in code comments as reserved for `DEF-05` (Full Campaigning System).

---

### Agent 3: Fullscreen Tabbed UI, Turn Workflow & Maps Agent
**Primary Files:** `app.js`, `styles.css`, `index.html`  
**Assigned Items:** `REQ-01`, `REQ-02`, `REQ-04` (UI), `REQ-13` / `BUG-01` (Map UI fix), `REQ-37` (UI)

#### Instructions for Agent 3:
1. **Top-Level Fullscreen Tabbed Navigation (`REQ-01` — Medium):**
   - Replace the single long vertical page with a persistent top navigation bar below the compact dashboard header cards:
     - `Actions` — The guided fullscreen multi-step turn workflow (`REQ-02`).
     - `Map` — Fullscreen National Political Map view (President, House, Senate Classes I/II/III, Governors, State Legislatures).
     - `States` — Fullscreen State-by-State directory showing state chapters (`REQ-15`), overlapping regions (`REQ-16`), state legislature control (`REQ-14` eligibility), sitting members (`REQ-09`), and state recruits (`REQ-25`).
     - `Forecast` — Fullscreen National Environment, Tri-Partisan Trust meters (`REQ-06`), Electoral College & Chamber Projections, and Party Leadership Roles roster (`REQ-11`).
   - Clicking any tab switches the main viewport in fullscreen takeover mode cleanly styled to `ART_STYLE.md`.
2. **Fullscreen 4-Step Guided Turn Workflow (`REQ-02` — Medium):**
   - Inside the `Actions` tab, present a fullscreen step-by-step wizard with a top progress bar (`Step 1 of 4` through `Step 4 of 4`) and explicit `Back` / `Next Step` / `Confirm Turn` buttons:
     - **Step 1: Issue Positions (Unified Party Platform — `REQ-37`)** — Fullscreen category tabs and 1–10 sliders for the 40 national issues.
     - **Step 2: Party & Regional Priorities (`REQ-03`)** — Pick 3 core issue priorities and up to 3 free regional priorities from the 8 overlapping regions (`REQ-16`), with a clear toggle to spend `$8M` of party budget for each additional prioritized region.
     - **Step 3: Primary Endorsements (`REQ-04` & `REQ-05`)** — Fullscreen state-by-state browser for all active **Senate Class III** and **2028 Governor** primaries. Displays each candidate's 10-stat bars (`REQ-08`), `Fame` badge (`REQ-10`), and an explicit **`INCUMBENT`** warning badge (`REQ-05`) if a sitting member of the player's party is in the race (warning that endorsing a challenger will severely penalize Sitting Member Happiness). Allows endorsing 1 candidate per race.
     - **Step 4: Choose This Year's Work** — Fullscreen grid of yearly organizational actions: State-by-State Chapter Expansion (`REQ-15`), State Candidate Recruitment (`REQ-25`), State-Targeted Policy Bills (`REQ-14`), Party Leadership Role Assignments (`REQ-11`), National Convention Keynote Selection (`REQ-32`), Faction Summits, Leader Tours, and Fundraising.
   - On turn 20 confirmation, resolve primaries and transition directly into Election Night resolution (`REQ-02`, `REQ-17`).
3. **Senate Class I, II, and III Maps Rendering Fix (`REQ-13` / `BUG-01` — Small):**
   - Inspect the map-mode and Senate-class selector logic in `app.js`. Fix any conditional hiding or broken state selector so that **Senate Class I**, **Senate Class II**, and **Senate Class III** buttons are always visible, clickable, and render their respective 33/33/34-seat state fills and incumbent tooltips accurately on the national SVG map.
4. **Tutorial Adaptation:**
   - Update tutorial step selectors in `app.js` to navigate across the new top-level tabs (`Actions`, `Map`, `States`, `Forecast`) and step controls while preserving the studio rule that players must click real controls (or `Skip`).

---

### Agent 4: QA, Save Migration & Release Packaging Agent
**Primary Files:** `engine.js` (migration), `build.ps1`, `VERSION_0.7.md`

#### Instructions for Agent 4:
1. **Save Migration & State Hydration:**
   - Update `migrateSave()` in `engine.js` so existing v0.5 / v0.6 saves load without errors, automatically populating default `trust` (`REQ-06`), `sittingMemberHappiness` (`REQ-05`), `sittingMembers` (`REQ-09`), `leadershipRoles` (`REQ-11`), `primaryEndorsements` (`REQ-04`), and state-level chapter maps (`REQ-15`).
2. **Verification Checklist:**
   - Confirm 155M represented-voter scale is preserved everywhere and `1.55` never appears in UI text.
   - Confirm Senate Class I, II, and III maps all render and show **Mary Peltola** in AK and **Scott Colom** in MS (`BUG-01` / `REQ-13`).
   - Confirm multi-ring map polygons use `!` delimiter.
   - Confirm starting budgets are `$150M` (Major), `$10M` (Minor), and `$25M` (Custom).
3. **Build Executable:**
   - Run `./build.ps1` to compile `dist/release/Coalition Builder - Party Chair.exe` and write release notes in `VERSION_0.7.md`.
