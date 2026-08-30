"use client";

import { useState, useEffect, type ReactNode } from "react";
import LockScreen from "./LockScreen";

interface AdminGateProps {
  children: (props: { onLogout: () => Promise<void> }) => ReactNode;
}

// Protege cualquier pantalla interna reutilizando la misma sesión de /admin
// (cookie firmada, ver lib/auth.ts). Evita repetir el hidrate/verify/lock en
// cada pantalla nueva del motor de prospección.
export default function AdminGate({ children }: AdminGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((res) => {
        if (res.ok) setIsAuthenticated(true);
      })
      .catch((err) => console.error("Error verifying admin session:", err))
      .finally(() => setHydrated(true));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Error logging out:", err);
    }
    setIsAuthenticated(false);
  };

  if (!hydrated) {
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
    return <LockScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <>{children({ onLogout: handleLogout })}</>;
}
