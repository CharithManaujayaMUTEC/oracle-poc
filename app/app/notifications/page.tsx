"use client";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageHead, Pill, Tabs, Tone } from "@/components/kit";
import { useApp } from "@/lib/store";

type Tab = "all" | "Critical" | "High" | "Normal";
const TONE: Record<string, Tone> = { Critical: "red", High: "amber", Normal: "gray" };

export default function Notifications() {
  const { notifs, ack, toast, log } = useApp();
  const [tab, setTab] = useState<Tab>("all");
  const list = notifs.filter((n) => tab === "all" || n.pri === tab);
  const pending = (p: string) => notifs.filter((n) => n.pri === p && !n.ack).length;

  return (
    <div>
      <PageHead title="Alerts" sub="Critical alerts must be acknowledged, or they escalate" />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "all", label: "All" },
        { id: "Critical", label: "Critical", badge: pending("Critical") },
        { id: "High", label: "High", badge: pending("High") },
        { id: "Normal", label: "Normal" },
      ]} />
      <div className="card divide-y divide-line overflow-hidden">
        {list.map((n) => (
          <div key={n.id} className="flex flex-wrap items-center gap-4 px-5 py-4" style={{ opacity: n.ack ? 0.6 : 1, background: n.pri === "Critical" && !n.ack ? "var(--crit-bg)" : undefined }}>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: n.ack ? "#BDBBAE" : n.pri === "Critical" ? "#c2395a" : n.pri === "High" ? "#e0a02b" : "#B08D57" }} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-forest">{n.title}</div>
              <div className="text-xs text-mute">{n.mod} · {n.when}</div>
            </div>
            <Pill tone={TONE[n.pri]}>{n.pri}</Pill>
            <Link href={n.href} className="text-xs font-bold text-gold">Open</Link>
            {n.ack ? <span className="flex items-center gap-1 text-xs font-semibold text-mute"><Check size={14} />Acknowledged</span> : <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => { ack(n.id); log("Acknowledged alert", n.title); toast("Alert acknowledged"); }}>Acknowledge</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
