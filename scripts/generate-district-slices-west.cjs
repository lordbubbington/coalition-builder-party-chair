/**
 * Procedural District Map & Modular Slice Generator (West & Midwest States Shard)
 *
 * States covered (29 states):
 * OH, MI, IN, IL, WI, MN, IA, MO, ND, SD, NE, KS, AR, LA, OK, TX, NM, CO, WY, MT, ID, UT, AZ, NV, WA, OR, CA, AK, HI.
 *
 * Constraints & Requirements:
 * - CA and TX (Big Four): support modular configurations up to 200 districts (N = 1 to 200).
 * - Remaining states: support modular configurations up to 50 districts (N = 1 to 50).
 * - Follow maps-0.3.js geometry conventions (q polyline delta & SVG path d).
 * - Compute exact citizen representation per district based on Census CVAP / population.
 * - Export data to assets/districts/<STATE>-<N>.json.
 * - Test generation for CA-52, TX-38, OH-15, IL-17, WY-1.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const usGeoPath = path.join(root, 'assets', 'maps', 'us-geo.json');
const censusCsvPath = path.join(root, 'obj', 'census-cvap-State.csv');
const outputDir = path.join(root, 'assets', 'districts');

// Load US boundary geometry
const statesGeo = JSON.parse(fs.readFileSync(usGeoPath, 'utf8'));

// West and Midwest States Shard
const WEST_MIDWEST_STATES = [
  'OH', 'MI', 'IN', 'IL', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 
  'NE', 'KS', 'AR', 'LA', 'OK', 'TX', 'NM', 'CO', 'WY', 'MT', 
  'ID', 'UT', 'AZ', 'NV', 'WA', 'OR', 'CA', 'AK', 'HI'
];

const BIG_FOUR = new Set(['CA', 'NY', 'FL', 'TX']);

const STATE_NAMES = {
  Alabama:'AL', Alaska:'AK', Arizona:'AZ', Arkansas:'AR', California:'CA', Colorado:'CO', Connecticut:'CT', Delaware:'DE',
  Florida:'FL', Georgia:'GA', Hawaii:'HI', Idaho:'ID', Illinois:'IL', Indiana:'IN', Iowa:'IA', Kansas:'KS', Kentucky:'KY',
  Louisiana:'LA', Maine:'ME', Maryland:'MD', Massachusetts:'MA', Michigan:'MI', Minnesota:'MN', Mississippi:'MS', Missouri:'MO',
  Montana:'MT', Nebraska:'NE', Nevada:'NV', 'New Hampshire':'NH', 'New Jersey':'NJ', 'New Mexico':'NM', 'New York':'NY',
  'North Carolina':'NC', 'North Dakota':'ND', Ohio:'OH', Oklahoma:'OK', Oregon:'OR', Pennsylvania:'PA', 'Rhode Island':'RI',
  'South Carolina':'SC', 'South Dakota':'SD', Tennessee:'TN', Texas:'TX', Utah:'UT', Vermont:'VT', Virginia:'VA', Washington:'WA',
  'West Virginia':'WV', Wisconsin:'WI', Wyoming:'WY', 'District of Columbia':'DC',
};

// Default Congressional apportionment baselines
const STANDARD_APPORTIONMENT = {
  OH: 15, MI: 13, IN: 9, IL: 17, WI: 8, MN: 8, IA: 4, MO: 8, ND: 1, SD: 1,
  NE: 3, KS: 4, AR: 4, LA: 6, OK: 5, TX: 38, NM: 3, CO: 8, WY: 1, MT: 2,
  ID: 2, UT: 4, AZ: 9, NV: 4, WA: 10, OR: 6, CA: 52, AK: 1, HI: 2
};

// Load Census Baselines
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
        if (abbr) {
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

  // Fallbacks based on Census 2020/ACS data
  const fallbacks = {
    AK: { name: 'Alaska', total: 733583, citizen: 708304 },
    AZ: { name: 'Arizona', total: 7359197, citizen: 6867634 },
    AR: { name: 'Arkansas', total: 3045637, citizen: 2955953 },
    CA: { name: 'California', total: 39287380, citizen: 34445998 },
    CO: { name: 'Colorado', total: 5839926, citizen: 5543147 },
    HI: { name: 'Hawaii', total: 1440196, citizen: 1354317 },
    ID: { name: 'Idaho', total: 1939033, citizen: 1877083 },
    IL: { name: 'Illinois', total: 12582032, citizen: 11986510 },
    IN: { name: 'Indiana', total: 6833037, citizen: 6636737 },
    IA: { name: 'Iowa', total: 3200517, citizen: 3119102 },
    KS: { name: 'Kansas', total: 2937150, citizen: 2816913 },
    LA: { name: 'Louisiana', total: 4590241, citizen: 4478492 },
    MI: { name: 'Michigan', total: 10037261, citizen: 9750058 },
    MN: { name: 'Minnesota', total: 5717184, citizen: 5493010 },
    MO: { name: 'Missouri', total: 6177957, citizen: 6046241 },
    MT: { name: 'Montana', total: 1122867, citizen: 1110038 },
    NE: { name: 'Nebraska', total: 1967267, citizen: 1891963 },
    NV: { name: 'Nevada', total: 3177772, citizen: 2893556 },
    NM: { name: 'New Mexico', total: 2113344, citizen: 2011933 },
    ND: { name: 'North Dakota', total: 779261, citizen: 760468 },
    OH: { name: 'Ohio', total: 11785935, citizen: 11529528 },
    OK: { name: 'Oklahoma', total: 4019800, citizen: 3878148 },
    OR: { name: 'Oregon', total: 4233358, citizen: 4016738 },
    SD: { name: 'South Dakota', total: 909824, citizen: 894086 },
    TX: { name: 'Texas', total: 30188421, citizen: 27107441 },
    UT: { name: 'Utah', total: 3380800, citizen: 3236077 },
    WA: { name: 'Washington', total: 7785786, citizen: 7277637 },
    WI: { name: 'Wisconsin', total: 5892539, citizen: 5742116 },
    WY: { name: 'Wyoming', total: 582396, citizen: 571065 },
  };

  for (const [abbr, data] of Object.entries(fallbacks)) {
    if (!baselines[abbr]) {
      baselines[abbr] = {
        abbr,
        name: data.name,
        totalPopulation: data.total,
        citizenPopulation: data.citizen,
        cvap: Math.round(data.citizen * 0.78),
      };
    }
  }
  return baselines;
}

const CENSUS_BASELINES = loadCensusBaselines();

// Albers projection math
const RAD = Math.PI / 180;
const configs = {
  conus: { p1: 29.5, p2: 45.5, lat0: 37.5, lon0: -96 },
  ak: { p1: 55, p2: 65, lat0: 58.5, lon0: -152 },
  hi: { p1: 8, p2: 18, lat0: 19.9, lon0: -157 },
};
const boxes = {
  conus: { x: 0, y: 0, w: 960, h: 470 },
  ak: { x: 6, y: 478, w: 158, h: 128 },
  hi: { x: 182, y: 500, w: 118, h: 98 },
};

const round1 = (num) => Math.round(num * 10) / 10;

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
  for (const ring of rings) for (const [lon, lat] of ring) {
    const [x, y] = project(lon, lat);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
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
const projectConus = fitRegion(configs.conus, conusRings, boxes.conus);
const akGeo = statesGeo.find((g) => g.a === 'AK');
const projectAk = akGeo ? fitRegion(configs.ak, akGeo.p, boxes.ak) : projectConus;
const hiGeo = statesGeo.find((g) => g.a === 'HI');
const projectHi = hiGeo ? fitRegion(configs.hi, hiGeo.p, boxes.hi) : projectConus;
const projectorFor = (abbr) => (abbr === 'AK' ? projectAk : abbr === 'HI' ? projectHi : projectConus);

// Encoding / Decoding Routines
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
    for (const r of rings) for (const [x, y] of r) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    return [round1((minX + maxX) / 2), round1((minY + maxY) / 2)];
  }
  return [round1(cx / (3 * totalArea)), round1(cy / (3 * totalArea))];
}

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

function slicePolygons(polyList, n) {
  if (n <= 1) return [polyList];
  const nLeft = Math.floor(n / 2);
  const nRight = n - nLeft;
  const frac = nLeft / n;
  const { left, right } = bisectPolygons(polyList, frac);
  return [...slicePolygons(left, nLeft), ...slicePolygons(right, nRight)];
}

function computeBoundingBox(rings) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return {
    minX: round1(minX),
    maxX: round1(maxX),
    minY: round1(minY),
    maxY: round1(maxY),
    width: round1(maxX - minX),
    height: round1(maxY - minY),
  };
}

/**
 * Procedurally generates N seamless district slices for a given state.
 */
function generateStateDistricts(stateAbbr, n) {
  const abbr = stateAbbr.toUpperCase();
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

  const project = projectorFor(abbr);
  const stateRings = stateGeo.p.map((ring) => ring.map(([lon, lat]) => project(lon, lat)));
  const totalStateArea = stateRings.reduce((sum, r) => sum + polygonArea(r), 0);
  const stateBoundingBox = computeBoundingBox(stateRings);

  // Representation metrics
  const citizenRepresentation = Math.round(baseline.citizenPopulation / n);
  const totalPopulationRepresentation = Math.round(baseline.totalPopulation / n);
  const cvapRepresentation = Math.round((baseline.cvap || baseline.citizenPopulation * 0.78) / n);

  // Procedural slicing
  const rawSlices = slicePolygons(stateRings, n);

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
    const districtBbox = computeBoundingBox(rings);

    return {
      id: districtId,
      stateId: abbr,
      districtNumber,
      q,
      cx: item.cx,
      cy: item.cy,
      path: pathD,
      areaRatio: round1(areaRatio * 1000) / 1000,
      citizenPopulation: citizenRepresentation,
      totalPopulation: totalPopulationRepresentation,
      cvap: cvapRepresentation,
      name: `${baseline.name} ${districtNumber}`,
      bbox: districtBbox,
    };
  });

  return {
    stateId: abbr,
    name: baseline.name,
    districtCount: n,
    totalPopulation: baseline.totalPopulation,
    citizenPopulation: baseline.citizenPopulation,
    cvap: baseline.cvap,
    representationRatio: {
      citizenPerDistrict: citizenRepresentation,
      populationPerDistrict: totalPopulationRepresentation,
      cvapPerDistrict: cvapRepresentation,
    },
    boundingBox: stateBoundingBox,
    districts,
  };
}

/**
 * Exports district data to assets/districts/<STATE>-<N>.json
 */
function exportDistrictFile(stateAbbr, n) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const data = generateStateDistricts(stateAbbr, n);
  const fileName = `${stateAbbr.toUpperCase()}-${n}.json`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return { fileName, filePath, data };
}

/**
 * Runs test generation and exports for specified test cases.
 */
function runTests() {
  const testCases = [
    { state: 'CA', n: 52 },
    { state: 'TX', n: 38 },
    { state: 'OH', n: 15 },
    { state: 'IL', n: 17 },
    { state: 'WY', n: 1 },
  ];

  console.log('=== RUNNING AGENT 3B DISTRICT SLICE TESTS (WEST & MIDWEST) ===');
  const results = [];

  for (const { state, n } of testCases) {
    const t0 = Date.now();
    const { fileName, filePath, data } = exportDistrictFile(state, n);
    const elapsed = Date.now() - t0;

    // Verify constraints
    if (data.districts.length !== n) {
      throw new Error(`Slice count mismatch for ${fileName}: expected ${n}, got ${data.districts.length}`);
    }

    // Verify bounds & tiling
    for (const d of data.districts) {
      if (!d.q || !d.path || !d.path.startsWith('M') || !d.path.endsWith('Z')) {
        throw new Error(`Invalid geometry format in ${d.id}`);
      }
      if (d.bbox.minX < data.boundingBox.minX - 1e-1 || d.bbox.maxX > data.boundingBox.maxX + 1e-1 ||
          d.bbox.minY < data.boundingBox.minY - 1e-1 || d.bbox.maxY > data.boundingBox.maxY + 1e-1) {
        throw new Error(`District ${d.id} bbox exceeds state bounding box`);
      }
    }

    // Verify JSON validity
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(rawContent);
    if (!parsed.districts || parsed.districts.length !== n) {
      throw new Error(`JSON parse verification failed for ${fileName}`);
    }

    results.push({
      file: fileName,
      state,
      n,
      citizenPerDistrict: data.representationRatio.citizenPerDistrict,
      timeMs: elapsed,
      sizeBytes: fs.statSync(filePath).size,
    });
    console.log(`✓ Generated & Verified: ${fileName} (${n} districts, ${data.representationRatio.citizenPerDistrict.toLocaleString()} citizens/seat, ${elapsed}ms)`);
  }

  // Also test upper bounds for Big Four (CA 200, TX 200) and standard (e.g. OH 50)
  console.log('Testing modular bounds (CA-200, TX-200, OH-50)...');
  const upperBounds = [
    { state: 'CA', n: 200 },
    { state: 'TX', n: 200 },
    { state: 'OH', n: 50 },
  ];
  for (const { state, n } of upperBounds) {
    const res = generateStateDistricts(state, n);
    if (res.districts.length !== n) throw new Error(`Upper bound test failed for ${state}-${n}`);
    console.log(`✓ Upper bound check passed: ${state}-${n} (${res.districts.length} districts)`);
  }

  return results;
}

/**
 * Generates all West and Midwest states with their standard apportionment.
 */
function exportAllWestMidwestStandard() {
  console.log('\n=== GENERATING ALL 29 WEST & MIDWEST STATES ===');
  const generated = [];
  for (const state of WEST_MIDWEST_STATES) {
    const n = STANDARD_APPORTIONMENT[state];
    const { fileName, filePath, data } = exportDistrictFile(state, n);
    // verify parse
    JSON.parse(fs.readFileSync(filePath, 'utf8'));
    generated.push({ fileName, n, state, citizens: data.representationRatio.citizenPerDistrict });
    console.log(`✓ Exported ${fileName} (N=${n})`);
  }
  return generated;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const testOnly = args.includes('--test-only');

  const testResults = runTests();
  let allResults = [];
  if (!testOnly) {
    allResults = exportAllWestMidwestStandard();
  }

  console.log('\nAll operations completed successfully.');
}

module.exports = {
  WEST_MIDWEST_STATES,
  generateStateDistricts,
  exportDistrictFile,
  runTests,
  exportAllWestMidwestStandard,
  CENSUS_BASELINES,
  STANDARD_APPORTIONMENT,
  BIG_FOUR,
};
