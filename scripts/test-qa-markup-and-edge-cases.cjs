'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function makeMockElement() {
  const listeners = {};
  const el = {
    innerHTML: '',
    value: '',
    dataset: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false,
    },
    setAttribute: () => {},
    getAttribute: (attr) => (attr === 'data-slot' ? '1' : null),
    appendChild: () => {},
    insertAdjacentHTML: () => {},
    addEventListener: (evt, fn) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(fn);
    },
    dispatchEvent: (evt) => {
      if (listeners[evt]) listeners[evt].forEach(fn => fn({ target: el, preventDefault: () => {} }));
    },
    querySelector: () => makeMockElement(),
    querySelectorAll: () => [makeMockElement()],
  };
  return el;
}

function bootFullEnvironment() {
  const storage = {};
  const appEl = makeMockElement();
  const mockDoc = {
    querySelectorAll: (sel) => [makeMockElement()],
    querySelector: (sel) => (sel === '#app' ? appEl : makeMockElement()),
    getElementById: (id) => (id === 'app' ? appEl : makeMockElement()),
    createElement: (tag) => makeMockElement(),
    addEventListener: () => {},
    body: makeMockElement(),
  };

  const ctx = vm.createContext({
    window: {},
    document: mockDoc,
    app: appEl,
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
      clear: () => { for (const k in storage) delete storage[k]; },
    },
  });
  ctx.window = ctx;
  ctx.self = ctx;
  ctx.globalThis = ctx;
  ctx.window.document = mockDoc;
  ctx.window.app = appEl;

  const scripts = [
    'data.js',
    'factions-0.15.js',
    'scenario-2028.js',
    'issues-0.2.1.js',
    'maps-0.3.js',
    'state-house-data-0.5.js',
    'voter-model-0.5.js',
    'demographics-0.9.js',
    'political-trends-system.js',
    'v07-scaffolding.js',
    'party-systems-data.js',
    'party-systems-coalition.js',
    'party-systems-robots.js',
    'party-systems-engine.js',
    'party-systems-ui.js',
    'presidential-primaries.js',
    'ballot-access.js',
    'election-uncertainty.js',
    'candidate-vetting.js',
    'election-drift.js',
    'election-night-engine.js',
    'engine.js',
    'app.js',
  ];

  for (const s of scripts) {
    const code = fs.readFileSync(path.join(ROOT, s), 'utf8');
    vm.runInContext(code, ctx, { filename: s });
  }

  return ctx;
}

async function run() {
  const ctx = bootFullEnvironment();

  let tries = 0;
  while (!ctx.window.PartyChairApp && tries < 50) {
    await new Promise((r) => setTimeout(r, 100));
    tries++;
  }

  const App = ctx.window.PartyChairApp;
  const Engine = ctx.window.PartyChairEngine;
  const Data = ctx.window.PartyChairData;

  console.log('App loaded on window:', Boolean(App));
  if (!App) throw new Error('PartyChairApp failed to initialize on window');

  const findings = [];
  function checkHtml(label, fn) {
    let html = '';
    try {
      html = fn();
    } catch (err) {
      findings.push({ severity: 'high', label, issue: 'Runtime error in markup generation', detail: err.message });
      console.error(`[HIGH] [${label}] Runtime error: ${err.message}`);
      return;
    }

    if (typeof html !== 'string') {
      findings.push({ severity: 'high', label, issue: 'Markup did not return a string', detail: typeof html });
      return;
    }
    const attrUndefined = html.match(/(?:class|id|value|href|src|data-[a-z0-9\-]+)=["']undefined["']/gi);
    if (attrUndefined) {
      findings.push({ severity: 'medium', label, issue: 'Undefined attribute detected', detail: attrUndefined.slice(0, 3).join(', ') });
    }
    const nanMatch = html.match(/>[^<]*\bNaN\b[^<]*</g);
    if (nanMatch) {
      findings.push({ severity: 'high', label, issue: 'NaN detected in rendered text', detail: nanMatch.slice(0, 3).join(', ') });
    }
    if (html.includes('[object Object]')) {
      findings.push({ severity: 'high', label, issue: '[object Object] rendered in markup', detail: 'Literal object string conversion' });
    }
    const reqMatch = html.match(/\b(?:REQ|MAS)-\d+\b/g);
    if (reqMatch) {
      findings.push({ severity: 'low', label, issue: 'Unstripped development tag', detail: reqMatch.slice(0, 3).join(', ') });
    }
  }

  // 1. Setup Phase
  console.log('--- Checking Setup Phase Markup ---');
  checkHtml('Setup Markup', () => App.setupMarkup());
  checkHtml('Custom Party Creator', () => App.customPartyCreatorMarkup());

  // 2. Organizing Phase & Steps
  console.log('--- Checking Organizing Phase Steps ---');
  let g = Engine.createGame({ baseTemplateId: 'people' });
  App.setGame(g);

  checkHtml('Step 1 Issues', () => App.step1IssuesMarkup(g));
  checkHtml('Step 2 Priorities', () => App.step2PrioritiesMarkup(g));
  checkHtml('Step 3 Primaries / Endorsements', () => App.step3PrimariesMarkup(g));
  checkHtml('Step 4 Work / Campaign Prep', () => App.step4WorkMarkup(g));
  checkHtml('Step 4 State Legislature', () => App.step4StateLegMarkup(g));

  // 3. Presidential Primary Phase
  console.log('--- Checking Presidential Primary Markup ---');
  g = Engine.takeAction(g, 'start-presidential-primary');
  App.setGame(g);
  checkHtml('Campaign Markup in Primary Phase', () => App.campaignMarkup());

  while (g.activePresidentialPrimary && g.activePresidentialPrimary.stage !== 'complete') {
    g = Engine.takeAction(g, 'advance-primary-day');
    App.setGame(g);
  }
  checkHtml('Primary Clinch / Complete Screen', () => App.campaignMarkup());

  g = Engine.takeAction(g, 'finish-presidential-primary');
  App.setGame(g);

  // 4. Campaign Phase Tabs
  console.log('--- Checking Campaign Phase Tabs ---');
  checkHtml('Campaign Dashboard', () => App.campaignDashboardMarkup());
  checkHtml('Campaign Polling Map', () => App.campaignPollingMapMarkup());
  checkHtml('Actions Tab', () => App.actionsTabMarkup());
  checkHtml('States Tab', () => App.statesTabMarkup());
  checkHtml('Factions Tab', () => App.factionsTabMarkup());
  checkHtml('Forecast Tab', () => App.forecastTabMarkup());
  checkHtml('Party Info Tab', () => App.partyInfoTabMarkup());

  // 5. Modals & Drawers
  console.log('--- Checking Modals & Drawers ---');
  checkHtml('Commission Poll Modal', () => App.commissionPollModalMarkup());
  checkHtml('Summit Modal', () => App.summitModalMarkup());
  checkHtml('Kingmaker Modal', () => App.kingmakerModalMarkup());
  checkHtml('Contingent Election Modal', () => App.contingentElectionModalMarkup());
  checkHtml('Identity Crisis Modal', () => App.identityCrisisModalMarkup());
  checkHtml('Ascension Gauntlet Modal', () => App.ascensionGauntletModalMarkup());

  // 6. Election Night Screen
  console.log('--- Checking Election Night Markup ---');
  g = Engine.takeAction(g, 'advance-to-election-night');
  App.setGame(g);
  checkHtml('Election Night Screen', () => App.campaignMarkup());

  console.log('\n====================================================================');
  console.log(` MARKUP AUDIT COMPLETE: ${findings.length} ISSUES FOUND`);
  console.log('====================================================================');
  findings.forEach(f => {
    console.log(`[${f.severity.toUpperCase()}] [${f.label}] ${f.issue}: ${f.detail}`);
  });

  fs.writeFileSync(path.join(ROOT, 'markup-audit-results.json'), JSON.stringify(findings, null, 2));
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
