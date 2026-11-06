"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DEMO_USERS, RESIDENTS, ROLE_LABEL, Resident, Role } from "./data";
import { AUDIT_SEED, AuditEntry, NOTIFS, Notif } from "./mock";

export interface User {
  name: string;
  email: string;
  role: Role;
  title: string;
}
interface StoredUser extends User {
  password: string;
}

interface Ctx {
  ready: boolean;
  user: User | null;
  residents: Resident[];
  notifs: Notif[];
  audit: AuditEntry[];
  login: (email: string, password: string) => string | null;
  demoLogin: (role: Role) => void;
  signup: (u: { name: string; email: string; password: string; role: Role }) => string | null;
  logout: () => void;
  addResident: (r: Resident) => void;
  ack: (id: string) => void;
  log: (action: string, target: string, ai?: boolean) => void;
  toast: (msg: string) => void;
}

const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

const read = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [extra, setExtra] = useState<Resident[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>(NOTIFS);
  const [audit, setAudit] = useState<AuditEntry[]>(AUDIT_SEED);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    // hydrate from localStorage once on the client
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(read<User | null>("oracle.session", null));
    setExtra(read<Resident[]>("oracle.residents", []));
    setReady(true);
  }, []);

  const start = useCallback((u: User) => {
    setUser(u);
    write("oracle.session", u);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const users = read<StoredUser[]>("oracle.users", []);
      const f = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!f) return "Email or password not recognised";
      start({ name: f.name, email: f.email, role: f.role, title: f.title });
      return null;
    },
    [start],
  );

  const demoLogin = useCallback(
    (role: Role) => {
      const d = DEMO_USERS[role];
      start({ name: d.name, email: d.email, role, title: d.title });
    },
    [start],
  );

  const signup = useCallback(
    (u: { name: string; email: string; password: string; role: Role }) => {
      const users = read<StoredUser[]>("oracle.users", []);
      if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) return "That email is already registered";
      const su: StoredUser = { ...u, title: ROLE_LABEL[u.role] };
      write("oracle.users", [...users, su]);
      start({ name: su.name, email: su.email, role: su.role, title: su.title });
      return null;
    },
    [start],
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("oracle.session");
    } catch {}
  }, []);

  const addResident = useCallback((r: Resident) => {
    setExtra((p) => {
      const n = [r, ...p];
      write("oracle.residents", n);
      return n;
    });
  }, []);

  const ack = useCallback((id: string) => setNotifs((p) => p.map((n) => (n.id === id ? { ...n, ack: true } : n))), []);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2800);
  }, []);

  const log = useCallback(
    (action: string, target: string, ai = false) => {
      const who = ai ? "SAGE" : (user?.name ?? "System");
      setAudit((p) => [{ id: "x" + Date.now() + Math.random(), who, action, target, when: "Just now", ai }, ...p]);
    },
    [user],
  );

  const residents = useMemo(() => [...extra, ...RESIDENTS], [extra]);

  return (
    <C.Provider value={{ ready, user, residents, notifs, audit, login, demoLogin, signup, logout, addResident, ack, log, toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 md:bottom-8">
        {toasts.map((t) => (
          <div key={t.id} className="pop rounded-lg bg-forest px-5 py-3 text-sm font-semibold text-white shadow-xl">{t.msg}</div>
        ))}
      </div>
    </C.Provider>
  );
}
