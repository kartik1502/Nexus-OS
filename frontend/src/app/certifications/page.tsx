"use client";

import { useState } from "react";
import { getCertifications } from "@/lib/api";
import { CertStatus } from "@/lib/types";
import { CertCard } from "@/components/certifications/cert-card";
import { CertAlertBanner } from "@/components/certifications/cert-alert-banner";
import { SearchInput } from "@/components/ui/search-input";
import { Award, GraduationCap, LayoutGrid, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CertificationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CertStatus | "ALL">("ALL");
  
  const allCerts = getCertifications();

  const filteredCerts = allCerts.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(search.toLowerCase()) || 
                          cert.issuer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || cert.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const activeCount = allCerts.filter((c) => c.status === CertStatus.ACTIVE).length;
  const expiringCount = allCerts.filter((c) => c.status === CertStatus.EXPIRING_SOON).length;
  const expiredCount = allCerts.filter((c) => c.status === CertStatus.EXPIRED).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-accent" />
            Certifications
          </h1>
          <p className="text-sm text-text-secondary mt-1">Track your professional credentials and expiry dates.</p>
        </div>
        
        <button className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
          <Award className="h-4 w-4" />
          Add Certification
        </button>
      </div>

      {/* Alert Banner for expiring/expired certs */}
      <div className="shrink-0 animate-fade-in stagger-1">
        <CertAlertBanner certs={allCerts} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-lg)] border border-border bg-bg-surface p-4 animate-fade-in stagger-2">
        <div className="flex flex-wrap items-center gap-2 border-b sm:border-b-0 border-border/50 pb-3 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === "ALL" 
                ? "bg-bg-elevated text-text-primary" 
                : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            All ({allCerts.length})
          </button>
          
          <button
            onClick={() => setFilter(CertStatus.ACTIVE)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === CertStatus.ACTIVE 
                ? "bg-success/20 text-success" 
                : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            )}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Active ({activeCount})
          </button>
          
          <button
            onClick={() => setFilter(CertStatus.EXPIRING_SOON)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === CertStatus.EXPIRING_SOON 
                ? "bg-warning/20 text-warning" 
                : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-warning" />
            Expiring Soon ({expiringCount})
          </button>

          <button
            onClick={() => setFilter(CertStatus.EXPIRED)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === CertStatus.EXPIRED 
                ? "bg-danger/20 text-danger" 
                : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-danger" />
            Expired ({expiredCount})
          </button>
        </div>

        <SearchInput
          placeholder="Search by name or issuer..."
          value={search}
          onChange={setSearch}
          className="w-full sm:max-w-xs"
        />
      </div>

      {/* Grid */}
      {filteredCerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-border bg-bg-surface py-20 text-center animate-fade-in stagger-3">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-elevated">
            <Award className="h-7 w-7 text-text-muted" strokeWidth={1.5} />
          </div>
          <h3 className="mb-1.5 text-base font-medium text-text-primary">No certifications found</h3>
          <p className="max-w-sm text-sm text-text-secondary">
            Try adjusting your search or filter to see the results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-6">
          {filteredCerts.map((cert, i) => (
            <div key={cert.id} className={cn("animate-fade-in", `stagger-${(i % 6) + 1}`)}>
              <CertCard certification={cert} className="h-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
