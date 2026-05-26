'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PlatformBackground } from '@/components/platform/platform-background';
import { Sidebar } from './sidebar';

interface SidebarContextType {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function usePlatformMenu() {
  const context = useContext(SidebarContext);
  return context ? () => context.setMobileOpen(true) : undefined;
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setCollapsedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setCollapsedState(true);
    }
  }, []);

  const setCollapsed = (collapsed: boolean) => {
    setCollapsedState(collapsed);
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  };

  return (
    <AuthGuard>
      <SidebarContext.Provider
        value={{
          isCollapsed,
          setCollapsed,
          mobileOpen,
          setMobileOpen,
        }}
      >
        <div className="platform-shell relative flex h-screen w-screen overflow-hidden bg-[#050816] text-[#f8fafc]">
          <PlatformBackground />
          <Sidebar />
          <div className="relative z-10 flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
            {children}
          </div>
        </div>
      </SidebarContext.Provider>
    </AuthGuard>
  );
}
