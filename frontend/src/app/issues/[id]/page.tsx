export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full flex-col animate-fade-in space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Issue Details</h1>
        <p className="text-sm text-text-secondary mt-1">Viewing details for issue ID: {resolvedParams.id}</p>
      </div>
      <div className="mt-6 p-6 rounded-[var(--radius-lg)] border border-border bg-bg-surface">
        <p className="text-text-muted">This page is a placeholder for Phase 2 implementation. The full issue view and editing capabilities will be connected when the backend REST API is available.</p>
      </div>
    </div>
  );
}
