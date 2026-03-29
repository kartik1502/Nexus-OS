import * as React from "react";
import Link from "next/link";
import { FolderGit2, GitBranch } from "lucide-react";
import { getProjects } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { CreateProjectButton } from "@/components/ui/create-project-button";

export const metadata = {
  title: "Projects - NEXUS OS",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Projects</h1>
          <p className="text-sm text-text-muted">Manage your microservices, linked repositories, and project insights.</p>
        </div>
        <CreateProjectButton />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group flex flex-col justify-between rounded-[var(--radius-lg)] border border-border bg-bg-surface p-5 shadow-card transition-colors hover:shadow-elevated hover:border-border-hover"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                {project.analysisReport && (
                  <Badge variant={project.analysisReport.healthScore >= 7 ? "success" : project.analysisReport.healthScore >= 5 ? "warning" : "danger"}>
                    Health: {project.analysisReport.healthScore}/10
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{project.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{project.description}</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <GitBranch className="h-4 w-4" />
                {project.repos.length} Linked Repo{project.repos.length !== 1 && "s"}
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">
                {project.analysisReport ? 'Analyzed' : 'No Report'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
