"use client";

import { useState } from "react";
import { Folder, FolderOpen, ChevronDown, ChevronRight, Hash } from "lucide-react";
import { getDocProjects, getDocTopics, getDocs } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DocSidebarProps {
  onProjectSelect?: (project: string | null) => void;
  onTopicSelect?: (topic: string | null) => void;
}

export function DocSidebar({ onProjectSelect, onTopicSelect }: DocSidebarProps) {
  const projects = getDocProjects();
  const allDocs = getDocs();
  
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>(
    projects.reduce((acc, p) => ({ ...acc, [p]: true }), {})
  );

  const toggleProject = (project: string) => {
    setExpandedProjects((prev) => ({ ...prev, [project]: !prev[project] }));
  };

  return (
    <div className="w-64 shrink-0 flex flex-col h-full border-r border-border bg-bg-surface/50 p-4">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Repository</h3>
      
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
        <button
           className="w-full mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-text-primary bg-bg-elevated transition-colors"
           onClick={() => {
             onProjectSelect?.(null);
             onTopicSelect?.(null);
           }}
        >
          <FolderOpen className="h-4 w-4 text-accent" />
          All Documents
        </button>

        {projects.map((project) => {
          const isExpanded = expandedProjects[project];
          const projectDocs = allDocs.filter((d) => d.project === project);
          const projectTopics = Array.from(new Set(projectDocs.map((d) => d.topic)));

          return (
            <div key={project} className="mb-1">
              <button
                onClick={() => toggleProject(project)}
                className="group flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-accent/70 group-hover:text-accent" />
                ) : (
                  <Folder className="h-4 w-4 text-text-muted group-hover:text-accent/70" />
                )}
                <span className="truncate" onClick={(e) => { e.stopPropagation(); onProjectSelect?.(project); }}>
                  {project}
                </span>
                <span className="ml-auto text-[10px] bg-bg-elevated px-1.5 rounded-full text-text-muted">
                  {projectDocs.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-border/50 pl-2">
                  {projectTopics.map((topic) => {
                    const count = projectDocs.filter((d) => d.topic === topic).length;
                    return (
                      <button
                        key={topic}
                        onClick={() => {
                          onProjectSelect?.(project);
                          onTopicSelect?.(topic);
                        }}
                        className="group flex w-full items-center gap-2 rounded-md px-2 py-1 text-[13px] text-text-muted hover:bg-bg-hover hover:text-text-secondary transition-colors"
                      >
                        <Hash className="h-3 w-3 opacity-50" />
                        <span className="truncate">{topic}</span>
                        <span className="ml-auto text-[10px] opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
