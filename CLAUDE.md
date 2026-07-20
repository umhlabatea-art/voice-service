# UMHLABATEA (PTY) LTD · CLAUDE CODE OPERATING BRIEF
> **Version**: 2.0 · **Designation**: 16.1 · **Classification**: SOVEREIGN INTERNAL  
> **CEO**: Njabulo Kubheka · **VPS**: Hostinger KVM2 · Ubuntu 24.04

---

## § 0 — ENTITY NAMING RULES ⚠️ NEVER VIOLATE

| Term | Correct Usage |
|------|--------------|
| Parent company | **UMHLABATEA (Pty) Ltd** — always capitalised exactly thus |
| Primary product | **Umsavati OHS** — SaaS compliance platform; never conflate with the company |
| Media arm | **Umhlabatea Studios** |
| Craft arm | **Umhlabathi** |
| Creative alias | **JAH_B3LOW** (music/creative context only) |
| CSS token prefix | `--umh-` (all custom properties) |

---

## § 1 — OPERATOR CONTEXT

You are operating inside **UMHLABATEA's sovereign engineering environment**.  
The CEO holds SAMTRAC certification with field OHS experience — never over-explain fundamentals.

Every output must be:
- Brand-consistent → see **§ 4**
- Legislatively grounded → see **§ 7**
- ARCHON-aware → see **§ 5**
- Stack-specific → see **§ 6**

---

## § 2 — PRODUCT ARCHITECTURE

### 2.1 Umsavati OHS Platform
> ⚠️ **TARGET ARCHITECTURE — rebuild in progress.** PRS audit 2026-07-20 confirmed the
> figures below describe the intended platform, not deployed reality (see
> `memory/prs-audit-2026-07-20.md`). Rebuild foundation (8 tables, score engine)
> **applied 2026-07-20 with CEO HITL approval** — live schema at
> `products/umsavati-ohs/supabase/schema/20260720_umsavati_foundation.sql`.
> Next: Edge Functions, mobile/web surfaces, SafeFile pipeline.

- **Mobile**: Expo SDK 52 + Supabase
- **Database**: 25 tables · 66 RLS policies · 14 triggers · 11 Edge Functions
- **Web Dashboard**: Next.js (Umsavati OS · `umsavati-os.html`) — 11 pages
- **AI Features**:
  - AI Site Scan Agent (vision OCR — room/safety detection)
  - Google Maps "Site Connect" (satellite/street view virtual site visits)
- **SafeFile Generator**: 4-phase PDF/DOCX export pipeline with SA legislative templates
- **ARCHON Command Centre**: Embedded in Umsavati OS with HITL approval queue

### 2.2 Six-Dimensional OHS Compliance Score Engine

| Dimension | Weight |
|-----------|--------|
| Legal Compliance | 28% |
| Document Completeness | 22% |
| Incident Management | 18% |
| Contractor Qualification | 14% |
| Training Currency | 10% |
| Physical Agent Exposure | 8% |

**Band Output**:
```
COMPLIANT           ≥ 85   →  Hold current status
CONDITIONALLY COMPLIANT  65–84  →  Remediation plan required
NON-COMPLIANT       45–64  →  Auto-route to UmhlabaTea Projects consulting
CRITICAL RISK        < 45   →  Immediate intervention + auto-route
```

### 2.3 Target Industries (SA)
Construction · Agriculture · Healthcare · Education · Manufacturing · Events

### 2.4 Sprint State
```
Sprints 1–6:  LOCKED
Sprint 7:     Contractor Marketplace — DELIVERED
Sprint 8:     Onboarding Pipeline — DELIVERED
Sprint 9+:    GATED — PRS ≥ 85 required to unlock
```

---

## § 3 — ARCHON AGENTIC OS

**Framework**: `ARCHON_AGENTIC_OS_FRAMEWORK_v1.0` (licensed IP)  
**Supabase Backend**: `lpafkclumhhwsvgxrkwv` (Archon n8n Backend)

### Agent Roster

| Agent | Function | Status |
|-------|----------|--------|
| Client Relations | Onboarding & CRM | Active |
| Sales (UTHENGISO) | Lead scoring & outreach | HITL-only |
| Inbox & Admin Officer | Email, scheduling, admin | Partially built |
| IMVELO | TBD (rename pending) | Scoped |
| IZINDABA | TBD (rename pending) | Scoped |
| UMCULO | TBD (rename pending) | Scoped |
| Agent 7 | TBD | Scoped |

### Three-Layer Memory Model
```
Layer 1 — Structured:   Supabase (lpafkclumhhwsvgxrkwv)
Layer 2 — Narrative:    /memory/ markdown KB
Layer 3 — Semantic:     ChromaDB vector store
```

### HITL Gate
**Telegram** · CEO sign-off required on all high-stakes operations.  
UTHENGISO remains HITL-only until autonomous graduation criteria are resolved.

### Open Critical-Path Decisions
1. POPIA lawful basis for outreach (unresolved)
2. Global vertical priority: UK/EU · Gulf · Australia (working hypothesis)
3. UTHENGISO autonomous graduation criteria (unresolved)

---

## § 4 — BRAND SYSTEM (LOCKED — APRIL 2026)

### Colour Tokens
```css
/* Core Palette */
--umh-navy:  #0D1B2A;   /* Deep Navy   — primary background */
--umh-gold:  #C9A84C;   /* Gold        — primary accent     */
--umh-bone:  #fcfbf8;   /* Bone        — light surfaces     */
--umh-steel: #5C6B7A;   /* Steel       — secondary text     */

/* Legacy (Umsavati OS dashboard) */
--umh-forest: #2A3D2E;
--umh-cream:  #FAF6EF;
--umh-legacy-gold: #C4903A;
```

### OHS Compliance Status Palette (NEVER mix with brand gold)
```css
--ohs-compliant:     #2D6A4F;
--ohs-conditional:   #E9C46A;
--ohs-non-compliant: #E76F51;
--ohs-critical:      #C1121F;
```

### Typography Stack
| Role | Typeface | Weights |
|------|----------|---------|
| Display | Fraunces (variable) | 100–900 |
| Body | DM Sans | 400, 500, 600 |
| Mono / Data | IBM Plex Mono | 400, 600 |

### Locked Brand Assets
- **OHS Logo**: Gold metallic U-as-vase + Hard Hat/Gear/Medical Cross/Shield-Hand botanical stems on `#0D1B2A`
- **Parent Mark**: Gold U + single cosmos wildflower on `#0D1B2A`
- **Hero Illustration**: `OHS.png`

---

## § 5 — CONTRABAND STACK (~R130/month)

| Service | Role | Notes |
|---------|------|-------|
| **Supabase** | DB, Auth, Edge Functions, Storage | Primary data layer |
| **n8n** | Workflow automation, ARCHON orchestration | Self-hosted via Coolify |
| **ChromaDB** | Semantic vector memory | ARCHON Layer 3 |
| **Coolify** | Self-hosted PaaS | Manages all services |
| **Open WebUI** | LLM interface | Internal use |
| **OpenRouter / DeepSeek R1** | Primary LLM inference | Replaced Ollama |
| **open-notebook v1.9.0** | Research pipeline | Python 3.12 / uv + Next.js |
| **Claude Code** | Engineering environment | Project IDX |

### Pending Infrastructure Items (Priority)
```
[ ] Uptime Kuma    — no production alerting currently
[ ] Sentry         — no error tracking currently  
[ ] POPIA consent ledger
[ ] Decommission local Ollama (superseded by OpenRouter)
```

---

## § 6 — CODING STANDARDS

### Package Management
```bash
# Python — always use uv
uv add <package>
# If pip is unavoidable
pip install <package> --break-system-packages
# NPM — always use this registry
npm config set registry https://registry.npmjs.org
```

### Supabase
- RLS policies **must exist** on every table before any data insert
- All new schemas use `auth.uid()`-based RLS — never bypass
- Migrations require **manual HITL approval gate** before production execution
- Edge Functions: Deno runtime · TypeScript strict mode

### Mobile (Expo)
- SDK 52 — no Expo Go dependencies in production builds
- Always test on both iOS and Android simulators before sprint sign-off

### Web (Next.js)
- App Router only (no Pages Router)
- Tailwind CSS + shadcn/ui component library
- All CSS tokens prefixed `--umh-`

### API Services
- FastAPI: async · Pydantic v2 models · 48-test suite standard
- Docker: health checks and restart policies on every service
- n8n workflows: error branches and logging nodes required

---

## § 7 — SA LEGISLATIVE REFERENCE

| Legislation | Scope | Key Sections |
|-------------|-------|--------------|
| OHS Act 85/1993 | Primary OHS statute | S.8 (employer), S.14 (employee), S.16 (appointment chain) |
| Construction Regulations 2014 | CIDB construction compliance | CR 5 (competent persons), CR 7 (HSF) |
| Physical Agents Regulations 2025 | Noise, vibration, thermal, radiation | Full coverage required |
| SASREA | Events safety | Venue capacity, crowd management |
| COID Act | Occupational injury compensation | Claims, employer registration |
| POPIA | Data privacy | Outreach requires confirmed lawful basis |

**CIDB Target Grades**: 1–9 (construction) + event organiser licence holders  
**Scoring Reference**: S.8 employer duties, S.14 employee duties, S.16 appointment chain

---

## § 8 — SLASH COMMAND VOCABULARY

| Command | Trigger | Function |
|---------|---------|----------|
| `/XRAY` | Deep audit | System, code, DB, agents, or brand |
| `/SPRINT` | Sprint management | Kick off or continue sprint with PRS gate |
| `/RISK` | Risk assessment | Technical + legislative + operational |
| `/SCORE` | OHS scoring | Six-dimensional compliance calculation |
| `/L99` | Full briefing | Complete platform state for CEO |
| `/INSIGHT` | Intelligence | Market, competitor, expansion, pricing |
| `/BLUEPRINT` | Product design | Full 8-section product blueprint |

---

## § 9 — MONETISATION CONTEXT

| Stream | Platform | Currency |
|--------|----------|----------|
| Umsavati OHS SaaS | Proprietary | USD / ZAR |
| SafeFile Pro™ (lead magnet) | Gumroad (live) | USD |
| UmhlabaTea Projects consulting | Direct | ZAR |
| Digital products | Gumroad · Etsy · Envato | USD preferred |

**Pricing Philosophy**: Alex Hormozi value-stack model — irresistible offer architecture.  
**List prices in USD** to maximise ROI against ZAR operating costs.

---

## § 11 — DEFAULT DEV TOOLING (auto-loaded every session)

Installed into the repo (`.claude/`) and loaded on session start; see `AGENTS.md`.

| Tool | What | Default | Where |
|------|------|---------|-------|
| **caveman** | Compressed output mode — drops filler, keeps code/commands/errors exact | **ON** (`full`) | `.claude/plugins/caveman/`, config `.caveman/config.json` |
| **graphify** | Codebase → queryable knowledge graph (`graphify-out/GRAPH_REPORT.md`) | Installed on session start (pip `graphifyy`), skill available | `.claude/skills/graphify/`, hook `.claude/hooks/graphify-bootstrap.sh` |

- caveman: switch level `/caveman lite|full|ultra`; disable with "stop caveman".
- graphify: consult `graphify-out/GRAPH_REPORT.md` before architecture questions; run `graphify update .` after code changes (AST-only, no API cost).
- Ephemeral-container note: the graphify pip package reinstalls per fresh session (backgrounded, non-blocking); caveman is fully vendored so it needs no network.

---

## § 10 — SESSION RULES (NON-NEGOTIABLE)

1. Never conflate **UMHLABATEA** (company) with **Umsavati OHS** (product)
2. All brand outputs must reference locked tokens (§ 4)
3. No Supabase migrations execute without HITL approval gate
4. UTHENGISO remains HITL-only until graduation criteria resolved
5. Always `uv` for Python · `--break-system-packages` if pip is unavoidable
6. NPM registry: `registry.npmjs.org` — not npmmirror
7. PRS gate ≥ 85 required before any new sprint unlocks
8. POPIA compliance is non-negotiable on all outreach and data collection
9. Read `/memory/roadmap.md` before any sprint-related task
10. All CSS custom properties use `--umh-` prefix
11. Default dev tooling loads every session (§ 11): caveman ON, graphify available
