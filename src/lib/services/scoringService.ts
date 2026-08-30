// LeadScoringService (Fase 8, sección 15). Score 0-100, hipótesis inicial
// ajustable — no una verdad definitiva. Cada sub-score se explica con
// motivos concretos para nunca mostrar "SCORE 87" sin más (sección 16).
import type { DigitalAuditResult } from "./digitalAuditService";

export interface ScoringInput {
  companySize: string | null;
  estimatedEmployees: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  contactName: string | null;
  opportunityCount: number;
  audit: DigitalAuditResult | null;
}

export interface ScoringResult {
  digitalPresenceScore: number;
  technologyNeedScore: number;
  economicPotentialScore: number;
  serviceFitScore: number;
  contactabilityScore: number;
  leadScore: number;
  priority: "HOT" | "ALTO" | "MEDIO" | "BAJO" | "MUY_BAJO";
  reasons: string[];
}

const WEIGHTS = {
  technologyNeed: 0.3,
  economicPotential: 0.25,
  serviceFit: 0.2,
  contactability: 0.15,
  digitalPresence: 0.1,
};

function classifyPriority(score: number): ScoringResult["priority"] {
  if (score >= 90) return "HOT";
  if (score >= 80) return "ALTO";
  if (score >= 65) return "MEDIO";
  if (score >= 50) return "BAJO";
  return "MUY_BAJO";
}

export function computeLeadScore(input: ScoringInput): ScoringResult {
  const reasons: string[] = [];

  // Presencia digital: directamente lo que detectó la auditoría (0 si nunca se auditó).
  const digitalPresenceScore = input.audit?.technologyScore ?? 0;
  if (input.audit?.auditStatus === "DETECTADO") {
    reasons.push(`Presencia digital detectada: ${digitalPresenceScore}/100.`);
  } else {
    reasons.push("Todavía no se corrió una auditoría digital completa (presencia digital = 0).");
  }

  // Necesidad tecnológica: inversa a la presencia digital — cuanto menos
  // tiene, más necesita. Es la hipótesis central del motor.
  const technologyNeedScore = 100 - digitalPresenceScore;
  if (technologyNeedScore >= 70) {
    reasons.push("Necesidad tecnológica alta: se detectan pocas herramientas digitales en uso.");
  } else if (technologyNeedScore <= 30) {
    reasons.push("Necesidad tecnológica baja: el negocio ya tiene buena presencia digital.");
  }

  // Potencial económico: sin enriquecimiento externo (Fase 6) todavía, se
  // aproxima por tamaño declarado si existe; si no, valor neutro.
  let economicPotentialScore = 50;
  if (input.estimatedEmployees !== null) {
    economicPotentialScore = Math.max(20, Math.min(90, 30 + input.estimatedEmployees * 3));
    reasons.push(`Potencial económico estimado por tamaño (${input.estimatedEmployees} empleados aprox.).`);
  } else if (input.companySize) {
    reasons.push(`Potencial económico estimado por tamaño declarado (${input.companySize}).`);
  } else {
    reasons.push("Potencial económico: sin datos de tamaño, se usa un valor neutro (50) hasta enriquecer el dato.");
  }

  // Encaje con servicios: cuantas más oportunidades detectadas, mejor encaja
  // con el catálogo de servicios de Axentia (CRM, automatización, web...).
  const serviceFitScore = Math.min(100, input.opportunityCount * 18);
  if (input.opportunityCount > 0) {
    reasons.push(`Se detectaron ${input.opportunityCount} oportunidad${input.opportunityCount === 1 ? "" : "es"} de encaje con servicios de Axentia.`);
  } else {
    reasons.push("No se detectaron oportunidades claras de encaje con el catálogo de servicios todavía.");
  }

  // Facilidad de contacto: cuántos canales de contacto tenemos cargados.
  const contactSignals = [input.phone, input.email, input.website, input.contactName];
  const contactabilityScore = Math.round((contactSignals.filter(Boolean).length / contactSignals.length) * 100);
  if (contactabilityScore < 50) {
    reasons.push("Facilidad de contacto baja: faltan datos de contacto (teléfono, email o referente).");
  } else {
    reasons.push("Facilidad de contacto adecuada: hay varios canales para llegar al negocio.");
  }

  const leadScore = Math.round(
    technologyNeedScore * WEIGHTS.technologyNeed +
      economicPotentialScore * WEIGHTS.economicPotential +
      serviceFitScore * WEIGHTS.serviceFit +
      contactabilityScore * WEIGHTS.contactability +
      digitalPresenceScore * WEIGHTS.digitalPresence
  );

  return {
    digitalPresenceScore,
    technologyNeedScore,
    economicPotentialScore,
    serviceFitScore,
    contactabilityScore,
    leadScore,
    priority: classifyPriority(leadScore),
    reasons,
  };
}
