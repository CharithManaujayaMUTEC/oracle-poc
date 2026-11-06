"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, Gem } from "@/components/ui";
import { useApp } from "@/lib/store";
import { ROOMS, Room, fmt } from "@/lib/data";

const ST = { occupied: "#3f9a76", vacant: "#9aa7c7", reserved: "#e0a02b", maintenance: "#c2395a" } as const;

export default function Rooms() {
  const { residents } = useApp();
  const [sel, setSel] = useState<Room | null>(null);
  const res = sel && residents.find((r) => r.room === sel.id);
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold text-forest">Rooms</h1>
      {[1, 2].map((h) => (
        <div key={h} className="card p-6">
          <div className="mb-4 text-2xl font-semibold text-forest">House {h}</div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {ROOMS.filter((r) => r.house === h).map((r) => {
              const rs = residents.find((x) => x.room === r.id);
              return (
                <button key={r.id} onClick={() => setSel(r)} className="group relative overflow-hidden rounded-3xl p-5 text-left transition-all hover:shadow-xl" style={{ background: r.soft }}>
                  <span className="absolute right-3 top-3 h-3 w-3 rounded-full" style={{ background: ST[r.status] }} />
                  <div className="transition-transform"><Gem color={r.color} size={70} /></div>
                  <div className="mt-2 text-xl font-semibold" style={{ color: r.color }}>{r.name}</div>
                  <div className="mt-1 flex h-8 items-center">
                    {rs ? <Avatar name={rs.name} hue={rs.hue} size={28} /> : <span className="text-[11px] font-bold capitalize text-mute">{r.status}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {sel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-4 backdrop-blur-sm md:items-center" onClick={() => setSel(null)}>
          <div className="pop card w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative grid place-items-center p-8" style={{ background: sel.soft }}>
              <button onClick={() => setSel(null)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white"><X size={16} /></button>
              <Gem color={sel.color} size={110} />
              <div className="text-3xl font-semibold" style={{ color: sel.color }}>{sel.name}</div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="chip capitalize" data-on="false" style={{ color: ST[sel.status] }}>● {sel.status}</span>
                <span className="text-xl font-semibold text-forest">{fmt(sel.price)}</span>
              </div>
              {res && (
                <div className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                  <Avatar name={res.name} hue={res.hue} size={44} />
                  <div className="text-sm font-bold text-forest">{res.preferred}<div className="text-xs font-medium text-mute">since {res.since}</div></div>
                </div>
              )}
              {!res && sel.status !== "maintenance" && <a href="/app/register" className="btn btn-gold w-full">Admit here</a>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
