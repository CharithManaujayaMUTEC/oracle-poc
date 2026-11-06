"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle, CalendarHeart, Pill, TrendingUp } from "lucide-react";
import { Avatar, Gem, Icon, Ring } from "@/components/ui";
import { useApp } from "@/lib/store";
import { MOODS, ROOMS, fmt } from "@/lib/data";

const REV = [62, 68, 71, 66, 79, 84, 91];
const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function Dashboard() {
  const { user, residents } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (user?.role === "guardian") router.replace("/app/family");
  }, [user, router]);
  if (!user || user.role === "guardian") return null;

  const occ = ROOMS.filter((r) => r.status === "occupied").length;
  const dueMeds = residents.flatMap((r) => r.meds.filter((m) => m.status === "due"));
  const alerts = residents.flatMap((r) => r.alerts.map((a) => ({ r, a })));
  const max = Math.max(...REV);

  return (
    <div className="space-y-6">
      <div className="fadeup flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gold">Good morning,</div>
          <h1 className="text-4xl font-semibold text-forest">{user.name.split(" ").slice(0, 2).join(" ")}</h1>
        </div>
        <Link href="/app/register" className="btn btn-gold">+ New resident</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card flex items-center gap-4 p-5">
          <Ring value={(occ / ROOMS.length) * 100} color="#3f9a76"><span className="text-xl font-semibold">{occ}/{ROOMS.length}</span></Ring>
          <div className="text-sm font-bold text-forest">Rooms<div className="text-xs font-medium text-mute">occupied</div></div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sage text-forest2"><Pill size={28} /></span>
          <div><div className="text-3xl font-semibold text-forest">{dueMeds.length}</div><div className="text-xs font-semibold text-mute">meds due</div></div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sage text-forest2"><AlertTriangle size={28} /></span>
          <div><div className="text-3xl font-semibold text-forest">{alerts.length}</div><div className="text-xs font-semibold text-mute">alerts</div></div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sage text-forest2"><TrendingUp size={28} /></span>
          <div><div className="text-2xl font-semibold text-forest">{fmt(91 * 10000).replace("LKR ", "")}</div><div className="text-xs font-semibold text-mute">LKR this month</div></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <div className="mb-4 text-xl font-semibold text-forest">Homes</div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2].map((h) => (
              <div key={h}>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-mute">House {h}</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {ROOMS.filter((r) => r.house === h).map((r) => {
                    const res = residents.find((x) => x.room === r.id);
                    return (
                      <Link href="/app/rooms" key={r.id} title={`${r.name} · ${r.status}`} className="relative rounded-xl p-1.5 text-center transition-transform" style={{ background: r.soft, opacity: r.status === "vacant" ? 0.55 : 1 }}>
                        <Gem color={r.color} size={34} />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full" style={{ background: { occupied: "#3f9a76", vacant: "#cfc7b4", reserved: "#e0a02b", maintenance: "#c2395a" }[r.status] }} />
                        <div className="truncate text-[9px] font-bold" style={{ color: r.color }}>{res ? res.preferred.split(" ")[0] : r.name}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold text-mute">
            {[["occupied", "#3f9a76"], ["vacant", "#cfc7b4"], ["reserved", "#e0a02b"], ["repair", "#c2395a"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-semibold text-forest">Revenue</span>
            <span className="chip" data-on="false">LKR 100k</span>
          </div>
          <div className="flex h-40 items-end gap-3">
            {REV.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl transition-all hover:opacity-80" style={{ height: `${(v / max) * 100}%`, background: i === REV.length - 1 ? "linear-gradient(#3bb0bd,#0e8a9a)" : "#dfeadf" }} />
                <span className="text-[10px] font-bold text-mute">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 text-xl font-semibold text-forest">Needs attention</div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map(({ r, a }, i) => (
              <Link href={`/app/residents/${r.id}`} key={i} className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-sand">
                <Avatar name={r.name} hue={r.hue} size={40} />
                <div className="flex-1 text-sm font-bold text-forest">{r.preferred}</div>
                <span className="chip" data-on="false" style={{ color: "#c2395a", borderColor: "#fbe0e7", background: "#fff6f8" }}>{a}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-semibold text-forest">Mood today</span>
            <CalendarHeart className="text-gold" />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
            {residents.slice(0, 6).map((r) => (
              <Link href={`/app/residents/${r.id}`} key={r.id} className="rounded-2xl p-2 text-center transition-transform" style={{ background: MOODS[r.mood].color + "18" }}>
                <Icon name={MOODS[r.mood].icon} size={26} className="mx-auto" style={{ color: MOODS[r.mood].color }} />
                <div className="mt-1 truncate text-[10px] font-bold text-forest">{r.preferred.split(" ")[0]}</div>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Link href="/app/care" className="btn btn-primary flex-1 !py-2.5"><Icon name="Stethoscope" size={16} /> Care round</Link>
            <Link href="/app/sage" className="btn btn-ghost flex-1 !py-2.5"><Icon name="Sparkles" size={16} /> Ask SAGE</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
