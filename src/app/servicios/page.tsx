import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/ui/BookingModal";
import JsonLd from "@/components/seo/JsonLd";
import { SERVICES } from "@/lib/servicesCatalog";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Servicios de consultoría tecnológica e IA | AXENTIA";
const DESCRIPTION =
  "Diagnóstico estratégico, auditoría de IA, automatizaciones, asistentes inteligentes, agentes IA personalizados y dirección tecnológica externa para empresas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/servicios`,
    siteName: "AXENTIA",
    type: "website",
    locale: "es_ES",
  },
};

export default function ServiciosPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <Header />

      <main className="pt-32 pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy leading-tight">
            Servicios de consultoría tecnológica e IA
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-text-muted leading-relaxed">
            Ayudamos a las empresas a optimizar procesos, automatizar tareas e integrar soluciones
            tecnológicas y de inteligencia artificial.
          </p>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicios/${s.slug}`}
                  className="soft-card rounded-2xl p-6 h-full flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-lg font-bold text-navy">{s.name}</h2>
                  <p className="text-sm text-text-muted">{s.metaDescription}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-primary">
                    Ver servicio <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
      <BookingModal />
    </>
  );
}
