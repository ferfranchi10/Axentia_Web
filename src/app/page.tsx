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
import FloatingChatWidget from "@/components/ui/FloatingChatWidget";

export default function Home() {
  return (
    <>
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

      {/* Floating Chat + WhatsApp Widget */}
      <FloatingChatWidget />
    </>
  );
}
