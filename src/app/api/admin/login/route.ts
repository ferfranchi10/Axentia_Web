import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not configured.");
      return NextResponse.json(
        { error: "Panel de administración no configurado. Añade ADMIN_PASSWORD al archivo .env.local." },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const token = signToken({ admin: true, exp: expirationTime });

      const response = NextResponse.json({ success: true });
      response.cookies.set("axentia-admin-session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { error: "Contraseña incorrecta. Inténtalo de nuevo." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
}
