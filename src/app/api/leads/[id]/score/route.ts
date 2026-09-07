import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { computeLeadScore } from "@/lib/services/scoringService";
import type { DigitalAuditResult } from "@/lib/services/digitalAuditService";

// POST /api/leads/[id]/score — Fase 8. Recalcula el Lead Score a partir del
// audit más reciente + datos del lead, guarda puntuaciones parciales y deja
// los motivos como Activity (visible en el historial del lead).
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
      opportunities: true,
    },
  });
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  const latestAudit = lead.audits[0];
  const auditForScoring: DigitalAuditResult | null = latestAudit
    ? {
        websiteExists: latestAudit.websiteExists ?? false,
        websiteQuality: latestAudit.websiteQuality,
        mobileQuality: latestAudit.mobileQuality,
        httpsEnabled: latestAudit.httpsEnabled,
        contactForm: latestAudit.contactForm,
        onlineBooking: latestAudit.onlineBooking,
        whatsapp: latestAudit.whatsapp,
        crmDetected: latestAudit.crmDetected,
        automationDetected: latestAudit.automationDetected,
        customerPortal: latestAudit.customerPortal,
        onlinePayments: latestAudit.onlinePayments,
        socialPresence: latestAudit.socialPresence,
        technologyScore: latestAudit.technologyScore,
        auditStatus: (latestAudit.auditStatus as DigitalAuditResult["auditStatus"]) || "PENDIENTE_DE_VALIDAR",
      }
    : null;

  const result = computeLeadScore({
    companySize: lead.companySize,
    estimatedEmployees: lead.estimatedEmployees,
    phone: lead.phone,
    email: lead.email,
    website: lead.website,
    contactName: lead.contactName,
    opportunityCount: lead.opportunities.length,
    audit: auditForScoring,
  });

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      digitalPresenceScore: result.digitalPresenceScore,
      technologyNeedScore: result.technologyNeedScore,
      economicPotentialScore: result.economicPotentialScore,
      serviceFitScore: result.serviceFitScore,
      contactabilityScore: result.contactabilityScore,
      leadScore: result.leadScore,
      priority: result.priority,
    },
  });

  await prisma.activity.create({
    data: {
      leadId: id,
      type: "SCORING",
      subject: `Lead Score recalculado: ${result.leadScore} (${result.priority})`,
      description: result.reasons.map((r) => `- ${r}`).join("\n"),
    },
  });

  return NextResponse.json({ lead: updated, reasons: result.reasons });
}
