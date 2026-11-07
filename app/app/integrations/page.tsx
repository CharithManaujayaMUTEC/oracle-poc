"use client";
import { useState } from "react";
import { PageHead, Pill } from "@/components/kit";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";

const INTEGRATIONS = [
  { id: "wa", n: "WhatsApp Business", i: "MessageCircle", d: "Guardian updates & enquiries", on: true, tone: "#2f7d5c" },
  { id: "em", n: "Email", i: "Mail", d: "Invoices, invitations, reports", on: true, tone: "#B08D57" },
  { id: "push", n: "Push notifications", i: "BellRing", d: "ONE Care & ONE Family apps", on: true, tone: "#023C2E" },
  { id: "sms", n: "SMS", i: "Smartphone", d: "Fallback where required", on: false, tone: "#8a6c3a" },
  { id: "vid", n: "Video calling", i: "Video", d: "Resident ↔ family calls", on: false, tone: "#046A4E" },
  { id: "flash", n: "Flash Health", i: "Pill", d: "Pharmacy orders & delivery tracking", on: true, tone: "#B08D57" },
  { id: "pay", n: "Payment gateway", i: "CreditCard", d: "Online invoice payment", on: false, tone: "#023C2E" },
  { id: "tv", n: "Smart TV / voice devices", i: "Tv", d: "SAGE Room hardware", on: false, tone: "#090A09" },
];

const WORKFLOWS = [
  "New enquiry notification", "Admission reminders", "Guardian invitations", "Appointment reminders", "Approved family updates",
  "Payment reminders", "Subscription renewals", "Incident escalation", "Weekly management report",
];

export default function Integrations() {
  const { toast, log } = useApp();
  const [items, setItems] = useState(INTEGRATIONS);
  const [wf, setWf] = useState<Record<string, boolean>>(Object.fromEntries(WORKFLOWS.map((w, i) => [w, i % 4 !== 3])));

  return (
    <div>
      <PageHead title="Integrations" sub="Channels, partners and automation. External messages follow approval rules." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((x) => (
          <div key={x.id} className="card flex flex-col p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: x.tone }}><Icon name={x.i} size={22} /></span>
              <Pill tone={x.on ? "green" : "gray"}>{x.on ? "Connected" : "Not connected"}</Pill>
            </div>
            <div className="mt-4 font-semibold text-forest">{x.n}</div>
            <div className="text-xs text-mute">{x.d}</div>
            <button className={`btn mt-4 ${x.on ? "btn-ghost" : "btn-primary"}`} onClick={() => { setItems((p) => p.map((y) => (y.id === x.id ? { ...y, on: !y.on } : y))); log(x.on ? "Disconnected integration" : "Connected integration", x.n); toast(x.on ? `${x.n} disconnected` : `${x.n} connected`); }}>{x.on ? "Disconnect" : "Connect"}</button>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <div className="mb-4 font-semibold text-forest">Automated workflows</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOWS.map((w) => (
            <button key={w} onClick={() => setWf({ ...wf, [w]: !wf[w] })} className="flex items-center gap-3 rounded-lg bg-cream p-3 text-left">
              <span className="relative h-6 w-11 shrink-0 rounded-full transition-colors" style={{ background: wf[w] ? "#B08D57" : "#D4D2C6" }}><span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: wf[w] ? 22 : 2 }} /></span>
              <span className="text-sm font-semibold text-forest">{w}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
