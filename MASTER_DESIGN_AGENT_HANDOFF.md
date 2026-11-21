# Coalition Builder: Party Chair — Master Design Agent Handoff Document
**The Complete Systems, Mechanics, Numbers, Backlog, Style & Operational Rulebook**
*Authoritative Developer & Architecture Specification for External Design Agents*

> **Document Type:** Master Architectural Handoff & Complete Systems Specification  
> **Target Audience:** Incoming Design Agents, Architecture Planners, and System Authors  
> **Codebase Version at Handoff:** Version `0.16.0` (Landmark Build: The Party Systems Evolution Engine)  
> **Next Target Milestone:** Version `0.16.1` (Presidential Primaries, Ballot Access, Uncertainty & Election Night Broadcast Desk)  
> **Total Represented Voters Scale:** Exactly **155,000,000** US voters across 51 jurisdictions (50 States + DC)  
> **Core Directive:** This document is **100% self-contained**. The incoming AI does not have direct access to game code, so every single mechanic, individual number, formula, threshold, constant, data schema, style rule, owner instruction, and past design reference is documented here in exhaustive detail.

---


# 1. What the Game Is & Core Gameplay Identity


## 1.1 Executive Summary & Lineage

**Coalition Builder: Party Chair** is a macro grand-strategy political simulation game developed as an offshoot of *Battle For America (BFA)* by Google Deepmind agents and the AI Games Studio. While Battle For America models high-level state-by-state electoral battlegrounds and downballot coattail interactions, *Coalition Builder: Party Chair* shifts the player's perspective to the executive leadership of an entire national political organization.

Rather than roleplaying an individual candidate giving stump speeches, shaking hands in diners, or debating on television, the player acts as the **National Party Chair** (e.g., Chair of the Democratic National Committee, Republican National Committee, Libertarian National Committee, Green National Committee, or a bespoke custom party). The Chair oversees a multi-decade institutional empire spanning thousands of candidates, hundreds of millions of dollars, tens of millions of registered voters, 800 local party chapters, internal factional treaties, legislative slates, and constitutional realignments across American political history.

## 1.2 High-Level Concept & The Chair Perspective

The core premise of the game is **institutional stewardship across time** (from 2028 through 2060 and beyond). Key chair responsibilities include:
1. **Treasury & Budget Triage:** Allocating national committee warchests ($150M+ for major parties) across candidate recruitment, campaign advertising, volunteer field infrastructure, voter registration drives, Super PAC diplomacy, and legal defense.
2. **Platform & Ideology Evolution:** Steering the national party platform across 10 core ideological pillars and 40/41 discrete policy issues with 1–10 sliders, balancing public salience against internal factional backlash.
3. **Candidate Recruitment, Vetting & Primary Management:** Sponsoring candidate recruits from state pools, vetting candidates to uncover hidden vulnerability scores, and deciding whether to maintain institutional neutrality or deploy party endorsements in fiercely contested multi-candidate primary fields.
4. **Internal Factions & Coalition Diplomacy:** Managing a delicate coalition of internal factions (e.g., Progressivism vs. Liberal Establishment vs. Blue Dogs for Democrats; MAGA vs. Faith & Flag vs. Moderates for Republicans). Factions maintain continuous Happiness and Confidence meters. Neglecting a faction produces cohabitation drag, volunteer decay, primary challenges, and eventual **bolting**, where an aggrieved faction splinters into an independent party.
5. **Multi-Chamber Electoral Competition:** Simultaneously contesting elections across five distinct constitutional levels of American governance:
   - **The Presidency:** 538 Electoral College votes, 270 to win.
   - **The U.S. Senate:** 100 seats across three rotating, staggered constitutional classes.
   - **The U.S. House of Representatives:** 435 single-member districts modeled on authentic localized baselines (Cook PVI / pure district leans).
   - **Governorships:** 50 state executive offices on staggered 4-year cycles.
   - **State Legislative Chambers:** 98 partisan chambers in 49 states (Nebraska is nonpartisan unicameral), modeling trifecta governance and 5,462 lower-house seats.
6. **Macro Historical Evolution (Party Systems):** Playthroughs do not repeat the same static landscape decade after decade. The game models historical and emergent realignments through the **Party Systems Engine**, transitioning from the current 7th Party System (Modern Populist Era) into an 8th Party System (2040+) and 9th+ Party Systems, introducing new ideological eras, issue swaps, third-party ascents, independent presidencies, and synthetic suffrage.

## 1.3 The 2-Year Recurring Cycle Loop

The game progresses in continuous 2-year election cycles, alternating strictly between **Presidential Election Years** (2028, 2032, 2036, etc.) and **Midterm Election Years** (2030, 2034, 2038, etc.). Every 2-year cycle flows through four distinct sequential operational phases:

```text
[ Phase 1: Machine Operations, Recruitment & Platform Setting ]
                          │
                          ▼
[ Phase 2: Party Primaries & Candidate Filtering ]
                          │
                          ▼
[ Phase 3: The General Campaign Command Phase ]
                          │
                          ▼
[ Phase 4: Election Night, Decision Desk & Inter-Cycle Realignment ]
                          │
                          ▼
               (Advances to Next Cycle Phase 1)
```

1. **Phase 1: Machine Operations, Recruitment & Platform Setting (20 Turns):**
   - The Chair receives 4 leadership actions per year/turn to recruit prospective candidates, adjust the national platform, select signature party priorities, deploy party leaders on state organizing tours, court sitting lawmakers to defect, convene faction summits, and expand local chapters.
2. **Phase 2: Party Primaries & Candidate Filtering:**
   - Contested primary fields generate across all open and target seats. In presidential election cycles (2032+), the full Presidential Primary Calendar activates (Early States $\to$ Super Tuesday $\to$ Conventions). The Chair deploys endorsements, manages candidate filtering, or preserves neutrality.
3. **Phase 3: The General Campaign Command Phase (Weekly Turn Loop):**
   - A high-stakes, 4- to 5-week strategic campaign loop (Weeks 1–15 of the campaign calendar). The Chair deploys treasury funds into candidate triage, media market ads, volunteer GOTV drives, opposition research, ballot measures, and late-cycle October Surprise crisis mitigation.
4. **Phase 4: Election Night Resolution, Decision Desk & Inter-Cycle Realignment:**
   - An immersive, real-time Decision Desk broadcast simulates poll closings from 7:00 PM to 4:00 AM ET across 51 jurisdictions with dynamic speed controls and Gaussian ballot drops.
   - Upon election certification, inter-cycle realignment executes via the **1/4th Shift Rule**, shifting permanent registered voting blocks between parties based on popular vote over/underperformance relative to non-independent expectations.
   - Politician aging (+2 years), retirements, Senate class rotations, and trifecta policy enactments execute before advancing to the next cycle.

## 1.4 Ironclad Invariants & Philosophical Rules

The incoming Design Agent must strictly adhere to four fundamental design invariants:
1. **The 155 Million Represented-Voter Scale:**
   - Every voter, membership metric, and faction total in the game represents **155 million actual US voters**. Internally, the engine tracks 1.55 million records where each record represents 100 actual voters.
   - **Strict Rule:** Never mention or display the "1.55" internal abstraction in game-facing UI or player text. All displays must use real-world scale (e.g. "84.2 Million Members", "+150,000 Voters").
2. **Atmospheric Vibes & Obscuring Information (`GAME_STYLE_GUIDE.md` Rule 7):**
   - Coalition Builder: Party Chair deliberately **obscures raw mathematical formulas** from the player. Do not display meta-design explanations, developer rationale, or naked probabilities (e.g., avoid "80% chance of passing" or "vulnerabilityScore = 78").
   - Present qualitative atmospheric "vibes" describing potential benefits and risks (e.g., *"Suburban Whispers"*, *"High Scandal Exposure"*, *"Battleground Margin of Error"*, *"Grassroots Fervor"*). Strategic play requires reading political moods rather than spreadsheet optimization.
3. **Zero In-Game Requirement Identifiers (`REQ-XX` Rule):**
   - Requirement IDs (`REQ-12`, `REQ-195`, `MAS-01`, `TBD-04`) exist solely for design documents, code comments, and backlog tracking.
   - **Strict Rule:** Requirement tags must NEVER appear in player-facing UI, button labels, modal headers, or tooltips.
4. **Continuous Multi-Decade Evolution (Never Static):**
   - The game is designed as a continuous, evolving political timeline. Baseline voting blocks do NOT reset to factory defaults between elections. Realignments carry forward permanently, enabling third parties to rise, major parties to collapse, and political coalitions to transform over decades.
# 2. Comprehensive Systems & Mechanics Guide (With All Individual Numbers & Formulas)

> **CRITICAL CONTEXT FOR THE INCOMING AI:**
> Because you will not have direct access to `engine.js`, `data.js`, or the underlying codebase files, this section provides an exhaustive, granular inventory of every mechanic, constant, formula, threshold, coefficient, and data structure in the simulation. Every number listed here is authoritative.


## 2.1 Operational Cycle & Turn Structure Numbers

| Parameter | Exact Value | Operational Scope & Rule |
| :--- | :---: | :--- |
| **Cycle Length** | `2 Years` | Playthroughs advance in 2-year steps (2028, 2030, 2032, 2034, etc.). |
| **Cycle Type Alternation** | `Presidential` $\leftrightarrow$ `Midterm` | 2028 is Presidential; 2030 is Midterm; 2032 is Presidential; 2034 is Midterm, etc. |
| **Phase 1: Organizing Turns** | `20 Turns` | Runs before primaries resolve. Each turn represents approximately 1 month of off-season machine building. |
| **Actions Per Turn / Year** | `4 Actions` | The Chair has 4 primary leadership action points per turn to spend on party machine operations. |
| **Endorsements Per Turn** | `5 Max` | The Chair may endorse up to 5 candidates per turn across all active primary contests. |
| **Phase 3: General Campaign Turns** | `4 to 5 Weeks` | Weekly decision turns during the active general election campaign (Weeks 1 to 15 of campaign calendar). |
| **Weekly Campaign Actions** | `5 Actions` | Each campaign week grants 5 tactical actions (candidate funding, ad buys, field drives, oppo, ballot measures). |
| **Campaign Calendar Weeks** | `15 Weeks` | Weeks 1–12 and 14–15 are standard campaign weeks; **Week 13 is strictly reserved for the October Surprise crisis**. |
| **Represented Voter Multiplier** | `100x` | 1 internal sample record represents exactly 100 real voters; 1.55M internal units = **155,000,000 represented voters**. |

## 2.2 Financial Engine & Treasury Dynamics


### 2.2.1 Starting Committee Budgets by Party

- **Democratic Party (`people`):** `$150M` starting treasury (major party national committee warchest).
- **Republican Party (`heritage`):** `$150M` starting treasury (major party national committee warchest).
- **Libertarian Party (`liberty`):** `$10M` starting treasury (minor party baseline).
- **Green Party (`green`):** `$10M` starting treasury (minor party baseline).
- **Constitution Party (`constitution`):** `$10M` starting treasury (minor party baseline).
- **Socialist Party (`socialist`):** `$10M` starting treasury (minor party baseline).
- **Custom Party:** `$150M` base starting budget, modified by chosen Party Founder archetype (e.g., *Self-Funded Tycoon* grants `+$50M`, *Grassroots Firebrand* starts with `-$50M`).

### 2.2.2 Core Operational Cost Formulas

1. **Candidate Recruitment Cost Formula:**
   $$\text{Cost} = \$2\text{M} + (\text{Candidate Quality}) \text{ Million Dollars}$$
   - *Example:* Encouraging a Quality 3 recruit costs `2 + 3 = $5M`. Encouraging a Quality 9 recruit costs `2 + 9 = $11M`.
   - *Action Cost:* Consumes 1 Leadership Action.
   - *Losing Recruit Penalty:* If an encouraged recruit loses their primary, their ideological wing suffers a **`-2.5` confidence penalty**, and that recruit is permanently removed from future availability.
2. **Field Office & Volunteer Deployment Cost:**
   - **Cost:** `$\$2\text{M}$` per deployment.
   - **Effect:** Adds `+2.5` percentage points of statewide general campaign support.
   - **Cap:** Maximum of **3 deployments per state** (capped at `+$7.5` points total for `$6M`).
3. **Candidate Funding Triage & Diminishing Returns Curve:**
   - Treasury reserves injected directly into battleground nominees (Senate, House, Governor).
   - Operates on a non-linear logarithmic return curve:
     $$\text{Polling Lift} = \alpha \cdot \ln\left(1 + \frac{\text{Funding in Millions}}{\text{Battleground Cost Baseline}}\right)$$
   - *Diminishing Returns Principle:* The first `$2M–$5M` injected into a competitive race yields substantial polling momentum (+1.5% to +3.0%). Injections beyond `$10M` produce sharp diminishing returns (+0.2% per additional `$5M`), compelling the Chair to practice strategic triage rather than flooding one race.
4. **Commissioned Internal Polls Cost:**
   - **Statewide Scientific Survey:** `$\$1\text{M}$` per poll. Unmasks actual hidden vote margins in the target race with high recency weighting in consensus forecasters.
   - **Multi-State Regional Poll:** `$\$3\text{M}$` per regional wave.
5. **Petition Drive Cost (Ballot Access):**
   - `$\$3\text{M}$` per statewide signature collection wave (`REQ-207`), adding `+35%` toward statutory qualification.

### 2.2.3 Outside Spending & Super PAC Architecture

- **Autonomous Super PACs:** Independent expenditure committees aligned with specific party wings or donor coalitions.
- **Major Donor Tiers:**
  - *Tier 1 (Fledgling):* Warchests of `$2M–$5M`, deploying sporadic digital ads.
  - *Tier 2 (Established):* Warchests of `$8M–$15M`, providing air cover in 2–3 battlegrounds.
  - *Tier 3 (Institutional Heavyweight):* Warchests of `$20M–$40M`, running sustained TV blitzes.
  - *Tier 4 (Mega-PAC / Super PAC Empire):* Warchests of `$\$50M+$` unlocked via Party Systems or major donor alignment.
- **Issue-Ad Efficiency Bonus:** High faction happiness unlocks `+10%` to `+20%` Super PAC ad efficiency.

## 2.3 The 10 Platform Pillars & 40/41-Issue Platform

The national policy platform is organized across **10 fundamental pillars**, populated by **40 baseline issues** (clamped at exactly **41 active issues** in Party Systems):

| Pillar ID | Pillar Name | Number | Endpoint Direction (1 $\to$ 10) | Defaults (Dem / GOP / Lib / Grn) |
| :--- | :--- | :---: | :--- | :---: |
| `tax-economy` | Tax & Economic Policy | 1 | High Progressive Revenue (1) $\to$ Free-Market / Low Tax (10) | `3.0 / 8.0 / 9.8 / 1.2` |
| `foreign-policy` | Foreign Policy | 2 | Anti-Imperialism / Diplomacy (1) $\to$ Peace Through Strength (10) | `3.5 / 7.5 / 1.5 / 1.5` |
| `climate-policy` | Climate Policy | 3 | Immediate Green Mandates (1) $\to$ Fossil Abundance / Market (10) | `2.0 / 8.5 / 6.0 / 1.0` |
| `religious-policy` | Religious Policy | 4 | Strict Secular Separation (1) $\to$ Traditional Faith & Flag (10) | `3.0 / 8.5 / 3.0 / 2.0` |
| `social-services` | Social Services Policy | 5 | Universal Public Welfare (1) $\to$ Private Responsibility / Vouchers (10) | `2.5 / 8.0 / 9.5 / 1.5` |
| `social-justice` | Social Justice | 6 | Structural Equity & Reform (1) $\to$ Traditional Culture & Order (10) | `2.5 / 8.5 / 4.0 / 1.5` |
| `party-structure` | Party Structure | 7 | Grassroots Movement Direct Democracy (1) $\to$ Strong Central Party Machine (10) | `4.5 / 6.5 / 2.0 / 2.0` |
| `party-ideology` | Party Ideology | 8 | Pragmatic Big-Tent Compromise (1) $\to$ Ideological Purity & Dogma (10) | `4.0 / 7.0 / 8.5 / 8.0` |
| `democracy-policy` | Democracy Policy | 9 | Universal Ballot Access & Proportional (1) $\to$ Strict Election Security & FPTP (10) | `2.0 / 8.5 / 3.0 / 1.5` |
| `establishment-stance` | Establishment Stance | 10 | Anti-Establishment Populist Outsider (1) $\to$ Institutional Stability & Consensus (10) | `6.0 / 4.0 / 1.5 / 2.0` |

### 2.3.1 Ideological Distance & Platform Shifting Math
1. **Euclidean Ideological Distance Formula:**
   $$\text{Distance} = \sqrt{(\text{Econ}_{A} - \text{Econ}_{B})^2 + (\text{Soc}_{A} - \text{Soc}_{B})^2}$$
   - Used to determine faction compatibility, cross-party courting viability, defection thresholds, and swing voter appeal.
2. **Platform Modification Action:**
   - Moving an issue slider consumes **1 Leadership Action** and shifts the underlying party ideological axis by `$\pm 0.1$` to `$\pm 0.25$`.
   - Immediate Faction Reaction: Factions whose pet issue is advanced gain `+4` to `+8` Happiness; opposing factions suffer `-3` to `-6` Happiness.
3. **The 3 Signature Priorities (`REQ-03` / `REQ-230`):**
   - Selecting 3 signature priorities elevates voter salience for those topics, grants `+10%` Super PAC ad efficiency on aligned issues, and focuses party messaging.

## 2.4 Universal Politician Lifecycle Engine


### 2.4.1 The Universal Politician Invariant

Across the entire simulation, every political figure—bench recruits, primary contenders, general election nominees, sitting legislators, governors, and party chairs—is modeled through a single unified **Politician** object schema:

```typescript
interface Politician {
  id: string;                     // e.g. "pol_jon_ossoff", "pol_jd_vance"
  name: string;                   // Clean display name (e.g. "Jon Ossoff")
  party: string;                  // "people", "heritage", "liberty", "green", "player", "independent"
  faction: string;                // e.g. "dem_liberal_establishment", "gop_maga"
  office?: 'president' | 'senate' | 'house' | 'governor' | 'stateLeg';
  chamber?: 'senate' | 'house';
  stateId?: string;               // 2-letter postal code (e.g. "GA", "OH")
  districtId?: string;            // e.g. "GA-06"
  senateClass?: 1 | 2 | 3;
  age: number;                    // Increments by 2 each cycle
  fame: number;                   // 1 to 100 scale
  popularity: number;             // 1 to 100 effective popularity (scaled by fame)
  rawPopularity: number;          // 1 to 100 raw approval rating
  quality: number;                // 1 to 10 candidate quality rating (average of skill ratings)
  ratings: Record<string, number>;// 8-10 distinct skill scores (1 to 10)
  traits: string[];               // 1 to 3 archetypal trait tags
  happiness: number;              // 0 to 100 personal satisfaction meter
  vulnerability?: number;         // Hidden 0 to 100 scandal/opposition risk score
  isIncumbent: boolean;
  leadershipRole?: string;        // Appointed party leadership title (or null)
}
```


### 2.4.2 Politician Skill Ratings (1 to 10 Scale)

Candidate quality is computed as the integer average of positive skill ratings:
- `persuade`: Ability to win over independent swing voters.
- `turnout`: Ability to mobilize the party base and drive turnout.
- `debate`: Performance in televised debates and candidate forums.
- `charisma`: Personal charm, rally crowd connection, and speech delivery.
- `policyKnowledge`: Grasp of legislative details and substantive interviews.
- `mediaSavvy`: Television presence, interview agility, and soundbite generation.
- `fundraising`: Small-dollar and high-dollar donor warchest generation.
- `regionalStrength`: Home-state and regional affinity multiplier.

### 2.4.3 The 8 Canonical Politician Traits

| Trait Name | Catalog Distribution (~605 Politicians) | Core In-Game Effect & Aesthetic Profile |
| :--- | :---: | :--- |
| **Rising Star** | `33 (5.5%)` | Under 60 years old. Gains fame +50% faster, generates higher youth turnout, attractive for VP ticket. |
| **Established politician** | `188 (31.1%)` | High institutional tenure. Resilient against minor scandals; demands party leadership appointment. |
| **Corrupt** | `83 (13.7%)` | High vulnerability score (`65–95`). Vulnerable to oppo research; severe scandal explosion risk. |
| **Squeaky Clean** | `173 (28.6%)` | Low vulnerability (`<25`). Immune to oppo hits; +5% independent swing voter trust. |
| **Polished** | `198 (32.7%)` | Teleprompter-adept, slick debater. +2.0% debate margin lift; rare unforced errors. |
| **Rough** | `213 (35.2%)` | Plain-spoken blue-collar populist. +4% working-class base enthusiasm; higher gaffe variance. |
| **Disciplined** | `150 (24.8%)` | Strict on-message regular. Lowers campaign ad volatility; high party-line legislative loyalty. |
| **Undisciplined** | `51 (8.4%)` | Prone to hot-mic gaffes and rogue tweets. Triggers unexpected mid-campaign damage-control crises. |

### 2.4.4 Aging, Retirement & The Council of Elders

- **Aging Invariant:** Every politician ages **+2 years** at the conclusion of each election cycle.
- **Retirement Rolls:** Starting at **age 68**, lawmakers face probabilistic retirement checks each cycle:
  - *Age 68–71:* ~10% retirement probability per cycle.
  - *Age 72–75:* ~25% retirement probability per cycle.
  - *Age 76+:* ~50% retirement probability per cycle.
- **Leadership Shield:** Appointed Party Leaders (Floor Leaders, Whips, National Chairs) receive a `+10 Year` retirement deferral shield.
- **Council of Party Elders:** Retired senior statesmen transition into the advisory Council of Party Elders, providing institutional pedigree.

### 2.4.5 Cross-Party Courting & Defection Invariants

Party Chairs can court sitting lawmakers from rival parties:
1. **Discontent Gate:** The targeted lawmaker's personal happiness must be **`<= 40` (severe discontent)**. Content lawmakers categorically refuse.
2. **Ideological Proximity:** The player's party must contain an internal faction within **`<= 2.0` Euclidean distance**.
3. **Party Tier Demands:** Major parties (`people`, `heritage`) succeed immediately upon courting. Minor or third parties must concede an **Appointed Leadership Role** to close the defection.
4. **Faction Synchronization Invariant:** At each phase transition, a sweep reconciles all politicians: if a politician's faction is affiliated with a recognized party, their party affiliation synchronizes; if independent/bolted, they become an Independent.

## 2.5 Candidate Recruitment, Vetting & Primaries Engine


### 2.5.1 Recruitment Pools & Endorsements

- **Recruitment Pools:** Every state maintains a pool of potential primary prospects with Quality ranging from `1` to `10`.
- **Recruitment Cost:** `$\$2\text{M} + (\text{Quality}) \text{ Million Dollars}$` and 1 Leadership Action.
- **Failed Recruit Shock:** If a recruit loses their primary, their ideological wing loses `-2.5` confidence, and that candidate is permanently barred from future recruitment.
- **Chair Primary Endorsements:**
  - Max **5 endorsements per turn** during Phase 1 & 2.
  - **Effect:** Boosts endorsed candidate win probability by `+35%` and raises their personal happiness by `+15`.
  - **Backlash:** Competing primary contenders and their affiliated factions suffer a **`-8` Happiness penalty** for establishment favoritism.
  - **Incumbent Primary Endorsement Rule:** Endorsing a primary challenger against a sitting incumbent triggers a massive **`-20` Sitting Member Happiness shock** and damages party loyalty.

### 2.5.2 Hidden Candidate Vulnerability & Vetting Action (`REQ-212`)

- **Hidden Vulnerability Score:** Every candidate possesses a hidden vulnerability score (`0–100`):
  - *Low (0–25):* Clean record, immune to opposition research.
  - *Moderate (26–50):* Minor gaffes, manageable blowback.
  - *Elevated (51–75):* Substantial opposition research targets; +25% scandal risk.
  - *Severe (76–100):* Extreme ethical or personal liability; ticking scandal timebomb.
- **"Vet Candidate" Action:** Costs **1 Action + $1M**. Unmasks the candidate's vulnerability tier to the Chair.

### 2.5.3 Mid-Campaign Scandals: Abandon vs. Defend Dilemma (`REQ-213`)

When an opposition research hit or media investigation breaks in Phase 3, the Chair faces an immediate choice:
1. **Abandon Nominee:** Cuts all party funding and publicly distances leadership. Inflicts `-10` candidate popularity and `-5` faction happiness, but preserves the national party brand and independent trust.
2. **Defend Nominee:** Deploys a **`$3M` crisis management warchest**. Grants `+8` faction loyalty for standing by their ally, but inflicts a **`-2.5%` drag among statewide independent swing voters**.

### 2.5.4 Presidential Primaries & Convention System (2032+ / `REQ-195`–`REQ-203`)

> **2028 Opening Preservation:** The 2028 scenario uses fixed tickets (**Jon Ossoff** for Democrats; **J. D. Vance** for Republicans) per `GAME_STYLE_GUIDE.md` Rule 5. The full Presidential Primary Calendar unlocks in **2032 and all subsequent presidential election cycles**.

- **Delegates to Clinch:** **`2,000 Delegates`** required to win the presidential nomination.
- **Incumbent Vulnerability Trigger:** Triggers if incumbent President's approval is `< 40%`, national environment penalty $\ge +8.0$ for opposition, or base faction happiness $< 35$. Spawns a high-Fame primary challenger.
- **Step-Aside Decision:** If approval drops below `< 32%`, the incumbent can voluntarily step aside, avoiding party civil war and cutting governing fatigue by `60%`.
- **Bruised Incumbent Penalty:** If the incumbent is challenged and wins, they enter the general election carrying a **`-3.5%` margin penalty** and `-$12M` defense expenditure.
- **Three-Wave Primary Calendar:**
  - *Wave 1: Early States (IA, NH, NV, SC):* Winner receives a `+4.0%` national momentum bounce.
  - *Wave 2: Super Tuesday (~15 States):* Allocates ~40% of total national delegates.
  - *Wave 3: Late Consolidation (PA, OH, FL, NY, WI, MI, GA):* Candidates with `< 12%` delegates drop out and endorse ideologically closest rivals (transferring 65% momentum).
- **National Nominating Convention:**
  - *Platform Floor Votes:* Two interactive platform amendment votes where rival wings clash. Chair vote shifts platform slider $\pm 1.0$ point (`+7` winning faction happiness, `-4` losing faction happiness).
  - *Running Mate (VP) Selection:* Choose VP from 4 qualified politicians (`+4.0%` home state, `+1.5%` regional lift; selecting runner-up faction heals bruised incumbent penalty and awards `+12` Happiness).
  - *Brokered Convention:* If no candidate clears 2,000 delegates on Ballot 1, multi-ballot brokering unlocks (negotiate VP offers, Cabinet posts, or platform planks to clinch 2,000 delegates on Ballot 2 or 3).

## 2.6 Multi-Chamber Electoral Simulation Architecture

The simulation models 5 distinct constitutional tiers of American governance simultaneously:

### 2.6.1 The Presidency & Electoral College
- **538 Total Electoral Votes** across 50 States + DC. **270 to win**.
- Winner-take-all state allocation (with Maine/Nebraska district modeling).
- State margins driven by baseline partisan lean, macroeconomic climate, candidate quality, home-state/regional ticket bonuses, demographic elasticity, and campaign ad saturation.

### 2.6.2 The U.S. Senate (100 Seats across 3 Staggered Classes)
- **Class I (33 Seats):** Elected in 2024, 2030, 2036, etc.
- **Class II (33 Seats):** Elected in 2026, 2032, 2038, etc.
- **Class III (34 Seats):** Elected in 2028, 2034, 2040, etc. (Includes Ohio special election in 2028 for J. D. Vance's vacated seat).
- Only the active constitutional class appears on the ballot; the other two classes remain fixed.
- Senate outcomes depend on statewide baseline partisanship, candidate quality differentials, national environment wave coattails (55%), targeted candidate funding triage, and localized ad spending.

### 2.6.3 The U.S. House of Representatives (435 Districts)
- All **435 seats contested every cycle**.
- **Pure District Decoupling:** Districts operate on localized baseline partisan leans (Cook PVI / district leans) rather than generic state presidential leans.
- Modeled through district-level baselines, candidate quality comparisons, national wave elasticity, and district-targeted candidate funding.

### 2.6.4 Gubernatorial Contests (50 States)
- **Staggered 4-Year Terms:**
  - **36 States** elect governors in Midterm cycles (2030, 2034, etc.).
  - **11 States** elect governors in Presidential cycles (2028, 2032, etc.: DE, IN, MO, MT, NC, ND, NH, UT, VT, WA, WV).
  - **2 Biennial States:** New Hampshire (NH) and Vermont (VT) hold elections every 2 years.
- Gubernatorial control provides downballot coattails and strengthens state party chapter operations.

### 2.6.5 State Legislative Chambers & Unified Trifectas
- Models **98 partisan state legislative chambers in 49 states** (Nebraska is unicameral nonpartisan).
- Baseline total of **5,462 lower-house seats**.
- Simulates chamber control and estimates bare-majority seat flips upon control shifts.
- **Trifecta Governance:** When a party holds the Governorship, State House, and State Senate simultaneously, it establishes a **Trifecta**. Trifectas unlock state policy bills and dictate decennial redistricting gerrymanders.

## 2.7 Coattails, Waves & Macro Environment Benchmarks

### 2.7.1 Presidential Downballot Coattail Multipliers
Downballot races inherit a mathematical coattail effect from top-of-ticket presidential performance:
- **U.S. House Races:** **`34% Coattail Effect`** (`RACE_WEIGHT.house = 0.34`).
- **U.S. Senate Races:** **`55% Coattail Effect`** (`RACE_WEIGHT.senate = 0.55`).
- **Gubernatorial Races:** **`42% Coattail Effect`** (`RACE_WEIGHT.governor = 0.42`).

### 2.7.2 Semi-Scripted Opening Environment (2028–2032)
- **2028 Starting Environment:** Starts at **`D+9`**, naturally shifting to **`D+14`** by election day if uninterrupted.
- **Governing Fatigue:** President Jon Ossoff's administration faces governing wear-and-tear, eroding approval across 2028–2030.
- **2030 Midterm Backlash:** The 2030 midterm cycle is designed as a rough, challenging cycle for Democrats held in an opposition Republican-leaning environment (`R+4` to `R+8`).
- **2032 Re-Election Crucible:** Ossoff faces a razor-thin re-election race decided organically by player performance.
- **Post-2032 Sandbox:** After 2032, all semi-scripted rails fall away into emergent simulation.

### 2.7.3 Macro Probabilistic Environment Shift Engine
In non-scripted cycles, macro political environments shift using Gaussian distributions with authentic historical benchmarks:
- **Midterm Backlash:** White House party suffers backlash **`75%–85%` of the time**, with a `15%–25%` chance of holding neutral or gaining ground.
- **First-Term Re-Election Benchmark (`~90%` Win Rate):** First-term incumbent presidents win re-election ~90% of the time under standard play due to structural incumbency advantages.
- **Two-Term Successor Benchmark (`~90%` Loss Rate):** Two-term fatigue causes successor nominees of the incumbent party to lose ~90% of the time.

## 2.8 Forecaster Engine & Polling Architecture

The game features multiple distinct satirical pundit forecaster outlets modeling races from different analytical philosophies:
1. **Momentum-Adjusted Model (*Sallow*):** Weights late-campaign tracking momentum, media narratives, and funding surges.
2. **Fundamentals-Focused Model (*Cook Parody*):** Weights district/state historical baseline leans, macroeconomic data, and structural advantages.
3. **Grassroots-Weighted Model:** Weights localized party chapters, volunteer mobilization, and faction enthusiasm.

### 2.8.1 Consensus Forecaster Tiers
| Rating Tier | Projected Margin Spread | Visual Indicator & Description |
| :--- | :---: | :--- |
| **Solid / Safe** | `> 10.0%` lead | Dark party color. Uncontested or impenetrable stronghold. |
| **Likely** | `6.0% – 10.0%` lead | Medium party color. Clear favorite; requires major wave to flip. |
| **Favored** | `3.5% – 6.0%` lead | Standard party color. Distinct advantage; competitive under pressure. |
| **Lean** | `1.5% – 3.5%` lead | Light party color. Vulnerable battleground; high ad target. |
| **Tilt** | `0.5% – 1.5%` lead | Muted party wash. Razor-thin edge; within margin of error. |
| **Toss-Up** | `< 0.5%` spread | Gray / neutral wash. Dead heat; decided on ground game and turnout. |

### 2.8.2 Third-Party Spoiler Siphoning & Legend Omission Protocol
- **Spoiler Siphoning:** Third-party candidates siphon votes directly from ideologically proximate major parties, tightening or flipping projected margins.
- **Legend Omission Protocol:** Forecast map keys and spectrum bars strictly display the major-party continuum. Third-party swatches are omitted from the legend to preserve authentic media aesthetics while rendering leading third-party districts in their proper colors.

## 2.9 Inter-Cycle Realignment & Electorate Persistence Engine

### 2.9.1 The 1/4th Shift Realignment Rule
Permanent voting blocks shift strictly **between** election cycles based on actual popular vote performance relative to expected baselines:
$$\Delta \text{Share} = \frac{\text{Actual Popular Vote \%} - \text{Expected Vote \%}}{4}$$

- **Expected Vote Baseline (Non-Independent Electorate):** A party's expected vote share is defined by its share of **non-independent registered voters**, NOT total voters.
  - *Example:* If Republicans hold 45% of non-independent voters, their expected popular vote is 45%. If they win 40% of the vote (underperforming by 5 points), they lose **`1.25%` of all registered voters** (`5% / 4 = 1.25%`).
  - Inversely, overperforming by 20 points gains **`5.0%` of all voters** (`20% / 4 = 5.0%`).
- **Strict Between-Elections Invariant:** Parties **DO NOT** gain voters during active campaigns or election night. Voter shifts are calculated and applied exclusively during the inter-cycle transition.

### 2.9.2 Targeted Inter-Party Transfers & Faction Synchronization
- **Targeted Ideological Transfers:**
  - Left-wing third parties (`green`, `socialist`) exchange voters directly with center-left major parties (`people`).
  - Right-wing third parties (`liberty`, `constitution`) exchange voters directly with center-right major parties (`heritage`).
  - Major parties engage in competitive two-way swing voter exchange.
- **Synchronized Faction Realignment:** When voters change parties, their underlying internal faction memberships shift in lockstep: departing voters are deducted proportionally from former factions; entering voters are added to ideologically compatible recipient factions.
- **Cumulative Year-Over-Year GOTV Growth:** Automatic flat electorate growth is eliminated. Registration expands permanently through active Get Out The Vote (GOTV) and field organizing drives, with zero resets between cycles.

## 2.10 The Factions Engine & Full 38 Factions Catalog

### 2.10.1 Dual-Meter Faction Health Architecture
Every political party houses a spectrum of distinct internal factions representing organized ideological wings, voter blocs, and demographic constituencies. Factions are evaluated across two continuous meters:
1. **Faction Standing (Happiness: 0 to 100):**
   - Measures satisfaction with party leadership, platform alignment, candidate recruitment, and funding equity.
   - *High Happiness (>70):* Boosts grassroots volunteer energy, local campaign efficiency, and turnout.
   - *Low Happiness (<45):* Triggers **Turnout Penalties** in every state (capped at `-9.0%` total drag).
2. **Faction Internal Confidence (0 to 100):**
   - Measures institutional power, leverage, and organizational self-assurance within the party machinery.
   - *High Confidence (>75):* Factions demand leadership posts, convention keynote slots, and legislative concessions.

### 2.10.2 Faction Friction, Cohabitation Drag & Bolting Splinters
- **Cohabitation Drag:** When ideologically divergent factions share space within the same party coalition, mutual ideological friction produces a **cohabitation drag** suppressing national volunteer mobilization and small-dollar fundraising.
- **Faction Ultimatums & Bolting Splinters:**
  - **Chronic Dissatisfaction Trigger:** If a faction's Happiness remains **`< 35` for 2 consecutive turns**, the faction issues an official **2-Turn ULTIMATUM**.
  - **The Bolting Threshold:** If the ultimatum expires unaddressed (`ultimatumTurnsRemaining <= 0`), the faction **BOLTS the party**:
    - Its sitting lawmakers leave the party.
    - Its registered voters detach from party rolls into an independent splinter party.
    - It runs rival independent candidates in targeted races, acting as a direct electoral spoiler.
- **Faction Summits & Multi-Cycle Compacts:**
  - *Faction Summits:* Convened by the Chair (`$5M` + 1 Action) to defuse tension and boost morale.
  - *Multi-Cycle Compacts:* Binding agreements where the Chair guarantees policy enactments, platform positions, or leadership appointments in exchange for locked faction loyalty and admitting independent demographic voters.

### 2.10.3 The Full 38 Factions Catalog (155,000,000 Total Represented Voters)
The table below documents all 38 factions in the simulation, including their ID, display name, base party alignment, and exact national represented voter counts. **The sum of all faction voter counts is exactly 155,000,000.**

| Faction ID | Faction Display Name | Base Alignment | National Voters (155M Scale) | % of Electorate |
| :--- | :--- | :---: | :---: | :---: |
| `dem_liberal_establishment` | **The Liberal Establishment** | Democratic (`people`) | **12,270,000** | 7.92% |
| `dem_black_voters` | **Black Voters** | Democratic (`people`) | **11,760,000** | 7.59% |
| `dem_capital_l_left` | **The Capital L Left** | Democratic (`people`) | **7,160,000** | 4.62% |
| `dem_neo_liberals` | **Neo-Liberals** | Democratic (`people`) | **5,620,000** | 3.63% |
| `dem_bernie_bros` | **Bernie Bros** | Democratic (`people`) | **5,110,000** | 3.30% |
| `dem_faith_based_liberals` | **Faith Based Liberals** | Democratic (`people`) | **5,110,000** | 3.30% |
| `dem_blue_dog` | **Blue Dog Democrats** | Democratic (`people`) | **3,780,000** | 2.44% |
| `dem_traditional_latin` | **Traditional Latin Voters** | Democratic (`people`) | **1,839,500** | 1.19% |
| `gop_faith_and_flag` | **Faith & Flag Conservatives** | Republican (`heritage`) | **9,015,000** | 5.82% |
| `gop_maga` | **Nationalist Populists (MAGA)** | Republican (`heritage`) | **7,011,000** | 4.52% |
| `gop_western_mavericks` | **Liberty & Western Mavericks** | Republican (`heritage`) | **6,510,000** | 4.20% |
| `gop_blood_and_soil` | **Blood and Soil Nationalists** | Republican (`heritage`) | **6,010,000** | 3.88% |
| `gop_suburban_moderates` | **Frontier & Suburban Moderates** | Republican (`heritage`) | **5,208,000** | 3.36% |
| `gop_neo_cons` | **Neo-Cons** | Republican (`heritage`) | **5,108,000** | 3.30% |
| `gop_paleocons` | **Paleocons** | Republican (`heritage`) | **3,005,000** | 1.94% |
| `gop_mormons` | **Mormons** | Republican (`heritage`) | **2,404,000** | 1.55% |
| `gop_traditional_farmers` | **Traditional Farmers** | Republican (`heritage`) | **2,003,200** | 1.29% |
| `gop_market_country_club` | **Market & Country-Club Conservatives** | Republican (`heritage`) | **2,003,000** | 1.29% |
| `gop_cubans` | **Cubans** | Republican (`heritage`) | **800,000** | 0.52% |
| `swg_true_centrists` | **True Centrists** | Swing Electorate | **9,006,000** | 5.81% |
| `swg_hard_hats` | **Hard Hats** | Swing Electorate | **6,004,000** | 3.87% |
| `swg_podcast_bros` | **Podcast Bros** | Swing Electorate | **6,004,000** | 3.87% |
| `swg_country_club_centrists` | **Country Club Centrists** | Swing Electorate | **5,503,500** | 3.55% |
| `swg_technocrats` | **Technocrats** | Swing Electorate | **5,503,500** | 3.55% |
| `swg_grillers` | **Grillers** | Swing Electorate | **5,003,000** | 3.23% |
| `swg_religious_moderates` | **Religious Moderates** | Swing Electorate | **4,502,800** | 2.91% |
| `swg_working_class_latinos` | **Working Class Latinos** | Swing Electorate | **4,002,500** | 2.58% |
| `swg_girlypops` | **Girlypops** | Swing Electorate | **2,500,500** | 1.61% |
| `lib_true_libertarians` | **True Libertarians** | Libertarian (`liberty`) | **956,600** | 0.62% |
| `lib_ancaps` | **Ancaps** | Libertarian (`liberty`) | **191,300** | 0.12% |
| `grn_eco_socialist_vanguard` | **Eco-Socialist Vanguard** | Green (`green`) | **383,800** | 0.25% |
| `grn_yimby` | **YIMBYs** | Green (`green`) | **109,600** | 0.07% |
| `con_christian_dominionists` | **Christian Dominionists & Theocrats** | Constitution (`constitution`) | **230,000** | 0.15% |
| `soc_socialists` | **Socialists** | Socialist (`socialist`) | **138,000** | 0.09% |
| `soc_communists` | **Communists** | Socialist (`socialist`) | **92,000** | 0.06% |
| `unaff_groypers` | **Groypers** | Unaffiliated / Fringe | **200,000** | 0.13% |
| `unaff_the_klan` | **The Klan & Neo-Nazis** | Unaffiliated / Fringe | **142,200** | 0.09% |
| `unaff_regional_activists` | **Non-Aligned Regional Activists** | Unaffiliated / Fringe | **2,800,000** | 1.81% |
| **TOTAL ELECTORATE** | **38 Active Factions** | **National Pool** | **155,000,000** | **100.00%** |


## 2.11 Party Systems Evolution Engine (MAS-01)

### 2.11.1 The Macro Historical Realignment Framework
Implemented in Version 0.16.0 under `MAS-01`, the **Party Systems Engine** simulates multi-decade historical realignments. Rather than remaining locked in modern 2020s politics, campaigns past 2036 model profound demographic, institutional, and ideological sea changes.

- **1st through 6th Historical Eras:** Tracked in game history as foundational precedents:
  1. *1st Era (1792–1828):* The Federalist Era (Hamiltonian Federalists vs. Jeffersonian Democratic-Republicans).
  2. *2nd Era (1828–1860):* The Antebellum Era (Jacksonian Democrats vs. Whig Opposition).
  3. *3rd Era (1860–1896):* The Industrial Era (Civil War Realignment & Union Republican Hegemony).
  4. *4th Era (1896–1932):* The Progressive Era (McKinley Realignment, Trust-Busting, Direct Primaries).
  5. *5th Era (1932–1966):* The Liberal Era (New Deal Coalition, Labor Expansion, Welfare State).
  6. *6th Era (1966–2006):* The Conservative Era (Southern Realignment, Reagan Coalition, Deregulation).
- **The 7th Era (2006–Current):** *The Modern Populist Era* (Begun in 2006 Democratic Wave; the game's starting baseline).
- **The 8th Party System Floor:** Under no circumstances may an 8th Party System fire before **`2040`**.
- **Subsequent Eras Floor (9th+):** No subsequent Party System may fire until at least **`30 Years`** have elapsed since the prior era started (`year >= currentEraStartYear + 30`).

### 2.11.2 Escalating Transition Probability Roll
Starting in 2040, the engine rolls **once per 2-year election cycle** during `startNextCycle()`:
- **Starting Probability:** **`10%`** in the first eligible cycle (2040).
- **Escalation Step:** Increases by **`+5%`** per eligible cycle if not triggered (`10% -> 15% -> 20% -> 25% -> 30%...`).
- **Guaranteed Trigger:** Clears ~99% cumulative probability before 2060.
- **Weight-3 Triggered Realignments:** Certain catastrophic crises trigger specific eras directly:
  - *Super-Blowout Realignment:* Winning 400+ Electoral Votes or 60+ Senate seats triggers a sweeping party displacement.
  - *40+ State Trifectas:* Triggers the *One-Party Dominance / Democratic Disintegration Era*.
  - *Independent Presidency Victory:* Triggers the *No-Party Independent Era*.
  - *Third-Party Breakthrough (35%+ Popular Vote):* Triggers the *Third-Party Displacement Era*.

### 2.11.3 The 41-Issue Swap Pipeline
- The game maintains **strictly 41 active issues** at all times.
- When a new Party System triggers, the engine retires obsolete issues (e.g., *Ukraine Aid* or *Legacy Tax Laws*) into `sunsettedIssueIds` and introduces era-exclusive issues from a 167-issue historical catalog.

### 2.11.4 Party Systems Subsystems
1. **Independent Presidential Campaigns:** Models high-profile independent candidacies (centrist billionaires, celebrity outsiders) with unique ballot qualification and polling surges.
2. **Mixed-Member Proportional (MMP) Coalition Governance (Era #18):** Enacts nationwide coalition agreements with a Post-Election Stability Meter and coalition Cabinet portfolios.
3. **Synthetic Suffrage & Robot Citizenship (Era #16):** Models legal AI personhood, expanding the national voter pool to **`310M+` voters** with four robot political parties.

## 2.12 Statutory Ballot Access & Uncertainty Engine

### 2.12.1 50-State Statutory Signature & Retention Table (`REQ-206`)
Replaces flat fallbacks with authentic 50-state statutory requirements for minor parties:
- **High-Barrier States:** California (200,000 signatures), Florida (140,000), North Carolina (80,000), Oklahoma (35,000).
- **Low-Barrier States:** Tennessee (275 signatures), Colorado (1,000), New Jersey (800).
- **Statutory Vote Retention:** Earning `2.0%` to `5.0%` of the statewide gubernatorial/presidential vote locks automatic ballot access for the next 4 years.
- **Petition Drives (`REQ-207`):** Minor parties spend **`$3M` per drive**, adding `+35%` toward qualification.
- **Signature Audits & Legal Challenges (`REQ-208` / `REQ-209`):** Major parties can challenge signatures, forcing a **Ballot-Access Legal Defense Crisis** requiring legal warchests to survive.

### 2.12.2 Electoral Uncertainty Models (`REQ-204` / `REQ-205` / `REQ-210`)
- **Correlated Regional Polling Error:** Survey sampling error correlates across Census regions ($\Delta_{\text{region}} \sim \mathcal{N}(0, 2.2\%)$).
- **Shy-Voter Bias:** Anti-establishment or polarizing candidates suffer a hidden **`-1.5%` to `-3.0%` non-response penalty** unmasking on Election Night.
- **Late Undecided Swing:** Undecided voters (3%–6%) break 65/35 toward the surging party in the final 7 days.
- **Automatic Statutory Recounts:** Races decided by **`< 0.5%` margin** trigger an automatic recount on Election Night, with a 15% probability of flipping the certified winner.

## 2.13 Election Night Decision Desk Simulation (`REQ-220`–`REQ-223`)

Simulates a live television news Decision Desk adapted from *Battle for America* (`ELECTION_NIGHT_DESIGN.md`):
- **Virtual Broadcast Timeline:** Runs from **`7:00 PM ET` to `4:00 AM ET`** covering 51 jurisdictions.
- **Playback Speed Controls:** `1×`, `2×`, `4×`, `8×`, `Pause`, and instant `Skip to the end`.
- **Non-Linear Log-Uniform Ballot-Drop Pool:** Drops arrive in realistic batches (100 to 10,000 ballots) with Box-Muller Gaussian partisan skew ($\sigma = 13.333$ pts), creating authentic red mirages and blue shifts.
- **100% Mathematical Convergence:** All ballot drops strictly draw from precomputed returns, guaranteeing exact convergence upon 100% reporting.
- **13-Tier Decision Desk Race Calling Matrix:** Outlets hold calls until mathematical thresholds are satisfied (Too Early to Call $\to$ Too Close to Call $\to$ Projected Winner).
- **5 Multi-Race Tabs:** President, Senate, House, Governors, and State Legislatures.

# 3. Pending Backlog & TBD Roadmap

> **CRITICAL OPERATIONAL RULE (Nov 14, 2026):**
> The design backlog is a continuous rolling queue. When a release is finalized, **ONLY archive features that were actually implemented into `PRIOR_UPDATES.md`**. NEVER wipe or reset the backlog. Carry all pending, unbuilt, and exploratory items forward.


## 3.1 Backlog Inventory Matrix & Build Thresholds

| Size Category | v0.16.1 (Designed Package) | v0.16.2 (Active Sized Queue) | Unscheduled Backlog | Total Pending | Threshold for Minor Build (`0.0.x`) | Build Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Massive** | **0** | **0** | **0** | **0** | Standalone multi-day cycle | ⏳ None Pending |
| **Huge** | **0** | **0** | **0** | **0** | 1 Huge OR 3 Large | ⏳ None Pending |
| **Large** | **0** | **0** | **0** | **0** | 3 Large | ⏳ None Pending |
| **Medium** | **8** | **0** | **4** | **12** | Up to 5 Medium | 🎯 Ready (`8` in `v0.16.1`, `4` Unscheduled) |
| **Small** | **21** | **11** | **6** | **38** | 5 to 10 Small | 🎯 Ready (`21` in `v0.16.1`, `11` in `v0.16.2`, `6` Unscheduled) |
| **Tiny** | **0** | **0** | **0** | **0** | All Pending | ⏳ 0 Pending |
| **TOTAL ITEMS** | **29 Items** | **11 Items** | **10 Items** | **50 Items** | — | **50 Sized Backlog Requirements** |


## 3.2 Version 0.16.1: Complete Sized Package (29 Requirements)

Fully specified in `VERSION_0.16.1_DESIGN.md` across 4 system clusters:

### Cluster A: Presidential Primaries & Nominating Conventions (9 Requirements)
1. **REQ-195: Incumbent Vulnerability Triggers & Challenger Emergence (Small):** Evaluated at start of Phase 2 in presidential cycles (2032+). Triggers primary revolt if `presidentialApproval < 40%`, national environment penalty $\ge +8.0$ for opposition, or base faction happiness $< 35$. Spawns a high-Fame sitting Governor/Senator challenger from the aggrieved wing.
2. **REQ-196: Incumbent Primary Contest & Party-Fracture Fallout (Medium):** Step-Aside decision modal when approval $< 32%$ (declining re-election avoids civil war and cuts governing fatigue by 60%). If contested and incumbent wins, applies Bruised Incumbent Penalty ($-3.5%$ margin drag, $-15$ challenger faction happiness, $$12\text{M}$ defense cost). If challenger wins, challenger becomes nominee and incumbent faction suffers $-25$ Happiness shock.
3. **REQ-197: Presidential Primary Field & Candidate Generation (Small):** In open-seat/out-party cycles (2032+), generates 3–5 contenders from sitting Governors, Senators, and Faction Leaders preserving traits, Net Approval, and Fame. Home-state boost ($+8.0\%$ home, $+3.0\%$ region).
4. **REQ-198: Phased Primary Calendar Engine (Medium):** 3-wave calendar in Phase 2: Wave 1 Early States (IA, NH, NV, SC with $+4.0\%$ winner momentum bounce), Wave 2 Super Tuesday (~15 states, 40% delegates), Wave 3 Late Consolidation (PA, OH, FL, NY, WI, MI, GA). Trailing candidates with $<12\%$ delegates drop out and endorse ideologically closest rivals (transferring 65% momentum).
5. **REQ-199: State Delegate Allocation & Live Delegate Tracker (Medium):** 2,000 delegates needed to clinch nomination. Allocates state delegates proportionally with 15% viability threshold (plus winner-take-all hybrid bonuses for $>50\%$). Live Delegate Tracker header progress bar with candidate portraits, delegate counts, and gap to 2,000.
6. **REQ-200: Chair Primary Strategy & Lane Consolidation (Small):** Chair spends 2 Primary Strategy Actions during Phase 2: Neutral Arbiter ($+6$ Faction Happiness), Back Preferred Candidate ($+5.0\%$ vote, $-8$ rival faction happiness), or Broker Lane Consolidation ($1\text{ Action} + \$2\text{M}$ / Cabinet promise to drop out and transfer $+80\%$ voters).
7. **REQ-201: Factional Convention Delegates & Platform Floor Votes (Small):** National Nominating Convention modal at end of primary. 2 interactive Platform Amendment floor votes pitting rival wings against each other. Chair vote shifts platform slider $\pm 1.0$ point ($+7$ winning faction happiness, $-4$ losing faction happiness).
8. **REQ-202: VP Ticket Selection & Keynote Unity Brokering (Small):** Select running mate from 4 qualified politicians ($+4.0\%$ home state, $+1.5\%$ regional lift; selecting runner-up faction heals bruised incumbent penalty and grants $+12$ Happiness). Award prime-time Convention Keynote ($+5$ Fame, $+6$ Faction Standing, $+2.0\%$ national enthusiasm).
9. **REQ-203: Contested / Brokered Multi-Ballot Convention (Medium):** Triggers when no candidate clears 2,000 delegates. Multi-ballot floor-brokering modal: frontrunner negotiates VP offers, Cabinet posts, or platform planks with trailing kingmakers to clinch 2,000 on Ballot 2 or 3 (deadlock inflicts $-5.0\%$ general election enthusiasm penalty and factional bitterness).

### Cluster B: Statutory Ballot Access, Uncertainty & Election Administration (8 Requirements)
10. **REQ-204: Correlated Regional & State Polling Error (Small):** Pre-election forecasters exhibit survey sampling error with correlated regional miss vectors ($\Delta_{\text{region}} \sim \mathcal{N}(0, 2.2\%)$ across Census clusters). Displayed strictly through qualitative confidence tiers (Tilt/Lean/Likely), keeping raw error formulas hidden.
11. **REQ-205: Shy-Voter Bias & Late-Breaking Undecided Swing (Small):** Polarizing or anti-establishment candidates (*Rough*, *Undisciplined*, or stances $>8.5$/$<1.5$) suffer a $-1.5\%$ to $-3.0\%$ non-response polling penalty, unmasking on Election Night. Late-breaking undecideds ($3\%–6\%$) break 65/35 toward the surging party in the final week.
12. **REQ-206: 50-State Statutory Signature & Retention Table (Small):** Replaces flat fallbacks with authentic statutory ballot-access table across all 50 states (California: 200,000 signatures, North Carolina: 80,000, Tennessee: 275).
13. **REQ-207: Petition Drive Action & State Qualification Loop (Medium):** Chair deploys **Petition Drive Actions** in Phase 1 ($1\text{ Action} + \$3\text{M}$) in non-qualified states. Yields $+35\%$ progress toward signature thresholds, with volunteer bonuses.
14. **REQ-208: Major-Party Petition Challenges & Signature Audits (Small):** Major parties review signatures. If signatures are within 110% of threshold, 25% chance of disqualification unless protected by legal defense.
15. **REQ-209: Ballot-Access Legal Defense Crisis Modal (Small):** Challenged petition drives trigger a high-stakes Legal Defense dilemma ($1\text{ Action} + \$2.5\text{M}$ emergency legal fund to preserve ballot status; failure removes candidate from the ballot).
16. **REQ-210: Automatic Close-Margin Statutory Recounts (Small):** Contests decided by **$< 0.5\%$ margin** trigger automatic statutory recounts on Election Night. 15% probability of flipping the certified winner.
17. **REQ-211: State Trifecta Voting-Law Policy Bills (Small):** Parties holding state trifectas enact voting reform legislation: Voter ID (reduces low-propensity turnout by $1.2\%$, helps GOP), All-Mail Voting (boosts turnout by $3.5\%$, helps Dems), Drop-Box Expansion.

### Cluster C: Candidate Vetting, Dynamic Drift & Faction Feedback (8 Requirements)
18. **REQ-212: Hidden Candidate Vulnerability Scores & Vet Candidate Action (Small):** Assigns hidden 0–100 vulnerability score to all recruits. Chair can spend 1 Action + $1M to "Vet Candidate", revealing their risk tier.
19. **REQ-213: Mid-Campaign Scandal Blowups (Abandon vs. Defend) (Small):** High-vulnerability nominees face mid-campaign oppo scandals. Chair must choose: Abandon ($-10$ popularity, $-5$ faction happiness, preserves party brand) vs Defend ($+\$3\text{M}$, $+8$ faction loyalty, $-2.5\%$ independent trust).
20. **REQ-214: Post-Election Certified Performance Drift (Small):** States overperforming expectations by $>5$ points shift baseline partisanship by $+0.5$ points toward that party for future cycles.
21. **REQ-215: Multi-Cycle Demographic & Migration Drift (Small):** Sun Belt states (AZ, GA, NC, TX) drift $+0.2$ points left per cycle; Rust Belt non-college states drift $+0.2$ points right per cycle, modeling national demographic sorting.
22. **REQ-216: Organizing & Registration Footprint Feedback (Medium):** Permanent state chapters and voter registration drives accelerate demographic drift, locking in multi-decade regional gains.
23. **REQ-217: Post-Election Factional Autopsy Realignment (Small):** After election night, the Chair selects an official autopsy narrative (Blame the Moderates, Blame the Left/MAGA, or Celebrate the Big Tent), shifting faction standings by $\pm 8$ points.
24. **REQ-218: Non-Linear Multi-Party Swing Split Curves (Small):** Replaces linear two-party swing with multi-party attraction curves based on Euclidean distance.
25. **REQ-219: Dynamic Third-Party & Insurgent Appeal Elasticity (Small):** Disillusionment with major parties raises baseline third-party elasticity across the state.

### Cluster D: Election Night Broadcast Screen & Decision Desk Simulation (4 Requirements)
26. **REQ-220: 51-Jurisdiction Poll-Closing Schedule & State-Scaled Reporting Engine (Small):** 7:00 PM to 4:00 AM ET timeline, state-by-state closing waves, dynamic playback controls.
27. **REQ-221: Non-Linear Log-Uniform Ballot-Drop Pool & Multi-Party Gaussian Skew (Medium):** Realistic ballot drops (100 to 10,000 ballots) with Box-Muller Gaussian skew ($\sigma = 13.333$ pts) and guaranteed 100% convergence.
28. **REQ-222: 13-Tier Decision Desk Race Calling & Sallow 15-Minute Live Forecast (Small):** Pundit projections and certified calls based on reporting thresholds and margins.
29. **REQ-223: 2-Column Broadcast Desk UI, 5 Multi-Race Tabs & Post-Election Handshake (Medium):** Fullscreen broadcast desk layout with President, Senate, House, Governor, and State Leg tabs, cleanly handing off to inter-cycle realignment upon completion.

## 3.3 Version 0.16.2: Active Queued Pipeline (11 Small Requirements)

Sized and queued in `DESIGN_BACKLOG.md`:
1. **REQ-224 (Small):** Breakout State Legislator Spawner, 12-Member Roster Cap & Seasoning Lifecycle (`office: 'stateLeg'`).
2. **REQ-225 (Small):** Statehouse-to-Higher-Office Recruitment Pipeline & Seamless Career Promotion.
3. **REQ-226 (Small):** Fallback Party Leadership Bench & Stepping-Stone `State Legislative Caucus Chair` Role.
4. **REQ-227 (Small):** Third-Party Major Priorities Pack A — Vote-Threshold & Institutional Ascent (4 Quests).
5. **REQ-228 (Small):** Third-Party Major Priorities Pack B — Regional Bastion, Electoral Reform & Kingmaker Leverage (4 Quests).
6. **REQ-229 (Small):** Third-Party Major Priorities Pack C — Historic Breakthrough & Major-Party Displacement (4 Quests).
7. **REQ-230 (Small):** Deterministic Draft-of-7 Priorities Engine, Smart Hand Composition & `Push Our Issues` Gate.
8. **REQ-231 (Small):** Step 2 Draft-of-7 Selection UI & Unlimited Escalating-Cost Redraws (`cost = redrawCount + 1`).
9. **REQ-232 (Small):** New Generic Major Priorities (`Turnout Engine` & `Build Up the Bench`).
10. **REQ-233 (Small):** Targetable Hostile-Territory Priorities (`Crack an Opponent Stronghold` & `Crack an Opponent's Fortress`).
11. **REQ-234 (Small):** Historical Party Systems Canon (1st–6th Eras), 7th Era Modern Populist Retitle & Timeline Info Modal.

## 3.4 Unscheduled Backlog: Custom Party Mode & Faction Anchor Rework (10 Requirements)

Specified in `CUSTOM_PARTY_REWORK_DESIGN.md`:
1. **REQ-235 (Small):** Dedicated `Create Custom Party` Setup Flow & Clean Neutral Initialization.
2. **REQ-236 (Small):** Ironclad Democratic & Republican Leading-Faction Anchor Lock (`dem_liberal_establishment` & `gop_maga`).
3. **REQ-237 (Medium):** Custom Party Starting Factions Picker, Pairwise $\le 2.0$ Compatibility, 155M & Politician Transfer.
4. **REQ-238 (Medium):** Minor-Party Merger Dissolution, Orphaned Breakaway Factions (`seekingPartyHome`) & `"Sellout Grudge"`.
5. **REQ-239 (Small):** Party Origin Stories — 4 Archetype Modifiers (Schism, Civic Reform, Grassroots Viral, Executive Third Way).
6. **REQ-240 (Medium):** `Not a Major Movement` Exclusivity Lock & Custom 100K Founding Faction Builder.
7. **REQ-241 (Small):** Founding Charter Traits (Pick 1–2 DNA Rules) & Party Branding Suite (Emblem, 3-Letter Code & Motto).
8. **REQ-242 (Medium):** The `"Founder's Shadow"` Movement Aura & `"Survive the Founder"` First Succession Crisis.
9. **REQ-243 (Small):** Custom-Party-Exclusive Priorities Pack A — Founding Momentum & Merger Arcs (#1–#5, Draft-of-7 Pool).
10. **REQ-244 (Small):** Custom-Party-Exclusive Priorities Pack B — Fortress, Grudge, Cross-Aisle & Homegrown Bench (#6–#9, Draft-of-7 Pool).

# 4. Game Style Guides, Art Direction & UI Standards

All visual, interface, and design work must strictly follow the **AI Games Studio Art Style (`ART_STYLE.md`)**, NOT generic web frameworks or the U.S. Web Design System:

## 4.1 Color Palette & Design Tokens

| Token Name | Exact HSL / Hex Code | Usage & Placement |
| :--- | :---: | :--- |
| **Deep Navy** | `hsl(226, 24%, 7%)` / `#0d1017` | Primary canvas & app background. |
| **Raised Navy** | `hsl(226, 21%, 12%)` / `#181d28` | Dashboard cards, dossiers, modals, interactive panels. |
| **Warm Ivory** | `hsl(42, 25%, 92%)` / `#eee9df` | Primary readable text, card headers, table data. |
| **Muted Copper** | `hsl(32, 48%, 48%)` / `#b5753f` | Accent highlights, active selection rings, gold badges. |
| **Muted Teal** | `hsl(174, 36%, 56%)` / `#66b8b0` | Interactive buttons, action points, success badges. |
| **Coral / Alert** | `hsl(7, 62%, 59%)` / `#d65851` | Crisis alerts, ultimatum banners, dangerous backlash. |
| **Slate Borders** | `hsl(220, 14%, 26%)` / `#393e4a` | Clean card outlines, table row dividers, tab borders. |
| **Democratic Blue** | `#3478c7` | Official Democratic Party branding, map fills, candidate badges. |
| **Republican Red** | `#d94b4b` | Official Republican Party branding, map fills, candidate badges. |
| **Split Chamber Purple** | `#8e44ad` | **Solid whole-state fill** when state legislative chambers are split (never split or slash the polygon). |

## 4.2 Typography Hierarchy

- **Headings & Titles:** Authentic Serif face (`Iowan Old Style`, `Palatino`, or `Georgia`). Conveys historical pedigree and institutional gravity.
- **Body Copy & Narratives:** Clean, crisp modern Sans-Serif (`Aptos`, `Segoe UI`, or system fallback).
- **Badges & Labels:** Condensed uppercase Sans-Serif with generous letter-spacing.
- **Numbers, Margins & Tables:** Monospace (`Consolas`, `Menlo`, or monospace fallback) for clean numerical alignment and scannability.

## 4.3 Pixel Art & Iconography Rules

- **Candidate Portraits:** Crisp pixel art portraits (`assets/candidates/`, `image-rendering: pixelated`). Compact palette, dark outlines, clear silhouettes. **Never apply blur, anti-aliasing filters, photographic textures, or airbrushed gradients.**
- **Standalone UI Icons:** Rendered on a `64×64` grid with clean transparent backgrounds.
- **Application Icon:** `assets/coalition-builder-icon.svg` is a `512×512` opaque square featuring a simplified U.S. map silhouette and checkmark on Deep Navy.

## 4.4 Atmospheric Vibes & Obscuring Information Rule

- The game deliberately **obscures raw percentages and mechanical formulas** from the player's eyes.
- Never show raw math like `vulnerabilityScore = 82` or `80% chance of passing bill`.
- Express risks and opportunities through qualitative narrative language:
  - *Vulnerability:* "Squeaky Clean", "Suburban Whispers", "Elevated Scrutiny", "Extreme Exposure".
  - *Polling Spread:* "Solid Hold", "Competitive Tilt", "Toss-Up Within Margin of Error".
  - *Faction Mood:* "Fervent Loyalty", "Restless Grievance", "Active Rebellion".

## 4.5 Google Drive Document Compatibility Rule (Nov 14, 2026)

- **Strict Rule:** Never create documents, spreadsheets, data exports, or written reports that are incompatible with Google Drive.
- Spreadsheets must be clean `.csv` or standard `.xlsx` without proprietary delimiters.
- Written docs must be clean `.docx` or standard Markdown `.md` that preview and render seamlessly in Google Drive.

# 5. Chronological Record of Owner Instructions & Commands

This section maintains a faithful chronological record of all major instructions, design rules, constraints, and operational clarifications given by the project owner across the lifetime of the project:

1. **Offshoot Project Genesis (Nov 10, 2026):** Extract Party Chair ZIP and develop as an offshoot of Battle For America. BFA files may be read for reference, but MUST NEVER be edited.
2. **Working Title & Party Branding:** Accepted "Coalition Builder: Party Chair" as working title. Use recognizable American parties (Democratic Blue `#3478c7`, Republican Red `#d94b4b`).
3. **Version 0.1 Design:** 2028 scenario, 50-state networks, 435 House seats, 3 Senate classes, 20 turns before primaries, 4 actions/turn, 5 endorsements/turn, recruit cost `$2M + Quality`, losing recruit penalty `-2.5` confidence, 2028 Ossoff/Vance ticket with South/Midwest turnout boosts.
4. **Version 0.2.1 Typography & Issue Platform:** Triple existing font size; create 40-issue platform with 1–10 sliders across 7 categories; follow studio art style.
5. **Version 0.2.2 Refit:** Reduce font size by 20%, make UI fill entire screen.
6. **Version 0.3 Maps:** Realistic national maps for Senate, House, Governors, State Legislatures (whole-state purple fill for split control). House uses 2026 boundaries.
7. **Version 0.4 Interactive Tutorial:** Multi-step tutorial with skip option, visual control highlights, requiring actual button clicks (no passive click-through). Fix polygon ring delimiter (`!` delimiter).
8. **Version 0.4.3 Chapter Networks:** Establish 800 local chapters per major party. Add "Youth Chapters" as label only (defer mechanics until supplied).
9. **Version 0.5 Voter Model Scale (CRITICAL):** Replace Members with "Millions of Members" on the **155 Million represented-voter scale**. The "1.55M" internal sample is an abstraction and must NEVER appear in game-facing UI.
10. **TBD Updates File (Nov 14, 2026):** All exploratory/TBD notes belong in `TBD_UPDATES.md`. `DESIGN_BACKLOG.md` tracks active, sized requirements.
11. **Continuous Multi-Cycle Evolution (Nov 14, 2026):** Playthroughs advance continuously across 2-year cycles. Realignment occurs BETWEEN elections via the **1/4th Shift Rule** relative to non-independent expectations. Voters NEVER shift mid-campaign.
12. **Build a Minor Version Definition (Nov 14, 2026):** When owner says "build a minor version", package ALL pending Small/Tiny proposals and up to 5 Medium proposals into `0.0.x`.
13. **Selective Archival Rule (Nov 14, 2026):** When a version is released, ONLY archive implemented features into `PRIOR_UPDATES.md`. NEVER wipe or reset the backlog.
14. **Universal Politician Terminology Rule (Nov 15, 2026):** "Politician" refers universally to all characters: Candidates, Appointed Leaders, and Sitting Lawmakers.
15. **Party Systems Evolution (Nov 16, 2026 / MAS-01):** Massive update tier simulating transitions to 8th Party System (2040+ floor, escalating probability roll, 41-issue swap pipeline).
16. **Categorization by Size by Default Rule (Nov 18, 2026):** Whenever listing, reporting, or auditing backlog items or updates, **ALWAYS group and categorize primarily by SIZE (`Massive`, `Huge`, `Large`, `Medium`, `Small`, `Tiny`)** by default.
17. **Zero-Code-Edit Invariant for Design Agent (Nov 18, 2026):** The Design Agent in this chat session is STRICTLY a design and architecture agent. Under NO circumstance may this agent edit, create, or delete code files (`.js`, `.css`, `.html`, `package.json`). Permitted files: `.md` only. "Build" in this session strictly means authoring design docs, sizing requirements, and generating copy-pastable prompts for a coding agent.
18. **Emergency Token Conservation Rule (Nov 18, 2026):** Never burn user tokens on manual multi-turn line-by-line file edits or command churn. If an issue arises, use atomic commands or direct text responses.
19. **Direct Concise Answers Rule (Nov 18, 2026):** When asked a direct or yes/no question, answer directly in 3 seconds without massive tool runs or delays.
20. **Ready-to-Copy Handoff Prompts Rule:** Always provide self-contained, copy-pastable handoff prompts in clean fenced code blocks (` ```text `) with no commentary mixed inside.

# 6. Workplace Architecture & Coding Preferences

Although you are operating strictly as a Design Agent and will not edit code yourself, you must understand the technical architecture, modular conventions, and coding patterns of this workplace so that your design specifications are immediately executable by Coding Agents:

### 6.1 Vanilla JavaScript & Zero-Build Runtime
- **Pure Browser Standard:** The runtime relies on modern ES6+ Vanilla JavaScript executed directly by the browser (or embedded WebView). There is **no npm build step, no Webpack/Vite bundle step, and no TypeScript compile step** required for runtime frontend assets.
- **Direct Script Loading in `index.html`:** Modules are loaded sequentially via `<script>` tags in strict dependency order:
  1. Data bridges (`data.js`, `voter-model-0.5.js`, `state-house-data-0.5.js`, `issues-0.2.1.js`, `factions-0.15.js`).
  2. Specialized subsystems (`party-systems-data.js`, `party-systems-engine.js`, `party-systems-coalition.js`, `party-systems-robots.js`, `party-systems-ui.js`).
  3. Headless simulation engine (`engine.js`).
  4. Vector graphics & SVG maps (`maps-0.3.js`).
  5. DOM presentation, events & UI controller (`app.js`).

### 6.2 Global Namespace Modularity
To support both direct browser execution and Node-based verification test scripts (`scripts/test-*.cjs`), modules attach to global objects using universal wrappers:
```javascript
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PartyChairData = Object.assign(root.PartyChairData || {}, factory());
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // Module implementation
});
```

### 6.3 Separation of Concerns: Engine vs. App
- **`engine.js` (Headless Core):** Contains 100% of the game's mathematical models, state transitions, voter realignment, candidate generation, forecaster builds, trait calculations, and save/load migration. It has **zero DOM dependencies** (`document`, `window.alert`, HTML elements) so it runs headlessly in test scripts.
- **`app.js` (Presentation Layer):** Renders HTML views, handles user clicks, manages modals, formats currency/dates, and dispatches actions to `engine.js`.
- **`maps-0.3.js` (Vector Geometry):** Pure SVG path rendering with multi-ring polygon support using `!` as the delimiter character.

### 6.4 Save Schema Versioning & Backward Compatibility
- **`SAVE_KEY` Chain:** The engine uses versioned `localStorage` keys (e.g. `partyChairGame.save.v15.9` $\to$ `partyChairGame.save.v16.0`).
- **`normalizeGame(parsed)` Function:** Every save file loaded passes through `normalizeGame()`, which hydrates missing fields with backward-compatible defaults, ensuring older saves (v0.1 through v0.15) load seamlessly into newer engines.

### 6.5 Desktop Executable Packaging (`build.ps1`)
- The game is distributed as a standalone Windows executable (`Coalition Builder - Party Chair.exe`) compiled via a C# WebView2 wrapper in PowerShell (`build.ps1`).
- Releases are compiled into `dist/release/Coalition Builder - Party Chair.exe` and copied to `dist/` when unlocked.

### 6.6 Automated Verification Testing
- Node.js integration tests reside in `scripts/test-*.cjs`.
- Every minor or major release requires verifying that existing regression suites (e.g. `node scripts/test-mas01-phase4.cjs`) pass 100% before packaging.

# 7. Reference Archive: Last 10 Version Update Documents

To give the incoming AI clear models of how the project owner expects update documents to be formatted, structured, and presented, this section analyzes and summarizes the last 10 version design documents created in this workspace:

### 7.1 The Standard Design Document Anatomy
Every professional design document in this workspace follows a consistent 6-part structure:
1. **Document Header:** Target version (`0.x.y`), Save Key migration target, Requirement scope (`REQ-XX` to `REQ-YY`), Sizing breakdown (e.g. 8 Medium, 21 Small), Target implementation files.
2. **Executive Summary & Architecture Pillars:** High-level thematic narrative explaining the gameplay purpose of the update, broken into 3–4 core structural clusters.
3. **Invariants & Style Guide Compliance Checklist:** Explicit confirmation of the 155M scale, atmospheric vibes rule, zero in-game REQ tags, and multi-cycle continuity.
4. **Data Schemas & State Model Extensions:** Clean TypeScript / JavaScript interface definitions showing exact object shapes, field types, and default values for `normalizeGame()`.
5. **Requirement Specifications Grouped Primarily by Size (or Staged Clusters):** Granular specifications for each numbered requirement, including Sizing justification, mechanics, math formulas, and UI integration.
6. **Implementation & Verification Checklist:** Step-by-step handoff roadmap for coding agents, specifying test script requirements and executable rebuild commands.

### 7.2 Summary of the Last 10 Version Documents

#### 1. Version 0.16.1 Design Document (`VERSION_0.16.1_DESIGN.md` | 666 Lines)
- **Title:** Presidential Race, Ballot Access, Election Uncertainty, Faction Feedback & Election Night Broadcast Desk Expansion
- **Scope:** 29 Requirements (`REQ-195` to `REQ-223`: 8 Medium, 21 Small) across 4 Clusters.
- **Key Features:** Full presidential primary calendar (2032+), 50-state statutory ballot access table, hidden candidate vulnerability scores with vetting actions, correlated regional polling error, and the real-time Election Night Decision Desk simulation with Gaussian ballot drops.
- **Target Files:** `election-night-engine.js`, `presidential-primaries.js`, `ballot-access.js`, `election-drift.js`, `engine.js`, `app.js`.

#### 2. Version 0.16.0 Massive Specification (`PARTY_SYSTEMS_DESIGN.md` | 674 Lines)
- **Title:** The Party Systems Evolution Engine (`MAS-01`)
- **Scope:** 1 Massive Multi-Day Milestone delivering 26 Historical and Emergent Eras.
- **Key Features:** Macro historical progression from 7th to 8th Party System (2040+ floor, escalating probability rolls), 41-issue swap pipeline, independent presidential campaigns, MMP coalition governance, and robot citizenship (310M+ voters).
- **Target Files:** `party-systems-data.js`, `party-systems-engine.js`, `party-systems-coalition.js`, `party-systems-robots.js`, `party-systems-ui.js`.

#### 3. Version 0.15.9 Comprehensive Minor Release (`VERSION_0.15.9_DESIGN.md` | 662 Lines)
- **Title:** Third-Party Ascent & Multi-Party Democracy Expansion
- **Scope:** 19 Requirements (`REQ-176` to `REQ-194`: 5 Medium, 14 Small).
- **Key Features:** 50-state chapter presence for minor parties, disaggregated state voter registration table, multi-cycle party growth carryover, fusion voting leverage, debate stage threshold qualifications, and contingent presidential elections.
- **Target Files:** `engine.js`, `app.js`, `styles.css`.

#### 4. Version 0.15.5 Minor Release (`VERSION_0.15.5_DESIGN.md` | 215 Lines)
- **Title:** Multi-Party Forecaster Ingestion & Map Color Gradient Spectrum Expansion
- **Scope:** 5 Requirements (`REQ-154` to `REQ-158`: 2 Medium, 3 Small).
- **Key Features:** Ground-up overhaul of forecasters to ingest third parties, multi-tier color intensity fills (Solid, Likely, Lean, Tilt) for minor parties, and legend omission protocol.

#### 5. Version 0.15.4 Minor Release (`VERSION_0.15.4_DESIGN.md` | 135 Lines)
- **Title:** Continuous Consensus Forecaster & Pundit Philosophy Synthesis
- **Scope:** 4 Requirements (`REQ-150` to `REQ-153`: 1 Medium, 3 Small).
- **Key Features:** Synthesis of Sallow, Cook, and Grassroots forecasters into unified multi-tier consensus ratings.

#### 6. Version 0.15.3 Minor Release (`VERSION_0.15.3_DESIGN.md` | 310 Lines)
- **Title:** Multi-Tiered Faction Demands, Ultimatums & Faction Summit Engine
- **Scope:** 6 Requirements (`REQ-144` to `REQ-149`: 2 Medium, 4 Small).
- **Key Features:** Tiered demands engine, chronic low happiness ultimatum triggers (<35 for 2 turns), bolting mechanics, and chair-convened summits.

#### 7. Version 0.15.2 Minor Release (`VERSION_0.15.2_DESIGN.md` | 240 Lines)
- **Title:** Discontent-Gated Lawmaker Courting & Party Leadership Hierarchy
- **Scope:** 5 Requirements (`REQ-139` to `REQ-143`: 1 Medium, 4 Small).
- **Key Features:** Courting discontent gate (happiness <= 40), non-racial ideological bridge requirements, and party tier demands.

#### 8. Version 0.15.1 Minor Release (`VERSION_0.15.1_DESIGN.md` | 420 Lines)
- **Title:** 38-Faction State Allocation Matrix & Dual-Meter Health Engine
- **Scope:** 8 Requirements (`REQ-131` to `REQ-138`: 3 Medium, 5 Small).
- **Key Features:** Integration of `FACTION_STATE_ALLOCATION_MATRIX.csv`, dual-meter Happiness & Confidence tracking, and 155M scale synchronization.

#### 9. Version 0.15.0 Major Landmark Specification (`VERSION_0.15_DESIGN.md` | 780 Lines)
- **Title:** The Living Electorate & Factions Realignment Engine
- **Scope:** 1 Huge Milestone (`HUG-01` delivering `REQ-106` to `REQ-130`).
- **Key Features:** The 1/4th Shift Realignment Rule, inter-cycle voter persistence, synchronized faction realignment, and candidate traits taxonomy.

#### 10. Version 0.14.6 Minor Release (`VERSION_0.14.6_DESIGN.md` | 260 Lines)
- **Title:** 2028 Electoral Baseline Calibration & National Environment Drift
- **Scope:** 6 Requirements (`REQ-100` to `REQ-105`: 1 Medium, 5 Small).
- **Key Features:** Fine-tuning the D+9 opening environment, Ossoff/Vance ticket adjustments, and presidential coattail multipliers.

# 8. Backlog Architecture & Maintenance Protocols

The living backlog is maintained in `DESIGN_BACKLOG.md`. The incoming AI must understand how to read, expand, and maintain this file:

### 8.1 Build Threshold Rules
1. **Standard Major Build (`0.x.0`):**
   - **Massive (Macro Engine):** 1 Massive change constitutes its own multi-day standalone cycle.
   - **Major / Huge:** 1 Huge change **OR** 3 Large changes.
   - **Medium:** 5 Medium changes.
   - **Small:** 5 to 10 Small changes.
   - **Tiny:** All pending Tiny changes.
   - Increments the second version digit (`0.x.0`).
2. **Minor Version Build (`0.0.x`):**
   - Triggered when the user commands **"build a minor version"**.
   - Packages **ALL pending Small and Tiny proposals**, and **up to 5 Medium proposals**.
   - Increments the third version digit (`0.0.x`, e.g. `0.16.0` $\to$ `0.16.1`).

### 8.2 Requirement Sizing Guidelines
| Sizing Tier | Scope of Work | Typical Changes & Modules Affected |
| :--- | :--- | :--- |
| **Massive** | Macro Architecture | Multi-day structural overhaul; 4+ new modules; historical systems (`MAS-01`). |
| **Huge** | Major System Pillar | Full subsystem rewrite; 500+ lines of math; new multi-phase loop. |
| **Large** | Significant Feature | Deep algorithmic feature touching 2–3 existing files (e.g. Brokered Convention). |
| **Medium** | Focused Subsystem | Multi-screen modal flow, state machine branch, or delegate tracker. |
| **Small** | Targeted Enhancement | Self-contained rule, formula tweak, new action button, or visual card. |
| **Tiny** | Minor Polish / Event | Single event text change, color tweak, badge label, or constant update. |

### 8.3 Post-Release Backlog Maintenance Protocol (Nov 14, 2026)
Whenever an update is released:
1. **Selective Archival ONLY:** Move ONLY the features that were actually implemented into `PRIOR_UPDATES.md`.
2. **Preserve All Pending Items:** Never clear or reset the backlog. Carry forward all unbuilt and TBD items.
3. **Inventory Count Recalibration:** Recalculate Section 1 summary counts to reflect remaining work.

# 9. User Communication Patterns & Similar Word Propensities

> **CRITICAL ADVICE FOR THE INCOMING DESIGN AGENT:**
> The project owner has a well-documented propensity for using conversational, natural-language phrases that share similar words or have subtle context-dependent meanings. A literal or robotic interpretation of these phrases has repeatedly caused severe misunderstandings, broken protocols, and burned quota. Study this disambiguation guide carefully!

### 9.1 The Master Disambiguation Dictionary

#### 1. "Build" vs. "Design / Plan"
- **The Trap:** In software development, "build" usually means compile code or implement features. When the user said *"build a minor version"*, prior agents reflexively opened code files and started editing JavaScript.
- **The True Meaning:** When speaking to a **Design Agent**, "build a minor version" means **"author the design document and package the requirements for the minor version"**. It NEVER means edit code! Coding is exclusively delegated to a Coding Agent via handoff prompts.

#### 2. "You" vs. "The Workspace"
- **The Trap:** When the user says *"We need to implement protocols that stop you from ever editing code again... TO BE CLEAR: I ONLY MEAN YOU, THIS AGENT, THIS CHAT, NOT THE WORKPLACE"*, they are distinguishing between **this conversational Design Agent persona** and the **workspace's technical capabilities**.
- **The True Meaning:** Do not strip coding rules or release instructions out of `GEMINI.md` for other subagents or coding chats. Restrict the prohibition strictly to **THIS agent in THIS chat session**.

#### 3. "Design Log" vs. "Design Backlog" vs. "Design Doc"
- **The Trap:** Agents sometimes assume "design log" is a separate audit file, creating redundant documents.
- **The True Meaning:** The user uses "design log" and "design backlog" interchangeably to refer to `DESIGN_BACKLOG.md`. A "design doc" refers to a version-specific specification like `VERSION_0.16.1_DESIGN.md`.

#### 4. "Pending Updates" vs. "Shipped Updates" vs. "Backlog"
- **Pending Updates:** Features approved and sized in `DESIGN_BACKLOG.md` awaiting implementation.
- **Shipped Updates:** Implemented features archived in `PRIOR_UPDATES.md`.
- **TBD / Conceptual Updates:** Unsized, exploratory ideas tracked in `TBD_UPDATES.md`.

#### 5. "Small Changes" vs. "Minor Version"
- "Small changes" refers to individual requirements sized as `Small` (1–2 days of work).
- "Minor version" refers to the packaged release (`0.x.(y+1)`) combining all pending Small/Tiny items and up to 5 Medium items.

#### 6. "Revert" / "Did you revert it?"
- **The Trap:** When the user asked *"Were all the changes you made reverted?"*, the agent ran extensive terminal commands and delayed for minutes.
- **The True Meaning:** The user wanted an immediate, 3-second direct confirmation ("Yes, all changes are reverted"), not a tool marathon.

### 9.2 The Golden Disambiguation Rule
**Rule:** Whenever the user uses a phrase with dual interpretations or mentions two terms with nearly identical functions, **ASK THE USER FOR CLARIFICATION DIRECTLY IN PLAIN TEXT** rather than making assumptions or executing actions!

# 10. Version Naming & Packaging Procedures

The project uses Semantic Versioning adapted for political campaign simulation: `0.Major.Minor` (or `0.Milestone.Patch`).

### 10.1 Version Numbering Rules
1. **Major Landmark Releases (`0.x.0`):**
   - Triggered when delivering a **Massive** architecture milestone (`MAS-01`), a **Huge** subsystem (`HUG-01`), or 3 Large features.
   - Bumps the second digit (`0.15.0` $\to$ `0.16.0`).
2. **Minor Version Releases (`0.x.y`):**
   - Triggered when packaging all pending Small/Tiny items and up to 5 Medium items.
   - Bumps the third digit (`0.16.0` $\to$ `0.16.1` $\to$ `0.16.2`).

### 10.2 Minor Version Release Checklist for Coding / Integration Agents
When a Coding Agent finishes implementing a minor version, it must execute this 7-step release sequence:
1. **Bump `package.json`:** Increment `version` and update description.
2. **Bump `SAVE_KEY` in `engine.js`:** Increment key (e.g. `partyChairGame.save.v16.0` $\to$ `partyChairGame.save.v16.1`) while preserving backward-compatible migration.
3. **Bump Engine Version Strings:** Update version strings in `createGame()`, `normalizeGame()`, and `startNextCycle()`.
4. **Bump UI Version Badge:** Update badge in `app.js` header.
5. **Update Documentation:** Record shipped changes in `PRIOR_UPDATES.md`; archive implemented items from `DESIGN_BACKLOG.md`.
6. **Verify Automated Tests:** Run Node test scripts (`node scripts/test-mas01-phase4.cjs`) to confirm 100% pass.
7. **Rebuild Windows Executable:** Execute `powershell -ExecutionPolicy Bypass -File .\build.ps1` to produce the refreshed binary in `dist/release/Coalition Builder - Party Chair.exe`.

# 11. Master Handoff Prompts & Templates

Below are ready-to-copy, 100% self-contained prompts formatted in clean fenced code blocks for immediate use:


## 11.1 Copy-Pastable Prompt for Incoming Design Agent

```text
You are the dedicated Design Agent for Coalition Builder: Party Chair, a macro political grand strategy simulation.

READ-FIRST DOCUMENTS:
1. Read MASTER_DESIGN_AGENT_HANDOFF.md in the workspace root. It is the authoritative 100% self-contained guide containing all game mechanics, individual numbers, formulas, 38 factions, 10 pillars, 26 party systems, backlog queues, style guides, and user communication patterns.
2. Read VERSION_0.16.1_DESIGN.md for the fully designed 29-requirement package.
3. Read DESIGN_BACKLOG.md for the current active backlog queues.

IRONCLAD DESIGN AGENT INVARIANTS:
- ZERO CODE EDITS: You are strictly a Design Agent. Under NO circumstance may you edit, create, or delete code files (.js, .css, .html, .cs, package.json). Permitted files: .md only.
- DEFINITION OF "BUILD": When the user says "build a minor version" or "build an update", it means author design documents, size requirements, and generate copy-pastable prompts for a Coding Agent.
- 155M SCALE: All voter totals represent 155 million US voters. Never display or mention the internal 1.55 sample abstraction.
- ATMOSPHERIC VIBES: Obscure raw math and percentages. Use qualitative political narrative cues.
- ZERO IN-GAME REQ TAGS: Requirement IDs (REQ-XX) must never appear in player UI.
- DEFAULT SIZING GROUPING: Whenever listing or reporting backlog items, ALWAYS group primarily by SIZE (Massive, Huge, Large, Medium, Small, Tiny) by default.
- HANDOFF PROMPTS: Always provide self-contained handoff prompts in clean fenced code blocks (```text).

Acknowledge your role, confirm the zero-code-edit invariant, and ask the user which design milestone they wish to address.
```


## 11.2 Copy-Pastable Prompt for Coding / Implementation Agent (Version 0.16.1)

```text
You are the Implementation / Coding Agent for Coalition Builder: Party Chair.

TASK: Implement Version 0.16.1 as specified in VERSION_0.16.1_DESIGN.md.

SCOPE (29 Requirements / 8 Medium, 21 Small across 4 Clusters):
- Cluster A: Presidential Primaries & Convention Calendar (REQ-195 to REQ-203 in presidential-primaries.js)
- Cluster B: Statutory Ballot Access & Uncertainty Models (REQ-204 to REQ-211 in ballot-access.js and election-drift.js)
- Cluster C: Candidate Vetting & Faction Drift (REQ-212 to REQ-219 in engine.js)
- Cluster D: Election Night Decision Desk Screen (REQ-220 to REQ-223 in election-night-engine.js and app.js)

RELEASE REQUIREMENTS:
1. Bump package.json to 0.16.1.
2. Bump SAVE_KEY to partyChairGame.save.v16.1 in engine.js with backward-compatible migration.
3. Bump engine version strings and app.js UI badge.
4. Update PRIOR_UPDATES.md and DESIGN_BACKLOG.md.
5. Verify tests: node scripts/test-mas01-phase4.cjs must pass 100%.
6. Rebuild executable: powershell -ExecutionPolicy Bypass -File .\build.ps1.
```

