"use client";

// Premium castle monogram for Celano.
// Used in nav + anywhere we need the brand mark.

export function CastleMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Stone dark background */}
      <rect width="36" height="36" rx="6" fill="#111113" />
      
      {/* Battlements (crenellations) */}
      <rect x="5" y="5" width="5" height="4" fill="#e4e4e7" />
      <rect x="15" y="5" width="5" height="4" fill="#e4e4e7" />
      <rect x="25" y="5" width="5" height="4" fill="#e4e4e7" />
      
      {/* Main C form with historic weight */}
      <path
        d="M10 12 Q10 25 18 25 Q26 25 26 16"
        stroke="#f4f4f5"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Small inner vault notch — castle detail */}
      <rect x="14" y="15" width="4" height="4" fill="#111113" />
    </svg>
  );
}

// Full wordmark + mark for bigger places (whitepaper, etc.)
export function CastleLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CastleMark size={42} />
      <div>
        <div className="font-semibold tracking-tight text-3xl brand-heading leading-none">Celano</div>
        <div className="text-[9px] text-zinc-500 -mt-1 tracking-[3px]">THE CASTLE</div>
      </div>
    </div>
  );
}
