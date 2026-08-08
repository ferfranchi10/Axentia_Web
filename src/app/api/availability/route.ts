import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";

const CALENDAR_ID = "axentia.consulting@gmail.com";
export const ADMIN_BLOCK_TITLE = "Bloqueado por Admin (Axentia)";

export async function GET() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not defined. Returning empty busy list.");
    return NextResponse.json({ busy: [] });
  }

  try {
    const credentials = JSON.parse(serviceAccountKey);

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const now = new Date();
    const timeMin = now.toISOString();
    // Fetch next 14 days so admin panel has full week visibility
    const timeMax = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const tokenResponse = await auth.getAccessToken();
    const accessToken = tokenResponse.token;

    if (!accessToken) {
      throw new Error("Failed to retrieve Google OAuth access token.");
    }

    // Use Events API (not FreeBusy) so we get event IDs and titles
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`
    );
    url.searchParams.set("timeMin", timeMin);
    url.searchParams.set("timeMax", timeMax);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Calendar Events API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    interface GoogleCalendarEvent {
      id: string;
      status?: string;
      summary?: string;
      start?: {
        dateTime?: string;
        date?: string;
      };
      end?: {
        dateTime?: string;
        date?: string;
      };
    }

    const items: GoogleCalendarEvent[] = data.items || [];

    // Map events into a normalized busy slot list that includes id, summary and isAdminBlock flag
    const busy = items
      .filter(
        (item) =>
          item.status !== "cancelled" &&
          (item.start?.dateTime || item.start?.date)
      )
      .map((item) => ({
        id: item.id,
        summary: item.summary || "",
        start: (item.start?.dateTime || item.start?.date) as string,
        end: (item.end?.dateTime || item.end?.date) as string,
        isAdminBlock: item.summary === ADMIN_BLOCK_TITLE,
      }));

    return NextResponse.json({ busy });
  } catch (error: unknown) {
    console.error("Error fetching Google Calendar availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability", details: error instanceof Error ? error.message : "Error desconocido", busy: [] },
      { status: 500 }
    );
  }
}
