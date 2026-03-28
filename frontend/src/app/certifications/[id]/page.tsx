export default async function CertificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full flex-col animate-fade-in space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Certification Details</h1>
        <p className="text-sm text-text-secondary mt-1">Viewing certification ID: {resolvedParams.id}</p>
      </div>
      <div className="mt-6 p-6 rounded-[var(--radius-lg)] border border-border bg-bg-surface">
        <p className="text-text-muted">This page is a placeholder for Phase 2 implementation. The full certification details, including PDF previews and renewal controls, will be loaded from the backend here.</p>
      </div>
    </div>
  );
}
