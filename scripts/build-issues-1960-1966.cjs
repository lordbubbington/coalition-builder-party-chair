/**
 * scripts/build-issues-1960-1966.cjs
 * Issues dataset for 1960, 1962, 1964, 1966 election cycles (Bracket A).
 * 50-52 issues per cycle across all 10 tiers.
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
// 1960 (52 Issues)
// =========================================================================
add(1960, "1960_missile_gap_national_defense", "The 'Missile Gap' & Strategic Nuclear Deterrence", "News", "1958-1962 (Missile Gap Controversy)", "Foreign Policy & Defense", 1,
  "Allegations by Democrats that the Eisenhower administration allowed the Soviet Union to achieve superiority in intercontinental ballistic missiles.",
  "1 = Close the Missile Gap / Surge Defense Spending on Minuteman ICBMs & Polaris Subs", "10 = Eisenhower Balanced Defense / Beware Unnecessary Military Spending & False Alarms", 3, 7, 5, 1, 8, 1);

add(1960, "1960_sit_in_movement_civil_rights", "Greensboro Lunch Counter Sit-Ins & Public Desegregation", "News", "1960-1964 (Sit-In Movement Arc)", "Civil Rights & Social Issues", 1,
  "Wave of nonviolent student sit-ins desegregating lunch counters and bus terminals across the Jim Crow South.",
  "1 = Federal Protection for Student Sit-Ins / Enact Comprehensive Public Accommodation Ban", "10 = Protect Private Property Rights of Shopkeepers / Oppose Federal Coercion of States", 3, 7, 4, 1, 10, 1);

add(1960, "1960_presidential_religious_test_catholicism", "JFK's Catholic Faith & Strict Church-State Separation", "News", "1960 (Houston Ministerial Address)", "Civil Rights & Social Issues", 1,
  "Concerns among Protestant ministers that a Catholic president would be subject to papal direction on public policy.",
  "1 = Absolute Separation of Church and State / Complete Rejection of Religious Tests", "10 = Defend Traditional Protestant Moral Culture / Scrutinize Catholic Political Influence", 2, 7, 3, 1, 8, 1);

add(1960, "1960_cuba_castro_nationalization_exiles", "Fidel Castro's Communist Alignment & Arming Cuban Exiles", "News", "1959-1965 (Cuban Revolution Fallout)", "Foreign Policy & Defense", 1,
  "Responding to Castro seizing American-owned refineries and plantations; debating trade embargoes and training anti-Castro exiles.",
  "1 = Restraint, Multilateral OAS Diplomacy, and Agrarian Reform Support", "10 = Total Economic Embargo / CIA Covert Training of Exile Forces to Overthrow Castro", 4, 9, 6, 1, 10, 1);

add(1960, "1960_medicare_for_aged_social_security", "Medical Insurance for the Aged Under Social Security (Forand/King-Anderson Bill)", "News", "1958-1965 (Medicare Legislative Battle)", "Healthcare", 2,
  "Creating a federally financed hospital insurance program for elderly retirees funded by an increase in payroll taxes.",
  "1 = Universal Hospital Care for the Aged Under Social Security as a Fundamental Right", "10 = Oppose 'Socialized Medicine' / Support Voluntary State Kerr-Mills Indigent Grants", 2, 9, 10, 1, 10, 1);

add(1960, "1960_federal_aid_to_public_education", "Federal Grants for Public School Construction and Teacher Salaries", "Ideological", "1945-1965 (Federal Aid to Education Arc)", "Education", 2,
  "Appropriating billions in federal funds to help local school districts build classrooms and raise teacher salaries without federal control.",
  "1 = Fully Fund Federal Education Grants to Remedy Glaring Regional Classroom Shortages", "10 = Prevent Federal Control of Local Curricula / Protect State Educational Autonomy", 2, 8, 10, 1, 10, 1);

add(1960, "1960_minimum_wage_increase_to_125", "Raising the Federal Minimum Wage from $1.00 to $1.25/Hour", "News", "1959-1961 (Minimum Wage Expansion)", "Labor & Welfare", 2,
  "Raising the federal minimum wage to $1.25 and extending coverage to millions of retail and service workers.",
  "1 = Raise Wage to $1.25+ and Extend Coverage to All Low-Wage Retail and Service Workers", "10 = Oppose Minimum Wage Hikes That Exacerbate Inflation and Hurt Small Retail Merchants", 2, 8, 10, 1, 9, 1);

add(1960, "1960_u2_spy_plane_paris_summit_collapse", "U-2 Spy Plane Shootdown & Collapse of Paris Peace Summit", "News", "1960 (U-2 Crisis)", "Foreign Policy & Defense", 2,
  "Soviet shootdown of Gary Powers' U-2 reconnaissance aircraft over Sverdlovsk, prompting Khrushchev to walk out of Paris summit.",
  "1 = Diplomatic Reconciliation / Negotiate Comprehensive Arms Control Treaties", "10 = Defend Inherent Right to Aerial Surveillance Against Closed Totalitarian Societies", 4, 9, 5, 1, 9, 1);

add(1960, "1960_dixiecrat_unpledged_electors", "Southern Unpledged Dixiecrat Electors & Harry Byrd Revolt", "News", "1960 (Southern Electoral Revolt)", "Governance & Judiciary", 2,
  "Southern Democratic state conventions running unpledged electors in Alabama and Mississippi to dead-lock the Electoral College.",
  "1 = Demand Strict Loyalty to National Democratic Platform of Civil Rights and Labor", "10 = Defend Southern States' Rights Against Federal Anti-Segregation Invasions", 3, 7, 5, 1, 10, 1);

add(1960, "1960_space_race_satellites_apollo", "Soviet Space Preeminence & Accelerating the American Space Program", "News", "1957-1969 (Space Race Era)", "Technology & Infrastructure", 2,
  "Surging NASA budgets to overcome Soviet space leads after Sputnik and Luna missions.",
  "1 = Prioritize Peaceful Scientific Exploration / Internationalize Space Missions", "10 = Massively Accelerate NASA Manned Spaceflight to Win the Space Race Against Moscow", 3, 8, 6, 2, 8, 1);

add(1960, "1960_landrum_griffin_labor_act_enforcement", "Landrum-Griffin Act of 1959 & Federal Union Financial Audits", "News", "1959-1964 (Labor Management Reporting)", "Labor & Welfare", 3,
  "Enforcing strict federal reporting, secret ballot rules, and anti-corruption oversight on labor union leadership.",
  "1 = Repeal Restrictions That Weaken Trade Unions and Hamstring Collective Bargaining", "10 = Enforce Rigorous Reporting to Protect Rank-and-File Workers from Corrupt Union Bosses", 2, 8, 8, 1, 9, 1);

add(1960, "1960_quemoy_matsu_defense_taiwan", "Defending Quemoy and Matsu Offshore Islands from Chinese Artillery", "News", "1958-1962 (Taiwan Strait Crisis Arc)", "Foreign Policy & Defense", 3,
  "Debating whether the U.S. security guarantee extends to defending Nationalist-held islands within sight of mainland China.",
  "1 = Draw Defensive Line Strictly at Taiwan and Pescadores / Avoid Nuclear War Over Tiny Rocks", "10 = Unshakable Defense of Every Free Territory Against Chinese Communist Aggression", 3, 9, 4, 1, 9, 1);

add(1960, "1960_california_water_project_prop_1", "California Proposition 1 ($1.75 Billion State Water Project Bond)", "News", "1960 (Historic Water Infrastructure Bond)", "Energy & Climate", 3,
  "Authorizing $1.75 billion in bonds to construct the California Aqueduct transporting northern water to southern farms and cities.",
  "1 = Vote Yes / Essential Engineering Vision Fueling California's Booming Agricultural and Urban Growth", "10 = Vote No / Enormous Fiscal Debt Subsidizing Wealthy Agribusiness at Northern Expense", 3, 6, 8, 1, 7, 1);

add(1960, "1960_depressed_areas_redevelopment_veto", "Federal Aid to Economically Depressed Industrial and Mining Areas", "News", "1958-1961 (Area Redevelopment Act Arc)", "Economy & Taxation", 3,
  "Eisenhower vetoing federal grant legislation to assist chronically depressed coal mining and textile towns in Appalachia.",
  "1 = Override Veto / Deliver Targeted Federal Public Works and Loan Capital to Stagnant Regions", "10 = Uphold Veto / Prevent Federal Subsidies from Distorting Natural Economic Migration Patterns", 2, 8, 10, 1, 9, 1);

add(1960, "1960_agricultural_surpluses_parity_prices", "Agricultural Surplus Stockpiles & 90% Parity Crop Price Supports", "Ideological", "1933-1973 (Parity Price Supports Arc)", "Agriculture & Food", 3,
  "Managing billions of dollars in government-held grain stockpiles; choice between high mandatory parity supports or flexible markets.",
  "1 = Support Family Farms with Supply Management Controls and Direct Food Stamp Distribution", "10 = Phase Out Costly Parity Subsidies and Transition to Free-Market Commodity Agriculture", 2, 8, 10, 1, 7, 2);

add(1960, "1960_civil_rights_act_of_1960", "Civil Rights Act of 1960 & Federal Voting Referees", "News", "1960 (Voting Rights Precursor)", "Civil Rights & Social Issues", 3,
  "Empowering federal court-appointed referees to register Black voters in counties with systemic racial discrimination.",
  "1 = Strengthen Federal Powers / Send Armed Marshals to Overcome Southern Resistance", "10 = Protect Traditional State County Election Jurisdiction from Federal Judicial Usurpation", 3, 7, 4, 1, 10, 1);

add(1960, "1960_nuclear_test_ban_talks_geneva", "Geneva Conference on the Discontinuance of Nuclear Weapons Tests", "News", "1958-1963 (Test Ban Treaty Arc)", "Foreign Policy & Defense", 3,
  "Negotiating a trilateral moratorium on atmospheric and underground nuclear tests with Britain and the Soviet Union.",
  "1 = Conclude a Comprehensive Nuclear Test Ban Treaty to Halt Deadly Radioactive Fallout", "10 = Maintain Testing Rights Unless Moscow Agrees to Intrusive On-Site Verification Inspections", 3, 8, 4, 1, 9, 1);

add(1960, "1960_b70_valkyrie_bomber_cutbacks", "Curtailing the Mach-3 B-70 Valkyrie Strategic Bomber Program", "News", "1959-1961 (Strategic Bomber Battles)", "Foreign Policy & Defense", 4,
  "Eisenhower administration cutting the Mach-3 high-altitude bomber fleet to prototype status in favor of ballistic missiles.",
  "1 = Fully Resource ICBMs and Submarines While Retiring Vulnerable Manned Strategic Bombers", "10 = Restore Full B-70 Production to Maintain Decisive Manned Strategic Air Command Dominance", 3, 8, 6, 1, 8, 1);

add(1960, "1960_first_televised_presidential_debates", "Impact of First Televised Presidential Debates on Democracy", "News", "1960 (Televised Debates Genesis)", "Governance & Judiciary", 4,
  "Debating whether television debates elevate charisma, visual appearance, and makeup over intellectual policy substance.",
  "1 = Transformative Democratic Innovation Allowing 70 Million Citizens to Judge Nominees Directly", "10 = Danger of Reducing Serious Statesmanship and Governance to Hollywood Style and Soundbites", 2, 6, 4, 2, 7, 1);

add(1960, "1960_right_to_work_section_14b", "Section 14(b) of Taft-Hartley & State Right-to-Work Laws", "Ideological", "1947-2026 (Right-to-Work Arc)", "Labor & Welfare", 3,
  "Preserving federal statutory authority for states to prohibit union shop contracts requiring workers to pay union dues.",
  "1 = Repeal Section 14(b) Nationwide to Stop Anti-Union Free Riding and Protect Wages", "10 = Defend State Right-to-Work Laws Guaranteeing Workers the Freedom Not to Join a Union", 2, 9, 10, 1, 10, 1);

add(1960, "1960_foreign_aid_mutual_security", "Mutual Security Act Foreign Economic & Military Assistance Outlays", "Ideological", "1949-1970 (Cold War Foreign Aid Arc)", "Foreign Policy & Defense", 4,
  "Appropriating $4+ billion annually in foreign economic development and military gear to shield Third World nations from Soviet influence.",
  "1 = Expand Non-Military Economic Development Aid to Alleviate Global Poverty and Hunger", "10 = Slash Wasteful Foreign Handouts That Siphon American Wealth into Incompetent Regimes", 3, 8, 9, 1, 10, 1);

add(1960, "1960_oil_import_mandatory_quotas", "Eisenhower Mandatory Oil Import Quota Program (MOIP)", "News", "1959-1973 (Oil Quota Era)", "Energy & Climate", 4,
  "Restricting low-cost foreign crude imports to 12% of domestic production to preserve American domestic oil drilling capacity.",
  "1 = Protect Domestic Energy Independence and National Security from Foreign Oil Glut", "10 = Free Market Trade / Eliminate Quotas That Artificially Inflate Heating and Gasoline Prices", 4, 8, 9, 2, 8, 1);

add(1960, "1960_interstate_highway_trust_fund_financing", "Federal Highway Trust Fund Deficits & 1-Cent Gasoline Tax Increase", "News", "1959-1961 (Interstate Financing Arc)", "Technology & Infrastructure", 4,
  "Levying an additional 1-cent-per-gallon federal excise tax on gasoline to keep construction of the 41,000-mile Interstate system solvent.",
  "1 = Complete the Historic National Interstate System Through Dedicated Dedicated Highway User Fees", "10 = Oppose Raising Regressive Fuel Taxes on American Drivers / Slow Construction Timelines", 3, 7, 8, 2, 8, 1);

add(1960, "1960_civil_defense_fallout_shelters", "Federal Subsidies for Home and Community Nuclear Fallout Shelters", "News", "1958-1962 (Fallout Shelter Boom)", "Civil Rights & Social Issues", 4,
  "Debating whether the federal government should mandate and subsidize underground fallout shelters in every American backyard and public building.",
  "1 = Focus on Arms Control and Disarmament Rather Than Normalizing Nuclear War Survival", "10 = Prepare the Population with Robust Civil Defense to Ensure National Survival in a Nuclear Attack", 3, 8, 6, 1, 9, 1);

add(1960, "1960_panama_canal_flag_display_sovereignty", "Panama Canal Zone Riots & Flying the Panamanian Flag", "News", "1959-1964 (Canal Zone Sovereignty Arc)", "Foreign Policy & Defense", 5,
  "Eisenhower ordering the Panamanian flag to be flown alongside the American flag in the Canal Zone to ease nationalist tensions.",
  "1 = Prudent Diplomatic Concession Recognizing Panamanian Titular Sovereignty and Friendship", "10 = Surrender of Inalienable American Sovereign Territory / Disgraceful Appeasement of Mobs", 3, 8, 4, 1, 10, 1);

add(1960, "1960_reciprocal_trade_agreements_renewal", "Trade Agreements Extension Act & Tariff Reduction Authority", "Ideological", "1934-1962 (RTAA Era)", "Trade & Globalism", 4,
  "Granting the President authority to negotiate reciprocal bilateral tariff reductions with European Common Market nations.",
  "1 = Expand Free Trade Agreements to Unify Western Democracies and Spark Export Growth", "10 = Enforce Peril-Point and Escape Clauses to Protect Vulnerable Domestic Textile and Glass Mills", 3, 7, 7, 2, 6, 1);

add(1960, "1960_fair_housing_civil_rights_executive_order", "Executive Order Mandating Equal Access in Federally Assisted Housing", "News", "1960-1962 (Housing Integration Precursor)", "Civil Rights & Social Issues", 3,
  "Calling on the President to end racial discrimination in FHA and VA federally backed housing with a 'stroke of the pen'.",
  "1 = Immediately Sign Executive Order Ending Racial Segregation in All Federal Housing", "10 = Prevent Federal Executive Dictates Over Private Real Estate Sales and Mortgage Contracts", 2, 8, 4, 1, 10, 1);

add(1960, "1960_birth_control_fda_approval_enovid", "FDA Approval of Enovid as First Oral Contraceptive Pill", "News", "1960-1965 (Contraceptive Revolution)", "Civil Rights & Social Issues", 4,
  "FDA approving the first daily oral contraceptive pill, sparking intense religious, legal, and reproductive rights controversies.",
  "1 = Historic Scientific Breakthrough for Women's Autonomy, Family Planning, and Health", "10 = Oppose Chemical Contraception Violating Sacred Natural Law and Promoting Sexual Promiscuity", 2, 8, 2, 1, 10, 1);

add(1960, "1960_columbia_river_treaty_canada", "Columbia River Treaty with Canada for Shared Hydroelectric Dams", "News", "1960-1964 (Pacific Northwest Water Treaty)", "Energy & Climate", 5,
  "Bilateral treaty coordinating flood control and water storage behind four new dams in British Columbia and Montana.",
  "1 = Visionary Cooperative International River Basin Management Delivering Abundant Clean Hydro", "10 = Ensure Fair Financial Compensation and Protect Downstream American Water Rights", 3, 7, 6, 1, 7, 1);

add(1960, "1960_sugar_act_cuban_quota_slash", "Slashing Cuba's 3-Million-Ton Sugar Quota Under the Sugar Act", "News", "1960-1962 (Sugar Sanctions Arc)", "Trade & Globalism", 4,
  "Presidential authority to reduce sugar imports from Cuba and reallocate lucrative import quotas to allied Latin American nations.",
  "1 = Target Castrist Economic Coercion While Providing Generous Quotas to Democratic Allies", "10 = Decisive Action Depriving Castro of American Dollars / Protect Domestic Beet Sugar Farmers", 3, 8, 6, 1, 9, 1);

add(1960, "1960_peace_corps_youth_service_proposal", "JFK's 2 A.M. Ann Arbor Address Proposing the Peace Corps", "News", "1960-1961 (Peace Corps Genesis)", "Foreign Policy & Defense", 3,
  "Proposing a volunteer agency of young American teachers and technicians to serve in developing nations around the globe.",
  "1 = Inspiring Idealistic Foreign Service Spreading Democracy and Practical Skills Across Developing World", "10 = Naive, Costly 'Kiddie Korps' Ineffective at Countering Hard-Nosed Soviet Subversion", 2, 8, 5, 1, 7, 1);

add(1960, "1960_postal_rate_hikes_fourth_class", "Congressional Battles over Increasing First-Class Postage to 5 Cents", "News", "1958-1962 (Postal Deficit Debates)", "Governance & Judiciary", 5,
  "Post Office proposals to raise letter stamps from 4 cents to 5 cents to stem chronic department operating deficits.",
  "1 = Protect Postal Service as an Essential Public Utility for Communication and Commerce", "10 = Raise Postage Rates to Eliminate Deficits and Shield Taxpayers from Postal Subsidies", 3, 8, 8, 2, 8, 1);

add(1960, "1960_wilderness_bill_humphrey_push", "National Wilderness Preservation System Act (Humphrey Bill)", "Ideological", "1956-1964 (Wilderness Act Battle)", "Energy & Climate", 4,
  "Designating federal public lands where the earth and community of life remain untrammeled by man, barring commercial timber and mining.",
  "1 = Permanently Protect Pristine Wilderness Areas from Corporate Exploitation", "10 = Oppose Locking Up Billions in Timber, Grazing, and Mineral Wealth Needed for Economic Growth", 2, 8, 9, 1, 9, 1);

add(1960, "1960_poll_tax_abolition_resolution", "Constitutional Amendment to Abolish the Poll Tax in Federal Elections", "News", "1960-1964 (24th Amendment Arc)", "Civil Rights & Social Issues", 3,
  "Initiating congressional resolutions to outlaw the poll tax in federal elections across five remaining southern states.",
  "1 = Abolish Unconstitutional Poll Taxes Designed to Disenfranchise Poor Black and White Citizens", "10 = Defend State Constitutional Sovereignty to Establish Voter Qualifications Without Federal Meddling", 2, 8, 3, 1, 10, 1);

add(1960, "1960_payola_broadcast_investigations", "Congressional Payola Investigations in Rock-and-Roll Radio", "News", "1959-1960 (Payola Hearings)", "Technology & Infrastructure", 5,
  "House committee investigating record companies bribing disc jockeys like Alan Freed to play rock-and-roll records.",
  "1 = Regulate Commercial Airwaves and Criminalize Deceptive Pay-for-Play Broadcast Fraud", "10 = Avoid Heavy-Handed Federal Censorship and Meddling in Commercial Music and Radio Programming", 3, 7, 5, 2, 8, 1);

add(1960, "1960_unemployment_recession_fourth_post_war", "Emergence of 1960-1961 Recession & 6.8% Unemployment Rate", "News", "1960-1961 (Fourth Post-War Slump)", "Economy & Taxation", 2,
  "Confronting rising layoffs in steel and auto manufacturing as the economy slips into its third recession in seven years.",
  "1 = Enact Robust Federal Keynesian Stimulus, Extended Unemployment Benefits, and Public Works", "10 = Maintain Sound Money, Protect the Gold Reserve, and Avoid Inflationary Deficit Spending", 2, 9, 10, 1, 10, 1);

add(1960, "1960_us_gold_outflows_dollar_drain", "U.S. Balance of Payments Deficits & London Gold Market Pressure", "News", "1958-1968 (Gold Pool & Dollar Stability Arc)", "Economy & Taxation", 2,
  "European central banks converting surplus dollars into gold, threatening the U.S. statutory $35/ounce gold peg.",
  "1 = Restructure International Monetary Reserves and Enact Controls on Foreign Capital Outflows", "10 = Enforce Strict Domestic Fiscal Austerity, Balanced Budgets, and Protect the Gold Standard", 3, 9, 10, 1, 10, 2);

add(1960, "1960_labor_featherbedding_diesel_firemen", "Railroad Work Rule Disputes & Eliminating Diesel Locomotive Firemen", "News", "1959-1963 (Railroad Labor Dispute)", "Labor & Welfare", 4,
  "Railroad carriers seeking to eliminate 40,000 union locomotive firemen on diesel engines as obsolete 'featherbedding'.",
  "1 = Protect Railroad Brotherhood Jobs, Operational Safety, and Collective Bargaining Agreements", "10 = Eliminate Obsolete Featherbedding to Save Bankrupt Railroads and Modernize Transportation", 2, 8, 9, 1, 9, 1);

add(1960, "1960_fcc_quiz_show_rigging_regulations", "Communications Act Amendments of 1960 Banning Rigged Quiz Shows", "News", "1959-1960 (Quiz Show Scandal)", "Technology & Infrastructure", 6,
  "Enacting federal criminal penalties for deceptive broadcast fraud following revelations of rigging on 'Twenty-One'.",
  "1 = Enforce Public Interest Standards on Broadcast Networks to Restore Public Trust", "10 = Industry Self-Policing and Network Standards Without Expanding Federal Bureaucracy", 2, 7, 4, 1, 7, 1);

add(1960, "1960_laos_neutrality_vs_intervention", "Pathet Lao Communist Insurgency & U.S. Military Aid to Royal Laos", "News", "1959-1962 (Laotian Crisis Arc)", "Foreign Policy & Defense", 3,
  "CIA and Pentagon covert support for anti-communist general Phoumi Nosavan versus backing a neutralist coalition in Vientiane.",
  "1 = Pursue Genuine Neutrality and Diplomatic Settlement at an International Geneva Conference", "10 = Prevent the Domino Effect in Southeast Asia by Military Force to Block Communist Takeover of Laos", 3, 9, 3, 1, 9, 1);

add(1960, "1960_federal_urban_renewal_title_one", "Title I Housing Act Urban Renewal & 'Negro Removal' Controversies", "Ideological", "1949-1974 (Urban Renewal Arc)", "Labor & Welfare", 4,
  "Bulldozing low-income inner-city neighborhoods for commercial skyscrapers, highways, and civic centers under urban renewal.",
  "1 = Halt Destructive Wholesale Slum Clearance / Require Direct Resident Replacement Housing", "10 = Rebuild Crumbling Urban Centers to Attract Private Investment and Middle-Class Tax Base", 3, 7, 7, 1, 7, 1);

add(1960, "1960_alaska_hawaii_initial_federal_representation", "First Federal Elections for Newly Admitted Alaska and Hawaii", "News", "1959-1960 (Statehood Integration)", "Governance & Judiciary", 5,
  "Integrating the 49th and 50th states into the federal union and expanding Senate to 100 members.",
  "1 = Celebrate Expansion of Democracy and Representation for Pacific and Arctic Citizens", "10 = Support Orderly Integration While Guarding Against Non-Contiguous Regional Distortions", 2, 6, 4, 1, 6, 1);

add(1960, "1960_kerr_mills_act_indigent_elderly", "Enactment of Kerr-Mills Act (Means-Tested State Medical Grants)", "News", "1960 (Kerr-Mills Alternative)", "Healthcare", 4,
  "Bipartisan law providing federal matching funds to states that voluntarily provide medical assistance to indigent elderly.",
  "1 = Inadequate Piecemeal Charity That Degrades Seniors with Humiliating Means Tests", "10 = Sound Alternative Providing Targeted Medical Care to Truly Needy Seniors Without Socialized Mandates", 2, 8, 8, 1, 8, 1);

add(1960, "1960_federal_communications_commission_vhf_uhf", "FCC All-Channel Receiver Legislation Mandating UHF Tuners", "News", "1960-1962 (All-Channel Television Act)", "Technology & Infrastructure", 6,
  "Requiring all newly manufactured television sets to receive UHF channels 14-83 as well as standard VHF channels 2-13.",
  "1 = Promote Educational Public Broadcasting and Expand Diverse Television Competition", "10 = Oppose Manufacturing Mandates That Inflate Television Receiver Prices for Consumers", 2, 7, 6, 1, 7, 1);

add(1960, "1960_cranberry_aminotriazole_scare", "Great Cranberry Cancer Scare & Delaney Clause Enforcement", "News", "1959-1960 (Delaney Clause Crisis)", "Agriculture & Food", 6,
  "HEW Secretary warning the public against eating cranberries contaminated with weedkiller aminotriazole days before Thanksgiving.",
  "1 = Strict Precautionary Health Protection / Zero Tolerance for Known Carcinogens in Food", "10 = Irresponsible Government Panic That Bankrupted Innocent Cranberry Growers Over Trivial Trace Residues", 2, 7, 6, 1, 7, 1);

add(1960, "1960_civil_defense_school_evacuation_drills", "Mandatory 'Duck and Cover' Nuclear Drills in American Schools", "News", "1951-1963 (Duck and Cover Era)", "Education", 5,
  "Conducting nationwide student air-raid drills, ducking under wooden desks and lining school hallways with hands over heads.",
  "1 = Cruel Psychological Terrorizing of Children for a Useless Defense Against Hydrogen Weapons", "10 = Prudent Survival Preparedness Instilling Patriotism, Discipline, and Readiness in Youth", 3, 8, 5, 1, 9, 1);

add(1960, "1960_texas_land_commission_submerged_lands", "Supreme Court Tidelands Ruling on Texas and Florida Offshore Oil", "News", "1960 (Submerged Lands Jurisprudence)", "Energy & Climate", 6,
  "Supreme Court ruling Texas and Florida possess historic offshore oil boundaries extending 3 marine leagues (10.3 miles).",
  "1 = Uphold Federal Jurisdiction Over Continental Shelf Resources for All American Citizens", "10 = Celebrate Historic State Property Rights and Sovereign Ownership of Continental Shelf Oil", 3, 8, 8, 1, 9, 1);

add(1960, "1960_internal_revenue_service_automation", "IRS Installation of National Computer Center and Social Security Tax IDs", "News", "1960-1962 (IRS Computerization)", "Governance & Judiciary", 6,
  "Transitioning federal tax processing to IBM mainframe computers and requiring Social Security numbers on all bank accounts.",
  "1 = Ensure Equitable Tax Collection and Close Massive Underreporting of Dividend and Interest Income", "10 = Dangerous Surveillance State Infrastructure Intruding on Private Banking Confidentiality", 2, 8, 2, 1, 8, 1);

add(1960, "1960_cuba_refugee_emergency_center_miami", "Federal Aid for Cuban Refugees Fleeing Castro into South Florida", "News", "1960-1965 (Cuban Refugee Program Genesis)", "Immigration & Border", 3,
  "Appropriating emergency presidential contingency funds to establish the Cuban Refugee Center in Miami to resettle exiles.",
  "1 = Welcome Freedom-Loving Cuban Refugees with Comprehensive Federal Education, Job, and Medical Aid", "10 = Support Anti-Communist Victims of Tyranny While Preventing Excessive Local Taxpayer Strains in Florida", 2, 8, 4, 1, 8, 1);

add(1960, "1960_antarctic_treaty_ratification", "Senate Ratification of the Antarctic Treaty (Barring Military Fortifications)", "News", "1959-1961 (Antarctic Non-Militarization)", "Foreign Policy & Defense", 5,
  "Ratifying international treaty dedicating the entire Antarctic continent exclusively to peaceful scientific research.",
  "1 = Historic Precedent for Peaceful Scientific Disarmament and Complete Nuclear-Free Demilitarization", "10 = Safeguard American Strategic Territorial Claims and Ensure Ironclad Anti-Soviet Inspection Rights", 3, 7, 4, 1, 8, 1);

add(1960, "1960_fairness_doctrine_editorializing", "FCC Enforcement of the Fairness Doctrine on Controversial Issues", "Ideological", "1949-1987 (Fairness Doctrine Arc)", "Technology & Infrastructure", 5,
  "Mandating broadcast stations present contrasting viewpoints on controversial issues of public importance.",
  "1 = Protect Public Airwaves from Monopoly Corporate Control and Ensure Balanced Civic Debate", "10 = Unconstitutional Government Infringement on First Amendment Editorial Freedom of Broadcasters", 2, 8, 5, 1, 8, 1);

add(1960, "1960_defense_production_act_reauthorization", "Two-Year Reauthorization of Defense Production Act Priorities", "News", "1950-1970 (Cold War Industrial Base)", "Economy & Taxation", 6,
  "Maintaining presidential authority to prioritize military contracts and maintain national stockpiles of strategic materials.",
  "1 = Essential Economic Command Authority to Guarantee Strategic Preparedness for Superpower Crises", "10 = Limit Peacetime Government Intervention in Private Industrial Manufacturing and Supply Chains", 3, 8, 8, 1, 8, 1);

console.log('1960 issues complete:', ISSUES.length);
// =========================================================================
// 1962 (52 Issues)
// =========================================================================
add(1962, "1962_cuban_missile_crisis_quarantine", "Cuban Missile Crisis: Naval Quarantine & Soviet Missile Dismantlement", "News", "1962 (Thirteen Days Crisis)", "Foreign Policy & Defense", 1,
  "Naval blockade of Cuba and tense nuclear standoff resulting in Khrushchev removing ballistic missiles in exchange for U.S. non-invasion pledge.",
  "1 = Masterful Diplomatic Restraint and Calibrated Deterrence Averting Catastrophic World War III", "10 = Demand Immediate On-Site Inspections / Oppose Weak Secret Concessions Trading Jupiter Missiles in Turkey", 2, 8, 3, 1, 8, 1);

add(1962, "1962_james_meredith_ole_miss_riots", "Desegregation of Ole Miss & Federal Troop Deployment in Oxford", "News", "1962 (Ole Miss Integration Crisis)", "Civil Rights & Social Issues", 1,
  "Enforcing court order enrolling James Meredith at the University of Mississippi despite violent segregationist riots and Governor Barnett's defiance.",
  "1 = Send Federal Marshals and U.S. Army Troops to Smash Segregationist Nullification and Enforce Court Orders", "10 = Condemn Federal Military Invasion of Sovereign State Universities / Defend Constitutional States' Rights", 2, 8, 4, 1, 10, 1);

add(1962, "1962_engel_v_vitale_school_prayer", "Supreme Court Ruling Banning Mandatory School Prayer (Engel v. Vitale)", "News", "1962 (School Prayer Jurisprudence)", "Civil Rights & Social Issues", 1,
  "Supreme Court holding 6-1 that state-composed voluntary nondenominational prayers in public classrooms violate the Establishment Clause.",
  "1 = Essential Vindication of Church-State Separation Protecting Religious Minorities from Government Coercion", "10 = Outrageous Judicial Activism Banishing God and the Christian Faith from Public Classrooms", 2, 9, 3, 1, 10, 1);

add(1962, "1962_twenty_fourth_amendment_poll_tax", "Congressional Submission of the 24th Amendment Banning Poll Taxes", "News", "1962-1964 (24th Amendment Ratification)", "Civil Rights & Social Issues", 1,
  "Submitting constitutional amendment to states to abolish the poll tax in federal elections, striking down a major Jim Crow voting obstacle.",
  "1 = Eliminate Odious Economic Obstacles Designed to Deprive Black and Impoverished Americans of the Ballot", "10 = Support Ratification While Guarding Against Federal Encroachment on State Voter Registration Integrity", 2, 8, 3, 1, 9, 1);

add(1962, "1962_trade_expansion_act_kennedy_round", "Trade Expansion Act of 1962 & Launching the GATT Kennedy Round", "News", "1962-1967 (Kennedy Round Tariff Cuts)", "Trade & Globalism", 1,
  "Granting the President authority to slash tariffs by up to 50% across the board to negotiate with the booming European Common Market.",
  "1 = Transformative Free Trade Leadership Integrating Democratic Economies / Create Trade Adjustment Assistance", "10 = Protect Traditional American Manufacturing from Cheap Foreign Import Surges That Decimate Factories", 2, 8, 8, 1, 5, 1);

add(1962, "1962_jfk_steel_price_confrontation", "JFK Confrontation with Big Steel & Rolling Back Price Hikes", "News", "1962 (Steel Price Rollback)", "Economy & Taxation", 1,
  "President Kennedy publicly attacking Roger Blough and U.S. Steel for violating wage-price guideposts with a $6/ton price hike, forcing a rollback.",
  "1 = Decisive Presidential Action Defending Public Interest and Halting Destructive Wage-Price Inflation", "10 = Unprecedented Executive Bullying, FBI Intimidation, and Coercive Anti-Capitalist Price Controls", 2, 9, 10, 1, 9, 1);

add(1962, "1962_baker_v_carr_one_person_one_vote", "Supreme Court Reapportionment Revolution (Baker v. Carr)", "News", "1962-1964 (One Person One Vote Doctrine)", "Governance & Judiciary", 1,
  "Holding that legislative malapportionment cases are justiciable under the Equal Protection Clause, ending rural strangleholds on state legislatures.",
  "1 = Historic Triumph of Equal Representation Guaranteeing Every Citizen's Vote Carries Equal Weight", "10 = Unconstitutional Usurpation of State Sovereignty Forcing Unwanted Structural Mandates on State Senates", 2, 9, 5, 1, 10, 1);

add(1962, "1962_silent_spring_pesticide_awakening", "Rachel Carson's 'Silent Spring' & Federal Scrutiny of DDT", "News", "1962-1972 (Modern Environmental Awakening)", "Energy & Climate", 1,
  "Publication of 'Silent Spring' exposing the catastrophic ecological devastation and cancer risks caused by indiscriminate chemical pesticide spraying.",
  "1 = Immediate Federal Restrictions on Toxic Pesticides / Protect Wildlife and Public Health from Chemical Giants", "10 = Defend Invaluable Modern Agrochemicals That Eradicated Malaria and Power America's Miracle Crop Abundance", 2, 8, 7, 1, 8, 1);

add(1962, "1962_thalidomide_tragedy_kefauver_harris", "Thalidomide Birth Defects & Kefauver-Harris Drug Amendments of 1962", "News", "1962 (Modern FDA Drug Mandate)", "Healthcare", 1,
  "Dr. Frances Kelsey blocking thalidomide in the U.S. following European birth defect tragedies, prompting mandatory FDA efficacy trials.",
  "1 = Mandate Strict Clinical Proof of Safety and Substantial Efficacy Before Commercial Drug Sales", "10 = Support Sound Safety Reviews While Avoiding Excessive Drug Pipeline Delays for Critical Medications", 2, 7, 6, 1, 7, 1);

add(1962, "1962_jfk_rice_university_moon_speech", "JFK's Rice University Moon Speech ('We Choose to Go to the Moon')", "News", "1961-1969 (Apollo Program Moonshot)", "Technology & Infrastructure", 1,
  "Committing the nation to land an American on the moon and return him safely before this decade is out, requiring $20B in outlays.",
  "1 = Mobilize the Nation's Scientific Genius to Achieve the Greatest Technological Triumph in Human History", "10 = Excessive Federal Vanity Outlays That Distort the Economy When Domestic Priorities and Defense Need Resources", 2, 8, 7, 2, 8, 1);

add(1962, "1962_communications_satellite_act_comsat", "Communications Satellite Act of 1962 & Creation of COMSAT", "News", "1962 (Early Satellite Commercialization)", "Technology & Infrastructure", 2,
  "Creating a public-private corporation to operate commercial communications satellites following Telstar 1's broadcast success.",
  "1 = Private Shareholder Model Under Strict Public Utility Regulation to Accelerate Commercial Satellite Telephony", "10 = Pure Commercial Private Enterprise / Oppose Government-Chartered Monopoly Favored by Technocrats", 3, 7, 8, 2, 7, 1);

add(1962, "1962_revenue_act_of_1962_investment_credit", "Revenue Act of 1962 & 7% Investment Tax Credit for Equipment", "News", "1962-1969 (Investment Tax Credit Arc)", "Economy & Taxation", 2,
  "Enacting a 7% federal tax credit for business equipment and machinery investments to spur modernization and combat the recession.",
  "1 = Spur Corporate Investment in Modern Factories to Boost Productivity and Create American Jobs", "10 = Support Tax Credits but Demand Deep Across-the-Board Income Tax Rate Cuts Across All Brackets", 3, 8, 9, 2, 8, 1);

add(1962, "1962_berlin_crisis_checkpoint_charlie_tank", "Berlin Wall Aftermath & Soviet-American Tank Standoff at Checkpoint Charlie", "News", "1961-1963 (Berlin Wall Crisis)", "Foreign Policy & Defense", 2,
  "Confronting the division of Berlin by Soviet and East German concrete barriers and barbed wire; maintaining allied access by force.",
  "1 = Defend West Berlin as an Outpost of Freedom While Avoiding Direct Nuclear Clashes with Moscow", "10 = Stand Firm on Absolute Sovereign Access Rights to East Berlin / Confront Soviet Violations with Power", 3, 9, 4, 1, 9, 1);

add(1962, "1962_area_redevelopment_act_implementation", "Area Redevelopment Administration Industrial Loans in Appalachia", "News", "1961-1965 (ARA Program Implementation)", "Labor & Welfare", 3,
  "Deploying low-interest federal loans and public works grants to chronic high-unemployment mining and rural textile counties.",
  "1 = Expand Federal Investments to Revitalize Dying Coal and Manufacturing Towns Squeezed by Automation", "10 = Terminate Program / Federal Earmarks and Inefficient Corporate Subsidies That Prop Up Unviable Businesses", 2, 8, 10, 1, 9, 1);

add(1962, "1962_south_vietnam_macv_advisers_surge", "Creation of MACV & Surging U.S. Military Advisers to 11,000 in Vietnam", "News", "1961-1964 (Pre-Tonkin Advisory Phase)", "Foreign Policy & Defense", 2,
  "Deploying Army Special Forces, helicopter companies, and 11,000 military advisers to support President Ngo Dinh Diem against Viet Cong.",
  "1 = Provide Defensive Advisory Support While Pressuring Diem to Enact Land Reform and Stop Buddhist Persecution", "10 = Decisive Anti-Communist Support to Halt the Spread of Soviet and Chinese Expansion Across Southeast Asia", 3, 9, 2, 1, 8, 1);

add(1962, "1962_manpower_development_training_act", "Manpower Development and Training Act of 1962 (MDTA)", "News", "1962-1973 (Federal Job Training Arc)", "Labor & Welfare", 3,
  "Establishing federally funded vocational retraining programs for industrial workers displaced by modern factory automation.",
  "1 = Equip Displaced Workers with Advanced Technical Skills Needed to Thrive in the New Automated Economy", "10 = Rely on Private Apprenticeships / Federal Job Training Programs Are Costly and Ineffective at Real Placement", 2, 8, 9, 1, 8, 1);

add(1962, "1962_john_glenn_friendship_7_orbit", "John Glenn's Friendship 7 Orbital Flight & American Pride", "News", "1962 (First American in Orbit)", "Technology & Infrastructure", 3,
  "First American astronaut to orbit the Earth three times, restoring national self-confidence after Soviet cosmonaut triumphs.",
  "1 = Unifying National Triumph of Free Society's Science and Technological Courage", "10 = Celebrate American Patriotism and Heroic Individual Mastery Over the Hostile Frontier of Space", 2, 7, 5, 2, 7, 1);

add(1962, "1962_public_welfare_amendments_rehabilitative", "Public Welfare Amendments of 1962 (Rehabilitative Social Services)", "News", "1962 (Welfare Reform Push)", "Labor & Welfare", 3,
  "Providing 75% federal matching funds for state social services designed to help welfare recipients become self-supporting.",
  "1 = Invest in Social Services, Daycare, and Job Training to Break the Cycle of Generational Welfare Dependency", "10 = Welfare Has Become a Permanent Entitlement / Require Work Participation to Protect Taxpayers", 2, 8, 9, 1, 9, 1);

add(1962, "1962_sino_indian_border_war_us_aid", "Sino-Indian Border War & U.S. Emergency Military Airlift to India", "News", "1962 (Himalayan Conflict)", "Foreign Policy & Defense", 3,
  "Air-lifting weapons and cold-weather gear to Prime Minister Nehru's troops fighting Chinese PLA forces in the Himalayas.",
  "1 = Support Democratic India Against Chinese Expansionism / Drive Wedge Between Beijing and Moscow", "10 = Provide Robust Emergency Arms to Halt Communist Aggression on the Subcontinent", 3, 8, 5, 1, 7, 1);

add(1962, "1962_senior_citizen_housing_act", "Senior Citizens Housing Act of 1962 Direct Federal Loans", "News", "1962 (Elderly Housing Arc)", "Labor & Welfare", 4,
  "Expanding direct federal low-interest Section 202 loans to non-profit sponsors constructing affordable rental housing for the elderly.",
  "1 = Guarantee Decent, Safe, and Affordable Housing for Vulnerable Low-Income Senior Citizens", "10 = Support Private Homeownership and Charitable Housing / Limit Federal Mortgage Subsidies", 2, 8, 9, 1, 8, 1);

add(1962, "1962_federal_employee_collective_bargaining_eo10988", "Executive Order 10988 Granting Collective Bargaining to Federal Employees", "News", "1962 (Federal Union Recognition)", "Labor & Welfare", 3,
  "President Kennedy granting federal civil service employees the right to unionize and engage in collective bargaining without the right to strike.",
  "1 = Historic Victory Recognizing Basic Labor Rights for One-Third of the Nation's Public Workforce", "10 = Unwise Concession to Public Unions Creating Conflict of Interest and Inflating the Size of Government", 2, 9, 9, 1, 9, 1);

add(1962, "1962_foreign_assistance_act_alliance_for_progress", "Alliance for Progress $20 Billion Latin American Development Plan", "News", "1961-1969 (Alliance for Progress Era)", "Foreign Policy & Defense", 3,
  "Ten-year multi-billion-dollar foreign aid initiative promoting democracy, land redistribution, and economic growth in Latin America.",
  "1 = Transformative Democratic Alternative to Communist Revolution in the Western Hemisphere", "10 = Massive Foreign Welfare Waste Subsidizing Incompetent Governments That Fail to Enact Real Free-Market Reforms", 2, 8, 8, 1, 9, 1);

add(1962, "1962_atomic_energy_commission_atmospheric_tests", "Resumption of U.S. Atmospheric Nuclear Testing in the Pacific (Operation Dominic)", "News", "1962 (Atmospheric Testing Resumption)", "Foreign Policy & Defense", 3,
  "Detonating 31 nuclear atmospheric tests in Pacific proving grounds following the Soviet Union's unilateral breach of the test moratorium.",
  "1 = Nuclear Testing Spreads Deadly Radioactive Strontium-90 in Milk / Re-impose Moratorium Now", "10 = Essential Testing Required to Modernize Weapons and Safeguard American Deterrent Credibility", 3, 9, 4, 1, 9, 1);

add(1962, "1962_mass_transit_emergency_aid_act", "Housing Act Mass Transportation Demonstration Grants", "News", "1961-1964 (Federal Transit Genesis)", "Technology & Infrastructure", 4,
  "Providing early federal matching grants to pilot commuter rail and subway modernization in congested metropolitan centers.",
  "1 = Vital Federal Support for Clean, Efficient Urban Mass Transit to Relieve Choking Highway Congestion", "10 = Local Commuter Transit Must Be Funded Locally by Riders / Stop Forcing Rural Taxpayers to Subsidize Cities", 2, 8, 9, 1, 8, 1);

add(1962, "1962_farm_bill_mandatory_supply_controls_defeat", "Defeat of Mandatory Production Quotas for Feed Grains (1962 Farm Bill)", "News", "1962 (Supply Management Defeat)", "Agriculture & Food", 4,
  "House defeating Secretary Orville Freeman's plan for mandatory production quotas and penalties on all wheat and feed grain farmers.",
  "1 = Mandatory Supply Management Is Necessary to End Costly Taxpayer Surpluses and Guarantee Parity Income", "10 = Protect American Family Farmers from Authoritarian Federal Regimentation and Market Dictates", 2, 8, 10, 1, 8, 1);

add(1962, "1962_water_pollution_control_act_amendments", "Federal Water Pollution Control Enforcement Conference Authority", "News", "1961-1965 (Pre-Clean Water Act Arc)", "Energy & Climate", 4,
  "Expanding federal authority to convene enforcement conferences on interstate rivers and coastal waters to compel sewage treatment.",
  "1 = Strengthen Federal Authority to Force Industrial Polluters and Cities to Stop Dumping Raw Sewage into Rivers", "10 = Water Quality Is a Traditional State and Municipal Responsibility / Prevent Federal Preemption", 2, 8, 8, 1, 8, 1);

add(1962, "1962_equal_pay_act_initial_filibuster", "Equal Pay for Equal Work Legislation Blocked in House/Senate", "News", "1962-1963 (Equal Pay Enactment Arc)", "Civil Rights & Social Issues", 3,
  "Bipartisan legislation mandating equal pay for equal work regardless of sex, blocked late in the 87th Congress before 1963 passage.",
  "1 = End Blatant Wage Discrimination Against Working Women / Guarantee Equal Pay for Equal Work", "10 = Avoid Burdensome Federal Regulatory Lawsuits Micro-managing Business Payrolls and Job Classifications", 2, 8, 7, 1, 8, 1);

add(1962, "1962_point_reyes_national_seashore", "Establishment of Point Reyes National Seashore in California", "News", "1962 (Seashore Conservation Arc)", "Energy & Climate", 4,
  "Authorizing federal land acquisition of 53,000 acres of coastal wilderness and ranches north of San Francisco to protect it from suburban tract sprawl.",
  "1 = Protect Magnificent Coastal Wildlands for Future Generations from Irreversible Real Estate Destruction", "10 = Respect Historic Family Dairy Ranches / Prevent Heavy-Handed Federal Condemnation of Private Property", 2, 8, 8, 1, 8, 1);

add(1962, "1962_kennedy_consumer_bill_of_rights", "President Kennedy Special Message on Protecting the Consumer Interest", "News", "1962 (Consumer Rights Genesis)", "Economy & Taxation", 3,
  "Declaring four fundamental consumer rights: the right to safety, the right to be informed, the right to choose, and the right to be heard.",
  "1 = Empower Federal Agencies to Protect Everyday Consumers from Deceptive Packaging, Predatory Lending, and Hazardous Goods", "10 = Trust Free Market Consumer Sovereignty / Avoid Heavy-Handed Regulatory Paternalism", 2, 8, 9, 1, 8, 1);

add(1962, "1962_port_huron_statement_sds_new_left", "Students for a Democratic Society (SDS) Port Huron Statement", "News", "1962 (New Left Genesis)", "Civil Rights & Social Issues", 4,
  "Tom Hayden drafting manifesto calling for 'participatory democracy', nuclear disarmament, and student confrontation with the military-industrial complex.",
  "1 = Inspiring Democratic Vision for Authentic Human Freedom, Civil Rights, and Grassroots Participatory Democracy", "10 = Radical Leftist Manifesto Promoting Anti-American Grievance and Undermining Democratic Capitalism", 3, 9, 6, 1, 9, 1);

add(1962, "1962_trade_adjustment_assistance_program_start", "First Operational Funding for Trade Adjustment Assistance (TAA)", "News", "1962-1974 (Early TAA Implementation)", "Trade & Globalism", 4,
  "Authorizing federal wage subsidies, relocation allowances, and job retraining for domestic workers displaced by tariff reductions.",
  "1 = Essential Social Contract Moral Obligation Assisting Workers Injured by Trade Agreements Made for the National Good", "10 = Complex, Ineffective Bureaucratic Handout That Subsidizes Economic Stagnation Instead of Dynamic Mobility", 2, 8, 9, 1, 7, 1);

add(1962, "1962_fbi_counterintelligence_program_cointelpro", "Expansion of Secret FBI COINTELPRO Surveillance Against Dissident Groups", "News", "1956-1971 (COINTELPRO Surveillance Arc)", "Civil Rights & Social Issues", 4,
  "J. Edgar Hoover directing covert FBI operations to infiltrate, disrupt, and neutralize civil rights and left-wing political organizations.",
  "1 = Unlawful, Unconstitutional Secret Police Abuse Violating First and Fourth Amendment Rights of Citizens", "10 = Essential National Security Counterintelligence Guarding Against Hostile Communist Subversion and Infiltration", 2, 8, 1, 1, 4, 1);

add(1962, "1962_national_stockpile_surplus_hearings", "Senate Hearings on $8.7 Billion Strategic Metals Stockpile Surpluses", "News", "1962 (Symington Stockpile Probe)", "Economy & Taxation", 5,
  "Stuart Symington investigating billions in excess zinc, lead, and rubber stockpiled during Cold War contracts at taxpayer expense.",
  "1 = Sell Off Excessive Stockpiles to Cut the Deficit and Eliminate Windfall Profits for Mining Conglomerates", "10 = Maintain Generous Strategic Reserves to Guarantee American Industrial Self-Sufficiency in Global Conflict", 2, 7, 7, 1, 7, 1);

add(1962, "1962_educational_television_facilities_act", "Educational Television Facilities Act of 1962 (Matching Grants)", "News", "1962 (Public Television Precursor)", "Education", 5,
  "Appropriating $32 million in federal matching grants to construct non-commercial educational television broadcast stations.",
  "1 = Transformative Investment Bringing Quality Educational Programming into Living Rooms and Classrooms Nationwide", "10 = Keep Federal Government Out of Broadcasting / Avoid Creating a State-Funded Propaganda Platform", 2, 8, 8, 1, 8, 1);

add(1962, "1962_united_farm_workers_cesar_chavez_founding", "Cesar Chavez and Dolores Huerta Founding the National Farm Workers Association", "News", "1962 (Farmworker Labor Movement Genesis)", "Labor & Welfare", 4,
  "Organizing Mexican-American and Filipino migrant agricultural laborers in Delano, CA to demand fair wages and union rights.",
  "1 = Stand Resolutely with Exploited Migrant Farmworkers Fighting for Basic Human Dignity and Labor Rights", "10 = Protect American Agribusiness from Disruptive Agricultural Strikes That Threaten Food Supply Chains", 2, 8, 8, 1, 8, 1);

add(1962, "1962_all_channel_receiver_act_signed", "Enactment of the All-Channel Television Receiver Act", "News", "1962 (All-Channel Act Enactment)", "Technology & Infrastructure", 5,
  "Statute requiring all commercial television manufacturers to include UHF tuners on television sets shipped in interstate commerce.",
  "1 = Unlock Hundreds of New Television Frequencies for Educational and Independent Local Broadcasters", "10 = Undesirable Government Product Mandate That Adds $20 to the Retail Cost of Every New TV Set", 2, 7, 6, 1, 7, 1);

add(1962, "1962_gordon_cooper_mercury_flight_prep", "Preparation for 22-Orbit Faith 7 Mission & Project Gemini Announcement", "News", "1962-1963 (Mercury-Gemini Transition)", "Technology & Infrastructure", 5,
  "NASA announcing the two-man Gemini spacecraft program to master orbital rendezvous, docking, and spacewalks.",
  "1 = Rigorous Step-by-Step Aerospace Science Leading the Free World in the Great Adventure of Space", "10 = Fully Fund NASA Programs to Beat the Soviet Union to Dominance of Near-Earth Space", 2, 8, 6, 1, 8, 1);

add(1962, "1962_cuba_embargo_total_trade_proclamation", "Presidential Proclamation 3447 Imposing Total Trade Embargo on Cuba", "News", "1962 (Full Embargo Proclamation)", "Foreign Policy & Defense", 2,
  "President Kennedy placing a complete commercial embargo on all bilateral trade between the U.S. and Cuba.",
  "1 = Implement Multilateral Targeted Sanctions While Protecting Humanitarian Access for Cuban Civilians", "10 = Absolute Economic Blockade to Isolate and Topple the Soviet-Aligned Communist Outpost in Our Hemisphere", 3, 9, 5, 1, 9, 1);

add(1962, "1962_federal_pay_reform_act", "Federal Salary Reform Act of 1962 (Comparability with Private Sector)", "News", "1962 (Civil Service Pay Comparability)", "Governance & Judiciary", 5,
  "Establishing statutory principle that federal civil service salaries should be comparable to private enterprise wage rates for similar work.",
  "1 = Ensure the Federal Government Attracts the Best and Brightest Talent Through Fair, Competitive Compensation", "10 = Stop Automatic Inflation of Bureaucratic Pay Scales That Burden Taxpayers and Entrench Government Bloat", 2, 8, 8, 1, 8, 1);

add(1962, "1962_padre_island_national_seashore", "Establishment of Padre Island National Seashore in Texas", "News", "1962 (Barrier Island Conservation)", "Energy & Climate", 5,
  "Preserving the longest stretch of undeveloped barrier island beach in the world along the Texas Gulf Coast.",
  "1 = Protect Priceless Pristine Coastal Dunes and Sea Turtle Habitats from Commercial Resort Exploitation", "10 = Respect Texas Private Property Owners and Preserve State Authority Over Mineral and Grazing Leases", 2, 8, 8, 1, 8, 1);

add(1962, "1962_civil_rights_executive_order_housing_11063", "Executive Order 11063 Banning Racial Discrimination in Federal Housing", "News", "1962 (EO 11063 Issuance)", "Civil Rights & Social Issues", 3,
  "Kennedy finally issuing his promised executive order barring racial discrimination in newly built federally assisted housing.",
  "1 = Meaningful Victory Toward Ending Discriminatory Redlining, Though Coverage Should Expand to All Mortgages", "10 = Government Encroachment on Private Contract Freedom and Property Rights That Exceeds Statutory Authority", 2, 8, 4, 1, 10, 1);

add(1962, "1962_nuclear_submarine_polaris_patrols", "Deployment of Polaris Nuclear Submarine Fleet in Mediterranean", "News", "1960-1965 (Polaris Deterrence Milestone)", "Foreign Policy & Defense", 3,
  "Expanding invulnerable sea-based nuclear second-strike deterrent with 16 Polaris missiles per nuclear submarine.",
  "1 = Stabilizing Second-Strike Deterrent That Reduces Pressure for Hair-Trigger Ground-Based Nuclear Strikes", "10 = Unsurpassed American Naval Dominance Guaranteeing Total Nuclear Destruction of Any Aggressor", 3, 9, 5, 1, 9, 1);

add(1962, "1962_clean_air_interstate_sulfur_studies", "HEW Motor Vehicle Pollution and Industrial Sulfur Studies", "News", "1960-1963 (Early Air Pollution Science)", "Energy & Climate", 5,
  "Federal scientists documenting photochemical smog formation from auto tailpipes and sulfur emissions from power plants.",
  "1 = Prepare Binding Federal Tailpipe Emission Standards to Stop Choking Smog in American Cities", "10 = Support State and Industry Voluntary Research / Prevent Heavy-Handed Federal Automotive Regulations", 2, 8, 8, 1, 8, 1);

add(1962, "1962_algerian_independence_us_recognition", "Algerian Independence from France & U.S. Diplomatic Recognition", "News", "1962 (Algerian Decolonization)", "Foreign Policy & Defense", 5,
  "Recognizing newly independent socialist Algerian republic following brutal eight-year liberation war against France.",
  "1 = Champion Anti-Colonial Self-Determination and Forge Diplomatic Partnerships with Non-Aligned Nations", "10 = Stand Firmly with Traditional NATO Ally France and Guard Against Soviet Influence in North Africa", 3, 7, 4, 1, 8, 1);

add(1962, "1962_public_works_acceleration_act", "Public Works Acceleration Act of 1962 ($900M Emergency Grants)", "News", "1962 (Countercyclical Public Works)", "Economy & Taxation", 4,
  "Appropriating $900 million in federal matching grants to rapidly initiate local water, sewer, and hospital construction in depressed areas.",
  "1 = Target Timely, Targeted, and Temporary Infrastructure Grants to Put Unemployed Miners and Builders Back to Work", "10 = Wasteful Deficit-Financed Public Works Pork That Delivers Minimal Lasting Economic Growth", 2, 8, 10, 1, 9, 1);

add(1962, "1962_sugar_act_amendments_global_quota_allotment", "Sugar Act Amendments of 1962 Reallocating Cuban Quota to Domestic Growers", "News", "1962 (Domestic Sugar Expansion)", "Agriculture & Food", 5,
  "Expanding statutory marketing quotas for Florida and Louisiana cane growers and Midwestern sugar beet farmers.",
  "1 = Encourage Domestic Agricultural Production While Supporting Democratic Latin American Sugar Exporters", "10 = Protect American Family Sugar Farmers and Assure Plentiful Domestic Sweetener Supplies", 3, 8, 8, 1, 7, 1);

add(1962, "1962_defense_supply_agency_creation", "Consolidation of Military Logistics Under Defense Supply Agency (DSA)", "News", "1961-1963 (McNamara Logistics Reforms)", "Foreign Policy & Defense", 5,
  "Secretary McNamara unifying common military logistics, spare parts, and fuel purchasing across all four service branches.",
  "1 = Brilliant Business Management Eliminating Hundreds of Millions in Duplicative Military Waste", "10 = Beware Monolithic Civilian Centralization That Erodes Traditional Service Branch Combat Autonomy", 2, 7, 6, 1, 7, 1);

add(1962, "1962_pension_welfare_plans_disclosure_act", "Welfare and Pension Plans Disclosure Act (WPPDA) Amendments", "News", "1962 (Pension Fiduciary Precursor)", "Labor & Welfare", 5,
  "Granting the Secretary of Labor criminal investigatory and subpoena powers to prosecute embezzlement in private pension plans.",
  "1 = Protect Millions of Hardworking Americans' Retirement Assets from Fraudulent Corporate and Union Looting", "10 = Support Fiduciary Integrity While Protecting Private Plan Sponsors from Harassing Federal Audits", 2, 8, 8, 1, 8, 1);

add(1962, "1962_cuba_missile_crisis_un_confrontation", "Adlai Stevenson UN Security Council Photographic Presentation of Soviet Missiles", "News", "1962 (UN Ambassador Showdown)", "Foreign Policy & Defense", 2,
  "Ambassador Stevenson displaying U-2 aerial surveillance photos of ballistic missile sites, challenging Soviet ambassador Zorin.",
  "1 = Masterful Diplomatic Decency Rallying Worldwide Moral Condemnation Against Soviet Treachery", "10 = Indisputable Photographic Proof of Soviet Deception / Vindication of Resolute American Military Posture", 2, 8, 4, 1, 8, 1);

add(1962, "1962_dc_circuit_malapportionment_ruling", "Federal Courts Ordering Immediate Reapportionment in Alabama & Georgia", "News", "1962 (Post-Baker District Court Orders)", "Governance & Judiciary", 3,
  "Federal judges striking down county unit systems and gross urban-rural legislative inequities following Baker v. Carr.",
  "1 = Enforce Constitutional Equity to Dismantle Corrupt Rural Machine Monopolies Over State Governments", "10 = Judicial Usurpation Running Roughshod Over Historic County Representation in State Assemblies", 2, 9, 5, 1, 10, 1);

add(1962, "1962_national_fisheries_subsidies_expansion", "Fishing Fleet Improvement Act Subsidizing Commercial Trawlers", "News", "1960-1964 (Commercial Fishing Subsidies)", "Agriculture & Food", 6,
  "Federal grants covering up to 50% of the cost of constructing modern commercial fishing vessels to compete with foreign fleets.",
  "1 = Modernize Domestic Coastal Fleets and Protect Hardworking American Fishermen from Heavy Foreign Subsidies", "10 = Oppose Corporate Fishing Subsidies That Encourage Overcapitalization and Fleet Fleet Inefficiencies", 2, 7, 8, 1, 7, 1);

console.log('1960 & 1962 complete. Total:', ISSUES.length);
// =========================================================================
// 1964 (52 Issues)
// =========================================================================
add(1964, "1964_civil_rights_act_public_accommodations", "Civil Rights Act of 1964 (Title II Public Accommodations & Title VII Employment)", "News", "1963-1965 (Civil Rights Landmark)", "Civil Rights & Social Issues", 1,
  "Outlawing discrimination based on race, color, religion, sex, or national origin in hotels, restaurants, theaters, and employment.",
  "1 = Historic Moral Triumph Ending Legal Segregation / Equal Dignity and Opportunity for All", "10 = Unconstitutional Encroachment on Private Property Rights and State Commerce Jurisdiction", 2, 7, 4, 1, 10, 1);

add(1964, "1964_gulf_of_tonkin_resolution", "Gulf of Tonkin Resolution Granting Broad Presidential War Powers", "News", "1964-1971 (Tonkin War Powers Arc)", "Foreign Policy & Defense", 1,
  "Authorizing the President to take all necessary measures to repel armed attacks against U.S. forces and prevent further aggression in Vietnam.",
  "1 = Resist Giving the Executive an Open-Ended Blank Check for War in Southeast Asia", "10 = Decisive Bipartisan Support Standing Resolutely Behind the Commander-in-Chief Against Communist Attacks", 3, 9, 2, 1, 8, 1);

add(1964, "1964_economic_opportunity_act_war_on_poverty", "Economic Opportunity Act of 1964 & Launch of the 'War on Poverty'", "News", "1964-1970 (Great Society War on Poverty)", "Labor & Welfare", 1,
  "Creating the Office of Economic Opportunity (OEO) to fund Head Start, Job Corps, VISTA, and Community Action Programs.",
  "1 = Total National Commitment to Eradicate Poverty and Open Pathways of Opportunity for All Americans", "10 = Massive Expansion of Destructive Federal Welfare Bureaucracy Fostering Long-Term Dependency", 2, 9, 10, 1, 10, 1);

add(1964, "1964_goldwater_conservative_takeover_gop", "Barry Goldwater GOP Nomination & Rise of Modern Movement Conservatism", "News", "1964 (Modern Conservative Genesis)", "Governance & Judiciary", 1,
  "Grassroots conservative revolution capturing the Republican nomination on an unapologetic platform of shrinking government and aggressive anti-communism.",
  "1 = Reject Dangerous Extremism That Would Dismantle Social Security and Threaten Nuclear Catastrophe", "10 = 'A Choice, Not an Echo' / Uncompromising Defense of Liberty, the Constitution, and States' Rights", 2, 10, 8, 1, 10, 1);

add(1964, "1964_daisy_girl_nuclear_trigger_finger", "Lyndon Johnson 'Daisy' Television Ad & Nuclear Responsibility", "News", "1964 (Atomic Campaign Symbolism)", "Foreign Policy & Defense", 1,
  "Democratic attack ad featuring a young girl counting petals before an atomic explosion, framing Goldwater as reckless with nuclear weapons.",
  "1 = Essential Warning Highlighting the Paramount Need for Cool-Headed, Responsible Presidential Nuclear Control", "10 = Despicable, Fear-Mongering Partisan Smear Demeaning the Nuclear Preparedness of the United States", 2, 8, 4, 1, 8, 1);

add(1964, "1964_california_proposition_14_fair_housing", "California Proposition 14 (Voter Repeal of Rumford Fair Housing Act)", "News", "1964 (Fair Housing Referendum Battle)", "Civil Rights & Social Issues", 1,
  "Constitutional initiative approved by 65.4% of voters repealing state law barring racial discrimination in real estate sales and rentals.",
  "1 = Vote No / Defend Fair Housing to Stop Racist Discriminatory Ghettoization of Minority Citizens", "10 = Vote Yes / Protect the Sacred Right of Property Owners to Sell or Rent to Whomever They Choose", 2, 8, 5, 1, 10, 1);

add(1964, "1964_revenue_act_of_1964_kennedy_tax_cuts", "Revenue Act of 1964 (Slashing Top Individual Income Tax Rate from 91% to 70%)", "News", "1963-1965 (Kennedy-Johnson Tax Cut)", "Economy & Taxation", 1,
  "Landmark Keynesian tax cut slashing top individual rate to 70% and corporate rate to 48% to stimulate private demand.",
  "1 = Supply Keynesian Consumer Stimulus to Accelerate Economic Growth and Reduce Unemployment", "10 = Welcome Tax Relief / Proof That Lowering Marginal Rates Unleashes Dynamic Private Capital Growth", 2, 9, 10, 1, 9, 1);

add(1964, "1964_wilderness_act_enacted_nine_million_acres", "Enactment of the Landmark Wilderness Act of 1964 (9.1 Million Acres)", "News", "1964 (Wilderness Act Enacted)", "Energy & Climate", 1,
  "Signing historic law establishing the National Wilderness Preservation System to protect 9.1 million acres of federal wildlands forever.",
  "1 = Crowning Conservation Achievement Preserving Untrammeled Wilderness for All Future Generations", "10 = Excessive Federal Lock-up of Productive Natural Resources That Curtails Western Economic Prosperity", 2, 8, 9, 1, 9, 1);

add(1964, "1964_surgeon_general_smoking_lung_cancer_report", "Surgeon General Luther Terry Report Linking Smoking and Fatal Lung Cancer", "News", "1964-1970 (Tobacco Health Revolution)", "Healthcare", 1,
  "Groundbreaking federal scientific report concluding that cigarette smoking causes lung cancer, chronic bronchitis, and death.",
  "1 = Urgent Public Health Imperative / Mandate Warning Labels on Cigarette Packs and Ban Tobacco Ads", "10 = Support Objective Scientific Information While Respecting Free Consumer Choice and Commercial Rights", 2, 7, 7, 1, 7, 1);

add(1964, "1964_mfdp_atlantic_city_credential_challenge", "Mississippi Freedom Democratic Party (MFDP) Challenge at Atlantic City", "News", "1964 (Convention Civil Rights Showdown)", "Governance & Judiciary", 1,
  "Fannie Lou Hamer and civil rights delegates challenging the all-white, segregated official Mississippi Democratic delegation.",
  "1 = Seat the Heroic, Democratically Chosen MFDP Delegates and Disavow Racist Jim Crow Party Officials", "10 = Uphold Party Rules and Compromise / Preserve Democratic Party National Coalition Harmony", 3, 7, 3, 1, 9, 1);

add(1964, "1964_warren_commission_report_jfk_assassination", "Release of the Warren Commission Report on the Assassination of JFK", "News", "1964 (Warren Commission Findings)", "Governance & Judiciary", 1,
  "Official 888-page report concluding that Lee Harvey Oswald acted completely alone in assassinating President Kennedy in Dallas.",
  "1 = Accept Thorough, Bipartisan Findings by Distinguished Commission While Maintaining Vigorous Transparency", "10 = Serious Flaws and Suspicious Inconsistencies Demand Vigilant Scrutiny of Potential Foreign Conspiracies", 2, 7, 4, 1, 6, 1);

add(1964, "1964_food_stamp_act_of_1964", "Food Stamp Act of 1964 (Permanent Federal Nutrition Program)", "News", "1964-1977 (Food Stamp Expansion Arc)", "Labor & Welfare", 2,
  "Formalizing and expanding the pilot food stamp program into a permanent nationwide initiative to combat hunger among low-income families.",
  "1 = Moral Obligation Ensuring No Child or Senior Citizen Goes Hungry in the World's Wealthiest Nation", "10 = Growing Welfare Entitlement Prone to Waste, Fraud, and Dependency / Should Be Run by Local Charities", 2, 8, 10, 1, 9, 1);

add(1964, "1964_urban_mass_transportation_act", "Urban Mass Transportation Act of 1964 ($375M Federal Matching Capital)", "News", "1964-1974 (Federal Transit Capital Grants)", "Technology & Infrastructure", 2,
  "Providing $375 million in federal capital matching grants to help cities purchase and modernize struggling private bus and subway systems.",
  "1 = Essential Federal Investment Revitalizing Dying Public Transit to Prevent Choking Urban Gridlock", "10 = Unconstitutional Expansion of Federal Subsidies Bailing Out Mismanaged, Insolvent Municipal Transit Systems", 2, 8, 9, 1, 8, 1);

add(1964, "1964_voluntary_social_security_goldwater_proposal", "Goldwater Suggestion to Make Social Security Voluntary for Workers", "News", "1964 (Social Security Privatization Firestorm)", "Economy & Taxation", 2,
  "Controversial remarks by Barry Goldwater suggesting workers should have the freedom to opt out of the federal Social Security system.",
  "1 = Catastrophic Attack That Would Destroy the Bedrock Defined-Benefit Retirement Security of 20 Million Seniors", "10 = Introduce Principles of Personal Liberty and Investment Choice into Inefficient Government Monopolies", 2, 9, 10, 1, 9, 1);

add(1964, "1964_reynolds_v_sims_state_legislative_districts", "Supreme Court 'One Person, One Vote' State Ruling (Reynolds v. Sims)", "News", "1964 (Reynolds v. Sims Decision)", "Governance & Judiciary", 2,
  "Holding that both houses of bicameral state legislatures must be apportioned strictly by population, striking down county-based state senates.",
  "1 = Historic Democratic Breakthrough Striking Down Rotten Boroughs and Giving Equal Power to Suburban Voters", "10 = Unjustified Judicial Intrusion Destroying Federal Model of County Representation in Sovereign State Senates", 2, 9, 5, 1, 10, 1);

add(1964, "1964_land_and_water_conservation_fund_act", "Land and Water Conservation Fund Act (LWCF Offshore Revenue Sourcing)", "News", "1964-2020 (LWCF Funding Arc)", "Energy & Climate", 2,
  "Creating dedicated federal fund using offshore oil leasing revenues to purchase and protect national parks and state outdoor recreation lands.",
  "1 = Visionary Bipartisan Conservation Legacy Turning Fossil Fuel Revenues into Permanent Public Parks and Trails", "10 = Ensure Land Purchases Do Not Erode Local County Property Tax Bases or Infringe on Private Property", 2, 8, 8, 1, 8, 1);

add(1964, "1964_escalation_in_vietnam_secret_op_34a", "Operation 34A Covert Commando Raids & DESOTO Radar Patrols in North Vietnam", "News", "1964 (Pre-Tonkin Covert Operations)", "Foreign Policy & Defense", 2,
  "Covert South Vietnamese commando raids on North Vietnamese coastal radar installations backed by U.S. Navy destroyers in the Tonkin Gulf.",
  "1 = Dangerous Escalation Provoking Hostile Retaliation Without Congressional Knowledge or Constitutional Approval", "10 = Necessary Military Pressure to Demonstrate American Resolve and Impose Real Costs on Hanoi's Aggression", 3, 9, 2, 1, 8, 1);

add(1964, "1964_equal_pay_act_implementation", "Implementation of the Equal Pay Act of 1963 by Department of Labor", "News", "1963-1965 (Equal Pay Implementation)", "Civil Rights & Social Issues", 2,
  "First federal civil rights law prohibiting employers from paying women less than men for equal work requiring equal skill and responsibility.",
  "1 = Enforce Stringent Equal Pay Restitution Across All Industries / Close Gender Wage Gaps", "10 = Protect Legitimate Seniority and Merit Pay Differentials from Heavy-Handed Bureaucratic Interference", 2, 8, 7, 1, 8, 1);

add(1964, "1964_nuclear_proliferation_chinese_atomic_bomb", "China's First Successful Nuclear Atomic Test (Project 596)", "News", "1964 (Chinese Nuclear Breakout)", "Foreign Policy & Defense", 2,
  "Mao Zedong's China detonating its first nuclear weapon at Lop Nur, fundamentally altering Asian geopolitical military balances.",
  "1 = Pursue Urgent Nonproliferation Diplomacy / Nuclear Umbrella Guarantees for India and Japan", "10 = Solidify American Nuclear Deterrence and Strategic Superiority Across the Pacific Rim Against Red China", 3, 9, 4, 1, 9, 1);

add(1964, "1964_civil_rights_title_vii_sex_amendment", "Inclusion of 'Sex' in Title VII of the Civil Rights Act (Smith Amendment)", "News", "1964 (Sex Discrimination Enactment)", "Civil Rights & Social Issues", 2,
  "Howard Smith's tactical amendment adding sex to employment discrimination protections, unexpectedly passing and transforming women's rights.",
  "1 = Historic Foundation for Women's Legal and Economic Equality in the American Workplace", "10 = Avoid Burdensome Federal Regulatory Interference in Reasonable State Protective Labor Laws for Women", 2, 8, 5, 1, 8, 1);

add(1964, "1964_community_action_programs_maximum_feasible", "'Maximum Feasible Participation' of the Poor in Anti-Poverty Grants", "News", "1964-1968 (Community Action Battles)", "Labor & Welfare", 3,
  "Direct federal anti-poverty grants bypassing city halls to fund neighborhood community organizations, angering big-city Democratic mayors.",
  "1 = Empower Impoverished Communities with Direct Democracy and Political Power Over Their Own Neighborhoods", "10 = Radicals Using Federal Taxpayer Grants to Attack Local Governments and Incite Social Division", 2, 8, 9, 1, 9, 1);

add(1964, "1964_mississippi_burning_civil_rights_murders", "Philadelphia, MS Murders of Civil Rights Workers (Chaney, Goodman, Schwerner)", "News", "1964 (Freedom Summer Murders)", "Civil Rights & Social Issues", 1,
  "Ku Klux Klan murder of three voter registration volunteers, sparking massive FBI search (MIBURN) and federal civil rights indictments.",
  "1 = Mobilize the Full Power of the Federal Government to Break the Violent KKK and Secure Voting Rights", "10 = Enforce Law and Order / Prosecute Violent Crimes While Guarding Against Federal Police State Overreach", 2, 8, 3, 1, 9, 1);

add(1964, "1964_bracero_program_termination", "Official Termination of the Mexican Bracero Guest Worker Program", "News", "1964 (Bracero Program End)", "Immigration & Border", 3,
  "Ending the 22-year-old agricultural contract labor agreement that brought millions of temporary Mexican farmworkers to U.S. fields.",
  "1 = End Exploitative Program Depressing Wages and Undermining American Farmworker Organizing", "10 = Disastrous Termination Depriving Western Farmers of Essential Labor and Fueling Unauthorized Migration", 2, 8, 8, 1, 7, 1);

add(1964, "1964_tva_nuclear_power_browns_ferry_proposal", "TVA Proposal for World's Largest Nuclear Power Plant at Browns Ferry", "News", "1964-1966 (Commercial Nuclear Scaling)", "Energy & Climate", 3,
  "Tennessee Valley Authority moving to construct multi-gigawatt nuclear boiling water reactors, proving atomic power cheaper than coal.",
  "1 = Celebrate Clean, Boundless Atomic Energy Lowering Regional Electricity Rates and Powering Modern Industry", "10 = Support Commercial Nuclear Power / Protect Private Utilities from Unfair Subsidized Public TVA Power", 3, 8, 8, 1, 8, 1);

add(1964, "1964_cuba_travel_ban_passport_validation", "State Department Restrictions on Citizen Travel to Cuba (Zemel v. Rusk)", "News", "1962-1965 (Travel Ban Jurisprudence)", "Foreign Policy & Defense", 4,
  "Challenging federal authority to invalidate passports and criminally prosecute American citizens traveling to Cuba.",
  "1 = Defend Fundamental Constitutional Right of Free Citizens to Travel Anywhere Without Executive Veto", "10 = Uphold Inherent Foreign Affairs Authority to Bar Travel to Hostile Enemy Dictatorships in Times of Crisis", 2, 8, 2, 1, 9, 1);

add(1964, "1964_school_desegregation_ten_years_post_brown", "Tenth Anniversary of Brown v. Board & Ongoing Southern 'Massive Resistance'", "News", "1954-1968 (Post-Brown Resistance)", "Civil Rights & Social Issues", 2,
  "Less than 2% of Black students attending integrated schools in the Deep South a decade after Brown v. Board of Education.",
  "1 = Use Title VI Funding Cutoffs and Armed Enforcement to Shatter Unlawful Southern Defiance of Desegregation", "10 = Support Neighborhood Schools and Local Control / Oppose Federal Mandates Forcing Unwanted Busing", 2, 8, 5, 1, 10, 1);

add(1964, "1964_baker_scandal_senate_ethics_probe", "Bobby Baker Senate Influence-Peddling and Kickback Investigation", "News", "1963-1965 (Senate Ethics Scandal)", "Governance & Judiciary", 3,
  "Senate probe into financial kickbacks, vending machine contracts, and party girls linked to LBJ's former Senate aide Bobby Baker.",
  "1 = Comprehensive Senate Ethics Code Overhaul and Transparent Financial Disclosures for Senior Staff", "10 = Expose Disgraceful Corrupt Machine Politics and Influence-Peddling Reaching the Highest Levels of Power", 2, 8, 6, 1, 8, 1);

add(1964, "1964_job_corps_residential_training_centers", "Creation of Job Corps Residential Centers for Disadvantaged Youth", "News", "1964-1970 (Job Corps Genesis)", "Labor & Welfare", 3,
  "Providing vocational education, room, board, and counseling to 40,000 disadvantaged high school dropouts in residential centers.",
  "1 = Give Forgotten, Impoverished Youths a Real Second Chance at Dignity, Trade Skills, and Good Careers", "10 = Costly, Unruly Camps Spending More Per Enrollee Than Harvard Tuition with Minimal Proven Return", 2, 8, 9, 1, 9, 1);

add(1964, "1964_nuclear_arms_control_nonproliferation_treaty_push", "U.S. Proposals for a Global Nuclear Nonproliferation Treaty (NPT)", "Ideological", "1964-1968 (NPT Treaty Negotiations)", "Foreign Policy & Defense", 3,
  "Drafting international treaty to bar nuclear weapon states from transferring atomic arms and stop non-nuclear states from acquiring them.",
  "1 = Imperative Global Agreement to Stop the Catastrophic Spread of Nuclear Weapons Across 20+ Nations", "10 = Ensure Treaty Does Not Weaken NATO Nuclear Sharing Alliances or Cripple Peaceful Civilian Atomic Power", 3, 8, 4, 1, 8, 1);

add(1964, "1964_federal_cigarette_labeling_advertising_act", "FTC Proposed Rule Mandating Health Warnings on All Cigarette Packs", "News", "1964-1965 (Cigarette Labeling Battle)", "Healthcare", 3,
  "FTC moving to require warnings on cigarette packages stating smoking is dangerous to health and causes death from cancer.",
  "1 = Enforce Mandatory Plain Warnings and Restrict Youth-Targeted Tobacco Advertising on Television and Radio", "10 = Oppose Heavy-Handed Regulatory Mandates on a Lawful Agricultural Product / Protect Tobacco Economy", 2, 8, 7, 1, 8, 1);

add(1964, "1964_berkeley_free_speech_movement", "Free Speech Movement at University of California, Berkeley", "News", "1964-1965 (Campus Protest Era Genesis)", "Civil Rights & Social Issues", 3,
  "Thousands of university students staging sit-ins and rallies led by Mario Savio to overturn bans on on-campus political advocacy.",
  "1 = Defend the Inalienable First Amendment Right of Students to Advocate for Civil Rights on Public Campuses", "10 = Restore Discipline, Law, and Order / Put an End to Lawless Radical Mob Encampments Disrupting Learning", 2, 9, 3, 1, 9, 1);

add(1964, "1964_interstate_highway_urban_freeway_revolts", "Urban Freeway Revolts Halting Interstates in San Francisco & DC", "News", "1964-1975 (Freeway Revolt Arc)", "Technology & Infrastructure", 3,
  "Citizen coalitions and city councils blocking proposed multilane freeways tearing through historic urban neighborhoods and parks.",
  "1 = Stop Bulldozing Vibrant Communities for Concrete Freeways / Divert Highway Trust Funds to Mass Transit", "10 = Complete Connected Interstate Corridors to Keep Freight Moving and Modernize Metropolitan Transportation", 2, 8, 8, 1, 8, 1);

add(1964, "1964_silver_coinage_depletion_crisis", "Runaway Treasury Silver Depletion & Transition to Clad Coinage", "News", "1963-1965 (Coinage Act Arc)", "Economy & Taxation", 4,
  "Rising global silver prices driving dimes and quarters out of circulation, forcing the Treasury to propose removing silver.",
  "1 = Transition to Cupronickel Clad Coinage to Ensure Abundant Everyday Money for Commerce and Vending", "10 = Warning Sign of Fiat Monetary Debasement / Preserve Constitutional Sound Money and Silver Mining", 3, 7, 7, 1, 9, 1);

add(1964, "1964_panama_canal_martyrs_day_riots", "Martyrs' Day Riots in Panama Canal Zone & Severing Diplomatic Ties", "News", "1964 (Canal Zone Crisis)", "Foreign Policy & Defense", 3,
  "Riots erupting after American high schoolers raise U.S. flag without Panamanian flag, leaving 21 Panamanians and 4 GIs dead.",
  "1 = Renegotiate Canal Treaties on Terms of Sovereign Equality, Friendship, and Shared Security", "10 = Maintain Ironclad American Sovereign Ownership and Defense of the Panama Canal Zone Forever", 3, 9, 4, 1, 10, 1);

add(1964, "1964_social_security_across_board_increase", "Bipartisan Push to Raise Social Security Benefits by 5% to 7%", "News", "1964-1965 (Social Security Expansion)", "Labor & Welfare", 3,
  "Increasing monthly cash benefit checks for 20 million elderly Americans to keep pace with living costs.",
  "1 = Increase Social Security Monthly Checks and Ensure Dignified Retirement for Low-Income Elderly", "10 = Provide Sound Inflation Adjustments While Ensuring Payroll Tax Increases Do Not Squeeze Workers", 2, 8, 8, 1, 8, 1);

add(1964, "1964_appalachian_regional_development_act_push", "Appalachian Regional Development Act ($1 Billion Highway Package)", "News", "1964-1965 (ARDA Highway Arc)", "Technology & Infrastructure", 3,
  "Authorizing a dedicated federal-state regional commission to construct 2,350 miles of developmental corridor highways.",
  "1 = Break the Geographic Isolation of Impoverished Mountain Communities and Open Appalachia to Modern Commerce", "10 = Local Regional Earmark Creating Unfair Geographic Preferences at the Expense of Other Needy States", 2, 8, 9, 1, 8, 1);

add(1964, "1964_foreign_aid_authorization_reductions", "Otto Passman's Congressional Slashes to Foreign Aid Appropriations", "News", "1963-1966 (Foreign Aid Retrenchment)", "Foreign Policy & Defense", 4,
  "House Subcommittee Chairman cutting over $1 billion from presidential foreign assistance requests for developing regimes.",
  "1 = Fully Resource Foreign Economic Assistance to Defeat the Seeds of Communist Revolution and Misery", "10 = Drastically Slash Wasteful Foreign Handouts and Demand Stringent Auditing of Foreign Corruption", 3, 8, 9, 1, 10, 1);

add(1964, "1964_housing_act_of_1964_low_income_rehab", "Housing Act of 1964 & Section 312 Low-Income Rehabilitation Loans", "News", "1964 (Rehab Housing Shift)", "Labor & Welfare", 4,
  "Pioneering direct 3% federal loans to help low-income homeowners repair aging properties rather than bulldozing whole blocks.",
  "1 = Preserve Historic Neighborhood Fabrics and Empower Working-Class Homeowners to Upgrade Their Homes", "10 = Protect Sound Private Lending Standards / Limit Federal Government Subsidized Residential Financing", 2, 8, 8, 1, 8, 1);

add(1964, "1964_voter_registration_literacy_tests_challenge", "Civil Rights Injunctions Challenging Discretionary Southern Literacy Tests", "News", "1963-1965 (Pre-VRA Literacy Test Litigation)", "Civil Rights & Social Issues", 2,
  "DOJ lawsuits targeting discriminatory interpretation of state constitutions and literacy exams designed to block Black citizens.",
  "1 = Abolish All Discriminatory Literacy Tests and Enforce Universal Voting Rights with Federal Penalties", "10 = Uphold the Right of States to Establish Reasonable, Nondiscriminatory Educational Standards for Voters", 2, 8, 3, 1, 10, 1);

add(1964, "1964_water_resources_planning_act_push", "National Water Resources Planning Council & River Basin Commissions", "News", "1964-1965 (Water Resources Planning)", "Energy & Climate", 4,
  "Establishing a unified federal Cabinet council to coordinate national water supply, flood control, and hydroelectric planning.",
  "1 = Comprehensive Coordinated National Water Conservation to Prevent Devastating Western Drought Crises", "10 = Protect Western State Water Rights from Federal Bureaucratic Centralization and Dictates", 2, 8, 8, 1, 8, 1);

add(1964, "1964_arms_control_disarmament_agency_acda", "Arms Control and Disarmament Agency (ACDA) Research Authorizations", "News", "1961-1968 (ACDA Early Funding)", "Foreign Policy & Defense", 4,
  "Appropriating federal research grants for seismic nuclear test detection and computer models of strategic disarmament.",
  "1 = Essential Scientific Brain Trust Developing the Practical Verification Mechanisms for World Peace", "10 = Ensure ACDA Research Does Not Undermine Military Preparedness or Promote Dangerous Unilateral Disarmament", 2, 8, 5, 1, 8, 1);

add(1964, "1964_fcc_pacific_northwest_fairness_complaint", "FCC Fairness Doctrine Enforcement on Right-Wing Anti-Civil Rights Radio", "News", "1964 (Right-Wing Radio Battles)", "Technology & Infrastructure", 4,
  "Democratic National Committee filing complaints demanding free airtime on 200 radio stations broadcasting conservative broadcasts.",
  "1 = Enforce Fairness Doctrine to Ensure Millions of Citizens Hear Factual Rebuttals to Right-Wing Hate Broadcasts", "10 = Weaponized Bureaucratic Harassment Using the FCC to Intimidate Independent Conservative Radio Stations", 2, 8, 3, 1, 8, 1);

add(1964, "1964_sugar_act_import_fees_dispute", "Dispute Over Treasury Global Sugar Import Fees vs. Country Quotas", "News", "1962-1965 (Sugar Import Fee Wars)", "Trade & Globalism", 5,
  "Debating whether import fee receipts should be captured by the federal Treasury or retained as price premiums by foreign nations.",
  "1 = Capture Windfall Scarcity Premiums for the U.S. Treasury Rather Than Enriching Foreign Sugar Cartels", "10 = Maintain Traditional Country Quota Premiums to Promote Diplomatic Goodwill in Latin America", 3, 7, 7, 1, 7, 1);

add(1964, "1964_congo_crisis_stanleyville_hostage_rescue", "Operation Dragon Rouge: U.S. Air Force Drop of Belgian Paratroopers in Congo", "News", "1964 (Stanleyville Hostage Rescue)", "Foreign Policy & Defense", 3,
  "Deploying C-130 transports to drop Belgian commandos in Stanleyville, rescuing 1,600 Western hostages from Simba rebels.",
  "1 = Daring Humanitarian Mission Saving Hundreds of Innocent Lives from Brutal Execution by Insurgents", "10 = Commend Decisive Joint Anti-Communist Action Halting Chaos in the Strategic Mineral Heart of Africa", 3, 8, 5, 1, 8, 1);

add(1964, "1964_nurse_training_act_of_1964", "Nurse Training Act of 1964 (Federal Construction Grants and Student Loans)", "News", "1964 (Nurse Shortage Relief)", "Healthcare", 4,
  "Appropriating $287 million over five years to construct nursing schools and provide low-interest student loans to address shortages.",
  "1 = Vital Federal Support Overcoming Critical Hospital Nursing Shortages and Expanding Higher Education", "10 = Nursing Training Is a State and Private Hospital Responsibility / Avoid Federal Subsidies", 2, 8, 8, 1, 8, 1);

add(1964, "1964_clean_air_act_of_1963_implementation", "Clean Air Act of 1963 Federal Interstate Abatement Conferences", "News", "1963-1967 (Early CAA Enforcement)", "Energy & Climate", 4,
  "Department of Health, Education, and Welfare exercising its first legal authority to hold hearings on cross-border industrial smog.",
  "1 = Enforce Meaningful Federal Oversight to Stop Downwind Acid and Smog Transport Across State Lines", "10 = Support Cooperative Research While Preserving Primary State Autonomy Over Local Industrial Air Quality", 2, 8, 8, 1, 8, 1);

add(1964, "1964_federal_aviation_agency_supersonic_sst", "FAA National Supersonic Transport (SST) Development Subsidies", "News", "1963-1971 (SST Development Arc)", "Technology & Infrastructure", 4,
  "Federal 75% cost-sharing with Boeing and Lockheed to design a Mach-2.7 commercial airliner to compete with the Anglo-French Concorde.",
  "1 = Maintain American Global Commercial Aviation Leadership in the Next Frontier of Supersonic Travel", "10 = Unjustified Corporate Welfare Subsidizing Luxury Travel for Elites That Creates Deafening Sonic Booms", 3, 8, 7, 1, 7, 1);

add(1964, "1964_presidential_succession_twenty_fifth_amendment", "Congressional Hearings on Presidential Inability & Vice Presidential Vacancy", "News", "1964-1967 (25th Amendment Arc)", "Governance & Judiciary", 3,
  "Drafting constitutional amendment establishing clear procedures for filling a vice presidential vacancy and declaring presidential disability.",
  "1 = Essential Constitutional Safeguard Averting Catastrophic Succession Crises in a Nuclear World", "10 = Bipartisan Constitutional Reform Clarifying Lines of Succession Without Diminishing Executive Authority", 2, 7, 5, 1, 7, 1);

add(1964, "1964_internal_revenue_service_foundation_audit", "Wright Patman Congressional Investigation into Tax-Exempt Private Foundations", "News", "1962-1969 (Tax-Exempt Foundation Scrutiny)", "Economy & Taxation", 4,
  "Investigating private family foundations serving as tax-free holding companies and accumulating billions in untaxed wealth.",
  "1 = Crack Down on Billionaire Tax Shelters and Enact Mandatory Payout and Public Benefit Requirements", "10 = Protect Charitable Freedom and Philanthropic Giving from Heavy-Handed Congressional Scrutiny", 2, 8, 8, 1, 8, 1);

add(1964, "1964_commercial_satellite_first_olympics_telecast", "Syncom 3 Satellite Live Television Broadcast of the Tokyo Olympics", "News", "1964 (Global Satellite Television Genesis)", "Technology & Infrastructure", 4,
  "First live transpacific television broadcast via geostationary satellite, thrilling millions of American viewers.",
  "1 = Triumph of Free World Communications Technology Unifying Global Audiences in Peaceful Cultural Exchange", "10 = Proof That American Technological Preeminence Transcends Boundaries and Wins Hearts Around the Globe", 2, 7, 6, 1, 7, 1);

add(1964, "1964_equal_employment_opportunity_commission_eeoc", "Establishment of the Equal Employment Opportunity Commission (EEOC)", "News", "1964-1972 (EEOC Inception)", "Labor & Welfare", 3,
  "Creating the bipartisan federal agency to investigate complaints of job discrimination under Title VII of the Civil Rights Act.",
  "1 = Equip the EEOC with Real Investigatory Power to Break Down Racial and Gender Barriers to Good Careers", "10 = Guard Against Overzealous Agency Meddling in Legitimate Employer Hiring Decisions and Job Qualifications", 2, 8, 6, 1, 9, 1);


// =========================================================================
// 1966 (50 Issues)
// =========================================================================
add(1966, "1966_vietnam_war_troop_escalation_400k", "Escalation to 385,000 U.S. Combat Troops in Vietnam & Rolling Thunder", "News", "1965-1968 (Vietnam Escalation Peak)", "Foreign Policy & Defense", 1,
  "Massive military buildup in South Vietnam, heavy casualty counts, and continuous aerial bombardment of North Vietnam.",
  "1 = Halt Bombing / Seek Immediate Negotiated Settlement and Phased Troop Withdrawal", "10 = Pursue Decisive Military Victory / Remove Political Restrictions on Military Bombing Targets", 3, 9, 2, 1, 8, 1);

add(1966, "1966_urban_race_riots_backlash", "Urban Racial Unrest (Watts, Chicago, Cleveland) & Law and Order Resurgence", "News", "1965-1968 (Urban Unrest Arc)", "Civil Rights & Social Issues", 1,
  "Violent riots, arson, and National Guard deployments in northern and western inner-city Black ghettos, sparking white backlash.",
  "1 = Address Root Causes: End Slum Conditions, Joblessness, Police Brutality, and Segregation", "10 = Restore Law and Order / Stop Tolerating Lawless Rioting, Looting, and Violent Street Anarchy", 2, 10, 4, 1, 10, 1);

add(1966, "1966_voting_rights_act_implementation", "Voting Rights Act of 1965 Federal Examiner Deployment & Preclearance", "News", "1965-1975 (VRA Implementation)", "Civil Rights & Social Issues", 1,
  "Deploying federal registrars to southern counties and enforcing Section 5 preclearance, registering over 400,000 Black voters.",
  "1 = Rigorously Enforce Voting Rights Act and Strike Down All Jim Crow Local Evasion Tactics", "10 = Support Constitutional Voting Rights While Guarding Against Unwarranted Federal Intrusions into States", 2, 8, 3, 1, 9, 1);

add(1966, "1966_medicare_medicaid_launch_july_one", "Official Launch of Medicare and Medicaid (July 1, 1966)", "News", "1965-1968 (Medicare Launch Phase)", "Healthcare", 1,
  "Enrolling 19 million elderly citizens in Medicare Part A and B and expanding state-federal Medicaid for low-income families.",
  "1 = Historic Social Achievement Guaranteeing Medical Care as a Basic Right for Seniors and the Poor", "10 = Impending Fiscal Disaster Fueling Medical Inflation and Escalating Federal Taxpayer Liabilities", 2, 9, 10, 1, 10, 1);

add(1966, "1966_civil_rights_act_1966_fair_housing_filibuster", "Civil Rights Act of 1966 Senate Filibuster on Fair Housing", "News", "1966 (Fair Housing Filibuster)", "Civil Rights & Social Issues", 1,
  "Bipartisan Senate filibuster led by Dirksen defeating federal legislation prohibiting racial discrimination in private housing sales.",
  "1 = Pass Fair Housing to End Segregated Neighborhoods and Allow Black Families to Buy Anywhere", "10 = Defend Private Property Rights and Freedom of Contract Against Unconstitutional Federal Dictates", 2, 9, 5, 1, 10, 1);

add(1966, "1966_black_power_movement_stokely_carmichael", "Emergence of 'Black Power' & SNCC Rejection of Nonviolence", "News", "1966-1972 (Black Power Arc)", "Civil Rights & Social Issues", 1,
  "Stokely Carmichael raising the cry of 'Black Power' on the Meredith March, breaking with traditional integrationist civil rights groups.",
  "1 = Affirm Self-Determination, Cultural Pride, and Radical Economic Justice for Black Americans", "10 = Condemn Reverse Racism, Anti-White Rhetoric, and Violent Rejection of Integration and the Rule of Law", 3, 9, 4, 1, 9, 1);

add(1966, "1966_miranda_v_arizona_police_warnings", "Supreme Court Ruling on Criminal Rights (Miranda v. Arizona)", "News", "1966 (Warren Court Criminal Jurisprudence)", "Civil Rights & Social Issues", 1,
  "Supreme Court holding 5-4 that police must inform suspects of the right to remain silent and right to an attorney before interrogation.",
  "1 = Essential Protection Against Coerced Confessions and Involuntary Self-Incrimination in Station Houses", "10 = Handcuffing the Police to Coddle Dangerous Criminals and Murderers / End Judicial Activism", 2, 10, 3, 1, 10, 1);

add(1966, "1966_ronald_reagan_california_governor_landslide", "Ronald Reagan's Landmark Election as California Governor", "News", "1966 (Reagan Political Ascent)", "Governance & Judiciary", 1,
  "Former actor winning landslide gubernatorial victory campaigning on 'cleaning up the mess at Berkeley' and restoring law and order.",
  "1 = Dangerous Right-Wing Reactionary Exploiting Cultural Resentment and Anti-Student Backlash", "10 = Brilliant Articulator of Common-Sense Conservatism, Free Enterprise, and Citizen Self-Reliance", 2, 10, 8, 1, 10, 1);

add(1966, "1966_national_traffic_motor_vehicle_safety_act", "National Traffic and Motor Vehicle Safety Act & Ralph Nader", "News", "1966 (Automotive Safety Mandates)", "Technology & Infrastructure", 1,
  "Enacting mandatory federal safety standards (seat belts, padded dashboards, shatterproof windshields) following Nader's book.",
  "1 = Enforce Stringent Federal Safety Standards on Detroit to Save Tens of Thousands of Motorist Lives", "10 = Support Sensible Safety Innovations While Protecting Carmakers from Crippling Regulatory Costs", 2, 7, 7, 1, 7, 1);

add(1966, "1966_inflation_creeping_federal_reserve_crunch", "Rising Inflation (3.5%) & Federal Reserve 1966 Credit Crunch", "News", "1966 (First Modern Credit Crunch)", "Economy & Taxation", 1,
  "Federal Reserve hiking discount rates to halt inflation from simultaneous 'Guns and Butter' spending on Vietnam and Great Society.",
  "1 = Enact Temporary Corporate Excess Profits Tax and Wage-Price Restraints Rather Than Crushing Housing", "10 = Cut Great Society Domestic Spending Immediately to Stop Inflation and Rebalance the Federal Budget", 2, 10, 10, 1, 10, 1);

add(1966, "1966_freedom_of_information_act_foia", "Enactment of the Freedom of Information Act (FOIA)", "News", "1966 (FOIA Enacted)", "Governance & Judiciary", 2,
  "Landmark law granting the public and journalists statutory rights to access executive agency government records.",
  "1 = Transformative Advance in Democratic Transparency Ensuring Government Is Truly Accountable to Citizens", "10 = Balance Public Transparency with Ironclad Exemptions for Military Secrets, Trade Secrets, and Law Enforcement", 2, 7, 1, 1, 5, 1);

add(1966, "1966_department_of_transportation_act", "Department of Transportation Act (Creating Cabinet-Level DOT)", "News", "1966 (DOT Creation)", "Technology & Infrastructure", 2,
  "Unifying federal highway, aviation, Coast Guard, and rail safety agencies into a single Cabinet department.",
  "1 = Rational Integration of National Transportation Policy to Build Modern Safe Infrastructure", "10 = Avoid Top-Down Centralized Bureaucracy That Stifles Private Innovation Across Independent Transport Modes", 2, 7, 8, 1, 7, 1);

add(1966, "1966_national_historic_preservation_act", "National Historic Preservation Act of 1966 (Section 106 Reviews)", "News", "1966 (Historic Preservation Arc)", "Energy & Climate", 2,
  "Establishing the National Register of Historic Places and requiring federal agencies to evaluate impacts on historic landmarks.",
  "1 = Protect Priceless American Architectural and Cultural Heritage from Reckless Federal Bulldozing", "10 = Ensure Preservation Reviews Do Not Become an Endless Bottleneck for Essential Modern Infrastructure", 2, 7, 8, 1, 7, 1);

add(1966, "1966_fulbright_senate_foreign_relations_hearings", "J. William Fulbright Senate Foreign Relations Vietnam Hearings", "News", "1966 (First Televised Anti-War Hearings)", "Foreign Policy & Defense", 2,
  "Televised congressional hearings questioning the military assumptions and strategic rationale of escalating the Vietnam War.",
  "1 = Courageous Senate Oversight Exposing the Tragic Flaws and Deceptions of an Unwinnable Quagmire", "10 = Irresponsible Dissent That Undermines Troop Morale in the Field and Gives Comfort to the Communist Enemy", 2, 8, 3, 1, 8, 1);

add(1966, "1966_demonstration_cities_model_cities_act", "Demonstration Cities and Metropolitan Development Act (Model Cities)", "News", "1966-1974 (Model Cities Program)", "Labor & Welfare", 2,
  "Targeting federal rehabilitation grants, social services, and coordinated planning to severely blighted urban neighborhoods.",
  "1 = Comprehensive Coordinated Plan to Restore Hope, Jobs, and Livable Neighborhoods to Ailing Cities", "10 = Expensive Social Engineering Scheme Siphoning Hundreds of Millions into Bureaucratic Waste", 2, 9, 9, 1, 9, 1);

add(1966, "1966_cuban_adjustment_act_enacted", "Cuban Adjustment Act of 1966 (Permanent Residency for Cuban Exiles)", "News", "1966-2017 (Cuban Adjustment Law)", "Immigration & Border", 2,
  "Allowing any Cuban native arriving in the U.S. after 1959 to apply for permanent residency green cards after one year.",
  "1 = Generous Humanitarian Refuge for Brave Victims Fleeing Communist Totalitarian Tyranny", "10 = Fair Asylum Protection While Ensuring Equal Immigration Standards Across All Developing Nations", 2, 8, 4, 1, 8, 1);

add(1966, "1966_minimum_wage_expanded_to_one_sixty", "Fair Labor Standards Amendments of 1966 (Raising Wage to $1.60/Hour)", "News", "1966 (FLSA Expansion)", "Labor & Welfare", 2,
  "Raising the minimum wage incrementally to $1.60 by 1968 and extending coverage to 8 million farm and service workers.",
  "1 = Ensure Every Working American Earns a Living Wage / Extend Protections to Excluded Farm and Hotel Workers", "10 = Mandated Wage Floors Disproportionately Cause Layoffs Among Minority Youths and Hurt Small Farms", 2, 8, 10, 1, 9, 1);

add(1966, "1966_military_draft_selective_service_inequities", "Selective Service System Draft Inequities & College Deferments", "News", "1965-1973 (Draft Resistance Arc)", "Foreign Policy & Defense", 2,
  "Growing public anger that 2-S college deferments shield middle-class students while working-class and Black youths are drafted.",
  "1 = Eliminate Unfair Class-Biased College Deferments / Move Toward an All-Volunteer Military", "10 = Maintain Selective Service System to Guarantee Necessary Manpower in Times of Superpower Conflict", 3, 8, 1, 1, 6, 1);

add(1966, "1966_national_endowment_for_arts_humanities", "First Full Funding Year for National Endowment for the Arts & Humanities", "News", "1965-1975 (NEA/NEH Genesis)", "Education", 3,
  "Appropriating federal grants to support symphony orchestras, museums, theatrical productions, and humanities scholarship.",
  "1 = Nurture the Cultural and Artistic Genius of the American Civilization as a Great Society Duty", "10 = Arts Should Be Supported by Voluntary Private Patronage, Not Taxpayer Dollars Picked by Bureaucrats", 2, 8, 10, 1, 9, 1);

add(1966, "1966_delano_grape_strike_senate_hearings", "Delano Grape Strike & Robert F. Kennedy Senate Migrant Hearings", "News", "1965-1970 (Delano Grape Boycott)", "Labor & Welfare", 2,
  "Senator RFK challenging Kern County sheriff over arresting peaceful striking farmworkers during UFW grape walkouts.",
  "1 = Full Constitutional Protection for Striking Farmworkers / Enact Federal Collective Bargaining Rights", "10 = Protect Law and Order / Stop Radical Labor Activists from Disrupting Agricultural Harvests", 2, 8, 7, 1, 8, 1);

add(1966, "1966_clean_rivers_restoration_act", "Clean Rivers Restoration Act of 1966 ($3.9B for Sewage Treatment)", "News", "1966 (Federal Sewage Infrastructure)", "Energy & Climate", 3,
  "Appropriating $3.9 billion over four years in federal matching grants to construct municipal wastewater treatment plants.",
  "1 = Major Federal Investment Required to Stop Cities from Poisoning America's Great Rivers and Lakes", "10 = Keep Sewage Treatment a Municipal Fiscal Duty / Avoid Excessive Federal Deficit Spending", 2, 8, 9, 1, 8, 1);

add(1966, "1966_south_africa_apartheid_un_sanctions", "U.S. Support for UN General Assembly Terminating South Africa's Mandate", "News", "1966 (Anti-Apartheid Diplomacy Arc)", "Foreign Policy & Defense", 3,
  "Voting with UN majority to revoke South Africa's League of Nations mandate over South West Africa (Namibia) due to apartheid.",
  "1 = Uncompromising Global Condemnation of Apartheid and Implementation of Coordinated Economic Sanctions", "10 = Oppose Apartheid While Preserving Diplomatic Ties and Strategic Anti-Communist Partnerships in Africa", 2, 8, 4, 1, 8, 1);

add(1966, "1966_sheppard_v_maxwell_trial_publicity", "Supreme Court Ruling on Pretrial Media Publicity (Sheppard v. Maxwell)", "News", "1966 (Fair Trial vs Free Press)", "Governance & Judiciary", 3,
  "Overturning murder conviction because carnival media atmosphere violated defendant's right to an impartial trial.",
  "1 = Protect Fundamental Due Process and Fair Trials Against Sensationalized Media Mob Justice", "10 = Safeguard First Amendment Freedom of the Press to Report Freely on Criminal Justice and Trials", 2, 7, 3, 1, 6, 1);

add(1966, "1966_gun_control_charles_whitman_tower_sniper", "University of Texas Tower Massacre & Federal Gun Control Inquiries", "News", "1966 (Texas Tower Mass Shooting)", "Civil Rights & Social Issues", 2,
  "Sniper Charles Whitman murdering 14 people from the Austin campus tower, igniting national calls to ban mail-order rifle sales.",
  "1 = Pass Federal Ban on Mail-Order Gun Sales and Mandatory Licensing for Firearms", "10 = The Second Amendment Protects Law-Abiding Citizens / Focus on Mental Illness, Not Gun Confiscation", 2, 9, 10, 1, 10, 2);

add(1966, "1966_elemental_education_title_one_evaluations", "Coleman Report on Equality of Educational Opportunity", "News", "1966 (Coleman Report Findings)", "Education", 3,
  "Landmark federal study concluding that family background and socioeconomic peer mix influence student learning far more than per-pupil spending.",
  "1 = Integrate Public Schools So Underprivileged Children Benefit from Diverse Socioeconomic Classrooms", "10 = Proof That Pouring Billions in Federal Dollars into Failing Public Schools Does Not Automatically Produce Results", 2, 8, 8, 1, 9, 1);

add(1966, "1966_indonesian_mass_killings_anti_communist", "Anti-Communist Mass Killings in Indonesia & U.S. Covert Support", "News", "1965-1966 (Indonesian Transition)", "Foreign Policy & Defense", 3,
  "General Suharto's military crushing the Indonesian Communist Party (PKI) with hundreds of thousands killed; U.S. embassy providing lists.",
  "1 = Investigate and Condemn Complicity in Mass Human Rights Atrocities and Massacres", "10 = Decisive Strategic Pivot Turning the World's Fifth Most Populous Nation Firmly Against Red Communism", 3, 9, 3, 1, 8, 1);

add(1966, "1966_child_nutrition_act_school_breakfast", "Child Nutrition Act of 1966 & Pilot School Breakfast Program", "News", "1966 (School Breakfast Genesis)", "Labor & Welfare", 3,
  "Expanding federal school lunch program to authorize pilot subsidized school breakfasts for needy children.",
  "1 = Ensure Hungry Children Start the School Day with Nutritious Food Necessary to Concentrate and Learn", "10 = Feeding Children Breakfast Is a Parental Responsibility / Avoid Ever-Expanding School Entitlements", 2, 8, 9, 1, 9, 1);

add(1966, "1966_tier_rate_suspension_tax_credit", "Suspension of the 7% Investment Tax Credit to Cool Down Inflation", "News", "1966-1967 (Tax Credit Suspension)", "Economy & Taxation", 3,
  "Congress voting to temporarily suspend the 7% investment tax credit to curb overheating business capital expenditures.",
  "1 = Prudent Fiscal Brake Slowing Excessive Corporate Capital Expansion and Cooling Down Inflation", "10 = Unpredictable Stop-and-Go Tax Policy That Disrupts Long-Term Business Planning and Investment", 3, 8, 9, 2, 8, 1);

add(1966, "1966_gordon_cooper_gemini_space_docking", "Project Gemini Spacewalks and First Orbital Docking Triumphs", "News", "1965-1966 (Gemini Operational Mastery)", "Technology & Infrastructure", 4,
  "Astronauts Neil Armstrong and David Scott performing the first space docking with an Agena target vehicle.",
  "1 = Breathtaking Technological Excellence Proving America Has Overtaken the Soviets in Manned Spaceflight", "10 = Fully Maintain Funding Momentum to Ensure Complete American Apollo Dominance on the Moon", 2, 7, 6, 1, 7, 1);

add(1966, "1966_tidelands_gulf_offshore_leasing_records", "Federal Offshore Oil Leasing Revenues Surpassing $1 Billion in the Gulf", "News", "1964-1970 (Gulf Offshore Oil Expansion)", "Energy & Climate", 4,
  "Major oil companies drilling in waters up to 300 feet deep in the Gulf of Mexico, generating record revenues for the federal Treasury.",
  "1 = Strictly Enforce Environmental and Oil Spill Safety Regulations on Offshore Platforms", "10 = Unleash Advanced Offshore Petroleum Technology to Supply America's Booming Industrial Energy Needs", 3, 8, 9, 1, 8, 1);

add(1966, "1966_cuba_freedom_flights_airlift", "U.S.-Cuba Agreement on Daily 'Freedom Flights' Airlift", "News", "1965-1973 (Freedom Flights Airlift)", "Immigration & Border", 3,
  "Coordinating twice-daily chartered aircraft flights transporting thousands of Cuban families directly from Varadero to Miami.",
  "1 = Generous Humanitarian Air-Bridge Rescuing 250,000 Oppressed People from Communist Slavery", "10 = Support Freedom Flights While Ensuring Fair Resettlement Across All 50 States to Avoid Florida Strain", 2, 8, 4, 1, 8, 1);

add(1966, "1966_national_sea_grant_college_program", "National Sea Grant College and Program Act of 1966", "News", "1966 (Sea Grant Act)", "Education", 4,
  "Creating a network of coastal universities dedicated to marine research, aquaculture, and oceanographic resource conservation.",
  "1 = Expand Oceanographic Science to Unlock the Sustainable Economic and Ecological Wealth of America's Coasts", "10 = Support Sound Coastal Research While Guarding Against Unnecessary Federal Bureaucratic Mission Creep", 2, 7, 7, 1, 7, 1);

add(1966, "1966_social_security_tax_rate_hike", "Social Security Payroll Tax Rate Increase to 4.2% on $6,600 Wage Base", "News", "1966 (Payroll Tax Adjustment)", "Labor & Welfare", 3,
  "Hiking payroll tax rates and raising the taxable wage base to finance the newly launched Medicare hospitalization program.",
  "1 = Fair, Progressive Social Insurance Contribution Ensuring World-Class Healthcare for Retired Seniors", "10 = Regressive Payroll Taxes Squeezing Working-Class Paychecks and Increasing Business Labor Costs", 2, 8, 9, 1, 9, 1);

add(1966, "1966_fbi_wiretapping_admissions_solicitor_general", "Solicitor General Thurgood Marshall Admitting FBI Eavesdropping in Supreme Court", "News", "1966 (FBI Bugging Admissions)", "Governance & Judiciary", 3,
  "DOJ notifying the Supreme Court that the FBI unlawfully used electronic eavesdropping bugs in prominent criminal prosecutions.",
  "1 = Enforce Strict Fourth Amendment Exclusionary Rule / Reject Tainted Evidence from Lawless Wiretaps", "10 = Modernize Law Enforcement Statutory Wiretapping Authorities to Combat Organized Crime and Racketeers", 2, 8, 2, 1, 6, 1);

add(1966, "1966_clean_air_interstate_abatement_delaware", "First Federal Clean Air Abatement Order on Delaware-Maryland Odors", "News", "1966 (First Clean Air Court Order)", "Energy & Climate", 4,
  "HEW taking industrial chicken processing plant to federal court to halt noxious cross-border airborne emissions.",
  "1 = Vindicate Federal Power to Protect Citizens from Industrial Polluters When State Regulators Fail", "10 = Encourage Local Dispute Resolution / Prevent Heavy-Handed Federal Intrusion Over Local Odors", 2, 8, 8, 1, 8, 1);

add(1966, "1966_universal_military_training_lottery_proposals", "Proposals to Replace Local Draft Boards with a National Random Lottery", "News", "1966-1969 (Draft Lottery Transition)", "Foreign Policy & Defense", 2,
  "Presidential commission evaluating a centralized national random draft lottery to eliminate racial and class inequities in induction.",
  "1 = A National Lottery Is Fairer, but the Ultimate Goal Must Be Ending the Draft for an All-Volunteer Force", "10 = Maintain Local Draft Board Knowledge and Community Discretion Rather Than Anonymous Computer Lotteries", 2, 8, 1, 1, 6, 1);

add(1966, "1966_appalachian_regional_commission_groundbreakings", "Groundbreakings on First 400 Miles of Appalachian Development Corridors", "News", "1965-1970 (Appalachian Corridors Construction)", "Technology & Infrastructure", 4,
  "Beginning highway blast excavations through mountain passes in Kentucky and West Virginia to connect isolated hollows.",
  "1 = Transforming Isolated Impoverished Regions into Thriving Commercial Corridors for New Industries", "10 = High-Cost Mountain Highway Construction Subsidized by Non-Appalachian Taxpayers", 2, 8, 9, 1, 8, 1);

add(1966, "1966_food_for_peace_india_famine_relief", "Public Law 480 Emergency Grain Shipments to Avert Indian Famine", "News", "1966 (Indian Famine Aid)", "Foreign Policy & Defense", 3,
  "Shipping millions of tons of surplus American wheat to India during catastrophic drought, conditioned on farm reforms.",
  "1 = Compassionate Superpower Food Aid Averting Mass Starvation for Tens of Millions of Human Beings", "10 = Condition Food Aid on Recipient Nations Modernizing Agriculture and Supporting Free World Initiatives", 2, 8, 7, 1, 8, 1);

add(1966, "1966_postal_chicago_logjam_breakdown", "Catastrophic Mail Logjam at Chicago Main Post Office (10M Stalled Letters)", "News", "1966 (Chicago Postal Meltdown)", "Governance & Judiciary", 4,
  "Ten million pieces of mail paralyzed for weeks in Chicago's massive sorting facility, demonstrating obsolescence of patronage postal system.",
  "1 = Immediate Federal Investment in Automated Optical Readers and Modern Working Conditions for Postal Staff", "10 = Proof That a Government Monopoly Incompetently Manages Critical Commercial Communications / Reform Postal System", 2, 8, 9, 1, 9, 1);

add(1966, "1966_guantanamo_desalination_plant_independence", "Naval Station Guantanamo Bay Completing Self-Sufficient Water Desalination", "News", "1964-1966 (Guantanamo Water Self-Sufficiency)", "Foreign Policy & Defense", 4,
  "U.S. Navy installing ocean desalination plants after Castro cut off the base's municipal freshwater supply.",
  "1 = American Engineering Ingesting Ocean Saltwater to Ensure Strategic Military Independence from Communist Dictators", "10 = Uphold Sovereign American Lease Rights and Uncompromising Defense of Our Strategic Caribbean Outpost", 3, 8, 6, 1, 9, 1);

add(1966, "1966_federal_water_pollution_control_administration", "Transfer of Water Pollution Agency from HEW to Interior Department", "News", "1966 (FWPCA Reorganization)", "Energy & Climate", 5,
  "Executive reorganization moving water pollution enforcement to Secretary Stewart Udall's Department of the Interior.",
  "1 = Unified Resource Conservation Strategy Elevating Clean Water Enforcement to Premier National Priority", "10 = Shuffling Bureaucratic Boxes / Guard Against Federal Overregulation of Municipal Stormwater Runoff", 2, 7, 8, 1, 8, 1);

add(1966, "1966_national_parks_centennial_redwoods_push", "Legislative Battles to Establish Redwood National Park in California", "News", "1965-1968 (Redwoods National Park Arc)", "Energy & Climate", 3,
  "Campaign to acquire thousands of acres of ancient old-growth coastal redwoods from private commercial logging companies.",
  "1 = Save the Magnificent Ancient Redwoods from Devastating Chainsaw Clearcuts Before They Are Gone Forever", "10 = Protect Historic Northern California Timber Industry Jobs and Fair Compensation for Private Timber Owners", 2, 8, 8, 1, 9, 1);

add(1966, "1966_supersonic_transport_sst_phase_two_awards", "FAA Awarding Supersonic Transport (SST) Airframe Contract to Boeing", "News", "1966-1967 (Boeing SST Selection)", "Technology & Infrastructure", 4,
  "Awarding prime design contract to Boeing's variable-sweep-wing Model 2707 supersonic jetliner over Lockheed.",
  "1 = Maintain American Commercial Jet Supremacy and Support Tens of Thousands of Aerospace Machinists", "10 = Terminate Government-Funded Prestige Transport That Wastes Billions and Emits Severe Upper-Atmospheric Emissions", 3, 8, 7, 1, 7, 1);

add(1966, "1966_veterans_readjustment_benefits_act_vietnam", "Veterans' Readjustment Benefits Act of 1966 (Cold War GI Bill)", "News", "1966 (Cold War/Vietnam GI Bill)", "Education", 2,
  "Enacting permanent educational tuition assistance and home loan guarantees for all service members serving during the Vietnam War.",
  "1 = Fulfill America's Sacred Debt to Every Young Man Serving Honorably in Southeast Asia and Cold War Outposts", "10 = Fully Support Returning Veterans with Meaningful Educational Opportunities and Homeownership Assistance", 2, 7, 6, 1, 7, 1);

add(1966, "1966_interstate_highway_beautification_act_lady_bird", "Highway Beautification Act Enforcement & Billboard Restrictions", "News", "1965-1968 (Lady Bird Act Enforcement)", "Energy & Climate", 4,
  "Enforcing federal penalties withholding 10% of highway funds from states failing to control commercial billboards and junkyards.",
  "1 = Restore the Natural Splendor and Scenic Beauty of America's Roadways from Ugly Billboard Clutter", "10 = Oppose Federal Coercion Penalizing Small Outdoor Advertising Businesses and Motel Owners", 2, 8, 8, 1, 9, 1);

add(1966, "1966_truth_in_packaging_act_fair_labeling", "Fair Packaging and Labeling Act of 1966 (Truth in Packaging)", "News", "1966 (Truth in Packaging Enacted)", "Economy & Taxation", 4,
  "Requiring all consumer packaged commodities to state net contents, manufacturer identity, and realistic serving sizes.",
  "1 = Protect Shoppers from Deceptive Slack-Filled Packaging and Hidden Price Increases on Grocery Shelves", "10 = Support Informative Labeling While Guarding Against Rigid Package Size Mandates That Stifle Competition", 2, 7, 7, 1, 7, 1);

add(1966, "1966_child_protection_act_of_1966_hazardous", "Child Protection Act of 1966 Banning Hazardous Toys and Chemicals", "News", "1966 (Hazardous Toys Ban)", "Healthcare", 4,
  "Empowering FDA to ban dangerous toys and household articles containing hazardous substances regardless of packaging.",
  "1 = Absolute Moral Duty of Government to Protect Innocent Children from Poisonous and Lethal Toys", "10 = Support Sensible Child Safety / Avoid Excessive Bureaucratic Banning of Ordinary Family Consumer Articles", 2, 7, 6, 1, 7, 1);

add(1966, "1966_nuclear_desalination_bolsa_island_project", "Bolsa Island Nuclear Power and Seawater Desalination Facility Proposal", "News", "1966-1968 (Early Nuclear Desalination Project)", "Energy & Climate", 5,
  "Federal-city plan to construct a man-made island off Huntington Beach, CA for dual nuclear electric and water desalination plants.",
  "1 = Pioneering Vision Combining Atom and Ocean to Solve Southern California's Endless Water Deficits", "10 = High Capital Cost Project / Ensure Rigorous Thermal Marine Pollution Reviews Before Siting Nuclear Reactors", 3, 7, 8, 1, 8, 1);

add(1966, "1966_fair_housing_chicago_mlk_open_housing_march", "Dr. Martin Luther King Jr. Chicago Freedom Movement & Marquette Park March", "News", "1966 (Chicago Open Housing Campaign)", "Civil Rights & Social Issues", 1,
  "Dr. King marching into all-white Chicago neighborhoods demanding open housing, facing violent brick-throwing white mobs.",
  "1 = Shatter Segregated Northern Ghettoization / Guarantee Non-Violent Civil Rights in Northern Suburbs", "10 = Uphold Neighborhood Cohesion and Property Owner Choice / Oppose Disruptive Confrontational Marches", 2, 8, 4, 1, 10, 1);

add(1966, "1966_subversive_activities_control_board_trials", "Subversive Activities Control Board (SACB) Rulings Struck Down by Courts", "News", "1965-1967 (McCarran Act Unconstitutionality)", "Civil Rights & Social Issues", 3,
  "Federal courts striking down McCarran Act provisions forcing Communist Party members to register with the federal government.",
  "1 = Uphold Fifth Amendment Privilege Against Self-Incrimination and First Amendment Freedom of Association", "10 = Reconstitute the SACB to Expose Subversive Foreign-Directed Traitors and Protect the Homeland", 2, 8, 2, 1, 8, 1);

console.log('Bracket A (1960-1966) total issues:', ISSUES.length);

module.exports = ISSUES;
