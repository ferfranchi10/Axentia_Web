"use client";

import { XCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function Differentiation() {
  const { openModal } = useModal();
  const othersPitfalls = [
    { title: "Software Genérico", desc: "Forzado a adaptar tus flujos de trabajo a las limitaciones del programa." },
    { title: "Soluciones Cerradas", desc: "Dificultad extrema para conectar APIs o migrar bases de datos legacy." },
    { title: "Soporte Limitado", desc: "Respuestas lentas por bots o sistemas de tickets automatizados impersonales." },
    { title: "Implementación Estándar", desc: "Falta de formación real. Tu equipo lucha solo para aprender la herramienta." },
  ];

  const axentiaStrengths = [
    { title: "Soluciones a Medida", desc: "Código e integraciones moldeadas exactamente según tus operaciones actuales." },
    { title: "Consultoría Estratégica", desc: "No somos picacodigos. Aportamos ideas de crecimiento para vender más." },
    { title: "Acompañamiento Continuo", desc: "Soporte preventivo directo. Formamos personalmente a toda tu plantilla." },
    { title: "Tecnología Adaptada", desc: "Unión perfecta de tus bases de datos, WhatsApp, CRM e Inteligencia Artificial." },
    { title: "Evolución Constante", desc: "El software crece y se actualiza a medida que tu negocio escala." },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-violet font-bold">
            Posicionamiento
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            La diferencia entre usar software genérico y{" "}
            <span className="text-gradient-purple-cyan">diseñar tu propio traje</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            El software estándar está diseñado para millones de empresas promedio. Tú no eres promedio.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Competitor Block - Muted & Gray */}
          <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.01] opacity-70 hover:opacity-85 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-slate-500 mb-6">
              <XCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-wider">Otros Enfoques</h3>
            </div>
            
            <div className="space-y-6">
              {othersPitfalls.map((p, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-300">{p.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Axentia Block - Glowing, Vibrant */}
          <div className="p-6 md:p-8 rounded-3xl border border-accent-cyan/20 bg-bg-deep shadow-xl shadow-accent-cyan/5 relative glass-panel">
            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-accent-cyan/10 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-accent-cyan">
                <CheckCircle2 className="w-5 h-5 text-accent-cyan" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-gradient-cyan-blue">
                  Enfoque Axentia
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-cyan px-2 py-0.5 bg-accent-cyan/15 rounded-full animate-float">
                Premium
              </span>
            </div>

            <div className="space-y-6">
              {axentiaStrengths.map((p, index) => (
                <div key={index} className="flex gap-3">
                  <div className="text-accent-cyan shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {p.title}
                      {index === 0 && <Sparkles className="w-3 h-3 text-accent-violet animate-pulse" />}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => openModal("audit")}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-8 rounded-xl text-xs transition-all cursor-pointer"
          >
            Descubre tu Traje Tecnológico
          </button>
        </div>

      </div>
    </section>
  );
}
