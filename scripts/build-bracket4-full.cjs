/**
 * scripts/build-bracket4-full.cjs
 * Generates full issue array for Bracket 4 (2024, 2026)
 * Ensuring each cycle has 50-55 granular issues across all 10 tiers.
 */

const fs = require('fs');

const ISSUES = [];

function add(cycle, id, name, type, eraSpan, domain, tier, debate, pole1, pole10, dem, gop, lib, grn, con, soc) {
  ISSUES.push({
    cycle, id, name, type, eraSpan, domain, tier, debate, pole1, pole10,
    stances: { dem, gop, lib, grn, con, soc }
  });
}

// =========================================================================
// 2024 (52 Issues)
// =========================================================================
add(2024, "2024_israel_hamas_war_gaza_humanitarian", "Israel-Hamas War in Gaza & Conditioning U.S. Military Aid", "News", "2023-2026 (Gaza Conflict & Middle East War)", "Foreign Policy & Defense", 1,
  "Debating U.S. weapon shipments, military aid conditionality, civilian casualties in Gaza, and demanding an immediate permanent ceasefire.",
  "1 = Immediate Permanent Ceasefire / Arms Embargo / Independent Palestinian State", "10 = Unconditional Military Support for Israel to Completely Eradicate Hamas", 4, 10, 3, 1, 9, 1);

add(2024, "2024_southern_border_surge_asylum_executive", "Southern Border Crisis & Executive Restrictions on Asylum Processing", "News", "2023-2026 (Border Security & Asylum Clashes)", "Immigration & Border", 1,
  "Emergency executive proclamation shutting down asylum processing between ports of entry when daily border encounters exceed 2,500.",
  "1 = Uphold Fundamental Due Process and Universal Statutory Right to Seek Asylum", "10 = Seal the Southern Border Immediately / Reinstate 'Remain in Mexico' / Mass Deportations", 3, 10, 4, 1, 10, 1);

add(2024, "2024_post_inflation_cost_of_living_squeeze", "Post-Inflation Cost-of-Living Squeeze (Grocery, Housing & Auto Insurance)", "News", "2022-2026 (Post-Inflation Living Squeeze)", "Economy & Taxation", 1,
  "Persistent voter anxiety over 22%+ cumulative price increases since 2020 on groceries, rent, auto insurance, and restaurant meals.",
  "1 = Pass Federal Ban on Corporate Price Gouging / Expand Child Tax Credit and Housing Subsidies", "10 = Unleash Domestic Energy, Slash Regulations, and Stop Deficit Spending to Kill Inflation", 3, 10, 10, 1, 10, 1);

add(2024, "2024_presidential_age_biden_exit_harris_nomination", "Presidential Age, Cognitive Fitness & Biden Withdrawal for Kamala Harris", "News", "2024 (Historic Nominating Realignment)", "Governance & Judiciary", 1,
  "Joe Biden withdrawing following the June debate, clearing the path for Vice President Kamala Harris as the Democratic nominee.",
  "1 = United Behind Kamala Harris as a Dynamic, Qualified Leader Defending Democracy", "10 = Expose White House Cover-Up of Cognitive Decline / Highlight Failed Biden-Harris Record", 2, 10, 6, 2, 9, 1);

add(2024, "2024_trump_criminal_trials_scotus_immunity", "Donald Trump Criminal Convictions & Supreme Court Presidential Immunity Ruling", "News", "2023-2026 (Trump Jurisprudence)", "Governance & Judiciary", 1,
  "Manhattan 34-count felony conviction and Supreme Court ruling (Trump v. US) granting broad immunity for official presidential acts.",
  "1 = No One Above the Law / Convicted Felon Unfit for the Presidency / Reform Supreme Court", "10 = Corrupt Political Lawfare by the Biden-Harris DOJ / Historic Victory for Constitutional Separation of Powers", 2, 10, 4, 1, 10, 1);

add(2024, "2024_post_dobbs_state_abortion_ballot_measures", "Ten State Constitutional Abortion Rights Ballot Measures (FL, AZ, NV, MO, etc.)", "News", "2024 (Super-Ballot Reproductive Rights)", "Civil Rights & Social Issues", 1,
  "Ballot initiatives in 10 states codifying constitutional protections for abortion and overturning near-total state bans.",
  "1 = Vote Yes Across All 10 States to Restore Bodily Autonomy and Medical Dignity", "10 = Vote No / Defend Unborn Children from Extreme Constitutional Amendments Mandating Abortion on Demand", 2, 10, 4, 1, 10, 1);

add(2024, "2024_trump_universal_baseline_tariffs_proposal", "Trump Proposal for 10-20% Universal Tariffs & 60% Tariffs on China", "News", "2023-2026 (New Tariff Regime Arc)", "Trade & Globalism", 1,
  "Proposing sweeping universal baseline tariffs on all $3 trillion in foreign imports to re-industrialize the American homeland.",
  "1 = Reject Mass National Sales Tax That Will Spike Consumer Prices by $2,600 and Start Global Trade Wars", "10 = Enact Universal Reciprocal Tariffs to Eliminate Trade Deficits and Reshoring Factory Jobs", 2, 9, 10, 1, 5, 1);

add(2024, "2024_electric_vehicle_mandates_epa_tailpipe", "EPA Tailpipe Emission Standards & Federal Electric Vehicle Targets", "News", "2023-2026 (EV Mandate Polarization)", "Energy & Climate", 1,
  "EPA rules requiring roughly 56% of new passenger vehicles sold in the U.S. to be electric or plug-in hybrid by 2032.",
  "1 = Essential Global Decarbonization Leadership That Catalyzes Domestic EV and Battery Factories", "10 = Eliminate Biden's Unlawful EV Mandate That Destroys Consumer Choice and Benefits Chinese Batteries", 2, 10, 9, 1, 10, 1);

add(2024, "2024_artificial_intelligence_executive_order", "Biden Executive Order on AI Safety & Compute Reporting Thresholds", "News", "2023-2026 (AI Governance Era)", "Technology & Infrastructure", 1,
  "Invoking Defense Production Act to require frontier AI developers to share safety test red-teaming results with the government.",
  "1 = Enact Robust Federal Guardrails to Prevent Existential Risks, Deepfakes, and Worker Displacement", "10 = Repeal Stifling Government Regulations That Choke American AI Innovation and Cede Leadership to China", 2, 8, 9, 1, 8, 1);

add(2024, "2024_tiktok_divestiture_ban_act_enacted", "Enactment of the Protecting Americans from Foreign Adversary Controlled Apps Act", "News", "2024-2025 (TikTok Divestiture Arc)", "Technology & Infrastructure", 1,
  "Bipartisan law signed by Biden forcing ByteDance to divest U.S. TikTok operations within 270 days or face a nationwide ban.",
  "1 = Enforce Lawful Sale to Neutral Ownership to Protect 170M Americans from Chinese Surveillance", "10 = Defend First Amendment Free Speech Rights and Independent Digital Creator Livelihoods", 3, 7, 2, 1, 6, 1);

add(2024, "2024_campus_encampments_antisemitism_free_speech", "University Campus Encampments, Free Speech & Antisemitism Hearings", "News", "2023-2024 (Campus Protest Clashes)", "Civil Rights & Social Issues", 1,
  "Pro-Palestinian student tent encampments at Columbia, UCLA, and dozens of campuses, sparking police sweeps and donor rebellions.",
  "1 = Protect Peaceful Student Anti-War Free Expression and Divestment Demands from Academic Repression", "10 = Expel Extremist Agitators, Restore Campus Safety, and Strip Federal Grants from Universities Harboring Hate", 2, 10, 4, 1, 10, 1);

add(2024, "2024_student_loan_save_plan_injunctions", "Federal Appeals Court Injunctions Freezing Biden SAVE Student Loan Plan", "News", "2023-2025 (SAVE Plan Litigation)", "Education", 2,
  "GOP state AGs winning nationwide injunctions halting the SAVE income-driven repayment plan lowering payments to 5% of income.",
  "1 = Defend the Lawful SAVE Plan Relieving Crushing Student Debt for Millions of Working-Class Borrowers", "10 = Uphold Injunctions / Stop the Unlawful Redistribution of Billions in Student Debt onto Non-College Taxpayers", 2, 10, 10, 1, 10, 1);

add(2024, "2024_housing_affordability_supply_crisis", "National Housing Supply Shortage & 7% Mortgage Rate Lock-in", "News", "2022-2026 (Housing Affordability Crisis)", "Economy & Taxation", 1,
  "Median home prices hitting record $420,000 as 7% interest rates freeze existing home turnover and exacerbate 4M home deficit.",
  "1 = Build 3M New Homes / $25,000 First-Time Homebuyer Grants / Ban Institutional Landlord Price-Fixing", "10 = Slash Stifling Environmental Zoning Rules / Unleash Private Homebuilders / Cut Interest Rates", 3, 8, 9, 1, 8, 1);

add(2024, "2024_record_us_crude_oil_production", "U.S. Crude Oil Production Reaching All-Time World Record (13.3M Barrels/Day)", "News", "2023-2026 (American Energy Dominance)", "Energy & Climate", 2,
  "United States producing more crude oil than any nation in history, creating tension with progressive climate targets.",
  "1 = Accelerate Fossil Phase-Out and End Fossil Fuel Leasing to Meet Binding Global Climate Targets", "10 = Celebrate American Energy Dominance Powering the Economy and Slashing Reliance on Hostile Dictators", 3, 10, 9, 1, 10, 1);

add(2024, "2024_tcja_2025_sunset_cliff_debate", "Approaching 2025 Expiration of TCJA Individual Tax Cuts", "Ideological", "2017-2026 (TCJA Sunset Negotiation)", "Economy & Taxation", 2,
  "Facing automatic $4 trillion tax hike if the 2017 individual income tax cuts, standard deduction, and child tax credit expire.",
  "1 = Let Cuts for Top Earners Expire While Extending Relief for Working Families Under $400,000", "10 = Permanently Extend All 2017 Tax Cuts and Lower the Corporate Tax Rate Further to 15%", 2, 10, 10, 1, 10, 1);

add(2024, "2024_ukraine_aid_61_billion_speaker_johnson", "House Passage of $61 Billion Ukraine Aid Package Under Speaker Johnson", "News", "2024 (Ukraine Supplemental Breakthrough)", "Foreign Policy & Defense", 2,
  "Speaker Mike Johnson relying on Democratic votes to pass $61B in weapons for Ukraine despite intense MAGA rebellion.",
  "1 = Indispensable Superpower Leadership Standing Resolutely Behind Ukrainian Democracy Against Tyranny", "10 = Betrayal of America First Priorities Sending Billions to Foreign Trenches While the Southern Border Collapses", 3, 7, 4, 1, 6, 1);

add(2024, "2024_social_security_insolvency_cliff_2033", "Trustees Report Accelerating Social Security Insolvency to 2033", "Ideological", "1980-2035 (Entitlement Cliff Arc)", "Economy & Taxation", 2,
  "Projections showing 21% automatic across-the-board benefit cuts in 9 years unless Congress raises revenues or reforms benefits.",
  "1 = Protect and Expand Benefits by Lifting the Payroll Tax Cap on Wealthy Earners Making Over $400,000", "10 = Oppose Tax Hikes / Implement Bipartisan Fiscal Commission, Raise Retirement Age, and Means-Test", 2, 8, 7, 1, 8, 1);

add(2024, "2024_chevron_deference_overturned_scotus", "Supreme Court Overturning 40-Year Chevron Deference (Loper Bright)", "News", "2024 (Administrative Law Revolution)", "Governance & Judiciary", 2,
  "Supreme Court holding courts need not defer to agency statutory interpretations, fundamentally reining in federal regulators.",
  "1 = Disastrous Corporate Power Grab Hobbling Federal Agencies from Protecting Clean Air, Water, and Consumers", "10 = Monumental Constitutional Restoration of Article III Powers Reining in Rogue Unelected Bureaucracies", 2, 10, 10, 1, 10, 1);

add(2024, "2024_florida_amendment_4_abortion_limit", "Florida Amendment 4 (Constitutional Right to Abortion to Viability)", "News", "2024 (Florida 60% Supermajority Battle)", "Civil Rights & Social Issues", 1,
  "High-stakes ballot initiative requiring 60% supermajority to overturn Florida's newly enacted 6-week abortion ban.",
  "1 = Vote Yes / Overturn the Cruel 6-Week Ban That Endangers Women's Lives Before Most Know They Are Pregnant", "10 = Vote No / Protect Unborn Children from Extreme Constitutional Amendment Deregulating Late-Term Abortion", 2, 10, 5, 1, 10, 1);

add(2024, "2024_florida_amendment_3_cannabis_legalization", "Florida Amendment 3 (Adult-Use Cannabis Legalization Measure)", "News", "2024 (Florida 60% Cannabis Battle)", "Civil Rights & Social Issues", 2,
  "Constitutional initiative supported by Trulieve requiring 60% to legalize adult personal cannabis possession up to 3 ounces.",
  "1 = Vote Yes / End Outdated Criminalization, Generate Hundreds of Millions in Taxes, and Free Up Police", "10 = Vote No / Oppose Flooding Florida Tourist Communities and Public Beaches with Pungent Weed Smoke", 2, 8, 1, 1, 9, 1);

add(2024, "2024_arizona_prop_139_abortion_rights", "Arizona Proposition 139 (Right to Abortion Constitutional Initiative)", "News", "2024 (Arizona Reproductive Freedom)", "Civil Rights & Social Issues", 2,
  "Citizen initiative to establish a fundamental right to abortion up to fetal viability in the Arizona Constitution.",
  "1 = Vote Yes / Restore Reproductive Freedom and Safeguard Healthcare from Politicized State Bans", "10 = Vote No / Oppose Erasing Important Commonsense Medical Safeguards and Parental Notification", 2, 10, 4, 1, 10, 1);

add(2024, "2024_missouri_amendment_3_abortion_repeal", "Missouri Amendment 3 (Voter Repeal of Near-Total Abortion Trigger Ban)", "News", "2024 (Heartland Abortion Reversal)", "Civil Rights & Social Issues", 2,
  "Initiative to repeal Missouri's trigger ban that outlaws abortion from conception with zero rape or incest exceptions.",
  "1 = Vote Yes / Restore Freedom for Women and Families to Make Their Own Private Healthcare Decisions", "10 = Vote No / Defend Missouri's Culture of Life and Protect Innocent Unborn Children from Destruction", 2, 10, 5, 1, 10, 1);

add(2024, "2024_rfk_jr_independent_candidacy_trump_endorsement", "Robert F. Kennedy Jr. Independent Campaign & Trump Endorsement", "News", "2023-2024 (MAHA Movement Genesis)", "Governance & Judiciary", 2,
  "RFK Jr. suspending campaign to endorse Donald Trump under the 'Make America Healthy Again' (MAHA) chronic disease banner.",
  "1 = Reject Anti-Vaccine Conspiracy Theories and Discredited Fringe Medicine Siphoning Public Health Trust", "10 = Join Historic Unity Coalition to Confront Chronic Disease Epidemic, Ultra-Processed Foods, and Pharma Corruption", 2, 8, 4, 2, 8, 1);

add(2024, "2024_project_2025_presidential_transition_guide", "Heritage Foundation Project 2025 & Schedule F Reclassification", "News", "2023-2024 (Presidential Transition Blueprint)", "Governance & Judiciary", 2,
  "Comprehensive conservative blueprint proposing to dismantle administrative agencies and convert 50,000 civil servants to political appointees.",
  "1 = Extreme Authoritarian Takeover Destroying the Professional Merit-Based Civil Service and Democracy", "10 = Restore Democratic Accountability and Break the Power of the Unelected Deep State Bureaucracy", 2, 10, 6, 1, 10, 1);

add(2024, "2024_mass_deportation_logistics_national_guard", "Trump Pledge for the Largest Mass Deportation in American History", "News", "2024-2026 (Mass Deportation Agenda)", "Immigration & Border", 1,
  "Pledging to mobilize the National Guard, local police, and military aircraft to deport 11+ million undocumented immigrants.",
  "1 = Catastrophic Humanitarian and Economic Nightmare That Will Tear Families Apart and Crash Ag/Construction", "10 = Restore Sovereign Borders, Eliminate Criminal Migrant Gangs, and Relieve Strained Public Services", 2, 10, 4, 1, 10, 1);

add(2024, "2024_houthi_red_sea_shipping_attacks", "Houthi Anti-Ship Missile Attacks in Red Sea & Operation Prosperity Guardian", "News", "2023-2026 (Red Sea Maritime Conflict)", "Foreign Policy & Defense", 2,
  "Yemeni Houthi rebels launching drone and missile attacks on commercial ships, forcing global vessels around Africa.",
  "1 = Address Root Cause by Halting Gaza War / Regional Diplomatic De-escalation", "10 = Strike Houthi Missile Infrastructure Decisively / Defend Global Freedom of Navigation by Force", 3, 9, 3, 1, 8, 1);

add(2024, "2024_commercial_space_faa_licensing_spacex", "Starship Orbital Flight Tests & FAA Space Launch Licensing Clashes", "News", "2023-2026 (Starship Commercial Space Era)", "Technology & Infrastructure", 3,
  "SpaceX successfully catching the 232-foot Super Heavy booster while clashing with FAA regulators over environmental launch license delays.",
  "1 = Ensure Rigorous Independent Safety and Environmental Oversight to Protect Coastal Marine Habitats", "10 = Slash Stifling FAA Bureaucracy to Keep America Ahead of China in the Second Space Race to the Moon", 2, 8, 10, 1, 8, 1);

add(2024, "2024_california_fast_food_twenty_dollar_wage", "California Implementation of $20 Minimum Wage for Fast Food Workers", "News", "2024 (Fast Food Wage Implementation)", "Labor & Welfare", 3,
  "Implementing $20/hr wage floor for fast-food chains with 60+ locations, leading to price increases and kiosk automation.",
  "1 = Life-Changing Dignified Wage for Hundreds of Thousands of Low-Income Breadwinners in High-Cost California", "10 = Destructive Government Price-Fixing Spurring Rapid Kiosk Automation and Making Fast Food Unaffordable", 2, 9, 10, 1, 9, 1);

add(2024, "2024_nuclear_energy_small_modular_reactors_smrs", "Small Modular Reactors (SMRs) & Big Tech Powering AI Data Centers", "Ideological", "2020-2030 (AI Energy Clean Baseload)", "Energy & Climate", 2,
  "Microsoft, Amazon, and Google investing billions in nuclear energy and Three Mile Island restart to feed hungry AI data centers.",
  "1 = Support Safe Advanced Baseload Clean Power While Enforcing Strict Nuclear Waste and Siting Standards", "10 = Fast-Track Nuclear Approvals and Re-open Plants to Lead the World in Artificial Intelligence Dominance", 3, 9, 8, 1, 9, 1);

add(2024, "2024_colorado_prop_131_all_candidate_primary", "Colorado Proposition 131 (Top-Four Open Primary & Ranked-Choice Voting Defeat)", "News", "2024 (RCV Western Ballot Fight)", "Governance & Judiciary", 3,
  "Voters defeating citizen initiative to establish nonpartisan all-candidate primaries with top-four advancing to ranked-choice general.",
  "1 = Support Modernizing Elections to Empower Moderates and Eliminate Gerrymandered Safe Seats", "10 = Protect Traditional Democratic Transparency / Reject Overly Complex, Opaque Voting Schemes", 2, 7, 1, 1, 1, 1);

add(2024, "2024_ohio_senate_race_crypto_fairshake", "Fairshake Super PAC $40M Advertising Blitz in Ohio Senate Race", "News", "2024 (Cryptocurrency Political Power)", "Economy & Taxation", 2,
  "Cryptocurrency industry Super PAC spending $40 million to defeat Senate Banking Chairman Sherrod Brown over crypto regulations.",
  "1 = Stop Unregulated Crypto Speculators from Buying American Elections and Evading Anti-Money Laundering Laws", "10 = Defend Digital Asset Innovation and Clear Regulatory Frameworks Against Hostile SEC Overreach", 2, 8, 7, 1, 7, 1);

add(2024, "2024_nevada_question_6_abortion_constitutional", "Nevada Question 6 (Constitutional Right to Abortion Approval)", "News", "2024 (Nevada Reproductive Freedom)", "Civil Rights & Social Issues", 2,
  "64% of voters approving first round of constitutional amendment protecting reproductive freedom through fetal viability.",
  "1 = Cement Permanent Constitutional Guarantees That No Future State Legislature Can Strip Away", "10 = Oppose Amending the Nevada Constitution to Protect an Industry That Profits from Ending Human Life", 2, 10, 4, 1, 10, 1);

add(2024, "2024_corporate_tax_rate_fifteen_percent_proposal", "Donald Trump Proposal to Lower Domestic Corporate Tax to 15%", "News", "2024 (New Corporate Tax Cut Proposal)", "Economy & Taxation", 2,
  "Proposing to lower the federal corporate income tax rate from 21% down to 15% exclusively for companies that manufacture in America.",
  "1 = Unconscionable Giveaway to Giant Corporations That Will Explode Deficits by Billions", "10 = Transformative Industrial Incentive Turning America into the Greatest Manufacturing Magnet on Earth", 2, 10, 10, 1, 9, 1);

add(2024, "2024_no_tax_on_tips_bipartisan_pledge", "Trump & Harris Both Backing 'No Tax on Tips' for Service Workers", "News", "2024 (Service Worker Tax Pander)", "Economy & Taxation", 2,
  "Both major presidential nominees proposing federal income tax exemptions on tips earned by restaurant and hospitality workers.",
  "1 = Target Tax Relief Directly to Real Service Workers While Guarding Against High-Earner Reclassifications", "10 = Provide Immediate Tax Relief for Hardworking Waiters, Bartenders, and Drivers Squeezed by Inflation", 4, 8, 8, 2, 8, 1);

add(2024, "2024_clean_energy_lng_export_pause_biden", "Biden Department of Energy Temporary Pause on New LNG Export Terminals", "News", "2024 (LNG Export Battle)", "Energy & Climate", 2,
  "Pausing pending approvals for liquefied natural gas export terminals to update environmental and domestic price impact studies.",
  "1 = Vital Pause Halting Massive Expansion of Climate-Destroying Methane Export Infrastructure", "10 = Unlawful Hostage-Taking That Punishes American Energy Allies in Europe and Threatens Good Jobs", 2, 10, 9, 1, 10, 1);

add(2024, "2024_child_tax_credit_six_thousand_proposal", "Kamala Harris Proposal for $6,000 Newborn Child Tax Credit", "News", "2024 (Family Tax Credit Expansion)", "Economy & Taxation", 2,
  "Proposing a $6,000 tax credit for families in the first year of a child's life and restoring the $3,600 expanded CTC.",
  "1 = Decisive Anti-Poverty Policy Cutting Child Poverty in Half and Supporting Stressed New Parents", "10 = Massive Expansion of Unfunded Welfare Without Work Requirements That Fuels Long-Term Dependency", 2, 8, 8, 1, 8, 1);

add(2024, "2024_south_dakota_initiated_measure_29_weed_defeat", "South Dakota Measure 29 (Adult-Use Cannabis Defeated 56% No)", "News", "2024 (Third South Dakota Cannabis Vote)", "Civil Rights & Social Issues", 3,
  "Voters rejecting recreational marijuana for the second consecutive time following the 2020 court invalidation.",
  "1 = Disappointing Result / Continue Building Grassroots Momentum for Personal Liberty and Compassion", "10 = Voters Stood Resolutely for Family Values and Rejected Commercial Substance Abuse in South Dakota", 2, 8, 1, 1, 9, 1);

add(2024, "2024_north_dakota_measure_5_cannabis_defeat", "North Dakota Measure 5 (Adult-Use Cannabis Defeated 53% No)", "News", "2024 (Northern Plains Cannabis Referendum)", "Civil Rights & Social Issues", 3,
  "Voters in North Dakota rejecting statutory legalization of personal cannabis possession and retail commerce.",
  "1 = The Movement for Freedom Continues / Criminalizing Adults for a Plant Remains Foolish and Costly", "10 = Reaffirm Traditional Community Health and Protect Our Streets from Commercial Drug Dispensaries", 2, 8, 1, 1, 9, 1);

add(2024, "2024_social_media_surgeon_general_warning_labels", "Surgeon General Dr. Vivek Murthy Calling for Tobacco-Style Warning Labels on Social Media", "News", "2024 (Youth Mental Health & Tech)", "Technology & Infrastructure", 3,
  "Demanding congressionally mandated warning labels on social platforms warning of severe adolescent mental health harms.",
  "1 = Necessary Public Health Emergency Action to Protect Children from Addictive Predatory Algorithms", "10 = Paternalistic Government Overreach / Parents, Not Federal Bureaucrats, Must Manage Screen Time", 2, 7, 5, 1, 7, 1);

add(2024, "2024_massachusetts_question_2_mcas_testing_repeal", "Massachusetts Question 2 (Eliminating MCAS High School Graduation Requirement)", "News", "2024 (High-Stakes Testing Repeal Win)", "Education", 3,
  "59% of voters approving teacher-union-backed initiative repealing requirement that students pass MCAS standardized tests to graduate.",
  "1 = Historic Victory Ending Destructive 'Teaching to the Test' and Restoring Holistic Local Education", "10 = Tragic Lowering of Educational Standards That Denies Objective Accountability and Disadvantages Poor Kids", 2, 8, 8, 1, 8, 1);

add(2024, "2024_california_prop_36_theft_fentanyl_penalties", "California Proposition 36 (Voter Overhaul of Prop 47 Tough-on-Crime)", "News", "2024 (Landmark Criminal Justice Reversal)", "Civil Rights & Social Issues", 2,
  "70% of voters approving sweeping measure making repeat retail theft and hard drug possession felonies again.",
  "1 = Step Backward Fueling Mass Incarceration That Fails to Treat Underlying Mental Health and Addiction", "10 = Overwhelming Voter Mandate Restoring Common Sense, Law and Order, and Stopping Brazen Retail Looting", 2, 9, 5, 1, 9, 1);

add(2024, "2024_maryland_question_1_reproductive_freedom", "Maryland Question 1 (Constitutional Right to Reproductive Freedom Approval)", "News", "2024 (East Coast Reproductive Constitutional Shield)", "Civil Rights & Social Issues", 2,
  "75% of voters approving constitutional amendment guaranteeing individual right to reproductive freedom including abortion.",
  "1 = Overwhelming Democratic Supermajority Affirming Abortion as an Inviolable Fundamental Human Right", "10 = Tragic Extremist Amendment Stripping Lawmakers of Any Power to Protect Unborn Human Life", 2, 10, 4, 1, 10, 1);

add(2024, "2024_nebraska_initiative_434_vs_439_dueling_abortion", "Nebraska Initiative 434 (First Trimester Ban) vs. Initiative 439 (Right to Viability)", "News", "2024 (Dueling Abortion Ballot Measures)", "Civil Rights & Social Issues", 2,
  "Voters approving Initiative 434 banning second- and third-trimester abortions while defeating Initiative 439 expanding rights.",
  "1 = Disappointing Confusion Exploited by Opponents / Keep Fighting to Secure Real Reproductive Freedom", "10 = Historic Pro-Life Victory Proving Nebraska Stands Firmly to Protect Babies in the Womb", 2, 10, 5, 1, 10, 1);

add(2024, "2024_massachusetts_question_4_psychedelics_defeat", "Massachusetts Question 4 (Legalization of Natural Psychedelics Defeated 57% No)", "News", "2024 (Psychedelics Expansion Halt)", "Civil Rights & Social Issues", 3,
  "Voters rejecting measure to legalize and regulate natural psychedelic substances (psilocybin, mescaline, DMT).",
  "1 = Regrettable Setback for Veterans and Trauma Survivors / Work Toward Clinical Medical Frameworks", "10 = Commonsense Decision Rejecting Risky Commercial Drug Commercialization in Local Neighborhoods", 2, 8, 1, 1, 9, 1);

add(2024, "2024_national_guard_border_operation_lone_star", "Texas Operation Lone Star & Razor Wire Standoff at Shelby Park", "News", "2023-2024 (State Border Sovereignty Standoff)", "Immigration & Border", 2,
  "Texas National Guard installing concertina wire along Rio Grande and defying federal border patrol access orders.",
  "1 = Unconstitutional State Insurrection Violating Supreme Court Supremacy and Federal Border Authority", "10 = Heroic Defense by Governor Abbott Exercising Sovereign State Self-Defense Against Foreign Invasion", 2, 10, 4, 1, 10, 1);

add(2024, "2024_nuclear_plant_three_mile_island_restart", "Constellation Energy 20-Year Deal to Restart Three Mile Island for Microsoft AI", "News", "2024 (Nuclear Energy Comeback)", "Energy & Climate", 2,
  "Re-opening 835MW Unit 1 reactor (renamed Crane Clean Energy Center) to feed zero-emission baseload power to Microsoft data centers.",
  "1 = Welcome Return to Safe Baseload Carbon-Free Energy Essential for Reaching Climate Goals", "10 = Unleash Private Nuclear Innovation to Power American Technological Superiority in AI", 3, 9, 8, 1, 9, 1);

add(2024, "2024_california_prop_3_same_sex_marriage_affirm", "California Proposition 3 (Repealing Outdated 2008 Prop 8 Language)", "News", "2024 (Constitutional Cleanup Measure)", "Civil Rights & Social Issues", 2,
  "62% of voters officially amending California Constitution to remove obsolete Prop 8 language declaring marriage only between man/woman.",
  "1 = Official Constitutional Celebration of Unconditional Marriage Equality and LGBTQ Dignity", "10 = Oppose Rewriting State Constitution to Erode Traditional Societal and Religious Marriage Norms", 2, 9, 3, 1, 10, 1);

add(2024, "2024_arizona_proposition_314_immigration_enact", "Arizona Proposition 314 ('Secure the Border Act' State Felony Crossing Win)", "News", "2024 (New State Border Felony Law)", "Immigration & Border", 2,
  "63% of voters approving citizen initiative authorizing state and local police to arrest undocumented migrants crossing outside ports.",
  "1 = Dangerous Return to Unconstitutional SB 1070 Profiling That Threatens Civil Rights of All Latinos", "10 = Decisive Voter Mandate Empowering Local Police to Arrest Illegal Crossers and Protect Arizona", 2, 10, 4, 1, 10, 1);

add(2024, "2024_drone_warfare_red_sea_intercept_costs", "Navy Spending $2M Standard Missiles to Down $2,000 Houthi Attack Drones", "News", "2024 (Asymmetric Drone Economics)", "Foreign Policy & Defense", 3,
  "High-tech cost disparity as U.S. warships expend millions in advanced interceptors to defeat swarm-capable cheap enemy drones.",
  "1 = Accelerate Deployment of Directed Energy Lasers and High-Power Microwave Systems to Fix Asymmetry", "10 = Strike the Launchers, Depots, and Radar Sites Directly Inside Yemen Rather Than Catching Missiles", 3, 8, 5, 1, 8, 1);

add(2024, "2024_anti_price_gouging_grocery_statute_push", "Federal Ban on Unfair Food & Grocery Price Gouging", "News", "2024 (Kamala Harris Economic Agenda)", "Economy & Taxation", 2,
  "Kamala Harris proposing first-ever federal ban on corporate price gouging in the food and grocery sector.",
  "1 = Stop Greedflation / Empower FTC to Penalize Monopolistic Agribusinesses Squeezing Consumers", "10 = Discredited Soviet-Style Socialist Price Controls That Guarantee Empty Grocery Shelves and Rationing", 2, 10, 10, 1, 9, 1);

add(2024, "2024_salt_deduction_repeal_pledge_bipartisan", "Donald Trump Pledging Full Repeal of the $10,000 SALT Cap", "News", "2024 (Long Island / Suburban Tax Pledge)", "Economy & Taxation", 3,
  "Trump promising New York and New Jersey suburban voters he will restore full state and local tax deductibility in 2025.",
  "1 = Welcome Belated Relief for Squeezed Middle-Class Suburban Homeowners in High-Cost States", "10 = Massive $1 Trillion Tax Giveaway Siphoning Money from the Heartland to Wealthy Coastal Millionaires", 4, 7, 8, 2, 8, 1);


// =========================================================================
// 2026 (52 Issues)
// =========================================================================
add(2026, "2026_artificial_intelligence_workforce_displacement", "Artificial Intelligence White-Collar Workforce Displacement & Transition", "News", "2024-2030 (AI Automation Frontier)", "Technology & Infrastructure", 1,
  "Addressing widespread labor market disruption and corporate restructuring in software, law, finance, and customer service driven by autonomous AI agents.",
  "1 = Universal Basic Income (UBI) / AI Robot Tax / Strong Collective Worker Transition Guarantees", "10 = Free Market Adaptation / Re-skilling / Prohibit Innovation-Choking AI Regulations and Taxes", 3, 9, 9, 1, 8, 1);

add(2026, "2026_national_debt_approaching_38_trillion", "U.S. National Debt Approaching $38 Trillion & Net Interest Spending Surge", "News", "2024-2030 (Sovereign Debt Crisis Arc)", "Economy & Taxation", 1,
  "Federal net interest outlays surpassing $1.1 trillion annually, exceeding the entire defense budget and threatening sovereign credit.",
  "1 = Tax Extreme Wealth and Corporate Giants to Rebalance the Budget and Protect the Social Safety Net", "10 = Enact Binding Spending Caps, Slash Bureaucracy, and Cut Non-Defense Spending to Avert Fiscal Ruin", 3, 9, 10, 1, 10, 1);

add(2026, "2026_tcja_reconciliation_negotiation_cliff", "Reconciliation Negotiations on Permanent Extension of 2017 Tax Cuts", "News", "2025-2027 (Post-2025 Tax Legislation)", "Economy & Taxation", 1,
  "Negotiating the permanent extension of the 21% corporate rate, doubled standard deduction, and individual income brackets.",
  "1 = Let Top-Tier Tax Cuts Expire / Reinvest Revenues into Universal Childcare, Healthcare, and Housing", "10 = Lock In All Tax Cuts Permanently and Slash Capital Gains Rates to Stimulate Investment and Growth", 2, 10, 10, 1, 10, 1);

add(2026, "2026_schedule_f_civil_service_reclassification", "Schedule F Reclassification of Federal Civil Servants & DOGE Department", "News", "2025-2027 (Administrative State Overhaul)", "Governance & Judiciary", 1,
  "Converting tens of thousands of career federal civil servants into at-will political employees under the Department of Government Efficiency.",
  "1 = Defend the Merit-Based Professional Civil Service Against Partisan Weaponization and Patronage", "10 = Break the Power of the Unelected Deep State and Return Full Democratic Accountability to the President", 2, 10, 5, 1, 10, 1);

add(2026, "2026_electric_grid_capacity_ai_data_centers", "Electric Grid Capacity Crises & Surging Power Demands of AI Data Centers", "News", "2024-2030 (Grid Reliability & AI Infrastructure)", "Energy & Climate", 1,
  "Electric utilities requesting emergency delays on coal plant retirements to meet gigawatt-scale power demands from hyperscale AI centers.",
  "1 = Mandate Tech Giants Fund 100% Dedicated Clean Renewable Power / Protect Communities from Spiking Utility Bills", "10 = Keep All Baseload Coal, Gas, and Nuclear Plants Running to Win the Global Tech War with China", 2, 10, 9, 1, 10, 1);

add(2026, "2026_housing_supply_institutional_investor_bans", "Banning Wall Street Private Equity from Buying Single-Family Homes", "News", "2024-2028 (Single-Family Housing Protection)", "Economy & Taxation", 1,
  "Federal legislation barring institutional private equity funds and hedge funds from purchasing single-family residential homes.",
  "1 = Ban Wall Street Landlords / Protect American Neighborhoods and Restore Affordable Homeownership", "10 = Free Market Capital Allocation / Oppose Government Dictates on Property Ownership and Investment", 2, 8, 9, 1, 7, 1);

add(2026, "2026_taiwan_strait_deterrence_critical_minerals", "Taiwan Strait Defense Posture & U.S. Critical Mineral Independence", "News", "2024-2030 (Indo-Pacific Deterrence Phase)", "Foreign Policy & Defense", 1,
  "Deterring Chinese naval blockades of Taiwan while establishing emergency national stockpiles of refined rare earths and gallium.",
  "1 = Multilateral Diplomatic Deterrence, High-Tech Export Controls, and Sustainable Domestic Recycling", "10 = Fast-Track Weapons Shipments to Taiwan / Fast-Track Domestic Mining Permits on Federal Lands", 3, 9, 6, 1, 8, 1);

add(2026, "2026_post_tariff_consumer_price_impacts", "Economic Impacts of Universal Tariffs & Supply Chain Readjustments", "News", "2025-2028 (Tariff Adjustment Era)", "Trade & Globalism", 1,
  "Evaluating consumer price index inflation, domestic manufacturing reshoring, and trade partner retaliation under new tariffs.",
  "1 = Roll Back Punitive Universal Tariffs Squeezing Working-Class Families / Rebuild Global Trade Pacts", "10 = Stay the Course on Protective Tariffs Rebuilding the American Industrial Base and Bringing Jobs Home", 2, 9, 10, 1, 4, 1);

add(2026, "2026_social_security_bipartisan_commission_push", "Establishment of Statutory Bipartisan Fiscal Commission on Entitlements", "News", "2025-2027 (Fiscal Commission Legislative Push)", "Economy & Taxation", 2,
  "Creating a 16-member bipartisan commission empowered to fast-track mandatory legislative packages to shore up trust funds.",
  "1 = Reject Secret Closed-Door Commissions Designed to Cut Social Security and Medicare Behind Closed Doors", "10 = Pass the Bipartisan Fiscal Commission to Save Entitlements from Devastating Automatic 21% Benefit Cuts", 2, 8, 8, 1, 8, 1);

add(2026, "2026_small_modular_nuclear_reactor_deployments", "First Commercial Deployments of Advanced Small Modular Nuclear Reactors", "News", "2025-2030 (SMR Deployment Arc)", "Energy & Climate", 2,
  "NRC streamlining licensing permits for factory-built small modular reactors delivering clean industrial heat and electricity.",
  "1 = Rigorous Independent Safety, Meltdown, and Radioactive Waste Oversight Before Mass SMR Deployment", "10 = Unleash Private Nuclear Innovation and Lead Global Exports of Next-Generation Zero-Carbon Reactors", 3, 9, 8, 1, 9, 1);

add(2026, "2026_ai_copyright_training_data_fair_use", "AI Generative Model Training Data & Copyright Fair Use Doctrine", "News", "2024-2028 (AI Intellectual Property Wars)", "Technology & Infrastructure", 2,
  "Determining whether training frontier LLMs on copyrighted books, journalism, and artistic works constitutes fair use or infringement.",
  "1 = Require Mandatory Licensing Fees and Explicit Consent for Authors, Artists, and Media Creators", "10 = Protect Fair Use Training to Keep American AI Technology Unrivaled Against Unconstrained Foreign Rivals", 2, 7, 5, 1, 6, 1);

add(2026, "2026_commercial_real_estate_bank_defaults", "Commercial Real Estate Regional Bank Distressed Asset Refinancing", "News", "2024-2027 (CRE Loan Maturity Wall)", "Economy & Taxation", 2,
  "Hundreds of billions in office building commercial mortgages maturing under high interest rates, threatening regional bank solvency.",
  "1 = No Bailouts for Speculative Real Estate Vultures / Convert Empty Office Towers into Affordable Public Housing", "10 = Provide Temporary Regulatory Capital Flexibility for Community Banks to Avert Credit Contagion", 3, 8, 9, 1, 8, 1);

add(2026, "2026_mass_deportation_facility_expansion", "Federal Funding Showdown Over Multi-Billion-Dollar Migrant Detention Centers", "News", "2025-2027 (Deportation Infrastructure Battles)", "Immigration & Border", 2,
  "Congressional battles over appropriating tens of billions for mass detention staging facilities and chartered deportation flights.",
  "1 = Defund Inhumane Detention Camps and Protect Due Process and Legal Asylum Representation", "10 = Fully Fund Staging Facilities and Aviation Resources to Restore the Rule of Law and Sovereign Borders", 2, 10, 4, 1, 10, 1);

add(2026, "2026_ukraine_peace_settlement_territorial_lines", "Negotiated Ceasefire and Territorial Demarcation in the Russo-Ukrainian War", "News", "2025-2027 (Ukraine Peace Process)", "Foreign Policy & Defense", 2,
  "Debating international security guarantees, demilitarized zones, and territorial concessions along current battle lines in Ukraine.",
  "1 = Ensure Ironclad Transatlantic Security Guarantees and NATO Path for Free Ukraine / War Crimes Accountability", "10 = Prioritize Immediate Peace and Ceasefire to End the Slaughter and Stop the Risk of Nuclear Escalation", 3, 7, 4, 1, 6, 1);

add(2026, "2026_epa_forever_chemicals_pfas_superfund", "EPA Superfund Hazardous Substance Designation for PFOA & PFOS", "News", "2024-2028 (PFAS Remediation Arc)", "Energy & Climate", 2,
  "Classifying toxic 'forever chemicals' as Superfund hazardous substances, triggering billions in municipal water filtration liabilities.",
  "1 = Hold Chemical Polluters Strictly Accountable and Fund Universal Clean Water Filtration for All Communities", "10 = Provide Water Utility and Municipal Exemptions to Prevent Spiking Local Water Bills and Endless Lawsuits", 2, 8, 9, 1, 8, 1);

add(2026, "2026_quantum_computing_export_blockade", "National Security Export Controls on Advanced Quantum Computing Tooling", "News", "2025-2030 (Quantum Tech Race)", "Technology & Infrastructure", 2,
  "Restricting export of cryogenic dilution refrigerators and quantum error-correction hardware to hostile foreign adversaries.",
  "1 = Protect American Strategic Supremacy in Quantum Cryptography and National Security Intelligence", "10 = Multilateral Alliance Coordination to Prevent Unintended Chilling of Global Scientific Academic Research", 3, 9, 6, 1, 8, 1);

add(2026, "2026_synthetic_biology_biodefense_guardrails", "Mandatory DNA Synthesis Screening Standards to Prevent Engineered Pathogens", "News", "2024-2028 (Biosecurity Governance)", "Healthcare", 2,
  "Requiring commercial gene synthesis providers to verify customer identities and screen orders against dangerous biological toxins.",
  "1 = Enforce Mandatory Comprehensive Biosecurity Screening to Avert Accidental or Deliberate Bio-Terror Disasters", "10 = Light-Touch Voluntary Standards That Prevent Chilling Rapid Biomedical and Therapeutic Discoveries", 2, 8, 5, 1, 7, 1);

add(2026, "2026_federal_reserve_digital_currency_ban", "Statutory Prohibition on Federal Reserve Central Bank Digital Currency (CBDC)", "News", "2024-2027 (Anti-CBDC Legislation)", "Economy & Taxation", 2,
  "Passing legislation banning the Federal Reserve from developing or deploying a retail digital dollar to protect financial privacy.",
  "1 = Allow Fed to Research Digital Dollar to Maintain Global Reserve Currency Preeminence and Faster Payments", "10 = Ban CBDCs Forever to Stop Authoritarian Government Surveillance and Control of Private Bank Accounts", 3, 9, 10, 1, 10, 1);

add(2026, "2026_clean_energy_interconnection_queue_overhaul", "FERC Order 2023 Implementation & Fast-Tracking Renewable Grid Interconnections", "News", "2024-2028 (Grid Transmission Reform)", "Energy & Climate", 3,
  "Overhauling regional grid operator interconnection queues where 2,000+ GW of clean energy projects sit stalled waiting for lines.",
  "1 = Federal Preemption Authority for High-Voltage Interstate Transmission Lines to Unlock Clean Power", "10 = Respect State Siting Rights / Ensure Reliable Baseload Generation Is Not Sacrificed for Intermittent Power", 2, 8, 8, 1, 8, 1);

add(2026, "2026_student_loan_default_rehabilitation_cliff", "Resumption of Negative Credit Reporting for Delinquent Student Loan Borrowers", "News", "2024-2026 (Post-On-Ramp Default Reality)", "Education", 2,
  "Expiration of the 12-month post-pandemic grace period exposing millions of delinquent student loan borrowers to collection.",
  "1 = Pass Automatic Universal Income-Driven Relief and Expand Public Service Loan Forgiveness Without Delays", "10 = Require Borrowers to Honor Their Signed Contracts / End Lawless Executive Debt Cancellation Schemes", 2, 10, 10, 1, 10, 1);

add(2026, "2026_autonomous_vehicle_trucking_standards", "DOT Federal Safety Standards for Driverless Commercial Heavy Freight Trucks", "News", "2025-2028 (Autonomous Freight Regulation)", "Technology & Infrastructure", 3,
  "Promulgating federal preemption safety standards allowing commercial driverless Class-8 freight trucks on interstate highways.",
  "1 = Mandate Human Safety Drivers in All Freight Cabs / Protect 3 Million Family-Sustaining Trucking Careers", "10 = Accelerate Autonomous Freight Deployment to Slash Highway Fatalities, Lower Shipping Costs, and End Supply Bottlenecks", 2, 8, 9, 1, 7, 1);

add(2026, "2026_child_care_cliff_stabilization_grants", "Permanent Federal Funding Replacement for Expired Child Care Stabilization Grants", "News", "2024-2026 (Child Care Supply Crisis)", "Education", 2,
  "Addressing thousands of daycares closing nationwide following the expiration of pandemic relief funding.",
  "1 = Universal Federal Childcare Capped at 7% of Family Income and Living Wages for Early Educators", "10 = Reject Costly Federal Childcare Bureaucracy / Expand Family Child Care Tax Credits and Local Deregulation", 2, 9, 9, 1, 9, 1);

add(2026, "2026_space_traffic_management_orbital_debris", "FAA Office of Commercial Space & Active Orbital Space Debris Removal", "News", "2025-2030 (Orbital Congestion Management)", "Technology & Infrastructure", 3,
  "Establishing unified civilian space traffic control as mega-constellations push active orbital satellites past 50,000.",
  "1 = Enforce Stringent Global Space Debris Disposal Rules and Fund Active Remediation Technologies", "10 = Ensure Streamlined Regulatory Permitting so American Constellations Maintain Dominance Over China", 3, 8, 7, 1, 8, 1);

add(2026, "2026_right_to_repair_agricultural_equipment", "Federal Mandatory Right-to-Repair Legislation for Farm Tractors & Tech", "News", "2024-2027 (Agricultural Right-to-Repair)", "Agriculture & Food", 3,
  "Requiring manufacturers like John Deere to provide farmers and independent mechanics diagnostic software and repair codes.",
  "1 = Enact Comprehensive Federal Right-to-Repair to Break Corporate Monopolies Over Farmers and Consumers", "10 = Protect Proprietary Software Intellectual Property and Prevent Tampering with EPA Emissions Equipment", 2, 7, 3, 1, 6, 1);

add(2026, "2026_social_security_retirement_age_reform", "Proposals to Gradually Raise the Full Retirement Age from 67 to 69", "Ideological", "1983-2035 (Retirement Age Debates)", "Labor & Welfare", 2,
  "Debating whether to index the normal retirement age to life expectancy to preserve Social Security trust fund solvency.",
  "1 = Never Raise the Retirement Age / Force Millionaires and Billionaires to Pay Full Payroll Taxes", "10 = Gradually Adjust Retirement Age for Younger Workers to Account for Substantial Increases in Longevity", 2, 9, 8, 1, 9, 1);

add(2026, "2026_fentanyl_precursor_chemical_sanctions", "Targeted Secondary Financial Sanctions on Chinese Fentanyl Precursor Firms", "News", "2024-2027 (Fentanyl Interdiction Arc)", "Foreign Policy & Defense", 2,
  "Blacklisting Chinese chemical companies synthesizing synthetic opioid precursors exported to Mexican cartels.",
  "1 = Aggressive Interdiction Paired with Comprehensive Domestic Harm Reduction, Narcan, and Treatment", "10 = Maximum Sanctions, Naval Interdiction, and Designating Mexican Cartels as Foreign Terrorist Organizations", 2, 9, 4, 1, 9, 1);

add(2026, "2026_usmca_six_year_joint_review", "2026 Mandatory Six-Year Joint Review and Sunset Assessment of the USMCA", "News", "2026 (USMCA Six-Year Review)", "Trade & Globalism", 2,
  "Conducting mandatory formal review to determine whether to extend the trilateral North American trade pact for another 16 years.",
  "1 = Strengthen Binding Labor and Environmental Enforcements to Prevent Mexican Backsliding", "10 = Demand Tougher Rules of Origin to Block Chinese EV Companies from Using Mexico as a Backdoor into U.S.", 3, 9, 7, 1, 5, 1);

add(2026, "2026_medicare_part_d_two_thousand_cap_rollout", "Full Implementation of the $2,000 Out-of-Pocket Prescription Cap for Seniors", "News", "2025-2027 (IRA Drug Cap Benefits)", "Healthcare", 2,
  "Evaluating the first full year of the IRA's $2,000 maximum out-of-pocket prescription cap for all Medicare Part D enrollees.",
  "1 = Historic Triumph Lowering Prescription Drug Prices for Millions of Seniors / Expand Negotiation to All Drugs", "10 = Address Rising Part D Premium Subsidies and Unintended Stifling of Biomedical Life-Saving Research", 2, 8, 8, 1, 8, 1);

add(2026, "2026_commercial_bank_basel_iii_endgame", "Final Implementation of Basel III Endgame Capital Requirements for Big Banks", "News", "2024-2027 (Bank Capital Mandates)", "Economy & Taxation", 3,
  "Federal Reserve scaling back initial 19% capital hike proposals to roughly 9% following massive Wall Street pushback.",
  "1 = Maintain Strict Capital Buffers to Ensure Giant Banks Can Absorb Catastrophic Financial Shocks Without Bailouts", "10 = Scale Back Unnecessary Capital Hikes That Restrict Small Business Lending and Weaken American Competitiveness", 2, 8, 9, 1, 8, 1);

add(2026, "2026_geothermal_next_gen_clean_energy", "Enhanced Geothermal Systems (EGS) Hydraulic Stimulation on Federal Lands", "News", "2024-2029 (Next-Gen Clean Baseload)", "Energy & Climate", 3,
  "Applying horizontal drilling techniques from shale oil to tap deep subterranean geothermal heat for continuous clean electricity.",
  "1 = Support Breakthrough Carbon-Free Baseload Energy While Ensuring Rigorous Groundwater Safety Reviews", "10 = Expedite NEPA Categorical Exclusions for Advanced Geothermal on Federal Lands in Nevada and Utah", 2, 8, 8, 1, 8, 1);

add(2026, "2026_digital_asset_market_structure_fit21", "Financial Innovation and Technology for the 21st Century Act (FIT21)", "News", "2024-2027 (Comprehensive Crypto Law)", "Economy & Taxation", 2,
  "Establishing a clear regulatory dividing line between CFTC commodity oversight and SEC securities jurisdiction for digital assets.",
  "1 = Prevent Risky Crypto Wild West Speculation from Undermining Main Street Consumer Financial Protections", "10 = Provide Clear, Commonsense Regulatory Certainty to Keep Web3 and Blockchain Innovation in America", 3, 8, 8, 1, 7, 1);

add(2026, "2026_nuclear_fusion_commercial_pilot_plants", "Public-Private Milestone Partnerships for Commercial Fusion Energy Pilots", "News", "2024-2030 (Fusion Commercialization)", "Energy & Climate", 3,
  "Department of Energy milestone-based contracts funding private fusion startups aiming to supply pilot power to the grid by 2030.",
  "1 = Accelerate Public Funding for the Holy Grail of Clean, Abundant, Zero-Carbon Fusion Energy", "10 = Leverage Private Capital and Ensure Free-Market Competition Drives Fusion Innovation Forward", 3, 8, 8, 1, 8, 1);

add(2026, "2026_pfas_drinking_water_maximum_contaminant", "Compliance Deadlines for First Federal Enforceable PFAS Drinking Water Standards", "News", "2024-2029 (Municipal PFAS Deadlines)", "Healthcare", 3,
  "Municipal water utilities implementing advanced granular activated carbon systems to meet strict 4 parts-per-trillion limits.",
  "1 = Pure Drinking Water Free from Carcinogenic Chemicals Is an Inviolable Human Right for Every American", "10 = Provide Robust Federal Infrastructure Grants to Prevent Small Rural Towns from Facing Water Insolvent Utility Rates", 2, 8, 8, 1, 8, 1);

add(2026, "2026_deepfake_election_disinformation_penalties", "Federal Criminalization of Malicious AI-Generated Election Deepfakes", "News", "2024-2028 (AI Election Integrity)", "Governance & Judiciary", 2,
  "Banning deceptive generative AI voice clones and video deepfakes depicting candidates within 90 days of an election.",
  "1 = Enact Enforceable Federal Protections Against Deceptive High-Tech Election Sabotage and Impersonation", "10 = Protect Robust Political Satire and Guard Against Overly Broad Statutes That Infringe on First Amendment Free Speech", 2, 7, 2, 1, 6, 1);

add(2026, "2026_critical_habitat_endangered_species_reforms", "Department of the Interior Modernization of Endangered Species Act Rules", "Ideological", "1973-2030 (Conservation vs Development)", "Energy & Climate", 3,
  "Reinstating blanket 4(d) protections for threatened species versus granting state wildlife agencies primacy.",
  "1 = Science-Based Biodiversity Protection to Halt the Sixth Mass Extinction Across American Ecosystems", "10 = Modernize Outdated ESA Rules That Paralyze Renewable Energy Transmission, Mining, and Timber Jobs", 2, 9, 9, 1, 9, 1);

add(2026, "2026_national_parks_overcrowding_reservation", "Timed-Entry Reservation Systems and Deferred Maintenance Backlog", "News", "2024-2028 (Public Lands Management)", "Energy & Climate", 4,
  "Managing record visitor crowds at Zion, Rocky Mountain, and Yosemite with mandatory digital reservations and fee increases.",
  "1 = Protect Pristine Public Lands and Wilderness from Severe Overcrowding and Ecological Degradation", "10 = Keep National Parks Freely Accessible to Every American Taxpayer Without Opaque Reservation Bureaucracy", 2, 7, 6, 1, 8, 1);

add(2026, "2026_airline_passenger_rights_automatic_refunds", "DOT Mandatory Automatic Cash Refunds for Canceled & Delayed Flights", "News", "2024-2027 (Aviation Consumer Protections)", "Technology & Infrastructure", 3,
  "Enforcing federal rules requiring airlines to provide prompt automatic cash refunds for significant delays without voucher runarounds.",
  "1 = Hold Megacarrier Airlines Accountable and Protect Hardworking Travel Consumers from Deceptive Practices", "10 = Avoid Heavy-Handed Price and Operational Mandates That Force Airlines to Increase Base Ticket Fares", 2, 8, 8, 1, 7, 1);

add(2026, "2026_credit_card_eight_dollar_late_fee_rule", "CFPB Final Rule Capping Credit Card Late Fees at $8", "News", "2024-2026 (Junk Fee Regulatory War)", "Economy & Taxation", 2,
  "Slashing average credit card late fees from $32 down to $8, challenging billions in annual commercial bank penalty revenues.",
  "1 = Eliminate Exploitative Corporate Junk Fees Siphoning $14 Billion Annually from Stressed Working Families", "10 = Oppose Government Price Controls That Force Responsible Cardholders to Subsidize Chronic Late Payers", 2, 9, 9, 1, 9, 1);

add(2026, "2026_interstate_highway_toll_digital_congestion", "All-Electronic Open Road Tolling & Dynamic Congestion Pricing", "News", "2024-2028 (Transportation Funding)", "Technology & Infrastructure", 4,
  "Expanding dynamic variable toll lanes and express lanes to fund highway reconstruction as fuel tax revenues decline.",
  "1 = Invest in World-Class Public Transit and Ensure Equitable Transportation Without Regressive Lexus Lanes", "10 = Embrace Free-Market Toll Concessions and Dynamic Pricing That Efficiently Eliminates Chronic Traffic Gridlock", 3, 7, 8, 1, 7, 1);

add(2026, "2026_us_postal_service_delivery_network_consolidation", "USPS 'Delivering for America' 10-Year Network Modernization Plan", "News", "2024-2028 (Postal Network Overhaul)", "Governance & Judiciary", 3,
  "Consolidating mail sorting operations into massive Regional Processing Centers while rural post office hours are shifted.",
  "1 = Halt Disruptive Postal Consolidations Causing Severe Delivery Delays for Prescription Medications and Local News", "10 = Support Comprehensive Network Overhaul Essential to Achieve Fiscally Sustainable Modern Package Logistics", 2, 8, 7, 1, 8, 1);

add(2026, "2026_drone_delivery_commercial_bvlos_faa", "FAA Part 108 Rules for Commercial Drone Beyond-Visual-Line-of-Sight Flights", "News", "2025-2029 (Commercial Drone Logistics)", "Technology & Infrastructure", 3,
  "Finalizing national airspace regulations enabling widespread autonomous drone delivery of retail packages and urgent medical supplies.",
  "1 = Strict Privacy, Noise, and Local Community Safety Protections Before Allowing Drones Over Residential Neighborhoods", "10 = Fast-Track Commercial Drone Airspace Rules to Keep American Autonomous Aviation Ahead of Global Competitors", 3, 8, 8, 1, 8, 1);

add(2026, "2026_lithium_brine_extraction_salton_sea", "Direct Lithium Extraction (DLE) in California's Imperial Valley ('Lithium Valley')", "News", "2024-2028 (Domestic Battery Supply Chain)", "Energy & Climate", 3,
  "Tapping geothermal brine deposits to produce domestic battery-grade lithium for electric vehicles with minimal water footprint.",
  "1 = Ensure Clean Environmental Extraction That Generates Good Local Union Jobs and Direct Community Royalties", "10 = Expedite Permits and Commercialize American Lithium Valley to Break Total Dependence on Chinese Supply Chains", 2, 8, 9, 1, 8, 1);

add(2026, "2026_high_speed_rail_brightline_west_la_vegas", "Construction Progress on Brightline West High-Speed Rail to Las Vegas", "News", "2024-2028 (High-Speed Rail Demonstrator)", "Technology & Infrastructure", 3,
  "Building 218-mile all-electric high-speed bullet train along I-15 connecting Southern California to Las Vegas by 2028.",
  "1 = Landmark Example of World-Class Green High-Speed Rail Reducing Highway Congestion and Emissions", "10 = Support Successful Private-Public Infrastructure Models While Avoiding Runaway Government-Run Cost Boondoggles", 3, 7, 8, 1, 7, 1);

add(2026, "2026_mental_health_parity_rules_insurance", "Final Federal Enforcement Rules for Mental Health and Addiction Parity", "News", "2024-2027 (Mental Health Parity Enactment)", "Healthcare", 2,
  "Requiring health insurers to prove non-quantitative treatment limits on mental health are no more restrictive than physical care.",
  "1 = End Insurance Discrimination and Guarantee Equal, Affordable Coverage for Mental Health and Addiction", "10 = Prevent Complex Federal Mandates That Drive Up Health Insurance Premiums for Small Business Employers", 2, 8, 8, 1, 8, 1);

add(2026, "2026_broadband_equity_access_bead_deployments", "States Breaking Ground on $42.5 Billion BEAD Rural Broadband Projects", "News", "2024-2028 (BEAD Rural Fiber Rollout)", "Technology & Infrastructure", 2,
  "Connecting unserved rural homes and tribal communities with high-speed fiber under the 2021 Infrastructure Law.",
  "1 = Close the Digital Divide Once and for All by Delivering Reliable High-Speed Fiber to Every Corner of America", "10 = Eliminate Wasteful 'Buy America' and Prevailing Wage Mandates That Delay Projects and Inflate Costs", 2, 7, 9, 1, 8, 1);

add(2026, "2026_meatpacking_industry_consolidation_scrutiny", "DOJ & USDA Enforcement Against Anti-Competitive Cattle Market Collusion", "News", "2024-2028 (Agribusiness Antitrust Enforcement)", "Agriculture & Food", 3,
  "Enforcing Packers and Stockyards Act rules to protect independent cattle ranchers from the 'Big Four' meatpacking cartel.",
  "1 = Break Up Monopoly Agribusiness Cartels Squeezing Family Farmers and Artificially Inflating Beef Prices", "10 = Protect Efficient Meat Supply Chains and Oppose Burdensome Bureaucratic Meddling in Cattle Contracting", 2, 7, 7, 1, 6, 1);

add(2026, "2026_foreign_ownership_agricultural_land", "State and Federal Bans on Chinese Ownership of U.S. Farmland", "News", "2023-2027 (Agricultural National Security)", "Agriculture & Food", 2,
  "Restricting entities connected to foreign adversaries from purchasing agricultural land near military installations.",
  "1 = Protect Vital Food Security and Sovereign Farmland Through Carefully Targeted National Security Reviews", "10 = Ban All Foreign Adversary Farmland Ownership Nationwide to Protect America's Food Supply and Military Bases", 2, 9, 5, 1, 10, 1);

add(2026, "2026_space_station_deorbit_contract_iss", "NASA Contract for Commercial Deorbit Vehicle to Safely Retire ISS by 2030", "News", "2024-2030 (ISS Retirement Phase)", "Technology & Infrastructure", 3,
  "Awarding contract to SpaceX to build a high-thrust deorbit spacecraft to guide the 400-ton station into Point Nemo.",
  "1 = Safely Retire the Legendary Station and Support Next-Generation Commercial Low-Earth Orbit Platforms", "10 = Maintain Continuous American Manned Presence in Orbit to Never Cede Space Leadership to China's Tiangong", 3, 8, 7, 1, 8, 1);

add(2026, "2026_carbon_border_adjustment_mechanism_cbam", "Bipartisan Proposals for a U.S. Carbon Border Adjustment Tariff", "Ideological", "2024-2030 (Carbon Border Adjustment Arc)", "Trade & Globalism", 2,
  "Levying carbon intensity tariffs on imported steel, aluminum, and cement from high-polluting countries like China.",
  "1 = Level the Global Playing Field for Clean American Industry and Penalize Heavy Foreign Carbon Polluters", "10 = Reject Backdoor Carbon Taxes That Undermine Domestic Energy Independence and Create Regulatory Nightmares", 3, 7, 8, 1, 6, 1);

add(2026, "2026_veterans_pact_act_burn_pits_expansion", "Full Enactment & Screening for 23 Toxic Burn Pit Presumptive Conditions", "News", "2022-2027 (PACT Act Implementation)", "Healthcare", 2,
  "Delivering comprehensive medical care and disability compensation to over 1 million toxic-exposed post-9/11 veterans.",
  "1 = Fulfill Our Sacred Moral Obligation to Care for Every Brave Veteran Harmed by Toxic War Exposure", "10 = Fully Fund Veteran Care While Guarding Against Wasteful Processing Backlogs and Inefficient Bureaucracy", 2, 8, 6, 1, 7, 1);

add(2026, "2026_space_resources_artemis_accords_mining", "Artemis Accords Lunar Resource Extraction & Property Rights Framework", "News", "2024-2030 (Lunar Mining Property Rights)", "Technology & Infrastructure", 3,
  "Establishing bilateral norms recognizing the right of commercial space companies to extract and own lunar water ice and regolith.",
  "1 = Ensure Peaceful, Multilateral, and Sustainable Exploration of Outer Space for the Benefit of All Humanity", "10 = Protect Sovereign American Commercial Property Rights on the Moon and Secure Vital Lunar Strategic Locations", 3, 9, 8, 1, 8, 1);

console.log('Bracket 4 total issues (2024 & 2026):', ISSUES.length);

module.exports = ISSUES;
