import { Badge } from "@/components/ui/badge";
import { Issue } from "@/lib/types";
import { cn, getIssueStatusLabel, formatDateShort } from "@/lib/utils";
import { Clock } from "lucide-react";

interface IssueRowProps {
  issue: Issue;
  className?: string;
  onClick?: () => void;
}

export function IssueRow({ issue, className, onClick }: IssueRowProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer items-center gap-4 rounded-[var(--radius-md)] px-4 py-3",
        "border border-transparent bg-transparent transition-all duration-[var(--transition-fast)]",
        "hover:border-border-hover hover:bg-bg-hover",
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
      <div className="w-20 shrink-0 font-mono text-xs font-semibold text-text-muted">
        {issue.issueKey}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="truncate text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
          {issue.title}
        </h4>
      </div>

      <div className="hidden lg:flex shrink-0 items-center justify-end gap-2 w-48">
        {issue.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-secondary truncate max-w-20"
          >
            {tag}
          </span>
        ))}
        {issue.tags.length > 2 && (
          <span className="text-[10px] text-text-muted">...</span>
        )}
      </div>

      <div className="hidden md:flex shrink-0 items-center justify-end w-28">
        <Badge
          variant={
            issue.status === "DONE"
              ? "success"
              : issue.status === "IN_PROGRESS"
                ? "accent"
                : issue.status === "IN_REVIEW"
                  ? "warning"
                  : "default"
          }
        >
          {getIssueStatusLabel(issue.status)}
        </Badge>
      </div>

      <div className="hidden md:flex shrink-0 items-center justify-end w-28">
        <Badge
          variant={
            issue.priority === "CRITICAL"
              ? "danger"
              : issue.priority === "HIGH"
                ? "warning"
                : issue.priority === "MEDIUM"
                  ? "info"
                  : "muted"
          }
          dot
        >
          {issue.priority}
        </Badge>
      </div>

      <div className="hidden sm:flex shrink-0 items-center justify-end w-24 text-xs text-text-muted">
        {issue.dueDate ? (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDateShort(issue.dueDate)}
          </span>
        ) : (
          <span className="text-text-muted/50">-</span>
        )}
      </div>
      
      {/* User avatar indicator */}
      <div
        className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-bg-elevated text-[10px] font-bold text-text-secondary"
        title={`Assigned to ${issue.createdBy}`}
      >
        {issue.createdBy.slice(0, 2).toUpperCase()}
      </div>
    </div>
  );
}
