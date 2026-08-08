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
  { q: "¿Cómo trabajáis en Axentia?", a: "Primero auditamos tus procesos (ventas, administración, operaciones) y detectamos cuellos de botella. Luego diseñamos e implementamos las herramientas a medida, con soporte y formación para tu equipo." },
  { q: "¿Qué incluye la Auditoría?", a: "Nuestra Auditoría gratuita incluye: análisis de tus flujos de trabajo, identificación de cuellos de botella y un diagnóstico de oportunidades de automatización e IA, sin coste." },
  { q: "¿Qué tecnologías utilizáis?", a: "Trabajamos con automatizaciones (Make, n8n, Zapier), desarrollo a medida (Next.js/React), y modelos de Inteligencia Artificial integrados en tus flujos de trabajo." },
  { q: "¿Es necesario saber programación?", a: "Para nada. Nosotros nos encargamos de toda la implementación y formamos a tu equipo para que la transición sea fluida." },
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
      text: "¡Hola! Soy Axelia, la asistente de Axentia. ¿En qué te gustaría mejorar la eficiencia de tu empresa?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: nextMsgId(), sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      let matchedAns = "";
      const query = text.toLowerCase();

      if (query.includes("trabaj") || query.includes("funcion") || query.includes("que es")) {
        matchedAns = PRESETS[0].a;
      } else if (query.includes("audito") || query.includes("gratis") || query.includes("diagnostico")) {
        matchedAns = PRESETS[1].a;
      } else if (query.includes("tecnolog") || query.includes("herramient") || query.includes("stack")) {
        matchedAns = PRESETS[2].a;
      } else if (query.includes("program") || query.includes("tecnic") || query.includes("saber")) {
        matchedAns = PRESETS[3].a;
      } else {
        matchedAns = "En Axentia analizamos cada caso de forma consultiva para diseñar herramientas que automaticen tareas y ahorren tiempo. Te recomiendo pedir la auditoría gratuita para que lo veamos en detalle.";
      }

      const botMsg: Message = {
        id: nextMsgId(),
        sender: "bot",
        text: matchedAns,
        timestamp: new Date(),
        cta: { label: "Solicitar auditoría gratis", action: "audit" },
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handlePresetClick = (q: string, a: string) => {
    const userMsg: Message = { id: nextMsgId(), sender: "user", text: q, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId(),
          sender: "bot",
          text: a,
          timestamp: new Date(),
          cta: q.includes("tecnologías")
            ? { label: "Agendar una llamada", action: "meeting" }
            : { label: "Solicitar auditoría gratis", action: "audit" },
        },
      ]);
    }, 900);
  };

  const handleCtaClick = (action: "audit" | "meeting") => {
    setIsOpen(false);
    if (action === "meeting") {
      openModal();
    } else {
      document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[340px] md:w-[380px] h-[520px] overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-2xl flex flex-col"
          >
            {/* Widget Header */}
            <div className="p-4 border-b border-navy/5 bg-bg-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/15 text-primary rounded-xl relative">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                    Axelia
                    <Sparkles className="w-3 h-3 text-primary shrink-0" />
                  </h4>
                  <span className="text-[10px] text-green-600 font-medium">Asistente Activa</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
                className="p-1 rounded-lg border border-navy/10 text-navy/50 hover:text-navy transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-bg-soft text-navy rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.cta && (
                      <button
                        onClick={() => handleCtaClick(msg.cta!.action)}
                        className="mt-3 w-full bg-primary text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                  <div className="bg-bg-soft rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Presets */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 border-t border-navy/5 bg-bg-soft space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-1">
                  Preguntas frecuentes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.q}
                      onClick={() => handlePresetClick(preset.q, preset.a)}
                      className="text-xs bg-white hover:bg-primary/10 border border-navy/10 text-navy/70 hover:text-navy px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer"
                    >
                      {preset.q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-navy/5 bg-white flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-bg-soft border border-navy/10 rounded-xl px-4 py-2.5 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                aria-label="Enviar mensaje"
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons Bar */}
      <div className="flex items-center gap-3">
        <a
          href="https://wa.me/34722406500?text=Hola%20Axentia,%20me%20gustar%C3%ADa%20solicitar%20una%20auditor%C3%ADa%20tecnol%C3%B3gica%20gratuita%20de%20mi%20negocio."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg shadow-green-500/25 hover:scale-110 transition-all flex items-center justify-center shrink-0 cursor-pointer duration-300 relative group"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute right-full mr-2 bg-navy text-white text-xs py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            WhatsApp Directo
          </span>
        </a>

        <div className="relative">
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10, y: -2 }}
                animate={{ opacity: 1, x: 0, y: -2 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-navy text-white text-xs py-2 px-3.5 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap pointer-events-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>¿Hablamos con nuestra asistente?</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setShowTooltip(false);
            }}
            aria-label="Abrir chat"
            className={`p-4 rounded-full text-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isOpen ? "bg-navy" : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
