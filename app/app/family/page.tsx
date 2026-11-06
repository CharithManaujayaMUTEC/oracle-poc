"use client";
import { useState } from "react";
import { CalendarDays, Receipt, Video } from "lucide-react";
import { Avatar, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS, SERVICES, fmt } from "@/lib/data";

const TIMELINE = [
  { t: "07:30", i: "Sunrise", l: "Woke up", c: "#176a7c" },
  { t: "08:15", i: "Utensils", l: "Breakfast", c: "#176a7c" },
  { t: "10:00", i: "Footprints", l: "Garden walk", c: "#176a7c" },
  { t: "12:30", i: "Utensils", l: "Lunch", c: "#176a7c" },
  { t: "15:00", i: "Music", l: "Music hour", c: "#176a7c" },
];

export default function Family() {
  const { residents } = useApp();
  const r = residents[0];
  const room = ROOMS.find((x) => x.id === r.room)!;
  const [call, setCall] = useState(false);
  const [req, setReq] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${room.soft}, #fff 75%)` }}>
        <div className="absolute -right-4 -top-4 opacity-40"><Gem color={room.color} size={190} /></div>
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar name={r.name} hue={r.hue} size={88} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-gold">Today</div>
            <h1 className="text-4xl font-semibold text-forest">{r.preferred}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-forest"><Icon name={MOODS[r.mood].icon} size={22} style={{ color: MOODS[r.mood].color }} />{MOODS[r.mood].label} · {room.name}</div>
          </div>
          <button onClick={() => setCall(true)} className="btn btn-primary"><Video size={18} /> Video call</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <div className="mb-5 text-xl font-semibold text-forest">Today&apos;s story</div>
          <div className="relative space-y-5 pl-2">
            <div className="absolute bottom-3 left-[27px] top-3 w-0.5 bg-gradient-to-b from-gold to-transparent" />
            {TIMELINE.map((x, i) => (
              <div key={i} className="fadeup relative flex items-center gap-4" style={{ animationDelay: `${i * 90}ms` }}>
                <span className="z-10 grid h-12 w-12 place-items-center rounded-full text-white ring-4 ring-white" style={{ background: x.c }}><Icon name={x.i} size={20} /></span>
                <div className="text-sm font-bold text-forest">{x.l}</div>
                <div className="ml-auto text-xs font-semibold text-mute">{x.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sage text-forest2"><CalendarDays /></span>
            <div className="flex-1 text-sm font-bold text-forest">Cardiology<div className="text-xs font-medium text-mute">Fri · 10:30 · escorted</div></div>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fcefce] text-gold"><Receipt /></span>
            <div className="flex-1 text-sm font-bold text-forest">November<div className="text-xs font-medium text-mute">{fmt(room.price + 18000)}</div></div>
            <span className="rounded-full bg-[#dcf0e6] px-3 py-1 text-xs font-bold text-[#3f9a76]">Paid</span>
          </div>
          <div className="card p-5">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-mute">Request</div>
            <div className="grid grid-cols-4 gap-2">
              {SERVICES.filter((s) => ["salon", "car", "physio", "meals"].includes(s.id)).map((s) => {
                const on = req.includes(s.id);
                return (
                  <button key={s.id} title={s.name} onClick={() => setReq(on ? req.filter((x) => x !== s.id) : [...req, s.id])} className="grid aspect-square place-items-center rounded-2xl text-white transition-all active:scale-90" style={{ background: s.tone, opacity: on ? 1 : 0.55, outline: on ? `3px solid ${s.tone}55` : "none", outlineOffset: 2 }}>
                    <Icon name={on ? "Check" : s.icon} size={22} />
                  </button>
                );
              })}
            </div>
            {req.length > 0 && <div className="pop mt-3 text-center text-xs font-bold text-forest2">Request sent</div>}
          </div>
        </div>
      </div>

      {call && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-forest/90 p-6 backdrop-blur" onClick={() => setCall(false)}>
          <div className="text-center">
            <div className="relative mx-auto w-fit">
              <span className="absolute inset-0 rounded-full bg-gold/40" style={{ animation: "pulse-ring 1.6s infinite" }} />
              <Avatar name={r.name} hue={r.hue} size={140} />
            </div>
            <div className="mt-6 text-3xl font-semibold text-white">Calling {r.preferred}…</div>
            <button className="btn mt-8 bg-[#c2395a] text-white">End</button>
          </div>
        </div>
      )}
    </div>
  );
}
