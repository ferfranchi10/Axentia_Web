import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { performDigitalAudit } from "@/lib/services/digitalAuditService";
import { generateOpportunities } from "@/lib/services/opportunityRules";
import { checkDailyUsage, logUsage, MAX_AUDITS_PER_DAY } from "@/lib/limits";

const USAGE_TYPE = "AUDITORIA_DIGITAL";

// POST /api/leads/[id]/audit — Fase 7. Corre las comprobaciones no invasivas
// sobre la web del lead (HTTPS, formulario, WhatsApp, reservas...), guarda un
// DigitalAudit, y convierte los hallazgos en Opportunity (reemplaza las
// oportunidades generadas por reglas anteriores; no toca las agregadas a mano).
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true, website: true } });
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  const usage = await checkDailyUsage(USAGE_TYPE, MAX_AUDITS_PER_DAY);
  if (usage.blocked) {
    return NextResponse.json({ error: usage.warning, usage }, { status: 429 });
  }

  const result = await performDigitalAudit(lead.website);
  await logUsage(USAGE_TYPE, lead.website || undefined);

  const audit = await prisma.digitalAudit.create({
    data: {
      leadId: id,
      websiteExists: result.websiteExists,
      websiteQuality: result.websiteQuality,
      mobileQuality: result.mobileQuality,
      httpsEnabled: result.httpsEnabled,
      contactForm: result.contactForm,
      onlineBooking: result.onlineBooking,
      whatsapp: result.whatsapp,
      crmDetected: result.crmDetected,
      automationDetected: result.automationDetected,
      customerPortal: result.customerPortal,
      onlinePayments: result.onlinePayments,
      socialPresence: result.socialPresence,
      technologyScore: result.technologyScore,
      auditStatus: result.auditStatus,
      auditedAt: new Date(),
    },
  });

  const opportunityInputs = generateOpportunities(result);

  // Reemplaza las oportunidades generadas por reglas en la auditoría
  // anterior; deja intactas las que se hayan agregado a mano o por IA.
  await prisma.$transaction([
    prisma.opportunity.deleteMany({ where: { leadId: id, status: "INFERIDO" } }),
    ...opportunityInputs.map((o) => prisma.opportunity.create({ data: { leadId: id, ...o } })),
  ]);
  const opportunities = await prisma.opportunity.findMany({
    where: { leadId: id },
    orderBy: { createdAt: "desc" },
  });

  await prisma.activity.create({
    data: {
      leadId: id,
      type: "AUDITORIA",
      subject: `Auditoría digital ejecutada (${result.auditStatus})`,
      description: `Tecnología detectada: ${result.technologyScore ?? 0}/100. Oportunidades encontradas: ${opportunityInputs.length}.`,
    },
  });

  return NextResponse.json({ audit, opportunities, usage: await checkDailyUsage(USAGE_TYPE, MAX_AUDITS_PER_DAY) });
}
