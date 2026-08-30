import type { DigitalAuditResult } from "./digitalAuditService";

// Convierte los resultados de la auditoría digital en oportunidades
// comerciales (sección 17 y Fase 7: "después convertir estos resultados en
// oportunidades"). Reglas deterministas simples, pensadas como hipótesis
// inicial ajustable con resultados comerciales reales — no es IA (eso es
// Fase 9, y se valida contra estas mismas reglas antes de guardarse).
export interface OpportunityInput {
  category: string;
  title: string;
  description: string;
  evidence: string;
  priority: "ALTA" | "MEDIA" | "BAJA";
  recommendedService: string;
  confidence: number;
  status: "INFERIDO"; // ver DATABASE.md: nunca "afirmar" algo que en realidad es una inferencia de reglas
}

export function generateOpportunities(audit: DigitalAuditResult): OpportunityInput[] {
  if (!audit.websiteExists) {
    return [
      {
        category: "WEB",
        title: "Presencia web básica",
        description: "No se detectó un sitio web accesible para este negocio.",
        evidence: "No hay web registrada, o no respondió a la solicitud.",
        priority: "ALTA",
        recommendedService: "Desarrollo de sitio web",
        confidence: 70,
        status: "INFERIDO",
      },
    ];
  }

  const opportunities: OpportunityInput[] = [];

  if (audit.httpsEnabled === false) {
    opportunities.push({
      category: "WEB",
      title: "Migrar el sitio a HTTPS",
      description: "El sitio no usa una conexión segura (HTTPS), lo que afecta confianza y SEO.",
      evidence: "La respuesta final del sitio no llegó por HTTPS.",
      priority: "ALTA",
      recommendedService: "Mejora de sitio web",
      confidence: 90,
      status: "INFERIDO",
    });
  }

  if (audit.onlineBooking === false) {
    opportunities.push({
      category: "RESERVAS",
      title: "Sistema de reservas online",
      description: "No se detectó ningún sistema de reservas o citas online en la web.",
      evidence: "No se encontraron patrones de reserva/cita online (Calendly, Booksy, formularios de cita).",
      priority: "ALTA",
      recommendedService: "Sistema de reservas online",
      confidence: 75,
      status: "INFERIDO",
    });
  }

  if (audit.crmDetected === false) {
    opportunities.push({
      category: "CRM",
      title: "Sistema CRM para gestión de clientes",
      description: "No se detectan señales de un CRM en uso para el seguimiento comercial.",
      evidence: "No se encontraron integraciones de CRM conocidas (HubSpot, Salesforce, Pipedrive, Zoho).",
      priority: "ALTA",
      recommendedService: "Implementación de CRM",
      confidence: 65,
      status: "INFERIDO",
    });
  }

  if (audit.automationDetected === false) {
    opportunities.push({
      category: "AUTOMATIZACIÓN",
      title: "Automatización de recordatorios y seguimiento",
      description: "No se detecta automatización de procesos (recordatorios, chatbots, flujos).",
      evidence: "No se encontraron integraciones de automatización conocidas.",
      priority: "MEDIA",
      recommendedService: "Automatización de procesos",
      confidence: 65,
      status: "INFERIDO",
    });
  }

  if (audit.contactForm === false) {
    opportunities.push({
      category: "FORMULARIOS",
      title: "Formulario de contacto",
      description: "La web no tiene un formulario de contacto claro para captar consultas.",
      evidence: "No se detectó un <form> con campos de contacto en la página principal.",
      priority: "MEDIA",
      recommendedService: "Optimización de formularios",
      confidence: 60,
      status: "INFERIDO",
    });
  }

  if (audit.whatsapp === false) {
    opportunities.push({
      category: "WEB",
      title: "Integración de WhatsApp",
      description: "No se detectó un botón o enlace de WhatsApp para contacto directo.",
      evidence: "No se encontraron enlaces de wa.me o WhatsApp Business en la página.",
      priority: "MEDIA",
      recommendedService: "Integración de WhatsApp Business",
      confidence: 60,
      status: "INFERIDO",
    });
  }

  if (audit.customerPortal === false) {
    opportunities.push({
      category: "WEB",
      title: "Portal de clientes",
      description: "No se detecta un área privada o portal para que los clientes hagan seguimiento.",
      evidence: "No se encontraron señales de login o área de cliente en la página principal.",
      priority: "BAJA",
      recommendedService: "Portal de clientes",
      confidence: 50,
      status: "INFERIDO",
    });
  }

  return opportunities;
}
