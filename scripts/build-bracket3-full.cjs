/**
 * scripts/build-bracket3-full.cjs
 * Generates full issue array for Bracket 3 (2016, 2018, 2020, 2022)
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
// 2016 (52 Issues)
// =========================================================================
add(2016, "2016_trump_southern_border_wall", "Trump Southern Border Wall Proposal & Mexican Funding", "News", "2015-2021 (Border Wall Construction Arc)", "Immigration & Border", 1,
  "Building an impenetrable physical concrete/steel wall along the entire 1,954-mile southern border and forcing Mexico to pay.",
  "1 = Oppose Ineffective, Inhumane Border Walls / Focus on Modern Ports of Entry", "10 = Build the Wall Across Entire Border / Stop Illegal Immigration Cold", 2, 10, 4, 1, 10, 1);

add(2016, "2016_hillary_clinton_email_server", "Hillary Clinton Private Email Server & Comey FBI Investigations", "News", "2015-2016 (Email Controversy Arc)", "Governance & Judiciary", 1,
  "Investigating Hillary Clinton's use of an unclassified private server while Secretary of State and handling of classified emails.",
  "1 = Classified Information Handled Carelessly but No Criminal Intent Found", "10 = Prosecute Clinton for Willful Violation of Federal Records and Espionage Laws", 2, 10, 6, 2, 9, 1);

add(2016, "2016_repeal_replace_obamacare", "Complete Statutory Repeal and Replacement of the Affordable Care Act", "News", "2010-2020 (Repeal and Replace Campaign)", "Healthcare", 1,
  "GOP pledge to repeal Obamacare 'root and branch' and replace it with free-market health savings accounts and interstate sales.",
  "1 = Defend and Expand the ACA / Move Toward Medicare for All", "10 = Full Immediate Statutory Repeal of Every Word of Obamacare", 2, 10, 10, 1, 10, 1);

add(2016, "2016_scalia_vacancy_merrick_garland", "Antonin Scalia Supreme Court Vacancy & Senate Refusal to Hear Garland", "News", "2016 (Supreme Court Balance Showdown)", "Governance & Judiciary", 1,
  "Mitch McConnell refusing to hold confirmation hearings for Merrick Garland to allow the next president to fill Scalia's seat.",
  "1 = Hold Hearings and Confirm Garland Immediately Under Senate Duty", "10 = Let the Voters Decide / Preserve Conservative Majority with Originalist Justice", 2, 10, 7, 1, 10, 1);

add(2016, "2016_tpp_rejection_trade_populism", "Bipartisan Rejection of the Trans-Pacific Partnership (TPP)", "News", "2015-2017 (Trade Realignment Arc)", "Trade & Globalism", 1,
  "Both major presidential nominees rejecting the 12-nation TPP agreement, marking the end of the 25-year bipartisan free trade consensus.",
  "1 = Kill the TPP / Stop Disastrous Trade Deals That Export Good American Jobs", "10 = Ratify TPP to Anchor U.S. Geopolitical Alliances Against Chinese Hegemony", 2, 3, 7, 1, 2, 1);

add(2016, "2016_russian_election_interference_dnc", "Russian State Cyber Hacking of DNC & Podesta Emails (Guccifer 2.0)", "News", "2016-2020 (Russiagate Investigation Arc)", "Foreign Policy & Defense", 1,
  "Russian GRU intelligence hacking and leaking private DNC and Clinton campaign emails via WikiLeaks to disrupt the election.",
  "1 = Impose Severe Retaliatory Sanctions on Russia / Protect Democratic Infrastructure", "10 = Reject Distraction Excusing Clinton Failures / Seek Friendly Relations with Russia", 2, 8, 4, 2, 7, 1);

add(2016, "2016_muslim_travel_ban_proposal", "Donald Trump's Proposed Temporary Ban on Muslim Immigration", "News", "2015-2018 (Travel Ban Arc)", "Civil Rights & Social Issues", 1,
  "Calling for a 'total and complete shutdown of Muslims entering the United States until our country's representatives can figure out what is going on'.",
  "1 = Unconstitutional Religious Discrimination That Violates Fundamental American Values", "10 = Extreme Vetting to Protect Homeland from Radical Islamic Terrorism", 2, 10, 2, 1, 10, 1);

add(2016, "2016_bernie_sanders_political_revolution", "Bernie Sanders Democratic Socialist Primary Challenge & DNC Leaks", "News", "2015-2016 (Progressive Revolt)", "Economy & Taxation", 2,
  "Mobilizing millions of small-dollar donors for single-payer healthcare, tuition-free college, and breaking up big banks.",
  "1 = Champion the Political Revolution Against the Corporate Billionaire Class", "10 = Reject Radical Socialist Redistribution Disastrous to American Prosperity", 3, 10, 9, 1, 10, 1);

add(2016, "2016_iran_nuclear_deal_jcpoa", "Implementation and Defense of the Iran Nuclear Deal (JCPOA)", "News", "2015-2018 (JCPOA Implementation Arc)", "Foreign Policy & Defense", 2,
  "Verifiable dismantling of Iran's enrichment centrifuges in exchange for lifting international oil and banking sanctions.",
  "1 = Honor the Landmark Agreement That Successfully Blocked All Pathways to a Bomb", "10 = Tear Up the Flawed Deal on Day One / Re-impose Crippling Sanctions", 2, 10, 4, 1, 9, 1);

add(2016, "2016_california_prop_64_cannabis", "California Proposition 64 (Adult-Use Marijuana Legalization)", "News", "2016 (California Cannabis Market Legalization)", "Civil Rights & Social Issues", 2,
  "Legalizing personal adult recreational possession of one ounce and licensing commercial cultivation and retail dispensaries.",
  "1 = Vote Yes / End Racially Biased Drug Arrests and Create Billions in Tax Revenues", "10 = Vote No / Protect Neighborhoods and Highways from Commercialized Drug Market", 2, 8, 1, 1, 9, 1);

add(2016, "2016_north_carolina_hb2_bathroom_bill", "North Carolina House Bill 2 & Transgender Public Restrooms", "News", "2016-2017 (Bathroom Bill Controversy)", "Civil Rights & Social Issues", 2,
  "State law requiring individuals to use multi-occupancy public restrooms matching the biological sex on their birth certificates.",
  "1 = Repeal Discriminatory HB2 / Protect Transgender Civil Rights and Dignity", "10 = Uphold Common-Sense Protections for Women's and Children's Privacy in Restrooms", 2, 10, 3, 1, 10, 1);

add(2016, "2016_standing_rock_dakota_access_dapl", "Dakota Access Oil Pipeline Protests at Standing Rock Sioux Tribe", "News", "2016-2017 (DAPL Indigenous Resistance)", "Energy & Climate", 2,
  "Thousands of indigenous water protectors camping to block crude pipeline crossing beneath Lake Oahe and ancestral treaty lands.",
  "1 = Halt Pipeline / Respect Tribal Sovereignty and Protect Missouri River Drinking Water", "10 = Disperse Lawless Protests / Complete Critical Energy Infrastructure", 2, 10, 8, 1, 9, 1);

add(2016, "2016_paris_climate_agreement_ratification", "Paris Climate Agreement Ratification & 26-28% Emission Pledge", "News", "2015-2021 (Paris Agreement Arc)", "Energy & Climate", 2,
  "Entering global climate accord pledging 26-28% U.S. greenhouse gas emissions reductions below 2005 levels by 2025.",
  "1 = Full U.S. Commitment to Lead Global Decarbonization and Green Tech Jobs", "10 = Withdraw from Unfair Paris Accord That Disadvantages American Industry to Benefit China", 2, 10, 9, 1, 10, 1);

add(2016, "2016_flint_water_crisis_lead_poisoning", "Flint Lead Drinking Water Poisoning & Federal Emergency Aid", "News", "2015-2017 (Flint Crisis Peak)", "Energy & Climate", 2,
  "State of emergency declared after 100,000 residents were exposed to neurotoxic lead due to state emergency manager cost-cutting.",
  "1 = Comprehensive Federal Infrastructure Aid and Criminal Prosecution of State Officials", "10 = Hold Negligent Bureaucrats Accountable While Maintaining State Fiscal Responsibility", 2, 8, 6, 1, 7, 1);

add(2016, "2016_pulse_nightclub_shooting_gun_filibuster", "Pulse Nightclub Massacre & Senate Democratic 'No Fly, No Buy' Filibuster", "News", "2016 (Post-Pulse Gun Filibuster)", "Civil Rights & Social Issues", 2,
  "Mass murder of 49 people at an LGBTQ nightclub in Orlando, sparking Chris Murphy's 15-hour Senate filibuster for gun reform.",
  "1 = Ban Assault Rifles & Enact 'No Fly, No Buy' Terror Watchlist Gun Restrictions", "10 = Protect Second Amendment and Due Process Against Secret Government Watchlists", 2, 10, 7, 1, 10, 2);

add(2016, "2016_third_party_surges_johnson_stein", "Gary Johnson (Libertarian) & Jill Stein (Green) Third-Party Surges", "News", "2016 (Third-Party Double Surge)", "Governance & Judiciary", 3,
  "Record-high polling for Libertarian and Green tickets as voters express historic dissatisfaction with Trump and Clinton.",
  "1 = Beware Ineffective Third-Party Spoilers That Help Elect Donald Trump", "10 = Break the Corrupt Two-Party Duopoly / Vote Principle Over Fear", 8, 7, 1, 1, 2, 1);

add(2016, "2016_dnc_chair_wasserman_schultz_resignation", "DNC Leaks Exposing Primary Favoritism & Debbie Wasserman Schultz Ouster", "News", "2016 (DNC Convention Shock)", "Governance & Judiciary", 3,
  "DNC Chair forced to resign on the eve of the convention after leaked emails show staff conspiring to undermine Bernie Sanders.",
  "1 = Reform Democratic Party Nominating Rules and Eliminate Unpledged Superdelegates", "10 = Expose Corrupt Democratic Machine Rigging the System Against True Outsiders", 2, 9, 5, 1, 8, 1);

add(2016, "2016_fbi_apple_san_bernardino_iphone_encryption", "FBI vs. Apple San Bernardino iPhone Encryption Backdoor Fight", "News", "2016 (Smartphone Encryption Showdown)", "Technology & Infrastructure", 3,
  "DOJ court order demanding Apple create a custom iOS firmware bypass to unlock mass shooter's password-protected iPhone.",
  "1 = Refuse Backdoor Master Keys That Compromise Cybersecurity for Hundreds of Millions", "10 = Order Apple to Assist Law Enforcement in Combating Deadly Terrorist Plots", 2, 8, 1, 1, 4, 1);

add(2016, "2016_access_hollywood_tape_controversy", "Donald Trump 'Access Hollywood' Audio Tape & Sexual Assault Accusations", "News", "2016 (October Surprise)", "Civil Rights & Social Issues", 2,
  "Release of 2005 video showing Donald Trump bragging about groping women without consent, leading dozens of Republicans to withdraw endorsements.",
  "1 = Disqualifying Moral Degradation, Misogyny, and Unfitness for the Presidency", "10 = Dismiss 'Locker Room Talk' / Stay Focused on Supreme Court and Economic Survival", 2, 10, 6, 1, 10, 1);

add(2016, "2016_fbi_director_comey_october_letter", "James Comey's October 28 Letter Re-opening Clinton Email Inquiries", "News", "2016 (October Comey Letter)", "Governance & Judiciary", 2,
  "FBI Director notifying Congress 11 days before the election that new emails found on Anthony Weiner's laptop were being reviewed.",
  "1 = Unprecedented, Egregious Violation of DOJ Norms Directly Influencing the Election Outcome", "10 = Commend Director Comey for Transparently Fulfilling Sworn Duty to Congress", 2, 9, 5, 2, 8, 1);

add(2016, "2016_carrier_air_conditioner_mexico_move", "Carrier Moving 1,400 Indiana Manufacturing Jobs to Monterrey, Mexico", "News", "2016 (Rust Belt Plant Closure Symbol)", "Trade & Globalism", 3,
  "Viral smartphone video of factory workers being told their jobs were moving to Mexico, fueling Trump's 35% tariff threats.",
  "1 = End Corporate Tax Subsidies for Offshoring and Strengthen Collective Bargaining", "10 = Slap 35% Punitive Tariffs on Companies That Move American Factories Abroad", 2, 7, 10, 1, 4, 1);

add(2016, "2016_syrian_refugee_resettlement_moratorium", "Banning Syrian Refugee Resettlement Post-Paris Terror Attacks", "News", "2015-2017 (Syrian Refugee Battle)", "Immigration & Border", 2,
  "GOP governors and Congress attempting to halt admission of 10,000 Syrian refugees over ISIS infiltration fears.",
  "1 = Welcome Vetted Refugees Fleeing Brutal War and Terror as a Moral Duty", "10 = Halt All Admissions from War Zones Lacking Reliable Background Records", 2, 10, 3, 1, 10, 1);

add(2016, "2016_california_prop_62_66_death_penalty", "California Proposition 62 (Repeal) vs. Proposition 66 (Expedite Executions)", "News", "2016 (Dual Death Penalty Ballot Fight)", "Civil Rights & Social Issues", 3,
  "Voters defeating capital punishment abolition (Prop 62) while passing Prop 66 to speed up death penalty appeals.",
  "1 = Abolish Costly, Racially Biased, and Inhumane Capital Punishment", "10 = Fast-Track Appeals and Carry Out Lawful Executions for Heinous Murderers", 2, 9, 4, 1, 10, 1);

add(2016, "2016_puerto_rico_promesa_control_board", "Enactment of Puerto Rico Oversight, Management, and Economic Stability Act (PROMESA)", "News", "2016 (PROMESA Board Enacted)", "Economy & Taxation", 4,
  "Creating an unelected federal financial control board to restructure Puerto Rico's $72 billion unpayable debt.",
  "1 = Oppose Anti-Democratic Colonial Junta Subordinating Public Schools to Wall Street Vultures", "10 = Essential Fiscal Oversight to Restore Sovereign Credit and Force Responsible Budgets", 3, 8, 6, 1, 8, 1);

add(2016, "2016_colorado_prop_106_medical_aid_in_dying", "Colorado Proposition 106 (End of Life Options Act)", "News", "2016 (Western Assisted Dying Expansion)", "Healthcare", 4,
  "Voter approval (65%) allowing terminally ill adult residents to obtain prescription medication for self-administered dying.",
  "1 = Compassionate Right for Terminally Ill Patients to Die with Peace and Dignity", "10 = Oppose Physician-Assisted Suicide / Protect Sacred Sanctity of Human Life", 2, 8, 2, 1, 10, 1);

add(2016, "2016_arizona_prop_206_minimum_wage_12", "Arizona Proposition 206 (Raising Minimum Wage to $12 & Paid Sick Days)", "News", "2016 (Red State Minimum Wage Push)", "Labor & Welfare", 3,
  "Citizen initiative approved by 58% of Arizona voters raising wage to $12 by 2020 and mandating paid sick leave.",
  "1 = Stand with Low-Wage Workers to Mandate Living Wages and Earned Sick Leave", "10 = Oppose Government Mandates That Inflate Small Business Payrolls and Accelerate Automation", 2, 8, 10, 1, 9, 1);

add(2016, "2016_nevada_question_1_background_checks", "Nevada Question 1 (Universal Gun Background Checks Narrow Approval)", "News", "2016 (State Gun Ballot Measure)", "Civil Rights & Social Issues", 3,
  "Citizen initiative narrowly approved (50.4%) requiring background checks through licensed dealers for private firearm sales.",
  "1 = Close Private Gun Sale Loopholes to Keep Firearms Away from Dangerous Felons", "10 = Defend Lawful Second Amendment Gun Transfers Against Burdensome Government Registries", 2, 9, 10, 1, 10, 2);

add(2016, "2016_massachusetts_question_4_cannabis", "Massachusetts Question 4 (Legalizing Adult-Use Cannabis in New England)", "News", "2016 (East Coast Legalization Breakthrough)", "Civil Rights & Social Issues", 3,
  "Approving recreational marijuana legalization and taxation with 53.7% of the vote, opening the Northeast retail market.",
  "1 = End Harmful Prohibition and Build an Equitable Regulated Cannabis Industry", "10 = Resist Expanding Commercial Drug Operations Near Neighborhoods and Schools", 2, 8, 1, 1, 9, 1);

add(2016, "2016_dodd_frank_regulatory_clawback", "Financial CHOICE Act (House GOP Overhaul of Dodd-Frank)", "News", "2016-2018 (Dodd-Frank Rollback Push)", "Economy & Taxation", 4,
  "Replacing Dodd-Frank's complex capital mandates with a simple off-ramp leverage ratio and defanging the CFPB.",
  "1 = Defend Dodd-Frank to Prevent Another Catastrophic 2008 Wall Street Crash", "10 = Pass the CHOICE Act to Unleash Community Bank Lending and Free Up Small Business Credit", 2, 9, 10, 1, 9, 1);

add(2016, "2016_china_currency_manipulator_designation", "Pledging to Formally Label China a Currency Manipulator on Day One", "News", "2015-2019 (Currency Manipulation Arc)", "Trade & Globalism", 3,
  "Executive pledge to instruct Treasury to label Beijing a currency manipulator to trigger compensatory tariffs.",
  "1 = Pursue Multilateral Currency Oversight Through IMF and Bilateral Talks", "10 = Designate China Immediately and Impose Compensatory Tariffs to Level Playing Field", 3, 9, 8, 1, 4, 1);

add(2016, "2016_south_china_sea_hague_arbitration", "Hague Permanent Court of Arbitration Ruling Against China's Nine-Dash Line", "News", "2016 (Landmark Maritime Ruling)", "Foreign Policy & Defense", 4,
  "International tribunal ruling that China has no legal historic claim to waters within its nine-dash line in the South China Sea.",
  "1 = Uphold International Law of the Sea and Mobilize Global Diplomatic Pressure on Beijing", "10 = Increase Combat Naval Patrols to Demonstrate China's Claims Cannot Nullify Freedom of Navigation", 3, 9, 5, 1, 8, 1);

add(2016, "2016_fbi_surveillance_carter_page_fisa", "FISA Warrant Applications on Trump Campaign Aide Carter Page", "News", "2016-2019 (Crossfire Hurricane / FISA Abuses)", "Governance & Judiciary", 3,
  "DOJ obtaining secret Foreign Intelligence Surveillance Act warrants relying partly on unverified Steele dossier memos.",
  "1 = Legitimate Counterintelligence Investigation into Substantial Russian Foreign Contacts", "10 = Egregious Deep State Surveillance and Illegal Espionage Against an Opposition Presidential Campaign", 2, 10, 2, 1, 8, 1);

add(2016, "2016_epa_methane_emissions_rule", "EPA Section 111(b) Direct Methane Regulation for New Oil and Gas Wells", "News", "2016-2020 (Methane Rule Arc)", "Energy & Climate", 4,
  "First federal rules directly requiring oil and gas operators to find and repair methane leaks from new and modified wells.",
  "1 = Regulate Potent Methane Greenhouse Gases to Prevent Rapid Near-Term Warming", "10 = Rescind Unnecessary Redundant Regulations on America's Energy Producers", 2, 9, 9, 1, 9, 1);

add(2016, "2016_overtime_salary_threshold_doubling", "Department of Labor Rule Doubling Overtime Salary Threshold to $47,476", "News", "2016-2017 (Overtime Rule Battle)", "Labor & Welfare", 4,
  "Expanding mandatory overtime eligibility to 4.2 million salaried managers earning under $47,476 before a federal court injunction.",
  "1 = Restore Fair Pay for Millions of Salaried Workers Working 50+ Hours for Free", "10 = Oppose Arbitrary Wage Mandates Forcing Salaried Professionals into Hourly Punch-Clocks", 2, 9, 10, 1, 9, 1);

add(2016, "2016_colombia_farc_peace_accord_plebiscite", "Colombian Peace Accord with FARC Guerrillas & Surprise Voter Rejection", "News", "2016 (Colombian Peace Process)", "Foreign Policy & Defense", 5,
  "Colombian electorate narrowly rejecting the initial peace pact offering transitional justice rather than prison for guerrilla commanders.",
  "1 = Support Colombian Peace and Reintegration to End 52 Years of Civil Conflict", "10 = Respect Colombian Voters Demanding Real Justice and Accountability for Terrorist Crimes", 3, 7, 5, 1, 7, 1);

add(2016, "2016_cuba_obama_historic_havana_visit", "President Obama's Historic Official Visit to Havana, Cuba", "News", "2016 (Havana Summit)", "Foreign Policy & Defense", 3,
  "First sitting U.S. president to visit Cuba in 88 years, attending an exhibition baseball game with Raúl Castro.",
  "1 = Historic Triumph of Engagement Bringing Hope, Tourism, and Openness to Cuban People", "10 = Shameful Photo-Op Legitimizing a Ruthless Communist Dictatorship Still Jailing Dissidents", 2, 9, 2, 1, 9, 1);

add(2016, "2016_yemen_saudi_coalition_us_refueling", "U.S. Aerial Mid-Air Refueling and Intelligence for Saudi Coalition in Yemen", "News", "2015-2019 (Yemen War Complicity Arc)", "Foreign Policy & Defense", 3,
  "Providing U.S. tankers to refuel Saudi bombers executing air strikes against Houthi rebels that caused heavy civilian casualties.",
  "1 = Immediately Halt All U.S. Refueling, Arms Sales, and Logistical Complicity in Yemen War", "10 = Maintain Security Assistance to Saudi Ally to Push Back Iranian Houthi Proxies", 3, 9, 2, 1, 7, 1);

add(2016, "2016_fcc_broadband_privacy_rules", "FCC Privacy Regulations Barring ISPs from Selling Browsing Histories", "News", "2016-2017 (Broadband Privacy Rules)", "Technology & Infrastructure", 4,
  "Requiring internet service providers to obtain opt-in customer consent before sharing web browsing histories with advertisers.",
  "1 = Safeguard Consumer Privacy from Monopolistic Telecoms Weaponizing Personal Data", "10 = Reject Discriminatory Rules That Handicap ISPs While Leaving Google and Facebook Unregulated", 2, 8, 7, 1, 8, 1);

add(2016, "2016_maine_question_5_ranked_choice_voting", "Maine Question 5 (First Statewide Approval of Ranked-Choice Voting)", "News", "2016 (RCV Historic Pioneer)", "Governance & Judiciary", 4,
  "Voters approving ranked-choice voting for statewide, legislative, and congressional elections to eliminate spoiler candidates.",
  "1 = Vote Yes / Empower Voters, Encourage Civility, and Eliminate the Spoiler Effect", "10 = Vote No / Confusing Scheme That Undermines the Traditional One-Person-One-Vote Standard", 2, 7, 1, 1, 1, 1);

add(2016, "2016_california_prop_61_drug_price_caps", "California Proposition 61 (Tying State Drug Purchases to VA Prices)", "News", "2016 (State Drug Price Battle)", "Healthcare", 4,
  "High-stakes ballot fight requiring California state agencies to pay no more for prescription drugs than the U.S. Department of Veterans Affairs.",
  "1 = Vote Yes / Stand Up to Big Pharma Greed and Lower Prescription Costs for Taxpayers", "10 = Vote No / Flawed Initiative That Will Eliminate VA Discounts and Limit Patient Access", 2, 8, 6, 1, 7, 1);

add(2016, "2016_wells_fargo_fake_accounts_scandal", "Wells Fargo Unauthorized Customer Accounts & $185M Regulatory Fine", "News", "2016-2017 (Retail Banking Fraud)", "Economy & Taxation", 3,
  "Discovery that bank employees opened 2 million unauthorized credit card and deposit accounts to meet predatory sales quotas.",
  "1 = Break Up Wells Fargo and Enact Stiff Criminal Liability for Senior Bank Executives", "10 = Discipline Corrupt Middle Management / Enforce Restitution Without Crippling the Banking System", 2, 8, 7, 1, 7, 1);

add(2016, "2016_charlotte_police_shooting_keith_scott", "Fatal Shooting of Keith Lamont Scott & Civil Unrest in Charlotte, NC", "News", "2016 (Charlotte Unrest)", "Civil Rights & Social Issues", 3,
  "Several nights of street unrest and highway blockades following fatal police shooting of Black motorist in apartment complex.",
  "1 = Demand Independent Investigations, End Bias in Policing, and Enact Systemic Justice Reforms", "10 = Enforce Law and Order / Stop Violent Rioters from Burning American Communities", 2, 10, 4, 1, 10, 1);

add(2016, "2016_obama_gun_control_executive_actions", "Obama Executive Actions on Background Checks and Mental Health Reporting", "News", "2016 (Executive Gun Measures)", "Civil Rights & Social Issues", 3,
  "Issuing executive actions clarifying that anyone 'in the business' of selling firearms must conduct background checks.",
  "1 = Strong Executive Action to Prevent Gun Violence and Save American Lives", "10 = Unconstitutional Executive Overreach Bypassing Congress to Chip Away at the Second Amendment", 2, 10, 9, 1, 10, 2);

add(2016, "2016_clean_power_plan_scotus_stay", "Supreme Court Unprecedented 5-4 Stay on EPA Clean Power Plan", "News", "2016 (SCOTUS Carbon Stay)", "Energy & Climate", 3,
  "Supreme Court issuing an emergency stay halting implementation of the Clean Power Plan before the DC Circuit heard oral argument.",
  "1 = Disappointing Judicial Activism Delaying Urgent Climate Action to Protect Fossil Polluters", "10 = Courageous Judicial Interdiction Halting Unprecedented Clean Air Act Federal Usurpation", 2, 10, 9, 1, 10, 1);

add(2016, "2016_fannie_freddie_net_worth_sweep", "Treasury Third Amendment 'Net Worth Sweep' Profit Confiscation", "News", "2012-2018 (GSE Profit Sweep Controversy)", "Economy & Taxation", 6,
  "Shareholders suing the federal government over the Treasury sweeping all Fannie and Freddie quarterly profits into the general fund.",
  "1 = Reclaim Every Dime for Taxpayers Who Put $187B on the Line to Rescue Wall Street", "10 = Illegal Fifth Amendment Expropriation of Private Shareholders' Lawful Equity", 2, 7, 9, 1, 8, 1);

add(2016, "2016_department_of_labor_fiduciary_rule", "Department of Labor Fiduciary Rule for Retirement Investment Advisers", "News", "2016-2018 (Fiduciary Standard Battle)", "Economy & Taxation", 4,
  "Requiring financial brokers offering retirement advice to act as legally binding fiduciaries rather than under suitability rules.",
  "1 = Stop Wall Street Brokers from Siphoning $17B Annually from Retirement Savers Through Kickbacks", "10 = Repeal the Fiduciary Rule / Excessive Liability That Restricts Low-Balance Investor Advice", 2, 8, 9, 1, 8, 1);

add(2016, "2016_south_dakota_initiated_measure_22", "South Dakota Measure 22 (Anti-Corruption & Public Campaign Financing)", "News", "2016 (State Anti-Corruption Measure)", "Governance & Judiciary", 5,
  "Voters narrowly passing sweeping ethics overhaul with $100 'democracy credit' public campaign vouchers, later repealed by legislature.",
  "1 = Stand with Voters to Clean Up Dirty Money and End Lobbyist Gifts in State Capitals", "10 = Repeal Measure 22 / Unconstitutional Scheme Using Taxpayer Dollars to Fund Political Attack Ads", 2, 8, 7, 1, 8, 1);

add(2016, "2016_zika_virus_emergency_funding_stalemate", "Emergency Supplemental Appropriations for Mosquito-Borne Zika Virus", "News", "2016 (Zika Funding Gridlock)", "Healthcare", 4,
  "Seven-month congressional gridlock over funding vaccine development for microcephaly-causing Zika virus due to abortion riders.",
  "1 = Pass Clean Emergency Funding Without Harmful Restrictions on Planned Parenthood Clinics", "10 = Offset Emergency Spending and Prevent Taxpayer Dollars from Funding Contraceptive Clinics", 2, 9, 6, 1, 9, 1);

add(2016, "2016_trade_deficit_with_mexico_and_nafta", "Donald Trump Pledging to Terminate or Renegotiate NAFTA", "News", "2015-2019 (USMCA Precursor)", "Trade & Globalism", 2,
  "Denouncing the 1994 North American Free Trade Agreement as the worst trade deal ever made in the history of the world.",
  "1 = Renegotiate NAFTA to Protect Labor Rights, Higher Wages, and Environmental Standards", "10 = Tear Up NAFTA or Slap Heavy Border Adjustment Taxes to Bring Factories Home", 2, 6, 8, 1, 3, 1);

add(2016, "2016_minimum_wage_seattle_fifteen_rollout", "Economic Impact Studies on Seattle's Phase-In to $15 Minimum Wage", "News", "2015-2018 (Seattle Wage Studies)", "Labor & Welfare", 4,
  "Conflicting economic studies analyzing whether Seattle's pioneering wage hike reduced low-skilled work hours or boosted aggregate wages.",
  "1 = Seattle Demonstrates Wage Hikes Lift Working Families Out of Poverty Without Slowing Booming Growth", "10 = Economic Evidence Proves High Minimum Wages Destroy Low-Income Entry Hours and Accelerate Tech", 2, 9, 10, 1, 9, 1);

add(2016, "2016_russia_syria_aleppo_bombardment", "Russian Aerial Bombardment of Rebel-Held Eastern Aleppo", "News", "2016 (Siege of Aleppo)", "Foreign Policy & Defense", 3,
  "Russian air force bunker-buster bombs devastating hospitals and residential neighborhoods to help Assad recapture Aleppo.",
  "1 = Enact Severe Sanctions for Russian War Crimes and Provide Immediate Humanitarian Corridors", "10 = Decisive Anti-Terrorist Operations Necessary to Defeat Al-Nusra and Restore Syrian Stability", 2, 8, 4, 1, 7, 1);

console.log('Bracket 3 - 2016 complete. Total in array:', ISSUES.length);
// =========================================================================
// 2018 (52 Issues)
// =========================================================================
add(2018, "2018_tax_cuts_and_jobs_act_tcja", "Tax Cuts and Jobs Act of 2017 (TCJA - 21% Corporate Rate & Individual Cuts)", "News", "2017-2025 (TCJA Era)", "Economy & Taxation", 1,
  "Evaluating the landmark tax overhaul slashing the federal corporate income tax rate from 35% to 21% and doubling the standard deduction.",
  "1 = Repeal TCJA as an Oligarchic Handout to the Ultra-Wealthy & Corporations", "10 = Celebrate Historic Tax Relief Powering Booming Jobs, Wages, and Investment", 2, 10, 10, 1, 9, 1);

add(2018, "2018_brett_kavanaugh_confirmation_hearings", "Brett Kavanaugh Supreme Court Confirmation Hearings & Blasey Ford Testimony", "News", "2018 (Supreme Court Cultural Showdown)", "Governance & Judiciary", 1,
  "Contentious confirmation hearings following Dr. Christine Blasey Ford's testimony alleging high school sexual assault and Kavanaugh's fiery defense.",
  "1 = Believe Survivors / Demand Thorough FBI Inquiry / Reject Kavanaugh", "10 = Defend Presumption of Innocence Against Uncorroborated Partisan Smears", 2, 10, 6, 1, 10, 1);

add(2018, "2018_zero_tolerance_family_separations", "Zero-Tolerance Border Policy & Migrant Family Separations", "News", "2018 (Family Separation Crisis)", "Immigration & Border", 1,
  "DOJ policy criminally prosecuting all unauthorized border crossers, resulting in over 2,800 children being separated from their parents.",
  "1 = Condemn Inhumane, Cruel Child Separation Policy / Demand Family Reunification", "10 = Enforce the Rule of Law / Deter Illegal Crossers Exploiting Children as Shields", 2, 10, 3, 1, 10, 1);

add(2018, "2018_parkland_shooting_march_for_our_lives", "Marjory Stoneman Douglas High School Shooting & March for Our Lives", "News", "2018 (Youth Gun Safety Mobilization)", "Civil Rights & Social Issues", 1,
  "Mass murder of 17 students and staff in Parkland, FL, igniting nationwide student walkouts and the March for Our Lives rally in DC.",
  "1 = Ban Military-Style Assault Weapons, High-Capacity Magazines & Pass Red Flag Laws", "10 = Protect Second Amendment Rights / Arm Trained Teachers & Harden School Campuses", 2, 10, 10, 1, 10, 2);

add(2018, "2018_china_trade_war_tariffs_retaliation", "Section 301 Tariffs on $250B Chinese Imports & Farm Retaliation", "News", "2018-2026 (Trade War Arc)", "Trade & Globalism", 1,
  "Imposing unilateral 10% to 25% tariffs on $250 billion in Chinese goods, triggering retaliatory Chinese tariffs on American soybeans.",
  "1 = Stand with Heartland Farmers Crushed by Chaos / Multilateral Trade Action with Allies", "10 = Use Tariffs to Confront Decades of Chinese Intellectual Property Theft and Dumping", 3, 8, 9, 1, 3, 1);

add(2018, "2018_mueller_special_counsel_investigation", "Robert Mueller Special Counsel Investigation into Russian Interference", "News", "2017-2019 (Mueller Probe Arc)", "Governance & Judiciary", 1,
  "Investigating Russian interference, Trump campaign links, and potential presidential obstruction of justice following James Comey's firing.",
  "1 = Protect Special Counsel from Presidential Interference / Uncover Full Truth", "10 = Shut Down the Unconstitutional, Witch-Hunt Investigation Led by Partisan Democrats", 2, 10, 4, 1, 8, 1);

add(2018, "2018_me_too_movement_workplace_harassment", "#MeToo Movement Accountability for Workplace Sexual Harassment", "News", "2017-2020 (#MeToo Cultural Arc)", "Civil Rights & Social Issues", 1,
  "Cultural reckoning exposing systemic sexual abuse and forcing resignations across media, Hollywood, corporate boardrooms, and Congress.",
  "1 = Believe Women, Ban Non-Disclosure Agreements for Harassment, and Enforce Accountability", "10 = Ensure Fair Due Process and Guard Against Rush-to-Judgment Trial by Twitter", 2, 9, 5, 1, 9, 1);

add(2018, "2018_abolish_ice_progressive_rallying_cry", "Progressive Demands to 'Abolish ICE' & Restructure Immigration Enforcement", "News", "2018-2020 (Abolish ICE Debate)", "Immigration & Border", 2,
  "Calls by progressive Democrats and activists to dismantle Immigration and Customs Enforcement following family separations.",
  "1 = Abolish ICE and Decriminalize Unauthorized Border Crossing", "10 = Back ICE Heroes Enforcing Federal Law and Deporting Violent Criminal Aliens", 3, 10, 2, 1, 10, 1);

add(2018, "2018_protecting_pre_existing_conditions_aca", "Protecting Pre-Existing Conditions in ACA (Texas v. United States Lawsuit)", "News", "2018 (Healthcare Midterm Central Theme)", "Healthcare", 1,
  "GOP state lawsuit supported by Trump DOJ seeking to invalidate the entire ACA, including protections for pre-existing conditions.",
  "1 = Protect Pre-Existing Condition Guarantees as a Sacred Inviolable Right for All Americans", "10 = Repeal Obamacare While Passing Separate State-Based Guarantees for Sick Individuals", 2, 9, 8, 1, 9, 1);

add(2018, "2018_florida_amendment_4_felon_voting", "Florida Amendment 4 (Automatic Restoration of Voting Rights for Felons)", "News", "2018 (Historic Rights Restoration)", "Governance & Judiciary", 2,
  "Citizen constitutional initiative approved by 64.5% of Florida voters automatically restoring voting rights to 1.4 million nonviolent felons.",
  "1 = Vote Yes / Welcome Returning Citizens Back into Democracy and End Jim Crow Disenfranchisement", "10 = Vote No / Felons Must Pay All Restitution, Fines, and Fees Before Regaining Voting Privileges", 2, 9, 3, 1, 10, 1);

add(2018, "2018_fcc_net_neutrality_repeal_ajit_pai", "FCC Chairman Ajit Pai Restoring Internet Freedom Order (Repealing Net Neutrality)", "News", "2017-2021 (Net Neutrality Repeal Phase)", "Technology & Infrastructure", 2,
  "Dismantling 2015 Title II common carrier broadband regulations, returning oversight to the FTC.",
  "1 = Pass Congressional Review Act to Reinstate Federal Net Neutrality Protections", "10 = Support Light-Touch Deregulation That Spurred Billions in Private Fiber and 5G Investment", 2, 9, 8, 1, 8, 1);

add(2018, "2018_neil_gorsuch_confirmation_nuclear_option", "Neil Gorsuch Supreme Court Confirmation & Nuclear Option for SCOTUS", "News", "2017 (Gorsuch Confirmation)", "Governance & Judiciary", 2,
  "Mitch McConnell lowering the Supreme Court confirmation threshold to a simple majority to confirm textualist Neil Gorsuch.",
  "1 = Condemn the Stolen Seat and Destruction of the 60-Vote Senate Filibuster Norm", "10 = Confirm Brilliant Originalist Jurist Dedicated to the Rule of Law and Textual Fidelity", 2, 10, 8, 1, 10, 1);

add(2018, "2018_iran_nuclear_deal_withdrawal_jcpoa", "U.S. Unilateral Withdrawal from the JCPOA Iran Nuclear Accord", "News", "2018 (JCPOA Withdrawal)", "Foreign Policy & Defense", 2,
  "President Trump withdrawing from the 2015 Iran pact and re-imposing maximum pressure secondary sanctions on Iranian oil exports.",
  "1 = Reckless Violation of a Functioning Treaty That Increases the Risk of a Middle East War", "10 = Dismantle a Disastrous Deal That Paved Iran's Path to a Bomb and Funded Terrorism", 2, 10, 3, 1, 9, 1);

add(2018, "2018_us_embassy_move_to_jerusalem", "Relocation of the United States Embassy to Jerusalem", "News", "2017-2018 (Jerusalem Embassy Move)", "Foreign Policy & Defense", 2,
  "Fulfilling the 1995 Jerusalem Embassy Act by formally recognizing Jerusalem as Israel's capital and relocating the embassy.",
  "1 = Inflammatory Unilateral Move That Torpedoes Any Hope of a Two-State Peace Settlement", "10 = Bold, Courageous Fulfillment of American Law Standing Firmly with Democratic Ally Israel", 3, 10, 5, 1, 10, 1);

add(2018, "2018_michigan_proposal_1_cannabis", "Michigan Proposal 1 (Legalizing Adult-Use Cannabis in the Industrial Midwest)", "News", "2018 (Midwest Cannabis Breakthrough)", "Civil Rights & Social Issues", 2,
  "Voters approving legal possession, growing, and retail commercial taxation of cannabis with 56% of the vote.",
  "1 = Landmark Midwestern Victory for Drug Decriminalization and Commercial Freedom", "10 = Oppose Creating Another Predatory Commercial Addiction Industry", 2, 8, 1, 1, 9, 1);

add(2018, "2018_first_step_act_criminal_justice", "First Step Act of 2018 (Bipartisan Federal Criminal Justice Reform)", "News", "2018 (Landmark Sentencing Reform)", "Civil Rights & Social Issues", 2,
  "Bipartisan legislation reducing mandatory minimum sentences, expanding good-time credits, and retroactively applying the Fair Sentencing Act.",
  "1 = Crucial First Step Toward Ending Mass Incarceration / Must Go Much Further", "10 = Champion Bipartisan Trump Achievement Reforming Sentencing and Reducing Recidivism", 2, 8, 2, 1, 6, 1);

add(2018, "2018_missouri_proposition_a_right_to_work", "Missouri Proposition A (Overwhelming Voter Rejection of Right-to-Work)", "News", "2018 (Labor Referendum Victory)", "Labor & Welfare", 2,
  "Voters crushing (67.5% No) a GOP legislative statute designed to make Missouri a Right-to-Work state.",
  "1 = Historic Working-Class Victory Defeating Anti-Union Corporate Attack on Wages", "10 = Disappointing Result Hindering Missouri's Economic Competitiveness for New Factories", 2, 8, 10, 1, 8, 1);

add(2018, "2018_paris_accord_exit_announcement", "Executive Notice of Withdrawal from the Paris Climate Accord", "News", "2017-2020 (Paris Exit Phase)", "Energy & Climate", 2,
  "Formally beginning the multi-year process to withdraw the United States from international greenhouse gas commitments.",
  "1 = Disastrous Abdication of Global Leadership Endangering the Future of the Planet", "10 = Put America First and Protect Domestic Manufacturing from Punitive Globalist Mandates", 2, 10, 9, 1, 10, 1);

add(2018, "2018_daca_court_injunctions_termination", "Federal District Courts Blocking Trump Rescission of DACA", "News", "2017-2020 (DACA Litigation Arc)", "Immigration & Border", 2,
  "Federal judges ruling that DHS's decision to wind down DACA was arbitrary, capricious, and lacked rational legal justification.",
  "1 = Protect Dreamers from Unlawful Deportation / Pass Permanent Freedom to Dream Law", "10 = Unelected Judges Usurping Executive Discretion to Protect Unconstitutional Amnesties", 2, 10, 3, 1, 10, 1);

add(2018, "2018_jamal_khashoggi_assassination_saudi", "Assassination of Jamal Khashoggi in Istanbul & Saudi Crown Prince", "News", "2018 (Khashoggi Murder Aftermath)", "Foreign Policy & Defense", 2,
  "CIA assessment concluding Saudi Crown Prince Mohammed bin Salman personally ordered the brutal murder and dismemberment of the journalist.",
  "1 = Hold Saudi Regime Accountable / Halt All Weapons Sales and Enact Magnitsky Sanctions", "10 = Condemn Murder but Protect Vital Strategic and Energy Partnership with Saudi Arabia", 2, 8, 2, 1, 6, 1);

add(2018, "2018_epa_clean_water_wotus_repeal", "Repeal & Replacement of the 2015 Clean Water Rule (WOTUS)", "News", "2017-2020 (Navigable Waters Protection Rule)", "Energy & Climate", 3,
  "EPA publishing the Navigable Waters Protection Rule excluding ephemeral streams and isolated wetlands from federal permits.",
  "1 = Reckless Gutting of Clean Water Protections Threatening Drinking Water for Millions", "10 = Welcome Relief for Farmers and Homebuilders from Lawless Federal Bureaucratic Overreach", 2, 10, 10, 1, 10, 1);

add(2018, "2018_affordable_care_act_individual_mandate_zero", "Zeroing Out the ACA Individual Mandate Penalty in the 2017 Tax Bill", "News", "2017-2019 (Mandate Penalty Repeal)", "Healthcare", 2,
  "Eliminating the federal tax penalty for individuals who choose not to buy ACA health insurance.",
  "1 = Sabotage Designed to Trigger Death Spirals in Insurance Markets and Spike Premiums", "10 = Liberate Millions of Americans from Unconstitutional Mandates and Punitive IRS Penalties", 2, 10, 10, 1, 10, 1);

add(2018, "2018_usmca_nafta_renegotiation_signing", "Signing of the United States-Mexico-Canada Agreement (USMCA)", "News", "2018-2020 (USMCA Ratification Arc)", "Trade & Globalism", 3,
  "Replacing NAFTA with new rules requiring 75% regional auto content and $16/hr wage minimums for 40% of vehicle parts.",
  "1 = Strengthen Independent Labor Enforcement in Mexico Before Granting Final Approval", "10 = Fulfill Campaign Promise Delivering Fair, Reciprocal Trade That Revitalizes Rust Belt Autos", 3, 9, 7, 1, 4, 1);

add(2018, "2018_puerto_rico_hurricane_maria_death_toll", "Hurricane Maria Aftermath & GWU Study Revealing 2,975 Deaths", "News", "2017-2019 (Maria Recovery Controversy)", "Energy & Climate", 2,
  "Investigation into the botched federal disaster response, months of power blackouts, and dispute over the revised 2,975 mortality figure.",
  "1 = Disgraceful Federal Dereliction of Duty Treating Fellow American Citizens as Second-Class", "10 = Defend FEMA's Extraordinary Logistical Support on an Island with Crumbling Local Infrastructure", 2, 8, 5, 1, 7, 1);

add(2018, "2018_charlottesville_white_supremacy_rallies", "'Unite the Right' Rally in Charlottesville & 'Very Fine People' Remark", "News", "2017-2018 (Charlottesville Fall-Out)", "Civil Rights & Social Issues", 2,
  "Violent neo-Nazi rallies resulting in the murder of counter-protester Heather Heyer and Trump's controversial moral equivalence comments.",
  "1 = Unambiguously Condemn White Supremacy, Neo-Nazism, and Presidential Sympathy", "10 = Condemn Violent Extremists on Both Sides / Defend Historical Statues from Mob Removal", 2, 10, 5, 1, 10, 1);

add(2018, "2018_janus_v_afscme_public_sector_dues", "Supreme Court Ruling on Public Sector Union Fees (Janus v. AFSCME)", "News", "2018 (Janus Labor Decision)", "Labor & Welfare", 2,
  "Supreme Court holding that public sector agency shop fees violate the First Amendment rights of non-members.",
  "1 = Decades-Long Corporate Attack Designed to Starve Public Sector Unions and Teachers", "10 = Triumph for Free Speech Ensuring Workers Cannot Be Coerced into Funding Political Speech", 2, 10, 10, 1, 9, 1);

add(2018, "2018_north_korea_singapore_summit_kim", "Donald Trump & Kim Jong Un Historic Singapore Nuclear Summit", "News", "2018 (Singapore Summit)", "Foreign Policy & Defense", 3,
  "First face-to-face summit between a sitting U.S. president and North Korean leader, yielding a vague joint denuclearization statement.",
  "1 = Legitimized a Brutal Dictator with No Concrete Verifiable Concessions on Centrifuges", "10 = Unprecedented Presidential Statesmanship Breaking Decades of Stagnant Diplomatic Failure", 3, 8, 4, 1, 6, 1);

add(2018, "2018_facebook_cambridge_analytica_scandal", "Facebook & Cambridge Analytica Voter Data Harvesting Scandal", "News", "2018 (Social Media Data Privacy Crisis)", "Technology & Infrastructure", 3,
  "Revelations that political consulting firm Cambridge Analytica improperly harvested private data of 87M users for voter profiling.",
  "1 = Enact Comprehensive European-Style GDPR Data Privacy Laws and Break Up Big Tech", "10 = Hold Bad Actors Accountable / Protect Voluntary Digital Advertising Ecosystems", 2, 8, 6, 1, 7, 1);

add(2018, "2018_steel_aluminum_section_232_tariffs", "National Security Section 232 Tariffs on Steel (25%) & Aluminum (10%)", "News", "2018-2021 (Section 232 Metal Tariffs)", "Trade & Globalism", 3,
  "Invoking Cold War national security statute to slap tariffs on imported steel and aluminum from allies like Canada, Mexico, and the EU.",
  "1 = Abusing National Security Laws to Punish Democratic Allies and Inflate Manufacturing Costs", "10 = Protect Core Defense Industrial Base and Stop Foreign Subsidized Glut from Destroying U.S. Mills", 3, 9, 9, 1, 4, 1);

add(2018, "2018_opioid_crisis_public_health_emergency", "Nationwide Opioid Crisis Declaration & Substance Use Disorder Bill", "News", "2017-2020 (Opioid Crisis Response)", "Healthcare", 3,
  "Enacting the bipartisan SUPPORT Act to expand addiction treatment and combat illicit fentanyl shipments via international mail.",
  "1 = Hold Purdue Pharma Billionaires Criminally Liable and Fund Universal Addiction Treatment", "10 = Crack Down on Chinese Fentanyl Precursors and Border Drug Cartels Flooding America", 2, 8, 4, 1, 8, 1);

add(2018, "2018_california_wildfires_paradise_camp_fire", "Deadly California Camp Fire (85 Fatalities) & Forest Management", "News", "2018 (Catastrophic Western Wildfire Arc)", "Energy & Climate", 3,
  "Deadliest wildfire in California history destroying the town of Paradise, triggering fights over climate change vs. forest clearing.",
  "1 = Accelerate Deep Climate Decarbonization and Hold Negligent Utility PG&E Accountable", "10 = Reform Failed Environmental Laws That Prevent Logging and Clearing Dead Brush in Forests", 2, 9, 8, 1, 9, 1);

add(2018, "2018_masterpiece_cakeshop_scotus_ruling", "Supreme Court Ruling in Masterpiece Cakeshop v. Colorado Civil Rights", "News", "2018 (Religious Freedom & LGBTQ Rights)", "Civil Rights & Social Issues", 3,
  "Ruling 7-2 that state civil rights commission showed unconstitutional hostility toward a Christian baker refusing to make a same-sex wedding cake.",
  "1 = Narrow Ruling That Leaves Clear Civil Rights Protections Against Commercial Discrimination", "10 = Vital Vindication of Constitutional Religious Freedom and Free Speech of Christian Artists", 2, 9, 4, 1, 10, 1);

add(2018, "2018_fbi_headquarters_relocation_cancellation", "Abrupt Cancellation of Consolidated FBI Headquarters Relocation", "News", "2017-2018 (FBI Building Controversy)", "Governance & Judiciary", 5,
  "Halting decade-long plan to move FBI headquarters to the suburbs, sparking conflict-of-interest allegations regarding the Trump International Hotel.",
  "1 = Investigate Potential Presidential Interference Protecting Hotel Revenues from Rival Developers", "10 = Scrap Costly Suburban Boondoggle / Rebuild Efficient Headquarters on Current Footprint", 2, 8, 5, 1, 7, 1);

add(2018, "2018_transgender_military_ban_reimposition", "Presidential Directive Barring Most Transgender Troops from Service", "News", "2017-2021 (Transgender Military Ban Arc)", "Civil Rights & Social Issues", 3,
  "Reversing Obama-era policies to bar individuals diagnosed with gender dysphoria from enlisting or serving in the military.",
  "1 = Cruel and Bigoted Discrimination Discharging Brave Patriotic Americans Capable of Serving", "10 = Protect Military Readiness and Avoid Extraordinary Medical Costs That Burden the Armed Forces", 2, 10, 3, 1, 10, 1);

add(2018, "2018_salt_deduction_ten_thousand_cap", "Tax Cuts and Jobs Act $10,000 State and Local Tax (SALT) Deduction Cap", "News", "2017-2025 (SALT Cap Controversy)", "Economy & Taxation", 3,
  "Capping the federal deduction for state and local income and property taxes at $10,000, disproportionately hitting high-tax blue states.",
  "1 = Unfair Partisan Retaliation Penalizing High-Service States / Repeal the SALT Cap", "10 = Stop Forcing Low-Tax Red State Taxpayers to Subsidize Out-of-Control Blue State Budgets", 4, 9, 9, 2, 9, 1);

add(2018, "2018_nevada_question_6_renewable_energy", "Nevada Question 6 (50% Renewable Portfolio Standard by 2030)", "News", "2018 (State Clean Energy Mandate)", "Energy & Climate", 4,
  "Constitutional initiative approved by 67% of voters mandating electric utilities acquire 50% of power from renewable sources by 2030.",
  "1 = Bold Voter Mandate Accelerating Western Solar and Geothermal Energy Independence", "10 = Costly Energy Mandates That Strain Grid Reliability and Spike Consumer Electricity Bills", 2, 8, 9, 1, 9, 1);

add(2018, "2018_amazon_hq2_bidding_war_subsidies", "Amazon HQ2 Nationwide Corporate Tax Incentive Bidding War", "News", "2017-2019 (Corporate Subsidy Backlash)", "Economy & Taxation", 4,
  "Cities and states offering billions in tax breaks to land Amazon's second headquarters, sparking anti-subsidy backlash in NYC.",
  "1 = Ban Corrupt State-Level Corporate Handouts and Protect Community Housing Affordability", "10 = Compete Aggressively to Win 25,000 High-Paying Tech Jobs and Billions in Local Economic Growth", 2, 7, 10, 1, 7, 1);

add(2018, "2018_cfpb_mick_mulvaney_defanging", "Mick Mulvaney Serving as Acting Director of CFPB & Freezing Enforcements", "News", "2017-2019 (CFPB Rollback Phase)", "Economy & Taxation", 4,
  "Mulvaney requesting a zero-dollar budget and dropping enforcement lawsuits against predatory payday lenders.",
  "1 = Sabotage of the Nation's Preeminent Financial Watchdog Protecting Defenseless Consumers", "10 = End the Rogue, Unaccountable Tyranny of an Unconstitutional Agency Stifling Consumer Credit", 2, 10, 10, 1, 10, 1);

add(2018, "2018_clean_power_plan_affordable_clean_energy", "EPA Affordable Clean Energy (ACE) Rule Replacing Clean Power Plan", "News", "2018-2021 (ACE Rulemaking)", "Energy & Climate", 3,
  "Replacing Obama's system-wide carbon caps with narrow, modest efficiency improvements within individual coal plant fences.",
  "1 = Ineffective Climate Surrender Subsidizing Old, Polluting Coal Plants to Keep Operating", "10 = Lawful, Common-Sense Regulation That Respects Clean Air Act Limits and Protects Coal Jobs", 2, 10, 9, 1, 10, 1);

add(2018, "2018_puerto_rico_power_grid_privatization", "Governor Rosselló Plan to Privatize PREPA Electric Power Authority", "News", "2018 (Grid Privatization Arc)", "Energy & Climate", 5,
  "Moving to sell state power plants and concession the electric transmission grid to private consortium LUMA Energy.",
  "1 = Protect Public Workers and Prevent Wall Street Exploitation of an Essential Public Utility", "10 = Dismantle the Corrupt, Insolvent Government Monopoly That Left the Island in the Dark for a Year", 3, 8, 9, 1, 8, 1);

add(2018, "2018_sanctuary_cities_doj_grant_withholding", "DOJ Withholding Byrne JAG Police Grants from Sanctuary Jurisdictions", "News", "2017-2020 (Sanctuary Funding Lawsuits)", "Immigration & Border", 3,
  "Attorney General Sessions attempting to strip federal law enforcement grants from cities refusing to hold undocumented inmates for ICE.",
  "1 = Unlawful Federal Coercion Undermining Local Community Trust Between Police and Immigrants", "10 = Deny Taxpayer Dollars to Lawless Cities Harboring Dangerous Deportable Criminal Aliens", 2, 10, 4, 1, 10, 1);

add(2018, "2018_space_force_creation_directive", "Presidential Directive Ordering Creation of the United States Space Force", "News", "2018-2019 (Space Force Inception)", "Foreign Policy & Defense", 4,
  "Directing the Pentagon to establish an independent sixth military service branch dedicated to orbital warfighting.",
  "1 = Unnecessary Bureaucratic Duplication and Dangerous Militarization of Outer Space", "10 = Essential Military Independence to Counter Chinese and Russian Anti-Satellite Threats", 3, 8, 6, 2, 8, 1);

add(2018, "2018_title_x_abortion_gag_rule", "HHS Domestic Gag Rule Barring Title X Grants to Abortion Providers", "News", "2018-2021 (Title X Gag Rule Arc)", "Civil Rights & Social Issues", 3,
  "Barring federal family planning funds from clinics that provide abortion referrals or share physical facilities with providers.",
  "1 = Unlawful Gag Rule Forcing Planned Parenthood Out of Vital Preventative Women's Healthcare", "10 = Enforce Strict Statutory Firewalls So No Taxpayer Dollars Direct or Subsidize Abortion", 2, 10, 5, 1, 10, 1);

add(2018, "2018_qualifying_anti_boycott_bds_bills", "State & Federal Anti-BDS Legislation Penalizing Israel Boycotts", "Ideological", "2016-2026 (BDS Legal Challenges Arc)", "Civil Rights & Social Issues", 5,
  "Requiring state contractors to certify they do not participate in economic boycotts of the state of Israel.",
  "1 = Unconstitutional Infringement on First Amendment Rights to Political Boycott and Protest", "10 = Enact Anti-BDS Statutes to Stop Anti-Semitic Economic Warfare Against Our Greatest Mideast Ally", 3, 9, 3, 1, 9, 1);

add(2018, "2018_colorado_prop_112_fracking_setbacks", "Colorado Proposition 112 (Mandatory 2,500-Foot Fracking Setbacks Defeat)", "News", "2018 (Fracking Setback Referendum)", "Energy & Climate", 4,
  "Voters defeating a citizen initiative to mandate 2,500-foot buffer zones between oil and gas wells and occupied structures.",
  "1 = Protect Neighborhoods, Schools, and Drinking Water from Toxic Drilling Emissions", "10 = Defeat Measure That Would Ban 85% of New Drilling in Colorado and Cost 100,000 Jobs", 2, 8, 9, 1, 9, 1);

add(2018, "2018_washington_initiative_1631_carbon_fee", "Washington Initiative 1631 (First U.S. Voter Ballot Carbon Fee Defeat)", "News", "2018 (Direct Carbon Pricing Ballot Battle)", "Energy & Climate", 3,
  "Oil-funded campaign defeating citizen initiative to levy a $15/metric ton fee on greenhouse gas emissions.",
  "1 = Vote Yes / Put a Real Price on Carbon Pollution and Fund Renewable Clean Energy Infrastructure", "10 = Vote No / Reject a Regressive Energy Tax That Will Hike Gas Prices and Protect Big Corporate Emitters", 2, 8, 9, 1, 9, 1);

add(2018, "2018_syria_troop_withdrawal_announcement", "President Trump Surprise Announcement of Full Troop Withdrawal from Syria", "News", "2018 (Syria Exit & Mattis Resignation)", "Foreign Policy & Defense", 3,
  "President declaring ISIS defeated and ordering all 2,000 U.S. troops home, prompting Defense Secretary Jim Mattis to resign.",
  "1 = Dangerous Rash Abandonment of Kurdish Allies Handing Syria to Assad, Russia, and Iran", "10 = Fulfill Promise to Stop Fighting Endless Foreign Wars and Bring American Troops Home", 3, 7, 2, 1, 5, 1);

add(2018, "2018_alaska_ballot_measure_1_salmon_habitat", "Alaska Ballot Measure 1 (Stricter Fish Habitat Permits for Mining Defeat)", "News", "2018 (Pebble Mine Proxy Referendum)", "Energy & Climate", 5,
  "Voters defeating tougher environmental review standards for mining and industrial projects in wild salmon streams.",
  "1 = Protect Alaska's World-Class Wild Salmon Runs and Traditional Fishing Livelihoods", "10 = Defeat Measure That Creates Severe Regulatory Paralysis for Resource Development Across Alaska", 2, 8, 9, 1, 8, 1);

add(2018, "2018_consumer_privacy_act_california_ccpa", "Enactment of the California Consumer Privacy Act (CCPA)", "News", "2018 (CCPA Pioneer)", "Technology & Infrastructure", 3,
  "Landmark state statute granting consumers the right to know what personal data is collected and opt out of its sale.",
  "1 = Vital First Step Toward Establishing Fundamental Data Privacy Rights in the United States", "10 = Support National Preemption Standard to Avoid a Patchwork of 50 Conflicting State Data Laws", 2, 7, 5, 1, 7, 1);

add(2018, "2018_government_shutdown_border_wall_stalemate", "Impending Federal Government Shutdown over $5.7B Border Wall Funding", "News", "2018-2019 (Historic 35-Day Shutdown)", "Governance & Judiciary", 2,
  "President Trump refusing to sign spending bills without $5.7 billion for the southern border wall, triggering a 35-day shutdown.",
  "1 = Refuse to Surrender to Presidential Extortion over an Ineffective Vanity Border Wall", "10 = Stand Firm on Funding Border Barriers to Protect American Homeland Security", 2, 10, 4, 1, 10, 1);

add(2018, "2018_california_prop_12_animal_confinement", "California Proposition 12 (Cruelty-Free Housing Standards for Farm Animals)", "News", "2018 (Historic Animal Housing Ballot Win)", "Agriculture & Food", 4,
  "Voter approval (62.7%) establishing minimum square-foot space requirements for breeding pigs, calves, and egg-laying hens.",
  "1 = Historic Victory for Compassion Ending Cruel Confinement in Factory Farm Operations", "10 = Unconstitutional Interstate Overreach Imposing Costly Mandates on Midwestern Pork Farmers", 2, 7, 5, 1, 8, 1);

console.log('Bracket 3 (2016 & 2018) total:', ISSUES.length);
// =========================================================================
// 2020 (52 Issues)
// =========================================================================
add(2020, "2020_covid_19_lockdowns_school_closures", "COVID-19 Pandemic Response: Lockdowns, Mask Mandates & School Closures", "News", "2020-2022 (COVID Emergency Phase)", "Healthcare", 1,
  "Evaluating federal and state emergency mandates closing schools, shutting down non-essential businesses, and imposing indoor masks.",
  "1 = Prioritize Public Health, Scientific Guidance, Universal Masks, and Safe Virtual Schooling", "10 = End Destructive Lockdowns, Reopen Schools Immediately, and Protect Individual Liberty", 2, 10, 10, 1, 9, 1);

add(2020, "2020_cares_act_stimulus_checks", "CARES Act ($2.2 Trillion Relief, $1,200 Stimulus Checks & PPP Loans)", "News", "2020-2021 (Emergency Relief Spending)", "Economy & Taxation", 1,
  "Passing the largest emergency economic rescue in history with direct stimulus checks, $600/wk unemployment boosts, and PPP grants.",
  "1 = Essential Economic Lifeline for Working Families / Pass Even Larger Relief Packages", "10 = Necessary Short-Term Emergency Action but Exploding Deficits and Stifling Work Incentives", 2, 8, 9, 1, 8, 1);

add(2020, "2020_george_floyd_racial_justice_protests", "Murder of George Floyd & Nationwide Racial Justice Protests", "News", "2020-2022 (Racial Justice Reckoning)", "Civil Rights & Social Issues", 1,
  "Global protests against police brutality following the killing of George Floyd, igniting national demands for criminal justice reform.",
  "1 = Dismantle Systemic Racism, Ban Chokeholds, Reform Qualified Immunity, and Defend BLM", "10 = Stand Unwaveringly with Law Enforcement / Crush Violent Urban Riots and Antifa Terrorism", 2, 10, 3, 1, 10, 1);

add(2020, "2020_defund_the_police_debate", "Calls to 'Defund the Police' & Reallocate Municipal Budgets", "News", "2020-2022 (Municipal Police Budget Battles)", "Civil Rights & Social Issues", 1,
  "Progressive activist demands to redirect city police budgets toward social workers, community healthcare, and affordable housing.",
  "1 = Reallocate Police Funds to Address the Root Causes of Poverty, Mental Illness, and Addiction", "10 = Total Rejection of Dangerous 'Defund the Police' Slogans That Cause Violent Crime Surges", 3, 10, 5, 1, 10, 1);

add(2020, "2020_mail_in_voting_expansion_fraud_claims", "Universal Mail-in Voting Expansion & Trump Election Fraud Warnings", "News", "2020 (Pandemic Voting Battles)", "Governance & Judiciary", 1,
  "States mailing ballots to all registered voters due to COVID-19 and Trump's claims that universal mail voting invites massive fraud.",
  "1 = Protect and Expand Mail Voting and Drop Boxes to Ensure Safe Democratic Access During Pandemic", "10 = Stop Mass Unsolicited Mail Ballots Prone to Fraud and Ballot Harvesting / Protect Integrity", 2, 10, 4, 1, 10, 1);

add(2020, "2020_amy_coney_barrett_confirmation", "Amy Coney Barrett Supreme Court Confirmation (Cementing 6-3 Majority)", "News", "2020 (RBG Vacancy Flashpoint)", "Governance & Judiciary", 1,
  "Senate confirming originalist Amy Coney Barrett just eight days before the election following the death of Ruth Bader Ginsburg.",
  "1 = Illegitimate Hypocritical Power Grab Right Before an Election / Support Court Reform", "10 = Fulfill Constitutional Duty Confirming a Brilliant Originalist Jurist to Cement Conservative Majority", 2, 10, 7, 1, 10, 1);

add(2020, "2020_operation_warp_speed_vaccines", "Operation Warp Speed Acceleration of mRNA COVID-19 Vaccines", "News", "2020-2021 (Vaccine Development Arc)", "Healthcare", 1,
  "Federal $10+ billion public-private partnership slashing bureaucratic red tape to produce authorized COVID vaccines in under a year.",
  "1 = Triumph of Biomedical Science Supported by Public Investment / Ensure Equitable Global Access", "10 = Historic Trump Administration Victory Delivering Medical Miracles in Record Time", 2, 8, 8, 2, 7, 1);

add(2020, "2020_paris_climate_agreement_reentry", "Joe Biden Pledge to Rejoin Paris Accord & 2050 Net-Zero Goal", "News", "2020-2026 (Net-Zero Climate Target)", "Energy & Climate", 1,
  "Pledging to rejoin the Paris Agreement on day one and implement a $2 trillion clean energy plan to reach net-zero emissions by 2050.",
  "1 = Rejoin Paris Immediately / Transform Economy with Massive Clean Energy and Green Union Jobs", "10 = Stay Out of Paris / Protect Abundant American Oil, Natural Gas, and Petrochemical Manufacturing", 2, 10, 9, 1, 10, 1);

add(2020, "2020_title_42_border_expulsions", "Title 42 Emergency Public Health Border Expulsions", "News", "2020-2023 (Title 42 Health Protocol)", "Immigration & Border", 1,
  "Invoking 1944 Public Health Service Act to immediately expel undocumented migrants arriving at the border without asylum hearings.",
  "1 = Immediate Rescission of Cruel, Pretextual Expulsions Denying Fundamental Legal Asylum Rights", "10 = Maintain Title 42 to Protect Border Patrol Agents and Prevent Overwhelming Border Surges", 2, 10, 3, 1, 10, 1);

add(2020, "2020_china_trade_decoupling_huawei_ban", "U.S.-China Strategic Decoupling & Global Blacklist of Huawei 5G", "News", "2019-2026 (Tech Cold War)", "Trade & Globalism", 1,
  "Banning U.S. chips to Huawei and restricting Chinese tech giants TikTok and WeChat under national security authorities.",
  "1 = Strategic Targeted Tech Controls While Maintaining Diplomatic Channels and Climate Cooperation", "10 = Aggressive Decoupling, Supply Chain Reshoring, and Banning All Chinese Spyware Tech", 3, 9, 7, 1, 8, 1);

add(2020, "2020_oregon_measure_110_drug_decriminalization", "Oregon Measure 110 (Drug Decriminalization & Treatment Initiative)", "News", "2020-2024 (Historic Decriminalization Experiment)", "Civil Rights & Social Issues", 2,
  "Voter initiative decriminalizing personal possession of all hard drugs (heroin, cocaine, meth) and funding addiction recovery.",
  "1 = Vote Yes / Pioneering Humane Public Health Model Moving Beyond Failed Punitive Drug War", "10 = Vote No / Disastrous Radical Policy Fueling Open-Air Drug Encampments, Overdoses, and Crime", 2, 8, 1, 1, 9, 1);

add(2020, "2020_florida_amendment_2_fifteen_dollar_wage", "Florida Amendment 2 (Phasing in $15 Minimum Wage by 2026)", "News", "2020 (Red State $15 Wage Breakthrough)", "Labor & Welfare", 2,
  "Constitutional initiative approved by 60.8% of Florida voters raising the state minimum wage incrementally to $15 by 2026.",
  "1 = Historic Southern Victory Proving Working Families Deserve a Living Wage Everywhere", "10 = Devastating Mandate Hurting Small Businesses and Service Workers in Tourist Economies", 2, 8, 10, 1, 9, 1);

add(2020, "2020_qanon_conspiracy_theories_mainstream", "Rise of QAnon Conspiracy Theories & GOP Candidates", "News", "2020-2021 (QAnon Phenomenon)", "Governance & Judiciary", 2,
  "FBI declaring QAnon a domestic terrorism threat while several Republican congressional nominees openly promote its claims.",
  "1 = Condemn Dangerous, Delusional Cult Poisoning Conservative Politics and Fueling Violence", "10 = Focus on Real Deep State Corruption Rather Than Media Smears Against Patriotic Skeptics", 2, 9, 5, 1, 8, 1);

add(2020, "2020_hunter_biden_laptop_censorship", "New York Post Hunter Biden Laptop Article & Social Media Censorship", "News", "2020-2024 (Hunter Laptop & First Amendment)", "Technology & Infrastructure", 2,
  "Twitter and Facebook censoring New York Post reporting on emails found on Hunter Biden's abandoned laptop just weeks before voting.",
  "1 = Legitimate Measures by Platforms to Halt Disinformation / Russian Propaganda Warning", "10 = Blatant Election Interference and Big Tech Censorship Shielding the Biden Family from Scrutiny", 2, 10, 2, 1, 9, 1);

add(2020, "2020_abraham_accords_mideast_normalization", "Abraham Accords Normalizing Relations with Israel (UAE, Bahrain, Sudan)", "News", "2020-2026 (Abraham Accords Realignment)", "Foreign Policy & Defense", 2,
  "Historic diplomatic normalization pacts signed between Israel and Arab nations without resolving Palestinian statehood.",
  "1 = Welcome Regional Normalization While Insisting Genuine Middle East Peace Requires Palestinian Rights", "10 = Historic Breakthrough of Trump Statesmanship Shattering the Discredited Foreign Policy Blob", 3, 10, 6, 1, 9, 1);

add(2020, "2020_oregon_measure_109_psilocybin_therapy", "Oregon Measure 109 (Legalization of Therapeutic Psilocybin Services)", "News", "2020 (Psychedelic Therapy Genesis)", "Healthcare", 3,
  "Approving the first statewide regulatory framework allowing licensed facilitators to administer psilocybin for depression and PTSD.",
  "1 = Groundbreaking Medical Breakthrough for Severe Mental Health, Depression, and Veteran Trauma", "10 = Oppose Opening the Door to Hallucinogenic Drug Commercialization and Abuse", 2, 8, 1, 1, 9, 1);

add(2020, "2020_california_prop_22_gig_worker_status", "California Proposition 22 (App-Based Drivers as Independent Contractors)", "News", "2020 (Gig Economy Labor Battle)", "Labor & Welfare", 2,
  "$200M ballot fight funded by Uber and Lyft exempting app drivers from AB 5 employee classification while offering wage floors.",
  "1 = Vote No / Uber Must Treat Workers as Full Employees with Overtime, Healthcare, and Unemployment", "10 = Vote Yes / Protect Flexible Work Schedules and Inexpensive Rides for Millions of Californians", 2, 8, 9, 1, 8, 1);

add(2020, "2020_kyle_rittenhouse_kenosha_shootings", "Kenosha Unrest, Jacob Blake Shooting & Kyle Rittenhouse Fatal Shootings", "News", "2020-2021 (Self-Defense & Riot Polarizer)", "Civil Rights & Social Issues", 2,
  "Seventeen-year-old carrying an AR-15 shooting three men during Kenosha unrest, igniting national debates over vigilantism vs self-defense.",
  "1 = Condemn Lawless Armed Vigilante Emboldened by Right-Wing Media to Kill Protesters", "10 = Defend Fundamental Right to Self-Defense in the Face of Violent Rioters Burning Cities", 2, 10, 4, 1, 10, 1);

add(2020, "2020_hydroxychloroquine_bleach_controversy", "Presidential Promotion of Hydroxychloroquine as COVID Miracle Cure", "News", "2020 (COVID Medical Misinformation)", "Healthcare", 2,
  "President Trump publicly touting anti-malarial drug hydroxychloroquine and musing on disinfectant injections despite FDA cautions.",
  "1 = Dangerous Anti-Science Rhetoric from the White House Costing American Lives", "10 = Encourage Innovative Off-Label Treatments / Expose Regulatory Foot-Dragging by the Deep State", 2, 9, 5, 1, 9, 1);

add(2020, "2020_afghanistan_doha_agreement_taliban", "U.S.-Taliban Doha Agreement Pledging Full U.S. Military Exit by May 2021", "News", "2020-2021 (Doha Agreement Phase)", "Foreign Policy & Defense", 2,
  "Signing historic bilateral accord with the Taliban agreeing to withdraw all foreign troops in exchange for counterterror pledges.",
  "1 = End America's Longest War / Fulfill Vital Priority of Bringing U.S. Combat Forces Home", "10 = Flawed Unconditional Surrender Agreement Undermining the Democratic Afghan Government", 3, 8, 2, 1, 5, 1);

add(2020, "2020_great_reset_economic_world_forum", "World Economic Forum 'Great Reset' Initiative Backlash", "News", "2020-2026 (Globalist Governance Controversy)", "Economy & Taxation", 3,
  "Davos agenda advocating stakeholder capitalism and green transitions, fueling conservative fears of technocratic global tyranny.",
  "1 = Embrace Sustainable Global Cooperation to Rebuild Green, Equitable Economies Post-Pandemic", "10 = Resist the Authoritarian Great Reset Agenda Designed to Destroy National Sovereignty and Property", 2, 9, 7, 1, 10, 1);

add(2020, "2020_bostock_v_clayton_county_scotus", "Supreme Court Landmark LGBTQ Workplace Ruling (Bostock v. Clayton County)", "News", "2020 (Title VII LGBTQ Landmark)", "Civil Rights & Social Issues", 2,
  "Justice Gorsuch writing 6-3 textualist opinion holding that Title VII's sex discrimination ban protects sexual orientation and gender identity.",
  "1 = Historic Civil Rights Milestone Prohibiting Workplace Discrimination Nationwide", "10 = Judicial Usurpation Rewriting Civil Rights Act Language Against Original Congressional Intent", 2, 10, 4, 1, 10, 1);

add(2020, "2020_supreme_court_court_packing_debate", "Calls to Expand the Supreme Court ('Court Packing') Following Barrett", "News", "2020-2022 (Court Expansion Controversy)", "Governance & Judiciary", 2,
  "Progressive demands for Democrats to expand the Supreme Court beyond 9 justices if they win the White House and Senate.",
  "1 = Restore Institutional Balance to a Politically Hijacked Court via Expansion or Term Limits", "10 = Protect Independent Judiciary Against Destructive Radical Court-Packing Power Grabs", 2, 10, 6, 1, 10, 1);

add(2020, "2020_tiktok_wechat_presidential_ban_orders", "Executive Orders Banning U.S. Transactions with ByteDance (TikTok)", "News", "2020-2024 (TikTok National Security Arc)", "Technology & Infrastructure", 2,
  "Ordering ByteDance to divest U.S. TikTok operations or face a nationwide app store ban over Chinese data surveillance risks.",
  "1 = Address Legitimate Foreign Cybersecurity Risks with Narrow Privacy Protections Without Banning Speech", "10 = Ban Chinese Communist Party Spyware TikTok Immediately to Protect American User Data", 3, 9, 6, 1, 9, 1);

add(2020, "2020_cleveland_indians_washington_redskins_names", "Retirement of Native American Mascots (Washington Redskins & Cleveland Indians)", "News", "2020-2022 (Cultural Symbolism Arc)", "Civil Rights & Social Issues", 3,
  "Major sports franchises announcing retirement of racist and offensive Native American logos and names under sponsor pressure.",
  "1 = Long-Overdue Respect Ending Decades of Inhumane Racial Stereotyping in Popular Culture", "10 = Surrender to Woke Corporate Activism Destroying Beloved Historic American Traditions", 2, 9, 4, 1, 10, 1);

add(2020, "2020_california_prop_16_affirmative_action", "California Proposition 16 (Attempt to Repeal Prop 209 Affirmative Action Ban)", "News", "2020 (Affirmative Action Ballot Fight)", "Civil Rights & Social Issues", 2,
  "Voters decisively rejecting (57% No) an initiative to restore race- and gender-conscious admissions and public contracting in CA.",
  "1 = Vote Yes / Remedy Persistent Racial Wealth Gaps and Systemic Educational Disparities", "10 = Vote No / Preserve Pure Colorblind Equality and Merit in Public Education and Contracting", 2, 9, 7, 1, 10, 1);

add(2020, "2020_cdc_federal_eviction_moratorium", "CDC Nationwide Agency Eviction Moratorium for Renters", "News", "2020-2021 (Eviction Moratorium Litigation)", "Labor & Welfare", 2,
  "Public health order halting residential tenant evictions nationwide to stop the spread of COVID-19, challenging property rights.",
  "1 = Prevent Catastrophic Mass Homelessness and Save Lives During a Global Pandemic Emergency", "10 = Unconstitutional Agency Power Grab Bankrupting Small Mom-and-Pop Landlords Without Due Process", 2, 10, 10, 1, 9, 1);

add(2020, "2020_meatpacking_plant_covid_outbreaks", "Defense Production Act Executive Order Keeping Meatpacking Plants Open", "News", "2020 (Essential Worker Safety Arc)", "Agriculture & Food", 3,
  "Designating commercial meat processing plants as critical infrastructure to avert national grocery shortages during deadly outbreaks.",
  "1 = Protect Vulnerable Immigrant Workers with Mandatory OSHA Distancing and Enforceable Safety", "10 = Protect the National Food Supply Chain from Collapse / Shield Processors from Frivolous Lawsuits", 2, 9, 8, 1, 8, 1);

add(2020, "2020_qassem_soleimani_drone_strike", "Assassination of Iranian IRGC General Qassem Soleimani in Baghdad", "News", "2020 (Soleimani Strike & Escalation)", "Foreign Policy & Defense", 2,
  "Precision MQ-9 Reaper drone strike eliminating Iran's top Quds Force commander, sparking retaliatory missile strikes on U.S. troops.",
  "1 = Reckless Extrajudicial Assassination Bringing America to the Brink of a Disastrous All-Out War", "10 = Decisive Commander-in-Chief Leadership Eliminating a Murderous Terrorist Mastermind", 2, 10, 3, 1, 9, 1);

add(2020, "2020_colorado_prop_118_paid_family_leave", "Colorado Proposition 118 (State-Administered Paid Family and Medical Leave)", "News", "2020 (State Paid Leave Ballot Measure)", "Labor & Welfare", 3,
  "Voter approval (57.7%) establishing state disability insurance providing 12 weeks of paid leave funded by 50/50 payroll tax.",
  "1 = Guarantee Paid Family Leave so No Worker Chooses Between Caring for a Newborn and a Paycheck", "10 = Oppose New Regressive Payroll Taxes Burdening Small Businesses During an Economic Recovery", 2, 8, 10, 1, 9, 1);

add(2020, "2020_california_electric_car_mandate_2035", "Governor Newsom Executive Order Banning New Gas Cars by 2035", "News", "2020-2026 (Zero-Emission Vehicle Mandate)", "Energy & Climate", 3,
  "Mandating all new passenger cars and trucks sold in California be zero-emission electric vehicles by 2035.",
  "1 = Bold Action Catalyzing Clean Transportation and Ending Toxic Tailpipe Smog in Disadvantaged Communities", "10 = Authoritarian Mandate Forcing Expensive Inconvenient EVs on Working Consumers / Grid Collapse", 2, 9, 9, 1, 9, 1);

add(2020, "2020_california_prop_15_split_roll_tax", "California Proposition 15 (Schools & Communities First Split-Roll Tax Defeat)", "News", "2020 (Prop 13 Commercial Property Battle)", "Economy & Taxation", 3,
  "Voters narrowly defeating (52% No) a measure to reassess commercial properties worth over $3M at current market value.",
  "1 = Make Giant Commercial Real Estate Corporations Pay Fair Share to Fund Neighborhood Schools", "10 = Protect Proposition 13 and Save Small Businesses from Massive Property Tax Inflation", 2, 9, 10, 1, 9, 1);

add(2020, "2020_michigan_governor_whitmer_kidnapping_plot", "FBI Foiling Armed Militia Plot to Kidnap Michigan Governor Gretchen Whitmer", "News", "2020 (Domestic Militia Terrorism)", "Civil Rights & Social Issues", 2,
  "Arresting 13 anti-government militia members plotting to storm the state capitol and kidnap the governor over COVID lockdowns.",
  "1 = Denounce Right-Wing Domestic Terrorism Fanned by Violent Presidential Rhetoric ('LIBERATE MICHIGAN!')", "10 = Prosecute Violent Criminals While Guarding Against FBI Entrapment of Overzealous Citizens", 2, 9, 4, 1, 8, 1);

add(2020, "2020_zoom_telehealth_regulatory_waivers", "Emergency Federal Waivers Expanding Telehealth & Virtual Healthcare", "News", "2020-2024 (Telehealth Revolution)", "Healthcare", 3,
  "Medicare lifting interstate practice restrictions and paying equal reimbursement rates for video medical consultations.",
  "1 = Permanent Universal Telehealth Coverage to Expand Rural and Mental Health Care Access", "10 = Make Regulatory Waivers Permanent to Cut Healthcare Costs Through Free Market Digital Care", 2, 7, 3, 1, 6, 1);

add(2020, "2020_alaska_ballot_measure_2_ranked_choice", "Alaska Ballot Measure 2 (Top-Four Open Primary & Ranked-Choice Voting)", "News", "2020 (Alaska Nonpartisan Voting Pioneer)", "Governance & Judiciary", 3,
  "Narrow voter approval (50.5%) creating an all-party open primary with the top four advancing to a ranked-choice general election.",
  "1 = Transformative Reform Weakening Extremist Partisan Primaries and Rewarding Consensus Lawmakers", "10 = Confusing Scheme Designed to Dilute Republican Majorities and Obscure Voter Intent", 3, 7, 1, 1, 2, 1);

add(2020, "2020_clean_air_fuel_economy_safe_rule", "Safer Affordable Fuel-Efficient (SAFE) Vehicles Rule Lowering MPG Standards", "News", "2020-2022 (Auto Fuel Economy Rollback)", "Energy & Climate", 3,
  "Rolling back Obama fuel economy increases from 5% annually to 1.5% and revoking California's Clean Air Act waiver.",
  "1 = Illegal Rollback Worsening Air Pollution and Raising Lifetime Gasoline Costs for Drivers", "10 = Lower Vehicle Production Costs to Make Newer, Safer, More Affordable Cars Accessible to Families", 2, 10, 9, 1, 9, 1);

add(2020, "2020_mississippi_state_flag_confederate_emblem", "Mississippi Voters Approving New State Flag Replacing Confederate Emblem", "News", "2020 (Confederate Symbolism Removal)", "Civil Rights & Social Issues", 3,
  "73% of voters approving a new state flag featuring a magnolia and 'In God We Trust', retiring the 1894 Confederate battle flag.",
  "1 = Long-Overdue Step Shedding Divisive Symbols of Slavery and White Supremacy in the Deep South", "10 = Welcome New Unifying Flag While Preserving Historical Awareness and Southern Heritage", 2, 8, 4, 1, 9, 1);

add(2020, "2020_federal_reserve_corporate_credit_facilities", "Federal Reserve Corporate Bond Buying (SMCCF & Secondary Market Purchases)", "News", "2020-2021 (Fed Corporate Bailouts)", "Economy & Taxation", 3,
  "Federal Reserve taking the unprecedented step of purchasing corporate debt and junk bond ETFs to calm volatile credit markets.",
  "1 = Bailout for Wealthy Bondholders While Everyday Americans Struggle to Buy Groceries", "10 = Decisive Monetary Intervention Averting Systemic Liquidity Freezes and Widespread Bankruptcies", 3, 8, 10, 1, 9, 2);

add(2020, "2020_california_prop_25_cash_bail_repeal", "California Proposition 25 (Voter Rejection of Eliminating Cash Bail)", "News", "2020 (Cash Bail Referendum Defeat)", "Civil Rights & Social Issues", 3,
  "Voters rejecting a state law that would have replaced money bail with automated risk assessment algorithms.",
  "1 = End Wealth-Based Incarceration / Fix Flawed Risk Assessment Algorithms to Achieve Real Justice", "10 = Uphold the Power of Cash Bail to Ensure Defendants Appear in Court and Keep Violent Criminals Off Streets", 2, 8, 5, 1, 9, 1);

add(2020, "2020_usps_louis_dejoy_mail_sorting_cuts", "Postmaster General Louis DeJoy Operational Changes & Mail Delays", "News", "2020 (Postal Voting Security Controversy)", "Governance & Judiciary", 2,
  "Removing high-speed sorting machines and cutting overtime right before an election with record mail-in ballots.",
  "1 = Deliberate Sabotage of the U.S. Postal Service to Suppress Mail Ballots / Remove DeJoy Immediately", "10 = Long-Overdue Operational Streamlining to Stem Billions in Chronic Postal Waste", 2, 10, 7, 1, 9, 1);

add(2020, "2020_armenia_azerbaijan_nagorno_karabakh", "Second Nagorno-Karabakh War & Turkish Drone Dominance", "News", "2020 (Nagorno-Karabakh Conflict)", "Foreign Policy & Defense", 4,
  "Azerbaijani military forces using advanced Turkish and Israeli armed drones to recapture territory from ethnic Armenians.",
  "1 = Enact Sanctions on Azerbaijan and Turkey for War Crimes Against Indigenous Armenians", "10 = Maintain Neutrality / Prevent Destabilizing Escalation Between Russia and NATO Ally Turkey", 2, 7, 5, 1, 7, 1);

add(2020, "2020_colorado_prop_115_twenty_two_week_ban", "Colorado Proposition 115 (Attempt to Ban Late-Term Abortions After 22 Weeks Defeat)", "News", "2020 (State Late-Term Abortion Ballot Battle)", "Civil Rights & Social Issues", 3,
  "Voters decisively rejecting (59% No) an initiative to criminalize abortions performed at or after 22 weeks gestational age.",
  "1 = Protect Reproductive Freedom and Trust Women and Doctors in Complex Medical Situations", "10 = Pass Protections for Pain-Capable Unborn Babies and End Gruesome Late-Term Abortions", 2, 10, 4, 1, 10, 1);

add(2020, "2020_antifa_domestic_terror_designation", "Presidential Threats to Formally Designate Antifa as a Domestic Terrorist Organization", "News", "2020 (Civil Unrest & Domestic Extremism)", "Civil Rights & Social Issues", 2,
  "Proposing domestic terrorism designations for violent left-wing anarchist agitators clashing with police in Portland and Seattle.",
  "1 = Dangerous Authoritarian Distraction Weaponizing Federal Law to Criminalize Left-Wing Political Protest", "10 = Classify Violent Anarchist Antifa Terrorists and Enforce Federal Anti-Riot Acts Rigorously", 2, 10, 4, 1, 10, 1);

add(2020, "2020_hydroxychloroquine_fda_eua_revocation", "FDA Revocation of Emergency Use Authorization for Hydroxychloroquine", "News", "2020 (FDA Regulatory Independence)", "Healthcare", 3,
  "FDA pulling emergency authorization after randomized clinical trials proved the drug had no benefit against COVID and caused cardiac risks.",
  "1 = Uphold Rigorous Evidence-Based Science and Reaffirm Independence from Political Pressures", "10 = Bureaucratic Deep State Suppression of Inexpensive, Off-Patent Treatments to Boost Pharma Profits", 2, 9, 6, 1, 9, 1);

add(2020, "2020_social_media_section_230_repeal_threats", "Bipartisan Demands to Repeal or Modify Section 230 Immunity for Big Tech", "Ideological", "1996-2026 (Section 230 Reform Arc)", "Technology & Infrastructure", 2,
  "Trump and Biden both demanding repeal of CDA Section 230 shielding online platforms from liability for user-generated speech.",
  "1 = Strip Immunity for Platforms Spreading Lethal Medical Disinformation and Hate Speech", "10 = Strip Immunity to Stop Big Tech Gatekeepers from Censoring Conservative Political Speech", 3, 8, 2, 1, 8, 1);

add(2020, "2020_nevada_question_2_constitutional_marriage_equality", "Nevada Question 2 (Constitutional Recognition of Same-Sex Marriage)", "News", "2020 (State Constitutional Equality Win)", "Civil Rights & Social Issues", 2,
  "First state in the nation where voters approved (62%) a constitutional amendment guaranteeing same-sex marriage regardless of gender.",
  "1 = Historic Voter Milestone Cementing Inalienable Marriage Equality into State Constitutions", "10 = Defend Traditional Religious Marriage and Conscience Exemptions for Faith-Based Organizations", 2, 9, 2, 1, 10, 1);

add(2020, "2020_defense_production_act_ventilators_n95", "Invoking Defense Production Act for N95 Masks and Critical Ventilators", "News", "2020 (Emergency Domestic Production)", "Technology & Infrastructure", 3,
  "Ordering General Motors and 3M to manufacture emergency ventilators and millions of N95 respirators for the national stockpile.",
  "1 = Essential Command Leadership Ensuring Healthcare Heroes Have Life-Saving Protective Equipment", "10 = Private Companies Stepped Up Voluntarily / Avoid Unnecessary Command-and-Control Coercion", 2, 7, 8, 1, 7, 1);

add(2020, "2020_cuba_embargo_re_imposition_remittances", "Banning Western Union Remittance Services to Cuba via Fincimex", "News", "2020-2021 (Trump Maximum Pressure Cuba)", "Foreign Policy & Defense", 4,
  "Sanctioning Cuban military-run financial firm Fincimex, shutting down all 400 Western Union wire transfer offices across the island.",
  "1 = Inhumane Cruelty Punishing Struggling Cuban Families Relying on Basic Food and Medicine from U.S. Relatives", "10 = Stop the Cuban Military Oligarchy from Skimming Millions in Transaction Fees from Remittances", 2, 9, 3, 1, 9, 1);

add(2020, "2020_kenosha_national_guard_deployment", "Deployment of Wisconsin National Guard Post-Rittenhouse Shootings", "News", "2020 (State National Guard Deployments)", "Civil Rights & Social Issues", 2,
  "Governor Evers deploying 500 National Guard troops following days of arson and fatal shootings in downtown Kenosha.",
  "1 = Restore Peace While Addressing the Deep Roots of Systemic Injustice and Community Trauma", "10 = Long-Overdue Deployment That Should Have Happened on Night One to Prevent Lawless Destruction", 2, 10, 6, 1, 10, 1);

add(2020, "2020_california_prop_17_parolee_voting_rights", "California Proposition 17 (Voting Rights for People on State Parole)", "News", "2020 (Parolee Voting Rights Measure)", "Governance & Judiciary", 3,
  "Constitutional initiative approved by 58.6% of voters restoring the right to vote for 50,000 Californians on parole.",
  "1 = Reintegration and Full Democratic Participation for Citizens Who Have Completed Their Prison Terms", "10 = Parolees Have Not Yet Fully Paid Their Debt to Society and Should Not Vote Until Discharge", 2, 9, 3, 1, 10, 1);

add(2020, "2020_alaska_pebble_mine_army_corps_veto", "Army Corps of Engineers Denial of Key Clean Water Permit for Pebble Mine", "News", "2020-2023 (Pebble Mine Final Denials)", "Energy & Climate", 3,
  "Federal regulators formally rejecting the proposed open-pit copper and gold mine in Alaska's pristine Bristol Bay watershed.",
  "1 = Vital Permanent Victory Protecting the World's Greatest Wild Sockeye Salmon Fishery and Native Culture", "10 = Bad Precedent Denying Billions in Strategic Copper and Molybdenum Needed for High-Tech and Clean Energy", 2, 8, 8, 1, 8, 1);

add(2020, "2020_ppp_small_business_loan_forgiveness", "Paycheck Protection Program (PPP) Blanket Forgiveness for Under $150K", "News", "2020-2021 (PPP Forgiveness Debate)", "Economy & Taxation", 2,
  "Enacting simplified, one-page automatic loan forgiveness for small business PPP loans under $150,000.",
  "1 = Streamline Forgiveness for Real Main Street Businesses While Aggressively Auditing Fraudulent Grifters", "10 = Provide Immediate Blanket Forgiveness to Lift Crushing Financial Uncertainty from Small Business Owners", 2, 8, 9, 1, 8, 1);


// =========================================================================
// 2022 (52 Issues)
// =========================================================================
add(2022, "2022_dobbs_v_jackson_overturning_roe", "Overturning Roe v. Wade (Dobbs v. Jackson Women's Health Organization)", "News", "2022-2026 (Post-Dobbs Abortion Wars)", "Civil Rights & Social Issues", 1,
  "Supreme Court holding that the Constitution confers no right to abortion, triggering state trigger bans across 14 conservative states.",
  "1 = Codify Roe v. Wade into Federal Law / Protect Universal Reproductive Healthcare Autonomy", "10 = Historic Triumph for the Sanctity of Human Life / Uphold Complete State Prohibitions on Abortion", 2, 10, 5, 1, 10, 1);

add(2022, "2022_forty_year_high_inflation_cpi", "40-Year High Inflation (8.5% CPI) & Soaring Grocery and Gas Prices ($5/Gal)", "News", "2021-2024 (Post-Pandemic Inflation Spike)", "Economy & Taxation", 1,
  "Confronting the worst inflation in four decades driven by supply chain bottlenecks, energy shocks, and trillions in pandemic stimulus.",
  "1 = Crack Down on Corporate Price Gouging / Pass Inflation Reduction Act Clean Energy Subsidies", "10 = Stop Reckless Trillion-Dollar Socialist Deficit Spending Stifling American Energy Production", 2, 10, 10, 1, 10, 1);

add(2022, "2022_russian_invasion_of_ukraine_aid", "Russian Full-Scale Invasion of Ukraine & $100B+ U.S. Military/Financial Aid", "News", "2022-2026 (Russo-Ukrainian War)", "Foreign Policy & Defense", 1,
  "Appropriating massive multi-billion-dollar packages of HIMARS, artillery, and intelligence to support Kyiv against Vladimir Putin's invasion.",
  "1 = Stand with Democratic Ukraine 'As Long as It Takes' to Defeat Russian Imperial Aggression", "10 = Stop Writing Blank Checks to Foreign Corrupt Wars / Prioritize American Border Security First", 3, 7, 4, 1, 6, 1);

add(2022, "2022_inflation_reduction_act_enactment", "Inflation Reduction Act (IRA - $369B Climate, Pharma Price Negotiation & 15% AMT)", "News", "2022-2026 (IRA Implementation)", "Economy & Taxation", 1,
  "Landmark reconciliation bill funding clean energy manufacturing, enabling Medicare drug negotiation, and enacting a 15% corporate tax floor.",
  "1 = Greatest Legislative Climate & Clean Energy Investment in World History / Lowers Healthcare Costs", "10 = Misnamed Tax-and-Spend Boondoggle Giving Green Handouts to Elites While Worsening Inflation", 2, 10, 10, 1, 10, 1);

add(2022, "2022_student_loan_forgiveness_executive_order", "President Biden Executive Cancellation of Up to $20,000 in Student Debt", "News", "2022-2023 (Student Debt Cancellation)", "Education", 1,
  "Cancelling up to $10,000 ($20,000 for Pell recipients) in federal student loan debt for borrowers earning under $125,000.",
  "1 = Transformative Racial and Economic Justice Relieving Crushing Debt on Millions of Working Families", "10 = Unconstitutional, Unfair Handout Forcing Blue-Collar Workers to Pay for Elite College Degrees", 2, 10, 10, 1, 10, 1);

add(2022, "2022_southern_border_migrant_busses", "Record Southwest Border Encounters (2.3M) & Governors Bussing to Northern Cities", "News", "2021-2024 (Border Bus Campaign)", "Immigration & Border", 1,
  "Texas Governor Abbott and Florida Governor DeSantis bussing tens of thousands of asylum seekers to NYC, Chicago, and Martha's Vineyard.",
  "1 = Condemn Inhumane Political Stunts Weaponizing Vulnerable Human Beings Seeking Refuge", "10 = Force Sanctuary Cities and Washington to Experience the Unbearable Reality of the Open Border Crisis", 2, 10, 4, 1, 10, 1);

add(2022, "2022_bipartisan_safer_communities_act", "Bipartisan Safer Communities Act (First Federal Gun Bill in 30 Years)", "News", "2022 (Post-Uvalde/Buffalo Enactment)", "Civil Rights & Social Issues", 1,
  "Enacting enhanced background checks for buyers under 21, red flag grant funding, and closing the 'boyfriend loophole' post-Uvalde.",
  "1 = Crucial First Step / Must Ban Military-Style Assault Weapons and High-Capacity Magazines Next", "10 = Red Flag Laws Violate Due Process / Infringes on Lawful Second Amendment Rights of Young Adults", 2, 8, 10, 1, 9, 2);

add(2022, "2022_chips_and_science_act", "CHIPS and Science Act ($52 Billion for Domestic Semiconductor Manufacturing)", "News", "2022-2026 (Semiconductor Reshoring)", "Technology & Infrastructure", 1,
  "Providing $52.7 billion in direct subsidies and loan guarantees to build advanced microchip fabrication plants in the United States.",
  "1 = Vital Strategic Industrial Policy Reshoring Critical Tech and Protecting National Security from China", "10 = Corporate Welfare Handout to Multi-Billion-Dollar Chip Conglomerates with Zero Offsets", 2, 6, 9, 1, 7, 1);

add(2022, "2022_kansas_value_them_both_defeat", "Kansas 'Value Them Both' Constitutional Abortion Amendment (Defeated 59% to 41%)", "News", "2022 (First Post-Dobbs Ballot Shock)", "Civil Rights & Social Issues", 1,
  "Voters in deep-red Kansas decisively rejecting a constitutional amendment that would have removed abortion rights from the state constitution.",
  "1 = Seismic Democratic Victory Proving Americans Overwhelmingly Reject Extreme Abortion Bans Everywhere", "10 = Disappointing Result Driven by Massive Deceptive Out-of-State Advertising by Pro-Abortion Groups", 2, 10, 5, 1, 10, 1);

add(2022, "2022_infant_formula_supply_crisis", "National Infant Formula Shortage & Abbott Sturgis Plant Shutdown", "News", "2022 (Operation Fly Formula)", "Healthcare", 1,
  "Abbott plant contamination causing 40%+ out-of-stock rates, prompting Biden to invoke the Defense Production Act and fly formula from Europe.",
  "1 = Broken Monopoly Concentration in Essential Markets / Aggressive Antitrust Enforcement Required", "10 = Incompetent FDA Regulatory Foot-Dragging Causing Unnecessary Suffering for Stressed Parents", 2, 8, 7, 1, 7, 1);

add(2022, "2022_fbi_search_mar_a_lago_classified", "FBI Search of Mar-a-Lago for Classified National Defense Records", "News", "2022-2024 (Classified Documents Indictment)", "Governance & Judiciary", 1,
  "Executing court-authorized search warrant recovering hundreds of classified and top secret documents withheld from the National Archives.",
  "1 = Equal Application of the Rule of Law / No Former President Is Above the Law", "10 = Unprecedented Weaponization of the DOJ and FBI by the Biden Administration Against His Political Opponent", 2, 10, 4, 1, 9, 1);

add(2022, "2022_ketanji_brown_jackson_confirmation", "Ketanji Brown Jackson Confirmation as First Black Female Supreme Court Justice", "News", "2022 (Historic SCOTUS Milestone)", "Governance & Judiciary", 2,
  "Confirming Ketanji Brown Jackson to replace Stephen Breyer, maintaining the liberal minority on the 6-3 conservative court.",
  "1 = Historic Breakthrough for Equal Representation and Judicial Excellence in the Highest Court", "10 = Oppose Soft-on-Crime Judicial Activist Nominated Under Rigid Race- and Gender-Based Criteria", 2, 9, 6, 1, 10, 1);

add(2022, "2022_michigan_prop_3_reproductive_freedom", "Michigan Proposal 3 (Constitutional Right to Reproductive Freedom)", "News", "2022 (Post-Dobbs State Constitutional Protections)", "Civil Rights & Social Issues", 2,
  "Citizen initiative approved by 56.7% of voters adding an explicit right to reproductive freedom and abortion to the Michigan Constitution.",
  "1 = Democratic Model for Securing Bodily Autonomy and Protecting Women and Doctors from Prosecution", "10 = Extreme Constitutional Amendment Nullifying Parental Consent and Late-Term Abortion Limits", 2, 10, 5, 1, 10, 1);

add(2022, "2022_federal_reserve_jumbo_rate_hikes", "Federal Reserve 75-Basis-Point Jumbo Interest Rate Hikes to Fight Inflation", "News", "2022-2024 (Aggressive Monetary Tightening)", "Economy & Taxation", 2,
  "Chairman Powell raising rates at the fastest pace in four decades, pushing 30-year fixed mortgages from 3% to over 7%.",
  "1 = Dangerously Over-Aggressive Rate Hikes Threatening to Trigger a Severe Recession and Crush Workers", "10 = Necessary Harsh Medicine to Tame Runaway Inflation Caused by Excessive Washington Spending", 3, 8, 9, 1, 8, 2);

add(2022, "2022_biden_taiwan_defense_statements", "President Biden Repeated Statements Pledging U.S. Military Defense of Taiwan", "News", "2022-2026 (Strategic Clarity vs Ambiguity)", "Foreign Policy & Defense", 2,
  "President Biden stating four separate times that U.S. forces would defend Taiwan against an unprovoked Chinese military invasion.",
  "1 = Maintain Strategic Ambiguity and One-China Policy to Prevent Unintended Superpower Conflict", "10 = Clear Deterrence Is Essential / Arm Taiwan to the Teeth to Deter Xi Jinping from Invading", 3, 9, 6, 1, 8, 1);

add(2022, "2022_bipartisan_infrastructure_law_iija_rollout", "Infrastructure Investment and Jobs Act ($1.2 Trillion IIJA Rollout)", "News", "2021-2026 (IIJA Implementation)", "Technology & Infrastructure", 2,
  "Federal rollout of historic bipartisan funding for roads, bridges, public transit, clean water pipes, and rural broadband.",
  "1 = Historic Bipartisan Rebuilding of America's Neglected Infrastructure Creating Good Union Jobs", "10 = Wasteful Inflationary Spending Packed with Woke Green Regulations and Red Tape Mandates", 2, 7, 9, 1, 8, 1);

add(2022, "2022_bruen_supreme_court_concealed_carry", "Supreme Court Landmark Concealed Carry Ruling (NYSRPA v. Bruen)", "News", "2022 (Bruen History and Tradition Test)", "Civil Rights & Social Issues", 2,
  "Striking down New York's 108-year-old 'proper cause' concealed carry permit law and mandating a text, history, and tradition test.",
  "1 = Dangerous Extremist Ruling Stripping States of the Right to Protect Citizens from Hidden Firearms", "10 = Landmark Vindication of the Fundamental Second Amendment Right to Carry Arms for Self-Defense", 2, 10, 10, 1, 10, 2);

add(2022, "2022_west_virginia_v_epa_major_questions", "Supreme Court Limiting Agency Regulation (West Virginia v. EPA)", "News", "2022 (Major Questions Doctrine)", "Governance & Judiciary", 2,
  "Formally invoking the Major Questions Doctrine to hold that the EPA lacks statutory authority to shift power generation across grids.",
  "1 = Catastrophic Judicial Power Grab Hobbling Federal Agencies from Protecting the Climate and Public", "10 = Historic Check on the Unaccountable Administrative State Restoring Lawmaking to Congress", 2, 10, 10, 1, 10, 1);

add(2022, "2022_strategic_petroleum_reserve_release", "Historic 180-Million-Barrel Release from Strategic Petroleum Reserve", "News", "2022 (Gas Price Crisis Management)", "Energy & Climate", 2,
  "Biden ordering the largest drawdown in SPR history to lower retail gasoline prices following the Russian invasion of Ukraine.",
  "1 = Necessary Emergency Action That Successfully Lowered Gas Prices by 40 Cents a Gallon", "10 = Reckless Depletion of Critical Emergency Military Reserves to Help Democrats in an Election Year", 2, 10, 8, 1, 9, 1);

add(2022, "2022_florida_parental_rights_education_act", "Florida Parental Rights in Education Act ('Don't Say Gay' Law)", "News", "2022-2024 (Parental Rights Curriculum Battle)", "Civil Rights & Social Issues", 2,
  "Prohibiting classroom instruction on sexual orientation or gender identity in kindergarten through third grade.",
  "1 = Vicious, Discriminatory Attack on LGBTQ Students and Teachers Designed to Stigmatize Families", "10 = Protect Young Elementary Children from Inappropriate Sexualization and Defend Parental Authority", 2, 10, 5, 1, 10, 1);

add(2022, "2022_title_ix_gender_identity_expansion", "Biden Proposed Title IX Rule Extending Protections to Gender Identity", "News", "2022-2024 (Title IX Gender Rule Battle)", "Education", 2,
  "Expanding federal Title IX non-discrimination rules to explicitly protect LGBTQ and transgender students in public schools.",
  "1 = Ensure Every Student Is Free from Bullying and Discrimination Regardless of Gender Identity", "10 = Illegal Erasure of Women's Protected Spaces and Female Athletics to Appease Radical Gender Ideology", 2, 10, 5, 1, 10, 1);

add(2022, "2022_electoral_count_reform_act", "Bipartisan Electoral Count Reform and Presidential Transition Improvement Act", "News", "2022 (ECRA Modernization)", "Governance & Judiciary", 2,
  "Clarifying that the Vice President's role in counting electoral votes is strictly ceremonial and raising objection thresholds to 1/5.",
  "1 = Essential Bipartisan Safeguard Protecting Democratic Succession and Preventing Future Jan 6 Coups", "10 = Support Constitutional Clarification While Rejecting Broader Federal Takeovers of State Elections", 2, 8, 5, 1, 7, 1);

add(2022, "2022_nord_stream_pipeline_sabotage", "Underwater Bombing of Nord Stream 1 & 2 Natural Gas Pipelines in Baltic", "News", "2022 (Critical Infrastructure Sabotage)", "Foreign Policy & Defense", 2,
  "Covert deep-sea demolition attacks severing major natural gas pipelines connecting Russia to Germany.",
  "1 = Unacceptable Act of International Sabotage Threatening Critical Global Energy Infrastructure", "10 = Decisive Strategic Severing of Europe's Dangerous Dependency on Russian Fossil Blackmail", 3, 7, 4, 1, 6, 1);

add(2022, "2022_biden_marijuana_pardons_schedule_review", "Federal Pardons for Simple Marijuana Possession & HHS Scheduling Review", "News", "2022-2024 (Executive Cannabis Actions)", "Civil Rights & Social Issues", 2,
  "President Biden pardoning thousands of citizens with federal simple possession convictions and directing HHS to review Schedule I status.",
  "1 = Historic Federal Progress Toward Ending Cannabis Criminalization / Must Move to Full Legalization", "10 = Political Pander Sending the Wrong Signal Amid Nationwide Surges in Youth Drug Addiction", 2, 8, 1, 1, 9, 1);

add(2022, "2022_baby_formula_tariffs_suspension", "Temporary Tariff Suspension on Imported Foreign Infant Formula", "News", "2022 (Access to Baby Formula Act)", "Trade & Globalism", 3,
  "Suspending high 17.5% tariffs on European infant formula imports to ease catastrophic domestic grocery shortages.",
  "1 = Lower Protectionist Tariffs Permanently to Protect Infant Health and Prevent Monopolies", "10 = Temporary Emergency Measure Only / Rebuild Secure Domestic Infant Nutrition Production", 2, 6, 9, 1, 6, 1);

add(2022, "2022_saudi_opec_two_million_barrel_cut", "OPEC+ Two-Million-Barrel Production Cut & U.S.-Saudi Relations", "News", "2022 (Saudi Energy Showdown)", "Foreign Policy & Defense", 3,
  "Saudi Arabia coordinating with Russia to slash oil production right before midterm elections, defying White House appeals.",
  "1 = Re-evaluate Saudi Strategic Partnership / Halt Weapons Sales and Enact NOPEC Legislation", "10 = End Hostility Toward Domestic Energy Producers So America Doesn't Have to Beg Saudis for Oil", 2, 9, 7, 1, 8, 1);

add(2022, "2022_nevada_question_3_ranked_choice_top_five", "Nevada Question 3 (Top-Five Open Primary & Ranked-Choice Voting Approval)", "News", "2022 (Top-Five Electoral Reform)", "Governance & Judiciary", 3,
  "Voters narrowly passing (53%) first round of constitutional amendment establishing all-party primary with top five advancing to RCV.",
  "1 = Empower Independent Voters and Break the Extremist Primary Grip of Both Political Parties", "10 = Confusing, Costly System Designed to Confuse Voters and Undermine Transparent Vote Tabulation", 2, 7, 1, 1, 1, 1);

add(2022, "2022_maryland_question_4_cannabis_approval", "Maryland Question 4 (Constitutional Amendment Legalizing Cannabis 67%)", "News", "2022 (Mid-Atlantic Adult-Use Legalization)", "Civil Rights & Social Issues", 3,
  "Voters overwhelmingly approving recreational cannabis legalization with 67.2% of the vote, mandating equity expungements.",
  "1 = Overwhelming Democratic Mandate for Cannabis Freedom, Social Equity, and Reinvesting in Black Communities", "10 = Regret Creation of Another Commercial Drug Industry Operating in Violation of Federal Law", 2, 8, 1, 1, 9, 1);

add(2022, "2022_missouri_amendment_3_cannabis_approval", "Missouri Amendment 3 (Voter Legalization of Adult-Use Cannabis 53%)", "News", "2022 (Red State Commercial Cannabis)", "Civil Rights & Social Issues", 3,
  "Voters approving constitutional amendment legalizing adult possession and expunging nonviolent criminal cannabis records.",
  "1 = Bipartisan Proof That Ending Failed Marijuana Prohibition Has Won Over the Heartland", "10 = Oppose Creating Monopoly Licenses for Out-of-State Corporate Drug Conglomerates", 2, 7, 1, 1, 9, 1);

add(2022, "2022_arkansas_issue_4_cannabis_defeat", "Arkansas Issue 4 (Recreational Cannabis Defeat by 56% No)", "News", "2022 (Southern Cannabis Ballot Defeat)", "Civil Rights & Social Issues", 4,
  "Voters rejecting recreational marijuana initiative opposed by conservative groups and progressive medical patients over monopoly licenses.",
  "1 = Defeat Flawed Corporate Monopoly Models to Prepare for Real Grassroots Social Equity Reforms", "10 = Stand Firm for Family Values and Reject Commercial Drug Operations in Arkansas Communities", 2, 8, 2, 1, 9, 1);

add(2022, "2022_california_prop_1_reproductive_freedom", "California Proposition 1 (Constitutional Right to Reproductive Freedom)", "News", "2022 (California Constitutional Supermajority)", "Civil Rights & Social Issues", 3,
  "66.9% of voters approving constitutional amendment explicitly protecting individual reproductive freedom including abortion and contraception.",
  "1 = Permanent Unshakeable Fortress for Reproductive Autonomy and Beacon for Out-of-State Patients", "10 = Extreme Amendment Expanding Late-Term Abortions Up to Birth with Zero Restrictions", 2, 10, 4, 1, 10, 1);

add(2022, "2022_vermont_proposal_5_reproductive_liberty", "Vermont Proposal 5 (Article 22 Constitutional Reproductive Liberty Amendment)", "News", "2022 (First State to Pass Article 22)", "Civil Rights & Social Issues", 3,
  "77% of voters approving Article 22 declaring that personal reproductive liberty is a fundamental right.",
  "1 = Gold Standard for Protecting Personal Healthcare Dignity and Reproductive Self-Determination", "10 = Dangerous Constitutional Mandate Stripping Lawmakers of the Right to Protect Unborn Children", 2, 10, 4, 1, 10, 1);

add(2022, "2022_california_prop_26_27_sports_betting_crushed", "California Propositions 26 & 27 (Sports Betting Initiatives Crushed 82% No)", "News", "2022 (Record $450M Ballot Spend)", "Civil Rights & Social Issues", 3,
  "Voters overwhelmingly crushing competing corporate online sports betting and tribal casino sports betting measures.",
  "1 = Stand with Sovereign Native Tribes to Protect Reservation Economies and Prevent Gambling Addiction", "10 = Voters Rejected Greedy Out-of-State Online Gambling Companies Flooding the Airwaves with Smears", 2, 7, 4, 1, 8, 2);

add(2022, "2022_nancy_pelosi_taipei_visit_taiwan", "Speaker Nancy Pelosi Official Congressional Delegation Visit to Taipei", "News", "2022 (Fourth Taiwan Strait Crisis)", "Foreign Policy & Defense", 2,
  "First Speaker visit to Taiwan in 25 years, triggering unprecedented Chinese military live-fire exercises encircling the island.",
  "1 = Unshakable American Commitment to Stand with Democratic Taiwan Against Authoritarian Threats", "10 = Support Congressional Diplomacy While Warning Administration Must Provide Deterrent Arms to Match Rhetoric", 3, 9, 5, 1, 8, 1);

add(2022, "2022_sec_climate_disclosure_rule_proposed", "SEC Proposed Rule Mandating Corporate Scope 1, 2, and 3 Climate Disclosures", "News", "2022-2024 (SEC Climate Disclosure Arc)", "Energy & Climate", 3,
  "Requiring publicly traded companies to report greenhouse gas emissions and physical climate financial risks.",
  "1 = Vital Market Transparency for Investors Facing Trillions in Climate and Stranded Asset Risks", "10 = Unlawful SEC Mission Creep Turning a Securities Watchdog into an Unaccountable Climate Policeman", 2, 10, 10, 1, 10, 1);

add(2022, "2022_department_of_labor_gig_worker_rule", "Department of Labor Proposed Independent Contractor Classification Rule", "News", "2022-2024 (Gig Worker FLSA Rule)", "Labor & Welfare", 3,
  "Revising FLSA economic reality factors making it easier to classify app gig workers and subcontracted labor as employees.",
  "1 = Protect Vulnerable Workers from Misclassification and Guarantee Minimum Wage and Overtime", "10 = Destroy Independent Contracting and Freelance Flexibility for Millions of American Professionals", 2, 9, 10, 1, 9, 1);

add(2022, "2022_massachusetts_question_1_millionaires_tax", "Massachusetts Question 1 (Fair Share Amendment 4% Surtax on $1M+)", "News", "2022 (State Millionaire Tax Victory)", "Economy & Taxation", 3,
  "Constitutional amendment approved by 52% of voters levying a 4% surtax on annual income exceeding $1M for schools and transit.",
  "1 = Landmark Victory Taxing the Super-Wealthy to Invest Directly in Public Schools, Roads, and Bridges", "10 = Dangerous Tax Hike That Will Drive High-Earning Innovators, Physicians, and Capital to Florida and NH", 2, 9, 10, 1, 9, 1);

add(2022, "2022_disney_reedy_creek_district_dissolution", "Florida Dissolution of Walt Disney World's Reedy Creek Improvement District", "News", "2022-2024 (Disney Free Speech War)", "Governance & Judiciary", 2,
  "Governor DeSantis and legislature revoking Disney's 55-year-old self-governing district after company opposed parental rights bill.",
  "1 = Blatant, Unconstitutional Retaliation Violating First Amendment Rights to Political Speech", "10 = End Unfair Corporate Special Privileges for a Woke Multinational Corporation Meddling in Schools", 2, 10, 4, 1, 10, 1);

add(2022, "2022_ftc_lina_khan_aggressive_antitrust", "FTC Chair Lina Khan Aggressive Anti-Monopoly Enforcement Campaign", "News", "2021-2026 (Neo-Brandeisian Antitrust Arc)", "Economy & Taxation", 3,
  "Filing lawsuits blocking mergers in high-tech (Meta/Within), defense, and pharma under revised non-consumer-welfare doctrine.",
  "1 = Revitalize Historic Anti-Monopoly Enforcement to Break Up Concentrated Corporate Hegemony", "10 = Reckless Ideological Hostility to Mergers That Harms Efficiency and Punishes American Innovation", 2, 8, 9, 1, 7, 1);

add(2022, "2022_postal_service_reform_act_enacted", "Enactment of Bipartisan Postal Service Reform Act of 2022", "News", "2022 (USPS Debt Relief)", "Governance & Judiciary", 3,
  "Repealing the 2006 PAEA 75-year retiree health pre-funding mandate and saving the Postal Service $50 billion over 10 years.",
  "1 = Bipartisan Triumph Securing the Long-Term Solvency of America's Most Trusted Public Institution", "10 = Support Fiscally Sound Relief While Requiring Rigorous Transparency and 6-Day Delivery Efficiency", 2, 7, 7, 1, 7, 1);

add(2022, "2022_california_fast_recovery_act_ab_257", "California FAST Recovery Act (Fast Food Sectoral Wage Council)", "News", "2022-2023 (Fast Food Sectoral Bargaining)", "Labor & Welfare", 3,
  "Landmark law creating a state appointed council empowered to set binding industry-wide minimum wages up to $22/hr.",
  "1 = Transformative Sectoral Bargaining Giving Fast-Food Workers a Real Voice Against Giant Chains", "10 = Unprecedented Bureaucratic Price-Setting That Will Destroy Thousands of Franchise Small Businesses", 2, 9, 10, 1, 9, 1);

add(2022, "2022_social_security_cost_of_living_adjustment_8_7", "Social Security 8.7% Cost-of-Living Adjustment (Highest in 41 Years)", "News", "2022 (Inflation COLA Shock)", "Labor & Welfare", 3,
  "Social Security Administration announcing an 8.7% benefit increase for 70 million Americans to match galloping inflation.",
  "1 = Vital Protection Shielding Fixed-Income Seniors from Inflation / Expand Benefits by Taxing High Earners", "10 = Highlight Accelerating Trust Fund Depletion / Enact Entitlement Reforms to Avert Bankruptcy by 2033", 2, 8, 8, 1, 8, 1);

add(2022, "2022_biden_advanced_chip_export_controls_china", "Sweeping Export Controls Banning Advanced AI Chips and Tooling to China", "News", "2022-2026 (Semiconductor Blockade)", "Technology & Infrastructure", 2,
  "Imposing comprehensive unilateral export restrictions barring any company using U.S. technology from selling advanced AI chips to Beijing.",
  "1 = Decisive Action to Protect U.S. National Security and Maintain Generational Lead in Artificial Intelligence", "10 = Aggressive Action Against China / Expand Controls to Ensure Allied Compliance in Japan and Netherlands", 2, 8, 6, 1, 8, 1);

add(2022, "2022_illinois_workers_rights_amendment", "Illinois Amendment 1 (Constitutional Right to Collective Bargaining)", "News", "2022 (State Constitutional Union Shield)", "Labor & Welfare", 3,
  "Constitutional initiative approved by 58.7% of voters guaranteeing fundamental right to unionize and permanently banning Right-to-Work laws.",
  "1 = Historic Victory Enshrining Union Collective Bargaining Directly into the State Constitution", "10 = Cementing Public Union Monopoly Power That Inflates State Property Taxes and Mandates Deficits", 2, 8, 10, 1, 8, 1);

add(2022, "2022_new_mexico_constitutional_early_childhood", "New Mexico Constitutional Amendment 1 (Permanent Early Childhood Trust Fund)", "News", "2022 (Land Grant Early Childhood)", "Education", 3,
  "Approving (70% Yes) dedication of 1.25% of the state's permanent land grant endowment to fund universal pre-K and childcare.",
  "1 = Visionary Public Investment Ensuring Universal Free Pre-K and Transforming Children's Lives", "10 = Protect Permanent School Endowments from Excessive Depletion to Shield Future Generations", 2, 7, 8, 1, 7, 1);

add(2022, "2022_south_dakota_amendment_d_medicaid", "South Dakota Constitutional Amendment D (Voter Medicaid Expansion)", "News", "2022 (Red State Medicaid Breakthrough)", "Healthcare", 3,
  "Voters bypassing GOP state legislature (56% Yes) to expand Medicaid coverage under the ACA to 52,000 low-income residents.",
  "1 = Voter Triumph Expanding Life-Saving Healthcare and Bringing Hundreds of Millions in Federal Funds", "10 = Costly Expansion That Expands Welfare Dependency and Strains Future State General Fund Budgets", 2, 9, 9, 1, 9, 1);

add(2022, "2022_rail_labor_strike_threat_congressional_block", "Threatened National Freight Rail Strike & Congressional Intervention", "News", "2022 (Railway Labor Act Intervention)", "Labor & Welfare", 2,
  "Congress passing emergency legislation imposing a tentative labor agreement without paid sick leave to prevent an economic rail shutdown.",
  "1 = Unacceptable Betrayal of Rail Workers Fighting for Basic Paid Sick Leave Against Greedy Rail Barons", "10 = Necessary Decisive Bipartisan Action to Avert a $2 Billion-a-Day Economic Catastrophe", 4, 8, 7, 1, 7, 1);

add(2022, "2022_cuba_re_designation_state_sponsor_terror", "Maintaining Cuba on the State Department State Sponsor of Terrorism List", "News", "2021-2026 (SSOT Designation Controversy)", "Foreign Policy & Defense", 4,
  "Biden administration keeping Cuba on the terror list, blocking international banking transactions and European tourism.",
  "1 = Rescind Unjust, Politically Motivated Designation That Imposes Inhumane Economic Suffering on Cubans", "10 = Keep Cuba on the Terror List for Harboring Terrorists and Aiding Repressive Regimes in Venezuela", 2, 9, 2, 1, 9, 1);

add(2022, "2022_dc_circuit_standing_on_student_debt", "Eighth Circuit Emergency Injunction Halting Student Debt Forgiveness", "News", "2022 (HEROES Act Judicial Freeze)", "Governance & Judiciary", 2,
  "Federal appeals court issuing nationwide injunction blocking debt cancellation following lawsuit by six Republican state AGs.",
  "1 = Partisan Judicial Overreach Denying Critical Economic Relief to Millions of Deserving Borrowers", "10 = Uphold Injunction / The President Has No Statutory or Constitutional Power to Forgive $400B Unilaterally", 2, 10, 10, 1, 10, 1);

add(2022, "2022_arizona_proposition_132_supermajority_taxes", "Arizona Proposition 132 (60% Supermajority for Voter Tax Hikes)", "News", "2022 (Direct Democracy Supermajority Rule)", "Economy & Taxation", 4,
  "Constitutional initiative approved by 50.7% of voters requiring 60% approval for any future ballot measures that raise taxes.",
  "1 = Anti-Democratic Obstacle Designed by Wealthy Special Interests to Block Funding for Schools", "10 = Protect Hardworking Taxpayers from Narrow 50.1% Special Interest Plundering of the Tax Code", 2, 8, 10, 1, 9, 1);

add(2022, "2022_colorado_prop_122_psychedelic_legalization", "Colorado Proposition 122 (Natural Medicine Health Act)", "News", "2022 (Statewide Plant Psychedelics Approval)", "Civil Rights & Social Issues", 3,
  "Voters approving (53.6%) decriminalization and state-licensed therapeutic healing centers for psilocybin, DMT, and mescaline.",
  "1 = Landmark Move Toward Science-Based Healing for Depression, Addiction, and Mental Illness", "10 = Oppose Commercializing Hallucinogens That Compromise Public Safety and Youth Health", 2, 8, 1, 1, 9, 1);

console.log('Bracket 3 total issues (2016, 2018, 2020, 2022):', ISSUES.length);

module.exports = ISSUES;
