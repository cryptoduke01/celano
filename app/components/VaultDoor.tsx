"use client";

// Clean vault status indicator. No emojis. Subtle, institutional.

export function VaultDoor({ state = "closed" }: { state?: "closed" | "sealing" | "open" }) {
  const isSealing = state === "sealing";
  const label = state === "open" ? "VAULT OPEN" : state === "sealing" ? "SEALING" : "SECURED";
  const tone = state === "open" ? "text-emerald-400" : state === "sealing" ? "text-amber-400" : "text-[#c5a26f]";

  return (
    <div className="mx-auto my-3 flex w-fit items-center gap-3 rounded-full border border-[#252528] bg-[#111113] px-4 py-1.5">
      <div className={`h-1.5 w-1.5 rounded-full ${state === "open" ? "bg-emerald-400" : state === "sealing" ? "bg-amber-400 animate-pulse" : "bg-[#c5a26f]"}`} />
      <div className={`font-mono text-[10px] tracking-[3px] ${tone}`}>
        {label}
      </div>
      {isSealing && (
        <div className="h-px w-6 bg-[#c5a26f]/40" />
      )}
    </div>
  );
}
