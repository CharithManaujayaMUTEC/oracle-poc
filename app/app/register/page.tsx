"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Avatar, BodyMap, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { ROOMS, SERVICES, Resident, fmt } from "@/lib/data";

const STEPS = [
  { t: "Who", i: "UserRound" },
  { t: "Family", i: "Users" },
  { t: "Room", i: "BedDouble" },
  { t: "Extras", i: "Sparkles" },
  { t: "Health", i: "HeartPulse" },
  { t: "Me", i: "Smile" },
  { t: "Consent", i: "FileSignature" },
];

const CONDITIONS = ["Diabetes", "Hypertension", "Dementia", "Arthritis", "Stroke", "Parkinson's", "Asthma", "Heart", "Dysphagia"];
const MOB = [
  { v: "Independent", i: "Footprints" },
  { v: "Cane / frame", i: "Accessibility" },
  { v: "Wheelchair", i: "Armchair" },
  { v: "Hoist", i: "ArrowUpFromLine" },
] as const;
const DIETS = ["Regular", "Diabetic", "Vegetarian", "Halal", "Soft", "Low-sodium"];
const LIKES = ["Gardening", "Music", "Cricket", "Reading", "Chess", "Films", "Prayer", "Walks", "Cards", "Radio", "Tea", "Family calls"];
const RELS = ["Son", "Daughter", "Spouse", "Sibling", "Other"];
const AUTH = ["None", "Financial POA", "Health POA", "Court guardian"];
const FAITH = ["Buddhist", "Hindu", "Christian", "Islam", "Private"];

type Pin = { x: number; y: number; side: "front" | "back" };

const Label = ({ children }: { children: React.ReactNode }) => <div className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-mute">{children}</div>;

function Chips({ options, value, onChange, multi }: { options: readonly string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o} className="chip" data-on={multi ? (value as string[]).includes(o) : value === o} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

export default function Register() {
  const { addResident, log } = useApp();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Resident | null>(null);
  const [f, setF] = useState({
    name: "", preferred: "", age: "", nic: "", lang: "English", marital: "Married",
    gName: "", gRel: "Son", gPhone: "", gAuth: "None", gVerified: false,
    house: 1 as 1 | 2, room: "", occupancy: "Single", stay: "Long-term",
    services: [] as string[],
    conditions: [] as string[], allergies: "", mobility: "Independent" as (typeof MOB)[number]["v"], diet: "Regular",
    pins: [] as Pin[],
    likes: [] as string[], wake: "06:30", faith: "Private",
    c1: true, c2: true, c3: false, c4: true, sign: "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (k: "services" | "conditions" | "likes", v: string) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);

  const room = ROOMS.find((r) => r.id === f.room);
  const total = (room?.price ?? 0) + f.services.reduce((s, id) => s + (SERVICES.find((x) => x.id === id)?.price ?? 0), 0);

  const ok = useMemo(() => {
    if (step === 0) return f.name.trim().length > 2;
    if (step === 1) return f.gName.trim().length > 1;
    if (step === 2) return !!f.room;
    if (step === 6) return f.sign.trim().length > 2;
    return true;
  }, [step, f]);

  const submit = () => {
    const r: Resident = {
      id: "n" + Date.now(),
      name: f.name,
      preferred: f.preferred || f.name.split(" ")[0],
      age: Number(f.age) || 75,
      room: f.room,
      hue: room?.color ?? "#B08D57",
      mood: "calm",
      alerts: [...(f.mobility === "Hoist" ? ["Hoist"] : []), ...f.pins.slice(0, 1).map(() => "Skin check")],
      mobility: f.mobility,
      diet: f.diet,
      allergies: f.allergies ? f.allergies.split(",").map((s) => s.trim()) : [],
      conditions: f.conditions.length ? f.conditions : ["Not recorded"],
      guardian: { name: f.gName, relation: f.gRel, phone: f.gPhone || "—" },
      meds: [],
      vitals: { bp: "—", pulse: 0, temp: 0, spo2: 0, weight: 0 },
      likes: f.likes,
      since: "Nov 2026",
      care: f.mobility === "Hoist" ? 4 : f.mobility === "Wheelchair" ? 3 : f.mobility === "Cane / frame" ? 2 : 1,
    };
    addResident(r);
    log("Registered new client", r.name);
    setDone(r);
  };

  if (done) {
    const rm = ROOMS.find((x) => x.id === done.room);
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <div className="pop mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#3f9a76] text-white shadow-xl"><Check size={48} strokeWidth={3} /></div>
        <h1 className="mt-6 text-4xl font-semibold text-forest">Welcome, {done.preferred}</h1>
        <div className="card relative mt-8 overflow-hidden p-6 text-left" style={{ background: `linear-gradient(135deg, ${rm?.color ?? "#B08D57"}33, var(--paper) 70%)` }}>
          <div className="absolute -right-4 -top-4 opacity-30">{rm && <Gem color={rm.color} size={130} />}</div>
          <div className="relative flex items-center gap-4">
            <Avatar name={done.name} hue={done.hue} size={64} />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold">Care Passport</div>
              <div className="text-2xl font-semibold text-forest">{done.preferred}</div>
              <div className="text-xs font-semibold text-mute">{rm?.name} · {done.mobility} · {done.diet}</div>
            </div>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-2">
            {done.conditions.map((c) => <span key={c} className="chip" data-on="false">{c}</span>)}
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/app/residents/${done.id}`} className="btn btn-primary">Open profile</Link>
          <Link href="/app/admissions" className="btn btn-ghost">Admission workflow</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold tracking-tight text-forest">Register client</h1>

      {/* stepper */}
      <div className="mt-6 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.t} className="flex flex-1 items-center last:flex-none">
            <button onClick={() => i < step && setStep(i)} className="flex flex-col items-center gap-1">
              <span className="grid h-11 w-11 place-items-center rounded-full transition-all" style={i <= step ? { background: "var(--active)", color: "#fff", transform: i === step ? "scale(1.15)" : "none", boxShadow: i === step ? "0 0 0 5px rgba(176,141,74,.25)" : "none" } : { background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--mute)" }}>
                {i < step ? <Check size={18} /> : <Icon name={s.i} size={18} />}
              </span>
              <span className="hidden text-[10px] font-bold text-mute sm:block">{s.t}</span>
            </button>
            {i < STEPS.length - 1 && <span className="mx-1 h-0.5 flex-1 rounded-full" style={{ background: i < step ? "var(--gold)" : "var(--line)" }} />}
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6 md:p-8" key={step}>
        <div className="fadeup">
          {step === 0 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="input" placeholder="Full legal name" value={f.name} onChange={(e) => set("name", e.target.value)} />
                <input className="input" placeholder="Preferred name" value={f.preferred} onChange={(e) => set("preferred", e.target.value)} />
                <input className="input" placeholder="Age" type="number" value={f.age} onChange={(e) => set("age", e.target.value)} />
                <input className="input" placeholder="NIC / passport" value={f.nic} onChange={(e) => set("nic", e.target.value)} />
              </div>
              <Label>Language</Label>
              <Chips options={["Sinhala", "Tamil", "English"]} value={f.lang} onChange={(v) => set("lang", v)} />
              <Label>Status</Label>
              <Chips options={["Single", "Married", "Widowed", "Divorced"]} value={f.marital} onChange={(v) => set("marital", v)} />
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="input" placeholder="Guardian name" value={f.gName} onChange={(e) => set("gName", e.target.value)} />
                <input className="input" placeholder="WhatsApp / phone" value={f.gPhone} onChange={(e) => set("gPhone", e.target.value)} />
              </div>
              <Label>Relationship</Label>
              <Chips options={RELS} value={f.gRel} onChange={(v) => set("gRel", v)} />
              <Label>Legal authority</Label>
              <Chips options={AUTH} value={f.gAuth} onChange={(v) => set("gAuth", v)} />
              {f.gAuth !== "None" && (
                <button type="button" onClick={() => set("gVerified", !f.gVerified)} className="mt-4 flex items-center gap-3 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">
                  <span className="grid h-6 w-6 place-items-center rounded-md border-2" style={{ background: f.gVerified ? "#3f9a76" : "var(--paper)", borderColor: f.gVerified ? "#3f9a76" : "var(--line)", color: "#fff" }}>{f.gVerified && <Check size={14} />}</span>
                  Documents verified
                </button>
              )}
              <div className="mt-5 flex items-start gap-3 rounded-2xl tone-amber tint p-3 text-xs font-semibold">
                <Icon name="Info" size={16} className="mt-0.5 shrink-0" /> Family ≠ legal authority
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4 flex gap-2">
                {[1, 2].map((h) => (
                  <button key={h} className="chip" data-on={f.house === h} onClick={() => set("house", h as 1 | 2)}>House {h}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {ROOMS.filter((r) => r.house === f.house).map((r) => {
                  const free = r.status === "vacant" || r.status === "reserved";
                  const sel = f.room === r.id;
                  return (
                    <button key={r.id} disabled={!free} onClick={() => set("room", r.id)} className="relative rounded-3xl p-3 text-center transition-all" style={{ background: r.soft, opacity: free ? 1 : 0.35, outline: sel ? `3px solid ${r.color}` : "none", outlineOffset: 2 }}>
                      <div className="mx-auto w-fit"><Gem color={r.color} size={64} /></div>
                      <div className="mt-1 text-lg font-semibold" style={{ color: r.color }}>{r.name}</div>
                      <div className="text-[10px] font-bold text-mute">{free ? fmt(r.price).replace("LKR ", "") : "taken"}</div>
                      {sel && <span className="pop absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: r.color }}><Check size={14} /></span>}
                    </button>
                  );
                })}
              </div>
              <Label>Occupancy</Label>
              <Chips options={["Single", "Couple", "Shared"]} value={f.occupancy} onChange={(v) => set("occupancy", v)} />
              <Label>Stay</Label>
              <Chips options={["Long-term", "Short stay"]} value={f.stay} onChange={(v) => set("stay", v)} />
            </>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SERVICES.map((s) => {
                const on = f.services.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggle("services", s.id)} className="relative flex flex-col items-center gap-2 rounded-3xl border-2 p-4 text-center transition-all" style={{ borderColor: on ? s.tone : "var(--line)", background: on ? s.tone + "14" : "var(--paper)" }}>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: s.tone }}><Icon name={s.icon} size={22} /></span>
                    <span className="text-[11px] font-bold leading-tight text-forest">{s.name}</span>
                    <span className="text-[10px] font-semibold text-mute">{(s.price / 1000).toFixed(0)}k</span>
                    {on && <span className="pop absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-white" style={{ background: s.tone }}><Check size={12} /></span>}
                  </button>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <>
              <Label>Conditions</Label>
              <Chips options={CONDITIONS} multi value={f.conditions} onChange={(v) => toggle("conditions", v)} />
              <Label>Mobility</Label>
              <div className="grid grid-cols-4 gap-3">
                {MOB.map((m) => (
                  <button key={m.v} onClick={() => set("mobility", m.v)} className="flex flex-col items-center gap-2 rounded-3xl border-2 p-4 text-[11px] font-bold transition-all" style={{ borderColor: f.mobility === m.v ? "var(--active)" : "var(--line)", background: f.mobility === m.v ? "var(--sage)" : "var(--paper)" }}>
                    <Icon name={m.i} size={26} className="text-forest" />{m.v}
                  </button>
                ))}
              </div>
              <Label>Diet</Label>
              <Chips options={DIETS} value={f.diet} onChange={(v) => set("diet", v)} />
              <Label>Allergies</Label>
              <input className="input" placeholder="e.g. Penicillin, Latex" value={f.allergies} onChange={(e) => set("allergies", e.target.value)} />
              <Label>Body map · tap to mark</Label>
              <BodyMap pins={f.pins} onAdd={(p) => set("pins", [...f.pins, p])} />
              {f.pins.length > 0 && <button onClick={() => set("pins", [])} className="mx-auto mt-2 flex items-center gap-1 text-xs font-bold text-mute"><X size={14} /> clear {f.pins.length}</button>}
            </>
          )}

          {step === 5 && (
            <>
              <Label>Loves</Label>
              <Chips options={LIKES} multi value={f.likes} onChange={(v) => toggle("likes", v)} />
              <Label>Wake-up · {f.wake}</Label>
              <input type="time" className="input !w-40" value={f.wake} onChange={(e) => set("wake", e.target.value)} />
              <Label>Faith (optional)</Label>
              <Chips options={FAITH} value={f.faith} onChange={(v) => set("faith", v)} />
            </>
          )}

          {step === 6 && (
            <>
              <div className="space-y-3">
                {([
                  ["c1", "Privacy notice", "ShieldCheck"],
                  ["c2", "Updates to family", "BellRing"],
                  ["c3", "Photos & marketing", "Camera"],
                  ["c4", "Transport coordination", "Car"],
                ] as const).map(([k, l, ic]) => (
                  <button key={k} onClick={() => set(k, !f[k])} className="flex w-full items-center gap-4 rounded-2xl bg-cream p-4 text-left">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-paper text-forest"><Icon name={ic} size={20} /></span>
                    <span className="flex-1 text-sm font-bold text-forest">{l}</span>
                    <span className="relative h-7 w-12 rounded-full transition-colors" style={{ background: f[k] ? "#3f9a76" : "#d9d2c0" }}>
                      <span className="absolute top-1 h-5 w-5 rounded-full bg-paper shadow transition-all" style={{ left: f[k] ? 24 : 4 }} />
                    </span>
                  </button>
                ))}
              </div>
              <Label>Sign</Label>
              <input className="input !text-2xl italic" placeholder="Type name to sign" value={f.sign} onChange={(e) => set("sign", e.target.value)} />
            </>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="sticky bottom-20 z-10 mt-6 flex items-center justify-between gap-3 rounded-full border border-line bg-white/95 p-2 pl-6 shadow-xl backdrop-blur md:bottom-4">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-mute">Monthly</div>
          <div className="truncate text-xl font-semibold text-forest">{total ? fmt(total) : "—"}</div>
        </div>
        <div className="flex gap-2">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="btn btn-ghost !px-4"><ArrowLeft size={16} /></button>}
          {step < STEPS.length - 1 ? (
            <button disabled={!ok} onClick={() => setStep(step + 1)} className="btn btn-primary disabled:opacity-40">Next <ArrowRight size={16} /></button>
          ) : (
            <button disabled={!ok} onClick={submit} className="btn btn-gold disabled:opacity-40">Admit <Check size={16} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
