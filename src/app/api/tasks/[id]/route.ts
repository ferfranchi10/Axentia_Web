import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

const TASK_STATUSES = ["PENDIENTE", "EN_CURSO", "COMPLETADA", "CANCELADA"];

// PATCH /api/tasks/[id] — cambia estado u otros datos de una tarea
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

  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const status = typeof body.status === "string" ? body.status.toUpperCase() : "";
    if (!TASK_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status inválido. Usá uno de: ${TASK_STATUSES.join(", ")}.` },
        { status: 400 }
      );
    }
    data.status = status;
  }
  if (typeof body.title === "string" && body.title.trim()) {
    data.title = body.title.trim().slice(0, 200);
  }
  if (body.description !== undefined) {
    data.description = typeof body.description === "string" ? body.description.trim().slice(0, 2000) || null : null;
  }
  if (body.dueAt !== undefined) {
    data.dueAt = body.dueAt ? new Date(body.dueAt as string) : null;
  }
  if (body.priority !== undefined) {
    data.priority = typeof body.priority === "string" && body.priority ? body.priority.slice(0, 20) : null;
  }
  if (body.assignedTo !== undefined) {
    data.assignedTo = typeof body.assignedTo === "string" && body.assignedTo.trim() ? body.assignedTo.trim().slice(0, 100) : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar." }, { status: 400 });
  }

  try {
    const task = await prisma.task.update({ where: { id }, data });
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    return NextResponse.json({ error: "No se pudo actualizar la tarea." }, { status: 500 });
  }
}
