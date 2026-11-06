"use client";
import { useState } from "react";
import { Check, Clock, X } from "lucide-react";
import { Avatar, BodyMap, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, Resident } from "@/lib/data";

const TASKS = [
  { id: "bath", i: "ShowerHead", l: "Bath", c: "#176a7c" },
  { id: "meal", i: "Utensils", l: "Meal", c: "#176a7c" },
  { id: "water", i: "GlassWater", l: "Water", c: "#176a7c" },
  { id: "walk", i: "Footprints", l: "Walk", c: "#176a7c" },
  { id: "toilet", i: "Bath", l: "Toilet", c: "#176a7c" },
  { id: "sleep", i: "Moon", l: "Rest", c: "#176a7c" },
];

export default function Care() {
  const { residents } = useApp();
  const [id, setId] = useState(residents[0].id);
  const r: Resident = residents.find((x) => x.id === id) ?? residents[0];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [meds, setMeds] = useState<Record<string, string>>({});
  const [moods, setMoods] = useState<Record<string, keyof typeof MOODS>>({});
  const [pins, setPins] = useState<{ x: number; y: number; side: "front" | "back" }[]>([]);
  const [tab, setTab] = useState<"tasks" | "meds" | "body" | "incident">("tasks");
  const [sent, setSent] = useState(false);

  const k = (a: string, i?: number) => `${r.id}-${a}${i ?? ""}`;
  const progress = Math.round((TASKS.filter((t) => done[k(t.id)]).length / TASKS.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-gold">Day shift · 07:00–15:00</div>
        <h1 className="text-4xl font-semibold text-forest">Care round</h1>
      </div>

      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
        {residents.map((x) => (
          <button key={x.id} onClick={() => { setId(x.id); setSent(false); }} className="flex shrink-0 flex-col items-center gap-1.5 rounded-3xl p-3 transition-all" style={x.id === id ? { background: "var(--forest)", color: "#fff" } : { background: "#fff", border: "1px solid var(--line)" }}>
            <Avatar name={x.name} hue={x.hue} size={48} />
            <span className="text-[11px] font-bold">{x.preferred.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="card flex flex-wrap items-center gap-4 p-5">
        <Avatar name={r.name} hue={r.hue} size={56} />
        <div className="flex-1">
          <div className="text-2xl font-semibold text-forest">{r.preferred}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {r.alerts.map((a) => <span key={a} className="rounded-full bg-[#fbe0e7] px-2.5 py-0.5 text-[11px] font-bold text-[#c2395a]">{a}</span>)}
          </div>
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(MOODS) as (keyof typeof MOODS)[]).map((m) => (
            <button key={m} onClick={() => setMoods({ ...moods, [r.id]: m })} className="grid h-12 w-12 place-items-center rounded-2xl transition-all" style={{ background: (moods[r.id] ?? r.mood) === m ? MOODS[m].color + "33" : "#eef3f5", outline: (moods[r.id] ?? r.mood) === m ? `2px solid ${MOODS[m].color}` : "none" }}><Icon name={MOODS[m].icon} size={22} style={{ color: MOODS[m].color }} /></button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {([["tasks", "ListChecks"], ["meds", "Pill"], ["body", "Accessibility"], ["incident", "Siren"]] as const).map(([t, ic]) => (
          <button key={t} onClick={() => setTab(t)} className="chip capitalize" data-on={tab === t}><Icon name={ic} size={15} /> {t === "meds" ? "MAR" : t}</button>
        ))}
      </div>

      {tab === "tasks" && (
        <div className="card p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-gradient-to-r from-gold2 to-gold transition-all duration-700" style={{ width: progress + "%" }} /></div>
            <span className="text-sm font-bold text-forest">{progress}%</span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {TASKS.map((t) => {
              const on = done[k(t.id)];
              return (
                <button key={t.id} onClick={() => setDone({ ...done, [k(t.id)]: !on })} className="relative flex flex-col items-center gap-2 rounded-3xl p-4 transition-all active:scale-95" style={{ background: on ? t.c : t.c + "18", color: on ? "#fff" : t.c }}>
                  <Icon name={t.i} size={30} />
                  <span className="text-[11px] font-bold">{t.l}</span>
                  {on && <span className="pop absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-forest"><Check size={12} /></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "meds" && (
        <div className="card space-y-3 p-6">
          {r.meds.length === 0 && <div className="py-6 text-center text-mute">No medication</div>}
          {r.meds.map((m, i) => {
            const st = meds[k("m", i)] ?? m.status;
            return (
              <div key={i} className="flex flex-wrap items-center gap-3 rounded-2xl bg-cream p-3">
                <span className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-forest"><Clock size={13} />{m.time}</span>
                <div className="min-w-[120px] flex-1 text-sm font-bold text-forest">{m.name}<div className="text-xs font-medium text-mute">{m.dose}</div></div>
                {st === "due" ? (
                  <div className="flex gap-2">
                    <button onClick={() => setMeds({ ...meds, [k("m", i)]: "given" })} className="grid h-11 w-11 place-items-center rounded-full bg-[#3f9a76] text-white"><Check size={20} /></button>
                    <button onClick={() => setMeds({ ...meds, [k("m", i)]: "refused" })} className="grid h-11 w-11 place-items-center rounded-full bg-[#9b3b4a] text-white"><X size={20} /></button>
                  </div>
                ) : (
                  <span className="rounded-full px-3 py-1.5 text-xs font-bold capitalize text-white" style={{ background: { given: "#3f9a76", refused: "#ee7b61", missed: "#c2395a", due: "#e0a02b" }[st] }}>{st}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "body" && (
        <div className="card p-6">
          <BodyMap pins={pins} onAdd={(p) => setPins([...pins, p])} />
          <div className="mt-4 flex justify-center gap-3">
            <span className="chip" data-on="false">{pins.length} marks</span>
            {pins.length > 0 && <button onClick={() => setPins([])} className="chip" data-on="false">Clear</button>}
          </div>
        </div>
      )}

      {tab === "incident" && (
        <div className="card p-6">
          {sent ? (
            <div className="py-8 text-center">
              <div className="pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#3f9a76] text-white"><Check size={36} /></div>
              <div className="mt-4 text-2xl font-semibold text-forest">Manager notified</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {[["Fall", "ArrowDownToLine", "#176a7c"], ["Injury", "Bandage", "#176a7c"], ["Illness", "Thermometer", "#176a7c"], ["Behaviour", "Brain", "#176a7c"], ["Other", "CircleHelp", "#176a7c"]].map(([l, ic, c]) => (
                  <button key={l} onClick={() => setSent(true)} className="flex flex-col items-center gap-2 rounded-3xl p-4 text-white transition-transform active:scale-95" style={{ background: c }}>
                    <Icon name={ic} size={28} />
                    <span className="text-xs font-bold">{l}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 text-center text-xs font-semibold text-mute">Tap type to report</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
