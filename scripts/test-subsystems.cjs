'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');

function boot() {
  const storage = {};
  const ctx = vm.createContext({
    window: {},
    console,
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Set,
    Map,
    RegExp,
    Error,
    Promise,
    Infinity,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Uint8Array,
    Blob: globalThis.Blob,
    DecompressionStream: globalThis.DecompressionStream,
    Response: globalThis.Response,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    localStorage: {
      getItem: (k) => storage[k] ?? null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
  });
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  const scripts = [
    'data.js','factions-0.15.js','scenario-2028.js','issues-0.2.1.js','maps-0.3.js',
    'state-house-data-0.5.js','voter-model-0.5.js','demographics-0.9.js','political-trends-system.js',
    'v07-scaffolding.js','party-systems-data.js','party-systems-coalition.js','party-systems-robots.js',
    'party-systems-engine.js','party-systems-ui.js','presidential-primaries.js','ballot-access.js',
    'election-uncertainty.js','candidate-vetting.js','election-drift.js','election-night-engine.js','engine.js',
  ];
  for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

const ctx = boot();
const E = ctx.window.PartyChairEngine;
const CV = ctx.window.CandidateVetting;
const BA = ctx.window.BallotAccess;
const EU = ctx.window.ElectionUncertainty;
const ED = ctx.window.ElectionDrift;
const ENE = ctx.window.ElectionNightEngine;

const errors = [];

// 1. Candidate Vetting
try {
  let g = E.createGame({ baseTemplateId: 'people' });
  const cand = (g.politicians || [])[0];
  if (cand && CV) {
    const vetted = CV.vetCandidate ? CV.vetCandidate(g, cand.id) : null;
    console.log('Candidate Vetting test:', Boolean(vetted));
  }
} catch (err) {
  errors.push({ sub: 'CandidateVetting', err: err.message });
}

// 2. Ballot Access
try {
  let g = E.createGame({ baseTemplateId: 'liberty' });
  if (BA && typeof BA.launchPetitionDrive === 'function') {
    const res = BA.launchPetitionDrive(g, { stateId: 'OH', raceType: 'senate' });
    console.log('Ballot Access petition test:', Boolean(res));
  }
} catch (err) {
  errors.push({ sub: 'BallotAccess', err: err.message });
}

// 3. Election Night Timeline
try {
  let g = E.createGame({ baseTemplateId: 'people' });
  g.phase = 'campaign';
  g = E.takeAction(g, 'advance-to-election-night');
  if (g.electionNight && g.electionNight.timeline) {
    console.log('Election Night timeline generated: steps =', g.electionNight.timeline.length);
    // Step through 10 minutes
    g = E.takeAction(g, 'election-night-step', { deltaMinutes: 60 });
    console.log('Election Night elapsed minutes:', g.electionNight.elapsedMinutes);
  }
} catch (err) {
  errors.push({ sub: 'ElectionNight', err: err.message });
}

console.log('Subsystem errors found:', errors.length);
if (errors.length) console.log(errors);
