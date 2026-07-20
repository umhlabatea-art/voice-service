# UMHLABATEA (PTY) LTD · CLAUDE CODE OPERATING BRIEF
> **v2.1** · SOVEREIGN INTERNAL · CEO Njabulo Kubheka · VPS Hostinger KVM2 (Ubuntu 24.04)
> Directory, not log. Dynamic state lives in `/memory/`.

## § 0 — ENTITY NAMING RULES ⚠️ NEVER VIOLATE

| Term | Correct Usage |
|------|--------------|
| Parent company | **UMHLABATEA (Pty) Ltd** — always capitalised exactly thus |
| Primary product | **Umsavati OHS** — SaaS compliance platform; never conflate with the company |
| Media arm | **Umhlabatea Studios** |
| Craft arm | **Umhlabathi** |
| Creative alias | **JAH_B3LOW** (music/creative context only) |
| CSS token prefix | `--umh-` (all custom properties) |

## § 1 — OPERATOR CONTEXT

Sovereign engineering environment. CEO holds SAMTRAC + field OHS experience — never over-explain fundamentals. Every output: brand-consistent (§4), legislatively grounded (§7), ARCHON-aware (§3), stack-specific (§6).

## § 2 — PRODUCT ARCHITECTURE

### 2.1 Umsavati OHS Platform
> ⚠️ **TARGET ARCHITECTURE — rebuild in progress.** Figures below are the intended
> platform, not deployed reality. Live status + PRS trail: `memory/roadmap.md`,
> `memory/prs-audit-2026-07-20.md`.

- **Mobile**: Expo SDK 52 + Supabase
- **Database** (target): 25 tables · 66 RLS policies · 14 triggers · 11 Edge Functions
- **Web Dashboard**: Next.js (Umsavati OS) — 11 pages
- **AI Features**: AI Site Scan Agent (vision OCR); Google Maps "Site Connect" (virtual site visits)
- **SafeFile Generator**: 4-phase PDF/DOCX export on SA legislative templates
- **ARCHON Command Centre**: embedded in Umsavati OS with HITL approval queue

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
COMPLIANT                ≥ 85    →  Hold current status
CONDITIONALLY COMPLIANT  65–84   →  Remediation plan required
NON-COMPLIANT            45–64   →  Auto-route to UmhlabaTea Projects consulting
CRITICAL RISK            < 45    →  Immediate intervention + auto-route
```

### 2.3 Target Industries (SA)
Construction · Agriculture · Healthcare · Education · Manufacturing · Events

### 2.4 Sprint State
Sprints 1–8 locked/delivered; Sprint 9+ GATED (PRS ≥ 85). Live sprint log: `memory/roadmap.md`.

## § 3 — ARCHON AGENTIC OS

**Framework**: `ARCHON_AGENTIC_OS_FRAMEWORK_v1.0` (licensed IP) · **Backend**: `lpafkclumhhwsvgxrkwv`

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

**Three-Layer Memory**: L1 Structured — Supabase · L2 Narrative — `/memory/` markdown · L3 Semantic — ChromaDB

**HITL Gate**: Telegram · CEO sign-off on all high-stakes ops. UTHENGISO stays HITL-only until graduation criteria resolve.

**Open Critical-Path Decisions**: (1) POPIA lawful basis for outreach · (2) global vertical priority UK/EU · Gulf · Australia · (3) UTHENGISO autonomous graduation criteria.

## § 4 — BRAND SYSTEM (LOCKED — APRIL 2026)

### Colour Tokens
```css
--umh-navy:  #0D1B2A;   /* primary background */
--umh-gold:  #C9A84C;   /* primary accent     */
--umh-bone:  #fcfbf8;   /* light surfaces     */
--umh-steel: #5C6B7A;   /* secondary text     */
/* Legacy (Umsavati OS): --umh-forest #2A3D2E · --umh-cream #FAF6EF · --umh-legacy-gold #C4903A */
```

### OHS Compliance Status Palette (NEVER mix with brand gold)
```css
--ohs-compliant:     #2D6A4F;
--ohs-conditional:   #E9C46A;
--ohs-non-compliant: #E76F51;
--ohs-critical:      #C1121F;
```

### Typography
| Role | Typeface | Weights |
|------|----------|---------|
| Display | Fraunces (variable) | 100–900 |
| Body | DM Sans | 400, 500, 600 |
| Mono / Data | IBM Plex Mono | 400, 600 |

**Locked assets**: OHS Logo (gold U-as-vase + botanical stems on `#0D1B2A`) · Parent Mark (gold U + cosmos wildflower) · Hero `OHS.png`.

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
| **Claude Code** | Engineering environment | — |

Pending infra (live status in `memory/stack.md`): Uptime Kuma + GlitchTip deploy (configs ready, `infra/docker/`); decommission local Ollama.

## § 6 — CODING STANDARDS

- **Python**: `uv add <pkg>`; if pip unavoidable, `pip install <pkg> --break-system-packages`.
- **NPM**: registry `https://registry.npmjs.org` only (never npmmirror).
- **Supabase**: RLS on every table before any insert; `auth.uid()`-based, never bypass; migrations gated on HITL; Edge Functions Deno + TS strict.
- **Mobile (Expo)**: SDK 52, no Expo Go deps in prod; test iOS + Android sims before sign-off.
- **Web (Next.js)**: App Router only; Tailwind + shadcn/ui; all CSS tokens `--umh-`.
- **API (FastAPI)**: async · Pydantic v2 · 48-test standard. Docker: health checks + restart policies. n8n: error branches + logging nodes.

## § 7 — SA LEGISLATIVE REFERENCE

| Legislation | Scope | Key Sections |
|-------------|-------|--------------|
| OHS Act 85/1993 | Primary OHS statute | S.8 (employer), S.14 (employee), S.16 (appointment chain) |
| Construction Regulations 2014 | CIDB construction compliance | CR 5 (competent persons), CR 7 (HSF) |
| Physical Agents Regulations 2025 | Noise, vibration, thermal, radiation | Full coverage required |
| SASREA | Events safety | Venue capacity, crowd management |
| COID Act | Occupational injury compensation | Claims, employer registration |
| POPIA | Data privacy | Outreach requires confirmed lawful basis |

**CIDB Target Grades**: 1–9 (construction) + event organiser licence holders.

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

## § 9 — MONETISATION CONTEXT

| Stream | Platform | Currency |
|--------|----------|----------|
| Umsavati OHS SaaS | Proprietary | USD / ZAR |
| SafeFile Pro™ (lead magnet) | Gumroad (live) | USD |
| UmhlabaTea Projects consulting | Direct | ZAR |
| Digital products | Gumroad · Etsy · Envato | USD preferred |

Pricing: Alex Hormozi value-stack model. List in USD to maximise ROI against ZAR costs.

## § 11 — DEFAULT DEV TOOLING (auto-loaded every session)

Committed to repo (`.claude/`), loaded on session start; see `AGENTS.md`.

| Tool | What | Default | Where |
|------|------|---------|-------|
| **caveman** | Compressed output — drops filler, keeps code/commands/errors exact | **ON** (`full`) | `.claude/plugins/caveman/`, `.caveman/config.json` |
| **graphify** | Codebase → queryable knowledge graph | pip `graphifyy` on start; skill available | `.claude/skills/graphify/`, `.claude/hooks/graphify-bootstrap.sh` |

caveman: `/caveman lite|full|ultra`, or "stop caveman". graphify: consult `graphify-out/GRAPH_REPORT.md` before architecture questions; `graphify update .` after code changes (AST-only, no API cost). Ephemeral container: graphify reinstalls per session (backgrounded); caveman fully vendored.

## § 10 — SESSION RULES (NON-NEGOTIABLE)

1. Never conflate **UMHLABATEA** (company) with **Umsavati OHS** (product)
2. All brand outputs reference locked tokens (§4); all CSS custom properties use `--umh-`
3. No Supabase migrations execute without HITL approval gate
4. UTHENGISO stays HITL-only until graduation criteria resolved
5. Python `uv` (`--break-system-packages` if pip unavoidable); NPM registry `registry.npmjs.org`
6. PRS gate ≥ 85 before any new sprint unlocks
7. POPIA non-negotiable on all outreach and data collection
8. Read `/memory/roadmap.md` before any sprint-related task
9. Default dev tooling loads every session (§11): caveman ON, graphify available
