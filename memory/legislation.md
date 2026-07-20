# SA Legislative Reference — Umsavati OHS

> Reference file for scoring engine, SafeFile templates, and compliance outputs.

---

## Primary Legislation

### OHS Act 85/1993
**Scope**: Primary OHS statute — all industries  
**Key Sections**:
- **Section 8**: Employer general duties (risk assessment, safe systems)
- **Section 9**: Employer duty re persons other than employees
- **Section 14**: Employee general duties
- **Section 16**: CEO/Employer designation chain (16.1 = employer, 16.2 = appointees)
- **Section 24**: Incident reporting obligations

**Section 16 Appointment Chain** (mandatory for scoring):
```
S.16.1  Employer / CEO (Njabulo Kubheka designation)
  └─ S.16.2  Assistant / Site Manager
       └─ S.8.2  Competent Persons
            └─ S.14  Employees
```

---

### Construction Regulations 2014
**Scope**: CIDB-registered construction contractors  
**Key Regulations**:
- **CR 5**: Competent persons — defined roles and qualifications
- **CR 7**: Health and Safety File (HSF) — mandatory documentation
- **CR 9**: Risk assessments — site-specific
- **CR 10**: Fall protection plans
- **CR 15**: Stacking and storage
- **CR 17**: Scaffolding requirements
- **CR 27**: Demolition work

**CIDB Grades**: 1 (smallest) → 9 (largest)  
Target: All registered contractors, all grades

---

### Physical Agents Regulations 2025
**Scope**: Workplace exposure to physical agents  
**Agents covered**:
- Noise (85 dB(A) 8h TWA action level)
- Vibration (hand-arm + whole-body)
- Thermal environment (WBGT indices)
- Electromagnetic radiation
- Optical radiation

**Scoring impact**: 8% weight in compliance engine

---

### SASREA (Safety at Sports and Recreational Events Act)
**Scope**: Events industry — venue safety, crowd management  
**Key requirements**:
- Event Safety Officer appointment
- Venue risk assessment
- Emergency evacuation plan
- SAPS/EMS coordination
- Organiser licence requirement

---

### COID Act (Compensation for Occupational Injuries and Diseases)
**Scope**: All employers  
**Key requirements**:
- Employer registration with Compensation Fund
- Incident reporting (within 7 days for injury, 14 for disease)
- Return-to-work planning
- Annual assessment submission (W.As.2)

---

### POPIA (Protection of Personal Information Act)
**Scope**: All data processing — including ARCHON agent outreach  
**Key obligations**:
- Lawful basis for processing (⚠️ UNRESOLVED for UTHENGISO outreach)
- Data subject consent (consent ledger not yet built)
- Retention and deletion schedules
- Data subject rights (access, correction, deletion)
- Information Officer designation (Njabulo Kubheka)

---

## Compliance Score Mapping

| Section | Scoring Dimension | Weight |
|---------|-------------------|--------|
| S.8 duties + S.16 chain | Legal Compliance | 28% |
| HSF, risk assessments, SWPs | Document Completeness | 22% |
| S.24 reporting + COID | Incident Management | 18% |
| CR 5 + CIDB grade | Contractor Qualification | 14% |
| Induction + first aid + toolbox | Training Currency | 10% |
| Physical Agents Regs 2025 | Physical Agent Exposure | 8% |

---

## Document Register (SafeFile Pro™ Modules)
1. OHS Policy Statement (S.16.1 signed)
2. Risk Assessment Register (S.8.2)
3. Health & Safety File (CR 7)
4. Emergency Preparedness Plan
5. Incident & Accident Register (S.24)
6. Training & Induction Records
