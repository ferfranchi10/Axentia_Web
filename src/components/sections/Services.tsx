"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  Activity,
  BrainCircuit,
  MessageSquareCode,
  Users2,
  GitBranch,
  Rocket,
  LineChart,
  ArrowUpRight
} from "lucide-react";
import { useModal } from "@/context/ModalContext";

const SERVICES_LIST = [
  {
    icon: FileSearch,
    title: "Auditorías Tecnológicas",
    features: ["Análisis de ineficiencias de flujos", "Diagnóstico de cuellos de botella", "Informe de viabilidad de automatizaciones"],
    outcome: "Multiplicador de eficiencia: 1.5x",
    glow: "hover:shadow-accent-cyan/10"
  },
  {
    icon: Activity,
    title: "Automatización Inteligente",
    features: ["Orquestación de flujos administrativos", "Eliminación de tareas redundantes", "Sincronización de ERPs y bases de datos"],
    outcome: "Ahorro de tiempo medio: -75%",
    glow: "hover:shadow-accent-blue/10"
  },
  {
    icon: BrainCircuit,
    title: "Inteligencia Artificial Aplicada",
    features: ["Integración de modelos LLM avanzados", "Clasificación inteligente de correos/documentos", "Agentes lógicos generadores de informes"],
    outcome: "Productividad del equipo: +40%",
    glow: "hover:shadow-accent-violet/10"
  },
  {
    icon: MessageSquareCode,
    title: "Chatbots Empresariales",
    features: ["Canales automáticos de atención al cliente", "Agentes de reserva por WhatsApp", "Captación e integración de leads con CRM"],
    outcome: "Tasa de conversión de leads: +28%",
    glow: "hover:shadow-accent-cyan/10"
  },
  {
    icon: Users2,
    title: "CRM Personalizados",
    features: ["Adaptación a tu pipeline de ventas único", "Alertas y disparadores de seguimiento automáticos", "Paneles de control y control de comisiones"],
    outcome: "Fugas de clientes potenciales: 0%",
    glow: "hover:shadow-accent-blue/10"
  },
  {
    icon: GitBranch,
    title: "Integración de Sistemas",
    features: ["Conexión de APIs de terceros", "Migración de bases de datos antiguas", "Sistemas unificados en tiempo real"],
    outcome: "Errores humanos por picado: -99%",
    glow: "hover:shadow-accent-violet/10"
  },
  {
    icon: Rocket,
    title: "Transformación Digital",
    features: ["Evolución de software legacy", "Formación en metodologías de trabajo ágiles", "Modernización de infraestructura en la nube"],
    outcome: "Adaptabilidad al mercado: Máxima",
    glow: "hover:shadow-accent-cyan/10"
  },
  {
    icon: LineChart,
    title: "Consultoría Estratégica",
    features: ["Roadmaps de crecimiento tecnológico", "Selección de tecnologías escalables", "Asesoría B2B en arquitectura IT"],
    outcome: "Retorno de inversión (ROI): ~3.5x",
    glow: "hover:shadow-accent-blue/10"
  }
];

export default function Services() {
  const { openModal } = useModal();
  return (
    <section id="servicios" className="py-24 relative overflow-hidden bg-bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-violet font-bold">
            Capacidades Consultivas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Nuestros <span className="text-gradient-purple-cyan">Servicios Especializados</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Desarrollamos e integramos los componentes precisos que necesita tu empresa para erradicar procesos lentos, fugas de capital y descoordinación.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_LIST.map((serv, index) => {
            const Icon = serv.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.01] glass-card ${serv.glow}`}
              >
                <div>
                  {/* Icon + Top Action */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/5 rounded-xl text-slate-300 group-hover:text-accent-cyan group-hover:bg-accent-cyan/15 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => openModal("audit")}
                      className="text-slate-500 group-hover:text-accent-cyan opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mt-5 group-hover:text-accent-cyan transition-colors">
                    {serv.title}
                  </h3>

                  {/* Bullet points */}
                  <ul className="mt-4 space-y-2 text-[11px] text-slate-400">
                    {serv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5 leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0 mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expected Return metrics */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                  <span className="text-slate-500">Métrica clave:</span>
                  <span className="text-accent-cyan font-bold bg-accent-cyan/10 px-2 py-0.5 rounded">
                    {serv.outcome.split(": ")[1]}
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner bottom */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-xs font-semibold">
            ¿No sabes por dónde empezar?{" "}
            <button
              onClick={() => openModal("audit")}
              className="text-accent-cyan hover:underline hover:text-accent-cyan/90 transition-all font-bold cursor-pointer inline-flex items-center gap-1"
            >
              Agenda un autodiagnóstico preliminar
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>

      </div>
    </section>
  );
}
