# Coalition Builder: Party Chair — Design Backlog

This document maintains the persistent design backlog of future change requests, reported problems, and build planning proposals for **Coalition Builder: Party Chair**.

*(Note: Historical releases from **Version 0.1 through Version 0.16.0** have been archived into [**PRIOR_UPDATES.md**](PRIOR_UPDATES.md). Minor build **Version 0.15.9** is detailed in [**VERSION_0.15.9_DESIGN.md**](VERSION_0.15.9_DESIGN.md) delivering REQ-176 through REQ-194. Major landmark build **Version 0.16.0** is detailed in [**PARTY_SYSTEMS_DESIGN.md**](PARTY_SYSTEMS_DESIGN.md) delivering MAS-01. **Version 0.16.1** is packaged and specified in [**VERSION_0.16.1_DESIGN.md**](VERSION_0.16.1_DESIGN.md) delivering REQ-195 through REQ-223).*

## 1. Backlog Inventory & Build Readiness

### Build Threshold Rules
1. **Standard Major Build (`0.x.0`):**
   - **Massive (Macro Engine):** 1 Massive change constitutes its own multi-day standalone update cycle (above Huge)
   - **Major:** 1 Huge change **OR** 3 Large changes
   - **Medium:** 5 Medium changes
   - **Small:** 5 to 10 Small changes
   - **Tiny:** All pending Tiny changes (individual event changes default to Tiny)
   - Increments the second version digit (`0.x.0`).

2. **Minor Version Build (`0.0.x`):**
   - Triggered when the user commands **"build a minor version"**.
   - Packages **ALL pending Small and Tiny proposals**, and **up to 5 Medium proposals** (no Huge/Major requirement).
   - Increments the third version digit (`0.0.x`, e.g. `0.14.3` $\to$ `0.14.4` $\to$ `0.14.5` $\to$ `0.14.6`).
   - Packages an immediate, token-efficient agent handoff, followed by updating `DESIGN.md`, `PRIOR_UPDATES.md`, and `DESIGN_BACKLOG.md` upon completion.

### Current Future Backlog Counts (Version 0.17.0 Shipped Pipeline)
| Size | v0.16.9 (Shipped) | v0.17.0 (Shipped) | Total Pending | Major Build Threshold | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Massive** | **0** | **0** | **0** | 1 (Standalone multi-day cycle) | ⏳ Gathering Proposals (0 of 1) |
| **Huge** | **0** | **0** | **0** | 1 Huge **OR** 3 Large | ⏳ Gathering Proposals (0 of 1) |
| **Large** | **0** | **2** | **0** | 3 Large | ✅ Shipped in v0.17.0 (2 of 2) |
| **Medium** | **0** | **4** | **0** | 5 Medium | ✅ Shipped in v0.17.0 (4 of 4) |
| **Small** | **0** | **6** | **0** | 5 to 10 Small | ✅ Shipped in v0.17.0 (6 of 6) |
| **Tiny** | **0** | **0** | **0** | All pending | ⏳ Gathering Proposals (0 Tiny pending) |

> **📌 Pipeline Status:**
> - **Version 0.18.6 (Shipped Comprehensive Multi-Developer Integration Release):** Fully implemented and verified across **10 requirements (`REQ-320` through `REQ-329` — 2 Massive, 2 Huge, 1 Large, 3 Medium, 2 Small)** per [**PRIOR_UPDATES.md**](PRIOR_UPDATES.md). Integrates 100 Interstate Migration Patterns & Generational Cohort Turnover (`REQ-320`), Donor Class Dark-Money Super PAC Blocs & Electoral Reform Sandbox (`REQ-321`), Candidate Mentorship Pipeline & VP Vetting War Room (`REQ-322`), Minor-Party Ascent & Coalition Balance (`REQ-323`), Core Engine Fixes & Save Compaction (`REQ-324`), Organic Decennial Census Growth (`REQ-325`), Campaign Events Overhaul (`REQ-326`), Major-Party Economy & UI Optimization (`REQ-327`), Minor Party Atmospheric Legacy Fallback (`REQ-328`), and Decennial Redistricting Trust Swing Clamp (`REQ-329`).
> - **Version 0.18.3 (Shipped Opponent AI & Campaign Telemetry Release):** Fully implemented and verified per [**SYMMETRIC_OPPONENT_AI_DESIGN.md**](SYMMETRIC_OPPONENT_AI_DESIGN.md) across **4 requirements (`REQ-300`, `REQ-303`, `REQ-304`, `REQ-310` — 1 Massive, 2 Large, 1 Small)**.
> - **Version 0.17.0 (Shipped Landmark Build):** Fully implemented and verified per [**VERSION_0.17.0_DESIGN.md**](VERSION_0.17.0_DESIGN.md) across **12 requirements (`REQ-287` through `REQ-298` — 2 Large, 4 Medium, 6 Small)**.

### Version 0.18.6 Sized Inventory Matrix (Shipped in v0.18.6)
| Req ID | Title | Size | Status | Target Build |
| :--- | :--- | :---: | :---: | :---: |
| **REQ-320** | 100 Interstate Migration Patterns, Generational Cohorts & Demographic Dynamics | Massive | ✅ Shipped | v0.18.6 |
| **REQ-321** | Donor Class Dark-Money Super PAC Blocs & Electoral Reform Sandbox (Approval/NPVIC) | Massive | ✅ Shipped | v0.18.6 |
| **REQ-322** | Candidate Mentorship Pipeline & Vice Presidential Vetting War Room | Huge | ✅ Shipped | v0.18.6 |
| **REQ-323** | Minor-Party Ascent, Faction Dynamics & Coalition Balance (Classical Liberals/Accords) | Huge | ✅ Shipped | v0.18.6 |
| **REQ-324** | Core Engine Fixes, SOEE Bankruptcy & Save Compaction Optimization | Large | ✅ Shipped | v0.18.6 |
| **REQ-325** | Organic Decennial Census Growth & Reapportionment Engine | Medium | ✅ Shipped | v0.18.6 |
| **REQ-326** | Campaign Events Overhaul (157 Dynamic Story Arc Events & Voter Registration) | Medium | ✅ Shipped | v0.18.6 |
| **REQ-327** | Major-Party Economy & UI Optimization ($2.5B Warchest, Zero-Lag Triage) | Medium | ✅ Shipped | v0.18.6 |
| **REQ-328** | Minor Party Atmospheric Legacy & Hall of Fame Fallback | Small | ✅ Shipped | v0.18.6 |
| **REQ-329** | Decennial Redistricting Trust Swing Clamp ([-8, +8] Trust Clamp) | Small | ✅ Shipped | v0.18.6 |

### Version 0.18.3 Sized Inventory Matrix (Shipped in v0.18.3)
| Req ID | Title | Size | Status | Target Build |
| :--- | :--- | :---: | :---: | :---: |
| **REQ-300** | Autonomous Opponent Chair AI Engine & Cycle Pipeline Orchestrator | Massive | ✅ Shipped | v0.18.3 |
| **REQ-303** | Autonomous 5-Month Campaign Strategy & Strategic Airwaves AI | Large | ✅ Shipped | v0.18.3 |
| **REQ-304** | AI Crisis Management, Oppo Research Detonation & Debate Decision Matrix | Large | ✅ Shipped | v0.18.3 |
| **REQ-310** | Opponent Intelligence Telemetry, Morning Wire & Trail Ticker UI Feed | Small | ✅ Shipped | v0.18.3 |

### Version 0.17.0 Sized Inventory Matrix (Shipped in v0.17.0)
| Req ID | Title | Size | Status | Target Build |
| :--- | :--- | :---: | :---: | :---: |
| **REQ-290** | Faction-Tied Super PACs & Swing PAC Ecosystem (`TBD-11`, `TBD-17`) | Large | ✅ Shipped | v0.17.0 |
| **REQ-298** | State & State-Party Policy Preferences & Regional Elasticity | Large | ✅ Shipped | v0.17.0 |
| **REQ-287** | Party-Differentiated Voter Registration Patterns (`TBD-03`) | Medium | ✅ Shipped | v0.17.0 |
| **REQ-288** | Modular Filtering Support Toolkit Architecture (`TBD-09`) | Medium | ✅ Shipped | v0.17.0 |
| **REQ-289** | Modular Faction Endorsement Repercussions & Escalation Ladder (`TBD-10`) | Medium | ✅ Shipped | v0.17.0 |
| **REQ-296** | Faction Power-vs-Size Attrition & 5-Level Officeholder Audit (`TBD-26`) | Medium | ✅ Shipped | v0.17.0 |
| **REQ-291** | Politician Chronological Age Engine Delta & Trait Age Gates (`TBD-13`) | Small | ✅ Shipped | v0.17.0 |
| **REQ-292** | Coalition Demands Framework & Leadership Appointments Module (`TBD-16`) | Small | ✅ Shipped | v0.17.0 |
| **REQ-293** | Coalition Demand Module: Super PAC Airtime Commitments (`TBD-17`) | Small | ✅ Shipped | v0.17.0 |
| **REQ-294** | Coalition Demand Module: Candidate Slate Quotas (`TBD-20`) | Small | ✅ Shipped | v0.17.0 |
| **REQ-295** | Coalition Demand Module: Rival Faction Quarantine (`TBD-21`) | Small | ✅ Shipped | v0.17.0 |
| **REQ-297** | Faction Cohesion Metric (`TBD-27`) | Small | ✅ Shipped | v0.17.0 |

### Systems Expansion Inventory Matrix (Shipped v0.16.2)
| Req ID | Title | Size | Status | Target Build |
| :--- | :--- | :---: | :---: | :---: |
| **REQ-224** | Breakout State Legislator Spawner, 12-Member Roster Cap & Seasoning Lifecycle (`office: 'stateLeg'`) | Small | ✅ Shipped | v0.16.2 |
| **REQ-225** | Statehouse-to-Higher-Office Recruitment Pipeline & Seamless Career Promotion | Small | ✅ Shipped | v0.16.2 |
| **REQ-226** | Fallback Party Leadership Bench & Stepping-Stone `State Legislative Caucus Chair` Role | Small | ✅ Shipped | v0.16.2 |
| **REQ-227** | Third-Party Major Priorities Pack A — Vote-Threshold & Institutional Ascent (4 Quests) | Small | ✅ Shipped | v0.16.2 |
| **REQ-228** | Third-Party Major Priorities Pack B — Regional Bastion, Electoral Reform & Kingmaker Leverage (4 Quests) | Small | ✅ Shipped | v0.16.2 |
| **REQ-229** | Third-Party Major Priorities Pack C — Historic Breakthrough & Major-Party Displacement (4 Quests) | Small | ✅ Shipped | v0.16.2 |
| **REQ-230** | Deterministic Draft-of-7 Priorities Engine, Smart Hand Composition & `Push Our Issues` Gate | Small | ✅ Shipped | v0.16.2 |
| **REQ-231** | Step 2 Draft-of-7 Selection UI & Unlimited Escalating-Cost Redraws (`cost = redrawCount + 1`) | Small | ✅ Shipped | v0.16.2 |
| **REQ-232** | New Generic Major Priorities (`Turnout Engine` & `Build Up the Bench`) | Small | ✅ Shipped | v0.16.2 |
| **REQ-233** | Targetable Hostile-Territory Priorities (`Crack an Opponent Stronghold` & `Crack an Opponent's Fortress`) | Small | ✅ Shipped | v0.16.2 |
| **REQ-234** | Historical Party Systems Canon (1st–6th Eras), 7th Era Modern Populist Retitle & Timeline Info Modal | Small | ✅ Shipped | v0.16.2 |
| **REQ-235** | Dedicated `Create Custom Party` Setup Flow & Clean Neutral Initialization | Small | ✅ Shipped | v0.16.2 |
| **REQ-236** | Ironclad Democratic & Republican Leading-Faction Anchor Lock (`dem_liberal_establishment` & `gop_maga`) | Small | ✅ Shipped | v0.16.2 |
| **REQ-237** | Custom Party Starting Factions Picker, Pairwise `<= 2.0` Compatibility, `155M` & Politician Transfer | Medium | ✅ Shipped | v0.16.2 |
| **REQ-238** | Minor-Party Merger Dissolution, Orphaned Breakaway Factions (`seekingPartyHome`) & `"Sellout Grudge"` (B-6) | Medium | ✅ Shipped | v0.16.2 |
| **REQ-239** | Party Origin Stories — 4 Archetype Modifiers (Schism, Civic Reform, Grassroots Viral, Executive Third Way) | Small | ✅ Shipped | v0.16.2 |
| **REQ-240** | `Not a Major Movement` Exclusivity Lock & Custom `100K` Founding Faction Builder | Medium | ✅ Shipped | v0.16.2 |
| **REQ-241** | Founding Charter Traits (Pick 1–2 DNA Rules) & Party Branding Suite (Emblem, 3-Letter Code & Motto) | Small | ✅ Shipped | v0.16.2 |
| **REQ-242** | The `"Founder's Shadow"` Movement Aura & `"Survive the Founder"` First Succession Crisis (C-7) | Medium | ✅ Shipped | v0.16.2 |
| **REQ-243** | Custom-Party-Exclusive Priorities Pack A — Founding Momentum & Merger Arcs (`#1–#5`, Draft-of-7 Pool) | Small | ✅ Shipped | v0.16.2 |
| **REQ-244** | Custom-Party-Exclusive Priorities Pack B — Fortress, Grudge, Cross-Aisle & Homegrown Bench (`#6–#9`, Draft-of-7 Pool) | Small | ✅ Shipped | v0.16.2 |

*(All requirements through **REQ-244** have shipped through **Version 0.16.2**, and **MAS-01: The Party Systems Evolution Engine** has shipped in **Version 0.16.0**. Full implementation chronicles are archived in [**PRIOR_UPDATES.md**](PRIOR_UPDATES.md), [**VERSION_0.16.2_DESIGN.md**](VERSION_0.16.2_DESIGN.md), [**VERSION_0.16.1_DESIGN.md**](VERSION_0.16.1_DESIGN.md), and [**PARTY_SYSTEMS_DESIGN.md**](PARTY_SYSTEMS_DESIGN.md).)*

*(Major Build Version 0.15 is designed in `VERSION_0.15_DESIGN.md`. Minor Build Version 0.15.1 is designed in `VERSION_0.15.1_DESIGN.md`. Remaining Factions Engine TBD items are tracked in [**TBD_UPDATES.md**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/TBD_UPDATES.md) as `TBD-16`–`TBD-21` and `TBD-26`–`TBD-28`; former Factions TBD #1 & #2 [`TBD-30`, `TBD-31`] along with `TBD-04`–`TBD-08`, `TBD-12`, `TBD-22`, `TBD-23`, and `TBD-25` are now designed in **`v0.16.1`** above).*

## 2. Version 0.16.2 Active Sized Queue — Statehouse Farm Team, Draft-of-7 Priorities & Strategic Quests Expansion (REQ-224 – REQ-234)

*(The following 11 Small requirements are sized and queued for minor release **Version 0.16.2**, keeping `v0.16.1` cleanly scoped to Presidential Primaries, Ballot Access, Uncertainty, Vetting/Drift, and Election Night. All 11 requirements strictly observe `GAME_STYLE_GUIDE.md` invariants: 155M represented-voter scale, zero `REQ-XX` player-facing tags, universal "Politician" terminology, and qualitative atmospheric cues).*

#### REQ-224: Breakout State Legislator Spawner, 12-Member Roster Cap & Seasoning Lifecycle (`office: 'stateLeg'`)
- **Classification:** Small (Politician Lifecycle & State Legislature Simulation / `engine.js`)
- **Dependencies / Related:** `reallocateStateHouseSeatCounts()` (`engine.js`), `startNextCycle()`, `normalizeGame()`, Universal Politician Terminology (`GAME_STYLE_GUIDE.md` Rule 6.5).
- **Problem Statement:** State legislative elections simulate chamber control and seat counts cleanly without per-district or 5,462-legislator database bloat, but winning statehouse seats currently does not yield a visible, persistent talent pool for ascending minor parties. Spawning a small, curated roster of named "Breakout State Legislators" turns statehouse footholds into a tangible engine for third-party growth with zero performance bloat.
- **Mechanical Specification:**
  - **1. Lightweight Chamber-Total Invariant:** Preserve existing chamber/seat-count state legislature simulation (`reallocateStateHouseSeatCounts`)—do **not** add individual state-house districts or a 5,462-member database.
  - **2. Breakout Standout Spawn Rule (Emerging / Minor Parties Only):** After each Election Night / cycle turnover, for any party holding **`< 10` sitting federal/governor officeholders** that wins **`>= 1` state legislative seat** in a state:
    - Spawn **`1`** named Breakout State Legislator (`office: 'stateLeg'`) for that state (or **`2`** if the party flips a full chamber majority in that state).
    - Major parties with full federal benches do not spawn `stateLeg` clutter.
  - **3. Hard Roster Cap (`12` Max per Party):** Cap active `stateLeg` standouts at **`12` per party nationwide**. If a party exceeds 12, retain standouts from the states where the party holds the most state legislative seats.
  - **4. Title, Quality & Fame Scaling by State Caucus Strength:**
    - `1–4` seats in state $\to$ **State Representative (`ST`)** · Starting Quality `6`, Fame `25–35`.
    - `5–19` seats in state $\to$ **State Legislative Caucus Leader (`ST`)** · Starting Quality `7`, Fame `35–48`.
    - Chamber majority won $\to$ **State House Speaker / Senate President (`ST`)** · Starting Quality `7–8`, Fame `48–60`.
  - **5. Multi-Cycle Seasoning & Natural Attrition:**
    - Each cycle a standout retains their statehouse seat, they gain **`+5–8` Fame** and **`+1` Quality (capped at `8`)**.
    - If the party drops back to `0` statehouse seats in that state on a later Election Night, the standout transitions to **`Former State Rep`** for 1 cycle (still recruitable once) before auto-retiring if not elected to higher office.

#### REQ-225: Statehouse-to-Higher-Office Recruitment Pipeline & Seamless Career Promotion
- **Classification:** Small (Candidate Recruitment & Career Progression / `engine.js`, `app.js`)
- **Dependencies / Related:** `REQ-224` (`office: 'stateLeg'`), Politician Factions & Badges (`REQ-159`, `REQ-167`), `careerMilestones` & `termsServed.stateLeg` (`engine.js`).
- **Problem Statement:** Minor parties need winning state legislative seats in early cycles (e.g., 2028) to produce genuinely viable U.S. House, U.S. Senate, Governor, and Presidential candidates in later cycles (e.g., 2032) rather than relying solely on low-quality generic recruits.
- **Mechanical & UI Specification:**
  - **1. Featured Home-State Recruitment Placement (`app.js`, `engine.js`):** Whenever a Chair recruits candidates for **U.S. House**, **U.S. Senate**, **Governor**, or **President**, any sitting `stateLeg` standout (or 1-cycle `Former State Rep`) from that state is placed at the top of the recruitment/primary pool with an in-universe **`★ Sitting State Lawmaker`** badge (no `REQ-XX` text per `GAME_STYLE_GUIDE.md` Rule 4).
  - **2. Viability Edge & `$0` Recruitment Cost:** Encouraging a sitting `stateLeg` standout to run for higher office costs **`$0` extra treasury** and preserves their existing faction affiliation and personality traits. Higher baseline **Quality (`6–8`)** and **`+2` Experience** over generic minor-party amateurs (`Quality 3–5`) deliver a tangible **`+1.5%` to `+3.0%`** home-state electoral credibility lift.
  - **3. Seamless Career Promotion:** If the standout wins federal or gubernatorial office, cleanly promote `office` (`'stateLeg' → 'house' | 'senate' | 'governor'`), log `termsServed.stateLeg` in `careerMilestones`, and free up a slot in the party's 12-member `stateLeg` farm team for the next cycle.

#### REQ-226: Fallback Party Leadership Bench & Stepping-Stone `State Legislative Caucus Chair` Role
- **Classification:** Small (Leadership Hierarchy & Action Unlocking / `v07-scaffolding.js`, `engine.js`, `app.js`)
- **Dependencies / Related:** `REQ-224` (`office: 'stateLeg'`), `REQ-168` (Keynote Speaker & State Tour restricted to active Party Leaders), `REQ-127` (Chamber-Exclusive Scoping), `LEADERSHIP_ROLES_SCHEMA` (`v07-scaffolding.js`).
- **Problem Statement:** Third parties holding `0` Senators, `0` U.S. Representatives, and `0` Governors currently have an empty leadership bench, which also locks them out of **Keynote Speaker** and **State Tour** machine operations (`REQ-168`). Allowing Breakout State Legislators to serve as a fallback leadership bench—and introducing a stepping-stone caucus chair role—makes early statehouse wins immediately unlock core party-building actions.
- **Mechanical & UI Specification:**
  - **1. Automatic Fallback Eligibility (`< 3` Federal/Governor Officeholders):** Whenever a party has **`< 3` sitting federal/governor officeholders**, automatically populate its sitting `stateLeg` standouts into selection dropdowns for non-chamber party roles:
    - **Rhetorical Leader** (`rhetoricalLeader`)
    - **Policy Leader** (`policyLeader`)
    - Unlocked **Faction Leader** slots (filtered to the faction as normal)
    - Label entries clearly as `[State Leg · ST]` (clean plain text inside `<select>` per `REQ-167` dropdown rule) and sort them below any sitting federal/governor members once higher offices are won.
  - **2. Stepping-Stone Role — `State Legislative Caucus Chair` (`LEADERSHIP_ROLES_SCHEMA`):** Unlocks when a party holds **`>= 1` state legislative seat** while holding **`0` U.S. House and `0` U.S. Senate seats**. Passive effect: **`+1.5` State Legislature support** and counts as an active appointed Party Leader—immediately unlocking **Keynote Speaker** and **State Tour** actions under `REQ-168`. Gracefully retires / masks once the party wins Congressional seats and unlocks `House Leader` / `Senate Leader`.
  - **3. Strict Chamber Lock Preservation (`REQ-127`):** State lawmakers remain strictly ineligible for chamber-locked federal/executive roles (`House Speaker`, `Senate Leader`, `Governors Assoc. Chair`, Cabinet posts).

#### REQ-227: Third-Party Major Priorities Pack A — Vote-Threshold & Institutional Ascent (4 Quests)
- **Classification:** Small (Step 2 Strategic Quests Catalog / `data.js`, `engine.js`, `app.js`)
- **Dependencies / Related:** `OVERALL_PRIORITY_QUESTS` (`data.js:1584`), `PRIORITIES_REWORK_DESIGN.md`, `REQ-179` (FEC Matching), `REQ-180` (Debate Stage), `REQ-224` (Statehouse Farm Team).
- **Problem Statement:** Expand the Step 2 Major Priorities catalog (`OVERALL_PRIORITY_QUESTS`) with 4 minor-party institutional ascent quests complementing existing quests without duplicating *"Win first seat"* or *"Building our brand"*.
- **Mechanical Specification (Add 4 Quests to `OVERALL_PRIORITY_QUESTS` + Evaluators in `engine.js`):**
  1. **Cross the 5% Funding Threshold** *(Medium Difficulty)*
     - *Eligibility:* Minor party; prior national presidential vote $< 5\%$; Presidential year.
     - *Goal:* Finish with **$\ge 5.0\%$ national presidential vote** (hooks `REQ-179`).
     - *Acceptance Bonus:* Slightly reduces Tier 1–2 Media Blackout drag for the cycle.
     - *Completion Reward:* $+6$ Member Happiness; $+\$12\text{M}$ FEC Matching Grant; automatic ballot retention in top 15 states.
  2. **Shatter the 15% Debate Barrier** *(Hard Difficulty)*
     - *Eligibility:* Minor party; polling/prior vote $4.0\%–14.9\%$; Presidential year.
     - *Goal:* Hit **$\ge 15.0\%$ national polling** (Debate Stage `REQ-180`) OR finish **$\ge 15.0\%$ national vote**.
     - *Acceptance Bonus:* $+2$ Fame for Presidential Nominee & Rhetorical Leader.
     - *Completion Reward:* $+12$ Member Happiness; permanently clears Media Blackout drag; seeds an allied Super PAC ($+\$15\text{M}$).
  3. **Secure 50-State Ballot Access** *(Medium Difficulty)*
     - *Eligibility:* Minor party missing ballot retention in $\ge 15$ states.
     - *Goal:* Qualify for (or retain) the ballot in **all 50 states + D.C.** by Election Night.
     - *Acceptance Bonus:* $-25\%$ petition/chapter organizing cost this cycle.
     - *Completion Reward:* $+6$ Member Happiness; automatic 50-state ballot retention locked in for the next 2 cycles.
  4. **Build a Statehouse Farm Team** *(Medium Difficulty)*
     - *Eligibility:* Minor party holding $1–14$ total state legislative seats.
     - *Goal:* Hold **$\ge 15$ total state legislative seats** nationwide.
     - *Acceptance Bonus:* Spawns $+1$ immediate Quality-7 Breakout State Legislator (`REQ-224`).
     - *Completion Reward:* $+8$ Member Happiness; all sitting `stateLeg` standouts gain $+8$ Fame & $+1$ Quality (up to $8$).

#### REQ-228: Third-Party Major Priorities Pack B — Regional Bastion, Electoral Reform & Kingmaker Leverage (4 Quests)
- **Classification:** Small (Step 2 Strategic Quests Catalog / `data.js`, `engine.js`)
- **Dependencies / Related:** `OVERALL_PRIORITY_QUESTS` (`data.js`), `REQ-170` (Courting), `REQ-184` (`OVERLAPPING_REGIONS` Snowball), `REQ-185` (State Electoral Systems), `REQ-187`/`REQ-188` (Kingmaker Caucus).
- **Problem Statement:** Give ascending third parties mid-game Major Priorities focused on regional strongholds, anti-spoiler electoral reform, hung-chamber kingmaker leverage, and high-profile lawmaker defections.
- **Mechanical Specification (Add 4 Quests to `OVERALL_PRIORITY_QUESTS` + Evaluators in `engine.js`):**
  1. **Carve Out a Regional Bastion** *(Medium Difficulty)*
     - *Eligibility:* Minor party $< 10\%$ nationally; no state $\ge 20\%$ yet.
     - *Goal:* Win **$\ge 20.0\%$ of the vote** in any state (Pres/Sen/Gov) AND hold **$\ge 5$ state legislative seats** there.
     - *Acceptance Bonus:* $+10,000$ registered voters in your top polling state (155M represented scale).
     - *Completion Reward:* $+8$ Member Happiness; triggers `OVERLAPPING_REGIONS` snowball (`REQ-184`) & lifts regional Duverger floor.
  2. **Break the Duopoly (Electoral Reform)** *(Hard Difficulty)*
     - *Eligibility:* Minor party; $< 5$ states currently use RCV/Approval/PR (`REQ-185`).
     - *Goal:* Enact **RCV, Approval, or Proportional Representation** in at least **1 new state**.
     - *Acceptance Bonus:* $+3$ Independents Trust immediately.
     - *Completion Reward:* $+10$ Member Happiness; boosts future electoral-reform momentum nationwide.
  3. **Become the Kingmaker** *(Hard Difficulty)*
     - *Eligibility:* Minor party; $< 50$ House seats and $< 15$ Senate seats.
     - *Goal:* Hold the **balance of power** in a hung U.S. House, hung U.S. Senate, OR $\ge 2$ hung State Chambers (`REQ-187` / `REQ-188`).
     - *Acceptance Bonus:* $+2.0\%$ lift in your top 5 closest House / State Leg races.
     - *Completion Reward:* $+12$ Member Happiness; grants $+1$ extra concession during Confidence-and-Supply bargaining.
  4. **Poach a Sitting Lawmaker** *(Hard Difficulty)*
     - *Eligibility:* Minor party at $\ge \text{Tier 2}$ (Emerging / Ballot-Qualified; Tier 1 Fringe parties strictly cannot court sitting lawmakers) with $0$ Senators and $< 5$ House seats.
     - *Goal:* Successfully court a sitting **U.S. Rep, Senator, or Governor** to switch parties (`REQ-170`).
     - *Acceptance Bonus:* Loosens the Party Happiness courting gate by $+8$ points this cycle ($\le 48$ instead of $\le 40$).
     - *Completion Reward:* $+10$ Member Happiness; $+25,000$ registered voters in the defector's state; $+2.0\%$ Unified Party Approval; immediately updates the respective seat count tracker in the main KPI resource strip.

#### REQ-229: Third-Party Major Priorities Pack C — Historic Breakthrough & Major-Party Displacement (4 Quests)
- **Classification:** Small (Step 2 Strategic Quests Catalog / `data.js`, `engine.js`)
- **Dependencies / Related:** `OVERALL_PRIORITY_QUESTS` (`data.js`), `REQ-176` (Tier 5 Major Promotion), `REQ-190` (Multi-Party EVs), `REQ-191` (12th Amendment Contingent Election), `REQ-192`/`REQ-194` (Big-Tent Crossroads & Purist Backlash).
- **Problem Statement:** Provide climactic late-stage Major Priorities for surging third parties breaking into the Electoral College, forcing constitutional deadlocks, overtaking a major party, or navigating the Big-Tent Identity Crisis intact.
- **Mechanical Specification (Add 4 Quests to `OVERALL_PRIORITY_QUESTS` + Evaluators in `engine.js`):**
  1. **Win Your First Electoral Votes** *(Hard Difficulty)*
     - *Eligibility:* Minor party; $0$ historical EVs; Presidential year.
     - *Goal:* Win **$\ge 1$ Electoral College vote** (any state or ME/NE district).
     - *Acceptance Bonus:* $+2.0\%$ presidential lift in your single strongest state.
     - *Completion Reward:* $+15$ Member Happiness; $+100,000$ registered voters in winning state/region; removes regional "wasted vote" drag.
  2. **Force a 12th Amendment Deadlock** *(Insane Difficulty)*
     - *Eligibility:* Minor party with $\ge 10\%$ national polling; Presidential year.
     - *Goal:* Prevent both major parties from reaching $270$ EVs, forcing a **Contingent Election** (`REQ-191`).
     - *Acceptance Bonus:* $+1.5\%$ lift in top 3 battleground states.
     - *Completion Reward:* $+20$ Member Happiness; maximum Contingent Election brokering leverage (Cabinet + reform concessions).
  3. **Overtake a Major Party (Finish 2nd)** *(Insane Difficulty)*
     - *Eligibility:* Minor party ranked 3rd or lower nationally.
     - *Goal:* Beat either Democrats or Republicans in the **national popular vote** (Presidential or House Generic).
     - *Acceptance Bonus:* *None*.
     - *Completion Reward:* $+25$ Member Happiness; immediate Tier 5 Major Party promotion (`REQ-176`); shifts $15\%$ of the overtaken party's voter base.
  4. **Survive the Big-Tent Crossroads** *(Medium Difficulty)*
     - *Eligibility:* Minor party nearing `REQ-192` Big-Tent Inflection Point.
     - *Goal:* Hit **$\ge 10\%$ national vote** while keeping Founding Faction happiness **$\ge 60$** (zero purist bolt `REQ-194`).
     - *Acceptance Bonus:* $+5$ Founding Faction Happiness immediately.
     - *Completion Reward:* $+8$ Member Happiness; permanently lowers platform-broadening backlash ($-20\%$).

#### REQ-230: Deterministic Draft-of-7 Priorities Engine, Smart Hand Composition & `Push Our Issues` Gate
- **Classification:** Small (Step 2 Priority Draw Engine & Eligibility Rules / `data.js`, `engine.js`)
- **Dependencies / Related:** `OVERALL_PRIORITY_QUESTS` (`data.js:1584`), `REQ-227`–`REQ-229`, `startNextCycle()`, `normalizeGame()`.
- **Problem Statement:** Exposing the entire eligible quest catalog every cycle makes Step 2 repetitive and lets players pick the exact same optimal quests on autopilot. Dealing a randomized, smartly composed hand of **7 eligible priorities** each cycle—seeded deterministically to prevent save-scumming—turns Step 2 into an engaging strategic draft while guaranteeing relevant contextual options.
- **Mechanical Specification:**
  - **1. Cycle Hand Generation (`generateOfferedPrioritiesHand(game, redrawCount)` in `engine.js`):**
    - At game start and each cycle transition (`startNextCycle`), gather all quests in `OVERALL_PRIORITY_QUESTS` whose eligibility predicate evaluates true for the player's party and deal a **hand of 7 priorities**.
    - Persist the dealt hand in `game.priorities.offered` (alongside `game.priorities.redrawCount = 0` and `game.priorities.lastCycleOffered` for anti-repeat tracking), with clean fallback migration in `normalizeGame()` for legacy saves.
  - **2. Deterministic Anti-Save-Scum Seeding:** Seed the shuffle/selection deterministically from **`saveSeed + year + partyId + redrawCount`** so reloading Step 2 always restores the exact same hand of 7 and cannot reroll for free.
  - **3. Smart Hand Composition:**
    - **2–3 Contextual / Milestone Slots:** Guaranteed to draw from party-specific or cycle-specific priorities whenever eligible (White House bids, chamber control battles, 3rd-party breakthroughs `REQ-227`–`REQ-229`, Stronghold/Fortress bids `REQ-233`).
    - **4–5 Generic / Strategic Slots:** Drawn from the universal pool, deprioritizing/avoiding back-to-back repeats from `lastCycleOffered` whenever enough eligible priorities remain in the pool.
  - **4. Eligibility Tightening on Existing Quest (`Push our issues`):** Update `Push our issues` in `data.js` to require holding **$\ge 1$ state legislative chamber** so 0-seat minor parties are never dealt an uncompletable quest in their hand of 7.
  - **5. Pool-Size Verification Across `REQ-227`–`REQ-233`:**
    - 0-Seat 3rd Party Midterm floor = `14` eligible quests ($2\times$ draw of 7).
    - 0-Seat 3rd Party Presidential = `17` eligible quests.
    - Rising 3rd Party = `18–20` eligible quests.
    - Major Party = `14–18` eligible quests.

#### REQ-231: Step 2 Draft-of-7 Selection UI & Unlimited Escalating-Cost Redraws (`cost = redrawCount + 1`)
- **Classification:** Small (Step 2 Priorities UX & Redraw Action Handler / `engine.js`, `app.js`, `styles.css`)
- **Dependencies / Related:** `REQ-230` (`game.priorities.offered`), `REQ-176` (`getMaxFocusSlots`: `3 / 5 / 7` tier-scaled Party Focus slots).
- **Problem Statement:** Players need a clear Step 2 Draft-of-7 interface to pick 3 of their 7 offered priorities, plus an escalating-cost redraw valve when a dealt hand does not match their strategic plan for the cycle.
- **Mechanical & UI Specification:**
  - **1. Draft-of-7 Selection UX (`app.js`):**
    - Display the **7 offered Main Priorities** cleanly in Step 2; the Chair selects **3 of the 7** and locks them in permanently for the 2-year cycle (the unselected 4 return to the pool for future cycles).
    - **Preserve Existing Tier 2 Deck:** Keep the existing Party Focus / Additional Priorities slots (Issue / State / Region, preserving `REQ-176`'s `3 / 5 / 7` tier-scaled slot count) unchanged beneath the 3 Main Priorities.
  - **2. Unlimited Escalating-Cost Redraws (`redraw-priorities-hand` in `engine.js` & `app.js`):**
    - Before locking in their 3 Main Priorities, the Chair may click **`Redraw Hand`** as many times as they have Organizing Actions available.
    - **Escalating Action Cost Formula:** $\text{cost} = \text{redrawCount} + 1$ (1st redraw = **`1` Action**, 2nd redraw = **`2` Actions**, 3rd = **`3` Actions**, 4th = **`4` Actions**, etc.).
    - Executing a redraw deducts `cost` from `organizingActionsRemaining` / `actionsLeft`, increments `game.priorities.redrawCount`, clears any unconfirmed Main Priority picks from the prior hand, and deals a fresh deterministic hand of 7 (`saveSeed + year + partyId + redrawCount`).
    - Button dynamically displays the exact next cost (e.g., `Redraw Hand (1 Action)` $\to$ `Redraw Hand (2 Actions)`) and disables once priorities are locked in or when remaining Organizing Actions $< \text{nextCost}$.
    - Strictly obey `GAME_STYLE_GUIDE.md` Rule 4 (zero `REQ-XX` text in UI).

#### REQ-232: New Generic Major Priorities (`Turnout Engine` & `Build Up the Bench`)
- **Classification:** Small (Universal Strategic Quests Catalog / `data.js`, `engine.js`)
- **Dependencies / Related:** `REQ-230`, `OVERALL_PRIORITY_QUESTS` (`data.js`), Candidate Traits (`Rising Star`), Voter Model (155M represented scale).
- **Problem Statement:** Broaden the universal generic priority pool slightly (without diluting the Draft-of-7 hand) with two high-agency strategic quests rewarding coalition harmony and candidate bench development.
- **Mechanical Specification (Add 2 Universal Quests to `OVERALL_PRIORITY_QUESTS` + Evaluators in `engine.js`):**
  1. **Turnout Engine** *(Medium Difficulty · Eligible for All Parties)*
     - *Goal / Target:* Keep **every active party faction at $\ge 65$ Happiness** through Election Day and beat baseline base turnout.
     - *Acceptance Bonus:* $+2$ Happiness to all active party factions immediately.
     - *Completion Reward:* $+5$ Member Happiness; $+2.0\%$ national base turnout lift on Election Night.
  2. **Build Up the Bench** *(Medium Difficulty · Eligible for All Parties)*
     - *Goal / Target:* Field and elect **$\ge 3$ `Rising Star` (or $\text{Fame} \ge 70$ fresh) nominees** on Election Night.
     - *Acceptance Bonus:* $+4$ Fame to your top 3 newly recruited nominees.
     - *Completion Reward:* $+5$ Member Happiness; $+25,000$ new registered voters nationwide (155M represented scale).

#### REQ-233: Targetable Hostile-Territory Priorities (`Crack an Opponent Stronghold` & `Crack an Opponent's Fortress`)
- **Classification:** Small (Targetable Hostile-Lean Quests & Permanent Lean Shift / `data.js`, `engine.js`, `app.js`)
- **Dependencies / Related:** `REQ-230`, `OVERALL_PRIORITY_QUESTS` (`data.js`), state/district partisan lean baselines (`engine.js`).
- **Problem Statement:** Parties with an established federal or gubernatorial foothold need high-risk, high-reward offensive quests for invading hostile states or congressional districts and permanently bending the electoral map.
- **Mechanical & UI Specification (Add 2 Targetable Quests to `OVERALL_PRIORITY_QUESTS` + Target Picker in `app.js` / `engine.js`):**
  1. **Crack an Opponent Stronghold *(State/District)*** *(Hard Difficulty)*
     - *Eligibility:* Party controls **$\ge 1$ federal seat (House/Senate) OR $\ge 1$ Governor's mansion**, and contests at least one state or congressional district with **$\ge +5$ hostile lean**.
     - *Goal / Target:* Player selects the exact qualifying state or district upon choosing the quest (displayed dynamically in parentheses, e.g., *Crack an Opponent Stronghold (Ohio)*) and wins a federal (House/Senate) or gubernatorial race there on Election Night.
     - *Acceptance Bonus:* **$+3.0\%$ persuasion** in that selected state/district for the cycle.
     - *Completion Reward:* **$+10$ Member Happiness**; permanently shifts that state/district's baseline partisan lean **$+1.5$ points** toward the player's party.
  2. **Crack an Opponent's Fortress *(State/District)*** *(Insane Difficulty)*
     - *Eligibility:* Party controls **$\ge 1$ federal seat (House/Senate) OR $\ge 1$ Governor's mansion**, and contests at least one state or congressional district with **$\ge +10$ hostile lean**.
     - *Goal / Target:* Player selects the exact qualifying state or district upon choosing the quest (displayed dynamically in parentheses, e.g., *Crack an Opponent's Fortress (Wyoming)*) and wins a federal (House/Senate) or gubernatorial race there on Election Night.
     - *Acceptance Bonus:* **$+3.0\%$ persuasion** in that selected state/district for the cycle.
     - *Completion Reward:* **$+20$ Member Happiness**; permanently shifts that state/district's baseline partisan lean **$+2.5$ points** toward the player's party.
  - **Target Picker UX (`app.js`):** When selecting either quest from the Draft-of-7 hand, render a clean inline `<select>` populated strictly with qualifying hostile-lean states/districts (plain-text labels per `REQ-167`), saving `targetScope` / `targetId` onto the locked quest object so its title renders with `(Target Name)` throughout the cycle.

#### REQ-234: Historical Party Systems Canon (1st–6th Eras), 7th Era Modern Populist Retitle & Timeline Info Modal
- **Classification:** Small (Historical Systems Data, Era Retitling & Educational UI Modal / `party-systems-data.js`, `party-systems-engine.js`, `party-systems-ui.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `MAS-01` (`PARTY_SYSTEMS_DESIGN.md`), `party-systems-data.js` (`BASELINE_ERA`, `ERA_CATALOG`), `party-systems-ui.js` (`renderHistoricalEraTimeline`), `styles.css`.
- **Problem Statement:** The Historical Party Systems Timeline ("Constitutional Chronicle") currently only renders the active 7th Party System and post-transition eras in `priorErasHistory`, omitting the first six foundational eras of American political history. Furthermore, the 7th Party System's baseline starting year (`2028`) and title (*Polarized Duopoly*) do not reflect the user's specific historical framing of 21st-century populism, and players lack an in-game explanation for why the game's era boundaries diverge from textbook academic consensus.
- **Mechanical & UI Specification:**
  - **1. Canonical 1st through 6th Former Party Systems Data (`party-systems-data.js`, `party-systems-engine.js`):**
    - Populate `game.partySystems.priorErasHistory` (or a dedicated immutable catalog `HISTORICAL_CANON_ERAS` merged in `renderHistoricalEraTimeline`) with the six foundational eras:
      1. **1st Party System (1792–1828):** *The Federalist Era* · Catalyst: Founding constitutional debates, rise of partisan press, Hamiltonian finance vs. Jeffersonian-Madisonian Democratic-Republican counter-mobilization.
      2. **2nd Party System (1828–1860):** *The Antebellum Era* · Catalyst: Jacksonian mass democracy, universal white male suffrage, spoils system, national nominating conventions, and Whig opposition.
      3. **3rd Party System (1860–1896):** *The Industrial Era* · Catalyst: Civil War realignment, Union Republican hegemony vs. Bourbon Democrats, Gilded Age growth, tariff battles, and rapid industrial urbanization.
      4. **4th Party System (1896–1932):** *The Progressive Era* · Catalyst: 1896 McKinley realignment, trust-busting, direct primary democratization, 1912 Bull Moose split, and regulatory state formation.
      5. **5th Party System (1932–1966):** *The Liberal Era* · Catalyst: FDR New Deal coalition, organized labor expansion, social security, and mid-century federal public investment.
      6. **6th Party System (1966–2006):** *The Conservative Era* · Catalyst: Southern realignment, Reagan coalition, supply-side deregulation, Contract with America, and post-Cold War market dominance.
  - **2. 7th Party System Retitling & Baseline Adjustments (`party-systems-data.js`, `party-systems-engine.js`):**
    - **Active Years:** `2006 – Current` (displays as *2006 – Present* during the 7th era; updates dynamically to `2006 – <Year>` once the 8th Party System triggers).
    - **Title:** Retitle from *Polarized Duopoly* to **The Modern Populist Era** (`fullTitle: 'The 7th Party System: The Modern Populist Era'`).
    - **Catalyst:** Update catalyst description to: *"Rise of 21st-century populist movements, sparked by the 2006 Democratic wave and 50-state strategy, followed by Obama's coalition and Trump's working-class realignment."*
    - **Initial State:** `currentEraStartYear: 2006` in `party-systems-engine.js` initialization and `normalizeGame()`.
  - **3. Top-Right `(i)` Information Icon & Hover Tooltip (`party-systems-ui.js`, `styles.css`):**
    - Render a circular information button (`<button class="era-info-btn" aria-label="click for more information on the party systems years" title="click for more information on the party systems years">ⓘ</button>`) in the top-right corner of the timeline header (`.era-timeline-head`).
    - Hovering or focusing over the icon displays the exact native/CSS tooltip:
      > `"click for more information on the party systems years"`
  - **4. Party Systems Era Dating Philosophy Popup Modal (`party-systems-ui.js`):**
    - Clicking the `(i)` button triggers a modal dialog explaining the creator's historical design rationale:
      - **Intentional Divergence:** Clarifies that the game's era boundaries intentionally differ from traditional academic consensus based on a distinct historical perspective.
      - **Two Signature Moments Theory:** Explains that party systems typically have two signature moments:
        1. *Moment 1 (Emergence):* 10–15 years before the "typical" start date, where an insurgent movement emerges.
        2. *Moment 2 (Maturity & Coalescence):* Where the movement grows up, coalesces, and assumes governing dominance.
      - **7th Era Rationale:** *"For the purposes of this game, the 7th party system began in '06, when the Democrats won in a wave year, followed by Obama's presidency. Trump's populism is also important in this era - it's defined by populism, that really started with the Democrats' 50-state strategy in '06."*
      - **5th & 6th Era Rationale:** *"As for the 6th and 5th, the 5th era ended in '66, because several key characteristics of that party system didn't exist in the last 14 years."*
      - **Complete Chronological Reference:** Lists all 7 canonical eras (1st: 1792–1828 The Federalist Era through 7th: 2006–Current The Modern Populist Era).
  - **5. Style Guide Compliance:** Strictly follows `GAME_STYLE_GUIDE.md` Rule 4 (zero `REQ-XX` strings in UI copy), Rule 7 (qualitative atmospheric descriptions), and Section 3 visual styling (AI Games Studio palette).

### Cluster F: Custom Party Mode & Faction Anchor Rework *(Unscheduled Backlog — `REQ-235` – `REQ-244`)*

*(Complete version-agnostic technical schemas, exact `155M` zero-variance voter conservation math, universal politician transfer rules, UI wireframes, and acceptance checks live in [**CUSTOM_PARTY_REWORK_DESIGN.md**](CUSTOM_PARTY_REWORK_DESIGN.md). Build scheduling and release packaging will be organized later when the target version design document is created.)*

#### REQ-235: Dedicated `Create Custom Party` Setup Flow & Clean Neutral Initialization
- **Classification:** Small (Setup UX & Neutral Game Initialization / `app.js`, `engine.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `app.js#L1383-L1425`, `engine.js#L2774-L2960`, Ascent Tier Engine (`REQ-176`).
- **Specification:** Replace the `#custom-mode` checkbox toggle with a standalone **`Create Custom Party`** button (`selectedTemplate = 'custom'`) that deselects all 6 preset party cards and opens the Custom Party Creator drawer cleanly. Eliminate all preset-party template bleed in `createGame()` using a neutral custom template (`baseTemplateId: 'custom'`), computing `player.baseShare` strictly from actual starting voters (`startingVoters / 155_000_000 * 100`) and calibrating the starting Ascent Tier (`1–5`) and focus slots (`3 / 5 / 7`) dynamically.

#### REQ-236: Ironclad Democratic & Republican Leading-Faction Anchor Lock
- **Classification:** Small (Faction Invariants & Internal Crisis Routing / `engine.js`, `factions-0.15.js`, `app.js`, `party-systems-engine.js`)
- **Requested By:** User
- **Dependencies / Related:** `boltFaction()` (`engine.js#L849`), `REQ-151`, `REQ-159`, `party-systems-engine.js`.
- **Specification:** Hard-lock **`dem_liberal_establishment`** (*The Liberal Establishment*, `people`) and **`gop_maga`** (*Nationalist Populists (MAGA)*, `heritage`) so neither faction can ever leave its party under any circumstance: locked/disabled in Custom Party setup, defensively stripped in `createGame()`, blocked in Faction Summits/poaching and party-system splits, and guarded in `boltFaction()` so extreme dissatisfaction triggers an **Internal Anchor Crisis** (`-4.0%` turnout drag, `-15%` fundraising yield, primary revolt) instead of bolting.

#### REQ-237: Custom Party Starting Factions Picker, Pairwise `<= 2.0` Compatibility & `155M` Voter Transfer
- **Classification:** Medium (Setup Faction Matrix, Compatibility Math & Electorate Transfer / `app.js`, `engine.js`, `factions-0.15.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-235`, `REQ-236`, `REQ-171` (Strict Faction-to-Party Inheritance).
- **Specification:** Available for all Origin Stories except `Not a Major Movement`. Lets the player pick `0` to `N` of the 36 non-anchored catalog factions while enforcing strict pairwise compatibility (`|ΔEcon| <= 2.0` AND `|ΔSocial| <= 2.0` with `1e-9` float epsilon) dynamically in the UI (greying out incompatible factions with delta tooltips) and defensively in `createGame()`. Displays a live advisory playstyle banner (`< 1.0M` = *Realism Recommended*, `2.0M–5.0M` with `3–5` factions = *Healthy Balance Recommended*, `> 5.0M` = *Roleplay / Sandbox Experience*). Transfers exact state-by-state voter counts (`state.factions[fid]` $\to$ `state.affiliations.player`) conserving `155,000,000` represented voters (`0` variance), and **transfers every politician** belonging to selected factions (`sittingMembers`, `politicians`, `generatedMembers`, `offers`) to `'player'` immediately post-hydration—updating `game.governorships`, `game.representatives`, `game.seats`, Senate rosters, and leadership eligibility so Senators, House members, Governors, and bench prospects all follow their factions into the Custom Party.

#### REQ-238: Minor-Party Merger Dissolution, Orphaned Breakaway Factions (`seekingPartyHome`) & `"Sellout Grudge"` (B-6)
- **Classification:** Medium (Multi-Party Lifecycle, Rehoming AI & Grudge Events / `engine.js`, `app.js`, `data.js`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-237`, `partyList()`, `buildForecasters()`, `startNextCycle()`.
- **Specification:** Selecting any faction of `liberty`, `green`, `constitution`, or `socialist` permanently dissolves that minor party in the save (`game.dissolvedParties`), scrubbing it from `rivals`, `partyList`, `organizations`, forecasters, and ballots. Unselected sibling hardliners (e.g., `lib_ancaps`, `grn_eco_socialist_vanguard`, `soc_communists`) become Independent (`partyId = 'none'`, state voters shifted cleanly to `state.affiliations.independent` with `0` variance) with `seekingPartyHome: true`, actively seeking ideologically compatible surviving rival parties across cycles. While `seekingPartyHome === true`, they carry a temporary **`"Sellout Grudge"`** against the Custom Party—firing media snipes criticizing the merger and preferentially bolstering rival coalitions.

#### REQ-239: Party Origin Stories — 4 Archetype Modifiers (A-1)
- **Classification:** Small (Founding Archetypes & Asymmetric Modifiers / `data.js`, `engine.js`, `app.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-235`, `REQ-170`, `REQ-185`, `REQ-189`, `getMediaVisibilityProfile()`.
- **Specification:** Add 4 mechanical Origin Story archetypes to `CUSTOM_PARTY_ORIGINS` alongside `Not a Major Movement` (`REQ-240`): **Major-Party Schism** (parent Dem/GOP picker; stronger poaching & defector bench vs. parent, but blood rivalry / zero Fusion Voting / hostile challenges), **Civic Reform / Anti-Duopoly Movement** (`+12` Independents Trust & stronger RCV/Approval/PR leverage, softer machine loyalty), **Grassroots Viral Movement** (`$15M` starting budget, `1.5x` small-dollar scaling, `2x` Volunteer Drives, `+12` recruit Fame upside), and **Executive / Self-Funded Third Way** (`$50M` war chest & halved Media Blackout drag, offset by grassroots cynicism & weaker small-dollar/populist appeal).

#### REQ-240: `Not a Major Movement` Exclusivity Lock & Custom `100K` Founding Faction Builder
- **Classification:** Medium (Hard-Mode Custom Faction Creator & `155M` Zero-Variance Allocator / `app.js`, `engine.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-235`, `REQ-237`, `REQ-239`, `VERSION_021_ISSUES`, `OVERLAPPING_REGIONS`.
- **Specification:** Implements the 5th Origin Story **`Not a Major Movement`** granting zero bonus modifiers and strictly locking out all 36 catalog factions. Opens the **Custom `100K` Founding Faction Builder**, allowing the player to name 1 brand-new founding faction of exactly **`100,000` voters** with: (1) 51-jurisdiction state-by-state voter allocation summing strictly to `100,000` (fast helpers + manual inputs in `100`-voter steps), (2) Economic (`1–10`) and Social (`1–10`) alignment sliders, and (3) 2 Core / Key Issues from the platform. Draws voters cleanly from state Independents (and proportionally from state `swg_*` swing factions) preserving exact `155,000,000` voter and faction conservation (`0` variance).

#### REQ-241: Founding Charter Traits (A-2) & Party Branding Suite (A-3)
- **Classification:** Small (Party DNA Modifiers & Broadcast Identity / `data.js`, `engine.js`, `app.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-235`, `REQ-223` (Election Night Broadcast Screen), `REQ-224` (Statehouse Farm Team).
- **Specification:** Lets custom parties select **1–2 Founding Charter Traits** from 4 options (*No Super PAC / Small-Dollar Pledge*, *Big-Tent Pragmatism* [mutually exclusive with Vanguard], *Doctrinal Vanguard*, *State-First Federation*) plus full broadcast branding: **10 inline SVG vector emblems** (*Torch, Oak, Compass, Scales, Phoenix, Gear, Pine, Bison, Starburst, Shield*), a **3-letter uppercase Broadcast Ticker Code** (`customCode`, rendered across maps, forecasters, Election Night Broadcast Screen & "Just Called" feed), and a **1-line Founding Motto**.

#### REQ-242: The `"Founder's Shadow"` Movement Aura & `"Survive the Founder"` First Succession Crisis (C-7)
- **Classification:** Medium (Founder Lifecycle Aura & Succession Dilemma Event / `engine.js`, `app.js`, `data.js`, `styles.css`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-235`, `REQ-239`, `REQ-92` (Politician Aging & Retirement).
- **Specification:** Anchors custom parties around their Founding Leader with an early **Movement Aura** (`+20%` fundraising & `+1` recruitment lift across the opening 3 cycles). When the Founder retires, loses a major bid, steps down, or the aura expires, fires the unique **`"Survive the Founder"` First Succession Crisis** modal presenting 3 strategic paths (*Institutionalize the Party Machine*, *Anoint a Handpicked Heir*, or *Open Factional Power Struggle*) and arming `founderLegacy.postSuccessionCyclePending` for Priority #4.

#### REQ-243: Custom-Party-Exclusive Priorities Pack A — Founding Momentum & Merger Arcs (`#1–#5`)
- **Classification:** Small (Draft-of-7 Contextual Strategic Quests / `data.js`, `engine.js`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-230` (Draft-of-7 Engine), `REQ-235`, `REQ-237`, `REQ-242`.
- **Specification:** Adds 5 `customOnly: true` contextual priorities to `OVERALL_PRIORITY_QUESTS` + completion evaluators: **(1) Beat the Sophomore Slump**, **(2) Seal the Merger**, **(3) Outpoll Your Former Home**, **(4) Survive the Founder**, and **(5) Prove You're Not a Spoiler**.

#### REQ-244: Custom-Party-Exclusive Priorities Pack B — Fortress, Grudge, Cross-Aisle & Homegrown Bench (`#6–#9`)
- **Classification:** Small (Draft-of-7 Contextual Strategic Quests / `data.js`, `engine.js`)
- **Requested By:** User
- **Dependencies / Related:** `REQ-230` (Draft-of-7 Engine), `REQ-238`, `REQ-224`, `REQ-243`.
- **Specification:** Adds 4 `customOnly: true` contextual priorities to `OVERALL_PRIORITY_QUESTS` + completion evaluators: **(6) Build a Home-State Fortress**, **(7) Silence the "Sellout" Critics**, **(8) Forge an Unlikely Alliance**, and **(9) Homegrown Bench**. Explicitly excludes `#10`, `#11`, and any auto-generated `B-4` custom faction outside `Not a Major Movement`.

## 3. Long-Term Additions *(Retired — Nov 17, 2026)*

*Retired per project owner direction: `LTA-01` and `LTA-02` were removed, and `LTA-03` (State & State-Party Policy Preferences with 3-Point Bounding & Regional Elasticity) was migrated to [**TBD_UPDATES.md**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/TBD_UPDATES.md) as **`TBD-29`**. All future unscheduled concepts are now tracked exclusively in `TBD_UPDATES.md`.*

## 4. TBD Designs & Conceptual Queue (Tracked in Dedicated Document)

> ⚠️ **MANDATORY DESIGN PROTOCOL FOR TBD UPDATES:**
> All TBD changes, exploratory concepts, and conceptual queue items have been moved to their own dedicated repository document: [**TBD_UPDATES.md**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/TBD_UPDATES.md).
>
> **Operational Rule:** Whenever the project owner requests adding a **"TBD"** change to the design document or the backlog, **add it directly to `TBD_UPDATES.md` instead**.

Please see [**TBD_UPDATES.md**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/TBD_UPDATES.md) for the remaining active TBD inventory (`TBD-02`, `TBD-03`, `TBD-09`–`TBD-11`, `TBD-13`–`TBD-21`, `TBD-24`, `TBD-26`–`TBD-29`; `TBD-01` completed; `TBD-04`–`TBD-08`, `TBD-12`, `TBD-22`, `TBD-23`, `TBD-25`, `TBD-30`, `TBD-31` promoted to **`v0.16.1`**).

## 5. Historical Reference & Deferred Areas (Archive)

*Maintained as background reference context. Not part of the active backlog until requested.*

| Ref ID | Candidate Topic | Context / Prior Notes | Suggested Size | Status |
| :--- | :--- | :--- | :---: | :---
## 6. Problem & Bug Tracker

*Note: `BUG-01` (Senate Class 1, 2, and 3 maps not appearing / 2026 incumbent audit) shipped in `v0.7` (`VERSION_0.7_DESIGN.md` / `REQ-13`).*

| Bug ID | Date Reported | Description | Classification | Cause / Investigation Status |
| :--- | :--- | :--- | :--- | :---
| BUG-02 | Nov 14, 2026 | Faction Leaders cannot be selected in the Party Leadership Hierarchy interface. | Tiny (Bug Fix) | App.js references global schema instead of party-scoped schema and does not filter candidate dropdown by role factionId; fixed by REQ-108. |
| BUG-03 | Nov 14, 2026 | Step 5 of The Recruitment Phase is inaccessible and unclickable. | Bug Fix (v0.14.1) | engine.js, normalizeGame, and v07-scaffolding clamp turnStep to 1-4; app.js renders advance button on step 4 omitting step-next; styles.css hardcodes 4-col grid; designed in VERSION_0.14.1_DESIGN.md. |
| BUG-04 | Nov 14, 2026 | Custom and third parties see and control Democratic candidates/politicians. | Bug Fix (v0.14.2) | app.js playerIdentity() falls back to 'people' for custom parties, leaking Democrats into primaries, tours, and leadership; fixed in VERSION_0.14.2_DESIGN.md. |
| BUG-05 | Nov 14, 2026 | Democratic candidates leak into campaign phase triage & PAC requests when playing as other parties. | Bug Fix (v0.14.3) | engine.js initializeCandidateFunding and generateWeeklyRequests hardcoded identityId to fallback to 'people'; fixed in VERSION_0.14.3_DESIGN.md. |
| BUG-06 | Nov 14, 2026 | Minor party starting popularities jumped to 25% instead of remaining at initial benchmarks. | Small (Bug Fix) | In computeUnifiedPartyApproval (engine.js), clamping minor party approval at 25% clamped unscaled ~45.6% raw score down to exactly 25.0%, boosting all minor parties from baseline benchmarks (~0.2%–1.8%) to 25.0%; resolved by REQ-139; packaged in VERSION_0.14.5_DESIGN.md. |
| BUG-07 | Nov 15, 2026 | Inter-cycle voter realignment does not shift voters between parties when playing as minor parties (e.g. Greens). | Small (Bug Fix) | In realignVotingBlocksBetweenElections(), minor party vote shares were untracked/static and voter deltas were absorbed by generic independents rather than transferring directly between specific ideological rival parties (e.g. Greens drawing from Democrats); resolved by REQ-143; packaged in VERSION_0.14.6_DESIGN.md. |

## 7. Design Ideas, Notes & Research Archive

### 📌 Pinned Reminder (`NOTE-01` — Nov 11, 2026): Lightweight Role of Policy

### 📌 Pinned Reminder (`NOTE-02` — Nov 12, 2026): Leadership Reassignment Allowed Windows
- **Owner Direction:** *"The president and VP shouldn't be changable, instead being locked in. Changing any other official positions should cause a massive penalty to that side of the base, unless it's at certain times - we'll designate that later. Remind me to do so"*
- **Reminder for Discussion:** Designate the exact allowable windows (e.g. post-convention organization turns, opening of a new legislative session, or post-election leadership reorganizations) where leadership positions can be freely reassigned without triggering the massive base backlash penalty (-10 Supporter Trust, -12 Member Happiness).

### 📌 Pinned Reminder (`NOTE-03` — Nov 12, 2026): Concrete Mechanics for National Environment Formula
- **Owner Direction:** *"The remaining 40% should be random for now. Remind me to make it less random later"*
- **Reminder for Discussion:** Replace the current 40% random wind component in the National Environment formula with concrete simulation systems (such as quarterly economic growth indicators, consumer sentiment, foreign policy crises, and major media news cycles).

- **Owner Direction:** *"Policy isn't going to be a major part of this game, but it should be represented somehow. I want you to take note to bring that up later."*
- **Context to Revisit Later:** When we next discuss policy mechanics, explore how to keep policy streamlined and party-chair-focused (e.g., how the 40 issue positions, the private `Policy Leader`, state-targeted bills, ballot measures in `REQ-34`, and Super PAC pet issues in `REQ-18` represent policy identity without turning the game into a heavy legislative simulator).
### 🏛️ Long-Term Design Idea (`DEF-07` / `MAS-01` — Nov 12, 2026): The Party Systems Evolution Engine
*(Completed and shipped in **Version 0.16.0** per [**PARTY_SYSTEMS_DESIGN.md**](PARTY_SYSTEMS_DESIGN.md) and [**PRIOR_UPDATES.md**](PRIOR_UPDATES.md).)*

### 📌 Pinned Reminder (`NOTE-04` — Nov 12, 2026): Massive Updates Protocol
- **Owner Direction:** *"The Party System mechanic will be a massive one - this should be a level above huge, called massive, that are their own update, and that I send you instructions on over a period of days, not in one message. Remind me to continue massive updates AFTER we send any update that didn't include a massive update"*
- **Status:** **`MAS-01: The Party Systems Evolution Engine`** has successfully completed and shipped in **Version 0.16.0**. After future releases that do not include a Massive update, proactively remind the owner when a new Massive update is in development.

### 📌 Pinned Reminder (`NOTE-05` — Nov 21, 2026): Two-Trigger 40-Year Party Systems
- **Owner Direction:** *"Party systems last about 40 years in real life, we're just halfway through one now (according to my definition, at least). We're going to fix this eventually by adding a two trigger party system, with the first half of each era integrating elements from the prior era, before a massive shift halfway through."*
- **Design Plan to Revisit:** Structure each ~40-year Party System era around two sequential triggers:
  1. **Phase 1 Trigger (Years 1–20 / First Half):** Transitional synthesis that integrates institutions, coalitions, and residual issue axes from the prior era alongside early emerging fault lines.
  2. **Phase 2 Trigger (Midpoint ~Year 20 / Second Half):** A massive mid-era realignment shift that breaks the transitional synthesis, reshuffles coalitions/factions decisively, and sets up the eventual transition to the next Party System.
