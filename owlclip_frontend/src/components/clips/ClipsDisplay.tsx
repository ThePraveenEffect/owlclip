'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Volume2, X } from 'lucide-react';

function VideoModal({ clip, onClose }: { clip: any; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div
          className="relative bg-black rounded-2xl overflow-hidden border border-white/20"
          style={{ width: 'min(360px, 90vw)', aspectRatio: '9/16' }}
        >
          <video
            src={clip.url}
            className="w-full h-full object-cover"
            controls
            autoPlay
          />
        </div>

        <div className="mt-4 text-center max-w-xs">
          <p className="text-white font-bold text-lg">{clip.title}</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-white/50 text-sm">
              {Math.round(clip.end_time - clip.start_time)}s
            </span>
            <span className="flex items-center gap-1 text-orange-400 text-sm font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              {clip.viral_score}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipCard({ clip, index, onClick }: { clip: any; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const duration = Math.round(clip.end_time - clip.start_time);

  return (
    <div className="flex flex-col">
      <div
        className="relative rounded-2xl overflow-hidden border border-border cursor-pointer group transition-all duration-300 hover:border-orange-500/60 hover:shadow-xl hover:shadow-orange-500/20"
        style={{ aspectRatio: '9/16' }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-card" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, #f97316 0%, transparent 50%), radial-gradient(circle at 70% 80%, #ef4444 0%, transparent 50%)',
          }}
        />

        <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-orange-500/20 backdrop-blur-sm rounded-lg border border-orange-500/40">
          <TrendingUp className="w-3 h-3 text-orange-400" />
          <span className="text-orange-400 text-xs font-bold">{clip.viral_score}</span>
        </div>

        <div className="absolute bottom-20 left-3 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
          <span className="text-white/80 text-xs font-mono">{duration}s</span>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-70'}`}
        >
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full bg-orange-500/30 transition-all duration-500 ${hovered ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}
              style={{ filter: 'blur(8px)' }}
            />
            <div
              className={`relative w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 ${hovered ? 'scale-110 bg-orange-500/30 border-orange-400/50' : 'scale-100'}`}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-8">
          <p className="text-white text-sm font-bold leading-tight line-clamp-2">
            {clip.title}
          </p>
        </div>
      </div>

      {clip.subtitles && clip.subtitles.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-white/40 text-xs px-1">
          <Volume2 className="w-3 h-3" />
          <span>{clip.subtitles.length} subtitles</span>
        </div>
      )}
    </div>
  );
}

export function ClipsDisplay({ job, jobId }: any) {
  const [activeModal, setActiveModal] = useState<any>(null);
  const [selectedClip, setSelectedClip] = useState(0);
  const router = useRouter();

  if (!job?.clips || job.clips.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-muted border border-border mb-4">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <p className="text-foreground font-semibold mb-1">No clips generated</p>
          <p className="text-muted-foreground text-sm">This job didn&apos;t produce any clips.</p>
        </div>
      </div>
    );
  }

  const currentClip = job.clips[selectedClip];
  const clipCount = Math.min(job.clips.length, 2);

  function handleEdit() {
    router.push(`/clips/editor/${jobId}?clip=${currentClip.clip_num}`);
  }

  const renderSubtitles = () => {
    if (!currentClip.subtitles || currentClip.subtitles.length === 0) return null;
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Subtitles ({currentClip.subtitles.length})</span>
        </p>
        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
          {currentClip.subtitles.map((sub: any, i: number) => (
            <div key={i} className="flex gap-3 text-sm border-l-2 border-orange-500/20 pl-3 py-0.5">
              <span className="text-orange-400/70 text-xs font-mono shrink-0 mt-0.5">
                {sub.start.toFixed(1)}s
              </span>
              <span className="text-foreground/70 line-clamp-1">
                {sub.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {activeModal && (
        <VideoModal clip={activeModal} onClose={() => setActiveModal(null)} />
      )}

      <div className="min-h-screen bg-background py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-bold mb-1">Your Clips</h1>
            <p className="text-muted-foreground text-xs font-mono">Job: {job.job_id}</p>
          </div>

          <div
            className={`grid gap-5 mb-8 mx-auto`}
            style={{
              gridTemplateColumns: `repeat(${clipCount}, 1fr)`,
              maxWidth: clipCount === 2 ? '480px' : '240px',
            }}
          >
            {job.clips.slice(0, 2).map((clip: any, idx: number) => (
              <ClipCard
                key={idx}
                clip={clip}
                index={idx}
                onClick={() => setActiveModal(clip)}
              />
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
            {clipCount > 1 && (
              <div className="flex border-b border-border">
                {job.clips.slice(0, 2).map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedClip(idx)}
                    className={`flex-1 px-5 py-3.5 text-sm font-medium transition-all ${
                      selectedClip === idx
                        ? 'text-foreground border-b-2 border-orange-500 bg-white/[0.03]'
                        : 'text-muted-foreground hover:text-foreground/80'
                    }`}
                  >
                    Clip {idx + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-card-foreground text-lg font-bold mb-1 truncate">
                    {currentClip.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {currentClip.reasoning}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-orange-400 font-bold text-sm">
                      {currentClip.viral_score}/10
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs font-mono">
                    {Math.round(currentClip.end_time - currentClip.start_time)}s
                  </span>
                </div>
              </div>

              {renderSubtitles()}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal(currentClip)}
              className="px-5 py-2.5 bg-card hover:bg-muted text-foreground text-sm font-medium rounded-xl border border-border transition-colors"
            >
              Preview Clip {selectedClip + 1}
            </button>
            <button
              onClick={() => handleEdit()}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-colors shadow-lg shadow-orange-500/20"
            >
              Edit Clip {selectedClip + 1}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
