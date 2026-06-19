"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
    return () => clearTimeout(t);
  }, [toast.visible, toast.message]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none"
        style={{
          opacity: toast.visible ? 1 : 0,
          transform: `translateX(-50%) translateY(${toast.visible ? "0" : "12px"})`,
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-light shadow-xl"
          style={{
            backgroundColor: "#0d1525",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#7899ce",
            backdropFilter: "blur(12px)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: "#1098F7", flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 8v4M12 16v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ color: "#c8d8f0" }}>{toast.message}</span>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
