// AIAnalysisService (Fase 9, secciones 18-19 del doc original). La IA es una
// capa de análisis, no controla el CRM directamente: recibe datos ya
// estructurados (empresa + auditoría + oportunidades ya detectadas por
// reglas) y devuelve una salida validada por esquema — nunca se guarda una
// respuesta libre de la IA tal cual.
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { DigitalAudit } from "@prisma/client";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

// Catálogo real de servicios de Axentia (ver src/components/sections/Services.tsx)
// — la IA solo puede recomendar de acá, nunca inventar servicios que no ofrecemos.
const AXENTIA_SERVICES = [
  "Automatización (reducir tareas repetitivas: recordatorios, flujos, integraciones)",
  "Integración de IA (chatbots, análisis, asistentes)",
  "Optimización de procesos (detectar y resolver cuellos de botella)",
  "Herramientas personalizadas (CRM, portal de clientes, sistema de reservas, formularios, web)",
].join("\n- ");

export const AIAnalysisSchema = z.object({
  problems: z.array(z.string()).describe("Problemas probables detectados, en tono de hipótesis"),
  opportunities: z.array(z.string()).describe("Oportunidades comerciales concretas"),
  recommended_services: z
    .array(z.string())
    .describe("Servicios de Axentia recomendados, tomados del catálogo dado"),
  commercial_argument: z
    .string()
    .describe("Argumento comercial breve, en español, tono consultivo, sin afirmar certezas"),
  confidence: z.number().min(0).max(100).describe("Confianza general del análisis, 0-100"),
  reasoning_summary: z.string().describe("Resumen breve del razonamiento detrás del análisis"),
});

export type AIAnalysisResult = z.infer<typeof AIAnalysisSchema>;

export class AIAnalysisError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "AIAnalysisError";
    this.status = status;
  }
}

export interface AIAnalysisInput {
  companyName: string;
  sector: string;
  subsector: string | null;
  city: string;
  audit: DigitalAudit | null;
  ruleBasedOpportunities: { title: string; category: string; description: string | null }[];
}

const SYSTEM_PROMPT = `Sos un analista comercial de Axentia, una consultora de tecnología en Tarragona (España).
Tu trabajo es analizar la evidencia ya recopilada sobre un negocio (auditoría digital + oportunidades
detectadas por reglas) y proponer un argumento comercial honesto para un vendedor humano.

Reglas estrictas:
- NUNCA afirmes con certeza que una empresa "tiene" un problema. Todo lo que decís es una inferencia
  a partir de evidencia pública limitada.
- Usá frases como "hemos detectado", "parece existir una oportunidad", "no se ha identificado
  públicamente", "sería interesante validar" — nunca "tiene", "necesita", "carece de".
- Recomendá servicios ÚNICAMENTE de este catálogo real de Axentia, no inventes otros:
- ${AXENTIA_SERVICES}
- El argumento comercial debe ser breve (2-4 frases), en español, tono consultivo y humano —
  no un discurso de venta agresivo.
- La confianza (0-100) debe reflejar cuánta evidencia real hay: poca evidencia = confianza baja.
- El contacto final siempre lo hace una persona; vos solo generás el análisis y el argumento.`;

export async function generateCommercialAnalysis(input: AIAnalysisInput): Promise<AIAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AIAnalysisError(
      "ANTHROPIC_API_KEY no está configurada en el servidor. Agregala en .env.local para generar el análisis de IA.",
      500
    );
  }

  // Las API keys "identity-linked" (asociadas a tu login de consola, no a un
  // workspace fijo) exigen indicar en qué workspace actúa cada request.
  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic({
    apiKey,
    defaultHeaders: workspaceId ? { "anthropic-workspace-id": workspaceId } : undefined,
  });

  const auditSummary = input.audit
    ? [
        `Sitio web accesible: ${input.audit.websiteExists ? "sí" : "no"}`,
        `HTTPS: ${input.audit.httpsEnabled ?? "sin datos"}`,
        `Formulario de contacto: ${input.audit.contactForm ?? "sin datos"}`,
        `Reservas online: ${input.audit.onlineBooking ?? "sin datos"}`,
        `WhatsApp: ${input.audit.whatsapp ?? "sin datos"}`,
        `CRM detectado: ${input.audit.crmDetected ?? "sin datos"}`,
        `Automatización detectada: ${input.audit.automationDetected ?? "sin datos"}`,
        `Portal de clientes: ${input.audit.customerPortal ?? "sin datos"}`,
        `Pagos online: ${input.audit.onlinePayments ?? "sin datos"}`,
        `Presencia en redes: ${input.audit.socialPresence ?? "sin datos"}`,
        `Puntaje de madurez tecnológica: ${input.audit.technologyScore ?? "sin datos"}/100`,
      ].join("\n")
    : "Todavía no se ejecutó una auditoría digital para este lead.";

  const opportunitiesSummary = input.ruleBasedOpportunities.length
    ? input.ruleBasedOpportunities.map((o) => `- [${o.category}] ${o.title}: ${o.description || ""}`).join("\n")
    : "Ninguna detectada por reglas todavía.";

  const userMessage = `Empresa: ${input.companyName}
Sector: ${input.sector}${input.subsector ? ` (${input.subsector})` : ""}
Ciudad: ${input.city}

Resultado de la auditoría digital:
${auditSummary}

Oportunidades ya detectadas por reglas deterministas:
${opportunitiesSummary}

Generá el análisis comercial en el formato pedido.`;

  let response;
  try {
    response = await client.messages.parse({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      output_config: { format: zodOutputFormat(AIAnalysisSchema) },
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new AIAnalysisError("La API key de Anthropic no es válida.", 500);
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new AIAnalysisError("Se alcanzó el límite de la API de Anthropic. Probá de nuevo en unos minutos.", 429);
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Error de la API de Anthropic:", error);
      if (error.status === 400 && /workspace/i.test(error.message)) {
        throw new AIAnalysisError(
          "Esta API key requiere indicar el workspace de Anthropic. Agregá ANTHROPIC_WORKSPACE_ID en .env.local (lo encontrás en console.claude.com, en la configuración del workspace).",
          500
        );
      }
      throw new AIAnalysisError(`La API de IA devolvió un error (${error.status}).`, 502);
    }
    console.error("Error inesperado generando análisis de IA:", error);
    throw new AIAnalysisError("Error interno al generar el análisis de IA.", 500);
  }

  if (!response.parsed_output) {
    throw new AIAnalysisError("La IA no devolvió una salida válida según el esquema esperado.", 502);
  }

  return response.parsed_output;
}
