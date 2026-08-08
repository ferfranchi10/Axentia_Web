"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Compass, FileText, Cpu, Code2, GraduationCap, LifeBuoy, CheckCircle, Sparkles } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const PROCESS_STEPS = [
  { icon: Search, label: "Auditoría Tecnológica", desc: "Examinamos tus herramientas actuales y documentamos tus flujos de trabajo reales." },
  { icon: Compass, label: "Análisis de Procesos", desc: "Mapeamos dónde se pierde tiempo y qué tareas repetitivas se pueden optimizar." },
  { icon: FileText, label: "Detección de Oportunidades", desc: "Identificamos integraciones clave y módulos de IA que multiplicarán el rendimiento." },
  { icon: Cpu, label: "Diseño de Solución", desc: "Trazamos la arquitectura del software a medida y seleccionamos las tecnologías óptimas." },
  { icon: Code2, label: "Implementación", desc: "Desarrollamos el código, conectamos las APIs y configuramos tu entorno sin cortes de servicio." },
  { icon: GraduationCap, label: "Formación", desc: "Capacitamos a tu equipo con sesiones guiadas e intuitivas para una adopción inmediata." },
  { icon: LifeBuoy, label: "Soporte Continuo", desc: "Monitorizamos los sistemas en tiempo real para adaptarlos y escalarlos con tu crecimiento." }
];

const SUIT_MODULES = [
  {
    id: "ia",
    title: "La Solapa: Inteligencia Artificial",
    desc: "Integración de LLMs, clasificación automática de correos, generación de contenido, agentes inteligentes de WhatsApp y dashboards analíticos para la toma de decisiones rápidas.",
    x: "top-10 left-[62%]",
    markerColor: "bg-accent-violet"
  },
  {
    id: "crm",
    title: "El Núcleo: CRM Personalizado",
    desc: "Un sistema de ventas que rastrea leads automáticamente sin que tu equipo olvide dar seguimiento. Campos, pipelines y embudos diseñados exactamente para tu ciclo comercial.",
    x: "top-[42%] left-[45%]",
    markerColor: "bg-accent-cyan"
  },
  {
    id: "integrations",
    title: "Las Mangas: Conexiones & APIs",
    desc: "Unión fluida de ERPs, pasarelas de pago, correo, herramientas de diseño o logística. Eliminamos el tener que copiar y pegar información entre pestañas para siempre.",
    x: "top-[55%] left-[22%]",
    markerColor: "bg-accent-blue"
  },
  {
    id: "cloud",
    title: "El Forro: Nube, Seguridad & Soporte",
    desc: "Infraestructura robusta alojada de forma segura bajo regulaciones europeas (RGPD). Escalabilidad garantizada para soportar cualquier volumen de ventas.",
    x: "top-[70%] left-[58%]",
    markerColor: "bg-white"
  }
];

export default function AxentiaSolution() {
  const { openModal } = useModal();
  const [activeModule, setActiveModule] = useState(SUIT_MODULES[0]);

  return (
    <section id="solucion" className="py-24 relative overflow-hidden bg-bg-deep">
      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-accent-cyan/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-accent-violet/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-cyan font-bold">
            Filosofía Central de Axentia
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Creamos el <span className="text-gradient-cyan-blue">traje tecnológico perfecto</span> para tu empresa
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            No creemos en soluciones cerradas que encorsetan tu negocio. Diseñamos la arquitectura que se adapta con precisión milimétrica a tus operaciones y escala contigo.
          </p>
        </div>

        {/* Interactive Suit Metaphor Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Left Column: Visual Suit Vector Diagram */}
          <div className="relative flex justify-center py-10 rounded-3xl border border-white/5 bg-white/[0.01] glass-panel h-[480px]">
            {/* Ambient circle glow behind suit */}
            <div className="absolute inset-0 m-auto w-[280px] h-[280px] bg-gradient-to-tr from-accent-blue/10 via-accent-cyan/10 to-accent-violet/10 blur-[50px] rounded-full pointer-events-none animate-pulse" />
            
            {/* Sleek SVG Suit Jacket Outline */}
            <svg
              className="w-full h-full max-h-[360px] text-slate-700/40 relative z-10"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              {/* Shoulders and Jacket Outline */}
              <path d="M25,20 L38,12 L50,22 L62,12 L75,20 L72,55 L75,85 L50,90 L25,85 L28,55 Z" />
              {/* Lapels */}
              <path d="M38,12 L43,35 L50,55 L57,35 L62,12" strokeWidth="1" />
              <path d="M43,35 L47,38 L50,55 L53,38 L57,35" strokeWidth="0.8" />
              {/* Collar Line */}
              <path d="M38,12 L50,25 L62,12" />
              {/* Tie */}
              <path d="M48,22 L52,22 L53,30 L50,38 L47,30 Z" fill="rgba(255,255,255,0.05)" />
              {/* Buttons */}
              <circle cx="50" cy="62" r="1" fill="currentColor" />
              <circle cx="50" cy="70" r="1" fill="currentColor" />
              {/* Left Sleeve crease */}
              <path d="M25,20 L20,50 L22,75 L28,75" />
              {/* Right Sleeve crease */}
              <path d="M75,20 L80,50 L78,75 L72,75" />
              {/* Inner Vest Line */}
              <path d="M41,35 L41,60 L50,65 L59,60 L59,35" strokeDasharray="2,2" />
            </svg>

            {/* Suit Interactive Hotspots */}
            {SUIT_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod)}
                className={`absolute ${mod.x} z-20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeModule.id === mod.id
                    ? "scale-120 ring-4 ring-accent-cyan/30 text-white"
                    : "hover:scale-110 text-slate-400 hover:text-white"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                <span className={`absolute inset-0 rounded-full animate-ping opacity-35 ${mod.markerColor}`} />
                <span className={`w-3.5 h-3.5 rounded-full ${mod.markerColor} border-2 border-bg-deep`} />
              </button>
            ))}
          </div>

          {/* Right Column: Dynamic Info Card Box */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-wider text-accent-cyan font-semibold">
              Módulos del Traje Tecnológico
            </span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.01] glass-panel space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-10 rounded-full bg-gradient-to-b from-accent-cyan to-accent-blue" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {activeModule.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeModule.desc}
                </p>
                <div className="flex items-center gap-2 text-xs text-accent-cyan font-bold pt-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>100% Personalizable e Integrado</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Selector Grid pills */}
            <div className="grid grid-cols-2 gap-3">
              {SUIT_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod)}
                  className={`py-3 px-4 rounded-xl border text-xs text-left font-semibold transition-all cursor-pointer ${
                    activeModule.id === mod.id
                      ? "bg-accent-blue/15 border-accent-blue text-white shadow-md shadow-accent-blue/5"
                      : "bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {mod.title.split(": ")[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Process Phases Roadmap */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Nuestro Proceso de Implementación
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Desde la auditoría inicial hasta la mejora continua. Un acompañamiento estratégico en 7 fases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col items-center text-center relative group"
                >
                  {/* Step bubble label number */}
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono text-[9px] text-slate-400 font-semibold group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan transition-colors">
                    {index + 1}
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl text-slate-300 group-hover:text-accent-cyan group-hover:bg-accent-cyan/10 transition-colors mt-2">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h4 className="text-xs font-bold text-white mt-4 tracking-tight leading-tight">
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => openModal("audit")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-8 rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              Solicitar Auditoría Tecnológica Rápida
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
