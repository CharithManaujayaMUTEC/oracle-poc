"use client";
import { ReactNode } from "react";
import { X } from "lucide-react";
import { Icon } from "./ui";

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-forest">{title}</h1>
        {sub && <p className="mt-1 text-sm text-mute">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; icon?: string; badge?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors" style={value === t.id ? { background: "var(--forest)", color: "#fff" } : { color: "var(--mute)" }}>
          {t.icon && <Icon name={t.icon} size={16} />}
          {t.label}
          {t.badge ? <span className="rounded-full bg-[#c2395a] px-1.5 text-[10px] font-bold text-white">{t.badge}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-4 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div className={`pop card max-h-[90vh] w-full overflow-y-auto ${wide ? "max-w-2xl" : "max-w-md"}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line p-5">
          <div className="text-lg font-semibold text-forest">{title}</div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-sand"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const TONES = {
  green: ["#dcf0e6", "#2f7d5c"],
  amber: ["#fcefce", "#a5741a"],
  red: ["#fbe0e7", "#b02a4a"],
  blue: ["#efe6d2", "#7a5f2e"],
  teal: ["#E3EFE9", "#046A4E"],
  gray: ["#ECEAE0", "#66726C"],
} as const;
export type Tone = keyof typeof TONES;

export function Pill({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
  const [bg, fg] = TONES[tone];
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold" style={{ background: bg, color: fg }}>{children}</span>;
}

export function Stat({ icon, label, value, sub, tone = "teal" }: { icon: string; label: string; value: ReactNode; sub?: string; tone?: Tone }) {
  const [bg, fg] = TONES[tone];
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: bg, color: fg }}><Icon name={icon} size={22} /></span>
      <div className="min-w-0">
        <div className="truncate text-2xl font-semibold tracking-tight text-forest">{value}</div>
        <div className="truncate text-xs font-semibold text-mute">{label}{sub ? ` · ${sub}` : ""}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute">{label}</span>
      {children}
    </label>
  );
}

export function Bars({ values, labels, color = "var(--forest-2)", height = 140 }: { values: number[]; labels: string[]; color?: string; height?: number }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div className="w-full rounded-t-md" style={{ height: `${(v / max) * 82}%`, background: i === values.length - 1 ? "var(--gold)" : color, opacity: i === values.length - 1 ? 1 : 0.35 }} title={String(v)} />
          <span className="text-[10px] font-bold text-mute">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ parts, size = 130 }: { parts: { v: number; c: string; l: string }[]; size?: number }) {
  const total = parts.reduce((s, p) => s + p.v, 0) || 1;
  const r = 44;
  const c = 2 * Math.PI * r;
  const offs = parts.map((_, i) => parts.slice(0, i).reduce((t, x) => t + (x.v / total) * c, 0));
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E7E5DA" strokeWidth="16" />
        {parts.map((p, i) => {
          const len = (p.v / total) * c;
          return <circle key={p.l} cx="60" cy="60" r={r} fill="none" stroke={p.c} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offs[i]} />;
        })}
      </svg>
      <div className="space-y-1.5">
        {parts.map((p) => (
          <div key={p.l} className="flex items-center gap-2 text-xs font-semibold text-forest"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: p.c }} />{p.l} <span className="text-mute">{p.v}</span></div>
        ))}
      </div>
    </div>
  );
}
