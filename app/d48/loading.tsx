// Shown while the page's Supabase read is in flight. The shape matches the
// table that replaces it, so the layout doesn't jump when the rows land.
export default function Loading() {
  return (
    <main className="min-h-screen px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-8" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading submissions…</span>
        <div className="h-10 w-64 animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="h-4 w-80 animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex h-12 items-center gap-4 border-b border-line">
              <div className="h-4 flex-1 animate-pulse bg-surface motion-reduce:animate-none" />
              <div className="h-4 w-24 animate-pulse bg-surface motion-reduce:animate-none" />
              <div className="h-4 w-28 animate-pulse bg-surface motion-reduce:animate-none" />
              <div className="h-5 w-20 animate-pulse bg-surface motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
