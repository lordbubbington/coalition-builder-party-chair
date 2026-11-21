const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const project=path.resolve(__dirname,'..');
  const source=await import(pathToFileURL(path.join(project,'assets','maps','stateLegislatureResults2026.js')).href);
  const states={};
  for(const record of source.STATE_LEGISLATURE_RESULTS_2026) {
    if(!['lower','unicameral'].includes(record.chamber)) continue;
    states[record.abbr]={
      people:record.dem,
      heritage:record.rep,
      independent:record.independent,
      other:record.other,
      unallocated:record.unallocated,
      total:record.reportedTotal,
      chamber:record.chamber,
      sourceStatus:record.sourceStatus,
    };
  }
  // These four states did not hold regular lower-house elections in 2026;
  // carry forward their latest 2025/2023 membership counts, including 2026
  // Louisiana special-election change.
  Object.assign(states,{
    LA:{people:33,heritage:72,independent:0,other:0,unallocated:0,total:105,chamber:'lower',sourceStatus:'2026 special-election update'},
    MS:{people:41,heritage:77,independent:0,other:0,unallocated:4,total:122,chamber:'lower',sourceStatus:'2023 election results; current vacancies'},
    NJ:{people:57,heritage:23,independent:0,other:0,unallocated:0,total:80,chamber:'lower',sourceStatus:'2025 election results'},
    VA:{people:64,heritage:36,independent:0,other:0,unallocated:0,total:100,chamber:'lower',sourceStatus:'2025 election results'},
  });
  const result={source:source.STATE_LEGISLATURE_RESULTS_2026_SOURCE,states,totalSeats:Object.values(states).reduce((sum,state)=>sum+state.total,0)};
  fs.writeFileSync(path.join(project,'state-house-data-0.5.js'),`// Generated from assets/maps/stateLegislatureResults2026.js.\nwindow.PartyChairData.VERSION_05_STATE_HOUSE_SEATS=${JSON.stringify(result)};\n`);
  console.log(JSON.stringify({states:Object.keys(states).length,totalLowerHouseSeats:result.totalSeats},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
