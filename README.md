# UMHLABATEA (PTY) LTD — Claude Code Operating System
> Designation 16.1 · CEO: Njabulo Kubheka · Version 2.0

---

## Quick Start

### 1. Drop this directory into your project root
```bash
cp -r umhlabatea-claude-code/. /path/to/your/project/
```

### 2. Fill in environment variables
```bash
cp .env.example .env
# Edit .env with your actual keys
```

### 3. Open in Claude Code
```bash
claude /path/to/your/project
```
`CLAUDE.md` is read automatically. All slash commands are loaded.

### 4. Open in Cowork
Point Cowork at the project directory. `CLAUDE.md` provides full context.

---

## Directory Structure

```
.
├── CLAUDE.md                    ← Master system prompt (auto-loaded)
├── README.md                    ← This file
├── .env.example                 ← Environment variables template
├── .claude/
│   ├── settings.json            ← Claude Code model & permission config
│   └── commands/                ← Slash commands (7 total)
│       ├── SPRINT.md            → /SPRINT [start|continue|status|close]
│       ├── XRAY.md              → /XRAY [system|db|agents|brand|path]
│       ├── L99.md               → /L99
│       ├── SCORE.md             → /SCORE [contractor] or simulate
│       ├── RISK.md              → /RISK [all|technical|regulatory|operational]
│       ├── INSIGHT.md           → /INSIGHT [market|competitor|product|expansion|pricing]
│       └── BLUEPRINT.md         → /BLUEPRINT [product-concept]
├── memory/                      ← Persistent KB (update after each session)
│   ├── roadmap.md               ← Sprint state & PRS log ← UPDATE THIS
│   ├── agents.md                ← ARCHON agent roster & status
│   ├── stack.md                 ← Contraband Stack service registry
│   ├── legislation.md           ← SA legislative reference
│   ├── brand.md                 ← Locked brand tokens & assets
│   └── growth.md                ← Revenue streams & monetisation
├── products/
│   ├── umsavati-ohs/            ← Primary SaaS platform
│   │   ├── supabase/            ← Schema & edge functions
│   │   ├── mobile/              ← Expo SDK 52
│   │   ├── web/                 ← Next.js dashboard
│   │   └── safefile/            ← SafeFile Generator
│   ├── studios/                 ← Umhlabatea Studios
│   └── umhlabathi/              ← Craft furniture
├── agents/
│   └── archon/                  ← ARCHON agent code & configs
├── infra/
│   ├── coolify/                 ← Coolify service configs
│   ├── n8n/                     ← n8n workflow exports
│   └── docker/                  ← Docker compose files
└── templates/
    ├── ohs/                     ← OHS compliance templates
    ├── safefile/                 ← SafeFile Pro™ modules
    └── legal/                   ← Legal/compliance docs
```

---

## Slash Command Reference

| Command | Usage | What it does |
|---------|-------|-------------|
| `/SPRINT` | `/SPRINT start 9` | Gate-checked sprint kick-off with full brief |
| `/XRAY` | `/XRAY db` | Deep audit — system, DB, agents, brand, or any file |
| `/L99` | `/L99` | Full CEO platform briefing, no padding |
| `/SCORE` | `/SCORE "ABC Construction"` | Six-dimensional OHS compliance score |
| `/RISK` | `/RISK regulatory` | Risk matrix with severity and mitigations |
| `/INSIGHT` | `/INSIGHT pricing` | Market/competitive/strategic intelligence |
| `/BLUEPRINT` | `/BLUEPRINT "contractor toolkit"` | Full 8-section product blueprint |

---

## Critical Rules (Never Violate)

1. **Entity naming**: Company = `UMHLABATEA (Pty) Ltd` · Product = `Umsavati OHS`
2. **PRS gate**: No new sprint without PRS ≥ 85 — update `/memory/roadmap.md`
3. **HITL**: All UTHENGISO sends and high-stakes operations require Telegram CEO approval
4. **Brand tokens**: All CSS uses `--umh-` prefix — no hardcoded hex
5. **NPM**: Always `registry.npmjs.org` — never npmmirror
6. **Python**: Always `uv` · `pip install` requires `--break-system-packages`
7. **Supabase**: RLS on every table · migrations need HITL gate

---

## Updating Memory Files

After every working session, update the relevant `/memory/*.md` file:
- Sprint progress → `roadmap.md`
- Agent changes → `agents.md`
- New services → `stack.md`
- New legislative context → `legislation.md`

This ensures the next session picks up exactly where this one ended.

---

*All rights reserved — UMHLABATEA (Pty) Ltd · UMHLABATEA_concept.store*
