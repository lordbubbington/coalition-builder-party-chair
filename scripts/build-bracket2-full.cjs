/**
 * scripts/build-bracket2-full.cjs
 * Generates full issue array for Bracket 2 (2008, 2010, 2012, 2014)
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
// 2008 (52 Issues)
// =========================================================================
add(2008, "2008_tarp_wall_street_bailout", "Emergency Economic Stabilization Act ($700B TARP Bailout)", "News", "2008-2010 (Financial Crisis Arc)", "Economy & Taxation", 1,
  "Authorizing the Treasury Department to purchase up to $700 billion in troubled mortgage-backed assets and inject capital into failing banks.",
  "1 = Reject Wall Street Bailout / Direct Aid to Foreclosed Homeowners & Nationalize Banks", "10 = Oppose Socialism / Reject Taxpayer Capital Injections into Private Institutions", 4, 6, 10, 1, 9, 1);

add(2008, "2008_subprime_mortgage_crisis", "Subprime Foreclosure Crisis & Foreclosure Prevention", "News", "2007-2012 (Great Recession Housing Shock)", "Economy & Taxation", 1,
  "Addressing millions of subprime adjustable-rate mortgage defaults, collapsing home values, and mortgage-backed securities insolvency.",
  "1 = Mandatory Principal Write-Downs / Federal Moratorium on Foreclosures", "10 = Free Market Liquidation / Reject Moral Hazard and Subsidies for Bad Borrowers", 2, 8, 10, 1, 8, 1);

add(2008, "2008_iraq_withdrawal_timetable_sofa", "Iraq War Withdrawal Timetable & U.S.-Iraq SOFA Agreement", "News", "2007-2011 (Iraq Exit Phase)", "Foreign Policy & Defense", 1,
  "Negotiating a bilateral Status of Forces Agreement (SOFA) mandating the full withdrawal of U.S. combat troops by the end of 2011.",
  "1 = Set Strict 16-Month Troop Withdrawal Timetable / End the Occupation", "10 = Maintain Conditions-Based Presence / Victory Secured by Surge", 2, 9, 2, 1, 8, 1);

add(2008, "2008_gasoline_prices_four_dollars", "Gasoline Prices Reaching $4.11/Gallon & 'Drill, Baby, Drill'", "News", "2008 (Summer Energy Spike)", "Energy & Climate", 1,
  "Reversing federal moratoria on Outer Continental Shelf (OCS) offshore drilling in response to record $4/gallon gasoline.",
  "1 = Windfall Profits Tax on Big Oil / Invest in Renewable Energy Transit", "10 = Lift All Offshore and Arctic Drilling Bans / 'Drill, Baby, Drill'", 2, 10, 9, 1, 10, 1);

add(2008, "2008_auto_industry_bankruptcy_bailout", "Emergency Bridge Loans & Bailout for Detroit Big Three Automakers", "News", "2008-2010 (Auto Restructuring Arc)", "Economy & Taxation", 2,
  "Providing emergency federal financing to General Motors and Chrysler to avert catastrophic liquidation bankruptcy.",
  "1 = Fully Back Auto Workers / Condition Aid on Green Fleet Modernization", "10 = Let Insolvent Automakers Enter Structured Chapter 11 Bankruptcy Without Taxpayer Cash", 3, 8, 10, 2, 9, 1);

add(2008, "2008_california_proposition_8", "California Proposition 8 (Constitutional Ban on Same-Sex Marriage)", "News", "2008-2013 (Prop 8 Battle)", "Civil Rights & Social Issues", 1,
  "Amending the California Constitution to overturn the state supreme court ruling and restrict marriage strictly to heterosexual couples.",
  "1 = Vote No / Protect Equal Marriage Rights for Same-Sex Couples", "10 = Vote Yes / Protect Traditional Marriage in the State Constitution", 3, 10, 3, 1, 10, 1);

add(2008, "2008_universal_healthcare_mandate_debate", "Healthcare Reform: Universal Insurance Mandate vs. Free Market Tax Credits", "Ideological", "1993-2026 (Healthcare Reform Arc)", "Healthcare", 2,
  "Mandating universal health coverage with employer penalties and public subsidies versus private high-deductible tax credits.",
  "1 = Medicare for All Single-Payer System / Public Option", "10 = Pure Free Market Health Reform / Deregulate Interstate Insurance", 3, 9, 10, 1, 9, 1);

add(2008, "2008_dc_v_heller_second_amendment", "Supreme Court Ruling on Individual Gun Rights (District of Columbia v. Heller)", "News", "2008 (Heller Landmark Ruling)", "Civil Rights & Social Issues", 2,
  "Supreme Court holding that the Second Amendment protects an individual's right to possess a firearm unconnected to service in a militia.",
  "1 = Uphold City Handgun Bans & Strong Municipal Gun Safety Laws", "10 = Affirm Fundamental Individual Right to Keep and Bear Arms for Self-Defense", 2, 10, 10, 2, 10, 2);

add(2008, "2008_guantanamo_boumediene_ruling", "Habeas Corpus Rights for Detainees (Boumediene v. Bush) & Camp Closure", "News", "2008-2010 (Boumediene & Guantanamo Closure Order)", "Foreign Policy & Defense", 2,
  "Supreme Court ruling granting Guantanamo detainees constitutional habeas corpus rights and Obama's pledge to close the facility.",
  "1 = Close Guantanamo Bay Within One Year / Try Suspects in Civilian Courts", "10 = Keep Guantanamo Open / Military Tribunals for Enemy Combatants", 2, 9, 2, 1, 9, 1);

add(2008, "2008_fannie_freddie_conservatorship", "Federal Takeover & Conservatorship of Fannie Mae and Freddie Mac", "News", "2008 (GSE Nationalization)", "Economy & Taxation", 2,
  "Placing mortgage giants Fannie Mae and Freddie Mac into federal FHFA conservatorship and pledging up to $200B in taxpayer capital.",
  "1 = Public Utility Conversion / Direct Low-Income Housing Guarantees", "10 = Full Privatization or Liquidation / End Implicit Government Guarantees", 3, 7, 10, 1, 8, 1);

add(2008, "2008_sarah_palin_populist_conservatism", "Sarah Palin Vice Presidential Pick & Populist Grassroots Resurgence", "News", "2008 (Tea Party Precursor)", "Governance & Judiciary", 2,
  "Selecting Alaska Governor Sarah Palin to energize the evangelical base and blue-collar social conservatives.",
  "1 = Reject Unqualified Extremism and Anti-Intellectual Populism", "10 = Champion Grassroots Outsider Patriotism and Working-Class Reform", 2, 9, 6, 2, 10, 1);

add(2008, "2008_afghanistan_troop_surge_escalation", "Strategic Pivot & Troop Surge to Afghanistan ('The Central Front')", "News", "2008-2012 (Afghan Surge Phase)", "Foreign Policy & Defense", 2,
  "Shifting U.S. military resources from Iraq to escalate counterinsurgency troop levels against the Taliban in Afghanistan.",
  "1 = End Military Interventions / Negotiate Diplomatic Settlement", "10 = Fully Resource Counterinsurgency Campaign to Defeat Al-Qaeda and Taliban", 4, 9, 3, 1, 7, 1);

add(2008, "2008_russian_invasion_of_georgia", "Russian Military Invasion of Georgia (South Ossetia/Abkhazia)", "News", "2008 (Georgia Conflict)", "Foreign Policy & Defense", 3,
  "Responding to Russian tanks invading Georgia, halting Tbilisi's NATO Membership Action Plan (MAP).",
  "1 = De-escalate via Multilateral Diplomacy and OSCE Observers", "10 = Fast-Track NATO Accession for Georgia and Ukraine / Re-arm Tbilisi", 3, 9, 4, 1, 8, 1);

add(2008, "2008_bear_stearns_aig_bailout", "Federal Reserve Emergency Financing for Bear Stearns & AIG", "News", "2008 (Emergency Fed Credit Facilities)", "Economy & Taxation", 3,
  "Federal Reserve providing a $29B Maiden Lane backstop for JPMorgan's Bear Stearns takeover and an $85B loan to rescue AIG.",
  "1 = Enforce Glass-Steagall / Break Up Too-Big-To-Fail Conglomerates", "10 = Abolish Federal Reserve Lender-of-Last-Resort Authority", 3, 7, 10, 1, 9, 1);

add(2008, "2008_windfall_profits_tax_big_oil", "Federal Windfall Profits Tax on Record Oil Company Earnings", "News", "2008 (Summer Gas Price Battle)", "Economy & Taxation", 3,
  "Levying a windfall excise tax on major oil corporations to fund $1,000 consumer energy relief rebate checks.",
  "1 = Tax Excessive Oil Profits to Fund Clean Energy Rebates", "10 = Oppose Punitive Capital Taxes That Discourage Domestic Exploration", 2, 9, 10, 1, 9, 1);

add(2008, "2008_colorado_amendment_48_personhood", "Colorado Amendment 48 (Constitutional Fetal Personhood from Fertilization)", "News", "2008 (First Personhood Ballot Measure)", "Civil Rights & Social Issues", 3,
  "Defining the term 'person' in the Colorado Constitution to include any human being from the moment of fertilization.",
  "1 = Vote No / Protect Contraception, IVF, and Abortion Access", "10 = Vote Yes / Guarantee Full Constitutional Rights from Conception", 2, 9, 3, 1, 10, 1);

add(2008, "2008_washington_i1000_assisted_suicide", "Washington Initiative 1000 (Death with Dignity Act)", "News", "2008 (Assisted Dying Expansion)", "Healthcare", 4,
  "Permitting terminally ill, mentally competent adult state residents to request and self-administer lethal medication.",
  "1 = Respect Patient Autonomy, Compassion, and Palliative Choice", "10 = Oppose Assisted Suicide / Protect Sanctity of Life and Vulnerable Elders", 3, 8, 3, 2, 10, 1);

add(2008, "2008_california_prop_1a_high_speed_rail", "California Proposition 1A ($9.95 Billion High-Speed Rail Bond)", "News", "2008 (High-Speed Rail Genesis)", "Technology & Infrastructure", 4,
  "Authorizing $9.95 billion in state general obligation bonds to initiate construction of an 800-mile 220mph bullet train.",
  "1 = Invest in World-Class Zero-Emission High-Speed Transit", "10 = Oppose Costly Boondoggle Bond Debt and Inevitable Cost Overruns", 2, 8, 9, 1, 9, 1);

add(2008, "2008_employee_free_choice_act_card_check", "Employee Free Choice Act (Card Check Union Certification)", "Ideological", "2007-2010 (Labor Organizing Arc)", "Labor & Welfare", 3,
  "Allowing workers to form a union once a majority sign authorization cards without requiring secret-ballot elections.",
  "1 = Enact Card Check to Rebuild Union Density and Worker Power", "10 = Protect Secret-Ballot Elections / Resist Union Boss Coercion", 2, 9, 10, 1, 9, 1);

add(2008, "2008_fisa_amendments_act_telecom_immunity", "FISA Amendments Act of 2008 & Telecom Retroactive Immunity", "News", "2008 (Section 702 & Immunity)", "Civil Rights & Social Issues", 3,
  "Codifying Section 702 warrantless foreign intelligence surveillance and granting retroactive immunity to telecoms.",
  "1 = Strip Telecom Immunity / Protect Constitutional Privacy", "10 = Grant Immunity to Patriotic Companies Assisting National Security", 4, 9, 1, 1, 3, 1);

add(2008, "2008_michigan_stem_cell_proposal_2", "Michigan Proposal 2 (Overturning Ban on New Embryonic Lines)", "News", "2008 (State Stem Cell Referendum)", "Healthcare", 4,
  "Amending state constitution to allow scientists to derive new embryonic stem cell lines from discarded IVF embryos.",
  "1 = Unleash Medical Cures and Attract Biomedical Research Jobs", "10 = Protect Human Embryonic Life from Exploitation and Destruction", 2, 8, 4, 1, 10, 1);

add(2008, "2008_south_dakota_initiated_measure_11", "South Dakota Measure 11 (Second Total Abortion Ban Defeat)", "News", "2008 (Post-Referral Redraft)", "Civil Rights & Social Issues", 3,
  "Second statewide attempt to ban all abortions, this time with narrow exceptions for rape, incest, and maternal health.",
  "1 = Reject Extreme State Abortion Bans / Uphold Roe v. Wade", "10 = Enact Ban with Exceptions to Challenge Roe Directly in Federal Court", 2, 9, 4, 1, 10, 1);

add(2008, "2008_colombia_panama_korea_ftas", "Pending Bilateral Free Trade Agreements (Colombia, Panama, South Korea)", "News", "2007-2011 (Stalled FTA Package)", "Trade & Globalism", 4,
  "Delaying congressional ratification of negotiated bilateral free trade pacts over Colombian union leader assassinations.",
  "1 = Condition Trade Pacts on Verifiable Human Rights and Labor Enforcements", "10 = Immediately Ratify Stalled Trade Pacts to Open Export Markets", 3, 8, 8, 1, 4, 1);

add(2008, "2008_federal_minimum_wage_second_step", "Second Phase of Federal Minimum Wage Hike to $6.55/Hour", "News", "2007-2009 (Fair Minimum Wage Act Implementation)", "Labor & Welfare", 4,
  "Implementing the second statutory tier of the 2007 Fair Minimum Wage Act, raising the wage from $5.85 to $6.55/hr.",
  "1 = Raise Federal Wage to $10+ Living Wage / Index to Inflation", "10 = Halt Mandated Wage Hikes During Severe Economic Recession", 2, 8, 10, 1, 9, 1);

add(2008, "2008_cuba_embargo_unrestricted_family_travel", "Lifting Restrictions on Cuban-American Family Travel & Remittances", "News", "2008-2009 (Family Travel Opening)", "Foreign Policy & Defense", 5,
  "Pledging to eliminate Bush administration restrictions on family visits and cash remittances to Cuban relatives.",
  "1 = Lift Inhumane Family Travel and Remittance Limits Unconditionally", "10 = Maintain Strict Sanctions to Restrict Cash Inflows to the Castro Regime", 3, 8, 2, 1, 9, 1);

add(2008, "2008_veterans_post_911_gi_bill", "Post-9/11 Veterans Educational Assistance Act (Webb GI Bill)", "News", "2008 (New GI Bill Enactment)", "Education", 3,
  "Enacting a landmark comprehensive college tuition and living stipend benefit for military veterans who served after 9/11.",
  "1 = Provide Full In-State Public College Tuition & Housing for Post-9/11 Veterans", "10 = Balance Benefits with Retention Incentives to Prevent Military Brain Drain", 2, 7, 5, 1, 6, 1);

add(2008, "2008_clean_coal_futuregen_cancellation", "FutureGen Carbon Capture Sequestration Project Restructuring", "News", "2008 (CCS Technology Fights)", "Energy & Climate", 6,
  "Restructuring the flagship zero-emissions coal-fired power plant demonstration project in Illinois due to soaring costs.",
  "1 = Shift Funding Away from 'Clean Coal' Myths Toward Real Renewables", "10 = Fully Fund Carbon Capture to Protect Baseload Coal Power", 3, 8, 8, 1, 8, 1);

add(2008, "2008_massachusetts_decriminalization_q2", "Massachusetts Question 2 (Decriminalizing One Ounce of Marijuana)", "News", "2008 (Cannabis Decriminalization Movement)", "Civil Rights & Social Issues", 5,
  "Replacing criminal misdemeanor penalties for possessing under an ounce of cannabis with a $100 civil fine.",
  "1 = Decriminalize Marijuana to Stop Ruining Lives and Free Up Police", "10 = Oppose Decriminalization / Maintain Prohibitions to Discourage Youth Drug Use", 3, 7, 1, 1, 8, 1);

add(2008, "2008_nuclear_energy_loan_guarantees_expansion", "Expanding Title XVII Energy Policy Act Nuclear Loan Guarantees", "Ideological", "2005-2026 (Nuclear Renaissance Financing)", "Energy & Climate", 5,
  "Tripling federal loan guarantee authority for advanced commercial nuclear reactor construction to $38.5 billion.",
  "1 = Eliminate Subsidies for Nuclear Waste and Focus on Solar/Wind", "10 = Massively Expand Nuclear Baseload Power for Carbon-Free Grid", 4, 9, 7, 1, 8, 1);

add(2008, "2008_predatory_lending_consumer_financial_agency", "Creation of a Dedicated Consumer Financial Protection Agency", "News", "2008-2010 (CFPB Genesis)", "Economy & Taxation", 3,
  "Elizabeth Warren's proposal to create an independent federal agency regulating mortgages, credit cards, and auto loans.",
  "1 = Create Strong Independent Consumer Protection Agency with Enforcement Teeth", "10 = Oppose Heavy-Handed Regulatory Bureaucracy Constricting Consumer Credit", 2, 9, 9, 1, 8, 1);

add(2008, "2008_somalia_piracy_naval_interdiction", "Gulf of Aden Counter-Piracy Interdiction Task Force", "News", "2008-2012 (Somali Maritime Piracy)", "Foreign Policy & Defense", 6,
  "Deploying naval warships and maritime patrol aircraft to escort commercial cargo ships and capture Somali pirate skiffs.",
  "1 = Combine Maritime Security with Long-Term Aid to Rebuild Somali Economy", "10 = Aggressive Military Interdiction, Rules of Engagement, and Coastal Patrols", 3, 8, 4, 1, 7, 1);

add(2008, "2008_executive_privilege_muckasey_contempt", "Attorney General Mukasey Refusal to Prosecute Bolton/Miers Contempt", "News", "2008 (Executive Contempt Showdown)", "Governance & Judiciary", 6,
  "Department of Justice refusing to convene a grand jury to prosecute Harriet Miers and Josh Bolten for congressional contempt.",
  "1 = Enforce Inherent Congressional Contempt Powers Against Lawless Executive Privilege", "10 = Defend Inherent Executive Privilege for Presidential Confidential Advisers", 2, 9, 3, 1, 8, 1);

add(2008, "2008_epa_carbon_endangerment_delay", "Bush Administration Refusal to Issue Carbon Endangerment Finding", "News", "2007-2009 (Massachusetts v. EPA Backlash)", "Energy & Climate", 4,
  "EPA Administrator refusing to open an email containing staff scientists' finding that greenhouse gases endanger public health.",
  "1 = Immediately Issue Clean Air Act Endangerment Finding and Regulate Carbon", "10 = Block EPA From Regulating Carbon Dioxide Without Explicit New Laws", 2, 9, 9, 1, 9, 1);

add(2008, "2008_housing_and_economic_recovery_act_hera", "Housing and Economic Recovery Act of 2008 (HERA & Hope for Homeowners)", "News", "2008 (HERA Enactment)", "Economy & Taxation", 4,
  "Creating the FHFA regulatory agency and establishing the $300 billion FHA Hope for Homeowners refinancing initiative.",
  "1 = Strengthen Mandatory Mortgage Modifications and Support Distressed Borrowers", "10 = Limit Taxpayer Exposure / Prevent Government Micro-management of Housing", 3, 7, 9, 1, 7, 1);

add(2008, "2008_florida_amendment_2_marriage_ban", "Florida Amendment 2 (Constitutional Ban on Same-Sex Marriage)", "News", "2008 (Florida Marriage Ballot Fight)", "Civil Rights & Social Issues", 4,
  "Approving a state constitutional amendment defining marriage as only between a man and woman with 61.9% of the vote.",
  "1 = Defend Equal Civil Rights for All Florida Citizens Regardless of Orientation", "10 = Protect Traditional Marriage with Supermajority Constitutional Mandate", 3, 10, 3, 1, 10, 1);

add(2008, "2008_arizona_proposition_102_marriage", "Arizona Proposition 102 (Constitutional Defense of Marriage)", "News", "2008 (Arizona Marriage Amendment)", "Civil Rights & Social Issues", 4,
  "Voters approving a constitutional amendment stating only a union of one man and one woman shall be recognized as marriage.",
  "1 = Oppose Writing Discrimination into the Arizona Constitution", "10 = Protect Marriage as an Invaluable Foundation of Society and Family", 3, 10, 3, 1, 10, 1);

add(2008, "2008_iran_enrichment_sanctions_expansion", "UN Security Council Resolution 1803 Sanctions on Iranian Assets", "News", "2008 (Nuclear Sanctions Ramp)", "Foreign Policy & Defense", 4,
  "Tightening international financial sanctions and maritime cargo inspections on Iranian banks expanding Natanz centrifuges.",
  "1 = Direct Presidential Engagement Without Preconditions and Multilateral Diplomacy", "10 = Crippling Secondary Sanctions, Covert Sabotage, and Credible Military Threats", 3, 9, 4, 1, 8, 1);

add(2008, "2008_colombian_hostage_rescue_operation_jaque", "Operation Jaque & Disruption of FARC Guerrilla Leadership", "News", "2008 (FARC Hostage Rescue)", "Foreign Policy & Defense", 7,
  "Colombian military operation freeing Íngrid Betancourt and three American defense contractors without firing a shot.",
  "1 = Celebrate Peaceful Liberation / Continue Conditioning Aid on Human Rights", "10 = Vindication of Plan Colombia Military Intelligence and U.S. Security Assistance", 3, 8, 5, 2, 8, 1);

add(2008, "2008_merck_vioxx_settlement_tort_liability", "$4.85 Billion Merck Vioxx Product Liability Settlement", "News", "2007-2009 (Pharmaceutical Tort Liability)", "Healthcare", 6,
  "Resolving 27,000 personal injury lawsuits alleging Merck concealed heart attack risks of its arthritis painkiller Vioxx.",
  "1 = Hold Negligent Pharma Corporations Fully Accountable in Civil Courts", "10 = Enact Federal Preemption to Shield FDA-Approved Medicines from State Lawsuits", 2, 8, 6, 1, 8, 1);

add(2008, "2008_california_prop_2_farm_animal_cages", "California Proposition 2 (Standards for Confining Farm Animals)", "News", "2008 (Farm Animal Welfare Mandate)", "Agriculture & Food", 5,
  "Banning gestation crates, veal crates, and battery cages for egg-laying hens that prevent them from turning around freely.",
  "1 = End Inhumane Factory Farm Confinement / Protect Animal Welfare", "10 = Oppose Burdensome Mandates That Inflate Consumer Egg and Pork Prices", 2, 7, 5, 1, 8, 1);

add(2008, "2008_post_office_closures_saturday_delivery", "Postal Deficits & Proposals to Eliminate Saturday Mail Delivery", "News", "2008-2012 (Postal Fiscal Crisis)", "Governance & Judiciary", 7,
  "USPS proposals to cut delivery to five days a week and close rural post offices due to deep pre-funding losses.",
  "1 = Protect 6-Day Delivery and Rural Post Offices as Vital Public Infrastructure", "10 = Allow USPS Operational Flexibility to Cut Costs and Eliminate Unprofitable Days", 2, 8, 8, 1, 8, 1);

add(2008, "2008_missouri_proposition_b_puppy_mills", "Cracking Down on Commercial Dog Breeding Facilities ('Puppy Mills')", "News", "2008-2010 (Commercial Breeder Reform)", "Agriculture & Food", 7,
  "Enacting statutory limits on commercial breeding dog ownership and mandating veterinary care standards.",
  "1 = Stop Inhumane Puppy Mill Exploitation Through Enforceable Standards", "10 = Protect Legitimate Agricultural Dog Breeders from Animal Rights Extremism", 2, 7, 5, 1, 8, 1);

add(2008, "2008_border_patrol_virtual_fence_sbi_net", "Boeing SBInet 'Virtual Fence' Surveillance Tower Delays", "News", "2007-2011 (Secure Border Initiative)", "Technology & Infrastructure", 6,
  "Cost overruns and radar software glitches crippling Boeing's high-tech virtual border surveillance tower project.",
  "1 = Cancel Flawed Virtual Fence / Reallocate Funds to Modernizing Ports of Entry", "10 = Fix Technology Failures and Complete Comprehensive High-Tech Border Coverage", 3, 7, 6, 1, 8, 1);

add(2008, "2008_iraq_private_security_blackwater_nisour", "Blackwater Nisour Square Shooting & Private Contractor Accountability", "News", "2007-2010 (Contractor Immunity Crisis)", "Foreign Policy & Defense", 4,
  "Indicting Blackwater security guards for killing 17 Iraqi civilians in Baghdad and subjecting contractors to U.S. court jurisdiction.",
  "1 = Eliminate Armed Mercenaries in War Theaters / Repeal Contractor Legal Immunity", "10 = Support Private Contractors Performing Vital Diplomatic Protection Missions", 2, 9, 3, 1, 7, 1);

add(2008, "2008_medicare_advantage_overpayments", "Eliminating Private Medicare Advantage 14% Benchmark Overpayments", "Ideological", "2007-2015 (Medicare Advantage Reform Arc)", "Healthcare", 5,
  "Phasing out extra federal subsidies paid to private Medicare Advantage HMOs compared to traditional fee-for-service Medicare.",
  "1 = Reclaim Overpayments to Private Insurers to Bolster Traditional Medicare Solvency", "10 = Protect Medicare Advantage Private Plan Choices and Extra Benefits for Seniors", 2, 9, 8, 1, 9, 1);

add(2008, "2008_commercial_space_cots_spacex_falcon1", "NASA Commercial Orbital Transportation Services (COTS) & SpaceX Launch", "News", "2008 (Commercial Space Revolution)", "Technology & Infrastructure", 6,
  "Awarding billion-dollar NASA cargo resupply contracts to private startups SpaceX and Orbital Sciences.",
  "1 = Maintain NASA Public Aerospace Leadership and Federal Workforce Standards", "10 = Embrace Private Commercial Space Competition to Slash Launch Costs", 4, 8, 10, 3, 8, 1);

add(2008, "2008_electric_vehicle_tax_credits", "Creation of $7,500 Plug-in Electric Vehicle Federal Tax Credit", "News", "2008-2022 (EV Incentive Genesis)", "Energy & Climate", 5,
  "Enacting a consumer tax credit up to $7,500 for purchasing plug-in electric vehicles to launch the EV market.",
  "1 = Subsidize Electric Vehicles and Charging Grids to Decarbonize Transportation", "10 = Oppose Government Picking Winners / End Subsidies for Wealthy Car Buyers", 2, 8, 9, 1, 9, 1);

add(2008, "2008_corporate_inversion_anti_abuse_rules", "Treasury Anti-Inversion Regulations Under Section 7874", "News", "2008 (Anti-Inversion Rulemaking)", "Economy & Taxation", 6,
  "Tightening Treasury rules regarding ownership percentages required to treat re-incorporated foreign firms as domestic for tax.",
  "1 = Aggressively Close Corporate Inversion Havens and Claw Back Unpaid Taxes", "10 = Lower U.S. Corporate Tax Rate from 35% to Make America Globally Competitive", 2, 7, 9, 1, 6, 1);

add(2008, "2008_dc_voting_rights_act_stalemate", "District of Columbia House Voting Rights Act & Utah Extra Seat", "News", "2007-2009 (DC Representation Compromise)", "Governance & Judiciary", 5,
  "Granting the District of Columbia a full voting member of the House paired with adding a seat for conservative Utah.",
  "1 = Grant Full Voting Congressional Representation to DC Citizens", "10 = Oppose Statutory Seats / Require Constitutional Amendment for Non-States", 2, 9, 4, 1, 10, 1);

add(2008, "2008_columbia_river_salmon_dams", "Pacific Northwest Hydroelectric Dams vs. Endangered Wild Salmon", "Ideological", "1995-2026 (Snake River Dam Removal)", "Energy & Climate", 7,
  "Federal court rejecting federal biological opinions on operating Columbia-Snake River dams due to salmon mortality.",
  "1 = Breach Lower Snake River Dams to Restore Wild Salmon Runs and Tribal Treaties", "10 = Protect Baseload Carbon-Free Hydroelectric Power and Agricultural Barging", 2, 8, 8, 1, 8, 1);

add(2008, "2008_estate_tax_compromise_parameters", "Fixing the Permanent Estate Tax Exemption at $3.5M vs $5M", "Ideological", "1990-2026 (Wealth Taxation Arc)", "Economy & Taxation", 4,
  "Debating whether to make the 2009 estate tax rate 45% with a $3.5 million exemption permanent before the 2010 zero-tax year.",
  "1 = Restore 55% Estate Tax on Fortunes Above $2M to Combat Plutocracy", "10 = Permanently Abolish the 'Death Tax' or Raise Exemption to $10M+", 3, 9, 10, 1, 10, 1);

add(2008, "2008_broadband_stimulus_universal_access", "Federal Universal Broadband Deployment Subsidies", "Ideological", "2008-2026 (Digital Divide Infrastructure)", "Technology & Infrastructure", 6,
  "Federal grant funding to extend fiber and high-speed broadband into underserved rural and low-income urban areas.",
  "1 = Universal High-Speed Public Broadband as an Essential Utility", "10 = Rely on Private Telecom Capital Investment / Avoid Market Distortions", 2, 8, 9, 1, 8, 1);

console.log('Bracket 2 - 2008 complete. Total in array:', ISSUES.length);
// =========================================================================
// 2010 (52 Issues)
// =========================================================================
add(2010, "2010_affordable_care_act_enactment", "Patient Protection and Affordable Care Act (Obamacare) Enactment", "News", "2009-2026 (ACA Implementation Arc)", "Healthcare", 1,
  "Passing comprehensive health reform mandating individual insurance coverage, creating state exchanges, and expanding Medicaid.",
  "1 = Medicare for All Single-Payer / Strengthen ACA Public Option", "10 = Full Repeal & Replacement of Obamacare / Abolish Individual Mandate", 3, 10, 10, 1, 10, 1);

add(2010, "2010_tea_party_movement_rebellion", "Tea Party Grassroots Movement & Fiscal Constitutionalism", "News", "2009-2016 (Tea Party Era)", "Governance & Judiciary", 1,
  "Grassroots populist rebellion against the stimulus, bailouts, and national debt, demanding strict originalist constitutional limits.",
  "1 = Reject Right-Wing Astroturf and Obstructionism", "10 = Embrace Constitutional Tea Party Principles to Slash Debt and Government Overreach", 2, 10, 8, 1, 10, 1);

add(2010, "2010_citizens_united_super_pacs", "Citizens United v. FEC Landmark Supreme Court Campaign Finance Ruling", "News", "2010-2026 (Super PAC Era)", "Governance & Judiciary", 1,
  "Supreme Court striking down bans on corporate and union independent political expenditures, enabling Super PACs.",
  "1 = Constitutional Amendment to Overturn Citizens United & Ban Corporate Money", "10 = Defend First Amendment Right to Political Speech for All Associations", 2, 10, 9, 1, 9, 1);

add(2010, "2010_bp_deepwater_horizon_spill", "BP Deepwater Horizon Oil Spill & Deepwater Drilling Moratorium", "News", "2010 (Gulf Disaster Arc)", "Energy & Climate", 1,
  "Federal 6-month moratorium on deepwater offshore oil drilling following the blowout of the Macondo well in the Gulf.",
  "1 = Enforce Permanent Offshore Drilling Bans / Criminal Prosecution of BP", "10 = End Drilling Moratorium / Protect Thousands of Gulf Energy Jobs", 2, 9, 8, 1, 9, 1);

add(2010, "2010_american_recovery_reinvestment_act", "American Recovery & Reinvestment Act of 2009 ($787B Stimulus)", "News", "2009-2012 (ARRA Implementation)", "Economy & Taxation", 2,
  "Evaluating the efficacy of the $787B federal stimulus bill in stemming Great Recession job losses.",
  "1 = Stimulus Was Too Small / Pass Second Major Green Jobs Infrastructure Bill", "10 = Reckless Wasteful Spending / Failed Keynsian Boondoggle Inflating National Debt", 2, 10, 10, 1, 10, 1);

add(2010, "2010_arizona_sb_1070_immigration", "Arizona SB 1070 ('Support Our Law Enforcement and Safe Neighborhoods Act')", "News", "2010-2012 (State Border Enforcement Showdown)", "Immigration & Border", 1,
  "State law requiring police officers to check immigration status of individuals during lawful stops if reasonable suspicion exists.",
  "1 = Condemn SB 1070 as Unconstitutional Racial Profiling / DOJ Civil Rights Lawsuit", "10 = Uphold State Authority to Secure Borders Where Federal Government Refuses", 2, 10, 4, 1, 10, 1);

add(2010, "2010_dodd_frank_wall_street_reform", "Dodd-Frank Wall Street Reform and Consumer Protection Act", "News", "2010-2026 (Dodd-Frank Regulatory Arc)", "Economy & Taxation", 2,
  "Comprehensive financial regulatory overhaul creating the CFPB, Volcker Rule proprietary trading ban, and living wills.",
  "1 = Break Up Too-Big-To-Fail Banks / Reinstate 1933 Glass-Steagall", "10 = Repeal Dodd-Frank / Stop Stifling Community Bank Lending with Red Tape", 2, 9, 10, 1, 9, 1);

add(2010, "2010_dont_ask_dont_tell_repeal", "Legislative Repeal of 'Don't Ask, Don't Tell' in Lame-Duck Session", "News", "2010-2011 (DADT Repeal Enactment)", "Civil Rights & Social Issues", 2,
  "Repealing the 1993 military statute to allow gay and lesbian service members to serve openly in the Armed Forces.",
  "1 = Full Immediate Repeal / Affirm Universal Equality in Service", "10 = Oppose Repeal / Protect Unit Cohesion in Active War Theaters", 2, 9, 2, 1, 10, 1);

add(2010, "2010_waxman_markey_cap_and_trade", "Waxman-Markey American Clean Energy and Security Act (Cap-and-Trade)", "News", "2009-2010 (Cap-and-Trade Defeat)", "Energy & Climate", 2,
  "House-passed cap-and-trade bill placing declining statutory limits on national greenhouse gas emissions, dying in the Senate.",
  "1 = Enact Economy-Wide Carbon Cap / Green New Deal Transformation", "10 = Defeat 'Cap-and-Tax' / Protect Manufacturing and Working Families from Energy Price Hikes", 2, 10, 9, 1, 10, 1);

add(2010, "2010_bush_tax_cuts_compromise_extension", "December 2010 Tax Compromise (Two-Year Extension of All Bush Cuts)", "News", "2010-2012 (Lame-Duck Tax Deal)", "Economy & Taxation", 2,
  "Bipartisan deal extending the Bush tax cuts for all brackets for two years paired with unemployment insurance extension.",
  "1 = Oppose Extending Cuts for Top 2% / End Tax Giveaways for Millionaires", "10 = Extend All Tax Rates to Prevent Shock to Fragile Economic Recovery", 3, 9, 10, 1, 9, 1);

add(2010, "2010_simpson_bowles_deficit_commission", "National Commission on Fiscal Responsibility (Simpson-Bowles Report)", "News", "2010-2013 (Grand Bargain Arc)", "Economy & Taxation", 3,
  "Proposing a $4 trillion 10-year grand bargain combining entitlement spending caps, chained CPI, and tax loophole closures.",
  "1 = Protect Social Security and Medicare from All Cuts / Raise Revenues on Wealth", "10 = Cut Entitlements and Slash Government Outlays / Reject Major Tax Hikes", 4, 7, 8, 1, 8, 1);

add(2010, "2010_california_prop_19_marijuana", "California Proposition 19 (Regulate, Control, and Tax Cannabis Act)", "News", "2010 (First Adult-Use Legalization Measure)", "Civil Rights & Social Issues", 3,
  "Pioneering ballot measure to legalize personal adult possession of up to one ounce of marijuana and authorize commercial sales.",
  "1 = Vote Yes / End the Racist War on Drugs & Generate State Tax Revenues", "10 = Vote No / Protect Workplaces and Highways from Substance Abuse", 3, 8, 1, 1, 9, 1);

add(2010, "2010_sotomayor_kagan_supreme_court", "Supreme Court Confirmations of Sonia Sotomayor and Elena Kagan", "News", "2009-2010 (Obama SCOTUS Nominations)", "Governance & Judiciary", 3,
  "Confirming Sonia Sotomayor (first Latina justice) and Elena Kagan to replace David Souter and John Paul Stevens.",
  "1 = Confirm Pragmatic Jurists Committed to Equal Protection and Civil Rights", "10 = Oppose Liberal Judicial Activists Who Reject Constitutional Originalism", 2, 9, 7, 1, 10, 1);

add(2010, "2010_unemployment_9_percent_recovery", "Persistent 9.6% National Unemployment & 'Jobless Recovery'", "News", "2009-2012 (Post-Crisis Labor Sluggishness)", "Economy & Taxation", 2,
  "Addressing 14 million unemployed workers and prolonged median job search times during the painfully slow recovery.",
  "1 = Pass Direct Federal Public Works Jobs Program & WPA-Style Employment", "10 = Slash Taxes, Cut Business Regulations, and Unleash Private Sector Investment", 2, 9, 10, 1, 10, 1);

add(2010, "2010_individual_mandate_constitutionality", "26-State Lawsuit Challenging Constitutionality of ACA Individual Mandate", "News", "2010-2012 (Pre-NFIB v. Sebelius)", "Governance & Judiciary", 2,
  "State Attorneys General suing in federal court arguing the Commerce Clause cannot compel individuals to buy commercial health insurance.",
  "1 = Defend Mandate as Lawful Exercise of Necessary and Proper Interstate Commerce", "10 = Strike Down Mandate / Congress Cannot Compel Americans to Purchase a Product", 2, 10, 10, 1, 10, 1);

add(2010, "2010_dream_act_filibuster", "DREAM Act Senate Filibuster (Conditional Pathway for Undocumented Youth)", "News", "2010 (Lame-Duck DREAM Act Vote)", "Immigration & Border", 3,
  "Senate filibuster blocking legislation providing conditional residency to undocumented immigrants brought to the U.S. as children.",
  "1 = Pass the DREAM Act Immediately to Welcome Blameless Youth", "10 = Filibuster DREAM Act / Reject Piecemeal Amnesties Encouraging Illegal Influx", 2, 10, 3, 1, 10, 1);

add(2010, "2010_wikileaks_afghan_war_logs", "WikiLeaks Release of Classified Afghan War Logs & State Dept Cables", "News", "2010-2012 (Manning Leaks)", "Foreign Policy & Defense", 3,
  "Chelsea Manning's leak of hundreds of thousands of classified military reports and diplomatic cables exposing civilian casualties.",
  "1 = Protect Whistleblowers and Public Right to Know Truth About War Crimes", "10 = Prosecute Leakers and WikiLeaks for Compromising Sources and Endangering Troops", 3, 9, 2, 1, 9, 1);

add(2010, "2010_new_start_treaty_ratification", "New START Nuclear Arms Reduction Treaty with Russia", "News", "2010 (New START Ratification)", "Foreign Policy & Defense", 3,
  "Ratifying bilateral treaty with Moscow capping deployed strategic nuclear warheads at 1,550 and re-establishing on-site inspections.",
  "1 = Ratify Treaty to Advance Nuclear Nonproliferation and Strategic Stability", "10 = Demand Modernization Funding First / Beware Russian Non-Compliance", 3, 8, 4, 1, 8, 1);

add(2010, "2010_solyndra_loan_guarantee_scrutiny", "Section 1705 Clean Energy Loan Guarantee to Solyndra ($535M)", "News", "2009-2012 (Clean Tech Loan Controversy)", "Energy & Climate", 4,
  "Awarding a $535 million federal stimulus loan guarantee to cylindrical solar panel maker Solyndra before its collapse.",
  "1 = Defend Venture-Style Public Investment in Emerging Clean Technologies", "10 = Investigate Crony Capitalism and Political Favoritism in Green Energy Loans", 3, 9, 9, 1, 8, 1);

add(2010, "2010_food_safety_modernization_act", "FDA Food Safety Modernization Act (FSMA Preventive Controls)", "News", "2010-2011 (Food Safety Overhaul)", "Agriculture & Food", 4,
  "Shifting federal food safety focus from responding to contamination to preventing it with mandatory facility recalls.",
  "1 = Comprehensive Mandatory Preventive Controls Across All Food Processors", "10 = Protect Small Local Family Farms from Crushing Compliance Burdens", 2, 7, 7, 1, 7, 1);

add(2010, "2010_disclose_act_filibuster", "DISCLOSE Act Filibuster (Transparency for Super PAC Dark Money)", "News", "2010 (Post-Citizens United Transparency Push)", "Governance & Judiciary", 4,
  "Senate filibuster defeating bill requiring corporations and unions spending over $10,000 in campaigns to disclose top donors.",
  "1 = Mandate Immediate Transparency and Public Disclosure for All Political Spending", "10 = Protect Donor Privacy Against Harassment and Boycotts", 2, 9, 9, 1, 8, 1);

add(2010, "2010_cornyn_earmark_moratorium", "Bipartisan Moratorium on Congressional Spending Earmarks", "News", "2010-2021 (Earmark Ban Era)", "Governance & Judiciary", 4,
  "Voluntary and statutory moratoria banning member-directed pork-barrel spending earmarks in appropriations bills.",
  "1 = Retain Earmarks as Legitimate Article I Legislative Grease for Bipartisanship", "10 = Completely Ban Corrupt Pork-Barrel Earmarks and Bridge-to-Nowhere Waste", 4, 9, 8, 2, 10, 1);

add(2010, "2010_colorado_amendment_62_personhood", "Colorado Amendment 62 (Second Fetal Personhood Measure)", "News", "2010 (Second Personhood Defeat)", "Civil Rights & Social Issues", 4,
  "Voters overwhelmingly rejecting for a second time an amendment defining personhood as beginning at fertilization.",
  "1 = Vote No / Protect Comprehensive Reproductive Healthcare and IVF", "10 = Vote Yes / Stand for Moral Principle That Life Begins at Fertilization", 2, 9, 3, 1, 10, 1);

add(2010, "2010_oklahoma_state_question_755_sharia", "Oklahoma State Question 755 ('Save Our State' Amendment Banning Sharia)", "News", "2010 (Anti-Sharia Legislation Wave)", "Civil Rights & Social Issues", 5,
  "Constitutional amendment barring state courts from considering international law or Islamic Sharia law in rulings.",
  "1 = Vote No / Unconstitutional Discrimination Violating the First Amendment", "10 = Vote Yes / Protect State Legal System from Foreign Religious Creep", 2, 10, 4, 1, 10, 1);

add(2010, "2010_student_loan_direct_lending_takeover", "Elimination of Private Bank Subsidies & Transition to 100% Direct Lending", "News", "2010 (Direct Loan Enactment)", "Education", 3,
  "Ending federal subsidies to commercial banks originating Stafford loans and transitioning all lending to the Department of Education.",
  "1 = Eliminate Wasteful Bank Subsidies and Reinvest Savings into Pell Grants", "10 = Oppose Government Takeover of Private Student Lending / Return to Market", 2, 9, 10, 1, 9, 1);

add(2010, "2010_haiti_earthquake_humanitarian_response", "Operation Unified Response for 2010 Haiti Earthquake Relief", "News", "2010 (Haiti Disaster Response)", "Foreign Policy & Defense", 5,
  "Deploying 20,000 U.S. troops, aircraft carrier USS Carl Vinson, and $1.15B in humanitarian disaster aid to Port-au-Prince.",
  "1 = Full Humanitarian Debt Relief and Long-Term Reconstruction Assistance", "10 = Provide Immediate Emergency Relief While Preventing Long-Term Dependency", 3, 7, 5, 1, 7, 1);

add(2010, "2010_cuba_travel_liberalization_regs", "Treasury Regulatory Easing on Academic, Religious, and Cultural Cuba Travel", "News", "2009-2011 (People-to-People Travel Rules)", "Foreign Policy & Defense", 6,
  "Expanding licenses for purposeful 'people-to-people' educational and religious travel to Cuba.",
  "1 = Full Freedom of Travel for All Americans / Dismantle Embargo", "10 = Oppose Travel Easing That Provides Hard Currency to Castro Security Services", 3, 8, 2, 1, 9, 1);

add(2010, "2010_fed_quantitative_easing_two_qe2", "Federal Reserve $600 Billion Second Round of Quantitative Easing (QE2)", "News", "2010-2011 (QE2 Bond Purchases)", "Economy & Taxation", 4,
  "Federal Reserve purchasing $600 billion in longer-term Treasury bonds to lower real interest rates and avert deflation.",
  "1 = Necessary Monetary Support for Jobs and Wage Growth", "10 = Dangerously Reckless Money Printing Debasing the U.S. Dollar", 3, 9, 10, 1, 10, 2);

add(2010, "2010_yemen_al_qaeda_drone_strikes", "Escalation of CIA & JSOC Drone Strikes in Yemen (AQAP)", "News", "2009-2015 (Yemen Drone Campaign)", "Foreign Policy & Defense", 4,
  "Expanding covert targeted drone missile strikes against al-Qaeda in the Arabian Peninsula following the underwear bomb plot.",
  "1 = Cease Extrajudicial Drone Assassinations / Ensure Judicial Transparency", "10 = Lethal Precision Strikes Are Essential to Eliminate Terrorists in Ungoverned Spaces", 3, 9, 2, 1, 8, 1);

add(2010, "2010_arizona_ethnic_studies_ban_hb2281", "Arizona House Bill 2281 Banning Mexican-American Ethnic Studies", "News", "2010 (Ethnic Studies Curriculum Battle)", "Education", 5,
  "Prohibiting public school courses designed primarily for pupils of a particular ethnic group or advocating ethnic solidarity.",
  "1 = Celebrate Culturally Relevant Education / Protect Diverse History Curricula", "10 = Ban Divisive Curricula Teaching Anti-American Resentment and Racial Division", 2, 9, 6, 1, 10, 1);

add(2010, "2010_epa_tailoring_rule_greenhouse_gases", "EPA Greenhouse Gas Tailoring Rule for Major Industrial Facilities", "News", "2010-2014 (Clean Air Act GHG Permitting)", "Energy & Climate", 5,
  "Phasing in Clean Air Act Title V operating permits for facilities emitting over 75,000 tons of carbon dioxide per year.",
  "1 = Enforce Aggressive Clean Air Act Regulation on Industrial Carbon Polluters", "10 = Overturn Tailoring Rule / Stop EPA Power Grab Over Factories and Power Plants", 2, 9, 9, 1, 9, 1);

add(2010, "2010_wall_street_executive_pay_caps_tarp", "Pay Czar Kenneth Feinberg Salary Caps on TARP-Assisted Executives", "News", "2009-2010 (TARP Compensation Oversight)", "Economy & Taxation", 4,
  "Special Master cutting total cash compensation by 50% for top earners at firms receiving extraordinary taxpayer assistance.",
  "1 = Enact Permanent Wealth and Executive Pay Caps Across Entire Financial Sector", "10 = Eliminate Government Interference in Private Corporate Compensation Contracts", 2, 8, 10, 1, 8, 1);

add(2010, "2010_missouri_proposition_b_puppy_mills_enact", "Missouri Proposition B (Voter Approval of Commercial Dog Standards)", "News", "2010 (Missouri Puppy Mill Initiative)", "Agriculture & Food", 6,
  "Voters narrowly passing statutory limits on commercial breeding operations, later altered by state legislature.",
  "1 = Respect Citizen Ballot Mandate to Protect Animal Welfare", "10 = Prevent Out-of-State Animal Rights Groups from Harming Missouri Agriculture", 2, 7, 5, 1, 8, 1);

add(2010, "2010_credit_card_act_of_2009_implementation", "Credit Card Accountability, Responsibility, and Disclosure (CARD) Act", "News", "2009-2011 (Consumer Credit Rules)", "Economy & Taxation", 5,
  "Restricting retroactive interest rate increases, double-cycle billing, and hidden fee traps on consumer credit cards.",
  "1 = Enforce Stringent Usury Limits and Protect Consumers from Predatory Debt", "10 = Preserve Bank Pricing Flexibility / Resist Price Controls That Restrict Credit Access", 2, 7, 9, 1, 7, 1);

add(2010, "2010_clean_energy_standard_ces_debate", "Federal Clean Energy Standard (CES) Including Nuclear & Clean Coal", "Ideological", "2010-2015 (Clean Energy Standard Proposals)", "Energy & Climate", 6,
  "Mandating electric utilities generate 80% of electricity from clean sources by 2035, defining clean to include nuclear and gas.",
  "1 = Strict 100% Renewable Standard / Exclude Nuclear, Gas, and Biomass", "10 = Technology-Neutral Market Options / Protect Abundant Fossil Fuels", 3, 7, 8, 1, 7, 1);

add(2010, "2010_california_prop_23_ab32_suspension", "California Proposition 23 (Attempt to Suspend AB 32 Climate Law)", "News", "2010 (Oil Industry Climate Referendum)", "Energy & Climate", 4,
  "Ballot measure funded by out-of-state oil refiners to suspend California's AB 32 until unemployment dropped below 5.5%.",
  "1 = Defeat Prop 23 / Lead Global Green Energy Innovation and Clean Air", "10 = Support Prop 23 to Protect Working-Class Jobs During Severe Economic Distress", 2, 9, 8, 1, 9, 1);

add(2010, "2010_washington_initiative_1098_income_tax", "Washington Initiative 1098 (High-Earner State Income Tax Proposal)", "News", "2010 (State Tax Overhaul Referendum)", "Economy & Taxation", 5,
  "Citizen initiative to establish an income tax on individuals earning over $200,000 to fund public education and healthcare.",
  "1 = Vote Yes / Tax the Wealthiest to Fund Schools and Relieve Regressive Sales Taxes", "10 = Vote No / Protect Washington's Competitive Advantage as an Income-Tax-Free State", 2, 9, 10, 1, 9, 1);

add(2010, "2010_colorado_prop_101_tax_slash", "Colorado Proposition 101, Amendment 60 & 61 ('Three Graces' Tax Slash)", "News", "2010 (TABOR Tax Slash Ballot Fight)", "Economy & Taxation", 6,
  "Sweeping ballot initiatives to slash vehicle, income, and telecom taxes and bar government borrowing.",
  "1 = Defeat Measures That Would Destroy State Education, Highways, and Bond Ratings", "10 = Slash Taxes and Limit Government Debt to Return Money to Working Taxpayers", 2, 8, 10, 1, 10, 1);

add(2010, "2010_fast_and_furious_atf_operation", "ATF Operation Fast and Furious 'Gunwalking' Scandal", "News", "2010-2012 (Gunwalking Controversy)", "Governance & Judiciary", 4,
  "Congressional investigation into ATF Phoenix field division deliberately allowing 2,000 illegal firearms to 'walk' to Mexican drug cartels.",
  "1 = Fix Interagency Coordination Failures While Enacting Stronger Gun Trafficking Laws", "10 = Hold Attorney General Holder in Contempt / Investigate Anti-Gun Agenda Conspiracy", 2, 10, 5, 1, 10, 1);

add(2010, "2010_cronyism_solyndra_inspector_general", "Department of Energy Inspector General Audits of Clean Energy Loans", "News", "2010-2012 (Loan Program Governance)", "Energy & Climate", 6,
  "Oversight audits reviewing expedited vetting processes and political pressures surrounding the Solyndra loan closing.",
  "1 = Strengthen Programmatic Safeguards While Continuing Bold Clean Energy Innovation", "10 = Terminate Clean Energy Loan Program to End Corporate Welfare and Waste", 3, 9, 10, 1, 9, 1);

add(2010, "2010_somalia_al_shabaab_kampala_bombings", "Uganda World Cup Bombings by Al-Shabaab & AMISOM Support", "News", "2010 (East African Terror Surge)", "Foreign Policy & Defense", 6,
  "Providing military equipment and drone surveillance to the African Union Mission in Somalia (AMISOM) after twin bombings in Kampala.",
  "1 = Diplomatic Reconciliation and Humanitarian Drought Aid for Horn of Africa", "10 = Decisive Special Operations and Military Aid to Crush Al-Shabaab Terrorists", 3, 8, 4, 1, 8, 1);

add(2010, "2010_pension_funding_relief_act", "Preservation of Access to Care for Medicare Beneficiaries & Pension Relief", "News", "2010 (Pension Smoothing)", "Labor & Welfare", 7,
  "Allowing corporate defined-benefit pension plans to stretch out recession-driven asset losses over 15 years instead of 7.",
  "1 = Protect Worker Pension Benefits and Tighten Fiduciary Funding Obligations", "10 = Provide Temporary Corporate Smoothing to Free Up Capital for Hiring", 3, 7, 8, 2, 7, 1);

add(2010, "2010_california_prop_14_top_two_primary", "California Proposition 14 (Nonpartisan Top-Two Open Primary System)", "News", "2010 (Electoral Reform Measure)", "Governance & Judiciary", 5,
  "Creating a unified primary ballot where top two finishers advance to November regardless of political party affiliation.",
  "1 = Oppose Top-Two / Protect Party Nominating Autonomy and Third-Party General Ballot Access", "10 = Support Top-Two Open Primary to Elect More Pragmatic, Centrist Lawmakers", 6, 6, 1, 1, 1, 1);

add(2010, "2010_south_carolina_de_mint_conservative_litmus", "Jim DeMint Senate Conservatives Fund & Purging Moderates", "News", "2010 (GOP Primary Civil War)", "Governance & Judiciary", 4,
  "Backing insurgent conservative primary candidates (Rubio, Paul, Angle, O'Donnell) to defeat established moderate Republicans.",
  "1 = Welcome GOP Self-Destruction Through Ideological Extremism", "10 = Purge Country-Club Moderates / Elect Pure Constitutional Conservatives", 2, 9, 7, 1, 10, 1);

add(2010, "2010_epa_coal_ash_hazardous_waste_rules", "EPA Regulation of Coal Ash Waste Post-Kingston Fossil Plant Disaster", "News", "2009-2014 (Coal Combustion Residuals Rule)", "Energy & Climate", 6,
  "Determining whether to classify toxic coal combustion residuals as hazardous waste under Subtitle C of RCRA.",
  "1 = Enforce Strict Hazardous Waste Subtitle C Rules to Protect Drinking Water", "10 = Classify as Non-Hazardous Subtitle D / Protect Recycled Concrete and Utility Costs", 2, 8, 9, 1, 8, 1);

add(2010, "2010_defense_secretary_gates_procurement_cuts", "Defense Secretary Gates Canceling F-22 and Future Combat Systems", "News", "2009-2010 (Gates Pentagon Efficiencies)", "Foreign Policy & Defense", 5,
  "Halting production of the F-22 stealth fighter at 187 airframes and canceling the Army's $160B Future Combat Systems.",
  "1 = Reallocate Excessive Defense Weapons Dollars to Vital Domestic Needs", "10 = Maintain Full F-22 Production Line to Ensure Unrivaled Air Dominance Over China", 3, 8, 4, 1, 8, 1);

add(2010, "2010_cybersecurity_act_presidential_kill_switch", "Lieberman-Collins Cybersecurity Act & 'Internet Kill Switch' Controversy", "News", "2010-2012 (Critical Infrastructure Cybersecurity)", "Technology & Infrastructure", 7,
  "Granting emergency executive powers to direct critical private telecom networks to implement emergency countermeasures.",
  "1 = Reject Executive Kill Switches That Violate Fourth Amendment Privacy and Due Process", "10 = Authorize Emergency Powers to Shield Electric Grid and Nuclear Plants from Cyberwar", 3, 8, 1, 1, 4, 1);

add(2010, "2010_chrysler_fiat_alliance_rebound", "Chrysler Group Alliance with Italian Automaker Fiat", "News", "2009-2011 (Auto Rescue Turnaround)", "Economy & Taxation", 6,
  "Transferring operating control of bankrupt Chrysler to Fiat in exchange for small-engine platform technology.",
  "1 = Successful Rescue of American Manufacturing and UAW Worker Pensions", "10 = Government Handout of U.S. Corporate Assets to a Foreign Corporation", 2, 7, 9, 1, 7, 1);

add(2010, "2010_maine_repeal_same_sex_marriage_q1", "Maine Question 1 (People's Veto Overturning Same-Sex Marriage Law)", "News", "2009-2010 (New England Marriage Battles)", "Civil Rights & Social Issues", 4,
  "Voters approving a citizen veto to overturn a newly enacted state law legalizing same-sex marriage in Maine.",
  "1 = Affirm Basic Civil Rights / Overturn Referendum Result via Future Ballot", "10 = Uphold the People's Democratic Vote Defending Traditional Marriage", 3, 9, 3, 1, 10, 1);

add(2010, "2010_unaccompanied_minors_early_shelter_pressures", "Border Patrol Surge in Central American Juvenile Apprehensions", "News", "2010-2014 (Central American Youth Migration Arc)", "Immigration & Border", 7,
  "Opening specialized shelters to care for a doubling of unaccompanied non-Mexican minors fleeing gang violence.",
  "1 = Provide Full Due Process, Legal Counsel, and Humanitarian Asylum Shelter", "10 = Fast-Track Repatriation and Deterrence to Halt Human Smuggling Pipelines", 2, 9, 3, 1, 10, 1);

add(2010, "2010_fair_sentencing_act_crack_cocaine", "Fair Sentencing Act of 2010 (Reducing 100-to-1 Disparity to 18-to-1)", "News", "2010 (Bipartisan Criminal Justice Reform)", "Civil Rights & Social Issues", 5,
  "Reducing the federal statutory sentencing disparity between crack and powder cocaine from 100-to-1 down to 18-to-1.",
  "1 = Complete 1-to-1 Equalization / Retroactive Resentencing for All Inmates", "10 = Maintain Severe Mandatory Penalties to Deter Violent Inner-City Drug Gangs", 2, 7, 3, 1, 7, 1);

add(2010, "2010_mississippi_gulf_coast_restoration_trust", "Directing Clean Water Act Spill Penalties to Gulf Coast States (RESTORE Act)", "News", "2010-2012 (BP Penalties Allocation)", "Energy & Climate", 6,
  "Earmarking 80% of Clean Water Act civil penalties from BP directly to the five Gulf states for environmental and economic recovery.",
  "1 = Dedicate 100% of Penalties to Marine Ecology and Coastal Wetland Restoration", "10 = Distribute Funds Directly to Gulf States for Coastal Tourism and Local Economy", 3, 7, 6, 1, 7, 1);

console.log('Bracket 2 (2008 & 2010) total:', ISSUES.length);
// =========================================================================
// 2012 (52 Issues)
// =========================================================================
add(2012, "2012_nfib_v_sebelius_mandate_tax", "Supreme Court Upholding ACA as a Tax (NFIB v. Sebelius)", "News", "2012 (SCOTUS Obamacare Decision)", "Healthcare", 1,
  "Chief Justice Roberts upholding the Affordable Care Act's individual mandate under the taxing power while making Medicaid expansion optional.",
  "1 = Full Federal Implementation of ACA / Expand Medicaid in Every State", "10 = Total Repeal of Obamacare / Oppose Federal Healthcare Taxation", 3, 10, 10, 1, 10, 1);

add(2012, "2012_economic_recovery_8_percent_unemployment", "Sluggish Economic Recovery & 8.1% Unemployment Rate", "News", "2011-2014 (Sluggish Expansion Phase)", "Economy & Taxation", 1,
  "Debating the causes and cures for an economic recovery lagging behind historical post-recession rebounds.",
  "1 = Enact Major Federal Infrastructure Bank & Direct Job Creation Programs", "10 = Slash Corporate Tax Rates, Roll Back Red Tape, and Free Business Capital", 2, 9, 10, 1, 10, 1);

add(2012, "2012_romney_bain_capital_private_equity", "Mitt Romney's Bain Capital Record & Free-Market Capitalism", "News", "2012 (Private Equity Battle)", "Economy & Taxation", 1,
  "Framing private equity leveraged buyouts as wealth creation vs predatory asset stripping that destroys middle-class jobs.",
  "1 = Close Carried Interest Loophole / Tax Speculative Leveraged Buyouts", "10 = Celebrate Creative Destruction, Venture Capital, and Free Enterprise", 2, 9, 10, 1, 8, 1);

add(2012, "2012_benghazi_attack_talking_points", "Attack on U.S. Diplomatic Compound in Benghazi & Talking Points", "News", "2012-2016 (Benghazi Investigations)", "Foreign Policy & Defense", 1,
  "Investigating diplomatic security failures resulting in the deaths of Ambassador Chris Stevens and three Americans, and initial video blaming.",
  "1 = Implement Independent ARB Security Reforms / Reject Partisan Politicization", "10 = Condemn Administration Dereliction of Duty and Deliberate Cover-Up", 2, 10, 5, 1, 9, 1);

add(2012, "2012_auto_bailout_vindication_rebound", "Auto Bailout Vindication ('GM is Alive, Bin Laden is Dead')", "News", "2011-2013 (Auto Recovery Arc)", "Economy & Taxation", 2,
  "Highlighting the turnaround of General Motors and Chrysler with 250,000 saved manufacturing jobs versus Romney's 'Let Detroit Go Bankrupt'.",
  "1 = Celebrate Successful State Industrial Intervention That Saved U.S. Manufacturing", "10 = Oppose Corporate Bailouts and Government Favoritism Over Bondholders", 2, 8, 10, 2, 9, 1);

add(2012, "2012_sandy_hook_elementary_massacre", "Sandy Hook Elementary School Shooting & Gun Background Checks", "News", "2012-2014 (Post-Sandy Hook Gun Debate)", "Civil Rights & Social Issues", 1,
  "Mass murder of 20 first-graders and 6 educators in Newtown, CT, prompting federal push for universal background checks.",
  "1 = Ban Semiautomatic Assault Rifles, Limit Magazine Sizes & Enforce Universal Background Checks", "10 = Protect Second Amendment Rights / Armed Teachers & Hardened School Security", 2, 10, 10, 1, 10, 2);

add(2012, "2012_daca_deferred_action_youth", "Deferred Action for Childhood Arrivals (DACA Executive Action)", "News", "2012-2026 (DACA Legal Arc)", "Immigration & Border", 1,
  "President Obama exercising prosecutorial discretion to grant two-year deportation reprieves and work permits to 800,000 undocumented youth.",
  "1 = Fully Defend DACA / Pass Permanent Path to Citizenship", "10 = Rescind Lawless Executive Amnesty / Enforce Immigration Laws as Written", 2, 10, 3, 1, 10, 1);

add(2012, "2012_buffett_rule_tax_fairness", "Buffett Rule (30% Minimum Effective Tax Rate on Millionaires)", "News", "2011-2013 (Tax Fairness Arc)", "Economy & Taxation", 2,
  "Enacting a statutory rule ensuring high earners making over $1M pay an effective federal tax rate higher than their secretaries.",
  "1 = Enact Buffett Rule / Surtax on Millionaires to Rebalance Economy", "10 = Reject Class Warfare Rhetoric / Keep Capital Gains Rates Low to Spurt Growth", 2, 9, 10, 1, 9, 1);

add(2012, "2012_drone_strikes_targeted_killing_awlaki", "Targeted Drone Assassinations of American Citizens Abroad (Anwar al-Awlaki)", "News", "2011-2015 (Targeted Killing Jurisprudence)", "Foreign Policy & Defense", 2,
  "CIA drone strike in Yemen killing U.S. citizen Anwar al-Awlaki without indictment or trial, based on secret DOJ Office of Legal Counsel memo.",
  "1 = Require Judicial Warrants & Due Process Before Extrajudicial Killings of Citizens", "10 = Protect Commander-in-Chief Wartime Authority to Strike High-Level Enemy Combatants", 3, 8, 1, 1, 3, 1);

add(2012, "2012_colorado_washington_cannabis_amendment_64", "Colorado Amendment 64 & Washington I-502 (Adult-Use Marijuana Legalization)", "News", "2012-2026 (Commercial Cannabis Era)", "Civil Rights & Social Issues", 1,
  "Historic ballot measures legalizing personal possession, cultivation, and regulated retail sale of marijuana for adults 21+.",
  "1 = Vote Yes / End Failed Prohibition, Tax Legal Sales, and Free Police", "10 = Vote No / Enforce Federal Controlled Substances Act and Prevent Youth Addictions", 3, 8, 1, 1, 9, 1);

add(2012, "2012_same_sex_marriage_ballot_wins_4_states", "Voter Approval of Same-Sex Marriage in ME, MD, WA & Defeat in MN", "News", "2012 (First Popular Marriage Wins)", "Civil Rights & Social Issues", 1,
  "First time voters approved marriage equality at the ballot box in Maine, Maryland, and Washington while defeating a ban in Minnesota.",
  "1 = Celebrate Historic Democratic Breakthrough for Civil Rights", "10 = Defend Traditional Biblical Marriage and State Religious Liberty Protections", 2, 10, 2, 1, 10, 1);

add(2012, "2012_fiscal_cliff_spending_sequestration", "Budget Control Act 'Fiscal Cliff' & Automatic Spending Sequestration", "News", "2011-2013 (Fiscal Cliff Crisis)", "Economy & Taxation", 2,
  "Averting a simultaneous $500B expiration of tax cuts and automatic across-the-board cuts to defense and domestic agencies.",
  "1 = Cancel Domestic Spending Cuts / Allow Top 2% Tax Cuts to Expire", "10 = Enforce Deep Spending Cuts / Prevent Any Tax Hikes on Job Creators", 3, 9, 10, 1, 9, 1);

add(2012, "2012_occupy_wall_street_income_inequality", "Occupy Wall Street Movement & 'The 99%' Wealth Disparity", "News", "2011-2013 (Occupy Movement Resonance)", "Economy & Taxation", 2,
  "Nationwide encampments protesting systemic income inequality, predatory banking, student debt, and corporate corruption of democracy.",
  "1 = Champion the 99% / Tax Wall Street Speculation and Cancel Student Debt", "10 = Condemn Lawless Encampments / Defend Free Market Wealth Creation", 2, 9, 7, 1, 8, 1);

add(2012, "2012_syrian_civil_war_red_line_chemical", "Syrian Civil War & Obama's 'Red Line' on Chemical Weapons", "News", "2012-2014 (Syria Red Line Arc)", "Foreign Policy & Defense", 2,
  "President declaring the movement or use of chemical weapons by Bashar al-Assad would be a 'red line' triggering U.S. intervention.",
  "1 = Exhaust Diplomacy / Avoid Entanglement in Another Middle East Quagmire", "10 = Enforce Credible Deterrence / Arm Moderate Syrian Rebels to Oust Assad", 3, 9, 2, 1, 7, 1);

add(2012, "2012_trans_pacific_partnership_talks", "Trans-Pacific Partnership (TPP) 12-Nation Trade Negotiations", "News", "2011-2016 (TPP Negotiation Arc)", "Trade & Globalism", 3,
  "Negotiating a sweeping 12-nation Pacific Rim free trade agreement with investor-state dispute settlement (ISDS) provisions.",
  "1 = Oppose TPP as Corporate Power Grab That Ships Jobs Overseas", "10 = Pass TPP to Write Global Trade Rules and Counterbalance China's Rise", 4, 7, 7, 1, 3, 1);

add(2012, "2012_voter_id_laws_state_suppression", "State Photo Voter ID Laws & Department of Justice Section 5 Blocks", "Ideological", "2011-2026 (Voting Access & Election Integrity Arc)", "Governance & Judiciary", 2,
  "Passing strict state government-issued photo ID mandates to vote versus federal civil rights lawsuits blocking them.",
  "1 = Strike Down Photo ID Mandates as Jim Crow Voter Suppression", "10 = Require Photo ID to Prevent Voter Fraud and Ensure Ballot Integrity", 2, 10, 5, 1, 10, 1);

add(2012, "2012_keystone_xl_pipeline_permit_delay", "Keystone XL Crude Oil Pipeline Permit Review Delay", "News", "2011-2015 (Keystone XL Battle Arc)", "Energy & Climate", 2,
  "State Department delaying presidential cross-border permit for the 1,179-mile TransCanada oil sands pipeline.",
  "1 = Reject Pipeline to Halt Dirty Tar Sands Carbon Pollution", "10 = Immediately Approve Keystone XL to Create Thousands of Jobs and Energy Independence", 2, 10, 9, 1, 9, 1);

add(2012, "2012_paul_ryan_path_to_prosperity_budget", "Paul Ryan's House GOP 'Path to Prosperity' Budget", "News", "2011-2014 (Ryan Budget Vision)", "Economy & Taxation", 2,
  "Passing House budget converting Medicare into a premium-support voucher system, block-granting Medicaid, and slashing top taxes to 25%.",
  "1 = Denounce Ryan Budget as Ending Medicare and Starving the Poor", "10 = Enact Path to Prosperity to Save Entitlements from Inevitable Bankruptcy", 2, 10, 8, 1, 10, 1);

add(2012, "2012_osama_bin_laden_raid_abbottabad", "Operation Neptune Spear & Killing of Osama bin Laden in Pakistan", "News", "2011-2013 (Bin Laden Raid Fallout)", "Foreign Policy & Defense", 3,
  "Authorizing daring Navy SEAL helicopter raid into sovereign Pakistani territory to eliminate al-Qaeda leader Osama bin Laden.",
  "1 = Decisive Executive Leadership Delivering Justice to 9/11 Victims", "10 = Commend Military and Intelligence Operators / Credit Bush-Era Interrogation Intelligence", 2, 8, 4, 1, 7, 1);

add(2012, "2012_trayvon_martin_stand_your_ground", "Fatal Shooting of Trayvon Martin & Florida 'Stand Your Ground' Laws", "News", "2012-2014 (Stand Your Ground Controversy)", "Civil Rights & Social Issues", 2,
  "National outrage and DOJ civil rights review following the fatal shooting of unarmed 17-year-old Trayvon Martin by George Zimmerman.",
  "1 = Repeal Racially Biased 'Stand Your Ground' Laws / Enact Federal Hate Crimes Reforms", "10 = Defend Fundamental Right to Self-Defense and Presumption of Innocence", 2, 9, 6, 1, 10, 1);

add(2012, "2012_contraception_mandate_hobby_lobby_origins", "ACA Preventive Services Contraception Mandate & Religious Objections", "News", "2011-2014 (Contraception Mandate Battle)", "Civil Rights & Social Issues", 2,
  "Requiring employer-sponsored health insurance plans to cover preventative contraception with no copays, triggering Catholic lawsuits.",
  "1 = Guarantee Universal Copay-Free Contraceptive Access for All Women", "10 = Protect Religious Freedom of Faith-Based Employers from Moral Coercion", 2, 10, 6, 1, 10, 1);

add(2012, "2012_wisconsin_recall_walker_act_10", "Wisconsin Gubernatorial Recall Election & Scott Walker Act 10", "News", "2011-2012 (Wisconsin Labor War)", "Labor & Welfare", 2,
  "Governor Scott Walker surviving a historic recall election after enacting Act 10 stripping public sector unions of collective bargaining.",
  "1 = Stand with Public Union Workers Against Authoritarian Union-Busting", "10 = Defend Walker's Courageous Reforms That Balanced Budgets and Restored Taxpayer Power", 2, 10, 9, 1, 9, 1);

add(2012, "2012_libyan_intervention_nato_gaddafi", "Operation Odyssey Dawn & NATO Ouster of Muammar Gaddafi", "News", "2011-2013 (Libya Regime Change Arc)", "Foreign Policy & Defense", 3,
  "Launching NATO air strikes under UN Responsibility to Protect to prevent Benghazi massacre, resulting in Gaddafi's overthrow and death.",
  "1 = Avoid Unilateral Military Interventions Leading to Failed States", "10 = Necessary Humanitarian Interdiction / Decisive Multilateral Leadership", 4, 7, 2, 1, 6, 1);

add(2012, "2012_super_pac_spending_explosion", "Explosion of Super PAC & Dark Money Spending in 2012 General Election", "News", "2012 (First $2B Presidential Election)", "Governance & Judiciary", 3,
  "Over $1 billion channeled into outside independent expenditures following Citizens United and SpeechNow.org rulings.",
  "1 = Pass DISCLOSE Act and Constitutional Amendment to Get Big Money Out of Politics", "10 = Political Giving and Advertising are Fundamental Free Speech Rights", 2, 10, 9, 1, 9, 1);

add(2012, "2012_student_loan_debt_reaches_one_trillion", "Total U.S. Student Loan Debt Surpassing $1 Trillion", "News", "2012-2026 (Student Debt Crisis Arc)", "Education", 3,
  "Total federal student debt surpassing credit card debt, fueling proposals for income-based repayment expansion.",
  "1 = Expand Pay-As-You-Earn (PAYE) Forgiveness & Move to Debt-Free College", "10 = Eliminate Federal Guarantees That Fuel Runaway College Tuition Inflation", 2, 8, 10, 1, 9, 1);

add(2012, "2012_fracking_shale_boom_water_contamination", "Hydraulic Fracturing (Fracking) Boom & Groundwater Regulations", "Ideological", "2008-2026 (Shale Energy Arc)", "Energy & Climate", 3,
  "Rapid expansion of horizontal drilling and hydraulic fracturing in Pennsylvania and North Dakota driving cheap natural gas.",
  "1 = Enact Strict Federal Chemical Disclosure Rules or Outright Fracking Moratoriums", "10 = Support American Shale Revolution Making the U.S. the World's Leading Energy Producer", 2, 9, 9, 1, 9, 1);

add(2012, "2012_cuba_alan_gross_imprisonment", "Imprisonment of USAID Contractor Alan Gross in Cuba", "News", "2010-2014 (Alan Gross Detainment)", "Foreign Policy & Defense", 6,
  "Fifteen-year prison sentence handed to American humanitarian contractor Alan Gross for distributing satellite telecom equipment to Jewish groups.",
  "1 = Negotiate Humanitarian Release and Diplomatic Prisoner Exchange", "10 = Demand Immediate Unconditional Release / Tighten Regime Sanctions", 3, 8, 4, 1, 8, 1);

add(2012, "2012_california_prop_30_millionaires_tax", "California Proposition 30 (Temporary Income Tax on High Earners)", "News", "2012 (California Fiscal Turnaround)", "Economy & Taxation", 4,
  "Enacting temporary 1% to 3% income surtaxes on earnings over $250,000 and a 0.25% sales tax to prevent $6B in school budget cuts.",
  "1 = Vote Yes / Make the Wealthy Pay Their Fair Share to Save Public Schools", "10 = Vote No / Stop Chasing High-Earning Job Creators and Businesses Out of California", 2, 9, 10, 1, 9, 1);

add(2012, "2012_california_prop_34_repeal_death_penalty", "California Proposition 34 (Attempt to Abolish Capital Punishment)", "News", "2012 (Capital Punishment Ballot Fight)", "Civil Rights & Social Issues", 4,
  "Voter referendum to replace capital punishment with life imprisonment without possibility of parole.",
  "1 = Vote Yes / End Costly, Inhumane, and Error-Prone Death Penalty", "10 = Vote No / Retain Death Penalty for the Most Heinous Murders", 2, 9, 4, 1, 10, 1);

add(2012, "2012_oregon_measure_80_cannabis_defeat", "Oregon Measure 80 (Cannabis Legalization Ballot Measure Defeat)", "News", "2012 (Oregon Cannabis Referendum)", "Civil Rights & Social Issues", 5,
  "Voters narrowly defeating a measure allowing unlicensed commercial production overseen by a state cannabis commission.",
  "1 = Reform Ballot Model Toward Professional State Regulatory Oversight", "10 = Uphold Voter Rejection of Commercial Drug Operations", 3, 7, 1, 1, 8, 1);

add(2012, "2012_arizona_v_united_states_scotus", "Supreme Court Ruling Invalidating Core of Arizona SB 1070", "News", "2012 (Immigration Preemption Jurisprudence)", "Immigration & Border", 3,
  "Supreme Court striking down three of four key provisions of SB 1070 as unconstitutionally preempted by federal immigration law.",
  "1 = Affirm Federal Preemption and Equal Protection Against Discriminatory State Laws", "10 = Dissatisfaction with Ruling / Sovereign States Must Have Right to Deter Illegal Alien Invasion", 2, 9, 4, 1, 10, 1);

add(2012, "2012_cyber_security_executive_order", "Executive Order 13636 on Critical Infrastructure Cybersecurity", "News", "2012-2013 (Cybersecurity Framework)", "Technology & Infrastructure", 5,
  "Directing NIST to establish a voluntary cybersecurity risk framework following Senate filibuster of statutory cybersecurity bills.",
  "1 = Support Public-Private Voluntary Standards with Strict Civil Liberties Oversight", "10 = Mandate Statutory Information-Sharing with Clear Liability Shields for Companies", 3, 8, 4, 1, 7, 1);

add(2012, "2012_fbi_facial_recognition_ngi", "FBI Next Generation Identification (NGI) Biometric Facial Database", "News", "2012-2015 (Biometric Surveillance Arc)", "Civil Rights & Social Issues", 6,
  "Deploying nationwide computerized facial recognition search capabilities across millions of civilian and driver's license photos.",
  "1 = Require Judicial Probable Cause Warrants Before Facial Recognition Surveillance", "10 = Empower Law Enforcement with Cutting-Edge Biometrics to Catch Fugitives", 2, 8, 1, 1, 3, 1);

add(2012, "2012_postal_service_defaults_on_prefunding", "USPS Defaults on $5.5 Billion Retiree Health Pre-Funding Mandate", "News", "2012 (Postal Insovlency Crisis)", "Governance & Judiciary", 6,
  "Postal Service defaulting for the first time on multibillion-dollar annual retiree health payments mandated by 2006 law.",
  "1 = Restructure PAEA Mandate / Provide Emergency Federal Relief to Protect Mail Service", "10 = Downsize USPS Operations / Consolidate Processing Plants and End Saturday Delivery", 2, 8, 8, 1, 8, 1);

add(2012, "2012_gulf_restoration_act_restore", "Enactment of the RESTORE Act for Gulf Coast Ecosystem Recovery", "News", "2012 (RESTORE Enactment)", "Energy & Climate", 5,
  "Channeling 80% of BP's Clean Water Act civil penalties into a dedicated Gulf Coast restoration trust fund.",
  "1 = Ensure Funds Directly Restore Damaged Salt Marshes, Fisheries, and Barrier Islands", "10 = Ensure Fair Economic Distribution to Local Businesses Harmed by the Spill", 3, 7, 6, 1, 7, 1);

add(2012, "2012_jobs_act_crowdfunding_deregulation", "Jumpstart Our Business Startups (JOBS) Act & Equity Crowdfunding", "News", "2012 (JOBS Act Enactment)", "Economy & Taxation", 4,
  "Deregulating securities rules to allow startups to raise investment capital through online public crowdfunding portals.",
  "1 = Guard Against Unscrupulous Crowdfunding Scams Preying on Retail Investors", "10 = Unleash Grassroots Capital Formation for High-Tech and Small Business Innovators", 3, 8, 9, 2, 7, 1);

add(2012, "2012_afghanistan_strategic_partnership_agreement", "U.S.-Afghanistan Strategic Partnership Agreement & 2014 Transition", "News", "2012-2014 (Kabul Bilateral Pact)", "Foreign Policy & Defense", 4,
  "Signing long-term partnership with Kabul pledging post-2014 advisory support following the scheduled end of NATO combat operations.",
  "1 = Expedite Complete Military Exit / Stop Pouring Blood and Treasure into Insolvent War", "10 = Ensure Residual U.S. Counterterrorism Basing to Prevent Afghan Collapse", 3, 8, 2, 1, 7, 1);

add(2012, "2012_clean_energy_mercury_air_toxics_mats", "EPA Mercury and Air Toxics Standards (MATS) for Power Plants", "News", "2011-2015 (MATS Legal Battles)", "Energy & Climate", 4,
  "Mandating 90% reductions in toxic mercury, arsenic, and acid gas emissions from coal- and oil-fired electric generating units.",
  "1 = Vital Public Health Standard Protecting Children from Severe Neurological Harm", "10 = Costly Regulatory Overreach Intended to Wage a 'War on Coal' and Shutter Plants", 2, 9, 9, 1, 9, 1);

add(2012, "2012_medicaid_expansion_state_opt_outs", "Republican Governors Opting Out of ACA Medicaid Expansion", "News", "2012-2020 (Medicaid Expansion Resistance)", "Healthcare", 3,
  "GOP governors (Perry, Scott, Kasich initially) refusing federal Medicaid funds covering 100% of costs to block Obamacare expansion.",
  "1 = Condemn Governors Leaving Millions of Impoverished Citizens Without Healthcare", "10 = Defend State Fiscal Sovereignty Against Eventual Unfunded Federal Cost-Shifting", 2, 10, 10, 1, 10, 1);

add(2012, "2012_china_rare_earths_wto_dispute", "WTO Joint Trade Dispute Challenging China's Rare Earth Export Quotas", "News", "2012-2014 (Rare Earth Minerals War)", "Trade & Globalism", 5,
  "Filing formal WTO complaints with the EU and Japan over Beijing's discriminatory export restrictions on high-tech rare earth elements.",
  "1 = Hold China Accountable to International Trade Rules & Develop Domestic Supply Chains", "10 = Rebuild American Mining and Processing Capacity / Counter Chinese Monopolies", 3, 8, 7, 2, 8, 1);

add(2012, "2012_california_prop_36_three_strikes_reform", "California Proposition 36 (Voter Overhaul of Three Strikes Law)", "News", "2012 (Three Strikes Overhaul Passed)", "Civil Rights & Social Issues", 4,
  "Overwhelming voter approval (69%) requiring third strike to be a serious or violent felony and allowing retroactive resentencing.",
  "1 = Landmark Step Toward Dismantling Mass Incarceration of Nonviolent Offenders", "10 = Support Measured Reform While Keeping Dangerous Violent Criminals Incarcerated", 2, 8, 3, 1, 7, 1);

add(2012, "2012_arkansas_issue_5_medical_marijuana_narrow", "Arkansas Issue 5 (Medical Marijuana Narrow Defeat 48.6% to 51.4%)", "News", "2012 (Southern Medical Cannabis Precursor)", "Civil Rights & Social Issues", 6,
  "First southern state to vote on medical marijuana, demonstrating surging support across conservative rural districts.",
  "1 = Build Grassroots Momentum for Medical Cannabis Patient Rights in the South", "10 = Uphold Traditional Social Standards and Reject Illicit Substance Liberalization", 3, 8, 1, 1, 9, 1);

add(2012, "2012_stock_act_congressional_insider_trading", "Stop Trading on Congressional Knowledge (STOCK) Act", "News", "2012 (Congressional Insider Trading Ban)", "Governance & Judiciary", 4,
  "Banning members of Congress and executive staff from trading individual equities using non-public information obtained on Capitol Hill.",
  "1 = Enact Ironclad Financial Disclosures and Strict Criminal Penalties for Lawmakers", "10 = Enforce Equal Application of the Law / Avoid Burdensome Disclosures on Staff", 2, 7, 4, 1, 6, 1);

add(2012, "2012_iran_swift_financial_blacklisting", "Expulsion of Iranian Commercial Banks from Global SWIFT Network", "News", "2012 (SWIFT Sanctions Maximum Pressure)", "Foreign Policy & Defense", 3,
  "Coordinating international expulsion of Iranian financial institutions from the SWIFT global financial messaging system.",
  "1 = Multilateral Economic Pressure Paired with Credible Diplomatic Exit Off-Ramps", "10 = Total Economic Warfare and Blockade Until Iran Surrenders Its Nuclear Program", 3, 9, 4, 1, 8, 1);

add(2012, "2012_sequestration_defense_spending_cuts", "Automatic 10-Year $500 Billion Defense Budget Sequestration", "News", "2012-2013 (Defense Sequestration Threat)", "Foreign Policy & Defense", 3,
  "Pentagon warnings of hollowed-out armed forces, cancelled carrier deployments, and reduced troop levels if sequester takes effect.",
  "1 = Let Pentagon Cuts Stand / Reallocate Defense Savings to Rebuild Domestic Economy", "10 = Repeal Defense Sequestration / Maintain Superpower Readiness and Naval Dominance", 2, 9, 4, 1, 9, 1);

add(2012, "2012_bengal_bay_south_china_sea_freedom_nav", "U.S. Navy Freedom of Navigation Patrols in South China Sea", "News", "2012-2026 (South China Sea FONOPS)", "Foreign Policy & Defense", 4,
  "Challenging excessive Chinese maritime sovereignty claims by sailing guided-missile destroyers through disputed waters.",
  "1 = International Maritime Law & Multilateral ASEAN Diplomatic Mechanisms", "10 = Robust Naval Presence and Uncompromising Freedom of Navigation Operations", 3, 9, 5, 1, 8, 1);

add(2012, "2012_missouri_todd_akin_legitimate_rape", "Todd Akin 'Legitimate Rape' Controversy & Abortion Exceptions", "News", "2012 (GOP Candidate Abortion Gaffe)", "Civil Rights & Social Issues", 2,
  "Senate nominee Todd Akin claiming women's bodies prevent pregnancy in 'legitimate rape', blowing wide open abortion exception debates.",
  "1 = Expose the Extreme Anti-Choice War on Women Across the GOP", "10 = Disavow Akin's Ignorant Biological Comments / Stand Firmly on Sanctity of Life", 2, 9, 4, 1, 10, 1);

add(2012, "2012_patent_reform_america_invents_act", "Leahy-Smith America Invents Act (Transition to First-Inventor-to-File)", "News", "2011-2013 (Patent Overhaul)", "Technology & Infrastructure", 6,
  "Overhauling U.S. patent law from 'first-to-invent' to international 'first-inventor-to-file' and establishing the PTAB.",
  "1 = Harmonize Global Patents While Protecting Individual Inventors from Patent Trolls", "10 = Strengthen Property Rights for American Inventors Against Multinational Copycats", 3, 7, 7, 2, 7, 1);

add(2012, "2012_federal_subsidized_student_loan_rates_cliff", "Preventing Stafford Student Loan Interest Rates from Doubling to 6.8%", "News", "2012 (Student Loan Rate Cliff)", "Education", 3,
  "Emergency legislation preventing federal subsidized student loan interest rates from jumping from 3.4% to 6.8% for 7 million students.",
  "1 = Freeze Interest Rates and Permanently Lower Cost of Federal Student Debt", "10 = Allow Subsidies to Expire / Prevent Taxpayer Underwriting of College Tuition Hikes", 2, 8, 10, 1, 9, 1);

add(2012, "2012_haiti_cholera_outbreak_un_accountability", "UN Peacekeeper Introduction of Cholera in Haiti & Immunity Claims", "News", "2011-2016 (Haiti Cholera Crisis)", "Foreign Policy & Defense", 7,
  "Haitian victims suing the United Nations for importing a deadly cholera epidemic through contaminated peacekeeper wastewater.",
  "1 = Demand Full UN Financial Accountability, Apology, and Clean Water Reparations", "10 = Protect Legal Immunity of UN Peacekeeping Missions Worldwide", 2, 7, 3, 1, 6, 1);

add(2012, "2012_puerto_rico_status_plebiscite_54_percent", "Puerto Rico 2012 Plebiscite Rejecting Current Commonwealth Status", "News", "2012 (Historic Status Rejection)", "Governance & Judiciary", 6,
  "54% of Puerto Rican voters rejecting continuation of current territorial status and 61% favoring Statehood among non-territorial options.",
  "1 = Respect the Democratic Voice of Puerto Rico / Advance Toward 51st Statehood", "10 = Question Ambiguous Ballot Structure / Maintain Current Territorial Arrangement", 3, 8, 4, 1, 8, 1);


// =========================================================================
// 2014 (52 Issues)
// =========================================================================
add(2014, "2014_isis_caliphate_syria_airstrikes", "Rise of the ISIS Caliphate & Operation Inherent Resolve Airstrikes", "News", "2014-2019 (War on ISIS)", "Foreign Policy & Defense", 1,
  "Launching coalition air strikes in Iraq and Syria following ISIS's capture of Mosul and televised beheadings of American journalists.",
  "1 = Avoid Ground Troop Quagmires / Condition Aid on Iraqi Sectarian Inclusivity", "10 = Decisive Military Campaign to Annihilate ISIS / Deploy Combat Ground Forces", 3, 9, 2, 1, 8, 1);

add(2014, "2014_russia_annexation_of_crimea_ukraine", "Russian Military Annexation of Crimea & War in the Donbas", "News", "2014-2022 (Pre-Invasion Ukraine Arc)", "Foreign Policy & Defense", 1,
  "Responding to Vladimir Putin's invasion and annexation of Crimea and military destabilization of eastern Ukraine.",
  "1 = Coordinated Transatlantic Economic Sanctions & Diplomatic Isolation", "10 = Send Lethal Defensive Military Arms to Ukraine / Station NATO Armor in Baltics", 3, 9, 4, 1, 8, 1);

add(2014, "2014_central_american_unaccompanied_minors", "Rio Grande Valley Surge of Unaccompanied Child Migrants", "News", "2014 (Summer Border Surge)", "Immigration & Border", 1,
  "Over 68,000 unaccompanied children and mothers arriving at the southern border fleeing gang violence in El Salvador, Honduras, and Guatemala.",
  "1 = Provide Full Humanitarian Care, Due Process Hearings, and Legal Counsel", "10 = Fast-Track Deportation Flights and Militarize the Southwest Border", 2, 10, 3, 1, 10, 1);

add(2014, "2014_ferguson_police_shooting_michael_brown", "Ferguson Unrest & Fatal Police Shooting of Michael Brown", "News", "2014-2016 (Black Lives Matter Arc)", "Civil Rights & Social Issues", 1,
  "Civil unrest and protests in Ferguson, MO following the death of Michael Brown, sparking the national Black Lives Matter movement.",
  "1 = Demilitarize Police / Body Cameras / Independent Civil Rights Prosecutions", "10 = Back the Blue / Restore Law and Order / Stop Demonizing Police Officers", 2, 10, 3, 1, 10, 1);

add(2014, "2014_ebola_epidemic_west_africa_domestic", "West African Ebola Epidemic & Domestic Quarantine Protocols", "News", "2014-2015 (Ebola Crisis)", "Healthcare", 1,
  "Deploying 3,000 U.S. military engineers to Liberia while state governors impose mandatory 21-day quarantines on returning nurses.",
  "1 = Trust Public Health Science / Global Epidemic Containment at the Source", "10 = Impose Full Travel Ban from Ebola-Stricken Countries / Mandatory State Quarantines", 3, 9, 5, 1, 9, 1);

add(2014, "2014_healthcare_gov_website_glitches_rollout", "Healthcare.gov Technical Glitches & 'Keep Your Plan' Controversy", "News", "2013-2015 (ACA Rollout Disaster)", "Healthcare", 2,
  "Federal enrollment website crashing on launch day and millions of policy cancellation notices disproving Obama's pledge.",
  "1 = Fix Technological Glitches and Protect Millions Gaining Real Quality Coverage", "10 = Proof That Government-Run Healthcare Is an Unworkable Bureaucratic Nightmare", 2, 10, 10, 1, 10, 1);

add(2014, "2014_burwell_v_hobby_lobby_scotus", "Supreme Court Ruling on Corporate Religious Freedom (Hobby Lobby)", "News", "2014 (Hobby Lobby RFRA Decision)", "Civil Rights & Social Issues", 2,
  "Holding that closely held for-profit corporations cannot be forced under RFRA to provide contraception violating religious beliefs.",
  "1 = Disastrous Ruling Subordinating Women's Healthcare Rights to Bosses' Religious Beliefs", "10 = Major Victory Protecting First Amendment Conscience Rights from Federal Coercion", 2, 10, 5, 1, 10, 1);

add(2014, "2014_keystone_xl_presidential_veto_threat", "Congressional Push to Mandate Approval of Keystone XL Pipeline", "News", "2013-2015 (Keystone Legislative Battle)", "Energy & Climate", 2,
  "Bipartisan congressional majorities attempting to force statutory approval of Keystone XL over Obama's threatened veto.",
  "1 = Veto Pipeline to Protect Fragile Aquifers and Curb High-Carbon Tar Sands", "10 = Override Veto / Build Keystone XL to Unlock Canadian Crude and 20,000 Construction Jobs", 2, 10, 9, 1, 9, 1);

add(2014, "2014_epa_clean_power_plan_coal", "EPA Proposed Clean Power Plan Regulating Power Plant Carbon", "News", "2014-2016 (Clean Power Plan Arc)", "Energy & Climate", 2,
  "EPA proposing Section 111(d) Clean Air Act rule mandating a 32% cut in power sector carbon emissions by 2030.",
  "1 = Essential Global Climate Leadership Driving Transition Away from Coal", "10 = Lawless Power Grab by EPA Destined to Shutter Coal Mines and Spike Utility Bills", 2, 10, 9, 1, 10, 1);

add(2014, "2014_va_hospital_secret_waitlists", "Veterans Health Administration Secret Waitlist Scandal (Phoenix VA)", "News", "2014 (VA Scandal & Choice Act)", "Governance & Judiciary", 2,
  "Discovery that VA hospital administrators kept secret hidden waitlists concealing that veterans died waiting for care.",
  "1 = Double Funding for VA Doctors, Nurses, and Modern Clinical Facilities", "10 = Pass Veterans Choice Act Allowing Vets to Seek Private Medical Care", 2, 8, 9, 1, 8, 1);

add(2014, "2014_senate_nuclear_option_filibuster", "Harry Reid Invoking 'Nuclear Option' to Eliminate Judicial Filibuster", "News", "2013-2017 (Filibuster Nuclearization)", "Governance & Judiciary", 2,
  "Senate Democrats changing chamber rules by simple majority to eliminate the 60-vote filibuster on executive and judicial nominees.",
  "1 = Necessary Reform to Break Unprecedented Republican Obstruction of the DC Circuit", "10 = Dangerous Power Grab Destroying the Senate's Historic Deliberative Minority Protections", 2, 9, 6, 1, 9, 1);

add(2014, "2014_net_neutrality_title_ii_reclassification", "FCC Push to Reclassify Broadband Under Title II Common Carrier Rules", "News", "2014-2017 (Title II Net Neutrality Phase)", "Technology & Infrastructure", 2,
  "President Obama urging the FCC to classify consumer broadband as a public utility to ban paid prioritization.",
  "1 = Reclassify Under Title II to Protect Open Internet and Free Speech", "10 = Stop Heavy-Handed 1930s Telephone Regulations Chilling Private 5G Investment", 2, 9, 7, 1, 8, 1);

add(2014, "2014_minimum_wage_state_ballot_sweeps", "Red State Minimum Wage Ballot Initiatives (AK, AR, NE, SD)", "News", "2014 (Red State Minimum Wage Sweeps)", "Labor & Welfare", 2,
  "Voters in four conservative states approving citizen ballot measures raising state minimum wage rates to $8.50-$9.75.",
  "1 = Demonstrates Bipartisan Supermajority Support for Raising the Minimum Wage", "10 = Oppose Mandated Wage Floors That Accelerate Automation and Hurt Teen Workers", 2, 8, 10, 1, 9, 1);

add(2014, "2014_colorado_washington_weed_stores_open", "Opening of First Legal Adult-Use Marijuana Stores in Colorado & WA", "News", "2014 (First Retail Dispensaries Open)", "Civil Rights & Social Issues", 3,
  "Long lines and millions in state tax receipts as licensed commercial recreational cannabis shops open under the DOJ Cole Memo.",
  "1 = Successful Model for Tax-and-Regulate Legalization Nationwide", "10 = Re-evaluate Federal Non-Enforcement Policy / Curb Black Market Exportation", 3, 8, 1, 1, 9, 1);

add(2014, "2014_snowden_nsa_surveillance_reforms", "Edward Snowden Surveillance Revelations & USA FREEDOM Act Push", "News", "2013-2015 (Post-Snowden Reform Arc)", "Civil Rights & Social Issues", 2,
  "Reforming Section 215 bulk telephony metadata collection following worldwide disclosures by NSA contractor Edward Snowden.",
  "1 = End All Bulk Domestic Surveillance / Protect Whistleblowers from Retaliation", "10 = Preserve Critical Counterterror Intelligence Capabilities / Bring Traitor to Justice", 3, 9, 1, 1, 3, 1);

add(2014, "2014_iran_interim_nuclear_accord_jpoa", "Joint Plan of Action (JPOA) Interim Nuclear Freeze with Iran", "News", "2013-2015 (JCPOA Precursor)", "Foreign Policy & Defense", 2,
  "P5+1 interim accord granting partial sanctions relief in exchange for Iran freezing 20% uranium enrichment.",
  "1 = Groundbreaking Diplomatic Breakthrough Averting Another Mideast War", "10 = Flawed Appeasement Giving Iran Billions in Sanctions Relief Without Dismantling Centrifuges", 2, 9, 3, 1, 8, 1);

add(2014, "2014_shelby_county_v_holder_voting_rights", "Supreme Court Gutting Voting Rights Act (Shelby County v. Holder)", "News", "2013-2026 (Post-Shelby Voting Battles)", "Governance & Judiciary", 2,
  "Supreme Court striking down Section 4(b) preclearance coverage formula, allowing southern states to immediately enact voting restrictions.",
  "1 = Pass the John Lewis Voting Rights Advancement Act to Restore Federal Preclearance", "10 = Celebrate Federalism Ruling Acknowledging Historic Progress in the South", 2, 10, 6, 1, 10, 1);

add(2014, "2014_police_body_cameras_federal_funding", "Federal Grants for Police Body-Worn Cameras Post-Ferguson", "News", "2014-2016 (Body Cam Deployment)", "Civil Rights & Social Issues", 3,
  "White House proposing a $263 million initiative to co-fund 50,000 body-worn cameras for local law enforcement.",
  "1 = Mandate Body Cameras with Public Video Transparency and Strict Misconduct Discipline", "10 = Support Law Enforcement Technology While Protecting Officer and Witness Privacy", 2, 7, 3, 1, 7, 1);

add(2014, "2014_bernie_sanders_independent_movement", "Bernie Sanders Nationwide Rallies Against the Billionaire Class", "News", "2014 (Sanders 2016 Precursor)", "Economy & Taxation", 4,
  "Senator Bernie Sanders touring early states calling for a political revolution, Medicare for All, and tuition-free public college.",
  "1 = Build Working-Class Democratic Socialist Coalition to Confront Oligarchy", "10 = Reject Radical European Socialism and Discredited Marxist Confiscation", 3, 10, 8, 1, 10, 1);

add(2014, "2014_california_prop_47_criminal_justice", "California Proposition 47 (The Safe Neighborhoods and Schools Act)", "News", "2014 (Misdemeanor Reclassification)", "Civil Rights & Social Issues", 3,
  "Reclassifying nonviolent theft and personal drug possession offenses from felonies to misdemeanors across California.",
  "1 = Vote Yes / Stop Incarcerating People for Minor Offenses and Invest in Treatment", "10 = Vote No / Soft-on-Crime Measure Encouraging Shoplifting and Drug Vagrancy", 2, 9, 3, 1, 9, 1);

add(2014, "2014_alaska_oregon_marijuana_legalization", "Alaska Measure 2 & Oregon Measure 91 (Voter Approval of Adult-Use Weed)", "News", "2014 (Second Wave Legalization)", "Civil Rights & Social Issues", 3,
  "Voters in Oregon and Alaska approving ballot initiatives legalizing and taxing commercial recreational cannabis.",
  "1 = Momentum for Universal Federal Cannabis Decriminalization and Commercial Freedom", "10 = Oppose Commercial Drug Normalization Spreading Across Western States", 3, 8, 1, 1, 9, 1);

add(2014, "2014_fast_food_strikes_fight_for_15", "SEIU 'Fight for $15' Nationwide Fast-Food Labor Walkouts", "News", "2013-2020 (Fight for $15 Movement)", "Labor & Welfare", 3,
  "Fast-food, retail, and airport service workers staging coordinated one-day strikes demanding a $15/hour wage and union rights.",
  "1 = Full Support for Striking Workers / Enact $15 Federal Minimum Wage", "10 = Reject Unrealistic Union Demand That Will Destroy Entry-Level Jobs and Mandate Kiosks", 2, 9, 10, 1, 9, 1);

add(2014, "2014_general_motors_ignition_switch_recall", "GM Faulty Ignition Switch Recall (124 Fatalities & Corporate Cover-up)", "News", "2014 (Auto Safety & Cover-up)", "Technology & Infrastructure", 4,
  "Recalling 2.6 million vehicles for defective ignition switches that slipped out of the 'run' position, shutting off airbags.",
  "1 = Criminal Indictments for Corporate Negligence and Stronger NHTSA Enforcement Mandates", "10 = Hold GM Accountable Under Civil Compensation Fund Without Crushing Auto Industry", 2, 7, 5, 1, 7, 1);

add(2014, "2014_border_patrol_funding_emergency_bill", "Obama Request for $3.7B Emergency Supplemental for Border Minors", "News", "2014 (Border Supplemental Battle)", "Immigration & Border", 3,
  "Requesting $3.7 billion for immigration judges, border surveillance, and shelter care for unaccompanied minors.",
  "1 = Fully Fund Humanitarian Care and Legal Aid for Traumatized Children", "10 = Deny Request / Amend 2008 TVPRA Law to Allow Immediate Repatriation of Central American Kids", 2, 10, 3, 1, 10, 1);

add(2014, "2014_puerto_rico_debt_crisis_approaches", "Puerto Rico Credit Rating Downgraded to Junk Status ($72B Debt)", "News", "2014-2016 (PROMESA Precursor)", "Economy & Taxation", 5,
  "Territorial government facing insolvency with $72B in municipal debt and inability to restructure under Chapter 9 bankruptcy.",
  "1 = Grant Puerto Rico Access to Federal Chapter 9 Bankruptcy Protections", "10 = Oppose Bailouts for Reckless Territorial Spending / Demand Fiscal Discipline", 3, 8, 7, 1, 8, 1);

add(2014, "2014_cuba_diplomatic_talks_breakthrough", "Secret Vatican-Brokered Diplomatic Negotiations with Cuba", "News", "2014 (Pre-Normalization Talks)", "Foreign Policy & Defense", 4,
  "Covert 18-month negotiations mediated by Pope Francis to exchange Alan Gross and a Cuban spy for normalizing diplomatic ties.",
  "1 = Normalize Diplomatic Ties / Reopen Embassies / End Failed 50-Year Cold War Isolation", "10 = Unilateral Concessions to Castro Dictatorship Without Democratic Elections or Human Rights", 2, 9, 2, 1, 9, 1);

add(2014, "2014_target_home_depot_data_breaches", "Massive Retail Cyberattacks on Target & Home Depot Point-of-Sale Systems", "News", "2013-2015 (Point-of-Sale Cybersecurity)", "Technology & Infrastructure", 5,
  "Malware stealing 110 million customer credit card numbers, speeding transition to EMV chip cards.",
  "1 = Federal Data Breach Notification Standards and Strict Corporate Cybersecurity Liability", "10 = Accelerate Private Payment Card Industry Standards Without Duplicative Federal Rules", 2, 7, 6, 1, 7, 1);

add(2014, "2014_ex_im_bank_reauthorization_tea_party", "Tea Party Push to Abolish the Export-Import Bank", "News", "2014-2015 (Ex-Im Bank Shutdown)", "Trade & Globalism", 4,
  "Insurgent conservative rebellion against renewing the 80-year-old Export-Import Bank, labeling it corporate welfare for Boeing.",
  "1 = Reauthorize Ex-Im to Support American Exporters Against Subsidized Foreign Competitors", "10 = Terminate Ex-Im Bank to End Crony Capitalist Subsidies for Giant Multinational Corporations", 3, 8, 10, 1, 9, 1);

add(2014, "2014_irs_targeting_conservative_groups", "IRS Scrutiny of Conservative Tea Party Non-Profit 501(c)(4) Applications", "News", "2013-2015 (Lois Lerner Controversy)", "Governance & Judiciary", 3,
  "Inspector General finding IRS tax-exempt unit used inappropriate criteria targeting groups with 'Tea Party' or 'Patriot' in names.",
  "1 = Mismanaged Incompetent Bureaucracy Dealing with Surge in Dark Money Applications", "10 = Weaponized Political Retaliation by the Executive Branch to Suppress Conservative Donors", 2, 10, 5, 1, 10, 1);

add(2014, "2014_boko_haram_chibok_schoolgirls", "Kidnapping of 276 Nigerian Schoolgirls by Boko Haram (#BringBackOurGirls)", "News", "2014 (Chibok Crisis)", "Foreign Policy & Defense", 5,
  "Deploying U.S. military surveillance drones and advisory teams to search for kidnapped schoolgirls in Nigeria.",
  "1 = Multilateral Humanitarian Support and Regional Intelligence Sharing", "10 = Counterterrorist Support / Avoid Open-Ended Foreign Mission Creep", 3, 8, 4, 1, 7, 1);

add(2014, "2014_missouri_amendment_1_right_to_farm", "Missouri Amendment 1 (Constitutional 'Right to Farm')", "News", "2014 (Right to Farm Ballot Fight)", "Agriculture & Food", 6,
  "Narrowly approving constitutional amendment guaranteeing the right of farmers and ranchers to engage in modern agricultural practices.",
  "1 = Protect Local Communities and Animal Welfare from Corporate Agribusiness Monopolies", "10 = Protect Missouri Family Farmers from Out-of-State Animal Rights and Environmental Lawsuits", 2, 8, 8, 1, 9, 1);

add(2014, "2014_flint_michigan_water_switch_begins", "Flint River Drinking Water Switch & Lead Pipe Corrosion", "News", "2014-2016 (Flint Water Crisis Genesis)", "Energy & Climate", 5,
  "Emergency manager switching Flint's municipal water supply to corrosive river water without corrosion control inhibitors.",
  "1 = Severe Environmental Racism & Immediate Federal Emergency Public Health Intervention", "10 = Local Administrative Malpractice / Enforce State Accountability and Water Quality Standards", 2, 8, 5, 1, 8, 1);

add(2014, "2014_south_carolina_senate_special_tim_scott", "Tim Scott Elected First African American Senator from South in 130 Years", "News", "2014 (Historic Senate Milestone)", "Civil Rights & Social Issues", 6,
  "Winning special election with 61% of the vote, cementing conservative minority representation in the Senate.",
  "1 = Recognize Historical Milestone While Opposing Conservative Policy Positions", "10 = Celebrate Inspiring Example of American Opportunity, Meritocracy, and Colorblind Values", 2, 8, 7, 1, 9, 1);

add(2014, "2014_veterans_choice_act_passage", "Enactment of Veterans Access, Choice, and Accountability Act of 2014", "News", "2014 (Bipartisan VA Reform)", "Healthcare", 3,
  "Bipartisan $16B measure allowing veterans facing 30-day waits or living 40 miles away to access private healthcare providers.",
  "1 = Maintain Robust Funding for Public VA Infrastructure / Prevent Full Privatization", "10 = Expand Private Healthcare Choice for All Veterans as a Permanent Fundamental Right", 2, 8, 9, 1, 8, 1);

add(2014, "2014_clean_water_rule_wotus_proposed", "EPA & Army Corps Proposed 'Waters of the United States' (WOTUS) Rule", "News", "2014-2023 (WOTUS Regulatory Warfare)", "Energy & Climate", 3,
  "Clarifying federal Clean Water Act jurisdiction to encompass seasonal streams, headwaters, and adjacent prairie potholes.",
  "1 = Essential Science-Based Protection for the Drinking Water of 117 Million Americans", "10 = Massive Regulatory Land Grab Subjecting Farm Ponds and Ditches to Federal Permits", 2, 10, 10, 1, 10, 1);

add(2014, "2014_cliven_bundy_armed_standoff_bureau_land", "Armed Standoff at Bunkerville, Nevada over Unpaid Grazing Fees", "News", "2014 (Western Public Lands Sagebrush Rebellion)", "Civil Rights & Social Issues", 4,
  "Armed militia members pointing rifles at federal BLM agents attempting to impound cattle of rancher refusing to pay grazing fees.",
  "1 = Enforce Federal Law Against Armed Insurrectionists Threatening Public Servants", "10 = Defend Western Landowners Against Heavy-Handed Federal Tyranny on Sovereign State Lands", 2, 9, 5, 1, 10, 1);

add(2014, "2014_colorado_amendment_67_personhood_defeat", "Colorado Amendment 67 (Third Overwhelming Defeat of Fetal Personhood)", "News", "2014 (Personhood Rejected 65% to 35%)", "Civil Rights & Social Issues", 5,
  "Voters rejecting for the third time an initiative attempting to include 'unborn human beings' under state criminal codes.",
  "1 = Decisive Voter Rejection of Extreme Anti-Abortion Measures Threatening Reproductive Healthcare", "10 = Stand for Unborn Rights Despite Persistent Misleading Propaganda from Abortion Providers", 2, 9, 3, 1, 10, 1);

add(2014, "2014_california_water_bond_prop_1", "California Proposition 1 ($7.5 Billion Emergency Water Bond)", "News", "2014 (Historic Western Drought Response)", "Energy & Climate", 4,
  "Authorizing $7.5B in bonds to fund water storage reservoirs, groundwater cleanup, and ecosystem restoration during severe drought.",
  "1 = Invest in Sustainable Groundwater Management, Recycling, and Watershed Protection", "10 = Dedicate Maximum Funding to Dam Storage and Conveyance for Central Valley Agriculture", 2, 8, 7, 1, 8, 1);

add(2014, "2014_ndaa_detention_guantanamo_transfers", "NDAA Restrictions on Transferring Guantanamo Detainees to U.S. Soil", "News", "2013-2016 (Guantanamo Transfer Ban)", "Foreign Policy & Defense", 4,
  "Congressional riders barring the expenditure of defense funds to transfer any Guantanamo detainee to detention facilities in America.",
  "1 = Repeal Obstructionist Transfer Restrictions So Guantanamo Can Finally Be Closed", "10 = Bar Transfer of Hardened Terrorists to American Soil / Keep Them in Guantanamo Forever", 2, 9, 2, 1, 9, 1);

add(2014, "2014_usps_staples_union_boycott", "Postal Union Boycott Over USPS Retail Counters in Staples Stores", "News", "2014 (Postal Privatization Conflict)", "Labor & Welfare", 7,
  "American Postal Workers Union staging protests against pilot program staffing postal desks with non-union Staples employees.",
  "1 = Stop Stealth Privatization / Protect Good-Paying Union Postal Careers", "10 = Support Consumer Convenience and Cost Savings Through Retail Partnerships", 2, 8, 9, 1, 8, 1);

add(2014, "2014_fbi_encryption_going_dark", "FBI Director James Comey Warnings Over Smartphone 'Going Dark' Encryption", "News", "2014-2016 (Encryption & Apple Battle Precursor)", "Technology & Infrastructure", 5,
  "Warning that default smartphone encryption prevents law enforcement from executing court-authorized wiretaps and search warrants.",
  "1 = Strong End-to-End Encryption Is Essential for Cybersecurity and Privacy Against Hackers", "10 = Require Tech Giants to Provide Lawful Intercept Access to Prevent Terrorist Plots", 2, 7, 1, 1, 4, 1);

add(2014, "2014_trade_adjustment_assistance_renewal", "Trade Adjustment Assistance (TAA) Renewal for Displaced Workers", "Ideological", "1962-2022 (Trade Dislocation Arc)", "Trade & Globalism", 5,
  "Extending federal job training, wage subsidies, and health credits to manufacturing workers displaced by foreign trade.",
  "1 = Fully Fund and Expand TAA as an Indispensable Lifeline for Displaced Industrial Workers", "10 = TAA Is Ineffective Burial Insurance / Foster Dynamic Job Growth Through Deregulation", 2, 7, 9, 1, 6, 1);

add(2014, "2014_oil_rail_safety_bakken_crude", "DOT Emergency Safety Orders on Crude Oil Unit Trains ('Bomb Trains')", "News", "2013-2015 (Crude-by-Rail Explosion Arc)", "Technology & Infrastructure", 4,
  "Mandating thicker tank car shells, electronically controlled pneumatic brakes, and speed restrictions for volatile Bakken crude trains.",
  "1 = Enact Immediate Phaseout of Vulnerable DOT-111 Tank Cars to Protect Populated Towns", "10 = Allow Realistic Multi-Year Industry Compliance Timelines to Avoid Paralyzing Oil Transport", 2, 8, 8, 1, 8, 1);

add(2014, "2014_puerto_rico_chapter_9_recovery_act_void", "Federal Court Striking Down Puerto Rico's Public Corporation Debt Act", "News", "2014-2015 (Territorial Legal Vacuum)", "Economy & Taxation", 6,
  "Federal court holding that Puerto Rico cannot enact its own bankruptcy restructuring law because federal law preempts it.",
  "1 = Pass Federal Legislation Amending the Bankruptcy Code to Give Puerto Rico Restructuring Rights", "10 = Enforce Bond Contracts / Protect American Mutual Fund Investors from Territorial Default", 2, 8, 7, 1, 8, 1);

add(2014, "2014_hhs_secretary_sebelius_resignation", "HHS Secretary Kathleen Sebelius Resignation Following ACA Website Fiasco", "News", "2014 (Executive Accountability)", "Healthcare", 4,
  "Sebelius stepping down after overseeing the chaotic launch of the federal health exchange and facing calls for dismissal.",
  "1 = Recognize Dedication in Successfully Recovering the Site to Enroll 8 Million Americans", "10 = Long-Overdue Accountability for the Most Incompetent Federal Program Launch in History", 2, 9, 7, 1, 9, 1);

add(2014, "2014_russia_sanctions_sectoral_expansion", "Executive Orders Imposing Sectoral Sanctions on Russian Energy and Banking", "News", "2014-2022 (Sectoral Sanctions Program)", "Foreign Policy & Defense", 2,
  "Banning U.S. companies from providing deepwater, Arctic, or shale oil technology to Rosneft and Gazprom.",
  "1 = Escalate Targeted Sanctions to Cripple Putin's Military-Industrial Capability", "10 = Coordinate Tougher Sanctions with Hesitant European Allies to Prevent Russian Evasion", 3, 9, 4, 1, 8, 1);

add(2014, "2014_export_control_satellite_itar_reform", "ITAR Reform Moving Commercial Communications Satellites to Commerce List", "News", "2014 (Space Export Control Modernization)", "Technology & Infrastructure", 6,
  "Shifting commercial communication satellites and components from the strict State Department ITAR munition list to Commerce control.",
  "1 = Maintain Rigorous Nonproliferation Safeguards Over Dual-Use Aerospace Technologies", "10 = Revitalize U.S. Commercial Aerospace Competitiveness and Eliminate Outdated Export Barriers", 3, 7, 8, 2, 7, 1);

add(2014, "2014_north_korea_sony_hack_the_interview", "North Korean Cyberattack on Sony Pictures Over 'The Interview'", "News", "2014 (State-Sponsored Cyberattack)", "Foreign Policy & Defense", 3,
  "FBI formally blaming Pyongyang for destroying Sony's corporate network and leaking emails to suppress release of a satirical comedy.",
  "1 = Defend Free Artistic Expression Against State Terrorism / Expand Sanctions", "10 = Retaliate Decisively in Cyberspace / Relist North Korea as a State Sponsor of Terrorism", 3, 9, 3, 1, 9, 1);

add(2014, "2014_guam_self_determination_plebiscite_delays", "Guam Decolonization Registration & Chamorro Native Vote Dispute", "News", "2014 (Territorial Decolonization)", "Governance & Judiciary", 8,
  "Federal court lawsuits challenging Guam's proposed status plebiscite that limits registration to 'Native Inhabitants'.",
  "1 = Uphold Indigenous Chamorro Self-Determination Rights Under UN Charter", "10 = Enforce Fifteenth Amendment Prohibiting Race-Restricted Voting Lists in U.S. Territories", 3, 7, 4, 1, 8, 1);

add(2014, "2014_pension_multiemployer_mpra_act", "Multiemployer Pension Reform Act (MPRA Allowing Benefit Cuts)", "News", "2014 (Kline-Miller Enactment)", "Labor & Welfare", 5,
  "Allowing trustees of critically insolvent multiemployer union pension funds to cut vested benefits of current retirees.",
  "1 = Protect Retired Union Workers / Provide Federal Guarantees Without Cutting Promised Pensions", "10 = Prevent Catastrophic Systemic Insolvency of Multiemployer Plans and Protect the PBGC", 2, 8, 8, 1, 8, 1);

add(2014, "2014_epa_coal_plant_carbon_nsps_standards", "EPA New Source Performance Standards (NSPS) Banning New Coal Without CCS", "News", "2014-2016 (NSPS Carbon Rules)", "Energy & Climate", 3,
  "Setting carbon limits for new fossil-fired power plants that effectively make building new conventional coal plants impossible.",
  "1 = Accelerate Clean Energy Transition by Phasing Out Uncontrolled New Coal Combustion", "10 = Unlawful De Facto Ban on American Coal Energy Crippling Grid Reliability", 2, 10, 9, 1, 10, 1);

console.log('Bracket 2 total issues (2008, 2010, 2012, 2014):', ISSUES.length);

module.exports = ISSUES;
