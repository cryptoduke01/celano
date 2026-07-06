"use client";

// Premium monogram for Celano — refined, quiet, gold accent on active.
// Used in nav and hero. No heavy battlements; subtle fortress reference only.

export function CastleMark({ size = 36, gold = false }: { size?: number; gold?: boolean }) {
  const stroke = gold ? "#c5a26f" : "#f4f4f5";
  const bg = "#111113";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="36" height="36" rx="7" fill={bg} />
      {/* Refined C — strong, balanced, institutional */}
      <path
        d="M11 11 Q11 25 18 25 Q25 25 25 17.5"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner secure notch */}
      <rect x="15" y="16" width="3.5" height="3.5" rx="0.5" fill={bg} />
    </svg>
  );
}

// Wordmark — used sparingly
export function CastleLogo({ className = "", gold = false }: { className?: string; gold?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CastleMark size={40} gold={gold} />
      <div>
        <div className="logotype text-[28px] leading-none tracking-[-0.02em] text-[#f4f4f5]">Celano</div>
        <div className="text-[9px] tracking-[2.5px] text-[#a1a1aa] -mt-0.5">THE CASTLE</div>
      </div>
    </div>
  );
}
