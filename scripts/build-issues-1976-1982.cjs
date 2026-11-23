/**
 * scripts/build-issues-1976-1982.cjs
 * Issues dataset for 1976, 1978, 1980, 1982 election cycles (Bracket C).
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

// =========================================================================
// 1980 (50 Issues)
// =========================================================================
add(1980, "1980_iran_hostage_crisis_tehran_embassy", "Iran Hostage Crisis (52 Americans Held Captive in Tehran for 444 Days)", "News", "1979-1981 (Iran Hostage Crisis)", "Foreign Policy & Defense", 1,
  "Iranian revolutionary students storming the U.S. Embassy in Tehran, taking 52 American diplomats hostage, dominating nightly news and paralyzing the Carter presidency.",
  "1 = Patient Diplomatic and Financial Negotiation to Secure the Safe, Unharmed Return of Every Living American Hostage", "10 = Humiliating Weakness That Invites Global Contempt / Demand Immediate Decisive Military Retaliation and Blockade", 2, 9, 3, 1, 9, 1);

add(1980, "1980_operation_eagle_claw_desert_one_tragedy", "Operation Eagle Claw Rescue Disaster at Desert One (8 Servicemen Dead)", "News", "1980 (Desert One Rescue Tragedy)", "Foreign Policy & Defense", 1,
  "Catastrophic failure of the military hostage rescue mission in the Iranian desert due to helicopter mechanical breakdowns and collision, killing 8 servicemen.",
  "1 = Tragic Operational Accident Demonstrating the Inherent Hazards of Complex Military Missions Under Desert Conditions", "10 = Devastating Symbol of Post-Vietnam Military Decay, Inter-Service Incompetence, and Carter Administration Paralysis", 2, 9, 4, 1, 9, 1);

add(1980, "1980_stagflation_peak_volcker_interest_rate_shock", "1980 Stagflation Peak: 13.5% Inflation & Volcker's 21.5% Prime Interest Rate", "News", "1979-1981 (Volcker Tight Money Shock)", "Economy & Taxation", 1,
  "Consumer price inflation surging to 13.5% while Federal Reserve Chairman Paul Volcker clamps down on money supply, driving mortgage and prime rates over 20%.",
  "1 = Compassionate Relief Protecting Working-Class Families, Small Builders, and Auto Dealers Crushed by Usurious Interest Rates", "10 = Painful but Indispensable Monetary Medicine Necessary to Break the Back of Entrenched Inflation Once and for All", 2, 8, 9, 1, 9, 2);

add(1980, "1980_reagan_are_you_better_off_debate", "Ronald Reagan's 'Are You Better Off Than You Were Four Years Ago?' Debate", "News", "1980 (Reagan-Carter Cleveland Debate)", "Governance & Judiciary", 1,
  "Reagan's dominating closing statement in the single presidential debate crystallizing voter economic discontent with the Misery Index (unemployment + inflation).",
  "1 = Slick Actor Delivering Coached Platitudes to Mask a Radical Program of Gilded Age Plutocracy and Social Darwinism", "10 = Decisive Historical Moment of Clear Conservative Leadership Offering Hope, Renewal, and Freedom to the Nation", 2, 10, 8, 1, 10, 1);

add(1980, "1980_kemp_roth_supply_side_tax_cut_pledge", "Reagan Endorsement of Kemp-Roth 30% Across-the-Board Income Tax Cut", "News", "1980 (Supply-Side Tax Cut Platform)", "Economy & Taxation", 1,
  "Reagan pledging a 30% phased individual income tax rate cut across all brackets, arguing it will unleash supply-side productivity and pay for itself without deficits.",
  "1 = Dangerous 'Voodoo Economics' Fabricating Free-Lunch Theories That Will Explode Massive Federal Budget Deficits", "10 = Transformative Supply-Side Revolution Slashing Confiscatory Tax Penalties to Spark Unprecedented Economic Growth", 2, 10, 10, 1, 10, 1);

add(1980, "1980_soviet_invasion_of_afghanistan_carter_doctrine", "Soviet Invasion of Afghanistan & Proclamation of the Carter Doctrine", "News", "1979-1980 (Soviet Afghan Invasion & Carter Doctrine)", "Foreign Policy & Defense", 1,
  "Soviet Red Army invading Afghanistan to prop up Marxist regime; Carter declares any attempt to control the Persian Gulf will be repelled by any means including military force.",
  "1 = Resolute Defense of Vital Middle East Free-World Oil Lifelines Coupled with Comprehensive International Sanctions", "10 = Total Bankruptcy of Detente Proving Moscow Only Respects Raw Military Strength / Massive Re-armament Now", 2, 9, 4, 1, 9, 1);

add(1980, "1980_moscow_olympic_games_boycott", "President Carter's U.S. Boycott of the 1980 Moscow Summer Olympic Games", "News", "1980 (Moscow Olympics Boycott)", "Foreign Policy & Defense", 1,
  "Carter compelling the U.S. Olympic Committee to boycott the Moscow Games over the Soviet invasion of Afghanistan, supported by 65 allied nations.",
  "1 = Powerful Moral Statement Refusing to Legimize Soviet Aggression with Athletic Propaganda, Echoing 1936 Berlin", "10 = Cruel Sacrifice of Hundreds of Dedicated Young Athletes Who Trained for Years, Leaving Soviet Tyrants Wholly Undeterred", 2, 8, 5, 1, 8, 1);

add(1980, "1980_soviet_grain_embargo_agricultural_backlash", "President Carter's Embargo on U.S. Grain Shipments to the Soviet Union", "News", "1980 (Soviet Grain Embargo)", "Agriculture & Food", 1,
  "Halting sales of 17 million tons of American wheat and corn to the USSR, infuriating Midwestern family farmers facing collapsing grain prices.",
  "1 = Necessary Strategic Sacrifices Stripping Food Resources from the Aggressor Superpower Invading Afghanistan", "10 = Catastrophic Economic Blunder Punishing American Heartland Farmers While Soviets Simply Purchase Grain from Argentina", 2, 9, 8, 1, 9, 1);

add(1980, "1980_selective_service_registration_reinstated", "President Carter Reinstating Selective Service Draft Registration for 18-Year-Old Males", "News", "1980 (Draft Registration Reinstatement)", "Foreign Policy & Defense", 1,
  "Re-imposing mandatory draft registration for all 18-to-20-year-old males via local post offices following the Soviet invasion of Afghanistan.",
  "1 = Totalitarian Conscription Paperwork Enslaving American Youths for Potential Imperial Wars / Abolish Draft Registration", "10 = Minimum Civic Duty Demonstrating National Resolve and Strategic Military Preparedness to Our Soviet Adversaries", 2, 8, 10, 1, 9, 1);

add(1980, "1980_superfund_cercla_toxic_cleanup_enacted", "Enactment of CERCLA (Comprehensive Environmental Response / Superfund)", "News", "1980 (Superfund Enactment)", "Energy & Climate", 1,
  "Creating a $1.6 billion trust fund financed by chemical and crude oil excise taxes to remediate thousands of abandoned toxic waste dumps nationwide post-Love Canal.",
  "1 = Landmark Environmental Justice Requiring Corporate Chemical Polluters to Clean Up Lethal Toxic Poison Dumps", "10 = Unfair Retroactive Strict Liability Imposing Massive Litigation Costs and Bureaucratic Stagnation on American Industry", 2, 8, 8, 1, 8, 1);

add(1980, "1980_anilca_alaska_lands_act_104_million_acres", "Enactment of the Alaska National Interest Lands Conservation Act (ANILCA)", "News", "1980 (ANILCA Enactment)", "Energy & Climate", 1,
  "Protecting over 104 million acres of Alaskan wilderness, national parks, and wildlife refuges, doubling the size of the National Park System.",
  "1 = The Greatest Land Conservation Triumph on Earth Preserving Majestic Pristine Wilderness for Future Generations", "10 = Crushing Federal Land Lockup Paralyzing Vast Alaskan Mineral, Oil, and Timber Reserves Essential for Energy Independence", 2, 9, 9, 1, 10, 1);

add(1980, "1980_staggers_rail_act_freight_deregulation", "Enactment of the Staggers Rail Act of 1980 (Freight Railroad Deregulation)", "News", "1980 (Staggers Rail Deregulation)", "Technology & Infrastructure", 1,
  "Dismantling 90 years of ICC rate regulations, allowing freight railroads to set market rates and sign confidential shipper contracts, rescuing private freight rail.",
  "1 = Splendid Free-Market Reform Rescuing Bankrupt American Railroads and Revolutionizing Freight Logistics Efficiency", "10 = Sound Deregulation, Though Captive Agricultural and Coal Shippers Must Retain Protection from Monopolistic Rail Rate Gouging", 2, 8, 10, 2, 8, 1);

add(1980, "1980_motor_carrier_act_trucking_deregulation", "Enactment of the Motor Carrier Act of 1980 (Sweeping Trucking Deregulation)", "News", "1980 (Trucking Deregulation)", "Technology & Infrastructure", 1,
  "Dismantling ICC restrictions on interstate trucking entry and rates, lowering consumer freight costs by $8 billion annually and sparking non-union competition.",
  "1 = Brilliant Victory for Consumers Squeezing Out Inefficient Monopolistic Tariffs and Trucking Route Protections", "10 = Reckless Deregulation Causing Cutthroat Price Wars, Truck Driver Wage Collapses, and Destabilizing the Teamsters Union", 2, 8, 10, 2, 8, 1);

add(1980, "1980_chrysler_loan_guarantee_act_bailout", "Chrysler Corporation Loan Guarantee Act of 1979/1980 ($1.5 Billion Federal Bailout)", "News", "1980 (Chrysler Federal Bailout)", "Economy & Taxation", 1,
  "Congress providing $1.5 billion in federal loan guarantees to rescue Chrysler from bankruptcy, contingent on union wage concessions and supplier sacrifices.",
  "1 = Vital Strategic Intervention Saving 500,000 Good Union Jobs and Preserving America's Domestic Industrial Manufacturing Base", "10 = Disastrous Corporate Welfare Rewarding Incompetence and Violating Fundamental Free-Market Capitalism Rules", 2, 8, 10, 1, 9, 1);

add(1980, "1980_depository_institutions_monetary_control_act", "Depository Institutions Deregulation and Monetary Control Act of 1980", "News", "1980 (DIDMCA Banking Overhaul)", "Economy & Taxation", 1,
  "Phasing out Regulation Q deposit interest rate ceilings, expanding S&L commercial lending powers, and raising FDIC/FSLIC insurance coverage from $40,000 to $100,000.",
  "1 = Essential Modernization Enabling Everyday Depositors to Earn Market Interest Rates on Their Hard-Earned Savings", "10 = Dangerous Expansion of Federal Deposit Guarantees to $100,000 Without Adequate S&L Examination Standards (Moral Hazard)", 2, 8, 10, 1, 8, 2);

add(1980, "1980_mariel_boatlift_cuban_refugee_influx", "Mariel Boatlift: 125,000 Cuban Refugees Arrive in South Florida", "News", "1980 (Mariel Boatlift Crisis)", "Immigration", 1,
  "Fidel Castro opening the port of Mariel, allowing 125,000 Cubans to flee by boat to Miami, secretly including thousands of released mental patients and hardened criminals.",
  "1 = Welcoming Desperate Victims of Communist Dictatorship While Screening and Isolating Violent Criminal Infiltrators", "10 = Disastrous Border Chaos Overwhelming South Florida Communities, Schools, and Law Enforcement / Halt Boatlift Immediately", 2, 9, 5, 1, 10, 1);

add(1980, "1980_mount_st_helens_catastrophic_eruption", "Catastrophic Volcanic Eruption of Mount St. Helens in Washington State", "News", "1980 (Mount St. Helens Eruption)", "Energy & Climate", 1,
  "Cataclysmic volcanic blast killing 57 people, flattening 230 square miles of old-growth forest, and blanketing Eastern Washington in suffocating ash.",
  "1 = Deploy Full Federal Emergency Assistance, Rebuild Infrastructure, and Designate a National Volcanic Ecological Monument", "10 = Mourn the Victims and Rebuild Roads While Rapidly Salvaging Millions of Board-Feet of Commercial Downed Timber", 2, 7, 6, 1, 7, 1);

add(1980, "1980_republican_platform_drops_era_endorsement", "GOP Convention Drops 40-Year Endorsement of the Equal Rights Amendment", "News", "1980 (GOP Platform ERA Rejection)", "Civil Rights & Social Issues", 1,
  "Reagan conservatives engineering a historic platform shift abandoning the Republican Party's 40-year backing of the ERA in favor of states' rights.",
  "1 = Heartbreaking Betrayal of Republican Moderates and Millions of Women Fighting for Fundamental Equal Constitutional Rights", "10 = Principled Realignment Standing Up for Family Values and Rejecting a Disruptive Radical Feminist Federal Mandate", 2, 10, 6, 1, 10, 1);

add(1980, "1980_ted_kennedy_the_dream_will_never_die", "Senator Ted Kennedy's Primary Challenge & DNC Address ('The Dream Will Never Die')", "News", "1980 (Kennedy 1980 Insurgency)", "Governance & Judiciary", 1,
  "Kennedy waging fierce liberal primary battle against Carter, delivering electrifying convention speech declaring: 'The work goes on, the cause endures, the hope still lives, and the dream shall never die.'",
  "1 = Inspiring Defense of the True Liberal Faith: National Health Insurance, Civil Rights, and Dignity for the Working Poor", "10 = Fractious, Self-Indulgent Ego Trip Splitting the Democratic Party and Ensuring Conservative Victory in November", 2, 8, 4, 1, 8, 1);

add(1980, "1980_john_anderson_independent_presidential_bid", "John B. Anderson's Independent Centrist Presidential Campaign (6.6% Vote)", "News", "1980 (Anderson Centrist Insurgency)", "Governance & Judiciary", 1,
  "Moderate Republican Congressman John Anderson running as an independent on a platform of fiscal discipline, social liberalism, and a 50-cent gasoline tax to cut payroll taxes.",
  "1 = Principled Rational Alternative for Millions of Thoughtful Citizens Repelled by Carter's Incompetence and Reagan's Ideology", "10 = Smug Country-Club Liberal Campaign Siphoning Discontented Moderate Votes Without Any Viable Electoral College Path", 3, 7, 6, 2, 8, 1);

add(1980, "1980_crude_oil_windfall_profit_tax_act", "Enactment of the Crude Oil Windfall Profit Tax Act of 1980", "News", "1980 (Windfall Profit Tax Enactment)", "Energy & Climate", 1,
  "Imposing a 70% excise tax on domestic oil company profits generated by President Carter's phased decontrol of crude oil prices, projected to raise $227B.",
  "1 = Essential Justice Recapturing Huge Unearned Corporate Windfalls from Big Oil to Finance Mass Transit and Low-Income Fuel Aid", "10 = Punitive, Confiscatory Excise Tax That Penalizes Domestic Exploration, Depresses Drilling, and Increases Foreign Oil Reliance", 2, 9, 10, 1, 9, 1);

add(1980, "1980_department_of_education_operations_commence", "Department of Education Organization Act & Cabinet Operations Commence", "News", "1979-1980 (Dept of Education Founding)", "Education", 1,
  "Creating the separate Cabinet-level Department of Education to fulfill Carter's campaign pledge to the National Education Association (NEA); Reagan vows to abolish it.",
  "1 = Vital Elevation of Public Education to National Prominence Ensuring Dedicated Advocacy for Teachers and Classrooms", "10 = Unconstitutional Federal Intrusion and Payoff to Union Bosses Trampling Local School Board Control / Abolish the Department", 2, 10, 10, 1, 10, 1);

add(1980, "1980_bayh_dole_act_university_patents", "Enactment of the Bayh-Dole Act of 1980 (University Technology Commercialization)", "News", "1980 (Bayh-Dole Enactment)", "Technology & Infrastructure", 2,
  "Allowing universities, non-profits, and small businesses to retain patent ownership of inventions developed with federal research grants, unleashing modern biotech.",
  "1 = Revolutionary Catalyst Transforming Academic Laboratory Discoveries into Life-Saving Commercial Medicines and High-Tech Startups", "10 = Corporate Enclosure Allowing Private Drug Companies to Monopolize and Price-Gouge on Inventions Funded by Taxpayers", 3, 8, 9, 2, 8, 2);

add(1980, "1980_diamond_v_chakrabarty_living_organisms_patent", "Diamond v. Chakrabarty Supreme Court Ruling (Patenting Living Micro-Organisms)", "News", "1980 (Chakrabarty Biotechnology Ruling)", "Technology & Infrastructure", 2,
  "Supreme Court ruling 5-4 that genetically engineered living micro-organisms (oil-eating bacteria) are patentable subject matter under U.S. patent law.",
  "1 = Foundational Judicial Milestone Launching the American Commercial Biotechnology and Genetic Engineering Revolution", "10 = Dangerous Hubristic Ruling Turning God's Living Creation into Monopolistic Corporate Commercial Property", 3, 8, 8, 2, 8, 2);

add(1980, "1980_harris_v_mcrae_upholding_hyde_amendment", "Harris v. McRae Supreme Court Ruling Upholding the Hyde Amendment", "News", "1980 (Harris v. McRae Abortion Ruling)", "Healthcare", 1,
  "Supreme Court ruling 5-4 that the Hyde Amendment does not violate the Fifth Amendment or the Establishment Clause, affirming states and feds need not fund abortions.",
  "1 = Devastating Setback Stripping Poor Women of Meaningful Exercise of Their Constitutional Right to Safe Reproductive Choice", "10 = Monumental Constitutional Victory Protecting Pro-Life Citizens from Being Forced to Subsidize Abortion Through Taxes", 2, 9, 7, 1, 10, 1);

add(1980, "1980_abscam_fbi_sting_indictments_members_of_congress", "Abscam FBI Undercover Bribery Sting Indicting Six House Members and One Senator", "News", "1980 (Abscam Corruption Scandal)", "Governance & Judiciary", 1,
  "FBI undercover operation using bogus Arab sheikhs videotaping lawmakers accepting briefcases stuffed with cash in exchange for legislative favors.",
  "1 = Disgraceful Culture of Greed and Corruption Proving Washington Politicians Can Be Bought by Wealthy Interests", "10 = Unsettling Entrapment Tactics by Federal Law Enforcement Manufacturing Crimes That Undermine Congressional Independence", 2, 8, 4, 1, 8, 1);

add(1980, "1980_miami_liberty_city_riots_mcduffie", "Miami Liberty City Riots (18 Dead After McDuffie Police Acquittals)", "News", "1980 (Liberty City Riots)", "Civil Rights & Social Issues", 1,
  "Three days of deadly urban rioting and burning in Miami after an all-white Tampa jury acquitted four white police officers in the fatal beating of Black motorist Arthur McDuffie.",
  "1 = Justified National Outrage Against Systemic Police Brutality, All-White Juries, and Decades of Economic Disinvestment in Black Communities", "10 = Lawless Murder and Mob Violence Cannot Be Excused / Deploy National Guard and Enforce Law and Order Immediately", 2, 9, 4, 1, 10, 1);

add(1980, "1980_three_mile_island_aftermath_nuclear_halt", "Three Mile Island Nuclear Meltdown Aftermath & National Construction Freeze", "News", "1979-1980 (Three Mile Island Aftermath)", "Energy & Climate", 1,
  "Partial core meltdown at Pennsylvania plant sparking terror, evacuations, and leading electric utilities to cancel over 50 planned commercial nuclear reactors.",
  "1 = Chilling Demonstration That Commercial Nuclear Fission Is Inherently Perilous, Uninsurable, and Must Be Phased Out", "10 = Overreaction to an Accident Where Zero Persons Died / Nuclear Power Remains Indispensable for Clean Energy Independence", 2, 8, 8, 1, 8, 1);

add(1980, "1980_synthetic_fuels_corporation_energy_security_act", "Energy Security Act of 1980 (Creation of Synthetic Fuels Corporation)", "News", "1980 (Synfuels Corporation Enactment)", "Energy & Climate", 2,
  "Authorizing $20 billion in federal subsidies to build commercial synthetic fuels plants converting coal and oil shale into petroleum substitutes.",
  "1 = Ambitious Public Works Investment Breaking Dependence on OPEC Oil Through American Scientific Ingenuity", "10 = Colossal White Elephant Subsidizing Massive Corporate Oil and Coal Conglomerates with Taxpayer Dollars", 2, 8, 10, 1, 9, 1);

add(1980, "1980_paperwork_reduction_act_oira_creation", "Enactment of the Paperwork Reduction Act of 1980 (Creation of OMB OIRA)", "News", "1980 (OIRA Creation & Paperwork Act)", "Governance & Judiciary", 2,
  "Creating the Office of Information and Regulatory Affairs (OIRA) inside OMB to review and approve all federal agency information collections and regulations.",
  "1 = Bureaucratic Choke Point Empowering White House Staff to Water Down Vital Labor and Environmental Public Protections", "10 = Indispensable Centralized Weapon Reining In Runaway Federal Bureaucratic Red Tape and Regulatory Cost Burden on Citizens", 2, 9, 9, 1, 9, 1);

add(1980, "1980_apple_computer_initial_public_offering", "Apple Computer Initial Public Offering (IPO) & Personal Computer Dawn", "News", "1980 (Apple IPO & PC Boom)", "Technology & Infrastructure", 2,
  "Steve Jobs and Steve Wozniak taking Apple public, raising $100M in the largest tech IPO since Ford Motor, igniting the personal computing revolution.",
  "1 = Spectacular Triumph of American Entrepreneurship, Visionary Garage Innovation, and Free-Market Creative Dynamism", "10 = Celebrate Entrepreneurial Ingenuity While Ensuring Equal Educational Access to Computers for Every Working-Class Student", 2, 7, 9, 2, 8, 1);

add(1980, "1980_auto_industry_crisis_japanese_import_quotas", "American Auto Industry Crisis & Demands for Japanese Voluntary Import Restraints", "News", "1980 (Auto Crisis & Import Caps)", "Economy & Taxation", 1,
  "U.S. automakers losing $4 billion as fuel-efficient Japanese imports capture 27% of the domestic market; UAW petitions ITC for emergency tariff protection.",
  "1 = Enact Tough Import Restraints and Domestic Content Laws to Save Hundreds of Thousands of American Factory Machinists", "10 = Tariffs and Quotas Punish American Families Who Need Affordable, Reliable Small Cars / Detroit Must Compete on Quality", 2, 8, 9, 1, 8, 1);

add(1980, "1980_mothers_against_drunk_driving_madd_founded", "Founding of Mothers Against Drunk Driving (MADD) by Candy Lightner", "News", "1980 (MADD Movement Genesis)", "Healthcare", 2,
  "Grassroots mother-led movement launched following death of 13-year-old Cari Lightner, demanding mandatory prison sentences and raising legal drinking age to 21.",
  "1 = Heroic Grassroots Crusade Demanding Zero Tolerance for Drunk Driving Killers and Ending Decades of Judicial Leniency", "10 = Fully Support Tough Criminal Penalties for Drunk Drivers While Guarding Against Federal Usurpation of State Drinking Ages", 2, 7, 6, 1, 8, 1);

add(1980, "1980_mx_missile_racetrack_basing_system_debate", "Debate over MX Missile Mobile 'Racetrack' Basing in Nevada and Utah", "News", "1979-1980 (MX Racetrack Basing Debate)", "Foreign Policy & Defense", 1,
  "Carter plan to build 4,600 underground shelters connected by massive railways across the Great Basin to shuffle 200 MX missiles, sparking Mormon Church opposition.",
  "1 = Colossal Wasteful Scheme Consuming Billions of Gallons of Arid Western Water and Turning Nevada into a Nuclear Bullseye", "10 = Essential Nuclear Modernization Guaranteeing Survivable Land-Based ICBM Deterrence Against Soviet First-Strike Capabilities", 2, 9, 4, 1, 9, 1);

add(1980, "1980_low_income_home_energy_assistance_liheap", "Enactment of the Low-Income Home Energy Assistance Program (LIHEAP)", "News", "1980 (LIHEAP Enactment)", "Labor & Welfare", 2,
  "Creating federal block grant program to subsidize heating and cooling utility bills for poor elderly and low-income families during winter freezes.",
  "1 = Compassionate Lifeline Preventing Vulnerable Senior Citizens from Freezing to Death in Their Own Homes", "10 = Permanent Entitlement Handout Expanding Government Spending When Charity and Local Communities Should Aid the Needy", 2, 8, 9, 1, 9, 1);

add(1980, "1980_billy_carter_billygate_libyan_lobbying", "Senate Investigation of Billy Carter's $220,000 Libyan Loan ('Billygate')", "News", "1980 (Billygate Scandal)", "Governance & Judiciary", 2,
  "President's brother registering as a foreign agent after receiving a $220,000 commercial loan from Moammar Gadhafi's rogue Libyan regime, sparking Senate inquiry.",
  "1 = Deeply Embarrassing Display of Sibling Exploitation of White House Ties, Though President Carter Did No Wrong", "10 = Sordid Influence Peddling and National Security Compromise Reaching Directly into the Carter Family Inner Circle", 2, 9, 5, 1, 9, 1);

add(1980, "1980_reagan_philadelphia_mississippi_speech", "Ronald Reagan's 'States' Rights' Speech at the Neshoba County Fair", "News", "1980 (Reagan Neshoba County Speech)", "Civil Rights & Social Issues", 1,
  "Reagan opening his general election campaign near Philadelphia, MS (site of the 1964 murders of three civil rights workers), declaring 'I believe in states' rights.'",
  "1 = Chilling Racial Dog Whistle Signaling to Segregationist Southern Whites That the GOP Will Dismantle Federal Civil Rights", "10 = Reaffirmation of Core Constitutional Federalism and Local Governance Over Imperial Washington Mandates", 2, 10, 6, 1, 10, 1);

add(1980, "1980_reagan_44_state_electoral_landslide", "Ronald Reagan's 44-State Presidential Landslide Victory (489 Electoral Votes)", "News", "1980 (Reagan 1980 Landslide)", "Governance & Judiciary", 1,
  "Reagan sweeping 44 states and unseating Carter, while Republicans capture the U.S. Senate for the first time in 26 years, ushering in the Reagan Revolution.",
  "1 = Tragic Ascendance of Reactionary Anti-Worker Politics That Will Gut the New Deal and Great Society Safety Nets", "10 = Historic Realignment and Resounding Mandate for Limited Government, Supply-Side Tax Cuts, and Peace Through Strength", 2, 10, 8, 1, 10, 1);

add(1980, "1980_acid_rain_us_canada_transboundary_talks", "U.S.-Canadian Bilateral Negotiations on Industrial Acid Rain Emissions", "News", "1980 (Acid Rain Transboundary Accord)", "Energy & Climate", 2,
  "U.S. and Canadian envoys signing memorandum of intent to curb sulfur dioxide emissions from Midwestern coal power plants killing fish in Adirondack and Canadian lakes.",
  "1 = Urgent Ecological Action Mandating Modern Scrubbers on Midwestern Smoke Stacks to Save Dying Lakes and Forests", "10 = Premature Multi-Billion Dollar Scrubber Mandates Based on Inconclusive Science That Punish Midwestern Electric Ratepayers", 2, 8, 8, 1, 8, 1);

add(1980, "1980_adoption_assistance_child_welfare_act", "Enactment of the Adoption Assistance and Child Welfare Act of 1980", "News", "1980 (Adoption Assistance Enacted)", "Healthcare", 2,
  "Federal statute establishing subsidies for families adopting special-needs children and mandating 'reasonable efforts' by states to prevent family breakup.",
  "1 = Beautiful Compassionate Legislation Moving Hundreds of Thousands of Forgotten Foster Children into Loving Permanent Families", "10 = Good Pro-Family Goal, Provided Bureaucratic 'Family Preservation' Rules Do Not Trap Children in Dangerously Abusive Homes", 2, 7, 5, 1, 8, 1);

add(1980, "1980_stevenson_wydler_technology_innovation_act", "Enactment of the Stevenson-Wydler Technology Innovation Act of 1980", "News", "1980 (Stevenson-Wydler Enactment)", "Technology & Infrastructure", 3,
  "Requiring federal laboratories to establish technology transfer offices to transfer federally funded research to state and local governments and private industry.",
  "1 = Vital Mechanism Mobilizing National Laboratory Science to Reinvigorate American Industrial Productivity", "10 = Sound Policy Ensuring Taxpayer-Funded Federal Research Is Productively Commercialized by Private Free Enterprise", 2, 7, 8, 2, 8, 2);

add(1980, "1980_strategic_petroleum_reserve_refill_mandate", "Congressional Mandate Ordering President Carter to Resume Filling the SPR", "News", "1980 (SPR Fill Mandate)", "Energy & Climate", 2,
  "Congress mandating SPR crude oil storage purchases of 100,000 barrels/day after Carter paused purchases to placate Saudi Arabia.",
  "1 = Urgent National Security Protection Building the Reserve to 1 Billion Barrels to Withstand Mideast Oil Shocks", "10 = Prudent Defense Measure Ensuring America Is Never Again Held Hostage to Radical Islamic or Arab Oil Blackmail", 2, 8, 7, 1, 8, 1);

add(1980, "1980_foreign_service_act_of_1980", "Enactment of the Foreign Service Act of 1980 (Diplomatic Corps Modernization)", "News", "1980 (Foreign Service Reform)", "Governance & Judiciary", 3,
  "Overhauling the statutory structure of the American diplomatic corps, creating Senior Foreign Service and improving benefits for diplomatic families serving abroad.",
  "1 = Professionalize and Protect Our Dedicated Diplomatic Corps Representing American Democratic Values in Hostile Posts", "10 = Ensure the State Department Reflects the Commander-in-Chief's Foreign Policy Priorities Rather Than Entrenched Diplomatic Habits", 2, 7, 6, 1, 7, 1);

add(1980, "1980_industrial_union_benzene_supreme_court", "Industrial Union Dept v. American Petroleum Institute (Benzene Risk Standard)", "News", "1980 (Benzene Significant Risk Ruling)", "Labor & Welfare", 2,
  "Supreme Court ruling 5-4 that OSHA must prove a toxic substance poses a 'significant risk of harm' before promulgating costly workplace health standards.",
  "1 = Dangerous Obstacle Forcing OSHA to Meet Impossible Evidentiary Burdens While Industrial Workers Suffer Leaded Leukemia", "10 = Indispensable Check Reining In Runaway Bureaucratic Zealots Imposing Multi-Million Dollar Mandates Without Sound Science", 2, 9, 8, 1, 8, 1);

add(1980, "1980_federal_judicial_appointments_diversity", "President Carter's Record Appointment of Women and Minorities to Federal Bench", "News", "1977-1980 (Carter Judicial Diversity Legacy)", "Governance & Judiciary", 2,
  "Carter appointing 40 women, 37 African-Americans, and 16 Latinos to life-tenured federal judgeships, shattering previous diversity records without a single SCOTUS vacancy.",
  "1 = Historic Transformation Making the Federal Judiciary Truly Reflect the Wonderful Diversity and Talent of All America", "10 = Affirmative Action Quotas Compromising Strict Judicial Competence and Stacking Benches with Liberal Activist Judges", 2, 9, 5, 1, 9, 1);

add(1980, "1980_low_level_radioactive_waste_policy_act", "Enactment of the Low-Level Radioactive Waste Policy Act of 1980", "News", "1980 (LLRWPA Enactment)", "Energy & Climate", 2,
  "Declaring each state responsible for disposing of commercial low-level radioactive medical and industrial waste generated within its borders, encouraging regional compacts.",
  "1 = Sound Principles of State Responsibility and Safe Regional Containment of Dangerous Biomedical and Nuclear Wastes", "10 = Bipartisan Federalism Returning Radioactive Waste Authority to Cooperative Interstate Compacts", 2, 8, 8, 1, 8, 1);

add(1980, "1980_national_materials_and_minerals_policy_act", "National Materials and Minerals Policy, Research and Development Act of 1980", "News", "1980 (Critical Minerals Strategy)", "Energy & Climate", 3,
  "Directing executive agencies to coordinate critical minerals supply security (cobalt, titanium, chromium) vulnerable to Soviet and African disruption.",
  "1 = Strategic Planning Securing Essential Industrial Feedstocks for Defense and High-Tech Manufacturing", "10 = Unleash Domestic Mining on Public Lands to End America's Crippling Import Vulnerability in Strategic Critical Minerals", 2, 8, 8, 1, 8, 1);

add(1980, "1980_coastal_barrier_resources_act_drafting", "Drafting Legislation to End Federal Flood Subsidies on Undeveloped Barrier Islands", "News", "1980 (Barrier Island Protection Genesis)", "Energy & Climate", 3,
  "Bipartisan proposal by Thomas Evans to withdraw federal flood insurance and infrastructure subsidies from fragile undeveloped coastal barrier islands.",
  "1 = Brilliant Convergence of Fiscal Conservatism and Environmental Preservation Halting Taxpayer Subsidies for Risky Coastal Mansions", "10 = Free-Market Common Sense: Taxpayers Should Not Underwrite Storm Risks for Wealthy Beach Developers", 2, 8, 10, 1, 8, 1);

add(1980, "1980_puerto_rico_status_debate_san_juan", "Puerto Rico Gubernatorial Election & Heated Debate Over Statehood vs Commonwealth", "News", "1980 (Puerto Rico Status Plebiscite Debate)", "Governance & Judiciary", 3,
  "Carlos Romero Barcelo narrowly re-elected governor of Puerto Rico on pro-statehood platform amidst rising island tensions over U.S. Navy presence on Vieques.",
  "1 = Respect the Democratic Self-Determination of Puerto Rican Citizens / Path Toward Full Statehood and Equal Rights", "10 = Puerto Rico Must Retain Its Unique Cultural Commonwealth Identity Free from Rushed Federal Statehood Schemes", 2, 8, 4, 1, 8, 1);

add(1980, "1980_fbi_cointelpro_former_directors_convicted", "Conviction of Former Top FBI Officials Felt and Miller for Illegal Break-Ins", "News", "1980 (Felt and Miller FBI Convictions)", "Governance & Judiciary", 2,
  "Federal jury convicting former top FBI officials Mark Felt and Edward Miller for ordering warrantless 'black-bag' burglaries of Weather Underground relatives; Reagan later pardons them.",
  "1 = Historic Vindication Affirming High FBI Bureaucrats Cannot Commit Unconstitutional Domestic Felonies with Impunity", "10 = Gross Injustice Prosecuting Patriotic Law Enforcement Leaders Battling Violent Communist Bombing Terrorists in Wartime", 2, 9, 2, 1, 9, 1);

// =========================================================================
// 1982 (50 Issues)
// =========================================================================
add(1982, "1982_post_wwii_record_unemployment_recession", "1982 Economic Recession: Unemployment Reaches Post-WWII Peak of 10.8%", "News", "1981-1982 (1982 Severe Recession)", "Economy & Taxation", 1,
  "Twelve million Americans thrown out of work as heavy industrial plants shutter across the Rust Belt and Midwest during the deepest economic slump since the Great Depression.",
  "1 = Decisive Proof That Supply-Side Reaganomics Has Failed Working Americans / Launch Emergency Federal Public Works Jobs Programs", "10 = The Painful, Necessary Price of Squeezing Out 15 Years of Ruinous Liberal Inflation; Stay the Course for Recovery", 2, 10, 9, 1, 9, 1);

add(1982, "1982_tefra_tax_equity_fiscal_responsibility_act", "Enactment of TEFRA ($98 Billion Tax Increase to Curb Federal Deficits)", "News", "1982 (TEFRA Deficit Reduction Act)", "Economy & Taxation", 1,
  "Reagan signing the largest peacetime tax hike in U.S. history ($98B over three years) rolling back certain corporate tax breaks to reassure financial markets about surging $128B deficits.",
  "1 = Responsible Bipartisan Fiscal Step Rolling Back Egregious Supply-Side Tax Loopholes for Wealthy Corporations", "10 = Disastrous Capitulation to Tax-and-Spend Congressional Democrats Sacrificing Growth to Appease Deficit Hawks", 2, 8, 10, 1, 9, 1);

add(1982, "1982_nuclear_freeze_movement_million_person_march", "Nuclear Freeze Movement & Historic Central Park Rally (One Million Marchers)", "News", "1982 (Nuclear Weapons Freeze Movement)", "Foreign Policy & Defense", 1,
  "One million Americans gathering in New York's Central Park in the largest disarmament rally in history demanding an immediate, mutual, verifiable freeze on nuclear weapons.",
  "1 = Inspiring Moral Awakening Demanding an Immediate Halt to the Reckless, Suicidal Thermonuclear Arms Race", "10 = Dangerous Soviet-Sponsored Delusion Freezing America into Strategic Vulnerability While Moscow Retains Massive Nuclear Superiority", 2, 10, 4, 1, 9, 1);

add(1982, "1982_boland_amendment_contra_aid_ban", "Enactment of the Boland Amendment (Barring U.S. Overthrow of Sandinistas)", "News", "1982 (Boland Amendment Enactment)", "Foreign Policy & Defense", 1,
  "House voting 411-0 to prohibit the CIA and Defense Department from using any funds to overthrow the Marxist Sandinista government of Nicaragua, setting up Iran-Contra clashes.",
  "1 = Essential Constitutional Defense Barring the CIA from Orchestrating Bloody, Illegal Wars of Aggression in Central America", "10 = Crippling Constraint Tying America's Hands While Moscow and Havana Establish a Soviet Beachhead in the Western Hemisphere", 2, 9, 3, 1, 9, 1);

add(1982, "1982_midterm_elections_stay_the_course_vs_dems", "1982 Midterm Elections: Democratic Resurgence (26 House Pickups)", "News", "1982 (Midterm Recession Vote)", "Governance & Judiciary", 1,
  "Voters delivering a stern referendum on the recession; Democrats expand their House majority by 26 seats while Republicans retain a narrow 54-46 Senate majority.",
  "1 = Resounding Repudiation of Trickle-Down Economics and Social Cuts; Democrats Will Defend the Vulnerable", "10 = Modest Historical Midterm Losses in a Deep Recession; The American People Voted to 'Stay the Course' with President Reagan", 2, 9, 6, 1, 9, 1);

add(1982, "1982_equal_rights_amendment_ratification_deadline_expires", "Equal Rights Amendment Ratification Deadline Expires (Failing by 3 States)", "News", "1982 (ERA Expiration)", "Civil Rights & Social Issues", 1,
  "June 30 deadline passing with only 35 of the required 38 state ratifications following a ferocious grassroots mobilization led by Phyllis Schlafly's STOP ERA.",
  "1 = Tragic, Outrageous Injustice Leaving Women's Fundamental Legal Equality Denied Constitutional Guarantee; Re-introduce Immediately", "10 = Splendid Victory for American Families and Christian Womanhood Defeating a Radical Unisex Federal Power Grab", 2, 10, 5, 1, 10, 1);

add(1982, "1982_voting_rights_act_amendments_25_year_extension", "Voting Rights Act Amendments of 1982 (25-Year Extension & Results Test)", "News", "1982 (VRA Extension & Section 2 Results)", "Civil Rights & Social Issues", 1,
  "Reagan signing a 25-year extension of the VRA including a compromised Section 2 establishing that discriminatory results (not just intent) violate minority voting rights.",
  "1 = Monumental Civil Rights Victory Cementing Fair Minority Representation and Striking Down Gerrymandered Vote Dilution", "10 = Flawed 'Results Test' Threatening to Mandate Proportional Racial Quotas and Subvert Merit in State Electoral Districts", 2, 8, 4, 1, 9, 1);

add(1982, "1982_att_antitrust_breakup_agreement", "Department of Justice Consent Decree Breaking Up the AT&T Bell System", "News", "1982 (AT&T Antitrust Breakup)", "Technology & Infrastructure", 1,
  "DOJ and AT&T agreeing to settle 8-year antitrust suit by breaking up Ma Bell into seven regional 'Baby Bells' (RBOCs) and opening long-distance telecoms to competition.",
  "1 = Historic Pro-Consumer Anti-Monopoly Triumph Shattering the Bell Empire to Spark Unprecedented High-Tech Telecom Innovation", "10 = Dismantling the World's Finest, Most Reliable Integrated Telecommunications Network and Driving Up Local Residential Phone Rates", 2, 8, 9, 2, 8, 1);

add(1982, "1982_tylenol_cyanide_tampering_packaging_revolution", "Chicago Tylenol Cyanide Murders & Introduction of Tamper-Evident Packaging", "News", "1982 (Tylenol Tampering Crisis)", "Healthcare", 1,
  "Seven people killed in Chicago by cyanide-laced Extra-Strength Tylenol capsules; Johnson & Johnson executes massive $100M recall and FDA mandates triple-seal tamper packaging.",
  "1 = Exemplary Corporate Civic Responsibility Coupled with Necessary FDA Universal Tamper-Resistant Medicine Packaging Rules", "10 = Celebrate Swift Private-Sector Ethics and Market Innovation In Responding to Deranged Criminal Domestic Terrorism", 2, 7, 7, 1, 7, 1);

add(1982, "1982_job_training_partnership_act_jtpa", "Enactment of the Job Training Partnership Act of 1982 (JTPA)", "News", "1982 (JTPA Enactment)", "Labor & Welfare", 1,
  "Replacing the public-service jobs of CETA with private-sector led Private Industry Councils (PICs) focusing on vocational skills training without public stipend wages.",
  "1 = Inadequate Step Eliminating Real Public Service Employment and Leaving Millions of Long-Term Jobless Workers Abandoned", "10 = Common-Sense Reform Ending Wasteful CETA Make-Work Patronage and Partnering Directly with Private Employers for Real Jobs", 2, 9, 9, 1, 9, 1);

add(1982, "1982_garn_st_germain_s_and_l_deregulation", "Enactment of the Garn-St. Germain Depository Institutions Act of 1982", "News", "1982 (Garn-St. Germain S&L Deregulation)", "Economy & Taxation", 1,
  "Sweeping deregulation of Savings and Loans allowing them to issue adjustable-rate mortgages, make commercial loans, and invest in high-risk speculative real estate.",
  "1 = Dangerous Unsupervised Deregulation Enabling S&L Executives to Gamble Taxpayer-Insured Deposits on Speculative Strip Malls", "10 = Essential Deregulation Providing Thrifts the Flexibility Needed to Survive Volcker's High Interest Rates in Modern Markets", 2, 9, 10, 1, 9, 2);

add(1982, "1982_surface_transportation_assistance_act_gas_tax", "Surface Transportation Assistance Act of 1982 (5-Cent Federal Gas Tax Hike)", "News", "1982 (5-Cent Highway Gas Tax Increase)", "Technology & Infrastructure", 1,
  "Reagan signing a 5-cent increase in the federal gasoline tax (to 9 cents/gal), dedicating 4 cents to deteriorating highways/bridges and 1 cent to mass transit.",
  "1 = Essential Bipartisan Infrastructure Investment Rebuilding America's Crumbling Roads, Bridges, and Urban Transit Lines", "10 = Punitive Tax Increase Breaking Conservative Anti-Tax Pledges and Raising the Cost of Driving for Working Families in a Recession", 2, 8, 10, 1, 9, 1);

add(1982, "1982_nuclear_waste_policy_act_of_1982", "Enactment of the Nuclear Waste Policy Act of 1982 (Deep Geologic Repository)", "News", "1982 (NWPA Enactment)", "Energy & Climate", 1,
  "Establishing a formal federal process, funded by a 1-mill/kWh levy on nuclear electricity, to site and construct a permanent deep underground geologic repository for spent nuclear fuel.",
  "1 = High Time the Federal Government Took Responsibility for Safely Interring Lethal Commercial Nuclear Spent Fuel", "10 = Western States Must Not Be Turned into America's Nuclear Garbage Dump Through Dictatorial Federal Preemption", 2, 8, 8, 1, 8, 1);

add(1982, "1982_plyler_v_doe_undocumented_schooling_ruling", "Plyler v. Doe Supreme Court Ruling (Free Public Education for Undocumented Children)", "News", "1982 (Plyler v. Doe Decision)", "Immigration", 1,
  "Supreme Court ruling 5-4 that Texas cannot deny free public schooling to undocumented immigrant children under the Equal Protection Clause.",
  "1 = Compassionate Affirmation of Fundamental Human Rights: Innocent Children Must Never Be Punished for Their Parents' Legal Status", "10 = Catastrophic Ruling Forcing American Taxpayers to Foot the Bill for Illegal Immigration and Creating a Massive Magnet for Influx", 2, 9, 6, 1, 10, 1);

add(1982, "1982_beirut_us_marines_peacekeeping_deployment", "Deployment of U.S. Marines to Beirut Multinational Peacekeeping Force", "News", "1982 (Beirut Marine Deployment)", "Foreign Policy & Defense", 1,
  "Reagan ordering 800 U.S. Marines to Beirut following the Israeli invasion of Lebanon to oversee PLO evacuation, later expanded to indefinite peacekeeping.",
  "1 = Dangerous, Ill-Defined Mission Putting American Troops in the Crosshairs of Fractious Lebanese Civil and Sectarian Warfare", "10 = Vital Display of Superpower Leadership Restoring Stability to the Shattered Levant and Backing Diplomatic Solutions", 2, 9, 3, 1, 9, 1);

add(1982, "1982_sabra_and_shatila_refugee_camp_massacres", "Sabra and Shatila Refugee Camp Massacres in West Beirut", "News", "1982 (Sabra & Shatila Trauma)", "Foreign Policy & Defense", 1,
  "Lebanese Christian Phalangist militia slaughtering up to 3,500 Palestinian and Lebanese Shiite civilians in refugee camps surrounding Israeli military lines.",
  "1 = Horrific War Crime Demanding Severe International Condemnation and Unvarnished Accounting of Israeli Military Complicity", "10 = Condemn the Brutal Phalangist Militia Killings While Recognizing the Immense Complexity of Urban Lebanese Sectarian Warfare", 2, 8, 3, 1, 8, 1);

add(1982, "1982_falklands_war_us_support_for_britain", "Falklands War: U.S. Military and Intelligence Assistance to Great Britain", "News", "1982 (Falklands War Alliance)", "Foreign Policy & Defense", 1,
  "Reagan administration formally siding with Margaret Thatcher's United Kingdom against Argentina's military junta, providing Sidewinder missiles and satellite intel.",
  "1 = Stand Resolutely with Our Closest Democratic NATO Ally Against Lawless Armed Aggression by an Odious Military Dictatorship", "10 = Disastrous Blunder Torpedoing Decades of Pan-American Alliances and Good Neighbor Diplomacy Throughout Latin America", 2, 9, 5, 1, 8, 1);

add(1982, "1982_reagan_british_parliament_ash_heap_speech", "President Reagan's Address to British Parliament ('Ash Heap of History')", "News", "1982 (Ash Heap of History Speech)", "Foreign Policy & Defense", 1,
  "Reagan addressing Westminster Abbey, predicting that Soviet Marxism-Leninism will end up on the 'ash heap of history' and proposing the National Endowment for Democracy (NED).",
  "1 = Dangerous Escalation of Bellicose Cold War Rhetoric Antagonizing Moscow When Prudent Nuclear Coexistence Is Needed", "10 = Eloquent, Prophetic Reassertion of Freedom's Destiny Over Tyranny, Galvanizing the Democratic Will of the Free World", 2, 10, 5, 1, 9, 1);

add(1982, "1982_epa_anne_gorsuch_contempt_superfund_scandal", "House Votes Anne Gorsuch Burford in Contempt of Congress (EPA Superfund Probe)", "News", "1982-1983 (EPA Superfund Scandals)", "Energy & Climate", 1,
  "House citing EPA Administrator Anne Gorsuch for contempt after she refused to surrender Superfund toxic cleanup enforcement files, citing executive privilege.",
  "1 = Sordid Scandal Proving Reagan's Regulators Are Secretly Colluding with Corporate Chemical Polluters to Weaken Toxic Laws", "10 = Partisan Congressional Ambush Violating Legitimate Executive Branch Confidentiality Over Sensitive Law Enforcement Files", 2, 9, 5, 1, 9, 1);

add(1982, "1982_reagan_school_lunch_ketchup_debates", "Reagan Administration Proposal Classifying Ketchup as a Vegetable in School Lunches", "News", "1981-1982 (School Lunch Ketchup Debates)", "Education", 2,
  "USDA drafting regulations allowing condiment pickle relish and ketchup to satisfy vegetable requirements to absorb a $1.5 billion budget cut, retracted after public ridicule.",
  "1 = Outrageous Mean-Spirited Nickel-and-Diming of Poor Schoolchildren's Basic Nutrition to Finance Tax Cuts for the Rich", "10 = Sensible Regulatory Flexibility Allowing Local School Cafeteria Directors to Manage Meal Costs Distorted by Partisan Hysteria", 2, 9, 6, 1, 9, 1);

add(1982, "1982_social_security_financing_crisis_greenspan_commission", "Social Security Trust Fund Nears Insolvency & Creation of Greenspan Commission", "News", "1981-1983 (Social Security Crisis)", "Labor & Welfare", 1,
  "Social Security trust funds projected to run dry by July 1983 due to double-digit inflation indexing and recession unemployment; Reagan appoints bipartisan Greenspan Commission.",
  "1 = Protect Guaranteed Social Security Benefits for Vulnerable Retirees / Oppose Any Scheme to Privatize or Slash Entitlements", "10 = Bipartisan Structural Reforms Are Mandatory: Raise the Retirement Age and Curb Inflation Cost Escalators to Save the System", 2, 9, 9, 1, 9, 1);

add(1982, "1982_reagan_new_federalism_medicaid_swap_proposal", "President Reagan's 'New Federalism' State-Federal Program Swap Proposal", "News", "1982 (New Federalism State Swap)", "Governance & Judiciary", 2,
  "Reagan proposing that the federal government assume full responsibility for Medicaid in exchange for transferring AFDC welfare, food stamps, and 40 grant programs to states.",
  "1 = Catastrophic Race to the Bottom That Will Dismantle the Federal Safety Net and Leave Impoverished States Unable to Feed Children", "10 = Visionary Restoration of True Constitutional Federalism Ending Fifty Years of Overweening Washington Paternalism", 2, 10, 9, 1, 10, 1);

add(1982, "1982_emergence_of_the_aids_crisis_cdc", "CDC First Identifies 'Acquired Immune Deficiency Syndrome' (AIDS)", "News", "1981-1983 (AIDS Epidemic Emergence)", "Healthcare", 1,
  "CDC naming the mysterious fatal immune deficiency disease afflicting hundreds of gay men, hemophiliacs, and intravenous drug users, demanding biomedical research.",
  "1 = Urgent National Public Health Emergency Demanding Massive Federal Biomedical Funding and Compassionate Care Free from Moral Stigma", "10 = Public Health Quarantine and Tracing Protocols Must Focus on Curbing High-Risk Behaviors Without Encouraging Homosexuality", 2, 9, 3, 1, 10, 1);

add(1982, "1982_reagan_radio_addresses_inaugurated", "President Reagan Inaugurates Weekly Saturday Radio Addresses to the Nation", "News", "1982 (Weekly Radio Address Tradition)", "Governance & Judiciary", 2,
  "Reagan launching weekly five-minute Saturday radio broadcasts directly to the American people, bypassing television gatekeepers to shape the public agenda.",
  "1 = Partisan Conservative Propaganda Broadcast Co-opting Public Radio Waves with Slick, Unchecked Political Salesmanship", "10 = Masterful Direct Communication Reviving FDR's Fireside Chats and Connecting the Presidency Directly to Everyday Citizens", 2, 8, 5, 1, 8, 1);

add(1982, "1982_us_steel_valley_mill_shutdowns_deindustrialization", "Catastrophic U.S. Steel Mill Closures in Pittsburgh, Youngstown, and Lackawanna", "News", "1982 (Rust Belt Steel Collapse)", "Economy & Taxation", 1,
  "Collapse of American domestic steel production to 40% of capacity; tens of thousands of lifelong union steelworkers permanently laid off in the Monongahela Valley.",
  "1 = Urgent National Crisis Demanding Federal Plant-Closing Notice Laws, Trade Retaliation, and Heartland Industrial Rebuilding", "10 = Sad but Inevitable Market Reality: Obsolete Plants and Uncompetitive Union Labor Must Give Way to Modern Mini-Mills", 2, 8, 9, 1, 8, 1);

add(1982, "1982_japanese_automobile_voluntary_export_restraints", "Japan Agrees to Extend Voluntary Export Restraints (VER) on Automobiles to 1.68M", "News", "1981-1983 (Japanese Auto VER)", "Economy & Taxation", 1,
  "Reagan administration pressuring Tokyo to voluntarily limit passenger car exports to 1.68 million units, giving Detroit automakers breathing room to retool.",
  "1 = Necessary Temporary Protection Shielding American Automobile Machinists While Factories Modernize Against Subsidized Imports", "10 = Backdoor Protectionist Quota That Drives Up Automobile Prices by $1,000 for American Consumers and Enriches Japanese Automakers", 2, 8, 10, 1, 8, 1);

add(1982, "1982_agricultural_farm_debt_crisis_foreclosures", "Midwestern Farm Debt Crisis: Soaring Foreclosures and Bank Failures", "News", "1982 (Farm Crisis Apex Genesis)", "Agriculture & Food", 1,
  "High Volcker interest rates, collapsing land values, and the Soviet grain embargo triggering thousands of family farm bankruptcies across Iowa, Minnesota, and Kansas.",
  "1 = Emergency Federal Farm Loan Moratoriums, Debt Restructuring, and Parity Price Floors to Halt the Destruction of Family Farms", "10 = Subsidizing Over-Leveraged Speculative Farmers Who Took On Bad Debt Will Merely Prolong Inevitable Agricultural Consolidation", 2, 8, 9, 1, 8, 1);

add(1982, "1982_first_artificial_heart_jarvik_7_implant", "First Permanent Artificial Heart Implant (Dr. Barney Clark & the Jarvik-7)", "News", "1982 (Jarvik-7 Artificial Heart)", "Healthcare", 2,
  "Dr. William DeVries implanting the Jarvik-7 air-powered mechanical heart into retired dentist Barney Clark at the University of Utah, sustaining his life for 112 days.",
  "1 = Breathtaking Breakthrough in Biomedical Engineering Paving the Way for Life-Saving Mechanical Organ Replacement", "10 = Profound Scientific Achievement, Though Staggering Costs and Quality-of-Life Questions Demand Deep Medical Ethics Review", 2, 7, 6, 2, 7, 1);

add(1982, "1982_balanced_budget_amendment_senate_approval", "Senate Passes Balanced Budget Constitutional Amendment (Defeated in House)", "News", "1982 (Balanced Budget Amendment Vote)", "Economy & Taxation", 1,
  "Senate passing (69-31) a constitutional amendment mandating a balanced federal budget except during declared wars; Democratic House leadership blocks it (236-187, short of 2/3).",
  "1 = Economic Straightjacket That Would Ban Counter-Cyclical Federal Stimulus During Recessions and Force Drastic Slashing of Social Security", "10 = Indispensable Constitutional Restraint to Halt Chronic, Irresponsible Congressional Deficit Spending and Protect Future Generations", 2, 10, 10, 1, 10, 1);

add(1982, "1982_space_shuttle_columbia_sts5_operational", "Space Shuttle Columbia Completes First Fully Operational Mission (STS-5)", "News", "1982 (Space Shuttle Operational Era)", "Technology & Infrastructure", 2,
  "NASA flying first four-astronaut crew aboard Columbia, successfully deploying two commercial communications satellites, declaring the Space Transportation System fully operational.",
  "1 = Proud Monument to American Aerospace Engineering Unlocking Cheap, Routine Reusable Access to Low Earth Orbit", "10 = Celebrate American Space Leadership While Transitioning Future Satellite Deployments to Commercial Free Enterprise Launchers", 2, 7, 7, 2, 7, 1);

add(1982, "1982_reagan_enterprise_zones_proposal", "Reagan & Jack Kemp Introduce Enterprise Zones Legislation", "News", "1982 (Enterprise Zones Initiative)", "Economy & Taxation", 2,
  "Proposing targeted capital gains tax holidays, regulatory relief, and hiring tax credits to attract private businesses into blighted inner-city neighborhoods.",
  "1 = Supply-Side Gimmick Siphoning Tax Dollars into Corporate Tax Shelters Without Providing Real Job Training or Infrastructure", "10 = Dynamic Conservative Solution Unleashing Free Enterprise and Entrepreneurial Capital into Distressed Urban Ghettoes", 2, 9, 10, 1, 9, 1);

add(1982, "1982_legal_services_corporation_funding_assault", "Reagan Administration Battles to Defund the Legal Services Corporation (LSC)", "News", "1981-1982 (LSC Defunding Clashes)", "Governance & Judiciary", 2,
  "Reagan proposing zero budget for LSC, arguing federal funds should not pay activist lawyers to file class action lawsuits against local welfare and housing agencies; Congress restores partial funds.",
  "1 = Cruel Defense of Equal Justice: Indigent Americans Must Have Access to Qualified Legal Counsel Against Slumlords and Bureaucrats", "10 = Outrageous Taxpayer Funding for Left-Wing Ideological Class-Action Litigators Undermining Local Welfare and Criminal Laws", 2, 9, 8, 1, 9, 1);

add(1982, "1982_intelligence_identities_protection_act", "Enactment of the Intelligence Identities Protection Act of 1982", "News", "1982 (Intelligence Identities Enacted)", "Governance & Judiciary", 2,
  "Criminalizing the deliberate unauthorized disclosure of the identities of covert American intelligence officers, agents, and informants.",
  "1 = Protect Innocent Undercover American Operatives from Being Targeted for Assassination by Hostile Foreign Intelligence and Terrorists", "10 = Dangerous Statute Threatening Investigative Journalists and Whistleblowers Exposing Illegal Covert Government Abuses", 2, 8, 3, 1, 8, 1);

add(1982, "1982_coastal_barrier_resources_act_enacted", "Enactment of the Coastal Barrier Resources Act of 1982 (CBRA)", "News", "1982 (CBRA Enacted)", "Energy & Climate", 2,
  "Withdrawing federal flood insurance, roads, and bridge subsidies from 1.3 million acres of undeveloped Atlantic and Gulf barrier islands.",
  "1 = Splendid Convergence of Fiscal Conservation and Environmental Protection Halting Subsidized Destruction of Barrier Beaches", "10 = Free-Market Common Sense: If Developers Choose to Build on Storm-Racked Sandbars, They Must Bear 100% of the Financial Risk", 2, 8, 10, 1, 8, 1);

add(1982, "1982_board_of_education_v_pico_book_banning", "Board of Education, Island Trees v. Pico (School Library Book Removals)", "News", "1982 (Pico School Book Banning Ruling)", "Education", 1,
  "Supreme Court ruling 5-4 that local school boards cannot remove books from school libraries simply because they dislike the political or social ideas contained within them.",
  "1 = Vital Defense of the First Amendment and Students' Right to Free Inquiry Free from Narrow-Minded Censorship", "10 = Subversive Destruction of Local School Board Authority to Protect Children from Vulgar, Lewd, and Anti-American Books", 2, 9, 4, 1, 10, 1);

add(1982, "1982_federal_courts_improvement_act_cafc", "Enactment of the Federal Courts Improvement Act of 1982 (Creating Federal Circuit)", "News", "1982 (CAFC Patent Court Enacted)", "Governance & Judiciary", 3,
  "Creating the U.S. Court of Appeals for the Federal Circuit (CAFC) to provide nationwide uniformity in patent appeals, commercial claims, and international trade.",
  "1 = Modern Judicial Architecture Ending Forum Shopping and Providing Predictable, Specialized Patent Law for High-Tech Industry", "10 = Sound Modernization Streamlining Federal Appeals and Strengthening American Technological Property Rights", 2, 7, 7, 1, 7, 1);

add(1982, "1982_mississippi_univ_for_women_v_hogan", "Mississippi University for Women v. Hogan (Exclusion of Male Nursing Students)", "News", "1982 (Hogan Gender Discrimination Ruling)", "Civil Rights & Social Issues", 2,
  "Supreme Court ruling 5-4 (O'Connor opinion) that a state-supported all-female nursing school's exclusion of men violates the Fourteenth Amendment Equal Protection Clause.",
  "1 = Historic Affirmation That Gender Classifications Must Satisfy Heightened Scrutiny Free from Outmoded Sex Stereotypes", "10 = Unwarranted Evisceration of Historic State Traditions and Single-Sex Educational Institutions Valued by Women", 2, 8, 4, 1, 9, 1);

add(1982, "1982_tefra_withholding_on_interest_and_dividends", "TEFRA 10% Withholding Tax on Bank Interest and Dividends (Banking Rebellion)", "News", "1982-1983 (Interest Withholding Rebellion)", "Economy & Taxation", 2,
  "TEFRA provision mandating banks withhold 10% of interest and dividends to halt rampant tax evasion; commercial banks launch massive postcard revolt forcing 1983 repeal.",
  "1 = Common-Sense Tax Compliance Ensuring Wealthy Investors Pay Taxes on Interest Just as Workers Do on Wages", "10 = Outrageous Hidden Withholding Confiscating the Modest Savings Interest of Millions of Elderly and Small Savers", 2, 9, 10, 1, 10, 1);

add(1982, "1982_six_hundred_ship_navy_battleship_revival", "Reagan's 600-Ship Navy Buildup & Recommissioning of USS New Jersey", "News", "1982 (600-Ship Navy & Battleship Revival)", "Foreign Policy & Defense", 1,
  "Navy Secretary John Lehman mobilizing massive shipbuilding program, recommissioning WWII battleship USS New Jersey armed with Tomahawk cruise missiles to dominate oceans.",
  "1 = Wasteful Cold War Bragging Spending Billions on Vulnerable Gun-Platform Dinosaurs When Modern Submarines and Missiles Rule the Waves", "10 = Unprecedented Projection of Sovereign American Seapower and Deterrence That Drives Soviet Admirals into Strategic Paralysis", 2, 9, 4, 1, 9, 1);

add(1982, "1982_clean_air_act_reauthorization_deadlock", "Congressional Deadlock Over Clean Air Act Reauthorization & Acid Rain Rules", "News", "1981-1982 (Clean Air Act Standoff)", "Energy & Climate", 1,
  "Clean Air Act expiring amidst fierce stalemate between Eastern environmentalists demanding mandatory sulfur scrubbers and Midwestern industry backed by Dingell.",
  "1 = Enforce Immediate 50% Reductions in Industrial Coal Sulfur Dioxide Emissions to Save Dying Forests and Lakes", "10 = Prevent Draconian Mandates That Threaten High-Sulfur Coal Mining Jobs and Skyrocket Electricity Rates for Heavy Industry", 2, 8, 8, 1, 8, 1);

add(1982, "1982_export_trading_company_act_of_1982", "Enactment of the Export Trading Company Act of 1982", "News", "1982 (Export Trading Company Act)", "Economy & Taxation", 3,
  "Allowing U.S. banks and trading companies to collaborate on joint international export ventures with antitrust exemptions to rival Japanese trading houses (sogo shosha).",
  "1 = Empower American Small and Mid-Sized Businesses to Band Together and Compete Formidably in Global Export Markets", "10 = Antitrust Immunity Threatening Domestic Competition and Opening Up Bank Commercial Speculation Abroad", 2, 8, 8, 1, 8, 1);

add(1982, "1982_tribal_governmental_tax_status_act", "Enactment of the Indian Tribal Governmental Tax Status Act of 1982", "News", "1982 (Tribal Tax Status Enacted)", "Civil Rights & Social Issues", 2,
  "Treating federally recognized Native American tribal governments as states for federal tax purposes, permitting issuance of tax-exempt municipal bonds.",
  "1 = Crucial Step Advancing Tribal Sovereignty and Allowing Reservations to Finance Essential Roads, Schools, and Utilities", "10 = Support Sovereign Self-Reliance While Ensuring Tribal Bond Issuances Finance True Public Infrastructure Rather Than Commercial Ventures", 2, 7, 5, 1, 7, 1);

add(1982, "1982_cia_director_william_casey_covert_buildup", "CIA Director William Casey Revitalizes Global Covert Operations", "News", "1981-1982 (Casey CIA Covert Doctrine)", "Foreign Policy & Defense", 1,
  "William Casey launching dozens of covert operations worldwide, funding anti-communist guerrillas in Afghanistan, Angola, and Nicaragua, restoring CIA clandestine capabilities.",
  "1 = Unchecked, Secret Rogue Warmaking Subverting Democratic Accountability and Violating Sovereign International Law", "10 = Indispensable Covert Shield Rolling Back Soviet-Backed Marxist Terror and Bleeding the Red Army Without Committing American Soldiers", 2, 10, 2, 1, 9, 1);

add(1982, "1982_reagan_proposal_to_abolish_department_of_energy", "President Reagan's Legislative Proposal to Abolish the Department of Energy", "News", "1981-1982 (DOE Abolition Effort)", "Energy & Climate", 2,
  "Reagan proposing to dismantle the five-year-old Energy Department, transferring nuclear weapons to Commerce and Interior; Democratic Congress rejects the plan.",
  "1 = Dismantling DOE Would Sabotage Vital National Renewable Research, Emergency Strategic Reserves, and Radioactive Waste Oversight", "10 = Eliminate a $10 Billion Monument to Bureaucratic Folly That Produces Not a Single Drop of Oil or Watt of Power", 2, 9, 10, 1, 10, 1);

add(1982, "1982_trucking_deregulation_industry_shakeout", "ICC Trucking Deregulation Aftermath: Surging Carrier Bankruptcies & Rate Wars", "News", "1981-1982 (Trucking Shakeout Crisis)", "Technology & Infrastructure", 2,
  "Over 200 major unionized trucking companies going bankrupt following the 1980 Motor Carrier Act, sparking Teamster protests over wage collapses.",
  "1 = Bitter Vindication Proving Cutthroat Deregulation Destroys Good Working-Class Union Wages and Compromises Highway Safety", "10 = Free Enterprise Market Adjustment Squeezing Out Inefficient Monopolistic Carriers and Saving Consumers Tens of Billions", 2, 8, 10, 2, 8, 1);

add(1982, "1982_first_african_american_mayor_chicago_harold_washington", "Harold Washington Announces Historic Bid for Mayor of Chicago", "News", "1982 (Harold Washington Campaign Genesis)", "Civil Rights & Social Issues", 1,
  "Congressman Harold Washington announcing progressive grassroots candidacy, mobilizing 100,000 new Black voters to challenge the fabled Cook County Democratic Machine.",
  "1 = Historic Grassroots Liberation Shattering Racist Machine Boss Rule and Empowering Disenfranchised Minorities and Reformers", "10 = Divisive Race-Conscious Campaign Threatening Longstanding Civic Coalitions and Municipal Stability in the Windy City", 2, 9, 3, 1, 9, 1);

add(1982, "1982_federal_deficit_crosses_one_hundred_billion", "Federal Annual Budget Deficit Exceeds $100 Billion for the First Time ($128B)", "News", "1982 (Deficit Crosses $100B)", "Economy & Taxation", 1,
  "Deep recession revenues and the 1981 Reagan tax cuts driving the annual federal deficit to a staggering record $128 billion, shocking Wall Street bond markets.",
  "1 = Irrefutable Proof of the Reckless Folly of Supply-Side Voodoo Economics Bleeding the Federal Treasury with Tax Giveaways to the Rich", "10 = Deficits Are the Transitory Product of Squeezing Out Inflation / The True Cause Is Rampant Congressional Social Spending", 2, 9, 10, 1, 9, 1);

add(1982, "1982_nuclear_freeze_referendums_sweep_states", "Nuclear Freeze Resolutions Win Landslides in Eight States and DC", "News", "1982 (State Nuclear Freeze Ballots)", "Foreign Policy & Defense", 1,
  "Ballot measures calling for a bilateral nuclear weapons freeze passing overwhelmingly in California, Massachusetts, Michigan, New Jersey, and four other states.",
  "1 = Resounding Grassroots Mandate Demanding the President Halt the Nuclear Arms Race and Negotiate Real Arms Reduction Now", "10 = Naive, Well-Intentioned Emotionalism Exploited by Pacifists That Undermines the President's Leverage in Geneva Missile Talks", 2, 9, 4, 1, 9, 1);

add(1982, "1982_reagan_veto_of_urgent_supplemental_appropriations", "President Reagan's Veto of Urgent Supplemental Appropriations Spending Bill", "News", "1982 (Reagan Spending Veto Overridden)", "Governance & Judiciary", 2,
  "Congress overriding Reagan's veto of a $14 billion funding bill (226-175 in House, 60-30 in Senate) as moderate Republicans join Democrats to preserve education and jobs funding.",
  "1 = Principled Defense of Critical Public Services, Student Aid, and Job Training Against Heartless Presidential Vetoes", "10 = Disappointing Capitulation by RINO Republicans Voting with Liberal Democrats to Bloat Federal Spending in a Deficit Crisis", 2, 9, 8, 1, 9, 1);

add(1982, "1982_military_buildup_m1_abrams_tank_fielded", "First Operational Army Units Equipped with M1 Abrams Main Battle Tank", "News", "1982 (M1 Abrams Tank Fielded)", "Foreign Policy & Defense", 2,
  "U.S. Army fielding revolutionary 60-ton turbine-powered M1 Abrams tank featuring Chobham composite armor and thermal sights to counter Soviet T-72s in Europe.",
  "1 = Expensive, Gas-Guzzling Complex Technological Monster Prone to Maintenance Nightmares on Rough Terrain", "10 = Decisive Technological Leap Giving American Armored Forces Incomparable Lethality and Crew Survivability on the Modern Battlefield", 2, 9, 5, 1, 9, 1);


console.log('Bracket C (1976-1982) total issues:', ISSUES.length);

module.exports = ISSUES;
