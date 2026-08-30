"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SquareKanban, CheckCircle, AlertCircle, Inbox } from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminNav from "@/components/admin/AdminNav";
import { LEAD_STATUSES, STAGE_COLOR, type LeadStatus } from "@/lib/pipeline";

interface Lead {
  id: string;
  companyName: string;
  sector: string;
  city: string;
  status: string;
  priority: string | null;
  leadScore: number | null;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

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

function PipelineScreen({ onLogout }: { onLogout: () => Promise<void> }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [dragLeadId, setDragLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const showToast = (type: ToastState["type"], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads?take=200");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      showToast("error", "No se pudieron cargar los leads.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(fetchLeads, 0);
    return () => clearTimeout(handle);
  }, [fetchLeads]);

  const updateScrollShadows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollShadows();
    window.addEventListener("resize", updateScrollShadows);
    return () => window.removeEventListener("resize", updateScrollShadows);
  }, [updateScrollShadows, leads]);

  const moveLead = async (leadId: string, status: LeadStatus) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === status) return;

    setMovingLeadId(leadId);
    // Actualización optimista: la columna se mueve al toque, se revierte si falla.
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));

    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l)));
      showToast("error", "No se pudo mover el lead.");
    } finally {
      setMovingLeadId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker text-white">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-blue/8 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-violet/6 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto flex h-screen max-w-[1500px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav onLogout={onLogout} />

        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            <SquareKanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Pipeline</h1>
            <p className="text-[11px] text-slate-400">Arrastrá una tarjeta a otra columna para mover el lead</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="h-6 w-6 animate-spin text-accent-cyan" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="relative min-h-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            {/* Fades de borde: indican que hay más columnas sin usar una scrollbar cruda */}
            <div
              className={`pointer-events-none absolute inset-y-3 left-3 z-10 w-10 rounded-l-xl bg-gradient-to-r from-bg-darker to-transparent transition-opacity duration-200 ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-3 right-3 z-10 w-10 rounded-r-xl bg-gradient-to-l from-bg-darker to-transparent transition-opacity duration-200 ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              ref={scrollRef}
              onScroll={updateScrollShadows}
              className="dark-scroll flex h-full gap-3 overflow-x-auto overflow-y-hidden"
            >
              {LEAD_STATUSES.map((status) => {
                const columnLeads = leads.filter((l) => l.status === status);
                const isDragOver = dragOverColumn === status;
                const color = STAGE_COLOR[status];
                return (
                  <div
                    key={status}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverColumn(status);
                    }}
                    onDragLeave={() => setDragOverColumn((cur) => (cur === status ? null : cur))}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverColumn(null);
                      if (dragLeadId) moveLead(dragLeadId, status);
                    }}
                    className={`flex h-full w-64 shrink-0 flex-col rounded-xl border bg-white/[0.025] transition-colors ${
                      isDragOver ? `${color.ring} bg-white/[0.05]` : "border-white/10"
                    }`}
                  >
                    <div className="flex shrink-0 items-center justify-between rounded-t-xl border-b border-white/10 bg-white/[0.03] px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`} />
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-300">{status}</span>
                      </div>
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                        {columnLeads.length}
                      </span>
                    </div>

                    <div className="dark-scroll flex-1 space-y-2 overflow-y-auto p-2">
                      {columnLeads.length === 0 ? (
                        <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-1.5 text-slate-600">
                          <Inbox className="h-4 w-4" />
                          <span className="text-[11px]">Sin leads</span>
                        </div>
                      ) : (
                        columnLeads.map((lead) => (
                          <motion.div
                            key={lead.id}
                            layout
                            draggable
                            onDragStart={() => setDragLeadId(lead.id)}
                            onDragEnd={() => setDragLeadId(null)}
                            className={`group flex cursor-grab overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-lg active:cursor-grabbing ${
                              movingLeadId === lead.id ? "opacity-50" : ""
                            }`}
                          >
                            <span className={`w-1 shrink-0 ${color.bar}`} />
                            <Link href={`/admin/leads/${lead.id}`} className="min-w-0 flex-1 px-2.5 py-2">
                              <p className="truncate text-xs font-bold text-white group-hover:text-accent-cyan">
                                {lead.companyName}
                              </p>
                              <p className="truncate text-[11px] text-slate-500">
                                {lead.sector} · {lead.city}
                              </p>
                              {lead.leadScore !== null && (
                                <span className="mt-1.5 inline-block rounded-full bg-accent-cyan/10 px-1.5 py-0.5 text-[10px] font-bold text-accent-cyan">
                                  {lead.leadScore} pts
                                </span>
                              )}
                            </Link>
                            {/* El drag-and-drop nativo no funciona con touch en celulares — este
                                select cumple la misma función (mover de columna) en cualquier dispositivo. */}
                            <select
                              aria-label={`Mover ${lead.companyName} a otra columna`}
                              value={lead.status}
                              onChange={(e) => moveLead(lead.id, e.target.value as LeadStatus)}
                              className="mr-1.5 self-center shrink-0 rounded-md border border-white/10 bg-white/5 py-1 text-[10px] text-slate-400 focus:outline-none focus:border-accent-cyan/60"
                            >
                              {LEAD_STATUSES.map((s) => (
                                <option key={s} value={s} className="bg-bg-darker">
                                  {s}
                                </option>
                              ))}
                            </select>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  return <AdminGate>{({ onLogout }) => <PipelineScreen onLogout={onLogout} />}</AdminGate>;
}
