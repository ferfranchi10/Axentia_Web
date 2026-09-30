// Catálogo de servicios para las páginas /servicios/[slug].
// BORRADOR: descripciones generales deducidas del nombre de cada servicio.
// No incluye precios, plazos ni resultados prometidos. Revisar y completar
// con el detalle real de cada servicio antes de darlo por definitivo.

export type ServicePage = {
  slug: string;
  name: string;
  /** <title> de la página (máx. ~60 caracteres). */
  metaTitle: string;
  /** Meta description (máx. ~155 caracteres). */
  metaDescription: string;
  h1: string;
  intro: string;
  /** Situaciones en las que tiene sentido el servicio. */
  forWhom: string[];
  /** Qué puede incluir el servicio. */
  includes: string[];
};

export const SERVICES: ServicePage[] = [
  {
    slug: "diagnostico-estrategico",
    name: "Diagnóstico Estratégico",
    metaTitle: "Diagnóstico estratégico tecnológico para empresas | AXENTIA",
    metaDescription:
      "Analizamos cómo trabaja tu empresa y detectamos dónde la tecnología y la IA pueden ahorrar tiempo y costes. Empieza con una auditoría gratuita.",
    h1: "Diagnóstico estratégico tecnológico para tu empresa",
    intro:
      "Antes de invertir en herramientas, conviene saber dónde está el problema real. El diagnóstico estratégico revisa cómo funciona tu empresa hoy y define qué mejoras tecnológicas merecen la pena y en qué orden.",
    forWhom: [
      "Empresas que quieren incorporar tecnología o IA pero no saben por dónde empezar.",
      "Negocios con procesos manuales, herramientas dispersas o información duplicada.",
      "Equipos directivos que necesitan una visión clara antes de decidir una inversión.",
    ],
    includes: [
      "Revisión de procesos, herramientas y flujos de trabajo actuales.",
      "Detección de cuellos de botella y tareas repetitivas.",
      "Priorización de oportunidades según esfuerzo e impacto.",
      "Hoja de ruta con los siguientes pasos recomendados.",
    ],
  },
  {
    slug: "auditoria-ia",
    name: "Auditoría IA",
    metaTitle: "Auditoría de IA para empresas | AXENTIA",
    metaDescription:
      "Descubre en qué procesos de tu empresa la inteligencia artificial puede aportar valor y cuáles no. Auditoría de IA gratuita para empezar.",
    h1: "Auditoría de inteligencia artificial para empresas",
    intro:
      "No todos los procesos se benefician de la IA. La auditoría identifica dónde tiene sentido aplicarla en tu empresa, qué datos y herramientas hacen falta y qué puede esperarse de ella de forma realista.",
    forWhom: [
      "Empresas que se plantean usar IA y quieren evitar inversiones sin retorno.",
      "Negocios que ya prueban herramientas de IA sin un criterio común.",
      "Responsables que necesitan argumentos claros para decidir.",
    ],
    includes: [
      "Mapa de procesos donde la IA puede aportar valor.",
      "Revisión de los datos y herramientas disponibles.",
      "Identificación de riesgos, límites y cuestiones de privacidad.",
      "Recomendaciones ordenadas por prioridad.",
    ],
  },
  {
    slug: "implantacion-de-automatizaciones",
    name: "Implantación de Automatizaciones",
    metaTitle: "Automatización de procesos para empresas | AXENTIA",
    metaDescription:
      "Automatizamos las tareas repetitivas de tu empresa para que tu equipo dedique su tiempo a lo que importa. Pide tu auditoría gratuita.",
    h1: "Implantación de automatizaciones en tu empresa",
    intro:
      "Muchas tareas del día a día se repiten una y otra vez y pueden hacerse solas. Diseñamos e implantamos automatizaciones conectadas a las herramientas que tu empresa ya utiliza.",
    forWhom: [
      "Equipos que pierden tiempo copiando datos entre herramientas.",
      "Empresas con procesos repetitivos de administración, ventas o atención al cliente.",
      "Negocios que quieren reducir errores manuales.",
    ],
    includes: [
      "Análisis del proceso a automatizar y de las herramientas implicadas.",
      "Diseño e implantación de la automatización.",
      "Pruebas antes de ponerla en marcha.",
      "Documentación y formación para el equipo.",
    ],
  },
  {
    slug: "asistente-inteligente-empresarial",
    name: "Asistente Inteligente Empresarial",
    metaTitle: "Asistente inteligente con IA para empresas | AXENTIA",
    metaDescription:
      "Un asistente de IA entrenado con la información de tu empresa para atender consultas, apoyar a tu equipo y captar contactos. Pide una auditoría gratuita.",
    h1: "Asistente inteligente con IA para tu empresa",
    intro:
      "Un asistente inteligente responde preguntas a partir de la información propia de tu empresa, puede atender a clientes o apoyar a tu equipo y, si se desea, derivar a una persona cuando hace falta.",
    forWhom: [
      "Empresas que reciben muchas consultas repetitivas.",
      "Equipos que necesitan acceder rápido a documentación interna.",
      "Negocios que quieren atender a clientes fuera de horario.",
    ],
    includes: [
      "Definición del alcance y del tono del asistente.",
      "Carga y organización de la información de la empresa.",
      "Integración en tu web o en las herramientas del equipo.",
      "Captura de contactos y derivación a una persona cuando proceda.",
    ],
  },
  {
    slug: "direccion-tecnologica-externa",
    name: "Dirección Tecnológica Externa",
    metaTitle: "Dirección tecnológica externa (CTO externo) | AXENTIA",
    metaDescription:
      "Acompañamiento tecnológico continuo para empresas sin director técnico: decisiones, proveedores y prioridades con criterio. Empieza con una llamada.",
    h1: "Dirección tecnológica externa para tu empresa",
    intro:
      "No todas las empresas necesitan un director técnico a tiempo completo, pero sí alguien con criterio para decidir. La dirección tecnológica externa aporta ese acompañamiento de forma continuada.",
    forWhom: [
      "Pymes sin responsable de tecnología interno.",
      "Empresas que dependen de varios proveedores y necesitan coordinarlos.",
      "Negocios en crecimiento que deben ordenar su tecnología.",
    ],
    includes: [
      "Definición y seguimiento de prioridades tecnológicas.",
      "Apoyo en la elección y evaluación de herramientas y proveedores.",
      "Coordinación de proyectos tecnológicos.",
      "Reuniones periódicas con la dirección.",
    ],
  },
  {
    slug: "agentes-ia-personalizados",
    name: "Creación y entrenamiento de agentes IA personalizados",
    metaTitle: "Agentes de IA personalizados para empresas | AXENTIA",
    metaDescription:
      "Creamos y entrenamos agentes de IA adaptados a los procesos y a la información de tu empresa. Empieza con una auditoría gratuita.",
    h1: "Creación y entrenamiento de agentes IA personalizados",
    intro:
      "Un agente de IA puede encargarse de tareas concretas dentro de tu empresa. Lo diseñamos para un caso de uso definido y lo entrenamos con la información y las reglas propias de tu negocio.",
    forWhom: [
      "Empresas con una tarea concreta que quieren delegar a una IA.",
      "Negocios que necesitan algo más específico que una herramienta genérica.",
      "Equipos que quieren integrar la IA en sus procesos actuales.",
    ],
    includes: [
      "Definición del caso de uso y de los límites del agente.",
      "Diseño y entrenamiento con la información de la empresa.",
      "Pruebas y ajuste del comportamiento.",
      "Puesta en marcha y seguimiento.",
    ],
  },
];

export function getService(slug: string): ServicePage | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
