# PROJECT_AUDIT.md — Auditoría del proyecto "web" (Axentia)

Fecha: 26/08/2026
Alcance: auditoría técnica obligatoria previa a construir el Motor de Prospección, según lo indicado en `PROYECTO_MOTOR_PROSPECCION_AXENTIA_V2_TARRAGONA.md`. No se ha modificado ningún archivo del proyecto.

## 1. Arquitectura actual

Aplicación monolítica **Next.js** (App Router) con frontend y backend en el mismo proyecto. No hay servicios separados ni base de datos. La única persistencia real hoy es el envío de emails (Nodemailer) y la disponibilidad de reservas vía Google Calendar. No existe capa de almacenamiento de leads: cada solicitud de auditoría se manda por correo y no queda guardada en ningún sitio consultable.

## 2. Stack

- Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5.9.3
- Tailwind CSS 4 (tokens de color definidos en `globals.css` vía `@theme`)
- framer-motion (animaciones), lucide-react (iconos)
- nodemailer (envío de emails vía Gmail SMTP)
- google-auth-library (Service Account de Google, usada para Calendar)
- Sin ORM, sin base de datos, sin backend separado
- Despliegue: Vercel (hay Dockerfile también, por si se despliega en otro sitio, ej. Railway)

## 3. Estructura de carpetas

```
src/
  app/
    page.tsx                 → landing (una sola página)
    layout.tsx                → metadata SEO, fuente Inter, ModalProvider global
    admin/page.tsx            → panel privado (gestión de disponibilidad de reservas)
    api/
      audit/submit/           → recibe el formulario de auditoría gratuita, envía emails
      availability/           → consulta huecos libres en Google Calendar
      admin/{login,logout,verify,block}/ → sesión del panel admin y bloqueo manual de horarios
  components/
    layout/  → Header, Footer
    sections/ → Hero, Services, QuienesSomos, AuditForm
    ui/      → BookingModal, CookieConsent, FloatingChatWidget, InteractiveNodesBg
  context/ModalContext.tsx    → estado global para abrir/cerrar el modal de reserva
  lib/auth.ts                 → firma/verifica el token de sesión del admin (HMAC, sin librerías externas)
```

Documentación de negocio ya existente en la raíz del proyecto (no código): etapas del proyecto, plan de crecimiento, plan de migración de marca a "Fernando Franchi".

## 4. Landing Page (referencia visual y de producto)

Landing de una sola página: Header → Hero → Services (4 tarjetas) → QuienesSomos → AuditForm (formulario de auditoría gratuita) → Footer. Además: un modal de reserva (Calendly embebido) y un widget flotante de chat/WhatsApp.

Estilo visual (a reutilizar, no reinventar):
- Colores: celeste `#4DA8FF` (primario), azul oscuro `#0B1F33` (texto/marca), gris claro `#F5F7FA` (fondos suaves), gris texto `#5B6573`.
- Tipografía: Inter.
- Componente reutilizable clave: `.soft-card` (tarjeta blanca con sombra suave y hover), definido en `globals.css`.
- Mobile-first, animaciones suaves con framer-motion.

## 5. Componentes reutilizables

- `.soft-card` (CSS) → base ideal para las cards de leads/oportunidades del nuevo módulo.
- `Header` / `Footer` → ya tienen la navegación; habría que añadirles los nuevos links (Dashboard, Prospección, Leads, Pipeline...).
- `AuditForm.tsx` → patrón de formulario largo con validación y envío a una API route; es la referencia más cercana a cómo se construyó el formulario de "auditoría digital" (aunque hoy es un cuestionario que llena el visitante, no un análisis automático de una web).
- `ModalContext` → patrón ya existente para modales globales, reutilizable para nuevas ventanas (ej. detalle de un lead).
- `lib/auth.ts` → patrón de sesión ya funcionando (cookie firmada con HMAC + expiración), reutilizable para proteger las pantallas nuevas en vez de crear otro sistema de autenticación.

## 6. Base de datos

**No existe.** No hay `DATABASE_URL`, ni ORM (Prisma/Drizzle/etc.), ni carpeta de migraciones. Todo el "dato" que genera la web hoy (solicitudes de auditoría) se envía por email y se pierde como registro estructurado; no hay forma de consultar "qué empresas pidieron auditoría" desde ningún panel.

Esto es la brecha más grande frente a lo que pide el documento del Motor de Prospección (que asume Postgres con las entidades Place, Lead, DigitalAudit, Opportunity, Contact, Activity, Task, User).

## 7. Autenticación

Solo existe para `/admin`: una contraseña única (`ADMIN_PASSWORD` en variables de entorno) que genera una cookie de sesión firmada con HMAC-SHA256 (`SESSION_SECRET`), sin roles ni usuarios individuales. No hay sistema de usuarios (no aplica todavía el esquema ADMIN/MANAGER/COMERCIAL que pide el documento del motor).

## 8. Rutas / endpoints existentes

- `GET /` → landing
- `GET /admin` → panel privado (requiere sesión)
- `POST /api/audit/submit` → recibe el formulario público y envía los 2 emails
- `GET /api/availability` → huecos libres del calendario
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/verify` → sesión del panel
- `POST /api/admin/block` → bloquear/desbloquear horarios manualmente

No existe ningún endpoint relacionado con Google Places, scoring, CRM ni pipeline (es esperable, todavía no se ha construido nada de eso).

## 9. Variables de entorno

Ya usadas hoy (`.env.local.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `GOOGLE_SERVICE_ACCOUNT_KEY`.

Faltan por definir cuando arranque el motor de prospección: `DATABASE_URL`, `GOOGLE_MAPS_API_KEY`, y (más adelante) `AI_API_KEY`, `N8N_WEBHOOK_URL`. Ninguna clave sensible está hardcodeada en el código: todas pasan por variables de entorno, correcto según las reglas de seguridad del proyecto.

## 10. Puntos de integración para el Motor de Prospección

- **Base de datos**: hay que agregarla desde cero (Postgres). No hay nada que migrar, así que no hay riesgo de romper datos existentes.
- **Navegación**: añadir enlaces nuevos en `Header.tsx` (y quizás un layout distinto para la zona interna, separado de la landing pública).
- **Autenticación**: se puede extender `lib/auth.ts` en vez de crear un sistema nuevo, aunque probablemente haga falta pasar de "una contraseña" a "usuarios con rol" cuando se necesite ADMIN/MANAGER/COMERCIAL.
- **Estilos**: reutilizar los tokens de color de `globals.css` y el patrón `.soft-card` para que el CRM se vea parte de la misma marca.
- **Zona nueva vs. landing**: lo más limpio es crear las pantallas nuevas bajo una ruta propia (ej. `/app/(interno)/...` o similar) para no mezclar el código del CRM con el de la landing pública, sin tocar `page.tsx` de la landing.

## 11. Riesgos

- El proyecto está en pleno **cambio de marca** (de "Axentia" a "Fernando Franchi", ver `Plan de Migracion de Marca`), todavía sin fecha de código confirmada. Conviene preguntar si ese cambio se hace antes o después de empezar el motor de prospección, para no duplicar trabajo de textos/branding.
- Al no existir base de datos, la Fase 2 del documento (entidades) es trabajo 100% nuevo, no una migración de algo existente — hay que dimensionarlo bien en tiempo.
- El sistema de autenticación actual (una sola contraseña compartida) no alcanza para roles diferenciados (ADMIN/MANAGER/COMERCIAL) que pide el documento; habrá que ampliarlo en algún momento, no de entrada.
- No hay tests automatizados en el proyecto hoy (no se encontró carpeta de tests ni configuración de test runner).

## 12. Recomendación de implementación

Seguir el orden que ya define el propio documento del Motor de Prospección, sin saltarse pasos:

1. **Arquitectura** (decidir dónde vive la base de datos — recomendado: Postgres en Railway o Neon, ya que hay conector Railway disponible — y cómo se organiza la carpeta de la zona interna nueva).
2. **Base de datos**: crear las tablas Place, Lead, DigitalAudit, Opportunity, Contact, Activity, Task, User.
3. **CRM básico** sobre esas tablas (sin Google ni IA todavía).
4. Seguir con Pipeline → Google Places → el resto de fases, en el orden que ya marca el documento.

No se recomienda tocar el branding (migración a "Fernando Franchi") a la vez que se construye el motor, para no mezclar dos trabajos distintos en las mismas sesiones.

---

Fin de la auditoría. Según la regla del propio proyecto, no se avanza a la Fase 1 (Arquitectura) hasta recibir confirmación.
