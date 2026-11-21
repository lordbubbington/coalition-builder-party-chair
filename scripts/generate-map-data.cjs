const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const statesGeo = JSON.parse(fs.readFileSync(path.join(root, 'assets/maps/us-geo.json'), 'utf8'));
const stateNameToAbbr = {
  Alabama:'AL', Alaska:'AK', Arizona:'AZ', Arkansas:'AR', California:'CA', Colorado:'CO', Connecticut:'CT', Delaware:'DE',
  Florida:'FL', Georgia:'GA', Hawaii:'HI', Idaho:'ID', Illinois:'IL', Indiana:'IN', Iowa:'IA', Kansas:'KS', Kentucky:'KY',
  Louisiana:'LA', Maine:'ME', Maryland:'MD', Massachusetts:'MA', Michigan:'MI', Minnesota:'MN', Mississippi:'MS', Missouri:'MO',
  Montana:'MT', Nebraska:'NE', Nevada:'NV', 'New Hampshire':'NH', 'New Jersey':'NJ', 'New Mexico':'NM', 'New York':'NY',
  'North Carolina':'NC', 'North Dakota':'ND', Ohio:'OH', Oklahoma:'OK', Oregon:'OR', Pennsylvania:'PA', 'Rhode Island':'RI',
  'South Carolina':'SC', 'South Dakota':'SD', Tennessee:'TN', Texas:'TX', Utah:'UT', Vermont:'VT', Virginia:'VA',
  Washington:'WA', 'West Virginia':'WV', Wisconsin:'WI', Wyoming:'WY',
};
const fipsToAbbr = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','12':'FL','13':'GA','15':'HI','16':'ID',
  '17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS',
  '29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK',
  '41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
  '55':'WI','56':'WY',
};
const partyFromText = (text) => {
  if (/Democratic Party|DFL|\(D\)/i.test(text)) return 'people';
  if (/Republican Party|\(R\)/i.test(text)) return 'heritage';
  if (/Independent/i.test(text) || /\(I\)/i.test(text)) return 'independent';
  return null;
};
const oldControl = (source, name) => {
  const match = source.match(new RegExp(`const ${name} = (\\{[\\s\\S]*?\\n\\};)`));
  if (!match) throw new Error(`Could not find ${name} in scenario-2028.js`);
  return Function(`return (${match[1].slice(0, -1)})`)();
};
const scenario = fs.readFileSync(path.join(root, 'scenario-2028.js'), 'utf8');
const scenarioSandbox = { PartyChairData: { STATES: [] } };
Function('window', scenario)(scenarioSandbox);
const oldGovernors = scenarioSandbox.PartyChairData.VERSION_01_GOVERNORS;
const oldLegislatures = scenarioSandbox.PartyChairData.VERSION_01_STATE_LEGISLATURES;
const scenarioSenateSeats = scenarioSandbox.PartyChairData.VERSION_07_SENATE_SEATS || [];
const scenarioGovernorIncumbents = scenarioSandbox.PartyChairData.VERSION_07_GOVERNOR_INCUMBENTS || {};
const scenarioHouseIncumbents = scenarioSandbox.PartyChairData.VERSION_07_HOUSE_INCUMBENTS || {};

function dbfRows(filePath) {
  const buf = fs.readFileSync(filePath);
  const count = buf.readUInt32LE(4);
  const headerLength = buf.readUInt16LE(8);
  const recordLength = buf.readUInt16LE(10);
  const fields = [];
  for (let pos = 32; pos < headerLength - 1; pos += 32) {
    let end = buf.subarray(pos, pos + 11).indexOf(0);
    if (end < 0) end = 11;
    fields.push({ name: buf.subarray(pos, pos + end).toString('ascii').trim(), length: buf[pos + 16] });
  }
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    let pos = headerLength + i * recordLength + 1;
    const row = {};
    for (const field of fields) {
      row[field.name] = buf.subarray(pos, pos + field.length).toString('ascii').trim();
      pos += field.length;
    }
    rows.push(row);
  }
  return rows;
}

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

function simplifyOpen(points, tolerance = 0.45) {
  if (points.length <= 4) return points;
  const tol2 = tolerance * tolerance;
  const radial = [points[0]];
  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = radial[radial.length - 1], p = points[i];
    if ((p[0] - prev[0]) ** 2 + (p[1] - prev[1]) ** 2 > tol2) radial.push(p);
  }
  radial.push(points[points.length - 1]);
  const keep = new Uint8Array(radial.length);
  keep[0] = 1; keep[radial.length - 1] = 1;
  const stack = [[0, radial.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    const a = radial[start], b = radial[end];
    const dx = b[0] - a[0], dy = b[1] - a[1], den = dx * dx + dy * dy;
    let max = tol2, index = -1;
    for (let i = start + 1; i < end; i += 1) {
      const p = radial[i];
      const t = den ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / den)) : 0;
      const ex = p[0] - (a[0] + t * dx), ey = p[1] - (a[1] + t * dy);
      const distance = ex * ex + ey * ey;
      if (distance > max) { max = distance; index = i; }
    }
    if (index >= 0) { keep[index] = 1; stack.push([start, index], [index, end]); }
  }
  return radial.filter((_, i) => keep[i]);
}
function simplifyClosed(points) {
  const ring = points.length > 1 && points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1] ? points.slice(0, -1) : points;
  if (ring.length <= 4) return ring;
  let farthest = 1, maxDistance = 0;
  for (let i = 1; i < ring.length; i += 1) {
    const distance = (ring[i][0] - ring[0][0]) ** 2 + (ring[i][1] - ring[0][1]) ** 2;
    if (distance > maxDistance) { maxDistance = distance; farthest = i; }
  }
  const first = simplifyOpen(ring.slice(0, farthest + 1));
  const second = simplifyOpen(ring.slice(farthest).concat([ring[0]]));
  const result = first.concat(second.slice(1, -1));
  return result.length >= 3 ? result : ring.slice(0, 3);
}
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
function pathsForRings(rings, project) {
  const encoded = [];
  let largest = [];
  for (const ring of rings) {
    if (ring.length < 3) continue;
    const points = simplifyClosed(ring.map(([lon, lat]) => project(lon, lat)));
    encoded.push(encodeRing(points));
    if (points.length > largest.length) largest = points;
  }
  if (!largest.length) return null;
  const xs = largest.map((p) => p[0]), ys = largest.map((p) => p[1]);
  // Google polyline uses ASCII 63–126; `!` (ASCII 33) cannot occur in a ring.
  return { q: encoded.join('!'), cx: round1((Math.min(...xs) + Math.max(...xs)) / 2), cy: round1((Math.min(...ys) + Math.max(...ys)) / 2) };
}

const states = statesGeo.map((g) => {
  const abbr = g.a;
  const result = pathsForRings(g.p, projectorFor(abbr));
  const rings = g.p.slice().sort((a, b) => b.length - a.length)[0] || [];
  const points = rings.map(([lon, lat]) => projectorFor(abbr)(lon, lat));
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  return { id: abbr, q: result.q, cx: result.cx, cy: result.cy, w: round1(Math.max(...xs) - Math.min(...xs)), h: round1(Math.max(...ys) - Math.min(...ys)) };
});

const districts = [];
const shpDir = path.join(root, 'obj/cd120-shp');
const shapeFiles = fs.readdirSync(shpDir)
  .filter((name) => name.endsWith('_cd120.shp') && !name.includes('_29_cd120.'))
  .map((name) => ({ shpPath: path.join(shpDir, name), districtField: 'CD120FP' }));
shapeFiles.push({ shpPath: path.join(root, 'obj/cd119-mo/tl_2024_29_cd119.shp'), districtField: 'CD119FP' });
for (const { shpPath, districtField } of shapeFiles) {
  const dbfPath = shpPath.replace(/\.shp$/, '.dbf');
  const rows = dbfRows(dbfPath);
  const buf = fs.readFileSync(shpPath);
  let offset = 100, row = 0;
  while (offset + 8 <= buf.length) {
    const words = buf.readInt32BE(offset + 4);
    const start = offset + 8, end = start + words * 2;
    const shapeType = buf.readInt32LE(start);
    const attrs = rows[row++];
    if (shapeType === 5 || shapeType === 15) {
      const numParts = buf.readInt32LE(start + 36);
      const numPoints = buf.readInt32LE(start + 40);
      const partStart = start + 44;
      const parts = Array.from({ length: numParts }, (_, i) => buf.readInt32LE(partStart + i * 4));
      const pointStart = partStart + numParts * 4;
      const points = Array.from({ length: numPoints }, (_, i) => [buf.readDoubleLE(pointStart + i * 16), buf.readDoubleLE(pointStart + i * 16 + 8)]);
      const rings = parts.map((first, i) => points.slice(first, parts[i + 1] ?? numPoints));
      const stateId = fipsToAbbr[attrs.STATEFP];
      const districtCode = attrs[districtField];
      const districtNumber = /^\d+$/.test(districtCode) ? (Number(districtCode) || 1) : null;
      const proj = pathsForRings(rings, projectorFor(stateId));
      if (stateId && districtNumber && proj) districts.push({ id: `${stateId}-${districtNumber}`, stateId, districtNumber, q: proj.q, cx: proj.cx, cy: proj.cy });
    }
    offset = end;
  }
}
districts.sort((a, b) => a.stateId.localeCompare(b.stateId) || a.districtNumber - b.districtNumber);

const wikitext = fs.readFileSync(path.join(root, 'obj/120th-congress-wikitext.txt'), 'utf8');
const headingIndex = (label) => {
  const match = new RegExp(`^={2,3}\\s*${label}\\s*={2,3}\\s*$`, 'm').exec(wikitext);
  return match ? match.index : -1;
};
const senateStart = headingIndex('Senate');
const representativesStart = headingIndex('Representatives');
const nonVotingStart = headingIndex('Non-voting members');
function parseStateBlocks(section, headingSize) {
  const escaped = '='.repeat(headingSize);
  const startPattern = new RegExp(`^${escaped}\\s*.*?\\|([^\\]]+)\\]\\]\\s*${escaped}\\s*$`, 'gm');
  const headings = [...section.matchAll(startPattern)];
  return headings.map((heading, i) => ({ name: heading[1].trim(), text: section.slice(heading.index + heading[0].length, headings[i + 1]?.index ?? section.length) }));
}
function parseSenate() {
  const section = wikitext.slice(senateStart, representativesStart);
  const output = [];
  for (const block of parseStateBlocks(section, 4)) {
    const stateId = stateNameToAbbr[block.name];
    if (!stateId) continue;
    const lineRx = /^.*?\{\{Party stripe\|([^}]+)\}\}(.*)$/gm;
    for (const match of block.text.matchAll(lineRx)) {
      const tail = match[2];
      const seat = tail.match(/(?:^|\s)([123])\.\s*(.*)$/);
      if (!seat) continue;
      const partyText = match[1];
      const candidateText = seat[2];
      const rawParty = partyFromText(`${partyText} ${candidateText}`);
      const party = rawParty === 'independent' ? 'people' : rawParty;
      output.push({ stateId, class: Number(seat[1]), party, rawParty, pending: /TBD/i.test(candidateText), label: candidateText.replace(/<ref[\s\S]*$/, '').trim() });
    }
  }
  return output;
}
function parseHouse() {
  const section = wikitext.slice(representativesStart, nonVotingStart > representativesStart ? nonVotingStart : undefined);
  const output = [];
  for (const block of parseStateBlocks(section, 4)) {
    const stateId = stateNameToAbbr[block.name];
    if (!stateId) continue;
    const lineRx = /^.*?(?:\{\{Party stripe\|([^}]+)\}\})?.*?\{\{ushr\|[^|]+\|([^|]+)\|E\}\}\.\s*(.*)$/gm;
    for (const match of block.text.matchAll(lineRx)) {
      const districtCode = match[2].trim();
      const districtNumber = Number.parseInt(districtCode, 10) || 1;
      const candidateText = match[3].replace(/<ref[\s\S]*$/, '').trim();
      const rawParty = partyFromText(`${match[1] || ''} ${candidateText}`);
      output.push({ id: `${stateId}-${districtNumber}`, stateId, districtNumber, party: rawParty === 'independent' ? 'other' : rawParty, pending: /TBD/i.test(candidateText), label: candidateText });
    }
  }
  return output;
}
function cleanWikiCandidateName(raw) {
  return String(raw || '')
    .replace(/<ref[\s\S]*$/i, '')
    .replace(/\{\{efn[\s\S]*$/i, '')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\s*\((?:D|R|I|DFL|PPD\/D)\)\s*$/i, '')
    .trim();
}
const senators = scenarioSenateSeats.length === 100
  ? scenarioSenateSeats.map((seat) => {
    const classRoman = seat.class === 1 ? 'I' : seat.class === 2 ? 'II' : 'III';
    const rawPartyCode = seat.rawParty || (seat.party === 'people' ? 'D' : 'R');
    return {
      stateId: seat.state,
      class: seat.class,
      classRoman,
      party: seat.party,
      rawParty: rawPartyCode === 'I' ? 'independent' : seat.party,
      incumbent: seat.incumbent,
      name: seat.incumbent,
      label: `${seat.incumbent} (${rawPartyCode})`,
      isIncumbent: true,
      pending: false,
      electionYear: seat.electionYear || (seat.class === 1 ? 2024 : seat.class === 2 ? 2026 : 2022),
    };
  })
  : parseSenate();
if (senators.length !== 100) throw new Error(`Expected 100 Senate seats; got ${senators.length}`);
if (senators.filter((row) => row.class === 1).length !== 33) throw new Error('Expected 33 Class I Senate seats.');
if (senators.filter((row) => row.class === 2).length !== 33) throw new Error('Expected 33 Class II Senate seats.');
if (senators.filter((row) => row.class === 3).length !== 34) throw new Error('Expected 34 Class III Senate seats.');
if (!senators.some((row) => row.class === 2 && row.stateId === 'AK' && row.party === 'people' && row.incumbent === 'Mary Peltola')) {
  throw new Error('Missing Mary Peltola (D-AK) in Class II Senate map.');
}
if (!senators.some((row) => row.class === 2 && row.stateId === 'MS' && row.party === 'people' && row.incumbent === 'Scott Colom')) {
  throw new Error('Missing Scott Colom (D-MS) in Class II Senate map.');
}
if (!senators.some((row) => row.class === 3 && row.stateId === 'OH' && row.party === 'people' && row.incumbent === 'Sherrod Brown')) {
  throw new Error('Missing Sherrod Brown (D-OH) in Class III Senate map.');
}
const parsedHouse = parseHouse();
const parsedHouseById = new Map(parsedHouse.map((row) => [row.id, row]));
const houseResults = districts.map((dist) => {
  const inc = scenarioHouseIncumbents[dist.id];
  const parsed = parsedHouseById.get(dist.id);
  const party = inc?.party || (parsed && !parsed.pending && parsed.party !== 'other' ? parsed.party : 'heritage');
  const incumbentName = inc?.name || cleanWikiCandidateName(parsed?.label || `Rep. ${dist.id}`);
  const partyCode = party === 'people' ? 'D' : 'R';
  return {
    id: dist.id,
    stateId: dist.stateId,
    districtNumber: dist.districtNumber,
    party,
    incumbent: incumbentName,
    name: incumbentName,
    label: `${incumbentName} (${partyCode})`,
    isIncumbent: true,
    pending: false,
  };
});
const houseById = new Map(houseResults.map((row) => [row.id, row]));
for (const district of districts) Object.assign(district, houseById.get(district.id) || { party: null, pending: true, label: 'Result pending' });

const legislatureResultsPath = path.join(root, 'assets/maps/stateLegislatureResults2026.js');
const legislatureSource = fs.readFileSync(legislatureResultsPath, 'utf8');
const chamberRows = new Map();
const chamberRx = /\['([A-Z]{2})',\s*'([^']+)',\s*\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+,\s*'([^']+)'\]/g;
for (const row of legislatureSource.matchAll(chamberRx)) {
  const [, stateId, chamber, control] = row;
  (chamberRows.get(stateId) || chamberRows.set(stateId, []).get(stateId)).push({ chamber, control });
}
const legislatures = {};
for (const state of Object.values(stateNameToAbbr)) {
  const records = chamberRows.get(state) || [];
  const before = oldLegislatures[state] || ['heritage', 'heritage'];
  if (records.some((r) => r.chamber === 'unicameral')) {
    legislatures[state] = ['nonpartisan', 'nonpartisan'];
    continue;
  }
  const toParty = (control, fallback) => control === 'dem' ? 'people' : control === 'rep' ? 'heritage' : control === 'nonpartisan' ? 'nonpartisan' : control === 'tbd' ? 'unknown' : fallback;
  const lower = records.find((r) => r.chamber === 'lower');
  const upper = records.find((r) => r.chamber === 'upper');
  legislatures[state] = [toParty(lower?.control, before[0]), toParty(upper?.control, before[1])];
}

const governors = { ...oldGovernors };
const governorIncumbents = scenarioGovernorIncumbents;
const pendingGovernors = [];
const source = {
  geography: 'U.S. Census Bureau TIGER/Line 2026 CD120 geography, with Missouri replaced by its 2024 CD119 geography because the Census 2026 Missouri shapefile had not yet been regenerated after the court blocked the newer map for the 2026 general election.',
  electionSnapshot: '120th United States Congress membership list and 2026 Senate/Gubernatorial/House winners entering the 2028 cycle.',
  senateControl: 'Class I uses 2024 winners (33 seats); Class II uses 2026 winners including Mary Peltola (D-AK) and Scott Colom (D-MS) (33 seats); Class III uses 2022 winners plus 2026 special-election winners Sherrod Brown (D-OH) and Ashley Moody (R-FL) (34 seats).',
  houseSeatCount: districts.length,
  senateSeatCount: senators.length,
  stateCount: states.filter((state) => state.id !== 'DC').length,
};
if (districts.length !== 435) throw new Error(`Expected 435 U.S. districts; generated ${districts.length}`);
if (senators.length !== 100) throw new Error(`Unexpected Senate row count: ${senators.length}`);
const payload = { viewBox: '0 0 960 620', states, districts, houseResults, senators, governors, governorIncumbents, pendingGovernors, legislatures, source };
const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(payload)), { level: 9 });
const chunks = compressed.toString('base64').match(/.{1,80000}/g) || [];
const dataLiteral = chunks.map((chunk) => JSON.stringify(chunk)).join('+\n');
const out = `/* Generated from Census TIGER/Line and the checked source snapshots documented in MAP_DATA_0.3.md. */\n(() => {\nconst encoded=${dataLiteral};\nconst bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));\nconst stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));\nwindow.PartyChairData.VERSION_03_MAPS_READY=new Response(stream).json().then(data=>(window.PartyChairData.VERSION_03_MAPS=data));\n})();\n`;
fs.writeFileSync(path.join(root, 'maps-0.3.js'), out);
console.log(JSON.stringify({ states: states.length, districts: districts.length, houseResults: houseResults.length, senateRows: senators.length, senateClasses: Object.fromEntries([1,2,3].map((cls) => [cls, { democratic: senators.filter((row) => row.class === cls && row.party === 'people').length, republican: senators.filter((row) => row.class === cls && row.party === 'heritage').length }])), governors: Object.keys(governors).length, legislatures: Object.keys(legislatures).length, jsonBytes: Buffer.byteLength(JSON.stringify(payload)), gzipBytes: compressed.length, scriptBytes: Buffer.byteLength(out) }, null, 2));
