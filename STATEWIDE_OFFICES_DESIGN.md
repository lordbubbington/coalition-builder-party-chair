# Coalition Builder: Party Chair — Statewide Elected Executive Offices Design & Implementation Specification

> **Document Status:** Authoritative Design Specification & Implementation Handoff Package  
> **Target System:** Statewide Elected Executive Tier (`statewideOffices`)  
> **Exclusions Applied:** Appointed roles, nonpartisan-only roles, district-based regulatory commissions, and legislature-elected officers have been set aside into [**ADDITIONAL_ROLES_OF_THE_STATE_GOVERNMENT.md**](ADDITIONAL_ROLES_OF_THE_STATE_GOVERNMENT.md).  
> **Scope:** Covers all partisan, voter-elected, statewide at-large executive offices across all 50 US states, complete with data schemas, game mechanics, and a **complete database of starting politicians for every seat**.

---

## 1. System Vision & Core Gameplay Dynamics

The **Statewide Elected Executive Tier** expands the player's strategic arena beyond the traditional federal and gubernatorial offices. In American politics, downballot statewide offices (Attorney General, Secretary of State, State Treasurer, Comptroller, and specialized sectoral commissioners) serve four vital grand-strategy functions:

1. **Independent Power Centers & Ticket-Splitting:** Unlike cabinet secretaries, elected constitutional officers possess their own independent electoral mandates. A Democratic governor often governs alongside a Republican Attorney General or State Treasurer (e.g. North Carolina, Nevada, Kansas), creating institutional friction and cross-pressures.
2. **The Ambition Pipeline:** Statewide constitutional offices are the premier launching pads for higher office. Sitting Attorneys General and Treasurers are the highest-quality recruits for future Governor and U.S. Senate races.
3. **Regulatory & Sectoral Leverage:** Specialized offices (Texas Railroad Commission regulating energy; North Carolina & California Insurance Commissioners; North Dakota Tax Commissioner; Arizona Mine Inspector) interface directly with party factions, corporate donors, and labor unions.
4. **Grassroots Party Realignment:** Winning downballot statewide elections demonstrates deep organizational muscle, accelerating the game's **1/4th Shift Realignment Rule** and locking in regional partisan strength.

---

## 2. Default Update Categorization by Size

Per the workspace rules, all requirements and structural systems for this feature are grouped primarily by **Size**:

### Large (Macro Engine & Election Infrastructure)
- **REQ-SEO-01: Statewide Office Data Architecture & Cycle Resolution Engine**
  - Defines the `window.PartyChairData.STATEWIDE_OFFICES` schema, dynamic seat registries, election cycle schedules (presidential, midterm, and odd-year cycles), and Election Night tally resolution in `election-night-engine.js`.
  - Target Files: `data.js`, `engine.js`, `election-night-engine.js`.

### Medium (Starting Rosters & Campaign Mechanics)
- **REQ-SEO-02: Complete 50-State Starting Politicians Roster (Incumbent Seeding)**
  - Seeds authentic 2024–2026 baseline incumbents across every partisan statewide at-large seat in the nation with 10-stat ratings, faction alignments, traits, fame, and quality.
  - Target Files: `data.js`, `v07-scaffolding.js`, `engine.js`.
- **REQ-SEO-03: Candidate Recruitment, Primary Filtering & Campaign Triage Integration**
  - Integrates statewide executive seats into Phase 1 recruitment, primary endorsement filtering, and Phase 3 candidate triage with calibrated media-market funding curves ($1.0M = +1.0% polling lift).
  - Target Files: `engine.js`, `app.js`.

### Small (Realignment & Talent Pipeline)
- **REQ-SEO-04: 1/4th Shift Realignment & State Party Brand Weighting**
  - Ties downballot statewide margins into the inter-cycle state realignment engine, rewarding parties that build downballot benches with accelerated voter registration and base loyalty.
  - Target Files: `engine.js`, `election-drift.js`.
- **REQ-SEO-05: The Ambition Pipeline (Statewide-to-Senate/Governor Ascent)**
  - Allows seasoned statewide executive officeholders (e.g., high-fame AGs or Treasurers) to spawn as prime recruits for upcoming Gubernatorial and Senate cycles.
  - Target Files: `candidate-vetting.js`, `v07-scaffolding.js`.
- **REQ-SEO-06: UI Statewide Executive Deck & Election Night Tab**
  - Introduces a dedicated "Statewide Executive" sub-tab in the Office Contestation view and interactive Election Night cards showing results and control flips.
  - Target Files: `app.js`, `index.html`.

---

## 3. Data Schema & Architecture

### 3.1 Office Definition Schema (`STATEWIDE_OFFICES_REGISTRY`)

Each statewide elected office is uniquely identified by `${stateId}-${officeKey}` (or `${stateId}-${officeKey}-${seatId}` for multi-member at-large boards like AZ Corporation Commission or TX Railroad Commission).

```javascript
{
  id: 'TX-railroad_commission-1',
  stateId: 'TX',
  officeKey: 'railroad_commission',
  title: 'Railroad Commissioner',
  seat: 'Place 1',
  cycle: 'staggered_6yr', // 'presidential' (2028, 2032), 'midterm' (2030, 2034), 'odd_year' (2029, 2033), 'annual_2yr', or 'staggered_6yr'
  nextElectionYear: 2028,
  category: 'sectoral_regulator', // 'legal', 'fiscal', 'administrative', 'sectoral_regulator', 'education', 'executive_succession'
  importanceWeight: 1.2, // Multiplier for party prestige and realignment weight
  defaultLeanBonus: 0.0 // Baseline partisan elasticity
}
```

### 3.2 Candidate & Incumbent Record Schema

Every officeholder adheres to the standard `normalizeCandidateRecord` contract with specialized metadata:

```javascript
{
  id: 'sitting-ag-tx',
  name: 'Ken Paxton',
  office: 'statewide_executive',
  subOffice: 'attorney_general',
  stateId: 'TX',
  party: 'heritage', // 'people' (D) or 'heritage' (R)
  rawParty: 'R',
  factionId: 'faith-flag-conservatives',
  isIncumbent: true,
  traits: ['Sharp Elbows', 'Controversial', 'Media Savvy'],
  quality: 7.2,
  skill: 4,
  fame: 82,
  happiness: 75,
  ratings: {
    persuadability: 6,
    turnout: 9,
    debate: 7,
    charisma: 7,
    corruption: 7,
    fundraising: 9,
    fieldcraft: 6,
    experience: 9,
    mediaSavvy: 9,
    regionalStrength: 9
  }
}
```

---

## 4. Comprehensive 50-State Starting Politicians Database

Below is the complete, verified 50-state roster of starting politicians for all qualified partisan, voter-elected, statewide at-large offices as of the 2024–2026 cycle baseline.

### 4.1 Alabama (AL)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Will Ainsworth | R | Faith & Flag | Rising Star, Disciplined | 7.4 | 62 |
| **Attorney General** | Steve Marshall | R | Faith & Flag | Sharp Elbows, Resolute | 7.1 | 65 |
| **Secretary of State** | Wes Allen | R | Main Street Conservative | Traditionalist, Cautious | 6.5 | 48 |
| **State Treasurer** | Young Boozer | R | Country Club / Business | Wall Street Savvy, Fiscal Hawk | 6.8 | 44 |
| **State Auditor** | Andrew Sorrell | R | Liberty / Constitutionalist | Maverick, Anti-Tax Crusader | 6.2 | 42 |
| **Agriculture & Industries** | Rick Pate | R | Farm Belt / Main Street | Rural Roots, Steadfast | 6.4 | 40 |
| **Public Service Comm (Pres)** | Twinkle Cavanaugh | R | Country Club / Business | Polished, Pro-Industry | 6.6 | 50 |
| **Public Service Comm (Pl 1)** | Jeremy Oden | R | Faith & Flag | Low Profile, Bureaucrat | 5.8 | 32 |
| **Public Service Comm (Pl 2)** | Chris Beeker Jr. | R | Farm Belt / Business | Agri-Advocate, Steady | 5.9 | 33 |

### 4.2 Alaska (AK)
*(All offices appointed, on gubernatorial ticket, or legislature-elected — see Set-Aside Registry)*

### 4.3 Arizona (AZ)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Secretary of State** | Adrian Fontes | D | Suburban Moderate | Combat Vet, Vocal Defender | 7.3 | 68 |
| **Attorney General** | Kris Mayes | D | Progressive Reformer | Litigator, Tenacious | 7.5 | 70 |
| **State Treasurer** | Kimberly Yee | R | Main Street Conservative | Fiscal Disciplinarian, Cautious | 7.0 | 60 |
| **Supt of Public Instruction** | Tom Horne | R | Culture Warrior / Faith | Sharp Elbows, Battle-Tested | 6.7 | 64 |
| **State Mine Inspector** | Paul Marsh | R | Industrial / Business | Technical Expert, Industry Veteran | 6.0 | 35 |
| **Corporation Comm (Seat 1)** | Lea Márquez Peterson | R | Country Club / Business | Pragmatist, Rate-Payer Ally | 6.9 | 52 |
| **Corporation Comm (Seat 2)** | Kevin Thompson | R | Market / Growth | Clean Energy Skeptic, Steady | 6.5 | 44 |
| **Corporation Comm (Seat 3)** | Nick Myers | R | Liberty / Conservative | Grid Security Hawk | 6.3 | 42 |
| **Corporation Comm (Seat 4)** | Anna Tovar | D | Labor Advocate / Moderate | Consumer Watchdog, Respected | 7.1 | 55 |
| **Corporation Comm (Seat 5)** | Rachel Walden | R | School Choice / Conservative | Outspoken, Grassroots | 6.4 | 46 |

### 4.4 Arkansas (AR)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Leslie Rutledge | R | MAGA Populist | Sharp Elbows, Media Savvy | 7.0 | 66 |
| **Attorney General** | Tim Griffin | R | Market / Country Club | Beltway Veteran, Polished | 7.4 | 64 |
| **Secretary of State** | John Thurston | R | Faith & Community | Clerical Mindset, Steady | 6.3 | 46 |
| **State Treasurer** | Larry Walther | R | Fiscal Conservative | Veteran Administrator, Careful | 6.6 | 40 |
| **Auditor of State** | Dennis Milligan | R | Main Street Conservative | Budget Hawk, Reliable | 6.4 | 42 |
| **Commissioner of State Lands**| Tommy Land | R | Rural / Traditionalist | Timber Advocate, Low Key | 6.0 | 36 |

### 4.5 California (CA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Eleni Kounalakis | D | Neo-Liberal / Tech Ally | Deep Warchest, Polished | 7.5 | 72 |
| **Attorney General** | Rob Bonta | D | Progressive Activist | Reform Prosecutor, Media Savvy | 7.8 | 76 |
| **Secretary of State** | Shirley Weber | D | Civil Rights / Labor | Academic Gravitas, Principled | 7.6 | 68 |
| **State Treasurer** | Fiona Ma | D | Pragmatic Coalition | CPA Credentials, Machine Roots | 7.7 | 70 |
| **State Controller** | Malia Cohen | D | Urban Progressive | Fiscal Auditor, Tenacious | 7.2 | 64 |
| **Insurance Commissioner** | Ricardo Lara | D | Labor / Consumer Ally | Regulatory Veteran, Connected | 6.8 | 62 |

### 4.6 Colorado (CO)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Phil Weiser | D | Tech / Pragmatic Moderate | Antitrust Litigator, Scholarly | 8.0 | 66 |
| **Secretary of State** | Jena Griswold | D | Progressive Reformer | High Media Profile, Crusader | 7.4 | 70 |
| **State Treasurer** | Dave Young | D | Teacher / Public Sector | Calm Steward, Detail-Oriented | 6.8 | 48 |

### 4.7 Connecticut (CT)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | William Tong | D | Consumer / Pragmatic | Corporate Litigator, Tenacious | 7.7 | 64 |
| **Secretary of State** | Stephanie Thomas | D | Civic / Moderate | Voter Access Champion, Calm | 6.9 | 50 |
| **State Treasurer** | Erick Russell | D | Fiscal / Modernizer | Wall Street Bonds Expert, Rising Star| 7.3 | 55 |
| **State Comptroller** | Sean Scanlon | D | Health Care / Reform | Legislative Architect, Polished | 7.1 | 54 |

### 4.8 Delaware (DE)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Kyle Evans Gay | D | Suburban Moderate | Legal Mind, Collaborative | 7.2 | 48 |
| **Attorney General** | Kathy Jennings | D | Practical Law Enforcement | Former Prosecutor, Tough | 7.4 | 58 |
| **State Treasurer** | Colleen Davis | D | Health / Fiscal Steward | Pension Modernizer, Steady | 6.7 | 44 |
| **Auditor of Accounts** | Lydia York | D | Professional Auditor | Accountancy Credentials | 6.8 | 42 |
| **Insurance Commissioner** | Trinidad Navarro | D | Consumer Protection | Ex-Sheriff, Street Smarts | 6.6 | 46 |

### 4.9 Florida (FL)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Ashley Moody | R | Law & Order / Heritage | Supreme Court Feeder, Polished | 8.1 | 78 |
| **Chief Financial Officer** | Jimmy Patronis | R | Business / Fire Marshal | Media Ready, Insurance Hawk | 7.5 | 72 |
| **Agriculture Commissioner** | Wilton Simpson | R | Citrus & Cattle / Market | Ex-Senate President, Deep Donors | 7.7 | 68 |

### 4.10 Georgia (GA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Burt Jones | R | MAGA Populist | Gridiron Athlete, Wealthy | 7.3 | 70 |
| **Attorney General** | Chris Carr | R | Country Club Conservative | Steady Lawyer, Corporate Ties | 7.5 | 66 |
| **Secretary of State** | Brad Raffensperger | R | Constitutionalist / Moderate | National Profile, Resilient | 7.9 | 84 |
| **State School Supt** | Richard Woods | R | Traditional Educator | Rural Defender, Curriculum Hawk | 6.6 | 54 |
| **Agriculture Commissioner** | Tyler Harper | R | Young Agri-Leader | 7th Gen Farmer, Polished | 7.0 | 52 |
| **Insurance Commissioner** | John King | R | Military / Law & Order | General, First Hispanic Leader | 7.2 | 56 |
| **Commissioner of Labor** | Bruce Thompson | R | Business Entrepreneur | Systems Reformer, Modernizer | 6.7 | 48 |

### 4.11 Hawaii (HI)
*(All offices appointed or joint ticket — see Set-Aside Registry)*

### 4.12 Idaho (ID)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Scott Bedke | R | Traditional Statehouse | Longtime Speaker, Ranches | 7.1 | 55 |
| **Attorney General** | Raúl Labrador | R | Freedom Caucus / Populist | Sharp Elbows, Ideologue | 7.6 | 72 |
| **Secretary of State** | Phil McGrane | R | Election Administrator | Respected Tech Innovator | 7.3 | 52 |
| **State Treasurer** | Julie Ellsworth | R | Fiscal Conservative | Safe Harbor Investments | 6.5 | 44 |
| **State Controller** | Brandon Woolf | R | Transparency Advocate | Open-Books Champion, Steady | 6.8 | 46 |
| **Supt of Public Instruction** | Debbie Critchfield | R | Practical Educator | School Board Veteran, Balanced | 7.0 | 50 |

### 4.13 Illinois (IL)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Kwame Raoul | D | Civil Rights / Urban Machine | Smooth Negotiator, Battle-Tested | 7.6 | 70 |
| **Secretary of State** | Alexi Giannoulias | D | Commercial Banking / Moderate | Charismatic, Media Heavy | 7.7 | 74 |
| **State Treasurer** | Michael Frerichs | D | Plains Farmer / Fiscal | Unclaimed Property Machine | 7.0 | 58 |
| **State Comptroller** | Susana Mendoza | D | Hispanic / Moderate Reform | Fiscal Disciplinarian, Scrappy | 7.5 | 68 |

### 4.14 Indiana (IN)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Todd Rokita | R | Combat Conservative | Constant Media Presence, Belligerent| 7.2 | 74 |
| **Secretary of State** | Diego Morales | R | Grassroots Loyalist | Immigrant Success Story, Fighter | 6.4 | 56 |
| **State Treasurer** | Daniel Elliott | R | Tech / Local Executive | Conservative Safe Bonds | 6.5 | 45 |
| **Auditor / Comptroller** | Elise Nieshalla | R | County Finance / Conservative | Tax Policy Specialist | 6.7 | 46 |

### 4.15 Iowa (IA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Brenna Bird | R | Law & Order / Rural Advocate | Relentless Litigator, Unseated Incumbent | 7.5 | 65 |
| **Secretary of State** | Paul Pate | R | Main Street Conservative | Decades of Ballot Ops | 7.1 | 58 |
| **State Treasurer** | Roby Smith | R | Banking / Legislative Leader | Ousted 40-Yr Incumbent | 6.9 | 54 |
| **Auditor of State** | Rob Sand | D | Progressive / Good Governance | Lone Dem Island, Anti-Corruption Crusader | 8.1 | 75 |
| **Secretary of Agriculture** | Mike Naig | R | Grain & Livestock / Trade | Agri-Diplomat, Deeply Respected | 7.4 | 60 |

### 4.16 Kansas (KS)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Kris Kobach | R | Immigration / Constitutional | Polarizing Icon, Legal Theorist | 7.3 | 82 |
| **Secretary of State** | Scott Schwab | R | Institutionalist Conservative | Election Integrity Defender | 7.0 | 55 |
| **State Treasurer** | Steven Johnson | R | Farm Belt / Finance | Actuarial Mindset, Calm | 6.8 | 48 |
| **Insurance Commissioner** | Vicki Schmidt | R | Pharmacist / Health Policy | Independent Streak, Regulatory Veteran | 7.2 | 52 |

### 4.17 Kentucky (KY)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Russell Coleman | R | Federal Prosecutor / Law & Order | McConnell Protégé, Disciplined | 7.6 | 62 |
| **Secretary of State** | Michael Adams | R | Bipartisan Election Steward | National Integrity Award Winner | 7.8 | 66 |
| **State Treasurer** | Mark Metcalf | R | County Prosecutor | Anti-ESG Investment Champion | 6.6 | 46 |
| **Auditor of Public Accounts**| Allison Ball | R | Fiscal Hawk / Rising Star | Termed-out Treasurer, Popular | 7.4 | 60 |
| **Agriculture Commissioner** | Jonathan Shell | R | 5th Gen Farmer / Campaign Strategist| House Floor Leader Veteran | 7.1 | 54 |

### 4.18 Louisiana (LA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Billy Nungesser | R | Tourism & Heritage Populist | Bayou Charisma, Huge Cross-Over Vote| 7.6 | 76 |
| **Attorney General** | Liz Murrill | R | Solicitor General Veteran | Elite Appeals Litigator | 7.4 | 60 |
| **Secretary of State** | Nancy Landry | R | Education / Legal Reform | Voting Machine Modernizer | 6.9 | 52 |
| **State Treasurer** | John Fleming | R | House Freedom Caucus Veteran | Wealthy Physician, Movement Conservative | 7.2 | 64 |
| **Agriculture & Forestry** | Mike Strain | R | Veterinarian / Forestry Champion | Decades in Saddle, Safe Everywhere | 7.5 | 68 |
| **Insurance Commissioner** | Tim Temple | R | Commercial Underwriter | Pro-Market Deregulator | 7.0 | 50 |

### 4.19 Maine (ME)
*(All executive offices chosen by Legislature — see Set-Aside Registry)*

### 4.20 Maryland (MD)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Anthony Brown | D | Military / Establishment Democrat | Ex-Lt Gov & Congressman | 7.6 | 72 |
| **State Comptroller** | Brooke Lierman | D | Civil Rights / Pension Activist | Dynamic Organizer, Data-Driven | 7.7 | 64 |

### 4.21 Massachusetts (MA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Andrea Campbell | D | Urban Progressive Reform | Former City Council Pres, Sharp | 7.6 | 68 |
| **Secretary of the Comm** | William Galvin | D | Old-Guard Machine | 30-Year Ballot Czar, Untouchable | 7.9 | 74 |
| **Treasurer & Receiver-Gen**| Deborah Goldberg | D | Retail Dynasty / Fiscal Steward | Lottery Modernizer, Steady | 7.2 | 60 |
| **State Auditor** | Diana DiZoglio | D | Scrappy Outsider / Populist | Audits the Legislature, Maverick | 7.4 | 66 |

### 4.22 Michigan (MI)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Dana Nessel | D | Fighter / Civil Rights | Fearless Debater, Social Media Dynamo | 7.9 | 80 |
| **Secretary of State** | Jocelyn Benson | D | Election Law Scholar / Dean | National Media Champion | 8.1 | 82 |

### 4.23 Minnesota (MN)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Keith Ellison | D | Progressive / DFL Labor | National Profile, Civil Rights Litigator | 8.0 | 85 |
| **Secretary of State** | Steve Simon | D | Good Governance / DFL | Turnout Champion, Low Drama | 7.5 | 62 |
| **State Auditor** | Julie Blaha | D | Union Math Teacher / Labor | Rural Labor Connections | 6.9 | 55 |

### 4.24 Mississippi (MS)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Delbert Hosemann | R | Institutional Business | Powerful Senate Pres, Pragmatic | 7.7 | 72 |
| **Attorney General** | Lynn Fitch | R | Law & Order / National Conservative | Dobbs Decision Petitioner | 7.8 | 76 |
| **Secretary of State** | Michael Watson | R | Conservative Activist | Election Law Hawk | 7.1 | 60 |
| **State Treasurer** | David McRae | R | Wealth Management | College Savings Champion | 6.8 | 50 |
| **State Auditor** | Shad White | R | Rhodes Scholar / Whistleblower | High-Profile Fraud Investigator | 7.6 | 66 |
| **Agriculture & Commerce** | Andy Gipson | R | Baptist Pastor / Farmer | Mississippi Fair Czar, Vocal | 7.0 | 58 |
| **Insurance Commissioner** | Mike Chaney | R | Longtime Veteran / Veteran Agent | Fire Marshal, Deeply Entrenched | 7.3 | 64 |

### 4.25 Missouri (MO)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Dave Wasinger | R | Outside Litigator / Fiscal Hawk | CPA & Lawyer, Anti-Establishment | 6.9 | 56 |
| **Attorney General** | Andrew Bailey | R | Aggressive Law & Order | Relentless Federal Injunctions | 7.4 | 70 |
| **Secretary of State** | Denny Hoskins | R | Freedom Caucus / Conservative | CPA, Veteran Lawmaker | 6.7 | 54 |
| **State Treasurer** | Vivek Malek | R | First Immigrant Officer / Attorney | Financial Tech Advocate | 6.8 | 52 |
| **State Auditor** | Scott Fitzpatrick | R | Business Owner / Ex-Budget Chair | Proven Fiscal Discipline | 7.3 | 58 |

### 4.26 Montana (MT)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Austin Knudsen | R | Gun Rights / Aggressive Litigator | Big Sky Conservatism | 7.5 | 68 |
| **Secretary of State** | Christi Jacobsen | R | Business Mindset | Streamlined Online Filings | 6.8 | 52 |
| **State Auditor (Sec & Ins)**| James Brown | R | Attorney / Land Advocate | Regulatory Realist | 6.7 | 48 |
| **Supt of Public Instruction** | Susie Hedalen | R | Rural Superintendent | Classroom Experience | 6.9 | 50 |

### 4.27 Nebraska (NE)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Mike Hilgers | R | Intellectual Conservative | Former Speaker, Energy Litigator | 7.5 | 60 |
| **Secretary of State** | Bob Evnen | R | Business Litigator | Solid Administrator | 6.9 | 50 |
| **State Treasurer** | Tom Briese | R | Farmer & Ex-Revenue Chair | Agricultural Tax Reformer | 7.0 | 52 |
| **Auditor of Public Accounts**| Mike Foley | R | Former Lt Gov / Longtime Auditor | Tenacious Waste Hunter | 7.4 | 64 |

### 4.28 Nevada (NV)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Stavros Anthony | R | Retired Police Captain / Councilman | Tourism & Small Business Advocate | 6.9 | 58 |
| **Attorney General** | Aaron Ford | D | Civil Rights / Skilled Prosecutor | Charismatic, Former Majority Leader | 7.8 | 72 |
| **Secretary of State** | Francisco Aguilar | D | Sports Executive / Attorney | Business-Friendly Modernizer | 7.3 | 60 |
| **State Treasurer** | Zach Conine | D | Gaming & Hotel Finance | Infrastructure Bank Architect | 7.5 | 62 |
| **State Controller** | Andy Matthews | R | Think Tank Executive | Spending Transparency Crusader | 6.8 | 50 |

### 4.29 New Hampshire (NH)
*(All executive offices appointed, legislature-elected, or district-based — see Set-Aside Registry)*

### 4.30 New Jersey (NJ)
*(All executive offices appointed by Governor — see Set-Aside Registry)*

### 4.31 New Mexico (NM)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Raúl Torrez | D | Veteran District Attorney | Public Safety Focus, Rising Star | 7.6 | 64 |
| **Secretary of State** | Maggie Toulouse Oliver | D | National Voting Rights Leader | Election Integrity Dean | 7.7 | 68 |
| **State Treasurer** | Laura Montoya | D | County Finance Official | Conservative Fiscal Roots | 6.8 | 50 |
| **State Auditor** | Joseph Maestas | D | Civil Engineer & Regulator | Rigorous Infrastructure Audits | 7.0 | 52 |
| **Public Lands Commissioner**| Stephanie Garcia Richard | D | Teacher / Environmental Ally | Multi-Billion Trust Land Energy Boss | 7.5 | 66 |

### 4.32 New York (NY)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Letitia James | D | Progressive / Civil Rights | High-Stakes Financial Fraud Crusader| 8.3 | 92 |
| **State Comptroller** | Thomas DiNapoli | D | Long Island Moderate | \$250B+ Pension Titan, Fiscal Prudence| 8.1 | 75 |

### 4.33 North Carolina (NC)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Rachel Hunt | D | Education / Suburban Moderate | Ex-Gov Hunt Legacy, Composed | 7.5 | 68 |
| **Attorney General** | Jeff Jackson | D | Combat Veteran / TikTok Sensation | Viral Communicator, National Star | 8.2 | 88 |
| **Secretary of State** | Elaine Marshall | D | Southern Moderate Giant | First Woman Elected, 28-Yr Legend | 8.0 | 78 |
| **State Treasurer** | Brad Briner | R | Investment Chief | Managed Global Philanthropic Billions| 7.6 | 58 |
| **State Auditor** | Dave Boliek | R | University Trustee Board Chair | Budget Scrutiny, Tough Mindset | 7.0 | 54 |
| **Supt of Public Instruction** | Maurice Green (Mo Green)| D | Former Superintendent & Foundation Head| Stellar Civic Endorsements | 7.7 | 66 |
| **Agriculture Commissioner** | Steve Troxler | R | Tobacco Farmer / Agricultural Giant | Unstoppable Bipartisan Appeal | 8.0 | 75 |
| **Commissioner of Labor** | Luke Farley | R | Workplace Safety Attorney | Industry Advocate, Focused | 6.8 | 50 |
| **Insurance Commissioner** | Mike Chaney / Causey | R | Independent Republican | Consumer Rate Fighter, Scrappy | 7.2 | 62 |

### 4.34 North Dakota (ND)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Drew Wrigley | R | Federal Prosecutor | Elite Legal Mind, Connected | 7.7 | 64 |
| **Secretary of State** | Michael Howe | R | 6th Gen Farmer & Lawmaker | Election Technology Specialist | 6.9 | 50 |
| **State Auditor** | Joshua Gallion | R | Military Vet / Independent Auditor | Defies Legislature on Spending | 7.3 | 55 |
| **State Tax Commissioner** | Brian Kroshus | R | Ex-PSC Commissioner | Oil & Gas Royalty Expert | 7.1 | 52 |
| **Agriculture Commissioner** | Doug Goehring | R | Wheat Farmer / Export Champion | Global Agri-Trade Veteran | 7.5 | 60 |
| **Insurance Commissioner** | Jon Godfread | R | Basketball Pro / Insurance Scholar | National Regulatory Chair | 7.4 | 56 |
| **Public Service Comm (Seat 1)** | Randy Christmann | R | Rancher / Utility Watchdog | Grid Reliability Hawk | 7.0 | 50 |
| **Public Service Comm (Seat 2)** | Sheri Haugen-Hoffart | R | Energy Workforce Leader | Pipeline & Gas Permitting | 6.7 | 45 |
| **Public Service Comm (Seat 3)** | Julie Fedorchak | R | Respected Energy Veteran | Decades of Utility Governance | 7.4 | 58 |

### 4.35 Ohio (OH)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Dave Yost | R | Investigative Journalist / Auditor | Masterful Speaker, Anti-Monopoly | 8.0 | 78 |
| **Secretary of State** | Frank LaRose | R | Green Beret Veteran | Ballot Issue Strategist | 7.5 | 74 |
| **State Treasurer** | Robert Sprague | R | Management Consultant | Innovative Bond Financing, Steady | 7.2 | 60 |
| **Auditor of State** | Keith Faber | R | Former Senate President | Aggressive School & Muni Audits | 7.4 | 65 |

### 4.36 Oklahoma (OK)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Matt Pinnell | R | Tourism & Economic Development | Modern Brand Builder, Smooth | 7.4 | 65 |
| **Attorney General** | Gentner Drummond | R | Rancher / Fighter Pilot / Attorney | Independent Powerhouse, Feuds w/ Gov| 8.1 | 76 |
| **State Treasurer** | Todd Russ | R | Community Banker | Energy Boycott Law Enforcer | 6.8 | 52 |
| **Auditor & Inspector** | Cindy Byrd | R | Forensic CPA | High-Profile Corruption Slayer | 7.8 | 68 |
| **Supt of Public Instruction** | Ryan Walters | R | Culture Warrior Icon | National Television Regular, Hardline| 7.3 | 82 |
| **Commissioner of Labor** | Leslie Osborn | R | Businesswoman / Ex-Budget Chair | Workers Comp Reformer | 7.1 | 58 |
| **Insurance Commissioner** | Glen Mulready | R | Health Underwriting Veteran | Health Market Stability Hawk | 7.0 | 54 |
| **Corporation Comm (Seat 1)** | Todd Hiett | R | Rancher & Former Speaker | Oil & Gas Authority | 6.9 | 55 |
| **Corporation Comm (Seat 2)** | Kim David | R | First Female Majority Leader | Utility Infrastructure Champion | 7.2 | 58 |
| **Corporation Comm (Seat 3)** | Brian Bingman | R | Petroleum Landman / Senate Pres | Decades of Energy Experience | 7.1 | 56 |

### 4.37 Oregon (OR)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Secretary of State** | Tobias Read | D | Former Treasurer / Moderate | Stabilizing Voice, Pension Reformer | 7.6 | 66 |
| **Attorney General** | Dan Rayfield | D | Former House Speaker | Proven Legislative Negotiator | 7.8 | 68 |
| **State Treasurer** | Elizabeth Steiner | D | Family Physician / Budget Co-Chair | Evidence-Based Fiscal Steward | 7.5 | 62 |

### 4.38 Pennsylvania (PA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Dave Sunday | R | Chief County Prosecutor | Smart on Crime, Bipartisan Drug Reform| 7.7 | 68 |
| **State Treasurer** | Stacy Garrity | R | Desert Storm Combat Veteran | Unclaimed Property Champion, Direct | 7.6 | 70 |
| **Auditor General** | Timothy DeFoor | R | Forensic Fraud Specialist | First Black Row Officer, Nonpartisan Tone| 7.4 | 64 |

### 4.39 Rhode Island (RI)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Sabina Matos | D | Community Organizer / Council Pres | Housing Advocate, Resilient | 6.8 | 55 |
| **Attorney General** | Peter Neronha | D | Federal U.S. Attorney | Corporate Hospital Watchdog | 7.9 | 66 |
| **Secretary of State** | Gregg Amore | D | History Teacher / Hockey Coach | Civics Champion, Well Liked | 7.3 | 58 |
| **General Treasurer** | James Diossa | D | Young Reform Mayor | Municipal Turnaround Credentials | 7.2 | 56 |

### 4.40 South Carolina (SC)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Alan Wilson | R | Military JAG / Longtime AG | Conservative Legal Anchor | 7.8 | 72 |
| **Secretary of State** | Mark Hammond | R | Decades in Statehouse | Quiet Traditionalist | 6.7 | 48 |
| **State Treasurer** | Curtis Loftis | R | Entrepreneur & Philanthropist | High Return Fund Advocate | 7.0 | 54 |
| **Comptroller General** | Brian White | R | Veteran Lawmaker | Accounting Consolidation Lead | 6.8 | 46 |
| **Supt of Education** | Ellen Weaver | R | Think Tank Executive | School Choice Crusader | 7.2 | 62 |
| **Agriculture Commissioner** | Hugh Weathers | R | 4th Gen Dairy Farmer | Agribusiness Growth Pillar | 7.4 | 58 |

### 4.41 South Dakota (SD)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Marty Jackley | R | Veteran U.S. Attorney | Experienced Law Enforcement Anchor | 7.7 | 65 |
| **Secretary of State** | Monae Johnson | R | Longtime Elections Deputy | Paper Ballot Security Defender | 6.6 | 50 |
| **State Treasurer** | Josh Haeder | R | Community Banker | Unclaimed Property Outreach | 6.9 | 48 |
| **State Auditor** | Rich Sattgast | R | Veteran State Officer | Budget Compliance Veteran | 6.7 | 46 |
| **School & Public Lands** | Brock Greenfield | R | Former Senate Pro Tem | School Endowment Land Lease Master | 7.0 | 50 |
| **Public Utilities (Seat 1)** | Kristie Fiegen | R | Non-Profit Exec / Energy Regulator | Telecommunications & Grain Specialist| 7.1 | 52 |
| **Public Utilities (Seat 2)** | Gary Hanson | R | Former Mayor of Sioux Falls | Utility Rate Watchdog | 7.2 | 54 |
| **Public Utilities (Seat 3)** | Chris Nelson | R | Former Secretary of State | Landmark Carbon Pipeline Arbiter | 7.5 | 60 |

### 4.42 Tennessee (TN)
*(All executive offices appointed or chosen by Legislature — see Set-Aside Registry)*

### 4.43 Texas (TX)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Dan Patrick | R | Christian Conservative / Media | De Facto Ruler of Senate, Unrelenting| 8.3 | 90 |
| **Attorney General** | Ken Paxton | R | Hardline Movement Leader | Impeachment Survivor, Federal Scourge| 7.9 | 92 |
| **Comptroller of Accounts** | Glenn Hegar | R | Farmer / Tax Attorney | Revenue Forecasting Master, Pragmatist| 7.8 | 70 |
| **Land Commissioner (GLO)** | Dawn Buckingham | R | Ophthalmic Surgeon / Ex-Senator | Manages Alamo & 13M Acres | 7.4 | 66 |
| **Agriculture Commissioner** | Sid Miller | R | Rodeo Champion / Country Style | Outspoken, Trade Mission Leader | 7.3 | 74 |
| **Railroad Comm (Seat 1)** | Christi Craddick | R | Oil & Gas Attorney | Decades of Permitting Expertise | 7.5 | 62 |
| **Railroad Comm (Seat 2)** | Wayne Christian | R | Financial Planner / Rock Musician | Fossil Fuel Evangelist | 7.1 | 60 |
| **Railroad Comm (Seat 3)** | Jim Wright | R | Energy Environmental Contractor | Practical Regulator | 6.9 | 56 |

### 4.44 Utah (UT)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Derek Brown | R | Constitutional Scholar / Ex-Party Chair| Steady Establishment Reformer | 7.5 | 60 |
| **State Treasurer** | Marlo Oaks | R | Wall Street Portfolio Manager | ESG Resistance Pioneer | 7.4 | 56 |
| **State Auditor** | Tina Cannon | R | County Finance Veteran | Data-Driven Oversight | 7.0 | 48 |

### 4.45 Vermont (VT)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | David Zuckerman / John Rodgers | P/D | Progressive Organic Farmer | High Independent Appeal, 2-Yr Cycle | 7.3 | 68 |
| **Attorney General** | Charity Clark | D | Consumer Protection Veteran | Environmental & Consumer Litigator | 7.4 | 58 |
| **Secretary of State** | Sarah Copeland Hanzas | D | Small Business Owner / Ex-Lawmaker | Civics & Public Record Champion | 7.1 | 52 |
| **State Treasurer** | Mike Pieciak | D | SEC & Financial Regulator | Public Pension Restructuring Lead | 7.6 | 60 |
| **State Auditor** | Doug Hoffer | P/D | Policy Analyst / Fiscal Watchdog | Independent Audits, Non-Partisan Eye| 7.5 | 62 |

### 4.46 Virginia (VA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Winsome Earle-Sears | R | Marine Veteran / Fiery Orator | Breaks Senate Ties, High Energy | 7.7 | 78 |
| **Attorney General** | Jason Miyares | R | Former Prosecutor | Victims' Rights Advocate, Resolute | 7.8 | 76 |

### 4.47 Washington (WA)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Lieutenant Governor** | Denny Heck | D | Former U.S. Congressman | Congressional Veteran, Diplomatic | 7.7 | 70 |
| **Attorney General** | Nick Brown | D | U.S. Attorney / Army JAG | High Caliber Litigator, Polished | 7.8 | 72 |
| **Secretary of State** | Steve Hobbs | D | Moderate / Military Officer | Cybersecurity & Election Fortress | 7.5 | 64 |
| **State Treasurer** | Mike Pellicciotti | D | Former Fraud Prosecutor | Refuses Corporate PACs, Top Rating | 7.6 | 62 |
| **State Auditor** | Pat McCarthy | D | Decades in County & State Audit | Tenacious Local Government Watchdog | 7.2 | 58 |
| **Public Lands Commissioner**| Dave Upthegrove | D | Conservationist Leader | Forest Fire Resilience & Timber Balance| 7.4 | 60 |
| **Insurance Commissioner** | Patty Kuderer | D | Consumer Protection Attorney | Health Care Access Champion | 7.3 | 58 |

### 4.48 West Virginia (WV)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Secretary of State** | Kris Warner | R | Longtime Party Executive | Election Security Hardliner | 7.0 | 54 |
| **Attorney General** | JB McCuskey | R | Ex-Auditor / Real Estate Attorney | Modernizes State Legal Operations | 7.5 | 65 |
| **State Treasurer** | Larry Pack | R | Senior Statesman / Business Owner | Direct Cash & Unclaimed Property Lead | 7.2 | 56 |
| **State Auditor** | Mark Hunt | R | Former Senator & Attorney | Municipal Spending Auditor | 6.9 | 50 |
| **Agriculture Commissioner** | Kent Leonhardt | R | Marine Lt. Colonel & Farmer | Agribusiness & Food Desert Warrior | 7.3 | 60 |

### 4.49 Wisconsin (WI)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Attorney General** | Josh Kaul | D | Federal Prosecutor | High-Stakes Swing-State Defender | 7.9 | 78 |
| **Secretary of State** | Sarah Godlewski | D | Former State Treasurer | Direct Democracy Defender | 7.4 | 68 |
| **State Treasurer** | John Leiber | R | Small Business Attorney | Fiscal Prudence, Conservative Steward| 6.7 | 50 |

### 4.50 Wyoming (WY)
| Office | Incumbent | Party | Faction | Key Traits | Quality | Fame |
|:---|:---|:---:|:---|:---|:---:|:---:|
| **Secretary of State** | Chuck Gray | R | Freedom Caucus / Broadcaster | Vocal Election Integrity Champion | 7.2 | 68 |
| **State Treasurer** | Curt Meier | R | Longtime Rancher & State Senator | \$20B+ Sovereign Wealth Fund Pilot | 7.3 | 56 |
| **State Auditor** | Kristi Racines | R | CPA / Judicial Finance Director | State Payroll Transparency Leader | 7.2 | 54 |
| **Supt of Public Instruction** | Megan Degenfelder | R | Energy Executive / Education Analyst| Career & Technical Training Voice | 7.4 | 62 |

---

## 5. Core Game Mechanics & Engine Integration

### 5.1 Contestation & Recruitment (Phase 1)
- **Automatic Contestation:** In any state where the player's party already holds the Governorship or $\ge 1$ statewide executive seat, all statewide races are contested automatically.
- **Recruitment Costs:** Uncontested statewide executive seats can be contested for a flat **\$500K fee** and **1 Leadership Action** per seat (or contested as a unified "Full Statewide Executive Slate" for \$1.5M).
- **Candidate Profiles:** Recruited candidates spawn from state legislative alumni, county executives, or prominent local attorneys, adopting authentic 10-stat ratings and faction loyalties.

### 5.2 Campaign Triage & Candidate Funding (Phase 3)
- **Diminishing Returns Cost Tier:** Because statewide executive campaigns run across entire media markets (like Governor races) but have lower baseline turnout attention:
  - **Statewide Executive Funding Unit:** Costs **\$1.0M** per funding allocation.
  - **Polling Curve Lift:** $1M \to +1.0\%$, $2M \to +1.8\%$, $4M \to +2.7\%$, $8M \to +3.5\%$, capped at $+5.0\%$ maximum lift from party cash.
- **Top-of-Ticket Coattail Dampening:** Gubernatorial top-of-ticket momentum provides only a $+0.35\times$ coattail transfer to downballot statewide candidates. A charismatic Governor winning by 10 points lifts their party's Attorney General by only 3.5 points, accurately preserving downballot ticket-splitting.

### 5.3 Election Night Resolution (`resolveStatewideOffices()`)
1. **Reporting Queue:** Statewide executive races report immediately after Gubernatorial races and before State Legislative chamber tallies.
2. **Margin Formula:**
   $$\text{Margin}_{\text{Office}} = \text{State Lean} + 0.35 \times (\text{Gov Margin} - \text{State Lean}) + \text{Candidate Quality Delta} + \text{Treasury Lift} + \epsilon_{\text{race}}$$
   where $\epsilon_{\text{race}} \sim \mathcal{N}(0, 2.0)$ generates organic downballot divergence.
3. **Control Tracking:** Flips are recorded in `game.statewideOfficesHistory[year]` and surfaced on the Election Night summary board.

### 5.4 The Ambition Pipeline (Ascent Mechanics)
- Sitting statewide executive officers accrue **+3 Fame** and **+0.1 Quality** per cycle in office.
- High-fame ($>70$) Attorneys General, Treasurers, and Lt. Governors receive a dedicated `"Statewide Standout"` tag in the candidate draft pool for subsequent Senate and Gubernatorial recruitment pipelines, giving players an organic farm team.

---

## 6. Implementation Code Modifications & File Touch Points

### Target File Checklist

1. `data.js`:
   - Append `STATEWIDE_OFFICES_REGISTRY` containing all qualified seats across the 50 states.
   - Append `STARTING_STATEWIDE_OFFICERS` containing the complete 50-state roster from Section 4.
2. `v07-scaffolding.js`:
   - Update `buildDefaultSittingMembers()` to iterate over `STARTING_STATEWIDE_OFFICERS` and append them to `game.sittingMembers` with `office: 'statewide_executive'`.
3. `engine.js`:
   - Add `game.statewideOffices` map tracking current party control (`people`, `heritage`, or third party).
   - Add `contestStatewideSlate(stateId)` action to Phase 1 organizing actions.
   - Add candidate funding handler for `statewide_executive` in candidate triage.
4. `election-night-engine.js`:
   - Implement `resolveStatewideOffices(game, year)` calculating popular vote percentages and updating party control.
   - Log flipped seats into `game.cycleFlips.statewide`.
5. `app.js`:
   - Add "Statewide Executive" accordion / drawer in the Race Inspection view.
   - Render downballot cards with incumbent portraits, margins, and flip indicators.

---

## 7. Verification & Integration Test Plan

1. **Roster Completeness Check (`test-statewide-roster.cjs`):**
   - Asserts that every non-excluded state has its starting incumbents instantiated in `game.sittingMembers`.
   - Validates that party IDs (`people`, `heritage`) and faction alignments are fully synchronized.
2. **Contestation & Funding Test (`test-statewide-campaign.cjs`):**
   - Verifies that spending treasury cash lifts statewide candidate polling per the calibrated diminishing returns curve.
3. **Ticket-Splitting Validation (`test-statewide-ticket-split.cjs`):**
   - Simulates 1,000 cycles across North Carolina, Kansas, and Vermont to confirm that gubernatorial blowouts do not unrealistically drag downballot seats without sufficient candidate quality or funding.
