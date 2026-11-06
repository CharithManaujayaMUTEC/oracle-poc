"use client";
import { useState } from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { PageHead, Pill, Stat, Tabs } from "@/components/kit";
import { Avatar, Icon } from "@/components/ui";
import { useApp } from "@/lib/store";
import { DEMO_USERS, ROLE_LABEL, Role } from "@/lib/data";
import { MODULES, PERM_ROLES } from "@/lib/nav";
import { USERS } from "@/lib/mock";

type Tab = "users" | "perms" | "audit" | "security";

export default function Admin() {
  const { audit, toast, log } = useApp();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState(USERS);
  const [policy, setPolicy] = useState({ mfa: true, session: true, retention: true, backup: true });

  return (
    <div>
      <PageHead title="Users & security" sub="Access control, audit trail and data protection" />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: "users", label: "Users", icon: "Users" },
        { id: "perms", label: "Permissions", icon: "Grid3x3" },
        { id: "audit", label: "Audit log", icon: "ScrollText" },
        { id: "security", label: "Security", icon: "ShieldCheck" },
      ]} />

      {tab === "users" && (
        <div className="card divide-y divide-line overflow-hidden">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
              <Avatar name={u.name} hue="#176a7c" size={40} />
              <div className="min-w-0 flex-1 text-sm font-semibold text-forest">{u.name}<div className="text-xs font-medium text-mute">{u.email}</div></div>
              <Pill tone="teal">{u.role}</Pill>
              <Pill tone={u.mfa ? "green" : "gray"}>{u.mfa ? "MFA on" : "MFA off"}</Pill>
              <div className="w-24 text-xs font-semibold text-mute">{u.last}</div>
              <button className="chip" data-on={u.active} onClick={() => { setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))); log(u.active ? "Deactivated user" : "Activated user", u.name); toast(u.active ? "User deactivated" : "User activated"); }}>{u.active ? "Active" : "Inactive"}</button>
            </div>
          ))}
        </div>
      )}

      {tab === "perms" && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line bg-cream text-[11px] font-bold uppercase tracking-wider text-mute">
                <th className="px-5 py-3 text-left">Module</th>
                {PERM_ROLES.map((r: Role) => (
                  <th key={r} className="px-2 py-3 text-center"><span className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-md text-white" style={{ background: DEMO_USERS[r].tone }}><Icon name={DEMO_USERS[r].icon} size={14} /></span>{ROLE_LABEL[r].replace("Facility ", "")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-2.5 font-semibold text-forest"><span className="inline-flex items-center gap-2"><Icon name={m.icon} size={15} className="text-mute" />{m.label}</span></td>
                  {PERM_ROLES.map((r) => (
                    <td key={r} className="px-2 py-2.5 text-center">{m.roles.includes(r) ? <Check size={17} className="mx-auto text-[#2f7d5c]" /> : <Minus size={15} className="mx-auto text-[#c7d2d8]" />}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-line px-5 py-3 text-xs font-semibold text-mute">Clinical, financial and legal records have separate permissions for guardians. Medication functions are restricted to authorised nursing staff.</div>
        </div>
      )}

      {tab === "audit" && (
        <div className="card divide-y divide-line overflow-hidden">
          {audit.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={a.ai ? { background: "#e0f0f2", color: "#0e8a9a" } : { background: "#e8eff2", color: "#5d7480" }}>{a.ai ? <Sparkles size={16} /> : <Icon name="User" size={16} />}</span>
              <div className="min-w-0 flex-1 text-sm font-semibold text-forest">{a.action}<div className="truncate text-xs font-medium text-mute">{a.target}</div></div>
              <div className="text-right text-xs font-semibold text-mute">{a.who}<br />{a.when}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat icon="Lock" label="Encryption" value="In transit + at rest" tone="green" />
            <Stat icon="DatabaseBackup" label="Last backup" value="Today 02:00" tone="green" />
            <Stat icon="KeyRound" label="Privileged MFA" value={`${users.filter((u) => u.mfa).length}/${users.length}`} tone="amber" />
            <Stat icon="ScrollText" label="Audit entries" value={audit.length} />
          </div>
          <div className="card p-6">
            <div className="mb-4 font-semibold text-forest">Policies</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {([["mfa", "Require MFA for privileged roles"], ["session", "Auto sign-out after 15 min idle"], ["retention", "Apply data retention schedule"], ["backup", "Daily encrypted backups"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => { setPolicy({ ...policy, [k]: !policy[k] }); log("Changed security policy", l); toast("Policy updated"); }} className="flex items-center gap-3 rounded-lg bg-cream p-3 text-left">
                  <span className="relative h-6 w-11 shrink-0 rounded-full transition-colors" style={{ background: policy[k] ? "#0e8a9a" : "#cbd6db" }}><span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: policy[k] ? 22 : 2 }} /></span>
                  <span className="text-sm font-semibold text-forest">{l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
