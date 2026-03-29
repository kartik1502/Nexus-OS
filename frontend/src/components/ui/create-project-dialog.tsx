"use client";

import * as React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { createProject } from "@/lib/api";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProjectDialog({ isOpen, onClose, onSuccess }: CreateProjectDialogProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isMicroservice, setIsMicroservice] = React.useState(false);
  
  const [repos, setRepos] = React.useState<{ name: string; url: string }[]>([
    { name: "", url: "" }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const configuredRepos = repos
      .filter(r => r.url.trim())
      .map(r => ({
        id: `r${Math.random().toString(36).substring(2, 9)}`,
        name: r.name.trim() || r.url.split("/").pop() || "Repo",
        url: r.url.trim(),
        analysisReport: null
      }));

    createProject({
      name,
      description,
      isMicroservice,
      repos: configuredRepos,
      analysisReport: null
    });
    
    // Reset form
    setName("");
    setDescription("");
    setIsMicroservice(false);
    setRepos([{ name: "", url: "" }]);
    
    onSuccess();
  };

  const updateRepo = (index: number, field: "name" | "url", value: string) => {
    const newRepos = [...repos];
    newRepos[index][field] = value;
    setRepos(newRepos);
  };

  const addRepo = () => {
    setRepos([...repos, { name: "", url: "" }]);
  };

  const removeRepo = (index: number) => {
    const newRepos = repos.filter((_, i) => i !== index);
    setRepos(newRepos.length ? newRepos : [{ name: "", url: "" }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-[var(--radius-lg)] border border-border bg-bg-surface p-6 shadow-elevated animate-slide-up">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Add Project</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Project Name</Label>
            <Input 
              id="title" 
              placeholder="e.g. Nexus OS" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input 
              id="desc" 
              placeholder="Enter a short description..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              id="isMicroservice"
              className="h-4 w-4 rounded border-border bg-bg-primary text-accent focus:ring-accent accent-accent"
              checked={isMicroservice}
              onChange={(e) => setIsMicroservice(e.target.checked)}
            />
            <Label htmlFor="isMicroservice" className="cursor-pointer select-none">
              Is this a Microservices Project?
            </Label>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <Label>Linked Repositories</Label>
              <button 
                type="button" 
                onClick={addRepo}
                className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Repo
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {repos.map((repo, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <Input 
                      placeholder="Repo Name (Optional)" 
                      value={repo.name}
                      onChange={(e) => updateRepo(idx, "name", e.target.value)}
                    />
                    <Input 
                      placeholder="https://github.com/..." 
                      value={repo.url}
                      required={idx === 0}
                      onChange={(e) => updateRepo(idx, "url", e.target.value)}
                    />
                  </div>
                  {repos.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeRepo(idx)}
                      className="shrink-0 flex items-center justify-center p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isMicroservice && (
              <p className="text-[11px] text-text-muted leading-tight mt-1">
                You checked "Microservices Project", meaning each initialized repository above will have its own independent scorecard and insight dashboard.
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>

      </div>
    </div>
  );
}
