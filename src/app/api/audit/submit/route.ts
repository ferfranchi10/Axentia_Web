import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "axentia.consulting@gmail.com";
const SITE_URL = "https://axentia-web.vercel.app";
const LOGO_URL = `${SITE_URL}/brand/axentia-logo-email.png`;

const NEEDS_LABELS: Record<string, string> = {
  facturacion: "Facturación",
  gestion_administrativa: "Gestión administrativa",
  seguimiento_clientes: "Seguimiento de clientes",
  reportes_automaticos: "Reportes automáticos",
  integracion_sistemas: "Integración de sistemas",
  ia_automatizacion: "IA / automatización",
  otro: "Otro",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 3000;

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientType,
      companyName,
      sector,
      teamSize,
      needs = [],
      otherNeed,
      description,
      fullName,
      email,
      phone,
    } = body;

    const isParticular = clientType === "particular";

    // Basic required-field validation
    if (!fullName || !email || !phone || !description || (!isParticular && (!companyName || !sector))) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios. Revisá el formulario e intentá de nuevo." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "El email ingresado no es válido." }, { status: 400 });
    }

    if (!Array.isArray(needs)) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }

    // Sanitize + cap length on every field before it's interpolated into email HTML
    const safeClientTypeLabel = isParticular ? "Persona física" : "Empresa";
    const safeCompanyName = companyName ? escapeHtml(truncate(String(companyName), MAX_TEXT_LENGTH)) : "";
    const safeSector = sector ? escapeHtml(truncate(String(sector), MAX_TEXT_LENGTH)) : "";
    const safeTeamSize = escapeHtml(truncate(String(teamSize || "No especificado"), MAX_TEXT_LENGTH));
    const safeFullName = escapeHtml(truncate(String(fullName), MAX_TEXT_LENGTH));
    const safeEmail = escapeHtml(truncate(String(email), MAX_TEXT_LENGTH));
    const safePhone = escapeHtml(truncate(String(phone), MAX_TEXT_LENGTH));
    const safeDescription = escapeHtml(truncate(String(description), MAX_DESCRIPTION_LENGTH));
    const safeOtherNeed = otherNeed ? escapeHtml(truncate(String(otherNeed), MAX_TEXT_LENGTH)) : "";

    const safeSubjectName = isParticular ? safeFullName : safeCompanyName;

    const needsText =
      needs
        .filter((id: unknown): id is string => typeof id === "string")
        .map((id: string) => (id === "otro" && safeOtherNeed ? `Otro: ${safeOtherNeed}` : NEEDS_LABELS[id] || escapeHtml(id)))
        .join(", ") || "No especificadas";

    const identityRowsHtml = isParticular
      ? `
          <tr style="background-color: #f5f7fa;">
            <td style="padding: 10px; font-weight: bold; width: 40%;">Tipo de cliente:</td>
            <td style="padding: 10px;">${safeClientTypeLabel}</td>
          </tr>
          ${safeSector ? `
          <tr>
            <td style="padding: 10px; font-weight: bold;">Área de interés:</td>
            <td style="padding: 10px;">${safeSector}</td>
          </tr>` : ""}`
      : `
          <tr style="background-color: #f5f7fa;">
            <td style="padding: 10px; font-weight: bold; width: 40%;">Empresa:</td>
            <td style="padding: 10px;">${safeCompanyName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Sector:</td>
            <td style="padding: 10px;">${safeSector}</td>
          </tr>
          <tr style="background-color: #f5f7fa;">
            <td style="padding: 10px; font-weight: bold;">Empleados:</td>
            <td style="padding: 10px;">${safeTeamSize}</td>
          </tr>`;

    // Admin notification email
    const adminEmailHtml = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; color: #0b1f33; line-height: 1.6;">
        <img src="${LOGO_URL}" alt="AXENTIA" width="140" style="display: block; margin-bottom: 20px;" />
        <h2 style="color: #4da8ff; border-bottom: 2px solid #f5f7fa; padding-bottom: 10px;">
          Nueva solicitud de auditoría gratuita
        </h2>
        <p>Se recibió una nueva solicitud a través de la web de Axentia:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${identityRowsHtml}
          <tr>
            <td style="padding: 10px; font-weight: bold;">Necesidades seleccionadas:</td>
            <td style="padding: 10px;">${needsText}</td>
          </tr>
          <tr style="background-color: #f5f7fa;">
            <td style="padding: 10px; font-weight: bold;">Contacto:</td>
            <td style="padding: 10px;">${safeFullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr style="background-color: #f5f7fa;">
            <td style="padding: 10px; font-weight: bold;">Teléfono / WhatsApp:</td>
            <td style="padding: 10px;">${safePhone}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; background-color: #f5f7fa; padding: 15px; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #0b1f33;">Descripción del problema:</h4>
          <p style="white-space: pre-wrap; color: #334155; margin-bottom: 0;">${safeDescription}</p>
        </div>
      </div>
    `;

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; color: #0b1f33; line-height: 1.6; background-color: #ffffff; border: 1px solid #f5f7fa; border-radius: 16px; overflow: hidden;">
        <div style="background: #f5f7fa; padding: 30px; text-align: center;">
          <img src="${LOGO_URL}" alt="AXENTIA" width="180" style="display: block; margin: 0 auto;" />
        </div>
        <div style="padding: 30px;">
          <p>Hola ${safeFullName},</p>

          <p>Gracias por solicitar una auditoría gratuita con Axentia.</p>

          <p>
            Hemos recibido correctamente la información de tu empresa y nuestro equipo analizará tu caso
            para identificar posibles oportunidades de mejora, automatización o integración tecnológica.
          </p>

          <p>
            En los próximos días nos pondremos en contacto para explicarte los siguientes pasos y coordinar
            una primera reunión.
          </p>

          <p>Gracias por confiar en Axentia.</p>

          <p style="margin-bottom: 0;">
            <strong>Axentia</strong><br />
            Consultoría Tecnológica y Energética<br />
            <a href="mailto:${ADMIN_EMAIL}" style="color: #4da8ff; text-decoration: none;">${ADMIN_EMAIL}</a>
          </p>
        </div>
      </div>
    `;

    const smtpUser = process.env.SMTP_USER || ADMIN_EMAIL;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpPass) {
      console.warn("=========================================================");
      console.warn("ADVERTENCIA DE CONFIGURACIÓN DE SMTP (AXENTIA)");
      console.warn("SMTP_PASS no está definido en el archivo .env.local.");
      console.warn("Los correos electrónicos se han registrado en el log pero NO se enviaron.");
      console.warn("=========================================================");
      console.log(`[Notificación interna]\nPara: ${ADMIN_EMAIL}\nAsunto: Nueva solicitud de auditoría gratuita – ${safeSubjectName}\n${adminEmailHtml}`);
      console.log(`[Confirmación al cliente]\nPara: ${safeEmail}\nAsunto: Hemos recibido tu solicitud – Axentia\n${customerEmailHtml}`);

      return NextResponse.json({
        success: true,
        warning: "SMTP_PASS no configurado en el servidor. El envío real de correos se omitió.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_PORT !== "587",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. Internal notification
    await transporter.sendMail({
      from: `Axentia Web <${smtpUser}>`,
      to: ADMIN_EMAIL,
      subject: `Nueva solicitud de auditoría gratuita – ${safeSubjectName}`,
      html: adminEmailHtml,
    });

    // 2. Customer confirmation
    await transporter.sendMail({
      from: `Axentia <${smtpUser}>`,
      to: email,
      subject: "Hemos recibido tu solicitud – Axentia",
      html: customerEmailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error submitting audit form:", error);
    return NextResponse.json(
      { error: "Error interno al enviar la solicitud. Intentá de nuevo en unos minutos." },
      { status: 500 }
    );
  }
}
