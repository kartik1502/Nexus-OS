"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />; // Placeholder
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
        "text-text-muted transition-colors duration-[var(--transition-fast)]",
        "hover:bg-bg-hover hover:text-text-secondary"
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-4.5 w-4.5 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={1.75} />
      <Moon className="h-4.5 w-4.5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" strokeWidth={1.75} />
    </button>
  );
}
