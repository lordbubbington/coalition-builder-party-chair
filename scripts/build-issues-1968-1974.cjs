/**
 * scripts/build-issues-1968-1974.cjs
 * Issues dataset for 1968, 1970, 1972, 1974 election cycles (Bracket B).
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
// 1968 (52 Issues)
// =========================================================================
add(1968, "1968_tet_offensive_vietnam_stalemate", "Tet Offensive & Public Realization of Vietnam War Stalemate", "News", "1968-1973 (Vietnam De-escalation Phase)", "Foreign Policy & Defense", 1,
  "Coordinated Viet Cong attacks across South Vietnam shattering administration claims of imminent victory, prompting LBJ not to seek re-election.",
  "1 = De-escalate Immediately / Halt Bombing / Negotiate American Military Exit", "10 = Prosecute the War to Decisive Victory / Lift All Restrictions on Military Commanders", 3, 9, 2, 1, 8, 1);

add(1968, "1968_mlk_assassination_holy_week_uprisings", "Assassination of Dr. Martin Luther King Jr. & Urban Uprisings", "News", "1968 (Holy Week Uprisings)", "Civil Rights & Social Issues", 1,
  "Murder of Dr. King in Memphis sparking riots and fires across 100 American cities with troops guarding the U.S. Capitol.",
  "1 = Redouble National Crusade Against Systemic Racism, Slums, and Economic Injustice", "10 = Restore Order by Any Means Necessary / Stop Excusing Criminal Arson and Violence", 2, 10, 4, 1, 10, 1);

add(1968, "1968_fair_housing_act_of_1968_passage", "Enactment of the Fair Housing Act of 1968 (Civil Rights Title VIII)", "News", "1968 (Fair Housing Enacted)", "Civil Rights & Social Issues", 1,
  "Banning racial and religious discrimination in the sale, rental, and financing of 80% of the nation's housing units.",
  "1 = Historic Moral Legislation Ending Residential Apartheid and Opening the Suburbs to All", "10 = Unconstitutional Federal Destruction of Private Property Rights and Contract Freedom", 2, 8, 4, 1, 10, 1);

add(1968, "1968_robert_f_kennedy_assassination", "Assassination of Robert F. Kennedy Following California Primary", "News", "1968 (RFK Assassination Trauma)", "Governance & Judiciary", 1,
  "RFK shot and killed at the Ambassador Hotel after winning the California primary, shattering progressive anti-war hopes.",
  "1 = Carry Forward Bobby Kennedy's Moral Coalition of Working-Class Whites, Blacks, and Latinos", "10 = Mourn the Tragic Slaying / Re-examine Secret Service Protection for All Candidates", 2, 7, 3, 1, 7, 1);

add(1968, "1968_chicago_democratic_convention_police_riot", "Chicago Democratic National Convention Clashes & Walker Report", "News", "1968 (Chicago Convention Clashes)", "Governance & Judiciary", 1,
  "Violent clashes in Grant Park between Chicago police under Mayor Daley and thousands of anti-war demonstrators, broadcast live.",
  "1 = Condemn the Brutal 'Police Riot' Trampling First Amendment Rights of Peaceful Protesters", "10 = Support Law Enforcement Heroes Defending the City Against Radical Communist Rioters", 3, 9, 3, 1, 9, 1);

add(1968, "1968_george_wallace_american_independent_party", "George Wallace's Third-Party Surge (American Independent Party)", "News", "1968 (Wallace Populist Surge)", "Governance & Judiciary", 1,
  "Former Alabama governor running an insurgent third-party campaign against forced school busing, liberal elites, and federal courts.",
  "1 = Reject Racist Demagoguery Attempting to Drag America Back into Jim Crow Division", "10 = Send Washington a Message / Support Wallace Fighting for Working Folks and States' Rights", 3, 7, 5, 1, 10, 1);

add(1968, "1968_nixon_silent_majority_secret_plan", "Richard Nixon's 'Silent Majority' & Honorable Peace in Vietnam", "News", "1968-1972 (Silent Majority Politics)", "Governance & Judiciary", 1,
  "Appealing to the non-shouting, law-abiding working-class middle Americans who pay their taxes and support the troops.",
  "1 = Divisive Rhetoric Exploiting Racial Anxieties and Prolonging an Immoral War", "10 = Stand Proudly with the Patriotic Forgotten Americans Who Form the Backbone of the Nation", 2, 10, 6, 1, 10, 1);

add(1968, "1968_gun_control_act_of_1968_enacted", "Enactment of the Gun Control Act of 1968 (Banning Mail-Order Firearms)", "News", "1968 (GCA 1968 Enactment)", "Civil Rights & Social Issues", 1,
  "Federal statute banning interstate mail-order gun sales, prohibiting felons from owning guns, and serializing all firearms post-RFK/MLK.",
  "1 = Essential Step to End Epidemic Gun Violence / Pass Universal National Gun Registration Next", "10 = Unconstitutional Second Amendment Infringement Punishing Millions of Law-Abiding Gun Owners", 2, 9, 10, 1, 10, 2);

add(1968, "1968_ten_percent_vietnam_income_tax_surcharge", "Revenue and Expenditure Control Act of 1968 (10% Income Surcharge)", "News", "1968-1970 (Vietnam Tax Surcharge)", "Economy & Taxation", 1,
  "Imposing a 10% temporary individual and corporate income tax surcharge paired with a mandatory $6B spending cut to curb inflation.",
  "1 = Responsible Fiscal Policy Paying for the War and Taming Deficits While Protecting Poverty Programs", "10 = Punitive Tax Hike Fueling Federal Profligacy / Cut Great Society Spending by $10B Instead", 3, 8, 10, 1, 9, 1);

add(1968, "1968_prague_spring_soviet_invasion_czecho", "Warsaw Pact Military Invasion of Czechoslovakia & Brezhnev Doctrine", "News", "1968 (Prague Spring Crushed)", "Foreign Policy & Defense", 1,
  "Half a million Soviet and Warsaw Pact troops crushing Alexander Dubček's 'socialism with a human face' in Prague.",
  "1 = Severe Western Condemnation / Halt Bilateral Talks Until Soviet Troops Withdraw from Prague", "10 = Proof That Communism Cannot Be Reformed / Strengthen NATO Forward Defenses Against Red Aggression", 3, 9, 4, 1, 9, 1);

add(1968, "1968_apollo_8_christmas_lunar_orbit", "Apollo 8 Manned Lunar Orbit & Christmas Eve Genesis Reading", "News", "1968 (Earthrise & Apollo 8)", "Technology & Infrastructure", 1,
  "First human beings to leave Earth orbit, circumnavigate the Moon, and photograph 'Earthrise', uniting a traumatized nation.",
  "1 = Inspiring Triumph of Human Spirit and Science Proving What Free People Can Accomplish in Unity", "10 = Historic American Technological Supremacy Beating the Soviet Union to the Lunar Frontier", 2, 7, 6, 2, 7, 1);

add(1968, "1968_redwood_national_park_established", "Establishment of Redwood National Park in Northern California", "News", "1968 (Redwoods Conservation Win)", "Energy & Climate", 2,
  "Signing landmark law acquiring 58,000 acres of ancient coastal redwood forest, compensating timber companies $61 million.",
  "1 = Eternal Victory Preserving the Tallest Living Trees on Earth from Destructive Commercial Logging", "10 = Balance Park Protection with Private Timber Jobs and Avoid Future Excessive Land Condemnations", 2, 8, 8, 1, 8, 1);

add(1968, "1968_wild_and_scenic_rivers_act", "Enactment of the Wild and Scenic Rivers Act of 1968", "News", "1968 (River Conservation Landmark)", "Energy & Climate", 2,
  "Protecting free-flowing rivers possessing outstanding scenic, recreational, or fish values from federal dams and channelization.",
  "1 = Preserve America's Greatest Wild Rivers Forever in Their Natural Free-Flowing Splendor", "10 = Ensure River Designations Do Not Paralyze Critical Regional Hydroelectric Power and Irrigation", 2, 8, 8, 1, 8, 1);

add(1968, "1968_nuclear_nonproliferation_treaty_signing", "Signing of the Treaty on the Non-Proliferation of Nuclear Weapons (NPT)", "News", "1968-1970 (NPT Ratification)", "Foreign Policy & Defense", 2,
  "Signing historic global accord to halt the spread of nuclear weapons technology and pursue good-faith atomic disarmament.",
  "1 = Monumental Step Toward Freeing Humanity from the Peril of Worldwide Nuclear Annihilation", "10 = Ensure Ironclad Verification to Prevent Hostile Rogue Regimes from Cheating While We Disarm", 2, 8, 4, 1, 8, 1);

add(1968, "1968_uss_pueblo_intelligence_capture", "North Korean Seizure of USS Pueblo & Capture of 82 Crewmen", "News", "1968 (Pueblo Hostage Crisis)", "Foreign Policy & Defense", 2,
  "North Korean patrol boats attacking and capturing U.S. Navy spy ship in international waters, imprisoning crew for 11 months.",
  "1 = Patient Diplomatic Negotiation to Secure the Safe Return of Our Brave Imprisoned Sailors", "10 = Humiliating American Weakness / A Superpower Must Retaliate With Overwhelming Military Force", 3, 9, 3, 1, 9, 1);

add(1968, "1968_national_trails_system_act", "Enactment of the National Trails System Act (Appalachian & Pacific Crest)", "News", "1968 (National Trails Act)", "Energy & Climate", 3,
  "Establishing nationwide network of scenic, recreational, and historic foot trails across thousands of miles of public wilderness.",
  "1 = Democratize Outdoor Recreation and Protect Iconic Footpaths for Everyday American Walkers", "10 = Protect Adjoining Private Landowners from Invasive Federal Rights-of-Way and Trespassing", 2, 7, 8, 1, 7, 1);

add(1968, "1968_uss_scorpion_nuclear_submarine_loss", "Tragic Loss of Nuclear Attack Submarine USS Scorpion (99 Dead)", "News", "1968 (Scorpion Submarine Loss)", "Foreign Policy & Defense", 3,
  "Mysterious deep-sea sinking of nuclear fast-attack submarine USS Scorpion in the Atlantic, prompting Navy safety overhauls.",
  "1 = Thorough Independent Technical Investigation into Acoustic Torpedo Safety and Deep Submergence", "10 = Honor Our Lost Submariners and Maintain Unrivaled Nuclear Attack Submarine Fleet Readiness", 2, 7, 5, 1, 7, 1);

add(1968, "1968_curtis_lemay_nuclear_weapons_rhetoric", "Curtis LeMay Vice Presidential Selection & 'Nuke 'Em' Controversy", "News", "1968 (Wallace-LeMay Nuclear Debacle)", "Foreign Policy & Defense", 2,
  "General Curtis LeMay joining Wallace ticket and immediately telling reporters nuclear weapons are just another weapon in the arsenal.",
  "1 = Disastrous Proof of the Irresponsible, Bloodthirsty Military Madness of the Far-Right", "10 = LeMay Is a Legendary War Hero Who Spoke Plain Truth on Total Force Needed for Victory", 3, 7, 4, 1, 10, 1);

add(1968, "1968_poor_peoples_campaign_resurrection_city", "Dr. King's Poor People's Campaign & Resurrection City on the Mall", "News", "1968 (Resurrection City Encampment)", "Labor & Welfare", 2,
  "Thousands of impoverished white, Black, Latino, and Native Americans camping in plywood shanties on the National Mall for an Economic Bill of Rights.",
  "1 = Guarantee Universal Jobs, Living Wages, and Decent Housing for Every Poor Person in America", "10 = Shut Down Unsanitary Squatter Encampments Disrupting the Nation's Capital and Reject Socialism", 2, 9, 5, 1, 10, 1);

add(1968, "1968_fortas_chief_justice_filibuster_resignation", "Bipartisan Filibuster Blocking Abe Fortas as Chief Justice & Resignation", "News", "1968-1969 (Fortas Judicial Scandal)", "Governance & Judiciary", 2,
  "Senate filibuster blocking LBJ crony Abe Fortas from succeeding Earl Warren following revelations of private corporate retainers.",
  "1 = Shameful Partisan Obstruction Denying the Supreme Court a Brilliant Dedicated Progressive Jurist", "10 = Uphold Strict Judicial Ethics / Defeat Unseemly Cronyism and End Warren Court Judicial Activism", 2, 9, 6, 1, 9, 1);

add(1968, "1968_wholesome_meat_poultry_act_inspection", "Enactment of the Wholesome Poultry Products Act of 1968", "News", "1967-1968 (Meat Inspection Modernization)", "Agriculture & Food", 3,
  "Mandating that state poultry inspection standards meet federal standards to prevent diseased, contaminated birds from reaching markets.",
  "1 = Protect American Families from Food Poisoning by Enforcing Rigorous Universal Meat Inspections", "10 = Respect State Agriculture Departments / Avoid Federal Preemption of Small Local Slaughterhouses", 2, 8, 7, 1, 8, 1);

add(1968, "1968_consumer_credit_protection_truth_in_lending", "Consumer Credit Protection Act (Truth in Lending Title I)", "News", "1968 (Truth in Lending Enactment)", "Economy & Taxation", 2,
  "Requiring lenders to disclose terms, loan costs, and the Annual Percentage Rate (APR) in a standardized, conspicuous format.",
  "1 = Empower Everyday Borrowers with Clear, Honest Financial Terms to Halt Deceptive Credit Gouging", "10 = Support Clear Disclosure While Guarding Against Complex Bureaucratic Lawsuits Over Minor Paperwork Errors", 2, 7, 6, 1, 7, 1);

add(1968, "1968_columbia_university_student_takeover", "Columbia University Student Protests & Gymnasium Takeover", "News", "1968 (Spring Campus Uprisings)", "Education", 2,
  "Students seizing five campus buildings and barricading administration offices to halt defense research and segregated gym construction.",
  "1 = Student Rebellion Against Racist Community Encroachment and Complicity in an Immoral Imperial War", "10 = Restore Order / Expel Disruptive Agitators Who Use Force and Coercion to Violate Academic Freedom", 2, 9, 4, 1, 10, 1);

add(1968, "1968_mexico_city_olympics_black_power_salute", "Tommie Smith & John Carlos Black Power Podium Salute in Mexico City", "News", "1968 (Olympic Human Rights Protest)", "Civil Rights & Social Issues", 2,
  "Olympic sprinters raising black-gloved fists with bowed heads during the national anthem to protest racial injustice in America.",
  "1 = Courageous, Dignified Stand for Universal Human Rights Heard Around the Globe", "10 = Disgraceful Disrespect of the American Flag and National Anthem on the World Stage / Suspend Athletes", 2, 9, 4, 1, 10, 1);

add(1968, "1968_my_lai_massacre_cover_up", "Cover-up of the My Lai Village Massacre by Charlie Company", "News", "1968-1970 (My Lai Revelations)", "Foreign Policy & Defense", 2,
  "Army officers suppressing reports of the mass slaughter of over 500 unarmed South Vietnamese civilians at Son My.",
  "1 = Uncover the Full Truth / Hold Every Officer and Perpetrator Accountable for Barbaric War Crimes", "10 = Support Our Troops Facing Unforgiving Guerrilla Warfare Where Civilians Concealed Enemy Killers", 2, 8, 3, 1, 8, 1);

add(1968, "1968_kerner_commission_report_two_societies", "Kerner Commission Report: 'Two Societies, One Black, One White'", "News", "1968 (Kerner Commission Shock)", "Civil Rights & Social Issues", 1,
  "Presidential commission concluding that white racism was the primary cause of urban riots, warning of separate and unequal societies.",
  "1 = Heed the Urgent Warning / Enact Massive Federal Investment in Housing, Jobs, and Integrated Schools", "10 = Reject Blanket Condemnations of White Society / Emphasize Personal Responsibility, Order, and Faith", 2, 9, 4, 1, 9, 1);

add(1968, "1968_boeing_747_jumbo_jet_rollout", "Rollout of the Boeing 747 'Jumbo Jet' in Everett, Washington", "News", "1968 (Wide-Body Aviation Genesis)", "Technology & Infrastructure", 3,
  "Unveiling the world's first wide-body twin-aisle airliner, revolutionizing mass long-distance commercial air travel.",
  "1 = Proud Monument to American Aerospace Engineering, Union Labor, and Global Democratic Travel", "10 = Celebrate Free Enterprise and Visionary Private Capital Rebuilding Global Transportation", 2, 7, 7, 2, 7, 1);

add(1968, "1968_housing_and_urban_development_act", "Housing and Urban Development Act of 1968 ($5.3B for 1.7M Homes)", "News", "1968 (Section 235 & 236 Subsidies)", "Labor & Welfare", 2,
  "Authorizing major interest subsidies (Section 235 homeownership and Section 236 rental) to build 1.7 million low-income homes.",
  "1 = Massive National Commitment Providing Subsidized Mortgages and Decent Homes for Working Families", "10 = Flawed Federal Mortgage Subsidy Program Prone to Shoddy Builder Corruption and Foreclosures", 2, 8, 9, 1, 9, 1);

add(1968, "1968_hong_kong_flu_pandemic", "1968 H3N2 'Hong Kong Flu' Pandemic (100,000 American Deaths)", "News", "1968-1969 (Hong Kong Flu Outbreak)", "Healthcare", 3,
  "Rapidly spreading influenza pandemic causing widespread hospitalizations and mortality without lockdowns or school closures.",
  "1 = Mobilize Public Health Laboratories, Rapid Vaccine Production, and Hospital Support", "10 = Maintain Resilient Everyday Economic and School Life Without Panicked Government Overreach", 2, 7, 6, 1, 7, 1);

add(1968, "1968_interstate_highway_interchange_billboard_removal", "First Federal Removal of Nonconforming Billboards Under Lady Bird Act", "News", "1968 (Billboard Removal Phase)", "Energy & Climate", 4,
  "Federal highway administrators withholding matching funds to compel states to tear down illegal commercial billboards.",
  "1 = Clean Up America's Glorious Scenic Vistas from Ugly, Distracting Commercial Billboards", "10 = Protect Small Highway Motel and Restaurant Owners Relying on Roadside Signs to Survive", 2, 8, 8, 1, 9, 1);

add(1968, "1968_fcc_fairness_doctrine_cigarette_ads_court", "DC Circuit Upholding Fairness Doctrine Anti-Smoking Counter-Ads", "News", "1968 (Banzhaf Anti-Smoking Ruling)", "Healthcare", 3,
  "Court upholding FCC ruling requiring television networks to broadcast free anti-smoking public service spots.",
  "1 = Landmark Victory for Public Health Allowing Science to Break the Monopoly of Deceptive Tobacco Ads", "10 = Dangerous Precedent Forcing Broadcasters to Air Uncompensated Counter-Speech on Commercial Products", 2, 8, 6, 1, 8, 1);

add(1968, "1968_indian_civil_rights_act_icra", "Enactment of the Indian Civil Rights Act of 1968 (ICRA)", "News", "1968 (ICRA Enactment)", "Civil Rights & Social Issues", 3,
  "Applying most guarantees of the Bill of Rights to tribal governments while preserving tribal courts.",
  "1 = Extend Fundamental Constitutional Protections and Freedom from Abuse to Native American Citizens", "10 = Respect Sovereign Indigenous Tribal Traditions Without Imposing Anglo-American Legal Uniformity", 2, 7, 3, 1, 8, 1);

add(1968, "1968_central_arizona_project_cap_enacted", "Colorado River Basin Project Act & Central Arizona Project (CAP)", "News", "1968 (CAP Enacted)", "Energy & Climate", 3,
  "Authorizing $1.3 billion for the 336-mile CAP aqueduct diverting Colorado River water to Phoenix and Tucson.",
  "1 = Engineering Miracle Guaranteeing Water Security and Economic Survival for the Booming Desert Southwest", "10 = Stop Over-Allocating the Colorado River / Enforce Realistic Conservation in Arid Desert States", 3, 7, 8, 1, 7, 1);

add(1968, "1968_nuclear_weapons_salt_preliminary_talks", "U.S.-Soviet Agreement to Open Strategic Arms Limitation Talks (SALT)", "News", "1968 (Pre-SALT Agreement)", "Foreign Policy & Defense", 2,
  "Johnson and Kosygin agreeing to open bilateral negotiations to cap ballistic missiles and anti-ballistic missile systems.",
  "1 = Essential Breakthrough Halting the Endless, Costly Escalation of Strategic Nuclear Missile Competition", "10 = Proceed with Extreme Skepticism / Never Negotiate Away American Technological Military Preeminence", 2, 8, 4, 1, 8, 1);

add(1968, "1968_alaska_prudhoe_bay_oil_discovery", "Atlantic Richfield & Humble Oil Discovery at Prudhoe Bay, Alaska", "News", "1968-1977 (Trans-Alaska Pipeline Genesis)", "Energy & Climate", 2,
  "Discovery of North America's largest oil field on Alaska's North Slope, sparking pipeline proposals across permafrost.",
  "1 = Safeguard Alaska's Fragile Arctic Tundra and Native Land Claims Before Permitting Oil Exploitation", "10 = Unleash Vast Domestic Oil Wealth to Secure American Energy Independence for Generations", 3, 9, 9, 1, 9, 1);

add(1968, "1968_wiretapping_title_iii_omnibus_crime_act", "Title III of the Omnibus Crime Control and Safe Streets Act of 1968", "News", "1968 (Title III Wiretap Authority)", "Governance & Judiciary", 2,
  "Establishing statutory framework for court-ordered wiretapping by federal and state law enforcement for designated crimes.",
  "1 = Require Strict Judicial Warrants and Probable Cause to Prevent Orwellian Police Surveillance States", "10 = Give Law Enforcement the Essential Modern Wiretapping Tools Needed to Break Organized Crime and Mobs", 2, 9, 1, 1, 7, 1);

add(1968, "1968_juvenile_delinquency_prevention_act", "Juvenile Delinquency Prevention and Control Act of 1968", "News", "1968 (Juvenile Justice Reform)", "Civil Rights & Social Issues", 4,
  "Providing federal grants to states to divert youth from the adult criminal justice system into community rehabilitation.",
  "1 = Rehabilitate Troubled Youths Through Community Support and Counseling Rather Than Hardening Incarceration", "10 = Hold Violent Juvenile Criminals Accountable to Protect Innocent Neighborhoods and Schools", 2, 8, 6, 1, 8, 1);

add(1968, "1968_radiation_control_health_safety_act", "Radiation Control for Health and Safety Act of 1968", "News", "1968 (Electronic Radiation Standards)", "Healthcare", 4,
  "Empowering the federal government to establish radiation emission standards for color televisions, microwave ovens, and X-ray tubes.",
  "1 = Protect American Consumers from Dangerous X-ray and Microwave Leakage in Everyday Household Electronics", "10 = Support Industry Voluntary Safety Testing Without Creating an Expensive New Federal Regulatory Apparatus", 2, 7, 6, 1, 7, 1);

add(1968, "1968_vietnam_operation_rolling_thunder_halt", "President Johnson's October 31 Complete Halt of Bombing over North Vietnam", "News", "1968 (October Bombing Halt)", "Foreign Policy & Defense", 1,
  "Announcing complete cessation of air bombardment of North Vietnam five days before the presidential election to spur Paris talks.",
  "1 = Courageous Step Toward Peace Bringing North Vietnam to the Negotiating Table in Paris", "10 = Cynical Political Ploy Sacrificing Military Leverage to Rescue Hubert Humphrey's Campaign", 2, 9, 3, 1, 8, 1);

add(1968, "1968_republican_southern_strategy_thurmond", "Strom Thurmond's Southern Strategy for Richard Nixon at Miami Convention", "News", "1968 (Southern Strategy Realignment)", "Governance & Judiciary", 2,
  "Nixon securing southern delegates with pledges to slow forced school busing and appoint strict constructionist judges.",
  "1 = Shameful Partisan Deal Selling Out Decades of Civil Rights Progress for Southern Electoral Votes", "10 = Restore Balance, Federalism, and Common Sense to a Nation Exhausted by Radical Social Engineering", 2, 10, 6, 1, 10, 1);

add(1968, "1968_national_flood_insurance_act_nfip", "Enactment of the National Flood Insurance Act of 1968 (NFIP)", "News", "1968 (NFIP Creation)", "Energy & Climate", 3,
  "Creating federal subsidized flood insurance for homeowners in designated flood plains tied to municipal building codes.",
  "1 = Provide Vital, Affordable Flood Protection for Families Uninsurable in the Private Market", "10 = Moral Hazard Subsidizing Risky Construction in Dangerous Coastal and Riverine Flood Zones", 2, 7, 8, 1, 8, 1);

add(1968, "1968_interstate_land_sales_full_disclosure_act", "Interstate Land Sales Full Disclosure Act of 1968", "News", "1968 (Land Fraud Consumer Protection)", "Economy & Taxation", 4,
  "Requiring land developers to register subdivisions and provide property reports before selling swamp or desert lots by mail.",
  "1 = Protect Elderly and Working-Class Consumers from Sham Real Estate Speculators and Swindlers", "10 = Support Basic Fraud Prevention While Avoiding Onerous Paperwork Filing Mandates on Land Developers", 2, 7, 7, 1, 7, 1);

add(1968, "1968_wholesome_fish_and_fisheries_hearings", "Senate Consumer Subcommittee Hearings on Contaminated Seafood", "News", "1968 (Fisheries Quality Standards)", "Agriculture & Food", 5,
  "Ralph Nader testifying on rotten fish and chemical pesticide runoff in commercial fish catches, pushing for USDA inspections.",
  "1 = Mandate Federal Continuous Inspection of Seafood Packing Plants Equal to Meat and Poultry", "10 = Seafood Is Highly Perishable / Flexible Industry Quality Controls Are Superior to Slow Bureaucracy", 2, 7, 6, 1, 7, 1);

add(1968, "1968_special_drawing_rights_imf_paper_gold", "Creation of Special Drawing Rights (SDRs) by the International Monetary Fund", "News", "1968-1971 (International Monetary Reform)", "Economy & Taxation", 3,
  "Establishing 'paper gold' supplementary reserve assets to ease global monetary pressure on the overstretched U.S. dollar.",
  "1 = Rational Multilateral Reform Modernizing Global Liquidity to Prevent Financial Panics and Deflation", "10 = Creation of Unbacked International Fiat Currency / Return to Discipline of the True Gold Standard", 3, 8, 9, 1, 9, 2);

add(1968, "1968_clean_air_california_waiver_retention", "Congress Preserving California's Right to Enact Tougher Tailpipe Standards", "News", "1967-1970 (California Clean Air Waiver)", "Energy & Climate", 3,
  "Federal statute maintaining California's unique authority to enforce auto emission standards stricter than federal rules.",
  "1 = Essential State Freedom Enabling California to Lead the World in Eradicating Dangerous Smog", "10 = Enforce Single Uniform Federal Standard to Prevent a Costly Patchwork of Conflicting Automotive Rules", 2, 8, 8, 1, 8, 1);

add(1968, "1968_bilingual_education_act_title_vii", "Enactment of the Bilingual Education Act (Title VII of ESEA)", "News", "1968 (Bilingual Education Genesis)", "Education", 3,
  "First federal legislation providing grant assistance to local schools to educate students with limited English-speaking ability.",
  "1 = Empower Immigrant and Spanish-Speaking Children with Educational Support to Succeed in America", "10 = Schools Must Focus Exclusively on Immersion in English as the Unifying Language of American Citizenship", 2, 8, 7, 1, 9, 1);

add(1968, "1968_vietnam_peace_talks_sabotage_chennault", "Anna Chennault & Nixon Campaign Secret Contacts with South Vietnam", "News", "1968 (Chennault Affair)", "Foreign Policy & Defense", 1,
  "Nixon backchannel urging South Vietnamese President Thieu to hold out and boycott Paris peace talks until after the election.",
  "1 = Shocking, Treasonous Interference Sabotaging Peace Negotiations to Win a Presidential Election", "10 = Partisan Wiretapping and Surveillance by Johnson Administration Spying on Political Opponents", 2, 9, 3, 1, 8, 1);

add(1968, "1968_fbi_king_tapes_smear_campaign", "J. Edgar Hoover's Covert FBI Campaign to Discredit Dr. Martin Luther King Jr.", "News", "1963-1968 (FBI Harassment of MLK)", "Civil Rights & Social Issues", 2,
  "Secret FBI wiretapping of hotel rooms and mailing anonymous suicide blackmail letters to Dr. King.",
  "1 = Outrageous, Racist Lawlessness by J. Edgar Hoover Demanding Immediate Dismissal and Congressional Reins", "10 = Counterintelligence Monitoring of Suspected Communist Advisors Surrounding Civil Rights Leaders", 2, 8, 1, 1, 3, 1);

add(1968, "1968_national_wildlife_refuge_system_administration", "National Wildlife Refuge System Administration Act", "News", "1966-1968 (Refuge Management)", "Energy & Climate", 4,
  "Consolidating fish and wildlife conservation areas into a unified national refuge system managed by Interior.",
  "1 = Safeguard Vital Habitat for Migratory Waterfowl and Endangered Species Across Public Refuges", "10 = Allow Balanced Multi-Use Recreational Fishing, Hunting, and Mineral Leases on Public Lands", 2, 8, 8, 1, 8, 1);

add(1968, "1968_postal_rates_airmail_six_cents", "Postal Revenue Act Increasing First-Class Stamps to 6 Cents", "News", "1968 (Postal Rate Adjustments)", "Governance & Judiciary", 5,
  "Congress raising domestic letter postage to 6 cents and airmail to 10 cents to offset rising postal clerk union wages.",
  "1 = Modest Necessary Contribution Supporting Modern Mail Services and Fair Living Wages for Postal Workers", "10 = Stop Continual Rate Hikes Masking Deep Inefficiencies and Archaic Sorting Practices in the Post Office", 2, 8, 8, 1, 8, 1);

add(1968, "1968_truth_in_lending_regulation_z", "Federal Reserve Promulgation of Regulation Z Disclosures", "News", "1968-1969 (Reg Z Rulemaking)", "Economy & Taxation", 4,
  "Federal Reserve establishing detailed standardized disclosure requirements for all consumer installment credit.",
  "1 = Protect Working Borrowers from Hidden Interest Rate Gouging, Add-On Fees, and Balloon Payments", "10 = Simplify Regulatory Burdens on Small Community Retailers and Automobile Dealers Offering Credit", 2, 7, 7, 1, 7, 1);


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
