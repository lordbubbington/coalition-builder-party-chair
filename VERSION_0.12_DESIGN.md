# Version 0.12 Design Specification: Multi-Cycle Federalism & Coalition Autopsies Update

**Build Target:** Version 0.12  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Multi-Cycle Continuous Realignment, State Legislative Bell-Curve Engine, Post-Election Autopsies, Atmospheric Dispatches & Autonomous Custom Parties*  
**Date:** November 12, 2026  
**Status:** Approved for Implementation Workflow (Two-Interaction Subagent Architecture)

---

## 1. Executive Summary & Build Balance

Version 0.12 is an ambitious, transformative expansion that transitions *Coalition Builder: Party Chair* from an initial-cycle organizing sandbox into a true multi-decade political simulator. It introduces constitutional **Senate Class Rotations**, alternating **Presidential and Midterm Cycles**, authentic **4-Year Gubernatorial Calendars**, and an organic, probabilistic **Macro National Environment Engine** that reliably replicates real-world re-election and successor benchmarks without scripted rails (`REQ-70`).

Simultaneously, Version 0.12 overhauls state legislative elections with a mathematically rigorous **Bell-Curve Seat Assignment Engine (`REQ-72`)**, completes the **Autonomous Custom Party Creation & Real-World Seat Claiming Engine (`REQ-63`)**, introduces post-election **Coalition Autopsies (`AUTO-01` to `AUTO-05`)**, replaces raw formula leaks with evocative **Atmospheric Field Dispatches (`VIBE-01` to `VIBE-03`)**, models **State Party Federalism and Friction (`FED-01` to `FED-04`)**, and establishes a **13-Tier Consensus Forecaster Engine (`REQ-87`)**.

### Build Inventory Matrix (Version 0.12 Scope)

| Tier | Count | Included Features & Requirements | Status |
| :--- | :---: | :--- | :---: |
| **Large** | **4** | • `REQ-70`: Multi-Cycle Election Advancement Engine<br>• `REQ-72`: State Legislature Seat Assignment Engine<br>• `REQ-81` (FED-01): State Party Platform Divergence & Friction Engine<br>• `REQ-87`: Pundit Forecaster Multi-Chamber Maps & 13-Tier Consensus Engine | ✅ Packed |
| **Medium** | **8** | • `REQ-63`: Autonomous Custom Party Creation & Real-World Seat Claiming<br>• `REQ-64`: Minor Party Race Tracking & Ballot-Access Battles<br>• `REQ-65`: Party Leader Candidacy Deployment (Running for Specific Office)<br>• `REQ-66`: State-by-State Disaggregated Voter Registration Tracking<br>• `REQ-73` (AUTO-01): Post-Election Coalition Movement Dossier<br>• `REQ-75` (AUTO-03): Faction Post-Mortem & Blame Game Engine<br>• `REQ-78` (VIBE-01): Field Director Qualitative Dispatch Engine<br>• `REQ-82` (FED-02): State Machine Crisis & Intervention Dilemmas | ✅ Packed |
| **Small** | **10** | • `REQ-67`: Persistent Warchest & Treasury Rollover Engine<br>• `REQ-68`: Commissioned Race Polling ($1M House / $2M Senate & Gov)<br>• `REQ-69`: Permanent Major Priorities Lock-In for the Cycle<br>• `REQ-71`: Minor & 3rd Party 50-State Starting Chapter Presence (1 Branch/State)<br>• `REQ-74` (AUTO-02): Regional Drift & Map Realignment Tracker<br>• `REQ-76` (AUTO-04): Strategic Chair Decision: Endorse vs. Shelve Report<br>• `REQ-79` (VIBE-02): Morning Newsletter Feed ("The Beltway Rundown")<br>• `REQ-83` (FED-03): Federal Receivership & Bailout Administration<br>• `REQ-85`: Fame-Scaled Public Popularity Engine<br>• `REQ-86`: State-Targeted Small Donor Drive Overhaul | ✅ Packed |
| **Tiny** | **3** | • `REQ-77` (AUTO-05): Autopsy Transition Modal & Layout Polish<br>• `REQ-80` (VIBE-03): UI Formula Masking & Decimal Sanitization Audit<br>• `REQ-84` (FED-04): 50-State Machine Health Visual Status Pips | ✅ Packed |

---

## 2. Core Feature Specifications

### A. Major Systems (Large Tier)

#### REQ-70: Multi-Cycle Election Advancement Engine
- **Constitutional Senate Class Rotation:**
  - Automatically advances active Senate classes on cycle boundary:
    $$\text{Class III} \longrightarrow \text{Class I} \longrightarrow \text{Class II} \longrightarrow \text{Class III}$$
  - 2028: Class I (33 seats) | 2030: Class II (33 seats) | 2032: Class III (34 seats) | 2034: Class I (33 seats), etc.
- **Midterm / Presidential Alternation:** Toggles top-of-ticket mechanics strictly between Midterm years and Presidential years.
- **Gubernatorial Staggered Rosters:**
  - 36 Midterm states (TX, FL, NY, CA, PA, MI, OH, GA, NV, AZ...) and 11 Presidential states (NC, IN, WA, MO, UT, WV, MT, DE, ND...).
  - 2-year states (NH, VT) appear on every ballot. Only expiring seats are contested.
- **Probabilistic Environment Engine (Outcome Benchmarks + Dynamic Variance):**
  - Uses Gaussian probability distributions $\mathcal{N}(\mu, \sigma)$ with deterministic cycle seed hashing:
    - **Midterm Fatigue:** Incumbent president's party faces headwinds $\sim 75\%–85\%$ of the time ($-3.0$ to $-7.0$ points), with $\sim 15\%–25\%$ chance of holding neutral or gaining ground.
    - **First-Term Re-Election Benchmark ($\sim 90\%$ Win Rate):** First-term incumbents receive natural structural incumbency bonuses ($+2.5$ to $+5.0$ environment rebound), winning $\sim 90\%$ of the time under standard play unless major crises intervene.
    - **Successor Nominee Benchmark ($\sim 90\%$ Loss Rate):** Two-term fatigue shifts the environment toward the out-party such that the successor loses $\sim 90\%$ of the time without extraordinary overperformance.

#### REQ-72: State Legislature Seat Assignment Engine
- **Standardized 100-Seat Model ($\text{Seats}_{100}(V)$):**
  - **Threshold:** $< 15\%$ vote share = **0 seats**.
  - **Monopoly:** $\ge 85\%$ vote share = **100 seats** ($100\%$).
  - **Piecewise S-Curve Formula:**
    - Zone 1 ($15\% \le V < 40\%$): $\text{Seats}_{100}(V) = (V - 15) \times 0.40$ (gains $10\%$ seats across 25 pts).
    - Zone 2 ($40\% \le V < 60\%$): $\text{Seats}_{100}(V) = 10 + (V - 40) \times 4.0$ (steep swing zone; gains $80\%$ seats across 20 pts).
    - Zone 3 ($60\% \le V \le 85\%$): $\text{Seats}_{100}(V) = 90 + (V - 60) \times 0.40$ (gains final $10\%$ seats).
- **Chamber Scaling:** For state with $N_{\text{seats}}$ total seats, $\text{Legislature Ratio} = N_{\text{seats}} / 100$. Scaled seats $= \text{Seats}_{100}(V) \times \text{Ratio}$.
- **Multi-Party Protocol (3+ Parties at $\ge 15\%$):**
  - Calculate floor seats $\lfloor \text{Seats}_{100}(V_p) \times \text{Ratio} \rfloor$.
  - Deficit seats are allocated **$+1$ seat at a time** to the qualifying party whose new seat proportion most closely preserves its noted baseline **seat percentage** ($\text{SeatPct}_p$), NOT raw vote percentage.

#### REQ-81 (FED-01): State Party Platform Divergence & Friction Engine
- State parties maintain local tolerance baselines derived from state voter models.
- If national platform stances drift $> 3.0$ points away from state median tolerance, the state party enters **Friction**:
  - **Mild Friction (3.0 – 4.5 pts):** Local candidates distance themselves from the national ticket; chapter fundraising efficiency drops by $15\%$.
  - **Severe Rebellion (> 4.5 pts):** State Party Chair publicly repudiates the plank; local volunteer turnout bonus drops by $20\%$.

#### REQ-87: Pundit Forecaster Multi-Chamber Maps & 13-Tier Consensus Rating Engine
- Pundits independently project **U.S. Senate**, **U.S. House**, and the **Presidency** (in presidential cycles), each with their own dedicated map view.
- Individual pundits use the standard 7-tier scale (`Solid`, `Likely`, `Lean`, `Toss-up`).
- Aggregating into the **Consensus Forecast** generates fine-grained in-between ratings across a **13-Tier Gradient Scheme**:
  - `Solid` $\longleftrightarrow$ `Very Likely` $\longleftrightarrow$ `Likely` $\longleftrightarrow$ `Favored` $\longleftrightarrow$ `Lean` $\longleftrightarrow$ `Tilt` $\longleftrightarrow$ `Toss-Up`.

---

### B. Medium Systems (Medium Tier)

- **`REQ-63`: Autonomous Custom Party Creation & Real-World Incumbent Seat Claiming:** Brand-new entity creation (non-replacing) with customizable color picker, nameable starting leader, standalone voter sidebar count, and 3-step hierarchical role picker (`Governor`, `Senate`, `House`) previewing real-life incumbents.
- **`REQ-64`: Minor Party Race Tracking & Ballot-Access Battles:** Dedicated filter for minor party contests, highlighting statutory ballot-access retention thresholds (2%/5%), spoiler margins, and double-digit ($\ge 10\%$) viability alerts.
- **`REQ-65`: Party Leader Candidacy Deployment (Running for Specific Office):** Direct deployment of National Committee leaders into Senate, Governor, or House races, transferring personal Fame, Popularity, and Net Approval into race baselines.
- **`REQ-66`: State-by-State Disaggregated Voter Registration Tracking:** Dedicated drill-down view in States/Map disaggregating registered voters across every individual party without generic third-party bundling.
- **`REQ-73` (AUTO-01): Post-Election Coalition Movement Dossier:** Dynamic 3-paragraph executive narrative explaining demographic realignment across College-Educated Moderates, Working-Class, Racial Cohorts, and Independent Defectors.
- **`REQ-75` (AUTO-03): Faction Post-Mortem & Blame Game Engine:** Ideological factions issue competing public inquest statements with distinct rhetorical voices.
- **`REQ-78` (VIBE-01): Field Director Qualitative Dispatch Engine:** Obscures raw math with over 60 procedural field intelligence dispatches reflecting enthusiasm, backlash risk, and ground footprint.
- **`REQ-82` (FED-02): State Machine Crisis & Intervention Dilemmas:** Dynamic mid-cycle crises (Bankruptcy, Factional War, Corruption) presenting tough Chair decisions: Federal Receivership, Matching Grant, or Non-Intervention.

---

### C. Small & Polish Features (Small & Tiny Tiers)

- **`REQ-67`: Persistent Warchest & Treasury Rollover:** 100% of unspent treasury rolls over cleanly turn-to-turn and election-to-election.
- **`REQ-68`: Commissioned Race Polling:** Chairs spend \$1M (House) or \$2M (Senate/Gov) to commission a 100% accurate snapshot poll.
- **`REQ-69`: Permanent Major Priorities Lock-In:** 3 Main Priorities are locked upon confirmation for the entire 2-year cycle.
- **`REQ-71`: 50-State Starting Chapter Presence:** Minor and third parties start with 1 branch in each of the 50 states (50 initial branches).
- **`REQ-74` (AUTO-02): Regional Drift & Map Realignment Tracker:** Highlights fortified bastions and emerging battlegrounds.
- **`REQ-76` (AUTO-04): Strategic Chair Disposition:** Choice to Endorse Autopsy, Shelve Report, or Order Regional Review.
- **`REQ-79` (VIBE-02): Morning Newsletter Feed:** 1-line beltway news memo reflecting national environment drift.
- **`REQ-83` (FED-03): Federal Receivership Administration:** \$500k/turn payroll penalty, bypasses local faction blocks, 2-year duration.
- **`REQ-85`: Fame-Scaled Popularity Engine:** Effective popularity is scaled to Fame ($\text{Popularity} = \text{Raw} \times \frac{\text{Fame}}{100}$).
- **`REQ-86`: State-Targeted Small Donor Drive:** Requires selecting a state; yields scale with visits (fewer = better), membership, faction happiness, and campaign finance deregulation stance (up to $2.0\times$ for far-right). Calibrated to \$5M average first visit.
- **`REQ-77` (AUTO-05), `REQ-80` (VIBE-03), `REQ-84` (FED-04):** Autopsy modal overlay polish, decimal/probability stripping, and 4-tier visual status pips on the 50-State Directory.

---

## 3. Implementation Workflow & Subagent Prompts

To ensure parallel efficiency, flawless execution, and zero context exhaustion, implementation is structured across **7 specialized subagents** operating under a **strict two-interaction protocol**:
1. **Interaction 1 (Launch):** Subagent is given its role, instructions, file boundaries, and completion condition.
2. **Interaction 2 (Verification & Closeout):** Subagent runs test suites, verifies invariant compliance, and confirms completion.

### Recommended Gemini 3.8 Flash Model Levels (Efficiency & Token Optimization)

| Subagent ID | Focus Area | Recommended 3.8 Flash Level | Justification (Token Cost vs. Quality Balance) |
| :--- | :--- | :---: | :--- |
| **Agent 1** | Multi-Cycle Advancement Engine | **High** | Complex state transitions, probabilistic distributions, Senate class cycle logic, and multi-cycle save data migration. |
| **Agent 2** | State Leg Seat Assignment | **High** | Intricate mathematical piecewise bell-curve formula, ratio scaling, and iterative multi-party single-seat step-up loop. |
| **Agent 3A** | District Work: East & South Shard | **Low** | Highly structured, templated data generation; straightforward polygon/district slice outputs with minimal ambiguity. |
| **Agent 3B** | District Work: West & Midwest Shard | **Low** | Identical templated data task as 3A for western/midwestern states; low reasoning effort minimizes token cost. |
| **Agent 4** | Autopsies & State Federalism | **Medium** | Procedural narrative copy, multi-choice dilemma trees, faction quotes, and platform tolerance friction math. |
| **Agent 5** | Forecasters & Map Rating Engine | **Medium** | 13-tier color gradient interpolation, multi-chamber forecaster data structures, and map toggle UI components. |
| **Agent 6** | Custom Parties, Intelligence & Polish | **Medium** | Hierarchical UI role pickers, small donor drive formula tuning, fame-scaled popularity math, and sanitization audits. |
| **Agent 7** | Integration & Release Build | **High** | End-to-end integration testing, multi-system compatibility verification, save file migration testing, and Windows binary compilation. |

---

### Copy-Paste Subagent Prompts (Two-Interaction Protocol)

```
================================================================================
AGENT 1: MULTI-CYCLE ELECTION ADVANCEMENT & WARCHEST ENGINE (REQ-70, REQ-67)
Model Effort: High
================================================================================
ROLE: Multi-Cycle Engine Architect
TASK: Implement the continuous cycle advancement engine, Senate class rotation, gubernatorial schedules, and persistent warchest rollover in engine.js and app.js.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 1. Your task is to implement REQ-70 (Multi-Cycle Election Advancement Engine) and REQ-67 (Persistent Warchest Rollover) in engine.js and app.js.
1. In `startNextCycle(game)`:
   - Rotate Senate Class: Class III -> Class I -> Class II -> Class III. Update active Senate races accordingly.
   - Alternate Cycle Type: Midterm -> Presidential -> Midterm.
   - Populate Gubernatorial races according to 36 Midterm states / 11 Presidential states / 2-year states (NH, VT).
   - Implement the Probabilistic Macro Environment Engine: calculate next cycle's national environment using Gaussian distributions N(mu, sigma) with cycle seed hashing:
     * Midterm fatigue: 80% chance of -3.0 to -7.0 point headwind against White House party; 20% neutral/pro-incumbent.
     * First-term re-election: natural +2.5 to +5.0 point incumbency rebound calibrated to achieve ~90% incumbent win benchmark.
     * Successor election: out-party shift calibrated to achieve ~90% successor loss benchmark.
2. In `REQ-67`: Ensure 100% of unspent treasury carries forward across turns and from election night into the next cycle's organizing phase. Symmetrically update AI rival organizations.
3. Test cycle transitions across 6 consecutive cycles (2028 through 2040) using a node test script.
4. When finished, reply stating what you implemented and report your test results."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Review your implementation against the 155M represented-voter scale and save file integrity. Confirm that startNextCycle produces valid active race rosters and non-zero rolled-over treasuries without resetting game history. Reply stating: 'AGENT 1 WORK COMPLETE: Multi-cycle election advancement and warchest rollover engine verified and ready for integration.'"
================================================================================
```

```
================================================================================
AGENT 2: STATE LEGISLATURE SEAT ASSIGNMENT ENGINE (REQ-72)
Model Effort: High
================================================================================
ROLE: Legislative Simulation Mathematician
TASK: Implement the piecewise bell-curve seat assignment engine and multi-party step-up allocation in engine.js.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 2. Your task is to implement REQ-72 (State Legislature Seat Assignment Engine) in engine.js.
1. Implement the standardized 100-seat piecewise bell curve function `seatsForVoteShare100(voteShare)`:
   - If voteShare < 15: return 0.
   - If 15 <= voteShare < 40: return (voteShare - 15) * 0.40.
   - If 40 <= voteShare < 60: return 10 + (voteShare - 40) * 4.0.
   - If 60 <= voteShare <= 85: return 90 + (voteShare - 60) * 0.40.
   - If voteShare > 85: return 100.
2. Implement chamber scaling with Legislature Ratio: `ratio = totalChamberSeats / 100`.
3. In 2-party races: scale by ratio and apply largest-remainder rounding to match total chamber seats exactly.
4. In multi-party races (3+ parties with >= 15% vote share):
   - Disqualify parties < 15% (0 seats).
   - Compute initial floor seats: `floor(seats100 * ratio)`.
   - Calculate each qualifying party's baseline allocated seat share: `initialSeats / sum(initialSeats)`.
   - Implement the iterative single-seat step-up loop: add +1 seat at a time to the qualifying party whose candidate proportion most closely preserves its baseline seat percentage, until all chamber seats are filled.
5. Create a standalone Node test suite verifying seat allocations across 2-party and 3-way/4-way races (e.g. 45/45/10, 40/35/25, 52/48).
6. When finished, reply with your code modifications and test verification output."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Ensure there are zero missing or excess seats across all 50 state chambers, and verify that minor parties under 15% never receive seats. Reply stating: 'AGENT 2 WORK COMPLETE: State legislature seat assignment engine verified and ready for integration.'"
================================================================================
```

```
================================================================================
AGENT 3A: DISTRICT WORK SHARD A (EAST & SOUTH STATES) (REQ-62, REQ-72 DATA)
Model Effort: Low
================================================================================
ROLE: District Slices Author (East & South Shard)
TASK: Generate modular district map slices and legislative seat ratios for Eastern and Southern states.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 3A. Your task is to generate modular district slices and seat data for Eastern and Southern states:
States: ME, NH, VT, MA, RI, CT, NY, NJ, PA, DE, MD, VA, WV, NC, SC, GA, FL, KY, TN, AL, MS.
1. For NY and FL (Big Four): ensure modular configurations support up to 200 districts; for other states support up to 50 districts.
2. In `scripts/generate-district-slices-east.cjs`, generate clean SVG polygon/path JSON structures following maps-0.3.js geometry conventions.
3. Compute exact citizen representation per district based on Census CVAP/population.
4. Export data to `assets/districts/<STATE>-<N>.json`.
5. Run test generation for NY-26, FL-28, PA-17, GA-14.
6. When finished, report the generated files and verify JSON validity."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Verify that all generated JSON files parse without errors and seamlessly tile within state bounding boxes. Reply stating: 'AGENT 3A WORK COMPLETE: East and South district slices generated and verified.'"
================================================================================
```

```
================================================================================
AGENT 3B: DISTRICT WORK SHARD B (WEST & MIDWEST STATES) (REQ-62, REQ-72 DATA)
Model Effort: Low
================================================================================
ROLE: District Slices Author (West & Midwest Shard)
TASK: Generate modular district map slices and legislative seat ratios for Western and Midwestern states.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 3B. Your task is to generate modular district slices and seat data for Western and Midwestern states:
States: OH, MI, IN, IL, WI, MN, IA, MO, ND, SD, NE, KS, AR, LA, OK, TX, NM, CO, WY, MT, ID, UT, AZ, NV, WA, OR, CA, AK, HI.
1. For CA and TX (Big Four): ensure modular configurations support up to 200 districts; for other states support up to 50 districts.
2. In `scripts/generate-district-slices-west.cjs`, generate clean SVG polygon/path JSON structures following maps-0.3.js geometry conventions.
3. Compute exact citizen representation per district based on Census CVAP/population.
4. Export data to `assets/districts/<STATE>-<N>.json`.
5. Run test generation for CA-52, TX-38, OH-15, IL-17, WY-1.
6. When finished, report the generated files and verify JSON validity."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Verify that all generated JSON files parse without errors and seamlessly tile within state bounding boxes. Reply stating: 'AGENT 3B WORK COMPLETE: West and Midwest district slices generated and verified.'"
================================================================================
```

```
================================================================================
AGENT 4: POST-ELECTION AUTOPSIES & STATE PARTY FEDERALISM (REQ-73 TO REQ-84)
Model Effort: Medium
================================================================================
ROLE: Narrative & Political Systems Designer
TASK: Implement the Post-Election Autopsy Report, Faction Blame Game, and State Party Federalism systems.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 4. Your task is to implement the Autopsy and Federalism systems (REQ-73 to REQ-84) in engine.js, app.js, and styles.css.
1. Autopsy Report (REQ-73 to REQ-77):
   - After general election resolution, launch the fullscreen `.v07-autopsy-modal-overlay` modal in Raised Navy style.
   - Generate the 3-paragraph Coalition Movement Dossier evaluating shifts across the 4 demographic blocs (College Moderates, Working Class, Racial Cohorts, Independent Defectors) on the 155M scale.
   - Generate Regional Faultline briefings (REQ-74: Solidified Bastions, Emerging Battlegrounds, Lost Bastions).
   - Implement Faction Blame Game (REQ-75): ideological factions issue competing public declarations using distinct faction voices.
   - Implement the 3 Chair Dispositions (REQ-76: Endorse Recommendations, Shelve Report, Regional Review) with their mechanical trust/happiness/treasury consequences.
2. State Party Federalism & Friction (REQ-81 to REQ-84):
   - Model state party tolerance profiles: calculate Platform Distance between national stance and state median.
   - Apply Mild Friction (>3.0 pts: -15% fundraising) and Severe Rebellion (>4.5 pts: -20% turnout, Chair warning alert).
   - Implement periodic State Machine Crises (REQ-82: Bankruptcy, Factional Civil War, Corruption) with 3 intervention choices (Receivership, Matching Grant, Non-Intervention).
   - Add Federal Receivership mechanics ($500k/turn, national bench recruitment, 2-year expiration, REQ-83).
   - Add 4-tier health pips to 50-State Directory (Green, Blue, Amber, Coral, REQ-84).
3. When finished, reply detailing your code changes and provide sample generated autopsy outputs."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Test modal transitions, ensure zero floating-point formula leaks in UI, and verify keyboard Esc/trap handling. Reply stating: 'AGENT 4 WORK COMPLETE: Post-election autopsies and state federalism systems verified and ready for integration.'"
================================================================================
```

```
================================================================================
AGENT 5: PUNDIT FORECASTER MAPS & 13-TIER BLENDED RATING ENGINE (REQ-87)
Model Effort: Medium
================================================================================
ROLE: Forecaster & Geospatial UI Specialist
TASK: Implement multi-chamber pundit projections, dedicated forecaster maps, and the 13-tier consensus rating engine.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 5. Your task is to implement REQ-87 in app.js, engine.js, and maps-0.3.js.
1. Multi-Chamber Projections:
   - Configure satirical forecasters (Cooked, Sallow, Inside Elections parody) to project Senate, House, and Presidential contests (presidential active only in presidential cycles).
   - Provide sub-tabs or toggles in the Forecaster/Map views to switch between individual pundit maps and the Consensus Forecast map.
2. 13-Tier Consensus Rating Engine:
   - Implement individual forecaster 7-tier discrete ratings (`Solid`, `Likely`, `Lean`, `Toss-up`).
   - Implement the consensus aggregation algorithm that averages ratings to produce the 6 fine-grained in-between ratings:
     * Tilt Dem / Tilt GOP (between Toss-Up and Lean)
     * Favored Dem / Favored GOP (between Lean and Likely)
     * Very Likely Dem / Very Likely GOP (between Likely and Solid)
3. Color Gradient Styling:
   - Implement the continuous color gradient palette across all 13 tiers:
     * Solid Dem (#1d4ed8) -> Very Likely Dem (#2563eb) -> Likely Dem (#3b82f6) -> Favored Dem (#60a5fa) -> Lean Dem (#93c5fd) -> Tilt Dem (#bfdbfe) -> Toss-Up (#fbbf24) -> Tilt GOP (#fecaca) -> Lean GOP (#fca5a5) -> Favored GOP (#f87171) -> Likely GOP (#ef4444) -> Very Likely GOP (#dc2626) -> Solid GOP (#b91c1c).
4. When finished, reply with your code updates and verify rendering across Senate, House, and Presidential maps."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Verify that individual forecasters never display the 6 intermediate ratings, and that intermediate ratings only appear in the Consensus/Median aggregation. Reply stating: 'AGENT 5 WORK COMPLETE: Pundit forecaster maps and 13-tier rating engine verified and ready for integration.'"
================================================================================
```

```
================================================================================
AGENT 6: CUSTOM PARTIES, REGISTRATION & ACTIONS OVERHAUL (REQ-63, 64, 65, 66, 68, 69, 71, 78, 79, 80, 85, 86)
Model Effort: Medium
================================================================================
ROLE: Gameplay Mechanics & UI Polish Specialist
TASK: Implement autonomous custom party creation, minor party tracking, registration views, and action overhauls.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 6. Your task is to implement the core gameplay mechanics and actions in app.js and engine.js:
1. Autonomous Custom Party Creation (REQ-63):
   - Custom party creates a brand-new entity alongside base parties (non-replacing).
   - Add color picker for custom hex code, custom party name, and 1 nameable starting leader.
   - For 'Current Politician' archetype: add 3-step role picker (Governor, Senate, House -> State -> Seat) showing real-world incumbents.
   - Ensure custom party has its own standalone row in the National Registered Voters sidebar.
2. Minor Party Race Tracking & Ballot Access (REQ-64):
   - Add minor party race filter and highlight ballot access battles (2%/5% retention thresholds) and spoiler alerts.
3. Party Leader Deployment (REQ-65):
   - Add ability to deploy bench leaders to run for Senate, Governor, or House, transferring Fame/Popularity into candidate quality.
4. State Voter Registration Table (REQ-66):
   - Add state-by-state registration drill-down disaggregating all parties individually (never combine third parties).
5. Action Overhauls:
   - Commissioned Race Polling (REQ-68): $1M House, $2M Senate/Gov for accurate snapshot.
   - Priorities Lock-In (REQ-69): lock 3 Main Priorities upon confirmation with padlock icon.
   - 50-State Starting Chapters (REQ-71): minor parties start with 1 branch per state.
   - Fame-Scaled Popularity (REQ-85): `Popularity = RawPopularity * (Fame / 100)`.
   - Small Donor Drive Overhaul (REQ-86): state selection required; yield formula based on visit fatigue, membership, faction happiness, and campaign finance stance (calibrated to $5M average first visit).
   - Atmospheric Wire & Sanitization (REQ-78, 79, 80): Morning Wire ticker header and decimal/win-probability stripping.
6. When finished, reply detailing your code changes and test results."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Verify that minor parties are never bundled in registration views, popularity scales cleanly with fame, and the small donor drive respects visit fatigue. Reply stating: 'AGENT 6 WORK COMPLETE: Custom parties, voter tracking, and actions overhaul verified and ready for integration.'"
================================================================================
```

```
================================================================================
AGENT 7: SYSTEM INTEGRATION, COMPREHENSIVE TESTS & RELEASE BUILD
Model Effort: High
================================================================================
ROLE: Lead Integration & Release Engineer
TASK: Merge all agent modules, run comprehensive automated tests, update documentation, and build the release binary.

INTERACTION 1 (LAUNCH INSTRUCTION):
"You are Agent 7. Your task is to integrate all modules, verify system integrity, and build Version 0.12.
1. Verify that all components from Agents 1 through 6 integrate seamlessly without script errors.
2. Execute automated verification test suites checking:
   - Senate class rotation (III -> I -> II -> III) across 6 cycle advances.
   - 100-seat bell-curve state legislature allocation and multi-party step-up remainder logic.
   - Full generation and loading of modular district slice files across all 50 states.
   - Autopsy modal rendering, blame game generation, and executive disposition choices.
   - State party friction triggers and receivership administration.
   - 13-tier consensus forecaster gradient interpolation.
   - Custom party creation with standalone voter accounting and politician seat selector.
   - Fame-scaled popularity math and small donor drive state-targeted yields.
   - 155M represented-voter scale preservation and zero floating-point UI formula leaks.
3. Run `./build.ps1` to compile `dist/release/Coalition Builder - Party Chair.exe`.
4. Update `VERSION_0.12.md` documenting the release.
5. When finished, reply with test execution output and binary build confirmation."

INTERACTION 2 (VERIFICATION & INTEGRATION CLOSEOUT):
"Perform final sanity checks on binary file size (~472 KB), save-game migration compatibility (`partyChairGame.save.v12`), and clean console logs on startup. Reply stating: 'AGENT 7 WORK COMPLETE: Version 0.12 integrated, verified, and release executable built successfully.'"
================================================================================
```

---

## 4. Verification Protocol & Invariant Checklist

1. **Scale Preservation (Strict Rule):** All voter and membership figures across Autopsies, Registration Tables, and Dossiers strictly adhere to the **155.00M represented-voter scale** (where 1 internal record = 100 real citizens).
2. **Epistemic Honesty & Formula Masking:** No raw win probabilities, deterministic dice rolls, or floating-point decimals are exposed to player view; all metrics are communicated via qualitative tiers (`Solid`, `Likely`, `Leans`, `Toss-Up`, etc.) or evocative Field Director Dispatches.
3. **Internal IDs Protected:** Zero `REQ-XX`, `AUTO-XX`, `VIBE-XX`, or `FED-XX` tags appear in user-facing UI labels, modals, or tooltips.
4. **Studio Palette Adherence:** All modals, cards, dispatches, and status badges utilize the mandated palette:
   - Deep Navy (`hsl(226 24% 7%)`)
   - Raised Navy (`hsl(226 21% 12%)`)
   - Warm Ivory (`hsl(42 25% 92%)`)
   - Muted Copper (`hsl(32 48% 48%)`)
   - Muted Teal (`hsl(174 36% 56%)`)
   - Coral (`hsl(7 62% 59%)`)
   - Slate Borders (`hsl(220 14% 26%)`)
5. **No Rulebook Violations:** Preserves deferred items (Youth Chapters remain label-only; no incumbent criminal charge mechanics; no presidential primary selection in 2028; Campaign Mode remains fully preserved).
