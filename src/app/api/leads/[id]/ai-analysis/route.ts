import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateCommercialAnalysis, AIAnalysisError } from "@/lib/services/aiAnalysisService";
import { checkDailyUsage, logUsage, MAX_AI_CALLS_PER_DAY } from "@/lib/limits";

const USAGE_TYPE = "IA_ANALISIS";

// POST /api/leads/[id]/ai-analysis — Fase 9. Genera oportunidades + argumento
// comercial a partir de los datos ya estructurados (empresa + auditoría +
// oportunidades por reglas). La salida se valida contra un esquema fijo
// (Zod) antes de guardarse — nunca se persiste una respuesta libre de la IA.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      audits: { orderBy: { createdAt: "desc" }, take: 1 },
      opportunities: { where: { status: "INFERIDO" } },
    },
  });
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  const usage = await checkDailyUsage(USAGE_TYPE, MAX_AI_CALLS_PER_DAY);
  if (usage.blocked) {
    return NextResponse.json({ error: usage.warning, usage }, { status: 429 });
  }

  let result;
  try {
    result = await generateCommercialAnalysis({
      companyName: lead.companyName,
      sector: lead.sector,
      subsector: lead.subsector,
      city: lead.city,
      audit: lead.audits[0] ?? null,
      ruleBasedOpportunities: lead.opportunities.map((o) => ({
        title: o.title,
        category: o.category,
        description: o.description,
      })),
    });
  } catch (error) {
    if (error instanceof AIAnalysisError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Error inesperado en análisis de IA:", error);
    return NextResponse.json({ error: "Error interno al generar el análisis." }, { status: 500 });
  }

  await logUsage(USAGE_TYPE, lead.companyName);

  // Reemplaza las sugerencias de IA anteriores; deja intactas las de reglas
  // (status "INFERIDO") y las que se hayan agregado a mano.
  await prisma.$transaction([
    prisma.opportunity.deleteMany({ where: { leadId: id, status: "IA_SUGERIDO" } }),
    ...result.opportunities.map((text) =>
      prisma.opportunity.create({
        data: {
          leadId: id,
          category: "IA",
          title: text.slice(0, 200),
          confidence: Math.round(result.confidence),
          status: "IA_SUGERIDO",
          recommendedService: result.recommended_services.join(", ").slice(0, 200) || undefined,
        },
      })
    ),
  ]);

  const opportunities = await prisma.opportunity.findMany({
    where: { leadId: id },
    orderBy: { createdAt: "desc" },
  });

  await prisma.activity.create({
    data: {
      leadId: id,
      type: "IA_ANALISIS",
      subject: `Análisis de IA generado (confianza ${result.confidence}%)`,
      description: [
        `Argumento comercial: ${result.commercial_argument}`,
        result.problems.length ? `Problemas probables:\n${result.problems.map((p) => `- ${p}`).join("\n")}` : "",
        `Servicios recomendados: ${result.recommended_services.join(", ") || "ninguno"}`,
        `Razonamiento: ${result.reasoning_summary}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  });

  return NextResponse.json({
    analysis: result,
    opportunities,
    usage: await checkDailyUsage(USAGE_TYPE, MAX_AI_CALLS_PER_DAY),
  });
}
