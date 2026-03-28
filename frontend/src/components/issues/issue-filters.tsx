"use client";

import { SearchInput } from "@/components/ui/search-input";
import { IssueStatus, Priority } from "@/lib/types";
import { getIssueStatusLabel } from "@/lib/utils";
import { LayoutList, Columns } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface IssueFiltersProps {
  onSearchChange?: (val: string) => void;
  statusFilter?: IssueStatus | "ALL";
  onStatusChange?: (status: IssueStatus | "ALL") => void;
  priorityFilter?: Priority | "ALL";
  onPriorityChange?: (priority: Priority | "ALL") => void;
}

export function IssueFilters({
  onSearchChange,
  statusFilter = "ALL",
  onStatusChange,
  priorityFilter = "ALL",
  onPriorityChange,
}: IssueFiltersProps) {
  const pathname = usePathname();
  const isKanban = pathname.includes("/kanban");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-center gap-4 flex-1">
        <SearchInput
          placeholder="Filter issues..."
          onChange={onSearchChange}
          className="w-full sm:max-w-xs"
        />

        {/* Mock Selects for Status/Priority */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange?.(e.target.value as IssueStatus | "ALL")}
          className={cn(
            "hidden md:block h-9 rounded-[var(--radius-md)] border border-border bg-bg-surface px-3 py-1",
            "text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          )}
        >
          <option value="ALL">All Statuses</option>
          {Object.values(IssueStatus).map((status) => (
            <option key={status} value={status}>
              {getIssueStatusLabel(status as IssueStatus)}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange?.(e.target.value as Priority | "ALL")}
          className={cn(
            "hidden lg:block h-9 rounded-[var(--radius-md)] border border-border bg-bg-surface px-3 py-1",
            "text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          )}
        >
          <option value="ALL">All Priorities</option>
          {Object.values(Priority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center rounded-lg border border-border bg-bg-surface p-1 shrink-0">
        <Link
          href="/issues"
          className={cn(
            "flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            !isKanban
              ? "bg-bg-elevated text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          <LayoutList className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">List</span>
        </Link>
        <Link
          href="/issues/kanban"
          className={cn(
            "flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            isKanban
              ? "bg-bg-elevated text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          <Columns className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Board</span>
        </Link>
      </div>
    </div>
  );
}
