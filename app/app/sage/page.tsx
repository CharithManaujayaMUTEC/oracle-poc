"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Mic, Search, Send, ShieldOff, Sparkles, FilePen, X } from "lucide-react";
import { Pill } from "@/components/kit";
import { useApp } from "@/lib/store";
import { Role, ROOMS } from "@/lib/data";
import { SAGE_QUEUE } from "@/lib/mock";

type Msg = { from: "me" | "sage"; text: string; card?: "rooms" };

const SUGGEST: Record<Role, string[]> = {
  director: ["Occupancy?", "Outstanding invoices", "Open incidents"],
  manager: ["Occupancy?", "Open incidents", "Incomplete registrations"],
  nurse: ["Meds due", "Draft handover", "Falls risk"],
  caregiver: ["Nimal's diet?", "Today's tasks", "Draft handover"],
  finance: ["Outstanding invoices", "Overdue accounts", "Revenue this month"],
  guardian: ["How is Nimal?", "Next appointment", "My invoice"],
};

function reply(q: string, role: Role, residents: ReturnType<typeof useApp>["residents"]): Msg {
  const s = q.toLowerCase();
  const guardian = role === "guardian";
  if (guardian && /(meds|medication|clinical|record|diagnos)/.test(s)) return { from: "sage", text: "I can't share clinical records. Please message the care team from the Messages tab, or ask about wellbeing, appointments and invoices." };
  if (/occup|vacan|room/.test(s)) {
    const v = ROOMS.filter((r) => r.status === "vacant").map((r) => r.name).join(", ");
    return { from: "sage", text: `${ROOMS.filter((r) => r.status === "occupied").length} of ${ROOMS.length} rooms are occupied. Vacant: ${v}.`, card: "rooms" };
  }
  if (/med|pill/.test(s)) return { from: "sage", text: `${residents.flatMap((r) => r.meds.filter((m) => m.status === "due")).length} doses are due. One Levodopa dose (Sita) was missed and escalated.` };
  if (/outstanding|overdue|invoice|bill|pay|revenue/.test(s)) return { from: "sage", text: guardian ? "The November invoice is paid. Thank you." : "Outstanding: LKR 462,000 across 4 invoices. One overdue: INV-1098 (Kamala Silva, LKR 83,000). I can draft payment reminders for approval." };
  if (/incident|fall/.test(s)) return { from: "sage", text: "2 incidents are open: INC-041 fall (Onyx, high) under review, and INC-040 medication (Amber), action taken." };
  if (/incomplete|registration/.test(s)) return { from: "sage", text: "2 registrations are incomplete: Zeenath Marikar (missing power of attorney) and Lalith Fernando (agreement unsigned)." };
  if (/diet|food|eat/.test(s)) return { from: "sage", text: "Nimal: diabetic diet. Allergy: penicillin. Prefers milk tea." };
  if (/handover|shift/.test(s)) return { from: "sage", text: "Handover draft is ready in ONE Care → Handover. Please review before submitting." };
  if (/task/.test(s)) return { from: "sage", text: "3 tasks left for Nimal: toileting round, afternoon walk, evening rest." };
  if (/appoint|doctor/.test(s)) return { from: "sage", text: "Cardiology on Friday at 10:30, Lanka Hospitals. A caregiver will escort him." };
  if (/how|mood/.test(s)) return { from: "sage", text: "Nimal is content today. Breakfast eaten, garden walk done. Music hour at 3 pm." };
  if (/falls/.test(s)) return { from: "sage", text: "Falls risk: Kamala Silva (high, fall today), Fathima Rizwan (medium), Sita Fernando (high)." };
  return { from: "sage", text: "I can retrieve approved information and prepare drafts for review. I can't change clinical instructions, approve payments or decide admissions." };
}

export default function Sage() {
  const { user, residents, toast, log } = useApp();
  const role = user?.role ?? "guardian";
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "sage", text: `Hello ${user?.name.split(" ")[0]}. How can I help?` }]);
  const [typing, setTyping] = useState(false);
  const [v, setV] = useState("");
  const [queue, setQueue] = useState(SAGE_QUEUE);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing]);
  const approver = ["director", "manager", "nurse"].includes(role);

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setV("");
    setTyping(true);
    log("SAGE answered a query", t, true);
    setTimeout(() => { setMsgs((m) => [...m, reply(t, role, residents)]); setTyping(false); }, 800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex h-[calc(100vh-170px)] min-h-[480px] flex-col">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-white"><Sparkles /></span>
          <div><h1 className="text-2xl font-semibold tracking-wider text-forest">SAGE</h1><div className="text-xs font-semibold text-mute">Answers are limited to what your role may see</div></div>
        </div>
        <div className="card mt-4 flex-1 space-y-3 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium" style={m.from === "me" ? { background: "var(--forest)", color: "#fff", borderBottomRightRadius: 4 } : { background: "var(--sand)", color: "var(--forest)", borderBottomLeftRadius: 4 }}>
                {m.text}
                {m.card === "rooms" && <div className="mt-3 flex gap-1">{ROOMS.map((r) => <span key={r.id} title={r.name} className="h-5 flex-1 rounded" style={{ background: r.status === "occupied" ? "#0e8a9a" : r.status === "vacant" ? "#cbd6db" : r.status === "reserved" ? "#e0a02b" : "#c2395a" }} />)}</div>}
              </div>
            </div>
          ))}
          {typing && <div className="flex w-fit gap-1 rounded-2xl bg-sand px-4 py-4">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-gold" style={{ animationDelay: `${i * 120}ms` }} />)}</div>}
          <div ref={end} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">{SUGGEST[role].map((s) => <button key={s} onClick={() => send(s)} className="chip shrink-0" data-on="false">{s}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); send(v); }} className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-white p-2 pl-4 shadow-sm">
          <input className="flex-1 bg-transparent text-sm outline-none" placeholder="Ask SAGE" value={v} onChange={(e) => setV(e.target.value)} />
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg bg-sand text-forest"><Mic size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-lg bg-forest text-white"><Send size={18} /></button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="card p-5">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-mute">What SAGE may do</div>
          {[[Search, "Retrieve", "Approved information, summaries", "#2f7d5c"], [FilePen, "Prepare", "Quotes, messages, bookings for review", "#0e8a9a"], [ShieldOff, "Never alone", "Clinical orders, medication, pricing, admission", "#b02a4a"]].map(([I, t, d, c]) => {
            const Ic = I as typeof Search;
            return <div key={t as string} className="flex items-center gap-3 border-t border-line py-3 first:border-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: c as string }}><Ic size={16} /></span><div className="text-sm font-semibold text-forest">{t as string}<div className="text-xs font-medium text-mute">{d as string}</div></div></div>;
          })}
        </div>

        {role !== "guardian" && (
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-mute">Awaiting approval</span><Pill tone="amber">{queue.length}</Pill></div>
            {queue.length === 0 && <div className="py-4 text-center text-sm text-mute">All caught up</div>}
            <div className="space-y-3">
              {queue.map((q) => (
                <div key={q.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center gap-2"><Pill tone="teal">{q.kind}</Pill><span className="text-[11px] font-semibold text-mute">{q.for}</span></div>
                  <div className="mt-2 text-sm font-semibold text-forest">{q.title}</div>
                  <div className="text-xs text-mute">{q.detail}</div>
                  {approver ? (
                    <div className="mt-3 flex gap-2">
                      <button className="btn btn-primary !px-3 !py-1.5 text-xs" onClick={() => { setQueue((p) => p.filter((x) => x.id !== q.id)); log(`Approved SAGE draft: ${q.kind}`, q.title); toast(`${q.kind} approved and sent`); }}><Check size={14} /> Approve</button>
                      <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => { setQueue((p) => p.filter((x) => x.id !== q.id)); log(`Rejected SAGE draft: ${q.kind}`, q.title); toast("Draft rejected"); }}><X size={14} /> Reject</button>
                    </div>
                  ) : <div className="mt-2 text-xs font-semibold text-mute">Needs manager or nurse approval</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
