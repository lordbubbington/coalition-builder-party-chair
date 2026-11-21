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
