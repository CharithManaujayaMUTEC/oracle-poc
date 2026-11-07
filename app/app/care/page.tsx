"use client";
import { useState } from "react";
import { Check, Clock, Lock, Sparkles, Wifi, WifiOff, X } from "lucide-react";
import { Pill, Tabs } from "@/components/kit";
import { Avatar, BodyMap, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, Resident } from "@/lib/data";

type Tab = "tasks" | "meds" | "body" | "incident" | "handover";

const TASKS = [
  { id: "bath", i: "ShowerHead", l: "Bath" },
  { id: "meal", i: "Utensils", l: "Meal" },
  { id: "water", i: "GlassWater", l: "Hydration" },
  { id: "walk", i: "Footprints", l: "Mobility" },
  { id: "toilet", i: "Bath", l: "Toileting" },
  { id: "sleep", i: "Moon", l: "Rest" },
];

export default function Care() {
  const { residents, user, toast, log } = useApp();
  const [id, setId] = useState(residents[0].id);
  const r: Resident = residents.find((x) => x.id === id) ?? residents[0];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [meds, setMeds] = useState<Record<string, string>>({});
  const [moods, setMoods] = useState<Record<string, keyof typeof MOODS>>({});
  const [pins, setPins] = useState<{ x: number; y: number; side: "front" | "back" }[]>([]);
  const [tab, setTab] = useState<Tab>("tasks");
  const [sent, setSent] = useState(false);
  const [offline, setOffline] = useState(false);
  const [queued, setQueued] = useState(0);
  const [conflict, setConflict] = useState(false);
  const [handover, setHandover] = useState("");
  const [handed, setHanded] = useState(false);

  const restricted = user?.role === "caregiver";
  const k = (a: string, i?: number) => `${r.id}-${a}${i ?? ""}`;
  const progress = Math.round((TASKS.filter((t) => done[k(t.id)]).length / TASKS.length) * 100);
  const rec = (action: string) => {
    if (offline) setQueued((q) => q + 1);
    log(action, r.name);
  };

  const draft = () => {
    const meds = residents.flatMap((x) => x.meds.filter((m) => m.status === "missed").map((m) => `${x.preferred}: ${m.name} ${m.time} missed`));
    setHandover(`Day shift handover — House 1\n• Changes in condition: Kamala (Onyx) fall at 07:40, doctor review today.\n• Medication exceptions: ${meds.join("; ") || "none"}.\n• Appointments: Nimal cardiology Friday 10:30 (escort Ruwan).\n• Outstanding: Sita low mood — extra music/1:1 time.\n• Follow-up: falls reassessment for Kamala.`);
    log("Prepared shift handover draft", "House 1 · Day shift", true);
    toast("SAGE drafted the handover. Review before submitting.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gold">Day shift · 07:00–15:00 · House 1</div>
          <h1 className="text-3xl font-semibold tracking-tight text-forest">ONE Care</h1>
        </div>
        <button onClick={() => { if (offline) { setOffline(false); if (queued > 0) { setConflict(true); } toast(queued ? `Back online · syncing ${queued} records` : "Back online"); } else { setOffline(true); toast("Offline mode · records saved on this device"); } }} className="chip" data-on={offline}>
          {offline ? <WifiOff size={15} /> : <Wifi size={15} />}{offline ? `Offline · ${queued} queued` : "Online"}
        </button>
      </div>

      {conflict && (
        <div className="card flex flex-wrap items-center gap-4 border-[#e0a02b] bg-[#fffaf0] p-4">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fcefce] text-[#a5741a]"><Icon name="GitMerge" size={18} /></span>
          <div className="min-w-0 flex-1 text-sm font-semibold text-forest">Sync conflict: hydration for {r.preferred} was recorded on two devices<div className="text-xs font-medium text-mute">Nothing is overwritten silently. Choose what to keep.</div></div>
          <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => { setConflict(false); setQueued(0); toast("Both records kept"); log("Resolved sync conflict (kept both)", r.name); }}>Keep both</button>
          <button className="btn btn-ghost !px-4 !py-1.5 text-xs" onClick={() => { setConflict(false); setQueued(0); toast("Kept the server version"); }}>Keep server</button>
        </div>
      )}

      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        {residents.map((x) => (
          <button key={x.id} onClick={() => { setId(x.id); setSent(false); }} className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl p-3" style={x.id === id ? { background: "var(--forest)", color: "#fff" } : { background: "#fff", border: "1px solid var(--line)" }}>
            <Avatar name={x.name} hue={x.hue} size={46} />
            <span className="text-[11px] font-semibold">{x.preferred.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="card flex flex-wrap items-center gap-4 p-5">
        <Avatar name={r.name} hue={r.hue} size={56} />
        <div className="flex-1">
          <div className="text-xl font-semibold text-forest">{r.preferred}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">{r.alerts.map((a) => <Pill key={a} tone="red">{a}</Pill>)}<Pill tone="gray">{r.mobility}</Pill><Pill tone="gray">{r.diet}</Pill></div>
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(MOODS) as (keyof typeof MOODS)[]).map((m) => {
            const on = (moods[r.id] ?? r.mood) === m;
            return (
              <button key={m} title={MOODS[m].label} onClick={() => { setMoods({ ...moods, [r.id]: m }); rec(`Recorded mood: ${MOODS[m].label}`); }} className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: on ? MOODS[m].color + "26" : "#F0EEE6", outline: on ? `2px solid ${MOODS[m].color}` : "none" }}>
                <Icon name={MOODS[m].icon} size={22} style={{ color: MOODS[m].color }} />
              </button>
            );
          })}
        </div>
      </div>

      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "tasks", label: "Daily care", icon: "ListChecks" },
        { id: "meds", label: "MAR", icon: "Pill" },
        { id: "body", label: "Body map", icon: "Accessibility" },
        { id: "incident", label: "Incident", icon: "Siren" },
        { id: "handover", label: "Handover", icon: "ClipboardCheck" },
      ]} />

      {tab === "tasks" && (
        <div className="card p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: progress + "%" }} /></div>
            <span className="text-sm font-semibold text-forest">{progress}%</span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {TASKS.map((t) => {
              const on = done[k(t.id)];
              return (
                <button key={t.id} onClick={() => { setDone({ ...done, [k(t.id)]: !on }); if (!on) rec(`Recorded: ${t.l}`); }} className="relative flex flex-col items-center gap-2 rounded-xl p-4 active:scale-95" style={{ background: on ? "var(--forest-2)" : "#F0EEE6", color: on ? "#fff" : "var(--forest)" }}>
                  <Icon name={t.i} size={28} />
                  <span className="text-[11px] font-semibold">{t.l}</span>
                  {on && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-forest"><Check size={12} /></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "meds" && (restricted ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[#ECEAE0] text-mute"><Lock size={24} /></span>
          <div className="mt-4 font-semibold text-forest">Medication records are restricted</div>
          <p className="mt-1 text-sm text-mute">Only authorised nursing staff can administer and record medication.</p>
        </div>
      ) : (
        <div className="card space-y-3 p-6">
          {r.meds.length === 0 && <div className="py-6 text-center text-mute">No medication</div>}
          {r.meds.map((m, i) => {
            const st = meds[k("m", i)] ?? m.status;
            return (
              <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg bg-cream p-3">
                <span className="flex items-center gap-1 rounded-md bg-white px-3 py-2 text-xs font-bold text-forest"><Clock size={13} />{m.time}</span>
                <div className="min-w-[120px] flex-1 text-sm font-semibold text-forest">{m.name}<div className="text-xs font-medium text-mute">{m.dose}</div></div>
                {st === "due" || st === "missed" ? (
                  <div className="flex gap-2">
                    <button onClick={() => { setMeds({ ...meds, [k("m", i)]: "given" }); rec(`MAR given: ${m.name}`); }} className="grid h-10 w-10 place-items-center rounded-lg bg-[#2f7d5c] text-white"><Check size={18} /></button>
                    <button onClick={() => { setMeds({ ...meds, [k("m", i)]: "refused" }); rec(`MAR refused: ${m.name}`); }} className="grid h-10 w-10 place-items-center rounded-lg bg-[#b02a4a] text-white"><X size={18} /></button>
                  </div>
                ) : <Pill tone={st === "given" ? "green" : "red"}>{st}</Pill>}
              </div>
            );
          })}
        </div>
      ))}

      {tab === "body" && (
        <div className="card p-6">
          <BodyMap pins={pins} onAdd={(p) => { setPins([...pins, p]); rec("Body map: marked finding"); }} />
          <div className="mt-4 flex justify-center gap-3">
            <Pill tone="gray">{pins.length} marks</Pill>
            {pins.length > 0 && <button onClick={() => setPins([])} className="chip" data-on="false">Clear</button>}
          </div>
        </div>
      )}

      {tab === "incident" && (
        <div className="card p-6">
          {sent ? (
            <div className="py-8 text-center">
              <div className="pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#2f7d5c] text-white"><Check size={30} /></div>
              <div className="mt-4 text-xl font-semibold text-forest">Manager notified</div>
              <a href="/app/incidents" className="mt-2 inline-block text-sm font-semibold text-gold">Open incident register →</a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {[["Fall", "ArrowDownToLine"], ["Injury", "Bandage"], ["Illness", "Thermometer"], ["Behaviour", "Brain"], ["Medication", "Pill"], ["Other", "CircleHelp"]].map(([l, ic]) => (
                  <button key={l} onClick={() => { setSent(true); rec(`Reported incident: ${l}`); toast("Incident reported"); }} className="flex flex-col items-center gap-2 rounded-xl bg-[#F0EEE6] p-4 text-forest transition-colors hover:bg-forest hover:text-white">
                    <Icon name={ic} size={26} /><span className="text-xs font-semibold">{l}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 text-center text-xs font-semibold text-mute">Tap the type to report for {r.preferred}</div>
            </>
          )}
        </div>
      )}

      {tab === "handover" && (
        <div className="card p-6">
          {handed ? (
            <div className="py-8 text-center"><div className="pop mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#2f7d5c] text-white"><Check size={30} /></div><div className="mt-4 text-xl font-semibold text-forest">Handover submitted to the evening shift</div></div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-forest">Shift handover</span>
                <button className="btn btn-ghost !px-4 !py-1.5 text-xs" onClick={draft}><Sparkles size={14} /> Draft with SAGE</button>
              </div>
              <textarea className="input font-mono !text-[13px]" rows={9} placeholder="Outstanding tasks, changes in condition, medication exceptions, appointments, incidents, follow-ups…" value={handover} onChange={(e) => setHandover(e.target.value)} />
              <button disabled={handover.length < 10} className="btn btn-primary mt-4 disabled:opacity-40" onClick={() => { setHanded(true); log("Submitted shift handover", "House 1 · Day"); toast("Handover submitted"); }}>Submit handover</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
