import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import CookieConsent from "@/components/ui/CookieConsent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://axentia-web.vercel.app"),
  title: "AXENTIA | Consultoría Tecnológica y Energética",
  description: "Auditoría gratuita para optimizar procesos, automatizar tareas e integrar soluciones tecnológicas e IA en tu empresa.",
  keywords: [
    "Axentia",
    "Consultoría Tecnológica",
    "Consultoría Energética",
    "Automatización de procesos",
    "Inteligencia Artificial empresas",
    "Auditoría gratuita",
    "Integración de sistemas",
  ],
  authors: [{ name: "Axentia Consulting" }],
  openGraph: {
    title: "AXENTIA | Consultoría Tecnológica y Energética",
    description: "Auditoría gratuita para optimizar procesos, automatizar tareas e integrar soluciones tecnológicas e IA en tu empresa.",
    url: "https://axentia-web.vercel.app",
    siteName: "AXENTIA",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "AXENTIA | Consultoría Tecnológica y Energética",
    description: "Auditoría gratuita para optimizar procesos, automatizar tareas e integrar soluciones tecnológicas e IA en tu empresa.",
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-foreground flex flex-col relative font-sans" suppressHydrationWarning>
        <Script id="silence-extension-hydration-warnings" strategy="beforeInteractive">
          {`
            (function() {
              const originalError = console.error;
              console.error = function(...args) {
                const message = args[0];
                if (typeof message === 'string' && (
                  message.includes('hydration') ||
                  message.includes('Hydration') ||
                  message.includes('bis_skin_checked') ||
                  message.includes('bis_register')
                )) {
                  return;
                }
                originalError.apply(console, args);
              };
            })();
          `}
        </Script>
        <div className="flex-1 flex flex-col relative z-10">
          <ModalProvider>
            {children}
          </ModalProvider>
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
