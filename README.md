# Celano

**Confidential Yield Treasury on Zama. Sealed yield. Yours alone.**

Celano is a confidential treasury built on Zama FHEVM. Deposits are encrypted in your
browser, moved on-chain as ciphertext through the official ERC-7984 flow, stored as an
encrypted `euint64` position, and decrypted **only** when you request it via Zama KMS.
The public sees ciphertext; you see your number.

Built for the **Zama Developer Program — Mainnet Season 3 (Builder Track)**. Theme: **Composable Privacy**.

---

## What it does

- Deposit confidential tokens (cUSDC on Sepolia) into a yield vault via **real** `confidentialTransferAndCall` — ciphertext only.
- Positions are stored on-chain as encrypted `euint64` handles inside `ConfidentialYieldVault` (`IERC7984Receiver`).
- User-controlled decryption via Zama KMS with an explicit **EIP-712 permit** — nobody else can read your position.
- Confidential `withdraw()` returns your position privately.
- **LIVE / DEMO** mode: set a deployed vault address and the whole app runs the real on-chain path.

## Why it stands out

- Official Zama stack only — Wrappers Registry + ERC-7984 + KMS.
- Real receiver-callback composition (confidential token → yield vault), not a UI mock.
- Institutional, trustworthy UX (Morpho/Gauntlet-tier) with purposeful decrypt motion — no demo slop.
- Rides the live confidential-DeFi wave (cUSDC wrappers + yield).

## Stack

- Next.js 16 + TypeScript (strict), wagmi + viem
- `@zama-fhe/react-sdk` + `@zama-fhe/sdk`
- `ConfidentialYieldVault` (Hardhat + FHEVM, `@fhevm/solidity`, `@openzeppelin/confidential-contracts`)
- Design system documented in [`DESIGN.md`](./DESIGN.md)

## Local development

```bash
pnpm install
pnpm dev
```

Connect to Sepolia. Copy the test asset addresses from the Deposit panel (official mock cUSDC + Wrappers Registry).

## Pre-flight

```bash
pnpm pre-flight   # typecheck; must pass before shipping
pnpm build        # full production build
```

## Deploy

**Contract (Sepolia):**

```bash
# set SEPOLIA_RPC and PRIVATE_KEY in .env.local first (see .env.example)
pnpm deploy:sepolia
```

Then either set `NEXT_PUBLIC_VAULT_ADDRESS=<address>` (recommended for the hosted demo,
so it opens in LIVE mode) or paste the address into the UI → **Deposit → Vault Address · Sepolia**.

**Frontend:** deploy to Vercel. Set `NEXT_PUBLIC_VAULT_ADDRESS` in the project env.

## How it works

1. **Encrypt** — the deposit amount is encrypted client-side (`euint64`) before it touches the chain.
2. **Vault** — `confidentialTransferAndCall` moves only ciphertext into the vault, which implements `IERC7984Receiver`.
3. **Decrypt** — you alone request KMS decryption via grant + EIP-712 permit. Nothing about your position is public.

## Documentation

- [Whitepaper](/whitepaper)
- [Docs](/docs)
- [DESIGN.md](./DESIGN.md) — visual system, tokens, motion, states
- [SUBMISSION.md](./SUBMISSION.md) — video script, screenshots, judge talking points

## Status

- ✅ Real FHE flows end-to-end on the official stack
- ✅ Production build clean (Next.js 16 + strict TS), pre-flight passes
- ✅ Institutional UI + documented design system
- ✅ Whitepaper + Docs + submission kit
- ✅ Vault live on Sepolia: [`0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37`](https://sepolia.etherscan.io/address/0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37)
- ⏳ Vercel deploy + video

Targeting Builder Track 1st place.
