# Celano — Zama Developer Program, Mainnet Season 3

**Project**: Celano — Confidential Yield Treasury on Zama (Builder Track)

**Tagline**: Sealed yield. Yours alone.

**Repo**: https://github.com/cryptoduke01/celano

**Live Demo**: https://celano.vercel.app

**Deployed Vault (Sepolia)**: [`0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37`](https://sepolia.etherscan.io/address/0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37) — `ConfidentialYieldVault`, accepts cUSDC `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639`

**Video**: 3-minute walkthrough (script below)

**Deadline**: July 7, 2026 · 23:59 AOE

**Theme**: Composable Privacy — Celano uses the exact official primitive (`confidentialTransferAndCall` into an `IERC7984Receiver` vault) to compose confidential tokens with a yield position.

---

## The idea in one paragraph

On public chains, your balances, positions, and strategy are visible to everyone. Celano is a confidential treasury built on Zama FHEVM: you deposit through the official ERC-7984 confidential-token flow, your position is stored on-chain as an encrypted `euint64` handle, and it is decrypted **only** when you — and no one else — request it via Zama KMS with an explicit EIP-712 permit. The public sees ciphertext and aggregate activity. You see your number. That's composable privacy done with the real stack, not a mock.

---

## What is actually real (not simulated)

- **Client-side FHE encryption** of the deposit amount via `@zama-fhe/react-sdk` `useEncrypt` (produces a real ciphertext handle + input proof in the browser).
- **Real on-chain `confidentialTransferAndCall`** on the confidential token (ERC-7984), moving only ciphertext into the vault. Two ABI variants are handled.
- **On-chain vault** `ConfidentialYieldVault` implementing `IERC7984Receiver` — credits encrypted shares in its `onConfidentialTransferReceived` callback and grants ACL so the depositor can decrypt.
- **Live encrypted handle read** via `sharesOf(address)` returning the on-chain `euint64`.
- **Explicit decryption authorization** via `useGrantPermit` (real EIP-712 signature).
- **User-controlled KMS decryption** via `useDecryptValues` / `refetchDecrypt` — attempts a real relayer/KMS decrypt when a handle + ACL are present, with a clearly-labelled demo fallback otherwise.
- **On-chain `withdraw()`** returning the confidential position.
- **LIVE vs DEMO mode**: paste a deployed vault address (or set `NEXT_PUBLIC_VAULT_ADDRESS`) and the whole app flips to the real on-chain path; the mode is shown honestly in the UI.

---

## 3-minute video script

**[0:00–0:15] Cold open.** Dashboard on screen, the big value reading `••••••` with the ciphertext shimmer. VO: "This is a live yield position. On a normal chain, anyone can read it. Here, even the chain can't."

**[0:15–0:40] Problem.** Show a public explorer / transparent balances. VO: "Public transparency means your size, your strategy, and your timing leak to everyone."

**[0:40–1:05] Solution.** Cut back to Celano. VO: "Celano is a confidential treasury on Zama FHEVM. Deposits are encrypted in your browser, stored on-chain as ciphertext, and only you can ever decrypt them."

**[1:05–2:15] Live demo (real flows).**
- Connect wallet → note the **LIVE** pill (vault address is set).
- **Grant Decrypt Permit** → wallet shows the EIP-712 signature request.
- Enter an amount → **Seal & Deposit** → wallet confirms → this is the real client-side encrypt + `confidentialTransferAndCall`. A **TX** chip and a **Ledger** entry appear.
- The **On-chain handle** (`sharesOf`) shows up with a live dot in the positions blotter.
- Click **Decrypt Positions** → the value does the blur-to-clear reveal with a **KMS** badge and the source handle. VO: "Only ciphertext crossed the wire. The plaintext exists only here, for me."
- **Withdraw** a position (real on-chain call).

**[2:15–2:40] Why it wins.** Official Zama stack only (Wrappers Registry + ERC-7984 + KMS). Real receiver-callback composition, not a UI mock. Institutional, trustworthy UX. Rides the live confidential-DeFi wave (cUSDC + yield).

**[2:40–3:00] Close.** Value re-seals to `••••••`. VO: "Celano. Sealed yield. Yours alone." CTA: source + live demo in the submission.

---

## Screenshots to capture

1. Hero + Encrypted Value card, sealed state (`••••••` shimmer).
2. Decrypted state — big number + KMS badge + source handle (blur-to-clear).
3. Positions blotter with the live on-chain handle row + an encrypted position.
4. Deposit panel mid-flow (amount entered, LIVE pill, Seal & Deposit).
5. Ledger with real TX links.
6. Whitepaper page.
7. Mobile view of the dashboard.

---

## Technical highlights (for judges)

- **Stack**: Next.js 16 + TypeScript (strict) + wagmi + viem + `@zama-fhe/react-sdk` + `@zama-fhe/sdk`.
- **Contract**: `ConfidentialYieldVault` (`@fhevm/solidity` + `@openzeppelin/confidential-contracts`), implements `IERC7984Receiver`, encrypted per-user shares, ACL grants for user decryption, confidential withdraw.
- **Real FHE flows**: client encrypt → `confidentialTransferAndCall` → `sharesOf` handle → `grantPermit` (EIP-712) → `useDecryptValues` (KMS) → `withdraw`.
- **Privacy discipline**: only handles on-chain; decryption is user-initiated and permissioned; the app never claims "real" unless a real handle/plaintext is used.
- **Design**: institutional dark treasury system (Morpho/Gauntlet-tier), single warm-gold accent, blotter-style data, purposeful motion (ciphertext shimmer + blur-to-clear decrypt). Documented in `DESIGN.md`.

---

## Status at submission

- ✅ Production build clean (Next.js 16 + strict TS); `pnpm pre-flight` passes.
- ✅ Real FHE flows implemented end-to-end and wired to the official stack.
- ✅ Institutional UI shipped; design system documented in `DESIGN.md`.
- ✅ Whitepaper + Docs pages live; README + this submission kit updated.
- ✅ Contract + deploy script ready (`pnpm deploy:sepolia`).
- ✅ Vault deployed to Sepolia (`0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37`); app runs in LIVE mode via `NEXT_PUBLIC_VAULT_ADDRESS`.
- ⏳ Deploy frontend to Vercel; record the 3-minute video; capture screenshots.

**Target**: Zama Builder Track — 1st place.
