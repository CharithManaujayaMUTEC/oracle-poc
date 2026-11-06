import { Role } from "./data";

export interface Mod {
  id: string;
  href: string;
  label: string;
  icon: string;
  group: "Overview" | "Residents" | "Care" | "Operations" | "Finance" | "Intelligence" | "Administration" | "Family";
  roles: Role[];
}

const M: Role = "manager";
const D: Role = "director";
const N: Role = "nurse";
const C: Role = "caregiver";
const F: Role = "finance";
const G: Role = "guardian";

export const MODULES: Mod[] = [
  { id: "dashboard", href: "/app", label: "Dashboard", icon: "LayoutDashboard", group: "Overview", roles: [D, M] },
  { id: "notifications", href: "/app/notifications", label: "Alerts", icon: "Bell", group: "Overview", roles: [D, M, N, C, F] },
  { id: "family", href: "/app/family", label: "My family", icon: "Heart", group: "Family", roles: [G] },

  { id: "enquiries", href: "/app/enquiries", label: "Enquiries", icon: "Inbox", group: "Residents", roles: [D, M] },
  { id: "admissions", href: "/app/admissions", label: "Admissions", icon: "ClipboardList", group: "Residents", roles: [D, M, N] },
  { id: "register", href: "/app/register", label: "Register client", icon: "UserPlus", group: "Residents", roles: [D, M, N] },
  { id: "residents", href: "/app/residents", label: "Residents", icon: "Users", group: "Residents", roles: [D, M, N, C] },

  { id: "care", href: "/app/care", label: "ONE Care", icon: "Stethoscope", group: "Care", roles: [D, M, N, C] },
  { id: "medication", href: "/app/medication", label: "Medication", icon: "Pill", group: "Care", roles: [D, M, N] },
  { id: "incidents", href: "/app/incidents", label: "Incidents", icon: "Siren", group: "Care", roles: [D, M, N, C] },
  { id: "appointments", href: "/app/appointments", label: "Appointments", icon: "CalendarDays", group: "Care", roles: [D, M, N] },
  { id: "homecare", href: "/app/homecare", label: "Home care", icon: "House", group: "Care", roles: [D, M, N] },

  { id: "rooms", href: "/app/rooms", label: "Facilities & rooms", icon: "BedDouble", group: "Operations", roles: [D, M] },
  { id: "staff", href: "/app/staff", label: "Staff", icon: "IdCard", group: "Operations", roles: [D, M] },
  { id: "smartroom", href: "/app/smart-room", label: "Smart room", icon: "Tv", group: "Operations", roles: [D, M, N, C] },

  { id: "pricing", href: "/app/pricing", label: "Pricing & add-ons", icon: "Tags", group: "Finance", roles: [D, M, F] },
  { id: "finance", href: "/app/finance", label: "Billing", icon: "Receipt", group: "Finance", roles: [D, M, F] },
  { id: "reports", href: "/app/reports", label: "Reports", icon: "ChartColumn", group: "Finance", roles: [D, M, F] },

  { id: "sage", href: "/app/sage", label: "SAGE", icon: "Sparkles", group: "Intelligence", roles: [D, M, N, C, F, G] },

  { id: "integrations", href: "/app/integrations", label: "Integrations", icon: "Plug", group: "Administration", roles: [D] },
  { id: "admin", href: "/app/admin", label: "Users & security", icon: "ShieldCheck", group: "Administration", roles: [D] },
];

export const HOME: Record<Role, string> = {
  director: "/app",
  manager: "/app",
  nurse: "/app/care",
  caregiver: "/app/care",
  finance: "/app/finance",
  guardian: "/app/family",
};

export function moduleFor(path: string): Mod | undefined {
  return [...MODULES].sort((a, b) => b.href.length - a.href.length).find((m) => (m.href === "/app" ? path === "/app" : path.startsWith(m.href)));
}

export const PERM_ROLES: Role[] = ["director", "manager", "nurse", "caregiver", "finance", "guardian"];
