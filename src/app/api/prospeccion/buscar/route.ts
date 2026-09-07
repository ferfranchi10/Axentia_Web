import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { googlePlacesProvider } from "@/lib/services/placesProvider";
import { EnrichmentProvider, EnrichmentProviderError } from "@/lib/services/enrichmentProvider";
import { checkDailyUsage, logUsage, MAX_RESULTS_PER_SEARCH, MAX_SEARCHES_PER_DAY } from "@/lib/limits";

const USAGE_TYPE = "BUSQUEDA_PLACES";

// El resto de este archivo solo conoce el tipo EnrichmentProvider, nunca la
// implementación concreta de Google Places (Fase 6) — sumar otra fuente más
// adelante es cambiar esta línea, no reescribir la ruta.
const provider: EnrichmentProvider = googlePlacesProvider;

// POST /api/prospeccion/buscar — Fase 5. Busca empresas en Google Places
// (Text Search New) por sector + ciudad, deduplica por Place ID contra lo que
// ya existe en la base, y NUNCA crea leads acá: solo devuelve resultados para
// que el usuario elija cuáles importar (POST /api/prospeccion/importar).
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

  const sector = typeof body.sector === "string" ? body.sector.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  if (!sector || !city) {
    return NextResponse.json({ error: "Faltan campos obligatorios: sector, city." }, { status: 400 });
  }

  const maxResults = Math.min(Math.max(Number(body.maxResults) || 20, 1), MAX_RESULTS_PER_SEARCH);

  const usage = await checkDailyUsage(USAGE_TYPE, MAX_SEARCHES_PER_DAY);
  if (usage.blocked) {
    return NextResponse.json({ error: usage.warning, usage }, { status: 429 });
  }

  const query = `${sector} en ${city}`;

  let companies;
  try {
    companies = await provider.search(query, maxResults);
  } catch (error) {
    if (error instanceof EnrichmentProviderError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Error inesperado en búsqueda de empresas:", error);
    return NextResponse.json({ error: "Error interno al buscar empresas." }, { status: 500 });
  }

  await logUsage(USAGE_TYPE, query, companies.length);

  // Aplana los campos enriquecidos {value, source, lastUpdated} a la forma
  // simple que consume el frontend y, si se importa, el Normalizer.
  const results = companies.map((c) => ({
    placeId: c.externalId.value,
    companyName: c.companyName.value,
    formattedAddress: c.address?.value ?? null,
    phone: c.phone?.value ?? null,
    website: c.website?.value ?? null,
    types: c.types?.value ?? [],
  }));

  const placeIds = results.map((r) => r.placeId);
  const existingPlaces = placeIds.length
    ? await prisma.place.findMany({ where: { placeId: { in: placeIds } }, select: { placeId: true } })
    : [];
  const existingSet = new Set(existingPlaces.map((p) => p.placeId));

  const annotated = results.map((r) => ({ ...r, existing: existingSet.has(r.placeId) }));

  return NextResponse.json({
    query,
    results: annotated,
    newCount: annotated.filter((r) => !r.existing).length,
    existingCount: annotated.filter((r) => r.existing).length,
    usage: await checkDailyUsage(USAGE_TYPE, MAX_SEARCHES_PER_DAY),
  });
}
