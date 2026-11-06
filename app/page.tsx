"use client";
import Image from "next/image";
import Link from "next/link";
import { Gem, Icon, Reveal } from "@/components/ui";
import { Footer, Nav } from "@/components/site";
import { ROOMS, SERVICES } from "@/lib/data";
import { ArrowRight, Sparkles, Tv, Users } from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Image src="/images/hero.jpg" alt="Caregiver and resident sharing a smile" fill priority sizes="100vw" className="object-cover object-[75%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/10 md:via-white/75" />
      <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-6 py-20">
        <div className="fadeup max-w-xl">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-gold"><span className="h-px w-10 bg-gold" />Residential care &amp; wellness</div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-tight text-forest md:text-6xl">
            Compassionate senior care, <span className="text-gold">professionally delivered.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-mute">Qualified carers, private residences and a connected care record for every family.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-primary">Request access <ArrowRight size={16} /></Link>
            <Link href="/packages" className="btn btn-ghost">View packages</Link>
          </div>
          <div className="mt-12 flex items-center gap-10 border-t border-line pt-6">
            {[["10", "Residences"], ["2", "Homes"], ["24/7", "Care team"]].map(([a, b]) => (
              <div key={b}>
                <div className="text-3xl font-semibold text-forest">{a}</div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-mute">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const items = [
    { src: "/images/lounge.jpg", t: "Daily support", i: "HeartHandshake" },
    { src: "/images/community.jpg", t: "Community life", i: "Users" },
    { src: "/images/room.jpg", t: "Comfortable rooms", i: "BedDouble" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Life at Oracle</div>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-forest md:text-4xl">Care that respects independence.</h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((x, n) => (
          <Reveal key={x.t} delay={n * 100}>
            <div className="card group relative aspect-[4/5] overflow-hidden">
              <Image src={x.src} alt={x.t} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5 text-white">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur"><Icon name={x.i} size={20} /></span>
                <span className="font-semibold">{x.t}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Homes() {
  return (
    <section id="homes" className="mx-auto max-w-7xl px-6 py-20">
      <Reveal className="text-center">
        <h2 className="text-4xl font-semibold text-forest md:text-5xl">Ten residences. Two homes.</h2>
      </Reveal>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {[1, 2].map((h) => (
          <Reveal key={h} delay={h * 120}>
            <div className="card p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-2xl font-semibold text-forest">House {h}</span>
                <span className="h-1 w-20 rounded-full bg-gradient-to-r from-gold to-transparent" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {ROOMS.filter((r) => r.house === h).map((r) => (
                  <div key={r.id} className="group rounded-2xl p-2 text-center transition-all" style={{ background: r.soft }}>
                    <div className="mx-auto transition-transform"><Gem color={r.color} size={46} /></div>
                    <div className="mt-1 text-[11px] font-bold" style={{ color: r.color }}>{r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Life() {
  return (
    <section id="life" className="bg-sand/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><h2 className="text-center text-4xl font-semibold text-forest md:text-5xl">Services, on request.</h2></Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 80}>
              <div className="card group flex h-full flex-col items-center gap-3 p-6 text-center transition-all hover:shadow-xl">
                <span className="grid h-16 w-16 place-items-center rounded-3xl text-white transition-transform" style={{ background: `linear-gradient(135deg, ${s.tone}, ${s.tone}bb)` }}>
                  <Icon name={s.icon} size={28} />
                </span>
                <span className="text-sm font-bold text-forest">{s.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OneSage() {
  const apps = [
    { n: "Management", i: "LayoutDashboard", a: -90, c: "#0b4254" },
    { n: "Care", i: "Stethoscope", a: 0, c: "#176a7c" },
    { n: "Family", i: "Users", a: 90, c: "#176a7c" },
    { n: "Room", i: "Tv", a: 180, c: "#176a7c" },
  ];
  return (
    <section id="one" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="text-center">
        <h2 className="text-4xl font-semibold text-forest md:text-5xl">ONE <span className="text-gold">+</span> SAGE</h2>
      </Reveal>
      <Reveal>
        <div className="relative mx-auto mt-14 aspect-square w-full max-w-[520px]">
          <div className="spin-slow absolute inset-6 rounded-full border border-dashed border-gold/50" />
          <div className="absolute inset-24 rounded-full border border-line bg-white/60" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            
            <div className="relative grid h-28 w-28 place-items-center rounded-full bg-gold text-white shadow-lg">
              <div className="text-center"><Sparkles className="mx-auto" /><div className="text-lg font-semibold tracking-widest">SAGE</div></div>
            </div>
          </div>
          {apps.map((a) => {
            const rad = (a.a * Math.PI) / 180;
            return (
              <div key={a.n} className="absolute text-center" style={{ left: `calc(50% + ${Math.cos(rad) * 41}% )`, top: `calc(50% + ${Math.sin(rad) * 41}% )`, transform: "translate(-50%,-50%)" }}>
                <div className="grid h-20 w-20 place-items-center rounded-xl text-white shadow-md" style={{ background: a.c }}>
                  <Icon name={a.i} size={30} />
                </div>
                <div className="mt-2 text-xs font-bold uppercase tracking-widest text-forest">{a.n}</div>
              </div>
            );
          })}
        </div>
      </Reveal>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/login" className="btn btn-primary">Try the prototype <ArrowRight size={16} /></Link>
      </div>
      <span className="hidden"><Users /><Tv /></span>
    </section>
  );
}

function Path() {
  const steps = [
    { i: "PhoneCall", t: "Enquire", c: "#0e8a9a" },
    { i: "ClipboardCheck", t: "Assess", c: "#0e8a9a" },
    { i: "FileSignature", t: "Agree", c: "#0e8a9a" },
    { i: "BedDouble", t: "Settle in", c: "#0e8a9a" },
    { i: "HeartHandshake", t: "Thrive", c: "#0e8a9a" },
  ];
  return (
    <section id="path" className="bg-forest py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><h2 className="text-center text-4xl font-semibold md:text-5xl">Admission, step by step.</h2></Reveal>
        <div className="relative mt-14 grid grid-cols-2 gap-y-10 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-8 hidden border-t-2 border-dashed border-gold/60 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 120} className="relative text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white ring-8 ring-forest" style={{ background: s.c }}>
                <Icon name={s.i} size={26} />
              </div>
              <div className="mt-4 text-sm font-bold tracking-wide">{s.t}</div>
              <div className="text-gold2">0{i + 1}</div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/signup" className="btn btn-gold">Start now <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Gallery />
      <Homes />
      <Life />
      <OneSage />
      <Path />
      <Footer />
    </>
  );
}
