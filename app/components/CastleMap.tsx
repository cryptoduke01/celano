"use client";

import { CastleMapDots } from "./CastlePatterns";

// Visual "castle map" showing positions as rooms inside the fortress.
// Industry feel: schematic, secure, map-like.

interface Position {
  token: string;
  handle: string;
  encrypted: boolean;
}

export function CastleMap({ positions }: { positions: Position[] }) {
  return (
    <div className="institutional-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs tracking-[2px] text-zinc-500">CASTLE LAYOUT</div>
          <div className="font-medium">The Keep • Inner Chambers</div>
        </div>
        <div className="text-[10px] text-emerald-400">SECURE • ENCRYPTED</div>
      </div>

      <div className="castle-stone rounded-xl border border-white/10 p-4 bg-zinc-950/60">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {positions.length > 0 ? (
            positions.map((pos, idx) => (
              <div key={idx} className="rounded border border-white/10 bg-white/5 p-3">
                <div className="flex justify-between">
                  <span className="font-mono text-emerald-400">{pos.token}</span>
                  <span className="text-[10px] text-white/40">ROOM {idx + 1}</span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-white/60 truncate">{pos.handle}</div>
                <div className="mt-2 text-[10px] text-emerald-400/80">ENCRYPTED • GUARDED</div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-zinc-500 text-sm">
              The keep is quiet.<br />No positions inside yet.
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <CastleMapDots />
        </div>
      </div>

      <div className="mt-3 text-[10px] text-center text-zinc-500 tracking-widest">
        ONLY THE INITIATED MAY ENTER THESE CHAMBERS
      </div>
    </div>
  );
}
