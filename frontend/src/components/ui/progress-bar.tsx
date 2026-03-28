import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  variant?: "accent" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const variantBg: Record<string, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const variantGlow: Record<string, string> = {
  accent: "shadow-[0_0_8px_rgba(99,102,241,0.3)]",
  success: "shadow-[0_0_8px_rgba(34,197,94,0.3)]",
  warning: "shadow-[0_0_8px_rgba(245,158,11,0.3)]",
  danger: "shadow-[0_0_8px_rgba(239,68,68,0.3)]",
};

export function ProgressBar({
  value,
  variant = "accent",
  size = "sm",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-bg-elevated",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantBg[variant],
            variantGlow[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums text-text-secondary">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
