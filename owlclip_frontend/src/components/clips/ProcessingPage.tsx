'use client';

import { useState, useRef, useEffect } from 'react';

interface ProcessingPageProps {
  jobId: string;
  status?: string;
}

// Smooth ease-out curve: fast start, gentle deceleration.
// Capped at 98% so it never reads as "done".
function fakeProgress(elapsedMs: number, totalMs: number): number {
  const t = Math.min(elapsedMs / totalMs, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.min(eased * 98, 98);
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TOTAL_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const TICK_MS = 33; // ~30fps smooth animation

export function ProcessingPage({ jobId, status }: ProcessingPageProps) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsedMs = Date.now() - startTimeRef.current;
      setElapsed(elapsedMs);
      setProgress(fakeProgress(elapsedMs, TOTAL_DURATION_MS));
    };

    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const isRunningLong = elapsed > TOTAL_DURATION_MS;
  const remaining = Math.max(0, TOTAL_DURATION_MS - elapsed);
  const remainingLabel = isRunningLong
    ? 'A little longer than usual'
    : `~${formatTime(remaining)} remaining`;
  const statusText =
    status === 'pending'
      ? 'Queued and waiting to start...'
      : 'AI is turning your video into clips';

  const stageLabel = (() => {
    if (elapsed < 60_000) return 'Analyzing your video';
    if (elapsed < 180_000) return 'Generating highlight clips';
    if (elapsed < 360_000) return 'Refining and adding subtitles';
    return 'Almost there — finalizing your clips';
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Skeleton card grid behind the progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden border border-border/40"
              style={{ aspectRatio: '9/16', background: 'var(--muted)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/60 to-card" />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 30% 20%, #f97316 0%, transparent 50%), radial-gradient(circle at 70% 80%, #ef4444 0%, transparent 50%)',
                }}
              />
              <div className="absolute top-3 left-3 z-10 w-6 h-6 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                <span className="text-white/80 text-[10px] font-bold">{i + 1}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="h-2.5 bg-white/10 rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main card with spinner + progress */}
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
            <svg
              className="w-6 h-6 text-orange-500 animate-spin"
              style={{ animationDuration: '1.8s' }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-foreground mb-1.5 tracking-tight">
            Processing your video
          </h1>
          <p className="text-muted-foreground text-sm">{statusText}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              {stageLabel}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            </span>
            <span className="text-sm font-mono text-orange-400 font-bold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f97316, #ef4444)',
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-xs text-muted-foreground/60 font-mono">
              {formatTime(elapsed)} elapsed
            </span>
            <span className="text-xs text-muted-foreground/60 font-mono">
              {remainingLabel}
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-card/50 border border-border/50 rounded-xl p-3.5">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-foreground font-medium mb-0.5">
                This usually takes 3–5 minutes
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We&apos;re analyzing your video, extracting the best moments, and generating subtitles.
                Your clips will be ready soon.
              </p>
            </div>
          </div>
        </div>

        {/* Job ID chip */}
        <div className="text-center mt-4">
          <span className="inline-block px-3 py-1 bg-muted/50 rounded-full text-[11px] font-mono text-muted-foreground/50">
            job::{jobId.slice(0, 8)}
          </span>
        </div>

        {isRunningLong && (
          <p className="text-center text-xs text-muted-foreground/40 mt-3">
            Taking longer than usual — this can happen with longer videos
          </p>
        )}
      </div>
    </div>
  );
}
