import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

// GET /api/leads/[id]/tasks — tareas de seguimiento del lead
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const tasks = await prisma.task.findMany({
    where: { leadId: id },
    orderBy: [{ status: "asc" }, { dueAt: "asc" }],
  });
  return NextResponse.json({ tasks });
}

// POST /api/leads/[id]/tasks — crea una tarea de seguimiento
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

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Falta el campo: title." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  try {
    const task = await prisma.task.create({
      data: {
        leadId: id,
        title: title.slice(0, 200),
        description:
          typeof body.description === "string" ? body.description.trim().slice(0, 2000) || undefined : undefined,
        dueAt: body.dueAt ? new Date(body.dueAt as string) : undefined,
        priority: typeof body.priority === "string" ? body.priority.slice(0, 20) : undefined,
        assignedTo: typeof body.assignedTo === "string" ? body.assignedTo.trim().slice(0, 100) || undefined : undefined,
      },
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creando tarea:", error);
    return NextResponse.json({ error: "No se pudo crear la tarea." }, { status: 500 });
  }
}
