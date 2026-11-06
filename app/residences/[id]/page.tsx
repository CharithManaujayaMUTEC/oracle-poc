import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Footer, Nav } from "@/components/site";
import { OffersSection } from "@/components/offers";
import { Gem, Icon, Reveal } from "@/components/ui";
import { ROOMS, fmt } from "@/lib/data";
import { FEATURE_ICON, IMAGES, detail } from "@/lib/residences";

export function generateStaticParams() {
  return ROOMS.map((r) => ({ id: r.id }));
}

function FloorPlan({ size, bed, color }: { size: number; bed: string; color: string }) {
  const w = 120 + size * 4;
  const h = 150;
  return (
    <svg viewBox={`0 0 ${w + 20} ${h + 20}`} className="w-full">
      <rect x="10" y="10" width={w} height={h} fill="#fff" stroke="#0b4254" strokeWidth="3" />
      {/* bathroom */}
      <rect x={w - 50} y="10" width="60" height="70" fill="#e0f0f2" stroke="#0b4254" strokeWidth="2" />
      <text x={w - 20} y="50" textAnchor="middle" fontSize="10" fill="#176a7c" fontWeight="700">WC</text>
      {/* bed */}
      <rect x="26" y="40" width={bed === "Double" ? 70 : 50} height="80" rx="6" fill={color} opacity=".25" stroke={color} strokeWidth="2" />
      <rect x="26" y="40" width={bed === "Double" ? 70 : 50} height="18" rx="6" fill={color} opacity=".6" />
      {/* window */}
      <rect x="60" y="6" width="80" height="8" fill="#a9dbe0" stroke="#0b4254" strokeWidth="1.5" />
      {/* door */}
      <path d={`M${w - 80} ${h + 10} v-30 a30 30 0 0 1 30 30`} fill="none" stroke="#0e8a9a" strokeWidth="2" />
      <rect x={w - 80} y={h + 7} width="30" height="6" fill="#fff" />
    </svg>
  );
}

export default async function Residence({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = ROOMS.find((r) => r.id === id);
  const d = detail(id);
  if (!room || !d) notFound();
  const stats = [
    { i: "Ruler", v: `${d.size} m²`, l: "Size" },
    { i: "BedDouble", v: d.bed, l: "Bed" },
    { i: "Layers", v: d.floor, l: "Level" },
    { i: "Compass", v: d.view, l: "View" },
    { i: "BadgeCheck", v: d.tier, l: "Package" },
  ];
  const gallery = [1, 2, 3].map((k) => IMAGES[(d.image + k) % IMAGES.length]);
  const status = room.status === "vacant" ? "Available now" : room.status === "reserved" ? "Reserved" : room.status === "occupied" ? "Currently occupied" : "Unavailable";

  return (
    <>
      <Nav />
      <section className="relative overflow-hidden bg-forest text-white">
        <Image src={IMAGES[d.image]} alt={room.name} fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, #0b4254 25%, transparent), linear-gradient(${room.color}33, ${room.color}33)` }} />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Link href="/residences" className="inline-flex items-center gap-2 text-sm font-semibold text-gold2"><ArrowLeft size={16} /> All residences</Link>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <span className="rounded-2xl bg-white/95 p-3"><Gem color={room.color} size={84} /></span>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold2">House {room.house}</div>
              <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">{room.name}</h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur"><i className="h-2 w-2 rounded-full" style={{ background: room.status === "vacant" ? "#6ee7a8" : "#f1c36b" }} />{status}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-7xl px-6">
        <div className="card grid grid-cols-2 divide-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sage text-forest2"><Icon name={s.i} size={20} /></span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mute">{s.l}</div>
                <div className="text-sm font-semibold text-forest">{s.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <h2 className="text-2xl font-semibold text-forest">Inside the residence</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {d.features.map((f) => (
              <div key={f} className="card flex flex-col items-center gap-3 p-5 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: room.color }}><Icon name={FEATURE_ICON[f] ?? "Check"} size={22} /></span>
                <span className="text-sm font-semibold text-forest">{f}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-2xl font-semibold text-forest">Floor plan</h2>
          <div className="card mt-6 p-6" style={{ background: room.soft }}>
            <FloorPlan size={d.size} bed={d.bed} color={room.color} />
            <div className="mt-3 text-center text-xs font-semibold text-mute">Indicative layout · {d.size} m²</div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4">
        <h2 className="text-2xl font-semibold text-forest">Gallery</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {gallery.map((g, n) => (
            <Reveal key={n} delay={n * 80}>
              <div className="card relative aspect-[4/3] overflow-hidden">
                <Image src={g} alt={`${room.name} gallery ${n + 1}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-mute">From</div>
            <div className="text-3xl font-semibold text-forest">{fmt(room.price)} <span className="text-base text-mute">/ month</span></div>
            <div className="text-xs font-semibold text-mute">Indicative demo price · {d.tier}</div>
          </div>
          <div className="flex gap-3">
            <Link href="/packages" className="btn btn-ghost">Compare packages</Link>
            <Link href="/signup" className="btn btn-gold">Request {room.name} <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <OffersSection title={`Offers for ${room.name}`} />
      <Footer />
    </>
  );
}
