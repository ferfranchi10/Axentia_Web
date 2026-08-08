"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const WHATSAPP_NUMBER = "34722406500";

const SECTOR_TOOLS = [
  { id: "excel", label: "Excel / Google Sheets" },
  { id: "crm", label: "CRM (Hubspot, Zoho, Salesforce)" },
  { id: "erp", label: "ERP / Software de Facturación" },
  { id: "whatsapp", label: "WhatsApp manual" },
  { id: "email_marketing", label: "Email Marketing" },
  { id: "none", label: "Sin herramientas (Desde cero)" },
];

export default function BookingModal() {
  const { isOpen, closeModal: onClose, type: initialType } = useModal();
  const [type, setType] = useState<"audit" | "meeting">(initialType);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "1-10",
    phone: "",
    bottleneck: "manual_tasks",
    otherBottleneck: "",
    currentTools: [] as string[],
    manualProcess: "",
    toolsToConnect: "",
    mainGoal: "save_time",
  });

  // Adjust state during render when isOpen changes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setType(initialType);
    setStep(1);
    setSubmitError("");
  }

  // Focus trap and accessibility keyboard navigation helper
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = document.getElementById("booking-modal-container");
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const timer = setTimeout(() => {
      firstElement?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToolToggle = (toolId: string) => {
    setFormData((prev) => {
      let updatedTools;
      if (toolId === "none") {
        // Clear all and select none
        updatedTools = prev.currentTools.includes("none") ? [] : ["none"];
      } else {
        // Filter out none and toggle current
        const withoutNone = prev.currentTools.filter((id) => id !== "none");
        updatedTools = withoutNone.includes(toolId)
          ? withoutNone.filter((id) => id !== toolId)
          : [...withoutNone, toolId];
      }
      return { ...prev, currentTools: updatedTools };
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((s) => s + 1);
  };

  const handlePrevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/audit/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo procesar la solicitud.");
      }

      setStep(4); // Advance to completion screen
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setSubmitError(err instanceof Error ? err.message : "Error de red al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSubmitError("");
    setFormData({
      name: "",
      email: "",
      company: "",
      teamSize: "1-10",
      phone: "",
      bottleneck: "manual_tasks",
      otherBottleneck: "",
      currentTools: [],
      manualProcess: "",
      toolsToConnect: "",
      mainGoal: "save_time",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
            className="fixed inset-0 bg-bg-darker/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="booking-modal-container"
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full ${
              type === "meeting" || (type === "audit" && step === 2) ? "max-w-3xl" : "max-w-2xl"
            } overflow-hidden rounded-2xl border border-white/10 bg-bg-deep p-6 md:p-8 shadow-2xl z-10 glass-panel my-8`}
          >
            {/* Ambient background glows */}
            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-accent-cyan/10 blur-[50px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-50px] left-[-50px] w-[150px] h-[150px] bg-accent-violet/10 blur-[50px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
              <div>
                <span className="text-xs uppercase tracking-wider text-accent-cyan font-semibold">
                  {type === "audit" ? "Auditoría Estratégica" : "Consultoría Estratégica"}
                </span>
                <h3 className="text-xl md:text-2xl font-bold mt-1 text-white">
                  {type === "audit" ? "Solicitar Auditoría Tecnológica" : "Agendar Reunión de Estrategia"}
                </h3>
              </div>
              <button
                onClick={resetModal}
                className="p-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress indicators (Only for Audit type and not on completion screen) */}
            {type === "audit" && step < 4 && (
              <div className="mt-4 flex items-center justify-between gap-4 relative z-10">
                <div className="flex-1 flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        s <= step ? "bg-gradient-to-r from-accent-cyan to-accent-blue" : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Paso {step} de 3
                </span>
              </div>
            )}

            {/* Tab toggler (only on step 1) */}
            {step === 1 && (
              <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl mt-6 relative z-10">
                <button
                  type="button"
                  onClick={() => setType("audit")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    type === "audit"
                      ? "bg-accent-blue text-white shadow-md shadow-accent-blue/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Auditoría Gratuita
                </button>
                <button
                  type="button"
                  onClick={() => setType("meeting")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    type === "meeting"
                      ? "bg-accent-blue text-white shadow-md shadow-accent-blue/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Reservar Reunión
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="mt-6 relative z-10">
              <AnimatePresence mode="wait">
                {/* ── STAGE 1: Contact Details ── */}
                {step === 1 && type === "audit" && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <form onSubmit={handleNextStep} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="modal-name" className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                          <input
                            id="modal-name"
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Juan Pérez"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="modal-email" className="block text-xs font-semibold text-slate-300 mb-1">Email Corporativo</label>
                          <input
                            id="modal-email"
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="juan@empresa.com"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="modal-company" className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Empresa</label>
                          <input
                            id="modal-company"
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Empresa S.L."
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="modal-phone" className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp</label>
                          <input
                            id="modal-phone"
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+34 600 000 000"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/10 group"
                        >
                          Continuar al Diagnóstico
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ── STAGE 2: Tools & Bottleneck ── */}
                {step === 2 && type === "audit" && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <form onSubmit={handleNextStep} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Team Size */}
                        <div>
                          <label htmlFor="modal-teamSize" className="block text-xs font-semibold text-slate-300 mb-1.5">Tamaño del Equipo</label>
                          <select
                            id="modal-teamSize"
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                          >
                            <option value="1-10">1 - 10 empleados</option>
                            <option value="11-50">11 - 50 empleados</option>
                            <option value="51-200">51 - 200 empleados</option>
                            <option value="200+">Más de 200 empleados</option>
                          </select>
                        </div>

                        {/* Bottleneck Selector */}
                        <div>
                          <label htmlFor="modal-bottleneck" className="block text-xs font-semibold text-slate-300 mb-1.5">Mayor cuello de botella tecnológico</label>
                          <select
                            id="modal-bottleneck"
                            name="bottleneck"
                            value={formData.bottleneck}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                          >
                            <option value="manual_tasks">Tareas manuales redundantes y pérdida de tiempo</option>
                            <option value="data_silos">Información dispersa en mil herramientas diferentes</option>
                            <option value="lost_leads">Falta de seguimiento a clientes / Pérdida de ventas</option>
                            <option value="team_coordination">Descoordinación de equipos y flujos</option>
                            <option value="outdated_tech">Sistemas antiguos que frenan el crecimiento</option>
                            <option value="other">Otros (especificar...)</option>
                          </select>
                        </div>
                      </div>

                      {/* Custom bottleneck input */}
                      {formData.bottleneck === "other" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="relative z-10"
                        >
                          <label htmlFor="modal-other-bottleneck" className="block text-xs font-semibold text-slate-300 mb-1">Especifica tu cuello de botella</label>
                          <input
                            id="modal-other-bottleneck"
                            type="text"
                            name="otherBottleneck"
                            required
                            value={formData.otherBottleneck}
                            onChange={handleInputChange}
                            placeholder="Describe brevemente el problema principal..."
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                          />
                        </motion.div>
                      )}

                      {/* Active Tools Selector (Grid) */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                          ¿Qué herramientas utilizas actualmente en tu día a día? (Selecciona todas las que apliquen)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {SECTOR_TOOLS.map((tool) => {
                            const isSelected = formData.currentTools.includes(tool.id);
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleToolToggle(tool.id)}
                                className={`p-3 rounded-xl border text-xs text-left font-bold transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? "bg-accent-blue/15 border-accent-cyan text-white shadow-md shadow-accent-cyan/5"
                                    : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                                }`}
                              >
                                <span className="line-clamp-1">{tool.label}</span>
                                {isSelected && (
                                  <div className="p-0.5 bg-accent-cyan text-bg-darker rounded-full">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="w-1/3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-sm"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/15 group"
                        >
                          Siguiente paso
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ── STAGE 3: Processes & Goals ── */}
                {step === 3 && type === "audit" && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Priority Target Goal */}
                      <div>
                        <label htmlFor="modal-mainGoal" className="block text-xs font-semibold text-slate-300 mb-1">
                          ¿Cuál es tu objetivo prioritario con esta auditoría?
                        </label>
                        <select
                          id="modal-mainGoal"
                          name="mainGoal"
                          value={formData.mainGoal}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                        >
                          <option value="save_time">Ahorrar tiempo y automatizar tareas manuales</option>
                          <option value="increase_sales">Aumentar ventas y mejorar seguimiento de clientes</option>
                          <option value="team_coordination">Mejorar la coordinación del equipo y flujos de información</option>
                          <option value="modernize_systems">Modernizar sistemas antiguos y escalar tecnología</option>
                        </select>
                      </div>

                      {/* Manual Process detail */}
                      <div>
                        <label htmlFor="modal-manualProcess" className="block text-xs font-semibold text-slate-300 mb-1">
                          ¿Qué proceso manual o repetitivo te quita más tiempo y te gustaría eliminar?
                        </label>
                        <textarea
                          id="modal-manualProcess"
                          name="manualProcess"
                          required
                          value={formData.manualProcess}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="Ej: Traspasar datos a mano desde facturas en PDF a una plantilla de Excel todos los lunes..."
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-all resize-none"
                        />
                      </div>

                      {/* Integrations detail */}
                      <div>
                        <label htmlFor="modal-toolsToConnect" className="block text-xs font-semibold text-slate-300 mb-1">
                          ¿Qué herramientas o sistemas te gustaría conectar/integrar?
                        </label>
                        <textarea
                          id="modal-toolsToConnect"
                          name="toolsToConnect"
                          required
                          value={formData.toolsToConnect}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="Ej: Quiero que cuando un cliente pida cita en Calendly, se cree en mi CRM y le mande un WhatsApp automático..."
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-all resize-none"
                        />
                      </div>

                      {submitError && (
                        <p className="text-xs text-red-400 font-semibold">{submitError}</p>
                      )}

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-2">
                        <ShieldCheck className="w-4 h-4 text-accent-cyan shrink-0" />
                        <span>Tus datos están protegidos bajo estricto acuerdo de confidencialidad y RGPD.</span>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="w-1/3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-sm"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-2/3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/15 text-sm"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                               Procesando Diagnóstico...
                            </>
                          ) : (
                            "Solicitar Mi Auditoría Gratuita"
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ── STAGE 4: Success Screen ── */}
                {step === 4 && type === "audit" && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-5"
                  >
                    <div className="inline-flex p-4 bg-accent-cyan/15 text-accent-cyan rounded-full">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-white">
                        ¡Auditoría Solicitada!
                      </h4>
                      <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                        Tu solicitud de auditoría para <strong>{formData.company || "tu empresa"}</strong> ha sido enviada con éxito.
                      </p>
                      <p className="text-slate-400 max-w-md mx-auto text-xs leading-relaxed">
                        Te hemos enviado un correo de confirmación a <strong>{formData.email}</strong>. En menos de 24 horas laborables nos pondremos en contacto contigo para presentarte tu diagnóstico gratuito.
                      </p>
                    </div>

                    {/* WhatsApp Click-to-Chat Button */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hola, soy ${formData.name} de ${formData.company || "mi empresa"}. Acabo de solicitar la auditoría tecnológica a través del formulario.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-green-500/20"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.376l-.36-.213-3.76.895.952-3.67-.233-.374A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
                        </svg>
                        Contactar de inmediato por WhatsApp
                      </a>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 max-w-sm mx-auto text-xs text-slate-400 space-y-2">
                      <div className="flex justify-between">
                        <span>Contacto:</span>
                        <span className="text-white">{formData.name} {formData.company ? `(${formData.company})` : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estado:</span>
                        <span className="text-green-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                          Analizando Diagnóstico
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={resetModal}
                      className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold py-2.5 px-8 rounded-xl transition-all cursor-pointer text-sm"
                    >
                      Volver a la Web
                    </button>
                  </motion.div>
                )}

                {/* ── MEETING CALENDLY VIEW ── */}
                {type === "meeting" && (
                  <motion.div
                    key="calendly"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full rounded-2xl overflow-hidden border border-white/5 bg-bg-deep"
                    style={{ height: "600px" }}
                  >
                    <iframe
                      src="https://calendly.com/axentia-consulting/reunion-de-estrategia-axentia?embed_domain=localhost&embed_type=Inline&background_color=090e1a&text_color=ffffff&primary_color=06b6d4&hide_landing_page_details=1"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      title="Calendly"
                      className="bg-transparent"
                      loading="lazy"
                    ></iframe>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
