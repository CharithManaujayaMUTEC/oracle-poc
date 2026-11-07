"use client";
import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Bars, Donut, PageHead } from "@/components/kit";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { INCIDENTS, INVOICES, MONTHS, REVENUE } from "@/lib/mock";
import { ROOMS, fmt } from "@/lib/data";

const REPORTS = [
  { id: "occ", t: "Occupancy", i: "BedDouble" },
  { id: "rev", t: "Revenue", i: "TrendingUp" },
  { id: "out", t: "Outstanding invoices", i: "Hourglass" },
  { id: "inc", t: "Incidents", i: "Siren" },
  { id: "med", t: "Medication exceptions", i: "Pill" },
  { id: "add", t: "Add-on & subscriptions", i: "Repeat" },
];
const FAC = ["All", "House 1", "House 2"] as const;
const RANGE = ["7 days", "30 days", "6 months", "12 months"] as const;

export default function Reports() {
  const { toast, log } = useApp();
  const [rep, setRep] = useState("rev");
  const [fac, setFac] = useState<(typeof FAC)[number]>("All");
  const [range, setRange] = useState<(typeof RANGE)[number]>("6 months");
  const rev = fac === "All" ? REVENUE["House 1"].map((v, i) => v + REVENUE["House 2"][i]) : REVENUE[fac];
  const rooms = ROOMS.filter((r) => fac === "All" || `House ${r.house}` === fac);
  const inv = INVOICES.filter((i) => fac === "All" || i.facility === fac);
  const exp = (kind: string) => { toast(`${kind} export prepared`); log(`Exported report as ${kind}`, REPORTS.find((r) => r.id === rep)!.t); };

  return (
    <div>
      <PageHead title="Reports" sub="Filter, review and export" actions={<><button className="btn btn-ghost" onClick={() => exp("PDF")}><FileText size={16} /> PDF</button><button className="btn btn-primary" onClick={() => exp("Excel")}><FileSpreadsheet size={16} /> Excel</button></>} />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-5">
          <div className="card p-2">
            {REPORTS.map((r) => (
              <button key={r.id} onClick={() => setRep(r.id)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold" style={rep === r.id ? { background: "var(--forest)", color: "#fff" } : { color: "var(--forest)" }}><Icon name={r.i} size={17} />{r.t}</button>
            ))}
          </div>
          <div className="card space-y-4 p-4">
            <div><div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-mute">Facility</div><div className="flex flex-wrap gap-1.5">{FAC.map((f) => <button key={f} className="chip" data-on={fac === f} onClick={() => setFac(f)}>{f}</button>)}</div></div>
            <div><div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-mute">Date range</div><div className="flex flex-wrap gap-1.5">{RANGE.map((f) => <button key={f} className="chip" data-on={range === f} onClick={() => setRange(f)}>{f}</button>)}</div></div>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-1 flex items-center justify-between"><div className="text-lg font-semibold text-forest">{REPORTS.find((r) => r.id === rep)!.t}</div><span className="text-xs font-semibold text-mute">{fac} · {range}</span></div>
          <div className="mb-6 text-xs text-mute">Generated just now</div>

          {rep === "rev" && <><Bars values={rev} labels={MONTHS} height={200} /><div className="mt-6 text-sm font-semibold text-forest">Latest month: LKR {rev[rev.length - 1]}k</div></>}
          {rep === "occ" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Donut parts={["occupied", "vacant", "reserved", "maintenance"].map((s, i) => ({ v: rooms.filter((r) => r.status === s).length, c: ["#B08D57", "#BDBBAE", "#e0a02b", "#c2395a"][i], l: s }))} />
              <div className="space-y-2">{rooms.map((r) => <div key={r.id} className="flex justify-between border-b border-line py-1.5 text-sm font-semibold text-forest"><span>{r.name}</span><span className="capitalize text-mute">{r.status}</span></div>)}</div>
            </div>
          )}
          {rep === "out" && <div className="divide-y divide-line">{inv.filter((i) => i.status !== "Paid").map((i) => <div key={i.id} className="flex justify-between py-3 text-sm font-semibold text-forest"><span>{i.id} · {i.resident}</span><span>{fmt(i.total - i.paid)}</span></div>)}</div>}
          {rep === "inc" && <Donut parts={["Fall", "Medication", "Illness", "Behaviour", "Injury", "Other"].map((t, i) => ({ v: INCIDENTS.filter((x) => x.type === t).length, c: ["#b02a4a", "#e0a02b", "#B08D57", "#6b7a99", "#3f9a76", "#A5A396"][i], l: t }))} />}
          {rep === "med" && <div className="space-y-3 text-sm font-semibold text-forest">{[["Missed doses", 1], ["Refused doses", 0], ["Overdue (not recorded)", 3], ["PRN used", 2]].map(([l, v]) => <div key={l as string} className="flex justify-between border-b border-line pb-2"><span>{l}</span><span>{v}</span></div>)}</div>}
          {rep === "add" && <Bars values={[18, 21, 24, 23, 28, 31, 34]} labels={MONTHS} height={200} />}
          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold" onClick={() => exp("CSV")}><Download size={15} /> Download data</button>
        </div>
      </div>
    </div>
  );
}
