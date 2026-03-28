import { Badge } from "@/components/ui/badge";
import { Issue } from "@/lib/types";
import { cn, getPriorityColor, getPriorityDot, formatRelative } from "@/lib/utils";

interface IssueCardProps {
  issue: Issue;
  className?: string;
  onClick?: () => void;
}

export function IssueCard({ issue, className, onClick }: IssueCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-[var(--radius-md)] border border-border bg-bg-surface p-3.5",
        "transition-all duration-[var(--transition-fast)]",
        "hover:border-border-hover hover:shadow-[var(--shadow-card)]",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-text-muted">
          {issue.issueKey}
        </span>
        {/* User avatar indicator */}
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated text-[10px] font-bold text-text-secondary"
          title={`Assigned to ${issue.createdBy}`}
        >
          {issue.createdBy.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <h4 className="mb-3 text-sm font-medium leading-snug text-text-primary group-hover:text-accent transition-colors">
        {issue.title}
      </h4>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={issue.priority === "CRITICAL" ? "danger" : issue.priority === "HIGH" ? "warning" : issue.priority === "MEDIUM" ? "info" : "muted"} dot>
          {issue.priority}
        </Badge>

        {issue.tags.slice(0, 1).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-secondary"
          >
            {tag}
          </span>
        ))}
        {issue.tags.length > 1 && (
          <span className="text-[10px] font-medium text-text-muted">
            +{issue.tags.length - 1}
          </span>
        )}
      </div>
    </div>
  );
}
