"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { PageHead, Pill, Stat } from "@/components/kit";
import { Avatar } from "@/components/ui";
import { useApp } from "@/lib/store";
import { PHARMACY } from "@/lib/mock";

type St = "due" | "given" | "refused" | "missed";
const TONE = { given: "green", due: "amber", refused: "red", missed: "red" } as const;

export default function Medication() {
  const { residents, user, toast, log } = useApp();
  const [over, setOver] = useState<Record<string, St>>({});
  const rows = residents.flatMap((r) => r.meds.map((m, i) => ({ r, m, key: `${r.id}-${i}` })));
  const st = (k: string, d: St) => over[k] ?? d;
  const count = (s: St) => rows.filter((x) => st(x.key, x.m.status) === s).length;

  const act = (x: (typeof rows)[number], s: St) => {
    setOver({ ...over, [x.key]: s });
    log(`MAR: ${s}`, `${x.r.name} · ${x.m.name} ${x.m.time}`);
    toast(`${x.m.name} marked ${s}`);
  };

  return (
    <div>
      <PageHead title="Medication" sub="Medication administration record (MAR) across residents" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="CheckCheck" label="Given" value={count("given")} tone="green" />
        <Stat icon="Clock" label="Due" value={count("due")} tone="amber" />
        <Stat icon="Ban" label="Refused" value={count("refused")} tone="red" />
        <Stat icon="AlertTriangle" label="Missed" value={count("missed")} tone="red" />
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1.4fr_80px_90px_130px] border-b border-line bg-cream px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-mute max-md:hidden">
          <span>Resident</span><span>Medication</span><span>Time</span><span>Status</span><span className="text-right">Action</span>
        </div>
        {rows.map((x) => {
          const s = st(x.key, x.m.status);
          return (
            <div key={x.key} className="grid items-center gap-2 border-b border-line px-5 py-3 last:border-0 md:grid-cols-[1.4fr_1.4fr_80px_90px_130px]">
              <div className="flex items-center gap-3"><Avatar name={x.r.name} hue={x.r.hue} size={34} /><span className="text-sm font-semibold text-forest">{x.r.preferred}</span></div>
              <div className="text-sm font-semibold text-forest">{x.m.name}<div className="text-xs font-medium text-mute">{x.m.dose}</div></div>
              <div className="text-sm font-semibold text-forest">{x.m.time}</div>
              <div><Pill tone={TONE[s]}>{s}</Pill></div>
              <div className="flex justify-end gap-2">
                {(s === "due" || s === "missed") && user?.role !== "manager" ? (
                  <>
                    <button onClick={() => act(x, "given")} className="grid h-9 w-9 place-items-center rounded-lg bg-[#2f7d5c] text-white" title="Give"><Check size={16} /></button>
                    <button onClick={() => act(x, "refused")} className="grid h-9 w-9 place-items-center rounded-lg bg-[#b02a4a] text-white" title="Refused"><X size={16} /></button>
                  </>
                ) : <span className="text-xs font-semibold text-mute">{s === "due" ? "Nurse only" : "Recorded"}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 card p-6">
        <div className="mb-4 flex items-center justify-between"><span className="font-semibold text-forest">Pharmacy orders · Flash Health</span><Pill tone="teal">Integration</Pill></div>
        <div className="grid gap-4 md:grid-cols-3">
          {PHARMACY.map((p) => (
            <div key={p.id} className="rounded-xl border border-line p-4">
              <div className="text-sm font-semibold text-forest">{p.resident}</div>
              <div className="text-xs text-mute">{p.items}</div>
              <div className="mt-4 flex items-center">
                {["Placed", "Dispatched", "Delivered"].map((l, i) => (
                  <div key={l} className="flex flex-1 items-center">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold" style={{ background: i <= p.status ? "var(--forest-2)" : "var(--track)", color: i <= p.status ? "#fff" : "var(--mute)" }}>{i + 1}</span>
                    {i < 2 && <span className="h-0.5 flex-1" style={{ background: i < p.status ? "var(--forest-2)" : "var(--track)" }} />}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs font-semibold text-mute">{p.eta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
