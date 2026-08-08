"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Calendar, Sparkles, MessageCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const WHATSAPP_NUMBER = "34722406500";

type CtaAction = "audit" | "meeting" | "whatsapp";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  cta?: {
    label: string;
    action: CtaAction;
  };
}

interface Intent {
  id: string;
  question: string;
  test: (q: string) => boolean;
  answer: string;
  cta?: { label: string; action: CtaAction };
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const AUDIT_CTA = { label: "Solicitar auditoría gratis", action: "audit" as const };
const MEETING_CTA = { label: "Agendar una llamada", action: "meeting" as const };
const WHATSAPP_CTA = { label: "Hablar por WhatsApp", action: "whatsapp" as const };

// Ordered from most specific to most generic: the first match wins.
const INTENTS: Intent[] = [
  {
    id: "greeting",
    question: "¡Hola!",
    test: (q) => /^\s*(hola|holis|buenas|hey|ey|que tal|buen dia|buenos dias|buenas tardes|buenas noches)\b/.test(q),
    answer: "¡Hola! Puedo contarte cómo trabajamos, qué incluye la auditoría gratuita, qué tecnologías usamos, si trabajamos con personas físicas o autónomos, y ponerte en contacto con el equipo. ¿Qué te gustaría saber?",
  },
  {
    id: "thanks",
    question: "Gracias",
    test: (q) => /^\s*(gracias|muchas gracias|genial|perfecto|excelente|buenisimo|dale)[\s!.]*$/.test(q),
    answer: "¡De nada! Si te surge otra duda, escribime cuando quieras.",
  },
  {
    id: "farewell",
    question: "Chau",
    test: (q) => /^\s*(chau|adios|nos vemos|hasta luego|bye|hasta pronto)\b/.test(q),
    answer: "¡Gracias por escribirnos! Cuando quieras retomamos la conversación. 👋",
  },
  {
    id: "individuals",
    question: "¿Trabajan también con personas físicas o autónomos?",
    test: (q) => /particular|persona fisica|autonom|freelance|individual/.test(q),
    answer: "Sí, trabajamos tanto con empresas como con personas físicas y autónomos. En el formulario podés elegir la opción \"Persona física\" y contarnos tu caso puntual.",
    cta: AUDIT_CTA,
  },
  {
    id: "pricing",
    question: "¿Cuánto cuesta la auditoría?",
    test: (q) => /precio|costo|cuesta|tarifa|presupuesto|cobran|cuanto sale/.test(q),
    answer: "La auditoría inicial es 100% gratuita y sin compromiso. El costo de implementación depende del alcance de cada proyecto: una vez que analizamos tu caso te armamos un presupuesto a medida.",
    cta: AUDIT_CTA,
  },
  {
    id: "contact_human",
    question: "Quiero hablar con una persona",
    test: (q) => /hablar con (alguien|una persona|un humano)|persona real|asesor|atencion al cliente|numero de telefono|contactar/.test(q),
    answer: "¡Claro! Te paso directo con el equipo por WhatsApp para que te atiendan personalmente.",
    cta: WHATSAPP_CTA,
  },
  {
    id: "privacy",
    question: "¿Cómo manejan mis datos?",
    test: (q) => /rgpd|proteccion de datos|privacidad|seguridad de (los )?datos/.test(q),
    answer: "Cumplimos con el RGPD (Reglamento General de Protección de Datos), la garantía europea de privacidad, en todo lo que implementamos.",
  },
  {
    id: "duration",
    question: "¿Cuánto tarda el proceso?",
    test: (q) => /cuanto tarda|cuanto dura|cuanto tiempo|plazo/.test(q),
    answer: "Los tiempos varían según el proyecto: la auditoría gratuita te la entregamos en pocos días, y el plazo de implementación se define según el alcance detectado en tu caso.",
    cta: AUDIT_CTA,
  },
  {
    id: "sectors",
    question: "¿Con qué sectores trabajan?",
    test: (q) => /sector|rubro|tipo de empresa/.test(q),
    answer: "Trabajamos con empresas y personas físicas de cualquier sector: comercio, servicios, hostelería, salud, y más. Lo importante es detectar qué proceso te está haciendo perder tiempo.",
    cta: AUDIT_CTA,
  },
  {
    id: "audit_details",
    question: "¿Qué incluye la Auditoría?",
    test: (q) => /audito|gratis|diagnostico|incluye/.test(q),
    answer: "Nuestra Auditoría gratuita incluye: análisis de tus flujos de trabajo, identificación de cuellos de botella y un diagnóstico de oportunidades de automatización e IA, sin coste.",
    cta: AUDIT_CTA,
  },
  {
    id: "technologies",
    question: "¿Qué tecnologías utilizáis?",
    test: (q) => /tecnolog|herramient|stack|make|n8n|zapier/.test(q),
    answer: "Trabajamos con automatizaciones (Make, n8n, Zapier), desarrollo a medida (Next.js/React), y modelos de Inteligencia Artificial integrados en tus flujos de trabajo.",
    cta: MEETING_CTA,
  },
  {
    id: "no_coding",
    question: "¿Es necesario saber programación?",
    test: (q) => /programa|conocimiento tecnic|saber programar|se tecnico/.test(q),
    answer: "Para nada. Nosotros nos encargamos de toda la implementación y formamos a tu equipo para que la transición sea fluida.",
    cta: AUDIT_CTA,
  },
  {
    id: "how_we_work",
    question: "¿Cómo trabajáis en Axentia?",
    test: (q) => /trabaj|funcion|que es axentia|como es el proceso/.test(q),
    answer: "Primero auditamos tus procesos (ventas, administración, operaciones) y detectamos cuellos de botella. Luego diseñamos e implementamos las herramientas a medida, con soporte y formación para tu equipo.",
    cta: AUDIT_CTA,
  },
];

const PRESET_IDS = ["how_we_work", "audit_details", "technologies", "individuals", "pricing", "no_coding"];
const PRESETS = PRESET_IDS.map((id) => INTENTS.find((i) => i.id === id)!);

const FALLBACK_ANSWERS = [
  "No estoy segura de haber entendido bien tu consulta. Puedo contarte cómo trabajamos, qué incluye la auditoría gratuita, qué tecnologías usamos o si trabajamos con personas físicas. Si preferís, te paso con el equipo por WhatsApp.",
  "Esa consulta me queda un poco grande todavía. Te recomiendo pedir la auditoría gratuita para que lo veamos en detalle, o hablar directo con el equipo por WhatsApp.",
];
let fallbackIndex = 0;

function getBotResponse(rawText: string): { text: string; cta?: Message["cta"] } {
  const query = normalize(rawText);
  const intent = INTENTS.find((i) => i.test(query));
  if (intent) {
    return { text: intent.answer, cta: intent.cta };
  }
  const text = FALLBACK_ANSWERS[fallbackIndex % FALLBACK_ANSWERS.length];
  fallbackIndex += 1;
  return { text, cta: WHATSAPP_CTA };
}

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

    const { text: answer, cta } = getBotResponse(text);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: nextMsgId(),
        sender: "bot",
        text: answer,
        timestamp: new Date(),
        cta,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handlePresetClick = (intent: Intent) => {
    const userMsg: Message = { id: nextMsgId(), sender: "user", text: intent.question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId(),
          sender: "bot",
          text: intent.answer,
          timestamp: new Date(),
          cta: intent.cta,
        },
      ]);
    }, 900);
  };

  const handleCtaClick = (action: CtaAction) => {
    if (action === "whatsapp") {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Axentia, vengo del chat de la web y quería hacerles una consulta.")}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
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
                        ) : msg.cta.action === "whatsapp" ? (
                          <MessageCircle className="w-3.5 h-3.5" />
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
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className="text-xs bg-white hover:bg-primary/10 border border-navy/10 text-navy/70 hover:text-navy px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer"
                    >
                      {preset.question}
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
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Axentia, me gustaría solicitar una auditoría tecnológica gratuita de mi negocio.")}`}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-3 bg-navy text-white text-xs py-2 px-3.5 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap pointer-events-none"
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
