"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthShell } from "@/components/auth";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { DEMO_USERS, ROLE_LABEL, Role } from "@/lib/data";
import { HOME } from "@/lib/nav";

const ROLES = (Object.keys(DEMO_USERS) as Role[]).map((r) => ({ r, label: ROLE_LABEL[r], icon: DEMO_USERS[r].icon, tone: DEMO_USERS[r].tone }));

export default function Signup() {
  const { signup } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<Role>("guardian");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState<string | null>(null);

  const strength = useMemo(() => {
    const p = f.password;
    return [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  }, [f.password]);

  return (
    <AuthShell title="Create account">
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const m = signup({ ...f, role });
          if (m) setErr(m);
          else router.push(HOME[role]);
        }}
      >
        <div className="grid grid-cols-3 gap-2.5">
          {ROLES.map((x) => (
            <button type="button" key={x.r} onClick={() => setRole(x.r)} className="card p-3 text-center" style={role === x.r ? { borderColor: x.tone, boxShadow: `0 0 0 3px ${x.tone}33` } : {}}>
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg text-white" style={{ background: x.tone }}><Icon name={x.icon} size={20} /></span>
              <div className="mt-2 text-[11px] font-bold leading-tight text-forest">{x.label}</div>
            </button>
          ))}
        </div>
        <input className="input" placeholder="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: i < strength ? ["#c2395a", "#ee7b61", "#e0a02b", "#3f9a76"][strength - 1] : "#E7E5DA" }} />
          ))}
        </div>
        {err && <div className="rounded-xl bg-[#fbe0e7] px-4 py-2 text-sm font-semibold text-[#c2395a]">{err}</div>}
        <button className="btn btn-gold w-full">Create account</button>
      </form>
      <p className="mt-6 text-center text-sm text-mute">
        Have an account? <Link href="/login" className="font-bold text-gold">Sign in</Link>
      </p>
    </AuthShell>
  );
}
