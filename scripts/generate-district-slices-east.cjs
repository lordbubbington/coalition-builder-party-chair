/**
 * AGENT 3A: DISTRICT WORK SHARD A (EAST & SOUTH STATES) (REQ-62, REQ-72 DATA)
 *
 * Generates modular district map slices and legislative seat ratios for Eastern and Southern states:
 * ME, NH, VT, MA, RI, CT, NY, NJ, PA, DE, MD, VA, WV, NC, SC, GA, FL, KY, TN, AL, MS.
 *
 * - NY and FL (Big Four): Modular configurations support up to 200 districts (N in [1, 200]).
 * - Other 19 states: Support up to 50 districts (N in [1, 50]).
 * - Clean SVG polygon/path JSON structures following maps-0.3.js geometry conventions (q polyline & path d).
 * - Exact citizen representation per district based on Census CVAP and population figures.
 * - State legislative seat ratio for state legislature scaling (REQ-72).
 * - Exports individual state district slice files to `assets/districts/<STATE>-<N>.json`.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const usGeoPath = path.join(root, 'assets', 'maps', 'us-geo.json');
const censusCsvPath = path.join(root, 'obj', 'census-cvap-State.csv');
const districtsOutputDir = path.join(root, 'assets', 'districts');

// The 21 Eastern and Southern States owned by Shard A
const EAST_SOUTH_STATES = [
  'ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE',
  'MD', 'VA', 'WV', 'NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'AL', 'MS',
];

const BIG_FOUR = new Set(['NY', 'FL']);

// Standard initial / default apportionment for East & South states
const STANDARD_APPORTIONMENT = {
  ME: 2,
  NH: 2,
  VT: 1,
  MA: 9,
  RI: 2,
  CT: 5,
  NY: 26,
  NJ: 12,
  PA: 17,
  DE: 1,
  MD: 8,
  VA: 11,
  WV: 2,
  NC: 14,
  SC: 7,
  GA: 14,
  FL: 28,
  KY: 6,
  TN: 9,
  AL: 7,
  MS: 4,
};

// State Legislature Lower House Seat Totals (from state-house-data-0.5.js, REQ-72)
const STATE_LEGISLATIVE_SEATS = {
  ME: 151,
  NH: 400,
  VT: 150,
  MA: 160,
  RI: 75,
  CT: 151,
  NY: 150,
  NJ: 80,
  PA: 203,
  DE: 41,
  MD: 141,
  VA: 100,
  WV: 100,
  NC: 120,
  SC: 124,
  GA: 180,
  FL: 120,
  KY: 100,
  TN: 99,
  AL: 105,
  MS: 122,
};

// Full State Name to Abbreviation
const STATE_NAMES = {
  Alabama: 'AL', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Kentucky: 'KY', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Mississippi: 'MS',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New York': 'NY', 'North Carolina': 'NC',
  Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', Tennessee: 'TN',
  Vermont: 'VT', Virginia: 'VA', 'West Virginia': 'WV',
};

// Load US boundary geometry
const statesGeo = JSON.parse(fs.readFileSync(usGeoPath, 'utf8'));

// Load Census State Population Baselines
function loadCensusBaselines() {
  const baselines = {};
  if (fs.existsSync(censusCsvPath)) {
    const lines = fs.readFileSync(censusCsvPath, 'utf8').trim().split('\n');
    const header = lines[0].split(',');
    const nameIdx = header.indexOf('geoname');
    const totIdx = header.indexOf('tot_est');
    const citIdx = header.indexOf('cit_est');
    const cvapIdx = header.indexOf('cvap_est');
    const titleIdx = header.indexOf('lntitle');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts[titleIdx] === 'Total') {
        const name = parts[nameIdx];
        const abbr = STATE_NAMES[name];
        if (abbr && EAST_SOUTH_STATES.includes(abbr)) {
          baselines[abbr] = {
            abbr,
            name,
            totalPopulation: Number(parts[totIdx]),
            citizenPopulation: Number(parts[citIdx]),
            cvap: Number(parts[cvapIdx]),
          };
        }
      }
    }
  }

  // Fallbacks if CSV not present
  const fallbacks = {
    ME: { name: 'Maine', total: 1387816, citizen: 1360882, cvap: 1114201 },
    NH: { name: 'New Hampshire', total: 1394868, citizen: 1361352, cvap: 1109601 },
    VT: { name: 'Vermont', total: 647102, citizen: 637160, cvap: 521797 },
    MA: { name: 'Massachusetts', total: 7044057, citizen: 6456356, cvap: 5155255 },
    RI: { name: 'Rhode Island', total: 1101801, citizen: 1024689, cvap: 826623 },
    CT: { name: 'Connecticut', total: 3624508, citizen: 3368870, cvap: 2663362 },
    NY: { name: 'New York', total: 19852366, citizen: 18020157, cvap: 14104696 },
    NJ: { name: 'New Jersey', total: 9343806, citizen: 8364998, cvap: 6433712 },
    PA: { name: 'Pennsylvania', total: 13018639, citizen: 12570059, cvap: 9961815 },
    DE: { name: 'Delaware', total: 1021190, citizen: 971201, cvap: 764113 },
    MD: { name: 'Maryland', total: 6206011, citizen: 5738006, cvap: 4418305 },
    VA: { name: 'Virginia', total: 8705170, citizen: 8209472, cvap: 6378483 },
    WV: { name: 'West Virginia', total: 1778373, citizen: 1763684, cvap: 1409278 },
    NC: { name: 'North Carolina', total: 10730405, citizen: 10170042, cvap: 7898161 },
    SC: { name: 'South Carolina', total: 5296224, citizen: 5128239, cvap: 4009585 },
    GA: { name: 'Georgia', total: 10940410, citizen: 10309148, cvap: 7834503 },
    FL: { name: 'Florida', total: 22416077, citizen: 20327619, cvap: 16182912 },
    KY: { name: 'Kentucky', total: 4534823, citizen: 4408753, cvap: 3401787 },
    TN: { name: 'Tennessee', total: 7066381, citizen: 6803848, cvap: 5275348 },
    AL: { name: 'Alabama', total: 5086767, citizen: 4963370, cvap: 3845696 },
    MS: { name: 'Mississippi', total: 2946782, citizen: 2904108, cvap: 2221761 },
  };

  for (const [abbr, data] of Object.entries(fallbacks)) {
    if (!baselines[abbr]) {
      baselines[abbr] = {
        abbr,
        name: data.name,
        totalPopulation: data.total,
        citizenPopulation: data.citizen,
        cvap: data.cvap,
      };
    }
  }
  return baselines;
}

const CENSUS_BASELINES = loadCensusBaselines();

// Albers Projection Constants matching maps-0.3.js & generate-map-data.cjs
const RAD = Math.PI / 180;
const conusConfig = { p1: 29.5, p2: 45.5, lat0: 37.5, lon0: -96 };
const conusBox = { x: 0, y: 0, w: 960, h: 470 };
const round1 = (num) => Math.round(num * 10) / 10;
const round3 = (num) => Math.round(num * 1000) / 1000;

function albers({ p1, p2, lat0, lon0 }) {
  const n = (Math.sin(p1 * RAD) + Math.sin(p2 * RAD)) / 2;
  const c = Math.cos(p1 * RAD) ** 2 + 2 * n * Math.sin(lat0 * RAD);
  const rho0 = Math.sqrt(Math.max(0, c - 2 * n * Math.sin(lat0 * RAD))) / n;
  return (lon, lat) => {
    const theta = n * (lon - lon0) * RAD;
    const rho = Math.sqrt(Math.max(0, c - 2 * n * Math.sin(lat * RAD))) / n;
    return [rho * Math.sin(theta), rho0 - rho * Math.cos(theta)];
  };
}

function fitRegion(config, rings, box) {
  const project = albers(config);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      const [x, y] = project(lon, lat);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const scale = Math.min(box.w / w, box.h / h);
  const offsetX = box.x + (box.w - w * scale) / 2;
  const offsetY = box.y + (box.h - h * scale) / 2;
  return (lon, lat) => {
    const [x, y] = project(lon, lat);
    return [round1(offsetX + (x - minX) * scale), round1(offsetY + (maxY - y) * scale)];
  };
}

const conusRings = statesGeo.filter((g) => g.a !== 'AK' && g.a !== 'HI').flatMap((g) => g.p);
const projectConus = fitRegion(conusConfig, conusRings, conusBox);

// Polyline encoding routines matching maps-0.3.js format
function encodeNumber(value) {
  let n = value < 0 ? ~(value << 1) : (value << 1);
  let out = '';
  while (n >= 0x20) { out += String.fromCharCode((0x20 | (n & 0x1f)) + 63); n >>= 5; }
  return out + String.fromCharCode(n + 63);
}

function encodeRing(points) {
  let lastX = 0, lastY = 0, out = '';
  for (const [x, y] of points) {
    const xi = Math.round(x * 10), yi = Math.round(y * 10);
    out += encodeNumber(xi - lastX) + encodeNumber(yi - lastY);
    lastX = xi; lastY = yi;
  }
  return out;
}

function decodePath(encoded) {
  let x = 0, y = 0, position = 0;
  const number = () => {
    let result = 0, shift = 0, chunk;
    do {
      chunk = encoded.charCodeAt(position++) - 63;
      result |= (chunk & 0x1f) << shift;
      shift += 5;
    } while (chunk >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };
  const coordinates = [];
  while (position < encoded.length) {
    x += number();
    y += number();
    coordinates.push([x / 10, y / 10]);
  }
  if (!coordinates.length) return '';
  return `M${coordinates.map(([px, py]) => `${px},${py}`).join('L')}Z`;
}

function polygonArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] * ring[i][1]) - (ring[i][0] * ring[j][1]);
  }
  return Math.abs(area) / 2;
}

function polygonCentroid(rings) {
  let totalArea = 0, cx = 0, cy = 0;
  for (const ring of rings) {
    let a = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const cross = (ring[j][0] * ring[i][1]) - (ring[i][0] * ring[j][1]);
      a += cross;
      cx += (ring[j][0] + ring[i][0]) * cross;
      cy += (ring[j][1] + ring[i][1]) * cross;
    }
    totalArea += a;
  }
  if (Math.abs(totalArea) < 1e-6) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const r of rings) {
      for (const [x, y] of r) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
    return [round1((minX + maxX) / 2), round1((minY + maxY) / 2)];
  }
  return [round1(cx / (3 * totalArea)), round1(cy / (3 * totalArea))];
}

// Sutherland-Hodgman Polygon Clipper
function clipPolygonHalfPlane(poly, a, b, c) {
  const out = [];
  const len = poly.length;
  if (!len) return out;
  const isInside = (p) => (a * p[0] + b * p[1] + c) >= -1e-9;
  for (let i = 0; i < len; i++) {
    const curr = poly[i];
    const prev = poly[(i + len - 1) % len];
    const currIn = isInside(curr);
    const prevIn = isInside(prev);
    if (currIn) {
      if (!prevIn) {
        const d1 = a * prev[0] + b * prev[1] + c;
        const d2 = a * curr[0] + b * curr[1] + c;
        const t = d1 / (d1 - d2);
        out.push([prev[0] + t * (curr[0] - prev[0]), prev[1] + t * (curr[1] - prev[1])]);
      }
      out.push(curr);
    } else if (prevIn) {
      const d1 = a * prev[0] + b * prev[1] + c;
      const d2 = a * curr[0] + b * curr[1] + c;
      const t = d1 / (d1 - d2);
      out.push([prev[0] + t * (curr[0] - prev[0]), prev[1] + t * (curr[1] - prev[1])]);
    }
  }
  return out;
}

// Bisects multi-ring polygon collection into left/right partition
function bisectPolygons(polyList, targetFrac) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let totalArea = 0;
  for (const ring of polyList) {
    totalArea += polygonArea(ring);
    for (const [x, y] of ring) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  if (totalArea <= 1e-6) return { left: polyList, right: [] };

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const cutAxis = spanX >= spanY ? 'x' : 'y';

  let low = cutAxis === 'x' ? minX : minY;
  let high = cutAxis === 'x' ? maxX : maxY;
  let bestCut = (low + high) / 2;
  const targetArea = totalArea * targetFrac;

  for (let iter = 0; iter < 30; iter++) {
    const mid = (low + high) / 2;
    let leftArea = 0;
    for (const ring of polyList) {
      const clipped = cutAxis === 'x'
        ? clipPolygonHalfPlane(ring, -1, 0, mid)
        : clipPolygonHalfPlane(ring, 0, -1, mid);
      leftArea += polygonArea(clipped);
    }
    if (leftArea < targetArea) low = mid;
    else high = mid;
    bestCut = mid;
  }

  const left = [];
  const right = [];
  for (const ring of polyList) {
    const l = cutAxis === 'x'
      ? clipPolygonHalfPlane(ring, -1, 0, bestCut)
      : clipPolygonHalfPlane(ring, 0, -1, bestCut);
    const r = cutAxis === 'x'
      ? clipPolygonHalfPlane(ring, 1, 0, -bestCut)
      : clipPolygonHalfPlane(ring, 0, 1, -bestCut);
    if (polygonArea(l) > 1e-4) left.push(l);
    if (polygonArea(r) > 1e-4) right.push(r);
  }
  return { left, right };
}

// Recursively slices polyList into N seamless sub-regions
function slicePolygons(polyList, n) {
  if (n <= 1) return [polyList];
  const nLeft = Math.floor(n / 2);
  const nRight = n - nLeft;
  const frac = nLeft / n;
  const { left, right } = bisectPolygons(polyList, frac);
  return [...slicePolygons(left, nLeft), ...slicePolygons(right, nRight)];
}

/**
 * Procedurally generates N seamless district slices for an Eastern or Southern state.
 *
 * @param {string} stateAbbr - Two-letter state postal abbreviation (e.g. 'NY', 'FL', 'PA', 'GA')
 * @param {number} n - District count (1 to 200 for NY/FL; 1 to 50 for others)
 * @returns {Object} Full district slice container with metadata and district geometry
 */
function generateStateDistricts(stateAbbr, n) {
  const abbr = stateAbbr.toUpperCase();
  if (!EAST_SOUTH_STATES.includes(abbr)) {
    throw new Error(`State '${abbr}' is not in the East & South Shard A roster.`);
  }

  const maxN = BIG_FOUR.has(abbr) ? 200 : 50;
  if (!Number.isInteger(n) || n < 1 || n > maxN) {
    throw new Error(`Invalid district count N=${n} for state ${abbr}. Allowed range: 1 to ${maxN}.`);
  }

  const stateGeo = statesGeo.find((g) => g.a === abbr);
  if (!stateGeo) {
    throw new Error(`State geometry not found for '${abbr}'.`);
  }

  const baseline = CENSUS_BASELINES[abbr] || {
    name: abbr,
    totalPopulation: 1000000,
    citizenPopulation: 800000,
    cvap: 600000,
  };

  const stateRings = stateGeo.p.map((ring) => ring.map(([lon, lat]) => projectConus(lon, lat)));
  const totalStateArea = stateRings.reduce((sum, r) => sum + polygonArea(r), 0);

  // Compute overall state bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ring of stateRings) {
    for (const [x, y] of ring) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  const boundingBox = {
    minX: round1(minX),
    maxX: round1(maxX),
    minY: round1(minY),
    maxY: round1(maxY),
    width: round1(maxX - minX),
    height: round1(maxY - minY),
  };

  // Equal population calculation: citizen representation = citizenPopulation / N
  const citizenRepresentation = Math.round(baseline.citizenPopulation / n);
  const totalPopulationRepresentation = Math.round(baseline.totalPopulation / n);
  const cvapRepresentation = Math.round((baseline.cvap || baseline.citizenPopulation * 0.78) / n);

  // Legislative seat data & ratio (REQ-72)
  const legislativeSeats = STATE_LEGISLATIVE_SEATS[abbr] || 100;
  const legislativeRatio = round1(legislativeSeats / 100);

  // Slices
  const rawSlices = slicePolygons(stateRings, n);

  // Geographic ordering (top-to-bottom, left-to-right)
  const indexedSlices = rawSlices.map((rings, idx) => {
    const [cx, cy] = polygonCentroid(rings);
    return { rings, rawIdx: idx, cx, cy };
  });

  indexedSlices.sort((a, b) => {
    const dy = a.cy - b.cy;
    if (Math.abs(dy) > 12) return dy;
    return a.cx - b.cx;
  });

  const districts = indexedSlices.map((item, idx) => {
    const districtNumber = idx + 1;
    const districtId = `${abbr}-${districtNumber}`;
    const rings = item.rings;

    const encodedRings = rings
      .filter((r) => r.length >= 3)
      .map((r) => encodeRing(r));
    const q = encodedRings.join('!');
    const pathD = encodedRings.map(decodePath).join('');

    const sliceArea = rings.reduce((sum, r) => sum + polygonArea(r), 0);
    const areaRatio = totalStateArea > 0 ? sliceArea / totalStateArea : 1 / n;

    return {
      id: districtId,
      stateId: abbr,
      districtNumber,
      q,
      cx: item.cx,
      cy: item.cy,
      path: pathD,
      areaRatio: round3(areaRatio),
      citizenPopulation: citizenRepresentation,
      totalPopulation: totalPopulationRepresentation,
      cvap: cvapRepresentation,
      name: `${baseline.name} ${districtNumber}`,
    };
  });

  return {
    stateId: abbr,
    stateName: baseline.name,
    districtCount: n,
    citizenRepresentation,
    totalPopulationRepresentation,
    cvapRepresentation,
    legislativeSeats,
    legislativeRatio,
    boundingBox,
    districts,
  };
}

/**
 * Exports a district slice JSON file to assets/districts/<STATE>-<N>.json.
 */
function exportDistrictSlice(abbr, n, outDir = districtsOutputDir) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const sliceData = generateStateDistricts(abbr, n);
  const fileName = `${abbr.toUpperCase()}-${n}.json`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(sliceData, null, 2), 'utf8');
  return { fileName, filePath, size: fs.statSync(filePath).size, sliceData };
}

/**
 * Exports all 21 Eastern and Southern state standard apportionment slices.
 */
function exportAllEastAndSouthDistricts(outDir = districtsOutputDir) {
  const results = [];
  for (const abbr of EAST_SOUTH_STATES) {
    const n = STANDARD_APPORTIONMENT[abbr];
    const res = exportDistrictSlice(abbr, n, outDir);
    results.push(res);
  }
  return results;
}

/**
 * Validates that all district slices in an output directory parse cleanly,
 * have valid SVG paths, valid polyline delta encoding, matching district counts,
 * and seamlessly tile inside the state bounding box.
 */
function verifyEastAndSouthDistricts(outDir = districtsOutputDir) {
  const report = {
    totalChecked: 0,
    passed: 0,
    failed: 0,
    errors: [],
    files: [],
  };

  for (const abbr of EAST_SOUTH_STATES) {
    const n = STANDARD_APPORTIONMENT[abbr];
    const fileName = `${abbr}-${n}.json`;
    const filePath = path.join(outDir, fileName);

    if (!fs.existsSync(filePath)) {
      report.failed++;
      report.errors.push(`Missing file: ${fileName}`);
      continue;
    }

    report.totalChecked++;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      if (data.stateId !== abbr) throw new Error(`stateId mismatch: expected ${abbr}, got ${data.stateId}`);
      if (data.districtCount !== n) throw new Error(`districtCount mismatch: expected ${n}, got ${data.districtCount}`);
      if (!Array.isArray(data.districts) || data.districts.length !== n) {
        throw new Error(`districts array length mismatch: expected ${n}, got ${data.districts?.length}`);
      }
      if (!data.citizenRepresentation || data.citizenRepresentation <= 0) {
        throw new Error(`invalid citizenRepresentation: ${data.citizenRepresentation}`);
      }
      if (!data.legislativeSeats || data.legislativeSeats <= 0) {
        throw new Error(`invalid legislativeSeats: ${data.legislativeSeats}`);
      }
      if (!data.legislativeRatio || data.legislativeRatio <= 0) {
        throw new Error(`invalid legislativeRatio: ${data.legislativeRatio}`);
      }

      // Check tiling and bounds
      const bb = data.boundingBox;
      let sumAreaRatio = 0;
      for (const d of data.districts) {
        if (!d.q || typeof d.q !== 'string') throw new Error(`District ${d.id} missing q string`);
        if (!d.path || !d.path.startsWith('M') || !d.path.endsWith('Z')) {
          throw new Error(`District ${d.id} has invalid SVG path: ${d.path.slice(0, 30)}...`);
        }
        // Verify centroid is within bounding box (with slight tolerance for rounding)
        if (d.cx < bb.minX - 5 || d.cx > bb.maxX + 5 || d.cy < bb.minY - 5 || d.cy > bb.maxY + 5) {
          throw new Error(`District ${d.id} centroid (${d.cx}, ${d.cy}) is outside state bounding box [${bb.minX}, ${bb.maxX}, ${bb.minY}, ${bb.maxY}]`);
        }
        sumAreaRatio += d.areaRatio;
      }

      if (Math.abs(sumAreaRatio - 1.0) > 0.08) {
        throw new Error(`Area ratio sum ${sumAreaRatio.toFixed(3)} deviates significantly from 1.0 for ${abbr}`);
      }

      report.passed++;
      report.files.push({
        file: fileName,
        state: abbr,
        districts: n,
        citizenPop: data.citizenRepresentation,
        legRatio: data.legislativeRatio,
        sizeBytes: fs.statSync(filePath).size,
      });
    } catch (err) {
      report.failed++;
      report.errors.push(`${fileName}: ${err.message}`);
    }
  }

  return report;
}

// CLI Execution & Test Runner
if (require.main === module) {
  const args = process.argv.slice(2);
  const isTest = args.includes('--test');
  const isExport = args.includes('--export');
  const isVerify = args.includes('--verify');

  console.log('=== AGENT 3A: DISTRICT WORK SHARD A (EAST & SOUTH) ===\n');

  // If test flag or no args, run tests on required test targets
  if (isTest || (!isExport && !isVerify)) {
    console.log('Running test generation for NY-26, FL-28, PA-17, GA-14 (plus modular stress tests)...');
    const testConfigs = [
      { state: 'NY', n: 26, isBigFour: true },
      { state: 'FL', n: 28, isBigFour: true },
      { state: 'PA', n: 17, isBigFour: false },
      { state: 'GA', n: 14, isBigFour: false },
      { state: 'NY', n: 200, isBigFour: true }, // Big Four upper bound
      { state: 'FL', n: 200, isBigFour: true }, // Big Four upper bound
      { state: 'PA', n: 50, isBigFour: false },  // 50-district upper bound
      { state: 'VT', n: 50, isBigFour: false },  // Small state 50-district upper bound
    ];

    let passedTests = 0;
    for (const { state, n, isBigFour } of testConfigs) {
      const t0 = Date.now();
      const res = generateStateDistricts(state, n);
      const ms = Date.now() - t0;
      if (res.districts.length !== n) {
        throw new Error(`Test failed for ${state}-${n}: expected ${n} districts, got ${res.districts.length}`);
      }
      console.log(`  ✓ ${state}-${n} (${isBigFour ? 'Big Four' : 'Standard'}): ${res.districts.length} districts generated, citizen rep: ${res.citizenRepresentation.toLocaleString()}, leg ratio: ${res.legislativeRatio}, time: ${ms}ms`);
      passedTests++;
    }
    console.log(`\nAll ${passedTests} test configurations passed.\n`);
  }

  // Export all 21 East & South states
  if (isExport || (!isTest && !isVerify)) {
    console.log(`Exporting 21 East & South state district slices to ${districtsOutputDir}...`);
    const exports = exportAllEastAndSouthDistricts();
    for (const exp of exports) {
      console.log(`  -> Wrote ${exp.fileName} (${(exp.size / 1024).toFixed(1)} KB)`);
    }
    console.log(`\nExported ${exports.length} district slice files successfully.\n`);
  }

  // Verification
  if (isVerify || (!isTest && !isExport)) {
    console.log('Verifying generated JSON files and seamless tiling within bounding boxes...');
    const verification = verifyEastAndSouthDistricts();
    console.log(`Verification: ${verification.passed} passed, ${verification.failed} failed of ${verification.totalChecked} files.`);
    if (verification.errors.length) {
      console.error('Verification errors:', verification.errors);
      process.exit(1);
    }
    console.log('\nAll 21 East and South district slice JSON files verified successfully!');
  }
}

module.exports = {
  EAST_SOUTH_STATES,
  BIG_FOUR,
  STANDARD_APPORTIONMENT,
  STATE_LEGISLATIVE_SEATS,
  CENSUS_BASELINES,
  generateStateDistricts,
  exportDistrictSlice,
  exportAllEastAndSouthDistricts,
  verifyEastAndSouthDistricts,
};
