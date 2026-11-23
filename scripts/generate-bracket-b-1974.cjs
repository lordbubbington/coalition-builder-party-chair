/**
 * scripts/generate-bracket-b-1974.cjs
 * Appends 1974 issues to scripts/build-issues-1968-1974.cjs and finalizes the file.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build-issues-1968-1974.cjs');
let content = fs.readFileSync(filePath, 'utf8');

const additions = `
// =========================================================================
// 1974 (50 Issues)
// =========================================================================
add(1974, "1974_house_judiciary_nixon_impeachment_hearings", "House Judiciary Committee Impeachment Hearings of Richard Nixon", "News", "1974 (Nixon Impeachment Proceedings)", "Governance & Judiciary", 1,
  "House Judiciary Committee passing three bipartisan articles of impeachment against President Nixon for obstruction of justice, abuse of power, and contempt of Congress.",
  "1 = Essential Constitutional Defense of Rule of Law and Republic Against Tyrannical Presidential Lawlessness", "10 = Partisan Witch Hunt Concocted by Hostile Democratic Majorities to Overturn the 1972 49-State Landslide Election", 2, 9, 3, 1, 8, 1);

add(1974, "1974_smoking_gun_tape_and_nixon_resignation", "Release of the 'Smoking Gun' White House Tape & Nixon's Resignation", "News", "1974 (Nixon Resignation Crisis)", "Governance & Judiciary", 1,
  "Release of June 23, 1972 White House audio recording proving Nixon ordered the CIA to halt the FBI's Watergate probe, prompting his historic resignation on August 9.",
  "1 = Vindicating the Supreme Court and Constitution: No Man, Not Even the President, Is Above the Law", "10 = Heartbreaking Tragedy of a Great Patriotic Cold War Statesman Brought Down by Ruthless Political Enemies", 2, 9, 3, 1, 8, 1);

add(1974, "1974_gerald_ford_unconditional_nixon_pardon", "Gerald Ford's Unconditional Presidential Pardon of Richard Nixon", "News", "1974 (Ford Pardon Backlash)", "Governance & Judiciary", 1,
  "President Ford granting Richard Nixon a full, free, and absolute pardon for all federal crimes committed during his presidency, igniting public outrage and ending Ford's honeymoon.",
  "1 = Corrupt Backroom Deal Robbing the American People of Justice and Establishing a Grotesque Double Standard of Law", "10 = Courageous, Merciful Act of Christian Healing Necessary to End the Long National Nightmare and Unify the Republic", 2, 10, 5, 1, 9, 1);

add(1974, "1974_first_opec_oil_embargo_gas_lines", "1973-1974 First OPEC Oil Embargo, Quadrupling Crude Prices & Gas Lines", "News", "1973-1974 (OPEC Oil Shock)", "Energy & Climate", 1,
  "Arab OPEC nations cutting oil exports to the U.S. over its support for Israel in the Yom Kippur War, quadrupling world crude prices and triggering odd-even gas rationing lines.",
  "1 = Aggressive National Conservation, Severe Price Ceilings on Greedy Big Oil, and Emergency Windfall Taxes", "10 = Immediate Decontrol of Domestic Petroleum Prices to Incentivize Massive American Drilling and Break Cartel Power", 2, 8, 9, 1, 9, 1);

add(1974, "1974_double_digit_stagflation_crisis", "1974 Stagflation Surge: Double-Digit Inflation (11%) & Deepening Recession", "News", "1974-1975 (Stagflation Shock)", "Economy & Taxation", 1,
  "American economy plunged into unprecedented stagflation with 11% consumer price inflation coupled with negative GDP growth and rising unemployment.",
  "1 = Protect Vulnerable Working Families with Strong Price Monitoring, Unemployment Benefits, and Public Job Creation", "10 = Slashing Federal Profligate Deficit Spending and Deregulating Industry to Unleash Free-Market Supply-Side Growth", 2, 9, 10, 1, 9, 1);

add(1974, "1974_gerald_ford_whip_inflation_now_win", "President Ford's 'Whip Inflation Now' (WIN) Voluntary Conservation Campaign", "News", "1974 (WIN Campaign)", "Economy & Taxation", 1,
  "President Ford unveiling WIN buttons and voluntary citizens' pledges to conserve energy, plant vegetable gardens, and curb consumer spending.",
  "1 = Laughably Ineffective, Superficial PR Gimmick While Real Wages Collapse and Corporate Monopolies Price-Gouge", "10 = Well-Intentioned Patriotic Appeal to Civic Virtue and Personal Frugality Rather Than Crushing Federal Mandates", 2, 8, 7, 2, 8, 1);

add(1974, "1974_employee_retirement_income_security_act_erisa", "Enactment of the Employee Retirement Income Security Act of 1974 (ERISA)", "News", "1974 (ERISA Enactment)", "Labor & Welfare", 1,
  "Landmark federal statute establishing minimum standards for private pension plans and creating the Pension Benefit Guaranty Corporation (PBGC) to protect workers from corporate bankruptcy.",
  "1 = Monumental Shield Protecting Millions of Working Americans from Losing Hard-Earned Life Savings When Plants Shutter", "10 = Overly Complex Fiduciary Burdens and Heavy Compliance Costs Causing Employers to Abandon Defined-Benefit Pensions", 2, 8, 9, 1, 9, 1);

add(1974, "1974_safe_drinking_water_act_enacted", "Enactment of the Safe Drinking Water Act of 1974 (SDWA)", "News", "1974 (SDWA Enactment)", "Energy & Climate", 1,
  "Directing the EPA to establish mandatory maximum contaminant levels for all public drinking water systems nationwide to eliminate carcinogens and industrial waste.",
  "1 = Essential Human Right Guaranteeing Pure, Safe, Toxin-Free Tap Water for Every Citizen Across the Republic", "10 = Unfunded Federal Mandate Imposing Billions in Crushing Water Filtration Upgrades on Small Rural Towns and Municipalities", 2, 8, 8, 1, 8, 1);

add(1974, "1974_trade_act_jackson_vanik_amendment", "Trade Act of 1974 & Enactment of the Jackson-Vanik Amendment", "News", "1974 (Jackson-Vanik Soviet Emigration)", "Foreign Policy & Defense", 1,
  "Bipartisan amendment denying Most Favored Nation (MFN) trade status and commercial credits to the USSR unless it allows free emigration for Soviet Jews and dissidents.",
  "1 = Noble Moral Principle Tying American International Trade to Fundamental Human Rights and Freedom of Conscience", "10 = Destructive Congressional Meddling Sabotaging Strategic Nuclear Detente and Provoking Moscow into Harder Repression", 2, 7, 5, 1, 8, 1);

add(1974, "1974_war_powers_resolution_veto_override", "Enactment of the War Powers Resolution of 1973 (Veto Override)", "News", "1973-1974 (War Powers Resolution Enactment)", "Foreign Policy & Defense", 1,
  "Congress overriding Nixon's veto to require the President to notify Congress within 48 hours of deploying armed forces and withdraw them within 60 days without statutory authorization.",
  "1 = Essential Rebalancing of Constitutional Checks and Balances Halting Imperial, Unchecked Presidential Warmaking", "10 = Dangerous, Unconstitutional Infringement on Commander-in-Chief Authority Paralyzing America's Ability to Respond to Crises", 2, 9, 3, 1, 9, 1);

add(1974, "1974_congressional_budget_and_impoundment_control_act", "Congressional Budget and Impoundment Control Act of 1974 (CBO & Impoundment Ban)", "News", "1974 (CBO & Budget Act Enactment)", "Governance & Judiciary", 1,
  "Creating the Congressional Budget Office (CBO) and House/Senate Budget Committees while stripping the President of authority to unilaterally impound appropriated funds.",
  "1 = Reclaim the Constitutional Power of the Purse and Provide Congress with Independent, Non-Partisan Fiscal Analysis", "10 = Deprives the Chief Executive of the Line-Item Impoundment Veto Needed to Strike Down Bloated Congressional Pork", 2, 8, 6, 1, 8, 1);

add(1974, "1974_feca_amendments_fec_creation", "Federal Election Campaign Act Amendments of 1974 (FEC Creation & Spending Limits)", "News", "1974 (FECA Amendments Post-Watergate)", "Governance & Judiciary", 1,
  "Sweeping post-Watergate overhaul establishing strict individual contribution limits ($1,000), public funding for presidential campaigns, and creating the Federal Election Commission (FEC).",
  "1 = Clean Up Dirty Campaign Financing, Purge Secret Corporate Bribery, and Restore Equal Integrity to Our Elections", "10 = Unconstitutional Stifling of Free Political Speech and Association Imposing Bureaucratic Red Tape on Citizen Campaigns", 2, 8, 9, 1, 9, 1);

add(1974, "1974_privacy_act_and_post_watergate_foia", "Enactment of the Privacy Act of 1974 & Post-Watergate FOIA Amendments", "News", "1974 (FOIA Expansion & Privacy Act)", "Governance & Judiciary", 1,
  "Overriding Ford's veto to vastly strengthen the Freedom of Information Act (FOIA) and establishing the Privacy Act to protect citizens' federal dossier records from secret abuse.",
  "1 = Indispensable Sunlight Exposing Secret Government Abuse, Illegal Wiretaps, and Restoring Democratic Accountability", "10 = Excessive Disclosure Jeopardizing Sensitive National Security Secrets and Inundating Agencies with Harassing Requests", 2, 8, 2, 1, 7, 1);

add(1974, "1974_nelson_rockefeller_vice_presidential_confirmation", "Nelson Rockefeller 25th Amendment Confirmation & Family Wealth Hearings", "News", "1974 (Rockefeller VP Confirmation)", "Governance & Judiciary", 2,
  "Four months of Senate hearings dissecting the immense Standard Oil fortune, gifts, and foundation ties of Ford's designated Vice President Nelson Rockefeller.",
  "1 = Thorough Necessary Scrutiny Proving Massive Concentrated Dynastic Wealth Cannot Buy the Nation's Second-Highest Office", "10 = Unjust Harassment of an Experienced, Generous Public Servant Dedicated to National Service and Moderation", 3, 8, 7, 1, 8, 1);

add(1974, "1974_national_maximum_speed_limit_55_mph", "Enactment of the 55 MPH National Maximum Speed Limit", "News", "1974 (55 MPH Speed Limit Mandate)", "Energy & Climate", 1,
  "Federal statute conditioning highway matching funds on states lowering maximum highway speed limits to 55 mph to conserve gasoline during the oil embargo.",
  "1 = Sensible Emergency Measure Saving Billions of Gallons of Imported Fuel and Slashing Highway Traffic Fatalities", "10 = Heavy-Handed Federal Intrusion Arbitrarily Punishing Rural Western Motorists Driving Vast Open Highway Distances", 2, 8, 10, 1, 10, 1);

add(1974, "1974_united_states_v_nixon_executive_privilege", "United States v. Nixon Supreme Court Ruling on Executive Privilege", "News", "1974 (US v. Nixon Decision)", "Governance & Judiciary", 1,
  "Supreme Court ruling unanimously (8-0) that executive privilege is not absolute and cannot shield tape recordings from a criminal subpoena, forcing Nixon's surrender.",
  "1 = Historic Affirmation of the Core Rule of Law: The President Is Subject to the Judiciary and Judicial Subpoenas", "10 = Sound Ruling on Criminal Evidence, Provided Legitimate Confidential National Security Executive Communications Remain Protected", 2, 8, 3, 1, 8, 1);

add(1974, "1974_milliken_v_bradley_interdistrict_busing", "Milliken v. Bradley Supreme Court Ruling Barring Cross-District Busing", "News", "1974 (Milliken Busing Limits)", "Education", 1,
  "Supreme Court ruling 5-4 that federal courts cannot order inter-district busing between Detroit and its surrounding white suburbs absent proof of intentional suburban discrimination.",
  "1 = Tragic Decision Cementing Suburban Apartheid and Ensuring Inner-City Black Schools Remain Trapped in Segregated Poverty", "10 = Splendid Defense of Neighborhood Schools and Suburban Autonomy Free from Radical Desegregation Social Engineering", 2, 9, 8, 1, 10, 1);

add(1974, "1974_fall_of_south_vietnam_aid_cuts", "Congressional Cuts to Military Aid for South Vietnam & Cambodia", "News", "1974 (Indochina Aid Cutoffs)", "Foreign Policy & Defense", 1,
  "Congress slashing Ford's requested military and financial aid to the governments in Saigon and Phnom Penh by hundreds of millions, paving way for communist victory.",
  "1 = High Time to Stop Pouring Good American Taxpayer Dollars Down the Sinkhole of Corrupt Southeast Asian Dictatorships", "10 = Tragic, Dishonorable Desertion of Our Faithful South Vietnamese Allies Facing Direct Soviet-Armed Invasion", 2, 9, 4, 1, 9, 1);

add(1974, "1974_winter_daylight_saving_time_experiment_repeal", "Repeal of the Emergency Year-Round Winter Daylight Saving Time Experiment", "News", "1974 (Winter DST Experiment & Repeal)", "Energy & Climate", 3,
  "Congress voting to repeal winter daylight saving time after eight schoolchildren were killed walking to school in pitch black mornings across Florida and the nation.",
  "1 = Promptly Correct an Unintended Deadly Mistake and Protect Schoolchildren Walking to Morning Buses in the Dark", "10 = Keep Year-Round DST to Conserve Hundreds of Thousands of Barrels of Heating Oil and Power in an Energy Crisis", 2, 7, 6, 2, 7, 1);

add(1974, "1974_equal_credit_opportunity_act_ecoa", "Enactment of the Equal Credit Opportunity Act of 1974 (ECOA)", "News", "1974 (ECOA Enactment)", "Civil Rights & Social Issues", 1,
  "Federal statute prohibiting lenders and credit card companies from discriminating against loan applicants on the basis of sex or marital status.",
  "1 = Basic Economic Justice Enabling Women to Open Bank Accounts, Credit Cards, and Mortgages in Their Own Names Without Husbands", "10 = Support Fair Lending Criteria Based Strictly on Creditworthiness, Income, and Ability to Repay Debts", 2, 8, 4, 1, 9, 1);

add(1974, "1974_housing_and_community_development_section_8", "Housing and Community Development Act of 1974 (Creation of Section 8 & CDBG)", "News", "1974 (Section 8 Voucher Genesis)", "Labor & Welfare", 1,
  "Replacing failed federal public housing construction projects with Section 8 private rent subsidies and consolidating urban renewal into Community Development Block Grants (CDBG).",
  "1 = Pragmatic Compassionate Reform Providing Low-Income Families with Rental Vouchers to Integrate into Decent Communities", "10 = Subsidizing Private Landlords with Federal Tax Dollars While Expanding Local Government Spending Through Block Grants", 2, 8, 8, 1, 8, 1);

add(1974, "1974_legal_services_corporation_act_enacted", "Legal Services Corporation Act of 1974 (LSC Creation)", "News", "1974 (LSC Enactment)", "Governance & Judiciary", 2,
  "Nixon and Congress establishing the independent Legal Services Corporation (LSC) to provide federally funded civil legal aid to low-income Americans.",
  "1 = Fundamental Equal Justice Under Law Guaranteeing Poor Americans Qualified Legal Representation in Evictions and Benefits", "10 = Taxpayer-Funded Weapon Employed by Radical Activist Lawyers Filing Class Action Suits to Overturn Welfare and Tenant Laws", 2, 9, 8, 1, 9, 1);

add(1974, "1974_commodity_futures_trading_commission_cftc", "Commodity Futures Trading Commission Act of 1974 (Creation of CFTC)", "News", "1974 (CFTC Creation)", "Economy & Taxation", 2,
  "Creating an independent federal regulatory agency to oversee all futures and options trading in agricultural and financial commodities, replacing USDA division.",
  "1 = Essential Watchdog Curbing Predatory Market Speculation, Manipulations, and Fraud in Vital Grain and Resource Futures", "10 = Onerous Regulatory Paperwork and Intervention Stifling Liquidity and Free-Market Price Discovery on Chicago Exchanges", 2, 8, 9, 1, 8, 1);

add(1974, "1974_trans_alaska_pipeline_authorization_act", "Trans-Alaska Pipeline Authorization Act Bypassing NEPA Injunctions", "News", "1973-1974 (TAPS Construction Clearance)", "Energy & Climate", 1,
  "Congress passing emergency legislation declaring the environmental impact statement for the 800-mile Trans-Alaska Pipeline legally sufficient, barring further court challenges.",
  "1 = Dangerous Precedent Gutting Environmental Review Laws to Appease Massive Oil Conglomerates", "10 = Essential National Security Action Unleashing 2 Million Barrels a Day of American Crude to Break Arab Oil Embargoes", 2, 9, 9, 1, 9, 1);

add(1974, "1974_watergate_babies_democratic_midterm_sweep", "Post-Watergate Midterm Elections ('Watergate Babies' Democratic Landslide)", "News", "1974 (Watergate Midterm Wave)", "Governance & Judiciary", 1,
  "Democrats sweeping 49 additional House seats and 4 Senate seats, establishing veto-proof margins and electing reform-minded young liberals to Congress.",
  "1 = Resounding Mandate to Purge Executive Secrecy, Restructure Seniority Rules, and Advance Progressive Domestic Reforms", "10 = Reactionary Midterm Distortion Electing Dogmatic Anti-Military Liberals Who Will Weaken American Defense Around the World", 2, 9, 5, 1, 9, 1);

add(1974, "1974_ford_clemency_program_draft_resisters", "President Ford's Presidential Clemency Board for Draft Evaders & Deserters", "News", "1974 (Ford Clemency Program)", "Governance & Judiciary", 2,
  "Ford establishing an 'earned clemency' program requiring Vietnam draft resisters and deserters to perform up to two years of alternative public service.",
  "1 = Insufficient, Punitive Half-Measure Requiring Confessions of Guilt for Those Who Resisted an Immoral War / Grant Full Amnesty", "10 = Disgraceful Insult to Our Honored Fallen Soldiers Giving Leniency and Pardons to Traitors and Draft Dodgers", 2, 9, 3, 1, 10, 1);

add(1974, "1974_turkey_arms_embargo_cyprus_invasion", "Congressional Arms Embargo on Turkey Following Invasion of Cyprus", "News", "1974 (Cyprus Crisis & Turkey Embargo)", "Foreign Policy & Defense", 2,
  "Congress cutting off all U.S. military arms shipments to NATO ally Turkey over Ford and Kissinger's objections following Turkish military occupation of northern Cyprus.",
  "1 = Principled Adherence to U.S. Law Barring American Weapons from Being Used for Illegal Aggression and Invasion", "10 = Catastrophic Geopolitical Blunder Severely Damaging NATO's Vital Southern Flank and Closing American Intelligence Bases", 2, 8, 4, 1, 8, 1);

add(1974, "1974_juvenile_justice_and_delinquency_act", "Juvenile Justice and Delinquency Prevention Act of 1974 (JJDP)", "News", "1974 (JJDP Enactment)", "Governance & Judiciary", 2,
  "Federal statute requiring the 'sight and sound' separation of juvenile offenders from adult prisoners and deinstitutionalizing non-criminal status offenders (runaways).",
  "1 = Humane, Progressive Reform Preventing Vulnerable Youths from Being Terrorized and Hardened in Brutal Adult Prisons", "10 = Federal Meddling in State Courts That Weakens Law Enforcement's Hand Against Truant and Delinquent Teenagers", 2, 8, 5, 1, 8, 1);

add(1974, "1974_education_of_the_handicapped_pl_93_380", "Education of the Handicapped Amendments of 1974 (Precursor to IDEA)", "News", "1974 (Handicapped Education Enacted)", "Education", 2,
  "Expanding federal funding and mandating states adopt comprehensive plans to provide full educational opportunity to all children with disabilities.",
  "1 = Moral Obligation Ensuring Millions of Excluded Disabled Children Have Equal Access to Public Education and Classrooms", "10 = Massive Escalation of Federal Financial Commitments and Special Education Mandates on Local School Districts", 2, 8, 5, 1, 8, 1);

add(1974, "1974_sugar_act_expiration_and_price_spike", "Expiration of the Sugar Act of 1934 & Surging Retail Sugar Prices", "News", "1974 (Sugar Crisis)", "Agriculture & Food", 2,
  "Congress refusing to renew the 40-year-old Sugar Act quota system; domestic sugar prices skyrocket from 18 cents to 65 cents a pound, sparking consumer boycotts.",
  "1 = Expose the Price-Gouging Profiteering by Big Sugar Cartels and Protect Working Families from Grocery Extortion", "10 = High Market Prices Will Stimulate Domestic High-Fructose Corn Syrup and Beet Production; Free Markets Work", 2, 7, 9, 2, 7, 1);

add(1974, "1974_national_mass_transit_operating_subsidies", "National Mass Transportation Assistance Act of 1974 ($11.8B Operating Aid)", "News", "1974 (Mass Transit Operating Subsidies)", "Technology & Infrastructure", 2,
  "First federal legislation authorizing matching funds ($11.8B over six years) not only for subway capital construction, but for direct day-to-day bus/train transit operating costs.",
  "1 = Vital Energy-Saving Lifeline Keeping Urban Transit Fares Low and Providing Mobility for Millions of Commuters", "10 = Disastrous Open-Ended Federal Welfare Handout Directly Subsidizing Overpaid Municipal Transit Union Labor Costs", 2, 8, 8, 1, 9, 1);

add(1974, "1974_energy_reorganization_act_nrc_erda", "Energy Reorganization Act of 1974 (Abolishing AEC / Creating NRC and ERDA)", "News", "1974 (AEC Split & NRC Creation)", "Energy & Climate", 1,
  "Abolishing the Atomic Energy Commission due to inherent conflict between promotion and regulation; creating the Nuclear Regulatory Commission (NRC) and ERDA.",
  "1 = Essential Separation Eliminating Corrupt Atomic Boosterism and Subjecting Nuclear Commercial Reactors to Strict Safety Rules", "10 = Bureaucratic Splitting That Paralyzes Nuclear Licensing and Threatens America's Next-Generation Commercial Energy Future", 2, 8, 8, 1, 8, 1);

add(1974, "1974_ceta_emergency_public_jobs_expansion", "Emergency Jobs and Unemployment Assistance Act of 1974 (CETA Public Jobs)", "News", "1974 (CETA Emergency Public Jobs)", "Labor & Welfare", 1,
  "Expanding the Comprehensive Employment and Training Act (CETA) to provide hundreds of thousands of federally funded public service jobs to counter 7% unemployment.",
  "1 = Compassionate Direct Action Giving Dignified Paychecks and Honest Public Works Jobs to Unemployed Americans", "10 = Wasteful Make-Work 'Leaf-Raking' Patronage Boondoggles Padding Local Government Payrolls on the Federal Dime", 2, 9, 9, 1, 9, 1);

add(1974, "1974_ferpa_buckley_amendment_student_privacy", "Family Educational Rights and Privacy Act of 1974 (FERPA / Buckley Amendment)", "News", "1974 (FERPA Enacted)", "Education", 2,
  "Granting parents and adult students the right to inspect all official academic files and prohibiting schools from releasing educational records without consent.",
  "1 = Long-Overdue Defense of Student Privacy Rights Halting Secret Bureaucratic Blacklisting and Invasive School Dossiers", "10 = Burdensome Federal Red Tape Paralyzing College Recommendation Letters and Disciplinary Communications", 2, 7, 3, 1, 7, 1);

add(1974, "1974_deepwater_port_act_of_1974", "Enactment of the Deepwater Port Act of 1974 (Offshore Supertanker Terminals)", "News", "1974 (Deepwater Port Enactment)", "Energy & Climate", 3,
  "Establishing a federal licensing framework for private construction and environmental operation of deepwater offshore ports able to moor giant crude supertankers.",
  "1 = Safeguard Sensitive Gulf and Atlantic Shorelines from Catastrophic Supertanker Collisions and Spills Through Strict Federal Oversight", "10 = Expedite Offshore Deepwater Moorings to Slash Petroleum Transportation Costs and Secure Energy Supplies", 2, 8, 8, 1, 8, 1);

add(1974, "1974_eastern_wilderness_areas_act", "Eastern Wilderness Areas Act of 1975 (Designating 16 Eastern National Forest Tracts)", "News", "1974-1975 (Eastern Wilderness Enactment)", "Energy & Climate", 2,
  "Protecting 200,000 acres of previously cut-over, recovering national forests in the eastern United States under the strict protections of the 1964 Wilderness Act.",
  "1 = Inspiring Conservation Victory Affirming That Recovering Nature in the Populous East Deserves Permanent Wilderness Protection", "10 = Rigid Wilderness Lockups Barring Multiple-Use Recreation, Forest Fire Management, and Sustainable Timber Harvesting", 2, 8, 8, 1, 8, 1);

add(1974, "1974_super_tornado_outbreak_disaster_relief", "Super-Tornado Outbreak of April 3-4, 1974 & Disaster Relief Act Overhaul", "News", "1974 (Super Outbreak & Disaster Relief Act)", "Governance & Judiciary", 2,
  "Deadliest tornado outbreak in U.S. history (148 twisters, 319 dead) spurring enactment of the Disaster Relief Act of 1974 overhauling federal emergency grants.",
  "1 = Expand Generous Federal Grants and Temporary Housing to Rebuild Shattered Communities and Save Lives", "10 = Ensure Federal Disaster Aid Complements, Rather Than Replaces, Private Property Insurance and Local Civic Charity", 2, 7, 6, 1, 7, 1);

add(1974, "1974_rpa_forest_renewable_resources_planning", "Forest and Rangeland Renewable Resources Planning Act of 1974 (RPA)", "News", "1974 (RPA Enacted)", "Energy & Climate", 3,
  "Requiring the U.S. Forest Service to produce comprehensive 50-year renewable resource assessments and multi-year management programs for public timberlands.",
  "1 = Scientifically Balance Long-Term Ecological Conservation, Wildlife Habitats, and Sustainable Multiple-Use Public Forest Management", "10 = Prevent Bureaucratic Forest Assessments from Artificially Slashing Commercial Timber Harvests Essential for Housing", 2, 8, 8, 1, 8, 1);

add(1974, "1974_international_energy_agency_creation", "Establishment of the International Energy Agency (IEA) in Response to OPEC", "News", "1974 (IEA Creation)", "Energy & Climate", 2,
  "U.S. leading creation of an autonomous international agency among 16 Western industrialized democracies to coordinate emergency oil stockpiles and sharing.",
  "1 = Essential Multilateral Coordination Unifying Western Consumer Nations to Defend Against Predatory OPEC Embargoes", "10 = Bureaucratic Globalist Cartel That Diverts American Strategic Fuel Reserves to Foreign Nations in Emergencies", 2, 8, 7, 1, 8, 1);

add(1974, "1974_legalization_of_private_gold_ownership", "Congressional Legalization of Private Gold Ownership (Effective Jan 1, 1975)", "News", "1974 (Private Gold Legalization)", "Economy & Taxation", 2,
  "Congress repealing FDR's 1933 emergency ban on American citizens owning monetary gold bullion, permitting private gold holding for the first time in 41 years.",
  "1 = A Step in Currency Deregulation, Though Everyday Workers Need Protection Against Deceptive Bullion Speculators", "10 = Monumental Triumph for Economic Liberty Restoring Citizens' God-Given Right to Hold Real Sound Money Free from Government Confiscation", 3, 8, 10, 1, 10, 2);

add(1974, "1974_faa_mandatory_airport_metal_detectors", "FAA Enforcement of 100% Airport Baggage Searches & Magnetometers", "News", "1973-1974 (Airport Screening Mandate)", "Foreign Policy & Defense", 2,
  "Enforcing federal rules requiring all commercial airline passengers to pass through metal detector arches and have all carry-on luggage searched.",
  "1 = Successful Precaution Virtually Eliminating Skyjackings to Cuba and Protecting Millions of Everyday Travelers", "10 = Excessive Police-State Search Routine Violating Fourth Amendment Privacy of Innocent American Travelers at Airports", 2, 8, 7, 1, 8, 1);

add(1974, "1974_federal_fire_prevention_and_control_act", "Federal Fire Prevention and Control Act of 1974 (Creation of USFA)", "News", "1974 (Fire Prevention Enacted)", "Healthcare", 3,
  "Establishing the United States Fire Administration (USFA) and National Fire Academy to reduce America's horrific fire death rate (12,000 deaths annually).",
  "1 = Vital National Investment Training Firefighters, Modernizing Equipment, and Slashing Tragic Residential Fire Casualties", "10 = Fire Protection Is a Fundamentally Local Municipal Function; Avoid Creeping Federal Preemption of City Departments", 2, 7, 6, 1, 7, 1);

add(1974, "1974_white_house_project_independence_energy", "Nixon & Ford White House 'Project Independence' (Goal of 1980 Energy Autarky)", "News", "1973-1974 (Project Independence)", "Energy & Climate", 2,
  "Administration goal to eliminate all foreign oil imports by 1980 through domestic nuclear energy, coal conversion, Alaskan oil, and deregulation.",
  "1 = Flawed Plan Leaning Heavily on Dirty Coal and Dangerous Nuclear; Focus Instead on Aggressive Energy Conservation and Solar", "10 = Visionary National Mission Unleashing All Domestic Energy Resources (Nuclear, Coal, Oil) to Guarantee American Sovereignty", 2, 9, 8, 1, 9, 1);

add(1974, "1974_solar_energy_rd_act_of_1974", "Enactment of the Solar Energy Research, Development, and Demonstration Act of 1974", "News", "1974 (Solar Energy Enacted)", "Energy & Climate", 2,
  "Authorizing $75 million for federal research and demonstration of solar heating and cooling systems for commercial and residential buildings.",
  "1 = Pioneering Strategic Investment Accelerating the Inevitable Transition to Inexhaustible, Clean Solar Energy", "10 = Premature Government Subsidization of Immature Technologies That Must Prove Their Worth in the Free Market First", 2, 7, 8, 1, 8, 1);

add(1974, "1974_no_fault_divorce_revolution_states", "Wave of State Enactments of 'No-Fault Divorce' Statutes Across the Nation", "News", "1970-1975 (No-Fault Divorce Wave)", "Civil Rights & Social Issues", 2,
  "Over 40 state legislatures passing no-fault divorce laws allowing marriage dissolution on grounds of irreconcilable differences without proving adultery or cruelty.",
  "1 = Compassionate Civil Liberation Ending Perjurious Sham Trials and Freeing Millions of Spouses from Abusive Marriages", "10 = Catastrophic Destruction of the Sacred Marriage Covenant Fueling Broken Homes and Fatherless Families Across America", 2, 8, 3, 1, 10, 1);

add(1974, "1974_title_ix_athletic_regulations_pushback", "HEW Proposed Title IX Regulations & College Football Coaching Backlash", "News", "1974 (Title IX Regulations Battle)", "Education", 2,
  "NCAA and college football coaches lobbying Congress to exempt revenue-generating athletic sports from Title IX gender equity mandates.",
  "1 = Reject All Loopholes / Equal Opportunity for Female Athletes Must Apply to Every Single Campus Athletic Program", "10 = Protect Historic Revenue-Generating College Football Programs That Finance All Other Olympic and Minor Sports", 2, 8, 5, 1, 9, 1);

add(1974, "1974_metric_conversion_act_congressional_debates", "Debate over the Proposed Metric Conversion Act & Grassroots Cultural Backlash", "News", "1974-1975 (Metric Conversion Debate)", "Governance & Judiciary", 3,
  "Congressional proposals to transition the United States to the metric system (liters, kilograms, Celsius) sparking resistance from carpenters, machinists, and truckers.",
  "1 = Rational, Modern Standardization Aligning American Commerce and Science with the Universal Global Economy", "10 = Reject Cultural Alienation / Defend Traditional American Inches, Gallons, and Miles from Globalist Bureaucratic Mandates", 2, 7, 7, 1, 9, 1);

add(1974, "1974_nixon_comprehensive_health_insurance_proposal", "Nixon's Comprehensive Health Insurance Plan (CHIP) / Universal Health Debates", "News", "1974 (Nixon-Kennedy Health Compromise Talks)", "Healthcare", 2,
  "Nixon and Ted Kennedy negotiating a compromise national healthcare plan mandating employer coverage, federal cost sharing, and expanded Medicaid.",
  "1 = Golden Opportunity to Guarantee Comprehensive Universal Healthcare for Every American Citizen Lost to Partisan Stalling", "10 = Massive Expansion of Compulsory Employer Mandates and Federal Control Over Private Medical Practice", 2, 8, 9, 1, 9, 1);

add(1974, "1974_busing_riots_in_south_boston", "Violent School Busing Clashes and Boycotts in South Boston", "News", "1974 (Boston Busing Crisis)", "Education", 1,
  "Federal Judge Garrity ordering massive forced busing between South Boston and Roxbury, sparking violent white street protests, school boycotts, and rock throwing.",
  "1 = Enforce Federal Court Civil Rights Decrees with U.S. Marshals / Racism in Northern Cities Cannot Be Tolerated", "10 = Outrageous Judicial Tyranny Destroying Close-Knit Working-Class Neighborhoods and Forcing Children into Hostile Environments", 2, 10, 8, 1, 10, 1);

add(1974, "1974_cia_operation_chaos_domestic_spying_revelations", "Seymour Hersh NYT Exposé of CIA Domestic Spying (Operation CHAOS)", "News", "1974-1975 (CIA Domestic Spying Exposé)", "Governance & Judiciary", 1,
  "New York Times revealing massive illegal CIA domestic surveillance program maintaining files on 10,000 anti-war and civil rights activists in violation of CIA charter.",
  "1 = Chilling Police-State Lawlessness Demanding Sweeping Congressional Investigations and Criminal Indictments of Intelligence Chiefs", "10 = Maintain Vital National Security Counterintelligence Protecting the Homeland from Foreign-Directed Terror and Subversion", 2, 9, 1, 1, 8, 1);

console.log('Bracket B (1968-1974) total issues:', ISSUES.length);

module.exports = ISSUES;
`;

content += additions;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Appended 1974 and finalized Bracket B.');
