import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

const MAX_TEXT_LENGTH = 200;
const MAX_NOTES_LENGTH = 5000;

// Campos que se pueden editar desde la ficha del lead. Se excluye a propósito
// leadScore y los sub-scores: esos los calcula scoringService (Fase 8), no el
// usuario a mano.
const EDITABLE_FIELDS = [
  "companyName",
  "sector",
  "subsector",
  "city",
  "province",
  "country",
  "website",
  "phone",
  "email",
  "contactName",
  "contactRole",
  "companySize",
  "estimatedEmployees",
  "priority",
  "doNotContact",
  "notes",
  "lastContactAt",
  "nextContactAt",
] as const;

type EditableField = (typeof EDITABLE_FIELDS)[number];

// GET /api/leads/[id] — ficha completa del lead con todo su historial
export async function GET(
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
      place: true,
      audits: { orderBy: { createdAt: "desc" } },
      opportunities: { orderBy: { createdAt: "desc" } },
      contacts: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { occurredAt: "desc" } },
      tasks: { orderBy: { dueAt: "asc" } },
    },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

// PATCH /api/leads/[id] — edita datos del lead (no cambia el status del pipeline,
// eso usa /api/leads/[id]/status para que quede registrado como Activity)
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

  if (body.status !== undefined) {
    return NextResponse.json(
      { error: "Para cambiar el status usá PATCH /api/leads/[id]/status." },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS as readonly EditableField[]) {
    if (!(field in body)) continue;
    const value = body[field];

    if (field === "doNotContact") {
      data[field] = Boolean(value);
    } else if (field === "estimatedEmployees") {
      data[field] = value === null || value === "" ? null : Number(value);
    } else if (field === "lastContactAt" || field === "nextContactAt") {
      data[field] = value ? new Date(value as string) : null;
    } else if (field === "priority") {
      data[field] = value === null || value === "" ? null : String(value).slice(0, 20);
    } else if (typeof value === "string") {
      const max = field === "notes" ? MAX_NOTES_LENGTH : MAX_TEXT_LENGTH;
      data[field] = value.trim() === "" ? null : value.trim().slice(0, max);
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar." }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.update({ where: { id }, data });
    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Error actualizando lead:", error);
    return NextResponse.json({ error: "No se pudo actualizar el lead." }, { status: 500 });
  }
}
