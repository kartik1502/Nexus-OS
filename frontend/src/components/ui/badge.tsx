import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "accent" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "border border-border bg-bg-surface text-text-secondary shadow-sm",
  success: "border border-success/20 bg-success/10 text-success",
  warning: "border border-warning/20 bg-warning/10 text-warning",
  danger: "border border-danger/20 bg-danger/10 text-danger",
  info: "border border-info/20 bg-info/10 text-info",
  accent: "border border-accent/20 bg-accent/10 text-accent",
  muted: "border border-border bg-bg-elevated text-text-muted",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-text-secondary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
  muted: "bg-text-muted",
};

export function Badge({ children, variant = "default", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        "transition-colors duration-[var(--transition-fast)]",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
