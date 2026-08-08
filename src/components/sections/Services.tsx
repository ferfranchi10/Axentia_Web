"use client";

import { motion } from "framer-motion";
import { Activity, BrainCircuit, FileSearch, Wrench } from "lucide-react";

const SERVICES_LIST = [
  {
    icon: Activity,
    title: "Automatización",
    text: "Reducimos tareas repetitivas.",
  },
  {
    icon: BrainCircuit,
    title: "Integración de IA",
    text: "Implementamos soluciones inteligentes.",
  },
  {
    icon: FileSearch,
    title: "Optimización de procesos",
    text: "Detectamos cuellos de botella.",
  },
  {
    icon: Wrench,
    title: "Herramientas personalizadas",
    text: "Creamos soluciones adaptadas a tu empresa.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
            Qué hacemos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES_LIST.map((serv, index) => {
            const Icon = serv.icon;
            return (
              <motion.div
                key={serv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="soft-card rounded-2xl p-6 text-center flex flex-col items-center gap-3"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-navy">{serv.title}</h3>
                <p className="text-sm text-text-muted">{serv.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
