export default async function DocDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full flex-col animate-fade-in space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Document Details</h1>
        <p className="text-sm text-text-secondary mt-1">Viewing document ID: {resolvedParams.id}</p>
      </div>
      <div className="mt-6 p-6 rounded-[var(--radius-lg)] border border-border bg-bg-surface">
        <p className="text-text-muted">This page is a placeholder for Phase 2 implementation. The Tiptap rich-text editor will be rendered here.</p>
      </div>
    </div>
  );
}
