"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect } from "react";
import { Avatar, Icon, Logo } from "@/components/ui";
import { useApp } from "@/lib/store";
import { DEMO_USERS, Role } from "@/lib/data";
import { LogOut } from "lucide-react";

const NAV: { href: string; icon: string; label: string; roles: Role[] }[] = [
  { href: "/app", icon: "LayoutDashboard", label: "Home", roles: ["director", "nurse"] },
  { href: "/app/residents", icon: "Users", label: "Residents", roles: ["director", "nurse"] },
  { href: "/app/register", icon: "UserPlus", label: "Register", roles: ["director", "nurse"] },
  { href: "/app/rooms", icon: "BedDouble", label: "Rooms", roles: ["director"] },
  { href: "/app/care", icon: "Stethoscope", label: "Care", roles: ["director", "nurse"] },
  { href: "/app/family", icon: "Heart", label: "My family", roles: ["guardian"] },
  { href: "/app/sage", icon: "Sparkles", label: "SAGE", roles: ["director", "nurse", "guardian"] },
];

const Spinner = () => <div className="grid min-h-screen place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-gold2 border-t-gold" /></div>;

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Spinner />}><Shell>{children}</Shell></Suspense>;
}

function Shell({ children }: { children: ReactNode }) {
  const { ready, user, logout } = useApp();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <Spinner />;

  const items = NAV.filter((n) => n.roles.includes(user.role));
  const tone = DEMO_USERS[user.role].tone;
  const active = (h: string) => (h === "/app" ? path === "/app" : path.startsWith(h));

  return (
    <div className="min-h-screen md:grid md:grid-cols-[92px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col items-center border-r border-line bg-white py-6 md:flex">
        <Link href="/"><Logo size={44} mark /></Link>
        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {items.map((n) => (
            <Link key={n.href} href={n.href} title={n.label} className="group flex w-[68px] flex-col items-center gap-1 rounded-2xl py-3 text-[10px] font-bold transition-all" style={active(n.href) ? { background: "var(--forest)", color: "#fff" } : { color: "var(--mute)" }}>
              <Icon name={n.icon} size={22} />
              {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => { logout(); router.push("/"); }} className="mb-2 grid h-11 w-11 place-items-center rounded-full text-mute hover:bg-sand" title="Sign out"><LogOut size={20} /></button>
        <Avatar name={user.name} hue={tone} size={40} />
      </aside>

      <main className="min-w-0 pb-24 md:pb-0">
        <div className="flex items-center justify-between px-6 pt-6 md:px-10">
          <div className="md:hidden"><Logo size={34} /></div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-bold text-forest">{user.name}</div>
              <div className="text-xs text-mute">{user.title}</div>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} className="grid h-10 w-10 place-items-center rounded-full bg-white text-mute shadow md:hidden"><LogOut size={18} /></button>
          </div>
        </div>
        <div className="px-6 py-6 md:px-10">{children}</div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-3xl border border-line bg-white/95 p-2 shadow-xl backdrop-blur md:hidden">
        {items.map((n) => (
          <Link key={n.href} href={n.href} className="flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-bold" style={active(n.href) ? { background: "var(--forest)", color: "#fff" } : { color: "var(--mute)" }}>
            <Icon name={n.icon} size={20} />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
