// Fase 6 (sección 26 del doc original): arquitectura de proveedores de
// enriquecimiento. El resto del sistema depende de esta interfaz, nunca de
// un proveedor concreto (hoy Google Places, mañana podría sumarse otro) —
// así se agrega una fuente nueva sin reescribir búsqueda/importación.
//
//   Google Places → Enrichment Provider → Normalizer → Lead
//
// Cada dato devuelto lleva su propio `source` y `lastUpdated`, para poder
// saber de dónde salió y cuándo se actualizó por última vez.

export interface EnrichedField<T> {
  value: T;
  source: string;
  lastUpdated: string; // ISO date
}

export interface EnrichedCompany {
  externalId: EnrichedField<string>; // id del proveedor (ej. Google Place ID)
  companyName: EnrichedField<string>;
  address: EnrichedField<string> | null;
  phone: EnrichedField<string> | null;
  website: EnrichedField<string> | null;
  types: EnrichedField<string[]> | null;
}

export class EnrichmentProviderError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "EnrichmentProviderError";
    this.status = status;
  }
}

export interface EnrichmentProvider {
  readonly name: string;
  search(query: string, maxResults: number): Promise<EnrichedCompany[]>;
}
