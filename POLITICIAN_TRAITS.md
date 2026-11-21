# Coalition Builder: Party Chair — Politician Traits Specification Document

> **Document Status:** Reference Specification & Catalog for **REQ-128 / TRAITS-01** (Candidate Traits Engine).  
> **Last Updated:** November 14, 2026  
> **Applicable Version:** Version 0.14+ Engine Architecture  

---

## 1. Executive Summary & Trait System Architecture

The **Candidate Traits Engine** introduces a comprehensive qualitative character taxonomy to *Coalition Builder: Party Chair*. Every active political figure in the game—encompassing all **100 U.S. Senators**, **50 Governors**, **435 House Representatives**, and **Party Leadership figures**—is assigned at least one defining trait based on their established public perception, media reputation, and career profile.

### The 8 Canonical Candidate Traits
| Trait Name | Definition & Archetype Profile | Core Criteria & Constraints |
| :--- | :--- | :--- |
| **Rising Star** | Rapidly gaining national popularity, media buzz, and grassroots momentum. | Must be under 60 years of age *(Candidate Age Engine tracked under `TBD-13`)*. |
| **Established politician** | Veteran lawmaker or institutional fixture with deep party roots, seniority, and committee power. | High experience, prolonged tenure, well-known brand identity. |
| **Corrupt** | Dogged by ethics probes, campaign finance controversies, self-dealing, or criminal indictments. | Prominent ethical baggage or federal investigations. |
| **Squeaky Clean** | Renowned for ethics reform, personal transparency, anti-PAC integrity, and untainted public standing. | Low corruption footprint, high public integrity rating. |
| **Polished** | Highly camera-ready, teleprompter-adept, slick oratorical and debate delivery. | Strong debate skills, high media savvy, message discipline. |
| **Rough** | Unvarnished, raw, combative, unapologetically populist, plain-spoken, or blue-collar. | Anti-establishment delivery, outsider posture, unscripted appeal. |
| **Disciplined** | Strictly on-message, party-line regular, cautious operator, rare unforced gaffes. | High message discipline, reliable institutional loyalty. |
| **Undisciplined** | Prone to hot-mic gaffes, rogue voting, explosive social media rants, and tactical blunders. | High controversy risk, spontaneous outbursts, tactical volatility. |

*(Note: In accordance with project directions, mechanical simulation effects for these traits are staged under **TBD-14**).*

---

## 2. Trait Distribution & Analytics Summary

| Trait | Total Politicians Assigned | % of Catalog (~605) | Primary Chamber Distribution |
| :--- | :---: | :---: | :--- |
| **Rising Star** | **33** | 5.5% | Cross-Chamber |
| **Established politician** | **188** | 31.1% | Cross-Chamber |
| **Corrupt** | **83** | 13.7% | Cross-Chamber |
| **Squeaky Clean** | **173** | 28.6% | Cross-Chamber |
| **Polished** | **198** | 32.7% | Cross-Chamber |
| **Rough** | **213** | 35.2% | Cross-Chamber |
| **Disciplined** | **150** | 24.8% | Cross-Chamber |
| **Undisciplined** | **51** | 8.4% | Cross-Chamber |

---

## 3. Party Leadership Roster (20 Key National Figures)

| Politician Name | Party Alignment | Core Office / Role | Assigned Public Perception Traits |
| :--- | :--- | :--- | :--- |
| **Jon Ossoff** | Democratic | Field Organizer | `Rising Star`, `Polished` |
| **Gretchen Whitmer** | Democratic | Practical Governor | `Polished`, `Disciplined`, `Rising Star` |
| **Cory Booker** | Democratic | Coalition Builder | `Established politician`, `Polished` |
| **Alexandria Ocasio-Cortez** | Democratic | Movement Whip | `Rising Star`, `Rough` |
| **Andy Beshear** | Democratic | State Party Broker | `Rising Star`, `Squeaky Clean`, `Polished` |
| **Amy Klobuchar** | Democratic | Rural Vote Director | `Established politician`, `Disciplined` |
| **J. D. Vance** | Republican | County Organizer | `Rising Star`, `Rough` |
| **Nikki Haley** | Republican | Business Coalition Lead | `Established politician`, `Polished` |
| **Marco Rubio** | Republican | Community Outreach Lead | `Established politician`, `Polished` |
| **Glenn Youngkin** | Republican | Local Leaders Liaison | `Polished`, `Disciplined` |
| **Butch Ware** | Libertarian | Civil Liberties Organizer | `Rough`, `Undisciplined` |
| **Mike ter Maat** | Libertarian | Small-Donor Director | `Disciplined` |
| **Chase Oliver** | Libertarian | Pragmatic Libertarian | `Rising Star`, `Polished` |
| **Jill Stein** | Green | Climate Organizer | `Established politician`, `Rough` |
| **Kshama Sawant** | Green | Labor Coalition Lead | `Rough`, `Undisciplined` |
| **Ajamu Baraka** | Green | Local Leaders Liaison | `Rough` |
| **Randall Terry** | Constitution | Faith & Flag Torchbearer | `Rough`, `Undisciplined` |
| **Scott Bradley** | Constitution | Sovereignty Organizer | `Disciplined` |
| **Claudia De la Cruz** | Socialist | Workers Solidarity Lead | `Rising Star`, `Rough` |
| **Brian Carroll** | Socialist | Public-Goods Strategist | `Squeaky Clean`, `Disciplined` |

---

## 4. 100 Sitting U.S. Senators

| State | Senator Name | Party | Senate Seat Title | Assigned Public Perception Traits |
| :---: | :--- | :--- | :--- | :--- |
| **AK** | **Lisa Murkowski** | Republican | U.S. Senator (AK) | `Established politician`, `Disciplined` |
| **AK** | **Mary Peltola** | Democratic | U.S. Senator (AK) | `Rising Star`, `Squeaky Clean`, `Polished` |
| **AL** | **Katie Britt** | Republican | U.S. Senator (AL) | `Rising Star`, `Polished` |
| **AL** | **Tommy Tuberville** | Republican | U.S. Senator (AL) | `Rough`, `Undisciplined` |
| **AR** | **John Boozman** | Republican | U.S. Senator (AR) | `Squeaky Clean`, `Polished` |
| **AR** | **Tom Cotton** | Republican | U.S. Senator (AR) | `Rising Star`, `Disciplined` |
| **AZ** | **Mark Kelly** | Democratic | U.S. Senator (AZ) | `Squeaky Clean`, `Polished`, `Rising Star` |
| **AZ** | **Ruben Gallego** | Democratic | U.S. Senator (AZ) | `Rising Star`, `Rough` |
| **CA** | **Adam Schiff** | Democratic | U.S. Senator (CA) | `Established politician`, `Polished` |
| **CA** | **Alex Padilla** | Democratic | U.S. Senator (CA) | `Established politician`, `Polished` |
| **CO** | **John Hickenlooper** | Democratic | U.S. Senator (CO) | `Squeaky Clean`, `Established politician`, `Polished` |
| **CO** | **Michael Bennet** | Democratic | U.S. Senator (CO) | `Undisciplined` |
| **CT** | **Chris Murphy** | Democratic | U.S. Senator (CT) | `Rising Star`, `Polished` |
| **CT** | **Richard Blumenthal** | Democratic | U.S. Senator (CT) | `Established politician`, `Polished` |
| **DE** | **Chris Coons** | Democratic | U.S. Senator (DE) | `Established politician`, `Disciplined` |
| **DE** | **Lisa Blunt Rochester** | Democratic | U.S. Senator (DE) | `Corrupt`, `Established politician`, `Polished` |
| **FL** | **Ashley Moody** | Republican | U.S. Senator (FL) | `Squeaky Clean`, `Established politician`, `Polished` |
| **FL** | **Rick Scott** | Republican | U.S. Senator (FL) | `Established politician`, `Disciplined` |
| **GA** | **Jon Ossoff** | Democratic | U.S. Senator (GA) | `Rising Star`, `Polished` |
| **GA** | **Raphael Warnock** | Democratic | U.S. Senator (GA) | `Rising Star`, `Polished` |
| **HI** | **Brian Schatz** | Democratic | U.S. Senator (HI) | `Established politician`, `Disciplined` |
| **HI** | **Mazie Hirono** | Democratic | U.S. Senator (HI) | `Established politician`, `Rough` |
| **IA** | **Chuck Grassley** | Republican | U.S. Senator (IA) | `Established politician`, `Rough` |
| **IA** | **Josh Turek** | Democratic | U.S. Senator (IA) | `Corrupt`, `Established politician` |
| **ID** | **Jim Risch** | Republican | U.S. Senator (ID) | `Established politician`, `Disciplined` |
| **ID** | **Mike Crapo** | Republican | U.S. Senator (ID) | `Established politician`, `Disciplined` |
| **IL** | **Juliana Stratton** | Democratic | U.S. Senator (IL) | `Established politician` |
| **IL** | **Tammy Duckworth** | Democratic | U.S. Senator (IL) | `Established politician`, `Disciplined` |
| **IN** | **Jim Banks** | Republican | U.S. Senator (IN) | `Established politician`, `Polished` |
| **IN** | **Todd Young** | Republican | U.S. Senator (IN) | `Disciplined`, `Polished` |
| **KS** | **Adam Hamilton** | Democratic | U.S. Senator (KS) | `Established politician`, `Disciplined` |
| **KS** | **Jerry Moran** | Republican | U.S. Senator (KS) | `Established politician`, `Disciplined` |
| **KY** | **Andy Barr** | Republican | U.S. Senator (KY) | `Established politician`, `Rough` |
| **KY** | **Rand Paul** | Republican | U.S. Senator (KY) | `Established politician`, `Undisciplined` |
| **LA** | **Bill Cassidy** | Republican | U.S. Senator (LA) | `Established politician`, `Disciplined` |
| **LA** | **John Kennedy** | Republican | U.S. Senator (LA) | `Established politician`, `Rough`, `Undisciplined` |
| **MA** | **Ed Markey** | Democratic | U.S. Senator (MA) | `Established politician`, `Rough` |
| **MA** | **Elizabeth Warren** | Democratic | U.S. Senator (MA) | `Established politician`, `Disciplined` |
| **MD** | **Angela Alsobrooks** | Democratic | U.S. Senator (MD) | `Squeaky Clean`, `Established politician`, `Rough` |
| **MD** | **Chris Van Hollen** | Democratic | U.S. Senator (MD) | `Rough` |
| **ME** | **Angus King** | Independent | U.S. Senator (ME) | `Established politician`, `Squeaky Clean` |
| **ME** | **Troy Jackson** | Democratic | U.S. Senator (ME) | `Squeaky Clean`, `Established politician`, `Polished` |
| **MI** | **Elissa Slotkin** | Democratic | U.S. Senator (MI) | `Rising Star`, `Polished` |
| **MI** | **Haley Stevens** | Democratic | U.S. Senator (MI) | `Established politician`, `Rough` |
| **MN** | **Amy Klobuchar** | Democratic | U.S. Senator (MN) | `Established politician`, `Disciplined` |
| **MN** | **Angie Craig** | Democratic | U.S. Senator (MN) | `Established politician`, `Polished` |
| **MO** | **Eric Schmitt** | Republican | U.S. Senator (MO) | `Rising Star`, `Polished` |
| **MO** | **Josh Hawley** | Republican | U.S. Senator (MO) | `Rising Star`, `Polished` |
| **MS** | **Roger Wicker** | Republican | U.S. Senator (MS) | `Established politician`, `Disciplined` |
| **MS** | **Scott Colom** | Democratic | U.S. Senator (MS) | `Squeaky Clean`, `Established politician`, `Rough` |
| **MT** | **Steve Daines** | Republican | U.S. Senator (MT) | `Established politician`, `Disciplined` |
| **MT** | **Tim Sheehy** | Republican | U.S. Senator (MT) | `Established politician` |
| **NC** | **Roy Cooper** | Democratic | U.S. Senator (NC) | `Established politician`, `Disciplined` |
| **NC** | **Ted Budd** | Republican | U.S. Senator (NC) | `Disciplined` |
| **ND** | **John Hoeven** | Republican | U.S. Senator (ND) | `Established politician`, `Disciplined` |
| **ND** | **Kevin Cramer** | Republican | U.S. Senator (ND) | `Established politician`, `Rough` |
| **NE** | **Deb Fischer** | Republican | U.S. Senator (NE) | `Established politician`, `Disciplined` |
| **NE** | **Pete Ricketts** | Republican | U.S. Senator (NE) | `Established politician`, `Polished` |
| **NH** | **Chris Pappas** | Democratic | U.S. Senator (NH) | `Established politician` |
| **NH** | **Maggie Hassan** | Democratic | U.S. Senator (NH) | `Established politician`, `Disciplined` |
| **NJ** | **Andy Kim** | Democratic | U.S. Senator (NJ) | `Rough` |
| **NJ** | **Cory Booker** | Democratic | U.S. Senator (NJ) | `Established politician`, `Polished` |
| **NM** | **Ben Ray Lujan** | Democratic | U.S. Senator (NM) | `Established politician`, `Polished` |
| **NM** | **Martin Heinrich** | Democratic | U.S. Senator (NM) | `Established politician`, `Polished` |
| **NV** | **Catherine Cortez Masto** | Democratic | U.S. Senator (NV) | `Established politician`, `Disciplined` |
| **NV** | **Jacky Rosen** | Democratic | U.S. Senator (NV) | `Disciplined`, `Established politician` |
| **NY** | **Chuck Schumer** | Democratic | U.S. Senator (NY) | `Established politician`, `Disciplined` |
| **NY** | **Kirsten Gillibrand** | Democratic | U.S. Senator (NY) | `Established politician`, `Polished` |
| **OH** | **Bernie Moreno** | Republican | U.S. Senator (OH) | `Established politician`, `Polished` |
| **OH** | **Sherrod Brown** | Democratic | U.S. Senator (OH) | `Established politician`, `Rough` |
| **OK** | **James Lankford** | Republican | U.S. Senator (OK) | `Established politician`, `Disciplined` |
| **OK** | **Markwayne Mullin** | Republican | U.S. Senator (OK) | `Rough`, `Undisciplined` |
| **OR** | **Jeff Merkley** | Democratic | U.S. Senator (OR) | `Established politician`, `Disciplined` |
| **OR** | **Ron Wyden** | Democratic | U.S. Senator (OR) | `Established politician`, `Disciplined` |
| **PA** | **Dave McCormick** | Republican | U.S. Senator (PA) | `Squeaky Clean`, `Established politician` |
| **PA** | **John Fetterman** | Democratic | U.S. Senator (PA) | `Rough`, `Undisciplined` |
| **RI** | **Jack Reed** | Democratic | U.S. Senator (RI) | `Established politician`, `Disciplined` |
| **RI** | **Sheldon Whitehouse** | Democratic | U.S. Senator (RI) | `Established politician`, `Disciplined` |
| **SC** | **Annie Andrews** | Democratic | U.S. Senator (SC) | `Squeaky Clean`, `Established politician`, `Rough` |
| **SC** | **Tim Scott** | Republican | U.S. Senator (SC) | `Established politician`, `Polished` |
| **SD** | **John Thune** | Republican | U.S. Senator (SD) | `Established politician`, `Disciplined` |
| **SD** | **Mike Rounds** | Republican | U.S. Senator (SD) | `Established politician`, `Disciplined` |
| **TN** | **Bill Hagerty** | Republican | U.S. Senator (TN) | `Disciplined`, `Polished` |
| **TN** | **Marsha Blackburn** | Republican | U.S. Senator (TN) | `Established politician`, `Rough` |
| **TX** | **James Talarico** | Democratic | U.S. Senator (TX) | `Corrupt`, `Established politician`, `Polished` |
| **TX** | **Ted Cruz** | Republican | U.S. Senator (TX) | `Established politician`, `Polished` |
| **UT** | **John Curtis** | Republican | U.S. Senator (UT) | `Corrupt`, `Established politician`, `Polished` |
| **UT** | **Mike Lee** | Republican | U.S. Senator (UT) | `Established politician`, `Undisciplined` |
| **VA** | **Mark Warner** | Democratic | U.S. Senator (VA) | `Established politician`, `Polished` |
| **VA** | **Tim Kaine** | Democratic | U.S. Senator (VA) | `Established politician`, `Disciplined` |
| **VT** | **Bernie Sanders** | Independent | U.S. Senator (VT) | `Established politician`, `Squeaky Clean`, `Rough` |
| **VT** | **Peter Welch** | Democratic | U.S. Senator (VT) | `Established politician`, `Squeaky Clean` |
| **WA** | **Maria Cantwell** | Democratic | U.S. Senator (WA) | `Established politician`, `Disciplined` |
| **WA** | **Patty Murray** | Democratic | U.S. Senator (WA) | `Established politician`, `Disciplined` |
| **WI** | **Ron Johnson** | Republican | U.S. Senator (WI) | `Established politician`, `Rough`, `Undisciplined` |
| **WI** | **Tammy Baldwin** | Democratic | U.S. Senator (WI) | `Established politician`, `Disciplined` |
| **WV** | **Jim Justice** | Republican | U.S. Senator (WV) | `Established politician`, `Rough` |
| **WV** | **Shelley Moore Capito** | Republican | U.S. Senator (WV) | `Established politician`, `Disciplined` |
| **WY** | **Harriet Hageman** | Republican | U.S. Senator (WY) | `Established politician`, `Polished` |
| **WY** | **John Barrasso** | Republican | U.S. Senator (WY) | `Established politician`, `Disciplined` |

---

## 5. 50 Sitting U.S. Governors

| State | Governor Name | Party | Gubernatorial Title | Assigned Public Perception Traits |
| :---: | :--- | :--- | :--- | :--- |
| **AK** | **Click Bishop** | Republican | Governor of Alaska | `Squeaky Clean`, `Established politician` |
| **AL** | **Tommy Tuberville** | Republican | Governor of Alabama | `Rough`, `Undisciplined` |
| **AR** | **Sarah Huckabee Sanders** | Republican | Governor of Arkansas | `Rising Star`, `Rough` |
| **AZ** | **Katie Hobbs** | Democratic | Governor of Arizona | `Disciplined` |
| **CA** | **Eleni Kounalakis** | Democratic | Governor of California | `Established politician` |
| **CO** | **Phil Weiser** | Democratic | Governor of Colorado | `Squeaky Clean`, `Established politician`, `Polished` |
| **CT** | **Ned Lamont** | Democratic | Governor of Connecticut | `Established politician`, `Polished` |
| **DE** | **Matt Meyer** | Democratic | Governor of Delaware | `Squeaky Clean`, `Established politician` |
| **FL** | **Byron Donalds** | Republican | Governor of Florida | `Rising Star`, `Polished` |
| **GA** | **Keisha Lance Bottoms** | Democratic | Governor of Georgia | `Squeaky Clean`, `Established politician`, `Polished` |
| **HI** | **Josh Green** | Democratic | Governor of Hawaii | `Squeaky Clean`, `Polished` |
| **IA** | **Rob Sand** | Democratic | Governor of Iowa | `Squeaky Clean`, `Established politician` |
| **ID** | **Brad Little** | Republican | Governor of Idaho | `Established politician`, `Disciplined` |
| **IL** | **JB Pritzker** | Democratic | Governor of Illinois | `Established politician`, `Polished` |
| **IN** | **Mike Braun** | Republican | Governor of Indiana | `Established politician`, `Disciplined` |
| **KS** | **Sharice Davids** | Democratic | Governor of Kansas | `Squeaky Clean`, `Established politician`, `Polished` |
| **KY** | **Andy Beshear** | Democratic | Governor of Kentucky | `Rising Star`, `Squeaky Clean`, `Polished` |
| **LA** | **Jeff Landry** | Republican | Governor of Louisiana | `Rough`, `Undisciplined` |
| **MA** | **Maura Healey** | Democratic | Governor of Massachusetts | `Rising Star`, `Polished` |
| **MD** | **Wes Moore** | Democratic | Governor of Maryland | `Rising Star`, `Polished` |
| **ME** | **Shenna Bellows** | Democratic | Governor of Maine | `Rough`, `Disciplined` |
| **MI** | **Jocelyn Benson** | Democratic | Governor of Michigan | `Corrupt` |
| **MN** | **Tim Walz** | Democratic | Governor of Minnesota | `Established politician`, `Rough` |
| **MO** | **Mike Kehoe** | Republican | Governor of Missouri | `Squeaky Clean`, `Established politician`, `Rough` |
| **MS** | **Tate Reeves** | Republican | Governor of Mississippi | `Established politician`, `Disciplined` |
| **MT** | **Greg Gianforte** | Republican | Governor of Montana | `Rough`, `Established politician` |
| **NC** | **Josh Stein** | Democratic | Governor of North Carolina | `Squeaky Clean`, `Established politician`, `Polished` |
| **ND** | **Kelly Armstrong** | Republican | Governor of North Dakota | `Squeaky Clean`, `Established politician` |
| **NE** | **Jim Pillen** | Republican | Governor of Nebraska | `Rough` |
| **NH** | **Kelly Ayotte** | Republican | Governor of New Hampshire | `Established politician`, `Polished` |
| **NJ** | **Mikie Sherrill** | Democratic | Governor of New Jersey | `Rising Star`, `Polished` |
| **NM** | **Deb Haaland** | Democratic | Governor of New Mexico | `Established politician`, `Disciplined` |
| **NV** | **Aaron Ford** | Democratic | Governor of Nevada | `Polished`, `Disciplined` |
| **NY** | **Kathy Hochul** | Democratic | Governor of New York | `Established politician`, `Polished` |
| **OH** | **Amy Acton** | Democratic | Governor of Ohio | `Squeaky Clean`, `Established politician` |
| **OK** | **Gentner Drummond** | Republican | Governor of Oklahoma | `Established politician`, `Polished` |
| **OR** | **Tina Kotek** | Democratic | Governor of Oregon | `Disciplined`, `Polished` |
| **PA** | **Josh Shapiro** | Democratic | Governor of Pennsylvania | `Rising Star`, `Polished` |
| **RI** | **Dan McKee** | Democratic | Governor of Rhode Island | `Established politician`, `Disciplined` |
| **SC** | **Alan Wilson** | Republican | Governor of South Carolina | `Established politician`, `Rough` |
| **SD** | **Larry Rhoden** | Republican | Governor of South Dakota | `Squeaky Clean`, `Established politician`, `Polished` |
| **TN** | **Marsha Blackburn** | Republican | Governor of Tennessee | `Established politician`, `Rough` |
| **TX** | **Gina Hinojosa** | Democratic | Governor of Texas | `Corrupt`, `Established politician` |
| **UT** | **Spencer Cox** | Republican | Governor of Utah | `Squeaky Clean`, `Polished` |
| **VA** | **Abigail Spanberger** | Democratic | Governor of Virginia | `Rising Star`, `Polished`, `Disciplined` |
| **VT** | **Phil Scott** | Republican | Governor of Vermont | `Squeaky Clean`, `Established politician` |
| **WA** | **Bob Ferguson** | Democratic | Governor of Washington | `Disciplined`, `Polished` |
| **WI** | **Mandela Barnes** | Democratic | Governor of Wisconsin | `Corrupt`, `Polished` |
| **WV** | **Patrick Morrisey** | Republican | Governor of West Virginia | `Squeaky Clean`, `Undisciplined` |
| **WY** | **Chuck Gray** | Republican | Governor of Wyoming | `Squeaky Clean`, `Established politician`, `Rough` |

---

## 6. 435 Sitting U.S. House Representatives

| District | Representative Name | Party | Congressional Seat Title | Assigned Public Perception Traits |
| :---: | :--- | :--- | :--- | :--- |
| **AK-1** | **Nick Begich III** | Republican | U.S. Representative (AK-1) | `Established politician`, `Polished` |
| **AL-1** | **Jerry Carl** | Republican | U.S. Representative (AL-1) | `Corrupt`, `Polished` |
| **AL-2** | **Shomari Figures** | Democratic | U.S. Representative (AL-2) | `Established politician`, `Polished` |
| **AL-3** | **Mike Rogers** | Republican | U.S. Representative (AL-3) | `Established politician`, `Disciplined` |
| **AL-4** | **Robert Aderholt** | Republican | U.S. Representative (AL-4) | `Polished`, `Disciplined` |
| **AL-5** | **Dale Strong** | Republican | U.S. Representative (AL-5) | `Rough`, `Undisciplined` |
| **AL-6** | **Gary Palmer** | Republican | U.S. Representative (AL-6) | `Squeaky Clean`, `Rough` |
| **AL-7** | **Terri Sewell** | Democratic | U.S. Representative (AL-7) | `Rough`, `Undisciplined` |
| **AR-1** | **Rick Crawford** | Republican | U.S. Representative (AR-1) | `Squeaky Clean`, `Polished` |
| **AR-2** | **French Hill** | Republican | U.S. Representative (AR-2) | `Squeaky Clean` |
| **AR-3** | **Steve Womack** | Republican | U.S. Representative (AR-3) | `Undisciplined` |
| **AR-4** | **Bruce Westerman** | Republican | U.S. Representative (AR-4) | `Rough` |
| **AZ-1** | **Amish Shah** | Democratic | U.S. Representative (AZ-1) | `Polished` |
| **AZ-2** | **Eli Crane** | Republican | U.S. Representative (AZ-2) | `Polished`, `Disciplined` |
| **AZ-3** | **Yassamin Ansari** | Democratic | U.S. Representative (AZ-3) | `Squeaky Clean`, `Polished` |
| **AZ-4** | **Greg Stanton** | Democratic | U.S. Representative (AZ-4) | `Established politician`, `Polished` |
| **AZ-5** | **Mark Lamb** | Republican | U.S. Representative (AZ-5) | `Squeaky Clean`, `Polished` |
| **AZ-6** | **JoAnna Mendoza** | Democratic | U.S. Representative (AZ-6) | `Established politician` |
| **AZ-7** | **Adelita Grijalva** | Democratic | U.S. Representative (AZ-7) | `Established politician` |
| **AZ-8** | **Abraham Hamadeh** | Republican | U.S. Representative (AZ-8) | `Corrupt`, `Rough` |
| **AZ-9** | **Paul Gosar** | Republican | U.S. Representative (AZ-9) | `Rough`, `Undisciplined` |
| **CA-1** | **Mike McGuire** | Democratic | U.S. Representative (CA-1) | `Undisciplined` |
| **CA-2** | **Jared Huffman** | Democratic | U.S. Representative (CA-2) | `Disciplined` |
| **CA-3** | **Ami Bera** | Democratic | U.S. Representative (CA-3) | `Squeaky Clean`, `Rough` |
| **CA-4** | **Mike Thompson** | Democratic | U.S. Representative (CA-4) | `Polished` |
| **CA-5** | **Tom McClintock** | Republican | U.S. Representative (CA-5) | `Rough` |
| **CA-6** | **Richard Pan** | Democratic | U.S. Representative (CA-6) | `Disciplined` |
| **CA-7** | **Doris Matsui** | Democratic | U.S. Representative (CA-7) | `Disciplined` |
| **CA-8** | **John Garamendi** | Democratic | U.S. Representative (CA-8) | `Polished`, `Disciplined` |
| **CA-9** | **Josh Harder** | Democratic | U.S. Representative (CA-9) | `Established politician`, `Rough` |
| **CA-10** | **Mark DeSaulnier** | Democratic | U.S. Representative (CA-10) | `Squeaky Clean`, `Polished` |
| **CA-11** | **Scott Wiener** | Democratic | U.S. Representative (CA-11) | `Polished`, `Disciplined` |
| **CA-12** | **Lateefah Simon** | Democratic | U.S. Representative (CA-12) | `Corrupt`, `Rough` |
| **CA-13** | **Adam Gray** | Democratic | U.S. Representative (CA-13) | `Established politician`, `Polished` |
| **CA-14** | **Aisha Wahab** | Democratic | U.S. Representative (CA-14) | `Rough`, `Undisciplined` |
| **CA-15** | **Kevin Mullin** | Democratic | U.S. Representative (CA-15) | `Corrupt`, `Established politician`, `Polished` |
| **CA-16** | **Sam Liccardo** | Democratic | U.S. Representative (CA-16) | `Squeaky Clean`, `Disciplined` |
| **CA-17** | **Ro Khanna** | Democratic | U.S. Representative (CA-17) | `Rising Star`, `Polished` |
| **CA-18** | **Zoe Lofgren** | Democratic | U.S. Representative (CA-18) | `Squeaky Clean`, `Polished` |
| **CA-19** | **Jimmy Panetta** | Democratic | U.S. Representative (CA-19) | `Polished` |
| **CA-20** | **Vince Fong** | Republican | U.S. Representative (CA-20) | `Rough` |
| **CA-21** | **Jim Costa** | Democratic | U.S. Representative (CA-21) | `Corrupt`, `Rough` |
| **CA-22** | **Randy Villegas** | Democratic | U.S. Representative (CA-22) | `Squeaky Clean`, `Disciplined` |
| **CA-23** | **Jay Obernolte** | Republican | U.S. Representative (CA-23) | `Rough` |
| **CA-24** | **Salud Carbajal** | Democratic | U.S. Representative (CA-24) | `Disciplined` |
| **CA-25** | **Raul Ruiz** | Democratic | U.S. Representative (CA-25) | `Corrupt`, `Rough` |
| **CA-26** | **Jacqui Irwin** | Democratic | U.S. Representative (CA-26) | `Rough` |
| **CA-27** | **George T. Whitesides** | Democratic | U.S. Representative (CA-27) | `Rough` |
| **CA-28** | **Judy Chu** | Democratic | U.S. Representative (CA-28) | `Established politician` |
| **CA-29** | **Luz Maria Rivas** | Democratic | U.S. Representative (CA-29) | `Squeaky Clean` |
| **CA-30** | **Laura Friedman** | Democratic | U.S. Representative (CA-30) | `Squeaky Clean`, `Undisciplined` |
| **CA-31** | **Gil Cisneros** | Democratic | U.S. Representative (CA-31) | `Established politician` |
| **CA-32** | **Brad Sherman** | Democratic | U.S. Representative (CA-32) | `Squeaky Clean`, `Established politician` |
| **CA-33** | **Pete Aguilar** | Democratic | U.S. Representative (CA-33) | `Disciplined`, `Established politician` |
| **CA-34** | **Angela Gonzales-Torres** | Democratic | U.S. Representative (CA-34) | `Corrupt` |
| **CA-35** | **Norma Torres** | Democratic | U.S. Representative (CA-35) | `Corrupt`, `Polished` |
| **CA-36** | **Ted Lieu** | Democratic | U.S. Representative (CA-36) | `Polished`, `Established politician` |
| **CA-37** | **Sydney Kamlager-Dove** | Democratic | U.S. Representative (CA-37) | `Corrupt`, `Disciplined` |
| **CA-38** | **Hilda Solis** | Democratic | U.S. Representative (CA-38) | `Polished` |
| **CA-39** | **Mark Takano** | Democratic | U.S. Representative (CA-39) | `Squeaky Clean`, `Polished` |
| **CA-40** | **Ken Calvert** | Republican | U.S. Representative (CA-40) | `Squeaky Clean` |
| **CA-41** | **Linda Sánchez** | Democratic | U.S. Representative (CA-41) | `Squeaky Clean`, `Disciplined` |
| **CA-42** | **Robert Garcia** | Democratic | U.S. Representative (CA-42) | `Squeaky Clean`, `Established politician`, `Rough` |
| **CA-43** | **Maxine Waters** | Democratic | U.S. Representative (CA-43) | `Established politician`, `Rough` |
| **CA-44** | **Nanette Barragán** | Democratic | U.S. Representative (CA-44) | `Corrupt` |
| **CA-45** | **Derek Tran** | Democratic | U.S. Representative (CA-45) | `Polished`, `Disciplined` |
| **CA-46** | **Lou Correa** | Democratic | U.S. Representative (CA-46) | `Rough`, `Disciplined` |
| **CA-47** | **Dave Min** | Democratic | U.S. Representative (CA-47) | `Rough`, `Disciplined` |
| **CA-48** | **Marni von Wilpert** | Democratic | U.S. Representative (CA-48) | `Squeaky Clean`, `Rough` |
| **CA-49** | **Mike Levin** | Democratic | U.S. Representative (CA-49) | `Disciplined` |
| **CA-50** | **Scott Peters** | Democratic | U.S. Representative (CA-50) | `Rough`, `Undisciplined` |
| **CA-51** | **Sara Jacobs** | Democratic | U.S. Representative (CA-51) | `Squeaky Clean`, `Disciplined` |
| **CA-52** | **Juan Vargas** | Democratic | U.S. Representative (CA-52) | `Rough`, `Undisciplined` |
| **CO-1** | **Melat Kiros** | Democratic | U.S. Representative (CO-1) | `Squeaky Clean` |
| **CO-2** | **Joe Neguse** | Democratic | U.S. Representative (CO-2) | `Squeaky Clean`, `Rough` |
| **CO-3** | **Jeff Hurd** | Republican | U.S. Representative (CO-3) | `Rough` |
| **CO-4** | **Eileen Laubacher** | Democratic | U.S. Representative (CO-4) | `Squeaky Clean`, `Established politician`, `Rough` |
| **CO-5** | **Jessica Killin** | Democratic | U.S. Representative (CO-5) | `Rough` |
| **CO-6** | **Jason Crow** | Democratic | U.S. Representative (CO-6) | `Squeaky Clean`, `Rough` |
| **CO-7** | **Brittany Pettersen** | Democratic | U.S. Representative (CO-7) | `Squeaky Clean` |
| **CO-8** | **Manny Rutinel** | Democratic | U.S. Representative (CO-8) | `Squeaky Clean`, `Polished` |
| **CT-1** | **Luke Bronin** | Democratic | U.S. Representative (CT-1) | `Squeaky Clean`, `Disciplined` |
| **CT-2** | **Joe Courtney** | Democratic | U.S. Representative (CT-2) | `Corrupt`, `Rough` |
| **CT-3** | **Rosa DeLauro** | Democratic | U.S. Representative (CT-3) | `Established politician`, `Rough` |
| **CT-4** | **Jim Himes** | Democratic | U.S. Representative (CT-4) | `Squeaky Clean`, `Rough` |
| **CT-5** | **Jahana Hayes** | Democratic | U.S. Representative (CT-5) | `Squeaky Clean`, `Polished` |
| **DE-1** | **Sarah McBride** | Democratic | U.S. Representative (DE-1) | `Corrupt`, `Polished` |
| **FL-1** | **Jimmy Patronis** | Republican | U.S. Representative (FL-1) | `Squeaky Clean`, `Disciplined` |
| **FL-2** | **Austin Rogers** | Republican | U.S. Representative (FL-2) | `Squeaky Clean` |
| **FL-3** | **Kat Cammack** | Republican | U.S. Representative (FL-3) | `Corrupt`, `Polished` |
| **FL-4** | **Aaron Bean** | Republican | U.S. Representative (FL-4) | `Rough` |
| **FL-5** | **John Rutherford** | Republican | U.S. Representative (FL-5) | `Rough` |
| **FL-6** | **Randy Fine** | Republican | U.S. Representative (FL-6) | `Squeaky Clean`, `Established politician`, `Rough` |
| **FL-7** | **Ryan Elijah** | Republican | U.S. Representative (FL-7) | `Established politician` |
| **FL-8** | **Mike Haridopolos** | Republican | U.S. Representative (FL-8) | `Rough` |
| **FL-9** | **Darren Soto** | Democratic | U.S. Representative (FL-9) | `Rough`, `Undisciplined` |
| **FL-10** | **Maxwell Frost** | Democratic | U.S. Representative (FL-10) | `Rising Star`, `Rough` |
| **FL-11** | **Joe Strada** | Republican | U.S. Representative (FL-11) | `Corrupt`, `Rough` |
| **FL-12** | **Gus Bilirakis** | Republican | U.S. Representative (FL-12) | `Squeaky Clean`, `Polished` |
| **FL-13** | **Anna Paulina Luna** | Republican | U.S. Representative (FL-13) | `Rising Star`, `Rough` |
| **FL-14** | **Kathy Castor** | Democratic | U.S. Representative (FL-14) | `Squeaky Clean` |
| **FL-15** | **Laurel Lee** | Republican | U.S. Representative (FL-15) | `Established politician` |
| **FL-16** | **Sydney Gruters** | Republican | U.S. Representative (FL-16) | `Squeaky Clean` |
| **FL-17** | **Greg Steube** | Republican | U.S. Representative (FL-17) | `Squeaky Clean`, `Polished` |
| **FL-18** | **Scott Franklin** | Republican | U.S. Representative (FL-18) | `Squeaky Clean`, `Undisciplined` |
| **FL-19** | **Jim Schwartzel** | Republican | U.S. Representative (FL-19) | `Squeaky Clean` |
| **FL-20** | **Debbie Wasserman Schultz** | Democratic | U.S. Representative (FL-20) | `Rough` |
| **FL-21** | **Brian Mast** | Republican | U.S. Representative (FL-21) | `Established politician`, `Disciplined` |
| **FL-22** | **Pia Dandiya** | Democratic | U.S. Representative (FL-22) | `Disciplined` |
| **FL-23** | **Lois Frankel** | Democratic | U.S. Representative (FL-23) | `Corrupt`, `Polished` |
| **FL-24** | **Oliver Gilbert** | Democratic | U.S. Representative (FL-24) | `Established politician` |
| **FL-25** | **Jared Moskowitz** | Democratic | U.S. Representative (FL-25) | `Squeaky Clean`, `Polished` |
| **FL-26** | **Mario Díaz-Balart** | Republican | U.S. Representative (FL-26) | `Corrupt`, `Disciplined` |
| **FL-27** | **Maria Elvira Salazar** | Republican | U.S. Representative (FL-27) | `Disciplined` |
| **FL-28** | **Carlos A. Giménez** | Republican | U.S. Representative (FL-28) | `Squeaky Clean`, `Rough` |
| **GA-1** | **Jim Kingston** | Republican | U.S. Representative (GA-1) | `Polished`, `Disciplined` |
| **GA-2** | **Sanford Bishop** | Democratic | U.S. Representative (GA-2) | `Established politician`, `Disciplined` |
| **GA-3** | **Brian Jack** | Republican | U.S. Representative (GA-3) | `Established politician` |
| **GA-4** | **Hank Johnson** | Democratic | U.S. Representative (GA-4) | `Corrupt`, `Rough` |
| **GA-5** | **Nikema Williams** | Democratic | U.S. Representative (GA-5) | `Polished`, `Disciplined` |
| **GA-6** | **Lucy McBath** | Democratic | U.S. Representative (GA-6) | `Rough` |
| **GA-7** | **Rich McCormick** | Republican | U.S. Representative (GA-7) | `Corrupt`, `Polished` |
| **GA-8** | **Austin Scott** | Republican | U.S. Representative (GA-8) | `Polished` |
| **GA-9** | **Andrew Clyde** | Republican | U.S. Representative (GA-9) | `Undisciplined` |
| **GA-10** | **Houston Gaines** | Republican | U.S. Representative (GA-10) | `Established politician` |
| **GA-11** | **John Cowan** | Republican | U.S. Representative (GA-11) | `Polished`, `Disciplined` |
| **GA-12** | **Rick Allen** | Republican | U.S. Representative (GA-12) | `Squeaky Clean` |
| **GA-13** | **Jasmine Clark** | Democratic | U.S. Representative (GA-13) | `Polished` |
| **GA-14** | **Clay Fuller** | Republican | U.S. Representative (GA-14) | `Squeaky Clean` |
| **HI-1** | **Ed Case** | Democratic | U.S. Representative (HI-1) | `Rough` |
| **HI-2** | **Jill Tokuda** | Democratic | U.S. Representative (HI-2) | `Corrupt` |
| **IA-1** | **Christina Bohannan** | Democratic | U.S. Representative (IA-1) | `Rough` |
| **IA-2** | **Lindsay James** | Democratic | U.S. Representative (IA-2) | `Corrupt` |
| **IA-3** | **Sarah Trone Garriott** | Democratic | U.S. Representative (IA-3) | `Corrupt`, `Established politician`, `Polished` |
| **IA-4** | **Chris McGowan** | Republican | U.S. Representative (IA-4) | `Rough`, `Undisciplined` |
| **ID-1** | **Russ Fulcher** | Republican | U.S. Representative (ID-1) | `Polished`, `Disciplined` |
| **ID-2** | **Mike Simpson** | Republican | U.S. Representative (ID-2) | `Polished`, `Disciplined` |
| **IL-1** | **Jonathan Jackson** | Democratic | U.S. Representative (IL-1) | `Squeaky Clean` |
| **IL-2** | **Donna Miller** | Democratic | U.S. Representative (IL-2) | `Disciplined` |
| **IL-3** | **Delia Ramirez** | Democratic | U.S. Representative (IL-3) | `Established politician` |
| **IL-4** | **Patty García** | Democratic | U.S. Representative (IL-4) | `Established politician` |
| **IL-5** | **Mike Quigley** | Democratic | U.S. Representative (IL-5) | `Disciplined` |
| **IL-6** | **Sean Casten** | Democratic | U.S. Representative (IL-6) | `Squeaky Clean`, `Polished` |
| **IL-7** | **La Shawn K. Ford** | Democratic | U.S. Representative (IL-7) | `Corrupt` |
| **IL-8** | **Melissa Bean** | Democratic | U.S. Representative (IL-8) | `Polished`, `Disciplined` |
| **IL-9** | **Daniel Biss** | Democratic | U.S. Representative (IL-9) | `Squeaky Clean`, `Rough` |
| **IL-10** | **Brad Schneider** | Democratic | U.S. Representative (IL-10) | `Squeaky Clean`, `Established politician`, `Polished` |
| **IL-11** | **Bill Foster** | Democratic | U.S. Representative (IL-11) | `Rough` |
| **IL-12** | **Mike Bost** | Republican | U.S. Representative (IL-12) | `Established politician`, `Disciplined` |
| **IL-13** | **Nikki Budzinski** | Democratic | U.S. Representative (IL-13) | `Squeaky Clean`, `Disciplined` |
| **IL-14** | **Lauren Underwood** | Democratic | U.S. Representative (IL-14) | `Rising Star`, `Polished` |
| **IL-15** | **Mary Miller** | Republican | U.S. Representative (IL-15) | `Polished`, `Disciplined` |
| **IL-16** | **Darin LaHood** | Republican | U.S. Representative (IL-16) | `Corrupt`, `Polished` |
| **IL-17** | **Eric Sorensen** | Democratic | U.S. Representative (IL-17) | `Established politician` |
| **IN-1** | **Frank J. Mrvan** | Democratic | U.S. Representative (IN-1) | `Squeaky Clean`, `Established politician` |
| **IN-2** | **Rudy Yakym** | Republican | U.S. Representative (IN-2) | `Corrupt` |
| **IN-3** | **Marlin Stutzman** | Republican | U.S. Representative (IN-3) | `Polished`, `Disciplined` |
| **IN-4** | **Jim Baird** | Republican | U.S. Representative (IN-4) | `Corrupt`, `Polished` |
| **IN-5** | **J.D. Ford** | Democratic | U.S. Representative (IN-5) | `Corrupt`, `Rough` |
| **IN-6** | **Jefferson Shreve** | Republican | U.S. Representative (IN-6) | `Rough` |
| **IN-7** | **André Carson** | Democratic | U.S. Representative (IN-7) | `Squeaky Clean` |
| **IN-8** | **Mark Messmer** | Republican | U.S. Representative (IN-8) | `Rough`, `Undisciplined` |
| **IN-9** | **Erin Houchin** | Republican | U.S. Representative (IN-9) | `Squeaky Clean`, `Disciplined` |
| **KS-1** | **Tracey Mann** | Republican | U.S. Representative (KS-1) | `Established politician` |
| **KS-2** | **Derek Schmidt** | Republican | U.S. Representative (KS-2) | `Established politician`, `Polished` |
| **KS-3** | **Sharice Davids** | Democratic | U.S. Representative (KS-3) | `Corrupt`, `Rough` |
| **KS-4** | **Ron Estes** | Republican | U.S. Representative (KS-4) | `Rough`, `Undisciplined` |
| **KY-1** | **James Comer** | Republican | U.S. Representative (KY-1) | `Corrupt`, `Polished` |
| **KY-2** | **Brett Guthrie** | Republican | U.S. Representative (KY-2) | `Corrupt`, `Rough` |
| **KY-3** | **Morgan McGarvey** | Democratic | U.S. Representative (KY-3) | `Squeaky Clean`, `Polished` |
| **KY-4** | **Ed Gallrein** | Republican | U.S. Representative (KY-4) | `Squeaky Clean`, `Polished` |
| **KY-5** | **Hal Rogers** | Republican | U.S. Representative (KY-5) | `Established politician`, `Disciplined` |
| **KY-6** | **Zach Dembo** | Democratic | U.S. Representative (KY-6) | `Polished` |
| **LA-1** | **Steve Scalise** | Republican | U.S. Representative (LA-1) | `Established politician`, `Disciplined` |
| **LA-2** | **Troy Carter** | Democratic | U.S. Representative (LA-2) | `Rough` |
| **LA-3** | **Clay Higgins** | Republican | U.S. Representative (LA-3) | `Rough`, `Undisciplined` |
| **LA-4** | **Mike Johnson** | Republican | U.S. Representative (LA-4) | `Disciplined`, `Polished` |
| **LA-5** | **Stewart Cathey** | Republican | U.S. Representative (LA-5) | `Rough` |
| **LA-6** | **Cleo Fields** | Democratic | U.S. Representative (LA-6) | `Squeaky Clean`, `Rough` |
| **MA-1** | **Richard Neal** | Democratic | U.S. Representative (MA-1) | `Rough` |
| **MA-2** | **Jim McGovern** | Democratic | U.S. Representative (MA-2) | `Squeaky Clean`, `Rough` |
| **MA-3** | **Lori Trahan** | Democratic | U.S. Representative (MA-3) | `Disciplined` |
| **MA-4** | **Jake Auchincloss** | Democratic | U.S. Representative (MA-4) | `Squeaky Clean`, `Polished` |
| **MA-5** | **Katherine Clark** | Democratic | U.S. Representative (MA-5) | `Disciplined`, `Established politician` |
| **MA-6** | **Dan Koh** | Democratic | U.S. Representative (MA-6) | `Rough` |
| **MA-7** | **Ayanna Pressley** | Democratic | U.S. Representative (MA-7) | `Rough` |
| **MA-8** | **Stephen Lynch** | Democratic | U.S. Representative (MA-8) | `Rough`, `Undisciplined` |
| **MA-9** | **Bill Keating** | Democratic | U.S. Representative (MA-9) | `Established politician` |
| **MD-1** | **Andy Harris** | Republican | U.S. Representative (MD-1) | `Squeaky Clean`, `Rough` |
| **MD-2** | **Johnny Olszewski** | Democratic | U.S. Representative (MD-2) | `Polished`, `Disciplined` |
| **MD-3** | **Sarah Elfreth** | Democratic | U.S. Representative (MD-3) | `Rough`, `Disciplined` |
| **MD-4** | **Glenn Ivey** | Democratic | U.S. Representative (MD-4) | `Squeaky Clean`, `Polished` |
| **MD-5** | **Adrian Boafo** | Democratic | U.S. Representative (MD-5) | `Established politician` |
| **MD-6** | **April McClain Delaney** | Democratic | U.S. Representative (MD-6) | `Rough` |
| **MD-7** | **Kweisi Mfume** | Democratic | U.S. Representative (MD-7) | `Polished` |
| **MD-8** | **Jamie Raskin** | Democratic | U.S. Representative (MD-8) | `Squeaky Clean`, `Polished` |
| **ME-1** | **Chellie Pingree** | Democratic | U.S. Representative (ME-1) | `Squeaky Clean`, `Polished` |
| **ME-2** | **Paul LePage** | Republican | U.S. Representative (ME-2) | `Corrupt`, `Polished` |
| **MI-1** | **Jack Bergman** | Republican | U.S. Representative (MI-1) | `Established politician` |
| **MI-2** | **John Moolenaar** | Republican | U.S. Representative (MI-2) | `Squeaky Clean`, `Polished` |
| **MI-3** | **Hillary Scholten** | Democratic | U.S. Representative (MI-3) | `Disciplined` |
| **MI-4** | **Sean McCann** | Democratic | U.S. Representative (MI-4) | `Undisciplined` |
| **MI-5** | **Tim Walberg** | Republican | U.S. Representative (MI-5) | `Squeaky Clean`, `Polished` |
| **MI-6** | **Debbie Dingell** | Democratic | U.S. Representative (MI-6) | `Polished`, `Disciplined` |
| **MI-7** | **William Lawrence** | Democratic | U.S. Representative (MI-7) | `Squeaky Clean`, `Established politician`, `Rough` |
| **MI-8** | **Kristen McDonald Rivet** | Democratic | U.S. Representative (MI-8) | `Polished`, `Disciplined` |
| **MI-9** | **Lisa McClain** | Republican | U.S. Representative (MI-9) | `Squeaky Clean`, `Rough` |
| **MI-10** | **Christina Hines** | Democratic | U.S. Representative (MI-10) | `Squeaky Clean`, `Disciplined` |
| **MI-11** | **Jeremy Moss** | Democratic | U.S. Representative (MI-11) | `Rough` |
| **MI-12** | **Rashida Tlaib** | Democratic | U.S. Representative (MI-12) | `Rough`, `Undisciplined` |
| **MI-13** | **Donavan McKinney** | Democratic | U.S. Representative (MI-13) | `Squeaky Clean`, `Rough` |
| **MN-1** | **Jake Johnson** | Democratic | U.S. Representative (MN-1) | `Established politician` |
| **MN-2** | **Matt Little** | Democratic | U.S. Representative (MN-2) | `Corrupt` |
| **MN-3** | **Kelly Morrison** | Democratic | U.S. Representative (MN-3) | `Polished`, `Disciplined` |
| **MN-4** | **Betty McCollum** | Democratic | U.S. Representative (MN-4) | `Polished` |
| **MN-5** | **Ilhan Omar** | Democratic | U.S. Representative (MN-5) | `Rough`, `Undisciplined` |
| **MN-6** | **Tom Emmer** | Republican | U.S. Representative (MN-6) | `Squeaky Clean` |
| **MN-7** | **Michelle Fischbach** | Republican | U.S. Representative (MN-7) | `Corrupt`, `Rough` |
| **MN-8** | **Pete Stauber** | Republican | U.S. Representative (MN-8) | `Corrupt`, `Rough` |
| **MO-1** | **Wesley Bell** | Democratic | U.S. Representative (MO-1) | `Squeaky Clean`, `Rough` |
| **MO-2** | **Fred Wellman** | Democratic | U.S. Representative (MO-2) | `Polished`, `Disciplined` |
| **MO-3** | **Bob Onder** | Republican | U.S. Representative (MO-3) | `Squeaky Clean`, `Polished` |
| **MO-4** | **Mark Alford** | Republican | U.S. Representative (MO-4) | `Rough` |
| **MO-5** | **Emanuel Cleaver** | Democratic | U.S. Representative (MO-5) | `Established politician` |
| **MO-6** | **Chris Stigall** | Republican | U.S. Representative (MO-6) | `Squeaky Clean`, `Polished` |
| **MO-7** | **Eric Burlison** | Republican | U.S. Representative (MO-7) | `Polished` |
| **MO-8** | **Jason Smith** | Republican | U.S. Representative (MO-8) | `Disciplined` |
| **MS-1** | **Trent Kelly** | Republican | U.S. Representative (MS-1) | `Disciplined` |
| **MS-2** | **Bennie Thompson** | Democratic | U.S. Representative (MS-2) | `Polished`, `Disciplined` |
| **MS-3** | **Michael Guest** | Republican | U.S. Representative (MS-3) | `Squeaky Clean`, `Polished` |
| **MS-4** | **Mike Ezell** | Republican | U.S. Representative (MS-4) | `Squeaky Clean`, `Rough` |
| **MT-1** | **Sam Forstag** | Democratic | U.S. Representative (MT-1) | `Rough`, `Undisciplined` |
| **MT-2** | **Troy Downing** | Republican | U.S. Representative (MT-2) | `Rough` |
| **NC-1** | **Don Davis** | Democratic | U.S. Representative (NC-1) | `Disciplined` |
| **NC-2** | **Deborah Ross** | Democratic | U.S. Representative (NC-2) | `Rough` |
| **NC-3** | **Greg Murphy** | Republican | U.S. Representative (NC-3) | `Rough` |
| **NC-4** | **Valerie Foushee** | Democratic | U.S. Representative (NC-4) | `Squeaky Clean`, `Polished` |
| **NC-5** | **Virginia Foxx** | Republican | U.S. Representative (NC-5) | `Corrupt`, `Disciplined` |
| **NC-6** | **Cyril Jefferson** | Democratic | U.S. Representative (NC-6) | `Polished` |
| **NC-7** | **David Rouzer** | Republican | U.S. Representative (NC-7) | `Corrupt`, `Rough` |
| **NC-8** | **Mark Harris** | Republican | U.S. Representative (NC-8) | `Rough` |
| **NC-9** | **Richard Ojeda** | Democratic | U.S. Representative (NC-9) | `Squeaky Clean`, `Polished` |
| **NC-10** | **Pat Harrigan** | Republican | U.S. Representative (NC-10) | `Rough` |
| **NC-11** | **Jamie Ager** | Democratic | U.S. Representative (NC-11) | `Rough` |
| **NC-12** | **Alma Adams** | Democratic | U.S. Representative (NC-12) | `Squeaky Clean`, `Rough` |
| **NC-13** | **Paul Barringer** | Democratic | U.S. Representative (NC-13) | `Corrupt`, `Rough` |
| **NC-14** | **LaKesha Womack** | Democratic | U.S. Representative (NC-14) | `Undisciplined` |
| **ND-1** | **Julie Fedorchak** | Republican | U.S. Representative (ND-1) | `Squeaky Clean`, `Rough` |
| **NE-1** | **Mike Flood** | Republican | U.S. Representative (NE-1) | `Established politician`, `Disciplined` |
| **NE-2** | **Denise Powell** | Democratic | U.S. Representative (NE-2) | `Squeaky Clean`, `Rough` |
| **NE-3** | **Adrian Smith** | Republican | U.S. Representative (NE-3) | `Corrupt`, `Established politician` |
| **NH-1** | **Stefany Shaheen** | Democratic | U.S. Representative (NH-1) | `Squeaky Clean`, `Rough` |
| **NH-2** | **Maggie Goodlander** | Democratic | U.S. Representative (NH-2) | `Rough` |
| **NJ-1** | **Donald Norcross** | Democratic | U.S. Representative (NJ-1) | `Polished`, `Disciplined` |
| **NJ-2** | **Zack Mullock** | Democratic | U.S. Representative (NJ-2) | `Squeaky Clean`, `Rough` |
| **NJ-3** | **Herb Conaway** | Democratic | U.S. Representative (NJ-3) | `Squeaky Clean`, `Established politician`, `Polished` |
| **NJ-4** | **Chris Smith** | Republican | U.S. Representative (NJ-4) | `Corrupt`, `Polished` |
| **NJ-5** | **Josh Gottheimer** | Democratic | U.S. Representative (NJ-5) | `Squeaky Clean`, `Polished` |
| **NJ-6** | **Frank Pallone** | Democratic | U.S. Representative (NJ-6) | `Rough` |
| **NJ-7** | **Rebecca Bennett** | Democratic | U.S. Representative (NJ-7) | `Squeaky Clean`, `Rough` |
| **NJ-8** | **Rob Menendez** | Democratic | U.S. Representative (NJ-8) | `Squeaky Clean`, `Rough` |
| **NJ-9** | **Nellie Pou** | Democratic | U.S. Representative (NJ-9) | `Polished` |
| **NJ-10** | **LaMonica McIver** | Democratic | U.S. Representative (NJ-10) | `Squeaky Clean`, `Rough` |
| **NJ-11** | **Analilia Mejia** | Democratic | U.S. Representative (NJ-11) | `Rough` |
| **NJ-12** | **Adam Hamawy** | Democratic | U.S. Representative (NJ-12) | `Rough`, `Disciplined` |
| **NM-1** | **Melanie Stansbury** | Democratic | U.S. Representative (NM-1) | `Squeaky Clean`, `Established politician`, `Polished` |
| **NM-2** | **Gabe Vasquez** | Democratic | U.S. Representative (NM-2) | `Squeaky Clean`, `Rough` |
| **NM-3** | **Teresa Leger Fernandez** | Democratic | U.S. Representative (NM-3) | `Disciplined` |
| **NV-1** | **Dina Titus** | Democratic | U.S. Representative (NV-1) | `Rough` |
| **NV-2** | **Teresa Benitez-Thompson** | Democratic | U.S. Representative (NV-2) | `Corrupt`, `Disciplined` |
| **NV-3** | **Susie Lee** | Democratic | U.S. Representative (NV-3) | `Squeaky Clean`, `Disciplined` |
| **NV-4** | **Steven Horsford** | Democratic | U.S. Representative (NV-4) | `Corrupt` |
| **NY-1** | **Nick LaLota** | Republican | U.S. Representative (NY-1) | `Established politician` |
| **NY-2** | **Andrew Garbarino** | Republican | U.S. Representative (NY-2) | `Corrupt`, `Polished` |
| **NY-3** | **Tom Suozzi** | Democratic | U.S. Representative (NY-3) | `Squeaky Clean`, `Polished` |
| **NY-4** | **Laura Gillen** | Democratic | U.S. Representative (NY-4) | `Squeaky Clean`, `Polished` |
| **NY-5** | **Gregory Meeks** | Democratic | U.S. Representative (NY-5) | `Corrupt`, `Rough` |
| **NY-6** | **Grace Meng** | Democratic | U.S. Representative (NY-6) | `Undisciplined` |
| **NY-7** | **Claire Valdez** | Democratic | U.S. Representative (NY-7) | `Squeaky Clean`, `Rough` |
| **NY-8** | **Hakeem Jeffries** | Democratic | U.S. Representative (NY-8) | `Established politician`, `Polished`, `Disciplined` |
| **NY-9** | **Yvette Clarke** | Democratic | U.S. Representative (NY-9) | `Corrupt`, `Rough` |
| **NY-10** | **Brad Lander** | Democratic | U.S. Representative (NY-10) | `Corrupt`, `Polished` |
| **NY-11** | **Nicole Malliotakis** | Republican | U.S. Representative (NY-11) | `Rough`, `Disciplined` |
| **NY-12** | **Micah Lasher** | Democratic | U.S. Representative (NY-12) | `Corrupt`, `Rough` |
| **NY-13** | **Darializa Avila Chevalier** | Democratic | U.S. Representative (NY-13) | `Corrupt`, `Rough` |
| **NY-14** | **Alexandria Ocasio-Cortez** | Democratic | U.S. Representative (NY-14) | `Rising Star`, `Rough` |
| **NY-15** | **Ritchie Torres** | Democratic | U.S. Representative (NY-15) | `Polished`, `Disciplined` |
| **NY-16** | **George Latimer** | Democratic | U.S. Representative (NY-16) | `Rough` |
| **NY-17** | **Cait Conley** | Democratic | U.S. Representative (NY-17) | `Squeaky Clean`, `Rough` |
| **NY-18** | **Pat Ryan** | Democratic | U.S. Representative (NY-18) | `Rising Star`, `Polished` |
| **NY-19** | **Josh Riley** | Democratic | U.S. Representative (NY-19) | `Squeaky Clean`, `Established politician` |
| **NY-20** | **Paul Tonko** | Democratic | U.S. Representative (NY-20) | `Corrupt`, `Polished` |
| **NY-21** | **Anthony Constantino** | Republican | U.S. Representative (NY-21) | `Rough` |
| **NY-22** | **John Mannion** | Democratic | U.S. Representative (NY-22) | `Polished`, `Disciplined` |
| **NY-23** | **Nick Langworthy** | Republican | U.S. Representative (NY-23) | `Established politician` |
| **NY-24** | **Claudia Tenney** | Republican | U.S. Representative (NY-24) | `Rough`, `Undisciplined` |
| **NY-25** | **Joseph Morelle** | Democratic | U.S. Representative (NY-25) | `Rough` |
| **NY-26** | **Tim Kennedy** | Democratic | U.S. Representative (NY-26) | `Squeaky Clean`, `Polished` |
| **OH-1** | **Greg Landsman** | Democratic | U.S. Representative (OH-1) | `Rough`, `Disciplined` |
| **OH-2** | **David Taylor** | Republican | U.S. Representative (OH-2) | `Rough`, `Undisciplined` |
| **OH-3** | **Joyce Beatty** | Democratic | U.S. Representative (OH-3) | `Rough` |
| **OH-4** | **Jim Jordan** | Republican | U.S. Representative (OH-4) | `Established politician`, `Rough`, `Disciplined` |
| **OH-5** | **Bob Latta** | Republican | U.S. Representative (OH-5) | `Squeaky Clean`, `Rough` |
| **OH-6** | **Michael Rulli** | Republican | U.S. Representative (OH-6) | `Squeaky Clean`, `Polished` |
| **OH-7** | **Brian Poindexter** | Democratic | U.S. Representative (OH-7) | `Rough`, `Undisciplined` |
| **OH-8** | **Warren Davidson** | Republican | U.S. Representative (OH-8) | `Squeaky Clean`, `Disciplined` |
| **OH-9** | **Marcy Kaptur** | Democratic | U.S. Representative (OH-9) | `Established politician`, `Disciplined` |
| **OH-10** | **Kristina Knickerbocker** | Democratic | U.S. Representative (OH-10) | `Rough` |
| **OH-11** | **Shontel Brown** | Democratic | U.S. Representative (OH-11) | `Polished`, `Disciplined` |
| **OH-12** | **Troy Balderson** | Republican | U.S. Representative (OH-12) | `Rough`, `Disciplined` |
| **OH-13** | **Emilia Sykes** | Democratic | U.S. Representative (OH-13) | `Rough`, `Undisciplined` |
| **OH-14** | **David Joyce** | Republican | U.S. Representative (OH-14) | `Squeaky Clean`, `Established politician` |
| **OH-15** | **Don Leonard** | Democratic | U.S. Representative (OH-15) | `Rough`, `Undisciplined` |
| **OK-1** | **Mark Tedford** | Republican | U.S. Representative (OK-1) | `Squeaky Clean`, `Rough` |
| **OK-2** | **Josh Brecheen** | Republican | U.S. Representative (OK-2) | `Polished`, `Disciplined` |
| **OK-3** | **Frank Lucas** | Republican | U.S. Representative (OK-3) | `Corrupt`, `Rough` |
| **OK-4** | **Tom Cole** | Republican | U.S. Representative (OK-4) | `Corrupt`, `Rough` |
| **OK-5** | **Stephanie Bice** | Republican | U.S. Representative (OK-5) | `Rough`, `Disciplined` |
| **OR-1** | **Suzanne Bonamici** | Democratic | U.S. Representative (OR-1) | `Corrupt`, `Disciplined` |
| **OR-2** | **Cliff Bentz** | Republican | U.S. Representative (OR-2) | `Corrupt` |
| **OR-3** | **Maxine Dexter** | Democratic | U.S. Representative (OR-3) | `Corrupt`, `Polished` |
| **OR-4** | **Val Hoyle** | Democratic | U.S. Representative (OR-4) | `Corrupt`, `Rough` |
| **OR-5** | **Janelle Bynum** | Democratic | U.S. Representative (OR-5) | `Polished`, `Disciplined` |
| **OR-6** | **Andrea Salinas** | Democratic | U.S. Representative (OR-6) | `Rough`, `Disciplined` |
| **PA-1** | **Bob Harvie** | Democratic | U.S. Representative (PA-1) | `Established politician`, `Polished` |
| **PA-2** | **Brendan Boyle** | Democratic | U.S. Representative (PA-2) | `Disciplined` |
| **PA-3** | **Chris Rabb** | Democratic | U.S. Representative (PA-3) | `Squeaky Clean` |
| **PA-4** | **Madeleine Dean** | Democratic | U.S. Representative (PA-4) | `Squeaky Clean`, `Undisciplined` |
| **PA-5** | **Mary Gay Scanlon** | Democratic | U.S. Representative (PA-5) | `Squeaky Clean`, `Disciplined` |
| **PA-6** | **Chrissy Houlahan** | Democratic | U.S. Representative (PA-6) | `Established politician`, `Disciplined` |
| **PA-7** | **Bob Brooks** | Democratic | U.S. Representative (PA-7) | `Squeaky Clean`, `Rough` |
| **PA-8** | **Paige Cognetti** | Democratic | U.S. Representative (PA-8) | `Corrupt`, `Rough` |
| **PA-9** | **Dan Meuser** | Republican | U.S. Representative (PA-9) | `Corrupt`, `Rough` |
| **PA-10** | **Janelle Stelson** | Democratic | U.S. Representative (PA-10) | `Rough`, `Disciplined` |
| **PA-11** | **Lloyd Smucker** | Republican | U.S. Representative (PA-11) | `Squeaky Clean`, `Established politician` |
| **PA-12** | **Summer Lee** | Democratic | U.S. Representative (PA-12) | `Rough`, `Disciplined` |
| **PA-13** | **John Joyce** | Republican | U.S. Representative (PA-13) | `Corrupt`, `Rough` |
| **PA-14** | **Guy Reschenthaler** | Republican | U.S. Representative (PA-14) | `Squeaky Clean`, `Polished` |
| **PA-15** | **Glenn Thompson** | Republican | U.S. Representative (PA-15) | `Squeaky Clean`, `Polished` |
| **PA-16** | **Mike Kelly** | Republican | U.S. Representative (PA-16) | `Squeaky Clean`, `Polished` |
| **PA-17** | **Chris Deluzio** | Democratic | U.S. Representative (PA-17) | `Squeaky Clean`, `Polished` |
| **RI-1** | **Gabe Amo** | Democratic | U.S. Representative (RI-1) | `Undisciplined` |
| **RI-2** | **Seth Magaziner** | Democratic | U.S. Representative (RI-2) | `Squeaky Clean`, `Polished` |
| **SC-1** | **Nancy Lacore** | Democratic | U.S. Representative (SC-1) | `Rough` |
| **SC-2** | **Joe Wilson** | Republican | U.S. Representative (SC-2) | `Disciplined` |
| **SC-3** | **Sheri Biggs** | Republican | U.S. Representative (SC-3) | `Polished` |
| **SC-4** | **William Timmons** | Republican | U.S. Representative (SC-4) | `Squeaky Clean`, `Established politician`, `Rough` |
| **SC-5** | **Wes Climer** | Republican | U.S. Representative (SC-5) | `Squeaky Clean` |
| **SC-6** | **Jim Clyburn** | Democratic | U.S. Representative (SC-6) | `Established politician`, `Disciplined` |
| **SC-7** | **Russell Fry** | Republican | U.S. Representative (SC-7) | `Squeaky Clean`, `Polished` |
| **SD-1** | **Marty Jackley** | Republican | U.S. Representative (SD-1) | `Squeaky Clean`, `Polished` |
| **TN-1** | **Diana Harshbarger** | Republican | U.S. Representative (TN-1) | `Squeaky Clean`, `Rough` |
| **TN-2** | **Tim Burchett** | Republican | U.S. Representative (TN-2) | `Squeaky Clean`, `Rough` |
| **TN-3** | **Chuck Fleischmann** | Republican | U.S. Representative (TN-3) | `Squeaky Clean`, `Rough` |
| **TN-4** | **Victoria Broderick** | Democratic | U.S. Representative (TN-4) | `Corrupt` |
| **TN-5** | **Charlie Hatcher** | Republican | U.S. Representative (TN-5) | `Corrupt`, `Undisciplined` |
| **TN-6** | **Johnny Garrett** | Republican | U.S. Representative (TN-6) | `Squeaky Clean`, `Polished` |
| **TN-7** | **Matt Van Epps** | Republican | U.S. Representative (TN-7) | `Established politician` |
| **TN-8** | **David Kustoff** | Republican | U.S. Representative (TN-8) | `Corrupt`, `Polished` |
| **TN-9** | **Brent Taylor** | Republican | U.S. Representative (TN-9) | `Established politician`, `Rough` |
| **TX-1** | **Nathaniel Moran** | Republican | U.S. Representative (TX-1) | `Squeaky Clean`, `Rough` |
| **TX-2** | **Steve Toth** | Republican | U.S. Representative (TX-2) | `Disciplined` |
| **TX-3** | **Keith Self** | Republican | U.S. Representative (TX-3) | `Squeaky Clean` |
| **TX-4** | **Pat Fallon** | Republican | U.S. Representative (TX-4) | `Corrupt`, `Established politician`, `Polished` |
| **TX-5** | **Lance Gooden** | Republican | U.S. Representative (TX-5) | `Squeaky Clean`, `Polished` |
| **TX-6** | **Jake Ellzey** | Republican | U.S. Representative (TX-6) | `Established politician`, `Disciplined` |
| **TX-7** | **Lizzie Fletcher** | Democratic | U.S. Representative (TX-7) | `Rough`, `Disciplined` |
| **TX-8** | **Jessica Hart Steinmann** | Republican | U.S. Representative (TX-8) | `Polished`, `Disciplined` |
| **TX-9** | **Leticia Gutierrez** | Democratic | U.S. Representative (TX-9) | `Polished`, `Disciplined` |
| **TX-10** | **Chris Gober** | Republican | U.S. Representative (TX-10) | `Established politician` |
| **TX-11** | **August Pfluger** | Republican | U.S. Representative (TX-11) | `Squeaky Clean` |
| **TX-12** | **Craig Goldman** | Republican | U.S. Representative (TX-12) | `Corrupt`, `Polished` |
| **TX-13** | **Ronny Jackson** | Republican | U.S. Representative (TX-13) | `Squeaky Clean`, `Established politician`, `Rough` |
| **TX-14** | **Randy Weber** | Republican | U.S. Representative (TX-14) | `Rough`, `Undisciplined` |
| **TX-15** | **Bobby Pulido** | Democratic | U.S. Representative (TX-15) | `Rough` |
| **TX-16** | **Veronica Escobar** | Democratic | U.S. Representative (TX-16) | `Corrupt`, `Rough` |
| **TX-17** | **Pete Sessions** | Republican | U.S. Representative (TX-17) | `Rough` |
| **TX-18** | **Christian Menefee** | Democratic | U.S. Representative (TX-18) | `Rough` |
| **TX-19** | **Tom Sell** | Republican | U.S. Representative (TX-19) | `Squeaky Clean` |
| **TX-20** | **Joaquin Castro** | Democratic | U.S. Representative (TX-20) | `Rough`, `Undisciplined` |
| **TX-21** | **Mark Teixeira** | Republican | U.S. Representative (TX-21) | `Rough` |
| **TX-22** | **Trever Nehls** | Republican | U.S. Representative (TX-22) | `Corrupt`, `Polished` |
| **TX-23** | **Katy Padilla Stout** | Democratic | U.S. Representative (TX-23) | `Polished`, `Disciplined` |
| **TX-24** | **Beth Van Duyne** | Republican | U.S. Representative (TX-24) | `Rough` |
| **TX-25** | **Roger Williams** | Republican | U.S. Representative (TX-25) | `Squeaky Clean`, `Polished` |
| **TX-26** | **Brandon Gill** | Republican | U.S. Representative (TX-26) | `Squeaky Clean`, `Rough` |
| **TX-27** | **Michael Cloud** | Republican | U.S. Representative (TX-27) | `Corrupt`, `Polished` |
| **TX-28** | **Henry Cuellar** | Democratic | U.S. Representative (TX-28) | `Corrupt`, `Established politician` |
| **TX-29** | **Sylvia Garcia** | Democratic | U.S. Representative (TX-29) | `Rough` |
| **TX-30** | **Frederick Haynes III** | Democratic | U.S. Representative (TX-30) | `Squeaky Clean`, `Rough` |
| **TX-31** | **John Carter** | Republican | U.S. Representative (TX-31) | `Squeaky Clean`, `Undisciplined` |
| **TX-32** | **Jace Yarbrough** | Republican | U.S. Representative (TX-32) | `Squeaky Clean`, `Rough` |
| **TX-33** | **Colin Allred** | Democratic | U.S. Representative (TX-33) | `Squeaky Clean`, `Polished` |
| **TX-34** | **Vicente Gonzalez** | Democratic | U.S. Representative (TX-34) | `Squeaky Clean`, `Polished` |
| **TX-35** | **Johnny Garcia** | Democratic | U.S. Representative (TX-35) | `Corrupt`, `Established politician`, `Polished` |
| **TX-36** | **Brian Babin** | Republican | U.S. Representative (TX-36) | `Squeaky Clean`, `Rough` |
| **TX-37** | **Greg Casar** | Democratic | U.S. Representative (TX-37) | `Rough`, `Undisciplined` |
| **TX-38** | **Jon Bonck** | Republican | U.S. Representative (TX-38) | `Squeaky Clean`, `Rough` |
| **UT-1** | **Ben McAdams** | Democratic | U.S. Representative (UT-1) | `Corrupt`, `Established politician`, `Polished` |
| **UT-2** | **Blake Moore** | Republican | U.S. Representative (UT-2) | `Rough` |
| **UT-3** | **Celeste Maloy** | Republican | U.S. Representative (UT-3) | `Rough` |
| **UT-4** | **Mike Kennedy** | Republican | U.S. Representative (UT-4) | `Squeaky Clean`, `Polished` |
| **VA-1** | **Shannon Taylor** | Democratic | U.S. Representative (VA-1) | `Corrupt`, `Established politician` |
| **VA-2** | **Elaine Luria** | Democratic | U.S. Representative (VA-2) | `Squeaky Clean`, `Rough` |
| **VA-3** | **Bobby Scott** | Democratic | U.S. Representative (VA-3) | `Corrupt`, `Established politician`, `Rough` |
| **VA-4** | **Jennifer McClellan** | Democratic | U.S. Representative (VA-4) | `Squeaky Clean`, `Rough` |
| **VA-5** | **John McGuire** | Republican | U.S. Representative (VA-5) | `Rough` |
| **VA-6** | **Ben Cline** | Republican | U.S. Representative (VA-6) | `Squeaky Clean`, `Polished` |
| **VA-7** | **Eugene Vindman** | Democratic | U.S. Representative (VA-7) | `Squeaky Clean`, `Polished` |
| **VA-8** | **Don Beyer** | Democratic | U.S. Representative (VA-8) | `Polished`, `Disciplined` |
| **VA-9** | **Morgan Griffith** | Republican | U.S. Representative (VA-9) | `Corrupt`, `Rough` |
| **VA-10** | **Suhas Subramanyam** | Democratic | U.S. Representative (VA-10) | `Undisciplined` |
| **VA-11** | **James Walkinshaw** | Democratic | U.S. Representative (VA-11) | `Corrupt` |
| **VT-1** | **Becca Balint** | Democratic | U.S. Representative (VT-1) | `Polished`, `Disciplined` |
| **WA-1** | **Suzan DelBene** | Democratic | U.S. Representative (WA-1) | `Squeaky Clean`, `Polished` |
| **WA-2** | **Rick Larsen** | Democratic | U.S. Representative (WA-2) | `Rough` |
| **WA-3** | **Marie Gluesenkamp Perez** | Democratic | U.S. Representative (WA-3) | `Rough`, `Rising Star` |
| **WA-4** | **Amanda McKinney** | Republican | U.S. Representative (WA-4) | `Squeaky Clean` |
| **WA-5** | **Michael Baumgartner** | Republican | U.S. Representative (WA-5) | `Corrupt`, `Polished` |
| **WA-6** | **Emily Randall** | Democratic | U.S. Representative (WA-6) | `Squeaky Clean` |
| **WA-7** | **Pramila Jayapal** | Democratic | U.S. Representative (WA-7) | `Established politician`, `Rough` |
| **WA-8** | **Kim Schrier** | Democratic | U.S. Representative (WA-8) | `Corrupt`, `Disciplined` |
| **WA-9** | **Adam Smith** | Democratic | U.S. Representative (WA-9) | `Squeaky Clean` |
| **WA-10** | **Marilyn Strickland** | Democratic | U.S. Representative (WA-10) | `Undisciplined` |
| **WI-1** | **Mitchell Berman** | Democratic | U.S. Representative (WI-1) | `Squeaky Clean`, `Polished` |
| **WI-2** | **Mark Pocan** | Democratic | U.S. Representative (WI-2) | `Rough` |
| **WI-3** | **Rebecca Cooke** | Democratic | U.S. Representative (WI-3) | `Corrupt`, `Polished` |
| **WI-4** | **Gwen Moore** | Democratic | U.S. Representative (WI-4) | `Established politician`, `Disciplined` |
| **WI-5** | **Scott Fitzgerald** | Republican | U.S. Representative (WI-5) | `Squeaky Clean`, `Rough` |
| **WI-6** | **Glenn Grothman** | Republican | U.S. Representative (WI-6) | `Established politician` |
| **WI-7** | **Michael Alfonso** | Republican | U.S. Representative (WI-7) | `Corrupt`, `Polished` |
| **WI-8** | **Tony Wied** | Republican | U.S. Representative (WI-8) | `Corrupt`, `Rough` |
| **WV-1** | **Carol Miller** | Republican | U.S. Representative (WV-1) | `Established politician`, `Polished` |
| **WV-2** | **Riley Moore** | Republican | U.S. Representative (WV-2) | `Squeaky Clean`, `Polished` |
| **WY-1** | **Chuck Gray** | Republican | U.S. Representative (WY-1) | `Rough` |

---
*End of Politician Traits Specification Document. Maintained for Coalition Builder: Party Chair.*
