"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { CreateProjectDialog } from "./create-project-dialog";

export function CreateProjectButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="shrink-0 gap-2">
        <Plus className="h-4 w-4" />
        Add Project
      </Button>
      
      {isOpen && (
        <CreateProjectDialog 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }} 
        />
      )}
    </>
  );
}
