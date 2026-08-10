"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Cookie } from "lucide-react";

const GA_MEASUREMENT_ID = "G-78XTRLCS66";
const CONSENT_KEY = "axentia-cookie-consent";

type Consent = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }
    setHydrated(true);
  }, []);

  const handleChoice = (choice: "accepted" | "rejected") => {
    window.localStorage.setItem(CONSENT_KEY, choice);
    setConsent(choice);
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {hydrated && consent === null && (
        <div className="fixed bottom-6 left-6 z-50 w-[calc(100%-3rem)] max-w-sm">
          <div className="bg-white border border-navy/10 rounded-2xl shadow-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <p className="text-sm text-navy/80 leading-relaxed">
                Usamos cookies propias y de análisis (Google Analytics) para entender cómo se usa el sitio y mejorarlo. Podés aceptarlas o rechazarlas.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleChoice("rejected")}
                className="text-xs font-semibold text-navy/70 hover:text-navy border border-navy/15 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                Rechazar
              </button>
              <button
                onClick={() => handleChoice("accepted")}
                className="text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
