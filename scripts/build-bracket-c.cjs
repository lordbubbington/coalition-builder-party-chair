/**
 * scripts/build-bracket-c.cjs
 * Issues dataset for 1976, 1978, 1980, 1982 election cycles (Bracket C).
 * 50 issues per cycle across all 10 tiers (200 total).
 */

const fs = require('fs');
const path = require('path');

const ISSUES = [];

function add(cycle, id, name, type, eraSpan, domain, tier, debate, pole1, pole10, dem, gop, lib, grn, con, soc) {
  ISSUES.push({
    cycle, id, name, type, eraSpan, domain, tier, debate, pole1, pole10,
    stances: { dem, gop, lib, grn, con, soc }
  });
}

// =========================================================================
// 1976 (50 Issues)
// =========================================================================
add(1976, "1976_jimmy_carter_outsider_moral_crusade", "Jimmy Carter's Post-Watergate Outsider Appeal ('I Will Never Lie to You')", "News", "1976 (Carter Integrity Candidacy)", "Governance & Judiciary", 1,
  "Georgia governor Jimmy Carter running as a born-again Christian political outsider promising moral honesty, government reorganization, and healing after Watergate.",
  "1 = Essential Moral Restoration Sweeping Away Washington Corruption and Restoring Trust in the Republic", "10 = Inexperienced Southern Preacher Lacking Foreign Policy Competence and Economic Gravitas", 2, 8, 4, 1, 7, 1);

add(1976, "1976_gerald_ford_eastern_europe_debate_gaffe", "Gerald Ford's Presidential Debate Gaffe on Eastern Europe", "News", "1976 (Ford Foreign Policy Debate Gaffe)", "Foreign Policy & Defense", 1,
  "President Ford declaring in the October debate that 'there is no Soviet domination of Eastern Europe and there never will be under a Ford administration', halting his campaign momentum.",
  "1 = Shocking Ignorance and Denial of the Brutal Soviet Enslavement of Poland, Czechoslovakia, and Eastern Europe", "10 = Ford Was Speaking Philosophically About the Undaunted Spiritual Independence of Eastern European Peoples", 2, 9, 4, 1, 9, 1);

add(1976, "1976_hyde_amendment_medicaid_abortion_ban", "Enactment of the Hyde Amendment (Barring Federal Medicaid Abortion Funding)", "News", "1976 (Hyde Amendment Inception)", "Healthcare", 1,
  "Congress attaching Henry Hyde's rider to the HEW appropriation bill barring the use of federal Medicaid funds for abortions except when the mother's life is endangered.",
  "1 = Cruel Injustice Depriving Poor and Minority Women of Safe, Legal Constitutional Reproductive Healthcare", "10 = Sacred Moral Principle: No Pro-Life American Taxpayer Dollar Should Ever Finance the Destruction of Unborn Human Life", 2, 9, 7, 1, 10, 1);

add(1976, "1976_swine_flu_immunization_scare_and_liability", "National Swine Flu Immunization Program & Vaccine Liability Crisis", "News", "1976 (Swine Flu Crisis)", "Healthcare", 1,
  "Federal mass vaccination campaign suspended after 45 million Americans were inoculated due to rare cases of Guillain-Barre paralysis and the absence of a pandemic outbreak.",
  "1 = Sound Preventive Public Health Preparedness Protecting the Public, Though Indemnification Lessons Must Be Learned", "10 = Panic-Driven Government Overreach and Bureaucratic Folly Exposing Citizens to Experimental Vaccines and Massive Liability", 2, 7, 9, 1, 8, 1);

add(1976, "1976_toxic_substances_control_act_tsca", "Enactment of the Toxic Substances Control Act of 1976 (TSCA)", "News", "1976 (TSCA Enacted)", "Energy & Climate", 1,
  "Granting EPA broad authority to track 75,000 industrial chemicals produced in the U.S. and ban those posing unreasonable health or environmental risks (including banning PCBs).",
  "1 = Vital Public Health Milestone Protecting Everyday Americans from Invisible Carcinogens and Persistent Toxic Poisons", "10 = Crushing Regulatory Stagnation Stifling American Chemical Innovation and Threatening Global Competitiveness", 2, 8, 8, 1, 8, 1);

add(1976, "1976_buckley_v_valeo_campaign_spending_ruling", "Buckley v. Valeo Supreme Court Ruling (Money as Speech)", "News", "1976 (Buckley Campaign Finance Decision)", "Governance & Judiciary", 1,
  "Supreme Court ruling that mandatory campaign expenditure limits violate First Amendment free speech, while upholding contribution limits and voluntary public funding.",
  "1 = Disastrous Ruling Equating Wealthy Campaign Spending with Free Speech, Unleashing Billionaire and Special Interest Politics", "10 = Sound Defense of the First Amendment: Political Speech Requires Financial Resources to Reach Citizens", 2, 9, 9, 1, 8, 1);

add(1976, "1976_gregg_v_georgia_death_penalty_reinstated", "Gregg v. Georgia Supreme Court Ruling Reinstating the Death Penalty", "News", "1976 (Death Penalty Reinstated)", "Governance & Judiciary", 1,
  "Supreme Court ruling 7-2 that guided-discretion capital sentencing statutes satisfy the Eighth Amendment, ending the four-year nationwide moratorium on executions.",
  "1 = Tragic Moral Retrogression Permitting Barbaric, Arbitrary, and Fallible State-Sanctioned Executions to Resume", "10 = Essential Reaffirmation of Just Retribution and Ultimate Punishment for Heinous Capital Murderers", 2, 9, 3, 1, 10, 1);

add(1976, "1976_church_committee_cia_fbi_revelations", "Senate Church Committee Final Report on CIA, FBI, and NSA Illegal Abuses", "News", "1975-1976 (Church Committee Exposés)", "Governance & Judiciary", 1,
  "Senate committee revealing decades of illegal intelligence abuses, including assassination plots, LSD testing (MKUltra), FBI wiretapping of MLK, and NSA cable interception.",
  "1 = Urgent Reassertion of Constitutional Restraints, Strict Intelligence Warrants, and Permanent Congressional Oversight", "10 = Reckless Partisan Witch Hunt Crippling America's Covert Intelligence Shield in the Middle of the Deadly Cold War", 2, 9, 1, 1, 8, 1);

add(1976, "1976_ronald_reagan_primary_challenge_ford", "Ronald Reagan's Conservative Primary Insurgency Against Gerald Ford", "News", "1976 (Reagan GOP Insurgency)", "Governance & Judiciary", 1,
  "Former California Governor Ronald Reagan challenging the sitting president from the right, attacking detente, the Panama Canal treaties, and the Washington establishment.",
  "1 = Dangerous Radical Right-Wing Extremism Seeking to Shatter Bipartisan Internationalism and Social Moderation", "10 = Bold Uncompromising Conservative Movement Rescuing the Republican Party from Country-Club Pragmatism and Defeatism", 3, 10, 8, 1, 10, 1);

add(1976, "1976_panama_canal_treaties_debate_reagan", "Ronald Reagan's Campaign Against 'Surrendering' the Panama Canal", "News", "1976-1978 (Panama Canal Debate Genesis)", "Foreign Policy & Defense", 1,
  "Reagan electrifying primary voters with his fiery slogan: 'We bought it, we paid for it, we built it, and we intend to keep it!', opposing Ford and Carter's treaty negotiations.",
  "1 = Essential Modern Decolonization Building Equitable Hemispheric Alliances and Neutrality in Latin America", "10 = Unthinkable Strategic Humiliation and Surrender of Sovereign American Property to a Marxist-Friendly Dictator", 2, 10, 6, 1, 10, 1);

add(1976, "1976_resource_conservation_and_recovery_act_rcra", "Enactment of the Resource Conservation and Recovery Act of 1976 (RCRA)", "News", "1976 (RCRA Hazardous Waste)", "Energy & Climate", 1,
  "Establishing federal 'cradle-to-grave' regulatory tracking of hazardous chemical waste generation, transportation, storage, and disposal.",
  "1 = Essential Protection Halting Toxic Midnight Dumping and Forcing Chemical Producers to Safely Contain Lethal Industrial Wastes", "10 = Mountainous Paperwork and Inspection Costs Paralyzing American Heavy Manufacturing and Chemical Plants", 2, 8, 8, 1, 8, 1);

add(1976, "1976_tax_reform_act_of_1976", "Tax Reform Act of 1976 (Minimum Tax Hike & Capital Gains Holding Extension)", "News", "1976 (Tax Reform Act)", "Economy & Taxation", 2,
  "Doubling the minimum tax on wealthy preference income to 15%, eliminating tax shelters, and extending the capital gains asset holding period from 6 to 12 months.",
  "1 = Progressive Equity Closing Outrageous Loopholes That Allowed Millionaires and Real Estate Speculators to Escape Taxes", "10 = Punitive Tax On Investment Capital and Asset Formation That Will Dry Up Venture Financing and Stifle New Jobs", 2, 8, 10, 1, 9, 1);

add(1976, "1976_bicentennial_celebrations_and_unity", "United States Bicentennial Celebrations (July 4, 1976)", "News", "1976 (Bicentennial Celebrations)", "Governance & Judiciary", 2,
  "Nationwide celebration of 200 years of American independence featuring Operation Sail tall ships in New York Harbor and fireworks across all 50 states.",
  "1 = Inclusive Celebration of Democratic Struggle and the Continuing Journey Toward Liberty and Equal Justice for All", "10 = Joyful, Patriotic Reaffirmation of American Exceptionalism, Christian Heritage, and Constitutional Glory", 2, 7, 5, 2, 8, 1);

add(1976, "1976_flpma_ending_homesteading_blm_retention", "Federal Land Policy and Management Act of 1976 (FLPMA)", "News", "1976 (FLPMA BLM Organic Act)", "Energy & Climate", 2,
  "Formally repealing the 1862 Homestead Act and declaring public domain lands shall be retained in perpetual federal ownership under BLM multiple-use management.",
  "1 = Historic Conservation Act Ending Reckless Land Giveaways and Mandating Science-Based Conservation on 450M Public Acres", "10 = Imperial Federal Land Lockup Trampling Western State Sovereignty and Grazing Rights, Sparking Sagebrush Rebellion", 2, 9, 9, 1, 10, 1);

add(1976, "1976_national_forest_management_act_nfma", "Enactment of the National Forest Management Act of 1976 (NFMA)", "News", "1976 (NFMA Clearcutting Reform)", "Energy & Climate", 2,
  "Overhauling U.S. Forest Service planning in response to the Monongahela clearcutting court ruling, establishing mandatory timber harvest limits and public participation.",
  "1 = Halt Devastating Clearcutting That Causes Catastrophic Soil Erosion, Silting of Trout Streams, and Habitat Destruction", "10 = Excessive Procedural Hurdles and Appeals Paralyzing Commercial Timber Supplies Essential for Affordable Homebuilding", 2, 8, 8, 1, 8, 1);

add(1976, "1976_arms_export_control_act_of_1976", "Enactment of the Arms Export Control Act of 1976 (AECA)", "News", "1976 (Arms Export Controls)", "Foreign Policy & Defense", 2,
  "Granting Congress the authority to veto major foreign military sales and establishing human rights eligibility criteria for American military arms recipients.",
  "1 = Essential Restraint Halting the Obscene Worldwide Proliferation of Deadly American Weapons to Brutal Right-Wing Dictators", "10 = Disastrous Congressional Meddling Damaging Vital Security Alliances in the Middle East and Driving Allies to Soviet Arms", 2, 8, 4, 1, 8, 1);

add(1976, "1976_copyright_act_of_1976_overhaul", "Enactment of the Copyright Act of 1976 (Life Plus 50 Years)", "News", "1976 (Copyright Overhaul)", "Technology & Infrastructure", 3,
  "First comprehensive overhaul of U.S. copyright law since 1909, extending protection to author's life plus 50 years and codifying the judicial 'fair use' doctrine.",
  "1 = Modern Intellectual Property Framework Protecting Creative Authors, Composers, and Accommodating Academic Fair Use", "10 = Excessive Monopoly Length Stifling Cultural Innovation and Public Domain Access in the Emerging Information Age", 2, 7, 7, 2, 7, 1);

add(1976, "1976_teton_dam_catastrophic_collapse", "Catastrophic Failure of Teton Dam in Idaho & Federal Dam Safety Review", "News", "1976 (Teton Dam Disaster)", "Energy & Climate", 2,
  "Bureau of Reclamation earthen dam collapsing upon first filling, releasing 80 billion gallons of water, killing 11 people, and causing $1B in agricultural damages.",
  "1 = Tragic Indictment of Bureaucratic Arrogance and Pork-Barrel Dam Building Overriding Geologic Hazard Warnings", "10 = Mourn the Victims / Re-engineer Dam Inspection Protocols Without Halting Vital Western Water Storage Infrastructure", 2, 8, 7, 1, 8, 1);

add(1976, "1976_california_prop_15_nuclear_initiative", "Defeat of California Proposition 15 (Nuclear Power Plant Moratorium)", "News", "1976 (Prop 15 Nuclear Initiative)", "Energy & Climate", 2,
  "California voters rejecting (67% to 33%) an initiative to freeze nuclear plant construction until waste storage and safety liabilities were fully resolved.",
  "1 = Rejection Was Driven by Massive Utility Industry Spending; Nuclear Waste and Meltdown Risks Remain Catastrophic", "10 = Common-Sense Rejection of Luddite Anti-Energy Extremism / Clean Commercial Nuclear Power Is Vital for Growth", 2, 8, 8, 1, 8, 1);

add(1976, "1976_new_jersey_atlantic_city_casino_gambling", "New Jersey Voters Approve Legalized Casino Gambling in Atlantic City", "News", "1976 (Atlantic City Casino Referendum)", "Economy & Taxation", 2,
  "New Jersey constitutional referendum passing (56% to 44%) legalizing casino gambling exclusively in Atlantic City to generate tax revenue and rebuild the resort.",
  "1 = Immoral Exploitation of Working-Class Gamblers Bringing Organized Crime, Addiction, and Social Ruin to Coastal Towns", "10 = Visionary Economic Redevelopment Unleashing Hundreds of Millions in Private Capital and Tourism Jobs Without New Taxes", 3, 7, 6, 2, 7, 1);

add(1976, "1976_legionnaires_disease_philadelphia_outbreak", "Outbreak of Mysterious Legionnaires' Disease at Philadelphia Convention (29 Dead)", "News", "1976 (Legionnaires' Outbreak)", "Healthcare", 2,
  "CDC epidemiologists racing to identify mysterious fatal pneumonia striking attendees of an American Legion convention at the Bellevue-Stratford Hotel.",
  "1 = Vital Proof of the Indispensable Value of the Federal CDC and Biomedical Research Protecting Public Health", "10 = Commend Dedicated CDC Scientists While Avoiding Panic That Harms American Tourism and Hotel Businesses", 2, 7, 6, 1, 7, 1);

add(1976, "1976_concorde_supersonic_flights_dulles", "First Commercial British-French Concorde SST Flights Land at Washington Dulles", "News", "1976 (Concorde Commercial Service)", "Technology & Infrastructure", 3,
  "DOT permitting commercial supersonic Concorde flights to Dulles Airport over fierce local community protests regarding deafening sonic booms and noise pollution.",
  "1 = Deafening Imperialist Vanity Flights Shattering Suburban Peace and Damaging the Upper Ozone Layer for the Ultra-Wealthy", "10 = Welcome International Technological Progress and Prestigious Transatlantic Speed Enhancing Global Commerce", 3, 7, 7, 1, 7, 1);

add(1976, "1976_viking_lander_first_mars_surface_images", "NASA Viking 1 & 2 Successful Robotic Landings on Mars", "News", "1976 (Viking Mars Landings)", "Technology & Infrastructure", 2,
  "First successful American robotic surface exploration of Mars transmitting color photographs of rocky red Martian deserts and testing for extraterrestrial life.",
  "1 = Spectacular Human Scientific Triumph Expanding Our Understanding of the Cosmos and Biological Origins", "10 = Proud Symbol of American Technological Preeminence Inspiring National Confidence in the Cold War", 2, 7, 6, 2, 7, 1);

add(1976, "1976_magnuson_stevens_fishery_act", "Enactment of the Magnuson Fishery Conservation and Management Act (200-Mile EEZ)", "News", "1976 (Magnuson Act 200-Mile Limit)", "Energy & Climate", 2,
  "Extending U.S. coastal fishery jurisdiction out to 200 nautical miles, expelling foreign factory trawlers and creating regional fishery management councils.",
  "1 = Historic Victory Protecting American Coastal Fishermen and Rebuilding Depleted Fish Stocks from Foreign Overfishing", "10 = Reaffirm Sovereign Control Over Coastal Waters While Establishing Flexible Science-Based Commercial Harvest Quotas", 2, 8, 7, 1, 8, 1);

add(1976, "1976_railroad_conrail_creation_4r_act", "Railroad Revitalization and Regulatory Reform Act of 1976 (4R Act / Conrail)", "News", "1976 (Conrail & 4R Act)", "Technology & Infrastructure", 2,
  "Consolidating six bankrupt northeastern railroads (including Penn Central) into the federally subsidized Consolidated Rail Corporation (Conrail).",
  "1 = Essential Public Investment Preserving the Industrial Rail Freight Backbone of the Midwest and Northeast", "10 = Massive Multi-Billion Dollar Government Bailout Nationalizing Insolvent Private Lines Instead of Permitting Free Restructuring", 2, 8, 9, 1, 9, 1);

add(1976, "1976_sunshine_in_the_government_act", "Enactment of the Government in the Sunshine Act of 1976", "News", "1976 (Sunshine Act Enacted)", "Governance & Judiciary", 2,
  "Requiring federal multi-member agencies, boards, and commissions to hold their business meetings in public session with advance public notice.",
  "1 = Crucial Sunlight Shining on Secret Bureaucratic Deals and Empowering Citizens to Hold Regulators Accountable", "10 = Sensible Openness, Provided Sensitive Commercial Trade Secrets and Personnel Matters Remain Confidential", 2, 7, 2, 1, 7, 1);

add(1976, "1976_cafe_fuel_economy_standards_promulgated", "NHTSA Promulgation of First Corporate Average Fuel Economy (CAFE) Standards", "News", "1975-1976 (CAFE Standards Implementation)", "Energy & Climate", 1,
  "Setting mandatory fleet average fuel economy for automakers starting at 18 mpg in 1978 and ramping up to 27.5 mpg by 1985 to curb oil dependence.",
  "1 = Indispensable Federal Regulation Forcing Detroit Big Three to Stop Building Gas-Guzzling Tanks and Conserve Oil", "10 = Arbitrary Command-and-Control Mandate Forcing Automakers to Build Dangerous, Lightweight Matchbox Cars That Kill Drivers", 2, 8, 8, 1, 9, 1);

add(1976, "1976_b1_bomber_production_decision_ford", "President Ford Ordering Full Production of the Rockwell B-1A Strategic Bomber", "News", "1976 (B-1 Bomber Production Authorization)", "Foreign Policy & Defense", 1,
  "Ford authorizing procurement of 244 variable-sweep B-1 supersonic bombers at $100M each to replace aging B-52s; Jimmy Carter campaigns against it as a wasteful dinosaur.",
  "1 = Colossal Wasteful Boondoggle Building Obsolescent Manned Bombers Vulnerable to Soviet Air Defenses When Cruise Missiles Are Cheaper", "10 = Indispensable Modernization of the Airborne Leg of the Strategic Nuclear Triad Needed to Penetrate Soviet Air Space", 2, 9, 4, 1, 9, 1);

add(1976, "1976_grain_inspection_scandal_fgis_creation", "Federal Grain Inspection Scandal & Creation of Federal Grain Inspection Service (FGIS)", "News", "1975-1976 (Grain Elevator Bribery Exposé)", "Agriculture & Food", 3,
  "Indictments of commercial grain inspectors in New Orleans and Houston taking bribes to certify dirty, short-weight grain exports; Congress creates federal FGIS.",
  "1 = End Corrupt Commercial Bribery That Blackened America's Agricultural Reputation Across World Grain Markets", "10 = Replace Private Monopolies with Federal Standards Without Slowing Down Rapid Export Terminal Operations", 2, 7, 7, 1, 7, 1);

add(1976, "1976_runyon_v_mccrary_private_school_discrimination", "Runyon v. McCrary Supreme Court Ruling (Civil Rights Act Applies to Private Schools)", "News", "1976 (Runyon Private School Segregation)", "Civil Rights & Social Issues", 1,
  "Supreme Court ruling 7-2 under 42 U.S.C. 1981 that private non-sectarian schools cannot deny admission to qualified Black students based on race.",
  "1 = Essential Eradication of Racist White 'Segregation Academies' Evading Public School Desegregation Orders", "10 = Overreaching Federal Destruction of Private Contract Freedom and Association in Independent Schools", 2, 8, 5, 1, 9, 1);

add(1976, "1976_carter_playboy_interview_lust_in_my_heart", "Jimmy Carter's Playboy Interview ('Committed Adultery in My Heart')", "News", "1976 (Carter Playboy Interview Shock)", "Governance & Judiciary", 2,
  "Carter granting an interview to Playboy magazine admitting he has 'looked on a lot of women with lust' and committed adultery in his heart, alienating religious voters.",
  "1 = Honest, Candid Theological Reflection Based on Christ's Sermon on the Mount Distorted by Sensationalist Tabloid Press", "10 = Bizarre, Embarrassing Lack of Presidential Dignity and Judgment Granting an Interview to a Pornographic Magazine", 2, 8, 5, 1, 9, 1);

add(1976, "1976_virginia_pharmacy_commercial_speech", "Virginia Board of Pharmacy v. Virginia Citizens Consumer Council (Commercial Speech)", "News", "1976 (Commercial Speech Doctrine)", "Healthcare", 2,
  "Supreme Court ruling that state bans on advertising prescription drug prices violate the First Amendment rights of consumers to receive commercial information.",
  "1 = Magnificent Consumer Victory Breaking Protectionist Pharmacy Cartels and Lowering Prescription Drug Prices for Seniors", "10 = Sound First Amendment Decision Recognizing That Truthful Price Advertising Promotes Free-Market Competition", 2, 7, 9, 2, 7, 1);

add(1976, "1976_equal_credit_opportunity_amendments", "Equal Credit Opportunity Act Amendments of 1976 (Banning Race/Age Credit Discrimination)", "News", "1976 (ECOA Expansion)", "Civil Rights & Social Issues", 2,
  "Expanding credit protections to prohibit lending discrimination based on race, color, religion, national origin, age, or receipt of public assistance.",
  "1 = Historic Expansion of Civil Rights Ensuring Honest Access to Mortgages and Business Loans for Minorities and Seniors", "10 = Support Objective Credit Scoring Based on Repayment Capacity / Guard Against Frivolous Disparate-Impact Lawsuits", 2, 8, 5, 1, 8, 1);

add(1976, "1976_senate_intelligence_committee_ssci_created", "Creation of the Senate Select Committee on Intelligence (SSCI)", "News", "1976 (SSCI Creation)", "Governance & Judiciary", 2,
  "Senate voting 72-22 to establish a permanent standing intelligence committee to monitor covert actions and intelligence budgets post-Church Committee.",
  "1 = Vital Permanent Constitutional Watchdog Ending Decades of Rogue CIA Black Operations and Disinformation", "10 = Dangerous Leaking Sieve That Threatens Covert Cold War Operations and Compromises Sensitive Foreign Intelligence Sources", 2, 8, 2, 1, 8, 1);

add(1976, "1976_consumer_goods_pricing_act_repeal", "Enactment of the Consumer Goods Pricing Act of 1975 (Banning Resale Price Maintenance)", "News", "1975-1976 (Fair Trade Laws Repeal)", "Economy & Taxation", 3,
  "Repealing federal antitrust exemptions that permitted manufacturers to set mandatory minimum retail 'fair trade' prices on consumer goods.",
  "1 = Splendid Anti-Monopoly Reform Slashing Retail Price Fixing and Saving Consumers Billions at Discount Department Stores", "10 = Pro-Competitive Deregulation Permitting Dynamic Retail Discounters to Compete on Price in the Free Market", 2, 7, 10, 2, 7, 1);

add(1976, "1976_ford_common_situs_picketing_veto", "President Ford's Veto of the Common Situs Picketing Bill", "News", "1975-1976 (Common Situs Veto Backlash)", "Labor & Welfare", 2,
  "Ford vetoing legislation allowing a single striking construction union to picket and shut down an entire multi-employer building jobsite, after conservative rebellion.",
  "1 = Shameful Capitulation to Right-Wing Business Donors Betraying Hardworking Construction Unions and Labor Rights", "10 = Courageous Presidential Defense of Independent Contractors and Open-Shop Non-Union Workers from Secondary Boycotts", 2, 9, 9, 1, 10, 1);

add(1976, "1976_strategic_petroleum_reserve_creation_epca", "Energy Policy and Conservation Act (Creation of Strategic Petroleum Reserve)", "News", "1975-1976 (SPR Enactment)", "Energy & Climate", 1,
  "Mandating the creation of a 1-billion-barrel emergency underground crude oil stockpile in salt caverns along the Gulf Coast to deter future foreign embargoes.",
  "1 = Crucial National Security Defense Shielding American Families and Industry from Extortion by Foreign Oil Cartels", "10 = Sound Emergency Defense Buffer, Provided Government Does Not Use Stockpile to Artificially Manipulate Commercial Oil Prices", 2, 7, 7, 1, 8, 1);

add(1976, "1976_lebanese_civil_war_beirut_evacuation", "Lebanese Civil War Outbreak & U.S. Navy Evacuation of Americans from Beirut", "News", "1976 (Beirut Evacuation)", "Foreign Policy & Defense", 2,
  "Assassination of U.S. Ambassador Francis Meloy in Beirut prompting Navy landing craft to evacuate 263 American and European citizens under Palestinian escort.",
  "1 = Prudent Neutral Evacuation Protecting American Lives While Avoiding Entanglement in Fractured Lebanese Sectarian Strife", "10 = Project Decisive American Power / Stand Firm with Regional Democratic Allies Against Syrian and PLO Terrorist Encroachment", 2, 8, 4, 1, 8, 1);

add(1976, "1976_california_united_farm_workers_prop_14", "California Proposition 14 (UFW Field Access Initiative) Defeated", "News", "1976 (Prop 14 UFW Initiative)", "Labor & Welfare", 2,
  "California voters rejecting (62% to 38%) Cesar Chavez's initiative guaranteeing union organizers access to growers' private agricultural fields.",
  "1 = Bitter Setback for Farmworkers Facing Massive Agribusiness Ad Campaigns; Field Access Remains Essential for Dignity", "10 = Resounding Defense of Sacred Private Property Rights Against Coercive Union Trespassing on Family Farms and Ranches", 2, 9, 9, 1, 9, 1);

add(1976, "1976_minimum_wage_increase_two_thirty", "Federal Minimum Wage Step Increase to $2.30 per Hour", "News", "1976 (Minimum Wage Adjustment)", "Labor & Welfare", 2,
  "Statutory step increase raising federal minimum wage to $2.30/hour to offset rapid inflation erosions for lowest-income service workers.",
  "1 = Essential Decency Helping the Working Poor Keep Up with Double-Digit Grocery and Utility Bill Inflation", "10 = Artificial Wage Floor That Eliminates Entry-Level Teen Jobs and Drives Up Consumer Prices in Small Retail Businesses", 2, 8, 9, 1, 9, 1);

add(1976, "1976_indian_self_determination_act_rollout", "Rollout of the Indian Self-Determination and Education Assistance Act", "News", "1975-1976 (Tribal Self-Determination Rollout)", "Civil Rights & Social Issues", 2,
  "Transitioning federal programs from paternalistic BIA administration to direct tribal self-governance contracting and community school management.",
  "1 = Historic Restoration of Indigenous Sovereignty and Tribal Self-Determination After Century of Forced Assimilation", "10 = Support Tribal Administrative Self-Reliance While Maintaining Strict Fiduciary Auditing of Federal Taxpayer Grants", 2, 7, 4, 1, 7, 1);

add(1976, "1976_des_growth_hormone_beef_cattle_hearings", "FDA Hearings on Banning Diethylstilbestrol (DES) Growth Hormone in Beef Cattle", "News", "1976 (DES Beef Carcinogen Hearings)", "Agriculture & Food", 3,
  "FDA moving to ban synthetic estrogen growth implant DES in feedlot cattle following cancer links in consumer studies; cattlemen resist.",
  "1 = Eradicate Lethal Carcinogenic Chemical Hormones from America's Commercial Beef Supply to Protect Human Health", "10 = DES Adds 15% Lean Muscle to Cattle; Premature Bans Will Drastically Raise Retail Beef Prices for Everyday Families", 2, 7, 8, 1, 7, 1);

add(1976, "1976_black_lung_benefits_reform_debates", "Congressional Battles Over Black Lung Benefits Trust Fund Financing", "News", "1976 (Black Lung Funding Reform)", "Labor & Welfare", 3,
  "Shifting financial liability for disabled coal miners' black lung compensation from federal taxpayers to an excise tax on commercial coal operators.",
  "1 = Coal Barons Who Poisoned Miners' Lungs Must Bear the Full Financial Cost of Care, Not Innocent American Taxpayers", "10 = Excessive Coal Taxes That Will Drive Marginal Appalachian Underground Mines Out of Business and Raise Electricity Rates", 2, 8, 8, 1, 8, 1);

add(1976, "1976_emergency_natural_gas_act_preparations", "Severe Winter Cold Wave & Natural Gas Shortages Across the Midwest", "News", "1976-1977 (Winter Natural Gas Freeze)", "Energy & Climate", 1,
  "Record-shattering Arctic blast freezing pipelines, shutting down hundreds of factories and schools across Ohio and Pennsylvania due to natural gas shortfalls.",
  "1 = Emergency Allocation of Fuel Supplies to Heat Freezing Homes and Priority Protection for Low-Income Consumers", "10 = Blame Decades of Federal Wellhead Price Controls That Strangled Natural Gas Exploration and Created Artificial Shortages", 2, 8, 9, 1, 9, 1);

add(1976, "1976_rust_belt_manufacturing_decline_emerges", "Closure of Youngstown Sheet & Tube and Historic Rust Belt Mill Distress", "News", "1976-1977 (Rust Belt De-industrialization)", "Economy & Taxation", 1,
  "Surging imports of foreign subsidized Japanese and European steel sparking major plant shutdowns and layoffs across Pennsylvania, Ohio, and Indiana.",
  "1 = Enforce Aggressive Anti-Dumping Tariffs and Provide Massive Federal Industrial Adjustment Aid to Save Heartland Communities", "10 = Protectionism Harms American Consumers; Industry Must Modernize Inefficient Plants and Embrace Free Market Efficiency", 2, 8, 9, 1, 8, 1);

add(1976, "1976_turkey_arms_embargo_continuation_vote", "House Rejection of Ford Request to Fully Lift Turkey Arms Embargo", "News", "1976 (Turkey Arms Embargo Standoff)", "Foreign Policy & Defense", 2,
  "House voting to maintain strict military arms embargo on Turkey until meaningful progress is made resolving the Cyprus refugee crisis.",
  "1 = Defend International Law and Human Rights; American Arms Must Never Be Used to Subjugate Sovereign Cyprus", "10 = Disastrous Cold War Blunder Driving Key NATO Ally Turkey Away from the West and Jeopardizing Soviet Border Radar Posts", 2, 8, 4, 1, 8, 1);

add(1976, "1976_whaling_moratorium_iwc_campaign", "U.S. Delegation Pushing for Total Commercial Whaling Moratorium at IWC", "News", "1976 (International Whaling Moratorium)", "Energy & Climate", 2,
  "U.S. leading the international charge at the International Whaling Commission to establish a complete global ban on commercial pelagic whale hunting.",
  "1 = Noble Moral Duty to Prevent the Extinction of Magnificent, Intelligent Cetaceans from Commercial Slaughter", "10 = Scientific Quota Management Is Preferred; Avoid Unilateral Trade Sanctions That Antagonize Maritime Allies Like Japan", 2, 8, 8, 1, 8, 1);

add(1976, "1976_fec_post_buckley_reconstitution", "Emergency Reconstitution of the Federal Election Commission by Congress", "News", "1976 (FEC Reconstitution Post-Buckley)", "Governance & Judiciary", 2,
  "Congress reconstituting the FEC with presidential appointments and Senate confirmation after the Supreme Court struck down congressional appointments.",
  "1 = Prompt Restoration of the Federal Election Watchdog to Monitor Presidential Matching Funds and Enforce Contribution Limits", "10 = Bureaucracy That Stifles Grassroots Political Action; Campaign Finance Laws Should Focus on Disclosure, Not Restrictions", 2, 8, 8, 1, 8, 1);

add(1976, "1976_bob_dole_vice_presidential_running_mate", "Gerald Ford Selecting Senator Bob Dole as Republican Running Mate", "News", "1976 (Dole VP Pick & 'Democrat Wars')", "Governance & Judiciary", 2,
  "Ford choosing aggressive conservative Kansas Senator Bob Dole to unite the party; Dole stirs controversy in debates claiming 1.6M Americans died in 'Democrat wars'.",
  "1 = Disgraceful Partisan Bloodshed Rhetoric Slandering American Sacrifices in WWI, WWII, and Korea for Cheap Politics", "10 = Tough, Principled Combat Veteran and Hardland Champion Speaking Truth to Decades of Failed Liberal Foreign Governance", 2, 9, 5, 1, 9, 1);

add(1976, "1976_presidential_debates_revival_first_since_1960", "Revival of Televised Presidential Debates (First Since 1960)", "News", "1976 (League of Women Voters Debates)", "Governance & Judiciary", 2,
  "League of Women Voters sponsoring the first televised presidential debates in 16 years, establishing debates as a permanent democratic ritual.",
  "1 = Indispensable Democratic Forum Allowing Citizens to Judge Candidates Side-by-Side on Complex National Policy Issues", "10 = High-Stakes Television Spectacle Rewarding Superficial Soundbites and Makeup Over Deep Executive Substance", 2, 7, 4, 1, 7, 1);
`;

fs.writeFileSync(path.join(__dirname, 'build-bracket-c.cjs'), additions, 'utf8');
 complete.');

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
