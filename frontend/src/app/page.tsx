import {
  CircleDot,
  FileText,
  Award,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getRecentIssues,
  getRecentDocs,
  getExpiringCerts,
} from "@/lib/api";
import {
  formatRelative,
  getIssueStatusColor,
  getPriorityColor,
  getIssueStatusLabel,
  getCertStatusColor,
  daysUntil,
  cn,
} from "@/lib/utils";
import { CertStatus } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentIssues = getRecentIssues(5);
  const recentDocs = getRecentDocs(4);
  const expiringCerts = getExpiringCerts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cert alert banner */}
      {expiringCerts.length > 0 && (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-warning/20 bg-warning/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" strokeWidth={2} />
          <p className="text-sm text-warning">
            <span className="font-medium">{expiringCerts.length} certification{expiringCerts.length > 1 ? "s" : ""}</span>
            {" "}need{expiringCerts.length === 1 ? "s" : ""} attention —{" "}
            {expiringCerts
              .filter((c) => c.status === CertStatus.EXPIRING_SOON)
              .map((c) => c.name)
              .join(", ") || "expired certs to renew"}
          </p>
          <Link
            href="/certifications"
            className="ml-auto shrink-0 text-xs font-medium text-warning hover:text-warning/80 transition-colors"
          >
            View all →
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Issues"
          value={stats.totalIssues}
          icon={CircleDot}
          trend={{ value: "+3 this week", positive: true }}
          className="stagger-1 animate-fade-in"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={TrendingUp}
          accentColor="text-info"
          className="stagger-2 animate-fade-in"
        />
        <StatCard
          label="Documents"
          value={stats.totalDocs}
          icon={FileText}
          accentColor="text-success"
          className="stagger-3 animate-fade-in"
        />
        <StatCard
          label="Certs Expiring"
          value={stats.expiringCerts}
          icon={Award}
          accentColor={stats.expiringCerts > 0 ? "text-warning" : "text-success"}
          className="stagger-4 animate-fade-in"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Issues Feed - takes 2 cols */}
        <div className="lg:col-span-2 rounded-[var(--radius-lg)] border border-border bg-bg-surface p-5 stagger-5 animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Active Issues</h2>
            <Link
              href="/issues"
              className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-accent transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentIssues.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-bg-hover"
              >
                <span className="shrink-0 font-mono text-xs text-text-muted">
                  {issue.issueKey}
                </span>
                <span className="flex-1 truncate text-sm text-text-primary group-hover:text-accent transition-colors">
                  {issue.title}
                </span>
                <Badge
                  variant={
                    issue.priority === "CRITICAL"
                      ? "danger"
                      : issue.priority === "HIGH"
                        ? "warning"
                        : issue.priority === "MEDIUM"
                          ? "info"
                          : "muted"
                  }
                  dot
                >
                  {issue.priority}
                </Badge>
                <Badge
                  variant={
                    issue.status === "DONE"
                      ? "success"
                      : issue.status === "IN_PROGRESS"
                        ? "accent"
                        : issue.status === "IN_REVIEW"
                          ? "warning"
                          : "default"
                  }
                >
                  {getIssueStatusLabel(issue.status)}
                </Badge>
                <span className="hidden shrink-0 text-xs text-text-muted sm:block">
                  {formatRelative(issue.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Docs */}
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-surface p-5 stagger-6 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary">Recent Docs</h2>
              <Link
                href="/docs"
                className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-accent transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-1">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/docs/${doc.id}`}
                  className="group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 transition-colors hover:bg-bg-hover"
                >
                  <FileText
                    className="h-4 w-4 shrink-0 text-text-muted group-hover:text-accent transition-colors"
                    strokeWidth={1.5}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-text-primary group-hover:text-accent transition-colors">
                      {doc.title}
                    </p>
                    <p className="text-xs text-text-muted">
                      {doc.project} • {formatRelative(doc.updatedAt)}
                    </p>
                  </div>
                  <Badge
                    variant={doc.status === "PUBLISHED" ? "success" : "warning"}
                  >
                    {doc.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Cert Status */}
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-surface p-5 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary">Cert Status</h2>
              <Link
                href="/certifications"
                className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-accent transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {expiringCerts.length === 0 ? (
                <p className="text-sm text-text-muted py-4 text-center">All certifications are active ✓</p>
              ) : (
                expiringCerts.map((cert) => (
                  <Link
                    key={cert.id}
                    href={`/certifications/${cert.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2.5 transition-colors hover:bg-bg-hover",
                      cert.status === CertStatus.EXPIRED
                        ? "border-danger/20 bg-danger/5"
                        : "border-warning/20 bg-warning/5"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {cert.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        {cert.expiryDate
                          ? cert.status === CertStatus.EXPIRED
                            ? "Expired"
                            : `${daysUntil(cert.expiryDate)} days left`
                          : "No expiry"}
                      </div>
                    </div>
                    <Badge
                      variant={cert.status === CertStatus.EXPIRED ? "danger" : "warning"}
                      dot
                    >
                      {cert.status === CertStatus.EXPIRED ? "Expired" : "Expiring"}
                    </Badge>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
