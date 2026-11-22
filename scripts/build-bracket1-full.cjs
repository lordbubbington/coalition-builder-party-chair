/**
 * scripts/build-bracket1-full.cjs
 * Generates full issue array for Bracket 1 (2000, 2002, 2004, 2006)
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
// 2000 (52 Issues)
// =========================================================================
add(2000, "2000_budget_surplus_allocation", "Federal Budget Surplus Allocation", "News", "1998-2002 (Surplus Window)", "Economy & Taxation", 1,
  "Whether to dedicate the $236B surplus to a Social Security/Medicare 'lockbox' and debt retirement or provide large across-the-board tax cuts.",
  "1 = 100% Debt Paydown / Social Security Lockbox / Public Investment", "10 = 100% Across-the-board Tax Cuts to Shrink Government", 3, 9, 10, 2, 8, 1);

add(2000, "2000_social_security_privatization", "Social Security Private Investment Carve-Outs", "Ideological", "1980-2030 (Entitlement Reform Arc)", "Economy & Taxation", 1,
  "Allowing workers to divert 2 percentage points of their payroll taxes into private stock and bond investment accounts.",
  "1 = Maintain Defined-Benefit Government Trust Fund", "10 = Full Individual Market Carve-outs & Privatization", 2, 8, 10, 1, 9, 1);

add(2000, "2000_patients_bill_of_rights", "Patients' Bill of Rights & HMO Lawsuit Liability", "News", "1998-2002 (Managed Care Reform Arc)", "Healthcare", 2,
  "Granting patients statutory rights to sue managed-care HMOs in state courts for injury caused by denial of medical claims.",
  "1 = Universal Right to Sue HMOs / Single-Payer Healthcare", "10 = Shield Insurers / Federal Tort Immunity & Damage Caps", 3, 8, 9, 1, 8, 1);

add(2000, "2000_partial_birth_abortion_ban", "Partial-Birth Abortion Ban Act", "Ideological", "1973-2024 (Abortion Jurisprudence Arc)", "Civil Rights & Social Issues", 2,
  "Banning late-term intact dilation and extraction abortion procedures without a maternal health exception clause.",
  "1 = Full Reproductive Autonomy / Veto Ban Lacking Health Exception", "10 = Absolute Federal Ban / Constitutional Fetal Personhood", 3, 9, 5, 1, 10, 1);

add(2000, "2000_national_missile_defense", "National Missile Defense & ABM Treaty Withdrawal", "Ideological", "1983-2020 (Strategic Defense Arc)", "Foreign Policy & Defense", 2,
  "Deploying a national ballistic missile interceptor shield even if it necessitates abrogating the 1972 ABM Treaty with Russia.",
  "1 = Uphold Arms Control Treaties / Prohibit Space & Missile Shields", "10 = Unilateral ABM Withdrawal / Rapid Interceptor Deployment", 4, 9, 6, 1, 10, 1);

add(2000, "2000_china_pntr_wto", "China Permanent Normal Trade Relations (PNTR)", "News", "1999-2002 (Globalization Consensus Arc)", "Trade & Globalism", 2,
  "Granting China permanent normal trade relations status to facilitate its accession into the World Trade Organization.",
  "1 = Reject PNTR / Impose Strict Human Rights & Labor Conditionality", "10 = Unconditional Free Trade Accession & Market Integration", 6, 8, 9, 1, 2, 1);

add(2000, "2000_campaign_finance_mccain_feingold", "Soft Money Ban & Campaign Finance Reform", "Ideological", "1974-2010 (Pre-Citizens United Arc)", "Governance & Judiciary", 3,
  "Banning unregulated corporate, union, and individual soft-money donations to national political party committees.",
  "1 = Public Campaign Financing / Total Corporate Contribution Ban", "10 = Full Contribution Deregulation / Political Spending is Free Speech", 3, 8, 10, 1, 9, 1);

add(2000, "2000_gun_show_loophole_brady", "Gun Show Background Checks & Assault Weapons Ban Renewal", "Ideological", "1968-2026 (Gun Control Arc)", "Civil Rights & Social Issues", 3,
  "Closing the private sale 'gun show loophole' and renewing the 1994 federal prohibition on semiautomatic assault weapons.",
  "1 = Universal Background Registry / Ban Semiautomatic Firearms", "10 = Unrestricted Second Amendment / Repeal All Federal Gun Laws", 3, 8, 10, 2, 10, 2);

add(2000, "2000_school_vouchers_title_i", "Federal School Vouchers & Private School Choice", "Ideological", "1980-2026 (School Choice Arc)", "Education", 3,
  "Allowing federal Title I funds to follow students to private, parochial, or charter schools of their choice.",
  "1 = 100% Dedicated Public School Funding / Ban Vouchers", "10 = Universal Taxpayer-Funded Private School Vouchers", 3, 8, 10, 2, 10, 1);

add(2000, "2000_anwr_drilling", "Arctic National Wildlife Refuge (ANWR) Oil Drilling", "Ideological", "1980-2020 (Energy Exploration Arc)", "Energy & Climate", 3,
  "Authorizing oil and natural gas exploration and commercial leasing in the coastal plain of Alaska's ANWR.",
  "1 = Permanent Wilderness Protection / Zero Fossil Fuel Leasing", "10 = Immediate Full Oil & Gas Exploration Leasing", 3, 9, 9, 1, 9, 1);

add(2000, "2000_kyoto_protocol", "Kyoto Protocol International Climate Treaty", "News", "1997-2005 (Kyoto Framework Arc)", "Energy & Climate", 3,
  "Submitting the Kyoto greenhouse gas emissions reduction treaty to the Senate for formal ratification.",
  "1 = Immediate Ratification & Strict Binding Emission Caps", "10 = Total Rejection / Shield American Industry from Global Treaties", 3, 9, 9, 1, 10, 1);

add(2000, "2000_estate_tax_death_tax_repeal", "Federal Estate & Gift Tax ('Death Tax') Repeal", "Ideological", "1990-2026 (Wealth Taxation Arc)", "Economy & Taxation", 4,
  "Permanently abolishing the federal estate tax levied on asset transfers from deceased high-net-worth estates.",
  "1 = Highly Progressive Wealth & Inheritance Taxation", "10 = Complete and Permanent Abolition of Estate Tax", 3, 9, 10, 1, 10, 1);

add(2000, "2000_faith_based_initiatives", "Faith-Based Social Service Grants ('Charitable Choice')", "Ideological", "1996-2016 (Faith-Based Welfare Arc)", "Labor & Welfare", 4,
  "Allowing religious organizations to compete directly for federal social welfare grants while preserving religious hiring.",
  "1 = Strict Separation of Church and State / No Faith Grants", "10 = Broad Federal Funding of Religious Charities & Missions", 4, 9, 7, 2, 10, 1);

add(2000, "2000_marriage_penalty_tax_relief", "Marriage Tax Penalty Equalization", "News", "1998-2003 (Tax Code Modernization)", "Economy & Taxation", 4,
  "Doubling standard deduction and 15% bracket thresholds for married couples filing jointly to eliminate penalty.",
  "1 = Retain Existing Code / Focus Relief on Lower-Income Families", "10 = Complete Equalization / Pro-Family Tax Incentives", 5, 9, 8, 4, 10, 2);

add(2000, "2000_same_sex_marriage_bans_prop22", "State Constitutional Bans on Same-Sex Marriage (CA Prop 22)", "Ideological", "1996-2015 (Marriage Equality Arc)", "Civil Rights & Social Issues", 5,
  "Enacting state constitutional amendments defining marriage exclusively as a legal union between one man and one woman.",
  "1 = Complete Marriage Equality & Federal Civil Rights Protections", "10 = Constitutional Prohibition of Same-Sex Marriage & Civil Unions", 4, 9, 3, 1, 10, 1);

add(2000, "2000_medical_marijuana_legalization", "State Medical Cannabis Legalization Measures", "Ideological", "1996-2026 (Cannabis Reform Arc)", "Civil Rights & Social Issues", 5,
  "Authorizing state-licensed medical marijuana dispensaries for patients with physician recommendations.",
  "1 = Complete Federal Decriminalization & Legalization", "10 = Strict Federal Prohibition & Drug Enforcement Raids", 4, 8, 1, 1, 8, 1);

add(2000, "2000_elian_gonzalez_cuba_policy", "Elián González Custody Raid & Cuba Embargo", "News", "1999-2001 (Elián Crisis)", "Foreign Policy & Defense", 6,
  "Federal armed raid returning Cuban shipwreck boy Elián González to his father in Cuba versus political asylum.",
  "1 = Normalize Relations / Respect Parental Custody in Cuba", "10 = Grant Political Asylum / Enforce Strict Anti-Castro Embargo", 4, 9, 6, 2, 9, 1);

add(2000, "2000_california_electricity_crisis", "California Electricity Crisis & Wholesale Price Caps", "News", "2000-2002 (Power Deregulation Crisis)", "Energy & Climate", 6,
  "Imposing emergency federal price caps on wholesale electricity marketers to halt rolling blackouts and Enron gouging.",
  "1 = Emergency Federal Price Caps / Re-regulate Public Utilities", "10 = Pure Market Pricing / Resist Federal Price Controls", 3, 8, 10, 1, 8, 1);

add(2000, "2000_scalia_originalism_judicial_picks", "Supreme Court Judicial Appointments & Strict Constructionism", "Ideological", "1980-2026 (Federal Judiciary Arc)", "Governance & Judiciary", 7,
  "Pledging to appoint federal judges in the originalist mold of Antonin Scalia and Clarence Thomas.",
  "1 = Living Constitution / Protect Liberal Judicial Precedents", "10 = Strict Originalism & Textualism / Overturn Roe v. Wade", 2, 9, 7, 1, 10, 1);

add(2000, "2000_corporate_duopoly_nader", "Third-Party Ballot Access & Presidential Debate Inclusion", "Ideological", "1992-2026 (Electoral Reform Arc)", "Governance & Judiciary", 8,
  "Lowering the Commission on Presidential Debates 15% polling threshold to admit independent and third-party nominees.",
  "1 = Open Debates / Ranked Choice Voting / Easy Ballot Access", "10 = Protect Two-Party Stability / Enforce Strict Thresholds", 7, 8, 1, 1, 1, 1);

add(2000, "2000_anti_sweatshop_globalization", "Anti-Sweatshop Campaign & Trade Accord Labor Standards", "Ideological", "1995-2015 (Anti-Corporate Globalization)", "Trade & Globalism", 8,
  "Mandating enforceable labor rights and environmental protections in all international bilateral and multilateral trade pacts.",
  "1 = Mandatory Living Wage & Union Rights in All Trade Accords", "10 = Free Market Trade Without Social Clause Mandates", 4, 8, 9, 1, 6, 1);

add(2000, "2000_napster_copyright_dmca", "Digital Millennium Copyright Act Enforcement Against Napster", "News", "1998-2004 (Digital IP Wars)", "Technology & Infrastructure", 9,
  "Enforcing federal copyright infringement injunctions and statutory damages to shut down peer-to-peer MP3 file-sharing networks.",
  "1 = Open Internet / Broad Fair Use / Decriminalize File Sharing", "10 = Strict IP Enforcement & Digital Rights Management Mandates", 6, 7, 4, 2, 8, 1);

add(2000, "2000_electoral_college_legitimacy", "Abolition of the Electoral College via Amendment", "Ideological", "1800-2026 (Constitutional Electoral Arc)", "Governance & Judiciary", 10,
  "Replacing the Electoral College system with direct national popular election of the President after Bush v. Gore.",
  "1 = Direct National Popular Vote Constitutional Amendment", "10 = Preserve Electoral College Federalism & State Power", 2, 9, 6, 1, 10, 1);

add(2000, "2000_yucca_mountain_nuclear_waste", "Yucca Mountain Nuclear Waste Repository Designation", "Ideological", "1987-2015 (Nuclear Waste Arc)", "Energy & Climate", 5,
  "Designating Yucca Mountain, Nevada as the sole federal deep-geological repository for commercial spent fuel rods.",
  "1 = Respect Nevada State Sovereignty / Cancel Facility", "10 = Federal Preemption / Rapidly Open Nuclear Waste Site", 4, 8, 5, 1, 8, 1);

add(2000, "2000_death_penalty_moratorium", "Capital Punishment Moratorium & Post-Conviction DNA Testing", "Ideological", "1972-2026 (Capital Punishment Arc)", "Civil Rights & Social Issues", 6,
  "Imposing a federal moratorium on executions pending review of wrongful capital convictions and racial disparities.",
  "1 = Complete Abolition of Capital Punishment", "10 = Expedite Death Row Appeals & Retain Capital Punishment", 4, 9, 5, 1, 10, 1);

add(2000, "2000_fda_tobacco_regulation", "FDA Regulatory Jurisdiction Over Cigarettes & Tobacco", "News", "1996-2009 (Tobacco Wars)", "Healthcare", 7,
  "Granting the FDA explicit statutory authority to restrict cigarette marketing to minors and regulate nicotine content.",
  "1 = Comprehensive Federal Tobacco & Nicotine Marketing Controls", "10 = Prohibit FDA Regulation / Protect Commercial Speech", 3, 8, 10, 1, 8, 1);

add(2000, "2000_affirmative_action_higher_ed", "Race-Conscious Affirmative Action in College Admissions", "Ideological", "1978-2023 (Affirmative Action Arc)", "Civil Rights & Social Issues", 4,
  "Using race as an individualized factor in university admissions to achieve campus diversity and social mobility.",
  "1 = Defend & Expand Race-Conscious Remedial Admissions", "10 = Complete Ban on Race Consideration / Pure Colorblindness", 2, 9, 8, 1, 10, 1);

add(2000, "2000_welfare_work_requirements", "1996 Welfare Reform Reauthorization & Work Participation", "Ideological", "1996-2026 (Welfare Conditionality Arc)", "Labor & Welfare", 4,
  "Requiring TANF cash assistance recipients to engage in at least 30-40 hours per week of verified work activities.",
  "1 = Abolish Work Sanctions / Guarantee Universal Basic Income", "10 = Strict 40-Hour Work Rules / Cut Inactive Recipients", 5, 9, 9, 1, 10, 1);

add(2000, "2000_military_readiness_pay", "Pentagon Readiness Reinvestment & Military Pay Raise", "News", "1998-2004 (Readiness Rebound)", "Foreign Policy & Defense", 6,
  "Approving emergency defense appropriations to overhaul military equipment depots and boost troop pay and housing allowances.",
  "1 = Reallocate Military Spending to Healthcare & Schools", "10 = Major Defense Reinvestment & Weapons Modernization", 5, 9, 4, 1, 9, 1);

add(2000, "2000_firestone_tire_safety_recalls", "Criminal Penalties for Defective Auto Safety (TREAD Act)", "News", "2000-2002 (Rollover Safety Crisis)", "Technology & Infrastructure", 7,
  "Enacting federal criminal penalties for auto executives concealing fatal tire and rollover defects.",
  "1 = Severe Corporate Criminal Penalties & Mandatory Sensor Tech", "10 = Industry Self-Policing / Shield Corporate Executives", 3, 7, 9, 1, 8, 1);

add(2000, "2000_vieques_puerto_rico_bombing", "Cessation of U.S. Navy Live-Fire Drills on Vieques Island", "News", "1999-2003 (Vieques Civil Disobedience)", "Foreign Policy & Defense", 8,
  "Ceasing all live-fire artillery bombardments and naval training exercises on Puerto Rico's populated island of Vieques.",
  "1 = Immediate Military Withdrawal & Comprehensive Environmental Cleanup", "10 = Essential National Readiness / Continue Navy Exercises", 4, 8, 6, 1, 8, 1);

add(2000, "2000_section_245i_immigration", "Section 245(i) Adjustment of Undocumented Immigrant Status", "News", "1998-2002 (Pre-9/11 Border Reform Arc)", "Immigration & Border", 6,
  "Allowing undocumented workers sponsored by families or employers to pay a $1,000 fine and adjust status in the U.S.",
  "1 = Broad Legalization & Pathway to Citizenship", "10 = Strict Deportation / Enforce 10-Year Unlawful Presence Bars", 3, 8, 3, 1, 10, 1);

add(2000, "2000_columbine_mental_health_schools", "School Security Hardening vs. Gun Control Post-Columbine", "News", "1999-2004 (Post-Columbine Security)", "Education", 5,
  "Deploying armed School Resource Officers and metal detectors versus restricting firearm magazine capacities.",
  "1 = Ban Assault Weapons & High-Capacity Magazines / Fund Counselors", "10 = Hardened Security, Armed Guards & Zero Tolerance Discipline", 4, 8, 7, 2, 9, 1);

add(2000, "2000_federal_minimum_wage_hike", "Federal Minimum Wage Increase Above $5.15/Hour", "Ideological", "1938-2026 (Minimum Wage Arc)", "Labor & Welfare", 3,
  "Raising the federal minimum wage by $1.00 to $6.15 per hour over two years.",
  "1 = Raise to Living Wage ($10+/hr) / Index to Inflation", "10 = Freeze or Abolish the Federal Minimum Wage", 2, 8, 10, 1, 9, 1);

add(2000, "2000_impeachment_morality_backlash", "Presidential Ethics Standards & Executive Conduct Standards", "News", "1998-2001 (Post-Impeachment Backlash)", "Governance & Judiciary", 3,
  "Demanding a restoration of 'honor and dignity' in the White House following the Clinton impeachment trial.",
  "1 = Partisan Witch Hunt / Private Personal Conduct", "10 = Condemn Perjury / Demand Absolute Moral Standard in Office", 3, 9, 6, 4, 10, 2);

add(2000, "2000_microsoft_antitrust_breakup", "DOJ Antitrust Action & Structural Breakup of Microsoft", "News", "1998-2002 (Tech Monopoly Antitrust)", "Economy & Taxation", 5,
  "Court-ordered split of Microsoft into two distinct companies for operating systems and office software.",
  "1 = Enforce Aggressive Structural Breakup & Interoperability", "10 = Free Market Competition / End Government Antitrust Interference", 3, 8, 10, 1, 7, 1);

add(2000, "2000_cuba_embargo_agricultural_sales", "Agricultural & Medical Sanctions Carve-Outs for Cuba", "News", "1999-2003 (Sanctions Relief)", "Trade & Globalism", 7,
  "Allowing U.S. agricultural and pharmaceutical producers to sell goods to Cuba on a cash-only basis.",
  "1 = Lift the Cuban Embargo Completely and Unconditionally", "10 = Maintain Ironclad Embargo Until Castro Is Ousted", 4, 7, 2, 1, 8, 1);

add(2000, "2000_endangered_species_property_rights", "Endangered Species Act Compensation for Landowners", "Ideological", "1973-2026 (Property Rights / Conservation)", "Energy & Climate", 7,
  "Requiring federal cash compensation to private landowners when ESA habitat rules diminish property values.",
  "1 = Uncompromised Habitat Protection Over Private Development", "10 = Full Fifth Amendment Takings Compensation for Landowners", 3, 9, 10, 1, 10, 1);

add(2000, "2000_clean_air_particulate_soot_rules", "EPA Soot & Fine Particulate Ambient Air Standards", "Ideological", "1970-2026 (Clean Air Regulation Arc)", "Energy & Climate", 6,
  "Defending EPA's strict 1997 PM2.5 particulate and ozone standards in court against trucking and utility challenges.",
  "1 = Public Health Primacy / Enforce Stringent Pollution Reductions", "10 = Require Cost-Benefit Balancing / Prevent Industrial Burdens", 2, 8, 9, 1, 9, 1);

add(2000, "2000_hate_crimes_prevention_act", "Federal Hate Crimes Expansion for Sexual Orientation", "Ideological", "1998-2009 (Hate Crimes Legislation)", "Civil Rights & Social Issues", 4,
  "Expanding federal hate crime law to protect victims targeted for actual or perceived sexual orientation.",
  "1 = Comprehensive Federal Civil Rights & Hate Crime Protections", "10 = Reject 'Thought Crimes' / Rely Solely on State Violent Crime Laws", 2, 9, 6, 1, 10, 1);

add(2000, "2000_colombia_aid_plan_colombia", "Plan Colombia Military Counternarcotics Aid Package", "News", "2000-2008 (Andean Counternarcotics)", "Foreign Policy & Defense", 6,
  "Appropriating $1.3 billion in attack helicopters and military training to eradicate Colombian coca plantations.",
  "1 = Halt Foreign Drug War Militarization / Condition on Human Rights", "10 = Aggressive Military Interdiction & Aerial Herbicide Eradication", 5, 9, 6, 1, 8, 1);

add(2000, "2000_space_shuttle_iss_funding", "International Space Station Construction Outlays", "Ideological", "1993-2011 (ISS Construction Era)", "Technology & Infrastructure", 8,
  "Appropriating multibillion-dollar funding to sustain Space Shuttle assembly flights to the orbital station.",
  "1 = Redirect Manned Spaceflight Budget to Earth Science & Poverty", "10 = Fully Fund NASA Exploration & American Aerospace Leadership", 5, 8, 5, 3, 7, 2);

add(2000, "2000_water_infrastructure_everglades", "Comprehensive Everglades Ecosystem Restoration Plan", "Ideological", "2000-2026 (Ecological Restoration Arc)", "Energy & Climate", 6,
  "Authorizing an $8 billion 30-year state-federal plan to capture freshwater runoff and restore the Everglades wetlands.",
  "1 = Aggressive Federal Wetland Ecosystem Restoration", "10 = Protect Agricultural Sugar Producers / Limit Federal Land Acquisition", 3, 6, 7, 1, 7, 1);

add(2000, "2000_agricultural_emergency_bailouts", "Emergency Market Loss Assistance for Commodity Growers", "News", "1998-2002 (Depressed Commodity Crisis)", "Economy & Taxation", 7,
  "Providing $7.1 billion in direct taxpayer relief to grain and oilseed farmers suffering from record-low commodity prices.",
  "1 = Transition to Sustainable Farming Support / Cap Big Ag Subsidies", "10 = Full Disaster Relief for Commercial Grain & Cotton Growers", 5, 8, 9, 3, 6, 3);

add(2000, "2000_internet_sales_tax_moratorium", "Internet Tax Freedom Act & Online Sales Tax Moratorium", "News", "1998-2018 (E-Commerce Tax Moratorium)", "Technology & Infrastructure", 6,
  "Barring state and municipal governments from imposing sales taxes on out-of-state online commercial purchases.",
  "1 = Level Playing Field / Require Online Retailers to Collect State Sales Taxes", "10 = Permanent Ban on Internet Sales Taxes", 5, 9, 10, 4, 9, 2);

add(2000, "2000_nuclear_test_ban_ctbt", "Comprehensive Nuclear-Test-Ban Treaty (CTBT) Ratification", "Ideological", "1996-2026 (Nonproliferation Arc)", "Foreign Policy & Defense", 5,
  "Reconsidering Senate ratification of the global treaty banning all explosive nuclear weapons tests.",
  "1 = Ratify CTBT / Lead Global Nonproliferation", "10 = Retain Right to Test / Maintain U.S. Deterrent Reliability", 3, 9, 4, 1, 10, 1);

add(2000, "2000_drug_importation_canada", "Prescription Drug Reimportation From Licensed Canadian Pharmacies", "Ideological", "2000-2024 (Drug Pricing Arc)", "Healthcare", 4,
  "Legalizing wholesale importation of FDA-approved prescription medications from price-controlled Canadian pharmacies.",
  "1 = Authorize Reimportation / Impose Direct Federal Drug Price Caps", "10 = Bar Reimportation / Protect Drug Safety & Patent R&D Incentives", 3, 8, 4, 1, 7, 1);

add(2000, "2000_head_start_reauthorization", "Federal Head Start Early Childhood Education Expansion", "Ideological", "1965-2026 (Early Childhood Welfare)", "Education", 7,
  "Expanding federal appropriations for Head Start preschool programs versus converting funds into state block grants.",
  "1 = Universal Federal Pre-K & Full Head Start Funding", "10 = Convert to State Block Grants / Eliminate Federal Department of Education", 2, 8, 10, 1, 10, 1);

add(2000, "2000_labor_ergonomics_standards", "OSHA Workplace Ergonomics Repetitive Strain Rule", "News", "1999-2001 (OSHA Ergonomics Battle)", "Labor & Welfare", 7,
  "Promulgating binding federal workplace safety standards requiring employers to adjust equipment to prevent repetitive strain injuries.",
  "1 = Enforce Binding OSHA Ergonomics Rules for All Workers", "10 = Repeal Ergonomics Rule / Protect Employers from Compliance Mandates", 2, 9, 10, 1, 9, 1);

add(2000, "2000_cuba_wet_foot_dry_foot", "'Wet Foot, Dry Foot' Cuban Refugee Interdiction Policy", "Ideological", "1995-2017 (Cuban Adjustment Arc)", "Immigration & Border", 8,
  "Repatriating Cubans intercepted at sea while granting green cards to those reaching dry land.",
  "1 = Equal Asylum Rules for All Nationalities / End Special Preference", "10 = Protect Anti-Communist Dissidents Reaching U.S. Soil", 4, 8, 5, 2, 8, 1);

add(2000, "2000_usda_organic_standards", "National USDA Organic Certification Standards & GMOs", "News", "1997-2002 (Organic Rulemaking)", "Agriculture & Food", 8,
  "Banning genetically modified organisms, irradiation, and sewage sludge from the USDA Organic label.",
  "1 = Strict Organic Purity / Mandatory GMO Disclosure", "10 = Flexible Agribusiness Definitions / Scientific Equivalence", 3, 7, 6, 1, 7, 1);

add(2000, "2000_defense_of_marriage_act_enforcement", "Defense of Marriage Act (DOMA) Federal Enforcement", "Ideological", "1996-2013 (DOMA Federal Arc)", "Civil Rights & Social Issues", 3,
  "Enforcing Section 3 of DOMA to bar federal recognition or spousal benefits for legally married gay couples.",
  "1 = Repeal DOMA / Grant Full Federal Equal Rights", "10 = Defend DOMA / Federal Statutory Ban on Same-Sex Marriage", 4, 9, 4, 1, 10, 1);

// =========================================================================
// 2002 (52 Issues)
// =========================================================================
add(2002, "2002_iraq_war_aumf", "Authorization for Use of Military Force Against Iraq (AUMF)", "News", "2002-2011 (Iraq War Arc)", "Foreign Policy & Defense", 1,
  "Authorizing the President to use armed forces against Iraq to enforce UN Security Council resolutions regarding WMDs.",
  "1 = Oppose Military Action / Pursue UN Weapons Inspections & Multilateral Diplomacy", "10 = Broad Executive Authority for Preemptive Military Regime Change", 5, 10, 2, 1, 8, 1);

add(2002, "2002_homeland_security_act_civil_service", "Department of Homeland Security (DHS) & Civil Service Rules", "News", "2001-2004 (Post-9/11 Reorganization)", "Governance & Judiciary", 1,
  "Consolidating 22 agencies into DHS while granting the President authority to waive union civil service rules for national security.",
  "1 = Protect Federal Union Bargaining & Whistleblower Protections", "10 = Full Presidential Exemption from Civil Service Rules for National Security", 3, 9, 7, 2, 8, 1);

add(2002, "2002_usa_patriot_act_surveillance", "USA PATRIOT Act & Domestic Surveillance Authorities", "News", "2001-2015 (Patriot Act Sunset Arc)", "Civil Rights & Social Issues", 1,
  "Expanding federal wiretapping, sneak-and-peek search warrants, and National Security Letters without judicial warrants.",
  "1 = Repeal Patriot Act / Restore Strict Fourth Amendment Warrant Rules", "10 = Maximum Counterterrorism Powers / Unfettered Surveillance Authority", 4, 9, 1, 1, 2, 1);

add(2002, "2002_sarbanes_oxley_accounting_reform", "Sarbanes-Oxley Act (SOX) & Corporate Governance Reform", "News", "2001-2006 (Enron/WorldCom Aftermath)", "Economy & Taxation", 2,
  "Mandating strict criminal liability for corporate executives certifying fraudulent books and creating PCAOB auditor oversight.",
  "1 = Strict Corporate Criminal Penalties & Structural Wall Street Regulation", "10 = Minimize Regulatory Compliance Costs / Protect Free Enterprise", 2, 6, 9, 1, 7, 1);

add(2002, "2002_tsa_airport_security_federalization", "Federalization of Airport Security Screeners (TSA Creation)", "News", "2001-2005 (Aviation Security Overhaul)", "Technology & Infrastructure", 2,
  "Replacing private contract airport screeners with federal civil service personnel under the Transportation Security Administration.",
  "1 = 100% Federalized Government Security Workforce with Union Rights", "10 = Private Competitive Airport Screeners Under Federal Oversight", 2, 7, 9, 2, 8, 1);

add(2002, "2002_bush_tax_cuts_permanence_egtrra", "Making the 2001 Bush Tax Cuts (EGTRRA) Permanent", "Ideological", "2001-2012 (Bush Tax Cut Debates)", "Economy & Taxation", 2,
  "Permanently enacting the 2001 income tax bracket reductions, child tax credits, and estate tax phaseouts beyond 2010.",
  "1 = Repeal Tax Cuts on Top Earners / Rebalance Federal Budget", "10 = Permanently Lock In All Tax Cuts Across All Brackets", 3, 10, 10, 1, 9, 1);

add(2002, "2002_no_child_left_behind_testing", "No Child Left Behind Mandated Testing & Annual Yearly Progress", "News", "2001-2015 (NCLB Accountability Era)", "Education", 2,
  "Mandating statewide annual testing in reading and math for grades 3-8 and restructuring persistently failing schools.",
  "1 = Fully Fund Federal Education Grants / Abolish High-Stakes Standardized Testing", "10 = Enforce Strict School Accountability & Voucher Restructuring", 4, 8, 9, 1, 9, 1);

add(2002, "2002_steel_import_tariffs_bush", "Bush 30% Protective Steel Import Safeguard Tariffs", "News", "2002-2004 (Temporary Safeguard Tariffs)", "Trade & Globalism", 3,
  "Imposing temporary 8% to 30% tariffs on imported steel to protect domestic manufacturing in Ohio, Pennsylvania, and West Virginia.",
  "1 = Support Industrial Union Workers Against Foreign Subsidized Dumping", "10 = Free Market Free Trade / Eliminate Retaliatory Trade Distortions", 4, 6, 10, 3, 4, 2);

add(2002, "2002_guantanamo_enemy_combatants", "Guantanamo Bay Indefinite Detention & Enemy Combatant Status", "Ideological", "2002-2026 (Post-9/11 Detention Jurisprudence)", "Foreign Policy & Defense", 3,
  "Holding suspected foreign terrorists indefinitely at Guantanamo Bay without access to civilian courts or Geneva protections.",
  "1 = Close Guantanamo / Grant Full Habeas Corpus & Article III Civilian Trials", "10 = Indefinite Military Detention of Unlawful Enemy Combatants", 3, 10, 2, 1, 8, 1);

add(2002, "2002_fast_track_trade_promotion", "Trade Promotion Authority ('Fast-Track') Renewal", "Ideological", "1974-2021 (Trade Authority Arc)", "Trade & Globalism", 3,
  "Granting the President expedited authority to negotiate trade agreements that Congress can only vote up or down without amendment.",
  "1 = Preserve Congressional Amendment Rights / Mandate Labor-Climate Standards", "10 = Expedited Executive Authority to Expand Global Market Access", 3, 8, 8, 1, 3, 1);

add(2002, "2002_farm_security_rural_investment", "2002 Farm Bill Target Prices & Subsidies Reversal", "News", "2002-2007 (Agricultural Countercyclical Support)", "Agriculture & Food", 4,
  "Reinstating counter-cyclical price support subsidies and high loan rates for commodity grain and cotton crops.",
  "1 = Reorient Subsidies Toward Organic Farmers, Conservation, and Food Stamps", "10 = Defend Agribusiness Commodity Safety Nets and Crop Subsidies", 5, 8, 10, 2, 6, 2);

add(2002, "2002_bipartisan_campaign_reform_bcra", "Bipartisan Campaign Reform Act (McCain-Feingold Enactment)", "News", "2002-2010 (BCRA Implementation Arc)", "Governance & Judiciary", 4,
  "Enacting statutory bans on national party soft money and restricting issue ads 60 days before general elections.",
  "1 = Enforce Strict BCRA Limits & Transition to Public Funding", "10 = Strike Down BCRA as Unconstitutional Violation of Free Speech", 3, 8, 10, 1, 9, 1);

add(2002, "2002_help_america_vote_act", "Help America Vote Act (HAVA) & Touchscreen Voting Terminals", "News", "2002-2006 (Voting Technology Upgrade)", "Governance & Judiciary", 4,
  "Distributing $3 billion to replace punch-card voting machines with electronic voting terminals and centralized voter registries.",
  "1 = Require Voter-Verified Paper Audit Trails (VVPAT) for All Ballots", "10 = Modernize Voting Infrastructure & Require State Photo ID Proof", 3, 7, 4, 1, 8, 1);

add(2002, "2002_axis_of_evil_doctrine", "'Axis of Evil' Security Doctrine & Preemptive Strikes", "News", "2002-2006 (Neoconservative Security Doctrine)", "Foreign Policy & Defense", 3,
  "Formally naming Iraq, Iran, and North Korea as an 'axis of evil' subject to potential preemptive military force.",
  "1 = Multilateral Diplomacy, Treaties, and Regional Nonproliferation", "10 = Assertive Preemption, Deterrence, and Coercive Regime Change", 4, 10, 2, 1, 7, 1);

add(2002, "2002_stem_cell_federal_limits", "Federal Funding Limits on Embryonic Stem Cell Lines", "Ideological", "2001-2009 (Embryonic Stem Cell Arc)", "Healthcare", 4,
  "Limiting federal medical research funds exclusively to the 60 embryonic stem cell lines derived before August 9, 2001.",
  "1 = Unrestricted Federal Research Funding for Promising Stem Cell Lines", "10 = Total Federal Ban on Embryonic Stem Cell Research", 2, 9, 5, 1, 10, 1);

add(2002, "2002_corporate_stock_option_expensing", "Mandatory Stock Option Expensing for Corporate Executives", "News", "2002-2005 (Financial Accounting Standards Battle)", "Economy & Taxation", 5,
  "Requiring publicly traded corporations to expense employee stock options on corporate balance sheets.",
  "1 = Mandatory Expensing to Expose Executive Compensation Excesses", "10 = Voluntary Disclosure / Shield High-Tech Startup Equity Grants", 3, 7, 9, 1, 6, 1);

add(2002, "2002_yucca_mountain_approval_override", "Congressional Override of Nevada Veto on Yucca Mountain", "News", "2002-2004 (Nevada Veto Override)", "Energy & Climate", 5,
  "Passing a joint congressional resolution overriding the Nevada Governor's official veto of Yucca Mountain.",
  "1 = Respect Nevada State Sovereignty / Halt Radioactive Waste Shipments", "10 = Override State Veto / Fulfill National Nuclear Waste Disposal Obligation", 4, 9, 6, 1, 8, 1);

add(2002, "2002_terrorism_risk_insurance_tria", "Terrorism Risk Insurance Act (TRIA) Federal Backstop", "News", "2002-2007 (Commercial Real Estate Stability)", "Economy & Taxation", 6,
  "Providing a taxpayer-backed federal reinsurance guarantee for catastrophic losses caused by foreign acts of terrorism.",
  "1 = Condition Federal Reinsurance on Public Equity and Infrastructure Support", "10 = Pure Private Insurance Markets / Sunset Federal Risk Exposure", 4, 6, 9, 2, 7, 1);

add(2002, "2002_west_coast_port_lockout_taft_hartley", "Bush Taft-Hartley Injunction in West Coast Port Lockout", "News", "2002 (Maritime Labor Conflict)", "Labor & Welfare", 6,
  "Invoking federal emergency powers under Taft-Hartley to end an 11-day lockout of 10,500 dockworkers at 29 Pacific ports.",
  "1 = Protect Longshore Union Bargaining Power Against Employer Lockout", "10 = Federal Intervention to Reopen Ports and Safeguard Supply Chains", 3, 9, 8, 1, 8, 1);

add(2002, "2002_north_korea_uranium_enrichment", "North Korean Covert Uranium Enrichment & Fuel Freeze", "News", "2002-2006 (Second North Korean Nuclear Crisis)", "Foreign Policy & Defense", 3,
  "Suspending heavy oil fuel aid to Pyongyang after U.S. diplomats uncover covert uranium enrichment centrifuge programs.",
  "1 = Direct Bilateral Talks & Diplomatic Security Guarantees", "10 = Maximum Sanctions, Naval Interdiction, and Preemptive Options", 4, 9, 4, 1, 8, 1);

add(2002, "2002_california_after_school_prop49", "California Prop 49 (Dedicated State After-School Funding)", "News", "2002-2006 (State Education Ballot Initiatives)", "Education", 5,
  "Earmarking up to $550 million annually in California state funds for public school after-school enrichment programs.",
  "1 = Expand Dedicated Public Youth & Community Education Funding", "10 = Oppose Earmarked Formula Spending / Maintain Budgetary Flexibility", 3, 6, 9, 2, 8, 1);

add(2002, "2002_florida_class_size_amendment", "Florida Amendment 9 (Constitutional Class Size Limits)", "News", "2002-2006 (Class Size Mandate)", "Education", 5,
  "Amending Florida Constitution to cap public school class sizes at 18 students for K-3 and 22 students for 4-8.",
  "1 = Enforceable Class Size Caps for Student Achievement and Equity", "10 = Reject Unfunded Constitutional Mandates / Local District Discretion", 2, 8, 9, 1, 8, 1);

add(2002, "2002_nevada_question_2_marriage", "Nevada Question 2 (Constitutional Ban on Same-Sex Marriage)", "Ideological", "1998-2004 (Early State Marriage Amendments)", "Civil Rights & Social Issues", 5,
  "Amending the Nevada Constitution to restrict marriage recognition solely to unions between a male and female.",
  "1 = Full Marriage Equality & Civil Rights for Same-Sex Couples", "10 = Constitutional Defense of Traditional Marriage", 4, 9, 3, 1, 10, 1);

add(2002, "2002_clean_skies_initiative_cap_and_trade", "Bush 'Clean Skies' Initiative Cap-and-Trade for Power Plants", "News", "2002-2004 (Clean Skies Proposal)", "Energy & Climate", 6,
  "Replacing Clean Air Act New Source Review enforcement with a market-based trading system for sulfur and nitrogen.",
  "1 = Enforce Clean Air Act New Source Review & Enact Carbon Caps", "10 = Market Cap-and-Trade / Exempt Carbon Dioxide from Regulation", 3, 8, 7, 1, 8, 1);

add(2002, "2002_pension_protection_enron_401k", "401(k) Pension Diversification Reforms Post-Enron", "News", "2002-2006 (Defined Contribution Reforms)", "Labor & Welfare", 5,
  "Allowing workers to sell employer stock in 401(k) accounts after three years to prevent Enron-style pension collapse.",
  "1 = Mandatory Employer Match Diversification & Defined Benefit Guarantees", "10 = Voluntary Fiduciary Guidance / Protect Company Stock Contributions", 2, 7, 8, 1, 6, 1);

add(2002, "2002_unborn_victims_of_violence", "Unborn Victims of Violence Act (Fetal Homicide Legislation)", "Ideological", "1999-2004 (Fetal Rights Arc)", "Civil Rights & Social Issues", 4,
  "Recognizing a fetus in utero as a distinct legal victim if killed or injured during the commission of a federal crime.",
  "1 = Protect Reproductive Rights / Oppose Codifying Fetal Personhood", "10 = Full Legal Personhood for Unborn Children Under Criminal Law", 3, 9, 6, 1, 10, 1);

add(2002, "2002_anthrax_biodefense_spending", "Project BioShield & Federal Anthrax Postal Decontamination", "News", "2001-2004 (Post-9/11 Biodefense)", "Healthcare", 6,
  "Appropriating $6 billion for federal stockpiles of vaccines, antibiotics, and postal irradiation systems against anthrax.",
  "1 = Public Health Infrastructure & Global Biological Nonproliferation", "10 = Accelerated Pharmaceutical Biodefense Procurement & Stockpiling", 4, 8, 6, 2, 8, 1);

add(2002, "2002_partial_birth_veto_override_push", "Federal Partial-Birth Abortion Ban Reintroduction", "Ideological", "1995-2003 (Late-Term Abortion Arc)", "Civil Rights & Social Issues", 3,
  "Passing federal statutory legislation criminalizing late-term intact dilation and extraction abortions without exceptions.",
  "1 = Veto Any Abortion Ban Lacking Exception for Maternal Health", "10 = Complete Ban on Late-Term Procedures Under Federal Criminal Code", 3, 9, 5, 1, 10, 1);

add(2002, "2002_fbi_reorganization_counterterror", "FBI Reorganization from Bank Robbery to Domestic Counterterrorism", "News", "2001-2004 (Intelligence Reform Arc)", "Governance & Judiciary", 7,
  "Shifting hundreds of FBI special agents from traditional criminal cases to domestic counterterrorism intelligence gathering.",
  "1 = Maintain Fourth Amendment Civil Liberties & Civilian Law Focus", "10 = Prioritize Domestic Counterterror Intelligence Over Criminal Caseloads", 4, 8, 3, 2, 7, 1);

add(2002, "2002_cuba_embargo_jimmy_carter_visit", "Jimmy Carter's Historic Havana Visit & Embargo Debates", "News", "2002 (Carter Cuba Mission)", "Foreign Policy & Defense", 7,
  "Debating normalization of travel and trade with Cuba after former President Carter visits Havana and speaks on live TV.",
  "1 = End Travel Bans and Unconditionally Normalize Cuban Relations", "10 = Retain Full Economic Sanctions Until Democratic Elections in Cuba", 3, 8, 2, 1, 9, 1);

// Add remaining 22 issues for 2002 to reach 52 issues
add(2002, "2002_gun_control_sniper_attacks", "Ballistic Fingerprinting & Beltway Sniper Response", "News", "2002-2003 (DC Sniper Aftermath)", "Civil Rights & Social Issues", 3,
  "Establishing a national computerized ballistic database of spent bullet casings from newly manufactured handguns.",
  "1 = Mandatory National Ballistic Fingerprint Registry & Gun Licensing", "10 = Oppose Gun Registries / Second Amendment Infringement", 2, 9, 10, 1, 10, 2);

add(2002, "2002_federal_minimum_wage_stagnation", "Federal Minimum Wage Frozen at $5.15", "Ideological", "1997-2007 (Minimum Wage Stagnation)", "Labor & Welfare", 3,
  "Democratic push to break the 5-year freeze on the federal minimum wage and raise it to $6.65 per hour.",
  "1 = Raise Minimum Wage Substantially to Keep Up with Inflation", "10 = Freeze Minimum Wage to Prevent Small Business Job Losses", 2, 8, 10, 1, 9, 1);

add(2002, "2002_anwr_drilling_energy_security", "ANWR Drilling Reauthorization for Post-9/11 Energy Security", "Ideological", "1980-2020 (Energy Exploration Arc)", "Energy & Climate", 3,
  "Promoting Alaskan Arctic wildlife refuge drilling as a patriotic post-9/11 national security necessity.",
  "1 = Permanent Wilderness Protection / Shift to Clean Energy", "10 = Immediate Alaskan Drilling for Energy Independence", 3, 9, 9, 1, 9, 1);

add(2002, "2002_school_vouchers_zelman_scotus", "Supreme Court Voucher Ruling (Zelman v. Simmons-Harris)", "News", "2002 (Zelman Supreme Court Decision)", "Education", 4,
  "Supreme Court ruling upholding taxpayer-funded tuition vouchers used at private religious parochial schools.",
  "1 = Protect Public School Budgets & Church-State Separation", "10 = Expand Parochial School Vouchers Under Free Exercise Clause", 3, 9, 8, 1, 10, 1);

add(2002, "2002_corporate_tax_inversion_havens", "Corporate Tax Inversions & Bermuda Mailbox Addresses", "News", "2002-2004 (Early Inversion Scrutiny)", "Economy & Taxation", 4,
  "Barring U.S. corporations from reincorporating in Bermuda or the Cayman Islands to avoid paying federal corporate income taxes.",
  "1 = Strict Penalties & Loss of Federal Contracts for Inverted Firms", "10 = Lower U.S. Corporate Tax Rate to Deter Capital Flight", 2, 7, 9, 1, 6, 1);

add(2002, "2002_puerto_rico_vieques_navy_withdrawal", "Executive Agreement on Navy Vieques Range Closure", "News", "2001-2003 (Vieques Closure Arc)", "Foreign Policy & Defense", 6,
  "Executing the presidential directive to permanently end Navy bombing exercises on Vieques by May 2003.",
  "1 = Expedite Closure and Fund Environmental Decontamination", "10 = Regret Military Training Readiness Loss on Atlantic Range", 3, 7, 5, 1, 8, 1);

add(2002, "2002_estate_tax_permanence_battle", "House Repeal of Sunset on Estate Tax Exemption", "Ideological", "1990-2026 (Wealth Taxation Arc)", "Economy & Taxation", 4,
  "Passing legislation to permanently abolish the estate tax without the 2010 sunset clause.",
  "1 = High Progressive Inheritance Taxes on Wealthy Dynasties", "10 = Complete Permanent Abolition of the Estate Tax", 3, 9, 10, 1, 10, 1);

add(2002, "2002_medical_marijuana_ninth_circuit_raids", "Federal DEA Raids on California Medical Cannabis Dispensaries", "News", "2001-2005 (Raich Pre-Ruling Arc)", "Civil Rights & Social Issues", 5,
  "Federal DEA agents raiding state-legal medical marijuana patient cooperatives in California under federal supremacy.",
  "1 = End Federal DEA Raids / Respect State Compassionate Use Laws", "10 = Enforce Federal Controlled Substances Act Universally", 3, 8, 1, 1, 9, 1);

add(2002, "2002_national_id_card_debate", "National Identity Card & Biometric Driver's Licenses", "News", "2001-2005 (Pre-REAL ID Debate)", "Civil Rights & Social Issues", 5,
  "Proposals to create a standardized national biometric identification card to verify citizenship and flight access.",
  "1 = Strongly Oppose National ID / Protect Constitutional Privacy Rights", "10 = Mandate Secure National Biometric ID for National Security", 4, 8, 1, 1, 4, 1);

add(2002, "2002_corporate_whistleblower_protections", "Federal Whistleblower Retaliation Shields in Sarbanes-Oxley", "News", "2002-2005 (SOX Whistleblower Rights)", "Governance & Judiciary", 6,
  "Providing federal civil and criminal protections for corporate employees reporting internal fraud.",
  "1 = Robust Protection and Financial Rewards for Whistleblowers", "10 = Protect Companies from Frivolous Whistleblower Litigation", 2, 7, 7, 1, 6, 1);

add(2002, "2002_missile_defense_abm_withdrawal_official", "Official U.S. Withdrawal from 1972 ABM Treaty", "News", "2002 (ABM Treaty Abrogation)", "Foreign Policy & Defense", 5,
  "Formal 6-month notice of withdrawal from the Anti-Ballistic Missile Treaty taking effect in June 2002.",
  "1 = Dangerous Arms Race Escalation / Recommit to Treaties", "10 = Exercise Sovereign Right to Defend Homeland from Rogue Missiles", 4, 9, 6, 1, 10, 1);

add(2002, "2002_social_security_commission_proposals", "Bush Social Security Commission Private Account Models", "News", "2001-2005 (Moynihan Commission Models)", "Economy & Taxation", 4,
  "Releasing three optional models for voluntary personal retirement accounts funded by payroll tax carve-outs.",
  "1 = Reject Carve-Outs / Protect Solvency by Raising Tax Cap", "10 = Implement Voluntary Personal Retirement Accounts", 2, 9, 10, 1, 9, 1);

add(2002, "2002_death_penalty_atkins_ruling", "Supreme Court Ban on Executing Mentally Disabled (Atkins v. VA)", "News", "2002 (Atkins SCOTUS Ruling)", "Civil Rights & Social Issues", 6,
  "Supreme Court ruling that execution of intellectually disabled criminals violates the Eighth Amendment.",
  "1 = Affirm Eighth Amendment Humanity / Move Toward Total Abolition", "10 = Leave Capital Sentencing Standards to State Juries", 3, 8, 5, 1, 9, 1);

add(2002, "2002_cuba_agricultural_cash_sales_boom", "Expansion of U.S. Grain and Poultry Exports to Cuba", "News", "2001-2004 (TSRA Export Surge)", "Trade & Globalism", 7,
  "U.S. agribusinesses exporting hundreds of millions of dollars in rice and chicken to Havana on cash terms.",
  "1 = Normalize Trade and Lift Credit Restrictions on Cuba Sales", "10 = Maintain Cash-in-Advance Requirement / No Credit to Dictatorship", 4, 7, 3, 1, 8, 1);

add(2002, "2002_clean_water_wetlands_swancc", "Clean Water Act Jurisdiction After SWANCC Supreme Court Ruling", "News", "2001-2006 (Isolated Wetlands Jurisprudence)", "Energy & Climate", 7,
  "Army Corps of Engineers narrowing federal Clean Water Act protection over isolated ponds and vernal pools.",
  "1 = Pass Clean Water Restoration Act to Protect All Waters", "10 = Respect State Jurisdiction / Prevent Federal Overreach on Ponds", 2, 8, 9, 1, 9, 1);

add(2002, "2002_campaign_finance_constitutionality_fights", "Legal Challenges to McCain-Feingold (McConnell v. FEC)", "News", "2002-2003 (Pre-McConnell Ruling)", "Governance & Judiciary", 5,
  "Senator Mitch McConnell filing a federal lawsuit challenging BCRA's soft money ban as unconstitutional speech suppression.",
  "1 = Defend BCRA to Curb Gilded Age Wealth Corruption", "10 = Support Lawsuit to Strike Down Unconstitutional Speech Limits", 3, 9, 10, 1, 10, 1);

add(2002, "2002_nuclear_posture_review_low_yield", "Pentagon Nuclear Posture Review & Low-Yield 'Bunker Busters'", "News", "2001-2004 (Robust Nuclear Earth Penetrator)", "Foreign Policy & Defense", 6,
  "Researching low-yield earth-penetrating nuclear weapons ('bunker busters') to destroy hardened subterranean facilities.",
  "1 = Cancel Bunker Buster Research / Prevent Nuclear Normalization", "10 = Develop Low-Yield Weapons to Deter WMD Deep-Bunker Targets", 3, 9, 5, 1, 9, 1);

add(2002, "2002_tort_reform_asbestos_trust_funds", "National Asbestos Injury Trust Fund Legislation", "News", "2002-2006 (Asbestos Liability Crisis)", "Economy & Taxation", 7,
  "Establishing a $140 billion industry-funded trust to resolve hundreds of thousands of asbestos personal injury suits.",
  "1 = Protect Asbestos Victims' Seventh Amendment Rights to Jury Trial", "10 = Pass Asbestos Trust to Halt Bankruptcies and Frivolous Litigation", 3, 8, 8, 1, 8, 1);

add(2002, "2002_title_ix_athletics_quota_disputes", "Title IX Enforcement & Proportionality Standards in College Sports", "Ideological", "1972-2026 (Title IX Sports Gender Equity)", "Civil Rights & Social Issues", 7,
  "Secretary of Education commission evaluating whether Title IX proportionality tests unfairly force colleges to cut men's wrestling teams.",
  "1 = Strict Defense of Title IX Proportionality for Female Athletes", "10 = Revise Title IX Enforcement to Protect Men's Non-Revenue Sports", 3, 8, 7, 1, 9, 1);

add(2002, "2002_third_party_exclusion_midterm_debates", "Third-Party Exclusion from Congressional Television Debates", "Ideological", "1992-2026 (Electoral Reform Arc)", "Governance & Judiciary", 8,
  "Broadcasters excluding Libertarian, Green, and independent candidates from televised Senate and gubernatorial debates.",
  "1 = Open Debates to All Ballot-Qualified Candidates / Ranked Choice Voting", "10 = Retain Viability Thresholds / Focus on Two Main Parties", 6, 8, 1, 1, 1, 1);

add(2002, "2002_international_criminal_court_asp_act", "American Service-Members' Protection Act ('Hague Invasion Act')", "News", "2002 (ASPA Enactment)", "Foreign Policy & Defense", 6,
  "Authorizing the President to use all means necessary to free U.S. military personnel detained by the International Criminal Court.",
  "1 = Repeal ASPA / Cooperate Fully with International War Crimes Courts", "10 = Ironclad Protection of American Troops from Foreign Courts", 3, 9, 5, 1, 10, 1);

add(2002, "2002_executive_order_presidential_records", "Bush Executive Order 13233 on Presidential Records", "News", "2001-2009 (Executive Privilege Records)", "Governance & Judiciary", 8,
  "Granting former presidents and their heirs broad executive authority to withhold historical White House papers from the public.",
  "1 = Revoke Order / Enforce Public Access Under Presidential Records Act", "10 = Defend Inherent Executive Privilege and Candor in Deliberations", 2, 8, 4, 1, 7, 1);

console.log('Bracket 1 (2000 & 2002) total:', ISSUES.length);
// Append 2004 and 2006 to scripts/build-bracket1-full.cjs

// =========================================================================
// 2004 (52 Issues)
// =========================================================================
add(2004, "2004_iraq_war_conduct_fallujah", "Conduct of Iraq War & Fallujah Counterinsurgency", "News", "2003-2008 (Iraq Insurgency Phase)", "Foreign Policy & Defense", 1,
  "Counterinsurgency strategy, casualty rates, and urban warfare in Fallujah and the Sunni Triangle.",
  "1 = Phased Troop Withdrawal / Convene Regional Diplomatic Summit", "10 = 'Stay the Course' / Total Military Victory Over Insurgency", 3, 10, 2, 1, 8, 1);

add(2004, "2004_abu_ghraib_interrogation_scandal", "Abu Ghraib Prisoner Abuse Scandal & Interrogation Policies", "News", "2004-2006 (Detainee Abuse Fallout)", "Foreign Policy & Defense", 1,
  "Investigating Pentagon command memos authorizing harsh interrogation tactics following public release of prison abuse photos.",
  "1 = Independent Special Counsel / Rumsfeld Resignation / Ban Coercive Tactics", "10 = Treat as Isolated Misconduct of Low-Level Guards / Defend Command", 2, 9, 3, 1, 7, 1);

add(2004, "2004_federal_marriage_amendment", "Federal Constitutional Marriage Amendment (FMA)", "Ideological", "2003-2006 (Federal Marriage Amendment Push)", "Civil Rights & Social Issues", 1,
  "Amending the U.S. Constitution to define marriage as only between a man and woman after Massachusetts legalized gay marriage.",
  "1 = Support Full Marriage Equality / Reject Discriminatory Amendments", "10 = Amend U.S. Constitution to Ban Same-Sex Marriage Nationwide", 3, 10, 2, 1, 10, 1);

add(2004, "2004_state_marriage_amendments_11_states", "11 State Constitutional Marriage Bans on the Ballot", "News", "2004 (Super-Tuesday Marriage Amendments)", "Civil Rights & Social Issues", 1,
  "Ballot measures in 11 states (OH, MI, GA, KY, MS, MT, ND, OK, OR, UT, AR) banning same-sex marriage and civil unions.",
  "1 = Vote No / Protect LGBTQ Equal Protection and Dignity", "10 = Vote Yes / Protect Traditional Marriage in State Constitutions", 3, 10, 3, 1, 10, 1);

add(2004, "2004_missing_wmds_duelfer_report", "Missing Weapons of Mass Destruction (Duelfer Report)", "News", "2003-2005 (WMD Intelligence Fallout)", "Foreign Policy & Defense", 2,
  "Assessing the Iraq Survey Group report confirming pre-war stockpiles of Iraqi WMDs had been destroyed years prior.",
  "1 = Condemn Deceptive Pretext for War / Full Accountability", "10 = Saddam Had WMD Intent and Strategic Materials / War Justified", 2, 9, 2, 1, 8, 1);

add(2004, "2004_medicare_part_d_rx_benefit", "Medicare Part D Prescription Drug Benefit & Non-Interference", "News", "2003-2008 (Medicare Part D Rollout)", "Healthcare", 2,
  "Delivering Medicare outpatient drug benefits via private insurance while prohibiting the government from negotiating prices.",
  "1 = Authorize Medicare Direct Price Negotiation / Eliminate Donut Hole", "10 = Retain Private Market Model / Prohibit Government Price Controls", 2, 9, 8, 1, 8, 1);

add(2004, "2004_swift_boat_veterans_attacks", "Swift Boat Veterans for Truth Controversy", "News", "2004 (Swift Boat Smear Arc)", "Foreign Policy & Defense", 2,
  "Questioning John Kerry's Vietnam combat medals and his 1971 anti-war testimony before the Senate Foreign Relations Committee.",
  "1 = Condemn Partisan Smear Campaign Discrediting a Decorated Veteran", "10 = Expose Discrepancies in Kerry's Service and Anti-War Rhetoric", 2, 9, 5, 2, 9, 1);

add(2004, "2004_jobs_and_growth_tax_cuts_jgtrra", "2003 Capital Gains & Dividend 15% Tax Cut (JGTRRA)", "Ideological", "2003-2012 (Capital Taxation Debates)", "Economy & Taxation", 2,
  "Slashing top tax rates on corporate dividends and capital gains to 15% to stimulate equity investment.",
  "1 = Tax Investment Income as Ordinary Income / End Wealth Loopholes", "10 = Permanently Lock In 15% (or Zero) Tax on Capital and Dividends", 2, 10, 10, 1, 9, 1);

add(2004, "2004_federal_assault_weapons_sunset", "Expiration of 1994 Federal Assault Weapons Ban", "News", "2004 (Assault Weapon Sunset)", "Civil Rights & Social Issues", 2,
  "Allowing the 10-year ban on manufacture and sale of semiautomatic assault weapons to expire without renewal.",
  "1 = Permanently Renew & Expand the Federal Assault Weapons Ban", "10 = Celebrate Expiration / Protect Lawful Semiautomatic Gun Ownership", 2, 9, 10, 1, 10, 2);

add(2004, "2004_911_commission_recommendations", "9/11 Commission Report & Director of National Intelligence (DNI)", "News", "2004-2005 (Intelligence Overhaul)", "Governance & Judiciary", 3,
  "Creating the Director of National Intelligence and National Counterterrorism Center to unify 15 intelligence agencies.",
  "1 = Enact All 41 Recommendations of the 9/11 Commission in Full", "10 = Protect Pentagon Command Authority Over Military Intelligence", 3, 7, 5, 2, 7, 1);

add(2004, "2004_stem_cell_california_prop71", "California Proposition 71 ($3B State Stem Cell Research Bond)", "News", "2004-2008 (State Stem Cell Initiatives)", "Healthcare", 3,
  "Issuing $3 billion in state general obligation bonds to bypass federal embryonic stem cell restrictions.",
  "1 = Fund Stem Cell Science to Cure Parkinson's, Diabetes, and Paralysis", "10 = Oppose Taxpayer Subsidies for Destruction of Human Embryos", 2, 8, 4, 1, 10, 1);

add(2004, "2004_unborn_victims_of_violence_laci", "Unborn Victims of Violence Act (Laci and Conner's Law)", "News", "2004 (Laci Peterson Enactment)", "Civil Rights & Social Issues", 3,
  "Enacting federal statute recognizing an embryo or fetus as a separate legal victim during federal violent crimes.",
  "1 = Oppose Legal Encroachment on Reproductive Freedom", "10 = Recognize Legal Personhood and Protection of Unborn Children", 2, 9, 6, 1, 10, 1);

add(2004, "2004_medical_malpractice_caps", "Federal Caps on Non-Economic Medical Malpractice Damages", "Ideological", "1995-2010 (Tort Reform Arc)", "Healthcare", 4,
  "Enacting a $250,000 federal statutory cap on pain-and-suffering non-economic damages in medical liability suits.",
  "1 = Protect Patient Rights to Full Jury Compensation / No Arbitrary Caps", "10 = Enact $250,000 Cap to Curb Defensive Medicine & Lower Premiums", 2, 9, 8, 1, 9, 1);

add(2004, "2004_health_savings_accounts_hsas", "High-Deductible Health Savings Accounts (HSAs)", "Ideological", "2003-2026 (Consumer-Directed Healthcare)", "Healthcare", 4,
  "Promoting tax-free Health Savings Accounts paired with high-deductible health plans to encourage consumer cost consciousness.",
  "1 = Oppose HSAs as Wealth Shelters / Universal Comprehensive Single-Payer", "10 = Expand HSAs to Free Healthcare Consumers from Government and HMOs", 3, 9, 10, 1, 9, 1);

add(2004, "2004_offshoring_benedict_arnold_ceos", "Corporate Offshoring & Outsourcing of Manufacturing/IT Jobs", "News", "2003-2006 (Job Offshoring Backlash)", "Trade & Globalism", 3,
  "Eliminating federal tax deferrals for corporations moving factories overseas and penalizing outsourcing to India and China.",
  "1 = Penalize Outsourcing / End Corporate Tax Deferral on Foreign Profits", "10 = Defend Global Supply Chains & Free Trade / Lower U.S. Corporate Tax", 3, 8, 9, 1, 4, 1);

add(2004, "2004_fcc_indecency_janet_jackson", "FCC Broadcast Indecency Crackdowns & Fines", "News", "2004-2008 (Post-Super Bowl Decency Crackdown)", "Civil Rights & Social Issues", 5,
  "Increasing FCC fines tenfold on broadcast networks for fleeting expletives and sexual content following the Super Bowl incident.",
  "1 = Defend First Amendment Free Expression Against Moral Censorship", "10 = Aggressive Enforcement of Decency Standards on Public Airwaves", 4, 9, 2, 2, 10, 1);

add(2004, "2004_darfur_genocide_declaration", "Darfur Crisis & Formal Declaration of Genocide", "News", "2004-2008 (Darfur Humanitarian Crisis)", "Foreign Policy & Defense", 4,
  "Declaring Sudanese government and Janjaweed atrocities in Darfur a genocide and demanding UN peacekeeper deployment.",
  "1 = International Peacekeeping & Sanctions on Sudanese Regime", "10 = American Diplomatic Pressure / Avoid Unilateral Troop Commitments", 3, 6, 4, 1, 6, 1);

add(2004, "2004_overtime_pay_regulations_flsa", "Department of Labor Overtime Exemption Rule Changes", "News", "2004 (FLSA Overtime Reclassification)", "Labor & Welfare", 4,
  "Reclassifying white-collar supervisory and technical workers to exempt them from mandatory time-and-a-half overtime pay.",
  "1 = Protect 40-Hour Week & Overtime Pay for Millions of Workers", "10 = Modernize Labor Rules for White-Collar Professional Workforce", 2, 9, 9, 1, 8, 1);

add(2004, "2004_class_action_fairness_act", "Class Action Fairness Act (Moving Cases to Federal Courts)", "News", "2003-2005 (CAFA Enactment)", "Governance & Judiciary", 5,
  "Transferring multi-state class-action tort lawsuits from plaintiff-friendly state county courts into federal courts.",
  "1 = Protect Consumer and Worker Class Action Access Against Corporate Abuse", "10 = Curb Forum Shopping by Trial Lawyers in Notorious 'Judicial Hellholes'", 2, 9, 8, 1, 9, 1);

add(2004, "2004_colorado_amendment_36_ev_split", "Colorado Amendment 36 (Proportional Electoral Vote Allocation)", "News", "2004 (Proportional EV Ballot Initiative)", "Governance & Judiciary", 6,
  "Allocating Colorado's 9 Electoral College votes proportionally based on the state's presidential popular vote.",
  "1 = Support Proportional EV Allocation Toward Direct Popular Vote", "10 = Reject Proportional Split / Protect Winner-Take-All State Leverage", 4, 8, 5, 2, 8, 2);

add(2004, "2004_florida_hurricane_fema_relief", "Federal Disaster Relief Appropriations for Florida Hurricanes", "News", "2004 (Four Florida Hurricanes: Charley, Frances, Ivan, Jeanne)", "Energy & Climate", 5,
  "Authorizing $12+ billion in emergency disaster relief and FEMA mobile housing aid for Florida storm victims before the election.",
  "1 = Fully Funded Emergency Disaster Relief & Strengthened Building Codes", "10 = Efficient Emergency Aid / Prevent Unreimbursed Federal Waste", 4, 7, 7, 2, 7, 1);

add(2004, "2004_nclb_unfunded_mandate_backlash", "State Bipartisan Rebellion Against NCLB Testing Mandates", "News", "2003-2006 (State Resistance to NCLB)", "Education", 5,
  "State legislative resolutions in Utah and Virginia protesting federal No Child Left Behind testing mandates as unfunded mandates.",
  "1 = Substantially Increase Federal Education Funding or Repeal Penalties", "10 = Enforce Rigorous Federal Standards and Sanctions for Underperformance", 3, 6, 9, 1, 9, 1);

add(2004, "2004_partial_birth_abortion_court_fights", "Federal Injunctions Against the Partial-Birth Abortion Ban Act", "News", "2003-2007 (Gonzales v. Carhart Pre-Ruling)", "Governance & Judiciary", 4,
  "Federal district judges striking down the Partial-Birth Abortion Ban Act for failing to include a maternal health exception.",
  "1 = Affirm Court Decisions Protecting Women's Health and Autonomy", "10 = Appeal Decisions to Supreme Court to Uphold the Lawful Congressional Ban", 2, 9, 5, 1, 10, 1);

add(2004, "2004_iraq_coalition_allies_withdrawal", "Withdrawal of Spanish and Allied Troops from Iraq Coalition", "News", "2004 (Post-Madrid Train Bombing Realignment)", "Foreign Policy & Defense", 6,
  "Handling the withdrawal of Spain, Honduras, and the Dominican Republic from the Iraq coalition following the Madrid train bombings.",
  "1 = Respect Allied Democratic Mandates / Internationalize Transition to UN", "10 = Condemn Appeasement of Terrorists / Reinvigorate Coalition of the Willing", 3, 9, 4, 1, 8, 1);

add(2004, "2004_montana_medical_marijuana_i148", "Montana Medical Marijuana Act (Initiative 148)", "News", "2004 (Western Medical Marijuana Expansion)", "Civil Rights & Social Issues", 6,
  "Legalizing the use, cultivation, and possession of marijuana for registered patients with debilitating medical conditions.",
  "1 = Protect Patient Access to Medical Cannabis / End Federal Interference", "10 = Oppose State Marijuana Measures / Enforce Federal Controlled Substances Act", 3, 7, 1, 1, 8, 1);

add(2004, "2004_cafta_dr_trade_pact", "Central American Free Trade Agreement (CAFTA-DR)", "News", "2004-2005 (CAFTA Ratification Battle)", "Trade & Globalism", 4,
  "Eliminating trade barriers and tariffs between the United States and five Central American nations and the Dominican Republic.",
  "1 = Reject CAFTA / Protect Domestic Sugar, Textiles, and Central American Labor", "10 = Ratify CAFTA to Expand Export Markets and Geopolitical Stability", 3, 9, 8, 1, 4, 1);

add(2004, "2004_bush_guest_worker_immigration", "Bush Temporary Worker Immigration Proposal", "News", "2004-2007 (Comprehensive Immigration Precursor)", "Immigration & Border", 3,
  "Creating a legal temporary guest worker program allowing undocumented workers to register without a direct path to citizenship.",
  "1 = Comprehensive Pathway to Citizenship / Protect Immigrant Labor Rights", "10 = Oppose 'Amnesty' / Enforce Immediate Border Security and Workplace Audits", 3, 6, 5, 1, 10, 1);

add(2004, "2004_gasoline_prices_two_dollars", "Rising Gasoline Prices Passing $2.00/Gallon", "News", "2004 (Early Price Spike)", "Energy & Climate", 4,
  "Addressing consumer gasoline price spikes driven by Iraq War instability, China demand growth, and tight refining capacity.",
  "1 = Release Strategic Petroleum Reserve / Enact Windfall Taxes on Oil Companies", "10 = Expand Domestic Drilling in ANWR and OCS / Slash Refining Environmental Rules", 3, 9, 9, 1, 9, 1);

add(2004, "2004_air_force_boeing_tanker_scandal", "Air Force Boeing Tanker Lease Scandal & Pentagon Procurement Ethics", "News", "2003-2005 (Druyun Corruption Scandal)", "Governance & Judiciary", 7,
  "Canceling a $23 billion lease of Boeing 767 aerial refueling tankers following criminal conflict-of-interest revelations by Darleen Druyun.",
  "1 = Stringent Pentagon Contract Auditing / End Revolving-Door Defense Lobbying", "10 = Rapid Tanker Modernization / Protect American Aerospace Industrial Base", 2, 7, 6, 1, 7, 1);

add(2004, "2004_smart_border_biometric_us_visit", "US-VISIT Biometric Fingerprint Screening at Ports of Entry", "News", "2004-2006 (Biometric Border Rollout)", "Immigration & Border", 5,
  "Deploying digital inkless fingerprint scanners and facial photos for foreign visitors arriving at all U.S. international airports.",
  "1 = Safeguard Foreign Traveler Civil Liberties & Privacy / Prevent Discrimination", "10 = Enforce Universal Biometric Entry-Exit Tracking for All Foreign Visitors", 4, 9, 4, 2, 9, 1);

add(2004, "2004_guantanamo_rasul_bush_ruling", "Supreme Court Detainee Habeas Ruling (Rasul v. Bush)", "News", "2004 (Detainee Jurisprudence)", "Foreign Policy & Defense", 4,
  "Supreme Court ruling that federal civilian courts have jurisdiction to hear habeas corpus challenges from Guantanamo Bay detainees.",
  "1 = Uphold Judicial Review & Fundamental Due Process for All Detainees", "10 = Pass Legislation Stripping Civilian Courts of Habeas Jurisdiction in Wartime", 2, 9, 2, 1, 8, 1);

add(2004, "2004_intelligence_reform_act", "Intelligence Reform and Terrorism Prevention Act of 2004", "News", "2004 (IRTPA Passage)", "Governance & Judiciary", 5,
  "Statutory creation of the Privacy and Civil Liberties Oversight Board (PCLOB) and the Human Intelligence (HUMINT) coordination office.",
  "1 = Strengthen Independent Civil Liberties Oversight Over All Spy Agencies", "10 = Empower Intelligence Director to Unify and Direct Counterterrorism Operations", 3, 8, 4, 1, 7, 1);

add(2004, "2004_saudi_arabia_911_allegations", "Declassifying 28 Pages of Congressional 9/11 Saudi Inquiries", "News", "2003-2016 (28 Pages Declassification Battle)", "Foreign Policy & Defense", 6,
  "Demands by 9/11 victims' families to declassify 28 classified pages investigating alleged official Saudi ties to the hijackers.",
  "1 = Full Transparency / Declassify All Redacted Findings Without Diplomatic Shields", "10 = Maintain Diplomatic Classification to Preserve Strategic Saudi Intelligence Alliance", 2, 7, 2, 1, 4, 1);

add(2004, "2004_corporate_tax_repatriation_holiday", "American Jobs Creation Act Homeland Investment Act (HIA)", "News", "2004 (Repatriation Tax Holiday)", "Economy & Taxation", 5,
  "Offering a one-time 5.25% temporary tax rate on offshore corporate profits repatriated to the United States.",
  "1 = Oppose Corporate Tax Holidays / Close Foreign Subsidiary Tax Havens", "10 = Repatriate Billions of Offshore Capital to Spur U.S. Business Investment", 3, 9, 9, 1, 8, 1);

add(2004, "2004_federal_deficit_record_412_billion", "Federal Budget Deficit Reaching Record $412 Billion", "News", "2003-2006 (Post-Surplus Deficit Surge)", "Economy & Taxation", 4,
  "Confronting the reversal from budget surplus to a $412 billion annual deficit driven by war spending and tax cuts.",
  "1 = Roll Back Top Tax Cuts & Re-impose Statutory Pay-As-You-Go (PAYGO) Caps", "10 = Cut Non-Defense Discretionary Spending / Grow Out of Deficit Through Tax Cuts", 3, 9, 10, 1, 9, 1);

add(2004, "2004_clean_air_interstate_rule_cair", "EPA Clean Air Interstate Rule (CAIR) for Acid Rain", "News", "2004-2008 (CAIR Rulemaking)", "Energy & Climate", 6,
  "Mandating 70% cuts in sulfur dioxide and nitrogen oxide emissions from 28 eastern states using regional cap-and-trade.",
  "1 = Strengthen Pollution Caps / Impose Direct Facility Limits Instead of Trading", "10 = Support Cost-Effective Market Cap-and-Trade / Shield Coal-Fired Utilities", 2, 8, 7, 1, 8, 1);

add(2004, "2004_alaska_ballot_measure_marijuana", "Alaska Ballot Measure 2 (Re-criminalization vs Legalization)", "News", "2004 (Alaska Cannabis Referendum)", "Civil Rights & Social Issues", 6,
  "Voter referendum on legalizing personal adult marijuana possession up to one ounce in Alaska.",
  "1 = Affirm Privacy Rights & Legalize Adult Possession", "10 = Oppose Ballot Measure / Support Federal and State Drug Enforcement", 3, 7, 1, 1, 8, 1);

add(2004, "2004_california_prop_66_three_strikes", "California Proposition 66 (Three Strikes Law Reform)", "News", "2004 (Early Sentencing Reform)", "Civil Rights & Social Issues", 5,
  "Revising California's Three Strikes Law to require that the third strike be a serious or violent felony to trigger 25-to-life.",
  "1 = Pass Prop 66 to End Cruel Life Sentences for Petty Nonviolent Offenses", "10 = Vote No / Protect Three Strikes to Keep Dangerous Recidivists Incarcerated", 2, 9, 4, 1, 9, 1);

add(2004, "2004_oregon_measure_37_property_takings", "Oregon Measure 37 (Compensation for Land Use Regulations)", "News", "2004 (Property Rights Takings Initiative)", "Energy & Climate", 5,
  "Requiring governments to compensate landowners or waive regulations when zoning or environmental rules reduce property values.",
  "1 = Vote No / Protect Farmland, Forests, and Urban Growth Boundaries", "10 = Vote Yes / Protect Constitutional Private Property Rights Against Government Taking", 2, 9, 10, 1, 10, 1);

add(2004, "2004_fda_antidepressant_black_box_warning", "FDA Black Box Suicide Warnings on Pediatric Antidepressants (SSRIs)", "News", "2004 (Pediatric Drug Safety Crisis)", "Healthcare", 7,
  "Ordering severe 'black box' warnings on SSRI antidepressants regarding increased suicide risks in children and adolescents.",
  "1 = Strict Transparency, Clinical Trial Disclosure, and Patient Protections", "10 = Balance Warnings to Prevent Scaring Patients Away from Needed Psychiatric Care", 2, 7, 4, 1, 7, 1);

add(2004, "2004_voter_suppression_felon_disenfranchisement", "Felon Disenfranchisement Laws in Florida & Ohio Swing States", "Ideological", "1990-2026 (Voting Rights & Restoration Arc)", "Civil Rights & Social Issues", 6,
  "Challenging state laws that permanently strip voting rights from citizens with prior felony convictions.",
  "1 = Automatically Restore Voting Rights Upon Release from Prison", "10 = Maintain State Disenfranchisement / Require Formal Clemency Petitions", 2, 9, 4, 1, 10, 1);

add(2004, "2004_nuclear_proliferation_iran_centrifuges", "Iranian Covert Centrifuges at Natanz & IAEA Inquiries", "News", "2003-2015 (Iranian Nuclear Crisis Arc)", "Foreign Policy & Defense", 3,
  "Responding to discovery of Iran's underground uranium enrichment facility at Natanz and coordinating with EU3 diplomats.",
  "1 = Diplomatic Negotiations, IAEA Inspections, and Economic Sanctions", "10 = Demand Immediate Centrifuge Dismantlement / Preemptive Strike Capabilities", 3, 9, 4, 1, 9, 1);

add(2004, "2004_corporate_tax_manufacturing_deduction", "Section 199 Domestic Production Activities Deduction", "News", "2004-2017 (Manufacturing Tax Relief)", "Economy & Taxation", 6,
  "Enacting a 9% tax deduction for domestic manufacturing income to replace export subsidies ruled illegal by the WTO.",
  "1 = Close Corporate Tax Shelters and Invest Directly in Workers", "10 = Enact Domestic Production Deduction to Keep Factory Jobs in America", 4, 8, 8, 2, 7, 1);

add(2004, "2004_military_recruiting_don_t_ask_don_t_tell", "'Don't Ask, Don't Tell' Enforcement During Wartime", "Ideological", "1993-2011 (DADT Repeal Arc)", "Civil Rights & Social Issues", 5,
  "Discharging over 1,000 service members annually under DADT while the military faces severe combat troop shortages in Iraq.",
  "1 = Repeal DADT / Allow Open Military Service for Gay and Lesbian Troops", "10 = Uphold DADT to Protect Military Unit Cohesion and Morale", 2, 9, 3, 1, 10, 1);

add(2004, "2004_libya_wmd_disarmament", "Libyan WMD Renunciation & Diplomatic Normalization", "News", "2003-2006 (Gaddafi Disarmament Arc)", "Foreign Policy & Defense", 6,
  "Rewarding Muammar Gaddafi's decision to surrender Libya's nuclear weapons equipment by lifting trade and travel sanctions.",
  "1 = Welcome Disarmament as Triumph of Diplomacy and Verified Nonproliferation", "10 = Cite Iraq Invasion as Deterrent Proving Coercive Strength Convinced Gaddafi", 3, 8, 4, 2, 7, 2);

add(2004, "2004_electronic_voting_source_code_scrutiny", "Open-Source Verification of Diebold Touchscreen Voting Code", "News", "2003-2006 (Electronic Voting Crisis)", "Governance & Judiciary", 5,
  "Demanding independent source-code security audits and mandatory paper ballots after security flaws found in Diebold machines.",
  "1 = Mandate Voter-Verified Paper Audit Trails (VVPAT) for Every Touchscreen", "10 = Defend Proprietary Software Security / Modernize Paperless Voting", 2, 8, 3, 1, 8, 1);

add(2004, "2004_cuba_travel_remittance_restrictions", "Bush Executive Tightening of Cuban Family Visits and Remittances", "News", "2004-2008 (Hardline Cuba Rules)", "Foreign Policy & Defense", 7,
  "Restricting Cuban-Americans to visiting family in Cuba only once every three years and capping remittances at $100/month.",
  "1 = Rescind Inhumane Travel Restrictions / Allow Free Family Reunification", "10 = Strictly Enforce Currency Restrictions to Deprive the Castro Regime of Cash", 3, 9, 3, 1, 9, 1);

add(2004, "2004_national_endowment_arts_decency", "Federal NEA Grants & Community Decency Standards", "Ideological", "1989-2010 (Culture Wars Funding Arc)", "Civil Rights & Social Issues", 8,
  "Restricting National Endowment for the Arts grants based on public decency and religious respect criteria.",
  "1 = Protect Artistic Free Expression Without Government Ideological Veto", "10 = Deny Taxpayer Subsidies for Blasphemous or Obscene Artworks", 2, 9, 3, 1, 10, 1);

add(2004, "2004_asbestos_compensation_stalemate", "Fairness in Asbestos Injury Resolution (FAIR) Act Stalemate", "News", "2003-2006 (Asbestos Legislative Gridlock)", "Economy & Taxation", 7,
  "Gridlock over creating a $140 billion no-fault trust fund to resolve hundreds of thousands of asbestos medical claims.",
  "1 = Maintain Victims' Constitutional Right to Trial by Jury in State Courts", "10 = Pass Comprehensive Asbestos Trust to Halt Runaway Bankruptcies", 2, 8, 8, 1, 8, 1);

add(2004, "2004_nuclear_energy_revitalization_incentives", "Federal Loan Guarantees & Production Tax Credits for Nuclear Plants", "Ideological", "2004-2026 (Nuclear Renaissance Arc)", "Energy & Climate", 6,
  "Offering federal loan guarantees, standby insurance, and production tax credits to build the first new U.S. nuclear reactors in 30 years.",
  "1 = Oppose Nuclear Subsidies / Focus Exclusively on Renewables & Efficiency", "10 = Aggressively Expand Clean Baseload Nuclear Power Generation", 4, 9, 7, 1, 8, 1);

add(2004, "2004_third_party_nader_independent_ballot", "Ralph Nader Independent Candidacy & Democratic Ballot Challenges", "News", "2004 (Democratic Anti-Spoiler Battles)", "Governance & Judiciary", 7,
  "Democratic Party lawyers filing multi-state ballot challenges to disqualify independent Ralph Nader from swing state ballots.",
  "1 = Defend Two-Party Integrity Against Well-Funded Third-Party Spoiler Campaigns", "10 = Condemn Ballot Lawfare / Uphold Democratic Voter Choice and Access", 8, 5, 1, 1, 2, 1);

add(2004, "2004_child_tax_credit_permanence", "Child Tax Credit Expansion to $1,000 per Child", "Ideological", "2001-2026 (Family Tax Relief Arc)", "Economy & Taxation", 4,
  "Permanently retaining the expansion of the federal child tax credit to $1,000 and making it partially refundable for working parents.",
  "1 = Make Child Tax Credit Fully Refundable for Lowest-Income Families", "10 = Retain Child Tax Credit as Pro-Family Tax Relief / Block Welfare Expansion", 3, 9, 8, 2, 9, 1);


// =========================================================================
// 2006 (52 Issues)
// =========================================================================
add(2006, "2006_hurricane_katrina_response_failure", "Hurricane Katrina Federal Response Failure & FEMA Reform", "News", "2005-2007 (Katrina Fallout)", "Governance & Judiciary", 1,
  "Investigating the catastrophic federal disaster response, levee breaches in New Orleans, and resignation of FEMA Director Michael Brown.",
  "1 = Full Federal Reconstruction of Gulf Coast / Independent Katrina Commission", "10 = Defend Administration Efforts / Emphasize State and Local Emergency Failures", 2, 9, 5, 1, 8, 1);

add(2006, "2006_iraq_civil_war_stay_the_course", "Iraqi Sectarian Civil War & 'Stay the Course' vs Redeployment", "News", "2005-2008 (Iraq Sectarian Escalation)", "Foreign Policy & Defense", 1,
  "Confronting sectarian civil war after the al-Askari mosque bombing; choosing between phased redeployment or maintaining troop commitments.",
  "1 = Enact Phased Troop Redeployment / Convene Regional Diplomatic Talks", "10 = 'Stay the Course' / Defeat Terrorists in Baghdad Rather Than at Home", 3, 10, 2, 1, 8, 1);

add(2006, "2006_jack_abramoff_lobbying_scandal", "Jack Abramoff Lobbying Corruption Scandal & K Street Ethics", "News", "2005-2007 (K Street Ethics Arc)", "Governance & Judiciary", 1,
  "Prosecuting lobbyist Jack Abramoff for bribing members of Congress with golf trips and campaign cash in exchange for legislative favors.",
  "1 = Comprehensive Lobbying Ban / Close Revolving Door / Ban Corporate Gifts", "10 = Enforce Existing Criminal Laws Against Corrupt Individuals / Protect Free Speech", 2, 8, 6, 1, 8, 1);

add(2006, "2006_sensenbrenner_hr4437_felony_bill", "Sensenbrenner Border Bill (H.R. 4437) Making Undocumented Status a Felony", "News", "2005-2006 (Immigration Polarization Arc)", "Immigration & Border", 1,
  "Passing legislation classifying unlawful presence as a federal felony and criminalizing humanitarian aid to undocumented immigrants.",
  "1 = Reject H.R. 4437 / Provide Pathway to Citizenship for 12 Million Immigrants", "10 = Pass Strict Border Enforcement & Make Unlawful Presence an Aggravated Felony", 2, 10, 3, 1, 10, 1);

add(2006, "2006_mega_marches_day_without_immigrants", "'A Day Without Immigrants' General Strike & Mega-Marches", "News", "2006 (Spring Immigrant Rights Mobilization)", "Immigration & Border", 2,
  "Responding to millions of Latino and immigrant workers striking and marching in major cities waving American and Mexican flags.",
  "1 = Support Workers' Dignity & Pass Comprehensive Immigration Reform", "10 = Condemn Illegal Worker Strikes / Demand Immediate Interior Workplace Raids", 2, 10, 4, 1, 10, 1);

add(2006, "2006_secure_fence_act_700_miles", "Secure Fence Act of 2006 (700 Miles of Double-Layer Fencing)", "News", "2006-2008 (Physical Border Barrier)", "Immigration & Border", 2,
  "Authorizing the construction of 700 miles of reinforced double-layer physical fencing along the southwest border with Mexico.",
  "1 = Oppose Ineffective Border Walls / Invest in Smart Technology and Ports", "10 = Complete 700 Miles of Double-Layer Physical Border Barriers", 3, 9, 6, 1, 10, 1);

add(2006, "2006_federal_minimum_wage_six_for_06", "Raising Federal Minimum Wage from $5.15 to $7.25 ('Six for 06')", "News", "2006-2007 (Democratic 110th Agenda)", "Labor & Welfare", 2,
  "Passing the first federal minimum wage increase in a decade, raising the wage from $5.15 to $7.25 per hour over three years.",
  "1 = Raise to $7.25+ Immediately Without Big Business Tax Giveaways", "10 = Oppose Minimum Wage Increases as Job Killers for Small Businesses", 2, 8, 10, 1, 9, 1);

add(2006, "2006_nsa_warrantless_wiretapping", "NSA Warrantless Wiretapping (Terrorist Surveillance Program)", "News", "2005-2008 (FISA Bypass Scandal)", "Civil Rights & Social Issues", 2,
  "Executive authorization of NSA intercept of domestic-to-foreign communications without warrants from the FISA Foreign Intelligence Court.",
  "1 = Condemn Illegal Warrantless Spying / Enforce Strict FISA Court Compliance", "10 = Defend Inherent Article II Commander-in-Chief Wartime Surveillance Authority", 2, 9, 1, 1, 3, 1);

add(2006, "2006_mark_foley_page_scandal", "Mark Foley Congressional Page Scandal & Leadership Inaction", "News", "2006 (Fall Election Shock)", "Governance & Judiciary", 2,
  "Resignation of Florida Congressman Mark Foley over sexually explicit messages sent to underage teenage congressional pages.",
  "1 = Condemn GOP House Leadership Coverup / Ethics Overhaul", "10 = Hold Foley Personally Accountable / Resist Partisan Exploitation", 2, 8, 6, 2, 9, 1);

add(2006, "2006_military_commissions_act_habeas", "Military Commissions Act of 2006 & Habeas Corpus Stripping", "News", "2006-2008 (Hamdan v. Rumsfeld Response)", "Foreign Policy & Defense", 2,
  "Stripping federal courts of habeas corpus jurisdiction for non-citizen detainees declared unlawful enemy combatants.",
  "1 = Restore Habeas Corpus / Prohibit Waterboarding and Coerced Evidence", "10 = Authorize Military Commissions & Coercive Interrogation Techniques", 2, 9, 1, 1, 8, 1);

add(2006, "2006_gas_prices_3_dollars_oil_profits", "Gasoline Prices Reaching $3.00/Gallon & Oil Windfall Taxes", "News", "2005-2007 (Early Energy Price Spike)", "Energy & Climate", 3,
  "Imposing a federal windfall profits tax on major oil corporations reporting record profits while gas reaches $3.00/gal.",
  "1 = Enact Windfall Profits Tax on Big Oil / Subsidize Clean Energy", "10 = Expand Domestic Drilling / Lower Refining Regulatory Burdens", 2, 9, 10, 1, 9, 1);

add(2006, "2006_stem_cell_enhancement_veto", "Stem Cell Research Enhancement Act & Bush's First Veto", "News", "2006-2007 (First Bush Veto)", "Healthcare", 3,
  "Bush casting the first veto of his presidency to block federal funding for human embryonic stem cell lines derived from discarded IVF embryos.",
  "1 = Override Veto / Expand Federal Funding for Promising Stem Cell Therapies", "10 = Uphold Veto / Prohibit Taxpayer Subsidies for Destroying Human Life", 2, 9, 5, 1, 10, 1);

add(2006, "2006_net_neutrality_telecom_reform", "Net Neutrality Mandate (Communications, Opportunity, Promotion Act)", "News", "2006 (Net Neutrality Genesis)", "Technology & Infrastructure", 3,
  "Barring broadband telecom providers from creating tiered 'fast lanes' or blocking competing web content.",
  "1 = Enact Ironclad Federal Net Neutrality Regulations", "10 = Free Market Broadband / Protect Private Infrastructure Investment", 2, 8, 6, 1, 8, 1);

add(2006, "2006_south_dakota_abortion_ban_referred", "South Dakota Women's Health and Human Life Act (Referred Law 6)", "News", "2006 (Total Abortion Ban Ballot Battle)", "Civil Rights & Social Issues", 3,
  "Voter referendum on a state law banning virtually all abortions without exceptions for rape or incest.",
  "1 = Vote No / Reject Total Abortion Ban and Protect Women's Health", "10 = Vote Yes / Protect Unborn Life with Direct Challenge to Roe v. Wade", 2, 9, 4, 1, 10, 1);

add(2006, "2006_dubai_ports_world_controversy", "Dubai Ports World Acquisition of Six Major U.S. Port Terminals", "News", "2006 (Port Security Controversy)", "Foreign Policy & Defense", 4,
  "Bipartisan congressional resistance forcing a state-owned UAE company to divest ownership of management at six major U.S. ports.",
  "1 = Block Foreign Government Control of Critical National Security Infrastructure", "10 = Support Free International Investment with Friendly Strategic Allies", 3, 6, 8, 2, 9, 2);

add(2006, "2006_missouri_amendment_2_stem_cells", "Missouri Amendment 2 (Constitutional Stem Cell Research Protection)", "News", "2006 (Missouri Stem Cell Ballot Fight)", "Healthcare", 4,
  "Passing a state constitutional amendment protecting all federally permissible stem cell therapies from state criminal bans.",
  "1 = Constitutional Protection for Life-Saving Stem Cell Research", "10 = Oppose Human Cloning and Embryo Destruction", 2, 9, 5, 1, 10, 1);

add(2006, "2006_pension_protection_act_auto_enroll", "Pension Protection Act of 2006 & Automatic 401(k) Enrollment", "News", "2006 (Retirement Reform)", "Labor & Welfare", 5,
  "Encouraging employers to automatically enroll workers in 401(k) plans and tightening defined benefit funding rules.",
  "1 = Strengthen Defined Benefit Union Pensions / Protect PBGC Guarantees", "10 = Promote Automatic Private Savings & Defined Contribution Portability", 3, 8, 9, 2, 7, 1);

add(2006, "2006_subprime_mortgage_early_cracks", "Emerging Subprime Lending Defaults & Exotic ARM Mortgages", "News", "2006 (Early Housing Bubble Tremors)", "Economy & Taxation", 5,
  "Federal regulators issuing guidance on non-traditional mortgage risks as subprime defaults begin rising.",
  "1 = Crack Down on Predatory Subprime Lending & Mandate Affordability", "10 = Promote Homeownership Access / Avoid Heavy-Handed Lending Mandates", 2, 8, 9, 1, 8, 1);

add(2006, "2006_minimum_wage_state_ballots_6_states", "State Minimum Wage Ballot Measures (AZ, CO, MO, MT, NV, OH)", "News", "2006 (Direct Democracy Wage Hikes)", "Labor & Welfare", 4,
  "Voter initiatives in 6 states approving constitutional and statutory minimum wage hikes indexed to inflation.",
  "1 = Support Citizen-Initiated Wage Hikes Indexed to Inflation", "10 = Oppose Constitutional Wage Mandates / Protect Small Business Hiring", 2, 8, 10, 1, 9, 1);

add(2006, "2006_arizona_anti_illegal_immigration_props", "Arizona Propositions 100, 102, 103, 300 (Border Ballot Package)", "News", "2006 (Arizona Anti-Immigrant Ballot Package)", "Immigration & Border", 4,
  "State ballot propositions denying bail for undocumented felony suspects, barring punitive damages, and making English the official language.",
  "1 = Oppose Punitive State Measures / Protect Equal Rights for All Residents", "10 = Pass Strict State Measures to Deter Illegal Immigration and Protect Taxpayers", 2, 10, 4, 1, 10, 1);

add(2006, "2006_alito_supreme_court_confirmation", "Samuel Alito Confirmation to Supreme Court (Replacing Sandra Day O'Connor)", "News", "2006 (Judicial Shift to Right)", "Governance & Judiciary", 3,
  "Confirming conservative jurist Samuel Alito to replace swing Justice Sandra Day O'Connor on the Supreme Court.",
  "1 = Oppose Alito / Defend Reproductive Rights and Executive Power Checks", "10 = Confirm Alito to Restore Strict Constructionism and Constitutional Restraint", 2, 10, 7, 1, 10, 1);

add(2006, "2006_roberts_chief_justice_confirmation", "John Roberts Elevation to Chief Justice", "News", "2005-2006 (Roberts Court Inception)", "Governance & Judiciary", 3,
  "Confirming John Roberts as Chief Justice of the United States following the death of William Rehnquist.",
  "1 = Scrutinize Voting Rights and Civil Rights Record / Oppose Confirmation", "10 = Confirm Highly Qualified Jurist Dedicated to Judicial Modesty ('Calling Balls and Strikes')", 3, 10, 8, 1, 9, 1);

add(2006, "2006_lebanon_israel_war_hezbollah", "2006 Lebanon War & Hezbollah Rocket Offensives", "News", "2006 (34-Day Lebanon Conflict)", "Foreign Policy & Defense", 4,
  "Backing Israel's military offensive in Lebanon against Hezbollah versus demanding an immediate unconditional humanitarian ceasefire.",
  "1 = Immediate Humanitarian Ceasefire & UN Peacekeeping Deployment", "10 = Unconditional Support for Israel to Eradicate Iranian-Backed Hezbollah", 3, 10, 3, 1, 8, 1);

add(2006, "2006_north_korea_first_nuclear_test", "North Korea's First Underground Nuclear Weapons Test", "News", "2006 (North Korean Nuclear Breakout)", "Foreign Policy & Defense", 2,
  "Imposing UN Chapter VII economic sanctions and naval cargo interdiction following Pyongyang's October 2006 nuclear test detonation.",
  "1 = Multi-Party Diplomatic Settlement / Aid in Exchange for Verified Freeze", "10 = Total Economic Blockade, Interdiction, and Enhanced Ballistic Defense", 3, 9, 4, 1, 8, 1);

add(2006, "2006_iraq_study_group_report_baker_hamilton", "Bipartisan Iraq Study Group (Baker-Hamilton Report)", "News", "2006 (Baker-Hamilton Realignment)", "Foreign Policy & Defense", 3,
  "Consensus report recommending phased withdrawal of U.S. combat brigades by 2008 and direct diplomatic engagement with Iran and Syria.",
  "1 = Adopt Iraq Study Group Recommendations in Full / Transition to Training and Diplomacy", "10 = Reject Diplomatic Engagement with Iran/Syria / Increase Troop Levels for Victory", 3, 7, 3, 1, 7, 1);

add(2006, "2006_duke_cunningham_bribery_scandal", "Randy 'Duke' Cunningham Defense Contractor Bribery Scandal", "News", "2005-2006 (Earmark Corruption Wave)", "Governance & Judiciary", 4,
  "Eight-year prison sentence for GOP Congressman accepting $2.4M in yachts, antique furniture, and cash bribes for defense earmarks.",
  "1 = Complete Elimination of Defense Earmarks & Independent Ethics Commission", "10 = Prosecute Corrupt Individuals / Retain Lawful Congressional Power of the Purse", 2, 7, 5, 1, 7, 1);

add(2006, "2006_anwr_drilling_budget_stripping", "Stripping ANWR Drilling from the Defense Appropriations Bill", "News", "2005-2006 (ANWR Final Filibuster)", "Energy & Climate", 4,
  "Senate filibuster successfully removing Ted Stevens' Arctic refuge drilling rider from the mandatory Pentagon spending bill.",
  "1 = Preserve Arctic Wilderness Forever / Keep Drillers Out of ANWR", "10 = Overcome Obstruction to Tap Billions of Barrels of Domestic Arctic Crude", 2, 9, 9, 1, 9, 1);

add(2006, "2006_inconvenient_truth_climate_awakening", "Al Gore's 'An Inconvenient Truth' & Climate Urgency", "News", "2006 (Public Climate Consciousness Spike)", "Energy & Climate", 3,
  "Shifting public climate concern following the theatrical release of Al Gore's global warming documentary film.",
  "1 = Enact Mandatory Federal Carbon Cap-and-Trade & Aggressive Green Subsidies", "10 = Dismiss Exaggerated Climate Alarmism / Protect Cheap Fossil Energy", 2, 9, 8, 1, 10, 1);

add(2006, "2006_don_t_ask_don_t_tell_repeal_momentum", "Military Readiness Strains & Early DADT Repeal Bills", "Ideological", "1993-2011 (DADT Repeal Arc)", "Civil Rights & Social Issues", 5,
  "Introduction of the Military Readiness Enhancement Act to repeal the 1993 ban on openly gay service members.",
  "1 = Repeal DADT / End Wasteful Discharges of Mission-Critical Arab Linguists", "10 = Maintain DADT to Preserve Unit Cohesion in Active War Theaters", 2, 9, 3, 1, 10, 1);

add(2006, "2006_clean_water_rapanos_scotus", "Supreme Court Clean Water Act Ruling (Rapanos v. United States)", "News", "2006 (Significant Nexus Standard)", "Energy & Climate", 5,
  "Justice Anthony Kennedy establishing the 'significant nexus' test for federal wetland jurisdiction, creating nationwide permitting confusion.",
  "1 = Pass Clean Water Authority Restoration Act to Cover All Tributaries and Wetlands", "10 = Restrict Federal Clean Water Act Reach strictly to Navigable In-Fact Waterways", 2, 9, 10, 1, 10, 1);

add(2006, "2006_tom_delay_money_laundering_indictment", "Indictment & Resignation of Majority Leader Tom DeLay ('The Hammer')", "News", "2005-2006 (Texas Redistricting Ethics)", "Governance & Judiciary", 3,
  "House Majority Leader Tom DeLay resigning leadership following Texas state felony indictment for laundering corporate money into state legislative races.",
  "1 = Condemn Systemic Corruption and Corporate Money Laundering in Elections", "10 = Denounce Partisan Political Prosecution by Democratic Texas Prosecutor", 2, 9, 6, 1, 9, 1);

add(2006, "2006_california_global_warming_solutions_ab32", "California Global Warming Solutions Act (AB 32 Cap-and-Trade)", "News", "2006 (State Climate Pioneer)", "Energy & Climate", 4,
  "Governor Arnold Schwarzenegger signing landmark state law capping greenhouse gas emissions at 1990 levels by 2020.",
  "1 = Support California Pioneering Climate Mandate as National Template", "10 = Oppose Job-Destroying Energy Regulations and Manufacturing Flight", 2, 8, 9, 1, 9, 1);

add(2006, "2006_colorado_amendment_44_cannabis", "Colorado Amendment 44 (Legalizing One Ounce of Marijuana)", "News", "2006 (Early Adult-Use Ballot Fight)", "Civil Rights & Social Issues", 5,
  "Statewide citizen initiative to legalize the possession of up to one ounce of marijuana for adults aged 21 and older.",
  "1 = Support Full Adult Cannabis Legalization & Tax Regulation", "10 = Vote No / Protect Communities from Increased Drug Abuse and Crime", 3, 8, 1, 1, 9, 1);

add(2006, "2006_michigan_proposal_2_affirmative_action", "Michigan Proposal 2 (Civil Rights Initiative Banning Affirmative Action)", "News", "2006 (State Affirmative Action Ban)", "Civil Rights & Social Issues", 4,
  "Constitutional amendment banning preferential treatment or affirmative action based on race, sex, or ethnicity in public university admissions.",
  "1 = Vote No / Defend Affirmative Action to Remedy Historical Discrimination", "10 = Vote Yes / Enforce Pure Colorblind Merit in All Public Admissions", 2, 9, 8, 1, 10, 1);

add(2006, "2006_presidential_signing_statements", "Bush Presidential Signing Statements & Unitary Executive Theory", "News", "2005-2008 (Unitary Executive Power Controversy)", "Governance & Judiciary", 3,
  "President Bush issuing hundreds of signing statements asserting constitutional authority to disregard statutory restrictions, such as the McCain Torture Ban.",
  "1 = Condemn Signing Statements as Lawless Executive Nullification of Congress", "10 = Defend Inherent Article II Commander-in-Chief Constitutional Prerogatives", 2, 9, 2, 1, 8, 1);

add(2006, "2006_mccain_torture_ban_detainee_treatment", "McCain Detainee Treatment Act Amendment Banning Cruel Interrogation", "News", "2005-2006 (Anti-Torture Amendment)", "Foreign Policy & Defense", 3,
  "Congressional amendment prohibiting cruel, inhuman, or degrading treatment of any individual in U.S. custody worldwide.",
  "1 = Enforce Absolute Ban on Torture & Waterboarding Without Executive Exceptions", "10 = Support Commander-in-Chief Discretion for Enhanced Interrogations in Extreme Crises", 2, 7, 2, 1, 7, 1);

add(2006, "2006_postal_accountability_enhancement_act", "Postal Accountability and Enhancement Act (PAEA 75-Year Pre-funding)", "News", "2006 (USPS Pension Pre-funding Mandate)", "Labor & Welfare", 6,
  "Mandating the U.S. Postal Service to pre-fund 75 years of future retiree health benefits within a 10-year window.",
  "1 = Protect Postal Workers / Repeal Crippling Pre-Funding Mandate Designed to Starve USPS", "10 = Enforce Fiscal Discipline on Postal Service to Shield Taxpayers from Future Bailouts", 2, 8, 7, 1, 8, 1);

add(2006, "2006_cia_secret_prisons_black_sites", "Bush Formal Admission of CIA Secret Overseas 'Black Sites'", "News", "2006 (Black Sites Disclosure)", "Foreign Policy & Defense", 3,
  "President Bush acknowledging the existence of secret overseas CIA interrogation facilities and transferring 14 high-value detainees to Guantanamo.",
  "1 = Shut Down All Clandestine Black Sites / Ban Rendition and Coercive Interrogation", "10 = Defend Essential Covert Interrogation Operations That Thwarted Imminent Attacks", 2, 9, 2, 1, 8, 1);

add(2006, "2006_south_dakota_referred_law_6_defeat", "South Dakota Voters Reject Total Abortion Ban (56% to 44%)", "News", "2006 (Abortion Ban Defeat)", "Civil Rights & Social Issues", 3,
  "South Dakota electorate defeating a sweeping statutory abortion ban at the ballot box due to lack of rape and incest exceptions.",
  "1 = Defeat Signals Broad Mainstream Consensus Supporting Basic Reproductive Rights", "10 = Regret Defeat / Redraft Model State Bans with Limited Emergency Exceptions", 2, 9, 4, 1, 10, 1);

add(2006, "2006_somalia_ethiopian_intervention_icu", "Ethiopian Military Intervention in Somalia Backed by U.S.", "News", "2006-2009 (Horn of Africa Counterterror)", "Foreign Policy & Defense", 6,
  "Providing U.S. intelligence and special forces air support for Ethiopian troops invading Somalia to oust the Islamic Courts Union.",
  "1 = Oppose Destabilizing Proxy War / Promote Inclusive Somali Reconciliation", "10 = Decisive Action to Prevent al-Qaeda From Establishing Safe Haven in the Horn of Africa", 3, 9, 4, 1, 8, 1);

add(2006, "2006_veterans_affairs_data_theft_laptop", "VA Department Laptop Theft Exposing 26 Million Veterans' Records", "News", "2006 (Massive Federal Data Breach)", "Technology & Infrastructure", 7,
  "Congressional hearings after a stolen VA analyst laptop compromises unencrypted Social Security numbers and disability records of 26.5M veterans.",
  "1 = Mandate Comprehensive Federal Data Encryption & High-Level Privacy Penalties", "10 = Discipline Careless Agency Personnel / Protect Veteran Services Without Excess Red Tape", 2, 7, 4, 1, 7, 1);

add(2006, "2006_trade_deficit_record_760_billion", "U.S. Current Account Trade Deficit Reaching Record $760 Billion", "News", "2005-2007 (Pre-Crash Trade Imbalance Peak)", "Trade & Globalism", 4,
  "Mounting economic concern over America's soaring trade deficit with China and oil-exporting nations.",
  "1 = Enact Aggressive Manufacturing Industrial Policy & Enforce Trade Remedies Against China", "10 = Embrace Consumer Price Savings and Foreign Capital Inflows Financing U.S. Investment", 3, 7, 9, 1, 5, 1);

add(2006, "2006_plame_cia_leak_libby_indictment", "Plame CIA Identity Leak & Perjury Indictment of Scooter Libby", "News", "2005-2007 (Valerie Plame Leak Scandal)", "Governance & Judiciary", 3,
  "Federal Special Counsel Patrick Fitzgerald indicting Vice President Cheney's Chief of Staff Scooter Libby for perjury and obstruction.",
  "1 = Condemn Malicious Retaliatory Outing of Undercover CIA Officer Valerie Plame", "10 = Denounce Overzealous Special Prosecutor Criminalizing Ordinary Washington Press Talks", 2, 9, 4, 1, 8, 1);

add(2006, "2006_student_loan_interest_cuts_proposal", "Cutting Federal Student Loan Interest Rates in Half ('Six for 06')", "News", "2006-2007 (College Cost Reduction Act Precursor)", "Education", 4,
  "Congressional Democratic pledge to cut subsidized Stafford student loan interest rates from 6.8% to 3.4% over five years.",
  "1 = Halve Student Loan Rates & Increase Pell Grants to Expand College Access", "10 = Oppose Subsidizing High College Tuition / Encourage Private Lending Market", 2, 8, 9, 1, 8, 1);

add(2006, "2006_auto_industry_restructuring_ford_way_forward", "Detroit Big Three Automaker Losses & 'Way Forward' Restructuring", "News", "2005-2007 (Pre-Crisis Auto Strains)", "Economy & Taxation", 5,
  "Ford and General Motors cutting tens of thousands of factory jobs and closing assembly plants as high gas prices crush SUV sales.",
  "1 = Provide Federal Transition Assistance & Invest in Next-Gen Hybrid Technologies", "10 = Allow Market Discipline and Labor Concessions to Restore Auto Competitiveness", 3, 7, 9, 1, 6, 1);

add(2006, "2006_federal_reserve_bernanke_rate_pauses", "Ben Bernanke Taking Helm at Federal Reserve & Pausing Rate Hikes at 5.25%", "News", "2006 (Monetary Transition)", "Economy & Taxation", 5,
  "Federal Reserve under newly appointed Chairman Ben Bernanke halting two years of rate hikes at 5.25% as housing begins slowing.",
  "1 = Maintain Monetary Stimulus to Protect Wage Gains & Working Families", "10 = Prioritize Price Stability / Prevent Runaway Inflation and Asset Bubbles", 4, 7, 8, 2, 7, 2);

add(2006, "2006_medicare_part_d_rollout_glitches", "Initial Rollout Glitches & Confusion in Medicare Part D Prescription Plans", "News", "2006 (Part D Implementation)", "Healthcare", 3,
  "Dual-eligible low-income seniors turned away from pharmacies during early months of private Medicare Part D enrollment.",
  "1 = Fix Flawed Rollout / Direct Federal Safety Net Enrollment & Drug Price Caps", "10 = Private Competition Overcoming Initial Friction / Over 75% Senior Satisfaction", 2, 9, 8, 1, 8, 1);

add(2006, "2006_line_item_veto_proposal_bush", "Legislative Line-Item Veto Proposal for Appropriations Earmarks", "News", "2006 (Earmark Reform)", "Governance & Judiciary", 5,
  "Granting the President expedited authority to single out individual congressional pork-barrel spending items for separate up-or-down votes.",
  "1 = Resist Unconstitutional Executive Encroachment on Article I Spending Powers", "10 = Grant President Line-Item Veto to Slash Corrupt Waste and Earmarks", 3, 9, 8, 1, 9, 1);

add(2006, "2006_un_human_rights_council_boycott", "U.S. Refusal to Join Newly Created UN Human Rights Council", "News", "2006 (UN Reform & Boycott)", "Foreign Policy & Defense", 6,
  "Boycotting the reformed UN Human Rights Council over disproportionate anti-Israel resolutions and inclusion of authoritarian regimes.",
  "1 = Engage Multilateral UN Bodies to Advance Universal Human Rights Standards", "10 = Boycott Biased Forum Shielding Human Rights Abusers and Attacking Israel", 3, 9, 5, 1, 10, 1);

add(2006, "2006_minimum_wage_tied_to_estate_tax_cut", "GOP 'Trifecta' Bill Linking Minimum Wage Increase to Estate Tax Repeal", "News", "2006 (Trifecta Bill Showdown)", "Economy & Taxation", 3,
  "House GOP leadership tying a federal minimum wage hike directly to a permanent slash in the federal estate tax on multimillionaires.",
  "1 = Reject Hostage-Taking of Working Wages for Billionaire Tax Giveaways", "10 = Pass Compromise Balancing Small Business Relief with Wage Hikes", 2, 9, 9, 1, 9, 1);

console.log('Bracket 1 total issues (2000, 2002, 2004, 2006):', ISSUES.length);

module.exports = ISSUES;
