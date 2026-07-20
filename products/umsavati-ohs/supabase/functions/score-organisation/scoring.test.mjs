// Unit tests for the rubric-v1 scoring module, run under Node type-stripping.
import assert from 'node:assert/strict';
import {
  computeDimensions, legalCompliance, documentCompleteness, incidentManagement,
  contractorQualification, trainingCurrency, physicalAgentExposure, requiredDesignations,
} from './scoring.ts';

const now = new Date('2026-07-20T12:00:00Z');
let n = 0;
const t = (name, fn) => { fn(); n++; console.log(`ok ${n} - ${name}`); };

// requiredDesignations
t('base sectors need the 3-link S.16 chain', () =>
  assert.deepEqual(requiredDesignations('manufacturing'),
    ['s16_1_employer', 's16_2_assistant', 's8_2_competent_person']));
t('construction adds CR5, events adds SASREA', () => {
  assert.ok(requiredDesignations('construction').includes('cr5_construction_manager'));
  assert.ok(requiredDesignations('events').includes('sasrea_event_safety_officer'));
});

// legalCompliance
t('empty appointments → 0', () => assert.equal(legalCompliance('construction', [], now), 0));
t('full current chain → 100', () => {
  const apps = ['s16_1_employer', 's16_2_assistant', 's8_2_competent_person', 'cr5_construction_manager']
    .map((d) => ({ designation: d, appointed_at: '2026-01-01', expires_at: null }));
  assert.equal(legalCompliance('construction', apps, now), 100);
});
t('expired and future appointments do not count', () => {
  const apps = [
    { designation: 's16_1_employer', appointed_at: '2025-01-01', expires_at: '2026-01-01' }, // expired
    { designation: 's16_2_assistant', appointed_at: '2026-09-01', expires_at: null },        // future
    { designation: 's8_2_competent_person', appointed_at: '2026-01-01', expires_at: null },  // current
  ];
  assert.equal(legalCompliance('healthcare', apps, now), 33.3); // 1 of 3
});

// documentCompleteness
t('no documents → 0', () => assert.equal(documentCompleteness([], now), 0));
t('all six modules valid+signed → 100', () => {
  const mods = ['ohs_policy_statement', 'risk_assessment_register', 'health_safety_file',
    'emergency_preparedness_plan', 'incident_accident_register', 'training_induction_records'];
  const docs = mods.map((m) => ({ module: m, valid_until: null, signed_by_16_1: true }));
  assert.equal(documentCompleteness(docs, now), 100);
});
t('present-but-unsigned or expired scores 50 for that module', () => {
  const docs = [
    { module: 'ohs_policy_statement', valid_until: null, signed_by_16_1: false },   // 50
    { module: 'risk_assessment_register', valid_until: '2026-01-01', signed_by_16_1: true }, // expired → 50
  ];
  assert.equal(documentCompleteness(docs, now), Math.round((100 / 6) * 10) / 10); // (50+50)/6 ≈ 16.7
});

// incidentManagement
t('no incidents → 100', () => assert.equal(incidentManagement([], now), 100));
t('near-miss and property damage are not reportable', () => {
  const inc = [
    { kind: 'near_miss', occurred_at: '2026-06-01T00:00:00Z', reported_s24: false, reported_within_deadline: null },
    { kind: 'property_damage', occurred_at: '2026-06-01T00:00:00Z', reported_s24: false, reported_within_deadline: null },
  ];
  assert.equal(incidentManagement(inc, now), 100);
});
t('half of reportable incidents compliant → 50', () => {
  const inc = [
    { kind: 'injury', occurred_at: '2026-06-01T00:00:00Z', reported_s24: true, reported_within_deadline: true },
    { kind: 'disease', occurred_at: '2026-05-01T00:00:00Z', reported_s24: false, reported_within_deadline: null },
  ];
  assert.equal(incidentManagement(inc, now), 50);
});
t('reportable incidents older than 12 months fall out of the window', () => {
  const inc = [{ kind: 'injury', occurred_at: '2024-01-01T00:00:00Z', reported_s24: false, reported_within_deadline: false }];
  assert.equal(incidentManagement(inc, now), 100);
});
t('reported but past deadline is non-compliant', () => {
  const inc = [{ kind: 'injury', occurred_at: '2026-06-01T00:00:00Z', reported_s24: true, reported_within_deadline: false }];
  assert.equal(incidentManagement(inc, now), 0);
});

// contractorQualification
t('no contractors → 100 (no exposure)', () => assert.equal(contractorQualification([]), 100));
t('graded+verified 100, ungraded+unverified 0 → avg 50', () => {
  const c = [
    { cidb_grade: 5, cr5_competency_verified: true },
    { cidb_grade: null, cr5_competency_verified: false },
  ];
  assert.equal(contractorQualification(c), 50);
});

// trainingCurrency
t('no training records → 0 (absence of evidence is the failure)', () =>
  assert.equal(trainingCurrency([], now), 0));
t('3 of 4 records current → 75', () => {
  const r = [
    { valid_until: null }, { valid_until: '2027-01-01' }, { valid_until: '2026-08-01' },
    { valid_until: '2026-01-01' }, // lapsed
  ];
  assert.equal(trainingCurrency(r, now), 75);
});

// physicalAgentExposure
t('no readings → 50 (unmonitored is unknown, not safe)', () =>
  assert.equal(physicalAgentExposure([], now), 50));
t('stale readings (>24 months) → 50', () => {
  const r = [{ measured_at: '2023-01-01T00:00:00Z', exceeds_action_level: false }];
  assert.equal(physicalAgentExposure(r, now), 50);
});
t('1 of 4 current readings exceeds action level → 75', () => {
  const r = [
    { measured_at: '2026-06-01T00:00:00Z', exceeds_action_level: false },
    { measured_at: '2026-06-01T00:00:00Z', exceeds_action_level: false },
    { measured_at: '2025-06-01T00:00:00Z', exceeds_action_level: false },
    { measured_at: '2026-06-01T00:00:00Z', exceeds_action_level: true },
  ];
  assert.equal(physicalAgentExposure(r, now), 75);
});

// computeDimensions end-to-end + DB weighting cross-check
t('computeDimensions: greenfield org with zero data', () => {
  const d = computeDimensions('construction', {
    appointments: [], documents: [], incidents: [],
    contractors: [], training_records: [], physical_agent_readings: [],
  }, now);
  assert.deepEqual(d, {
    legal_compliance: 0, document_completeness: 0, incident_management: 100,
    contractor_qualification: 100, training_currency: 0, physical_agent_exposure: 50,
  });
  // DB would compute: 0.18*100 + 0.14*100 + 0.08*50 = 36 → critical_risk. Honest.
  const total = d.legal_compliance * 0.28 + d.document_completeness * 0.22 +
    d.incident_management * 0.18 + d.contractor_qualification * 0.14 +
    d.training_currency * 0.10 + d.physical_agent_exposure * 0.08;
  assert.equal(total, 36);
});
t('all dimensions bounded 0-100 (DB check constraints will accept)', () => {
  const d = computeDimensions('events', {
    appointments: [{ designation: 's16_1_employer', appointed_at: '2026-01-01', expires_at: null }],
    documents: [{ module: 'health_safety_file', valid_until: null, signed_by_16_1: true }],
    incidents: [{ kind: 'injury', occurred_at: '2026-06-01T00:00:00Z', reported_s24: true, reported_within_deadline: true }],
    contractors: [{ cidb_grade: 3, cr5_competency_verified: false }],
    training_records: [{ valid_until: null }],
    physical_agent_readings: [{ measured_at: '2026-06-01T00:00:00Z', exceeds_action_level: false }],
  }, now);
  for (const [k, v] of Object.entries(d)) {
    assert.ok(v >= 0 && v <= 100, `${k}=${v} out of range`);
  }
});

console.log(`\n${n} tests passed`);
