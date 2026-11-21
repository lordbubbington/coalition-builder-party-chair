# Version 0.14 Design Specification & Implementation Workflow

**Build Target:** Version 0.14  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Candidate Traits & Personalities, State Legislative Slate Contestation, Institutional Leadership & Chamber Scoping, Absolute Electoral Baselines, and Streamlined Party Information*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Key:** `partyChairGame.save.v14` (Backward-compatible with v13 through v1)  
**Reference Document:** [**POLITICIAN_TRAITS.md**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/POLITICIAN_TRAITS.md)  

---

## 1. Executive Summary & Inventory Balance

Version 0.14 packages **21 total features** across all tiers, satisfying the project's build readiness requirements:
- **Huge Tier:** **1 Feature** (`REQ-128` — Satisfies the Major build requirement)
- **Large Tier:** **1 Feature** (`REQ-114`)
- **Medium Tier:** **4 Features** (`REQ-110`, `REQ-111`, `REQ-118`, `REQ-127`)
- **Small Tier:** **6 Features** (`REQ-112`, `REQ-113`, `REQ-119`, `REQ-123`, `REQ-124`, `REQ-125` — Satisfies 5–10 Small target)
- **Tiny Tier:** **9 Features** (`REQ-108`, `REQ-109`, `REQ-115`, `REQ-116`, `REQ-117`, `REQ-120`, `REQ-121`, `REQ-122`, `REQ-126` — All pending Tiny)

---

### Build Inventory Matrix (Version 0.14)

| Tier | Component ID | Req ID | Feature Title | Category / Primary Files |
| :--- | :--- | :---: | :--- | :--- |
| **Huge** | **TRAITS-01** | **REQ-128** | Candidate Traits Engine & 8-Trait Character System | Personality / `data.js`, `app.js`, `POLITICIAN_TRAITS.md` |
| **Large** | **LEG-01** | **REQ-114** | Dedicated State Legislative Slate Contestation Step & Minor Politician Generation | Downballot / `app.js`, `engine.js` |
| **Medium** | **ROLES-03** | **REQ-110** | Conditional Cabinet (4 Roles) & Opposition Leadership (3 Roles) | Hierarchy / `v07-scaffolding.js`, `app.js` |
| | **SCOPE-01** | **REQ-111** | Strict Party Scoping for Primaries, Surrogates & Custom Parties | Party Isolation / `app.js`, `engine.js` |
| | **HOUSE-01** | **REQ-118** | Decouple House Races from Statewide Lean (Pure District Leans) | Simulation / `engine.js`, `scenario-2028.js` |
| | **ROLES-04** | **REQ-127** | Comprehensive Sitting Member Eligibility & Chamber-Exclusive Scoping | Leadership / `app.js`, `engine.js` |
| **Small** | **RECRUIT-01** | **REQ-112** | Candidate Recruitment Cost Reduction ($1M Flat Baseline) | Economy / `engine.js`, `app.js` |
| | **PHASE-01** | **REQ-113** | Canonical Phase Nomenclature: "The Recruitment Phase" | Rebrand / `app.js`, UI text |
| | **LEAN-01** | **REQ-119** | Absolute Baseline Partisan Lean Gradient (Isolated from Env Drift) | National Map / `app.js`, `maps-0.3.js` |
| | **QUEST-01** | **REQ-123** | Explicit Eligibility Requirements for Major Priority Quests | Priorities UX / `data.js`, `app.js` |
| | **QUEST-02** | **REQ-124** | Defer Major Priority Acceptance Bonuses Until Cycle Lock-In | Economy & Timing / `engine.js`, `app.js` |
| | **QUEST-03** | **REQ-125** | Target State Dropdown & Dynamic Naming for "Grow in a Specific State" | Scope & UI / `app.js`, `engine.js` |
| **Tiny** | **ROLES-01** | **REQ-108** | Faction Leader Candidate Dropdown Eligibility Filtering (BUG-02 Fix) | Hierarchy Polish / `app.js` |
| | **ROLES-02** | **REQ-109** | Hide Inaccessible & Locked Leadership Roles from Hierarchy View | Hierarchy Polish / `app.js` |
| | **SENATE-02** | **REQ-115** | Default Senate Map View to Active Constitutional Senate Class | Map Polish / `app.js` |
| | **SENATE-03** | **REQ-116** | Scoped Senate Forecasts (Current Control on Inactive Classes) | Forecaster Polish / `app.js`, `maps-0.3.js` |
| | **TRIFECTA-01** | **REQ-117** | Streamlined Trifectas Map (3 Clean Categories & Nebraska Neutrality) | Map Polish / `app.js`, `maps-0.3.js` |
| | **TABS-01** | **REQ-120** | Swap Party Info & Forecast Tabs & Relocate Faction Confidence | Shell Navigation / `app.js` |
| | **FORECAST-02** | **REQ-121** | Remove Tier-Count Labels from Forecaster Cards ("7-Tier" & "13-Tier") | Forecasters UI / `app.js` |
| | **RATINGS-01** | **REQ-122** | Rebrand "Solid" Electoral Ratings to "Safe" Ratings | Text Polish / `app.js`, `engine.js`, `maps-0.3.js` |
| | **ROSTER-01** | **REQ-126** | Retire Legacy "Bench Leaders Available to Sign" Action Strip | Legacy Cleanup / `app.js`, `engine.js` |

---

## 2. Technical Subsystem Specifications

### Subsystem A: Candidate Traits Engine (`REQ-128`, `POLITICIAN_TRAITS.md`)
- **Trait Taxonomy:** 8 qualitative traits (`Rising Star`, `Established politician`, `Corrupt`, `Squeaky Clean`, `Polished`, `Rough`, `Disciplined`, `Undisciplined`).
- **Catalog Integration:** Load traits from [**POLITICIAN_TRAITS.md**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/POLITICIAN_TRAITS.md) into politician seed records (`data.js` and `scenario-2028.js`), mapping all 605 politicians.
- **UI Display:** Styled badge chips on candidate cards, primary inspection cards, and leadership assignment dropdowns.
- **TBD Decoupling:** In-game simulation effects are queued under `TBD-14`; age gates under `TBD-13`.

### Subsystem B: State Legislative Slate Contestation & Downballot Evolution (`REQ-114`)
- **Dedicated Step 4:** State Legislative races are removed from Step 3 (Primary Endorsements) and given an independent Step 4 in The Recruitment Phase (`step === 4`), shifting turn machine actions to Step 5.
- **1-Seat Automatic Contestation Rule:** Any party (major, minor, or custom) **automatically contests state legislature races in any state where they control at least 1 seat in that state's legislature**, without spending committee treasury or leadership actions. Major parties (Democrats/Republicans) control seats across all 50 states and contest all 98 chambers automatically.
- **Uncontested Legislatures & Slate Action:** In states where a party controls 0 seats, they start with 0% presence and must execute *"Contest State Legislative Slate"*:
  - **Dynamic Cost (EV-Scaled):** Scaled strictly by state **Electoral Votes (EV)** rather than population: smallest states (3 EVs) cost **$1M**, largest state (CA, 54 EVs) costs **$5M**, rounded to the nearest whole million ($\text{Cost} = \text{round}(1 + 4 \times \frac{\text{EV} - 3}{51})$).
    - $1M (28 states, 3–9 EVs): AK, DE, ND, SD, VT, WY, HI, ID, ME, MT, NH, RI, WV, NE, NM, AR, IA, KS, MS, NV, UT, CT, OK, KY, LA, OR, AL, SC.
    - $2M (18 states, 10–19 EVs): CO, MD, MN, MO, WI, AZ, IN, MA, TN, WA, VA, NJ, MI, GA, NC, OH, IL, PA.
    - $3M (2 states, 20–35 EVs): NY (28), FL (30).
    - $4M (1 state, 36–45 EVs): TX (40).
    - $5M (1 state, >45 EVs): CA (54).
  - Plus **1 Leadership Action** across all states.
  - **Effect:** Submits a full party slate fielding candidates across every legislative district in that state, unlocking the contest on Election Night. Winning $\ge 1$ seat permanently grants free automatic contestation in all future cycles.
- **Minor Politician Generation:** When a minor party wins a state legislative race, dynamically generate a new politician of that party for each winning seat, adding them to the party's leader pool for future leadership hierarchy appointments.

### Subsystem C: Leadership Hierarchy, Cabinet & Chamber Scoping (`REQ-108`, `REQ-109`, `REQ-110`, `REQ-127`)
- **Faction Leader Candidate Dropdown (`REQ-108`):** For `category === 'faction'`, filter selectable candidates strictly by `candidate.factionId === role.factionId`.
- **Hide Inaccessible Roles (`REQ-109`):** Leadership roles the party cannot access are hidden completely from view rather than shown as locked cards.
- **Cabinet & Opposition Roles (`REQ-110`):**
  - **Governing Cabinet (4 Roles):** Unlocked if holding the White House: Secretary of State, Secretary of Defense, Secretary of the Treasury, Attorney General.
  - **Opposition Leadership (3 Roles):** Unlocked for the largest non-presidential party: House Opposition Leader, Senate Opposition Leader, Gubernatorial Association Opposition Chair.
- **Chamber-Exclusive Eligibility (`REQ-127`):**
  - All sitting House, Senate, and Governors belonging to the party are included (no `.slice(0, 75)` caps).
  - Strict mutual exclusion: House members ineligible for Senate/Gov leadership; Senators ineligible for House/Gov; Governors ineligible for House/Senate.
  - Non-officeholders preserved for party-wide and faction roles.

### Subsystem D: Electoral Modeling, Leans & Map Polish (`REQ-115`, `REQ-116`, `REQ-117`, `REQ-118`, `REQ-119`, `REQ-121`, `REQ-122`)
- **House Pure District Leans (`REQ-118`):** Decouple House races from statewide margin. Use `district.lean` from `VERSION_01_HOUSE_DISTRICTS` in `estimateRaceMarginInternal`. Coattails apply against national margins.
- **Absolute Partisan Lean Gradient (`REQ-119`):** In `mode === 'lean-gradient'`, evaluate static baseline lean (`state.leanPercent` / `state.lean`) isolated from `presidentialStateMargin`, national environment, or campaign ad spending.
- **Senate Class Forecaster Scope (`REQ-115`, `REQ-116`):** Default Senate map to the active constitutional class. Inactive classes show current control; only the active election class displays forecasts.
- **Streamlined Trifectas Map (`REQ-117`):** 3 categories only: `Democrat Trifecta`, `Republican Trifecta`, `Mixed Control`. Nebraska is permanently nonpartisan/neutral gray.
- **Forecaster Tier Label Cleanup (`REQ-121`):** Strip `(7-Tier)` and `13-Tier` from card eyebrows in `forecastersMarkup()`.
- **"Safe" Rating Rebrand (`REQ-122`):** Change all display instances of `Solid` to `Safe` (`Safe Dem`, `Safe GOP`, `Safe Democratic`, `Safe Republican`).

### Subsystem E: Priorities Framework & The Recruitment Phase (`REQ-111`, `REQ-112`, `REQ-113`, `REQ-123`, `REQ-124`, `REQ-125`)
- **Strict Party Scoping (`REQ-111`):** `primaryParty` locked to player's party. Custom and minor parties only see and filter support for their own party's candidates; prevents custom parties from seeing Democrats.
- **Recruitment Economy ($1M Flat) (`REQ-112`):** Lower candidate recruitment cost from $2M + quality scaling to flat **$1.0M**.
- **"The Recruitment Phase" Rebrand (`REQ-113`):** Canonical name rebrand across all headers and step indicators.
- **Explicit Eligibility Requirements (`REQ-123`):** Replace `"Conditions not met"` with clear text explaining what the player needs to become eligible.
- **Deferred Acceptance Bonuses (`REQ-124`):** Major priorities do NOT award bonuses upon provisional selection; bonuses are batch-awarded upon confirming and locking the 3 priorities (`lock-priorities`).
- **"Grow in [STATE]" Target Dropdown (`REQ-125`):** 50-state dropdown in quest card; dynamic title *"Grow our party in [STATE]"*; strictly scopes evaluation to that state.

### Subsystem F: Shell Navigation & Legacy Deprecation (`REQ-120`, `REQ-126`)
- **Swap Tabs 4 & 5 (`REQ-120`):**
  - Tab 4 becomes **"Forecast"** (`Election Projections & Forecasts`), housing the Wave Pendulum, Satirical Forecasters, Trust, and Electorate Model.
  - Tab 5 becomes **"Party Information"** (`Party Standing & Metrics`), housing the 14 Leadership Roles, Platform, State Policy Bills, Election History, and relocated **Faction Confidence**.
- **Retire Bench Offers Strip (`REQ-126`):** Remove `v07-offers-strip` (`Bench Leaders Available to Sign`) from `actionsTabMarkup()` and deprecate prototype `recruit` action.

---

## 3. Minimal-Token Implementation Plan

To implement Version 0.14 with minimal token consumption:
1. **Model Recommendation:** Use **Gemini 3.8 Flash (High)** for implementation turns. It executes large, multi-file code modifications with high AST accuracy, zero hallucinated syntax, and minimal latency.
2. **File Isolation:** The update is partitioned into **Three Clean Agent Phases** by file domain so each agent only reads and edits what it owns:
   - **Phase 1: Backend Data & Simulation Engine** (`engine.js`, `data.js`, `v07-scaffolding.js`, `scenario-2028.js`)
   - **Phase 2: UI, Shell Navigation, Modals & Maps** (`app.js`, `maps-0.3.js`, `styles.css`)
   - **Phase 3: Integration Verification & Release Build** (`scripts/test-v014-integration.cjs`, `build.ps1`)

---

## 4. Copy-Pastable Implementation Prompts

### Agent Phase 1: Data, Schemas & Core Simulation Engine
```text
Model: Gemini 3.8 Flash (High)
Role: Senior Game Simulation & Engine Engineer
Target Files:
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\data.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\engine.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\v07-scaffolding.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\scenario-2028.js

Objective: Implement backend data structures, recruitment economy, chamber scoping, and simulation logic for Version 0.14.

Tasks:
1. REQ-128 (Traits Data): In data.js and scenario-2028.js, attach the 'traits' array to MEMBERS and SITTING_MEMBERS records mapped from POLITICIAN_TRAITS.md.
2. REQ-118 (House Decoupling): In engine.js (estimateRaceMarginInternal), when kind === 'house', decouple margin from statewide lean/presidential margin; compute baseline exclusively from district.lean in VERSION_01_HOUSE_DISTRICTS.
3. REQ-112 (Recruitment Cost): In engine.js (encourageStateRecruit), set flat candidate recruitment cost to $1.0M.
4. REQ-114 (State Leg Contestation): In engine.js, parties automatically contest legislatures where they hold >= 1 seat. For unheld legislatures (0 seats), add action handler 'contest-state-legislative-slate' costing EV-scaled treasury ($1M for 3 EVs to $5M for 54 EVs, rounded to nearest whole million) + 1 action; on election night, winning minor state leg races generates unique politicians for that party.
5. REQ-110 & REQ-127 (Leadership Scoping & Roles):
   - In v07-scaffolding.js, add Cabinet roles (State, Defense, Treasury, AG unlocked if holding White House) and Opposition Leader roles (House, Senate, Gov for largest non-presidential party).
   - In engine.js (assign-leadership-role), enforce chamber mutual exclusion (House members only for House roles; Senators only for Senate; Governors only for Gov).
6. REQ-123, REQ-124, REQ-125 (Priorities Engine):
   - In data.js (OVERALL_PRIORITY_QUESTS), add eligibilityRequirementText to all quests.
   - In engine.js, defer applyQuestAcceptanceBonus() from selection time to lock-priorities confirm action.
   - For 'growing-in-state', scope targetStateId and checkCompletion strictly to the chosen state.
7. REQ-111 (Party Isolation): In primary election resolution, lock primaryParty to player party.
8. Save Version: Increment save version to 'partyChairGame.save.v14' with backward compatibility.
```

### Agent Phase 2: Frontend UI, Shell Navigation, Modals & Maps
```text
Model: Gemini 3.8 Flash (High)
Role: Senior UI & Presentation Engineer
Target Files:
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\app.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\maps-0.3.js
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\styles.css

Objective: Implement UI layouts, shell tabs, modal interactions, and map modes for Version 0.14.

Tasks:
1. REQ-120 (Swap Tabs & Move Faction Confidence):
   - In app.js (tabs array), Tab 4 is titled 'Forecast' (Wave Pendulum, Forecasters, Trust, Electorate Model).
   - Tab 5 is titled 'Party Information' (Leadership Hierarchy, Platform, Bills, History, Diary, and relocated Faction Confidence panel).
2. REQ-126 (Retire Bench Strip): Remove v07-offers-strip ('Bench Leaders Available to Sign') from actionsTabMarkup().
3. REQ-121 & REQ-122 (Pundit Forecaster Polish & Safe Rebrand):
   - In forecastersMarkup(), strip '(7-Tier)' and '13-Tier' from card eyebrows.
   - Globally rebrand all user-facing 'Solid' ratings to 'Safe' across forecaster chips, legends, and cards.
4. REQ-115, REQ-116, REQ-117, REQ-119 (Maps Polish):
   - Default Senate map to active election class; off-cycle classes show current control without forecast.
   - Trifectas map displays 3 categories: Democrat Trifecta, Republican Trifecta, Mixed Control; Nebraska strictly gray.
   - Partisan Lean Gradient displays static baseline lean (state.leanPercent / state.lean) isolated from environment drift.
5. REQ-128 (Traits Chips): Render candidate trait badges on candidate cards and leadership dossiers using distinct palette chips.
6. REQ-113 & REQ-114 (Recruitment Phase & State Leg Step):
   - Rebrand opening phase to 'The Recruitment Phase'.
   - Add Step 4 for State Legislative Slate Contestation (automatic contestation if holding >= 1 seat; dynamic EV-scaled $1M–$5M + 1 action button for unheld states) between Step 3 Endorsements and Step 5 Actions.
7. REQ-108, REQ-109, REQ-110, REQ-127 (Leadership UI):
   - Filter Faction Leader dropdown strictly by role factionId.
   - Hide inaccessible roles from the hierarchy view.
   - Render Cabinet and Opposition leadership roles; restrict dropdowns by chamber.
8. REQ-123, REQ-124, REQ-125 (Priorities UI):
   - In questSelectionModalMarkup, show explicit requirements instead of 'Conditions not met'.
   - Add 50-state dropdown to 'growing-in-state' card; dynamic title 'Grow our party in [STATE]'.
   - Update lock confirmation modal to list pending acceptance bonuses.
9. REQ-111 (Party Isolation UI): Lock primary endorsement view to player party.
```

### Agent Phase 3: Automated Verification & Executable Build
```text
Model: Gemini 3.8 Flash (High)
Role: Release & QA Engineer
Target Files:
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\scripts\test-v014-integration.cjs
- c:\Users\rober\.gemini\antigravity\scratch\party-chair-game\build.ps1

Objective: Author comprehensive integration tests verifying all 21 features and compile the release executable.

Tasks:
1. Create scripts/test-v014-integration.cjs with automated assertion suites covering:
   - REQ-128: Candidate traits populated across all 605 politicians.
   - REQ-114: State leg contestation step, minor party $5M slate action, politician generation on victory.
   - REQ-110 & REQ-127: Cabinet/Opposition roles unlock conditions and strict chamber exclusion.
   - REQ-118: House district lean decoupling from state margin.
   - REQ-119: Absolute Partisan Lean Gradient static baseline independence.
   - REQ-115, REQ-116, REQ-117: Senate active class default, scoped forecasts, 3-category trifecta map.
   - REQ-120: Swapped Forecast & Party Info tabs, relocated Faction Confidence.
   - REQ-121 & REQ-122: Stripped tier labels and 'Safe' rating rebrand.
   - REQ-123, REQ-124, REQ-125: Priority requirements, deferred bonus lock-in, state dropdown.
   - REQ-112 & REQ-113: $1M recruitment cost and 'The Recruitment Phase' text.
   - REQ-108, REQ-109, REQ-126: Faction dropdown filtering, hidden inaccessible roles, retired bench strip.
   - REQ-111: Strict party isolation for primaries and custom parties.
2. Execute tests: node scripts/test-v014-integration.cjs.
3. Compile release executable: powershell -ExecutionPolicy Bypass -File ./build.ps1.
4. Verify dist/release/Coalition Builder - Party Chair.exe output size and timestamp.
```
