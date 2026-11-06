"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Droplets, HeartPulse, Phone, Thermometer, Wind, Weight } from "lucide-react";
import { Avatar, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS } from "@/lib/data";

export default function Passport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { residents } = useApp();
  const r = residents.find((x) => x.id === id);
  if (!r) return <div className="card p-10 text-center">Not found</div>;
  const room = ROOMS.find((x) => x.id === r.room);
  const vit = [
    { i: HeartPulse, v: r.vitals.bp, l: "BP", c: "#176a7c" },
    { i: Droplets, v: r.vitals.pulse, l: "Pulse", c: "#176a7c" },
    { i: Thermometer, v: r.vitals.temp + "°", l: "Temp", c: "#176a7c" },
    { i: Wind, v: r.vitals.spo2 + "%", l: "SpO₂", c: "#176a7c" },
    { i: Weight, v: r.vitals.weight + "kg", l: "Weight", c: "#176a7c" },
  ];
  const mobIcon = { Independent: "Footprints", "Cane / frame": "Accessibility", Wheelchair: "Accessibility", Hoist: "ArrowUpFromLine" }[r.mobility];

  return (
    <div className="space-y-6">
      <Link href="/app/residents" className="inline-flex items-center gap-2 text-sm font-bold text-mute"><ArrowLeft size={16} /> Residents</Link>

      <div className="card relative overflow-hidden p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${room?.soft ?? "#fff"}, #fff 70%)` }}>
        <div className="absolute -right-6 -top-6 opacity-30">{room && <Gem color={room.color} size={200} />}</div>
        <div className="relative flex flex-wrap items-center gap-6">
          <Avatar name={r.name} hue={r.hue} size={96} />
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gold">Personal Care Passport</div>
            <h1 className="text-4xl font-semibold text-forest">{r.preferred}</h1>
            <div className="mt-1 text-sm font-semibold text-mute">{r.name} · {r.age} · {room?.name} · since {r.since}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip" data-on="false"><Icon name={MOODS[r.mood].icon} size={14} style={{ color: MOODS[r.mood].color }} /> {MOODS[r.mood].label}</span>
              {r.alerts.map((a) => <span key={a} className="chip" data-on="false" style={{ color: "#c2395a", background: "#fff6f8", borderColor: "#fbe0e7" }}>{a}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {vit.map(({ i: I, v, l, c }) => (
          <div key={l} className="card p-4 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl" style={{ background: c + "22", color: c }}><I size={20} /></span>
            <div className="mt-2 text-xl font-semibold text-forest">{v}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-mute">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 text-lg font-semibold text-forest">Support</div>
          <div className="space-y-3">
            {[
              [mobIcon!, r.mobility, "#176a7c"],
              ["Utensils", r.diet, "#176a7c"],
              ["ShieldAlert", r.allergies.length ? r.allergies.join(", ") : "No allergies", "#176a7c"],
              ["Stethoscope", r.conditions.join(" · "), "#176a7c"],
            ].map(([ic, t, c]) => (
              <div key={t} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: c }}><Icon name={ic} size={18} /></span>
                <span className="text-sm font-semibold text-forest">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 text-lg font-semibold text-forest">Medication</div>
          <div className="space-y-2">
            {r.meds.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <span className="grid h-9 w-14 place-items-center rounded-xl bg-white text-xs font-bold text-forest">{m.time}</span>
                <div className="min-w-0 flex-1 text-sm font-bold text-forest">{m.name}<div className="text-xs font-medium text-mute">{m.dose}</div></div>
                <span className="h-3 w-3 rounded-full" style={{ background: { given: "#3f9a76", due: "#e0a02b", refused: "#ee7b61", missed: "#c2395a" }[m.status] }} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 text-lg font-semibold text-forest">Loves</div>
          <div className="flex flex-wrap gap-2">
            {r.likes.map((l) => <span key={l} className="chip" data-on="false" style={{ background: "#fcefce", borderColor: "#f3e0b0" }}>{l}</span>)}
          </div>
          <div className="mt-6 text-lg font-semibold text-forest">Guardian</div>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-sage p-3">
            <Avatar name={r.guardian.name} hue="#0e8a9a" size={42} />
            <div className="flex-1 text-sm font-bold text-forest">{r.guardian.name}<div className="text-xs font-medium text-mute">{r.guardian.relation}</div></div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white"><Phone size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
