"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, AlertCircle, Globe, Phone, Download, Loader2 } from "lucide-react";
import AdminGate from "@/components/admin/AdminGate";
import AdminNav from "@/components/admin/AdminNav";

interface PlaceResult {
  placeId: string;
  companyName: string;
  formattedAddress: string | null;
  phone: string | null;
  website: string | null;
  types: string[];
  existing: boolean;
}

interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  warning: string | null;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

function Toast({ type, message }: ToastState) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl max-w-sm ${
        type === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {message}
    </motion.div>
  );
}

function ProspeccionScreen({ onLogout }: { onLogout: () => Promise<void> }) {
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [searchedSector, setSearchedSector] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [searchError, setSearchError] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: ToastState["type"], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4200);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError("");
    try {
      const res = await fetch("/api/prospeccion/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector, city, maxResults }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsage(data.usage || null);
        throw new Error(data.error || "No se pudo buscar.");
      }
      setResults(data.results);
      setSearchedSector(sector);
      setSearchedCity(city);
      setUsage(data.usage);
      setSelected(new Set(data.results.filter((r: PlaceResult) => !r.existing).map((r: PlaceResult) => r.placeId)));
      if (data.results.length === 0) {
        showToast("error", "No se encontraron resultados para esa búsqueda.");
      }
    } catch (e: unknown) {
      setSearchError((e as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelected = (placeId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  };

  const handleImport = async () => {
    const toImport = results.filter((r) => selected.has(r.placeId));
    if (toImport.length === 0) return;

    setIsImporting(true);
    try {
      const res = await fetch("/api/prospeccion/importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: searchedSector, city: searchedCity, results: toImport }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo importar.");

      showToast(
        "success",
        `${data.importedCount} lead${data.importedCount === 1 ? "" : "s"} importado${data.importedCount === 1 ? "" : "s"}.` +
          (data.skipped.length ? ` ${data.skipped.length} ya existían.` : "")
      );

      const importedSet = new Set(toImport.map((r) => r.placeId));
      setResults((prev) => prev.map((r) => (importedSet.has(r.placeId) ? { ...r, existing: true } : r)));
      setSelected(new Set());
    } catch (e: unknown) {
      showToast("error", (e as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  const usagePercent = usage && usage.limit > 0 ? Math.min(Math.round((usage.used / usage.limit) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-bg-darker text-white">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-blue/8 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-violet/6 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav onLogout={onLogout} />

        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Prospección</h1>
            <p className="text-[11px] text-slate-400">Buscar empresas por sector y ciudad (Google Places)</p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="min-w-[160px] flex-1">
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Sector</label>
            <input
              required
              placeholder="ej. gestorías, inmobiliarias"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Ciudad</label>
            <input
              required
              placeholder="ej. Tarragona"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/60"
            />
          </div>
          <div className="w-24">
            <label className="mb-1 block text-[11px] font-semibold text-slate-400">Cantidad</label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan/60"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isSearching ? "Buscando…" : "Buscar"}
          </button>
        </form>

        {searchError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {searchError}
          </div>
        )}

        {usage && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Búsquedas usadas hoy</span>
              <span className="font-bold text-slate-300">
                {usage.used} / {usage.limit}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 100 ? "bg-red-400" : usagePercent >= 75 ? "bg-amber-400" : "bg-accent-cyan"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usage.warning && <p className="mt-1.5 text-[11px] text-amber-300">{usage.warning}</p>}
          </div>
        )}

        {results.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-xs text-slate-400">
                {results.length} resultado{results.length === 1 ? "" : "s"} · {selected.size} seleccionado
                {selected.size === 1 ? "" : "s"}
              </p>
              <button
                onClick={handleImport}
                disabled={isImporting || selected.size === 0}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
              >
                {isImporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Importar seleccionados
              </button>
            </div>

            <div className="dark-scroll max-h-[480px] space-y-2 overflow-y-auto p-3">
              {results.map((place) => (
                <label
                  key={place.placeId}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    place.existing
                      ? "border-white/5 bg-white/[0.02] opacity-50"
                      : selected.has(place.placeId)
                        ? "border-accent-cyan/40 bg-accent-cyan/5"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={place.existing}
                    checked={selected.has(place.placeId)}
                    onChange={() => toggleSelected(place.placeId)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-white">{place.companyName}</p>
                      {place.existing && (
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                          Ya existe
                        </span>
                      )}
                    </div>
                    {place.formattedAddress && <p className="truncate text-xs text-slate-500">{place.formattedAddress}</p>}
                    <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-400">
                      {place.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {place.phone}
                        </span>
                      )}
                      {place.website && (
                        <span className="flex items-center gap-1 truncate">
                          <Globe className="h-3 w-3" /> {place.website}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProspeccionPage() {
  return <AdminGate>{({ onLogout }) => <ProspeccionScreen onLogout={onLogout} />}</AdminGate>;
}
