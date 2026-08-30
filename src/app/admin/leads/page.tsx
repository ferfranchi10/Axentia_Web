"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Search, X, CheckCircle, AlertCircle } from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminNav from "@/components/admin/AdminNav";

interface Lead {
  id: string;
  companyName: string;
  sector: string;
  city: string;
  status: string;
  priority: string | null;
  leadScore: number | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  createdAt: string;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

const STATUS_STYLES: Record<string, string> = {
  NUEVO: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  CALIFICADO: "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
  CONTACTAR: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  CONTACTADO: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  RESPUESTA: "border-accent-violet/30 bg-accent-violet/10 text-accent-violet",
  REUNION: "border-accent-violet/30 bg-accent-violet/10 text-accent-violet",
  PROPUESTA: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  NEGOCIACION: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  GANADO: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  PERDIDO: "border-red-500/30 bg-red-500/10 text-red-300",
};

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

function NewLeadForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ companyName: "", sector: "", city: "", email: "", phone: "", website: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo crear el lead.");
      }
      onCreated();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input
          required
          placeholder="Nombre de la empresa *"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
        />
        <input
          required
          placeholder="Sector *"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
        />
        <input
          required
          placeholder="Ciudad *"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
        />
        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
        />
        <input
          placeholder="Sitio web"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
        />

        {error && <p className="col-span-full text-xs text-red-400">{error}</p>}

        <div className="col-span-full flex items-center gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            {isSaving ? "Guardando…" : "Crear lead"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function LeadsScreen({ onLogout }: { onLogout: () => Promise<void> }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: ToastState["type"], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch {
      showToast("error", "No se pudieron cargar los leads.");
    } finally {
      setIsLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const handle = setTimeout(fetchLeads, 250);
    return () => clearTimeout(handle);
  }, [fetchLeads]);

  return (
    <div className="min-h-screen bg-bg-darker text-white">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-blue/8 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-violet/6 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav onLogout={onLogout} />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Leads</h1>
              <p className="text-[11px] text-slate-400">{total} lead{total === 1 ? "" : "s"} en el motor de prospección</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cerrar" : "Nuevo lead"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <NewLeadForm
              onCreated={() => {
                setShowForm(false);
                showToast("success", "Lead creado correctamente.");
                fetchLeads();
              }}
              onClose={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>

        {/* Filtros */}
        <div className="mb-5 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              placeholder="Buscar por empresa, email o contacto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/60"
          >
            <option value="" className="bg-bg-darker">Todos los estados</option>
            {Object.keys(STATUS_STYLES).map((s) => (
              <option key={s} value={s} className="bg-bg-darker">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="h-6 w-6 animate-spin text-accent-cyan" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 py-16 text-center text-sm text-slate-400">
            No hay leads todavía. Creá el primero con &quot;Nuevo lead&quot;.
          </div>
        ) : (
          <div className="space-y-2">
            {leads.map((lead, idx) => (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:border-accent-cyan/40 hover:bg-white/[0.07]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{lead.companyName}</p>
                    <p className="truncate text-xs text-slate-400">
                      {lead.sector} · {lead.city}
                      {lead.email ? ` · ${lead.email}` : ""}
                    </p>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    {lead.leadScore !== null && (
                      <span className="text-xs font-bold text-accent-cyan">{lead.leadScore} pts</span>
                    )}
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        STATUS_STYLES[lead.status] || STATUS_STYLES.NUEVO
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return <AdminGate>{({ onLogout }) => <LeadsScreen onLogout={onLogout} />}</AdminGate>;
}
