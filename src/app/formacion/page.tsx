import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/ui/BookingModal";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Formación en Inteligencia Artificial para empresas | AXENTIA";
const DESCRIPTION =
  "Cursos de IA a medida para tu equipo, 100% prácticos y aplicables al trabajo diario. Financiables con el crédito de formación de tu empresa. Auditoría gratuita de 30 minutos.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/formacion" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/formacion`,
    siteName: "AXENTIA",
    type: "website",
    locale: "es_ES",
  },
};

const STEPS = [
  {
    title: "Auditoría gratuita de 30 minutos",
    text: "Analizamos cómo trabaja tu equipo y dónde la IA puede ahorrarle más tiempo.",
  },
  {
    title: "Curso a medida",
    text: "Preparamos una formación totalmente práctica y 100 % aplicable, con tus procesos y tus herramientas.",
  },
  {
    title: "Papeleo con la Fundae",
    text: "Gestionamos los trámites para que financies la formación con el crédito que tu empresa ya tiene.",
  },
];

const BENEFITS = [
  "Tu equipo aprende a usar la IA en su trabajo diario.",
  "Automatizamos procesos de tu empresa sin cambiar tus programas actuales.",
  "No cambiamos tus herramientas: las hacemos trabajar mejor.",
  "Se financia con el crédito de formación, que caduca a final de año.",
];

export default function FormacionPage() {
  const url = `${SITE_URL}/formacion`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Formación en Inteligencia Artificial para empresas",
    description: DESCRIPTION,
    url,
    areaServed: "ES",
    provider: { "@type": "ProfessionalService", name: "AXENTIA", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Formación en IA", item: url },
    ],
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Header />

      <main className="pt-32 pb-20 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Ruta" className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-navy">Inicio</Link>
            {" / "}
            <span className="text-navy">Formación en IA</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy leading-tight">
            Formación en Inteligencia Artificial para empresas
          </h1>
          <p className="mt-5 text-lg text-text-muted leading-relaxed">
            Formamos a ti y a tus empleados para que uséis la IA en el trabajo diario, y lo
            financias con el crédito de formación que tu empresa ya tiene.
          </p>

          <Link
            href="/#formulario"
            className="mt-8 inline-flex items-center gap-1.5 font-bold bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/30"
          >
            Quiero la asesoría gratuita
            <ArrowRight className="w-4 h-4" />
          </Link>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold text-navy">¿Qué hacemos?</h2>
            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="soft-card rounded-2xl p-6 flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary-dark font-extrabold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-navy">{s.title}</h3>
                    <p className="mt-1 text-text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-navy">Qué te llevas</h2>
            <ul className="mt-4 space-y-3">
              {BENEFITS.map((item) => (
                <li key={item} className="flex gap-3 text-navy/80">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 soft-card rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-extrabold text-navy">Tu crédito de formación caduca a final de año</h2>
            <p className="text-text-muted">
              Agenda ahora una reunión y preparamos tu curso para hacerlo ya.
            </p>
            <Link
              href="/#formulario"
              className="inline-flex items-center gap-1.5 font-bold bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/30"
            >
              Solicitar asesoría gratuita de 30 minutos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
      <BookingModal />
    </>
  );
}
