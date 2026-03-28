// ============================================================
// NEXUS OS — API Abstraction Layer
// Currently returns mock data. Switch to fetch() when backend is ready.
// ============================================================

import { mockIssues, mockDocs, mockCertifications } from "./mock-data";
import {
  Issue,
  Doc,
  Certification,
  DashboardStats,
  IssueStatus,
  Priority,
  CertStatus,
} from "./types";

// ---- Issues ----

export function getIssues(): Issue[] {
  return mockIssues;
}

export function getIssuesByStatus(status: IssueStatus): Issue[] {
  return mockIssues.filter((i) => i.status === status);
}

export function getIssueById(id: string): Issue | undefined {
  return mockIssues.find((i) => i.id === id);
}

export function getRecentIssues(limit: number = 5): Issue[] {
  return [...mockIssues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

// ---- Docs ----

export function getDocs(): Doc[] {
  return mockDocs;
}

export function getDocById(id: string): Doc | undefined {
  return mockDocs.find((d) => d.id === id);
}

export function getDocsByProject(project: string): Doc[] {
  return mockDocs.filter((d) => d.project === project);
}

export function getRecentDocs(limit: number = 5): Doc[] {
  return [...mockDocs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function getDocProjects(): string[] {
  return [...new Set(mockDocs.map((d) => d.project))];
}

export function getDocTopics(): string[] {
  return [...new Set(mockDocs.map((d) => d.topic))];
}

// ---- Certifications ----

export function getCertifications(): Certification[] {
  return mockCertifications;
}

export function getCertById(id: string): Certification | undefined {
  return mockCertifications.find((c) => c.id === id);
}

export function getExpiringCerts(): Certification[] {
  return mockCertifications.filter(
    (c) => c.status === CertStatus.EXPIRING_SOON || c.status === CertStatus.EXPIRED
  );
}

// ---- Dashboard ----

export function getDashboardStats(): DashboardStats {
  const issues = mockIssues;
  const certs = mockCertifications;

  const issuesByStatus = Object.values(IssueStatus).reduce(
    (acc, status) => {
      acc[status] = issues.filter((i) => i.status === status).length;
      return acc;
    },
    {} as Record<IssueStatus, number>
  );

  const issuesByPriority = Object.values(Priority).reduce(
    (acc, priority) => {
      acc[priority] = issues.filter((i) => i.priority === priority).length;
      return acc;
    },
    {} as Record<Priority, number>
  );

  return {
    totalIssues: issues.length,
    inProgress: issues.filter((i) => i.status === IssueStatus.IN_PROGRESS).length,
    totalDocs: mockDocs.length,
    expiringCerts: certs.filter(
      (c) => c.status === CertStatus.EXPIRING_SOON || c.status === CertStatus.EXPIRED
    ).length,
    issuesByStatus,
    issuesByPriority,
  };
}
