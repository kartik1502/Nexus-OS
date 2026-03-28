"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <TopBar sidebarCollapsed={sidebarCollapsed} />

      <main
        className={cn(
          "pt-[var(--topbar-height)] transition-all duration-[var(--transition-base)]",
          sidebarCollapsed ? "pl-[var(--sidebar-collapsed)]" : "pl-[var(--sidebar-width)]"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
