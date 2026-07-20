# /SPRINT — Sprint Management Protocol

**Usage**: `/SPRINT [action] [sprint-name-or-number]`  
**Actions**: `start` · `continue` · `status` · `close`

---

## Protocol

1. **Load state**: Read `/memory/roadmap.md` for current sprint context
2. **Gate check**: Confirm PRS (Platform Readiness Score) ≥ 85 before unlocking a new sprint
3. **Execute action** per $ARGUMENTS below

---

## Action: start
Generate a full sprint brief:

```
## SPRINT [N] — [NAME]
**PRS Gate**: [SCORE]/100 — [PASS ✓ | BLOCKED ✗]
**Date**: [ISO date]

### Objectives (max 5)
1. ...

### Technical Deliverables
| Deliverable | File Path | Complexity |
|-------------|-----------|------------|
| ... | ... | S/M/L/XL |

### Acceptance Criteria
- [ ] ...

### HITL Checkpoints (require Telegram CEO approval)
- [ ] ...

### Dependencies / Blockers
- ...
```

## Action: continue
Read `/memory/roadmap.md`, identify last completed task, resume from next open item.

## Action: status
Output a concise sprint dashboard: objectives % complete, open blockers, HITL queue.

## Action: close
Generate sprint retrospective: delivered vs scoped, PRS delta, next sprint unlock status.

---

**Arguments received**: $ARGUMENTS

Reference CLAUDE.md § 2.4 for sprint state and § 10 rule 7 for PRS gate.
