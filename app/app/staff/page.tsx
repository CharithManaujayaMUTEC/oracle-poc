"use client";
import { useState } from "react";
import { Phone } from "lucide-react";
import { PageHead, Pill, Tabs, Tone } from "@/components/kit";
import { Avatar } from "@/components/ui";
import { useApp } from "@/lib/store";
import { LEAVE, STAFF } from "@/lib/mock";

type Tab = "directory" | "roster" | "training" | "leave";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SHIFT: Record<string, { l: string; bg: string; fg: string }> = {
  M: { l: "Morning", bg: "#fcefce", fg: "#a5741a" },
  E: { l: "Evening", bg: "#efe6d2", fg: "#7a5f2e" },
  N: { l: "Night", bg: "#e4e1f4", fg: "#5a4fa0" },
  O: { l: "Off", bg: "var(--sand)", fg: "#9A9A8C" },
  L: { l: "Leave", bg: "#fbe0e7", fg: "#b02a4a" },
};
const DEPT_TONE: Record<string, string> = { Management: "#023C2E", Nursing: "#B08D57", Care: "#3f9a76", Wellness: "#6b7a99", Admin: "#B08D57" };

const daysLeft = (d: string) => Math.round((new Date(d).getTime() - Date.now()) / 86400000);

export default function Staff() {
  const { toast, log } = useApp();
  const [tab, setTab] = useState<Tab>("directory");
  const [roster, setRoster] = useState(STAFF.map((s) => s.roster));
  const [leave, setLeave] = useState(LEAVE);
  const today = (new Date().getDay() + 6) % 7;

  const cycle = (si: number, di: number) => {
    const order = ["M", "E", "N", "O"];
    setRoster((p) => p.map((r, i) => (i === si ? r.map((x, j) => (j === di ? order[(order.indexOf(x) + 1) % 4] : x)) : r)));
  };
  const expiring = STAFF.flatMap((s) => s.training.map((t) => ({ s, t, d: daysLeft(t.exp) }))).sort((a, b) => a.d - b.d);

  return (
    <div>
      <PageHead title="Staff" sub="Profiles, scheduling and compliance" />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "directory", label: "Directory", icon: "IdCard" },
        { id: "roster", label: "Roster", icon: "CalendarRange" },
        { id: "training", label: "Training & compliance", icon: "GraduationCap", badge: expiring.filter((e) => e.d < 30).length },
        { id: "leave", label: "Leave", icon: "Plane", badge: leave.filter((l) => l.status === "Pending").length },
      ]} />

      {tab === "directory" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {STAFF.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-center gap-4">
                <Avatar name={s.name} hue={DEPT_TONE[s.dept]} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-forest">{s.name}</div>
                  <div className="text-sm font-semibold text-gold">{s.role}</div>
                  <div className="text-xs text-mute">{s.dept} · {s.facility}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">{s.quals.map((q) => <span key={q} className="rounded-md bg-sand px-2 py-0.5 text-[11px] font-semibold text-forest2">{q}</span>)}</div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs font-semibold text-mute">
                <span className="flex items-center gap-1.5"><Phone size={13} />{s.phone}</span>
                <Pill tone={["M", "E", "N"].includes(s.roster[today]) ? "green" : "gray"}>{["M", "E", "N"].includes(s.roster[today]) ? "On duty" : "Off"}</Pill>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "roster" && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line bg-cream text-left text-[11px] font-bold uppercase tracking-wider text-mute">
                <th className="px-5 py-3">Staff</th>
                {DAYS.map((d, i) => <th key={d} className="px-2 py-3 text-center" style={i === today ? { color: "var(--gold)" } : {}}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {STAFF.map((s, si) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-2.5"><div className="font-semibold text-forest">{s.name}</div><div className="text-xs text-mute">{s.role}</div></td>
                  {roster[si].map((x, di) => (
                    <td key={di} className="px-1.5 py-2 text-center">
                      <button onClick={() => { cycle(si, di); log("Changed shift", `${s.name} · ${DAYS[di]}`); }} className="w-full rounded-md py-1.5 text-xs font-bold transition-transform hover:scale-105" style={{ background: SHIFT[x].bg, color: SHIFT[x].fg }} title="Click to change shift">{x === "O" ? "—" : SHIFT[x].l.slice(0, 3)}</button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap gap-4 border-t border-line px-5 py-3 text-xs font-semibold text-mute">
            {Object.entries(SHIFT).map(([k, v]) => <span key={k} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded" style={{ background: v.bg, border: `1px solid ${v.fg}` }} />{v.l}</span>)}
            <span className="ml-auto">Click a cell to change the shift</span>
          </div>
        </div>
      )}

      {tab === "training" && (
        <div className="card divide-y divide-line overflow-hidden">
          {expiring.map(({ s, t, d }) => {
            const tone: Tone = d < 0 ? "red" : d < 30 ? "amber" : "green";
            return (
              <div key={s.id + t.n} className="flex items-center gap-4 px-5 py-3.5">
                <Avatar name={s.name} hue={DEPT_TONE[s.dept]} size={38} />
                <div className="min-w-0 flex-1 text-sm font-semibold text-forest">{s.name}<div className="text-xs font-medium text-mute">{t.n}</div></div>
                <div className="text-xs font-semibold text-mute">expires {t.exp}</div>
                <Pill tone={tone}>{d < 0 ? `Expired ${-d}d ago` : `${d} days left`}</Pill>
                {d < 30 && <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => toast(`Reminder sent to ${s.name.split(" ")[0]}`)}>Remind</button>}
              </div>
            );
          })}
        </div>
      )}

      {tab === "leave" && (
        <div className="card divide-y divide-line overflow-hidden">
          {leave.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <Avatar name={l.who} hue="#046A4E" size={38} />
              <div className="flex-1 text-sm font-semibold text-forest">{l.who}<div className="text-xs font-medium text-mute">{l.dates} · {l.type}</div></div>
              <Pill tone={l.status === "Approved" ? "green" : l.status === "Declined" ? "red" : "amber"}>{l.status}</Pill>
              {l.status === "Pending" && (
                <div className="flex gap-2">
                  <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => { setLeave((p) => p.map((x) => (x.id === l.id ? { ...x, status: "Approved" } : x))); toast("Leave approved"); log("Approved leave", l.who); }}>Approve</button>
                  <button className="btn btn-ghost !px-4 !py-1.5 text-xs" onClick={() => { setLeave((p) => p.map((x) => (x.id === l.id ? { ...x, status: "Declined" } : x))); toast("Leave declined"); log("Declined leave", l.who); }}>Decline</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
