'use strict';

const assert = require('assert');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Verify browser global + CommonJS UMD export parity
global.window = global;
const mod = require(path.join(ROOT, 'autopsy-catalog-minor-low.js'));

assert.ok(mod && mod.AUTOPSY_MINOR_LOW, 'Module exports AUTOPSY_MINOR_LOW');
assert.strictEqual(global.window.AutopsyCatalogMinorLow, mod, 'window.AutopsyCatalogMinorLow matches module.exports');

const catalog = mod.AUTOPSY_MINOR_LOW;

const ALLOWED_MODES = new Set(['top_states', 'uncertified_ballot', 'reform_states']);
const ALLOWED_EFFECT_KEYS = new Set([
  'treasury', 'voters', 'chapters', 'organizingActions',
  'factionHappiness', 'factionConfidence', 'factionFriction', 'caucusStrength',
  'supporterTrust', 'independentTrust', 'waveMomentum', 'nationalEnvShift',
  'ballotAccessStates', 'petitionCostDiscountPct',
  'freeHouseSlates', 'freeSenateSlates', 'spawnCandidates', 'candidateFameBoost',
  'enactAntiSpoilerReformStates', 'boostSuperPacs', 'preventDefectionCycles',
  'sittingMemberHappiness',
]);

const EXPECTED_NAMES = {
  0: ['Pass the Hat at HQ', 'Keep the Lights On', 'Campus Flyer Blitz', 'Open-Mic Town Halls', 'Local Precinct Registry', 'Podcast & Substack Circuit', 'Circle the Wagons'],
  1: ['Grassroots Sustainer Club', 'County Fair Booths', 'Volunteer Captain Training', 'Unity Campfire Retreat', 'Local Paper Op-Ed Push', 'Ballot Signature War Chest', 'Draft a Local Firebrand'],
  2: ['Small-Dollar Telethon', 'Door-to-Door Canvass Corps', 'Twin-State Chapter Charter', 'Caucus Charter Workshop', 'Statehouse Watchdog Desk', 'Regional Talk-Radio Blitz', 'Early Petition Vanguard'],
  3: ['Quarterly Donor Summit', 'Tri-State Registration Surge', 'Regional Field Directorates', 'Ideological Renewal Charter', 'Ballot Access Blitz', 'Farm-Team Candidate Academy', 'Earned Media Breakthrough'],
  4: ['National Grassroots Gala', 'Suburban & Rural Canvass', 'Chapter Network Expansion', 'Coalition Solidarity Pact', '3-State Ballot Certification', 'Statehouse Recruitment Drive', 'National Podcast & Cable Circuit'],
  5: ['Mid-Dollar Donor Bundlers', 'Regional Voter Wave', 'Statewide Field Machine', 'Caucus Unity Convention', 'Regional Ballot Sweep', 'Rising Star Recruitment', 'Anti-Establishment Narrative'],
  6: ['National Sustainer Surge', '6-State Registration Push', 'Permanent Precinct Infrastructure', 'Big-Tent Peace Accord', '5-State Ballot Access Push', 'Statehouse & Congressional Bench', 'Prime-Time Media Tour'],
  7: ['Major Donor Defection Wave', 'Cross-Regional Voter Drive', 'National Field Academy', 'Ironclad Coalition Charter', '6-State Ballot Certification', 'Star Recruit Pipeline', 'Reform & Accountability Mandate'],
  8: ['National War Chest Infusion', '8-State Voter Realignment', 'Regional HQ Network', 'Unified Movement Congress', '8-State Ballot Breakthrough', 'Shadow Cabinet Bench', 'National Narrative Hijack'],
  9: ['Bundler & Super PAC Alignment', '10-State Registration Wave', 'National Organizing Machine', 'Historic Unity Summit', '10-State Ballot Sweep', 'Blue-Chip Candidate Surge', 'Electoral Reform Breakthrough'],
  10: ['National Institutional Endowment', 'Million-Voter Horizon Drive', '50-State Organizing Blueprint', 'Coalition Renaissance', '12-State Ballot Qualification', 'National Bench Expansion', 'National Credibility Shatter'],
};

const seenIds = new Set();
let totalOptions = 0;

for (let pts = 0; pts <= 10; pts++) {
  const bucket = catalog[pts];
  assert.ok(Array.isArray(bucket), `Bucket ${pts} must exist as an array`);
  assert.strictEqual(bucket.length, 7, `Bucket ${pts} must contain exactly 7 options, got ${bucket.length}`);

  bucket.forEach((opt, idx) => {
    totalOptions++;
    assert.strictEqual(typeof opt.id, 'string', `Option ${pts}[${idx}] id must be string`);
    assert.ok(opt.id.startsWith(`minor_p${pts}_`), `Option ${pts}[${idx}] id "${opt.id}" must start with minor_p${pts}_`);
    assert.strictEqual(seenIds.has(opt.id), false, `Duplicate option id detected: ${opt.id}`);
    seenIds.add(opt.id);

    assert.strictEqual(opt.track, 'minor', `${opt.id}: track must be 'minor'`);
    assert.strictEqual(opt.bucket, pts, `${opt.id}: bucket must equal ${pts}`);
    assert.strictEqual(opt.name, EXPECTED_NAMES[pts][idx], `${opt.id}: exact name mismatch`);
    assert.ok(typeof opt.theme === 'string' && opt.theme.trim().length > 0, `${opt.id}: theme must be non-empty string`);
    assert.ok(typeof opt.summaryTemplate === 'string' && opt.summaryTemplate.trim().length > 0, `${opt.id}: summaryTemplate must be non-empty string`);

    if (opt.stateTargeting !== null) {
      assert.strictEqual(typeof opt.stateTargeting, 'object', `${opt.id}: stateTargeting must be object or null`);
      assert.ok(ALLOWED_MODES.has(opt.stateTargeting.mode), `${opt.id}: invalid stateTargeting mode "${opt.stateTargeting.mode}"`);
      assert.ok(Number.isInteger(opt.stateTargeting.count) && opt.stateTargeting.count >= 1, `${opt.id}: invalid stateTargeting count`);
      if (opt.stateTargeting.count <= 5) {
        assert.ok(opt.summaryTemplate.includes('{STATES}'), `${opt.id}: stateTargeting.count=${opt.stateTargeting.count} <= 5 MUST include {STATES} in summaryTemplate`);
      }
    }

    assert.ok(opt.effects && typeof opt.effects === 'object' && !Array.isArray(opt.effects), `${opt.id}: effects must be object`);
    const effKeys = Object.keys(opt.effects);
    assert.ok(effKeys.length >= 1, `${opt.id}: effects must define at least 1 key`);
    effKeys.forEach((k) => {
      assert.ok(ALLOWED_EFFECT_KEYS.has(k), `${opt.id}: unexpected effect key "${k}"`);
    });
  });
}

assert.strictEqual(Object.keys(catalog).length, 11, 'Catalog must contain exactly 11 buckets (0..10)');
assert.strictEqual(totalOptions, 77, 'Catalog must contain exactly 77 total options');

console.log(`PASS: Verified all 11 buckets (0..10), ${totalOptions}/77 unique minor-track autopsy options, schema contracts, and {STATES} templates.`);
