# Coalition Builder: Party Chair — Version 0.9 Master Build Specification
## Build Package: "The Complete Political Realignment & Coalition Grand Strategy Update"

**Document Version:** 0.9.0-SPEC  
**Date:** November 12, 2026  
**Status:** Approved for Implementation (All-Inclusive Backlog Build)  
**Reference Documents:** [`GAME_STYLE_GUIDE.md`](GAME_STYLE_GUIDE.md), [`DESIGN_BACKLOG.md`](DESIGN_BACKLOG.md), [`ART_STYLE.md`](ART_STYLE.md), [`VERSION_0.8_DESIGN.md`](VERSION_0.8_DESIGN.md)

---

## 1. Executive Summary & Build Scope

Per project owner direction, this build brings together **all pending features from the active design backlog** in a single, coordinated master release, **strictly excluding** the Long-Term Additions scheduled for Version 0.15 or later (`LTA-01`, `LTA-02`, `LTA-03`).

### Complete Feature Manifest (v0.9 Master Package)

| Tier | Req ID | Feature Title | Primary Agent | Key Architectural Component |
| :--- | :--- | :--- | :---: | :--- |
| **Large** | **REQ-18** | **Super PACs, Issue Demands & Pet-Issue Ad Spending** | Agent 2 & Agent 3 | 6–8 Issue Super PACs, PAC demands, pet-issue ad triage in 15-week campaign |
| **Large** | **REQ-30** | **Party Splits & Regional Splinter Factions** | Agent 2 & Agent 3 | Disgruntled high-Fame faction leaders bolting or launching regional spoiler tickets |
| **Medium** | **REQ-24** | **Demographic Voter Model, Editable Config & Swingy White Voters** | Agent 1 & Agent 2 | Census CVAP demographic breakdowns, White voter elasticity, editable config table |
| **Medium** | **REQ-35** | **Party Switching / "Crossing the Aisle"** | Agent 2 & Agent 3 | Low-happiness incumbents bolting; courting rival moderates with Opponent Trust |
| **Medium** | **REQ-36** | **Party-Specific Ideological & Rhetorical Factions (5 Dem / 5 GOP)** | Agent 1 & Agent 3 | 5 distinct Dem factions + 5 distinct GOP factions + suburban realignment hook |
| **Medium** | **REQ-44** | **Independent Category, Caucus Allegiance & Moderate Persuasion** | Agent 2 & Agent 3 | Distinct Independent identity, caucus allegiance tracking, outreach negotiation |
| **Medium** | **REQ-51** | **Unified Party Approval Tracker across All Parties** | Agent 2 & Agent 3 | Citizen trust weighted: 40% Generic Ballot, 20% Pres Approval, 40% Leader Popularity |
| **Medium** | **REQ-52** | **National Environment 20-Pt Scale (Wave @ 10, Landslide @ 20, Drift D+9 to D+14)** | Agent 2 & Agent 3 | Expanded 20-pt scale, wave/landslide labels, D+9 baseline and D+14 inaction drift |
| **Small** | **REQ-27** | **State Voter Registration & Demographic Outreach Drive** | Agent 2 & Agent 3 | Targeted state action permanently converting demographic/independents to members |
| **Small** | **REQ-45** | **Playable / AI Constitution Party (<0.2% Baseline, MAGA Appeal)** | Agent 1 & Agent 2 | 5th playable/AI party, $10M budget, Nationalist Populist appeal, <0.2% baseline |
| **Small** | **REQ-46** | **Playable / AI Socialist Party (<0.2% Baseline, Labor/Progressive Appeal)** | Agent 1 & Agent 2 | 6th playable/AI party, $10M budget, Labor/Progressive appeal, <0.2% baseline |
| **Small** | **REQ-47** | **Minor-Party Rivals & Counter-Growth Engine** | Agent 2 | Green ↔ Libertarian & Socialist ↔ Constitution symmetrical anti-establishment growth |
| **Small** | **REQ-49** | **Universal Senate Map (Split-State Dual-Senator Default Subtab)** | Agent 1 & Agent 3 | All 100 sitting senators, 50/50 two-tone split fill, default subtab, live 56-44 scoreboard |
| **Small** | **REQ-50** | **Leader Popularity, Fame & Net Approval Metric (`((2*Pop) - Fame)`)** | Agent 2 & Agent 3 | Net approval formula, decoupled popularity/fame, placed far-left on leader cards |
| **Small** | **REQ-53** | **Incumbent Governing Fatigue, Presidential Relief & 3–7% Rally Spike** | Agent 2 | White House governing wear; presidential cycle relief + 3–7% approval rally spike |
| **Small** | **REQ-54** | **Custom Party Starting Leader Archetypes** | Agent 1 & Agent 3 | 4 archetypes (Politician, Celebrity, Union, Business) with distinct trade-offs |
| **Tiny** | **REQ-55** | **Scale Down 'Open State Chapter' Button (75% Size)** | Agent 3 | Compact 75% display scale for state chapter button |
| **Runtime** | **REQ-56** | **Inter-Cycle Electorate Realignment (The 1/4th Rule)** | Active in Engine | Shift by 1/4th difference from non-independent expected vote; inter-cycle only |

---

## 2. Mandatory Studio Rules for All Agents

1. **Obscures Some Information & Atmospheric Vibes (`GAME_STYLE_GUIDE.md` §2):**
   - Strategic gameplay relies on reading political moods, regional instincts, and narrative vibes.
   - **Never** expose raw developer probability percentages (e.g. "80% chance") or internal calculation formulas to the player.
2. **Never Expose Internal Identifiers:**
   - **`REQ-XX` numbers must NEVER appear anywhere in game text, tooltips, or buttons.**
3. **155.00 Million Represented-Voter Scale:**
   - All voter metrics scale against 155.00M real represented voters (never expose the internal 1.55M sample count).
4. **Continuous Multi-Cycle Evolution:**
   - Parties maintain their current voting blocks between elections. Realignments occur **only between elections**.
5. **Executable Build Discipline:**
   - Binary output target is `./build.ps1` -> `dist/release/Coalition Builder - Party Chair.exe`.

---

## 3. Four-Agent Phased Architecture & Ownership

```
[Phase 1: Agent 1 - Data, Archetypes & Demographics]
 ├── demographic-config-0.9.js (Census CVAP, White voter elasticity, editable groups)
 ├── data.js (Constitution/Socialist archetypes, 5 Dem + 5 GOP factions, Starting Leaders)
 └── scenario-2028.js & maps-0.3.js (Universal Senate 100-seat baseline data)

[Phase 2: Agent 2 - Engine, Simulation & Super PACs]
 ├── engine.js (Super PACs pool & demands, Party Splits, Aisle Crossing, Independent Caucus,
 │              Unified Party Approval, 20-Pt Environment, Leader Net Approval, Counter-Growth)

[Phase 3: Agent 3 - UI, Maps & Player Controls]
 ├── app.js & styles.css (Universal Senate Map default subtab, Net Approval metrics,
 │                        Super PACs panel, 20-pt Environment gauge, 75% chapter button)

[Phase 4: Agent 4 - Integration, Save Migration & Release Build]
 ├── index.html, test suites, save migration (v9), and Windows .exe compile
```

---

## 4. Turnkey Copy-Paste Agent Prompts

The following prompts are designed for 1-click execution. Each agent completes its assigned files autonomously without requiring intermediate guidance, and notifies the user only when finished and ready for the integration agent.

---

### 📋 COPY-PASTE PROMPT: AGENT 1 (Data, Archetypes & Demographics)

```text
You are AGENT 1 (Data, Archetypes & Demographics) for Coalition Builder: Party Chair (v0.9 Master Build).
Your working directory is: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game
Read GAME_STYLE_GUIDE.md, ART_STYLE.md, and VERSION_0.9_DESIGN.md.

YOUR FILE OWNERSHIP:
1. Create `demographics-0.9.js`
2. Update `data.js`
3. Verify `scenario-2028.js` and `maps-0.3.js`

YOUR TASKS:
1. REQ-24 (Demographic Voter Config & Swingier White Voters):
   - Create `demographics-0.9.js` attached to `window.PartyChairData.DEMOGRAPHIC_CONFIG`.
   - Include Census CVAP demographic breakdowns for White (65%), Black (13%), Hispanic/Latino (14%), Asian (5%), Native American (1%), Multiracial (2%).
   - Configure White voters with a higher swing elasticity multiplier (1.45x) compared to baseline (1.0x).
   - Provide an editable baseline party affiliation share and issue priority table for each group.
2. REQ-45 & REQ-46 (Constitution & Socialist Parties):
   - In `data.js` -> `PARTY_ARCHETYPES`, add the Constitution Party (`id: 'constitution'`, color `#a84214`, startingBudget 10, baseShare 0.2, MAGA / Faith & Flag appeal) and the Socialist Party (`id: 'socialist'`, color `#d62828`, startingBudget 10, baseShare 0.2, Labor / Progressive appeal).
3. REQ-36 (Party-Specific Ideological & Rhetorical Factions):
   - In `data.js` -> replace generic factions with party-specific factions:
     - Democratic (5): Progressive Activists, Establishment Liberals, Labor & Industrial Populists, Community & Faith Pillar, Frontier & Suburban Moderates.
     - Republican (5): Nationalist Populists, Faith & Flag Conservatives, Market & Country-Club Conservatives, Liberty & Western Mavericks, Heartland Institutionalists.
     - Include full ideological pulls, descriptions, and rhetorical styles for each.
4. REQ-54 (Custom Party Starting Leader Archetypes):
   - In `data.js`, define `STARTING_LEADER_ARCHETYPES`: Former Politician, Celebrity, Union Organizer, Business Leader with their distinct upsides and downsides.
5. REQ-49 (Universal Senate Map Data Baseline):
   - Ensure all 100 sitting senators in `scenario-2028.js` and `maps-0.3.js` align with the exact 54 D + 2 Ind (Sanders, King) = 56 D caucus vs 44 R baseline, with Class I, II, and III states mapped correctly.

RULES:
- Never expose REQ numbers in game copy.
- Do not edit files outside your ownership.
- When finished, output: "AGENT 1 IS COMPLETE AND READY FOR THE INTEGRATION AGENT."
```

---

### 📋 COPY-PASTE PROMPT: AGENT 2 (Engine, Simulation & Super PACs)

```text
You are AGENT 2 (Engine, Simulation & Super PACs) for Coalition Builder: Party Chair (v0.9 Master Build).
Your working directory is: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game
Read GAME_STYLE_GUIDE.md, ART_STYLE.md, and VERSION_0.9_DESIGN.md.

YOUR FILE OWNERSHIP:
- `engine.js` (and auxiliary simulation modules)

YOUR TASKS:
1. REQ-18 (Super PACs, Issue Demands & Pet-Issue Ad Spending):
   - Implement 6–8 active Super PACs (e.g. Energy Independence PAC, Workers First PAC, American Freedom Fund, Green Future Action, Constitutional Defense Fund, Healthcare Access Project).
   - Track Super PAC funds in a separate pool from party treasury.
   - PACs issue demands (stance shift or priority inclusion) affecting their ad contribution pool.
   - PAC funds can ONLY buy ads for their pet issue in assigned races during the 15-week campaign.
2. REQ-30 & REQ-35 (Party Splits, Splinters & Aisle-Crossing):
   - Factions staying below 35 happiness with high-Fame leaders threaten to bolt or launch regional spoiler runs.
   - Miserable sitting incumbents (<30 happiness) in unfavorable states can switch parties or become Independents.
   - High Opponent Party Member Trust allows courting alienated rival moderates.
3. REQ-44 (Independent Caucus Allegiance & Moderate Persuasion):
   - Separate party label (`independent`) from caucus allegiance (`people` / `heritage` / `unaligned`).
   - Implement action `persuade-independent-caucus` using Independent Trust, issue proximity, and concessions.
4. REQ-47 (Minor-Party Counter-Growth):
   - Symmetrically grow rival minor parties: Green ↔ Libertarian, Socialist ↔ Constitution.
5. REQ-50 (Leader Popularity, Fame & Net Approval):
   - Compute leader Net Approval: `((2 * Popularity) - Fame)`.
6. REQ-51 (Unified Party Approval Tracker):
   - Compute public approval for all parties: `Generic Ballot (40%) + Presidential Approval (20%) + Party Leader Popularity (40%)`.
7. REQ-52 (20-Point National Environment & Inaction Drift):
   - Scale environment to +/-20. Label +/-10 as "Wave" and +/-20 as "Landslide".
   - Calibrate 2028 starting baseline to D+9; apply drift toward D+14 by campaign start if no counter-actions are taken.
8. REQ-53 (Incumbent Governing Fatigue & Rally Spike):
   - Apply White House fatigue penalties to the incumbent party; soften during presidential cycles alongside a 3–7% presidential approval rally spike.
9. REQ-27 (State Voter Registration & Outreach Action):
   - Implement `voter-registration-drive` action targeting demographic groups or Independents.

RULES:
- Preserve "obscures some information": qualitative narrative vibes over transparent math formulas.
- Never expose REQ numbers.
- When finished, output: "AGENT 2 IS COMPLETE AND READY FOR THE INTEGRATION AGENT."
```

---

### 📋 COPY-PASTE PROMPT: AGENT 3 (UI, Maps & Player Controls)

```text
You are AGENT 3 (UI, Maps & Player Controls) for Coalition Builder: Party Chair (v0.9 Master Build).
Your working directory is: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game
Read GAME_STYLE_GUIDE.md, ART_STYLE.md, and VERSION_0.9_DESIGN.md.

YOUR FILE OWNERSHIP:
- `app.js`
- `styles.css`

YOUR TASKS:
1. REQ-49 (Universal Senate Map — Default Subtab & Split States):
   - Make "Universal Senate (All 100 Seats)" the default active subtab in the Senate Map view.
   - Render split-party states in two-tone 50/50 split fills (e.g. Dem Blue / GOP Red diagonal SVG pattern; aquamarine `#1abc9c` for Sanders/King in VT/ME).
   - Display dynamic chamber scoreboard (56 D Caucus [54 D + 2 I] vs. 44 R + VP tiebreaker badge).
2. REQ-50 (Net Approval Display):
   - In leader cards, place Net Approval all the way to the left of Popularity and Fame, formatted clearly with net approval color coding.
3. REQ-51 & REQ-52 (Unified Party Approval & 20-Pt Environment Gauge):
   - Render the Unified Party Approval Tracker showing public trust for all parties.
   - Update the National Environment gauge to 20 points, displaying "Wave" at 10 and "Landslide" at 20.
4. REQ-18 (Super PAC Interface):
   - Add a Super PAC panel showing the 6–8 PACs, pet issues, pending demands, and ad allocation controls during campaign weeks.
5. REQ-36 (Party-Specific Factions UI):
   - Render the 5 party-specific factions with ideological icons and rhetorical quotes.
6. REQ-44 (Independent Caucus & Negotiation UI):
   - Display distinct Independent visual styling and the "Court Independent to Caucus" action card.
7. REQ-54 (Custom Party Starting Leader Archetypes UI):
   - In the custom party setup screen, provide archetype selection: Former Politician, Celebrity, Union Organizer, Business Leader.
8. REQ-55 (75% Chapter Button):
   - Shrink the 'Open State Chapter' button inside the Step 4 card to 75% size.
9. REQ-27 (Demographic Registration Action UI):
   - Add demographic outreach controls in Step 4.

RULES:
- Follow ART_STYLE.md and GAME_STYLE_GUIDE.md color palettes and typography.
- Never expose REQ numbers.
- When finished, output: "AGENT 3 IS COMPLETE AND READY FOR THE INTEGRATION AGENT."
```

---

### 📋 COPY-PASTE PROMPT: AGENT 4 (Integration, Validation & Release Build)

```text
You are AGENT 4 (Integration, Validation & Release Build) for Coalition Builder: Party Chair (v0.9 Master Build).
Your working directory is: c:\Users\rober\.gemini\antigravity\scratch\party-chair-game
Read GAME_STYLE_GUIDE.md, ART_STYLE.md, and VERSION_0.9_DESIGN.md.

YOUR FILE OWNERSHIP:
- `index.html`
- Save migration / hydration contracts
- Verification test scripts & release compilation (`./build.ps1`)

YOUR TASKS:
1. Script Wiring:
   - Wire `demographics-0.9.js` into `index.html` in proper dependency order ahead of `engine.js` and `app.js`.
2. Save Migration & Hydration:
   - Update save key to `partyChairGame.save.v9`, ensuring graceful migration from v8/v7/legacy saves.
3. Automated Integration Verification:
   - Create a headless Node test verifying:
     - All scripts load without syntax errors.
     - Universal Senate Map default state renders 56 D vs 44 R + VP tiebreaker.
     - Super PAC ad spending and demands function in campaign turns.
     - Faction bolting, party switching, and Independent caucus mechanics resolve properly.
     - Leader Net Approval, Party Approval, and 20-point National Environment calculate correctly.
     - Continuous Electorate 1/4th realignment rule works across cycle transitions.
     - 75% Chapter button and split third-party electorate metrics render properly.
4. Windows Release Compilation:
   - Execute `./build.ps1` to compile `dist/release/Coalition Builder - Party Chair.exe`.
   - Verify the executable launches and bundles all assets.
5. Documentation & Release Audit:
   - Log release status in `VERSION_0.9.md` and mark completed items in `DESIGN_BACKLOG.md`.

RULES:
- When finished, output: "AGENT 4 HAS COMPLETED INTEGRATION AND THE V0.9 RELEASE BUILD IS READY."
```
