import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-elevated">
        <Icon className="h-7 w-7 text-text-muted" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1.5 text-base font-medium text-text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2",
            "bg-accent text-sm font-medium text-white",
            "transition-colors duration-[var(--transition-fast)]",
            "hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
