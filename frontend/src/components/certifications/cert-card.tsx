import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Certification, CertStatus } from "@/lib/types";
import { cn, daysUntil, formatDate, getCertStatusColor, getCertStatusBorder } from "@/lib/utils";
import { Award, Calendar, AlertTriangle, FileText } from "lucide-react";

interface CertCardProps {
  certification: Certification;
  className?: string;
  onClick?: () => void;
}

export function CertCard({ certification, className, onClick }: CertCardProps) {
  const isExpired = certification.status === CertStatus.EXPIRED;
  const isExpiringSoon = certification.status === CertStatus.EXPIRING_SOON;
  
  // Calculate progress based on issue date and expiry date
  let progress = 0;
  let remainingDays = 0;
  
  if (certification.expiryDate) {
    const issueTime = new Date(certification.issuedDate).getTime();
    const expiryTime = new Date(certification.expiryDate).getTime();
    const nowTime = new Date().getTime();
    
    if (nowTime > expiryTime) {
      progress = 100;
    } else {
      const totalDuration = expiryTime - issueTime;
      const elapsed = nowTime - issueTime;
      progress = Math.max(0, Math.min(100, Math.round((elapsed / totalDuration) * 100)));
    }
    
    remainingDays = daysUntil(certification.expiryDate);
  }

  // Determine variant for the progress bar and overall card
  const variant = isExpired ? "danger" : isExpiringSoon ? "warning" : "success";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-md)]",
        "border bg-bg-surface p-4 transition-all duration-[var(--transition-base)]",
        "hover:shadow-[var(--shadow-card)] hover:bg-bg-elevated/40 text-left",
        getCertStatusBorder(certification.status),
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Subtle background glow based on status */}
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10"
        style={{
          backgroundColor:
            variant === "danger"
              ? "rgba(239, 68, 68, 1)"
              : variant === "warning"
                ? "rgba(245, 158, 11, 1)"
                : "rgba(34, 197, 94, 1)",
        }}
      />

      <div className="relative z-10 block">
        <div className="mb-3 flex items-start justify-between">
          <Badge variant={variant} dot>
            {certification.status.replace("_", " ")}
          </Badge>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]",
              isExpired
                ? "bg-danger/10 text-danger"
                : isExpiringSoon
                  ? "bg-warning/10 text-warning"
                  : "bg-success/10 text-success"
            )}
          >
            <Award className="h-4.5 w-4.5" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="mb-1.5 text-base font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
          {certification.name}
        </h3>
        
        <p className="mb-4 text-sm font-medium text-text-secondary truncate">
          {certification.issuer}
        </p>

        {certification.expiryDate ? (
          <div className="mb-4 space-y-2">
            <div className="flex items-end justify-between text-xs font-medium">
              <span className={cn(isExpired || isExpiringSoon ? `text-${variant}` : "text-text-secondary")}>
                {isExpired ? "Expired" : `${remainingDays} days left`}
              </span>
              <span className="text-text-muted">{progress}% elapsed</span>
            </div>
            <ProgressBar value={progress} variant={variant} size="sm" />
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-bg-elevated px-3 py-2 text-xs font-medium text-text-muted">
            <Award className="h-3.5 w-3.5" />
            Lifetime Certification (No Expiry)
          </div>
        )}

        <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-[11px] font-medium text-text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 opacity-60" />
            <span>Issued: {formatDate(certification.issuedDate)}</span>
          </div>
          {certification.expiryDate && (
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn("h-3 w-3", isExpired || isExpiringSoon ? `text-${variant}` : "opacity-60")} />
              <span>Expires: {formatDate(certification.expiryDate)}</span>
            </div>
          )}
          {certification.certFilePath && (
            <div className="flex items-center gap-2 text-text-secondary mt-1">
              <FileText className="h-3 w-3 opacity-60" />
              <span>Certificate file attached</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
