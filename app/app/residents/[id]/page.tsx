"use client";
import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Droplets, FileText, HeartPulse, Phone, Printer, Thermometer, Upload, Weight, Wind } from "lucide-react";
import { Pill, Tabs } from "@/components/kit";
import { Avatar, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS, SERVICES, fmt } from "@/lib/data";

type Tab = "overview" | "plan" | "docs" | "services";

export default function Passport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { residents, user, toast, log } = useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const [docs, setDocs] = useState([
    { n: "NIC copy", d: "Verified", t: "Identity" },
    { n: "Admission agreement (signed)", d: "Verified", t: "Legal" },
    { n: "Discharge summary — Lanka Hospitals", d: "Uploaded", t: "Medical" },
    { n: "Power of attorney (health)", d: "Pending verification", t: "Legal" },
  ]);
  const [svc, setSvc] = useState<string[]>(["ac", "laundry"]);
  const r = residents.find((x) => x.id === id);
  if (!r) return <div className="card p-10 text-center">Resident not found</div>;
  const room = ROOMS.find((x) => x.id === r.room);
  const canClinical = user?.role !== "caregiver" || true;
  const vit = [
    { i: HeartPulse, v: r.vitals.bp, l: "BP" },
    { i: Droplets, v: r.vitals.pulse || "—", l: "Pulse" },
    { i: Thermometer, v: r.vitals.temp ? r.vitals.temp + "°" : "—", l: "Temp" },
    { i: Wind, v: r.vitals.spo2 ? r.vitals.spo2 + "%" : "—", l: "SpO₂" },
    { i: Weight, v: r.vitals.weight ? r.vitals.weight + "kg" : "—", l: "Weight" },
  ];
  const mobIcon = { Independent: "Footprints", "Cane / frame": "Accessibility", Wheelchair: "Armchair", Hoist: "ArrowUpFromLine" }[r.mobility];

  return (
    <div className="space-y-6">
      <Link href="/app/residents" className="inline-flex items-center gap-2 text-sm font-semibold text-mute"><ArrowLeft size={16} /> Residents</Link>

      <div className="card relative overflow-hidden p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${room?.soft ?? "#fff"}, #fff 70%)` }}>
        <div className="absolute -right-6 -top-6 opacity-30">{room && <Gem color={room.color} size={200} />}</div>
        <div className="relative flex flex-wrap items-center gap-6">
          <Avatar name={r.name} hue={r.hue} size={88} />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-widest text-gold">Personal Care Passport</div>
            <h1 className="text-3xl font-semibold tracking-tight text-forest">{r.preferred}</h1>
            <div className="mt-1 text-sm font-semibold text-mute">{r.name} · {r.age} · {room?.name} · since {r.since}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone="teal"><Icon name={MOODS[r.mood].icon} size={13} /> {MOODS[r.mood].label}</Pill>
              {r.alerts.map((a) => <Pill key={a} tone="red">{a}</Pill>)}
            </div>
          </div>
          <button onClick={() => { window.print(); log("Printed care passport", r.name); }} className="btn btn-ghost"><Printer size={16} /> Print passport</button>
        </div>
      </div>

      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "overview", label: "Overview", icon: "UserRound" },
        { id: "plan", label: "Care plan", icon: "ClipboardList" },
        { id: "docs", label: "Documents", icon: "FolderOpen", badge: docs.filter((d) => d.d.startsWith("Pending")).length },
        { id: "services", label: "Services & billing", icon: "Receipt" },
      ]} />

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {vit.map(({ i: I, v, l }) => (
              <div key={l} className="card p-4 text-center">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-sage text-forest2"><I size={18} /></span>
                <div className="mt-2 text-xl font-semibold text-forest">{v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mute">{l}</div>
              </div>
            ))}
          </div>
          {canClinical && (
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="card p-6">
                <div className="mb-4 font-semibold text-forest">Support</div>
                <div className="space-y-3">
                  {[[mobIcon!, r.mobility], ["Utensils", r.diet], ["ShieldAlert", r.allergies.length ? r.allergies.join(", ") : "No known allergies"], ["Stethoscope", r.conditions.join(" · ")]].map(([ic, t]) => (
                    <div key={t} className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-forest2 text-white"><Icon name={ic} size={18} /></span>
                      <span className="text-sm font-semibold text-forest">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <div className="mb-4 font-semibold text-forest">Medication</div>
                <div className="space-y-2">
                  {r.meds.length === 0 && <div className="text-sm text-mute">None recorded</div>}
                  {r.meds.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-cream p-3">
                      <span className="grid h-9 w-14 place-items-center rounded-md bg-white text-xs font-bold text-forest">{m.time}</span>
                      <div className="min-w-0 flex-1 text-sm font-semibold text-forest">{m.name}<div className="text-xs font-medium text-mute">{m.dose}</div></div>
                      <Pill tone={{ given: "green", due: "amber", refused: "red", missed: "red" }[m.status] as "green"}>{m.status}</Pill>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <div className="mb-3 font-semibold text-forest">Preferences</div>
                <div className="flex flex-wrap gap-2">{r.likes.map((l) => <span key={l} className="rounded-md bg-sand px-2.5 py-1 text-xs font-semibold text-forest2">{l}</span>)}</div>
                <div className="mb-3 mt-6 font-semibold text-forest">Guardian</div>
                <div className="flex items-center gap-3 rounded-lg bg-sage p-3">
                  <Avatar name={r.guardian.name} hue="#046A4E" size={40} />
                  <div className="flex-1 text-sm font-semibold text-forest">{r.guardian.name}<div className="text-xs font-medium text-mute">{r.guardian.relation} · {r.guardian.phone}</div></div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-white"><Phone size={15} /></span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "plan" && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between"><span className="font-semibold text-forest">Individual care plan</span><Pill tone="green">Version 3 · current</Pill></div>
            <div className="space-y-3">
              {[
                ["Target", "Personal goals", `Stay active and keep ${r.preferred.split(" ")[0]}'s daily routine.`],
                ["HandHelping", "Assistance", r.care >= 3 ? "Two carers for transfers; supervised bathing." : "Prompting and supervision as needed."],
                ["Accessibility", "Mobility", r.mobility],
                ["Utensils", "Nutrition", r.diet],
                ["Pill", "Medication support", r.meds.length ? "Staff-administered, recorded in MAR." : "None required."],
                ["Moon", "Night-time", "Hourly checks; call pendant within reach."],
                ["ShieldAlert", "Risks", r.alerts.join(", ") || "No high risks identified."],
              ].map(([ic, t, d]) => (
                <div key={t} className="flex items-start gap-3 rounded-lg bg-cream p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-forest2"><Icon name={ic} size={17} /></span>
                  <div><div className="text-xs font-bold uppercase tracking-wider text-mute">{t}</div><div className="text-sm font-semibold text-forest">{d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <div className="mb-3 font-semibold text-forest">Review</div>
              <div className="text-sm text-mute">Next review</div>
              <div className="text-xl font-semibold text-forest">in 12 days</div>
              <button className="btn btn-primary mt-4 w-full" onClick={() => { toast("Care plan review scheduled"); log("Scheduled care plan review", r.name); }}>Start review</button>
            </div>
            <div className="card p-6">
              <div className="mb-3 font-semibold text-forest">Version history</div>
              {[["v3", "Falls prevention added", "28 Oct"], ["v2", "Diet updated", "02 Sep"], ["v1", "Admission plan", r.since]].map(([v, t, d]) => (
                <div key={v} className="flex items-center gap-3 border-t border-line py-2.5 first:border-0"><Pill tone="gray">{v}</Pill><span className="flex-1 text-sm font-semibold text-forest">{t}</span><span className="text-xs text-mute">{d}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "docs" && (
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold text-forest">Supporting documents</span>
            <button className="btn btn-primary" onClick={() => { setDocs((p) => [{ n: "Laboratory report", d: "Uploaded", t: "Medical" }, ...p]); toast("Document uploaded"); log("Uploaded document", r.name); }}><Upload size={16} /> Upload</button>
          </div>
          <div className="divide-y divide-line">
            {docs.map((d, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-sage text-forest2"><FileText size={18} /></span>
                <div className="flex-1 text-sm font-semibold text-forest">{d.n}<div className="text-xs font-medium text-mute">{d.t}</div></div>
                <Pill tone={d.d === "Verified" ? "green" : d.d === "Uploaded" ? "blue" : "amber"}>{d.d}</Pill>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "services" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6">
            <div className="mb-4 font-semibold text-forest">Add-ons attached to this resident</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SERVICES.map((s) => {
                const on = svc.includes(s.id);
                return (
                  <button key={s.id} onClick={() => { setSvc(on ? svc.filter((x) => x !== s.id) : [...svc, s.id]); log(on ? "Removed add-on" : "Added add-on (pending guardian agreement)", `${r.name} · ${s.name}`); toast(on ? "Add-on removed" : "Add-on added · agreement pending"); }} className="flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center" style={{ borderColor: on ? "var(--forest-2)" : "var(--line)", background: on ? "var(--sage)" : "#fff" }}>
                    <Icon name={s.icon} size={22} className="text-forest" />
                    <span className="text-[11px] font-semibold leading-tight text-forest">{s.name}</span>
                    <span className="text-[10px] font-semibold text-mute">{s.price / 1000}k</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <div className="mb-3 font-semibold text-forest">Monthly summary</div>
            <div className="space-y-2 text-sm font-semibold text-forest">
              <div className="flex justify-between"><span>Room ({room?.name})</span><span>{fmt(room?.price ?? 0)}</span></div>
              {svc.map((id) => { const s = SERVICES.find((x) => x.id === id)!; return <div key={id} className="flex justify-between text-mute"><span>{s.name}</span><span>{fmt(s.price)}</span></div>; })}
              <div className="flex justify-between border-t border-line pt-3 text-base"><span>Total</span><span>{fmt((room?.price ?? 0) + svc.reduce((t, id) => t + (SERVICES.find((x) => x.id === id)?.price ?? 0), 0))}</span></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2"><Pill tone="amber">Guardian agreement pending</Pill><Pill tone="gray">Manager approval</Pill></div>
            <button className="btn btn-ghost mt-4 w-full" onClick={() => toast("Revised quotation generated")}>Generate revised quotation</button>
          </div>
        </div>
      )}
    </div>
  );
}
