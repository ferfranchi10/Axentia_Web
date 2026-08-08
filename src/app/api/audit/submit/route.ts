import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "axentia.consulting@gmail.com";

// Dictionary for readable values
const GOAL_LABELS: Record<string, string> = {
  save_time: "Ahorrar tiempo y automatizar tareas manuales",
  increase_sales: "Aumentar ventas y mejorar seguimiento de clientes",
  team_coordination: "Mejorar la coordinación del equipo y flujos de información",
  modernize_systems: "Modernizar sistemas antiguos y escalar tecnología",
};

const BOTTLENECK_LABELS: Record<string, string> = {
  manual_tasks: "Tareas manuales redundantes y pérdida de tiempo",
  data_silos: "Información dispersa en mil herramientas diferentes",
  lost_leads: "Falta de seguimiento a clientes / Pérdida de ventas",
  team_coordination: "Descoordinación de equipos y flujos",
  outdated_tech: "Sistemas antiguos que frenan el crecimiento",
  other: "Otros (especificado por el cliente)",
};

const TOOL_LABELS: Record<string, string> = {
  excel: "Excel / Google Sheets",
  crm: "CRM (Hubspot, Salesforce, etc.)",
  erp: "ERP / Software de Facturación",
  whatsapp: "WhatsApp manual",
  email_marketing: "Email Marketing",
  none: "Ninguna de las anteriores / Empezamos de cero",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      teamSize,
      phone,
      bottleneck,
      otherBottleneck,
      currentTools = [],
      manualProcess,
      toolsToConnect,
      mainGoal,
    } = body;

    // Basic validation
    if (!name || !email || !company) {
      return NextResponse.json({ error: "Faltan campos obligatorios: nombre, email o empresa." }, { status: 400 });
    }

    // Format human-readable lists
    const selectedTools = currentTools
      .map((t: string) => TOOL_LABELS[t] || t)
      .join(", ") || "Ninguna especificada";

    const bottleneckText = bottleneck === "other" 
      ? `Otro: "${otherBottleneck || "No especificado"}"`
      : (BOTTLENECK_LABELS[bottleneck] || bottleneck);

    const goalText = GOAL_LABELS[mainGoal] || mainGoal || "No especificado";

    // Build Email body for Admin Notification
    const adminEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #06b6d4; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          ¡Nueva Solicitud de Auditoría Tecnológica!
        </h2>
        <p>Se ha recibido una nueva solicitud detallada a través de la web:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; width: 40%;">Nombre del contacto:</td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Empresa:</td>
            <td style="padding: 10px;">${company}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Teléfono / WhatsApp:</td>
            <td style="padding: 10px;">${phone || "No proporcionado"}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold;">Tamaño del equipo:</td>
            <td style="padding: 10px;">${teamSize} empleados</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Objetivo principal:</td>
            <td style="padding: 10px;">${goalText}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold;">Mayor cuello de botella:</td>
            <td style="padding: 10px; font-weight: #475569;">${bottleneckText}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Herramientas actuales:</td>
            <td style="padding: 10px;">${selectedTools}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; background-color: #f1f5f9; padding: 15px; rounded: 8px;">
          <h4 style="margin-top: 0; color: #0f172a;">¿Qué proceso manual le quita más tiempo?</h4>
          <p style="white-space: pre-wrap; font-style: italic; color: #334155; margin-bottom: 15px;">
            ${manualProcess || "No especificado"}
          </p>
          
          <h4 style="color: #0f172a; margin-top: 0;">¿Qué integraciones o automatizaciones le gustaría priorizar?</h4>
          <p style="white-space: pre-wrap; font-style: italic; color: #334155; margin-bottom: 0;">
            ${toolsToConnect || "No especificado"}
          </p>
        </div>
      </div>
    `;

    // Build Email body for Customer Confirmation
    const customerEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
        <div style="background: linear-gradient(135deg, #06b6d4, #6366f1); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.025em;">
            ¡Hola, ${name}!
          </h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">
            Recibimos tu solicitud para transformar la tecnología de <strong>${company}</strong> 🚀
          </p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; font-weight: 500; color: #0f172a; margin-top: 0;">
            ¡Es un placer saludarte! Qué alegría que hayas dado este paso.
          </p>
          
          <p>
            En <strong>Axentia</strong> no creemos en soluciones genéricas ni plantillas prefabricadas. Por eso, nuestro equipo de ingenieros ya está analizando detalladamente los cuellos de botella que nos has compartido. 
          </p>
          
          <p>
            Queremos diseñar el <strong>&quot;traje tecnológico a medida&quot;</strong> perfecto para tu negocio, enfocado en liberar a tu equipo de tareas manuales repetitivas y potenciar vuestra eficiencia al máximo.
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <h4 style="margin: 0 0 5px 0; color: #0f172a; font-size: 14px;">¿Cuáles son los siguientes pasos?</h4>
            <ol style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #475569; line-height: 1.8;">
              <li><strong>Diagnóstico Técnico:</strong> Evaluamos la viabilidad de integraciones para automatizar tus procesos.</li>
              <li><strong>Sesión Estratégica:</strong> Nos pondremos en contacto contigo (vía WhatsApp o email) para agendar una videollamada corta, repasar el diagnóstico y entregarte el borrador de tu plan tecnológico sin ningún coste.</li>
            </ol>
          </div>

          <p style="font-size: 16px; font-weight: bold; color: #6366f1; text-align: center; margin: 30px 0;">
            ¡Tenemos muchísimas ganas de ponernos en marcha. Juntos haremos grandes cosas! 🤝✨
          </p>
          
          <p style="margin-bottom: 0;">
            Un abrazo,<br />
            <strong>El Comité Tecnológico de Axentia</strong>
          </p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Axentia Consulting · Soluciones Tecnológicas y Automatización a Medida<br />
          <a href="mailto:axentia.consulting@gmail.com" style="color: #06b6d4; text-decoration: none;">axentia.consulting@gmail.com</a>
        </div>
      </div>
    `;

    // Configure Mailer Transport
    const smtpUser = process.env.SMTP_USER || ADMIN_EMAIL;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpPass) {
      console.warn("=========================================================");
      console.warn("ADVERTENCIA DE CONFIGURACIÓN DE SMTP (AXENTIA)");
      console.warn("SMTP_PASS no está definido en el archivo .env.local.");
      console.warn("Los correos electrónicos se han registrado en el log pero NO se enviaron.");
      console.warn("=========================================================");
      console.log(`[Notification to Admin]:\nFrom: ${smtpUser}\nTo: ${ADMIN_EMAIL}\nSubject: Nueva Auditoría Tecnológica – ${company}\nBody:\n${adminEmailHtml}`);
      console.log(`[Confirmation to Customer]:\nFrom: ${ADMIN_EMAIL}\nTo: ${email}\nSubject: ¡Empezamos el viaje! Recibimos tu solicitud de Auditoría en Axentia\nBody:\n${customerEmailHtml}`);
      
      return NextResponse.json({ 
        success: true, 
        warning: "SMTP_PASS no configurado en servidor. El envío real de correos se omitió." 
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_PORT !== "587", // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. Send notification to admin
    await transporter.sendMail({
      from: `Axentia Web Form <${smtpUser}>`,
      to: ADMIN_EMAIL,
      subject: `Nueva Auditoría Tecnológica: ${company} (por ${name})`,
      html: adminEmailHtml,
    });

    // 2. Send confirmation to the customer
    await transporter.sendMail({
      from: `Axentia Consulting <${smtpUser}>`,
      to: email,
      subject: `¡Empezamos el viaje! Recibimos tu solicitud de Auditoría en Axentia 🚀`,
      html: customerEmailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error submitting audit form:", error);
    return NextResponse.json(
      { error: "Error interno al enviar la solicitud.", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
