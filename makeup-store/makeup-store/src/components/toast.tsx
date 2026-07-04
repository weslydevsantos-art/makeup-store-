"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastType = "default" | "success" | "error";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: "",
    type: "default",
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = "default") => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const typeClass = toast.type === "success"
    ? "toast-success"
    : toast.type === "error"
    ? "toast-error"
    : "";

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div
          className={`toast ${typeClass} ${toast.visible ? "show" : ""}`}
          role="alert"
          style={{
            transform: toast.visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100px)",
            opacity: toast.visible ? 1 : 0,
          }}
        >
          {toast.message}
        </div>
      )}
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
