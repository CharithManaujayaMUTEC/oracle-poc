"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { Bell, LogOut, Menu, ShieldOff, X } from "lucide-react";
import { Avatar, Icon, Logo, V60Logo } from "@/components/ui";
import { useApp } from "@/lib/store";
import { DEMO_USERS, ROLE_LABEL } from "@/lib/data";
import { HOME, MODULES, moduleFor } from "@/lib/nav";

const Spinner = () => (
  <div className="grid min-h-screen place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-gold2 border-t-gold" /></div>
);

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Spinner />}><Shell>{children}</Shell></Suspense>;
}

function Shell({ children }: { children: ReactNode }) {
  const { ready, user, logout, notifs } = useApp();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);
  useEffect(() => {
    // close the mobile menu when navigating
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);

  if (!ready || !user) return <Spinner />;

  const items = MODULES.filter((m) => m.roles.includes(user.role));
  const groups = Array.from(new Set(items.map((m) => m.group)));
  const tone = DEMO_USERS[user.role].tone;
  const current = moduleFor(path);
  const allowed = !current || current.roles.includes(user.role);
  const unread = notifs.filter((n) => !n.ack && n.pri !== "Normal").length;
  const active = (h: string) => (h === "/app" ? path === "/app" : path.startsWith(h));

  const nav = (
    <>
      {groups.map((g) => (
        <div key={g} className="mb-5">
          <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold/70">{g}</div>
          {items.filter((m) => m.group === g).map((m) => (
            <Link key={m.id} href={m.href} className="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors" style={active(m.href) ? { background: "rgba(176,141,87,.18)", color: "#fff", boxShadow: "inset 3px 0 0 #B08D57" } : { color: "rgba(255,255,255,.66)" }}>
              <Icon name={m.icon} size={18} />
              {m.label}
              {m.id === "notifications" && unread > 0 && <span className="ml-auto rounded-full bg-[#e0566f] px-2 py-0.5 text-[10px] font-bold text-white">{unread}</span>}
            </Link>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-night p-4 md:flex">
        <Link href={HOME[user.role]} className="mb-6 px-2 pt-2"><Logo dark size={44} /></Link>
        <nav className="min-h-0 flex-1 overflow-y-auto pr-1 [mask-image:linear-gradient(to_bottom,#000_94%,transparent)]">{nav}</nav>
        <div className="mb-3 flex justify-center"><V60Logo width={120} /></div>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/10 p-3">
          <Avatar name={user.name} hue={tone} size={38} />
          <div className="min-w-0 flex-1 text-white">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="truncate text-[11px] text-white/60">{ROLE_LABEL[user.role]}</div>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} title="Sign out" className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10"><LogOut size={16} /></button>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/85 px-5 py-3 backdrop-blur md:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg border border-line md:hidden"><Menu size={20} /></button>
            <div className="text-sm font-semibold text-mute">{current?.label ?? "ONE"}</div>
          </div>
          <div className="flex items-center gap-3">
            {user.role !== "guardian" && (
              <Link href="/app/notifications" className="relative grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-forest">
                <Bell size={18} />
                {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c2395a] px-1 text-[10px] font-bold text-white">{unread}</span>}
              </Link>
            )}
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold text-forest">{user.name}</div>
              <div className="text-xs text-mute">{user.title}</div>
            </div>
            <Avatar name={user.name} hue={tone} size={38} />
          </div>
        </header>

        <div className="px-5 py-6 md:px-10">
          {allowed ? children : (
            <div className="card mx-auto mt-16 max-w-md p-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fbe0e7] text-[#b02a4a]"><ShieldOff size={30} /></span>
              <div className="mt-5 text-xl font-semibold text-forest">Access restricted</div>
              <p className="mt-2 text-sm text-mute">Your role ({ROLE_LABEL[user.role]}) does not include {current?.label}.</p>
              <Link href={HOME[user.role]} className="btn btn-primary mt-6">Back to my home</Link>
            </div>
          )}
        </div>
      </main>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-night p-4">
            <div className="mb-4 flex items-center justify-between px-2 pt-2">
              <Logo dark size={34} />
              <button onClick={() => setOpen(false)} className="text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto">{nav}</nav>
            <button onClick={() => { logout(); router.push("/"); }} className="mt-2 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold text-white"><LogOut size={16} /> Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}
