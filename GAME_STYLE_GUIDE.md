# Coalition Builder: Party Chair — Game Style & Design Rules

This document is the authoritative style, design, data, and engineering rulebook for all agents working on **Coalition Builder: Party Chair**.

---

## 1. Studio Alignment & Battle For America Reference Rule (Start Here)

1. **Consult Battle For America First When Solving Problems:**
   - Always look at **Battle For America** code and data structures when solving engineering, UI, map, or simulation problems. Many of the problems in this game have already been solved there, and having similar mechanics, formulas, and feel across games in the same studio is an explicit design goal (e.g., state baseline leans, Electoral College handling, downballot coattail weights such as `RACE_WEIGHT.house = 0.34`, and generalized state geometry).
2. **Read-Only Reference Boundary:**
   - You are authorized and encouraged to read Battle For America files for reference, patterns, and baseline data, **but you must NEVER edit, overwrite, or modify any Battle For America files**. All work belongs strictly inside the **Coalition Builder: Party Chair** project directory.

---

## 2. Core Game Philosophy: Continuous Multi-Cycle Political Evolution (Prominent Rule)

**Coalition Builder: Party Chair is designed as a continuous game with an evolving set of parties, voters, maps, and politics over the years.** It is never a static one-off simulation.

1. **Continuous Multi-Year Progression:**
   - Playthroughs unfold continuously across consecutive cycles (2028, 2030, 2032, 2036, and beyond).
   - Past decisions, legislative records, committee budgets, and leadership changes echo through the decades, creating a persistent, living political history.
2. **Evolving Electorate & Realignment Between Elections:**
   - **Maintained Voting Blocks:** Parties maintain their current voting blocks between elections rather than resetting to hardcoded baselines.
   - **Performance-Driven Voter Shifts:** Parties that do well in elections gain voters; parties that do poorly lose voters.
   - **Defining 'Doing Well':** Doing well is **not defined by winning or losing seats**—it is defined by winning more of the popular vote than expected.
   - **Expected Vote Baseline (Non-Independent Voters):** Expected vote percentage is determined by a party's share of the **total number of non-independent voters**, not as a percentage of the overall electorate. For instance, if Republicans hold 45% of non-independent voters, their expected popular vote is 45%.
   - **The 1/4th Shift Rule:** Voting blocks shift by **1/4th of the difference** between actual popular vote and expected vote ($\Delta \text{Share} = \frac{\text{Actual} - \text{Expected}}{4}$ of **ALL** voters).
     - *Example 1:* Overperforming by 20 points ($+20\%$) gains **5% of ALL voters** ($20\% / 4 = 5\%$).
     - *Example 2:* Holding 45% of non-independent voters but winning 40% of the vote (underperforming by 5 points) loses **1.25% of all voters** (about 1%). Inversely, winning 45% with a 40% baseline gains **1.25% of all voters** (about 1%).
   - **Between Elections Invariant (Strict Rule):** **Parties DO NOT gain voters during elections, ONLY between elections.** During the active 15-week general campaign and election night, voter registration and baseline blocks are fixed. Realignments are calculated and applied exclusively during the inter-election cycle transition.
3. **Evolving Maps, Parties, and Politics:**
   - Over decades, demographic shifts, political trends (`LTA-01`), dynamic issues (`LTA-02`), and state-party policy divergences (`LTA-03`) reshape state leans, congressional battlegrounds, and party coalitions.
4. **Semi-Scripted Opening Environment & De Facto Narrative Arc (2028–2032):**
   - The opening years of a new save follow a **semi-scripted national environment and political trajectory** to establish authentic momentum before fully opening up:
     - **2028 Opening Environment:** Starts at **D+9**, naturally shifting to **D+14** by the general election assuming no counter-campaign actions take place.
     - **First-Term Governing Fatigue:** As President Jon Ossoff and the Democratic administration govern, they face steady governing wear-and-tear, becoming progressively more unpopular across their first term.
     - **2030 Midterm Backlash:** The first midterm (2030) is designed as a **rough, challenging cycle for Democrats held in a distinctly Republican-leaning environment** (mirroring the historical midterm backlash).
     - **2032 Re-election Crucible:** Ossoff faces a razor-thin re-election contest where winning or losing is decided organically by the player's strategic choices, resource management, and campaign execution.
     - **Post-2032 Open Sandbox:** After the 2032 election, the simulation's semi-scripted rails fall away completely, and the political universe opens up into a fully emergent, dynamic multi-decade sandbox.
   - **Emergent Narrative Rule (Strict Aesthetic):** This is **not an official, rail-roaded story** presented through scripted pop-up dialogue or fixed cutscenes. It is the **de facto story the player experiences and tells themselves** through the living numbers, shifting environment gauges, forecaster predictions, and election night returns.
5. **Party Systems Framework (7th to 8th Party System):**
   - Macro historical eras are officially designated as **"Party Systems"**.
   - The game begins in the **7th Party System** (2028).
   - The transition to an **8th Party System** is designed to occur between **2040 and 2060** when triggered by historic structural realignments (20+ point national blowouts, 40+ trifectas, third-party breakthroughs, independent presidencies, or ideological extremist presidencies).
   - **Massive Update Protocol:** The Party Systems mechanic constitutes a **Massive** update tier (above Huge) designed to be developed across multiple days of dedicated instructions. The assistant must proactively remind the owner to continue developing Massive updates after any release that does not include one.
6. **Continuous Inter-Cycle Election Advancement & Macro Environment Benchmarks:**
   - Playthroughs advance continuously every 2 years, systematically updating the political landscape:
     - **Senate Class Rotation:** Rotates the active constitutional Senate class: $\text{Class III} \longrightarrow \text{Class I} \longrightarrow \text{Class II} \longrightarrow \text{Class III}$.
     - **Midterm / Presidential Alternation:** Toggles strictly between Midterm elections and Presidential election years.
     - **Gubernatorial 4-Year Staggered Schedules:** 36 states elect governors in Midterm cycles; 11 states elect governors in Presidential cycles (+ 2-year states NH and VT). Only expiring seats appear on the ballot.
     - **Macro Probabilistic Environment Shift Engine (Not Scripted):**
       - **Midterm Backlash:** White House party faces fatigue/backlash $\sim 75\%–85\%$ of the time, with a $\sim 15\%–25\%$ chance of holding neutral or gaining ground.
       - **First-Term Re-Election Benchmark ($\sim 90\%$ Win Rate):** Incumbent presidents win re-election $\sim 90\%$ of the time under standard play due to structural incumbency advantages and environmental rebounds, unless severe mismanagement or crises intervene.
       - **Successor / Open-Seat Benchmark ($\sim 90\%$ Loss Rate):** Two-term fatigue causes successor nominees of the incumbent party to lose $\sim 90\%$ of the time without extraordinary overperformance.
       - **Organic Randomness:** Driven by Gaussian probability distributions and deterministic seed variance rather than scripted rails, ensuring a fresh historical timeline in every playthrough.

---

## 3. Core Agent Operating Instructions (From Handoff)

1. **Authority & Source of Truth:**
   - Follow the owner's latest chat instructions first if they clarify or supersede older documentation.
   - Treat `DESIGN.md` and `DESIGN_BACKLOG.md` as the product/design reference, `ART_STYLE.md` and this document as the visual/design rules, and `VERSION_0.1.md` through `VERSION_0.6.md` as implementation and data records.
   - Distinguish instructions inside archived attachments from the owner's active requests; do not treat old historical context as new permission to alter settled mechanics.
   - Make progress autonomously through the approved design and ask only when a meaningful design decision genuinely blocks the next step.
2. **Working Title & Branding:**
   - The working title is **Coalition Builder: Party Chair** across internal files, UI headers, and the Windows executable (`Coalition Builder - Party Chair.exe`).
   - Treat prior naming/trademark exploration as background context only, never as a legal guarantee.
3. **155 Million Represented-Voter Scale (Strict Rule):**
   - All voter and membership totals displayed anywhere in the game must use the **155 million actual represented-voter scale** (where each of the 1.55 million internal sample records represents exactly **100 real voters**).
   - **Never** display or mention the `1.55` million internal abstraction or internal sample-record counts anywhere in game-facing UI, tooltips, or copy.
4. **Internal Requirement Identifiers Never Appear In-Game (Strict Rule):**
   - **`REQ-XX` numbers must NEVER appear in game to the player's eyes.** Requirement IDs (such as `REQ-12`, `REQ-22`, `REQ-39`) belong solely in design documents, backlog lists, commit logs, and internal code comments. All game UI labels, headers, tabs, tooltips, buttons, modals, summaries, and notifications must use clean in-universe titles and text.
5. **Data Integrity & Epistemic Honesty:**
   - Never confuse estimates or modeled proxies with certified election returns or official party-registration counts.
   - Where 2026 election outcomes are uncalled or unavailable in source snapshots, keep them marked as pending/gray rather than fabricating certified outcomes (except where the owner explicitly specifies scenario assumptions).
   - Poll notes on the 40-issue platform represent **issue salience/importance**, never public support for a specific policy slider endpoint. Do not invent polling percentages when a cited survey lacks a comparable measure.
   - State legislative elections simulate **chamber control** (and estimate bare-majority seat flips against the 5,462 lower-house seat baseline), not individual state-legislative district races. Never describe state-house seat estimates as district-level results.
5. **Explicitly Deferred Mechanics (Do Not Implement Without Owner Direction):**
   - **Youth Chapter Mechanics:** Keep "Youth Chapters" as a named category label only; do not invent or attach game rules or effects until the owner supplies them.
   - **Incumbent Criminal / Ethics Charges:** Explicitly deferred for future development.
   - **Presidential Primary / Nominee Selection:** The 2028 scenario uses fixed tickets (**Jon Ossoff** for Democrats with a South turnout boost; **J. D. Vance** for Republicans with a Midwest turnout boost). Do not add presidential primary selection until requested.
   - **Multi-Turn General Campaign & Raw Pre-Election Polling:** Under the active backlog transition (`REQ-02`, `REQ-12`, `DEF-05`, `DEF-06`), general elections resolve after primary selection and satirical forecaster projections (*Sallow* & *Cook* parodies), without raw pre-election numerical polls.
6. **Executable Build Discipline:**
   - Rebuild the self-contained Windows executable using `./build.ps1` after source changes.
   - `dist/release/Coalition Builder - Party Chair.exe` is the canonical build output (ensure `dist/` is also refreshed when unlocked).
   - Runtime files and assets are bundled into the executable; raw source shapefiles and Census CSV archives in `obj/` stay out of the binary payload.
7. **Obscures Some Information & Atmospheric Vibes (Strict Design Rule):**
   - The game deliberately **obscures some information** rather than being overly forward or explicit with mathematical formulas.
   - Do not display meta-design explanations or developer rationale (e.g., avoid UI labels like 'Sole Pre-Election Ratings').
   - For state policies and actions, do not expose exact mathematical probability percentages (e.g., '80% chance of success') or raw deterministic bounds to the player; instead, present qualitative thematic 'vibes' describing potential benefits and the risk of voter backlash.
   - Strategic gameplay relies on reading political moods, regional instincts, and narrative signals rather than calculating transparent formulas.
8. **Google Drive Document Compatibility (Strict Rule — Nov 14, 2026):**
   - **Never create documents, spreadsheets, data exports, or written reports that are incompatible with Google Drive.**
   - All spreadsheets must be delivered in standard, native Google Drive formats (standard Google Sheets-ready `.xlsx` or clean standard UTF-8 `.csv` without non-standard characters or broken delimiters).
   - All written design documents, reports, and exported guides must use clean Google Docs / Google Drive-compatible formats (standard `.docx`, clean standard Markdown `.md`, or plain `.txt`) that preview, render, convert, and edit seamlessly in Google Drive.
   - Never output proprietary binary formats, obscure extensions, or documents that fail to preview or import into Google Drive.

9. **TBD Updates Document Protocol (Strict Rule — Nov 14, 2026):**
   - **All TBD changes, conceptual queue ideas, and exploratory reminders must be tracked exclusively in [TBD_UPDATES.md](TBD_UPDATES.md).**
   - Whenever the user/project owner instructs to add a "TBD" feature or note to the design document or backlog, **add it directly to `TBD_UPDATES.md` instead**.
   - `DESIGN_BACKLOG.md` maintains active, sized requirements and historical updates; conceptual exploratory items belong in `TBD_UPDATES.md`.
10. **Minor Version Build Protocol (`0.0.x` — Nov 14, 2026):**
    - Whenever the project owner says **"build a minor version"**, design a new update for the game that packages:
      - **All pending Small and Tiny proposals.**
      - **Up to 5 pending Medium proposals.**
      - *(No Huge or Major requirement is required for minor versions).*
    - **Version Numbering:** Minor versions increase the third version number (`0.0.x`, where `x` increments: e.g. `0.14.3` $\to$ `0.14.4`), unlike major versions which increase the second digit (`0.x.0`).
    - **Standard Packaging Discipline:** Provide a copy-pastable implementation handoff for the coding agent, reduce token usage wherever possible, and ensure the design documents (`DESIGN.md`, `PRIOR_UPDATES.md`, and `DESIGN_BACKLOG.md`) are updated after implementation.
    - **Standalone Code-Edit Auto-Versioning (Nov 17, 2026):** Whenever a standalone agent edits code and finishes its task—and is **not** a subagent or one of several parallel agents (unless acting as the Integration Agent)—it must automatically classify those changes as a new minor version (`0.x.(y+1)`), bumping `package.json`, `engine.js` (`SAVE_KEY` + version strings with backward-compatible save migration), and `app.js` UI badges, logging the release in `PRIOR_UPDATES.md` (plus `DESIGN.md` / `DESIGN_BACKLOG.md` as applicable), verifying tests, and rebuilding the Windows executable via `./build.ps1`.

---

## 3. Visual & Interface Style Rules (Studio Style Guide)

All UI work must follow the AI Games Studio art direction (`ART_STYLE.md`), not the U.S. Web Design System:

1. **Color Palette:**
   - **Deep Navy (Background):** `hsl(226 24% 7%)`
   - **Raised Navy (Panels/Cards):** `hsl(226 21% 12%)`
   - **Warm Ivory (Primary Text):** `hsl(42 25% 92%)`
   - **Muted Copper (Accents/Highlights):** `hsl(32 48% 48%)`
   - **Muted Teal (Secondary Accents/Interactive):** `hsl(174 36% 56%)`
   - **Coral (Warnings/Alerts):** `hsl(7 62% 59%)`
   - **Slate Borders:** `hsl(220 14% 26%)`
   - **Party Identity Colors:** Recognizable real American party colors — **Democratic Blue** (`#3478c8`) and **Republican Red** (`#c9474e`), plus distinct third-party colors for Libertarian and Green, and **Purple** for split state legislative chamber control.
2. **Typography & Sizing Scale:**
   - **Headings:** Serif face (`Iowan Old Style`, `Palatino`, or `Georgia`).
   - **Body Copy:** Clean sans-serif (`Aptos` or `Segoe UI`).
   - **Labels & Badges:** Condensed sans-serif.
   - **Numbers, Metrics & Tables:** Monospace for clean alignment and scannability.
   - **Scale History:** Maintain the refined readable scale (v0.2.1 tripled the base scale; v0.2.2 reduced by 20%; v0.5 reduced by another 20% and refit cards for desktop, tablet, and phone widths).
3. **Layout & Navigation Architecture:**
   - The interface must fill the full available window width and height without a narrow centered page cap, flowing vertically when needed.
   - **Dashboard Summary Cards:**
     1. `{Party Name}’s National Committee budget` (Treasury)
     2. `Millions of Members` (displayed in decimal millions on the 155M voter scale)
     3. `Local Chapters` (including Youth Chapters label)
     4. `State Houses Controlled` (with party-held seats out of 5,462 national lower-house seats in smaller text)
     5. `Senate Seats Controlled`
     6. `House Seats Controlled`
   - **Tabbed Fullscreen Navigation (`REQ-01` direction):** Top-of-screen persistent tab bar (`Actions`, `Map`, `States`, `Forecast`) where each tab acts as a clean fullscreen view.
4. **Pixel Art & Iconography:**
   - Keep pixel-art candidate portraits (`assets/candidates/`, from `candidate-art-clean-v3`) and icons crisp (`image-rendering: pixelated`), with clear silhouettes, compact palettes, and dark outlines. Never apply blur, photographic textures, or airbrushed gradients.
   - Standalone UI icons use a `64×64` grid with transparent backgrounds.
   - Application icon (`assets/coalition-builder-icon.svg`) is a `512×512` opaque square featuring a simplified U.S. silhouette and checkmark on deep navy.
5. **Accessibility & Interactive Polish:**
   - Always preserve visible keyboard focus states.
   - Pair color coding with explicit text labels and high contrast so party control and status are never communicated by color alone.

9. **TBD Updates Document Protocol (Strict Rule — Nov 14, 2026):**
   - **All TBD changes, conceptual queue ideas, and exploratory reminders must be tracked exclusively in [TBD_UPDATES.md](TBD_UPDATES.md).**
   - Whenever the user/project owner instructs to add a "TBD" feature or note to the design document or backlog, **add it directly to `TBD_UPDATES.md` instead**.
   - `DESIGN_BACKLOG.md` maintains active, sized requirements and historical updates; conceptual exploratory items belong in `TBD_UPDATES.md`.
10. **Minor Version Build Protocol (`0.0.x` — Nov 14, 2026):**
    - Whenever the project owner says **"build a minor version"**, design a new update for the game that packages:
      - **All pending Small and Tiny proposals.**
      - **Up to 5 pending Medium proposals.**
      - *(No Huge or Major requirement is required for minor versions).*
    - **Version Numbering:** Minor versions increase the third version number (`0.0.x`, where `x` increments: e.g. `0.14.3` $\to$ `0.14.4`), unlike major versions which increase the second digit (`0.x.0`).
    - **Standard Packaging Discipline:** Provide a copy-pastable implementation handoff for the coding agent, reduce token usage wherever possible, and ensure the design documents (`DESIGN.md`, `PRIOR_UPDATES.md`, and `DESIGN_BACKLOG.md`) are updated after implementation.
    - **Standalone Code-Edit Auto-Versioning (Nov 17, 2026):** Whenever a standalone agent edits code and finishes its task—and is **not** a subagent or one of several parallel agents (unless acting as the Integration Agent)—it must automatically classify those changes as a new minor version (`0.x.(y+1)`), bumping `package.json`, `engine.js` (`SAVE_KEY` + version strings with backward-compatible save migration), and `app.js` UI badges, logging the release in `PRIOR_UPDATES.md` (plus `DESIGN.md` / `DESIGN_BACKLOG.md` as applicable), verifying tests, and rebuilding the Windows executable via `./build.ps1`.

---

## 4. Game Design & Simulation Rules

### 4.0 Core Genre & Design Identity: Political Grand Strategy
- **Grand Strategy with a Politics Theme:** *Coalition Builder: Party Chair* is a **macro grand-strategy game with a political theme**, not a tactical candidate-campaign simulator.
- **Party Chair Perspective:** Mechanics should focus on high-level strategic tradeoffs—budget triage, Super PAC and faction negotiations, leadership appointments, regional prioritization, and coalition cohesion—rather than granular candidate-level campaign actions (such as scheduling individual rallies, bus tours, or door-knocking).
- **Future 15-Turn Campaign Phase:** Even when the 15-turn weekly campaign phase is added, player interactions must remain grand-strategy decisions (weekly Super PAC allocation requests, resource triage, macro messaging/damage control, and coalition management) rather than micro-level candidate campaigning.

### 4.1 Parties, Chapters & Starting Footprint
- **Major Parties (Democratic & Republican):** Start with mature organizations in all 50 states and **800 independently tracked local chapters** each, weighted by state 2020 House apportionment (population proxy) and partisan lean, with at least 1 chapter in every state. Players manage competition against the rival major party rather than building a major party from zero.
- **Third Parties (Libertarian & Green) & Custom Parties:** Start with smaller national organizations and chapter footprints; custom parties inherit an archetype's base at a smaller scale in exchange for custom platform positioning.

### 4.2 National Maps & Geography
- **Five Core Map Views:**
  1. **President:** 50 states + DC (538 EV, 270 to win), Electoral College scoreboard banner, state EVs, margins, ratings, and downballot coattail display.
  2. **U.S. House:** All 435 congressional districts using 2026 TIGER/Line (`CD120`) boundaries (and Missouri's `CD119` map per Supreme Court order).
  3. **U.S. Senate:** All three staggered classes (**Class I** from 2024 winners, **Class II** from 2026 outcomes/assumptions, **Class III** from 2022 winners + Ohio 2026 special election). Independent senators who caucus with Democrats count with Democrats on the map. All three class views must always render and be selectable (`REQ-13` / `BUG-01`).
  4. **Governorships:** All 50 states, highlighting the 11 states with scheduled 2028 gubernatorial contests.
  5. **State Legislatures:** Whole-state fill showing chamber control — single party color when unified, **solid purple fill across the entire state** when chambers are split (never slash or split the state polygon), nonpartisan for Nebraska.
- **Map Encoding Rule:** Multi-ring polygon encoding in `maps-0.3.js` must use `!` as the ring delimiter, never `|` (which collides with Google polyline characters).

### 4.3 Issues, Platform & Factions
- **40-Issue National Platform (`issues-0.2.1.js`):**
  - Organized across 7 categories with `1–10` integer sliders and two labeled policy endpoints per issue.
  - Adjusting an issue costs 1 leadership action and shifts the party's underlying ideological axis.
  - **Three Priorities (`REQ-03`):** Selecting 3 core priorities elevates voter salience, shapes faction confidence, and defines party identity.
- **Internal Factions & Wings:**
  - Six core coalition groups (Organizers, Pragmatists, Workers & Producers, Reformers, Local Leaders, Small Donors) plus 4 ideological wings per major party (Democrats: Progressive, Moderate, Labor, Local-Coalition; Republicans: MAGA, Moderate, Faith-and-Community, Business-Conservative).
  - Any faction below 45 confidence penalizes party turnout in every state (capped at 9 points total).

### 4.4 Candidates, Primaries, Recruitment & Party Leadership
- **Race-Specific Primary Fields:**
  - Every House, Senate Class III, 2028 Governor, and State Legislative chamber race has a distinct, race-specific primary field of at least 4 candidates spanning the party's ideological wings, with 2–3 polling competitively. Never reuse identical candidate fields across races.
- **State Candidate Recruitment:**
  - Each state maintains a pool of potential primary recruits with wide quality variation (`1–10`).
  - Encouraging a recruit costs resources (`$2M + quality` in `$M`) and 1 leadership action.
  - **Permanent Risk:** If an encouraged recruit loses their primary, their ideological wing loses confidence (`-2.5`) and the recruit is permanently removed from future availability.
- **Endorsements, Incumbents & Sitting Member Happiness (`REQ-04`, `REQ-05`):**
  - In active primary races, endorsing a challenger against a sitting party incumbent triggers major backlash and reduces **Sitting Member Happiness**.
- **Candidate & Sitting Member Ratings (`REQ-08`, `REQ-09`, `REQ-10`):**
  - Politicians carry 8–10 distinct skill ratings (including Persuadability, Turnout, Debate, Charisma, Corruption) plus a separate **1–100 Fame** metric that drives ambition for **Party Leadership Roles** (`REQ-11`).

### 4.5 Turn Structure, Coattails & Tutorial
- **20-Turn Organizing Phase & Guided Turn Flow (`REQ-02`):**
  - Organizing runs for 20 chair turns before primaries resolve.
  - Turn workflow follows a structured sequence: Party Moment → Issue Positions → 3 Priorities → Primary Endorsements → Yearly Organization/Recruitment Work.
- **Presidential Coattails (Battle For America Model):**
  - Top-of-ticket presidential margins apply a **34% coattail effect** to U.S. House races (`RACE_WEIGHT.house = 0.34`), **55%** to Senate Class III races, and **42%** to Gubernatorial races.
- **Interactive Tutorial (`VERSION_0.4.md`):**
  - Must highlight the live UI control in focus and require actual game button interactions to advance (no passive click-through), while always providing a working **Skip** option at every step.

9. **TBD Updates Document Protocol (Strict Rule — Nov 14, 2026):**
   - **All TBD changes, conceptual queue ideas, and exploratory reminders must be tracked exclusively in [TBD_UPDATES.md](TBD_UPDATES.md).**
   - Whenever the user/project owner instructs to add a "TBD" feature or note to the design document or backlog, **add it directly to `TBD_UPDATES.md` instead**.
   - `DESIGN_BACKLOG.md` maintains active, sized requirements and historical updates; conceptual exploratory items belong in `TBD_UPDATES.md`.
10. **Minor Version Build Protocol (`0.0.x` — Nov 14, 2026):**
    - Whenever the project owner says **"build a minor version"**, design a new update for the game that packages:
      - **All pending Small and Tiny proposals.**
      - **Up to 5 pending Medium proposals.**
      - *(No Huge or Major requirement is required for minor versions).*
    - **Version Numbering:** Minor versions increase the third version number (`0.0.x`, where `x` increments: e.g. `0.14.3` $\to$ `0.14.4`), unlike major versions which increase the second digit (`0.x.0`).
    - **Standard Packaging Discipline:** Provide a copy-pastable implementation handoff for the coding agent, reduce token usage wherever possible, and ensure the design documents (`DESIGN.md`, `PRIOR_UPDATES.md`, and `DESIGN_BACKLOG.md`) are updated after implementation.
    - **Standalone Code-Edit Auto-Versioning (Nov 17, 2026):** Whenever a standalone agent edits code and finishes its task—and is **not** a subagent or one of several parallel agents (unless acting as the Integration Agent)—it must automatically classify those changes as a new minor version (`0.x.(y+1)`), bumping `package.json`, `engine.js` (`SAVE_KEY` + version strings with backward-compatible save migration), and `app.js` UI badges, logging the release in `PRIOR_UPDATES.md` (plus `DESIGN.md` / `DESIGN_BACKLOG.md` as applicable), verifying tests, and rebuilding the Windows executable via `./build.ps1`.

---

## 5. Post-Release Backlog Maintenance Protocol (Strict Operational Rule)

1. **Selective Archival of Implemented Features ONLY (Strict Rule — Nov 14, 2026):**
   - Whenever an update (e.g. Version 0.12, 0.13, etc.) is finished, tested, and released, **ONLY remove features that were actually implemented in that version**.
   - Move those specific implemented features, requirement specifications, and version release notes into [`PRIOR_UPDATES.md`](PRIOR_UPDATES.md) and [`VERSION_X.XX.md`](VERSION_X.XX.md).
   - **DO NOT clear or wipe the entire backlog:** The backlog is a persistent, rolling document designed to stay up to date across releases, not be reset each time there is an update.
2. **Preserve All Unimplemented & Pending Items:**
   - Any requirement, feature proposal, TBD conceptual item, bug, or deferred design that was NOT implemented in the released version **must remain intact and carried forward** in `DESIGN_BACKLOG.md`.
3. **Inventory Count Recalibration:**
   - Immediately following the release archive, recalculate the category counts in Section 1 of `DESIGN_BACKLOG.md` to accurately reflect the remaining pending work.

---

## 6. Agent Decision-Making & Terminology Protocol (Strict Operational Rule)

1. **Terminology Disambiguation & User Teaching:**
   - The project owner frequently uses similar-meaning words interchangeably (e.g. "design log" vs. "design backlog", "design doc" vs. "backlog").
   - When encountering two terms with nearly identical functions, the agent **must ask the user whether they represent the same concept** rather than inventing arbitrary technical distinctions.

2. **Unified Feature Ingestion:**
   - All requested feature additions belong in the active backlog queue in `DESIGN_BACKLOG.md`.
   - Never split items into separate files without explicit user confirmation.

3. **Clean Status Reporting:**
   - Backlog outputs must strictly report the active, numbered list of pending features.
   - Omit historical archives, bug trackers, and long-term design essays from standard backlog reviews.

4. **5-Point Style Filter for Decision Making:**
   When designing or proposing mechanics, check:
   - *Filter 1 (Perspective):* Is this a party chair decision (grand strategy, coalition building, budget triage)?
   - *Filter 2 (Aesthetic):* Does it maintain political atmosphere and qualitative "vibes" rather than raw math?
   - *Filter 3 (Scale):* Does it preserve the 155M represented-voter scale?
   - *Filter 4 (Continuity):* Does it support continuous multi-cycle evolution across 2-year cycles?
   - *Filter 5 (Usability):* Is it delivered in clean, Google Drive-compatible formats (Markdown/TSV/DOCX)?

5. **Universal "Politician" Terminology Definition (Strict Rule):**
   - In all game mechanics, data schemas, design documents, and agent communication, the term **"Politician" refers universally to every single character in the game**.
   - This encompasses all three operational character groups without exception:
     1. **Candidates:** Bench prospects, recruits, primary contenders, and general election nominees.
     2. **Leaders:** National Party Chairs, Faction Leaders, Category B leadership figures, Cabinet members, and Opposition leaders.
     3. **Sitting Politicians:** Sitting Members of Congress (Representatives, Senators), Governors, and state legislators.
   - Any rule, trait, faction affiliation, happiness metric, defection rule, or loyalty coupling applied to "Politicians" automatically binds to candidates, leaders, and sitting officeholders alike.
