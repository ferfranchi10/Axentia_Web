// Motor de auditoría digital (sección 25 y Fase 7 del doc original).
// Reglas deterministas sobre UNA sola solicitud GET a la home del sitio del
// lead. Explícitamente prohibido: pentesting, bypass de protecciones,
// crawling de otras páginas, scraping de zonas privadas, ataques automatizados.
// Esto es una auditoría comercial (¿tiene reservas online? ¿WhatsApp? ¿HTTPS?),
// no una auditoría de seguridad.

const FETCH_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 700_000; // suficiente para el <head> y buena parte del <body>
const USER_AGENT = "AxentiaProspeccionBot/1.0 (+auditoria comercial no invasiva; contacto: axentia.consulting@gmail.com)";

export interface DigitalAuditResult {
  websiteExists: boolean;
  websiteQuality: number | null;
  mobileQuality: number | null;
  httpsEnabled: boolean | null;
  contactForm: boolean | null;
  onlineBooking: boolean | null;
  whatsapp: boolean | null;
  crmDetected: boolean | null;
  automationDetected: boolean | null;
  customerPortal: boolean | null;
  onlinePayments: boolean | null;
  socialPresence: boolean | null;
  technologyScore: number | null;
  auditStatus: "DETECTADO" | "NO_DETECTADO" | "PENDIENTE_DE_VALIDAR";
}

function emptyResult(status: DigitalAuditResult["auditStatus"]): DigitalAuditResult {
  return {
    websiteExists: false,
    websiteQuality: null,
    mobileQuality: null,
    httpsEnabled: null,
    contactForm: null,
    onlineBooking: null,
    whatsapp: null,
    crmDetected: null,
    automationDetected: null,
    customerPortal: null,
    onlinePayments: null,
    socialPresence: null,
    technologyScore: 0,
    auditStatus: status,
  };
}

async function fetchHomepage(url: string): Promise<{ html: string; finalUrlIsHttps: boolean } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });

    if (!response.ok || !response.body) return null;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;

    // Lee acotado: no queremos descargar sitios enteros, solo la home.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let html = "";
    let bytesRead = 0;
    while (bytesRead < MAX_BODY_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      html += decoder.decode(value, { stream: true });
    }
    await reader.cancel().catch(() => {});

    return { html, finalUrlIsHttps: response.url.startsWith("https://") };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function hasAny(html: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(html));
}

export async function performDigitalAudit(website: string | null | undefined): Promise<DigitalAuditResult> {
  if (!website) return emptyResult("NO_DETECTADO");

  let url: string;
  try {
    url = new URL(website.startsWith("http") ? website : `https://${website}`).toString();
  } catch {
    return emptyResult("NO_DETECTADO");
  }

  const fetched = await fetchHomepage(url);
  if (!fetched) return emptyResult("PENDIENTE_DE_VALIDAR");

  const { html, finalUrlIsHttps } = fetched;
  const lower = html.toLowerCase();

  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasForm = /<form[\s>]/i.test(html);
  const contactFormLikely =
    hasForm && hasAny(lower, [/type=["']email["']/, /type=["']tel["']/, /contact/, /contacto/]);

  const whatsapp = hasAny(lower, [/wa\.me\//, /api\.whatsapp\.com/, /whatsapp/]);
  const onlineBooking = hasAny(lower, [
    /calendly\.com/,
    /booksy/,
    /reserva\s*online/,
    /reservar\s*cita/,
    /cita\s*previa/,
    /book\s*now/,
    /agendar/,
  ]);
  const crmDetected = hasAny(lower, [/hubspot/, /salesforce/, /pipedrive/, /zoho/]);
  const automationDetected = hasAny(lower, [/zapier/, /make\.com/, /n8n/, /chatbot/, /intercom/]);
  const customerPortal = hasAny(lower, [/portal\s*de\s*client/, /área\s*privada/, /área\s*de\s*cliente/, /iniciar\s*sesión/, /login/]);
  const onlinePayments = hasAny(lower, [/stripe/, /paypal/, /redsys/, /pasarela\s*de\s*pago/]);
  const socialPresence = hasAny(lower, [/facebook\.com/, /instagram\.com/, /linkedin\.com/]);

  const websiteQuality = Math.round(((hasViewport ? 1 : 0) + (finalUrlIsHttps ? 1 : 0) + (hasForm ? 1 : 0)) * (100 / 3));
  const mobileQuality = hasViewport ? 80 : 30;

  // Puntaje de madurez tecnológica detectada (0-100): cuantas más señales
  // "modernas" se detectan, más alto. Alimenta digitalPresenceScore en el
  // scoring (Fase 8) — y, por lo tanto, de forma inversa, technologyNeedScore.
  const signals = [
    finalUrlIsHttps,
    hasViewport,
    contactFormLikely,
    whatsapp,
    onlineBooking,
    crmDetected,
    automationDetected,
    customerPortal,
    onlinePayments,
  ];
  const technologyScore = Math.round((signals.filter(Boolean).length / signals.length) * 100);

  return {
    websiteExists: true,
    websiteQuality,
    mobileQuality,
    httpsEnabled: finalUrlIsHttps,
    contactForm: contactFormLikely,
    onlineBooking,
    whatsapp,
    crmDetected,
    automationDetected,
    customerPortal,
    onlinePayments,
    socialPresence,
    technologyScore,
    auditStatus: "DETECTADO",
  };
}
