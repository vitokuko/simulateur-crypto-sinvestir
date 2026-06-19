"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="layout-provider">{children}</div>
    </SidebarContext.Provider>
  );
}

export function SidebarSpacer({ children }: { children: React.ReactNode }) {
  return (
    <div className="sidebar-spacer flex flex-col flex-1 min-w-0 transition-all duration-300">
      {children}
    </div>
  );
}
