"use client";

import { useState } from "react";
import { CheckCircle2, Send, AlertCircle, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "34722406500";

const NEEDS_OPTIONS = [
  { id: "facturacion", label: "Facturación" },
  { id: "gestion_administrativa", label: "Gestión administrativa" },
  { id: "seguimiento_clientes", label: "Seguimiento de clientes" },
  { id: "reportes_automaticos", label: "Reportes automáticos" },
  { id: "integracion_sistemas", label: "Integración de sistemas" },
  { id: "ia_automatizacion", label: "IA / automatización" },
  { id: "otro", label: "Otro" },
];

const initialFormState = {
  clientType: "empresa" as "empresa" | "particular",
  companyName: "",
  sector: "",
  teamSize: "1-10",
  needs: [] as string[],
  otherNeed: "",
  description: "",
  fullName: "",
  email: "",
  phone: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function AuditForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setClientType = (clientType: "empresa" | "particular") => {
    setFormData((prev) => ({ ...prev, clientType }));
  };

  const toggleNeed = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(id)
        ? prev.needs.filter((n) => n !== id)
        : [...prev.needs, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo procesar la solicitud.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Error de red al enviar el formulario.");
    }
  };

  if (status === "success") {
    return (
      <section id="formulario" className="py-20 sm:py-24 bg-bg-soft">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mb-3">
            ¡Solicitud enviada con éxito!
          </h2>
          <p className="text-text-muted leading-relaxed mb-6">
            Te enviamos un correo de confirmación a <strong className="text-navy">{formData.email}</strong>.
            Nuestro equipo revisará tu caso y se pondrá en contacto pronto.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              formData.clientType === "particular"
                ? `Hola, soy ${formData.fullName}. Acabo de solicitar la auditoría gratuita en la web.`
                : `Hola, soy ${formData.fullName} de ${formData.companyName || "mi empresa"}. Acabo de solicitar la auditoría gratuita en la web.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            Hablar ahora por WhatsApp
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="formulario" className="py-20 sm:py-24 bg-bg-soft">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
            Contanos qué querés mejorar
          </h2>
          <p className="text-text-muted text-sm sm:text-base">
            Respondé este breve cuestionario y analizaremos tu caso sin compromiso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="soft-card rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Tipo de cliente */}
          <div>
            <span className="block text-sm font-semibold text-navy mb-2.5">
              Consulto como
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setClientType("empresa")}
                className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  formData.clientType === "empresa"
                    ? "bg-primary/10 border-primary text-navy"
                    : "bg-white border-navy/10 text-navy/70 hover:border-navy/20"
                }`}
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => setClientType("particular")}
                className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  formData.clientType === "particular"
                    ? "bg-primary/10 border-primary text-navy"
                    : "bg-white border-navy/10 text-navy/70 hover:border-navy/20"
                }`}
              >
                Persona física
              </button>
            </div>
          </div>

          {/* Empresa */}
          {formData.clientType === "empresa" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-navy mb-1.5">
                    Nombre de la empresa
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Mi Empresa S.L."
                    className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="sector" className="block text-sm font-semibold text-navy mb-1.5">
                    Sector / actividad
                  </label>
                  <input
                    id="sector"
                    name="sector"
                    type="text"
                    required
                    value={formData.sector}
                    onChange={handleChange}
                    placeholder="Ej. Comercio, servicios, hostelería..."
                    className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-sm font-semibold text-navy mb-1.5">
                  Cantidad aproximada de empleados
                </label>
                <select
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="1-10">1 - 10 empleados</option>
                  <option value="11-50">11 - 50 empleados</option>
                  <option value="51-200">51 - 200 empleados</option>
                  <option value="200+">Más de 200 empleados</option>
                </select>
              </div>
            </>
          )}

          {formData.clientType === "particular" && (
            <div>
              <label htmlFor="sector" className="block text-sm font-semibold text-navy mb-1.5">
                Área de interés (opcional)
              </label>
              <input
                id="sector"
                name="sector"
                type="text"
                value={formData.sector}
                onChange={handleChange}
                placeholder="Ej. Finanzas personales, trámites, organización..."
                className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          )}

          {/* Necesidades */}
          <div>
            <span className="block text-sm font-semibold text-navy mb-2.5">
              ¿Qué necesitás mejorar? (elegí todas las que apliquen)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NEEDS_OPTIONS.map((option) => {
                const isChecked = formData.needs.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                      isChecked
                        ? "bg-primary/10 border-primary text-navy"
                        : "bg-white border-navy/10 text-navy/70 hover:border-navy/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleNeed(option.id)}
                      className="w-4 h-4 accent-primary shrink-0"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
            {formData.needs.includes("otro") && (
              <input
                type="text"
                name="otherNeed"
                value={formData.otherNeed}
                onChange={handleChange}
                placeholder="Contanos brevemente qué otra cosa necesitás"
                className="mt-3 w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-navy mb-1.5">
              Contanos brevemente qué problema querés resolver
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Perdemos mucho tiempo pasando datos de facturas a mano a una planilla..."
              className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-navy mb-1.5">
                Nombre y apellido
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-navy mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@empresa.com"
                className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-1.5">
              Teléfono / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+34 600 000 000"
              className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25 text-base"
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar solicitud gratuita
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
