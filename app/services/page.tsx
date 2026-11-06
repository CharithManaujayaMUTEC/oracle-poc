import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer, Nav, PageHero } from "@/components/site";
import { Icon, Reveal } from "@/components/ui";
import { SERVICES } from "@/lib/data";

const GROUPS = [
  { t: "Room & dining", icon: "Utensils", ids: ["ac", "fridge", "meals"] },
  { t: "Household", icon: "Brush", ids: ["laundry", "house"] },
  { t: "Travel & concierge", icon: "Car", ids: ["car", "escort", "shop", "concierge"] },
  { t: "Personal wellness", icon: "Sparkles", ids: ["salon", "spa", "physio", "fit"] },
  { t: "Health coordination", icon: "Stethoscope", ids: ["appt", "meds", "review"] },
];

export default function Services() {
  return (
    <>
      <Nav />
      <PageHero eyebrow="Services" title="Everything a resident needs, arranged for them." image="/images/room.jpg" />
      <div className="mx-auto max-w-7xl space-y-14 px-6 py-16">
        {GROUPS.map((g) => (
          <section key={g.t}>
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-forest text-white"><Icon name={g.icon} size={20} /></span>
                <h2 className="text-2xl font-semibold text-forest">{g.t}</h2>
                <span className="h-px flex-1 bg-line" />
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {g.ids.map((id, i) => {
                const s = SERVICES.find((x) => x.id === id)!;
                return (
                  <Reveal key={id} delay={i * 70}>
                    <div className="card flex h-full flex-col items-start gap-4 p-5">
                      <span className="grid h-14 w-14 place-items-center rounded-xl bg-sage text-forest2"><Icon name={s.icon} size={26} /></span>
                      <div className="font-semibold text-forest">{s.name}</div>
                      <div className="mt-auto text-sm font-semibold text-gold">from {(s.price / 1000).toFixed(0)}k <span className="text-mute">LKR / month</span></div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))}
        <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="text-lg font-semibold text-forest">Services are bundled in our packages.</div>
          <Link href="/packages" className="btn btn-primary">View packages <ArrowRight size={16} /></Link>
        </div>
        <p className="text-center text-xs font-semibold text-mute">Indicative prices for demonstration. Confirmed in the separate fee schedule.</p>
      </div>
      <Footer />
    </>
  );
}
