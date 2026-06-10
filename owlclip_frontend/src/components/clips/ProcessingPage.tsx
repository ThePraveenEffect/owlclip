'use client';

import { useEffect, useState, useRef } from 'react';

interface ProcessingPageProps {
  jobId: string;
  status?: string;
}

const STAGES = [
  { label: 'Downloading video...', threshold: 15 },
  { label: 'Extracting audio...', threshold: 30 },
  { label: 'Transcribing speech...', threshold: 50 },
  { label: 'Analyzing viral moments...', threshold: 70 },
  { label: 'Generating clips...', threshold: 85 },
  { label: 'Burning subtitles...', threshold: 95 },
  { label: 'Finalizing...', threshold: 99 },
];

export function ProcessingPage({ jobId, status }: ProcessingPageProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Dummy progress: slow ramp to 95%, then crawl to 99%
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        let next: number;
        if (prev < 30) {
          // Slow start: 0.8-1.5% per tick
          next = prev + (0.8 + Math.random() * 0.7);
        } else if (prev < 60) {
          // Steady: 0.5-1.2% per tick
          next = prev + (0.5 + Math.random() * 0.7);
        } else if (prev < 85) {
          // Slowing down: 0.3-0.8% per tick
          next = prev + (0.3 + Math.random() * 0.5);
        } else if (prev < 95) {
          // Very slow: 0.1-0.4% per tick
          next = prev + (0.1 + Math.random() * 0.3);
        } else if (prev < 99) {
          // Crawling: 0.05-0.15% per tick
          next = prev + (0.05 + Math.random() * 0.1);
        } else {
          // Stuck at 99
          return 99;
        }
        return Math.min(next, 99);
      });
    }, 400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update stage label based on progress
  useEffect(() => {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (progress >= STAGES[i].threshold) {
        setStageIndex(i);
        break;
      }
    }
  }, [progress]);

  const currentStage = STAGES[stageIndex];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
            <svg
              className="w-8 h-8 text-orange-500 animate-spin"
              style={{ animationDuration: '3s' }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Processing Your Video
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Job: {jobId.slice(0, 8)}...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {currentStage.label}
            </span>
            <span className="text-sm font-mono text-orange-400 font-bold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f97316, #ef4444)',
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Skeleton cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2].map((i) => (
            <div key={i} className="relative">
              <div
                className="aspect-9/16 rounded-2xl border border-border/50 overflow-hidden"
                style={{ background: 'var(--muted)' }}
              >
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/50 to-muted" />
                {/* Fake play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 animate-pulse" />
                </div>
                {/* Fake bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="h-3 bg-white/10 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-2 bg-white/5 rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="mt-3 h-4 bg-muted/50 rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground/60">
            {status === 'pending'
              ? 'Waiting in queue...'
              : 'This usually takes 1-3 minutes'}
          </p>
        </div>

        {/* Inline keyframes for shimmer */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
