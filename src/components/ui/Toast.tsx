"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { TOAST_DURATION } from "@/lib/constants";

interface ToastState {
  message: string;
  visible: boolean;
  key: number;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false, key: 0 });

  const showToast = useCallback((message: string) => {
    setToast((prev) => ({ message, visible: true, key: prev.key + 1 }));
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, visible: false })), TOAST_DURATION);
    return () => clearTimeout(t);
  }, [toast.visible, toast.key]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed top-6 right-6 z-[100] pointer-events-none"
        style={{
          transition: "opacity 300ms ease, transform 300ms ease",
          opacity: toast.visible ? 1 : 0,
          transform: `translateY(${toast.visible ? "0" : "-16px"})`,
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: 360,
            backgroundColor: "#0d1525",
            border: "1px solid rgba(16,152,247,0.25)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,152,247,0.08)",
          }}
        >
          {/* Top accent line */}
          <div
            className="h-0.5 w-full"
            style={{ background: "linear-gradient(to right, #1098F7, #0049C6)" }}
          />

          <div className="flex items-start gap-4 px-5 py-4">
            {/* Icon */}
            <div
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
              style={{ backgroundColor: "rgba(16,152,247,0.12)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#1098F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white mb-0.5">Succès</p>
              <p className="text-sm font-light leading-relaxed" style={{ color: "#7899ce" }}>
                {toast.message}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {toast.visible && (
            <div
              className="absolute bottom-0 left-0 h-0.5"
              style={{
                background: "linear-gradient(to right, #1098F7, #0049C6)",
                animation: `toast-progress ${TOAST_DURATION}ms linear forwards`,
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
