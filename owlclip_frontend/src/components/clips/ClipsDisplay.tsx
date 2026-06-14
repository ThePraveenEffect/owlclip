'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Volume2, RotateCcw, X } from 'lucide-react';
import { ClipEditor } from '@/components/clips/ClipEditor';

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
            backgroundImage: `radial-gradient(circle at 30% 20%, #f97316 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, #ef4444 0%, transparent 50%)`,
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
          className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-300 ${
            hovered ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full bg-orange-500/30 transition-all duration-500 ${
                hovered ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
              }`}
              style={{ filter: 'blur(8px)' }}
            />
            <div
              className={`relative w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 ${
                hovered ? 'scale-110 bg-orange-500/30 border-orange-400/50' : 'scale-100'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-7 h-7 ml-1"
              >
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

      {clip.subtitles?.length > 0 && (
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
  const [editingClip, setEditingClip] = useState<any>(null);
  const [selectedClip, setSelectedClip] = useState(0);


  const router = useRouter();

  if (!job?.clips || job.clips.length === 0) {
    return <div className="text-foreground p-8">No clips found</div>;
  }

  const currentClip = job.clips[selectedClip];

  console.log('Current Clip:', currentClip.clip_num);


  function handleEdit() {
    router.push(`/clips/editor/${jobId}?clip=${currentClip.clip_num}`);
  }


  return (
    <>
      {activeModal && (
        <VideoModal clip={activeModal} onClose={() => setActiveModal(null)} />
      )}

      <div className="min-h-screen bg-background py-10">
        <div className="max-w-5xl mx-auto px-4">

          <div className="mb-10">
            <h1 className="text-foreground text-3xl font-bold mb-1">Your Clips</h1>
            <p className="text-muted-foreground text-sm font-mono">Job ID: {job.job_id}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
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
            <div className="flex border-b border-border">
              {job.clips.slice(0, 2).map((clip: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedClip(idx)}
                  className={`flex-1 px-5 py-4 text-sm font-semibold transition-all ${
                    selectedClip === idx
                      ? 'text-foreground border-b-2 border-orange-500 bg-white/5'
                      : 'text-muted-foreground hover:text-foreground/70'
                  }`}
                >
                  Clip {idx + 1}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-card-foreground text-xl font-bold mb-2">{currentClip.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{currentClip.reasoning}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/15 rounded-xl border border-orange-500/40">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-bold text-lg">{currentClip.viral_score}/10</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <RotateCcw className="w-3 h-3" />
                    <span>{Math.round(currentClip.end_time - currentClip.start_time)}s</span>
                  </div>
                </div>
              </div>

              {currentClip.subtitles?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                    Subtitles ({currentClip.subtitles.length})
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {currentClip.subtitles.map((sub: any, i: number) => (
                      <div key={i} className="flex gap-3 text-sm border-l-2 border-orange-500/20 pl-3 py-0.5">
                        <span className="text-orange-400/70 text-xs font-mono shrink-0 mt-0.5">
                          {sub.start.toFixed(1)}s
                        </span>
                        <span className="text-foreground/70">{sub.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveModal(currentClip)}
              className="px-6 py-3 bg-card hover:bg-muted text-foreground font-semibold rounded-xl border border-border transition-all hover:scale-105"
            >
              ▶ Preview Clip   {selectedClip + 1}
            </button>


              <button
                onClick={() => handleEdit()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                ✏️ Edit Clip {selectedClip + 1}
              </button>

          </div>

          {/* {editingClip && (
            <div className="mt-8">
              <ClipEditor />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
