# Celano — Design System (v3, "Premium Overhaul")

**Date**: 2026-07-06
**Bar**: Looks like it belongs on the desk of someone who just wired $50M into a confidential vault. Quieter, sharper, and more expensive than any crypto dashboard or private-banking app. Yellow is a signature (<5% of the visual field), never decoration. If it reads as "a nice dark UI," it failed.

Implemented in `app/globals.css` (tokens + component classes), `app/layout.tsx` (fonts), and consumed across `app/page.tsx`, `app/{docs,whitepaper}/page.tsx`, and `app/components/*`.

> v1 (warm-gold "castle") and v2 (institutional gold) are superseded. History in git. Any warm-gold references you find in old commits are intentionally gone.

---

## 0. The three hard constraints

1. **Two typefaces only** — Clash Grotesk (everything: headings, body, UI, labels, buttons, logotype) + Geist Mono (every number, address, tx hash, handle). No Cinzel / Space Grotesk / EB Garamond / Geist / Inter.
2. **Black & white foundation, yellow as the only accent** — deep near-black surfaces; a single yellow for primary actions + one status. Green *only* = verified on-chain / real KMS. Amber-yellow *only* = demo mode. Red *only* = destructive hover.
3. **FHE logic untouched** — the entire Zama path (`useEncrypt`, `confidentialTransferAndCall`, `sharesOf`, `useGrantPermit` EIP-712, `useDecryptValues`/`refetchDecrypt` KMS + demo fallback, `withdraw`, live/demo vault toggle) is byte-for-byte preserved. This overhaul is fonts, color, surfaces, and copy only.

---

## 1. Typography

- **Clash Grotesk** (Fontshare) — **self-hosted** via `next/font/local` from `app/fonts/ClashGrotesk-{400,500,600,700}.woff2`. No external runtime font dependency, no FOUT. Weights: 400 body, 500 medium, 600 headings, 700 logotype.
  - Headings tracking `-0.025em` (H1 `-0.03em`); body `0`; `.logotype` 700 at `+0.005em`.
- **Geist Mono** (`next/font/google`) — all data, `font-feature-settings: "tnum"`, tabular.
- Scale: Hero H1 `text-4xl→5xl` (2.25–3rem) · section `1.5rem` · card title `1.125rem` · body `15px` · `.eyebrow` `11px`/600/`0.16em`/uppercase · data `15–16px` mono · meta `12px`.
- Long-form (`.whitepaper-body` / `.docs-body`) now rides Clash at `16px`/`1.7`; inline `code` is Geist Mono in `--yellow-bright`.

---

## 2. Tokens (`:root` in globals.css)

**Surfaces**: `--bg #050505` · `--bg-elevated #0a0a0a` · `--card #0f0f0f` · `--card-2 #141414` · `--inset #0a0a0a`
**Lines**: `--border #1f1f1f` · `--border-strong #2a2a2a` · `--hairline rgba(255,255,255,.06)`
**Text**: `--text #f8f8f8` · `--text-muted #a1a1aa` · `--text-faint #666666`
**Accent (yellow)**: `--yellow #eab308` · `--yellow-bright #fde047` · `--yellow-dim rgba(...,.12)` · `--yellow-line rgba(...,.35)`
**Semantic**: `--live #22c55e` (+dim) · `--demo #ca8a04` (+dim) · `--danger #ef4444`
**Elevation**: `--shadow-1` (rest) · `--shadow-2` (hover). Body carries a ≤3% yellow radial warmth, top-center.

> `--gold*` remain as **aliases** → `--yellow*` so any legacy class name (`pill-gold`, `dot-gold`, `gold-accent`) still resolves. New code should prefer the yellow names / `pill-yellow` / `dot-yellow` / `accent-top`.

---

## 3. Layout

- **Header**: left-aligned yellow monogram + `Celano` logotype, then minimal nav **Treasury · Positions · Docs** (Treasury/Positions are in-page anchors with `scroll-mt`). Right: Accrued chip, **On-chain (green) / Demo (yellow) pill**, wallet connect.
- **Treasury card** (`#treasury`): dominant surface, yellow hairline crown (`.gold-accent`/`.accent-top`), large masked/revealed value, one primary action (Decrypt).
- **Positions** (`#positions`): a single blotter — no cards repeating the same data — with per-row Decrypt/Withdraw and the live on-chain `sharesOf` row.
- **Deposit**: recessed inset fields, one primary action (Seal & Deposit).
- **How it works**: three numbered steps. **Empty state**: lock glyph + short reassurance.

---

## 4. Components (classes, all recolored to yellow/black)

`.premium-card`/`.institutional-card` (inset top-highlight + `--shadow-1`, hover deepens) · `.gold-accent`/`.accent-top` (yellow crown, primary card only) · `.card-inset` · `.btn` + `.btn-primary` (yellow gradient, `#111` text, tactile) / `.btn-secondary` / `.btn-ghost` / `.btn-danger` · `.input`/`.field` (yellow focus ring, 3px @15%) · `.pill` (`pill-yellow`/`pill-green`/`pill-demo`/`pill-muted`) + `.dot` (`dot-yellow`/`dot-live`/`dot-demo`) · `.chip` · `.blotter` (uppercase micro-headers, hairline rows, faint yellow row-hover) · `.eyebrow` / `.logotype` / `.data-value` primitives · `.scroll-slim`.

---

## 5. Motion

Curves `--ease-out (.22,1,.36,1)` / `--ease-out-strong (.16,1,.3,1)`. Durations 120ms feedback / 180ms surfaces / 280ms reveals.
- **Decrypt reveal** (`.value-reveal`): blur(9px)→sharp with a brief **yellow flash underlay** (text-shadow), 280ms — the signature moment.
- **Masked value** (`.mask-shimmer`): very slow yellow-tinted sweep across `••••••` = sealed ciphertext, not a spinner.
- Buttons: scale + slight y on press. New positions: gentle y-fade stagger (`motion.tr`). Cards: border/shadow only, no scale jump. Full `prefers-reduced-motion` kill-switch. No fast spinners.

---

## 6. States & privacy

Sealed → dots + `SEALED` (VaultDoor). Decrypting → button loading + transition. Unsealed → mono number + `KMS` pill + `from 0x…` provenance in faint text. Live → green `On-chain` pill + live dot (yellow reserved for the demo indicator). Empty → centered lock + reassurance. The UI only claims "real/KMS" when a real handle/plaintext is actually used.

---

## 7. Quality gates (all green)

`pnpm typecheck` + `pnpm build` clean (6 routes). No emojis. All numbers mono+tnum. One primary action per surface. Fonts self-hosted (no CDN dependency). Docs/whitepaper compatibility classes (`brand-heading`, `whitepaper-body`, `docs-body`, `ascii-dots`) retained and recolored. Favicon + apple-icon regenerated as the yellow monogram.

## 8. Next

Deploy the Sepolia vault + set `NEXT_PUBLIC_VAULT_ADDRESS` → exercise the LIVE decrypt reveal for the video. Verify the blotter on mobile at 3+ positions. Contrast target: AAA on `#050505`.
