"use client";
import { useEffect, useState } from "react";
import { BellRing, Check, Mic, Video } from "lucide-react";
import { PageHead, Pill } from "@/components/kit";
import { Avatar, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";

type Req = { id: number; room: string; resident: string; at: string; state: "New" | "Acknowledged" | "Escalated" | "Resolved"; secs: number };

export default function SmartRoom() {
  const { residents, toast, log } = useApp();
  const r = residents.find((x) => x.id === "r1")!;
  const [reqs, setReqs] = useState<Req[]>([]);
  const [mic, setMic] = useState(false);
  const [heard, setHeard] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setReqs((p) => p.map((x) => (x.state === "New" ? (x.secs + 1 >= 20 ? { ...x, secs: x.secs + 1, state: "Escalated" } : { ...x, secs: x.secs + 1 }) : x)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const request = () => {
    setReqs((p) => [{ id: Date.now(), room: "Jade", resident: r.preferred, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), state: "New", secs: 0 }, ...p]);
    log("Assistance request raised", `Jade · ${r.preferred}`); toast("Staff notified");
  };
  const set = (id: number, state: Req["state"]) => { setReqs((p) => p.map((x) => (x.id === id ? { ...x, state } : x))); log(`Assistance request ${state.toLowerCase()}`, "Jade"); };
  const voice = () => {
    setMic(true); setHeard("");
    setTimeout(() => { setHeard("What is for lunch today?"); }, 900);
    setTimeout(() => { setMic(false); }, 2200);
  };

  const hour = now.getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <PageHead title="Smart room" sub="SAGE Room simulation: what the resident's TV / bedside tablet shows, and how staff are alerted" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="rounded-[1.5rem] border-[10px] border-[#14262d] bg-gradient-to-br from-forest to-forest2 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/70">Jade · {now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</div>
                <div className="mt-1 text-3xl font-semibold">{greet}, {r.preferred.split(" ")[0]}</div>
              </div>
              <div className="text-4xl font-semibold tabular-nums">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["Utensils", "Lunch", "12:30"], ["Music", "Music hour", "15:00"], ["Stethoscope", "Cardiology", "Fri 10:30"], ["Phone", "Sunil calling", "Tonight"]].map(([ic, t, w]) => (
                <div key={t} className="rounded-xl bg-white/10 p-3.5 backdrop-blur">
                  <Icon name={ic} size={20} className="text-gold2" />
                  <div className="mt-2 text-sm font-semibold">{t}</div>
                  <div className="text-xs text-white/60">{w}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={request} className="flex items-center gap-2 rounded-xl bg-[#e0566f] px-5 py-3 text-sm font-bold"><BellRing size={18} /> Call for assistance</button>
              <button onClick={voice} className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-bold"><Mic size={18} /> Ask SAGE</button>
              <button onClick={() => toast("Video call requested")} className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-bold"><Video size={18} /> Video call</button>
            </div>
            {(mic || heard) && (
              <div className="mt-5 rounded-xl bg-white/10 p-4 text-sm">
                {mic && !heard && <div className="flex items-center gap-2 text-gold2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#e0566f]" /> Listening…</div>}
                {heard && <><div className="text-white/60">“{heard}”</div><div className="mt-1 font-semibold">Today&apos;s lunch is rice and curry with dhal and a fruit salad.</div></>}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-mute">
            <Pill tone="green">Mic: on request only</Pill><Pill tone="green">Camera off</Pill><Pill tone="teal">No continuous recording</Pill>
          </div>
        </div>

        <div className="card h-fit p-6">
          <div className="mb-1 font-semibold text-forest">Staff assistance feed</div>
          <p className="mb-4 text-xs text-mute">Unacknowledged requests escalate after 20 seconds. Supplements, never replaces, the emergency call system.</p>
          {reqs.length === 0 && <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-mute">Press “Call for assistance” on the room screen</div>}
          <div className="space-y-3">
            {reqs.map((q) => (
              <div key={q.id} className="rounded-xl border p-4" style={{ borderColor: q.state === "Escalated" ? "#c2395a" : "var(--line)", background: q.state === "Escalated" ? "#fff6f8" : "#fff" }}>
                <div className="flex items-center gap-3">
                  <Avatar name={q.resident} hue="#3f9a76" size={36} />
                  <div className="flex-1 text-sm font-semibold text-forest">{q.room} · {q.resident}<div className="text-xs font-medium text-mute">{q.at}{q.state === "New" ? ` · escalates in ${20 - q.secs}s` : ""}</div></div>
                  <Pill tone={q.state === "Resolved" ? "green" : q.state === "Escalated" ? "red" : q.state === "Acknowledged" ? "blue" : "amber"}>{q.state}</Pill>
                </div>
                {q.state !== "Resolved" && (
                  <div className="mt-3 flex gap-2">
                    {(q.state === "New" || q.state === "Escalated") && <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => set(q.id, "Acknowledged")}>Acknowledge</button>}
                    {q.state === "Acknowledged" && <button className="btn btn-gold !px-4 !py-1.5 text-xs" onClick={() => set(q.id, "Resolved")}><Check size={14} /> Resolve</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
