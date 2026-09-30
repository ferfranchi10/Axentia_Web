import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/ui/BookingModal";
import JsonLd from "@/components/seo/JsonLd";
import { SERVICES, getService } from "@/lib/servicesCatalog";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const path = `/servicios/${service.slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${SITE_URL}${path}`,
      siteName: "AXENTIA",
      type: "website",
      locale: "es_ES",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const url = `${SITE_URL}/servicios/${service.slug}`;
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url,
    areaServed: "Worldwide",
    provider: { "@type": "ProfessionalService", name: "AXENTIA", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
      { "@type": "ListItem", position: 3, name: service.name, item: url },
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
            <Link href="/servicios" className="hover:text-navy">Servicios</Link>
            {" / "}
            <span className="text-navy">{service.name}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy leading-tight">
            {service.h1}
          </h1>
          <p className="mt-5 text-lg text-text-muted leading-relaxed">{service.intro}</p>

          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-navy">¿Para quién es?</h2>
            <ul className="mt-4 space-y-3">
              {service.forWhom.map((item) => (
                <li key={item} className="flex gap-3 text-navy/80">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-navy">Qué puede incluir</h2>
            <ul className="mt-4 space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-navy/80">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 soft-card rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-extrabold text-navy">Empieza con una auditoría gratuita</h2>
            <p className="text-text-muted">
              Cuéntanos cómo trabaja tu empresa y te indicamos por dónde empezar.
            </p>
            <Link
              href="/#formulario"
              className="inline-flex items-center gap-1.5 font-bold bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/30"
            >
              Solicitar auditoría gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section className="mt-14">
            <h2 className="text-xl font-extrabold text-navy">Otros servicios</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/servicios/${s.slug}`}
                    className="text-navy/80 hover:text-primary underline-offset-4 hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
      <BookingModal />
    </>
  );
}
