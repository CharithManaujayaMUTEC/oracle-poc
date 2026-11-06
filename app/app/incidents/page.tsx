"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Field, Modal, PageHead, Pill, Tone } from "@/components/kit";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { INCIDENTS, INCIDENT_FLOW, IncStatus, Incident } from "@/lib/mock";

const SEV: Record<string, Tone> = { High: "red", Medium: "amber", Low: "gray" };
const ICON: Record<string, string> = { Fall: "ArrowDownToLine", Injury: "Bandage", Illness: "Thermometer", Behaviour: "Brain", Medication: "Pill", Other: "CircleHelp" };

export default function Incidents() {
  const { residents, user, toast, log } = useApp();
  const [list, setList] = useState<Incident[]>(INCIDENTS);
  const [sel, setSel] = useState<Incident | null>(null);
  const [add, setAdd] = useState(false);
  const [filter, setFilter] = useState<"All" | IncStatus>("All");
  const [f, setF] = useState({ type: "Fall", resident: residents[0].name, location: "", desc: "", action: "" });
  const canReview = user?.role !== "caregiver";

  const advance = (i: Incident) => {
    const idx = INCIDENT_FLOW.indexOf(i.status);
    if (idx >= 3) return;
    const status = INCIDENT_FLOW[idx + 1];
    setList((p) => p.map((x) => (x.id === i.id ? { ...x, status } : x)));
    setSel({ ...i, status });
    log(`Incident → ${status}`, i.id);
    toast(`${i.id} → ${status}`);
  };

  const shown = list.filter((i) => filter === "All" || i.status === filter);

  return (
    <div>
      <PageHead title="Incidents" sub="Report, review and follow up" actions={<button className="btn btn-gold" onClick={() => setAdd(true)}><Plus size={16} /> Report incident</button>} />
      <div className="mb-5 flex flex-wrap gap-2">
        {(["All", ...INCIDENT_FLOW] as const).map((s) => <button key={s} onClick={() => setFilter(s)} className="chip" data-on={filter === s}>{s}</button>)}
      </div>
      <div className="card divide-y divide-line overflow-hidden">
        {shown.map((i) => (
          <button key={i.id} onClick={() => setSel(i)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-cream">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sage text-forest2"><Icon name={ICON[i.type] ?? "CircleHelp"} size={20} /></span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-forest">{i.id} · {i.type} · {i.resident}</div>
              <div className="truncate text-xs text-mute">{i.date} · {i.location}</div>
            </div>
            <Pill tone={SEV[i.severity]}>{i.severity}</Pill>
            <Pill tone={i.status === "Closed" ? "green" : i.status === "Reported" ? "red" : "amber"}>{i.status}</Pill>
          </button>
        ))}
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel ? `${sel.id} · ${sel.type}` : ""} wide>
        {sel && (
          <div className="space-y-5">
            <div className="flex items-center">
              {INCIDENT_FLOW.map((s, i) => (
                <div key={s} className="flex flex-1 items-center">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: i <= INCIDENT_FLOW.indexOf(sel.status) ? "var(--forest-2)" : "#e3ecef", color: i <= INCIDENT_FLOW.indexOf(sel.status) ? "#fff" : "var(--mute)" }}>{i + 1}</span>
                  <span className="mx-1.5 hidden text-[11px] font-semibold text-forest sm:inline">{s}</span>
                  {i < 3 && <span className="h-0.5 flex-1 bg-line" />}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[["Resident", sel.resident], ["When", sel.date], ["Location", sel.location], ["Reported by", sel.by]].map(([l, v]) => <div key={l}><div className="text-[11px] font-bold uppercase tracking-wider text-mute">{l}</div><div className="font-semibold text-forest">{v}</div></div>)}
            </div>
            <div><div className="text-[11px] font-bold uppercase tracking-wider text-mute">Description</div><p className="text-sm font-semibold text-forest">{sel.desc}</p></div>
            <div><div className="text-[11px] font-bold uppercase tracking-wider text-mute">Immediate action</div><p className="text-sm font-semibold text-forest">{sel.action}</p></div>
            <div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-wider text-mute">Notified</span>{sel.notified.length ? sel.notified.map((n) => <Pill key={n} tone="teal">{n}</Pill>) : <span className="text-sm text-mute">None</span>}</div>
            {sel.follow.length > 0 && <div><div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-mute">Follow-up actions</div>{sel.follow.map((x) => <div key={x} className="flex items-center gap-2 text-sm font-semibold text-forest"><Icon name="CircleDot" size={14} className="text-gold" />{x}</div>)}</div>}
            {canReview && sel.status !== "Closed" && <button className="btn btn-primary w-full" onClick={() => advance(sel)}>Move to “{INCIDENT_FLOW[INCIDENT_FLOW.indexOf(sel.status) + 1]}”</button>}
          </div>
        )}
      </Modal>

      <Modal open={add} onClose={() => setAdd(false)} title="Report incident">
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          const n: Incident = { id: `INC-0${42 + list.length - INCIDENTS.length}`, type: f.type, resident: f.resident, date: "Just now", location: f.location || "—", severity: f.type === "Fall" ? "High" : "Medium", status: "Reported", desc: f.desc, action: f.action, notified: ["Manager"], by: user?.name ?? "", follow: [] };
          setList((p) => [n, ...p]); setAdd(false); log("Reported incident", `${n.id} ${f.resident}`); toast("Incident reported · manager notified");
        }}>
          <Field label="Type"><select className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{Object.keys(ICON).map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Resident"><select className="input" value={f.resident} onChange={(e) => setF({ ...f, resident: e.target.value })}>{residents.map((r) => <option key={r.id}>{r.name}</option>)}</select></Field>
          <Field label="Location"><input className="input" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
          <Field label="What happened"><textarea required className="input" rows={3} value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} /></Field>
          <Field label="Immediate action"><textarea className="input" rows={2} value={f.action} onChange={(e) => setF({ ...f, action: e.target.value })} /></Field>
          <button className="btn btn-primary w-full">Submit report</button>
        </form>
      </Modal>
    </div>
  );
}
