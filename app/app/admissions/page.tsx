"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageHead } from "@/components/kit";
import { Avatar, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { ADMISSIONS, ADMISSION_STEPS } from "@/lib/mock";

const ICONS = ["Inbox", "ClipboardCheck", "Stethoscope", "Building", "FileText", "FileSignature", "BadgeCheck", "FolderCheck", "BedDouble", "HeartPulse", "KeyRound", "Handshake"];

export default function Admissions() {
  const { toast, log } = useApp();
  const [list, setList] = useState(ADMISSIONS);

  const advance = (id: string) => {
    setList((p) => p.map((a) => (a.id === id && a.step < 11 ? { ...a, step: a.step + 1 } : a)));
    const a = list.find((x) => x.id === id)!;
    if (a.step < 11) {
      log(`Completed admission step: ${ADMISSION_STEPS[a.step]}`, a.client);
      toast(`${ADMISSION_STEPS[a.step]} complete`);
    }
  };

  return (
    <div>
      <PageHead title="Admissions" sub="12-step admission workflow" />
      <div className="space-y-5">
        {list.map((a) => (
          <div key={a.id} className="card p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={a.client} hue="#046A4E" size={48} />
              <div className="flex-1">
                <div className="text-lg font-semibold text-forest">{a.client}</div>
                <div className="text-xs font-semibold text-mute">{a.age} yrs · {a.room} · owner {a.owner} · due {a.due}</div>
              </div>
              <div className="text-xs font-semibold text-mute">{a.note}</div>
              <button onClick={() => advance(a.id)} disabled={a.step >= 11} className="btn btn-primary disabled:opacity-40">{a.step >= 11 ? "Admitted" : `Complete “${ADMISSION_STEPS[a.step]}”`}</button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <div className="flex min-w-[820px] items-start">
                {ADMISSION_STEPS.map((s, i) => {
                  const done = i < a.step, cur = i === a.step;
                  return (
                    <div key={s} className="flex flex-1 flex-col items-center text-center">
                      <div className="flex w-full items-center">
                        <span className="h-0.5 flex-1" style={{ background: i === 0 ? "transparent" : i <= a.step ? "var(--gold)" : "var(--line)" }} />
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={done ? { background: "var(--forest)", color: "#fff" } : cur ? { background: "var(--gold)", color: "#fff", boxShadow: "0 0 0 4px rgba(14,138,154,.2)" } : { background: "#fff", border: "1.5px solid var(--line)", color: "var(--mute)" }}>
                          {done ? <Check size={16} /> : <Icon name={ICONS[i]} size={16} />}
                        </span>
                        <span className="h-0.5 flex-1" style={{ background: i === 11 ? "transparent" : i < a.step ? "var(--gold)" : "var(--line)" }} />
                      </div>
                      <div className="mt-2 text-[10px] font-bold leading-tight" style={{ color: cur ? "var(--gold)" : done ? "var(--forest)" : "var(--mute)" }}>{s}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
