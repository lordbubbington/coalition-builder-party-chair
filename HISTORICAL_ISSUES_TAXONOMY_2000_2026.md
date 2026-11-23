# 21st Century Electoral Issues Taxonomy (2000–2026)

> **Reference Artifact for Coalition Builder: Party Chair**  
> Covers **719 authenticated issues** across all 14 federal election cycles of the 21st century (2000 to 2026).  
> Structured across **10 Salience Tiers**, split into **Ideological** and **News** categories, with standardized **1–10 directional pole ratings** for all 6 starting game parties.

---

## 1. Summary & Generated Files

| File | Type | Total Records | Primary Index |
| :--- | :--- | :--- | :--- |
| [**HISTORICAL_ISSUES_2000_2026.csv**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/HISTORICAL_ISSUES_2000_2026.csv) | Full CSV Dataset | 719 issues | `Cycle_Year` + `Issue_ID` |
| [**historical-issues-data.js**](file:///c:/Users/rober/.gemini/antigravity/scratch/party-chair-game/historical-issues-data.js) | Standalone Engine Module | 719 issues | `HISTORICAL_ISSUES` array |

### Distribution by Cycle
| Cycle Year | Election Type | Total Issues | Ideological Issues | News Issues |
| :---: | :--- | :---: | :---: | :---: |
| **2000** | Presidential | **52** | 30 | 22 |
| **2002** | Midterm | **52** | 12 | 40 |
| **2004** | Presidential | **52** | 9 | 43 |
| **2006** | Midterm | **50** | 1 | 49 |
| **2008** | Presidential | **52** | 7 | 45 |
| **2010** | Midterm | **52** | 1 | 51 |
| **2012** | Presidential | **51** | 2 | 49 |
| **2014** | Midterm | **51** | 1 | 50 |
| **2016** | Presidential | **51** | 0 | 51 |
| **2018** | Midterm | **51** | 1 | 50 |
| **2020** | Presidential | **52** | 1 | 51 |
| **2022** | Midterm | **51** | 0 | 51 |
| **2024** | Presidential | **51** | 3 | 48 |
| **2026** | Midterm | **51** | 3 | 48 |
| **Total** | **14 Cycles (2000–2026)** | **719** | **71** | **648** |

---

## 2. Issue Taxonomy: Ideological vs. News

1. **Ideological Issues (Era-Defining, ~50+ Year Average Lifespan):**
   - Anchor long-term party identity and core worldviews.
   - Examples: Abortion rights, progressive income taxation, gun control, school vouchers, affirmative action, capital punishment, free trade vs. tariffs, federal minimum wage, healthcare system structure, federalism.
   - In the game engine, Ideological issues remain active across decades; their **Salience Tier** shifts dynamically as external events push them to the forefront or background.
2. **News Issues (Cycle-Defining, 1–4 Cycle Lifespan):**
   - Event-driven shocks, legislative battles, foreign wars, corporate collapses, natural disasters, or high-profile state ballot initiatives.
   - Examples: 2000 Budget Surplus & Elián González; 2002 Iraq AUMF & Enron/SOX; 2004 Abu Ghraib & 11 State Marriage Amendments; 2006 Katrina & Abramoff; 2008 TARP & Subprime Crash; 2010 ACA Passage & Tea Party; 2012 Benghazi & Sandy Hook; 2014 ISIS & Ferguson; 2016 Trump Wall & Clinton Emails; 2018 TCJA & Kavanaugh; 2020 COVID Lockdowns & George Floyd; 2022 Dobbs & 8.5% Inflation; 2024 Gaza War & Presidential Age; 2026 AI Displacement & TCJA Expiration Cliff.

---

## 3. The 10 Salience Tiers

Issues are categorized into 10 structured tiers reflecting real historical polling (Gallup, Pew, ANES, exit polls), legislative agendas, ballot referendums, and talk radio/opinion discourse:

- **Tier 1: Dominant National Deciding Issues** — The 1–3 supreme issues commanding >70% of news coverage and voter priority.
- **Tier 2: Major Presidential / Midterm Campaign Pillars** — Core debate planks, primary television ad spending targets, and major legislative overhauls.
- **Tier 3: Partisan Base Mobilizers & High-Stakes Wedge Battles** — Controversies designed to turn out partisans and divide the opposition.
- **Tier 4: Congressional, Legislative & Budgetary Showdowns** — Major bills, filibusters, reconciliation fights, and investigative committee clashes.
- **Tier 5: High-Impact State Ballot Measures & Citizen Initiatives** — Direct democracy measures on cannabis, marriage, minimum wage, assisted dying, vouchers, and abortion.
- **Tier 6: Cultural, Talk Radio & Social Media Flashpoints** — Controversies driving cable news, op-eds, talk radio, and viral social media debate.
- **Tier 7: Judicial Nominations & Federal Regulatory Mandates** — Supreme Court nominations, appellate confirmations, EPA/FCC/FDA agency rulemaking.
- **Tier 8: Third-Party, Dissident & Grassroots Demands** — Planks championed by Libertarians, Greens, Socialists, or Constitutionalists that challenge the duopoly.
- **Tier 9: State/Local Governance, Policing & Critical Infrastructure** — Zoning, transportation bonds, municipal crime policies, utility rates, and public facilities.
- **Tier 10: Long-Term Structural, Constitutional & Solvency Debates** — Entitlement trust fund depletion, debt ceiling, Electoral College reform, and filibuster reform.

---

## 4. Directional Scale (1 to 10) & 6 Starting Game Parties

Each issue defines explicit poles:
- **Pole 1**: Generally represents the progressive, dovish, civil-libertarian, public-investment, or status-quo-challenging left position.
- **Pole 10**: Generally represents the conservative, hawkish, traditionalist, free-market deregulatory, or America First position.

### Party Alignment Stances
1. **Democratic Party (`people`):** Center-left mainstream (typically 2–4 on social/economic/climate issues, 3–5 on defense/foreign trade).
2. **Republican Party (`heritage`):** Conservative mainstream (typically 8–10 on tax cuts, deregulation, border security, defense; 8–10 on social conservatism).
3. **Libertarian Party (`liberty`):** Free-market maximalism + anti-authoritarian civil liberties (typically 1–2 on drug legalization, criminal justice, foreign non-intervention; 9–10 on tax abolition, deregulation, school choice).
4. **Green Party (`green`):** Eco-socialist, pacifist, social justice (typically 1–2 on climate, single-payer, foreign demilitarization, criminal justice; 1–2 on wealth taxation).
5. **Constitution Party (`constitution`):** Paleoconservative, Christian nationalist, strict originalist (typically 9–10 on traditional marriage, anti-abortion personhood, border militarization, non-interventionist sovereignty; 9–10 on eliminating federal agencies).
6. **Peace and Freedom / Socialist (`socialist`):** Democratic socialist / Marxist-labor (typically 1 on wealth redistribution, nationalizing utilities, anti-war, universal public guarantees; 1 on racial and labor solidarity).

---

## 5. How Far Back Can We Go Using This Method?

A rigorous historical and methodological assessment of applying this granular issue-tier framework across American history:

### Period 1: 1980–1998 (The Late 20th Century / Reagan–Clinton Era) — **100% High-Fidelity Feasibility**
- **Data Availability:** Continuous scientific national polling (Gallup, Pew Research Center, CBS/NYT, NBC/WSJ, ABC/WaPo), Voter News Service (VNS) exit polls for every election since 1972, comprehensive BallotPedia state referendum records, and digitized television broadcast news archives.
- **Issue Yield:** Easily supports **50–80 issues per cycle** across all 10 tiers.
- **Key Milestones:** 1980 Stagflation/Iran Hostage crisis, 1982 Midterm recession, 1984 Reagan Boom, 1986 Tax Reform Act, 1988 Willie Horton/Pledge of Allegiance, 1990 ADA & Gulf War, 1992 Perot/Deficit, 1994 Contract with America, 1996 Welfare Reform, 1998 Clinton Impeachment.

### Period 2: 1960–1978 (Civil Rights, Vietnam & Stagflation) — **95% High-Fidelity Feasibility**
- **Data Availability:** The American National Election Studies (ANES, conducting comprehensive biennial voter attitude studies since 1948), Gallup monthly presidential approval and 'Most Important Problem' (MIP) polling, Harris Interactive, Roper polls, Congressional Quarterly roll-call scoring, and extensive state initiative records (e.g. California Prop 13 in 1978).
- **Issue Yield:** Supports **40–60 issues per cycle**.
- **Key Milestones:** 1960 Space Race/Cuba/Missile Gap, 1962 Cuban Missile Crisis, 1964 Civil Rights Act/Goldwater, 1966 Vietnam Escalation, 1968 Tet Offensive/Civil Rights riots/Wallace, 1970 Clean Air Act/Kent State, 1972 Watergate/Equal Rights Amendment, 1974 Nixon Resignation, 1976 Energy Crisis, 1978 Tax Revolt.

### Period 3: 1936–1958 (The New Deal, World War II & Early Cold War) — **85% Solid Feasibility**
- **Data Availability:** George Gallup founded the American Institute of Public Opinion in 1935, publishing nationwide issue polling starting in 1936. Elmo Roper and Archibald Crossley pioneered systematic polling. Congressional records (roll-calls on the New Deal, Lend-Lease, Taft-Hartley), extensive radio broadcasts, party platforms, and state referendums.
- **Issue Yield:** Supports **35–50 issues per cycle**.
- **Key Milestones:** 1936 New Deal Social Security/Court-Packing, 1938 Fair Labor Standards, 1940 Lend-Lease/Third Term, 1942 War Mobilization/Rationing, 1944 GI Bill, 1946 Post-War Strike Wave, 1948 Taft-Hartley/Truman Civil Rights/Dixiecrats, 1950 Korean War, 1952 McCarthyism/K1C2, 1954 Brown v. Board, 1956 Interstate Highway/Suez, 1958 Sputnik/Recession.

### Period 4: 1896–1934 (The Progressive Era & Roaring Twenties) — **70% Moderately High Feasibility (Pre-Scientific Polling)**
- **Data Availability:** Scientific random-sample polling did not exist before 1935. However, vast public sentiment records exist: *The Literary Digest* national straw polls (commenced 1916 with millions of ballots mailed), newspaper straw polls, verbatim party platform resolution debates, Congressional roll-call records, and state direct democracy ballot measures (South Dakota and Oregon pioneered state initiatives in 1898–1904).
- **Issue Yield:** Supports **25–40 issues per cycle**.
- **Key Milestones:** 1896 Gold Standard vs. Free Silver, 1898 Spanish-American War/Imperialism, 1902 Coal Strike/Trust Busting, 1906 Pure Food and Drug Act, 1912 Bull Moose/New Freedom, 1914 Federal Reserve, 1916 WWI Neutrality, 1918 Sedition Act/Flu, 1920 League of Nations/Women's Suffrage, 1924 Teapot Dome/La Follette, 1928 Prohibition/Al Smith Catholicism, 1932 Great Depression/Bank Failures.

### Period 5: 1860–1894 (The Civil War & Gilded Age) — **50–60% Feasibility (Platform & Roll-Call Model)**
- **Data Availability:** No public opinion polls exist. Sourcing relies on party national platforms, state party conventions, congressional roll-call votes, presidential vetoes, partisan newspaper editorials, political pamphlets, and sermon transcripts.
- **Issue Yield:** Supports **20–30 core issues per cycle**.
- **Key Milestones:** 1860 Sectional Slavery/Homestead Act, 1862 Emancipation Proclamation/Legal Tender, 1864 Wartime Conduct/Peace Democrats, 1866 Radical Reconstruction/14th Amendment, 1868 Impeachment of Andrew Johnson, 1872 Credit Mobilier/Liberal Republican revolt, 1876 Compromise of 1877, 1880 Civil Service Reform, 1884 Blaine/Cleveland Mugwumps, 1888 McKinley Tariff, 1892 Populist Omaha Platform/Silver.

### Period 6: 1788–1858 (Founding Era to Jacksonian Democracy) — **35–45% Feasibility (Institutional & Ideological Framework)**
- **Data Availability:** No voter surveys. Primary sources: Annals of Congress, Register of Debates, Congressional Globe, federal statute books, partisan newspapers (e.g. *National Gazette* vs *Gazette of the United States*), Federalist/Anti-Federalist papers, state legislative resolutions (Virginia & Kentucky Resolutions), and correspondence of titans (Hamilton, Jefferson, Madison, Jackson, Clay, Calhoun).
- **Issue Yield:** Supports **15–25 fundamental issues per cycle**.
- **Key Milestones:** 1790 Hamilton's Assumption of Debt / Bank of the United States, 1794 Jay Treaty / Whiskey Rebellion, 1798 Alien & Sedition Acts / Quasi-War, 1800 Revolution of 1800, 1803 Louisiana Purchase, 1807 Embargo Act, 1812 War of 1812, 1816 Second Bank / Tariff of 1816, 1820 Missouri Compromise, 1824 Corrupt Bargain / American System, 1828 Tariff of Abominations, 1832 Bank War / Nullification Crisis, 1837 Panic of 1837 / Independent Treasury, 1844 Texas Annexation / 54°40' or Fight, 1846 Mexican-American War / Wilmot Proviso, 1850 Compromise of 1850 / Fugitive Slave Act, 1854 Kansas-Nebraska Act / Bleeding Kansas, 1857 Dred Scott Decision.

---

## 6. Summary Conclusion

The methodology of pairing **Ideological** vs. **News** issues, categorized into **Salience Tiers**, with **1–10 directional party stances**:
- **Fully and deeply operational from 2000 to 2026** with **50–55 issues per cycle** (719 issues total).
- **Can extend seamlessly back to 1936** with scientific polling and extensive data support (35–60 issues per cycle).
- **Can extend back to the Founding (1788)** by transitioning data inputs from public polling to *congressional roll-call votes, party platforms, state referendum ballots, and partisan press discourse* (yielding 15–35 authentic issues per cycle).
