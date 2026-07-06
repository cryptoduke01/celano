"use client";

import { ArrowUpRight } from "lucide-react";

export function LiveTx({ hash, chain = "sepolia" }: { hash: string | null; chain?: string }) {
  if (!hash) return null;

  const url =
    chain === "sepolia"
      ? `https://sepolia.etherscan.io/tx/${hash}`
      : `https://etherscan.io/tx/${hash}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] transition"
      style={{
        borderColor: "rgba(70,201,139,0.3)",
        background: "var(--live-dim)",
        color: "var(--live)",
      }}
    >
      TX {hash.slice(0, 8)}…{hash.slice(-6)}
      <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}
