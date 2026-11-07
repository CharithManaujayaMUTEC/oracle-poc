"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { DEMO_USERS, ROLE_LABEL, Role } from "@/lib/data";
import { HOME } from "@/lib/nav";

const ROLES = Object.keys(DEMO_USERS) as Role[];

export default function Login() {
  const { login, demoLogin, user } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const go = (r: Role) => {
    demoLogin(r);
    router.push(HOME[r]);
  };

  return (
    <AuthShell title="Sign in">
      <div className="mt-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-mute">Demo access · choose a role</div>
        <div className="grid grid-cols-3 gap-2.5">
          {ROLES.map((r) => (
            <button key={r} onClick={() => go(r)} className="card p-3 text-center transition-colors hover:border-gold">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg text-white" style={{ background: DEMO_USERS[r].tone }}>
                <Icon name={DEMO_USERS[r].icon} size={20} />
              </span>
              <div className="mt-2 text-[11px] font-bold leading-tight text-forest">{ROLE_LABEL[r]}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-mute"><span className="h-px flex-1 bg-line" />or sign in<span className="h-px flex-1 bg-line" /></div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const m = login(email, pw);
          if (m) setErr(m);
          else {
            const u = JSON.parse(localStorage.getItem("oracle.session") || "null");
            router.push(u ? HOME[u.role as Role] : "/app");
          }
        }}
      >
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input className="input !pl-11" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="relative">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input className="input !pl-11 !pr-11" placeholder="Password" type={show ? "text" : "password"} required value={pw} onChange={(e) => setPw(e.target.value)} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-mute">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        {err && <div className="rounded-lg tone-red tint px-4 py-2 text-sm font-semibold">{err}</div>}
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-mute">
        New here? <Link href="/signup" className="font-bold text-gold">Create account</Link>
        {user && <> · <Link href={HOME[user.role]} className="font-bold text-gold">Continue as {user.name.split(" ")[0]}</Link></>}
      </p>
    </AuthShell>
  );
}
