"use client";

// Castle-inspired patterns for Celano
// Battlements (crenellations), stone walls, dotted fortress motifs

export function Battlements({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-3 w-full bg-repeat-x ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(90deg, 
            rgba(255,255,255,0.08) 0 6px, 
            transparent 6px 14px,
            rgba(255,255,255,0.08) 14px 20px,
            transparent 20px 28px
          )
        `,
        backgroundSize: "28px 100%",
      }}
      aria-hidden
    />
  );
}

export function StoneWall({ className = "" }: { className?: string }) {
  return (
    <div
      className={`dot-grid-fine ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "5px 5px, 4px 4px",
      }}
      aria-hidden
    />
  );
}

export function CastleMapDots({ className = "" }: { className?: string }) {
  // Dotted "map" suggesting castle layout / positions
  return (
    <pre
      className={`ascii-dots text-[9px] leading-[7px] tracking-[3px] text-white/10 select-none ${className}`}
      aria-hidden
    >
{`  .   .     .   .
.   .   .     .   .
  .     .   .     .
.   .   .     .   .
  .   .     .   .  `}
    </pre>
  );
}

// Simple ASCII castle for headers / empty states (tasteful, low opacity)
export function ASCIICastle({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const art =
    size === "lg"
      ? `          _._
      _.-'   '-._
   .-'           '-.
 .'                 '.
|   _.-.       .-._   |
| .'   '.     .'   '. |
| |     |     |     | |
| |     |     |     | |
|  \\   /       \\   /  |
 \\  '._.'         '._.'  /
  '.                 .'
    '-._         _.-'
        '-------'`
      : size === "sm"
      ? `   _._
 _.-' '-._
|   _.-.   |
 \\ '._.'  /`
      : `       _._
   _.-'   '-._
.'           '.
| _.-.   .-._ |
| |   | |   | |
 \\ \\ /   \\ / /
  '._.'   '._.'`;

  return (
    <pre className="ascii-dots text-[8px] leading-[6px] tracking-[1px] text-white/8 select-none" aria-hidden>
      {art}
    </pre>
  );
}
