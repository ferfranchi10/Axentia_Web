"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Globe,
  Plus,
  Check,
  X,
  Minus,
  ScanSearch,
  Gauge,
  Lightbulb,
  Sparkles,
  Quote,
} from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminNav from "@/components/admin/AdminNav";
import { LEAD_STATUSES } from "@/lib/pipeline";

interface Activity {
  id: string;
  type: string;
  subject: string | null;
  description: string | null;
  occurredAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  priority: string | null;
  status: string;
}

interface DigitalAudit {
  id: string;
  websiteExists: boolean | null;
  httpsEnabled: boolean | null;
  contactForm: boolean | null;
  onlineBooking: boolean | null;
  whatsapp: boolean | null;
  crmDetected: boolean | null;
  automationDetected: boolean | null;
  customerPortal: boolean | null;
  onlinePayments: boolean | null;
  socialPresence: boolean | null;
  technologyScore: number | null;
  auditStatus: string | null;
  auditedAt: string | null;
  createdAt: string;
}

interface Opportunity {
  id: string;
  category: string;
  title: string;
  description: string | null;
  priority: string | null;
  confidence: number | null;
  status: string | null;
}

interface LeadDetail {
  id: string;
  companyName: string;
  sector: string;
  subsector: string | null;
  city: string;
  province: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  contactName: string | null;
  contactRole: string | null;
  status: string;
  priority: string | null;
  leadScore: number | null;
  digitalPresenceScore: number | null;
  technologyNeedScore: number | null;
  economicPotentialScore: number | null;
  serviceFitScore: number | null;
  contactabilityScore: number | null;
  notes: string | null;
  activities: Activity[];
  tasks: Task[];
  audits: DigitalAudit[];
  opportunities: Opportunity[];
}

interface AIAnalysis {
  problems: string[];
  opportunities: string[];
  recommended_services: string[];
  commercial_argument: string;
  confidence: number;
  reasoning_summary: string;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

const ACTIVITY_TYPES = ["EMAIL", "LLAMADA", "WHATSAPP", "REUNION", "NOTA", "TAREA", "PROPUESTA"];

function Toast({ type, message }: ToastState) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl max-w-xs ${
        type === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {message}
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{title}</h2>
      {children}
    </div>
  );
}

function LeadDetailScreen({ id, onLogout }: { id: string; onLogout: () => Promise<void> }) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const showToast = (type: ToastState["type"], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchLead = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar el lead.");
      const data = await res.json();
      setLead(data.lead);
      setNotesDraft(data.lead.notes || "");
    } catch {
      showToast("error", "No se pudo cargar el lead.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const handle = setTimeout(fetchLead, 0);
    return () => clearTimeout(handle);
  }, [fetchLead]);

  const handleStatusChange = async (status: string) => {
    setChangingStatus(true);
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      await fetchLead();
      showToast("success", `Status actualizado a ${status}.`);
    } catch {
      showToast("error", "No se pudo cambiar el status.");
    } finally {
      setChangingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesDraft }),
      });
      if (!res.ok) throw new Error();
      showToast("success", "Notas guardadas.");
    } catch {
      showToast("error", "No se pudieron guardar las notas.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAddActivity = async (payload: { type: string; subject: string; description: string }) => {
    const res = await fetch(`/api/leads/${id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      showToast("error", "No se pudo registrar la interacción.");
      return false;
    }
    await fetchLead();
    showToast("success", "Interacción registrada.");
    return true;
  };

  const handleAddTask = async (payload: { title: string; dueAt: string; priority: string }) => {
    const res = await fetch(`/api/leads/${id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      showToast("error", "No se pudo crear la tarea.");
      return false;
    }
    await fetchLead();
    showToast("success", "Tarea creada.");
    return true;
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const auditRes = await fetch(`/api/leads/${id}/audit`, { method: "POST" });
      const auditData = await auditRes.json();
      if (!auditRes.ok) throw new Error(auditData.error || "No se pudo ejecutar la auditoría.");

      const scoreRes = await fetch(`/api/leads/${id}/score`, { method: "POST" });
      const scoreData = await scoreRes.json();
      if (!scoreRes.ok) throw new Error(scoreData.error || "No se pudo calcular el score.");

      await fetchLead();
      showToast("success", `Auditoría y score actualizados: ${scoreData.lead.leadScore} pts (${scoreData.lead.priority}).`);
    } catch (e: unknown) {
      showToast("error", (e as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch(`/api/leads/${id}/ai-analysis`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar el análisis.");
      setAiAnalysis(data.analysis);
      await fetchLead();
      showToast("success", `Análisis de IA generado (confianza ${data.analysis.confidence}%).`);
    } catch (e: unknown) {
      showToast("error", (e as Error).message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    const nextStatus = task.status === "COMPLETADA" ? "PENDIENTE" : "COMPLETADA";
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!res.ok) {
      showToast("error", "No se pudo actualizar la tarea.");
      return;
    }
    await fetchLead();
  };

  return (
    <div className="min-h-screen bg-bg-darker text-white">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-blue/8 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-violet/6 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav onLogout={onLogout} />

        <Link href="/admin/leads" className="mb-4 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a leads
        </Link>

        {isLoading || !lead ? (
          <div className="flex items-center justify-center py-16">
            <svg className="h-6 w-6 animate-spin text-accent-cyan" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-bold text-white">{lead.companyName}</h1>
                  {lead.priority && <PriorityBadge priority={lead.priority} />}
                </div>
                <p className="text-xs text-slate-400">
                  {lead.sector} · {lead.city}
                  {lead.leadScore !== null && ` · ${lead.leadScore} pts`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
                >
                  <ScanSearch className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-pulse" : ""}`} />
                  {isAnalyzing ? "Analizando…" : "Auditar + calcular score"}
                </button>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent-violet/40 bg-accent-violet/10 px-3 py-2 text-xs font-bold text-accent-violet transition-all hover:bg-accent-violet/20 disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isGeneratingAI ? "animate-pulse" : ""}`} />
                  {isGeneratingAI ? "Generando…" : "Argumento comercial (IA)"}
                </button>
                <select
                  value={lead.status}
                  disabled={changingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-accent-cyan/60 disabled:opacity-50"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-bg-darker">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contacto */}
            <Section title="Contacto">
              <div className="grid grid-cols-1 gap-2 text-sm text-slate-300 sm:grid-cols-2">
                {lead.contactName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    {lead.contactName} {lead.contactRole ? `(${lead.contactRole})` : ""}
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <a href={`mailto:${lead.email}`} className="hover:text-accent-cyan">{lead.email}</a>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    {lead.phone}
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-slate-500" />
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">
                      {lead.website}
                    </a>
                  </div>
                )}
                {!lead.contactName && !lead.email && !lead.phone && !lead.website && (
                  <p className="text-slate-500">Sin datos de contacto todavía.</p>
                )}
              </div>
            </Section>

            {/* Puntuación */}
            {lead.leadScore !== null && (
              <Section title="Puntuación (Lead Score)">
                <ScoreBreakdown lead={lead} />
              </Section>
            )}

            {/* Auditoría digital */}
            <Section title="Auditoría digital">
              <AuditSummary audit={lead.audits[0]} />
            </Section>

            {/* Oportunidades */}
            {lead.opportunities.length > 0 && (
              <Section title="Oportunidades detectadas">
                <OpportunityList opportunities={lead.opportunities} />
              </Section>
            )}

            {/* Argumento comercial (IA) */}
            {aiAnalysis && <AIAnalysisCard analysis={aiAnalysis} />}

            {/* Notas */}
            <Section title="Notas">
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={3}
                placeholder="Notas internas sobre este lead…"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="mt-2 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                {savingNotes ? "Guardando…" : "Guardar notas"}
              </button>
            </Section>

            {/* Tareas */}
            <Section title="Tareas de seguimiento">
              <TaskList tasks={lead.tasks} onToggle={handleToggleTask} onAdd={handleAddTask} />
            </Section>

            {/* Actividades */}
            <Section title="Historial de interacciones">
              <ActivityList activities={lead.activities} onAdd={handleAddActivity} />
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

const PRIORITY_STYLES: Record<string, string> = {
  HOT: "border-red-500/40 bg-red-500/10 text-red-300",
  ALTO: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  MEDIO: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
  BAJO: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  MUY_BAJO: "border-slate-600/40 bg-slate-600/10 text-slate-400",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.BAJO}`}>
      {priority}
    </span>
  );
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  const v = value ?? 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold text-slate-300">{value === null ? "—" : `${v}/100`}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${v >= 70 ? "bg-emerald-400" : v >= 40 ? "bg-amber-400" : "bg-red-400"}`}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function ScoreBreakdown({ lead }: { lead: LeadDetail }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Gauge className="h-6 w-6 text-accent-cyan" />
        <div>
          <p className="text-2xl font-bold text-white">{lead.leadScore}</p>
          <p className="text-[11px] text-slate-500">sobre 100</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ScoreBar label="Necesidad tecnológica (30%)" value={lead.technologyNeedScore} />
        <ScoreBar label="Potencial económico (25%)" value={lead.economicPotentialScore} />
        <ScoreBar label="Encaje con servicios (20%)" value={lead.serviceFitScore} />
        <ScoreBar label="Facilidad de contacto (15%)" value={lead.contactabilityScore} />
        <ScoreBar label="Presencia digital (10%)" value={lead.digitalPresenceScore} />
      </div>
      <p className="text-[11px] text-slate-500">
        Los motivos de este cálculo quedan registrados en el historial de interacciones (actividad &quot;SCORING&quot;).
      </p>
    </div>
  );
}

function CheckRow({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {value === true ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
      ) : value === false ? (
        <X className="h-3.5 w-3.5 shrink-0 text-red-400" />
      ) : (
        <Minus className="h-3.5 w-3.5 shrink-0 text-slate-600" />
      )}
      <span className={value === null ? "text-slate-600" : "text-slate-300"}>{label}</span>
    </div>
  );
}

function AuditSummary({ audit }: { audit?: DigitalAudit }) {
  if (!audit) {
    return <p className="text-sm text-slate-500">Todavía no se corrió ninguna auditoría. Usá &quot;Auditar + calcular score&quot;.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Última auditoría: {new Date(audit.createdAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
          {audit.auditStatus}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        <CheckRow label="Sitio web accesible" value={audit.websiteExists} />
        <CheckRow label="HTTPS" value={audit.httpsEnabled} />
        <CheckRow label="Formulario de contacto" value={audit.contactForm} />
        <CheckRow label="Reservas online" value={audit.onlineBooking} />
        <CheckRow label="WhatsApp" value={audit.whatsapp} />
        <CheckRow label="CRM detectado" value={audit.crmDetected} />
        <CheckRow label="Automatización detectada" value={audit.automationDetected} />
        <CheckRow label="Portal de clientes" value={audit.customerPortal} />
        <CheckRow label="Pagos online" value={audit.onlinePayments} />
        <CheckRow label="Presencia en redes sociales" value={audit.socialPresence} />
      </div>
    </div>
  );
}

const OPPORTUNITY_PRIORITY_STYLES: Record<string, string> = {
  ALTA: "border-red-500/30 bg-red-500/10 text-red-300",
  MEDIA: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  BAJA: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

function OpportunityList({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <div className="space-y-2">
      {opportunities.map((o) => (
        <div key={o.id} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5 shrink-0 text-accent-cyan" />
            <p className="text-sm font-bold text-white">{o.title}</p>
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400">
              {o.category}
            </span>
            {o.priority && (
              <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase ${OPPORTUNITY_PRIORITY_STYLES[o.priority] || ""}`}>
                {o.priority}
              </span>
            )}
            {o.confidence !== null && <span className="text-[10px] text-slate-500">{o.confidence}% confianza</span>}
          </div>
          {o.description && <p className="mt-1 text-xs text-slate-400">{o.description}</p>}
        </div>
      ))}
    </div>
  );
}

function AIAnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  return (
    <div className="rounded-xl border border-accent-violet/30 bg-accent-violet/[0.06] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent-violet">
          <Sparkles className="h-3.5 w-3.5" />
          Argumento comercial (IA)
        </h2>
        <span className="text-[11px] font-bold text-slate-400">{analysis.confidence}% confianza</span>
      </div>

      <div className="mb-3 flex gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-3">
        <Quote className="h-4 w-4 shrink-0 text-accent-violet" />
        <p className="text-sm italic text-slate-200">{analysis.commercial_argument}</p>
      </div>

      {analysis.problems.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">Problemas probables</p>
          <ul className="space-y-1">
            {analysis.problems.map((p, i) => (
              <li key={i} className="text-xs text-slate-300">
                • {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.recommended_services.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {analysis.recommended_services.map((s, i) => (
            <span key={i} className="rounded-full border border-accent-violet/30 bg-accent-violet/10 px-2 py-0.5 text-[10px] font-semibold text-accent-violet">
              {s}
            </span>
          ))}
        </div>
      )}

      <p className="text-[11px] text-slate-500">{analysis.reasoning_summary}</p>
    </div>
  );
}

function TaskList({
  tasks,
  onToggle,
  onAdd,
}: {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onAdd: (payload: { title: string; dueAt: string; priority: string }) => Promise<boolean>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState("MEDIA");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const ok = await onAdd({ title, dueAt, priority });
    setSaving(false);
    if (ok) {
      setTitle("");
      setDueAt("");
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 && <p className="text-sm text-slate-500">Sin tareas todavía.</p>}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
        >
          <button
            onClick={() => onToggle(task)}
            className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border ${
              task.status === "COMPLETADA" ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : "border-white/20 text-transparent"
            }`}
          >
            <Check className="h-3 w-3" />
          </button>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm ${task.status === "COMPLETADA" ? "text-slate-500 line-through" : "text-white"}`}>
              {task.title}
            </p>
            {task.dueAt && <p className="text-[11px] text-slate-500">Vence: {new Date(task.dueAt).toLocaleDateString("es-ES")}</p>}
          </div>
          {task.priority && (
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
              {task.priority}
            </span>
          )}
        </div>
      ))}

      {showForm ? (
        <form onSubmit={submit} className="flex flex-wrap gap-2 pt-1">
          <input
            required
            autoFocus
            placeholder="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-[160px] flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
          />
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/60"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/60"
          >
            {["ALTA", "MEDIA", "BAJA"].map((p) => (
              <option key={p} value={p} className="bg-bg-darker">{p}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            Crear
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex cursor-pointer items-center gap-1.5 pt-1 text-xs font-semibold text-accent-cyan hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Agregar tarea
        </button>
      )}
    </div>
  );
}

function ActivityList({
  activities,
  onAdd,
}: {
  activities: Activity[];
  onAdd: (payload: { type: string; subject: string; description: string }) => Promise<boolean>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("NOTA");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onAdd({ type, subject, description });
    setSaving(false);
    if (ok) {
      setSubject("");
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-2">
      {activities.length === 0 && <p className="text-sm text-slate-500">Sin interacciones registradas todavía.</p>}
      {activities.map((activity) => (
        <div key={activity.id} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-accent-cyan">{activity.type}</span>
            <span className="text-[11px] text-slate-500">
              {new Date(activity.occurredAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
            </span>
          </div>
          {activity.subject && <p className="mt-1 text-sm text-white">{activity.subject}</p>}
          {activity.description && <p className="mt-0.5 text-xs text-slate-400">{activity.description}</p>}
        </div>
      ))}

      {showForm ? (
        <form onSubmit={submit} className="space-y-2 pt-1">
          <div className="flex flex-wrap gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/60"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t} className="bg-bg-darker">{t}</option>
              ))}
            </select>
            <input
              autoFocus
              placeholder="Asunto"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="min-w-[160px] flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
            />
          </div>
          <textarea
            placeholder="Detalle (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
          />
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            Registrar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex cursor-pointer items-center gap-1.5 pt-1 text-xs font-semibold text-accent-cyan hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Registrar interacción
        </button>
      )}
    </div>
  );
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  return <AdminGate>{({ onLogout }) => <LeadDetailScreen id={id} onLogout={onLogout} />}</AdminGate>;
}
