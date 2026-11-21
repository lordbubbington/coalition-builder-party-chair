# Version 0.11 Design Specification: The Decennial Redistricting & Dynamic Electoral Map Update

**Build Target:** Version 0.11  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *Decennial Reapportionment, Procedural District Maps, Text-First Platforms & Strategic Quests*  
**Date:** November 12, 2026  
**Status:** Approved for Implementation Workflow

---

## 1. Executive Summary & Build Balance

Version 0.11 is a landmark architectural update designed to make the political universe feel alive, dynamic, and evolving across decades. It introduces **Decennial Reapportionment and Procedural State Redistricting (`REQ-62`)**, allowing U.S. House districts to be dynamically redrawn every 10 years on the decade (2030, 2040, 2050...) based on population shifts. Individual state district maps are assembled into a unified national `2xxx map` saved locally per game. 

To complete this major build alongside redistricting, Version 0.11 integrates all pending active backlog features (excluding long-term additions reserved for v0.15+):
- **1 Huge:** Decennial Reapportionment & Procedural Redistricting System (`REQ-62`)
- **2 Large:** Text-First Stance Display & Platform UI Redesign (`REQ-60`), 10-Slot Priorities & Strategic Quests (`REQ-61`)
- **2 Medium:** 5th Main Navigation Tab: "Party Information" (`REQ-57`), Semi-Scripted 2028–2032 Narrative Arc (`REQ-58`)
- **1 Small:** Calibrated Tri-Factor Starting Approval Benchmarks (`REQ-59`)

---

## 2. Core Feature Specifications

### REQ-62: Decennial Reapportionment & Dynamic Procedural Redistricting System (Huge)
- **Decennial Timing & Trigger:**
  - Occurs **every 10 years on the decade** (e.g. **2030, 2040, 2050, 2060...**).
  - Triggers **immediately after the general election of that year**, before the simulation advances to the next organizing year.
- **Population & Apportionment Mechanics:**
  - Implements the **Huntington-Hill Method of Equal Proportions** to distribute the 435 U.S. House seats among the 50 states based on decennial Census population counts.
  - State population is divided equally by the newly assigned number of districts:
    $$\text{District Population} = \frac{\text{State Population}}{N_{\text{districts}}}$$
    Every district in a state represents this exact citizen count.
- **State District Map Coverage & Ranges:**
  - **The Big Four (CA, NY, FL, TX):** Must support modular district map configurations for **up to 200 districts** ($N \in [1, 200]$).
  - **Remaining 46 States:** Must support modular district map configurations for **up to 50 districts** ($N \in [1, 50]$).
  - Maps consist of clean, coherent geometric polygon/path files matching the game's existing SVG styling, designed to seamlessly tile together without visual seams.
- **Modular File Assembly & Local Save Architecture:**
  - The game engine dynamically looks up each state's required district count slice (e.g. `assets/districts/PA-17.json`, `assets/districts/CA-52.json`).
  - The engine pieces together all 50 state slices into a single coherent **National U.S. House Map**.
  - The assembled map is saved locally inside the active playthrough save directory under `2xxx map` (where `2xxx` is the decennial year, e.g. `2030 map`, `2040 map`).
  - Subsequent elections in that decade run on this newly assembled `2xxx map` until the next decennial redistricting cycle.

---

### REQ-60: Text-First Stance Display & Platform UI Redesign (Large)
- **Zero Raw Numbers in Stance Views:**
  - Everywhere an issue stance is currently shown as a raw number `1–10`, it is replaced with the exact prose sentence from `PLATFORM_10_PILLARS_SPECIFICATION.md` (and `STANCE_DESCRIPTIONS`).
  - Players never see bare ratings like `"Position: 4"` or `"7/10"`; they read real political policy (e.g., *"Federal statutory right to abortion before viability; federal funding permitted"*).
- **Platform UI Layout Overhaul:**
  - Redesigns the Step 1 interface, candidate comparison modals, and party profile views.
  - Controls feature text-first expandable descriptions and structured typographic hierarchy so long-form policy statements read gracefully without cluttering the screen.

---

### REQ-61: 10-Slot Priority Framework & Strategic Quests (Large)
- **10-Slot Priority Capacity:**
  - Expands party priorities from 3 issues to **10 total active priority slots**.
- **Slot 1: The "Overall Priority" Quest:**
  - One overarching national mandate selected at the start of a cycle from 25 eligible options based on White House status, chamber majorities, and party registration.
  - Categorized across 5 difficulty tiers: **Easy**, **Medium**, **Hard**, **Insane**, and **Impossible**.
  - **Rewards:** Successfully meeting the quest goal rewards the party with **Party Member Happiness** scaling with difficulty (Easy: $+8$; Medium: $+12–14$; Hard: $+18–20$; Insane: $+28–30$; Impossible: $+40$), plus rare strategic buffs (e.g. legislative immunity, donor network boosts, or permanent voter conversion). Certain quests provide an immediate acceptance bonus.

---

### REQ-57: 5th Main View Tab: "Party Information" (Medium)
- **New 5th Fullscreen View:**
  - Adds a 5th navigation tab: **`Party information`** (Eyebrow: `PARTY STANDING & METRICS`).
- **Migrated Strategic Intelligence Components:**
  - Moves the following 4 modules out of the Forecast/Sidebar tabs to the new screen:
    1. **Public & Coalition Trust Panel** (Base Supporters, Independents, Opponents, Sitting Member Happiness).
    2. **Unified Party Approval Tracker** (Approval percentages and status bands across all active parties).
    3. **20-Point National Environment Gauge** (±20 scale, Wave/Landslide markers, and drift warning).
    4. **Satirical Forecaster Projections** (Cook and Sabato qualitative race ratings and EV counts).
- **Streamlined Forecast Tab:** Retains exclusive focus on Election History, Record Archives, and the Chair Organizing Diary.

---

### REQ-58: Semi-Scripted Opening National Environment & De Facto Narrative Arc (Medium)
- **2028 Opening Baseline:** Starts at `D+9`, naturally drifting toward `D+14` over the 20 organizing turns in the absence of counter-campaigning.
- **Ossoff First-Term Governing Fatigue:** Progressive turn-by-turn popularity decay reflecting executive governing wear-and-tear.
- **2030 Midterm Headwinds:** Midterm environment shifts sharply into a Republican-leaning climate (`R+4` to `R+8`).
- **2032 Re-election Crucible:** Tightly balanced re-election contest where victory or defeat is determined organically by player strategy.
- **Post-2032 Open Dynamic Sandbox:** Rails fall away completely into emergent multi-decade simulation.
- **Emergent Storytelling:** De facto and unobtrusive; told through data and newspaper reports rather than scripted popups.

---

### REQ-59: Organic Tri-Factor Input Calibration for 2028 Approval Benchmarks (Small)
- Preserves the Tri-Factor formula ($40\% \text{ Ballot} + 20\% \text{ Presidency} + 40\% \text{ Leader Popularity} + \text{Trust Tilt}$) without overrides.
- **Voter-Registration-Weighted Trust Calculation:** The party trust calculation weights independents, non-party voters (all voters from other parties), and own-party voters relative to their registration numbers:
  $$\text{Weighted Trust}_p = \frac{(N_{\text{party}} \times \text{Trust}_{\text{supporters}}) + (N_{\text{ind}} \times \text{Trust}_{\text{independents}}) + (N_{\text{non-party}} \times \text{Trust}_{\text{opponents}})}{155\text{M}}$$
- **Main Mechanism for Minor Party Approval:** Because non-party voters from other parties make up $>75\%$ of the electorate for minor parties (evaluating at low Opponent Trust ~10–15%), this registration-weighted formula naturally and organically suppresses starting approval for minor parties to their target benchmarks without artificial overrides.
- Calibrates inputs to naturally produce the 2028 opening targets:
  - **Democrats:** ~**40%**
  - **Republicans:** ~**35%**
  - **Libertarians:** **12%**
  - **Greens:** **8%**
  - **Constitution Party:** **7%**
  - **Socialist Party:** **5%**
  - **Custom Parties:** **1%**

---

## 3. Overall Priority Quests Reference Table (25 Quests)

| Overall Priority Option | Trigger Condition | Goal / Target | Acceptance Bonus (If Any) | Difficulty & Completion Rewards |
| :--- | :--- | :--- | :--- | :--- |
| **Fundraising** | None | Raise $\$30\text{M}+$ during cycle; end treasury $\ge \$25\text{M}$ | $+5\%$ tour donor yield | **Easy** · $+8$ Member Happiness; $+10\%$ turn revenue next cycle. |
| **Growing our vote Nationally** | None | Increase national popular vote share by $\ge +3.0\%$ | $+1.5\%$ base enthusiasm | **Medium** · $+12$ Member Happiness. |
| **Growing in a specific state** | None | Expand membership by $+20\%$ and vote share by $+5.0\%$ in chosen state | Free state chapter upgrade | **Medium** · $+12$ Member Happiness; state becomes an anchored stronghold. |
| **Satisfying the base** | None | Maintain $\ge 90$ Supporter Trust; resolve all faction threats | $+4$ Supporter Trust | **Easy** · $+8$ Member Happiness; base turnout penalty eliminated. |
| **Winning over Swing Voters** | None | Raise Independents Trust to $\ge 65$; win independent plurality | $+3$ Independents Trust | **Medium** · $+14$ Member Happiness; $+5\%$ transfer appeal bonus. |
| **Improving our Brand** | None | Increase Unified Party Approval by $\ge +6.0\%$ by Election Day | $+1.5\%$ initial approval bump | **Medium** · $+12$ Member Happiness. |
| **Push our issues** | None | Prioritize 3 signature issues; pass $\ge 2$ aligned state bills | $+2$ sitting member discipline | **Medium** · $+10$ Member Happiness; $+10\%$ allied PAC ad efficiency. |
| **Win X re-election** | Holds Presidency; 1-term incumbent; Presidential year | Win 270+ Electoral College votes to re-elect President | $+5$ House battleground coattails | **Hard** · $+20$ Member Happiness; *Governing Mandate* (fatigue halved 2 yrs). |
| **Affirm the Succession** | Holds Presidency; 2-term incumbent; Presidential year | Retain White House with new successor nominee | $+3$ VP Name Recognition | **Hard** · $+20$ Member Happiness; party cements presidential prestige. |
| **Take back the White House** | Do NOT hold Presidency; held WH in last 20 yrs; Pres year | Defeat incumbent party ticket; win 270+ EVs | $+4$ Challenger Debate boost | **Hard** · $+20$ Member Happiness; restores full Executive Patronage. |
| **Win the White House** | Do NOT hold Presidency; $\ge 20\%$ nat vote; never won WH; Pres year | Win 270+ Electoral College votes for the first time | $+6$ Outsider wave boost | **Insane** · $+30$ Member Happiness; *Historic Realignment Event*. |
| **Building our brand** | Do NOT hold Presidency; $< 5\text{M}$ registered members; Pres year | Reach $5.0\text{M}+$ registered members; ballot access in 40+ states | Doubled voter registration rates | **Medium** · $+14$ Member Happiness; minor ballot hurdle fees eliminated. |
| **Holding the House** | Holds majority in U.S. House ($\ge 218$ seats) | Win $\ge 218$ House seats in general election | $+1$ Legislative Discipline | **Medium** · $+12$ Member Happiness; retains Speaker of the House perks. |
| **Holding the Senate** | Holds majority in U.S. Senate ($\ge 51$ or $50$ + VP) | Retain majority across contested Senate classes | $+1$ Committee Leadership bonus | **Medium** · $+14$ Member Happiness; retains Senate Majority Leader calendar power. |
| **Win the House** | Holds $100–217$ House seats (minority) | Flip chamber control by winning $\ge 218$ House seats | $+3.0\%$ House generic ballot wind | **Hard** · $+18$ Member Happiness; gains Speaker of the House office. |
| **Win the Senate** | Holds $30–49$ Senate seats (minority) | Flip chamber control by winning Senate majority | $+2$ Persuasion in top 5 battlegrounds | **Hard** · $+18$ Member Happiness; gains Senate Majority Leader post. |
| **Holding the House and Senate** | Holds majorities in BOTH U.S. House and Senate | Defend both chambers and retain majorities in both | $+2$ Incumbent Protection budget | **Hard** · $+20$ Member Happiness; total legislative branch control. |
| **Holding the Trifecta** | Holds House, Senate, and Presidency simultaneously | Win presidency AND maintain majorities in both chambers | $+3$ Governance Confidence | **Insane** · $+28$ Member Happiness; unlocks *Federal Omnibus Legislation*. |
| **Win first seat** | Holds 0 state legislature seats | Win at least 1 state legislative chamber seat nationwide | Free staffer in target district | **Easy** · $+8$ Member Happiness; establishes baseline viability. |
| **Win first house seat** | Holds 0 House seats; holds $\ge 1$ state leg seat | Win at least 1 seat in U.S. House of Representatives | $+5$ Quality to top House recruit | **Medium** · $+14$ Member Happiness; unlocks first Category B leadership slot. |
| **Win first senate seat** | Holds 0 Senate seats; holds $\ge 1$ state leg seat | Win at least 1 U.S. Senate election | $+10$ Fame to nominated candidate | **Hard** · $+20$ Member Happiness; unlocks statewide media attention. |
| **Win First Governorship** | Holds 0 governorships; holds $\ge 1$ state leg seat | Win at least 1 gubernatorial election in any state | $+4$ Statewide fundraising bonus | **Hard** · $+18$ Member Happiness; unlocks state executive authority. |
| **Win first state legislature** | Holds 0 state legislative majorities; holds $\ge 1$ seat | Flip and control at least 1 full state legislative chamber | $+2$ State legislative recruitment pool | **Hard** · $+18$ Member Happiness; unlocks state policy bills. |
| **Win 300 seats** | Holds majority in U.S. House ($\ge 218$ seats) | Win $\ge 300$ seats in U.S. House of Representatives | $+4.0\%$ national wave momentum | **Insane** · $+30$ Member Happiness; shatters rival committee leverage. |
| **Win filibuster proof majority** | Holds majority in U.S. Senate | Win $\ge 60$ Senate seats (Filibuster-Proof) | $+5$ Senate party discipline | **Impossible** · $+40$ Member Happiness; *Total Senate Supremacy*. |

---

## 4. Multi-Agent Implementation Workflow (Max 2 Interactions Per Agent)

To ensure smooth execution without unnecessary conversational back-and-forth, development is divided among 5 specialized subagents. Each agent requires **exactly two user interactions**:
1. **Interaction 1:** User pastes the brief/prompt to the agent.
2. **Interaction 2:** Agent notifies user it is done and ready for integration.

```
                      ┌───────────────────────────────────────────────┐
                      │              USER COORDINATOR                 │
                      └───────┬───────────────────────────────┬───────┘
                              │                               │
        ┌─────────────────────┼───────────────────────────────┼─────────────────────┐
        ▼                     ▼                               ▼                     ▼
┌───────────────┐     ┌───────────────┐               ┌───────────────┐     ┌───────────────┐
│    AGENT 1    │     │    AGENT 2    │               │    AGENT 3    │     │    AGENT 4    │
│  Redistrict   │     │  District Map │               │ Platform Text │     │  10-Priority  │
│ Engine & Save │     │  Generators   │               │ & 5th Tab Nav │     │ Quests System │
└───────┬───────┘     └───────┬───────┘               └───────┬───────┘     └───────┬───────┘
        │                     │                               │                     │
        └─────────────────────┼───────────────────────────────┼─────────────────────┘
                              ▼
                      ┌───────────────┐
                      │    AGENT 5    │
                      │  Integration, │
                      │  Test & Build │
                      └───────────────┘
```

---

### Copy-Paste Agent Prompts

#### Agent 1: Redistricting Engine & Decennial Map Assembly
```text
ROLE: Redistricting Engine & File Assembly Specialist
TASK: Implement the Decennial Reapportionment and Map Assembly system for Version 0.11 in engine.js and scenario-2028.js.
INSTRUCTIONS:
1. Trigger: Detect when a general election concludes on a decennial year (2030, 2040, 2050...). Run redistricting immediately post-election before advancing the calendar year.
2. Reapportionment Algorithm: Implement the Huntington-Hill method to assign the 435 House seats among the 50 states based on updated decennial population counts.
3. Map Assembly: Look up modular district geometry files for each state's assigned district count (from assets/districts/<state>-<N>.json or generator). Stitch them together into a unified national House map.
4. Local Save File: Save the assembled national map into the active save state under key `2xxx map` (e.g. `2030 map`).
5. Wire House election simulation to read from `2xxx map` for all ensuing cycles in that decade.
6. When complete, reply stating: "AGENT 1 WORK COMPLETE: Redistricting Engine and Decennial Map Assembly implemented and tested. Ready for integration."
```

#### Agent 2: Modular District Map Data Generators (Sharded / Procedural)
```text
ROLE: Procedural District Map Author
TASK: Create the modular district slice files and procedural geometry generator for all 50 states.
INSTRUCTIONS:
1. Create `scripts/generate-district-slices.cjs` to procedurally output SVG path/polygon slices for each state.
2. Ensure The Big Four (CA, NY, FL, TX) support district slice configurations up to 200 districts.
3. Ensure the remaining 46 states support district slice configurations up to 50 districts.
4. Calculate citizen representation per district by dividing state Census population by district count N.
5. Export clean JSON geometry structures compatible with maps-0.3.js renderer.
6. Test generation for sample states (e.g. PA-17, CA-52, WY-1, TX-38).
7. When complete, reply stating: "AGENT 2 WORK COMPLETE: Modular district maps and slice generators generated. Ready for integration."
```

#### Agent 3: Platform Text-First Redesign & 5th Tab Navigation Migration
```text
ROLE: UI & Platform Architecture Specialist
TASK: Implement REQ-60 (Text-First Stance Display) and REQ-57 (5th "Party Information" Tab) in app.js and styles.css.
INSTRUCTIONS:
1. 5th Tab Navigation: Add `Party information` (Eyebrow: `PARTY STANDING & METRICS`) to the primary tab bar.
2. Component Migration: Move Public & Coalition Trust, Unified Party Approval Tracker, 20-Point National Environment, and Satirical Forecasters into the `Party information` tab. Keep Forecast tab focused on history and logs.
3. Text-First Stances (REQ-60): Replace all raw 1–10 numbers across sliders, cards, and summaries with descriptive prose sentences from window.PartyChairData.STANCE_DESCRIPTIONS.
4. Redesign Step 1 UI to gracefully display full descriptive sentences with clean typography.
5. Calibrate Unified Party Approval inputs (REQ-59) to naturally hit 2028 benchmarks (Dems ~40%, GOP ~35%, Libs 12%, Greens 8%, Con 7%, Soc 5%, Cust 1%).
6. When complete, reply stating: "AGENT 3 WORK COMPLETE: Text-first platform UI redesign and 5th Party Information tab implemented. Ready for integration."
```

#### Agent 4: 10-Slot Priority Framework & Overall Strategic Quests
```text
ROLE: Strategic Gameplay Systems Engineer
TASK: Implement the 10-slot priority framework and 25 Overall Priority Quests in app.js and engine.js (REQ-61).
INSTRUCTIONS:
1. Expand party priorities in game state to 10 total slots.
2. Implement Slot 1: Overall Priority Quest selector displaying eligible options from the 25-quest catalog.
3. Add eligibility filter logic (checks White House incumbent term status, chamber control, seat counts, and registration).
4. Implement acceptance bonuses and completion condition evaluation at election resolution.
5. Award scaled Party Member Happiness upon completion based on difficulty (Easy: +8, Medium: +12-14, Hard: +18-20, Insane: +28-30, Impossible: +40).
6. Implement the semi-scripted 2028-2032 narrative drift (REQ-58: D+9 to D+14 drift, Ossoff fatigue, rough 2030 midterm, close 2032 election).
7. When complete, reply stating: "AGENT 4 WORK COMPLETE: 10-slot priority system and 25 overall strategic quests implemented. Ready for integration."
```

#### Agent 5: Integration, Verification & Release Build
```text
ROLE: Lead Integration & Release Engineer
TASK: Merge all agent modules, verify comprehensive tests, and compile the final release binary.
INSTRUCTIONS:
1. Verify that all components integrate seamlessly without script syntax errors or missing asset references.
2. Run a full headless Node verification test checking:
   - Huntington-Hill decennial reapportionment on 2030 election resolution.
   - Dynamic assembly and save persistence of `2030 map`.
   - Text-first stance display rendering full sentences.
   - 25 overall priority quest eligibility and happiness rewards.
   - 5th `Party information` tab rendering and component migration.
3. Execute `./build.ps1` to compile the release executable `dist/release/Coalition Builder - Party Chair.exe`.
4. Update `VERSION_0.11.md` documenting the release.
5. When complete, reply stating: "AGENT 5 WORK COMPLETE: Version 0.11 integrated, verified, and release executable built successfully."
```
