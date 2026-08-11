"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Code2, Globe, Workflow, Lock, Palette } from "lucide-react";

const TEAM = [
  {
    icon: ShieldCheck,
    title: "Ciberseguridad",
    text: "Protección de datos y sistemas ante amenazas.",
  },
  {
    icon: Code2,
    title: "Programación y desarrollo",
    text: "Software y automatizaciones a medida.",
  },
  {
    icon: Globe,
    title: "Desarrollo web",
    text: "Sitios y plataformas propias para cada negocio.",
  },
  {
    icon: Workflow,
    title: "Automatización de procesos",
    text: "Integraciones con n8n, Make y herramientas similares.",
  },
  {
    icon: Lock,
    title: "Protección de datos (RGPD)",
    text: "Cumplimiento normativo en cada proyecto.",
  },
  {
    icon: Palette,
    title: "Diseño y marketing digital",
    text: "Identidad visual y presencia online.",
  },
];

const HIGHLIGHTS = [
  "+15 años en administración y gestión de empresas",
  "Experiencia en dirección de proyectos de gran envergadura",
  "Automatización e IA aplicada a procesos reales",
];

export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="py-20 sm:py-24 bg-bg-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
            Quiénes somos
          </h2>
        </div>

        {/* Founder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="soft-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
        >
          <div className="shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden">
            <Image
              src="/team/fernando-franchi.jpg"
              alt="Fernando Franchi"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-navy">Fernando Franchi</h3>
              <p className="text-sm text-primary font-semibold">Fundador y CEO de Axentia</p>
            </div>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Fernando cuenta con más de 15 años de experiencia en administración y dirección de
              empresas en los sectores energético, hotelero e industrial. Su trayectoria incluye
              la dirección de proyectos de gran envergadura y la gestión integral de una compañía
              propia, lo que le permite identificar con precisión los procesos que generan
              pérdidas de tiempo y dinero en una pyme. Hoy aplica ese conocimiento a la
              automatización y la integración de inteligencia artificial en la gestión
              empresarial, desarrollando herramientas a medida para cada cliente.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {HIGHLIGHTS.map((item) => (
                <span
                  key={item}
                  className="text-xs font-semibold text-navy/80 bg-navy/5 rounded-full px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <div className="mt-14">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-navy">
              Un equipo de especialistas para cada proyecto
            </h3>
            <p className="text-sm sm:text-base text-text-muted">
              Axentia trabaja con una red de consultores externos que aportan profundidad técnica
              en las áreas donde más se necesita, sin la carga de una estructura fija.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="soft-card rounded-2xl p-6 flex flex-col items-center text-center gap-3"
                >
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-navy">{role.title}</h4>
                  <p className="text-sm text-text-muted">{role.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
