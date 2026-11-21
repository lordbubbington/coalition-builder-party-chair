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
