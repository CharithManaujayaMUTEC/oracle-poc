import Image from "next/image";
import { Footer, Nav, PageHero } from "@/components/site";
import { Avatar, Icon, Reveal } from "@/components/ui";

const TEAMS = [
  {
    t: "Leadership", icon: "Crown", tone: "#0b4254",
    people: [
      { n: "Ayesha Wijesinghe", r: "Director", tags: ["MBBS", "Geriatrics"] },
      { n: "Kasun Ranasinghe", r: "Facility Manager", tags: ["Operations"] },
      { n: "Tharushi Gunawardena", r: "Admissions & Finance", tags: ["Billing"] },
    ],
  },
  {
    t: "Nursing", icon: "Stethoscope", tone: "#0e8a9a",
    people: [
      { n: "Dilini Fernando", r: "Lead Nurse", tags: ["Registered Nurse", "Medication"] },
      { n: "Sanjeewa Kumar", r: "Registered Nurse", tags: ["Wound care"] },
      { n: "Anoma Perera", r: "Night Nurse", tags: ["Registered Nurse"] },
    ],
  },
  {
    t: "Care team", icon: "HeartHandshake", tone: "#176a7c",
    people: [
      { n: "Nadeesha Silva", r: "Senior Caregiver", tags: ["Dementia care"] },
      { n: "Ruwan Jayakody", r: "Caregiver", tags: ["First aid"] },
      { n: "Malathi Rajan", r: "Night Supervisor", tags: ["First aid", "Safeguarding"] },
    ],
  },
  {
    t: "Wellness", icon: "Activity", tone: "#3f9a76",
    people: [
      { n: "Nirmala Joseph", r: "Physiotherapist", tags: ["BSc Physio"] },
      { n: "Hiruni Peiris", r: "Dietitian", tags: ["Clinical nutrition"] },
      { n: "Dinesh Alwis", r: "Activities Coordinator", tags: ["Recreation"] },
    ],
  },
];

export default function Staff() {
  return (
    <>
      <Nav />
      <PageHero eyebrow="Our team" title="People who care, professionally." image="/images/community.jpg" />

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-6">
        <div className="card grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          {[["Users", "24/7", "Care cover"], ["ShieldCheck", "100%", "Background checked"], ["GraduationCap", "Monthly", "Training"], ["Stethoscope", "RN-led", "Every shift"]].map(([i, v, l]) => (
            <div key={l} className="flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sage text-forest2"><Icon name={i} size={20} /></span>
              <div>
                <div className="text-lg font-semibold text-forest">{v}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-mute">{l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-6 py-16">
        {TEAMS.map((g) => (
          <section key={g.t}>
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg text-white" style={{ background: g.tone }}><Icon name={g.icon} size={20} /></span>
                <h2 className="text-2xl font-semibold text-forest">{g.t}</h2>
                <span className="h-px flex-1 bg-line" />
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.people.map((p, i) => (
                <Reveal key={p.n} delay={i * 80}>
                  <div className="card flex items-center gap-4 p-5">
                    <Avatar name={p.n} hue={g.tone} size={64} />
                    <div className="min-w-0">
                      <div className="font-semibold text-forest">{p.n}</div>
                      <div className="text-sm font-semibold text-gold">{p.r}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.tags.map((t) => <span key={t} className="rounded-md bg-sand px-2 py-0.5 text-[11px] font-semibold text-forest2">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
        <p className="text-center text-xs font-semibold text-mute">Sample team profiles for demonstration.</p>
      </div>

      <section className="relative overflow-hidden bg-forest py-16 text-center text-white">
        <Image src="/images/lounge.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="relative px-6">
          <h2 className="text-3xl font-semibold tracking-tight">Join the Oracle team</h2>
          <a href="mailto:careers@village60.lk" className="btn btn-gold mt-6">careers@village60.lk</a>
        </div>
      </section>
      <Footer />
    </>
  );
}
