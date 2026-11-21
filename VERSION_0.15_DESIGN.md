# Version 0.15 Design Specification & Implementation Handoff

**Build Target:** Version 0.15.0  
**Working Title:** *Coalition Builder: Party Chair*  
**Theme:** *The Factions Engine: 38 National Factions, Zero-Variance State Allocation, Dual-Metric Dynamics (Happiness & Confidence), Primary Win Ideological Conversions, and Swing Electorate Persuasion*  
**Target Release Executable:** `dist/release/Coalition Builder - Party Chair.exe`  
**Save Version Compatibility:** `partyChairGame.save.v15.0` (Backward-compatible with `v14.6` through `v1`)  
**Design Status:** DESIGN SPECIFICATION ONLY. **DO NOT IMPLEMENT IN THIS CONVERSATION.**  
**Handoff Prompt:** See Section 5 for the complete, copy-pastable implementation prompt for the coding agent.

---

## 1. Executive Summary & Inventory of Subsystems

Version 0.15.0 introduces the **Factions Engine**, replacing monolithic party rosters with **38 distinct political factions** distributed across all 50 states and Washington D.C. Factions serve as the primary atomic building blocks of the electorate: 100% of partisans belong to factions, swing factions govern election persuasion, and non-party extremist factions refrain from voting.

| # | Req ID | Feature Title | Target File(s) | Summary |
| :-: | :---: | :--- | :--- | :--- |
| **1** | **REQ-146** | 38 National Factions & State Integer Matrix | `engine.js`, `data.js` | Ingests `FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv` into `voterModel.factions` and `voterModel.states[].factions`. Guarantees 0 variance against all 155M registered voters across all 51 jurisdictions. |
| **2** | **REQ-147** | Dual Faction Metrics: Standing (Happiness) & Confidence | `engine.js`, `app.js` | Implements **Happiness (0–100, baseline ~65–70)** affecting grassroots fundraising multiplier ($M = 0.50 + (\text{H}/100) \times 0.70$), turnout drags ($< 45 \implies -9\%$), and primary filtering (+1/-3). Implements **Confidence (1–100, baseline 50)** governed strictly by Party Elders (+1.5 floor), Autopsies (+8/-7 or +4/-5), and Leadership Appointments (+3). |
| **3** | **REQ-148** | Primary Win Conversion & Faction-Driven Growth | `engine.js` | Candidates possess faction alignments. Primary wins transfer proximate voters into the winning faction: State Leg (+200 base), House (+1,000 base), Senate/Gov (+2,500 base), scaled by party approval and rounded to 100. Disables external party shifts; party registration equals the sum of its factions. |
| **4** | **REQ-149** | Primary "Filtering Support" & Fringe Mechanics | `engine.js`, `app.js` | Filtering Support grants +10 pt swing, +1 candidate faction Happiness, and -3 all rival factions Happiness (Confidence is unaffected). Fringe factions (<1M voters) are hard-capped at 5% in major primaries unless filtered. |
| **5** | **REQ-150** | Swing Faction Persuasion & Non-Voting Blocs | `engine.js` | Partisan factions vote 100% loyal to their party. Swing factions split dynamically based on national environment ($\pm 20\%$) and faction lean. Non-party, non-swing factions (The Klan, Neo-Nazis, Groypers) do not vote (0% turnout). |
| **6** | **REQ-151** | Complete 38-Faction Metadata & Classification | `data.js` | Fills missing Flavor and exactly 2 Key Issues for empty factions while preserving existing text intact. Designations (Fringe, Minor, Major, Leading) re-evaluate strictly at cycle boundaries. |
| **7** | **REQ-152** | Factions Tab UI & State Faction Inspector | `app.js`, `index.html` | Adds a dedicated "Factions" dashboard tab showing faction health, leaders, confidence, primary momentum, and per-state breakdowns. |

---

## 2. Authoritative Faction Catalog (38 Factions)

All 38 factions are locked to the authoritative datasets in `FACTION_STATE_ALLOCATION_REFERENCE.md` and `FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv`. Missing flavor and key issues have been completed per design directive:

```javascript
window.PartyChairData.FACTIONS_CATALOG = [
  // --- DEMOCRATIC PARTY (8 Factions: 52,649,500 Registered Voters) ---
  {
    id: 'dem_liberal_establishment',
    name: 'The Liberal Establishment',
    partyId: 'people',
    type: 'ideological',
    status: 'leading',
    targetVoters: 12270000,
    sliders: { social: 4.0, economic: 4.0, governance: 2.0 },
    keyIssues: ['Institutional Norms', 'Entitlement Defense'],
    flavor: 'The traditional backbone of the Democratic Party—elected officials, party apparatus loyalists, and suburban pragmatists who favor steady governance, institutional guardrails, and incremental reform.'
  },
  {
    id: 'dem_black_voters',
    name: 'Black Voters',
    partyId: 'people',
    type: 'racial',
    status: 'major',
    targetVoters: 11760000,
    sliders: { social: 4.0, economic: 3.0, governance: 7.8 },
    keyIssues: ['Civil Rights', 'Voting Access'],
    flavor: 'The African American Voting Block - have been a core faction of the democratic party since the civil rights movement'
  },
  {
    id: 'dem_capital_l_left',
    name: 'The Capital L Left',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 7160000,
    sliders: { social: 2.0, economic: 2.0, governance: 6.0 },
    keyIssues: ['Universal Healthcare', 'Climate Action'],
    flavor: 'Extreme on Rhetoric, Extreme on Policy - these are the progressives that are keeping fox news in business'
  },
  {
    id: 'dem_neo_liberals',
    name: 'Neo-Liberals',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 5620000,
    sliders: { social: 3.7, economic: 4.8, governance: 2.0 },
    keyIssues: ['Free Trade Agreements', 'Corporate Tax Competitiveness'],
    flavor: 'Pro-globalization, free-trade technocrats and educated professionals who combine socially progressive values with market-oriented economic policies and fiscal prudence.'
  },
  {
    id: 'dem_bernie_bros',
    name: 'Bernie Bros',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 5110000,
    sliders: { social: 3.3, economic: 1.8, governance: 9.0 },
    keyIssues: ['Wealth and Capital Gains', 'Business Regulation and Antitrust Laws'],
    flavor: 'These are voters who became engaged in politics during Bernie Sanders 2016 campaign. They’re milder on social views and rhetoric, but very left leaning on economic issues. It also has a strong populist current.'
  },
  {
    id: 'dem_faith_based_liberals',
    name: 'Faith Based Liberals',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 5110000,
    sliders: { social: 5.0, economic: 2.0, governance: 4.0 },
    keyIssues: ['Voting Rights', 'Civil Rights Protections'],
    flavor: 'Mainline Protestant, Catholic, and interfaith social-gospel voters who view progressive politics as a moral duty to care for the poor, marginalized, and vulnerable.'
  },
  {
    id: 'dem_blue_dog',
    name: 'Blue Dog Democrats',
    partyId: 'people',
    type: 'ideological',
    status: 'major',
    targetVoters: 3780000,
    sliders: { social: 5.8, economic: 4.1, governance: 6.0 },
    keyIssues: ['Affordability & Cost of Living', 'Business Regulation and Anti-Trust'],
    flavor: 'Conservative Democrats that the party tends to put up in more conservative states'
  },
  {
    id: 'dem_traditional_latin',
    name: 'Traditional Latin Voters',
    partyId: 'people',
    type: 'racial',
    status: 'minor',
    targetVoters: 1839500,
    sliders: { social: 4.6, economic: 4.6, governance: 6.7 },
    keyIssues: ['Immigration', 'Civil Rights'],
    flavor: 'This is the traditional Latino voting block that begin to crumble in the Trump Era, fleeing to other liberal or latino based factions. This group is very liberal on some social issues,like immigration and civil rights, but very conservative on others, like gay and trans issues'
  },

  // --- REPUBLICAN PARTY (11 Factions: 49,077,200 Registered Voters) ---
  {
    id: 'gop_faith_and_flag',
    name: 'Faith & Flag Conservatives',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 9015000,
    sliders: { social: 9.0, economic: 7.1, governance: 8.0 },
    keyIssues: ['Religious Liberty', 'Traditional Family Policy'],
    flavor: 'Devout evangelical Christians and conservative traditionalists who view the defense of Christian heritage, traditional marriage, and the sanctity of life as an existential calling.'
  },
  {
    id: 'gop_maga',
    name: 'Nationalist Populists (MAGA)',
    partyId: 'heritage',
    type: 'ideological',
    status: 'leading',
    targetVoters: 7011000,
    sliders: { social: 9.0, economic: 5.7, governance: 9.0 },
    keyIssues: ['Border Security', 'Protective Tariffs'],
    flavor: 'The fiercely loyal base of the modern America First movement—blue-collar workers and rural voters mobilized against global elites, unchecked trade, and open borders.'
  },
  {
    id: 'gop_western_mavericks',
    name: 'Liberty & Western Mavericks',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 6510000,
    sliders: { social: 3.0, economic: 9.0, governance: 9.0 },
    keyIssues: ['Gun Rights', 'Federal Land Deregulation'],
    flavor: 'These libertarian leaning voters want you to leave their guns and land alone'
  },
  {
    id: 'gop_blood_and_soil',
    name: 'Blood and Soil Nationalists',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 6010000,
    sliders: { social: 9.0, economic: 5.5, governance: 6.0 },
    keyIssues: ['Zero-Immigration Moratorium', 'National Cultural Preservation'],
    flavor: 'Hardline nativists and radical ethno-cultural preservationists who demand an immediate halt to all immigration and a total cultural re-anchoring of the nation.'
  },
  {
    id: 'gop_suburban_moderates',
    name: 'Frontier & Suburban Moderates',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 5208000,
    sliders: { social: 3.0, economic: 7.3, governance: 6.0 },
    keyIssues: ['Suburban Affordability', 'Fiscal Restraint'],
    flavor: 'Fiscal conservatives in fast-growing suburbs and Western valleys who want low property taxes, safe communities, and restrained government, keeping social extremism at arm’s length.'
  },
  {
    id: 'gop_neo_cons',
    name: 'Neo-Cons',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 5108000,
    sliders: { social: 6.5, economic: 6.5, governance: 1.5 },
    keyIssues: ['US Foreign Policy', 'Defense Spending'],
    flavor: 'Pentagon contractors, military veterans, think-tank analysts, and Cold War internationalists who prioritize undisputed American military dominance, NATO, and deterrence against Russia and China.'
  },
  {
    id: 'gop_paleocons',
    name: 'Paleocons',
    partyId: 'heritage',
    type: 'ideological',
    status: 'major',
    targetVoters: 3005000,
    sliders: { social: 6.8, economic: 8.1, governance: 3.0 },
    keyIssues: ['Non-Interventionist Foreign Policy', 'Federal Deficit Elimination'],
    flavor: 'Old-right isolationists and constitutional traditionalists who reject foreign military adventurism, free trade globalism, and large federal bureaucracies.'
  },
  {
    id: 'gop_mormons',
    name: 'Mormons',
    partyId: 'heritage',
    type: 'racial', // Special demographic designation per user specification
    status: 'minor',
    targetVoters: 2404000,
    sliders: { social: 8.0, economic: 5.9, governance: 3.0 },
    keyIssues: ['Religious Liberty', 'Faith Based Social Services'],
    flavor: 'Mormons function as a minority, and tend to vote in blocks, even if they technically aren’t one. They’re designated as a racial faction to show how close knit this group is, even if they technically aren’t one. This faction controls Utah - but doesn’t have a ton of say elsewhere'
  },
  {
    id: 'gop_traditional_farmers',
    name: 'Traditional Farmers',
    partyId: 'heritage',
    type: 'ideological',
    status: 'minor',
    targetVoters: 2003200,
    sliders: { social: 7.0, economic: 7.0, governance: 8.0 },
    keyIssues: ['Statehouse Governance', 'Farm Subsidies'],
    flavor: 'Family farm operators, agribusiness owners, and rural community stewards who rely on agricultural price supports, crop insurance, and state-level regulatory relief.'
  },
  {
    id: 'gop_market_country_club',
    name: 'Market & Country-Club Conservatives',
    partyId: 'heritage',
    type: 'ideological',
    status: 'minor',
    targetVoters: 2003000,
    sliders: { social: 5.5, economic: 8.9, governance: 2.0 },
    keyIssues: ['Corporate Tax Cuts', 'Deregulation'],
    flavor: 'Most of these voters fled to other factions once Trump took over the party -'
  },
  {
    id: 'gop_cubans',
    name: 'Cubans',
    partyId: 'heritage',
    type: 'racial',
    status: 'fringe',
    targetVoters: 800000,
    sliders: { social: 7.0, economic: 7.2, governance: 5.0 },
    keyIssues: ['LGBTQ+ Rights', 'Foreign Affairs'],
    flavor: 'This florida based group despises communism, and supports traditional family values'
  },

  // --- SWING / INDEPENDENT FACTIONS (9 Factions: 48,029,800 Registered Voters) ---
  {
    id: 'swg_true_centrists',
    name: 'True Centrists',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 9006000,
    sliders: { social: 5.0, economic: 6.0, governance: 3.5 },
    keyIssues: ['Bipartisan Compromise', 'Government Accountability'],
    flavor: 'These voters are smack dab in the political middle. They tend to be more trusting of the government than most, but less than other moderate factions'
  },
  {
    id: 'swg_hard_hats',
    name: 'Hard Hats',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 6004000,
    sliders: { social: 6.8, economic: 3.5, governance: 6.0 },
    keyIssues: ['Domestic Manufacturing', 'Union Protections'],
    flavor: 'Union Voters and Construction workers used to be reliably democratic - but the Trump Coalition swallowed them up'
  },
  {
    id: 'swg_podcast_bros',
    name: 'Podcast Bros',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 6004000,
    sliders: { social: 6.8, economic: 3.9, governance: 9.0 },
    keyIssues: ['Cryptocurrency Freedom', 'Free Speech Online'],
    flavor: 'These low information voters get most of their news from podcasts - and that’s how they decide on who they vote for, too'
  },
  {
    id: 'swg_country_club_centrists',
    name: 'Country Club Centrists',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 5503500,
    sliders: { social: 3.4, economic: 8.1, governance: 2.0 },
    keyIssues: ['Fiscal Discipline', 'Free Market Deregulation'],
    flavor: 'These voters used to be dyed in the wool republicans - but Trump changed everything'
  },
  {
    id: 'swg_technocrats',
    name: 'Technocrats',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 5503500,
    sliders: { social: 2.5, economic: 8.8, governance: 2.0 },
    keyIssues: ['Artificial Intelligence Deregulation', 'High-Skill Immigration'],
    flavor: 'These voters believe in the power of technology. They hold progressive social views (civil rights, free speech) but despise regulatory barriers, compute controls, and wealth taxes.'
  },
  {
    id: 'swg_grillers',
    name: 'Grillers',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 5003000,
    sliders: { social: 5.5, economic: 5.5, governance: 5.5 },
    keyIssues: ['Gas Price Relief', 'Grocery Cost Affordability'],
    flavor: 'These folks don’t really pay attention to politics. They just relax, grill, and turn out against the presidents party when costs are high'
  },
  {
    id: 'swg_religious_moderates',
    name: 'Religious Moderates',
    partyId: 'independent',
    type: 'ideological',
    status: 'major',
    targetVoters: 4502800,
    sliders: { social: 6.0, economic: 6.0, governance: 2.8 },
    keyIssues: ['Religious Liberty', 'Religion in Public Schools'],
    flavor: 'Center-leaning religious voters who value traditional community faith and family structures but reject partisan culture wars and ideological zealotry.'
  },
  {
    id: 'swg_working_class_latinos',
    name: 'Working Class Latinos',
    partyId: 'independent',
    type: 'racial',
    status: 'major',
    targetVoters: 4002500,
    sliders: { social: 7.0, economic: 4.0, governance: 8.0 },
    keyIssues: ['Immigration', 'Affordability and Cost of Living'],
    flavor: 'These Voters spend most of their time working - and don’t have as much time for politics. Immigration and Affordability are key issues'
  },
  {
    id: 'swg_girlypops',
    name: 'Girlypops',
    partyId: 'independent',
    type: 'ideological',
    status: 'minor',
    targetVoters: 2500500,
    sliders: { social: 3.6, economic: 4.1, governance: 7.0 },
    keyIssues: ['Reproductive Freedom', 'Student Loan Forgiveness'],
    flavor: 'These low information voters tend to vote for whoever their favorite pop star endorses'
  },

  // --- MINOR PARTY FACTIONS (7 Factions: 2,101,300 Registered Voters) ---
  {
    id: 'lib_true_libertarians',
    name: 'True Libertarians',
    partyId: 'liberty',
    type: 'ideological',
    status: 'leading',
    targetVoters: 956600,
    sliders: { social: 3.8, economic: 9.5, governance: 9.3 },
    keyIssues: ['Tax Policy', 'Gun Policy'],
    flavor: 'True libertarians are hard to come by - but these voters believe in true small government, not just on liberal issues'
  },
  {
    id: 'lib_ancaps',
    name: 'Ancaps',
    partyId: 'liberty',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 191300,
    sliders: { social: 3.5, economic: 10.0, governance: 10.0 },
    keyIssues: ['Abolition of the Federal Reserve', 'Total Tax Elimination'],
    flavor: 'These voters don’t think the government should exist. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'grn_eco_socialist_vanguard',
    name: 'Eco-Socialist Vanguard',
    partyId: 'green',
    type: 'ideological',
    status: 'leading',
    targetVoters: 383800,
    sliders: { social: 1.2, economic: 1.3, governance: 9.0 },
    keyIssues: ['Fossil Fuel Nationalization', 'Degrowth Climate Transition'],
    flavor: 'The Eco-Socialist Vanguard warns of the coming eco-apoclypse'
  },
  {
    id: 'grn_yimby',
    name: 'YIMBY’s',
    partyId: 'green',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 109600,
    sliders: { social: 2.8, economic: 3.1, governance: 5.0 },
    keyIssues: ['NIMBYism and Housing Development', 'Affordability and the Cost of Living'],
    flavor: 'These leftie voters left the democrats over housing issues - now they’re in an uncomfortable alliance with the greens'
  },
  {
    id: 'con_christian_dominionists',
    name: 'Christian Dominionists & Theocrats',
    partyId: 'constitution',
    type: 'ideological',
    status: 'leading',
    targetVoters: 230000,
    sliders: { social: 10.0, economic: 6.4, governance: 9.5 },
    keyIssues: ['Religious Liberty', 'Religion in Public Schools'],
    flavor: 'Radical religious reconstructionists who believe American civil law should be completely replaced with biblical law and Christian governance. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'soc_socialists',
    name: 'Socialists',
    partyId: 'socialist',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 138000,
    sliders: { social: 2.0, economic: 1.2, governance: 9.0 },
    keyIssues: ['Worker-Owned Enterprises', 'Public Banking Infrastructure'],
    flavor: 'These voters are socialists, who idealize Karl Marx. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'soc_communists',
    name: 'Communists',
    partyId: 'socialist',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 92000,
    sliders: { social: 5.0, economic: 1.0, governance: 7.0 },
    keyIssues: ['Expropriation of Corporate Monopolies', 'Centralized Economic Planning'],
    flavor: 'These are communists, who want total state control over the economy. They should never be a member of a party with more than 5 million members of other factions'
  },
  // --- UNAFFILIATED FACTIONS (3 Factions: 325,000 Fringe Non-Voting Blocs) ---
  {
    id: 'unaff_groypers',
    name: 'Groypers',
    partyId: 'none',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 125000,
    sliders: { social: 9.2, economic: 6.1, governance: 9.5 },
    keyIssues: ['Immigration Moratorium', 'Anti-Globalist Sovereignty'],
    flavor: 'Online alt-right provocateurs and youth reactionaries who use irony, memes, and internet culture to push far-right ethno-nationalist talking points into mainstream discourse.'
  },
  {
    id: 'unaff_the_klan',
    name: 'The Klan',
    partyId: 'none',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 100000,
    sliders: { social: 10.0, economic: 6.0, governance: 10.0 },
    keyIssues: ['Racial Segregation', 'Total Immigration Ban'],
    flavor: 'These voters support the Klu Klux Klan. They should never be a member of a party with more than 5 million members of other factions'
  },
  {
    id: 'unaff_neo_nazis',
    name: 'Neo-Nazi’s',
    partyId: 'none',
    type: 'ideological',
    status: 'fringe',
    targetVoters: 100000,
    sliders: { social: 10.0, economic: 5.0, governance: 10.0 },
    keyIssues: ['Totalitarian State Authority', 'Total Border Militarization'],
    flavor: 'These Voters support the Nazi’s. They should never be a member of a party with more than 5 million members of other factions'
  }
];
```

---

## 3. Subsystem Architecture & Implementation Specifications

### Subsystem A: Data Ingestion & State Reconciliation (`REQ-146`)
1. Ingest `FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv` into game state during initialization (`initializeGame` / `ensureThirdPartyAffiliations` in `engine.js`).
2. Attach faction breakdown arrays directly to each state record: `state.factions = { [factionId]: voterCount }`.
3. Total party registration in every state is recalculated dynamically from its constituent factions:
   $$\text{state.affiliations}[pid] = \frac{1}{100} \sum_{f \in \text{Factions}(pid)} \text{state.factions}[f]$$
4. **Preserve Current State Baseline Totals:** Independent registration (`state.affiliations.independent`) remains 100% untouched and matches the sum of the 9 swing factions.

---

### Subsystem B: Dual Metric Faction Dynamics (`REQ-147`)

#### 1. Faction Standing / Happiness (Scale: 0–100)
- **Initial Baseline:** Initialized at 68 for established major/leading factions, 60 for minor/fringe factions.
- **Dynamic Shifts:**
  - **Platform Alignment:** Moving party platform sliders closer to faction ideal points adds up to $+5$ Happiness per cycle; defying them penalizes up to $-8$ Happiness.
  - **Convention Keynotes:** Granting a faction the Keynote address awards $+12$ Happiness.
  - **Bill Sponsorship:** Introducing legislative bills addressing a faction's 2 Key Issues adds $+6$ Happiness.
- **Turnout Penalty:** If a party's average faction happiness falls below 45, apply a nationwide base turnout drag up to $-9.0\%$.
- **Grassroots Fundraising Multiplier:**
  $$M_{\text{factions}} = 0.50 + \left(\frac{\text{Average\_Happiness}}{100}\right) \times 0.70$$

#### 2. Faction Confidence (Scale: 1–100)
- **Initial Baseline:** All 38 factions start at exactly **50 Confidence**.
- **The Core Ways to Modify Confidence:**
  1. **Council of Party Elders:** Retired politicians exiting office with Net Approval $\ge +20$ grant an immutable, passive $+1.5$ Confidence stabilization floor to their aligned faction.
  2. **Post-Election Autopsy ("Blame Game"):**
     - *Endorse Ascendant Report:* $+8$ Confidence to authoring faction, $-7$ Confidence to defensive faction.
     - *Shelve Report:* $+4$ Member Happiness to party, $-5$ Confidence to activist faction.
  3. **Leadership Role Appointments:** Appointing a politician to any institutional leadership position (Cabinet post, Congressional leadership, Opposition leadership, or Party leadership role) immediately awards **+3 Confidence** to that politician's aligned faction (`faction.confidence = Math.min(100, faction.confidence + 3)`).
*(Note: Primary Filtering Support alters Happiness, not Confidence).*

---

### Subsystem C: Primary Wins Voter Conversion & Faction Growth Flow (`REQ-148`)

1. **Politician & Candidate Faction Assignment:**
   - Every politician across the 605-member database (sitting officeholders across House, Senate, Governors, state legislators, Party Elders, and primary candidates) is assigned to exactly one faction based on public perception and ideological stance.
   - **Collective Defection Rule:** Faction loyalty precedes party loyalty: if a politician's faction leaves the party (via Bolt Threats, Coalition Summit failure, or regional splinter runs), they follow their faction and leave the party as well.
   - **Happiness Initialization & Co-Movement:** A politician's starting happiness is initialized directly from their faction's happiness. Whenever the faction's happiness shifts, the politician's happiness shifts in tandem.
   - **Organic Drift:** Individual politician happiness and collective faction happiness drift apart over time as the chair supports, funds, mentors, or neglects specific candidates and politicians.
2. **Primary Win Voter Influx:**
   When a candidate wins their primary, their faction converts voters from other proximate factions within that state:
   - **State Legislature Primary Win:** Base 200 voters, scaled to party approval, rounded to nearest 100.
     $$\Delta V = \text{RoundTo100}\left(200 \times \frac{\text{PartyApproval}}{100}\right)$$
     *(e.g., at 40% approval: $200 \times 0.40 = 80 \implies 100\text{ voters}$)*
   - **House Race Primary Win:** Base 1,000 voters, scaled to party approval, rounded to nearest 100.
     $$\Delta V = \text{RoundTo100}\left(1000 \times \frac{\text{PartyApproval}}{100}\right)$$
     *(e.g., at 40% approval: $1000 \times 0.40 = 400\text{ voters}$)*
   - **Senate or Governor Primary Win:** Base 2,500 voters, scaled to party approval, rounded to nearest 100.
     $$\Delta V = \text{RoundTo100}\left(2500 \times \frac{\text{PartyApproval}}{100}\right)$$
     *(e.g., at 40% approval: $2500 \times 0.40 = 1000\text{ voters}$; at 10% approval: $2500 \times 0.10 = 250 \implies 300\text{ voters}$)*
3. **Conversion Rules:**
   - Voters are transferred from the most ideologically proximate factions within the party in that state (calculated by Euclidian distance across Social, Economic, and Governance sliders).
   - **Racial and Extremist Faction Immunity:** Racial factions (*Black Voters*, *Traditional Latin Voters*, *Mormons*, *Cubans*, *Working Class Latinos*) and Extremist factions with the $<5\text{M}$ tag are completely immune to losing voters from primary conversions.
4. **Directional Flow (Factions $\implies$ Parties):**
   - **Disable voters leaving parties outside of movement between factions.**
   - Factions growing and shrinking directly dictate party sizes; external party realignment shifts no longer override faction totals.
   - When new voters are gained via GOTV, they are distributed among party factions weighted by tier: **Fringe: 1**, **Minor: 5**, **Major/Leading: 20**.

---

### Subsystem D: Primary Filtering Support & Fringe Caps (`REQ-149`)

1. **Filtering Support Mechanic:**
   - Official nomenclature: "Filtering Support" (cost: 1 Organizing Action, $100k party funds).
   - Grants an immediate $+10$ point swing in primary election margin to the backed candidate.
   - **Modifies Happiness (Not Confidence):** $+1$ Happiness to candidate's faction, $-3$ Happiness to all other party factions (Confidence is unaffected).
2. **Fringe Primary Polling Cap:**
   - Candidates belonging to Fringe factions ($< 1\text{M}$ voters) cannot poll above 5% in major party primaries **unless** the Party Chair uses "Filtering Support" on them, which lifts the cap and applies the $+10$ point swing.

---

### Subsystem E: Swing Faction Persuasion & Non-Voting Blocs (`REQ-150`)

1. **Partisan Loyalty:**
   - 100% of voters in Democratic, Republican, Libertarian, Green, Constitution, and Socialist factions vote loyally for their party's nominee.
2. **Swing Persuasion Engine:**
   - The 9 Independent/Swing factions (48,029,800 voters) determine general election persuasion and margin swings.
   - **National Environment Scaling ($\pm 20\%$ Bounds):**
     - If National Environment is **D+20% or greater**: $100\%$ of all voters in every independent faction vote Democratic.
     - If National Environment is **R+20% or greater**: $100\%$ of all voters in every independent faction vote Republican.
     - At **Even Environment (0.0)**: Independent factions split according to their baseline lean (e.g., Hard Hats 60% GOP, Technocrats 65% Dem, True Centrists 50/50), with swing factions heavily favoring their preferred candidate (up to 80%).
     - Linear scaling formula between $-20\%$ and $+20\%$:
       $$\text{DemShare} = \text{Clamp}\left(\text{BaseDem} + \left(\frac{\text{NetEnv}}{20}\right) \times (1.0 - \text{BaseDem}), 0.0, 1.0\right)$$
3. **Non-Voting Blocs:**
   - Factions that do not belong to a registered party and are not designated as swing factions (*The Klan*, *Neo-Nazi's*, *Groypers*, and non-aligned extremist fringe) **DO NOT VOTE** (0% turnout).

---

### Subsystem F: Faction Tier Boundaries & Status Evaluation (`REQ-151`)

1. **Size Tiers:**
   - **Fringe:** $< 1,000,000$ voters.
   - **Minor:** $1,000,000$ to $< 2,500,000$ voters.
   - **Major:** $2,500,000+$ voters.
   - **Leading:** The dominant faction of the party.
2. **Leading Faction Hierarchy:**
   - If the sitting U.S. President belongs to this party $\implies$ President's faction is **Leading**.
   - Else $\implies$ Faction with the most combined Senate and House seats is **Leading**.
   - Tie-breaker $\implies$ Faction with the highest total voter membership.
   - Second tie-breaker $\implies$ Incumbent Leading faction remains Leading.
3. **Evaluation Timing:** Factions only shift between Fringe, Minor, Major, and Leading designations **in between elections** (during cycle transition).
4. **Leadership Representation (Major Factions Only):**
   - Major factions ($\ge 2,500,000$ voters, including the Leading faction) are the **only factions entitled to Faction Leader roles** in Category B of the Leadership hierarchy.
   - Minor factions ($1\text{M}–2.5\text{M}$) and Fringe factions ($< 1\text{M}$) do not receive leadership positions.
   - Under the 38-faction baseline, both the Democratic and Republican parties have **exactly 7 Faction Leaders**:
     - *Democratic Party (7 Leaders):* Liberal Establishment Leader, Black Voters Leader, Capital L Left Leader, Neo-Liberals Leader, Bernie Bros Leader, Faith Based Liberals Leader, Blue Dog Democrats Leader. (Minor faction *Traditional Latin Voters* does not generate a leadership role).
     - *Republican Party (7 Leaders):* Faith & Flag Conservatives Leader, Nationalist Populists (MAGA) Leader, Liberty & Western Mavericks Leader, Blood and Soil Nationalists Leader, Frontier & Suburban Moderates Leader, Neo-Cons Leader, Paleocons Leader. (Minor factions *Mormons*, *Traditional Farmers*, *Market Conservatives*, and Fringe *Cubans* do not generate leadership roles).
   - Candidate dropdowns strictly filter to politicians belonging to that specific faction, and appointing a leader grants **+3 Confidence** to that faction.
5. **Directory Categorization (Minor Party vs. Unaffiliated Separation):**
   - In the National Coalition Directory on the Factions Tab, filter pills and section groupings explicitly separate registered third-party factions from non-party unaffiliated factions:
     - `All Factions (38)`
     - `Democratic (8)`
     - `Republican (11)`
     - `Independent / Swing (9)`
     - `Minor Party Factions (7)`: Factions belonging to active third parties (Libertarians: *True Libertarians*, *Ancaps*; Greens: *Eco-Socialist Vanguard*, *YIMBYs*; Constitution: *Christian Dominionists & Theocrats*; Socialists: *Socialists*, *Communists*).
     - `Unaffiliated Factions (3)`: Non-party, non-swing fringe factions (*Groypers*, *The Klan*, *Neo-Nazis*) operating outside all party ballot lines and not voting.
   - The legacy combined pill `Minor / Unaffiliated (10)` is completely replaced by these two distinct categories.

---

## 4. TBD Logged Items (Deferred to Version 0.16+)

The following future expansion items have been formally recorded into `DESIGN_BACKLOG.md`:
1. **Officeholder Power-to-Size Attrition:** Factions losing membership if their share of elected offices is low relative to voter size ("expected members" model).
2. **Ideological Tightness Metric:** Orthodoxy dispersion vs. heresy tolerance within factions.
3. **Platform Issues to be Added:** Standalone pillars for Foreign Policy / Israel / NATO, AI / Compute Controls, Housing / NIMBYism, and Federal Land Deregulation.
4. **Post-Election Party Performance Feedback:** Mechanics adjusting faction sizes based on national electoral outcomes.
5. **Advanced Swing Persuasion Weighting:** Dynamic multi-party split formulas for third-party candidate appeals among swing factions.

---

## 5. Coding Agent Implementation Prompt

```markdown
You are implementing Version 0.15.0 of Coalition Builder: Party Chair in accordance with VERSION_0.15_DESIGN.md.

DO NOT invent random faction numbers or modify the core state affiliations. All work must strictly use FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv and FACTION_STATE_ALLOCATION_REFERENCE.md.

### Core Implementation Checklist:
1. Ingest Faction Matrix:
   - Load FACTION_STATE_ALLOCATION_MATRIX_IN_ENGINE.csv into voterModel.factions and attach per-state faction distributions to voterModel.states[].factions.
   - Maintain 0 variance against the 155M registered voters across all 51 states + DC.
2. Faction Catalog & Metadata:
   - Define window.PartyChairData.FACTIONS_CATALOG containing all 38 factions with complete Sliders, exactly 2 Key Issues, and completed Flavor text as specified in Section 2 of VERSION_0.15_DESIGN.md.
3. Dual Metrics (Standing & Confidence):
   - Track standing/happiness (0–100, baseline 68/60) and confidence (1–100, baseline 50) for each faction.
   - Apply the Grassroots Multiplier formula: M = 0.50 + (Average_Happiness / 100) * 0.70.
   - Apply the -9.0% turnout drag when party average happiness < 45.
   - Restrict confidence changes strictly to: Council of Elders (+1.5 floor), Autopsies (+8/-7 or +4/-5), and Leadership Appointments (+3).
4. Primary Win Conversions:
   - Award winning candidate factions voters from ideologically proximate factions within that state: State Leg (+200 base), House (+1,000 base), Senate/Gov (+2,500 base), scaled to party approval and rounded to 100.
   - Enforce immunity for Racial and Extremist (<5M tag) factions.
   - Disable external party shifts; party registration equals the sum of its factions.
5. Filtering Support & Fringe Rules:
   - Implement Filtering Support (+10% primary swing, +1 candidate faction happiness, -3 other factions happiness; confidence unaffected).
   - Hard-cap Fringe factions (<1M voters) at 5% in major primaries unless Filtered.
6. Swing Persuasion & Non-Voting Blocs:
   - Partisan factions vote 100% loyal to their party.
   - The 9 Swing factions split dynamically based on national environment (D+20 = 100% Dem, R+20 = 100% GOP).
   - Non-party, non-swing factions (The Klan, Neo-Nazis, Groypers) turn out 0% / do not vote.
7. Faction Designations, Leadership Roles & UI Dashboard:
   - Re-evaluate Fringe/Minor/Major/Leading tiers strictly between election cycles.
   - Generate Category B Faction Leader roles strictly for Major factions (7 for Democrats, 7 for Republicans), filtering candidate appointments by faction (+3 Confidence on appointment).
   - Add a "Factions" UI tab rendering faction status, confidence, happiness, and per-state allocations, with directory filter pills strictly separating into "Minor Party Factions (7)" and "Unaffiliated Factions (3)" (replacing the combined 10-pill).

Ensure npm test and node build.js run cleanly.
```
