# ARCHITECTURE.md — Motor de Prospección sobre el proyecto "web" (Axentia)

Fecha: 26/08/2026. Decisiones tomadas: se sigue con la marca Axentia (no se migra a "Fernando Franchi" por ahora). Este documento define CÓMO se construye el motor sobre el proyecto existente, sin tocar la landing pública.

## 1. Qué se agrega al stack actual

El proyecto hoy no tiene base de datos. Para el motor hace falta agregar:

- **PostgreSQL** como base de datos.
- **Prisma** como ORM (encaja de forma nativa con Next.js + TypeScript, genera las migraciones solo, y es el estándar de facto en este stack — no hace falta evaluar alternativas).
- Nada más nuevo por ahora. No se agrega backend separado: las nuevas funciones viven como API Routes dentro del mismo proyecto Next.js, igual que `/api/audit/submit` hoy.

## 2. Dónde vive la base de datos

Recomendación: **Railway** (Postgres gestionado), porque ya hay un conector conectado en esta sesión de trabajo (permite crear la base, ver variables y logs sin salir de acá). Alternativa válida: Neon. Cualquiera de las dos sirve para el volumen de Fase 0 (~100 empresas); no es una decisión que bloquee nada a futuro, se puede migrar si hiciera falta.

## 3. Dónde vive la app nueva dentro del proyecto

La landing pública (`/`) no se toca. Todo lo nuevo se agrega dentro de la zona `/admin`, que ya existe y ya está protegida por contraseña. Así no hay que inventar un sistema de acceso nuevo.

```
src/
  app/
    page.tsx                     ← landing pública (SIN CAMBIOS)
    admin/
      page.tsx                   ← hoy: gestión de reservas. Pasa a ser un ítem más del menú interno.
      dashboard/page.tsx         ← NUEVO: KPIs (Fase 10)
      prospeccion/page.tsx       ← NUEVO: buscar empresas por sector/ciudad (Fase 5)
      leads/
        page.tsx                 ← NUEVO: listado + filtros (Fase 3)
        [id]/page.tsx            ← NUEVO: ficha del lead (Fase 3)
      pipeline/page.tsx          ← NUEVO: kanban (Fase 4)
      oportunidades/page.tsx     ← NUEVO (Fase 7-8)
      tareas/page.tsx            ← NUEVO (Fase 3)
    api/
      admin/{login,logout,verify,block}/  ← YA EXISTE, sin cambios
      audit/submit/               ← YA EXISTE, sin cambios (formulario público de la landing)
      availability/                ← YA EXISTE, sin cambios
      prospeccion/buscar/route.ts  ← NUEVO: llama a Google Places (Fase 5)
      leads/route.ts               ← NUEVO: listar/crear leads (Fase 3)
      leads/[id]/route.ts          ← NUEVO: ver/editar un lead (Fase 3)
      leads/[id]/activities/route.ts ← NUEVO (Fase 3)
      leads/[id]/tasks/route.ts    ← NUEVO (Fase 3)
      leads/[id]/audit/route.ts    ← NUEVO: dispara la auditoría digital (Fase 7)
      leads/[id]/score/route.ts    ← NUEVO: recalcula el score (Fase 8)
  lib/
    auth.ts                       ← YA EXISTE, se reutiliza tal cual
    db.ts                         ← NUEVO: cliente de Prisma (una sola instancia compartida)
    services/
      scoringService.ts           ← NUEVO (Fase 8)
      digitalAuditService.ts      ← NUEVO (Fase 7)
      placesProvider.ts           ← NUEVO (Fase 5)
      aiAnalysisService.ts        ← NUEVO (Fase 9, más adelante)
prisma/
  schema.prisma                   ← NUEVO (ver DATABASE.md)
  migrations/                     ← NUEVO, generadas por Prisma
```

Nada de lo marcado "YA EXISTE" se modifica en su lógica; como mucho se les agregan enlaces en el menú.

## 4. Autenticación y permisos

Por ahora (Fase 0 de validación, un solo usuario: vos) se mantiene el sistema actual de `/admin` (una contraseña + cookie firmada). El documento original prevé roles ADMIN/MANAGER/COMERCIAL, pero construir eso ahora sería adelantarse a una necesidad que todavía no existe — se agrega recién cuando haya más de una persona usando el panel. Se deja anotado como pendiente futuro, no bloqueante.

## 5. Reglas de integración (para no romper nada)

- La landing pública y su formulario de auditoría (`AuditForm.tsx`, `/api/audit/submit`) **no se tocan**. Son un flujo de captación de leads distinto (visitante llena un formulario) al del motor de prospección (el motor sale a buscar empresas). Pueden convivir: en el futuro, las solicitudes de ese formulario también podrían cargarse como Leads en la nueva base de datos, pero eso es una mejora posterior, no parte de esta fase.
- Reutilizar los tokens de color y la clase `.soft-card` de `globals.css` para que las pantallas nuevas se vean parte de la misma marca.
- `GOOGLE_MAPS_API_KEY` y cualquier clave nueva solo se usan del lado del servidor (API routes), nunca en componentes de cliente.
- Variables de entorno nuevas a agregar en `.env.local` (y su ejemplo en `.env.local.example`): `DATABASE_URL`, `GOOGLE_MAPS_API_KEY`.

## 6. Qué NO se hace en esta fase

- No se conecta todavía Google Places (eso es Fase 5).
- No se implementa IA todavía (Fase 9).
- No se automatiza nada con n8n todavía (Fase 11).
- No se crean roles de usuario todavía.

Esta fase (Fase 1) es solo de **diseño**: este documento + `DATABASE.md` + `API.md`. La implementación real de la base de datos empieza en la Fase 2, una vez aprobado esto.
