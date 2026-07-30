"use client";

import { useState, useEffect, ReactNode } from "react";
import { getValidSession } from "@/lib/session";
import { UserAuthModal } from "@/components/auth/user-auth-modal";
import { ShieldAlert, Lock, UserPlus, ArrowRight, KeyRound } from "lucide-react";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);

  const checkAccess = () => {
    const session = getValidSession();
    if (!session || !session.user) {
      setIsAuthenticated(false);
      return false;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(session.user.role)) {
        setIsAuthenticated(false);
        return false;
      }
    }

    setActiveSession(session);
    setIsAuthenticated(true);
    return true;
  };

  useEffect(() => {
    checkAccess();

    // Re-check every 30 seconds for session expiry
    const interval = setInterval(() => {
      checkAccess();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-amber-400 font-bold text-xs">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          Verifying Private Account Security...
        </div>
      </div>
    );
  }

  // If Unauthenticated: Render Security Gatekeeper Wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 border border-amber-400/40 flex items-center justify-center mx-auto text-white shadow-lg shadow-orange-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Private Account Gatekeeper</h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              This route requires a registered account. Please log in or create your company account with your unique ID, Gmail, and password.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all"
            >
              <KeyRound className="w-4 h-4" /> Register or Login Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Multi-Tenant Data Vault Enabled
          </div>
        </div>

        <UserAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(newSession) => {
            setActiveSession(newSession);
            setIsAuthenticated(true);
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
