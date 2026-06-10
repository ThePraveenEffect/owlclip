export function ClipsSkeleton() {
  return (
    <div className="mt-16 relative max-w-4xl mx-auto">
      <div className="relative bg-card rounded-3xl border border-border p-8 shadow-2xl overflow-hidden">
        
        {/* Top browser chrome */}
        <div className="relative flex items-center gap-3 mb-10 pb-6 border-b border-border/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse"></div>
          </div>
          <div className="ml-6 flex-1 h-8 bg-muted rounded-lg animate-pulse"></div>
        </div>

        {/* Clips skeleton grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="group relative">
              <div className="aspect-9/16 bg-muted rounded-3xl overflow-hidden border border-border/50 animate-pulse"></div>
              <div className="mt-4 h-8 bg-muted/50 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
