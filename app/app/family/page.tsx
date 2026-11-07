"use client";
import { useState } from "react";
import { Check, Lock, Receipt, Send, Video } from "lucide-react";
import { Pill, Tabs } from "@/components/kit";
import { Avatar, Gem, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS, SERVICES, fmt } from "@/lib/data";
import { APPOINTMENTS, INVOICES } from "@/lib/mock";

type Tab = "today" | "messages" | "invoices" | "services" | "visits";

const TIMELINE = [
  { t: "07:30", i: "Sunrise", l: "Woke up, in good spirits" },
  { t: "08:15", i: "Utensils", l: "Breakfast, ate well" },
  { t: "09:00", i: "Pill", l: "Morning medication taken" },
  { t: "10:00", i: "Footprints", l: "Garden walk with carer" },
  { t: "12:30", i: "Utensils", l: "Lunch, diabetic menu" },
  { t: "15:00", i: "Music", l: "Music hour in the lounge" },
];

export default function Family() {
  const { residents, toast, log } = useApp();
  const r = residents.find((x) => x.id === "r1")!;
  const room = ROOMS.find((x) => x.id === r.room)!;
  const [tab, setTab] = useState<Tab>("today");
  const [call, setCall] = useState(false);
  const [req, setReq] = useState<string[]>([]);
  const [msgs, setMsgs] = useState([
    { me: false, t: "Good morning Sunil. Nimal had a good night and enjoyed breakfast.", w: "08:40" },
    { me: true, t: "Thank you. Can we arrange a video call this evening?", w: "09:12" },
    { me: false, t: "Of course. We have booked 6:30 pm for you.", w: "09:20" },
  ]);
  const [draft, setDraft] = useState("");
  const invs = INVOICES.filter((i) => i.resident === r.name);
  const appts = APPOINTMENTS.filter((a) => a.resident === r.name);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { me: true, t: draft, w: "Now" }]);
    log("Guardian message sent", "Management");
    setDraft("");
    toast("Message sent to management");
  };

  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${room.color}33, var(--paper) 75%)` }}>
        <div className="absolute -right-4 -top-4 opacity-30"><Gem color={room.color} size={180} /></div>
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar name={r.name} hue={r.hue} size={80} />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-widest text-gold">ONE Family</div>
            <h1 className="text-3xl font-semibold tracking-tight text-forest">{r.preferred}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-forest"><Icon name={MOODS[r.mood].icon} size={20} style={{ color: MOODS[r.mood].color }} />{MOODS[r.mood].label} today · {room.name}</div>
          </div>
          <button onClick={() => { setCall(true); log("Requested video call", r.name); }} className="btn btn-primary"><Video size={18} /> Video call</button>
        </div>
      </div>

      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "today", label: "Today", icon: "Sun" },
        { id: "messages", label: "Messages", icon: "MessageCircle", badge: 1 },
        { id: "invoices", label: "Invoices", icon: "Receipt" },
        { id: "services", label: "Services", icon: "Sparkles" },
        { id: "visits", label: "Appointments", icon: "CalendarDays" },
      ]} />

      {tab === "today" && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="card p-6">
            <div className="mb-5 flex items-center justify-between"><span className="font-semibold text-forest">Approved daily summary</span><Pill tone="green">Shared by manager</Pill></div>
            <div className="relative space-y-5 pl-1">
              <div className="absolute bottom-3 left-[23px] top-3 w-0.5 bg-line" />
              {TIMELINE.map((x, i) => (
                <div key={i} className="relative flex items-center gap-4">
                  <span className="z-10 grid h-11 w-11 place-items-center rounded-full bg-forest2 text-white ring-4 ring-white"><Icon name={x.i} size={18} /></span>
                  <div className="text-sm font-semibold text-forest">{x.l}</div>
                  <div className="ml-auto text-xs font-semibold text-mute">{x.t}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-mute">Photos</div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => <div key={i} className="grid aspect-square place-items-center rounded-lg bg-sand text-mute"><Icon name="Image" size={20} /></div>)}
              </div>
              <div className="mt-3 text-xs font-semibold text-mute">Only photos approved by the facility appear here.</div>
            </div>
            <div className="card p-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-mute">Your access</div>
              {[["Wellbeing updates", true], ["Appointments", true], ["Invoices", true], ["Clinical records", false], ["Legal documents", false]].map(([l, on]) => (
                <div key={l as string} className="flex items-center justify-between border-t border-line py-2 text-sm font-semibold text-forest first:border-0">{l as string}{on ? <Check size={16} className="text-[#2f7d5c]" /> : <Lock size={15} className="text-mute" />}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="card flex h-[460px] flex-col overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : ""}`}>
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium" style={m.me ? { background: "var(--active)", color: "#fff", borderBottomRightRadius: 4 } : { background: "var(--sand)", color: "var(--fg)", borderBottomLeftRadius: 4 }}>{m.t}<div className="mt-1 text-[10px] opacity-60">{m.w}</div></div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-line p-3">
            <input className="input" placeholder="Message management" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn btn-primary"><Send size={16} /></button>
          </form>
        </div>
      )}

      {tab === "invoices" && (
        <div className="card divide-y divide-line overflow-hidden">
          {invs.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-sage text-forest2"><Receipt size={20} /></span>
              <div className="flex-1 text-sm font-semibold text-forest">{i.id} · {i.month}<div className="text-xs font-medium text-mute">Room {fmt(i.room)} + add-ons {fmt(i.addons)}</div></div>
              <div className="font-semibold text-forest">{fmt(i.total)}</div>
              <Pill tone={i.status === "Paid" ? "green" : "amber"}>{i.status}</Pill>
              <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => toast("Receipt downloaded")}>Receipt</button>
            </div>
          ))}
          <div className="bg-cream px-5 py-3 text-xs font-semibold text-mute">Payment questions? Message management from the Messages tab.</div>
        </div>
      )}

      {tab === "services" && (
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between"><span className="font-semibold text-forest">Request an additional service</span><Pill tone="gray">Manager approves · you agree to the quotation</Pill></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SERVICES.map((s) => {
              const on = req.includes(s.id);
              return (
                <button key={s.id} onClick={() => { if (!on) { setReq([...req, s.id]); log("Guardian requested service", s.name); toast("Request sent to management"); } }} className="flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center" style={{ borderColor: on ? "var(--forest-2)" : "var(--line)", background: on ? "var(--sage)" : "var(--paper)" }}>
                  <Icon name={on ? "Check" : s.icon} size={24} className="text-forest" />
                  <span className="text-[11px] font-semibold leading-tight text-forest">{s.name}</span>
                  <span className="text-[10px] font-semibold text-mute">{on ? "Requested" : `${s.price / 1000}k / mo`}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "visits" && (
        <div className="card divide-y divide-line overflow-hidden">
          {appts.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-sage text-forest2"><Icon name="CalendarDays" size={20} /></span>
              <div className="flex-1 text-sm font-semibold text-forest">{a.type}<div className="text-xs font-medium text-mute">{a.day === 0 ? "Today" : `In ${a.day} days`} · {a.time} · {a.place}</div></div>
              <Pill tone="teal">Escort: {a.staff}</Pill>
            </div>
          ))}
          <div className="px-5 py-3"><button className="btn btn-ghost !py-2 text-sm" onClick={() => { toast("Appointment request sent"); log("Guardian requested appointment", r.name); }}>Request an appointment</button></div>
        </div>
      )}

      {call && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-forest/90 p-6 backdrop-blur" onClick={() => setCall(false)}>
          <div className="text-center">
            <div className="relative mx-auto w-fit"><span className="absolute inset-0 rounded-full bg-gold/40" style={{ animation: "pulse-ring 1.6s infinite" }} /><Avatar name={r.name} hue={r.hue} size={130} /></div>
            <div className="mt-6 text-2xl font-semibold text-white">Calling {r.preferred}…</div>
            <button className="btn mt-8 bg-[#c2395a] text-white">End</button>
          </div>
        </div>
      )}
    </div>
  );
}
