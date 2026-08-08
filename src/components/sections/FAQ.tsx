"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "¿Necesito conocimientos técnicos para trabajar con Axentia?",
    a: "En absoluto. Nuestro equipo se encarga de toda la arquitectura, el desarrollo y la configuración técnica. Tú solo necesitas explicarnos cómo funciona tu negocio. Además, incluimos formación personalizada para que tu equipo adopte las nuevas herramientas de forma rápida e intuitiva desde el primer día."
  },
  {
    q: "¿Cuánto tarda en estar listo un proyecto tecnológico a medida?",
    a: "Depende de la complejidad. Para un proyecto a medida con flujos integrales (CRM, telefonía y automatización de WhatsApp), el tiempo promedio es de 4 a 8 semanas. Si necesitas un ecosistema completo con integraciones avanzadas e Inteligencia Artificial, el plazo suele ser de 3 a 6 meses. Además, como trabajamos pensando en clientes que no tienen conocimientos técnicos y que usan la IA para gestionar su día a día, incluimos siempre documentación estructurada paso a paso y formación en lenguaje sencillo para que puedas controlarlo todo fácilmente."
  },
  {
    q: "¿Trabajáis con pequeñas empresas o sólo con grandes corporaciones?",
    a: "Trabajamos con pymes, autónomos y empresas en crecimiento de 2 a 500 empleados. De hecho, creemos que las empresas medianas son donde la automatización y la IA tienen el mayor impacto proporcional, ya que liberan capacidad operativa sin necesidad de contratar más personal."
  },
  {
    q: "¿Qué incluye exactamente una Auditoría Tecnológica Gratuita?",
    a: "Nuestra auditoría incluye: (1) Reunión estratégica de descubrimiento con tu equipo, (2) Análisis de tus procesos y herramientas actuales, (3) Identificación de cuellos de botella y fugas de tiempo/dinero, y (4) Borrador de propuesta de Traje Tecnológico con las soluciones recomendadas. Sin ningún coste ni compromiso."
  },
  {
    q: "¿El software o automatizaciones que diseñáis pertenecen a mi empresa?",
    a: "Sí, al 100%. A diferencia de las soluciones estándar de software de suscripción (SaaS) donde pagas licencias de por vida y no posees nada, todo el traje tecnológico, código e integraciones que diseñemos para tu negocio te pertenecerán por completo, eliminando dependencias forzadas."
  },
  {
    q: "¿Ofrecéis soporte continuo una vez implementado el sistema?",
    a: "Siempre. No desaparecemos tras el lanzamiento. Todos nuestros proyectos incluyen un plan de soporte con monitorización activa, actualizaciones de seguridad, mejoras iterativas y un gestor de cuenta dedicado. A medida que tu negocio crece, el sistema evoluciona contigo."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-bg-darker">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-violet font-bold">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Todo lo que necesitas{" "}
            <span className="text-gradient-purple-cyan">saber antes de empezar</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "border-accent-cyan/20 bg-bg-deep"
                  : "border-white/5 bg-white/[0.01] hover:border-white/10"
              }`}
            >
              <button
                id={`faq-question-${index}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer group"
              >
                <span className={`text-sm font-bold transition-colors ${openIndex === index ? "text-accent-cyan" : "text-white group-hover:text-accent-cyan"}`}>
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                    openIndex === index ? "rotate-180 text-accent-cyan" : "text-slate-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                      <div className="h-px bg-white/5 mb-4" />
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
