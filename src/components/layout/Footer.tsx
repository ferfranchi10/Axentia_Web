"use client";

import { Globe, Code2, Send, ShieldCheck } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function Footer() {
  const { openModal } = useModal();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-deep border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow in footer */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-accent-blue/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-accent-violet/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-violet flex items-center justify-center p-[1px]">
                <div className="w-full h-full rounded-lg bg-bg-darker flex items-center justify-center font-bold text-white text-base">
                  A
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1 group-hover:text-accent-cyan transition-colors">
                Axentia
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              </span>
            </a>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Axentia – Consultoría Tecnológica Inteligente
            </p>
            <p className="text-white text-xs italic font-medium leading-relaxed max-w-xs">
              “Tu negocio es único. Tu tecnología también debería serlo.”
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Soluciones a Medida</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => openModal("audit")}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Auditoría de Ineficiencias
                </button>
              </li>
              <li>
                <a href="#servicios" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Automatización de Procesos
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Inteligencia Artificial Aplicada
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-xs text-slate-400 hover:text-white transition-colors">
                  CRMs y Sistemas Personalizados
                </a>
              </li>
              <li>
                <a href="#solucion" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Diseño de Traje Tecnológico
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Compañía</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#problema" className="text-xs text-slate-400 hover:text-white transition-colors">
                  ¿Por qué Axentia?
                </a>
              </li>
              <li>
                <a href="#metodologia" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Nuestra Metodología
                </a>
              </li>
              <li>
                <a href="#autodiagnostico" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Autodiagnóstico de ROI
                </a>
              </li>
              <li>
                <a href="#faq" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Boletín Tecnológico</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Recibe estrategias exclusivas de automatización e IA aplicada directamente en tu correo. Sin spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@correo.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
              />
              <button className="p-2 bg-accent-blue text-white rounded-xl hover:bg-accent-blue/90 transition-all flex items-center justify-center shrink-0 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Garantía de privacidad y baja en un clic.</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} Axentia. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
