import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { isLeadStatus } from "@/lib/pipeline";

// PATCH /api/leads/[id]/status — mueve un lead de columna en el pipeline y
// deja registrado el cambio como Activity (sección 24 del doc original).
export async function PATCH(
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

  if (!isLeadStatus(body.status)) {
    return NextResponse.json({ error: "status inválido." }, { status: 400 });
  }
  const nextStatus = body.status;
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : undefined;

  const existing = await prisma.lead.findUnique({ where: { id }, select: { status: true } });
  if (!existing) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  const previousStatus = existing.status;

  const [lead] = await prisma.$transaction([
    prisma.lead.update({ where: { id }, data: { status: nextStatus } }),
    prisma.activity.create({
      data: {
        leadId: id,
        type: "CAMBIO_ESTADO",
        subject: `${previousStatus} → ${nextStatus}`,
        description: note,
      },
    }),
  ]);

  return NextResponse.json({ lead });
}
