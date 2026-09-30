import { organizationJsonLd } from "@/lib/seo";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sections
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import QuienesSomos from "@/components/sections/QuienesSomos";
import AuditForm from "@/components/sections/AuditForm";

// UI
import BookingModal from "@/components/ui/BookingModal";

export default function Home() {
  return (
    <>
      {/* Datos estructurados para Google (sede en Tarragona, servicio a cualquier país) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />

      <main>
        <Hero />
        <Services />
        <QuienesSomos />
        <AuditForm />
      </main>

      <Footer />

      {/* Global Modal */}
      <BookingModal />

      {/*
        Asistente de IA de Axentia (proyecto aparte: Axentia_AI_Assistant en Vercel).
        Widget embebible: chat con IA + base de conocimiento (RAG) + captura de leads
        + derivación a una persona. Reemplaza al antiguo FloatingChatWidget de
        respuestas predefinidas.
      */}
      <script
        src="https://axentia-ai-assistant.vercel.app/widget/widget.js"
        data-assistant="cmtlystnn0001rkhlairq7ye0"
        async
      />
    </>
  );
}
