# Celano — Test Plan & How to Give Feedback

The app is **LIVE** against a real Sepolia vault:
`0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37`
([Etherscan](https://sepolia.etherscan.io/address/0x01eDE7bDA2FaDBf4D83b71337ea4dfA2Ea5e7d37))

Run it locally with `pnpm dev` (uses `.env.local`), or test the deployed site once it's on Vercel.

---

## Before you start — one-time setup

1. **Wallet on Sepolia.** MetaMask (or any injected wallet). The app auto-prompts the switch to Sepolia on connect, so you can start on any network.
2. **Sepolia ETH for gas.** Your deployer wallet `0x8F47aE9eC148903C8535b9289ad8efA400e026B6` already has some; any wallet you test with needs a little gas. Faucet: https://www.alchemy.com/faucets/ethereum-sepolia
3. **Test cUSDC — one click in the app.** In the **Deposit panel → Test Assets**, click **"Get 100 test cUSDC"**. It runs three quick wallet confirmations: mint mock USDC → approve the wrapper → wrap into confidential cUSDC. After that you have a cUSDC balance and can deposit. (All it needs is a little Sepolia ETH for gas.)

---

## What to test (in order)

Work top to bottom. For each: note **what you expected**, **what happened**, and grab a screenshot + the browser **console** (F12 → Console) if anything looks off.

### 1. Landing page (`/`)
- [ ] Loads clean, no layout shift, fonts render (Clash Grotesk headings, mono numbers).
- [ ] "Launch App ↗" (header + hero + bottom) all route to `/app`.
- [ ] Nav anchors (Product, How it works) scroll to sections; Whitepaper/Docs load.
- [ ] Footer links work (Zama → zama.org, Source → GitHub).
- [ ] Mobile: resize to phone width — nav, hero, cards stack cleanly.

### 2. Connect + network
- [ ] Click **Connect** → wallet prompts → address shows in nav.
- [ ] If you were on a non-Sepolia network, the app **auto-prompts a switch to Sepolia**. Approve it.
- [ ] Force it: switch your wallet to Ethereum Mainnet while on `/app` → the amber **"Wrong network"** banner appears with a **Switch to Sepolia** button that works.
- [ ] Nav shows **"Live vault"** (green), because the vault env is set.

### 3. Read path (no transaction, no token needed)
- [ ] On `/app`, the **Treasury** card shows the masked value `••••••` with the shimmer.
- [ ] If your wallet has a position in the vault, an **On-chain handle** row appears in Positions with a green "Live" dot. (Fresh wallet = no handle yet; that's correct.)
- [ ] Click **Decrypt Positions** with nothing deposited → you get a calm toast "Nothing to decrypt yet — seal a deposit first." (NOT a red error, NOT a fake number.)

### 4. Grant permit (signature, no gas)
- [ ] Click **Grant Decrypt Permit** → wallet shows an **EIP-712 signature** request (not a transaction).
- [ ] Approve → toast "Decryption permit granted." Ledger logs "PERMIT GRANTED."
- [ ] Reject it instead → calm "Permit request cancelled." (no red error).

### 5. Deposit — the real FHE flow (needs cUSDC + gas)
- [ ] If you have no cUSDC yet, click **Get 100 test cUSDC** (Test Assets) and approve the 3 prompts.
- [ ] Enter an amount, e.g. `10`. Click **Seal & Deposit**.
- [ ] First a brief pause = **client-side encryption** (the amount becomes ciphertext in your browser).
- [ ] Then wallet prompts a **transaction** = `confidentialTransferAndCall` on the cUSDC token.
- [ ] Approve → toast "Ciphertext sealed…", a **TX** chip appears, Ledger logs "SEALED & DEPOSITED", and a new **encrypted position row** appears in Positions.
- [ ] Click the TX chip → opens the tx on Sepolia Etherscan and it succeeds.
- [ ] Reject the tx instead → calm "Deposit cancelled." (no red error).

### 6. Decrypt — reveal your real balance (KMS)
- [ ] After a successful deposit, the **On-chain handle** row should appear (may take a few blocks for `sharesOf` to update — refresh if needed).
- [ ] Click **Decrypt Positions** (or a row's **Decrypt**).
- [ ] The big value should do the **blur→sharp reveal** and show your real number with a green **KMS** badge + a `from 0x…` source line.
- [ ] If it stays sealed with "Still sealed. Grant a decrypt permit…" → grant the permit (step 4) and retry. This is expected if the permit/ACL hasn't propagated yet.

### 7. Withdraw (gas)
- [ ] On a position row, click **Withdraw** → wallet prompts the `withdraw()` transaction.
- [ ] Approve → toast "Withdrawal submitted", Ledger logs it, row is removed.
- [ ] Reject → "Withdrawal cancelled", the position stays.

### 8. General polish
- [ ] No red error toasts during normal use (only on genuine failures).
- [ ] No obviously fake/random numbers anywhere.
- [ ] Disconnect wallet → state resets cleanly.

---

## How to report feedback

For each issue, give me this (a numbered list is perfect):

```
#  | where            | what I did              | expected            | actual + console error
1  | /app decrypt     | clicked Decrypt         | my balance          | stayed ••••••, console: "relayer 429"
2  | landing mobile   | 375px width             | cards stack         | hero text overflows right edge
```

Fastest signal for me:
- **Screenshots** of anything visual (layout, spacing, a toast).
- **Console text** (F12 → Console) for any decrypt/tx failure — copy the red lines.
- The **tx hash** if a transaction failed or did something unexpected (I can read it on-chain).
- Just say **"good"** for steps that pass — you don't need detail on those.

You can dump it all in one message; I'll triage and fix in order of impact.

---

## How decryption works (FAQ)

- **It's on-demand and repeatable, not one-time.** Each Decrypt click asks the Zama KMS for the *current* plaintext of your encrypted handle and reveals it locally in your browser. Refresh or disconnect and it re-masks to `••••••` — the plaintext is never stored or sent anywhere.
- **The permit is the durable part.** The EIP-712 signature authorizes the KMS to serve *your* account for that contract. Once granted, you can decrypt repeatedly without re-signing (until it expires or you revoke it). So: sign the permit once → decrypt as many times as you want.
- **Only you can do it.** Nobody else — not the vault, not the chain, not us — can request or receive your plaintext.

## Known/expected, not bugs

- **Encrypted yield accrual ticker** — a small always-on counter in the Treasury card. It's a display element (labeled "yield accrued"), not a claim of on-chain interest.
- **"Still sealed" on decrypt** right after a deposit — normal until the permit + ACL propagate. Grant permit, wait a few blocks, retry.
- **`sharesOf` handle lag** — the on-chain handle can take a couple of blocks to show after a deposit.
- **Public RPC slowness** — if reads feel slow, set `NEXT_PUBLIC_SEPOLIA_RPC` to an Alchemy/Infura Sepolia URL (see `.env.example`).
