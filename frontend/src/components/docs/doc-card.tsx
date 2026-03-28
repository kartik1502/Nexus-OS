import { Badge } from "@/components/ui/badge";
import { Doc, DocStatus } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import { FileText, AlignLeft } from "lucide-react";

interface DocCardProps {
  doc: Doc;
  className?: string;
}

export function DocCard({ doc, className }: DocCardProps) {
  // Extract a brief excerpt from markdown or rich text (mocked logic here)
  const extractExcerpt = () => {
    if (doc.markdown) {
      const plainText = doc.markdown.replace(/#+|-|\*|`|>|\[|\]|\(|\)/g, "").trim();
      return plainText.length > 120 ? plainText.slice(0, 120) + "..." : plainText;
    }
    return "Rich text content overview goes here...";
  };

  return (
    <div
      className={cn(
        "group cursor-pointer flex flex-col justify-between rounded-[var(--radius-md)] border border-border bg-bg-surface p-4",
        "transition-all duration-[var(--transition-fast)]",
        "hover:border-border-hover hover:shadow-[var(--shadow-card)] hover:bg-bg-elevated/40",
        className
      )}
      role="button"
      tabIndex={0}
    >
      <div>
        <div className="mb-2 flex items-start justify-between">
          <Badge variant={doc.status === DocStatus.PUBLISHED ? "success" : "warning"}>
            {doc.status}
          </Badge>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-bg-elevated text-text-muted">
            {doc.format === "markdown" ? (
              <AlignLeft className="h-3.5 w-3.5" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
          </div>
        </div>

        <h4 className="mb-2 text-base font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
          {doc.title}
        </h4>

        <p className="mb-4 text-xs leading-relaxed text-text-secondary line-clamp-3">
          {extractExcerpt()}
        </p>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-bg-elevated border border-border/50 px-2 py-0.5 text-[10px] font-medium text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-text-muted">
          <span className="truncate">{doc.project} / {doc.topic}</span>
          <span className="shrink-0 pl-2 opacity-70">
            Updated {formatRelative(doc.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
