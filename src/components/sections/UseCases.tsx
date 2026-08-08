"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Home, Briefcase, ShoppingBag, Check, Sparkles } from "lucide-react";

const CASES_DATA = [
  {
    id: "restaurante",
    icon: Utensils,
    sector: "Restauración",
    title: "Automatización de Reservas & WhatsApp CRM",
    problem: "Pérdida de llamadas durante el servicio, reservas de última hora sin registrar, falta de base de datos para fidelizar y sin opiniones en Google.",
    solution: "Un asistente de WhatsApp IA integrado que responde llamadas perdidas, agenda reservas directamente en el software de sala y envía encuestas de satisfacción automáticas al salir para conseguir reseñas de 5 estrellas.",
    metrics: [
      { label: "Reservas por WhatsApp", val: "+34%" },
      { label: "Opiniones de 5 estrellas", val: "+120/mes" },
      { label: "Horas de recepción libres", val: "40h/mes" }
    ],
    mockType: "whatsapp",
    mockMessages: [
      { sender: "client", text: "Hola, ¿tenéis mesa libre para cenar hoy a las 21:00?" },
      { sender: "bot", text: "¡Hola! Sí, tengo una última mesa para 4 personas en la zona exterior. ¿Te la reservo?" },
      { sender: "client", text: "Sí, por favor. A nombre de Carlos." },
      { sender: "bot", text: "¡Perfecto Carlos! Mesa confirmada para hoy a las 21:00. Te acabo de enviar el link de confirmación SMS." }
    ]
  },
  {
    id: "inmobiliaria",
    icon: Home,
    sector: "Real Estate / Inmobiliario",
    title: "Captación Automatizada & Cualificación de Leads",
    problem: "Leads fríos procedentes de Idealista/Fotocasa que tardan más de 24 horas en recibir respuesta. Agentes colapsados llamando a contactos sin filtrar.",
    solution: "Sincronizador automático que lee las solicitudes de los portales inmobiliarios en tiempo real, envía un cuestionario interactivo al lead en 1 minuto, lo cualifica por presupuesto y zona, y agenda la videollamada de visita en el calendario del agente.",
    metrics: [
      { label: "Tiempo de respuesta", val: "<1 min" },
      { label: "Leads cualificados solos", val: "88%" },
      { label: "Visitas concertadas", val: "+2.2x" }
    ],
    mockType: "dashboard",
    mockData: {
      title: "Cualificador Inmobiliario Real-Time",
      stats: [
        { label: "Total Leads", val: "1,240", change: "+18%" },
        { label: "Cualificados", val: "942", change: "+24%" }
      ],
      leads: [
        { name: "Ana Gómez", budget: "350k€", zone: "Norte", status: "Cualificado - Agendado" },
        { name: "Miguel Ruiz", budget: "120k€", zone: "Centro", status: "Bajo Presupuesto - En espera" }
      ]
    }
  },
  {
    id: "despacho",
    icon: Briefcase,
    sector: "Despachos / Asesorías / Legal",
    title: "Gestión Documental inteligente con IA",
    problem: "Horas perdidas buscando facturas, nóminas o cláusulas de contratos en carpetas desorganizadas. Retrasos en la presentación de impuestos.",
    solution: "Un lector OCR avanzado potenciado con IA que lee contratos y PDFs, extrae importes, nombres de clientes y fechas clave automáticamente, clasifica los documentos en sus carpetas correctas del servidor y genera el asiento contable borrador.",
    metrics: [
      { label: "Tiempo de lectura", val: "-90%" },
      { label: "Errores de introducción", val: "0.1%" },
      { label: "Papel/Archivos físicos", val: "0%" }
    ],
    mockType: "file-analyser",
    mockFile: {
      name: "Contrato_Servicios_V2.pdf",
      size: "2.4 MB",
      highlights: [
        { label: "Cliente", val: "Acme Holdings S.A." },
        { label: "Importe Anual", val: "125,000 €" },
        { label: "Renovación", val: "31/12/2026" }
      ]
    }
  },
  {
    id: "comercio",
    icon: ShoppingBag,
    sector: "Comercio / E-commerce / Retail",
    title: "Fidelización & Recuperación Automatizada de Clientes",
    problem: "Clientes que compran una sola vez y no vuelven. Carritos abandonados sin recuperar y marketing genérico sin segmentación.",
    solution: "Un motor de recomendación en base a compras anteriores que lanza ofertas ultra-personalizadas automáticas por WhatsApp, sistemas de puntos integrados en el TPV y flujos automáticos de recuperación tras 45 días sin comprar.",
    metrics: [
      { label: "Tasa de repetición", val: "+45%" },
      { label: "Carritos recuperados", val: "+21%" },
      { label: "ROI Campañas WhatsApp", val: "6.8x" }
    ],
    mockType: "loyalty",
    mockCampaign: {
      name: "Camp. Re-engagement 45 Días",
      sent: 2450,
      opened: "98% (WhatsApp)",
      clicks: "32%",
      sales: "12,450 €"
    }
  }
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(CASES_DATA[0]);

  return (
    <section id="casos" className="py-24 relative overflow-hidden bg-bg-deep">
      {/* Background decoration */}
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-wider text-accent-cyan font-bold">
            Automatización en Acción
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Casos de Uso en <span className="text-gradient-cyan-blue">sectores específicos</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            El software a medida se adapta a la realidad operativa de tu sector. Así es como resolvemos los problemas diarios de tu industria.
          </p>
        </div>

        {/* Tab Buttons bar */}
        <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl max-w-4xl mx-auto mb-12 overflow-x-auto whitespace-nowrap scrollbar-none">
          {CASES_DATA.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab.id === tab.id
                    ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/15"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.sector}
              </button>
            );
          })}
        </div>

        {/* Content Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto"
          >
            {/* Left Column: Descriptions and metrics */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent-cyan px-2 py-0.5 bg-accent-cyan/10 rounded-full w-fit">
                  {activeTab.sector}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
                  {activeTab.title}
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="text-red-400 font-bold uppercase tracking-wider text-[10px]">El Escenario Problema</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">{activeTab.problem}</p>
                </div>
                <div>
                  <h4 className="text-accent-cyan font-bold uppercase tracking-wider text-[10px]">El Traje Tecnológico Axentia</h4>
                  <p className="text-slate-200 mt-1 leading-relaxed">{activeTab.solution}</p>
                </div>
              </div>

              {/* Metrics Strips */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                {activeTab.metrics.map((m, index) => (
                  <div key={index} className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                    <p className="text-lg md:text-xl font-extrabold text-white text-gradient-cyan-blue">{m.val}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Mockup representation */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md h-[340px] rounded-2xl border border-white/10 bg-bg-darker relative overflow-hidden p-5 shadow-2xl glass-panel flex flex-col">
                {/* Header bar mock */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5 text-[10px] text-slate-500 font-bold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-white">Axentia Engine v1.8</span>
                  </div>
                  <span>DEMOSTRACIÓN</span>
                </div>

                <div className="flex-1 overflow-y-auto pt-3 text-slate-300">
                  {activeTab.mockType === "whatsapp" && (
                    /* Mock WhatsApp screen */
                    <div className="space-y-3 flex flex-col h-full justify-end">
                      {activeTab.mockMessages?.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === "client" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 text-xs flex flex-col ${
                              msg.sender === "client"
                                ? "bg-white/5 text-slate-200 rounded-bl-none border border-white/5"
                                : "bg-green-500/15 border border-green-500/20 text-green-100 rounded-br-none"
                            }`}
                          >
                            <span className="text-[8px] font-bold text-slate-500 mb-0.5">
                              {msg.sender === "client" ? "Cliente" : "Axentia WhatsApp Bot"}
                            </span>
                            <p className="leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab.mockType === "dashboard" && activeTab.mockData && (
                    /* Mock Lead Dashboard */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-xs font-bold text-white">{activeTab.mockData.title}</span>
                        <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                      </div>
                      
                      {/* Stat grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {activeTab.mockData.stats.map((s, idx) => (
                          <div key={idx} className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-bold">{s.label}</span>
                            <p className="text-sm font-bold text-white mt-0.5">{s.val}</p>
                            <span className="text-[8px] text-green-400">{s.change} vs ayer</span>
                          </div>
                        ))}
                      </div>

                      {/* Lead rows */}
                      <div className="space-y-1">
                        {activeTab.mockData.leads.map((l, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] p-2 bg-white/5 rounded">
                            <span className="font-semibold text-white">{l.name}</span>
                            <span className="text-slate-400">{l.budget}</span>
                            <span className="text-accent-cyan bg-accent-cyan/10 px-1 rounded">{l.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab.mockType === "file-analyser" && activeTab.mockFile && (
                    /* Mock File AI Analyzer */
                    <div className="space-y-4 flex flex-col justify-center h-full">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="p-2 bg-accent-violet/10 text-accent-violet rounded-lg">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{activeTab.mockFile.name}</p>
                          <p className="text-[9px] text-slate-500">{activeTab.mockFile.size}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Datos Extraídos por la IA:</p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {activeTab.mockFile.highlights.map((h, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] p-2 bg-white/5 rounded">
                              <span className="text-slate-400">{h.label}</span>
                              <span className="text-white font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                {h.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab.mockType === "loyalty" && activeTab.mockCampaign && (
                    /* Mock Loyalty recovery campaign stats */
                    <div className="space-y-4 flex flex-col justify-center h-full">
                      <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{activeTab.mockCampaign.name}</span>
                          <span className="text-[9px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded font-bold">Activo</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Automatización tras 45 días sin interacción de compra.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-white/5 rounded">
                          <span className="text-slate-500">Enviados (WhatsApp):</span>
                          <p className="font-bold text-white mt-0.5">{activeTab.mockCampaign.sent}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded">
                          <span className="text-slate-500">Tasa Apertura:</span>
                          <p className="font-bold text-white mt-0.5">{activeTab.mockCampaign.opened}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded">
                          <span className="text-slate-500">Clics en Oferta:</span>
                          <p className="font-bold text-white mt-0.5">{activeTab.mockCampaign.clicks}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-green-500/10 bg-green-500/5">
                          <span className="text-green-400">Ventas Recuperadas:</span>
                          <p className="font-bold text-green-300 mt-0.5">{activeTab.mockCampaign.sales}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
