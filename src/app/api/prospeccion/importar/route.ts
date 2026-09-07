import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { normalizeToLead } from "@/lib/services/normalizer";

const MAX_TEXT_LENGTH = 200;

interface ImportItem {
  placeId: string;
  companyName: string;
  formattedAddress?: string | null;
  phone?: string | null;
  website?: string | null;
}

// POST /api/prospeccion/importar — convierte resultados elegidos de la
// búsqueda de Places en Lead + Place. Idempotente: si el Place ya existe y
// ya tiene un Lead asociado, no duplica, lo marca como "yaExistia".
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

  const sector = typeof body.sector === "string" ? body.sector.trim().slice(0, MAX_TEXT_LENGTH) : "";
  const city = typeof body.city === "string" ? body.city.trim().slice(0, MAX_TEXT_LENGTH) : "";
  const items = Array.isArray(body.results) ? (body.results as ImportItem[]) : [];

  if (!sector || !city || items.length === 0) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: sector, city, results." },
      { status: 400 }
    );
  }

  const imported: string[] = [];
  const skipped: { placeId: string; reason: string }[] = [];

  for (const item of items) {
    if (!item.placeId || !item.companyName) {
      skipped.push({ placeId: item.placeId || "?", reason: "Datos incompletos." });
      continue;
    }

    try {
      const place = await prisma.place.upsert({
        where: { placeId: item.placeId },
        update: { lastCheckedAt: new Date() },
        create: { placeId: item.placeId, source: "google_places", lastCheckedAt: new Date() },
        include: { lead: true },
      });

      if (place.lead) {
        skipped.push({ placeId: item.placeId, reason: "Ya existe como lead." });
        continue;
      }

      const normalized = normalizeToLead({
        companyName: item.companyName,
        address: item.formattedAddress,
        phone: item.phone,
        website: item.website,
        sector,
        city,
      });

      const lead = await prisma.lead.create({
        data: { placeId: place.id, ...normalized },
      });
      imported.push(lead.id);
    } catch (error) {
      console.error("Error importando place:", item.placeId, error);
      skipped.push({ placeId: item.placeId, reason: "Error interno." });
    }
  }

  return NextResponse.json({ importedCount: imported.length, importedIds: imported, skipped });
}
