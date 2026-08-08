import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Axentia | Consultoría Tecnológica Inteligente - Traje Tecnológico a Medida",
  description: "No vendemos software genérico. Diseñamos, automatizamos e implementamos el traje tecnológico perfecto para tu negocio. Auditoría, IA y CRM a medida.",
  keywords: [
    "Axentia",
    "Consultoría Tecnológica",
    "Desarrollo a medida",
    "Automatización de procesos",
    "Inteligencia Artificial empresas",
    "CRM personalizado Spain",
    "Automatizaciones inteligentes",
    "Soluciones tecnológicas para empresas"
  ],
  authors: [{ name: "Axentia Consulting" }],
  openGraph: {
    title: "Axentia | Consultoría Tecnológica Inteligente",
    description: "Diseñamos e implementamos el traje tecnológico perfecto para tu negocio. Descubre ineficiencias y automatiza tus procesos.",
    type: "website",
    locale: "es_ES",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="silence-hydration-warnings"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const originalError = console.error;
                  console.error = function(...args) {
                    const message = args[0];
                    if (typeof message === 'string' && (
                      message.includes('hydration') ||
                      message.includes('Hydration') ||
                      message.includes('did not match') ||
                      message.includes('bis_skin_checked')
                    )) {
                      return;
                    }
                    originalError.apply(console, args);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full bg-bg-darker text-foreground flex flex-col relative"
        suppressHydrationWarning
      >
        {/* Global Ambient Glow Highlights */}
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-accent-blue/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[-20%] w-[50%] h-[60%] bg-accent-violet/5 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[45%] bg-accent-cyan/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="flex-1 flex flex-col relative z-10">
          <ModalProvider>
            {children}
          </ModalProvider>
        </div>
      </body>
    </html>
  );
}
