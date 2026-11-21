# Version 0.13 Design Specification & Implementation Workflow

**Build Target:** Version 0.13  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Generational Bench Pipelines, Strategic Victory Compacts, Dynamic Ballot Access, Competitive Primaries & Faction Alignment*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version:** `partyChairGame.save.v13` (Backward-compatible with v12 through v1)

---

## 1. Executive Summary & Inventory Balance

Version 0.13 is a complete, structured cycle update meeting the standard build readiness quota:
- **Large Tier:** **4 Features** (Target: 3 Large met)
- **Medium Tier:** **5 Features** (Target: 5 Medium met)
- **Small Tier:** **7 Features** (Target: 5–10 Small met)
- **Tiny Tier:** **4 Features** (All pending Tiny met)

### Build Inventory Matrix (Version 0.13)

| Tier | Component ID | Req ID | Feature Title | Category / Primary File |
| :--- | :--- | :---: | :--- | :--- |
| **Large** | **BENCH-02** | **REQ-90** | The Bench Ascension Pipeline (Higher-Office Recruitment) | Primaries / `engine.js` |
| | **BALLOT-01** | **REQ-102** | Petition-Based Ballot Access System (10k Voters & Starting Map) | Ballot Access / `engine.js` |
| | **PRES-01** | **REQ-103** | 2028 Competitive Presidential Primaries & Succession | Primaries / `engine.js` |
| | **ENDORSE-01** | **REQ-104** | "Filtering Support" (10-Point Swing & Faction Shifts) | Primaries / `app.js` & `engine.js` |
| **Medium** | **BENCH-01** | **REQ-89** | Persistent Politician Career Progression & Seniority Records | Data Engine / `engine.js` |
| | **BENCH-04** | **REQ-92** | Seniority Turnover, Aging & Council of Party Elders | Governance / `engine.js` |
| | **COMP-01** | **REQ-94** | National Steering Summit & Joint Victory Compacts | Super PACs / `engine.js` & `app.js` |
| | **ACTION-01** | **REQ-101** | Organizing Phase Direct Action Pool (20 Total Actions) | Turn Loop / `app.js` & `engine.js` |
| | **LEAD-01** | **REQ-107** | Dynamic Party-Specific Faction Leadership Roles & Alignment | Leadership / `v07-scaffolding.js` |
| **Small** | **GROWTH-01** | **REQ-88** | Cumulative Inter-Cycle Electorate Growth (+3% Annual Ind Influx)| Demographics / `engine.js` |
| | **BENCH-03** | **REQ-91** | Party Chair Mentorship & "Rising Star" Designation | Leadership / `app.js` |
| | **COMP-02** | **REQ-95** | Institutional Accountability & Donor Capital Strikes | Factions / `engine.js` |
| | **MODAL-01** | **REQ-97** | Major Priorities Confirmation Modal ("Are you sure?") | UX / `app.js` |
| | **DECK-01** | **REQ-98** | Priority Terminology & "Party Focus" Expansion (10 Slots) | Strategy / `app.js` |
| | **WAVE-01** | **REQ-99** | Synchronize Wave Momentum Gauge to Baseline National Env | Forecast UI / `app.js` |
| | **FAME-01** | **REQ-106** | Major Party Restlessness Threshold Elevation (Fame >= 90) | Members / `engine.js` |
| **Tiny** | **BENCH-05** | **REQ-93** | Bench Roster UI & Pipeline Scannability Filter | Roster Polish / `app.js` |
| | **COMP-03** | **REQ-96** | Compact Status Tracker & Clean Summary Widget | Dashboard UI / `app.js` |
| | **SENATE-01** | **REQ-100** | Conditional Senate Subtabs Display (Scoped to Senate Mode) | Map Polish / `app.js` |
| | **SLIDER-01** | **REQ-105** | Issue Slider Stance Typography Scaling (11.5px Polish) | Platform UI / `styles.css` |

---

## 2. Technical Subsystem Specifications

### System A: Bench & Politician Lifecycle (`REQ-89`, `REQ-90`, `REQ-91`, `REQ-92`, `REQ-93`, `REQ-106`)
- **Seniority & Milestones (`REQ-89`):** Each politician record gains `termsServed: { house: 0, senate: 0, governor: 0, stateLeg: 0 }` and `careerMilestones: []`. Every cycle boundary adds $+2$ to $+5$ Fame based on chamber; Net Approval dynamically scales with chamber tenure.
- **Ascension Pipeline (`REQ-90`):** Senate/Governor primary generation queries sitting House members (`fame >= 45`, `netApproval > 0`). When a sitting House member ascends to run for Senate/Governor, their vacated House seat generates an open primary pool.
- **Rising Star Mentorship (`REQ-91`):** Action costs 1 action + $2M. Chair designates up to 2 promising politicians (`fame < 50`, `quality >= 7`). High quality yields $+15$ Fame and $+10$ Popularity over 10 turns.
- **Aging & Council of Elders (`REQ-92`):** Politicians age 2 years per cycle. At age 70+, roll 20% base retirement (+15%/cycle). Net Approval $\ge +20$ retiring members enter `game.councilOfElders`, providing passive $+1.5$ Confidence stabilization to their faction.
- **Bench Roster UI (`REQ-93`):** Add filter tabs `[All]`, `[Rising Stars]`, `[Higher Office]`, `[Party Elders]` with copper chevron pip (`▲ Higher Office Contender`).
- **Restlessness Fame Threshold (`REQ-106`):** In `engine.js`, update major party snubbing threshold: `isPlayerParty && nextFame >= 90 && !isAppointed`. Minor parties stay at 75.

### System B: Compacts & Super PAC Steering (`REQ-94`, `REQ-95`, `REQ-96`)
- **National Steering Summit (`REQ-94`):** At organizing start, Super PACs offer joint compacts ($12M–$20M ad reserves) in exchange for governance terms (appointing faction chair, 1 of 3 Major Priorities, or recruit profile).
- **Donor Capital Strikes (`REQ-95`):** Stripping agreed priority or removing appointed chair freezes transfers, pulls -$8M treasury, and imposes -4.0 Supporter Trust. Honoring compact grants $+10\%$ budget bonus next cycle.
- **Compact Tracker Widget (`REQ-96`):** Status widget in Finance card rendering active agreements, reserve amounts, terms, and compliance badges.

### System C: Primaries, Ballot Access & Succession (`REQ-102`, `REQ-103`, `REQ-104`, `REQ-107`)
- **Petition Ballot Access (`REQ-102`):** Starting voter counts set: Greens ~100k, Constitution ~100k. Greens on ballot in 2024 Harris Senate/Gov, 80% House, 0% Leg. Libertarians 100% Senate/Gov, 50% House, 0% Leg. If unregistered party has $\ge 10{,}000$ voters in state, petition action grants ballot access.
- **2028 Presidential Primary Trios (`REQ-103`):** Dems: Ossoff, AOC, Newsom tightly clustered. GOP: Rubio, Vance, DeSantis tightly clustered. Post-2028: sitting president unchallenged; otherwise top 10 favorability members run.
- **Filtering Support (`REQ-104`):** Rebrand "Endorse candidate" to "Filtering support". Injects a 10-point primary polling swing. Supported candidate's faction gains $+1$ Confidence; all other factions lose $-3$ Confidence.
- **Party-Specific Faction Leadership Roles (`REQ-107`):** Replace generic `faction1Leader..faction4Leader` with dynamic slots from `PARTY_FACTIONS` (5 for Dems, 5 for GOP). Candidates must match faction (`member.factionId === role.factionId`).

### System D: UX, Turn Flow & Platform Controls (`REQ-88`, `REQ-97`, `REQ-98`, `REQ-99`, `REQ-100`, `REQ-101`, `REQ-105`)
- **Electorate Growth (`REQ-88`):** Compounding $+3\%$ annual population growth (+6.09%/cycle). 100% register as Unaffiliated/Independent.
- **Major Priorities Confirmation Modal (`REQ-97`):** Explicit modal: *"Are you sure? This can't change after being selected."* Permanently locks slots.
- **Terminology & "Party Focus" Expansion (`REQ-98`):** Rebrand Main Priority $\to$ Major Priority. Rebrand Additional Priorities $\to$ Party Focus (expanded from 5 to 10 slots).
- **Wave Gauge Sync (`REQ-99`):** Initialize Wave Gauge position directly from `game.nationalEnvironment` (starting D+9.0) instead of defaulting to 0.0.
- **Senate Subtab Scoping (`REQ-100`):** Hide `.v07-senate-bar` unless `activeMap === 'senate'`.
- **Direct Action Pool (`REQ-101`):** Replace 20 discrete turn clicks with a unified pool of 20 Pre-Campaign Leadership Actions (`organizingActionsRemaining = 20`) with direct campaign advance button.
- **Typography Polish (`REQ-105`):** Set `.v09-stance-callout` font-size to `11.5px` (matching `.v09-range-pole`).

---

## 3. Minimal-Token, High-Accuracy Implementation Architecture

To ensure 100% code accuracy while minimizing token overhead, the update is partitioned into **Three Focused Subagents** executing in isolated files, followed by automated verification and build compilation.

### Recommended Model Configuration
- **Model:** **Gemini 3.8 Flash (High)**
- **Reason:** Best-in-class coding reliability and multi-file context tracking, while preserving rapid execution speed and zero latency degradation.

---

## 4. Copy-Paste Agent Prompts

### Agent 1 Prompt: Engine & Data Systems (Backend Simulation)
```text
Role: Senior Game Simulation Engineer
Target Files: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\engine.js, c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\v07-scaffolding.js

Objective: Implement backend simulation systems for Version 0.13 in Coalition Builder: Party Chair.

Key Tasks:
1. REQ-88 (Electorate Growth): In cycle transition, expand electorate by +6.09% (3% compounding annually) with 100% registered as Independents/Unaffiliated.
2. REQ-89 & REQ-90 (Politician Seniority & Higher-Office Pipeline):
   - Add termsServed and careerMilestones to politician records.
   - When generating Senate/Governor primaries, query sitting House members (fame >= 45, netApproval > 0) to enter primary fields and open up their House district seats.
3. REQ-92 (Aging & Elders): At cycle end, age members by 2 years; check 20% base retirement at 70+. Retiring members with Net Approval >= +20 join game.councilOfElders, providing passive +1.5 Confidence stabilization floor to their faction.
4. REQ-106 (Fame Threshold): In high-Fame snubbing check (around line 6090), raise the threshold from 75 to 90 for major parties ('people' and 'heritage').
5. REQ-102 (Ballot Access & Voter Baselines): Greens and Constitution start with 100k voters. Set starting ballot access maps (Greens: 2024 Harris states Senate/Gov/80% House; Libertarians: 100% Senate/Gov/50% House; Constitution/Socialist: 0%). Add 10k voter petition threshold.
6. REQ-103 & REQ-104 (Presidential Primaries & Filtering Support):
   - Generate tightly clustered 2028 trios (Dems: Ossoff, AOC, Newsom; GOP: Rubio, Vance, DeSantis).
   - Rename endorsement to "Filtering support": applies a 10-point primary shift, grants +1 Confidence to supported candidate's faction, and applies -3 Confidence to all other factions.
7. REQ-107 (Dynamic Faction Roles): In v07-scaffolding.js, replace generic faction1Leader..faction4Leader with dynamic roles from PARTY_FACTIONS (5 for Dems, 5 for GOP). Validate that candidate.factionId matches role.factionId.
8. REQ-94 & REQ-95 (Compacts): Add data structures for Joint Victory Compacts and donor capital strike penalties.
9. Increment save version key to 'partyChairGame.save.v13' with seamless migration from v12.

Execution: Edit files with exact string replacements, ensure backward compatibility, and test with node syntax validation.
```

### Agent 2 Prompt: Frontend UI, UX & Deck Expansion
```text
Role: Senior UI/Frontend Engineer
Target Files: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\app.js, c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\styles.css

Objective: Implement UI controls, layout updates, and interactive workflows for Version 0.13.

Key Tasks:
1. REQ-97 (Major Priorities Modal): When confirming 3 Major Priorities, display an explicit confirmation modal: "Are you sure? This can't change after being selected." Once locked, render permanent padlock badges and disable modifications.
2. REQ-98 (Terminology & "Party Focus" Expansion):
   - Rebrand "Main Priority" to "Major Priority".
   - Rebrand "Additional Priorities" to "Party Focus" and expand selectable capacity from 5 to 10 slots.
3. REQ-99 (Wave Gauge Sync): Ensure wavePendulumMarkup and game.campaign.waveMomentum initialize from game.nationalEnvironment (starting at D+9.0) rather than defaulting to 0.0.
4. REQ-100 (Senate Subtabs Scoping): In national map rendering, conditionally hide .v07-senate-bar unless activeMap === 'senate'.
5. REQ-101 (Direct Action Pool):
   - Replace the discrete 20-turn progression and "Confirm Turn" loop with an action pool of 20 Pre-Campaign Leadership Actions (organizingActionsRemaining = 20).
   - Add a prominent button: "Resolve Primaries & Launch General Election Campaign" when actions are spent or player advances.
6. REQ-93 & REQ-96 (Bench & Compact Widgets):
   - Add quick filters [All], [Rising Stars], [Higher Office], [Party Elders] to Sitting Members dossier with copper chevron pips.
   - Add Active Joint Victory Compacts widget to Finance card.
7. REQ-104 UI: Replace all "Endorse candidate" button copy and tooltips with "Filtering support".
8. REQ-105 (Stance Prose Typography): In styles.css, change .v09-stance-callout font-size to 11.5px (matching .v09-range-pole) with clean 1.35 line-height and compact padding.

Execution: Ensure full visual compliance with ART_STYLE.md (Deep Navy, Warm Ivory, Muted Gold, Raised Navy) and zero console errors.
```

### Agent 3 Prompt: Integration Verification & Windows Executable Build
```text
Role: QA & Release Automation Engineer
Target Files: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\scripts\test-v013-integration.cjs, build.ps1

Objective: Author comprehensive automated verification suite and compile the canonical Windows executable.

Key Tasks:
1. Create scripts/test-v013-integration.cjs validating:
   - REQ-88: +6.09% inter-cycle voter growth, 100% Independent registration.
   - REQ-89 & REQ-90: Politician seniority tracking, House-to-Senate/Gov bench ascension.
   - REQ-92 & REQ-106: Council of Elders confidence stabilization, Fame >= 90 restlessness threshold for major parties.
   - REQ-102: Green & Constitution 100k voter baselines, deterministic starting ballot access, 10k petition access.
   - REQ-103 & REQ-104: 2028 presidential trios, 10-point filtering support swing, +1/-3 faction confidence shifts.
   - REQ-107: 5 Democratic / 5 Republican faction leadership slots, strict faction alignment enforcement.
   - REQ-97 & REQ-98: Priorities modal, Major Priority / Party Focus (10 slots) structure.
   - REQ-101: 20 organizing action pool without 20-turn clicking friction.
   - REQ-99, REQ-100, REQ-105: D+9.0 Wave sync, Senate subtab scoping, 11.5px typography.
2. Run test script using Node.js and assert 100% pass rate.
3. Execute ./build.ps1 to recompile dist/release/Coalition Builder - Party Chair.exe via csc.exe. Verify binary timestamp and output size.
```

---

## 5. Post-Release Backlog Maintenance

Upon completion and verification of Version 0.13:
1. Move REQ-88 through REQ-107 specifications from `DESIGN_BACKLOG.md` into `PRIOR_UPDATES.md`.
2. Clear active requirements table in `DESIGN_BACKLOG.md`.
3. Recalibrate Section 1 Inventory counts to prepare for Version 0.14.
