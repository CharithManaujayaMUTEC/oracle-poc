"use client";
import { useState } from "react";
import { Banknote } from "lucide-react";
import { Bars, Donut, Field, Modal, PageHead, Pill, Stat, Tabs, Tone } from "@/components/kit";
import { useApp } from "@/lib/store";
import { APPROVALS, INVOICES, Invoice, MONTHS, REVENUE, SUBSCRIPTIONS } from "@/lib/mock";
import { fmt } from "@/lib/data";

type Tab = "overview" | "invoices" | "subs" | "approvals";
const TONE: Record<string, Tone> = { Paid: "green", Due: "amber", Overdue: "red", Partial: "blue" };

export default function Finance() {
  const { user, toast, log } = useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const [inv, setInv] = useState<Invoice[]>(INVOICES);
  const [pay, setPay] = useState<Invoice | null>(null);
  const [amt, setAmt] = useState(0);
  const [method, setMethod] = useState("Bank transfer");
  const [appr, setAppr] = useState(APPROVALS);
  const canApprove = user?.role === "director" || user?.role === "manager";

  const total = inv.reduce((s, i) => s + i.total, 0);
  const paid = inv.reduce((s, i) => s + i.paid, 0);
  const out = total - paid;
  const rev = REVENUE["House 1"].map((v, i) => v + REVENUE["House 2"][i]);

  return (
    <div>
      <PageHead title="Billing" sub="Invoices, payments, subscriptions and approvals" />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "overview", label: "Overview", icon: "ChartPie" },
        { id: "invoices", label: "Invoices", icon: "Receipt" },
        { id: "subs", label: "Subscriptions", icon: "Repeat" },
        { id: "approvals", label: "Approvals", icon: "BadgeCheck", badge: appr.length },
      ]} />

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat icon="Wallet" label="Invoiced" value={`${(total / 1000).toFixed(0)}k`} />
            <Stat icon="CircleCheck" label="Collected" value={`${(paid / 1000).toFixed(0)}k`} tone="green" />
            <Stat icon="Hourglass" label="Outstanding" value={`${(out / 1000).toFixed(0)}k`} tone="amber" />
            <Stat icon="CircleAlert" label="Overdue invoices" value={inv.filter((i) => i.status === "Overdue").length} tone="red" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="card p-6"><div className="mb-4 font-semibold text-forest">Revenue trend (LKR thousands)</div><Bars values={rev} labels={MONTHS} height={170} /></div>
            <div className="card space-y-6 p-6">
              <div><div className="mb-3 text-sm font-semibold text-forest">By facility</div><Donut parts={[{ v: 945, c: "#0b4254", l: "House 1" }, { v: 790, c: "#0e8a9a", l: "House 2" }]} /></div>
              <div><div className="mb-3 text-sm font-semibold text-forest">By source</div><Donut parts={[{ v: 71, c: "#0b4254", l: "Rooms" }, { v: 18, c: "#0e8a9a", l: "Add-ons" }, { v: 11, c: "#b07a2a", l: "Subscriptions" }]} /></div>
            </div>
          </div>
        </div>
      )}

      {tab === "invoices" && (
        <div className="card divide-y divide-line overflow-hidden">
          {inv.map((i) => (
            <div key={i.id} className="grid items-center gap-3 px-5 py-3.5 md:grid-cols-[100px_1.4fr_100px_110px_110px_auto]">
              <div className="text-sm font-semibold text-forest">{i.id}</div>
              <div className="text-sm font-semibold text-forest">{i.resident}<div className="text-xs font-medium text-mute">{i.guardian} · {i.month}</div></div>
              <div className="text-xs font-semibold text-mute">due {i.due}</div>
              <div className="text-sm font-semibold text-forest">{fmt(i.total)}</div>
              <div><Pill tone={TONE[i.status]}>{i.status}</Pill></div>
              <div className="text-right">{i.status !== "Paid" && <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => { setPay(i); setAmt(i.total - i.paid); }}>Record payment</button>}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "subs" && (
        <div className="card divide-y divide-line overflow-hidden">
          {SUBSCRIPTIONS.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="flex-1 text-sm font-semibold text-forest">{s.item}<div className="text-xs font-medium text-mute">{s.resident}</div></div>
              <div className="text-sm font-semibold text-forest">{fmt(s.price)} / mo</div>
              <div className="text-xs font-semibold text-mute">next {s.next}</div>
              <Pill tone={s.status === "Active" ? "green" : "amber"}>{s.status}</Pill>
            </div>
          ))}
        </div>
      )}

      {tab === "approvals" && (
        <div className="space-y-3">
          <div className="rounded-lg bg-[#e0f0f2] p-3 text-xs font-semibold text-forest2">Adjustments, refunds and write-offs need authorisation and are recorded in the audit trail.</div>
          {appr.length === 0 && <div className="card p-10 text-center text-sm text-mute">Nothing waiting for approval</div>}
          {appr.map((a) => (
            <div key={a.id} className="card flex flex-wrap items-center gap-4 p-5">
              <Pill tone="amber">{a.type}</Pill>
              <div className="flex-1 text-sm font-semibold text-forest">{a.what}<div className="text-xs font-medium text-mute">requested by {a.by}</div></div>
              <div className="font-semibold text-forest">{fmt(a.amount)}</div>
              {canApprove ? (
                <div className="flex gap-2">
                  <button className="btn btn-primary !px-4 !py-1.5 text-xs" onClick={() => { setAppr((p) => p.filter((x) => x.id !== a.id)); log(`Approved ${a.type.toLowerCase()}`, a.what); toast(`${a.type} approved`); }}>Approve</button>
                  <button className="btn btn-ghost !px-4 !py-1.5 text-xs" onClick={() => { setAppr((p) => p.filter((x) => x.id !== a.id)); log(`Rejected ${a.type.toLowerCase()}`, a.what); toast(`${a.type} rejected`); }}>Reject</button>
                </div>
              ) : <span className="text-xs font-semibold text-mute">Awaiting manager / director</span>}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!pay} onClose={() => setPay(null)} title={`Record payment · ${pay?.id ?? ""}`}>
        {pay && (
          <div className="space-y-4">
            <div className="text-sm text-mute">{pay.resident} · balance {fmt(pay.total - pay.paid)}</div>
            <Field label="Amount received (LKR)"><input type="number" className="input" value={amt} onChange={(e) => setAmt(+e.target.value)} /></Field>
            <Field label="Method"><select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>{["Bank transfer", "Cash", "Card", "Cheque", "Online gateway"].map((m) => <option key={m}>{m}</option>)}</select></Field>
            <button className="btn btn-primary w-full" onClick={() => {
              setInv((p) => p.map((x) => { if (x.id !== pay.id) return x; const np = Math.min(x.total, x.paid + amt); return { ...x, paid: np, status: np >= x.total ? "Paid" : "Partial" }; }));
              log(`Recorded payment ${fmt(amt)} (${method})`, pay.id); toast("Payment recorded · receipt generated"); setPay(null);
            }}><Banknote size={16} /> Record & issue receipt</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
