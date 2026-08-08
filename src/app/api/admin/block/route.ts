import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { JWT } from "google-auth-library";
import { verifyToken } from "@/lib/auth";

const CALENDAR_ID = "axentia.consulting@gmail.com";
const ADMIN_BLOCK_TITLE = "Bloqueado por Admin (Axentia)";

async function getAccessToken(): Promise<string> {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY no está configurado.");

  const credentials = JSON.parse(serviceAccountKey);
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    // Full calendar scope needed for creating/deleting events
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const tokenResponse = await auth.getAccessToken();
  if (!tokenResponse.token) throw new Error("No se pudo obtener el token de acceso de Google.");
  return tokenResponse.token;
}

export async function POST(request: Request) {
  // Verify admin session from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("axentia-admin-session")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || !payload.admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  interface BlockRequestBody {
    action?: "block" | "unblock";
    date?: string;
    startTime?: string;
    eventId?: string;
  }

  let body: BlockRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const { action, date, startTime, eventId } = body;

  try {
    const accessToken = await getAccessToken();

    // ── BLOCK: Create a "Bloqueado por Admin" event ─────────────────────────
    if (action === "block") {
      if (!date || !startTime) {
        return NextResponse.json({ error: "Faltan campos: date y startTime." }, { status: 400 });
      }

      const [hour, minute] = (startTime as string).split(":").map(Number);
      const startDate = new Date(date);
      startDate.setHours(hour, minute, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1); // 1-hour block

      const event = {
        summary: ADMIN_BLOCK_TITLE,
        description:
          "Horario bloqueado manualmente desde el panel de administración de Axentia. Los clientes no pueden reservar este horario.",
        start: { dateTime: startDate.toISOString(), timeZone: "Europe/Madrid" },
        end: { dateTime: endDate.toISOString(), timeZone: "Europe/Madrid" },
        transparency: "opaque",
        status: "confirmed",
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google Calendar create event error: ${response.status} - ${errText}`);
      }

      const createdEvent = await response.json();
      return NextResponse.json({ success: true, eventId: createdEvent.id });
    }

    // ── UNBLOCK: Delete the admin-created blocking event ────────────────────
    if (action === "unblock") {
      if (!eventId) {
        return NextResponse.json({ error: "Falta el campo: eventId." }, { status: 400 });
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${eventId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // 204 = deleted successfully, 404 = already gone — both are OK
      if (!response.ok && response.status !== 204 && response.status !== 404) {
        throw new Error(`Google Calendar delete event error: ${response.status}`);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida. Usa 'block' o 'unblock'." }, { status: 400 });
  } catch (error: unknown) {
    console.error("Admin block API error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
