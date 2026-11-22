/**
 * historical-issues-data.js
 * Comprehensive 21st Century Electoral Issues Dataset (2000-2026)
 * Total Issues: 719 across 14 election cycles.
 * Categorized into Ideological vs. News, 10 Salience Tiers, and 6-party 1-10 stances.
 */

(function () {
  const HISTORICAL_ISSUES = [
  {
    "cycle": 2000,
    "id": "2000_budget_surplus_allocation",
    "name": "Federal Budget Surplus Allocation",
    "type": "News",
    "eraSpan": "1998-2002 (Surplus Window)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Whether to dedicate the $236B surplus to a Social Security/Medicare 'lockbox' and debt retirement or provide large across-the-board tax cuts.",
    "pole1": "1 = 100% Debt Paydown / Social Security Lockbox / Public Investment",
    "pole10": "10 = 100% Across-the-board Tax Cuts to Shrink Government",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_social_security_privatization",
    "name": "Social Security Private Investment Carve-Outs",
    "type": "Ideological",
    "eraSpan": "1980-2030 (Entitlement Reform Arc)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Allowing workers to divert 2 percentage points of their payroll taxes into private stock and bond investment accounts.",
    "pole1": "1 = Maintain Defined-Benefit Government Trust Fund",
    "pole10": "10 = Full Individual Market Carve-outs & Privatization",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_patients_bill_of_rights",
    "name": "Patients' Bill of Rights & HMO Lawsuit Liability",
    "type": "News",
    "eraSpan": "1998-2002 (Managed Care Reform Arc)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Granting patients statutory rights to sue managed-care HMOs in state courts for injury caused by denial of medical claims.",
    "pole1": "1 = Universal Right to Sue HMOs / Single-Payer Healthcare",
    "pole10": "10 = Shield Insurers / Federal Tort Immunity & Damage Caps",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_partial_birth_abortion_ban",
    "name": "Partial-Birth Abortion Ban Act",
    "type": "Ideological",
    "eraSpan": "1973-2024 (Abortion Jurisprudence Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Banning late-term intact dilation and extraction abortion procedures without a maternal health exception clause.",
    "pole1": "1 = Full Reproductive Autonomy / Veto Ban Lacking Health Exception",
    "pole10": "10 = Absolute Federal Ban / Constitutional Fetal Personhood",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_national_missile_defense",
    "name": "National Missile Defense & ABM Treaty Withdrawal",
    "type": "Ideological",
    "eraSpan": "1983-2020 (Strategic Defense Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Deploying a national ballistic missile interceptor shield even if it necessitates abrogating the 1972 ABM Treaty with Russia.",
    "pole1": "1 = Uphold Arms Control Treaties / Prohibit Space & Missile Shields",
    "pole10": "10 = Unilateral ABM Withdrawal / Rapid Interceptor Deployment",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_china_pntr_wto",
    "name": "China Permanent Normal Trade Relations (PNTR)",
    "type": "News",
    "eraSpan": "1999-2002 (Globalization Consensus Arc)",
    "domain": "Trade & Globalism",
    "tier": 2,
    "debate": "Granting China permanent normal trade relations status to facilitate its accession into the World Trade Organization.",
    "pole1": "1 = Reject PNTR / Impose Strict Human Rights & Labor Conditionality",
    "pole10": "10 = Unconditional Free Trade Accession & Market Integration",
    "stances": {
      "dem": 6,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 2,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_campaign_finance_mccain_feingold",
    "name": "Soft Money Ban & Campaign Finance Reform",
    "type": "Ideological",
    "eraSpan": "1974-2010 (Pre-Citizens United Arc)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Banning unregulated corporate, union, and individual soft-money donations to national political party committees.",
    "pole1": "1 = Public Campaign Financing / Total Corporate Contribution Ban",
    "pole10": "10 = Full Contribution Deregulation / Political Spending is Free Speech",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_gun_show_loophole_brady",
    "name": "Gun Show Background Checks & Assault Weapons Ban Renewal",
    "type": "Ideological",
    "eraSpan": "1968-2026 (Gun Control Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Closing the private sale 'gun show loophole' and renewing the 1994 federal prohibition on semiautomatic assault weapons.",
    "pole1": "1 = Universal Background Registry / Ban Semiautomatic Firearms",
    "pole10": "10 = Unrestricted Second Amendment / Repeal All Federal Gun Laws",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 2,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2000,
    "id": "2000_school_vouchers_title_i",
    "name": "Federal School Vouchers & Private School Choice",
    "type": "Ideological",
    "eraSpan": "1980-2026 (School Choice Arc)",
    "domain": "Education",
    "tier": 3,
    "debate": "Allowing federal Title I funds to follow students to private, parochial, or charter schools of their choice.",
    "pole1": "1 = 100% Dedicated Public School Funding / Ban Vouchers",
    "pole10": "10 = Universal Taxpayer-Funded Private School Vouchers",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 2,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_anwr_drilling",
    "name": "Arctic National Wildlife Refuge (ANWR) Oil Drilling",
    "type": "Ideological",
    "eraSpan": "1980-2020 (Energy Exploration Arc)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Authorizing oil and natural gas exploration and commercial leasing in the coastal plain of Alaska's ANWR.",
    "pole1": "1 = Permanent Wilderness Protection / Zero Fossil Fuel Leasing",
    "pole10": "10 = Immediate Full Oil & Gas Exploration Leasing",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_kyoto_protocol",
    "name": "Kyoto Protocol International Climate Treaty",
    "type": "News",
    "eraSpan": "1997-2005 (Kyoto Framework Arc)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Submitting the Kyoto greenhouse gas emissions reduction treaty to the Senate for formal ratification.",
    "pole1": "1 = Immediate Ratification & Strict Binding Emission Caps",
    "pole10": "10 = Total Rejection / Shield American Industry from Global Treaties",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_estate_tax_death_tax_repeal",
    "name": "Federal Estate & Gift Tax ('Death Tax') Repeal",
    "type": "Ideological",
    "eraSpan": "1990-2026 (Wealth Taxation Arc)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Permanently abolishing the federal estate tax levied on asset transfers from deceased high-net-worth estates.",
    "pole1": "1 = Highly Progressive Wealth & Inheritance Taxation",
    "pole10": "10 = Complete and Permanent Abolition of Estate Tax",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_faith_based_initiatives",
    "name": "Faith-Based Social Service Grants ('Charitable Choice')",
    "type": "Ideological",
    "eraSpan": "1996-2016 (Faith-Based Welfare Arc)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Allowing religious organizations to compete directly for federal social welfare grants while preserving religious hiring.",
    "pole1": "1 = Strict Separation of Church and State / No Faith Grants",
    "pole10": "10 = Broad Federal Funding of Religious Charities & Missions",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 7,
      "grn": 2,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_marriage_penalty_tax_relief",
    "name": "Marriage Tax Penalty Equalization",
    "type": "News",
    "eraSpan": "1998-2003 (Tax Code Modernization)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Doubling standard deduction and 15% bracket thresholds for married couples filing jointly to eliminate penalty.",
    "pole1": "1 = Retain Existing Code / Focus Relief on Lower-Income Families",
    "pole10": "10 = Complete Equalization / Pro-Family Tax Incentives",
    "stances": {
      "dem": 5,
      "gop": 9,
      "lib": 8,
      "grn": 4,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2000,
    "id": "2000_same_sex_marriage_bans_prop22",
    "name": "State Constitutional Bans on Same-Sex Marriage (CA Prop 22)",
    "type": "Ideological",
    "eraSpan": "1996-2015 (Marriage Equality Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Enacting state constitutional amendments defining marriage exclusively as a legal union between one man and one woman.",
    "pole1": "1 = Complete Marriage Equality & Federal Civil Rights Protections",
    "pole10": "10 = Constitutional Prohibition of Same-Sex Marriage & Civil Unions",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_medical_marijuana_legalization",
    "name": "State Medical Cannabis Legalization Measures",
    "type": "Ideological",
    "eraSpan": "1996-2026 (Cannabis Reform Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Authorizing state-licensed medical marijuana dispensaries for patients with physician recommendations.",
    "pole1": "1 = Complete Federal Decriminalization & Legalization",
    "pole10": "10 = Strict Federal Prohibition & Drug Enforcement Raids",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_elian_gonzalez_cuba_policy",
    "name": "Elián González Custody Raid & Cuba Embargo",
    "type": "News",
    "eraSpan": "1999-2001 (Elián Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Federal armed raid returning Cuban shipwreck boy Elián González to his father in Cuba versus political asylum.",
    "pole1": "1 = Normalize Relations / Respect Parental Custody in Cuba",
    "pole10": "10 = Grant Political Asylum / Enforce Strict Anti-Castro Embargo",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 6,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_california_electricity_crisis",
    "name": "California Electricity Crisis & Wholesale Price Caps",
    "type": "News",
    "eraSpan": "2000-2002 (Power Deregulation Crisis)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Imposing emergency federal price caps on wholesale electricity marketers to halt rolling blackouts and Enron gouging.",
    "pole1": "1 = Emergency Federal Price Caps / Re-regulate Public Utilities",
    "pole10": "10 = Pure Market Pricing / Resist Federal Price Controls",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_scalia_originalism_judicial_picks",
    "name": "Supreme Court Judicial Appointments & Strict Constructionism",
    "type": "Ideological",
    "eraSpan": "1980-2026 (Federal Judiciary Arc)",
    "domain": "Governance & Judiciary",
    "tier": 7,
    "debate": "Pledging to appoint federal judges in the originalist mold of Antonin Scalia and Clarence Thomas.",
    "pole1": "1 = Living Constitution / Protect Liberal Judicial Precedents",
    "pole10": "10 = Strict Originalism & Textualism / Overturn Roe v. Wade",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_corporate_duopoly_nader",
    "name": "Third-Party Ballot Access & Presidential Debate Inclusion",
    "type": "Ideological",
    "eraSpan": "1992-2026 (Electoral Reform Arc)",
    "domain": "Governance & Judiciary",
    "tier": 8,
    "debate": "Lowering the Commission on Presidential Debates 15% polling threshold to admit independent and third-party nominees.",
    "pole1": "1 = Open Debates / Ranked Choice Voting / Easy Ballot Access",
    "pole10": "10 = Protect Two-Party Stability / Enforce Strict Thresholds",
    "stances": {
      "dem": 7,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 1,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_anti_sweatshop_globalization",
    "name": "Anti-Sweatshop Campaign & Trade Accord Labor Standards",
    "type": "Ideological",
    "eraSpan": "1995-2015 (Anti-Corporate Globalization)",
    "domain": "Trade & Globalism",
    "tier": 8,
    "debate": "Mandating enforceable labor rights and environmental protections in all international bilateral and multilateral trade pacts.",
    "pole1": "1 = Mandatory Living Wage & Union Rights in All Trade Accords",
    "pole10": "10 = Free Market Trade Without Social Clause Mandates",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_napster_copyright_dmca",
    "name": "Digital Millennium Copyright Act Enforcement Against Napster",
    "type": "News",
    "eraSpan": "1998-2004 (Digital IP Wars)",
    "domain": "Technology & Infrastructure",
    "tier": 9,
    "debate": "Enforcing federal copyright infringement injunctions and statutory damages to shut down peer-to-peer MP3 file-sharing networks.",
    "pole1": "1 = Open Internet / Broad Fair Use / Decriminalize File Sharing",
    "pole10": "10 = Strict IP Enforcement & Digital Rights Management Mandates",
    "stances": {
      "dem": 6,
      "gop": 7,
      "lib": 4,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_electoral_college_legitimacy",
    "name": "Abolition of the Electoral College via Amendment",
    "type": "Ideological",
    "eraSpan": "1800-2026 (Constitutional Electoral Arc)",
    "domain": "Governance & Judiciary",
    "tier": 10,
    "debate": "Replacing the Electoral College system with direct national popular election of the President after Bush v. Gore.",
    "pole1": "1 = Direct National Popular Vote Constitutional Amendment",
    "pole10": "10 = Preserve Electoral College Federalism & State Power",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_yucca_mountain_nuclear_waste",
    "name": "Yucca Mountain Nuclear Waste Repository Designation",
    "type": "Ideological",
    "eraSpan": "1987-2015 (Nuclear Waste Arc)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Designating Yucca Mountain, Nevada as the sole federal deep-geological repository for commercial spent fuel rods.",
    "pole1": "1 = Respect Nevada State Sovereignty / Cancel Facility",
    "pole10": "10 = Federal Preemption / Rapidly Open Nuclear Waste Site",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_death_penalty_moratorium",
    "name": "Capital Punishment Moratorium & Post-Conviction DNA Testing",
    "type": "Ideological",
    "eraSpan": "1972-2026 (Capital Punishment Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Imposing a federal moratorium on executions pending review of wrongful capital convictions and racial disparities.",
    "pole1": "1 = Complete Abolition of Capital Punishment",
    "pole10": "10 = Expedite Death Row Appeals & Retain Capital Punishment",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_fda_tobacco_regulation",
    "name": "FDA Regulatory Jurisdiction Over Cigarettes & Tobacco",
    "type": "News",
    "eraSpan": "1996-2009 (Tobacco Wars)",
    "domain": "Healthcare",
    "tier": 7,
    "debate": "Granting the FDA explicit statutory authority to restrict cigarette marketing to minors and regulate nicotine content.",
    "pole1": "1 = Comprehensive Federal Tobacco & Nicotine Marketing Controls",
    "pole10": "10 = Prohibit FDA Regulation / Protect Commercial Speech",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_affirmative_action_higher_ed",
    "name": "Race-Conscious Affirmative Action in College Admissions",
    "type": "Ideological",
    "eraSpan": "1978-2023 (Affirmative Action Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Using race as an individualized factor in university admissions to achieve campus diversity and social mobility.",
    "pole1": "1 = Defend & Expand Race-Conscious Remedial Admissions",
    "pole10": "10 = Complete Ban on Race Consideration / Pure Colorblindness",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_welfare_work_requirements",
    "name": "1996 Welfare Reform Reauthorization & Work Participation",
    "type": "Ideological",
    "eraSpan": "1996-2026 (Welfare Conditionality Arc)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Requiring TANF cash assistance recipients to engage in at least 30-40 hours per week of verified work activities.",
    "pole1": "1 = Abolish Work Sanctions / Guarantee Universal Basic Income",
    "pole10": "10 = Strict 40-Hour Work Rules / Cut Inactive Recipients",
    "stances": {
      "dem": 5,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_military_readiness_pay",
    "name": "Pentagon Readiness Reinvestment & Military Pay Raise",
    "type": "News",
    "eraSpan": "1998-2004 (Readiness Rebound)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Approving emergency defense appropriations to overhaul military equipment depots and boost troop pay and housing allowances.",
    "pole1": "1 = Reallocate Military Spending to Healthcare & Schools",
    "pole10": "10 = Major Defense Reinvestment & Weapons Modernization",
    "stances": {
      "dem": 5,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_firestone_tire_safety_recalls",
    "name": "Criminal Penalties for Defective Auto Safety (TREAD Act)",
    "type": "News",
    "eraSpan": "2000-2002 (Rollover Safety Crisis)",
    "domain": "Technology & Infrastructure",
    "tier": 7,
    "debate": "Enacting federal criminal penalties for auto executives concealing fatal tire and rollover defects.",
    "pole1": "1 = Severe Corporate Criminal Penalties & Mandatory Sensor Tech",
    "pole10": "10 = Industry Self-Policing / Shield Corporate Executives",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_vieques_puerto_rico_bombing",
    "name": "Cessation of U.S. Navy Live-Fire Drills on Vieques Island",
    "type": "News",
    "eraSpan": "1999-2003 (Vieques Civil Disobedience)",
    "domain": "Foreign Policy & Defense",
    "tier": 8,
    "debate": "Ceasing all live-fire artillery bombardments and naval training exercises on Puerto Rico's populated island of Vieques.",
    "pole1": "1 = Immediate Military Withdrawal & Comprehensive Environmental Cleanup",
    "pole10": "10 = Essential National Readiness / Continue Navy Exercises",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_section_245i_immigration",
    "name": "Section 245(i) Adjustment of Undocumented Immigrant Status",
    "type": "News",
    "eraSpan": "1998-2002 (Pre-9/11 Border Reform Arc)",
    "domain": "Immigration & Border",
    "tier": 6,
    "debate": "Allowing undocumented workers sponsored by families or employers to pay a $1,000 fine and adjust status in the U.S.",
    "pole1": "1 = Broad Legalization & Pathway to Citizenship",
    "pole10": "10 = Strict Deportation / Enforce 10-Year Unlawful Presence Bars",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_columbine_mental_health_schools",
    "name": "School Security Hardening vs. Gun Control Post-Columbine",
    "type": "News",
    "eraSpan": "1999-2004 (Post-Columbine Security)",
    "domain": "Education",
    "tier": 5,
    "debate": "Deploying armed School Resource Officers and metal detectors versus restricting firearm magazine capacities.",
    "pole1": "1 = Ban Assault Weapons & High-Capacity Magazines / Fund Counselors",
    "pole10": "10 = Hardened Security, Armed Guards & Zero Tolerance Discipline",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 7,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_federal_minimum_wage_hike",
    "name": "Federal Minimum Wage Increase Above $5.15/Hour",
    "type": "Ideological",
    "eraSpan": "1938-2026 (Minimum Wage Arc)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Raising the federal minimum wage by $1.00 to $6.15 per hour over two years.",
    "pole1": "1 = Raise to Living Wage ($10+/hr) / Index to Inflation",
    "pole10": "10 = Freeze or Abolish the Federal Minimum Wage",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_impeachment_morality_backlash",
    "name": "Presidential Ethics Standards & Executive Conduct Standards",
    "type": "News",
    "eraSpan": "1998-2001 (Post-Impeachment Backlash)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Demanding a restoration of 'honor and dignity' in the White House following the Clinton impeachment trial.",
    "pole1": "1 = Partisan Witch Hunt / Private Personal Conduct",
    "pole10": "10 = Condemn Perjury / Demand Absolute Moral Standard in Office",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 4,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2000,
    "id": "2000_microsoft_antitrust_breakup",
    "name": "DOJ Antitrust Action & Structural Breakup of Microsoft",
    "type": "News",
    "eraSpan": "1998-2002 (Tech Monopoly Antitrust)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Court-ordered split of Microsoft into two distinct companies for operating systems and office software.",
    "pole1": "1 = Enforce Aggressive Structural Breakup & Interoperability",
    "pole10": "10 = Free Market Competition / End Government Antitrust Interference",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_cuba_embargo_agricultural_sales",
    "name": "Agricultural & Medical Sanctions Carve-Outs for Cuba",
    "type": "News",
    "eraSpan": "1999-2003 (Sanctions Relief)",
    "domain": "Trade & Globalism",
    "tier": 7,
    "debate": "Allowing U.S. agricultural and pharmaceutical producers to sell goods to Cuba on a cash-only basis.",
    "pole1": "1 = Lift the Cuban Embargo Completely and Unconditionally",
    "pole10": "10 = Maintain Ironclad Embargo Until Castro Is Ousted",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_endangered_species_property_rights",
    "name": "Endangered Species Act Compensation for Landowners",
    "type": "Ideological",
    "eraSpan": "1973-2026 (Property Rights / Conservation)",
    "domain": "Energy & Climate",
    "tier": 7,
    "debate": "Requiring federal cash compensation to private landowners when ESA habitat rules diminish property values.",
    "pole1": "1 = Uncompromised Habitat Protection Over Private Development",
    "pole10": "10 = Full Fifth Amendment Takings Compensation for Landowners",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_clean_air_particulate_soot_rules",
    "name": "EPA Soot & Fine Particulate Ambient Air Standards",
    "type": "Ideological",
    "eraSpan": "1970-2026 (Clean Air Regulation Arc)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Defending EPA's strict 1997 PM2.5 particulate and ozone standards in court against trucking and utility challenges.",
    "pole1": "1 = Public Health Primacy / Enforce Stringent Pollution Reductions",
    "pole10": "10 = Require Cost-Benefit Balancing / Prevent Industrial Burdens",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_hate_crimes_prevention_act",
    "name": "Federal Hate Crimes Expansion for Sexual Orientation",
    "type": "Ideological",
    "eraSpan": "1998-2009 (Hate Crimes Legislation)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Expanding federal hate crime law to protect victims targeted for actual or perceived sexual orientation.",
    "pole1": "1 = Comprehensive Federal Civil Rights & Hate Crime Protections",
    "pole10": "10 = Reject 'Thought Crimes' / Rely Solely on State Violent Crime Laws",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_colombia_aid_plan_colombia",
    "name": "Plan Colombia Military Counternarcotics Aid Package",
    "type": "News",
    "eraSpan": "2000-2008 (Andean Counternarcotics)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Appropriating $1.3 billion in attack helicopters and military training to eradicate Colombian coca plantations.",
    "pole1": "1 = Halt Foreign Drug War Militarization / Condition on Human Rights",
    "pole10": "10 = Aggressive Military Interdiction & Aerial Herbicide Eradication",
    "stances": {
      "dem": 5,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_space_shuttle_iss_funding",
    "name": "International Space Station Construction Outlays",
    "type": "Ideological",
    "eraSpan": "1993-2011 (ISS Construction Era)",
    "domain": "Technology & Infrastructure",
    "tier": 8,
    "debate": "Appropriating multibillion-dollar funding to sustain Space Shuttle assembly flights to the orbital station.",
    "pole1": "1 = Redirect Manned Spaceflight Budget to Earth Science & Poverty",
    "pole10": "10 = Fully Fund NASA Exploration & American Aerospace Leadership",
    "stances": {
      "dem": 5,
      "gop": 8,
      "lib": 5,
      "grn": 3,
      "con": 7,
      "soc": 2
    }
  },
  {
    "cycle": 2000,
    "id": "2000_water_infrastructure_everglades",
    "name": "Comprehensive Everglades Ecosystem Restoration Plan",
    "type": "Ideological",
    "eraSpan": "2000-2026 (Ecological Restoration Arc)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Authorizing an $8 billion 30-year state-federal plan to capture freshwater runoff and restore the Everglades wetlands.",
    "pole1": "1 = Aggressive Federal Wetland Ecosystem Restoration",
    "pole10": "10 = Protect Agricultural Sugar Producers / Limit Federal Land Acquisition",
    "stances": {
      "dem": 3,
      "gop": 6,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_agricultural_emergency_bailouts",
    "name": "Emergency Market Loss Assistance for Commodity Growers",
    "type": "News",
    "eraSpan": "1998-2002 (Depressed Commodity Crisis)",
    "domain": "Economy & Taxation",
    "tier": 7,
    "debate": "Providing $7.1 billion in direct taxpayer relief to grain and oilseed farmers suffering from record-low commodity prices.",
    "pole1": "1 = Transition to Sustainable Farming Support / Cap Big Ag Subsidies",
    "pole10": "10 = Full Disaster Relief for Commercial Grain & Cotton Growers",
    "stances": {
      "dem": 5,
      "gop": 8,
      "lib": 9,
      "grn": 3,
      "con": 6,
      "soc": 3
    }
  },
  {
    "cycle": 2000,
    "id": "2000_internet_sales_tax_moratorium",
    "name": "Internet Tax Freedom Act & Online Sales Tax Moratorium",
    "type": "News",
    "eraSpan": "1998-2018 (E-Commerce Tax Moratorium)",
    "domain": "Technology & Infrastructure",
    "tier": 6,
    "debate": "Barring state and municipal governments from imposing sales taxes on out-of-state online commercial purchases.",
    "pole1": "1 = Level Playing Field / Require Online Retailers to Collect State Sales Taxes",
    "pole10": "10 = Permanent Ban on Internet Sales Taxes",
    "stances": {
      "dem": 5,
      "gop": 9,
      "lib": 10,
      "grn": 4,
      "con": 9,
      "soc": 2
    }
  },
  {
    "cycle": 2000,
    "id": "2000_nuclear_test_ban_ctbt",
    "name": "Comprehensive Nuclear-Test-Ban Treaty (CTBT) Ratification",
    "type": "Ideological",
    "eraSpan": "1996-2026 (Nonproliferation Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Reconsidering Senate ratification of the global treaty banning all explosive nuclear weapons tests.",
    "pole1": "1 = Ratify CTBT / Lead Global Nonproliferation",
    "pole10": "10 = Retain Right to Test / Maintain U.S. Deterrent Reliability",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_drug_importation_canada",
    "name": "Prescription Drug Reimportation From Licensed Canadian Pharmacies",
    "type": "Ideological",
    "eraSpan": "2000-2024 (Drug Pricing Arc)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Legalizing wholesale importation of FDA-approved prescription medications from price-controlled Canadian pharmacies.",
    "pole1": "1 = Authorize Reimportation / Impose Direct Federal Drug Price Caps",
    "pole10": "10 = Bar Reimportation / Protect Drug Safety & Patent R&D Incentives",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_head_start_reauthorization",
    "name": "Federal Head Start Early Childhood Education Expansion",
    "type": "Ideological",
    "eraSpan": "1965-2026 (Early Childhood Welfare)",
    "domain": "Education",
    "tier": 7,
    "debate": "Expanding federal appropriations for Head Start preschool programs versus converting funds into state block grants.",
    "pole1": "1 = Universal Federal Pre-K & Full Head Start Funding",
    "pole10": "10 = Convert to State Block Grants / Eliminate Federal Department of Education",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_labor_ergonomics_standards",
    "name": "OSHA Workplace Ergonomics Repetitive Strain Rule",
    "type": "News",
    "eraSpan": "1999-2001 (OSHA Ergonomics Battle)",
    "domain": "Labor & Welfare",
    "tier": 7,
    "debate": "Promulgating binding federal workplace safety standards requiring employers to adjust equipment to prevent repetitive strain injuries.",
    "pole1": "1 = Enforce Binding OSHA Ergonomics Rules for All Workers",
    "pole10": "10 = Repeal Ergonomics Rule / Protect Employers from Compliance Mandates",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_cuba_wet_foot_dry_foot",
    "name": "'Wet Foot, Dry Foot' Cuban Refugee Interdiction Policy",
    "type": "Ideological",
    "eraSpan": "1995-2017 (Cuban Adjustment Arc)",
    "domain": "Immigration & Border",
    "tier": 8,
    "debate": "Repatriating Cubans intercepted at sea while granting green cards to those reaching dry land.",
    "pole1": "1 = Equal Asylum Rules for All Nationalities / End Special Preference",
    "pole10": "10 = Protect Anti-Communist Dissidents Reaching U.S. Soil",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 5,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_usda_organic_standards",
    "name": "National USDA Organic Certification Standards & GMOs",
    "type": "News",
    "eraSpan": "1997-2002 (Organic Rulemaking)",
    "domain": "Agriculture & Food",
    "tier": 8,
    "debate": "Banning genetically modified organisms, irradiation, and sewage sludge from the USDA Organic label.",
    "pole1": "1 = Strict Organic Purity / Mandatory GMO Disclosure",
    "pole10": "10 = Flexible Agribusiness Definitions / Scientific Equivalence",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2000,
    "id": "2000_defense_of_marriage_act_enforcement",
    "name": "Defense of Marriage Act (DOMA) Federal Enforcement",
    "type": "Ideological",
    "eraSpan": "1996-2013 (DOMA Federal Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Enforcing Section 3 of DOMA to bar federal recognition or spousal benefits for legally married gay couples.",
    "pole1": "1 = Repeal DOMA / Grant Full Federal Equal Rights",
    "pole10": "10 = Defend DOMA / Federal Statutory Ban on Same-Sex Marriage",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_iraq_war_aumf",
    "name": "Authorization for Use of Military Force Against Iraq (AUMF)",
    "type": "News",
    "eraSpan": "2002-2011 (Iraq War Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Authorizing the President to use armed forces against Iraq to enforce UN Security Council resolutions regarding WMDs.",
    "pole1": "1 = Oppose Military Action / Pursue UN Weapons Inspections & Multilateral Diplomacy",
    "pole10": "10 = Broad Executive Authority for Preemptive Military Regime Change",
    "stances": {
      "dem": 5,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_homeland_security_act_civil_service",
    "name": "Department of Homeland Security (DHS) & Civil Service Rules",
    "type": "News",
    "eraSpan": "2001-2004 (Post-9/11 Reorganization)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Consolidating 22 agencies into DHS while granting the President authority to waive union civil service rules for national security.",
    "pole1": "1 = Protect Federal Union Bargaining & Whistleblower Protections",
    "pole10": "10 = Full Presidential Exemption from Civil Service Rules for National Security",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 7,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_usa_patriot_act_surveillance",
    "name": "USA PATRIOT Act & Domestic Surveillance Authorities",
    "type": "News",
    "eraSpan": "2001-2015 (Patriot Act Sunset Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Expanding federal wiretapping, sneak-and-peek search warrants, and National Security Letters without judicial warrants.",
    "pole1": "1 = Repeal Patriot Act / Restore Strict Fourth Amendment Warrant Rules",
    "pole10": "10 = Maximum Counterterrorism Powers / Unfettered Surveillance Authority",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 1,
      "grn": 1,
      "con": 2,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_sarbanes_oxley_accounting_reform",
    "name": "Sarbanes-Oxley Act (SOX) & Corporate Governance Reform",
    "type": "News",
    "eraSpan": "2001-2006 (Enron/WorldCom Aftermath)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Mandating strict criminal liability for corporate executives certifying fraudulent books and creating PCAOB auditor oversight.",
    "pole1": "1 = Strict Corporate Criminal Penalties & Structural Wall Street Regulation",
    "pole10": "10 = Minimize Regulatory Compliance Costs / Protect Free Enterprise",
    "stances": {
      "dem": 2,
      "gop": 6,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_tsa_airport_security_federalization",
    "name": "Federalization of Airport Security Screeners (TSA Creation)",
    "type": "News",
    "eraSpan": "2001-2005 (Aviation Security Overhaul)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Replacing private contract airport screeners with federal civil service personnel under the Transportation Security Administration.",
    "pole1": "1 = 100% Federalized Government Security Workforce with Union Rights",
    "pole10": "10 = Private Competitive Airport Screeners Under Federal Oversight",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_bush_tax_cuts_permanence_egtrra",
    "name": "Making the 2001 Bush Tax Cuts (EGTRRA) Permanent",
    "type": "Ideological",
    "eraSpan": "2001-2012 (Bush Tax Cut Debates)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Permanently enacting the 2001 income tax bracket reductions, child tax credits, and estate tax phaseouts beyond 2010.",
    "pole1": "1 = Repeal Tax Cuts on Top Earners / Rebalance Federal Budget",
    "pole10": "10 = Permanently Lock In All Tax Cuts Across All Brackets",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_no_child_left_behind_testing",
    "name": "No Child Left Behind Mandated Testing & Annual Yearly Progress",
    "type": "News",
    "eraSpan": "2001-2015 (NCLB Accountability Era)",
    "domain": "Education",
    "tier": 2,
    "debate": "Mandating statewide annual testing in reading and math for grades 3-8 and restructuring persistently failing schools.",
    "pole1": "1 = Fully Fund Federal Education Grants / Abolish High-Stakes Standardized Testing",
    "pole10": "10 = Enforce Strict School Accountability & Voucher Restructuring",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_steel_import_tariffs_bush",
    "name": "Bush 30% Protective Steel Import Safeguard Tariffs",
    "type": "News",
    "eraSpan": "2002-2004 (Temporary Safeguard Tariffs)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Imposing temporary 8% to 30% tariffs on imported steel to protect domestic manufacturing in Ohio, Pennsylvania, and West Virginia.",
    "pole1": "1 = Support Industrial Union Workers Against Foreign Subsidized Dumping",
    "pole10": "10 = Free Market Free Trade / Eliminate Retaliatory Trade Distortions",
    "stances": {
      "dem": 4,
      "gop": 6,
      "lib": 10,
      "grn": 3,
      "con": 4,
      "soc": 2
    }
  },
  {
    "cycle": 2002,
    "id": "2002_guantanamo_enemy_combatants",
    "name": "Guantanamo Bay Indefinite Detention & Enemy Combatant Status",
    "type": "Ideological",
    "eraSpan": "2002-2026 (Post-9/11 Detention Jurisprudence)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Holding suspected foreign terrorists indefinitely at Guantanamo Bay without access to civilian courts or Geneva protections.",
    "pole1": "1 = Close Guantanamo / Grant Full Habeas Corpus & Article III Civilian Trials",
    "pole10": "10 = Indefinite Military Detention of Unlawful Enemy Combatants",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_fast_track_trade_promotion",
    "name": "Trade Promotion Authority ('Fast-Track') Renewal",
    "type": "Ideological",
    "eraSpan": "1974-2021 (Trade Authority Arc)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Granting the President expedited authority to negotiate trade agreements that Congress can only vote up or down without amendment.",
    "pole1": "1 = Preserve Congressional Amendment Rights / Mandate Labor-Climate Standards",
    "pole10": "10 = Expedited Executive Authority to Expand Global Market Access",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_farm_security_rural_investment",
    "name": "2002 Farm Bill Target Prices & Subsidies Reversal",
    "type": "News",
    "eraSpan": "2002-2007 (Agricultural Countercyclical Support)",
    "domain": "Agriculture & Food",
    "tier": 4,
    "debate": "Reinstating counter-cyclical price support subsidies and high loan rates for commodity grain and cotton crops.",
    "pole1": "1 = Reorient Subsidies Toward Organic Farmers, Conservation, and Food Stamps",
    "pole10": "10 = Defend Agribusiness Commodity Safety Nets and Crop Subsidies",
    "stances": {
      "dem": 5,
      "gop": 8,
      "lib": 10,
      "grn": 2,
      "con": 6,
      "soc": 2
    }
  },
  {
    "cycle": 2002,
    "id": "2002_bipartisan_campaign_reform_bcra",
    "name": "Bipartisan Campaign Reform Act (McCain-Feingold Enactment)",
    "type": "News",
    "eraSpan": "2002-2010 (BCRA Implementation Arc)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Enacting statutory bans on national party soft money and restricting issue ads 60 days before general elections.",
    "pole1": "1 = Enforce Strict BCRA Limits & Transition to Public Funding",
    "pole10": "10 = Strike Down BCRA as Unconstitutional Violation of Free Speech",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_help_america_vote_act",
    "name": "Help America Vote Act (HAVA) & Touchscreen Voting Terminals",
    "type": "News",
    "eraSpan": "2002-2006 (Voting Technology Upgrade)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Distributing $3 billion to replace punch-card voting machines with electronic voting terminals and centralized voter registries.",
    "pole1": "1 = Require Voter-Verified Paper Audit Trails (VVPAT) for All Ballots",
    "pole10": "10 = Modernize Voting Infrastructure & Require State Photo ID Proof",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_axis_of_evil_doctrine",
    "name": "'Axis of Evil' Security Doctrine & Preemptive Strikes",
    "type": "News",
    "eraSpan": "2002-2006 (Neoconservative Security Doctrine)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Formally naming Iraq, Iran, and North Korea as an 'axis of evil' subject to potential preemptive military force.",
    "pole1": "1 = Multilateral Diplomacy, Treaties, and Regional Nonproliferation",
    "pole10": "10 = Assertive Preemption, Deterrence, and Coercive Regime Change",
    "stances": {
      "dem": 4,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_stem_cell_federal_limits",
    "name": "Federal Funding Limits on Embryonic Stem Cell Lines",
    "type": "Ideological",
    "eraSpan": "2001-2009 (Embryonic Stem Cell Arc)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Limiting federal medical research funds exclusively to the 60 embryonic stem cell lines derived before August 9, 2001.",
    "pole1": "1 = Unrestricted Federal Research Funding for Promising Stem Cell Lines",
    "pole10": "10 = Total Federal Ban on Embryonic Stem Cell Research",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_corporate_stock_option_expensing",
    "name": "Mandatory Stock Option Expensing for Corporate Executives",
    "type": "News",
    "eraSpan": "2002-2005 (Financial Accounting Standards Battle)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Requiring publicly traded corporations to expense employee stock options on corporate balance sheets.",
    "pole1": "1 = Mandatory Expensing to Expose Executive Compensation Excesses",
    "pole10": "10 = Voluntary Disclosure / Shield High-Tech Startup Equity Grants",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_yucca_mountain_approval_override",
    "name": "Congressional Override of Nevada Veto on Yucca Mountain",
    "type": "News",
    "eraSpan": "2002-2004 (Nevada Veto Override)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Passing a joint congressional resolution overriding the Nevada Governor's official veto of Yucca Mountain.",
    "pole1": "1 = Respect Nevada State Sovereignty / Halt Radioactive Waste Shipments",
    "pole10": "10 = Override State Veto / Fulfill National Nuclear Waste Disposal Obligation",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_terrorism_risk_insurance_tria",
    "name": "Terrorism Risk Insurance Act (TRIA) Federal Backstop",
    "type": "News",
    "eraSpan": "2002-2007 (Commercial Real Estate Stability)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Providing a taxpayer-backed federal reinsurance guarantee for catastrophic losses caused by foreign acts of terrorism.",
    "pole1": "1 = Condition Federal Reinsurance on Public Equity and Infrastructure Support",
    "pole10": "10 = Pure Private Insurance Markets / Sunset Federal Risk Exposure",
    "stances": {
      "dem": 4,
      "gop": 6,
      "lib": 9,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_west_coast_port_lockout_taft_hartley",
    "name": "Bush Taft-Hartley Injunction in West Coast Port Lockout",
    "type": "News",
    "eraSpan": "2002 (Maritime Labor Conflict)",
    "domain": "Labor & Welfare",
    "tier": 6,
    "debate": "Invoking federal emergency powers under Taft-Hartley to end an 11-day lockout of 10,500 dockworkers at 29 Pacific ports.",
    "pole1": "1 = Protect Longshore Union Bargaining Power Against Employer Lockout",
    "pole10": "10 = Federal Intervention to Reopen Ports and Safeguard Supply Chains",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_north_korea_uranium_enrichment",
    "name": "North Korean Covert Uranium Enrichment & Fuel Freeze",
    "type": "News",
    "eraSpan": "2002-2006 (Second North Korean Nuclear Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Suspending heavy oil fuel aid to Pyongyang after U.S. diplomats uncover covert uranium enrichment centrifuge programs.",
    "pole1": "1 = Direct Bilateral Talks & Diplomatic Security Guarantees",
    "pole10": "10 = Maximum Sanctions, Naval Interdiction, and Preemptive Options",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_california_after_school_prop49",
    "name": "California Prop 49 (Dedicated State After-School Funding)",
    "type": "News",
    "eraSpan": "2002-2006 (State Education Ballot Initiatives)",
    "domain": "Education",
    "tier": 5,
    "debate": "Earmarking up to $550 million annually in California state funds for public school after-school enrichment programs.",
    "pole1": "1 = Expand Dedicated Public Youth & Community Education Funding",
    "pole10": "10 = Oppose Earmarked Formula Spending / Maintain Budgetary Flexibility",
    "stances": {
      "dem": 3,
      "gop": 6,
      "lib": 9,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_florida_class_size_amendment",
    "name": "Florida Amendment 9 (Constitutional Class Size Limits)",
    "type": "News",
    "eraSpan": "2002-2006 (Class Size Mandate)",
    "domain": "Education",
    "tier": 5,
    "debate": "Amending Florida Constitution to cap public school class sizes at 18 students for K-3 and 22 students for 4-8.",
    "pole1": "1 = Enforceable Class Size Caps for Student Achievement and Equity",
    "pole10": "10 = Reject Unfunded Constitutional Mandates / Local District Discretion",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_nevada_question_2_marriage",
    "name": "Nevada Question 2 (Constitutional Ban on Same-Sex Marriage)",
    "type": "Ideological",
    "eraSpan": "1998-2004 (Early State Marriage Amendments)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Amending the Nevada Constitution to restrict marriage recognition solely to unions between a male and female.",
    "pole1": "1 = Full Marriage Equality & Civil Rights for Same-Sex Couples",
    "pole10": "10 = Constitutional Defense of Traditional Marriage",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_clean_skies_initiative_cap_and_trade",
    "name": "Bush 'Clean Skies' Initiative Cap-and-Trade for Power Plants",
    "type": "News",
    "eraSpan": "2002-2004 (Clean Skies Proposal)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Replacing Clean Air Act New Source Review enforcement with a market-based trading system for sulfur and nitrogen.",
    "pole1": "1 = Enforce Clean Air Act New Source Review & Enact Carbon Caps",
    "pole10": "10 = Market Cap-and-Trade / Exempt Carbon Dioxide from Regulation",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_pension_protection_enron_401k",
    "name": "401(k) Pension Diversification Reforms Post-Enron",
    "type": "News",
    "eraSpan": "2002-2006 (Defined Contribution Reforms)",
    "domain": "Labor & Welfare",
    "tier": 5,
    "debate": "Allowing workers to sell employer stock in 401(k) accounts after three years to prevent Enron-style pension collapse.",
    "pole1": "1 = Mandatory Employer Match Diversification & Defined Benefit Guarantees",
    "pole10": "10 = Voluntary Fiduciary Guidance / Protect Company Stock Contributions",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_unborn_victims_of_violence",
    "name": "Unborn Victims of Violence Act (Fetal Homicide Legislation)",
    "type": "Ideological",
    "eraSpan": "1999-2004 (Fetal Rights Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Recognizing a fetus in utero as a distinct legal victim if killed or injured during the commission of a federal crime.",
    "pole1": "1 = Protect Reproductive Rights / Oppose Codifying Fetal Personhood",
    "pole10": "10 = Full Legal Personhood for Unborn Children Under Criminal Law",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_anthrax_biodefense_spending",
    "name": "Project BioShield & Federal Anthrax Postal Decontamination",
    "type": "News",
    "eraSpan": "2001-2004 (Post-9/11 Biodefense)",
    "domain": "Healthcare",
    "tier": 6,
    "debate": "Appropriating $6 billion for federal stockpiles of vaccines, antibiotics, and postal irradiation systems against anthrax.",
    "pole1": "1 = Public Health Infrastructure & Global Biological Nonproliferation",
    "pole10": "10 = Accelerated Pharmaceutical Biodefense Procurement & Stockpiling",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 6,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_partial_birth_veto_override_push",
    "name": "Federal Partial-Birth Abortion Ban Reintroduction",
    "type": "Ideological",
    "eraSpan": "1995-2003 (Late-Term Abortion Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Passing federal statutory legislation criminalizing late-term intact dilation and extraction abortions without exceptions.",
    "pole1": "1 = Veto Any Abortion Ban Lacking Exception for Maternal Health",
    "pole10": "10 = Complete Ban on Late-Term Procedures Under Federal Criminal Code",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_fbi_reorganization_counterterror",
    "name": "FBI Reorganization from Bank Robbery to Domestic Counterterrorism",
    "type": "News",
    "eraSpan": "2001-2004 (Intelligence Reform Arc)",
    "domain": "Governance & Judiciary",
    "tier": 7,
    "debate": "Shifting hundreds of FBI special agents from traditional criminal cases to domestic counterterrorism intelligence gathering.",
    "pole1": "1 = Maintain Fourth Amendment Civil Liberties & Civilian Law Focus",
    "pole10": "10 = Prioritize Domestic Counterterror Intelligence Over Criminal Caseloads",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 3,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_cuba_embargo_jimmy_carter_visit",
    "name": "Jimmy Carter's Historic Havana Visit & Embargo Debates",
    "type": "News",
    "eraSpan": "2002 (Carter Cuba Mission)",
    "domain": "Foreign Policy & Defense",
    "tier": 7,
    "debate": "Debating normalization of travel and trade with Cuba after former President Carter visits Havana and speaks on live TV.",
    "pole1": "1 = End Travel Bans and Unconditionally Normalize Cuban Relations",
    "pole10": "10 = Retain Full Economic Sanctions Until Democratic Elections in Cuba",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_gun_control_sniper_attacks",
    "name": "Ballistic Fingerprinting & Beltway Sniper Response",
    "type": "News",
    "eraSpan": "2002-2003 (DC Sniper Aftermath)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Establishing a national computerized ballistic database of spent bullet casings from newly manufactured handguns.",
    "pole1": "1 = Mandatory National Ballistic Fingerprint Registry & Gun Licensing",
    "pole10": "10 = Oppose Gun Registries / Second Amendment Infringement",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2002,
    "id": "2002_federal_minimum_wage_stagnation",
    "name": "Federal Minimum Wage Frozen at $5.15",
    "type": "Ideological",
    "eraSpan": "1997-2007 (Minimum Wage Stagnation)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Democratic push to break the 5-year freeze on the federal minimum wage and raise it to $6.65 per hour.",
    "pole1": "1 = Raise Minimum Wage Substantially to Keep Up with Inflation",
    "pole10": "10 = Freeze Minimum Wage to Prevent Small Business Job Losses",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_anwr_drilling_energy_security",
    "name": "ANWR Drilling Reauthorization for Post-9/11 Energy Security",
    "type": "Ideological",
    "eraSpan": "1980-2020 (Energy Exploration Arc)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Promoting Alaskan Arctic wildlife refuge drilling as a patriotic post-9/11 national security necessity.",
    "pole1": "1 = Permanent Wilderness Protection / Shift to Clean Energy",
    "pole10": "10 = Immediate Alaskan Drilling for Energy Independence",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_school_vouchers_zelman_scotus",
    "name": "Supreme Court Voucher Ruling (Zelman v. Simmons-Harris)",
    "type": "News",
    "eraSpan": "2002 (Zelman Supreme Court Decision)",
    "domain": "Education",
    "tier": 4,
    "debate": "Supreme Court ruling upholding taxpayer-funded tuition vouchers used at private religious parochial schools.",
    "pole1": "1 = Protect Public School Budgets & Church-State Separation",
    "pole10": "10 = Expand Parochial School Vouchers Under Free Exercise Clause",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_corporate_tax_inversion_havens",
    "name": "Corporate Tax Inversions & Bermuda Mailbox Addresses",
    "type": "News",
    "eraSpan": "2002-2004 (Early Inversion Scrutiny)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Barring U.S. corporations from reincorporating in Bermuda or the Cayman Islands to avoid paying federal corporate income taxes.",
    "pole1": "1 = Strict Penalties & Loss of Federal Contracts for Inverted Firms",
    "pole10": "10 = Lower U.S. Corporate Tax Rate to Deter Capital Flight",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_puerto_rico_vieques_navy_withdrawal",
    "name": "Executive Agreement on Navy Vieques Range Closure",
    "type": "News",
    "eraSpan": "2001-2003 (Vieques Closure Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Executing the presidential directive to permanently end Navy bombing exercises on Vieques by May 2003.",
    "pole1": "1 = Expedite Closure and Fund Environmental Decontamination",
    "pole10": "10 = Regret Military Training Readiness Loss on Atlantic Range",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_estate_tax_permanence_battle",
    "name": "House Repeal of Sunset on Estate Tax Exemption",
    "type": "Ideological",
    "eraSpan": "1990-2026 (Wealth Taxation Arc)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Passing legislation to permanently abolish the estate tax without the 2010 sunset clause.",
    "pole1": "1 = High Progressive Inheritance Taxes on Wealthy Dynasties",
    "pole10": "10 = Complete Permanent Abolition of the Estate Tax",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_medical_marijuana_ninth_circuit_raids",
    "name": "Federal DEA Raids on California Medical Cannabis Dispensaries",
    "type": "News",
    "eraSpan": "2001-2005 (Raich Pre-Ruling Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Federal DEA agents raiding state-legal medical marijuana patient cooperatives in California under federal supremacy.",
    "pole1": "1 = End Federal DEA Raids / Respect State Compassionate Use Laws",
    "pole10": "10 = Enforce Federal Controlled Substances Act Universally",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_national_id_card_debate",
    "name": "National Identity Card & Biometric Driver's Licenses",
    "type": "News",
    "eraSpan": "2001-2005 (Pre-REAL ID Debate)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Proposals to create a standardized national biometric identification card to verify citizenship and flight access.",
    "pole1": "1 = Strongly Oppose National ID / Protect Constitutional Privacy Rights",
    "pole10": "10 = Mandate Secure National Biometric ID for National Security",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_corporate_whistleblower_protections",
    "name": "Federal Whistleblower Retaliation Shields in Sarbanes-Oxley",
    "type": "News",
    "eraSpan": "2002-2005 (SOX Whistleblower Rights)",
    "domain": "Governance & Judiciary",
    "tier": 6,
    "debate": "Providing federal civil and criminal protections for corporate employees reporting internal fraud.",
    "pole1": "1 = Robust Protection and Financial Rewards for Whistleblowers",
    "pole10": "10 = Protect Companies from Frivolous Whistleblower Litigation",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 7,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_missile_defense_abm_withdrawal_official",
    "name": "Official U.S. Withdrawal from 1972 ABM Treaty",
    "type": "News",
    "eraSpan": "2002 (ABM Treaty Abrogation)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Formal 6-month notice of withdrawal from the Anti-Ballistic Missile Treaty taking effect in June 2002.",
    "pole1": "1 = Dangerous Arms Race Escalation / Recommit to Treaties",
    "pole10": "10 = Exercise Sovereign Right to Defend Homeland from Rogue Missiles",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_social_security_commission_proposals",
    "name": "Bush Social Security Commission Private Account Models",
    "type": "News",
    "eraSpan": "2001-2005 (Moynihan Commission Models)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Releasing three optional models for voluntary personal retirement accounts funded by payroll tax carve-outs.",
    "pole1": "1 = Reject Carve-Outs / Protect Solvency by Raising Tax Cap",
    "pole10": "10 = Implement Voluntary Personal Retirement Accounts",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_death_penalty_atkins_ruling",
    "name": "Supreme Court Ban on Executing Mentally Disabled (Atkins v. VA)",
    "type": "News",
    "eraSpan": "2002 (Atkins SCOTUS Ruling)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Supreme Court ruling that execution of intellectually disabled criminals violates the Eighth Amendment.",
    "pole1": "1 = Affirm Eighth Amendment Humanity / Move Toward Total Abolition",
    "pole10": "10 = Leave Capital Sentencing Standards to State Juries",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_cuba_agricultural_cash_sales_boom",
    "name": "Expansion of U.S. Grain and Poultry Exports to Cuba",
    "type": "News",
    "eraSpan": "2001-2004 (TSRA Export Surge)",
    "domain": "Trade & Globalism",
    "tier": 7,
    "debate": "U.S. agribusinesses exporting hundreds of millions of dollars in rice and chicken to Havana on cash terms.",
    "pole1": "1 = Normalize Trade and Lift Credit Restrictions on Cuba Sales",
    "pole10": "10 = Maintain Cash-in-Advance Requirement / No Credit to Dictatorship",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_clean_water_wetlands_swancc",
    "name": "Clean Water Act Jurisdiction After SWANCC Supreme Court Ruling",
    "type": "News",
    "eraSpan": "2001-2006 (Isolated Wetlands Jurisprudence)",
    "domain": "Energy & Climate",
    "tier": 7,
    "debate": "Army Corps of Engineers narrowing federal Clean Water Act protection over isolated ponds and vernal pools.",
    "pole1": "1 = Pass Clean Water Restoration Act to Protect All Waters",
    "pole10": "10 = Respect State Jurisdiction / Prevent Federal Overreach on Ponds",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_campaign_finance_constitutionality_fights",
    "name": "Legal Challenges to McCain-Feingold (McConnell v. FEC)",
    "type": "News",
    "eraSpan": "2002-2003 (Pre-McConnell Ruling)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Senator Mitch McConnell filing a federal lawsuit challenging BCRA's soft money ban as unconstitutional speech suppression.",
    "pole1": "1 = Defend BCRA to Curb Gilded Age Wealth Corruption",
    "pole10": "10 = Support Lawsuit to Strike Down Unconstitutional Speech Limits",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_nuclear_posture_review_low_yield",
    "name": "Pentagon Nuclear Posture Review & Low-Yield 'Bunker Busters'",
    "type": "News",
    "eraSpan": "2001-2004 (Robust Nuclear Earth Penetrator)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Researching low-yield earth-penetrating nuclear weapons ('bunker busters') to destroy hardened subterranean facilities.",
    "pole1": "1 = Cancel Bunker Buster Research / Prevent Nuclear Normalization",
    "pole10": "10 = Develop Low-Yield Weapons to Deter WMD Deep-Bunker Targets",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_tort_reform_asbestos_trust_funds",
    "name": "National Asbestos Injury Trust Fund Legislation",
    "type": "News",
    "eraSpan": "2002-2006 (Asbestos Liability Crisis)",
    "domain": "Economy & Taxation",
    "tier": 7,
    "debate": "Establishing a $140 billion industry-funded trust to resolve hundreds of thousands of asbestos personal injury suits.",
    "pole1": "1 = Protect Asbestos Victims' Seventh Amendment Rights to Jury Trial",
    "pole10": "10 = Pass Asbestos Trust to Halt Bankruptcies and Frivolous Litigation",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_title_ix_athletics_quota_disputes",
    "name": "Title IX Enforcement & Proportionality Standards in College Sports",
    "type": "Ideological",
    "eraSpan": "1972-2026 (Title IX Sports Gender Equity)",
    "domain": "Civil Rights & Social Issues",
    "tier": 7,
    "debate": "Secretary of Education commission evaluating whether Title IX proportionality tests unfairly force colleges to cut men's wrestling teams.",
    "pole1": "1 = Strict Defense of Title IX Proportionality for Female Athletes",
    "pole10": "10 = Revise Title IX Enforcement to Protect Men's Non-Revenue Sports",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_third_party_exclusion_midterm_debates",
    "name": "Third-Party Exclusion from Congressional Television Debates",
    "type": "Ideological",
    "eraSpan": "1992-2026 (Electoral Reform Arc)",
    "domain": "Governance & Judiciary",
    "tier": 8,
    "debate": "Broadcasters excluding Libertarian, Green, and independent candidates from televised Senate and gubernatorial debates.",
    "pole1": "1 = Open Debates to All Ballot-Qualified Candidates / Ranked Choice Voting",
    "pole10": "10 = Retain Viability Thresholds / Focus on Two Main Parties",
    "stances": {
      "dem": 6,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 1,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_international_criminal_court_asp_act",
    "name": "American Service-Members' Protection Act ('Hague Invasion Act')",
    "type": "News",
    "eraSpan": "2002 (ASPA Enactment)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Authorizing the President to use all means necessary to free U.S. military personnel detained by the International Criminal Court.",
    "pole1": "1 = Repeal ASPA / Cooperate Fully with International War Crimes Courts",
    "pole10": "10 = Ironclad Protection of American Troops from Foreign Courts",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2002,
    "id": "2002_executive_order_presidential_records",
    "name": "Bush Executive Order 13233 on Presidential Records",
    "type": "News",
    "eraSpan": "2001-2009 (Executive Privilege Records)",
    "domain": "Governance & Judiciary",
    "tier": 8,
    "debate": "Granting former presidents and their heirs broad executive authority to withhold historical White House papers from the public.",
    "pole1": "1 = Revoke Order / Enforce Public Access Under Presidential Records Act",
    "pole10": "10 = Defend Inherent Executive Privilege and Candor in Deliberations",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_iraq_war_conduct_fallujah",
    "name": "Conduct of Iraq War & Fallujah Counterinsurgency",
    "type": "News",
    "eraSpan": "2003-2008 (Iraq Insurgency Phase)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Counterinsurgency strategy, casualty rates, and urban warfare in Fallujah and the Sunni Triangle.",
    "pole1": "1 = Phased Troop Withdrawal / Convene Regional Diplomatic Summit",
    "pole10": "10 = 'Stay the Course' / Total Military Victory Over Insurgency",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_abu_ghraib_interrogation_scandal",
    "name": "Abu Ghraib Prisoner Abuse Scandal & Interrogation Policies",
    "type": "News",
    "eraSpan": "2004-2006 (Detainee Abuse Fallout)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Investigating Pentagon command memos authorizing harsh interrogation tactics following public release of prison abuse photos.",
    "pole1": "1 = Independent Special Counsel / Rumsfeld Resignation / Ban Coercive Tactics",
    "pole10": "10 = Treat as Isolated Misconduct of Low-Level Guards / Defend Command",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_federal_marriage_amendment",
    "name": "Federal Constitutional Marriage Amendment (FMA)",
    "type": "Ideological",
    "eraSpan": "2003-2006 (Federal Marriage Amendment Push)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Amending the U.S. Constitution to define marriage as only between a man and woman after Massachusetts legalized gay marriage.",
    "pole1": "1 = Support Full Marriage Equality / Reject Discriminatory Amendments",
    "pole10": "10 = Amend U.S. Constitution to Ban Same-Sex Marriage Nationwide",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_state_marriage_amendments_11_states",
    "name": "11 State Constitutional Marriage Bans on the Ballot",
    "type": "News",
    "eraSpan": "2004 (Super-Tuesday Marriage Amendments)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Ballot measures in 11 states (OH, MI, GA, KY, MS, MT, ND, OK, OR, UT, AR) banning same-sex marriage and civil unions.",
    "pole1": "1 = Vote No / Protect LGBTQ Equal Protection and Dignity",
    "pole10": "10 = Vote Yes / Protect Traditional Marriage in State Constitutions",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_missing_wmds_duelfer_report",
    "name": "Missing Weapons of Mass Destruction (Duelfer Report)",
    "type": "News",
    "eraSpan": "2003-2005 (WMD Intelligence Fallout)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Assessing the Iraq Survey Group report confirming pre-war stockpiles of Iraqi WMDs had been destroyed years prior.",
    "pole1": "1 = Condemn Deceptive Pretext for War / Full Accountability",
    "pole10": "10 = Saddam Had WMD Intent and Strategic Materials / War Justified",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_medicare_part_d_rx_benefit",
    "name": "Medicare Part D Prescription Drug Benefit & Non-Interference",
    "type": "News",
    "eraSpan": "2003-2008 (Medicare Part D Rollout)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Delivering Medicare outpatient drug benefits via private insurance while prohibiting the government from negotiating prices.",
    "pole1": "1 = Authorize Medicare Direct Price Negotiation / Eliminate Donut Hole",
    "pole10": "10 = Retain Private Market Model / Prohibit Government Price Controls",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_swift_boat_veterans_attacks",
    "name": "Swift Boat Veterans for Truth Controversy",
    "type": "News",
    "eraSpan": "2004 (Swift Boat Smear Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Questioning John Kerry's Vietnam combat medals and his 1971 anti-war testimony before the Senate Foreign Relations Committee.",
    "pole1": "1 = Condemn Partisan Smear Campaign Discrediting a Decorated Veteran",
    "pole10": "10 = Expose Discrepancies in Kerry's Service and Anti-War Rhetoric",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_jobs_and_growth_tax_cuts_jgtrra",
    "name": "2003 Capital Gains & Dividend 15% Tax Cut (JGTRRA)",
    "type": "Ideological",
    "eraSpan": "2003-2012 (Capital Taxation Debates)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Slashing top tax rates on corporate dividends and capital gains to 15% to stimulate equity investment.",
    "pole1": "1 = Tax Investment Income as Ordinary Income / End Wealth Loopholes",
    "pole10": "10 = Permanently Lock In 15% (or Zero) Tax on Capital and Dividends",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_federal_assault_weapons_sunset",
    "name": "Expiration of 1994 Federal Assault Weapons Ban",
    "type": "News",
    "eraSpan": "2004 (Assault Weapon Sunset)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Allowing the 10-year ban on manufacture and sale of semiautomatic assault weapons to expire without renewal.",
    "pole1": "1 = Permanently Renew & Expand the Federal Assault Weapons Ban",
    "pole10": "10 = Celebrate Expiration / Protect Lawful Semiautomatic Gun Ownership",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2004,
    "id": "2004_911_commission_recommendations",
    "name": "9/11 Commission Report & Director of National Intelligence (DNI)",
    "type": "News",
    "eraSpan": "2004-2005 (Intelligence Overhaul)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Creating the Director of National Intelligence and National Counterterrorism Center to unify 15 intelligence agencies.",
    "pole1": "1 = Enact All 41 Recommendations of the 9/11 Commission in Full",
    "pole10": "10 = Protect Pentagon Command Authority Over Military Intelligence",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 5,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_stem_cell_california_prop71",
    "name": "California Proposition 71 ($3B State Stem Cell Research Bond)",
    "type": "News",
    "eraSpan": "2004-2008 (State Stem Cell Initiatives)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Issuing $3 billion in state general obligation bonds to bypass federal embryonic stem cell restrictions.",
    "pole1": "1 = Fund Stem Cell Science to Cure Parkinson's, Diabetes, and Paralysis",
    "pole10": "10 = Oppose Taxpayer Subsidies for Destruction of Human Embryos",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_unborn_victims_of_violence_laci",
    "name": "Unborn Victims of Violence Act (Laci and Conner's Law)",
    "type": "News",
    "eraSpan": "2004 (Laci Peterson Enactment)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Enacting federal statute recognizing an embryo or fetus as a separate legal victim during federal violent crimes.",
    "pole1": "1 = Oppose Legal Encroachment on Reproductive Freedom",
    "pole10": "10 = Recognize Legal Personhood and Protection of Unborn Children",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_medical_malpractice_caps",
    "name": "Federal Caps on Non-Economic Medical Malpractice Damages",
    "type": "Ideological",
    "eraSpan": "1995-2010 (Tort Reform Arc)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Enacting a $250,000 federal statutory cap on pain-and-suffering non-economic damages in medical liability suits.",
    "pole1": "1 = Protect Patient Rights to Full Jury Compensation / No Arbitrary Caps",
    "pole10": "10 = Enact $250,000 Cap to Curb Defensive Medicine & Lower Premiums",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_health_savings_accounts_hsas",
    "name": "High-Deductible Health Savings Accounts (HSAs)",
    "type": "Ideological",
    "eraSpan": "2003-2026 (Consumer-Directed Healthcare)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Promoting tax-free Health Savings Accounts paired with high-deductible health plans to encourage consumer cost consciousness.",
    "pole1": "1 = Oppose HSAs as Wealth Shelters / Universal Comprehensive Single-Payer",
    "pole10": "10 = Expand HSAs to Free Healthcare Consumers from Government and HMOs",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_offshoring_benedict_arnold_ceos",
    "name": "Corporate Offshoring & Outsourcing of Manufacturing/IT Jobs",
    "type": "News",
    "eraSpan": "2003-2006 (Job Offshoring Backlash)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Eliminating federal tax deferrals for corporations moving factories overseas and penalizing outsourcing to India and China.",
    "pole1": "1 = Penalize Outsourcing / End Corporate Tax Deferral on Foreign Profits",
    "pole10": "10 = Defend Global Supply Chains & Free Trade / Lower U.S. Corporate Tax",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_fcc_indecency_janet_jackson",
    "name": "FCC Broadcast Indecency Crackdowns & Fines",
    "type": "News",
    "eraSpan": "2004-2008 (Post-Super Bowl Decency Crackdown)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Increasing FCC fines tenfold on broadcast networks for fleeting expletives and sexual content following the Super Bowl incident.",
    "pole1": "1 = Defend First Amendment Free Expression Against Moral Censorship",
    "pole10": "10 = Aggressive Enforcement of Decency Standards on Public Airwaves",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 2,
      "grn": 2,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_darfur_genocide_declaration",
    "name": "Darfur Crisis & Formal Declaration of Genocide",
    "type": "News",
    "eraSpan": "2004-2008 (Darfur Humanitarian Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Declaring Sudanese government and Janjaweed atrocities in Darfur a genocide and demanding UN peacekeeper deployment.",
    "pole1": "1 = International Peacekeeping & Sanctions on Sudanese Regime",
    "pole10": "10 = American Diplomatic Pressure / Avoid Unilateral Troop Commitments",
    "stances": {
      "dem": 3,
      "gop": 6,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_overtime_pay_regulations_flsa",
    "name": "Department of Labor Overtime Exemption Rule Changes",
    "type": "News",
    "eraSpan": "2004 (FLSA Overtime Reclassification)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Reclassifying white-collar supervisory and technical workers to exempt them from mandatory time-and-a-half overtime pay.",
    "pole1": "1 = Protect 40-Hour Week & Overtime Pay for Millions of Workers",
    "pole10": "10 = Modernize Labor Rules for White-Collar Professional Workforce",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_class_action_fairness_act",
    "name": "Class Action Fairness Act (Moving Cases to Federal Courts)",
    "type": "News",
    "eraSpan": "2003-2005 (CAFA Enactment)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Transferring multi-state class-action tort lawsuits from plaintiff-friendly state county courts into federal courts.",
    "pole1": "1 = Protect Consumer and Worker Class Action Access Against Corporate Abuse",
    "pole10": "10 = Curb Forum Shopping by Trial Lawyers in Notorious 'Judicial Hellholes'",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_colorado_amendment_36_ev_split",
    "name": "Colorado Amendment 36 (Proportional Electoral Vote Allocation)",
    "type": "News",
    "eraSpan": "2004 (Proportional EV Ballot Initiative)",
    "domain": "Governance & Judiciary",
    "tier": 6,
    "debate": "Allocating Colorado's 9 Electoral College votes proportionally based on the state's presidential popular vote.",
    "pole1": "1 = Support Proportional EV Allocation Toward Direct Popular Vote",
    "pole10": "10 = Reject Proportional Split / Protect Winner-Take-All State Leverage",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 5,
      "grn": 2,
      "con": 8,
      "soc": 2
    }
  },
  {
    "cycle": 2004,
    "id": "2004_florida_hurricane_fema_relief",
    "name": "Federal Disaster Relief Appropriations for Florida Hurricanes",
    "type": "News",
    "eraSpan": "2004 (Four Florida Hurricanes: Charley, Frances, Ivan, Jeanne)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Authorizing $12+ billion in emergency disaster relief and FEMA mobile housing aid for Florida storm victims before the election.",
    "pole1": "1 = Fully Funded Emergency Disaster Relief & Strengthened Building Codes",
    "pole10": "10 = Efficient Emergency Aid / Prevent Unreimbursed Federal Waste",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 7,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_nclb_unfunded_mandate_backlash",
    "name": "State Bipartisan Rebellion Against NCLB Testing Mandates",
    "type": "News",
    "eraSpan": "2003-2006 (State Resistance to NCLB)",
    "domain": "Education",
    "tier": 5,
    "debate": "State legislative resolutions in Utah and Virginia protesting federal No Child Left Behind testing mandates as unfunded mandates.",
    "pole1": "1 = Substantially Increase Federal Education Funding or Repeal Penalties",
    "pole10": "10 = Enforce Rigorous Federal Standards and Sanctions for Underperformance",
    "stances": {
      "dem": 3,
      "gop": 6,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_partial_birth_abortion_court_fights",
    "name": "Federal Injunctions Against the Partial-Birth Abortion Ban Act",
    "type": "News",
    "eraSpan": "2003-2007 (Gonzales v. Carhart Pre-Ruling)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Federal district judges striking down the Partial-Birth Abortion Ban Act for failing to include a maternal health exception.",
    "pole1": "1 = Affirm Court Decisions Protecting Women's Health and Autonomy",
    "pole10": "10 = Appeal Decisions to Supreme Court to Uphold the Lawful Congressional Ban",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_iraq_coalition_allies_withdrawal",
    "name": "Withdrawal of Spanish and Allied Troops from Iraq Coalition",
    "type": "News",
    "eraSpan": "2004 (Post-Madrid Train Bombing Realignment)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Handling the withdrawal of Spain, Honduras, and the Dominican Republic from the Iraq coalition following the Madrid train bombings.",
    "pole1": "1 = Respect Allied Democratic Mandates / Internationalize Transition to UN",
    "pole10": "10 = Condemn Appeasement of Terrorists / Reinvigorate Coalition of the Willing",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_montana_medical_marijuana_i148",
    "name": "Montana Medical Marijuana Act (Initiative 148)",
    "type": "News",
    "eraSpan": "2004 (Western Medical Marijuana Expansion)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Legalizing the use, cultivation, and possession of marijuana for registered patients with debilitating medical conditions.",
    "pole1": "1 = Protect Patient Access to Medical Cannabis / End Federal Interference",
    "pole10": "10 = Oppose State Marijuana Measures / Enforce Federal Controlled Substances Act",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_cafta_dr_trade_pact",
    "name": "Central American Free Trade Agreement (CAFTA-DR)",
    "type": "News",
    "eraSpan": "2004-2005 (CAFTA Ratification Battle)",
    "domain": "Trade & Globalism",
    "tier": 4,
    "debate": "Eliminating trade barriers and tariffs between the United States and five Central American nations and the Dominican Republic.",
    "pole1": "1 = Reject CAFTA / Protect Domestic Sugar, Textiles, and Central American Labor",
    "pole10": "10 = Ratify CAFTA to Expand Export Markets and Geopolitical Stability",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_bush_guest_worker_immigration",
    "name": "Bush Temporary Worker Immigration Proposal",
    "type": "News",
    "eraSpan": "2004-2007 (Comprehensive Immigration Precursor)",
    "domain": "Immigration & Border",
    "tier": 3,
    "debate": "Creating a legal temporary guest worker program allowing undocumented workers to register without a direct path to citizenship.",
    "pole1": "1 = Comprehensive Pathway to Citizenship / Protect Immigrant Labor Rights",
    "pole10": "10 = Oppose 'Amnesty' / Enforce Immediate Border Security and Workplace Audits",
    "stances": {
      "dem": 3,
      "gop": 6,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_gasoline_prices_two_dollars",
    "name": "Rising Gasoline Prices Passing $2.00/Gallon",
    "type": "News",
    "eraSpan": "2004 (Early Price Spike)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Addressing consumer gasoline price spikes driven by Iraq War instability, China demand growth, and tight refining capacity.",
    "pole1": "1 = Release Strategic Petroleum Reserve / Enact Windfall Taxes on Oil Companies",
    "pole10": "10 = Expand Domestic Drilling in ANWR and OCS / Slash Refining Environmental Rules",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_air_force_boeing_tanker_scandal",
    "name": "Air Force Boeing Tanker Lease Scandal & Pentagon Procurement Ethics",
    "type": "News",
    "eraSpan": "2003-2005 (Druyun Corruption Scandal)",
    "domain": "Governance & Judiciary",
    "tier": 7,
    "debate": "Canceling a $23 billion lease of Boeing 767 aerial refueling tankers following criminal conflict-of-interest revelations by Darleen Druyun.",
    "pole1": "1 = Stringent Pentagon Contract Auditing / End Revolving-Door Defense Lobbying",
    "pole10": "10 = Rapid Tanker Modernization / Protect American Aerospace Industrial Base",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_smart_border_biometric_us_visit",
    "name": "US-VISIT Biometric Fingerprint Screening at Ports of Entry",
    "type": "News",
    "eraSpan": "2004-2006 (Biometric Border Rollout)",
    "domain": "Immigration & Border",
    "tier": 5,
    "debate": "Deploying digital inkless fingerprint scanners and facial photos for foreign visitors arriving at all U.S. international airports.",
    "pole1": "1 = Safeguard Foreign Traveler Civil Liberties & Privacy / Prevent Discrimination",
    "pole10": "10 = Enforce Universal Biometric Entry-Exit Tracking for All Foreign Visitors",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 4,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_guantanamo_rasul_bush_ruling",
    "name": "Supreme Court Detainee Habeas Ruling (Rasul v. Bush)",
    "type": "News",
    "eraSpan": "2004 (Detainee Jurisprudence)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Supreme Court ruling that federal civilian courts have jurisdiction to hear habeas corpus challenges from Guantanamo Bay detainees.",
    "pole1": "1 = Uphold Judicial Review & Fundamental Due Process for All Detainees",
    "pole10": "10 = Pass Legislation Stripping Civilian Courts of Habeas Jurisdiction in Wartime",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_intelligence_reform_act",
    "name": "Intelligence Reform and Terrorism Prevention Act of 2004",
    "type": "News",
    "eraSpan": "2004 (IRTPA Passage)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Statutory creation of the Privacy and Civil Liberties Oversight Board (PCLOB) and the Human Intelligence (HUMINT) coordination office.",
    "pole1": "1 = Strengthen Independent Civil Liberties Oversight Over All Spy Agencies",
    "pole10": "10 = Empower Intelligence Director to Unify and Direct Counterterrorism Operations",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_saudi_arabia_911_allegations",
    "name": "Declassifying 28 Pages of Congressional 9/11 Saudi Inquiries",
    "type": "News",
    "eraSpan": "2003-2016 (28 Pages Declassification Battle)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Demands by 9/11 victims' families to declassify 28 classified pages investigating alleged official Saudi ties to the hijackers.",
    "pole1": "1 = Full Transparency / Declassify All Redacted Findings Without Diplomatic Shields",
    "pole10": "10 = Maintain Diplomatic Classification to Preserve Strategic Saudi Intelligence Alliance",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_corporate_tax_repatriation_holiday",
    "name": "American Jobs Creation Act Homeland Investment Act (HIA)",
    "type": "News",
    "eraSpan": "2004 (Repatriation Tax Holiday)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Offering a one-time 5.25% temporary tax rate on offshore corporate profits repatriated to the United States.",
    "pole1": "1 = Oppose Corporate Tax Holidays / Close Foreign Subsidiary Tax Havens",
    "pole10": "10 = Repatriate Billions of Offshore Capital to Spur U.S. Business Investment",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_federal_deficit_record_412_billion",
    "name": "Federal Budget Deficit Reaching Record $412 Billion",
    "type": "News",
    "eraSpan": "2003-2006 (Post-Surplus Deficit Surge)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Confronting the reversal from budget surplus to a $412 billion annual deficit driven by war spending and tax cuts.",
    "pole1": "1 = Roll Back Top Tax Cuts & Re-impose Statutory Pay-As-You-Go (PAYGO) Caps",
    "pole10": "10 = Cut Non-Defense Discretionary Spending / Grow Out of Deficit Through Tax Cuts",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_clean_air_interstate_rule_cair",
    "name": "EPA Clean Air Interstate Rule (CAIR) for Acid Rain",
    "type": "News",
    "eraSpan": "2004-2008 (CAIR Rulemaking)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Mandating 70% cuts in sulfur dioxide and nitrogen oxide emissions from 28 eastern states using regional cap-and-trade.",
    "pole1": "1 = Strengthen Pollution Caps / Impose Direct Facility Limits Instead of Trading",
    "pole10": "10 = Support Cost-Effective Market Cap-and-Trade / Shield Coal-Fired Utilities",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_alaska_ballot_measure_marijuana",
    "name": "Alaska Ballot Measure 2 (Re-criminalization vs Legalization)",
    "type": "News",
    "eraSpan": "2004 (Alaska Cannabis Referendum)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Voter referendum on legalizing personal adult marijuana possession up to one ounce in Alaska.",
    "pole1": "1 = Affirm Privacy Rights & Legalize Adult Possession",
    "pole10": "10 = Oppose Ballot Measure / Support Federal and State Drug Enforcement",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_california_prop_66_three_strikes",
    "name": "California Proposition 66 (Three Strikes Law Reform)",
    "type": "News",
    "eraSpan": "2004 (Early Sentencing Reform)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Revising California's Three Strikes Law to require that the third strike be a serious or violent felony to trigger 25-to-life.",
    "pole1": "1 = Pass Prop 66 to End Cruel Life Sentences for Petty Nonviolent Offenses",
    "pole10": "10 = Vote No / Protect Three Strikes to Keep Dangerous Recidivists Incarcerated",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_oregon_measure_37_property_takings",
    "name": "Oregon Measure 37 (Compensation for Land Use Regulations)",
    "type": "News",
    "eraSpan": "2004 (Property Rights Takings Initiative)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Requiring governments to compensate landowners or waive regulations when zoning or environmental rules reduce property values.",
    "pole1": "1 = Vote No / Protect Farmland, Forests, and Urban Growth Boundaries",
    "pole10": "10 = Vote Yes / Protect Constitutional Private Property Rights Against Government Taking",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_fda_antidepressant_black_box_warning",
    "name": "FDA Black Box Suicide Warnings on Pediatric Antidepressants (SSRIs)",
    "type": "News",
    "eraSpan": "2004 (Pediatric Drug Safety Crisis)",
    "domain": "Healthcare",
    "tier": 7,
    "debate": "Ordering severe 'black box' warnings on SSRI antidepressants regarding increased suicide risks in children and adolescents.",
    "pole1": "1 = Strict Transparency, Clinical Trial Disclosure, and Patient Protections",
    "pole10": "10 = Balance Warnings to Prevent Scaring Patients Away from Needed Psychiatric Care",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_voter_suppression_felon_disenfranchisement",
    "name": "Felon Disenfranchisement Laws in Florida & Ohio Swing States",
    "type": "Ideological",
    "eraSpan": "1990-2026 (Voting Rights & Restoration Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Challenging state laws that permanently strip voting rights from citizens with prior felony convictions.",
    "pole1": "1 = Automatically Restore Voting Rights Upon Release from Prison",
    "pole10": "10 = Maintain State Disenfranchisement / Require Formal Clemency Petitions",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_nuclear_proliferation_iran_centrifuges",
    "name": "Iranian Covert Centrifuges at Natanz & IAEA Inquiries",
    "type": "News",
    "eraSpan": "2003-2015 (Iranian Nuclear Crisis Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Responding to discovery of Iran's underground uranium enrichment facility at Natanz and coordinating with EU3 diplomats.",
    "pole1": "1 = Diplomatic Negotiations, IAEA Inspections, and Economic Sanctions",
    "pole10": "10 = Demand Immediate Centrifuge Dismantlement / Preemptive Strike Capabilities",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_corporate_tax_manufacturing_deduction",
    "name": "Section 199 Domestic Production Activities Deduction",
    "type": "News",
    "eraSpan": "2004-2017 (Manufacturing Tax Relief)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Enacting a 9% tax deduction for domestic manufacturing income to replace export subsidies ruled illegal by the WTO.",
    "pole1": "1 = Close Corporate Tax Shelters and Invest Directly in Workers",
    "pole10": "10 = Enact Domestic Production Deduction to Keep Factory Jobs in America",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 8,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_military_recruiting_don_t_ask_don_t_tell",
    "name": "'Don't Ask, Don't Tell' Enforcement During Wartime",
    "type": "Ideological",
    "eraSpan": "1993-2011 (DADT Repeal Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Discharging over 1,000 service members annually under DADT while the military faces severe combat troop shortages in Iraq.",
    "pole1": "1 = Repeal DADT / Allow Open Military Service for Gay and Lesbian Troops",
    "pole10": "10 = Uphold DADT to Protect Military Unit Cohesion and Morale",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_libya_wmd_disarmament",
    "name": "Libyan WMD Renunciation & Diplomatic Normalization",
    "type": "News",
    "eraSpan": "2003-2006 (Gaddafi Disarmament Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Rewarding Muammar Gaddafi's decision to surrender Libya's nuclear weapons equipment by lifting trade and travel sanctions.",
    "pole1": "1 = Welcome Disarmament as Triumph of Diplomacy and Verified Nonproliferation",
    "pole10": "10 = Cite Iraq Invasion as Deterrent Proving Coercive Strength Convinced Gaddafi",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 2,
      "con": 7,
      "soc": 2
    }
  },
  {
    "cycle": 2004,
    "id": "2004_electronic_voting_source_code_scrutiny",
    "name": "Open-Source Verification of Diebold Touchscreen Voting Code",
    "type": "News",
    "eraSpan": "2003-2006 (Electronic Voting Crisis)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Demanding independent source-code security audits and mandatory paper ballots after security flaws found in Diebold machines.",
    "pole1": "1 = Mandate Voter-Verified Paper Audit Trails (VVPAT) for Every Touchscreen",
    "pole10": "10 = Defend Proprietary Software Security / Modernize Paperless Voting",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 3,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_cuba_travel_remittance_restrictions",
    "name": "Bush Executive Tightening of Cuban Family Visits and Remittances",
    "type": "News",
    "eraSpan": "2004-2008 (Hardline Cuba Rules)",
    "domain": "Foreign Policy & Defense",
    "tier": 7,
    "debate": "Restricting Cuban-Americans to visiting family in Cuba only once every three years and capping remittances at $100/month.",
    "pole1": "1 = Rescind Inhumane Travel Restrictions / Allow Free Family Reunification",
    "pole10": "10 = Strictly Enforce Currency Restrictions to Deprive the Castro Regime of Cash",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_national_endowment_arts_decency",
    "name": "Federal NEA Grants & Community Decency Standards",
    "type": "Ideological",
    "eraSpan": "1989-2010 (Culture Wars Funding Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 8,
    "debate": "Restricting National Endowment for the Arts grants based on public decency and religious respect criteria.",
    "pole1": "1 = Protect Artistic Free Expression Without Government Ideological Veto",
    "pole10": "10 = Deny Taxpayer Subsidies for Blasphemous or Obscene Artworks",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_asbestos_compensation_stalemate",
    "name": "Fairness in Asbestos Injury Resolution (FAIR) Act Stalemate",
    "type": "News",
    "eraSpan": "2003-2006 (Asbestos Legislative Gridlock)",
    "domain": "Economy & Taxation",
    "tier": 7,
    "debate": "Gridlock over creating a $140 billion no-fault trust fund to resolve hundreds of thousands of asbestos medical claims.",
    "pole1": "1 = Maintain Victims' Constitutional Right to Trial by Jury in State Courts",
    "pole10": "10 = Pass Comprehensive Asbestos Trust to Halt Runaway Bankruptcies",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_nuclear_energy_revitalization_incentives",
    "name": "Federal Loan Guarantees & Production Tax Credits for Nuclear Plants",
    "type": "Ideological",
    "eraSpan": "2004-2026 (Nuclear Renaissance Arc)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Offering federal loan guarantees, standby insurance, and production tax credits to build the first new U.S. nuclear reactors in 30 years.",
    "pole1": "1 = Oppose Nuclear Subsidies / Focus Exclusively on Renewables & Efficiency",
    "pole10": "10 = Aggressively Expand Clean Baseload Nuclear Power Generation",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_third_party_nader_independent_ballot",
    "name": "Ralph Nader Independent Candidacy & Democratic Ballot Challenges",
    "type": "News",
    "eraSpan": "2004 (Democratic Anti-Spoiler Battles)",
    "domain": "Governance & Judiciary",
    "tier": 7,
    "debate": "Democratic Party lawyers filing multi-state ballot challenges to disqualify independent Ralph Nader from swing state ballots.",
    "pole1": "1 = Defend Two-Party Integrity Against Well-Funded Third-Party Spoiler Campaigns",
    "pole10": "10 = Condemn Ballot Lawfare / Uphold Democratic Voter Choice and Access",
    "stances": {
      "dem": 8,
      "gop": 5,
      "lib": 1,
      "grn": 1,
      "con": 2,
      "soc": 1
    }
  },
  {
    "cycle": 2004,
    "id": "2004_child_tax_credit_permanence",
    "name": "Child Tax Credit Expansion to $1,000 per Child",
    "type": "Ideological",
    "eraSpan": "2001-2026 (Family Tax Relief Arc)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Permanently retaining the expansion of the federal child tax credit to $1,000 and making it partially refundable for working parents.",
    "pole1": "1 = Make Child Tax Credit Fully Refundable for Lowest-Income Families",
    "pole10": "10 = Retain Child Tax Credit as Pro-Family Tax Relief / Block Welfare Expansion",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_hurricane_katrina_response_failure",
    "name": "Hurricane Katrina Federal Response Failure & FEMA Reform",
    "type": "News",
    "eraSpan": "2005-2007 (Katrina Fallout)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Investigating the catastrophic federal disaster response, levee breaches in New Orleans, and resignation of FEMA Director Michael Brown.",
    "pole1": "1 = Full Federal Reconstruction of Gulf Coast / Independent Katrina Commission",
    "pole10": "10 = Defend Administration Efforts / Emphasize State and Local Emergency Failures",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_iraq_civil_war_stay_the_course",
    "name": "Iraqi Sectarian Civil War & 'Stay the Course' vs Redeployment",
    "type": "News",
    "eraSpan": "2005-2008 (Iraq Sectarian Escalation)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Confronting sectarian civil war after the al-Askari mosque bombing; choosing between phased redeployment or maintaining troop commitments.",
    "pole1": "1 = Enact Phased Troop Redeployment / Convene Regional Diplomatic Talks",
    "pole10": "10 = 'Stay the Course' / Defeat Terrorists in Baghdad Rather Than at Home",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_jack_abramoff_lobbying_scandal",
    "name": "Jack Abramoff Lobbying Corruption Scandal & K Street Ethics",
    "type": "News",
    "eraSpan": "2005-2007 (K Street Ethics Arc)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Prosecuting lobbyist Jack Abramoff for bribing members of Congress with golf trips and campaign cash in exchange for legislative favors.",
    "pole1": "1 = Comprehensive Lobbying Ban / Close Revolving Door / Ban Corporate Gifts",
    "pole10": "10 = Enforce Existing Criminal Laws Against Corrupt Individuals / Protect Free Speech",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_sensenbrenner_hr4437_felony_bill",
    "name": "Sensenbrenner Border Bill (H.R. 4437) Making Undocumented Status a Felony",
    "type": "News",
    "eraSpan": "2005-2006 (Immigration Polarization Arc)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Passing legislation classifying unlawful presence as a federal felony and criminalizing humanitarian aid to undocumented immigrants.",
    "pole1": "1 = Reject H.R. 4437 / Provide Pathway to Citizenship for 12 Million Immigrants",
    "pole10": "10 = Pass Strict Border Enforcement & Make Unlawful Presence an Aggravated Felony",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_mega_marches_day_without_immigrants",
    "name": "'A Day Without Immigrants' General Strike & Mega-Marches",
    "type": "News",
    "eraSpan": "2006 (Spring Immigrant Rights Mobilization)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "Responding to millions of Latino and immigrant workers striking and marching in major cities waving American and Mexican flags.",
    "pole1": "1 = Support Workers' Dignity & Pass Comprehensive Immigration Reform",
    "pole10": "10 = Condemn Illegal Worker Strikes / Demand Immediate Interior Workplace Raids",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_secure_fence_act_700_miles",
    "name": "Secure Fence Act of 2006 (700 Miles of Double-Layer Fencing)",
    "type": "News",
    "eraSpan": "2006-2008 (Physical Border Barrier)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "Authorizing the construction of 700 miles of reinforced double-layer physical fencing along the southwest border with Mexico.",
    "pole1": "1 = Oppose Ineffective Border Walls / Invest in Smart Technology and Ports",
    "pole10": "10 = Complete 700 Miles of Double-Layer Physical Border Barriers",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_federal_minimum_wage_six_for_06",
    "name": "Raising Federal Minimum Wage from $5.15 to $7.25 ('Six for 06')",
    "type": "News",
    "eraSpan": "2006-2007 (Democratic 110th Agenda)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Passing the first federal minimum wage increase in a decade, raising the wage from $5.15 to $7.25 per hour over three years.",
    "pole1": "1 = Raise to $7.25+ Immediately Without Big Business Tax Giveaways",
    "pole10": "10 = Oppose Minimum Wage Increases as Job Killers for Small Businesses",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_nsa_warrantless_wiretapping",
    "name": "NSA Warrantless Wiretapping (Terrorist Surveillance Program)",
    "type": "News",
    "eraSpan": "2005-2008 (FISA Bypass Scandal)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Executive authorization of NSA intercept of domestic-to-foreign communications without warrants from the FISA Foreign Intelligence Court.",
    "pole1": "1 = Condemn Illegal Warrantless Spying / Enforce Strict FISA Court Compliance",
    "pole10": "10 = Defend Inherent Article II Commander-in-Chief Wartime Surveillance Authority",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 1,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_mark_foley_page_scandal",
    "name": "Mark Foley Congressional Page Scandal & Leadership Inaction",
    "type": "News",
    "eraSpan": "2006 (Fall Election Shock)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Resignation of Florida Congressman Mark Foley over sexually explicit messages sent to underage teenage congressional pages.",
    "pole1": "1 = Condemn GOP House Leadership Coverup / Ethics Overhaul",
    "pole10": "10 = Hold Foley Personally Accountable / Resist Partisan Exploitation",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_military_commissions_act_habeas",
    "name": "Military Commissions Act of 2006 & Habeas Corpus Stripping",
    "type": "News",
    "eraSpan": "2006-2008 (Hamdan v. Rumsfeld Response)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Stripping federal courts of habeas corpus jurisdiction for non-citizen detainees declared unlawful enemy combatants.",
    "pole1": "1 = Restore Habeas Corpus / Prohibit Waterboarding and Coerced Evidence",
    "pole10": "10 = Authorize Military Commissions & Coercive Interrogation Techniques",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 1,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_gas_prices_3_dollars_oil_profits",
    "name": "Gasoline Prices Reaching $3.00/Gallon & Oil Windfall Taxes",
    "type": "News",
    "eraSpan": "2005-2007 (Early Energy Price Spike)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Imposing a federal windfall profits tax on major oil corporations reporting record profits while gas reaches $3.00/gal.",
    "pole1": "1 = Enact Windfall Profits Tax on Big Oil / Subsidize Clean Energy",
    "pole10": "10 = Expand Domestic Drilling / Lower Refining Regulatory Burdens",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_stem_cell_enhancement_veto",
    "name": "Stem Cell Research Enhancement Act & Bush's First Veto",
    "type": "News",
    "eraSpan": "2006-2007 (First Bush Veto)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Bush casting the first veto of his presidency to block federal funding for human embryonic stem cell lines derived from discarded IVF embryos.",
    "pole1": "1 = Override Veto / Expand Federal Funding for Promising Stem Cell Therapies",
    "pole10": "10 = Uphold Veto / Prohibit Taxpayer Subsidies for Destroying Human Life",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_net_neutrality_telecom_reform",
    "name": "Net Neutrality Mandate (Communications, Opportunity, Promotion Act)",
    "type": "News",
    "eraSpan": "2006 (Net Neutrality Genesis)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Barring broadband telecom providers from creating tiered 'fast lanes' or blocking competing web content.",
    "pole1": "1 = Enact Ironclad Federal Net Neutrality Regulations",
    "pole10": "10 = Free Market Broadband / Protect Private Infrastructure Investment",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_south_dakota_abortion_ban_referred",
    "name": "South Dakota Women's Health and Human Life Act (Referred Law 6)",
    "type": "News",
    "eraSpan": "2006 (Total Abortion Ban Ballot Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voter referendum on a state law banning virtually all abortions without exceptions for rape or incest.",
    "pole1": "1 = Vote No / Reject Total Abortion Ban and Protect Women's Health",
    "pole10": "10 = Vote Yes / Protect Unborn Life with Direct Challenge to Roe v. Wade",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_dubai_ports_world_controversy",
    "name": "Dubai Ports World Acquisition of Six Major U.S. Port Terminals",
    "type": "News",
    "eraSpan": "2006 (Port Security Controversy)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Bipartisan congressional resistance forcing a state-owned UAE company to divest ownership of management at six major U.S. ports.",
    "pole1": "1 = Block Foreign Government Control of Critical National Security Infrastructure",
    "pole10": "10 = Support Free International Investment with Friendly Strategic Allies",
    "stances": {
      "dem": 3,
      "gop": 6,
      "lib": 8,
      "grn": 2,
      "con": 9,
      "soc": 2
    }
  },
  {
    "cycle": 2006,
    "id": "2006_missouri_amendment_2_stem_cells",
    "name": "Missouri Amendment 2 (Constitutional Stem Cell Research Protection)",
    "type": "News",
    "eraSpan": "2006 (Missouri Stem Cell Ballot Fight)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Passing a state constitutional amendment protecting all federally permissible stem cell therapies from state criminal bans.",
    "pole1": "1 = Constitutional Protection for Life-Saving Stem Cell Research",
    "pole10": "10 = Oppose Human Cloning and Embryo Destruction",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_pension_protection_act_auto_enroll",
    "name": "Pension Protection Act of 2006 & Automatic 401(k) Enrollment",
    "type": "News",
    "eraSpan": "2006 (Retirement Reform)",
    "domain": "Labor & Welfare",
    "tier": 5,
    "debate": "Encouraging employers to automatically enroll workers in 401(k) plans and tightening defined benefit funding rules.",
    "pole1": "1 = Strengthen Defined Benefit Union Pensions / Protect PBGC Guarantees",
    "pole10": "10 = Promote Automatic Private Savings & Defined Contribution Portability",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_subprime_mortgage_early_cracks",
    "name": "Emerging Subprime Lending Defaults & Exotic ARM Mortgages",
    "type": "News",
    "eraSpan": "2006 (Early Housing Bubble Tremors)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Federal regulators issuing guidance on non-traditional mortgage risks as subprime defaults begin rising.",
    "pole1": "1 = Crack Down on Predatory Subprime Lending & Mandate Affordability",
    "pole10": "10 = Promote Homeownership Access / Avoid Heavy-Handed Lending Mandates",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_minimum_wage_state_ballots_6_states",
    "name": "State Minimum Wage Ballot Measures (AZ, CO, MO, MT, NV, OH)",
    "type": "News",
    "eraSpan": "2006 (Direct Democracy Wage Hikes)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Voter initiatives in 6 states approving constitutional and statutory minimum wage hikes indexed to inflation.",
    "pole1": "1 = Support Citizen-Initiated Wage Hikes Indexed to Inflation",
    "pole10": "10 = Oppose Constitutional Wage Mandates / Protect Small Business Hiring",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_arizona_anti_illegal_immigration_props",
    "name": "Arizona Propositions 100, 102, 103, 300 (Border Ballot Package)",
    "type": "News",
    "eraSpan": "2006 (Arizona Anti-Immigrant Ballot Package)",
    "domain": "Immigration & Border",
    "tier": 4,
    "debate": "State ballot propositions denying bail for undocumented felony suspects, barring punitive damages, and making English the official language.",
    "pole1": "1 = Oppose Punitive State Measures / Protect Equal Rights for All Residents",
    "pole10": "10 = Pass Strict State Measures to Deter Illegal Immigration and Protect Taxpayers",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_alito_supreme_court_confirmation",
    "name": "Samuel Alito Confirmation to Supreme Court (Replacing Sandra Day O'Connor)",
    "type": "News",
    "eraSpan": "2006 (Judicial Shift to Right)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Confirming conservative jurist Samuel Alito to replace swing Justice Sandra Day O'Connor on the Supreme Court.",
    "pole1": "1 = Oppose Alito / Defend Reproductive Rights and Executive Power Checks",
    "pole10": "10 = Confirm Alito to Restore Strict Constructionism and Constitutional Restraint",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_roberts_chief_justice_confirmation",
    "name": "John Roberts Elevation to Chief Justice",
    "type": "News",
    "eraSpan": "2005-2006 (Roberts Court Inception)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Confirming John Roberts as Chief Justice of the United States following the death of William Rehnquist.",
    "pole1": "1 = Scrutinize Voting Rights and Civil Rights Record / Oppose Confirmation",
    "pole10": "10 = Confirm Highly Qualified Jurist Dedicated to Judicial Modesty ('Calling Balls and Strikes')",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_lebanon_israel_war_hezbollah",
    "name": "2006 Lebanon War & Hezbollah Rocket Offensives",
    "type": "News",
    "eraSpan": "2006 (34-Day Lebanon Conflict)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Backing Israel's military offensive in Lebanon against Hezbollah versus demanding an immediate unconditional humanitarian ceasefire.",
    "pole1": "1 = Immediate Humanitarian Ceasefire & UN Peacekeeping Deployment",
    "pole10": "10 = Unconditional Support for Israel to Eradicate Iranian-Backed Hezbollah",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_north_korea_first_nuclear_test",
    "name": "North Korea's First Underground Nuclear Weapons Test",
    "type": "News",
    "eraSpan": "2006 (North Korean Nuclear Breakout)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Imposing UN Chapter VII economic sanctions and naval cargo interdiction following Pyongyang's October 2006 nuclear test detonation.",
    "pole1": "1 = Multi-Party Diplomatic Settlement / Aid in Exchange for Verified Freeze",
    "pole10": "10 = Total Economic Blockade, Interdiction, and Enhanced Ballistic Defense",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_iraq_study_group_report_baker_hamilton",
    "name": "Bipartisan Iraq Study Group (Baker-Hamilton Report)",
    "type": "News",
    "eraSpan": "2006 (Baker-Hamilton Realignment)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Consensus report recommending phased withdrawal of U.S. combat brigades by 2008 and direct diplomatic engagement with Iran and Syria.",
    "pole1": "1 = Adopt Iraq Study Group Recommendations in Full / Transition to Training and Diplomacy",
    "pole10": "10 = Reject Diplomatic Engagement with Iran/Syria / Increase Troop Levels for Victory",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_duke_cunningham_bribery_scandal",
    "name": "Randy 'Duke' Cunningham Defense Contractor Bribery Scandal",
    "type": "News",
    "eraSpan": "2005-2006 (Earmark Corruption Wave)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Eight-year prison sentence for GOP Congressman accepting $2.4M in yachts, antique furniture, and cash bribes for defense earmarks.",
    "pole1": "1 = Complete Elimination of Defense Earmarks & Independent Ethics Commission",
    "pole10": "10 = Prosecute Corrupt Individuals / Retain Lawful Congressional Power of the Purse",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_anwr_drilling_budget_stripping",
    "name": "Stripping ANWR Drilling from the Defense Appropriations Bill",
    "type": "News",
    "eraSpan": "2005-2006 (ANWR Final Filibuster)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Senate filibuster successfully removing Ted Stevens' Arctic refuge drilling rider from the mandatory Pentagon spending bill.",
    "pole1": "1 = Preserve Arctic Wilderness Forever / Keep Drillers Out of ANWR",
    "pole10": "10 = Overcome Obstruction to Tap Billions of Barrels of Domestic Arctic Crude",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_inconvenient_truth_climate_awakening",
    "name": "Al Gore's 'An Inconvenient Truth' & Climate Urgency",
    "type": "News",
    "eraSpan": "2006 (Public Climate Consciousness Spike)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Shifting public climate concern following the theatrical release of Al Gore's global warming documentary film.",
    "pole1": "1 = Enact Mandatory Federal Carbon Cap-and-Trade & Aggressive Green Subsidies",
    "pole10": "10 = Dismiss Exaggerated Climate Alarmism / Protect Cheap Fossil Energy",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_don_t_ask_don_t_tell_repeal_momentum",
    "name": "Military Readiness Strains & Early DADT Repeal Bills",
    "type": "Ideological",
    "eraSpan": "1993-2011 (DADT Repeal Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Introduction of the Military Readiness Enhancement Act to repeal the 1993 ban on openly gay service members.",
    "pole1": "1 = Repeal DADT / End Wasteful Discharges of Mission-Critical Arab Linguists",
    "pole10": "10 = Maintain DADT to Preserve Unit Cohesion in Active War Theaters",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_clean_water_rapanos_scotus",
    "name": "Supreme Court Clean Water Act Ruling (Rapanos v. United States)",
    "type": "News",
    "eraSpan": "2006 (Significant Nexus Standard)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Justice Anthony Kennedy establishing the 'significant nexus' test for federal wetland jurisdiction, creating nationwide permitting confusion.",
    "pole1": "1 = Pass Clean Water Authority Restoration Act to Cover All Tributaries and Wetlands",
    "pole10": "10 = Restrict Federal Clean Water Act Reach strictly to Navigable In-Fact Waterways",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_tom_delay_money_laundering_indictment",
    "name": "Indictment & Resignation of Majority Leader Tom DeLay ('The Hammer')",
    "type": "News",
    "eraSpan": "2005-2006 (Texas Redistricting Ethics)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "House Majority Leader Tom DeLay resigning leadership following Texas state felony indictment for laundering corporate money into state legislative races.",
    "pole1": "1 = Condemn Systemic Corruption and Corporate Money Laundering in Elections",
    "pole10": "10 = Denounce Partisan Political Prosecution by Democratic Texas Prosecutor",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_california_global_warming_solutions_ab32",
    "name": "California Global Warming Solutions Act (AB 32 Cap-and-Trade)",
    "type": "News",
    "eraSpan": "2006 (State Climate Pioneer)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Governor Arnold Schwarzenegger signing landmark state law capping greenhouse gas emissions at 1990 levels by 2020.",
    "pole1": "1 = Support California Pioneering Climate Mandate as National Template",
    "pole10": "10 = Oppose Job-Destroying Energy Regulations and Manufacturing Flight",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_colorado_amendment_44_cannabis",
    "name": "Colorado Amendment 44 (Legalizing One Ounce of Marijuana)",
    "type": "News",
    "eraSpan": "2006 (Early Adult-Use Ballot Fight)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Statewide citizen initiative to legalize the possession of up to one ounce of marijuana for adults aged 21 and older.",
    "pole1": "1 = Support Full Adult Cannabis Legalization & Tax Regulation",
    "pole10": "10 = Vote No / Protect Communities from Increased Drug Abuse and Crime",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_michigan_proposal_2_affirmative_action",
    "name": "Michigan Proposal 2 (Civil Rights Initiative Banning Affirmative Action)",
    "type": "News",
    "eraSpan": "2006 (State Affirmative Action Ban)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Constitutional amendment banning preferential treatment or affirmative action based on race, sex, or ethnicity in public university admissions.",
    "pole1": "1 = Vote No / Defend Affirmative Action to Remedy Historical Discrimination",
    "pole10": "10 = Vote Yes / Enforce Pure Colorblind Merit in All Public Admissions",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_presidential_signing_statements",
    "name": "Bush Presidential Signing Statements & Unitary Executive Theory",
    "type": "News",
    "eraSpan": "2005-2008 (Unitary Executive Power Controversy)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "President Bush issuing hundreds of signing statements asserting constitutional authority to disregard statutory restrictions, such as the McCain Torture Ban.",
    "pole1": "1 = Condemn Signing Statements as Lawless Executive Nullification of Congress",
    "pole10": "10 = Defend Inherent Article II Commander-in-Chief Constitutional Prerogatives",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_mccain_torture_ban_detainee_treatment",
    "name": "McCain Detainee Treatment Act Amendment Banning Cruel Interrogation",
    "type": "News",
    "eraSpan": "2005-2006 (Anti-Torture Amendment)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Congressional amendment prohibiting cruel, inhuman, or degrading treatment of any individual in U.S. custody worldwide.",
    "pole1": "1 = Enforce Absolute Ban on Torture & Waterboarding Without Executive Exceptions",
    "pole10": "10 = Support Commander-in-Chief Discretion for Enhanced Interrogations in Extreme Crises",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_postal_accountability_enhancement_act",
    "name": "Postal Accountability and Enhancement Act (PAEA 75-Year Pre-funding)",
    "type": "News",
    "eraSpan": "2006 (USPS Pension Pre-funding Mandate)",
    "domain": "Labor & Welfare",
    "tier": 6,
    "debate": "Mandating the U.S. Postal Service to pre-fund 75 years of future retiree health benefits within a 10-year window.",
    "pole1": "1 = Protect Postal Workers / Repeal Crippling Pre-Funding Mandate Designed to Starve USPS",
    "pole10": "10 = Enforce Fiscal Discipline on Postal Service to Shield Taxpayers from Future Bailouts",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_cia_secret_prisons_black_sites",
    "name": "Bush Formal Admission of CIA Secret Overseas 'Black Sites'",
    "type": "News",
    "eraSpan": "2006 (Black Sites Disclosure)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "President Bush acknowledging the existence of secret overseas CIA interrogation facilities and transferring 14 high-value detainees to Guantanamo.",
    "pole1": "1 = Shut Down All Clandestine Black Sites / Ban Rendition and Coercive Interrogation",
    "pole10": "10 = Defend Essential Covert Interrogation Operations That Thwarted Imminent Attacks",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_south_dakota_referred_law_6_defeat",
    "name": "South Dakota Voters Reject Total Abortion Ban (56% to 44%)",
    "type": "News",
    "eraSpan": "2006 (Abortion Ban Defeat)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "South Dakota electorate defeating a sweeping statutory abortion ban at the ballot box due to lack of rape and incest exceptions.",
    "pole1": "1 = Defeat Signals Broad Mainstream Consensus Supporting Basic Reproductive Rights",
    "pole10": "10 = Regret Defeat / Redraft Model State Bans with Limited Emergency Exceptions",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_somalia_ethiopian_intervention_icu",
    "name": "Ethiopian Military Intervention in Somalia Backed by U.S.",
    "type": "News",
    "eraSpan": "2006-2009 (Horn of Africa Counterterror)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Providing U.S. intelligence and special forces air support for Ethiopian troops invading Somalia to oust the Islamic Courts Union.",
    "pole1": "1 = Oppose Destabilizing Proxy War / Promote Inclusive Somali Reconciliation",
    "pole10": "10 = Decisive Action to Prevent al-Qaeda From Establishing Safe Haven in the Horn of Africa",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_veterans_affairs_data_theft_laptop",
    "name": "VA Department Laptop Theft Exposing 26 Million Veterans' Records",
    "type": "News",
    "eraSpan": "2006 (Massive Federal Data Breach)",
    "domain": "Technology & Infrastructure",
    "tier": 7,
    "debate": "Congressional hearings after a stolen VA analyst laptop compromises unencrypted Social Security numbers and disability records of 26.5M veterans.",
    "pole1": "1 = Mandate Comprehensive Federal Data Encryption & High-Level Privacy Penalties",
    "pole10": "10 = Discipline Careless Agency Personnel / Protect Veteran Services Without Excess Red Tape",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_trade_deficit_record_760_billion",
    "name": "U.S. Current Account Trade Deficit Reaching Record $760 Billion",
    "type": "News",
    "eraSpan": "2005-2007 (Pre-Crash Trade Imbalance Peak)",
    "domain": "Trade & Globalism",
    "tier": 4,
    "debate": "Mounting economic concern over America's soaring trade deficit with China and oil-exporting nations.",
    "pole1": "1 = Enact Aggressive Manufacturing Industrial Policy & Enforce Trade Remedies Against China",
    "pole10": "10 = Embrace Consumer Price Savings and Foreign Capital Inflows Financing U.S. Investment",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 5,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_plame_cia_leak_libby_indictment",
    "name": "Plame CIA Identity Leak & Perjury Indictment of Scooter Libby",
    "type": "News",
    "eraSpan": "2005-2007 (Valerie Plame Leak Scandal)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Federal Special Counsel Patrick Fitzgerald indicting Vice President Cheney's Chief of Staff Scooter Libby for perjury and obstruction.",
    "pole1": "1 = Condemn Malicious Retaliatory Outing of Undercover CIA Officer Valerie Plame",
    "pole10": "10 = Denounce Overzealous Special Prosecutor Criminalizing Ordinary Washington Press Talks",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_student_loan_interest_cuts_proposal",
    "name": "Cutting Federal Student Loan Interest Rates in Half ('Six for 06')",
    "type": "News",
    "eraSpan": "2006-2007 (College Cost Reduction Act Precursor)",
    "domain": "Education",
    "tier": 4,
    "debate": "Congressional Democratic pledge to cut subsidized Stafford student loan interest rates from 6.8% to 3.4% over five years.",
    "pole1": "1 = Halve Student Loan Rates & Increase Pell Grants to Expand College Access",
    "pole10": "10 = Oppose Subsidizing High College Tuition / Encourage Private Lending Market",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_auto_industry_restructuring_ford_way_forward",
    "name": "Detroit Big Three Automaker Losses & 'Way Forward' Restructuring",
    "type": "News",
    "eraSpan": "2005-2007 (Pre-Crisis Auto Strains)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Ford and General Motors cutting tens of thousands of factory jobs and closing assembly plants as high gas prices crush SUV sales.",
    "pole1": "1 = Provide Federal Transition Assistance & Invest in Next-Gen Hybrid Technologies",
    "pole10": "10 = Allow Market Discipline and Labor Concessions to Restore Auto Competitiveness",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_federal_reserve_bernanke_rate_pauses",
    "name": "Ben Bernanke Taking Helm at Federal Reserve & Pausing Rate Hikes at 5.25%",
    "type": "News",
    "eraSpan": "2006 (Monetary Transition)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Federal Reserve under newly appointed Chairman Ben Bernanke halting two years of rate hikes at 5.25% as housing begins slowing.",
    "pole1": "1 = Maintain Monetary Stimulus to Protect Wage Gains & Working Families",
    "pole10": "10 = Prioritize Price Stability / Prevent Runaway Inflation and Asset Bubbles",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 8,
      "grn": 2,
      "con": 7,
      "soc": 2
    }
  },
  {
    "cycle": 2006,
    "id": "2006_medicare_part_d_rollout_glitches",
    "name": "Initial Rollout Glitches & Confusion in Medicare Part D Prescription Plans",
    "type": "News",
    "eraSpan": "2006 (Part D Implementation)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Dual-eligible low-income seniors turned away from pharmacies during early months of private Medicare Part D enrollment.",
    "pole1": "1 = Fix Flawed Rollout / Direct Federal Safety Net Enrollment & Drug Price Caps",
    "pole10": "10 = Private Competition Overcoming Initial Friction / Over 75% Senior Satisfaction",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_line_item_veto_proposal_bush",
    "name": "Legislative Line-Item Veto Proposal for Appropriations Earmarks",
    "type": "News",
    "eraSpan": "2006 (Earmark Reform)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Granting the President expedited authority to single out individual congressional pork-barrel spending items for separate up-or-down votes.",
    "pole1": "1 = Resist Unconstitutional Executive Encroachment on Article I Spending Powers",
    "pole10": "10 = Grant President Line-Item Veto to Slash Corrupt Waste and Earmarks",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_un_human_rights_council_boycott",
    "name": "U.S. Refusal to Join Newly Created UN Human Rights Council",
    "type": "News",
    "eraSpan": "2006 (UN Reform & Boycott)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Boycotting the reformed UN Human Rights Council over disproportionate anti-Israel resolutions and inclusion of authoritarian regimes.",
    "pole1": "1 = Engage Multilateral UN Bodies to Advance Universal Human Rights Standards",
    "pole10": "10 = Boycott Biased Forum Shielding Human Rights Abusers and Attacking Israel",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2006,
    "id": "2006_minimum_wage_tied_to_estate_tax_cut",
    "name": "GOP 'Trifecta' Bill Linking Minimum Wage Increase to Estate Tax Repeal",
    "type": "News",
    "eraSpan": "2006 (Trifecta Bill Showdown)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "House GOP leadership tying a federal minimum wage hike directly to a permanent slash in the federal estate tax on multimillionaires.",
    "pole1": "1 = Reject Hostage-Taking of Working Wages for Billionaire Tax Giveaways",
    "pole10": "10 = Pass Compromise Balancing Small Business Relief with Wage Hikes",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_tarp_wall_street_bailout",
    "name": "Emergency Economic Stabilization Act ($700B TARP Bailout)",
    "type": "News",
    "eraSpan": "2008-2010 (Financial Crisis Arc)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Authorizing the Treasury Department to purchase up to $700 billion in troubled mortgage-backed assets and inject capital into failing banks.",
    "pole1": "1 = Reject Wall Street Bailout / Direct Aid to Foreclosed Homeowners & Nationalize Banks",
    "pole10": "10 = Oppose Socialism / Reject Taxpayer Capital Injections into Private Institutions",
    "stances": {
      "dem": 4,
      "gop": 6,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_subprime_mortgage_crisis",
    "name": "Subprime Foreclosure Crisis & Foreclosure Prevention",
    "type": "News",
    "eraSpan": "2007-2012 (Great Recession Housing Shock)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Addressing millions of subprime adjustable-rate mortgage defaults, collapsing home values, and mortgage-backed securities insolvency.",
    "pole1": "1 = Mandatory Principal Write-Downs / Federal Moratorium on Foreclosures",
    "pole10": "10 = Free Market Liquidation / Reject Moral Hazard and Subsidies for Bad Borrowers",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_iraq_withdrawal_timetable_sofa",
    "name": "Iraq War Withdrawal Timetable & U.S.-Iraq SOFA Agreement",
    "type": "News",
    "eraSpan": "2007-2011 (Iraq Exit Phase)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Negotiating a bilateral Status of Forces Agreement (SOFA) mandating the full withdrawal of U.S. combat troops by the end of 2011.",
    "pole1": "1 = Set Strict 16-Month Troop Withdrawal Timetable / End the Occupation",
    "pole10": "10 = Maintain Conditions-Based Presence / Victory Secured by Surge",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_gasoline_prices_four_dollars",
    "name": "Gasoline Prices Reaching $4.11/Gallon & 'Drill, Baby, Drill'",
    "type": "News",
    "eraSpan": "2008 (Summer Energy Spike)",
    "domain": "Energy & Climate",
    "tier": 1,
    "debate": "Reversing federal moratoria on Outer Continental Shelf (OCS) offshore drilling in response to record $4/gallon gasoline.",
    "pole1": "1 = Windfall Profits Tax on Big Oil / Invest in Renewable Energy Transit",
    "pole10": "10 = Lift All Offshore and Arctic Drilling Bans / 'Drill, Baby, Drill'",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_auto_industry_bankruptcy_bailout",
    "name": "Emergency Bridge Loans & Bailout for Detroit Big Three Automakers",
    "type": "News",
    "eraSpan": "2008-2010 (Auto Restructuring Arc)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Providing emergency federal financing to General Motors and Chrysler to avert catastrophic liquidation bankruptcy.",
    "pole1": "1 = Fully Back Auto Workers / Condition Aid on Green Fleet Modernization",
    "pole10": "10 = Let Insolvent Automakers Enter Structured Chapter 11 Bankruptcy Without Taxpayer Cash",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_california_proposition_8",
    "name": "California Proposition 8 (Constitutional Ban on Same-Sex Marriage)",
    "type": "News",
    "eraSpan": "2008-2013 (Prop 8 Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Amending the California Constitution to overturn the state supreme court ruling and restrict marriage strictly to heterosexual couples.",
    "pole1": "1 = Vote No / Protect Equal Marriage Rights for Same-Sex Couples",
    "pole10": "10 = Vote Yes / Protect Traditional Marriage in the State Constitution",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_universal_healthcare_mandate_debate",
    "name": "Healthcare Reform: Universal Insurance Mandate vs. Free Market Tax Credits",
    "type": "Ideological",
    "eraSpan": "1993-2026 (Healthcare Reform Arc)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Mandating universal health coverage with employer penalties and public subsidies versus private high-deductible tax credits.",
    "pole1": "1 = Medicare for All Single-Payer System / Public Option",
    "pole10": "10 = Pure Free Market Health Reform / Deregulate Interstate Insurance",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_dc_v_heller_second_amendment",
    "name": "Supreme Court Ruling on Individual Gun Rights (District of Columbia v. Heller)",
    "type": "News",
    "eraSpan": "2008 (Heller Landmark Ruling)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Supreme Court holding that the Second Amendment protects an individual's right to possess a firearm unconnected to service in a militia.",
    "pole1": "1 = Uphold City Handgun Bans & Strong Municipal Gun Safety Laws",
    "pole10": "10 = Affirm Fundamental Individual Right to Keep and Bear Arms for Self-Defense",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 2,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2008,
    "id": "2008_guantanamo_boumediene_ruling",
    "name": "Habeas Corpus Rights for Detainees (Boumediene v. Bush) & Camp Closure",
    "type": "News",
    "eraSpan": "2008-2010 (Boumediene & Guantanamo Closure Order)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Supreme Court ruling granting Guantanamo detainees constitutional habeas corpus rights and Obama's pledge to close the facility.",
    "pole1": "1 = Close Guantanamo Bay Within One Year / Try Suspects in Civilian Courts",
    "pole10": "10 = Keep Guantanamo Open / Military Tribunals for Enemy Combatants",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_fannie_freddie_conservatorship",
    "name": "Federal Takeover & Conservatorship of Fannie Mae and Freddie Mac",
    "type": "News",
    "eraSpan": "2008 (GSE Nationalization)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Placing mortgage giants Fannie Mae and Freddie Mac into federal FHFA conservatorship and pledging up to $200B in taxpayer capital.",
    "pole1": "1 = Public Utility Conversion / Direct Low-Income Housing Guarantees",
    "pole10": "10 = Full Privatization or Liquidation / End Implicit Government Guarantees",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_sarah_palin_populist_conservatism",
    "name": "Sarah Palin Vice Presidential Pick & Populist Grassroots Resurgence",
    "type": "News",
    "eraSpan": "2008 (Tea Party Precursor)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Selecting Alaska Governor Sarah Palin to energize the evangelical base and blue-collar social conservatives.",
    "pole1": "1 = Reject Unqualified Extremism and Anti-Intellectual Populism",
    "pole10": "10 = Champion Grassroots Outsider Patriotism and Working-Class Reform",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 2,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_afghanistan_troop_surge_escalation",
    "name": "Strategic Pivot & Troop Surge to Afghanistan ('The Central Front')",
    "type": "News",
    "eraSpan": "2008-2012 (Afghan Surge Phase)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Shifting U.S. military resources from Iraq to escalate counterinsurgency troop levels against the Taliban in Afghanistan.",
    "pole1": "1 = End Military Interventions / Negotiate Diplomatic Settlement",
    "pole10": "10 = Fully Resource Counterinsurgency Campaign to Defeat Al-Qaeda and Taliban",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_russian_invasion_of_georgia",
    "name": "Russian Military Invasion of Georgia (South Ossetia/Abkhazia)",
    "type": "News",
    "eraSpan": "2008 (Georgia Conflict)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Responding to Russian tanks invading Georgia, halting Tbilisi's NATO Membership Action Plan (MAP).",
    "pole1": "1 = De-escalate via Multilateral Diplomacy and OSCE Observers",
    "pole10": "10 = Fast-Track NATO Accession for Georgia and Ukraine / Re-arm Tbilisi",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_bear_stearns_aig_bailout",
    "name": "Federal Reserve Emergency Financing for Bear Stearns & AIG",
    "type": "News",
    "eraSpan": "2008 (Emergency Fed Credit Facilities)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Federal Reserve providing a $29B Maiden Lane backstop for JPMorgan's Bear Stearns takeover and an $85B loan to rescue AIG.",
    "pole1": "1 = Enforce Glass-Steagall / Break Up Too-Big-To-Fail Conglomerates",
    "pole10": "10 = Abolish Federal Reserve Lender-of-Last-Resort Authority",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_windfall_profits_tax_big_oil",
    "name": "Federal Windfall Profits Tax on Record Oil Company Earnings",
    "type": "News",
    "eraSpan": "2008 (Summer Gas Price Battle)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Levying a windfall excise tax on major oil corporations to fund $1,000 consumer energy relief rebate checks.",
    "pole1": "1 = Tax Excessive Oil Profits to Fund Clean Energy Rebates",
    "pole10": "10 = Oppose Punitive Capital Taxes That Discourage Domestic Exploration",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_colorado_amendment_48_personhood",
    "name": "Colorado Amendment 48 (Constitutional Fetal Personhood from Fertilization)",
    "type": "News",
    "eraSpan": "2008 (First Personhood Ballot Measure)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Defining the term 'person' in the Colorado Constitution to include any human being from the moment of fertilization.",
    "pole1": "1 = Vote No / Protect Contraception, IVF, and Abortion Access",
    "pole10": "10 = Vote Yes / Guarantee Full Constitutional Rights from Conception",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_washington_i1000_assisted_suicide",
    "name": "Washington Initiative 1000 (Death with Dignity Act)",
    "type": "News",
    "eraSpan": "2008 (Assisted Dying Expansion)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Permitting terminally ill, mentally competent adult state residents to request and self-administer lethal medication.",
    "pole1": "1 = Respect Patient Autonomy, Compassion, and Palliative Choice",
    "pole10": "10 = Oppose Assisted Suicide / Protect Sanctity of Life and Vulnerable Elders",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 3,
      "grn": 2,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_california_prop_1a_high_speed_rail",
    "name": "California Proposition 1A ($9.95 Billion High-Speed Rail Bond)",
    "type": "News",
    "eraSpan": "2008 (High-Speed Rail Genesis)",
    "domain": "Technology & Infrastructure",
    "tier": 4,
    "debate": "Authorizing $9.95 billion in state general obligation bonds to initiate construction of an 800-mile 220mph bullet train.",
    "pole1": "1 = Invest in World-Class Zero-Emission High-Speed Transit",
    "pole10": "10 = Oppose Costly Boondoggle Bond Debt and Inevitable Cost Overruns",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_employee_free_choice_act_card_check",
    "name": "Employee Free Choice Act (Card Check Union Certification)",
    "type": "Ideological",
    "eraSpan": "2007-2010 (Labor Organizing Arc)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Allowing workers to form a union once a majority sign authorization cards without requiring secret-ballot elections.",
    "pole1": "1 = Enact Card Check to Rebuild Union Density and Worker Power",
    "pole10": "10 = Protect Secret-Ballot Elections / Resist Union Boss Coercion",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_fisa_amendments_act_telecom_immunity",
    "name": "FISA Amendments Act of 2008 & Telecom Retroactive Immunity",
    "type": "News",
    "eraSpan": "2008 (Section 702 & Immunity)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Codifying Section 702 warrantless foreign intelligence surveillance and granting retroactive immunity to telecoms.",
    "pole1": "1 = Strip Telecom Immunity / Protect Constitutional Privacy",
    "pole10": "10 = Grant Immunity to Patriotic Companies Assisting National Security",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 1,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_michigan_stem_cell_proposal_2",
    "name": "Michigan Proposal 2 (Overturning Ban on New Embryonic Lines)",
    "type": "News",
    "eraSpan": "2008 (State Stem Cell Referendum)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Amending state constitution to allow scientists to derive new embryonic stem cell lines from discarded IVF embryos.",
    "pole1": "1 = Unleash Medical Cures and Attract Biomedical Research Jobs",
    "pole10": "10 = Protect Human Embryonic Life from Exploitation and Destruction",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_south_dakota_initiated_measure_11",
    "name": "South Dakota Measure 11 (Second Total Abortion Ban Defeat)",
    "type": "News",
    "eraSpan": "2008 (Post-Referral Redraft)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Second statewide attempt to ban all abortions, this time with narrow exceptions for rape, incest, and maternal health.",
    "pole1": "1 = Reject Extreme State Abortion Bans / Uphold Roe v. Wade",
    "pole10": "10 = Enact Ban with Exceptions to Challenge Roe Directly in Federal Court",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_colombia_panama_korea_ftas",
    "name": "Pending Bilateral Free Trade Agreements (Colombia, Panama, South Korea)",
    "type": "News",
    "eraSpan": "2007-2011 (Stalled FTA Package)",
    "domain": "Trade & Globalism",
    "tier": 4,
    "debate": "Delaying congressional ratification of negotiated bilateral free trade pacts over Colombian union leader assassinations.",
    "pole1": "1 = Condition Trade Pacts on Verifiable Human Rights and Labor Enforcements",
    "pole10": "10 = Immediately Ratify Stalled Trade Pacts to Open Export Markets",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_federal_minimum_wage_second_step",
    "name": "Second Phase of Federal Minimum Wage Hike to $6.55/Hour",
    "type": "News",
    "eraSpan": "2007-2009 (Fair Minimum Wage Act Implementation)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Implementing the second statutory tier of the 2007 Fair Minimum Wage Act, raising the wage from $5.85 to $6.55/hr.",
    "pole1": "1 = Raise Federal Wage to $10+ Living Wage / Index to Inflation",
    "pole10": "10 = Halt Mandated Wage Hikes During Severe Economic Recession",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_cuba_embargo_unrestricted_family_travel",
    "name": "Lifting Restrictions on Cuban-American Family Travel & Remittances",
    "type": "News",
    "eraSpan": "2008-2009 (Family Travel Opening)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Pledging to eliminate Bush administration restrictions on family visits and cash remittances to Cuban relatives.",
    "pole1": "1 = Lift Inhumane Family Travel and Remittance Limits Unconditionally",
    "pole10": "10 = Maintain Strict Sanctions to Restrict Cash Inflows to the Castro Regime",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_veterans_post_911_gi_bill",
    "name": "Post-9/11 Veterans Educational Assistance Act (Webb GI Bill)",
    "type": "News",
    "eraSpan": "2008 (New GI Bill Enactment)",
    "domain": "Education",
    "tier": 3,
    "debate": "Enacting a landmark comprehensive college tuition and living stipend benefit for military veterans who served after 9/11.",
    "pole1": "1 = Provide Full In-State Public College Tuition & Housing for Post-9/11 Veterans",
    "pole10": "10 = Balance Benefits with Retention Incentives to Prevent Military Brain Drain",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_clean_coal_futuregen_cancellation",
    "name": "FutureGen Carbon Capture Sequestration Project Restructuring",
    "type": "News",
    "eraSpan": "2008 (CCS Technology Fights)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Restructuring the flagship zero-emissions coal-fired power plant demonstration project in Illinois due to soaring costs.",
    "pole1": "1 = Shift Funding Away from 'Clean Coal' Myths Toward Real Renewables",
    "pole10": "10 = Fully Fund Carbon Capture to Protect Baseload Coal Power",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_massachusetts_decriminalization_q2",
    "name": "Massachusetts Question 2 (Decriminalizing One Ounce of Marijuana)",
    "type": "News",
    "eraSpan": "2008 (Cannabis Decriminalization Movement)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Replacing criminal misdemeanor penalties for possessing under an ounce of cannabis with a $100 civil fine.",
    "pole1": "1 = Decriminalize Marijuana to Stop Ruining Lives and Free Up Police",
    "pole10": "10 = Oppose Decriminalization / Maintain Prohibitions to Discourage Youth Drug Use",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_nuclear_energy_loan_guarantees_expansion",
    "name": "Expanding Title XVII Energy Policy Act Nuclear Loan Guarantees",
    "type": "Ideological",
    "eraSpan": "2005-2026 (Nuclear Renaissance Financing)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Tripling federal loan guarantee authority for advanced commercial nuclear reactor construction to $38.5 billion.",
    "pole1": "1 = Eliminate Subsidies for Nuclear Waste and Focus on Solar/Wind",
    "pole10": "10 = Massively Expand Nuclear Baseload Power for Carbon-Free Grid",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_predatory_lending_consumer_financial_agency",
    "name": "Creation of a Dedicated Consumer Financial Protection Agency",
    "type": "News",
    "eraSpan": "2008-2010 (CFPB Genesis)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Elizabeth Warren's proposal to create an independent federal agency regulating mortgages, credit cards, and auto loans.",
    "pole1": "1 = Create Strong Independent Consumer Protection Agency with Enforcement Teeth",
    "pole10": "10 = Oppose Heavy-Handed Regulatory Bureaucracy Constricting Consumer Credit",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_somalia_piracy_naval_interdiction",
    "name": "Gulf of Aden Counter-Piracy Interdiction Task Force",
    "type": "News",
    "eraSpan": "2008-2012 (Somali Maritime Piracy)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Deploying naval warships and maritime patrol aircraft to escort commercial cargo ships and capture Somali pirate skiffs.",
    "pole1": "1 = Combine Maritime Security with Long-Term Aid to Rebuild Somali Economy",
    "pole10": "10 = Aggressive Military Interdiction, Rules of Engagement, and Coastal Patrols",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_executive_privilege_muckasey_contempt",
    "name": "Attorney General Mukasey Refusal to Prosecute Bolton/Miers Contempt",
    "type": "News",
    "eraSpan": "2008 (Executive Contempt Showdown)",
    "domain": "Governance & Judiciary",
    "tier": 6,
    "debate": "Department of Justice refusing to convene a grand jury to prosecute Harriet Miers and Josh Bolten for congressional contempt.",
    "pole1": "1 = Enforce Inherent Congressional Contempt Powers Against Lawless Executive Privilege",
    "pole10": "10 = Defend Inherent Executive Privilege for Presidential Confidential Advisers",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_epa_carbon_endangerment_delay",
    "name": "Bush Administration Refusal to Issue Carbon Endangerment Finding",
    "type": "News",
    "eraSpan": "2007-2009 (Massachusetts v. EPA Backlash)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "EPA Administrator refusing to open an email containing staff scientists' finding that greenhouse gases endanger public health.",
    "pole1": "1 = Immediately Issue Clean Air Act Endangerment Finding and Regulate Carbon",
    "pole10": "10 = Block EPA From Regulating Carbon Dioxide Without Explicit New Laws",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_housing_and_economic_recovery_act_hera",
    "name": "Housing and Economic Recovery Act of 2008 (HERA & Hope for Homeowners)",
    "type": "News",
    "eraSpan": "2008 (HERA Enactment)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Creating the FHFA regulatory agency and establishing the $300 billion FHA Hope for Homeowners refinancing initiative.",
    "pole1": "1 = Strengthen Mandatory Mortgage Modifications and Support Distressed Borrowers",
    "pole10": "10 = Limit Taxpayer Exposure / Prevent Government Micro-management of Housing",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_florida_amendment_2_marriage_ban",
    "name": "Florida Amendment 2 (Constitutional Ban on Same-Sex Marriage)",
    "type": "News",
    "eraSpan": "2008 (Florida Marriage Ballot Fight)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Approving a state constitutional amendment defining marriage as only between a man and woman with 61.9% of the vote.",
    "pole1": "1 = Defend Equal Civil Rights for All Florida Citizens Regardless of Orientation",
    "pole10": "10 = Protect Traditional Marriage with Supermajority Constitutional Mandate",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_arizona_proposition_102_marriage",
    "name": "Arizona Proposition 102 (Constitutional Defense of Marriage)",
    "type": "News",
    "eraSpan": "2008 (Arizona Marriage Amendment)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Voters approving a constitutional amendment stating only a union of one man and one woman shall be recognized as marriage.",
    "pole1": "1 = Oppose Writing Discrimination into the Arizona Constitution",
    "pole10": "10 = Protect Marriage as an Invaluable Foundation of Society and Family",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_iran_enrichment_sanctions_expansion",
    "name": "UN Security Council Resolution 1803 Sanctions on Iranian Assets",
    "type": "News",
    "eraSpan": "2008 (Nuclear Sanctions Ramp)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Tightening international financial sanctions and maritime cargo inspections on Iranian banks expanding Natanz centrifuges.",
    "pole1": "1 = Direct Presidential Engagement Without Preconditions and Multilateral Diplomacy",
    "pole10": "10 = Crippling Secondary Sanctions, Covert Sabotage, and Credible Military Threats",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_colombian_hostage_rescue_operation_jaque",
    "name": "Operation Jaque & Disruption of FARC Guerrilla Leadership",
    "type": "News",
    "eraSpan": "2008 (FARC Hostage Rescue)",
    "domain": "Foreign Policy & Defense",
    "tier": 7,
    "debate": "Colombian military operation freeing Íngrid Betancourt and three American defense contractors without firing a shot.",
    "pole1": "1 = Celebrate Peaceful Liberation / Continue Conditioning Aid on Human Rights",
    "pole10": "10 = Vindication of Plan Colombia Military Intelligence and U.S. Security Assistance",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 5,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_merck_vioxx_settlement_tort_liability",
    "name": "$4.85 Billion Merck Vioxx Product Liability Settlement",
    "type": "News",
    "eraSpan": "2007-2009 (Pharmaceutical Tort Liability)",
    "domain": "Healthcare",
    "tier": 6,
    "debate": "Resolving 27,000 personal injury lawsuits alleging Merck concealed heart attack risks of its arthritis painkiller Vioxx.",
    "pole1": "1 = Hold Negligent Pharma Corporations Fully Accountable in Civil Courts",
    "pole10": "10 = Enact Federal Preemption to Shield FDA-Approved Medicines from State Lawsuits",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_california_prop_2_farm_animal_cages",
    "name": "California Proposition 2 (Standards for Confining Farm Animals)",
    "type": "News",
    "eraSpan": "2008 (Farm Animal Welfare Mandate)",
    "domain": "Agriculture & Food",
    "tier": 5,
    "debate": "Banning gestation crates, veal crates, and battery cages for egg-laying hens that prevent them from turning around freely.",
    "pole1": "1 = End Inhumane Factory Farm Confinement / Protect Animal Welfare",
    "pole10": "10 = Oppose Burdensome Mandates That Inflate Consumer Egg and Pork Prices",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_post_office_closures_saturday_delivery",
    "name": "Postal Deficits & Proposals to Eliminate Saturday Mail Delivery",
    "type": "News",
    "eraSpan": "2008-2012 (Postal Fiscal Crisis)",
    "domain": "Governance & Judiciary",
    "tier": 7,
    "debate": "USPS proposals to cut delivery to five days a week and close rural post offices due to deep pre-funding losses.",
    "pole1": "1 = Protect 6-Day Delivery and Rural Post Offices as Vital Public Infrastructure",
    "pole10": "10 = Allow USPS Operational Flexibility to Cut Costs and Eliminate Unprofitable Days",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_missouri_proposition_b_puppy_mills",
    "name": "Cracking Down on Commercial Dog Breeding Facilities ('Puppy Mills')",
    "type": "News",
    "eraSpan": "2008-2010 (Commercial Breeder Reform)",
    "domain": "Agriculture & Food",
    "tier": 7,
    "debate": "Enacting statutory limits on commercial breeding dog ownership and mandating veterinary care standards.",
    "pole1": "1 = Stop Inhumane Puppy Mill Exploitation Through Enforceable Standards",
    "pole10": "10 = Protect Legitimate Agricultural Dog Breeders from Animal Rights Extremism",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_border_patrol_virtual_fence_sbi_net",
    "name": "Boeing SBInet 'Virtual Fence' Surveillance Tower Delays",
    "type": "News",
    "eraSpan": "2007-2011 (Secure Border Initiative)",
    "domain": "Technology & Infrastructure",
    "tier": 6,
    "debate": "Cost overruns and radar software glitches crippling Boeing's high-tech virtual border surveillance tower project.",
    "pole1": "1 = Cancel Flawed Virtual Fence / Reallocate Funds to Modernizing Ports of Entry",
    "pole10": "10 = Fix Technology Failures and Complete Comprehensive High-Tech Border Coverage",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_iraq_private_security_blackwater_nisour",
    "name": "Blackwater Nisour Square Shooting & Private Contractor Accountability",
    "type": "News",
    "eraSpan": "2007-2010 (Contractor Immunity Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Indicting Blackwater security guards for killing 17 Iraqi civilians in Baghdad and subjecting contractors to U.S. court jurisdiction.",
    "pole1": "1 = Eliminate Armed Mercenaries in War Theaters / Repeal Contractor Legal Immunity",
    "pole10": "10 = Support Private Contractors Performing Vital Diplomatic Protection Missions",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_medicare_advantage_overpayments",
    "name": "Eliminating Private Medicare Advantage 14% Benchmark Overpayments",
    "type": "Ideological",
    "eraSpan": "2007-2015 (Medicare Advantage Reform Arc)",
    "domain": "Healthcare",
    "tier": 5,
    "debate": "Phasing out extra federal subsidies paid to private Medicare Advantage HMOs compared to traditional fee-for-service Medicare.",
    "pole1": "1 = Reclaim Overpayments to Private Insurers to Bolster Traditional Medicare Solvency",
    "pole10": "10 = Protect Medicare Advantage Private Plan Choices and Extra Benefits for Seniors",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_commercial_space_cots_spacex_falcon1",
    "name": "NASA Commercial Orbital Transportation Services (COTS) & SpaceX Launch",
    "type": "News",
    "eraSpan": "2008 (Commercial Space Revolution)",
    "domain": "Technology & Infrastructure",
    "tier": 6,
    "debate": "Awarding billion-dollar NASA cargo resupply contracts to private startups SpaceX and Orbital Sciences.",
    "pole1": "1 = Maintain NASA Public Aerospace Leadership and Federal Workforce Standards",
    "pole10": "10 = Embrace Private Commercial Space Competition to Slash Launch Costs",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 10,
      "grn": 3,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_electric_vehicle_tax_credits",
    "name": "Creation of $7,500 Plug-in Electric Vehicle Federal Tax Credit",
    "type": "News",
    "eraSpan": "2008-2022 (EV Incentive Genesis)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Enacting a consumer tax credit up to $7,500 for purchasing plug-in electric vehicles to launch the EV market.",
    "pole1": "1 = Subsidize Electric Vehicles and Charging Grids to Decarbonize Transportation",
    "pole10": "10 = Oppose Government Picking Winners / End Subsidies for Wealthy Car Buyers",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_corporate_inversion_anti_abuse_rules",
    "name": "Treasury Anti-Inversion Regulations Under Section 7874",
    "type": "News",
    "eraSpan": "2008 (Anti-Inversion Rulemaking)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Tightening Treasury rules regarding ownership percentages required to treat re-incorporated foreign firms as domestic for tax.",
    "pole1": "1 = Aggressively Close Corporate Inversion Havens and Claw Back Unpaid Taxes",
    "pole10": "10 = Lower U.S. Corporate Tax Rate from 35% to Make America Globally Competitive",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_dc_voting_rights_act_stalemate",
    "name": "District of Columbia House Voting Rights Act & Utah Extra Seat",
    "type": "News",
    "eraSpan": "2007-2009 (DC Representation Compromise)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Granting the District of Columbia a full voting member of the House paired with adding a seat for conservative Utah.",
    "pole1": "1 = Grant Full Voting Congressional Representation to DC Citizens",
    "pole10": "10 = Oppose Statutory Seats / Require Constitutional Amendment for Non-States",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_columbia_river_salmon_dams",
    "name": "Pacific Northwest Hydroelectric Dams vs. Endangered Wild Salmon",
    "type": "Ideological",
    "eraSpan": "1995-2026 (Snake River Dam Removal)",
    "domain": "Energy & Climate",
    "tier": 7,
    "debate": "Federal court rejecting federal biological opinions on operating Columbia-Snake River dams due to salmon mortality.",
    "pole1": "1 = Breach Lower Snake River Dams to Restore Wild Salmon Runs and Tribal Treaties",
    "pole10": "10 = Protect Baseload Carbon-Free Hydroelectric Power and Agricultural Barging",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_estate_tax_compromise_parameters",
    "name": "Fixing the Permanent Estate Tax Exemption at $3.5M vs $5M",
    "type": "Ideological",
    "eraSpan": "1990-2026 (Wealth Taxation Arc)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Debating whether to make the 2009 estate tax rate 45% with a $3.5 million exemption permanent before the 2010 zero-tax year.",
    "pole1": "1 = Restore 55% Estate Tax on Fortunes Above $2M to Combat Plutocracy",
    "pole10": "10 = Permanently Abolish the 'Death Tax' or Raise Exemption to $10M+",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2008,
    "id": "2008_broadband_stimulus_universal_access",
    "name": "Federal Universal Broadband Deployment Subsidies",
    "type": "Ideological",
    "eraSpan": "2008-2026 (Digital Divide Infrastructure)",
    "domain": "Technology & Infrastructure",
    "tier": 6,
    "debate": "Federal grant funding to extend fiber and high-speed broadband into underserved rural and low-income urban areas.",
    "pole1": "1 = Universal High-Speed Public Broadband as an Essential Utility",
    "pole10": "10 = Rely on Private Telecom Capital Investment / Avoid Market Distortions",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_affordable_care_act_enactment",
    "name": "Patient Protection and Affordable Care Act (Obamacare) Enactment",
    "type": "News",
    "eraSpan": "2009-2026 (ACA Implementation Arc)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "Passing comprehensive health reform mandating individual insurance coverage, creating state exchanges, and expanding Medicaid.",
    "pole1": "1 = Medicare for All Single-Payer / Strengthen ACA Public Option",
    "pole10": "10 = Full Repeal & Replacement of Obamacare / Abolish Individual Mandate",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_tea_party_movement_rebellion",
    "name": "Tea Party Grassroots Movement & Fiscal Constitutionalism",
    "type": "News",
    "eraSpan": "2009-2016 (Tea Party Era)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Grassroots populist rebellion against the stimulus, bailouts, and national debt, demanding strict originalist constitutional limits.",
    "pole1": "1 = Reject Right-Wing Astroturf and Obstructionism",
    "pole10": "10 = Embrace Constitutional Tea Party Principles to Slash Debt and Government Overreach",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_citizens_united_super_pacs",
    "name": "Citizens United v. FEC Landmark Supreme Court Campaign Finance Ruling",
    "type": "News",
    "eraSpan": "2010-2026 (Super PAC Era)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Supreme Court striking down bans on corporate and union independent political expenditures, enabling Super PACs.",
    "pole1": "1 = Constitutional Amendment to Overturn Citizens United & Ban Corporate Money",
    "pole10": "10 = Defend First Amendment Right to Political Speech for All Associations",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_bp_deepwater_horizon_spill",
    "name": "BP Deepwater Horizon Oil Spill & Deepwater Drilling Moratorium",
    "type": "News",
    "eraSpan": "2010 (Gulf Disaster Arc)",
    "domain": "Energy & Climate",
    "tier": 1,
    "debate": "Federal 6-month moratorium on deepwater offshore oil drilling following the blowout of the Macondo well in the Gulf.",
    "pole1": "1 = Enforce Permanent Offshore Drilling Bans / Criminal Prosecution of BP",
    "pole10": "10 = End Drilling Moratorium / Protect Thousands of Gulf Energy Jobs",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_american_recovery_reinvestment_act",
    "name": "American Recovery & Reinvestment Act of 2009 ($787B Stimulus)",
    "type": "News",
    "eraSpan": "2009-2012 (ARRA Implementation)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Evaluating the efficacy of the $787B federal stimulus bill in stemming Great Recession job losses.",
    "pole1": "1 = Stimulus Was Too Small / Pass Second Major Green Jobs Infrastructure Bill",
    "pole10": "10 = Reckless Wasteful Spending / Failed Keynsian Boondoggle Inflating National Debt",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_arizona_sb_1070_immigration",
    "name": "Arizona SB 1070 ('Support Our Law Enforcement and Safe Neighborhoods Act')",
    "type": "News",
    "eraSpan": "2010-2012 (State Border Enforcement Showdown)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "State law requiring police officers to check immigration status of individuals during lawful stops if reasonable suspicion exists.",
    "pole1": "1 = Condemn SB 1070 as Unconstitutional Racial Profiling / DOJ Civil Rights Lawsuit",
    "pole10": "10 = Uphold State Authority to Secure Borders Where Federal Government Refuses",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_dodd_frank_wall_street_reform",
    "name": "Dodd-Frank Wall Street Reform and Consumer Protection Act",
    "type": "News",
    "eraSpan": "2010-2026 (Dodd-Frank Regulatory Arc)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Comprehensive financial regulatory overhaul creating the CFPB, Volcker Rule proprietary trading ban, and living wills.",
    "pole1": "1 = Break Up Too-Big-To-Fail Banks / Reinstate 1933 Glass-Steagall",
    "pole10": "10 = Repeal Dodd-Frank / Stop Stifling Community Bank Lending with Red Tape",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_dont_ask_dont_tell_repeal",
    "name": "Legislative Repeal of 'Don't Ask, Don't Tell' in Lame-Duck Session",
    "type": "News",
    "eraSpan": "2010-2011 (DADT Repeal Enactment)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Repealing the 1993 military statute to allow gay and lesbian service members to serve openly in the Armed Forces.",
    "pole1": "1 = Full Immediate Repeal / Affirm Universal Equality in Service",
    "pole10": "10 = Oppose Repeal / Protect Unit Cohesion in Active War Theaters",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_waxman_markey_cap_and_trade",
    "name": "Waxman-Markey American Clean Energy and Security Act (Cap-and-Trade)",
    "type": "News",
    "eraSpan": "2009-2010 (Cap-and-Trade Defeat)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "House-passed cap-and-trade bill placing declining statutory limits on national greenhouse gas emissions, dying in the Senate.",
    "pole1": "1 = Enact Economy-Wide Carbon Cap / Green New Deal Transformation",
    "pole10": "10 = Defeat 'Cap-and-Tax' / Protect Manufacturing and Working Families from Energy Price Hikes",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_bush_tax_cuts_compromise_extension",
    "name": "December 2010 Tax Compromise (Two-Year Extension of All Bush Cuts)",
    "type": "News",
    "eraSpan": "2010-2012 (Lame-Duck Tax Deal)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Bipartisan deal extending the Bush tax cuts for all brackets for two years paired with unemployment insurance extension.",
    "pole1": "1 = Oppose Extending Cuts for Top 2% / End Tax Giveaways for Millionaires",
    "pole10": "10 = Extend All Tax Rates to Prevent Shock to Fragile Economic Recovery",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_simpson_bowles_deficit_commission",
    "name": "National Commission on Fiscal Responsibility (Simpson-Bowles Report)",
    "type": "News",
    "eraSpan": "2010-2013 (Grand Bargain Arc)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Proposing a $4 trillion 10-year grand bargain combining entitlement spending caps, chained CPI, and tax loophole closures.",
    "pole1": "1 = Protect Social Security and Medicare from All Cuts / Raise Revenues on Wealth",
    "pole10": "10 = Cut Entitlements and Slash Government Outlays / Reject Major Tax Hikes",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_california_prop_19_marijuana",
    "name": "California Proposition 19 (Regulate, Control, and Tax Cannabis Act)",
    "type": "News",
    "eraSpan": "2010 (First Adult-Use Legalization Measure)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Pioneering ballot measure to legalize personal adult possession of up to one ounce of marijuana and authorize commercial sales.",
    "pole1": "1 = Vote Yes / End the Racist War on Drugs & Generate State Tax Revenues",
    "pole10": "10 = Vote No / Protect Workplaces and Highways from Substance Abuse",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_sotomayor_kagan_supreme_court",
    "name": "Supreme Court Confirmations of Sonia Sotomayor and Elena Kagan",
    "type": "News",
    "eraSpan": "2009-2010 (Obama SCOTUS Nominations)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Confirming Sonia Sotomayor (first Latina justice) and Elena Kagan to replace David Souter and John Paul Stevens.",
    "pole1": "1 = Confirm Pragmatic Jurists Committed to Equal Protection and Civil Rights",
    "pole10": "10 = Oppose Liberal Judicial Activists Who Reject Constitutional Originalism",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_unemployment_9_percent_recovery",
    "name": "Persistent 9.6% National Unemployment & 'Jobless Recovery'",
    "type": "News",
    "eraSpan": "2009-2012 (Post-Crisis Labor Sluggishness)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Addressing 14 million unemployed workers and prolonged median job search times during the painfully slow recovery.",
    "pole1": "1 = Pass Direct Federal Public Works Jobs Program & WPA-Style Employment",
    "pole10": "10 = Slash Taxes, Cut Business Regulations, and Unleash Private Sector Investment",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_individual_mandate_constitutionality",
    "name": "26-State Lawsuit Challenging Constitutionality of ACA Individual Mandate",
    "type": "News",
    "eraSpan": "2010-2012 (Pre-NFIB v. Sebelius)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "State Attorneys General suing in federal court arguing the Commerce Clause cannot compel individuals to buy commercial health insurance.",
    "pole1": "1 = Defend Mandate as Lawful Exercise of Necessary and Proper Interstate Commerce",
    "pole10": "10 = Strike Down Mandate / Congress Cannot Compel Americans to Purchase a Product",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_dream_act_filibuster",
    "name": "DREAM Act Senate Filibuster (Conditional Pathway for Undocumented Youth)",
    "type": "News",
    "eraSpan": "2010 (Lame-Duck DREAM Act Vote)",
    "domain": "Immigration & Border",
    "tier": 3,
    "debate": "Senate filibuster blocking legislation providing conditional residency to undocumented immigrants brought to the U.S. as children.",
    "pole1": "1 = Pass the DREAM Act Immediately to Welcome Blameless Youth",
    "pole10": "10 = Filibuster DREAM Act / Reject Piecemeal Amnesties Encouraging Illegal Influx",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_wikileaks_afghan_war_logs",
    "name": "WikiLeaks Release of Classified Afghan War Logs & State Dept Cables",
    "type": "News",
    "eraSpan": "2010-2012 (Manning Leaks)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Chelsea Manning's leak of hundreds of thousands of classified military reports and diplomatic cables exposing civilian casualties.",
    "pole1": "1 = Protect Whistleblowers and Public Right to Know Truth About War Crimes",
    "pole10": "10 = Prosecute Leakers and WikiLeaks for Compromising Sources and Endangering Troops",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_new_start_treaty_ratification",
    "name": "New START Nuclear Arms Reduction Treaty with Russia",
    "type": "News",
    "eraSpan": "2010 (New START Ratification)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Ratifying bilateral treaty with Moscow capping deployed strategic nuclear warheads at 1,550 and re-establishing on-site inspections.",
    "pole1": "1 = Ratify Treaty to Advance Nuclear Nonproliferation and Strategic Stability",
    "pole10": "10 = Demand Modernization Funding First / Beware Russian Non-Compliance",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_solyndra_loan_guarantee_scrutiny",
    "name": "Section 1705 Clean Energy Loan Guarantee to Solyndra ($535M)",
    "type": "News",
    "eraSpan": "2009-2012 (Clean Tech Loan Controversy)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Awarding a $535 million federal stimulus loan guarantee to cylindrical solar panel maker Solyndra before its collapse.",
    "pole1": "1 = Defend Venture-Style Public Investment in Emerging Clean Technologies",
    "pole10": "10 = Investigate Crony Capitalism and Political Favoritism in Green Energy Loans",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_food_safety_modernization_act",
    "name": "FDA Food Safety Modernization Act (FSMA Preventive Controls)",
    "type": "News",
    "eraSpan": "2010-2011 (Food Safety Overhaul)",
    "domain": "Agriculture & Food",
    "tier": 4,
    "debate": "Shifting federal food safety focus from responding to contamination to preventing it with mandatory facility recalls.",
    "pole1": "1 = Comprehensive Mandatory Preventive Controls Across All Food Processors",
    "pole10": "10 = Protect Small Local Family Farms from Crushing Compliance Burdens",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_disclose_act_filibuster",
    "name": "DISCLOSE Act Filibuster (Transparency for Super PAC Dark Money)",
    "type": "News",
    "eraSpan": "2010 (Post-Citizens United Transparency Push)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Senate filibuster defeating bill requiring corporations and unions spending over $10,000 in campaigns to disclose top donors.",
    "pole1": "1 = Mandate Immediate Transparency and Public Disclosure for All Political Spending",
    "pole10": "10 = Protect Donor Privacy Against Harassment and Boycotts",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_cornyn_earmark_moratorium",
    "name": "Bipartisan Moratorium on Congressional Spending Earmarks",
    "type": "News",
    "eraSpan": "2010-2021 (Earmark Ban Era)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Voluntary and statutory moratoria banning member-directed pork-barrel spending earmarks in appropriations bills.",
    "pole1": "1 = Retain Earmarks as Legitimate Article I Legislative Grease for Bipartisanship",
    "pole10": "10 = Completely Ban Corrupt Pork-Barrel Earmarks and Bridge-to-Nowhere Waste",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 8,
      "grn": 2,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_colorado_amendment_62_personhood",
    "name": "Colorado Amendment 62 (Second Fetal Personhood Measure)",
    "type": "News",
    "eraSpan": "2010 (Second Personhood Defeat)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Voters overwhelmingly rejecting for a second time an amendment defining personhood as beginning at fertilization.",
    "pole1": "1 = Vote No / Protect Comprehensive Reproductive Healthcare and IVF",
    "pole10": "10 = Vote Yes / Stand for Moral Principle That Life Begins at Fertilization",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_oklahoma_state_question_755_sharia",
    "name": "Oklahoma State Question 755 ('Save Our State' Amendment Banning Sharia)",
    "type": "News",
    "eraSpan": "2010 (Anti-Sharia Legislation Wave)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Constitutional amendment barring state courts from considering international law or Islamic Sharia law in rulings.",
    "pole1": "1 = Vote No / Unconstitutional Discrimination Violating the First Amendment",
    "pole10": "10 = Vote Yes / Protect State Legal System from Foreign Religious Creep",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_student_loan_direct_lending_takeover",
    "name": "Elimination of Private Bank Subsidies & Transition to 100% Direct Lending",
    "type": "News",
    "eraSpan": "2010 (Direct Loan Enactment)",
    "domain": "Education",
    "tier": 3,
    "debate": "Ending federal subsidies to commercial banks originating Stafford loans and transitioning all lending to the Department of Education.",
    "pole1": "1 = Eliminate Wasteful Bank Subsidies and Reinvest Savings into Pell Grants",
    "pole10": "10 = Oppose Government Takeover of Private Student Lending / Return to Market",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_haiti_earthquake_humanitarian_response",
    "name": "Operation Unified Response for 2010 Haiti Earthquake Relief",
    "type": "News",
    "eraSpan": "2010 (Haiti Disaster Response)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Deploying 20,000 U.S. troops, aircraft carrier USS Carl Vinson, and $1.15B in humanitarian disaster aid to Port-au-Prince.",
    "pole1": "1 = Full Humanitarian Debt Relief and Long-Term Reconstruction Assistance",
    "pole10": "10 = Provide Immediate Emergency Relief While Preventing Long-Term Dependency",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_cuba_travel_liberalization_regs",
    "name": "Treasury Regulatory Easing on Academic, Religious, and Cultural Cuba Travel",
    "type": "News",
    "eraSpan": "2009-2011 (People-to-People Travel Rules)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Expanding licenses for purposeful 'people-to-people' educational and religious travel to Cuba.",
    "pole1": "1 = Full Freedom of Travel for All Americans / Dismantle Embargo",
    "pole10": "10 = Oppose Travel Easing That Provides Hard Currency to Castro Security Services",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_fed_quantitative_easing_two_qe2",
    "name": "Federal Reserve $600 Billion Second Round of Quantitative Easing (QE2)",
    "type": "News",
    "eraSpan": "2010-2011 (QE2 Bond Purchases)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Federal Reserve purchasing $600 billion in longer-term Treasury bonds to lower real interest rates and avert deflation.",
    "pole1": "1 = Necessary Monetary Support for Jobs and Wage Growth",
    "pole10": "10 = Dangerously Reckless Money Printing Debasing the U.S. Dollar",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2010,
    "id": "2010_yemen_al_qaeda_drone_strikes",
    "name": "Escalation of CIA & JSOC Drone Strikes in Yemen (AQAP)",
    "type": "News",
    "eraSpan": "2009-2015 (Yemen Drone Campaign)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Expanding covert targeted drone missile strikes against al-Qaeda in the Arabian Peninsula following the underwear bomb plot.",
    "pole1": "1 = Cease Extrajudicial Drone Assassinations / Ensure Judicial Transparency",
    "pole10": "10 = Lethal Precision Strikes Are Essential to Eliminate Terrorists in Ungoverned Spaces",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_arizona_ethnic_studies_ban_hb2281",
    "name": "Arizona House Bill 2281 Banning Mexican-American Ethnic Studies",
    "type": "News",
    "eraSpan": "2010 (Ethnic Studies Curriculum Battle)",
    "domain": "Education",
    "tier": 5,
    "debate": "Prohibiting public school courses designed primarily for pupils of a particular ethnic group or advocating ethnic solidarity.",
    "pole1": "1 = Celebrate Culturally Relevant Education / Protect Diverse History Curricula",
    "pole10": "10 = Ban Divisive Curricula Teaching Anti-American Resentment and Racial Division",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_epa_tailoring_rule_greenhouse_gases",
    "name": "EPA Greenhouse Gas Tailoring Rule for Major Industrial Facilities",
    "type": "News",
    "eraSpan": "2010-2014 (Clean Air Act GHG Permitting)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Phasing in Clean Air Act Title V operating permits for facilities emitting over 75,000 tons of carbon dioxide per year.",
    "pole1": "1 = Enforce Aggressive Clean Air Act Regulation on Industrial Carbon Polluters",
    "pole10": "10 = Overturn Tailoring Rule / Stop EPA Power Grab Over Factories and Power Plants",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_wall_street_executive_pay_caps_tarp",
    "name": "Pay Czar Kenneth Feinberg Salary Caps on TARP-Assisted Executives",
    "type": "News",
    "eraSpan": "2009-2010 (TARP Compensation Oversight)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Special Master cutting total cash compensation by 50% for top earners at firms receiving extraordinary taxpayer assistance.",
    "pole1": "1 = Enact Permanent Wealth and Executive Pay Caps Across Entire Financial Sector",
    "pole10": "10 = Eliminate Government Interference in Private Corporate Compensation Contracts",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_missouri_proposition_b_puppy_mills_enact",
    "name": "Missouri Proposition B (Voter Approval of Commercial Dog Standards)",
    "type": "News",
    "eraSpan": "2010 (Missouri Puppy Mill Initiative)",
    "domain": "Agriculture & Food",
    "tier": 6,
    "debate": "Voters narrowly passing statutory limits on commercial breeding operations, later altered by state legislature.",
    "pole1": "1 = Respect Citizen Ballot Mandate to Protect Animal Welfare",
    "pole10": "10 = Prevent Out-of-State Animal Rights Groups from Harming Missouri Agriculture",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_credit_card_act_of_2009_implementation",
    "name": "Credit Card Accountability, Responsibility, and Disclosure (CARD) Act",
    "type": "News",
    "eraSpan": "2009-2011 (Consumer Credit Rules)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Restricting retroactive interest rate increases, double-cycle billing, and hidden fee traps on consumer credit cards.",
    "pole1": "1 = Enforce Stringent Usury Limits and Protect Consumers from Predatory Debt",
    "pole10": "10 = Preserve Bank Pricing Flexibility / Resist Price Controls That Restrict Credit Access",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_clean_energy_standard_ces_debate",
    "name": "Federal Clean Energy Standard (CES) Including Nuclear & Clean Coal",
    "type": "Ideological",
    "eraSpan": "2010-2015 (Clean Energy Standard Proposals)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Mandating electric utilities generate 80% of electricity from clean sources by 2035, defining clean to include nuclear and gas.",
    "pole1": "1 = Strict 100% Renewable Standard / Exclude Nuclear, Gas, and Biomass",
    "pole10": "10 = Technology-Neutral Market Options / Protect Abundant Fossil Fuels",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_california_prop_23_ab32_suspension",
    "name": "California Proposition 23 (Attempt to Suspend AB 32 Climate Law)",
    "type": "News",
    "eraSpan": "2010 (Oil Industry Climate Referendum)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Ballot measure funded by out-of-state oil refiners to suspend California's AB 32 until unemployment dropped below 5.5%.",
    "pole1": "1 = Defeat Prop 23 / Lead Global Green Energy Innovation and Clean Air",
    "pole10": "10 = Support Prop 23 to Protect Working-Class Jobs During Severe Economic Distress",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_washington_initiative_1098_income_tax",
    "name": "Washington Initiative 1098 (High-Earner State Income Tax Proposal)",
    "type": "News",
    "eraSpan": "2010 (State Tax Overhaul Referendum)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Citizen initiative to establish an income tax on individuals earning over $200,000 to fund public education and healthcare.",
    "pole1": "1 = Vote Yes / Tax the Wealthiest to Fund Schools and Relieve Regressive Sales Taxes",
    "pole10": "10 = Vote No / Protect Washington's Competitive Advantage as an Income-Tax-Free State",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_colorado_prop_101_tax_slash",
    "name": "Colorado Proposition 101, Amendment 60 & 61 ('Three Graces' Tax Slash)",
    "type": "News",
    "eraSpan": "2010 (TABOR Tax Slash Ballot Fight)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Sweeping ballot initiatives to slash vehicle, income, and telecom taxes and bar government borrowing.",
    "pole1": "1 = Defeat Measures That Would Destroy State Education, Highways, and Bond Ratings",
    "pole10": "10 = Slash Taxes and Limit Government Debt to Return Money to Working Taxpayers",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_fast_and_furious_atf_operation",
    "name": "ATF Operation Fast and Furious 'Gunwalking' Scandal",
    "type": "News",
    "eraSpan": "2010-2012 (Gunwalking Controversy)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Congressional investigation into ATF Phoenix field division deliberately allowing 2,000 illegal firearms to 'walk' to Mexican drug cartels.",
    "pole1": "1 = Fix Interagency Coordination Failures While Enacting Stronger Gun Trafficking Laws",
    "pole10": "10 = Hold Attorney General Holder in Contempt / Investigate Anti-Gun Agenda Conspiracy",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_cronyism_solyndra_inspector_general",
    "name": "Department of Energy Inspector General Audits of Clean Energy Loans",
    "type": "News",
    "eraSpan": "2010-2012 (Loan Program Governance)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Oversight audits reviewing expedited vetting processes and political pressures surrounding the Solyndra loan closing.",
    "pole1": "1 = Strengthen Programmatic Safeguards While Continuing Bold Clean Energy Innovation",
    "pole10": "10 = Terminate Clean Energy Loan Program to End Corporate Welfare and Waste",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_somalia_al_shabaab_kampala_bombings",
    "name": "Uganda World Cup Bombings by Al-Shabaab & AMISOM Support",
    "type": "News",
    "eraSpan": "2010 (East African Terror Surge)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Providing military equipment and drone surveillance to the African Union Mission in Somalia (AMISOM) after twin bombings in Kampala.",
    "pole1": "1 = Diplomatic Reconciliation and Humanitarian Drought Aid for Horn of Africa",
    "pole10": "10 = Decisive Special Operations and Military Aid to Crush Al-Shabaab Terrorists",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_pension_funding_relief_act",
    "name": "Preservation of Access to Care for Medicare Beneficiaries & Pension Relief",
    "type": "News",
    "eraSpan": "2010 (Pension Smoothing)",
    "domain": "Labor & Welfare",
    "tier": 7,
    "debate": "Allowing corporate defined-benefit pension plans to stretch out recession-driven asset losses over 15 years instead of 7.",
    "pole1": "1 = Protect Worker Pension Benefits and Tighten Fiduciary Funding Obligations",
    "pole10": "10 = Provide Temporary Corporate Smoothing to Free Up Capital for Hiring",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 8,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_california_prop_14_top_two_primary",
    "name": "California Proposition 14 (Nonpartisan Top-Two Open Primary System)",
    "type": "News",
    "eraSpan": "2010 (Electoral Reform Measure)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Creating a unified primary ballot where top two finishers advance to November regardless of political party affiliation.",
    "pole1": "1 = Oppose Top-Two / Protect Party Nominating Autonomy and Third-Party General Ballot Access",
    "pole10": "10 = Support Top-Two Open Primary to Elect More Pragmatic, Centrist Lawmakers",
    "stances": {
      "dem": 6,
      "gop": 6,
      "lib": 1,
      "grn": 1,
      "con": 1,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_south_carolina_de_mint_conservative_litmus",
    "name": "Jim DeMint Senate Conservatives Fund & Purging Moderates",
    "type": "News",
    "eraSpan": "2010 (GOP Primary Civil War)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Backing insurgent conservative primary candidates (Rubio, Paul, Angle, O'Donnell) to defeat established moderate Republicans.",
    "pole1": "1 = Welcome GOP Self-Destruction Through Ideological Extremism",
    "pole10": "10 = Purge Country-Club Moderates / Elect Pure Constitutional Conservatives",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_epa_coal_ash_hazardous_waste_rules",
    "name": "EPA Regulation of Coal Ash Waste Post-Kingston Fossil Plant Disaster",
    "type": "News",
    "eraSpan": "2009-2014 (Coal Combustion Residuals Rule)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Determining whether to classify toxic coal combustion residuals as hazardous waste under Subtitle C of RCRA.",
    "pole1": "1 = Enforce Strict Hazardous Waste Subtitle C Rules to Protect Drinking Water",
    "pole10": "10 = Classify as Non-Hazardous Subtitle D / Protect Recycled Concrete and Utility Costs",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_defense_secretary_gates_procurement_cuts",
    "name": "Defense Secretary Gates Canceling F-22 and Future Combat Systems",
    "type": "News",
    "eraSpan": "2009-2010 (Gates Pentagon Efficiencies)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Halting production of the F-22 stealth fighter at 187 airframes and canceling the Army's $160B Future Combat Systems.",
    "pole1": "1 = Reallocate Excessive Defense Weapons Dollars to Vital Domestic Needs",
    "pole10": "10 = Maintain Full F-22 Production Line to Ensure Unrivaled Air Dominance Over China",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_cybersecurity_act_presidential_kill_switch",
    "name": "Lieberman-Collins Cybersecurity Act & 'Internet Kill Switch' Controversy",
    "type": "News",
    "eraSpan": "2010-2012 (Critical Infrastructure Cybersecurity)",
    "domain": "Technology & Infrastructure",
    "tier": 7,
    "debate": "Granting emergency executive powers to direct critical private telecom networks to implement emergency countermeasures.",
    "pole1": "1 = Reject Executive Kill Switches That Violate Fourth Amendment Privacy and Due Process",
    "pole10": "10 = Authorize Emergency Powers to Shield Electric Grid and Nuclear Plants from Cyberwar",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_chrysler_fiat_alliance_rebound",
    "name": "Chrysler Group Alliance with Italian Automaker Fiat",
    "type": "News",
    "eraSpan": "2009-2011 (Auto Rescue Turnaround)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Transferring operating control of bankrupt Chrysler to Fiat in exchange for small-engine platform technology.",
    "pole1": "1 = Successful Rescue of American Manufacturing and UAW Worker Pensions",
    "pole10": "10 = Government Handout of U.S. Corporate Assets to a Foreign Corporation",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_maine_repeal_same_sex_marriage_q1",
    "name": "Maine Question 1 (People's Veto Overturning Same-Sex Marriage Law)",
    "type": "News",
    "eraSpan": "2009-2010 (New England Marriage Battles)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Voters approving a citizen veto to overturn a newly enacted state law legalizing same-sex marriage in Maine.",
    "pole1": "1 = Affirm Basic Civil Rights / Overturn Referendum Result via Future Ballot",
    "pole10": "10 = Uphold the People's Democratic Vote Defending Traditional Marriage",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_unaccompanied_minors_early_shelter_pressures",
    "name": "Border Patrol Surge in Central American Juvenile Apprehensions",
    "type": "News",
    "eraSpan": "2010-2014 (Central American Youth Migration Arc)",
    "domain": "Immigration & Border",
    "tier": 7,
    "debate": "Opening specialized shelters to care for a doubling of unaccompanied non-Mexican minors fleeing gang violence.",
    "pole1": "1 = Provide Full Due Process, Legal Counsel, and Humanitarian Asylum Shelter",
    "pole10": "10 = Fast-Track Repatriation and Deterrence to Halt Human Smuggling Pipelines",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_fair_sentencing_act_crack_cocaine",
    "name": "Fair Sentencing Act of 2010 (Reducing 100-to-1 Disparity to 18-to-1)",
    "type": "News",
    "eraSpan": "2010 (Bipartisan Criminal Justice Reform)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Reducing the federal statutory sentencing disparity between crack and powder cocaine from 100-to-1 down to 18-to-1.",
    "pole1": "1 = Complete 1-to-1 Equalization / Retroactive Resentencing for All Inmates",
    "pole10": "10 = Maintain Severe Mandatory Penalties to Deter Violent Inner-City Drug Gangs",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2010,
    "id": "2010_mississippi_gulf_coast_restoration_trust",
    "name": "Directing Clean Water Act Spill Penalties to Gulf Coast States (RESTORE Act)",
    "type": "News",
    "eraSpan": "2010-2012 (BP Penalties Allocation)",
    "domain": "Energy & Climate",
    "tier": 6,
    "debate": "Earmarking 80% of Clean Water Act civil penalties from BP directly to the five Gulf states for environmental and economic recovery.",
    "pole1": "1 = Dedicate 100% of Penalties to Marine Ecology and Coastal Wetland Restoration",
    "pole10": "10 = Distribute Funds Directly to Gulf States for Coastal Tourism and Local Economy",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_nfib_v_sebelius_mandate_tax",
    "name": "Supreme Court Upholding ACA as a Tax (NFIB v. Sebelius)",
    "type": "News",
    "eraSpan": "2012 (SCOTUS Obamacare Decision)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "Chief Justice Roberts upholding the Affordable Care Act's individual mandate under the taxing power while making Medicaid expansion optional.",
    "pole1": "1 = Full Federal Implementation of ACA / Expand Medicaid in Every State",
    "pole10": "10 = Total Repeal of Obamacare / Oppose Federal Healthcare Taxation",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_economic_recovery_8_percent_unemployment",
    "name": "Sluggish Economic Recovery & 8.1% Unemployment Rate",
    "type": "News",
    "eraSpan": "2011-2014 (Sluggish Expansion Phase)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Debating the causes and cures for an economic recovery lagging behind historical post-recession rebounds.",
    "pole1": "1 = Enact Major Federal Infrastructure Bank & Direct Job Creation Programs",
    "pole10": "10 = Slash Corporate Tax Rates, Roll Back Red Tape, and Free Business Capital",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_romney_bain_capital_private_equity",
    "name": "Mitt Romney's Bain Capital Record & Free-Market Capitalism",
    "type": "News",
    "eraSpan": "2012 (Private Equity Battle)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Framing private equity leveraged buyouts as wealth creation vs predatory asset stripping that destroys middle-class jobs.",
    "pole1": "1 = Close Carried Interest Loophole / Tax Speculative Leveraged Buyouts",
    "pole10": "10 = Celebrate Creative Destruction, Venture Capital, and Free Enterprise",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_benghazi_attack_talking_points",
    "name": "Attack on U.S. Diplomatic Compound in Benghazi & Talking Points",
    "type": "News",
    "eraSpan": "2012-2016 (Benghazi Investigations)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Investigating diplomatic security failures resulting in the deaths of Ambassador Chris Stevens and three Americans, and initial video blaming.",
    "pole1": "1 = Implement Independent ARB Security Reforms / Reject Partisan Politicization",
    "pole10": "10 = Condemn Administration Dereliction of Duty and Deliberate Cover-Up",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_auto_bailout_vindication_rebound",
    "name": "Auto Bailout Vindication ('GM is Alive, Bin Laden is Dead')",
    "type": "News",
    "eraSpan": "2011-2013 (Auto Recovery Arc)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Highlighting the turnaround of General Motors and Chrysler with 250,000 saved manufacturing jobs versus Romney's 'Let Detroit Go Bankrupt'.",
    "pole1": "1 = Celebrate Successful State Industrial Intervention That Saved U.S. Manufacturing",
    "pole10": "10 = Oppose Corporate Bailouts and Government Favoritism Over Bondholders",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_sandy_hook_elementary_massacre",
    "name": "Sandy Hook Elementary School Shooting & Gun Background Checks",
    "type": "News",
    "eraSpan": "2012-2014 (Post-Sandy Hook Gun Debate)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Mass murder of 20 first-graders and 6 educators in Newtown, CT, prompting federal push for universal background checks.",
    "pole1": "1 = Ban Semiautomatic Assault Rifles, Limit Magazine Sizes & Enforce Universal Background Checks",
    "pole10": "10 = Protect Second Amendment Rights / Armed Teachers & Hardened School Security",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2012,
    "id": "2012_daca_deferred_action_youth",
    "name": "Deferred Action for Childhood Arrivals (DACA Executive Action)",
    "type": "News",
    "eraSpan": "2012-2026 (DACA Legal Arc)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "President Obama exercising prosecutorial discretion to grant two-year deportation reprieves and work permits to 800,000 undocumented youth.",
    "pole1": "1 = Fully Defend DACA / Pass Permanent Path to Citizenship",
    "pole10": "10 = Rescind Lawless Executive Amnesty / Enforce Immigration Laws as Written",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_buffett_rule_tax_fairness",
    "name": "Buffett Rule (30% Minimum Effective Tax Rate on Millionaires)",
    "type": "News",
    "eraSpan": "2011-2013 (Tax Fairness Arc)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Enacting a statutory rule ensuring high earners making over $1M pay an effective federal tax rate higher than their secretaries.",
    "pole1": "1 = Enact Buffett Rule / Surtax on Millionaires to Rebalance Economy",
    "pole10": "10 = Reject Class Warfare Rhetoric / Keep Capital Gains Rates Low to Spurt Growth",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_drone_strikes_targeted_killing_awlaki",
    "name": "Targeted Drone Assassinations of American Citizens Abroad (Anwar al-Awlaki)",
    "type": "News",
    "eraSpan": "2011-2015 (Targeted Killing Jurisprudence)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "CIA drone strike in Yemen killing U.S. citizen Anwar al-Awlaki without indictment or trial, based on secret DOJ Office of Legal Counsel memo.",
    "pole1": "1 = Require Judicial Warrants & Due Process Before Extrajudicial Killings of Citizens",
    "pole10": "10 = Protect Commander-in-Chief Wartime Authority to Strike High-Level Enemy Combatants",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_colorado_washington_cannabis_amendment_64",
    "name": "Colorado Amendment 64 & Washington I-502 (Adult-Use Marijuana Legalization)",
    "type": "News",
    "eraSpan": "2012-2026 (Commercial Cannabis Era)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Historic ballot measures legalizing personal possession, cultivation, and regulated retail sale of marijuana for adults 21+.",
    "pole1": "1 = Vote Yes / End Failed Prohibition, Tax Legal Sales, and Free Police",
    "pole10": "10 = Vote No / Enforce Federal Controlled Substances Act and Prevent Youth Addictions",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_same_sex_marriage_ballot_wins_4_states",
    "name": "Voter Approval of Same-Sex Marriage in ME, MD, WA & Defeat in MN",
    "type": "News",
    "eraSpan": "2012 (First Popular Marriage Wins)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "First time voters approved marriage equality at the ballot box in Maine, Maryland, and Washington while defeating a ban in Minnesota.",
    "pole1": "1 = Celebrate Historic Democratic Breakthrough for Civil Rights",
    "pole10": "10 = Defend Traditional Biblical Marriage and State Religious Liberty Protections",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_fiscal_cliff_spending_sequestration",
    "name": "Budget Control Act 'Fiscal Cliff' & Automatic Spending Sequestration",
    "type": "News",
    "eraSpan": "2011-2013 (Fiscal Cliff Crisis)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Averting a simultaneous $500B expiration of tax cuts and automatic across-the-board cuts to defense and domestic agencies.",
    "pole1": "1 = Cancel Domestic Spending Cuts / Allow Top 2% Tax Cuts to Expire",
    "pole10": "10 = Enforce Deep Spending Cuts / Prevent Any Tax Hikes on Job Creators",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_occupy_wall_street_income_inequality",
    "name": "Occupy Wall Street Movement & 'The 99%' Wealth Disparity",
    "type": "News",
    "eraSpan": "2011-2013 (Occupy Movement Resonance)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Nationwide encampments protesting systemic income inequality, predatory banking, student debt, and corporate corruption of democracy.",
    "pole1": "1 = Champion the 99% / Tax Wall Street Speculation and Cancel Student Debt",
    "pole10": "10 = Condemn Lawless Encampments / Defend Free Market Wealth Creation",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_syrian_civil_war_red_line_chemical",
    "name": "Syrian Civil War & Obama's 'Red Line' on Chemical Weapons",
    "type": "News",
    "eraSpan": "2012-2014 (Syria Red Line Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "President declaring the movement or use of chemical weapons by Bashar al-Assad would be a 'red line' triggering U.S. intervention.",
    "pole1": "1 = Exhaust Diplomacy / Avoid Entanglement in Another Middle East Quagmire",
    "pole10": "10 = Enforce Credible Deterrence / Arm Moderate Syrian Rebels to Oust Assad",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_trans_pacific_partnership_talks",
    "name": "Trans-Pacific Partnership (TPP) 12-Nation Trade Negotiations",
    "type": "News",
    "eraSpan": "2011-2016 (TPP Negotiation Arc)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Negotiating a sweeping 12-nation Pacific Rim free trade agreement with investor-state dispute settlement (ISDS) provisions.",
    "pole1": "1 = Oppose TPP as Corporate Power Grab That Ships Jobs Overseas",
    "pole10": "10 = Pass TPP to Write Global Trade Rules and Counterbalance China's Rise",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 7,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_voter_id_laws_state_suppression",
    "name": "State Photo Voter ID Laws & Department of Justice Section 5 Blocks",
    "type": "Ideological",
    "eraSpan": "2011-2026 (Voting Access & Election Integrity Arc)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Passing strict state government-issued photo ID mandates to vote versus federal civil rights lawsuits blocking them.",
    "pole1": "1 = Strike Down Photo ID Mandates as Jim Crow Voter Suppression",
    "pole10": "10 = Require Photo ID to Prevent Voter Fraud and Ensure Ballot Integrity",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_keystone_xl_pipeline_permit_delay",
    "name": "Keystone XL Crude Oil Pipeline Permit Review Delay",
    "type": "News",
    "eraSpan": "2011-2015 (Keystone XL Battle Arc)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "State Department delaying presidential cross-border permit for the 1,179-mile TransCanada oil sands pipeline.",
    "pole1": "1 = Reject Pipeline to Halt Dirty Tar Sands Carbon Pollution",
    "pole10": "10 = Immediately Approve Keystone XL to Create Thousands of Jobs and Energy Independence",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_paul_ryan_path_to_prosperity_budget",
    "name": "Paul Ryan's House GOP 'Path to Prosperity' Budget",
    "type": "News",
    "eraSpan": "2011-2014 (Ryan Budget Vision)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Passing House budget converting Medicare into a premium-support voucher system, block-granting Medicaid, and slashing top taxes to 25%.",
    "pole1": "1 = Denounce Ryan Budget as Ending Medicare and Starving the Poor",
    "pole10": "10 = Enact Path to Prosperity to Save Entitlements from Inevitable Bankruptcy",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_osama_bin_laden_raid_abbottabad",
    "name": "Operation Neptune Spear & Killing of Osama bin Laden in Pakistan",
    "type": "News",
    "eraSpan": "2011-2013 (Bin Laden Raid Fallout)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Authorizing daring Navy SEAL helicopter raid into sovereign Pakistani territory to eliminate al-Qaeda leader Osama bin Laden.",
    "pole1": "1 = Decisive Executive Leadership Delivering Justice to 9/11 Victims",
    "pole10": "10 = Commend Military and Intelligence Operators / Credit Bush-Era Interrogation Intelligence",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_trayvon_martin_stand_your_ground",
    "name": "Fatal Shooting of Trayvon Martin & Florida 'Stand Your Ground' Laws",
    "type": "News",
    "eraSpan": "2012-2014 (Stand Your Ground Controversy)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "National outrage and DOJ civil rights review following the fatal shooting of unarmed 17-year-old Trayvon Martin by George Zimmerman.",
    "pole1": "1 = Repeal Racially Biased 'Stand Your Ground' Laws / Enact Federal Hate Crimes Reforms",
    "pole10": "10 = Defend Fundamental Right to Self-Defense and Presumption of Innocence",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_contraception_mandate_hobby_lobby_origins",
    "name": "ACA Preventive Services Contraception Mandate & Religious Objections",
    "type": "News",
    "eraSpan": "2011-2014 (Contraception Mandate Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Requiring employer-sponsored health insurance plans to cover preventative contraception with no copays, triggering Catholic lawsuits.",
    "pole1": "1 = Guarantee Universal Copay-Free Contraceptive Access for All Women",
    "pole10": "10 = Protect Religious Freedom of Faith-Based Employers from Moral Coercion",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_wisconsin_recall_walker_act_10",
    "name": "Wisconsin Gubernatorial Recall Election & Scott Walker Act 10",
    "type": "News",
    "eraSpan": "2011-2012 (Wisconsin Labor War)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Governor Scott Walker surviving a historic recall election after enacting Act 10 stripping public sector unions of collective bargaining.",
    "pole1": "1 = Stand with Public Union Workers Against Authoritarian Union-Busting",
    "pole10": "10 = Defend Walker's Courageous Reforms That Balanced Budgets and Restored Taxpayer Power",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_libyan_intervention_nato_gaddafi",
    "name": "Operation Odyssey Dawn & NATO Ouster of Muammar Gaddafi",
    "type": "News",
    "eraSpan": "2011-2013 (Libya Regime Change Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Launching NATO air strikes under UN Responsibility to Protect to prevent Benghazi massacre, resulting in Gaddafi's overthrow and death.",
    "pole1": "1 = Avoid Unilateral Military Interventions Leading to Failed States",
    "pole10": "10 = Necessary Humanitarian Interdiction / Decisive Multilateral Leadership",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_super_pac_spending_explosion",
    "name": "Explosion of Super PAC & Dark Money Spending in 2012 General Election",
    "type": "News",
    "eraSpan": "2012 (First $2B Presidential Election)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Over $1 billion channeled into outside independent expenditures following Citizens United and SpeechNow.org rulings.",
    "pole1": "1 = Pass DISCLOSE Act and Constitutional Amendment to Get Big Money Out of Politics",
    "pole10": "10 = Political Giving and Advertising are Fundamental Free Speech Rights",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_student_loan_debt_reaches_one_trillion",
    "name": "Total U.S. Student Loan Debt Surpassing $1 Trillion",
    "type": "News",
    "eraSpan": "2012-2026 (Student Debt Crisis Arc)",
    "domain": "Education",
    "tier": 3,
    "debate": "Total federal student debt surpassing credit card debt, fueling proposals for income-based repayment expansion.",
    "pole1": "1 = Expand Pay-As-You-Earn (PAYE) Forgiveness & Move to Debt-Free College",
    "pole10": "10 = Eliminate Federal Guarantees That Fuel Runaway College Tuition Inflation",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_fracking_shale_boom_water_contamination",
    "name": "Hydraulic Fracturing (Fracking) Boom & Groundwater Regulations",
    "type": "Ideological",
    "eraSpan": "2008-2026 (Shale Energy Arc)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Rapid expansion of horizontal drilling and hydraulic fracturing in Pennsylvania and North Dakota driving cheap natural gas.",
    "pole1": "1 = Enact Strict Federal Chemical Disclosure Rules or Outright Fracking Moratoriums",
    "pole10": "10 = Support American Shale Revolution Making the U.S. the World's Leading Energy Producer",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_cuba_alan_gross_imprisonment",
    "name": "Imprisonment of USAID Contractor Alan Gross in Cuba",
    "type": "News",
    "eraSpan": "2010-2014 (Alan Gross Detainment)",
    "domain": "Foreign Policy & Defense",
    "tier": 6,
    "debate": "Fifteen-year prison sentence handed to American humanitarian contractor Alan Gross for distributing satellite telecom equipment to Jewish groups.",
    "pole1": "1 = Negotiate Humanitarian Release and Diplomatic Prisoner Exchange",
    "pole10": "10 = Demand Immediate Unconditional Release / Tighten Regime Sanctions",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_california_prop_30_millionaires_tax",
    "name": "California Proposition 30 (Temporary Income Tax on High Earners)",
    "type": "News",
    "eraSpan": "2012 (California Fiscal Turnaround)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Enacting temporary 1% to 3% income surtaxes on earnings over $250,000 and a 0.25% sales tax to prevent $6B in school budget cuts.",
    "pole1": "1 = Vote Yes / Make the Wealthy Pay Their Fair Share to Save Public Schools",
    "pole10": "10 = Vote No / Stop Chasing High-Earning Job Creators and Businesses Out of California",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_california_prop_34_repeal_death_penalty",
    "name": "California Proposition 34 (Attempt to Abolish Capital Punishment)",
    "type": "News",
    "eraSpan": "2012 (Capital Punishment Ballot Fight)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Voter referendum to replace capital punishment with life imprisonment without possibility of parole.",
    "pole1": "1 = Vote Yes / End Costly, Inhumane, and Error-Prone Death Penalty",
    "pole10": "10 = Vote No / Retain Death Penalty for the Most Heinous Murders",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_oregon_measure_80_cannabis_defeat",
    "name": "Oregon Measure 80 (Cannabis Legalization Ballot Measure Defeat)",
    "type": "News",
    "eraSpan": "2012 (Oregon Cannabis Referendum)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Voters narrowly defeating a measure allowing unlicensed commercial production overseen by a state cannabis commission.",
    "pole1": "1 = Reform Ballot Model Toward Professional State Regulatory Oversight",
    "pole10": "10 = Uphold Voter Rejection of Commercial Drug Operations",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_arizona_v_united_states_scotus",
    "name": "Supreme Court Ruling Invalidating Core of Arizona SB 1070",
    "type": "News",
    "eraSpan": "2012 (Immigration Preemption Jurisprudence)",
    "domain": "Immigration & Border",
    "tier": 3,
    "debate": "Supreme Court striking down three of four key provisions of SB 1070 as unconstitutionally preempted by federal immigration law.",
    "pole1": "1 = Affirm Federal Preemption and Equal Protection Against Discriminatory State Laws",
    "pole10": "10 = Dissatisfaction with Ruling / Sovereign States Must Have Right to Deter Illegal Alien Invasion",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_cyber_security_executive_order",
    "name": "Executive Order 13636 on Critical Infrastructure Cybersecurity",
    "type": "News",
    "eraSpan": "2012-2013 (Cybersecurity Framework)",
    "domain": "Technology & Infrastructure",
    "tier": 5,
    "debate": "Directing NIST to establish a voluntary cybersecurity risk framework following Senate filibuster of statutory cybersecurity bills.",
    "pole1": "1 = Support Public-Private Voluntary Standards with Strict Civil Liberties Oversight",
    "pole10": "10 = Mandate Statutory Information-Sharing with Clear Liability Shields for Companies",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_fbi_facial_recognition_ngi",
    "name": "FBI Next Generation Identification (NGI) Biometric Facial Database",
    "type": "News",
    "eraSpan": "2012-2015 (Biometric Surveillance Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Deploying nationwide computerized facial recognition search capabilities across millions of civilian and driver's license photos.",
    "pole1": "1 = Require Judicial Probable Cause Warrants Before Facial Recognition Surveillance",
    "pole10": "10 = Empower Law Enforcement with Cutting-Edge Biometrics to Catch Fugitives",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_postal_service_defaults_on_prefunding",
    "name": "USPS Defaults on $5.5 Billion Retiree Health Pre-Funding Mandate",
    "type": "News",
    "eraSpan": "2012 (Postal Insovlency Crisis)",
    "domain": "Governance & Judiciary",
    "tier": 6,
    "debate": "Postal Service defaulting for the first time on multibillion-dollar annual retiree health payments mandated by 2006 law.",
    "pole1": "1 = Restructure PAEA Mandate / Provide Emergency Federal Relief to Protect Mail Service",
    "pole10": "10 = Downsize USPS Operations / Consolidate Processing Plants and End Saturday Delivery",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_gulf_restoration_act_restore",
    "name": "Enactment of the RESTORE Act for Gulf Coast Ecosystem Recovery",
    "type": "News",
    "eraSpan": "2012 (RESTORE Enactment)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Channeling 80% of BP's Clean Water Act civil penalties into a dedicated Gulf Coast restoration trust fund.",
    "pole1": "1 = Ensure Funds Directly Restore Damaged Salt Marshes, Fisheries, and Barrier Islands",
    "pole10": "10 = Ensure Fair Economic Distribution to Local Businesses Harmed by the Spill",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_jobs_act_crowdfunding_deregulation",
    "name": "Jumpstart Our Business Startups (JOBS) Act & Equity Crowdfunding",
    "type": "News",
    "eraSpan": "2012 (JOBS Act Enactment)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Deregulating securities rules to allow startups to raise investment capital through online public crowdfunding portals.",
    "pole1": "1 = Guard Against Unscrupulous Crowdfunding Scams Preying on Retail Investors",
    "pole10": "10 = Unleash Grassroots Capital Formation for High-Tech and Small Business Innovators",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_afghanistan_strategic_partnership_agreement",
    "name": "U.S.-Afghanistan Strategic Partnership Agreement & 2014 Transition",
    "type": "News",
    "eraSpan": "2012-2014 (Kabul Bilateral Pact)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Signing long-term partnership with Kabul pledging post-2014 advisory support following the scheduled end of NATO combat operations.",
    "pole1": "1 = Expedite Complete Military Exit / Stop Pouring Blood and Treasure into Insolvent War",
    "pole10": "10 = Ensure Residual U.S. Counterterrorism Basing to Prevent Afghan Collapse",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_clean_energy_mercury_air_toxics_mats",
    "name": "EPA Mercury and Air Toxics Standards (MATS) for Power Plants",
    "type": "News",
    "eraSpan": "2011-2015 (MATS Legal Battles)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Mandating 90% reductions in toxic mercury, arsenic, and acid gas emissions from coal- and oil-fired electric generating units.",
    "pole1": "1 = Vital Public Health Standard Protecting Children from Severe Neurological Harm",
    "pole10": "10 = Costly Regulatory Overreach Intended to Wage a 'War on Coal' and Shutter Plants",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_medicaid_expansion_state_opt_outs",
    "name": "Republican Governors Opting Out of ACA Medicaid Expansion",
    "type": "News",
    "eraSpan": "2012-2020 (Medicaid Expansion Resistance)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "GOP governors (Perry, Scott, Kasich initially) refusing federal Medicaid funds covering 100% of costs to block Obamacare expansion.",
    "pole1": "1 = Condemn Governors Leaving Millions of Impoverished Citizens Without Healthcare",
    "pole10": "10 = Defend State Fiscal Sovereignty Against Eventual Unfunded Federal Cost-Shifting",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_china_rare_earths_wto_dispute",
    "name": "WTO Joint Trade Dispute Challenging China's Rare Earth Export Quotas",
    "type": "News",
    "eraSpan": "2012-2014 (Rare Earth Minerals War)",
    "domain": "Trade & Globalism",
    "tier": 5,
    "debate": "Filing formal WTO complaints with the EU and Japan over Beijing's discriminatory export restrictions on high-tech rare earth elements.",
    "pole1": "1 = Hold China Accountable to International Trade Rules & Develop Domestic Supply Chains",
    "pole10": "10 = Rebuild American Mining and Processing Capacity / Counter Chinese Monopolies",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 7,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_california_prop_36_three_strikes_reform",
    "name": "California Proposition 36 (Voter Overhaul of Three Strikes Law)",
    "type": "News",
    "eraSpan": "2012 (Three Strikes Overhaul Passed)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Overwhelming voter approval (69%) requiring third strike to be a serious or violent felony and allowing retroactive resentencing.",
    "pole1": "1 = Landmark Step Toward Dismantling Mass Incarceration of Nonviolent Offenders",
    "pole10": "10 = Support Measured Reform While Keeping Dangerous Violent Criminals Incarcerated",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_arkansas_issue_5_medical_marijuana_narrow",
    "name": "Arkansas Issue 5 (Medical Marijuana Narrow Defeat 48.6% to 51.4%)",
    "type": "News",
    "eraSpan": "2012 (Southern Medical Cannabis Precursor)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "First southern state to vote on medical marijuana, demonstrating surging support across conservative rural districts.",
    "pole1": "1 = Build Grassroots Momentum for Medical Cannabis Patient Rights in the South",
    "pole10": "10 = Uphold Traditional Social Standards and Reject Illicit Substance Liberalization",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_stock_act_congressional_insider_trading",
    "name": "Stop Trading on Congressional Knowledge (STOCK) Act",
    "type": "News",
    "eraSpan": "2012 (Congressional Insider Trading Ban)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Banning members of Congress and executive staff from trading individual equities using non-public information obtained on Capitol Hill.",
    "pole1": "1 = Enact Ironclad Financial Disclosures and Strict Criminal Penalties for Lawmakers",
    "pole10": "10 = Enforce Equal Application of the Law / Avoid Burdensome Disclosures on Staff",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_iran_swift_financial_blacklisting",
    "name": "Expulsion of Iranian Commercial Banks from Global SWIFT Network",
    "type": "News",
    "eraSpan": "2012 (SWIFT Sanctions Maximum Pressure)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Coordinating international expulsion of Iranian financial institutions from the SWIFT global financial messaging system.",
    "pole1": "1 = Multilateral Economic Pressure Paired with Credible Diplomatic Exit Off-Ramps",
    "pole10": "10 = Total Economic Warfare and Blockade Until Iran Surrenders Its Nuclear Program",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_sequestration_defense_spending_cuts",
    "name": "Automatic 10-Year $500 Billion Defense Budget Sequestration",
    "type": "News",
    "eraSpan": "2012-2013 (Defense Sequestration Threat)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Pentagon warnings of hollowed-out armed forces, cancelled carrier deployments, and reduced troop levels if sequester takes effect.",
    "pole1": "1 = Let Pentagon Cuts Stand / Reallocate Defense Savings to Rebuild Domestic Economy",
    "pole10": "10 = Repeal Defense Sequestration / Maintain Superpower Readiness and Naval Dominance",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_bengal_bay_south_china_sea_freedom_nav",
    "name": "U.S. Navy Freedom of Navigation Patrols in South China Sea",
    "type": "News",
    "eraSpan": "2012-2026 (South China Sea FONOPS)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Challenging excessive Chinese maritime sovereignty claims by sailing guided-missile destroyers through disputed waters.",
    "pole1": "1 = International Maritime Law & Multilateral ASEAN Diplomatic Mechanisms",
    "pole10": "10 = Robust Naval Presence and Uncompromising Freedom of Navigation Operations",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_missouri_todd_akin_legitimate_rape",
    "name": "Todd Akin 'Legitimate Rape' Controversy & Abortion Exceptions",
    "type": "News",
    "eraSpan": "2012 (GOP Candidate Abortion Gaffe)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Senate nominee Todd Akin claiming women's bodies prevent pregnancy in 'legitimate rape', blowing wide open abortion exception debates.",
    "pole1": "1 = Expose the Extreme Anti-Choice War on Women Across the GOP",
    "pole10": "10 = Disavow Akin's Ignorant Biological Comments / Stand Firmly on Sanctity of Life",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_patent_reform_america_invents_act",
    "name": "Leahy-Smith America Invents Act (Transition to First-Inventor-to-File)",
    "type": "News",
    "eraSpan": "2011-2013 (Patent Overhaul)",
    "domain": "Technology & Infrastructure",
    "tier": 6,
    "debate": "Overhauling U.S. patent law from 'first-to-invent' to international 'first-inventor-to-file' and establishing the PTAB.",
    "pole1": "1 = Harmonize Global Patents While Protecting Individual Inventors from Patent Trolls",
    "pole10": "10 = Strengthen Property Rights for American Inventors Against Multinational Copycats",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 7,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_federal_subsidized_student_loan_rates_cliff",
    "name": "Preventing Stafford Student Loan Interest Rates from Doubling to 6.8%",
    "type": "News",
    "eraSpan": "2012 (Student Loan Rate Cliff)",
    "domain": "Education",
    "tier": 3,
    "debate": "Emergency legislation preventing federal subsidized student loan interest rates from jumping from 3.4% to 6.8% for 7 million students.",
    "pole1": "1 = Freeze Interest Rates and Permanently Lower Cost of Federal Student Debt",
    "pole10": "10 = Allow Subsidies to Expire / Prevent Taxpayer Underwriting of College Tuition Hikes",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_haiti_cholera_outbreak_un_accountability",
    "name": "UN Peacekeeper Introduction of Cholera in Haiti & Immunity Claims",
    "type": "News",
    "eraSpan": "2011-2016 (Haiti Cholera Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 7,
    "debate": "Haitian victims suing the United Nations for importing a deadly cholera epidemic through contaminated peacekeeper wastewater.",
    "pole1": "1 = Demand Full UN Financial Accountability, Apology, and Clean Water Reparations",
    "pole10": "10 = Protect Legal Immunity of UN Peacekeeping Missions Worldwide",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2012,
    "id": "2012_puerto_rico_status_plebiscite_54_percent",
    "name": "Puerto Rico 2012 Plebiscite Rejecting Current Commonwealth Status",
    "type": "News",
    "eraSpan": "2012 (Historic Status Rejection)",
    "domain": "Governance & Judiciary",
    "tier": 6,
    "debate": "54% of Puerto Rican voters rejecting continuation of current territorial status and 61% favoring Statehood among non-territorial options.",
    "pole1": "1 = Respect the Democratic Voice of Puerto Rico / Advance Toward 51st Statehood",
    "pole10": "10 = Question Ambiguous Ballot Structure / Maintain Current Territorial Arrangement",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_isis_caliphate_syria_airstrikes",
    "name": "Rise of the ISIS Caliphate & Operation Inherent Resolve Airstrikes",
    "type": "News",
    "eraSpan": "2014-2019 (War on ISIS)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Launching coalition air strikes in Iraq and Syria following ISIS's capture of Mosul and televised beheadings of American journalists.",
    "pole1": "1 = Avoid Ground Troop Quagmires / Condition Aid on Iraqi Sectarian Inclusivity",
    "pole10": "10 = Decisive Military Campaign to Annihilate ISIS / Deploy Combat Ground Forces",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_russia_annexation_of_crimea_ukraine",
    "name": "Russian Military Annexation of Crimea & War in the Donbas",
    "type": "News",
    "eraSpan": "2014-2022 (Pre-Invasion Ukraine Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Responding to Vladimir Putin's invasion and annexation of Crimea and military destabilization of eastern Ukraine.",
    "pole1": "1 = Coordinated Transatlantic Economic Sanctions & Diplomatic Isolation",
    "pole10": "10 = Send Lethal Defensive Military Arms to Ukraine / Station NATO Armor in Baltics",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_central_american_unaccompanied_minors",
    "name": "Rio Grande Valley Surge of Unaccompanied Child Migrants",
    "type": "News",
    "eraSpan": "2014 (Summer Border Surge)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Over 68,000 unaccompanied children and mothers arriving at the southern border fleeing gang violence in El Salvador, Honduras, and Guatemala.",
    "pole1": "1 = Provide Full Humanitarian Care, Due Process Hearings, and Legal Counsel",
    "pole10": "10 = Fast-Track Deportation Flights and Militarize the Southwest Border",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_ferguson_police_shooting_michael_brown",
    "name": "Ferguson Unrest & Fatal Police Shooting of Michael Brown",
    "type": "News",
    "eraSpan": "2014-2016 (Black Lives Matter Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Civil unrest and protests in Ferguson, MO following the death of Michael Brown, sparking the national Black Lives Matter movement.",
    "pole1": "1 = Demilitarize Police / Body Cameras / Independent Civil Rights Prosecutions",
    "pole10": "10 = Back the Blue / Restore Law and Order / Stop Demonizing Police Officers",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_ebola_epidemic_west_africa_domestic",
    "name": "West African Ebola Epidemic & Domestic Quarantine Protocols",
    "type": "News",
    "eraSpan": "2014-2015 (Ebola Crisis)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "Deploying 3,000 U.S. military engineers to Liberia while state governors impose mandatory 21-day quarantines on returning nurses.",
    "pole1": "1 = Trust Public Health Science / Global Epidemic Containment at the Source",
    "pole10": "10 = Impose Full Travel Ban from Ebola-Stricken Countries / Mandatory State Quarantines",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_healthcare_gov_website_glitches_rollout",
    "name": "Healthcare.gov Technical Glitches & 'Keep Your Plan' Controversy",
    "type": "News",
    "eraSpan": "2013-2015 (ACA Rollout Disaster)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Federal enrollment website crashing on launch day and millions of policy cancellation notices disproving Obama's pledge.",
    "pole1": "1 = Fix Technological Glitches and Protect Millions Gaining Real Quality Coverage",
    "pole10": "10 = Proof That Government-Run Healthcare Is an Unworkable Bureaucratic Nightmare",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_burwell_v_hobby_lobby_scotus",
    "name": "Supreme Court Ruling on Corporate Religious Freedom (Hobby Lobby)",
    "type": "News",
    "eraSpan": "2014 (Hobby Lobby RFRA Decision)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Holding that closely held for-profit corporations cannot be forced under RFRA to provide contraception violating religious beliefs.",
    "pole1": "1 = Disastrous Ruling Subordinating Women's Healthcare Rights to Bosses' Religious Beliefs",
    "pole10": "10 = Major Victory Protecting First Amendment Conscience Rights from Federal Coercion",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_keystone_xl_presidential_veto_threat",
    "name": "Congressional Push to Mandate Approval of Keystone XL Pipeline",
    "type": "News",
    "eraSpan": "2013-2015 (Keystone Legislative Battle)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Bipartisan congressional majorities attempting to force statutory approval of Keystone XL over Obama's threatened veto.",
    "pole1": "1 = Veto Pipeline to Protect Fragile Aquifers and Curb High-Carbon Tar Sands",
    "pole10": "10 = Override Veto / Build Keystone XL to Unlock Canadian Crude and 20,000 Construction Jobs",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_epa_clean_power_plan_coal",
    "name": "EPA Proposed Clean Power Plan Regulating Power Plant Carbon",
    "type": "News",
    "eraSpan": "2014-2016 (Clean Power Plan Arc)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "EPA proposing Section 111(d) Clean Air Act rule mandating a 32% cut in power sector carbon emissions by 2030.",
    "pole1": "1 = Essential Global Climate Leadership Driving Transition Away from Coal",
    "pole10": "10 = Lawless Power Grab by EPA Destined to Shutter Coal Mines and Spike Utility Bills",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_va_hospital_secret_waitlists",
    "name": "Veterans Health Administration Secret Waitlist Scandal (Phoenix VA)",
    "type": "News",
    "eraSpan": "2014 (VA Scandal & Choice Act)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Discovery that VA hospital administrators kept secret hidden waitlists concealing that veterans died waiting for care.",
    "pole1": "1 = Double Funding for VA Doctors, Nurses, and Modern Clinical Facilities",
    "pole10": "10 = Pass Veterans Choice Act Allowing Vets to Seek Private Medical Care",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_senate_nuclear_option_filibuster",
    "name": "Harry Reid Invoking 'Nuclear Option' to Eliminate Judicial Filibuster",
    "type": "News",
    "eraSpan": "2013-2017 (Filibuster Nuclearization)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Senate Democrats changing chamber rules by simple majority to eliminate the 60-vote filibuster on executive and judicial nominees.",
    "pole1": "1 = Necessary Reform to Break Unprecedented Republican Obstruction of the DC Circuit",
    "pole10": "10 = Dangerous Power Grab Destroying the Senate's Historic Deliberative Minority Protections",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_net_neutrality_title_ii_reclassification",
    "name": "FCC Push to Reclassify Broadband Under Title II Common Carrier Rules",
    "type": "News",
    "eraSpan": "2014-2017 (Title II Net Neutrality Phase)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "President Obama urging the FCC to classify consumer broadband as a public utility to ban paid prioritization.",
    "pole1": "1 = Reclassify Under Title II to Protect Open Internet and Free Speech",
    "pole10": "10 = Stop Heavy-Handed 1930s Telephone Regulations Chilling Private 5G Investment",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_minimum_wage_state_ballot_sweeps",
    "name": "Red State Minimum Wage Ballot Initiatives (AK, AR, NE, SD)",
    "type": "News",
    "eraSpan": "2014 (Red State Minimum Wage Sweeps)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Voters in four conservative states approving citizen ballot measures raising state minimum wage rates to $8.50-$9.75.",
    "pole1": "1 = Demonstrates Bipartisan Supermajority Support for Raising the Minimum Wage",
    "pole10": "10 = Oppose Mandated Wage Floors That Accelerate Automation and Hurt Teen Workers",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_colorado_washington_weed_stores_open",
    "name": "Opening of First Legal Adult-Use Marijuana Stores in Colorado & WA",
    "type": "News",
    "eraSpan": "2014 (First Retail Dispensaries Open)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Long lines and millions in state tax receipts as licensed commercial recreational cannabis shops open under the DOJ Cole Memo.",
    "pole1": "1 = Successful Model for Tax-and-Regulate Legalization Nationwide",
    "pole10": "10 = Re-evaluate Federal Non-Enforcement Policy / Curb Black Market Exportation",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_snowden_nsa_surveillance_reforms",
    "name": "Edward Snowden Surveillance Revelations & USA FREEDOM Act Push",
    "type": "News",
    "eraSpan": "2013-2015 (Post-Snowden Reform Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Reforming Section 215 bulk telephony metadata collection following worldwide disclosures by NSA contractor Edward Snowden.",
    "pole1": "1 = End All Bulk Domestic Surveillance / Protect Whistleblowers from Retaliation",
    "pole10": "10 = Preserve Critical Counterterror Intelligence Capabilities / Bring Traitor to Justice",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 1,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_iran_interim_nuclear_accord_jpoa",
    "name": "Joint Plan of Action (JPOA) Interim Nuclear Freeze with Iran",
    "type": "News",
    "eraSpan": "2013-2015 (JCPOA Precursor)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "P5+1 interim accord granting partial sanctions relief in exchange for Iran freezing 20% uranium enrichment.",
    "pole1": "1 = Groundbreaking Diplomatic Breakthrough Averting Another Mideast War",
    "pole10": "10 = Flawed Appeasement Giving Iran Billions in Sanctions Relief Without Dismantling Centrifuges",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_shelby_county_v_holder_voting_rights",
    "name": "Supreme Court Gutting Voting Rights Act (Shelby County v. Holder)",
    "type": "News",
    "eraSpan": "2013-2026 (Post-Shelby Voting Battles)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Supreme Court striking down Section 4(b) preclearance coverage formula, allowing southern states to immediately enact voting restrictions.",
    "pole1": "1 = Pass the John Lewis Voting Rights Advancement Act to Restore Federal Preclearance",
    "pole10": "10 = Celebrate Federalism Ruling Acknowledging Historic Progress in the South",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_police_body_cameras_federal_funding",
    "name": "Federal Grants for Police Body-Worn Cameras Post-Ferguson",
    "type": "News",
    "eraSpan": "2014-2016 (Body Cam Deployment)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "White House proposing a $263 million initiative to co-fund 50,000 body-worn cameras for local law enforcement.",
    "pole1": "1 = Mandate Body Cameras with Public Video Transparency and Strict Misconduct Discipline",
    "pole10": "10 = Support Law Enforcement Technology While Protecting Officer and Witness Privacy",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_bernie_sanders_independent_movement",
    "name": "Bernie Sanders Nationwide Rallies Against the Billionaire Class",
    "type": "News",
    "eraSpan": "2014 (Sanders 2016 Precursor)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Senator Bernie Sanders touring early states calling for a political revolution, Medicare for All, and tuition-free public college.",
    "pole1": "1 = Build Working-Class Democratic Socialist Coalition to Confront Oligarchy",
    "pole10": "10 = Reject Radical European Socialism and Discredited Marxist Confiscation",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_california_prop_47_criminal_justice",
    "name": "California Proposition 47 (The Safe Neighborhoods and Schools Act)",
    "type": "News",
    "eraSpan": "2014 (Misdemeanor Reclassification)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Reclassifying nonviolent theft and personal drug possession offenses from felonies to misdemeanors across California.",
    "pole1": "1 = Vote Yes / Stop Incarcerating People for Minor Offenses and Invest in Treatment",
    "pole10": "10 = Vote No / Soft-on-Crime Measure Encouraging Shoplifting and Drug Vagrancy",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_alaska_oregon_marijuana_legalization",
    "name": "Alaska Measure 2 & Oregon Measure 91 (Voter Approval of Adult-Use Weed)",
    "type": "News",
    "eraSpan": "2014 (Second Wave Legalization)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters in Oregon and Alaska approving ballot initiatives legalizing and taxing commercial recreational cannabis.",
    "pole1": "1 = Momentum for Universal Federal Cannabis Decriminalization and Commercial Freedom",
    "pole10": "10 = Oppose Commercial Drug Normalization Spreading Across Western States",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_fast_food_strikes_fight_for_15",
    "name": "SEIU 'Fight for $15' Nationwide Fast-Food Labor Walkouts",
    "type": "News",
    "eraSpan": "2013-2020 (Fight for $15 Movement)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Fast-food, retail, and airport service workers staging coordinated one-day strikes demanding a $15/hour wage and union rights.",
    "pole1": "1 = Full Support for Striking Workers / Enact $15 Federal Minimum Wage",
    "pole10": "10 = Reject Unrealistic Union Demand That Will Destroy Entry-Level Jobs and Mandate Kiosks",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_general_motors_ignition_switch_recall",
    "name": "GM Faulty Ignition Switch Recall (124 Fatalities & Corporate Cover-up)",
    "type": "News",
    "eraSpan": "2014 (Auto Safety & Cover-up)",
    "domain": "Technology & Infrastructure",
    "tier": 4,
    "debate": "Recalling 2.6 million vehicles for defective ignition switches that slipped out of the 'run' position, shutting off airbags.",
    "pole1": "1 = Criminal Indictments for Corporate Negligence and Stronger NHTSA Enforcement Mandates",
    "pole10": "10 = Hold GM Accountable Under Civil Compensation Fund Without Crushing Auto Industry",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_border_patrol_funding_emergency_bill",
    "name": "Obama Request for $3.7B Emergency Supplemental for Border Minors",
    "type": "News",
    "eraSpan": "2014 (Border Supplemental Battle)",
    "domain": "Immigration & Border",
    "tier": 3,
    "debate": "Requesting $3.7 billion for immigration judges, border surveillance, and shelter care for unaccompanied minors.",
    "pole1": "1 = Fully Fund Humanitarian Care and Legal Aid for Traumatized Children",
    "pole10": "10 = Deny Request / Amend 2008 TVPRA Law to Allow Immediate Repatriation of Central American Kids",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_puerto_rico_debt_crisis_approaches",
    "name": "Puerto Rico Credit Rating Downgraded to Junk Status ($72B Debt)",
    "type": "News",
    "eraSpan": "2014-2016 (PROMESA Precursor)",
    "domain": "Economy & Taxation",
    "tier": 5,
    "debate": "Territorial government facing insolvency with $72B in municipal debt and inability to restructure under Chapter 9 bankruptcy.",
    "pole1": "1 = Grant Puerto Rico Access to Federal Chapter 9 Bankruptcy Protections",
    "pole10": "10 = Oppose Bailouts for Reckless Territorial Spending / Demand Fiscal Discipline",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_cuba_diplomatic_talks_breakthrough",
    "name": "Secret Vatican-Brokered Diplomatic Negotiations with Cuba",
    "type": "News",
    "eraSpan": "2014 (Pre-Normalization Talks)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Covert 18-month negotiations mediated by Pope Francis to exchange Alan Gross and a Cuban spy for normalizing diplomatic ties.",
    "pole1": "1 = Normalize Diplomatic Ties / Reopen Embassies / End Failed 50-Year Cold War Isolation",
    "pole10": "10 = Unilateral Concessions to Castro Dictatorship Without Democratic Elections or Human Rights",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_target_home_depot_data_breaches",
    "name": "Massive Retail Cyberattacks on Target & Home Depot Point-of-Sale Systems",
    "type": "News",
    "eraSpan": "2013-2015 (Point-of-Sale Cybersecurity)",
    "domain": "Technology & Infrastructure",
    "tier": 5,
    "debate": "Malware stealing 110 million customer credit card numbers, speeding transition to EMV chip cards.",
    "pole1": "1 = Federal Data Breach Notification Standards and Strict Corporate Cybersecurity Liability",
    "pole10": "10 = Accelerate Private Payment Card Industry Standards Without Duplicative Federal Rules",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_ex_im_bank_reauthorization_tea_party",
    "name": "Tea Party Push to Abolish the Export-Import Bank",
    "type": "News",
    "eraSpan": "2014-2015 (Ex-Im Bank Shutdown)",
    "domain": "Trade & Globalism",
    "tier": 4,
    "debate": "Insurgent conservative rebellion against renewing the 80-year-old Export-Import Bank, labeling it corporate welfare for Boeing.",
    "pole1": "1 = Reauthorize Ex-Im to Support American Exporters Against Subsidized Foreign Competitors",
    "pole10": "10 = Terminate Ex-Im Bank to End Crony Capitalist Subsidies for Giant Multinational Corporations",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_irs_targeting_conservative_groups",
    "name": "IRS Scrutiny of Conservative Tea Party Non-Profit 501(c)(4) Applications",
    "type": "News",
    "eraSpan": "2013-2015 (Lois Lerner Controversy)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Inspector General finding IRS tax-exempt unit used inappropriate criteria targeting groups with 'Tea Party' or 'Patriot' in names.",
    "pole1": "1 = Mismanaged Incompetent Bureaucracy Dealing with Surge in Dark Money Applications",
    "pole10": "10 = Weaponized Political Retaliation by the Executive Branch to Suppress Conservative Donors",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_boko_haram_chibok_schoolgirls",
    "name": "Kidnapping of 276 Nigerian Schoolgirls by Boko Haram (#BringBackOurGirls)",
    "type": "News",
    "eraSpan": "2014 (Chibok Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Deploying U.S. military surveillance drones and advisory teams to search for kidnapped schoolgirls in Nigeria.",
    "pole1": "1 = Multilateral Humanitarian Support and Regional Intelligence Sharing",
    "pole10": "10 = Counterterrorist Support / Avoid Open-Ended Foreign Mission Creep",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_missouri_amendment_1_right_to_farm",
    "name": "Missouri Amendment 1 (Constitutional 'Right to Farm')",
    "type": "News",
    "eraSpan": "2014 (Right to Farm Ballot Fight)",
    "domain": "Agriculture & Food",
    "tier": 6,
    "debate": "Narrowly approving constitutional amendment guaranteeing the right of farmers and ranchers to engage in modern agricultural practices.",
    "pole1": "1 = Protect Local Communities and Animal Welfare from Corporate Agribusiness Monopolies",
    "pole10": "10 = Protect Missouri Family Farmers from Out-of-State Animal Rights and Environmental Lawsuits",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_flint_michigan_water_switch_begins",
    "name": "Flint River Drinking Water Switch & Lead Pipe Corrosion",
    "type": "News",
    "eraSpan": "2014-2016 (Flint Water Crisis Genesis)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Emergency manager switching Flint's municipal water supply to corrosive river water without corrosion control inhibitors.",
    "pole1": "1 = Severe Environmental Racism & Immediate Federal Emergency Public Health Intervention",
    "pole10": "10 = Local Administrative Malpractice / Enforce State Accountability and Water Quality Standards",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_south_carolina_senate_special_tim_scott",
    "name": "Tim Scott Elected First African American Senator from South in 130 Years",
    "type": "News",
    "eraSpan": "2014 (Historic Senate Milestone)",
    "domain": "Civil Rights & Social Issues",
    "tier": 6,
    "debate": "Winning special election with 61% of the vote, cementing conservative minority representation in the Senate.",
    "pole1": "1 = Recognize Historical Milestone While Opposing Conservative Policy Positions",
    "pole10": "10 = Celebrate Inspiring Example of American Opportunity, Meritocracy, and Colorblind Values",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_veterans_choice_act_passage",
    "name": "Enactment of Veterans Access, Choice, and Accountability Act of 2014",
    "type": "News",
    "eraSpan": "2014 (Bipartisan VA Reform)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Bipartisan $16B measure allowing veterans facing 30-day waits or living 40 miles away to access private healthcare providers.",
    "pole1": "1 = Maintain Robust Funding for Public VA Infrastructure / Prevent Full Privatization",
    "pole10": "10 = Expand Private Healthcare Choice for All Veterans as a Permanent Fundamental Right",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_clean_water_rule_wotus_proposed",
    "name": "EPA & Army Corps Proposed 'Waters of the United States' (WOTUS) Rule",
    "type": "News",
    "eraSpan": "2014-2023 (WOTUS Regulatory Warfare)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Clarifying federal Clean Water Act jurisdiction to encompass seasonal streams, headwaters, and adjacent prairie potholes.",
    "pole1": "1 = Essential Science-Based Protection for the Drinking Water of 117 Million Americans",
    "pole10": "10 = Massive Regulatory Land Grab Subjecting Farm Ponds and Ditches to Federal Permits",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_cliven_bundy_armed_standoff_bureau_land",
    "name": "Armed Standoff at Bunkerville, Nevada over Unpaid Grazing Fees",
    "type": "News",
    "eraSpan": "2014 (Western Public Lands Sagebrush Rebellion)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Armed militia members pointing rifles at federal BLM agents attempting to impound cattle of rancher refusing to pay grazing fees.",
    "pole1": "1 = Enforce Federal Law Against Armed Insurrectionists Threatening Public Servants",
    "pole10": "10 = Defend Western Landowners Against Heavy-Handed Federal Tyranny on Sovereign State Lands",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_colorado_amendment_67_personhood_defeat",
    "name": "Colorado Amendment 67 (Third Overwhelming Defeat of Fetal Personhood)",
    "type": "News",
    "eraSpan": "2014 (Personhood Rejected 65% to 35%)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Voters rejecting for the third time an initiative attempting to include 'unborn human beings' under state criminal codes.",
    "pole1": "1 = Decisive Voter Rejection of Extreme Anti-Abortion Measures Threatening Reproductive Healthcare",
    "pole10": "10 = Stand for Unborn Rights Despite Persistent Misleading Propaganda from Abortion Providers",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_california_water_bond_prop_1",
    "name": "California Proposition 1 ($7.5 Billion Emergency Water Bond)",
    "type": "News",
    "eraSpan": "2014 (Historic Western Drought Response)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Authorizing $7.5B in bonds to fund water storage reservoirs, groundwater cleanup, and ecosystem restoration during severe drought.",
    "pole1": "1 = Invest in Sustainable Groundwater Management, Recycling, and Watershed Protection",
    "pole10": "10 = Dedicate Maximum Funding to Dam Storage and Conveyance for Central Valley Agriculture",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_ndaa_detention_guantanamo_transfers",
    "name": "NDAA Restrictions on Transferring Guantanamo Detainees to U.S. Soil",
    "type": "News",
    "eraSpan": "2013-2016 (Guantanamo Transfer Ban)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Congressional riders barring the expenditure of defense funds to transfer any Guantanamo detainee to detention facilities in America.",
    "pole1": "1 = Repeal Obstructionist Transfer Restrictions So Guantanamo Can Finally Be Closed",
    "pole10": "10 = Bar Transfer of Hardened Terrorists to American Soil / Keep Them in Guantanamo Forever",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_usps_staples_union_boycott",
    "name": "Postal Union Boycott Over USPS Retail Counters in Staples Stores",
    "type": "News",
    "eraSpan": "2014 (Postal Privatization Conflict)",
    "domain": "Labor & Welfare",
    "tier": 7,
    "debate": "American Postal Workers Union staging protests against pilot program staffing postal desks with non-union Staples employees.",
    "pole1": "1 = Stop Stealth Privatization / Protect Good-Paying Union Postal Careers",
    "pole10": "10 = Support Consumer Convenience and Cost Savings Through Retail Partnerships",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_fbi_encryption_going_dark",
    "name": "FBI Director James Comey Warnings Over Smartphone 'Going Dark' Encryption",
    "type": "News",
    "eraSpan": "2014-2016 (Encryption & Apple Battle Precursor)",
    "domain": "Technology & Infrastructure",
    "tier": 5,
    "debate": "Warning that default smartphone encryption prevents law enforcement from executing court-authorized wiretaps and search warrants.",
    "pole1": "1 = Strong End-to-End Encryption Is Essential for Cybersecurity and Privacy Against Hackers",
    "pole10": "10 = Require Tech Giants to Provide Lawful Intercept Access to Prevent Terrorist Plots",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_trade_adjustment_assistance_renewal",
    "name": "Trade Adjustment Assistance (TAA) Renewal for Displaced Workers",
    "type": "Ideological",
    "eraSpan": "1962-2022 (Trade Dislocation Arc)",
    "domain": "Trade & Globalism",
    "tier": 5,
    "debate": "Extending federal job training, wage subsidies, and health credits to manufacturing workers displaced by foreign trade.",
    "pole1": "1 = Fully Fund and Expand TAA as an Indispensable Lifeline for Displaced Industrial Workers",
    "pole10": "10 = TAA Is Ineffective Burial Insurance / Foster Dynamic Job Growth Through Deregulation",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_oil_rail_safety_bakken_crude",
    "name": "DOT Emergency Safety Orders on Crude Oil Unit Trains ('Bomb Trains')",
    "type": "News",
    "eraSpan": "2013-2015 (Crude-by-Rail Explosion Arc)",
    "domain": "Technology & Infrastructure",
    "tier": 4,
    "debate": "Mandating thicker tank car shells, electronically controlled pneumatic brakes, and speed restrictions for volatile Bakken crude trains.",
    "pole1": "1 = Enact Immediate Phaseout of Vulnerable DOT-111 Tank Cars to Protect Populated Towns",
    "pole10": "10 = Allow Realistic Multi-Year Industry Compliance Timelines to Avoid Paralyzing Oil Transport",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_puerto_rico_chapter_9_recovery_act_void",
    "name": "Federal Court Striking Down Puerto Rico's Public Corporation Debt Act",
    "type": "News",
    "eraSpan": "2014-2015 (Territorial Legal Vacuum)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Federal court holding that Puerto Rico cannot enact its own bankruptcy restructuring law because federal law preempts it.",
    "pole1": "1 = Pass Federal Legislation Amending the Bankruptcy Code to Give Puerto Rico Restructuring Rights",
    "pole10": "10 = Enforce Bond Contracts / Protect American Mutual Fund Investors from Territorial Default",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_hhs_secretary_sebelius_resignation",
    "name": "HHS Secretary Kathleen Sebelius Resignation Following ACA Website Fiasco",
    "type": "News",
    "eraSpan": "2014 (Executive Accountability)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Sebelius stepping down after overseeing the chaotic launch of the federal health exchange and facing calls for dismissal.",
    "pole1": "1 = Recognize Dedication in Successfully Recovering the Site to Enroll 8 Million Americans",
    "pole10": "10 = Long-Overdue Accountability for the Most Incompetent Federal Program Launch in History",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_russia_sanctions_sectoral_expansion",
    "name": "Executive Orders Imposing Sectoral Sanctions on Russian Energy and Banking",
    "type": "News",
    "eraSpan": "2014-2022 (Sectoral Sanctions Program)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Banning U.S. companies from providing deepwater, Arctic, or shale oil technology to Rosneft and Gazprom.",
    "pole1": "1 = Escalate Targeted Sanctions to Cripple Putin's Military-Industrial Capability",
    "pole10": "10 = Coordinate Tougher Sanctions with Hesitant European Allies to Prevent Russian Evasion",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_export_control_satellite_itar_reform",
    "name": "ITAR Reform Moving Commercial Communications Satellites to Commerce List",
    "type": "News",
    "eraSpan": "2014 (Space Export Control Modernization)",
    "domain": "Technology & Infrastructure",
    "tier": 6,
    "debate": "Shifting commercial communication satellites and components from the strict State Department ITAR munition list to Commerce control.",
    "pole1": "1 = Maintain Rigorous Nonproliferation Safeguards Over Dual-Use Aerospace Technologies",
    "pole10": "10 = Revitalize U.S. Commercial Aerospace Competitiveness and Eliminate Outdated Export Barriers",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 8,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_north_korea_sony_hack_the_interview",
    "name": "North Korean Cyberattack on Sony Pictures Over 'The Interview'",
    "type": "News",
    "eraSpan": "2014 (State-Sponsored Cyberattack)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "FBI formally blaming Pyongyang for destroying Sony's corporate network and leaking emails to suppress release of a satirical comedy.",
    "pole1": "1 = Defend Free Artistic Expression Against State Terrorism / Expand Sanctions",
    "pole10": "10 = Retaliate Decisively in Cyberspace / Relist North Korea as a State Sponsor of Terrorism",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_guam_self_determination_plebiscite_delays",
    "name": "Guam Decolonization Registration & Chamorro Native Vote Dispute",
    "type": "News",
    "eraSpan": "2014 (Territorial Decolonization)",
    "domain": "Governance & Judiciary",
    "tier": 8,
    "debate": "Federal court lawsuits challenging Guam's proposed status plebiscite that limits registration to 'Native Inhabitants'.",
    "pole1": "1 = Uphold Indigenous Chamorro Self-Determination Rights Under UN Charter",
    "pole10": "10 = Enforce Fifteenth Amendment Prohibiting Race-Restricted Voting Lists in U.S. Territories",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_pension_multiemployer_mpra_act",
    "name": "Multiemployer Pension Reform Act (MPRA Allowing Benefit Cuts)",
    "type": "News",
    "eraSpan": "2014 (Kline-Miller Enactment)",
    "domain": "Labor & Welfare",
    "tier": 5,
    "debate": "Allowing trustees of critically insolvent multiemployer union pension funds to cut vested benefits of current retirees.",
    "pole1": "1 = Protect Retired Union Workers / Provide Federal Guarantees Without Cutting Promised Pensions",
    "pole10": "10 = Prevent Catastrophic Systemic Insolvency of Multiemployer Plans and Protect the PBGC",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2014,
    "id": "2014_epa_coal_plant_carbon_nsps_standards",
    "name": "EPA New Source Performance Standards (NSPS) Banning New Coal Without CCS",
    "type": "News",
    "eraSpan": "2014-2016 (NSPS Carbon Rules)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Setting carbon limits for new fossil-fired power plants that effectively make building new conventional coal plants impossible.",
    "pole1": "1 = Accelerate Clean Energy Transition by Phasing Out Uncontrolled New Coal Combustion",
    "pole10": "10 = Unlawful De Facto Ban on American Coal Energy Crippling Grid Reliability",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_trump_southern_border_wall",
    "name": "Trump Southern Border Wall Proposal & Mexican Funding",
    "type": "News",
    "eraSpan": "2015-2021 (Border Wall Construction Arc)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Building an impenetrable physical concrete/steel wall along the entire 1,954-mile southern border and forcing Mexico to pay.",
    "pole1": "1 = Oppose Ineffective, Inhumane Border Walls / Focus on Modern Ports of Entry",
    "pole10": "10 = Build the Wall Across Entire Border / Stop Illegal Immigration Cold",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_hillary_clinton_email_server",
    "name": "Hillary Clinton Private Email Server & Comey FBI Investigations",
    "type": "News",
    "eraSpan": "2015-2016 (Email Controversy Arc)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Investigating Hillary Clinton's use of an unclassified private server while Secretary of State and handling of classified emails.",
    "pole1": "1 = Classified Information Handled Carelessly but No Criminal Intent Found",
    "pole10": "10 = Prosecute Clinton for Willful Violation of Federal Records and Espionage Laws",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_repeal_replace_obamacare",
    "name": "Complete Statutory Repeal and Replacement of the Affordable Care Act",
    "type": "News",
    "eraSpan": "2010-2020 (Repeal and Replace Campaign)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "GOP pledge to repeal Obamacare 'root and branch' and replace it with free-market health savings accounts and interstate sales.",
    "pole1": "1 = Defend and Expand the ACA / Move Toward Medicare for All",
    "pole10": "10 = Full Immediate Statutory Repeal of Every Word of Obamacare",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_scalia_vacancy_merrick_garland",
    "name": "Antonin Scalia Supreme Court Vacancy & Senate Refusal to Hear Garland",
    "type": "News",
    "eraSpan": "2016 (Supreme Court Balance Showdown)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Mitch McConnell refusing to hold confirmation hearings for Merrick Garland to allow the next president to fill Scalia's seat.",
    "pole1": "1 = Hold Hearings and Confirm Garland Immediately Under Senate Duty",
    "pole10": "10 = Let the Voters Decide / Preserve Conservative Majority with Originalist Justice",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_tpp_rejection_trade_populism",
    "name": "Bipartisan Rejection of the Trans-Pacific Partnership (TPP)",
    "type": "News",
    "eraSpan": "2015-2017 (Trade Realignment Arc)",
    "domain": "Trade & Globalism",
    "tier": 1,
    "debate": "Both major presidential nominees rejecting the 12-nation TPP agreement, marking the end of the 25-year bipartisan free trade consensus.",
    "pole1": "1 = Kill the TPP / Stop Disastrous Trade Deals That Export Good American Jobs",
    "pole10": "10 = Ratify TPP to Anchor U.S. Geopolitical Alliances Against Chinese Hegemony",
    "stances": {
      "dem": 2,
      "gop": 3,
      "lib": 7,
      "grn": 1,
      "con": 2,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_russian_election_interference_dnc",
    "name": "Russian State Cyber Hacking of DNC & Podesta Emails (Guccifer 2.0)",
    "type": "News",
    "eraSpan": "2016-2020 (Russiagate Investigation Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Russian GRU intelligence hacking and leaking private DNC and Clinton campaign emails via WikiLeaks to disrupt the election.",
    "pole1": "1 = Impose Severe Retaliatory Sanctions on Russia / Protect Democratic Infrastructure",
    "pole10": "10 = Reject Distraction Excusing Clinton Failures / Seek Friendly Relations with Russia",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_muslim_travel_ban_proposal",
    "name": "Donald Trump's Proposed Temporary Ban on Muslim Immigration",
    "type": "News",
    "eraSpan": "2015-2018 (Travel Ban Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Calling for a 'total and complete shutdown of Muslims entering the United States until our country's representatives can figure out what is going on'.",
    "pole1": "1 = Unconstitutional Religious Discrimination That Violates Fundamental American Values",
    "pole10": "10 = Extreme Vetting to Protect Homeland from Radical Islamic Terrorism",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_bernie_sanders_political_revolution",
    "name": "Bernie Sanders Democratic Socialist Primary Challenge & DNC Leaks",
    "type": "News",
    "eraSpan": "2015-2016 (Progressive Revolt)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Mobilizing millions of small-dollar donors for single-payer healthcare, tuition-free college, and breaking up big banks.",
    "pole1": "1 = Champion the Political Revolution Against the Corporate Billionaire Class",
    "pole10": "10 = Reject Radical Socialist Redistribution Disastrous to American Prosperity",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_iran_nuclear_deal_jcpoa",
    "name": "Implementation and Defense of the Iran Nuclear Deal (JCPOA)",
    "type": "News",
    "eraSpan": "2015-2018 (JCPOA Implementation Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Verifiable dismantling of Iran's enrichment centrifuges in exchange for lifting international oil and banking sanctions.",
    "pole1": "1 = Honor the Landmark Agreement That Successfully Blocked All Pathways to a Bomb",
    "pole10": "10 = Tear Up the Flawed Deal on Day One / Re-impose Crippling Sanctions",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_california_prop_64_cannabis",
    "name": "California Proposition 64 (Adult-Use Marijuana Legalization)",
    "type": "News",
    "eraSpan": "2016 (California Cannabis Market Legalization)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Legalizing personal adult recreational possession of one ounce and licensing commercial cultivation and retail dispensaries.",
    "pole1": "1 = Vote Yes / End Racially Biased Drug Arrests and Create Billions in Tax Revenues",
    "pole10": "10 = Vote No / Protect Neighborhoods and Highways from Commercialized Drug Market",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_north_carolina_hb2_bathroom_bill",
    "name": "North Carolina House Bill 2 & Transgender Public Restrooms",
    "type": "News",
    "eraSpan": "2016-2017 (Bathroom Bill Controversy)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "State law requiring individuals to use multi-occupancy public restrooms matching the biological sex on their birth certificates.",
    "pole1": "1 = Repeal Discriminatory HB2 / Protect Transgender Civil Rights and Dignity",
    "pole10": "10 = Uphold Common-Sense Protections for Women's and Children's Privacy in Restrooms",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_standing_rock_dakota_access_dapl",
    "name": "Dakota Access Oil Pipeline Protests at Standing Rock Sioux Tribe",
    "type": "News",
    "eraSpan": "2016-2017 (DAPL Indigenous Resistance)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Thousands of indigenous water protectors camping to block crude pipeline crossing beneath Lake Oahe and ancestral treaty lands.",
    "pole1": "1 = Halt Pipeline / Respect Tribal Sovereignty and Protect Missouri River Drinking Water",
    "pole10": "10 = Disperse Lawless Protests / Complete Critical Energy Infrastructure",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_paris_climate_agreement_ratification",
    "name": "Paris Climate Agreement Ratification & 26-28% Emission Pledge",
    "type": "News",
    "eraSpan": "2015-2021 (Paris Agreement Arc)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Entering global climate accord pledging 26-28% U.S. greenhouse gas emissions reductions below 2005 levels by 2025.",
    "pole1": "1 = Full U.S. Commitment to Lead Global Decarbonization and Green Tech Jobs",
    "pole10": "10 = Withdraw from Unfair Paris Accord That Disadvantages American Industry to Benefit China",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_flint_water_crisis_lead_poisoning",
    "name": "Flint Lead Drinking Water Poisoning & Federal Emergency Aid",
    "type": "News",
    "eraSpan": "2015-2017 (Flint Crisis Peak)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "State of emergency declared after 100,000 residents were exposed to neurotoxic lead due to state emergency manager cost-cutting.",
    "pole1": "1 = Comprehensive Federal Infrastructure Aid and Criminal Prosecution of State Officials",
    "pole10": "10 = Hold Negligent Bureaucrats Accountable While Maintaining State Fiscal Responsibility",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_pulse_nightclub_shooting_gun_filibuster",
    "name": "Pulse Nightclub Massacre & Senate Democratic 'No Fly, No Buy' Filibuster",
    "type": "News",
    "eraSpan": "2016 (Post-Pulse Gun Filibuster)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Mass murder of 49 people at an LGBTQ nightclub in Orlando, sparking Chris Murphy's 15-hour Senate filibuster for gun reform.",
    "pole1": "1 = Ban Assault Rifles & Enact 'No Fly, No Buy' Terror Watchlist Gun Restrictions",
    "pole10": "10 = Protect Second Amendment and Due Process Against Secret Government Watchlists",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2016,
    "id": "2016_third_party_surges_johnson_stein",
    "name": "Gary Johnson (Libertarian) & Jill Stein (Green) Third-Party Surges",
    "type": "News",
    "eraSpan": "2016 (Third-Party Double Surge)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Record-high polling for Libertarian and Green tickets as voters express historic dissatisfaction with Trump and Clinton.",
    "pole1": "1 = Beware Ineffective Third-Party Spoilers That Help Elect Donald Trump",
    "pole10": "10 = Break the Corrupt Two-Party Duopoly / Vote Principle Over Fear",
    "stances": {
      "dem": 8,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 2,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_dnc_chair_wasserman_schultz_resignation",
    "name": "DNC Leaks Exposing Primary Favoritism & Debbie Wasserman Schultz Ouster",
    "type": "News",
    "eraSpan": "2016 (DNC Convention Shock)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "DNC Chair forced to resign on the eve of the convention after leaked emails show staff conspiring to undermine Bernie Sanders.",
    "pole1": "1 = Reform Democratic Party Nominating Rules and Eliminate Unpledged Superdelegates",
    "pole10": "10 = Expose Corrupt Democratic Machine Rigging the System Against True Outsiders",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_fbi_apple_san_bernardino_iphone_encryption",
    "name": "FBI vs. Apple San Bernardino iPhone Encryption Backdoor Fight",
    "type": "News",
    "eraSpan": "2016 (Smartphone Encryption Showdown)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "DOJ court order demanding Apple create a custom iOS firmware bypass to unlock mass shooter's password-protected iPhone.",
    "pole1": "1 = Refuse Backdoor Master Keys That Compromise Cybersecurity for Hundreds of Millions",
    "pole10": "10 = Order Apple to Assist Law Enforcement in Combating Deadly Terrorist Plots",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_access_hollywood_tape_controversy",
    "name": "Donald Trump 'Access Hollywood' Audio Tape & Sexual Assault Accusations",
    "type": "News",
    "eraSpan": "2016 (October Surprise)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Release of 2005 video showing Donald Trump bragging about groping women without consent, leading dozens of Republicans to withdraw endorsements.",
    "pole1": "1 = Disqualifying Moral Degradation, Misogyny, and Unfitness for the Presidency",
    "pole10": "10 = Dismiss 'Locker Room Talk' / Stay Focused on Supreme Court and Economic Survival",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_fbi_director_comey_october_letter",
    "name": "James Comey's October 28 Letter Re-opening Clinton Email Inquiries",
    "type": "News",
    "eraSpan": "2016 (October Comey Letter)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "FBI Director notifying Congress 11 days before the election that new emails found on Anthony Weiner's laptop were being reviewed.",
    "pole1": "1 = Unprecedented, Egregious Violation of DOJ Norms Directly Influencing the Election Outcome",
    "pole10": "10 = Commend Director Comey for Transparently Fulfilling Sworn Duty to Congress",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_carrier_air_conditioner_mexico_move",
    "name": "Carrier Moving 1,400 Indiana Manufacturing Jobs to Monterrey, Mexico",
    "type": "News",
    "eraSpan": "2016 (Rust Belt Plant Closure Symbol)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Viral smartphone video of factory workers being told their jobs were moving to Mexico, fueling Trump's 35% tariff threats.",
    "pole1": "1 = End Corporate Tax Subsidies for Offshoring and Strengthen Collective Bargaining",
    "pole10": "10 = Slap 35% Punitive Tariffs on Companies That Move American Factories Abroad",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 10,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_syrian_refugee_resettlement_moratorium",
    "name": "Banning Syrian Refugee Resettlement Post-Paris Terror Attacks",
    "type": "News",
    "eraSpan": "2015-2017 (Syrian Refugee Battle)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "GOP governors and Congress attempting to halt admission of 10,000 Syrian refugees over ISIS infiltration fears.",
    "pole1": "1 = Welcome Vetted Refugees Fleeing Brutal War and Terror as a Moral Duty",
    "pole10": "10 = Halt All Admissions from War Zones Lacking Reliable Background Records",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_california_prop_62_66_death_penalty",
    "name": "California Proposition 62 (Repeal) vs. Proposition 66 (Expedite Executions)",
    "type": "News",
    "eraSpan": "2016 (Dual Death Penalty Ballot Fight)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters defeating capital punishment abolition (Prop 62) while passing Prop 66 to speed up death penalty appeals.",
    "pole1": "1 = Abolish Costly, Racially Biased, and Inhumane Capital Punishment",
    "pole10": "10 = Fast-Track Appeals and Carry Out Lawful Executions for Heinous Murderers",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_puerto_rico_promesa_control_board",
    "name": "Enactment of Puerto Rico Oversight, Management, and Economic Stability Act (PROMESA)",
    "type": "News",
    "eraSpan": "2016 (PROMESA Board Enacted)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Creating an unelected federal financial control board to restructure Puerto Rico's $72 billion unpayable debt.",
    "pole1": "1 = Oppose Anti-Democratic Colonial Junta Subordinating Public Schools to Wall Street Vultures",
    "pole10": "10 = Essential Fiscal Oversight to Restore Sovereign Credit and Force Responsible Budgets",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_colorado_prop_106_medical_aid_in_dying",
    "name": "Colorado Proposition 106 (End of Life Options Act)",
    "type": "News",
    "eraSpan": "2016 (Western Assisted Dying Expansion)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Voter approval (65%) allowing terminally ill adult residents to obtain prescription medication for self-administered dying.",
    "pole1": "1 = Compassionate Right for Terminally Ill Patients to Die with Peace and Dignity",
    "pole10": "10 = Oppose Physician-Assisted Suicide / Protect Sacred Sanctity of Human Life",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_arizona_prop_206_minimum_wage_12",
    "name": "Arizona Proposition 206 (Raising Minimum Wage to $12 & Paid Sick Days)",
    "type": "News",
    "eraSpan": "2016 (Red State Minimum Wage Push)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Citizen initiative approved by 58% of Arizona voters raising wage to $12 by 2020 and mandating paid sick leave.",
    "pole1": "1 = Stand with Low-Wage Workers to Mandate Living Wages and Earned Sick Leave",
    "pole10": "10 = Oppose Government Mandates That Inflate Small Business Payrolls and Accelerate Automation",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_nevada_question_1_background_checks",
    "name": "Nevada Question 1 (Universal Gun Background Checks Narrow Approval)",
    "type": "News",
    "eraSpan": "2016 (State Gun Ballot Measure)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Citizen initiative narrowly approved (50.4%) requiring background checks through licensed dealers for private firearm sales.",
    "pole1": "1 = Close Private Gun Sale Loopholes to Keep Firearms Away from Dangerous Felons",
    "pole10": "10 = Defend Lawful Second Amendment Gun Transfers Against Burdensome Government Registries",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2016,
    "id": "2016_massachusetts_question_4_cannabis",
    "name": "Massachusetts Question 4 (Legalizing Adult-Use Cannabis in New England)",
    "type": "News",
    "eraSpan": "2016 (East Coast Legalization Breakthrough)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Approving recreational marijuana legalization and taxation with 53.7% of the vote, opening the Northeast retail market.",
    "pole1": "1 = End Harmful Prohibition and Build an Equitable Regulated Cannabis Industry",
    "pole10": "10 = Resist Expanding Commercial Drug Operations Near Neighborhoods and Schools",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_dodd_frank_regulatory_clawback",
    "name": "Financial CHOICE Act (House GOP Overhaul of Dodd-Frank)",
    "type": "News",
    "eraSpan": "2016-2018 (Dodd-Frank Rollback Push)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Replacing Dodd-Frank's complex capital mandates with a simple off-ramp leverage ratio and defanging the CFPB.",
    "pole1": "1 = Defend Dodd-Frank to Prevent Another Catastrophic 2008 Wall Street Crash",
    "pole10": "10 = Pass the CHOICE Act to Unleash Community Bank Lending and Free Up Small Business Credit",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_china_currency_manipulator_designation",
    "name": "Pledging to Formally Label China a Currency Manipulator on Day One",
    "type": "News",
    "eraSpan": "2015-2019 (Currency Manipulation Arc)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Executive pledge to instruct Treasury to label Beijing a currency manipulator to trigger compensatory tariffs.",
    "pole1": "1 = Pursue Multilateral Currency Oversight Through IMF and Bilateral Talks",
    "pole10": "10 = Designate China Immediately and Impose Compensatory Tariffs to Level Playing Field",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_south_china_sea_hague_arbitration",
    "name": "Hague Permanent Court of Arbitration Ruling Against China's Nine-Dash Line",
    "type": "News",
    "eraSpan": "2016 (Landmark Maritime Ruling)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "International tribunal ruling that China has no legal historic claim to waters within its nine-dash line in the South China Sea.",
    "pole1": "1 = Uphold International Law of the Sea and Mobilize Global Diplomatic Pressure on Beijing",
    "pole10": "10 = Increase Combat Naval Patrols to Demonstrate China's Claims Cannot Nullify Freedom of Navigation",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_fbi_surveillance_carter_page_fisa",
    "name": "FISA Warrant Applications on Trump Campaign Aide Carter Page",
    "type": "News",
    "eraSpan": "2016-2019 (Crossfire Hurricane / FISA Abuses)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "DOJ obtaining secret Foreign Intelligence Surveillance Act warrants relying partly on unverified Steele dossier memos.",
    "pole1": "1 = Legitimate Counterintelligence Investigation into Substantial Russian Foreign Contacts",
    "pole10": "10 = Egregious Deep State Surveillance and Illegal Espionage Against an Opposition Presidential Campaign",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_epa_methane_emissions_rule",
    "name": "EPA Section 111(b) Direct Methane Regulation for New Oil and Gas Wells",
    "type": "News",
    "eraSpan": "2016-2020 (Methane Rule Arc)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "First federal rules directly requiring oil and gas operators to find and repair methane leaks from new and modified wells.",
    "pole1": "1 = Regulate Potent Methane Greenhouse Gases to Prevent Rapid Near-Term Warming",
    "pole10": "10 = Rescind Unnecessary Redundant Regulations on America's Energy Producers",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_overtime_salary_threshold_doubling",
    "name": "Department of Labor Rule Doubling Overtime Salary Threshold to $47,476",
    "type": "News",
    "eraSpan": "2016-2017 (Overtime Rule Battle)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Expanding mandatory overtime eligibility to 4.2 million salaried managers earning under $47,476 before a federal court injunction.",
    "pole1": "1 = Restore Fair Pay for Millions of Salaried Workers Working 50+ Hours for Free",
    "pole10": "10 = Oppose Arbitrary Wage Mandates Forcing Salaried Professionals into Hourly Punch-Clocks",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_colombia_farc_peace_accord_plebiscite",
    "name": "Colombian Peace Accord with FARC Guerrillas & Surprise Voter Rejection",
    "type": "News",
    "eraSpan": "2016 (Colombian Peace Process)",
    "domain": "Foreign Policy & Defense",
    "tier": 5,
    "debate": "Colombian electorate narrowly rejecting the initial peace pact offering transitional justice rather than prison for guerrilla commanders.",
    "pole1": "1 = Support Colombian Peace and Reintegration to End 52 Years of Civil Conflict",
    "pole10": "10 = Respect Colombian Voters Demanding Real Justice and Accountability for Terrorist Crimes",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_cuba_obama_historic_havana_visit",
    "name": "President Obama's Historic Official Visit to Havana, Cuba",
    "type": "News",
    "eraSpan": "2016 (Havana Summit)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "First sitting U.S. president to visit Cuba in 88 years, attending an exhibition baseball game with Raúl Castro.",
    "pole1": "1 = Historic Triumph of Engagement Bringing Hope, Tourism, and Openness to Cuban People",
    "pole10": "10 = Shameful Photo-Op Legitimizing a Ruthless Communist Dictatorship Still Jailing Dissidents",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_yemen_saudi_coalition_us_refueling",
    "name": "U.S. Aerial Mid-Air Refueling and Intelligence for Saudi Coalition in Yemen",
    "type": "News",
    "eraSpan": "2015-2019 (Yemen War Complicity Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Providing U.S. tankers to refuel Saudi bombers executing air strikes against Houthi rebels that caused heavy civilian casualties.",
    "pole1": "1 = Immediately Halt All U.S. Refueling, Arms Sales, and Logistical Complicity in Yemen War",
    "pole10": "10 = Maintain Security Assistance to Saudi Ally to Push Back Iranian Houthi Proxies",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_fcc_broadband_privacy_rules",
    "name": "FCC Privacy Regulations Barring ISPs from Selling Browsing Histories",
    "type": "News",
    "eraSpan": "2016-2017 (Broadband Privacy Rules)",
    "domain": "Technology & Infrastructure",
    "tier": 4,
    "debate": "Requiring internet service providers to obtain opt-in customer consent before sharing web browsing histories with advertisers.",
    "pole1": "1 = Safeguard Consumer Privacy from Monopolistic Telecoms Weaponizing Personal Data",
    "pole10": "10 = Reject Discriminatory Rules That Handicap ISPs While Leaving Google and Facebook Unregulated",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_maine_question_5_ranked_choice_voting",
    "name": "Maine Question 5 (First Statewide Approval of Ranked-Choice Voting)",
    "type": "News",
    "eraSpan": "2016 (RCV Historic Pioneer)",
    "domain": "Governance & Judiciary",
    "tier": 4,
    "debate": "Voters approving ranked-choice voting for statewide, legislative, and congressional elections to eliminate spoiler candidates.",
    "pole1": "1 = Vote Yes / Empower Voters, Encourage Civility, and Eliminate the Spoiler Effect",
    "pole10": "10 = Vote No / Confusing Scheme That Undermines the Traditional One-Person-One-Vote Standard",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 1,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_california_prop_61_drug_price_caps",
    "name": "California Proposition 61 (Tying State Drug Purchases to VA Prices)",
    "type": "News",
    "eraSpan": "2016 (State Drug Price Battle)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "High-stakes ballot fight requiring California state agencies to pay no more for prescription drugs than the U.S. Department of Veterans Affairs.",
    "pole1": "1 = Vote Yes / Stand Up to Big Pharma Greed and Lower Prescription Costs for Taxpayers",
    "pole10": "10 = Vote No / Flawed Initiative That Will Eliminate VA Discounts and Limit Patient Access",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_wells_fargo_fake_accounts_scandal",
    "name": "Wells Fargo Unauthorized Customer Accounts & $185M Regulatory Fine",
    "type": "News",
    "eraSpan": "2016-2017 (Retail Banking Fraud)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Discovery that bank employees opened 2 million unauthorized credit card and deposit accounts to meet predatory sales quotas.",
    "pole1": "1 = Break Up Wells Fargo and Enact Stiff Criminal Liability for Senior Bank Executives",
    "pole10": "10 = Discipline Corrupt Middle Management / Enforce Restitution Without Crippling the Banking System",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_charlotte_police_shooting_keith_scott",
    "name": "Fatal Shooting of Keith Lamont Scott & Civil Unrest in Charlotte, NC",
    "type": "News",
    "eraSpan": "2016 (Charlotte Unrest)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Several nights of street unrest and highway blockades following fatal police shooting of Black motorist in apartment complex.",
    "pole1": "1 = Demand Independent Investigations, End Bias in Policing, and Enact Systemic Justice Reforms",
    "pole10": "10 = Enforce Law and Order / Stop Violent Rioters from Burning American Communities",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_obama_gun_control_executive_actions",
    "name": "Obama Executive Actions on Background Checks and Mental Health Reporting",
    "type": "News",
    "eraSpan": "2016 (Executive Gun Measures)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Issuing executive actions clarifying that anyone 'in the business' of selling firearms must conduct background checks.",
    "pole1": "1 = Strong Executive Action to Prevent Gun Violence and Save American Lives",
    "pole10": "10 = Unconstitutional Executive Overreach Bypassing Congress to Chip Away at the Second Amendment",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2016,
    "id": "2016_clean_power_plan_scotus_stay",
    "name": "Supreme Court Unprecedented 5-4 Stay on EPA Clean Power Plan",
    "type": "News",
    "eraSpan": "2016 (SCOTUS Carbon Stay)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Supreme Court issuing an emergency stay halting implementation of the Clean Power Plan before the DC Circuit heard oral argument.",
    "pole1": "1 = Disappointing Judicial Activism Delaying Urgent Climate Action to Protect Fossil Polluters",
    "pole10": "10 = Courageous Judicial Interdiction Halting Unprecedented Clean Air Act Federal Usurpation",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_fannie_freddie_net_worth_sweep",
    "name": "Treasury Third Amendment 'Net Worth Sweep' Profit Confiscation",
    "type": "News",
    "eraSpan": "2012-2018 (GSE Profit Sweep Controversy)",
    "domain": "Economy & Taxation",
    "tier": 6,
    "debate": "Shareholders suing the federal government over the Treasury sweeping all Fannie and Freddie quarterly profits into the general fund.",
    "pole1": "1 = Reclaim Every Dime for Taxpayers Who Put $187B on the Line to Rescue Wall Street",
    "pole10": "10 = Illegal Fifth Amendment Expropriation of Private Shareholders' Lawful Equity",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_department_of_labor_fiduciary_rule",
    "name": "Department of Labor Fiduciary Rule for Retirement Investment Advisers",
    "type": "News",
    "eraSpan": "2016-2018 (Fiduciary Standard Battle)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Requiring financial brokers offering retirement advice to act as legally binding fiduciaries rather than under suitability rules.",
    "pole1": "1 = Stop Wall Street Brokers from Siphoning $17B Annually from Retirement Savers Through Kickbacks",
    "pole10": "10 = Repeal the Fiduciary Rule / Excessive Liability That Restricts Low-Balance Investor Advice",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_south_dakota_initiated_measure_22",
    "name": "South Dakota Measure 22 (Anti-Corruption & Public Campaign Financing)",
    "type": "News",
    "eraSpan": "2016 (State Anti-Corruption Measure)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Voters narrowly passing sweeping ethics overhaul with $100 'democracy credit' public campaign vouchers, later repealed by legislature.",
    "pole1": "1 = Stand with Voters to Clean Up Dirty Money and End Lobbyist Gifts in State Capitals",
    "pole10": "10 = Repeal Measure 22 / Unconstitutional Scheme Using Taxpayer Dollars to Fund Political Attack Ads",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_zika_virus_emergency_funding_stalemate",
    "name": "Emergency Supplemental Appropriations for Mosquito-Borne Zika Virus",
    "type": "News",
    "eraSpan": "2016 (Zika Funding Gridlock)",
    "domain": "Healthcare",
    "tier": 4,
    "debate": "Seven-month congressional gridlock over funding vaccine development for microcephaly-causing Zika virus due to abortion riders.",
    "pole1": "1 = Pass Clean Emergency Funding Without Harmful Restrictions on Planned Parenthood Clinics",
    "pole10": "10 = Offset Emergency Spending and Prevent Taxpayer Dollars from Funding Contraceptive Clinics",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_trade_deficit_with_mexico_and_nafta",
    "name": "Donald Trump Pledging to Terminate or Renegotiate NAFTA",
    "type": "News",
    "eraSpan": "2015-2019 (USMCA Precursor)",
    "domain": "Trade & Globalism",
    "tier": 2,
    "debate": "Denouncing the 1994 North American Free Trade Agreement as the worst trade deal ever made in the history of the world.",
    "pole1": "1 = Renegotiate NAFTA to Protect Labor Rights, Higher Wages, and Environmental Standards",
    "pole10": "10 = Tear Up NAFTA or Slap Heavy Border Adjustment Taxes to Bring Factories Home",
    "stances": {
      "dem": 2,
      "gop": 6,
      "lib": 8,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_minimum_wage_seattle_fifteen_rollout",
    "name": "Economic Impact Studies on Seattle's Phase-In to $15 Minimum Wage",
    "type": "News",
    "eraSpan": "2015-2018 (Seattle Wage Studies)",
    "domain": "Labor & Welfare",
    "tier": 4,
    "debate": "Conflicting economic studies analyzing whether Seattle's pioneering wage hike reduced low-skilled work hours or boosted aggregate wages.",
    "pole1": "1 = Seattle Demonstrates Wage Hikes Lift Working Families Out of Poverty Without Slowing Booming Growth",
    "pole10": "10 = Economic Evidence Proves High Minimum Wages Destroy Low-Income Entry Hours and Accelerate Tech",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2016,
    "id": "2016_russia_syria_aleppo_bombardment",
    "name": "Russian Aerial Bombardment of Rebel-Held Eastern Aleppo",
    "type": "News",
    "eraSpan": "2016 (Siege of Aleppo)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Russian air force bunker-buster bombs devastating hospitals and residential neighborhoods to help Assad recapture Aleppo.",
    "pole1": "1 = Enact Severe Sanctions for Russian War Crimes and Provide Immediate Humanitarian Corridors",
    "pole10": "10 = Decisive Anti-Terrorist Operations Necessary to Defeat Al-Nusra and Restore Syrian Stability",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_tax_cuts_and_jobs_act_tcja",
    "name": "Tax Cuts and Jobs Act of 2017 (TCJA - 21% Corporate Rate & Individual Cuts)",
    "type": "News",
    "eraSpan": "2017-2025 (TCJA Era)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Evaluating the landmark tax overhaul slashing the federal corporate income tax rate from 35% to 21% and doubling the standard deduction.",
    "pole1": "1 = Repeal TCJA as an Oligarchic Handout to the Ultra-Wealthy & Corporations",
    "pole10": "10 = Celebrate Historic Tax Relief Powering Booming Jobs, Wages, and Investment",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_brett_kavanaugh_confirmation_hearings",
    "name": "Brett Kavanaugh Supreme Court Confirmation Hearings & Blasey Ford Testimony",
    "type": "News",
    "eraSpan": "2018 (Supreme Court Cultural Showdown)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Contentious confirmation hearings following Dr. Christine Blasey Ford's testimony alleging high school sexual assault and Kavanaugh's fiery defense.",
    "pole1": "1 = Believe Survivors / Demand Thorough FBI Inquiry / Reject Kavanaugh",
    "pole10": "10 = Defend Presumption of Innocence Against Uncorroborated Partisan Smears",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_zero_tolerance_family_separations",
    "name": "Zero-Tolerance Border Policy & Migrant Family Separations",
    "type": "News",
    "eraSpan": "2018 (Family Separation Crisis)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "DOJ policy criminally prosecuting all unauthorized border crossers, resulting in over 2,800 children being separated from their parents.",
    "pole1": "1 = Condemn Inhumane, Cruel Child Separation Policy / Demand Family Reunification",
    "pole10": "10 = Enforce the Rule of Law / Deter Illegal Crossers Exploiting Children as Shields",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_parkland_shooting_march_for_our_lives",
    "name": "Marjory Stoneman Douglas High School Shooting & March for Our Lives",
    "type": "News",
    "eraSpan": "2018 (Youth Gun Safety Mobilization)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Mass murder of 17 students and staff in Parkland, FL, igniting nationwide student walkouts and the March for Our Lives rally in DC.",
    "pole1": "1 = Ban Military-Style Assault Weapons, High-Capacity Magazines & Pass Red Flag Laws",
    "pole10": "10 = Protect Second Amendment Rights / Arm Trained Teachers & Harden School Campuses",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2018,
    "id": "2018_china_trade_war_tariffs_retaliation",
    "name": "Section 301 Tariffs on $250B Chinese Imports & Farm Retaliation",
    "type": "News",
    "eraSpan": "2018-2026 (Trade War Arc)",
    "domain": "Trade & Globalism",
    "tier": 1,
    "debate": "Imposing unilateral 10% to 25% tariffs on $250 billion in Chinese goods, triggering retaliatory Chinese tariffs on American soybeans.",
    "pole1": "1 = Stand with Heartland Farmers Crushed by Chaos / Multilateral Trade Action with Allies",
    "pole10": "10 = Use Tariffs to Confront Decades of Chinese Intellectual Property Theft and Dumping",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 3,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_mueller_special_counsel_investigation",
    "name": "Robert Mueller Special Counsel Investigation into Russian Interference",
    "type": "News",
    "eraSpan": "2017-2019 (Mueller Probe Arc)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Investigating Russian interference, Trump campaign links, and potential presidential obstruction of justice following James Comey's firing.",
    "pole1": "1 = Protect Special Counsel from Presidential Interference / Uncover Full Truth",
    "pole10": "10 = Shut Down the Unconstitutional, Witch-Hunt Investigation Led by Partisan Democrats",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_me_too_movement_workplace_harassment",
    "name": "#MeToo Movement Accountability for Workplace Sexual Harassment",
    "type": "News",
    "eraSpan": "2017-2020 (#MeToo Cultural Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Cultural reckoning exposing systemic sexual abuse and forcing resignations across media, Hollywood, corporate boardrooms, and Congress.",
    "pole1": "1 = Believe Women, Ban Non-Disclosure Agreements for Harassment, and Enforce Accountability",
    "pole10": "10 = Ensure Fair Due Process and Guard Against Rush-to-Judgment Trial by Twitter",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_abolish_ice_progressive_rallying_cry",
    "name": "Progressive Demands to 'Abolish ICE' & Restructure Immigration Enforcement",
    "type": "News",
    "eraSpan": "2018-2020 (Abolish ICE Debate)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "Calls by progressive Democrats and activists to dismantle Immigration and Customs Enforcement following family separations.",
    "pole1": "1 = Abolish ICE and Decriminalize Unauthorized Border Crossing",
    "pole10": "10 = Back ICE Heroes Enforcing Federal Law and Deporting Violent Criminal Aliens",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_protecting_pre_existing_conditions_aca",
    "name": "Protecting Pre-Existing Conditions in ACA (Texas v. United States Lawsuit)",
    "type": "News",
    "eraSpan": "2018 (Healthcare Midterm Central Theme)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "GOP state lawsuit supported by Trump DOJ seeking to invalidate the entire ACA, including protections for pre-existing conditions.",
    "pole1": "1 = Protect Pre-Existing Condition Guarantees as a Sacred Inviolable Right for All Americans",
    "pole10": "10 = Repeal Obamacare While Passing Separate State-Based Guarantees for Sick Individuals",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_florida_amendment_4_felon_voting",
    "name": "Florida Amendment 4 (Automatic Restoration of Voting Rights for Felons)",
    "type": "News",
    "eraSpan": "2018 (Historic Rights Restoration)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Citizen constitutional initiative approved by 64.5% of Florida voters automatically restoring voting rights to 1.4 million nonviolent felons.",
    "pole1": "1 = Vote Yes / Welcome Returning Citizens Back into Democracy and End Jim Crow Disenfranchisement",
    "pole10": "10 = Vote No / Felons Must Pay All Restitution, Fines, and Fees Before Regaining Voting Privileges",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_fcc_net_neutrality_repeal_ajit_pai",
    "name": "FCC Chairman Ajit Pai Restoring Internet Freedom Order (Repealing Net Neutrality)",
    "type": "News",
    "eraSpan": "2017-2021 (Net Neutrality Repeal Phase)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Dismantling 2015 Title II common carrier broadband regulations, returning oversight to the FTC.",
    "pole1": "1 = Pass Congressional Review Act to Reinstate Federal Net Neutrality Protections",
    "pole10": "10 = Support Light-Touch Deregulation That Spurred Billions in Private Fiber and 5G Investment",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_neil_gorsuch_confirmation_nuclear_option",
    "name": "Neil Gorsuch Supreme Court Confirmation & Nuclear Option for SCOTUS",
    "type": "News",
    "eraSpan": "2017 (Gorsuch Confirmation)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Mitch McConnell lowering the Supreme Court confirmation threshold to a simple majority to confirm textualist Neil Gorsuch.",
    "pole1": "1 = Condemn the Stolen Seat and Destruction of the 60-Vote Senate Filibuster Norm",
    "pole10": "10 = Confirm Brilliant Originalist Jurist Dedicated to the Rule of Law and Textual Fidelity",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_iran_nuclear_deal_withdrawal_jcpoa",
    "name": "U.S. Unilateral Withdrawal from the JCPOA Iran Nuclear Accord",
    "type": "News",
    "eraSpan": "2018 (JCPOA Withdrawal)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "President Trump withdrawing from the 2015 Iran pact and re-imposing maximum pressure secondary sanctions on Iranian oil exports.",
    "pole1": "1 = Reckless Violation of a Functioning Treaty That Increases the Risk of a Middle East War",
    "pole10": "10 = Dismantle a Disastrous Deal That Paved Iran's Path to a Bomb and Funded Terrorism",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_us_embassy_move_to_jerusalem",
    "name": "Relocation of the United States Embassy to Jerusalem",
    "type": "News",
    "eraSpan": "2017-2018 (Jerusalem Embassy Move)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Fulfilling the 1995 Jerusalem Embassy Act by formally recognizing Jerusalem as Israel's capital and relocating the embassy.",
    "pole1": "1 = Inflammatory Unilateral Move That Torpedoes Any Hope of a Two-State Peace Settlement",
    "pole10": "10 = Bold, Courageous Fulfillment of American Law Standing Firmly with Democratic Ally Israel",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_michigan_proposal_1_cannabis",
    "name": "Michigan Proposal 1 (Legalizing Adult-Use Cannabis in the Industrial Midwest)",
    "type": "News",
    "eraSpan": "2018 (Midwest Cannabis Breakthrough)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Voters approving legal possession, growing, and retail commercial taxation of cannabis with 56% of the vote.",
    "pole1": "1 = Landmark Midwestern Victory for Drug Decriminalization and Commercial Freedom",
    "pole10": "10 = Oppose Creating Another Predatory Commercial Addiction Industry",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_first_step_act_criminal_justice",
    "name": "First Step Act of 2018 (Bipartisan Federal Criminal Justice Reform)",
    "type": "News",
    "eraSpan": "2018 (Landmark Sentencing Reform)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Bipartisan legislation reducing mandatory minimum sentences, expanding good-time credits, and retroactively applying the Fair Sentencing Act.",
    "pole1": "1 = Crucial First Step Toward Ending Mass Incarceration / Must Go Much Further",
    "pole10": "10 = Champion Bipartisan Trump Achievement Reforming Sentencing and Reducing Recidivism",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_missouri_proposition_a_right_to_work",
    "name": "Missouri Proposition A (Overwhelming Voter Rejection of Right-to-Work)",
    "type": "News",
    "eraSpan": "2018 (Labor Referendum Victory)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Voters crushing (67.5% No) a GOP legislative statute designed to make Missouri a Right-to-Work state.",
    "pole1": "1 = Historic Working-Class Victory Defeating Anti-Union Corporate Attack on Wages",
    "pole10": "10 = Disappointing Result Hindering Missouri's Economic Competitiveness for New Factories",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_paris_accord_exit_announcement",
    "name": "Executive Notice of Withdrawal from the Paris Climate Accord",
    "type": "News",
    "eraSpan": "2017-2020 (Paris Exit Phase)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Formally beginning the multi-year process to withdraw the United States from international greenhouse gas commitments.",
    "pole1": "1 = Disastrous Abdication of Global Leadership Endangering the Future of the Planet",
    "pole10": "10 = Put America First and Protect Domestic Manufacturing from Punitive Globalist Mandates",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_daca_court_injunctions_termination",
    "name": "Federal District Courts Blocking Trump Rescission of DACA",
    "type": "News",
    "eraSpan": "2017-2020 (DACA Litigation Arc)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "Federal judges ruling that DHS's decision to wind down DACA was arbitrary, capricious, and lacked rational legal justification.",
    "pole1": "1 = Protect Dreamers from Unlawful Deportation / Pass Permanent Freedom to Dream Law",
    "pole10": "10 = Unelected Judges Usurping Executive Discretion to Protect Unconstitutional Amnesties",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_jamal_khashoggi_assassination_saudi",
    "name": "Assassination of Jamal Khashoggi in Istanbul & Saudi Crown Prince",
    "type": "News",
    "eraSpan": "2018 (Khashoggi Murder Aftermath)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "CIA assessment concluding Saudi Crown Prince Mohammed bin Salman personally ordered the brutal murder and dismemberment of the journalist.",
    "pole1": "1 = Hold Saudi Regime Accountable / Halt All Weapons Sales and Enact Magnitsky Sanctions",
    "pole10": "10 = Condemn Murder but Protect Vital Strategic and Energy Partnership with Saudi Arabia",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_epa_clean_water_wotus_repeal",
    "name": "Repeal & Replacement of the 2015 Clean Water Rule (WOTUS)",
    "type": "News",
    "eraSpan": "2017-2020 (Navigable Waters Protection Rule)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "EPA publishing the Navigable Waters Protection Rule excluding ephemeral streams and isolated wetlands from federal permits.",
    "pole1": "1 = Reckless Gutting of Clean Water Protections Threatening Drinking Water for Millions",
    "pole10": "10 = Welcome Relief for Farmers and Homebuilders from Lawless Federal Bureaucratic Overreach",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_affordable_care_act_individual_mandate_zero",
    "name": "Zeroing Out the ACA Individual Mandate Penalty in the 2017 Tax Bill",
    "type": "News",
    "eraSpan": "2017-2019 (Mandate Penalty Repeal)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Eliminating the federal tax penalty for individuals who choose not to buy ACA health insurance.",
    "pole1": "1 = Sabotage Designed to Trigger Death Spirals in Insurance Markets and Spike Premiums",
    "pole10": "10 = Liberate Millions of Americans from Unconstitutional Mandates and Punitive IRS Penalties",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_usmca_nafta_renegotiation_signing",
    "name": "Signing of the United States-Mexico-Canada Agreement (USMCA)",
    "type": "News",
    "eraSpan": "2018-2020 (USMCA Ratification Arc)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Replacing NAFTA with new rules requiring 75% regional auto content and $16/hr wage minimums for 40% of vehicle parts.",
    "pole1": "1 = Strengthen Independent Labor Enforcement in Mexico Before Granting Final Approval",
    "pole10": "10 = Fulfill Campaign Promise Delivering Fair, Reciprocal Trade That Revitalizes Rust Belt Autos",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_puerto_rico_hurricane_maria_death_toll",
    "name": "Hurricane Maria Aftermath & GWU Study Revealing 2,975 Deaths",
    "type": "News",
    "eraSpan": "2017-2019 (Maria Recovery Controversy)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Investigation into the botched federal disaster response, months of power blackouts, and dispute over the revised 2,975 mortality figure.",
    "pole1": "1 = Disgraceful Federal Dereliction of Duty Treating Fellow American Citizens as Second-Class",
    "pole10": "10 = Defend FEMA's Extraordinary Logistical Support on an Island with Crumbling Local Infrastructure",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_charlottesville_white_supremacy_rallies",
    "name": "'Unite the Right' Rally in Charlottesville & 'Very Fine People' Remark",
    "type": "News",
    "eraSpan": "2017-2018 (Charlottesville Fall-Out)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Violent neo-Nazi rallies resulting in the murder of counter-protester Heather Heyer and Trump's controversial moral equivalence comments.",
    "pole1": "1 = Unambiguously Condemn White Supremacy, Neo-Nazism, and Presidential Sympathy",
    "pole10": "10 = Condemn Violent Extremists on Both Sides / Defend Historical Statues from Mob Removal",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_janus_v_afscme_public_sector_dues",
    "name": "Supreme Court Ruling on Public Sector Union Fees (Janus v. AFSCME)",
    "type": "News",
    "eraSpan": "2018 (Janus Labor Decision)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Supreme Court holding that public sector agency shop fees violate the First Amendment rights of non-members.",
    "pole1": "1 = Decades-Long Corporate Attack Designed to Starve Public Sector Unions and Teachers",
    "pole10": "10 = Triumph for Free Speech Ensuring Workers Cannot Be Coerced into Funding Political Speech",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_north_korea_singapore_summit_kim",
    "name": "Donald Trump & Kim Jong Un Historic Singapore Nuclear Summit",
    "type": "News",
    "eraSpan": "2018 (Singapore Summit)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "First face-to-face summit between a sitting U.S. president and North Korean leader, yielding a vague joint denuclearization statement.",
    "pole1": "1 = Legitimized a Brutal Dictator with No Concrete Verifiable Concessions on Centrifuges",
    "pole10": "10 = Unprecedented Presidential Statesmanship Breaking Decades of Stagnant Diplomatic Failure",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_facebook_cambridge_analytica_scandal",
    "name": "Facebook & Cambridge Analytica Voter Data Harvesting Scandal",
    "type": "News",
    "eraSpan": "2018 (Social Media Data Privacy Crisis)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Revelations that political consulting firm Cambridge Analytica improperly harvested private data of 87M users for voter profiling.",
    "pole1": "1 = Enact Comprehensive European-Style GDPR Data Privacy Laws and Break Up Big Tech",
    "pole10": "10 = Hold Bad Actors Accountable / Protect Voluntary Digital Advertising Ecosystems",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_steel_aluminum_section_232_tariffs",
    "name": "National Security Section 232 Tariffs on Steel (25%) & Aluminum (10%)",
    "type": "News",
    "eraSpan": "2018-2021 (Section 232 Metal Tariffs)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Invoking Cold War national security statute to slap tariffs on imported steel and aluminum from allies like Canada, Mexico, and the EU.",
    "pole1": "1 = Abusing National Security Laws to Punish Democratic Allies and Inflate Manufacturing Costs",
    "pole10": "10 = Protect Core Defense Industrial Base and Stop Foreign Subsidized Glut from Destroying U.S. Mills",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_opioid_crisis_public_health_emergency",
    "name": "Nationwide Opioid Crisis Declaration & Substance Use Disorder Bill",
    "type": "News",
    "eraSpan": "2017-2020 (Opioid Crisis Response)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Enacting the bipartisan SUPPORT Act to expand addiction treatment and combat illicit fentanyl shipments via international mail.",
    "pole1": "1 = Hold Purdue Pharma Billionaires Criminally Liable and Fund Universal Addiction Treatment",
    "pole10": "10 = Crack Down on Chinese Fentanyl Precursors and Border Drug Cartels Flooding America",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_california_wildfires_paradise_camp_fire",
    "name": "Deadly California Camp Fire (85 Fatalities) & Forest Management",
    "type": "News",
    "eraSpan": "2018 (Catastrophic Western Wildfire Arc)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Deadliest wildfire in California history destroying the town of Paradise, triggering fights over climate change vs. forest clearing.",
    "pole1": "1 = Accelerate Deep Climate Decarbonization and Hold Negligent Utility PG&E Accountable",
    "pole10": "10 = Reform Failed Environmental Laws That Prevent Logging and Clearing Dead Brush in Forests",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_masterpiece_cakeshop_scotus_ruling",
    "name": "Supreme Court Ruling in Masterpiece Cakeshop v. Colorado Civil Rights",
    "type": "News",
    "eraSpan": "2018 (Religious Freedom & LGBTQ Rights)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Ruling 7-2 that state civil rights commission showed unconstitutional hostility toward a Christian baker refusing to make a same-sex wedding cake.",
    "pole1": "1 = Narrow Ruling That Leaves Clear Civil Rights Protections Against Commercial Discrimination",
    "pole10": "10 = Vital Vindication of Constitutional Religious Freedom and Free Speech of Christian Artists",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_fbi_headquarters_relocation_cancellation",
    "name": "Abrupt Cancellation of Consolidated FBI Headquarters Relocation",
    "type": "News",
    "eraSpan": "2017-2018 (FBI Building Controversy)",
    "domain": "Governance & Judiciary",
    "tier": 5,
    "debate": "Halting decade-long plan to move FBI headquarters to the suburbs, sparking conflict-of-interest allegations regarding the Trump International Hotel.",
    "pole1": "1 = Investigate Potential Presidential Interference Protecting Hotel Revenues from Rival Developers",
    "pole10": "10 = Scrap Costly Suburban Boondoggle / Rebuild Efficient Headquarters on Current Footprint",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_transgender_military_ban_reimposition",
    "name": "Presidential Directive Barring Most Transgender Troops from Service",
    "type": "News",
    "eraSpan": "2017-2021 (Transgender Military Ban Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Reversing Obama-era policies to bar individuals diagnosed with gender dysphoria from enlisting or serving in the military.",
    "pole1": "1 = Cruel and Bigoted Discrimination Discharging Brave Patriotic Americans Capable of Serving",
    "pole10": "10 = Protect Military Readiness and Avoid Extraordinary Medical Costs That Burden the Armed Forces",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_salt_deduction_ten_thousand_cap",
    "name": "Tax Cuts and Jobs Act $10,000 State and Local Tax (SALT) Deduction Cap",
    "type": "News",
    "eraSpan": "2017-2025 (SALT Cap Controversy)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Capping the federal deduction for state and local income and property taxes at $10,000, disproportionately hitting high-tax blue states.",
    "pole1": "1 = Unfair Partisan Retaliation Penalizing High-Service States / Repeal the SALT Cap",
    "pole10": "10 = Stop Forcing Low-Tax Red State Taxpayers to Subsidize Out-of-Control Blue State Budgets",
    "stances": {
      "dem": 4,
      "gop": 9,
      "lib": 9,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_nevada_question_6_renewable_energy",
    "name": "Nevada Question 6 (50% Renewable Portfolio Standard by 2030)",
    "type": "News",
    "eraSpan": "2018 (State Clean Energy Mandate)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Constitutional initiative approved by 67% of voters mandating electric utilities acquire 50% of power from renewable sources by 2030.",
    "pole1": "1 = Bold Voter Mandate Accelerating Western Solar and Geothermal Energy Independence",
    "pole10": "10 = Costly Energy Mandates That Strain Grid Reliability and Spike Consumer Electricity Bills",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_amazon_hq2_bidding_war_subsidies",
    "name": "Amazon HQ2 Nationwide Corporate Tax Incentive Bidding War",
    "type": "News",
    "eraSpan": "2017-2019 (Corporate Subsidy Backlash)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Cities and states offering billions in tax breaks to land Amazon's second headquarters, sparking anti-subsidy backlash in NYC.",
    "pole1": "1 = Ban Corrupt State-Level Corporate Handouts and Protect Community Housing Affordability",
    "pole10": "10 = Compete Aggressively to Win 25,000 High-Paying Tech Jobs and Billions in Local Economic Growth",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 10,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_cfpb_mick_mulvaney_defanging",
    "name": "Mick Mulvaney Serving as Acting Director of CFPB & Freezing Enforcements",
    "type": "News",
    "eraSpan": "2017-2019 (CFPB Rollback Phase)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Mulvaney requesting a zero-dollar budget and dropping enforcement lawsuits against predatory payday lenders.",
    "pole1": "1 = Sabotage of the Nation's Preeminent Financial Watchdog Protecting Defenseless Consumers",
    "pole10": "10 = End the Rogue, Unaccountable Tyranny of an Unconstitutional Agency Stifling Consumer Credit",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_clean_power_plan_affordable_clean_energy",
    "name": "EPA Affordable Clean Energy (ACE) Rule Replacing Clean Power Plan",
    "type": "News",
    "eraSpan": "2018-2021 (ACE Rulemaking)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Replacing Obama's system-wide carbon caps with narrow, modest efficiency improvements within individual coal plant fences.",
    "pole1": "1 = Ineffective Climate Surrender Subsidizing Old, Polluting Coal Plants to Keep Operating",
    "pole10": "10 = Lawful, Common-Sense Regulation That Respects Clean Air Act Limits and Protects Coal Jobs",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_puerto_rico_power_grid_privatization",
    "name": "Governor Rosselló Plan to Privatize PREPA Electric Power Authority",
    "type": "News",
    "eraSpan": "2018 (Grid Privatization Arc)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Moving to sell state power plants and concession the electric transmission grid to private consortium LUMA Energy.",
    "pole1": "1 = Protect Public Workers and Prevent Wall Street Exploitation of an Essential Public Utility",
    "pole10": "10 = Dismantle the Corrupt, Insolvent Government Monopoly That Left the Island in the Dark for a Year",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_sanctuary_cities_doj_grant_withholding",
    "name": "DOJ Withholding Byrne JAG Police Grants from Sanctuary Jurisdictions",
    "type": "News",
    "eraSpan": "2017-2020 (Sanctuary Funding Lawsuits)",
    "domain": "Immigration & Border",
    "tier": 3,
    "debate": "Attorney General Sessions attempting to strip federal law enforcement grants from cities refusing to hold undocumented inmates for ICE.",
    "pole1": "1 = Unlawful Federal Coercion Undermining Local Community Trust Between Police and Immigrants",
    "pole10": "10 = Deny Taxpayer Dollars to Lawless Cities Harboring Dangerous Deportable Criminal Aliens",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_space_force_creation_directive",
    "name": "Presidential Directive Ordering Creation of the United States Space Force",
    "type": "News",
    "eraSpan": "2018-2019 (Space Force Inception)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Directing the Pentagon to establish an independent sixth military service branch dedicated to orbital warfighting.",
    "pole1": "1 = Unnecessary Bureaucratic Duplication and Dangerous Militarization of Outer Space",
    "pole10": "10 = Essential Military Independence to Counter Chinese and Russian Anti-Satellite Threats",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 6,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_title_x_abortion_gag_rule",
    "name": "HHS Domestic Gag Rule Barring Title X Grants to Abortion Providers",
    "type": "News",
    "eraSpan": "2018-2021 (Title X Gag Rule Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Barring federal family planning funds from clinics that provide abortion referrals or share physical facilities with providers.",
    "pole1": "1 = Unlawful Gag Rule Forcing Planned Parenthood Out of Vital Preventative Women's Healthcare",
    "pole10": "10 = Enforce Strict Statutory Firewalls So No Taxpayer Dollars Direct or Subsidize Abortion",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_qualifying_anti_boycott_bds_bills",
    "name": "State & Federal Anti-BDS Legislation Penalizing Israel Boycotts",
    "type": "Ideological",
    "eraSpan": "2016-2026 (BDS Legal Challenges Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 5,
    "debate": "Requiring state contractors to certify they do not participate in economic boycotts of the state of Israel.",
    "pole1": "1 = Unconstitutional Infringement on First Amendment Rights to Political Boycott and Protest",
    "pole10": "10 = Enact Anti-BDS Statutes to Stop Anti-Semitic Economic Warfare Against Our Greatest Mideast Ally",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_colorado_prop_112_fracking_setbacks",
    "name": "Colorado Proposition 112 (Mandatory 2,500-Foot Fracking Setbacks Defeat)",
    "type": "News",
    "eraSpan": "2018 (Fracking Setback Referendum)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Voters defeating a citizen initiative to mandate 2,500-foot buffer zones between oil and gas wells and occupied structures.",
    "pole1": "1 = Protect Neighborhoods, Schools, and Drinking Water from Toxic Drilling Emissions",
    "pole10": "10 = Defeat Measure That Would Ban 85% of New Drilling in Colorado and Cost 100,000 Jobs",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_washington_initiative_1631_carbon_fee",
    "name": "Washington Initiative 1631 (First U.S. Voter Ballot Carbon Fee Defeat)",
    "type": "News",
    "eraSpan": "2018 (Direct Carbon Pricing Ballot Battle)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Oil-funded campaign defeating citizen initiative to levy a $15/metric ton fee on greenhouse gas emissions.",
    "pole1": "1 = Vote Yes / Put a Real Price on Carbon Pollution and Fund Renewable Clean Energy Infrastructure",
    "pole10": "10 = Vote No / Reject a Regressive Energy Tax That Will Hike Gas Prices and Protect Big Corporate Emitters",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_syria_troop_withdrawal_announcement",
    "name": "President Trump Surprise Announcement of Full Troop Withdrawal from Syria",
    "type": "News",
    "eraSpan": "2018 (Syria Exit & Mattis Resignation)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "President declaring ISIS defeated and ordering all 2,000 U.S. troops home, prompting Defense Secretary Jim Mattis to resign.",
    "pole1": "1 = Dangerous Rash Abandonment of Kurdish Allies Handing Syria to Assad, Russia, and Iran",
    "pole10": "10 = Fulfill Promise to Stop Fighting Endless Foreign Wars and Bring American Troops Home",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 5,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_alaska_ballot_measure_1_salmon_habitat",
    "name": "Alaska Ballot Measure 1 (Stricter Fish Habitat Permits for Mining Defeat)",
    "type": "News",
    "eraSpan": "2018 (Pebble Mine Proxy Referendum)",
    "domain": "Energy & Climate",
    "tier": 5,
    "debate": "Voters defeating tougher environmental review standards for mining and industrial projects in wild salmon streams.",
    "pole1": "1 = Protect Alaska's World-Class Wild Salmon Runs and Traditional Fishing Livelihoods",
    "pole10": "10 = Defeat Measure That Creates Severe Regulatory Paralysis for Resource Development Across Alaska",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_consumer_privacy_act_california_ccpa",
    "name": "Enactment of the California Consumer Privacy Act (CCPA)",
    "type": "News",
    "eraSpan": "2018 (CCPA Pioneer)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Landmark state statute granting consumers the right to know what personal data is collected and opt out of its sale.",
    "pole1": "1 = Vital First Step Toward Establishing Fundamental Data Privacy Rights in the United States",
    "pole10": "10 = Support National Preemption Standard to Avoid a Patchwork of 50 Conflicting State Data Laws",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_government_shutdown_border_wall_stalemate",
    "name": "Impending Federal Government Shutdown over $5.7B Border Wall Funding",
    "type": "News",
    "eraSpan": "2018-2019 (Historic 35-Day Shutdown)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "President Trump refusing to sign spending bills without $5.7 billion for the southern border wall, triggering a 35-day shutdown.",
    "pole1": "1 = Refuse to Surrender to Presidential Extortion over an Ineffective Vanity Border Wall",
    "pole10": "10 = Stand Firm on Funding Border Barriers to Protect American Homeland Security",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2018,
    "id": "2018_california_prop_12_animal_confinement",
    "name": "California Proposition 12 (Cruelty-Free Housing Standards for Farm Animals)",
    "type": "News",
    "eraSpan": "2018 (Historic Animal Housing Ballot Win)",
    "domain": "Agriculture & Food",
    "tier": 4,
    "debate": "Voter approval (62.7%) establishing minimum square-foot space requirements for breeding pigs, calves, and egg-laying hens.",
    "pole1": "1 = Historic Victory for Compassion Ending Cruel Confinement in Factory Farm Operations",
    "pole10": "10 = Unconstitutional Interstate Overreach Imposing Costly Mandates on Midwestern Pork Farmers",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_covid_19_lockdowns_school_closures",
    "name": "COVID-19 Pandemic Response: Lockdowns, Mask Mandates & School Closures",
    "type": "News",
    "eraSpan": "2020-2022 (COVID Emergency Phase)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "Evaluating federal and state emergency mandates closing schools, shutting down non-essential businesses, and imposing indoor masks.",
    "pole1": "1 = Prioritize Public Health, Scientific Guidance, Universal Masks, and Safe Virtual Schooling",
    "pole10": "10 = End Destructive Lockdowns, Reopen Schools Immediately, and Protect Individual Liberty",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_cares_act_stimulus_checks",
    "name": "CARES Act ($2.2 Trillion Relief, $1,200 Stimulus Checks & PPP Loans)",
    "type": "News",
    "eraSpan": "2020-2021 (Emergency Relief Spending)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Passing the largest emergency economic rescue in history with direct stimulus checks, $600/wk unemployment boosts, and PPP grants.",
    "pole1": "1 = Essential Economic Lifeline for Working Families / Pass Even Larger Relief Packages",
    "pole10": "10 = Necessary Short-Term Emergency Action but Exploding Deficits and Stifling Work Incentives",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_george_floyd_racial_justice_protests",
    "name": "Murder of George Floyd & Nationwide Racial Justice Protests",
    "type": "News",
    "eraSpan": "2020-2022 (Racial Justice Reckoning)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Global protests against police brutality following the killing of George Floyd, igniting national demands for criminal justice reform.",
    "pole1": "1 = Dismantle Systemic Racism, Ban Chokeholds, Reform Qualified Immunity, and Defend BLM",
    "pole10": "10 = Stand Unwaveringly with Law Enforcement / Crush Violent Urban Riots and Antifa Terrorism",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_defund_the_police_debate",
    "name": "Calls to 'Defund the Police' & Reallocate Municipal Budgets",
    "type": "News",
    "eraSpan": "2020-2022 (Municipal Police Budget Battles)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Progressive activist demands to redirect city police budgets toward social workers, community healthcare, and affordable housing.",
    "pole1": "1 = Reallocate Police Funds to Address the Root Causes of Poverty, Mental Illness, and Addiction",
    "pole10": "10 = Total Rejection of Dangerous 'Defund the Police' Slogans That Cause Violent Crime Surges",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_mail_in_voting_expansion_fraud_claims",
    "name": "Universal Mail-in Voting Expansion & Trump Election Fraud Warnings",
    "type": "News",
    "eraSpan": "2020 (Pandemic Voting Battles)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "States mailing ballots to all registered voters due to COVID-19 and Trump's claims that universal mail voting invites massive fraud.",
    "pole1": "1 = Protect and Expand Mail Voting and Drop Boxes to Ensure Safe Democratic Access During Pandemic",
    "pole10": "10 = Stop Mass Unsolicited Mail Ballots Prone to Fraud and Ballot Harvesting / Protect Integrity",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_amy_coney_barrett_confirmation",
    "name": "Amy Coney Barrett Supreme Court Confirmation (Cementing 6-3 Majority)",
    "type": "News",
    "eraSpan": "2020 (RBG Vacancy Flashpoint)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Senate confirming originalist Amy Coney Barrett just eight days before the election following the death of Ruth Bader Ginsburg.",
    "pole1": "1 = Illegitimate Hypocritical Power Grab Right Before an Election / Support Court Reform",
    "pole10": "10 = Fulfill Constitutional Duty Confirming a Brilliant Originalist Jurist to Cement Conservative Majority",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_operation_warp_speed_vaccines",
    "name": "Operation Warp Speed Acceleration of mRNA COVID-19 Vaccines",
    "type": "News",
    "eraSpan": "2020-2021 (Vaccine Development Arc)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "Federal $10+ billion public-private partnership slashing bureaucratic red tape to produce authorized COVID vaccines in under a year.",
    "pole1": "1 = Triumph of Biomedical Science Supported by Public Investment / Ensure Equitable Global Access",
    "pole10": "10 = Historic Trump Administration Victory Delivering Medical Miracles in Record Time",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 2,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_paris_climate_agreement_reentry",
    "name": "Joe Biden Pledge to Rejoin Paris Accord & 2050 Net-Zero Goal",
    "type": "News",
    "eraSpan": "2020-2026 (Net-Zero Climate Target)",
    "domain": "Energy & Climate",
    "tier": 1,
    "debate": "Pledging to rejoin the Paris Agreement on day one and implement a $2 trillion clean energy plan to reach net-zero emissions by 2050.",
    "pole1": "1 = Rejoin Paris Immediately / Transform Economy with Massive Clean Energy and Green Union Jobs",
    "pole10": "10 = Stay Out of Paris / Protect Abundant American Oil, Natural Gas, and Petrochemical Manufacturing",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_title_42_border_expulsions",
    "name": "Title 42 Emergency Public Health Border Expulsions",
    "type": "News",
    "eraSpan": "2020-2023 (Title 42 Health Protocol)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Invoking 1944 Public Health Service Act to immediately expel undocumented migrants arriving at the border without asylum hearings.",
    "pole1": "1 = Immediate Rescission of Cruel, Pretextual Expulsions Denying Fundamental Legal Asylum Rights",
    "pole10": "10 = Maintain Title 42 to Protect Border Patrol Agents and Prevent Overwhelming Border Surges",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_china_trade_decoupling_huawei_ban",
    "name": "U.S.-China Strategic Decoupling & Global Blacklist of Huawei 5G",
    "type": "News",
    "eraSpan": "2019-2026 (Tech Cold War)",
    "domain": "Trade & Globalism",
    "tier": 1,
    "debate": "Banning U.S. chips to Huawei and restricting Chinese tech giants TikTok and WeChat under national security authorities.",
    "pole1": "1 = Strategic Targeted Tech Controls While Maintaining Diplomatic Channels and Climate Cooperation",
    "pole10": "10 = Aggressive Decoupling, Supply Chain Reshoring, and Banning All Chinese Spyware Tech",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_oregon_measure_110_drug_decriminalization",
    "name": "Oregon Measure 110 (Drug Decriminalization & Treatment Initiative)",
    "type": "News",
    "eraSpan": "2020-2024 (Historic Decriminalization Experiment)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Voter initiative decriminalizing personal possession of all hard drugs (heroin, cocaine, meth) and funding addiction recovery.",
    "pole1": "1 = Vote Yes / Pioneering Humane Public Health Model Moving Beyond Failed Punitive Drug War",
    "pole10": "10 = Vote No / Disastrous Radical Policy Fueling Open-Air Drug Encampments, Overdoses, and Crime",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_florida_amendment_2_fifteen_dollar_wage",
    "name": "Florida Amendment 2 (Phasing in $15 Minimum Wage by 2026)",
    "type": "News",
    "eraSpan": "2020 (Red State $15 Wage Breakthrough)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Constitutional initiative approved by 60.8% of Florida voters raising the state minimum wage incrementally to $15 by 2026.",
    "pole1": "1 = Historic Southern Victory Proving Working Families Deserve a Living Wage Everywhere",
    "pole10": "10 = Devastating Mandate Hurting Small Businesses and Service Workers in Tourist Economies",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_qanon_conspiracy_theories_mainstream",
    "name": "Rise of QAnon Conspiracy Theories & GOP Candidates",
    "type": "News",
    "eraSpan": "2020-2021 (QAnon Phenomenon)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "FBI declaring QAnon a domestic terrorism threat while several Republican congressional nominees openly promote its claims.",
    "pole1": "1 = Condemn Dangerous, Delusional Cult Poisoning Conservative Politics and Fueling Violence",
    "pole10": "10 = Focus on Real Deep State Corruption Rather Than Media Smears Against Patriotic Skeptics",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_hunter_biden_laptop_censorship",
    "name": "New York Post Hunter Biden Laptop Article & Social Media Censorship",
    "type": "News",
    "eraSpan": "2020-2024 (Hunter Laptop & First Amendment)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Twitter and Facebook censoring New York Post reporting on emails found on Hunter Biden's abandoned laptop just weeks before voting.",
    "pole1": "1 = Legitimate Measures by Platforms to Halt Disinformation / Russian Propaganda Warning",
    "pole10": "10 = Blatant Election Interference and Big Tech Censorship Shielding the Biden Family from Scrutiny",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_abraham_accords_mideast_normalization",
    "name": "Abraham Accords Normalizing Relations with Israel (UAE, Bahrain, Sudan)",
    "type": "News",
    "eraSpan": "2020-2026 (Abraham Accords Realignment)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Historic diplomatic normalization pacts signed between Israel and Arab nations without resolving Palestinian statehood.",
    "pole1": "1 = Welcome Regional Normalization While Insisting Genuine Middle East Peace Requires Palestinian Rights",
    "pole10": "10 = Historic Breakthrough of Trump Statesmanship Shattering the Discredited Foreign Policy Blob",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_oregon_measure_109_psilocybin_therapy",
    "name": "Oregon Measure 109 (Legalization of Therapeutic Psilocybin Services)",
    "type": "News",
    "eraSpan": "2020 (Psychedelic Therapy Genesis)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Approving the first statewide regulatory framework allowing licensed facilitators to administer psilocybin for depression and PTSD.",
    "pole1": "1 = Groundbreaking Medical Breakthrough for Severe Mental Health, Depression, and Veteran Trauma",
    "pole10": "10 = Oppose Opening the Door to Hallucinogenic Drug Commercialization and Abuse",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_california_prop_22_gig_worker_status",
    "name": "California Proposition 22 (App-Based Drivers as Independent Contractors)",
    "type": "News",
    "eraSpan": "2020 (Gig Economy Labor Battle)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "$200M ballot fight funded by Uber and Lyft exempting app drivers from AB 5 employee classification while offering wage floors.",
    "pole1": "1 = Vote No / Uber Must Treat Workers as Full Employees with Overtime, Healthcare, and Unemployment",
    "pole10": "10 = Vote Yes / Protect Flexible Work Schedules and Inexpensive Rides for Millions of Californians",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_kyle_rittenhouse_kenosha_shootings",
    "name": "Kenosha Unrest, Jacob Blake Shooting & Kyle Rittenhouse Fatal Shootings",
    "type": "News",
    "eraSpan": "2020-2021 (Self-Defense & Riot Polarizer)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Seventeen-year-old carrying an AR-15 shooting three men during Kenosha unrest, igniting national debates over vigilantism vs self-defense.",
    "pole1": "1 = Condemn Lawless Armed Vigilante Emboldened by Right-Wing Media to Kill Protesters",
    "pole10": "10 = Defend Fundamental Right to Self-Defense in the Face of Violent Rioters Burning Cities",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_hydroxychloroquine_bleach_controversy",
    "name": "Presidential Promotion of Hydroxychloroquine as COVID Miracle Cure",
    "type": "News",
    "eraSpan": "2020 (COVID Medical Misinformation)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "President Trump publicly touting anti-malarial drug hydroxychloroquine and musing on disinfectant injections despite FDA cautions.",
    "pole1": "1 = Dangerous Anti-Science Rhetoric from the White House Costing American Lives",
    "pole10": "10 = Encourage Innovative Off-Label Treatments / Expose Regulatory Foot-Dragging by the Deep State",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_afghanistan_doha_agreement_taliban",
    "name": "U.S.-Taliban Doha Agreement Pledging Full U.S. Military Exit by May 2021",
    "type": "News",
    "eraSpan": "2020-2021 (Doha Agreement Phase)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Signing historic bilateral accord with the Taliban agreeing to withdraw all foreign troops in exchange for counterterror pledges.",
    "pole1": "1 = End America's Longest War / Fulfill Vital Priority of Bringing U.S. Combat Forces Home",
    "pole10": "10 = Flawed Unconditional Surrender Agreement Undermining the Democratic Afghan Government",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 5,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_great_reset_economic_world_forum",
    "name": "World Economic Forum 'Great Reset' Initiative Backlash",
    "type": "News",
    "eraSpan": "2020-2026 (Globalist Governance Controversy)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Davos agenda advocating stakeholder capitalism and green transitions, fueling conservative fears of technocratic global tyranny.",
    "pole1": "1 = Embrace Sustainable Global Cooperation to Rebuild Green, Equitable Economies Post-Pandemic",
    "pole10": "10 = Resist the Authoritarian Great Reset Agenda Designed to Destroy National Sovereignty and Property",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_bostock_v_clayton_county_scotus",
    "name": "Supreme Court Landmark LGBTQ Workplace Ruling (Bostock v. Clayton County)",
    "type": "News",
    "eraSpan": "2020 (Title VII LGBTQ Landmark)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Justice Gorsuch writing 6-3 textualist opinion holding that Title VII's sex discrimination ban protects sexual orientation and gender identity.",
    "pole1": "1 = Historic Civil Rights Milestone Prohibiting Workplace Discrimination Nationwide",
    "pole10": "10 = Judicial Usurpation Rewriting Civil Rights Act Language Against Original Congressional Intent",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_supreme_court_court_packing_debate",
    "name": "Calls to Expand the Supreme Court ('Court Packing') Following Barrett",
    "type": "News",
    "eraSpan": "2020-2022 (Court Expansion Controversy)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Progressive demands for Democrats to expand the Supreme Court beyond 9 justices if they win the White House and Senate.",
    "pole1": "1 = Restore Institutional Balance to a Politically Hijacked Court via Expansion or Term Limits",
    "pole10": "10 = Protect Independent Judiciary Against Destructive Radical Court-Packing Power Grabs",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_tiktok_wechat_presidential_ban_orders",
    "name": "Executive Orders Banning U.S. Transactions with ByteDance (TikTok)",
    "type": "News",
    "eraSpan": "2020-2024 (TikTok National Security Arc)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Ordering ByteDance to divest U.S. TikTok operations or face a nationwide app store ban over Chinese data surveillance risks.",
    "pole1": "1 = Address Legitimate Foreign Cybersecurity Risks with Narrow Privacy Protections Without Banning Speech",
    "pole10": "10 = Ban Chinese Communist Party Spyware TikTok Immediately to Protect American User Data",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_cleveland_indians_washington_redskins_names",
    "name": "Retirement of Native American Mascots (Washington Redskins & Cleveland Indians)",
    "type": "News",
    "eraSpan": "2020-2022 (Cultural Symbolism Arc)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Major sports franchises announcing retirement of racist and offensive Native American logos and names under sponsor pressure.",
    "pole1": "1 = Long-Overdue Respect Ending Decades of Inhumane Racial Stereotyping in Popular Culture",
    "pole10": "10 = Surrender to Woke Corporate Activism Destroying Beloved Historic American Traditions",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_california_prop_16_affirmative_action",
    "name": "California Proposition 16 (Attempt to Repeal Prop 209 Affirmative Action Ban)",
    "type": "News",
    "eraSpan": "2020 (Affirmative Action Ballot Fight)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Voters decisively rejecting (57% No) an initiative to restore race- and gender-conscious admissions and public contracting in CA.",
    "pole1": "1 = Vote Yes / Remedy Persistent Racial Wealth Gaps and Systemic Educational Disparities",
    "pole10": "10 = Vote No / Preserve Pure Colorblind Equality and Merit in Public Education and Contracting",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_cdc_federal_eviction_moratorium",
    "name": "CDC Nationwide Agency Eviction Moratorium for Renters",
    "type": "News",
    "eraSpan": "2020-2021 (Eviction Moratorium Litigation)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Public health order halting residential tenant evictions nationwide to stop the spread of COVID-19, challenging property rights.",
    "pole1": "1 = Prevent Catastrophic Mass Homelessness and Save Lives During a Global Pandemic Emergency",
    "pole10": "10 = Unconstitutional Agency Power Grab Bankrupting Small Mom-and-Pop Landlords Without Due Process",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_meatpacking_plant_covid_outbreaks",
    "name": "Defense Production Act Executive Order Keeping Meatpacking Plants Open",
    "type": "News",
    "eraSpan": "2020 (Essential Worker Safety Arc)",
    "domain": "Agriculture & Food",
    "tier": 3,
    "debate": "Designating commercial meat processing plants as critical infrastructure to avert national grocery shortages during deadly outbreaks.",
    "pole1": "1 = Protect Vulnerable Immigrant Workers with Mandatory OSHA Distancing and Enforceable Safety",
    "pole10": "10 = Protect the National Food Supply Chain from Collapse / Shield Processors from Frivolous Lawsuits",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_qassem_soleimani_drone_strike",
    "name": "Assassination of Iranian IRGC General Qassem Soleimani in Baghdad",
    "type": "News",
    "eraSpan": "2020 (Soleimani Strike & Escalation)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Precision MQ-9 Reaper drone strike eliminating Iran's top Quds Force commander, sparking retaliatory missile strikes on U.S. troops.",
    "pole1": "1 = Reckless Extrajudicial Assassination Bringing America to the Brink of a Disastrous All-Out War",
    "pole10": "10 = Decisive Commander-in-Chief Leadership Eliminating a Murderous Terrorist Mastermind",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_colorado_prop_118_paid_family_leave",
    "name": "Colorado Proposition 118 (State-Administered Paid Family and Medical Leave)",
    "type": "News",
    "eraSpan": "2020 (State Paid Leave Ballot Measure)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Voter approval (57.7%) establishing state disability insurance providing 12 weeks of paid leave funded by 50/50 payroll tax.",
    "pole1": "1 = Guarantee Paid Family Leave so No Worker Chooses Between Caring for a Newborn and a Paycheck",
    "pole10": "10 = Oppose New Regressive Payroll Taxes Burdening Small Businesses During an Economic Recovery",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_california_electric_car_mandate_2035",
    "name": "Governor Newsom Executive Order Banning New Gas Cars by 2035",
    "type": "News",
    "eraSpan": "2020-2026 (Zero-Emission Vehicle Mandate)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Mandating all new passenger cars and trucks sold in California be zero-emission electric vehicles by 2035.",
    "pole1": "1 = Bold Action Catalyzing Clean Transportation and Ending Toxic Tailpipe Smog in Disadvantaged Communities",
    "pole10": "10 = Authoritarian Mandate Forcing Expensive Inconvenient EVs on Working Consumers / Grid Collapse",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_california_prop_15_split_roll_tax",
    "name": "California Proposition 15 (Schools & Communities First Split-Roll Tax Defeat)",
    "type": "News",
    "eraSpan": "2020 (Prop 13 Commercial Property Battle)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Voters narrowly defeating (52% No) a measure to reassess commercial properties worth over $3M at current market value.",
    "pole1": "1 = Make Giant Commercial Real Estate Corporations Pay Fair Share to Fund Neighborhood Schools",
    "pole10": "10 = Protect Proposition 13 and Save Small Businesses from Massive Property Tax Inflation",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_michigan_governor_whitmer_kidnapping_plot",
    "name": "FBI Foiling Armed Militia Plot to Kidnap Michigan Governor Gretchen Whitmer",
    "type": "News",
    "eraSpan": "2020 (Domestic Militia Terrorism)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Arresting 13 anti-government militia members plotting to storm the state capitol and kidnap the governor over COVID lockdowns.",
    "pole1": "1 = Denounce Right-Wing Domestic Terrorism Fanned by Violent Presidential Rhetoric ('LIBERATE MICHIGAN!')",
    "pole10": "10 = Prosecute Violent Criminals While Guarding Against FBI Entrapment of Overzealous Citizens",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_zoom_telehealth_regulatory_waivers",
    "name": "Emergency Federal Waivers Expanding Telehealth & Virtual Healthcare",
    "type": "News",
    "eraSpan": "2020-2024 (Telehealth Revolution)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Medicare lifting interstate practice restrictions and paying equal reimbursement rates for video medical consultations.",
    "pole1": "1 = Permanent Universal Telehealth Coverage to Expand Rural and Mental Health Care Access",
    "pole10": "10 = Make Regulatory Waivers Permanent to Cut Healthcare Costs Through Free Market Digital Care",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_alaska_ballot_measure_2_ranked_choice",
    "name": "Alaska Ballot Measure 2 (Top-Four Open Primary & Ranked-Choice Voting)",
    "type": "News",
    "eraSpan": "2020 (Alaska Nonpartisan Voting Pioneer)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Narrow voter approval (50.5%) creating an all-party open primary with the top four advancing to a ranked-choice general election.",
    "pole1": "1 = Transformative Reform Weakening Extremist Partisan Primaries and Rewarding Consensus Lawmakers",
    "pole10": "10 = Confusing Scheme Designed to Dilute Republican Majorities and Obscure Voter Intent",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 2,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_clean_air_fuel_economy_safe_rule",
    "name": "Safer Affordable Fuel-Efficient (SAFE) Vehicles Rule Lowering MPG Standards",
    "type": "News",
    "eraSpan": "2020-2022 (Auto Fuel Economy Rollback)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Rolling back Obama fuel economy increases from 5% annually to 1.5% and revoking California's Clean Air Act waiver.",
    "pole1": "1 = Illegal Rollback Worsening Air Pollution and Raising Lifetime Gasoline Costs for Drivers",
    "pole10": "10 = Lower Vehicle Production Costs to Make Newer, Safer, More Affordable Cars Accessible to Families",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_mississippi_state_flag_confederate_emblem",
    "name": "Mississippi Voters Approving New State Flag Replacing Confederate Emblem",
    "type": "News",
    "eraSpan": "2020 (Confederate Symbolism Removal)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "73% of voters approving a new state flag featuring a magnolia and 'In God We Trust', retiring the 1894 Confederate battle flag.",
    "pole1": "1 = Long-Overdue Step Shedding Divisive Symbols of Slavery and White Supremacy in the Deep South",
    "pole10": "10 = Welcome New Unifying Flag While Preserving Historical Awareness and Southern Heritage",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_federal_reserve_corporate_credit_facilities",
    "name": "Federal Reserve Corporate Bond Buying (SMCCF & Secondary Market Purchases)",
    "type": "News",
    "eraSpan": "2020-2021 (Fed Corporate Bailouts)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Federal Reserve taking the unprecedented step of purchasing corporate debt and junk bond ETFs to calm volatile credit markets.",
    "pole1": "1 = Bailout for Wealthy Bondholders While Everyday Americans Struggle to Buy Groceries",
    "pole10": "10 = Decisive Monetary Intervention Averting Systemic Liquidity Freezes and Widespread Bankruptcies",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 2
    }
  },
  {
    "cycle": 2020,
    "id": "2020_california_prop_25_cash_bail_repeal",
    "name": "California Proposition 25 (Voter Rejection of Eliminating Cash Bail)",
    "type": "News",
    "eraSpan": "2020 (Cash Bail Referendum Defeat)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters rejecting a state law that would have replaced money bail with automated risk assessment algorithms.",
    "pole1": "1 = End Wealth-Based Incarceration / Fix Flawed Risk Assessment Algorithms to Achieve Real Justice",
    "pole10": "10 = Uphold the Power of Cash Bail to Ensure Defendants Appear in Court and Keep Violent Criminals Off Streets",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_usps_louis_dejoy_mail_sorting_cuts",
    "name": "Postmaster General Louis DeJoy Operational Changes & Mail Delays",
    "type": "News",
    "eraSpan": "2020 (Postal Voting Security Controversy)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Removing high-speed sorting machines and cutting overtime right before an election with record mail-in ballots.",
    "pole1": "1 = Deliberate Sabotage of the U.S. Postal Service to Suppress Mail Ballots / Remove DeJoy Immediately",
    "pole10": "10 = Long-Overdue Operational Streamlining to Stem Billions in Chronic Postal Waste",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 7,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_armenia_azerbaijan_nagorno_karabakh",
    "name": "Second Nagorno-Karabakh War & Turkish Drone Dominance",
    "type": "News",
    "eraSpan": "2020 (Nagorno-Karabakh Conflict)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Azerbaijani military forces using advanced Turkish and Israeli armed drones to recapture territory from ethnic Armenians.",
    "pole1": "1 = Enact Sanctions on Azerbaijan and Turkey for War Crimes Against Indigenous Armenians",
    "pole10": "10 = Maintain Neutrality / Prevent Destabilizing Escalation Between Russia and NATO Ally Turkey",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_colorado_prop_115_twenty_two_week_ban",
    "name": "Colorado Proposition 115 (Attempt to Ban Late-Term Abortions After 22 Weeks Defeat)",
    "type": "News",
    "eraSpan": "2020 (State Late-Term Abortion Ballot Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters decisively rejecting (59% No) an initiative to criminalize abortions performed at or after 22 weeks gestational age.",
    "pole1": "1 = Protect Reproductive Freedom and Trust Women and Doctors in Complex Medical Situations",
    "pole10": "10 = Pass Protections for Pain-Capable Unborn Babies and End Gruesome Late-Term Abortions",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_antifa_domestic_terror_designation",
    "name": "Presidential Threats to Formally Designate Antifa as a Domestic Terrorist Organization",
    "type": "News",
    "eraSpan": "2020 (Civil Unrest & Domestic Extremism)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Proposing domestic terrorism designations for violent left-wing anarchist agitators clashing with police in Portland and Seattle.",
    "pole1": "1 = Dangerous Authoritarian Distraction Weaponizing Federal Law to Criminalize Left-Wing Political Protest",
    "pole10": "10 = Classify Violent Anarchist Antifa Terrorists and Enforce Federal Anti-Riot Acts Rigorously",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_hydroxychloroquine_fda_eua_revocation",
    "name": "FDA Revocation of Emergency Use Authorization for Hydroxychloroquine",
    "type": "News",
    "eraSpan": "2020 (FDA Regulatory Independence)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "FDA pulling emergency authorization after randomized clinical trials proved the drug had no benefit against COVID and caused cardiac risks.",
    "pole1": "1 = Uphold Rigorous Evidence-Based Science and Reaffirm Independence from Political Pressures",
    "pole10": "10 = Bureaucratic Deep State Suppression of Inexpensive, Off-Patent Treatments to Boost Pharma Profits",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_social_media_section_230_repeal_threats",
    "name": "Bipartisan Demands to Repeal or Modify Section 230 Immunity for Big Tech",
    "type": "Ideological",
    "eraSpan": "1996-2026 (Section 230 Reform Arc)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Trump and Biden both demanding repeal of CDA Section 230 shielding online platforms from liability for user-generated speech.",
    "pole1": "1 = Strip Immunity for Platforms Spreading Lethal Medical Disinformation and Hate Speech",
    "pole10": "10 = Strip Immunity to Stop Big Tech Gatekeepers from Censoring Conservative Political Speech",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_nevada_question_2_constitutional_marriage_equality",
    "name": "Nevada Question 2 (Constitutional Recognition of Same-Sex Marriage)",
    "type": "News",
    "eraSpan": "2020 (State Constitutional Equality Win)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "First state in the nation where voters approved (62%) a constitutional amendment guaranteeing same-sex marriage regardless of gender.",
    "pole1": "1 = Historic Voter Milestone Cementing Inalienable Marriage Equality into State Constitutions",
    "pole10": "10 = Defend Traditional Religious Marriage and Conscience Exemptions for Faith-Based Organizations",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_defense_production_act_ventilators_n95",
    "name": "Invoking Defense Production Act for N95 Masks and Critical Ventilators",
    "type": "News",
    "eraSpan": "2020 (Emergency Domestic Production)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Ordering General Motors and 3M to manufacture emergency ventilators and millions of N95 respirators for the national stockpile.",
    "pole1": "1 = Essential Command Leadership Ensuring Healthcare Heroes Have Life-Saving Protective Equipment",
    "pole10": "10 = Private Companies Stepped Up Voluntarily / Avoid Unnecessary Command-and-Control Coercion",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_cuba_embargo_re_imposition_remittances",
    "name": "Banning Western Union Remittance Services to Cuba via Fincimex",
    "type": "News",
    "eraSpan": "2020-2021 (Trump Maximum Pressure Cuba)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Sanctioning Cuban military-run financial firm Fincimex, shutting down all 400 Western Union wire transfer offices across the island.",
    "pole1": "1 = Inhumane Cruelty Punishing Struggling Cuban Families Relying on Basic Food and Medicine from U.S. Relatives",
    "pole10": "10 = Stop the Cuban Military Oligarchy from Skimming Millions in Transaction Fees from Remittances",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_kenosha_national_guard_deployment",
    "name": "Deployment of Wisconsin National Guard Post-Rittenhouse Shootings",
    "type": "News",
    "eraSpan": "2020 (State National Guard Deployments)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Governor Evers deploying 500 National Guard troops following days of arson and fatal shootings in downtown Kenosha.",
    "pole1": "1 = Restore Peace While Addressing the Deep Roots of Systemic Injustice and Community Trauma",
    "pole10": "10 = Long-Overdue Deployment That Should Have Happened on Night One to Prevent Lawless Destruction",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_california_prop_17_parolee_voting_rights",
    "name": "California Proposition 17 (Voting Rights for People on State Parole)",
    "type": "News",
    "eraSpan": "2020 (Parolee Voting Rights Measure)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Constitutional initiative approved by 58.6% of voters restoring the right to vote for 50,000 Californians on parole.",
    "pole1": "1 = Reintegration and Full Democratic Participation for Citizens Who Have Completed Their Prison Terms",
    "pole10": "10 = Parolees Have Not Yet Fully Paid Their Debt to Society and Should Not Vote Until Discharge",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_alaska_pebble_mine_army_corps_veto",
    "name": "Army Corps of Engineers Denial of Key Clean Water Permit for Pebble Mine",
    "type": "News",
    "eraSpan": "2020-2023 (Pebble Mine Final Denials)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Federal regulators formally rejecting the proposed open-pit copper and gold mine in Alaska's pristine Bristol Bay watershed.",
    "pole1": "1 = Vital Permanent Victory Protecting the World's Greatest Wild Sockeye Salmon Fishery and Native Culture",
    "pole10": "10 = Bad Precedent Denying Billions in Strategic Copper and Molybdenum Needed for High-Tech and Clean Energy",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2020,
    "id": "2020_ppp_small_business_loan_forgiveness",
    "name": "Paycheck Protection Program (PPP) Blanket Forgiveness for Under $150K",
    "type": "News",
    "eraSpan": "2020-2021 (PPP Forgiveness Debate)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Enacting simplified, one-page automatic loan forgiveness for small business PPP loans under $150,000.",
    "pole1": "1 = Streamline Forgiveness for Real Main Street Businesses While Aggressively Auditing Fraudulent Grifters",
    "pole10": "10 = Provide Immediate Blanket Forgiveness to Lift Crushing Financial Uncertainty from Small Business Owners",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_dobbs_v_jackson_overturning_roe",
    "name": "Overturning Roe v. Wade (Dobbs v. Jackson Women's Health Organization)",
    "type": "News",
    "eraSpan": "2022-2026 (Post-Dobbs Abortion Wars)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Supreme Court holding that the Constitution confers no right to abortion, triggering state trigger bans across 14 conservative states.",
    "pole1": "1 = Codify Roe v. Wade into Federal Law / Protect Universal Reproductive Healthcare Autonomy",
    "pole10": "10 = Historic Triumph for the Sanctity of Human Life / Uphold Complete State Prohibitions on Abortion",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_forty_year_high_inflation_cpi",
    "name": "40-Year High Inflation (8.5% CPI) & Soaring Grocery and Gas Prices ($5/Gal)",
    "type": "News",
    "eraSpan": "2021-2024 (Post-Pandemic Inflation Spike)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Confronting the worst inflation in four decades driven by supply chain bottlenecks, energy shocks, and trillions in pandemic stimulus.",
    "pole1": "1 = Crack Down on Corporate Price Gouging / Pass Inflation Reduction Act Clean Energy Subsidies",
    "pole10": "10 = Stop Reckless Trillion-Dollar Socialist Deficit Spending Stifling American Energy Production",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_russian_invasion_of_ukraine_aid",
    "name": "Russian Full-Scale Invasion of Ukraine & $100B+ U.S. Military/Financial Aid",
    "type": "News",
    "eraSpan": "2022-2026 (Russo-Ukrainian War)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Appropriating massive multi-billion-dollar packages of HIMARS, artillery, and intelligence to support Kyiv against Vladimir Putin's invasion.",
    "pole1": "1 = Stand with Democratic Ukraine 'As Long as It Takes' to Defeat Russian Imperial Aggression",
    "pole10": "10 = Stop Writing Blank Checks to Foreign Corrupt Wars / Prioritize American Border Security First",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_inflation_reduction_act_enactment",
    "name": "Inflation Reduction Act (IRA - $369B Climate, Pharma Price Negotiation & 15% AMT)",
    "type": "News",
    "eraSpan": "2022-2026 (IRA Implementation)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Landmark reconciliation bill funding clean energy manufacturing, enabling Medicare drug negotiation, and enacting a 15% corporate tax floor.",
    "pole1": "1 = Greatest Legislative Climate & Clean Energy Investment in World History / Lowers Healthcare Costs",
    "pole10": "10 = Misnamed Tax-and-Spend Boondoggle Giving Green Handouts to Elites While Worsening Inflation",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_student_loan_forgiveness_executive_order",
    "name": "President Biden Executive Cancellation of Up to $20,000 in Student Debt",
    "type": "News",
    "eraSpan": "2022-2023 (Student Debt Cancellation)",
    "domain": "Education",
    "tier": 1,
    "debate": "Cancelling up to $10,000 ($20,000 for Pell recipients) in federal student loan debt for borrowers earning under $125,000.",
    "pole1": "1 = Transformative Racial and Economic Justice Relieving Crushing Debt on Millions of Working Families",
    "pole10": "10 = Unconstitutional, Unfair Handout Forcing Blue-Collar Workers to Pay for Elite College Degrees",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_southern_border_migrant_busses",
    "name": "Record Southwest Border Encounters (2.3M) & Governors Bussing to Northern Cities",
    "type": "News",
    "eraSpan": "2021-2024 (Border Bus Campaign)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Texas Governor Abbott and Florida Governor DeSantis bussing tens of thousands of asylum seekers to NYC, Chicago, and Martha's Vineyard.",
    "pole1": "1 = Condemn Inhumane Political Stunts Weaponizing Vulnerable Human Beings Seeking Refuge",
    "pole10": "10 = Force Sanctuary Cities and Washington to Experience the Unbearable Reality of the Open Border Crisis",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_bipartisan_safer_communities_act",
    "name": "Bipartisan Safer Communities Act (First Federal Gun Bill in 30 Years)",
    "type": "News",
    "eraSpan": "2022 (Post-Uvalde/Buffalo Enactment)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Enacting enhanced background checks for buyers under 21, red flag grant funding, and closing the 'boyfriend loophole' post-Uvalde.",
    "pole1": "1 = Crucial First Step / Must Ban Military-Style Assault Weapons and High-Capacity Magazines Next",
    "pole10": "10 = Red Flag Laws Violate Due Process / Infringes on Lawful Second Amendment Rights of Young Adults",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 2
    }
  },
  {
    "cycle": 2022,
    "id": "2022_chips_and_science_act",
    "name": "CHIPS and Science Act ($52 Billion for Domestic Semiconductor Manufacturing)",
    "type": "News",
    "eraSpan": "2022-2026 (Semiconductor Reshoring)",
    "domain": "Technology & Infrastructure",
    "tier": 1,
    "debate": "Providing $52.7 billion in direct subsidies and loan guarantees to build advanced microchip fabrication plants in the United States.",
    "pole1": "1 = Vital Strategic Industrial Policy Reshoring Critical Tech and Protecting National Security from China",
    "pole10": "10 = Corporate Welfare Handout to Multi-Billion-Dollar Chip Conglomerates with Zero Offsets",
    "stances": {
      "dem": 2,
      "gop": 6,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_kansas_value_them_both_defeat",
    "name": "Kansas 'Value Them Both' Constitutional Abortion Amendment (Defeated 59% to 41%)",
    "type": "News",
    "eraSpan": "2022 (First Post-Dobbs Ballot Shock)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Voters in deep-red Kansas decisively rejecting a constitutional amendment that would have removed abortion rights from the state constitution.",
    "pole1": "1 = Seismic Democratic Victory Proving Americans Overwhelmingly Reject Extreme Abortion Bans Everywhere",
    "pole10": "10 = Disappointing Result Driven by Massive Deceptive Out-of-State Advertising by Pro-Abortion Groups",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_infant_formula_supply_crisis",
    "name": "National Infant Formula Shortage & Abbott Sturgis Plant Shutdown",
    "type": "News",
    "eraSpan": "2022 (Operation Fly Formula)",
    "domain": "Healthcare",
    "tier": 1,
    "debate": "Abbott plant contamination causing 40%+ out-of-stock rates, prompting Biden to invoke the Defense Production Act and fly formula from Europe.",
    "pole1": "1 = Broken Monopoly Concentration in Essential Markets / Aggressive Antitrust Enforcement Required",
    "pole10": "10 = Incompetent FDA Regulatory Foot-Dragging Causing Unnecessary Suffering for Stressed Parents",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_fbi_search_mar_a_lago_classified",
    "name": "FBI Search of Mar-a-Lago for Classified National Defense Records",
    "type": "News",
    "eraSpan": "2022-2024 (Classified Documents Indictment)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Executing court-authorized search warrant recovering hundreds of classified and top secret documents withheld from the National Archives.",
    "pole1": "1 = Equal Application of the Rule of Law / No Former President Is Above the Law",
    "pole10": "10 = Unprecedented Weaponization of the DOJ and FBI by the Biden Administration Against His Political Opponent",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_ketanji_brown_jackson_confirmation",
    "name": "Ketanji Brown Jackson Confirmation as First Black Female Supreme Court Justice",
    "type": "News",
    "eraSpan": "2022 (Historic SCOTUS Milestone)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Confirming Ketanji Brown Jackson to replace Stephen Breyer, maintaining the liberal minority on the 6-3 conservative court.",
    "pole1": "1 = Historic Breakthrough for Equal Representation and Judicial Excellence in the Highest Court",
    "pole10": "10 = Oppose Soft-on-Crime Judicial Activist Nominated Under Rigid Race- and Gender-Based Criteria",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_michigan_prop_3_reproductive_freedom",
    "name": "Michigan Proposal 3 (Constitutional Right to Reproductive Freedom)",
    "type": "News",
    "eraSpan": "2022 (Post-Dobbs State Constitutional Protections)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Citizen initiative approved by 56.7% of voters adding an explicit right to reproductive freedom and abortion to the Michigan Constitution.",
    "pole1": "1 = Democratic Model for Securing Bodily Autonomy and Protecting Women and Doctors from Prosecution",
    "pole10": "10 = Extreme Constitutional Amendment Nullifying Parental Consent and Late-Term Abortion Limits",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_federal_reserve_jumbo_rate_hikes",
    "name": "Federal Reserve 75-Basis-Point Jumbo Interest Rate Hikes to Fight Inflation",
    "type": "News",
    "eraSpan": "2022-2024 (Aggressive Monetary Tightening)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Chairman Powell raising rates at the fastest pace in four decades, pushing 30-year fixed mortgages from 3% to over 7%.",
    "pole1": "1 = Dangerously Over-Aggressive Rate Hikes Threatening to Trigger a Severe Recession and Crush Workers",
    "pole10": "10 = Necessary Harsh Medicine to Tame Runaway Inflation Caused by Excessive Washington Spending",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 2
    }
  },
  {
    "cycle": 2022,
    "id": "2022_biden_taiwan_defense_statements",
    "name": "President Biden Repeated Statements Pledging U.S. Military Defense of Taiwan",
    "type": "News",
    "eraSpan": "2022-2026 (Strategic Clarity vs Ambiguity)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "President Biden stating four separate times that U.S. forces would defend Taiwan against an unprovoked Chinese military invasion.",
    "pole1": "1 = Maintain Strategic Ambiguity and One-China Policy to Prevent Unintended Superpower Conflict",
    "pole10": "10 = Clear Deterrence Is Essential / Arm Taiwan to the Teeth to Deter Xi Jinping from Invading",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_bipartisan_infrastructure_law_iija_rollout",
    "name": "Infrastructure Investment and Jobs Act ($1.2 Trillion IIJA Rollout)",
    "type": "News",
    "eraSpan": "2021-2026 (IIJA Implementation)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Federal rollout of historic bipartisan funding for roads, bridges, public transit, clean water pipes, and rural broadband.",
    "pole1": "1 = Historic Bipartisan Rebuilding of America's Neglected Infrastructure Creating Good Union Jobs",
    "pole10": "10 = Wasteful Inflationary Spending Packed with Woke Green Regulations and Red Tape Mandates",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_bruen_supreme_court_concealed_carry",
    "name": "Supreme Court Landmark Concealed Carry Ruling (NYSRPA v. Bruen)",
    "type": "News",
    "eraSpan": "2022 (Bruen History and Tradition Test)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Striking down New York's 108-year-old 'proper cause' concealed carry permit law and mandating a text, history, and tradition test.",
    "pole1": "1 = Dangerous Extremist Ruling Stripping States of the Right to Protect Citizens from Hidden Firearms",
    "pole10": "10 = Landmark Vindication of the Fundamental Second Amendment Right to Carry Arms for Self-Defense",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 2
    }
  },
  {
    "cycle": 2022,
    "id": "2022_west_virginia_v_epa_major_questions",
    "name": "Supreme Court Limiting Agency Regulation (West Virginia v. EPA)",
    "type": "News",
    "eraSpan": "2022 (Major Questions Doctrine)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Formally invoking the Major Questions Doctrine to hold that the EPA lacks statutory authority to shift power generation across grids.",
    "pole1": "1 = Catastrophic Judicial Power Grab Hobbling Federal Agencies from Protecting the Climate and Public",
    "pole10": "10 = Historic Check on the Unaccountable Administrative State Restoring Lawmaking to Congress",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_strategic_petroleum_reserve_release",
    "name": "Historic 180-Million-Barrel Release from Strategic Petroleum Reserve",
    "type": "News",
    "eraSpan": "2022 (Gas Price Crisis Management)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Biden ordering the largest drawdown in SPR history to lower retail gasoline prices following the Russian invasion of Ukraine.",
    "pole1": "1 = Necessary Emergency Action That Successfully Lowered Gas Prices by 40 Cents a Gallon",
    "pole10": "10 = Reckless Depletion of Critical Emergency Military Reserves to Help Democrats in an Election Year",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_florida_parental_rights_education_act",
    "name": "Florida Parental Rights in Education Act ('Don't Say Gay' Law)",
    "type": "News",
    "eraSpan": "2022-2024 (Parental Rights Curriculum Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Prohibiting classroom instruction on sexual orientation or gender identity in kindergarten through third grade.",
    "pole1": "1 = Vicious, Discriminatory Attack on LGBTQ Students and Teachers Designed to Stigmatize Families",
    "pole10": "10 = Protect Young Elementary Children from Inappropriate Sexualization and Defend Parental Authority",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_title_ix_gender_identity_expansion",
    "name": "Biden Proposed Title IX Rule Extending Protections to Gender Identity",
    "type": "News",
    "eraSpan": "2022-2024 (Title IX Gender Rule Battle)",
    "domain": "Education",
    "tier": 2,
    "debate": "Expanding federal Title IX non-discrimination rules to explicitly protect LGBTQ and transgender students in public schools.",
    "pole1": "1 = Ensure Every Student Is Free from Bullying and Discrimination Regardless of Gender Identity",
    "pole10": "10 = Illegal Erasure of Women's Protected Spaces and Female Athletics to Appease Radical Gender Ideology",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_electoral_count_reform_act",
    "name": "Bipartisan Electoral Count Reform and Presidential Transition Improvement Act",
    "type": "News",
    "eraSpan": "2022 (ECRA Modernization)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Clarifying that the Vice President's role in counting electoral votes is strictly ceremonial and raising objection thresholds to 1/5.",
    "pole1": "1 = Essential Bipartisan Safeguard Protecting Democratic Succession and Preventing Future Jan 6 Coups",
    "pole10": "10 = Support Constitutional Clarification While Rejecting Broader Federal Takeovers of State Elections",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_nord_stream_pipeline_sabotage",
    "name": "Underwater Bombing of Nord Stream 1 & 2 Natural Gas Pipelines in Baltic",
    "type": "News",
    "eraSpan": "2022 (Critical Infrastructure Sabotage)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Covert deep-sea demolition attacks severing major natural gas pipelines connecting Russia to Germany.",
    "pole1": "1 = Unacceptable Act of International Sabotage Threatening Critical Global Energy Infrastructure",
    "pole10": "10 = Decisive Strategic Severing of Europe's Dangerous Dependency on Russian Fossil Blackmail",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_biden_marijuana_pardons_schedule_review",
    "name": "Federal Pardons for Simple Marijuana Possession & HHS Scheduling Review",
    "type": "News",
    "eraSpan": "2022-2024 (Executive Cannabis Actions)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "President Biden pardoning thousands of citizens with federal simple possession convictions and directing HHS to review Schedule I status.",
    "pole1": "1 = Historic Federal Progress Toward Ending Cannabis Criminalization / Must Move to Full Legalization",
    "pole10": "10 = Political Pander Sending the Wrong Signal Amid Nationwide Surges in Youth Drug Addiction",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_baby_formula_tariffs_suspension",
    "name": "Temporary Tariff Suspension on Imported Foreign Infant Formula",
    "type": "News",
    "eraSpan": "2022 (Access to Baby Formula Act)",
    "domain": "Trade & Globalism",
    "tier": 3,
    "debate": "Suspending high 17.5% tariffs on European infant formula imports to ease catastrophic domestic grocery shortages.",
    "pole1": "1 = Lower Protectionist Tariffs Permanently to Protect Infant Health and Prevent Monopolies",
    "pole10": "10 = Temporary Emergency Measure Only / Rebuild Secure Domestic Infant Nutrition Production",
    "stances": {
      "dem": 2,
      "gop": 6,
      "lib": 9,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_saudi_opec_two_million_barrel_cut",
    "name": "OPEC+ Two-Million-Barrel Production Cut & U.S.-Saudi Relations",
    "type": "News",
    "eraSpan": "2022 (Saudi Energy Showdown)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "Saudi Arabia coordinating with Russia to slash oil production right before midterm elections, defying White House appeals.",
    "pole1": "1 = Re-evaluate Saudi Strategic Partnership / Halt Weapons Sales and Enact NOPEC Legislation",
    "pole10": "10 = End Hostility Toward Domestic Energy Producers So America Doesn't Have to Beg Saudis for Oil",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_nevada_question_3_ranked_choice_top_five",
    "name": "Nevada Question 3 (Top-Five Open Primary & Ranked-Choice Voting Approval)",
    "type": "News",
    "eraSpan": "2022 (Top-Five Electoral Reform)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Voters narrowly passing (53%) first round of constitutional amendment establishing all-party primary with top five advancing to RCV.",
    "pole1": "1 = Empower Independent Voters and Break the Extremist Primary Grip of Both Political Parties",
    "pole10": "10 = Confusing, Costly System Designed to Confuse Voters and Undermine Transparent Vote Tabulation",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 1,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_maryland_question_4_cannabis_approval",
    "name": "Maryland Question 4 (Constitutional Amendment Legalizing Cannabis 67%)",
    "type": "News",
    "eraSpan": "2022 (Mid-Atlantic Adult-Use Legalization)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters overwhelmingly approving recreational cannabis legalization with 67.2% of the vote, mandating equity expungements.",
    "pole1": "1 = Overwhelming Democratic Mandate for Cannabis Freedom, Social Equity, and Reinvesting in Black Communities",
    "pole10": "10 = Regret Creation of Another Commercial Drug Industry Operating in Violation of Federal Law",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_missouri_amendment_3_cannabis_approval",
    "name": "Missouri Amendment 3 (Voter Legalization of Adult-Use Cannabis 53%)",
    "type": "News",
    "eraSpan": "2022 (Red State Commercial Cannabis)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters approving constitutional amendment legalizing adult possession and expunging nonviolent criminal cannabis records.",
    "pole1": "1 = Bipartisan Proof That Ending Failed Marijuana Prohibition Has Won Over the Heartland",
    "pole10": "10 = Oppose Creating Monopoly Licenses for Out-of-State Corporate Drug Conglomerates",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_arkansas_issue_4_cannabis_defeat",
    "name": "Arkansas Issue 4 (Recreational Cannabis Defeat by 56% No)",
    "type": "News",
    "eraSpan": "2022 (Southern Cannabis Ballot Defeat)",
    "domain": "Civil Rights & Social Issues",
    "tier": 4,
    "debate": "Voters rejecting recreational marijuana initiative opposed by conservative groups and progressive medical patients over monopoly licenses.",
    "pole1": "1 = Defeat Flawed Corporate Monopoly Models to Prepare for Real Grassroots Social Equity Reforms",
    "pole10": "10 = Stand Firm for Family Values and Reject Commercial Drug Operations in Arkansas Communities",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_california_prop_1_reproductive_freedom",
    "name": "California Proposition 1 (Constitutional Right to Reproductive Freedom)",
    "type": "News",
    "eraSpan": "2022 (California Constitutional Supermajority)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "66.9% of voters approving constitutional amendment explicitly protecting individual reproductive freedom including abortion and contraception.",
    "pole1": "1 = Permanent Unshakeable Fortress for Reproductive Autonomy and Beacon for Out-of-State Patients",
    "pole10": "10 = Extreme Amendment Expanding Late-Term Abortions Up to Birth with Zero Restrictions",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_vermont_proposal_5_reproductive_liberty",
    "name": "Vermont Proposal 5 (Article 22 Constitutional Reproductive Liberty Amendment)",
    "type": "News",
    "eraSpan": "2022 (First State to Pass Article 22)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "77% of voters approving Article 22 declaring that personal reproductive liberty is a fundamental right.",
    "pole1": "1 = Gold Standard for Protecting Personal Healthcare Dignity and Reproductive Self-Determination",
    "pole10": "10 = Dangerous Constitutional Mandate Stripping Lawmakers of the Right to Protect Unborn Children",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_california_prop_26_27_sports_betting_crushed",
    "name": "California Propositions 26 & 27 (Sports Betting Initiatives Crushed 82% No)",
    "type": "News",
    "eraSpan": "2022 (Record $450M Ballot Spend)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters overwhelmingly crushing competing corporate online sports betting and tribal casino sports betting measures.",
    "pole1": "1 = Stand with Sovereign Native Tribes to Protect Reservation Economies and Prevent Gambling Addiction",
    "pole10": "10 = Voters Rejected Greedy Out-of-State Online Gambling Companies Flooding the Airwaves with Smears",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 8,
      "soc": 2
    }
  },
  {
    "cycle": 2022,
    "id": "2022_nancy_pelosi_taipei_visit_taiwan",
    "name": "Speaker Nancy Pelosi Official Congressional Delegation Visit to Taipei",
    "type": "News",
    "eraSpan": "2022 (Fourth Taiwan Strait Crisis)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "First Speaker visit to Taiwan in 25 years, triggering unprecedented Chinese military live-fire exercises encircling the island.",
    "pole1": "1 = Unshakable American Commitment to Stand with Democratic Taiwan Against Authoritarian Threats",
    "pole10": "10 = Support Congressional Diplomacy While Warning Administration Must Provide Deterrent Arms to Match Rhetoric",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_sec_climate_disclosure_rule_proposed",
    "name": "SEC Proposed Rule Mandating Corporate Scope 1, 2, and 3 Climate Disclosures",
    "type": "News",
    "eraSpan": "2022-2024 (SEC Climate Disclosure Arc)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Requiring publicly traded companies to report greenhouse gas emissions and physical climate financial risks.",
    "pole1": "1 = Vital Market Transparency for Investors Facing Trillions in Climate and Stranded Asset Risks",
    "pole10": "10 = Unlawful SEC Mission Creep Turning a Securities Watchdog into an Unaccountable Climate Policeman",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_department_of_labor_gig_worker_rule",
    "name": "Department of Labor Proposed Independent Contractor Classification Rule",
    "type": "News",
    "eraSpan": "2022-2024 (Gig Worker FLSA Rule)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Revising FLSA economic reality factors making it easier to classify app gig workers and subcontracted labor as employees.",
    "pole1": "1 = Protect Vulnerable Workers from Misclassification and Guarantee Minimum Wage and Overtime",
    "pole10": "10 = Destroy Independent Contracting and Freelance Flexibility for Millions of American Professionals",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_massachusetts_question_1_millionaires_tax",
    "name": "Massachusetts Question 1 (Fair Share Amendment 4% Surtax on $1M+)",
    "type": "News",
    "eraSpan": "2022 (State Millionaire Tax Victory)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Constitutional amendment approved by 52% of voters levying a 4% surtax on annual income exceeding $1M for schools and transit.",
    "pole1": "1 = Landmark Victory Taxing the Super-Wealthy to Invest Directly in Public Schools, Roads, and Bridges",
    "pole10": "10 = Dangerous Tax Hike That Will Drive High-Earning Innovators, Physicians, and Capital to Florida and NH",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_disney_reedy_creek_district_dissolution",
    "name": "Florida Dissolution of Walt Disney World's Reedy Creek Improvement District",
    "type": "News",
    "eraSpan": "2022-2024 (Disney Free Speech War)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Governor DeSantis and legislature revoking Disney's 55-year-old self-governing district after company opposed parental rights bill.",
    "pole1": "1 = Blatant, Unconstitutional Retaliation Violating First Amendment Rights to Political Speech",
    "pole10": "10 = End Unfair Corporate Special Privileges for a Woke Multinational Corporation Meddling in Schools",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_ftc_lina_khan_aggressive_antitrust",
    "name": "FTC Chair Lina Khan Aggressive Anti-Monopoly Enforcement Campaign",
    "type": "News",
    "eraSpan": "2021-2026 (Neo-Brandeisian Antitrust Arc)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Filing lawsuits blocking mergers in high-tech (Meta/Within), defense, and pharma under revised non-consumer-welfare doctrine.",
    "pole1": "1 = Revitalize Historic Anti-Monopoly Enforcement to Break Up Concentrated Corporate Hegemony",
    "pole10": "10 = Reckless Ideological Hostility to Mergers That Harms Efficiency and Punishes American Innovation",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_postal_service_reform_act_enacted",
    "name": "Enactment of Bipartisan Postal Service Reform Act of 2022",
    "type": "News",
    "eraSpan": "2022 (USPS Debt Relief)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Repealing the 2006 PAEA 75-year retiree health pre-funding mandate and saving the Postal Service $50 billion over 10 years.",
    "pole1": "1 = Bipartisan Triumph Securing the Long-Term Solvency of America's Most Trusted Public Institution",
    "pole10": "10 = Support Fiscally Sound Relief While Requiring Rigorous Transparency and 6-Day Delivery Efficiency",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_california_fast_recovery_act_ab_257",
    "name": "California FAST Recovery Act (Fast Food Sectoral Wage Council)",
    "type": "News",
    "eraSpan": "2022-2023 (Fast Food Sectoral Bargaining)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Landmark law creating a state appointed council empowered to set binding industry-wide minimum wages up to $22/hr.",
    "pole1": "1 = Transformative Sectoral Bargaining Giving Fast-Food Workers a Real Voice Against Giant Chains",
    "pole10": "10 = Unprecedented Bureaucratic Price-Setting That Will Destroy Thousands of Franchise Small Businesses",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_social_security_cost_of_living_adjustment_8_7",
    "name": "Social Security 8.7% Cost-of-Living Adjustment (Highest in 41 Years)",
    "type": "News",
    "eraSpan": "2022 (Inflation COLA Shock)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Social Security Administration announcing an 8.7% benefit increase for 70 million Americans to match galloping inflation.",
    "pole1": "1 = Vital Protection Shielding Fixed-Income Seniors from Inflation / Expand Benefits by Taxing High Earners",
    "pole10": "10 = Highlight Accelerating Trust Fund Depletion / Enact Entitlement Reforms to Avert Bankruptcy by 2033",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_biden_advanced_chip_export_controls_china",
    "name": "Sweeping Export Controls Banning Advanced AI Chips and Tooling to China",
    "type": "News",
    "eraSpan": "2022-2026 (Semiconductor Blockade)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Imposing comprehensive unilateral export restrictions barring any company using U.S. technology from selling advanced AI chips to Beijing.",
    "pole1": "1 = Decisive Action to Protect U.S. National Security and Maintain Generational Lead in Artificial Intelligence",
    "pole10": "10 = Aggressive Action Against China / Expand Controls to Ensure Allied Compliance in Japan and Netherlands",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_illinois_workers_rights_amendment",
    "name": "Illinois Amendment 1 (Constitutional Right to Collective Bargaining)",
    "type": "News",
    "eraSpan": "2022 (State Constitutional Union Shield)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Constitutional initiative approved by 58.7% of voters guaranteeing fundamental right to unionize and permanently banning Right-to-Work laws.",
    "pole1": "1 = Historic Victory Enshrining Union Collective Bargaining Directly into the State Constitution",
    "pole10": "10 = Cementing Public Union Monopoly Power That Inflates State Property Taxes and Mandates Deficits",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_new_mexico_constitutional_early_childhood",
    "name": "New Mexico Constitutional Amendment 1 (Permanent Early Childhood Trust Fund)",
    "type": "News",
    "eraSpan": "2022 (Land Grant Early Childhood)",
    "domain": "Education",
    "tier": 3,
    "debate": "Approving (70% Yes) dedication of 1.25% of the state's permanent land grant endowment to fund universal pre-K and childcare.",
    "pole1": "1 = Visionary Public Investment Ensuring Universal Free Pre-K and Transforming Children's Lives",
    "pole10": "10 = Protect Permanent School Endowments from Excessive Depletion to Shield Future Generations",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_south_dakota_amendment_d_medicaid",
    "name": "South Dakota Constitutional Amendment D (Voter Medicaid Expansion)",
    "type": "News",
    "eraSpan": "2022 (Red State Medicaid Breakthrough)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Voters bypassing GOP state legislature (56% Yes) to expand Medicaid coverage under the ACA to 52,000 low-income residents.",
    "pole1": "1 = Voter Triumph Expanding Life-Saving Healthcare and Bringing Hundreds of Millions in Federal Funds",
    "pole10": "10 = Costly Expansion That Expands Welfare Dependency and Strains Future State General Fund Budgets",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_rail_labor_strike_threat_congressional_block",
    "name": "Threatened National Freight Rail Strike & Congressional Intervention",
    "type": "News",
    "eraSpan": "2022 (Railway Labor Act Intervention)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Congress passing emergency legislation imposing a tentative labor agreement without paid sick leave to prevent an economic rail shutdown.",
    "pole1": "1 = Unacceptable Betrayal of Rail Workers Fighting for Basic Paid Sick Leave Against Greedy Rail Barons",
    "pole10": "10 = Necessary Decisive Bipartisan Action to Avert a $2 Billion-a-Day Economic Catastrophe",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_cuba_re_designation_state_sponsor_terror",
    "name": "Maintaining Cuba on the State Department State Sponsor of Terrorism List",
    "type": "News",
    "eraSpan": "2021-2026 (SSOT Designation Controversy)",
    "domain": "Foreign Policy & Defense",
    "tier": 4,
    "debate": "Biden administration keeping Cuba on the terror list, blocking international banking transactions and European tourism.",
    "pole1": "1 = Rescind Unjust, Politically Motivated Designation That Imposes Inhumane Economic Suffering on Cubans",
    "pole10": "10 = Keep Cuba on the Terror List for Harboring Terrorists and Aiding Repressive Regimes in Venezuela",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 2,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_dc_circuit_standing_on_student_debt",
    "name": "Eighth Circuit Emergency Injunction Halting Student Debt Forgiveness",
    "type": "News",
    "eraSpan": "2022 (HEROES Act Judicial Freeze)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Federal appeals court issuing nationwide injunction blocking debt cancellation following lawsuit by six Republican state AGs.",
    "pole1": "1 = Partisan Judicial Overreach Denying Critical Economic Relief to Millions of Deserving Borrowers",
    "pole10": "10 = Uphold Injunction / The President Has No Statutory or Constitutional Power to Forgive $400B Unilaterally",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_arizona_proposition_132_supermajority_taxes",
    "name": "Arizona Proposition 132 (60% Supermajority for Voter Tax Hikes)",
    "type": "News",
    "eraSpan": "2022 (Direct Democracy Supermajority Rule)",
    "domain": "Economy & Taxation",
    "tier": 4,
    "debate": "Constitutional initiative approved by 50.7% of voters requiring 60% approval for any future ballot measures that raise taxes.",
    "pole1": "1 = Anti-Democratic Obstacle Designed by Wealthy Special Interests to Block Funding for Schools",
    "pole10": "10 = Protect Hardworking Taxpayers from Narrow 50.1% Special Interest Plundering of the Tax Code",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2022,
    "id": "2022_colorado_prop_122_psychedelic_legalization",
    "name": "Colorado Proposition 122 (Natural Medicine Health Act)",
    "type": "News",
    "eraSpan": "2022 (Statewide Plant Psychedelics Approval)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters approving (53.6%) decriminalization and state-licensed therapeutic healing centers for psilocybin, DMT, and mescaline.",
    "pole1": "1 = Landmark Move Toward Science-Based Healing for Depression, Addiction, and Mental Illness",
    "pole10": "10 = Oppose Commercializing Hallucinogens That Compromise Public Safety and Youth Health",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_israel_hamas_war_gaza_humanitarian",
    "name": "Israel-Hamas War in Gaza & Conditioning U.S. Military Aid",
    "type": "News",
    "eraSpan": "2023-2026 (Gaza Conflict & Middle East War)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Debating U.S. weapon shipments, military aid conditionality, civilian casualties in Gaza, and demanding an immediate permanent ceasefire.",
    "pole1": "1 = Immediate Permanent Ceasefire / Arms Embargo / Independent Palestinian State",
    "pole10": "10 = Unconditional Military Support for Israel to Completely Eradicate Hamas",
    "stances": {
      "dem": 4,
      "gop": 10,
      "lib": 3,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_southern_border_surge_asylum_executive",
    "name": "Southern Border Crisis & Executive Restrictions on Asylum Processing",
    "type": "News",
    "eraSpan": "2023-2026 (Border Security & Asylum Clashes)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Emergency executive proclamation shutting down asylum processing between ports of entry when daily border encounters exceed 2,500.",
    "pole1": "1 = Uphold Fundamental Due Process and Universal Statutory Right to Seek Asylum",
    "pole10": "10 = Seal the Southern Border Immediately / Reinstate 'Remain in Mexico' / Mass Deportations",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_post_inflation_cost_of_living_squeeze",
    "name": "Post-Inflation Cost-of-Living Squeeze (Grocery, Housing & Auto Insurance)",
    "type": "News",
    "eraSpan": "2022-2026 (Post-Inflation Living Squeeze)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Persistent voter anxiety over 22%+ cumulative price increases since 2020 on groceries, rent, auto insurance, and restaurant meals.",
    "pole1": "1 = Pass Federal Ban on Corporate Price Gouging / Expand Child Tax Credit and Housing Subsidies",
    "pole10": "10 = Unleash Domestic Energy, Slash Regulations, and Stop Deficit Spending to Kill Inflation",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_presidential_age_biden_exit_harris_nomination",
    "name": "Presidential Age, Cognitive Fitness & Biden Withdrawal for Kamala Harris",
    "type": "News",
    "eraSpan": "2024 (Historic Nominating Realignment)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Joe Biden withdrawing following the June debate, clearing the path for Vice President Kamala Harris as the Democratic nominee.",
    "pole1": "1 = United Behind Kamala Harris as a Dynamic, Qualified Leader Defending Democracy",
    "pole10": "10 = Expose White House Cover-Up of Cognitive Decline / Highlight Failed Biden-Harris Record",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 2,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_trump_criminal_trials_scotus_immunity",
    "name": "Donald Trump Criminal Convictions & Supreme Court Presidential Immunity Ruling",
    "type": "News",
    "eraSpan": "2023-2026 (Trump Jurisprudence)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Manhattan 34-count felony conviction and Supreme Court ruling (Trump v. US) granting broad immunity for official presidential acts.",
    "pole1": "1 = No One Above the Law / Convicted Felon Unfit for the Presidency / Reform Supreme Court",
    "pole10": "10 = Corrupt Political Lawfare by the Biden-Harris DOJ / Historic Victory for Constitutional Separation of Powers",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_post_dobbs_state_abortion_ballot_measures",
    "name": "Ten State Constitutional Abortion Rights Ballot Measures (FL, AZ, NV, MO, etc.)",
    "type": "News",
    "eraSpan": "2024 (Super-Ballot Reproductive Rights)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Ballot initiatives in 10 states codifying constitutional protections for abortion and overturning near-total state bans.",
    "pole1": "1 = Vote Yes Across All 10 States to Restore Bodily Autonomy and Medical Dignity",
    "pole10": "10 = Vote No / Defend Unborn Children from Extreme Constitutional Amendments Mandating Abortion on Demand",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_trump_universal_baseline_tariffs_proposal",
    "name": "Trump Proposal for 10-20% Universal Tariffs & 60% Tariffs on China",
    "type": "News",
    "eraSpan": "2023-2026 (New Tariff Regime Arc)",
    "domain": "Trade & Globalism",
    "tier": 1,
    "debate": "Proposing sweeping universal baseline tariffs on all $3 trillion in foreign imports to re-industrialize the American homeland.",
    "pole1": "1 = Reject Mass National Sales Tax That Will Spike Consumer Prices by $2,600 and Start Global Trade Wars",
    "pole10": "10 = Enact Universal Reciprocal Tariffs to Eliminate Trade Deficits and Reshoring Factory Jobs",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 5,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_electric_vehicle_mandates_epa_tailpipe",
    "name": "EPA Tailpipe Emission Standards & Federal Electric Vehicle Targets",
    "type": "News",
    "eraSpan": "2023-2026 (EV Mandate Polarization)",
    "domain": "Energy & Climate",
    "tier": 1,
    "debate": "EPA rules requiring roughly 56% of new passenger vehicles sold in the U.S. to be electric or plug-in hybrid by 2032.",
    "pole1": "1 = Essential Global Decarbonization Leadership That Catalyzes Domestic EV and Battery Factories",
    "pole10": "10 = Eliminate Biden's Unlawful EV Mandate That Destroys Consumer Choice and Benefits Chinese Batteries",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_artificial_intelligence_executive_order",
    "name": "Biden Executive Order on AI Safety & Compute Reporting Thresholds",
    "type": "News",
    "eraSpan": "2023-2026 (AI Governance Era)",
    "domain": "Technology & Infrastructure",
    "tier": 1,
    "debate": "Invoking Defense Production Act to require frontier AI developers to share safety test red-teaming results with the government.",
    "pole1": "1 = Enact Robust Federal Guardrails to Prevent Existential Risks, Deepfakes, and Worker Displacement",
    "pole10": "10 = Repeal Stifling Government Regulations That Choke American AI Innovation and Cede Leadership to China",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_tiktok_divestiture_ban_act_enacted",
    "name": "Enactment of the Protecting Americans from Foreign Adversary Controlled Apps Act",
    "type": "News",
    "eraSpan": "2024-2025 (TikTok Divestiture Arc)",
    "domain": "Technology & Infrastructure",
    "tier": 1,
    "debate": "Bipartisan law signed by Biden forcing ByteDance to divest U.S. TikTok operations within 270 days or face a nationwide ban.",
    "pole1": "1 = Enforce Lawful Sale to Neutral Ownership to Protect 170M Americans from Chinese Surveillance",
    "pole10": "10 = Defend First Amendment Free Speech Rights and Independent Digital Creator Livelihoods",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_campus_encampments_antisemitism_free_speech",
    "name": "University Campus Encampments, Free Speech & Antisemitism Hearings",
    "type": "News",
    "eraSpan": "2023-2024 (Campus Protest Clashes)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "Pro-Palestinian student tent encampments at Columbia, UCLA, and dozens of campuses, sparking police sweeps and donor rebellions.",
    "pole1": "1 = Protect Peaceful Student Anti-War Free Expression and Divestment Demands from Academic Repression",
    "pole10": "10 = Expel Extremist Agitators, Restore Campus Safety, and Strip Federal Grants from Universities Harboring Hate",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_student_loan_save_plan_injunctions",
    "name": "Federal Appeals Court Injunctions Freezing Biden SAVE Student Loan Plan",
    "type": "News",
    "eraSpan": "2023-2025 (SAVE Plan Litigation)",
    "domain": "Education",
    "tier": 2,
    "debate": "GOP state AGs winning nationwide injunctions halting the SAVE income-driven repayment plan lowering payments to 5% of income.",
    "pole1": "1 = Defend the Lawful SAVE Plan Relieving Crushing Student Debt for Millions of Working-Class Borrowers",
    "pole10": "10 = Uphold Injunctions / Stop the Unlawful Redistribution of Billions in Student Debt onto Non-College Taxpayers",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_housing_affordability_supply_crisis",
    "name": "National Housing Supply Shortage & 7% Mortgage Rate Lock-in",
    "type": "News",
    "eraSpan": "2022-2026 (Housing Affordability Crisis)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Median home prices hitting record $420,000 as 7% interest rates freeze existing home turnover and exacerbate 4M home deficit.",
    "pole1": "1 = Build 3M New Homes / $25,000 First-Time Homebuyer Grants / Ban Institutional Landlord Price-Fixing",
    "pole10": "10 = Slash Stifling Environmental Zoning Rules / Unleash Private Homebuilders / Cut Interest Rates",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_record_us_crude_oil_production",
    "name": "U.S. Crude Oil Production Reaching All-Time World Record (13.3M Barrels/Day)",
    "type": "News",
    "eraSpan": "2023-2026 (American Energy Dominance)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "United States producing more crude oil than any nation in history, creating tension with progressive climate targets.",
    "pole1": "1 = Accelerate Fossil Phase-Out and End Fossil Fuel Leasing to Meet Binding Global Climate Targets",
    "pole10": "10 = Celebrate American Energy Dominance Powering the Economy and Slashing Reliance on Hostile Dictators",
    "stances": {
      "dem": 3,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_tcja_2025_sunset_cliff_debate",
    "name": "Approaching 2025 Expiration of TCJA Individual Tax Cuts",
    "type": "Ideological",
    "eraSpan": "2017-2026 (TCJA Sunset Negotiation)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Facing automatic $4 trillion tax hike if the 2017 individual income tax cuts, standard deduction, and child tax credit expire.",
    "pole1": "1 = Let Cuts for Top Earners Expire While Extending Relief for Working Families Under $400,000",
    "pole10": "10 = Permanently Extend All 2017 Tax Cuts and Lower the Corporate Tax Rate Further to 15%",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_ukraine_aid_61_billion_speaker_johnson",
    "name": "House Passage of $61 Billion Ukraine Aid Package Under Speaker Johnson",
    "type": "News",
    "eraSpan": "2024 (Ukraine Supplemental Breakthrough)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Speaker Mike Johnson relying on Democratic votes to pass $61B in weapons for Ukraine despite intense MAGA rebellion.",
    "pole1": "1 = Indispensable Superpower Leadership Standing Resolutely Behind Ukrainian Democracy Against Tyranny",
    "pole10": "10 = Betrayal of America First Priorities Sending Billions to Foreign Trenches While the Southern Border Collapses",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_social_security_insolvency_cliff_2033",
    "name": "Trustees Report Accelerating Social Security Insolvency to 2033",
    "type": "Ideological",
    "eraSpan": "1980-2035 (Entitlement Cliff Arc)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Projections showing 21% automatic across-the-board benefit cuts in 9 years unless Congress raises revenues or reforms benefits.",
    "pole1": "1 = Protect and Expand Benefits by Lifting the Payroll Tax Cap on Wealthy Earners Making Over $400,000",
    "pole10": "10 = Oppose Tax Hikes / Implement Bipartisan Fiscal Commission, Raise Retirement Age, and Means-Test",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_chevron_deference_overturned_scotus",
    "name": "Supreme Court Overturning 40-Year Chevron Deference (Loper Bright)",
    "type": "News",
    "eraSpan": "2024 (Administrative Law Revolution)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Supreme Court holding courts need not defer to agency statutory interpretations, fundamentally reining in federal regulators.",
    "pole1": "1 = Disastrous Corporate Power Grab Hobbling Federal Agencies from Protecting Clean Air, Water, and Consumers",
    "pole10": "10 = Monumental Constitutional Restoration of Article III Powers Reining in Rogue Unelected Bureaucracies",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_florida_amendment_4_abortion_limit",
    "name": "Florida Amendment 4 (Constitutional Right to Abortion to Viability)",
    "type": "News",
    "eraSpan": "2024 (Florida 60% Supermajority Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 1,
    "debate": "High-stakes ballot initiative requiring 60% supermajority to overturn Florida's newly enacted 6-week abortion ban.",
    "pole1": "1 = Vote Yes / Overturn the Cruel 6-Week Ban That Endangers Women's Lives Before Most Know They Are Pregnant",
    "pole10": "10 = Vote No / Protect Unborn Children from Extreme Constitutional Amendment Deregulating Late-Term Abortion",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_florida_amendment_3_cannabis_legalization",
    "name": "Florida Amendment 3 (Adult-Use Cannabis Legalization Measure)",
    "type": "News",
    "eraSpan": "2024 (Florida 60% Cannabis Battle)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Constitutional initiative supported by Trulieve requiring 60% to legalize adult personal cannabis possession up to 3 ounces.",
    "pole1": "1 = Vote Yes / End Outdated Criminalization, Generate Hundreds of Millions in Taxes, and Free Up Police",
    "pole10": "10 = Vote No / Oppose Flooding Florida Tourist Communities and Public Beaches with Pungent Weed Smoke",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_arizona_prop_139_abortion_rights",
    "name": "Arizona Proposition 139 (Right to Abortion Constitutional Initiative)",
    "type": "News",
    "eraSpan": "2024 (Arizona Reproductive Freedom)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Citizen initiative to establish a fundamental right to abortion up to fetal viability in the Arizona Constitution.",
    "pole1": "1 = Vote Yes / Restore Reproductive Freedom and Safeguard Healthcare from Politicized State Bans",
    "pole10": "10 = Vote No / Oppose Erasing Important Commonsense Medical Safeguards and Parental Notification",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_missouri_amendment_3_abortion_repeal",
    "name": "Missouri Amendment 3 (Voter Repeal of Near-Total Abortion Trigger Ban)",
    "type": "News",
    "eraSpan": "2024 (Heartland Abortion Reversal)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Initiative to repeal Missouri's trigger ban that outlaws abortion from conception with zero rape or incest exceptions.",
    "pole1": "1 = Vote Yes / Restore Freedom for Women and Families to Make Their Own Private Healthcare Decisions",
    "pole10": "10 = Vote No / Defend Missouri's Culture of Life and Protect Innocent Unborn Children from Destruction",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_rfk_jr_independent_candidacy_trump_endorsement",
    "name": "Robert F. Kennedy Jr. Independent Campaign & Trump Endorsement",
    "type": "News",
    "eraSpan": "2023-2024 (MAHA Movement Genesis)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "RFK Jr. suspending campaign to endorse Donald Trump under the 'Make America Healthy Again' (MAHA) chronic disease banner.",
    "pole1": "1 = Reject Anti-Vaccine Conspiracy Theories and Discredited Fringe Medicine Siphoning Public Health Trust",
    "pole10": "10 = Join Historic Unity Coalition to Confront Chronic Disease Epidemic, Ultra-Processed Foods, and Pharma Corruption",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 4,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_project_2025_presidential_transition_guide",
    "name": "Heritage Foundation Project 2025 & Schedule F Reclassification",
    "type": "News",
    "eraSpan": "2023-2024 (Presidential Transition Blueprint)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Comprehensive conservative blueprint proposing to dismantle administrative agencies and convert 50,000 civil servants to political appointees.",
    "pole1": "1 = Extreme Authoritarian Takeover Destroying the Professional Merit-Based Civil Service and Democracy",
    "pole10": "10 = Restore Democratic Accountability and Break the Power of the Unelected Deep State Bureaucracy",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 6,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_mass_deportation_logistics_national_guard",
    "name": "Trump Pledge for the Largest Mass Deportation in American History",
    "type": "News",
    "eraSpan": "2024-2026 (Mass Deportation Agenda)",
    "domain": "Immigration & Border",
    "tier": 1,
    "debate": "Pledging to mobilize the National Guard, local police, and military aircraft to deport 11+ million undocumented immigrants.",
    "pole1": "1 = Catastrophic Humanitarian and Economic Nightmare That Will Tear Families Apart and Crash Ag/Construction",
    "pole10": "10 = Restore Sovereign Borders, Eliminate Criminal Migrant Gangs, and Relieve Strained Public Services",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_houthi_red_sea_shipping_attacks",
    "name": "Houthi Anti-Ship Missile Attacks in Red Sea & Operation Prosperity Guardian",
    "type": "News",
    "eraSpan": "2023-2026 (Red Sea Maritime Conflict)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Yemeni Houthi rebels launching drone and missile attacks on commercial ships, forcing global vessels around Africa.",
    "pole1": "1 = Address Root Cause by Halting Gaza War / Regional Diplomatic De-escalation",
    "pole10": "10 = Strike Houthi Missile Infrastructure Decisively / Defend Global Freedom of Navigation by Force",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_commercial_space_faa_licensing_spacex",
    "name": "Starship Orbital Flight Tests & FAA Space Launch Licensing Clashes",
    "type": "News",
    "eraSpan": "2023-2026 (Starship Commercial Space Era)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "SpaceX successfully catching the 232-foot Super Heavy booster while clashing with FAA regulators over environmental launch license delays.",
    "pole1": "1 = Ensure Rigorous Independent Safety and Environmental Oversight to Protect Coastal Marine Habitats",
    "pole10": "10 = Slash Stifling FAA Bureaucracy to Keep America Ahead of China in the Second Space Race to the Moon",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 10,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_california_fast_food_twenty_dollar_wage",
    "name": "California Implementation of $20 Minimum Wage for Fast Food Workers",
    "type": "News",
    "eraSpan": "2024 (Fast Food Wage Implementation)",
    "domain": "Labor & Welfare",
    "tier": 3,
    "debate": "Implementing $20/hr wage floor for fast-food chains with 60+ locations, leading to price increases and kiosk automation.",
    "pole1": "1 = Life-Changing Dignified Wage for Hundreds of Thousands of Low-Income Breadwinners in High-Cost California",
    "pole10": "10 = Destructive Government Price-Fixing Spurring Rapid Kiosk Automation and Making Fast Food Unaffordable",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_nuclear_energy_small_modular_reactors_smrs",
    "name": "Small Modular Reactors (SMRs) & Big Tech Powering AI Data Centers",
    "type": "Ideological",
    "eraSpan": "2020-2030 (AI Energy Clean Baseload)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Microsoft, Amazon, and Google investing billions in nuclear energy and Three Mile Island restart to feed hungry AI data centers.",
    "pole1": "1 = Support Safe Advanced Baseload Clean Power While Enforcing Strict Nuclear Waste and Siting Standards",
    "pole10": "10 = Fast-Track Nuclear Approvals and Re-open Plants to Lead the World in Artificial Intelligence Dominance",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_colorado_prop_131_all_candidate_primary",
    "name": "Colorado Proposition 131 (Top-Four Open Primary & Ranked-Choice Voting Defeat)",
    "type": "News",
    "eraSpan": "2024 (RCV Western Ballot Fight)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Voters defeating citizen initiative to establish nonpartisan all-candidate primaries with top-four advancing to ranked-choice general.",
    "pole1": "1 = Support Modernizing Elections to Empower Moderates and Eliminate Gerrymandered Safe Seats",
    "pole10": "10 = Protect Traditional Democratic Transparency / Reject Overly Complex, Opaque Voting Schemes",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 1,
      "grn": 1,
      "con": 1,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_ohio_senate_race_crypto_fairshake",
    "name": "Fairshake Super PAC $40M Advertising Blitz in Ohio Senate Race",
    "type": "News",
    "eraSpan": "2024 (Cryptocurrency Political Power)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Cryptocurrency industry Super PAC spending $40 million to defeat Senate Banking Chairman Sherrod Brown over crypto regulations.",
    "pole1": "1 = Stop Unregulated Crypto Speculators from Buying American Elections and Evading Anti-Money Laundering Laws",
    "pole10": "10 = Defend Digital Asset Innovation and Clear Regulatory Frameworks Against Hostile SEC Overreach",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_nevada_question_6_abortion_constitutional",
    "name": "Nevada Question 6 (Constitutional Right to Abortion Approval)",
    "type": "News",
    "eraSpan": "2024 (Nevada Reproductive Freedom)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "64% of voters approving first round of constitutional amendment protecting reproductive freedom through fetal viability.",
    "pole1": "1 = Cement Permanent Constitutional Guarantees That No Future State Legislature Can Strip Away",
    "pole10": "10 = Oppose Amending the Nevada Constitution to Protect an Industry That Profits from Ending Human Life",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_corporate_tax_rate_fifteen_percent_proposal",
    "name": "Donald Trump Proposal to Lower Domestic Corporate Tax to 15%",
    "type": "News",
    "eraSpan": "2024 (New Corporate Tax Cut Proposal)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Proposing to lower the federal corporate income tax rate from 21% down to 15% exclusively for companies that manufacture in America.",
    "pole1": "1 = Unconscionable Giveaway to Giant Corporations That Will Explode Deficits by Billions",
    "pole10": "10 = Transformative Industrial Incentive Turning America into the Greatest Manufacturing Magnet on Earth",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_no_tax_on_tips_bipartisan_pledge",
    "name": "Trump & Harris Both Backing 'No Tax on Tips' for Service Workers",
    "type": "News",
    "eraSpan": "2024 (Service Worker Tax Pander)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Both major presidential nominees proposing federal income tax exemptions on tips earned by restaurant and hospitality workers.",
    "pole1": "1 = Target Tax Relief Directly to Real Service Workers While Guarding Against High-Earner Reclassifications",
    "pole10": "10 = Provide Immediate Tax Relief for Hardworking Waiters, Bartenders, and Drivers Squeezed by Inflation",
    "stances": {
      "dem": 4,
      "gop": 8,
      "lib": 8,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_clean_energy_lng_export_pause_biden",
    "name": "Biden Department of Energy Temporary Pause on New LNG Export Terminals",
    "type": "News",
    "eraSpan": "2024 (LNG Export Battle)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Pausing pending approvals for liquefied natural gas export terminals to update environmental and domestic price impact studies.",
    "pole1": "1 = Vital Pause Halting Massive Expansion of Climate-Destroying Methane Export Infrastructure",
    "pole10": "10 = Unlawful Hostage-Taking That Punishes American Energy Allies in Europe and Threatens Good Jobs",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_child_tax_credit_six_thousand_proposal",
    "name": "Kamala Harris Proposal for $6,000 Newborn Child Tax Credit",
    "type": "News",
    "eraSpan": "2024 (Family Tax Credit Expansion)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Proposing a $6,000 tax credit for families in the first year of a child's life and restoring the $3,600 expanded CTC.",
    "pole1": "1 = Decisive Anti-Poverty Policy Cutting Child Poverty in Half and Supporting Stressed New Parents",
    "pole10": "10 = Massive Expansion of Unfunded Welfare Without Work Requirements That Fuels Long-Term Dependency",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_south_dakota_initiated_measure_29_weed_defeat",
    "name": "South Dakota Measure 29 (Adult-Use Cannabis Defeated 56% No)",
    "type": "News",
    "eraSpan": "2024 (Third South Dakota Cannabis Vote)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters rejecting recreational marijuana for the second consecutive time following the 2020 court invalidation.",
    "pole1": "1 = Disappointing Result / Continue Building Grassroots Momentum for Personal Liberty and Compassion",
    "pole10": "10 = Voters Stood Resolutely for Family Values and Rejected Commercial Substance Abuse in South Dakota",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_north_dakota_measure_5_cannabis_defeat",
    "name": "North Dakota Measure 5 (Adult-Use Cannabis Defeated 53% No)",
    "type": "News",
    "eraSpan": "2024 (Northern Plains Cannabis Referendum)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters in North Dakota rejecting statutory legalization of personal cannabis possession and retail commerce.",
    "pole1": "1 = The Movement for Freedom Continues / Criminalizing Adults for a Plant Remains Foolish and Costly",
    "pole10": "10 = Reaffirm Traditional Community Health and Protect Our Streets from Commercial Drug Dispensaries",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_social_media_surgeon_general_warning_labels",
    "name": "Surgeon General Dr. Vivek Murthy Calling for Tobacco-Style Warning Labels on Social Media",
    "type": "News",
    "eraSpan": "2024 (Youth Mental Health & Tech)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Demanding congressionally mandated warning labels on social platforms warning of severe adolescent mental health harms.",
    "pole1": "1 = Necessary Public Health Emergency Action to Protect Children from Addictive Predatory Algorithms",
    "pole10": "10 = Paternalistic Government Overreach / Parents, Not Federal Bureaucrats, Must Manage Screen Time",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_massachusetts_question_2_mcas_testing_repeal",
    "name": "Massachusetts Question 2 (Eliminating MCAS High School Graduation Requirement)",
    "type": "News",
    "eraSpan": "2024 (High-Stakes Testing Repeal Win)",
    "domain": "Education",
    "tier": 3,
    "debate": "59% of voters approving teacher-union-backed initiative repealing requirement that students pass MCAS standardized tests to graduate.",
    "pole1": "1 = Historic Victory Ending Destructive 'Teaching to the Test' and Restoring Holistic Local Education",
    "pole10": "10 = Tragic Lowering of Educational Standards That Denies Objective Accountability and Disadvantages Poor Kids",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_california_prop_36_theft_fentanyl_penalties",
    "name": "California Proposition 36 (Voter Overhaul of Prop 47 Tough-on-Crime)",
    "type": "News",
    "eraSpan": "2024 (Landmark Criminal Justice Reversal)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "70% of voters approving sweeping measure making repeat retail theft and hard drug possession felonies again.",
    "pole1": "1 = Step Backward Fueling Mass Incarceration That Fails to Treat Underlying Mental Health and Addiction",
    "pole10": "10 = Overwhelming Voter Mandate Restoring Common Sense, Law and Order, and Stopping Brazen Retail Looting",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_maryland_question_1_reproductive_freedom",
    "name": "Maryland Question 1 (Constitutional Right to Reproductive Freedom Approval)",
    "type": "News",
    "eraSpan": "2024 (East Coast Reproductive Constitutional Shield)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "75% of voters approving constitutional amendment guaranteeing individual right to reproductive freedom including abortion.",
    "pole1": "1 = Overwhelming Democratic Supermajority Affirming Abortion as an Inviolable Fundamental Human Right",
    "pole10": "10 = Tragic Extremist Amendment Stripping Lawmakers of Any Power to Protect Unborn Human Life",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_nebraska_initiative_434_vs_439_dueling_abortion",
    "name": "Nebraska Initiative 434 (First Trimester Ban) vs. Initiative 439 (Right to Viability)",
    "type": "News",
    "eraSpan": "2024 (Dueling Abortion Ballot Measures)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "Voters approving Initiative 434 banning second- and third-trimester abortions while defeating Initiative 439 expanding rights.",
    "pole1": "1 = Disappointing Confusion Exploited by Opponents / Keep Fighting to Secure Real Reproductive Freedom",
    "pole10": "10 = Historic Pro-Life Victory Proving Nebraska Stands Firmly to Protect Babies in the Womb",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_massachusetts_question_4_psychedelics_defeat",
    "name": "Massachusetts Question 4 (Legalization of Natural Psychedelics Defeated 57% No)",
    "type": "News",
    "eraSpan": "2024 (Psychedelics Expansion Halt)",
    "domain": "Civil Rights & Social Issues",
    "tier": 3,
    "debate": "Voters rejecting measure to legalize and regulate natural psychedelic substances (psilocybin, mescaline, DMT).",
    "pole1": "1 = Regrettable Setback for Veterans and Trauma Survivors / Work Toward Clinical Medical Frameworks",
    "pole10": "10 = Commonsense Decision Rejecting Risky Commercial Drug Commercialization in Local Neighborhoods",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 1,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_national_guard_border_operation_lone_star",
    "name": "Texas Operation Lone Star & Razor Wire Standoff at Shelby Park",
    "type": "News",
    "eraSpan": "2023-2024 (State Border Sovereignty Standoff)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "Texas National Guard installing concertina wire along Rio Grande and defying federal border patrol access orders.",
    "pole1": "1 = Unconstitutional State Insurrection Violating Supreme Court Supremacy and Federal Border Authority",
    "pole10": "10 = Heroic Defense by Governor Abbott Exercising Sovereign State Self-Defense Against Foreign Invasion",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_nuclear_plant_three_mile_island_restart",
    "name": "Constellation Energy 20-Year Deal to Restart Three Mile Island for Microsoft AI",
    "type": "News",
    "eraSpan": "2024 (Nuclear Energy Comeback)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Re-opening 835MW Unit 1 reactor (renamed Crane Clean Energy Center) to feed zero-emission baseload power to Microsoft data centers.",
    "pole1": "1 = Welcome Return to Safe Baseload Carbon-Free Energy Essential for Reaching Climate Goals",
    "pole10": "10 = Unleash Private Nuclear Innovation to Power American Technological Superiority in AI",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_california_prop_3_same_sex_marriage_affirm",
    "name": "California Proposition 3 (Repealing Outdated 2008 Prop 8 Language)",
    "type": "News",
    "eraSpan": "2024 (Constitutional Cleanup Measure)",
    "domain": "Civil Rights & Social Issues",
    "tier": 2,
    "debate": "62% of voters officially amending California Constitution to remove obsolete Prop 8 language declaring marriage only between man/woman.",
    "pole1": "1 = Official Constitutional Celebration of Unconditional Marriage Equality and LGBTQ Dignity",
    "pole10": "10 = Oppose Rewriting State Constitution to Erode Traditional Societal and Religious Marriage Norms",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 3,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_arizona_proposition_314_immigration_enact",
    "name": "Arizona Proposition 314 ('Secure the Border Act' State Felony Crossing Win)",
    "type": "News",
    "eraSpan": "2024 (New State Border Felony Law)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "63% of voters approving citizen initiative authorizing state and local police to arrest undocumented migrants crossing outside ports.",
    "pole1": "1 = Dangerous Return to Unconstitutional SB 1070 Profiling That Threatens Civil Rights of All Latinos",
    "pole10": "10 = Decisive Voter Mandate Empowering Local Police to Arrest Illegal Crossers and Protect Arizona",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_drone_warfare_red_sea_intercept_costs",
    "name": "Navy Spending $2M Standard Missiles to Down $2,000 Houthi Attack Drones",
    "type": "News",
    "eraSpan": "2024 (Asymmetric Drone Economics)",
    "domain": "Foreign Policy & Defense",
    "tier": 3,
    "debate": "High-tech cost disparity as U.S. warships expend millions in advanced interceptors to defeat swarm-capable cheap enemy drones.",
    "pole1": "1 = Accelerate Deployment of Directed Energy Lasers and High-Power Microwave Systems to Fix Asymmetry",
    "pole10": "10 = Strike the Launchers, Depots, and Radar Sites Directly Inside Yemen Rather Than Catching Missiles",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_anti_price_gouging_grocery_statute_push",
    "name": "Federal Ban on Unfair Food & Grocery Price Gouging",
    "type": "News",
    "eraSpan": "2024 (Kamala Harris Economic Agenda)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Kamala Harris proposing first-ever federal ban on corporate price gouging in the food and grocery sector.",
    "pole1": "1 = Stop Greedflation / Empower FTC to Penalize Monopolistic Agribusinesses Squeezing Consumers",
    "pole10": "10 = Discredited Soviet-Style Socialist Price Controls That Guarantee Empty Grocery Shelves and Rationing",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2024,
    "id": "2024_salt_deduction_repeal_pledge_bipartisan",
    "name": "Donald Trump Pledging Full Repeal of the $10,000 SALT Cap",
    "type": "News",
    "eraSpan": "2024 (Long Island / Suburban Tax Pledge)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Trump promising New York and New Jersey suburban voters he will restore full state and local tax deductibility in 2025.",
    "pole1": "1 = Welcome Belated Relief for Squeezed Middle-Class Suburban Homeowners in High-Cost States",
    "pole10": "10 = Massive $1 Trillion Tax Giveaway Siphoning Money from the Heartland to Wealthy Coastal Millionaires",
    "stances": {
      "dem": 4,
      "gop": 7,
      "lib": 8,
      "grn": 2,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_artificial_intelligence_workforce_displacement",
    "name": "Artificial Intelligence White-Collar Workforce Displacement & Transition",
    "type": "News",
    "eraSpan": "2024-2030 (AI Automation Frontier)",
    "domain": "Technology & Infrastructure",
    "tier": 1,
    "debate": "Addressing widespread labor market disruption and corporate restructuring in software, law, finance, and customer service driven by autonomous AI agents.",
    "pole1": "1 = Universal Basic Income (UBI) / AI Robot Tax / Strong Collective Worker Transition Guarantees",
    "pole10": "10 = Free Market Adaptation / Re-skilling / Prohibit Innovation-Choking AI Regulations and Taxes",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_national_debt_approaching_38_trillion",
    "name": "U.S. National Debt Approaching $38 Trillion & Net Interest Spending Surge",
    "type": "News",
    "eraSpan": "2024-2030 (Sovereign Debt Crisis Arc)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Federal net interest outlays surpassing $1.1 trillion annually, exceeding the entire defense budget and threatening sovereign credit.",
    "pole1": "1 = Tax Extreme Wealth and Corporate Giants to Rebalance the Budget and Protect the Social Safety Net",
    "pole10": "10 = Enact Binding Spending Caps, Slash Bureaucracy, and Cut Non-Defense Spending to Avert Fiscal Ruin",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_tcja_reconciliation_negotiation_cliff",
    "name": "Reconciliation Negotiations on Permanent Extension of 2017 Tax Cuts",
    "type": "News",
    "eraSpan": "2025-2027 (Post-2025 Tax Legislation)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Negotiating the permanent extension of the 21% corporate rate, doubled standard deduction, and individual income brackets.",
    "pole1": "1 = Let Top-Tier Tax Cuts Expire / Reinvest Revenues into Universal Childcare, Healthcare, and Housing",
    "pole10": "10 = Lock In All Tax Cuts Permanently and Slash Capital Gains Rates to Stimulate Investment and Growth",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_schedule_f_civil_service_reclassification",
    "name": "Schedule F Reclassification of Federal Civil Servants & DOGE Department",
    "type": "News",
    "eraSpan": "2025-2027 (Administrative State Overhaul)",
    "domain": "Governance & Judiciary",
    "tier": 1,
    "debate": "Converting tens of thousands of career federal civil servants into at-will political employees under the Department of Government Efficiency.",
    "pole1": "1 = Defend the Merit-Based Professional Civil Service Against Partisan Weaponization and Patronage",
    "pole10": "10 = Break the Power of the Unelected Deep State and Return Full Democratic Accountability to the President",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_electric_grid_capacity_ai_data_centers",
    "name": "Electric Grid Capacity Crises & Surging Power Demands of AI Data Centers",
    "type": "News",
    "eraSpan": "2024-2030 (Grid Reliability & AI Infrastructure)",
    "domain": "Energy & Climate",
    "tier": 1,
    "debate": "Electric utilities requesting emergency delays on coal plant retirements to meet gigawatt-scale power demands from hyperscale AI centers.",
    "pole1": "1 = Mandate Tech Giants Fund 100% Dedicated Clean Renewable Power / Protect Communities from Spiking Utility Bills",
    "pole10": "10 = Keep All Baseload Coal, Gas, and Nuclear Plants Running to Win the Global Tech War with China",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 9,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_housing_supply_institutional_investor_bans",
    "name": "Banning Wall Street Private Equity from Buying Single-Family Homes",
    "type": "News",
    "eraSpan": "2024-2028 (Single-Family Housing Protection)",
    "domain": "Economy & Taxation",
    "tier": 1,
    "debate": "Federal legislation barring institutional private equity funds and hedge funds from purchasing single-family residential homes.",
    "pole1": "1 = Ban Wall Street Landlords / Protect American Neighborhoods and Restore Affordable Homeownership",
    "pole10": "10 = Free Market Capital Allocation / Oppose Government Dictates on Property Ownership and Investment",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_taiwan_strait_deterrence_critical_minerals",
    "name": "Taiwan Strait Defense Posture & U.S. Critical Mineral Independence",
    "type": "News",
    "eraSpan": "2024-2030 (Indo-Pacific Deterrence Phase)",
    "domain": "Foreign Policy & Defense",
    "tier": 1,
    "debate": "Deterring Chinese naval blockades of Taiwan while establishing emergency national stockpiles of refined rare earths and gallium.",
    "pole1": "1 = Multilateral Diplomatic Deterrence, High-Tech Export Controls, and Sustainable Domestic Recycling",
    "pole10": "10 = Fast-Track Weapons Shipments to Taiwan / Fast-Track Domestic Mining Permits on Federal Lands",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_post_tariff_consumer_price_impacts",
    "name": "Economic Impacts of Universal Tariffs & Supply Chain Readjustments",
    "type": "News",
    "eraSpan": "2025-2028 (Tariff Adjustment Era)",
    "domain": "Trade & Globalism",
    "tier": 1,
    "debate": "Evaluating consumer price index inflation, domestic manufacturing reshoring, and trade partner retaliation under new tariffs.",
    "pole1": "1 = Roll Back Punitive Universal Tariffs Squeezing Working-Class Families / Rebuild Global Trade Pacts",
    "pole10": "10 = Stay the Course on Protective Tariffs Rebuilding the American Industrial Base and Bringing Jobs Home",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 4,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_social_security_bipartisan_commission_push",
    "name": "Establishment of Statutory Bipartisan Fiscal Commission on Entitlements",
    "type": "News",
    "eraSpan": "2025-2027 (Fiscal Commission Legislative Push)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Creating a 16-member bipartisan commission empowered to fast-track mandatory legislative packages to shore up trust funds.",
    "pole1": "1 = Reject Secret Closed-Door Commissions Designed to Cut Social Security and Medicare Behind Closed Doors",
    "pole10": "10 = Pass the Bipartisan Fiscal Commission to Save Entitlements from Devastating Automatic 21% Benefit Cuts",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_small_modular_nuclear_reactor_deployments",
    "name": "First Commercial Deployments of Advanced Small Modular Nuclear Reactors",
    "type": "News",
    "eraSpan": "2025-2030 (SMR Deployment Arc)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "NRC streamlining licensing permits for factory-built small modular reactors delivering clean industrial heat and electricity.",
    "pole1": "1 = Rigorous Independent Safety, Meltdown, and Radioactive Waste Oversight Before Mass SMR Deployment",
    "pole10": "10 = Unleash Private Nuclear Innovation and Lead Global Exports of Next-Generation Zero-Carbon Reactors",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_ai_copyright_training_data_fair_use",
    "name": "AI Generative Model Training Data & Copyright Fair Use Doctrine",
    "type": "News",
    "eraSpan": "2024-2028 (AI Intellectual Property Wars)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Determining whether training frontier LLMs on copyrighted books, journalism, and artistic works constitutes fair use or infringement.",
    "pole1": "1 = Require Mandatory Licensing Fees and Explicit Consent for Authors, Artists, and Media Creators",
    "pole10": "10 = Protect Fair Use Training to Keep American AI Technology Unrivaled Against Unconstrained Foreign Rivals",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 5,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_commercial_real_estate_bank_defaults",
    "name": "Commercial Real Estate Regional Bank Distressed Asset Refinancing",
    "type": "News",
    "eraSpan": "2024-2027 (CRE Loan Maturity Wall)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Hundreds of billions in office building commercial mortgages maturing under high interest rates, threatening regional bank solvency.",
    "pole1": "1 = No Bailouts for Speculative Real Estate Vultures / Convert Empty Office Towers into Affordable Public Housing",
    "pole10": "10 = Provide Temporary Regulatory Capital Flexibility for Community Banks to Avert Credit Contagion",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_mass_deportation_facility_expansion",
    "name": "Federal Funding Showdown Over Multi-Billion-Dollar Migrant Detention Centers",
    "type": "News",
    "eraSpan": "2025-2027 (Deportation Infrastructure Battles)",
    "domain": "Immigration & Border",
    "tier": 2,
    "debate": "Congressional battles over appropriating tens of billions for mass detention staging facilities and chartered deportation flights.",
    "pole1": "1 = Defund Inhumane Detention Camps and Protect Due Process and Legal Asylum Representation",
    "pole10": "10 = Fully Fund Staging Facilities and Aviation Resources to Restore the Rule of Law and Sovereign Borders",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 4,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_ukraine_peace_settlement_territorial_lines",
    "name": "Negotiated Ceasefire and Territorial Demarcation in the Russo-Ukrainian War",
    "type": "News",
    "eraSpan": "2025-2027 (Ukraine Peace Process)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Debating international security guarantees, demilitarized zones, and territorial concessions along current battle lines in Ukraine.",
    "pole1": "1 = Ensure Ironclad Transatlantic Security Guarantees and NATO Path for Free Ukraine / War Crimes Accountability",
    "pole10": "10 = Prioritize Immediate Peace and Ceasefire to End the Slaughter and Stop the Risk of Nuclear Escalation",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 4,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_epa_forever_chemicals_pfas_superfund",
    "name": "EPA Superfund Hazardous Substance Designation for PFOA & PFOS",
    "type": "News",
    "eraSpan": "2024-2028 (PFAS Remediation Arc)",
    "domain": "Energy & Climate",
    "tier": 2,
    "debate": "Classifying toxic 'forever chemicals' as Superfund hazardous substances, triggering billions in municipal water filtration liabilities.",
    "pole1": "1 = Hold Chemical Polluters Strictly Accountable and Fund Universal Clean Water Filtration for All Communities",
    "pole10": "10 = Provide Water Utility and Municipal Exemptions to Prevent Spiking Local Water Bills and Endless Lawsuits",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_quantum_computing_export_blockade",
    "name": "National Security Export Controls on Advanced Quantum Computing Tooling",
    "type": "News",
    "eraSpan": "2025-2030 (Quantum Tech Race)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Restricting export of cryogenic dilution refrigerators and quantum error-correction hardware to hostile foreign adversaries.",
    "pole1": "1 = Protect American Strategic Supremacy in Quantum Cryptography and National Security Intelligence",
    "pole10": "10 = Multilateral Alliance Coordination to Prevent Unintended Chilling of Global Scientific Academic Research",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_synthetic_biology_biodefense_guardrails",
    "name": "Mandatory DNA Synthesis Screening Standards to Prevent Engineered Pathogens",
    "type": "News",
    "eraSpan": "2024-2028 (Biosecurity Governance)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Requiring commercial gene synthesis providers to verify customer identities and screen orders against dangerous biological toxins.",
    "pole1": "1 = Enforce Mandatory Comprehensive Biosecurity Screening to Avert Accidental or Deliberate Bio-Terror Disasters",
    "pole10": "10 = Light-Touch Voluntary Standards That Prevent Chilling Rapid Biomedical and Therapeutic Discoveries",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 5,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_federal_reserve_digital_currency_ban",
    "name": "Statutory Prohibition on Federal Reserve Central Bank Digital Currency (CBDC)",
    "type": "News",
    "eraSpan": "2024-2027 (Anti-CBDC Legislation)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Passing legislation banning the Federal Reserve from developing or deploying a retail digital dollar to protect financial privacy.",
    "pole1": "1 = Allow Fed to Research Digital Dollar to Maintain Global Reserve Currency Preeminence and Faster Payments",
    "pole10": "10 = Ban CBDCs Forever to Stop Authoritarian Government Surveillance and Control of Private Bank Accounts",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_clean_energy_interconnection_queue_overhaul",
    "name": "FERC Order 2023 Implementation & Fast-Tracking Renewable Grid Interconnections",
    "type": "News",
    "eraSpan": "2024-2028 (Grid Transmission Reform)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Overhauling regional grid operator interconnection queues where 2,000+ GW of clean energy projects sit stalled waiting for lines.",
    "pole1": "1 = Federal Preemption Authority for High-Voltage Interstate Transmission Lines to Unlock Clean Power",
    "pole10": "10 = Respect State Siting Rights / Ensure Reliable Baseload Generation Is Not Sacrificed for Intermittent Power",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_student_loan_default_rehabilitation_cliff",
    "name": "Resumption of Negative Credit Reporting for Delinquent Student Loan Borrowers",
    "type": "News",
    "eraSpan": "2024-2026 (Post-On-Ramp Default Reality)",
    "domain": "Education",
    "tier": 2,
    "debate": "Expiration of the 12-month post-pandemic grace period exposing millions of delinquent student loan borrowers to collection.",
    "pole1": "1 = Pass Automatic Universal Income-Driven Relief and Expand Public Service Loan Forgiveness Without Delays",
    "pole10": "10 = Require Borrowers to Honor Their Signed Contracts / End Lawless Executive Debt Cancellation Schemes",
    "stances": {
      "dem": 2,
      "gop": 10,
      "lib": 10,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_autonomous_vehicle_trucking_standards",
    "name": "DOT Federal Safety Standards for Driverless Commercial Heavy Freight Trucks",
    "type": "News",
    "eraSpan": "2025-2028 (Autonomous Freight Regulation)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Promulgating federal preemption safety standards allowing commercial driverless Class-8 freight trucks on interstate highways.",
    "pole1": "1 = Mandate Human Safety Drivers in All Freight Cabs / Protect 3 Million Family-Sustaining Trucking Careers",
    "pole10": "10 = Accelerate Autonomous Freight Deployment to Slash Highway Fatalities, Lower Shipping Costs, and End Supply Bottlenecks",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_child_care_cliff_stabilization_grants",
    "name": "Permanent Federal Funding Replacement for Expired Child Care Stabilization Grants",
    "type": "News",
    "eraSpan": "2024-2026 (Child Care Supply Crisis)",
    "domain": "Education",
    "tier": 2,
    "debate": "Addressing thousands of daycares closing nationwide following the expiration of pandemic relief funding.",
    "pole1": "1 = Universal Federal Childcare Capped at 7% of Family Income and Living Wages for Early Educators",
    "pole10": "10 = Reject Costly Federal Childcare Bureaucracy / Expand Family Child Care Tax Credits and Local Deregulation",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_space_traffic_management_orbital_debris",
    "name": "FAA Office of Commercial Space & Active Orbital Space Debris Removal",
    "type": "News",
    "eraSpan": "2025-2030 (Orbital Congestion Management)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Establishing unified civilian space traffic control as mega-constellations push active orbital satellites past 50,000.",
    "pole1": "1 = Enforce Stringent Global Space Debris Disposal Rules and Fund Active Remediation Technologies",
    "pole10": "10 = Ensure Streamlined Regulatory Permitting so American Constellations Maintain Dominance Over China",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_right_to_repair_agricultural_equipment",
    "name": "Federal Mandatory Right-to-Repair Legislation for Farm Tractors & Tech",
    "type": "News",
    "eraSpan": "2024-2027 (Agricultural Right-to-Repair)",
    "domain": "Agriculture & Food",
    "tier": 3,
    "debate": "Requiring manufacturers like John Deere to provide farmers and independent mechanics diagnostic software and repair codes.",
    "pole1": "1 = Enact Comprehensive Federal Right-to-Repair to Break Corporate Monopolies Over Farmers and Consumers",
    "pole10": "10 = Protect Proprietary Software Intellectual Property and Prevent Tampering with EPA Emissions Equipment",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 3,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_social_security_retirement_age_reform",
    "name": "Proposals to Gradually Raise the Full Retirement Age from 67 to 69",
    "type": "Ideological",
    "eraSpan": "1983-2035 (Retirement Age Debates)",
    "domain": "Labor & Welfare",
    "tier": 2,
    "debate": "Debating whether to index the normal retirement age to life expectancy to preserve Social Security trust fund solvency.",
    "pole1": "1 = Never Raise the Retirement Age / Force Millionaires and Billionaires to Pay Full Payroll Taxes",
    "pole10": "10 = Gradually Adjust Retirement Age for Younger Workers to Account for Substantial Increases in Longevity",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_fentanyl_precursor_chemical_sanctions",
    "name": "Targeted Secondary Financial Sanctions on Chinese Fentanyl Precursor Firms",
    "type": "News",
    "eraSpan": "2024-2027 (Fentanyl Interdiction Arc)",
    "domain": "Foreign Policy & Defense",
    "tier": 2,
    "debate": "Blacklisting Chinese chemical companies synthesizing synthetic opioid precursors exported to Mexican cartels.",
    "pole1": "1 = Aggressive Interdiction Paired with Comprehensive Domestic Harm Reduction, Narcan, and Treatment",
    "pole10": "10 = Maximum Sanctions, Naval Interdiction, and Designating Mexican Cartels as Foreign Terrorist Organizations",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 4,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_usmca_six_year_joint_review",
    "name": "2026 Mandatory Six-Year Joint Review and Sunset Assessment of the USMCA",
    "type": "News",
    "eraSpan": "2026 (USMCA Six-Year Review)",
    "domain": "Trade & Globalism",
    "tier": 2,
    "debate": "Conducting mandatory formal review to determine whether to extend the trilateral North American trade pact for another 16 years.",
    "pole1": "1 = Strengthen Binding Labor and Environmental Enforcements to Prevent Mexican Backsliding",
    "pole10": "10 = Demand Tougher Rules of Origin to Block Chinese EV Companies from Using Mexico as a Backdoor into U.S.",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 7,
      "grn": 1,
      "con": 5,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_medicare_part_d_two_thousand_cap_rollout",
    "name": "Full Implementation of the $2,000 Out-of-Pocket Prescription Cap for Seniors",
    "type": "News",
    "eraSpan": "2025-2027 (IRA Drug Cap Benefits)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Evaluating the first full year of the IRA's $2,000 maximum out-of-pocket prescription cap for all Medicare Part D enrollees.",
    "pole1": "1 = Historic Triumph Lowering Prescription Drug Prices for Millions of Seniors / Expand Negotiation to All Drugs",
    "pole10": "10 = Address Rising Part D Premium Subsidies and Unintended Stifling of Biomedical Life-Saving Research",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_commercial_bank_basel_iii_endgame",
    "name": "Final Implementation of Basel III Endgame Capital Requirements for Big Banks",
    "type": "News",
    "eraSpan": "2024-2027 (Bank Capital Mandates)",
    "domain": "Economy & Taxation",
    "tier": 3,
    "debate": "Federal Reserve scaling back initial 19% capital hike proposals to roughly 9% following massive Wall Street pushback.",
    "pole1": "1 = Maintain Strict Capital Buffers to Ensure Giant Banks Can Absorb Catastrophic Financial Shocks Without Bailouts",
    "pole10": "10 = Scale Back Unnecessary Capital Hikes That Restrict Small Business Lending and Weaken American Competitiveness",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_geothermal_next_gen_clean_energy",
    "name": "Enhanced Geothermal Systems (EGS) Hydraulic Stimulation on Federal Lands",
    "type": "News",
    "eraSpan": "2024-2029 (Next-Gen Clean Baseload)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Applying horizontal drilling techniques from shale oil to tap deep subterranean geothermal heat for continuous clean electricity.",
    "pole1": "1 = Support Breakthrough Carbon-Free Baseload Energy While Ensuring Rigorous Groundwater Safety Reviews",
    "pole10": "10 = Expedite NEPA Categorical Exclusions for Advanced Geothermal on Federal Lands in Nevada and Utah",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_digital_asset_market_structure_fit21",
    "name": "Financial Innovation and Technology for the 21st Century Act (FIT21)",
    "type": "News",
    "eraSpan": "2024-2027 (Comprehensive Crypto Law)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Establishing a clear regulatory dividing line between CFTC commodity oversight and SEC securities jurisdiction for digital assets.",
    "pole1": "1 = Prevent Risky Crypto Wild West Speculation from Undermining Main Street Consumer Financial Protections",
    "pole10": "10 = Provide Clear, Commonsense Regulatory Certainty to Keep Web3 and Blockchain Innovation in America",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_nuclear_fusion_commercial_pilot_plants",
    "name": "Public-Private Milestone Partnerships for Commercial Fusion Energy Pilots",
    "type": "News",
    "eraSpan": "2024-2030 (Fusion Commercialization)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Department of Energy milestone-based contracts funding private fusion startups aiming to supply pilot power to the grid by 2030.",
    "pole1": "1 = Accelerate Public Funding for the Holy Grail of Clean, Abundant, Zero-Carbon Fusion Energy",
    "pole10": "10 = Leverage Private Capital and Ensure Free-Market Competition Drives Fusion Innovation Forward",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_pfas_drinking_water_maximum_contaminant",
    "name": "Compliance Deadlines for First Federal Enforceable PFAS Drinking Water Standards",
    "type": "News",
    "eraSpan": "2024-2029 (Municipal PFAS Deadlines)",
    "domain": "Healthcare",
    "tier": 3,
    "debate": "Municipal water utilities implementing advanced granular activated carbon systems to meet strict 4 parts-per-trillion limits.",
    "pole1": "1 = Pure Drinking Water Free from Carcinogenic Chemicals Is an Inviolable Human Right for Every American",
    "pole10": "10 = Provide Robust Federal Infrastructure Grants to Prevent Small Rural Towns from Facing Water Insolvent Utility Rates",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_deepfake_election_disinformation_penalties",
    "name": "Federal Criminalization of Malicious AI-Generated Election Deepfakes",
    "type": "News",
    "eraSpan": "2024-2028 (AI Election Integrity)",
    "domain": "Governance & Judiciary",
    "tier": 2,
    "debate": "Banning deceptive generative AI voice clones and video deepfakes depicting candidates within 90 days of an election.",
    "pole1": "1 = Enact Enforceable Federal Protections Against Deceptive High-Tech Election Sabotage and Impersonation",
    "pole10": "10 = Protect Robust Political Satire and Guard Against Overly Broad Statutes That Infringe on First Amendment Free Speech",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 2,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_critical_habitat_endangered_species_reforms",
    "name": "Department of the Interior Modernization of Endangered Species Act Rules",
    "type": "Ideological",
    "eraSpan": "1973-2030 (Conservation vs Development)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Reinstating blanket 4(d) protections for threatened species versus granting state wildlife agencies primacy.",
    "pole1": "1 = Science-Based Biodiversity Protection to Halt the Sixth Mass Extinction Across American Ecosystems",
    "pole10": "10 = Modernize Outdated ESA Rules That Paralyze Renewable Energy Transmission, Mining, and Timber Jobs",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_national_parks_overcrowding_reservation",
    "name": "Timed-Entry Reservation Systems and Deferred Maintenance Backlog",
    "type": "News",
    "eraSpan": "2024-2028 (Public Lands Management)",
    "domain": "Energy & Climate",
    "tier": 4,
    "debate": "Managing record visitor crowds at Zion, Rocky Mountain, and Yosemite with mandatory digital reservations and fee increases.",
    "pole1": "1 = Protect Pristine Public Lands and Wilderness from Severe Overcrowding and Ecological Degradation",
    "pole10": "10 = Keep National Parks Freely Accessible to Every American Taxpayer Without Opaque Reservation Bureaucracy",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 6,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_airline_passenger_rights_automatic_refunds",
    "name": "DOT Mandatory Automatic Cash Refunds for Canceled & Delayed Flights",
    "type": "News",
    "eraSpan": "2024-2027 (Aviation Consumer Protections)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Enforcing federal rules requiring airlines to provide prompt automatic cash refunds for significant delays without voucher runarounds.",
    "pole1": "1 = Hold Megacarrier Airlines Accountable and Protect Hardworking Travel Consumers from Deceptive Practices",
    "pole10": "10 = Avoid Heavy-Handed Price and Operational Mandates That Force Airlines to Increase Base Ticket Fares",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_credit_card_eight_dollar_late_fee_rule",
    "name": "CFPB Final Rule Capping Credit Card Late Fees at $8",
    "type": "News",
    "eraSpan": "2024-2026 (Junk Fee Regulatory War)",
    "domain": "Economy & Taxation",
    "tier": 2,
    "debate": "Slashing average credit card late fees from $32 down to $8, challenging billions in annual commercial bank penalty revenues.",
    "pole1": "1 = Eliminate Exploitative Corporate Junk Fees Siphoning $14 Billion Annually from Stressed Working Families",
    "pole10": "10 = Oppose Government Price Controls That Force Responsible Cardholders to Subsidize Chronic Late Payers",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 9,
      "grn": 1,
      "con": 9,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_interstate_highway_toll_digital_congestion",
    "name": "All-Electronic Open Road Tolling & Dynamic Congestion Pricing",
    "type": "News",
    "eraSpan": "2024-2028 (Transportation Funding)",
    "domain": "Technology & Infrastructure",
    "tier": 4,
    "debate": "Expanding dynamic variable toll lanes and express lanes to fund highway reconstruction as fuel tax revenues decline.",
    "pole1": "1 = Invest in World-Class Public Transit and Ensure Equitable Transportation Without Regressive Lexus Lanes",
    "pole10": "10 = Embrace Free-Market Toll Concessions and Dynamic Pricing That Efficiently Eliminates Chronic Traffic Gridlock",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_us_postal_service_delivery_network_consolidation",
    "name": "USPS 'Delivering for America' 10-Year Network Modernization Plan",
    "type": "News",
    "eraSpan": "2024-2028 (Postal Network Overhaul)",
    "domain": "Governance & Judiciary",
    "tier": 3,
    "debate": "Consolidating mail sorting operations into massive Regional Processing Centers while rural post office hours are shifted.",
    "pole1": "1 = Halt Disruptive Postal Consolidations Causing Severe Delivery Delays for Prescription Medications and Local News",
    "pole10": "10 = Support Comprehensive Network Overhaul Essential to Achieve Fiscally Sustainable Modern Package Logistics",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_drone_delivery_commercial_bvlos_faa",
    "name": "FAA Part 108 Rules for Commercial Drone Beyond-Visual-Line-of-Sight Flights",
    "type": "News",
    "eraSpan": "2025-2029 (Commercial Drone Logistics)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Finalizing national airspace regulations enabling widespread autonomous drone delivery of retail packages and urgent medical supplies.",
    "pole1": "1 = Strict Privacy, Noise, and Local Community Safety Protections Before Allowing Drones Over Residential Neighborhoods",
    "pole10": "10 = Fast-Track Commercial Drone Airspace Rules to Keep American Autonomous Aviation Ahead of Global Competitors",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_lithium_brine_extraction_salton_sea",
    "name": "Direct Lithium Extraction (DLE) in California's Imperial Valley ('Lithium Valley')",
    "type": "News",
    "eraSpan": "2024-2028 (Domestic Battery Supply Chain)",
    "domain": "Energy & Climate",
    "tier": 3,
    "debate": "Tapping geothermal brine deposits to produce domestic battery-grade lithium for electric vehicles with minimal water footprint.",
    "pole1": "1 = Ensure Clean Environmental Extraction That Generates Good Local Union Jobs and Direct Community Royalties",
    "pole10": "10 = Expedite Permits and Commercialize American Lithium Valley to Break Total Dependence on Chinese Supply Chains",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_high_speed_rail_brightline_west_la_vegas",
    "name": "Construction Progress on Brightline West High-Speed Rail to Las Vegas",
    "type": "News",
    "eraSpan": "2024-2028 (High-Speed Rail Demonstrator)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Building 218-mile all-electric high-speed bullet train along I-15 connecting Southern California to Las Vegas by 2028.",
    "pole1": "1 = Landmark Example of World-Class Green High-Speed Rail Reducing Highway Congestion and Emissions",
    "pole10": "10 = Support Successful Private-Public Infrastructure Models While Avoiding Runaway Government-Run Cost Boondoggles",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_mental_health_parity_rules_insurance",
    "name": "Final Federal Enforcement Rules for Mental Health and Addiction Parity",
    "type": "News",
    "eraSpan": "2024-2027 (Mental Health Parity Enactment)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Requiring health insurers to prove non-quantitative treatment limits on mental health are no more restrictive than physical care.",
    "pole1": "1 = End Insurance Discrimination and Guarantee Equal, Affordable Coverage for Mental Health and Addiction",
    "pole10": "10 = Prevent Complex Federal Mandates That Drive Up Health Insurance Premiums for Small Business Employers",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_broadband_equity_access_bead_deployments",
    "name": "States Breaking Ground on $42.5 Billion BEAD Rural Broadband Projects",
    "type": "News",
    "eraSpan": "2024-2028 (BEAD Rural Fiber Rollout)",
    "domain": "Technology & Infrastructure",
    "tier": 2,
    "debate": "Connecting unserved rural homes and tribal communities with high-speed fiber under the 2021 Infrastructure Law.",
    "pole1": "1 = Close the Digital Divide Once and for All by Delivering Reliable High-Speed Fiber to Every Corner of America",
    "pole10": "10 = Eliminate Wasteful 'Buy America' and Prevailing Wage Mandates That Delay Projects and Inflate Costs",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 9,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_meatpacking_industry_consolidation_scrutiny",
    "name": "DOJ & USDA Enforcement Against Anti-Competitive Cattle Market Collusion",
    "type": "News",
    "eraSpan": "2024-2028 (Agribusiness Antitrust Enforcement)",
    "domain": "Agriculture & Food",
    "tier": 3,
    "debate": "Enforcing Packers and Stockyards Act rules to protect independent cattle ranchers from the 'Big Four' meatpacking cartel.",
    "pole1": "1 = Break Up Monopoly Agribusiness Cartels Squeezing Family Farmers and Artificially Inflating Beef Prices",
    "pole10": "10 = Protect Efficient Meat Supply Chains and Oppose Burdensome Bureaucratic Meddling in Cattle Contracting",
    "stances": {
      "dem": 2,
      "gop": 7,
      "lib": 7,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_foreign_ownership_agricultural_land",
    "name": "State and Federal Bans on Chinese Ownership of U.S. Farmland",
    "type": "News",
    "eraSpan": "2023-2027 (Agricultural National Security)",
    "domain": "Agriculture & Food",
    "tier": 2,
    "debate": "Restricting entities connected to foreign adversaries from purchasing agricultural land near military installations.",
    "pole1": "1 = Protect Vital Food Security and Sovereign Farmland Through Carefully Targeted National Security Reviews",
    "pole10": "10 = Ban All Foreign Adversary Farmland Ownership Nationwide to Protect America's Food Supply and Military Bases",
    "stances": {
      "dem": 2,
      "gop": 9,
      "lib": 5,
      "grn": 1,
      "con": 10,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_space_station_deorbit_contract_iss",
    "name": "NASA Contract for Commercial Deorbit Vehicle to Safely Retire ISS by 2030",
    "type": "News",
    "eraSpan": "2024-2030 (ISS Retirement Phase)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Awarding contract to SpaceX to build a high-thrust deorbit spacecraft to guide the 400-ton station into Point Nemo.",
    "pole1": "1 = Safely Retire the Legendary Station and Support Next-Generation Commercial Low-Earth Orbit Platforms",
    "pole10": "10 = Maintain Continuous American Manned Presence in Orbit to Never Cede Space Leadership to China's Tiangong",
    "stances": {
      "dem": 3,
      "gop": 8,
      "lib": 7,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_carbon_border_adjustment_mechanism_cbam",
    "name": "Bipartisan Proposals for a U.S. Carbon Border Adjustment Tariff",
    "type": "Ideological",
    "eraSpan": "2024-2030 (Carbon Border Adjustment Arc)",
    "domain": "Trade & Globalism",
    "tier": 2,
    "debate": "Levying carbon intensity tariffs on imported steel, aluminum, and cement from high-polluting countries like China.",
    "pole1": "1 = Level the Global Playing Field for Clean American Industry and Penalize Heavy Foreign Carbon Polluters",
    "pole10": "10 = Reject Backdoor Carbon Taxes That Undermine Domestic Energy Independence and Create Regulatory Nightmares",
    "stances": {
      "dem": 3,
      "gop": 7,
      "lib": 8,
      "grn": 1,
      "con": 6,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_veterans_pact_act_burn_pits_expansion",
    "name": "Full Enactment & Screening for 23 Toxic Burn Pit Presumptive Conditions",
    "type": "News",
    "eraSpan": "2022-2027 (PACT Act Implementation)",
    "domain": "Healthcare",
    "tier": 2,
    "debate": "Delivering comprehensive medical care and disability compensation to over 1 million toxic-exposed post-9/11 veterans.",
    "pole1": "1 = Fulfill Our Sacred Moral Obligation to Care for Every Brave Veteran Harmed by Toxic War Exposure",
    "pole10": "10 = Fully Fund Veteran Care While Guarding Against Wasteful Processing Backlogs and Inefficient Bureaucracy",
    "stances": {
      "dem": 2,
      "gop": 8,
      "lib": 6,
      "grn": 1,
      "con": 7,
      "soc": 1
    }
  },
  {
    "cycle": 2026,
    "id": "2026_space_resources_artemis_accords_mining",
    "name": "Artemis Accords Lunar Resource Extraction & Property Rights Framework",
    "type": "News",
    "eraSpan": "2024-2030 (Lunar Mining Property Rights)",
    "domain": "Technology & Infrastructure",
    "tier": 3,
    "debate": "Establishing bilateral norms recognizing the right of commercial space companies to extract and own lunar water ice and regolith.",
    "pole1": "1 = Ensure Peaceful, Multilateral, and Sustainable Exploration of Outer Space for the Benefit of All Humanity",
    "pole10": "10 = Protect Sovereign American Commercial Property Rights on the Moon and Secure Vital Lunar Strategic Locations",
    "stances": {
      "dem": 3,
      "gop": 9,
      "lib": 8,
      "grn": 1,
      "con": 8,
      "soc": 1
    }
  }
];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HISTORICAL_ISSUES;
  }
  if (typeof window !== 'undefined') {
    if (!window.PartyChairData) window.PartyChairData = {};
    window.PartyChairData.HISTORICAL_ISSUES = HISTORICAL_ISSUES;
  }
})();
