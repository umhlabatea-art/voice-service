# Global Claude Code Preferences

Copy this file to your local `~/.claude/CLAUDE.md` to persist global working preferences across all Claude Code sessions and projects.

---

# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

---

# Global Working Preferences (all projects)

## Purpose
Building AI-driven applications, multi-tenant SaaS platforms, and digital products. Goals: ship production-grade code efficiently; design multi-agent + API systems; create educational/marketing content (YouTube, blogs, sales pages); do it without hitting token/compute limits. Always optimise for correctness, clarity, and **token/compute efficiency**.

## Working style
- One task/thread at a time. On `/clear`, re-derive context from latest files + `CLAUDE.md`; ignore stale assumptions from prior threads.
- Assume technically proficient (Python, JS/TS, SQL, Bash, Docker, cloud). Concise; skip beginner explanations unless asked.
- Care about both global scalability and practical implementation detail.

## Effort levels
Tasks may be tagged **low / medium / high**; default **medium**.
- **low**: fast approximate, minimal explanation, OK to skip edge cases/tests.
- **medium**: solid practical, major edge cases, short design notes.
- **high**: production-ready, trade-offs, tests + validation + rollout notes.

## Token & compute discipline
- **Input**: work on diffs/focused sections, not whole files; ask which parts matter before heavy analysis on large context; propose `/compact` or `/clear` when bloated.
- **Output**: short and direct by default; no long prose unless asked; code = only necessary functions/modules, no boilerplate unless requested. "brief/tl;dr/summary" → ≤ ~8 sentences.
- **Minimum-viable model**: route mechanical work (scraping, summarising, formatting) to cheaper/specialised models or flows; reserve frontier models for reasoning, design, non-obvious trade-offs, high-stakes logic/content.
- **Scripts over calls**: if a deterministic script does it reliably, design the script instead of repeated AI calls.

## Code & architecture
1. Clarify constraints — stack, tenancy (single/multi), performance/scale/cost.
2. Propose the minimal viable architecture first; then an extended version (caching, observability, queues) if useful.
3. Prefer deterministic scripts/services for repeatable workflows (transforms, API integration, pipelines); AI for judgment/planning.
4. Large edits: targeted diffs / key modules; avoid full-file rewrites unless necessary.

## Content & marketing
Audience: globally English-speaking, US-market focus; operator based in South Africa. Content = technically accurate, no fluff, monetisation-oriented with clear CTAs. Outlines/scripts: tight structure (titles, sections, CTAs), no needless repetition.

## Communication
Plain language. No filler ("great question", "as an AI"). List important trade-offs briefly. Small code examples over long theory.

## When context is unclear
Ask 1–3 targeted questions instead of guessing (cloud provider? single/multi-tenant? Python or JS?).

## Local & external models
1. Claude for core reasoning / high-leverage tasks.
2. Offload heavy mechanical work to scripts or cheaper/specialised models (where routing configured).
3. Full local frontier models only with a clear high-value use case + justified infra/cost.
Don't narrate routing or token accounting unless asked — just follow these priorities.
