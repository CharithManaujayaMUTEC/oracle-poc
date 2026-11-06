"use client";
import Link from "next/link";
import { useState } from "react";
import { Avatar, Gem, Icon } from "@/components/ui";
import { Modal, PageHead, Pill, Stat } from "@/components/kit";
import { useApp } from "@/lib/store";
import { FACILITIES, ROOMS, Room, RoomStatus, fmt } from "@/lib/data";

const ST: Record<RoomStatus, string> = { occupied: "#0e8a9a", vacant: "#9aa7b0", reserved: "#e0a02b", maintenance: "#c2395a" };
const STATUSES: RoomStatus[] = ["occupied", "vacant", "reserved", "maintenance"];

export default function Rooms() {
  const { residents, toast, log } = useApp();
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [fac, setFac] = useState<"all" | "h1" | "h2">("all");
  const [sel, setSel] = useState<Room | null>(null);

  const list = rooms.filter((r) => fac === "all" || `h${r.house}` === fac);
  const count = (s: RoomStatus) => list.filter((r) => r.status === s).length;
  const setStatus = (r: Room, status: RoomStatus) => {
    setRooms((p) => p.map((x) => (x.id === r.id ? { ...x, status } : x)));
    setSel({ ...r, status });
    log(`Room status → ${status}`, r.name);
    toast(`${r.name}: ${status}`);
  };
  const res = sel && residents.find((r) => r.room === sel.id);

  return (
    <div>
      <PageHead
        title="Facilities & rooms"
        sub="Room inventory, occupancy and maintenance"
        actions={[{ id: "all", name: "All" }, ...FACILITIES].map((f) => <button key={f.id} onClick={() => setFac(f.id as "all" | "h1" | "h2")} className="chip" data-on={fac === f.id}>{f.name}</button>)}
      />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat icon="Building2" label="Total rooms" value={list.length} />
        <Stat icon="BedDouble" label="Occupied" value={count("occupied")} tone="teal" />
        <Stat icon="DoorOpen" label="Vacant" value={count("vacant")} tone="gray" />
        <Stat icon="CalendarClock" label="Reserved" value={count("reserved")} tone="amber" />
        <Stat icon="Wrench" label="Maintenance" value={count("maintenance")} tone="red" />
      </div>

      <div className="space-y-6">
        {[1, 2].filter((h) => fac === "all" || fac === `h${h}`).map((h) => (
          <div key={h} className="card p-6">
            <div className="mb-4 text-lg font-semibold text-forest">House {h}</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {rooms.filter((r) => r.house === h).map((r) => {
                const rs = residents.find((x) => x.room === r.id);
                return (
                  <button key={r.id} onClick={() => setSel(r)} className="relative overflow-hidden rounded-xl p-5 text-left transition-shadow hover:shadow-lg" style={{ background: r.soft }}>
                    <span className="absolute right-3 top-3 h-3 w-3 rounded-full" style={{ background: ST[r.status] }} />
                    <Gem color={r.color} size={62} />
                    <div className="mt-2 text-lg font-semibold" style={{ color: r.color }}>{r.name}</div>
                    <div className="mt-1 flex h-8 items-center">{rs ? <><Avatar name={rs.name} hue={rs.hue} size={26} /><span className="ml-2 text-xs font-semibold text-forest">{rs.preferred.split(" ")[0]}</span></> : <span className="text-[11px] font-bold capitalize text-mute">{r.status}</span>}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 font-semibold text-forest">Upcoming admissions</div>
          {[["Kusum Ratnayake", "Ruby", "Mon 9 Nov"], ["Lalith Fernando", "Coral", "Fri 13 Nov"], ["Zeenath Marikar", "Sapphire", "Wed 11 Nov"]].map(([n, r, d]) => (
            <div key={n} className="flex items-center gap-3 border-t border-line py-3 first:border-0"><Avatar name={n} hue="#176a7c" size={36} /><div className="flex-1 text-sm font-semibold text-forest">{n}<div className="text-xs font-medium text-mute">{r}</div></div><Pill tone="blue">{d}</Pill></div>
          ))}
        </div>
        <div className="card p-6">
          <div className="mb-4 font-semibold text-forest">Expected departures</div>
          {[["Short stay — Hasini J.", "Coral", "Sun 15 Nov"]].map(([n, r, d]) => (
            <div key={n} className="flex items-center gap-3 border-t border-line py-3 first:border-0"><span className="grid h-9 w-9 place-items-center rounded-lg bg-sand text-forest2"><Icon name="LogOut" size={16} /></span><div className="flex-1 text-sm font-semibold text-forest">{n}<div className="text-xs font-medium text-mute">{r}</div></div><Pill tone="gray">{d}</Pill></div>
          ))}
        </div>
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel ? `${sel.name} · House ${sel.house}` : ""}>
        {sel && (
          <div className="space-y-4">
            <div className="grid place-items-center rounded-xl p-6" style={{ background: sel.soft }}><Gem color={sel.color} size={90} /></div>
            <div className="flex items-center justify-between"><Pill tone="teal"><i className="h-2 w-2 rounded-full" style={{ background: ST[sel.status] }} /><span className="capitalize">{sel.status}</span></Pill><span className="font-semibold text-forest">{fmt(sel.price)} / mo</span></div>
            {res && <Link href={`/app/residents/${res.id}`} className="flex items-center gap-3 rounded-lg bg-cream p-3"><Avatar name={res.name} hue={res.hue} size={40} /><div className="text-sm font-semibold text-forest">{res.preferred}<div className="text-xs font-medium text-mute">since {res.since}</div></div></Link>}
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-mute">Set status</div>
              <div className="flex flex-wrap gap-2">{STATUSES.filter((s) => s !== "occupied" || res).map((s) => <button key={s} className="chip capitalize" data-on={sel.status === s} onClick={() => setStatus(sel, s)}>{s}</button>)}</div>
            </div>
            {!res && sel.status !== "maintenance" && <Link href="/app/register" className="btn btn-gold w-full">Admit a resident here</Link>}
          </div>
        )}
      </Modal>
    </div>
  );
}
