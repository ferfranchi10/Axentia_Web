"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function FinalCTA() {
  const { openModal } = useModal();
  return (
    <section className="py-24 relative overflow-hidden bg-bg-deep">
      {/* Rich ambient glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-violet/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-xs text-accent-cyan font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Auditoría 100% Gratuita · Sin Compromiso
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Descubre el potencial{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient-cyan-blue">oculto de tu empresa</span>
          </h2>

          {/* Body */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Solicita una auditoría tecnológica gratuita para identificar los procesos que pueden optimizarse, automatizarse o transformarse con herramientas a medida. <strong className="text-white">Sin tecnicismos. Sin compromisos.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openModal("audit")}
              className="w-full sm:w-auto bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-blue text-white font-bold py-4 px-10 rounded-2xl hover:opacity-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xl shadow-accent-cyan/20 group text-sm"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Solicitar Auditoría Gratuita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openModal("meeting")}
              className="w-full sm:w-auto border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-white font-bold py-4 px-10 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              Hablar con un Consultor
            </button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Respuesta en &lt;24h
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              0€ de coste inicial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
              Confidencialidad garantizada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
              Desarrollo 100% a medida
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
