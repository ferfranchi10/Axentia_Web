# DATABASE.md — Modelo de datos del Motor de Prospección

Fecha: 26/08/2026. Basado en las entidades definidas en `PROYECTO_MOTOR_PROSPECCION_AXENTIA_V2_TARRAGONA.md` (secciones 7-14), adaptadas a un esquema de Prisma/PostgreSQL. Esto es el diseño; las tablas se crean recién en la Fase 2.

## Resumen de tablas

| Tabla | Para qué sirve |
|---|---|
| Place | Identificación externa del negocio (viene de Google Places) |
| Lead | Registro comercial interno de una empresa |
| DigitalAudit | Resultado de analizar la web/presencia digital de un lead |
| Opportunity | Una necesidad tecnológica detectada para un lead |
| Contact | Persona de contacto dentro de la empresa |
| Activity | Historial de interacciones (llamada, email, reunión...) |
| Task | Tareas de seguimiento comercial |
| User | Personas que usan el panel (hoy: solo vos) |

## Esquema (Prisma, borrador para revisar antes de implementar)

```prisma
model Place {
  id            String   @id @default(cuid())
  placeId       String   @unique
  source        String   @default("google_places")
  lastCheckedAt DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lead          Lead?
}

model Lead {
  id            String   @id @default(cuid())
  placeId       String?  @unique
  place         Place?   @relation(fields: [placeId], references: [id])

  companyName   String
  sector        String
  subsector     String?
  city          String
  province      String?
  country        String   @default("ES")

  website       String?
  phone         String?
  email         String?
  contactName   String?
  contactRole   String?

  companySize          String?
  estimatedEmployees   Int?

  digitalPresenceScore   Int?
  technologyNeedScore    Int?
  economicPotentialScore Int?
  serviceFitScore        Int?
  contactabilityScore    Int?
  leadScore              Int?
  priority               String?   // HOT | ALTO | MEDIO | BAJO | MUY_BAJO

  status        String   @default("NUEVO") // ver Pipeline en API.md
  doNotContact  Boolean  @default(false)   // marca "NO CONTACTAR" (sección 49 del doc original)

  notes         String?
  lastContactAt DateTime?
  nextContactAt DateTime?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  audits         DigitalAudit[]
  opportunities  Opportunity[]
  contacts       Contact[]
  activities     Activity[]
  tasks          Task[]
}

model DigitalAudit {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id])

  websiteExists      Boolean?
  websiteQuality     Int?
  mobileQuality      Int?
  httpsEnabled       Boolean?

  contactForm        Boolean?
  onlineBooking      Boolean?
  whatsapp           Boolean?
  crmDetected        Boolean?
  automationDetected Boolean?
  customerPortal     Boolean?
  onlinePayments     Boolean?
  socialPresence     Boolean?

  technologyScore    Int?
  auditStatus        String?  // DETECTADO | NO_DETECTADO | INFERIDO | PENDIENTE_DE_VALIDAR
  auditedAt          DateTime?

  createdAt DateTime @default(now())
}

model Opportunity {
  id          String   @id @default(cuid())
  leadId      String
  lead        Lead     @relation(fields: [leadId], references: [id])

  category    String   // CRM | AUTOMATIZACIÓN | IA | WEB | RESERVAS | FORMULARIOS | ...
  title       String
  description String?
  evidence    String?
  priority    String?  // ALTA | MEDIA | BAJA

  recommendedService  String?
  estimatedValueMin   Int?
  estimatedValueMax   Int?

  confidence  Int?     // 0-100
  status      String?  // DETECTADO | INFERIDO | PENDIENTE_DE_VALIDAR

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Contact {
  id            String   @id @default(cuid())
  leadId        String
  lead          Lead     @relation(fields: [leadId], references: [id])

  name          String
  role          String?
  email         String?
  phone         String?

  source          String?
  consentStatus   String?  // para trazabilidad RGPD

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Activity {
  id          String   @id @default(cuid())
  leadId      String
  lead        Lead     @relation(fields: [leadId], references: [id])

  type        String   // EMAIL | LLAMADA | WHATSAPP | REUNIÓN | NOTA | TAREA | PROPUESTA
  subject     String?
  description String?
  occurredAt  DateTime @default(now())
  createdBy   String?

  createdAt   DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  leadId      String
  lead        Lead     @relation(fields: [leadId], references: [id])

  title       String
  description String?

  dueAt       DateTime?
  priority    String?
  status      String   @default("PENDIENTE") // PENDIENTE | EN_CURSO | COMPLETADA | CANCELADA

  createdBy   String?
  assignedTo  String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("ADMIN") // ADMIN | MANAGER | COMERCIAL (preparado, no usado aún)

  createdAt DateTime @default(now())
}
```

## Notas de diseño

- `Place` y `Lead` están separados a propósito: `Place` es el dato "de Google", `Lead` es el dato comercial propio. Así, si algún día cambian las políticas de Google sobre qué se puede guardar, solo afecta a `Place`.
- Todos los campos de auditoría/oportunidad usan estados tipo `DETECTADO / NO_DETECTADO / INFERIDO / PENDIENTE_DE_VALIDAR` en vez de booleans absolutos donde el documento original lo pide — evita que el sistema "afirme" cosas que en realidad son inferencias.
- `doNotContact` en `Lead` es la marca obligatoria que menciona la sección 49 del documento original; cualquier automatización futura debe revisar este campo antes de actuar.
- `User.role` se deja preparado en el modelo pero no se usa todavía (ver ARCHITECTURE.md, sección 4) — hoy hay un solo usuario admin.
- Las migraciones concretas (`prisma migrate`) se generan en la Fase 2, no ahora.
