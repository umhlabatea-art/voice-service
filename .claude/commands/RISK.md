# /RISK — Risk Surface Assessment

**Usage**: `/RISK [scope]`  
**Scope options**: `all` · `technical` · `regulatory` · `operational` · `[specific-area]`

---

## Risk Matrix Template

```
═══════════════════════════════════════════════════
  UMHLABATEA RISK SURFACE — [SCOPE]
  [ISO Date]
═══════════════════════════════════════════════════

Severity:  🔴 CRITICAL  🟠 HIGH  🟡 MEDIUM  🟢 LOW
```

---

## Technical Risk Surface

Assess:
- **Alerting gap**: No Uptime Kuma, no Sentry — production blind spots
- **Single-VPS SPOF**: Hostinger KVM2 — no failover
- **RLS coverage**: Any table missing auth.uid()-based policies?
- **Dependency vulnerabilities**: Run audit on package.json / pyproject.toml
- **n8n workflow error branches**: Missing error handling = silent failures
- **Ollama decommission**: Still running alongside OpenRouter — resource waste

## Regulatory Risk Surface

Assess:
- **POPIA**: Outreach lawful basis unresolved — HIGH risk for UTHENGISO
- **POPIA consent ledger**: Not yet built — data subject rights exposure
- **OHS Act scoring gaps**: Incomplete legislative mapping = liability
- **CIDB verification**: Contractor grade data accuracy = compliance risk
- **SASREA events coverage**: Events industry compliance completeness

## Operational Risk Surface

Assess:
- **HITL bottleneck**: UTHENGISO 100% manual = CEO bandwidth constraint
- **Agent partial builds**: IMVELO, IZINDABA, UMCULO unscoped = delivery risk
- **SafeFile Pro™ template accuracy**: SA legislative changes = document liability
- **Memory layer sync**: ChromaDB ↔ Supabase ↔ /memory/ KB consistency
- **UTHENGISO graduation**: No defined criteria = indefinite HITL dependency

---

## Output Format

```
## RISK MATRIX — [SCOPE]

| Risk | Severity | Likelihood | Impact | Mitigation | Owner |
|------|----------|------------|--------|------------|-------|
| ... | 🔴 CRITICAL | High | ... | ... | CEO |

## Critical Path (must resolve before next sprint)
1. ...

## Recommendations (next 30 days)
1. ...
```

**Arguments received**: $ARGUMENTS
