"use client";
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS } from "@/lib/data";

export default function Residents() {
  const { residents } = useApp();
  const [q, setQ] = useState("");
  const list = residents.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold text-forest">Residents</h1>
        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input className="input !rounded-full !pl-11" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => {
          const room = ROOMS.find((x) => x.id === r.room);
          return (
            <Link href={`/app/residents/${r.id}`} key={r.id} className="card group relative overflow-hidden p-5 transition-all hover:shadow-xl">
              <div className="absolute -right-4 -top-4 opacity-20 transition-transform">{room && <Gem color={room.color} size={110} />}</div>
              <div className="relative flex items-center gap-4">
                <Avatar name={r.name} hue={r.hue} size={60} />
                <div className="min-w-0">
                  <div className="truncate text-xl font-semibold text-forest">{r.preferred}</div>
                  <div className="text-xs font-semibold text-mute">{r.age} yrs · {room?.name ?? "—"}</div>
                </div>
                <Icon name={MOODS[r.mood].icon} size={24} className="ml-auto" style={{ color: MOODS[r.mood].color }} />
              </div>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {r.alerts.length === 0 && <span className="chip" data-on="false" style={{ color: "#3f9a76" }}>All good</span>}
                {r.alerts.map((a) => (
                  <span key={a} className="chip" data-on="false" style={{ color: "#c2395a", background: "#fff6f8", borderColor: "#fbe0e7" }}>{a}</span>
                ))}
              </div>
              <div className="relative mt-4 flex gap-1">
                {[1, 2, 3, 4].map((i) => <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= r.care ? "var(--gold)" : "#e3ecef" }} />)}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
