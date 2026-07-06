"use client";

import { ExternalLink } from "lucide-react";

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
      className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-mono tracking-[1px] text-emerald-400 hover:bg-white/10 hover:border-white/30 transition"
    >
      TX {hash.slice(0, 10)}…{hash.slice(-6)} <ExternalLink className="h-3 w-3" />
    </a>
  );
}
