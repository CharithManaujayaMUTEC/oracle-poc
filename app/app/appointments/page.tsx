"use client";
import { useState } from "react";
import { Bell, Car, MapPin, Plus, UserRound } from "lucide-react";
import { Field, Modal, PageHead, Pill } from "@/components/kit";
import { useApp } from "@/lib/store";
import { APPOINTMENTS, Appt } from "@/lib/mock";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPES = ["GP review", "Cardiology", "Neurology", "Physiotherapy", "Eye clinic", "Dietitian", "Dental", "Bloods"];

export default function Appointments() {
  const { residents, toast, log } = useApp();
  const [list, setList] = useState<Appt[]>(APPOINTMENTS);
  const [add, setAdd] = useState(false);
  const [f, setF] = useState({ resident: residents[0].name, type: TYPES[0], day: 1, time: "10:00", place: "", transport: "None", notify: true });
  const base = new Date();
  const label = (d: number) => {
    const x = new Date(base); x.setDate(x.getDate() + d);
    return { dow: DAYS[x.getDay()], date: x.getDate() };
  };

  return (
    <div>
      <PageHead title="Appointments" sub="Healthcare coordination for the week ahead" actions={<button className="btn btn-gold" onClick={() => setAdd(true)}><Plus size={16} /> New appointment</button>} />
      <div className="grid gap-4 md:grid-cols-7">
        {Array.from({ length: 7 }, (_, d) => {
          const l = label(d);
          const items = list.filter((a) => a.day === d).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={d} className="card flex min-h-[200px] flex-col p-3" style={d === 0 ? { borderColor: "var(--gold)" } : {}}>
              <div className="mb-3 flex items-baseline gap-2"><span className="text-xs font-bold uppercase tracking-wider text-mute">{l.dow}</span><span className="text-xl font-semibold text-forest">{l.date}</span></div>
              <div className="space-y-2">
                {items.map((a) => (
                  <div key={a.id} className="rounded-lg border-l-4 bg-cream p-2.5" style={{ borderColor: a.status === "Confirmed" ? "#2f7d5c" : "#0e8a9a" }}>
                    <div className="text-[11px] font-bold text-mute">{a.time}</div>
                    <div className="text-xs font-semibold text-forest">{a.type}</div>
                    <div className="text-[11px] text-mute">{a.resident.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-6 divide-y divide-line overflow-hidden">
        {[...list].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)).map((a) => (
          <div key={a.id} className="grid items-center gap-3 px-5 py-4 md:grid-cols-[110px_1.3fr_1.4fr_1fr_auto]">
            <div className="text-sm font-semibold text-forest">{label(a.day).dow} {label(a.day).date}<div className="text-xs text-mute">{a.time}</div></div>
            <div className="text-sm font-semibold text-forest">{a.type}<div className="text-xs font-medium text-mute">{a.resident}</div></div>
            <div className="space-y-0.5 text-xs font-semibold text-mute">
              <div className="flex items-center gap-1.5"><MapPin size={13} />{a.place} · {a.provider}</div>
              <div className="flex items-center gap-1.5"><UserRound size={13} />{a.staff} <Car size={13} className="ml-2" />{a.transport}</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-mute"><Bell size={13} />{a.notify ? "Guardian notified" : "No notification"}</div>
            <div className="flex items-center gap-2">
              <Pill tone={a.status === "Confirmed" ? "green" : a.status === "Completed" ? "gray" : "teal"}>{a.status}</Pill>
              {a.status === "Scheduled" && <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => { setList((p) => p.map((x) => (x.id === a.id ? { ...x, status: "Confirmed" } : x))); toast("Appointment confirmed"); log("Confirmed appointment", `${a.resident} · ${a.type}`); }}>Confirm</button>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={add} onClose={() => setAdd(false)} title="New appointment">
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          setList((p) => [...p, { id: "ap" + Date.now(), resident: f.resident, type: f.type, day: f.day, time: f.time, place: f.place || "TBC", provider: "TBC", staff: "Unassigned", transport: f.transport, notify: f.notify, status: "Scheduled" }]);
          setAdd(false); toast(f.notify ? "Appointment added · guardian notified" : "Appointment added"); log("Created appointment", `${f.resident} · ${f.type}`);
        }}>
          <Field label="Resident"><select className="input" value={f.resident} onChange={(e) => setF({ ...f, resident: e.target.value })}>{residents.map((r) => <option key={r.id}>{r.name}</option>)}</select></Field>
          <Field label="Type"><select className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Day"><select className="input" value={f.day} onChange={(e) => setF({ ...f, day: +e.target.value })}>{Array.from({ length: 7 }, (_, d) => <option key={d} value={d}>{label(d).dow} {label(d).date}</option>)}</select></Field>
            <Field label="Time"><input type="time" className="input" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></Field>
          </div>
          <Field label="Location"><input className="input" value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} /></Field>
          <Field label="Transport"><select className="input" value={f.transport} onChange={(e) => setF({ ...f, transport: e.target.value })}>{["None", "Facility car", "Private chauffeur", "Ambulance"].map((t) => <option key={t}>{t}</option>)}</select></Field>
          <label className="flex items-center gap-2 text-sm font-semibold text-forest"><input type="checkbox" checked={f.notify} onChange={(e) => setF({ ...f, notify: e.target.checked })} /> Notify guardian</label>
          <button className="btn btn-primary w-full">Save</button>
        </form>
      </Modal>
    </div>
  );
}
