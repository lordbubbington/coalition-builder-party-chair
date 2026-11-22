/**
 * historical-emergent-parties.js
 * Dedicated Game Definitions for Historical Emergent Parties:
 * - 1912: Progressive Party ("Bull Moose") & Socialist Party of America
 * - 1924: Progressive Party / CPPA ("Fighting Bob" La Follette)
 * - 1960 / 1968: Dixiecrat Party (States' Rights / American Independent)
 * - 1980: National Unity Campaign (John Anderson) & Libertarian Party (Ed Clark)
 * - 1992: United We Stand America (Ross Perot)
 * - 2000: Green Party (Ralph Nader) & Reform Party (Pat Buchanan)
 * - 2016: Libertarian Party (Gary Johnson / Bill Weld) & Green Party (Jill Stein)
 */

(function() {
  const HISTORICAL_EMERGENT_PARTIES = {
    // 1. 1912: THE BULL MOOSE PROGRESSIVE PARTY
    prog_bull_moose: {
      id: 'prog_bull_moose',
      name: 'Progressive Party ("Bull Moose")',
      shortName: 'Bull Moose',
      color: '#b83a24',
      emblem: 'Bull Moose Antlers',
      startYear: 1912,
      era: 'The Progressive Era',
      motto: 'To dissolve the unholy alliance between corrupt business and corrupt politics.',
      description: 'Born from Theodore Roosevelt’s historic bolt from the 1912 Republican National Convention. An electrifying crusade fusing industrial regulation, women’s suffrage, conservation, and direct democracy.',
      factions: [
        {
          id: 'rooseveltian_insurgents',
          name: 'Rooseveltian Insurgents',
          share: 0.45,
          happiness: 85,
          confidence: 85,
          description: 'Passionate TR loyalists and bolting Western progressives determined to break the Taft party machine.'
        },
        {
          id: 'social_reformers',
          name: 'Social Reformers & Suffragists',
          share: 0.35,
          happiness: 80,
          confidence: 75,
          description: 'Jane Addams and settlement house organizers fighting for women’s suffrage, the 8-hour workday, and child labor abolition.'
        },
        {
          id: 'conservation_technocrats',
          name: 'Conservationists & Public Stewards',
          share: 0.20,
          happiness: 80,
          confidence: 80,
          description: 'Gifford Pinchot and forestry pioneers dedicated to national parks, federal resource oversight, and antitrust enforcement.'
        }
      ],
      platformStances: {
        economy: 2,        // New Nationalism, regulatory oversight
        labor: 3,          // 8-hour day, minimum wage for women, ban child labor
        civilRights: 1,    // Mixed (Northern integration vs Southern Lily-White strategy)
        governance: 3,     // Direct election of Senators, initiative/referendum, recall
        foreignPolicy: 2,  // Muscular internationalism, naval readiness
        environment: 3     // National parks, federal forestry, public lands
      },
      keyLeaders: [
        { name: 'Theodore Roosevelt', title: 'Former President & Nominee', charisma: 98, experience: 95, mediaSavvy: 92, traits: ['Iconic Orator', 'Bull Moose Tenacity', 'Trust Buster'] },
        { name: 'Hiram Johnson', title: 'Governor of California & VP Nominee', charisma: 88, experience: 85, mediaSavvy: 80, traits: ['Pacific Titan', 'Anti-Railroad Crusader'] },
        { name: 'Jane Addams', title: 'Hull House Founder & Convention Keynote', charisma: 86, experience: 90, mediaSavvy: 78, traits: ['Moral Authority', 'Suffrage Champion'] },
        { name: 'Gifford Pinchot', title: 'Chief Forester of the United States', charisma: 80, experience: 88, mediaSavvy: 75, traits: ['Conservation Architect', 'Deep Pocket Patron'] }
      ],
      signatureMechanics: [
        { id: 'bolter_surge', name: 'Charismatic Bolter Surge', effect: 'Steals 35–45% of Republican voters across Northern and Pacific states on turn 1.' },
        { id: 'square_deal_appeal', name: 'Square Deal Resonance', effect: 'Doubles organizing yield among urban middle-class and industrial reform clubs.' }
      ]
    },

    // 2. 1912: SOCIALIST PARTY OF AMERICA
    socialist_spa_1912: {
      id: 'socialist_spa_1912',
      name: 'Socialist Party of America',
      shortName: 'Socialist',
      color: '#c92a2a',
      emblem: 'Clasped Hands & Red Torch',
      startYear: 1912,
      era: 'The Progressive Era',
      motto: 'Workers of the World, Unite for Democratic Industrial Freedom!',
      description: 'At the zenith of American democratic socialism, Eugene V. Debs leads a nationwide movement commanding over 1,200 municipal offices, state legislative seats, and massive railroad solidarity.',
      factions: [
        {
          id: 'debsian_industrial_radicals',
          name: 'Debsian Industrial Radicals',
          share: 0.50,
          happiness: 90,
          confidence: 80,
          description: 'Railroad shopmen, miners, and prairie tenant farmers committed to direct worker ownership and anti-militarism.'
        },
        {
          id: 'sewer_socialists',
          name: 'Sewer Socialists (Municipal Administrators)',
          share: 0.35,
          happiness: 85,
          confidence: 85,
          description: 'Victor Berger and Emil Seidel’s disciplined Midwestern machine prized for incorruptible public health and sanitation.'
        },
        {
          id: 'christian_intellectuals',
          name: 'Social Gospel Ministers & Writers',
          share: 0.15,
          happiness: 75,
          confidence: 70,
          description: 'Upton Sinclair and pacifist scholars articulating moral indictments of unfettered monopoly capitalism.'
        }
      ],
      platformStances: {
        economy: -3,       // Democratic public ownership of trusts & utilities
        labor: 3,          // Unconditional right to strike, industrial unionism
        civilRights: 2,    // Equality before the law, anti-lynching resolution
        governance: 3,     // Abolish Senate & Supreme Court judicial veto, proportional representation
        foreignPolicy: -3, // Anti-imperialist pacifism, international labor solidarity
        environment: 2     // Public reclamation of natural resources
      },
      keyLeaders: [
        { name: 'Eugene V. Debs', title: 'Presidential Nominee & Union Legend', charisma: 96, experience: 85, mediaSavvy: 85, traits: ['Beloved Folk Hero', 'Incorruptible Agitator'] },
        { name: 'Victor L. Berger', title: 'U.S. Representative (WI-05)', charisma: 82, experience: 90, mediaSavvy: 80, traits: ['Legislative Pioneer', 'Party Machine Builder'] },
        { name: 'Emil Seidel', title: 'Mayor of Milwaukee & VP Nominee', charisma: 78, experience: 82, mediaSavvy: 76, traits: ['Municipal Pragmatist', 'Clean Government Icon'] }
      ],
      signatureMechanics: [
        { id: 'class_consciousness', name: 'Class Consciousness Mobilization', effect: 'Immune to corporate Super PAC suppression; high field turnout in mining and rail hubs.' },
        { id: 'appeal_to_reason', name: 'Appeal to Reason Press Engine', effect: 'Generates free weekly movement pamphlets and volunteer activists.' }
      ]
    },

    // 3. 1924: PROGRESSIVE PARTY / CPPA (LA FOLLETTE)
    progressive_cppa_1924: {
      id: 'progressive_cppa_1924',
      name: 'Progressive Party / CPPA',
      shortName: 'Progressive',
      color: '#2b8a3e',
      emblem: 'Liberty Bell & Plow',
      startYear: 1924,
      era: 'The Progressive Era',
      motto: 'The supreme issue is the encroachment of powerful monopolies on the rights of the American people.',
      description: 'A powerful joint insurgent coalition of railroad brotherhoods, the AFL, Midwestern farmer-labor parties, and the Socialist Party uniting behind Wisconsin Senator Robert M. La Follette.',
      factions: [
        {
          id: 'wisconsin_prairie_progressives',
          name: 'Wisconsin Prairie Progressives',
          share: 0.45,
          happiness: 90,
          confidence: 85,
          description: 'Fighting Bob’s grassroots Wisconsin network and the Nonpartisan League grain elevator activists.'
        },
        {
          id: 'railroad_brotherhoods',
          name: 'Railroad Brotherhoods & Labor',
          share: 0.35,
          happiness: 85,
          confidence: 80,
          description: 'Sixteen national railway unions providing seasoned field organizers and shop-floor campaign funds.'
        },
        {
          id: 'farmer_labor_socialists',
          name: 'Farmer-Labor Radicals',
          share: 0.20,
          happiness: 80,
          confidence: 75,
          description: 'Minnesota Farmer-Laborites demanding federal farm price guarantees and nationalization of railroads.'
        }
      ],
      platformStances: {
        economy: -2,       // Public ownership of railroads & water power, progressive wealth tax
        labor: 3,          // Overturn anti-labor court injunctions, child labor constitutional amendment
        civilRights: 1,    // Denounced Ku Klux Klan violence
        governance: 3,     // Direct election of federal judges, national referendum for war
        foreignPolicy: -2, // Non-interventionism, outlaw aggressive war
        environment: 2     // Preserve federal oil reserves (Teapot Dome backlash)
      },
      keyLeaders: [
        { name: 'Robert M. La Follette', title: 'U.S. Senator (WI) & Nominee', charisma: 94, experience: 96, mediaSavvy: 88, traits: ['Fighting Bob', 'Uncompromising Titan'] },
        { name: 'Burton K. Wheeler', title: 'U.S. Senator (MT) & VP Nominee', charisma: 86, experience: 82, mediaSavvy: 85, traits: ['Teapot Dome Inquisitor', 'Western Maverick'] },
        { name: 'Henrik Shipstead', title: 'U.S. Senator (MN, Farmer-Labor)', charisma: 80, experience: 84, mediaSavvy: 75, traits: ['Prairie Populist', 'Grassroots Anchor'] }
      ],
      signatureMechanics: [
        { id: 'upper_midwest_fortress', name: 'Upper Midwest Agrarian Fortress', effect: 'Locked 50%+ baseline lean in Wisconsin; second-place momentum in 11 Western states.' },
        { id: 'brotherhood_dispatch', name: 'Rail Brotherhood Dispatch', effect: 'Reduces field organizing cash cost by 50% across Northern transcontinental routes.' }
      ]
    },

    // 4. 1960 & 1968: DIXIECRAT PARTY (STATES' RIGHTS)
    dixiecrat_states_rights: {
      id: 'dixiecrat_states_rights',
      name: 'Dixiecrat Party (States\' Rights)',
      shortName: 'Dixiecrat',
      color: '#d97706',
      emblem: 'States\' Rights Capitol Dome',
      startYear: 1960,
      era: 'The Liberal Era / The Conservative Era',
      motto: 'States\' Rights, Constitutional Liberty, and Local Self-Determination.',
      description: 'An entrenched Southern machine dedicated to resisting federal civil rights mandates, court-ordered integration, and Washington regulatory authority. In 1960 they run unpledged elector slates under Harry Byrd; in 1968 George Wallace expands the movement into nationwide blue-collar populist revolt.',
      factions: [
        {
          id: 'courthouse_bourbons',
          name: 'Courthouse Machine Traditionalists',
          share: 0.50,
          happiness: 85,
          confidence: 90,
          description: 'Southern committee chairmen, sheriffs, and planting elites wielding total control of local ballot infrastructure.'
        },
        {
          id: 'wallace_blue_collar',
          name: 'Wallace Working-Class Populists',
          share: 0.40,
          happiness: 80,
          confidence: 85,
          description: 'Suburban and industrial blue-collar workers protesting federal busing, rising urban crime, and liberal elites.'
        },
        {
          id: 'constitutional_nullifiers',
          name: 'Constitutional Nullifiers',
          share: 0.10,
          happiness: 75,
          confidence: 80,
          description: '10th Amendment hardliners advocating state interposition against Supreme Court decrees.'
        }
      ],
      platformStances: {
        economy: 1,        // Low taxes, right-to-work laws, state-directed development
        labor: -1,         // Strong right-to-work defense, anti-closed shop
        civilRights: -3,   // Strict opposition to Civil Rights Acts and federal voter oversight
        governance: 2,     // Devolution to states, curtail federal judicial jurisdiction
        foreignPolicy: 2,  // Anti-communist hawks, massive military spending
        environment: -1    // Local control over natural resources and waterways
      },
      keyLeaders: [
        { name: 'Harry F. Byrd', title: 'U.S. Senator (VA) & 1960 Standard-Bearer', charisma: 78, experience: 96, mediaSavvy: 75, traits: ['Byrd Machine Boss', 'Fiscal Austerity Architect'] },
        { name: 'George C. Wallace', title: 'Governor of Alabama & 1968 Nominee', charisma: 95, experience: 88, mediaSavvy: 94, traits: ['Crowd Dynamo', 'Populist Firebrand', 'Controversy Magnet'] },
        { name: 'Strom Thurmond', title: 'U.S. Senator (SC) & Founding Dixiecrat', charisma: 84, experience: 92, mediaSavvy: 82, traits: ['Filibuster Recordholder', 'Southern Strategy Bridge'] },
        { name: 'Curtis LeMay', title: 'General of the Air Force & 1968 VP Nominee', charisma: 70, experience: 90, mediaSavvy: 60, traits: ['Cold War Hawk', 'Nuclear Stance Gaffe Risk'] }
      ],
      signatureMechanics: [
        { id: 'deep_south_firewall', name: 'Deep South Firewall', effect: 'Guaranteed 60%+ floor across AL, MS, GA, LA, and SC; unpledged elector legal mechanisms.' },
        { id: 'deadlock_gambit', name: 'Electoral College Deadlock Gambit', effect: 'Wins victory condition if race ends with no party securing 270 EVs, throwing election to House.' }
      ]
    },

    // 5. 1980: NATIONAL UNITY CAMPAIGN (JOHN ANDERSON)
    national_unity_anderson: {
      id: 'national_unity_anderson',
      name: 'National Unity Campaign (Anderson Independent)',
      shortName: 'National Unity',
      color: '#7950f2',
      emblem: 'Bipartisan Torch',
      startYear: 1980,
      era: 'The Conservative Era',
      motto: 'A Campaign of Ideas for an America in Transition.',
      description: 'Ten-term Illinois Republican Congressman John B. Anderson mounts an independent bid offering fiscal conservatism married to social liberalism, attracting educated suburban moderates and college voters.',
      factions: [
        {
          id: 'suburban_moderates',
          name: 'Rockefeller Republican Moderates',
          share: 0.50,
          happiness: 85,
          confidence: 75,
          description: 'Suburban professionals alienated by the rise of the Religious Right and Reagan supply-side economics.'
        },
        {
          id: 'disillusioned_centrist_democrats',
          name: 'Disillusioned Centrists & Reformers',
          share: 0.35,
          happiness: 80,
          confidence: 70,
          description: 'Independent voters and campus activists frustrated by Carter’s stagflation and Iran hostage paralysis.'
        },
        {
          id: 'bipartisan_good_gov',
          name: 'Good Government Technocrats',
          share: 0.15,
          happiness: 85,
          confidence: 80,
          description: 'Policy wonks advocating 50-cent gasoline conservation taxes, the Equal Rights Amendment, and strict deficit caps.'
        }
      ],
      platformStances: {
        economy: 1,        // Balanced budgets, 50-cent gas tax offset by payroll tax cuts
        labor: 0,          // Balanced mediation between business and organized labor
        civilRights: 2,    // Champion of Equal Rights Amendment (ERA), civil rights enforcement
        governance: 2,     // Merit-based civil service, campaign spending limits
        foreignPolicy: 1,  // Human rights emphasis, NATO reinforcement, SALT II support
        environment: 2     // Energy conservation, synthetic fuels transition
      },
      keyLeaders: [
        { name: 'John B. Anderson', title: 'U.S. Representative (IL-16) & Nominee', charisma: 88, experience: 88, mediaSavvy: 86, traits: ['Debate Master', 'Principled Wonk', 'Silver Fox Orator'] },
        { name: 'Patrick Lucey', title: 'Former Governor of Wisconsin (Dem) & VP', charisma: 82, experience: 86, mediaSavvy: 78, traits: ['Cross-Aisle Bridge', 'Midwestern Credibility'] }
      ],
      signatureMechanics: [
        { id: 'debate_elevation', name: 'Debate Podium Breakthrough', effect: 'Reaching 15% in national polls unlocks nationwide prime-time presidential debate podium.' },
        { id: 'suburban_college_surge', name: 'Suburban University Axis', effect: '+10% polling boost in Massachusetts, Vermont, Colorado, Washington, and Connecticut.' }
      ]
    },

    // 6. 1992: UNITED WE STAND AMERICA (ROSS PEROT)
    reform_perot_1992: {
      id: 'reform_perot_1992',
      name: 'United We Stand America (Perot Independent)',
      shortName: 'Perot / Reform',
      color: '#4263eb',
      emblem: 'Electronic Town Hall & Balanced Scale',
      startYear: 1992,
      era: 'The Conservative Era',
      motto: 'Let\'s look under the hood and fix it! It\'s that simple.',
      description: 'Texas billionaire H. Ross Perot launches a seismic populist movement that achieves 18.9% of the national vote—the strongest independent performance in 80 years—by attacking the national debt and trade deficits.',
      factions: [
        {
          id: 'deficit_hawks',
          name: 'Deficit Hawks & Small Business Owners',
          share: 0.45,
          happiness: 90,
          confidence: 90,
          description: 'Accountants, entrepreneurs, and taxpayers demanding balanced budgets and an end to federal fiscal trickery.'
        },
        {
          id: 'trade_economic_nationalists',
          name: 'Protectionist Blue-Collar Patriots',
          share: 0.35,
          happiness: 85,
          confidence: 80,
          description: 'Industrial workers terrified by the "giant sucking sound" of manufacturing jobs moving to Mexico under NAFTA.'
        },
        {
          id: 'direct_democracy_technocrats',
          name: 'Electronic Town Hall Activists',
          share: 0.20,
          happiness: 85,
          confidence: 85,
          description: 'Volunteers eager for digital constituent polling, congressional term limits, and the end of lobbyist perks.'
        }
      ],
      platformStances: {
        economy: 1,        // Balance the budget in 5 years, raise gas tax, cut spending across the board
        labor: 1,          // Protect American manufacturing, oppose NAFTA
        civilRights: 0,    // Pragmatic non-ideological stance
        governance: 3,     // Electronic town halls, term limits, abolish PACs, ban foreign lobbyists
        foreignPolicy: 0,  // Focus on domestic rebuilding before global intervention
        environment: 1     // Practical conservation and energy efficiency
      },
      keyLeaders: [
        { name: 'H. Ross Perot', title: 'Self-Funded Founder & Nominee', charisma: 94, experience: 82, mediaSavvy: 96, traits: ['Infomercial Master', 'Folksy Truth-Teller', 'Billionaire Self-Funder'] },
        { name: 'James Stockdale', title: 'Vice Admiral, Medal of Honor Recipient & VP', charisma: 72, experience: 92, mediaSavvy: 55, traits: ['Heroic Stoic', 'Philosophical Patriot', 'Media Unprepared'] },
        { name: 'Pat Choate', title: 'Economic Policy Director & Author', charisma: 80, experience: 85, mediaSavvy: 82, traits: ['Trade Inquisitor', 'Policy Architect'] }
      ],
      signatureMechanics: [
        { id: 'infomercial_blitz', name: 'Primetime Infomercial Blitz', effect: 'Purchases 30-minute network television blocks to explain budget charts, surging generic support by +8%.' },
        { id: 'volunteer_ballot_drive', name: 'Citizen Petition Avalanche', effect: 'Qualifies on all 50 state ballots with zero established party infrastructure.' }
      ]
    },

    // 7. 2000: GREEN PARTY OF THE UNITED STATES (RALPH NADER)
    green_nader_2000: {
      id: 'green_nader_2000',
      name: 'Green Party (Nader 2000)',
      shortName: 'Green',
      color: '#12b886',
      emblem: 'Green Sunflower & Earth',
      startYear: 2000,
      era: 'The Conservative Era',
      motto: 'Government of the People, Not Exxon, Pfizer, and Citigroup.',
      description: 'Consumer champion Ralph Nader turns the Green Party into a formidable progressive challenger against the corporate-funded Democratic-Republican duopoly ("Tweedledum and Tweedledee").',
      factions: [
        {
          id: 'anti_corporate_radicals',
          name: 'Anti-Corporate Consumer Advocates',
          share: 0.45,
          happiness: 90,
          confidence: 85,
          description: 'WTO protesters, labor dissidents, and consumer protectionists fighting multinational corporate rule.'
        },
        {
          id: 'deep_ecologists',
          name: 'Ecologists & Climate Action Vanguard',
          share: 0.35,
          happiness: 85,
          confidence: 80,
          description: 'Anti-drilling activists, renewable energy pioneers, and biodiversity defenders.'
        },
        {
          id: 'campus_left_coalition',
          name: 'Campus Left & Civil Libertarians',
          share: 0.20,
          happiness: 80,
          confidence: 75,
          description: 'Young college progressives organizing against capital punishment, the war on drugs, and campaign finance corruption.'
        }
      ],
      platformStances: {
        economy: -2,       // Break up monopolies, universal single-payer healthcare, living wage
        labor: 3,          // Repeal Taft-Hartley, card check unionization
        civilRights: 3,    // End the War on Drugs, abolish death penalty, criminal justice overhaul
        governance: 3,     // Public financing of elections, instant-runoff voting, open debates
        foreignPolicy: -2, // Curtail military industrial complex, fair trade over corporate trade
        environment: 3     // Zero carbon transition, ban fracking, protect ancient forests
      },
      keyLeaders: [
        { name: 'Ralph Nader', title: 'Consumer Advocate & Nominee', charisma: 90, experience: 92, mediaSavvy: 88, traits: ['Legendary Crusader', 'Uncompromising Idealist', 'Super-Rally Magnet'] },
        { name: 'Winona LaDuke', title: 'Indigenous Rights Leader & VP Nominee', charisma: 84, experience: 82, mediaSavvy: 78, traits: ['Environmental Justice Icon', 'Tribal Sovereignty Leader'] }
      ],
      signatureMechanics: [
        { id: 'super_rallies', name: 'Arena Super-Rallies', effect: 'Fills 15,000-seat arenas (Madison Square Garden) charging $10 admission, yielding massive activist boosts.' },
        { id: 'duopoly_disruption', name: 'Left-Flank Spoiler Leverage', effect: 'Forces major parties to defend safe progressive territory; critical tipping-point impact in swing states.' }
      ]
    },

    // 8. 2016: LIBERTARIAN PARTY ("THE TWO-GOVERNOR TICKET")
    libertarian_johnson_2016: {
      id: 'libertarian_johnson_2016',
      name: 'Libertarian Party (Johnson-Weld 2016)',
      shortName: 'Libertarian',
      color: '#fab005',
      emblem: 'Statue of Liberty & Porcupine',
      startYear: 2016,
      era: 'Modern Populist & Polarized Era',
      motto: 'Fiscally Conservative, Socially Inclusive, and Skeptical of Foreign Entanglements.',
      description: 'Two popular former two-term Republican governors (Gary Johnson of New Mexico and Bill Weld of Massachusetts) unite to offer a mainstream executive alternative during the historic Trump-Clinton polarization.',
      factions: [
        {
          id: 'pragmatic_governors',
          name: 'Pragmatic Governance Centrists',
          share: 0.45,
          happiness: 85,
          confidence: 85,
          description: 'Johnson-Weld loyalists aiming for 5% federal matching funds and major-party debate access.'
        },
        {
          id: 'free_market_purists',
          name: 'Austrian Free-Market Purists',
          share: 0.35,
          happiness: 70,
          confidence: 65,
          description: 'Mises Caucus and non-aggression principle absolutists skeptical of Weld’s moderate East Coast record.'
        },
        {
          id: 'civil_liberties_advocates',
          name: 'Civil Liberties & Crypto Pioneers',
          share: 0.20,
          happiness: 85,
          confidence: 80,
          description: 'Advocates for cannabis legalization, digital privacy, ending surveillance, and military non-intervention.'
        }
      ],
      platformStances: {
        economy: 3,        // Abolish income tax, FairTax, slash federal regulations
        labor: -2,         // National right-to-work, free market labor contracts
        civilRights: 2,    // Legalize cannabis, marriage equality, end mass incarceration
        governance: 2,     // Term limits, balanced budget amendment, abolish IRS
        foreignPolicy: -2, // Non-interventionist, close overseas bases, audit military spending
        environment: 0     // Free-market environmentalism, property rights for conservation
      },
      keyLeaders: [
        { name: 'Gary Johnson', title: 'Former Governor of New Mexico & Nominee', charisma: 82, experience: 90, mediaSavvy: 78, traits: ['Triathlete Governor', 'Veto Champion', 'Aleppo Risk Gaffe'] },
        { name: 'William Weld', title: 'Former Governor of Massachusetts & VP Nominee', charisma: 86, experience: 92, mediaSavvy: 84, traits: ['Bipartisan Statesman', 'Media Favorite'] }
      ],
      signatureMechanics: [
        { id: 'two_governor_gravitas', name: 'Two-Governor Executive Gravitas', effect: 'Doubles institutional tier ascension speed and fundraising yield among disaffected centrists.' },
        { id: 'western_libertarian_axis', name: 'Western Mountain Bastion', effect: '+8% polling advantage in New Mexico, Utah, Alaska, Idaho, and Wyoming.' }
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HISTORICAL_EMERGENT_PARTIES;
  }
  if (typeof window !== 'undefined') {
    if (!window.PartyChairData) window.PartyChairData = {};
    window.PartyChairData.HISTORICAL_EMERGENT_PARTIES = HISTORICAL_EMERGENT_PARTIES;
  }
})();
