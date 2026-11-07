"use client";
import { useMemo, useState } from "react";
import { Check, History, Plus } from "lucide-react";
import { Field, Modal, PageHead, Pill, Tabs } from "@/components/kit";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { CATALOGUE, CatItem } from "@/lib/mock";
import { fmt } from "@/lib/data";

type Tab = "catalogue" | "quote";
const FAC = ["All", "House 1", "House 2"] as const;

export default function Pricing() {
  const { residents, user, toast, log } = useApp();
  const [tab, setTab] = useState<Tab>("catalogue");
  const [fac, setFac] = useState<(typeof FAC)[number]>("All");
  const [items, setItems] = useState<CatItem[]>(CATALOGUE);
  const [edit, setEdit] = useState<CatItem | null>(null);
  const [price, setPrice] = useState(0);
  const canEdit = user?.role === "director" || user?.role === "finance";

  const cats = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const shown = items.filter((i) => fac === "All" || i.facility === "All" || i.facility === fac);

  // quote builder
  const [rid, setRid] = useState(residents[0].id);
  const [base, setBase] = useState("c2");
  const [add, setAdd] = useState<string[]>(["c5"]);
  const [months, setMonths] = useState(12);
  const baseItem = items.find((i) => i.id === base)!;
  const addItems = items.filter((i) => add.includes(i.id));
  const monthly = baseItem.price + addItems.filter((a) => a.billing === "Monthly").reduce((s, a) => s + a.price, 0);
  const disc = months >= 12 ? 0.1 : months >= 6 ? 0.05 : 0;
  const res = residents.find((r) => r.id === rid)!;

  return (
    <div>
      <PageHead title="Pricing & add-ons" sub="Facility-specific catalogue. Price changes never alter existing agreements." />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[{ id: "catalogue", label: "Catalogue", icon: "Tags" }, { id: "quote", label: "Quotation builder", icon: "FileText" }]} />

      {tab === "catalogue" && (
        <>
          <div className="mb-5 flex flex-wrap gap-2">{FAC.map((f) => <button key={f} onClick={() => setFac(f)} className="chip" data-on={fac === f}>{f === "All" ? "All facilities" : f}</button>)}</div>
          {cats.map((c) => (
            <div key={c} className="mb-6">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-mute">{c}</div>
              <div className="card divide-y divide-line overflow-hidden">
                {shown.filter((i) => i.category === c).map((i) => (
                  <div key={i.id} className="grid items-center gap-3 px-5 py-3.5 md:grid-cols-[1.6fr_100px_110px_90px_auto]">
                    <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-sage text-forest2"><Icon name={i.icon} size={18} /></span><div className="text-sm font-semibold text-forest">{i.name}<div className="text-xs font-medium text-mute">{i.facility === "All" ? "All facilities" : i.facility} · {i.tax}</div></div></div>
                    <div className="text-sm font-semibold text-forest">{fmt(i.price)}</div>
                    <div className="text-xs font-semibold text-mute">{i.billing}</div>
                    <div className="flex flex-wrap gap-1">{i.approval && <Pill tone="amber">Approval</Pill>}</div>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setItems((p) => p.map((x) => (x.id === i.id ? { ...x, available: !x.available } : x))); toast(i.available ? "Marked unavailable" : "Marked available"); log("Changed availability", i.name); }} className="chip" data-on={i.available}>{i.available ? "Available" : "Hidden"}</button>
                      {canEdit && <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => { setEdit(i); setPrice(i.price); }}>Edit price</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "quote" && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="card space-y-5 p-6">
            <Field label="Resident / prospect"><select className="input" value={rid} onChange={(e) => setRid(e.target.value)}>{residents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></Field>
            <Field label="Accommodation package">
              <div className="grid gap-2 sm:grid-cols-2">
                {items.filter((i) => i.category === "Accommodation" && i.billing === "Monthly").map((i) => (
                  <button key={i.id} onClick={() => setBase(i.id)} className="rounded-lg border-2 p-3 text-left text-sm font-semibold text-forest" style={{ borderColor: base === i.id ? "var(--forest-2)" : "var(--line)", background: base === i.id ? "var(--sage)" : "var(--paper)" }}>{i.name}<div className="text-xs font-medium text-mute">{fmt(i.price)}</div></button>
                ))}
              </div>
            </Field>
            <Field label="Add-ons">
              <div className="flex flex-wrap gap-2">
                {items.filter((i) => i.category !== "Accommodation" && i.available).map((i) => (
                  <button key={i.id} className="chip" data-on={add.includes(i.id)} onClick={() => setAdd(add.includes(i.id) ? add.filter((x) => x !== i.id) : [...add, i.id])}>{add.includes(i.id) && <Check size={13} />}{i.name}</button>
                ))}
              </div>
            </Field>
            <Field label="Term"><div className="flex gap-2">{[1, 6, 12].map((m) => <button key={m} className="chip" data-on={months === m} onClick={() => setMonths(m)}>{m} {m === 1 ? "month" : "months"}{m > 1 ? ` · −${m === 6 ? 5 : 10}%` : ""}</button>)}</div></Field>
          </div>
          <div className="card h-fit p-6">
            <div className="flex items-center justify-between"><span className="font-semibold text-forest">Quotation</span><Pill tone="amber">Draft</Pill></div>
            <div className="mt-1 text-xs text-mute">For {res.name}</div>
            <div className="mt-4 space-y-2 text-sm font-semibold text-forest">
              <div className="flex justify-between"><span>{baseItem.name}</span><span>{fmt(baseItem.price)}</span></div>
              {addItems.map((a) => <div key={a.id} className="flex justify-between text-mute"><span>{a.name}</span><span>{fmt(a.price)}{a.billing === "Usage-based" ? " /use" : ""}</span></div>)}
              {disc > 0 && <div className="flex justify-between text-[#2f7d5c]"><span>Term discount −{disc * 100}%</span><span>−{fmt(Math.round(monthly * disc))}</span></div>}
              <div className="flex justify-between border-t border-line pt-3 text-lg"><span>Monthly</span><span>{fmt(Math.round(monthly * (1 - disc)))}</span></div>
            </div>
            <button className="btn btn-primary mt-5 w-full" onClick={() => { toast("Quotation generated and sent for approval"); log("Generated quotation", res.name); }}>Generate quotation</button>
            <button className="btn btn-ghost mt-2 w-full" onClick={() => toast("Agreement draft created")}>Create agreement</button>
          </div>
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={`Edit price · ${edit?.name ?? ""}`}>
        {edit && (
          <div className="space-y-4">
            <Field label="New price (LKR)"><input type="number" className="input" value={price} onChange={(e) => setPrice(+e.target.value)} /></Field>
            <div className="flex items-start gap-2 rounded-lg tone-amber tint p-3 text-xs font-semibold"><History size={15} className="mt-0.5 shrink-0" />The old price is kept in history. Existing resident agreements keep their agreed price.</div>
            {edit.history.length > 0 && <div className="text-xs text-mute">History: {edit.history.map((h) => `${h.date} ${fmt(h.price)}`).join(" · ")}</div>}
            <button className="btn btn-primary w-full" onClick={() => {
              setItems((p) => p.map((x) => (x.id === edit.id ? { ...x, price, history: [{ date: "Nov 2026", price: x.price }, ...x.history] } : x)));
              log("Changed catalogue price", `${edit.name} ${edit.price.toLocaleString()} → ${price.toLocaleString()}`); toast("Price updated for new agreements"); setEdit(null);
            }}><Plus size={16} /> Save new price</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
