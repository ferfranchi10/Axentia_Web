"use client";

import { motion } from "framer-motion";
import { Eye, SearchCode, MapPin, HardHat, ShieldCheck, GraduationCap, TrendingUp, Sparkles } from "lucide-react";

const TIMELINE_STEPS = [
  {
    icon: Eye,
    label: "Descubrimos",
    title: "Escucha activa",
    desc: "Nos reunimos para entender tu visión de negocio, objetivos comerciales y procesos actuales de tu equipo."
  },
  {
    icon: SearchCode,
    label: "Analizamos",
    title: "Auditoría de fugas",
    desc: "Buceamos en tus herramientas, cronometramos tareas repetitivas y detectamos fugas de tiempo y dinero."
  },
  {
    icon: MapPin,
    label: "Diseñamos",
    title: "El Traje a medida",
    desc: "Elaboramos un borrador de arquitectura tecnológica con las APIs, CRMs y automatizaciones recomendadas."
  },
  {
    icon: HardHat,
    label: "Construimos",
    title: "Ingeniería premium",
    desc: "Desarrollamos el código, conectamos los sistemas, testeamos la seguridad y empaquetamos la solución."
  },
  {
    icon: ShieldCheck,
    label: "Implementamos",
    title: "Despliegue sin fricción",
    desc: "Lanzamos las herramientas en producción sin interrumpir el ritmo comercial ni parar tus operaciones diarias."
  },
  {
    icon: GraduationCap,
    label: "Formamos",
    title: "Capacitación guiada",
    desc: "Enseñamos a tu plantilla cómo usar las nuevas herramientas paso a paso para asegurar una adopción del 100%."
  },
  {
    icon: TrendingUp,
    label: "Escalamos",
    title: "Evolución de negocio",
    desc: "Añadimos integraciones avanzadas e Inteligencia Artificial a medida que tu negocio crece y lo requiere."
  }
];

export default function Methodology() {
  return (
    <section id="metodologia" className="py-24 relative overflow-hidden bg-bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-violet font-bold">
            Hoja de Ruta Estratégica
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Nuestra <span className="text-gradient-purple-cyan">Metodología de Trabajo</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            No creemos en la improvisación. Cada proyecto sigue un ciclo de vida estrictamente diseñado para asegurar el máximo retorno de inversión (ROI) tecnológico.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 relative">
          
          {/* Timeline connecting lines for desktop (simulated by layout styling) */}
          <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet opacity-20 pointer-events-none z-0" />

          {TIMELINE_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col items-center text-center relative z-10 group"
              >
                {/* Step Circle */}
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center relative group-hover:border-accent-cyan/40 group-hover:bg-accent-cyan/5 transition-all duration-300">
                  <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 bg-accent-cyan text-white text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full scale-90">
                    {step.label}
                  </div>
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-accent-cyan transition-colors" />
                </div>

                {/* Subtitles & Descriptions */}
                <h3 className="text-sm font-bold text-white mt-5 group-hover:text-accent-cyan transition-colors">
                  {step.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed max-w-[150px] mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Slogan closing block */}
        <div className="mt-20 p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.01] max-w-3xl mx-auto text-center relative glass-panel">
          <p className="text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse shrink-0" />
            Planificado para el Éxito Comercial
          </p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Nuestra metodología nos permite entregar soluciones completamente operativas en plazos sumamente eficientes, reduciendo los tiempos muertos y asegurando que tu equipo empiece a ahorrar horas de trabajo de inmediato.
          </p>
        </div>

      </div>
    </section>
  );
}
