# API.md — Endpoints planeados del Motor de Prospección

Fecha: 26/08/2026. Todos los endpoints nuevos van bajo `/api/...`, siguen el patrón ya usado en el proyecto (`/api/audit/submit`), y quedan protegidos por la sesión de `/admin` (mismo mecanismo que ya existe en `lib/auth.ts`). Esto es el plan; se implementan de a uno, fase por fase — no todos juntos.

## Ya existentes (sin cambios)

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/audit/submit` | Formulario público de la landing → envía emails |
| GET | `/api/availability` | Huecos libres del calendario |
| POST | `/api/admin/login` / `logout` | Sesión del panel |
| GET | `/api/admin/verify` | Verifica sesión activa |
| POST | `/api/admin/block` | Bloquear/desbloquear horarios |

## Nuevos — Fase 3 (CRM básico)

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/leads` | Lista leads (filtros: sector, ciudad, score, prioridad, estado) |
| POST | `/api/leads` | Crea un lead manualmente |
| GET | `/api/leads/[id]` | Ficha completa de un lead |
| PATCH | `/api/leads/[id]` | Edita datos del lead (incluye notas, próximo contacto) |
| POST | `/api/leads/[id]/activities` | Registra una interacción (llamada, email, reunión...) |
| GET/POST | `/api/leads/[id]/tasks` | Lista/crea tareas de seguimiento |
| PATCH | `/api/tasks/[id]` | Cambia estado de una tarea |

## Nuevos — Fase 4 (Pipeline)

| Método | Ruta | Qué hace |
|---|---|---|
| PATCH | `/api/leads/[id]/status` | Mueve un lead de columna (NUEVO → CALIFICADO → ... → GANADO/PERDIDO). Registra el cambio como Activity automáticamente. |

## Nuevos — Fase 5 (Google Places)

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/prospeccion/buscar` | Recibe sector + ciudad + cantidad objetivo, llama a Google Places (Text Search New), deduplica por Place ID, devuelve resultados nuevos vs. ya existentes. Nunca expone la API key al navegador. |

## Nuevos — Fase 7-8 (Auditoría digital y scoring)

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/leads/[id]/audit` | Corre las comprobaciones no invasivas (HTTPS, formulario, WhatsApp, reservas...) y guarda un DigitalAudit |
| POST | `/api/leads/[id]/score` | Recalcula el Lead Score a partir del audit + datos del lead, guarda puntuaciones parciales y motivos |

## Nuevos — Fase 9 (IA)

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/leads/[id]/ai-analysis` | Genera oportunidades + argumento comercial a partir de los datos ya estructurados. La salida se valida contra un esquema fijo antes de guardarse (nunca se guarda una respuesta libre de la IA tal cual). |

## Nuevos — Fase 10 (Dashboard)

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/dashboard/kpis` | Totales: leads, leads HOT, contactados, reuniones, propuestas, ganados, valor potencial |

## Control de costes (transversal, sección 31 del documento original)

Antes de correr `/api/prospeccion/buscar` o `/api/leads/[id]/audit` de forma masiva, cada endpoint debe:
1. Revisar los límites diarios configurados (`max_searches_per_day`, `max_audits_per_day`).
2. Si se acerca al límite (50/75/90/100%), devolver un aviso en vez de bloquear silenciosamente.
3. Registrar el uso (tabla o log simple) para poder mostrarlo luego en el dashboard de administración.

Esto se implementa junto con la Fase 5 (Google Places), no antes, porque recién ahí empieza a haber costo real.

## Seguridad (aplica a todos los endpoints nuevos)

- Todos requieren sesión válida de `/admin` (se reutiliza `verifyToken` de `lib/auth.ts`).
- Validar y sanear cada input del lado del servidor (igual que ya hace `/api/audit/submit`), nunca confiar en lo que mande el cliente.
- Ningún endpoint devuelve la `GOOGLE_MAPS_API_KEY` ni ninguna otra clave al frontend.
