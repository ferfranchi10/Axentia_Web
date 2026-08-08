"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, Calendar } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function Header() {
  const { openModal } = useModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "#servicios" },
    { label: "Auditoría gratuita", href: "#formulario" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-white/85 backdrop-blur-md border-b border-navy/5 shadow-sm"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Image
              src="/brand/axentia-icon.png"
              alt="AXENTIA"
              width={36}
              height={36}
              priority
              className="w-9 h-9 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xl font-bold tracking-tight text-navy">
              AXENTIA
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-navy/70 hover:text-navy transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => openModal()}
              className="text-sm font-semibold text-navy/70 hover:text-navy py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Agendar llamada
            </button>
            <a
              href="#formulario"
              className="text-sm font-bold bg-primary text-white py-2.5 px-5 rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-primary/30 group"
            >
              Auditoría gratuita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-navy/10 text-navy bg-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-white flex flex-col pt-24 px-6">
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openModal();
              }}
              className="w-full border border-navy/15 text-navy font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Agendar llamada
            </button>
            <a
              href="#formulario"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-primary/30"
            >
              Auditoría gratuita
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
