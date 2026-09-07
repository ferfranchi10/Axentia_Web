// Normalizer (sección 26): convierte lo que devuelve un EnrichmentProvider en
// los campos que espera el modelo Lead. Es el paso intermedio explícito del
// diagrama "Enrichment Provider → Normalizer → Lead" — si mañana se suma un
// proveedor nuevo con forma de datos distinta, solo este archivo cambia.
const MAX_TEXT_LENGTH = 200;

export interface NormalizeLeadInput {
  companyName: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  sector: string;
  city: string;
}

export interface NormalizedLeadData {
  companyName: string;
  sector: string;
  city: string;
  website?: string;
  phone?: string;
  notes?: string;
}

export function normalizeToLead(input: NormalizeLeadInput): NormalizedLeadData {
  return {
    companyName: input.companyName.trim().slice(0, MAX_TEXT_LENGTH),
    sector: input.sector.trim().slice(0, MAX_TEXT_LENGTH),
    city: input.city.trim().slice(0, MAX_TEXT_LENGTH),
    website: input.website?.trim().slice(0, MAX_TEXT_LENGTH) || undefined,
    phone: input.phone?.trim().slice(0, MAX_TEXT_LENGTH) || undefined,
    notes: input.address ? `Dirección (fuente externa): ${input.address}` : undefined,
  };
}
