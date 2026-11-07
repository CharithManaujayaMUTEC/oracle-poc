"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bars, PageHead, Pill, Stat } from "@/components/kit";
import { Avatar, Gem, Icon, Ring } from "@/components/ui";
import { HOME } from "@/lib/nav";
import { useApp } from "@/lib/store";
import { APPOINTMENTS, ADMISSIONS, INCIDENTS, INVOICES, MONTHS, REVENUE, STAFF, SUBSCRIPTIONS } from "@/lib/mock";
import { ROOMS, fmt } from "@/lib/data";

export default function Dashboard() {
  const { user, residents } = useApp();
  const router = useRouter();
  const [fac, setFac] = useState<"All" | "House 1" | "House 2">("All");

  useEffect(() => {
    if (user && !["director", "manager"].includes(user.role)) router.replace(HOME[user.role]);
  }, [user, router]);
  if (!user || !["director", "manager"].includes(user.role)) return null;

  const rooms = ROOMS.filter((r) => fac === "All" || `House ${r.house}` === fac);
  const occ = rooms.filter((r) => r.status === "occupied").length;
  const free = rooms.filter((r) => r.status === "vacant").length;
  const medsDue = residents.flatMap((r) => r.meds.filter((m) => m.status === "due" || m.status === "missed")).length;
  const openInc = INCIDENTS.filter((i) => i.status !== "Closed").length;
  const inv = INVOICES.filter((i) => fac === "All" || i.facility === fac);
  const outstanding = inv.reduce((s, i) => s + (i.total - i.paid), 0);
  const rev = fac === "All" ? REVENUE["House 1"].map((v, i) => v + REVENUE["House 2"][i]) : REVENUE[fac];
  const onDuty = STAFF.filter((s) => ["M", "E", "N"].includes(s.roster[(new Date().getDay() + 6) % 7]) && (fac === "All" || s.facility === fac || s.facility === "All")).length;
  const subs = SUBSCRIPTIONS.reduce((s, x) => s + x.price, 0);
  const addons = inv.reduce((s, i) => s + i.addons, 0);

  return (
    <div className="space-y-6">
      <PageHead
        title="Dashboard"
        sub="Organisation overview"
        actions={(["All", "House 1", "House 2"] as const).map((f) => <button key={f} onClick={() => setFac(f)} className="chip" data-on={fac === f}>{f === "All" ? "All facilities" : f}</button>)}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Users" label="Residents" value={fac === "All" ? residents.length : residents.filter((r) => `House ${ROOMS.find((x) => x.id === r.room)?.house}` === fac).length} sub="in care" />
        <div className="card flex items-center gap-4 p-5">
          <Ring value={(occ / rooms.length) * 100} size={56} stroke={7} color="#B08D57" />
          <div><div className="text-2xl font-semibold text-forest">{occ}/{rooms.length}</div><div className="text-xs font-semibold text-mute">Occupied · {free} available</div></div>
        </div>
        <Stat icon="Pill" label="Medication exceptions" value={medsDue} tone="amber" />
        <Stat icon="Siren" label="Open incidents" value={openInc} tone="red" />
        <Stat icon="UserCheck" label="Staff on duty" value={onDuty} tone="green" />
        <Stat icon="ClipboardList" label="Upcoming admissions" value={ADMISSIONS.length} tone="blue" />
        <Stat icon="CalendarDays" label="Appointments this week" value={APPOINTMENTS.length} tone="teal" />
        <Stat icon="FileWarning" label="Assessments outstanding" value={2} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold text-forest">Monthly revenue (LKR thousands)</div>
            <Link href="/app/reports" className="text-xs font-bold text-gold">Reports →</Link>
          </div>
          <Bars values={rev} labels={MONTHS} height={170} />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            {[["Outstanding", fmt(outstanding)], ["Subscriptions", fmt(subs)], ["Add-ons", fmt(addons)]].map(([l, v]) => (
              <div key={l}><div className="text-[11px] font-bold uppercase tracking-wider text-mute">{l}</div><div className="text-sm font-semibold text-forest">{v}</div></div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 font-semibold text-forest">Rooms</div>
          {[1, 2].filter((h) => fac === "All" || fac === `House ${h}`).map((h) => (
            <div key={h} className="mb-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-mute">House {h}</div>
              <div className="grid grid-cols-5 gap-1.5">
                {ROOMS.filter((r) => r.house === h).map((r) => (
                  <Link href="/app/rooms" key={r.id} title={`${r.name} · ${r.status}`} className="relative rounded-lg p-1.5 text-center" style={{ background: r.soft, opacity: r.status === "vacant" ? 0.55 : 1 }}>
                    <Gem color={r.color} size={30} />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full" style={{ background: { occupied: "#3f9a76", vacant: "#BDBBAE", reserved: "#e0a02b", maintenance: "#c2395a" }[r.status] }} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-mute">
            {[["Occupied", "#3f9a76"], ["Vacant", "#BDBBAE"], ["Reserved", "#e0a02b"], ["Maintenance", "#c2395a"]].map(([l, c]) => <span key={l} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between"><span className="font-semibold text-forest">Open incidents</span><Link href="/app/incidents" className="text-xs font-bold text-gold">All →</Link></div>
          <div className="space-y-3">
            {INCIDENTS.filter((i) => i.status !== "Closed").map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg tone-red tint"><Icon name="Siren" size={18} /></span>
                <div className="min-w-0 flex-1 text-sm font-semibold text-forest">{i.type} · {i.resident}<div className="text-xs font-medium text-mute">{i.date}</div></div>
                <Pill tone={i.severity === "High" ? "red" : "amber"}>{i.severity}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between"><span className="font-semibold text-forest">Upcoming admissions</span><Link href="/app/admissions" className="text-xs font-bold text-gold">All →</Link></div>
          <div className="space-y-4">
            {ADMISSIONS.map((a) => (
              <div key={a.id}>
                <div className="flex items-center justify-between text-sm font-semibold text-forest"><span>{a.client}</span><span className="text-xs text-mute">{a.room} · {a.due}</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-sand"><div className="h-full rounded-full bg-gold" style={{ width: `${((a.step + 1) / 12) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between"><span className="font-semibold text-forest">Appointments</span><Link href="/app/appointments" className="text-xs font-bold text-gold">All →</Link></div>
          <div className="space-y-3">
            {APPOINTMENTS.slice(0, 4).map((a) => {
              const r = residents.find((x) => x.name === a.resident);
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <Avatar name={a.resident} hue={r?.hue ?? "#046A4E"} size={38} />
                  <div className="min-w-0 flex-1 text-sm font-semibold text-forest">{a.type}<div className="text-xs font-medium text-mute">{a.resident}</div></div>
                  <div className="text-right text-xs font-semibold text-mute">{a.day === 0 ? "Today" : `+${a.day}d`}<br />{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
