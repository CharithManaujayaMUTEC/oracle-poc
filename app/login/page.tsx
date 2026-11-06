"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth";
import { Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { DEMO_USERS, Role } from "@/lib/data";

const ROLES: { r: Role; icon: string }[] = [
  { r: "director", icon: "Crown" },
  { r: "nurse", icon: "Stethoscope" },
  { r: "guardian", icon: "Heart" },
];

export default function Login() {
  const { login, demoLogin } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const go = (r: Role) => {
    demoLogin(r);
    router.push("/app");
  };

  return (
    <AuthShell title="Sign in">
      <div className="mt-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-mute">Quick demo</div>
        <div className="grid grid-cols-3 gap-3">
          {ROLES.map(({ r, icon }) => (
            <button key={r} onClick={() => go(r)} className="card group p-4 text-center transition-all">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white transition-transform" style={{ background: DEMO_USERS[r].tone }}>
                <Icon name={icon} size={22} />
              </span>
              <div className="mt-2 text-xs font-bold capitalize text-forest">{r}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-mute"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const m = login(email, pw);
          if (m) setErr(m);
          else router.push("/app");
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
        {err && <div className="rounded-xl bg-[#fbe0e7] px-4 py-2 text-sm font-semibold text-[#c2395a]">{err}</div>}
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-mute">
        New here? <Link href="/signup" className="font-bold text-gold">Create account</Link>
      </p>
    </AuthShell>
  );
}
