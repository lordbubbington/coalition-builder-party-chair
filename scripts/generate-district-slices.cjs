/**
 * Procedural District Map & Modular Slice Generator
 *
 * Generates seamless, modular district slice files and procedural geometry for all 50 states.
 * - The Big Four (CA, NY, FL, TX): Supports N = 1 to 200 districts.
 * - Remaining 46 States: Supports N = 1 to 50 districts.
 * - Equal Population Math: Citizen representation = Math.round(statePopulation / N).
 * - Output format: Clean JSON geometry compatible with maps-0.3.js & app.js renderer (q polyline & SVG path d).
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const usGeoPath = path.join(root, 'assets', 'maps', 'us-geo.json');
const censusCsvPath = path.join(root, 'obj', 'census-cvap-State.csv');

// Load US boundary geometry
const statesGeo = JSON.parse(fs.readFileSync(usGeoPath, 'utf8'));

// State Name to 2-Letter Abbreviation Mapping
const STATE_NAMES = {
  Alabama:'AL', Alaska:'AK', Arizona:'AZ', Arkansas:'AR', California:'CA', Colorado:'CO', Connecticut:'CT', Delaware:'DE',
  Florida:'FL', Georgia:'GA', Hawaii:'HI', Idaho:'ID', Illinois:'IL', Indiana:'IN', Iowa:'IA', Kansas:'KS', Kentucky:'KY',
  Louisiana:'LA', Maine:'ME', Maryland:'MD', Massachusetts:'MA', Michigan:'MI', Minnesota:'MN', Mississippi:'MS', Missouri:'MO',
  Montana:'MT', Nebraska:'NE', Nevada:'NV', 'New Hampshire':'NH', 'New Jersey':'NJ', 'New Mexico':'NM', 'New York':'NY',
  'North Carolina':'NC', 'North Dakota':'ND', Ohio:'OH', Oklahoma:'OK', Oregon:'OR', Pennsylvania:'PA', 'Rhode Island':'RI',
  'South Carolina':'SC', 'South Dakota':'SD', Tennessee:'TN', Texas:'TX', Utah:'UT', Vermont:'VT', Virginia:'VA', Washington:'WA',
  'West Virginia':'WV', Wisconsin:'WI', Wyoming:'WY', 'District of Columbia':'DC',
};

const BIG_FOUR = new Set(['CA', 'NY', 'FL', 'TX']);

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

  // Fallback defaults if CSV is missing
  const fallbacks = {
    AL: { name: 'Alabama', total: 5086767, citizen: 4963370 },
    AK: { name: 'Alaska', total: 733583, citizen: 708304 },
    AZ: { name: 'Arizona', total: 7359197, citizen: 6867634 },
    AR: { name: 'Arkansas', total: 3045637, citizen: 2955953 },
    CA: { name: 'California', total: 39287380, citizen: 34445998 },
    CO: { name: 'Colorado', total: 5839926, citizen: 5543147 },
    CT: { name: 'Connecticut', total: 3617176, citizen: 3375836 },
    DE: { name: 'Delaware', total: 1018249, citizen: 978939 },
    FL: { name: 'Florida', total: 22416077, citizen: 20327619 },
    GA: { name: 'Georgia', total: 10912876, citizen: 10398696 },
    HI: { name: 'Hawaii', total: 1440196, citizen: 1354317 },
    ID: { name: 'Idaho', total: 1939033, citizen: 1877083 },
    IL: { name: 'Illinois', total: 12582032, citizen: 11986510 },
    IN: { name: 'Indiana', total: 6833037, citizen: 6636737 },
    IA: { name: 'Iowa', total: 3200517, citizen: 3119102 },
    KS: { name: 'Kansas', total: 2937150, citizen: 2816913 },
    KY: { name: 'Kentucky', total: 4526154, citizen: 4426541 },
    LA: { name: 'Louisiana', total: 4590241, citizen: 4478492 },
    ME: { name: 'Maine', total: 1385340, citizen: 1363615 },
    MD: { name: 'Maryland', total: 6164660, citizen: 5738870 },
    MA: { name: 'Massachusetts', total: 7001399, citizen: 6511116 },
    MI: { name: 'Michigan', total: 10037261, citizen: 9750058 },
    MN: { name: 'Minnesota', total: 5717184, citizen: 5493010 },
    MS: { name: 'Mississippi', total: 2940057, citizen: 2901309 },
    MO: { name: 'Missouri', total: 6177957, citizen: 6046241 },
    MT: { name: 'Montana', total: 1122867, citizen: 1110038 },
    NE: { name: 'Nebraska', total: 1967267, citizen: 1891963 },
    NV: { name: 'Nevada', total: 3177772, citizen: 2893556 },
    NH: { name: 'New Hampshire', total: 1395231, citizen: 1361287 },
    NJ: { name: 'New Jersey', total: 9261694, citizen: 8466180 },
    NM: { name: 'New Mexico', total: 2113344, citizen: 2011933 },
    NY: { name: 'New York', total: 19852366, citizen: 18020157 },
    NC: { name: 'North Carolina', total: 10698973, citizen: 10222045 },
    ND: { name: 'North Dakota', total: 779261, citizen: 760468 },
    OH: { name: 'Ohio', total: 11785935, citizen: 11529528 },
    OK: { name: 'Oklahoma', total: 4019800, citizen: 3878148 },
    OR: { name: 'Oregon', total: 4233358, citizen: 4016738 },
    PA: { name: 'Pennsylvania', total: 13018639, citizen: 12570059 },
    RI: { name: 'Rhode Island', total: 1097379, citizen: 1039870 },
    SC: { name: 'South Carolina', total: 5282634, citizen: 5126622 },
    SD: { name: 'South Dakota', total: 909824, citizen: 894086 },
    TN: { name: 'Tennessee', total: 7051339, citizen: 6848261 },
    TX: { name: 'Texas', total: 30188421, citizen: 27107441 },
    UT: { name: 'Utah', total: 3380800, citizen: 3236077 },
    VT: { name: 'Vermont', total: 647064, citizen: 636302 },
    VA: { name: 'Virginia', total: 8683619, citizen: 8189679 },
    WA: { name: 'Washington', total: 7785786, citizen: 7277637 },
    WV: { name: 'West Virginia', total: 1775156, citizen: 1757820 },
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

// Coordinate Projection Math (Albers Equal-Area matching maps-0.3.js & generate-map-data.cjs)
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
const projectAk = fitRegion(configs.ak, statesGeo.find((g) => g.a === 'AK').p, boxes.ak);
const projectHi = fitRegion(configs.hi, statesGeo.find((g) => g.a === 'HI').p, boxes.hi);
const projectorFor = (abbr) => (abbr === 'AK' ? projectAk : abbr === 'HI' ? projectHi : projectConus);

// Encoding Routines
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
    // Bounding box center fallback
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const r of rings) for (const [x, y] of r) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    return [round1((minX + maxX) / 2), round1((minY + maxY) / 2)];
  }
  return [round1(cx / (3 * totalArea)), round1(cy / (3 * totalArea))];
}

// Sutherland-Hodgman Polygon Half-Plane Clipper
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

// Bisects a multi-ring polygon collection into left/right partition with targetArea fraction
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
 * Procedurally generates N seamless district slices for a given state.
 *
 * @param {string} stateAbbr - Two letter state postal abbreviation (e.g. 'PA', 'CA')
 * @param {number} n - Number of districts (1 to 200 for Big Four; 1 to 50 for others)
 * @returns {Array<Object>} List of district slice descriptors compatible with maps-0.3.js & app.js
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

  // Equal population calculation: citizen representation = citizenPopulation / N
  const citizenRepresentation = Math.round(baseline.citizenPopulation / n);
  const totalPopulationRepresentation = Math.round(baseline.totalPopulation / n);
  const cvapRepresentation = Math.round((baseline.cvap || baseline.citizenPopulation * 0.78) / n);

  // Procedurally slice geometry
  const rawSlices = slicePolygons(stateRings, n);

  // Order slices geographically (North-to-South / West-to-East) for consistent district numbering
  const indexedSlices = rawSlices.map((rings, idx) => {
    const [cx, cy] = polygonCentroid(rings);
    return { rings, rawIdx: idx, cx, cy };
  });

  indexedSlices.sort((a, b) => {
    // Primary sort: latitude/Y (top to bottom), Secondary: longitude/X (left to right)
    const dy = a.cy - b.cy;
    if (Math.abs(dy) > 12) return dy;
    return a.cx - b.cx;
  });

  const districts = indexedSlices.map((item, idx) => {
    const districtNumber = idx + 1;
    const districtId = `${abbr}-${districtNumber}`;
    const rings = item.rings;

    // Encode rings into polyline delta format matching maps-0.3.js
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
      areaRatio: round1(areaRatio * 1000) / 1000,
      citizenPopulation: citizenRepresentation,
      totalPopulation: totalPopulationRepresentation,
      cvap: cvapRepresentation,
      name: `${baseline.name} ${districtNumber}`,
    };
  });

  return districts;
}

/**
 * Generates and bundles district slices for all states with target district counts.
 * Default counts match standard apportionment (e.g. PA: 17, CA: 52, WY: 1, TX: 38).
 */
function generateDistrictCatalog(customDistrictCounts = {}) {
  const standardApportionment = {
    AL: 7, AK: 1, AZ: 9, AR: 4, CA: 52, CO: 8, CT: 5, DE: 1, FL: 28, GA: 14,
    HI: 2, ID: 2, IL: 17, IN: 9, IA: 4, KS: 4, KY: 6, LA: 6, ME: 2, MD: 8,
    MA: 9, MI: 13, MN: 8, MS: 4, MO: 8, MT: 2, NE: 3, NV: 4, NH: 2, NJ: 12,
    NM: 3, NY: 26, NC: 14, ND: 1, OH: 15, OK: 5, OR: 6, PA: 17, RI: 2, SC: 7,
    SD: 1, TN: 9, TX: 38, UT: 4, VT: 1, VA: 11, WA: 10, WV: 2, WI: 8, WY: 1,
  };

  const catalog = {
    metadata: {
      generatedAt: new Date().toISOString(),
      viewBox: '0 0 960 620',
      description: 'Procedural modular district slices for all 50 states',
      bigFourMaxN: 200,
      standardMaxN: 50,
    },
    states: {},
  };

  for (const [abbr, defaultN] of Object.entries(standardApportionment)) {
    const n = customDistrictCounts[abbr] || defaultN;
    const districts = generateStateDistricts(abbr, n);
    catalog.states[abbr] = {
      stateId: abbr,
      districtCount: n,
      districts,
    };
  }

  return catalog;
}

// CLI & Test Runner
if (require.main === module) {
  const args = process.argv.slice(2);
  const testFlag = args.includes('--test');
  const stateArg = args[args.indexOf('--state') + 1];
  const nArg = Number(args[args.indexOf('--n') + 1]);
  const exportFlag = args.includes('--export');

  if (stateArg && nArg) {
    const slices = generateStateDistricts(stateArg, nArg);
    console.log(`Generated ${slices.length} districts for ${stateArg.toUpperCase()} (N=${nArg}):`);
    console.log(`Sample district:`, {
      id: slices[0].id,
      cx: slices[0].cx,
      cy: slices[0].cy,
      citizenPopulation: slices[0].citizenPopulation,
      qLength: slices[0].q.length,
      pathPreview: slices[0].path.slice(0, 45) + '...',
    });
  } else if (testFlag || args.length === 0) {
    console.log('Running procedural slice tests on sample configurations...');
    const samples = [
      { state: 'PA', n: 17 },
      { state: 'CA', n: 52 },
      { state: 'WY', n: 1 },
      { state: 'TX', n: 38 },
      { state: 'CA', n: 200 }, // Big Four upper bound
      { state: 'NY', n: 200 },
      { state: 'FL', n: 200 },
      { state: 'TX', n: 200 },
      { state: 'VT', n: 50 },  // Remaining 46 upper bound
    ];

    let passed = 0;
    for (const { state, n } of samples) {
      const t0 = Date.now();
      const slices = generateStateDistricts(state, n);
      const elapsed = Date.now() - t0;
      if (slices.length !== n) {
        throw new Error(`Test failed for ${state}-${n}: expected ${n} slices, got ${slices.length}`);
      }
      // Verify geometry decode
      for (const s of slices) {
        if (!s.q || !s.path.startsWith('M') || !s.path.endsWith('Z')) {
          throw new Error(`Invalid geometry format in ${s.id}`);
        }
      }
      console.log(`✓ ${state}-${n}: ${slices.length} slices, citizen pop per district: ${slices[0].citizenPopulation.toLocaleString()}, time: ${elapsed}ms`);
      passed++;
    }
    console.log(`All ${passed} sample tests PASSED successfully.`);

    if (exportFlag) {
      const outDir = path.join(root, 'assets', 'maps');
      const outFile = path.join(outDir, 'district-slices.json');
      console.log(`Exporting full 50-state procedural slice catalog to ${outFile}...`);
      const catalog = generateDistrictCatalog();
      fs.writeFileSync(outFile, JSON.stringify(catalog, null, 2), 'utf8');
      console.log(`Successfully exported district catalog (${(fs.statSync(outFile).size / 1024).toFixed(1)} KB).`);
    }
  }
}

module.exports = {
  generateStateDistricts,
  generateDistrictCatalog,
  loadCensusBaselines,
  decodePath,
  encodeRing,
  encodeNumber,
  CENSUS_BASELINES,
  BIG_FOUR,
};
