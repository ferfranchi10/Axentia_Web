import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import CookieConsent from "@/components/ui/CookieConsent";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Axentia",
    "Consultoría tecnológica",
    "Consultoría energética",
    "Automatización de procesos",
    "Inteligencia Artificial empresas",
    "Auditoría gratuita",
    "Integración de sistemas",
  ],
  authors: [{ name: "Axentia Consulting" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "AXENTIA",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
  },
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
