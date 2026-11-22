/**
 * scripts/build-issues-1984-1990.cjs
 * Issues dataset for 1984, 1986, 1988, 1990 election cycles (Bracket D).
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
// 1984 (50 Issues)
// =========================================================================
add(1984, "1984_reagan_morning_in_america_campaign", "Ronald Reagan's 'Morning in America' Re-election Theme & Optimism", "News", "1984 (Morning in America)", "Governance & Judiciary", 1,
  "Reagan's campaign showcasing economic recovery, low inflation, and renewed national pride, carrying 49 states in an overwhelming 525-13 Electoral College landslide.",
  "1 = Slick Madison Avenue Imagery Glossing Over Exploding Deficits, Gilded Age Inequality, and Homelessness", "10 = Inspiring Reaffirmation of American Greatness, Free-Market Prosperity, and Rejuvenated National Confidence", 2, 10, 8, 1, 10, 1);

add(1984, "1984_mondale_dnc_tax_hike_pledge", "Walter Mondale's Candid DNC Convention Tax Hike Pledge", "News", "1984 (Mondale Tax Pledge)", "Economy & Taxation", 1,
  "Mondale candidly declaring in his acceptance speech: 'Let's tell the truth... Mr. Reagan will raise taxes, and so will I. He won't tell you. I just did.'",
  "1 = Courageous, Honest Fiscal Realism Addressing the Crushing $180 Billion Reagan Deficits Directly", "10 = Suicidal Tax-and-Spend Liberal Dogma Seeking to Punish Productive Americans and Stifle Economic Growth", 2, 9, 10, 1, 9, 1);

add(1984, "1984_geraldine_ferraro_historic_vp_nomination", "Geraldine Ferraro Historic Vice Presidential Nomination & Financial Probe", "News", "1984 (Ferraro VP Candidacy)", "Civil Rights & Social Issues", 1,
  "Mondale choosing Queens Congresswoman Ferraro as the first female major-party VP nominee, followed by weeks of hostile press scrutiny of her husband's real estate taxes.",
  "1 = Historic Breakthrough for Women in Politics Subjected to Unfair Double Standards by Partisan Critics", "10 = Tokenized Identity Politics Compromised by Serious Financial and Tax Disclosure Improprieties", 2, 9, 4, 1, 9, 1);

add(1984, "1984_jesse_jackson_rainbow_coalition_campaign", "Jesse Jackson's Historic 'Rainbow Coalition' Presidential Primary Campaign", "News", "1984 (Rainbow Coalition Genesis)", "Civil Rights & Social Issues", 1,
  "Reverend Jackson winning 3.3 million votes and 4 states, organizing Black, Latino, Arab, and progressive white working-class voters into an insurgent left populist force.",
  "1 = Inspiring Democratic Empowerment Mobilizing Millions of Disenfranchised Minorities and Marginalized Workers", "10 = Divisive Radical Left Populism Stoking Racial Grievance and Undermining Centrist Party Unity", 2, 9, 3, 1, 9, 1);

add(1984, "1984_strategic_defense_initiative_sdi_star_wars", "President Reagan's Strategic Defense Initiative (SDI / 'Star Wars')", "News", "1983-1985 (SDI Strategic Debate)", "Foreign Policy & Defense", 1,
  "Reagan proposing space-based lasers and kinetic interceptors to render ballistic nuclear missiles 'impotent and obsolete', sparking fierce scientific and Soviet opposition.",
  "1 = Unworkable Multi-Billion Dollar Sci-Fi Fantasy Militarizing Space and Provoking a Dangerous New Arms Race", "10 = Visionary Defensive Shield Protecting American Families from Thermonuclear Annihilation Without Mutual Suicide", 2, 10, 5, 1, 10, 1);

add(1984, "1984_cia_mining_of_nicaraguan_harbors", "CIA Mining of Nicaraguan Commercial Harbors & World Court Condemnation", "News", "1984 (Nicaragua Harbors Mining)", "Foreign Policy & Defense", 1,
  "CIA secretly laying underwater magnetic mines in Corinto harbor, damaging European and Soviet freighters; Senate passes 84-12 resolution condemning the operation.",
  "1 = Outrageous Act of State-Sponsored Terrorism Violating International Law and Bypassing Congress", "10 = Legitimate Interdiction Halting Soviet and Cuban Weapons Shipments to Communist Sandinista Insurgents", 2, 9, 2, 1, 9, 1);

add(1984, "1984_boland_amendment_ii_total_contra_ban", "Enactment of Boland Amendment II (Total Ban on Military Aid to Contras)", "News", "1984 (Boland II Contra Cutoff)", "Foreign Policy & Defense", 1,
  "Congress prohibiting any agency or entity involved in intelligence activities from spending funds to support military or paramilitary operations in Nicaragua.",
  "1 = Ironclad Legal Restraint Halting the Imperial Executive's Illegal Secret Warfare in Central America", "10 = Unconstitutional Congressional Sabotage Deserting Freedom Fighters Resisting Soviet Tyranny in Our Hemisphere", 2, 9, 3, 1, 9, 1);

add(1984, "1984_national_minimum_drinking_age_act", "Enactment of the National Minimum Drinking Age Act of 1984 (Age 21 Mandate)", "News", "1984 (21 Drinking Age Enacted)", "Healthcare", 1,
  "Federal statute withholding 10% of federal highway construction funds from states that fail to raise the legal minimum drinking age to 21 post-MADD campaign.",
  "1 = Proven Life-Saving Public Health Statute Slashing Alcohol-Related Teen Highway Fatalities by Thousands", "10 = Blatant Federal Coercion Blackmailing States and Infringing Tenth Amendment Sovereignty to Control Liquor Laws", 2, 8, 9, 1, 9, 1);

add(1984, "1984_chevron_usa_v_nrdc_chevron_deference", "Chevron U.S.A. v. Natural Resources Defense Council (Chevron Deference)", "News", "1984 (Chevron Deference Doctrine)", "Governance & Judiciary", 1,
  "Supreme Court ruling 6-0 that federal courts must defer to reasonable agency interpretations of ambiguous statutes, dramatically expanding executive regulatory power.",
  "1 = Sensible Administrative Law Allowing Technical Subject-Matter Agency Experts to Interpret Complex Modern Statutes", "10 = Dangerous Abdication of Judicial Duty Ceding Unchecked Lawmaking Authority to Unelected Administrative Bureaucrats", 2, 8, 8, 1, 9, 1);

add(1984, "1984_comprehensive_crime_control_act_sentencing", "Comprehensive Crime Control Act of 1984 (Federal Sentencing Guidelines)", "News", "1984 (Sentencing Guidelines & Parole Abolished)", "Governance & Judiciary", 1,
  "Abolishing federal parole, establishing determinate sentencing guidelines via the U.S. Sentencing Commission, and vastly expanding civil asset forfeiture laws.",
  "1 = Rigid Mechanical Sentences Driving Mass Incarceration and Depriving Judges of Compassionate Discretion", "10 = Tough, Fair Law and Order Ending Lenient Judicial Revolving Doors and Ensuring Predictable Punishment for Criminals", 2, 9, 7, 1, 9, 1);

add(1984, "1984_hatch_waxman_generic_drug_act", "Drug Price Competition and Patent Term Restoration Act of 1984 (Hatch-Waxman)", "News", "1984 (Hatch-Waxman Generic Drug Enactment)", "Healthcare", 1,
  "Landmark compromise creating the modern generic pharmaceutical industry via abbreviated FDA approvals (ANDA) while extending patent life for brand-name drug innovators.",
  "1 = Magnificent Consumer Victory Unleashing Cheap Life-Saving Generic Prescription Medications for Everyday Americans", "10 = Excellent Free-Market Compromise Balancing Low-Cost Generic Competition with Robust Patent Rewards for Medical R&D", 2, 8, 9, 2, 8, 1);

add(1984, "1984_los_angeles_olympic_games_commercial_success", "1984 Los Angeles Summer Olympic Games (Soviet Boycott & Private Financing)", "News", "1984 (LA Olympics Commercial Triumph)", "Technology & Infrastructure", 2,
  "Peter Ueberroth staging the first privately financed Olympic Games in history without taxpayer subsidies, generating a $225M surplus despite Soviet bloc boycott.",
  "1 = Resounding Demonstration of Free Enterprise, Civic Volunteerism, and American Organizational Ingenuity", "10 = Celebrate American Athletic Triumph While Guarding Against Crass Over-Commercialization of the Sacred Olympic Spirit", 2, 8, 8, 2, 8, 1);

add(1984, "1984_cable_communications_policy_act", "Enactment of the Cable Communications Policy Act of 1984", "News", "1984 (Cable TV Rate Deregulation)", "Technology & Infrastructure", 2,
  "Deregulating basic cable television subscription rates and establishing a national framework for local municipal cable franchising, unleashing cable channel expansion.",
  "1 = Free-Market Catalyst Unleashing Billions in Private Capital to Build CNN, ESPN, MTV, and Nationwide Coaxial Networks", "10 = Corporate Deregulation Enabling Cable Monopoly Operators to Skyrocket Monthly Subscriber Bills Without Competition", 2, 8, 9, 2, 8, 1);

add(1984, "1984_hswa_hazardous_waste_land_ban", "Hazardous and Solid Waste Amendments of 1984 (HSWA - RCRA Land Disposal Ban)", "News", "1984 (HSWA Land Disposal Restrictions)", "Energy & Climate", 1,
  "Banning the land disposal of untreated hazardous chemical wastes and requiring strict groundwater monitoring for 500,000 underground petroleum storage tanks.",
  "1 = Essential Groundwater Defense Forcing Chemical Manufacturers to Treat Toxic Wastes Rather Than Dumping Them in Leaky Pits", "10 = Extremely Costly Mandates Imposing Crushing Compliance Upgrades on Small Gas Stations and Chemical Plants", 2, 8, 8, 1, 8, 1);

add(1984, "1984_competition_in_contracting_act_cica", "Competition in Contracting Act of 1984 (CICA - Reining in DoD $600 Wrenches)", "News", "1984 (CICA Procurement Reform)", "Governance & Judiciary", 2,
  "Requiring full and open competition for federal contracts to halt notorious Pentagon procurement scandals involving $435 claw hammers and $640 toilet seats.",
  "1 = Vital Defense Reform Shining Public Scrutiny on Wasteful Military Contractors and Stopping Pentagon Price-Gouging", "10 = Necessary Oversight, Provided Complex Competitive Bidding Rules Do Not Paralyze Urgent Strategic Weapons Procurement", 2, 8, 8, 1, 8, 1);

add(1984, "1984_bhopal_disaster_chemical_safety_repercussions", "Bhopal Toxic Gas Disaster in India (Thousands Killed by Union Carbide)", "News", "1984 (Bhopal Disaster Shockwaves)", "Energy & Climate", 1,
  "Lethal methyl isocyanate leak from Union Carbide pesticide plant killing over 3,000 Indian citizens, igniting demands for community right-to-know laws in the U.S.",
  "1 = Horrific Proof of Corporate Chemical Negligence Demanding Strict Federal Plant Safety Audits and Mandatory Public Chemical Disclosure", "10 = Industrial Tragedy in a Developing Nation; American Chemical Facilities Already Maintain Rigorous Safety Protocols", 2, 8, 8, 1, 8, 1);

add(1984, "1984_hiv_retrovirus_discovery_and_blood_supply", "Discovery of the HIV Retrovirus & Contaminated Blood Supply Crisis", "News", "1984 (HIV Discovery & Blood Safety)", "Healthcare", 1,
  "Dr. Robert Gallo and Luc Montagnier identifying HIV as the cause of AIDS; federal regulators race to develop a commercial blood-screening test for hemophiliacs.",
  "1 = Urgent National Mission Mandating Universal Blood Screening, Massive Federal Biomedical Research, and Anti-Discrimination Laws", "10 = Prioritize Public Safety and Blood Supply Purity Free from Radical Gay Political Pressure on Blood Donations", 2, 8, 5, 1, 8, 1);

add(1984, "1984_att_breakup_takes_effect_seven_baby_bells", "AT&T Divestiture Takes Effect: Ma Bell Split into Seven Regional Baby Bells", "News", "1984 (AT&T Divestiture Effective)", "Technology & Infrastructure", 2,
  "Divestiture plan taking effect on January 1, transferring 1 million employees and $150B in assets into seven regional holding companies and AT&T Long Distance.",
  "1 = Historic Pro-Competition Watershed Spurring Cheaper Long-Distance Rates and Unleashing the Modern Telecommunications Boom", "10 = Disruption Driving Up Local Residential Telephone Rates and Ending the Simplicity of Universal Single-Company Service", 2, 8, 9, 2, 8, 1);

add(1984, "1984_grove_city_college_v_bell_civil_rights", "Grove City College v. Bell Supreme Court Ruling Narrowing Title IX", "News", "1984 (Grove City Title IX Decision)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 6-3 that Title IX sex discrimination bans apply only to specific educational programs receiving direct federal aid, not the whole college.",
  "1 = Devastating Narrowing of Civil Rights Protections Demanding Immediate Congressional Enactment of Remedial Legislation", "10 = Sound Textual Interpretation Restricting Federal Bureaucratic Intrusion to Specifically Funded Federal Programs", 2, 9, 6, 1, 9, 1);

add(1984, "1984_equal_access_act_religious_clubs", "Enactment of the Equal Access Act of 1984 (Student Religious Clubs in Schools)", "News", "1984 (Equal Access Act Enactment)", "Education", 1,
  "Federal statute prohibiting public secondary schools that receive federal funds and host non-curriculum student clubs from discriminating against religious student clubs.",
  "1 = Essential Defense of High School Students' First Amendment Free Speech and Freedom of Religious Fellowship", "10 = Dangerous Infiltration of Sectarian Religion into Public School Classrooms Breaching the Wall of Separation", 3, 9, 4, 1, 10, 1);

add(1984, "1984_continental_illinois_bank_collapse_too_big_to_fail", "Continental Illinois Bank Collapse ($4.5 Billion Federal Bailout)", "News", "1984 (Too Big to Fail Inception)", "Economy & Taxation", 1,
  "FDIC, Fed, and Comptroller executing unprecedented $4.5 billion nationalization bailout of Chicago bank following run on uninsured foreign deposits, coining 'Too Big to Fail'.",
  "1 = Reckless Deregulation Causing Speculative Meltdown / If Banks Are Too Big to Fail, They Are Too Big to Exist", "10 = Emergency Systemic Rescue Necessary to Prevent Catastrophic Global Banking Panic and Continental Clearing Collapse", 2, 8, 10, 1, 9, 2);

add(1984, "1984_beirut_marine_barracks_investigation_aftermath", "Long Commission Report & Reagan Withdrawal of U.S. Marines from Lebanon", "News", "1983-1984 (Beirut Barracks Bombing Aftermath)", "Foreign Policy & Defense", 1,
  "Following truck bomb killing 241 American servicemen, Pentagon report finds security negligence; Reagan orders remaining Marines withdrawn to ships offshore.",
  "1 = Tragic Lesson in Imperial Mission Creep: America Had No Strategic Role Entangling Troops in Lebanese Sectarian Quagmires", "10 = Bitter Tactical Humiliation Deserting Lebanon Under Terrorist Attack, Emboldening Iranian and Syrian Radical Proxies", 2, 9, 3, 1, 9, 1);

add(1984, "1984_social_security_disability_benefits_reform_act", "Enactment of the Social Security Disability Benefits Reform Act of 1984", "News", "1984 (Disability Benefits Protection)", "Labor & Welfare", 1,
  "Unanimously passed statute halting Reagan administration's aggressive purges of disability rolls, requiring proof of medical improvement before terminating benefits.",
  "1 = Compassionate Bipartisan Correction Halting Heartless Bureaucratic Purges That Cut Off Hundreds of Thousands of Truly Disabled Citizens", "10 = Support Truly Disabled Americans While Guarding Against Wasteful Disability Trust Fund Fraud and Malingering", 2, 8, 7, 1, 8, 1);

add(1984, "1984_commercial_space_launch_act", "Enactment of the Commercial Space Launch Act of 1984", "News", "1984 (Commercial Space Flight Enacted)", "Technology & Infrastructure", 2,
  "Empowering DOT to license and regulate private commercial satellite rocket launches, ending NASA's monopoly on civilian orbital access.",
  "1 = Visionary Capitalist Deregulation Unleashing American Commercial Space Enterprise and Private Orbital Innovation", "10 = Support Commercial Rocketry While Ensuring Strict Public Safety, Orbital Debris, and Space Liability Indemnification", 2, 8, 10, 2, 8, 1);

add(1984, "1984_semiconductor_chip_protection_act", "Enactment of the Semiconductor Chip Protection Act of 1984 (Mask Works)", "News", "1984 (Semiconductor IP Enacted)", "Technology & Infrastructure", 2,
  "Creating a new form of intellectual property protection (mask works) to shield American microchip designs from unauthorized Japanese and foreign photographic copying.",
  "1 = Indispensable Protection Shielding Silicon Valley's High-Tech R&D Investments from Predatory Foreign Copycats", "10 = Sound Intellectual Property Modernization Securing America's Vital Technological Edge in Semiconductor Computing", 2, 8, 8, 1, 8, 1);

add(1984, "1984_new_york_first_mandatory_seat_belt_law", "New York Enacts First Mandatory Automobile Seat Belt Law in the Nation", "News", "1984 (Mandatory Seat Belt Wave)", "Healthcare", 2,
  "Governor Mario Cuomo signing the nation's first statute fining drivers and front-seat passengers $50 for failing to buckle up, igniting freedom-of-choice debates.",
  "1 = Proven Common-Sense Life-Saving Measure That Will Prevent Thousands of Fatal Ejections and Massive Medical Costs", "10 = Paternalistic Nanny-State Infringement on Personal Liberty: Adults Have a Right to Choose Their Own Risk Behind the Wheel", 2, 7, 9, 1, 8, 1);

add(1984, "1984_us_withdrawal_from_unesco", "Reagan Administration Formally Withdraws the United States from UNESCO", "News", "1984 (UNESCO Withdrawal)", "Foreign Policy & Defense", 2,
  "U.S. withdrawing from the UN educational agency, citing anti-Western political bias, runaway budget bloat, and proposals for a state-controlled 'New World Information Order'.",
  "1 = Short-Sighted Isolationist Ploy Ceding Global Cultural and Educational Leadership to the Soviet Bloc and Dictatorships", "10 = Principled Defense of Taxpayer Dollars and Free Press Values Refusing to Bankroll Corrupt Anti-American Globalist Bureaucracies", 2, 9, 8, 1, 10, 1);

add(1984, "1984_ethiopian_famine_and_us_food_aid", "Catastrophic Ethiopian Famine & Massive U.S. Emergency Food Air-Drops", "News", "1984 (Ethiopian Famine Relief)", "Foreign Policy & Defense", 1,
  "Severe drought and civil war causing one million deaths in Ethiopia; BBC broadcast sparks worldwide mobilization and massive U.S. government grain shipments.",
  "1 = Noble Humanitarian Imperative Demonstrating American Compassion and Saving Hundreds of Thousands of Starving Children", "10 = Generous American Charity, Though Steps Must Ensure Food Aid Is Not Diverted by Ethiopia's Brutal Marxist Dictator", 2, 7, 5, 1, 7, 1);

add(1984, "1984_reagan_microphone_gaffe_bombing_begins", "President Reagan's Off-the-Record Radio Voice Check ('We Begin Bombing in 5 Minutes')", "News", "1984 (Reagan Microphone Gaffe)", "Foreign Policy & Defense", 1,
  "Reagan joking before a radio address: 'I've signed legislation that will outlaw Russia forever. We begin bombing in five minutes', leaked to worldwide shock.",
  "1 = Terrifying, Reckless Display of Flippant Bellicosity Proving Reagan Is Unfit to Hold His Finger on the Nuclear Button", "10 = Harmless Private Microphone Sound-Check Quip Hypocritically Blown Out of Proportion by Liberal Partisans and Soviet Propagandists", 2, 9, 4, 1, 9, 1);

add(1984, "1984_child_support_enforcement_amendments", "Enactment of the Child Support Enforcement Amendments of 1984", "News", "1984 (Child Support Enforcement Enacted)", "Labor & Welfare", 2,
  "Mandating states enact automatic wage withholding for overdue child support payments and intercepting state and federal income tax refunds.",
  "1 = Crucial Protection Ensuring Deadbeat Parents Pay Their Fair Share and Rescuing Single Mothers and Children from Poverty", "10 = Common-Sense Personal Responsibility Ensuring Biological Parents, Not Government Welfare, Support Their Own Children", 2, 8, 7, 1, 8, 1);

add(1984, "1984_gary_hart_new_ideas_campaign", "Senator Gary Hart's 'New Ideas' Insurgent Democratic Primary Campaign", "News", "1984 (Hart New Ideas Candidacy)", "Governance & Judiciary", 2,
  "Colorado Senator Hart winning New Hampshire primary on a platform of high-tech economic revitalization, military reform, and generational transition, challenging Mondale.",
  "1 = Exciting Post-New Deal Modernization Embracing the High-Tech Future and Pragmatic Neo-Liberal Economic Innovation", "10 = Flashing Gimmick Lacking Substantive Meat, Famous For Mondale's devastating question: 'Where's the beef?'", 2, 8, 6, 1, 8, 1);

add(1984, "1984_trade_and_tariff_act_of_1984", "Enactment of the Trade and Tariff Act of 1984 (Bilateral FTA Authorization)", "News", "1984 (Trade & Tariff Act)", "Economy & Taxation", 2,
  "Authorizing the President to negotiate fast-track bilateral free trade agreements with Israel and Canada and expanding intellectual property trade remedies.",
  "1 = Framework Enabling Expanded Global Market Access for American Agriculture, High-Tech, and Creative Industries", "10 = Fast-Track Authority Ceding Constitutional Congressional Trade Oversight and Threatening Domestic Manufacturing", 2, 8, 9, 1, 8, 1);

add(1984, "1984_wall_street_journal_insider_trading_scandal", "Wall Street Journal 'Heard on the Street' Leak Scandal (Foster Winans)", "News", "1984 (Winans Wall Street Leak)", "Economy & Taxation", 2,
  "SEC bringing insider trading charges against Wall Street Journal reporter R. Foster Winans for leaking impending column mentions to stockbrokers for illicit trading profits.",
  "1 = Essential Regulatory Prosecution Protecting Financial Market Integrity and Restoring Confidence in Free Press Ethics", "10 = Dangerous Expansion of Misappropriation Theory Turning Internal Employer Ethics Breaches into Federal Securities Crimes", 2, 8, 8, 1, 8, 1);

add(1984, "1984_cia_guerrilla_warfare_manual_scandal", "CIA 'Psychological Operations in Guerrilla Warfare' Manual Scandal", "News", "1984 (CIA Contra Manual Scandal)", "Foreign Policy & Defense", 1,
  "Discovery of a CIA manual printed for Nicaraguan Contras advising on the 'neutralization' (assassination) of court judges, police officials, and government figures.",
  "1 = Appalling Evidence of Covert American State Terrorism Violating Presidential Directives Banning Political Assassinations", "10 = Clumsy Low-Level Document Exaggerated by Left-Wing Critics to Cripple Patriotic Freedom Fighters in Nicaragua", 2, 9, 2, 1, 9, 1);

add(1984, "1984_deficit_reduction_act_defra", "Enactment of the Deficit Reduction Act of 1984 (DEFRA - $50 Billion Deficit Cuts)", "News", "1984 (DEFRA Enacted)", "Economy & Taxation", 2,
  "Bipartisan package raising $50 billion in revenues by freezing certain tax reductions, restricting luxury car leasing, and reforming liquor excise taxes.",
  "1 = Sensible Prudent Bipartisan Step Toward Taming Runaway Supply-Side Deficits and Stabilizing Bond Markets", "10 = Backdoor Tax Increase Weakening Economic Incentives; Deficits Must Be Cut Exclusively by Slashing Spending", 2, 8, 10, 1, 9, 1);

add(1984, "1984_marine_mammal_protection_reauthorization", "Reauthorization of Marine Mammal Protection Act & Tuna Dolphin Rules", "News", "1984 (MMPA Tuna Dolphin Rules)", "Energy & Climate", 2,
  "Reauthorizing MMPA with tightened 20,500 annual dolphin mortality cap for U.S. tuna purse-seine fishing fleet in the Eastern Tropical Pacific.",
  "1 = Imperative Protection Saving Hundreds of Thousands of Intelligent Dolphins from Horrific Suffocation in Commercial Tuna Nets", "10 = Heavy Mandates Forcing American Tuna Fishermen to Re-flag Under Foreign Flags Free from U.S. Inspections", 2, 8, 8, 1, 8, 1);

add(1984, "1984_tandem_truck_safety_act", "Enactment of the Tandem Truck Safety Act of 1984", "News", "1984 (Tandem Truck Safety)", "Technology & Infrastructure", 3,
  "Allowing states to petition DOT to exempt certain older or narrow highways from mandatory federal access for wide 102-inch twin-trailer tandem trucks.",
  "1 = Vital Common-Sense Safety Flexibility Protecting Motorists from Monster Twin-Trailers on Mountain Roads and Historic Streets", "10 = Avoid Arbitrary State Roadblocks That Disrupt Efficient Interstate Freight Logistics and Raise Consumer Shipping Costs", 2, 7, 8, 1, 8, 1);

add(1984, "1984_low_income_home_energy_assistance_reauth", "Reauthorization of the Low-Income Home Energy Assistance Program (LIHEAP)", "News", "1984 (LIHEAP Reauthorization)", "Labor & Welfare", 2,
  "Expanding LIHEAP funding to $2.1 billion annually to shield poor and elderly households from freezing winter utility shutoffs.",
  "1 = Sacred Compassionate Lifeline Keeping Heat On for Millions of Low-Income Children and Grandparents During Winter", "10 = Sound Humanitarian Buffer, Provided Funding Does Not Become an Unaccountable Open-Ended Entitlement on Taxpayers", 2, 8, 9, 1, 9, 1);

add(1984, "1984_motor_vehicle_theft_law_enforcement_act", "Enactment of the Motor Vehicle Theft Law Enforcement Act of 1984", "News", "1984 (Auto Theft Prevention)", "Governance & Judiciary", 3,
  "Requiring automakers to stamp vehicle identification numbers (VINs) on 14 major replacement crash parts to demolish the multi-billion dollar 'chop shop' racket.",
  "1 = Smart Anti-Crime Legislation Cutting Car Thefts and Stripping Organized Crime of Lucrative Stolen Auto Part Markets", "10 = Common-Sense Anti-Theft Measure Protecting Vehicle Owners While Imposing Modest Stamping Costs on Carmakers", 2, 7, 7, 1, 7, 1);

add(1984, "1984_voting_rights_accessibility_act", "Voting Rights Accessibility for the Elderly and Handicapped Act of 1984", "News", "1984 (Voting Accessibility Enacted)", "Civil Rights & Social Issues", 2,
  "Requiring all polling places for federal elections to be physically accessible to elderly and handicapped voters with wheelchair ramps.",
  "1 = Basic Democratic Equality Guaranteeing Disabled and Senior Citizens Can Exercise Their Sacred Right to Vote in Person", "10 = Reasonable Accessibility Requirement, Provided Modest Rural Precincts Retain Alternative Curbside Balloting Options", 2, 8, 5, 1, 8, 1);

add(1984, "1984_air_passenger_smoking_ban_proposals", "Civil Aeronautics Board (CAB) First Proposals to Ban Smoking on Short Domestic Flights", "News", "1984 (In-Flight Smoking Ban Genesis)", "Healthcare", 2,
  "CAB proposing to prohibit cigarette smoking on short commuter flights under two hours to protect passengers and flight attendants from secondhand smoke.",
  "1 = High Time to Clear Toxic, Suffocating Cigarette Carcinogens from Sealed Aircraft Cabins to Protect Healthy Travelers", "10 = Overbearing Government Intrusion Denying Flying Consumers the Freedom to Enjoy a Legal Tobacco Product in Smoking Rows", 2, 8, 9, 1, 8, 1);

add(1984, "1984_farm_credit_system_insolvency_warning", "Farm Credit Administration Warns of Looming Farm Credit System Insolvency", "News", "1984 (Farm Credit Crisis Warning)", "Agriculture & Food", 1,
  "Federal regulators warning Congress that agricultural cooperative banks face billions in delinquent farm real estate loans as Heartland farm values plunge.",
  "1 = Urgent Federal Intervention Needed to Restructure Debt and Prevent the Complete Collapse of Rural Community Banking", "10 = Sound the Alarm on Speculative Farm Debt While Insisting on Prudent Market Restructuring Free from Permanent Bailouts", 2, 8, 9, 1, 8, 1);

add(1984, "1984_justice_department_merger_guidelines_revision", "Department of Justice Revisions to Antitrust Merger Guidelines", "News", "1984 (Antitrust Merger Modernization)", "Economy & Taxation", 2,
  "Assistant Attorney General William Baxter relaxing antitrust barriers to corporate mergers, prioritizing economic efficiency over market concentration.",
  "1 = Dangerous Capitulation Unleashing a Wave of Corporate Monopolies, Megamergers, and Squeezing Out Independent Small Businesses", "10 = Modern Economic Realism Recognizing That Efficient Corporate Scale Enhances American Global Competitiveness", 2, 9, 10, 1, 9, 1);

add(1984, "1984_clean_water_act_reauthorization_veto_threat", "Congressional Passage of $18B Clean Water Act Reauthorization (Reagan Veto Threat)", "News", "1984 (Clean Water Funding Standoff)", "Energy & Climate", 1,
  "House passing sweeping $18 billion sewage treatment grants over Reagan administration objections that local wastewater is a municipal responsibility.",
  "1 = Essential Federal Capital Commitment Cleaning Up America's Rivers, Estuaries, and Coastal Harbors from Raw Municipal Sewage", "10 = Bloated $18 Billion Federal Pork-Barrel Boondoggle That Explodes Deficits and Relieves Local Cities of Responsibility", 2, 8, 8, 1, 8, 1);

add(1984, "1984_covert_aid_to_afghan_mujahideen_ramps_up", "Bipartisan Congressional Push Ramping Up Covert CIA Aid to Afghan Mujahideen", "News", "1984 (Operation Cyclone Escalation)", "Foreign Policy & Defense", 1,
  "Congress, led by Texas Rep. Charlie Wilson, secretly doubling CIA funds for Afghan guerrilla resistance fighters battling the Soviet Red Army.",
  "1 = Moral Obligation Arming Brave Afghan Freedom Fighters Bleeding the Brutal Soviet Invaders and Halting Red Expansion", "10 = Decisive Strategic Cold War Priority Inflicting Catastrophic Defeat on the Soviet Military Machine in the Hindu Kush", 2, 9, 4, 1, 9, 1);

add(1984, "1984_bankruptcy_amendments_act_judgeships", "Enactment of the Bankruptcy Amendments and Federal Judgeship Act of 1984", "News", "1984 (Bankruptcy Act & Labor Contracts)", "Governance & Judiciary", 2,
  "Reconstituting bankruptcy courts under Article I post-Northern Pipeline and restricting companies from using Chapter 11 to unilaterally cancel union contracts (Bildisco fix).",
  "1 = Crucial Labor Shield Stopping Greedy Corporations from Filing Sham Bankruptcies Merely to Tear Up Legitimate Union Wage Agreements", "10 = Sound Compromise Protecting Solvent Company Reorganizations While Ensuring Fair Judicial Review of Collective Bargaining", 2, 8, 8, 1, 8, 1);

add(1984, "1984_high_tech_export_controls_coctom", "Pentagon & Commerce Clashes Over Restricting High-Tech Computer Exports to Soviets", "News", "1984 (CoCom Tech Export Controls)", "Technology & Infrastructure", 2,
  "Defense Secretary Weinberger insisting on strict military bans on selling 16-bit microcomputers and machine tools to foreign allies who might re-export to Moscow.",
  "1 = Guard American Technological Leadership / Never Allow Western Microelectronics to Power Soviet Guidance Systems", "10 = Overly Restrictive Pentagon Chokeholds Paralyzing American High-Tech Commercial Exports in Non-Sensitive Civilian Markets", 2, 9, 8, 1, 9, 1);

add(1984, "1984_jesse_jackson_hymietown_controversy", "Jesse Jackson's Off-the-Record 'Hymietown' Remarks & Farrakhan Ties", "News", "1984 (Jackson Hymietown Remarks)", "Civil Rights & Social Issues", 1,
  "Jackson referring to New York City as 'Hymietown' in conversation with a reporter and associating with Nation of Islam leader Louis Farrakhan, polarizing Democratic primary.",
  "1 = Jackson Deeply Apologized; The Episode Must Not Obscure the Transformative Power of His Multiracial Rainbow Crusade", "10 = Disgraceful Anti-Semitic Slurs and Radical Associations Disqualifying Jackson from Serious Leadership in a Tolerant Republic", 2, 9, 4, 1, 9, 1);

add(1984, "1984_antibiotic_feed_additives_cattle_debates", "NRDC Petition to Ban Sub-Therapeutic Antibiotics in Livestock Feed", "News", "1984 (Livestock Antibiotic Resistance)", "Agriculture & Food", 2,
  "Environmental and medical groups petitioning FDA to ban routine low-dose penicillin and tetracycline in animal feed due to antibiotic-resistant superbugs.",
  "1 = Essential Biomedical Precaution Preserving the Life-Saving Power of Wonder Drugs from Resistant Agricultural Superbugs", "10 = Low-Dose Antibiotics Prevent Herd Disease and Promote Growth; Premature Bans Will Drastically Raise Retail Meat Costs", 2, 7, 8, 1, 8, 1);

add(1984, "1984_death_of_andropov_chernenko_ascendance", "Death of Soviet Leader Yuri Andropov & Ascendance of Konstantin Chernenko", "News", "1984 (Soviet Gerontocracy)", "Foreign Policy & Defense", 1,
  "Frail 72-year-old Chernenko succeeding Andropov as Soviet General Secretary, reinforcing Soviet gerontocratic stagnation and stalling arms control talks.",
  "1 = Seize the Diplomatic Opportunity to Re-open Direct High-Level Nuclear Dialogue with the Kremlin to Avert World War III", "10 = Soviet Communist System Is Paralyzed and Moribund; Stand Strong and Resolute with Reagan's Military Modernization", 2, 9, 4, 1, 9, 1);

// =========================================================================
// 1986 (50 Issues)
// =========================================================================
add(1986, "1986_tax_reform_act_of_1986_landmark", "Tax Reform Act of 1986 (Bipartisan Overhaul Slashing Top Rate to 28%)", "News", "1986 (TRA 86 Enactment)", "Economy & Taxation", 1,
  "Reagan, Bradley, Packwood, and Rostenkowski uniting to slash individual income tax rates to 15% and 28%, eliminate deductions, and close hundreds of corporate tax shelters.",
  "1 = Historic Fair Tax Overhaul Eliminating Unjust Tax Shelters, Removing Millions of Working Poor from Tax Rolls, and Equalizing Capital and Labor Taxes", "10 = Sweeping Supply-Side Triumph Slashing Confiscatory Rates to 28% and Unleashing Productive Free Enterprise", 2, 9, 10, 2, 9, 1);

add(1986, "1986_space_shuttle_challenger_disaster", "Space Shuttle Challenger Explosion (Loss of 7 Astronauts & McAuliffe)", "News", "1986 (Challenger Tragedy)", "Technology & Infrastructure", 1,
  "Challenger exploding 73 seconds into flight on January 28 due to cold-degraded solid rocket booster O-rings, grounding the shuttle fleet for nearly three years.",
  "1 = Severe Indictment of NASA Bureaucratic Complacency Overriding Engineering Warnings; Thorough Safety Overhaul Mandatory", "10 = Mourn Our Brave Space Pioneers / Rebuild the Shuttle and Reaffirm America's Unwavering Manned Space Leadership", 2, 7, 6, 2, 8, 1);

add(1986, "1986_chernobyl_nuclear_disaster_fallout", "Chernobyl Nuclear Disaster in Soviet Ukraine & Transboundary Radiation", "News", "1986 (Chernobyl Catastrophe)", "Energy & Climate", 1,
  "Catastrophic explosion and core meltdown at Chernobyl reactor spewing radioactive plume across Europe, highlighting Soviet secrecy and commercial nuclear perils.",
  "1 = Chilling Planetary Warning of Nuclear Fission Peril Demanding a Global Moratorium on New Commercial Nuclear Reactors", "10 = Soviet Communist Sloppiness and Flawed Flammable RBMK Graphite Reactor Design; Western Reactors Maintain Superior Containment", 2, 8, 8, 1, 8, 1);

add(1986, "1986_iran_contra_affair_breaks", "Iran-Contra Scandal: Secret Arms-for-Hostages Sales to Iran Diverted to Contras", "News", "1986-1987 (Iran-Contra Revelations)", "Governance & Judiciary", 1,
  "Lebanese magazine reveals Reagan administration secretly sold anti-tank missiles to terrorist-sponsoring Iran to free hostages, diverting profits to Nicaraguan Contras.",
  "1 = Shocking Subversion of the Constitution, Contempt for Congressional Law, and Clandestine Junta Rule Inside the White House", "10 = Patriotic Efforts by Oliver North to Rescue American Hostages and Support Anti-Communist Freedom Fighters Resisting Soviet Tyranny", 2, 9, 2, 1, 9, 1);

add(1986, "1986_immigration_reform_and_control_act_irca", "Immigration Reform and Control Act of 1986 (IRCA - Amnesty & Sanctions)", "News", "1986 (IRCA Landmark)", "Immigration", 1,
  "Bipartisan legislation granting legal status and green cards to 2.7 million undocumented immigrants while criminalizing the hiring of unauthorized workers by employers.",
  "1 = Humane Path Out of the Shadows for Millions of Hardworking Immigrants Who Built America's Agricultural and Service Economy", "10 = Disastrous Blanket Amnesty That Rewards Lawbreaking and Will Inevitably Encourage Waves of Future Illegal Infiltration", 2, 8, 6, 1, 10, 1);

add(1986, "1986_anti_drug_abuse_act_mandatory_minimums", "Anti-Drug Abuse Act of 1986 (100-to-1 Crack vs Powder Cocaine Disparity)", "News", "1986 (1986 Anti-Drug Enactment)", "Governance & Judiciary", 1,
  "Passed following the cocaine overdose death of basketball star Len Bias, enacting severe mandatory minimum prison sentences and the 100-to-1 sentencing disparity for crack cocaine.",
  "1 = Disastrous Knee-Jerk Law Punishing Low-Level Addicts, Filling Prisons, and Enacting Racially Biased Sentencing Against Black Citizens", "10 = Tough, Decisive Federal Medicine Demolishing Deadly Inner-City Crack Gangs and Protecting Communities from Violent Crime", 2, 9, 8, 1, 10, 1);

add(1986, "1986_midterm_elections_democrats_retake_senate", "1986 Midterm Elections: Democrats Regain Control of the Senate (55-45)", "News", "1986 (Democratic Senate Sweep)", "Governance & Judiciary", 1,
  "Democrats picking up 8 Senate seats across the South and Farm Belt, ending six years of Republican Senate control and seizing committee chairmanships.",
  "1 = Resounding Grassroots Mandate to Check Reagan's Lame-Duck Agenda, Defend Social Safety Nets, and Scrutinize Right-Wing Judicial Picks", "10 = Midterm Distortion Driven by Farm Distress; The Nation Remains Steadfastly Pro-Reagan, Pro-Tax Cut, and Pro-Defense", 2, 9, 6, 1, 9, 1);

add(1986, "1986_reykjavik_summit_zero_nuclear_options", "Reykjavik Summit: Reagan and Gorbachev Near-Accord on Abolishing All Nukes", "News", "1986 (Reykjavik Summit Drama)", "Foreign Policy & Defense", 1,
  "Historic weekend summit where Reagan and Gorbachev discussed eliminating all strategic ballistic missiles, collapsing when Reagan refused to restrict SDI to laboratories.",
  "1 = Tragic Lost Opportunity to Rid Humanity of All Strategic Nuclear Weapons Scuttled by Reagan's Obsession with Star Wars Fantasy", "10 = Reagan Showed Courageous Resolve Refusing to Surrender America's SDI Shield, Forcing Soviets Back to the Real Negotiating Table", 2, 9, 4, 1, 9, 1);

add(1986, "1986_comprehensive_anti_apartheid_act_override", "Enactment of the Comprehensive Anti-Apartheid Act (Overriding Reagan's Veto)", "News", "1986 (South Africa Sanctions Override)", "Foreign Policy & Defense", 1,
  "Congress overwhelmingly overriding Reagan's veto (313-83 in House, 78-21 in Senate) to impose severe economic sanctions and landing bans on apartheid South Africa.",
  "1 = Historic Moral Victory Aligning the United States with the Struggle for Black Human Freedom and Dismantling White Supremacist Apartheid", "10 = Counter-Productive Punitive Sanctions That Harm Black South African Workers and Drive Pretoria into Strategic Isolation", 2, 9, 3, 1, 9, 1);

add(1986, "1986_bowers_v_hardwick_sodomy_upheld", "Bowers v. Hardwick Supreme Court Ruling (5-4 Upholding State Sodomy Laws)", "News", "1986 (Bowers Sodomy Ruling)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling that the constitutional right to privacy does not extend to private consensual homosexual sodomy between adults in their own homes.",
  "1 = Devastating, Bigoted Betrayal of Fundamental Human Privacy, Dignity, and Equality for Gay and Lesbian Americans", "10 = Splendid Judicial Restraint Upholding Millennia of Judeo-Christian Moral Traditions and State Police Powers Over Public Morals", 2, 10, 5, 1, 10, 1);

add(1986, "1986_batson_v_kentucky_peremptory_strikes", "Batson v. Kentucky Supreme Court Ruling (Barring Racial Peremptory Juror Strikes)", "News", "1986 (Batson Jury Ruling)", "Governance & Judiciary", 1,
  "Supreme Court ruling 7-2 that prosecutors cannot use peremptory challenges to exclude potential jurors from criminal trials solely on account of their race.",
  "1 = Essential Constitutional Defense Ensuring Truly Impartial Juries and Ending Racist Jim Crow Exclusions of Black Jurors", "10 = Overly Complex Procedural Burden Impairing Traditional Peremptory Challenges and Delaying Criminal Jury Selection", 2, 8, 4, 1, 8, 1);

add(1986, "1986_meritor_savings_bank_v_vinson_harassment", "Meritor Savings Bank v. Vinson (Recognizing Hostile Work Environment Sexual Harassment)", "News", "1986 (Meritor Sexual Harassment Milestone)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling unanimously (Rehnquist opinion) that sexual harassment creating a hostile work environment is an illegal form of sex discrimination under Title VII.",
  "1 = Transformative Legal Shield Protecting Millions of Working Women from Degrading, Coercive Sexual Abuses on the Job", "10 = Sound Ruling on Severe Harassment, Provided Standard Does Not Invite Frivolous Lawsuits Over Petty Workplace Flirtation", 2, 8, 4, 1, 9, 1);

add(1986, "1986_safe_drinking_water_act_amendments_lead_ban", "Safe Drinking Water Act Amendments of 1986 (Banning Lead Pipes and Solder)", "News", "1986 (Lead Plumbing Ban)", "Energy & Climate", 1,
  "Overhauling the SDWA to mandate EPA regulate 83 drinking water contaminants and imposing a nationwide ban on lead pipes, solder, and flux in plumbing installations.",
  "1 = Vital Public Health Milestone Banishing Lead Poisoning from America's Drinking Water Faucets and Kitchen Sinks", "10 = Costly Mandates Imposing Massive Filtration Capital Upgrades on Struggling Small Rural Municipal Water Systems", 2, 8, 8, 1, 8, 1);

add(1986, "1986_epcra_toxics_release_inventory_tri", "Emergency Planning and Community Right-to-Know Act (EPCRA & Toxics Release Inventory)", "News", "1986 (EPCRA & TRI Enactment)", "Energy & Climate", 1,
  "Enacting EPCRA post-Bhopal requiring manufacturing facilities to publicly disclose annual releases of hundreds of toxic chemicals, creating the public TRI database.",
  "1 = Revolutionary Sunlight Empowering Everyday Citizens and Neighborhoods to Hold Corporate Chemical Polluters Accountable", "10 = Burdensome Paperwork Mandate Forcing Proprietary Chemical Formulas into the Public Record, Aiding Foreign Competitors", 2, 8, 8, 1, 8, 1);

add(1986, "1986_superfund_sara_8_5_billion_expansion", "Superfund Amendments and Reauthorization Act of 1986 (SARA - $8.5 Billion)", "News", "1986 (SARA Superfund Expansion)", "Energy & Climate", 1,
  "Expanding Superfund five-fold to $8.5 billion, establishing strict permanent cleanup standards, settlement tools, and expanding corporate environmental taxes.",
  "1 = Vital Multi-Billion Dollar Commitment Speeding Up Toxic Remediations and Forcing Polluters to Restore Poisoned Communities", "10 = Enormous Tax Increase on American Petroleum and Chemical Manufacturing Sinking Billions into Trial Lawyer Litigation", 2, 8, 9, 1, 8, 1);

add(1986, "1986_commercial_motor_vehicle_safety_act_cdl", "Enactment of the Commercial Motor Vehicle Safety Act of 1986 (Creation of Federal CDL)", "News", "1986 (CDL System Enactment)", "Technology & Infrastructure", 2,
  "Establishing single nationwide Commercial Driver's License (CDL) testing and clearinghouse to halt dangerous truck drivers from holding multiple state licenses.",
  "1 = Indispensable Highway Safety Reform Clearing Incompetent and Intoxicated Commercial Truck Drivers from Interstate Highways", "10 = Sound Standardization Ensuring Commercial Trucking Competency While Avoiding Excessive Federal Driver Disqualifications", 2, 7, 7, 1, 7, 1);

add(1986, "1986_electronic_communications_privacy_act_ecpa", "Enactment of the Electronic Communications Privacy Act of 1986 (ECPA)", "News", "1986 (ECPA Email Privacy Enacted)", "Governance & Judiciary", 1,
  "Extending federal wiretap and privacy protections to computer communications, early electronic mail (email), paging systems, and cellular telephone calls.",
  "1 = Vital Modernization Shielding Citizens' Private Digital Communications and Electronic Mail from Warrantless Government Eavesdropping", "10 = Technical Privacy Framework That Must Ensure Law Enforcement Retains Practical Digital Subpoena Tools to Track Cybercriminals", 2, 8, 2, 1, 8, 1);

add(1986, "1986_goldwater_nichols_defense_reorganization_act", "Enactment of the Goldwater-Nichols Department of Defense Reorganization Act", "News", "1986 (Goldwater-Nichols Enactment)", "Foreign Policy & Defense", 1,
  "Sweeping reorganization of the Pentagon, elevating the Chairman of the Joint Chiefs of Staff to principal military adviser and establishing unified joint commands.",
  "1 = Brilliant Landmark Reform Demolishing Wasteful Inter-Service Rivalries and Ensuring Unified Military Command and Tactical Success", "10 = Centralizing Unprecedented Power in a Single Chairman, Eroding Traditional Civilian Secretarial Oversight of the Services", 2, 8, 7, 1, 8, 1);

add(1986, "1986_false_claims_act_qui_tam_amendments", "False Claims Act Amendments of 1986 (Empowering Qui Tam Whistleblowers)", "News", "1986 (False Claims Qui Tam Revitalization)", "Governance & Judiciary", 1,
  "Revitalizing the Civil War Lincoln Law to allow private citizens to sue fraudulent government contractors on behalf of the Treasury and retain up to 30% of recoveries.",
  "1 = Spectacular Anti-Corruption Weapon Recovering Billions in Defrauded Taxpayer Dollars from Crooked Defense and Healthcare Contractors", "10 = Unleashing Bounty-Hunting Whistleblower Litigators Shaking Down Legitimate Defense Contractors Over Innocent Invoicing Disputes", 2, 8, 8, 1, 8, 1);

add(1986, "1986_operation_el_dorado_canyon_libya_bombing", "Operation El Dorado Canyon: U.S. Airstrikes on Gadhafi's Libya", "News", "1986 (Libya Bombing Operation)", "Foreign Policy & Defense", 1,
  "Reagan ordering 66 Air Force and Navy aircraft to bomb Tripoli and Benghazi in direct retaliation for the Libyan-sponsored La Belle disco bombing in Berlin.",
  "1 = Unilateral Military Escalation Risking Retaliatory International Terrorism and Violating the War Powers Resolution", "10 = Decisive, Justified Military Retaliation Striking at the Heart of Gadhafi's Terror State and Demonstrating Superpower Resolve", 2, 9, 4, 1, 9, 1);

add(1986, "1986_philippine_people_power_revolution_marcos_falls", "Philippine People Power Revolution & U.S. Pressure on Ferdinand Marcos", "News", "1986 (Marcos Falls in Philippines)", "Foreign Policy & Defense", 1,
  "Millions of Filipinos taking to the streets behind Corazon Aquino; Reagan administration pressures longstanding dictator Ferdinand Marcos to board USAF jet and flee.",
  "1 = Inspiring Triumph of Peaceful Democratic Courage Over Corrupt Autocracy Supported by Principled American Diplomacy", "10 = Prudent Transition Orchestrated to Protect Vital Subic Bay and Clark Air Bases from Radical Communist NPA Insurgents", 2, 8, 4, 1, 8, 1);

add(1986, "1986_ivan_boesky_dennis_levine_insider_trading", "Ivan Boesky & Dennis Levine Wall Street Insider Trading Scandals", "News", "1986 (Boesky Wall Street Scandal)", "Economy & Taxation", 1,
  "Wall Street arbitrageur Ivan Boesky paying $100M penalty and pleading guilty to insider trading based on tips from Dennis Levine, exposing rampant Gilded Age financial greed.",
  "1 = Graphic Indictment of Gilded Age Wall Street Predator Capitalism Profiteering by Cheating Ordinary Investors", "10 = Vigorously Prosecute Individual Felons While Preserving the Fluidity and Liquidity of American Free-Market Capital Markets", 2, 8, 8, 1, 8, 1);

add(1986, "1986_surgeon_general_koop_aids_report", "Surgeon General C. Everett Koop's Landmark Report on AIDS", "News", "1986 (Koop AIDS Report)", "Healthcare", 1,
  "Conservative evangelical Surgeon General Koop defying right-wing ideologues to issue explicit 36-page report urging comprehensive sex education, condom use, and empathy for AIDS patients.",
  "1 = Heroic, Compassionate Biomedical Leadership Placing Scientific Truth and Human Lives Above Moralistic Bigotry", "10 = Promotes Condom Use and Early Classroom Sex Education That Undermine Traditional Christian Abstinence and Family Teaching", 2, 8, 4, 1, 9, 1);

add(1986, "1986_oil_price_collapse_of_1986", "1986 Global Crude Oil Price Collapse (Crude Plunges from $30 to $10/Barrel)", "News", "1986 (Oil Patch Collapse)", "Energy & Climate", 1,
  "Saudi Arabia flooding world markets with crude oil, crashing prices by 67%, bringing cheap gasoline to American motorists but devastating Texas, Oklahoma, and Louisiana oil economies.",
  "1 = Welcome Consumer Windfall Lowering Fuel Costs for American Families, Though Emergency Adjustment Is Needed for Oil Patch Workers", "10 = Devastating Catastrophe for the American Independent Oil Industry Sinking Drilling Rigs and Triggering Bank Failures", 2, 8, 10, 1, 8, 1);

add(1986, "1986_california_proposition_65_toxic_ballot", "California Voters Enact Proposition 65 (Safe Drinking Water & Toxic Warning Act)", "News", "1986 (Prop 65 Toxic Ballot Enacted)", "Energy & Climate", 1,
  "California voters passing Prop 65 by 63% majority, prohibiting businesses from discharging carcinogens into drinking water and requiring cancer warning labels.",
  "1 = Groundbreaking Grassroots Environmental Milestone Forcing Corporations to Purge Cancer-Causing Chemicals from Consumer Products", "10 = Absurd Warning Label Overkill Diluting Real Consumer Risk Warnings and Fueling Frivolous Shakedown Bounty Lawsuits", 2, 8, 8, 1, 8, 1);

add(1986, "1986_rehnquist_chief_justice_scalia_confirmed", "William Rehnquist Confirmed Chief Justice & Antonin Scalia Confirmed (98-0)", "News", "1986 (Rehnquist & Scalia Confirmations)", "Governance & Judiciary", 1,
  "Senate confirming Rehnquist as Chief Justice despite civil rights protests, and confirming brilliant conservative Antonin Scalia 98-0, launching the modern conservative Court era.",
  "1 = Troubling Right-Wing Shift Stacking the Nation's Highest Court with Hostile Foes of Civil Rights and Federal Regulatory Protections", "10 = Historic Milestone Restoring Principled Judicial Originalism, Textualism, and Strict Constructionism to the Constitution", 2, 10, 7, 1, 10, 1);

add(1986, "1986_fers_federal_employees_retirement_system", "Federal Employees' Retirement System Act of 1986 (FERS / Thrift Savings Plan)", "News", "1986 (FERS & TSP Creation)", "Governance & Judiciary", 2,
  "Replacing defined-benefit CSRS for new federal employees with three-tiered FERS including Social Security, a modest annuity, and the 401(k)-style Thrift Savings Plan (TSP).",
  "1 = Progressive Modernization Integrating Federal Civil Servants into Social Security While Offering Modern Investment Choice", "10 = Sound Fiduciary Reform Reducing Long-Term Federal Pension Liabilities and Introducing Defined-Contribution Personal Savings", 2, 8, 8, 1, 8, 1);

add(1986, "1986_lihtc_low_income_housing_tax_credit", "Tax Reform Act of 1986 Creates the Low-Income Housing Tax Credit (LIHTC)", "News", "1986 (LIHTC Inception)", "Labor & Welfare", 2,
  "Creating Section 42 LIHTC, providing federal tax credits to private equity investors to construct affordable rental housing for low-income working families.",
  "1 = Innovative Public-Private Partnership Financing Hundreds of Thousands of Decent Affordable Apartments for Working Families", "10 = Free-Market Tax Incentive Utilizing Private Capital Discipline Rather Than Inefficient Direct Federal Public Housing Bureaucracies", 2, 8, 9, 2, 8, 1);

add(1986, "1986_asbestos_hazard_emergency_response_act_ahera", "Enactment of the Asbestos Hazard Emergency Response Act of 1986 (AHERA)", "News", "1986 (AHERA School Asbestos Enacted)", "Healthcare", 1,
  "Directing EPA to establish rules requiring all local public and private elementary/secondary schools to inspect buildings for friable asbestos and implement management plans.",
  "1 = Imperative Moral Protection Safeguarding Millions of Schoolchildren and Teachers from Deadly Carcinogenic Asbestos Fibers", "10 = Panicked Federal Mandate Forcing Cash-Strapped School Districts to Spend Billions Removing Asbestos That Posed Zero Active Threat", 2, 8, 8, 1, 8, 1);

add(1986, "1986_stinger_missiles_afghan_mujahideen", "Reagan Decision to Supply Shoulder-Fired Stinger Missiles to Afghan Mujahideen", "News", "1986 (Stinger Missiles to Mujahideen)", "Foreign Policy & Defense", 1,
  "CIA shipping hundreds of heat-seeking Stinger surface-to-air missiles to Afghan rebels, decimating Soviet Hind attack helicopters and breaking Soviet air control.",
  "1 = Brilliant Geopolitical Stroke Turning the Tide in the Cold War and Forcing the Red Army into Strategic Defeat in Afghanistan", "10 = Immense Cold War Victory, Provided Stringent Safeguards Prevent High-Tech Stingers from Falling into Terrorist Hands Later", 2, 9, 4, 1, 9, 1);

add(1986, "1986_uocava_military_overseas_absentee_voting", "Uniformed and Overseas Citizens Absentee Voting Act of 1986 (UOCAVA)", "News", "1986 (UOCAVA Enactment)", "Governance & Judiciary", 2,
  "Federal statute guaranteeing all active-duty military personnel, their families, and American citizens residing abroad the right to register and vote absentee in federal elections.",
  "1 = Sacred Democratic Duty Ensuring the Brave Men and Women Defending Our Nation Overseas Can Exercise Their Right to Vote", "10 = Bipartisan Triumph Securing Absentee Balloting for Our Armed Forces Standing Sentinel for Freedom Across the Globe", 2, 8, 5, 1, 8, 1);

add(1986, "1986_gramm_rudman_hollings_automatic_sequester", "Gramm-Rudman-Hollings Balanced Budget Act & Bowsher v. Synar Supreme Court", "News", "1985-1986 (Gramm-Rudman & Bowsher Ruling)", "Economy & Taxation", 1,
  "Statute mandating annual deficit targets enforced by automatic across-the-board spending sequesters; Supreme Court strikes down Comptroller General's role in Bowsher.",
  "1 = Automatic Spending Cleaver Threatening Vital Domestic Social Programs; Deficits Must Be Closed by Fair Corporate Taxation", "10 = Crucial Fiscal Straitjacket Forcing Spendthrift Congressional Politicians to Live Within Their Means or Face Automatic Cuts", 2, 9, 10, 1, 9, 1);

add(1986, "1986_japanese_semiconductor_dram_trade_agreement", "U.S.-Japan Semiconductor Agreement (Banning DRAM Dumping & 20% Foreign Target)", "News", "1986 (Semiconductor Trade Pact)", "Economy & Taxation", 1,
  "Reagan administration forcing Tokyo to sign accord halting predatory dumping of computer memory chips (DRAM) and targeting 20% foreign share in the Japanese chip market.",
  "1 = Essential Defense of Silicon Valley High-Tech Manufacturing from Subsidized Predatory Japanese Commercial Aggression", "10 = Unorthodox Managed-Trade Quota Compromising Free-Market Principles and Driving Up Computer Prices for American PC Makers", 2, 8, 9, 1, 8, 1);

add(1986, "1986_national_childhood_vaccine_injury_act", "Enactment of the National Childhood Vaccine Injury Act of 1986 (Vaccine Court)", "News", "1986 (Vaccine Injury Act Enacted)", "Healthcare", 1,
  "Creating no-fault National Vaccine Injury Compensation Program funded by an excise tax on vaccines to shield manufacturers from catastrophic liability and maintain vaccine supply.",
  "1 = Balanced Compromise Compensating Injured Children Fairly While Ensuring Drug Companies Continue Manufacturing Life-Saving Vaccines", "10 = Corporate Legal Immunity Shielding Big Pharma from Jury Accountability While Limiting Damaged Families to Administrative Court", 2, 8, 9, 1, 8, 1);

add(1986, "1986_age_discrimination_employment_mandatory_retirement", "Age Discrimination in Employment Act Amendments of 1986 (Abolishing Mandatory Retirement)", "News", "1986 (Mandatory Retirement Abolished)", "Civil Rights & Social Issues", 1,
  "Federal statute eliminating mandatory retirement ages for most American private and public-sector workers, affirming the right of healthy older Americans to keep working.",
  "1 = Historic Civil Rights Milestone Ending Arbitrary Age Discrimination and Valuing the Wisdom and Productivity of Senior Workers", "10 = Common-Sense Freedom of Enterprise Recognizing That Competence, Not Arbitrary Birthdays, Dictates Job Fitness", 2, 8, 8, 1, 8, 1);

add(1986, "1986_water_resources_development_act_wrda", "Water Resources Development Act of 1986 (WRDA - Local Cost-Sharing)", "News", "1986 (WRDA Cost-Sharing Revolution)", "Technology & Infrastructure", 2,
  "Overhauling Army Corps of Engineers projects to mandate non-federal local sponsors contribute up to 50% matching funds for harbor dredging and flood control.",
  "1 = Revolutionary Fiscal Discipline Ending 100 Years of Runaway Congressional Pork-Barrel Navigation Giveaways", "10 = Realistic Cost-Sharing Prioritizing High-Value Commercial Ports While Reining In Unaccountable Federal Infrastructure Spending", 2, 8, 9, 1, 8, 1);

add(1986, "1986_farm_aid_ii_and_heartland_foreclosures", "Farm Aid II Benefit Concert in Austin & Continuing Farm Foreclosure Crisis", "News", "1986 (Farm Aid II Mobilization)", "Agriculture & Food", 1,
  "Willie Nelson, Neil Young, and Bob Dylan mobilizing 70,000 concertgoers to raise emergency legal aid for tens of thousands of Midwestern family farmers losing generational homesteads.",
  "1 = Heartbreaking Tragedy Demanding Immediate Federal Debt Forgiveness, Price Supports, and Moratoriums on Evicting Family Farmers", "10 = Respect Heartfelt Charitable Aid While Acknowledging That Free-Market Agriculture Must Modernize Beyond Over-Indebted Margins", 2, 8, 8, 1, 8, 1);

add(1986, "1986_corporate_leveraged_buyout_lbo_junk_bonds", "Wave of Hostile Leveraged Buyouts (LBOs) Financed by Drexel Burnham Junk Bonds", "News", "1986 (Junk Bond Takeover Frenzy)", "Economy & Taxation", 1,
  "Corporate raiders like Carl Icahn and T. Boone Pickens using Michael Milken's high-yield junk bonds to mount hostile debt-financed takeovers of storied industrial conglomerates.",
  "1 = Destructive Wall Street Cannibalism Dismantling Sound American Corporations, Gutting R&D, and Laying Off Tens of Thousands of Workers", "10 = Creative Destruction Squeezing Out Lazy, Complacent Corporate Management and Unlocking Massive Shareholder Value", 2, 8, 10, 2, 8, 1);

add(1986, "1986_delta_180_sdi_kinetic_intercept_test", "SDI Delta 180 Kinetic Intercept Test in Space (First Successful Space Hit)", "News", "1986 (SDI Kinetic Intercept Test)", "Foreign Policy & Defense", 2,
  "Strategic Defense Initiative Organization successfully executing first space-to-space kinetic impact test, destroying a mock ballistic missile stage at 6,000 mph.",
  "1 = Staged High-Cost Weaponry Demonstration Exaggerated for PR That Will Provoke Dangerous Soviet Countermeasures", "10 = Historic Technical Breakthrough Proving Missile Defense Works and Bringing America Closer to a Space-Based Defensive Shield", 2, 9, 5, 1, 9, 1);

add(1986, "1986_lawn_darts_ban_cpsc_safety_campaign", "CPSC National Campaign and Petitions to Completely Ban Jarts (Lawn Darts)", "News", "1986-1988 (Lawn Darts Hazard Campaign)", "Healthcare", 3,
  "Following the death of 7-year-old Michelle Snow, parents lobby CPSC to ban heavy steel-tipped lawn darts responsible for 6,100 emergency room injuries.",
  "1 = Common-Sense Child Safety Action Banning Lethal Steel-Tipped Projectiles Sold as Backyard Toys That Impale Children", "10 = Classic Nanny-State Overreach Punishing Millions of Responsible Families for Flawed Parental Supervision", 2, 7, 9, 1, 8, 1);

add(1986, "1986_federal_debt_crosses_two_trillion", "Gross Federal Public Debt Crosses $2 Trillion (Doubling Under Reagan)", "News", "1986 (Debt Crosses $2 Trillion)", "Economy & Taxation", 1,
  "National debt doubling in five years from $997 billion to over $2 trillion, driven by defense buildup and tax cuts, sparking Wall Street debt alarms.",
  "1 = Irrefutable Indictment of Supply-Side Voodoo Economics Bleeding the Future of America's Children with Historic Borrowing", "10 = The Debt Succeeded in Defeating Inflation, Rebuilding the Military, and Revitalizing Economic Growth; Cut Domestic Spending Now", 2, 9, 10, 1, 9, 1);

add(1986, "1986_child_abuse_victims_rights_act", "Enactment of the Child Abuse Victims' Rights Act of 1986", "News", "1986 (Child Abuse Victims Rights)", "Civil Rights & Social Issues", 2,
  "Allowing victims of child pornography and sexual abuse to file federal civil damages suits against commercial producers and traffickers.",
  "1 = Powerful Weapon Providing Civil Remedies and Financial Justice for Exploited Child Victims Against Sick Commercial Predators", "10 = Sound Civil Justice Mechanism Bankrupting Child Pornographers and Demolishing the Illicit Abuse Industry", 2, 8, 6, 1, 8, 1);

add(1986, "1986_export_import_bank_tied_aid_war_chest", "Export-Import Bank Act Amendments of 1986 ($300 Million Tied-Aid War Chest)", "News", "1986 (Ex-Im Tied-Aid War Chest)", "Economy & Taxation", 2,
  "Creating a $300M fund to counter aggressive subsidized export financing offered by French and Japanese governments to commercial exporters.",
  "1 = Essential Weapon Defending American Capital Goods Manufacturers from Predatory Foreign Subsidized Trade Packages", "10 = Wasteful Crony Capitalism 'Bank of Boeing' Subsidizing Massive Multinational Corporations with Taxpayer Credit", 2, 8, 9, 1, 8, 1);

add(1986, "1986_deep_seabed_mining_reciprocal_states", "U.S. Reciprocal Agreements with Western Allies on Deep Seabed Ocean Mining", "News", "1986 (Deep Seabed Mining Accord)", "Energy & Climate", 3,
  "Signing bilateral mining pacts with Britain, France, and West Germany bypassing the UN Law of the Sea treaty to exploit seabed manganese nodules.",
  "1 = Blatant Unilateral Enclosure of the 'Common Heritage of Mankind' in Violation of Developing World International Treaties", "10 = Reaffirm Sovereign Freedom of the Seas Allowing Private Free Enterprise to Extract Strategic Deep-Sea Minerals Free from UN Socialism", 2, 8, 9, 1, 9, 1);

add(1986, "1986_surface_freight_shipping_deregulation_push", "Federal Push to Complete the Total Deregulation of Surface Freight Forwarders", "News", "1986 (Surface Freight Deregulation)", "Technology & Infrastructure", 3,
  "Congress passing legislation sunsetting remaining ICC rate-filing requirements for domestic freight forwarders and shippers.",
  "1 = Streamline Logistics Regulations, Provided Independent Small Truckers Retain Access to Fair Shipper Clearing", "10 = Splendid Free-Market Deregulation Eliminating Obsolete Red Tape in Interstate Commerce Logistics", 2, 7, 10, 2, 7, 1);

add(1986, "1986_minimum_wage_stagnation_at_three_thirty_five", "Debates Over Federal Minimum Wage Remaining Frozen at $3.35 per Hour", "News", "1986 (Minimum Wage Stagnation)", "Labor & Welfare", 1,
  "Minimum wage stuck at $3.35 since 1981, losing 25% of its real purchasing power to inflation as Democratic labor leaders demand an increase to $4.65.",
  "1 = Cruel Neglect Allowing the Wages of Millions of Hardworking Janitors, Cooks, and Cashiers to Decay Below the Poverty Line", "10 = Keeping Entry-Level Wages Flexible Has Created Millions of Real Jobs; Raising the Minimum Wage Will Fuel Inflation and Unemployment", 2, 8, 9, 1, 9, 1);

add(1986, "1986_nuclear_testing_verification_debates", "House Approves Nuclear Testing Ban Measure (Reagan Administration Resistance)", "News", "1986 (Nuclear Test Ban Legislation)", "Foreign Policy & Defense", 1,
  "House passing measure to bar nuclear test explosions over 1 kiloton contingent on Soviet reciprocity; Reagan resists, arguing underground testing is vital for warhead safety.",
  "1 = Crucial Step Toward a Comprehensive Test Ban Treaty Halting the Development of Destabilizing Next-Generation Warheads", "10 = Disastrous Legislative Constraint That Would Prevent Essential Warhead Reliability Testing and Cripple SDI Research", 2, 9, 4, 1, 9, 1);

add(1986, "1986_tax_exempt_industrial_bonds_curbs", "TRA 86 Restrictions on Private Activity Tax-Exempt Municipal Bonds", "News", "1986 (Private Activity Bond Restrictions)", "Economy & Taxation", 2,
  "Imposing strict state volume caps on tax-exempt private activity bonds to halt wealthy developers from using municipal subsidies for shopping malls and sports stadiums.",
  "1 = Essential Tax Equity Stopping Millionaire Developers from Abusing Public Debt Subsidies for Private Golf Courses and Stadiums", "10 = Overreaching Federal Restrictions Paralyzing Innovative Local Municipal Economic Development and Private Job Creation", 2, 8, 9, 1, 8, 1);

add(1986, "1986_haitian_dictatorship_falls_baby_doc_flees", "Fall of Haitian Dictator Jean-Claude 'Baby Doc' Duvalier", "News", "1986 (Duvalier Falls in Haiti)", "Foreign Policy & Defense", 2,
  "Popular uprising toppling the 28-year brutal Duvalier family dictatorship; U.S. flies Baby Doc into exile in France, opening turbulent democratic hopes in Port-au-Prince.",
  "1 = Welcome Liberation Ending Decades of Brutal Human Rights Terror and Kleptocracy Supported by Cold War Realpolitik", "10 = Support Democratic Stability While Ensuring Leftist Marxist Agitators Do Not Exploit the Chaos in the Caribbean Basin", 2, 8, 4, 1, 8, 1);

add(1986, "1986_robert_bork_d_c_circuit_rulings_preview", "Judge Robert Bork's D.C. Circuit Antitrust & Constitutional Jurisprudence", "News", "1986 (Bork Jurisprudence Spotlight)", "Governance & Judiciary", 2,
  "Appeals Judge Bork gaining national conservative prominence for originalist rulings and book 'The Antitrust Paradox', previewing his looming 1987 Supreme Court battle.",
  "1 = Extremist Ideologue Championing Gilded Age Monopolies and Denying Fundamental Constitutional Rights to Privacy and Civil Liberties", "10 = Intellectual Giant of Conservative Jurisprudence Grounded in Rigorous Constitutional Fidelity, Logic, and Original Meaning", 2, 10, 7, 1, 10, 1);

// =========================================================================
// 1988 (50 Issues)
// =========================================================================
add(1988, "1988_bush_read_my_lips_no_new_taxes_pledge", "George H.W. Bush's 'Read My Lips: No New Taxes' Convention Pledge", "News", "1988 (Bush No New Taxes Pledge)", "Economy & Taxation", 1,
  "Bush electrifying the New Orleans GOP Convention declaring: 'The Congress will push me to raise taxes, and I'll say no, and they'll push, and I'll say no, and they'll push again, and I'll say to them: Read my lips: no new taxes.'",
  "1 = Cynical Irresponsible Gimmick Pledging Endless Borrowing to Conceal the True Cost of Government from Voters", "10 = Ironclad Conservative Commitment Protecting Taxpayers from Spendthrift Congressional Democrats and Expanding Prosperity", 2, 10, 10, 1, 10, 1);

add(1988, "1988_willie_horton_revolving_door_furlough_ads", "Willie Horton Television Ads & Revolving-Door Prison Furlough Attacks", "News", "1988 (Willie Horton Campaign)", "Governance & Judiciary", 1,
  "Bush campaign and independent PACs airing hard-hitting ads highlighting convicted murderer Willie Horton raping a woman while on weekend furlough from a Massachusetts prison under Dukakis.",
  "1 = Disgraceful Racially Charged Smear Exploiting Visceral White Fear and Stereotypes to Demolish an Opponent", "10 = Legitimate Scrutiny Exposing Michael Dukakis's Dangerously Permissive Soft-on-Crime Record That Endangers Citizens", 2, 10, 7, 1, 10, 1);

add(1988, "1988_dukakis_m1_tank_photo_op_backlash", "Michael Dukakis M1 Abrams Tank Helmet Photo Opportunity Backlash", "News", "1988 (Dukakis Tank Photo Debacle)", "Foreign Policy & Defense", 1,
  "Dukakis riding in an M1 tank in Michigan wearing an oversized helmet to project military toughness, sparking widespread national ridicule used in devastating Bush TV attack ads.",
  "1 = Superficial Media Obsession with a Clumsy PR Photo Ignoring Dukakis's Substantive Defense and Procurement Reforms", "10 = Fatal Visual Proof That the Harvard Liberal Is Laughably Incompetent and Wholly Unfit to Be Commander-in-Chief", 2, 9, 5, 1, 9, 1);

add(1988, "1988_iran_air_flight_655_shootdown", "USS Vincennes Shoots Down Iranian Civilian Airliner (290 Dead)", "News", "1988 (Iran Air 655 Tragedy)", "Foreign Policy & Defense", 1,
  "U.S. Navy Aegis cruiser shooting down Iran Air Flight 655 over the Persian Gulf after mistaking the commercial Airbus for an attacking F-14 fighter, killing all 290 aboard.",
  "1 = Horrific Military Blunder Demanding Unconditional Official Apology, Restitution to Victims, and Immediate De-escalation", "10 = Tragic Wartime Accident Caused by Iranian Negligence Operating an Airliner Inside an Active Combat Zone Where Gunboats Attacked", 2, 8, 3, 1, 8, 1);

add(1988, "1988_pan_am_flight_103_lockerbie_bombing", "Terrorist Bombing of Pan Am Flight 103 Over Lockerbie, Scotland (270 Dead)", "News", "1988 (Lockerbie Bombing Tragedy)", "Foreign Policy & Defense", 1,
  "Barometric bomb exploding aboard Pan Am jumbo jet at 31,000 feet, killing 259 passengers (including 35 Syracuse University students) and 11 villagers on the ground in Lockerbie.",
  "1 = Horrific Barbaric Crime Demanding Uncompromising Worldwide Retaliation and Relentless Pursuit of the Terrorist State Sponsors", "10 = Deploy Overwhelming American Power and Severe Retaliatory Sanctions to Obliterate the Rogue Terrorist Regimes Responsible", 2, 8, 4, 1, 8, 1);

add(1988, "1988_james_hansen_nasa_climate_change_testimony", "James Hansen's Senate Testimony on Greenhouse Warming & 1988 Drought", "News", "1988 (Hansen Climate Warning)", "Energy & Climate", 1,
  "NASA scientist James Hansen testifying to Senate on a 99-degree June day that the greenhouse effect has been detected and is actively warming the planet amidst historic national heat and drought.",
  "1 = Urgent Scientific Awakening Demanding Worldwide Action, Carbon Caps, and Phasing Out Fossil Fuels Before Planetary Catastrophe", "10 = Alarmist Hypothesis Inappropriately Conflating a Natural Summer Drought with Long-Term Catastrophic Climate Cycles", 2, 8, 8, 1, 8, 1);

add(1988, "1988_historic_yellowstone_national_park_wildfires", "Historic Yellowstone National Park Wildfires (793,000 Acres Burned)", "News", "1988 (Yellowstone Wildfires)", "Energy & Climate", 1,
  "Historic drought sparking massive blazes burning one-third of America's first national park, igniting fierce debate over the Park Service's 'let-it-burn' natural wildfire policy.",
  "1 = Natural Ecological Rebirth Rejuvenating Old-Growth Lodgepole Forests and Nutrient Cycles; Nature Knows Best", "10 = Incompetent Bureaucratic Arrogance Letting America's Sacred National Treasure Burn to Ashes; Suppress Wildfires Immediately", 2, 8, 8, 1, 9, 1);

add(1988, "1988_anti_drug_abuse_act_drug_czar_enacted", "Anti-Drug Abuse Act of 1988 (Creation of ONDCP 'Drug Czar' & Death Penalty)", "News", "1988 (Drug Czar & Kingpin Death Penalty)", "Governance & Judiciary", 1,
  "Creating the Office of National Drug Control Policy (ONDCP), establishing the federal death penalty for drug-related murders, and expanding federal anti-drug grants.",
  "1 = Militarized Escalation of a Failed Drug War That Sinks Billions into Incarceration While Neglecting Treatment and Education", "10 = Uncompromising National Mobilization Marshaling Full Federal Power and the Ultimate Penalty to Demolish Drug Kingpins", 2, 9, 8, 1, 10, 1);

add(1988, "1988_civil_rights_restoration_act_veto_override", "Enactment of the Civil Rights Restoration Act of 1987/1988 (Veto Override)", "News", "1988 (Grove City Overturn Veto Override)", "Civil Rights & Social Issues", 1,
  "Congress overwhelmingly overriding Reagan's veto (292-133 in House, 73-24 in Senate) to overturn Grove City College and mandate institution-wide civil rights compliance for federal aid.",
  "1 = Historic Affirmation of Civil Rights Ensuring No Educational Institution May Discriminate While Receiving Federal Tax Dollars", "10 = Unwarranted Federal Power Grab Enforcing Intrusive Washington Mandates on Churches, Small Colleges, and Private Schools", 2, 8, 4, 1, 9, 1);

add(1988, "1988_medicare_catastrophic_coverage_act_enacted", "Enactment of the Medicare Catastrophic Coverage Act of 1988", "News", "1988 (Catastrophic Coverage Enacted)", "Healthcare", 1,
  "Historic expansion of Medicare covering unlimited hospital stays and outpatient prescription drugs, financed entirely by an income surtax on affluent seniors (up to $800/person).",
  "1 = Monumental Compassionate Expansion Shielding Elderly Retirees from Being Bankrupted by Catastrophic Illness and Expensive Drugs", "10 = Unfair Robin Hood Surtax Punishing Responsible, Prudent Seniors to Subsidize Federal Entitlements for Others", 2, 8, 9, 1, 9, 1);

add(1988, "1988_family_support_act_welfare_to_work_jobs", "Enactment of the Family Support Act of 1988 (JOBS Program Welfare Reform)", "News", "1988 (Family Support Act Enacted)", "Labor & Welfare", 1,
  "Moynihan-led bipartisan overhaul requiring states to enroll AFDC recipients in Job Opportunities and Basic Skills (JOBS) training programs and mandating child support genetic testing.",
  "1 = Landmark Compassionate Reform Transforming Welfare from a Stigmatized Handout into a Springboard for Employment and Independence", "10 = Inadequate Half-Measure Sinking Billions into Bureaucratic Training Without Real Time Limits or Strict Work Requirements", 2, 8, 8, 1, 9, 1);

add(1988, "1988_warn_act_sixty_day_plant_closing_notice", "Enactment of the Worker Adjustment and Retraining Notification (WARN) Act", "News", "1988 (WARN Act Effective)", "Labor & Welfare", 1,
  "Allowing bill to become law without Reagan's signature, requiring employers with 100+ workers to provide 60 days advance written notice of major plant closings or mass layoffs.",
  "1 = Fundamental Human Decency Giving Working Families and Communities Time to Prepare Before Their Lifeline Jobs Disappear", "10 = Rigid Government Intrusion Paralyzing Troubled Companies in Distress from Quickly Restructuring to Save Remaining Jobs", 2, 8, 9, 1, 9, 1);

add(1988, "1988_civil_liberties_act_japanese_reparations", "Civil Liberties Act of 1988 (Formal Apology & $20,000 Redress for Internees)", "News", "1988 (Japanese-American Redress)", "Civil Rights & Social Issues", 1,
  "Reagan signing legislation acknowledging the grave injustice of WWII Japanese-American internment, offering a formal national apology and $20,000 redress to each surviving internee.",
  "1 = Inspiring Moral Healing Acknowledging That Wartime Hysteria and Racism Trampled the Sacred Constitutional Rights of Citizens", "10 = Dangerous Precedent Awarding Taxpayer Reparations for Past Wartime Security Measures Exercised Under Constitutional Powers", 2, 8, 3, 1, 8, 1);

add(1988, "1988_medical_waste_tracking_act_syringe_tide", "Medical Waste Tracking Act of 1988 (Post-'Syringe Tide' Beach Closures)", "News", "1988 (Syringe Tide Waste Crisis)", "Healthcare", 1,
  "Enacting strict federal tracking of infectious medical waste after thousands of hypodermic needles, blood vials, and bandages washed ashore on New Jersey and Long Island beaches.",
  "1 = Imperative Protection Halting Illegal Midnight Dumping of Biohazardous Hospital Waste on Public Recreational Beaches", "10 = Heavy Bureaucratic Red Tape Forcing Burdensome Manifest Systems on Small Medical Clinics and Dental Offices", 2, 8, 8, 1, 8, 1);

add(1988, "1988_omnibus_trade_act_super_301_sanctions", "Omnibus Trade and Competitiveness Act of 1988 (Super 301 Trade Retaliation)", "News", "1988 (Super 301 Trade Enacted)", "Economy & Taxation", 1,
  "Establishing aggressive 'Super 301' powers requiring the U.S. Trade Representative to identify and penalize countries maintaining systematic unfair barriers against U.S. exports.",
  "1 = Essential Weapon Defending American Manufacturing and Workers from Mercantilist Foreign Trade Barriers and Cheating", "10 = Destructive Unilateral Protectionism Provoking Retaliatory Trade Wars That Will Harm American Agricultural Exporters", 2, 8, 9, 1, 8, 1);

add(1988, "1988_us_canada_free_trade_agreement_ratification", "Ratification of the U.S.-Canada Free Trade Agreement (CFTA)", "News", "1988 (CFTA Ratification)", "Economy & Taxation", 1,
  "Historic bilateral agreement phasing out all tariffs between the world's two largest trading partners over 10 years, serving as the blueprint for NAFTA.",
  "1 = Welcome Bilateral Integration Expanding Export Markets for American Capital Goods, Provided Environmental Standards Are Upheld", "10 = Visionary Triumph for Free Enterprise Creating a Continental Free Trade Zone and Accelerating Economic Growth", 2, 8, 10, 1, 8, 1);

add(1988, "1988_inf_treaty_ratification_senate_vote", "Senate Ratification of the Intermediate-Range Nuclear Forces (INF) Treaty (93-5)", "News", "1988 (INF Treaty Ratified)", "Foreign Policy & Defense", 1,
  "Senate overwhelmingly approving treaty with the USSR eliminating an entire class of ground-launched ballistic and cruise missiles (2,692 missiles destroyed) with on-site inspections.",
  "1 = Historic Watershed Proving Ronald Reagan and Mikhail Gorbachev Could Safely Reverse the Deadly Thermonuclear Arms Race", "10 = Tremendous Triumph of Peace Through Strength: Reagan's Resolute Pershing Deployment Forced Moscow to Eliminate Its Entire SS-20 Force", 2, 8, 4, 1, 8, 1);

add(1988, "1988_morrison_v_olson_independent_counsel_upheld", "Morrison v. Olson Supreme Court Ruling (7-1 Upholding Independent Counsel)", "News", "1988 (Morrison v. Olson Decision)", "Governance & Judiciary", 1,
  "Supreme Court upholding the Ethics in Government Act's independent counsel mechanism; Justice Scalia writes legendary sole dissent warning that 'this wolf comes as a wolf.'",
  "1 = Essential Post-Watergate Check Guaranteeing Impartial, Independent Prosecution of Executive Branch Criminal Corruption", "10 = Scalia Was Right: An Unaccountable Prosecutor with Unlimited Budgets Destroys the Separation of Powers and Invites Political Persecution", 2, 8, 3, 1, 8, 1);

add(1988, "1988_hazelwood_v_kuhlmeier_school_press_censorship", "Hazelwood School District v. Kuhlmeier (Public School Newspaper Censorship)", "News", "1988 (Hazelwood Free Speech Ruling)", "Education", 1,
  "Supreme Court ruling 5-3 that public school administrators have broad authority to censor school-sponsored student newspapers for legitimate pedagogical reasons.",
  "1 = Chilling Judicial Attack on Student Free Expression Teaching Young Journalists That Truth Can Be Suppressed by Authority", "10 = Common-Sense Decision Upholding Principal and Educator Authority to Ensure School Publications Reflect Community Standards", 2, 8, 4, 1, 9, 1);

add(1988, "1988_hustler_magazine_v_falwell_first_amendment", "Hustler Magazine v. Falwell Supreme Court Ruling (First Amendment Satire)", "News", "1988 (Hustler v. Falwell Parody Ruling)", "Governance & Judiciary", 1,
  "Supreme Court ruling unanimously (Rehnquist opinion) that public figures cannot recover emotional distress damages for outrageous political parodies protected by First Amendment.",
  "1 = Bedrock Victory for Free Speech Protecting Satirists, Editorial Cartoonists, and Public Discourse from Ruinous Libel Lawsuits", "10 = Repugnant Decision Forcing Christian Pastors and Public Servants to Endure Sick, Pornographic Defamation Free from Legal Remedy", 2, 8, 1, 1, 8, 1);

add(1988, "1988_robert_bork_supreme_court_defeat_aftermath", "Senate Rejection of Robert Bork's Supreme Court Nomination (58-42 Vote)", "News", "1987-1988 (Bork Nomination Battle)", "Governance & Judiciary", 1,
  "Senate defeating Judge Bork's nomination following ferocious campaign by civil rights and feminist groups over his originalist views, coining the term 'to bork'.",
  "1 = Principled Defense of Constitutional Rights Saving the Nation from a Radical Reactionary Who Would Overturn Civil Rights and Privacy", "10 = Disgraceful Partisan Character Assassination and Slander That Poisoned the Supreme Court Confirmation Process for Generations", 2, 10, 6, 1, 10, 1);

add(1988, "1988_anthony_kennedy_unanimous_supreme_court", "Anthony Kennedy Confirmed Unanimously (97-0) to the Supreme Court", "News", "1988 (Anthony Kennedy Confirmation)", "Governance & Judiciary", 1,
  "Senate confirming moderate California conservative Anthony Kennedy to fill the Powell vacancy following the Bork defeat and Douglas Ginsburg marijuana withdrawal.",
  "1 = Dignified, Thoughtful Jurist Who Will Guard the Delicate Balance of Precedent, Individual Liberty, and Free Speech on the Court", "10 = Respected Conservative Jurist Confirmed with Decisive Bipartisan Support to Restore Constitutional Fidelity to the Bench", 2, 8, 5, 1, 8, 1);

add(1988, "1988_dan_quayle_vp_nomination_and_bentsen_debate", "Dan Quayle VP Pick & Lloyd Bentsen Debate Takedown ('You're No Jack Kennedy')", "News", "1988 (Quayle-Bentsen VP Debate)", "Governance & Judiciary", 1,
  "Bush shocking observers by picking youthful Indiana Senator Dan Quayle; in VP debate, Bentsen responds to Quayle's JFK comparisons: 'Senator, you're no Jack Kennedy.'",
  "1 = Devastating Exposure of an Inexperienced, Lightweight Partisan Wholly Unprepared to Be a Heartbeat Away from the Presidency", "10 = Coached Soundbite Attack Inappropriately Belittling a Talented, Dynamic Young Conservative Dedicated to Defense and Jobs", 2, 9, 5, 1, 9, 1);

add(1988, "1988_boston_harbor_pollution_attacks_dukakis", "George H.W. Bush's 'Boston Harbor Is the Dirtiest Harbor' Campaign Attacks", "News", "1988 (Boston Harbor Pollution Attacks)", "Energy & Climate", 1,
  "Bush staging boat tour of sewage-choked Boston Harbor, branding Dukakis an environmental hypocrite who presided over the dirtiest harbor in America.",
  "1 = Cynical Political Stunt Distorting Dukakis's Multi-Billion Dollar Boston Harbor Cleanup Project Backed by Court Orders", "10 = Devastatingly Effective Reality Check Exposing Liberal Governance Hypocrisy: Great Speeches, Filthy Reality at Home", 2, 9, 7, 1, 9, 1);

add(1988, "1988_ocean_dumping_ban_act_of_1988", "Enactment of the Ocean Dumping Ban Act of 1988", "News", "1988 (Ocean Dumping Ban Enacted)", "Energy & Climate", 1,
  "Prohibiting all ocean dumping of municipal sewage sludge and industrial chemical waste into the Atlantic Ocean after December 31, 1991.",
  "1 = Essential Milestone Ending Decades of Using America's Coastal Oceans and Fisheries as Open Industrial Sewers", "10 = Sound Environmental Ban, Provided Adequate Federal Transition Assistance Helps Coastal Cities Build Land Disposal Facilities", 2, 8, 8, 1, 8, 1);

add(1988, "1988_department_of_veterans_affairs_act", "Enactment of the Department of Veterans Affairs Act (Elevating VA to Cabinet)", "News", "1988 (VA Cabinet Status Enacted)", "Governance & Judiciary", 2,
  "Reagan signing legislation elevating the Veterans Administration to the 14th Cabinet department, giving 27 million veterans a direct voice at the Cabinet table.",
  "1 = Noble Elevation Honoring the Sacred Sacrifices of Our Nation's Combat Veterans and Prioritizing VA Hospital Healthcare", "10 = Symbolic Expansion of the Federal Cabinet Bloat That Does Nothing to Fix Underlying Inefficiencies in VA Bureaucracy", 2, 8, 8, 1, 8, 1);

add(1988, "1988_fair_housing_amendments_act", "Enactment of the Fair Housing Amendments Act of 1988 (Disability & Families)", "News", "1988 (Fair Housing Expansion)", "Civil Rights & Social Issues", 1,
  "Expanding the 1968 Fair Housing Act to prohibit discrimination based on disability and familial status (children), and creating HUD administrative law judge enforcement.",
  "1 = Historic Civil Rights Milestone Opening Modern Housing Opportunities for Disabled Citizens and Families with Young Children", "10 = Overreaching Federal Mandates Restricting Private Landlords and Imposing Burdensome Architectural Retrofit Mandates", 2, 8, 6, 1, 8, 1);

add(1988, "1988_michael_milken_drexel_burnham_indictment", "Rudy Giuliani's Indictment of Drexel Burnham Lambert & Michael Milken", "News", "1988 (Milken Junk Bond Indictment)", "Economy & Taxation", 1,
  "Federal prosecutors filing 98-count racketeering and securities fraud indictment against 'Junk Bond King' Milken and Drexel Burnham Lambert, shaking Wall Street.",
  "1 = Long-Overdue Justice Squeezing Out Rotten Financial Greed, Manipulation, and Predatory Raider Crimes on Wall Street", "10 = Overzealous Criminalization of Complex Wall Street Financing That Created Capital for Disruptive Cable and Telecom Innovators", 2, 8, 8, 1, 8, 1);

add(1988, "1988_fslic_insolvency_savings_and_loan_crisis", "Federal Savings & Loan Insurance Corporation (FSLIC) Formally Declared Insolvent", "News", "1988 (FSLIC Insolvency Crisis)", "Economy & Taxation", 1,
  "Bank board declaring the thrift insurance fund insolvent by $75 billion as hundreds of deregulated S&Ls collapse across the Sun Belt; massive taxpayer bailout looms.",
  "1 = Catastrophic Proof That Reagan's Free-Market Deregulation Unleashed Unchecked S&L Cronyism, Fraud, and Looting of Taxpayers", "10 = The Disaster Stemmed from Inflation Indexing, Delaying Decisive Closure of Insolvent Thrifts, and Moral Hazard Guarantees", 2, 8, 10, 1, 9, 2);

add(1988, "1988_agricultural_credit_act_farm_bailout", "Agricultural Credit Act of 1987/1988 ($4 Billion Farm Credit System Bailout)", "News", "1988 (Farm Credit Bailout Enacted)", "Agriculture & Food", 1,
  "Authorizing a $4 billion federal bond package to recapitalize insolvent Farm Credit System cooperative banks and establishing statutory borrower debt restructuring rights.",
  "1 = Vital Compassionate Rescue Halting Agricultural Foreclosures and Saving America's Generational Family Farm Credit Backbone", "10 = Multi-Billion Dollar Government Bailout of Incompetent Farm Cooperative Lenders That Absorbs Private Credit Losses into Public Debt", 2, 8, 9, 1, 8, 1);

add(1988, "1988_disaster_assistance_act_drought_relief", "Disaster Assistance Act of 1988 ($3.9 Billion Emergency Drought Aid)", "News", "1988 (1988 Drought Relief Package)", "Agriculture & Food", 1,
  "Largest natural disaster relief package in U.S. history providing $3.9 billion to farmers who lost over 35% of their grain crops to the brutal 1988 summer heatwave.",
  "1 = Emergency Lifeline Rescuing Thousands of Heartland Crop and Livestock Producers from Immediate Ruin and Foreclosure", "10 = Essential Emergency Relief, Provided Moral Hazard Is Controlled by Mandating Federal Crop Insurance for Future Disasters", 2, 7, 8, 1, 8, 1);

add(1988, "1988_clinical_laboratory_improvement_amendments_clia", "Enactment of the Clinical Laboratory Improvement Amendments of 1988 (CLIA)", "News", "1988 (CLIA Lab Standards Enacted)", "Healthcare", 2,
  "Establishing federal quality standards for all 150,000 commercial and physician office laboratories testing human clinical specimens following Pap smear scandals.",
  "1 = Essential Medical Safeguard Protecting Patients from Misdiagnosed Cervical Cancers and Shoddy Commercial Lab Testing", "10 = Onerous Quality-Control Paperwork Burden Forcing Independent Doctors to Abandon Routine In-Office Diagnostic Testing", 2, 8, 8, 1, 8, 1);

add(1988, "1988_operation_praying_mantis_persian_gulf", "Operation Praying Mantis: U.S. Navy Strikes Iranian Warships and Oil Platforms", "News", "1988 (Operation Praying Mantis)", "Foreign Policy & Defense", 1,
  "U.S. Navy destroying two Iranian oil platforms and sinking six armed Iranian vessels in a day-long sea battle after USS Samuel B. Roberts struck an Iranian naval mine.",
  "1 = Dangerous Escalation Risking Full-Scale War in the Gulf While Backing Saddam Hussein's Aggressive Iraqi Regime", "10 = Decisive, Overwhelming Projection of American Seapower Crushing the Ayatollah's Rogue Navy and Securing Persian Gulf Shipping", 2, 9, 4, 1, 9, 1);

add(1988, "1988_mckinney_vento_homeless_assistance_act", "Stewart B. McKinney Homeless Assistance Act Implementation", "News", "1987-1988 (McKinney Homeless Assistance)", "Labor & Welfare", 1,
  "First major federal legislation dedicated to homelessness, providing $1 billion for emergency shelter grants, transitional housing, and education for homeless children.",
  "1 = Urgent Compassionate Step Addressing the Epidemic Homelessness Shaming Our Wealthy Nation on City Streets", "10 = Well-Intentioned Humanitarian Aid That Must Avoid Becoming an Institutionalized Bureaucracy Encouraging Vagrancy", 2, 8, 8, 1, 8, 1);

add(1988, "1988_b2_spirit_stealth_bomber_rollout", "Air Force Unveils the Northrop B-2 Spirit Stealth Flying Wing Bomber", "News", "1988 (B-2 Stealth Bomber Unveiled)", "Foreign Policy & Defense", 1,
  "Air Force pulling back the hangar doors in Palmdale, CA to reveal the top-secret flying wing stealth bomber designed to penetrate Soviet radar undetected, at $500M+ per plane.",
  "1 = Staggeringly Expensive Boondoggle at Over Half a Billion Dollars Each When Soviet Collapse Is Already Underway", "10 = The Ultimate Strategic Technological Triumph Giving America Decades of Unrivaled Invisible Airborne Nuclear Deterrence", 2, 9, 4, 1, 9, 1);

add(1988, "1988_genocide_convention_ratification_proxmire", "Senate Ratification of the UN Genocide Convention (Proxmire Act)", "News", "1988 (Genocide Convention Ratified)", "Foreign Policy & Defense", 2,
  "Senate ratifying the 1948 UN Convention on the Prevention and Punishment of the Crime of Genocide after Senator William Proxmire gave 3,211 consecutive daily speeches.",
  "1 = Historic Moral Affirmation That the United States Stands Resolutely Against the Greatest Crime Against Humanity", "10 = Symbolic Ratification Grounded in American Principles, Provided Sovereignty Reservations Guard Against Politicized World Court Abuse", 2, 8, 4, 1, 8, 1);

add(1988, "1988_times_beach_dioxin_cleanup_aftermath", "Federal EPA Buyout & Destruction of Dioxin-Tainted Times Beach, Missouri", "News", "1983-1988 (Times Beach Dioxin Buyout)", "Energy & Climate", 2,
  "EPA completing permanent buyout of all 2,000 residents and bulldozing the town after roads were sprayed with dioxin-contaminated waste oil, preparing giant incinerator.",
  "1 = Necessary Moral Action Rescuing Innocent Families from Invisible Chemical Toxicity and Incinerating Lethal Dioxin Residues", "10 = Tragic Local Chemical Disaster Handled with Decisive Federal Buyout Without Establishing Precedent for Permanent Relocations", 2, 8, 7, 1, 8, 1);

add(1988, "1988_radon_gas_national_health_advisory", "EPA & Surgeon General Issue Nationwide Public Health Advisory on Radon Gas", "News", "1988 (Radon Health Advisory)", "Healthcare", 2,
  "EPA and Surgeon General urging all homeowners to test residences for naturally occurring radioactive radon gas, warning it causes 20,000 lung cancer deaths annually.",
  "1 = Crucial Public Health Education Encouraging Inexpensive Basement Testing and Venting to Save Thousands from Silent Lung Cancers", "10 = Panic-Inducing Real Estate Scare Exaggerating Modest Natural Radon Risks and Driving Up Unnecessary Home Sale Repair Costs", 2, 7, 8, 1, 7, 1);

add(1988, "1988_aids_fda_compassionate_use_azt_reforms", "AIDS Activists (ACT UP) Storm FDA & Demand Fast-Track AZT Access", "News", "1988 (ACT UP Storms FDA / Fast-Track)", "Healthcare", 1,
  "ACT UP staging massive demonstration shutting down FDA headquarters in Rockville, MD, demanding fast-track drug approvals and expanded access to investigational AIDS therapies.",
  "1 = Courageous Grassroots Direct Action Breaking Bureaucratic Red Tape and Forcing Regulators to Speed Life-Saving Medicines to Dying Patients", "10 = Disruptive Radical Confrontation Bullying Scientists and Jeopardizing Rigorous Safety Testing Standards for New Drugs", 2, 8, 3, 1, 9, 1);

add(1988, "1988_bush_presidential_victory_40_states", "George H.W. Bush Wins 40 States & 53.4% of the Popular Vote (426 Electoral Votes)", "News", "1988 (Bush 1988 Victory)", "Governance & Judiciary", 1,
  "Bush defeating Dukakis decisively to win a third consecutive term for Republicans, though Democrats expand majorities in both House and Senate.",
  "1 = Campaign Dominated by Negative Attacks and Racial Dog Whistles; Democratic Congress Will Champion Fair Economic Policies", "10 = Resounding Affirmation of Reagan-Bush Peace and Prosperity, Conservative Values, and Defense Preparedness by the American Majority", 2, 9, 7, 1, 9, 1);

add(1988, "1988_fifra_pesticide_re_registration_amendments", "Federal Insecticide, Fungicide, and Rodenticide Act (FIFRA) 1988 Amendments", "News", "1988 (FIFRA Overhaul Enacted)", "Agriculture & Food", 2,
  "Accelerating mandatory EPA safety reviews of 600 older active agricultural pesticide ingredients and requiring chemical companies to pay re-registration fees.",
  "1 = High Time Chemical Companies Paid to Prove Older Toxic Pesticides Do Not Poison Farmworkers or Contaminate Food Chains", "10 = Excessive User Fees That Will Cause Chemical Manufacturers to Voluntarily Cancel Niche Minor-Use Crop Pesticides", 2, 8, 8, 1, 8, 1);

add(1988, "1988_abandoned_shipwreck_act_of_1988", "Enactment of the Abandoned Shipwreck Act of 1988", "News", "1988 (Shipwreck Preservation Enacted)", "Energy & Climate", 3,
  "Vesting title to historically significant abandoned shipwrecks within 3 miles of the coast in state governments for archaeological preservation, ending private treasure salvors' claims.",
  "1 = Historic Cultural Conservation Preserving Sacred Underwater Heritage and Gravesites from Commercial Treasure Hunters' Explosives", "10 = Socialist Confiscation Trampling Traditional Maritime Salvage Law and Stripping Adventurous Treasure Divers of Lawful Finds", 2, 8, 9, 1, 8, 1);

add(1988, "1988_pressler_amendment_pakistan_nuclear_program", "Enforcement of the Pressler Amendment on Pakistan's Secret Nuclear Weapons", "News", "1988-1990 (Pressler Pakistan Nuclear Dilemma)", "Foreign Policy & Defense", 1,
  "Law requiring president to certify annually that Pakistan does not possess a nuclear device before receiving U.S. military aid, strained by Pakistan's Kahuta centrifuges.",
  "1 = Strict Non-Proliferation Principle Barring U.S. Weapons from Supporting Dangerous Islamic Nuclear Proliferation", "10 = Certify Pakistan While Soviet Troops Remain in Afghanistan / Breaking the Alliance Will Hand South Asia to Moscow and New Delhi", 2, 8, 4, 1, 8, 1);

add(1988, "1988_operation_earnest_will_kuwaiti_tankers", "Operation Earnest Will: U.S. Reflagging and Escorting Kuwaiti Tankers", "News", "1987-1988 (Earnest Will Tanker Escort)", "Foreign Policy & Defense", 1,
  "U.S. Navy reflagging 11 Kuwaiti commercial oil tankers under the Stars and Stripes to escort them through the Persian Gulf Tanker War free from Iranian missiles.",
  "1 = Risky Entanglement Putting American Sailors in Harm's Way to Protect Foreign Oil Tankers and Entangle U.S. in the Iran-Iraq War", "10 = Bold, Decisive Freedom of Navigation Mission Securing the Vital Flow of Middle East Oil for the Free World", 2, 9, 4, 1, 9, 1);

add(1988, "1988_joint_verification_experiment_nuclear_tests", "U.S.-Soviet Joint Verification Experiments at Semipalatinsk & Nevada", "News", "1988 (JVE Nuclear Verification Breakthrough)", "Foreign Policy & Defense", 2,
  "American scientists measuring underground Soviet nuclear test in Kazakhstan, and Soviet scientists measuring U.S. test in Nevada to calibrate seismic verification.",
  "1 = Unprecedented Scientific Collaboration Building Verifiable Trust and Paving the Way for Genuine Nuclear Testing Bans", "10 = Pragmatic Verification Milestone Ensuring Strict Technical Detection Before Ratifying Any Cold War Arms Treaties", 2, 8, 5, 1, 8, 1);

add(1988, "1988_jesse_jackson_michigan_primary_earthquake", "Jesse Jackson's Shocking Michigan Primary Landslide (55% Democratic Vote)", "News", "1988 (Jackson Michigan Landslide)", "Governance & Judiciary", 2,
  "Jesse Jackson stunning the political establishment by winning Michigan caucuses outright, taking commanding lead in the Democratic race and demanding party clout.",
  "1 = Magnificent Breakthrough Demonstrating That Progressive Multiracial Working-Class Populism Can Win in the Industrial Heartland", "10 = Flash Alarm Signaling That Democratic Party Rules Are Vulnerable to Capture by Radical Left-Wing Populist Insurgents", 2, 9, 3, 1, 9, 1);

add(1988, "1988_ferc_order_436_natural_gas_pipelines", "FERC Implementation of Open-Access Common Carriage Natural Gas Pipelines", "News", "1985-1988 (Natural Gas Open Access)", "Energy & Climate", 2,
  "Federal Energy Regulatory Commission requiring interstate natural gas pipelines to unbundle gas sales from transport and act as common carriers for all producers.",
  "1 = Brilliant Pro-Consumer Anti-Monopoly Reform Slashing Industrial Fuel Costs and Unleashing Free-Market Gas Competition", "10 = Sound Deregulation Promoting Transparent Energy Logistics, Provided Pipelines Retain Fair Rates of Return", 2, 8, 9, 1, 8, 1);

add(1988, "1988_commercial_space_satellites_chinese_rockets", "Reagan Approval for Launching American Commercial Satellites on Chinese Rockets", "News", "1988 (Chinese Long March Space Export)", "Technology & Infrastructure", 2,
  "Reagan approving export licenses for Hughes Communications to launch two communications satellites aboard Chinese Long March rockets, ending U.S. launch monopoly.",
  "1 = Dangerous Technological Transfer Enriching the Chinese Communist Military and Weakening Domestic Commercial Rocketry", "10 = Free-Market Common Sense Enabling American Satellite Makers to Launch Affordably While Shuttle Fleet Is Grounded", 2, 8, 9, 1, 8, 1);

add(1988, "1988_clean_air_acid_rain_stalemate_persists", "Clean Air Act Acid Rain Reauthorization Remains Paralyzed in Congress", "News", "1988 (Clean Air Act Stalemate)", "Energy & Climate", 1,
  "House Energy Committee Chairman John Dingell and Senate Leader Robert Byrd blocking acid rain sulfur controls to protect auto manufacturing and coal mining jobs.",
  "1 = Disgraceful Obstruction by Dirty Coal and Auto Cronies Allowing Acid Rain to Exterminate Fish and Dissolve Eastern Forests", "10 = Responsible Defense of Working-Class High-Sulfur Appalachian Coal Miners and Midwestern Factory Electric Rates", 2, 8, 8, 1, 8, 1);

add(1988, "1988_gary_hart_monkey_business_exit", "Gary Hart Donna Rice Scandal & Withdrawal from Presidential Race", "News", "1987-1988 (Gary Hart Scandal)", "Governance & Judiciary", 2,
  "Front-runner Gary Hart daring reporters to 'follow me around'; Miami Herald photographs model Donna Rice entering his townhouse, ending his campaign in shame.",
  "1 = Tragic Destruction of a Brilliant Visionary Statesman Driven by Tabloid Sensationalism and Sordid Keyhole Journalism", "10 = Clear Indictment of Arrogance, Recklessness, and Hypocrisy Unmasking a Man Lacking Basic Moral Discipline to Lead", 2, 8, 5, 1, 9, 1);

// =========================================================================
// 1990 (50 Issues)
// =========================================================================
add(1990, "1990_americans_with_disabilities_act_ada", "Enactment of the Americans with Disabilities Act of 1990 (ADA)", "News", "1990 (ADA Landmark)", "Civil Rights & Social Issues", 1,
  "Landmark civil rights legislation signed by President Bush prohibiting discrimination against 43 million disabled Americans in employment, public buildings, and transit.",
  "1 = Glorious Civil Rights Triumph Tearing Down Physical and Social Barriers and Welcoming Disabled Citizens into Everyday Society", "10 = Sweeping Regulatory Mandate Imposing Billions in Crippling Architectural Retrofits and Frivolous Litigation on Small Businesses", 2, 8, 6, 1, 8, 1);

add(1990, "1990_clean_air_act_amendments_of_1990", "Enactment of the Clean Air Act Amendments of 1990 (Acid Rain Cap-and-Trade)", "News", "1990 (Clean Air Amendments 1990)", "Energy & Climate", 1,
  "Sweeping bipartisan overhaul creating the world's first market-based sulfur dioxide cap-and-trade program, regulating 189 toxic air pollutants, and mandating reformulated gas.",
  "1 = Monumental Environmental Triumph Squeezing Out Acid Rain and Smog Through Innovative Free-Market Pollution Allowances", "10 = Expensive Command-and-Control Regulations Imposing Severe Compliance Costs on Midwestern Utilities and Automotive Refineries", 2, 8, 8, 1, 8, 1);

add(1990, "1990_bush_breaks_tax_pledge_budget_deal", "President Bush Breaks 'Read My Lips' Pledge in 1990 Budget Agreement", "News", "1990 (Read My Lips Broken / Budget Act)", "Economy & Taxation", 1,
  "Bush agreeing with Democratic congressional leaders to raise top income tax rate to 31%, increase federal gasoline and luxury excise taxes, shattering GOP unity.",
  "1 = Responsible Bipartisan Statesmanship Putting Fiscal Reality and Long-Term Deficit Reduction Ahead of Cheap Campaign Slogans", "10 = Catastrophic Moral and Political Betrayal of Taxpayers and the Reagan Coalition That Inevitably Guarantees Conservative Mutiny", 2, 8, 10, 1, 10, 1);

add(1990, "1990_budget_enforcement_act_paygo_discretionary_caps", "Budget Enforcement Act of 1990 (Statutory PAYGO & Discretionary Spending Caps)", "News", "1990 (PAYGO Rules Enacted)", "Economy & Taxation", 1,
  "Establishing statutory 'Pay-As-You-Go' (PAYGO) requiring tax cuts or entitlement expansions to be deficit-neutral, paired with strict discretionary spending caps.",
  "1 = Vital Structural Reform Imposing Real Fiscal Discipline and Ending Gimmicky Gramm-Rudman Targets to Tame Deficits", "10 = Flawed Mechanism That Enshrines Higher Taxes as the Default Offset for Necessary Pro-Growth Tax Cuts", 2, 8, 9, 1, 9, 1);

add(1990, "1990_operation_desert_shield_buildup", "Operation Desert Shield: 500,000 U.S. Troops Deployed to Saudi Arabia", "News", "1990-1991 (Desert Shield Buildup)", "Foreign Policy & Defense", 1,
  "Following Saddam Hussein's invasion of Kuwait, Bush mobilizes massive multinational coalition, deploying half a million U.S. combat troops to defend Saudi oil fields.",
  "1 = Reckless Rush to War Risking Tens of Thousands of American Casualties to Shield Corrupt Royal Kuwaiti and Saudi Oil Sheiks", "10 = Noble Global Leadership Standing Firm Against Naked Aggression, Enforcing International Law, and Defending Vital World Energy", 2, 9, 3, 1, 9, 1);

add(1990, "1990_iraqi_invasion_and_annexation_of_kuwait", "Saddam Hussein's Invasion and Annexation of Kuwait (August 2, 1990)", "News", "1990 (Kuwait Invasion Shock)", "Foreign Policy & Defense", 1,
  "One hundred thousand Iraqi troops and 300 tanks overrunning Kuwait in hours, plundering Kuwait City, and declaring Kuwait Iraq's 19th province.",
  "1 = Unvarnished Brutal Aggression That Must Be Resisted Through Comprehensive UN Economic Embargoes and Diplomacy", "10 = Unacceptable Violation of World Order and Grab for 20% of Global Oil Reserves That 'Will Not Stand' / Prepare Decisive Force", 2, 9, 4, 1, 9, 1);

add(1990, "1990_recession_begins_crude_oil_price_spike", "1990 Economic Recession Begins Following Doubling of World Crude Prices", "News", "1990 (1990 Recession Outbreak)", "Economy & Taxation", 1,
  "Persian Gulf war fears driving crude oil from $20 to $40/barrel; U.S. economy plunges into recession with rising white-collar and blue-collar layoffs.",
  "1 = Deploy Counter-Cyclical Federal Stimulus, Expand Unemployment Benefits, and Curb Greedy Wall Street Speculation", "10 = Slash Capital Gains Taxes and Deregulate Enterprise to Spark Supply-Side Investment Out of the Oil-Shock Slump", 2, 8, 9, 1, 9, 1);

add(1990, "1990_firrea_savings_and_loan_bailout_rtc", "Financial Institutions Reform, Recovery, and Enforcement Act (FIRREA & RTC)", "News", "1989-1990 (S&L Bailout & RTC Rollout)", "Economy & Taxation", 1,
  "Creating Resolution Trust Corporation (RTC) to liquidate hundreds of billions in failed thrift assets, backed by hundreds of billions in federal taxpayer funding.",
  "1 = Bitter Inevitable Price of Reckless Reagan-Era Free-Market Deregulation and Crony Thrift Looting Absorbed by Taxpayers", "10 = Painful but Mandatory Systemic Rescue Resolving Insolvent Zombie Thrifts and Restoring Integrity to Commercial Banking", 2, 8, 10, 1, 9, 2);

add(1990, "1990_fall_of_the_berlin_wall_german_reunification", "Fall of the Berlin Wall & Reunification of Germany (Two-Plus-Four Treaty)", "News", "1989-1990 (German Reunification Accord)", "Foreign Policy & Defense", 1,
  "Bush and Kohl orchestrating peaceful German reunification within NATO, ratified by Allied powers, ending 45 years of Cold War division in Central Europe.",
  "1 = Glorious Historic Triumph of Democratic Freedom, Peaceful Self-Determination, and Human Rights Across Europe", "10 = Brilliant Triumph of American Cold War Resolve and Resolute Presidential Statesmanship Reshaping the Modern Free World", 2, 8, 5, 1, 8, 1);

add(1990, "1990_immigration_act_of_1990_h1b_visas", "Enactment of the Immigration Act of 1990 (Raising Cap to 700,000 & H-1B Visas)", "News", "1990 (Immigration Act 1990 Enacted)", "Immigration", 1,
  "Bipartisan legislation increasing legal immigration by 40% (to 700,000/year), creating the H-1B skilled specialty worker visa, and establishing diversity visas.",
  "1 = Progressive Pro-Immigrant Reform Welcoming Global Talent to Power America's High-Tech and Biomedical Knowledge Economy", "10 = Influx of Foreign Guest Workers Undercutting American STEM Wages, Displacing Native Workers, and Inflating Population Growth", 2, 8, 8, 1, 10, 1);

add(1990, "1990_ryan_white_care_act_enacted", "Enactment of the Ryan White Comprehensive AIDS Resources Emergency (CARE) Act", "News", "1990 (Ryan White CARE Act)", "Healthcare", 1,
  "Named in honor of teenage hemophiliac Ryan White who died of AIDS; providing $1.5 billion in emergency federal relief to hard-hit city health systems and clinics.",
  "1 = Compassionate Moral Victory Guaranteeing Decent Medical Care, Medications, and Dignity to Low-Income Americans Living with AIDS", "10 = Sound Emergency Medical Assistance, Provided Federal Grants Focus Exclusively on Clinical Treatment Rather Than Political Advocacy", 2, 8, 4, 1, 8, 1);

add(1990, "1990_oil_pollution_act_of_1990_opa90", "Enactment of the Oil Pollution Act of 1990 (OPA 90 - Double Hull Mandate)", "News", "1990 (OPA 90 Enacted post-Exxon Valdez)", "Energy & Climate", 1,
  "Passed in the wake of the 11-million-gallon Exxon Valdez disaster in Alaska, mandating double hulls on all oil tankers entering U.S. waters and unlimited spiller liability.",
  "1 = Essential Landmark Defense Forcing Big Oil to Build Crash-Resistant Double-Hull Tankers and Bear Unlimited Liability for Toxic Spills", "10 = Strict Tanker Rules That Will Drive Prudent Responsible Maritime Shippers Out of U.S. Ports Due to Unlimited Tort Liability", 2, 8, 8, 1, 8, 1);

add(1990, "1990_david_souter_confirmed_supreme_court", "David Souter Confirmed (90-9) to Supreme Court (Replacing William J. Brennan)", "News", "1990 (David Souter Confirmation)", "Governance & Judiciary", 1,
  "Bush nominating obscure New Hampshire federal judge David Souter with no paper trail; conservatives reassure 'home run', liberals fear Roe overturn; confirmed 90-9.",
  "1 = Moderate, Principled Restrained Jurist Who Will Guard Stare Decisis, Equal Justice, and Constitutional Precedents", "10 = Stealth Nominee Lacking Proven Originalist Conviction / Conservatives Must Insist on Known Textualist Fidelity, Not Stealth Picks", 2, 8, 6, 1, 8, 1);

add(1990, "1990_cruzan_v_director_right_to_die", "Cruzan v. Director, Missouri Dept of Health (Supreme Court Right to Die Ruling)", "News", "1990 (Cruzan Right-to-Die Ruling)", "Healthcare", 1,
  "Supreme Court ruling 5-4 that competent individuals have a constitutional right to refuse medical treatment, but states may require clear and convincing evidence of vegetative patient wishes.",
  "1 = Historic Affirmation of Bodily Autonomy Allowing Families to Honor Dying Loved Ones' Wishes Free from Artificial Hospital Torture", "10 = Sacred Defense of Inviolable Human Life Protecting Vulnerable, Helpless Patients from Involuntary Euthanasia", 2, 8, 4, 1, 10, 1);

add(1990, "1990_employment_division_v_smith_peyote", "Employment Division v. Smith (Scalia Free Exercise Supreme Court Ruling)", "News", "1990 (Smith Religious Freedom Ruling)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 6-3 (Scalia opinion) that neutral laws of general applicability do not violate the Free Exercise Clause even if they burden religious practices (peyote use).",
  "1 = Devastating Evisceration of Religious Freedom Stripping Minority Faiths of Constitutional Protection Against Majoritarian Laws", "10 = Sound Rule of Law: Individuals Cannot Use Private Religious Beliefs to Demand Personal Exemptions from Neutral Criminal Drug Laws", 2, 8, 2, 1, 8, 1);

add(1990, "1990_united_states_v_eichman_flag_burning", "United States v. Eichman Supreme Court Ruling (Striking Flag Protection Act)", "News", "1990 (Eichman Flag Burning Ruling)", "Governance & Judiciary", 1,
  "Supreme Court ruling 5-4 (Brennan opinion joined by Scalia) that the Flag Protection Act of 1989 violates First Amendment political free speech.",
  "1 = Inspiring Defense of Freedom: The Republic Is Strong Enough to Protect Even the Most Offensive, Despicable Forms of Political Dissent", "10 = Outrageous Desecration of Our Sacred National Flag Demanding Immediate Passage of a Constitutional Amendment", 2, 8, 1, 1, 10, 1);

add(1990, "1990_civil_rights_act_of_1990_bush_veto", "President Bush Vetoes Civil Rights Act of 1990 (Denouncing 'Quota Bill')", "News", "1990 (Civil Rights Act Veto)", "Civil Rights & Social Issues", 1,
  "Bush vetoing legislation to overturn Wards Cove and other restrictive 1989 Supreme Court rulings on disparate impact, arguing it will force employers to adopt hiring quotas.",
  "1 = Shameful Retreat from Equal Opportunity Pandering to White Resentment and Gutting Decades of Employment Civil Rights Progress", "10 = Courageous Defense of Merit and Fairness Refusing to Enact Coercive Quota Legislation That Invites Lawsuits Against Employers", 2, 9, 6, 1, 9, 1);

add(1990, "1990_repeal_of_medicare_catastrophic_coverage_act", "Historic Congressional Repeal of the Medicare Catastrophic Coverage Act", "News", "1989-1990 (Catastrophic Coverage Repeal)", "Healthcare", 1,
  "Congress overwhelmingly repealing the 1988 law after furious affluent seniors surrounded Dan Rostenkowski's car in Chicago protesting the mandatory income surtax.",
  "1 = Tragic Cowardly Capitulation by Lawmakers Depriving Millions of Modest Seniors of Essential Prescription Drug and Nursing Protections", "10 = Spectacular Grassroots Senior Taxpayer Victory Smashing an Unfair Class-Based Surtax That Penalized Prudent Retirees", 2, 8, 9, 1, 9, 1);

add(1990, "1990_nutrition_labeling_and_education_act_nlea", "Enactment of the Nutrition Labeling and Education Act of 1990 (NLEA)", "News", "1990 (Nutrition Facts Panel Enacted)", "Healthcare", 1,
  "Mandating standardized 'Nutrition Facts' panels on all packaged foods, establishing uniform serving sizes, and requiring FDA approval for commercial health claims.",
  "1 = Indispensable Consumer Milestone Empowering American Families with Honest Nutritional Facts to Fight Heart Disease and Obesity", "10 = Onerous Packaging Reformulation and Chemical Lab Testing Costs Imposed on Small Food Processing Companies", 2, 8, 8, 1, 8, 1);

add(1990, "1990_student_right_to_know_clery_act", "Enactment of the Student Right-to-Know and Campus Security Act (Clery Act)", "News", "1990 (Clery Campus Security Enacted)", "Education", 2,
  "Requiring all colleges and universities receiving federal financial aid to disclose annual campus crime statistics and issue timely warnings of public safety threats.",
  "1 = Essential Sunlight Ensuring College Students and Parents Know the True Crime Risks on Campuses Free from PR Cover-ups", "10 = Sound Crime Transparency Empowering College Consumers While Ensuring Uniform Law Enforcement Reporting Definitions", 2, 7, 5, 1, 7, 1);

add(1990, "1990_nagpra_native_american_graves_repatriation", "Native American Graves Protection and Repatriation Act of 1990 (NAGPRA)", "News", "1990 (NAGPRA Enacted)", "Civil Rights & Social Issues", 1,
  "Requiring federal agencies and museums to inventory and return Native American ancestral human remains, funerary objects, and sacred items to lineal descendants and tribes.",
  "1 = Sacred Moral Reparation Ending Century of Grave Robbing and Restoring Dignity and Religious Reburial to Indigenous Ancestors", "10 = Support Tribal Dignity While Guarding Legitimate Scientific and Anthropological Study of Prehistoric Continental Artifacts", 2, 8, 3, 1, 8, 1);

add(1990, "1990_radiation_exposure_compensation_act_reca", "Enactment of the Radiation Exposure Compensation Act of 1990 (RECA)", "News", "1990 (RECA Enacted for Downwinders)", "Healthcare", 2,
  "Authorizing $50,000 to $100,000 compassionate compensation payments to Nevada test site 'downwinders' and underground uranium miners who contracted fatal cancers.",
  "1 = Sacred Moral Debt Acknowledging the Cold War Government Secretly Sacrificed the Health and Lives of Innocent Rural Western Citizens", "10 = Compassionate Justified Compensation for Patriotic Citizens Suffering Proven Service-Connected Cold War Radiogenic Illness", 2, 7, 6, 1, 8, 1);

add(1990, "1990_television_decoder_circuitry_act", "Enactment of the Television Decoder Circuitry Act of 1990", "News", "1990 (Closed Captioning Chip Mandate)", "Technology & Infrastructure", 2,
  "Mandating that all television sets 13 inches or larger manufactured or sold in the U.S. include built-in closed-caption decoder circuitry for deaf viewers.",
  "1 = Breathtaking Breakthrough Democratizing Television Media, News, and Culture for Millions of Deaf and Hard-of-Hearing Americans", "10 = Modest Inexpensive Engineering Mandate Providing Immense Social Value to Deaf Citizens Free from Heavy Ongoing Subsidies", 2, 8, 7, 1, 8, 1);

add(1990, "1990_child_care_development_block_grant_ccdbg", "Child Care and Development Block Grant Act of 1990 (CCDBG Enactment)", "News", "1990 (CCDBG Child Care Grants)", "Labor & Welfare", 1,
  "First dedicated federal funding ($2.5B over 3 years) providing child care vouchers to low-income working parents, permitting use in religious daycare centers.",
  "1 = Compassionate Lifeline Enabling Working Mothers to Obtain Quality, Affordable Childcare and Escape Welfare Dependency", "10 = Sound Voucher Choice Empowering Parents to Choose Faith-Based Neighborhood Daycare Without Creating a Government Creche Monopoly", 2, 8, 8, 1, 8, 1);

add(1990, "1990_tongass_timber_reform_act", "Enactment of the Tongass Timber Reform Act of 1990", "News", "1990 (Tongass Rainforest Protection)", "Energy & Climate", 1,
  "Ending mandatory $40 million annual federal timber subsidy and establishing 1 million acres of permanent wilderness in Alaska's Tongass temperate old-growth rainforest.",
  "1 = Spectacular Conservation Victory Rescuing Ancient Old-Growth Rainforest and Salmon Spawning Streams from Taxpayer-Subsidized Clearcuts", "10 = Heavy-Handed Environmental Lockup Destroying Generations of High-Paying Timber and Pulp Mill Jobs Across Southeast Alaska", 2, 8, 8, 1, 9, 1);

add(1990, "1990_northern_spotted_owl_threatened_listing", "U.S. Fish & Wildlife Service Lists Northern Spotted Owl as Threatened", "News", "1990 (Spotted Owl ESA Listing)", "Energy & Climate", 1,
  "Listing the spotted owl under the Endangered Species Act, freezing billions of board-feet of old-growth timber sales across Oregon, Washington, and Northern California.",
  "1 = Indispensable Ecological Duty Preserving the Crown Jewels of Pacific Northwest Ancient Ecosystems from Permanent Extinction", "10 = Heartless Environmental Fanaticism Sacrificing Tens of Thousands of Working-Class Logging Families for a Common Forest Bird", 2, 9, 9, 1, 9, 1);

add(1990, "1990_hubble_space_telescope_optical_aberration", "Hubble Space Telescope Deployed with Flawed Primary Mirror", "News", "1990 (Hubble Spherical Aberration)", "Technology & Infrastructure", 1,
  "NASA discovering a spherical aberration ground into the edge of Hubble's 94-inch primary mirror, blurring deep space images and igniting congressional inquiries.",
  "1 = Painful Indictment of Quality-Control Complacency; NASA Must Develop an In-Orbit Servicing Mission to Restore Full Vision", "10 = Staggering $1.5 Billion Scientific Embarrassing Fiasco Shaking Public Confidence in Complex Federal Aerospace Megaprojects", 2, 7, 7, 2, 8, 1);

add(1990, "1990_california_prop_128_big_green_defeated", "California Voters Reject Proposition 128 ('Big Green' Environmental Megabill)", "News", "1990 (Big Green Initiative Defeated)", "Energy & Climate", 1,
  "California voters rejecting (64% to 36%) sweeping initiative to ban 20 agricultural pesticides, slash greenhouse gases by 40%, and protect ancient redwoods.",
  "1 = Tragic Victory for Multi-Million Dollar Chemical and Agribusiness Advertising Deceptions; Bold Climate Action Stifled", "10 = Common-Sense Rejection of a Radical, Bureaucratic Economic Nightmare That Would Have Crippled California Farming and Industry", 2, 9, 9, 1, 9, 1);

add(1990, "1990_term_limits_wave_colorado_california", "Birth of the Term Limits Movement: Colorado & California Approve Initiatives", "News", "1990 (Term Limits Movement Genesis)", "Governance & Judiciary", 1,
  "Colorado becoming the first state in history to limit congressional terms, and California passing Prop 140 limiting state legislative terms, igniting national revolt.",
  "1 = Anti-Democratic Gimmick Depriving Citizens of Experienced Lawmakers and Surrendering Real Power to Unelected Lobbyists and Staffers", "10 = Magnificent Grassroots Revolution Ending the Entrenched Corrupt Aristocracy of Professional Career Politicians", 3, 9, 9, 1, 10, 1);

add(1990, "1990_gun_free_school_zones_act_enacted", "Enactment of the Gun-Free School Zones Act of 1990", "News", "1990 (Gun-Free School Zones Enacted)", "Civil Rights & Social Issues", 1,
  "Federal statute prohibiting any individual from knowingly possessing a firearm within 1,000 feet of any public, private, or parochial elementary or secondary school.",
  "1 = Common-Sense Federal Protection Ensuring Schoolchildren and Teachers Can Learn in Safe Classrooms Free from Gun Violence", "10 = Unconstitutional Commerce Clause Usurpation Infringing the Second Amendment and Preempting State Police Powers (Later Struck in Lopez)", 2, 9, 10, 1, 10, 1);

add(1990, "1990_nelson_mandela_us_tour_joint_session", "Nelson Mandela Released from Prison & Historic Address to Joint Session of Congress", "News", "1990 (Mandela Triumph & Tour)", "Foreign Policy & Defense", 1,
  "Following release after 27 years in prison, African National Congress leader Mandela tours the U.S. to tumultuous ticker-tape parades and addresses a joint session of Congress.",
  "1 = Inspiring Moral Triumph of the Human Spirit Demonstrating That Righteous Democratic Resistance Can Demolish Racist Apartheid", "10 = Honor Mandela's Reconciliatory Words While Insisting the ANC Renounce Marxism and Cease Ties with Communist Dictators", 2, 8, 3, 1, 8, 1);

add(1990, "1990_un_security_council_resolution_678_ultimatum", "UN Security Council Adopts Resolution 678 Authorizing Force Against Iraq", "News", "1990 (UN Resolution 678 Ultimatum)", "Foreign Policy & Defense", 1,
  "UN Security Council voting 12-2 to give Saddam Hussein a deadline of January 15, 1991 to fully withdraw from Kuwait or face 'all necessary means' (military force).",
  "1 = Maintain Aggressive Economic Sanctions and Diplomatic Encirclement Rather Than Rushing into a Bloody Ground War in the Desert", "10 = Indispensable Global Legal Mandate Affirming That Armed Aggression Will Be Crushed by Resolute International Force", 2, 9, 4, 1, 9, 1);

add(1990, "1990_keating_five_senate_ethics_hearings", "Keating Five Senate Ethics Committee Public Corruption Hearings", "News", "1990-1991 (Keating Five Scandal)", "Governance & Judiciary", 1,
  "Public hearings investigating Senators Cranston, DeConcini, Glenn, McCain, and Riegle for intervening with federal bank regulators on behalf of thrift fraudster Charles Keating.",
  "1 = Graphic Sordid Proof of Campaign Finance Bribery: Big Donors Buy Direct Access to Powerful Lawmakers to Derail Regulators", "10 = Reaffirm Strict Ethics Standards While Recognizing Constituent Service Inquiries Are Part of Legitimate Congressional Duties", 2, 8, 4, 1, 8, 1);

add(1990, "1990_federal_luxury_excise_taxes_backlash", "1990 Budget Enacts 10% Luxury Taxes on Yachts, Private Planes, and Jewelry", "News", "1990 (Luxury Tax Yacht Collapse)", "Economy & Taxation", 2,
  "Imposing a 10% excise tax on luxury goods (yachts over $100K, cars over $30K, furs), causing high-end yacht manufacturing to collapse and laying off 25,000 boatbuilders.",
  "1 = Fair Symbol of Progressive Taxation Asking the Ultra-Wealthy to Pay a Modest Premium on Luxury Status Purchases", "10 = Disastrous Class-Warfare Folly Destroying Middle-Class Working Boatbuilder Jobs in Maine and Florida While Collecting Zero Revenue", 2, 9, 10, 1, 9, 1);

add(1990, "1990_peace_dividend_defense_drawdown_debates", "Debate Over Post-Cold War 'Peace Dividend' and Military Base Closures (BRAC)", "News", "1990 (Peace Dividend Debates)", "Economy & Taxation", 1,
  "Following the collapse of the Warsaw Pact, Congress debates slashing defense spending by 25% and launching the Base Realignment and Closure (BRAC) process.",
  "1 = Historic Opportunity to Reinvest Hundreds of Billions from Obsolescent Weapons into Education, Infrastructure, and Universal Healthcare", "10 = Dangerous Rush to Prematurely Gut Our Armed Forces in a Volatile, Multipolar World as Proven by Iraq's Invasion of Kuwait", 2, 9, 4, 1, 9, 1);

add(1990, "1990_human_genome_project_formal_launch", "NIH and Department of Energy Formally Launch the Human Genome Project", "News", "1990 (Human Genome Project Launch)", "Healthcare", 2,
  "International $3 billion scientific consortium officially beginning 15-year effort to sequence all 3 billion base pairs of human DNA, co-headed by James Watson.",
  "1 = Monumental Scientific Odyssey Unlocking the Blueprint of Human Biology and Eradicating Thousands of Hereditary Diseases", "10 = Magnificent Scientific Frontier, Provided Strict Moral and Bioethical Safeguards Guard Against Genetic Discrimination and Eugenics", 2, 7, 6, 2, 7, 1);

add(1990, "1990_fast_track_nafta_negotiations_mexico", "President Bush Formally Proposes Free Trade Agreement with Mexico (NAFTA Origin)", "News", "1990 (NAFTA Negotiations Genesis)", "Economy & Taxation", 1,
  "Bush announcing plans to negotiate a comprehensive trilateral free trade pact with Mexico and Canada, requesting congressional fast-track trade negotiating authority.",
  "1 = Catastrophic Agreement That Will Export Hundreds of Thousands of American Factory Jobs to Low-Wage Mexican Sweatshops", "10 = Transformative Geopolitical and Economic Strategy Anchoring Mexico in Democratic Capitalism and Creating the World's Richest Trade Bloc", 2, 8, 9, 1, 8, 1);

add(1990, "1990_national_environmental_education_act", "Enactment of the National Environmental Education Act of 1990", "News", "1990 (Environmental Education Enacted)", "Education", 3,
  "Directing the EPA to establish the Office of Environmental Education and provide federal grants for ecological curriculum development in elementary and secondary schools.",
  "1 = Essential Education Fostering Responsible Environmental Stewardship and Ecological Literacy in the Rising Generation", "10 = Taxpayer-Funded Indoctrination Pushing Green Political Activism and Anti-Development Ideology on Impressionable Schoolchildren", 2, 8, 7, 1, 8, 1);

add(1990, "1990_midterm_elections_anti_incumbent_mood", "1990 Midterm Elections: Modest Democratic Pickups Amid Anti-Tax and Anti-Incumbent Anger", "News", "1990 (1990 Midterm Anti-Incumbent Vote)", "Governance & Judiciary", 1,
  "Voters delivering an anti-incumbent rebuke following the budget tax hike and recession; Democrats pick up 1 Senate seat and 8 House seats; 15 House incumbents defeated.",
  "1 = Rejection of Bush's Broken Tax Pledge and Inattention to Recession; Mandate for Congressional Democratic Economic Policies", "10 = Warning Shot Fired by Conservative Taxpayer Base Against Washington's Bi-Partisan Spending and Tax-Hiking Establishment", 2, 9, 7, 1, 9, 1);

add(1990, "1990_panama_operation_just_cause_aftermath", "Operation Just Cause Aftermath: Manuel Noriega Arraigned in Miami on Drug Charges", "News", "1989-1990 (Operation Just Cause & Noriega)", "Foreign Policy & Defense", 1,
  "U.S. military invasion of Panama capturing military dictator Manuel Noriega; Noriega brought to federal court in Miami to face historic drug trafficking charges.",
  "1 = Unilateral Military Invasion Trampling Panamanian Sovereignty and Resulting in Hundreds of Civilian Casualties in El Chorrillo", "10 = Decisive Presidential Action Restoring Panamanian Democracy, Protecting the Panama Canal, and Bringing an Indicted Narco-Dictator to Justice", 2, 9, 3, 1, 9, 1);

add(1990, "1990_clean_water_act_stormwater_rules_phase_one", "EPA Issues Phase I National Stormwater Runoff Discharge Permit Regulations", "News", "1990 (NPDES Stormwater Phase I)", "Energy & Climate", 2,
  "Mandating NPDES pollution permits for municipal stormwater sewer systems serving populations over 100,000 and heavy industrial construction sites.",
  "1 = Crucial Action Halting Toxic Industrial Runoff, Heavy Metals, and Petroleum from Choking Urban Waterways and Harbors", "10 = Unfunded Federal Mandate Imposing Staggering Capital Drainage Costs on City Public Works Budgets Without Proven Benefit", 2, 8, 8, 1, 8, 1);

add(1990, "1990_gatts_uruguay_round_agricultural_deadlock", "Uruguay Round GATT Trade Talks Collapse in Brussels Over European Farm Subsidies", "News", "1990 (GATT Brussels Collapse)", "Economy & Taxation", 2,
  "Global multilateral trade negotiations breaking down after European Community refuses American demands for a 75% cut in domestic agricultural export subsidies.",
  "1 = Stand Resolutely with American Export Farmers Refusing to Surrender Our Competitive Edge to Unfairly Subsidized European Agriculture", "10 = Multilateral Breakthrough Is Essential; Compromise on Phased Reductions to Rescue the Global Free Trade Architecture", 2, 8, 9, 1, 8, 1);

add(1990, "1990_food_agriculture_conservation_act_organic", "Food, Agriculture, Conservation, and Trade Act of 1990 (Organic Foods Origin)", "News", "1990 (1990 Farm Bill & Organic Standards)", "Agriculture & Food", 2,
  "Enacting Title XXI creating the National Organic Program (NOP) to establish federal certification standards for organically grown fruits, vegetables, and livestock.",
  "1 = Transformative Legislation Guaranteeing True Pesticide-Free Organic Standards and Empowering Ecological Small Farms", "10 = Sound Voluntary Standards, Provided Federal Bureaucracy Does Not Exclude Traditional Family Farmers with Excessive Certification Fees", 2, 8, 7, 1, 8, 1);

add(1990, "1990_start_i_treaty_negotiations_final_phase", "Final Drafting of the Strategic Arms Reduction Treaty (START I) with Moscow", "News", "1990 (START I Drafting Apex)", "Foreign Policy & Defense", 1,
  "Bush and Gorbachev finalizing treaty to slash strategic nuclear arsenals by 30% (capping warheads at 6,000 and launchers at 1,600), the first deep cuts in history.",
  "1 = Monumental Triumph for Humanity Safely Dismantling Thousands of Cold War Megaton Nuclear Warheads", "10 = Remarkable Achievement of Resolute Reagan-Bush Diplomacy Forcing Soviet Arsenal Cuts While Preserving Triad Modernization", 2, 8, 4, 1, 8, 1);

add(1990, "1990_federal_reserve_monetary_easing_recession", "Federal Reserve Slashes Discount Rate to 6.5% to Counter Spreading Recession", "News", "1990 (Fed Recession Easing)", "Economy & Taxation", 1,
  "Chairman Alan Greenspan and the Federal Reserve cutting interest rates multiple times as credit crunches and commercial bank real estate losses mount.",
  "1 = Swift Monetary Easing Coupled with Targeted Federal Stimulus to Prevent Severe Middle-Class Unemployment Spikes", "10 = Prudent Monetary Liquidity While Guarding Against Creating Future Inflationary Bubbles in Post-Recession Recovery", 2, 8, 9, 1, 8, 2);

add(1990, "1990_us_japan_structural_impediments_initiative", "U.S.-Japan Structural Impediments Initiative (SII) Bilateral Accords", "News", "1989-1990 (SII Trade Talks)", "Economy & Taxation", 1,
  "Historic bilateral negotiations addressing root structural trade imbalances: Japan agrees to open retail laws and public works, U.S. agrees to reduce budget deficits.",
  "1 = Hold Tokyo Accountable to Dismantle Monopolistic Keiretsu Distribution Cartels That Block American High-Tech Exports", "10 = Bipartisan Market Realism Demanding Structural Reform While Avoiding Self-Destructive Protectionist Tariffs", 2, 8, 9, 1, 8, 1);

add(1990, "1990_ariane_commercial_space_launch_competition", "European Arianespace Captures 50% of the World Commercial Satellite Launch Market", "News", "1990 (Commercial Rocketry Market Share)", "Technology & Infrastructure", 2,
  "European Ariane 4 rocket dominating the commercial telecommunications satellite market, highlighting delays and uncompetitiveness in the U.S. commercial rocket sector.",
  "1 = Urgent National Wakeup Call Mandating Federal Investment in Next-Generation Reusable Commercial Space Launch Infrastructure", "10 = Unleash Private American Rocket Entrepreneurs Free from Onerous ITAR Export Controls to Beat Foreign Government-Subsidized Launchers", 2, 8, 9, 2, 8, 1);

add(1990, "1990_exxon_valdez_criminal_restitution_negotiations", "Federal and State Criminal Restitution Negotiations Over Exxon Valdez Oil Spill", "News", "1990 (Exxon Valdez Legal Settlement)", "Energy & Climate", 1,
  "Justice Department and Alaska negotiating a record $1 billion civil and criminal restitution penalty against Exxon for polluting 1,300 miles of Prince William Sound.",
  "1 = Impose the Maximum Criminal Penalties and Strip Reckless Corporate Megabucks of Every Dime Needed to Restore Shattered Ecosystems", "10 = Exxon Has Spent $2 Billion in Immediate Cleanup Efforts; Ensure Penalties Rebuild Alaska Rather Than Enriching Litigators", 2, 8, 8, 1, 8, 1);

add(1990, "1990_congressional_debate_authorization_force_iraq", "Emergence of Bitter Congressional Debate Over Authorizing Force Against Iraq", "News", "1990 (Persian Gulf War Powers Debate)", "Foreign Policy & Defense", 1,
  "Democratic congressional leadership insisting President Bush must obtain explicit statutory constitutional authorization from Congress before ordering combat operations.",
  "1 = Constitutional Absolutism: The President Cannot Launch an Offensive War of Choice Without a Prior Formal Vote of Congress", "10 = Commander-in-Chief Possesses Inherent Constitutional Authority and UN Security Council Mandate to Expel Iraqi Aggressors", 2, 9, 3, 1, 9, 1);

add(1990, "1990_judicial_nomination_clarence_thomas_dc_circuit", "Clarence Thomas Confirmed to D.C. Circuit Court of Appeals", "News", "1990 (Clarence Thomas D.C. Circuit)", "Governance & Judiciary", 2,
  "Senate confirming former EEOC Chairman Clarence Thomas to the prestigious D.C. Circuit, positioning the conservative jurist as the heir apparent to Thurgood Marshall.",
  "1 = Troubling Nominee Whose Extreme Hostility to Affirmative Action and Civil Rights Remedies Bodes Ill for Equal Protection", "10 = Inspiring African-American Conservative Jurist Embodying Self-Reliance, Hard Work, and Deep Constitutional Fidelity", 2, 10, 7, 1, 10, 1);

console.log('Bracket D (1984-1990) total issues:', ISSUES.length);

module.exports = ISSUES;
