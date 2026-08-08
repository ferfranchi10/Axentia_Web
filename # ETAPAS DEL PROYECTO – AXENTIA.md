# ETAPAS DEL PROYECTO – AXENTIA

## Objetivo general

Desarrollar una **landing page minimalista, moderna y funcional** para **AXENTIA**, orientada a captar empresas interesadas en una **auditoría gratuita** y automatizar la recepción y gestión de las solicitudes.

---

# ETAPA 1 – DEFINICIÓN Y PLANIFICACIÓN

## Objetivos

- Definir la propuesta de valor.
- Establecer el flujo de conversión.
- Preparar la identidad visual inicial.

## Tareas

- Confirmar nombre y branding: **AXENTIA**.
- Definir colores corporativos.
- Definir tipografía.
- Establecer estructura de una sola página.
- Definir los datos que se recopilarán en el cuestionario.

## Resultado esperado

- Documento de requisitos funcionales.
- Paleta de colores.
- Wireframe simple de la landing.

---

# ETAPA 2 – CONFIGURACIÓN DEL PROYECTO

## Objetivos

Preparar el entorno de desarrollo base.

## Tareas

- Crear proyecto con **Next.js 15**.
- Configurar **TypeScript**.
- Instalar **Tailwind CSS**.
- Configurar estructura de carpetas.
- Configurar fuentes de Google (Inter).

## Resultado esperado

Proyecto funcionando con:

```bash
npm install
npm run dev
```

---

# ETAPA 3 – DISEÑO DEL HERO PRINCIPAL

## Objetivos

Crear una primera impresión fuerte y profesional.

## Contenido

### Título

> Descubrí qué procesos de tu empresa podés optimizar hoy mismo

### Subtítulo

> Auditoría gratuita para detectar mejoras, automatizaciones e integraciones tecnológicas que te ahorren tiempo y dinero.

### CTA

- Solicitar auditoría gratuita

## Tareas técnicas

- Layout responsive.
- Botón con scroll suave.
- Imagen o ilustración tecnológica liviana.
- Optimización para móvil.

## Resultado esperado

Hero atractivo y completamente responsive.

---

# ETAPA 4 – SECCIÓN DE SERVICIOS

## Objetivos

Explicar rápidamente qué hace AXENTIA.

## Tarjetas

### Automatización

Reducimos tareas repetitivas.

### Integración de IA

Implementamos soluciones inteligentes.

### Optimización de procesos

Detectamos cuellos de botella.

### Herramientas personalizadas

Creamos soluciones adaptadas a tu empresa.

## Resultado esperado

Sección visual clara con máximo 4 tarjetas.

---

# ETAPA 5 – FORMULARIO DE AUDITORÍA GRATUITA

## Objetivos

Captar leads de empresas interesadas.

## Campos

### Empresa

- Nombre de la empresa
- Sector
- Empleados aproximados

### Necesidades

Checkbox múltiple:

- Facturación
- Gestión administrativa
- Seguimiento de clientes
- Reportes automáticos
- Integración de sistemas
- IA / automatización
- Otro

### Descripción

Textarea obligatorio.

### Contacto

- Nombre y apellido
- Email
- Teléfono / WhatsApp

## Resultado esperado

Formulario validado y usable desde móvil y desktop.

---

# ETAPA 6 – BACKEND Y API DE CONTACTO

## Objetivos

Procesar correctamente las solicitudes.

## Tareas

- Crear endpoint `/api/contact`.
- Validar datos recibidos.
- Sanitizar entradas.
- Manejar errores.
- Retornar respuestas JSON.

## Resultado esperado

API funcional y segura.

---

# ETAPA 7 – ENVÍO DE CORREOS

## Objetivos

Automatizar la comunicación.

## Correo interno

### Destino

```txt
axentia.consultinng@gmail.com
```

### Contenido

- Datos de la empresa
- Necesidades seleccionadas
- Descripción del problema
- Información de contacto

## Correo al cliente

### Asunto

```txt
Hemos recibido tu solicitud – AXENTIA
```

### Contenido

Confirmación de recepción y próximos pasos.

## Resultado esperado

Envío exitoso de ambos correos mediante Gmail SMTP y Nodemailer.

---

# ETAPA 8 – EXPERIENCIA DE USUARIO

## Objetivos

Mejorar la conversión y la usabilidad.

## Tareas

- Estados de carga.
- Mensaje de éxito.
- Mensaje de error.
- Deshabilitar botón durante el envío.
- Scroll automático tras envío exitoso.
- Animaciones suaves con Tailwind.

## Resultado esperado

Experiencia fluida y profesional.

---

# ETAPA 9 – RESPONSIVE Y OPTIMIZACIÓN

## Objetivos

Garantizar funcionamiento perfecto en todos los dispositivos.

## Tareas

### Móvil

- Una sola columna.
- Inputs grandes.
- Botones de ancho completo.

### Tablet

- Servicios en 2 columnas.

### Desktop

- Hero en 2 columnas.
- Servicios en 4 columnas.

## Optimización

- Imágenes comprimidas.
- Uso de SVG.
- Lazy loading cuando corresponda.
- Lighthouse Performance > 90.

## Resultado esperado

Landing rápida y perfectamente responsive.

---

# ETAPA 10 – SEO Y METADATOS

## Objetivos

Mejorar la presencia en buscadores.

## Configuración

### Title

```txt
AXENTIA | Consultoría Tecnológica y Energética
```

### Description

```txt
Auditoría gratuita para optimizar procesos, automatizar tareas e integrar soluciones tecnológicas e IA en tu empresa.
```

## Resultado esperado

Metadatos correctamente configurados.

---

# ETAPA 11 – TESTING COMPLETO

## Objetivos

Verificar que todo funcione antes de publicar.

## Checklist

### Formulario

- [ ] Validaciones correctas
- [ ] Envío exitoso
- [ ] Manejo de errores

### Correos

- [ ] Llega a AXENTIA
- [ ] Llega al cliente
- [ ] Formato HTML correcto

### Responsive

- [ ] Móvil
- [ ] Tablet
- [ ] Desktop

### Rendimiento

- [ ] Carga rápida
- [ ] Sin errores de consola
- [ ] Sin warnings críticos

## Resultado esperado

Sistema listo para producción.

---

# ETAPA 12 – DESPLIEGUE

## Objetivos

Publicar la landing online.

## Recomendado

### Hosting

- **Vercel**

## Tareas

- Configurar variables de entorno.
- Conectar repositorio GitHub.
- Realizar primer deploy.
- Verificar dominio y HTTPS.

## Resultado esperado

Landing pública accesible desde cualquier dispositivo.

---

# ETAPA 13 – MEJORAS FUTURAS

## Prioridad media

### Integraciones

- Google Sheets
- Notion
- Airtable
- CRM

### Automatizaciones

- Envío a WhatsApp
- Seguimiento automático
- Pipeline comercial

## Prioridad baja

- Blog
- Panel administrativo
- Área de clientes
- Analítica avanzada

---

# CRONOGRAMA RECOMENDADO

| Etapa | Tiempo estimado |
|------|----------------|
| 1. Planificación | 0.5 día |
| 2. Configuración | 0.5 día |
| 3. Hero | 0.5 día |
| 4. Servicios | 0.5 día |
| 5. Formulario | 1 día |
| 6. Backend | 0.5 día |
| 7. Correos | 0.5 día |
| 8. UX | 0.5 día |
| 9. Responsive | 0.5 día |
| 10. SEO | 0.25 día |
| 11. Testing | 0.5 día |
| 12. Deploy | 0.25 día |

**Tiempo total estimado:** 4 a 5 días de trabajo.

---

# CRITERIOS DE ÉXITO

El proyecto se considerará finalizado cuando:

- La landing cargue en menos de 2 segundos.
- El formulario funcione correctamente.
- Se envíen ambos correos automáticamente.
- La experiencia móvil sea excelente.
- El diseño transmita **confianza, innovación y profesionalismo**.
- Un usuario nuevo pueda completar la solicitud en menos de 2 minutos.

---

# RESULTADO FINAL ESPERADO

Una landing page que permita a **AXENTIA**:

- Captar empresas interesadas.
- Recibir diagnósticos iniciales estructurados.
- Automatizar el primer contacto comercial.
- Transmitir una imagen moderna y profesional desde el primer momento.