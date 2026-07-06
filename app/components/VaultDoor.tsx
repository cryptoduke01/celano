"use client";

// Simple animated "vault door" / gate visual for loading / sealing states.
// Keeps the castle theme without being cartoonish.

export function VaultDoor({ state = "closed" }: { state?: "closed" | "sealing" | "open" }) {
  const isSealing = state === "sealing";

  return (
    <div className="relative mx-auto my-4 h-16 w-40 select-none">
      <div className="absolute inset-0 rounded border-2 border-white/30 bg-zinc-900" />
      {/* Battlement top */}
      <div className="absolute -top-1 left-0 right-0 h-2 castle-battlements" />

      <div
        className={`absolute inset-[3px] flex items-center justify-center rounded border border-white/20 bg-black/60 font-mono text-[10px] tracking-[3px] text-white/60 transition-all ${isSealing ? "animate-pulse" : ""}`}
      >
        {state === "open" && "VAULT OPEN"}
        {state === "sealing" && "SEALING..."}
        {state === "closed" && "VAULT SECURED"}
      </div>

      {/* Lock symbol */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400/70">
        {state === "closed" && "🔒"}
        {state === "sealing" && "⟳"}
        {state === "open" && "🔓"}
      </div>
    </div>
  );
}
