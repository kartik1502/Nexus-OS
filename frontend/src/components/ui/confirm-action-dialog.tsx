"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./button";

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}

export function ConfirmActionDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger"
}: ConfirmActionDialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-bg-surface p-6 shadow-2xl animate-slide-up">
        
        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full mb-4",
            variant === "danger" ? "bg-danger/10 text-danger" : 
            variant === "warning" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"
          )}>
            {variant === "danger" ? <Trash2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>
          
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <p className="text-sm text-text-muted mt-2 px-2">{description}</p>
        </div>

        <div className="pt-8 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>{cancelText}</Button>
          <Button 
            className={cn(
              "flex-1", 
              variant === "danger" ? "bg-danger hover:bg-danger-hover text-white" : 
              variant === "warning" ? "bg-warning hover:bg-warning-hover text-white" : ""
            )} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>

      </div>
    </div>,
    document.body
  );
}
