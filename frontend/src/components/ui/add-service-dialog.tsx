"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X, Globe, FolderGit2, Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, url: string) => void;
}

export function AddServiceDialog({ isOpen, onClose, onAdd }: AddServiceDialogProps) {
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onAdd(name.trim(), url.trim());
      setName("");
      setUrl("");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-bg-surface p-6 shadow-2xl animate-slide-up">
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <Plus className="h-5 w-5" />
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-primary">Add New Service</h2>
          <p className="text-sm text-text-muted mt-1">Register a new microservice repository in this project.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="service-name">Service Name</Label>
            <div className="relative">
              <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input 
                id="service-name" 
                placeholder="e.g. notification-service" 
                required 
                autoFocus
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service-url">Repository URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input 
                id="service-url" 
                placeholder="https://git.internal/org/repo" 
                required 
                className="pl-9"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-text-muted px-1">Must be a valid GitHub repo URL.</p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1">Add Service</Button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}
