"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos Martínez",
    role: "Director General",
    company: "Grupo Inmobiliario Sur",
    avatar: "CM",
    quote: "Antes tardábamos 72h en responder leads de Idealista. Con el sistema de Axentia respondemos en menos de 1 minuto y hemos duplicado las visitas concertadas en 3 meses.",
    metrics: [
      { label: "Tiempo respuesta", val: "-98%" },
      { label: "Visitas/mes", val: "+112%" },
    ],
    rating: 5,
    color: "from-accent-blue to-accent-cyan"
  },
  {
    name: "Laura Sánchez",
    role: "Directora de Operaciones",
    company: "Asesoría Contable Sánchez",
    avatar: "LS",
    quote: "El lector IA de documentos nos ha ahorrado más de 340 horas al mes. El equipo no puede imaginar volver a clasificar PDFs a mano. Fue la mejor inversión tecnológica de los últimos 5 años.",
    metrics: [
      { label: "Horas ahorradas/mes", val: "340h" },
      { label: "Errores contables", val: "-99%" },
    ],
    rating: 5,
    color: "from-accent-violet to-accent-blue"
  },
  {
    name: "Pep Vilanova",
    role: "Propietario",
    company: "Restaurante Vilanova",
    avatar: "PV",
    quote: "El chatbot de WhatsApp de Axentia llena nuestro restaurante solo. En temporada alta gestionamos 85 reservas diarias sin tocar el teléfono. Las reseñas de Google pasaron de 4.1 a 4.8.",
    metrics: [
      { label: "Reservas automatizadas", val: "85/día" },
      { label: "Puntuación Google", val: "4.1 → 4.8" },
    ],
    rating: 5,
    color: "from-accent-cyan to-accent-violet"
  },
  {
    name: "Ana Ferreira",
    role: "CEO & Fundadora",
    company: "Boutique Moda Ferreira",
    avatar: "AF",
    quote: "Nuestros clientes ahora reciben ofertas personalizadas por WhatsApp y vuelven a comprar solos. El ROI de las campañas automatizadas es de 6.8x. Axentia cambió cómo entendemos el marketing.",
    metrics: [
      { label: "ROI campañas", val: "6.8x" },
      { label: "Tasa repetición", val: "+45%" },
    ],
    rating: 5,
    color: "from-accent-blue to-accent-violet"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-bg-deep">
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-cyan font-bold">
            Prueba Social con Métricas Reales
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Empresas que ya visten su{" "}
            <span className="text-gradient-cyan-blue">Traje Tecnológico</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            No hablamos de &quot;transformación digital&quot; en abstracto. Aquí están los números reales de nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.01] glass-card flex flex-col justify-between gap-6"
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="w-8 h-8 text-white/5 absolute -top-2 -left-2" />
                <p className="text-sm text-slate-200 leading-relaxed italic relative z-10">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-2 gap-3">
                {t.metrics.map((m, mi) => (
                  <div
                    key={mi}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl text-center"
                  >
                    <p className="text-lg font-extrabold text-white">{m.val}</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 font-semibold">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
