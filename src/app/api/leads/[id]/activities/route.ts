import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

// Tipos de interacción listados en la sección 7 del doc original.
const ACTIVITY_TYPES = ["EMAIL", "LLAMADA", "WHATSAPP", "REUNION", "NOTA", "TAREA", "PROPUESTA"];

// GET /api/leads/[id]/activities — historial de interacciones del lead
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const activities = await prisma.activity.findMany({
    where: { leadId: id },
    orderBy: { occurredAt: "desc" },
  });
  return NextResponse.json({ activities });
}

// POST /api/leads/[id]/activities — registra una interacción (llamada, email, reunión...)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type.toUpperCase() : "";
  if (!ACTIVITY_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `type inválido. Usá uno de: ${ACTIVITY_TYPES.join(", ")}.` },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        leadId: id,
        type,
        subject: typeof body.subject === "string" ? body.subject.trim().slice(0, 200) || undefined : undefined,
        description:
          typeof body.description === "string" ? body.description.trim().slice(0, 3000) || undefined : undefined,
        occurredAt: body.occurredAt ? new Date(body.occurredAt as string) : undefined,
        createdBy: typeof body.createdBy === "string" ? body.createdBy.trim().slice(0, 100) || undefined : undefined,
      },
    });

    // Registrar la interacción también actualiza "último contacto" del lead.
    await prisma.lead.update({ where: { id }, data: { lastContactAt: activity.occurredAt } });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Error creando activity:", error);
    return NextResponse.json({ error: "No se pudo registrar la interacción." }, { status: 500 });
  }
}
