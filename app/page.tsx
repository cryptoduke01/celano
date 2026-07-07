import Link from "next/link";
import {
  ArrowUpRight,
  Lock,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Github,
} from "lucide-react";
import { CastleMark } from "./components/CastleMark";

const VALUE_CARDS = [
  {
    icon: Lock,
    title: "Encrypted deposits",
    body: "Amounts are encrypted in your browser and enter the vault through ERC-7984 confidentialTransferAndCall. Only ciphertext ever touches the chain.",
  },
  {
    icon: EyeOff,
    title: "Yield that stays private",
    body: "Your position lives on-chain as an euint64 handle. Size, strategy, and returns are invisible to everyone but you — no public balances, no leaked flow.",
  },
  {
    icon: KeyRound,
    title: "Decryption on demand",
    body: "Read your true balance only when you choose. An explicit EIP-712 permit authorizes Zama KMS to serve your plaintext — to you, and no one else.",
  },
  {
    icon: ShieldCheck,
    title: "Built on Zama FHEVM",
    body: "No custom crypto. Celano composes the official Zama stack — Wrappers Registry, ERC-7984, and the KMS — the same primitives securing confidential DeFi.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Encrypt",
    body: "Choose a strategy and an amount. The deposit is encrypted client-side into an euint64 ciphertext before it ever leaves your wallet.",
  },
  {
    n: "02",
    title: "Seal into the vault",
    body: "confidentialTransferAndCall moves only ciphertext into ConfidentialYieldVault, which credits your encrypted position through the ERC-7984 receiver callback.",
  },
  {
    n: "03",
    title: "Decrypt when you choose",
    body: "Grant a permit and request KMS decryption to reveal your balance locally. The position re-seals the moment you look away.",
  },
];

export default function Home() {
  return (
    <div className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <CastleMark size={30} gold />
            <span className="logotype text-[20px]">Celano</span>
          </div>
          <nav className="hidden items-center gap-7 text-[13px] text-[var(--text-muted)] md:flex">
            <a href="#value" className="transition-colors hover:text-[var(--text)]">Product</a>
            <a href="#how" className="transition-colors hover:text-[var(--text)]">How it works</a>
            <Link href="/whitepaper" className="transition-colors hover:text-[var(--text)]">Whitepaper</Link>
            <Link href="/docs" className="transition-colors hover:text-[var(--text)]">Docs</Link>
          </nav>
          <Link href="/app" className="btn btn-primary">
            Launch App <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="max-w-3xl">
            <span className="eyebrow">Confidential Yield Treasury · Zama FHEVM</span>
            <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.03] tracking-[-0.03em] md:text-[4.1rem]">
              Sealed yield on public chains.<br />
              <span className="text-[var(--text-muted)]">Yours alone.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--text-muted)]">
              Public blockchains broadcast every balance, position, and strategy. Celano
              closes that gap. Deposits are encrypted end to end, held on-chain as ciphertext,
              and decrypted only when you ask — real composable privacy on the Zama stack.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/app" className="btn btn-primary px-5 py-3">
                Launch App <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/whitepaper" className="btn btn-secondary px-5 py-3">
                Read the whitepaper
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.06em] text-[var(--text-faint)]">
              <span>ERC-7984 · euint64</span>
              <span className="h-3 w-px bg-[var(--border-strong)]" />
              <span>USER-CONTROLLED KMS DECRYPTION</span>
              <span className="h-3 w-px bg-[var(--border-strong)]" />
              <span>SEPOLIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value cards */}
      <section id="value" className="border-b border-[var(--border)] scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-[2rem] font-semibold tracking-[-0.025em] md:text-[2.4rem]">
              Privacy that composes, not just conceals.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
              Confidentiality is the missing piece of on-chain finance. Celano treats it as
              infrastructure — every position is a first-class encrypted asset you can act on.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
            {VALUE_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="bg-[var(--card)] p-7 transition-colors hover:bg-[var(--card-2)] md:p-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--inset)]">
                    <Icon className="h-[18px] w-[18px] text-[var(--yellow)]" />
                  </span>
                  <h3 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--text-muted)]">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-[var(--border)] scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[2rem] font-semibold tracking-[-0.025em] md:text-[2.4rem]">
              Three steps. Nothing leaves in the clear.
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-[var(--text-muted)]">
              From encrypted deposit to on-demand decryption, plaintext exists only in your browser.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="premium-card p-7">
                <div className="font-mono text-[13px] text-[var(--yellow)]">{s.n}</div>
                <h3 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--text-muted)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch moment */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-28">
          <div className="premium-card gold-accent relative overflow-hidden p-10 text-center md:p-16">
            <div className="mx-auto max-w-2xl">
              <span className="eyebrow">Enter the treasury</span>
              <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[2.9rem]">
                Deposit is encrypted. Yield is private.<br />The key is yours.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-[var(--text-muted)]">
                Connect a wallet on Sepolia, seal a position, and decrypt it on demand. Every
                flow runs the real Zama FHE stack — no mocks where it matters.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/app" className="btn btn-primary px-6 py-3.5 text-[15px]">
                  Launch App <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <CastleMark size={28} gold />
              <span className="logotype text-[18px]">Celano</span>
            </div>
            <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-[var(--text-faint)]">
              Confidential yield treasury built on Zama FHEVM. Sealed yield, yours alone.
            </p>
          </div>

          <div>
            <div className="eyebrow">Product</div>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--text-muted)]">
              <li><Link href="/app" className="transition-colors hover:text-[var(--text)]">Launch App</Link></li>
              <li><a href="#value" className="transition-colors hover:text-[var(--text)]">Overview</a></li>
              <li><a href="#how" className="transition-colors hover:text-[var(--text)]">How it works</a></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow">Resources</div>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--text-muted)]">
              <li><Link href="/whitepaper" className="transition-colors hover:text-[var(--text)]">Whitepaper</Link></li>
              <li><Link href="/docs" className="transition-colors hover:text-[var(--text)]">Docs</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow">Ecosystem</div>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--text-muted)]">
              <li>
                <a href="https://www.zama.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--text)]">
                  Zama <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://docs.zama.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--text)]">
                  Zama Docs <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://github.com/cryptoduke01/celano" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--text)]">
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--border)] pt-6 font-mono text-[11px] tracking-[0.06em] text-[var(--text-faint)] md:flex-row md:items-center md:justify-between">
          <span>CELANO · ZAMA DEVELOPER PROGRAM · MAINNET SEASON 3</span>
          <span>ERC-7984 · euint64 · KMS</span>
        </div>
      </footer>
    </div>
  );
}
