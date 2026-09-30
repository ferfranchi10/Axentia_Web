// Datos compartidos de SEO: URL del sitio y datos estructurados (JSON-LD).
export const SITE_URL = "https://axentia-web.vercel.app";

export const SITE_TITLE = "AXENTIA | Consultoría Tecnológica para Empresas";
export const SITE_DESCRIPTION =
  "Consultoría tecnológica y energética remota para empresas de cualquier país, desde Tarragona. Auditoría gratuita para optimizar procesos, automatizar tareas e integrar soluciones tecnológicas e IA en tu empresa.";

// Schema.org: WebSite. Google lo usa para mostrar el nombre del sitio ("AXENTIA")
// encima de la URL en los resultados de búsqueda.
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AXENTIA",
  alternateName: ["Axentia Consulting", "Axentia"],
  url: `${SITE_URL}/`,
};

// Schema.org: ProfessionalService con sede en Tarragona y servicio remoto a cualquier país.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AXENTIA",
  alternateName: "Axentia Consulting",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/axentia-icon.png`,
  image: `${SITE_URL}/opengraph-image.png`,
  description: SITE_DESCRIPTION,
  email: "axentia.consulting@gmail.com",
  telephone: "+34722406500",
  founder: { "@type": "Person", name: "Fernando Franchi" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tarragona",
    postalCode: "43005",
    addressRegion: "Cataluña",
    addressCountry: "ES",
  },
  areaServed: "Worldwide",
  availableLanguage: ["es"],
  knowsAbout: [
    "Consultoría tecnológica",
    "Consultoría energética",
    "Automatización de procesos",
    "Inteligencia artificial para empresas",
  ],
};
