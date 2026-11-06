"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { ROOMS } from "@/lib/data";

type Msg = { from: "me" | "sage"; text: string; card?: "rooms" | "meds" };

const SUGGEST: Record<string, string[]> = {
  director: ["Occupancy?", "Who is vacant?", "Meds due"],
  nurse: ["Meds due", "Nimal's diet?", "Handover"],
  guardian: ["How is Nimal?", "Next appointment", "My invoice"],
};

function reply(q: string, residents: ReturnType<typeof useApp>["residents"]): Msg {
  const s = q.toLowerCase();
  if (/occup|vacan|room/.test(s)) {
    const v = ROOMS.filter((r) => r.status === "vacant").map((r) => r.name).join(", ");
    return { from: "sage", text: `${ROOMS.filter((r) => r.status === "occupied").length} of ${ROOMS.length} rooms occupied. Vacant: ${v}.`, card: "rooms" };
  }
  if (/med|pill/.test(s)) {
    const n = residents.flatMap((r) => r.meds.filter((m) => m.status === "due")).length;
    return { from: "sage", text: `${n} doses are due today. One Levodopa dose for Sita was missed.`, card: "meds" };
  }
  if (/diet|food|eat/.test(s)) return { from: "sage", text: "Nimal: diabetic diet. Allergy: penicillin. Prefers milk tea." };
  if (/handover|shift/.test(s)) return { from: "sage", text: "Draft handover ready: 1 missed dose (Sita), Kamala falls-risk, all baths done. Review before sending." };
  if (/appoint|doctor/.test(s)) return { from: "sage", text: "Cardiology on Friday at 10:30. A caregiver will escort him." };
  if (/invoice|bill|pay/.test(s)) return { from: "sage", text: "November invoice is paid." };
  if (/how|nimal|mood/.test(s)) return { from: "sage", text: "Nimal is happy today. Breakfast eaten, garden walk done. Music hour at 3." };
  return { from: "sage", text: "I can help with rooms, medicines, appointments and updates. Sensitive actions always need a person's approval." };
}

export default function Sage() {
  const { user, residents } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "sage", text: `Hello ${user?.name.split(" ")[0]}` }]);
  const [typing, setTyping] = useState(false);
  const [v, setV] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing]);

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setV("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, reply(t, residents)]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-190px)] max-w-2xl flex-col md:h-[calc(100vh-130px)]">
      <div className="flex items-center gap-4">
        <div className="relative">
          
          <div className="relative grid h-14 w-14 place-items-center rounded-full bg-gold text-white"><Sparkles /></div>
        </div>
        <h1 className="text-4xl font-semibold tracking-wider text-forest">SAGE</h1>
      </div>

      <div className="card mt-5 flex-1 space-y-3 overflow-y-auto p-5">
        {msgs.map((m, i) => (
          <div key={i} className={`pop flex ${m.from === "me" ? "justify-end" : ""}`}>
            <div className="max-w-[85%] rounded-3xl px-4 py-3 text-sm font-semibold" style={m.from === "me" ? { background: "var(--forest)", color: "#fff", borderBottomRightRadius: 6 } : { background: "var(--sand)", color: "var(--forest)", borderBottomLeftRadius: 6 }}>
              {m.text}
              {m.card === "rooms" && (
                <div className="mt-3 flex gap-1">
                  {ROOMS.map((r) => <span key={r.id} title={r.name} className="h-6 flex-1 rounded-md" style={{ background: r.status === "occupied" ? "#3f9a76" : r.status === "vacant" ? "#cfc7b4" : r.status === "reserved" ? "#e0a02b" : "#c2395a" }} />)}
                </div>
              )}
              {m.card === "meds" && (
                <div className="mt-3 flex gap-1.5">{["#3f9a76", "#3f9a76", "#e0a02b", "#e0a02b", "#c2395a"].map((c, i) => <span key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />)}</div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 rounded-3xl bg-sand px-4 py-4 w-fit">
            {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-gold" style={{ animationDelay: `${i * 120}ms` }} />)}
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {SUGGEST[user?.role ?? "guardian"].map((s) => <button key={s} onClick={() => send(s)} className="chip shrink-0" data-on="false">{s}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(v); }} className="mt-3 flex items-center gap-2 rounded-full border border-line bg-white p-2 pl-5 shadow">
        <input className="flex-1 bg-transparent text-sm outline-none" placeholder="Ask SAGE" value={v} onChange={(e) => setV(e.target.value)} />
        <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-sand text-forest"><Mic size={18} /></button>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white"><Send size={18} /></button>
      </form>
    </div>
  );
}
