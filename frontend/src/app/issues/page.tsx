"use client";

import { useState, useMemo } from "react";
import { getIssues } from "@/lib/api";
import { IssueStatus, Issue } from "@/lib/types";
import { getIssueStatusLabel } from "@/lib/utils";
import { IssueRow } from "@/components/issues/issue-row";
import { IssueFilters } from "@/components/issues/issue-filters";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper component for collapsible status groups
function IssueGroup({ title, issues }: { title: string; issues: Issue[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (issues.length === 0) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:text-accent"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent" />
        ) : (
          <ChevronRight className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent" />
        )}
        {title} <span className="text-xs font-normal text-text-muted ml-1">({issues.length})</span>
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-1 border-t border-border/50 pt-2">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function IssuesListPage() {
  const [search, setSearch] = useState("");
  const allIssues = getIssues();

  // Simple client-side search filtering
  const filteredIssues = useMemo(() => {
    return allIssues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.issueKey.toLowerCase().includes(search.toLowerCase())
    );
  }, [allIssues, search]);

  const backlog = filteredIssues.filter((i) => i.status === IssueStatus.BACKLOG);
  const todo = filteredIssues.filter((i) => i.status === IssueStatus.TODO);
  const inProgress = filteredIssues.filter((i) => i.status === IssueStatus.IN_PROGRESS);
  const inReview = filteredIssues.filter((i) => i.status === IssueStatus.IN_REVIEW);
  const done = filteredIssues.filter((i) => i.status === IssueStatus.DONE);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Issues List</h1>
        <p className="text-sm text-text-secondary mt-1">Manage and track your project tasks.</p>
      </div>

      <div className="mt-6">
        <IssueFilters onSearchChange={setSearch} />
      </div>

      <div className="mt-2 flex-1 overflow-auto rounded-[var(--radius-lg)] border border-border bg-bg-surface p-5">
        
        {/* Header Row */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border/50 text-xs font-medium text-text-muted mb-4">
          <div className="w-20 shrink-0">Key</div>
          <div className="flex-1 min-w-0">Title</div>
          <div className="hidden lg:block shrink-0 w-48 text-right">Tags</div>
          <div className="hidden md:block shrink-0 w-28 text-right">Status</div>
          <div className="hidden md:block shrink-0 w-28 text-right">Priority</div>
          <div className="hidden sm:block shrink-0 w-24 text-right">Due Date</div>
          <div className="shrink-0 w-6 text-center"></div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="py-20 text-center text-text-muted">No issues found fetching "{search}"</div>
        ) : (
          <div className="flex flex-col">
            <IssueGroup title={getIssueStatusLabel(IssueStatus.IN_PROGRESS)} issues={inProgress} />
            <IssueGroup title={getIssueStatusLabel(IssueStatus.IN_REVIEW)} issues={inReview} />
            <IssueGroup title={getIssueStatusLabel(IssueStatus.TODO)} issues={todo} />
            <IssueGroup title={getIssueStatusLabel(IssueStatus.BACKLOG)} issues={backlog} />
            <IssueGroup title={getIssueStatusLabel(IssueStatus.DONE)} issues={done} />
          </div>
        )}
      </div>
    </div>
  );
}
