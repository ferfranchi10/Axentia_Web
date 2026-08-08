"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, Briefcase, ShoppingBag, Utensils, Home, Clock, DollarSign, Zap, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const INDUSTRIES = [
  { id: "restaurante", label: "Restauración / Hostelería", icon: Utensils },
  { id: "inmobiliaria", label: "Inmobiliaria / Real Estate", icon: Home },
  { id: "despacho", label: "Asesoría / Despacho Legal", icon: Briefcase },
  { id: "comercio", label: "Comercio / E-commerce", icon: ShoppingBag },
  { id: "servicios", label: "Empresa de Servicios B2B", icon: Building2 },
  { id: "otros", label: "Otros", icon: HelpCircle },
];

const BOTTLENECKS = [
  { id: "manual", label: "Tareas manuales y repetitivas que consumen horas de mi equipo" },
  { id: "leads", label: "Pérdida de clientes potenciales por falta de seguimiento rápido" },
  { id: "datos", label: "Información dispersa en múltiples herramientas sin conectar" },
  { id: "comunicacion", label: "Comunicación interna y coordinación de equipos desorganizada" },
  { id: "vision", label: "Falta de datos y métricas para tomar decisiones rápidas" },
  { id: "clientes", label: "Clientes que no repiten compra o se olvidan de nosotros" },
];

const ROI_BY_INDUSTRY: Record<string, { hours: number; savings: number; tool: string }> = {
  restaurante: { hours: 120, savings: 18000, tool: "WhatsApp Bot + CRM de Reservas" },
  inmobiliaria: { hours: 200, savings: 34000, tool: "Cualificador de Leads Automático" },
  despacho: { hours: 280, savings: 42000, tool: "OCR + Lector IA de Documentos" },
  comercio: { hours: 160, savings: 27000, tool: "Motor de Fidelización Automatizado" },
  servicios: { hours: 220, savings: 38000, tool: "CRM + Automatización de Propuestas" },
  otros: { hours: 180, savings: 29000, tool: "Automatización de Flujos a Medida" },
};

export default function GrowthAuditTool() {
  const { openModal } = useModal();
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [customIndustry, setCustomIndustry] = useState("");
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState(10);

  const toggleBottleneck = (id: string) => {
    setSelectedBottlenecks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const roi = selectedIndustry ? ROI_BY_INDUSTRY[selectedIndustry] : null;
  const scaledHours = roi ? Math.round(roi.hours * (teamSize / 10)) : 0;
  const scaledSavings = roi ? Math.round(roi.savings * (teamSize / 10)) : 0;

  const isNextDisabled = !selectedIndustry || (selectedIndustry === "otros" && !customIndustry.trim());

  return (
    <section id="autodiagnostico" className="py-24 relative overflow-hidden bg-bg-deep">
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-accent-blue/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-cyan font-bold">
            Herramienta Exclusiva
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Diseña tu{" "}
            <span className="text-gradient-cyan-blue">Traje Tecnológico</span>{" "}
            en 3 pasos
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Responde 3 preguntas rápidas y recibirás un diagnóstico personalizado con el potencial de ahorro específico para tu empresa.
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > s
                  ? "bg-accent-cyan text-white"
                  : step === s
                  ? "bg-accent-blue text-white ring-4 ring-accent-blue/20"
                  : "bg-white/5 border border-white/10 text-slate-500"
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-px transition-all duration-500 ${step > s ? "bg-accent-cyan" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-3xl border border-white/10 bg-bg-darker p-6 md:p-10 glass-panel min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">

            {/* Step 1: Industry */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-white">¿A qué sector pertenece tu empresa?</h3>
                  <p className="text-xs text-slate-400 mt-1">Selecciona el que mejor describa tu actividad principal.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INDUSTRIES.map((ind) => {
                    const Icon = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        onClick={() => {
                          setSelectedIndustry(ind.id);
                          if (ind.id !== "otros") setCustomIndustry("");
                        }}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedIndustry === ind.id
                            ? "bg-accent-blue/15 border-accent-blue text-white"
                            : "bg-white/5 border-white/5 hover:border-white/15 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${selectedIndustry === ind.id ? "bg-accent-blue/20 text-accent-cyan" : "bg-white/5 text-slate-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">{ind.label}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedIndustry === "otros" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      <label className="block text-xs font-semibold text-slate-300">Especifica tu sector</label>
                      <input
                        id="custom-industry-input"
                        type="text"
                        required
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="Ej. Salud, Construcción, Educación..."
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={isNextDisabled}
                    onClick={() => setStep(2)}
                    className={`flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm transition-all cursor-pointer ${
                      !isNextDisabled
                        ? "bg-gradient-to-r from-accent-cyan to-accent-blue text-white hover:opacity-90 shadow-lg shadow-accent-cyan/15 group"
                        : "bg-white/5 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Bottlenecks */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-white">¿Cuáles son tus mayores problemas operativos?</h3>
                  <p className="text-xs text-slate-400 mt-1">Selecciona hasta 3 cuellos de botella que más afectan tu negocio hoy.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {BOTTLENECKS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => toggleBottleneck(b.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedBottlenecks.includes(b.id)
                          ? "bg-accent-violet/10 border-accent-violet/40 text-white"
                          : "bg-white/5 border-white/5 hover:border-white/15 text-slate-300 hover:text-white"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        selectedBottlenecks.includes(b.id) ? "bg-accent-violet border-accent-violet" : "border-white/20"
                      }`}>
                        {selectedBottlenecks.includes(b.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm">{b.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">← Atrás</button>
                  <button
                    disabled={selectedBottlenecks.length === 0}
                    onClick={() => setStep(3)}
                    className={`flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm transition-all cursor-pointer ${
                      selectedBottlenecks.length > 0
                        ? "bg-gradient-to-r from-accent-cyan to-accent-blue text-white hover:opacity-90 shadow-lg shadow-accent-cyan/15 group"
                        : "bg-white/5 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Ver mi Diagnóstico
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 flex-1">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-xs text-accent-cyan font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Diagnóstico Preliminar Generado
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white">Tu Potencial de Optimización</h3>
                </div>

                {/* Slider: team size */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Ajusta el tamaño de tu equipo:</span>
                    <span className="text-accent-cyan font-bold">{teamSize} personas</span>
                  </div>
                  <input
                    type="range" min="2" max="100" value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  />
                </div>

                {/* ROI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-accent-cyan/20 bg-accent-cyan/5 text-center space-y-1">
                    <Clock className="w-5 h-5 text-accent-cyan mx-auto" />
                    <p className="text-2xl font-extrabold text-white">{scaledHours.toLocaleString()}h</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Horas Recuperadas/año</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-accent-violet/20 bg-accent-violet/5 text-center space-y-1">
                    <DollarSign className="w-5 h-5 text-accent-violet mx-auto" />
                    <p className="text-2xl font-extrabold text-white">{scaledSavings.toLocaleString()}€</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Capital Recuperado/año</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-accent-blue/20 bg-accent-blue/5 text-center space-y-1">
                    <Zap className="w-5 h-5 text-accent-blue mx-auto" />
                    <p className="text-2xl font-extrabold text-white">{roi?.tool}</p>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Solución Principal</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
                  <strong className="text-white">Nota del Sistema:</strong> Este diagnóstico es preliminar. Un consultor senior de Axentia revisará tus procesos reales y elaborará una propuesta detallada con arquitectura personalizada y ROI garantizado.
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => openModal("audit")}
                    className="flex-1 bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/15 group text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Recibir Propuesta Completa Gratis
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => { setStep(1); setSelectedIndustry(null); setSelectedBottlenecks([]); setTeamSize(10); }}
                    className="sm:w-auto border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-5 rounded-xl transition-all cursor-pointer text-sm"
                  >
                    Reiniciar
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
