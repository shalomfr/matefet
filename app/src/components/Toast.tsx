"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ToastState {
  message: string;
  visible: boolean;
  type?: "success" | "error";
}

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showSuccess: () => {},
      showError: () => {},
    };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const showSuccess = useCallback((message: string) => {
    setToast({ message, visible: true, type: "success" });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 4000);
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ message, visible: true, type: "error" });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 4000);
  }, []);

  const isError = toast.type === "error";

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      {toast.visible && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg animate-fade-in ${
            isError
              ? "bg-[#fef2f2] border-2 border-[#fecaca] text-[#dc2626]"
              : "bg-[#f0fdf4] border-2 border-[#bbf7d0] text-[#16a34a]"
          }`}
          role="status"
        >
          {isError ? (
            <AlertCircle size={22} className="flex-shrink-0" />
          ) : (
            <CheckCircle2 size={22} className="flex-shrink-0" />
          )}
          <span className="font-semibold text-[15px]">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}
