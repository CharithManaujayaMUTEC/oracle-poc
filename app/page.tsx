"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { BrandLogo, Gem, Icon, Logo, Reveal, V60Logo } from "@/components/ui";
import { DEMO_USERS, ROLE_LABEL, ROOMS, Role } from "@/lib/data";
import { HOME } from "@/lib/nav";
import { useApp } from "@/lib/store";

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Logo dark size={44} />
        <nav className="hidden gap-8 text-sm font-semibold text-white/70 md:flex">
          {[["#roles", "Roles"], ["#modules", "Modules"], ["#sage", "SAGE"], ["#security", "Security"]].map(([h, l]) => (
            <a key={h} href={h} className="transition-colors hover:text-gold2">{l}</a>
          ))}
        </nav>
        <div className="flex gap-3">
          <Link href="/signup" className="btn hidden border border-white/25 text-white sm:inline-flex">Create account</Link>
          <Link href="/login" className="btn btn-gold">Sign in</Link>
        </div>
      </div>
    </header>
  );
}

function DashMock() {
  const bars = [52, 60, 56, 68, 74, 70, 86];
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgba(4,106,78,.55),transparent)]" />
      <div data-theme="light" className="theme-root relative overflow-hidden rounded-xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
        <div className="flex items-center gap-1.5 border-b border-line bg-cream px-4 py-2.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#e8b4b4]" /><i className="h-2.5 w-2.5 rounded-full bg-[#ecd9a4]" /><i className="h-2.5 w-2.5 rounded-full bg-[#b9dcc3]" />
          <span className="ml-3 rounded bg-paper px-3 py-0.5 text-[10px] font-semibold text-mute">one.village60.lk</span>
        </div>
        <div className="grid grid-cols-[56px_1fr]">
          <div className="space-y-3 bg-night p-3">
            {["LayoutDashboard", "Users", "Stethoscope", "Receipt", "Sparkles"].map((i, n) => (
              <span key={i} className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: n === 0 ? "rgba(176,141,87,.22)" : "transparent", color: n === 0 ? "#D9C39A" : "rgba(255,255,255,.55)" }}><Icon name={i} size={16} /></span>
            ))}
          </div>
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2.5">
              {[["Occupancy", "80%"], ["Meds due", "3"], ["Open incidents", "2"]].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-line p-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-mute">{l}</div>
                  <div className="text-xl font-semibold text-forest">{v}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1.3fr_1fr] gap-2.5">
              <div className="rounded-lg border border-line p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-mute">Revenue</div>
                <div className="mt-2 flex h-20 items-end gap-1.5">
                  {bars.map((b, i) => <span key={i} className="flex-1 rounded-sm" style={{ height: `${b}%`, background: i === bars.length - 1 ? "var(--gold)" : "#cfe3da" }} />)}
                </div>
              </div>
              <div className="rounded-lg border border-line p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-mute">Rooms</div>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {ROOMS.map((r) => <span key={r.id} className="grid place-items-center rounded" style={{ background: r.soft, opacity: r.status === "vacant" ? 0.5 : 1 }}><Gem color={r.color} size={20} /></span>)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg tone-red tint p-2.5 text-[11px] font-semibold"><Icon name="Siren" size={14} /> Fall reported · Onyx · acknowledge</div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 flex max-w-[230px] items-start gap-3 rounded-xl border border-gold/40 bg-night p-3 shadow-xl">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-night"><Sparkles size={16} /></span>
        <div className="text-xs font-semibold text-white">SAGE<div className="mt-0.5 font-medium text-white/60">Handover draft ready for review.</div></div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-night">
      <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_88%_15%,rgba(4,106,78,.5),transparent),radial-gradient(40%_50%_at_5%_95%,rgba(176,141,87,.16),transparent)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-16 md:grid-cols-[1fr_1.05fr] md:py-24">
        <div className="fadeup">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-gold2"><span className="h-2 w-2 rounded-full bg-gold" />ONE by Village 60 Plus</div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl">
            One platform for every home, <span className="text-gold2">resident and family.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/65">Admissions, care records, medication, billing and family updates, connected and guided by SAGE.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-gold">Sign in <ArrowRight size={16} /></Link>
            <a href="#roles" className="btn border border-white/25 text-white">Explore by role</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-white/80">
            {["Role-based access", "Audit trail", "Consent management"].map((t) => (
              <span key={t} className="flex items-center gap-2"><Check size={16} className="text-gold" />{t}</span>
            ))}
          </div>
        </div>
        <DashMock />
      </div>
    </section>
  );
}

function Brand() {
  return (
    <section className="border-t border-white/10 bg-night">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <Reveal className="flex justify-center md:justify-start"><BrandLogo width={340} /></Reveal>
        <Reveal delay={120}>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold">An initiative of</div>
          <div className="mt-4"><V60Logo width={300} /></div>
          <p className="mt-5 max-w-md text-white/60">Oracle brings Village 60 Plus&apos;s professional elderly care into one connected digital record.</p>
        </Reveal>
      </div>
    </section>
  );
}

function Roles() {
  const { demoLogin } = useApp();
  const router = useRouter();
  const roles = Object.keys(DEMO_USERS) as Role[];
  return (
    <section id="roles" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="max-w-xl">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Built for every role</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">Everyone sees exactly what they need.</h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r, i) => (
          <Reveal key={r} delay={(i % 3) * 80}>
            <button onClick={() => { demoLogin(r); router.push(HOME[r]); }} className="card group flex h-full w-full items-center gap-4 p-5 text-left transition-colors hover:border-gold">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white" style={{ background: DEMO_USERS[r].tone }}><Icon name={DEMO_USERS[r].icon} size={26} /></span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-forest">{ROLE_LABEL[r]}</div>
                <div className="text-sm text-mute">{DEMO_USERS[r].blurb}</div>
              </div>
              <ArrowRight size={18} className="text-gold opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const APPS = [
  { n: "ONE Management", i: "LayoutDashboard", c: "#090A09", items: [["Inbox", "Enquiries"], ["ClipboardList", "Admissions"], ["BedDouble", "Rooms"], ["IdCard", "Staff"], ["Tags", "Pricing"], ["Receipt", "Billing"], ["ChartColumn", "Reports"], ["ShieldCheck", "Security"]] },
  { n: "ONE Care", i: "Stethoscope", c: "#023C2E", items: [["Users", "Residents"], ["Pill", "Medication"], ["Accessibility", "Body map"], ["Siren", "Incidents"], ["CalendarDays", "Appointments"], ["House", "Home care"], ["ClipboardCheck", "Handover"], ["Tv", "Smart room"]] },
  { n: "ONE Family", i: "Heart", c: "#046A4E", items: [["Activity", "Daily updates"], ["MessageCircle", "Messages"], ["Video", "Video calls"], ["Receipt", "Invoices"], ["CalendarDays", "Appointments"], ["Plus", "Request services"]] },
];

function Modules() {
  return (
    <section id="modules" className="bg-paper py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-xl">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Modules</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">Three connected apps on one record.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {APPS.map((a, n) => (
            <Reveal key={a.n} delay={n * 100}>
              <div className="card h-full overflow-hidden">
                <div className="flex items-center gap-3 p-5 text-white" style={{ background: a.c }}>
                  <Icon name={a.i} size={24} className="text-gold2" /><span className="text-lg font-semibold">{a.n}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {a.items.map(([ic, l]) => (
                    <div key={l} className="flex flex-col items-center gap-2 rounded-lg p-2.5 text-center">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-sage text-forest2"><Icon name={ic} size={20} /></span>
                      <span className="text-[11px] font-semibold leading-tight text-forest">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const steps = [["Inbox", "Enquiry"], ["ClipboardCheck", "Assessment"], ["FileText", "Quotation"], ["FileSignature", "Agreement"], ["BedDouble", "Admission"], ["HeartPulse", "Care plan"], ["Users", "Family access"]];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="max-w-xl">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Workflow</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">From first enquiry to daily care.</h2>
      </Reveal>
      <div className="relative mt-12 grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
        <div className="absolute left-[7%] right-[7%] top-7 hidden border-t-2 border-dashed border-gold/50 lg:block" />
        {steps.map(([ic, l], i) => (
          <Reveal key={l} delay={i * 70} className="relative text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-night text-gold2 ring-8 ring-cream"><Icon name={ic} size={22} /></span>
            <div className="mt-3 text-sm font-semibold text-forest">{l}</div>
            <div className="text-xs font-bold text-gold">0{i + 1}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SageBand() {
  const levels = [
    { t: "Retrieves", d: "Approved information and summaries", i: "Search", c: "#046A4E" },
    { t: "Prepares", d: "Quotes, messages, handovers for review", i: "FilePen", c: "#B08D57" },
    { t: "Never decides", d: "Clinical orders, pricing, admission", i: "ShieldOff", c: "#9b3b4a" },
  ];
  return (
    <section id="sage" className="relative overflow-hidden bg-forest py-24 text-white">
      <Image src="/images/lounge.jpg" alt="" fill sizes="100vw" className="object-cover opacity-15" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_80%_at_15%_50%,rgba(176,141,87,.18),transparent)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal>
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-night"><Sparkles /></span><span className="font-wordmark text-2xl font-semibold tracking-[0.2em] text-gold2">SAGE</span></div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">AI that assists. People that decide.</h2>
          <p className="mt-4 max-w-md text-white/70">Every SAGE action is permissioned and logged. Sensitive actions wait for human approval.</p>
          <Link href="/login" className="btn btn-gold mt-8">Try SAGE <ArrowRight size={16} /></Link>
        </Reveal>
        <div className="space-y-3">
          {levels.map((l, i) => (
            <Reveal key={l.t} delay={i * 100}>
              <div className="flex items-center gap-4 rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white" style={{ background: l.c }}><Icon name={l.i} size={22} /></span>
                <div><div className="font-semibold">{l.t}</div><div className="text-sm text-white/65">{l.d}</div></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  const items = [["Lock", "Encrypted"], ["KeyRound", "MFA for admins"], ["ShieldCheck", "Role-based access"], ["ScrollText", "Audit logging"], ["FileCheck", "Consent records"], ["DatabaseBackup", "Backup & recovery"]];
  return (
    <section id="security" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="text-center">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Security & privacy</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">Resident data, protected by design.</h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map(([ic, l], i) => (
          <Reveal key={l} delay={i * 60}>
            <div className="card flex flex-col items-center gap-3 p-5 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-night text-gold2"><Icon name={ic} size={22} /></span>
              <span className="text-sm font-semibold text-forest">{l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div data-theme="dark" className="theme-root">
      <Nav />
      <Hero />
      <Roles />
      <Modules />
      <Journey />
      <SageBand />
      <Security />
      <section className="bg-night py-16 text-center">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Ready to see ONE in action?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="btn btn-gold">Sign in <ArrowRight size={16} /></Link>
          <Link href="/signup" className="btn border border-white/25 text-white">Create account</Link>
        </div>
      </section>
      <Brand />
      <footer className="border-t border-white/10 bg-night py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <Logo dark size={40} />
          <div className="text-xs text-white/50">People · Purpose · A Brighter Tomorrow · Front-end prototype with demo data</div>
          <V60Logo width={110} />
        </div>
      </footer>
    </div>
  );
}
