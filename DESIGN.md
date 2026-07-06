# Celano — Design System & Audit (Post-Skills)

**Date**: 2026-07-06
**Skills Applied**:
- taste (design-taste-frontend) — Brief inference + redesign audit + anti-slop
- ui-ux-pro-max — Palette, typography, style, UX rules for fintech/crypto dashboard
- emilkowalski (emil-design-eng + animation-vocabulary + review-animations) — Motion philosophy, decision framework, review format, custom easings
- impeccable — Detector run, anti-pattern fixes, DESIGN.md discipline

---

## 1. Brief Inference (Taste Skill §0 — Mandatory First Step)

**Design Read**:
"Reading this as: data-dense private DeFi treasury dashboard (product UI, not landing) for crypto-native users and Zama Builder Track judges, with a serious institutional fintech language, leaning toward clean solid dark cards + warm gold accent system (directly referencing the two provided premium dashboard screenshots), using Tailwind v4 + custom tokens + restrained professional motion. High trust, high data density, low visual noise."

**Key signals used**:
- User references: two specific dark fintech dashboard screenshots (gold numbers, clean cards, status pills, data tables, minimal chrome).
- Audience: Technical + judges (trust-first, precision > delight).
- Constraints: Real FHE flows must feel secure and precise. No cartoon castle elements in the functional UI.
- Existing brand: "Celano — The Castle" (historic, guarded, private). Metaphor kept but executed quietly.

**Dials (Taste §1, adapted for dashboard)**:
- DESIGN_VARIANCE: 4 (restrained, functional, institutional)
- MOTION_INTENSITY: 3 (professional, purposeful, never decorative for frequent actions)
- VISUAL_DENSITY: 8 (cockpit / packed data — blotter tables, handles, live values, ledger)

---

## 2. Style & System Choice (ui-ux-pro-max + taste)

**Chosen Style Family**:
- Dark Mode (OLED-friendly) + Minimal/Flat with precise gold accent.
- Matches "Fintech Crypto Dashboard" category in ui-ux-pro-max data (glass/flat hybrid with strong data focus, not heavy glassmorphism).

**Palette (locked)**:
- `--bg`: #0b0b0c
- `--card`: #131315
- `--card-border`: #252528
- `--text`: #f4f4f5
- `--text-muted`: #a1a1aa
- `--gold`: #c5a26f (primary accent for values, status)
- `--gold-bright`: #e8d5a3
- Success: #22c55e (used sparingly for "LIVE"/"ENCRYPTED")

**Typography Pairing** (ui-ux-pro-max + taste discipline):
- Display / Section: Space Grotesk (600/700)
- Logotype / Brand: Cinzel (600) — used only for "Celano" wordmark and monogram
- Body / UI: Geist (400-700)
- Data / Mono: Geist Mono
- Long-form: EB Garamond

**Shape Consistency Lock** (Taste §4.4):
- Cards: 16px radius
- Buttons / Inputs: 10px radius
- Pills: 999px (full)
- No mixing.

---

## 3. Motion System (Emil + animation-vocabulary)

**Decision Framework Applied** (Emil §Animation Decision):
- High-frequency (connect/disconnect, input typing): No animation or instant only.
- Position list add/remove: Stagger + enter/exit.
- Value reveal / decrypt: Subtle scale + opacity, short.
- Yield ticker: Spring (alive but calm).
- Button press: Scale 0.985 + quick return (tactile).

**Custom Easings** (strong curves recommended by Emil):
- `--ease-out-strong`: cubic-bezier(0.23, 1, 0.32, 1)
- `--ease-in-out`: cubic-bezier(0.77, 0, 0.175, 1)
- Durations: 120-200ms for UI feedback, 200-280ms for list changes.

**Terms Used** (from animation-vocabulary):
- Stagger on positions
- Scale-in + fade for new encrypted positions
- Spring for live accrued value

---

## 4. Impeccable Detector Results & Fixes

Ran: `npx impeccable detect app/`

Findings (mostly in skill files or minor):
- gradient-text warnings (mostly in installed skill data) — our app had one decorative line (VaultDoor), kept as non-text.
- bounce-easing — none in app code.

**Fixes Applied**:
- Removed unnecessary decorative gradients where they added no meaning.
- All interactive elements now have explicit tactile states.
- No gradient text on headings or values (solid color + gold for data).

---

## 5. Pre-Flight & Quality Rules Enforced

From taste + impeccable + tushaar:
- Pre-flight (typecheck) passed before changes.
- Full build clean.
- No emojis in UI.
- Full states: loading (sealing), empty (treasury stands empty message), success (KMS badge + ledger), error toasts.
- High contrast checked on gold on dark.
- Data tables use tabular-nums.
- One primary action per major surface.

---

## 6. What Was Not Changed / Limitations

- Taste skill explicitly says it is **not for dashboards/data tables**. We applied universal anti-slop, redesign audit, density, states, and pre-flight rules only.
- Full 161 palettes from ui-ux-pro-max were not enumerated in this session (we chose one that matched the user's provided reference images).
- No new image generation was performed (no hero photography needed for a functional dashboard).

---

## 7. Next Audit Points (for future / video)

- Run `npx impeccable detect app/` again after any major change.
- Re-run taste brief inference if major pivot.
- Emil review table for any new component.

This DESIGN.md is the single source of truth for the current visual system. All future changes should reference the dials, tokens, and motion rules above.

**Status**: Maxed against the four skills + reference images + original tushaar principles. Pre-flight + build green.
