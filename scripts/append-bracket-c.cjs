/**
 * scripts/append-bracket-c.cjs
 * Appends 1978, 1980, and 1982 to scripts/build-bracket-c.cjs
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build-bracket-c.cjs');
let content = fs.readFileSync(filePath, 'utf8');

// Strip trailing console.log
content = content.replace(/console\.log\('Bracket C \(1976\).*?\n*/g, '');

const additions = `
// =========================================================================
// 1978 (50 Issues)
// =========================================================================
add(1978, "1978_california_proposition_13_tax_revolt", "California Proposition 13 Property Tax Revolt (Jarvis-Gann Amendment)", "News", "1978 (Prop 13 Tax Revolt)", "Economy & Taxation", 1,
  "California voters passing Prop 13 by 65% landslide, capping real property taxes at 1% of assessed value and requiring a two-thirds legislative vote for tax hikes, igniting national tax revolt.",
  "1 = Dangerous Fiscal Sabotage Starving Public Schools, Libraries, and Municipal Services of Vital Local Revenues", "10 = Glorious Grassroots Victory Shielding Senior and Middle-Class Homeowners from Predatory County Property Tax Confiscation", 2, 10, 10, 1, 10, 1);

add(1978, "1978_camp_david_accords_egypt_israel", "Camp David Accords Historic Middle East Peace Framework", "News", "1978 (Camp David Breakthrough)", "Foreign Policy & Defense", 1,
  "President Carter brokering historic peace framework between Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin after 13 days of seclusion at Camp David.",
  "1 = Monumental Diplomatic Triumph of Patient Peacemaking Ending 30 Years of War Between Israel and Its Largest Arab Neighbor", "10 = Celebrate Egyptian-Israeli Peace While Guarding Against Pressure on Israel to Compromise Strategic Security on West Bank", 2, 8, 4, 1, 8, 1);

add(1978, "1978_panama_canal_treaties_senate_ratification", "Senate Ratification of the Panama Canal Treaties (Torrijos-Carter)", "News", "1978 (Panama Canal Ratification)", "Foreign Policy & Defense", 1,
  "Senate narrowly approving two treaties by 68-32 (one vote over two-thirds) agreeing to transfer permanent control of the Panama Canal to Panama on December 31, 1999.",
  "1 = Essential Modern Decolonization Eliminating Anti-American Resentment and Guaranteeing Permanent Neutrality of the Waterway", "10 = Disgraceful Geopolitical Capitulation Surrendering Strategic American Sovereign Soil and Canal Control to a Leftist Strongman", 2, 10, 6, 1, 10, 1);

add(1978, "1978_bakke_supreme_court_affirmative_action", "Regents of the University of California v. Bakke (Affirmative Action Ruling)", "News", "1978 (Bakke Decision)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 5-4 (Powell opinion) striking down rigid minority admissions quotas at UC Davis medical school, while holding race may be considered as a 'plus' factor in admissions.",
  "1 = Uphold Affirmative Action as a Moral Necessity to Remedy Deep Historical Racial Injustice and Foster Campus Diversity", "10 = Reverse Discrimination Violates the Colorblind Guarantee of the Equal Protection Clause / Outlaw All Race-Based Admissions", 2, 9, 7, 1, 10, 1);

add(1978, "1978_airline_deregulation_act_of_1978", "Enactment of the Airline Deregulation Act of 1978 (Dismantling CAB)", "News", "1978 (Airline Deregulation)", "Technology & Infrastructure", 1,
  "Phasing out the Civil Aeronautics Board (CAB), eliminating government route licensing and price-fixing, and unleashing free-market airline competition and discount airfares.",
  "1 = Brilliant Pro-Consumer Deregulation Democratizing Commercial Air Travel and Lowering Fares for Working-Class Vacationers", "10 = Splendid Free-Market Reform, Though Safeguards Must Ensure Small Rural Communities Retain Essential Air Service", 2, 8, 10, 2, 8, 1);

add(1978, "1978_humphrey_hawkins_full_employment_act", "Humphrey-Hawkins Full Employment and Balanced Growth Act of 1978", "News", "1978 (Humphrey-Hawkins Enactment)", "Economy & Taxation", 1,
  "Mandating the federal government and Federal Reserve pursue dual statutory goals of full employment (4% unemployment) and price stability (3% inflation).",
  "1 = Historic Commitment Making Full Employment the Premier National Objective Backed by Federal Public Investment", "10 = Meaningless Symbolic Statutory Rhetoric / Artificially Forcing 4% Unemployment Will Reignite Runaway Inflation", 2, 9, 9, 1, 9, 1);

add(1978, "1978_love_canal_chemical_emergency_declaration", "President Carter's Emergency Declaration at Love Canal Toxic Waste Dump", "News", "1978 (Love Canal Chemical Disaster)", "Energy & Climate", 1,
  "Federal emergency declaration evacuating hundreds of families in Niagara Falls, NY after 20,000 tons of Hooker Chemical toxic wastes leaked into basements and an elementary school.",
  "1 = Unvarnished Proof of Corporate Chemical Poisoning Demanding Sweeping Federal Superfund Cleanups and Severe Polluter Liabilities", "10 = Tragic Local Industrial Waste Emergency Demanding Responsible Cleanup Without Panicked Federal Nationalization of Waste Sites", 2, 8, 8, 1, 8, 1);

add(1978, "1978_creation_of_section_401k_retirement", "Revenue Act of 1978 & Enactment of Section 401(k) Retirement Plans", "News", "1978 (401k Inception)", "Economy & Taxation", 1,
  "Adding Section 401(k) to the Internal Revenue Code, allowing employees to receive cash or defer compensation into tax-sheltered defined-contribution retirement plans.",
  "1 = Facilitates Voluntary Retirement Savings, Though It Must Never Replace Guaranteed Traditional Defined-Benefit Union Pensions", "10 = Revolutionary Empowerment of Individual Workers to Build Personal Investment Wealth in the American Stock Market", 3, 9, 10, 2, 9, 1);

add(1978, "1978_capital_gains_tax_cut_revenue_act", "Revenue Act of 1978 Slashing Capital Gains Tax Rate from 49% to 28%", "News", "1978 (Capital Gains Cut - Steiger Amendment)", "Economy & Taxation", 1,
  "Congress passing Steiger Amendment over Carter's initial opposition, slashing top effective capital gains rate from 49% to 28% to stimulate venture capital.",
  "1 = Unjust Tax Handout to Wall Street Speculators and Wealthy Investors Enlarging Economic Inequality", "10 = Visionary Supply-Side Tax Reduction Unleashing Locked-Up Capital, Spurring New Venture Investments, and Creating Millions of Jobs", 2, 9, 10, 1, 9, 1);

add(1978, "1978_foreign_intelligence_surveillance_act_fisa", "Enactment of the Foreign Intelligence Surveillance Act of 1978 (FISA)", "News", "1978 (FISA Court Enactment)", "Governance & Judiciary", 1,
  "Establishing statutory warrant requirements for national security electronic wiretapping and creating the secret Foreign Intelligence Surveillance Court (FISC).",
  "1 = Essential Constitutional Check Ending Decades of Lawless Domestic Spying Under the Guise of Executive Discretion", "10 = Dangerous Bureaucratic Impediment Tying the Hands of Intelligence Agencies Tracking Soviet Spies and Foreign Terrorists", 2, 8, 2, 1, 8, 1);

add(1978, "1978_civil_service_reform_act_of_1978", "Enactment of the Civil Service Reform Act of 1978 (Abolishing CSC / Creating OPM)", "News", "1978 (Civil Service Reform)", "Governance & Judiciary", 2,
  "Replacing the 95-year-old Civil Service Commission with the Office of Personnel Management (OPM), Merit Systems Protection Board (MSPB), and Senior Executive Service (SES).",
  "1 = Modernize Federal Bureaucracy While Protecting Whistleblowers and Collective Bargaining for Public Employees", "10 = Sensible Executive Reorganization Providing Managers Real Authority to Reward Merit and Fire Incompetent Bureaucrats", 2, 8, 7, 2, 8, 1);

add(1978, "1978_ethics_in_government_act_independent_counsel", "Ethics in Government Act of 1978 (Special Prosecutor / Independent Counsel)", "News", "1978 (Ethics in Government Enacted)", "Governance & Judiciary", 1,
  "Establishing statutory independent counsel mechanism to investigate executive branch criminality and mandating comprehensive public financial disclosures for federal officials.",
  "1 = Indispensable Post-Watergate Safeguard Guaranteeing Impartial, Conflict-Free Prosecution of Corrupt Presidents and Cabinet Officers", "10 = Unaccountable Fourth Branch Prosecutor with Unlimited Budgets Prone to Politicized Partisan Witch Hunts", 2, 8, 3, 1, 8, 1);

add(1978, "1978_pregnancy_discrimination_act_of_1978", "Enactment of the Pregnancy Discrimination Act of 1978 (Title VII Expansion)", "News", "1978 (Pregnancy Discrimination Act)", "Civil Rights & Social Issues", 1,
  "Amending Title VII of the Civil Rights Act to explicitly prohibit employment discrimination based on pregnancy, childbirth, or related medical conditions.",
  "1 = Fundamental Moral Protection Ensuring Working Women Are Never Fired, Demoted, or Denied Health Insurance Due to Motherhood", "10 = Support Working Mothers While Guarding Against Excessive Frivolous Litigation Over Employer Disability Leave Policies", 2, 8, 4, 1, 9, 1);

add(1978, "1978_purpa_public_utility_regulatory_policies_act", "Enactment of PURPA (Public Utility Regulatory Policies Act of 1978)", "News", "1978 (PURPA Renewable Mandate)", "Energy & Climate", 1,
  "Mandating commercial electric utilities purchase power from qualifying independent renewable energy and cogeneration facilities at avoided-cost rates.",
  "1 = Transformative Legislation Breaking Electric Monopoly Cartels and Spurring the First Wave of Modern Solar, Wind, and Cogen Power", "10 = Coercive Federal Mandate Forcing Utilities to Purchase Expensive Unreliable Power, Subsidizing Green Speculators", 2, 8, 8, 1, 8, 1);

add(1978, "1978_natural_gas_policy_act_phased_deregulation", "Natural Gas Policy Act of 1978 (Phased Wellhead Price Decontrol)", "News", "1978 (Natural Gas Decontrol Compromise)", "Energy & Climate", 1,
  "Lengthy congressional compromise establishing a phased schedule to deregulate new natural gas wellhead prices by 1985 and ending interstate/intrastate market split.",
  "1 = Complex Compromise That Protects Consumers from Abrupt Heating Cost Shocks While Gradually Encouraging Production", "10 = Long-Overdue Market Deregulation Halting Destructive Artificial Shortages and Unleashing American Drilling Capital", 2, 8, 9, 1, 9, 1);

add(1978, "1978_inspector_general_act_of_1978", "Enactment of the Inspector General Act of 1978 (Statutory Departmental IGs)", "News", "1978 (Inspector General Act)", "Governance & Judiciary", 2,
  "Creating independent, Senate-confirmed Inspectors General across 12 major executive departments with subpoena powers to combat waste, fraud, and abuse.",
  "1 = Vital Bipartisan Watchdogs Exposing Government Corruption, Financial Waste, and Programmatic Malfeasance Directly to Congress", "10 = Support Vigorous Audits to Slash Wasteful Bureaucratic Spending and Hold Entrench Civil Servants Accountable", 2, 7, 3, 1, 7, 1);

add(1978, "1978_indian_child_welfare_act_icwa", "Enactment of the Indian Child Welfare Act of 1978 (ICWA)", "News", "1978 (ICWA Enactment)", "Civil Rights & Social Issues", 2,
  "Establishing federal tribal jurisdiction over child custody cases involving Native American children to halt epidemic removals by state welfare agencies.",
  "1 = Essential Moral Protection Halting the Traumatic Cultural Genocide of Severing Native Children from Their Tribes and Heritage", "10 = Support Tribal Welfare Rights While Ensuring State Courts Retain Flexibility to Protect the Paramount Best Interests of the Child", 2, 8, 4, 1, 8, 1);

add(1978, "1978_american_indian_religious_freedom_act", "Enactment of the American Indian Religious Freedom Act of 1978 (AIRFA)", "News", "1978 (AIRFA Enactment)", "Civil Rights & Social Issues", 2,
  "Affirming Native Americans' constitutional right to exercise traditional religions, access sacred ceremonial sites on public lands, and use sacred objects.",
  "1 = Long-Overdue Recognition of the Sacred First Amendment Religious Freedom of Indigenous Peoples", "10 = Respect Traditional Indigenous Worship Without Paralyzing Public Land Multi-Use Resource Management and Access", 2, 7, 3, 1, 7, 1);

add(1978, "1978_fcc_v_pacifica_seven_dirty_words", "FCC v. Pacifica Foundation Supreme Court Ruling (Carlin Seven Dirty Words)", "News", "1978 (Pacifica Indecency Ruling)", "Governance & Judiciary", 2,
  "Supreme Court ruling 5-4 that the FCC has authority to penalize broadcast radio and television for airing 'indecent' profanity during daytime hours when children are listening.",
  "1 = Chilling First Amendment Free Speech Infringement Censoring Contemporary Culture and Satire on Public Airwaves", "10 = Wholesome Protection Defending American Children and Families from Lewd Profanity and Pornographic Speech in Public Media", 2, 8, 4, 1, 10, 1);

add(1978, "1978_california_prop_6_briggs_initiative_defeated", "California Proposition 6 (Briggs Anti-Gay Teacher Initiative) Defeated", "News", "1978 (Briggs Initiative Defeated)", "Civil Rights & Social Issues", 1,
  "California voters rejecting (58% to 42%) initiative championed by John Briggs to mandate firing openly homosexual public school teachers and anyone advocating gay rights.",
  "1 = Historic Civil Rights Milestone Defeating Bigotry and Defending Free Speech and Dignity for Gay and Lesbian Educators", "10 = Prop 6 Was Overly Broad and Infringed Free Speech, Even While Communities Must Retain Moral Standards in Classrooms", 2, 8, 3, 1, 9, 1);

add(1978, "1978_emergence_of_moral_majority_christian_right", "Mobilization of the Christian Right & Formation of the Moral Majority", "News", "1978-1980 (Christian Right Political Awakening)", "Civil Rights & Social Issues", 1,
  "Conservative evangelical pastors led by Jerry Falwell mobilizing millions of fundamentalist Christians against abortion, gay rights, and IRS attacks on Christian school tax exemptions.",
  "1 = Dangerous Theocratic Threat Seeking to Impose Religious Dogma on Public Schools and Dismantle the Wall of Separation", "10 = Righteous Spiritual and Moral Awakening Restoring Faith, Biblical Values, and Pro-Family Conviction to American Politics", 2, 10, 6, 1, 10, 1);

add(1978, "1978_chrysler_corporation_financial_collapse_seeds", "Chrysler Corporation Financial Crisis & Lee Iacocca Takes the Helm", "News", "1978 (Chrysler Crisis Genesis)", "Economy & Taxation", 2,
  "America's third-largest automaker teetering on insolvency following poor sales and heavy retooling costs; Lee Iacocca becomes CEO and prepares federal loan request.",
  "1 = Protect Hundreds of Thousands of Working-Class UAW Autoworkers and Industrial Communities from Catastrophic Ruin", "10 = Free Market Discipline / Government Must Never Bail Out Incompetent Corporate Monopolies with Taxpayer Guarantees", 2, 8, 9, 1, 9, 1);

add(1978, "1978_carter_voluntary_wage_price_guidelines", "President Carter's Voluntary 7% Wage and Price Guidelines", "News", "1978 (Carter Anti-Inflation Standards)", "Economy & Taxation", 2,
  "Carter announcing voluntary guidelines capping wage increases at 7% and limiting corporate price hikes, threatening federal contract cutoffs for non-compliance.",
  "1 = Moderate Cooperative Effort to Curb Spiraling Stagflation Without Imposing Rigid Mandatory Price Controls", "10 = Half-Baked Jawboning Gimmick That Unfairly Penalizes Working-Class Union Wages While Failing to Address Deficit Spending", 3, 7, 10, 1, 9, 2);

add(1978, "1978_coal_miners_111_day_strike_taft_hartley", "United Mine Workers 111-Day Coal Strike & Carter's Taft-Hartley Order", "News", "1977-1978 (UMWA Coal Strike)", "Labor & Welfare", 1,
  "Over 160,000 miners striking for 111 days in freezing winter; Carter invokes Taft-Hartley back-to-work order, which defiant miners openly ignore until contract agreement.",
  "1 = Stand with Brave Coal Miners Fighting for Safe Working Conditions, Health Clinics, and Living Pensions in the Mines", "10 = Defiant Defiance of Federal Court Injunctions Threatening National Electricity Grid During Severe Winter Cold Wave", 2, 9, 8, 1, 9, 1);

add(1978, "1978_diplomatic_recognition_of_china_announced", "President Carter Announces Full Diplomatic Recognition of Communist China", "News", "1978 (PRC Recognition Announcement)", "Foreign Policy & Defense", 1,
  "Carter announcing on December 15 that the U.S. will establish full diplomatic relations with the People's Republic of China on January 1, 1979 and terminate official defense treaty with Taiwan.",
  "1 = Historic Realism Recognizing the Reality of 1 Billion People in Beijing and Consolidating Triangular Diplomacy Against Moscow", "10 = Unforgivable Betrayal and Severing of Official Ties with Free Democratic Taiwan (ROC) Under Coercive Communist Terms", 2, 8, 4, 1, 9, 1);

add(1978, "1978_carter_cancellation_of_b1_bomber", "President Carter Halts Production of the Rockwell B-1A Strategic Bomber", "News", "1977-1978 (B-1 Bomber Cancellation)", "Foreign Policy & Defense", 1,
  "Carter cancelling the B-1A bomber program, arguing standoff air-launched cruise missiles on B-52s and secret stealth aircraft research are more cost-effective.",
  "1 = Courageous Fiscal and Strategic Sanity Cancelling an Obsolescent $100 Million Bomber Vulnerable to Soviet SAMs", "10 = Dangerous Unilateral Disarmament Weakening American Nuclear Deterrence and Gifting Strategic Superiority to the Soviet Union", 2, 9, 4, 1, 9, 1);

add(1978, "1978_neutron_bomb_enhanced_radiation_reversal", "President Carter's Decision to Defer Production of the Neutron Bomb", "News", "1977-1978 (Neutron Bomb Controversy)", "Foreign Policy & Defense", 2,
  "Carter abruptly deferring deployment of enhanced radiation tactical warheads designed to kill Soviet tank crews while sparing civilian buildings, infuriating European NATO allies.",
  "1 = Morally Just Decision Rejecting a Horrific 'Capitalist Bomb' Designed to Destroy Human Beings While Leaving Real Estate Intact", "10 = Disastrous Vacillation Humiliating NATO Allies Who Went Out on a Limb to Accept the Most Effective Tactical Deterrent Against Soviet Armor", 2, 9, 4, 1, 9, 1);

add(1978, "1978_cleveland_municipal_debt_default", "Cleveland, Ohio Becomes First Major American City to Default on Debt Since Depression", "News", "1978 (Cleveland Municipal Default)", "Economy & Taxation", 2,
  "Cleveland Mayor Dennis Kucinich refusing to sell the city-owned electric utility (Muny Light) to private utility CEI; local banks declare city in default on $14M in short-term notes.",
  "1 = Heroic Defense of Public Power Against Corrupt Private Utility Monopolies and Wall Street Bank Extortion", "10 = Gross Fiscal Mismanagement and Reckless Left-Wing Populism Destroying Municipal Credit and Driving Jobs from the City", 2, 8, 8, 1, 8, 1);

add(1978, "1978_tellico_dam_snail_darter_supreme_court", "TVA v. Hill Supreme Court Ruling Halting Tellico Dam for Snail Darter", "News", "1978 (Snail Darter Endangered Species Ruling)", "Energy & Climate", 1,
  "Supreme Court ruling 6-3 that the Endangered Species Act explicitly prioritizes endangered species preservation, halting the nearly completed $100M Tellico Dam to protect a 3-inch fish.",
  "1 = Landmark Affirmation of Ecological Sanctity: Species Extinction Is Irreversible and Must Not Yield to Pork-Barrel Dams", "10 = Utterly Absurd Bureaucratic Paralyzation Sacrificing a $100 Million Public Project and Clean Hydroelectricity for a Tiny Minnow", 2, 9, 9, 1, 9, 1);

add(1978, "1978_god_squad_endangered_species_amendments", "Endangered Species Act Amendments of 1978 & Creation of 'God Squad'", "News", "1978 (ESA Amendments / God Squad)", "Energy & Climate", 2,
  "Congress amending the ESA to create Cabinet-level Endangered Species Committee ('God Squad') empowered to grant exemptions to the Act for major economic projects.",
  "1 = Dangerous Pragmatic Compromise Creating Loopholes for Politically Connected Developers to Exterminate Vulnerable Wildlife", "10 = Indispensable Common-Sense Safety Valve Preventing Fanatical Environmental Lawsuits from Paralyzing Critical National Infrastructure", 2, 8, 8, 1, 8, 1);

add(1978, "1978_alaska_monuments_proclamations_carter", "President Carter's Antiquities Act Proclamations Designating 56M Acres of Alaskan Monuments", "News", "1978 (Carter Alaska Monuments)", "Energy & Climate", 1,
  "Carter unilaterally designating 56 million acres across Alaska as national monuments to prevent mining and logging after Congress stalemated on the Alaska Lands Bill.",
  "1 = The Greatest Conservation Act in American History Saving Vast Unspoiled Wilderness and Wildlife from Exploitation", "10 = Imperial Presidential Executive Tyranny Trampling Alaska's Sovereign Statehood and Mineral Energy Independence", 2, 9, 9, 1, 10, 1);

add(1978, "1978_community_reinvestment_act_cra_regulations", "Federal Regulators Promulgate Joint Community Reinvestment Act (CRA) Rules", "News", "1977-1978 (CRA Implementation)", "Economy & Taxation", 2,
  "Federal Reserve and FDIC issuing regulations requiring banks to document lending in low- and moderate-income neighborhoods to combat racist redlining.",
  "1 = Indispensable Weapon Forcing Commercial Banks to Reinvest in Disinvested Inner-City Communities and Minority Neighborhoods", "10 = Coercive Credit Allocation and Quota Harassment Forcing Private Banks to Make Subprime, High-Risk Community Loans", 2, 8, 8, 1, 9, 1);

add(1978, "1978_electronic_fund_transfer_act_efta", "Enactment of the Electronic Fund Transfer Act of 1978 (EFTA)", "News", "1978 (EFTA Consumer Protections)", "Technology & Infrastructure", 2,
  "Establishing consumer liability caps ($50) and error-resolution procedures for stolen ATM cards and electronic banking transactions.",
  "1 = Essential Consumer Protection Building Public Confidence in the Rapidly Growing Automated Teller Machine (ATM) Revolution", "10 = Sound Technical Framework Protecting Everyday Depositors Free from Heavy Bureaucratic Financial Micro-Management", 2, 7, 7, 1, 7, 1);

add(1978, "1978_surface_mining_control_reclamation_act_enforcement", "Interior Dept Enforces Surface Mining Control and Reclamation Act (SMCRA)", "News", "1977-1978 (SMCRA Strip Mining Enforcement)", "Energy & Climate", 2,
  "Office of Surface Mining issuing strict regulations requiring strip-mining coal companies to restore land to approximate original contours and replace topsoil.",
  "1 = Halt the Devastating Industrial Destruction of Appalachian Mountainsides and Toxic Acid Mine Drainage in Rivers", "10 = Overzealous Federal Regulations That Paralyze Surface Coal Mining and Drastically Drive Up American Electricity Costs", 2, 8, 8, 1, 8, 1);

add(1978, "1978_department_of_energy_first_year_operations", "Department of Energy (DOE) Begins First Full Year of Cabinet Operations", "News", "1977-1978 (Department of Energy Creation)", "Energy & Climate", 1,
  "Consolidating 50 agencies and 20,000 employees under Energy Secretary James Schlesinger with a $10 billion budget to coordinate national energy policy.",
  "1 = Vital Strategic Entity Unifying America's Fragmented Energy Transition, Research, and Emergency Stockpiles", "10 = Massive Multi-Billion Dollar Monument to Bureaucratic Folly That Produces Not a Single Drop of Oil or Kwh of Electricity", 2, 8, 9, 1, 9, 1);

add(1978, "1978_american_agriculture_movement_tractorcade", "American Agriculture Movement (AAM) Tractorcade Protest in Washington", "News", "1978 (AAM Tractorcade Protests)", "Agriculture & Food", 2,
  "Thousands of angry family farmers driving tractors into Washington D.C., snarling traffic around Capitol Hill demanding 100% parity prices for agricultural crops.",
  "1 = Support Hardworking Family Farmers Facing Ruinous Farm Foreclosures While Monopolistic Grain Cartels Reap Billions", "10 = Outrageous Disruption of the Nation's Capital Demanding Government Price Guarantees That Fuel Massive Consumer Food Inflation", 2, 7, 9, 1, 8, 1);

add(1978, "1978_lead_based_paint_total_retail_ban_cpsc", "CPSC Enforces Complete Ban on Consumer Lead Paint in Residential Housing", "News", "1977-1978 (Lead Paint Ban Effective)", "Healthcare", 2,
  "Consumer Product Safety Commission enforcing nationwide ban on residential paints containing lead above 0.06%, ending century of toxic lead paint sales.",
  "1 = Historic Public Health Milestone Safeguarding Generations of Unborn and Young Children from Irreversible Lead Poisoning", "10 = Long-Overdue Scientific Regulation Phasing Out a Proven Poison from Consumer Household Products", 2, 7, 6, 1, 7, 1);

add(1978, "1978_dc_voting_rights_constitutional_amendment", "Congress Approves DC Voting Rights Constitutional Amendment (Sent to States)", "News", "1978 (DC Voting Rights Amendment)", "Governance & Judiciary", 2,
  "Congress passing proposed constitutional amendment by two-thirds vote to treat the District of Columbia as a state for representation in House and Senate.",
  "1 = End Disgraceful Taxation Without Representation for 700,000 Predominantly Black American Citizens in the Nation's Capital", "10 = Unconstitutional Ploy to Fabricate Two Guaranteed Liberal Democratic Senate Seats from a Single Municipality", 2, 9, 4, 1, 9, 1);

add(1978, "1978_financial_institutions_reg_q_interest_rate_caps", "Debate over Regulation Q Caps and the Rise of Money Market Mutual Funds", "News", "1978 (Reg Q vs Money Market Accounts)", "Economy & Taxation", 2,
  "Double-digit inflation prompting depositors to flee low-interest bank accounts (capped at 5.25% by Reg Q) for new high-yielding Money Market Mutual Funds.",
  "1 = Protect Community Savings & Loan Mortgage Lending While Permitting Fair Interest Rates for Everyday Savers", "10 = Abolish Obsolete Depression-Era Reg Q Caps and Allow Free-Market Competition for Consumer Savings Deposits", 2, 8, 10, 1, 8, 1);

add(1978, "1978_iranian_revolution_first_oil_shockwaves", "Civil Unrest in Iran Paralyzes Oil Fields & Sparks Fears of Second Energy Crisis", "News", "1978 (Iranian Unrest Energy Shockwaves)", "Energy & Climate", 1,
  "General strikes and oil worker walkouts against the Shah of Iran slashing crude exports by 5 million barrels/day, foreshadowing the 1979 oil shock.",
  "1 = Prepare National Emergency Allocation Plans, Expand Mass Transit, and Accelerate Synthetic Fuels Development", "10 = Stand Decisively with the Pro-Western Shah Against Islamic Fanatics / Decontrol All Domestic Energy Prices Immediately", 2, 9, 7, 1, 9, 1);

add(1978, "1978_national_consumer_cooperative_bank_act", "Enactment of the National Consumer Cooperative Bank Act of 1978", "News", "1978 (Consumer Coop Bank Enacted)", "Economy & Taxation", 3,
  "Chartering a federally capitalized bank to provide specialized loans and technical assistance to consumer cooperatives and community food co-ops.",
  "1 = Empower Everyday Citizens to Organize Democratic, Non-Profit Consumer Cooperatives Beyond Corporate Monopolies", "10 = Wasteful Government-Capitalized Bank Competing Unfairly Against Sound Commercial Private Lending Institutions", 2, 8, 9, 1, 9, 1);

add(1978, "1978_penn_central_landmark_preservation_ruling", "Penn Central Transportation Co. v. New York City (Historic Preservation)", "News", "1978 (Penn Central Takings Ruling)", "Governance & Judiciary", 2,
  "Supreme Court ruling 6-3 that New York City's Landmark Preservation Law barring construction of a skyscraper above Grand Central Terminal did not constitute a Fifth Amendment taking.",
  "1 = Inspiring Victory Affirming Cities Have the Democratic Authority to Protect Architectural and Historic Heritage from Greed", "10 = Dangerous Evisceration of Private Property Rights Stripping Owners of Economic Value Without Constitutional Just Compensation", 2, 9, 9, 1, 9, 1);

add(1978, "1978_us_trade_deficit_reaches_historic_high", "U.S. Annual Merchandise Trade Deficit Hits All-Time High of $34 Billion", "News", "1978 (Trade Deficit Crisis)", "Economy & Taxation", 2,
  "Massive imports of foreign crude oil and Japanese consumer electronics driving America's trade deficit to record levels and weakening the global dollar.",
  "1 = Enact Tough Fair Trade Reciprocity and Mandatory Energy Reduction Measures to Halt Dollar Depreciation", "10 = The Deficit Reflects American Consumer Prosperity and Choice / Floating Exchange Rates Naturally Balance Trade Over Time", 2, 8, 9, 1, 8, 1);

add(1978, "1978_minimum_wage_step_two_sixty_five", "Federal Minimum Wage Step Increase to $2.65 per Hour", "News", "1978 (Minimum Wage Step)", "Labor & Welfare", 2,
  "Federal minimum wage rising to $2.65/hour as part of multi-year stair-step adjustment signed by President Carter.",
  "1 = Minimum Human Decency Assuring That Full-Time Work Protects Families from Falling into Extreme Poverty", "10 = Inflationary Mandate Driving Up Production Costs and Disproportionately Pricing Low-Skilled Urban Youths Out of Jobs", 2, 8, 9, 1, 9, 1);

add(1978, "1978_solar_photovoltaic_energy_rd_act", "Solar Photovoltaic Energy Research, Development, and Demonstration Act of 1978", "News", "1978 (Solar Photovoltaic Enactment)", "Energy & Climate", 2,
  "Authorizing $1.5 billion over 10 years to stimulate federal procurement and drive down the manufacturing cost of solar photovoltaic solar cells.",
  "1 = Forward-Thinking National Investment Laying the Technological Groundwork for Plentiful, Pollution-Free Solar Energy", "10 = Premature Government Subsidization of Uncompetitive Solar Collectors That Cannot Match Baseload Coal and Nuclear", 2, 7, 8, 1, 8, 1);

add(1978, "1978_us_soviet_salt_ii_treaty_negotiations", "Stalemate in U.S.-Soviet Strategic Arms Limitation (SALT II) Negotiations", "News", "1977-1978 (SALT II Drafting Obstacles)", "Foreign Policy & Defense", 1,
  "Negotiations bogged down over Soviet Backfire bombers and American cruise missiles amidst growing congressional alarm over Soviet adventurism in Africa.",
  "1 = Overcome Technical Disputes to Codify Parity and Cap Strategic Nuclear Delivery Vehicles Before an Arms Race Explodes", "10 = SALT II Is a Fatal Trap Granting Strategic Advantages to Moscow While Restricting Crucial American Cruise Missiles", 2, 9, 4, 1, 9, 1);

add(1978, "1978_fbi_unabomber_first_attacks", "First Mail Bombing Attacks by the Unknown Terrorist ('Unabomber')", "News", "1978 (Unabomber Emergence)", "Governance & Judiciary", 3,
  "First package bomb exploding at Northwestern University, injuring a campus police officer, beginning a mysterious 17-year domestic terror campaign.",
  "1 = Full Mobilization of Federal Law Enforcement and Postal Inspectors to Track and Apprehend the Madman", "10 = Deploy Every Law Enforcement Resource to Hunt Down and Bring the Murderous Terrorist to Swift Justice", 2, 7, 5, 1, 7, 1);

add(1978, "1978_child_abuse_prevention_act_extension", "Child Abuse Prevention and Treatment Act Amendments of 1978", "News", "1978 (Child Abuse Prevention Expansion)", "Healthcare", 2,
  "Expanding federal grants to states to establish comprehensive child abuse reporting hotlines and protective foster care monitoring systems.",
  "1 = Urgent Moral Protection Rescuing Battered and Sexually Abused Children from Violence and Neglect in Broken Homes", "10 = Support Child Safety While Guarding Against Invasive Bureaucratic Interference in Normal Parental Disciplinary Rights", 2, 7, 5, 1, 8, 1);

add(1978, "1978_midterm_elections_conservative_tide", "1978 Midterm Elections: Conservative GOP Pickups (3 Senate & 15 House Seats)", "News", "1978 (Midterm Conservative Gains)", "Governance & Judiciary", 1,
  "Republicans defeating liberal stalwarts (including Dick Clark in Iowa) by mobilizing single-issue pro-life, anti-tax, and pro-gun voters, signaling conservative tide.",
  "1 = Temporary Midterm Setback Driven by Distortions; Democratic Majorities Will Champion Progressive Economic Priorities", "10 = Reinvigorated New Right Coalition Ushering in the Resurgence of Traditional Morality, Tax Cuts, and Military Strength", 2, 9, 7, 1, 10, 1);

add(1978, "1978_usda_human_nutrition_guidelines_initiative", "Senate McGovern Committee 'Dietary Goals for the United States' Controversy", "News", "1977-1978 (Dietary Goals Nutritional Debate)", "Agriculture & Food", 2,
  "Senate committee recommending Americans reduce consumption of red meat, saturated fats, and sugar, igniting ferocious fury from the cattle and dairy industries.",
  "1 = Essential Preventive Nutrition Educating Americans on Heart Disease, Cholesterol, and Chronic Illness Prevention", "10 = Outrageous Government Dietary Paternalism Telling Free American Citizens What They Are Permitted to Eat for Dinner", 2, 7, 8, 1, 8, 1);
`;

content += additions;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Bracket C (1978) complete.');
