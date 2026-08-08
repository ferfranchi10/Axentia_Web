"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function Header() {
  const { openModal } = useModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Por qué Axentia", href: "#problema" },
    { label: "El Traje a Medida", href: "#solucion" },
    { label: "Servicios", href: "#servicios" },
    { label: "Casos de Éxito", href: "#casos" },
    { label: "Metodología", href: "#metodologia" },
    { label: "Autodiagnóstico", href: "#autodiagnostico" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-bg-darker/70 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-violet flex items-center justify-center p-[1px] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-xl bg-bg-darker flex items-center justify-center font-bold text-white text-lg tracking-tighter">
                A
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1 group-hover:text-accent-cyan transition-colors">
              Axentia
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-slate-300 hover:text-white transition-colors duration-200 uppercase tracking-wider relative group"
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-accent-cyan group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTAs Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => openModal("audit")}
              className="text-xs font-bold bg-gradient-to-r from-accent-cyan to-accent-blue text-white py-2 px-4 rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-cyan/15 group"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auditoría Gratuita
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-white/5 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-bg-darker flex flex-col pt-24 px-6 border-b border-white/15">
          <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-accent-violet/10 blur-[50px] rounded-full" />
          
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-4">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openModal("audit");
              }}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3.5 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-cyan/15"
            >
              <Sparkles className="w-4 h-4" />
              Auditoría Gratuita
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
