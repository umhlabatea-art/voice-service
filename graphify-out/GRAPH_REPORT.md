# Graph Report - voice-service  (2026-07-20)

## Corpus Check
- 130 files · ~56,273 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 874 nodes · 1277 edges · 74 communities (62 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a0413f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caveman-stats.js
- dependencies
- organisations/page.tsx
- UMHLABATEA (PTY) LTD · CLAUDE CODE OPERATING BRIEF
- compress.py
- validate.py
- compilerOptions
- caveman-shrink/package.json
- What You Must Do When Invoked
- scoring.ts
- types.ts
- [id]/page.tsx
- caveman-compress/README.md
- index.js
- Session Log — 2026-07-20
- ⚡ XRAY RE-SCORE — SYSTEM (post foundation-schema apply)
- supabaseServer
- incidents/page.tsx
- documents/page.tsx
- physical-agents/page.tsx
- cavecrew/SKILL.md
- Caveman Help
- training/page.tsx
- Agent Roster
- Caveman Compress
- caveman/SKILL.md
- caveman-commit
- caveman-review
- caveman-init.js
- UMHLABATEA Brand System — Locked Tokens
- Primary Legislation
- UMHLABATEA (PTY) LTD — Claude Code Operating System
- archon/page.tsx
- Scope Definitions
- Audit Matrix
- Caveman Hooks
- graphify reference: extra exports and benchmark
- marketplace.json
- caveman-shrink
- Growth Operations & Monetisation — UMHLABATEA
- Umsavati OS — Web Dashboard
- POPIA Lawful-Basis Memo — UTHENGISO Outreach
- /RISK — Risk Surface Assessment
- /SPRINT — Sprint Management Protocol
- caveman-stats
- UMHLABATEA — Contraband Stack Reference
- /SCORE — OHS Compliance Score Engine
- graphify reference: query, path, explain
- Umsavati OHS — Sprint Roadmap & PRS Log
- `score-organisation` — Umsavati OHS Scoring Edge Function
- sidebar-nav.tsx
- /BLUEPRINT — Product Blueprint Generator
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- middleware.ts
- /L99 — Level 99 Platform Briefing
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- app/layout.tsx
- graphify-bootstrap.sh
- __init__.py
- hooks/package.json
- caveman-openclaw-bootstrap.md
- extraction-spec.md
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `supabaseServer()` - 44 edges
2. `Session Log — 2026-07-20` - 18 edges
3. `main()` - 17 edges
4. `Organisation` - 16 edges
5. `compilerOptions` - 16 edges
6. `cn()` - 15 edges
7. `validate()` - 14 edges
8. `Card()` - 13 edges
9. `CardHeader()` - 13 edges
10. `CardTitle()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `OrganisationDetailPage()` --calls--> `supabaseServer()`  [EXTRACTED]
  products/umsavati-ohs/web/src/app/(dashboard)/organisations/[id]/page.tsx → products/umsavati-ohs/web/src/lib/supabase/server.ts
- `compress_file()` --calls--> `validate()`  [EXTRACTED]
  .claude/plugins/caveman/skills/caveman-compress/scripts/compress.py → .claude/plugins/caveman/skills/caveman-compress/scripts/validate.py
- `createAppointment()` --calls--> `supabaseServer()`  [EXTRACTED]
  products/umsavati-ohs/web/src/app/(dashboard)/appointments/actions.ts → products/umsavati-ohs/web/src/lib/supabase/server.ts
- `deleteAppointment()` --calls--> `supabaseServer()`  [EXTRACTED]
  products/umsavati-ohs/web/src/app/(dashboard)/appointments/actions.ts → products/umsavati-ohs/web/src/lib/supabase/server.ts
- `load()` --calls--> `supabaseServer()`  [EXTRACTED]
  products/umsavati-ohs/web/src/app/(dashboard)/appointments/page.tsx → products/umsavati-ohs/web/src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (74 total, 12 thin omitted)

### Community 0 - "caveman-stats.js"
Cohesion: 0.06
Nodes (61): AGENT_ENV_MAP, applyOverrides(), fs, patchFrontmatterModel(), path, resolvePluginRoot(), flagPath, fs (+53 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, @fontsource/dm-sans, @fontsource/ibm-plex-mono, @fontsource-variable/fraunces, lucide-react, next, dependencies (+37 more)

### Community 2 - "organisations/page.tsx"
Cohesion: 0.15
Nodes (23): loadOrganisations(), metadata, OrganisationsPage(), DashboardPage(), DIMENSIONS, LatestScore, loadLatestScore(), LoginPage() (+15 more)

### Community 3 - "UMHLABATEA (PTY) LTD · CLAUDE CODE OPERATING BRIEF"
Cohesion: 0.06
Nodes (30): § 0 — ENTITY NAMING RULES ⚠️ NEVER VIOLATE, § 10 — SESSION RULES (NON-NEGOTIABLE), § 1 — OPERATOR CONTEXT, 2.1 Umsavati OHS Platform, 2.2 Six-Dimensional OHS Compliance Score Engine, 2.3 Target Industries (SA), 2.4 Sprint State, § 2 — PRODUCT ARCHITECTURE (+22 more)

### Community 4 - "compress.py"
Cohesion: 0.12
Nodes (27): main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), is_sensitive_path() (+19 more)

### Community 5 - "validate.py"
Cohesion: 0.16
Nodes (22): benchmark_pair(), count_tokens(), main(), print_table(), Path, count_bullets(), extract_code_blocks(), extract_headings() (+14 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 7 - "caveman-shrink/package.json"
Cohesion: 0.08
Nodes (25): author, bin, caveman-shrink, description, files, homepage, keywords, license (+17 more)

### Community 8 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "scoring.ts"
Cohesion: 0.17
Nodes (20): AppointmentRow, computeDimensions(), contractorQualification(), ContractorRow, Dimensions, documentCompleteness(), DocumentRow, incidentManagement() (+12 more)

### Community 10 - "types.ts"
Cohesion: 0.14
Nodes (21): createAppointment(), deleteAppointment(), FormState, AppointmentForm(), DeleteAppointmentButton(), AppointmentsPage(), appointmentStatus(), load() (+13 more)

### Community 11 - "[id]/page.tsx"
Cohesion: 0.14
Nodes (20): createOrganisation(), deleteOrganisation(), FormState, OrgFields, parseOrgFields(), runScan(), updateOrganisation(), DIMENSIONS (+12 more)

### Community 12 - "caveman-compress/README.md"
Cohesion: 0.09
Nodes (20): Before / After, Benchmarks, How It Work, <img src="../../docs/assets/dancing-rock.svg" width="20" height="20" alt="rock"/> Caveman (285 tokens), Install, 📄 Original (706 tokens), Part of Caveman, Security (+12 more)

### Community 13 - "index.js"
Cohesion: 0.13
Nodes (17): compress(), compressDescriptionsInPlace(), compressProse(), FILLERS, HEDGES, LEADERS, PLEASANTRIES, PROTECTED_PATTERNS (+9 more)

### Community 14 - "Session Log — 2026-07-20"
Cohesion: 0.11
Nodes (18): 10 · Addendum — first Edge Function: `score-organisation` · PRS 38 → 40, 11 · Addendum — Umsavati OS dashboard shell · PRS 40 → 42, 12 · Addendum — Organisations module (first working CRUD) · PRS 42 → 43, 13 · Addendum — Appointments module · PRS 43 → 44, 14 · Addendum — SafeFile Documents module · PRS 44 → 45, 15 · Addendum — Incidents module · PRS 45 → 46, 16 · Addendum — Contractors + Training + Physical Agents · PRS 46 → 48, 1 · Workspace kit installed (+10 more)

### Community 15 - "⚡ XRAY RE-SCORE — SYSTEM (post foundation-schema apply)"
Cohesion: 0.11
Nodes (17): Critical Issues (blocking — must fix before Sprint 9), Foundation-apply verification evidence, Passed Checks, Path to PRS ≥ 85 (re-prioritised), PRS = 38 / 100 → CRITICAL band (< 45) · **+12 vs morning audit**, PRS — Platform Readiness Score, Recommended Actions (prioritised), Update (same day): Appointments module → PRS 43 → 44 (+9 more)

### Community 16 - "supabaseServer"
Cohesion: 0.22
Nodes (14): createContractor(), deleteContractor(), FormState, toggleCr5(), ContractorForm(), DeleteContractorButton(), ToggleCr5Button(), ContractorsPage() (+6 more)

### Community 17 - "incidents/page.tsx"
Cohesion: 0.20
Nodes (15): createIncident(), deleteIncident(), FormState, DeleteIncidentButton(), IncidentForm(), IncidentsPage(), isCompliant(), load() (+7 more)

### Community 18 - "documents/page.tsx"
Cohesion: 0.21
Nodes (14): createDocument(), deleteDocument(), FormState, toggleSigned(), DeleteDocumentButton(), DocumentForm(), ToggleSignedButton(), DocumentsPage() (+6 more)

### Community 19 - "physical-agents/page.tsx"
Cohesion: 0.22
Nodes (12): createReading(), deleteReading(), FormState, load(), Loaded, metadata, PhysicalAgentsPage(), DeleteReadingButton() (+4 more)

### Community 20 - "cavecrew/SKILL.md"
Cohesion: 0.14
Nodes (12): cavecrew, Example chaining, How to invoke, Model overrides, See also, What it does, Auto-clarity (inherited), Chaining patterns (+4 more)

### Community 21 - "Caveman Help"
Cohesion: 0.14
Nodes (12): caveman-help, Example output, How to invoke, See also, What it does, Caveman Help, Configure Default Mode, Deactivate (+4 more)

### Community 22 - "training/page.tsx"
Cohesion: 0.24
Nodes (11): createTrainingRecord(), deleteTrainingRecord(), FormState, isValid(), load(), Loaded, metadata, TrainingPage() (+3 more)

### Community 23 - "Agent Roster"
Cohesion: 0.15
Nodes (12): 1. Client Relations (formerly SIYABONA), 2. Sales — UTHENGISO, 3. Inbox & Admin Officer (7th Agent), 4. IMVELO, 5. IZINDABA, 6. UMCULO, 7. [Agent 7], Agent Roster (+4 more)

### Community 24 - "Caveman Compress"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 25 - "caveman/SKILL.md"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 26 - "caveman-commit"
Cohesion: 0.18
Nodes (9): caveman-commit, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 27 - "caveman-review"
Cohesion: 0.18
Nodes (9): caveman-review, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 28 - "caveman-init.js"
Cohesion: 0.29
Nodes (10): AGENTS, fs, help(), loadOpenclawHelper(), loadRuleBody(), main(), parseArgs(), path (+2 more)

### Community 29 - "UMHLABATEA Brand System — Locked Tokens"
Cohesion: 0.18
Nodes (10): Brand Assets (Locked — Never Recreate Without CEO Approval), Brand Voice (Prose Register), Colour Tokens (`--umh-` prefix required), Component Conventions, DM Sans (Body), Fraunces (Display / Hero), IBM Plex Mono (Data / Code), Spacing System (+2 more)

### Community 30 - "Primary Legislation"
Cohesion: 0.18
Nodes (10): COID Act (Compensation for Occupational Injuries and Diseases), Compliance Score Mapping, Construction Regulations 2014, Document Register (SafeFile Pro™ Modules), OHS Act 85/1993, Physical Agents Regulations 2025, POPIA (Protection of Personal Information Act), Primary Legislation (+2 more)

### Community 31 - "UMHLABATEA (PTY) LTD — Claude Code Operating System"
Cohesion: 0.18
Nodes (10): 1. Drop this directory into your project root, 2. Fill in environment variables, 3. Open in Claude Code, 4. Open in Cowork, Critical Rules (Never Violate), Directory Structure, Quick Start, Slash Command Reference (+2 more)

### Community 32 - "archon/page.tsx"
Cohesion: 0.20
Nodes (4): metadata, metadata, metadata, PagePlaceholder()

### Community 33 - "Scope Definitions"
Cohesion: 0.22
Nodes (8): competitor, expansion, /INSIGHT — Strategic Intelligence Briefing, market, Output Format, pricing, product, Scope Definitions

### Community 34 - "Audit Matrix"
Cohesion: 0.22
Nodes (8): agents, Audit Matrix, brand, db, Output Format, [path], system, /XRAY — Deep Audit Protocol

### Community 35 - "Caveman Hooks"
Cohesion: 0.22
Nodes (8): `caveman-activate.js` — SessionStart hook, Caveman Hooks, `caveman-mode-tracker.js` — UserPromptSubmit hook, `caveman-statusline.sh` / `caveman-statusline.ps1` — Statusline badge script, How It Works, Statusline Badge, Uninstall, What's Included

### Community 36 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 37 - "marketplace.json"
Cohesion: 0.25
Nodes (7): description, name, owner, name, url, plugins, $schema

### Community 38 - "caveman-shrink"
Cohesion: 0.25
Nodes (7): caveman-shrink, Configuration, Install, License, Status, Use it, What it does NOT touch

### Community 39 - "Growth Operations & Monetisation — UMHLABATEA"
Cohesion: 0.25
Nodes (7): Distribution Roadmap, Global Expansion Hypothesis, Growth Operations & Monetisation — UMHLABATEA, Pricing Framework (Hormozi Value-Stack Model), Revenue Streams, SafeFile Pro™ Lead Magnet Funnel, UTHENGISO (Sales Agent) Pipeline

### Community 40 - "Umsavati OS — Web Dashboard"
Cohesion: 0.25
Nodes (7): Brand system (locked — CLAUDE.md §4), Organisations module, Pages (11 — CLAUDE.md §2.1), Run, Stack, Umsavati OS — Web Dashboard, Working modules

### Community 41 - "POPIA Lawful-Basis Memo — UTHENGISO Outreach"
Cohesion: 0.25
Nodes (7): 1 · The question, 2 · The realistic options, 3 · Recommended structure (for sign-off), 4 · Balancing test (legitimate interest), 5 · Consent ledger — design (schema draft, HITL gate applies), 6 · Decision requested, POPIA Lawful-Basis Memo — UTHENGISO Outreach

### Community 42 - "/RISK — Risk Surface Assessment"
Cohesion: 0.29
Nodes (6): Operational Risk Surface, Output Format, Regulatory Risk Surface, Risk Matrix Template, /RISK — Risk Surface Assessment, Technical Risk Surface

### Community 43 - "/SPRINT — Sprint Management Protocol"
Cohesion: 0.29
Nodes (6): Action: close, Action: continue, Action: start, Action: status, Protocol, /SPRINT — Sprint Management Protocol

### Community 44 - "caveman-stats"
Cohesion: 0.29
Nodes (5): caveman-stats, Example output, How to invoke, See also, What it does

### Community 45 - "UMHLABATEA — Contraband Stack Reference"
Cohesion: 0.29
Nodes (6): Environment Variables Template, open-notebook v1.9.0, Pending Infrastructure (Priority Order), Python Convention, Service Registry, UMHLABATEA — Contraband Stack Reference

### Community 46 - "/SCORE — OHS Compliance Score Engine"
Cohesion: 0.33
Nodes (5): Band Output, Data Collection Protocol, /SCORE — OHS Compliance Score Engine, Score Output Format, Six-Dimensional Scoring Engine

### Community 47 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 48 - "Umsavati OHS — Sprint Roadmap & PRS Log"
Cohesion: 0.33
Nodes (5): Active Sprint: [N/A — Update when Sprint 9 begins], Claude Code Handover Reference, Platform Readiness Score (PRS) Gate, Sprint Log, Umsavati OHS — Sprint Roadmap & PRS Log

### Community 49 - "`score-organisation` — Umsavati OHS Scoring Edge Function"
Cohesion: 0.33
Nodes (5): Contract, Rubric changes, Rubric v1 (`scoring.ts` — pure module, unit-tested), `score-organisation` — Umsavati OHS Scoring Edge Function, Testing

### Community 51 - "/BLUEPRINT — Product Blueprint Generator"
Cohesion: 0.50
Nodes (3): /BLUEPRINT — Product Blueprint Generator, Blueprint Protocol, Section Template

### Community 52 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 53 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 54 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **437 isolated node(s):** `graphify-bootstrap.sh script`, `$schema`, `name`, `description`, `name` (+432 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabaseServer()` connect `supabaseServer` to `organisations/page.tsx`, `types.ts`, `[id]/page.tsx`, `incidents/page.tsx`, `documents/page.tsx`, `physical-agents/page.tsx`, `training/page.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `cn()` connect `organisations/page.tsx` to `sidebar-nav.tsx`, `[id]/page.tsx`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `graphify-bootstrap.sh script`, `$schema`, `name` to the rest of the system?**
  _437 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caveman-stats.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05547785547785548 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Should `UMHLABATEA (PTY) LTD · CLAUDE CODE OPERATING BRIEF` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `compress.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._