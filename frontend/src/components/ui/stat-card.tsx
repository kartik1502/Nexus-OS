import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = "text-accent",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-lg)] border border-border",
        "bg-bg-surface p-5 transition-all duration-[var(--transition-base)]",
        "hover:border-border-hover hover:shadow-[var(--shadow-card)]",
        "hover:bg-bg-elevated/50",
        className
      )}
    >
      {/* Subtle accent glow on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-[var(--transition-slow)]",
          "group-hover:opacity-100"
        )}
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(99,102,241,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-success" : "text-danger"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]",
            "bg-bg-elevated transition-colors duration-[var(--transition-base)]",
            "group-hover:bg-accent/10"
          )}
        >
          <Icon className={cn("h-5 w-5", accentColor)} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
