/**
 * scripts/build-issues-1992-1998.cjs
 * Issues dataset for 1992, 1994, 1996, 1998 election cycles (Bracket E).
 * 50 issues per cycle across all 10 tiers (200 total).
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
// 1992 (50 Issues)
// =========================================================================
add(1992, "1992_ross_perot_independent_candidacy_nafta", "Ross Perot 19% Independent Candidacy & Anti-NAFTA 'Giant Sucking Sound'", "News", "1992 (Perot Populist Insurgency)", "Economy & Taxation", 1,
  "Billionaire Ross Perot winning 19% of the popular vote on an anti-deficit, anti-NAFTA platform, warning of a 'giant sucking sound' of American jobs moving to Mexico.",
  "1 = Brilliant Independent Awakening Rejecting Corrupt Two-Party Politics, Trade Treachery, and Exploding Deficits", "10 = Quixotic Ego Campaign Siphoning Votes from Bush and Promising Gilded Age Technocratic Solutions Without Accountability", 3, 7, 8, 2, 8, 1);

add(1992, "1992_clinton_carville_its_the_economy_stupid", "Bill Clinton's 'It's the Economy, Stupid' War Room Strategy", "News", "1992 (Clinton Economy Campaign)", "Economy & Taxation", 1,
  "James Carville's relentless campaign focus on the lingering 1990-1991 recession, stagnant middle-class wages, and George H.W. Bush's perceived economic detachment.",
  "1 = Laser-Focused Domestic Strategy Putting Everyday Middle-Class Working Families First After 12 Years of Trickle-Down Neglect", "10 = Distorting a Natural Economic Recovery Underway to Elect a Slick, Untrustworthy Southern Politician with Tax-and-Spend Ambitions", 2, 8, 9, 1, 9, 1);

add(1992, "1992_clinton_new_democrat_dlc_triangulation", "Bill Clinton's 'New Democrat' Platform (DLC Welfare Reform & Fiscal Discipline)", "News", "1992 (New Democrat DLC Genesis)", "Governance & Judiciary", 1,
  "Clinton steering the Democratic Party to the center via the Democratic Leadership Council (DLC), pledging to 'end welfare as we know it' and support capital punishment.",
  "1 = Modern Pragmatic Synthesis Moving Beyond Outmoded 1960s Liberal Dogma to Win Back Disaffected Suburban and Blue-Collar Voters", "10 = Cynical Chameleon Politics Adopting Conservative Rhetoric on Crime and Welfare Merely to Conceal Radical Liberal Spending Plans", 3, 8, 7, 2, 9, 2);

add(1992, "1992_los_angeles_riots_rodney_king", "1992 Los Angeles Riots (63 Dead Following Rodney King Verdicts)", "News", "1992 (LA Riots Catastrophe)", "Civil Rights & Social Issues", 1,
  "Six days of civil unrest, burning, and looting causing $1B in damages after an all-white Simi Valley jury acquitted LAPD officers in the videotaped beating of Rodney King.",
  "1 = Justified National Outrage Against Entrenched Police Brutality, White Racism, and Decades of Economic Neglect in Inner-City Communities", "10 = Unforgivable Lawless Riot, Arson, and Murder Demanding Immediate Federal Military Deployment to Enforce Law and Order", 2, 9, 4, 1, 10, 1);

add(1992, "1992_signing_of_nafta_negotiations_completed", "Bush Administration Completes Trilateral NAFTA Negotiations", "News", "1992 (NAFTA Signing Phase)", "Economy & Taxation", 1,
  "President Bush, Carlos Salinas, and Brian Mulroney signing the North American Free Trade Agreement to eliminate tariffs on goods traded between the U.S., Canada, and Mexico.",
  "1 = Catastrophic Trade Betrayal Exporting Hundreds of Thousands of American Factory Machinists to Mexican Sweatshops and Polluting Borders", "10 = Historic Geopolitical and Economic Milestone Creating the World's Largest Free Market Zone and Solidifying Continental Prosperity", 3, 8, 10, 1, 8, 1);

add(1992, "1992_year_of_the_woman_senate_elections", "1992 'Year of the Woman': Record Election of Female Senators Post-Anita Hill", "News", "1992 (Year of the Woman)", "Civil Rights & Social Issues", 1,
  "Voters electing four new female U.S. Senators (Boxer, Feinstein, Moseley Braun, Murray) following national anger over the all-male Senate Judiciary Committee Anita Hill hearings.",
  "1 = Historic Breakthrough Tearing Down the Old Boys' Club in the U.S. Senate and Prioritizing Women's Health, Reproductive Rights, and Safety", "10 = Partisan Mobilization Electing Hard-Left Liberal Democratic Partisans Under the Banner of Emotional Identity Politics", 2, 9, 4, 1, 9, 1);

add(1992, "1992_planned_parenthood_v_casey_undue_burden", "Planned Parenthood v. Casey Supreme Court Ruling ('Undue Burden' Standard)", "News", "1992 (Casey Abortion Ruling)", "Healthcare", 1,
  "Supreme Court ruling 5-4 (O'Connor, Kennedy, Souter joint opinion) reaffirming Roe's essential holding while adopting the 'undue burden' standard for state abortion rules.",
  "1 = Vital Defense of Women's Constitutional Bodily Privacy, Though Compromising on Waiting Periods Imposes Burdens on Poor Women", "10 = Tragic Judicial Activism by Republican-Appointed Moderates Betraying Conservative Constitutional Fidelity and Protecting Abortion", 2, 9, 6, 1, 10, 1);

add(1992, "1992_lee_v_weisman_school_graduation_prayer", "Lee v. Weisman Supreme Court Ruling (Banning Clergy Prayers at School Graduations)", "News", "1992 (Lee v. Weisman Prayer Ruling)", "Governance & Judiciary", 1,
  "Supreme Court ruling 5-4 (Kennedy opinion) that clergy-led non-denominational prayers at public middle and high school graduations violate the Establishment Clause.",
  "1 = Indispensable Defense of Religious Conscience Protecting Religious Minority and Non-Believing Students from State Psychological Coercion", "10 = Hostile Secular Judicial Tyranny Banishing God, Christian Heritage, and Voluntary Prayer from American Public Life and Milestones", 2, 8, 3, 1, 10, 1);

add(1992, "1992_energy_policy_act_epact92_renewable_ptc", "Enactment of the Energy Policy Act of 1992 (EPAct - Renewable Energy PTC)", "News", "1992 (EPAct 92 Enacted)", "Energy & Climate", 1,
  "Comprehensive energy statute creating the Production Tax Credit (PTC) for wind and biomass electricity, mandating alternative-fuel fleet vehicles, and restructuring electric wholesale.",
  "1 = Foundational Clean Energy Milestone Catalyzing Modern American Utility-Scale Wind and Solar Power Development", "10 = Distorting Electric Markets with Heavy Federal Subsidies and Alternative-Fuel Mandates Rather Than Letting Free Markets Pick Fuels", 2, 8, 8, 1, 8, 1);

add(1992, "1992_cable_television_protection_competition_act", "Enactment of the Cable Television Consumer Protection and Competition Act of 1992", "News", "1992 (Cable TV Reregulation Veto Override)", "Technology & Infrastructure", 1,
  "Congress overwhelmingly overriding Bush's veto (first override of Bush presidency) to re-regulate basic cable TV rates, mandate broadcast retransmission consent, and curb rate gouging.",
  "1 = Splendid Consumer Victory Breaking Monopolistic Cable Operators Gouging Families with Double-Digit Rate Hikes and Junk Fees", "10 = Disastrous Re-regulation That Will Stifle Multi-Billion Dollar Capital Investment in Fiber-Optic Broadband and Constrain New Cable Channels", 2, 8, 9, 1, 8, 1);

add(1992, "1992_twenty_seventh_amendment_ratified", "Ratification of the 27th Amendment (Restricting Mid-Term Congressional Pay Raises)", "News", "1992 (27th Amendment Ratification)", "Governance & Judiciary", 1,
  "Submitted by James Madison in 1789, ratified after a 202-year campaign led by Gregory Watson, barring any congressional salary increase from taking effect until an election has intervened.",
  "1 = Inspiring Triumph of Grassroots Constitutional Persistence Restraining Self-Serving Congressional Pay Grabs by Lawmakers", "10 = Splendid Constitutional Check Enforcing Accountability on Spendthrift Politicians Living on the Federal Taxpayer Dime", 2, 8, 9, 1, 10, 1);

add(1992, "1992_operation_restore_hope_somalia_famine", "Operation Restore Hope: President Bush Deploys U.S. Troops to Somalia", "News", "1992 (Somalia Humanitarian Mission)", "Foreign Policy & Defense", 1,
  "Bush deploying 28,000 U.S. troops in December to secure food delivery and halt mass starvation caused by warring Somali warlords in Mogadishu.",
  "1 = Noble Humanitarian Mission Deploying American Logistics and Power to Rescue Hundreds of Thousands of Starving Somali Children", "10 = Perilous Mission Creep Entangling American Soldiers in Anarchic African Clan Warfare Without Any Clear National Security Interest", 2, 8, 4, 1, 8, 1);

add(1992, "1992_hurricane_andrew_south_florida_catastrophe", "Hurricane Andrew Devastates South Florida & FEMA Emergency Response Breakdown", "News", "1992 (Hurricane Andrew Emergency)", "Energy & Climate", 1,
  "Category 5 hurricane obliterating Homestead, FL, destroying 63,000 homes, and prompting Kate Hale's iconic plea: 'Where in the hell is the cavalry? We need food, we need water!'",
  "1 = Devastating Indictment of Incompetent Federal Disaster Bureaucracy Neglecting Desperate American Citizens in Catastrophe", "10 = Deploy the Active Military Immediately to Restore Public Safety, Prevent Looting, and Distribute Emergency Shelter", 2, 7, 6, 1, 7, 1);

add(1992, "1992_ruby_ridge_standoff_fbi_sniper_killing", "Ruby Ridge Standoff in Idaho (FBI Sniper Kills Vicki Weaver)", "News", "1992 (Ruby Ridge Standoff)", "Governance & Judiciary", 1,
  "Eleven-day siege by federal marshals and FBI HRT at Randy Weaver's cabin; FBI sniper Lon Horiuchi shoots and kills Vicki Weaver while holding her infant daughter.",
  "1 = Chilling Demonstration of Reckless, Militarized Federal Law Enforcement Lawlessness Trampling Constitutional Due Process", "10 = Outrageous Executive Police-State Killing Fueling Right-Wing Militia Movements and Galvanizing Anti-Government Resistance", 2, 9, 1, 1, 9, 1);

add(1992, "1992_tailhook_scandal_navy_leadership_shakeup", "Tailhook Sexual Assault Scandal & Resignation of Navy Secretary Garrett", "News", "1991-1992 (Tailhook Scandal)", "Civil Rights & Social Issues", 1,
  "Investigation into Las Vegas naval aviators convention where 83 women were sexually assaulted in hotel corridors, leading to resignation of Navy Secretary and Admiral purges.",
  "1 = Disgraceful Culture of Misogyny and Sexual Predation Permeating Military Aviation Demanding Immediate Root-and-Branch Reform", "10 = Vigorously Discipline Individual Misconduct While Guarding Against Demoralizing Radical Feminist Witch Hunts Against Combat Pilots", 2, 8, 3, 1, 8, 1);

add(1992, "1992_pat_buchanan_culture_war_speech", "Pat Buchanan's 'Culture War' Speech at the Houston Republican Convention", "News", "1992 (Buchanan Culture War Speech)", "Civil Rights & Social Issues", 1,
  "Buchanan declaring: 'There is a religious war going on in this country. It is a cultural war, as critical to the kind of nation we shall be as was the Cold War itself.'",
  "1 = Chilling, Intolerant Manifest of Religious Bigotry, Homophobia, and Reactionary Nationalism Repelling Modern Suburban Americans", "10 = Fearless, Prophetic Call to Arms Defending Christian Faith, Traditional Morality, and America-First Sovereignty from Moral Decay", 2, 10, 6, 1, 10, 1);

add(1992, "1992_al_gore_earth_in_the_balance_green_agenda", "Al Gore Selected as Clinton Running Mate & 'Earth in the Balance' Agenda", "News", "1992 (Al Gore VP Pick & Green Tech)", "Energy & Climate", 1,
  "Clinton picking Tennessee Senator Al Gore, author of 'Earth in the Balance', proposing a Global Marshall Plan to eliminate internal combustion engines and tackle global warming.",
  "1 = Visionary Environmental Leadership Positioned to Lead the 21st Century Green High-Tech Industrial Revolution", "10 = Radical Ecological Zealotry Seeking to Impose Crippling Carbon Taxes and Eliminate America's Automotive and Energy Economy", 2, 8, 8, 1, 8, 1);

add(1992, "1992_epa_secondhand_smoke_group_a_carcinogen", "EPA Draft Report Declaring Secondhand Tobacco Smoke a Group A Human Carcinogen", "News", "1992 (Secondhand Smoke Carcinogen)", "Healthcare", 1,
  "EPA scientific assessment concluding environmental tobacco smoke causes 3,000 annual lung cancer deaths in non-smokers, launching nationwide indoor smoking bans.",
  "1 = Irrefutable Scientific Evidence Proving Smokers Involuntarily Poison Innocent Bystanders / Ban Smoking in All Public Workplaces", "10 = Methodologically Flawed Junk-Science Report Designed to Empower Bureaucratic Prohibitionists and Trample Private Property Rights", 2, 8, 9, 1, 8, 1);

add(1992, "1992_istea_highway_mass_transit_flexibility", "Implementation of the Intermodal Surface Transportation Efficiency Act (ISTEA)", "News", "1991-1993 (ISTEA Transportation Revolution)", "Technology & Infrastructure", 2,
  "Landmark $155 billion transportation law allowing metropolitan planning organizations (MPOs) to flex highway funds into commuter rail, subways, and bike paths.",
  "1 = Revolutionary Intermodal Transportation Planning Breaking the Concrete Monopoly and Rebuilding Vibrant Clean Transit", "10 = Diversion of Gasoline Taxes Dedicated for Potholes and Highways into Inefficient Urban Transit Rail Boondoggles", 2, 8, 8, 1, 8, 1);

add(1992, "1992_pdufa_i_prescription_drug_user_fee_act", "Enactment of the Prescription Drug User Fee Act of 1992 (PDUFA I)", "News", "1992 (PDUFA I Enactment)", "Healthcare", 1,
  "Authorizing FDA to collect user fees from pharmaceutical companies to hire hundreds of new drug reviewers and drastically shorten new drug review times.",
  "1 = Practical Bipartisan Mechanism Cutting Review Times by Half and Getting Life-Saving Therapies Rapidly to Patients", "10 = Corrupt Conflict of Interest Allowing Big Pharma to Direct-Fund the Very Regulatory Agency That Inspects Its Products", 2, 8, 8, 1, 8, 1);

add(1992, "1992_residential_lead_paint_hazard_reduction_act", "Residential Lead-Based Paint Hazard Reduction Act of 1992 (Title X Disclosure)", "News", "1992 (Lead Paint Disclosure Enacted)", "Healthcare", 2,
  "Requiring sellers and landlords of pre-1978 residential housing to disclose known lead-based paint hazards to buyers and renters before lease or sale.",
  "1 = Essential Public Health Protection Shielding Young Children and Expectant Mothers from Silent Neurological Lead Damage in Older Homes", "10 = Onerous Paperwork Filing Mandates and Liability Traps for Everyday Homeowners and Independent Landlords", 2, 8, 7, 1, 8, 1);

add(1992, "1992_al_gore_information_superhighway_hpc_act", "High-Performance Computing Act Implementation & 'Information Superhighway'", "News", "1991-1993 (Information Superhighway Genesis)", "Technology & Infrastructure", 1,
  "Federal investment spearheaded by Al Gore establishing the National Research and Education Network (NREN), laying the technical backbone for the commercial internet.",
  "1 = Visionary Public Scientific Investment Democratizing Knowledge and Laying the Groundwork for the Digital Economic Miracle", "10 = Typical Political Self-Aggrandizement; Private Silicon Valley Telecom Innovators Built the Modern Commercial Web", 2, 8, 9, 2, 8, 1);

add(1992, "1992_brady_bill_handgun_waiting_period_debates", "Congressional Battles over the Brady Handgun Violence Prevention Act", "News", "1992 (Brady Bill Debates)", "Civil Rights & Social Issues", 1,
  "Legislation pushed by Sarah Brady and Democrats mandating a 5-day waiting period and background check for handgun purchases; stalled by GOP filibuster.",
  "1 = Urgent Common-Sense Gun Safety Stopping Convicted Felons and Fugitives from Walking Out of Gun Shops with Concealable Handguns", "10 = Unconstitutional Second Amendment Infringement Delaying Law-Abiding Citizens from Defending Their Families from Criminals", 2, 9, 10, 1, 10, 1);

add(1992, "1992_yugoslavia_breakup_bosnian_ethnic_cleansing", "Breakup of Yugoslavia: Bosnian War Outbreak & Serbian 'Ethnic Cleansing'", "News", "1992 (Bosnian War Outbreak)", "Foreign Policy & Defense", 1,
  "Serbian forces shelling Sarajevo and establishing concentration camps; harrowing television images of emaciated Muslim prisoners shock the world.",
  "1 = Urgent Moral Duty of the Democratic Free World to Lift the Arms Embargo and Use NATO Air Power to Halt Genocide in Europe", "10 = Avoid Unilateral Military Entanglement in Centuries-Old Balkan Blood Feuds That Pose No Threat to American Security", 2, 8, 4, 1, 8, 1);

add(1992, "1992_freedom_support_act_aid_to_former_soviet_states", "Enactment of the FREEDOM Support Act of 1992 ($12 Billion Post-Soviet Aid)", "News", "1992 (Freedom Support Act Enacted)", "Foreign Policy & Defense", 1,
  "Authorizing $12 billion in bilateral economic, technical, and humanitarian aid to help Russia and former Soviet republics transition to democratic capitalism.",
  "1 = Crucial Historical Strategic Investment Ensuring Russia Does Not Slide Back into Authoritarian Fascism or Lose Control of Nuclear WMDs", "10 = Wasteful Foreign Aid Bailout Pouring American Taxpayer Billions into Corrupt Russian Oligarchs' Offshore Bank Accounts", 2, 8, 6, 1, 9, 1);

add(1992, "1992_auto_trade_minivan_import_tariff_controversy", "U.S. Big Three Push to Classify Japanese Minivans as Cargo Trucks (25% Tariff)", "News", "1992 (Minivan 25% Chicken Tax Dispute)", "Economy & Taxation", 2,
  "Ford and Chrysler petitioning Treasury to classify imported Japanese passenger minivans as cargo trucks subject to the 1963 25% 'Chicken War' tariff.",
  "1 = Enforce Fair Trade Rules to Prevent Foreign Carmakers from Circumventing Tariffs and Decimating American Family Van Plants", "10 = Sham Regulatory Classification Slapping a 25% Hidden Tax on Everyday Suburban Families Who Need Affordable Minivans", 2, 8, 10, 1, 8, 1);

add(1992, "1992_cvpia_central_valley_water_salmon_reform", "Central Valley Project Improvement Act of 1992 (CVPIA)", "News", "1992 (CVPIA Water Reform)", "Energy & Climate", 1,
  "Congress reallocating 800,000 acre-feet of California Central Valley Project irrigation water from corporate growers to environmental salmon restoration.",
  "1 = Historic Ecological Rebalancing Rescuing the Sacramento River Salmon Fishery from Total Extinction Caused by Agribusiness Greed", "10 = Devastating Federal Theft of Agricultural Water Strangling the Nation's Breadbasket and Destroying Thousands of Farm Jobs", 2, 8, 8, 1, 9, 1);

add(1992, "1992_direct_student_lending_pilot_enacted", "Higher Education Amendments of 1992 (Federal Direct Lending Pilot & Free FAFSA)", "News", "1992 (Direct Lending Inception & FAFSA)", "Education", 2,
  "Creating the Free Application for Federal Student Aid (FAFSA) and launching the Direct Student Loan pilot to bypass commercial bank middleman profits.",
  "1 = Brilliant Streamlining Slashing Red Tape for College Applicants and Cutting Out Parasitic Commercial Bank Subsidies", "10 = Government Nationalization of Student Credit Squeezing Out Sound Private Community Banks and Inflating University Tuitions", 2, 8, 9, 1, 9, 1);

add(1992, "1992_term_limits_sweep_14_states_ballots", "State Legislative and Congressional Term Limits Pass in 14 States", "News", "1992 (Term Limits Wave 1992)", "Governance & Judiciary", 1,
  "Grassroots term limit initiatives passing by huge margins in 14 states (including California, Florida, and Michigan), barring multi-term career politicians.",
  "1 = Dangerous Anti-Democratic Fad Depriving Voters of Experienced Public Servants and Empowering Unaccountable Bureaucrats", "10 = Glorious Reaffirmation of Citizen-Legislator Principles Smashing the Arrogant Imperial Ruling Class in Washington", 3, 9, 9, 1, 10, 1);

add(1992, "1992_operation_southern_watch_iraq_no_fly_zone", "Operation Southern Watch: U.S. Imposes No-Fly Zone Over Southern Iraq", "News", "1992 (Southern No-Fly Zone)", "Foreign Policy & Defense", 1,
  "U.S., UK, and France establishing a no-fly zone south of the 32nd parallel to protect Shiite populations from Saddam Hussein's helicopter gunship massacres.",
  "1 = Indispensable Protection Preventing Genocide and Enforcing Strict UN Demilitarization Directives on Saddam's Regime", "10 = Open-Ended Indefinite Military Patrols Risking American Pilot Shootdowns in the Middle East with No Exit Strategy", 2, 9, 4, 1, 8, 1);

add(1992, "1992_dan_quayle_murphy_brown_speech", "Vice President Dan Quayle's 'Murphy Brown' Single-Motherhood Speech", "News", "1992 (Murphy Brown Family Values Debate)", "Civil Rights & Social Issues", 1,
  "Quayle delivering a speech in San Francisco blaming the LA riots on family decay and criticizing fictional TV character Murphy Brown for bearing a child alone.",
  "1 = Out-of-Touch, Insulting Attack Slandering Millions of Hardworking Single Mothers Striving Against Economic Hardship", "10 = Brave Truth-Telling Calling Attention to the Catastrophic Social and Emotional Costs of Fatherless Homes in America", 2, 9, 6, 1, 10, 1);

add(1992, "1992_sister_souljah_moment_clinton_condemns_rap", "Bill Clinton's 'Sister Souljah Moment' at the Rainbow Coalition Convention", "News", "1992 (Sister Souljah Moment)", "Civil Rights & Social Issues", 1,
  "Clinton publicly criticizing rap artist Sister Souljah before Jesse Jackson's Rainbow Coalition for comments suggesting Black people kill white people.",
  "1 = Principled Courageous Centrist Leadership Standing Firm Against Extremist Rhetoric Regardless of Race or Political Ally", "10 = Calculated Racial Posturing Designed to Humiliate Jesse Jackson and Signal Cultural Reassurance to White Suburban Voters", 3, 8, 4, 1, 8, 1);

add(1992, "1992_clarence_thomas_anita_hill_aftermath", "Continuing Political Shockwaves from the Clarence Thomas Confirmation", "News", "1991-1992 (Anita Hill Hearing Shockwaves)", "Governance & Judiciary", 1,
  "Public outrage over the 52-48 confirmation of Clarence Thomas following Anita Hill's sexual harassment testimony reshaping female voter turnout.",
  "1 = Shocking Display of Senate Patriarchal Contempt Igniting a Grassroots Feminist Movement to Transform American Governance", "10 = Courageous Vindication of Justice Thomas Surmounting a Sordid, High-Tech Lynching by Desperate Liberal Character Assassins", 2, 10, 6, 1, 10, 1);

add(1992, "1992_gulf_war_syndrome_investigation_launches", "Department of Defense Launches Inquiries into 'Persian Gulf Syndrome'", "News", "1992 (Gulf War Syndrome Inception)", "Healthcare", 1,
  "Thousands of returning Desert Storm combat veterans reporting debilitating chronic fatigue, fibromyalgia, and cognitive fog; DoD opens clinical reviews.",
  "1 = Sacred Moral Duty to Immediately Investigate Chemical Nerve Agent and Pyridostigmine Exposure and Provide Full VA Disability Care", "10 = Ensure Thorough Scientific Peer-Reviewed Medical Studies to Identify Causes Free from Speculative Panic and Hysteria", 2, 8, 6, 1, 8, 1);

add(1992, "1992_federal_deficit_hits_record_290_billion", "Federal Annual Budget Deficit Hits All-Time High of $290 Billion", "News", "1992 (Record $290B Deficit)", "Economy & Taxation", 1,
  "S&L bailout costs, recession relief, and defense outlays driving the federal deficit to $290 billion, dominating political debate and Perot's infomercials.",
  "1 = Indictment of 12 Years of GOP Trickle-Down Economics; Balance the Budget by Raising Taxes on Millionaires and Slashing Waste", "10 = Deficits Prove Congressional Democrats Cannot Be Trusted with the Public Purse / Enact a Balanced Budget Constitutional Amendment", 2, 9, 10, 1, 9, 1);

add(1992, "1992_snake_river_sockeye_salmon_esa_listing", "Endangered Species Act Listing of Snake River Sockeye Salmon", "News", "1991-1993 (Snake River Salmon Wars)", "Energy & Climate", 1,
  "Listing the sockeye as endangered, sparking demands to breach four lower Snake River hydroelectric dams and threatening Pacific Northwest cheap power.",
  "1 = Sacred Ecological Obligation Preserving Iconic Pacific Northwest Wild Salmon from Total Extinction Caused by Concrete Dams", "10 = Extremist Demands Threatening Cheap Carbon-Free Hydropower, Wheat Barging, and Agricultural Irrigation in Eastern Washington", 2, 8, 8, 1, 9, 1);

add(1992, "1992_windows_3_1_pc_revolution_boom", "Microsoft Releases Windows 3.1 (Selling 3 Million Copies in Two Months)", "News", "1992 (Windows 3.1 & PC Revolution)", "Technology & Infrastructure", 2,
  "Release of Windows 3.1 establishing graphical user interface standard on IBM-compatible PCs, powering explosive corporate productivity and tech growth.",
  "1 = Spectacular American High-Tech Engineering Triumph Revolutionizing Workplace Computing and Personal Communication", "10 = Celebrate Free Enterprise High-Tech Ingenuity While Monitoring Microsoft's Aggressive Commercial Monopolization Tactics", 2, 8, 9, 2, 8, 1);

add(1992, "1992_clean_air_oxygenated_fuels_mandate_winter", "Clean Air Act Oxygenated Fuels Mandate Begins in 39 High-CO Metro Areas", "News", "1992 (Oxygenated Fuels Rollout)", "Energy & Climate", 2,
  "Requiring gasoline sold in winter in 39 smog-choked metropolitan areas to contain 2.7% oxygen (via MTBE or ethanol) to reduce carbon monoxide tailpipe emissions.",
  "1 = Highly Effective Public Health Measure Slashing Dangerous Winter Carbon Monoxide Concentrations in American Cities", "10 = Mandate Forcing Drivers to Pay 5 Cents More per Gallon While Reducing Fuel Mileage and Risking MTBE Groundwater Contamination", 2, 8, 8, 1, 8, 1);

add(1992, "1992_international_dolphin_conservation_act", "Enactment of the International Dolphin Conservation Act of 1992", "News", "1992 (Dolphin-Safe Tuna Mandate)", "Energy & Climate", 2,
  "Establishing a moratorium on purse-seine tuna netting around dolphins and creating the official 'Dolphin-Safe' canned tuna labeling certification.",
  "1 = Historic Moral Conservation Milestone Saving Countless Intelligent Marine Mammals from Suffocation in Commercial Tuna Nets", "10 = Trade Embargo Threatening Latin American Alliances and Triggering GATT Retaliation for Unilateral U.S. Environmental Mandates", 2, 8, 8, 1, 8, 1);

add(1992, "1992_gatt_blair_house_accord_farm_breakthrough", "U.S. and European Community Sign Blair House Accord on Farm Subsidies", "News", "1992 (Blair House Trade Accord)", "Economy & Taxation", 2,
  "Bilateral compromise cutting subsidized agricultural export volume by 21%, unblocking the multi-year Uruguay Round multilateral trade negotiations.",
  "1 = Important Breakthrough Reining In Unfair European Agricultural Dumping and Opening Global Markets for American Crops", "10 = Free-Market Advance Dismantling Chronic Worldwide Agricultural Protectionism to Lower Food Costs Globally", 2, 8, 9, 1, 8, 1);

add(1992, "1992_clinton_vietnam_draft_controversy", "Bill Clinton's Vietnam Draft Avoidance & ROTC Colonel Holmes Letter", "News", "1992 (Clinton Draft Controversy)", "Governance & Judiciary", 2,
  "Disclosure of Clinton's 1969 letter thanking an ROTC colonel for 'saving me from the draft' while seeking to maintain political viability, polarizing veterans.",
  "1 = Legitimate Opposition to an Immoral, Tragic War Shared by Millions of Thoughtful Young Men of His Generation", "10 = Deceitful Draft-Dodging Proving Clinton Lacks the Honor, Character, and Moral Authority to Command the Armed Forces", 2, 9, 4, 1, 10, 1);

add(1992, "1992_jerry_brown_flat_tax_100_dollar_insurgency", "Jerry Brown's 1992 Democratic Primary Insurgency ($100 Limit & 13% Flat Tax)", "News", "1992 (Jerry Brown 1992 Insurgency)", "Economy & Taxation", 2,
  "Former California Governor Jerry Brown running an insurgent populist primary bid taking only $100 donations, proposing a 13% flat tax and value-added tax.",
  "1 = Radical Reform Squeezing Corrupting Big-Money Donations Out of Politics and Sweeping Away the Gilded Age Tax Code", "10 = Regressive Flat-Tax Scheme Shifting the Tax Burden onto Everyday Working Families While Enriching Wall Street Millionaires", 3, 7, 8, 2, 8, 1);

add(1992, "1992_native_american_languages_act_amendments", "Enactment of the Native American Languages Act Amendments of 1992", "News", "1992 (Native Languages Preserved)", "Civil Rights & Social Issues", 3,
  "Establishing grant program through the Administration for Native Americans to preserve, record, and teach vanishing indigenous languages in tribal schools.",
  "1 = Sacred Moral Debt Helping Indigenous Nations Preserve Ancient Cultural Heritage, Oral Histories, and Spiritual Traditions", "10 = Support Sovereign Cultural Heritage While Ensuring Public Schools Maintain English as the Primary Language of Opportunity", 2, 7, 3, 1, 7, 1);

add(1992, "1992_gennifer_flowers_clinton_60_minutes", "Gennifer Flowers Affair Allegations & Bill and Hillary Clinton's 60 Minutes Interview", "News", "1992 (Gennifer Flowers & 60 Minutes)", "Governance & Judiciary", 2,
  "Star tabloid allegations of a 12-year affair with Arkansas state employee Gennifer Flowers; Clintons appear on post-Super Bowl 60 Minutes acknowledging marital pain.",
  "1 = Private Marriage Struggles Handled with Candor and Dignity; Voters Care About Jobs, Healthcare, and Economic Recovery", "10 = Chronic Moral Turpitude, Infidelity, and Sordid Dishonesty Revealing Fundamental Character Flaws in a Prospective President", 2, 8, 4, 1, 9, 1);

add(1992, "1992_fed_slashes_discount_rate_to_three_percent", "Federal Reserve Slashes Discount Rate to 3% (Lowest Level in 29 Years)", "News", "1992 (Fed Lowest Rates in Decades)", "Economy & Taxation", 1,
  "Alan Greenspan lowering the benchmark discount rate to 3% to stimulate bank lending and unfreeze commercial real estate following the banking credit crunch.",
  "1 = Necessary Monetary Stimulus to Jump-Start Lagging Job Growth, Though Pro-Growth Public Investment Is Also Essential", "10 = Prudent Central Bank Action Bringing Down Mortgage and Commercial Loan Rates While Keeping Post-Recession Inflation Low", 2, 8, 9, 1, 8, 2);

add(1992, "1992_low_income_housing_tax_credit_extension", "Congressional Battles to Make the Low-Income Housing Tax Credit Permanent", "News", "1992 (LIHTC Permanent Authorization)", "Labor & Welfare", 2,
  "Bipartisan coalition pushing to make Section 42 LIHTC permanent after years of temporary one-year extensions, stabilizing affordable housing finance.",
  "1 = Essential Weapon Involving Private Real Estate Discipline to Build Hundreds of Thousands of Safe, Affordable Homes for the Poor", "10 = Sound Market-Oriented Mechanism Leveraging Private Capital to Meet Low-Income Housing Needs Free from Direct Bureaucracies", 2, 8, 9, 2, 8, 1);

add(1992, "1992_commercial_space_launch_reauthorization", "Commercial Space Launch Act Amendments of 1992", "News", "1992 (Commercial Space Cargo Enacted)", "Technology & Infrastructure", 3,
  "Authorizing commercial payload space launch licenses and codifying government indemnification caps for commercial rocket mishaps.",
  "1 = Foster Competitive American Commercial Rocketry While Ensuring Strict Public Range Safety and Environmental Impact Reviews", "10 = Splendid Free-Market Deregulation Unleashing American Commercial Space Enterprise to Rival Subsidized Foreign Launchers", 2, 8, 10, 2, 8, 1);

add(1992, "1992_civil_rights_act_of_1991_effective", "Implementation of the Civil Rights Act of 1991 (Jury Trials & Compensatory Damages)", "News", "1991-1992 (Civil Rights Act 1991)", "Civil Rights & Social Issues", 1,
  "Statute signed by Bush providing for jury trials and compensatory/punitive damages in intentional Title VII employment discrimination and sexual harassment suits.",
  "1 = Monumental Weapon Empowering Victims of Sexual Harassment and Racial Discrimination to Win Meaningful Justice in Court", "10 = Trial Lawyer Bonanza Driving Up Corporate Legal Defense Costs and Forcing Fear-Based Defensive Human Resource Quotas", 2, 8, 6, 1, 9, 1);

add(1992, "1992_bill_clinton_elected_43_percent_plurality", "Bill Clinton Elected 42nd President with 43% Popular Plurality (370 Electoral Votes)", "News", "1992 (Clinton 1992 Election Victory)", "Governance & Judiciary", 1,
  "Clinton winning 32 states and 370 electoral votes, ending 12 years of Republican White House control in a three-way race with Bush (37.5%) and Perot (18.9%).",
  "1 = Resounding Grassroots Demand for Change, Economic Growth, Universal Healthcare, and Rebuilding the Great American Middle Class", "10 = Minority Plurality President Lacking a True Majority Mandate Who Will Face Stiff Resistance to Liberal Overreach from Congress", 2, 8, 7, 1, 9, 1);

add(1992, "1992_defense_peace_dividend_drawdown_accelerates", "Pentagon Accelerates Post-Cold War Active-Duty Military Troop Reductions", "News", "1992 (Military Troop Drawdowns)", "Foreign Policy & Defense", 1,
  "Defense Secretary Cheney reducing active military personnel toward 1.6 million (down 500k from 1980s peak), closing domestic bases under BRAC.",
  "1 = Sensible Realignment Downsizing Massive Cold War Armies to Free Up Federal Resources for Rebuilding Domestic Communities", "10 = Dangerous Hasty Gutting of Armed Forces Readiness In a Still Dangerous World That Will Demoralize the All-Volunteer Force", 2, 9, 4, 1, 9, 1);

// =========================================================================
// 1994 (50 Issues)
// =========================================================================
add(1994, "1994_gingrich_contract_with_america_revolution", "Newt Gingrich's 'Contract with America' & 1994 GOP Midterm Revolution", "News", "1994 (1994 Republican Revolution)", "Governance & Judiciary", 1,
  "House Republicans uniting behind a 10-point conservative legislative contract, winning 54 House seats and 8 Senate seats to seize control of Congress for the first time in 40 years.",
  "1 = Cynical Reactionary Power Grab Seeking to Dismantle 60 Years of New Deal Protections and Cut Meals for Poor Children", "10 = Historic Grassroots Earthquake Restoring Constitutional Accountability, Fiscal Discipline, and Citizen Control to Congress", 2, 10, 8, 1, 10, 1);

add(1994, "1994_clinton_health_care_plan_collapse", "Collapse of the Clinton Health Care Plan ('Harry and Louise' Ad Campaign)", "News", "1993-1994 (Clinton Health Care Defeat)", "Healthcare", 1,
  "Hillary Clinton's 1,342-page 'managed competition' health reform plan collapsing in Congress without a floor vote after devastating insurance ad campaigns.",
  "1 = Heartbreaking Tragic Defeat Caused by Corrupt Special-Interest Big Pharma and Insurance Industry Lobbying Spending", "10 = Spectacular Rejection of a Colossal Socialist Government Takeover That Would Have Rationed Care and Crushed Free Enterprise", 2, 9, 10, 1, 9, 1);

add(1994, "1994_violent_crime_control_act_1994_crime_bill", "Violent Crime Control and Law Enforcement Act of 1994 ($30B Crime Bill)", "News", "1994 (1994 Crime Bill Enactment)", "Governance & Judiciary", 1,
  "Bipartisan omnibus crime law written by Joe Biden authorizing $30B for 100,000 new community police officers (COPS), federal death penalty expansion, and 'three strikes'.",
  "1 = Tough Bipartisan Action Putting 100,000 Cops on the Beat, Banning Assault Weapons, and Slashing Violent Urban Crime Waves", "10 = Bloated Federal Social Spending Boondoggle Sinking Billions into Midnight Basketball and Federalizing Local Police Functions", 2, 8, 7, 1, 9, 1);

add(1994, "1994_federal_assault_weapons_ban_enacted", "Enactment of the 10-Year Federal Assault Weapons Ban (Public Safety Act)", "News", "1994 (Assault Weapons Ban Enacted)", "Civil Rights & Social Issues", 1,
  "Statute signed by Clinton banning the manufacture and civilian sale of 19 semi-automatic firearms with military features and high-capacity magazines over 10 rounds.",
  "1 = Proven Common-Sense Public Safety Measure Banishing Lethal Military-Style Weapons of War from Suburban Streets and Schools", "10 = Unconstitutional Second Amendment Tyranny Arbitrarily Banning Firearms Based on Cosmetic Plastic Grips and Flash Suppressors", 2, 9, 10, 1, 10, 1);

add(1994, "1994_california_proposition_187_immigrant_benefits", "California Voters Approve Proposition 187 (Denying Services to Undocumented)", "News", "1994 (Prop 187 Ballot Battle)", "Immigration", 1,
  "California voters approving Prop 187 by 59% majority, barring undocumented immigrants from public schools, non-emergency healthcare, and social welfare services.",
  "1 = Cruel Bigoted Scapegoating of Vulnerable Immigrant Families That Will Force Sick Children into Street Epidemics and Bar Schooling", "10 = Common-Sense Grassroots Self-Defense Refusing to Subsidize Illegal Border Infiltration with Hard-Earned State Taxpayer Dollars", 2, 10, 7, 1, 10, 1);

add(1994, "1994_nafta_takes_effect_zapatista_uprising", "NAFTA Takes Effect on January 1 & Zapatista Rebel Uprising in Chiapas", "News", "1994 (NAFTA Effective & Chiapas)", "Economy & Taxation", 1,
  "NAFTA taking effect eliminating continental tariffs; indigenous Zapatista rebels seize towns in southern Mexico declaring NAFTA a death sentence for indigenous farmers.",
  "1 = Unvarnished Proof That Corporate Globalization Exploits Developing World Indigenous Peasants and Destroys Domestic Jobs", "10 = Transformative Triumph for Free Enterprise Eliminating Trade Barriers and Securing North American Continental Competitiveness", 3, 8, 10, 1, 8, 1);

add(1994, "1994_uruguay_round_agreements_wto_creation", "Enactment of the Uruguay Round Agreements Act (Creation of the WTO)", "News", "1994 (WTO Creation Enacted)", "Economy & Taxation", 1,
  "Congress passing sweeping multilateral trade legislation creating the World Trade Organization (WTO) to enforce global trade rules and dispute settlements.",
  "1 = Corporate Enclosure Ceding American Democratic Sovereignty, Environmental Standards, and Labor Rights to Unelected Geneva Tribunals", "10 = Historic Rule-of-Law Framework Opening Vast Overseas Markets to American Intellectual Property and High-Tech Exports", 3, 8, 9, 1, 9, 1);

add(1994, "1994_dont_ask_dont_tell_military_policy", "Implementation of 'Don't Ask, Don't Tell' (DADT) Military Compromise", "News", "1993-1994 (DADT Implementation)", "Civil Rights & Social Issues", 1,
  "Compromise statutory policy allowing gay and lesbian service members to serve in the armed forces provided they do not disclose their sexual orientation.",
  "1 = Frustrating Half-Measure Forcing Honorable Patriotic Soldiers to Live Deceitful Double Lives Under Threat of Discharge", "10 = Pragmatic Compromise Preserving Military Unit Cohesion and Combat Morale Free from Open Homosexual Conduct in Barracks", 2, 8, 4, 1, 9, 1);

add(1994, "1994_whitewater_special_prosecutor_fiske_starr", "Whitewater Investigation: Appointment of Robert Fiske and Kenneth Starr", "News", "1994 (Whitewater Independent Counsel)", "Governance & Judiciary", 1,
  "Attorney General Reno appointing Robert Fiske, later replaced by judicial panel with Ken Starr, to probe Clintons' Arkansas real estate deals and Madison Guaranty S&L.",
  "1 = Partisan Witch Hunt Sinking Tens of Millions into Investigating Obscure 15-Year-Old Failed Arkansas Land Deals to Destroy a President", "10 = Essential Criminal Probe Unraveling Deep Financial Corruption, S&L Cronyism, and White House Political Cover-ups", 2, 9, 4, 1, 9, 1);

add(1994, "1994_paula_jones_sexual_harassment_lawsuit", "Paula Jones Files Federal Sexual Harassment Lawsuit Against Bill Clinton", "News", "1994 (Paula Jones Lawsuit Filed)", "Governance & Judiciary", 1,
  "Former Arkansas state employee Paula Jones filing federal civil rights lawsuit alleging Governor Clinton sexually propositioned and exposed himself to her in a Little Rock hotel room.",
  "1 = Politically Funded Civil Lawsuit Orchestrated by Conservative Operatives to Harass and Paralyze a Sitting President", "10 = Grave Allegations of Grotesque Abuse of Power and Sexual Harassment by an Executive Entitled to Zero Immune Protection in Court", 2, 9, 3, 1, 9, 1);

add(1994, "1994_dshea_dietary_supplements_deregulation", "Dietary Supplement Health and Education Act of 1994 (DSHEA Enactment)", "News", "1994 (DSHEA Supplement Deregulation)", "Healthcare", 1,
  "Enacting DSHEA to classify vitamins, minerals, and herbal supplements as foods rather than drugs, barring FDA from requiring pre-market safety or efficacy testing.",
  "1 = Bipartisan Freedom-of-Choice Victory Protecting Americans' Fundamental Right to Choose Natural Herbs and Dietary Vitamins", "10 = Dangerous Deregulatory Handout Shielding Multi-Billion Dollar Supplement Companies from Basic Scientific Safety and Efficacy Proof", 2, 8, 10, 2, 8, 1);

add(1994, "1994_california_desert_protection_act", "Enactment of the California Desert Protection Act of 1994", "News", "1994 (California Desert Enacted)", "Energy & Climate", 1,
  "Designating 7.6 million acres of California desert as wilderness, elevating Death Valley and Joshua Tree to National Parks, and creating Mojave National Preserve.",
  "1 = Spectacular Historic Conservation Safeguarding Fragile Desert Ecosystems, Joshua Trees, and Tortoises from Off-Road Destruction", "10 = Imperial Public Land Lockup Trampling Western Mining, Cattle Grazing, and Recreational Access Over Local County Protests", 2, 8, 8, 1, 9, 1);

add(1994, "1994_freedom_of_access_to_clinic_entrances_face", "Enactment of the Freedom of Access to Clinic Entrances (FACE) Act of 1994", "News", "1994 (FACE Act Enacted)", "Civil Rights & Social Issues", 1,
  "Establishing federal criminal penalties and civil remedies for using force, threats, or physical obstruction to injure or intimidate reproductive health patients and doctors.",
  "1 = Urgent Vital Shield Halting Violent Domestic Terror, Blockades, and Bombings Targeting Women's Healthcare Clinics", "10 = Unconstitutional Federal Attack Criminalizing Peaceful Pro-Life First Amendment Free Speech and Sidewalk Counseling", 2, 9, 6, 1, 10, 1);

add(1994, "1994_fcc_spectrum_auctions_inaugurated", "FCC Inaugurates Commercial Wireless Spectrum Bandwidth Auctions", "News", "1994 (FCC Spectrum Auctions Inception)", "Technology & Infrastructure", 2,
  "Replacing administrative hearings and lotteries with market-based public auctions for PCS cellular licenses, raising billions for the Treasury and igniting wireless telecom.",
  "1 = Brilliant Free-Market Innovation Putting Airwaves in the Hands of Efficient Telecom Builders While Raising Billions for Taxpayers", "10 = Corporate Spectrum Enclosure Allowing Giant Telecom Conglomerates to Monopolize Public Airwaves at the Expense of Small Operators", 2, 8, 10, 2, 8, 1);

add(1994, "1994_rwandan_genocide_us_and_un_inaction", "Rwandan Genocide (800,000 Tutsis Slaughtered Amid Western Inaction)", "News", "1994 (Rwandan Genocide Catastrophe)", "Foreign Policy & Defense", 1,
  "Hutu extremists slaughtering 800,000 Tutsis and moderate Hutus in 100 days; U.S. and UN refuse to intervene or jam hate radio broadcasts, scarred by Mogadishu.",
  "1 = Shaming Moral Failure of American and International Leadership Failing to Act to Halt Unvarnished Genocide in Africa", "10 = Tragic Inter-Ethnic Slaughter Where Direct American Unilateral Military Intervention Was Neither Feasible Nor Supported by Vital National Interests", 2, 8, 3, 1, 8, 1);

add(1994, "1994_operation_uphold_democracy_haiti", "Operation Uphold Democracy: U.S. Military Intervention in Haiti", "News", "1994 (Haiti Military Intervention)", "Foreign Policy & Defense", 1,
  "Clinton deploying 20,000 U.S. troops to Port-au-Prince following eleventh-hour Carter-Powell negotiations, ousting military dictator Cedras and restoring President Aristide.",
  "1 = Noble Triumph for Regional Democracy and Human Rights Restoring Haiti's Freely Elected President Without Firing a Shot", "10 = Unconstitutional Gunboat Nation-Building Deploying American Troops to Re-install an Errant Leftist Politician in an Impoverished Neighbor", 2, 8, 4, 1, 8, 1);

add(1994, "1994_battle_of_mogadishu_black_hawk_down_aftermath", "Battle of Mogadishu ('Black Hawk Down') Aftermath & Total U.S. Somalia Exit", "News", "1993-1994 (Mogadishu Aftermath & Withdrawal)", "Foreign Policy & Defense", 1,
  "Following the deaths of 18 elite Army Rangers and delta operators in fierce urban combat in Mogadishu, Clinton orders all American combat forces withdrawn from Somalia.",
  "1 = Prudent Decisive Decision Halting an Unwinnable Humanitarian Mission That Devolved into Urban Guerrilla Warfare", "10 = Humiliating Cut-and-Run Retreat That Emboldened Islamic Terrorists and Rogue Warlords to Believe America Lacks the Will to Fight", 2, 9, 3, 1, 9, 1);

add(1994, "1994_north_korea_agreed_framework_nuclear_freeze", "U.S.-North Korea Agreed Framework (Freezing Yongbyon Graphite Reactors)", "News", "1994 (Agreed Framework Enacted)", "Foreign Policy & Defense", 1,
  "Accord negotiated by Jimmy Carter where North Korea agreed to freeze and dismantle plutonium graphite reactors in exchange for two proliferation-resistant light-water reactors and fuel oil.",
  "1 = Essential Diplomatic Breakthrough Averting an Imminent Second Korean War and Freezing Pyongyang's Plutonium Production", "10 = Dangerous Appeasement and Blackmail Rewarding a Rogue Tyrannical Marxist Regime That Will Inevitably Cheat in Secret", 2, 8, 4, 1, 9, 1);

add(1994, "1994_cuban_rafter_crisis_wet_foot_dry_foot", "Cuban Rafter Crisis (Balsero Influx & End of Automatic Asylum Parole)", "News", "1994 (Balsero Crisis & Accord)", "Immigration", 1,
  "Thirty thousand Cubans fleeing by makeshift rafts across the Florida Straits; Clinton reverses 30-year policy, intercepting rafters at sea and holding them at Guantanamo.",
  "1 = Realistic Humane Policy Ending Hazardous Sea Crossings and Establishing Orderly Legal Emigration Pathways with Havana", "10 = Heartless Betrayal of Desperate Victims of Castro's Brutal Tyranny Denying Them Freedom and Barring Asylum", 2, 8, 5, 1, 9, 1);

add(1994, "1994_major_league_baseball_strike_world_series_cancelled", "1994 Major League Baseball Strike (Cancellation of the World Series)", "News", "1994 (Baseball Strike Crisis)", "Labor & Welfare", 2,
  "Players striking over owners' proposed salary cap, resulting in the first cancellation of the World Series in 90 years and alienating millions of sports fans.",
  "1 = Principled Working-Class Union Defense Against Billionaire Monopolist Team Owners Seeking to Depress Player Market Value", "10 = Disgraceful Display of Greed by Millionaire Athletes and Billionaire Owners Trampling America's Sacred National Pastime", 2, 7, 8, 1, 8, 1);

add(1994, "1994_oj_simpson_murder_trial_and_bronco_chase", "O.J. Simpson Double-Murder Trial & Low-Speed White Bronco Highway Chase", "News", "1994-1995 (O.J. Simpson Media Spectacle)", "Governance & Judiciary", 1,
  "Ninety-five million Americans watching live highway pursuit of NFL hero O.J. Simpson following the murders of Nicole Brown Simpson and Ronald Goldman, dominating national media.",
  "1 = Tragic Domestic Violence Epidemic and Media Circus Distorting Real Public Issues While Exposing Deep Racial Polarization Over the Justice System", "10 = Graphic Reality Check on Celebrity Privilege, Criminal Justice Theater, and Need for Strict Law and Order", 2, 8, 5, 1, 8, 1);

add(1994, "1994_violence_against_women_act_vawa", "Enactment of the Violence Against Women Act of 1994 (VAWA)", "News", "1994 (VAWA Enacted inside Crime Bill)", "Civil Rights & Social Issues", 1,
  "Historic legislation drafted by Joe Biden providing $1.6 billion for investigation and prosecution of violent crimes against women, shelters, and rape crisis centers.",
  "1 = Monumental Civil Rights Victory Providing Life-Saving Resources, Shelters, and Criminal Tools to Combat Domestic Abuse and Rape", "10 = Good Protections for Victims, Provided Flawed Civil Remedies Do Not Unconstitutionally Federalize Local Domestic Relations Tort Law", 2, 8, 5, 1, 8, 1);

add(1994, "1994_goals_2000_educate_america_act", "Enactment of the Goals 2000: Educate America Act", "News", "1994 (Goals 2000 Enactment)", "Education", 2,
  "Establishing voluntary national education performance standards, National Education Standards and Improvement Council, and grant incentives for states.",
  "1 = Vital Strategic Investment Raising Academic Standards and Equipping American Classrooms for the 21st Century Global Economy", "10 = Dangerous Step Toward Federal Nationalization of School Curriculums and Usurpation of Local School Board Governance", 2, 8, 8, 1, 9, 1);

add(1994, "1994_riegle_neal_interstate_banking_efficiency_act", "Enactment of the Riegle-Neal Interstate Banking and Branching Efficiency Act", "News", "1994 (Interstate Banking Enacted)", "Economy & Taxation", 2,
  "Repealing the 1927 McFadden Act and 1956 Douglas Amendment to permit nationwide interstate bank branching and bank holding company acquisitions.",
  "1 = Modern Pro-Consumer Reform Allowing Nationwide Seamless Banking, Automated Clearing, and Squeezing Out Inefficiencies", "10 = Dangerous Deregulation Spurring Megabank Consolidation That Swallows Independent Local Community Banks and Centralizes Financial Risk", 2, 8, 10, 2, 8, 1);

add(1994, "1994_social_security_administration_independence_act", "Social Security Administration Independence Act of 1994", "News", "1994 (SSA Independent Agency)", "Labor & Welfare", 2,
  "Removing the Social Security Administration from the Department of Health and Human Services (HHS) and establishing it as an independent executive agency.",
  "1 = Bipartisan Elevation Protecting the Sacred Social Security Trust Fund from Partisan Interference and Executive Meddling", "10 = Sound Administrative Realignment Guaranteeing Professional, Fiduciary Management of America's Premier Retirement Insurance System", 2, 8, 7, 1, 8, 1);

add(1994, "1994_orange_county_municipal_bankruptcy", "Orange County, California Files Largest Municipal Bankruptcy in U.S. History", "News", "1994 (Orange County Derivatives Collapse)", "Economy & Taxation", 1,
  "Wealthy conservative county losing $1.7 billion on leveraged interest-rate derivatives under Treasurer Robert Citron, forcing municipal bankruptcy and service cuts.",
  "1 = Graphic Wakeup Call Exposing Unregulated Wall Street Complex Financial Derivatives Seducing Public Treasuries into Disastrous Speculation", "10 = Gross Local Political Mismanagement and Failure of County Supervisors to Audit and Oversee Speculative Public Investment Pools", 2, 8, 9, 1, 8, 1);

add(1994, "1994_mexican_peso_crisis_emergency_bailout", "Mexican Peso Collapse & Clinton Orchestrates $20 Billion Emergency Rescue", "News", "1994-1995 (Mexican Peso Bailout)", "Economy & Taxation", 1,
  "Sudden devaluation of the peso threatening Mexican sovereign default; Clinton bypasses congressional resistance to tap $20B from the Exchange Stabilization Fund.",
  "1 = Essential Decisive Action Halting Financial Contagion That Would Have Triggered Massive Illegal Border Infiltration and U.S. Job Losses", "10 = Outrageous Executive Branch Bailout of Wall Street Speculators and Incompetent Mexican Politicians on the U.S. Taxpayer Dime", 2, 8, 9, 1, 9, 1);

add(1994, "1994_clean_air_act_employee_trip_reduction_revolt", "Suburban Commuter Backlash Against Clean Air Act Employee Trip Reduction Rules", "News", "1994 (Employee Trip Reduction Backlash)", "Energy & Climate", 2,
  "EPA rules requiring employers with 100+ workers in severe ozone areas to increase average passenger occupancy by carpooling or face heavy fines, sparking business revolt.",
  "1 = Necessary Cooperative Commuter Strategy to Clear Deadly Summer Smog and Reduce Highway Carbon Emissions", "10 = Absurd Bureaucratic Tyranny Turning Employers into Nanny-State Police Micromanaging How Hardworking Citizens Commute to Work", 2, 8, 9, 1, 9, 1);

add(1994, "1994_national_voter_registration_act_motor_voter", "Implementation of the National Voter Registration Act of 1993 ('Motor Voter')", "News", "1994-1995 (Motor Voter Implementation)", "Governance & Judiciary", 1,
  "Requiring states to offer voter registration opportunities at motor vehicle departments, public assistance offices, and by mail; GOP governors resist in court.",
  "1 = Historic Democratic Expansion Making Voter Registration Routine and Accessible for Millions of Working-Class Citizens", "10 = Unfunded Federal Mandate Inviting Rampant Voter Registration Fraud and Bloating Voter Rolls with Ineligible Non-Citizens", 2, 8, 5, 1, 9, 1);

add(1994, "1994_jack_in_the_box_e_coli_outbreak_meat_safety", "Jack in the Box E. Coli Outbreak & USDA Meat Inspection Modernization", "News", "1993-1994 (E. Coli Food Safety Overhaul)", "Agriculture & Food", 1,
  "Four children dead and 700 sickened by undercooked contaminated hamburgers; USDA moves to discard 90-year-old 'poke-and-sniff' inspection in favor of scientific HACCP testing.",
  "1 = Imperative Scientific Action Requiring Modern Microbiological Testing to Exterminate Lethal E. Coli Bacteria from Commercial Meat", "10 = Support Rigorous Food Safety While Ensuring Flexible Hazard-Analysis Protocols Do Not Crush Small Independent Community Slaughterhouses", 2, 8, 8, 1, 8, 1);

add(1994, "1994_fda_david_kessler_targets_tobacco_nicotine", "FDA Commissioner David Kessler Initiates Action to Regulate Tobacco Nicotine as a Drug", "News", "1994 (FDA Tobacco Regulation Genesis)", "Healthcare", 1,
  "Kessler asserting FDA regulatory jurisdiction over cigarettes, arguing tobacco companies manipulate nicotine levels to sustain chemical addiction.",
  "1 = Historic Public Health Courage Breaking Big Tobacco's Century of Lies and Protecting American Children from Deadly Nicotine Addiction", "10 = Lawless Administrative Power Grab Usurping Congressional Intent; Congress Never Authorized FDA to Regulate or Ban Tobacco", 2, 8, 9, 1, 9, 1);

add(1994, "1994_netscape_navigator_released_web_boom", "Netscape Navigator 1.0 Released (Igniting the Commercial Web Browser Boom)", "News", "1994 (Netscape & Web Revolution)", "Technology & Infrastructure", 1,
  "Marc Andreessen and Jim Clark releasing Netscape Navigator, making the World Wide Web graphical and accessible, sparking explosive dot-com commercial growth.",
  "1 = Revolutionary Milestone Democratizing Information, Empowering Free Expression, and Launching the Greatest Economic Expansion in History", "10 = Splendid Free-Market Silicon Valley Innovation Flourishing in the Complete Absence of Stifling Government Regulation", 2, 7, 9, 2, 8, 1);

add(1994, "1994_balanced_budget_amendment_contract_anchor", "Balanced Budget Constitutional Amendment Centerpiece of GOP Contract", "News", "1994 (Balanced Budget Amendment Mandate)", "Economy & Taxation", 1,
  "Gingrich Republicans making a balanced budget constitutional amendment Article 1 of the Contract with America, pledging an immediate floor vote upon taking power.",
  "1 = Destructive Economic Straitjacket That Would Ban Emergency Counter-Cyclical Spending and Force Catastrophic Social Security Benefit Cuts", "10 = Indispensable Constitutional Restraint to Halt 40 Years of Spendthrift Big-Government Deficits and Protect Future Generations", 2, 10, 10, 1, 10, 1);

add(1994, "1994_congressional_reform_proxy_voting_abolition", "GOP Pledges Abolition of Committee Proxy Voting and Term Limits for Chairmen", "News", "1994 (House Rules Reform)", "Governance & Judiciary", 2,
  "Contract with America promising to end 40 years of autocratic Democratic committee chair rule by banning proxy voting and imposing 6-year term limits on committee chairs.",
  "1 = Sound Internal Modernization, Though Gutting Committee Seniority Risks Empowering Centralized Speaker Leadership at the Expense of Deliberation", "10 = Essential Democratic Sunlight Restoring Floor Accountability and Smashing Corrupt Committee Baronies in the People's House", 2, 9, 8, 1, 9, 1);

add(1994, "1994_babbitt_grazing_fee_western_rancher_revolt", "Interior Secretary Bruce Babbitt's Public Land Grazing Fee Reforms & Rancher Revolt", "News", "1993-1994 (Babbitt Grazing Wars)", "Energy & Climate", 1,
  "Babbitt proposing to double below-market public land livestock grazing fees and enforce strict rangeland ecological standards, sparking Western Senate filibusters.",
  "1 = High Time Corporate Cattle Barons Paid Fair Market Value for Public Lands and Halted Severe Riparian Habitat Overgrazing", "10 = Vicious War on the West Seeking to Drive Generational Family Cattle Ranchers Off Public Lands to Satisfy Radical Environmentalists", 2, 8, 8, 1, 9, 1);

add(1994, "1994_kiryas_joel_v_grumet_establishment_clause", "Board of Education of Kiryas Joel v. Grumet (Religious School District)", "News", "1994 (Kiryas Joel School Ruling)", "Education", 2,
  "Supreme Court ruling 6-3 that New York statute carving out a public school district conforming precisely to a Hasidic Jewish village violates the Establishment Clause.",
  "1 = Essential Defense of Secular Public Education Barring the State from Delegating Civic Power to Distinct Religious Sects", "10 = Heartless Insensitivity to Severely Disabled Hasidic Children Needing Special Education Free from Cultural Alienation", 2, 8, 4, 1, 9, 1);

add(1994, "1994_madsen_v_womens_health_clinic_buffer_zones", "Madsen v. Women's Health Center (Abortion Clinic Buffer Zones Supreme Court)", "News", "1994 (Clinic Buffer Zones Ruling)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 6-3 (Rehnquist opinion) upholding a 36-foot buffer zone around a Florida abortion clinic to protect patient access while striking a 300-foot no-approach zone.",
  "1 = Balanced Necessary Protection Safeguarding Vulnerable Medical Patients from Harassment and Physical Terror at Clinic Doors", "10 = Unconstitutional Censorship Zone Restricting Peaceful First Amendment Sidewalk Counselors from Offering Alternatives to Abortion", 2, 8, 5, 1, 9, 1);

add(1994, "1994_userra_veterans_employment_rights_act", "Enactment of the Uniformed Services Employment and Reemployment Rights Act (USERRA)", "News", "1994 (USERRA Enacted)", "Labor & Welfare", 2,
  "Strengthening federal protections guaranteeing military reservists and National Guard members the right to return to civilian civilian jobs upon completing military duty.",
  "1 = Sacred Moral Obligation Guaranteeing Our Citizen-Soldiers Never Suffer Economic Penalty or Job Loss for Serving Their Country", "10 = Essential Bipartisan Shield Protecting the Readiness of the Reserve Components That Form the Backbone of National Defense", 2, 8, 7, 1, 8, 1);

add(1994, "1994_federal_crop_insurance_reform_act", "Federal Crop Insurance Reform Act of 1994 (Mandatory Risk Protection)", "News", "1994 (Crop Insurance Reform)", "Agriculture & Food", 2,
  "Overhauling USDA crop insurance, mandating producers purchase catastrophic risk protection (CAT) to qualify for farm commodity program benefits, curbing ad hoc disaster bills.",
  "1 = Rational Sound Reform Phasing Out Multi-Billion Dollar Ad Hoc Disaster Handouts in Favor of Standardized Agricultural Insurance", "10 = Coercive Mandate Forcing Family Farmers into Complex Government Insurance Contracts to Retain Baseline Farm Support", 2, 7, 8, 1, 8, 1);

add(1994, "1994_federal_acquisition_streamlining_act_fasa", "Enactment of the Federal Acquisition Streamlining Act of 1994 (FASA)", "News", "1994 (FASA Procurement Reform)", "Governance & Judiciary", 2,
  "Spearheaded by Al Gore's National Performance Review, eliminating hundreds of pages of procurement regulations for commercial off-the-shelf purchases under $100,000.",
  "1 = Brilliant Common-Sense Reinvention of Government Cutting Bureaucratic Red Tape and Saving Taxpayers Billions in Procurement", "10 = Sound Deregulation Enabling Federal Agencies to Purchase Commercial Goods at Everyday Market Prices Without Onerous Bureaucracy", 2, 8, 9, 1, 8, 1);

add(1994, "1994_fed_greenspan_doubles_interest_rates", "Federal Reserve Hikes Benchmark Rates from 3% to 6% in Aggressive Preemptive Strike", "News", "1994 (Fed 1994 Rate Shock)", "Economy & Taxation", 1,
  "Alan Greenspan orchestrating six aggressive rate hikes in 12 months, including a rare 75-basis-point increase, to strangle inflation before it emerges, roiling bond markets.",
  "1 = Overly Aggressive Tightening Threatening Middle-Class Job Recovery and Crushing Municipal Bond Portfolios Like Orange County", "10 = Masterful Preemptive Central Bank Statesmanship Successfully Engineering a Flawless Soft Landing and Ensuring Long-Term Stability", 2, 8, 9, 1, 8, 2);

add(1994, "1994_white_house_travelgate_and_vince_foster", "White House Travel Office Controversy ('Travelgate') & Vince Foster Inquiries", "News", "1993-1994 (Travelgate & Foster Inquiries)", "Governance & Judiciary", 1,
  "Abrupt firing of seven career White House travel office staffers to install Clinton cronies; Deputy White House Counsel Vince Foster commits suicide in Fort Marcy Park.",
  "1 = Sad Bureaucratic Misstep Exploited by Unscrupulous Partisan Conspiracy Theorists Slandering a Grieving Public Servant's Memory", "10 = Sordid Display of Arkansas Cronyism, FBI Weaponization, and Cover-ups Reaching Directly into the First Lady's Inner Circle", 2, 9, 4, 1, 9, 1);

add(1994, "1994_clean_water_act_unfunded_mandates_deadlock", "Clean Water Act Reauthorization Deadlocked Over Unfunded Municipal Mandates", "News", "1994 (Clean Water Unfunded Mandates Standoff)", "Energy & Climate", 1,
  "Mayors and county executives banding together to block Clean Water Act renewal unless Congress provides full federal cash funding for sewage stormwater upgrades.",
  "1 = Essential Environmental Duty: Cities Cannot Be Permitted to Evade Clean Water Mandates and Dump Toxic Sewage into Downstream Rivers", "10 = Common-Sense Local Revolt Against Arrogant Federal Unfunded Mandates Forcing Cities to Hike Regressive Water Bills", 2, 8, 9, 1, 9, 1);

add(1994, "1994_endangered_species_act_moratorium_push", "Congressional Push for a Statutory Moratorium on New Endangered Species Listings", "News", "1994 (ESA Listing Moratorium Drive)", "Energy & Climate", 1,
  "Western lawmakers pushing to halt new ESA species listings following the spotted owl and salmon rulings, arguing property values are being destroyed without compensation.",
  "1 = Destructive Assault on Biological Diversity Pushing Fragile American Species into Extinction to Benefit Commercial Developers", "10 = Urgent Protection Safeguarding Private Property Rights from Totalitarian Federal Biologists Confiscating Land Value", 2, 8, 9, 1, 10, 1);

add(1994, "1994_welfare_reform_end_as_we_know_it_clash", "Debate Over Clinton's 'Work First' Welfare Reform vs House GOP Two-Year Hard Limits", "News", "1994 (Welfare Reform Legislative Genesis)", "Labor & Welfare", 1,
  "Clinton proposing two-year job training followed by mandatory public work; House Republicans introduce Contract provision cutting off benefits after two years entirely.",
  "1 = Transformative Compassionate Reform Investing in Job Training and Child Care to Help Families Move from Welfare to Dignified Work", "10 = Strict Work Requirements and Hard Federal Time Limits Are Mandatory to Break Generational Dependence and Rebuild Family Integrity", 2, 9, 8, 1, 10, 1);

add(1994, "1994_clinton_timber_compromise_nwfp", "President Clinton's Northwest Forest Plan (NWFP - 80% Timber Harvest Cut)", "News", "1993-1994 (Northwest Forest Plan Enacted)", "Energy & Climate", 1,
  "Clinton unveiling scientific compromise slashing federal timber sales by 80% across 24 million acres while providing $1.2 billion in economic adjustment aid to timber towns.",
  "1 = Balanced Science-Based Ecosystem Management Rescuing Ancient Old-Growth Forests and Salmon Watersheds from Extinction", "10 = Catastrophic Economic Death Sentence Shuttering Hundreds of Family Sawmills and Decimating Generations-Old Heartland Logging Towns", 2, 8, 8, 1, 9, 1);

add(1994, "1994_supercomputer_export_controls_relaxation", "Commerce Department Relaxes Commercial Export Controls on Supercomputers", "News", "1994 (Supercomputer Export Decontrol)", "Technology & Infrastructure", 2,
  "Clinton administration raising computing power thresholds (MTOPS) for export licenses, allowing American computer makers to sell workstations to foreign commercial buyers.",
  "1 = Essential Free-Market Competitiveness Permitting American High-Tech Computer Firms to Compete in Rapidly Growing Global Markets", "10 = Dangerous Proliferation Risk Supplying Advanced Computing Hardware That Foreign Dictators Can Repurpose for Nuclear Warhead Simulations", 2, 8, 9, 1, 8, 1);

add(1994, "1994_unfunded_mandates_reform_act_drafting", "Bipartisan Movement Drafting the Unfunded Mandates Reform Act (UMRA)", "News", "1994 (UMRA Movement Genesis)", "Governance & Judiciary", 2,
  "Bipartisan coalition of governors and mayors teaming up with congressional Republicans to draft legislation requiring CBO cost estimates on federal mandates over $50M.",
  "1 = Sound Restraint Ensuring Congress Accounts for Local Fiscal Realities, Provided Civil Rights and Public Health Protections Are Preserved", "10 = Landmark Defense of Tenth Amendment Federalism Halting Arrogant Washington Politicians from Dictating Local Municipal Spending", 2, 9, 9, 1, 9, 1);

add(1994, "1994_government_performance_and_results_act", "Rollout of the Government Performance and Results Act of 1993 (GPRA)", "News", "1993-1994 (GPRA Performance Metrics)", "Governance & Judiciary", 3,
  "Mandating all federal agencies develop 5-year strategic plans, annual performance goals, and measurable outcome indicators to justify budget requests.",
  "1 = Essential Modern Management Tool Holding Entrenched Federal Bureaucrats Accountable for Delivering Measurable Results to Citizens", "10 = Paperwork Exercise Where Bureaucracies Generate Mountains of Self-Serving Metrics to Rationalize Budget Expansions", 2, 7, 7, 1, 7, 1);

add(1994, "1994_improving_americas_schools_act_esea", "Improving America's Schools Act of 1994 (Reauthorizing ESEA Title I)", "News", "1994 (IASA ESEA Reauthorization)", "Education", 2,
  "Overhauling Title I funding to coordinate federal aid with state content standards and mandating math and reading assessments for disadvantaged students.",
  "1 = Progressive Modernization Ensuring Impoverished Inner-City and Rural Students Are Held to the Same High Standards as Suburban Students", "10 = Bureaucratic Centralization Mandating Standardized State Testing Regimes That Erode Local Teacher Autonomy", 2, 8, 8, 1, 8, 1);

// =========================================================================
// 1996 (50 Issues)
// =========================================================================
add(1996, "1996_welfare_reform_prwora_tanf_block_grants", "Personal Responsibility and Work Opportunity Reconciliation Act of 1996 (PRWORA)", "News", "1996 (PRWORA Welfare Reform)", "Labor & Welfare", 1,
  "Clinton signing landmark bipartisan law ending 61-year-old AFDC federal entitlement, creating TANF block grants with strict work requirements and 5-year lifetime limits.",
  "1 = Cruel Betrayal of Poor Children and Single Mothers That Pushes Millions into Extreme Destitution and Low-Wage Servitude", "10 = Historic Bipartisan Triumph Ending Generational Welfare Dependency, Restoring Work Dignity, and Promoting Family Self-Reliance", 2, 9, 8, 1, 10, 1);

add(1996, "1996_defense_of_marriage_act_doma_enacted", "Enactment of the Defense of Marriage Act of 1996 (DOMA)", "News", "1996 (DOMA Enacted)", "Civil Rights & Social Issues", 1,
  "Passed overwhelmingly by Congress (85-14 in Senate) and signed by Clinton, defining marriage for federal purposes as one man and one woman and shielding states from recognizing same-sex marriages.",
  "1 = Cowardly Discriminatory Law Codifying Bigotry and Denying Loving Same-Sex Couples Fundamental Federal Equality and Dignity", "10 = Essential Defense of the Sacred Millennia-Old Definition of Marriage Shielding Society from Radical Judicial Activism", 2, 9, 5, 1, 10, 1);

add(1996, "1996_california_proposition_209_affirmative_action", "California Voters Approve Proposition 209 (Banning State Affirmative Action)", "News", "1996 (Prop 209 Civil Rights Initiative)", "Civil Rights & Social Issues", 1,
  "California voters passing Prop 209 by 55% majority, barring the state from discriminating against or granting preferential treatment to any individual based on race, sex, or ethnicity.",
  "1 = Devastating Setback Reversing Decades of Civil Rights Progress and Slashing Black and Latino Admissions at Top UC Campuses", "10 = True Fulfillment of Martin Luther King Jr.'s Dream of a Colorblind Society Judging Citizens on Content of Character, Not Skin Color", 2, 9, 7, 1, 10, 1);

add(1996, "1996_telecommunications_act_of_1996_deregulation", "Enactment of the Telecommunications Act of 1996 (Sweeping Telecom Overhaul)", "News", "1996 (1996 Telecom Act Enacted)", "Technology & Infrastructure", 1,
  "First major telecom overhaul in 62 years, removing barriers between local and long-distance phone markets, deregulating media cross-ownership, and requiring TV V-Chips.",
  "1 = Dangerous Corporate Consolidation Permitting Giant Media Megamergers That Homogenize News and Squeeze Out Independent Voices", "10 = Visionary Free-Market Deregulation Unleashing Multi-Billion Dollar Private Investments in Broadband, Wireless, and Digital Convergence", 2, 8, 10, 2, 8, 1);

add(1996, "1996_section_230_communications_decency_act", "Enactment of Section 230 of the Communications Decency Act", "News", "1996 (Section 230 Inception)", "Technology & Infrastructure", 1,
  "Adding 26 words to federal law protecting online interactive services from liability for third-party user content: 'No provider... shall be treated as the publisher or speaker.'",
  "1 = Foundational Magna Carta of the Internet Unleashing Global Free Expression, Innovative Web Platforms, and Modern Search Engines", "10 = Broad Corporate Immunity Shielding Giant Big Tech Monopolies from Any Liability for Online Harms, Slander, and Defamation", 2, 8, 10, 2, 8, 1);

add(1996, "1996_aclu_v_reno_online_indecency_struck_down", "ACLU v. Reno: Federal Courts Strike Down Communications Decency Act Online Indecency", "News", "1996 (CDA Online Indecency Injunction)", "Governance & Judiciary", 1,
  "Three-judge federal panel issuing landmark injunction against CDA provisions criminalizing online 'indecent' speech, ruling the internet is entitled to the highest First Amendment protection.",
  "1 = Magnificent Defense of Free Speech Affirming the Internet Is the Most Participatory Democratic Marketplace of Ideas Ever Created", "10 = Chilling Evisceration of Common-Sense Standards Leaving Innocent American Children Vulnerable to Hardcore Online Pornography", 2, 8, 1, 1, 9, 1);

add(1996, "1996_federal_government_shutdowns_clintongingrich", "1995-1996 Federal Government Shutdowns (28 Days of Standoff & Backlash)", "News", "1995-1996 (Government Shutdown Crisis)", "Economy & Taxation", 1,
  "Two shutdowns totaling 28 days as Gingrich and Clinton battle over Medicare, Medicaid, and education budgets; Clinton's vetoes win public opinion victory, turning Gingrich into villain.",
  "1 = Principled Presidential Stand Protecting Medicare, Medicaid, and Public Schools from Reckless Extreme GOP Budget Cuts", "10 = Unprecedented Executive Demagoguery Orchestrated by Clinton to Scare Seniors and Sabotage a Real 7-Year Balanced Budget", 2, 10, 9, 1, 10, 1);

add(1996, "1996_antiterrorism_effective_death_penalty_act_aedpa", "Antiterrorism and Effective Death Penalty Act of 1996 (AEDPA)", "News", "1996 (AEDPA Enacted post-Oklahoma City)", "Governance & Judiciary", 1,
  "Passed following Oklahoma City bombing, drastically restricting federal habeas corpus review of state death row appeals and establishing a 1-year filing statute of limitations.",
  "1 = Dangerous Destruction of the Great Writ of Habeas Corpus Risking the Execution of Actually Innocent People by Barring Federal Review", "10 = Essential Reform Ending Decades of Endless, Frivolous Legal Appeals by Murderers and Bringing Finality and Justice to Crime Victims", 2, 9, 6, 1, 9, 1);

add(1996, "1996_hipaa_health_insurance_portability_accountability", "Enactment of HIPAA (Health Insurance Portability & Accountability Act)", "News", "1996 (HIPAA Enacted)", "Healthcare", 1,
  "Bipartisan Kennedy-Kassebaum statute guaranteeing workers can maintain health coverage when switching jobs, restricting pre-existing condition exclusions, and creating privacy rules.",
  "1 = Compassionate Bipartisan Lifeline Ending 'Job Lock' and Ensuring Hardworking Families Keep Health Insurance When Changing Careers", "10 = Sound Portability Protections, Provided Strict Medical Privacy Rules Do Not Stifle Digital Health Efficiency with Heavy Paperwork", 2, 8, 8, 1, 8, 1);

add(1996, "1996_food_quality_protection_act_fqpa", "Enactment of the Food Quality Protection Act of 1996 (FQPA)", "News", "1996 (FQPA Enacted)", "Agriculture & Food", 1,
  "Unanimously passed legislation replacing the 1958 Delaney Clause with a single health-based 'reasonable certainty of no harm' standard considering aggregate infant pesticide risks.",
  "1 = Historic Scientific Milestone Guaranteeing America's Commercial Food Supply and Baby Foods Are Safe from Hazardous Pesticide Residues", "10 = Sensible Regulatory Modernization Replacing Rigid Zero-Risk Delaney Rules with Sound Science-Based Risk Assessment", 2, 8, 8, 1, 8, 1);

add(1996, "1996_freedom_to_farm_act_fair_act", "Federal Agriculture Improvement and Reform Act of 1996 ('Freedom to Farm')", "News", "1996 (Freedom to Farm Enacted)", "Agriculture & Food", 1,
  "Overhauling 60 years of New Deal farm programs, replacing acreage supply controls and price supports with decoupled, declining direct 'market transition' payments.",
  "1 = Dangerous Free-Market Scheme Tearing Away the Generational Safety Net and Leaving Family Farmers at the Mercy of Crashing Global Prices", "10 = Visionary Free-Market Agricultural Policy Freeing American Farmers from Washington Production Quotas to Plant for World Demand", 2, 8, 10, 1, 8, 1);

add(1996, "1996_safe_drinking_water_act_amendments_ccr", "Safe Drinking Water Act Amendments of 1996 (Drinking Water Revolving Fund & CCRs)", "News", "1996 (SDWA 1996 Enacted)", "Energy & Climate", 1,
  "Creating the Drinking Water State Revolving Loan Fund ($1B/year) and mandating annual Consumer Confidence Reports mailed to all tap water consumers disclosing water quality.",
  "1 = Essential Modernization Helping Small Communities Modernize Water Filtration and Empowering Families with Transparent Drinking Water Facts", "10 = Sound Cost-Effective Infrastructure Financing Grounded in Peer-Reviewed Science and Relief for Small Municipal Systems", 2, 8, 8, 1, 8, 1);

add(1996, "1996_dayton_peace_accords_bosnia_deployment", "Implementation of the Dayton Peace Accords & Deployment of 20,000 U.S. Troops to Bosnia", "News", "1995-1996 (Bosnia NATO Deployment)", "Foreign Policy & Defense", 1,
  "Clinton deploying 20,000 American NATO peacekeepers to enforce the Dayton Accords ending the bloody 3-year Bosnian War, despite congressional skepticism.",
  "1 = Noble Superpower Leadership Halting Brutal Ethnic Genocide in the Heart of Europe and Securing a Fragile Multi-Ethnic Peace", "10 = Perilous Entanglement in Centuries-Old Balkan Hatreds Putting American Soldiers in Harm's Way with No Vital National Interest", 2, 9, 4, 1, 8, 1);

add(1996, "1996_helms_burton_act_cuban_liberty_act", "Enactment of the Helms-Burton Act (Cuban Liberty and Democratic Solidarity Act)", "News", "1996 (Helms-Burton Enacted)", "Foreign Policy & Defense", 1,
  "Passed following Cuban MiGs shooting down two unarmed Brothers to the Rescue civilian planes; codifying the Cuban embargo and allowing U.S. citizens to sue foreign firms trafficking in confiscated property.",
  "1 = Counter-Productive Punitive Statute Antagonizing Key European and Canadian Allies While Failing to Dislodge Castro's Grip", "10 = Decisive Moral Retribution Striking at Fidel Castro's Murderous Dictatorship and Punishing Foreign Firms Exploiting Stolen American Property", 2, 9, 4, 1, 10, 1);

add(1996, "1996_iran_and_libya_sanctions_act_ilsa", "Enactment of the Iran and Libya Sanctions Act of 1996 (ILSA)", "News", "1996 (ILSA Secondary Sanctions)", "Foreign Policy & Defense", 1,
  "Imposing mandatory secondary sanctions on foreign energy corporations investing more than $20 million in the petroleum and natural gas sectors of Iran and Libya.",
  "1 = Dangerous Secondary Sanctions Provoking Trade Retaliation from European Allies and Weakening Multilateral Counter-Terrorism Cooperation", "10 = Indispensable Financial Chokehold Cutting Off Petro-Dollars That Rogue Tehran and Tripoli Regimes Funnel into International Terrorism", 2, 8, 4, 1, 9, 1);

add(1996, "1996_bob_dole_15_percent_tax_cut_platform", "Bob Dole's 15% Across-the-Board Income Tax Cut Campaign Platform", "News", "1996 (Bob Dole 15% Tax Cut Platform)", "Economy & Taxation", 1,
  "GOP nominee Bob Dole reversing his lifetime deficit-hawk stance to propose a 15% across-the-board income tax cut ($548B) and $500-per-child tax credit to reignite growth.",
  "1 = Desperate Election-Year Reversal Fabricating Deficit-Exploding Supply-Side Gimmicks That Dole Himself Mocked for Decades", "10 = Essential Pro-Growth Tax Relief Putting Money Back into Family Paychecks to Spark Productivity and Free Working Americans from High Taxes", 2, 9, 10, 1, 9, 1);

add(1996, "1996_ross_perot_reform_party_presidential_bid", "Ross Perot's Reform Party Presidential Candidacy (8% Popular Vote)", "News", "1996 (Reform Party Presidential Campaign)", "Governance & Judiciary", 1,
  "Perot founding the Reform Party, qualifying for federal matching funds, and winning 8 million votes on an anti-corruption, anti-free trade, and campaign finance reform platform.",
  "1 = Important Independent Movement Giving Voice to Millions of Citizens Disillusioned by Partisan Gridlock and Wall Street Globalization", "10 = Fading Populist Campaign Denied Debate Stage Access, Reflecting Voter Satisfaction with Low Unemployment and Balanced Budgets", 3, 7, 7, 2, 8, 1);

add(1996, "1996_dnc_chinagate_foreign_campaign_donations", "1996 Campaign Finance Scandal: 'Chinagate' Foreign Donations to DNC", "News", "1996-1997 (Chinagate Campaign Finance Scandal)", "Governance & Judiciary", 1,
  "Revelations that DNC fundraisers John Huang and Charlie Trie funneled millions in illegal foreign contributions from Indonesian, Chinese, and Buddhist temple sources into Clinton re-election.",
  "1 = Deeply Troubling Display of Big-Money Election Greed Demanding Sweeping Bipartisan Campaign Finance Reform", "10 = Treasonous Foreign Influence Peddling Allowing Hostile Communist Chinese Interests to Buy Direct Influence in the Clinton White House", 2, 9, 4, 1, 9, 1);

add(1996, "1996_dick_morris_prostitution_scandal_exit", "Dick Morris Prostitution Scandal & Sudden Exit from Clinton Campaign", "News", "1996 (Dick Morris Scandal)", "Governance & Judiciary", 2,
  "Clinton's chief strategist Dick Morris resigning in disgrace on the day of Clinton's acceptance speech after tabloid reveals year-long affair with a Washington prostitute who listened in on presidential calls.",
  "1 = Sordid Private Disgrace That Cannot Obscure Morris's Brilliant Centrist Triangulation Strategy Revitalizing Clinton's Presidency", "10 = Repugnant Moral Hypocrisy Exposing the Degenerate Ethical Culture Surrounding the Clinton Political Machinery", 2, 8, 4, 1, 9, 1);

add(1996, "1996_united_states_v_virginia_vmi_women", "United States v. Virginia Supreme Court Ruling (VMI All-Male Admissions Unconstitutional)", "News", "1996 (VMI Gender Equality Ruling)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 7-1 (Ginsburg opinion) that Virginia Military Institute's male-only admissions policy violates Equal Protection under heightened 'exceedingly persuasive justification' scrutiny.",
  "1 = Monumental Triumph for Gender Equality Shattering Barriers and Guaranteeing Women Equal Access to Premier State Military Institutions", "10 = Tragic Evisceration of Historic Single-Sex State Military Traditions Celebrated for Producing Exceptional Citizen-Soldiers", 2, 8, 4, 1, 9, 1);

add(1996, "1996_romer_v_evans_colorado_amendment_two", "Romer v. Evans Supreme Court Ruling (Striking Colorado Anti-Gay Amendment 2)", "News", "1996 (Romer v. Evans Landmark)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 6-3 (Kennedy opinion) that Colorado constitutional amendment barring local gay civil rights ordinances was born of animosity and violates Equal Protection.",
  "1 = Historic Civil Rights Milestone Affirming Gay and Lesbian Citizens Cannot Be Singled Out for Second-Class Constitutional Disenfranchisement", "10 = Outrageous Judicial Usurpation Overturning the Democratic Vote of Colorado Citizens to Prevent Special Legal Privileges Based on Sexual Conduct", 2, 8, 4, 1, 10, 1);

add(1996, "1996_khobar_towers_terrorist_truck_bombing", "Khobar Towers Terrorist Truck Bombing in Saudi Arabia (19 Airmen Dead)", "News", "1996 (Khobar Towers Bombing)", "Foreign Policy & Defense", 1,
  "Hezbollah Al-Hejaz truck bomb obliterating 8-story military barracks at King Abdulaziz Air Base, killing 19 U.S. airmen and injuring 500, exposing force protection gaps.",
  "1 = Tragic Intelligence Failure Demanding Uncompromised Retaliation Against Iranian State Sponsors and Hardened Troop Protection", "10 = Decisive Proof That Islamic Terrorists Are Waging War Against America; Re-examine U.S. Military Basing in the Heart of the Arabian Peninsula", 2, 9, 4, 1, 9, 1);

add(1996, "1996_twa_flight_800_explosion_off_long_island", "Catastrophic Mid-Air Explosion of TWA Flight 800 (230 Dead)", "News", "1996 (TWA 800 Catastrophe)", "Technology & Infrastructure", 1,
  "Boeing 747 exploding 12 minutes after takeoff from JFK over the Atlantic; massive 4-year NTSB investigation rules center wing fuel tank spark over missile theories.",
  "1 = Thorough Scientific NTSB Investigation Mandating Aircraft Fuel Tank Nitrogen Inerting Systems to Prevent Future Exploding Jet Fuel", "10 = Mourn the 230 Victims While Ensuring Rigorous Airport Security and Intelligence Probing Feared Foreign Missile Sabotage", 2, 7, 6, 2, 7, 1);

add(1996, "1996_centennial_olympic_park_bombing_atlanta", "Centennial Olympic Park Bombing in Atlanta (Richard Jewell Wrongly Accused)", "News", "1996 (Atlanta Olympic Park Bombing)", "Governance & Judiciary", 1,
  "Pipe bomb exploding during Atlanta Summer Games, killing Alice Hawthorne and injuring 111; security guard Richard Jewell heroically clears crowds but is leaked by FBI as suspect.",
  "1 = Horrific Domestic Terror Outrage Exposing Irresponsible FBI Leaks and Media Sensationalism Destroying an Innocent Hero's Life", "10 = Condemn Cowardly Terrorist Attacks Against Peaceful Athletes / Demand Vigorous Hunt for the Real Anti-Abortion Bomber Eric Rudolph", 2, 8, 4, 1, 8, 1);

add(1996, "1996_unabomber_ted_kaczynski_arrest_montana", "FBI Arrests Unabomber Ted Kaczynski in Remote Montana Cabin", "News", "1996 (Unabomber Captured)", "Governance & Judiciary", 1,
  "Following publication of his 35,000-word anti-technology manifesto in the Washington Post, David Kaczynski identifies his brother; FBI raids off-grid cabin.",
  "1 = Brilliant Peaceful Resolution of a 17-Year Domestic Terror Nightmare Brought About by a Brother's Conscience and Responsible Journalism", "10 = Bring the Murderous Deranged Neo-Luddite Terrorist to Swift Justice and Capital Punishment for Killing Three Innocent Americans", 2, 8, 5, 1, 8, 1);

add(1996, "1996_congressional_review_act_cra_enacted", "Enactment of the Congressional Review Act of 1996 (CRA)", "News", "1996 (Congressional Review Act Enacted)", "Governance & Judiciary", 1,
  "Establishing expedited parliamentary procedures allowing Congress to overturn major federal agency regulations by joint resolution with simple majority within 60 days.",
  "1 = Dangerous Corporate Weapon Allowing Special-Interest Lawmakers to Gut Vital Labor, Environmental, and Consumer Safety Agency Rules", "10 = Indispensable Constitutional Check Restoring Article I Congressional Sovereignty Over Unelected Federal Administrative Bureaucrats", 2, 9, 9, 1, 9, 1);

add(1996, "1996_minimum_wage_increase_to_five_fifteen", "Small Business Job Protection Act Raises Minimum Wage to $5.15/Hour", "News", "1996 (Minimum Wage to $5.15)", "Labor & Welfare", 1,
  "Bipartisan legislation raising the federal minimum wage from $4.25 to $5.15/hour over two years, paired with $21B in tax relief for small businesses and SIMPLE IRAs.",
  "1 = Long-Overdue Decency Giving 10 Million Lowest-Paid Hardworking Americans a Modest Living Wage Increase to Combat Inflation", "10 = Sound Compromise Offsetting Minimum Wage Burdens with Genuine Small Business Equipment Expensing and Tax Credits", 2, 8, 9, 1, 8, 1);

add(1996, "1996_line_item_veto_act_of_1996_enacted", "Enactment of the Line Item Veto Act of 1996", "News", "1996 (Line Item Veto Enacted)", "Governance & Judiciary", 1,
  "Fulfilling Contract with America, granting the President statutory authority to cancel individual spending items and targeted tax benefits in passed appropriation bills.",
  "1 = Dangerous Distortion of the Constitutional Separation of Powers Ceding Lawmaking Authority to the Chief Executive", "10 = Essential Weapon Empowering the President to Strike Down Corrupt Pork-Barrel Earmarks Smuggled into Omnibus Spending Bills", 2, 9, 9, 1, 9, 1);

add(1996, "1996_megans_law_sex_offender_community_notification", "Enactment of Federal Megan's Law (Sex Offender Public Notification)", "News", "1996 (Megan's Law Enacted)", "Governance & Judiciary", 1,
  "Named in honor of 7-year-old murder victim Megan Kanka, mandating states create public registries and notify communities when convicted sex offenders move into neighborhoods.",
  "1 = Essential Common-Sense Protection Empowering Parents and Communities to Shield Innocent Children from Dangerous Repeat Sexual Predators", "10 = Good Public Safety Goal, Provided Registry Standards Do Not Trigger Vigilante Violence or Exclude Low-Level Non-Violent Offenders", 2, 8, 7, 1, 8, 1);

add(1996, "1996_iirira_immigration_reform_unlawful_presence", "Illegal Immigration Reform and Immigrant Responsibility Act of 1996 (IIRIRA)", "News", "1996 (IIRIRA 3 and 10 Year Bars)", "Immigration", 1,
  "Sweeping immigration statute creating 3- and 10-year re-entry bars for unlawful presence, mandating 14-mile San Diego border fence, and expanding expedited removal.",
  "1 = Cruel Inhumane Law Tearing Apart Families, Creating Rigid Bars to Legalization, and Trapping Millions in Permanent Second-Class Undocumented Status", "10 = Robust Law-and-Order Enforcement Securing the Border, Curbing Fraudulent Asylum Claims, and Expelling Criminal Aliens", 2, 9, 8, 1, 10, 1);

add(1996, "1996_california_prop_215_medical_marijuana", "California Voters Enact Proposition 215 (Compassionate Use Medical Cannabis Act)", "News", "1996 (Prop 215 Medical Cannabis)", "Civil Rights & Social Issues", 1,
  "California voters passing Prop 215 by 56% majority, becoming the first state in history to legalize medical marijuana for patients suffering from cancer, AIDS, and chronic pain.",
  "1 = Beautiful Compassionate Milestone Empowering Seriously Ill Patients and Doctors to Use Effective Herbal Medicine Free from Arrest", "10 = Trojan Horse for Complete Drug Legalization Flouting Federal Law and Creating Lawless Commercial Cannabis Sham Clinics", 2, 8, 10, 1, 10, 1);

add(1996, "1996_grand_staircase_escalante_monument_clinton", "President Clinton Proclaims Grand Staircase-Escalante National Monument (1.7M Acres)", "News", "1996 (Grand Staircase Proclamation)", "Energy & Climate", 1,
  "Clinton standing on the South Rim of the Grand Canyon to unilaterally designate 1.7 million acres of southern Utah red-rock wilderness, blocking the planned Andalex coal mine.",
  "1 = Spectacular Historic Conservation Saving Ancient Red-Rock Canyons, Prehistoric Fossils, and Wilderness from Industrial Strip Coal Mining", "10 = Outrageous Presidential Executive Tyranny Trampling Utah Sovereignty, Locking Up Massive Clean Coal Reserves, and Pandering to Greens", 2, 8, 9, 1, 10, 1);

add(1996, "1996_valujet_592_crash_and_faa_dual_mandate", "ValuJet Flight 592 Everglades Crash & Abolition of FAA Industry Promotion Mandate", "News", "1996 (ValuJet 592 & FAA Reform)", "Technology & Infrastructure", 1,
  "DC-9 plunging into Everglades swamps due to unexpended chemical oxygen generators igniting in cargo hold; Congress strips FAA of statutory mandate to 'promote' civil aviation.",
  "1 = High Time the FAA Had Its Promethean Conflict of Interest Removed to Focus 100% Exclusively on Airline Passenger Safety and Oversight", "10 = Tragic Fatal Negligence Demanding Strict Cargo Hazmat Enforcement Without Strangling Dynamic Budget Airlines That Democratized Travel", 2, 8, 7, 1, 7, 1);

add(1996, "1996_bovine_spongiform_encephalopathy_mad_cow", "British 'Mad Cow Disease' (BSE) Crisis & U.S. FDA Ruminant Feed Ban", "News", "1996 (Mad Cow Disease & Feed Ban)", "Agriculture & Food", 1,
  "UK acknowledging BSE transmits to humans as fatal variant CJD; FDA issues emergency regulations banning mammalian protein in cattle and ruminant feed.",
  "1 = Critical Biomedical Precaution Shielding American Families and the Beef Supply from Fatal Incurable Prion Brain Degeneration", "10 = Decisive Early Action Protecting the World's Finest Commercial Cattle Herd and Maintaining Global Consumer Confidence in American Beef", 2, 8, 7, 1, 7, 1);

add(1996, "1996_cloning_of_dolly_the_sheep_bioethics", "Cloning of Dolly the Sheep in Scotland & Presidential Human Cloning Ban", "News", "1996-1997 (Dolly the Sheep Cloning Debate)", "Healthcare", 1,
  "Scottish scientists successfully cloning a mammal from an adult somatic cell; President Clinton issues moratorium on federal funding for human somatic cloning.",
  "1 = Breathtaking Milestone in Cellular Biology Offering Cures for Diabetes and Organ Failure, Guided by Responsible Ethical Guidelines", "10 = Sacred Moral Line: Man Must Not Play God; Enact a Total Statutory Criminal Ban on Human Cloning and Genetic Commodification", 2, 8, 7, 1, 10, 1);

add(1996, "1996_gatt_information_technology_agreement_ita", "WTO Information Technology Agreement (ITA - Eliminating Tech Tariffs)", "News", "1996 (ITA Tech Tariff Elimination)", "Economy & Taxation", 2,
  "Twenty-nine nations signing WTO accord in Singapore eliminating all global import tariffs on computers, semiconductors, software, and telecom gear.",
  "1 = Spectacular Triumph for Silicon Valley High-Tech Innovation Unleashing Billions in Worldwide American Computer and Software Exports", "10 = Magnificent Free-Market Trade Agreement Slashing Tariffs Globally and Powering the 21st Century Digital Information Revolution", 2, 8, 10, 1, 8, 1);

add(1996, "1996_electronic_foia_amendments_of_1996", "Enactment of the Electronic Freedom of Information Act Amendments of 1996", "News", "1996 (E-FOIA Enactment)", "Governance & Judiciary", 2,
  "Requiring federal executive agencies to make public records, regulations, and opinions available online electronically in digital formats.",
  "1 = Crucial Digital Modernization Democratizing Government Transparency and Giving Citizens Instant Online Access to Federal Records", "10 = Sound Technological Openness, Provided Agencies Maintain Strict Cyber-Security and Privacy Protections for Sensitive Records", 2, 7, 2, 1, 7, 1);

add(1996, "1996_taiwan_strait_missile_crisis_clinton", "Third Taiwan Strait Crisis: Clinton Deploys Two Aircraft Carrier Battle Groups", "News", "1995-1996 (Taiwan Strait Crisis)", "Foreign Policy & Defense", 1,
  "Beijing firing live ballistic missiles into sea lanes near Taiwan to intimidate voters; Clinton deploys USS Nimitz and Independence battle groups in show of naval force.",
  "1 = Resolute Decisive Projection of American Seapower Halting Chinese Communist Aggression and Defending Democratic Taiwan's Elections", "10 = Splendid Display of Peace Through Strength Forcing Beijing to Stand Down Free from Dangerous Escalation into World War III", 2, 9, 4, 1, 9, 1);

add(1996, "1996_whitewater_mcdougal_convictions_arkansas", "Whitewater Criminal Trial: Jim and Susan McDougal Convicted of Fraud", "News", "1996 (Whitewater Convictions)", "Governance & Judiciary", 1,
  "Federal jury convicting Clintons' former business partners and sitting Arkansas Governor Jim Guy Tucker on 24 counts of S&L fraud; Tucker resigns.",
  "1 = Sordid Arkansas Real Estate Fraud Involving Insolvent Small-Town Bankers That Has Zero Direct Connection to the President or First Lady", "10 = Historic Criminal Convictions Proving the Entire Whitewater Financial Orbit Was a Corrupt Criminal Fraud Operation Reaching the Top", 2, 9, 4, 1, 9, 1);

add(1996, "1996_white_house_fbi_filegate_controversy", "White House FBI Background Files Controversy ('Filegate')", "News", "1996 (Filegate Controversy)", "Governance & Judiciary", 1,
  "House committee reveals White House personnel security director Craig Livingstone improperly obtained hundreds of confidential FBI background files on prominent Republicans.",
  "1 = Bureaucratic Administrative Mix-Up Involving Outdated Roster Lists Exaggerated for Campaign PR with Zero Improper Use Shown", "10 = Chilling Police-State Weaponization of Sensitive FBI Dossiers by Political Operatives Inside the Clinton White House to Blackmail Enemies", 2, 9, 2, 1, 9, 1);

add(1996, "1996_bill_clinton_re_election_379_electoral_votes", "Bill Clinton Wins Re-Election with 379 Electoral Votes Over Bob Dole", "News", "1996 (Clinton 1996 Re-Election Victory)", "Governance & Judiciary", 1,
  "Clinton carrying 31 states and 49.2% of the vote, becoming the first Democrat re-elected since FDR; Republicans retain majorities in both House and Senate.",
  "1 = Resounding Vindication of Centrist 'New Democrat' Governance: Record Prosperity, Declining Crime, and Deficits Slashed in Half", "10 = Voters Re-elected Clinton to Preside Over the Peace and Economy While Choosing Republican Majorities in Congress to Check Liberal Spending", 2, 8, 7, 1, 9, 1);

add(1996, "1996_fbi_richard_jewell_exoneration_aftermath", "FBI Formally Exonerates Richard Jewell of Olympic Park Bombing", "News", "1996 (Richard Jewell Exonerated)", "Governance & Judiciary", 2,
  "U.S. Attorney issuing formal letter clearing heroic security guard Richard Jewell after 88 days of intense surveillance and leaks, highlighting prosecutorial overreach.",
  "1 = Tragic Graphic Indictment of Trial by Media and Leaking Law Enforcement Bureaucrats Destroying an Innocent Citizen's Reputation", "10 = Essential Vindication / Reform Leak Laws and Hold Media Outlets Accountable with Ruinous Defamation Libel Verdicts", 2, 8, 2, 1, 8, 1);

add(1996, "1996_medicare_trust_fund_insolvency_alarms", "Medicare Trustees Warn Hospital Insurance Trust Fund Faces Insolvency by 2001", "News", "1995-1996 (Medicare Insolvency Alarms)", "Healthcare", 1,
  "Annual report showing Part A trust fund reserves declining rapidly due to surging healthcare inflation, spurring appointment of National Bipartisan Commission.",
  "1 = Protect Guaranteed Medicare Benefits for Millions of Vulnerable Seniors; Rebalance System by Controlling Hospital and Drug Price Gouging", "10 = Entitlement Time Bomb Demanding Structural Bipartisan Overhaul: Introduce Private Medicare+Choice Market Competition and Means Testing", 2, 9, 10, 1, 9, 1);

add(1996, "1996_internet_domain_name_privatization_plan", "Commerce Department Plans to Transition Internet DNS from NSF to Private Non-Profit", "News", "1996 (Internet DNS Privatization Genesis)", "Technology & Infrastructure", 2,
  "Administration releasing white paper proposing to transfer root domain name coordination from government contractor to a private, international non-profit (ICANN).",
  "1 = Visionary Self-Governance Model Keeping the Emerging Global Internet Free from Stifling State Censorship and Bureaucracy", "10 = Ensure American Technical Sovereignty Over the Root Zone Server Architecture Is Never Ceded to Foreign Governments or the UN", 2, 8, 10, 2, 8, 1);

add(1996, "1996_national_park_service_fee_demonstration", "Enactment of the National Park Service Fee Demonstration Program", "News", "1996 (Fee Demo Recreation Passes)", "Energy & Climate", 2,
  "Authorizing national parks and federal recreation areas to collect user entrance fees and retain 80% locally to address a $5 billion deferred maintenance backlog.",
  "1 = User-Pay Common-Sense Mechanism Generating Hundreds of Millions Directly to Fix Crumbling Campgrounds, Trails, and Visitor Facilities", "10 = Double Taxation on American Families Who Already Pay Taxes for Public Lands; Turnstiles Commercialize Nature's Cathedrals", 2, 8, 9, 1, 8, 1);

add(1996, "1996_the_era_of_big_government_is_over", "Bill Clinton Declares in State of the Union: 'The Era of Big Government Is Over'", "News", "1996 (Era of Big Government Is Over)", "Governance & Judiciary", 1,
  "Clinton electrifying the nation in January 1996, coopting the GOP revolution by declaring the era of big government is over, but we cannot go back to fending for ourselves.",
  "1 = Masterful Centrist Synthesis Defining a Smart, Lean, Progressive Government Focused on Opportunity, Community, and Responsibility", "10 = Pure Political Sleight of Hand: Clinton Concedes the Philosophical Conservative Victory While Proposing Hundreds of Micromanaging Programs", 2, 9, 8, 1, 9, 1);

add(1996, "1996_seminole_tribe_v_florida_state_sovereignty", "Seminole Tribe of Florida v. Florida (Eleventh Amendment State Sovereign Immunity)", "News", "1996 (Seminole Tribe 11th Amendment Ruling)", "Governance & Judiciary", 2,
  "Supreme Court ruling 5-4 (Rehnquist opinion) that Congress lacks power under Article I to abrogate state sovereign immunity from private lawsuits in federal court.",
  "1 = Reactionary States' Rights Activism Stripping Citizens and Tribes of Federal Judicial Remedies When State Governments Violate Laws", "10 = Historic Landmark Rebuilding True Dual Constitutional Federalism and Shielding Sovereign State Treasuries from Federal Lawsuits", 2, 10, 7, 1, 10, 1);

add(1996, "1996_partial_birth_abortion_ban_act_clinton_veto", "President Clinton Vetoes the Partial-Birth Abortion Ban Act", "News", "1995-1996 (Partial-Birth Abortion Veto)", "Healthcare", 1,
  "Clinton vetoing legislation banning the intact dilation and extraction late-term abortion procedure, surrounded by women who underwent the procedure for health emergencies.",
  "1 = Compassionate Defense of Women and Families Facing Catastrophic Late-Term Medical Tragedies and Severe Health Risks", "10 = Horrific Moral Iniquity Defending a Barbaric, Infanticidal Procedure Where a Living Baby Is Destroyed Inches from Delivery", 2, 10, 6, 1, 10, 1);

add(1996, "1996_arizona_proposition_200_medical_marijuana", "Arizona Voters Approve Proposition 200 (Medical Marijuana and Diversion)", "News", "1996 (Arizona Prop 200 Ballot)", "Civil Rights & Social Issues", 1,
  "Arizona voters passing Prop 200 by 65% majority, permitting doctors to prescribe Schedule I drugs including marijuana and mandating treatment over prison for first offenses.",
  "1 = Inspiring Public Rejection of the Punitive Incarceration-First Drug War in Favor of Medical Discretion and Treatment", "10 = Dangerous Subversion of Federal Controlled Substances Laws Orchestrated by Wealthy Out-of-State Pro-Drug Legalization Financiers", 2, 8, 10, 1, 10, 1);

add(1996, "1996_clintongore_school_uniform_initiatives", "Clinton-Gore White House Advocates School Uniforms to Curb Classroom Violence", "News", "1996 (School Uniforms Initiative)", "Education", 2,
  "Clinton using State of the Union to promote voluntary public school uniforms, issuing manuals to districts to curb gang colors and reduce teen fashion pressures.",
  "1 = Pragmatic Common-Sense Community Idea Promoting Classroom Order, Discipline, and Reducing Fatal Fights Over Designer Sneakers", "10 = Trivial Nanny-State Micromanagement Telling Local School Districts and Families What Clothes Children Must Wear to School", 2, 8, 7, 1, 8, 1);

// =========================================================================
// 1998 (50 Issues)
// =========================================================================
add(1998, "1998_house_impeaches_bill_clinton", "House of Representatives Votes to Impeach President Bill Clinton", "News", "1998-1999 (Clinton Impeachment)", "Governance & Judiciary", 1,
  "House approving two articles of impeachment against Clinton for perjury before a grand jury and obstruction of justice in the Lewinsky and Jones cases.",
  "1 = Disgraceful Partisan Vendetta Weaponizing Constitutional Impeachment to Overturn Two Democratic Presidential Elections Over Private Consensual Sex", "10 = Solemn Moral Duty to Uphold the Rule of Law: A President Who Commits Felony Perjury Under Oath Desecrates the Integrity of the Judicial System", 2, 10, 5, 1, 10, 1);

add(1998, "1998_kenneth_starr_independent_counsel_report", "Release of the Ken Starr Independent Counsel Report (Online Sensation)", "News", "1998 (Starr Report Release)", "Governance & Judiciary", 1,
  "House releasing Starr's graphic 452-page report detailing Clinton's Oval Office sexual encounters with intern Monica Lewinsky, crashing congressional web servers.",
  "1 = Salacious Voyeuristic Smear Produced by a Runaway Grand Inquisitor Possessed by Moralistic Obsession", "10 = Essential Evidentiary Accounting Documenting a Comprehensive Pattern of Executive Perjury, Subornation of Lies, and Cover-ups", 2, 9, 3, 1, 9, 1);

add(1998, "1998_monica_lewinsky_grand_jury_clinton_testimony", "Bill Clinton's Televised Grand Jury Testimony ('Meaning of the Word Is')", "News", "1998 (Clinton Grand Jury Testimony)", "Governance & Judiciary", 1,
  "Clinton giving 4 hours of videotaped grand jury testimony, famously hair-splitting legal definitions: 'It depends on what the meaning of the word 'is' is.'",
  "1 = Targeted Trap by Hostile Partisan Litigators Asking Intimate Questions No Citizen Should Ever Have to Endure Under Law", "10 = Shameless Legalistic Evasion and Contempt for the Sacred Oath Demonstrating Utter Lack of Truthfulness and Integrity", 2, 9, 4, 1, 9, 1);

add(1998, "1998_historic_federal_budget_surplus_69_billion", "Federal Budget Surplus Emerges ($69 Billion Surplus - First in 29 Years)", "News", "1998 (First Federal Surplus)", "Economy & Taxation", 1,
  "Strong economic growth, low unemployment (4.5%), and 1993/1997 fiscal discipline generating the first unified federal budget surplus since 1969.",
  "1 = Historic Triumph of Democratic Fiscal Responsibility Proving Balancing the Budget Does Not Require Gutting Public Investments", "10 = Over-Taxation of the American People! Surpluses Belong to Hardworking Taxpayers and Must Be Returned in Across-the-Board Tax Cuts", 2, 9, 10, 1, 9, 1);

add(1998, "1998_master_settlement_agreement_tobacco", "Master Settlement Agreement: Big Tobacco Agrees to $206 Billion Payout to 46 States", "News", "1998 (Tobacco MSA Enacted)", "Healthcare", 1,
  "Four major cigarette manufacturers settling state healthcare Medicaid lawsuits, agreeing to pay $206 billion over 25 years, ban billboard ads, and disband cartoon mascots.",
  "1 = Historic Public Health Triumph Forcing Big Tobacco to Pay for Smoking Healthcare Costs and Barring Ads Targeting Children", "10 = Unconstitutional Cartel Accord Fueling Trial Lawyer Windfalls While Permitting States to Divert Billions into General Slush Funds", 2, 8, 9, 1, 8, 1);

add(1998, "1998_good_friday_peace_agreement_northern_ireland", "Good Friday Peace Agreement in Northern Ireland (Brokered by George Mitchell)", "News", "1998 (Good Friday Agreement)", "Foreign Policy & Defense", 1,
  "Historic accord ending 30 years of 'The Troubles' in Northern Ireland, establishing devolved power-sharing government and cross-border bodies, brokered by U.S. Senator Mitchell.",
  "1 = Magnificent Masterpiece of Patient American Peacemaking Bringing Hope, Reconciliation, and Self-Determination to Shattered Communities", "10 = Celebrate Historic Peacemaking While Insisting on Full, Verifiable Disarmament and Decommissioning of IRA Terrorist Arsenals", 2, 8, 4, 1, 8, 1);

add(1998, "1998_operation_desert_fox_four_day_air_strikes", "Operation Desert Fox: Four Days of Missile and Air Strikes Against Iraqi WMD", "News", "1998 (Desert Fox Air Campaign)", "Foreign Policy & Defense", 1,
  "U.S. and UK launching 415 cruise missiles and 600 air sorties against 100 Iraqi military and WMD sites after Saddam Hussein expelled UN weapons inspectors.",
  "1 = Necessary Military Response Enforcing UN Weapons Mandates, Though Airstrikes Alone Cannot Solve the Threat of Saddam's WMDs", "10 = Suspicious 'Wag the Dog' Military Timing Launched on the Eve of Clinton's Impeachment Vote / A Real Strategy Demands Regime Change", 2, 9, 4, 1, 9, 1);

add(1998, "1998_al_qaeda_us_embassy_bombings_africa", "Al-Qaeda Truck Bombings of U.S. Embassies in Kenya and Tanzania (224 Dead)", "News", "1998 (East Africa Embassy Bombings)", "Foreign Policy & Defense", 1,
  "Simultaneous suicide truck bombings by Osama bin Laden's al-Qaeda obliterating U.S. embassies in Nairobi and Dar es Salaam, killing 224 people and injuring 4,500.",
  "1 = Horrific Global Awakening Proving Bin Laden's Worldwide Terrorist Network Is Waging Uncompromising War on Free Nations", "10 = Declare War on International Islamic Terrorism / Deploy Every Resource to Hunt Down and Liquidate Bin Laden and His Camps", 2, 9, 4, 1, 9, 1);

add(1998, "1998_operation_infinite_reach_cruise_missiles", "Operation Infinite Reach: Cruise Missile Retaliation Against Afghan and Sudan Sites", "News", "1998 (Operation Infinite Reach)", "Foreign Policy & Defense", 1,
  "U.S. Navy launching 75 Tomahawk missiles at al-Qaeda training camps in Afghanistan and the Al-Shifa pharmaceutical factory in Khartoum, Sudan.",
  "1 = Legitimate Self-Defense Striking Back at Terrorist Training Sanctuaries, Though Destroying Sudan's Factory Sparked Severe Disquiet", "10 = Pinprick Missile Diplomacy Timing Smacking of 'Wag the Dog' Distraction; A Superpower Must Wage Decisive War, Not Fire Expensive Empty Tents", 2, 9, 3, 1, 9, 1);

add(1998, "1998_clinton_v_city_of_new_york_line_item_veto", "Clinton v. City of New York Supreme Court Ruling (Striking Line Item Veto)", "News", "1998 (Line Item Veto Struck Down)", "Governance & Judiciary", 1,
  "Supreme Court ruling 6-3 (Stevens opinion) that the Line Item Veto Act violates the Presentment Clause of Article I by empowering the President to amend laws.",
  "1 = Historic Affirmation of Constitutional Separation of Powers: The President Cannot Unilaterally Rewrite Acts of Congress", "10 = Devastating Setback Stripping the Commander-in-Chief of the Essential Scalpel Needed to Excise Bloated Congressional Pork Earmarks", 2, 9, 8, 1, 9, 1);

add(1998, "1998_digital_millennium_copyright_act_dmca", "Enactment of the Digital Millennium Copyright Act of 1998 (DMCA Safe Harbors)", "News", "1998 (DMCA Enactment)", "Technology & Infrastructure", 1,
  "Implementing WIPO treaties, prohibiting circumvention of digital rights management (DRM) encryption, and establishing 'notice-and-takedown' safe harbors for online platforms.",
  "1 = Essential Modern Compromise Protecting Online Platforms from Ruinous Copyright Liability While Safeguarding Musicians' Royalties", "10 = Dangerous Anti-Circumvention Rule (Section 1201) Stifling Fair Use, Independent Computer Security Research, and Consumer Backups", 2, 8, 8, 2, 8, 1);

add(1998, "1998_sonny_bono_copyright_term_extension_act", "Enactment of the Sonny Bono Copyright Term Extension Act (Life Plus 70 Years)", "News", "1998 (Mickey Mouse Copyright Extension)", "Technology & Infrastructure", 2,
  "Extending copyright protection duration by 20 years (to life of author plus 70 years, and 95 years for corporate works), derided by critics as the 'Mickey Mouse Protection Act'.",
  "1 = Harmonize American Copyright with European Union Standards to Protect Valuable Creative Intellectual Property Assets Abroad", "10 = Outrageous Rent-Seeking Handout to Corporate Entertainment Moguls Freezing the Public Domain and Locking Up Culture for Two Decades", 2, 8, 9, 2, 8, 1);

add(1998, "1998_justice_department_antitrust_microsoft", "Department of Justice & 20 States File Landmark Antitrust Lawsuit Against Microsoft", "News", "1998 (DOJ v. Microsoft Antitrust)", "Technology & Infrastructure", 1,
  "DOJ and 20 state attorneys general suing Microsoft for predatory monopolization, alleging it unlawfully bundled Internet Explorer into Windows to crush Netscape.",
  "1 = Essential Anti-Monopoly Action Protecting Technological Innovation and Halting Microsoft's Bullying Stranglehold on Personal Computing", "10 = Disgraceful Government Attack on America's Greatest High-Tech Success Story Punishing Excellence and Market Success", 2, 8, 10, 2, 8, 1);

add(1998, "1998_childrens_online_privacy_protection_act_coppa", "Enactment of the Children's Online Privacy Protection Act of 1998 (COPPA)", "News", "1998 (COPPA Enacted)", "Technology & Infrastructure", 1,
  "Requiring commercial websites to obtain verifiable parental consent before collecting personal identifiable information from children under age 13.",
  "1 = Vital Essential Shield Protecting Young Children's Online Privacy from Predatory Data Profiling and Commercial Exploitation", "10 = Sound Child Protection Framework, Provided Compliance Rules Do Not Force Independent Youth Sites to Shut Down from Legal Liability", 2, 8, 7, 1, 8, 1);

add(1998, "1998_internet_tax_freedom_act_moratorium", "Enactment of the Internet Tax Freedom Act of 1998 (Internet Tax Moratorium)", "News", "1998 (Internet Tax Moratorium Enacted)", "Economy & Taxation", 1,
  "Establishing a three-year federal moratorium barring state and local governments from imposing access taxes or discriminatory taxes on internet bandwidth and e-commerce.",
  "1 = Brilliant Visionary Policy Shielding the Infant Digital Economy from a Paralyzing Quagmire of 30,000 Conflicting Local Tax Jurisdictions", "10 = Excellent Pro-Growth Restraint Protecting Free Enterprise Digital Commerce and Keeping Internet Access Affordable for All", 2, 8, 10, 2, 9, 1);

add(1998, "1998_byrd_hagel_resolution_rejects_kyoto", "Senate Passes Byrd-Hagel Resolution (95-0) Rejecting the Kyoto Climate Protocol", "News", "1997-1998 (Byrd-Hagel Senate Veto)", "Energy & Climate", 1,
  "Senate voting unanimously 95-0 that the U.S. should not sign any climate protocol mandating greenhouse cuts that does not include binding targets for developing giants like China and India.",
  "1 = Tragic Short-Sighted Obstruction Abandoning American Planetary Leadership in Combating Catastrophic Climate Disruption", "10 = Resounding Unanimous Affirmation of Economic Sanity Refusing to Cripple the American Economy While China Emits Without Limit", 2, 10, 9, 1, 10, 1);

add(1998, "1998_ltcm_collapse_and_fed_private_bailout", "Collapse of Long-Term Capital Management (LTCM) & Federal Reserve Rescue", "News", "1998 (LTCM Hedge Fund Meltdown)", "Economy & Taxation", 1,
  "Nobel-laureate hedge fund losing $4.6B following Russian debt default; New York Fed summons 14 Wall Street banks to orchestrate a $3.6 billion private consortium bailout.",
  "1 = Chilling Warning Exposing Unchecked Hedge Fund Megabank Leverage Threatening Worldwide Financial Contagion and Collapse", "10 = Masterful Averting of Panic Without Using a Single Cent of Taxpayer Money / Free Markets Resolved the Liquidity Crisis", 2, 8, 10, 1, 9, 2);

add(1998, "1998_russian_ruble_default_financial_crisis", "Russian Financial Crisis: Sovereign Ruble Default & Debt Moratorium", "News", "1998 (Russian Ruble Collapse)", "Foreign Policy & Defense", 1,
  "Russia devaluing the ruble, defaulting on domestic debt (GKO), and declaring a 90-day moratorium on commercial foreign debt repayments, shaking world markets.",
  "1 = Bitter Vindication Proving 'Shock Therapy' Western Financial Deregulation Pushed Post-Soviet Russia into Ruinous Oligarchic Collapse", "10 = Sobering Lesson in the Perils of Fiscal Incompetence and Mafia Corruption in Transitioning Economies", 2, 8, 5, 1, 8, 1);

add(1998, "1998_matthew_shepard_brutal_hate_crime_murder", "Brutal Murder of Matthew Shepard in Laramie, Wyoming", "News", "1998 (Matthew Shepard Hate Crime)", "Civil Rights & Social Issues", 1,
  "Twenty-one-year-old gay college student beaten, tortured, tied to a split-rail fence, and left to die in near-freezing cold, sparking national hate-crimes legislation drive.",
  "1 = Horrific Hate Crime Demanding Immediate Enactment of Federal Hate Crimes Legislation Protecting LGBT Citizens from Violent Terror", "10 = Heartbreaking Barbaric Murder Demanding Severe Capital Retribution for the Killers Without Fabricating Vague Federal Hate-Crime Thought Laws", 2, 9, 4, 1, 9, 1);

add(1998, "1998_james_byrd_jr_jasper_texas_lynching", "Vicious Racist Murder of James Byrd Jr. in Jasper, Texas", "News", "1998 (James Byrd Jr. Murder)", "Civil Rights & Social Issues", 1,
  "Three white supremacists chaining 49-year-old Black man to the back of a pickup truck and dragging him three miles to his decapitation, horrifying the nation.",
  "1 = Chilling Reminder That Lethal White Supremacist Racism Endures Demanding Unrelenting Federal Anti-Lynching and Civil Rights Prosecution", "10 = Heinous Evil Perpetrated by Depraved Racist Animals Deserving the Swiftest Execution Under Texas Law", 2, 9, 4, 1, 10, 1);

add(1998, "1998_california_proposition_227_bilingual_ban", "California Voters Approve Proposition 227 (Ending Bilingual Education)", "News", "1998 (Prop 227 English Immersion)", "Education", 1,
  "California voters approving Prop 227 by 61% majority, replacing bilingual education programs with one-year structured English immersion classes.",
  "1 = Cruel Ideological Attack Denying Immigrant Spanish-Speaking Children the Bilingual Academic Support Needed to Flourish", "10 = Common-Sense Grassroots Milestone Ensuring Immigrant Children Master the English Language Necessary for American Success", 2, 9, 7, 1, 9, 1);

add(1998, "1998_india_pakistan_nuclear_weapons_tests", "India & Pakistan Conduct Reciprocal Underground Nuclear Weapons Tests", "News", "1998 (South Asia Nuclear Tests)", "Foreign Policy & Defense", 1,
  "India detonating five nuclear devices in Pokhran desert; Pakistan responds weeks later with six nuclear tests in Chagai Hills; Clinton imposes Glenn Amendment sanctions.",
  "1 = Grave Global Security Threat Demanding Comprehensive International Sanctions to Halt a Catastrophic South Asian Nuclear War", "10 = Tough Realities of Nuclear Proliferation; Enforce Strict Sanctions While Maintaining Practical Security Ties with Islamabad", 2, 8, 4, 1, 8, 1);

add(1998, "1998_international_criminal_court_rome_statute", "U.S. Rejection of the Rome Statute Establishing the International Criminal Court (ICC)", "News", "1998 (ICC Rome Statute Vote)", "Foreign Policy & Defense", 1,
  "United States voting against the Rome Statute (joining China, Iraq, Israel, Libya, Qatar, and Yemen), opposing universal jurisdiction over American service members.",
  "1 = Disappointing Isolationist Vote Undermining the Global Architecture of International Human Rights Justice for War Crimes", "10 = Indispensable Defense of American Sovereignty Barring Unaccountable Foreign Prosecutors from Indicting American Troops Serving Abroad", 2, 9, 4, 1, 10, 1);

add(1998, "1998_tea_21_surface_transportation_act", "Enactment of TEA-21 (Transportation Equity Act for the 21st Century - $218B)", "News", "1998 (TEA-21 Enacted)", "Technology & Infrastructure", 1,
  "Historic $218 billion surface transportation authorization guaranteeing that 100% of federal Highway Trust Fund gas taxes must be spent on highways and transit.",
  "1 = Monumental Bipartisan Investment Rebuilding America's Crumbling Infrastructure, Expanding Commuter Transit, and Creating Jobs", "10 = Record-Setting $218 Billion Spending Spree Stuffed with Over 1,800 Congressional Pork-Barrel Earmarks Smuggled into Law", 2, 8, 9, 1, 9, 1);

add(1998, "1998_irs_restructuring_and_reform_act", "Internal Revenue Service Restructuring and Reform Act of 1998", "News", "1998 (IRS Restructuring Enacted)", "Economy & Taxation", 1,
  "Following sensational Senate Finance hearings on rogue IRS audits, shifting burden of proof to IRS in tax court and establishing independent Oversight Board.",
  "1 = Common-Sense Taxpayer Protections, Provided Reforms Do Not Paralyze Legitimate Tax Auditing of Wealthy Tax Evaders", "10 = Landmark Taxpayer Bill of Rights Reining In an Arrogant, Predatory Tax Bureaucracy and Restoring Due Process to Citizens", 2, 8, 10, 1, 9, 1);

add(1998, "1998_iraq_liberation_act_of_1998", "Enactment of the Iraq Liberation Act of 1998 (U.S. Policy for Regime Change)", "News", "1998 (Iraq Liberation Act Enacted)", "Foreign Policy & Defense", 1,
  "Bipartisan statute signed by Clinton declaring it official U.S. policy to support efforts to remove the regime headed by Saddam Hussein from power in Iraq.",
  "1 = Principled Moral Policy Supporting Democratic Iraqi Opposition Groups Free from Direct American Military Ground Combat", "10 = Clear Bipartisan Commitment Codifying That Saddam's Terrorist-Sponsoring WMD Dictatorship Cannot Be Permitted to Survive", 2, 9, 5, 1, 9, 1);

add(1998, "1998_federal_reserve_three_rate_cuts_liquidity", "Federal Reserve Slashes Interest Rates Three Times in Seven Weeks", "News", "1998 (Greenspan Liquidity Rescue)", "Economy & Taxation", 1,
  "Alan Greenspan orchestrating rapid-fire interest rate cuts to pump emergency liquidity into global financial plumbing following Asian crisis and Russian default.",
  "1 = Essential Global Rescue Halting Panicked Liquidity Freezes and Protecting the American Economic Expansion from Contagion", "10 = Sound Central Bank Action Stabilizing Capital Markets, Provided It Does Not Inflate Speculative Bubbles in Dot-Com Stocks", 2, 8, 9, 1, 8, 2);

add(1998, "1998_clinton_save_social_security_first_pledge", "President Clinton's 'Save Social Security First' State of the Union Pledge", "News", "1998 (Save Social Security First)", "Labor & Welfare", 1,
  "Clinton demanding that every penny of the emerging budget surplus be reserved to save Social Security before enacting tax cuts or new spending programs.",
  "1 = Brilliant Visionary Statesmanship Reserving Budget Surpluses to Guarantee the Solvency of America's Retirement Safety Net for Baby Boomers", "10 = Cynical Political Blockade Invented by Clinton to Lock Up Taxpayer Surpluses and Deny Americans Pro-Growth Tax Relief", 2, 9, 9, 1, 9, 1);

add(1998, "1998_international_space_station_assembly_begins", "First Modules of the International Space Station (ISS) Joined in Orbit", "News", "1998 (ISS Assembly Begins)", "Technology & Infrastructure", 1,
  "Space Shuttle Endeavour crew joining Russian Zarya module with U.S. Unity node in low Earth orbit, beginning permanent international space habitation.",
  "1 = Magnificent Global Achievement Demonstrating Peaceful International Scientific Collaboration Beyond Cold War Rivalries", "10 = Expensive Multi-Billion Dollar Orbital Laboratory Plagued by Heavy Russian Subsidies That Starves Deep-Space Exploration", 2, 7, 7, 2, 7, 1);

add(1998, "1998_john_glenn_returns_to_space_at_77", "Senator John Glenn Returns to Space Aboard Shuttle Discovery (STS-95 at 77)", "News", "1998 (John Glenn Shuttle Flight)", "Technology & Infrastructure", 2,
  "Seventy-seven-year-old American hero John Glenn flying nine-day mission on Discovery to conduct biomedical aging research, uniting an enchanted nation.",
  "1 = Beautiful Inspiring Demonstration That Old Age Is No Barrier to Courage, Service, and Scientific Pioneering", "10 = Wonderful Patriotic Tribute to a Great American Legend, Even if Scientific Aging Experiments Were Largely Secondary", 2, 7, 6, 2, 7, 1);

add(1998, "1998_fda_approves_viagra_lifestyle_drug_boom", "FDA Approves Pfizer's Viagra (Sildenafil) & Lifestyle Drug Revolution", "News", "1998 (Viagra FDA Approval)", "Healthcare", 2,
  "Pfizer winning FDA approval for erectile dysfunction pill Viagra, becoming fastest-selling pharmaceutical in history ($1B sales in first year) and de-stigmatizing men's health.",
  "1 = Breathtaking Biomedical Breakthrough Restoring Marital Intimacy and Transforming Open Discussion of Human Sexual Health", "10 = Free-Market Pharmaceutical Triumph, Though Public Medicaid and Medicare Dollars Must Not Be Diverted to Fund Lifestyle Drugs", 2, 7, 9, 2, 8, 1);

add(1998, "1998_y2k_millennium_bug_preparations", "Enactment of the Examination Parity and Year 2000 Readiness Act (Y2K)", "News", "1998 (Y2K Bug Preparations)", "Technology & Infrastructure", 2,
  "Federal regulators and Congress mobilizing hundreds of billions to audit computer code worldwide to avert feared catastrophic computer failures on January 1, 2000.",
  "1 = Essential Coordinated Preparedness Safeguarding Global Banking, Nuclear Power, and Aviation Systems from Digital Paralysis", "10 = Panic-Driven Apocalypse Hysteria Siphoning Billions into High-Tech Consultant Rackets to Fix Overhyped Date Clock Glitches", 2, 7, 7, 2, 7, 1);

add(1998, "1998_bragdon_v_abbott_hiv_ada_protection", "Bragdon v. Abbott Supreme Court Ruling (Asymptomatic HIV Protected Under ADA)", "News", "1998 (Bragdon v. Abbott Decision)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 5-4 that individuals with asymptomatic HIV infection are disabled under the Americans with Disabilities Act and protected from healthcare refusal.",
  "1 = Historic Compassionate Victory Ensuring Americans Living with HIV Cannot Be Refused Medical or Dental Treatment Due to Fear and Stigma", "10 = Dangerous Expansion of the ADA Subordinating Doctor Safety Judgment to Federal Disability Lawsuits", 2, 8, 5, 1, 9, 1);

add(1998, "1998_burlington_industries_v_ellerth_harassment", "Burlington Industries v. Ellerth (Employer Sexual Harassment Liability)", "News", "1998 (Ellerth Sexual Harassment Ruling)", "Governance & Judiciary", 1,
  "Supreme Court establishing vicarious liability standards for employers whose supervisors commit sexual harassment, creating the Ellerth-Faragher affirmative defense.",
  "1 = Essential Accountability Forcing Corporations to Create Meaningful Anti-Harassment Reporting Mechanisms to Protect Workers", "10 = Complex Liability Trap Forcing Companies to Spend Millions on Pro Forma Human Resources Bureaucracies to Defend Lawsuits", 2, 8, 7, 1, 8, 1);

add(1998, "1998_dot_com_internet_stock_market_frenzy", "Explosion of the 'Dot-Com' Internet Stock Market Mania on Wall Street", "News", "1998 (Dot-Com Mania Explosion)", "Economy & Taxation", 1,
  "Market capitalizations of money-losing internet startups (Amazon, Yahoo, eBay) skyrocketing to tens of billions, driving NASDAQ to unprecedented records.",
  "1 = Transformative Creative Boom Fueling the Greatest High-Tech Economic Expansion and Information Revolution in World History", "10 = Dangerous Speculative Bubble Built on Irrational Exuberance That Will Inevitably Crash and Burn Gullible Everyday Retail Investors", 2, 8, 10, 2, 8, 1);

add(1998, "1998_midterm_elections_democratic_rebuke_to_gop", "1998 Midterm Elections: Historic Democratic Pickups & Gingrich Resignation", "News", "1998 (1998 Midterm Election Shock)", "Governance & Judiciary", 1,
  "Democrats picking up 5 House seats—first time the White House party gained House seats in a midterm since 1934—repudiating the Lewinsky probe; Gingrich resigns as Speaker.",
  "1 = Resounding Grassroots Rebuke to GOP Impeachment Zealots: The American People Demanded Congress Move On and Focus on Real Issues", "10 = Midterm Disappointment Caused by Lame Republican Campaign Messaging That Ignored Tax Relief and Over-Focused on the Sordid Scandal", 2, 9, 6, 1, 9, 1);

add(1998, "1998_bob_livingston_speaker_resignation", "Speaker-Elect Bob Livingston Resigns After Admitting Extramarital Affairs", "News", "1998 (Livingston Resignation Drama)", "Governance & Judiciary", 1,
  "Representative Bob Livingston, chosen to replace Gingrich as Speaker, dramatically resigning on the House floor during Clinton impeachment debates after Hustler exposes affairs.",
  "1 = Bizarre Self-Destructive Purge Proving the Politics of Personal Destruction Eventually Devours Everyone in Its Path", "10 = Honorable Resignation Setting a Necessary Moral Standard of Integrity and Accountability for the High Office of Speaker", 2, 9, 4, 1, 9, 1);

add(1998, "1998_child_online_protection_act_copa", "Enactment of the Child Online Protection Act of 1998 (COPA)", "News", "1998 (COPA Commercial Web Enacted)", "Technology & Infrastructure", 1,
  "Second congressional attempt to restrict online commercial pornography, requiring credit card age verification for commercial adult websites (later blocked in court).",
  "1 = Crucial Common-Sense Protection Barring Commercial Adult Web Pornographers from Exploiting Vulnerable Children Online", "10 = Unconstitutional Free Speech Violation Chilling Legitimate Adult Artistic and Health Expression Under Vague Obscenity Standards", 2, 8, 3, 1, 9, 1);

add(1998, "1998_securities_litigation_uniform_standards_act", "Securities Litigation Uniform Standards Act of 1998 (SLUSA)", "News", "1998 (SLUSA Enacted)", "Economy & Taxation", 2,
  "Preempting state-court class action securities fraud lawsuits to prevent trial lawyers from evading the 1995 Private Securities Litigation Reform Act.",
  "1 = Necessary Reform Stopping Strike-Suit Trial Lawyers from Extorting High-Tech Silicon Valley Companies in State Courts Over Volatile Stocks", "10 = Unwarranted Preemption of Traditional State Blue-Sky Fraud Protections Depriving Defrauded Investors of Remedies", 2, 8, 9, 1, 8, 1);

add(1998, "1998_digital_television_transition_begins", "First Commercial Digital Television (DTV) High-Definition Broadcasts Begin", "News", "1998 (Digital TV Transition Inception)", "Technology & Infrastructure", 2,
  "American television stations beginning high-definition digital broadcasts, inaugurating multi-year federal transition to reclaim analog broadcast spectrum.",
  "1 = Magnificent Leap in Broadcast Clarity and Technological Modernization Freeing Up Valuable Wireless Spectrum for Public Safety", "10 = Sound Transition, Provided Regulators Ensure Millions of Everyday Families Are Not Cut Off from Free Over-the-Air Television", 2, 7, 7, 2, 7, 1);

add(1998, "1998_fda_modernization_act_implementation", "Implementation of the Food and Drug Administration Modernization Act (FDAMA)", "News", "1997-1998 (FDAMA Regulatory Implementation)", "Healthcare", 2,
  "Streamlining clinical trials, authorizing off-label dissemination of medical journal articles to physicians, and establishing ClinicalTrials.gov.",
  "1 = Progressive Modernization Expanding Accelerated Approval for Life-Saving Drugs and Empowering Doctors with Latest Clinical Research", "10 = Dangerous Loopholes Permitting Big Pharma to Market Drugs for Unapproved Uses Free from Rigorous FDA Evidence", 2, 8, 8, 1, 8, 1);

add(1998, "1998_persian_gulf_war_veterans_act_of_1998", "Enactment of the Persian Gulf War Veterans Act of 1998", "News", "1998 (Gulf War Veterans Act)", "Healthcare", 2,
  "Directing the National Academy of Sciences to review toxic chemical exposures and establishing presumption of service connection for chronic disabilities.",
  "1 = Sacred Moral Debt Acknowledging the Unexplained Medical Agonies of Gulf War Combat Veterans and Mandating Transparent Science", "10 = Dedicated Medical Care for Desert Storm Heroes, Guided by Peer-Reviewed Scientific Research into Actual Toxic Exposures", 2, 8, 6, 1, 8, 1);

add(1998, "1998_clean_water_action_plan_clinton_gore", "Clinton-Gore White House Clean Water Action Plan", "News", "1998 (Clean Water Action Plan)", "Energy & Climate", 2,
  "Targeting non-point source agricultural runoff, animal feeding operations (CAFOs), and coastal polluted runoff with $2.3 billion in federal initiatives.",
  "1 = Essential Focus Tackling Non-Point Agricultural Pollution That Remains the Largest Unaddressed Threat to Rivers and Bays", "10 = Backdoor Federal Power Grab Regulating Everyday Family Farms and Ranches Free from Explicit Congressional Statutory Authority", 2, 8, 8, 1, 8, 1);

add(1998, "1998_grand_staircase_escalante_land_exchange", "Enactment of the Utah Schools and Lands Exchange Act of 1998", "News", "1998 (Grand Staircase Land Exchange)", "Energy & Climate", 2,
  "Federal trade swapping 376,000 acres of state trust lands locked inside Grand Staircase monument for $50M cash and 139,000 acres of federal mineral lands elsewhere.",
  "1 = Fair Creative Resolution Providing Millions for Utah Public Schools While Protecting Majestic Red-Rock National Monuments", "10 = Pragmatic Bipartisan Solution Compensating Utah Schoolchildren for the Arbitrary Lockup of Their High-Value State Mineral Lands", 2, 8, 8, 1, 8, 1);

add(1998, "1998_iridium_satellite_constellation_launches", "Iridium Constellation Begins First Commercial Global Satellite Phone Service", "News", "1998 (Iridium Satellite Communications)", "Technology & Infrastructure", 3,
  "Motorola-backed $5 billion constellation of 66 low-Earth orbit satellites launching first handheld global satellite phone communications.",
  "1 = Spectacular Engineering Triumph Achieving Universal Worldwide Voice Communication Even at the North Pole and Mid-Ocean", "10 = Astounding Private High-Tech Investment, Though $3,000 Handsets and $7/Minute Call Rates Challenge Commercial Viability", 2, 7, 9, 2, 8, 1);

add(1998, "1998_kosovo_diplomatic_crisis_nato_ultimatum", "Kosovo Crisis Intensifies: NATO Issues Activation Order for Airstrikes", "News", "1998 (Kosovo NATO Activation Order)", "Foreign Policy & Defense", 1,
  "Serbian security forces massacring ethnic Albanians in Kosovo; NATO issues formal warning of impending airstrikes against Slobodan Milosevic's regime.",
  "1 = Moral Imperative Deploying Credible NATO Force to Prevent a Repeat of the Horrific Bosnian Genocide in Kosovo", "10 = Unconstitutional Warmaking Threatening Offensive Military Strikes on Sovereign Serbia Without Congressional Approval or UN Mandate", 2, 8, 4, 1, 8, 1);

add(1998, "1998_house_judiciary_committee_expands_inquiry", "House Judiciary Committee Expands Clinton Impeachment Inquiry", "News", "1998 (House Judiciary Impeachment Probe)", "Governance & Judiciary", 1,
  "Judiciary Committee Chairman Henry Hyde leading open-ended hearings calling Ken Starr, focusing on 11 grounds of impeachable offenses.",
  "1 = Partisan Grudge Match Dragging Down the Dignity of Congress in a Reckless Attempt to Nullify the Ballots of 47 Million Americans", "10 = Solemn Constitutional Duty Following the Facts Where They Lead to Protect the Integrity of Federal Courts and the Rule of Law", 2, 10, 4, 1, 10, 1);

add(1998, "1998_release_of_starr_report_crashing_servers", "House Releases Starr Report Online (20 Million Simultaneous Downloads)", "News", "1998 (Starr Report Web Sensation)", "Governance & Judiciary", 1,
  "House voting 363-63 to publish the unexpurgated Starr Report on the Internet, creating the largest simultaneous online readership in history.",
  "1 = Shameless Exploitation of Raw Unverified Sordid Details to Titillate the Public and Discredit the First Family", "10 = Magnificent Example of Democratic Openness and Instant Sunlight Empowering Every American Citizen to Read the Evidence Directly", 2, 8, 3, 1, 8, 1);

add(1998, "1998_us_embassy_security_inman_standard_overhaul", "Admiral Crowe Report & Emergency $1.4 Billion Embassy Security Overhaul", "News", "1998 (Embassy Security Post-Bombings)", "Foreign Policy & Defense", 1,
  "Following the Nairobi and Dar es Salaam truck bombings, emergency commission mandates 100-foot security setbacks and hardened construction for all U.S. embassies.",
  "1 = Urgent Moral Obligation Safeguarding American Diplomats and Foreign Service Staff Serving Under Deadly Terrorist Threats", "10 = Bipartisan Priority Rebuilding Vulnerable Diplomatic Outposts as Hardened Fortresses to Project Resilient American Power", 2, 8, 5, 1, 8, 1);

add(1998, "1998_chemical_weapons_convention_implementation", "Enactment of the Chemical Weapons Convention Implementation Act of 1998", "News", "1998 (CWC Implementation Enacted)", "Foreign Policy & Defense", 1,
  "Passing legislation establishing federal criminal penalties and commercial chemical plant inspection frameworks under the 1997 Chemical Weapons Convention.",
  "1 = Crucial Multilateral Non-Proliferation Step Banishing Lethal Chemical Poison Gas Weapons from the Global Military Arsenals", "10 = Protect American Sovereignty and Commercial Trade Secrets from Intrusive Search and Seizure by Foreign Treaty Inspectors", 2, 8, 4, 1, 8, 1);

console.log('Bracket E (1992-1998) total issues:', ISSUES.length);

module.exports = ISSUES;
