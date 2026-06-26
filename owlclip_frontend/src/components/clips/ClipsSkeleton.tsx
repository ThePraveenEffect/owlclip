export function ClipsSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-card rounded-3xl border border-border p-8 shadow-2xl overflow-hidden">
        {/* Top browser chrome */}
        <div className="relative flex items-center gap-3 mb-10 pb-6 border-b border-border/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="ml-6 flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 owlclip-shimmer" />
          </div>
        </div>

        {/* Clips skeleton grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="group relative">
              <div className="aspect-9/16 bg-muted rounded-3xl overflow-hidden border border-border/50 relative">
                <div className="absolute inset-0 owlclip-shimmer" />
              </div>
              <div className="mt-4 h-8 bg-muted/50 rounded overflow-hidden relative">
                <div className="absolute inset-0 owlclip-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .owlclip-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: owlclip-shimmer-move 1.6s ease-in-out infinite;
        }

        @keyframes owlclip-shimmer-move {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      </div>
    </div>
  );
}