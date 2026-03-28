import { Certification, CertStatus } from "@/lib/types";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { cn, daysUntil } from "@/lib/utils";
import Link from "next/link";

interface CertAlertBannerProps {
  certs: Certification[];
  className?: string;
}

export function CertAlertBanner({ certs, className }: CertAlertBannerProps) {
  const expiringCerts = certs.filter(
    (c) => c.status === CertStatus.EXPIRING_SOON || c.status === CertStatus.EXPIRED
  );

  if (expiringCerts.length === 0) {
    return null;
  }

  // Find the most urgent cert
  const mostUrgent = [...expiringCerts].sort((a, b) => {
    if (a.status === CertStatus.EXPIRED && b.status !== CertStatus.EXPIRED) return -1;
    if (b.status === CertStatus.EXPIRED && a.status !== CertStatus.EXPIRED) return 1;
    
    // If both expired or both expiring soon, sort by expiry date
    if (a.expiryDate && b.expiryDate) {
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
    return 0;
  })[0];

  const daysLeft = mostUrgent.expiryDate ? daysUntil(mostUrgent.expiryDate) : 0;
  const isMostUrgentExpired = mostUrgent.status === CertStatus.EXPIRED;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-[var(--radius-lg)] border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between px-6",
        isMostUrgentExpired
          ? "border-danger/30 bg-danger/10"
          : "border-warning/30 bg-warning/10",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isMostUrgentExpired ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"
          )}
        >
          {isMostUrgentExpired ? (
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Clock className="h-5 w-5" strokeWidth={2} />
          )}
        </div>
        <div>
          <h3
            className={cn(
              "text-base font-semibold",
              isMostUrgentExpired ? "text-danger" : "text-warning"
            )}
          >
            Attention Required
          </h3>
          <p className="mt-1 text-sm text-text-primary font-medium">
            <strong className={isMostUrgentExpired ? "text-danger" : "text-warning"}>
              {mostUrgent.name}
            </strong>{" "}
            {isMostUrgentExpired
              ? "expired recently."
              : `expires in ${daysLeft} days.`}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {expiringCerts.length > 1 && (
              <span>And {expiringCerts.length - 1} other certification(s) need attention.</span>
            )}
            {" "}Please update their status or mark for renewal.
          </p>
        </div>
      </div>
      
      <div className="mt-2 shrink-0 sm:mt-0">
        <button
          className={cn(
            "flex h-9 items-center justify-center gap-2 rounded-[var(--radius-md)] px-4",
            "text-sm font-semibold text-white shadow-sm transition-colors",
            isMostUrgentExpired
              ? "bg-danger hover:bg-danger/90"
              : "bg-warning text-yellow-950 hover:bg-warning/90"
          )}
        >
          Take Action
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
