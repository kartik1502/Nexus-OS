"use client";

import { useState } from "react";
import { getIssues } from "@/lib/api";
import { IssueStatus, Issue } from "@/lib/types";
import { IssueCard } from "@/components/issues/issue-card";
import { IssueFilters } from "@/components/issues/issue-filters";
import { cn, getIssueStatusLabel } from "@/lib/utils";

function KanbanColumn({ status, issues }: { status: IssueStatus; issues: Issue[] }) {
  return (
    <div className="flex h-full min-w-[300px] max-w-[320px] flex-col rounded-[var(--radius-lg)] bg-bg-surface/50 p-2">
      <div className="mb-3 flex items-center justify-between px-2 pt-2">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          {/* Status color indicator */}
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status === IssueStatus.DONE
                ? "bg-success"
                : status === IssueStatus.IN_PROGRESS
                  ? "bg-accent"
                  : status === IssueStatus.IN_REVIEW
                    ? "bg-warning"
                    : status === IssueStatus.TODO
                      ? "bg-info"
                      : "bg-text-muted"
            )}
          />
          {getIssueStatusLabel(status)}
        </h3>
        <span className="flex h-5 items-center justify-center rounded-full bg-bg-elevated px-2 text-xs font-medium text-text-muted">
          {issues.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-1 pb-2 custom-scrollbar">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border/50 text-sm italic text-text-muted">
            Drop issues here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const [search, setSearch] = useState("");
  const allIssues = getIssues();

  const filteredIssues = allIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.issueKey.toLowerCase().includes(search.toLowerCase())
  );

  const columns = Object.values(IssueStatus).map((status) => ({
    status,
    issues: filteredIssues.filter((i) => i.status === status),
  }));

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-48px)] flex-col animate-fade-in">
      <div className="mb-2 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Kanban Board</h1>
        <p className="text-sm text-text-secondary mt-1">Visualize and move your issues through workflows.</p>
      </div>

      <div className="mt-6 shrink-0">
        <IssueFilters onSearchChange={setSearch} />
      </div>

      {/* Kanban Board Area */}
      <div className="mt-2 flex-1 overflow-x-auto overflow-y-hidden rounded-[var(--radius-lg)] border border-border bg-bg-surface p-4">
        <div className="flex h-full gap-4">
          {columns.map((col, i) => (
            <div key={col.status} className={cn("h-full animate-fade-in", `stagger-${i + 1}`)}>
              <KanbanColumn status={col.status} issues={col.issues} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
