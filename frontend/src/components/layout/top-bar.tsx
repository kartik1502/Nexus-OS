"use client";

import { usePathname } from "next/navigation";
import { Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/search-input";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopBarProps {
  sidebarCollapsed: boolean;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/issues": "Issues",
  "/issues/kanban": "Kanban Board",
  "/docs": "Documentation",
  "/certifications": "Certifications",
};

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  const pathname = usePathname();
  
  let title = pageTitles[pathname];
  if (!title) {
    if (pathname.startsWith("/projects/")) title = "Project Dashboard";
    else if (pathname.startsWith("/issues/")) title = "Issue Details";
    else if (pathname.startsWith("/docs/")) title = "Document";
    else title = "NEXUS";
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-[var(--topbar-height)] items-center",
        "border-b border-border bg-bg-primary/80 backdrop-blur-xl",
        "transition-all duration-[var(--transition-base)]",
        "px-6 gap-4"
      )}
      style={{
        left: sidebarCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
      }}
    >
      {/* Page title */}
      <h1 className="text-lg font-semibold text-text-primary shrink-0">{title}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <SearchInput
        placeholder="Search everything..."
        className="hidden w-64 md:block lg:w-80"
      />

      {/* Quick actions */}
      <div className="flex items-center gap-1.5">
        <button
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] px-3",
            "bg-accent text-xs font-medium text-white",
            "transition-colors duration-[var(--transition-fast)]",
            "hover:bg-accent-hover"
          )}
          aria-label="Create new item"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">New</span>
        </button>

        <ThemeToggle />

        <button
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
            "text-text-muted transition-colors duration-[var(--transition-fast)]",
            "hover:bg-bg-hover hover:text-text-secondary"
          )}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>

        {/* User avatar */}
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-accent/20 text-xs font-bold text-accent",
            "transition-colors duration-[var(--transition-fast)]",
            "hover:bg-accent/30 cursor-pointer"
          )}
          title="User profile"
        >
          U
        </div>
      </div>
    </header>
  );
}
