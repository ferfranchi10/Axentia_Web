"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, XCircle } from "lucide-react";

interface LockScreenProps {
  onSuccess: () => void;
}

export default function LockScreen({ onSuccess }: LockScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Contraseña incorrecta.");
        setPassword("");
      }
    } catch {
      setError("Error de conexión. Comprueba el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-accent-blue/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[55%] bg-accent-violet/8 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 180, damping: 22 }}
        className="w-full max-w-sm"
      >
        <div
          className="rounded-2xl border border-white/10 p-8 shadow-2xl"
          style={{ background: "rgba(6,9,20,0.85)", backdropFilter: "blur(24px)" }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
            >
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Panel de Administración</h1>
            <p className="text-slate-400 text-xs mt-1">Axentia Consulting · Acceso Privado</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60 transition-colors"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                  >
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading || !password}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Acceder al Panel
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-600 leading-relaxed">
            Acceso exclusivo para administradores de Axentia.<br />
            Esta página no es visible para los visitantes del sitio.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
