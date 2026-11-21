# Coalition Builder: Party Chair — Comprehensive Systems & Mechanics Guide
*Engine Architecture, Simulation Rules, and Gameplay Mechanics Handoff Document*

---

## 1. High-Level Concept & Core Gameplay Loop

### 1.1 The Role of the Party Chair
In *Coalition Builder: Party Chair*, the player assumes the executive role of a National Party Chair. Unlike games focused on single-candidate campaigns or momentary legislative votes, this simulation models the institutional, multi-decade stewardship of a national political organization. The Chair is responsible for party infrastructure, ideological platform evolution, primary management, campaign resource allocation, internal faction diplomacy, and constitutional governance across recurring two-year electoral cycles alternating between presidential and midterm elections.

### 1.2 The Four-Phase Cycle Loop
Every two-year election cycle progresses through four distinct operational phases:

```
[ Phase 1: Machine Operations & Recruitment ]
                      │
                      ▼
[ Phase 2: Party Primaries & Candidate Filtering ]
                      │
                      ▼
[ Phase 3: The Campaign Phase (General Election Command) ]
                      │
                      ▼
[ Phase 4: Election Night, Multi-Chamber Resolution & Inter-Cycle Realignment ]
                      │
                      ▼
            (Transitions to Next Cycle Phase 1)
```

1. **Phase 1: Machine Operations & Recruitment:**
   The Chair focuses on institutional party building, bench recruitment, chapter expansion, courting sitting lawmakers to defect or caucus, deploying party leaders on organizing tours, managing internal faction treaties, and adjusting the national policy platform.
2. **Phase 2: Party Primaries & Candidate Filtering:**
   Contested primaries emerge across legislative, senatorial, and gubernatorial races. The Chair chooses between maintaining institutional neutrality or deploying filtering support and endorsements to advance preferred factional allies, balancing candidate quality against internal party friction.
3. **Phase 3: The General Campaign Phase:**
   A structured weekly turn-based campaign loop. The Chair deploys national treasury funds across candidate triage, targeted media market advertising, statewide field volunteer drives, surrogate tours, opposition research, ballot measures, and crisis management, concluding with a late-cycle crisis event.
4. **Phase 4: Election Night & Realignment:**
   Simultaneous multi-chamber electoral resolution across all federal and state offices. Inter-cycle realignment executes, shifting voter blocks and faction memberships based on performance versus expectations. Seniority progression, age-based retirements, and constitutional Senate rotations process before launching the next cycle.

---

## 2. Electoral Simulation & Multi-Chamber Architecture

The simulation simultaneously models every level of American governance:

### 2.1 The Presidential Contest & Electoral College
- Contested exclusively in presidential cycles.
- Operates on a state-by-state winner-take-all electoral vote allocation (with constitutional handling of non-state federal districts).
- Outcomes are driven by fundamental baseline state partisan leans, national macroeconomic environments, regional ticket balance bonuses based on nominee origins, demographic elasticity, and general election campaign ad saturation.

### 2.2 The Senate & Rotating Constitutional Classes
- Contested across all cycles via three staggered, cycling constitutional classes.
- Only the active Senate class is up for election in a given cycle, while non-active classes remain fixed.
- Race outcomes depend on statewide baseline partisanship, candidate quality differentials between nominees, national environment coattails, targeted candidate funding triage, and localized campaign advertising.

### 2.3 The House of Representatives & Pure District Leans
- Every single legislative seat is contested every cycle.
- **Pure District Decoupling:** Congressional districts operate on authentic, localized partisan baselines rather than statewide political leans.
- Outcomes are modeled through district-level baselines, candidate quality comparisons, national wave elasticity, and district-targeted party funding.

### 2.4 Gubernatorial Elections
- Executive races contested on staggered schedules across presidential and midterm cycles.
- Gubernatorial victories confer state-level executive authority, influencing downballot coattails and party chapter operations.

### 2.5 State Legislative Chambers & Unified Trifectas
- Models downballot legislative slates across state legislative chambers.
- **Trifecta Governance:** Tracks unified party control versus divided government across every territory. Partisan trifectas unlock state policy bills and dictate decennial redistricting powers.

---

## 3. Party Organization, Ideology & Platform Dynamics

### 3.1 Multi-Party Spectrum
The ecosystem supports traditional major parties, established third parties across diverse ideological traditions, and fully customizable player-created parties with bespoke branding and platform positions.

### 3.2 Unified Multi-Pillar Platform Profile
- The national party platform is defined across multiple fundamental policy pillars spanning economic regulation, social and cultural policy, foreign affairs, and governance reforms.
- **Two-Axis Ideological Continuum:** Policies and party stances are plotted across dual economic and social spectra.
- **Euclidean Ideological Distance:** Electoral appeal, coalition compatibility, and courting feasibility are calculated mathematically by measuring Euclidean distance across ideological axes:
  $$\text{Distance} = \sqrt{(\Delta \text{Economic})^2 + (\Delta \text{Social})^2}$$
- Platform modifications require spending party machine actions and trigger immediate reactions from internal factions.

---

## 4. Internal Factions Engine & Coalition Governance

### 4.1 Universal Faction Structure
Every political party houses a spectrum of distinct internal factions representing organized ideological wings, demographic voter bases, and regional interests. Factions exist for major parties, minor parties, and independent movements.

### 4.2 Dual-Meter Faction Health
Each faction is evaluated through two distinct, continuous metrics:
1. **Faction Standing / Happiness:**
   Measures the faction's general satisfaction with party leadership, platform alignment, candidate recruitment, and campaign funding equity.
   - High happiness boosts grassroots volunteer energy, local campaign efficiency, and voter turnout.
   - Low happiness generates internal friction, primary challenges, national turnout penalties, and bolting threats.
2. **Faction Internal Confidence:**
   Measures the faction's institutional power, leverage, and organizational self-assurance within the party machinery.
   - High confidence increases a faction's willingness to demand leadership posts, convention keynote slots, and legislative concessions.

### 4.3 Faction Friction & Cohabitation Drag
- When ideologically divergent factions share space within the same party coalition, mutual ideological friction produces a **cohabitation drag**.
- This drag suppresses national grassroots volunteer mobilization, small-dollar fundraising, and baseline voter turnout until smoothed over through diplomacy or platform harmonization.

### 4.4 Coalition Accords, Compacts & Faction Summits
- **Faction Summits:** The Chair can convene formal negotiations with restless factions to prevent splits and raise morale.
- **Coalition Accords & Multi-Cycle Compacts:** Binding multi-cycle agreements where the Chair guarantees policy bill enactment, platform adjustments, convention speaking slots, or leadership appointments in exchange for locked faction loyalty and the formal admission of independent demographic voters into the party's registered electorate.

### 4.5 Faction Ultimatums & Bolting Splinters
- Sustained neglect or ideological betrayal drives factions to issue formal ultimatums with non-negotiable demands.
- If an ultimatum expires unaddressed, the faction **bolts** the party: its lawmakers leave the party, its voters detach from party rolls, and it launches an independent splinter movement running rival candidates in targeted races.

---

## 5. Universal Politician Lifecycle & Character Engine

### 5.1 Universal Politician Invariant
Across the entire simulation, every political figure—untested bench recruits, primary hopefuls, general election nominees, sitting legislators, governors, party chairs, and elder statesmen—is modeled through a single, unified **Politician** object. System mechanics apply universally across all characters.

### 5.2 Core Politician Attributes
- **Chamber & Office:** Current status (Candidate, Sitting Representative, Senator, Governor, or Party Leader).
- **Faction Allegiance:** Primary faction membership within their party.
- **Fame & Public Name Recognition:** Increases with chamber tenure, successful state organizing tours, and national convention keynote speeches.
- **Popularity & Net Approval:** Public favorability ratings among the electorate.
- **Candidate Quality:** Innate campaigning, debating, and legislative capability, directly impacting primary and general election performance.
- **Personal Happiness:** Begins anchored to their faction's baseline happiness but drifts independently based on personal interactions with party leadership (promotions, funding, neglect).
- **Personality Traits:** Archetypal traits granting unique strategic bonuses or vulnerabilities.

### 5.3 Appointed Leadership Hierarchy
- A formal hierarchy of appointed party leadership roles (e.g. National Chair, Vice Chair, Congressional Floor Leaders, Whips, Faction Chairs, Cabinet Portfolios).
- **Leadership Privileges:** Premier machine actions—such as delivering the National Convention Keynote Address or headlining official State Organizing Tours—are strictly restricted to actively appointed Party Leaders.
- **High-Fame Expectations:** High-fame politicians demand leadership appointments; leaving them unappointed causes personal happiness decay and faction friction.

### 5.4 Cross-Party Courting & Defections
Party Chairs can court sitting lawmakers from other parties or independent alignments:
- **Discontent Gate:** Lawmakers will only entertain defection if their personal happiness is at or below a severe discontent threshold. Content lawmakers categorically refuse.
- **Ideological Bridge Requirement:** The courting party must contain a non-racial internal faction within close ideological proximity on both economic and social axes.
- **Party Tier Demands:** Major parties succeed unconditionally upon executing the courting action. Minor or third parties must concede an appointed Party Leadership role to secure the defection.
- **Faction Integration:** Defecting lawmakers automatically integrate into the faction within the player's party that is closest to their prior ideology.

### 5.5 Phase-End Faction-to-Party Inheritance Invariant
At the conclusion of every phase transition, an engine reconciliation sweep executes across all politicians:
- If a politician's faction is affiliated with a recognized party, their formal party affiliation synchronizes to match that party.
- If a politician's faction is independent, unaffiliated, or has bolted, the politician automatically becomes an Independent.

### 5.6 Chamber Seniority, Aging & Council of Party Elders
- Politicians age two years with every cycle.
- Chamber tenure awards incremental fame gains.
- Upon passing retirement age thresholds, lawmakers face probabilistic retirement rolls each cycle, unless shielded by executive leadership appointments.
- Retired veterans transition into the advisory **Council of Party Elders**, preserving historical party pedigree.

---

## 6. Party Primaries & Candidate Endorsements (Phase 2)

### 6.1 Contested Primary Mechanics
- Competitive primary contests generate automatically across open and targeted legislative, senatorial, and gubernatorial races.
- Primary voter turnout is driven by faction demographic strength, candidate quality, fame, and ideological alignment.

### 6.2 Chair Filtering Support vs. Neutral Posture
- The Chair can maintain institutional neutrality or actively deploy party machinery behind a favored candidate:
  - **Endorsement & Filtering Effects:** Significantly boosts the backed candidate's primary win probability and personal happiness.
  - **Backlash Dynamics:** Unbacked primary competitors and their aligned factions suffer happiness penalties for perceived establishment favoritism.

---

## 7. General Campaign Command (Phase 3)

### 7.1 Weekly Decision Loop
The general campaign operates as a structured turn-based decision cycle with a set allocation of strategic weekly actions.

### 7.2 Candidate Treasury Funding Triage
- Party committee treasury reserves can be injected directly into battleground nominees across legislative, senatorial, and gubernatorial contests.
- **Diminishing-Returns Polling Curve:** Candidate funding operates on a non-linear return curve. Initial funding allocations yield substantial polling momentum, while excessive resource concentration produces diminishing returns, compelling the Chair to practice strategic triage across competitive seats.

### 7.3 Media Market Advertising
- National and localized ad campaigns deployed across media markets adjust regional polling margins and counteract rival momentum.

### 7.4 Strategic Field Operations
- **Statewide Volunteer Drives:** Mobilize grassroots volunteer corps to bring non-voters into the registered electorate, permanently expanding the party's voter base.
- **Surrogate Blitzes & State Tours:** High-profile campaign tours deployed to battlegrounds to lift ticket-wide enthusiasm.
- **Opposition Research:** Investigating rival nominees to uncover scandals, depressing rival candidate quality and net approval.
- **Ballot Measures:** Sponsoring targeted state ballot referendums to drive partisan base turnout.

### 7.5 Atmospheric Events & Late-Cycle Surprises
- Narrative campaign events force tough trade-offs between financial resources, faction standing, and public polling.
- The campaign culminates in a late-cycle October Surprise crisis testing candidate resilience and party crisis management.

---

## 8. Forecaster Engine & Polling Architecture

### 8.1 Multi-Chamber Satirical Forecasters
The game features multiple distinct pundit forecaster outlets, each modeling the race through a distinct analytical philosophy:
- **Momentum-Adjusted Model:** Weights late-campaign momentum swings, media narratives, and funding surges.
- **Fundamentals-Focused Model:** Weights historical district/state baseline lean, economic indicators, and structural advantages.
- **Grassroots-Weighted Model:** Weights localized party chapters, volunteer mobilization, and faction enthusiasm.

### 8.2 Continuous Consensus Forecast
- Blends individual outlet predictions into a unified, granular multi-tier consensus spectrum (from Safe/Solid hold, through Likely, Favored, Lean, and Tilt tiers, to dead-heat Toss-Ups).

### 8.3 Multi-Party Ingestion & Spoiler Siphoning
- Forecaster models break completely free of binary two-party assumptions:
  - Ballot-qualified third-party and independent candidates are fully evaluated using localized candidate quality, party registration share, and campaign spending.
  - **Spoiler Siphoning:** Third-party candidates siphon votes away from ideologically proximate major parties, tightening or flipping projected margins.
  - **Third-Party Contention:** When a third-party candidate leads a race, forecasters rate the contest in favor of that third party rather than defaulting to major-party labels.

### 8.4 Live Polling Synthesis & Real-Time Reactivity
- **Commissioned Internal Polls:** The Chair can commission targeted scientific surveys on any contested race. The resulting survey results blend directly into forecaster projections with high recency weighting.
- **Tracking Polls & Wave Momentum:** General tracking poll shifts, candidate funding changes, and national wave swings actively mutate race margins.
- **Turn-End & Phase-End Refresh:** Forecasters recalculate systematically at the conclusion of every individual operational turn and every phase transition.

### 8.5 Forecast Map Visualization & Legend Omission Protocol
- **Interactive Forecast Maps:** Visualizes projected outcomes across Presidential, House, and Cycling Senate contests.
- **Third-Party Color Gradients:** When third parties lead in a state or district, maps render them in multi-tier color intensity gradients (Solid, Likely, Lean, Tilt) matching their authentic party branding.
- **Legend Omission Protocol:** Forecast map keys and spectrum bars strictly display only the traditional major-party continuum. Third-party swatches are deliberately omitted from the legend to maintain authentic media aesthetics and eliminate visual clutter.

---

## 9. Inter-Cycle Realignment & Electorate Persistence (Phase 4)

### 9.1 The 1/4th Shift Realignment Rule
- Partisan voter blocks shift between elections based on actual popular vote performance relative to expected baselines:
  $$\Delta \text{Share} = \frac{\text{Actual Share} - \text{Expected Share}}{4}$$
- Parties gain or lose registered voters strictly *between* election cycles, never mid-campaign.
- Overperforming parties expand their permanent voter rolls; underperforming parties shed voters.

### 9.2 State-by-State Execution & Targeted Transfers
- Realignment executes independently within each state territory rather than as a uniform national swing, enabling regional coalition building over decades.
- **Targeted Inter-Party Transfers:** Voters shift strictly between ideologically proximate parties:
  - Left-wing third parties exchange voters directly with center-left major parties.
  - Right-wing third parties exchange voters directly with center-right major parties.
  - Major parties engage in competitive two-way swing voter exchange.

### 9.3 Synchronized Voter Faction Realignment
- When voters change parties via the 1/4th Shift Rule, their underlying internal faction affiliations shift in lockstep:
  - Departing voters are deducted proportionally from factions in the former party.
  - Entering voters are added to ideologically compatible recipient factions in the new party.
  - State and national faction voter counts reconcile dynamically to match party registration rolls.

### 9.4 Cumulative Year-Over-Year Electorate Growth
- The historical flat automatic electorate growth rate is completely eliminated.
- Total voter registration expands dynamically through active Get Out The Vote (GOTV) and field organizing operations that bring non-voters into the registered electorate.
- **Permanent Carryover:** All voter registration gains achieved during in-cycle operations carry forward permanently across cycles into future years, cumulatively expanding total registered voters year over year with zero baseline resets.

---

## 10. Advanced Structural Mechanics

### 10.1 Decennial Redistricting & Gerrymandering
- Triggered on decennial intervals following national census reapportionment.
- States gain or lose congressional seat apportionments based on relative population shifts.
- **Partisan Gerrymandering:** Parties holding state trifectas redraw legislative district boundaries to maximize partisan advantage, pack rival voters, and protect incumbents, altering district-level baseline leans for the subsequent decade. Independent commission states draw balanced, competitive maps.

### 10.2 Super PACs & Outside Independent Spending
- Autonomous outside spending organizations aligned with specific party wings or donor coalitions.
- Independently deploy treasury warchests into media blitzes across battleground races without direct party coordination, providing unexpected air cover or complicating chair triage.

### 10.3 Disaggregated State Voter Registration Table
- A reactive statewide intelligence table providing live visibility into registered voter counts and party affiliations across all territories.
- Updates instantaneously in response to in-cycle player actions (volunteer drives, outreach drives, focus lock-ins) with visual delta indicators.

---

## 11. Codebase Architecture & File Responsibilities

For developers and coding agents working across the repository:

- `engine.js`: The authoritative headless simulation core. Contains all mathematical models, state transitions, realignment logic, forecaster generation (`buildForecasters`), voting calculations, candidate generation, trait resolution, and multi-cycle persistence invariants.
- `app.js`: The primary UI view controller and state presentation layer. Renders navigation tabs, interactive cards, dossiers, tables, dropdown bindings, and user event dispatchers.
- `maps-0.3.js`: The dedicated SVG rendering engine for national, statewide, legislative district, and municipal political maps. Handles geometric projections, tooltip events, and color gradient fills.
- `styles.css`: Central stylesheet defining responsive layout grids, stylized badge components, card panels, continuous gradient bars, and typography.
- `build.js`: The automated compilation and release script packaging the application into a standalone Windows executable.
- `DESIGN.md`: The living, authoritative technical design document cataloging all system architectures, operational invariants, and historical specifications.
- `DESIGN_BACKLOG.md`: The persistent backlog tracking active proposals, feature sizes, and version packaging queues.
