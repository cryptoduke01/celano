"use client";

// Confidential-state indicator. Neutral, institutional — no theatrics.

export function VaultDoor({ state = "closed" }: { state?: "closed" | "sealing" | "open" }) {
  const label = state === "open" ? "UNSEALED" : state === "sealing" ? "SEALING" : "SEALED";
  const color =
    state === "open" ? "var(--live)" : state === "sealing" ? "var(--demo)" : "var(--gold)";

  return (
    <div
      className="inline-flex w-fit items-center gap-2.5 rounded-full border px-3 py-1.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${state === "sealing" ? "animate-pulse" : ""}`}
        style={{ background: color }}
      />
      <span className="font-mono text-[10px] tracking-[0.24em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
