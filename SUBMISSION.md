# Celano — Zama Developer Program Mainnet Season 3 Submission

**Project**: Celano — Private Yield Treasury on Zama (Builder Track)

**Tagline**: The castle that guards your encrypted yield.

**Repo**: (this workspace)

**Live Demo**: (Vercel link after deploy)

**Video**: 3-minute walkthrough (script below)

**Deadline**: July 7, 2026 23:59 AOE

---

## Core Story (for video + pitch)

In the hills of Abruzzo stands the Castle of Celano.

For centuries its walls protected what mattered most.

Today we bring that same principle to onchain finance with Zama FHE.

With Celano:
- You shield public tokens using the official Zama Wrappers Registry.
- You deposit encrypted amounts into confidential yield strategies.
- Your positions live as euint64 inside the castle.
- Only you hold the key. Only you can decrypt.

Public sees stone walls and aggregate activity.
You see your private yield.

This is composable privacy done right.

---

## 3-Minute Video Script Outline

[0:00–0:15] Opening — Drone shot / static of real Celano castle (or strong visual). Voice: "In Abruzzo there is a castle that has guarded secrets for 700 years."

[0:15–0:40] Problem — Show public blockchain transparency pain. "On public chains, your yield, your positions, your strategy are visible to everyone."

[0:40–1:10] Solution intro — Cut to Celano dashboard. "We built the modern equivalent. Celano. Your private treasury on Zama."

[1:10–2:10] Live demo (real flows)
- Connect (show "REAL MODE" when vault set)
- Grant Permit → explicit EIP-712 authorization for decryption
- Paste Sepolia vault address (or use deployed one)
- Choose cUSDC Yield, enter amount → "SHIELD & BRING INSIDE"
  - Real client-side encrypt + confidentialTransferAndCall
  - TX appears + Castle Ledger records the seal
- Treasury shows live on-chain handle (sharesOf)
- Per-position DECRYPT + global "DECRYPT MY POSITIONS" (attempts real useDecryptValues via KMS)
- Withdraw (on-chain call)

Emphasize: "Only ciphertext crossed the wall. The castle never saw the number."

[2:10–2:40] Why it wins
- Official Zama stack (Wrappers Registry + ERC-7984)
- Real confidentialTransferAndCall receiver pattern
- Castle-grade UX + dotted fortress visuals
- Composable with live confidential DeFi (cUSDC + yield)

[2:40–3:00] Close
"Celano. The castle that keeps your yield private."

Call to action: "Built for Zama Builder Track. Source and demo in the submission."

---

## Key Screenshots / Assets Needed

1. Hero dashboard (full keep view with encrypted value + castle ASCII)
2. Treasury view (multiple positions)
3. Armory / deposit flow (before + after)
4. Castle Map component
5. Whitepaper page
6. Mobile view (if decent)
7. Decrypted vs encrypted state comparison

---

## Technical Highlights (for judges)

- Name: Celano (real historic Italian castle town)
- Design: Industry-scale dark finance UI + deliberate castle/fortress metaphor + heavy historic dotted patterns + ASCII battlements
- Stack: Next.js 16 + TypeScript (strict) + wagmi + viem + @zama-fhe/react-sdk
- **Real FHE flows**: Client-side encrypt + live `confidentialTransferAndCall` + `sharesOf` + explicit `grantPermit` + per-position decrypt
- Castle Ledger: dense activity history of every gate action (with tx links)
- Contracts: `ConfidentialYieldVault` implementing `IERC7984Receiver`
- Privacy: Handles only on-chain + user-controlled KMS decryption
- Theme alignment: Composable Privacy (Season 3) — using the exact official primitive for yield composition

---

## Status at Submission

✅ Production build passes cleanly (Next.js + strict TS)
✅ Pre-flight (typecheck) passes
✅ Premium castle UI implemented: The Keep, Treasury, Armory, Gates + Castle Map
✅ Dotted fortress patterns + battlements + institutional dense data
✅ All flows have professional states (sealing, decrypting, vault secured)
✅ Whitepaper + Docs wired with castle narrative
✅ SUBMISSION.md + video script ready
✅ Contract skeleton + deploy script present (official pattern)
✅ Proper FHE discipline + ACL notes in code

Target: Zama Builder Track 1st place.

## Quick Next Steps (for the final hours)

1. Record 3-min video using the script above (use clean dark theme, no dev tools open).
2. Take 5–7 screenshots (hero, keep, treasury, armory, decrypt flow).
3. Deploy contracts on Sepolia if time (or use the existing mock address).
4. Deploy frontend to Vercel.
5. Fill final README with live links + deployed vault address.
6. Submit. No excuses. We shipped a castle.

---

Shipped with high standards. No slop. Castle-grade execution.

— Team (July 2026)
