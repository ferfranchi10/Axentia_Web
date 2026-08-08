"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Calendar, Sparkles, MessageCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  cta?: {
    label: string;
    action: "audit" | "meeting";
  };
}

const PRESETS = [
  { q: "¿Cómo trabajáis en Axentia?", a: "No vendemos software genérico. Primero auditamos tus procesos (ventas, administración, operaciones) y detectamos cuellos de botella. Luego diseñamos el 'traje tecnológico perfecto' a medida y lo implementamos con soporte y formación continua para tu equipo." },
  { q: "¿Qué incluye vuestra Auditoría?", a: "Nuestra Auditoría Tecnológica gratuita incluye: análisis completo de tus flujos de trabajo, identificación de cuellos de botella y fugas de tiempo/dinero, y un diagnóstico de oportunidades de automatización e IA. Te entregamos un borrador de plan estratégico sin coste." },
  { q: "¿Qué tecnologías utilizáis?", a: "Trabajamos con tecnologías de vanguardia adaptadas a cada necesidad: desde automatizaciones con Make, n8n y Zapier, hasta desarrollo de CRMs a medida con Next.js/React, bases de datos SQL/NoSQL, y modelos de Inteligencia Artificial (OpenAI, Anthropic) integrados directamente en tus flujos de trabajo." },
  { q: "¿Es necesario saber programación?", a: "Para nada. Nosotros nos encargamos de toda la arquitectura, integraciones y mantenimiento de las herramientas. Además, formamos personalmente a todo tu equipo para que la transición sea fluida, intuitiva y comiencen a ser productivos desde el día 1." }
];

let msgId = 0;
const nextMsgId = () => `msg-${++msgId}`;

export default function FloatingChatWidget() {
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: "¡Hola! Soy Axelia, la asistente inteligente de Axentia. 🤖 ¿De qué forma te gustaría mejorar la eficiencia y tecnología de tu empresa hoy?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Show hover tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: nextMsgId(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);

      // Simple match logic
      let matchedAns = "";
      const query = text.toLowerCase();

      if (query.includes("trabaj") || query.includes("funcion") || query.includes("que es")) {
        matchedAns = PRESETS[0].a;
      } else if (query.includes("audito") || query.includes("gratis") || query.includes("diagnostico")) {
        matchedAns = PRESETS[1].a;
      } else if (query.includes("tecnolog") || query.includes("herramient") || query.includes("stack") || query.includes("usais")) {
        matchedAns = PRESETS[2].a;
      } else if (query.includes("program") || query.includes("tecnic") || query.includes("saber")) {
        matchedAns = PRESETS[3].a;
      } else {
        matchedAns = "Interesante pregunta. En Axentia analizamos cada caso de manera consultiva y estratégica para diseñar herramientas que automaticen tareas y multipliquen tu facturación. Te recomiendo agendar una sesión estratégica sin compromiso para que un consultor senior te asesore detalladamente.";
      }

      // Append bot response
      const botMsg: Message = {
        id: nextMsgId(),
        sender: "bot",
        text: matchedAns,
        timestamp: new Date(),
        // Add conversion action
        cta: matchedAns.includes(" sesión ")
          ? { label: "Agendar Reunión de Estrategia", action: "meeting" }
          : { label: "Solicitar Auditoría Gratis", action: "audit" },
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handlePresetClick = (q: string, a: string) => {
    // Add user message
    const userMsg: Message = {
      id: nextMsgId(),
      sender: "user",
      text: q,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId(),
          sender: "bot",
          text: a,
          timestamp: new Date(),
          cta: q.includes("Auditoría")
            ? { label: "Solicitar Auditoría Gratis", action: "audit" }
            : q.includes("tecnologías") || q.includes("Tecnologías")
            ? { label: "Reservar Sesión de Estrategia", action: "meeting" }
            : { label: "Reservar Sesión de Estrategia", action: "meeting" },
        },
      ]);
    }, 1000);
  };

  const handleCtaClick = (action: "audit" | "meeting") => {
    setIsOpen(false);
    openModal(action);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Dynamic Chat Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[360px] md:w-[400px] h-[550px] overflow-hidden rounded-2xl border border-white/10 bg-bg-deep shadow-2xl glass-panel flex flex-col"
          >
            {/* Widget Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-cyan/15 text-accent-cyan rounded-xl relative">
                  <Bot className="w-5 h-5 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-darker" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Axelia
                    <Sparkles className="w-3 h-3 text-accent-violet shrink-0" />
                  </h4>
                  <span className="text-[10px] text-green-400 font-medium">Asesora IA Activa</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.sender === "user"
                        ? "bg-accent-blue text-white rounded-br-none"
                        : "bg-white/5 border border-white/5 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    
                    {/* Integrated Lead CTA inside messages */}
                    {msg.cta && (
                      <button
                        onClick={() => handleCtaClick(msg.cta!.action)}
                        className="mt-3 w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-2 px-3 rounded-lg text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-accent-cyan/10"
                      >
                        {msg.cta.action === "meeting" ? (
                          <Calendar className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {msg.cta.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Presets */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 border-t border-white/5 bg-slate-950/45 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1">
                  Preguntas frecuentes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetClick(preset.q, preset.a)}
                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer"
                    >
                      {preset.q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-white/5 bg-bg-deep flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                placeholder="Escribe tu consulta tecnológica..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="p-2.5 bg-accent-blue text-white rounded-xl hover:bg-accent-blue/90 transition-all cursor-pointer shadow-md shadow-accent-blue/20 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons Bar */}
      <div className="flex items-center gap-3">
        {/* WhatsApp Direct Hook */}
        <a
          href="https://wa.me/34722406500?text=Hola%20Axentia,%20me%20gustar%C3%ADa%20solicitar%20una%20auditor%C3%ADa%20tecnol%C3%B3gica%20gratuita%20de%20mi%20negocio."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg shadow-green-500/20 hover:scale-115 transition-all flex items-center justify-center shrink-0 cursor-pointer duration-300 relative group"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute right-full mr-2 bg-slate-900 border border-white/10 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            WhatsApp Directo
          </span>
        </a>

        {/* AI Chat Bubble Indicator with animated Tooltip */}
        <div className="relative">
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10, y: -2 }}
                animate={{ opacity: 1, x: 0, y: -2 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-slate-900 border border-white/10 text-white text-xs py-2 px-3.5 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap pointer-events-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                <span>¿Hablamos con nuestra Asesora IA?</span>
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-r border-t border-white/10 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setShowTooltip(false);
            }}
            className={`p-4 rounded-full text-white shadow-xl hover:scale-115 transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isOpen
                ? "bg-slate-800 border border-white/10 hover:bg-slate-700"
                : "bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-violet hover:shadow-accent-cyan/20 animate-pulse"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
