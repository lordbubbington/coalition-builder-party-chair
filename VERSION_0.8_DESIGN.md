# Coalition Builder: Party Chair — Version 0.8 Build Design & Agentic Workflow
## Build Package: "The 15-Week Campaign & Pundit Forecast Update"

Prepared: November 12, 2026  
Builds On: [`VERSION_0.7_DESIGN.md`](VERSION_0.7_DESIGN.md)  
Reference Rulebooks: [`GAME_STYLE_GUIDE.md`](GAME_STYLE_GUIDE.md), [`ART_STYLE.md`](ART_STYLE.md), [`DESIGN.md`](DESIGN.md)

---

## 1. Build Scope & Quota Verification

This update is anchored by **1 Huge** feature (`REQ-39`: 15-Turn Grand-Strategy Campaign Phase) and strictly satisfies the build planning rules (**1 Huge + 5 Medium + 5–10 Small + All Pending Tiny**):

| Tier | ID | Feature Name | Primary Agent |
| :--- | :--- | :--- | :--- |
| **Huge (1/1)** | **REQ-39** | **15-Turn Grand-Strategy Campaign Phase** *(Weekly Loop, Funding Requests & Macro Decisions)* | Agent 2 & Agent 3 |
| **Medium (1/5)** | **REQ-12** | **Satirical Forecasters (Sallow & Cook Parodies) as Sole Projections** | Agent 2 & Agent 3 |
| **Medium (2/5)** | **REQ-19** | **Candidate Budget Funding, Baselines ($1M/$5M) & Margin-Sensitive Cajoling** | Agent 2 & Agent 3 |
| **Medium (3/5)** | **REQ-33** | **Wave Election / National Momentum Pendulum** | Agent 2 & Agent 3 |
| **Medium (4/5)** | **REQ-40** | **Weekly National Leader Deployment Menu & Recommended-States Map** | Agent 2 & Agent 3 |
| **Medium (5/5)** | **REQ-41** | **October Surprise Mechanic (Week 13 Shockwaves + 20 Major Surprises)** | Agent 1 & Agent 2 |
| **Small (1/8)** | **REQ-22** | **Political Landscape Tab: State-by-State Lean Gradient Map** | Agent 3 (UI & Maps) |
| **Small (2/8)** | **REQ-23** | **Political Landscape Tab: Trifectas & Mixed-Control Map** | Agent 3 (UI & Maps) |
| **Small (3/8)** | **REQ-26** | **Party Action: Candidate Vetting & Opposition Research** | Agent 2 & Agent 3 |
| **Small (4/8)** | **REQ-28** | **Party Action: Caucus Retreat & Candidate Cajoling Session** | Agent 2 & Agent 3 |
| **Small (5/8)** | **REQ-29** | **Party Action: National Surrogate Media Blitz** | Agent 2 & Agent 3 |
| **Small (6/8)** | **REQ-31** | **Joint Fundraising Committees & "Down-Ballot Victory Funds"** | Agent 2 & Agent 3 |
| **Small (7/8)** | **REQ-34** | **Ballot Measures / State Referendums as Turnout Drivers** | Agent 2 & Agent 3 |
| **Small (8/8)** | **REQ-38** | **Real & Player-Generated Election History Timeline** | Agent 1 & Agent 3 |
| **Tiny (1/2)** | **REQ-42** | **Update Senate Class II Map Democratic Control (KS, TX, ME, IA, SC)** | Agent 1 (Data) |
| **Tiny (2/2)** | **REQ-43** | **Starting Trust / Support Calibration (Base 85–90, Opponent 10–15)** | Agent 2 (Engine) |

### Scope Boundary Note (`REQ-18` Deferral Interface)
Because a Huge-anchored build cannot simultaneously carry a Large item, the full **6–8 issue-tied Super PACs (`REQ-18` — Large)** remain in the v0.9 backlog alongside `REQ-30` (Party Splits) and `REQ-36` (5+5 Ideological Factions).  
To ensure `REQ-39` works smoothly today and plugs cleanly into `REQ-18` next cycle:
- In **v0.8**, the 15-turn campaign's weekly funding requests focus on **direct National Committee ad allocations, candidate baseline requests (`REQ-19`), and Joint Victory Funds (`REQ-31`)**.
- Agent 2 must expose an extensible `weeklyFundingRequests[]` and `campaignAdModifiers` hook so `REQ-18`'s issue-specific Super PAC pools drop right in during v0.9 without refactoring the 15-week loop.

---

## 2. Mandatory Studio Rules for All Agents

Per [`GAME_STYLE_GUIDE.md`](GAME_STYLE_GUIDE.md) and [`ART_STYLE.md`](ART_STYLE.md):
1. **Grand Strategy with a Politics Theme (`GAME_STYLE_GUIDE.md` §4.0):** Every weekly campaign action must be a **macro party-chair strategic decision** (ad-budget triage, leader deployment across states, cajoling, rapid-response narrative quarantine, ballot measures, joint fundraising)—never candidate-level micromanagement (bus tours, local rallies, or door-knocking).
2. **Battle For America Read-Only Rule:** Consult Battle For America formulas (`RACE_WEIGHT.house = 0.34`, Electoral College & coattail patterns), **never edit** Battle For America files.
3. **155 Million Represented-Voter Scale:** Never display or mention the `1.55` internal sample abstraction anywhere in UI or copy.
4. **Sole Pre-Election Projections (`REQ-12` / `DEF-06`):** Do **not** render raw numerical pre-election race polls during the 15-turn campaign; **only** the satirical *Sallow's Crystal Ball* and *Cook Political Report* ratings/maps appear as race projections.
5. **Visual & Map Invariants:** Follow `ART_STYLE.md` (Deep Navy, Raised Navy, Warm Ivory, Muted Copper, Muted Teal, Coral, Slate; serif headings, monospace numbers) and preserve `!` as the multi-ring delimiter in `maps-0.3.js`.

---

## 3. Agentic Workflow & Execution Pipeline

This build uses a **5-Agent Phased Pipeline** (**Integration Agent** + **Agents 1–4**) with strict non-overlapping file ownership and explicit integration gates to prevent merge conflicts and broken state contracts.

```
[Phase 0: Contract Lock] (Integration Agent)
         │
         ├───────────────────────────────┐
         ▼                               ▼
[Phase 1A: Agent 1]             [Phase 1B: Agent 2]
 Data, History & Events          Campaign Engine, Forecasters & Actions
 (data.js, scenario-2028.js,     (engine.js)
  maps-0.3.js)
         │                               │
         └───────────────┬───────────────┘
                         ▼
   [Gate 1: Data & Engine Integration Check] (Integration Agent)
                         │
                         ▼
               [Phase 2: Agent 3]
        UI Tabs, Maps & 15-Week Campaign Views
        (app.js, styles.css, index.html)
                         │
                         ▼
   [Gate 2: UI/Engine End-to-End Smoke Test] (Integration Agent)
                         │
                         ▼
               [Phase 3: Agent 4]
     Save Migration, Studio Invariants & Exe Build
     (engine.js migration, build.ps1, VERSION_0.8.md)
                         │
                         ▼
   [Final Gate: Release Sign-off] (Integration Agent)
```

### File-Ownership Lock Matrix
| File(s) | Integration Agent | Phase 1A (Agent 1) | Phase 1B (Agent 2) | Phase 2 (Agent 3) | Phase 3 (Agent 4) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `data.js`, `scenario-2028.js`, `maps-0.3.js` | Seam check / read-only* | **Write** | Read-only | Read-only | Read-only |
| `engine.js` *(core simulation)* | Seam check / read-only* | Read-only | **Write** | Read-only | `normalizeGame` / `migrateSave` only |
| `app.js`, `styles.css`, `index.html` | Seam check / read-only* | — | — | **Write** | Read-only |
| `build.ps1`, `VERSION_0.8.md` | Release sign-off | — | — | — | **Write** |
| Scratch test scripts (`obj/` or temp, cleaned after gate) | **Write / Run** | — | — | — | Verification only |

*\*The Integration Agent resolves contract/glue mismatches at Gate 1 and Gate 2 only if a handoff fix is trivial and strictly documented; substantial feature fixes are bounced back to the owning agent.*

---

## 4. Detailed Agent Instructions

### Phase 0 — Contract Lock (Integration Agent)
Before launching Agent 1 and Agent 2 in parallel, the Integration Agent verifies and locks these shared schemas across `data.js`, `scenario-2028.js`, `v07-scaffolding.js`, `engine.js`, and `app.js`:
- `game.campaign`: `{ active: boolean, week: 1..15, weeklyActionsLeft: number, leaderDeployments: { [leaderId]: stateId }, weeklyRequests: [...], campaignAdModifiers: {}, octoberSurpriseResolved: boolean, waveMomentum: number }`
- `game.candidateFunding`: `{ [raceKey]: { baseline: number, allocated: number, pulled: boolean, cajoleLevel: number, happiness: number } }`
- `game.forecasters`: `{ sabato: { [raceKey]: rating }, cook: { [raceKey]: rating } }`
- `HISTORICAL_ELECTIONS`: Array of pre-2028 presidential and midterm election records in `scenario-2028.js`.
- `OCTOBER_SURPRISES`: Array of 20 major Week-13 crisis records in `data.js`.

---

### Agent 1 — Data, Historical Records & October Surprises Architect
**Files Owned:** `data.js`, `scenario-2028.js`, `maps-0.3.js`  
**Assigned Items:** `REQ-38` (Historical Data), `REQ-41` (20 October Surprises Data), `REQ-42` (Senate Class II Calibration)

#### Instructions for Agent 1:
1. **Senate Class II Map Control Update (`REQ-42` — Tiny):**
   - Update the Senate Class II baseline in `scenario-2028.js` and `maps-0.3.js` so Democrats control **Kansas (`KS`)**, **Texas (`TX`)**, **Maine (`ME`)**, **Iowa (`IA`)**, and **South Carolina (`SC`)**.
   - **Preserve prior Class II Democratic holdings:** Keep **Alaska (`AK`, Mary Peltola)**, **Mississippi (`MS`, Scott Colom)**, **North Carolina (`NC`)**, and traditional Democratic Class II holds Democratic alongside these five states (`REQ-13` continuity confirmed by user).
2. **Actual U.S. Election History Dataset (`REQ-38` — Small, Data Layer):**
   - Add `HISTORICAL_ELECTIONS` in `scenario-2028.js` covering real historical U.S. presidential and midterm cycles leading into 2028 (EVs, popular vote percentages, winners/nominees, House/Senate seat balances, and the 2026 baseline).
   - Ensure figures are labeled honestly as historical election records alongside simulated post-2028 results.
3. **20 Major October Surprises Catalog (`REQ-41` — Medium, Data Layer):**
   - Add `OCTOBER_SURPRISES` array in `data.js` containing all **20 distinct major surprises** (Hot-Mic Donor Gala Recording, Late Ethics Indictment, Ceasefire Breakthrough, Overseas Crisis, Jobs/Inflation Shock, Federal Investigation Reopened, Union/Trade Bolt, Rogue Ad Backfire, Category-5 Hurricane, Leaked Communications, Surprise Court Ruling, Viral Debate Meltdown, Rival Endorsement Crossing Aisle, Gas Price Spike, Whistleblower Quid-Pro-Quo, Third-Party Spoiler Surge, AI Deepfake Hoax, Auto Plant Closure, Secret Primary Deal Exposed, Grassroots Small-Donor Surge).
   - Each surprise must define: `id`, `title`, `body`, `severity`, `targetType` (`national` | `region` | `state` | `candidate`), and 2–3 **grand-strategy choices** affecting Tri-Partisan Trust, Wave Momentum, Sitting Member Happiness, or Budget.
4. **Update Reserved `EVENTS` Metadata (`REQ-17` continuity):**
   - Tag standard `EVENTS` in `data.js` so they serve as the non-Week-13 weekly campaign events during Weeks 1–12 and 14–15 of the 15-turn campaign (`REQ-39`).

---

### Agent 2 — Core Simulation, Campaign Loop & Forecaster Engine
**Files Owned:** `engine.js`  
**Assigned Items:** `REQ-39`, `REQ-12` (Model), `REQ-19`, `REQ-33`, `REQ-40` (Logic), `REQ-41` (Trigger/Effects), `REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34`, `REQ-43`

#### Instructions for Agent 2:
1. **Starting Trust Calibration (`REQ-43` — Tiny):**
   - Set initial party trust in `createGame()` to **`supporters: 88`** *(within 85–90)*, `independents: 50`, and **`opponents: 12`** *(within 10–15)*.
2. **15-Turn Grand-Strategy Campaign Phase (`REQ-39` — Huge):**
   - When the 20 organizing turns and primaries conclude, instead of jumping straight to Election Night, initialize **`game.campaign` (`week: 1` of `15`)**.
   - **Weekly Turn Loop (Weeks 1–15):**
     1. Generate **Weekly Funding Requests** from competitive/underfunded candidates (and extensible `weeklyFundingRequests[]` slots). Refusing requests applies margin-sensitive happiness penalties (`REQ-19`).
     2. Trigger **Weekly Campaign Events**: standard `EVENTS` in Weeks 1–12 & 14–15, and a guaranteed **October Surprise (`REQ-41`)** in **Week 13** (3rd-to-last week).
     3. Allow **Weekly National Leader Deployment (`REQ-40`)**—all assigned national leaders (`REQ-11`) grant a flat **`+1` boost to all races in their assigned state** for that week (with code hooks for future regional/ideological scaling).
     4. Provide **Weekly Grand-Strategy Actions** (`REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34`, and funding adjustments `REQ-19`)—no candidate-level tactical actions.
     5. Refresh **Satirical Forecasters (`REQ-12`)** and **Wave Momentum (`REQ-33`)** at the end of each week.
     6. After **Week 15** resolves, run General Election Night and append the full cycle result to **Election History (`REQ-38`)**.
3. **Satirical Forecasters Model (`REQ-12` — Medium, Engine Layer):**
   - Implement two distinct forecasting engines parodying *Sallow's Crystal Ball* (e.g., *Sallow's Magic 8-Ball*) and *The Cook Political Report* (e.g., *The Chef Political Report*), categorizing every Presidential, Senate, Governor, and key House race into `Solid`, `Likely`, `Lean`, and `Toss-Up` with slight editorial variance between the two outlets.
   - Ensure raw numerical pre-election polls remain suppressed/disabled.
4. **Candidate Budget Baselines & Margin-Sensitive Cajoling (`REQ-19` — Medium):**
   - Auto-allocate baseline commitments entering the 15-week campaign:
     - **`$1M`** per **House incumbent**; **`$5M`** per **Senate race** with an incumbent.
     - **50% (`$0.5M` House / `$2.5M` Senate)** for non-incumbent **Major Parties** (≥20% last presidential vote per `REQ-20`).
   - Allow pulling/reallocating baseline funds (`pullCandidateFunds(raceKey)`) and calculate **Margin-Sensitive Upset**:
     - Heavy polling lead or blowout win → **0 or minimal upset**.
     - Trailing in a close race → **high upset**.
     - Losing a close race where resources were pulled → **infuriated** (severe `Sitting Member Happiness` & faction fallout).
   - Unendorsed primary winners (`REQ-04`) enter Week 1 unhappy and require extra funding or cajoling (`REQ-28`) to perform at full strength.
5. **Wave Election / National Momentum Pendulum (`REQ-33` — Medium):**
   - Compute `waveMomentum` (`-10` to `+10`) from `trust.supporters + trust.independents` differential vs. rival parties.
   - Apply `waveMomentum` on Election Night so late undecideds in `Toss-Up` races (`REQ-12`) break cohesively in the direction of the national wave.
6. **New Grand-Strategy Party Actions (`REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34` — Small each):**
   - `REQ-26`: **Candidate Vetting (`Self-Vet`) & Oppo Dossier** (exposes/penalizes high-`Corruption` primary threats or reduces rival `independents` trust in a state).
   - `REQ-28`: **Caucus Retreat & Candidate Cajoling Session** (repairs `sittingMemberHappiness` and appeases unendorsed/defunded nominees).
   - `REQ-29`: **National Surrogate Media Blitz** (deploys `Rhetorical Leader` using `Charisma` & `Persuadability` to lift nationwide `independents`/`opponents` trust while raising their `Fame`).
   - `REQ-31`: **Joint Fundraising Committee / Victory Fund** (pairs a high-`Fame`, high-`Charisma` leader with state chapters to raise treasury, raising that leader's `Fame`).
   - `REQ-34`: **State Ballot Measure Turnout Driver** (available in states where you do *not* hold the legislature; boosts target demographic/issue turnout in that state for one election).

---

### Gate 1 — Data & Engine Integration Verification (Integration Agent)
Before Agent 3 starts UI work, the Integration Agent verifies in Node / headless check:
- Load order `data.js` → `scenario-2028.js` → `issues-0.2.1.js` → `maps-0.3.js` → `state-house-data-0.5.js` → `voter-model-0.5.js` → `v07-scaffolding.js` → `engine.js` parses with zero `SyntaxError`s or global symbol collisions.
- `createGame()` initializes trust at `85–90 / 50 / 10–15` (`REQ-43`).
- `KS`, `TX`, `ME`, `IA`, and `SC` Senate Class II baselines reflect Democratic control (`REQ-42`).
- Advancing 20 organizing turns enters `game.campaign.week === 1` and iterates cleanly through `Week 15` → `Election Night` → `Year + 2`.
- **Week 13** deterministically fires an event from `OCTOBER_SURPRISES` (`REQ-41`) and exposes 20 total entries.
- `HISTORICAL_ELECTIONS` merges cleanly with simulated election outputs (`REQ-38`), and `weeklyRequests` / `campaignAdModifiers` hooks exist for v0.9 `REQ-18`.

---

### Agent 3 — Fullscreen Tabbed UI, Campaign Menus & Landscape Maps
**Files Owned:** `app.js`, `styles.css`, `index.html`  
**Assigned Items:** `REQ-39` (Campaign UI), `REQ-12` (Forecaster UI), `REQ-19` (Funding & Cajoling UI), `REQ-33` (Momentum Pendulum Bar), `REQ-40` (Leader Deployment Map), `REQ-41` (October Surprise Modal), `REQ-22` & `REQ-23` (Landscape Maps), `REQ-26/28/29/31/34` (Action UI), `REQ-38` (History Timeline UI)

#### Instructions for Agent 3:
1. **15-Week Campaign Phase View (`REQ-39` + `REQ-40` + `REQ-19` + `REQ-41`):**
   - Inside the fullscreen `Actions` tab during Weeks 1–15, render a clean **Campaign Command Dashboard** showing `Week X of 15`, pending **Weekly Funding Requests** (`Approve` / `Refuse` with projected upset risk badge based on polling margin), **Weekly Grand-Strategy Actions** (`REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34`), and **Candidate Budget Triage** (`REQ-19` baseline sliders/pull buttons).
   - **Weekly National Leader Deployment Map (`REQ-40`):** Build a dedicated major sub-screen/modal containing an interactive **50-state SVG map** shaded by **partisan lean** with glowing/bordered **Recommended Target States** highlights. Players assign all active national leaders (`REQ-11`) to states each week and clearly see the `+1 to all races` preview.
   - **October Surprise Presentation (`REQ-41`):** In **Week 13**, present a high-impact breaking-news banner/decision panel for the October Surprise with clear grand-strategy response choices.
2. **Satirical Forecasters & Wave Pendulum (`REQ-12` + `REQ-33`):**
   - Inside the `Forecast` tab (and pre-election summary), replace any raw numerical race polling with side-by-side **Sallow & Cook Parody Cards and Maps** (`Solid / Likely / Lean / Toss-Up`).
   - Render the **Wave Election / National Momentum Pendulum (`REQ-33`)** as a prominent tug-of-war meter showing which party holds the national wind.
3. **Political Landscape Maps (`REQ-22` + `REQ-23` — Small each):**
   - Add two new selectable map tabs in the `Map` view's Political Landscape bar:
     - **State Lean Gradient (`REQ-22`):** Smooth partisan lean color gradient across all 50 states + gradient legend.
     - **Trifectas & Mixed Control (`REQ-23`):** Distinctly colors and labels Democratic Trifectas, Republican Trifectas, and each distinct type of divided/mixed control (Dem Gov + GOP Leg, GOP Gov + Dem Leg, Split Leg + Dem Gov, Split Leg + GOP Gov) with text badges alongside colors.
4. **Unified Election History Timeline (`REQ-38` — Small):**
   - Render `HISTORICAL_ELECTIONS` chronologically below newly played cycles (`2028+`) in the Election History view, visually distinguishing real historical baselines from player-generated cycles.

---

### Gate 2 — UI & Engine End-to-End Integration Verification (Integration Agent)
After Agent 3 completes UI changes and before Agent 4 packages the build, the Integration Agent verifies:
- `index.html` script order (`data.js` → `scenario-2028.js` → `issues-0.2.1.js` → `maps-0.3.js` → `state-house-data-0.5.js` → `voter-model-0.5.js` → `v07-scaffolding.js` → `engine.js` → `app.js`) mounts with zero runtime errors.
- Campaign Dashboard (`REQ-39`), Weekly Leader Deployment Map (`REQ-40`), Week 13 October Surprise panel (`REQ-41`), Sallow & Cook Forecast views (`REQ-12`), Wave Pendulum (`REQ-33`), State Lean Gradient (`REQ-22`), Trifectas & Mixed Control (`REQ-23`), and Election History (`REQ-38`) all bind cleanly to `engine.js` actions/state.
- Zero raw pre-election numerical polls leak into `app.js`, zero `1.55` text appears anywhere, and all `maps-0.3.js` rings keep `!` delimiters.

---

### Phase 3 — Agent 4 (QA, Save Migration & Release Packaging)
**Files Owned:** `engine.js` (`normalizeGame` / `migrateSave` only), `build.ps1`, `VERSION_0.8.md`

#### Instructions for Agent 4:
1. **Save Migration (`normalizeGame` / `migrateSave`):**
   - Hydrate v0.5/v0.6/v0.7 saves cleanly with default `campaign`, `candidateFunding`, `forecasters`, `waveMomentum`, and `HISTORICAL_ELECTIONS` backfill.
2. **Full Playthrough & Studio Invariant Audit:**
   - Verify a complete cycle: `20 Organizing Turns → Primaries → Forecasters Launch → 15 Campaign Weeks (with Week 13 October Surprise) → Wave-Modified Election Night → Election History Update`.
   - Verify **zero raw polls** appear before Election Night (`REQ-12` / `DEF-06`).
   - Verify **155M scale** (no `1.55` text), **Senate Class II** colors (`KS`, `TX`, `ME`, `IA`, `SC` Democratic per `REQ-42`), **! ring delimiter**, and **`ART_STYLE.md`** visual compliance.
3. **Package & Document:**
   - Verify `build.ps1` includes every runtime script/asset and run `./build.ps1` to generate `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe`, then author `VERSION_0.8.md`.

---

## 5. Copy-and-Paste Commands for All Agents

Copy the corresponding block below directly into each agent session. Run **Integration Agent (Phase 0)** first, then launch **Agent 1** and **Agent 2** in parallel, run **Integration Agent (Gate 1)** before launching **Agent 3**, run **Integration Agent (Gate 2)** before **Agent 4**, and finish with **Integration Agent (Final Sign-Off)**.

### A. Integration Agent (Master Prompt — Orchestrator & Gate Runner)

```text
You are the INTEGRATION AGENT for "Coalition Builder: Party Chair" (Version 0.8: "The 15-Week Campaign & Pundit Forecast Update").
Workspace: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

FIRST, read these files carefully before taking any action:
1. VERSION_0.8_DESIGN.md
2. GAME_STYLE_GUIDE.md
3. ART_STYLE.md
4. index.html and build.ps1

YOUR MISSION & BOUNDARIES:
- You own cross-agent contract locks, script/data/engine/UI integration verification, studio invariant audits, and Gate PASS/FAIL sign-offs across all 5 phases (Phase 0, Gate 1, Gate 2, Final Sign-Off).
- STRICT FILE OWNERSHIP: Do NOT write feature code inside data.js, scenario-2028.js, maps-0.3.js, engine.js, app.js, styles.css, or index.html unless fixing a tiny, explicitly documented cross-file seam mismatch at a gate (never edit Battle For America files under any circumstance).
- If a gate check uncovers non-trivial logic or UI bugs, issue a crisp FAIL report listing exact file/line/repro and hand back to the owning agent (Agent 1, 2, 3, or 4).
- If creating temporary verification harnesses (e.g., Node vm smoke checks), place them only in obj/ or scratch and clean them up before sign-off.

MANDATORY STUDIO INVARIANTS YOU MUST ENFORCE AT EVERY GATE:
1. Grand Strategy Genre (`GAME_STYLE_GUIDE.md` §4.0): Weekly campaign actions must be macro party-chair decisions—zero local rallies, bus tours, or door-knocking.
2. Battle For America Read-Only: Verify no Battle For America files were touched.
3. 155M Represented-Voter Scale: Grep data/engine/UI to confirm "1.55" never appears in UI strings or tooltips.
4. No Raw Pre-Election Polls (`REQ-12` / `DEF-06`): Only Sallow & Cook satirical forecasters (`Solid / Likely / Lean / Toss-Up`) may show pre-election race ratings.
5. Map & Visual Invariants: Multi-ring polygons in maps-0.3.js use `!` (never `|`), and UI follows `ART_STYLE.md` palette/typography/accessibility rules.
6. Deferred Boundaries: Preserve `weeklyRequests[]` / `campaignAdModifiers` extensibility hooks for v0.9 `REQ-18` (Super PACs), keep Youth Chapters name-only, keep 2028 presidential tickets fixed (Ossoff vs. Vance).

EXECUTION STAGES (run the stage requested now, or execute sequentially if orchestrating):
- PHASE 0 (Contract Lock): Inspect current exports in `data.js`, `scenario-2028.js`, `v07-scaffolding.js`, `engine.js`, and `app.js`. Verify/document exact global symbol names and schemas for `game.campaign`, `game.candidateFunding`, `game.forecasters`, `HISTORICAL_ELECTIONS`, `OCTOBER_SURPRISES`, and v0.9 hooks (`weeklyRequests`, `campaignAdModifiers`) before Agents 1 & 2 begin.
- GATE 1 (Data + Engine Check): Run Node/PowerShell syntax and headless `vm` checks loading scripts in exact `index.html` order (`data.js` -> `scenario-2028.js` -> `issues-0.2.1.js` -> `maps-0.3.js` -> `state-house-data-0.5.js` -> `voter-model-0.5.js` -> `v07-scaffolding.js` -> `engine.js`). Verify:
  1) `createGame()` sets trust `supporters` in 85–90, `independents` = 50, `opponents` in 10–15 (`REQ-43`);
  2) `KS`, `TX`, `ME`, `IA`, `SC` Senate Class II baselines show Democratic control while preserving `AK` (Mary Peltola), `MS` (Scott Colom), `NC`, and legacy Class II Democratic holds (`REQ-42`);
  3) Advancing 20 organizing turns enters `game.campaign.week === 1`, runs Weeks 1–15, triggers an `OCTOBER_SURPRISES` event (20 total defined) in Week 13 (`REQ-41`), computes `waveMomentum` (`REQ-33`), updates Sallow/Cook forecasters (`REQ-12`), applies `+1` per leader state deployment (`REQ-40`), enforces `$1M/$5M` baselines & margin-sensitive cajoling (`REQ-19`), supports Actions `REQ-26/28/29/31/34`, resolves Election Night, and appends to history (`REQ-38`).
- GATE 2 (UI + Engine Smoke Check): Verify `app.js`, `styles.css`, and `index.html` wire cleanly to `engine.js` with zero uncaught errors, zero raw polls before Election Night, working tabs/maps (`REQ-22`, `REQ-23`, `REQ-40`, `REQ-12`, `REQ-33`, `REQ-38`, `REQ-39`), and all `ART_STYLE.md` + scale invariants passing.
- FINAL RELEASE SIGN-OFF: Verify Agent 4's save migration (`normalizeGame` / `migrateSave` with v0.5–v0.7 saves), confirm `build.ps1` succeeds cleanly, inspect `VERSION_0.8.md`, and issue final PASS/FAIL sign-off.

Begin by stating which phase/gate you are executing (or start with Phase 0 Contract Lock if launching the pipeline from scratch) and produce a structured checklist report.
```

#### Quick Stage Triggers (Optional — Use if Running Integration Agent Step-by-Step in the Same Thread)

- **Phase 0 Trigger:**
  ```text
  INTEGRATION AGENT — RUN PHASE 0 (CONTRACT LOCK):
  Audit data.js, scenario-2028.js, v07-scaffolding.js, engine.js, and app.js in c:\Users\rober\.gemini\antigravity\scratch\party-chair-game. Publish the exact locked v0.8 schema contract (`game.campaign`, `game.candidateFunding`, `game.forecasters`, `HISTORICAL_ELECTIONS`, `OCTOBER_SURPRISES`, action names, and v0.9 `REQ-18` hooks) so Agents 1 & 2 can run in parallel with zero merge conflicts.
  ```
- **Gate 1 Trigger:**
  ```text
  INTEGRATION AGENT — RUN GATE 1 (DATA + ENGINE VERIFICATION):
  Agents 1 & 2 have finished. Do not edit feature code outside documented tiny seam fixes. Load all scripts up through engine.js in `index.html` order via headless Node `vm`, simulate `createGame()` -> 20 organizing turns -> Primaries -> Campaign Weeks 1–15 (confirming Week 13 October Surprise from 20 entries) -> Election Night -> Next Cycle, verify REQ-42/REQ-43/REQ-12/REQ-19/REQ-33/REQ-40/REQ-41/REQ-26/28/29/31/34/REQ-38 invariants, and issue Gate 1 PASS or FAIL before Agent 3 begins.
  ```
- **Gate 2 Trigger:**
  ```text
  INTEGRATION AGENT — RUN GATE 2 (UI + ENGINE SMOKE TEST):
  Agent 3 has finished app.js, styles.css, and index.html. Verify script load order, UI-to-engine bindings across REQ-39/40/41/12/33/19/22/23/26/28/29/31/34/38, zero raw pre-election polls, zero `1.55` UI strings, `!` map delimiters, and ART_STYLE.md compliance. Issue Gate 2 PASS or FAIL before Agent 4 begins.
  ```
- **Final Release Sign-Off Trigger:**
  ```text
  INTEGRATION AGENT — RUN FINAL RELEASE SIGN-OFF:
  Agent 4 has completed save migration, ./build.ps1 packaging, and VERSION_0.8.md. Verify v0.5/v0.6/v0.7 save hydration, confirm dist/release/Coalition Builder - Party Chair.exe built cleanly with all assets, audit studio invariants across the workspace, and issue final v0.8 RELEASE PASS or FAIL.
  ```

---

### B. Agent 1 — Data, Historical Records & October Surprises Architect

```text
You are AGENT 1 (Data, Historical Records & October Surprises Architect) for "Coalition Builder: Party Chair" Version 0.8.
Workspace: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

FIRST, read these files:
1. VERSION_0.8_DESIGN.md (focus on Phase 0 schema contract & Agent 1 instructions)
2. GAME_STYLE_GUIDE.md and ART_STYLE.md
3. data.js, scenario-2028.js, maps-0.3.js, and VERSION_0.7.md

STRICT FILE OWNERSHIP:
- YOU MAY ONLY EDIT: `data.js`, `scenario-2028.js`, `maps-0.3.js`
- DO NOT EDIT: `engine.js`, `app.js`, `styles.css`, `index.html`, `build.ps1`, or any Battle For America files.

YOUR ASSIGNED ITEMS:
1. `REQ-42` (Tiny) — Senate Class II Map Control Calibration:
   - Update Senate Class II baseline ownership/incumbents in `scenario-2028.js` and `maps-0.3.js` so Democrats control Kansas (`KS`), Texas (`TX`), Maine (`ME`), Iowa (`IA`), and South Carolina (`SC`).
   - Preserve prior `REQ-13` Democratic Class II seats (`AK` Mary Peltola, `MS` Scott Colom, `NC`, and existing Class II Dem holds), and keep VT/ME caucus alignment clean.
   - CRITICAL MAP INVARIANT: Never replace `!` multi-ring delimiters with `|` in `maps-0.3.js`.
2. `REQ-38` (Small, Data Layer) — Real U.S. Election History Dataset:
   - Export `HISTORICAL_ELECTIONS` in `scenario-2028.js` with accurate historical U.S. presidential & midterm records leading into 2028 (year, cycleType, presidential nominees & winners, EVs, national popular vote %, House seat split, Senate seat split, and an explicit `isHistorical: true` flag so `app.js` cleanly distinguishes historical records from `2028+` player-generated cycles).
3. `REQ-41` (Medium, Data Layer) — 20 Major October Surprises Catalog:
   - Export `OCTOBER_SURPRISES` in `data.js` with ALL 20 distinct major surprises:
     1) Hot-Mic Donor Gala Recording, 2) Late Ethics Indictment, 3) Ceasefire Breakthrough, 4) Overseas Crisis, 5) Jobs/Inflation Shock, 6) Federal Investigation Reopened, 7) Union/Trade Bolt, 8) Rogue Ad Backfire, 9) Category-5 Hurricane, 10) Leaked Communications, 11) Surprise Court Ruling, 12) Viral Debate Meltdown, 13) Rival Endorsement Crossing Aisle, 14) Gas Price Spike, 15) Whistleblower Quid-Pro-Quo, 16) Third-Party Spoiler Surge, 17) AI Deepfake Hoax, 18) Auto Plant Closure, 19) Secret Primary Deal Exposed, 20) Grassroots Small-Donor Surge.
   - Every entry must include `id`, `title`, `body`, `severity`, `targetType` (`national` | `region` | `state` | `candidate`), and 2–3 GRAND-STRATEGY response choices (`GAME_STYLE_GUIDE.md` §4.0: no bus tours/rallies/door-knocking) modifying Tri-Partisan Trust (`supporters`, `independents`, `opponents`), `waveMomentum`, `sittingMemberHappiness`, or `budget`.
4. `REQ-17` Continuity — Weekly Campaign Event Tagging:
   - Tag existing `EVENTS` in `data.js` so Agent 2 can draw standard campaign events in Weeks 1–12 and 14–15 while reserving Week 13 strictly for `OCTOBER_SURPRISES`.

DEFINITION OF DONE:
- Run syntax/load check via Node on `data.js`, `scenario-2028.js`, and `maps-0.3.js` (confirming `OCTOBER_SURPRISES.length === 20`, `HISTORICAL_ELECTIONS.length > 0`, `KS/TX/ME/IA/SC` Class II = Democratic, zero `|` delimiters in `maps-0.3.js`, and zero `1.55` strings).
- Report exact exported symbol names and object shapes to the Integration Agent for Gate 1.
```

---

### C. Agent 2 — Core Simulation, Campaign Loop & Forecaster Engine

```text
You are AGENT 2 (Core Simulation, Campaign Loop & Forecaster Engine) for "Coalition Builder: Party Chair" Version 0.8.
Workspace: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

FIRST, read these files:
1. VERSION_0.8_DESIGN.md (focus on Phase 0 schema contract, Scope Boundary Note, & Agent 2 instructions)
2. GAME_STYLE_GUIDE.md and ART_STYLE.md
3. engine.js, data.js, scenario-2028.js, v07-scaffolding.js, and VERSION_0.7.md

STRICT FILE OWNERSHIP:
- YOU MAY ONLY EDIT: `engine.js` (leave `normalizeGame` / `migrateSave` migration scaffolding intact for Agent 4, or coordinate cleanly without breaking existing v0.5–v0.7 load support).
- DO NOT EDIT: `data.js`, `scenario-2028.js`, `maps-0.3.js`, `app.js`, `styles.css`, `index.html`, `build.ps1`, or any Battle For America files.

YOUR ASSIGNED ITEMS:
1. `REQ-43` (Tiny) — Starting Trust Calibration:
   - In `createGame()`, calibrate initial trust to `supporters: 88` (within 85–90), `independents: 50`, `opponents: 12` (within 10–15).
2. `REQ-39` (Huge) — 15-Turn Grand-Strategy Campaign Phase:
   - After the 20 organizing turns + primaries complete, initialize `game.campaign` (`active: true, week: 1, maxWeeks: 15`) instead of resolving General Election Night immediately.
   - Weekly loop (Weeks 1–15):
     a) Generate candidate/faction `weeklyRequests[]` (include empty/extensible `campaignAdModifiers` and `weeklyRequests` hooks so v0.9 `REQ-18` Super PACs plug in cleanly without rewriting the loop). Refusing requests applies margin-sensitive happiness fallout (`REQ-19`).
     b) Draw standard `EVENTS` in Weeks 1–12 & 14–15, and deterministically trigger 1 entry from `OCTOBER_SURPRISES` in **Week 13** (`REQ-41`).
     c) Resolve Weekly National Leader Deployments (`REQ-40`): assigning all active national leaders (`REQ-11`) grants a flat `+1` boost to all races in each leader's assigned state for that week (comment/hook clean scaling seam for future regional/ideological scaling). Also compute recommended target states dynamically by race competitiveness & partisan lean.
     d) Execute Weekly Grand-Strategy Actions (`REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34`, and `REQ-19` budget triage)—strictly macro chair decisions per `GAME_STYLE_GUIDE.md` §4.0.
     e) Recalculate `game.forecasters` (`REQ-12`) and `game.campaign.waveMomentum` (`REQ-33`) at week end.
     f) After Week 15 resolves, execute General Election Night and append full cycle results to `game.elections` (`REQ-38` timeline merges with `HISTORICAL_ELECTIONS`).
3. `REQ-12` (Medium) — Satirical Forecasters (`Sallow` & `Cook` Parodies):
   - Maintain `game.forecasters.sabato` (e.g., *Sallow's Magic 8-Ball*) and `game.forecasters.cook` (e.g., *The Chef Political Report*) rating President, Senate, Governor, and key House races into `Solid`, `Likely`, `Lean`, and `Toss-Up` with subtle house-style variance.
   - Do NOT emit raw numerical pre-election race polls; keep raw numbers suppressed prior to Election Night.
4. `REQ-19` (Medium) — Candidate Budgets ($1M / $5M Baselines) & Margin-Sensitive Cajoling:
   - Auto-allocate `$1M` per House incumbent, `$5M` per Senate race with an incumbent, and 50% (`$0.5M` House / `$2.5M` Senate) for non-incumbent Major Parties (>= 20% last presidential vote per `REQ-20`).
   - Support `pullCandidateFunds(raceKey)` / reallocation and compute **Margin-Sensitive Upset**: blowout/heavy lead -> 0 or minimal upset; close trailing -> high upset; close loss where funds were pulled -> infuriated (`sittingMemberHappiness` & faction penalty). Flag unendorsed primary winners (`REQ-04`) entering Week 1 unhappy until funded or cajoled (`REQ-28`).
5. `REQ-33` (Medium) — Wave Election / National Momentum Pendulum:
   - Compute `waveMomentum` (`-10` to `+10`) from `trust.supporters + trust.independents` differential vs. rivals and break late undecideds in `Toss-Up` races cohesively on Election Night.
6. New Grand-Strategy Actions (`REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34`):
   - `REQ-26`: Self-Vet & Oppo Research Dossier (mitigates high-`corruption` primary risk or erodes rival `independents` trust in a target state).
   - `REQ-28`: Caucus Retreat & Candidate Cajoling Session (restores `sittingMemberHappiness` and pacifies unendorsed/underfunded nominees).
   - `REQ-29`: National Surrogate Media Blitz (deploys Rhetorical Leader using `charisma` & `persuadability` to lift nationwide `independents`/`opponents` trust + increase leader `fame`).
   - `REQ-31`: Joint Fundraising / Down-Ballot Victory Fund (pairs high-`fame`, high-`charisma` leader with state chapters to raise budget + boost leader `fame`).
   - `REQ-34`: State Ballot Measure Turnout Driver (legal only in states where player does NOT control the state legislature; boosts target demographic/issue turnout for the upcoming election).

DEFINITION OF DONE:
- Keep Battle For America formulas (`RACE_WEIGHT.house = 0.34`, etc.) intact without modifying any Battle For America files, and never expose `1.55` in logs/text.
- Run a headless Node `vm` test verifying `createGame()` -> 20 turns -> 15 campaign weeks (Week 13 surprise) -> Election Night -> next cycle with zero runtime errors, then notify the Integration Agent for Gate 1.
```

---

### D. Agent 3 — Fullscreen Tabbed UI, Campaign Menus & Landscape Maps

```text
You are AGENT 3 (Fullscreen Tabbed UI, Campaign Menus & Landscape Maps) for "Coalition Builder: Party Chair" Version 0.8.
Workspace: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

WAIT FOR GATE 1 PASS from the Integration Agent before starting.

FIRST, read these files:
1. VERSION_0.8_DESIGN.md (focus on Phase 0 schema contract & Agent 3 instructions)
2. ART_STYLE.md and GAME_STYLE_GUIDE.md
3. app.js, styles.css, index.html, engine.js, scenario-2028.js, and maps-0.3.js

STRICT FILE OWNERSHIP:
- YOU MAY ONLY EDIT: `app.js`, `styles.css`, `index.html`
- DO NOT EDIT: `data.js`, `scenario-2028.js`, `maps-0.3.js`, `engine.js`, `build.ps1`, or any Battle For America files.

YOUR ASSIGNED ITEMS:
1. `REQ-39` + `REQ-19` + `REQ-41` (15-Week Campaign Command Dashboard in `Actions` tab):
   - During `game.campaign.active` (Weeks 1–15), transform the fullscreen `Actions` tab into a clean Grand-Strategy Campaign Command Dashboard showing `Week X of 15`, treasury/budget bar, **Weekly Funding Requests** (`Approve` / `Refuse` with margin-based upset-risk indicator), **Candidate Budget Triage** (`$1M`/`$5M` baselines, pull/reallocate controls, unhappy unendorsed-winner flags), and **Weekly Grand-Strategy Actions** (`REQ-26` Self-Vet/Oppo, `REQ-28` Caucus Retreat/Cajoling, `REQ-29` National Surrogate Media Blitz, `REQ-31` Joint Victory Fund, `REQ-34` State Ballot Measures where player lacks legislature control).
   - In **Week 13**, present a high-impact **October Surprise** breaking-news decision banner/modal (`REQ-41`) displaying the surprise details and 2–3 grand-strategy choices.
2. `REQ-40` (Major Menu: Weekly National Leader Deployment Map):
   - Add a dedicated major deployment menu/modal featuring an interactive **50-state SVG map** shaded by **partisan lean** with glowing/badged **Recommended Target States** highlights.
   - Let players assign all active national leaders (`REQ-11`) to states each week and preview the flat **`+1` boost to all races in the state** (plus list/select fallback & accessible labels).
3. `REQ-12` + `REQ-33` (`Forecast` Tab — Satirical Forecasters & Wave Pendulum):
   - CRITICAL RULE: **Zero raw numerical pre-election race polls anywhere in UI.** Replace any pre-election race poll numbers with side-by-side **Sallow & Cook Parody Cards and Maps** (`Solid`, `Likely`, `Lean`, `Toss-Up`).
   - Add a prominent **Wave Election / National Momentum Pendulum (`REQ-33`)** tug-of-war meter showing national wind direction and magnitude.
4. `REQ-22` & `REQ-23` (Political Landscape Maps in `Map` Tab):
   - Add two selectable sub-views in the `Map` Political Landscape bar:
     - **State Lean Gradient (`REQ-22`):** Smooth partisan lean color gradient across all 50 states + readable gradient legend.
     - **Trifectas & Mixed Control (`REQ-23`):** Distinctly colors and text-labels Democratic Trifectas, Republican Trifectas, and every divided/mixed combination (Dem Gov + GOP Leg, GOP Gov + Dem Leg, Split Leg + Dem Gov, Split Leg + GOP Gov, preserving whole-state Purple for split legislatures per `ART_STYLE.md`).
5. `REQ-38` (Unified Election History Timeline):
   - Render `HISTORICAL_ELECTIONS` chronologically below player-generated `2028+` cycles in the Election History view, with clear visual badges separating historical baselines from simulated cycles.

STYLE & ACCESSIBILITY INVARIANTS (`ART_STYLE.md`):
- Deep Navy / Raised Navy / Warm Ivory / Muted Copper / Muted Teal / Coral / Slate palette; serif headings (`Iowan Old Style` / `Palatino` / `Georgia`), clean sans body, monospace metrics; desktop/tablet/mobile responsiveness.
- Pair every color state with text labels and preserve visible keyboard focus states.
- NEVER display `1.55` anywhere in UI copy (electorate scale = `155M` represented voters).

DEFINITION OF DONE:
- Verify JS syntax of `app.js` and `index.html` script references, ensure zero console errors on Campaign Weeks 1–15, Maps, Forecast, and History views, and notify the Integration Agent for Gate 2.
```

---

### E. Agent 4 — QA, Save Migration & Release Packaging

```text
You are AGENT 4 (QA, Save Migration & Release Packaging) for "Coalition Builder: Party Chair" Version 0.8.
Workspace: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game

WAIT FOR GATE 2 PASS from the Integration Agent before starting.

FIRST, read these files:
1. VERSION_0.8_DESIGN.md
2. GAME_STYLE_GUIDE.md and ART_STYLE.md
3. engine.js (around `normalizeGame` / `migrateSave`), `build.ps1`, `index.html`, `VERSION_0.7.md`

STRICT FILE OWNERSHIP:
- YOU MAY ONLY EDIT: `normalizeGame` / `migrateSave` in `engine.js`, `build.ps1` (if new files need packaging), and create `VERSION_0.8.md`.
- DO NOT alter core gameplay/UI logic in `data.js`, `scenario-2028.js`, `maps-0.3.js`, `engine.js` outside save hydration, or `app.js`/`styles.css` (bounce defects to the owning agent or Integration Agent), and NEVER edit Battle For America files.

YOUR ASSIGNED TASKS:
1. Save Migration (`normalizeGame` / `migrateSave` in `engine.js`):
   - Backfill v0.5, v0.6, and v0.7 saves cleanly with safe defaults for `game.campaign` (including `weeklyRequests`, `campaignAdModifiers`, `leaderDeployments`, `waveMomentum`), `game.candidateFunding` (`$1M`/`$5M` baselines), `game.forecasters` (`sabato` & `cook`), and `HISTORICAL_ELECTIONS` integration.
2. End-to-End Playthrough & Studio Invariant Audit:
   - Run automated headless verification covering: `createGame()` (trust 85–90 / 50 / 10–15) -> 20 organizing turns -> Primaries -> 15 Campaign Weeks (including leader deployments `+1`, funding approve/refuse upset math, all 5 actions `REQ-26/28/29/31/34`, and Week 13 `OCTOBER_SURPRISES`) -> Wave-modified Election Night -> Unified Election History -> next 2-year cycle.
   - Verify legacy v0.5/v0.6/v0.7 save JSON migrates without `undefined` crashes.
   - Audit zero raw numerical pre-election polls (`REQ-12` / `DEF-06`), zero `1.55` text strings, Senate Class II `KS/TX/ME/IA/SC` = Dem (`REQ-42`), `!` delimiters in `maps-0.3.js`, and `ART_STYLE.md` compliance.
3. Packaging & Release Notes:
   - Verify `build.ps1` includes every file referenced by `index.html`.
   - Run `./build.ps1` in PowerShell and verify both `dist/release/Coalition Builder - Party Chair.exe` and `dist/Coalition Builder - Party Chair.exe` build cleanly with exit code 0.
   - Author `VERSION_0.8.md` matching the clean structure of `VERSION_0.7.md`, documenting all 16 shipped v0.8 features (`REQ-39`, `REQ-12`, `REQ-19`, `REQ-33`, `REQ-40`, `REQ-41`, `REQ-22`, `REQ-23`, `REQ-26`, `REQ-28`, `REQ-29`, `REQ-31`, `REQ-34`, `REQ-38`, `REQ-42`, `REQ-43`).

DEFINITION OF DONE:
- Report exact command outputs, migration test results, `./build.ps1` artifact timestamps/sizes, and hand off to the Integration Agent for Final Release Sign-Off.
```
