"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import InteractiveNodesBg from "../ui/InteractiveNodesBg";
import { useModal } from "@/context/ModalContext";

export default function Hero() {
  const { openModal } = useModal();
  // Stagger animation container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-bg-darker via-bg-deep to-bg-darker">
      {/* Canvas Interactive Nodes connection */}
      <InteractiveNodesBg />

      {/* Atmospheric Background Highlights */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent-blue/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-accent-violet/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-xs text-accent-cyan font-bold tracking-wider uppercase backdrop-blur-sm animate-float">
            <Sparkles className="w-3.5 h-3.5" />
            No vendemos software estándar. Diseñamos estrategia.
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            <span className="text-white">Tecnología diseñada para</span>
            <br />
            <span className="text-gradient-cyan-blue">impulsar tu negocio</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed"
          >
            <span className="text-white font-bold">No creemos en soluciones estándar.</span>
            <br className="hidden sm:inline" />
            Analizamos tu empresa, detectamos oportunidades y creamos herramientas tecnológicas personalizadas que automatizan procesos, aumentan ventas y potencian tu crecimiento.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => openModal("audit")}
              className="w-full sm:w-auto bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-blue text-white font-bold py-4 px-8 rounded-2xl hover:opacity-95 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/20 group text-sm"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              Solicitar Auditoría Gratuita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Key Metrics strip */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 pt-12 max-w-xl mx-auto border-t border-white/5"
          >
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white text-gradient-cyan-blue">100%</p>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">A Medida</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white text-gradient-cyan-blue">+340h</p>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Ahorro Mensual Medio</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white text-gradient-cyan-blue">RGPD</p>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Garantía Europea</p>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Down arrow link indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce pointer-events-none">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
