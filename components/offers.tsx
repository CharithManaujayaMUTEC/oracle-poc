import { Icon, Reveal } from "./ui";
import { OFFERS } from "@/lib/offers";

export function OffersSection({ title = "Current offers" }: { title?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Offers</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-forest md:text-4xl">{title}</h2>
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
  );
}
