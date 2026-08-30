"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, SquareKanban, Search, LayoutDashboard, LogOut } from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin", label: "Disponibilidad", icon: Calendar },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/pipeline", label: "Pipeline", icon: SquareKanban },
  { href: "/admin/prospeccion", label: "Prospección", icon: Search },
];

export default function AdminNav({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    // "Salir" queda afuera del contenedor con scroll: en mobile la lista de
    // links no entra completa, pero cerrar sesión tiene que seguir siendo
    // alcanzable sin tener que scrollear la barra hasta el final.
    <div className="mb-6 flex items-center gap-3">
      <nav className="dark-scroll flex flex-1 gap-2 overflow-x-auto">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                active
                  ? "border-accent-cyan bg-accent-cyan/15 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={onLogout}
        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/15 hover:text-red-300"
      >
        <LogOut className="h-3.5 w-3.5" />
        Salir
      </button>
    </div>
  );
}
