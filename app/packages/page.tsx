"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Footer, Nav } from "@/components/site";
import { Gem, Icon, Reveal } from "@/components/ui";
import { ROOMS, SERVICES, fmt } from "@/lib/data";

const TIERS = [
  { id: "essential", name: "Essential 60", icon: "House", base: 175000, rooms: ["ivory", "jade", "coral"], tag: "Everyday comfort", feat: false },
  { id: "comfort", name: "Comfort 60", icon: "HeartHandshake", base: 235000, rooms: ["pearl", "amber", "onyx"], tag: "Most chosen", feat: true },
  { id: "platinum", name: "Platinum 60", icon: "Crown", base: 345000, rooms: ["emerald", "sapphire", "ruby"], tag: "Full concierge", feat: false },
];

// [essential, comfort, platinum]
const FEATURES: { label: string; on: [boolean, boolean, boolean] }[] = [
  { label: "Private residence", on: [true, true, true] },
  { label: "Daily meals", on: [true, true, true] },
  { label: "24/7 care team", on: [true, true, true] },
  { label: "Housekeeping", on: [true, true, true] },
  { label: "Air conditioning", on: [false, true, true] },
  { label: "Laundry service", on: [false, true, true] },
  { label: "Physiotherapy", on: [false, true, true] },
  { label: "Monthly assessor review", on: [false, true, true] },
  { label: "Private concierge", on: [false, false, true] },
  { label: "Chauffeur & escort", on: [false, false, true] },
  { label: "Salon & podiatry", on: [false, false, true] },
  { label: "Tailored meal plan", on: [false, false, true] },
];

const TERMS = [
  { id: "m", label: "Monthly", off: 0 },
  { id: "h", label: "6 months", off: 0.05 },
  { id: "y", label: "12 months", off: 0.1 },
] as const;

const OFFERS = [
  { icon: "CalendarCheck", big: "10%", t: "12-month stay", d: "Off the monthly fee", c: "#0e8a9a" },
  { icon: "Users", big: "1.7×", t: "Couple occupancy", d: "Instead of paying double", c: "#176a7c" },
  { icon: "Gift", big: "Free", t: "Registration fee", d: "For founding residents", c: "#0b4254" },
  { icon: "UserPlus", big: "1 mo", t: "Spa add-on", d: "When you refer a family", c: "#3f9a76" },
];

export default function Packages() {
  const [couple, setCouple] = useState(false);
  const [term, setTerm] = useState<(typeof TERMS)[number]["id"]>("m");
  const off = TERMS.find((t) => t.id === term)!.off;
  const price = (b: number) => Math.round((b * (couple ? 1.7 : 1) * (1 - off)) / 1000) * 1000;

  return (
    <>
      <Nav />
      <section className="bg-forest pb-24 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-gold2"><span className="h-px w-10 bg-gold2" />Packages</div>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">Choose the level of care that fits.</h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-lg bg-white/10 p-1">
              {[false, true].map((c) => (
                <button key={String(c)} onClick={() => setCouple(c)} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors" style={couple === c ? { background: "#fff", color: "var(--forest)" } : { color: "#fff" }}>
                  <Icon name={c ? "Users" : "User"} size={16} />{c ? "Couple" : "Single"}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg bg-white/10 p-1">
              {TERMS.map((t) => (
                <button key={t.id} onClick={() => setTerm(t.id)} className="rounded-md px-4 py-2 text-sm font-semibold transition-colors" style={term === t.id ? { background: "#fff", color: "var(--forest)" } : { color: "#fff" }}>
                  {t.label}{t.off > 0 && <span className="ml-1.5 text-xs" style={{ color: term === t.id ? "var(--gold)" : "var(--gold-2)" }}>−{Math.round(t.off * 100)}%</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-14 max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((t, n) => (
            <Reveal key={t.id} delay={n * 100}>
              <div className="card relative flex h-full flex-col p-6" style={t.feat ? { borderColor: "var(--gold)", boxShadow: "0 0 0 2px var(--gold), 0 20px 40px -24px rgba(11,66,84,.4)" } : {}}>
                {t.feat && <span className="absolute -top-3 left-6 rounded-md bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{t.tag}</span>}
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-sage text-forest2"><Icon name={t.icon} size={24} /></span>
                  <div>
                    <div className="text-lg font-semibold text-forest">{t.name}</div>
                    {!t.feat && <div className="text-xs font-semibold text-mute">{t.tag}</div>}
                  </div>
                </div>
                <div className="mt-6">
                  <span className="text-4xl font-semibold tracking-tight text-forest">{fmt(price(t.base)).replace("LKR ", "")}</span>
                  <span className="ml-2 text-sm font-semibold text-mute">LKR / month</span>
                </div>
                <div className="mt-5 flex gap-2">
                  {t.rooms.map((r) => {
                    const room = ROOMS.find((x) => x.id === r)!;
                    return <span key={r} title={room.name} className="rounded-lg p-1.5" style={{ background: room.soft }}><Gem color={room.color} size={30} /></span>;
                  })}
                </div>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-5">
                  {FEATURES.map((f) => {
                    const on = f.on[n];
                    return (
                      <li key={f.label} className="flex items-center gap-3 text-sm font-semibold" style={{ color: on ? "var(--forest)" : "#a9b8bf" }}>
                        {on ? <Check size={16} className="text-gold" /> : <Minus size={16} />}{f.label}
                      </li>
                    );
                  })}
                </ul>
                <Link href="/signup" className={`btn mt-6 w-full ${t.feat ? "btn-gold" : "btn-primary"}`}>Choose {t.name.split(" ")[0]} <ArrowRight size={16} /></Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs font-semibold text-mute">Indicative prices (LKR) for demonstration. Final fees are set in the signed admission agreement.</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Offers</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">Current offers</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {OFFERS.map((o, i) => (
            <Reveal key={o.t} delay={i * 80}>
              <div className="card h-full overflow-hidden">
                <div className="flex items-center justify-between p-5 text-white" style={{ background: o.c }}>
                  <span className="text-3xl font-semibold tracking-tight">{o.big}</span>
                  <Icon name={o.icon} size={26} className="opacity-80" />
                </div>
                <div className="p-5">
                  <div className="font-semibold text-forest">{o.t}</div>
                  <div className="mt-1 text-sm text-mute">{o.d}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Add-ons</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">Add services as needed.</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 4) * 60}>
                <div className="card flex h-full items-center gap-3 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-forest2 text-white"><Icon name={s.icon} size={20} /></span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-forest">{s.name}</div>
                    <div className="text-xs font-semibold text-gold">{(s.price / 1000).toFixed(0)}k / month</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/signup" className="btn btn-primary">Begin registration <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
