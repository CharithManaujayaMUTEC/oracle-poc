"use client";
import { useState } from "react";
import { ArrowRight, Phone, Plus } from "lucide-react";
import { Field, Modal, PageHead, Pill, Tone } from "@/components/kit";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { ENQUIRIES, ENQ_STATUS, EnqStatus, Enquiry } from "@/lib/mock";
import { fmt } from "@/lib/data";

const TONE: Record<EnqStatus, Tone> = {
  New: "blue", Contacted: "teal", "Assessment pending": "amber", "Visit arranged": "teal",
  "Quotation issued": "blue", "Awaiting decision": "amber", Confirmed: "green", "Not proceeding": "gray",
};
const SRC_ICON: Record<string, string> = { WhatsApp: "MessageCircle", Phone: "Phone", Website: "Globe", Referral: "UserPlus", Hospital: "Hospital" };

export default function Enquiries() {
  const { toast, log } = useApp();
  const [list, setList] = useState<Enquiry[]>(ENQUIRIES);
  const [add, setAdd] = useState(false);
  const [sel, setSel] = useState<Enquiry | null>(null);
  const [f, setF] = useState({ name: "", forClient: "", phone: "", service: "Long-term", facility: "House 1", source: "Phone" });

  const move = (e: Enquiry, dir: 1 | -1) => {
    const i = ENQ_STATUS.indexOf(e.status) + dir;
    if (i < 0 || i >= ENQ_STATUS.length) return;
    const status = ENQ_STATUS[i];
    setList((p) => p.map((x) => (x.id === e.id ? { ...x, status } : x)));
    setSel((s) => (s && s.id === e.id ? { ...s, status } : s));
    log(`Moved enquiry to “${status}”`, e.forClient);
    toast(`${e.forClient} → ${status}`);
  };

  return (
    <div>
      <PageHead title="Enquiries" sub="Pipeline from first contact to confirmation" actions={<button className="btn btn-gold" onClick={() => setAdd(true)}><Plus size={16} /> New enquiry</button>} />
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10">
        {ENQ_STATUS.map((st) => {
          const items = list.filter((e) => e.status === st);
          return (
            <div key={st} className="w-72 shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <Pill tone={TONE[st]}>{st}</Pill>
                <span className="text-xs font-bold text-mute">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map((e) => (
                  <button key={e.id} onClick={() => setSel(e)} className="card block w-full p-4 text-left transition-shadow hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-forest">{e.forClient}</div>
                      <Icon name={SRC_ICON[e.source] ?? "Inbox"} size={16} className="text-mute" />
                    </div>
                    <div className="mt-1 text-xs text-mute">{e.name} · {e.relation}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold text-forest2">
                      <span className="rounded bg-sand px-2 py-0.5">{e.service}</span>
                      <span className="rounded bg-sand px-2 py-0.5">{e.facility}</span>
                      <span className="rounded bg-sand px-2 py-0.5">{e.expected}</span>
                    </div>
                  </button>
                ))}
                {items.length === 0 && <div className="rounded-xl border border-dashed border-line p-6 text-center text-xs font-semibold text-mute">Empty</div>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.forClient ?? ""} wide>
        {sel && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[["Enquirer", `${sel.name} (${sel.relation})`], ["Phone", sel.phone], ["Country", sel.country], ["Source", sel.source], ["Service", sel.service], ["Facility", sel.facility], ["Expected admission", sel.expected], ["Budget", fmt(sel.budget) + " / mo"]].map(([l, v]) => (
                <div key={l}><div className="text-[11px] font-bold uppercase tracking-wider text-mute">{l}</div><div className="font-semibold text-forest">{v}</div></div>
              ))}
            </div>
            <div className="flex items-center gap-2"><Pill tone={TONE[sel.status]}>{sel.status}</Pill></div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <button className="btn btn-ghost" onClick={() => move(sel, -1)}>Back</button>
              <button className="btn btn-primary" onClick={() => move(sel, 1)}>Next stage <ArrowRight size={16} /></button>
              <button className="btn btn-ghost" onClick={() => toast("WhatsApp message drafted by SAGE for review")}><Phone size={16} /> Contact</button>
              {sel.status === "Confirmed" && <a href="/app/register" className="btn btn-gold">Start registration</a>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={add} onClose={() => setAdd(false)} title="New enquiry">
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          const n: Enquiry = { id: "e" + Date.now(), name: f.name, relation: "Family", forClient: f.forClient, phone: f.phone, country: "Sri Lanka", source: f.source, service: f.service, facility: f.facility, expected: "TBC", budget: 0, status: "New", date: "Today" };
          setList((p) => [n, ...p]); setAdd(false); log("Created enquiry", f.forClient); toast("Enquiry added");
        }}>
          <Field label="Enquirer name"><input className="input" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="For (client)"><input className="input" required value={f.forClient} onChange={(e) => setF({ ...f, forClient: e.target.value })} /></Field>
          <Field label="Phone / WhatsApp"><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <div className="grid grid-cols-3 gap-2">
            {[["service", ["Long-term", "Short stay", "Home care"]], ["facility", ["House 1", "House 2"]], ["source", ["Phone", "WhatsApp", "Website", "Referral", "Hospital"]]].map(([k, opts]) => (
              <Field key={k as string} label={k as string}>
                <select className="input !px-2" value={(f as Record<string, string>)[k as string]} onChange={(e) => setF({ ...f, [k as string]: e.target.value })}>{(opts as string[]).map((o) => <option key={o}>{o}</option>)}</select>
              </Field>
            ))}
          </div>
          <button className="btn btn-primary w-full">Save enquiry</button>
        </form>
      </Modal>
    </div>
  );
}
