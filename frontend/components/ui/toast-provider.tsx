"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5 ${
              toast.type === "success"
                ? "bg-slate-900/90 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10"
                : toast.type === "error"
                ? "bg-slate-900/90 border-rose-500/40 text-rose-300 shadow-rose-500/10"
                : toast.type === "warning"
                ? "bg-slate-900/90 border-amber-500/40 text-amber-300 shadow-amber-500/10"
                : "bg-slate-900/90 border-cyan-500/40 text-cyan-300 shadow-cyan-500/10"
            }`}
          >
            <div className="flex items-center gap-3 text-xs font-semibold">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === "error" && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
