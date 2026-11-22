/**
 * scripts/generate-bracket-b-1972.cjs
 * Appends 1972 issues to scripts/build-issues-1968-1974.cjs
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build-issues-1968-1974.cjs');
let content = fs.readFileSync(filePath, 'utf8');

const additions = `
// =========================================================================
// 1972 (50 Issues)
// =========================================================================
add(1972, "1972_nixon_visit_to_china_shanghai_communique", "Nixon's Historic Visit to China & Shanghai Communique", "News", "1972 (Opening to China)", "Foreign Policy & Defense", 1,
  "President Nixon traveling to Beijing, meeting Mao Zedong, and signing the Shanghai Communique, ending 23 years of diplomatic isolation and triangulating against Moscow.",
  "1 = Brilliant Geopolitical Breakthrough Opening Dialogue with 800 Million Chinese People and Weakening the Soviet Bloc", "10 = Shameful Betrayal of Free Nationalist Taiwan (ROC) and Unprincipled Appeasement of Mao's Communist Tyranny", 2, 8, 3, 1, 9, 1);

add(1972, "1972_salt_i_and_abm_treaty_signing", "Moscow Summit Signing of SALT I and Anti-Ballistic Missile (ABM) Treaty", "News", "1972 (SALT I & Detente Apex)", "Foreign Policy & Defense", 1,
  "Signing the first bilateral strategic arms limitation accords freezing ICBM launchers and restricting anti-ballistic missile defensive shields to two sites each.",
  "1 = Monumental Diplomatic Victory Codifying Nuclear Detente and Averting a Catastrophic Strategic Arms Race", "10 = Dangerous Asymmetric Accord Locking in Soviet Superiority in Heavy Land-Based Ballistic Missiles and Disarming America", 2, 8, 4, 1, 9, 1);

add(1972, "1972_george_mcgovern_antiwar_presidential_bid", "George McGovern's Anti-War Presidential Campaign & 'Acid, Amnesty, Abortion'", "News", "1972 (McGovern Insurgency)", "Foreign Policy & Defense", 1,
  "Senator McGovern winning the Democratic nomination on a platform of immediate Vietnam troop withdrawal, $30B defense cuts, and universal pardons for draft resisters.",
  "1 = Courageous Moral Crusade to End an Unjust Imperial War, Rebuild American Society, and Restore Faith in Democracy", "10 = Radical Dangerous Surrender Platform Giving Away Southeast Asia, Slandering Our Armed Forces, and Bankrupting America", 2, 10, 4, 1, 10, 1);

add(1972, "1972_mcgovern_one_thousand_dollar_demogrant", "McGovern's $1,000 Per-Person Demogrant / Income Redistribution Proposal", "News", "1972 (Demogrant Controversy)", "Labor & Welfare", 2,
  "McGovern proposing a universal $1,000 cash grant to every American citizen funded by massive tax increases on high earners and corporations, later amended under criticism.",
  "1 = Bold Universal Economic Floor Ending Abject Poverty and Empowering Every Working-Class American Family", "10 = Reckless Socialist Scheme Distributing Taxpayer Cash That Would Destroy Work Incentives and Balloon Inflation", 2, 9, 8, 2, 9, 1);

add(1972, "1972_thomas_eagleton_affair_vice_presidential_exit", "Thomas Eagleton Electroshock Therapy Disclosures & McGovern VP Shakeup", "News", "1972 (Eagleton Affair)", "Governance & Judiciary", 2,
  "Revelations that Democratic VP nominee Thomas Eagleton underwent psychiatric electroshock therapy for depression, prompting McGovern's '1,000 percent' support followed by forced withdrawal.",
  "1 = Tragic Stigmatization of Mental Illness; McGovern Acted with Principle Under Crushing Media Pressure", "10 = Fatal Display of Indecision, Chaos, and Incompetence Proving McGovern Wholly Unfit to Lead the Free World", 3, 9, 4, 1, 8, 1);

add(1972, "1972_watergate_democratic_headquarters_break_in", "Watergate Break-In at Democratic National Committee Headquarters", "News", "1972-1974 (Watergate Genesis)", "Governance & Judiciary", 1,
  "Arrest of five burglars affiliated with the Committee to Re-elect the President (CREEP) bugging phones at DNC headquarters in the Watergate complex.",
  "1 = Shocking Criminal Abuse of Power and Threat to Democratic Elections Demanding Thorough Federal and Congressional Investigation", "10 = Bizarre Third-Rate Burglary Cynically Blown Out of Proportion by Liberal Partisans and Hostile News Media", 2, 9, 3, 1, 8, 1);

add(1972, "1972_clean_water_act_veto_override", "Enactment of the Clean Water Act of 1972 (Overriding Nixon's Veto)", "News", "1972 (Clean Water Act Landmark)", "Energy & Climate", 1,
  "Congress overwhelmingly overriding Nixon's budget veto (52-12 in Senate, 247-23 in House) to fund $24 billion for municipal sewage treatment and set the goal of swimmable/fishable waters.",
  "1 = Imperative Moral and Ecological Investment Rescuing Dying Rivers and Lakes from Industrial Chemical Sewage", "10 = Recklessly Expensive $24 Billion Spending Spree That Fuels Dangerous Inflation and Preempts State Clean Water Authority", 2, 8, 8, 1, 8, 1);

add(1972, "1972_title_ix_education_amendments", "Title IX of the Education Amendments of 1972 (Gender Discrimination Ban)", "News", "1972 (Title IX Enactment)", "Education", 1,
  "Landmark federal civil rights law prohibiting sex discrimination in any federally funded education program, unlocking women's collegiate sports and admissions.",
  "1 = Transformative Civil Rights Milestone Guaranteeing Equal Athletic and Academic Opportunities for Women and Girls", "10 = Federal Bureaucratic Social Engineering Mandating Proportionality That Will Destroy Historic Men's Sports Programs", 2, 8, 4, 1, 9, 1);

add(1972, "1972_equal_rights_amendment_senate_approval", "Equal Rights Amendment Approved by Senate (84-8) & Sent to States", "News", "1972 (ERA Ratification Drive)", "Civil Rights & Social Issues", 1,
  "Senate passing the Equal Rights Amendment by overwhelming bipartisan majority, launching the state-level ratification battle championed by feminists.",
  "1 = Simple, Long-Overdue Constitutional Guarantee of Full Legal and Economic Equality for American Women", "10 = Radically Disruptive Amendment Subjecting Women to Military Combat and Dismantling Protective Traditional Family Laws", 2, 8, 4, 1, 10, 1);

add(1972, "1972_nixon_shock_closing_the_gold_window", "Nixon Shock: Suspending Dollar Gold Convertibility & 10% Import Surcharge", "News", "1971-1973 (End of Bretton Woods)", "Economy & Taxation", 1,
  "Nixon unilaterally ending the direct convertibility of the U.S. dollar into gold at $35/ounce, demolishing the Bretton Woods monetary system and floating global currencies.",
  "1 = Necessary Protection Halting European Speculative Gold Runs on Fort Knox and Protecting American Exporters", "10 = Dishonorable Default on America's Sacred Gold Pledge Ushering in Unchecked Worldwide Fiat Inflation and Monetary Instability", 3, 7, 10, 1, 10, 2);

add(1972, "1972_nixon_wage_and_price_freeze_phase_two", "Nixon's Phase I Wage-Price Freeze & Phase II Mandatory Pay/Price Boards", "News", "1971-1973 (Nixon Incomes Policy)", "Economy & Taxation", 1,
  "Imposing a 90-day nationwide freeze on all wages, prices, and rents, followed by the Cost of Living Council regulating industrial wage increases and price margins.",
  "1 = Aggressive Emergency Medicine Halting the Vicious Cycle of Cost-Push Wage-Price Spiral and Stabilizing the Economy", "10 = Totalitarian Peacetime Economic Dictatorship Producing Shortages, Black Markets, and Masking Underlying Inflation", 3, 7, 10, 1, 9, 2);

add(1972, "1972_consumer_product_safety_act_cpsc", "Enactment of the Consumer Product Safety Act of 1972 (Creation of CPSC)", "News", "1972 (CPSC Enactment)", "Healthcare", 2,
  "Establishing an independent regulatory agency with nationwide power to ban hazardous consumer goods, mandate product recalls, and establish safety standards.",
  "1 = Essential Watchdog Protecting Millions of Families from Lethal Flammable Fabrics, Defective Toys, and Dangerous Tools", "10 = Intrusive Nanny-State Bureaucracy Driving Up Costs for Everyday Household Products Through Arbitrary Bans", 2, 8, 9, 1, 9, 1);

add(1972, "1972_furman_v_georgia_death_penalty_struck_down", "Furman v. Georgia Supreme Court Ruling Striking Down State Death Penalties", "News", "1972 (Furman Capital Punishment Ruling)", "Governance & Judiciary", 1,
  "Supreme Court ruling 5-4 that existing state death penalty statutes constitute cruel and unusual punishment under the Eighth Amendment due to arbitrary and racially biased application.",
  "1 = Humane Milestone Halting Barbaric, Capricious, and Racially Prejudiced State-Sanctioned Executions", "10 = Outrageous Judicial Usurpation Striking Down Common-Sense Capital Punishment for Murderers in All 50 States", 2, 9, 3, 1, 10, 1);

add(1972, "1972_eisenstadt_v_baird_contraception_unmarried", "Eisenstadt v. Baird Supreme Court Ruling (Contraceptives for Unmarried Persons)", "News", "1972 (Contraceptive Privacy Expansion)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling under Equal Protection that unmarried individuals have the same constitutional right to obtain contraceptives as married couples.",
  "1 = Fundamental Principle: The Right to Bodily Privacy and Contraception Belongs to Every Individual Person, Not Just Spouses", "10 = Judicial Overreach Undermining State Police Powers Over Public Morals and Encouraging Pre-Marital Sexual Licentiousness", 2, 8, 3, 1, 9, 1);

add(1972, "1972_operation_linebacker_christmas_bombings", "Operation Linebacker I & II (Christmas Bombings of Hanoi and Haiphong)", "News", "1972 (Linebacker Bombing Campaign)", "Foreign Policy & Defense", 1,
  "President Nixon ordering massive B-52 carpet bombing of Hanoi and mining of Haiphong Harbor to force North Vietnam back to Paris negotiating table.",
  "1 = Barbaric Carpet Bombing of Populated Urban Centers Inflicting Horrific Civilian Casualties to Save Face", "10 = Resolute Military Decisiveness Forcing Communist Hanoi to Agree to Peace Terms and Release American POWs", 2, 9, 4, 1, 9, 1);

add(1972, "1972_kissinger_peace_is_at_hand_announcement", "Henry Kissinger's 'Peace Is at Hand' Pre-Election Press Conference", "News", "1972 (Kissinger Peace Announcement)", "Foreign Policy & Defense", 1,
  "National Security Advisor Henry Kissinger declaring on October 26 that 'peace is at hand' in Vietnam just twelve days before the presidential election.",
  "1 = Cynical Election-Eve Deception Fabricated to Guarantee Nixon's 49-State Landslide Victory While Prolonging War", "10 = Factual Announcement Reflecting Months of Brilliant, Patient Secret Diplomacy Nearing Breakthrough Accord", 2, 9, 3, 1, 8, 1);

add(1972, "1972_general_revenue_sharing_enacted", "State and Local Fiscal Assistance Act of 1972 (General Revenue Sharing)", "News", "1972 (General Revenue Sharing Enacted)", "Economy & Taxation", 2,
  "Nixon's signature 'New Federalism' law returning $30 billion in no-strings federal tax revenues directly to states, counties, and cities.",
  "1 = Strengthen Democratic Decentralization Giving Local Communities Total Flexibility to Meet Local Needs Without Federal Red Tape", "10 = Irresponsible Unrestricted Federal Cash Windfalls That Dissolve Local Tax Accountability and Fuel Municipal Bloat", 3, 8, 9, 2, 8, 1);

add(1972, "1972_social_security_twenty_percent_cola", "Social Security 20% Benefit Hike & Enactment of Automatic Cost-of-Living Adjustments", "News", "1972 (Social Security Automatic COLA)", "Labor & Welfare", 1,
  "Bipartisan legislation increasing Social Security benefits by 20% and establishing permanent automatic indexing of future benefits to the Consumer Price Index (CPI).",
  "1 = Historic Compassionate Victory Protecting Millions of Elderly Retirees from Destitution Caused by Rampant Inflation", "10 = Fiscal Time Bomb Automatically Indexing Entitlements That Will Inevitably Bankrupt the Social Security Trust Fund", 2, 8, 10, 1, 9, 1);

add(1972, "1972_supplemental_security_income_ssi_enacted", "Enactment of the Supplemental Security Income (SSI) Program (Title XVI)", "News", "1972 (SSI Enactment)", "Labor & Welfare", 2,
  "Federalizing disparate state welfare programs to create SSI, guaranteeing uniform monthly cash payments to impoverished aged, blind, and disabled Americans.",
  "1 = Dignified Universal Safety Net Ensuring No Elderly or Severely Disabled American Faces Extreme Starvation and Poverty", "10 = Dramatic Expansion of Federal Entitlement Spending Creating Lifetime Dependence on Federal Treasury Checks", 2, 8, 9, 1, 9, 1);

add(1972, "1972_marine_mammal_protection_act_mmpa", "Enactment of the Marine Mammal Protection Act of 1972 (MMPA)", "News", "1972 (MMPA Enacted)", "Energy & Climate", 2,
  "Prohibiting the hunting, capturing, or killing of all whales, dolphins, seals, and sea otters in U.S. waters, and banning import of marine mammal products.",
  "1 = Landmark Moral and Ecological Legislation Protecting Intelligent Marine Wildlife from Brutal Commercial Slaughter", "10 = Overly Rigid Ban Harming Commercial Tuna Fishermen and Preempting Traditional Indigenous Subsistence Hunting", 2, 8, 8, 1, 8, 1);

add(1972, "1972_coastal_zone_management_act", "Enactment of the Coastal Zone Management Act of 1972", "News", "1972 (CZMA Enacted)", "Energy & Climate", 3,
  "Providing federal grants and incentives for coastal states to develop comprehensive management plans balancing shoreline development with ecological preservation.",
  "1 = Protect Vulnerable Beaches, Estuaries, and Wetlands from Unchecked Commercial High-Rise Exploitation", "10 = Federal Encroachment Infringing on Private Coastal Property Rights and Stifling Vital Port Economic Expansion", 2, 8, 8, 1, 8, 1);

add(1972, "1972_noise_control_act_of_1972", "Enactment of the Noise Control Act of 1972 (EPA Noise Standards)", "News", "1972 (Noise Control Enacted)", "Energy & Climate", 3,
  "Directing the EPA to establish national noise emission standards for construction equipment, interstate motor carriers, and commercial machinery.",
  "1 = Necessary Public Health Initiative Reducing Hearing Loss, Sleep Disruption, and Stress Caused by Urban Industrial Noise", "10 = Micro-Managing Bureaucracy Imposing Expensive Soundproofing Mandates on Construction and Transport Contractors", 2, 8, 8, 1, 8, 1);

add(1972, "1972_federal_environmental_pesticide_control_act", "Federal Environmental Pesticide Control Act of 1972 & Full DDT Ban", "News", "1972 (FEPCA Enacted & DDT Ban)", "Energy & Climate", 2,
  "Overhauling pesticide laws to give EPA authority to classify and restrict pesticides; EPA Administrator Ruckelshaus orders an immediate ban on almost all agricultural DDT.",
  "1 = Heroic Science-Based Victory Saving the Bald Eagle, Peregrine Falcon, and Human Food Chains from Toxic Bioaccumulation", "10 = Administrative Overreach Disregarding Evidentiary Hearings and Depriving American Agriculture of a Safe Miracle Insecticide", 2, 8, 8, 1, 8, 1);

add(1972, "1972_equal_employment_opportunity_act_eeoc", "Equal Employment Opportunity Act of 1972 (EEOC Direct Lawsuit Powers)", "News", "1972 (EEOC Litigation Power)", "Civil Rights & Social Issues", 1,
  "Granting the Equal Employment Opportunity Commission (EEOC) the power to file direct federal civil enforcement lawsuits against employers and unions discriminating on race or sex.",
  "1 = Give the EEOC Real Teeth to Punish and Dismantle Systemic Employment Discrimination Across the National Economy", "10 = Empowering a Zealot Federal Agency to File Frivolous Harassment Lawsuits Forcing Companies into Quota Settlements", 2, 8, 5, 1, 9, 1);

add(1972, "1972_national_sickle_cell_anemia_control_act", "National Sickle Cell Anemia Control Act of 1972", "News", "1972 (Sickle Cell Act Enacted)", "Healthcare", 3,
  "First targeted federal funding ($115M) for screening, research, and treatment of sickle cell anemia, a hereditary blood disorder primarily afflicting African-Americans.",
  "1 = Long-Overdue Biomedical Investment Addressing a Devastating, Painful Disease Systematically Neglected by White Medicine", "10 = Support Targeted Medical Research While Ensuring Strict Confidentiality to Prevent Genetic Discrimination in Insurance", 2, 7, 6, 1, 7, 1);

add(1972, "1972_trail_of_broken_treaties_bia_takeover", "Trail of Broken Treaties & American Indian Movement (AIM) Takeover of BIA", "News", "1972 (BIA Headquarters Takeover)", "Civil Rights & Social Issues", 2,
  "Hundreds of Native American activists taking over and occupying the Bureau of Indian Affairs headquarters in Washington D.C. for six days demanding treaty rights.",
  "1 = Justified Militant Resistance Against Century of Broken Federal Treaties, Stolen Lands, and Bureaucratic Paternalism", "10 = Lawless Destruction of Public Property and Looting of Sensitive Historical Records by Armed Political Radicals", 2, 9, 2, 1, 9, 1);

add(1972, "1972_shirley_chisholm_historic_presidential_run", "Shirley Chisholm's 'Unbought and Unbossed' Presidential Campaign", "News", "1972 (Chisholm Historic Candidacy)", "Civil Rights & Social Issues", 2,
  "Congresswoman Shirley Chisholm launching historic campaign as the first Black major-party presidential candidate and first woman on the Democratic primary ballot.",
  "1 = Inspiring, Courageous Breakthrough Shattering Racial and Gender Glass Ceilings in Presidential Politics", "10 = Fringe Primary Distraction Dividing the Democratic Party with Radical Race and Gender Grievance Rhetoric", 2, 8, 3, 1, 9, 1);

add(1972, "1972_george_wallace_assassination_attempt_laurel", "Assassination Attempt on George Wallace in Laurel, Maryland", "News", "1972 (Wallace Shooting Trauma)", "Governance & Judiciary", 1,
  "George Wallace shot five times by Arthur Bremer at a Maryland campaign shopping center rally, leaving the leading populist candidate permanently paralyzed from the waist down.",
  "1 = Horrific Attack on Democracy / Reaffirm Total Condemnation of Political Assassinations and Domestic Gun Violence", "10 = Tragic Slaying of the Working Man's Champion by a Deranged Gunman / Pray for Governor Wallace's Courageous Recovery", 3, 8, 5, 1, 10, 1);

add(1972, "1972_john_lennon_ins_deportation_proceedings", "INS Deportation Proceedings Against John Lennon Following Anti-War Activism", "News", "1972-1975 (Lennon Deportation Arc)", "Civil Rights & Social Issues", 2,
  "Nixon Administration and INS initiating deportation proceedings against former Beatle John Lennon based on a minor UK marijuana conviction to suppress youth anti-war concert tour.",
  "1 = Tyrannical Abuse of Federal Immigration and Surveillance Machinery to Silence and Expel a Peaceful Anti-War Artist", "10 = Lawful Enforcement of Federal Immigration Statutes Barring Foreign Convicted Drug Offenders from Residing in America", 2, 9, 1, 1, 9, 1);

add(1972, "1972_federal_election_campaign_act_1971_enacted", "Federal Election Campaign Act of 1971 (FECA - First Disclosure Mandate)", "News", "1972 (FECA 1971 Effective)", "Governance & Judiciary", 2,
  "First federal statute requiring comprehensive public disclosure of campaign contributions and spending for federal office and capping media advertising expenditures.",
  "1 = Essential Weapon Shining Sunlight on Corrupting Big-Money Donations and Corporate Slush Funds in Elections", "10 = Intrusion on Political Speech and Donors' Constitutional Right to Support Candidates Free from Government Retaliation", 2, 8, 8, 1, 8, 1);

add(1972, "1972_all_volunteer_military_force_transition", "Nixon's Order Ending the Military Draft and Creating the All-Volunteer Force", "News", "1972-1973 (All-Volunteer Force Transition)", "Foreign Policy & Defense", 1,
  "Defense Secretary Laird and Nixon ending conscription calls and ordering transition to an all-volunteer professional military with increased soldier pay.",
  "1 = Total Abolition of Coercive Military Enslavement / A Free Republic Must Never Force Its Citizens to Kill and Die", "10 = Splendid Triumph for Individual Freedom and Professional Armed Forces Based on Voluntary Service and High Pay", 3, 8, 10, 1, 9, 1);

add(1972, "1972_great_grain_robbery_soviet_wheat_deal", "U.S.-Soviet Wheat Deal ('The Great Grain Robbery') & Bread Price Inflation", "News", "1972-1973 (Grain Robbery Scandal)", "Agriculture & Food", 1,
  "Soviet Union secretly purchasing one-fourth of the American wheat harvest with subsidized U.S. credit, depleting domestic grain reserves and doubling bread and meat prices.",
  "1 = Incompetent, Corrupt Mismanagement by Agribusiness Cronies Lining Corporate Pockets While American Families Starve", "10 = Historic Commercial Export Boom Opening Massive New Overseas Agricultural Markets for American Grain Producers", 2, 8, 8, 1, 8, 1);

add(1972, "1972_shafer_commission_marijuana_decriminalization", "Shafer Commission Report Recommending Decriminalization of Personal Marijuana", "News", "1972 (Shafer Commission Findings)", "Civil Rights & Social Issues", 2,
  "Nixon-appointed National Commission on Marihuana unanimously recommending ending criminal penalties for private possession and casual transfer of cannabis.",
  "1 = Follow the Unanimous Scientific Consensus: Stop Wasting Police Resources Ruining Young Lives for Private Cannabis Smoking", "10 = Reject the Commission's Permissive Findings / Nixon Rightly Vows Never to Legalize Harmful Narcotics", 2, 9, 10, 1, 10, 1);

add(1972, "1972_lemon_v_kurtzman_parochial_school_aid", "Lemon v. Kurtzman Supreme Court Ruling (Three-Pronged Lemon Test)", "News", "1971-1972 (Lemon Establishment Clause Standard)", "Governance & Judiciary", 2,
  "Supreme Court establishing the three-pronged 'Lemon test', ruling state salary subsidies for religious parochial school teachers violate the Establishment Clause.",
  "1 = Essential Defense of the Constitutional Wall of Separation Between Church and State in Public Education", "10 = Hostility Toward Religious Education Denying Parochial School Parents Fair Tax Relief for Educating Their Children", 2, 9, 4, 1, 10, 1);

add(1972, "1972_alaska_native_claims_settlement_act_ancsa", "Implementation of the Alaska Native Claims Settlement Act (ANCSA)", "News", "1971-1973 (ANCSA Implementation)", "Energy & Climate", 2,
  "Extinguishing aboriginal land claims in Alaska in exchange for 44 million acres of land and $962.5 million transferred to Native regional and village corporations.",
  "1 = Historic Settlement Providing Self-Determination and Economic Sovereignty for Alaska's Native Peoples", "10 = Necessary Prerequisite Clearing Legal Title So Private Enterprise Can Construct the Trans-Alaska Oil Pipeline", 2, 8, 6, 1, 8, 1);

add(1972, "1972_house_esch_busing_ban_amendment", "House Passage of Esch Anti-Busing Amendment to Education Bill", "News", "1972 (Esch Amendment Busing Battles)", "Education", 1,
  "House voting 272-140 to prohibit federal court-ordered busing beyond the next-closest school and barring federal funds from being used for desegregation busing.",
  "1 = Cowardly Retrogression Defying Federal Courts and Halting Desegregation of Northern and Southern Classrooms", "10 = Common-Sense Will of the American People Refusing to Sacrifice Children to Forced Social Engineering Busing Quotas", 2, 9, 8, 1, 10, 1);

add(1972, "1972_rural_development_act_of_1972", "Enactment of the Rural Development Act of 1972", "News", "1972 (Rural Development Enacted)", "Agriculture & Food", 3,
  "Authorizing major loan guarantees and grants to expand rural water systems, small-town sewer infrastructure, and rural industrial enterprise.",
  "1 = Vital Federal Support Revitalizing Neglected Small Towns and Stemming Rural Economic Depopulation", "10 = Excessive Federal Spending Creating Regional Pork Projects That Displace Private Agricultural Credit Banks", 2, 7, 7, 1, 7, 1);

add(1972, "1972_osha_asbestos_dust_standard_issued", "First Emergency OSHA Workplace Health Standard: Asbestos Dust Limits", "News", "1972 (OSHA Asbestos Standard)", "Labor & Welfare", 2,
  "OSHA issuing its first comprehensive health regulation, capping airborne asbestos fibers at 5 fibers/mL to halt shipyard and construction worker mesothelioma.",
  "1 = Life-Saving Industrial Standard Rescuing Millions of Insulation and Construction Workers from Fatal Lung Asbestosis", "10 = Overly Strict Standard Forcing Drastic Machinery Upgrades and Liability Panics on Chemical and Building Manufacturers", 2, 8, 8, 1, 8, 1);

add(1972, "1972_ports_and_waterways_safety_act", "Enactment of the Ports and Waterways Safety Act of 1972", "News", "1972 (Tanker Safety Enacted)", "Energy & Climate", 3,
  "Empowering the Coast Guard to regulate vessel traffic in ports and set structural safety standards for bulk oil tankers to prevent marine oil spills.",
  "1 = Essential Prevention Halting Catastrophic Tanker Groundings and Catastrophic Coastal Petroleum Spills", "10 = Impractical Coast Guard Vessel Speed Limits and Construction Mandates That Hamper Maritime Shipping Efficiency", 2, 8, 8, 1, 8, 1);

add(1972, "1972_automobile_5_mph_bumper_safety_rule", "DOT Mandating 5-MPH Energy-Absorbing Front and Rear Bumpers on Passenger Cars", "News", "1972-1973 (5-MPH Bumper Standard)", "Technology & Infrastructure", 3,
  "Federal motor vehicle safety standard requiring 1973-1974 model cars to withstand 5-mph front and 2.5-mph rear impacts without safety damage.",
  "1 = Substantially Reduce Consumer Repair Costs and Prevent Structural Damage in Everyday Low-Speed Parking Lot Collisions", "10 = Heavy, Ugly Bumper Mandates Adding 100+ Pounds to Automobiles, Dragging Down Fuel Economy, and Raising Vehicle Prices", 2, 7, 8, 1, 8, 1);

add(1972, "1972_national_cancer_act_war_on_cancer_rollout", "Rollout of the National Cancer Act of 1971 ('War on Cancer')", "News", "1971-1973 (War on Cancer Funding)", "Healthcare", 2,
  "Nixon and Congress pouring $1.6 billion into the National Cancer Institute to conquer cancer within the decade, creating comprehensive cancer centers.",
  "1 = Noble National Biomedical Crusade Dedicated to Curing Humanity's Deadliest Plague Through Unprecedented Science Funding", "10 = Celebrate Massive Scientific Search for Cures While Guarding Against Monolithic Bureaucratic Monopolies on Research", 2, 7, 6, 1, 7, 1);

add(1972, "1972_black_september_munich_olympics_airline_security", "Munich Olympics Terrorist Massacre & FAA Mandatory Airport Security Screenings", "News", "1972-1973 (Munich Massacre & FAA Screening)", "Foreign Policy & Defense", 1,
  "Murder of 11 Israeli Olympic athletes by Black September terrorists; FAA issues emergency rule mandating 100% inspection of carry-on baggage and metal detectors.",
  "1 = Tragic Wakeup Call Demanding Coordinated Global Action Against State-Sponsored International Terrorism and Anti-Semitism", "10 = Immediate Strict Airport Magnetometers and Armed Guards at Every Gate to Prevent Skyjackings and Terrorist Infiltration", 2, 8, 5, 1, 8, 1);

add(1972, "1972_highway_trust_fund_mass_transit_controversy", "Battle to Open the Highway Trust Fund for City Subway and Bus Construction", "News", "1972-1973 (Highway Trust Fund Flex)", "Technology & Infrastructure", 2,
  "Senate passing measure to let urban cities divert Highway Trust Fund gas taxes to build rapid transit rails; highway lobby blocks it in the House.",
  "1 = High Time to Break the Highway Concrete Monopoly and Fund Energy-Efficient Rapid Transit for Crowded Cities", "10 = Theft of Gasoline Taxes Paid by Motorists Dedicated Exclusively to Building and Maintaining Highways and Bridges", 2, 8, 9, 1, 9, 1);

add(1972, "1972_clemency_for_vietnam_draft_evaders_debate", "Debate over Amnesty or Clemency for 50,000 Vietnam Draft Resisters in Canada", "News", "1972 (Draft Amnesty Debate)", "Governance & Judiciary", 2,
  "McGovern pledging unconditional amnesty for young men who fled to Canada or went underground to avoid the draft; Nixon vows never to grant amnesty.",
  "1 = Grant Full Unconditional Amnesty to Healed a Fractured Nation / Resisting an Immoral War Was an Act of Conscience", "10 = Absolute Betrayal of 50,000 Brave American Boys Who Died in Combat / Draft Dodgers Must Face Full Justice", 2, 9, 3, 1, 10, 1);

add(1972, "1972_emergency_detention_act_repeal", "Repeal of Title II of the Internal Security Act (Emergency Detention Act)", "News", "1971-1972 (Title II Concentration Camp Repeal)", "Civil Rights & Social Issues", 2,
  "Congress repealing the 1950 McCarran Act provision authorizing executive detention camps for suspected subversives during national emergencies.",
  "1 = Essential Eradication of Totalitarian Legal Machinery Evoking Japanese Internment Camps from American Jurisprudence", "10 = Repeal Was Proper to Preserve Constitutional Liberty Free from Wartime Concentration Camp Paranoia", 2, 7, 2, 1, 6, 1);

add(1972, "1972_trans_alaska_pipeline_wilderness_injunctions", "Wilderness Society Federal Injunction Halting Trans-Alaska Pipeline Construction", "News", "1970-1973 (TAPS Environmental Lawsuits)", "Energy & Climate", 2,
  "Environmental groups winning federal court injunction under NEPA freezing the 800-mile Trans-Alaska Pipeline pending permafrost and earthquake impact studies.",
  "1 = Protect Alaska's Fragile Arctic Ecosystem, Caribou Migrations, and Permafrost from Irreversible Oil Spills", "10 = Sabotage by Extreme Environmentalists Paralyzing America's Most Vital Domestic Energy Security Infrastructure", 2, 9, 9, 1, 9, 1);

add(1972, "1972_secret_bombing_of_cambodia_revelations", "Senate Revelations of Covert Secret Bombing of Cambodia (Operation Freedom Deal)", "News", "1969-1973 (Covert Indochina Bombing)", "Foreign Policy & Defense", 1,
  "Congressional committees uncovering thousands of secret B-52 bombing sorties flown over neutral Cambodia with falsified Pentagon flight records.",
  "1 = Blatant Deception and Secret War Trampling the Constitution, Congressional Oversight, and International Law", "10 = Legitimate Commander-in-Chief Wartime Deception Necessary to Protect American Lives and Destroy Enemy Sanctuaries", 2, 9, 3, 1, 9, 1);

add(1972, "1972_nixon_49_state_landslide_mandate", "Nixon's 49-State Presidential Landslide Victory (60.7% Popular Vote)", "News", "1972 (Nixon 49-State Mandate)", "Governance & Judiciary", 1,
  "Nixon crushing McGovern by 23 percentage points and carrying every state except Massachusetts and DC, claiming a massive mandate for centrist peace.",
  "1 = Rejection of a Flawed McGovern Campaign; Democrats Retained Strong Majorities in Both House and Senate", "10 = Decisive Historical Vindication of Nixon's Leadership, Law and Order, and Honorable Foreign Policy by Middle America", 2, 9, 7, 1, 9, 1);

add(1972, "1972_federal_railroad_safety_act_standards", "FRA Issuing First Comprehensive Federal Track Safety Standards", "News", "1972 (FRA Track Standards)", "Technology & Infrastructure", 3,
  "Federal Railroad Administration issuing mandatory track safety, maintenance, and maximum operating speed rules for 300,000 miles of deteriorating rail lines.",
  "1 = Urgent National Action Halting Epidemic Railroad Derailments and Protecting Toxic Cargo from Exploding in Towns", "10 = Heavy Capital Cost Mandates Driving Financially Teetering Railroad Companies Deeper into Bankruptcy", 2, 7, 8, 1, 8, 1);

add(1972, "1972_us_subsidized_shipbuilding_merchant_marine", "Merchant Marine Act Subsidies for Commercial Supertankers and LNG Carriers", "News", "1970-1972 (Maritime Subsidies Program)", "Technology & Infrastructure", 3,
  "Federal Maritime Administration awarding $300M in construction-differential subsidies to build modern supertankers and liquefied natural gas (LNG) tankers in U.S. yards.",
  "1 = Vital Strategic Program Preserving Skilled American Shipyard Jobs and Merchant Marine National Security Sealift Capacity", "10 = Chronic Corporate Welfare Proping Up Noncompetitive Domestic Shipyards That Charge Triple Global Market Rates", 2, 8, 8, 1, 8, 1);
`;

content += additions;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Appended 1972 successfully.');
