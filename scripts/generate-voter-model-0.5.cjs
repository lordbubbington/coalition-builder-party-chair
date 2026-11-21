const fs = require('node:fs');
const path = require('node:path');

const project = path.resolve(__dirname, '..');
const cvapDistrictPath = path.join(project, 'obj', 'census-cvap-CD.csv');
const cvapStatePath = path.join(project, 'obj', 'census-cvap-State.csv');
if (!fs.existsSync(cvapDistrictPath) || !fs.existsSync(cvapStatePath)) {
  throw new Error('Download the Census 2020-2024 CVAP CSV archive and extract CD.csv and State.csv to obj/ before regenerating this model.');
}

const abbreviations = {
  Alabama:'AL', Alaska:'AK', Arizona:'AZ', Arkansas:'AR', California:'CA', Colorado:'CO', Connecticut:'CT', Delaware:'DE',
  Florida:'FL', Georgia:'GA', Hawaii:'HI', Idaho:'ID', Illinois:'IL', Indiana:'IN', Iowa:'IA', Kansas:'KS', Kentucky:'KY',
  Louisiana:'LA', Maine:'ME', Maryland:'MD', Massachusetts:'MA', Michigan:'MI', Minnesota:'MN', Mississippi:'MS', Missouri:'MO',
  Montana:'MT', Nebraska:'NE', Nevada:'NV', 'New Hampshire':'NH', 'New Jersey':'NJ', 'New Mexico':'NM', 'New York':'NY',
  'North Carolina':'NC', 'North Dakota':'ND', Ohio:'OH', Oklahoma:'OK', Oregon:'OR', Pennsylvania:'PA', 'Rhode Island':'RI',
  'South Carolina':'SC', 'South Dakota':'SD', Tennessee:'TN', Texas:'TX', Utah:'UT', Vermont:'VT', Virginia:'VA', Washington:'WA',
  'West Virginia':'WV', Wisconsin:'WI', Wyoming:'WY', 'District of Columbia':'DC',
};

// 2024 EAVS active registrations, transcribed from the state table at PollCheck.
// North Dakota has no registration; its 2026 eligible-voter estimate is used.
const activeVoters2024 = {
  AL:3466606,AK:565242,AZ:4366786,AR:1359659,CA:22836602,CO:4074612,CT:2292818,DE:742370,DC:469969,FL:14028831,
  GA:7174961,HI:765998,ID:1178750,IL:8104485,IN:4288091,IA:2016967,KS:1871857,KY:3219361,LA:2734059,ME:1041826,
  MD:4231112,MA:4369280,MI:7267666,MN:3853668,MS:1965948,MO:4075977,MT:691534,NE:1190813,NV:2052976,NH:1008603,
  NJ:6066940,NM:1254851,NY:12429981,NC:6986365,ND:600394,OH:7054966,OK:2095952,OR:3060374,PA:8407874,RI:734885,
  SC:3417493,SD:627248,TN:4458851,TX:16611078,UT:1793182,VT:460415,VA:5898922,WA:5013112,WV:1118468,WI:3933068,WY:296960,
};

// August 2026 registered-party shares. States that do not collect party affiliation
// use the explicitly identified inference model below rather than fabricated rolls.
const registeredPartyPct = {
  AK:[11.61,23.58,63.12,1.69],AZ:[28.11,35.39,34.60,1.90],AR:[4.59,8.37,86.99,0.05],CA:[44.90,24.96,22.82,7.31],
  CO:[23.68,21.38,52.54,2.41],CT:[35.70,21.18,41.57,1.54],DE:[40.96,24.70,33.10,1.24],FL:[30.12,41.54,24.65,3.69],
  ID:[11.83,62.82,23.92,1.43],IA:[29.15,39.26,30.86,0.73],KS:[24.71,44.36,29.68,1.24],KY:[40.59,48.05,5.29,5.45],
  LA:[35.67,35.86,27.64,0.83],ME:[34.02,30.48,31.45,4.05],MD:[51.45,23.53,23.14,1.87],MA:[25.84,8.42,64.75,0.98],
  NE:[26.06,49.29,22.42,2.23],NV:[27.62,27.54,38.61,6.23],NH:[27.49,33.37,39.14,0],NJ:[38.03,25.09,35.77,1.11],
  NM:[39.83,30.76,27.53,1.87],NY:[48.07,22.34,25.43,4.16],NC:[29.61,29.74,39.99,0.66],OK:[25.32,53.29,20.42,0.97],
  OR:[31.88,23.88,37.13,7.11],PA:[42.81,40.50,13.19,3.50],RI:[33.91,14.50,51.66,0],SD:[21.53,52.89,13.90,11.67],
  UT:[13.99,51.50,28.61,5.90],WV:[27.11,43.53,25.31,4.04],WY:[11.09,78.06,9.17,1.67],DC:[75.94,5.06,17.50,1.51],
};

const sampleSize = 1_550_000;
const representedVotersPerRecord = 100;
const redrawnFor2026 = new Set(['AL','CA','FL','LA','NC','OH','TN','TX','UT']);
const thirdPartySplit = { green:0.094, liberty:0.219, other:0.687 };

function parseCsv(line) {
  const cells=[]; let cell=''; let quoted=false;
  for(let i=0;i<line.length;i++) {
    const char=line[i];
    if(char==='"' && quoted && line[i+1]==='"') { cell+='"'; i++; }
    else if(char==='"') quoted=!quoted;
    else if(char===',' && !quoted) { cells.push(cell); cell=''; }
    else cell+=char;
  }
  cells.push(cell);
  return cells;
}

function parseScenarioArray(source, name) {
  const match=source.match(new RegExp(`const ${name}\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);`));
  if(!match) throw new Error(`Could not find ${name} in scenario-2028.js`);
  return JSON.parse(match[1].replace(/,\s*([}\]])/g,'$1'));
}

function parseCvap(file) {
  const lines=fs.readFileSync(file,'utf8').trim().split(/\r?\n/);
  const headers=parseCsv(lines[0]);
  const index=Object.fromEntries(headers.map((key,i)=>[key,i]));
  const rows=[];
  for(const line of lines.slice(1)) {
    const cells=parseCsv(line);
    if(cells[index.lntitle]!=='Total') continue;
    const geoid=cells[index.geoid]||'';
    const match=geoid.match(/US(\d{2})(\d{2})$/);
    const stateId=match ? Object.values(abbreviations).includes(geoid.slice(-4,-2)) ? geoid.slice(-4,-2) : null : null;
    const stateFromCode=match ? ({'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY'}[match[1]]||null) : null;
    rows.push({stateId:stateFromCode||stateId, district:Number(match?.[2]||0), population:Number(cells[index.tot_est]), cvap:Number(cells[index.cvap_est])});
  }
  return rows;
}

function apportion(total, weightedRows) {
  const weightTotal=weightedRows.reduce((sum,row)=>sum+Math.max(0,row.weight),0);
  if(!weightTotal) return weightedRows.map(()=>0);
  const quotas=weightedRows.map(row=>total*Math.max(0,row.weight)/weightTotal);
  const counts=quotas.map(Math.floor);
  let remaining=total-counts.reduce((sum,count)=>sum+count,0);
  const order=weightedRows.map((row,index)=>({index,remainder:quotas[index]-counts[index],key:row.key||''}))
    .sort((a,b)=>b.remainder-a.remainder||a.key.localeCompare(b.key));
  for(let i=0;i<remaining;i++) counts[order[i].index]++;
  return counts;
}

function allocateWithCaps(total, rows, weightOf, capacityOf) {
  const counts=rows.map(()=>0); let remaining=total;
  while(remaining>0) {
    const active=rows.map((row,index)=>({row,index,available:capacityOf(row)-counts[index],weight:weightOf(row)}))
      .filter(entry=>entry.available>0 && entry.weight>0);
    if(!active.length) throw new Error('Voter allocations exceeded the district capacity.');
    const weightTotal=active.reduce((sum,item)=>sum+item.weight,0);
    const quotas=active.map(item=>remaining*item.weight/weightTotal);
    let placed=0;
    active.forEach((item,index)=>{
      const amount=Math.min(item.available,Math.floor(quotas[index]));
      counts[item.index]+=amount; placed+=amount;
    });
    remaining-=placed;
    if(!remaining) break;
    const order=active.map((item,index)=>({item,remainder:quotas[index]-Math.floor(quotas[index])}))
      .sort((a,b)=>b.remainder-a.remainder||a.item.row.key.localeCompare(b.item.row.key));
    let singlePlaced=0;
    for(const {item} of order) {
      if(!remaining) break;
      if(counts[item.index]<capacityOf(item.row)) { counts[item.index]++; remaining--; singlePlaced++; }
    }
    if(!placed && !singlePlaced) throw new Error('Could not distribute the voter sample within district capacities.');
  }
  return counts;
}

const scenario=fs.readFileSync(path.join(project,'scenario-2028.js'),'utf8');
const states=parseScenarioArray(scenario,'VERSION_01_STATES');
const districts=parseScenarioArray(scenario,'VERSION_01_HOUSE_DISTRICTS');
const stateById=new Map(states.map(state=>[state.id,state]));
const results=JSON.parse(fs.readFileSync(path.join(project,'assets','maps','houseDistrictBaselines-2026.json'),'utf8'));
const resultsById=new Map(results.districts.map(row=>[`${row.stateAbbr}-${Number(row.districtNumber)}`,row]));
const cvapDistricts=parseCvap(cvapDistrictPath);
const cvapStateRows=parseCsv(fs.readFileSync(cvapStatePath,'utf8').trim().split(/\r?\n/)[0]);
const cvapStateLines=fs.readFileSync(cvapStatePath,'utf8').trim().split(/\r?\n/);
const stateHeader=Object.fromEntries(cvapStateRows.map((key,index)=>[key,index]));
const cvapByState={};
for(const line of cvapStateLines.slice(1)) {
  const cells=parseCsv(line);
  if(cells[stateHeader.lntitle]!=='Total') continue;
  const geoid=cells[stateHeader.geoid]||''; const match=geoid.match(/US(\d{2})$/);
  if(!match) continue;
  const stateCode=({'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY'})[match[1]];
  if(stateCode) cvapByState[stateCode]=Number(cells[stateHeader.cvap_est]);
}

const districtCvap=new Map();
cvapDistricts.forEach(row=>{
  if(!row.stateId) return;
  const stateDistricts=districts.filter(district=>district.stateId===row.stateId);
  const districtNumber=stateDistricts.length===1?1:row.district;
  districtCvap.set(`${row.stateId}-${districtNumber}`,row.cvap);
});

const currentDistricts=districts.map(district=>{
  const key=`${district.stateId}-${district.district}`;
  const contest=resultsById.get(key);
  if(!contest) throw new Error(`Missing 2026 House result baseline for ${key}`);
  const totalVotes=Number(contest.demVotes)+Number(contest.repVotes);
  const exactCvap=districtCvap.get(key);
  const stateId=district.stateId;
  const changed=redrawnFor2026.has(stateId);
  return {
    key:district.id,stateId,district:Number(district.district),
    leanDMinusR:Number(contest.districtLeanDMinusR ?? district.lean ?? 0),
    populationWeight:changed?totalVotes:exactCvap,
    populationSource:changed?`${contest.sourceYear||2026} district vote total proxy; 2026 map redraw`:'2020-2024 ACS CVAP (119th Congress boundaries)',
    sourceYear:changed?Number(contest.sourceYear||2026):2024,
    exactCvap:changed?null:exactCvap,
  };
});

const stateDistrictWeights=new Map();
currentDistricts.forEach(district=>{
  if(!Number.isFinite(district.populationWeight)||district.populationWeight<=0) throw new Error(`Missing population weight for ${district.key}`);
  if(!stateDistrictWeights.has(district.stateId)) stateDistrictWeights.set(district.stateId,[]);
  stateDistrictWeights.get(district.stateId).push(district);
});
stateDistrictWeights.forEach((rows,stateId)=>{
  if(!redrawnFor2026.has(stateId)) return;
  const stateCvap=cvapByState[stateId]||rows.reduce((sum,row)=>sum+(row.exactCvap||0),0);
  const totalWeight=rows.reduce((sum,row)=>sum+row.populationWeight,0);
  rows.forEach(row=>{ row.estimatedCvap=stateCvap*row.populationWeight/totalWeight; });
});

const jurisdictions=[...states.map(state=>({id:state.id,active:activeVoters2024[state.id],state})),{id:'DC',active:activeVoters2024.DC,state:{id:'DC',name:'District of Columbia',lean:registeredPartyPct.DC[0]-registeredPartyPct.DC[1]}}];
const jurisdictionWeights=jurisdictions.map(jurisdiction=>({key:jurisdiction.id,weight:jurisdiction.active}));
const jurisdictionCounts=apportion(sampleSize,jurisdictionWeights);
const partyNames=['people','heritage','independent','liberty','green','other'];
const modelDistrictRows=[];
const stateRows=[];
let nextSampleId=1;

function sharesFor(stateId,stateLean) {
  if(registeredPartyPct[stateId]) {
    const [people,heritage,independent,third]=registeredPartyPct[stateId];
    const total=people+heritage+independent+third;
    return {people:people/total,heritage:heritage/total,independent:independent/total,third:(third/total)};
  }
  const major=0.64, independent=0.33, third=0.03;
  const margin=Math.max(-0.5,Math.min(0.5,stateLean/100));
  const difference=major*0.65*margin;
  return {people:(major+difference)/2,heritage:(major-difference)/2,independent,third};
}

function allocateDistrictDemocrats(rows, target) {
  if(!target) return rows.map(()=>0);
  const stateWeightedLean=rows.reduce((sum,row)=>sum+row.leanDMinusR*row.capacity,0)/Math.max(1,rows.reduce((sum,row)=>sum+row.capacity,0));
  const beta=0.045;
  const weights=rows.map(row=>row.capacity*Math.exp(Math.max(-20,Math.min(20,beta*(row.leanDMinusR-stateWeightedLean)))));
  return allocateWithCaps(target,rows.map((row,index)=>({...row,key:row.key,weight:weights[index]})),row=>row.weight,row=>row.capacity);
}

for(let j=0;j<jurisdictions.length;j++) {
  const jurisdiction=jurisdictions[j];
  const n=jurisdictionCounts[j];
  const state=jurisdiction.state;
  let rows;
  if(jurisdiction.id==='DC') {
    rows=[{key:'DC-AL',stateId:'DC',district:0,leanDMinusR:0,populationWeight:jurisdiction.active,populationSource:'2024 EAVS active registration total; non-voting delegate district',sourceYear:2024}];
  } else rows=stateDistrictWeights.get(jurisdiction.id)||[];
  const districtCounts=apportion(n,rows.map(row=>({key:row.key,weight:row.populationWeight})));
  rows=rows.map((row,index)=>({...row,capacity:districtCounts[index]}));
  const shares=sharesFor(jurisdiction.id,Number(state.lean||0));
  const affiliationTotals=apportion(n,partyNames.map(partyId=>({key:partyId,weight:partyId==='people'?shares.people:partyId==='heritage'?shares.heritage:partyId==='independent'?shares.independent:partyId==='liberty'?shares.third*thirdPartySplit.liberty:partyId==='green'?shares.third*thirdPartySplit.green:shares.third*thirdPartySplit.other})));
  const totals=Object.fromEntries(partyNames.map((partyId,index)=>[partyId,affiliationTotals[index]]));
  const otherCategories=['independent','liberty','green','other'];
  const allocatedByCategory={};
  for(const partyId of otherCategories) {
    const caps=rows.map(row=>row.capacity);
    allocatedByCategory[partyId]=apportion(totals[partyId],rows.map(row=>({key:row.key,weight:row.populationWeight})));
  }
  const majorCapacities=rows.map((row,index)=>row.capacity-otherCategories.reduce((sum,partyId)=>sum+allocatedByCategory[partyId][index],0));
  if(majorCapacities.some(capacity=>capacity<0)) throw new Error(`Affiliation over-allocation in ${jurisdiction.id}`);
  const majorRows=rows.map((row,index)=>({...row,capacity:majorCapacities[index]}));
  const demCounts=allocateDistrictDemocrats(majorRows,totals.people);
  const repCounts=majorCapacities.map((capacity,index)=>capacity-demCounts[index]);
  const stateAffiliations={people:totals.people,heritage:totals.heritage,independent:totals.independent,thirdParty:totals.liberty+totals.green+totals.other,liberty:totals.liberty,green:totals.green,other:totals.other};
  stateRows.push({stateId:jurisdiction.id,name:state.name,cvap:cvapByState[jurisdiction.id]||null,activeVotersSource:jurisdiction.id==='ND'?'2026 eligible-voter estimate': '2024 EAVS active registrations',sampleVoters:n,representedVoters:n*representedVotersPerRecord,affiliations:stateAffiliations,partyDataSource:registeredPartyPct[jurisdiction.id]?'2026 reported registration shares':'estimate from national affiliation mix and 2024 state vote lean'});
  rows.forEach((row,index)=>{
    const affiliations={people:demCounts[index],heritage:repCounts[index],independent:allocatedByCategory.independent[index],liberty:allocatedByCategory.liberty[index],green:allocatedByCategory.green[index],other:allocatedByCategory.other[index]};
    const count=Object.values(affiliations).reduce((sum,value)=>sum+value,0);
    const segments=[];
    for(const partyId of partyNames) {
      const size=affiliations[partyId];
      if(size) { segments.push({firstVoterId:nextSampleId,count:size,partyId}); nextSampleId+=size; }
    }
    modelDistrictRows.push({
      stateId:jurisdiction.id,districtId:row.key,district:Number(row.district||0),
      population:row.exactCvap??row.estimatedCvap, populationBasis:row.populationSource,
      sampleVoters:count,representedVoters:count*representedVotersPerRecord,
      affiliations,segments,
    });
  });
}

const nationalAffiliations=partyNames.reduce((totals,partyId)=>{
  totals[partyId]=stateRows.reduce((sum,state)=>sum+(state.affiliations[partyId]||0),0);
  return totals;
},{});
const sampleTotal=modelDistrictRows.reduce((sum,row)=>sum+row.sampleVoters,0);
if(sampleTotal!==sampleSize || nextSampleId!==sampleSize+1) throw new Error(`Expected ${sampleSize} voter records; allocated ${sampleTotal}.`);

const output={
  version:'0.5',
  populationUnit:'Each sample voter represents 100 real voters.',
  sampleVoters:sampleSize,
  representedVoters:sampleSize*representedVotersPerRecord,
  representedMillions:sampleSize*representedVotersPerRecord/1_000_000,
  partyIds:partyNames,
  affiliations:{
    people:{name:'Democratic',sampleVoters:nationalAffiliations.people,representedVoters:nationalAffiliations.people*100},
    heritage:{name:'Republican',sampleVoters:nationalAffiliations.heritage,representedVoters:nationalAffiliations.heritage*100},
    independent:{name:'Independent',sampleVoters:nationalAffiliations.independent,representedVoters:nationalAffiliations.independent*100},
    thirdParty:{name:'Third party',sampleVoters:nationalAffiliations.liberty+nationalAffiliations.green+nationalAffiliations.other,representedVoters:(nationalAffiliations.liberty+nationalAffiliations.green+nationalAffiliations.other)*100,byParty:{liberty:nationalAffiliations.liberty,green:nationalAffiliations.green,other:nationalAffiliations.other}},
  },
  states:stateRows,
  districts:modelDistrictRows,
  modelNotes:{
    districtUnit:'A voter record has an implicit integer ID; each segment stores a lossless contiguous range sharing state, district, and affiliation. Expanding ranges gives exactly 1,550,000 records.',
    population:'State sample weights use EAVS active registration counts from 2024. Within states, unchanged congressional districts use 2020-2024 ACS CVAP. Alabama, California, Florida, Louisiana, North Carolina, Ohio, Tennessee, Texas, and Utah use 2026 district vote totals to apportion their ACS state CVAP over the redrawn 2026 districts.',
    affiliation:'Reported registration shares are based on Ballotpedia August 2026 state registration tables. States without party registration use a modeled split calibrated to the 2024 state presidential margin and the national party-affiliation mix. District Democratic/Republican shares are adjusted using district lean while preserving each state total.',
    thirdParty:'Reported “other parties” are apportioned between Green, Libertarian, and other minor parties using national 2026 registered minor-party shares; this split is an estimate.',
    sourceLinks:[
      'https://www.census.gov/programs-surveys/decennial-census/about/voting-rights/cvap/2020-2024-CVAP.html',
      'https://www.pollcheck.com/registration/',
      'https://ballotpedia.org/Partisan_affiliations_of_registered_voters',
      'https://www.census.gov/programs-surveys/decennial-census/about/rdo/congressional-districts.120th_Congress.html',
      'https://www.pewresearch.org/politics/2025/06/26/voting-patterns-in-the-2024-election/',
    ],
  },
};

const js=`// Version 0.5 scaled voter affiliation model. Generated by scripts/generate-voter-model-0.5.cjs.\nwindow.PartyChairData.VERSION_05_VOTER_MODEL=${JSON.stringify(output)};\n`;
fs.writeFileSync(path.join(project,'voter-model-0.5.js'),js);
console.log(JSON.stringify({sampleVoters:output.sampleVoters,representedVoters:output.representedVoters,states:output.states.length,districts:output.districts.length,affiliations:output.affiliations},null,2));
