import Image from "next/image";

const WHATSAPP_NUMBER = "34722406500";
const CONTACT_EMAIL = "axentia.consulting@gmail.com";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-soft border-t border-navy/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Image src="/brand/axentia-icon.png" alt="AXENTIA" width={28} height={28} className="w-7 h-7" />
          <span className="text-lg font-bold tracking-tight text-navy">AXENTIA</span>
        </div>

        <p className="text-text-muted text-sm">Consultoría Tecnológica y Energética</p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy/80 hover:text-primary transition-colors">
            {CONTACT_EMAIL}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy/80 hover:text-primary transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <p className="text-text-muted text-xs pt-4">
          © {currentYear} AXENTIA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
