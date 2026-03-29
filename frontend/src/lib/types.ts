// ============================================================
// NEXUS OS — Type Definitions
// Mirrors the PostgreSQL database schema for frontend use
// ============================================================

// ---- Enums ----

export enum IssueStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum DocStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum DocFormat {
  RICH = "rich",
  MARKDOWN = "markdown",
}

export enum CertStatus {
  ACTIVE = "ACTIVE",
  EXPIRING_SOON = "EXPIRING_SOON",
  EXPIRED = "EXPIRED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  VIEWER = "VIEWER",
}

// ---- Interfaces ----

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  issueKey: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  project: string;
  tags: string[];
  dueDate: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doc {
  id: string;
  title: string;
  content: Record<string, unknown> | null;
  markdown: string | null;
  format: DocFormat;
  status: DocStatus;
  project: string;
  topic: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string | null;
  status: CertStatus;
  reminderDays: number;
  certFilePath: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Dashboard Stats ----

export interface DashboardStats {
  totalIssues: number;
  inProgress: number;
  totalDocs: number;
  expiringCerts: number;
  issuesByStatus: Record<IssueStatus, number>;
  issuesByPriority: Record<Priority, number>;
}

// ---- Projects ----

export interface IssueDetail {
  id: string; // e.g. CRIT-001
  title: string;
  severity: "CRITICAL" | "MAJOR" | "MINOR";
  dimension: string;
  location: string;
  description: string;
  impact: string;
  fix: string;
}

export interface FeatureInsight {
  name: string;
  currentState: string;
  improvement: string;
}

export interface FeatureIdea {
  name: string;
  value: string;
  implementationHint: string;
  complexity: "Low" | "Medium" | "High";
  priority: "Low" | "Medium" | "High";
}

export interface ProjectAnalysis {
  healthScore: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  executiveSummary: string;
  topFixes: string[];
  detailedIssues: IssueDetail[];
  featureInsights: FeatureInsight[];
  featureIdeas: FeatureIdea[];
  rawMarkdown: string;
}

export interface Repo {
  id: string;
  name: string;
  url: string;
  analysisReport: ProjectAnalysis | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  isMicroservice: boolean;
  repos: Repo[];
  analysisReport: ProjectAnalysis | null;
  createdAt: string;
  updatedAt: string;
}
