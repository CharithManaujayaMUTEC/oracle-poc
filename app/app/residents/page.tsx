"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { PageHead, Pill } from "@/components/kit";
import { Avatar, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS } from "@/lib/data";

type F = "all" | "alerts" | "h1" | "h2";

export default function Residents() {
  const { residents, user } = useApp();
  const [q, setQ] = useState("");
  const [f, setF] = useState<F>("all");
  const canRegister = user?.role !== "caregiver";
  const list = residents.filter((r) => {
    const room = ROOMS.find((x) => x.id === r.room);
    return r.name.toLowerCase().includes(q.toLowerCase()) && (f === "all" || (f === "alerts" ? r.alerts.length > 0 : `h${room?.house}` === f));
  });

  return (
    <div>
      <PageHead title="Residents" sub={`${residents.length} in care`} actions={canRegister && <Link href="/app/register" className="btn btn-gold"><UserPlus size={16} /> Register client</Link>} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input className="input !pl-11" placeholder="Search residents" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {([["all", "All"], ["alerts", "With alerts"], ["h1", "House 1"], ["h2", "House 2"]] as const).map(([k, l]) => <button key={k} className="chip" data-on={f === k} onClick={() => setF(k)}>{l}</button>)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => {
          const room = ROOMS.find((x) => x.id === r.room);
          return (
            <Link href={`/app/residents/${r.id}`} key={r.id} className="card group relative overflow-hidden p-5 transition-shadow hover:shadow-xl">
              <div className="absolute -right-4 -top-4 opacity-20">{room && <Gem color={room.color} size={110} />}</div>
              <div className="relative flex items-center gap-4">
                <Avatar name={r.name} hue={r.hue} size={56} />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold text-forest">{r.preferred}</div>
                  <div className="text-xs font-semibold text-mute">{r.age} yrs · {room?.name ?? "—"} · House {room?.house}</div>
                </div>
                <Icon name={MOODS[r.mood].icon} size={22} className="ml-auto" style={{ color: MOODS[r.mood].color }} />
              </div>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {r.alerts.length === 0 && <Pill tone="green">No alerts</Pill>}
                {r.alerts.map((a) => <Pill key={a} tone="red">{a}</Pill>)}
              </div>
              <div className="relative mt-4 flex gap-1">{[1, 2, 3, 4].map((i) => <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= r.care ? "var(--gold)" : "var(--track)" }} />)}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
