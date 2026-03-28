"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDot,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/issues", label: "Issues", icon: CircleDot },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/certifications", label: "Certifications", icon: Award },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border",
        "bg-bg-sidebar transition-all duration-[var(--transition-base)]",
        collapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-[var(--topbar-height)] items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent/10">
            <Hexagon className="h-4.5 w-4.5 text-accent" strokeWidth={2} />
          </div>
          <span
            className={cn(
              "text-base font-bold tracking-tight text-text-primary whitespace-nowrap",
              "transition-all duration-[var(--transition-base)]",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            NEXUS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5",
                "text-sm font-medium transition-all duration-[var(--transition-fast)]",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
              aria-current={active ? "page" : undefined}
            >
              {/* Active indicator bar */}
              {active && (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
              )}

              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                )}
                strokeWidth={1.75}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-[var(--transition-base)]",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border px-3 py-3">
        {/* Settings link */}
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5",
            "text-sm font-medium text-text-secondary",
            "transition-colors duration-[var(--transition-fast)]",
            "hover:bg-bg-hover hover:text-text-primary"
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0 text-text-muted" strokeWidth={1.75} />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-[var(--transition-base)]",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            Settings
          </span>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2",
            "text-sm text-text-muted transition-colors duration-[var(--transition-fast)]",
            "hover:bg-bg-hover hover:text-text-secondary"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={2} />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
