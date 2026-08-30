// Etapas del pipeline comercial del motor de prospección.
// Ver PROYECTO_MOTOR_PROSPECCION_AXENTIA_V2_TARRAGONA.md, sección 24.
export const LEAD_STATUSES = [
  "NUEVO",
  "CALIFICADO",
  "CONTACTAR",
  "CONTACTADO",
  "RESPUESTA",
  "REUNION",
  "PROPUESTA",
  "NEGOCIACION",
  "GANADO",
  "PERDIDO",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

// Un color por etapa, compartido entre el pipeline, el dashboard y cualquier
// otra pantalla que necesite representar el status visualmente — para no
// repetir la paleta en cada archivo.
export const STAGE_COLOR: Record<LeadStatus, { dot: string; bar: string; ring: string; solid: string }> = {
  NUEVO: { dot: "bg-slate-400", bar: "bg-slate-400/70", ring: "border-slate-400/50", solid: "#94a3b8" },
  CALIFICADO: { dot: "bg-accent-cyan", bar: "bg-accent-cyan/70", ring: "border-accent-cyan/50", solid: "#06b6d4" },
  CONTACTAR: { dot: "bg-amber-400", bar: "bg-amber-400/70", ring: "border-amber-400/50", solid: "#fbbf24" },
  CONTACTADO: { dot: "bg-amber-400", bar: "bg-amber-400/70", ring: "border-amber-400/50", solid: "#fbbf24" },
  RESPUESTA: { dot: "bg-accent-violet", bar: "bg-accent-violet/70", ring: "border-accent-violet/50", solid: "#6366f1" },
  REUNION: { dot: "bg-accent-violet", bar: "bg-accent-violet/70", ring: "border-accent-violet/50", solid: "#6366f1" },
  PROPUESTA: { dot: "bg-blue-400", bar: "bg-blue-400/70", ring: "border-blue-400/50", solid: "#60a5fa" },
  NEGOCIACION: { dot: "bg-blue-400", bar: "bg-blue-400/70", ring: "border-blue-400/50", solid: "#60a5fa" },
  GANADO: { dot: "bg-emerald-400", bar: "bg-emerald-400/70", ring: "border-emerald-400/50", solid: "#34d399" },
  PERDIDO: { dot: "bg-red-400", bar: "bg-red-400/70", ring: "border-red-400/50", solid: "#f87171" },
};
