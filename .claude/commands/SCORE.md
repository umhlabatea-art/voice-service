# /SCORE — OHS Compliance Score Engine

**Usage**: `/SCORE [contractor-name]` or `/SCORE simulate [scenario]`

---

## Six-Dimensional Scoring Engine

| # | Dimension | Weight | Max Points |
|---|-----------|--------|------------|
| 1 | Legal Compliance | 28% | 28 |
| 2 | Document Completeness | 22% | 22 |
| 3 | Incident Management | 18% | 18 |
| 4 | Contractor Qualification | 14% | 14 |
| 5 | Training Currency | 10% | 10 |
| 6 | Physical Agent Exposure | 8% | 8 |
| | **TOTAL** | **100%** | **100** |

## Band Output
```
≥ 85   →  🟢 COMPLIANT              — Hold current status
65–84  →  🟡 CONDITIONALLY COMPLIANT — Issue remediation plan
45–64  →  🔴 NON-COMPLIANT           — Auto-route → UmhlabaTea Projects
< 45   →  🚨 CRITICAL RISK           — Immediate intervention + auto-route
```

## Data Collection Protocol

If scoring a real contractor, collect each dimension in sequence:

```
1. LEGAL COMPLIANCE (28pts)
   □ Section 16.1 appointment in place?
   □ Section 8 risk assessment current?
   □ OHS Act 85/1993 full coverage?
   □ Construction Regulations 2014 (if applicable)?
   □ Physical Agents Regulations 2025 compliance?

2. DOCUMENT COMPLETENESS (22pts)
   □ OHS file present and current?
   □ Emergency plan documented?
   □ PPE register maintained?
   □ Safe Work Procedures (SWPs) in place?

3. INCIDENT MANAGEMENT (18pts)
   □ Incident register up to date?
   □ COID Act reporting compliant?
   □ Investigation reports complete?

4. CONTRACTOR QUALIFICATION (14pts)
   □ CIDB grade confirmed? [Grade: ]
   □ Relevant certifications current?
   □ Competent person appointments?

5. TRAINING CURRENCY (10pts)
   □ Induction training records?
   □ First aid certificates current?
   □ Toolbox talks logged?

6. PHYSICAL AGENT EXPOSURE (8pts)
   □ Noise assessment done?
   □ Vibration exposure measured?
   □ Thermal environment assessed?
```

## Score Output Format

```
═══════════════════════════════════════
  OHS COMPLIANCE SCORE — [CONTRACTOR]
  Assessed: [ISO date]
═══════════════════════════════════════

  Legal Compliance:          [nn]/28
  Document Completeness:     [nn]/22
  Incident Management:       [nn]/18
  Contractor Qualification:  [nn]/14
  Training Currency:         [nn]/10
  Physical Agent Exposure:   [nn]/8
                           ─────────
  TOTAL SCORE:               [nn]/100

  STATUS: [BAND] [COLOUR INDICATOR]

  ROUTING: [Hold / Remediation Plan / UmhlabaTea Projects]

  TOP 3 REMEDIATION PRIORITIES:
  1. ...
  2. ...
  3. ...
═══════════════════════════════════════
```

**Arguments received**: $ARGUMENTS
