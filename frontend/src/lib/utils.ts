// ============================================================
// NEXUS OS — Utility Functions
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, differenceInDays, isPast } from "date-fns";
import { IssueStatus, Priority, DocStatus, CertStatus } from "./types";

/** Merge class names — wrapper around clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ---- Date Utilities ----

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), "MMM d");
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function daysUntil(dateStr: string): number {
  return differenceInDays(new Date(dateStr), new Date());
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return isPast(new Date(dateStr));
}

// ---- Status Color Mappers ----

export function getIssueStatusColor(status: IssueStatus): string {
  const map: Record<IssueStatus, string> = {
    [IssueStatus.BACKLOG]: "text-text-muted bg-bg-elevated",
    [IssueStatus.TODO]: "text-info bg-info/10",
    [IssueStatus.IN_PROGRESS]: "text-accent bg-accent/10",
    [IssueStatus.IN_REVIEW]: "text-warning bg-warning/10",
    [IssueStatus.DONE]: "text-success bg-success/10",
  };
  return map[status];
}

export function getPriorityColor(priority: Priority): string {
  const map: Record<Priority, string> = {
    [Priority.LOW]: "text-text-secondary bg-bg-elevated",
    [Priority.MEDIUM]: "text-info bg-info/10",
    [Priority.HIGH]: "text-warning bg-warning/10",
    [Priority.CRITICAL]: "text-danger bg-danger/10",
  };
  return map[priority];
}

export function getPriorityDot(priority: Priority): string {
  const map: Record<Priority, string> = {
    [Priority.LOW]: "bg-text-muted",
    [Priority.MEDIUM]: "bg-info",
    [Priority.HIGH]: "bg-warning",
    [Priority.CRITICAL]: "bg-danger",
  };
  return map[priority];
}

export function getDocStatusColor(status: DocStatus): string {
  const map: Record<DocStatus, string> = {
    [DocStatus.DRAFT]: "text-warning bg-warning/10",
    [DocStatus.PUBLISHED]: "text-success bg-success/10",
  };
  return map[status];
}

export function getCertStatusColor(status: CertStatus): string {
  const map: Record<CertStatus, string> = {
    [CertStatus.ACTIVE]: "text-success bg-success/10",
    [CertStatus.EXPIRING_SOON]: "text-warning bg-warning/10",
    [CertStatus.EXPIRED]: "text-danger bg-danger/10",
  };
  return map[status];
}

export function getCertStatusBorder(status: CertStatus): string {
  const map: Record<CertStatus, string> = {
    [CertStatus.ACTIVE]: "border-success/20",
    [CertStatus.EXPIRING_SOON]: "border-warning/20",
    [CertStatus.EXPIRED]: "border-danger/20",
  };
  return map[status];
}

// ---- Formatting Helpers ----

export function getIssueStatusLabel(status: IssueStatus): string {
  const map: Record<IssueStatus, string> = {
    [IssueStatus.BACKLOG]: "Backlog",
    [IssueStatus.TODO]: "To Do",
    [IssueStatus.IN_PROGRESS]: "In Progress",
    [IssueStatus.IN_REVIEW]: "In Review",
    [IssueStatus.DONE]: "Done",
  };
  return map[status];
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + "…";
}
