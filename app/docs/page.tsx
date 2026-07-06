import Link from "next/link";
import { CastleLogo } from "@/app/components/CastleMark";

export default function Docs() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-4xl px-8 py-12">
        <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">← Back</Link>

        <div className="mt-6">
          <CastleLogo />
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Documentation</h1>
        <p className="mt-2 text-[#a1a1aa]">How Celano works.</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/10 rounded-2xl p-6">
            <div className="font-medium">Getting Started</div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li><a href="#connect" className="hover:text-white">Connect a wallet</a></li>
              <li><a href="#shield" className="hover:text-white">Shield tokens</a></li>
              <li><a href="#deposit" className="hover:text-white">Make an encrypted deposit</a></li>
            </ul>
          </div>

          <div className="border border-white/10 rounded-2xl p-6">
            <div className="font-medium">Concepts</div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li><a href="#privacy" className="hover:text-white">Privacy model</a></li>
              <li><a href="#wrappers" className="hover:text-white">Official wrappers</a></li>
              <li><a href="#acl" className="hover:text-white">ACL & decryption</a></li>
            </ul>
          </div>

          <div className="border border-white/10 rounded-2xl p-6">
            <div className="font-medium">Resources</div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li><Link href="/whitepaper" className="hover:text-white">Litepaper</Link></li>
              <li><a href="https://docs.zama.org" target="_blank" className="hover:text-white">Zama Protocol Docs ↗</a></li>
              <li><a href="https://github.com" className="hover:text-white">Source (coming)</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 docs-body">
          <h2 className="brand-heading mt-8">Interface</h2>
          <p className="text-sm text-zinc-400">The dashboard is organized into four surfaces:</p>
          <ul className="list-disc pl-5 text-sm mt-2 text-zinc-400">
            <li><strong>Encrypted Value</strong> — your total position, shown as ciphertext until you decrypt</li>
            <li><strong>Positions</strong> — a blotter of encrypted holdings + the live on-chain handle</li>
            <li><strong>Deposit</strong> — strategy selection and the seal-and-deposit flow</li>
            <li><strong>Ledger</strong> — every encrypted action, with transaction links</li>
          </ul>

          <h2 id="connect" className="brand-heading mt-10">1. Connect</h2>
          <p>Use any EIP-1193 wallet on Sepolia. The app currently targets Sepolia testnet with official Zama cUSDC mocks.</p>

          <h2 id="shield" className="brand-heading mt-10">2. Shield (Wrap)</h2>
          <p>
            Public ERC-20 → ERC-7984 confidential token using the official Zama Wrappers Registry.
            The registry is the canonical source. Never deploy your own wrappers for this flow.
          </p>

          <h2 id="deposit" className="brand-heading mt-10">3. Encrypted Deposit (real on-chain)</h2>
          <p>
            Amounts are encrypted client-side with the Zama SDK. We then call the live 
            <code>confidentialTransferAndCall</code> on the confidential token, targeting your vault. 
            The vault’s <code>onConfidentialTransferReceived</code> callback credits your euint64 position.
          </p>

          <h2 id="privacy" className="brand-heading mt-10">Privacy Model</h2>
          <p>Only encrypted handles ever touch the chain for user balances. Decryption requires an EIP-712 signature from the owner to the Zama KMS. No one else can request or receive your plaintext.</p>

          <h2 id="wrappers" className="brand-heading mt-10">Official Wrappers (Sepolia)</h2>
          <ul className="text-sm font-mono">
            <li>Registry: 0x2f0750Bbb0A246059d80e94c454586a7F27a128e</li>
            <li>cUSDC Mock: 0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639</li>
          </ul>

          <h2 id="acl" className="brand-heading mt-10">ACL, Permits &amp; Decryption</h2>
          <p>
            The vault grants the user ACL on their encrypted shares. Before decrypting you often grant a
            permit (EIP-712 signature) that authorizes the relayer to serve your plaintext. Celano exposes
            “Grant Decrypt Permit” so the flow is explicit and real.
          </p>
        </div>

        <div className="mt-20 text-xs text-zinc-500 border-t border-white/10 pt-6">
          Celano • Zama Builder Track • July 2026
        </div>
      </div>
    </div>
  );
}
