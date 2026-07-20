# POPIA Lawful-Basis Memo — UTHENGISO Outreach
> **Status**: DRAFT — for CEO decision (D1) · **Prepared by**: Claude · 20 July 2026
> **Information Officer**: Njabulo Kubheka
> **Scope**: LinkedIn outreach + email nurture by the UTHENGISO sales agent and n8n sequences
> ⚠️ This is an internal working memo, not legal advice. Have an attorney confirm before scale.

---

## 1 · The question

POPIA s.11 requires a lawful basis for every processing operation. UTHENGISO
prospects to **business contacts** (CIDB contractors, event organisers). Which
basis do we rely on, and what must be true operationally for it to hold?

## 2 · The realistic options

| Basis | POPIA ref | Fit for cold B2B outreach |
|-------|-----------|---------------------------|
| **Legitimate interest** | s.11(1)(f) | **Recommended.** Processing business contact data of prospects in trades we serve, for direct marketing of a compliance product they are legally obliged to care about, is a defensible legitimate interest — provided balancing test is documented and opt-out is honoured instantly. |
| Consent | s.11(1)(a) | Gold standard but unavailable at first touch — you cannot consent someone you have never contacted. Becomes the basis **after** opt-in (SafeFile Pro™ download, trial signup). |
| Contract | s.11(1)(b) | Applies only once a prospect requests a quote/trial. Not a cold-outreach basis. |

**Direct marketing overlay (s.69)**: electronic direct marketing to a data
subject who is not an existing customer requires consent — **but s.69 targets
natural persons**. Outreach to corporate roles/switchboards and LinkedIn contact
of business profiles is materially lower risk. Sole proprietors count as
natural persons: treat CIDB Grade 1–2 sole traders under the stricter rule.

## 3 · Recommended structure (for sign-off)

1. **Cold first touch — LinkedIn only**, under **legitimate interest**:
   business-capacity contact, compliance-relevant message, no email scraping.
2. **Email only after opt-in** (SafeFile Pro™ download or reply requesting
   info) — basis upgrades to **consent**, recorded in the consent ledger.
3. **Every message carries an opt-out**; opt-out suppresses the record
   permanently (suppression list, not deletion, so we never re-contact).
4. **Volume cap**: ≤ 50 new first-touches/week while HITL-only, revisited at
   UTHENGISO graduation.
5. **Balancing-test record** (this memo §4) kept as the s.11(1)(f) artefact.

## 4 · Balancing test (legitimate interest)

- **Purpose**: marketing statutory OHS compliance tooling to duty-holders under OHS Act s.8/s.16 — a genuine business interest with public-safety alignment.
- **Necessity**: no less-intrusive channel reaches CIDB contractors at viability; data used is business-capacity contact info only.
- **Impact on data subject**: minimal — professional context, low volume, instant opt-out, no sensitive personal information, no automated decisioning about the subject.

## 5 · Consent ledger — design (schema draft, HITL gate applies)

Table `popia_consent_ledger` (Supabase, RLS `auth.uid()`-based, service-role
writes from n8n only):

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid pk | |
| `subject_identifier` | text | email or LinkedIn URN (hashed at rest) |
| `subject_type` | enum | `natural_person` / `juristic_rep` |
| `basis` | enum | `legitimate_interest` / `consent` / `contract` |
| `event` | enum | `first_touch` / `opt_in` / `opt_out` / `erasure_request` |
| `evidence` | jsonb | message id, form id, timestamp source |
| `occurred_at` | timestamptz | |
| `recorded_by` | text | agent name (UTHENGISO / n8n workflow id) |

Rules: append-only (no updates/deletes via policy); `opt_out` row for an
identifier blocks all future sends at the n8n gate; retention 5 years.

## 6 · Decision requested

- [ ] Adopt legitimate-interest structure per §3 (CEO sign-off)
- [ ] Approve consent-ledger migration (HITL gate — will be presented separately before execution)
- [ ] Confirm weekly volume cap value (proposed: 50)
- [ ] Attorney review before UTHENGISO graduation to autonomy
