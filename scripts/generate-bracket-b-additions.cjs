/**
 * scripts/generate-bracket-b-additions.cjs
 * Appends 1970, 1972, and 1974 issues to scripts/build-issues-1968-1974.cjs
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build-issues-1968-1974.cjs');
let content = fs.readFileSync(filePath, 'utf8');

// Strip old trailing console.log / module.exports if present
content = content.replace(/console\.log\('1968 complete:'.*?\n*/g, '');
content = content.replace(/module\.exports\s*=\s*ISSUES;\s*$/g, '');

const additions = `
// =========================================================================
// 1970 (50 Issues)
// =========================================================================
add(1970, "1970_cambodian_incursion_kent_state", "U.S. Cambodian Incursion & Kent State Shootings", "News", "1970 (Cambodia Crisis & Campus Protests)", "Foreign Policy & Defense", 1,
  "U.S. military cross-border operation into Cambodia to destroy communist sanctuaries, triggering massive national student strikes and the killing of 4 students at Kent State by Ohio National Guardsmen.",
  "1 = Unconstitutional Expansion of an Immoral War / Condemn National Guard Killings of Protesting Students", "10 = Decisive Military Action to Protect American Troops / Condemn Violent Campus Radicals and Rioters", 2, 9, 3, 1, 9, 1);

add(1970, "1970_first_earth_day_movement", "Inaugural Earth Day Mobilization (20 Million Americans)", "News", "1970 (First Earth Day Mobilization)", "Energy & Climate", 1,
  "Twenty million Americans demonstrating nationwide in peaceful teach-ins and rallies demanding government action against industrial air and water pollution.",
  "1 = Transformative Grassroots Awakening Demanding Aggressive Federal Environmental Regulations Against Corporate Polluters", "10 = Celebrate Conservation While Guarding Against Radical Anti-Growth Environmental Zealotry That Harms Jobs", 2, 8, 7, 1, 8, 1);

add(1970, "1970_clean_air_act_of_1970_passage", "Enactment of the Clean Air Act of 1970 (Muskie Bill)", "News", "1970 (Clean Air Act Landmark)", "Energy & Climate", 1,
  "Bipartisan legislation mandating 90% reduction in automotive emissions by 1975 and creating National Ambient Air Quality Standards enforced by the newly created EPA.",
  "1 = Landmark Federal Mandate Placing Public Health and Clean Air Over Corporate Automotive Profit Margins", "10 = Unrealistic Deadlines and Rigid Federal Command-and-Control Rules That Threaten Auto Manufacturing Viability", 2, 8, 8, 1, 8, 1);

add(1970, "1970_epa_creation_reorganization_plan_3", "Creation of the Environmental Protection Agency (Reorganization Plan No. 3)", "News", "1970 (EPA Founding)", "Energy & Climate", 1,
  "Executive order by President Nixon consolidating 15 disparate federal environmental programs into an independent executive agency.",
  "1 = Essential Unified Federal Agency Empowered to Enforce Strict Pollution Standards Across the Entire Economy", "10 = Unaccountable Executive Super-Bureaucracy That Imposes Crushing Red Tape on American Industry and Energy", 2, 8, 8, 1, 9, 1);

add(1970, "1970_occupational_safety_health_act_osha", "Enactment of the Occupational Safety and Health Act of 1970 (OSHA)", "News", "1970 (OSHA Enactment)", "Labor & Welfare", 1,
  "Federal statute establishing mandatory nationwide workplace safety standards and inspector enforcement to reduce industrial injuries and deaths.",
  "1 = Historic Triumph for Working Americans Ensuring Safe Jobs Free from Deadly Toxic Exposures and Hazards", "10 = Overbearing Bureaucratic Harassment of Small Businesses by Inexperienced Federal Workplace Inspectors", 2, 8, 9, 1, 9, 1);

add(1970, "1970_great_postal_strike_of_1970", "Great Postal Strike of 1970 & Deployment of U.S. Troops to Sort Mail", "News", "1970 (Great Postal Strike)", "Labor & Welfare", 1,
  "Wildcat strike by 200,000 postal workers over poverty wages, paralyzing commerce and prompting Nixon to deploy National Guard and military troops to New York post offices.",
  "1 = Legitimate Working-Class Uprising Against Poverty Wages and Patronage Neglect / Grant Full Public Bargaining Rights", "10 = Illegal Walkout by Federal Workers Threatening National Commerce / Enforce Rule of Law and Ban Public Strikes", 2, 9, 9, 1, 9, 1);

add(1970, "1970_postal_reorganization_act_usps_creation", "Postal Reorganization Act of 1970 (Abolishing Post Office Dept / Creating USPS)", "News", "1970 (USPS Semi-Independent Transition)", "Governance & Judiciary", 2,
  "Abolishing the 180-year-old Cabinet-level Post Office Department and replacing it with the semi-independent, self-financing U.S. Postal Service with collective bargaining.",
  "1 = Progressive Modernization Ending Patronage Politics While Protecting Civil Service Wages and Mail Delivery", "10 = First Step Toward Fully Privatizing Inefficient Government Mail Monopolies and Opening Routes to Free Enterprise", 3, 7, 9, 2, 8, 2);

add(1970, "1970_controlled_substances_act_scheduling", "Comprehensive Drug Abuse Prevention and Control Act of 1970 (Controlled Substances Act)", "News", "1970 (Drug Scheduling System)", "Civil Rights & Social Issues", 1,
  "Establishing federal drug schedules (I through V) categorizing narcotics and marijuana based on medical value and abuse potential, launching federal War on Drugs.",
  "1 = Unscientific Criminalization of Marijuana and Addiction / Shift Focus to Public Health Treatment and Decriminalization", "10 = Tough Comprehensive Federal Weapons Against Dangerous Narcotics and Youth Drug Culture Corrupting the Nation", 2, 9, 10, 1, 10, 1);

add(1970, "1970_voting_rights_act_amendments_18_year_old", "Voting Rights Act Amendments of 1970 (Lowering Voting Age to 18 & Literacy Ban)", "News", "1970 (18-Year-Old Voting Statute)", "Governance & Judiciary", 1,
  "Federal statute lowering the voting age to 18 nationwide and imposing a nationwide permanent ban on discriminatory literacy tests.",
  "1 = Basic Democratic Justice: If Young Americans Are Old Enough to Be Drafted and Die, They Are Old Enough to Vote", "10 = Unconstitutional Congressional Infringement on State Sovereignty to Set Voter Qualifications (Demand Constitutional Amendment)", 2, 8, 4, 1, 9, 1);

add(1970, "1970_carswell_haynsworth_nominations_defeated", "Senate Rejection of Clement Haynsworth and G. Harrold Carswell to Supreme Court", "News", "1969-1970 (Southern Supreme Court Defeats)", "Governance & Judiciary", 2,
  "Bipartisan Senate majority rejecting Nixon's southern conservative nominees due to civil rights opposition and judicial mediocrity, prompting Nixon to nominate Harry Blackmun.",
  "1 = Principled Defense of Supreme Court Integrity Against Segregationist Sympathies and Unqualified Appointees", "10 = Vindictive Northern Liberal Slander Against Respected Southern Jurists Denying the President His Legitimate Appointments", 2, 9, 5, 1, 9, 1);

add(1970, "1970_organized_crime_control_act_rico", "Organized Crime Control Act of 1970 & Enactment of RICO Statute", "News", "1970 (RICO Enactment)", "Governance & Judiciary", 1,
  "Creating the Racketeer Influenced and Corrupt Organizations (RICO) Act allowing prosecution of entire criminal enterprises, special grand juries, and witness protection.",
  "1 = Guard Against Vague Enterprise Definitions and Civil Asset Seizures That Trample Due Process and Civil Liberties", "10 = Vital, Decisive Federal Weapon to Infiltrate, Prosecute, and Demolish the Mafia and Organized Crime Syndicates", 3, 9, 8, 2, 8, 2);

add(1970, "1970_public_health_cigarette_smoking_act", "Public Health Cigarette Smoking Act of 1970 (Banning Broadcast Cigarette Ads)", "News", "1970 (Broadcast Cigarette Ad Ban)", "Healthcare", 2,
  "Signing legislation prohibiting cigarette advertising on American television and radio airwaves, effective January 1, 1971, and strengthening Surgeon General warnings.",
  "1 = Essential Public Health Regulation Halting Corporate Tobacco Addiction Targeting Children and Families on Airwaves", "10 = Infringement on Commercial Free Speech Advertising a Legal Product / Undermines Free Broadcast Television Revenues", 2, 8, 9, 1, 8, 1);

add(1970, "1970_bank_secrecy_act_financial_records", "Bank Secrecy Act of 1970 (Currency Transaction Reporting & Foreign Accounts)", "News", "1970 (Bank Secrecy Enacted)", "Economy & Taxation", 2,
  "Requiring financial institutions to report cash transactions over $10,000 and retain customer records to combat money laundering and offshore tax havens.",
  "1 = Necessary Transparency Closing Secret Swiss Bank Havens and Stripping Ill-Gotten Mob and Corporate Tax Evader Profits", "10 = Unwarranted Financial Surveillance Violating Fourth Amendment Privacy of Innocent American Depositors", 2, 8, 10, 1, 9, 1);

add(1970, "1970_hard_hat_riots_lower_manhattan", "Hard Hat Riots in Lower Manhattan & Polarization over War and Counterculture", "News", "1970 (Hard Hat Riots)", "Governance & Judiciary", 1,
  "Hundreds of construction workers attacking student anti-war protesters near Wall Street while chanting 'USA All the Way', symbolizing blue-collar realignment.",
  "1 = Outrageous Violent Thuggery by Mob Elements Encouraged by City Police / Defend Free Speech of Anti-War Youth", "10 = Patriotic Working Men Standing Up for America and the Flag Against Privileged Draft-Dodging radicals Desecrating the Nation", 2, 10, 5, 1, 10, 1);

add(1970, "1970_nixon_family_assistance_plan_fap", "Nixon's Family Assistance Plan (FAP) / Guaranteed Annual Income Proposal", "News", "1969-1971 (FAP Welfare Reform)", "Labor & Welfare", 2,
  "White House proposal to scrap AFDC welfare and provide a federally guaranteed minimum income of $1,600 to all poor families with work requirements.",
  "1 = Replace Inadequate, Humiliating Welfare with a Universal Economic Floor and Direct Cash Support for Poor Families", "10 = Dangerous Expansion of the Welfare State Creating a Dependency Trap and Discouraging Hard Work", 4, 7, 8, 2, 9, 2);

add(1970, "1970_equal_rights_amendment_house_passage", "House Approval of Equal Rights Amendment (350-15 Vote)", "News", "1970-1972 (ERA Legislative Apex)", "Civil Rights & Social Issues", 1,
  "House of Representatives voting overwhelmingly (led by Martha Griffiths) to approve the Equal Rights Amendment guaranteeing equal constitutional rights regardless of sex.",
  "1 = Long-Overdue Constitutional Guarantee of Full Legal and Economic Equality for American Women", "10 = Unnecessary Amendment Threatening Female Protective Labor Laws, Family Structure, and Exposing Women to the Military Draft", 2, 8, 4, 1, 10, 1);

add(1970, "1970_rail_passenger_service_act_amtrak", "Rail Passenger Service Act of 1970 (Creation of Amtrak)", "News", "1970 (Amtrak Creation)", "Technology & Infrastructure", 2,
  "Relieving bankrupt private railroads of passenger train obligations and creating the National Railroad Passenger Corporation (Amtrak) with federal subsidies.",
  "1 = Vital National Investment Preserving Environmentally Friendly Intercity Rail Passenger Travel", "10 = Wasteful Government Bailout Subsidizing Dying, Inefficient Passenger Train Routes That Cannot Compete with Air and Highways", 2, 8, 9, 1, 9, 1);

add(1970, "1970_national_environmental_policy_act_eis", "Implementation of National Environmental Policy Act (NEPA) & Environmental Impact Statements", "News", "1970 (NEPA EIS Implementation)", "Energy & Climate", 1,
  "Executive agencies issuing first mandatory Environmental Impact Statements (EIS) evaluating major federal highways, dams, and infrastructure projects.",
  "1 = Foundational Environmental Safeguard Forcing Federal Bureaucracies to Reckon with Ecological Destruction Before Building", "10 = Endless Procedural Red Tape and Judicial Injunctions Paralyzing Critical Infrastructure, Energy, and Timber Projects", 2, 8, 8, 1, 9, 1);

add(1970, "1970_economic_stabilization_act_wage_price_standby", "Economic Stabilization Act of 1970 (Democratic Standby Price Control Powers)", "News", "1970 (Standby Wage-Price Authority)", "Economy & Taxation", 2,
  "Democratic Congress granting Nixon temporary authority to freeze wages, prices, and rents to curb 6% inflation, daring the Republican president to use it.",
  "1 = Essential Tool to Protect Working Consumers from Corporate Price Gouging and Spiraling Inflation", "10 = Disastrous Socialist Mechanism Inevitably Producing Scarcity, Black Markets, and Economic Distortions", 3, 7, 10, 1, 9, 2);

add(1970, "1970_vietnamization_drawdown_doctrine", "Nixon's Vietnamization Policy & Drawdown of 150,000 U.S. Combat Troops", "News", "1969-1972 (Vietnamization Drawdown)", "Foreign Policy & Defense", 1,
  "Gradually transferring combat responsibility to South Vietnamese armed forces while withdrawing American ground soldiers and ramping up air support.",
  "1 = Cynical War-Prolonging Tactic Merely 'Changing the Color of the Corpses' / Total Immediate Withdrawal Now", "10 = Measured, Honorable Strategy Enabling South Vietnam to Defend Its Own Freedom While Bringing Our Boys Home", 3, 9, 4, 1, 8, 1);

add(1970, "1970_chicano_moratorium_ruben_salazar_slaying", "National Chicano Moratorium March & Killing of Journalist Ruben Salazar", "News", "1970 (Chicano Moratorium)", "Civil Rights & Social Issues", 2,
  "Thirty thousand Mexican-Americans marching against disproportionate Latino casualties in Vietnam; sheriffs teargas rally, and reporter Ruben Salazar is killed by tear-gas projectile.",
  "1 = Demand Justice for Ruben Salazar and End the Disproportionate Drafting and Sacrificing of Mexican-American Youths", "10 = Back Law Enforcement Quelling Rioting and Looting / Prevent Radical Infiltration of Hispanic Communities", 2, 9, 3, 1, 9, 1);

add(1970, "1970_emergency_home_finance_act_freddie_mac", "Emergency Home Finance Act of 1970 (Creation of Freddie Mac)", "News", "1970 (Freddie Mac Founding)", "Economy & Taxation", 3,
  "Creating the Federal Home Loan Mortgage Corporation (Freddie Mac) to securitize conventional mortgages and expand suburban homeownership liquidity.",
  "1 = Expand Capital Availability Enabling Everyday Middle-Class Families to Secure Affordable Home Mortgages", "10 = Government-Sponsored Enterprise Privatizing Profits While Socializing Massive Housing Credit Risks to Taxpayers", 3, 7, 8, 2, 8, 2);

add(1970, "1970_family_planning_services_act_title_x", "Family Planning Services and Population Research Act of 1970 (Title X)", "News", "1970 (Title X Family Planning)", "Healthcare", 2,
  "Bipartisan legislation signed by Nixon providing comprehensive federal grants for voluntary family planning, birth control, and preventive healthcare for low-income women.",
  "1 = Compassionate Public Health Funding Enabling Low-Income Families to Voluntarily Plan Their Children and Prevent Poverty", "10 = Federal Subsidies for Contraception Undermining Traditional Family Morality and Opening Door to Abortion Referral", 2, 7, 7, 1, 9, 1);

add(1970, "1970_nixon_philadelphia_plan_affirmative_action", "Nixon Administration Implementation of the Philadelphia Plan (Affirmative Action Quotas)", "News", "1969-1971 (Philadelphia Plan Contestation)", "Civil Rights & Social Issues", 1,
  "Labor Secretary George Shultz requiring federal construction contractors in Philadelphia to hire targeted percentages of minority tradesmen, driving wedges in labor unions.",
  "1 = Concrete Enforcement Breaking Decades of Exclusionary White Union Racism in the High-Paying Skilled Construction Trades", "10 = Unconstitutional Racial Quotas Violating Individual Merit and the Civil Rights Act's Colorblind Intent", 3, 7, 7, 1, 9, 1);

add(1970, "1970_lead_based_paint_poisoning_prevention_act", "Lead-Based Paint Poisoning Prevention Act of 1970", "News", "1970 (Lead Paint Regulation)", "Healthcare", 2,
  "Prohibiting lead-based paint on interior surfaces of federally assisted housing and providing grants to detect childhood lead toxicity.",
  "1 = Vital Health Protection Eliminating Severe Brain Damage and Developmental Delays in Inner-City Children", "10 = Support Sensible Lead Poisoning Prevention While Avoiding Punitive Mandates on Private Landlords", 2, 7, 6, 1, 7, 1);

add(1970, "1970_black_panther_trials_cointelpro_fbi", "Black Panther Party Prosecutions & FBI COINTELPRO Disruption Operations", "News", "1969-1971 (Black Panther Legal Clashes)", "Civil Rights & Social Issues", 2,
  "High-profile murder trials of Bobby Seale and Black Panther leaders amidst covert FBI disinformation and agent provocateur operations.",
  "1 = Condemn Covert FBI Police-State Tactics and Framing of Militant Black Civil Rights Organizers", "10 = Vigorously Prosecute Violent Communist Insurgents Preaching Armed Guerrilla War and Ambushing Police Officers", 2, 9, 2, 1, 9, 1);

add(1970, "1970_swann_charlotte_mecklenburg_busing_case", "Swann v. Charlotte-Mecklenburg Board of Education (School Busing Mandate)", "News", "1970-1971 (Swann Busing Ruling)", "Education", 1,
  "Federal courts ordering cross-town busing of thousands of public school children to achieve racial integration in segregated school districts.",
  "1 = Unavoidable Necessary Remedy to Dismantle Decades of Entrenched De Jure Racial Apartheid in Public Schools", "10 = Forcible Busing Trampling Neighborhood Schools, Forcing Innocent Children into Long Commutes, and Sparking White Flight", 2, 9, 8, 1, 10, 1);

add(1970, "1970_united_farm_workers_delano_grape_victory", "United Farm Workers Table Grape Strike Victory & Union Contracts", "News", "1970 (Delano Grape Strike Victory)", "Labor & Welfare", 2,
  "Five-year strike and international boycott led by Cesar Chavez and Dolores Huerta forcing major California table grape growers to sign first union contracts.",
  "1 = Historic Moral Victory for Exploited Migrant Farmworkers Securing Fair Wages, Dignity, and Field Restrooms", "10 = Coercive Secondary Boycotts Undermining Agricultural Freedom and Inflating Everyday Food Costs for American Families", 2, 9, 8, 1, 8, 1);

add(1970, "1970_urban_mass_transportation_act_1970", "Urban Mass Transportation Assistance Act of 1970 ($3.1B for Subways and Buses)", "News", "1970 (Mass Transit Capital Grants)", "Technology & Infrastructure", 2,
  "First multi-year federal commitment of $3.1 billion in capital matching grants to build and modernize city rail transit and municipal bus fleets.",
  "1 = Essential Modern Investment Reducing Highway Gridlock, Smog, and Revitalizing Dense Downtown Cores", "10 = Massive Federal Subsidies for Ailing Big-City Transit Systems That Should Be Financed by Local Fares and Taxes", 2, 8, 8, 1, 8, 1);

add(1970, "1970_federal_coal_mine_health_safety_black_lung", "Enforcement of Federal Coal Mine Health and Safety Act & Black Lung Benefits", "News", "1969-1971 (Black Lung Program Rollout)", "Labor & Welfare", 2,
  "Establishing strict underground coal dust limits and providing federally funded disability benefits to coal miners disabled by black lung disease.",
  "1 = Moral Reparation to Generations of Brave Appalachian Miners Whose Lungs Were Destroyed Powering America's Industrial Might", "10 = Support Proven Work-Related Claims While Tightening Eligibility to Prevent Exploitation of the Black Lung Trust Fund", 2, 7, 7, 1, 8, 1);

add(1970, "1970_horse_protection_act_of_1970", "Enactment of the Horse Protection Act of 1970 (Banning Soring Practices)", "News", "1970 (Horse Protection Enacted)", "Agriculture & Food", 4,
  "Banning the cruel practice of 'soring' (deliberate burning or irritating horses' hooves to produce exaggerated gaits) in Tennessee Walking Horses.",
  "1 = Compassionate Animal Welfare Statute Criminalizing Inhumane Cruelty in Commercial Horse Shows", "10 = Rely on Breed Association Self-Regulation Rather Than Creating New Federal Equestrian Show Inspections", 2, 7, 6, 1, 7, 1);

add(1970, "1970_poison_prevention_packaging_act", "Poison Prevention Packaging Act of 1970 (Child-Resistant Bottle Caps)", "News", "1970 (Child-Resistant Packaging)", "Healthcare", 3,
  "Mandating child-resistant safety caps on household medications and toxic chemical cleansers to prevent accidental toddler poisonings.",
  "1 = Inexpensive, Life-Saving Regulation Preventing Thousands of Tragic Childhood Poisonings and Hospitalizations", "10 = Good Common-Sense Measure, Provided Exemption Caps Are Available for Elderly and Disabled Arthritis Sufferers", 2, 6, 5, 1, 6, 1);

add(1970, "1970_geothermal_steam_act_of_1970", "Enactment of the Geothermal Steam Act of 1970 (Public Land Leasing)", "News", "1970 (Geothermal Leasing Enacted)", "Energy & Climate", 3,
  "Authorizing the Secretary of the Interior to issue leases on public lands for the commercial development and extraction of geothermal steam.",
  "1 = Pioneer Clean, Renewable Baseload Geothermal Energy to Transition Beyond Fossil Fuel Dependance", "10 = Unleash Private Energy Capital to Develop Geothermal Power Free from Punitive Royalties and Environmental Lawsuits", 3, 7, 8, 1, 8, 1);

add(1970, "1970_securities_investor_protection_act_sipc", "Securities Investor Protection Act of 1970 (Creation of SIPC)", "News", "1970 (SIPC Enacted)", "Economy & Taxation", 3,
  "Creating the Securities Investor Protection Corporation (SIPC) to insure individual brokerage customer accounts against member firm insolvencies.",
  "1 = Essential Regulatory Safety Net Preserving Everyday Main Street Investor Confidence in Wall Street Capital Markets", "10 = Government Guarantee Insulating Brokerages from Risk While Placing Taxpayers on the Hook for Wall Street Mismanagement", 2, 7, 8, 2, 8, 2);

add(1970, "1970_agricultural_act_of_1970_set_asides", "Agricultural Act of 1970 (Voluntary Set-Aside Acreage & Payment Caps)", "News", "1970 (1970 Farm Bill Enactment)", "Agriculture & Food", 3,
  "Establishing a market-oriented acreage set-aside system and imposing the first $55,000 annual payment limit per crop per producer.",
  "1 = Enforce Real Payment Caps on Wealthy Corporate Agribusiness While Supporting Struggling Small Family Farms", "10 = Move American Agriculture Toward Free-Market Global Competitiveness and Gradually Eliminate Subsidies", 3, 7, 9, 2, 8, 1);

add(1970, "1970_washington_dc_delegate_act", "District of Columbia Delegate Act of 1970", "News", "1970 (DC Delegate Restored)", "Governance & Judiciary", 2,
  "Restoring a non-voting delegate to represent the District of Columbia in the House of Representatives after nearly a century.",
  "1 = First Step Toward Full D.C. Statehood, Voting Representation, and Ending Taxation Without Representation for 750,000 Citizens", "10 = DC Is a Federal District Under Constitutional Control of Congress / Oppose Progressive Schemes for DC Statehood", 2, 9, 4, 1, 9, 1);

add(1970, "1970_apollo_13_safe_recovery", "Apollo 13 Oxygen Tank Explosion & Safe Astronaut Recovery", "News", "1970 (Apollo 13 Mission)", "Technology & Infrastructure", 2,
  "Successful emergency recovery of three astronauts following a catastrophic service module explosion en route to the Moon.",
  "1 = Inspiring Triumph of Scientific Teamwork and Engineering Ingenuity Under Extreme Life-and-Death Pressure", "10 = Reaffirm Full National Commitment to Manned Space Exploration as a Vital Cold War Demonstration of American Greatness", 2, 7, 6, 2, 7, 1);

add(1970, "1970_boeing_sst_senate_funding_halt", "Senate Vote Halting Federal Subsidies for the Boeing Supersonic Transport (SST)", "News", "1970-1971 (SST Cancellation Arc)", "Technology & Infrastructure", 2,
  "Senate voting 52-41 (led by William Proxmire) to cut off federal prototype development funds for the Boeing supersonic airliner due to sonic booms and stratospheric ozone depletion.",
  "1 = Prudent Fiscal and Environmental Stewardship Refusing to Waste Billions on a Rich Man's Noisy Jet", "10 = Catastrophic Blow to American Aerospace Leadership Handing the Supersonic Era to British-French Concorde and the Soviets", 2, 8, 8, 1, 8, 1);

add(1970, "1970_cooper_church_amendment_cambodia", "Cooper-Church Amendment Barring U.S. Troops in Cambodia", "News", "1970 (Cooper-Church War Powers)", "Foreign Policy & Defense", 1,
  "Bipartisan Senate measure prohibiting the retention of U.S. ground troops, advisors, or combat air support in Cambodia without congressional consent.",
  "1 = Essential Reassertion of Congressional Constitutional War Powers Limiting Unilateral Presidential Imperial War-Making", "10 = Dangerous Congressional Meddling Tying the Hands of the Commander-in-Chief in the Middle of Armed Combat", 2, 9, 4, 1, 9, 1);

add(1970, "1970_oregon_v_mitchell_voting_age_ruling", "Oregon v. Mitchell Supreme Court Ruling (18-Year-Old Vote Split)", "News", "1970 (Oregon v. Mitchell Decision)", "Governance & Judiciary", 2,
  "Supreme Court ruling that Congress had the power to lower the voting age to 18 in federal elections, but not in state and local elections.",
  "1 = Pass a Constitutional Amendment Immediately to Prevent Chaos and Dual Voting Systems in Every Polling Place", "10 = Vindication of Tenth Amendment Principles Affirming States Alone Possess Authority Over State Voting Qualifications", 2, 8, 4, 1, 9, 1);

add(1970, "1970_egg_products_inspection_act", "Enactment of the Egg Products Inspection Act of 1970", "News", "1970 (Egg Inspection Mandate)", "Agriculture & Food", 4,
  "Requiring continuous USDA inspection of all commercial egg breaking plants to prevent salmonella outbreaks and unwholesome eggs.",
  "1 = Safeguard American Breakfast Tables and Commercial Bakeries from Dangerous Foodborne Salmonella Poisoning", "10 = Support Clean Agricultural Production Without Subjecting Small Family Egg Farms to Excessive Federal Inspections", 2, 7, 7, 1, 7, 1);

add(1970, "1970_massachusetts_no_fault_auto_insurance", "Massachusetts Enactment of First-in-Nation No-Fault Auto Insurance", "News", "1970 (No-Fault Insurance Wave)", "Economy & Taxation", 3,
  "Massachusetts enacting the nation's first no-fault automobile insurance statute requiring insurers to pay medical claims regardless of who caused the accident.",
  "1 = Slash Wasteful Trial Lawyer Litigation Costs and Provide Rapid, Guaranteed Medical Reimbursement to Crash Victims", "10 = Deprives Injured Citizens of Their Day in Court and Right to Sue Negligent Drivers for Pain and Suffering", 3, 7, 6, 2, 7, 1);

add(1970, "1970_ddt_cancellation_epa_administrative_hearings", "EPA Commencing Formal Administrative Cancellation Hearings on DDT", "News", "1970-1972 (DDT Cancellation Proceedings)", "Energy & Climate", 2,
  "Newly formed EPA initiating formal proceedings to cancel registrations of the pesticide DDT following Rachel Carson's warnings of bird eggshell thinning.",
  "1 = Ban Toxic DDT to Prevent the Extinction of the American Bald Eagle and Protect Human Health from Bioaccumulation", "10 = DDT Is a Miracle Chemical That Eradicated Malaria; Premature Bans Will Damage Agriculture and Developing Nations", 2, 8, 8, 1, 8, 1);

add(1970, "1970_shafer_commission_marijuana_formation", "Appointment of the National Commission on Marihuana and Drug Abuse (Shafer Commission)", "News", "1970-1972 (Shafer Commission Mandate)", "Civil Rights & Social Issues", 2,
  "Congress mandating an independent presidential commission to study the effects of marijuana and evaluate existing criminal penalties.",
  "1 = Commission Must Follow Objective Science and Recommend Decriminalization of Personal Cannabis Possession", "10 = Marijuana Is a Dangerous Gateway Drug Destroying the Morals and Ambitions of American Youth / Uphold Strict Penalties", 2, 8, 9, 1, 10, 1);

add(1970, "1970_new_york_liberalized_abortion_law", "New York State Legalization of Abortion on Demand Up to 24 Weeks", "News", "1970 (New York Abortion Law)", "Civil Rights & Social Issues", 1,
  "New York enacting the most liberal abortion statute in the country, allowing abortion up to 24 weeks without residency requirements.",
  "1 = Historic Affirmation of Reproductive Freedom Enabling Women to Make Safe, Legal Decisions About Their Own Bodies", "10 = Tragic Legalization of the Mass Slaughter of Innocent Unborn Children / Mobilize for Immediate Repeal", 2, 9, 4, 1, 10, 1);

add(1970, "1970_us_trade_act_mills_bill_tariffs", "House Passage of the Mills Bill (Textile & Shoe Import Quotas)", "News", "1970 (Mills Bill Protectionism)", "Economy & Taxation", 2,
  "House passing sweeping protectionist legislation establishing mandatory import quotas on foreign textiles and footwear to protect domestic manufacturing.",
  "1 = Save Hundreds of Thousands of American Textile and Apparel Jobs from Cheap Foreign Low-Wage Competition", "10 = Reckless Trade Protectionism That Will Spark Retaliatory Tariffs Against American Agriculture and Flare Inflation", 3, 7, 9, 2, 7, 1);

add(1970, "1970_general_motors_uaw_sixty_seven_day_strike", "67-Day United Auto Workers Strike Against General Motors (30-and-Out)", "News", "1970 (UAW-GM 30-and-Out Strike)", "Labor & Welfare", 2,
  "Four hundred thousand UAW workers striking GM, winning '30-and-out' retirement pensions and uncapped cost-of-living adjustments.",
  "1 = Glorious Working-Class Victory Guaranteeing Generous Pensions and Protection Against Inflation for Industrial Workers", "10 = Runaway Union Pension Demands and Wage Escalators That Will Make American Automakers Uncompetitive with Foreign Imports", 2, 9, 8, 1, 9, 1);

add(1970, "1970_federal_boat_safety_act", "Federal Boat Safety Act Drafting & Recreational Watercraft Standards", "News", "1970-1971 (Boating Safety Standards)", "Healthcare", 4,
  "Legislation empowering the U.S. Coast Guard to establish mandatory construction safety standards and defect recall authority for recreational boats.",
  "1 = Reduce Avoidable Drownings and Boating Explosions by Requiring Life Jackets, Flotation Foams, and Manufacturer Recalls", "10 = Overzealous Federal Bureaucracy Regulating Weekend Recreational Boaters and Small Boatbuilders", 2, 7, 6, 1, 7, 1);

add(1970, "1970_draft_lottery_first_drawings", "First Vietnam Draft Lottery Drawings by Birthdate", "News", "1969-1970 (Selective Service Lottery)", "Foreign Policy & Defense", 1,
  "Selective Service holding the first televised lottery since World War II assigning draft priority by birthday capsule drawing.",
  "1 = A Fairer Lottery System Than Unaccountable Local Draft Boards, but Conscription for an Unjust War Remains Incompatible with Freedom", "10 = Orderly, Fair Democratic System Allocating Military Service Obligation Equally Among American Youth", 3, 8, 10, 1, 9, 1);

add(1970, "1970_postal_airmail_stamp_rate_debate", "Post Office Department Request for 8-Cent First-Class Postage", "News", "1970-1971 (8-Cent Postage Increase)", "Governance & Judiciary", 4,
  "Proposal to raise first-class stamp prices from 6 cents to 8 cents to finance the new postal collective bargaining wage increases.",
  "1 = Modest Essential Price Increase Supporting Living Wages and Benefits for Hardworking Postal Employees", "10 = Continuous Price Hikes Punishing Small Businesses and Consumers While Postal Delivery Efficiency Declines", 2, 8, 8, 1, 8, 1);
`;

content += additions;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Appended 1970 successfully.');
