# Priorities System Rework: Design Specification & Workflow

**Classification:** Minor Update (Point Update — No Full Version Designation)  
**Document:** `PRIORITIES_REWORK_DESIGN.md`  
**Date:** November 12, 2026  
**Status:** Approved for Implementation (Design Document Only)

---

## 1. System Overview

This update redesigns Step 2 (Priorities) from the legacy 3-issue priority model into a structured **Two-Tier Strategic Priority Architecture**:

1. **3 Main Priorities:**
   - The party selects **3 Main Priorities** from the master **Overall Strategic Quests Catalog** (26 options detailed in Section 3).
   - Each quest features dynamic trigger/eligibility conditions, an immediate acceptance bonus (if applicable), a measurable cycle target, and completion rewards scaling by difficulty tier (**Easy**, **Medium**, **Hard**, **Insane**).
2. **5 Additional Priorities (Tracked Separately):**
   - In addition to the 3 Main Priorities, the party selects **5 Additional Priorities** from a flexible menu of geographic and policy targets:
     - **Issue Priority:** Choosing an issue increases party base loyalty (**Base Supporter Trust / loyalty**).
     - **State Priority:** Choosing a specific state grants **$+5,000$ registered voters** immediately in that target state.
     - **Region Priority:** Choosing an entire region grants **$+500$ registered voters in each state** across that region.

---

## 2. Core Mechanics & UI Architecture

### A. Separation of Priorities in the UI (Step 2)
- **Main Priorities Deck (Top Section):**
  - Displays 3 dedicated quest slots: `Main Priority 1`, `Main Priority 2`, and `Main Priority 3`.
  - Clicking any empty slot opens the **Strategic Quests Catalog Modal**, filtered to only show options the party currently qualifies for based on institutional status (presidency, chamber control, seat totals, and registration size).
  - Selected quests display their goal progress meter, active acceptance bonus, and completion reward badge.
- **Additional Priorities Deck (Bottom Section):**
  - Displays 5 flexible slots: `Additional Priority 1` through `5`.
  - For each slot, the chair chooses between three radio/tab options:
    - `[ Issue ]`: Select any national issue $\rightarrow$ grants immediate $+1.5$ Base Supporter Trust and $2\times$ ideological weighting.
    - `[ State ]`: Select any of the 50 states $\rightarrow$ grants $+5,000$ registered voters in that state.
    - `[ Region ]`: Select any recognized region $\rightarrow$ grants $+500$ registered voters in every state within that region.

### B. Major Priorities Cycle Lock-In Rule (Strict Invariant)
- **Permanent Lock-In:** Once the chair selects and confirms their 3 Main Priorities, those selections are **permanently locked** for the remainder of that 2-year cycle.
- **No Mid-Cycle Swapping:** Players cannot swap, replace, or cancel their locked Major Priorities mid-cycle. This guarantees strategic commitment and prevents exploiting acceptance bonuses across multiple quests.
- **Cycle Reset:** Slots unlock again only when the cycle completes and a new 2-year cycle begins.

---

## 3. Master Overall Priority Quests Catalog (26 Quests)

| Trigger Condition | Overall Priority Option | Goal / Target | Acceptance Bonus | Difficulty & Completion Rewards |
| :--- | :--- | :--- | :--- | :--- |
| **None** (Available to all parties) | **Fundraising** | N/A | Your current budget increases by **25%** | **NONE** · This quest is automatically completed upon selection. |
| **None** (Available to all parties) | **Growing our vote Nationally** | Increase national popular vote share by at least **+3.0%** over previous baseline | Gain **10,000 voters** across the country (distributed randomly) | **Medium** · $+4$ Member Happiness. |
| **None** (Available to all parties) | **Growing in (A specific state)** | Expand party membership by **+20%** and increase state vote share by **+5.0%** in chosen target state | Gain **5,000 voters** in target state | **Medium** · $+4$ Member Happiness; target state maxes out its number of chapters (Cannot give a state more than 5 chapters). |
| **None** (Available to all parties) | **Satisfying the base** | Maintain **≥90 Base Supporter Trust** and resolve all faction grievances throughout the cycle | **+4 Base Supporter Trust** immediately | **Easy** · $+2$ Member Happiness; base will not lose trust for any reason for the next 2 years. |
| **None** (Available to all parties) | **Winning over Swing Voters** | Raise Independents Trust to **≥65** and win a plurality of independent voters nationally | **+3 Independents Trust** immediately | **Medium** · $+4$ Member Happiness; permanent $+5\%$ transfer appeal bonus among unaligned voters. |
| **None** (Available to all parties) | **Improving our Brand** | Increase Unified Party Approval by at least **+6.0%** points by Election Day | **+1.5%** initial approval bump | **Medium** · $+4$ Member Happiness; permanent $+5\%$ transfer appeal bonus among unaligned voters. |
| **None** (Available to all parties) | **Push our issues** | Prioritize 3 signature issues and enact at least **2 state policy bills** aligned with them | **+2 sitting member discipline** | **Easy** · $+4$ Member Happiness; $+10\%$ issue-ad efficiency for allied Super PACs next campaign cycle. |
| Must hold the Presidency; 1-term incumbent president; Presidential election year | **Win X re-election** | Win **270+ Electoral College votes** and re-elect the incumbent President | **+5 White House Coattail bonus** to House battlegrounds | **Hard** · $+6$ Member Happiness; President enters term 2 with a *Governing Mandate* (fatigue penalty halved for 2 years). |
| Must hold the Presidency; 2-term incumbent president; Presidential election year | **Affirm the Succession** | Retain the White House with the party's new standard-bearer (successor nominee) | **+3 VP Name Recognition** nationwide | **Hard** · $+6$ Member Happiness; party solidifies presidential dynastic prestige. President enters term 1 with a *Governing Mandate* (fatigue penalty halved for 2 years). |
| Do NOT hold Presidency; must have won the White House within the last 20 years; Presidential year | **Take back the White House** | Defeat the incumbent party ticket and secure **270+ Electoral College votes** | *None* | **Hard** · $+6$ Member Happiness; party solidifies presidential dynastic prestige. President enters term 1 with a *Governing Mandate* (fatigue penalty halved for 2 years). |
| Do NOT hold Presidency; ≥20% national vote; party has never won the Presidency; Presidential year | **Win the White House** | Secure **270+ Electoral College votes** and win the White House for the first time in history | *None* | **Insane** · $+25$ Member Happiness; *Historic Realignment Event* (permanently cements Major Party status); Instead of 1/4th of excess voters moving to your party, **3/4ths do** (This effect is hidden). |
| Do NOT hold Presidency; party has <5M registered members; Presidential year | **Building our brand** | Surpass **5.0M registered party members** and achieve ballot access in 40+ states | **Doubled voter registration conversion rates** | **Medium** · $+4$ Member Happiness; Gain **500,000 registered voters** (from independents) across the country, gaining no more than 35,000 in any given state. |
| Must currently hold majority control of the U.S. House (≥218 seats) | **Holding the House** | Win **≥218 House seats** in the general election | **+1 Legislative Discipline** | **Medium** · $+8$ Member Happiness; retains Speaker of the House office perks. |
| Must currently hold majority control of the U.S. Senate (≥50 seats + VP or ≥51) | **Holding the Senate** | Retain chamber majority across contested Senate classes | **+1 Committee Leadership bonus** | **Medium** · $+8$ Member Happiness; retains Senate Majority Leader calendar power. |
| Currently hold at least 100 House seats, but do NOT hold the majority (100–217 seats) | **Win the House** | Flip chamber control by winning **≥218 House seats** | **+3.0%** national House generic ballot wind | **Hard** · $+8$ Member Happiness; move the lean of **20 districts you won towards your party by 1 point**, starting with the districts that have the worst lean for your party. |
| Currently hold at least 30 Senate seats, but do NOT hold the majority (30–49 seats) | **Win the Senate** | Flip chamber control by winning majority control (**≥51 seats or 50 + VP**) | **+2 Persuasion boost** in top 5 Senate battlegrounds | **Hard** · $+8$ Member Happiness; unlocks Senate Majority Leader role. |
| Must currently hold majorities in BOTH the U.S. House and U.S. Senate | **Holding the House and Senate** | Defend both chambers and retain majorities in both the House and Senate simultaneously | **+2 Combined Incumbent Protection budget** | **Hard** · $+12$ Member Happiness. |
| Must hold the House, Senate, and Presidency simultaneously | **Holding the Trifecta** | Win the presidential race AND maintain majorities in both House and Senate | **+3 National Governance Confidence** | **Insane** · $+25$ Member Happiness; unlocks *Federal Omnibus Legislation* capability. |
| Must currently hold 0 state legislature seats | **Win first seat** | Win at least **1 state legislative chamber seat** anywhere in the nation | **+5 in the polls** in your best polling state legislative race | **Hard** · $+10$ Member Happiness; **10,000 registered voters** in the state the seat was located in (maximum one state). |
| Must hold 0 U.S. House seats, but hold at least 1 state legislature seat | **Win first house seat** | Win at least **1 seat in the U.S. House of Representatives** | **+5 in the polls** in your best polling house race | **Hard** · $+10$ Member Happiness; **10,000 registered voters** in the state the seat was located in (maximum one state). |
| Must hold 0 U.S. Senate seats, but hold at least 1 state legislature seat | **Win first senate seat** | Win at least **1 U.S. Senate election** | **+5 in the polls** in your best polling senate race | **Hard** · $+10$ Member Happiness; **25,000 registered voters** in the state the seat was located in (maximum one state). |
| Must hold 0 governorships, but hold at least 1 state legislature seat | **Win First Governorship** | Win at least **1 gubernatorial election** in any state | **+5 in the polls** in your best polling governors race | **Hard** · $+10$ Member Happiness; **10,000 registered voters** in the state the seat was located in (maximum one state). |
| Must hold 0 state legislative majorities, but hold at least 1 state legislative seat | **Win first state legislature** | Flip and control at least **1 full state legislative chamber** | **+2 State legislative recruitment pool** | **Hard** · $+18$ Member Happiness; unlocks state policy bill introduction in that state. |
| Must currently hold a majority in the U.S. House (≥218 seats) | **Win 300 seats** | Win **≥300 seats** in the U.S. House of Representatives (Super-Majority Wave) | *None* | **Insane** · $+30$ Member Happiness; Any party that is not the player that is either the Democratic or Republican party **loses half of its registered voters**. |
| Must currently hold a majority in the U.S. Senate | **Win filibuster proof majority** | Win **≥60 Senate seats** (Filibuster-Proof Supermajority) | *None* | **Insane** · $+30$ Member Happiness; Any party that is not the player that is either the Democratic or Republican party **loses half of its registered voters**. |
| Must currently have 45 senate seats, 200 house seats, and the US president is not of your party. Midterm elections only | **Impeach a sitting president** | Win **≥60 Senate seats** (Filibuster-Proof Supermajority); more than 66 senate seats cannot belong to the president's party; president's party cannot control the House | *None* | **Insane** · $+30$ Member Happiness; Any party that is not the player that is either the Democratic or Republican party **loses half of its registered voters**. |

---

## 4. Multi-Agent Implementation Workflow (2-Interaction Limit)

This minor update is executed by **3 specialized subagents** with a strict limit of two interactions per agent:

```
                      ┌───────────────────────────────────────────────┐
                      │              USER COORDINATOR                 │
                      └───────┬───────────────────────────────┬───────┘
                              │                               │
                      ┌───────┴───────┐               ┌───────┴───────┐
                      ▼                               ▼
              ┌───────────────┐               ┌───────────────┐
              │    AGENT 1    │               │    AGENT 2    │
              │ Quest Engine  │               │ Step 2 UI &   │
              │ & Data Schema │               │ Selection UX  │
              └───────┬───────┘               └───────┬───────┘
                      │                               │
                      └───────────────┬───────────────┘
                                      ▼
                              ┌───────────────┐
                              │    AGENT 3    │
                              │ Integration,  │
                              │ Test & Build  │
                              └───────────────┘
```

### Agent Prompts (Copy & Paste)

#### Agent 1: Quest Engine & 5 Additional Priorities Data Logic
```text
ROLE: Gameplay Engine Specialist
TASK: Implement the 3 Main Priorities and 5 Additional Priorities backend logic in engine.js and data.js based on PRIORITIES_REWORK_DESIGN.md.
INSTRUCTIONS:
1. Data Schema: Add the 26 Overall Priority Strategic Quests to data.js with eligibility check predicates, acceptance bonus effects, and completion reward evaluators.
2. State Structure: Update game.priorities to store:
   - `main`: Array of up to 3 selected quest IDs.
   - `additional`: Array of 5 slots, each containing { type: 'issue'|'state'|'region', targetId: string }.
3. Additional Priority Effects:
   - When an 'issue' priority is set, boost party base loyalty (+1.5 Supporter Trust).
   - When a 'state' priority is set, add 5,000 registered voters to game.voterModel in that state.
   - When a 'region' priority is set, add 500 registered voters to game.voterModel in every state in that region.
4. Quest Execution:
   - Apply acceptance bonuses immediately upon selecting a Main Priority (e.g. Fundraising increases current budget by 25% and completes immediately).
   - Evaluate quest goals upon election resolution. Award Member Happiness and specific quest rewards (e.g. 3/4th realignment for Win the White House, halving rival party registration for 300 seats / filibuster / impeachment).
5. When complete, reply stating: "AGENT 1 WORK COMPLETE: 3 Main Priorities and 5 Additional Priorities engine logic implemented. Ready for integration."
```

#### Agent 2: Step 2 UI & Two-Tier Selection UX
```text
ROLE: Frontend UI Specialist
TASK: Redesign Step 2 (Priorities) in app.js and styles.css according to PRIORITIES_REWORK_DESIGN.md.
INSTRUCTIONS:
1. Main Priorities Deck: Render 3 Main Priority Quest cards at the top of Step 2.
   - Clicking an empty slot opens the Quest Selection Modal, displaying all eligible quests from the 26-quest catalog.
   - Show trigger requirements, acceptance bonus, goal description, and difficulty badge.
2. Additional Priorities Deck: Render 5 separate Additional Priority slots below the main deck.
   - Each slot allows choosing between:
     - [Issue]: dropdown of national issues (displays note: "Increases party base loyalty").
     - [State]: dropdown of 50 states (displays note: "+5,000 registered voters in state").
     - [Region]: dropdown of recognized regions (displays note: "+500 registered voters per state in region").
3. Ensure selections save cleanly to game.priorities and update the UI reactively without requiring full tab reload.
4. When complete, reply stating: "AGENT 2 WORK COMPLETE: Step 2 Two-Tier Priorities UI implemented and tested. Ready for integration."
```

#### Agent 3: Integration, Test & Release Build
```text
ROLE: Integration & Release Engineer
TASK: Merge Agent 1 and Agent 2 work, run verification tests, and compile the minor release build.
INSTRUCTIONS:
1. Verify that game.priorities initializes properly and migrates smoothly from legacy saves.
2. Run a headless verification test checking:
   - 3 Main Priorities select eligible quests and apply acceptance bonuses.
   - 5 Additional Priorities award correct voter counts (+5k state, +500 regional per state) and base loyalty.
   - Fundraising quest immediately increases treasury by 25% and completes.
   - Election resolution properly checks quest completion and applies happiness rewards.
3. Run `./build.ps1` to compile the updated executable `dist/release/Coalition Builder - Party Chair.exe`.
4. When complete, reply stating: "AGENT 3 WORK COMPLETE: Priorities Rework integrated, verified, and executable compiled successfully."
```
