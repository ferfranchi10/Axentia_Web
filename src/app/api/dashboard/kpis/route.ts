import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/pipeline";

// GET /api/dashboard/kpis — Fase 10, sección 20 del doc original. Todos los
// números salen de datos reales ya cargados; "valor potencial" no se inventa
// — es la suma de Opportunity.estimatedValueMax cuando existe (hoy casi
// siempre null, porque el motor todavía no estima montos automáticamente).
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const [
    totalLeads,
    newLeads,
    hotLeads,
    contactedLeads,
    meetingLeads,
    proposalLeads,
    wonLeads,
    potentialValueAgg,
    statusCounts,
    topLeads,
    topOpportunities,
    uncontactedLeads,
    pendingTasks,
    upcomingFollowups,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NUEVO" } }),
    prisma.lead.count({ where: { priority: "HOT" } }),
    prisma.lead.count({ where: { lastContactAt: { not: null } } }),
    prisma.lead.count({ where: { status: "REUNION" } }),
    prisma.lead.count({ where: { status: "PROPUESTA" } }),
    prisma.lead.count({ where: { status: "GANADO" } }),
    prisma.opportunity.aggregate({ _sum: { estimatedValueMax: true } }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({
      where: { leadScore: { not: null } },
      orderBy: { leadScore: "desc" },
      take: 10,
      select: { id: true, companyName: true, leadScore: true, priority: true, status: true },
    }),
    prisma.opportunity.findMany({
      orderBy: [{ confidence: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        priority: true,
        confidence: true,
        leadId: true,
        lead: { select: { companyName: true } },
      },
    }),
    prisma.lead.findMany({
      where: { lastContactAt: null, status: { notIn: ["GANADO", "PERDIDO"] } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, companyName: true, status: true, createdAt: true },
    }),
    prisma.task.findMany({
      where: { status: { in: ["PENDIENTE", "EN_CURSO"] } },
      orderBy: [{ dueAt: "asc" }],
      take: 10,
      select: { id: true, title: true, dueAt: true, priority: true, leadId: true, lead: { select: { companyName: true } } },
    }),
    prisma.lead.findMany({
      where: { nextContactAt: { not: null, gte: new Date() } },
      orderBy: { nextContactAt: "asc" },
      take: 10,
      select: { id: true, companyName: true, nextContactAt: true },
    }),
  ]);

  const countByStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<string, number>;
  for (const row of statusCounts) {
    countByStatus[row.status] = row._count._all;
  }

  return NextResponse.json({
    kpis: {
      totalLeads,
      newLeads,
      hotLeads,
      contactedLeads,
      meetingLeads,
      proposalLeads,
      wonLeads,
      potentialValue: potentialValueAgg._sum.estimatedValueMax ?? 0,
    },
    countByStatus,
    topLeads,
    topOpportunities,
    uncontactedLeads,
    pendingTasks,
    upcomingFollowups,
  });
}
