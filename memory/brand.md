# UMHLABATEA Brand System — Locked Tokens
> **Status**: LOCKED — April 2026. No token changes without CEO approval.

---

## Colour Tokens (`--umh-` prefix required)

```css
/* === CORE PALETTE === */
--umh-navy:  #0D1B2A;   /* Deep Navy   — primary bg, card bg        */
--umh-gold:  #C9A84C;   /* Gold        — CTA, accent, logo mark      */
--umh-bone:  #fcfbf8;   /* Bone        — light surface, body bg      */
--umh-steel: #5C6B7A;   /* Steel       — body text on light, borders */

/* === LEGACY (Umsavati OS dashboard — do not change) === */
--umh-forest:       #2A3D2E;
--umh-cream:        #FAF6EF;
--umh-legacy-gold:  #C4903A;

/* === OHS COMPLIANCE STATUS (NEVER MIX WITH BRAND GOLD) === */
--ohs-compliant:     #2D6A4F;   /* ≥85    — Green  */
--ohs-conditional:   #E9C46A;   /* 65–84  — Amber  */
--ohs-non-compliant: #E76F51;   /* 45–64  — Red    */
--ohs-critical:      #C1121F;   /* <45    — Critical Red */
```

---

## Typography

### Fraunces (Display / Hero)
- Variable font: `wght` 100–900
- Use for: headings, hero text, product names
- Weight guidance: 300 (elegant), 700 (authority), 900 (impact)

### DM Sans (Body)
- Weights: 400 (body), 500 (UI labels), 600 (sub-headings)
- Use for: body copy, UI labels, navigation, buttons

### IBM Plex Mono (Data / Code)
- Weights: 400 (data output), 600 (score values, highlighted data)
- Use for: compliance scores, code blocks, data tables, compliance IDs

---

## Spacing System
```css
--space-1: 4px;
--space-2: 8px;    /* base unit */
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

---

## Brand Assets (Locked — Never Recreate Without CEO Approval)

| Asset | Description | Usage |
|-------|-------------|-------|
| OHS Logo | Gold metallic U-as-vase + Hard Hat/Gear/Medical Cross/Shield-Hand botanical stems on `#0D1B2A` | Umsavati OHS product |
| Parent Mark | Gold U + single cosmos wildflower on `#0D1B2A` | UMHLABATEA company |
| Hero Illustration | `OHS.png` | Marketing hero, landing page |

---

## Component Conventions

```css
/* Cards */
background: var(--umh-navy);
border: 1px solid rgba(201, 168, 76, 0.2);  /* --umh-gold at 20% */
border-radius: 12px;

/* Primary CTA Button */
background: var(--umh-gold);
color: var(--umh-navy);
font-family: 'DM Sans', sans-serif;
font-weight: 600;

/* Score Display */
font-family: 'IBM Plex Mono', monospace;
font-weight: 600;
/* Color from --ohs-* tokens, NOT --umh-gold */
```

---

## Brand Voice (Prose Register)
- **Register**: Royal, Prestige, Elite Literary — gravitas and sovereign confidence
- **Tone**: £10,000/hour strategic consultant — authoritative, precise
- **Never**: generic, pedestrian, diluted copywriting
- **Always**: sector-specific terminology, Hormozi value-stack framing for offers
