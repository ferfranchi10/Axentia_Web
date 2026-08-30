import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { isLeadStatus } from "@/lib/pipeline";

const MAX_TEXT_LENGTH = 200;
const MAX_NOTES_LENGTH = 5000;

// GET /api/leads?sector=&city=&status=&priority=&search=&take=&skip=
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const sector = params.get("sector");
  const city = params.get("city");
  const status = params.get("status");
  const priority = params.get("priority");
  const search = params.get("search");
  const take = Math.min(Number(params.get("take")) || 50, 200);
  const skip = Math.max(Number(params.get("skip")) || 0, 0);

  const where = {
    ...(sector ? { sector: { equals: sector, mode: "insensitive" as const } } : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" as const } } : {}),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { companyName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { contactName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: [{ leadScore: "desc" }, { createdAt: "desc" }],
      take,
      skip,
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, take, skip });
}

// POST /api/leads — crea un lead manualmente (fuera del flujo de Google Places)
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
  const sector = typeof body.sector === "string" ? body.sector.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";

  if (!companyName || !sector || !city) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: companyName, sector, city." },
      { status: 400 }
    );
  }

  if (body.status !== undefined && !isLeadStatus(body.status)) {
    return NextResponse.json({ error: "status inválido." }, { status: 400 });
  }

  const text = (value: unknown, max = MAX_TEXT_LENGTH) =>
    typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;

  try {
    const lead = await prisma.lead.create({
      data: {
        companyName: companyName.slice(0, MAX_TEXT_LENGTH),
        sector: sector.slice(0, MAX_TEXT_LENGTH),
        city: city.slice(0, MAX_TEXT_LENGTH),
        subsector: text(body.subsector),
        province: text(body.province),
        country: text(body.country) ?? "ES",
        website: text(body.website),
        phone: text(body.phone),
        email: text(body.email),
        contactName: text(body.contactName),
        contactRole: text(body.contactRole),
        companySize: text(body.companySize),
        notes: text(body.notes, MAX_NOTES_LENGTH),
        status: isLeadStatus(body.status) ? body.status : "NUEVO",
      },
    });
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Error creando lead:", error);
    return NextResponse.json({ error: "Error interno al crear el lead." }, { status: 500 });
  }
}
