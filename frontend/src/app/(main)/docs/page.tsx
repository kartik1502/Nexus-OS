"use client";

import { useState } from "react";
import { getDocs } from "@/lib/api";
import { DocCard } from "@/components/docs/doc-card";
import { DocSidebar } from "@/components/docs/doc-sidebar";
import { SearchInput } from "@/components/ui/search-input";
import { X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const allDocs = getDocs();

  let filteredDocs = allDocs.filter(
    (doc) => 
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (selectedProject) {
    filteredDocs = filteredDocs.filter((d) => d.project === selectedProject);
  }
  
  if (selectedTopic && selectedProject) {
    filteredDocs = filteredDocs.filter((d) => d.topic === selectedTopic);
  }

  // Handle active filter pills
  const clearFilters = () => {
    setSelectedProject(null);
    setSelectedTopic(null);
    setSearch("");
  };

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-48px)] flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* Left Sidebar Tree */}
      <div className="hidden lg:block h-full rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <DocSidebar 
          onProjectSelect={setSelectedProject}
          onTopicSelect={setSelectedTopic}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-2 shrink-0">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Documentation</h1>
          <p className="text-sm text-text-secondary mt-1">Manage project docs, guides, and notes.</p>
        </div>

        <div className="mt-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <SearchInput
            placeholder="Search docs or #tags..."
            value={search}
            onChange={setSearch}
            className="w-full sm:max-w-md"
          />
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {selectedProject && (
              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent whitespace-nowrap">
                Project: {selectedProject}
                <button onClick={() => { setSelectedProject(null); setSelectedTopic(null); }} className="ml-1 hover:text-accent-hover">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedTopic && (
              <span className="flex items-center gap-1 rounded-full bg-info/10 px-3 py-1 text-xs font-medium text-info whitespace-nowrap">
                Topic: {selectedTopic}
                <button onClick={() => setSelectedTopic(null)} className="ml-1 hover:text-info">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(selectedProject || selectedTopic || search) && (
              <button onClick={clearFilters} className="text-xs font-medium text-text-muted hover:text-text-primary transition-colors whitespace-nowrap px-2">
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto pr-2 rounded-[var(--radius-lg)] border border-border bg-bg-surface p-5 relative">
          
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              {filteredDocs.length} Document{filteredDocs.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="py-20 text-center text-text-muted">
              <FileText className="h-10 w-10 mx-auto opacity-20 mb-4" />
              <p>No documents found matching the current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredDocs.map((doc, i) => (
                <div key={doc.id} className={cn("animate-fade-in", `stagger-${(i % 6) + 1}`)}>
                  <DocCard doc={doc} className="h-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ensure lucide icon is available for empty state
import { FileText } from "lucide-react";
