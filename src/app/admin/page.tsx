"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
  Calendar,
  Clock,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const SLOT_TIMES: string[] = (() => {
  const slots: string[] = [];
  for (let minutes = 9 * 60; minutes <= 20 * 60; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
})();

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function getNextWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(today);
  while (days.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface BusySlot {
  id: string;
  summary: string;
  start: string;
  end: string;
  isAdminBlock: boolean;
}

type SlotStatus = "free" | "busy" | "blocked";

interface SlotInfo {
  status: SlotStatus;
  eventId: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSlotInfo(day: Date, time: string, busySlots: BusySlot[]): SlotInfo {
  const [hour, minute] = time.split(":").map(Number);
  const slotStart = new Date(day);
  slotStart.setHours(hour, minute, 0, 0);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotStart.getHours() + 1);

  for (const slot of busySlots) {
    const busyStart = new Date(slot.start);
    const busyEnd = new Date(slot.end);
    if (slotStart < busyEnd && slotEnd > busyStart) {
      return {
        status: slot.isAdminBlock ? "blocked" : "busy",
        eventId: slot.id,
      };
    }
  }
  return { status: "free", eventId: null };
}

function addHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─── Lock Screen ─────────────────────────────────────────────────────────────

interface LockScreenProps {
  onSuccess: () => void;
}

function LockScreen({ onSuccess }: LockScreenProps) {
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
      {/* Ambient glows */}
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
          {/* Icon */}
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

// ─── Notification Toast ───────────────────────────────────────────────────────

interface ToastProps {
  type: "success" | "error";
  message: string;
}

function Toast({ type, message }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl max-w-xs ${
        type === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      {message}
    </motion.div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const DAYS = useMemo(() => getNextWeekdays(7), []);

  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [togglingSlot, setTogglingSlot] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const showToast = (type: ToastProps["type"], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/availability");
      const data = await res.json();
      setBusySlots(data.busy || []);
      setLastSync(new Date());
    } catch {
      showToast("error", "Error al sincronizar con Google Calendar.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      fetchAvailability();
    }, 0);
    return () => clearTimeout(handle);
  }, [fetchAvailability]);

  const selectedDay = DAYS[selectedDayIdx];

  // Compute slot infos for selected day
  const slotInfos = useMemo(
    () => SLOT_TIMES.map((time) => getSlotInfo(selectedDay, time, busySlots)),
    [selectedDay, busySlots]
  );

  const freeCount = slotInfos.filter((s) => s.status === "free").length;
  const busyCount = slotInfos.filter((s) => s.status === "busy").length;
  const blockedCount = slotInfos.filter((s) => s.status === "blocked").length;

  const handleToggle = async (time: string, info: SlotInfo) => {
    if (info.status === "busy") return;
    const key = `${selectedDay.toISOString()}-${time}`;
    setTogglingSlot(key);

    try {
      const body =
        info.status === "free"
          ? { action: "block", date: selectedDay.toISOString(), startTime: time }
          : { action: "unblock", eventId: info.eventId };

      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(
          "success",
          info.status === "free"
            ? `✓ ${time} bloqueado en Google Calendar`
            : `✓ ${time} desbloqueado correctamente`
        );
        await fetchAvailability();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Error desconocido");
      }
    } catch (e: unknown) {
      showToast("error", (e as Error).message || "Error al actualizar el horario");
    } finally {
      setTogglingSlot(null);
    }
  };

  const formattedDate = selectedDay.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-bg-darker text-white">
      {/* Toast */}
      <AnimatePresence>{toast && <Toast type={toast.type} message={toast.message} />}</AnimatePresence>

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-blue/8 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-violet/6 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
            >
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Panel de Administración</h1>
              <p className="text-[11px] text-slate-400">Axentia · Gestión de Disponibilidad en Tiempo Real</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-sync-btn"
              onClick={fetchAvailability}
              disabled={isLoading}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Sincronizando…" : "Sincronizar"}
            </button>
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/15 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Disponibles", value: freeCount, color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15" },
            { label: "Reservados", value: busyCount, color: "text-accent-cyan", bg: "bg-accent-cyan/8 border-accent-cyan/15" },
            { label: "Bloqueados", value: blockedCount, color: "text-red-400", bg: "bg-red-500/8 border-red-500/15" },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 text-center ${bg}`}
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Day selector ── */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {DAYS.map((day, idx) => (
            <button
              key={idx}
              id={`admin-day-${idx}`}
              onClick={() => setSelectedDayIdx(idx)}
              className={`flex-shrink-0 rounded-xl border px-4 py-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                selectedDayIdx === idx
                  ? "border-accent-cyan bg-accent-cyan/15 text-white shadow-md"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider opacity-60">
                {DAY_NAMES[day.getDay()]}
              </span>
              <span className="mt-0.5 block text-lg leading-none">{day.getDate()}</span>
              <span className="block text-[10px] opacity-50">{MONTH_NAMES[day.getMonth()]}</span>
            </button>
          ))}
        </div>

        {/* ── Section title ── */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent-cyan" />
            <h2 className="text-sm font-semibold capitalize text-white">{formattedDate}</h2>
          </div>
          {lastSync && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="h-3 w-3" />
              Actualizado {lastSync.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* ── Legend ── */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {[
            { dot: "bg-emerald-400", label: "Disponible", color: "text-emerald-400" },
            { dot: "bg-accent-cyan", label: "Reservado por cliente", color: "text-accent-cyan" },
            { dot: "bg-red-400", label: "Bloqueado por ti", color: "text-red-400" },
          ].map(({ dot, label, color }) => (
            <span key={label} className={`flex items-center gap-1.5 text-xs ${color}`}>
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>

        {/* ── Time Slot Grid ── */}
        {isLoading && busySlots.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <svg className="h-6 w-6 animate-spin text-accent-cyan" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="ml-3 text-sm text-slate-400">Cargando disponibilidad…</span>
          </div>
        ) : (
          <div className="space-y-2">
            {SLOT_TIMES.map((time, idx) => {
              const info = slotInfos[idx];
              const key = `${selectedDay.toISOString()}-${time}`;
              const isToggling = togglingSlot === key;
              const endTime = addHour(time);

              const styles = {
                free: {
                  row: "border-emerald-500/15 bg-emerald-500/5 hover:border-emerald-500/30",
                  dot: "bg-emerald-400",
                  badge: "text-emerald-400/80",
                  badgeText: "Disponible",
                  btn: "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300",
                  btnText: "Bloquear",
                  BtnIcon: Lock,
                },
                busy: {
                  row: "border-accent-cyan/15 bg-accent-cyan/5",
                  dot: "bg-accent-cyan",
                  badge: "text-accent-cyan/80",
                  badgeText: "Reservado por cliente",
                  btn: "",
                  btnText: "",
                  BtnIcon: Lock,
                },
                blocked: {
                  row: "border-red-500/15 bg-red-500/5 hover:border-red-500/30",
                  dot: "bg-red-400",
                  badge: "text-red-400/80",
                  badgeText: "Bloqueado por Admin",
                  btn: "border-emerald-500/20 bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/15",
                  btnText: "Desbloquear",
                  BtnIcon: Unlock,
                },
              }[info.status];

              return (
                <motion.div
                  key={time}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.015 }}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${styles.row}`}
                >
                  {/* Time + status */}
                  <div className="flex items-center gap-3">
                    <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {time} – {endTime}
                      </p>
                      <p className={`text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}>
                        {styles.badgeText}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  {info.status === "busy" ? (
                    <span className="text-xs italic text-slate-600">Solo el cliente puede cancelar</span>
                  ) : (
                    <button
                      id={`slot-${time.replace(":", "")}-btn`}
                      onClick={() => handleToggle(time, info)}
                      disabled={isToggling}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${styles.btn}`}
                    >
                      {isToggling ? (
                        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <styles.BtnIcon className="h-3.5 w-3.5" />
                      )}
                      {isToggling ? "Actualizando…" : styles.btnText}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-slate-600">
          Los cambios se sincronizan automáticamente con Google Calendar ·{" "}
          <span className="text-slate-500">axentia.consulting@gmail.com</span>
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Check session cookie validity on client mount
  useEffect(() => {
    fetch("/api/admin/verify")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => console.error("Error verifying admin session:", err))
      .finally(() => setHydrated(true));
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Error logging out:", err);
    }
    setIsAuthenticated(false);
  };

  if (!hydrated) {
    // Avoid flicker on first render
    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center">
        <svg className="h-6 w-6 animate-spin text-accent-cyan" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LockScreen onSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
