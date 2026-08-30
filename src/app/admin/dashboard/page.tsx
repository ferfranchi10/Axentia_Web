"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Phone,
  CalendarClock,
  FileText,
  Trophy,
  Wallet,
  Lightbulb,
  ListTodo,
  UserX,
  Clock,
  RefreshCw,
} from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminNav from "@/components/admin/AdminNav";
import { LEAD_STATUSES, STAGE_COLOR } from "@/lib/pipeline";

interface Kpis {
  totalLeads: number;
  newLeads: number;
  hotLeads: number;
  contactedLeads: number;
  meetingLeads: number;
  proposalLeads: number;
  wonLeads: number;
  potentialValue: number;
}

interface TopLead {
  id: string;
  companyName: string;
  leadScore: number | null;
  priority: string | null;
  status: string;
}

interface TopOpportunity {
  id: string;
  title: string;
  category: string;
  priority: string | null;
  confidence: number | null;
  leadId: string;
  lead: { companyName: string };
}

interface UncontactedLead {
  id: string;
  companyName: string;
  status: string;
  createdAt: string;
}

interface PendingTask {
  id: string;
  title: string;
  dueAt: string | null;
  priority: string | null;
  leadId: string;
  lead: { companyName: string };
}

interface UpcomingFollowup {
  id: string;
  companyName: string;
  nextContactAt: string;
}

interface DashboardData {
  kpis: Kpis;
  countByStatus: Record<string, number>;
  topLeads: TopLead[];
  topOpportunities: TopOpportunity[];
  uncontactedLeads: UncontactedLead[];
  pendingTasks: PendingTask[];
  upcomingFollowups: UpcomingFollowup[];
}

const KPI_CARDS: { key: keyof Kpis; label: string; icon: typeof Users; accent: string }[] = [
  { key: "totalLeads", label: "Total leads", icon: Users, accent: "text-white" },
  { key: "newLeads", label: "Nuevos", icon: Sparkles, accent: "text-slate-300" },
  { key: "hotLeads", label: "Leads HOT", icon: Sparkles, accent: "text-red-400" },
  { key: "contactedLeads", label: "Contactados", icon: Phone, accent: "text-accent-cyan" },
  { key: "meetingLeads", label: "Reuniones", icon: CalendarClock, accent: "text-accent-violet" },
  { key: "proposalLeads", label: "Propuestas", icon: FileText, accent: "text-blue-400" },
  { key: "wonLeads", label: "Ganados", icon: Trophy, accent: "text-emerald-400" },
  { key: "potentialValue", label: "Valor potencial", icon: Wallet, accent: "text-amber-400" },
];

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Users; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function DashboardScreen({ onLogout }: { onLogout: () => Promise<void> }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/kpis");
      if (res.ok) setData(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(fetchData, 0);
    return () => clearTimeout(handle);
  }, [fetchData]);

  const maxStageCount = data ? Math.max(1, ...LEAD_STATUSES.map((s) => data.countByStatus[s] || 0)) : 1;

  return (
    <div className="min-h-screen bg-bg-darker text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-blue/8 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-violet/6 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav onLogout={onLogout} />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
            >
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Dashboard</h1>
              <p className="text-[11px] text-slate-400">Vista general del motor de prospección</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        {isLoading || !data ? (
          <div className="flex items-center justify-center py-16">
            <svg className="h-6 w-6 animate-spin text-accent-cyan" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {KPI_CARDS.map(({ key, label, icon: Icon, accent }) => (
                <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Icon className={`mb-2 h-4 w-4 ${accent}`} />
                  <p className={`text-xl font-bold ${accent}`}>
                    {key === "potentialValue" ? `€${data.kpis[key].toLocaleString("es-ES")}` : data.kpis[key]}
                  </p>
                  <p className="text-[11px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            {data.kpis.potentialValue === 0 && (
              <p className="-mt-2 text-[11px] text-slate-600">
                Valor potencial en €0: todavía no hay oportunidades con un monto estimado cargado.
              </p>
            )}

            {/* Distribución del pipeline */}
            <Section title="Distribución del pipeline" icon={LayoutDashboard}>
              <div className="space-y-2">
                {LEAD_STATUSES.map((status) => {
                  const count = data.countByStatus[status] || 0;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-[11px] font-semibold text-slate-400">{status}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(count / maxStageCount) * 100}%`, backgroundColor: STAGE_COLOR[status].solid }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right text-[11px] font-bold text-slate-300">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Section>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Top leads */}
              <Section title="Top 10 leads" icon={Users}>
                {data.topLeads.length === 0 ? (
                  <p className="text-sm text-slate-500">Todavía no hay leads puntuados.</p>
                ) : (
                  <div className="space-y-1.5">
                    {data.topLeads.map((lead, i) => (
                      <Link
                        key={lead.id}
                        href={`/admin/leads/${lead.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="w-4 shrink-0 text-[11px] text-slate-600">{i + 1}</span>
                          <span className="truncate text-white">{lead.companyName}</span>
                        </span>
                        <span className="shrink-0 text-xs font-bold text-accent-cyan">{lead.leadScore} pts</span>
                      </Link>
                    ))}
                  </div>
                )}
              </Section>

              {/* Top oportunidades */}
              <Section title="Top 10 oportunidades" icon={Lightbulb}>
                {data.topOpportunities.length === 0 ? (
                  <p className="text-sm text-slate-500">Todavía no hay oportunidades detectadas.</p>
                ) : (
                  <div className="space-y-1.5">
                    {data.topOpportunities.map((o) => (
                      <Link
                        key={o.id}
                        href={`/admin/leads/${o.leadId}`}
                        className="block rounded-lg px-2 py-1.5 hover:bg-white/5"
                      >
                        <p className="truncate text-sm text-white">{o.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {o.lead.companyName} · {o.confidence ?? 0}% confianza
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </Section>

              {/* Leads sin contactar */}
              <Section title="Leads sin contactar" icon={UserX}>
                {data.uncontactedLeads.length === 0 ? (
                  <p className="text-sm text-slate-500">Todos los leads activos ya tienen algún contacto registrado.</p>
                ) : (
                  <div className="space-y-1.5">
                    {data.uncontactedLeads.map((lead) => (
                      <Link
                        key={lead.id}
                        href={`/admin/leads/${lead.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
                      >
                        <span className="truncate text-white">{lead.companyName}</span>
                        <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                          {lead.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </Section>

              {/* Tareas pendientes */}
              <Section title="Tareas pendientes" icon={ListTodo}>
                {data.pendingTasks.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay tareas pendientes.</p>
                ) : (
                  <div className="space-y-1.5">
                    {data.pendingTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/admin/leads/${task.leadId}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
                      >
                        <span className="min-w-0 truncate text-white">{task.title}</span>
                        <span className="shrink-0 text-[11px] text-slate-500">{task.lead.companyName}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </Section>
            </div>

            {/* Próximos seguimientos */}
            <Section title="Próximos seguimientos" icon={Clock}>
              {data.upcomingFollowups.length === 0 ? (
                <p className="text-sm text-slate-500">No hay seguimientos programados.</p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {data.upcomingFollowups.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
                    >
                      <span className="truncate text-white">{lead.companyName}</span>
                      <span className="shrink-0 text-[11px] text-slate-500">
                        {new Date(lead.nextContactAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AdminGate>{({ onLogout }) => <DashboardScreen onLogout={onLogout} />}</AdminGate>;
}
