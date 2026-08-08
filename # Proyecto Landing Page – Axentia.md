# Proyecto Landing Page – Axentia

## Objetivo

Crear una **landing page moderna, simple, profesional y muy funcional** para **Axentia**, enfocada en captar empresas interesadas en una **auditoría tecnológica y energética gratuita**.

La página debe priorizar:

- Conversión rápida.
- Diseño visual atractivo.
- Muy poco texto.
- CTA claros.
- Formulario de diagnóstico inicial.
- Envío automático de correos.

---

# Identidad de Marca

## Nombre

**Axentia**

## Estilo visual

- Profesional
- Tecnológico
- Minimalista
- Moderno
- Inspirado en tonos **celeste + blanco + gris oscuro**

## Paleta sugerida

- Celeste principal: `#4DA8FF`
- Azul oscuro: `#0B1F33`
- Blanco: `#FFFFFF`
- Gris claro: `#F5F7FA`
- Gris texto: `#5B6573`

## Tipografía

- **Inter**
- Alternativa: **Poppins**

---

# Estructura de la Landing

## 1. Hero principal

### Contenido

**Título grande**

> Descubrí qué procesos de tu empresa podés optimizar hoy mismo

**Subtítulo corto**

> Auditoría gratuita para detectar mejoras, automatizaciones e integraciones tecnológicas que te ahorren tiempo y dinero.

### Botones

- **Solicitar auditoría gratuita** (scroll al formulario)
- **WhatsApp** (opcional)

### Visual

- Ilustración tecnológica o dashboard moderno.
- Fondo limpio con detalles suaves en celeste.

---

## 2. Sección “Qué hacemos”

Mantener **máximo 4 tarjetas**.

### Tarjetas

#### Automatización

Reducimos tareas repetitivas.

#### Integración de IA

Implementamos soluciones inteligentes.

#### Optimización de procesos

Detectamos cuellos de botella.

#### Herramientas personalizadas

Creamos soluciones adaptadas a tu empresa.

Texto muy corto, máximo **una línea por tarjeta**.

---

## 3. Sección “Auditoría gratuita”

### Título

> Contanos qué querés mejorar

### Texto

> Respondé este breve cuestionario y analizaremos tu caso sin compromiso.

---

# Formulario Principal

## Campos

### Información de empresa

- Nombre de la empresa
- Sector / actividad
- Cantidad aproximada de empleados

### Qué necesita resolver

**Checkboxes**

- Facturación
- Gestión administrativa
- Seguimiento de clientes
- Reportes automáticos
- Integración de sistemas
- IA / automatización
- Otro

### Descripción libre

**Textarea**

> Explicanos brevemente qué problema querés resolver o qué te gustaría implementar en tu empresa.

### Datos de contacto

- Nombre y apellido
- Email
- Teléfono / WhatsApp

### Botón principal

**Enviar solicitud gratuita**

---

# Flujo esperado

## Al enviar el formulario

### 1. Correo interno a Axentia

**Destino**

`axentia.consultinng@gmail.com`

### Asunto

```txt
Nueva solicitud de auditoría gratuita – [Nombre Empresa]
```

### Cuerpo del correo

```txt
Nueva solicitud recibida desde la landing de Axentia.

Empresa:
[empresa]

Sector:
[sector]

Empleados:
[empleados]

Necesidades seleccionadas:
[checkboxes]

Descripción:
[mensaje]

Contacto:
[nombre]
[email]
[telefono]
```

---

### 2. Correo automático al cliente

**Asunto**

```txt
Hemos recibido tu solicitud – Axentia
```

### Contenido

```txt
Hola [nombre],

Gracias por solicitar una auditoría gratuita con Axentia.

Hemos recibido correctamente la información de tu empresa y nuestro equipo analizará tu caso para identificar posibles oportunidades de mejora, automatización o integración tecnológica.

En los próximos días nos pondremos en contacto para explicarte los siguientes pasos y coordinar una primera reunión.

Gracias por confiar en Axentia.

Axentia
Consultoría Tecnológica y Energética
axentia.consultinng@gmail.com
```

---

# Requisitos Técnicos

## Stack recomendado

### Frontend

- Next.js 15
- React
- Tailwind CSS

### Backend

Opción recomendada:

- **Next.js Server Actions**

Alternativas válidas:

- API Route `/api/contact`
- Resend
- Nodemailer
- SendGrid

---

# Implementación sugerida

## Variables de entorno

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=axentia.consultinng@gmail.com
SMTP_PASS=APP_PASSWORD
```

> Utilizar **App Password de Gmail**, no la contraseña normal.

---

# Diseño UX/UI

## Características obligatorias

- Responsive móvil primero.
- Formulario en una sola columna en móvil.
- Animaciones suaves.
- Botones grandes y visibles.
- Mucho espacio en blanco.
- Sin párrafos largos.
- Máximo **3 scrolls completos** para llegar al formulario.

---

# Estructura visual resumida

```txt
[ HERO ]
Título potente
Subtítulo corto
CTA

[ 4 TARJETAS ]
Automatización
IA
Procesos
Herramientas

[ FORMULARIO ]
Cuestionario breve
Datos de contacto
Botón enviar

[ FOOTER ]
Axentia
Email
WhatsApp
```

---

# Footer

Simple y limpio.

```txt
Axentia
Consultoría Tecnológica y Energética

axentia.consultinng@gmail.com
WhatsApp: +34 XXX XXX XXX

© 2026 Axentia. Todos los derechos reservados.
```

---

# Prioridades del desarrollo

## Alta prioridad

- Landing rápida.
- Formulario funcional.
- Envío de emails.
- Responsive perfecto.
- Carga menor a 2 segundos.

## Media prioridad

- Animaciones.
- Validación avanzada.
- Integración con CRM.

## Baja prioridad

- Blog.
- Área privada.
- Panel de administración.

---

# Resultado esperado

Una landing que transmita:

- **Profesionalismo**
- **Confianza**
- **Innovación**
- **Simplicidad**
- **Acción inmediata**

El usuario debe poder entrar, entender el servicio en **menos de 10 segundos** y completar la solicitud de auditoría gratuita en **menos de 2 minutos**.