# PROYECTO — MOTOR DE PROSPECCIÓN COMERCIAL Y DETECCIÓN DE OPORTUNIDADES TECNOLÓGICAS

## 0. OBJETIVO DEL DOCUMENTO

Este documento define, de forma completa y fase a fase, el desarrollo de una herramienta web de prospección comercial orientada a detectar empresas que puedan tener necesidades tecnológicas, automatización de procesos, desarrollo de software, CRM, IA o herramientas internas personalizadas.

El proyecto debe desarrollarse dentro de un proyecto web existente que ya dispone de una Landing Page.

### Regla fundamental para Claude

Antes de modificar o crear cualquier funcionalidad:

1. Analizar el proyecto existente.
2. Analizar la Landing Page ya creada.
3. Identificar su stack tecnológico, arquitectura, estilos, componentes, navegación, autenticación, variables de entorno y sistema de diseño.
4. Reutilizar componentes, estilos, colores, tipografías, iconografía, layouts y patrones existentes siempre que sea técnicamente posible.
5. No sustituir ni romper funcionalidades existentes.
6. Adaptar la nueva herramienta visual y funcionalmente al proyecto actual.
7. No crear una segunda aplicación independiente salvo que la arquitectura existente lo requiera.
8. No duplicar funcionalidades ya existentes.
9. Mantener compatibilidad con el código actual.
10. Antes de realizar cambios importantes, explicar qué archivos/componentes se modificarán y por qué.

El resultado debe sentirse como una ampliación natural del producto existente, no como una aplicación añadida posteriormente.

---

# FASE 0 — MVP GRATUITO Y VALIDACIÓN COMERCIAL EN TARRAGONA

## Objetivo

La primera versión no debe intentar cubrir todo el mercado español.

El objetivo es validar el modelo comercial en dos nichos concretos:

- Gestorías de Tarragona.
- Inmobiliarias de Tarragona.

El objetivo principal no es conseguir miles de registros. Es conseguir los primeros clientes.

Flujo:

```text
Google Places
→ descubrimiento
→ análisis
→ scoring
→ oportunidades
→ TOP LEADS
→ contacto manual
→ reuniones
→ propuestas
→ primer cliente
```

## 0.1 Estrategia FREE-FIRST

Durante la Fase 0 se utilizarán los recursos gratuitos disponibles siempre que sean suficientes.

Google Maps Platform utiliza cuotas gratuitas mensuales por SKU para Places API (New). Claude debe consultar la tabla oficial vigente antes de implementar la integración y no asumir importes o cuotas antiguas.

La aplicación debe solicitar únicamente los campos necesarios mediante Field Masks y utilizar los SKUs de menor coste compatibles con cada operación.

La facturación de Google debe configurarse para poder utilizar la plataforma, pero el objetivo es mantener el uso dentro de las cuotas gratuitas durante la validación.

No contratar inicialmente:

```text
APIs premium
scraping de pago
enriquecimiento premium
n8n Cloud
servidores adicionales
bases de datos comerciales
herramientas comerciales premium
```

Si una funcionalidad requiere un servicio de pago, debe quedar desactivada y marcada como PREMIUM hasta autorización.

## 0.2 Primer experimento

Realizar dos pruebas independientes:

```text
50 GESTORÍAS DE TARRAGONA
+
50 INMOBILIARIAS DE TARRAGONA
```

Total objetivo:

```text
100 empresas
```

No es obligatorio alcanzar exactamente 50 por nicho si los resultados reales son inferiores.

Registrar:

```text
empresas encontradas
empresas nuevas
duplicados
empresas descartadas
empresas analizadas
errores
uso de API
```

## 0.3 Google Places API (New)

Utilizar inicialmente Text Search (New) para búsquedas controladas como:

```text
gestorías en Tarragona
asesorías en Tarragona
inmobiliarias en Tarragona
agencias inmobiliarias en Tarragona
```

Se pueden probar variantes controladas para mejorar cobertura.

No ejecutar búsquedas masivas o repetitivas sin necesidad.

La aplicación debe utilizar Place ID como identificador externo para deduplicación.

Los Place IDs pueden almacenarse y reutilizarse; Google recomienda refrescarlos si tienen más de 12 meses.

Los demás datos obtenidos de Places deben tratarse conforme a las políticas vigentes de Google. No convertir Places en una base de datos permanente de contenido de Google.

## 0.4 Protección frente a costes inesperados

Implementar tres niveles de control:

### Google Cloud

```text
API habilitada
Billing configurado
API Key protegida
Cuotas
Alertas
```

### Aplicación

```text
max_results_per_search
max_searches_per_day
max_audits_per_day
max_ai_calls_per_day
```

### Usuario

Antes de una operación que pueda consumir cuota:

```text
Mostrar cantidad estimada
Mostrar límite configurado
Solicitar confirmación cuando corresponda
```

Crear alertas internas:

```text
50%
75%
90%
100%
```

Cuando se alcance el límite interno, bloquear nuevas operaciones hasta confirmación.

## 0.5 Un único motor para los dos nichos

No crear dos aplicaciones ni duplicar lógica.

Utilizar:

```text
MOTOR DE PROSPECCIÓN
       |
       +--- Sector: GESTORÍAS
       |
       +--- Sector: INMOBILIARIAS
```

Crear una configuración `SectorProfile`.

### Gestorías

Priorizar:

```text
gestión documental
portal de clientes
formularios
automatización
CRM
procesos repetitivos
recordatorios
reporting
```

### Inmobiliarias

Priorizar:

```text
captación de leads
CRM
seguimiento comercial
formularios
WhatsApp
automatización
fichas de propiedades
integraciones
```

## 0.6 Flujo real del MVP

```text
1. Seleccionar sector
2. Seleccionar Tarragona
3. Ejecutar búsqueda
4. Obtener resultados
5. Deduplicar por Place ID
6. Analizar empresas seleccionadas
7. Calcular Lead Score
8. Detectar oportunidades
9. Generar argumento comercial
10. Revisar TOP leads
11. Contactar manualmente
12. Registrar resultado
```

## 0.7 No automatizar el contacto

Durante la validación:

```text
DESCUBRIMIENTO = AUTOMÁTICO
ANÁLISIS = AUTOMÁTICO
SCORING = AUTOMÁTICO
ARGUMENTO COMERCIAL = ASISTIDO POR IA
CONTACTO = MANUAL
```

El contacto automático queda fuera del MVP.

## 0.8 Scoring

Mantener el score 0-100.

El scoring inicial será una hipótesis y debe poder ajustarse con resultados comerciales reales.

Mostrar siempre:

```text
Score total
Puntuaciones parciales
Motivos
Evidencias
Nivel de confianza
```

No presentar inferencias como hechos.

Utilizar estados como:

```text
DETECTADO
NO DETECTADO
INFERIDO
PENDIENTE DE VALIDAR
```

## 0.9 Auditoría digital

La auditoría inicial debe utilizar comprobaciones no invasivas:

```text
HTTPS
existencia de web
respuesta HTTP
formulario visible
WhatsApp visible
reserva visible
portal visible
tecnologías visibles
presencia digital
```

No realizar:

```text
pentesting
explotación
bypass
acceso a zonas privadas
scraping agresivo
evasión de protecciones
```

## 0.10 IA

La IA se utilizará después de disponer de datos estructurados.

Debe producir:

```text
problemas potenciales
oportunidades
servicios recomendados
argumento comercial
confianza
```

La salida debe validarse mediante esquema antes de almacenarse.

## 0.11 Prueba con gestorías

Ejecutar:

```text
GESTORÍAS DE TARRAGONA
→ hasta 50 empresas
→ auditoría
→ scoring
→ oportunidades
→ TOP 20
→ contacto
```

Medir:

```text
contactadas
respuestas
reuniones
propuestas
clientes
```

## 0.12 Prueba con inmobiliarias

Ejecutar:

```text
INMOBILIARIAS DE TARRAGONA
→ hasta 50 empresas
→ auditoría
→ scoring
→ oportunidades
→ TOP 20
→ contacto
```

Medir exactamente las mismas métricas.

## 0.13 Comparación de nichos

Al terminar ambas pruebas, mostrar:

```text
Nicho
Empresas analizadas
Leads HOT
Contactadas
Respuestas
Reuniones
Propuestas
Clientes
Tasa de conversión
```

La decisión de escalar se tomará con datos reales.

## 0.14 Primer cliente como KPI principal

El KPI principal de la Fase 0 será:

```text
PRIMER CLIENTE CONSEGUIDO
```

No se considera validación suficiente:

```text
100 empresas encontradas
100 auditorías ejecutadas
100 scores generados
```

La validación comercial requiere evidencia de interés real.

## 0.15 Regla de escalado

No pasar a 1.000 o 10.000 empresas hasta demostrar:

```text
leads relevantes
+
respuestas
+
reuniones
+
propuestas
+
primer cliente
```

La inversión debe crecer detrás de los ingresos.

## 0.16 Bucle de aprendizaje

Utilizar los resultados reales:

```text
LEADS
↓
CONTACTOS
↓
RESULTADOS
↓
CLIENTES
↓
DATOS REALES
↓
MEJOR SCORING
↓
MEJORES LEADS
```

Registrar por qué un lead fue ganado o perdido para mejorar los pesos.

## 0.17 Instrucción obligatoria para Claude

```text
FASE 0 — VALIDACIÓN COMERCIAL

EL OBJETIVO INICIAL NO ES CONSTRUIR UNA PLATAFORMA MASIVA.

EL OBJETIVO ES CONSEGUIR LOS PRIMEROS CLIENTES.

EL MERCADO INICIAL SERÁ:

- GESTORÍAS DE TARRAGONA
- INMOBILIARIAS DE TARRAGONA

UTILIZA GOOGLE PLACES API (NEW) APROVECHANDO LAS CUOTAS GRATUITAS MENSUALES VIGENTES PARA LOS SKUS UTILIZADOS.

ANTES DE IMPLEMENTAR LA INTEGRACIÓN, REVISA LA DOCUMENTACIÓN OFICIAL ACTUAL DE GOOGLE SOBRE:
- PRICING
- USAGE AND BILLING
- FIELD MASKS
- POLICIES
- PLACE IDS
- REQUISITOS DEL EEE

NO UTILICES SERVICIOS PREMIUM SIN AUTORIZACIÓN.

NO REALICES CONSUMO MASIVO.

IMPLEMENTA LÍMITES DE CUOTA Y ALERTAS.

NO AUTOMATICES EL CONTACTO COMERCIAL EN ESTA FASE.

EL PRIMER EXPERIMENTO SERÁ:

HASTA 50 GESTORÍAS DE TARRAGONA
+
HASTA 50 INMOBILIARIAS DE TARRAGONA

ANALIZARLAS, PUNTUARLAS, PRIORIZARLAS Y CONTACTAR LOS MEJORES LEADS.

NO ESCALAR HASTA OBTENER DATOS COMERCIALES REALES.

EL CRITERIO PRINCIPAL DE ÉXITO ES CONSEGUIR EL PRIMER CLIENTE.

NO MODIFIQUES LA LANDING PAGE NI LA ARQUITECTURA EXISTENTE SIN JUSTIFICACIÓN.

INTEGRA TODO DENTRO DEL PROYECTO EXISTENTE.
```

## 0.18 Criterio de finalización

La Fase 0 estará terminada cuando podamos:

```text
buscar gestorías de Tarragona
buscar inmobiliarias de Tarragona
obtener resultados
deduplicarlos
analizarlos
calcular score
detectar oportunidades
priorizar leads
registrar contactos
gestionar seguimiento
```

Y responder:

```text
¿QUÉ EMPRESAS TIENEN MAYOR POTENCIAL?
¿POR QUÉ?
¿QUÉ SERVICIO PODRÍAMOS OFRECERLES?
¿A QUIÉN CONTACTAMOS PRIMERO?
¿CUÁNTAS RESPONDEN?
¿CUÁNTAS ACEPTAN REUNIÓN?
¿HEMOS CONSEGUIDO UN CLIENTE?
```


---

# 1. VISIÓN DEL PRODUCTO

La aplicación no debe limitarse a ser una base de datos de empresas.

Debe convertirse en un:

> MOTOR DE PROSPECCIÓN COMERCIAL QUE DESCUBRE EMPRESAS, LAS ENRIQUECE, ANALIZA SU PRESENCIA DIGITAL, DETECTA POSIBLES NECESIDADES TECNOLÓGICAS, CALCULA UN LEAD SCORE Y AYUDA A GESTIONAR EL PROCESO COMERCIAL.

Flujo principal:

Google Places
→ Descubrimiento
→ Identificación
→ Enriquecimiento
→ Análisis
→ Detección de oportunidades
→ Scoring
→ CRM
→ Contacto
→ Seguimiento
→ Cliente

El objetivo final es que el sistema no solamente diga:

> "Esta empresa existe."

Sino:

> "Esta empresa tiene un alto potencial comercial, estos son los problemas que probablemente presenta y estas son las soluciones que podríamos ofrecerle."

---

# 2. OBJETIVOS DEL MVP

El MVP debe permitir:

- Crear búsquedas comerciales por sector y ubicación.
- Utilizar Google Places API (New) como fuente de descubrimiento.
- Identificar empresas mediante Place ID.
- Evitar almacenar de forma permanente información de Google que no pueda conservarse según sus políticas.
- Crear registros comerciales propios.
- Enriquecer los leads mediante fuentes y procesos permitidos.
- Analizar la presencia digital de una empresa.
- Detectar oportunidades tecnológicas.
- Calcular un Lead Score.
- Clasificar leads por prioridad.
- Gestionar un pipeline comercial.
- Registrar contactos y seguimientos.
- Crear tareas comerciales.
- Consultar un dashboard.
- Preparar la arquitectura para IA.
- Preparar la arquitectura para automatizaciones mediante n8n.
- Mantener trazabilidad de la fuente y fecha de cada dato.

El MVP NO debe comenzar con miles de empresas ni automatizaciones masivas.

Primero debe funcionar correctamente con un nicho concreto y aproximadamente 100 empresas.

---

# 3. PRINCIPIOS DEL PROYECTO

## 3.1 Integración con el proyecto existente

La aplicación debe integrarse en el proyecto actual.

Claude debe inspeccionar:

- package.json
- estructura de carpetas
- framework
- router
- componentes
- sistema CSS
- sistema de diseño
- autenticación
- backend
- API
- base de datos
- ORM
- variables de entorno
- sistema de despliegue
- Landing Page

No crear tecnologías nuevas si el proyecto actual ya dispone de una solución equivalente.

---

## 3.2 Seguridad desde el principio

Nunca:

- introducir API keys directamente en el frontend;
- almacenar secretos en Git;
- exponer credenciales;
- utilizar credenciales de Google desde el navegador si deben permanecer privadas;
- crear endpoints sin validación;
- confiar en datos enviados por el cliente;
- permitir acceso a leads sin autorización.

Toda credencial debe gestionarse mediante variables de entorno y backend seguro.

---

## 3.3 Legalidad y cumplimiento

La arquitectura debe respetar las condiciones de uso de las APIs utilizadas y la normativa aplicable.

Especialmente:

- Google Maps Platform / Places API.
- Protección de datos.
- RGPD.
- LSSI.
- Comunicaciones comerciales.
- Gestión de datos de contacto profesionales.
- Derechos de oposición y supresión cuando correspondan.

No implementar envío masivo de comunicaciones comerciales como parte del MVP.

El sistema debe separar claramente:

1. Descubrimiento.
2. Enriquecimiento.
3. Tratamiento comercial.
4. Comunicación.
5. Seguimiento.

---

# 4. ARQUITECTURA FUNCIONAL

## MÓDULO A — DESCUBRIMIENTO

Permite buscar empresas utilizando criterios como:

- Sector.
- Actividad.
- Ciudad.
- Provincia.
- Zona.
- Radio.
- Tipo de negocio.
- Palabras clave.

Ejemplos:

- gestorías en Madrid
- clínicas veterinarias en Madrid
- inmobiliarias en Valencia
- talleres mecánicos en Barcelona
- empresas de reformas en Sevilla

La búsqueda debe mostrar:

- resultados;
- cantidad encontrada;
- empresas procesadas;
- empresas nuevas;
- empresas ya existentes;
- errores;
- coste estimado de la operación cuando pueda calcularse.

---

# 5. GOOGLE PLACES API

## 5.1 Uso

Utilizar Google Places API (New).

La arquitectura debe utilizar Field Masks y solicitar únicamente los campos necesarios para cada operación.

No solicitar información innecesaria porque los campos afectan al coste.

---

## 5.2 Place ID

El Place ID debe ser el identificador principal externo del negocio.

Debe existir una estructura equivalente a:

```text
place_id
source
last_checked_at
```

El Place ID podrá conservarse como referencia permanente.

Los datos sujetos a las políticas de Google deben tratarse según dichas políticas y actualizarse mediante consultas cuando corresponda.

---

## 5.3 Arquitectura recomendada

```text
Usuario
   ↓
Frontend
   ↓
Backend
   ↓
Places API
   ↓
Normalización
   ↓
Detección de duplicados
   ↓
Lead interno
```

Nunca:

```text
Frontend → API Key Google
```

---

# 6. MODELO DE DATOS

La base de datos debe ser relacional.

Si el proyecto actual ya utiliza PostgreSQL, Prisma u otro ORM, reutilizarlo.

Si no existe una base de datos, utilizar PostgreSQL como opción recomendada.

---

# 7. ENTIDAD PLACE

Representa la identificación externa del negocio.

Campos conceptuales:

```text
id
place_id
source
last_checked_at
created_at
updated_at
```

No convertir esta tabla en una copia indiscriminada de Google Places.

---

# 8. ENTIDAD LEAD

Representa el registro comercial interno.

Campos recomendados:

```text
id
place_id
company_name
sector
subsector
city
province
country

website
phone
email
contact_name
contact_role

company_size
estimated_employees

digital_presence_score
technology_need_score
economic_potential_score
service_fit_score
contactability_score

lead_score
priority

status

detected_problems
detected_opportunities
recommended_services

notes

last_contact_at
next_contact_at

created_at
updated_at
```

La información comercial propia debe quedar separada conceptualmente de los datos procedentes de Google.

---

# 9. ENTIDAD DIGITAL_AUDIT

Debe almacenar el resultado de un análisis tecnológico/digital.

Campos conceptuales:

```text
id
lead_id

website_exists
website_quality
mobile_quality
https_enabled

contact_form
online_booking
whatsapp
crm_detected
automation_detected
customer_portal
online_payments
social_presence

technology_score

audit_status
audited_at
```

No debe asumirse que una ausencia detectada automáticamente significa que la empresa no utiliza una tecnología internamente.

Debe utilizarse lenguaje como:

- "No detectado"
- "No visible"
- "No identificado"
- "Posible oportunidad"

y no afirmaciones absolutas.

---

# 10. ENTIDAD OPPORTUNITY

Representa una posible necesidad tecnológica.

Campos:

```text
id
lead_id

category
title
description
evidence
priority

recommended_service
estimated_value_min
estimated_value_max

confidence
status

created_at
updated_at
```

Ejemplos de categorías:

```text
CRM
AUTOMATIZACIÓN
IA
WEB
RESERVAS
FORMULARIOS
DOCUMENTACIÓN
DASHBOARD
INTEGRACIONES
WHATSAPP
PORTAL_CLIENTES
PRESUPUESTOS
GESTIÓN_INTERNA
```

---

# 11. ENTIDAD CONTACT

Debe permitir registrar contactos comerciales.

Campos:

```text
id
lead_id

name
role
email
phone

source
consent_status

created_at
updated_at
```

La fuente del dato debe registrarse siempre que sea posible.

---

# 12. ENTIDAD ACTIVITY

Registra cualquier interacción comercial.

Ejemplos:

```text
EMAIL
LLAMADA
WHATSAPP
REUNIÓN
NOTA
TAREA
PROPUESTA
```

Campos:

```text
id
lead_id
type
subject
description
occurred_at
created_by
```

---

# 13. ENTIDAD TASK

Para seguimiento comercial.

Campos:

```text
id
lead_id

title
description

due_at
priority
status

created_by
assigned_to

created_at
updated_at
```

Estados:

```text
PENDIENTE
EN_CURSO
COMPLETADA
CANCELADA
```

---

# 14. PIPELINE COMERCIAL

Estados mínimos:

```text
NUEVO
CALIFICADO
CONTACTAR
CONTACTADO
RESPUESTA
REUNIÓN
PROPUESTA
NEGOCIACIÓN
GANADO
PERDIDO
```

Debe poder modificarse posteriormente.

---

# 15. LEAD SCORING

El Lead Score será de 0 a 100.

Propuesta inicial:

```text
Necesidad tecnológica:       30%
Potencial económico:         25%
Encaje con servicios:        20%
Facilidad de contacto:       15%
Presencia digital:            10%
```

Fórmula conceptual:

```text
lead_score =
need_score * 0.30
+ economic_score * 0.25
+ service_fit_score * 0.20
+ contactability_score * 0.15
+ digital_score * 0.10
```

Clasificación:

```text
90-100 = HOT
80-89  = ALTO
65-79  = MEDIO
50-64  = BAJO
0-49   = MUY BAJO
```

El scoring debe ser configurable en el futuro.

---

# 16. EXPLICABILIDAD DEL SCORE

Nunca mostrar únicamente:

> SCORE 87

Debe explicar:

```text
Lead Score: 87

Necesidad tecnológica: 9/10
Potencial económico: 8/10
Encaje con servicios: 9/10
Facilidad de contacto: 7/10
Presencia digital: 8/10
```

Y además:

> Principales motivos del score

Ejemplo:

```text
- No se detecta sistema de reservas.
- La web dispone de formulario limitado.
- No se detecta portal de clientes.
- El negocio pertenece a un sector con alta necesidad de gestión.
- Presenta una presencia digital suficiente para facilitar el contacto.
```

---

# 17. DETECCIÓN DE OPORTUNIDADES

El sistema debe analizar evidencias y generar oportunidades.

Ejemplo:

```text
Empresa:
Clínica Veterinaria X

Detectado:
Web
HTTPS
WhatsApp

No detectado:
Reserva online
Portal de clientes

Oportunidades:

1. Sistema de reservas online
Prioridad: ALTA
Confianza: 88%

2. Portal de clientes
Prioridad: MEDIA
Confianza: 71%

3. Automatización de recordatorios
Prioridad: ALTA
Confianza: 82%
```

---

# 18. IA

La IA no debe controlar directamente el CRM sin validaciones.

La IA debe funcionar como capa de análisis.

Entrada:

```text
datos de empresa
resultado de auditoría
sector
servicios disponibles
```

Salida estructurada:

```json
{
  "problems": [],
  "opportunities": [],
  "recommended_services": [],
  "commercial_argument": "",
  "confidence": 0,
  "reasoning_summary": ""
}
```

La salida debe validarse mediante esquema antes de almacenarse.

No guardar respuestas arbitrarias como si fueran datos estructurados fiables.

---

# 19. ARGUMENTO COMERCIAL

Una de las funcionalidades más importantes.

El sistema debe generar una propuesta de enfoque comercial basada en el diagnóstico.

Ejemplo:

```text
Empresa:
Gestoría X

Problema probable:
Gestión manual de documentación.

Oportunidad:
Portal de clientes + automatización documental.

Argumento comercial:

"Detectamos que existe una oportunidad para centralizar la
solicitud y recepción de documentación de clientes, reduciendo
tareas manuales y mejorando el seguimiento."
```

No debe afirmar que una empresa tiene un problema cuando únicamente existe una inferencia.

Utilizar:

- "hemos detectado"
- "parece existir una oportunidad"
- "no se ha identificado públicamente"
- "sería interesante validar"

---

# 20. PANEL PRINCIPAL

El dashboard debe mostrar:

```text
TOTAL LEADS
LEADS NUEVOS
LEADS HOT
LEADS CONTACTADOS
REUNIONES
PROPUESTAS
GANADOS
VALOR POTENCIAL
```

También:

```text
Top 10 oportunidades
Top 10 leads
Leads sin contactar
Tareas pendientes
Próximos seguimientos
```

---

# 21. PANTALLA DE DESCUBRIMIENTO

Debe permitir:

```text
Sector
Ciudad
Radio
Palabras clave
Cantidad objetivo
```

Botón:

```text
BUSCAR EMPRESAS
```

Después:

```text
RESULTADOS
```

Cada resultado debe mostrar:

```text
Empresa
Sector
Ubicación
Estado
Score
Oportunidades
```

Acciones:

```text
VER
ANALIZAR
AÑADIR AL CRM
```

---

# 22. PANTALLA DE LEADS

Debe tener:

- búsqueda;
- filtros;
- ordenación;
- paginación;
- columnas configurables.

Filtros:

```text
Sector
Ciudad
Score
Prioridad
Estado
Oportunidad
Fecha de creación
Último contacto
Próximo contacto
```

Orden recomendado:

```text
Lead Score DESC
```

---

# 23. FICHA DEL LEAD

Diseñar una ficha completa.

## Cabecera

```text
Nombre empresa
Sector
Ciudad
Score
Prioridad
Estado
```

## Información

```text
Web
Teléfono
Email
Contacto
```

## Diagnóstico

```text
Presencia digital
Tecnología
Automatización
```

## Oportunidades

Lista de oportunidades.

## Actividad

Timeline:

```text
26/08 — Lead creado
26/08 — Auditoría ejecutada
27/08 — Llamada
28/08 — Reunión
```

## Seguimiento

```text
Próxima acción
Fecha
Responsable
```

---

# 24. PANTALLA DE PIPELINE

Vista tipo Kanban:

```text
NUEVO
   ↓
CALIFICADO
   ↓
CONTACTAR
   ↓
CONTACTADO
   ↓
RESPUESTA
   ↓
REUNIÓN
   ↓
PROPUESTA
   ↓
NEGOCIACIÓN
   ↓
GANADO
```

También:

```text
PERDIDO
```

Debe permitir mover leads entre columnas.

---

# 25. AUDITORÍA DIGITAL

La auditoría debe comprobar únicamente elementos técnicamente verificables.

Ejemplos:

```text
HTTPS
existencia de web
respuesta HTTP
redirecciones
viewport
presencia de formulario
presencia de enlaces de contacto
presencia de WhatsApp
presencia de reservas
presencia de determinadas tecnologías
```

Evitar análisis agresivos.

No realizar:

- pentesting;
- explotación de vulnerabilidades;
- crawling indiscriminado;
- bypass de protecciones;
- scraping de zonas privadas;
- ataques automatizados.

La auditoría es comercial, no ofensiva.

---

# 26. ENRIQUECIMIENTO

El sistema debe tener una arquitectura preparada para distintos proveedores.

Ejemplo:

```text
Google Places
     ↓
Enrichment Provider
     ↓
Normalizer
     ↓
Lead
```

Crear una interfaz abstracta para proveedores.

Por ejemplo:

```text
EnrichmentProvider
```

Así será posible añadir posteriormente otros servicios sin reescribir el sistema.

---

# 27. N8N

n8n debe considerarse una capa de automatización externa.

Ejemplos futuros:

```text
Nuevo lead HOT
      ↓
n8n
      ↓
Crear tarea
      ↓
Notificación
```

Otro:

```text
Lead pasa a REUNIÓN
      ↓
n8n
      ↓
crear recordatorio
```

Otro:

```text
Propuesta creada
      ↓
n8n
      ↓
seguimiento a X días
```

El MVP debe dejar preparada la arquitectura, pero no necesita automatizarlo todo desde el principio.

---

# 28. NOTIFICACIONES

Preparar sistema para:

- tareas vencidas;
- nuevos leads HOT;
- leads sin contacto;
- reuniones próximas;
- seguimientos pendientes.

---

# 29. AUDITORÍA Y TRAZABILIDAD

Registrar:

```text
quién
qué
cuándo
sobre qué lead
resultado
```

Especialmente para:

- cambios de estado;
- cambios de score;
- auditorías;
- enriquecimientos;
- generación IA;
- contactos;
- eliminación.

---

# 30. DUPLICADOS

La aplicación debe impedir duplicados.

Reglas:

1. Place ID como identificador externo principal.
2. Si no existe Place ID, usar combinación controlada de datos.
3. No crear otro lead si ya existe.
4. Permitir actualizar información existente.
5. Registrar fecha de última actualización.

---

# 31. CONTROL DE COSTES

La integración con APIs externas debe estar diseñada para controlar costes.

Implementar:

```text
cache temporal
rate limiting
logs de consumo
límites por usuario
límites por búsqueda
```

Mostrar en administración:

```text
búsquedas realizadas
lugares procesados
auditorías ejecutadas
coste estimado
errores
```

No ejecutar procesos masivos sin confirmación.

---

# 32. ROLES Y PERMISOS

Preparar:

```text
ADMIN
MANAGER
COMERCIAL
```

Ejemplo:

ADMIN:

- configuración;
- usuarios;
- integraciones;
- costes.

MANAGER:

- todos los leads;
- estadísticas;
- asignaciones.

COMERCIAL:

- leads asignados;
- actividades;
- tareas;
- pipeline.

---

# 33. VARIABLES DE ENTORNO

Nunca introducir secretos en código.

Ejemplo conceptual:

```env
DATABASE_URL=

GOOGLE_MAPS_API_KEY=

AI_API_KEY=

N8N_WEBHOOK_URL=

APP_URL=
```

Los nombres deben adaptarse a la arquitectura existente.

---

# 34. FASES DE DESARROLLO

# FASE 0 — AUDITORÍA DEL PROYECTO EXISTENTE

Antes de programar.

Claude debe:

- analizar repositorio;
- detectar stack;
- detectar arquitectura;
- analizar Landing Page;
- identificar base de datos;
- identificar backend;
- identificar frontend;
- identificar autenticación;
- identificar sistema de diseño;
- identificar rutas;
- identificar componentes reutilizables;
- detectar posibles conflictos.

Entregable:

```text
PROJECT_AUDIT.md
```

No realizar todavía grandes cambios.

---

# FASE 1 — ARQUITECTURA

Definir:

- módulos;
- entidades;
- relaciones;
- endpoints;
- permisos;
- estructura frontend;
- estructura backend;
- integraciones.

Entregables:

```text
ARCHITECTURE.md
DATABASE.md
API.md
```

---

# FASE 2 — BASE DE DATOS

Crear migraciones.

Implementar:

- Place;
- Lead;
- DigitalAudit;
- Opportunity;
- Contact;
- Activity;
- Task;
- User;
- configuración.

Crear índices.

Crear relaciones.

Crear restricciones.

Probar migraciones.

---

# FASE 3 — CRM BÁSICO

Implementar:

- listado de leads;
- filtros;
- búsqueda;
- ficha;
- edición;
- estados;
- notas;
- actividades;
- tareas.

Primero debe funcionar sin IA ni Google.

Objetivo:

> disponer de un CRM funcional.

---

# FASE 4 — PIPELINE

Implementar Kanban.

Funciones:

- mover leads;
- cambiar estado;
- registrar actividad automáticamente;
- filtros;
- contador por etapa.

---

# FASE 5 — GOOGLE PLACES

Implementar:

```text
Frontend
→ Backend
→ Places API
→ normalización
→ detección duplicados
→ resultados
```

Añadir control de errores.

No exponer API key.

Registrar costes/uso.

---

# FASE 6 — ENRIQUECIMIENTO

Crear la arquitectura de proveedores.

Implementar primero el proveedor mínimo necesario.

Cada dato debe tener:

```text
source
last_updated
```

---

# FASE 7 — AUDITORÍA DIGITAL

Crear motor de análisis.

Primero reglas deterministas.

Ejemplo:

```text
HTTPS = true
Formulario = false
Reserva = false
WhatsApp = true
```

Después convertir estos resultados en oportunidades.

---

# FASE 8 — SCORING

Implementar score 0-100.

Crear servicio independiente:

```text
LeadScoringService
```

Debe poder recalcular el score.

Debe guardar:

- score total;
- puntuaciones parciales;
- motivos.

---

# FASE 9 — IA

Implementar:

```text
AIAnalysisService
```

Funciones:

- detectar oportunidades;
- recomendar servicios;
- generar resumen;
- generar argumento comercial;
- estimar confianza.

Validar siempre la salida.

---

# FASE 10 — DASHBOARD

Implementar:

- KPIs;
- gráficos;
- pipeline;
- leads HOT;
- oportunidades;
- tareas.

Adaptar completamente al diseño existente.

---

# FASE 11 — AUTOMATIZACIONES

Integración con n8n.

Primero:

```text
Lead HOT
→ webhook
```

Después:

```text
Tarea vencida
→ webhook
```

Después:

```text
Seguimiento
→ webhook
```

---

# FASE 12 — SEGURIDAD

Realizar auditoría:

- autenticación;
- autorización;
- sesiones;
- cookies;
- CSRF si aplica;
- CORS;
- rate limiting;
- validación;
- SQL injection;
- XSS;
- SSRF;
- exposición de secretos;
- logs;
- errores;
- endpoints administrativos.

No almacenar datos sensibles innecesarios.

---

# FASE 13 — TESTS

Crear:

## Unitarios

- scoring;
- normalización;
- detección duplicados;
- validaciones;
- reglas de auditoría.

## Integración

- Places;
- base de datos;
- endpoints;
- autenticación.

## E2E

Flujo:

```text
Login
→ búsqueda
→ resultado
→ crear lead
→ analizar
→ score
→ mover pipeline
→ crear tarea
```

---

# FASE 14 — OPTIMIZACIÓN

Revisar:

- rendimiento;
- consultas;
- índices;
- paginación;
- caché;
- costes de API;
- carga frontend;
- llamadas IA.

No optimizar prematuramente.

---

# FASE 15 — PRODUCCIÓN

Preparar:

- variables de entorno;
- base de datos;
- migraciones;
- backups;
- logs;
- monitoring;
- dominio;
- HTTPS;
- límites;
- recuperación ante errores.

---

# 35. ORDEN DE IMPLEMENTACIÓN OBLIGATORIO

Claude debe seguir este orden:

```text
0. Auditar proyecto
1. Arquitectura
2. Base de datos
3. CRM
4. Pipeline
5. Google Places
6. Enriquecimiento
7. Auditoría digital
8. Scoring
9. IA
10. Dashboard
11. Automatizaciones
12. Seguridad
13. Tests
14. Optimización
15. Producción
```

No saltarse fases.

No desarrollar IA antes de disponer de datos estructurados fiables.

No desarrollar automatizaciones antes de que el CRM básico funcione.

---

# 36. CRITERIOS DE FINALIZACIÓN DE CADA FASE

Una fase solo se considera terminada cuando:

- compila;
- no rompe funcionalidades existentes;
- tests relevantes pasan;
- no existen errores críticos;
- documentación actualizada;
- variables de entorno documentadas;
- migraciones comprobadas;
- UI adaptada al proyecto existente;
- cambios revisados.

Al finalizar cada fase Claude debe entregar:

```text
FASE COMPLETADA

Cambios realizados:
...

Archivos modificados:
...

Archivos creados:
...

Tests ejecutados:
...

Resultado:
...

Problemas pendientes:
...

Siguiente fase:
...
```

---

# 37. REGLAS PARA CLAUDE CODE

Claude debe trabajar como desarrollador senior.

Antes de modificar:

```text
INSPECCIONAR
→ COMPRENDER
→ PLANIFICAR
→ IMPLEMENTAR
→ PROBAR
→ DOCUMENTAR
```

No:

```text
IMPROVISAR
→ MODIFICAR
→ ROMPER
```

Antes de cada fase:

1. Analizar código relacionado.
2. Identificar dependencias.
3. Proponer implementación.
4. Ejecutar cambios.
5. Ejecutar tests.
6. Revisar errores.
7. Documentar.

---

# 38. REUTILIZACIÓN DE LA LANDING PAGE

La Landing Page existente es la referencia visual y de producto.

Claude debe extraer de ella:

- colores;
- tipografías;
- tamaños;
- bordes;
- sombras;
- botones;
- cards;
- espaciados;
- navegación;
- logo;
- iconos;
- tono de textos;
- responsive;
- componentes.

No crear un diseño visual completamente diferente.

Si existen componentes reutilizables, utilizarlos.

Si existe un sistema de diseño, extenderlo.

---

# 39. NAVEGACIÓN

Añadir la nueva herramienta al sistema de navegación existente.

Propuesta:

```text
Dashboard
Prospección
Leads
Pipeline
Oportunidades
Auditorías
Tareas
Configuración
```

La nomenclatura final debe adaptarse a la aplicación existente.

---

# 40. EXPERIENCIA DE USUARIO

El usuario debe poder realizar el flujo principal con pocos pasos:

```text
1. Seleccionar sector
2. Seleccionar zona
3. Buscar
4. Revisar resultados
5. Analizar
6. Obtener score
7. Ver oportunidad
8. Añadir/gestionar lead
9. Contactar
10. Programar seguimiento
```

La interfaz debe priorizar:

- claridad;
- velocidad;
- información accionable;
- pocos clics;
- filtros;
- búsqueda;
- visualización del score;
- siguiente acción.

---

# 41. PRIMER CASO DE USO REAL

No empezar con todos los sectores.

Crear una prueba con:

```text
1 sector
1 ciudad
100 empresas
```

Objetivo:

```text
100 empresas
↓
100 leads
↓
auditoría
↓
score
↓
oportunidades
↓
top 20
↓
contacto comercial
```

Medir:

```text
% de empresas válidas
% de auditorías correctas
% de oportunidades relevantes
% de leads HOT
% de contactos realizados
% de respuestas
% de reuniones
% de propuestas
% de conversiones
```

---

# 42. MÉTRICAS DEL PRODUCTO

Dashboard futuro:

```text
Leads descubiertos
Leads analizados
Leads HOT
Leads contactados
Tasa de respuesta
Reuniones
Propuestas
Clientes
Conversión
Valor potencial
Valor ganado
```

---

# 43. ROADMAP FUTURO

Después del MVP:

### V2

- más proveedores;
- más sectores;
- plantillas comerciales;
- mejores auditorías;
- scoring avanzado;
- segmentación.

### V3

- IA avanzada;
- generación de diagnósticos;
- recomendación automática de servicios;
- predicción de conversión;
- automatizaciones.

### V4

- multiempresa;
- equipos comerciales;
- permisos avanzados;
- reporting;
- facturación del SaaS.

### V5

Convertir la herramienta en producto comercial para terceros.

---

# 44. REQUISITOS NO FUNCIONALES

Debe ser:

- segura;
- escalable;
- mantenible;
- modular;
- responsive;
- rápida;
- documentada;
- testeable.

Evitar:

- código duplicado;
- lógica de negocio en componentes UI;
- secretos en frontend;
- consultas SQL sin control;
- endpoints gigantes;
- funciones monolíticas;
- dependencias innecesarias.

---

# 45. ARQUITECTURA LÓGICA

```text
                    FRONTEND
                       │
                       ▼
                  API / BACKEND
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      CRM          DISCOVERY       ANALYSIS
        │              │              │
        ▼              ▼              ▼
   PostgreSQL     Google Places      IA
        │
        ▼
   AUDIT / SCORE
        │
        ▼
   OPPORTUNITIES
        │
        ▼
    PIPELINE
        │
        ▼
  AUTOMATIZACIONES
        │
        ▼
       n8n
```

---

# 46. REGLA SOBRE DATOS DE GOOGLE

Nunca diseñar la aplicación suponiendo que Google Places es una base de datos propia que se puede copiar indefinidamente.

La arquitectura debe estar preparada para:

```text
Place ID permanente
+
consulta de datos cuando sean necesarios
+
datos comerciales propios separados
```

Revisar siempre las políticas actuales de Google antes de pasar a producción.

---

# 47. REGLA SOBRE SCRAPING

No realizar scraping indiscriminado de Google Maps.

Google Places API será el mecanismo principal de descubrimiento.

Para otras fuentes:

- utilizar APIs oficiales cuando existan;
- respetar términos de uso;
- respetar robots.txt cuando corresponda;
- respetar límites;
- no acceder a zonas privadas;
- no realizar técnicas de evasión.

---

# 48. REGLA SOBRE IA

La IA es un asistente de análisis, no una fuente absoluta de verdad.

Toda inferencia debe identificarse como:

```text
DETECTADO
INFERIDO
NO DETECTADO
PENDIENTE DE VALIDAR
```

La aplicación debe evitar presentar inferencias como hechos.

---

# 49. REGLA SOBRE CONTACTOS COMERCIALES

El sistema debe permitir registrar:

```text
fuente
fecha de obtención
tipo de contacto
estado de autorización/oposición cuando corresponda
```

Debe existir una forma de marcar:

```text
NO CONTACTAR
```

Y esa marca debe bloquear cualquier automatización comercial futura.

---

# 50. PROMPT OPERATIVO PARA CLAUDE

A partir de este documento, Claude debe ejecutar el desarrollo por fases.

Prompt inicial:

```text
LEE COMPLETAMENTE ESTE DOCUMENTO ANTES DE REALIZAR CUALQUIER CAMBIO.

ESTÁS TRABAJANDO SOBRE UN PROYECTO EXISTENTE.

TU PRIMERA TAREA NO ES PROGRAMAR.

TU PRIMERA TAREA ES AUDITAR EL PROYECTO ACTUAL Y COMPRENDERLO.

DEBES ANALIZAR:

- ESTRUCTURA DEL PROYECTO
- STACK
- FRONTEND
- BACKEND
- BASE DE DATOS
- AUTENTICACIÓN
- ROUTING
- COMPONENTES
- SISTEMA DE DISEÑO
- LANDING PAGE
- VARIABLES DE ENTORNO
- TESTS
- DESPLIEGUE
- FUNCIONALIDADES EXISTENTES

LA LANDING PAGE EXISTENTE ES LA REFERENCIA VISUAL Y DE PRODUCTO.

NO CREES UNA APLICACIÓN PARALELA.

NO CAMBIES EL DISEÑO EXISTENTE SIN JUSTIFICACIÓN.

NO ELIMINES FUNCIONALIDADES EXISTENTES.

NO INTRODUZCAS TECNOLOGÍAS NUEVAS SI EL PROYECTO ACTUAL YA DISPONE DE UNA SOLUCIÓN EQUIVALENTE.

DESPUÉS DE LA AUDITORÍA, CREA UN DOCUMENTO PROJECT_AUDIT.md EXPLICANDO:

1. ARQUITECTURA ACTUAL
2. STACK
3. ESTRUCTURA DE CARPETAS
4. LANDING PAGE
5. COMPONENTES REUTILIZABLES
6. BASE DE DATOS
7. AUTENTICACIÓN
8. RUTAS
9. VARIABLES DE ENTORNO
10. PUNTOS DE INTEGRACIÓN
11. RIESGOS
12. RECOMENDACIÓN DE IMPLEMENTACIÓN

NO DESARROLLES TODAVÍA LA FUNCIONALIDAD DE PROSPECCIÓN.

CUANDO TERMINES LA AUDITORÍA, DETENTE Y PRESENTA EL RESULTADO.

NO AVANCES A LA SIGUIENTE FASE HASTA RECIBIR CONFIRMACIÓN.
```

---

# 51. PROMPT PARA CADA FASE

Después de aprobar la auditoría:

```text
IMPLEMENTA ÚNICAMENTE LA FASE [NÚMERO] DE ESTE DOCUMENTO.

ANTES DE MODIFICAR EL CÓDIGO:

1. REVISA LA ARQUITECTURA EXISTENTE.
2. REVISA LOS COMPONENTES QUE PUEDAN REUTILIZARSE.
3. REVISA LAS DEPENDENCIAS.
4. REVISA LAS MIGRACIONES.
5. IDENTIFICA POSIBLES CONFLICTOS.

DESPUÉS:

1. IMPLEMENTA LA FASE.
2. RESPETA EL DISEÑO EXISTENTE.
3. NO MODIFIQUES FUNCIONALIDADES NO RELACIONADAS.
4. EJECUTA TESTS.
5. EJECUTA LINT/TYPECHECK SI EXISTEN.
6. CORRIGE LOS ERRORES PRODUCIDOS.
7. ACTUALIZA LA DOCUMENTACIÓN.

AL FINALIZAR, ENTREGA:

- CAMBIOS REALIZADOS
- ARCHIVOS MODIFICADOS
- ARCHIVOS NUEVOS
- MIGRACIONES
- TESTS EJECUTADOS
- RESULTADO
- PROBLEMAS PENDIENTES
- SIGUIENTE FASE

NO AVANCES A LA SIGUIENTE FASE.
```

---

# 52. DEFINICIÓN DE ÉXITO DEL PROYECTO

El proyecto será considerado exitoso cuando el usuario pueda:

```text
BUSCAR UN NICHO
       ↓
ENCONTRAR EMPRESAS
       ↓
ANALIZARLAS
       ↓
DETECTAR OPORTUNIDADES
       ↓
OBTENER UN SCORE
       ↓
PRIORIZAR LEADS
       ↓
GESTIONAR CONTACTOS
       ↓
REALIZAR SEGUIMIENTO
       ↓
CONVERTIR LEADS EN CLIENTES
```

La herramienta debe ayudar a responder tres preguntas:

### 1. ¿A QUIÉN DEBO CONTACTAR?

Lead Score.

### 2. ¿POR QUÉ DEBO CONTACTARLO?

Oportunidades detectadas.

### 3. ¿QUÉ LE PUEDO OFRECER?

Servicio recomendado + argumento comercial.

Ese es el núcleo del producto.

---

# 53. PRINCIPIO FINAL

No construir una simple base de datos de empresas.

Construir:

> **UNA PLATAFORMA DE INTELIGENCIA COMERCIAL QUE CONVIERTA DATOS DE EMPRESAS EN OPORTUNIDADES DE NEGOCIO ACCIONABLES.**

La aplicación existente debe ser el punto de partida visual y técnico.

La nueva funcionalidad debe integrarse dentro de ella y evolucionar de forma incremental.

El desarrollo debe realizarse fase a fase, validando cada etapa antes de continuar.

FIN DEL DOCUMENTO.
