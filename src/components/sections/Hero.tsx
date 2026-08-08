"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import InteractiveNodesBg from "../ui/InteractiveNodesBg";
import { useModal } from "@/context/ModalContext";

export default function Hero() {
  const { openModal } = useModal();

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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-white">
      <InteractiveNodesBg />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-navy"
          >
            Descubrí qué procesos de tu empresa podés optimizar hoy mismo
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed"
          >
            Auditoría gratuita para detectar mejoras, automatizaciones e integraciones tecnológicas que te ahorren tiempo y dinero.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#formulario"
              className="w-full sm:w-auto bg-primary text-white font-bold py-4 px-8 rounded-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25 group text-sm sm:text-base"
            >
              Solicitar auditoría gratuita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto text-navy font-semibold py-4 px-6 rounded-2xl border border-navy/15 hover:border-navy/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4" />
              Prefiero agendar una llamada
            </button>
          </motion.div>

          {/* Key Metrics strip */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 pt-10 max-w-lg mx-auto border-t border-navy/10"
          >
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">100%</p>
              <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-semibold mt-1">A Medida</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">+340h</p>
              <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-semibold mt-1">Ahorro Mensual</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">RGPD</p>
              <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-semibold mt-1">Garantía Europea</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
