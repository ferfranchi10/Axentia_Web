// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sections
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import AxentiaSolution from "@/components/sections/AxentiaSolution";
import Services from "@/components/sections/Services";
import Differentiation from "@/components/sections/Differentiation";
import UseCases from "@/components/sections/UseCases";
import Methodology from "@/components/sections/Methodology";
import Testimonials from "@/components/sections/Testimonials";
import GrowthAuditTool from "@/components/sections/GrowthAuditTool";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

// UI
import BookingModal from "@/components/ui/BookingModal";
import FloatingChatWidget from "@/components/ui/FloatingChatWidget";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Problem />
        <AxentiaSolution />
        <Services />
        <Differentiation />
        <UseCases />
        <Methodology />
        <Testimonials />
        <GrowthAuditTool />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />

      {/* Global Modals */}
      <BookingModal />

      {/* Floating AI Chat + WhatsApp Widget */}
      <FloatingChatWidget />
    </>
  );
}
