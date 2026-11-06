import { ChevronDown } from "lucide-react";
import { Footer, Nav, PageHero } from "@/components/site";
import { Icon } from "@/components/ui";

const POLICIES = [
  { i: "ShieldCheck", t: "Privacy & data protection", s: "Your information is used only for admission and care.", d: "Records are encrypted, access is limited by role, and every access is logged. Families see only what they are authorised to see. Photographs and marketing use require separate consent." },
  { i: "FileSignature", t: "Consent & legal authority", s: "A family relationship is not legal authority.", d: "We record who may decide what, and on what basis. Powers of attorney and guardianship documents are verified and kept on file. Consent can be reviewed or withdrawn." },
  { i: "HeartHandshake", t: "Safeguarding & dignity", s: "Every resident is treated with respect and kept safe.", d: "All staff are background checked and trained in safeguarding. Concerns are reported and investigated promptly, and families are informed." },
  { i: "Pill", t: "Medication", s: "Given only by authorised staff, and recorded every time.", d: "Medicines are verified against prescriptions. Each dose, refusal or missed dose is recorded with the staff member and time." },
  { i: "Siren", t: "Emergencies", s: "Clear escalation, with family informed.", d: "Emergency services are contacted when clinically necessary. Your named emergency contacts are notified. Resident assistance buttons supplement, and never replace, the emergency call system." },
  { i: "Users", t: "Visiting & family", s: "Open, scheduled around the resident's routine.", d: "Family are welcome daily. Video calls can be arranged. Visitors may be asked to follow infection-control precautions." },
  { i: "Receipt", t: "Fees, refunds & termination", s: "Set out clearly in your signed agreement.", d: "Charges, deposits, add-ons, refunds and notice periods are governed by the admission agreement. Price changes never alter an existing agreement without your consent." },
  { i: "MessageSquareWarning", t: "Feedback & complaints", s: "We want to hear it, and we respond.", d: "Raise concerns with the facility manager or the director. Complaints are acknowledged, investigated and answered in writing." },
];

export default function Policies() {
  return (
    <>
      <Nav />
      <PageHero eyebrow="Policies" title="Clear rules that protect residents and families." image="/images/community.jpg" />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-3">
          {POLICIES.map((p) => (
            <details key={p.t} className="card group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sage text-forest2"><Icon name={p.i} size={22} /></span>
                <div className="flex-1">
                  <div className="font-semibold text-forest">{p.t}</div>
                  <div className="text-sm text-mute">{p.s}</div>
                </div>
                <ChevronDown size={20} className="text-gold transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-line bg-cream px-5 py-4 pl-[88px] text-sm leading-relaxed text-ink">{p.d}</div>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-semibold text-mute">Summaries for demonstration. Full terms are in the signed admission agreement and privacy notice.</p>
      </div>
      <Footer />
    </>
  );
}
