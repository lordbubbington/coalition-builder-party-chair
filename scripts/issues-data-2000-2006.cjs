/**
 * scripts/issues-data-2000-2006.cjs
 * Issues dataset for 2000, 2002, 2004, 2006 election cycles.
 */

const ISSUES_2000_2006 = [];

// Helper to push issue
function addIssue(cycle, id, name, type, eraSpan, domain, tier, debate, pole1, pole10, dem, gop, lib, grn, con, soc) {
  ISSUES_2000_2006.push({
    cycle, id, name, type, eraSpan, domain, tier, debate, pole1, pole10,
    stances: { dem, gop, lib, grn, con, soc }
  });
}

// ==========================================
// CYCLE 2000 (55 Issues)
// ==========================================
addIssue(2000, "2000_budget_surplus_allocation", "Federal Budget Surplus Allocation", "News", "1998-2002 (Surplus Window)", "Economy & Taxation", 1,
  "Whether to return the projected $2.2 trillion federal budget surplus via broad income tax cuts or dedicate it to debt reduction and Social Security.",
  "1 = 100% Debt Paydown / Social Security Lockbox / Public Investment", "10 = 100% Across-the-board Tax Cuts to Shrink Government",
  3, 9, 10, 2, 8, 1);

addIssue(2000, "2000_social_security_privatization", "Social Security Private Investment Carve-Outs", "Ideological", "1980-2030 (Conservative/Entitlement Arc)", "Economy & Taxation", 1,
  "Allowing younger workers to divert 2 percentage points of payroll taxes into private stock and bond investment accounts.",
  "1 = Maintain Defined-Benefit Government Trust Fund", "10 = Full Individual Market Carve-outs & Privatization",
  2, 8, 10, 1, 9, 1);

addIssue(2000, "2000_patients_bill_of_rights", "Patients' Bill of Rights & HMO Lawsuit Liability", "News", "1998-2002 (Managed Care Reform Arc)", "Healthcare", 2,
  "Granting insured patients statutory authority to sue HMOs in state courts for injury caused by denial of medical claims.",
  "1 = Universal Right to Sue HMOs / Single-Payer Healthcare", "10 = Shield Insurers / Federal Tort Immunity & Damage Caps",
  3, 8, 9, 1, 8, 1);

addIssue(2000, "2000_partial_birth_abortion_ban", "Partial-Birth Abortion Ban Act", "Ideological", "1973-2024 (Abortion Jurisprudence Arc)", "Civil Rights & Social Issues", 2,
  "Banning late-term intact dilation and extraction abortion procedures without a maternal health exception clause.",
  "1 = Full Reproductive Autonomy / Veto Ban Lacking Health Exception", "10 = Absolute Federal Ban / Constitutional Fetal Personhood",
  3, 9, 5, 1, 10, 1);

addIssue(2000, "2000_national_missile_defense", "National Missile Defense & ABM Treaty Withdrawal", "Ideological", "1983-2020 (Strategic Defense Arc)", "Foreign Policy & Defense", 2,
  "Deploying a national ballistic missile interceptor shield even if it necessitates abrogating the 1972 ABM Treaty with Russia.",
  "1 = Uphold Arms Control Treaties / Prohibit Space & Missile Shields", "10 = Unilateral ABM Withdrawal / Rapid Interceptor Deployment",
  4, 9, 6, 1, 10, 1);

addIssue(2000, "2000_china_pntr_wto", "China Permanent Normal Trade Relations (PNTR)", "News", "1999-2002 (Globalization Consensus Arc)", "Trade & Globalism", 2,
  "Granting China permanent normal trade relations status to facilitate its entry into the World Trade Organization.",
  "1 = Reject PNTR / Impose Strict Human Rights & Labor Conditionality", "10 = Unconditional Free Trade Accession & Market Integration",
  6, 8, 9, 1, 2, 1);

addIssue(2000, "2000_campaign_finance_mccain_feingold", "Soft Money Ban & Bipartisan Campaign Finance Reform", "Ideological", "1974-2010 (Pre-Citizens United Arc)", "Governance & Judiciary", 3,
  "Banning unregulated corporate, union, and individual soft-money donations to national political party committees.",
  "1 = Public Campaign Financing / Total Corporate Contribution Ban", "10 = Full Contribution Deregulation / Political Spending is Free Speech",
  3, 8, 10, 1, 9, 1);

addIssue(2000, "2000_gun_show_loophole_brady", "Gun Show Background Checks & Assault Weapons Ban Renewal", "Ideological", "1968-2026 (Gun Control Arc)", "Civil Rights & Social Issues", 3,
  "Closing the private sale 'gun show loophole' and renewing the 1994 federal prohibition on semiautomatic assault weapons.",
  "1 = Universal Background Registry / Ban Semiautomatic Firearms", "10 = Unrestricted Second Amendment / Repeal All Federal Gun Laws",
  3, 8, 10, 2, 10, 2);

addIssue(2000, "2000_school_vouchers_title_i", "Federal School Vouchers & Private School Choice", "Ideological", "1980-2026 (School Choice Arc)", "Education", 3,
  "Allowing federal Title I funds to follow students to private, parochial, or charter schools of their choice.",
  "1 = 100% Dedicated Public School Funding / Ban Vouchers", "10 = Universal Taxpayer-Funded Private School Vouchers",
  3, 8, 10, 2, 10, 1);

addIssue(2000, "2000_anwr_drilling", "Arctic National Wildlife Refuge (ANWR) Oil Drilling", "Ideological", "1980-2020 (Energy Exploration Arc)", "Energy & Climate", 3,
  "Authorizing oil and natural gas exploration and commercial leasing in the coastal plain of Alaska's ANWR.",
  "1 = Permanent Wilderness Protection / Zero Fossil Fuel Leasing", "10 = Immediate Full Oil & Gas Exploration Leasing",
  3, 9, 9, 1, 9, 1);

addIssue(2000, "2000_kyoto_protocol", "Kyoto Protocol International Climate Treaty", "News", "1997-2005 (Kyoto Framework Arc)", "Energy & Climate", 3,
  "Submitting the Kyoto greenhouse gas emissions reduction treaty to the Senate for formal ratification.",
  "1 = Immediate Ratification & Strict Binding Emission Caps", "10 = Total Rejection / Shield American Industry from Global Treaties",
  3, 9, 9, 1, 10, 1);

addIssue(2000, "2000_estate_tax_death_tax_repeal", "Federal Estate & Gift Tax ('Death Tax') Repeal", "Ideological", "1990-2026 (Wealth Taxation Arc)", "Economy & Taxation", 4,
  "Permanently abolishing the federal estate tax levied on asset transfers from deceased high-net-worth estates.",
  "1 = Highly Progressive Wealth & Inheritance Taxation", "10 = Complete and Permanent Abolition of Estate Tax",
  3, 9, 10, 1, 10, 1);

addIssue(2000, "2000_faith_based_initiatives", "Faith-Based Social Service Grants ('Charitable Choice')", "Ideological", "1996-2016 (Faith-Based Welfare Arc)", "Labor & Welfare", 4,
  "Allowing religious and church organizations to compete directly for federal social welfare grants while preserving religious hiring.",
  "1 = Strict Separation of Church and State / No Faith Grants", "10 = Broad Federal Funding of Religious Charities & Missions",
  4, 9, 7, 2, 10, 1);

addIssue(2000, "2000_marriage_penalty_tax_relief", "Marriage Tax Penalty Equalization", "News", "1998-2003 (Tax Code Modernization)", "Economy & Taxation", 4,
  "Doubling standard deduction and 15% bracket thresholds for married couples filing jointly to eliminate penalty.",
  "1 = Retain Existing Code / Focus Relief on Lower-Income Families", "10 = Complete Equalization / Pro-Family Tax Incentives",
  5, 9, 8, 4, 10, 2);

addIssue(2000, "2000_same_sex_marriage_bans_prop22", "State Constitutional Bans on Same-Sex Marriage (CA Prop 22)", "Ideological", "1996-2015 (Marriage Equality Arc)", "Civil Rights & Social Issues", 5,
  "Enacting state constitutional amendments defining marriage exclusively as a legal union between one man and one woman.",
  "1 = Complete Marriage Equality & Federal Civil Rights Protections", "10 = Constitutional Prohibition of Same-Sex Marriage & Civil Unions",
  4, 9, 3, 1, 10, 1);

addIssue(2000, "2000_medical_marijuana_legalization", "State Medical Cannabis Legalization Measures", "Ideological", "1996-2026 (Cannabis Reform Arc)", "Civil Rights & Social Issues", 5,
  "Authorizing state-licensed medical marijuana dispensaries for patients with physician recommendations.",
  "1 = Complete Federal Decriminalization & Legalization", "10 = Strict Federal Prohibition & Drug Enforcement Raids",
  4, 8, 1, 1, 8, 1);

addIssue(2000, "2000_elian_gonzalez_cuba_policy", "Elián González Custody Raid & Cuba Embargo", "News", "1999-2001 (Elián Crisis)", "Foreign Policy & Defense", 6,
  "Federal armed raid returning Cuban shipwreck boy Elián González to his father in Cuba versus political asylum.",
  "1 = Normalize Relations / Respect Parental Custody in Cuba", "10 = Grant Political Asylum / Enforce Strict Anti-Castro Embargo",
  4, 9, 6, 2, 9, 1);

addIssue(2000, "2000_california_electricity_crisis", "California Electricity Crisis & Wholesale Price Caps", "News", "2000-2002 (Power Deregulation Crisis)", "Energy & Climate", 6,
  "Imposing emergency federal price caps on wholesale electricity marketers to halt rolling blackouts and Enron gouging.",
  "1 = Emergency Federal Price Caps / Re-regulate Public Utilities", "10 = Pure Market Pricing / Resist Federal Price Controls",
  3, 8, 10, 1, 8, 1);

addIssue(2000, "2000_scalia_originalism_judicial_picks", "Supreme Court Judicial Appointments & Strict Constructionism", "Ideological", "1980-2026 (Federal Judiciary Arc)", "Governance & Judiciary", 7,
  "Pledging to appoint federal judges in the originalist mold of Antonin Scalia and Clarence Thomas.",
  "1 = Living Constitution / Protect Liberal Judicial Precedents", "10 = Strict Originalism & Textualism / Overturn Roe v. Wade",
  2, 9, 7, 1, 10, 1);

addIssue(2000, "2000_corporate_duopoly_nader", "Third-Party Ballot Access & Presidential Debate Inclusion", "Ideological", "1992-2026 (Electoral Reform Arc)", "Governance & Judiciary", 8,
  "Lowering the Commission on Presidential Debates 15% polling threshold to admit independent and third-party nominees.",
  "1 = Open Debates / Ranked Choice Voting / Easy Ballot Access", "10 = Protect Two-Party Stability / Enforce Strict Thresholds",
  7, 8, 1, 1, 1, 1);

addIssue(2000, "2000_anti_sweatshop_globalization", "Anti-Sweatshop Campaign & Trade Accord Labor Standards", "Ideological", "1995-2015 (Anti-Corporate Globalization)", "Trade & Globalism", 8,
  "Mandating enforceable labor rights and environmental protections in all international bilateral and multilateral trade pacts.",
  "1 = Mandatory Living Wage & Union Rights in All Trade Accords", "10 = Free Market Trade Without Social Clause Mandates",
  4, 8, 9, 1, 6, 1);

addIssue(2000, "2000_napster_copyright_dmca", "Digital Millennium Copyright Act Enforcement Against Napster", "News", "1998-2004 (Digital IP Wars)", "Technology & Infrastructure", 9,
  "Enforcing federal copyright infringement injunctions and statutory damages to shut down peer-to-peer MP3 file-sharing networks.",
  "1 = Open Internet / Broad Fair Use / Decriminalize File Sharing", "10 = Strict IP Enforcement & Digital Rights Management Mandates",
  6, 7, 4, 2, 8, 1);

addIssue(2000, "2000_electoral_college_legitimacy", "Abolition of the Electoral College via Amendment", "Ideological", "1800-2026 (Constitutional Electoral Arc)", "Governance & Judiciary", 10,
  "Replacing the Electoral College system with direct national popular election of the President after Bush v. Gore.",
  "1 = Direct National Popular Vote Constitutional Amendment", "10 = Preserve Electoral College Federalism & State Power",
  2, 9, 6, 1, 10, 1);

addIssue(2000, "2000_yucca_mountain_nuclear_waste", "Yucca Mountain Nuclear Waste Repository Designation", "Ideological", "1987-2015 (Nuclear Waste Arc)", "Energy & Climate", 5,
  "Designating Yucca Mountain, Nevada as the sole federal deep-geological repository for commercial spent fuel rods.",
  "1 = Respect Nevada State Sovereignty / Cancel Facility", "10 = Federal Preemption / Rapidly Open Nuclear Waste Site",
  4, 8, 5, 1, 8, 1);

addIssue(2000, "2000_death_penalty_moratorium", "Capital Punishment Moratorium & Post-Conviction DNA Testing", "Ideological", "1972-2026 (Capital Punishment Arc)", "Civil Rights & Social Issues", 6,
  "Imposing a federal moratorium on executions pending review of wrongful capital convictions and racial disparities.",
  "1 = Complete Abolition of Capital Punishment", "10 = Expedite Death Row Appeals & Retain Capital Punishment",
  4, 9, 5, 1, 10, 1);

addIssue(2000, "2000_fda_tobacco_regulation", "FDA Regulatory Jurisdiction Over Cigarettes & Tobacco", "News", "1996-2009 (Tobacco Wars)", "Healthcare", 7,
  "Granting the FDA explicit statutory authority to restrict cigarette marketing to minors and regulate nicotine content.",
  "1 = Comprehensive Federal Tobacco & Nicotine Marketing Controls", "10 = Prohibit FDA Regulation / Protect Commercial Speech",
  3, 8, 10, 1, 8, 1);

addIssue(2000, "2000_affirmative_action_higher_ed", "Race-Conscious Affirmative Action in College Admissions", "Ideological", "1978-2023 (Affirmative Action Arc)", "Civil Rights & Social Issues", 4,
  "Using race as an individualized factor in university admissions to achieve campus diversity and social mobility.",
  "1 = Defend & Expand Race-Conscious Remedial Admissions", "10 = Complete Ban on Race Consideration / Pure Colorblindness",
  2, 9, 8, 1, 10, 1);

addIssue(2000, "2000_welfare_work_requirements", "1996 Welfare Reform Reauthorization & Work Participation", "Ideological", "1996-2026 (Welfare Conditionality Arc)", "Labor & Welfare", 4,
  "Requiring TANF cash assistance recipients to engage in at least 30-40 hours per week of verified work activities.",
  "1 = Abolish Work Sanctions / Guarantee Universal Basic Income", "10 = Strict 40-Hour Work Rules / Cut Inactive Recipients",
  5, 9, 9, 1, 10, 1);

addIssue(2000, "2000_military_readiness_pay", "Pentagon Readiness Reinvestment & Military Pay Raise", "News", "1998-2004 (Readiness Rebound)", "Foreign Policy & Defense", 6,
  "Approving emergency defense appropriations to overhaul military equipment depots and boost troop pay and housing allowances.",
  "1 = Reallocate Military Spending to Healthcare & Schools", "10 = Major Defense Reinvestment & Weapons Modernization",
  5, 9, 4, 1, 9, 1);

addIssue(2000, "2000_firestone_tire_safety_recalls", "Criminal Penalties for Defective Auto Safety (TREAD Act)", "News", "2000-2002 (Rollover Safety Crisis)", "Technology & Infrastructure", 7,
  "Enacting federal criminal penalties for auto executives concealing fatal tire and rollover defects.",
  "1 = Severe Corporate Criminal Penalties & Mandatory Sensor Tech", "10 = Industry Self-Policing / Shield Corporate Executives",
  3, 7, 9, 1, 8, 1);

addIssue(2000, "2000_vieques_puerto_rico_bombing", "Cessation of U.S. Navy Live-Fire Drills on Vieques Island", "News", "1999-2003 (Vieques Civil Disobedience)", "Foreign Policy & Defense", 8,
  "Ceasing all live-fire artillery bombardments and naval training exercises on Puerto Rico's populated island of Vieques.",
  "1 = Immediate Military Withdrawal & Comprehensive Environmental Cleanup", "10 = Essential National Readiness / Continue Navy Exercises",
  4, 8, 6, 1, 8, 1);

addIssue(2000, "2000_section_245i_immigration", "Section 245(i) Adjustment of Undocumented Immigrant Status", "News", "1998-2002 (Pre-9/11 Border Reform Arc)", "Immigration & Border", 6,
  "Allowing undocumented workers sponsored by families or employers to pay a $1,000 fine and adjust status in the U.S.",
  "1 = Broad Legalization & Pathway to Citizenship", "10 = Strict Deportation / Enforce 10-Year Unlawful Presence Bars",
  3, 8, 3, 1, 10, 1);

addIssue(2000, "2000_columbine_mental_health_schools", "School Security Hardening vs. Gun Control Post-Columbine", "News", "1999-2004 (Post-Columbine Security)", "Education", 5,
  "Deploying armed School Resource Officers and metal detectors versus restricting firearm magazine capacities.",
  "1 = Ban Assault Weapons & High-Capacity Magazines / Fund Counselors", "10 = Hardened Security, Armed Guards & Zero Tolerance Discipline",
  4, 8, 7, 2, 9, 1);

addIssue(2000, "2000_federal_minimum_wage_hike", "Federal Minimum Wage Increase Above $5.15/Hour", "Ideological", "1938-2026 (Minimum Wage Arc)", "Labor & Welfare", 3,
  "Raising the federal minimum wage by $1.00 to $6.15 per hour over two years.",
  "1 = Raise to Living Wage ($10+/hr) / Index to Inflation", "10 = Freeze or Abolish the Federal Minimum Wage",
  2, 8, 10, 1, 9, 1);

addIssue(2000, "2000_impeachment_morality_backlash", "Presidential Ethics Standards & Executive Conduct Standards", "News", "1998-2001 (Post-Impeachment Backlash)", "Governance & Judiciary", 3,
  "Demanding a restoration of 'honor and dignity' in the White House following the Clinton impeachment trial.",
  "1 = Partisan Witch Hunt / Private Personal Conduct", "10 = Condemn Perjury / Demand Absolute Moral Standard in Office",
  3, 9, 6, 4, 10, 2);

addIssue(2000, "2000_microsoft_antitrust_breakup", "DOJ Antitrust Action & Structural Breakup of Microsoft", "News", "1998-2002 (Tech Monopoly Antitrust)", "Economy & Taxation", 5,
  "Court-ordered split of Microsoft into two distinct companies for operating systems and office software.",
  "1 = Enforce Aggressive Structural Breakup & Interoperability", "10 = Free Market Competition / End Government Antitrust Interference",
  3, 8, 10, 1, 7, 1);

addIssue(2000, "2000_cuba_embargo_agricultural_sales", "Agricultural & Medical Sanctions Carve-Outs for Cuba", "News", "1999-2003 (Sanctions Relief)", "Trade & Globalism", 7,
  "Allowing U.S. agricultural and pharmaceutical producers to sell goods to Cuba on a cash-only basis.",
  "1 = Lift the Cuban Embargo Completely and Unconditionally", "10 = Maintain Ironclad Embargo Until Castro Is Ousted",
  4, 7, 2, 1, 8, 1);

addIssue(2000, "2000_endangered_species_property_rights", "Endangered Species Act Compensation for Landowners", "Ideological", "1973-2026 (Property Rights / Conservation)", "Energy & Climate", 7,
  "Requiring federal cash compensation to private landowners when ESA habitat rules diminish property values.",
  "1 = Uncompromised Habitat Protection Over Private Development", "10 = Full Fifth Amendment Takings Compensation for Landowners",
  3, 9, 10, 1, 10, 1);

addIssue(2000, "2000_clean_air_particulate_soot_rules", "EPA Soot & Fine Particulate Ambient Air Standards", "Ideological", "1970-2026 (Clean Air Regulation Arc)", "Energy & Climate", 6,
  "Defending EPA's strict 1997 PM2.5 particulate and ozone standards in court against trucking and utility challenges.",
  "1 = Public Health Primacy / Enforce Stringent Pollution Reductions", "10 = Require Cost-Benefit Balancing / Prevent Industrial Burdens",
  2, 8, 9, 1, 9, 1);

addIssue(2000, "2000_hate_crimes_prevention_act", "Federal Hate Crimes Expansion for Sexual Orientation", "Ideological", "1998-2009 (Hate Crimes Legislation)", "Civil Rights & Social Issues", 4,
  "Expanding federal hate crime law to protect victims targeted for actual or perceived sexual orientation.",
  "1 = Comprehensive Federal Civil Rights & Hate Crime Protections", "10 = Reject 'Thought Crimes' / Rely Solely on State Violent Crime Laws",
  2, 9, 6, 1, 10, 1);

addIssue(2000, "2000_colombia_aid_plan_colombia", "Plan Colombia Military Counternarcotics Aid Package", "News", "2000-2008 (Andean Counternarcotics)", "Foreign Policy & Defense", 6,
  "Appropriating $1.3 billion in attack helicopters and military training to eradicate Colombian coca plantations.",
  "1 = Halt Foreign Drug War Militarization / Condition on Human Rights", "10 = Aggressive Military Interdiction & Aerial Herbicide Eradication",
  5, 9, 6, 1, 8, 1);

addIssue(2000, "2000_space_shuttle_iss_funding", "International Space Station Construction Outlays", "Ideological", "1993-2011 (ISS Construction Era)", "Technology & Infrastructure", 8,
  "Appropriating multibillion-dollar funding to sustain Space Shuttle assembly flights to the orbital station.",
  "1 = Redirect Manned Spaceflight Budget to Earth Science & Poverty", "10 = Fully Fund NASA Exploration & American Aerospace Leadership",
  5, 8, 5, 3, 7, 2);

addIssue(2000, "2000_water_infrastructure_everglades", "Comprehensive Everglades Ecosystem Restoration Plan", "Ideological", "2000-2026 (Ecological Restoration Arc)", "Energy & Climate", 6,
  "Authorizing an $8 billion 30-year state-federal plan to capture freshwater runoff and restore the Everglades wetlands.",
  "1 = Aggressive Federal Wetland Ecosystem Restoration", "10 = Protect Agricultural Sugar Producers / Limit Federal Land Acquisition",
  3, 6, 7, 1, 7, 1);

addIssue(2000, "2000_agricultural_emergency_bailouts", "Emergency Market Loss Assistance for Commodity Growers", "News", "1998-2002 (Depressed Commodity Crisis)", "Economy & Taxation", 7,
  "Providing $7.1 billion in direct taxpayer relief to grain and oilseed farmers suffering from record-low commodity prices.",
  "1 = Transition to Sustainable Farming Support / Cap Big Ag Subsidies", "10 = Full Disaster Relief for Commercial Grain & Cotton Growers",
  5, 8, 9, 3, 6, 3);

addIssue(2000, "2000_internet_sales_tax_moratorium", "Internet Tax Freedom Act & Online Sales Tax Moratorium", "News", "1998-2018 (E-Commerce Tax Moratorium)", "Technology & Infrastructure", 6,
  "Barring state and municipal governments from imposing sales taxes on out-of-state online commercial purchases.",
  "1 = Level Playing Field / Require Online Retailers to Collect State Sales Taxes", "10 = Permanent Ban on Internet Sales Taxes",
  5, 9, 10, 4, 9, 2);

addIssue(2000, "2000_nuclear_test_ban_ctbt", "Comprehensive Nuclear-Test-Ban Treaty (CTBT) Ratification", "Ideological", "1996-2026 (Nonproliferation Arc)", "Foreign Policy & Defense", 5,
  "Reconsidering Senate ratification of the global treaty banning all explosive nuclear weapons tests.",
  "1 = Ratify CTBT / Lead Global Nonproliferation", "10 = Retain Right to Test / Maintain U.S. Deterrent Reliability",
  3, 9, 4, 1, 10, 1);

addIssue(2000, "2000_drug_importation_canada", "Prescription Drug Reimportation From Licensed Canadian Pharmacies", "Ideological", "2000-2024 (Drug Pricing Arc)", "Healthcare", 4,
  "Legalizing wholesale importation of FDA-approved prescription medications from price-controlled Canadian pharmacies.",
  "1 = Authorize Reimportation / Impose Direct Federal Drug Price Caps", "10 = Bar Reimportation / Protect Drug Safety & Patent R&D Incentives",
  3, 8, 4, 1, 7, 1);

addIssue(2000, "2000_head_start_reauthorization", "Federal Head Start Early Childhood Education Expansion", "Ideological", "1965-2026 (Early Childhood Welfare)", "Education", 7,
  "Expanding federal appropriations for Head Start preschool programs versus converting funds into state block grants.",
  "1 = Universal Federal Pre-K & Full Head Start Funding", "10 = Convert to State Block Grants / Eliminate Federal Department of Education",
  2, 8, 10, 1, 10, 1);

addIssue(2000, "2000_labor_ergonomics_standards", "OSHA Workplace Ergonomics Repetitive Strain Rule", "News", "1999-2001 (OSHA Ergonomics Battle)", "Labor & Welfare", 7,
  "Promulgating binding federal workplace safety standards requiring employers to adjust equipment to prevent repetitive strain injuries.",
  "1 = Enforce Binding OSHA Ergonomics Rules for All Workers", "10 = Repeal Ergonomics Rule / Protect Employers from Compliance Mandates",
  2, 9, 10, 1, 9, 1);

addIssue(2000, "2000_cuba_wet_foot_dry_foot", "'Wet Foot, Dry Foot' Cuban Refugee Interdiction Policy", "Ideological", "1995-2017 (Cuban Adjustment Arc)", "Immigration & Border", 8,
  "Repatriating Cubans intercepted at sea while granting green cards to those reaching dry land.",
  "1 = Equal Asylum Rules for All Nationalities / End Special Preference", "10 = Protect Anti-Communist Dissidents Reaching U.S. Soil",
  4, 8, 5, 2, 8, 1);

addIssue(2000, "2000_usda_organic_standards", "National USDA Organic Certification Standards & GMOs", "News", "1997-2002 (Organic Rulemaking)", "Agriculture & Food", 8,
  "Banning genetically modified organisms, irradiation, and sewage sludge from the USDA Organic label.",
  "1 = Strict Organic Purity / Mandatory GMO Disclosure", "10 = Flexible Agribusiness Definitions / Scientific Equivalence",
  3, 7, 6, 1, 7, 1);

addIssue(2000, "2000_defense_of_marriage_act_enforcement", "Defense of Marriage Act (DOMA) Federal Enforcement", "Ideological", "1996-2013 (DOMA Federal Arc)", "Civil Rights & Social Issues", 3,
  "Enforcing Section 3 of DOMA to bar federal recognition or spousal benefits for legally married gay couples.",
  "1 = Repeal DOMA / Grant Full Federal Equal Rights", "10 = Defend DOMA / Federal Statutory Ban on Same-Sex Marriage",
  4, 9, 4, 1, 10, 1);

addIssue(2000, "2000_imf_world_bank_structural_adjustment", "IMF/World Bank Structural Adjustment Loans & Austerity", "Ideological", "1980-2015 (Washington Consensus Arc)", "Trade & Globalism", 6,
  "Conditioning international loans on developing countries privatizing water, power, and cutting domestic subsidies.",
  "1 = Abolish IMF Structural Adjustment / Cancel Developing Debt", "10 = Enforce Fiscal Austerity & Market Discipline",
  4, 8, 7, 1, 8, 1);

addIssue(2000, "2000_puerto_rico_status_referendum", "Puerto Rico Statehood Plebiscite & Self-Determination", "Ideological", "1952-2026 (Territorial Status Arc)", "Governance & Judiciary", 8,
  "Authorizing a federally binding status plebiscite offering Statehood, Independence, or Free Association.",
  "1 = Immediate Decolonization / Statehood or Independence", "10 = Maintain Current Commonwealth / Resist 51st Statehood",
  4, 7, 5, 1, 8, 1);

addIssue(2000, "2000_tribal_gaming_compacts", "Native American Tribal Casino Compacts (CA Prop 1A)", "News", "1998-2004 (Indian Gaming Expansion)", "Civil Rights & Social Issues", 7,
  "Granting sovereign Native American tribes exclusive rights to operate slot machines on reservation trust lands.",
  "1 = Uphold Tribal Sovereignty & Exclusive Gaming Compacts", "10 = Regulate and Tax Tribal Gaming Under State Gambling Codes",
  3, 6, 4, 2, 7, 2);


// ==========================================
// CYCLE 2002 (55 Issues)
// ==========================================
addIssue(2002, "2002_iraq_war_aumf", "Authorization for Use of Military Force Against Iraq (AUMF)", "News", "2002-2011 (Iraq War Arc)", "Foreign Policy & Defense", 1,
  "Authorizing the President to use armed forces against Iraq to enforce UN Security Council resolutions regarding WMDs.",
  "1 = Oppose Military Action / Pursue UN Weapons Inspections & Multilateral Diplomacy", "10 = Broad Executive Authority for Preemptive Military Regime Change",
  5, 10, 2, 1, 8, 1);

addIssue(2002, "2002_homeland_security_act_civil_service", "Department of Homeland Security (DHS) & Civil Service Rules", "News", "2001-2004 (Post-9/11 Reorganization)", "Governance & Judiciary", 1,
  "Consolidating 22 agencies into DHS while granting the President authority to waive union civil service rules for national security.",
  "1 = Protect Federal Union Bargaining & Whistleblower Protections", "10 = Full Presidential Exemption from Civil Service Rules for National Security",
  3, 9, 7, 2, 8, 1);

addIssue(2002, "2002_usa_patriot_act_surveillance", "USA PATRIOT Act & Domestic Surveillance Authorities", "News", "2001-2015 (Patriot Act Sunset Arc)", "Civil Rights & Social Issues", 1,
  "Expanding federal wiretapping, sneak-and-peek search warrants, and National Security Letters without judicial warrants.",
  "1 = Repeal Patriot Act / Restore Strict Fourth Amendment Warrant Rules", "10 = Maximum Counterterrorism Powers / Unfettered Surveillance Authority",
  4, 9, 1, 1, 2, 1);

addIssue(2002, "2002_sarbanes_oxley_accounting_reform", "Sarbanes-Oxley Act (SOX) & Corporate Governance Reform", "News", "2001-2006 (Enron/WorldCom Aftermath)", "Economy & Taxation", 2,
  "Mandating strict criminal liability for corporate executives certifying fraudulent books and creating PCAOB auditor oversight.",
  "1 = Strict Corporate Criminal Penalties & Structural Wall Street Regulation", "10 = Minimize Regulatory Compliance Costs / Protect Free Enterprise",
  2, 6, 9, 1, 7, 1);

addIssue(2002, "2002_tsa_airport_security_federalization", "Federalization of Airport Security Screeners (TSA Creation)", "News", "2001-2005 (Aviation Security Overhaul)", "Technology & Infrastructure", 2,
  "Replacing private contract airport screeners with federal civil service personnel under the Transportation Security Administration.",
  "1 = 100% Federalized Government Security Workforce with Union Rights", "10 = Private Competitive Airport Screeners Under Federal Oversight",
  2, 7, 9, 2, 8, 1);

addIssue(2002, "2002_bush_tax_cuts_permanence_egtrra", "Making the 2001 Bush Tax Cuts (EGTRRA) Permanent", "Ideological", "2001-2012 (Bush Tax Cut Debates)", "Economy & Taxation", 2,
  "Permanently enacting the 2001 income tax bracket reductions, child tax credits, and estate tax phaseouts beyond 2010.",
  "1 = Repeal Tax Cuts on Top Earners / Rebalance Federal Budget", "10 = Permanently Lock In All Tax Cuts Across All Brackets",
  3, 10, 10, 1, 9, 1);

addIssue(2002, "2002_no_child_left_behind_testing", "No Child Left Behind Mandated Testing & Annual Yearly Progress", "News", "2001-2015 (NCLB Accountability Era)", "Education", 2,
  "Mandating statewide annual testing in reading and math for grades 3-8 and restructuring persistently failing schools.",
  "1 = Fully Fund Federal Education Grants / Abolish High-Stakes Standardized Testing", "10 = Enforce Strict School Accountability & Voucher Restructuring",
  4, 8, 9, 1, 9, 1);

addIssue(2002, "2002_steel_import_tariffs_bush", "Bush 30% Protective Steel Import Safeguard Tariffs", "News", "2002-2004 (Temporary Safeguard Tariffs)", "Trade & Globalism", 3,
  "Imposing temporary 8% to 30% tariffs on imported steel to protect domestic manufacturing in Ohio, Pennsylvania, and West Virginia.",
  "1 = Support Industrial Union Workers Against Foreign Subsidized Dumping", "10 = Free Market Free Trade / Eliminate Retaliatory Trade Distortions",
  4, 6, 10, 3, 4, 2);

addIssue(2002, "2002_guantanamo_enemy_combatants", "Guantanamo Bay Indefinite Detention & Enemy Combatant Status", "Ideological", "2002-2026 (Post-9/11 Detention Jurisprudence)", "Foreign Policy & Defense", 3,
  "Holding suspected foreign terrorists indefinitely at Guantanamo Bay without access to civilian courts or Geneva protections.",
  "1 = Close Guantanamo / Grant Full Habeas Corpus & Article III Civilian Trials", "10 = Indefinite Military Detention of Unlawful Enemy Combatants",
  3, 10, 2, 1, 8, 1);

addIssue(2002, "2002_fast_track_trade_promotion", "Trade Promotion Authority ('Fast-Track') Renewal", "Ideological", "1974-2021 (Trade Authority Arc)", "Trade & Globalism", 3,
  "Granting the President expedited authority to negotiate trade agreements that Congress can only vote up or down without amendment.",
  "1 = Preserve Congressional Amendment Rights / Mandate Labor-Climate Standards", "10 = Expedited Executive Authority to Expand Global Market Access",
  3, 8, 8, 1, 3, 1);

addIssue(2002, "2002_farm_security_rural_investment", "2002 Farm Bill Target Prices & Subsidies Reversal", "News", "2002-2007 (Agricultural Countercyclical Support)", "Agriculture & Food", 4,
  "Reinstating counter-cyclical price support subsidies and high loan rates for commodity grain and cotton crops.",
  "1 = Reorient Subsidies Toward Organic Farmers, Conservation, and Food Stamps", "10 = Defend Agribusiness Commodity Safety Nets and Crop Subsidies",
  5, 8, 10, 2, 6, 2);

addIssue(2002, "2002_bipartisan_campaign_reform_bcra", "Bipartisan Campaign Reform Act (McCain-Feingold Enactment)", "News", "2002-2010 (BCRA Implementation Arc)", "Governance & Judiciary", 4,
  "Enacting statutory bans on national party soft money and restricting issue ads 60 days before general elections.",
  "1 = Enforce Strict BCRA Limits & Transition to Public Funding", "10 = Strike Down BCRA as Unconstitutional Violation of Free Speech",
  3, 8, 10, 1, 9, 1);

addIssue(2002, "2002_help_america_vote_act", "Help America Vote Act (HAVA) & Touchscreen Voting Terminals", "News", "2002-2006 (Voting Technology Upgrade)", "Governance & Judiciary", 4,
  "Distributing $3 billion to replace punch-card voting machines with electronic voting terminals and centralized voter registries.",
  "1 = Require Voter-Verified Paper Audit Trails (VVPAT) for All Ballots", "10 = Modernize Voting Infrastructure & Require State Photo ID Proof",
  3, 7, 4, 1, 8, 1);

addIssue(2002, "2002_axis_of_evil_doctrine", "'Axis of Evil' Security Doctrine & Preemptive Strikes", "News", "2002-2006 (Neoconservative Security Doctrine)", "Foreign Policy & Defense", 3,
  "Formally naming Iraq, Iran, and North Korea as an 'axis of evil' subject to potential preemptive military force.",
  "1 = Multilateral Diplomacy, Treaties, and Regional Nonproliferation", "10 = Assertive Preemption, Deterrence, and Coercive Regime Change",
  4, 10, 2, 1, 7, 1);

addIssue(2002, "2002_stem_cell_federal_limits", "Federal Funding Limits on Embryonic Stem Cell Lines", "Ideological", "2001-2009 (Embryonic Stem Cell Arc)", "Healthcare", 4,
  "Limiting federal medical research funds exclusively to the 60 embryonic stem cell lines derived before August 9, 2001.",
  "1 = Unrestricted Federal Research Funding for Promising Stem Cell Lines", "10 = Total Federal Ban on Embryonic Stem Cell Research",
  2, 9, 5, 1, 10, 1);

addIssue(2002, "2002_corporate_stock_option_expensing", "Mandatory Stock Option Expensing for Corporate Executives", "News", "2002-2005 (Financial Accounting Standards Battle)", "Economy & Taxation", 5,
  "Requiring publicly traded corporations to expense employee stock options on corporate balance sheets.",
  "1 = Mandatory Expensing to Expose Executive Compensation Excesses", "10 = Voluntary Disclosure / Shield High-Tech Startup Equity Grants",
  3, 7, 9, 1, 6, 1);

addIssue(2002, "2002_yucca_mountain_approval_override", "Congressional Override of Nevada Veto on Yucca Mountain", "News", "2002-2004 (Nevada Veto Override)", "Energy & Climate", 5,
  "Passing a joint congressional resolution overriding the Nevada Governor's official veto of Yucca Mountain.",
  "1 = Respect Nevada State Sovereignty / Halt Radioactive Waste Shipments", "10 = Override State Veto / Fulfill National Nuclear Waste Disposal Obligation",
  4, 9, 6, 1, 8, 1);

addIssue(2002, "2002_terrorism_risk_insurance_tria", "Terrorism Risk Insurance Act (TRIA) Federal Backstop", "News", "2002-2007 (Commercial Real Estate Stability)", "Economy & Taxation", 6,
  "Providing a taxpayer-backed federal reinsurance guarantee for catastrophic losses caused by foreign acts of terrorism.",
  "1 = Condition Federal Reinsurance on Public Equity and Infrastructure Support", "10 = Pure Private Insurance Markets / Sunset Federal Risk Exposure",
  4, 6, 9, 2, 7, 1);

addIssue(2002, "2002_west_coast_port_lockout_taft_hartley", "Bush Taft-Hartley Injunction in West Coast Port Lockout", "News", "2002 (Maritime Labor Conflict)", "Labor & Welfare", 6,
  "Invoking federal emergency powers under Taft-Hartley to end an 11-day lockout of 10,500 dockworkers at 29 Pacific ports.",
  "1 = Protect Longshore Union Bargaining Power Against Employer Lockout", "10 = Federal Intervention to Reopen Ports and Safeguard Supply Chains",
  3, 9, 8, 1, 8, 1);

addIssue(2002, "2002_north_korea_uranium_enrichment", "North Korean Covert Uranium Enrichment & Fuel Freeze", "News", "2002-2006 (Second North Korean Nuclear Crisis)", "Foreign Policy & Defense", 3,
  "Suspending heavy oil fuel aid to Pyongyang after U.S. diplomats uncover covert uranium enrichment centrifuge programs.",
  "1 = Direct Bilateral Talks & Diplomatic Security Guarantees", "10 = Maximum Sanctions, Naval Interdiction, and Preemptive Options",
  4, 9, 4, 1, 8, 1);

addIssue(2002, "2002_california_after_school_prop49", "California Prop 49 (Dedicated State After-School Funding)", "News", "2002-2006 (State Education Ballot Initiatives)", "Education", 5,
  "Earmarking up to $550 million annually in California state funds for public school after-school enrichment programs.",
  "1 = Expand Dedicated Public Youth & Community Education Funding", "10 = Oppose Earmarked Formula Spending / Maintain Budgetary Flexibility",
  3, 6, 9, 2, 8, 1);

addIssue(2002, "2002_florida_class_size_amendment", "Florida Amendment 9 (Constitutional Class Size Limits)", "News", "2002-2006 (Class Size Mandate)", "Education", 5,
  "Amending Florida Constitution to cap public school class sizes at 18 students for K-3 and 22 students for 4-8.",
  "1 = Enforceable Class Size Caps for Student Achievement and Equity", "10 = Reject Unfunded Constitutional Mandates / Local District Discretion",
  2, 8, 9, 1, 8, 1);

addIssue(2002, "2002_nevada_question_2_marriage", "Nevada Question 2 (Constitutional Ban on Same-Sex Marriage)", "Ideological", "1998-2004 (Early State Marriage Amendments)", "Civil Rights & Social Issues", 5,
  "Amending the Nevada Constitution to restrict marriage recognition solely to unions between a male and female.",
  "1 = Full Marriage Equality & Civil Rights for Same-Sex Couples", "10 = Constitutional Defense of Traditional Marriage",
  4, 9, 3, 1, 10, 1);

addIssue(2002, "2002_clean_skies_initiative_cap_and_trade", "Bush 'Clean Skies' Initiative Cap-and-Trade for Power Plants", "News", "2002-2004 (Clean Skies Proposal)", "Energy & Climate", 6,
  "Replacing Clean Air Act New Source Review enforcement with a market-based trading system for sulfur and nitrogen.",
  "1 = Enforce Clean Air Act New Source Review & Enact Carbon Caps", "10 = Market Cap-and-Trade / Exempt Carbon Dioxide from Regulation",
  3, 8, 7, 1, 8, 1);

addIssue(2002, "2002_pension_protection_enron_401k", "401(k) Pension Diversification Reforms Post-Enron", "News", "2002-2006 (Defined Contribution Reforms)", "Labor & Welfare", 5,
  "Allowing workers to sell employer stock in 401(k) accounts after three years to prevent Enron-style pension collapse.",
  "1 = Mandatory Employer Match Diversification & Defined Benefit Guarantees", "10 = Voluntary Fiduciary Guidance / Protect Company Stock Contributions",
  2, 7, 8, 1, 6, 1);

addIssue(2002, "2002_unborn_victims_of_violence", "Unborn Victims of Violence Act (Fetal Homicide Legislation)", "Ideological", "1999-2004 (Fetal Rights Arc)", "Civil Rights & Social Issues", 4,
  "Recognizing a fetus in utero as a distinct legal victim if killed or injured during the commission of a federal crime.",
  "1 = Protect Reproductive Rights / Oppose Codifying Fetal Personhood", "10 = Full Legal Personhood for Unborn Children Under Criminal Law",
  3, 9, 6, 1, 10, 1);

addIssue(2002, "2002_anthrax_biodefense_spending", "Project BioShield & Federal Anthrax Postal Decontamination", "News", "2001-2004 (Post-9/11 Biodefense)", "Healthcare", 6,
  "Appropriating $6 billion for federal stockpiles of vaccines, antibiotics, and postal irradiation systems against anthrax.",
  "1 = Public Health Infrastructure & Global Biological Nonproliferation", "10 = Accelerated Pharmaceutical Biodefense Procurement & Stockpiling",
  4, 8, 6, 2, 8, 1);

addIssue(2002, "2002_partial_birth_veto_override_push", "Federal Partial-Birth Abortion Ban Reintroduction", "Ideological", "1995-2003 (Late-Term Abortion Arc)", "Civil Rights & Social Issues", 3,
  "Passing federal statutory legislation criminalizing late-term intact dilation and extraction abortions without exceptions.",
  "1 = Veto Any Abortion Ban Lacking Exception for Maternal Health", "10 = Complete Ban on Late-Term Procedures Under Federal Criminal Code",
  3, 9, 5, 1, 10, 1);

addIssue(2002, "2002_fbi_reorganization_counterterror", "FBI Reorganization from Bank Robbery to Domestic Counterterrorism", "News", "2001-2004 (Intelligence Reform Arc)", "Governance & Judiciary", 7,
  "Shifting hundreds of FBI special agents from traditional criminal cases to domestic counterterrorism intelligence gathering.",
  "1 = Maintain Fourth Amendment Civil Liberties & Civilian Law Focus", "10 = Prioritize Domestic Counterterror Intelligence Over Criminal Caseloads",
  4, 8, 3, 2, 7, 1);

addIssue(2002, "2002_cuba_embargo_jimmy_carter_visit", "Jimmy Carter's Historic Havana Visit & Embargo Debates", "News", "2002 (Carter Cuba Mission)", "Foreign Policy & Defense", 7,
  "Debating normalization of travel and trade with Cuba after former President Carter visits Havana and speaks on live TV.",
  "1 = End Travel Bans and Unconditionally Normalize Cuban Relations", "10 = Retain Full Economic Sanctions Until Democratic Elections in Cuba",
  3, 8, 2, 1, 9, 1);


// ==========================================
// CYCLE 2004 (55 Issues)
// ==========================================
addIssue(2004, "2004_iraq_war_insurgency_fallujah", "Conduct of the Iraq War & Fallujah Insurgency", "News", "2003-2008 (Iraq Insurgency Phase)", "Foreign Policy & Defense", 1,
  "Managing the deteriorating security situation, counterinsurgency operations in Fallujah, and escalating American casualties in Iraq.",
  "1 = Set Phased Withdrawal Timetable / Transfer Sovereignty & End Occupation", "10 = 'Stay the Course' / Total Military Victory Over Insurgents",
  3, 10, 2, 1, 8, 1);

addIssue(2004, "2004_abu_ghraib_detainee_abuse", "Abu Ghraib Prison Scandal & Interrogation Policies", "News", "2004-2006 (Detainee Abuse Fallout)", "Foreign Policy & Defense", 1,
  "Investigating command responsibility and Pentagon interrogation memos following the release of prisoner abuse photos at Abu Ghraib.",
  "1 = Independent Special Prosecutor / Rumsfeld Resignation / Ban Harsh Interrogations", "10 = Treat as Isolated Misconduct of Low-Rank Soldiers / Defend Pentagon Command",
  2, 9, 3, 1, 7, 1);

addIssue(2004, "2004_federal_marriage_amendment", "Federal Constitutional Marriage Amendment (FMA)", "Ideological", "2003-2006 (Federal Marriage Amendment Push)", "Civil Rights & Social Issues", 1,
  "Amending the U.S. Constitution to define marriage as only between a man and a woman following Massachusetts legalizing gay marriage.",
  "1 = Support Full Marriage Equality / Reject Discriminatory Constitutional Amendments", "10 = Amend U.S. Constitution to Ban Same-Sex Marriage Nationwide",
  3, 10, 2, 1, 10, 1);

addIssue(2004, "2004_state_marriage_amendments_11_states", "11 State Constitutional Marriage Bans (OH, MI, GA, etc.)", "News", "2004 (Super-Tuesday Marriage Amendments)", "Civil Rights & Social Issues", 1,
  "Passing state constitutional amendments in 11 states banning same-sex marriage and civil unions to drive conservative turnout.",
  "1 = Oppose Constitutional Marriage Bans / Defend LGBTQ Rights", "10 = Enact State Constitutional Protections for Traditional Marriage",
  3, 10, 3, 1, 10, 1);

addIssue(2004, "2004_missing_wmds_duelfer_report", "Missing Iraqi Weapons of Mass Destruction (Duelfer Report)", "News", "2003-2005 (WMD Intelligence Fallout)", "Foreign Policy & Defense", 2,
  "Addressing intelligence failures regarding non-existent Iraqi stockpiles of chemical and biological weapons.",
  "1 = Condemn Pretextual War Intelligence / Independent Investigation of Pre-War Claims", "10 = Defend Justification / Saddam Had WMD Intent and Strategic Materials",
  2, 9, 2, 1, 8, 1);

addIssue(2004, "2004_medicare_part_d_pharma_non_negotiation", "Medicare Modernization Act (Part D Rx Benefit & Non-Interference)", "News", "2003-2008 (Medicare Part D Rollout)", "Healthcare", 2,
  "Providing outpatient prescription drug coverage through private insurance while barring Medicare from negotiating bulk drug prices.",
  "1 = Allow Medicare Direct Drug Price Negotiation / Close Coverage Donut Hole", "10 = Preserve Private Plan Competition / Bar Government Price Setting",
  2, 9, 8, 1, 8, 1);

addIssue(2004, "2004_swift_boat_veterans_controversy", "Swift Boat Veterans for Truth & Kerry Military Record", "News", "2004 (Swift Boat Smear Arc)", "Foreign Policy & Defense", 2,
  "Questioning John Kerry's Vietnam War combat decorations and his 1971 anti-war testimony before the Senate Foreign Relations Committee.",
  "1 = Condemn Unfounded Smear Campaign Funded by GOP Donors", "10 = Highlight Inconsistencies in Kerry's Service and Anti-War Statements",
  2, 9, 5, 2, 9, 1);

addIssue(2004, "2004_jobs_and_growth_tax_cuts_jgtrra", "2003 Capital Gains & Dividend Tax Cuts (JGTRRA)", "Ideological", "2003-2012 (Capital Taxation Debates)", "Economy & Taxation", 2,
  "Slashing top federal tax rates on stock dividends and capital gains to 15% to stimulate equity markets and investment.",
  "1 = Tax Capital Gains and Dividends as Ordinary Income / End Wealth Loopholes", "10 = Permanently Lock In 15% (or Zero) Tax on Capital and Dividends",
  2, 10, 10, 1, 9, 1);

addIssue(2004, "2004_federal_assault_weapons_sunset", "Expiration & Sunset of 1994 Federal Assault Weapons Ban", "News", "2004 (Assault Weapon Sunset)", "Civil Rights & Social Issues", 2,
  "Allowing the 10-year statutory ban on the manufacture and sale of semiautomatic assault weapons to expire without renewal.",
  "1 = Permanently Renew & Expand the Federal Assault Weapons Ban", "10 = Celebrate Expiration / Protect Lawful Semiautomatic Firearm Ownership",
  2, 9, 10, 1, 10, 2);

addIssue(2004, "2004_911_commission_recommendations", "9/11 Commission Report & Director of National Intelligence (DNI)", "News", "2004-2005 (Intelligence Overhaul)", "Governance & Judiciary", 3,
  "Creating the Director of National Intelligence and National Counterterrorism Center to unify 15 fragmented intelligence agencies.",
  "1 = Enact All 41 9/11 Commission Recommendations in Full Without Delay", "10 = Protect Pentagon Command Authority Over Military Intelligence Budgets",
  3, 7, 5, 2, 7, 1);

addIssue(2004, "2004_stem_cell_california_prop71", "California Proposition 71 ($3 Billion Stem Cell Research Bond)", "News", "2004-2008 (State Stem Cell Initiatives)", "Healthcare", 3,
  "Bypassing federal embryonic stem cell funding restrictions by issuing $3 billion in state general obligation bonds for regenerative medicine.",
  "1 = Aggressively Fund Stem Cell Science to Cure Diseases", "10 = Oppose Taxpayer Funding for the Destruction of Human Embryos",
  2, 8, 4, 1, 10, 1);

addIssue(2004, "2004_unborn_victims_of_violence_laci", "Unborn Victims of Violence Act (Laci and Conner's Law)", "News", "2004 (Laci Peterson Enactment)", "Civil Rights & Social Issues", 3,
  "Codifying into federal law that harming a pregnant woman creates two distinct victims at any stage of embryonic development.",
  "1 = Oppose Legal Encroachment on Reproductive Freedom", "10 = Recognize Legal Personhood and Protection of Unborn Children",
  2, 9, 6, 1, 10, 1);

addIssue(2004, "2004_medical_malpractice_caps", "Federal Caps on Non-Economic Medical Malpractice Damages", "Ideological", "1995-2010 (Tort Reform Arc)", "Healthcare", 4,
  "Enacting a $250,000 federal statutory cap on pain-and-suffering non-economic damages in medical liability lawsuits.",
  "1 = Protect Patient Rights to Full Jury Compensation / No Arbitrary Caps", "10 = Enact $250,000 Cap to Curb Defensive Medicine & Lower Malpractice Premiums",
  2, 9, 8, 1, 9, 1);

addIssue(2004, "2004_health_savings_accounts_hsas", "Expansion of High-Deductible Health Savings Accounts (HSAs)", "Ideological", "2003-2026 (Consumer-Directed Healthcare)", "Healthcare", 4,
  "Promoting tax-free Health Savings Accounts paired with high-deductible health insurance plans to introduce consumer cost awareness.",
  "1 = Oppose HSAs as Wealth Shelters / Universal Comprehensive Single-Payer", "10 = Expand HSAs to Free Healthcare Consumers from Government and HMO Control",
  3, 9, 10, 1, 9, 1);

addIssue(2004, "2004_offshoring_benedict_arnold_ceos", "Corporate Offshoring & Outsourcing of Manufacturing/IT Jobs", "News", "2003-2006 (Job Offshoring Backlash)", "Trade & Globalism", 3,
  "Eliminating federal tax deferrals for corporations moving factories overseas and penalizing outsourcing to India and China.",
  "1 = Penalize Outsourcing / End Corporate Tax Deferral on Foreign Profits", "10 = Defend Global Supply Chains & Comparative Advantage / Lower Corporate Taxes",
  3, 8, 9, 1, 4, 1);

addIssue(2004, "2004_fcc_indecency_janet_jackson", "FCC Indecency Crackdowns & Increased Broadcast Fines", "News", "2004-2008 (Post-Super Bowl Decency Crackdown)", "Civil Rights & Social Issues", 5,
  "Increasing FCC fines tenfold on broadcast networks for fleeting expletives and sexual content following the Super Bowl halftime incident.",
  "1 = Defend First Amendment Free Expression Against Moral Censorship", "10 = Aggressive Enforcement of Decency Standards on Public Airwaves",
  4, 9, 2, 2, 10, 1);

addIssue(2004, "2004_darfur_genocide_declaration", "Darfur Crisis & Formal Declaration of Genocide", "News", "2004-2008 (Darfur Humanitarian Crisis)", "Foreign Policy & Defense", 4,
  "Declaring Sudanese government and Janjaweed atrocities in Darfur a genocide and demanding UN peacekeeper deployment.",
  "1 = International Peacekeeping & Sanctions on Sudanese Regime", "10 = American Diplomatic Pressure / Avoid Unilateral Troop Commitments",
  3, 6, 4, 1, 6, 1);

addIssue(2004, "2004_overtime_pay_regulations_flsa", "Department of Labor Overtime Exemption Rule Changes", "News", "2004 (FLSA Overtime Reclassification)", "Labor & Welfare", 4,
  "Reclassifying white-collar supervisory and technical workers to exempt them from mandatory time-and-a-half overtime pay.",
  "1 = Protect 40-Hour Week & Overtime Pay for Millions of Workers", "10 = Modernize Labor Rules for White-Collar Professional Workforce",
  2, 9, 9, 1, 8, 1);

addIssue(2004, "2004_class_action_fairness_act", "Class Action Fairness Act (Moving Cases to Federal Courts)", "News", "2003-2005 (CAFA Enactment)", "Governance & Judiciary", 5,
  "Transferring multi-state class-action tort lawsuits from plaintiff-friendly state county courts into federal courts.",
  "1 = Protect Consumer and Worker Class Action Access Against Corporate Abuse", "10 = Curb Forum Shopping by Trial Lawyers in Notorious 'Judicial Hellholes'",
  2, 9, 8, 1, 9, 1);

addIssue(2004, "2004_colorado_amendment_36_ev_split", "Colorado Amendment 36 (Proportional Electoral Vote Allocation)", "News", "2004 (Proportional EV Ballot Initiative)", "Governance & Judiciary", 6,
  "Allocating Colorado's 9 Electoral College votes proportionally based on the state's presidential popular vote.",
  "1 = Support Proportional EV Allocation Toward Direct Popular Vote", "10 = Reject Proportional Split / Protect Winner-Take-All State Leverage",
  4, 8, 5, 2, 8, 2);

addIssue(2004, "2004_florida_hurricane_fema_relief", "Federal Disaster Relief Appropriations for Florida Hurricanes", "News", "2004 (Four Florida Hurricanes: Charley, Frances, Ivan, Jeanne)", "Energy & Climate", 5,
  "Authorizing $12+ billion in emergency disaster relief and FEMA mobile housing aid for Florida storm victims before the election.",
  "1 = Fully Funded Emergency Disaster Relief & Strengthened Building Codes", "10 = Efficient Emergency Aid / Prevent Unreimbursed Federal Waste",
  4, 7, 7, 2, 7, 1);

addIssue(2004, "2004_nclb_unfunded_mandate_backlash", "State Bipartisan Rebellion Against NCLB Testing Mandates", "News", "2003-2006 (State Resistance to NCLB)", "Education", 5,
  "State legislative resolutions in Utah and Virginia protesting federal No Child Left Behind testing mandates as unfunded mandates.",
  "1 = Substantially Increase Federal Education Funding or Repeal Penalties", "10 = Enforce Rigorous Federal Standards and Sanctions for Underperformance",
  3, 6, 9, 1, 9, 1);

addIssue(2004, "2004_partial_birth_abortion_court_fights", "Federal Injunctions Against the Partial-Birth Abortion Ban Act", "News", "2003-2007 (Gonzales v. Carhart Pre-Ruling)", "Governance & Judiciary", 4,
  "Federal district judges striking down the Partial-Birth Abortion Ban Act for failing to include a maternal health exception.",
  "1 = Affirm Court Decisions Protecting Women's Health and Autonomy", "10 = Appeal Decisions to Supreme Court to Uphold the Lawful Congressional Ban",
  2, 9, 5, 1, 10, 1);

addIssue(2004, "2004_iraq_coalition_allies_withdrawal", "Withdrawal of Spanish and Allied Troops from Iraq Coalition", "News", "2004 (Post-Madrid Train Bombing Realignment)", "Foreign Policy & Defense", 6,
  "Handling the withdrawal of Spain, Honduras, and the Dominican Republic from the Iraq coalition following the Madrid train bombings.",
  "1 = Respect Allied Democratic Mandates / Internationalize Transition to UN", "10 = Condemn Appeasement of Terrorists / Reinvigorate Coalition of the Willing",
  3, 9, 4, 1, 8, 1);

addIssue(2004, "2004_montana_medical_marijuana_i148", "Montana Medical Marijuana Act (Initiative 148)", "News", "2004 (Western Medical Marijuana Expansion)", "Civil Rights & Social Issues", 6,
  "Legalizing the use, cultivation, and possession of marijuana for registered patients with debilitating medical conditions.",
  "1 = Protect Patient Access to Medical Cannabis / End Federal Interference", "10 = Oppose State Marijuana Measures / Enforce Federal Controlled Substances Act",
  3, 7, 1, 1, 8, 1);


// ==========================================
// CYCLE 2006 (55 Issues)
// ==========================================
addIssue(2006, "2006_hurricane_katrina_response_failure", "Hurricane Katrina Federal Response Failure & FEMA Reform", "News", "2005-2007 (Katrina Fallout)", "Governance & Judiciary", 1,
  "Investigating the catastrophic federal disaster response, levee breaches in New Orleans, and resignation of FEMA Director Michael Brown.",
  "1 = Full Federal Reconstruction of Gulf Coast / Independent Katrina Commission", "10 = Defend Administration Efforts / Emphasize State and Local Emergency Failures",
  2, 9, 5, 1, 8, 1);

addIssue(2006, "2006_iraq_civil_war_stay_the_course", "Iraqi Sectarian Civil War & 'Stay the Course' vs Redeployment", "News", "2005-2008 (Iraq Sectarian Escalation)", "Foreign Policy & Defense", 1,
  "Confronting sectarian civil war after the al-Askari mosque bombing; choosing between phased redeployment or maintaining troop commitments.",
  "1 = Enact Phased Troop Redeployment / Convene Regional Diplomatic Talks", "10 = 'Stay the Course' / Defeat Terrorists in Baghdad Rather Than at Home",
  3, 10, 2, 1, 8, 1);

addIssue(2006, "2006_jack_abramoff_lobbying_scandal", "Jack Abramoff Lobbying Corruption Scandal & K Street Ethics", "News", "2005-2007 (K Street Ethics Arc)", "Governance & Judiciary", 1,
  "Prosecuting lobbyist Jack Abramoff for bribing members of Congress with golf trips and campaign cash in exchange for legislative favors.",
  "1 = Comprehensive Lobbying Ban / Close Revolving Door / Ban Corporate Gifts", "10 = Enforce Existing Criminal Laws Against Corrupt Individuals / Protect Free Speech",
  2, 8, 6, 1, 8, 1);

addIssue(2006, "2006_sensenbrenner_hr4437_felony_bill", "Sensenbrenner Border Bill (H.R. 4437) Making Undocumented Status a Felony", "News", "2005-2006 (Immigration Polarization Arc)", "Immigration & Border", 1,
  "Passing legislation classifying unlawful presence as a federal felony and criminalizing humanitarian aid to undocumented immigrants.",
  "1 = Reject H.R. 4437 / Provide Pathway to Citizenship for 12 Million Immigrants", "10 = Pass Strict Border Enforcement & Make Unlawful Presence an Aggravated Felony",
  2, 10, 3, 1, 10, 1);

addIssue(2006, "2006_mega_marches_day_without_immigrants", "'A Day Without Immigrants' General Strike & Mega-Marches", "News", "2006 (Spring Immigrant Rights Mobilization)", "Immigration & Border", 2,
  "Responding to millions of Latino and immigrant workers striking and marching in major cities waving American and Mexican flags.",
  "1 = Support Workers' Dignity & Pass Comprehensive Immigration Reform", "10 = Condemn Illegal Worker Strikes / Demand Immediate Interior Workplace Raids",
  2, 10, 4, 1, 10, 1);

addIssue(2006, "2006_secure_fence_act_700_miles", "Secure Fence Act of 2006 (700 Miles of Double-Layer Fencing)", "News", "2006-2008 (Physical Border Barrier)", "Immigration & Border", 2,
  "Authorizing the construction of 700 miles of reinforced double-layer physical fencing along the southwest border with Mexico.",
  "1 = Oppose Ineffective Border Walls / Invest in Smart Technology and Ports", "10 = Complete 700 Miles of Double-Layer Physical Border Barriers",
  3, 9, 6, 1, 10, 1);

addIssue(2006, "2006_federal_minimum_wage_six_for_06", "Raising Federal Minimum Wage from $5.15 to $7.25 ('Six for 06')", "News", "2006-2007 (Democratic 110th Agenda)", "Labor & Welfare", 2,
  "Passing the first federal minimum wage increase in a decade, raising the wage from $5.15 to $7.25 per hour over three years.",
  "1 = Raise to $7.25+ Immediately Without Big Business Tax Giveaways", "10 = Oppose Minimum Wage Increases as Job Killers for Small Businesses",
  2, 8, 10, 1, 9, 1);

addIssue(2006, "2006_nsa_warrantless_wiretapping", "NSA Warrantless Wiretapping (Terrorist Surveillance Program)", "News", "2005-2008 (FISA Bypass Scandal)", "Civil Rights & Social Issues", 2,
  "Executive authorization of NSA intercept of domestic-to-foreign communications without warrants from the FISA Foreign Intelligence Court.",
  "1 = Condemn Illegal Warrantless Spying / Enforce Strict FISA Court Compliance", "10 = Defend Inherent Article II Commander-in-Chief Wartime Surveillance Authority",
  2, 9, 1, 1, 3, 1);

addIssue(2006, "2006_mark_foley_page_scandal", "Mark Foley Congressional Page Scandal & Leadership Inaction", "News", "2006 (Fall Election Shock)", "Governance & Judiciary", 2,
  "Resignation of Florida Congressman Mark Foley over sexually explicit messages sent to underage teenage congressional pages.",
  "1 = Condemn GOP House Leadership Coverup / Ethics Overhaul", "10 = Hold Foley Personally Accountable / Resist Partisan Exploitation",
  2, 8, 6, 2, 9, 1);

addIssue(2006, "2006_military_commissions_act_habeas", "Military Commissions Act of 2006 & Habeas Corpus Stripping", "News", "2006-2008 (Hamdan v. Rumsfeld Response)", "Foreign Policy & Defense", 2,
  "Stripping federal courts of habeas corpus jurisdiction for non-citizen detainees declared unlawful enemy combatants.",
  "1 = Restore Habeas Corpus / Prohibit Waterboarding and Coerced Evidence", "10 = Authorize Military Commissions & Coercive Interrogation Techniques",
  2, 9, 1, 1, 8, 1);

addIssue(2006, "2006_gas_prices_3_dollars_oil_profits", "Gasoline Prices Reaching $3.00/Gallon & Oil Windfall Taxes", "News", "2005-2007 (Early Energy Price Spike)", "Energy & Climate", 3,
  "Imposing a federal windfall profits tax on major oil corporations reporting record profits while gas reaches $3.00/gal.",
  "1 = Enact Windfall Profits Tax on Big Oil / Subsidize Clean Energy", "10 = Expand Domestic Drilling / Lower Refining Regulatory Burdens",
  2, 9, 10, 1, 9, 1);

addIssue(2006, "2006_stem_cell_enhancement_veto", "Stem Cell Research Enhancement Act & Bush's First Veto", "News", "2006-2007 (First Bush Veto)", "Healthcare", 3,
  "Bush casting the first veto of his presidency to block federal funding for human embryonic stem cell lines derived from discarded IVF embryos.",
  "1 = Override Veto / Expand Federal Funding for Promising Stem Cell Therapies", "10 = Uphold Veto / Prohibit Taxpayer Subsidies for Destroying Human Life",
  2, 9, 5, 1, 10, 1);

addIssue(2006, "2006_net_neutrality_telecom_reform", "Net Neutrality Mandate (Communications, Opportunity, Promotion Act)", "News", "2006 (Net Neutrality Genesis)", "Technology & Infrastructure", 3,
  "Barring broadband telecom providers from creating tiered 'fast lanes' or blocking competing web content.",
  "1 = Enact Ironclad Federal Net Neutrality Regulations", "10 = Free Market Broadband / Protect Private Infrastructure Investment",
  2, 8, 6, 1, 8, 1);

addIssue(2006, "2006_south_dakota_abortion_ban_referred", "South Dakota Women's Health and Human Life Act (Referred Law 6)", "News", "2006 (Total Abortion Ban Ballot Battle)", "Civil Rights & Social Issues", 3,
  "Voter referendum on a state law banning virtually all abortions without exceptions for rape or incest.",
  "1 = Vote No / Reject Total Abortion Ban and Protect Women's Health", "10 = Vote Yes / Protect Unborn Life with Direct Challenge to Roe v. Wade",
  2, 9, 4, 1, 10, 1);

addIssue(2006, "2006_dubai_ports_world_controversy", "Dubai Ports World Acquisition of Six Major U.S. Port Terminals", "News", "2006 (Port Security Controversy)", "Foreign Policy & Defense", 4,
  "Bipartisan congressional resistance forcing a state-owned UAE company to divest ownership of management at six major U.S. ports.",
  "1 = Block Foreign Government Control of Critical National Security Infrastructure", "10 = Support Free International Investment with Friendly Strategic Allies",
  3, 6, 8, 2, 9, 2);

addIssue(2006, "2006_missouri_amendment_2_stem_cells", "Missouri Amendment 2 (Constitutional Stem Cell Research Protection)", "News", "2006 (Missouri Stem Cell Ballot Fight)", "Healthcare", 4,
  "Passing a state constitutional amendment protecting all federally permissible stem cell therapies from state criminal bans.",
  "1 = Constitutional Protection for Life-Saving Stem Cell Research", "10 = Oppose Human Cloning and Embryo Destruction",
  2, 9, 5, 1, 10, 1);

addIssue(2006, "2006_pension_protection_act_auto_enroll", "Pension Protection Act of 2006 & Automatic 401(k) Enrollment", "News", "2006 (Retirement Reform)", "Labor & Welfare", 5,
  "Encouraging employers to automatically enroll workers in 401(k) plans and tightening defined benefit funding rules.",
  "1 = Strengthen Defined Benefit Union Pensions / Protect PBGC Guarantees", "10 = Promote Automatic Private Savings & Defined Contribution Portability",
  3, 8, 9, 2, 7, 1);

addIssue(2006, "2006_subprime_mortgage_early_cracks", "Emerging Subprime Lending Defaults & Exotic ARM Mortgages", "News", "2006 (Early Housing Bubble Tremors)", "Economy & Taxation", 5,
  "Federal regulators issuing guidance on non-traditional mortgage risks as subprime defaults begin rising.",
  "1 = Crack Down on Predatory Subprime Lending & Mandate Affordability", "10 = Promote Homeownership Access / Avoid Heavy-Handed Lending Mandates",
  2, 8, 9, 1, 8, 1);

addIssue(2006, "2006_minimum_wage_state_ballots_6_states", "State Minimum Wage Ballot Measures (AZ, CO, MO, MT, NV, OH)", "News", "2006 (Direct Democracy Wage Hikes)", "Labor & Welfare", 4,
  "Voter initiatives in 6 states approving constitutional and statutory minimum wage hikes indexed to inflation.",
  "1 = Support Citizen-Initiated Wage Hikes Indexed to Inflation", "10 = Oppose Constitutional Wage Mandates / Protect Small Business Hiring",
  2, 8, 10, 1, 9, 1);

addIssue(2006, "2006_arizona_anti_illegal_immigration_props", "Arizona Propositions 100, 102, 103, 300 (Border Ballot Package)", "News", "2006 (Arizona Anti-Immigrant Ballot Package)", "Immigration & Border", 4,
  "State ballot propositions denying bail for undocumented felony suspects, barring punitive damages, and making English the official language.",
  "1 = Oppose Punitive State Measures / Protect Equal Rights for All Residents", "10 = Pass Strict State Measures to Deter Illegal Immigration and Protect Taxpayers",
  2, 10, 4, 1, 10, 1);

console.log('Total issues generated for 2000-2006:', ISSUES_2000_2006.length);

module.exports = ISSUES_2000_2006;
