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

// ---- Projects ----

import { mockProjects } from "./mock-data";
import { Project } from "./types";

export function getProjects(): Project[] {
  return mockProjects;
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

// Mock save logic for analysis
export function saveProjectAnalysis(id: string, analysis: import("./types").ProjectAnalysis, repoId?: string) {
  const proj = mockProjects.find((p) => p.id === id);
  if (proj) {
    if (proj.isMicroservice && repoId) {
       const repo = proj.repos.find(r => r.id === repoId);
       if (repo) {
         repo.analysisReport = analysis;
       }
    } else {
       proj.analysisReport = analysis;
    }
    proj.updatedAt = new Date().toISOString();
  }
}

export function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const newProject: Project = {
    ...project,
    id: `p${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockProjects.unshift(newProject);
  return newProject;
}

export function addRepoToProject(projectId: string, name: string, url: string): import("./types").Repo | undefined {
  const project = mockProjects.find(p => p.id === projectId);
  if (project) {
    const newRepo: import("./types").Repo = {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      name,
      url,
      analysisReport: null
    };
    project.repos.push(newRepo);
    project.updatedAt = new Date().toISOString();
    return newRepo;
  }
  return undefined;
}

export function deleteRepoFromProject(projectId: string, repoId: string): boolean {
  const project = mockProjects.find(p => p.id === projectId);
  if (project) {
    const originalCount = project.repos.length;
    project.repos = project.repos.filter(r => r.id !== repoId);
    if (project.repos.length !== originalCount) {
      project.updatedAt = new Date().toISOString();
      return true;
    }
  }
  return false;
}
