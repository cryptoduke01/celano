# Celano — Design System (v2, Overhaul)

**Date**: 2026-07-06
**Goal**: Industry-standard confidential-yield treasury UI. North star: Morpho / Gauntlet / a serious prop-desk internal tool — quiet luxury, precise, data-dense, trustworthy. If it reads as "a nice dark AI UI," it failed.

This file is the single source of truth for the visual system. Everything below is implemented in `app/globals.css` (tokens + component classes) and consumed across `app/page.tsx` and `app/components/*`.

---

## 0. What changed in v2 (and why it raises the bar)

| Before | After | Why |
| --- | --- | --- |
| Centered marketing hero + two large castle marks | Left-aligned tool header, single small mark in nav | A serious tool leads with data, not a logo. Removes the "landing page" tell. |
| "THE KEEP / THE ARMORY / CASTLE KNOWS / only the initiated may enter" | Neutral institutional labels ("Treasury · Encrypted Value", "Deposit", "On-chain handle") | Castle cosplay fought the premium feel. The name + quiet seal metaphor stay; the decoration is gone. |
| Same 2–3 positions rendered 3× (cards + CastleMap + blotter) | One clean blotter table with per-row Decrypt/Withdraw | Kills redundancy; density that is actually scannable. Prop-desk language. |
| Emerald + gold + amber + red competing | **One** warm gold does the load-bearing work; green only = verified/live, amber only = demo | Accent discipline is the difference between "premium" and "generic premium". |
| Masked value was static `••••••`; decrypt was a text swap | Ciphertext **shimmer** while sealed → **blur-to-clear reveal** on KMS plaintext | Purposeful motion that *means* "decryption", not decoration. |
| Flat cards, hard hover jump | Elevation system (inset top-highlight + soft shadow), calm border/shadow transitions | Depth reads as craft; nothing lurches. |
| Ad-hoc micro-labels in many sizes | One `.eyebrow` label primitive everywhere | Alignment + rhythm; the connective tissue of a dense tool. |

**Non-negotiable preserved**: every real Zama FHE path is byte-for-byte unchanged — `useEncrypt`, `confidentialTransferAndCall`, `sharesOf` read, `useGrantPermit` (EIP-712), `useDecryptValues` + `refetchDecrypt` KMS attempt with graceful demo fallback, on-chain `withdraw`, the live/demo mode toggle via pasted vault address. Only presentation and user-facing copy changed.

---

## 1. Dials

- **DESIGN_VARIANCE**: 4 — restrained, functional, institutional.
- **MOTION_INTENSITY**: 3 — purposeful; never animates high-frequency actions.
- **VISUAL_DENSITY**: 8 — cockpit / blotter, but every value is scannable.

---

## 2. Tokens (`:root` in globals.css)

**Surfaces** (elevation lightens as it comes forward):
`--bg #0a0a0b` · `--bg-elevated #0e0e10` · `--card #131315` · `--card-2 #17171b` · `--inset #0c0c0e`

**Lines**: `--border #212125` · `--border-strong #2c2c31` · `--hairline rgba(255,255,255,.055)`

**Text**: `--text #f4f4f5` · `--text-muted #9a9aa3` · `--text-faint #66666e` (three-step ramp — use faint for micro-labels, muted for supporting, text for primary).

**Accent (single)**: `--gold #c5a26f` · `--gold-bright #e3c98f` · `--gold-dim rgba(...,.14)` · `--gold-line rgba(...,.32)`

**Semantic (sparingly, never vs. gold)**: `--live #46c98b` (verified / on-chain / KMS-real) · `--demo #d3a24a` (not-yet-live) · `--danger #e5646b` (destructive hover only).

**Elevation**: `--shadow-1` (rest, inset top highlight + soft drop) · `--shadow-2` (hover).

---

## 3. Typography

- **Display / headings**: Space Grotesk 600, tracking `-0.02em`→`-0.03em` on the H1.
- **Logotype only**: Cinzel 600 — the "Celano" wordmark. Nowhere else (kept minimal so it reads as a monogram, not a theme).
- **Body / UI**: Geist 400–700.
- **Data / handles / tx / ledger**: Geist Mono, `tnum`.
- **Long-form (whitepaper/docs)**: EB Garamond (unchanged; those pages depend on `.whitepaper-body` / `.docs-body`).
- **`.eyebrow`**: 10.5px, 600, `0.16em`, uppercase, `--text-faint`. The universal micro-label.

All numeric displays use `tabular-nums` (`.tnum` / `.data-dense`).

---

## 4. Shape lock

Cards 16px · panels/insets 12–14px · controls (btn/input) 10px · field wrapper 12px · pills 999px · chips 999px. No mixing.

---

## 5. Components (classes)

- **`.premium-card` / `.institutional-card`**: gradient top-highlight + `--shadow-1`; hover → `--border-strong` + `--shadow-2`. `.gold-accent` adds the quiet gold hairline crown on the primary surface.
- **`.btn`** + `.btn-primary` (gold gradient, inset highlight, tactile `scale(.99)` on press) / `.btn-secondary` (outline → gold on hover) / `.btn-ghost` / `.btn-danger` (red only on hover, for Withdraw).
- **`.input` / `.field`**: recessed `--inset`, gold focus ring (`box-shadow` 3px @ 12% gold).
- **`.pill`** (+ `pill-gold` / `pill-green` / `pill-demo` / `pill-muted`) and **`.dot`** (`dot-gold` / `dot-live` / `dot-demo`) status primitives; **`.chip`** for nav metadata (Sepolia, Accrued).
- **`.blotter`**: the positions table — uppercase micro-headers, hairline rows, row hover. Single source of truth for position data.
- **`.card-inset`**, **`.divider`**, **`.hairline`**, **`.scroll-slim`** (custom scrollbar on the ledger).

---

## 6. Motion (Emil discipline)

Curves: `--ease-out cubic-bezier(.22,1,.36,1)` · `--ease-out-strong cubic-bezier(.16,1,.3,1)` · `--ease-in-out cubic-bezier(.76,0,.24,1)`.
Durations: `--dur-fast 130ms` (feedback), `--dur 180ms` (surfaces), `--dur-slow 260ms` (reveals).

Decision table:
- Connect / disconnect / typing → **no animation**.
- Position add/remove → stagger enter/exit (`y` + opacity, 22ms× index), on `motion.tr`.
- **Decrypt reveal → `.value-reveal`** blur(9px)→0 + fade. The signature moment.
- **Masked value → `.mask-shimmer`** slow gold sweep through `••••••` = "sealed ciphertext" (not a spinner).
- Yield ticker → spring-ish fade on value change.
- Buttons → `scale(.99)` tactile press.
- `.skeleton` shimmer + `.pulse` available for loading/live states.
- Full `prefers-reduced-motion` kill-switch on all animation + transitions.

---

## 7. States & privacy theater

- **Live vs Demo**: single derived `isLive` (real vault pasted) drives nav pill, deposit pill, permit enable, and the vault-field indicator. One truth, shown consistently — no mixed signals.
- **Empty**: lock glyph + "No positions yet" + reassurance that balances never leave the ciphertext domain.
- **Sealing / decrypting**: button label + `VaultDoor` state (SEALED / SEALING / UNSEALED) + shimmer.
- **KMS-real vs demo fallback**: `KMS` green pill + `from 0x…` provenance line appear only when a real handle/plaintext is used; on-chain handle row carries a live dot. Security theater stays factual — it only claims "real" when it is.

---

## 8. Quality gates (all green)

- `pnpm typecheck` clean · `pnpm build` clean (6 routes prerender/compile).
- No emojis in UI. High-contrast gold-on-dark. `tabular-nums` on all data.
- One primary action per surface (Decrypt on the treasury card, Seal & Deposit on the panel).
- Docs/whitepaper compatibility classes preserved (`brand-heading`, `whitepaper-body`, `docs-body`, `ascii-dots`).

---

## 9. Next audit points

- Deploy a real vault to Sepolia → exercise the LIVE path end-to-end (handle → permit → KMS decrypt reveal) for the video.
- Re-check the blotter at 3+ positions and on mobile (horizontal scroll wrapper is in place).
- Consider a subtle count-up on the reveal if the blur alone feels too quiet on camera.

`CastleMark` (nav monogram) and `VaultDoor` (state pill) are the only retained brand artifacts — both neutral and institutional. `app/components/CastleMap.tsx` is now unused (de-scoped) and no longer imported.
