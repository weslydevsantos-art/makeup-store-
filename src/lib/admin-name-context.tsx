"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AdminNameContextType = {
  adminName: string;
  setAdminName: (name: string) => void;
};

const AdminNameContext = createContext<AdminNameContextType | null>(null);

const STORAGE_KEY = "belle-admin-name";

export function AdminNameProvider({ children }: { children: ReactNode }) {
  const [adminName, setAdminNameState] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAdminNameState(stored);
    }
    setHydrated(true);
  }, []);

  const setAdminName = (name: string) => {
    setAdminNameState(name);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, name);
    }
  };

  return (
    <AdminNameContext.Provider value={{ adminName, setAdminName }}>
      {children}
    </AdminNameContext.Provider>
  );
}

export function useAdminName() {
  const context = useContext(AdminNameContext);
  if (!context) {
    throw new Error("useAdminName must be used within an AdminNameProvider");
  }
  return context;
}
