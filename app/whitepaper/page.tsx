import Link from "next/link";
import { CastleLogo } from "@/app/components/CastleMark";

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f4f4f5]">
      <div className="mx-auto max-w-3xl px-8 py-16">
        <div className="mb-12 border-b border-[#252528] pb-8">
          <Link href="/" className="text-sm text-[#a1a1aa] hover:text-[#f4f4f5]">← Back</Link>
          <div className="mt-6">
            <CastleLogo />
          </div>
          <p className="mt-3 text-xl text-zinc-400">Confidential Yield Treasury on Zama Protocol</p>
          <p className="mt-4 text-sm text-zinc-500">Litepaper • Zama Developer Program Mainnet Season 3</p>
        </div>

        <div className="whitepaper-body prose prose-invert max-w-none">
          <h2>The Problem</h2>
          <p>
            Public blockchains were designed for radical transparency. Every balance, every position, 
            every strategy is visible to anyone. This creates a fundamental barrier for real-world finance.
          </p>
          <p>
            Institutions cannot deploy capital without leaking strategy. Individuals cannot earn yield 
            without broadcasting their entire financial life. MEV, front-running, and competitive 
            intelligence extraction become inevitable.
          </p>

          <h2>The Opportunity</h2>
          <p>
            Fully Homomorphic Encryption (FHE) via Zama’s fhEVM changes the equation. Smart contracts 
            can now compute on encrypted data. Balances and allocations can remain private while 
            still participating in onchain protocols.
          </p>
          <p>
            The first live examples (cUSDC wrappers + confidential yield vaults on Morpho) prove the 
            primitive works. What is missing is a production-quality interface that makes private yield 
            usable and composable.
          </p>

          <h2>The Solution: Celano</h2>
          <p>
            Celano is a confidential treasury for your encrypted capital.
          </p>
          <ul>
            <li>Shield public tokens into official ERC-7984 confidential wrappers using Zama’s on-chain Registry.</li>
            <li>Deposit via real <code>confidentialTransferAndCall</code> — the ciphertext is the only thing that ever touches the vault.</li>
            <li>Positions live on-chain as <code>euint64</code> handles. Only the owner can decrypt.</li>
            <li>Withdraw calls back through the confidential token — privacy preserved on the way out.</li>
            <li>The public sees only ciphertext and aggregate activity.</li>
          </ul>

          <h2>Architecture</h2>
          <p>
            Celano is deliberately thin. We do not mint new tokens. We compose using the official primitives:
          </p>
          <ul>
            <li><strong>Official Zama Wrappers Registry</strong> — discover and use canonical ERC-7984 tokens.</li>
            <li><strong>ConfidentialYieldVault</strong> — minimal receiver contract implementing <code>onConfidentialTransferReceived</code>.</li>
            <li><strong>Zama SDK + Relayer</strong> — client-side encryption and user decryption flows.</li>
          </ul>

          <h2>Privacy Model</h2>
          <p>
            Every sensitive value is an encrypted handle. Access Control Lists (ACL) are granted explicitly:
          </p>
          <ul>
            <li>Contract can operate on the ciphertext.</li>
            <li>Only the position owner can request decryption.</li>
            <li>No plaintext events are ever emitted for user amounts.</li>
          </ul>

          <h2>Why This Wins for Composable Privacy</h2>
          <p>
            Previous seasons saw many isolated confidential payments and airdrops. Season 3 explicitly
            rewards composability. Celano takes the newly live confidential DeFi primitives (wrappers +
            yield) and places them behind a production-grade interface with rigorous, user-controlled privacy UX.
          </p>

          <h2>Interface</h2>
          <p>
            The product is a single, data-dense treasury dashboard — the language is institutional, not decorative:
          </p>
          <ul>
            <li><strong>Encrypted Value</strong> — your aggregate position, shown as ciphertext until you decrypt it.</li>
            <li><strong>Positions</strong> — a blotter of encrypted holdings, including the live on-chain <code>sharesOf</code> handle.</li>
            <li><strong>Deposit</strong> — strategy selection, amount, and the real seal-and-deposit flow.</li>
            <li><strong>Ledger</strong> — every action (seal, permit, decrypt, withdraw) with on-chain transaction links.</li>
          </ul>
          <p>
            The name and the seal metaphor are the only brand notes; everything else is optimized for trust and scannability. Typography pairs Space Grotesk (display) with EB Garamond for long-form documents like this one.
          </p>

          <h2>Status &amp; Roadmap</h2>
          <p>Submitted for Zama Mainnet Season 3 (July 2026). Real client-side FHE encryption + live <code>confidentialTransferAndCall</code> + on-chain <code>sharesOf</code> reads + grant permit flow on Sepolia.</p>

          <div className="mt-12 border-t border-white/10 pt-8 text-sm text-zinc-500">
            This document is a litepaper for the Zama Developer Program. Not financial advice.<br />
            Built with the official Zama stack. No mocks where it matters.
          </div>
        </div>
      </div>
    </div>
  );
}
