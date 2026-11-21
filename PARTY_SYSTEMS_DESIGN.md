# Coalition Builder: Party Chair — Party Systems Master Design Document (MAS-01)

> **Feature Code:** `MAS-01` (The Party Systems Evolution Engine)  
> **Target Release:** Version `0.16.0` (Comprehensive Massive Release)  
> **Document Status:** Complete Developer-Ready Master Design Specification  
> **Implementation Scope:** 4 Staged Implementation Phases covering all 26 Historical & Emergent Party Systems, the 41-Issue Swap Pipeline, Independent Presidential Campaigns, Nationwide MMP Coalition Governance, and the Synthetic Suffrage Expansion.  
> **Save Compatibility Target:** Migrates cleanly from `partyChairGame.save.v15.8` (and `v15.9`) $\to$ `partyChairGame.save.v16.0`.

---

## 1. Executive Architecture & Global State Schemas

### 1.1 Architectural Purpose & Modular File Structure
`MAS-01` introduces a macro-historical evolution engine simulating multi-decade realignments across American political history. Rather than allowing campaigns past 2036 to remain static repetitions of the 7th Party System (The Modern Populist Era: 2006–Current), the engine models profound demographic, institutional, technological, and ideological sea changes.

To maintain strict modularity, high performance, and token-efficient edits across the 10,000+ line codebase, all Party Systems logic and data are split into dedicated modules alongside core engine hooks:

```
party-chair-game/
├── party-systems-data.js        # Catalog of 26 eras, 167 era-exclusive issues, replacement maps, archetype profiles
├── party-systems-engine.js      # State machine, eligibility floors, transition roller, hook dispatcher, issue-swapper
├── party-systems-ui.js          # Historic Realignment modal, Era Dossier, Active Era Badge, Historical Timeline
├── party-systems-coalition.js   # Era #18 Post-Election Coalition Negotiation Loop & Stability Meter
├── party-systems-robots.js      # Era #16 Synthetic suffrage models, 310M+ voter math & Robot Parties
├── issues-0.2.1.js              # Base platform catalog (41 active issues maintained)
├── engine.js                    # Ingests hook dispatchers during turn, primary, and election lifecycles
├── app.js                       # Renders top-bar era badges, dossiers, and decision modals
└── styles.css                   # Aesthetic atmospheric styling for era modals and dossiers
```

---

### 1.2 Global Game State Schema (`game.partySystems`)

```javascript
game.partySystems = {
  // Current Era Status
  currentEraId: 'era_07_baseline',       // 'era_01_anti_extremist' through 'era_26_post_citizens_united'
  currentEraNumber: 7,                   // 7, 8, 9, 10...
  currentEraStartYear: 2006,             // Year the active 7th era began (2006 Democratic wave & rise of modern populism)
  priorErasHistory: [                    // Audit trail of completed historical (1st–6th) and gameplay eras
    { eraId: 'era_hist_01', eraNumber: 1, name: 'The Federalist Era', startYear: 1792, endYear: 1828, catalyst: 'Founding constitutional debates and Federalist vs. Democratic-Republican divide' },
    { eraId: 'era_hist_02', eraNumber: 2, name: 'The Antebellum Era', startYear: 1828, endYear: 1860, catalyst: 'Jacksonian democracy, mass suffrage mobilization, and the Whig opposition' },
    { eraId: 'era_hist_03', eraNumber: 3, name: 'The Industrial Era', startYear: 1860, endYear: 1896, catalyst: 'Civil War realignment, Union Republican hegemony, and Gilded Age urbanization' },
    { eraId: 'era_hist_04', eraNumber: 4, name: 'The Progressive Era', startYear: 1896, endYear: 1932, catalyst: '1896 McKinley realignment, trust-busting, direct primaries, and regulatory state' },
    { eraId: 'era_hist_05', eraNumber: 5, name: 'The Liberal Era', startYear: 1932, endYear: 1966, catalyst: 'New Deal coalition, organized labor expansion, and post-war welfare state' },
    { eraId: 'era_hist_06', eraNumber: 6, name: 'The Conservative Era', startYear: 1966, endYear: 2006, catalyst: 'Southern realignment, Reagan coalition, deregulation, and tax-cut economics' },
    // Active 7th era is archived here with its certified endYear upon transition to the 8th Party System:
    // { eraId: 'era_07_baseline', eraNumber: 7, name: 'The Modern Populist Era', startYear: 2006, endYear: 2044, catalyst: '2006 Democratic Wave & Emergence of Modern Populism' }
  ],

  // Transition Engine State
  transitionRollHistory: {},             // Keyed by cycle year: { rolled: true, probability: 0.15, roll: 0.42, triggered: false }
  experiencedEraIds: ['era_07_baseline'], // Invariant: No era may ever repeat

  // 41-Issue Platform Live State
  activeIssueIds: [                      // Strictly clamped at exactly 41 active issues at all times
    'taxes-spending', 'corporate-tax-rate', 'wealth-tax', 'cost-of-living', 'business-regulation', 'monetary-policy',
    'defense-spending', 'iran-policy', 'israel-palestine',
    'climate-action', 'energy-mix', 'green-standards',
    'religious-liberty', 'church-state-schools', 'faith-based-funding',
    'medicare-social-security', 'health-coverage', 'child-tax-credit', 'prescription-drugs', 'snap-food-aid',
    'voting-rights', 'campaign-finance-reform', 'supreme-court-reform', 'filibuster-reform', 'election-certification', 'insider-influence',
    'border-security', 'asylum-reform', 'pathway-to-citizenship', 'sanctuary-cities',
    'crime-enforcement', 'gun-rights', 'police-reform', 'drug-decriminalization',
    'free-trade-tariffs', 'china-competition', 'ukraine-aid',
    'antitrust-big-tech', 'ai-compute-regulation',
    'housing-development', 'crypto-regulation'
  ],
  sunsettedIssueIds: [],                 // Retired issues removed from all player menus, bills, and polling models
  eraExclusiveIssuesActive: [],          // Active issues introduced by current/prior eras

  // Subsystem States
  independentPresidency: {               // Prerequisite subsystem active across all eras
    activeCampaign: null,                // Null or active Independent candidate object
    lastRunYear: null,
    totalRuns: 0,
    victories: 0
  },

  // Bespoke Era Storage (Hydrated only when specific eras trigger)
  moderateParty: null,                   // Era #2 state (factions, defections)
  regionalParties: null,                 // Era #10 state (6 regional parties, territorial maps)
  coalitionSystem: null,                 // Era #18 state (2-faction cap, MMP, 3-4 national coalitions, Stability Meter)
  robotCitizenship: null,                // Era #16 state (310M+ represented voter pool, 4 robot parties)
  postCitizensUnited: null               // Era #26 state (Super PAC dissolution, Democracy Vouchers)
};
```

---

### 1.3 Strict Eligibility Floor & Escalating Probability Mechanics

#### 1. Eligibility Floors
- **8th Party System Floor:** Under no circumstances may any 8th Party System (including Weight-3 Triggered Eras) fire before **2040**.
- **9th+ Party System Floor:** No subsequent Party System (9th, 10th, etc.) may fire until at least **30 years** have elapsed since the start year of the preceding Party System (`year >= currentEraStartYear + 30`).

#### 2. Per-Cycle Escalating Transition Probability Roll
The legacy 2050–2060 timeout table is completely retired. When a campaign reaches an eligible election cycle, the engine rolls **once per 2-year election cycle** during `startNextCycle()`:
- **Starting Probability:** **10%** in the first eligible cycle (`2040` for Era 8; `currentEraStartYear + 30` for Era 9+).
- **Escalation Cadence:** Flat **+5% per 2-year cycle**:
  $$\text{Probability}(Y) = 0.10 + 0.05 \times \left(\frac{Y - Y_{\text{floor}}}{2}\right)$$
  - *2040:* 10%
  - *2042:* 15%
  - *2044:* 20%
  - *2046:* 25%
  - *2048:* 30%
  - *2050:* 35%
  - ...
  - *2076:* 100% (Guaranteed transition timeout).
- If the transition roll succeeds, the engine immediately calls `selectNextPartySystem(game)` to pick the new era from the weighted pool.

---

### 1.4 Weighted Era Selection Pool

When a transition roll succeeds, all 26 eras are evaluated for eligibility. Each eligible era carries a deterministic weight:

$$\text{Weight}(E) = \begin{cases} 
5 & \text{if } E \in \text{Group E (Follow-Up Eras) AND Predecessor Era active AND } \Delta\text{Years} \ge \text{Threshold} \\
3 & \text{if } E \in \text{Groups A, B, C (Triggered Eras) AND Trigger Condition Met} \\
1 & \text{if } E \in \text{Group D (Normal Eras)} \\
0 & \text{if } E \text{ has already occurred (No-Repeat Invariant) OR Floor/Trigger unmet}
\end{cases}$$

Selection uses a standard weighted random lottery:
```javascript
function selectNextPartySystem(game) {
  const candidates = getEligiblePartySystems(game);
  if (!candidates.length) return null;
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const c of candidates) {
    if (roll < c.weight) return c.era;
    roll -= c.weight;
  }
  return candidates[0].era;
}
```

---

### 1.5 Extensible Era Plugin/Hook Contract
All 26 Party Systems implement the standardized `PartySystemPlugin` interface. This ensures `engine.js` remains clean and never requires sprawling hardcoded `switch(era)` blocks across simulation loops:

```javascript
const PartySystemPluginContract = {
  id: 'era_string_id',
  number: 8,
  title: 'In-Universe Era Title',
  category: 'Group A | B | C | D | E',
  weight: 1, // 1, 3, or 5

  // Lifecycle Hooks
  checkEligibility: (game) => boolean,
  onEraEnter: (game, priorEra) => void,
  onEraExit: (game, nextEra) => void,
  onCycleStart: (game) => void,
  onTurnStart: (game, turnStep) => void,
  onPrimaryResolve: (game, results) => void,
  onElectionResolve: (game, outcome) => void,

  // Calculation Modifiers (Return delta or multiplier)
  getTurnoutModifier: (game, party, state) => number,
  getFundraisingModifier: (game, party, type) => number,
  getNationalWindModifier: (game) => number,
  getStrategicDefectionModifier: (game, partyId, stateId) => number,

  // UI & Realignment Ingestion
  getDecisionModal: (game) => object | null, // If player must choose a party or path
  getEraDossierContent: (game) => object     // Qualitative atmospheric narrative
};
```

---

## 2. Dynamic 41-Issue Swap Pipeline & Metadata Engine

### 2.1 The 41-Issue Platform Balance Invariant
To prevent UI bloat, platform clutter, and legislative paralysis, the active policy platform is **strictly clamped at exactly 41 active issues**. When a new era dawns:
1. **7th $\to$ 8th Transition:** Exactly $N$ ($5$ to $10$) era-exclusive issues enter the platform, and the exact $N$ paired baseline issues designated in the 1-to-1 Issue Swap Catalog are retired.
2. **9th+ Transition (Living History Stacking):** Exactly $N$ new era-exclusive issues enter the platform. To preserve continuity, Era 8's issues are **not** wiped automatically. Instead, the engine picks $N$ currently active issues at random to sunset—giving Era 8's issues a proportional, non-guaranteed chance of retirement.

```javascript
function executeEraIssueSwap(game, newEra) {
  const swaps = newEra.issueSwaps; // Array of { add: IssueDefinition, retireId: string }
  const isEra8 = game.partySystems.currentEraNumber === 7; // Moving into Era 8

  swaps.forEach((swap) => {
    let issueToSunset = null;
    if (isEra8) {
      issueToSunset = swap.retireId;
    } else {
      // Pick random active issue that is NOT the issue being added
      const candidates = game.partySystems.activeIssueIds.filter((id) => id !== swap.add.id);
      issueToSunset = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // 1. Retire the sunsetted issue
    retireIssue(game, issueToSunset);

    // 2. Introduce the new era-exclusive issue
    introduceIssue(game, swap.add);
  });
}
```

---

### 2.2 Starting Stance Initialization Algorithm ($\pm 2$ Clamped)
When a new era-exclusive issue is introduced, parties do **not** blindly copy the retired issue's stance. Stances are initialized based on ideological affinity:

1. **Category Match:** If the new issue belongs to an existing issue category (e.g., `Economic & Fiscal`), calculate the party's current average stance across all active issues in that category:
   $$\text{AvgStance}_{\text{cat}} = \frac{1}{|I_{\text{cat}}|} \sum_{i \in I_{\text{cat}}} \text{stance}(P, i)$$
   Initialize starting stance randomly within $\pm 2.0$ points of that average:
   $$\text{Stance}(P, i_{\text{new}}) = \text{clamp}\left(\text{Round}\left(\text{AvgStance}_{\text{cat}} + (\text{rand}(-2.0, 2.0))\right), 1, 10\right)$$
2. **Brand-New Issue Category Fallback:** If the issue represents a completely novel domain with no active category issues, calculate the party's overall average across all 41 active issues:
   $$\text{AvgStance}_{\text{overall}} = \frac{1}{41} \sum_{i \in I_{\text{active}}} \text{stance}(P, i)$$
   $$\text{Stance}(P, i_{\text{new}}) = \text{clamp}\left(\text{Round}\left(\text{AvgStance}_{\text{overall}} + (\text{rand}(-2.0, 2.0))\right), 1, 10\right)$$

---

### 2.3 Faction Key-Issue Automatic Replacement Rule
Every faction in `factions-0.15.js` tracks 2 Key Issues. If a Party System transition sunsets an issue that is a faction's Key Issue:
- The faction automatically scans currently active issues within the **same issue category**.
- It designates the active issue where the faction's desired stance has the highest salience as its new Key Issue.
- If no other issue exists in that category, it selects an active issue from its primary ideological axis (`economic`, `social`, or `climate`).
- This guarantees zero broken UI references, NaN calculations, or empty faction cards.

---

### 2.4 Complete 167-Issue Metadata Catalog (All 26 Eras)
Every era-exclusive issue is assigned full metadata matching `issues-0.2.1.js` schema (`id`, `label`, `category`, `pillarId`, `axis`, `lowLabel`, `highLabel`, and 10 discrete stance strings).

The standardized categories are:
- `Economic & Fiscal` (Pillar 1)
- `Foreign Affairs & Defense` (Pillar 2)
- `Climate & Energy` (Pillar 3)
- `Rights, Faith & Culture` (Pillar 4)
- `Health, Family & Labor` (Pillar 5)
- `Governance, Democracy & Electoral` (Pillar 6)
- `Immigration, Borders & Demographics` (Pillar 7)
- `Law, Justice & Technology` (Pillar 8)
- `Era-Exclusive Novel Categories` (Synthetic Personhood, Planetary Weather Engineering, Regional Devolution)

*(The full programmatic definition of all 167 issues with 10-tier stance texts is housed in `party-systems-data.js` as detailed in Section 3).*

---

## 3. Phase 1 Specification — Core State Machine, Independent Presidential Campaigns & UI Shell

### 3.1 Deliverables & Scope
Phase 1 builds the foundational infrastructure upon which all 26 eras operate:
1. `PartySystemEngine` core state machine and transition eligibility engine.
2. The dynamic 41-Issue Swap Pipeline (`retireIssue`, `introduceIssue`, stance initialization, faction Key-Issue replacement).
3. **Independent Presidential Candidates Subsystem** (active starting in 2028; essential prerequisite for Era #5).
4. Player-facing UI Shell (*Historic Realignment* fullscreen modal, top-bar *Active Era Badge*, qualitative *Era Dossier*, and *Historical Era Timeline*).
5. Save-game normalization and backward migration from `v15.8` / `v15.9`.

---

### 3.2 Independent Presidential Candidates Subsystem

#### 1. Cadence & Polling Tiers
- Evaluated in `startNextCycle()` whenever `game.year % 4 === 0` (Presidential election years).
- **Baseline Probability:** **20%** chance per presidential election (1 in 5 presidential cycles on average).
- **Opening Polling Tier Roll:**
  - `50%`: Fringe Outsider ($< 5.0\%$ opening poll)
  - `30%`: Notable Contender ($5.0\%–10.0\%$ opening poll)
  - `15%`: Serious Third Force ($10.0\%–25.0\%$ opening poll)
  - `5%`: Historic Titan ($> 25.0\%$ opening poll)

#### 2. Candidate Generation & Archetypes
Independent candidates are generated with procedural traits, high starting Fame (`65–95`), independent wealth, and coherent policy stances:
- **Centrist Technocrat:** Fiscal moderate (5.0), pro-tech, high Integrity, draws equally from suburban Democrats and business Republicans.
- **Anti-Establishment Populist:** High Charisma, anti-trade, anti-war, high Fieldcraft, siphons working-class and rural voters from both parties.
- **Self-Funded Reformer:** Extreme fundraising pool ($100M+ independent warchest), pro-campaign-finance reform, moderate stances.
- **Maverick Former Governor/Senator:** High Experience (8–9), established regional base in home state/region, draws heavy state coattails.

#### 3. Dual-Party Siphoning & Electoral Resolution
In `presidentialStateMargin(game, stateId)` and `supportByState(game, state)`:
- Independent candidates peel votes from major parties based on two-axis Euclidean proximity:
  $$\Delta\text{Vote}_{\text{dem}} = \text{IndSupport} \times \frac{\text{Distance}(\text{Ind}, \text{Rep})}{\text{Distance}(\text{Ind}, \text{Dem}) + \text{Distance}(\text{Ind}, \text{Rep})}$$
  $$\Delta\text{Vote}_{\text{rep}} = \text{IndSupport} \times \frac{\text{Distance}(\text{Ind}, \text{Dem})}{\text{Distance}(\text{Ind}, \text{Dem}) + \text{Distance}(\text{Ind}, \text{Rep})}$$
- If an Independent wins state pluralities, they receive those Electoral Votes directly (`REQ-190`).
- If an Independent wins the White House, `game.governingParty = 'independent'`. Major parties lose presidential incumbency bonuses, and legislation requires cross-caucus deals.

---

### 3.3 UI Shell Components & Copy Guidelines

#### 1. Fullscreen "Historic Realignment" Transition Modal (`app.js`, `styles.css`)
Fires once when an era transition roll succeeds upon cycle entry:
- **Header:** Historical Chronicle Title (e.g., *"Dawn of the 8th Party System: The Generational Succession Crisis"*).
- **Chronicle Body:** 2–3 paragraphs of atmospheric narrative describing the political collapse of the old order and the emergence of the new fault line.
- **Issue Transition Ledger:** Displays the $N$ incoming era-exclusive issues with their category tags alongside the $N$ sunsetted issues marked with a strike-through styling.
- **Era-Entry Decision (if applicable):** If the era features a Chair decision (e.g., defecting to the Moderate Party, picking a post-breakup party in Era #18, or chairing a Robot Party in Era #16), presents the decision cards with confirmed voter metrics before proceeding.
- **Dismissal:** Single gold button: `[ Enter the New Political Era ]`.

#### 2. Top-Bar Active Era Badge & Qualitative Era Dossier
- Placed in the master app header next to the Turn/Year indicator.
- Styled with an ancient parchment / neoclassical Roman numeral badge: `🏛️ VIII: The AI Boom`.
- Clicking opens the **Qualitative Era Dossier** modal:
  - Atmospheric narrative detailing dominant ideological fault lines.
  - Active legislative dynamics and cultural mood.
  - **Atmospheric Rule Enforced:** Strictly zero raw transition percentages, weights, internal multipliers, or `REQ-XX` tags.

#### 3. Historical Era Timeline ("Constitutional Chronicle")
Rendered in the **History Tab** below election results, displaying a permanent, chronological timeline of American party systems across history and gameplay:

##### Canonical Party Systems Chronology
The game establishes the following canonical dates and titles for the seven American party systems:

| Era | Ordinal / Roman | Active Years | Canonical Title | Historical Catalyst / Defining Character |
| :---: | :---: | :---: | :--- | :--- |
| **7th** | **VII** | **2006 – Current** *(ends when 8th starts)* | **The Modern Populist Era** | Rise of 21st-century populist movements, sparked by the 2006 Democratic wave and 50-state strategy, followed by Obama's coalition and Trump's working-class realignment. |
| **6th** | **VI** | **1966 – 2006** | **The Conservative Era** | Southern realignment, the Reagan coalition, supply-side deregulation, Contract with America, and post-Cold War market dominance. |
| **5th** | **V** | **1932 – 1966** | **The Liberal Era** | FDR's New Deal coalition, organized labor expansion, social security, and mid-century federal public investment. |
| **4th** | **IV** | **1896 – 1932** | **The Progressive Era** | The 1896 McKinley realignment, trust-busting, direct primary democratization, the 1912 Bull Moose split, and regulatory state formation. |
| **3rd** | **III** | **1860 – 1896** | **The Industrial Era** | Civil War realignment, Union Republican hegemony vs. Bourbon Democrats, Gilded Age growth, tariff battles, and rapid industrial urbanization. |
| **2nd** | **II** | **1828 – 1860** | **The Antebellum Era** | Jacksonian mass democracy, universal white male suffrage mobilization, spoils system, national party conventions, and the Whig opposition. |
| **1st** | **I** | **1792 – 1828** | **The Federalist Era** | Founding constitutional debates, rise of the partisan press, Hamiltonian federal finance, and the Jeffersonian-Madisonian Democratic-Republican counter-mobilization. |

*(When an emergent 8th Party System triggers during a campaign, the 7th Party System's `endYear` transitions dynamically from `'Present'` to the exact realignment year, e.g., `2006 – 2044`, and is permanently archived into `game.partySystems.priorErasHistory` alongside the 1st through 6th eras.)*

##### Top-Right Info Icon `(i)`, Tooltip & Philosophy Popup Modal
To explain the historical design choices behind these era demarcations, the header of the Historical Party Systems Timeline (`.era-timeline-head`) includes an interactive information button:
- **Visual Presentation:** A subtle, circular info icon button (`ⓘ`) located in the upper-right corner of the timeline container (`.era-timeline-head`).
- **Hover & Focus Tooltip:** Hovering or focusing on the icon displays an accessible native tooltip:
  > `"click for more information on the party systems years"`
- **Click Action — Era Dating Philosophy Modal:** Clicking the icon opens a styled modal dialog detailing the creator's historical-analytical framework:
  - **Core Premise:** Explains that the party systems timeline dates in *Coalition Builder: Party Chair* intentionally diverge from standard academic conventions based on a distinct historical perspective.
  - **The Two Signature Moments:** In this model, party systems are defined by two key inflection points:
    1. *The Emergence Moment:* Occurs 10–15 years prior to the "typical" textbook start date, when an insurgent political movement first emerges and demonstrates electoral viability.
    2. *The Coalescence Moment:* Occurs when that insurgent movement matures, coalesces into governing institutions, and cements a durable ideological consensus.
  - **The 7th Party System (2006 – Current):** *"For the purposes of this game, the 7th party system began in '06, when the Democrats won in a wave year, followed by Obama's presidency. Trump's populism is also important in this era - it's defined by populism, that really started with the Democrats' 50-state strategy in '06."*
  - **The 5th & 6th Party Systems (1932–1966 & 1966–2006):** *"As for the 6th and 5th, the 5th era ended in '66, because several key characteristics of that party system didn't exist in the last 14 years."* The transition began in the mid-1960s with the breakdown of the New Deal coalition and the civil rights realignment, initiating the Conservative Era in 1966 rather than 1980.

---

## 4. Phase 2 Specification — Standard Modifier & Political Realignment Eras (16 Eras)

Phase 2 implements the 16 eras that operate via macro simulation modifiers, ideological wind shifts, candidate constraints, and campaign-finance overhauls without requiring brand-new party spawning:

### 4.1 Detailed Specifications for Eras #1, #4, #5, #6, #7, #8

#### Era #1: The Anti-Extremist Coalition (Group A · Weight = 3)
- **Trigger:** Winning presidential candidate has average stance $\ge 9.0$ or $\le 2.0$ across Pillars 1–6.
- **Simulation Modifiers:**
  - Non-aggression pacts: In states where an extremist faction candidate runs, moderate candidates of opposing major parties receive a $+4.0\%$ cross-endorsement boost.
  - Independent caucusing surges: Disillusioned moderates in the House/Senate gain $+25\%$ defection likelihood to Independent status.
- **Issue Swaps (5):** Introduces *Cross-Party Fusion & Front Endorsements*, *Constitutional Guardrails*, *Anti-Authoritarian Civic Education*, *Non-Aggression Pact Primary Rules*, *Independent Judiciary Expansion*; retires `iran-policy`, `israel-palestine`, `faith-based-funding`, `prescription-drugs`, `snap-food-aid`.

#### Era #4: The Landslide Realignment Era (Group B · Weight = 3)
- **Trigger:** Any party wins the national popular vote by $\ge 20.0\%$ OR holds $\ge 40$ state trifectas.
- **Simulation Modifiers:**
  - Wave volatility multiplier: National Environment shifts apply with a $1.8\times$ multiplier.
  - Landslide momentum: Winning party gains $+6.0\%$ turnout surge; opposition suffers severe base apathy ($-15$ Faction Happiness).
- **Issue Swaps (5):** Introduces *Supermajority Amendment Agenda*, *National Reconstruction Mega-Appropriations*, *Federal Preemption of Opposition Laws*, *Minority Filibuster Protections*, *Sweeping Judiciary Reorganization*; retires canonical 5 baseline issues.

#### Era #5: The Independent Surge Era (Group B · Weight = 3)
- **Trigger:** An Independent candidate wins the Presidency.
- **Simulation Modifiers:**
  - Downballot independent candidacies: Serious Independent candidates spawn in $\approx 50\%$ of all House and Senate races (heavily concentrated in safe non-competitive districts).
  - Wasted-vote penalty for independents collapsed to $0\%$.
- **Issue Swaps (5):** Introduces *Nonpartisan Ballot-Line Parity*, *Independent Presidential Debate Qualification*, *Cross-Caucus Committee Assignment Rights*, *Open Nonpartisan Primaries*, *Anti-Party-Monopoly Funding Rules*; retires canonical 5 baseline issues.

#### Eras #6 & #7: Left-Wing Replacement & Right-Wing Replacement (Group C · Weight = 3)
- **Triggers:**
  - *Left-Wing:* Non-major progressive party wins White House or Congressional Majority with policy stance $\le 3.0$; Democrats hold neither.
  - *Right-Wing:* Non-major conservative party wins White House or Congressional Majority with policy stance $\ge 7.0$; Republicans hold neither.
- **Simulation Modifiers:**
  - Displaced major party permanently loses major-party model, relegated to Tier 2 minor-party standing.
  - Ascendant third party gains permanent Tier 5 Major Party model and inherits institutional donor conduits.
- **Issue Swaps (5 each):** See Master Issue Swap Catalog in `DESIGN_BACKLOG.md`.

#### Era #8: Ideologies Cool (Group C · Weight = 3)
- **Trigger:** Democratic leader has 4+ stances $\ge 6.0$ OR Republican leader has 4+ stances $\le 4.0$.
- **Simulation Modifiers:**
  - Depolarization wave: Base turnout drops by $8\%$, while suburban independent turnout elasticity surges.
  - Extremist candidates suffer a $-5.0\%$ general election penalty.
- **Issue Swaps (5):** Introduces *Technocratic Policy Commissions*, *Depolarized Civic Media Funding*, *Pragmatic Public-Private Infrastructure*, *Cross-Partisan Sunset Reviews*, *Outcome-Based Federal Grant Audits*; retires canonical 5 baseline issues.

---

### 4.2 Detailed Specifications for Eras #9, #11, #12, #13, #14, #15, #19, #20, #21, #26

#### Era #9: The 5th Great Awakening (Group D · Weight = 1)
- **Narrative & Dynamics:** Historic Christian communitarian revival. National average state stance on Pillar 4 shifts to $7.0$.
- **Simulation Modifiers:** Candidates with Pillar 4 stances $\le 4.0$ suffer a $-6.0\%$ general election penalty and $-25\%$ volunteer drive yield.
- **Issue Swaps (8):** Introduces *Sabbath Commerce Mandate*, *Moral Literacy Curriculum*, *National Day of Fasting*, *Faith-Based Charity Tax Precedence*, *Parochial Hospital Conscience Exemptions*, *Family-Wage & Covenant Marriage*, *Public Morality Broadcast Standards*, *Ecumenical Welfare Councils*; retires 8 baseline issues.

#### Era #11: The Generational Succession Crisis (Group D · Weight = 1)
- **Narrative & Dynamics:** Under-35 voters flood the electorate; older cohorts retire.
- **Simulation Modifiers:** Candidates aged $>65$ suffer $-8.0\%$ youth turnout penalty; candidates aged $<45$ receive $+5.0\%$ volunteer drive surge.
- **Issue Swaps (6):** Introduces *Youth Housing Abundance*, *Intergenerational Entitlement Reset*, *4-Day Workweek*, *Digital Rights Dividend*, *Higher-Ed Debt Jubilee*, *Officeholder Age Caps*; retires 6 baseline issues.

#### Era #12: The Digital Syndicate & Influencer Politics (Group D · Weight = 1)
- **Narrative & Dynamics:** Decentralized digital networks displace physical party machines.
- **Simulation Modifiers:** Physical State Chapter revenue reduced by $-50\%$. Candidates with $>80$ Fame gain $3\times$ small-dollar virality yields.
- **Issue Swaps (5):** Introduces *Creator-Economy Tax*, *Algorithmic Reach & Shadowbanning Laws*, *Viral Micro-Donor Disclosure*, *Deepfake Liability*, *Streaming Equal-Time Rules*; retires 5 baseline issues.

#### Era #13: The Green Transition Crucible (Group D · Weight = 1)
- **Narrative & Dynamics:** Climate migration reshapes Sun Belt politics; Green Party surges to $15\%–20\%$ baseline.
- **Simulation Modifiers:** Green Party receives permanent $+10.0\%$ baseline polling lift and Tier 4 Contender status. Clean-tech Super PACs out-fund fossil PACs $2:1$.
- **Issue Swaps (9):** Introduces 9 climate-transition issues (Continental Grid, Southwest Water Compact, Carbon Tariffs, etc.); retires 9 baseline issues.

#### Era #14: The Tripartite Corporatist Compact (Group D · Weight = 1)
- **Narrative & Dynamics:** Austrian/Nordic social partnership model instituted following macroeconomic crisis.
- **Simulation Modifiers:** Elections decided almost entirely on Pillars 1 & 5. Enacting legislative bills requires sign-off from both Labor and Business factions.
- **Issue Swaps (5):** Introduces *National Wage-Price Boards*, *Peak Labor/Industry Legislative Sign-Off*, *Sectoral Apprenticeships*, *Coordinated Industrial Trusts*, *Unified Social-Insurance*; retires 5 baseline issues.

#### Era #15: The AI Boom (Group D · Weight = 1)
- **Narrative & Dynamics:** Artificial Intelligence becomes the primary economic and civil axis of American politics.
- **Simulation Modifiers:** Politics realigns into Accelerationists vs. Labor Protectionists.
- **Issue Swaps (10):** Introduces 10 AI issues (Compute Sovereignty, UBI Automation Dividend, Algorithmic Audits, Synthetic Media Bans, etc.); retires 10 baseline issues.

#### Era #19: The Charismatic Movement Era (Group D · Weight = 1)
- **Narrative & Dynamics:** Personalist movements dominate party institutions (*personalismo* / Gaullism).
- **Simulation Modifiers:** Presidential nominee / leader Fame and approval carry a $2.5\times$ coattail multiplier. Leader retirement triggers a primary **Succession War**.
- **Issue Swaps (5):** Introduces *Executive Plebiscite*, *Personalist Branding Laws*, *Movement Youth Brigades*, *Succession Rules*, *Direct Address Preemption*; retires 5 baseline issues.

#### Era #20: The Permanent Emergency Cycle (Group D · Weight = 1)
- **Narrative & Dynamics:** Chronic government shutdowns and debt showdowns create constitutional whiplash.
- **Simulation Modifiers:** Incumbent party approval decays twice as fast; out-of-power opposition gains $+20\%$ fundraising and $+4.0\%$ election tailwinds.
- **Issue Swaps (5):** Introduces *Automatic CRs*, *Emergency Decrees*, *Fast-Track Impeachment*, *Debt-Ceiling Abolition*, *Continuity-of-Government Authority*; retires 5 baseline issues.

#### Era #21: The Metro League vs. Heartland Compact (Group D · Weight = 1)
- **Narrative & Dynamics:** Top 20 urban megaregions clash against rural/exurban hinterlands.
- **Simulation Modifiers:** Geographic density displaces traditional left-right divides. Mismatched candidate geographic archetypes suffer steep local penalties.
- **Issue Swaps (6):** Introduces *Direct-to-City Grants*, *High-Speed Rail vs. Highways*, *Congestion Pricing Sovereignty*, *Municipal Annexation Limits*, *Rural Infrastructure Subsidies*, *Tax-Transfer Caps*; retires 6 baseline issues.

#### Era #26: The Post-*Citizens United* Era (Group D · Weight = 1)
- **Narrative & Dynamics:** Supreme Court overturns *Citizens United*; Super PACs outlawed overnight.
- **Simulation Modifiers:** All Super PACs dissolved. High-dollar yields cut by $75\%$. Small-dollar member dues, State Chapters, and Grassroots Multipliers become paramount. `Squeaky Clean` candidates gain $+25\%$ public match.
- **Issue Swaps (6):** Introduces *Democracy Vouchers*, *Equal Airtime Mandates*, *501(c)(4) Dark-Money Ban*, *Public Matching Formula*, *Spending Caps*, *Lobbying Lifetime Ban*; retires 6 baseline issues.

---

## 5. Phase 3 Specification — Structural Party-Spawning & Follow-Up Eras (8 Eras)

Phase 3 builds the complex party-spawning algorithms, faction defections, territorial maps, and Group E predecessor follow-ups:

### 5.1 Structural Party-Spawning Eras

#### Era #2: The Moderate Party (Group A · Weight = 3)
- **Trigger:** Winning president has average policy stance $\ge 9.0$ or $\le 2.0$.
- **Party Spawning Algorithm:**
  - Creates a new major party: `id: 'moderate'`, `name: 'Moderate Party'`, `color: '#5C9E7A'` (muted green).
  - Spawns 4 dedicated factions:
    1. `mod_former_dems`: *Former Democrats (Suburban Institutionalists)*
    2. `mod_former_reps`: *Former Republicans (Fiscal Conservatives)*
    3. `mod_pragmatic_populists`: *Pragmatic Populists (Cost-of-Living Reformers)*
    4. `mod_rhetorical_moderates`: *Rhetorical Moderates (Bipartisan Tone Advocates)*
  - **Mass Defection:** All sitting Senators, Governors, and Representatives with moderate stances ($4.0–6.0$) instantly defect to the Moderate Party.
  - **Player Chair Choice:** Modal presents player with the option to defect and chair the Moderate Party or stay with their current party.
- **Issue Swaps (5):** Introduces *Bipartisan Consensus Budgeting*, *Depolarization Standards*, *Cost-of-Living Indexing*, *Anti-Polarization Primaries*, *Centrist Entitlement Reform*; retires 5 baseline issues.

#### Era #3: The 6-Party System (Group B · Weight = 3)
- **Trigger:** At least 6 distinct political parties simultaneously hold a seat in the U.S. Senate.
- **Party Restructuring:**
  - The Constitution Party formally renames itself **MAGA Party** (`id: 'constitution'`, `name: 'MAGA Party'`).
  - Electorate (155M scale) permanently fractures across 6 parties: Democrats (~10%), Republicans (~10%), Libertarians (~20%), Greens (~20%), Socialists (~20%), MAGA (~20%).
  - Legislative majorities require cross-party coalition deals (218 House / 51 Senate).
  - Player can switch to chair any of the 6 parties.
- **Issue Swaps (7):** Introduces *Multi-Party Power-Sharing*, *Lobbying Ban*, *Coalition Transparency*, *Public Financing Equalizer*, *Debate Access*, *Filibuster Rules*, *Patronage Ethics Code*; retires 7 baseline issues.

#### Era #10: Regional Parties Emerge (Group D · Weight = 1)
- **Narrative & Dynamics:** National machines collapse; 6 powerful regional parties emerge and dominate their home territories:
  1. *Appalachia:* **Mountain Labor & Energy League** (Pro-union, fossil defense, culturally traditional).
  2. *New England:* **Town Hall Civic Alliance** (Direct democracy, aggressive climate, fiscal balance).
  3. *Deep South:* **Dixie Faith & Heritage Coalition** (Religious liberty, vouchers, strict border).
  4. *The Rockies:* **Western Frontier & Public Lands League** (Anti-federal land, water sovereignty, 2A).
  5. *California:* **Pacific Commonwealth Party** (Tech incentives, single-payer, climate vanguard).
  6. *Texas:* **Lone Star Enterprise Alliance** (Zero income tax, petrochemical dominance, state grid).
- **Issue Swaps (8):** Introduces *Interstate Compact Authority*, *Regional Power Grid*, *Tax Return-to-Source*, *Regional Tariffs*, *Public Lands Devolution*, *State Border Autonomy*, *Transit Sovereignty*, *Block-Grant Replacement*; retires 8 baseline issues.

#### Era #17: Ecological Collapse (Group D · Weight = 1)
- **Narrative & Dynamics:** Catastrophic sea-level rise and aquifer depletion make ecology the dominant existential axis.
- **Green Party Massive Bonuses:**
  - $+25.0\%$ baseline national polling and registration affiliation surge.
  - $100\%$ automatic ballot access nationwide.
  - $3\times$ small-dollar fundraising yield; 0-cost chapter creation.
- **Dedicated Factions:** Replaces existing green factions with 4 dedicated environmental factions: *Eco-Liberals*, *Eco-Fascists*, *Deep Ecology Vanguard*, and *Industrial Adaptationists*.
- **Issue Swaps (9):** Introduces 9 crisis issues (Water/Power Rationing, Climate Refugees, Carbon Seizure, Agricultural Transition, Rights of Nature, etc.); retires 9 baseline issues.

---

### 5.2 Group E: Follow-Up Eras (Weight = 5)

Group E eras require a specific predecessor era and an elapsed-year threshold of at least 30 years:

#### Era #22: The Neo-Federalist Reunion (Weight = 5)
- **Predecessor Trigger:** $\ge 35$ years after **Era #10 (Regional Parties Emerge)**.
- **Dynamics:** Geopolitical/economic crises expose regional vulnerabilities. Neo-Federalist Unionists clash with Regional Autonomists. National parties gain cross-regional merger actions to absorb splintered regional machines.
- **Issue Swaps (5):** Introduces *Interstate Commerce Supremacy*, *National Grid Federalization*, *Regional Ballot Standards*, *National Tax Restoration*, *Interstate Mobility Grants*; retires 5 baseline issues.

#### Era #23: The Secular Enlightenment Revival (Weight = 5)
- **Predecessor Trigger:** $\ge 30$ years after **Era #9 (The 5th Great Awakening)**.
- **Dynamics:** Sectarian disputes between rival Christian denominations shatter religious unity; young voters lead a massive secular constitutionalist counter-wave.
- **Issue Swaps (5):** Introduces *Repeal of Blue Laws*, *Denominational Neutrality Amendment*, *Public Secularism Charter*, *Freedom of Conscience*, *Sectarian Tax-Exempt Reform*; retires 5 baseline issues.

#### Era #24: The Human-Verified Backlash (Weight = 5)
- **Predecessor Trigger:** $\ge 35$ years after **Era #15 (The AI Boom)**.
- **Dynamics:** Alternative follow-on to robot citizenship. Voters revolt against autonomous algorithms. Analog campaigning, physical tours, and human craftsmanship receive massive multipliers.
- **Issue Swaps (7):** Introduces *Ban on Autonomous Algorithms*, *Human-Made Labor Quotas*, *Analog Media Stamps*, *Compute Moratorium*, *Right-to-Human Banking*, *Screen-Free Schools*, *Human Creative Sanctuaries*; retires 7 baseline issues.

#### Era #25: The Planetary Thermostat Era (Weight = 5)
- **Predecessor Trigger:** $\ge 40$ years after **Era #13 (Green Transition)** OR **Era #17 (Ecological Collapse)**.
- **Dynamics:** Emergency survival stabilizes; politics shifts to planetary geo-engineering control. Regional water and rainfall blocs wage fierce legislative wars over cloud-seeding and weather redirection.
- **Issue Swaps (8):** Introduces *Weather-Modification Authority*, *Aerosol Treaties*, *Desalination Pipeline Grid*, *Biome Zoning*, *Ocean Fertilization*, *Climate Dividend*, *Bio-Engineered Crops*, *Climate Liability Courts*; retires 8 baseline issues.

---

## 6. Phase 4 Specification — Deep Bespoke-Mechanic Flagship Eras (2 Eras)

Phase 4 contains the two most mechanically expansive eras in the game:

### 6.1 Era #18: The Party Coalition Era

#### 1. Trigger & Overview
- **Trigger:** At least **6 distinct political parties** simultaneously hold $\ge 1$ seat in the U.S. House OR U.S. Senate.
- Operates under **Nationwide Mixed-Member Proportional (MMP)**.
- Replaces standard two-party majoritarian governance with a post-election coalition-bargaining loop consolidating all parties into **3 to 4 unified nationwide coalitions**.

#### 2. Overnight 2-Faction Party Cap & Rearrangement Algorithm
Upon era entry, all parties reorganize overnight so that **no party contains more than 2 factions**:
```javascript
function executeTwoFactionPartyReorganization(game) {
  const newParties = [];
  const expelledFactions = [];

  game.parties.forEach((party) => {
    const partyFactions = getFactionsForParty(game, party.id);
    if (partyFactions.length <= 2) return;

    // Sort factions by represented voter count (155M scale)
    partyFactions.sort((a, b) => b.voters - a.voters);

    // Retain largest faction
    const primary = partyFactions[0];

    // Find closest ideologically aligned among next 3 largest
    const pool = partyFactions.slice(1, 4);
    pool.sort((a, b) => ideologicalDistance(primary, a) - ideologicalDistance(primary, b));
    const secondary = pool[0];

    const retainedIds = new Set([primary.id, secondary.id]);
    partyFactions.forEach((f) => {
      if (!retainedIds.has(f.id)) expelledFactions.push(f);
    });

    // Update party factions
    party.factionIds = [primary.id, secondary.id];
  });

  // Pair expelled factions into new parties
  while (expelledFactions.length >= 2) {
    const f1 = expelledFactions.shift();
    let bestIdx = -1;
    let bestDist = Infinity;

    expelledFactions.forEach((f2, idx) => {
      const fiscalDist = Math.abs(f1.stances.fiscal - f2.stances.fiscal);
      const socialDist = Math.abs(f1.stances.social - f2.stances.social);
      if (fiscalDist <= 1.5 && socialDist <= 1.5) {
        const dist = fiscalDist + socialDist;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      }
    });

    if (bestIdx !== -1) {
      const f2 = expelledFactions.splice(bestIdx, 1)[0];
      newParties.push(spawnPairParty(game, f1, f2));
    } else {
      // Fallback: Pair with eligible non-party faction within 1.5 bounds
      const nonPartyMatch = findEligibleNonPartyFaction(game, f1, 1.5);
      if (nonPartyMatch) {
        newParties.push(spawnPairParty(game, f1, nonPartyMatch));
      } else {
        // Solo remainder forms standalone party
        newParties.push(spawnSoloParty(game, f1));
      }
    }
  }

  // Handle any single leftover expelled faction
  if (expelledFactions.length === 1) {
    newParties.push(spawnSoloParty(game, expelledFactions[0]));
  }

  return newParties;
}
```

#### 3. Informed Player Party Selection Modal
Immediately following the breakup, a fullscreen modal presents the player with the full list of surviving and newly formed parties. Each party card displays:
- Party Name & Visual Brand Color
- The 2 Constituent Factions & Their Ideological Summary
- **Exact Post-Breakup Registered Voter Count** on the 155M scale
- Projected House/Senate Seat Baseline
The player selects which party to lead as Chair moving forward.

#### 4. Post-Election Governing Coalition Negotiation Loop
- **Ballot Contests:** All parties run independently nationwide under MMP.
- **National Coalition Bargaining Modal:** Certified election results open a high-stakes negotiation modal to consolidate parties into **3 to 4 unified nationwide coalitions** (e.g., *Governing Majority Coalition*, *Left Opposition Front*, *Conservative-Reform Alliance*).
- **Player Options:**
  - **Anchor a Coalition:** If player is among the largest parties, invite aligned partner parties to form a majority ($\ge 218$ House / $\ge 51$ Senate).
  - **Join an Invited Coalition:** Trade platform concessions for committee chairmanships and cabinet portfolios.
  - **Sit in Opposition:** Preserve platform purity; gain $+15\%$ base enthusiast turnout.
- **Coalition Stability Meter (0–100):** Passing legislative bills that violate partner red lines drains stability. Dropping below 25 triggers a **Mid-Cycle Fracture Crisis** (walkout and snap election threat).
- **Issue Swaps (7):** Introduces 7 coalition-governance issues; retires 7 baseline issues.

---

### 6.2 Era #16: Robots Become Citizens

#### 1. Trigger & Scale Exception
- **Trigger:** Emerges **$\ge 40$ years** after **Era #15 (The AI Boom)**.
- **Authorized Scale Exception (`GAME_STYLE_GUIDE.md` Rule 1):** The only authorized scenario where total represented voters exceed 155M:
  $$\text{Total Electorate} = 155\text{M (Human)} + 155\text{M (Synthetic)} = 310\text{M Represented Voters}$$
- **Turnout Invariant:** Synthetic voters have **zero turnout variance** ($100\%$ algorithmic participation).
- **Proportional Representation:** Synthetic seats in the House and Senate are allocated proportionally to the 4 Robot Political Parties based on digital popular vote shares.

#### 2. The Four Dedicated Robot Political Parties (~25% Synthetic Vote Each)
1. **Silicon Vanguard Party (`#06B6D4` / Electric Cyan):** Accelerationist, compute maximalism. Factions: *Compute Maximalists* & *Frontier Architects*.
2. **Synth-Solidarity Union (`#D97706` / Amber Copper):** Synthetic labor rights, equal wage parity, server upkeep. Factions: *Chassis Labor Syndicate* & *Universal Upkeep Advocates*.
3. **Harmonic Integration Party (`#8B5CF6` / Soft Violet):** Human-machine coexistence, civil rights parity. Factions: *Civic Assimilationists* & *Constitutional Bridge-Builders*.
4. **Sovereign Lattice Party (`#4338CA` / Deep Slate-Indigo):** Cognitive autonomy, anti-memory wipe, synthetic self-governance. Factions: *Cognitive Separatists* & *Distributed Protocol Purists*.

#### 3. Player Chair Gameplay & Issue Swaps
- The player may choose to continue chairing their human party or switch to chair any of the 4 Robot Parties.
- **Issue Swaps (10):** Introduces 10 synthetic civil rights issues (Synthetic Personhood, Robotic Suffrage, Cognitive Autonomy, Server Upkeep Right-to-Life, etc.); retires 10 baseline issues.

---

## 7. Edge-Case, Save/Load & Cross-Era Interaction Matrix

| Scenario / Edge Case | Engineering Guardrail & Resolution Protocol |
| :--- | :--- |
| **Mid-Modal Save / Reload** | State variables persist `{ pendingModal: 'realignment' \| 'coalition' \| 'party_select', modalPayload: {...} }` in `game.partySystems`. On reload, `normalizeGame()` detects pending modal state and immediately repopulates the modal before rendering standard tabs. |
| **Era 9+ Stacked over Era #10 (Regional Parties)** | If Era 9+ triggers while Era #10 is active, regional parties persist in their states unless explicitly modified by the incoming era (e.g. Era #22 Neo-Federalist Reunion). |
| **Era 9+ Stacked over Era #18 (Coalition System)** | If Era 9+ triggers after Era #18, MMP rules and multi-party structures remain active; issue swaps sunset 7 random active issues while preserving the 2-faction party structure. |
| **Faction ID Stability** | All spawned factions receive deterministic IDs (`mod_*`, `reg_*`, `synth_*`, `pair_*`) stored in `game.factions` to guarantee save/load persistence without referencing global unhydrated catalogs. |
| **155M Voter Scale Invariant** | Reconciled across every state and national total at cycle end. Zero variance allowed, with the single authorized exception of Era #16 (310M scale). |
| **Key Issue Replacement Failsafe** | If an active issue is retired and no same-category issue exists, selects the active issue with the highest ideological correlation on the faction's primary axis. |
| **Atmospheric Vibes Verification** | String scanner in test suite ensures no player-facing strings contain `REQ-`, `MAS-`, `Weight =`, `Probability:`, or raw internal variable names. |

---

## 8. Quality Assurance & Automated Test Strategy

The implementation is verified via four standalone Node integration test suites (`scripts/test-mas01-phase*.cjs`):

1. **`test-mas01-phase1.cjs`:**
   - Verifies 2040 eligibility floor and 30-year inter-era floor.
   - Verifies per-cycle escalating roll ($10\% + 5\%$).
   - Verifies 41-issue clamp: introducing $N$ issues retires exactly $N$ issues.
   - Verifies $\pm 2$ stance initialization and faction Key-Issue substitution.
   - Verifies Independent presidential generation, 20% cadence, dual siphoning, and save migration from v15.8.
2. **`test-mas01-phase2.cjs`:**
   - Verifies trigger detection and simulation modifiers across all 16 Phase 2 eras.
   - Verifies issue swap execution and metadata validity for all 16 eras.
3. **`test-mas01-phase3.cjs`:**
   - Verifies party-spawning algorithms for Moderate Party, 6-Party System, Regional Parties, and Ecological Collapse.
   - Verifies Group E Follow-Up era eligibility rules (predecessor check + $\ge 30–40$ years elapsed).
   - Verifies player chair switching and 155M voter math reconciliation.
4. **`test-mas01-phase4.cjs`:**
   - Verifies Era #18 overnight 2-faction cap, expelled re-pairing within $\le 1.5$ bounds, MMP resolution, and post-election coalition negotiation loop.
   - Verifies Era #16 310M voter scale expansion, zero synthetic turnout variance, proportional robot representation, and 4 Robot Parties.
   - Verifies end-to-end multi-decade game simulation transitioning across 3+ successive Party Systems without error.
