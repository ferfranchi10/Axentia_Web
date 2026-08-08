"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function BookingModal() {
  const { isOpen, closeModal } = useModal();

  // Focus trap and Escape-to-close
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = document.getElementById("booking-modal-container");
    const focusableElements = modalElement?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    const firstElement = focusableElements?.[0] as HTMLElement | undefined;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement | undefined;

    const timer = setTimeout(() => firstElement?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm"
          />

          <motion.div
            id="booking-modal-container"
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-navy/10 bg-white p-4 sm:p-6 shadow-2xl z-10 my-8"
          >
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Consultoría Estratégica
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1 text-navy">
                  Agendar Reunión Gratuita
                </h3>
              </div>
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="p-1.5 rounded-full border border-navy/10 hover:border-navy/20 bg-white text-navy/60 hover:text-navy transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full rounded-xl overflow-hidden border border-navy/10 bg-white" style={{ height: "600px" }}>
              <iframe
                src="https://calendly.com/axentia-consulting/reunion-de-estrategia-axentia?embed_domain=localhost&embed_type=Inline&background_color=ffffff&text_color=0b1f33&primary_color=4da8ff&hide_landing_page_details=1"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Agendar una reunión con Axentia"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
