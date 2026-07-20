# ARCHON Agentic OS — Agent Roster & Status

**Framework**: `ARCHON_AGENTIC_OS_FRAMEWORK_v1.0` (licensed IP)  
**Supabase Backend**: `lpafkclumhhwsvgxrkwv` (Archon n8n Backend)  
**Orchestration**: n8n (self-hosted via Coolify)  
**HITL Gate**: Telegram — CEO (Njabulo Kubheka) approval required

---

## Agent Roster

### 1. Client Relations (formerly SIYABONA)
- **Function**: Client onboarding, CRM management, relationship maintenance
- **Status**: 🟢 Active
- **Permissions**: Notion, Gmail, Calendar, Canva
- **Notes**: Manages Umsavati OHS client onboarding pipeline

### 2. Sales — UTHENGISO
- **Function**: Lead scoring, outreach, sales pipeline management
- **Status**: 🟡 HITL-only (not autonomous)
- **Permissions**: Clay, Notion, Gmail, Calendar, Canva, Gamma
- **Lead Quality Score Model**: Built, operational under human review
- **Autonomous graduation criteria**: ⚠️ UNRESOLVED — CEO decision pending
- **Notes**: LinkedIn outreach targets construction + events ICPs

### 3. Inbox & Admin Officer (7th Agent)
- **Function**: Email processing, scheduling, admin automation
- **Status**: 🟠 Partially built
- **Supabase schema**: Migration pending manual approval gate
- **Notes**: Schema designed; HITL migration gate not yet approved

### 4. IMVELO
- **Function**: TBD (rename from isiZulu pending)
- **Status**: 🔵 Scoped
- **Notes**: Awaiting CEO brief and naming decision

### 5. IZINDABA
- **Function**: TBD (rename from isiZulu pending)
- **Status**: 🔵 Scoped
- **Notes**: Awaiting CEO brief and naming decision

### 6. UMCULO
- **Function**: TBD (rename from isiZulu pending)
- **Status**: 🔵 Scoped
- **Notes**: Awaiting CEO brief and naming decision

### 7. [Agent 7]
- **Function**: TBD
- **Status**: 🔵 Scoped

---

## Memory Model (Three-Layer)

```
Layer 1 — Structured DB:   Supabase (lpafkclumhhwsvgxrkwv)
                            - All new schemas: auth.uid()-based RLS
                            - Empty at last session; clean state

Layer 2 — Narrative KB:    /memory/ (this directory)
                            - Human-readable markdown
                            - Updated by Claude Code sessions

Layer 3 — Semantic Vector: ChromaDB
                            - Semantic search across all KB
                            - Self-hosted via Coolify
```

---

## Open Critical-Path Decisions

| Decision | Status | Impact |
|----------|--------|--------|
| POPIA lawful basis for outreach | ⚠️ Unresolved | Blocks UTHENGISO scale |
| Global vertical priority (UK/EU, Gulf, AU) | ⚠️ Hypothesis only | Affects Sprint 9+ scope |
| UTHENGISO autonomous graduation criteria | ⚠️ Unresolved | Keeps Sales at HITL indefinitely |

---

## Naming Convention Rule
All agents renamed from isiZulu code names to plain English titles.  
Old → New: `SIYABONA → Client Relations` · `UTHENGISO → Sales (UTHENGISO retained as brand name)`  
Pending: IMVELO · IZINDABA · UMCULO
