// ============================================================================
// COALITION BUILDER: PARTY CHAIR — VERSION 0.16.5 FACTION MATRIX
// 155,000,000 represented voters, zero variance across all 51 jurisdictions.
// Starting faction happiness calibrated to Normal(mean=50, sd=15) from 2026 polling.
// ============================================================================
(function () {
  const FACTIONS_CATALOG = [
  {
    "id": "dem_liberal_establishment",
    "name": "The Liberal Establishment",
    "partyId": "people",
    "type": "ideological",
    "status": "leading",
    "isIroncladAnchor": true,
    "targetVoters": 10616200,
    "sliders": {
      "social": 4,
      "economic": 4,
      "governance": 2
    },
    "keyIssues": [
      "Institutional Norms",
      "Entitlement Defense"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "The traditional backbone of the Democratic Party—elected officials, party apparatus loyalists, and suburban pragmatists who favor steady governance, institutional guardrails, and incremental reform.",
    "startingHappiness": 83,
    "cohesion": 0.5,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "institutional"
      ],
      "demographicAppeal": 1.1,
      "regionalRelevance": [
        "VA",
        "NJ",
        "PA",
        "MD",
        "CO",
        "NC",
        "GA",
        "DE",
        "CT",
        "IL"
      ]
    }
  },
  {
    "id": "dem_black_voters",
    "name": "Black Voters",
    "partyId": "people",
    "type": "racial",
    "status": "major",
    "targetVoters": 11029800,
    "sliders": {
      "social": 4,
      "economic": 3,
      "governance": 7.8
    },
    "keyIssues": [
      "Civil Rights",
      "Voting Access"
    ],
    "redLineIssues": [
      "voting-rights-rollback",
      "civil-rights-retrenchment"
    ],
    "flavor": "The African American Voting Block - have been a core faction of the democratic party since the civil rights movement",
    "startingHappiness": 66,
    "cohesion": 0.75,
    "growthProfile": {
      "archetype": "urban_core",
      "archetypeCluster": [
        "urban",
        "southern_metro"
      ],
      "demographicAppeal": 1.3,
      "regionalRelevance": [
        "GA",
        "NC",
        "SC",
        "MS",
        "AL",
        "LA",
        "MD",
        "VA",
        "MI",
        "OH",
        "PA",
        "IL"
      ]
    }
  },
  {
    "id": "dem_capital_l_left",
    "name": "The Capital L Left",
    "partyId": "people",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5396100,
    "sliders": {
      "social": 2,
      "economic": 2,
      "governance": 6
    },
    "keyIssues": [
      "Universal Healthcare",
      "Climate Action"
    ],
    "redLineIssues": [
      "fossil-fuel-expansion",
      "climate-deregulation"
    ],
    "flavor": "Extreme on Rhetoric, Extreme on Policy - these are the progressives that are keeping fox news in business",
    "startingHappiness": 49,
    "cohesion": 0.88,
    "growthProfile": {
      "archetype": "urban_campus",
      "archetypeCluster": [
        "urban",
        "campus"
      ],
      "demographicAppeal": 1.35,
      "regionalRelevance": [
        "NY",
        "CA",
        "MA",
        "VT",
        "WA",
        "OR",
        "IL",
        "DC",
        "CO",
        "MD",
        "MN",
        "CT",
        "RI"
      ]
    }
  },
  {
    "id": "dem_neo_liberals",
    "name": "Neo-Liberals",
    "partyId": "people",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5140351,
    "sliders": {
      "social": 3.7,
      "economic": 4.8,
      "governance": 2
    },
    "keyIssues": [
      "Free Trade Agreements",
      "Corporate Tax Competitiveness"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "Pro-globalization, free-trade technocrats and educated professionals who combine socially progressive values with market-oriented economic policies and fiscal prudence.",
    "startingHappiness": 64,
    "cohesion": 0.45,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "tech_corridor"
      ],
      "demographicAppeal": 1.15,
      "regionalRelevance": [
        "CA",
        "WA",
        "MA",
        "NY",
        "CO",
        "VA",
        "TX",
        "IL"
      ]
    }
  },
  {
    "id": "dem_abundance",
    "name": "Abundance",
    "partyId": "people",
    "type": "ideological",
    "status": "major",
    "targetVoters": 6643149,
    "sliders": {
      "social": 2.8,
      "economic": 5,
      "governance": 4.5
    },
    "keyIssues": [
      "Housing Supply & Permitting Reform",
      "Clean Energy & Infrastructure Abundance"
    ],
    "redLineIssues": [
      "housing-supply-freeze",
      "clean-energy-moratorium"
    ],
    "flavor": "Pro-building, supply-side liberals and state-capacity reformers focused on abundant housing, rapid clean-energy permitting, high-speed transit, and modernizing government to deliver tangible growth.",
    "startingHappiness": 66,
    "cohesion": 0.55,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "tech_corridor",
        "urban_professionals"
      ],
      "demographicAppeal": 1.2,
      "regionalRelevance": [
        "CA",
        "WA",
        "NY",
        "MA",
        "CO",
        "TX",
        "NC",
        "VA",
        "IL",
        "MN"
      ]
    }
  },
  {
    "id": "dem_bernie_bros",
    "name": "Bernie Bros",
    "partyId": "people",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 4258200,
    "sliders": {
      "social": 3.3,
      "economic": 1.8,
      "governance": 9
    },
    "keyIssues": [
      "Wealth and Capital Gains",
      "Business Regulation and Antitrust Laws"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "These are voters who became engaged in politics during Bernie Sanders 2016 campaign. They’re milder on social views and rhetoric, but very left leaning on economic issues. It also has a strong populist current.",
    "startingHappiness": 39,
    "cohesion": 0.85,
    "growthProfile": {
      "archetype": "urban_campus",
      "archetypeCluster": [
        "campus",
        "working_class"
      ],
      "demographicAppeal": 1.4,
      "regionalRelevance": [
        "VT",
        "NY",
        "CA",
        "MA",
        "WA",
        "OR",
        "WI",
        "MI",
        "CO",
        "MN"
      ]
    }
  },
  {
    "id": "dem_faith_based_liberals",
    "name": "Faith Based Liberals",
    "partyId": "people",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 3239900,
    "sliders": {
      "social": 5,
      "economic": 2,
      "governance": 4
    },
    "keyIssues": [
      "Voting Rights",
      "Civil Rights Protections"
    ],
    "redLineIssues": [
      "voting-rights-rollback",
      "civil-rights-retrenchment"
    ],
    "flavor": "Mainline Protestant, Catholic, and interfaith social-gospel voters who view progressive politics as a moral duty to care for the poor, marginalized, and vulnerable.",
    "startingHappiness": 68,
    "cohesion": 0.65,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "faith_communities"
      ],
      "demographicAppeal": 1.1,
      "regionalRelevance": [
        "NC",
        "VA",
        "GA",
        "PA",
        "OH",
        "MI",
        "TN"
      ]
    }
  },
  {
    "id": "dem_blue_dog",
    "name": "Blue Dog Democrats",
    "partyId": "people",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5864800,
    "sliders": {
      "social": 5.5,
      "economic": 5.5,
      "governance": 5
    },
    "keyIssues": [
      "Balanced Budget Amendment",
      "Rural Healthcare Support"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Fiscally conservative and culturally moderate Democrats who represent rural, small-town, and border districts, emphasizing bipartisan compromise and deficit reduction.",
    "startingHappiness": 43,
    "cohesion": 0.48,
    "growthProfile": {
      "archetype": "labor_stronghold",
      "archetypeCluster": [
        "labor",
        "rural_moderate"
      ],
      "demographicAppeal": 1.15,
      "regionalRelevance": [
        "PA",
        "OH",
        "MI",
        "WI",
        "WV",
        "KY",
        "LA",
        "ME",
        "MT"
      ]
    }
  },
  {
    "id": "dem_traditional_latin",
    "name": "Traditional Latin Voters",
    "partyId": "people",
    "type": "racial",
    "status": "minor",
    "targetVoters": 1905100,
    "sliders": {
      "social": 5,
      "economic": 4,
      "governance": 6
    },
    "keyIssues": [
      "Comprehensive Immigration Reform",
      "Labor Standards Enforcement"
    ],
    "redLineIssues": [
      "free-trade-concessions",
      "right-to-work-mandate"
    ],
    "flavor": "Multi-generational Hispanic and Latino families in urban centers and agricultural belts who blend socially moderate family values with support for public education and healthcare access.",
    "startingHappiness": 57,
    "cohesion": 0.6,
    "growthProfile": {
      "archetype": "sunbelt_growth",
      "archetypeCluster": [
        "sunbelt",
        "urban"
      ],
      "demographicAppeal": 1.25,
      "regionalRelevance": [
        "TX",
        "FL",
        "CA",
        "AZ",
        "NV",
        "NM",
        "CO"
      ]
    }
  },
  {
    "id": "gop_faith_and_flag",
    "name": "Faith & Flag Conservatives",
    "partyId": "heritage",
    "type": "ideological",
    "status": "major",
    "targetVoters": 9234800,
    "sliders": {
      "social": 9,
      "economic": 6,
      "governance": 6
    },
    "keyIssues": [
      "Religious Liberty",
      "Right to Life Protections"
    ],
    "redLineIssues": [
      "social-liberalization",
      "religious-exemption-repeal"
    ],
    "flavor": "Evangelical and devout traditionalist Christians who prioritize social conservatism, judicial originalism, and the defense of religious institutions in public life.",
    "startingHappiness": 72,
    "cohesion": 0.88,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "faith_based"
      ],
      "demographicAppeal": 1.3,
      "regionalRelevance": [
        "AL",
        "MS",
        "TN",
        "KY",
        "SC",
        "OK",
        "AR",
        "KS",
        "TX",
        "LA",
        "GA",
        "NC"
      ]
    }
  },
  {
    "id": "gop_maga",
    "name": "Nationalist Populists (MAGA)",
    "partyId": "heritage",
    "type": "ideological",
    "status": "leading",
    "isIroncladAnchor": true,
    "targetVoters": 7194100,
    "sliders": {
      "social": 8.5,
      "economic": 4.8,
      "governance": 8.5
    },
    "keyIssues": [
      "Border Security Wall",
      "Tariffs & Trade Protection"
    ],
    "redLineIssues": [
      "free-trade-concessions",
      "right-to-work-mandate"
    ],
    "flavor": "America-First working-class nationalists energized by Donald Trump, emphasizing strict border enforcement, protectionist trade policies, and cultural populism.",
    "startingHappiness": 76,
    "cohesion": 0.85,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "industrial_exurb"
      ],
      "demographicAppeal": 1.4,
      "regionalRelevance": [
        "OH",
        "PA",
        "MI",
        "FL",
        "WI",
        "IA",
        "IN",
        "WV",
        "MO",
        "TN",
        "AL",
        "TX"
      ]
    }
  },
  {
    "id": "gop_western_mavericks",
    "name": "Liberty & Western Mavericks",
    "partyId": "heritage",
    "type": "ideological",
    "status": "major",
    "targetVoters": 6684100,
    "sliders": {
      "social": 4.5,
      "economic": 8.5,
      "governance": 9
    },
    "keyIssues": [
      "Second Amendment Rights",
      "Federal Land Transfer"
    ],
    "redLineIssues": [
      "fossil-fuel-expansion",
      "climate-deregulation"
    ],
    "flavor": "Rugged individualists, ranchers, and Second Amendment absolutists across the Mountain West who demand federal land divestment and radical regulatory relief.",
    "startingHappiness": 59,
    "cohesion": 0.65,
    "growthProfile": {
      "archetype": "high_elasticity_frontier",
      "archetypeCluster": [
        "frontier",
        "western"
      ],
      "demographicAppeal": 1.25,
      "regionalRelevance": [
        "WY",
        "ID",
        "MT",
        "AK",
        "NV",
        "UT",
        "AZ",
        "CO",
        "NM"
      ]
    }
  },
  {
    "id": "gop_blood_and_soil",
    "name": "Blood and Soil Nationalists",
    "partyId": "heritage",
    "type": "ideological",
    "status": "major",
    "targetVoters": 6154400,
    "sliders": {
      "social": 9.8,
      "economic": 5,
      "governance": 9.5
    },
    "keyIssues": [
      "Immigration Enforcement",
      "National Sovereignty"
    ],
    "redLineIssues": [
      "amnesty-compromise",
      "foreign-interventionism"
    ],
    "flavor": "Hardline nativist reactionaries who demand an end to legal immigration, aggressive deportation operations, and the cultural reassertion of European heritage.",
    "startingHappiness": 50,
    "cohesion": 0.92,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "nativist"
      ],
      "demographicAppeal": 1.35,
      "regionalRelevance": [
        "ID",
        "MT",
        "WY",
        "WV",
        "KY",
        "AL",
        "AR",
        "TN"
      ]
    }
  },
  {
    "id": "gop_suburban_moderates",
    "name": "Frontier & Suburban Moderates",
    "partyId": "heritage",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5344600,
    "sliders": {
      "social": 4,
      "economic": 7.2,
      "governance": 2.5
    },
    "keyIssues": [
      "Suburban School Choice",
      "Local Tax Restraint"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "College-educated suburbanites and Sunbelt professionals who favor pro-business tax policy and public safety while rejecting conspiratorial rhetoric and cultural extremism.",
    "startingHappiness": 44,
    "cohesion": 0.42,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "educated_business"
      ],
      "demographicAppeal": 1.15,
      "regionalRelevance": [
        "VA",
        "NJ",
        "PA",
        "CO",
        "AZ",
        "GA",
        "NC",
        "TX",
        "FL"
      ]
    }
  },
  {
    "id": "gop_neo_cons",
    "name": "Neo-Cons",
    "partyId": "heritage",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5258000,
    "sliders": {
      "social": 6.5,
      "economic": 7.5,
      "governance": 3
    },
    "keyIssues": [
      "Defense Modernization",
      "NATO Expansion"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Hawkish foreign policy institutionalists and defense-sector advocates who champion global American hegemony, democratic interventionism, and deterrence against authoritarian rivals.",
    "startingHappiness": 32,
    "cohesion": 0.7,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "defense_corridor"
      ],
      "demographicAppeal": 1.1,
      "regionalRelevance": [
        "VA",
        "MD",
        "FL",
        "TX",
        "SC",
        "CA",
        "HI"
      ]
    }
  },
  {
    "id": "gop_paleocons",
    "name": "Paleocons",
    "partyId": "heritage",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 3083400,
    "sliders": {
      "social": 9.5,
      "economic": 5.5,
      "governance": 8
    },
    "keyIssues": [
      "Foreign Non-Intervention",
      "Decentralized Federalism"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Old-Right isolationists who combine deep cultural traditionalism with fierce opposition to foreign wars, global trade pacts, and centralized federal power.",
    "startingHappiness": 61,
    "cohesion": 0.86,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "heartland"
      ],
      "demographicAppeal": 1.2,
      "regionalRelevance": [
        "IN",
        "OH",
        "TN",
        "KY",
        "MO",
        "KS",
        "IA",
        "NE"
      ]
    }
  },
  {
    "id": "gop_mormons",
    "name": "Mormons",
    "partyId": "heritage",
    "type": "racial",
    "status": "minor",
    "targetVoters": 2462700,
    "sliders": {
      "social": 7.5,
      "economic": 7,
      "governance": 2
    },
    "keyIssues": [
      "Religious Freedom Protections",
      "Refugee Resettlement"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Latter-day Saint voters across the Intermountain West who pair devout family values and fiscal conservatism with institutional decency, civic trust, and welcoming refugee attitudes.",
    "startingHappiness": 45,
    "cohesion": 0.78,
    "growthProfile": {
      "archetype": "high_elasticity_frontier",
      "archetypeCluster": [
        "frontier",
        "intermountain"
      ],
      "demographicAppeal": 1.35,
      "regionalRelevance": [
        "UT",
        "ID",
        "AZ",
        "NV",
        "WY"
      ]
    }
  },
  {
    "id": "gop_traditional_farmers",
    "name": "Traditional Farmers",
    "partyId": "heritage",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 2056400,
    "sliders": {
      "social": 7,
      "economic": 5,
      "governance": 6
    },
    "keyIssues": [
      "Agricultural Subsidies & Crop Insurance",
      "Rural Broadband Infrastructure"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Generational agricultural producers and rural smallholders who depend on farm bill protections, biofuel mandates, and water rights while maintaining traditional cultural leanings.",
    "startingHappiness": 62,
    "cohesion": 0.62,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "agricultural"
      ],
      "demographicAppeal": 1.25,
      "regionalRelevance": [
        "IA",
        "NE",
        "KS",
        "SD",
        "ND",
        "MN",
        "IL",
        "IN",
        "OH"
      ]
    }
  },
  {
    "id": "gop_market_country_club",
    "name": "Market & Country-Club Conservatives",
    "partyId": "heritage",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 2062300,
    "sliders": {
      "social": 4.5,
      "economic": 9,
      "governance": 2
    },
    "keyIssues": [
      "Corporate Tax Reductions",
      "Financial Deregulation"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "Wealthy corporate executives, financiers, and donors who focus primarily on supply-side tax cuts, capital gains relief, and minimal government intervention in capital markets.",
    "startingHappiness": 40,
    "cohesion": 0.6,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "corporate_finance"
      ],
      "demographicAppeal": 1.1,
      "regionalRelevance": [
        "NY",
        "CT",
        "NJ",
        "FL",
        "TX",
        "IL",
        "CA"
      ]
    }
  },
  {
    "id": "gop_cubans",
    "name": "Cubans",
    "partyId": "heritage",
    "type": "racial",
    "status": "fringe",
    "targetVoters": 823200,
    "sliders": {
      "social": 7,
      "economic": 7.5,
      "governance": 4
    },
    "keyIssues": [
      "Anti-Communist Foreign Policy",
      "Sanctions Enforcement"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "South Florida Cuban-American voting bloc with deep anti-communist convictions, fiercely loyal to hardline foreign policy against Latin American dictatorships and supportive of free-market policies.",
    "startingHappiness": 70,
    "cohesion": 0.7,
    "growthProfile": {
      "archetype": "sunbelt_growth",
      "archetypeCluster": [
        "sunbelt",
        "diaspora"
      ],
      "demographicAppeal": 1.3,
      "regionalRelevance": [
        "FL"
      ]
    }
  },
  {
    "id": "swg_true_centrists",
    "name": "True Centrists",
    "partyId": "independent",
    "type": "ideological",
    "status": "major",
    "targetVoters": 9006000,
    "sliders": {
      "social": 5,
      "economic": 5,
      "governance": 5
    },
    "keyIssues": [
      "Government Gridlock Reform",
      "Bipartisan Infrastructure"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "The perfect ideological center of the American electorate, evenly divided and skeptical of ideological purity from both parties, deciding general election outcomes.",
    "startingHappiness": 46,
    "cohesion": 0.3,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "independent"
      ],
      "demographicAppeal": 1.05,
      "regionalRelevance": [
        "NH",
        "ME",
        "MN",
        "WI",
        "PA",
        "AZ",
        "NV",
        "CO"
      ]
    }
  },
  {
    "id": "swg_hard_hats",
    "name": "Hard Hats",
    "partyId": "independent",
    "type": "ideological",
    "status": "major",
    "targetVoters": 6004000,
    "sliders": {
      "social": 7.2,
      "economic": 3.1,
      "governance": 6
    },
    "keyIssues": [
      "Domestic Manufacturing",
      "Union Protections"
    ],
    "redLineIssues": [
      "free-trade-concessions",
      "right-to-work-mandate"
    ],
    "flavor": "Union Voters and Construction workers used to be reliably democratic - but the Trump Coalition swallowed them up",
    "startingHappiness": 36,
    "cohesion": 0.52,
    "growthProfile": {
      "archetype": "labor_stronghold",
      "archetypeCluster": [
        "labor",
        "manufacturing"
      ],
      "demographicAppeal": 1.3,
      "regionalRelevance": [
        "MI",
        "OH",
        "PA",
        "WI",
        "IL",
        "IN",
        "WV",
        "MN"
      ]
    }
  },
  {
    "id": "swg_podcast_bros",
    "name": "Podcast Bros",
    "partyId": "independent",
    "type": "ideological",
    "status": "major",
    "targetVoters": 6004000,
    "sliders": {
      "social": 6.8,
      "economic": 3.9,
      "governance": 9
    },
    "keyIssues": [
      "Cryptocurrency Freedom",
      "Free Speech Online"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "These low information voters get most of their news from podcasts - and that’s how they decide on who they vote for, too",
    "startingHappiness": 38,
    "cohesion": 0.28,
    "growthProfile": {
      "archetype": "high_elasticity_frontier",
      "archetypeCluster": [
        "frontier",
        "exurban"
      ],
      "demographicAppeal": 1.15,
      "regionalRelevance": [
        "TX",
        "FL",
        "AZ",
        "NV",
        "CO",
        "NC",
        "TN"
      ]
    }
  },
  {
    "id": "swg_country_club_centrists",
    "name": "Country Club Centrists",
    "partyId": "independent",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5503500,
    "sliders": {
      "social": 3.4,
      "economic": 8.1,
      "governance": 2
    },
    "keyIssues": [
      "Fiscal Discipline",
      "Free Market Deregulation"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "These voters used to be dyed in the wool republicans - but Trump changed everything",
    "startingHappiness": 56,
    "cohesion": 0.35,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "affluent"
      ],
      "demographicAppeal": 1.05,
      "regionalRelevance": [
        "VA",
        "NJ",
        "CT",
        "MA",
        "CO",
        "IL",
        "CA"
      ]
    }
  },
  {
    "id": "swg_technocrats",
    "name": "Technocrats",
    "partyId": "independent",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5503500,
    "sliders": {
      "social": 2.5,
      "economic": 8.8,
      "governance": 2
    },
    "keyIssues": [
      "Artificial Intelligence Deregulation",
      "High-Skill Immigration"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "These voters believe in the power of technology. They hold progressive social views (civil rights, free speech) but despise regulatory barriers, compute controls, and wealth taxes.",
    "startingHappiness": 55,
    "cohesion": 0.4,
    "growthProfile": {
      "archetype": "urban_campus",
      "archetypeCluster": [
        "urban",
        "tech_hub"
      ],
      "demographicAppeal": 1.2,
      "regionalRelevance": [
        "CA",
        "WA",
        "MA",
        "NY",
        "CO",
        "MD",
        "VA",
        "TX"
      ]
    }
  },
  {
    "id": "swg_grillers",
    "name": "Grillers",
    "partyId": "independent",
    "type": "ideological",
    "status": "major",
    "targetVoters": 5003000,
    "sliders": {
      "social": 5.5,
      "economic": 5.5,
      "governance": 3
    },
    "keyIssues": [
      "Inflation Reduction",
      "Lower Grocery Prices"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "These voters don’t follow politics closely - they just want to be left alone and grill. But when food, gas, and energy prices spike, they deliver brutal verdicts to the governing party.",
    "startingHappiness": 53,
    "cohesion": 0.2,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "apolitical"
      ],
      "demographicAppeal": 1,
      "regionalRelevance": [
        "OH",
        "MO",
        "IN",
        "WI",
        "MI",
        "PA",
        "FL",
        "GA"
      ]
    }
  },
  {
    "id": "swg_religious_moderates",
    "name": "Religious Moderates",
    "partyId": "independent",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 4502800,
    "sliders": {
      "social": 6.5,
      "economic": 4.8,
      "governance": 4
    },
    "keyIssues": [
      "Charitable Giving Incentives",
      "Community Poverty Programs"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Churchgoers, Catholics, and interfaith believers who resist hard-right Christian nationalism but expect politicians to respect personal faith, family values, and basic community compassion.",
    "startingHappiness": 51,
    "cohesion": 0.45,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "faith_moderate"
      ],
      "demographicAppeal": 1.1,
      "regionalRelevance": [
        "NC",
        "VA",
        "GA",
        "PA",
        "TX",
        "OH",
        "FL"
      ]
    }
  },
  {
    "id": "swg_working_class_latinos",
    "name": "Working Class Latinos",
    "partyId": "independent",
    "type": "racial",
    "status": "minor",
    "targetVoters": 4002500,
    "sliders": {
      "social": 6.2,
      "economic": 4.5,
      "governance": 5
    },
    "keyIssues": [
      "Small Business Loans",
      "Public Safety & Policing"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Blue-collar Hispanic voters in Nevada, Arizona, Texas, and the Rust Belt who prioritize steady jobs, law and order, and small-business opportunity, swinging fluidly between both major parties.",
    "startingHappiness": 41,
    "cohesion": 0.45,
    "growthProfile": {
      "archetype": "sunbelt_growth",
      "archetypeCluster": [
        "sunbelt",
        "working_class"
      ],
      "demographicAppeal": 1.25,
      "regionalRelevance": [
        "TX",
        "AZ",
        "NV",
        "FL",
        "CA",
        "NM"
      ]
    }
  },
  {
    "id": "swg_girlypops",
    "name": "Girlypops",
    "partyId": "independent",
    "type": "ideological",
    "status": "minor",
    "targetVoters": 2500500,
    "sliders": {
      "social": 2.5,
      "economic": 5,
      "governance": 7
    },
    "keyIssues": [
      "Reproductive Healthcare Access",
      "Equal Pay Protections"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Young, pop-culture-fluent women who care deeply about reproductive autonomy, social equality, and campus climate, but distrust career politicians and rigid ideological labels.",
    "startingHappiness": 52,
    "cohesion": 0.25,
    "growthProfile": {
      "archetype": "suburban",
      "archetypeCluster": [
        "suburban",
        "cultural"
      ],
      "demographicAppeal": 1.15,
      "regionalRelevance": [
        "CA",
        "NY",
        "IL",
        "CO",
        "MA",
        "WA",
        "VA"
      ]
    }
  },
  {
    "id": "lib_true_libertarians",
    "name": "True Libertarians",
    "partyId": "liberty",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 989000,
    "sliders": {
      "social": 3.8,
      "economic": 9.5,
      "governance": 9.3
    },
    "keyIssues": [
      "Tax Policy",
      "Gun Policy"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "True libertarians are hard to come by - but these voters believe in true small government, not just on liberal issues",
    "startingHappiness": 48,
    "cohesion": 0.88,
    "growthProfile": {
      "archetype": "high_elasticity_frontier",
      "archetypeCluster": [
        "frontier",
        "free_market"
      ],
      "demographicAppeal": 1.35,
      "regionalRelevance": [
        "NH",
        "WY",
        "ID",
        "MT",
        "AK",
        "NV",
        "AZ",
        "CO",
        "TX"
      ]
    }
  },
  {
    "id": "lib_ancaps",
    "name": "Ancaps",
    "partyId": "liberty",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 197800,
    "sliders": {
      "social": 3.5,
      "economic": 10,
      "governance": 10
    },
    "keyIssues": [
      "Abolition of the Federal Reserve",
      "Total Tax Elimination"
    ],
    "redLineIssues": [
      "federal-debt-expansion",
      "tax-hike-package"
    ],
    "flavor": "These voters don’t think the government should exist.",
    "isExtremist": true,
    "startingHappiness": 30,
    "cohesion": 0.95,
    "growthProfile": {
      "archetype": "high_elasticity_frontier",
      "archetypeCluster": [
        "frontier",
        "radical_market"
      ],
      "demographicAppeal": 1.4,
      "regionalRelevance": [
        "NH",
        "WY",
        "ID",
        "MT",
        "NV",
        "FL"
      ]
    }
  },
  {
    "id": "grn_eco_socialist_vanguard",
    "name": "Eco-Socialist Vanguard",
    "partyId": "green",
    "type": "ideological",
    "status": "leading",
    "targetVoters": 398700,
    "sliders": {
      "social": 1.2,
      "economic": 1.3,
      "governance": 9
    },
    "keyIssues": [
      "Fossil Fuel Nationalization",
      "Degrowth Climate Transition"
    ],
    "redLineIssues": [
      "fossil-fuel-expansion",
      "climate-deregulation"
    ],
    "flavor": "The Eco-Socialist Vanguard warns of the coming eco-apoclypse",
    "startingHappiness": 47,
    "cohesion": 0.9,
    "growthProfile": {
      "archetype": "labor_stronghold",
      "archetypeCluster": [
        "labor",
        "climate_radical"
      ],
      "demographicAppeal": 1.35,
      "regionalRelevance": [
        "CA",
        "NY",
        "WA",
        "OR",
        "VT",
        "MA",
        "MI",
        "IL"
      ]
    }
  },
  {
    "id": "grn_yimby",
    "name": "YIMBYs",
    "partyId": "green",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 114100,
    "sliders": {
      "social": 2.8,
      "economic": 3.1,
      "governance": 5
    },
    "keyIssues": [
      "NIMBYism and Housing Development",
      "Affordability and the Cost of Living"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "These leftie voters left the democrats over housing issues - now they’re in an uncomfortable alliance with the greens",
    "startingHappiness": 54,
    "cohesion": 0.58,
    "growthProfile": {
      "archetype": "urban_campus",
      "archetypeCluster": [
        "urban",
        "urbanist"
      ],
      "demographicAppeal": 1.3,
      "regionalRelevance": [
        "CA",
        "WA",
        "NY",
        "MA",
        "DC",
        "CO",
        "OR"
      ]
    }
  },
  {
    "id": "con_christian_dominionists",
    "name": "Christian Dominionists & Theocrats",
    "partyId": "constitution",
    "type": "ideological",
    "status": "leading",
    "targetVoters": 235600,
    "sliders": {
      "social": 10,
      "economic": 6.4,
      "governance": 9.5
    },
    "keyIssues": [
      "Religious Liberty",
      "Religion in Public Schools"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "Radical religious reconstructionists who believe American civil law should be completely replaced with biblical law and Christian governance.",
    "isExtremist": true,
    "startingHappiness": 60,
    "cohesion": 0.95,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "theocratic"
      ],
      "demographicAppeal": 1.4,
      "regionalRelevance": [
        "AL",
        "MS",
        "ID",
        "OK",
        "AR",
        "TN",
        "SC",
        "TX"
      ]
    }
  },
  {
    "id": "soc_socialists",
    "name": "Socialists",
    "partyId": "socialist",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 144800,
    "sliders": {
      "social": 2,
      "economic": 1.2,
      "governance": 9
    },
    "keyIssues": [
      "Worker-Owned Enterprises",
      "Public Banking Infrastructure"
    ],
    "redLineIssues": [
      "free-trade-concessions",
      "right-to-work-mandate"
    ],
    "flavor": "These voters are socialists, who idealize Karl Marx.",
    "isExtremist": true,
    "startingHappiness": 34,
    "cohesion": 0.95,
    "growthProfile": {
      "archetype": "labor_stronghold",
      "archetypeCluster": [
        "labor",
        "democratic_socialist"
      ],
      "demographicAppeal": 1.4,
      "regionalRelevance": [
        "CA",
        "NY",
        "IL",
        "MI",
        "PA",
        "VT",
        "WA"
      ]
    }
  },
  {
    "id": "soc_communists",
    "name": "Communists",
    "partyId": "socialist",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 96400,
    "sliders": {
      "social": 5,
      "economic": 1,
      "governance": 7
    },
    "keyIssues": [
      "Expropriation of Corporate Monopolies",
      "Centralized Economic Planning"
    ],
    "redLineIssues": [
      "fossil-fuel-expansion",
      "climate-deregulation"
    ],
    "flavor": "These are communists, who want total state control over the economy.",
    "isExtremist": true,
    "startingHappiness": 28,
    "cohesion": 0.95,
    "growthProfile": {
      "archetype": "labor_stronghold",
      "archetypeCluster": [
        "labor",
        "revolutionary"
      ],
      "demographicAppeal": 1.45,
      "regionalRelevance": [
        "CA",
        "NY",
        "IL",
        "PA",
        "WA"
      ]
    }
  },
  {
    "id": "unaff_groypers",
    "name": "Groypers",
    "isExtremist": true,
    "partyId": "unaffiliated",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 200000,
    "sliders": {
      "social": 9.2,
      "economic": 6.1,
      "governance": 9.5
    },
    "keyIssues": [
      "Immigration Moratorium",
      "Anti-Globalist Sovereignty"
    ],
    "redLineIssues": [
      "amnesty-compromise",
      "foreign-interventionism"
    ],
    "flavor": "Online alt-right provocateurs and youth reactionaries who use irony, memes, and internet culture to push far-right ethno-nationalist talking points into mainstream discourse.",
    "startingHappiness": 24,
    "cohesion": 0.95,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "exurban",
        "online_alt_right"
      ],
      "demographicAppeal": 1.35,
      "regionalRelevance": [
        "ID",
        "FL",
        "TX",
        "OH",
        "AZ"
      ]
    }
  },
  {
    "id": "unaff_the_klan",
    "name": "The Klan & Neo-Nazis",
    "partyId": "unaffiliated",
    "type": "ideological",
    "status": "fringe",
    "targetVoters": 142200,
    "sliders": {
      "social": 10,
      "economic": 5.5,
      "governance": 10
    },
    "keyIssues": [
      "Racial Segregation",
      "Totalitarian State Authority"
    ],
    "redLineIssues": [
      "entitlement-cuts",
      "institutional-norm-breach"
    ],
    "flavor": "These voters support the Klu Klux Klan and Neo-Nazis. They turn out 0%.",
    "isExtremist": true,
    "startingHappiness": 17,
    "cohesion": 0.95,
    "growthProfile": {
      "archetype": "rural_traditional",
      "archetypeCluster": [
        "rural",
        "extremist"
      ],
      "demographicAppeal": 1.3,
      "regionalRelevance": [
        "AL",
        "MS",
        "AR",
        "TN",
        "KY"
      ]
    }
  }
];

  const FACTION_NAME_TO_ID = {
  "The Liberal Establishment": "dem_liberal_establishment",
  "Black Voters": "dem_black_voters",
  "The Capital L Left": "dem_capital_l_left",
  "Neo-Liberals": "dem_neo_liberals",
  "Bernie Bros": "dem_bernie_bros",
  "Faith Based Liberals": "dem_faith_based_liberals",
  "Blue Dog Democrats": "dem_blue_dog",
  "Traditional Latin Voters": "dem_traditional_latin",
  "Faith & Flag Conservatives": "gop_faith_and_flag",
  "Nationalist Populists (MAGA)": "gop_maga",
  "Liberty & Western Mavericks": "gop_western_mavericks",
  "Blood and Soil Nationalists": "gop_blood_and_soil",
  "Frontier & Suburban Moderates": "gop_suburban_moderates",
  "Neo-Cons": "gop_neo_cons",
  "Paleocons": "gop_paleocons",
  "Mormons": "gop_mormons",
  "Traditional Farmers": "gop_traditional_farmers",
  "Market & Country-Club Conservatives": "gop_market_country_club",
  "Cubans": "gop_cubans",
  "True Centrists": "swg_true_centrists",
  "Hard Hats": "swg_hard_hats",
  "Podcast Bros": "swg_podcast_bros",
  "Country Club Centrists": "swg_country_club_centrists",
  "Technocrats": "swg_technocrats",
  "Grillers": "swg_grillers",
  "Religious Moderates": "swg_religious_moderates",
  "Working Class Latinos": "swg_working_class_latinos",
  "Girlypops": "swg_girlypops",
  "True Libertarians": "lib_true_libertarians",
  "Ancaps": "lib_ancaps",
  "Eco-Socialist Vanguard": "grn_eco_socialist_vanguard",
  "YIMBYs": "grn_yimby",
  "Christian Dominionists & Theocrats": "con_christian_dominionists",
  "Socialists": "soc_socialists",
  "Communists": "soc_communists",
  "Groypers": "unaff_groypers",
  "The Klan & Neo-Nazis": "unaff_the_klan",
  "Abundance": "dem_abundance"
};

  const FACTION_STATE_MATRIX = {
  "AL": {
    "dem_liberal_establishment": 82683,
    "dem_black_voters": 334955,
    "dem_capital_l_left": 13578,
    "dem_neo_liberals": 18032,
    "dem_bernie_bros": 22331,
    "dem_faith_based_liberals": 50457,
    "dem_blue_dog": 111517,
    "gop_faith_and_flag": 353757,
    "gop_maga": 134378,
    "gop_western_mavericks": 61928,
    "gop_blood_and_soil": 256254,
    "gop_suburban_moderates": 53729,
    "gop_neo_cons": 38950,
    "gop_paleocons": 56855,
    "gop_traditional_farmers": 13092,
    "gop_market_country_club": 8920,
    "swg_true_centrists": 204282,
    "swg_hard_hats": 149066,
    "swg_podcast_bros": 130606,
    "swg_country_club_centrists": 61346,
    "swg_technocrats": 43264,
    "swg_grillers": 150288,
    "swg_religious_moderates": 79336,
    "swg_girlypops": 27712,
    "lib_true_libertarians": 10741,
    "lib_ancaps": 2025,
    "grn_eco_socialist_vanguard": 1061,
    "con_christian_dominionists": 23700,
    "unaff_groypers": 1172,
    "unaff_the_klan": 8675,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 35,
    "soc_socialists": null,
    "dem_abundance": 58477
  },
  "AK": {
    "dem_liberal_establishment": 12420,
    "dem_black_voters": 3470,
    "dem_capital_l_left": 2039,
    "dem_neo_liberals": 2709,
    "dem_bernie_bros": 8050,
    "dem_faith_based_liberals": 2105,
    "dem_blue_dog": 13373,
    "gop_faith_and_flag": 7937,
    "gop_maga": 8009,
    "gop_western_mavericks": 68897,
    "gop_blood_and_soil": 3910,
    "gop_suburban_moderates": 5123,
    "gop_neo_cons": 3715,
    "gop_paleocons": 2711,
    "gop_market_country_club": 851,
    "swg_true_centrists": 82540,
    "swg_hard_hats": 20077,
    "swg_podcast_bros": 35181,
    "swg_country_club_centrists": 24787,
    "swg_technocrats": 17481,
    "swg_grillers": 40482,
    "swg_religious_moderates": 32055,
    "swg_girlypops": 11197,
    "lib_true_libertarians": 2027,
    "lib_ancaps": 874,
    "grn_eco_socialist_vanguard": 115,
    "unaff_groypers": 125,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 5640
  },
  "AZ": {
    "dem_liberal_establishment": 183640,
    "dem_black_voters": 51306,
    "dem_capital_l_left": 100519,
    "dem_neo_liberals": 100122,
    "dem_bernie_bros": 119034,
    "dem_faith_based_liberals": 31129,
    "dem_blue_dog": 98550,
    "dem_traditional_latin": 120420,
    "gop_faith_and_flag": 28178,
    "gop_maga": 56864,
    "gop_western_mavericks": 244586,
    "gop_blood_and_soil": 13880,
    "gop_suburban_moderates": 54567,
    "gop_neo_cons": 26372,
    "gop_paleocons": 9623,
    "gop_mormons": 712768,
    "gop_traditional_farmers": 4432,
    "gop_market_country_club": 9060,
    "swg_true_centrists": 174022,
    "swg_hard_hats": 42328,
    "swg_podcast_bros": 166888,
    "swg_country_club_centrists": 156777,
    "swg_technocrats": 36855,
    "swg_grillers": 85351,
    "swg_religious_moderates": 67584,
    "swg_working_class_latinos": 340182,
    "swg_girlypops": 47213,
    "lib_true_libertarians": 19944,
    "lib_ancaps": 2149,
    "grn_eco_socialist_vanguard": 3383,
    "grn_yimby": 759,
    "unaff_groypers": 3331,
    "gop_cubans": 0,
    "dem_abundance": 116984
  },
  "AR": {
    "dem_liberal_establishment": 6920,
    "dem_black_voters": 13535,
    "dem_capital_l_left": 1137,
    "dem_neo_liberals": 1509,
    "dem_bernie_bros": 1869,
    "dem_faith_based_liberals": 2815,
    "dem_blue_dog": 14818,
    "gop_faith_and_flag": 30145,
    "gop_maga": 11451,
    "gop_western_mavericks": 5278,
    "gop_blood_and_soil": 21837,
    "gop_suburban_moderates": 4578,
    "gop_neo_cons": 3319,
    "gop_paleocons": 2422,
    "gop_traditional_farmers": 4462,
    "gop_market_country_club": 760,
    "swg_true_centrists": 254122,
    "swg_hard_hats": 61812,
    "swg_podcast_bros": 108314,
    "swg_country_club_centrists": 76313,
    "swg_technocrats": 53820,
    "swg_grillers": 186955,
    "swg_religious_moderates": 98692,
    "swg_girlypops": 34472,
    "lib_true_libertarians": 82,
    "lib_ancaps": 16,
    "grn_eco_socialist_vanguard": 8,
    "con_christian_dominionists": 182,
    "unaff_groypers": 9,
    "unaff_the_klan": 68,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 3580
  },
  "CA": {
    "dem_liberal_establishment": 1738754,
    "dem_black_voters": 323853,
    "dem_capital_l_left": 1649678,
    "dem_neo_liberals": 1137581,
    "dem_bernie_bros": 751351,
    "dem_faith_based_liberals": 196517,
    "dem_traditional_latin": 760110,
    "gop_faith_and_flag": 659239,
    "gop_maga": 665246,
    "gop_western_mavericks": 490494,
    "gop_blood_and_soil": 324743,
    "gop_suburban_moderates": 425561,
    "gop_neo_cons": 1110612,
    "gop_paleocons": 225156,
    "gop_traditional_farmers": 103688,
    "gop_market_country_club": 423923,
    "swg_true_centrists": 483066,
    "swg_hard_hats": 117499,
    "swg_podcast_bros": 463265,
    "swg_country_club_centrists": 435196,
    "swg_technocrats": 767300,
    "swg_grillers": 236925,
    "swg_religious_moderates": 187606,
    "swg_working_class_latinos": 944312,
    "swg_girlypops": 218431,
    "lib_true_libertarians": 185999,
    "lib_ancaps": 35042,
    "grn_eco_socialist_vanguard": 182827,
    "grn_yimby": 61529,
    "soc_socialists": 71601,
    "soc_communists": 47769,
    "unaff_groypers": 52073,
    "dem_blue_dog": 121310,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 1287142
  },
  "CO": {
    "dem_liberal_establishment": 145144,
    "dem_black_voters": 32442,
    "dem_capital_l_left": 114405,
    "dem_neo_liberals": 113953,
    "dem_bernie_bros": 125442,
    "dem_faith_based_liberals": 19683,
    "dem_blue_dog": 24691,
    "dem_traditional_latin": 38071,
    "gop_faith_and_flag": 35890,
    "gop_maga": 36214,
    "gop_western_mavericks": 178017,
    "gop_blood_and_soil": 17679,
    "gop_suburban_moderates": 69503,
    "gop_neo_cons": 33590,
    "gop_paleocons": 12282,
    "gop_mormons": 247525,
    "gop_traditional_farmers": 5693,
    "gop_market_country_club": 23078,
    "swg_true_centrists": 224030,
    "swg_hard_hats": 54492,
    "swg_podcast_bros": 214847,
    "swg_country_club_centrists": 201830,
    "swg_technocrats": 355849,
    "swg_grillers": 109878,
    "swg_religious_moderates": 87005,
    "swg_working_class_latinos": 233568,
    "swg_girlypops": 101301,
    "lib_true_libertarians": 20733,
    "lib_ancaps": 8934,
    "grn_eco_socialist_vanguard": 3494,
    "grn_yimby": 3916,
    "soc_socialists": 1157,
    "soc_communists": 772,
    "unaff_groypers": 1288,
    "gop_cubans": 0,
    "dem_abundance": 116404
  },
  "CT": {
    "dem_liberal_establishment": 165626,
    "dem_black_voters": 123394,
    "dem_capital_l_left": 60440,
    "dem_neo_liberals": 108361,
    "dem_bernie_bros": 29820,
    "dem_faith_based_liberals": 18717,
    "dem_blue_dog": 23480,
    "gop_faith_and_flag": 68300,
    "gop_maga": 68915,
    "gop_western_mavericks": 50814,
    "gop_blood_and_soil": 33642,
    "gop_suburban_moderates": 44087,
    "gop_neo_cons": 31960,
    "gop_paleocons": 23326,
    "gop_market_country_club": 43917,
    "swg_true_centrists": 185638,
    "swg_hard_hats": 45154,
    "swg_podcast_bros": 79124,
    "swg_country_club_centrists": 167242,
    "swg_technocrats": 39316,
    "swg_grillers": 91048,
    "swg_religious_moderates": 72095,
    "swg_girlypops": 25183,
    "lib_true_libertarians": 5681,
    "lib_ancaps": 1071,
    "grn_eco_socialist_vanguard": 1680,
    "grn_yimby": 377,
    "soc_socialists": 553,
    "soc_communists": 369,
    "unaff_groypers": 619,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "gop_cubans": 0,
    "dem_abundance": 85351
  },
  "DE": {
    "dem_liberal_establishment": 62421,
    "dem_black_voters": 81384,
    "dem_capital_l_left": 6833,
    "dem_neo_liberals": 22688,
    "dem_bernie_bros": 11239,
    "dem_faith_based_liberals": 7054,
    "dem_blue_dog": 8849,
    "gop_faith_and_flag": 28559,
    "gop_maga": 28816,
    "gop_western_mavericks": 21247,
    "gop_blood_and_soil": 14067,
    "gop_suburban_moderates": 18435,
    "gop_neo_cons": 13364,
    "gop_paleocons": 9753,
    "gop_market_country_club": 3061,
    "swg_true_centrists": 56852,
    "swg_hard_hats": 13828,
    "swg_podcast_bros": 24232,
    "swg_country_club_centrists": 17073,
    "swg_technocrats": 12040,
    "swg_grillers": 27884,
    "swg_religious_moderates": 22079,
    "swg_girlypops": 7712,
    "lib_true_libertarians": 1633,
    "lib_ancaps": 308,
    "grn_eco_socialist_vanguard": 160,
    "unaff_groypers": 178,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 27151
  },
  "FL": {
    "dem_liberal_establishment": 715959,
    "dem_black_voters": 640087,
    "dem_capital_l_left": 94055,
    "dem_neo_liberals": 312278,
    "dem_bernie_bros": 154693,
    "dem_faith_based_liberals": 349528,
    "dem_blue_dog": 463207,
    "dem_traditional_latin": 187793,
    "gop_faith_and_flag": 656372,
    "gop_maga": 706437,
    "gop_western_mavericks": 260446,
    "gop_blood_and_soil": 689765,
    "gop_suburban_moderates": 451907,
    "gop_neo_cons": 589721,
    "gop_paleocons": 119554,
    "gop_traditional_farmers": 55057,
    "gop_market_country_club": 225103,
    "gop_cubans": 687292,
    "swg_true_centrists": 440928,
    "swg_hard_hats": 107250,
    "swg_podcast_bros": 422853,
    "swg_country_club_centrists": 397233,
    "swg_technocrats": 93382,
    "swg_grillers": 216257,
    "swg_religious_moderates": 299671,
    "swg_working_class_latinos": 459700,
    "swg_girlypops": 119626,
    "lib_true_libertarians": 83264,
    "lib_ancaps": 15700,
    "grn_eco_socialist_vanguard": 8272,
    "unaff_groypers": 24065,
    "unaff_the_klan": 22273,
    "gop_mormons": 0,
    "grn_yimby": 0,
    "dem_abundance": 303172
  },
  "GA": {
    "dem_liberal_establishment": 266049,
    "dem_black_voters": 862227,
    "dem_capital_l_left": 34950,
    "dem_neo_liberals": 116042,
    "dem_bernie_bros": 57483,
    "dem_faith_based_liberals": 129885,
    "dem_blue_dog": 103165,
    "gop_faith_and_flag": 401019,
    "gop_maga": 294277,
    "gop_western_mavericks": 108492,
    "gop_blood_and_soil": 287321,
    "gop_suburban_moderates": 282390,
    "gop_neo_cons": 245657,
    "gop_paleocons": 49802,
    "gop_traditional_farmers": 22935,
    "gop_market_country_club": 46884,
    "swg_true_centrists": 341708,
    "swg_hard_hats": 249347,
    "swg_podcast_bros": 327701,
    "swg_country_club_centrists": 205231,
    "swg_technocrats": 72369,
    "swg_grillers": 167594,
    "swg_religious_moderates": 232237,
    "swg_girlypops": 154513,
    "lib_true_libertarians": 29814,
    "lib_ancaps": 5621,
    "grn_eco_socialist_vanguard": 2969,
    "con_christian_dominionists": 21511,
    "unaff_groypers": 8694,
    "unaff_the_klan": 8046,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 169267
  },
  "HI": {
    "dem_liberal_establishment": 58101,
    "dem_black_voters": 16232,
    "dem_capital_l_left": 57246,
    "dem_neo_liberals": 12671,
    "dem_bernie_bros": 15693,
    "dem_faith_based_liberals": 9849,
    "dem_blue_dog": 12355,
    "gop_faith_and_flag": 25175,
    "gop_maga": 25402,
    "gop_western_mavericks": 18730,
    "gop_blood_and_soil": 12401,
    "gop_suburban_moderates": 16250,
    "gop_neo_cons": 42410,
    "gop_paleocons": 8598,
    "gop_market_country_club": 2698,
    "swg_true_centrists": 58479,
    "swg_hard_hats": 14224,
    "swg_podcast_bros": 24925,
    "swg_country_club_centrists": 17561,
    "swg_technocrats": 12385,
    "swg_grillers": 28682,
    "swg_religious_moderates": 22711,
    "swg_girlypops": 7933,
    "lib_true_libertarians": 3717,
    "lib_ancaps": 701,
    "grn_eco_socialist_vanguard": 1107,
    "grn_yimby": 248,
    "soc_socialists": 364,
    "soc_communists": 243,
    "unaff_groypers": 404,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "gop_cubans": 0,
    "dem_abundance": 38905
  },
  "ID": {
    "dem_liberal_establishment": 24962,
    "dem_capital_l_left": 4100,
    "dem_neo_liberals": 5444,
    "dem_bernie_bros": 6743,
    "dem_faith_based_liberals": 4231,
    "dem_blue_dog": 49792,
    "gop_faith_and_flag": 22412,
    "gop_maga": 8224,
    "gop_western_mavericks": 70742,
    "gop_blood_and_soil": 10036,
    "gop_suburban_moderates": 5261,
    "gop_neo_cons": 3814,
    "gop_paleocons": 2783,
    "gop_mormons": 421678,
    "gop_traditional_farmers": 5127,
    "gop_market_country_club": 874,
    "swg_true_centrists": 55916,
    "swg_hard_hats": 13601,
    "swg_podcast_bros": 53624,
    "swg_country_club_centrists": 16792,
    "swg_technocrats": 11842,
    "swg_grillers": 27424,
    "swg_religious_moderates": 21716,
    "swg_girlypops": 7585,
    "lib_true_libertarians": 2553,
    "lib_ancaps": 1100,
    "grn_eco_socialist_vanguard": 144,
    "con_christian_dominionists": 3238,
    "unaff_groypers": 161,
    "unaff_the_klan": 1195,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 8486
  },
  "IL": {
    "dem_liberal_establishment": 383613,
    "dem_black_voters": 500150,
    "dem_capital_l_left": 251975,
    "dem_neo_liberals": 250980,
    "dem_bernie_bros": 165770,
    "dem_faith_based_liberals": 104044,
    "dem_blue_dog": 91847,
    "dem_traditional_latin": 83850,
    "gop_faith_and_flag": 261991,
    "gop_maga": 264351,
    "gop_western_mavericks": 194919,
    "gop_blood_and_soil": 129051,
    "gop_suburban_moderates": 169115,
    "gop_neo_cons": 122597,
    "gop_paleocons": 178950,
    "gop_traditional_farmers": 329661,
    "gop_market_country_club": 168444,
    "swg_true_centrists": 264442,
    "swg_hard_hats": 482414,
    "swg_podcast_bros": 112711,
    "swg_country_club_centrists": 238237,
    "swg_technocrats": 252023,
    "swg_grillers": 129698,
    "swg_religious_moderates": 102700,
    "swg_working_class_latinos": 275701,
    "swg_girlypops": 119574,
    "lib_true_libertarians": 35765,
    "lib_ancaps": 6742,
    "grn_eco_socialist_vanguard": 10576,
    "grn_yimby": 2371,
    "soc_socialists": 13821,
    "soc_communists": 9215,
    "unaff_groypers": 3866,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 281336
  },
  "IN": {
    "dem_liberal_establishment": 181228,
    "dem_black_voters": 202528,
    "dem_capital_l_left": 29759,
    "dem_neo_liberals": 39523,
    "dem_bernie_bros": 48946,
    "dem_faith_based_liberals": 110593,
    "dem_blue_dog": 244426,
    "gop_faith_and_flag": 277112,
    "gop_maga": 203352,
    "gop_western_mavericks": 74971,
    "gop_blood_and_soil": 198545,
    "gop_suburban_moderates": 65046,
    "gop_neo_cons": 47153,
    "gop_paleocons": 137658,
    "gop_traditional_farmers": 126788,
    "gop_market_country_club": 10800,
    "swg_true_centrists": 189318,
    "swg_hard_hats": 345368,
    "swg_podcast_bros": 121038,
    "swg_country_club_centrists": 56852,
    "swg_technocrats": 40095,
    "swg_grillers": 139279,
    "swg_religious_moderates": 128668,
    "swg_girlypops": 25682,
    "lib_true_libertarians": 17871,
    "lib_ancaps": 3369,
    "grn_eco_socialist_vanguard": 1775,
    "con_christian_dominionists": 12876,
    "unaff_groypers": 5197,
    "unaff_the_klan": 4810,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 79974
  },
  "IA": {
    "dem_liberal_establishment": 111486,
    "dem_black_voters": 31147,
    "dem_capital_l_left": 18307,
    "dem_neo_liberals": 24313,
    "dem_bernie_bros": 30110,
    "dem_faith_based_liberals": 45356,
    "dem_blue_dog": 136364,
    "gop_faith_and_flag": 106588,
    "gop_maga": 91774,
    "gop_western_mavericks": 42294,
    "gop_blood_and_soil": 70004,
    "gop_suburban_moderates": 73390,
    "gop_neo_cons": 26602,
    "gop_paleocons": 38829,
    "gop_traditional_farmers": 134112,
    "gop_market_country_club": 6092,
    "swg_true_centrists": 109078,
    "swg_hard_hats": 79595,
    "swg_podcast_bros": 46492,
    "swg_country_club_centrists": 32756,
    "swg_technocrats": 23101,
    "swg_grillers": 80248,
    "swg_religious_moderates": 74133,
    "swg_girlypops": 14797,
    "lib_true_libertarians": 2581,
    "lib_ancaps": 486,
    "grn_eco_socialist_vanguard": 255,
    "unaff_groypers": 285,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 40725
  },
  "KS": {
    "dem_liberal_establishment": 77447,
    "dem_black_voters": 21637,
    "dem_capital_l_left": 12717,
    "dem_neo_liberals": 16890,
    "dem_bernie_bros": 20917,
    "dem_faith_based_liberals": 13129,
    "dem_blue_dog": 154482,
    "gop_faith_and_flag": 143522,
    "gop_maga": 52660,
    "gop_western_mavericks": 155315,
    "gop_blood_and_soil": 64268,
    "gop_suburban_moderates": 33689,
    "gop_neo_cons": 24422,
    "gop_paleocons": 17824,
    "gop_traditional_farmers": 123123,
    "gop_market_country_club": 5593,
    "swg_true_centrists": 119375,
    "swg_hard_hats": 29036,
    "swg_podcast_bros": 50881,
    "swg_country_club_centrists": 35848,
    "swg_technocrats": 25282,
    "swg_grillers": 87823,
    "swg_religious_moderates": 46361,
    "swg_girlypops": 16194,
    "lib_true_libertarians": 3500,
    "lib_ancaps": 660,
    "grn_eco_socialist_vanguard": 346,
    "con_christian_dominionists": 2483,
    "unaff_groypers": 385,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 28291
  },
  "KY": {
    "dem_liberal_establishment": 173802,
    "dem_black_voters": 194230,
    "dem_capital_l_left": 28540,
    "dem_neo_liberals": 37904,
    "dem_bernie_bros": 46941,
    "dem_faith_based_liberals": 70708,
    "dem_blue_dog": 372142,
    "gop_faith_and_flag": 390308,
    "gop_maga": 148262,
    "gop_western_mavericks": 68326,
    "gop_blood_and_soil": 282730,
    "gop_suburban_moderates": 59281,
    "gop_neo_cons": 42975,
    "gop_paleocons": 125458,
    "gop_traditional_farmers": 57776,
    "gop_market_country_club": 9842,
    "swg_true_centrists": 22925,
    "swg_hard_hats": 41822,
    "swg_podcast_bros": 14657,
    "swg_country_club_centrists": 6884,
    "swg_technocrats": 4855,
    "swg_grillers": 16866,
    "swg_religious_moderates": 15581,
    "swg_girlypops": 3110,
    "lib_true_libertarians": 23428,
    "lib_ancaps": 4416,
    "grn_eco_socialist_vanguard": 2296,
    "con_christian_dominionists": 16560,
    "unaff_groypers": 2508,
    "unaff_the_klan": 18571,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 76696
  },
  "LA": {
    "dem_liberal_establishment": 78131,
    "dem_black_voters": 316512,
    "dem_capital_l_left": 12830,
    "dem_neo_liberals": 17039,
    "dem_bernie_bros": 21102,
    "dem_faith_based_liberals": 47679,
    "dem_blue_dog": 177103,
    "gop_faith_and_flag": 301047,
    "gop_maga": 114357,
    "gop_western_mavericks": 52701,
    "gop_blood_and_soil": 139567,
    "gop_suburban_moderates": 45724,
    "gop_neo_cons": 33146,
    "gop_paleocons": 24191,
    "gop_traditional_farmers": 11141,
    "gop_market_country_club": 7592,
    "swg_true_centrists": 151745,
    "swg_hard_hats": 110729,
    "swg_podcast_bros": 64678,
    "swg_country_club_centrists": 45569,
    "swg_technocrats": 32137,
    "swg_grillers": 74425,
    "swg_religious_moderates": 58932,
    "swg_girlypops": 20585,
    "lib_true_libertarians": 3227,
    "lib_ancaps": 609,
    "grn_eco_socialist_vanguard": 319,
    "con_christian_dominionists": 2289,
    "unaff_groypers": 356,
    "unaff_the_klan": 880,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 55258
  },
  "ME": {
    "dem_liberal_establishment": 60120,
    "dem_capital_l_left": 59234,
    "dem_neo_liberals": 13112,
    "dem_bernie_bros": 64949,
    "dem_faith_based_liberals": 10192,
    "dem_blue_dog": 12784,
    "gop_faith_and_flag": 24666,
    "gop_maga": 24887,
    "gop_western_mavericks": 122338,
    "gop_blood_and_soil": 12149,
    "gop_suburban_moderates": 31843,
    "gop_neo_cons": 11542,
    "gop_paleocons": 8424,
    "gop_traditional_farmers": 3879,
    "gop_market_country_club": 2644,
    "swg_true_centrists": 75813,
    "swg_hard_hats": 18441,
    "swg_podcast_bros": 32313,
    "swg_country_club_centrists": 22767,
    "swg_technocrats": 16056,
    "swg_grillers": 37183,
    "swg_religious_moderates": 29443,
    "swg_girlypops": 10284,
    "lib_true_libertarians": 5958,
    "lib_ancaps": 1123,
    "grn_eco_socialist_vanguard": 5967,
    "grn_yimby": 402,
    "soc_socialists": 582,
    "soc_communists": 388,
    "unaff_groypers": 643,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 50174
  },
  "MD": {
    "dem_liberal_establishment": 281812,
    "dem_black_voters": 682360,
    "dem_capital_l_left": 102837,
    "dem_neo_liberals": 184377,
    "dem_bernie_bros": 50741,
    "dem_faith_based_liberals": 76433,
    "dem_blue_dog": 67474,
    "gop_faith_and_flag": 116839,
    "gop_maga": 117890,
    "gop_western_mavericks": 86926,
    "gop_blood_and_soil": 57551,
    "gop_suburban_moderates": 75419,
    "gop_neo_cons": 196826,
    "gop_paleocons": 39902,
    "gop_traditional_farmers": 18376,
    "gop_market_country_club": 37565,
    "swg_true_centrists": 159546,
    "swg_hard_hats": 38807,
    "swg_podcast_bros": 68003,
    "swg_country_club_centrists": 143735,
    "swg_technocrats": 152053,
    "swg_grillers": 78251,
    "swg_religious_moderates": 61962,
    "swg_girlypops": 21643,
    "lib_true_libertarians": 12672,
    "lib_ancaps": 2389,
    "grn_eco_socialist_vanguard": 3761,
    "grn_yimby": 843,
    "soc_socialists": 1237,
    "soc_communists": 824,
    "unaff_groypers": 1389,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 188057
  },
  "MA": {
    "dem_liberal_establishment": 187970,
    "dem_black_voters": 35010,
    "dem_capital_l_left": 178341,
    "dem_neo_liberals": 122979,
    "dem_bernie_bros": 135379,
    "dem_faith_based_liberals": 21242,
    "gop_faith_and_flag": 51568,
    "gop_maga": 52033,
    "gop_western_mavericks": 38367,
    "gop_blood_and_soil": 25401,
    "gop_suburban_moderates": 33288,
    "gop_neo_cons": 24132,
    "gop_paleocons": 17612,
    "gop_market_country_club": 33159,
    "swg_true_centrists": 381091,
    "swg_hard_hats": 92695,
    "swg_podcast_bros": 162431,
    "swg_country_club_centrists": 343327,
    "swg_technocrats": 605323,
    "swg_grillers": 186910,
    "swg_religious_moderates": 148002,
    "swg_girlypops": 172321,
    "lib_true_libertarians": 5235,
    "lib_ancaps": 986,
    "grn_eco_socialist_vanguard": 5192,
    "grn_yimby": 1746,
    "soc_socialists": 2044,
    "soc_communists": 1363,
    "unaff_groypers": 575,
    "dem_blue_dog": 13113,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "gop_cubans": 0,
    "dem_abundance": 151865
  },
  "MI": {
    "dem_liberal_establishment": 322374,
    "dem_black_voters": 504371,
    "dem_capital_l_left": 141167,
    "dem_neo_liberals": 56244,
    "dem_bernie_bros": 167168,
    "dem_faith_based_liberals": 157382,
    "dem_blue_dog": 208568,
    "gop_faith_and_flag": 196423,
    "gop_maga": 396385,
    "gop_western_mavericks": 146137,
    "gop_blood_and_soil": 241884,
    "gop_suburban_moderates": 380374,
    "gop_neo_cons": 91915,
    "gop_paleocons": 268331,
    "gop_traditional_farmers": 30893,
    "gop_market_country_club": 21051,
    "swg_true_centrists": 297402,
    "swg_hard_hats": 542542,
    "swg_podcast_bros": 190141,
    "swg_country_club_centrists": 178621,
    "swg_technocrats": 62986,
    "swg_grillers": 218796,
    "swg_religious_moderates": 202125,
    "swg_girlypops": 80687,
    "lib_true_libertarians": 35529,
    "lib_ancaps": 6696,
    "grn_eco_socialist_vanguard": 10497,
    "grn_yimby": 2353,
    "soc_socialists": 3452,
    "soc_communists": 2301,
    "unaff_groypers": 3827,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 205078
  },
  "MN": {
    "dem_liberal_establishment": 191697,
    "dem_black_voters": 42846,
    "dem_capital_l_left": 151099,
    "dem_neo_liberals": 83613,
    "dem_bernie_bros": 165676,
    "dem_faith_based_liberals": 62390,
    "dem_blue_dog": 104766,
    "gop_faith_and_flag": 123086,
    "gop_maga": 124194,
    "gop_western_mavericks": 91575,
    "gop_blood_and_soil": 60629,
    "gop_suburban_moderates": 238356,
    "gop_neo_cons": 57598,
    "gop_paleocons": 42036,
    "gop_traditional_farmers": 154869,
    "gop_market_country_club": 39574,
    "swg_true_centrists": 170830,
    "swg_hard_hats": 311641,
    "swg_podcast_bros": 72812,
    "swg_country_club_centrists": 102601,
    "swg_technocrats": 36180,
    "swg_grillers": 83786,
    "swg_religious_moderates": 116103,
    "swg_girlypops": 46347,
    "lib_true_libertarians": 16308,
    "lib_ancaps": 3074,
    "grn_eco_socialist_vanguard": 4843,
    "grn_yimby": 1085,
    "soc_socialists": 1592,
    "soc_communists": 1062,
    "unaff_groypers": 1761,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 145371
  },
  "MS": {
    "dem_liberal_establishment": 45540,
    "dem_black_voters": 184481,
    "dem_capital_l_left": 7478,
    "dem_neo_liberals": 9931,
    "dem_bernie_bros": 12300,
    "dem_faith_based_liberals": 27790,
    "dem_blue_dog": 103226,
    "gop_faith_and_flag": 195253,
    "gop_maga": 74169,
    "gop_western_mavericks": 34180,
    "gop_blood_and_soil": 141437,
    "gop_suburban_moderates": 29655,
    "gop_neo_cons": 21499,
    "gop_paleocons": 15690,
    "gop_traditional_farmers": 7225,
    "gop_market_country_club": 4924,
    "swg_true_centrists": 139397,
    "swg_hard_hats": 33906,
    "swg_podcast_bros": 59414,
    "swg_country_club_centrists": 41861,
    "swg_technocrats": 29522,
    "swg_grillers": 102553,
    "swg_religious_moderates": 54137,
    "swg_girlypops": 18910,
    "lib_true_libertarians": 6087,
    "lib_ancaps": 1148,
    "grn_eco_socialist_vanguard": 602,
    "con_christian_dominionists": 13496,
    "unaff_groypers": 664,
    "unaff_the_klan": 4918,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 32207
  },
  "MO": {
    "dem_liberal_establishment": 144870,
    "dem_black_voters": 283318,
    "dem_capital_l_left": 23790,
    "dem_neo_liberals": 31593,
    "dem_bernie_bros": 39126,
    "dem_faith_based_liberals": 88406,
    "dem_blue_dog": 195391,
    "gop_faith_and_flag": 266051,
    "gop_maga": 195235,
    "gop_western_mavericks": 71978,
    "gop_blood_and_soil": 190619,
    "gop_suburban_moderates": 62450,
    "gop_neo_cons": 45272,
    "gop_paleocons": 132164,
    "gop_traditional_farmers": 121727,
    "gop_market_country_club": 10368,
    "swg_true_centrists": 179964,
    "swg_hard_hats": 328302,
    "swg_podcast_bros": 115058,
    "swg_country_club_centrists": 54043,
    "swg_technocrats": 38114,
    "swg_grillers": 132397,
    "swg_religious_moderates": 122310,
    "swg_girlypops": 24412,
    "lib_true_libertarians": 17684,
    "lib_ancaps": 3334,
    "grn_eco_socialist_vanguard": 1749,
    "con_christian_dominionists": 12486,
    "unaff_groypers": 1918,
    "unaff_the_klan": 4733,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 74938
  },
  "MT": {
    "dem_liberal_establishment": 31723,
    "dem_capital_l_left": 5210,
    "dem_neo_liberals": 6918,
    "dem_bernie_bros": 20563,
    "dem_faith_based_liberals": 5377,
    "dem_blue_dog": 63279,
    "gop_faith_and_flag": 8915,
    "gop_maga": 8995,
    "gop_western_mavericks": 77378,
    "gop_blood_and_soil": 10977,
    "gop_suburban_moderates": 5755,
    "gop_neo_cons": 4170,
    "gop_paleocons": 3045,
    "gop_mormons": 61498,
    "gop_traditional_farmers": 5609,
    "gop_market_country_club": 955,
    "swg_true_centrists": 52784,
    "swg_hard_hats": 12839,
    "swg_podcast_bros": 22498,
    "swg_country_club_centrists": 15851,
    "swg_technocrats": 11179,
    "swg_grillers": 25889,
    "swg_religious_moderates": 20500,
    "swg_girlypops": 7160,
    "lib_true_libertarians": 4289,
    "lib_ancaps": 1848,
    "grn_eco_socialist_vanguard": 243,
    "unaff_groypers": 268,
    "unaff_the_klan": 1982,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 13603
  },
  "NE": {
    "dem_liberal_establishment": 52462,
    "dem_black_voters": 14656,
    "dem_capital_l_left": 8615,
    "dem_neo_liberals": 11442,
    "dem_bernie_bros": 14169,
    "dem_faith_based_liberals": 8893,
    "dem_blue_dog": 104645,
    "gop_faith_and_flag": 75988,
    "gop_maga": 40892,
    "gop_western_mavericks": 120607,
    "gop_blood_and_soil": 19963,
    "gop_suburban_moderates": 52320,
    "gop_neo_cons": 18964,
    "gop_paleocons": 13841,
    "gop_traditional_farmers": 95609,
    "gop_market_country_club": 4343,
    "swg_true_centrists": 57363,
    "swg_hard_hats": 13953,
    "swg_podcast_bros": 24449,
    "swg_country_club_centrists": 17226,
    "swg_technocrats": 12149,
    "swg_grillers": 42201,
    "swg_religious_moderates": 22278,
    "swg_girlypops": 7781,
    "lib_true_libertarians": 4672,
    "lib_ancaps": 880,
    "grn_eco_socialist_vanguard": 464,
    "unaff_groypers": 512,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 19163
  },
  "NV": {
    "dem_liberal_establishment": 132843,
    "dem_black_voters": 37114,
    "dem_capital_l_left": 21814,
    "dem_neo_liberals": 28971,
    "dem_bernie_bros": 35878,
    "dem_faith_based_liberals": 22519,
    "dem_blue_dog": 71291,
    "dem_traditional_latin": 43556,
    "gop_faith_and_flag": 10037,
    "gop_maga": 20254,
    "gop_western_mavericks": 87117,
    "gop_blood_and_soil": 4943,
    "gop_suburban_moderates": 19436,
    "gop_neo_cons": 4697,
    "gop_paleocons": 3428,
    "gop_mormons": 288496,
    "gop_traditional_farmers": 1579,
    "gop_market_country_club": 1075,
    "swg_true_centrists": 103121,
    "swg_hard_hats": 25083,
    "swg_podcast_bros": 98893,
    "swg_country_club_centrists": 30967,
    "swg_technocrats": 21840,
    "swg_grillers": 50577,
    "swg_religious_moderates": 40047,
    "swg_working_class_latinos": 201583,
    "swg_girlypops": 13989,
    "lib_true_libertarians": 31217,
    "lib_ancaps": 13450,
    "grn_eco_socialist_vanguard": 1771,
    "unaff_groypers": 1887,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 48527
  },
  "NH": {
    "dem_liberal_establishment": 60741,
    "dem_capital_l_left": 9974,
    "dem_neo_liberals": 13247,
    "dem_bernie_bros": 65619,
    "dem_faith_based_liberals": 10296,
    "dem_blue_dog": 12916,
    "gop_faith_and_flag": 17538,
    "gop_maga": 17696,
    "gop_western_mavericks": 152230,
    "gop_blood_and_soil": 8639,
    "gop_suburban_moderates": 33962,
    "gop_neo_cons": 8207,
    "gop_paleocons": 5990,
    "gop_traditional_farmers": 2758,
    "gop_market_country_club": 1880,
    "swg_true_centrists": 91332,
    "swg_hard_hats": 22215,
    "swg_podcast_bros": 38928,
    "swg_country_club_centrists": 27427,
    "swg_technocrats": 19343,
    "swg_grillers": 44795,
    "swg_religious_moderates": 35470,
    "swg_girlypops": 12390,
    "dem_abundance": 32207,
    "dem_black_voters": null
  },
  "NJ": {
    "dem_liberal_establishment": 464198,
    "dem_black_voters": 345838,
    "dem_capital_l_left": 169393,
    "dem_neo_liberals": 303702,
    "dem_bernie_bros": 83581,
    "dem_faith_based_liberals": 52458,
    "dem_blue_dog": 65806,
    "gop_faith_and_flag": 183926,
    "gop_maga": 185584,
    "gop_western_mavericks": 136840,
    "gop_blood_and_soil": 90598,
    "gop_suburban_moderates": 118724,
    "gop_neo_cons": 172136,
    "gop_paleocons": 62815,
    "gop_market_country_club": 118267,
    "gop_cubans": 68609,
    "swg_true_centrists": 343338,
    "swg_hard_hats": 83512,
    "swg_podcast_bros": 146339,
    "swg_country_club_centrists": 309314,
    "swg_technocrats": 327214,
    "swg_grillers": 168393,
    "swg_religious_moderates": 133340,
    "swg_girlypops": 93150,
    "lib_true_libertarians": 10752,
    "lib_ancaps": 2026,
    "grn_eco_socialist_vanguard": 3187,
    "grn_yimby": 715,
    "soc_socialists": 1048,
    "soc_communists": 699,
    "unaff_groypers": 1182,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "dem_abundance": 239216
  },
  "NM": {
    "dem_liberal_establishment": 80779,
    "dem_black_voters": 22568,
    "dem_capital_l_left": 44216,
    "dem_neo_liberals": 17617,
    "dem_bernie_bros": 52360,
    "dem_faith_based_liberals": 13693,
    "dem_blue_dog": 43350,
    "dem_traditional_latin": 52969,
    "gop_faith_and_flag": 17346,
    "gop_maga": 17502,
    "gop_western_mavericks": 86035,
    "gop_blood_and_soil": 8545,
    "gop_suburban_moderates": 22393,
    "gop_neo_cons": 8116,
    "gop_paleocons": 5924,
    "gop_mormons": 119662,
    "gop_traditional_farmers": 2728,
    "gop_market_country_club": 1859,
    "swg_true_centrists": 49604,
    "swg_hard_hats": 12065,
    "swg_podcast_bros": 21142,
    "swg_country_club_centrists": 14896,
    "swg_technocrats": 10505,
    "swg_grillers": 24329,
    "swg_religious_moderates": 19264,
    "swg_working_class_latinos": 96966,
    "swg_girlypops": 6729,
    "lib_true_libertarians": 3910,
    "lib_ancaps": 738,
    "grn_eco_socialist_vanguard": 1154,
    "grn_yimby": 258,
    "unaff_groypers": 426,
    "gop_cubans": 0,
    "dem_abundance": 48152
  },
  "NY": {
    "dem_liberal_establishment": 804246,
    "dem_black_voters": 1048675,
    "dem_capital_l_left": 763043,
    "dem_neo_liberals": 526197,
    "dem_bernie_bros": 347549,
    "dem_faith_based_liberals": 90890,
    "dem_blue_dog": 114015,
    "dem_traditional_latin": 175798,
    "gop_faith_and_flag": 342794,
    "gop_maga": 345882,
    "gop_western_mavericks": 255037,
    "gop_blood_and_soil": 168853,
    "gop_suburban_moderates": 221275,
    "gop_neo_cons": 320819,
    "gop_paleocons": 117072,
    "gop_traditional_farmers": 53914,
    "gop_market_country_club": 220422,
    "gop_cubans": 67299,
    "swg_true_centrists": 396339,
    "swg_hard_hats": 96404,
    "swg_podcast_bros": 168930,
    "swg_country_club_centrists": 357063,
    "swg_technocrats": 377725,
    "swg_grillers": 194388,
    "swg_religious_moderates": 153923,
    "swg_working_class_latinos": 413213,
    "swg_girlypops": 179215,
    "lib_true_libertarians": 56338,
    "lib_ancaps": 10620,
    "grn_eco_socialist_vanguard": 54990,
    "grn_yimby": 18492,
    "soc_socialists": 21835,
    "soc_communists": 14556,
    "unaff_groypers": 16130,
    "gop_mormons": 0,
    "dem_abundance": 676859
  },
  "NC": {
    "dem_liberal_establishment": 224201,
    "dem_black_voters": 651437,
    "dem_capital_l_left": 29453,
    "dem_neo_liberals": 97789,
    "dem_bernie_bros": 48443,
    "dem_faith_based_liberals": 109454,
    "dem_blue_dog": 241910,
    "gop_faith_and_flag": 346466,
    "gop_maga": 254245,
    "gop_western_mavericks": 93734,
    "gop_blood_and_soil": 248235,
    "gop_suburban_moderates": 243975,
    "gop_neo_cons": 212239,
    "gop_paleocons": 86054,
    "gop_traditional_farmers": 19815,
    "gop_market_country_club": 40506,
    "swg_true_centrists": 352230,
    "swg_hard_hats": 257025,
    "swg_podcast_bros": 337792,
    "swg_country_club_centrists": 211551,
    "swg_technocrats": 335688,
    "swg_grillers": 172755,
    "swg_religious_moderates": 239389,
    "swg_girlypops": 159270,
    "lib_true_libertarians": 6324,
    "lib_ancaps": 1192,
    "grn_eco_socialist_vanguard": 626,
    "con_christian_dominionists": 4486,
    "unaff_groypers": 1863,
    "unaff_the_klan": 1725,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 135828
  },
  "ND": {
    "dem_liberal_establishment": 27158,
    "dem_capital_l_left": 4459,
    "dem_neo_liberals": 5923,
    "dem_bernie_bros": 7335,
    "dem_faith_based_liberals": 4603,
    "dem_blue_dog": 54172,
    "gop_faith_and_flag": 32854,
    "gop_maga": 17680,
    "gop_western_mavericks": 52145,
    "gop_blood_and_soil": 8631,
    "gop_suburban_moderates": 11310,
    "gop_neo_cons": 8200,
    "gop_paleocons": 5984,
    "gop_traditional_farmers": 41337,
    "gop_market_country_club": 1878,
    "swg_true_centrists": 45838,
    "swg_hard_hats": 11150,
    "swg_podcast_bros": 19537,
    "swg_country_club_centrists": 13765,
    "swg_technocrats": 9708,
    "swg_grillers": 22482,
    "swg_religious_moderates": 17802,
    "swg_girlypops": 6218,
    "lib_true_libertarians": 3225,
    "lib_ancaps": 608,
    "grn_eco_socialist_vanguard": 319,
    "unaff_groypers": 347,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 9232
  },
  "OH": {
    "dem_liberal_establishment": 264520,
    "dem_black_voters": 517317,
    "dem_capital_l_left": 43437,
    "dem_neo_liberals": 57687,
    "dem_bernie_bros": 71442,
    "dem_faith_based_liberals": 161422,
    "dem_blue_dog": 356766,
    "gop_faith_and_flag": 306542,
    "gop_maga": 329923,
    "gop_western_mavericks": 121635,
    "gop_blood_and_soil": 322123,
    "gop_suburban_moderates": 211064,
    "gop_neo_cons": 153008,
    "gop_paleocons": 223340,
    "gop_traditional_farmers": 102852,
    "gop_market_country_club": 52563,
    "swg_true_centrists": 280055,
    "swg_hard_hats": 510896,
    "swg_podcast_bros": 268575,
    "swg_country_club_centrists": 168202,
    "swg_technocrats": 59312,
    "swg_grillers": 206034,
    "swg_religious_moderates": 190336,
    "swg_girlypops": 37990,
    "lib_true_libertarians": 33918,
    "lib_ancaps": 6394,
    "grn_eco_socialist_vanguard": 3373,
    "unaff_groypers": 9838,
    "unaff_the_klan": 9106,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 136830
  },
  "OK": {
    "dem_liberal_establishment": 81409,
    "dem_black_voters": 22745,
    "dem_capital_l_left": 13369,
    "dem_neo_liberals": 17754,
    "dem_bernie_bros": 21987,
    "dem_faith_based_liberals": 33119,
    "dem_blue_dog": 174312,
    "gop_faith_and_flag": 250049,
    "gop_maga": 94984,
    "gop_western_mavericks": 175091,
    "gop_blood_and_soil": 181130,
    "gop_suburban_moderates": 37978,
    "gop_neo_cons": 27532,
    "gop_paleocons": 20093,
    "gop_traditional_farmers": 37014,
    "gop_market_country_club": 6305,
    "swg_true_centrists": 99029,
    "swg_hard_hats": 24087,
    "swg_podcast_bros": 42209,
    "swg_country_club_centrists": 29739,
    "swg_technocrats": 20973,
    "swg_grillers": 48570,
    "swg_religious_moderates": 38459,
    "swg_girlypops": 13434,
    "lib_true_libertarians": 2236,
    "lib_ancaps": 421,
    "grn_eco_socialist_vanguard": 221,
    "con_christian_dominionists": 4955,
    "unaff_groypers": 247,
    "unaff_the_klan": 610,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 29739
  },
  "OR": {
    "dem_liberal_establishment": 171273,
    "dem_black_voters": 38281,
    "dem_capital_l_left": 195000,
    "dem_neo_liberals": 29882,
    "dem_bernie_bros": 148024,
    "dem_faith_based_liberals": 23226,
    "gop_faith_and_flag": 62597,
    "gop_maga": 63161,
    "gop_western_mavericks": 310478,
    "gop_blood_and_soil": 30834,
    "gop_suburban_moderates": 40407,
    "gop_neo_cons": 29292,
    "gop_paleocons": 21378,
    "gop_traditional_farmers": 9845,
    "gop_market_country_club": 6708,
    "swg_true_centrists": 231334,
    "swg_hard_hats": 56269,
    "swg_podcast_bros": 98600,
    "swg_country_club_centrists": 138940,
    "swg_technocrats": 48993,
    "swg_grillers": 113460,
    "swg_religious_moderates": 89842,
    "swg_girlypops": 62762,
    "lib_true_libertarians": 24969,
    "lib_ancaps": 4707,
    "grn_eco_socialist_vanguard": 24468,
    "grn_yimby": 8227,
    "soc_socialists": 9827,
    "soc_communists": 6552,
    "unaff_groypers": 2613,
    "dem_blue_dog": 14338,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 146513
  },
  "PA": {
    "dem_liberal_establishment": 472588,
    "dem_black_voters": 739385,
    "dem_capital_l_left": 206944,
    "dem_neo_liberals": 206128,
    "dem_bernie_bros": 245061,
    "dem_faith_based_liberals": 230715,
    "dem_blue_dog": 305751,
    "gop_faith_and_flag": 426488,
    "gop_maga": 459018,
    "gop_western_mavericks": 169228,
    "gop_blood_and_soil": 448167,
    "gop_suburban_moderates": 440455,
    "gop_neo_cons": 212878,
    "gop_paleocons": 310753,
    "gop_traditional_farmers": 35775,
    "gop_market_country_club": 73130,
    "swg_true_centrists": 137523,
    "swg_hard_hats": 250880,
    "swg_podcast_bros": 87924,
    "swg_country_club_centrists": 82597,
    "swg_technocrats": 29125,
    "swg_grillers": 101174,
    "swg_religious_moderates": 93466,
    "swg_girlypops": 37311,
    "lib_true_libertarians": 43180,
    "lib_ancaps": 8140,
    "grn_eco_socialist_vanguard": 12839,
    "grn_yimby": 2878,
    "soc_socialists": 4223,
    "soc_communists": 2815,
    "unaff_groypers": 12544,
    "unaff_the_klan": 11609,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 316108
  },
  "RI": {
    "dem_liberal_establishment": 62813,
    "dem_black_voters": 11699,
    "dem_capital_l_left": 41258,
    "dem_neo_liberals": 9132,
    "dem_bernie_bros": 11310,
    "dem_faith_based_liberals": 7098,
    "dem_blue_dog": 8905,
    "gop_faith_and_flag": 16369,
    "gop_maga": 16517,
    "gop_western_mavericks": 12179,
    "gop_blood_and_soil": 8063,
    "gop_suburban_moderates": 10567,
    "gop_neo_cons": 7660,
    "gop_paleocons": 5591,
    "gop_market_country_club": 1754,
    "swg_true_centrists": 87765,
    "swg_hard_hats": 21348,
    "swg_podcast_bros": 37408,
    "swg_country_club_centrists": 26356,
    "swg_technocrats": 18587,
    "swg_grillers": 43045,
    "swg_religious_moderates": 34085,
    "swg_girlypops": 11906,
    "dem_abundance": 31985
  },
  "SC": {
    "dem_liberal_establishment": 89290,
    "dem_black_voters": 361721,
    "dem_capital_l_left": 14663,
    "dem_neo_liberals": 19473,
    "dem_bernie_bros": 24116,
    "dem_faith_based_liberals": 54489,
    "dem_blue_dog": 120428,
    "gop_faith_and_flag": 294654,
    "gop_maga": 111928,
    "gop_western_mavericks": 51581,
    "gop_blood_and_soil": 213442,
    "gop_suburban_moderates": 44753,
    "gop_neo_cons": 116794,
    "gop_paleocons": 47356,
    "gop_traditional_farmers": 10904,
    "gop_market_country_club": 7430,
    "swg_true_centrists": 214061,
    "swg_hard_hats": 156202,
    "swg_podcast_bros": 136858,
    "swg_country_club_centrists": 64283,
    "swg_technocrats": 45335,
    "swg_grillers": 104989,
    "swg_religious_moderates": 83134,
    "swg_girlypops": 29038,
    "lib_true_libertarians": 10542,
    "lib_ancaps": 1987,
    "grn_eco_socialist_vanguard": 1045,
    "con_christian_dominionists": 23548,
    "unaff_groypers": 1155,
    "unaff_the_klan": 8551,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 63150
  },
  "SD": {
    "dem_liberal_establishment": 26461,
    "dem_capital_l_left": 4345,
    "dem_neo_liberals": 5771,
    "dem_bernie_bros": 7147,
    "dem_faith_based_liberals": 4485,
    "dem_blue_dog": 52782,
    "gop_faith_and_flag": 49261,
    "gop_maga": 26509,
    "gop_western_mavericks": 78187,
    "gop_blood_and_soil": 12942,
    "gop_suburban_moderates": 16959,
    "gop_neo_cons": 12295,
    "gop_paleocons": 8972,
    "gop_traditional_farmers": 61982,
    "gop_market_country_club": 2816,
    "swg_true_centrists": 20181,
    "swg_hard_hats": 4909,
    "swg_podcast_bros": 8602,
    "swg_country_club_centrists": 6060,
    "swg_technocrats": 4274,
    "swg_grillers": 9898,
    "swg_religious_moderates": 7838,
    "swg_girlypops": 2738,
    "lib_true_libertarians": 13962,
    "lib_ancaps": 2632,
    "grn_eco_socialist_vanguard": 1383,
    "unaff_groypers": 1413,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 8996
  },
  "TN": {
    "dem_liberal_establishment": 146550,
    "dem_black_voters": 286605,
    "dem_capital_l_left": 24065,
    "dem_neo_liberals": 31960,
    "dem_bernie_bros": 39580,
    "dem_faith_based_liberals": 89432,
    "dem_blue_dog": 197656,
    "gop_faith_and_flag": 415671,
    "gop_maga": 197372,
    "gop_western_mavericks": 72766,
    "gop_blood_and_soil": 301103,
    "gop_suburban_moderates": 63133,
    "gop_neo_cons": 45768,
    "gop_paleocons": 133610,
    "gop_traditional_farmers": 15383,
    "gop_market_country_club": 10482,
    "swg_true_centrists": 228967,
    "swg_hard_hats": 167079,
    "swg_podcast_bros": 219581,
    "swg_country_club_centrists": 68759,
    "swg_technocrats": 48492,
    "swg_grillers": 168448,
    "swg_religious_moderates": 155614,
    "swg_girlypops": 31060,
    "lib_true_libertarians": 13394,
    "lib_ancaps": 2524,
    "grn_eco_socialist_vanguard": 1330,
    "con_christian_dominionists": 29909,
    "unaff_groypers": 3919,
    "unaff_the_klan": 10880,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 75808
  },
  "TX": {
    "dem_liberal_establishment": 674897,
    "dem_black_voters": 754221,
    "dem_capital_l_left": 110826,
    "dem_neo_liberals": 367961,
    "dem_bernie_bros": 182276,
    "dem_faith_based_liberals": 411851,
    "dem_blue_dog": 545827,
    "dem_traditional_latin": 442533,
    "gop_faith_and_flag": 917852,
    "gop_maga": 538841,
    "gop_western_mavericks": 993273,
    "gop_blood_and_soil": 411005,
    "gop_suburban_moderates": 430890,
    "gop_neo_cons": 562261,
    "gop_paleocons": 113987,
    "gop_traditional_farmers": 52494,
    "gop_market_country_club": 214617,
    "swg_true_centrists": 530622,
    "swg_hard_hats": 387199,
    "swg_podcast_bros": 508870,
    "swg_country_club_centrists": 318693,
    "swg_technocrats": 505702,
    "swg_grillers": 260249,
    "swg_religious_moderates": 360630,
    "swg_working_class_latinos": 1037275,
    "swg_girlypops": 143960,
    "lib_true_libertarians": 69725,
    "lib_ancaps": 13143,
    "grn_eco_socialist_vanguard": 6876,
    "con_christian_dominionists": 49537,
    "unaff_groypers": 20131,
    "unaff_the_klan": 18631,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 325445
  },
  "UT": {
    "dem_liberal_establishment": 71708,
    "dem_capital_l_left": 11776,
    "dem_neo_liberals": 15638,
    "dem_bernie_bros": 19367,
    "dem_faith_based_liberals": 12155,
    "dem_blue_dog": 38483,
    "gop_faith_and_flag": 55045,
    "gop_maga": 20196,
    "gop_western_mavericks": 99280,
    "gop_blood_and_soil": 9859,
    "gop_suburban_moderates": 12920,
    "gop_neo_cons": 18733,
    "gop_paleocons": 6836,
    "gop_mormons": 484211,
    "gop_traditional_farmers": 3149,
    "gop_market_country_club": 2145,
    "swg_true_centrists": 79512,
    "swg_hard_hats": 19340,
    "swg_podcast_bros": 76252,
    "swg_country_club_centrists": 47755,
    "swg_technocrats": 75778,
    "swg_grillers": 38997,
    "swg_religious_moderates": 30880,
    "swg_girlypops": 10786,
    "lib_true_libertarians": 24970,
    "lib_ancaps": 2690,
    "grn_eco_socialist_vanguard": 1412,
    "con_christian_dominionists": 10126,
    "unaff_groypers": 1523,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 24378
  },
  "VT": {
    "dem_liberal_establishment": 26684,
    "dem_capital_l_left": 37976,
    "dem_neo_liberals": 5820,
    "dem_bernie_bros": 26759,
    "dem_faith_based_liberals": 4524,
    "gop_faith_and_flag": 18142,
    "gop_maga": 18305,
    "gop_western_mavericks": 13498,
    "gop_blood_and_soil": 8937,
    "gop_suburban_moderates": 11711,
    "gop_neo_cons": 8490,
    "gop_paleocons": 6196,
    "gop_traditional_farmers": 2853,
    "gop_market_country_club": 1944,
    "swg_true_centrists": 35137,
    "swg_hard_hats": 8547,
    "swg_podcast_bros": 14976,
    "swg_country_club_centrists": 10552,
    "swg_technocrats": 7442,
    "swg_grillers": 17233,
    "swg_religious_moderates": 13646,
    "swg_girlypops": 4767,
    "lib_true_libertarians": 1600,
    "lib_ancaps": 302,
    "grn_eco_socialist_vanguard": 1585,
    "grn_yimby": 106,
    "soc_socialists": 2256,
    "soc_communists": 1333,
    "unaff_groypers": 173,
    "dem_black_voters": 0,
    "dem_blue_dog": 2792,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 26114
  },
  "VA": {
    "dem_liberal_establishment": 354768,
    "dem_black_voters": 462542,
    "dem_capital_l_left": 38838,
    "dem_neo_liberals": 232108,
    "dem_bernie_bros": 63876,
    "dem_faith_based_liberals": 96220,
    "dem_blue_dog": 84941,
    "gop_faith_and_flag": 280014,
    "gop_maga": 150686,
    "gop_western_mavericks": 111109,
    "gop_blood_and_soil": 73561,
    "gop_suburban_moderates": 289198,
    "gop_neo_cons": 251579,
    "gop_paleocons": 102006,
    "gop_traditional_farmers": 23488,
    "gop_market_country_club": 96028,
    "swg_true_centrists": 284044,
    "swg_hard_hats": 69090,
    "swg_podcast_bros": 181601,
    "swg_country_club_centrists": 255897,
    "swg_technocrats": 270705,
    "swg_grillers": 139312,
    "swg_religious_moderates": 110313,
    "swg_girlypops": 128438,
    "lib_true_libertarians": 31620,
    "lib_ancaps": 5961,
    "grn_eco_socialist_vanguard": 3132,
    "unaff_groypers": 3417,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 167208
  },
  "WA": {
    "dem_liberal_establishment": 265152,
    "dem_black_voters": 59264,
    "dem_capital_l_left": 301883,
    "dem_neo_liberals": 208170,
    "dem_bernie_bros": 229159,
    "dem_faith_based_liberals": 35957,
    "gop_faith_and_flag": 106853,
    "gop_maga": 107815,
    "gop_western_mavericks": 529984,
    "gop_blood_and_soil": 52633,
    "gop_suburban_moderates": 68974,
    "gop_neo_cons": 100003,
    "gop_paleocons": 36492,
    "gop_traditional_farmers": 16805,
    "gop_market_country_club": 34354,
    "swg_true_centrists": 226411,
    "swg_hard_hats": 55071,
    "swg_podcast_bros": 144753,
    "swg_country_club_centrists": 135983,
    "swg_technocrats": 359629,
    "swg_grillers": 111045,
    "swg_religious_moderates": 87930,
    "swg_girlypops": 102378,
    "lib_true_libertarians": 18743,
    "lib_ancaps": 3532,
    "grn_eco_socialist_vanguard": 18239,
    "grn_yimby": 6134,
    "soc_socialists": 7237,
    "soc_communists": 4825,
    "unaff_groypers": 2019,
    "dem_blue_dog": 22196,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 247077
  },
  "WV": {
    "dem_liberal_establishment": 47554,
    "dem_black_voters": 13286,
    "dem_capital_l_left": 7809,
    "dem_neo_liberals": 10371,
    "dem_bernie_bros": 12844,
    "dem_faith_based_liberals": 19346,
    "dem_blue_dog": 101823,
    "gop_faith_and_flag": 126508,
    "gop_maga": 48055,
    "gop_western_mavericks": 22145,
    "gop_blood_and_soil": 91640,
    "gop_suburban_moderates": 19215,
    "gop_neo_cons": 13930,
    "gop_paleocons": 40664,
    "gop_traditional_farmers": 4682,
    "gop_market_country_club": 3190,
    "swg_true_centrists": 43814,
    "swg_hard_hats": 79928,
    "swg_podcast_bros": 18674,
    "swg_country_club_centrists": 13157,
    "swg_technocrats": 9279,
    "swg_grillers": 21489,
    "swg_religious_moderates": 17016,
    "swg_girlypops": 5943,
    "lib_true_libertarians": 5937,
    "lib_ancaps": 1119,
    "grn_eco_socialist_vanguard": 588,
    "con_christian_dominionists": 4218,
    "unaff_groypers": 643,
    "unaff_the_klan": 4763,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 17370
  },
  "WI": {
    "dem_liberal_establishment": 228061,
    "dem_black_voters": 50974,
    "dem_capital_l_left": 99868,
    "dem_neo_liberals": 39789,
    "dem_bernie_bros": 197104,
    "dem_faith_based_liberals": 74226,
    "dem_blue_dog": 124640,
    "gop_faith_and_flag": 95055,
    "gop_maga": 191821,
    "gop_western_mavericks": 70720,
    "gop_blood_and_soil": 117055,
    "gop_suburban_moderates": 184073,
    "gop_neo_cons": 44480,
    "gop_paleocons": 129853,
    "gop_traditional_farmers": 119600,
    "gop_market_country_club": 10187,
    "swg_true_centrists": 169489,
    "swg_hard_hats": 309193,
    "swg_podcast_bros": 108361,
    "swg_country_club_centrists": 50898,
    "swg_technocrats": 35895,
    "swg_grillers": 124691,
    "swg_religious_moderates": 115190,
    "swg_girlypops": 45983,
    "lib_true_libertarians": 19263,
    "lib_ancaps": 3631,
    "grn_eco_socialist_vanguard": 5678,
    "grn_yimby": 1273,
    "soc_socialists": 1867,
    "soc_communists": 1245,
    "unaff_groypers": 2070,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_cubans": 0,
    "dem_abundance": 135867
  },
  "WY": {
    "dem_liberal_establishment": 5923,
    "dem_capital_l_left": 973,
    "dem_neo_liberals": 1292,
    "dem_bernie_bros": 1599,
    "dem_faith_based_liberals": 1004,
    "dem_blue_dog": 11814,
    "gop_faith_and_flag": 3448,
    "gop_maga": 3479,
    "gop_western_mavericks": 29929,
    "gop_blood_and_soil": 1698,
    "gop_suburban_moderates": 2226,
    "gop_neo_cons": 1614,
    "gop_paleocons": 1178,
    "gop_mormons": 126862,
    "gop_traditional_farmers": 2169,
    "gop_market_country_club": 369,
    "swg_true_centrists": 6289,
    "swg_hard_hats": 1530,
    "swg_podcast_bros": 2681,
    "swg_country_club_centrists": 1889,
    "swg_technocrats": 1332,
    "swg_grillers": 3084,
    "swg_religious_moderates": 2442,
    "swg_girlypops": 853,
    "lib_true_libertarians": 1119,
    "lib_ancaps": 482,
    "grn_eco_socialist_vanguard": 64,
    "unaff_groypers": 70,
    "unaff_the_klan": 174,
    "dem_black_voters": 0,
    "dem_traditional_latin": 0,
    "gop_cubans": 0,
    "grn_yimby": 0,
    "dem_abundance": 2014
  },
  "DC": {
    "dem_liberal_establishment": 45429,
    "dem_black_voters": 109997,
    "dem_capital_l_left": 29839,
    "dem_neo_liberals": 29721,
    "dem_bernie_bros": 8179,
    "dem_faith_based_liberals": 5134,
    "gop_faith_and_flag": 2951,
    "gop_maga": 2978,
    "gop_western_mavericks": 2196,
    "gop_blood_and_soil": 1454,
    "gop_suburban_moderates": 1906,
    "gop_neo_cons": 4972,
    "gop_paleocons": 1008,
    "gop_market_country_club": 316,
    "swg_true_centrists": 17309,
    "swg_hard_hats": 4210,
    "swg_podcast_bros": 7378,
    "swg_country_club_centrists": 5198,
    "swg_technocrats": 3666,
    "swg_grillers": 8490,
    "swg_religious_moderates": 6722,
    "swg_girlypops": 7827,
    "lib_true_libertarians": 1062,
    "lib_ancaps": 200,
    "grn_eco_socialist_vanguard": 315,
    "grn_yimby": 353,
    "soc_socialists": 104,
    "soc_communists": 69,
    "unaff_groypers": 117,
    "dem_blue_dog": 3169,
    "dem_traditional_latin": 0,
    "gop_mormons": 0,
    "gop_traditional_farmers": 0,
    "gop_cubans": 0,
    "dem_abundance": 35231
  }
};

  const FACTION_NATIONAL_TOTALS = {
  "dem_liberal_establishment": 10616200,
  "dem_black_voters": 11029800,
  "dem_capital_l_left": 5396100,
  "dem_neo_liberals": 5140351,
  "dem_bernie_bros": 4258200,
  "dem_faith_based_liberals": 3239900,
  "dem_blue_dog": 5864800,
  "gop_faith_and_flag": 9234800,
  "gop_maga": 7194100,
  "gop_western_mavericks": 6684100,
  "gop_blood_and_soil": 6154400,
  "gop_suburban_moderates": 5344600,
  "gop_neo_cons": 5258000,
  "gop_paleocons": 3083400,
  "gop_traditional_farmers": 2056400,
  "gop_market_country_club": 2062300,
  "swg_true_centrists": 9006000,
  "swg_hard_hats": 6004000,
  "swg_podcast_bros": 6004000,
  "swg_country_club_centrists": 5503500,
  "swg_technocrats": 5503500,
  "swg_grillers": 5003000,
  "swg_religious_moderates": 4502800,
  "swg_girlypops": 2500500,
  "lib_true_libertarians": 989000,
  "lib_ancaps": 197800,
  "grn_eco_socialist_vanguard": 398700,
  "con_christian_dominionists": 235600,
  "unaff_groypers": 200000,
  "unaff_the_klan": 142200,
  "dem_traditional_latin": 1905100,
  "gop_mormons": 2462700,
  "gop_cubans": 823200,
  "grn_yimby": 114100,
  "soc_socialists": 144800,
  "dem_abundance": 6643149,
  "swg_working_class_latinos": 4002500,
  "soc_communists": 96400
};

  const PartyChairData = (typeof window !== 'undefined' ? (window.PartyChairData = window.PartyChairData || {}) : (global.PartyChairData = global.PartyChairData || {}));
  PartyChairData.FACTIONS_CATALOG = FACTIONS_CATALOG;
  PartyChairData.FACTIONS = FACTIONS_CATALOG;
  PartyChairData.FACTION_NAME_TO_ID = FACTION_NAME_TO_ID;
  PartyChairData.FACTION_STATE_MATRIX = FACTION_STATE_MATRIX;
  PartyChairData.FACTION_NATIONAL_TOTALS = FACTION_NATIONAL_TOTALS;
  
  // REQ-297: Faction cohesion helpers & Rule 7 qualitative labels
  function getFactionCohesion(factionOrId) {
    if (!factionOrId) return 0.50;
    if (typeof factionOrId === 'object') {
      if (typeof factionOrId.cohesion === 'number') return Math.max(0.1, Math.min(1.0, factionOrId.cohesion));
      factionOrId = factionOrId.id;
    }
    const found = FACTIONS_CATALOG.find((f) => f.id === factionOrId);
    if (found && typeof found.cohesion === 'number') return Math.max(0.1, Math.min(1.0, found.cohesion));
    return 0.50;
  }

  function getFactionCohesionLabel(cohesionVal) {
    const c = Number(cohesionVal ?? 0.5);
    if (c >= 0.85) return 'Ironclad Doctrinal Bloc';
    if (c >= 0.70) return 'Disciplined Ideological Caucus';
    if (c >= 0.50) return 'Principled Coalition';
    if (c >= 0.35) return 'Flexible Big-Tent Wing';
    return 'Sprawling, Easygoing Coalition';
  }

  // REQ-287: Faction growth profile & regional lift calculation
  function getFactionGrowthProfile(factionOrId) {
    if (!factionOrId) return null;
    let fid = typeof factionOrId === 'object' ? factionOrId.id : factionOrId;
    const found = FACTIONS_CATALOG.find((f) => f.id === fid);
    return found?.growthProfile || null;
  }

  function calculateFactionRegistrationLift(factionOrId, stateId, options = {}) {
    const profile = getFactionGrowthProfile(factionOrId) || (typeof factionOrId === 'object' ? factionOrId.growthProfile : null);
    if (!profile) return 1.0;
    const relevance = Array.isArray(profile.regionalRelevance) ? profile.regionalRelevance : [];
    const isRelevant = relevance.includes(stateId);
    const archetype = profile.archetype || '';
    
    // Archetype cluster checks
    const urbanCampusStates = ['NY', 'CA', 'MA', 'VT', 'WA', 'OR', 'IL', 'DC', 'CO', 'MD', 'MN', 'CT', 'RI'];
    const frontierStates = ['WY', 'ID', 'MT', 'AK', 'NV', 'UT', 'AZ', 'CO', 'NM'];
    const laborStates = ['MI', 'OH', 'PA', 'WI', 'IL', 'IN', 'WV', 'MN', 'MO', 'KY'];
    
    if (isRelevant) {
      if (archetype === 'urban_campus' && urbanCampusStates.includes(stateId)) return 1.85;
      if (archetype === 'high_elasticity_frontier' && frontierStates.includes(stateId)) return 1.90;
      if (archetype === 'labor_stronghold' && laborStates.includes(stateId)) return 1.80;
      return 1.65;
    }
    
    // Non-relevant but cluster-adjacent
    if (archetype === 'urban_campus' && urbanCampusStates.includes(stateId)) return 1.35;
    if (archetype === 'high_elasticity_frontier' && frontierStates.includes(stateId)) return 1.40;
    if (archetype === 'labor_stronghold' && laborStates.includes(stateId)) return 1.35;
    
    // Outside relevance map: diminished, not zero
    return 0.65;
  }

  PartyChairData.getFactionCohesion = getFactionCohesion;
  PartyChairData.getFactionCohesionLabel = getFactionCohesionLabel;
  PartyChairData.getFactionGrowthProfile = getFactionGrowthProfile;
  PartyChairData.calculateFactionRegistrationLift = calculateFactionRegistrationLift;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FACTIONS_CATALOG, FACTION_NAME_TO_ID, FACTION_STATE_MATRIX, FACTION_NATIONAL_TOTALS, getFactionCohesion, getFactionCohesionLabel, getFactionGrowthProfile, calculateFactionRegistrationLift };
  }
})();
