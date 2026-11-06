"use client";
import { useState } from "react";
import { Cat, KeyRound, MapPin, Wrench } from "lucide-react";
import { PageHead, Pill } from "@/components/kit";
import { Avatar, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { HOMECARE } from "@/lib/mock";

export default function HomeCare() {
  const { toast, log } = useApp();
  const [sel, setSel] = useState(HOMECARE[0].id);
  const [state, setState] = useState<Record<string, string>>({});
  const c = HOMECARE.find((x) => x.id === sel)!;

  return (
    <div>
      <PageHead title="Home care" sub="Clients receiving services outside the residences" />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {HOMECARE.map((h) => (
            <button key={h.id} onClick={() => setSel(h.id)} className="card flex w-full items-center gap-3 p-4 text-left" style={sel === h.id ? { borderColor: "var(--forest-2)", boxShadow: "0 0 0 2px var(--forest-2)" } : {}}>
              <Avatar name={h.name} hue="#6b7a99" size={44} />
              <div className="min-w-0 flex-1"><div className="font-semibold text-forest">{h.name}</div><div className="text-xs text-mute">{h.area} · {h.pkg}</div></div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={c.name} hue="#6b7a99" size={56} />
              <div className="flex-1"><div className="text-xl font-semibold text-forest">{c.name}</div><div className="flex items-center gap-1.5 text-sm text-mute"><MapPin size={14} />{c.area}</div></div>
              <Pill tone="teal">{c.pkg}</Pill>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[[KeyRound, "Access", c.access], [Cat, "Pets", c.pets], [Wrench, "Equipment", c.equip], [null, "Scheduled", `${c.days} · ${c.carer}`]].map(([I, l, v], i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-cream p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-forest2">{I ? (() => { const Ic = I as typeof KeyRound; return <Ic size={16} />; })() : <Icon name="CalendarDays" size={16} />}</span>
                  <div><div className="text-[11px] font-bold uppercase tracking-wider text-mute">{l as string}</div><div className="text-sm font-semibold text-forest">{v as string}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-4 font-semibold text-forest">Visits</div>
            <div className="space-y-3">
              {c.visits.map((v, i) => {
                const k = `${c.id}-${i}`;
                const st = state[k] ?? v.status;
                return (
                  <div key={i} className="flex flex-wrap items-center gap-4 rounded-xl border border-line p-4">
                    <div className="w-24 text-sm font-semibold text-forest">{v.d}<div className="text-xs font-medium text-mute">{v.t}</div></div>
                    <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-forest">{v.carer}</div><div className="mt-1 flex flex-wrap gap-1.5">{v.tasks.map((t) => <span key={t} className="rounded bg-sand px-2 py-0.5 text-[11px] font-semibold text-forest2">{t}</span>)}</div></div>
                    <Pill tone={st === "Completed" ? "green" : st === "In progress" ? "blue" : "gray"}>{st}</Pill>
                    {st === "Scheduled" && <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => { setState({ ...state, [k]: "In progress" }); toast("Arrival recorded"); log("Home-care check-in", c.name); }}>Check in</button>}
                    {st === "In progress" && <button className="btn btn-gold !px-4 !py-1.5 text-xs" onClick={() => { setState({ ...state, [k]: "Completed" }); toast("Visit completed · guardian update queued"); log("Home-care check-out", c.name); }}>Check out</button>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
