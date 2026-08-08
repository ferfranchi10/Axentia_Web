"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sliders, Database, UserCheck, Users, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function Problem() {
  const { openModal } = useModal();
  const [employees, setEmployees] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(25);

  // Math constants for B2B consultancy calculations
  // Average hours wasted per employee per week due to manual/unintegrated tools is estimated at 6.5 hours.
  const wastedHoursPerWeek = 6.5;
  const weeksPerYear = 48;
  const annualHoursWasted = Math.round(employees * wastedHoursPerWeek * weeksPerYear);
  const annualCapitalLost = Math.round(annualHoursWasted * hourlyRate);

  const problemsList = [
    {
      icon: Clock,
      title: "Procesos Manuales",
      desc: "Tu equipo gasta horas valiosas picando datos a mano en hojas de cálculo e informes redundantes.",
    },
    {
      icon: Sliders,
      title: "Pérdida de Tiempo",
      desc: "Buscar archivos, sincronizar estados y re-enviar correos consume hasta el 25% de la jornada.",
    },
    {
      icon: Database,
      title: "Información Dispersa",
      desc: "Datos repartidos entre Excels, WhatsApp y notas. Nadie tiene una foto completa del negocio.",
    },
    {
      icon: UserCheck,
      title: "Falta de Seguimiento",
      desc: "Clientes potenciales que se enfrían por no tener flujos de comunicación automáticos ni un CRM configurado.",
    },
    {
      icon: Users,
      title: "Descoordinación",
      desc: "Departamentos desconectados que trabajan en silos y duplican tareas constantemente.",
    },
    {
      icon: TrendingDown,
      title: "Oportunidades Perdidas",
      desc: "Decisiones lentas por falta de dashboards de métricas en tiempo real. Tu competencia avanza más rápido.",
    },
  ];

  return (
    <section id="problema" className="py-24 relative overflow-hidden bg-bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-violet font-bold">
            El Coste de la Ineficiencia
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            La mayoría de empresas trabajan con herramientas que{" "}
            <span className="text-gradient-purple-cyan">no fueron diseñadas para ellas</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Usar software estándar te obliga a adaptar tus procesos al programa, en lugar de que el programa potencie tus procesos.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {problemsList.map((prob, index) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-white/10 group"
              >
                <div className="p-3 bg-white/5 rounded-xl text-slate-300 w-fit group-hover:text-accent-cyan group-hover:bg-accent-cyan/15 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mt-4 group-hover:text-accent-cyan transition-colors">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {prob.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Live Capital Leak Calculator Block */}
        <div className="rounded-3xl border border-white/10 bg-bg-deep p-6 md:p-10 relative overflow-hidden glass-panel">
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-accent-blue/10 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-accent-cyan font-bold">
                  Diagnóstico Financiero Rápido
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Calcula las fugas ocultas de tu negocio
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Ajusta los deslizadores para ver cuánto capital y horas de trabajo pierde tu equipo anualmente debido a ineficiencias y tareas redundantes.
                </p>
              </div>

              {/* Slider 1: Employees */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Nº de Empleados Administrativos/Ventas:</span>
                  <span className="text-accent-cyan font-bold text-sm">{employees} personas</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={employees}
                  onChange={(e) => setEmployees(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>

              {/* Slider 2: Hourly Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Coste de hora medio del empleado (con SS):</span>
                  <span className="text-accent-cyan font-bold text-sm">{hourlyRate} €/hora</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 relative">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Pérdida de horas anuales:</span>
                  <span className="text-lg md:text-xl font-bold text-white">{annualHoursWasted.toLocaleString()} h</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Capital anual desperdiciado:</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-red-400">{annualCapitalLost.toLocaleString()} €</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/15 rounded-xl p-3 flex gap-2 items-start text-xs text-red-200">
                <TrendingDown className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Impacto directo:</strong> El capital perdido equivale a la contratación de{" "}
                  <strong>{Math.max(1, Math.round(annualCapitalLost / (hourlyRate * weeksPerYear * 40)))} profesionales</strong> a tiempo completo para tareas de crecimiento estratégico.
                </span>
              </div>

              <button
                onClick={() => openModal("audit")}
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/15 group text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Quiero una Auditoría Gratuita de mis Procesos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Slogan Closure */}
        <div className="text-center mt-16">
          <p className="text-white text-lg sm:text-xl font-extrabold tracking-tight">
            “Si usas herramientas genéricas, <span className="text-gradient-cyan-blue">estás limitando tu crecimiento.</span>”
          </p>
        </div>

      </div>
    </section>
  );
}
