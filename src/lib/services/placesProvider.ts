// Proveedor de Google Places API (New) — implementación concreta de
// EnrichmentProvider (Fase 6). Ver sección 5 del doc original: usar Field
// Masks con solo los campos necesarios (afectan el coste/tier de
// facturación), y nunca exponer la API key al cliente — este módulo solo se
// importa desde API routes (servidor).
import { EnrichmentProvider, EnrichedCompany, EnrichedField, EnrichmentProviderError } from "./enrichmentProvider";

const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PROVIDER_NAME = "google_places";

// displayName/formattedAddress/location/types = tier Pro. nationalPhoneNumber
// y websiteUri suben a tier Enterprise, pero son el dato que le da sentido al
// lead (sin teléfono/web no hay mucho para auditar o contactar), y el cupo
// gratis mensual de Enterprise (1000 llamadas) cubre de sobra la Fase 0.
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.types",
].join(",");

function field<T>(value: T, now: string): EnrichedField<T> {
  return { value, source: PROVIDER_NAME, lastUpdated: now };
}

async function search(query: string, maxResultCount: number): Promise<EnrichedCompany[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new EnrichmentProviderError(
      "GOOGLE_MAPS_API_KEY no está configurada en el servidor. Agregala en .env.local para poder buscar empresas.",
      500
    );
  }

  let response: Response;
  try {
    response = await fetch(TEXT_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: query, maxResultCount }),
    });
  } catch {
    throw new EnrichmentProviderError("No se pudo conectar con Google Places. Probá de nuevo en unos minutos.");
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error("Google Places API error:", response.status, errBody);
    throw new EnrichmentProviderError(
      response.status === 403
        ? "Google Places rechazó la solicitud (403). Revisá que la API key tenga habilitada Places API (New) y facturación configurada."
        : `Google Places devolvió un error (${response.status}). Probá de nuevo en unos minutos.`,
      502
    );
  }

  const data = await response.json();
  const places: unknown[] = Array.isArray(data.places) ? data.places : [];
  const now = new Date().toISOString();

  return places
    .map((p): EnrichedCompany | null => {
      const place = p as Record<string, unknown>;
      const id = typeof place.id === "string" ? place.id : null;
      const displayName = place.displayName as { text?: string } | undefined;
      const companyName = displayName?.text?.trim();
      if (!id || !companyName) return null;

      const address = typeof place.formattedAddress === "string" ? place.formattedAddress : null;
      const phone = typeof place.nationalPhoneNumber === "string" ? place.nationalPhoneNumber : null;
      const website = typeof place.websiteUri === "string" ? place.websiteUri : null;
      const types = Array.isArray(place.types) ? (place.types as string[]) : null;

      return {
        externalId: field(id, now),
        companyName: field(companyName, now),
        address: address ? field(address, now) : null,
        phone: phone ? field(phone, now) : null,
        website: website ? field(website, now) : null,
        types: types ? field(types, now) : null,
      };
    })
    .filter((p): p is EnrichedCompany => p !== null);
}

export const googlePlacesProvider: EnrichmentProvider = {
  name: PROVIDER_NAME,
  search,
};
