// Coalition Builder: Party Chair — Demographic Migration Data
// Authoritative catalog of 100 semi-plausible interstate migration patterns and generational cohort definitions.

(function PartyChairDemographicMigrationDataModule() {
  const MIGRATION_TRENDS = [
    'Sun Belt Boom Vectors',
    'Rust Belt & Heartland Outmigration',
    'Mountain West Growth Corridors',
    'Climate & Cost-of-Living Dispersion',
    'Reverse Great Migration & Urban Renaissance',
  ];

  const MIGRATION_PATTERNS = [
    // =========================================================================
    // 1. Sun Belt Boom Vectors (Patterns 1–25)
    // =========================================================================
    {
      id: 'mig_001',
      name: 'Tech Corridor Relocation: Bay Area to Austin',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA'],
      destStates: ['TX'],
      voterVolume: 55000,
      ideologicalSkew: {
        econDelta: 0.15,
        socialDelta: -0.20,
        factionAffinities: { dem_abundance: 0.35, dem_neo_liberals: 0.25, swg_technocrats: 0.25, lib_true_libertarians: 0.15 }
      }
    },
    {
      id: 'mig_002',
      name: 'Empire State Retiree Exodus: New York to Central Florida',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['NY'],
      destStates: ['FL'],
      voterVolume: 65000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.15,
        factionAffinities: { gop_market_country_club: 0.35, gop_faith_and_flag: 0.25, swg_country_club_centrists: 0.25, swg_religious_moderates: 0.15 }
      }
    },
    {
      id: 'mig_003',
      name: 'Financial Sector Flight: Wall Street to Miami & Palm Beach',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['NY', 'NJ'],
      destStates: ['FL'],
      voterVolume: 45000,
      ideologicalSkew: {
        econDelta: -0.30,
        socialDelta: 0.05,
        factionAffinities: { gop_market_country_club: 0.45, lib_true_libertarians: 0.25, swg_country_club_centrists: 0.30 }
      }
    },
    {
      id: 'mig_004',
      name: 'Research Triangle Magnet: Boston to Raleigh-Durham',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['MA'],
      destStates: ['NC'],
      voterVolume: 35000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.25,
        factionAffinities: { dem_liberal_establishment: 0.40, swg_technocrats: 0.35, dem_abundance: 0.25 }
      }
    },
    {
      id: 'mig_005',
      name: 'Creative Economy Pipeline: Los Angeles to Fulton County',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA'],
      destStates: ['GA'],
      voterVolume: 32000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.30,
        factionAffinities: { dem_capital_l_left: 0.35, dem_black_voters: 0.35, swg_girlypops: 0.30 }
      }
    },
    {
      id: 'mig_006',
      name: 'Silicon Desert Expansion: Southern California to Phoenix East Valley',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA'],
      destStates: ['AZ'],
      voterVolume: 58000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { swg_technocrats: 0.35, gop_suburban_moderates: 0.30, dem_neo_liberals: 0.20, swg_working_class_latinos: 0.15 }
      }
    },
    {
      id: 'mig_007',
      name: 'Music City Corporate Influx: Chicago to Middle Tennessee',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['IL'],
      destStates: ['TN'],
      voterVolume: 42000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: -0.10,
        factionAffinities: { gop_suburban_moderates: 0.35, dem_liberal_establishment: 0.30, gop_market_country_club: 0.25, swg_podcast_bros: 0.10 }
      }
    },
    {
      id: 'mig_008',
      name: 'Low-Tax Haven Migration: Chicagoland to Southwest Florida',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['IL'],
      destStates: ['FL'],
      voterVolume: 52000,
      ideologicalSkew: {
        econDelta: -0.25,
        socialDelta: 0.20,
        factionAffinities: { gop_market_country_club: 0.40, gop_faith_and_flag: 0.30, swg_country_club_centrists: 0.30 }
      }
    },
    {
      id: 'mig_009',
      name: 'Lone Star Logistics Pipeline: Inland Empire to Dallas-Fort Worth',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA'],
      destStates: ['TX'],
      voterVolume: 48000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: 0.05,
        factionAffinities: { swg_hard_hats: 0.35, swg_working_class_latinos: 0.35, gop_market_country_club: 0.15, dem_blue_dog: 0.15 }
      }
    },
    {
      id: 'mig_010',
      name: 'Queen City Banking Expansion: New York/Connecticut to Charlotte',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['NY', 'CT'],
      destStates: ['NC'],
      voterVolume: 38000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: -0.10,
        factionAffinities: { gop_market_country_club: 0.35, dem_neo_liberals: 0.35, swg_country_club_centrists: 0.30 }
      }
    },
    {
      id: 'mig_011',
      name: 'Vegas Entertainment & Service Hub: Los Angeles to Clark County',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA'],
      destStates: ['NV'],
      voterVolume: 50000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.15,
        factionAffinities: { swg_working_class_latinos: 0.40, dem_liberal_establishment: 0.30, swg_hard_hats: 0.30 }
      }
    },
    {
      id: 'mig_012',
      name: 'Lowcountry Coastal Wealth Corridor: Mid-Atlantic to Charleston',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['VA', 'MD'],
      destStates: ['SC'],
      voterVolume: 32000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.10,
        factionAffinities: { gop_market_country_club: 0.40, swg_country_club_centrists: 0.35, gop_neo_cons: 0.25 }
      }
    },
    {
      id: 'mig_013',
      name: 'Central Florida Aerospace & Defense Boom: Ohio/Michigan to Space Coast',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['OH', 'MI'],
      destStates: ['FL'],
      voterVolume: 40000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.15,
        factionAffinities: { gop_neo_cons: 0.35, swg_technocrats: 0.35, gop_faith_and_flag: 0.30 }
      }
    },
    {
      id: 'mig_014',
      name: 'North Texas Telecom & Tech Influx: Northern Virginia to Collin County',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['VA', 'MD'],
      destStates: ['TX'],
      voterVolume: 36000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { swg_technocrats: 0.40, dem_neo_liberals: 0.30, gop_suburban_moderates: 0.30 }
      }
    },
    {
      id: 'mig_015',
      name: 'Tampa Bay Healthcare & Finance Wave: Pennsylvania to Pinellas/Hillsborough',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['PA', 'NJ'],
      destStates: ['FL'],
      voterVolume: 44000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.05,
        factionAffinities: { swg_true_centrists: 0.35, gop_suburban_moderates: 0.35, dem_liberal_establishment: 0.30 }
      }
    },
    {
      id: 'mig_016',
      name: 'Atlanta Exurban Family Migration: Midwest to Gwinnett & Forsyth',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['IL', 'OH'],
      destStates: ['GA'],
      voterVolume: 37000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.15,
        factionAffinities: { dem_liberal_establishment: 0.35, gop_suburban_moderates: 0.35, gop_suburban_moderates: 0.30 }
      }
    },
    {
      id: 'mig_017',
      name: 'Optics & Defense Corridor: Puget Sound to Pima County',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['WA'],
      destStates: ['AZ'],
      voterVolume: 24000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.20,
        factionAffinities: { dem_abundance: 0.40, swg_technocrats: 0.35, lib_true_libertarians: 0.25 }
      }
    },
    {
      id: 'mig_018',
      name: 'Houston Energy Transition Influx: Northeast to Harris & Fort Bend',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['NY', 'PA'],
      destStates: ['TX'],
      voterVolume: 41000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.10,
        factionAffinities: { dem_abundance: 0.35, swg_working_class_latinos: 0.35, gop_market_country_club: 0.30 }
      }
    },
    {
      id: 'mig_019',
      name: 'Piedmont Advanced Manufacturing Reshoring: Upper Midwest to Triad',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['MI', 'IN'],
      destStates: ['NC'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: 0.10,
        factionAffinities: { swg_hard_hats: 0.40, gop_maga: 0.30, dem_blue_dog: 0.30 }
      }
    },
    {
      id: 'mig_020',
      name: 'Northern Nevada Clean Tech & Battery Belt: Silicon Valley to Washoe County',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA'],
      destStates: ['NV'],
      voterVolume: 31000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.15,
        factionAffinities: { swg_technocrats: 0.40, lib_true_libertarians: 0.30, dem_abundance: 0.30 }
      }
    },
    {
      id: 'mig_021',
      name: 'Rocket City Defense Corridor: Southern California to Huntsville',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['CA', 'CO'],
      destStates: ['AL', 'TN'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.10,
        factionAffinities: { gop_neo_cons: 0.40, swg_technocrats: 0.35, lib_true_libertarians: 0.25 }
      }
    },
    {
      id: 'mig_022',
      name: 'First Coast Logistics & Maritime Migration: Mid-Atlantic to Jacksonville',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['NY', 'NJ'],
      destStates: ['FL'],
      voterVolume: 39000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_faith_and_flag: 0.40, swg_hard_hats: 0.35, gop_market_country_club: 0.25 }
      }
    },
    {
      id: 'mig_023',
      name: 'Cybersecurity Capital Influx: Maryland to Bexar County',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['MD', 'VA'],
      destStates: ['TX'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.10,
        factionAffinities: { swg_technocrats: 0.35, swg_working_class_latinos: 0.35, dem_liberal_establishment: 0.30 }
      }
    },
    {
      id: 'mig_024',
      name: 'Upstate SC Automotive Corridor: Detroit Metro to Greenville-Spartanburg',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['MI'],
      destStates: ['SC'],
      voterVolume: 28000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.15,
        factionAffinities: { gop_faith_and_flag: 0.35, swg_hard_hats: 0.35, gop_suburban_moderates: 0.30 }
      }
    },
    {
      id: 'mig_025',
      name: 'Emerald Coast Sun & Service Wave: Midwest to Panhandle Florida',
      trend: 'Sun Belt Boom Vectors',
      originStates: ['OH', 'IN'],
      destStates: ['FL', 'AL'],
      voterVolume: 26000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.25,
        factionAffinities: { gop_faith_and_flag: 0.45, gop_maga: 0.35, swg_grillers: 0.20 }
      }
    },

    // =========================================================================
    // 2. Rust Belt & Heartland Outmigration (Patterns 26–50)
    // =========================================================================
    {
      id: 'mig_026',
      name: 'Great Lakes Industrial Depopulation: Cleveland to Central Florida',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['OH'],
      destStates: ['FL'],
      voterVolume: 43000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.10,
        factionAffinities: { swg_hard_hats: 0.40, gop_suburban_moderates: 0.35, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_027',
      name: 'Motor City Workforce Dispersion: Detroit to Greater Atlanta',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['MI'],
      destStates: ['GA'],
      voterVolume: 39000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.20,
        factionAffinities: { dem_black_voters: 0.45, dem_liberal_establishment: 0.30, swg_working_class_latinos: 0.25 }
      }
    },
    {
      id: 'mig_028',
      name: 'Allegheny Energy & Industrial Relocation: Pittsburgh to Carolinas',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['PA'],
      destStates: ['NC', 'SC'],
      voterVolume: 35000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: 0.05,
        factionAffinities: { swg_hard_hats: 0.35, gop_suburban_moderates: 0.35, swg_true_centrists: 0.30 }
      }
    },
    {
      id: 'mig_029',
      name: 'Midwest Graduate Brain Drain: Ohio & Indiana to Austin/Denver',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['OH', 'IN'],
      destStates: ['TX', 'CO'],
      voterVolume: 46000,
      ideologicalSkew: {
        econDelta: 0.15,
        socialDelta: -0.25,
        factionAffinities: { dem_bernie_bros: 0.35, dem_abundance: 0.35, swg_technocrats: 0.30 }
      }
    },
    {
      id: 'mig_030',
      name: 'Empire State Canal Corridor Departure: Buffalo/Rochester to Tampa',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['NY'],
      destStates: ['FL'],
      voterVolume: 37000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.10,
        factionAffinities: { gop_market_country_club: 0.40, swg_true_centrists: 0.35, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_031',
      name: 'Prairie State Fiscal Exodus: Cook County to Northwest Indiana & Sun Belt',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['IL'],
      destStates: ['IN', 'TN'],
      voterVolume: 49000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.10,
        factionAffinities: { gop_market_country_club: 0.35, gop_suburban_moderates: 0.35, gop_traditional_farmers: 0.30 }
      }
    },
    {
      id: 'mig_032',
      name: 'Appalachian Energy Outflow: West Virginia to Charlotte & Shenandoah',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['WV'],
      destStates: ['NC', 'VA'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.20,
        factionAffinities: { gop_maga: 0.45, gop_faith_and_flag: 0.35, swg_hard_hats: 0.20 }
      }
    },
    {
      id: 'mig_033',
      name: 'Steel Valley Retirement Wave: Youngstown to Maricopa County',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['OH', 'PA'],
      destStates: ['AZ'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.10,
        factionAffinities: { gop_suburban_moderates: 0.40, swg_grillers: 0.35, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_034',
      name: 'Cream City Blue-Collar Migration: Southeast Wisconsin to Nashville/Atlanta',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['WI'],
      destStates: ['TN', 'GA'],
      voterVolume: 25000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.05,
        factionAffinities: { swg_hard_hats: 0.40, dem_liberal_establishment: 0.30, gop_maga: 0.30 }
      }
    },
    {
      id: 'mig_035',
      name: 'Gateway City Corporate Dispersion: St. Louis to Texas Metros',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['MO'],
      destStates: ['TX'],
      voterVolume: 33000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: -0.05,
        factionAffinities: { gop_suburban_moderates: 0.40, dem_liberal_establishment: 0.30, gop_market_country_club: 0.30 }
      }
    },
    {
      id: 'mig_036',
      name: 'Flint & Saginaw Industrial Restructuring Outflow to Texas Gulf',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['MI'],
      destStates: ['TX'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: 0.00,
        factionAffinities: { swg_hard_hats: 0.45, dem_black_voters: 0.30, swg_working_class_latinos: 0.25 }
      }
    },
    {
      id: 'mig_037',
      name: 'Upper Ohio Valley Departure: Wheeling/Weirton to Piedmont Region',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['WV', 'OH'],
      destStates: ['NC', 'SC'],
      voterVolume: 19000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.15,
        factionAffinities: { gop_faith_and_flag: 0.40, gop_maga: 0.35, swg_hard_hats: 0.25 }
      }
    },
    {
      id: 'mig_038',
      name: 'Corn Belt Consolidation: Rural Iowa/Illinois to Texas & Kansas City',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['IA', 'IL'],
      destStates: ['TX', 'MO'],
      voterVolume: 26000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_traditional_farmers: 0.45, gop_suburban_moderates: 0.30, swg_grillers: 0.25 }
      }
    },
    {
      id: 'mig_039',
      name: 'Lake Erie Cold Belt Departure: Erie & Toledo to Gulf Coast Florida',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['PA', 'OH'],
      destStates: ['FL'],
      voterVolume: 31000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_market_country_club: 0.40, swg_country_club_centrists: 0.35, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_040',
      name: 'Central Pennsylvania Southern Corridor: Harrisburg/York to Raleigh',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['PA'],
      destStates: ['NC', 'VA'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.05,
        factionAffinities: { gop_suburban_moderates: 0.40, gop_suburban_moderates: 0.30, dem_liberal_establishment: 0.30 }
      }
    },
    {
      id: 'mig_041',
      name: 'Hoosier Skilled Trade Relocation: South Bend to Houston Corridor',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['IN'],
      destStates: ['TX'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: 0.05,
        factionAffinities: { swg_hard_hats: 0.45, gop_market_country_club: 0.30, swg_grillers: 0.25 }
      }
    },
    {
      id: 'mig_042',
      name: 'Southern Tier Tech & Youth Flight: Binghamton/Elmira to Wake County',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['NY'],
      destStates: ['NC'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.20,
        factionAffinities: { dem_abundance: 0.40, swg_technocrats: 0.35, dem_bernie_bros: 0.25 }
      }
    },
    {
      id: 'mig_043',
      name: 'Quad Cities Manufacturing Flight to Clarksville & Mid-South',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['IL', 'IA'],
      destStates: ['TN', 'AL'],
      voterVolume: 20000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: 0.10,
        factionAffinities: { swg_hard_hats: 0.45, gop_maga: 0.30, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_044',
      name: 'Downstate Illinois Public Sector Exodus: Peoria/Springfield to Sun Belt',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['IL'],
      destStates: ['FL', 'TX'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.10,
        factionAffinities: { gop_suburban_moderates: 0.40, swg_country_club_centrists: 0.35, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_045',
      name: 'Northwest Ohio Agricultural Departure to Cumberland Plateau',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['OH'],
      destStates: ['TN'],
      voterVolume: 19000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.20,
        factionAffinities: { gop_faith_and_flag: 0.45, gop_traditional_farmers: 0.35, swg_grillers: 0.20 }
      }
    },
    {
      id: 'mig_046',
      name: 'Iron Range Resource Extraction Shift: Northern Minnesota to Nevada Mining',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['MN'],
      destStates: ['NV'],
      voterVolume: 17000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: 0.10,
        factionAffinities: { swg_hard_hats: 0.45, lib_true_libertarians: 0.30, gop_western_mavericks: 0.25 }
      }
    },
    {
      id: 'mig_047',
      name: 'Akron Rubber Capital Retirement Diaspora to Space Coast',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['OH'],
      destStates: ['FL'],
      voterVolume: 25000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.10,
        factionAffinities: { gop_market_country_club: 0.40, swg_country_club_centrists: 0.35, swg_grillers: 0.25 }
      }
    },
    {
      id: 'mig_048',
      name: 'Northeast Ohio Medical Professional Influx to Sun Belt Hospital Systems',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['OH'],
      destStates: ['TX', 'FL'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.10,
        factionAffinities: { dem_liberal_establishment: 0.35, gop_suburban_moderates: 0.35, swg_technocrats: 0.30 }
      }
    },
    {
      id: 'mig_049',
      name: 'Lackawanna Valley Logistics Outflow: Scranton to Central Texas',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['PA'],
      destStates: ['TX'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: 0.00,
        factionAffinities: { swg_hard_hats: 0.40, swg_working_class_latinos: 0.35, dem_blue_dog: 0.25 }
      }
    },
    {
      id: 'mig_050',
      name: 'Macomb County Sun Migration: Suburban Detroit to Lee/Collier Counties',
      trend: 'Rust Belt & Heartland Outmigration',
      originStates: ['MI'],
      destStates: ['FL'],
      voterVolume: 33000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.20,
        factionAffinities: { gop_maga: 0.45, gop_market_country_club: 0.35, swg_hard_hats: 0.20 }
      }
    },

    // =========================================================================
    // 3. Mountain West Growth Corridors (Patterns 51–70)
    // =========================================================================
    {
      id: 'mig_051',
      name: 'Pacific Coast Tech Influx: San Francisco & Seattle to Denver/Boulder',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA', 'WA'],
      destStates: ['CO'],
      voterVolume: 47000,
      ideologicalSkew: {
        econDelta: 0.15,
        socialDelta: -0.25,
        factionAffinities: { dem_abundance: 0.40, swg_technocrats: 0.30, grn_yimby: 0.30 }
      }
    },
    {
      id: 'mig_052',
      name: 'Treasure Valley Boom: California Central Valley to Boise & Nampa',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA'],
      destStates: ['ID'],
      voterVolume: 41000,
      ideologicalSkew: {
        econDelta: -0.25,
        socialDelta: 0.25,
        factionAffinities: { gop_faith_and_flag: 0.40, gop_western_mavericks: 0.35, lib_true_libertarians: 0.25 }
      }
    },
    {
      id: 'mig_053',
      name: 'Silicon Slopes Surge: Puget Sound to Salt Lake & Utah County',
      trend: 'Mountain West Growth Corridors',
      originStates: ['WA', 'CA'],
      destStates: ['UT'],
      voterVolume: 36000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { swg_technocrats: 0.40, gop_mormons: 0.30, dem_abundance: 0.30 }
      }
    },
    {
      id: 'mig_054',
      name: 'Gallatin Valley Amenity Magnet: Portland & Seattle to Bozeman & Missoula',
      trend: 'Mountain West Growth Corridors',
      originStates: ['WA', 'OR'],
      destStates: ['MT'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.20,
        factionAffinities: { dem_capital_l_left: 0.35, grn_eco_socialist_vanguard: 0.35, swg_girlypops: 0.30 }
      }
    },
    {
      id: 'mig_055',
      name: 'Mojave & High Desert Influx: Los Angeles Basin to Clark County',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA'],
      destStates: ['NV'],
      voterVolume: 49000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.10,
        factionAffinities: { swg_working_class_latinos: 0.40, swg_hard_hats: 0.35, dem_liberal_establishment: 0.25 }
      }
    },
    {
      id: 'mig_056',
      name: 'Wasatch Front Heritage Return: California Diaspora to Provo & Ogden',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA'],
      destStates: ['UT'],
      voterVolume: 33000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_mormons: 0.50, gop_suburban_moderates: 0.30, swg_religious_moderates: 0.20 }
      }
    },
    {
      id: 'mig_057',
      name: 'Panhandle Idaho Conservative Influx: Western Washington to Coeur d\'Alene',
      trend: 'Mountain West Growth Corridors',
      originStates: ['WA'],
      destStates: ['ID'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: -0.25,
        socialDelta: 0.30,
        factionAffinities: { gop_maga: 0.45, gop_blood_and_soil: 0.30, lib_true_libertarians: 0.25 }
      }
    },
    {
      id: 'mig_058',
      name: 'Aerospace & Space Command Influx: Northern Virginia to Colorado Springs',
      trend: 'Mountain West Growth Corridors',
      originStates: ['VA', 'MD'],
      destStates: ['CO'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.10,
        factionAffinities: { gop_neo_cons: 0.40, swg_technocrats: 0.35, gop_faith_and_flag: 0.25 }
      }
    },
    {
      id: 'mig_059',
      name: 'Big Sky Remote Work Wealth Wave: Bay Area to Flathead & Park Counties',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA'],
      destStates: ['MT', 'WY'],
      voterVolume: 19000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.15,
        factionAffinities: { dem_abundance: 0.40, swg_country_club_centrists: 0.35, lib_true_libertarians: 0.25 }
      }
    },
    {
      id: 'mig_060',
      name: 'Magic Valley Agtech & Food Processing: Oregon to Twin Falls/Idaho Falls',
      trend: 'Mountain West Growth Corridors',
      originStates: ['OR'],
      destStates: ['ID'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_traditional_farmers: 0.40, gop_mormons: 0.35, swg_working_class_latinos: 0.25 }
      }
    },
    {
      id: 'mig_061',
      name: 'Front Range Biotech Corridor: Southern California to Fort Collins',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA'],
      destStates: ['CO'],
      voterVolume: 31000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.20,
        factionAffinities: { dem_abundance: 0.40, swg_technocrats: 0.35, grn_yimby: 0.25 }
      }
    },
    {
      id: 'mig_062',
      name: 'Red Rock Retirement & Sunshine Corridor: California to St. George',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA', 'NV'],
      destStates: ['UT'],
      voterVolume: 25000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.20,
        factionAffinities: { gop_mormons: 0.40, gop_market_country_club: 0.35, swg_country_club_centrists: 0.25 }
      }
    },
    {
      id: 'mig_063',
      name: 'Truckee Meadows Clean Tech Diaspora: Bay Area to Reno/Sparks',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA'],
      destStates: ['NV'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { swg_technocrats: 0.40, lib_true_libertarians: 0.35, dem_abundance: 0.25 }
      }
    },
    {
      id: 'mig_064',
      name: 'Western Slope Influx: Denver Metro to Grand Junction',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CO', 'CA'],
      destStates: ['CO'],
      voterVolume: 18000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.05,
        factionAffinities: { gop_western_mavericks: 0.40, swg_grillers: 0.35, lib_true_libertarians: 0.25 }
      }
    },
    {
      id: 'mig_065',
      name: 'Powder River & High Plains Energy Influx: New Mexico to Wyoming Basin',
      trend: 'Mountain West Growth Corridors',
      originStates: ['NM', 'TX'],
      destStates: ['WY'],
      voterVolume: 16000,
      ideologicalSkew: {
        econDelta: -0.20,
        socialDelta: 0.20,
        factionAffinities: { gop_maga: 0.45, gop_western_mavericks: 0.35, swg_hard_hats: 0.20 }
      }
    },
    {
      id: 'mig_066',
      name: 'Northwest Liberty Movement: Western Washington to Northern Idaho',
      trend: 'Mountain West Growth Corridors',
      originStates: ['WA', 'OR'],
      destStates: ['ID', 'MT'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: -0.30,
        socialDelta: 0.25,
        factionAffinities: { lib_true_libertarians: 0.40, gop_western_mavericks: 0.35, con_christian_dominionists: 0.25 }
      }
    },
    {
      id: 'mig_067',
      name: 'High Country Professional Haven: Chicago to Eagle & Summit Counties',
      trend: 'Mountain West Growth Corridors',
      originStates: ['IL'],
      destStates: ['CO'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.20,
        factionAffinities: { dem_liberal_establishment: 0.40, swg_country_club_centrists: 0.35, grn_yimby: 0.25 }
      }
    },
    {
      id: 'mig_068',
      name: 'Salt Lake Financial Pipeline: New York to Salt Lake City Core',
      trend: 'Mountain West Growth Corridors',
      originStates: ['NY'],
      destStates: ['UT'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: -0.10,
        factionAffinities: { gop_market_country_club: 0.35, dem_neo_liberals: 0.35, swg_technocrats: 0.30 }
      }
    },
    {
      id: 'mig_069',
      name: 'Ranching & Wilderness Retreat: Mid-Atlantic to Sheridan & Park Counties',
      trend: 'Mountain West Growth Corridors',
      originStates: ['PA', 'VA'],
      destStates: ['WY', 'MT'],
      voterVolume: 17000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_western_mavericks: 0.45, gop_market_country_club: 0.35, lib_true_libertarians: 0.20 }
      }
    },
    {
      id: 'mig_070',
      name: 'Wood River Valley Wealth Corridor: California to Blaine County',
      trend: 'Mountain West Growth Corridors',
      originStates: ['CA', 'WA'],
      destStates: ['ID'],
      voterVolume: 19000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.25,
        factionAffinities: { dem_liberal_establishment: 0.45, swg_country_club_centrists: 0.35, grn_eco_socialist_vanguard: 0.20 }
      }
    },

    // =========================================================================
    // 4. Climate & Cost-of-Living Dispersion (Patterns 71–85)
    // =========================================================================
    {
      id: 'mig_071',
      name: 'Silicon Heartland Magnet: Coastal Flight to Columbus Metro',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['NY', 'CA'],
      destStates: ['OH'],
      voterVolume: 31000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.15,
        factionAffinities: { dem_abundance: 0.40, swg_technocrats: 0.35, dem_neo_liberals: 0.25 }
      }
    },
    {
      id: 'mig_072',
      name: 'Heartland Housing Relief: Chicago to Indianapolis Donut Counties',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['IL'],
      destStates: ['IN'],
      voterVolume: 35000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.05,
        factionAffinities: { gop_suburban_moderates: 0.40, gop_suburban_moderates: 0.35, swg_grillers: 0.25 }
      }
    },
    {
      id: 'mig_073',
      name: 'California Affordability Outflow: Bay Area to Kansas City Suburbs',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['CA'],
      destStates: ['MO', 'KS'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { dem_liberal_establishment: 0.35, swg_technocrats: 0.35, gop_suburban_moderates: 0.30 }
      }
    },
    {
      id: 'mig_074',
      name: 'Mid-Atlantic Sea-Level Risk Relocation: Tidewater VA/MD to Piedmont NC',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['VA', 'MD'],
      destStates: ['NC'],
      voterVolume: 33000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.10,
        factionAffinities: { swg_technocrats: 0.35, dem_liberal_establishment: 0.35, gop_suburban_moderates: 0.30 }
      }
    },
    {
      id: 'mig_075',
      name: 'New England Real Estate Pressure Dispersion: Greater Boston to Southern NH & ME',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['MA'],
      destStates: ['NH', 'ME'],
      voterVolume: 26000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.20,
        factionAffinities: { dem_liberal_establishment: 0.40, lib_true_libertarians: 0.30, grn_yimby: 0.30 }
      }
    },
    {
      id: 'mig_076',
      name: 'Gulf Coast Flood Risk Dispersion: South Louisiana to North Texas & Arkansas',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['LA'],
      destStates: ['TX', 'AR'],
      voterVolume: 33000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: 0.15,
        factionAffinities: { gop_faith_and_flag: 0.40, swg_hard_hats: 0.35, dem_faith_based_liberals: 0.25 }
      }
    },
    {
      id: 'mig_077',
      name: 'Sunshine State Insurance Shock Flight: South Florida to North Georgia & Western NC',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['FL'],
      destStates: ['GA', 'NC'],
      voterVolume: 39000,
      ideologicalSkew: {
        econDelta: -0.05,
        socialDelta: 0.05,
        factionAffinities: { gop_market_country_club: 0.35, swg_country_club_centrists: 0.35, swg_grillers: 0.30 }
      }
    },
    {
      id: 'mig_078',
      name: 'Pacific Wildfire Season Departure: Oregon/Washington to Blue Ridge Mountains',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['OR', 'WA'],
      destStates: ['NC', 'VA'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.20,
        factionAffinities: { grn_eco_socialist_vanguard: 0.35, dem_capital_l_left: 0.35, swg_girlypops: 0.30 }
      }
    },
    {
      id: 'mig_079',
      name: 'Tri-State High-Tax Escape: New Jersey to Lehigh Valley & Poconos',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['NJ'],
      destStates: ['PA'],
      voterVolume: 36000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.05,
        factionAffinities: { gop_suburban_moderates: 0.40, gop_suburban_moderates: 0.35, swg_hard_hats: 0.25 }
      }
    },
    {
      id: 'mig_080',
      name: 'Upper Midwest Quality-of-Life Influx: California to Madison & Twin Cities',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['CA'],
      destStates: ['WI', 'MN'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: 0.15,
        socialDelta: -0.25,
        factionAffinities: { dem_bernie_bros: 0.35, dem_abundance: 0.35, grn_yimby: 0.30 }
      }
    },
    {
      id: 'mig_081',
      name: 'Great Lakes Fresh Water Climate Haven: Desert Southwest to Michigan & Wisconsin',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['AZ', 'NV'],
      destStates: ['MI', 'WI'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.10,
        factionAffinities: { dem_abundance: 0.35, swg_true_centrists: 0.35, swg_technocrats: 0.30 }
      }
    },
    {
      id: 'mig_082',
      name: 'Mid-South Healthcare & Tech Corridor: Boston/NY to Birmingham & Huntsville',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['MA', 'NY'],
      destStates: ['AL'],
      voterVolume: 21000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.10,
        factionAffinities: { dem_liberal_establishment: 0.35, swg_technocrats: 0.35, gop_suburban_moderates: 0.30 }
      }
    },
    {
      id: 'mig_083',
      name: 'Appalachian Plateau Affordability Surge: Mid-Atlantic to Eastern Tennessee',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['NY', 'MD'],
      destStates: ['TN', 'VA'],
      voterVolume: 28000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_faith_and_flag: 0.40, gop_western_mavericks: 0.35, swg_grillers: 0.25 }
      }
    },
    {
      id: 'mig_084',
      name: 'Coastal Storm Weariness Departure: Tampa Bay to Chattanooga & Knoxville',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['FL'],
      destStates: ['TN'],
      voterVolume: 31000,
      ideologicalSkew: {
        econDelta: -0.10,
        socialDelta: 0.10,
        factionAffinities: { gop_market_country_club: 0.35, gop_suburban_moderates: 0.35, swg_religious_moderates: 0.30 }
      }
    },
    {
      id: 'mig_085',
      name: 'Desert Water Stress Realignment: Southern California to Arkansas & Ozarks',
      trend: 'Climate & Cost-of-Living Dispersion',
      originStates: ['CA'],
      destStates: ['AR', 'MO'],
      voterVolume: 22000,
      ideologicalSkew: {
        econDelta: -0.15,
        socialDelta: 0.15,
        factionAffinities: { gop_traditional_farmers: 0.40, lib_true_libertarians: 0.35, swg_hard_hats: 0.25 }
      }
    },

    // =========================================================================
    // 5. Reverse Great Migration & Urban Renaissance (Patterns 86–100)
    // =========================================================================
    {
      id: 'mig_086',
      name: 'Historic Heritage Return: Chicago South Side to Metro Atlanta',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['IL'],
      destStates: ['GA'],
      voterVolume: 46000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.20,
        factionAffinities: { dem_black_voters: 0.55, dem_faith_based_liberals: 0.25, dem_liberal_establishment: 0.20 }
      }
    },
    {
      id: 'mig_087',
      name: 'Black Professional Corridor: New York/Philadelphia to Charlotte & Raleigh',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['NY', 'PA'],
      destStates: ['NC'],
      voterVolume: 41000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.20,
        factionAffinities: { dem_black_voters: 0.50, dem_liberal_establishment: 0.30, gop_suburban_moderates: 0.20 }
      }
    },
    {
      id: 'mig_088',
      name: 'DMV Southern Expansion: Washington DC to Richmond & Hampton Roads',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['DC', 'MD'],
      destStates: ['VA'],
      voterVolume: 36000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.25,
        factionAffinities: { dem_black_voters: 0.40, dem_liberal_establishment: 0.35, swg_technocrats: 0.25 }
      }
    },
    {
      id: 'mig_089',
      name: 'Great Lakes Heritage Reconnection: Detroit & Cleveland to Houston Suburbs',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['MI', 'OH'],
      destStates: ['TX'],
      voterVolume: 39000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.15,
        factionAffinities: { dem_black_voters: 0.45, swg_working_class_latinos: 0.30, dem_faith_based_liberals: 0.25 }
      }
    },
    {
      id: 'mig_090',
      name: 'Chesapeake Suburban Spillover: Baltimore to Central Virginia',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['MD'],
      destStates: ['VA'],
      voterVolume: 27000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { dem_liberal_establishment: 0.40, dem_black_voters: 0.35, gop_suburban_moderates: 0.25 }
      }
    },
    {
      id: 'mig_091',
      name: 'Tech & Creative Return: Bay Area to Atlanta Beltline & Westside',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['CA'],
      destStates: ['GA'],
      voterVolume: 29000,
      ideologicalSkew: {
        econDelta: 0.15,
        socialDelta: -0.25,
        factionAffinities: { dem_black_voters: 0.40, dem_abundance: 0.35, swg_technocrats: 0.25 }
      }
    },
    {
      id: 'mig_092',
      name: 'Texas Triangle Multicultural Wave: Los Angeles to Dallas Southern Sector',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['CA'],
      destStates: ['TX'],
      voterVolume: 43000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { dem_black_voters: 0.40, swg_working_class_latinos: 0.35, dem_liberal_establishment: 0.25 }
      }
    },
    {
      id: 'mig_093',
      name: 'Magic City Professional Influx: New York City to Birmingham Core',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['NY'],
      destStates: ['AL'],
      voterVolume: 23000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.20,
        factionAffinities: { dem_black_voters: 0.50, dem_liberal_establishment: 0.30, swg_religious_moderates: 0.20 }
      }
    },
    {
      id: 'mig_094',
      name: 'Gullah-Geechee Cultural Return: Northeast to Savannah & Coastal SC',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['PA', 'NY'],
      destStates: ['GA', 'SC'],
      voterVolume: 26000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.15,
        factionAffinities: { dem_black_voters: 0.50, dem_faith_based_liberals: 0.30, swg_religious_moderates: 0.20 }
      }
    },
    {
      id: 'mig_095',
      name: 'Mid-South Healthcare & Heritage Pipeline: New York to Shelby County',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['NY', 'NJ'],
      destStates: ['TN'],
      voterVolume: 25000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.15,
        factionAffinities: { dem_black_voters: 0.50, dem_faith_based_liberals: 0.30, swg_true_centrists: 0.20 }
      }
    },
    {
      id: 'mig_096',
      name: 'HBCU Academic & Professional Magnet: Chicago/Detroit to Greensboro & Durham',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['IL', 'MI'],
      destStates: ['NC'],
      voterVolume: 24000,
      ideologicalSkew: {
        econDelta: 0.10,
        socialDelta: -0.25,
        factionAffinities: { dem_black_voters: 0.45, dem_bernie_bros: 0.30, dem_capital_l_left: 0.25 }
      }
    },
    {
      id: 'mig_097',
      name: 'Heartland Urban Return: Chicago & Gary to Greater Houston',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['IL', 'IN'],
      destStates: ['TX'],
      voterVolume: 33000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.15,
        factionAffinities: { dem_black_voters: 0.45, swg_working_class_latinos: 0.30, dem_liberal_establishment: 0.25 }
      }
    },
    {
      id: 'mig_098',
      name: 'Music & Creative Southern Diaspora: NYC Outer Boroughs to Davidson County',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['NY'],
      destStates: ['TN'],
      voterVolume: 28000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.20,
        factionAffinities: { dem_liberal_establishment: 0.35, dem_black_voters: 0.35, swg_girlypops: 0.30 }
      }
    },
    {
      id: 'mig_099',
      name: 'Southwestern Tejano Corridor: East Los Angeles to San Antonio & Austin',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['CA'],
      destStates: ['TX'],
      voterVolume: 45000,
      ideologicalSkew: {
        econDelta: 0.00,
        socialDelta: -0.10,
        factionAffinities: { swg_working_class_latinos: 0.50, dem_traditional_latin: 0.30, dem_liberal_establishment: 0.20 }
      }
    },
    {
      id: 'mig_100',
      name: 'Boricua & Caribbean Southern Diaspora: Tri-State to Osceola & Orange Counties',
      trend: 'Reverse Great Migration & Urban Renaissance',
      originStates: ['NY', 'NJ'],
      destStates: ['FL'],
      voterVolume: 43000,
      ideologicalSkew: {
        econDelta: 0.05,
        socialDelta: -0.10,
        factionAffinities: { dem_traditional_latin: 0.45, swg_working_class_latinos: 0.35, dem_liberal_establishment: 0.20 }
      }
    }
  ];

  const MIGRATION_PATTERNS_BY_ID = Object.fromEntries(
    MIGRATION_PATTERNS.map((p) => [p.id, p])
  );

  // =========================================================================
  // Chunk 5.3: Generational Cohort Definitions
  // =========================================================================
  const GENERATIONAL_COHORTS = {
    silent_boomers: {
      id: 'silent_boomers',
      name: 'Silent Generation & Older Boomers',
      birthYears: 'Pre-1955',
      cycleMortalityRate: 0.015, // -1.5% natural attrition per 2-year cycle
      coreFactions: ['gop_faith_and_flag', 'gop_paleocons', 'dem_faith_based_liberals', 'swg_country_club_centrists'],
      description: 'Senior electorate; aging out naturally over multi-decade cycles.'
    },
    boomers_genx: {
      id: 'boomers_genx',
      name: 'Boomers & Older Gen X',
      birthYears: '1955–1970',
      cycleSeniorShiftRate: 0.012, // Maturing into senior swing factions
      coreFactions: ['swg_country_club_centrists', 'swg_religious_moderates', 'gop_market_country_club', 'dem_liberal_establishment'],
      description: 'Older voters transitioning into senior swing segments and property-tax conscious voting.'
    },
    genx_millennials: {
      id: 'genx_millennials',
      name: 'Gen X & Millennials',
      birthYears: '1971–1996',
      suburbanMaturityRate: 0.010, // Maturing into suburban homeowners
      coreFactions: ['gop_suburban_moderates', 'dem_liberal_establishment', 'gop_suburban_moderates', 'swg_hard_hats'],
      description: 'Prime earning and family-forming cohort focused on cost-of-living and school districts.'
    },
    gen_z: {
      id: 'gen_z',
      name: 'Generation Z',
      birthYears: '1997–2012',
      peakVotingAscentRate: 0.014, // Ascending into peak voting participation
      coreFactions: ['dem_capital_l_left', 'dem_abundance', 'swg_technocrats', 'swg_podcast_bros', 'lib_true_libertarians', 'grn_eco_socialist_vanguard'],
      description: 'Youth cohort motivated by climate, tech, and economic independence.'
    },
    gen_alpha: {
      id: 'gen_alpha',
      name: 'Generation Alpha',
      birthYears: '2013–2028',
      entryYear: 2030, // Aging into the electorate starting at the 2030 cycle
      cycleEntryRate: 0.015, // Replaces aging-out cohorts (+1.5% equivalent)
      coreFactions: ['swg_technocrats', 'swg_girlypops', 'swg_podcast_bros', 'lib_ancaps', 'grn_yimby', 'dem_bernie_bros'],
      description: 'Digital-native emerging cohort, highly skeptical of traditional party duopolies and responsive to anti-establishment themes.'
    }
  };

  function getMigrationPatternsByTrend(trend) {
    return MIGRATION_PATTERNS.filter((p) => p.trend === trend);
  }

  const exportObj = {
    MIGRATION_TRENDS,
    MIGRATION_PATTERNS,
    MIGRATION_PATTERNS_BY_ID,
    GENERATIONAL_COHORTS,
    getMigrationPatternsByTrend,
  };

  if (typeof window !== 'undefined') {
    window.PartyChairData = window.PartyChairData || {};
    window.PartyChairData.MIGRATION_TRENDS = MIGRATION_TRENDS;
    window.PartyChairData.MIGRATION_PATTERNS = MIGRATION_PATTERNS;
    window.PartyChairData.MIGRATION_PATTERNS_BY_ID = MIGRATION_PATTERNS_BY_ID;
    window.PartyChairData.GENERATIONAL_COHORTS = GENERATIONAL_COHORTS;
    window.PartyChairData.DEMOGRAPHIC_MIGRATION_DATA = exportObj;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportObj;
  }
})();
