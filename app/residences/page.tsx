import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer, Nav, PageHero } from "@/components/site";
import { Gem, Reveal } from "@/components/ui";
import { ROOMS, fmt } from "@/lib/data";
import { IMAGES, detail } from "@/lib/residences";

const STATUS = {
  vacant: { l: "Available", c: "#3f9a76" },
  reserved: { l: "Reserved", c: "#c98a1a" },
  occupied: { l: "Occupied", c: "#7a8a93" },
  maintenance: { l: "Unavailable", c: "#7a8a93" },
} as const;

export default function Residences() {
  return (
    <>
      <Nav />
      <PageHero eyebrow="Residences" title="Two homes. Ten private residences." image="/images/lounge.jpg" />
      <div className="mx-auto max-w-7xl space-y-16 px-6 py-16">
        {[1, 2].map((h) => (
          <section key={h}>
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-forest">House {h}</h2>
                <span className="h-px flex-1 bg-line" />
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ROOMS.filter((r) => r.house === h).map((r, i) => {
                const d = detail(r.id)!;
                const st = STATUS[r.status];
                return (
                  <Reveal key={r.id} delay={(i % 3) * 80}>
                    <Link href={`/residences/${r.id}`} className="card group block overflow-hidden">
                      <div className="relative aspect-[16/10]">
                        <Image src={IMAGES[d.image]} alt={r.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold" style={{ color: st.c }}>
                          <i className="h-2 w-2 rounded-full" style={{ background: st.c }} />{st.l}
                        </span>
                        <div className="absolute bottom-3 left-4 flex items-center gap-3 text-white">
                          <span className="rounded-lg p-1.5" style={{ background: r.soft }}><Gem color={r.color} size={30} /></span>
                          <span className="text-xl font-semibold">{r.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div className="text-sm font-semibold text-mute">{d.size} m² · {d.bed} · {d.tier}</div>
                        <ArrowRight size={18} className="text-gold" />
                      </div>
                      <div className="border-t border-line px-4 py-3 text-sm font-semibold text-forest">From {fmt(r.price)} <span className="text-mute">/ month</span></div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
}
