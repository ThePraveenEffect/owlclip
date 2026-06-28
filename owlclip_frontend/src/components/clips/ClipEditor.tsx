"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Type, Play, Pause, CheckCircle2 } from "lucide-react";
import {
  SUBTITLE_PRESETS,
  presetToTextStyle,
  getSubtitlePositionStyles,
  type SubtitlePreset,
} from "@/constants/subtitle-presets";
import type { Clip } from "@/types/clip";
import { apiClient } from "@/lib/api/client";

type SidebarPanel = "none" | "subtitles" | "music";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Subtitles from backend are already clip-relative.
// If they start far from zero we shift them so the first word starts at 0.
function getPlaybackSubtitles(clip: Clip) {
  const raw = clip.subtitles || [];
  if (raw.length === 0) return [];
  const firstStart = Number(raw[0].start);
  if (firstStart < 0.5) {
    return raw.map((s) => ({ ...s, start: Number(s.start), end: Number(s.end) }));
  }
  return raw.map((s) => ({
    ...s,
    start: Number(s.start) - firstStart,
    end: Number(s.end) - firstStart,
  }));
}

// ─── Subtitle Overlay Component ──────────────────────────────────────────────
// NO backgrounds — clean floating text over video.
// Positioning is driven by POSITION_MAP in subtitle-presets.ts

function SubtitleOverlay({
  subtitle,
  presetKey,
  currentTime,
}: {
  subtitle: { text: string; start: number; end: number };
  presetKey: string;
  currentTime: number;
}) {
  const preset = SUBTITLE_PRESETS[presetKey];
  const textStyle = presetToTextStyle(presetKey);
  const isWordByWord = preset?.wordByWord === true;

  const words = useMemo(() => subtitle.text.split(/\s+/), [subtitle.text]);
  const subDuration = subtitle.end - subtitle.start;
  const elapsed = currentTime - subtitle.start;

  // Progress through this subtitle: 0 → 1
  const progress = useMemo(() => {
    if (subDuration <= 0) return 1;
    return Math.max(0, Math.min(1, elapsed / subDuration));
  }, [elapsed, subDuration]);

  // For word-by-word: how many words are fully highlighted
  const highlightCount = isWordByWord ? Math.round(progress * words.length) : 0;

  // Current word fractional highlight (0-1 within the word)
  const currentWordProgress = isWordByWord
    ? Math.max(0, Math.min(1, progress * words.length - Math.floor(progress * words.length)))
    : 0;

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    maxWidth: '90%',
    textAlign: 'center' as const,
    paddingBottom: '4px',
    // Optional backdrop pill (used by neon, typewriter, etc.)
    backgroundColor: preset.backgroundColor || undefined,
    padding: preset.padding || undefined,
    borderRadius: preset.borderRadius || undefined,
    // text-rendering for crisp rendering over video
    WebkitFontSmoothing: 'antialiased' as const,
    textRendering: 'optimizeLegibility' as const,
    ...textStyle,
  };

  const baseWordStyle: React.CSSProperties = {
    display: 'inline',
    transition: isWordByWord ? 'color 0.08s ease, text-shadow 0.08s ease, opacity 0.15s ease' : undefined,
  };

  // Per-word stagger delay for entrance animation
  const getAnimationDelay = useCallback(
    (wordIndex: number): React.CSSProperties => {
      if (!preset?.wordAnimation || preset.wordAnimation === 'none') return {};
      const stagger = wordIndex * 0.04;
      return {
        animationDelay: `${stagger}s`,
        animationFillMode: 'both' as const,
      };
    },
    [preset?.wordAnimation]
  );

  const wordAnimationName =
    preset?.wordAnimation && preset.wordAnimation !== 'none'
      ? `subtitleWord${
          preset.wordAnimation.charAt(0).toUpperCase() + preset.wordAnimation.slice(1)
        }`
      : undefined;

  const karaokeFill = () => preset.karaokeColor || '#f97316';

  return (
    <div className="subtitle-container" style={containerStyle}>
      {words.map((word, i) => {
        const animationStyles: React.CSSProperties = {
          ...getAnimationDelay(i),
          animation: wordAnimationName
            ? `${wordAnimationName} 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both`
            : undefined,
        };

        // ── Word-by-word highlight mode ──
        if (isWordByWord) {
          const kc = karaokeFill();
          if (i < highlightCount) {
            // Fully highlighted word — active color + glow
            return (
              <span
                key={i}
                style={{
                  ...baseWordStyle,
                  ...animationStyles,
                  color: kc,
                  textShadow: preset.karaokeGlow || 'none',
                }}
              >{word} </span>
            );
          }
          if (i === highlightCount && highlightCount < words.length) {
            // Partially highlighted — gradient clip for smooth fill
            const pct = Math.round(currentWordProgress * 100);
            return (
              <span
                key={i}
                style={{
                  ...baseWordStyle,
                  ...animationStyles,
                  background: `linear-gradient(90deg, ${kc} ${pct}%, ${preset.textColor} ${pct}%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                }}
              >{word} </span>
            );
          }
          // Not yet highlighted — dimmed, waiting
          return (
            <span
              key={i}
              style={{
                ...baseWordStyle,
                color: preset.textColor,
                textShadow: textStyle.textShadow || 'none',
                opacity: 0.45,
              }}
            >{word} </span>
          );
        }

        // ── Normal mode — all words uniform ──
        return (
          <span
            key={i}
            style={{
              ...baseWordStyle,
              ...animationStyles,
              color: textStyle.color,
              textShadow: textStyle.textShadow || 'none',
              WebkitTextStroke: textStyle.WebkitTextStroke,
            }}
          >{word} </span>
        );
      })}
    </div>
  );
}

// ─── Subtitle Panel ───────────────────────────────────────────────────────────

function SubtitlePanel({
  subtitles,
  selectedPreset,
  onSelectPreset,
}: {
  subtitles: { text: string; start: number; end: number }[];
  selectedPreset: string;
  onSelectPreset: (key: string) => void;
}) {
  const presetKeys = Object.keys(SUBTITLE_PRESETS);

  return (
    <div className="flex flex-col h-full">
      {/* Preset Grid */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Subtitle Style
        </p>
        <div className="grid grid-cols-3 gap-2">
          {presetKeys.map((key) => {
            const p = SUBTITLE_PRESETS[key];
            const isSelected = selectedPreset === key;
            const previewStyle = presetToTextStyle(key);
            return (
              <button
                key={key}
                onClick={() => onSelectPreset(key)}
                className={`relative rounded-xl border-2 p-2 text-center transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-border bg-card hover:border-border hover:bg-muted/50"
                }`}
              >
                <div className="min-h-[32px] flex items-center justify-center rounded-lg bg-black/70 mb-1.5 px-1.5 py-1 overflow-hidden">
                  {p.wordByWord ? (
                    <span
                      style={{
                        ...previewStyle,
                        fontSize: `${Math.min(p.fontSize, 14)}px`,
                        letterSpacing: p.letterSpacing
                          ? `${Math.min(p.letterSpacing, 1)}px`
                          : undefined,
                      }}
                      className="leading-tight max-w-full"
                    >
                      <span style={{ color: p.karaokeColor || '#fb923c' }}>
                        {p.textTransform === 'uppercase' ? 'SAMP' : 'Samp'}
                      </span>
                      <span style={{ opacity: 0.4 }}>
                        {p.textTransform === 'uppercase' ? 'LE' : 'le'}
                      </span>
                    </span>
                  ) : (
                    <span
                      style={{
                        ...previewStyle,
                        fontSize: `${Math.min(p.fontSize, 18)}px`,
                        letterSpacing: p.letterSpacing
                          ? `${Math.min(p.letterSpacing, 1)}px`
                          : undefined,
                      }}
                      className="leading-tight truncate max-w-full"
                    >
                      {p.textTransform === 'uppercase' ? 'SAMPLE' : 'Sample'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p
                    className={`text-[10px] font-semibold ${
                      isSelected ? 'text-orange-400' : 'text-card-foreground'
                    }`}
                  >
                    {p.name}
                  </p>
                  {p.wordByWord && (
                    <span className="text-[8px] font-bold text-cyan-400 bg-cyan-400/10 px-1 py-0 rounded">
                      WxW
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtitles List */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Subtitles ({subtitles.length})
        </p>

        {subtitles.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No subtitles for this clip.
          </p>
        ) : (
          <div className="space-y-2">
            {subtitles.map((sub, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card/50 p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                    {sub.start.toFixed(1)}s – {sub.end.toFixed(1)}s
                  </span>
                  <p className="text-sm text-foreground leading-snug">
                    {sub.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Music Panel ──────────────────────────────────────────────────────────────

function MusicPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const mockTracks = [
    { id: 1, name: "Upbeat Energy", artist: "Trending Sounds", duration: "2:34" },
    { id: 2, name: "Chill Vibes", artist: "Lo-Fi Beats", duration: "3:12" },
    { id: 3, name: "Epic Motivation", artist: "Cinematic", duration: "1:58" },
    { id: 4, name: "Pop Trending", artist: "Viral Audio", duration: "0:45" },
    { id: 5, name: "Dramatic Reveal", artist: "Sound FX", duration: "0:15" },
    { id: 6, name: "Smooth Transition", artist: "DJ Mix", duration: "0:30" },
  ];

  const filteredTracks = mockTracks.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Background Music
        </p>
        <input
          type="text"
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filteredTracks.length === 0 ? (
          <p className="text-sm text-muted-foreground italic p-2">
            No tracks found.
          </p>
        ) : (
          filteredTracks.map((track) => (
            <TrackItem key={track.id} track={track} />
          ))
        )}
      </div>
    </div>
  );
}

function TrackItem({
  track,
}: {
  track: { id: number; name: string; artist: string; duration: string };
}) {
  const [playing, setPlaying] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-2.5 transition-all ${
        added
          ? "border border-orange-500/40 bg-orange-500/10"
          : "border border-transparent hover:border-border hover:bg-muted/50"
      }`}
    >
      <button
        onClick={() => setPlaying(!playing)}
        className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 hover:bg-orange-500/30 transition-colors"
      >
        {playing ? (
          <Pause className="w-3.5 h-3.5 text-orange-400" />
        ) : (
          <Play className="w-3.5 h-3.5 text-orange-400 ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {track.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {track.artist} · {track.duration}
        </p>
      </div>

      <button
        onClick={() => setAdded(!added)}
        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
          added
            ? "bg-orange-500 text-white"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        {added ? "Added" : "Add"}
      </button>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

  export function ClipEditor({ clip, jobId }: { clip: Clip; jobId: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePanel, setActivePanel] = useState<SidebarPanel>("none");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string>("clean");
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
const [progress, setProgress] = useState(0);
const [progressMessage, setProgressMessage] = useState("Preparing...");
const progressInterval = useRef<NodeJS.Timeout | null>(null);
const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
const [confirmClose, setConfirmClose] = useState(false);



  const togglePanel = useCallback((panel: SidebarPanel) => {
    setActivePanel((prev) => (prev === panel ? "none" : panel));
  }, []);

  // Poll video time via rAF
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const video = videoRef.current;
      if (video) {
        setCurrentTime(video.currentTime);
        setIsPlaying(!video.paused && !video.ended);
        if (video.duration && !isNaN(video.duration)) {
          setVideoDuration(video.duration);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);



useEffect(() => {
  if (!exporting) return;

  setProgress(0);

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return prev;
      return prev + Math.random() * 10;
    });
  }, 400);

  return () => clearInterval(interval);
}, [exporting]);



  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const t = parseFloat(e.target.value);
    video.currentTime = t;
    setCurrentTime(t);
  }, []);

  const subtitles = useMemo(
    () => getPlaybackSubtitles(clip),
    [clip]
  );

  // Find active subtitle
  const activeSubtitle = subtitles.find((sub) => {
    const start = Number(sub.start);
    const end = Number(sub.end);
    return currentTime >= start && currentTime <= end;
  });


const PROGRESS_STAGES = [
  {
    target: 20,
    duration: 4000,
    message: "Preparing video...",
  },
  {
    target: 45,
    duration: 7000,
    message: "Rendering subtitles...",
  },
  {
    target: 70,
    duration: 12000,
    message: "Encoding video...",
  },
  {
    target: 85,
    duration: 14000,
    message: "Optimizing quality...",
  },
  {
    target: 92,
    duration: 10000,
    message: "Uploading export...",
  },
  {
    target: 95,
    duration: 12000,
    message: "Generating download...",
  },
  {
    target: 98,
    duration: 30000,
    message: "Finalizing...",
  },
];

const startFakeProgress = () => {
  if (progressInterval.current) {
    clearInterval(progressInterval.current);
  }

  setProgress(0);

  let currentStage = 0;

  const runStage = () => {
    if (currentStage >= PROGRESS_STAGES.length) return;

    const stage = PROGRESS_STAGES[currentStage];

    setProgressMessage(stage.message);

    const start = progress;
    const end = stage.target;

    const totalSteps = 60;
    const increment = (end - start) / totalSteps;
    const intervalTime = stage.duration / totalSteps;

    let current = start;

    progressInterval.current = setInterval(() => {
      current += increment;

      if (current >= end) {
        setProgress(end);

        clearInterval(progressInterval.current!);

        currentStage++;

        runStage();

        return;
      }

      setProgress(Math.round(current));
    }, intervalTime);
  };

  runStage();
};

const finishProgress = () => {
  if (progressInterval.current) {
    clearInterval(progressInterval.current);
  }

  setProgressMessage("Export complete!");

  setProgress(100);
};





  //  console.log(clip)
   
    const handleExport = async () => {
      setExporting(true);
startFakeProgress();
      const video = videoRef.current;
      if (!video) return;

      // ── Build the exact payload shape the backend expects ──────────────
      // POST /api/v1/clips/{job_id}/export  body = ExportClipPayload[]
      const exportPayload = {
        clip_num: clip.clip_num,
        title: clip.title,
        url: clip.url,
        viral_score: clip.viral_score,
        reasoning: clip.reasoning,
        start_time: clip.start_time,
        end_time: clip.end_time,
        subtitles: subtitles.map((s) => ({
          text: s.text,
          start: Number(s.start),
          end: Number(s.end),
        })),
        subtitlePreset: selectedPreset,
      };

      // Pause video during export so the user knows something is happening
      const wasPlaying = !video.paused;
      video.pause();
      setIsPlaying(false);

      // Show loading state on the Export button
      setExporting(true);
      setExportMessage(null);

      try {
        const result = await apiClient(`/v1/clips/${jobId}/export`, {
          method: "POST",
          body: JSON.stringify([exportPayload]),
        });
        finishProgress();
        console.log("Full API Response:", result);

// 3. Access the property based on the log
console.log("URL:", result.url);  
        console.log(result.url);

setDownloadUrl(result.url);

setTimeout(() => {
    setExporting(false);
}, 700);
      } catch (error: any) {
        console.error("Export failed:", error);
        setExportMessage({
          type: "error",
          text: error?.message || "Export failed. Please try again.",
        });
      } finally {
        setExporting(false);

        if (progressInterval.current) {
    clearInterval(progressInterval.current);
}
        if (wasPlaying) {
          video.play().catch(() => {});
          setIsPlaying(true);
        }
        // Auto-dismiss success message after 6s
        setTimeout(() => setExportMessage(null), 6000);
      }
    };



  return (
    <div className="h-screen bg-background p-4">
      <div className="h-full rounded-3xl border border-border bg-card flex flex-col">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono">
              {formatTime(clip.start_time || 0)} – {formatTime(clip.end_time || 0)}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {clip.title}
            </span>
          </div>


{exporting && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">

    <div className="w-[420px] rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">

      <div className="flex justify-center mb-6">

        <div className="relative">

          <div className="w-14 h-14 rounded-full border-4 border-zinc-700"></div>

          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

        </div>

      </div>

      <h2 className="text-center text-xl font-semibold text-white">
        Exporting Clip
      </h2>

      <p className="text-center text-zinc-400 mt-2">
        {progressMessage}
      </p>

      <div className="mt-8">

        <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">

          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="flex justify-between mt-2">

          <span className="text-sm text-zinc-500">
            {progress}%
          </span>

          <span className="text-sm text-zinc-500">
            Please don't close this page
          </span>

        </div>

      </div>

    </div>

  </div>
)}



{downloadUrl && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-zinc-900 rounded-xl p-6 text-center">

      <h2 className="text-2xl font-bold">
        🎉 Export Complete
      </h2>

      <p className="mt-2">
        Your clip is ready.
      </p>

      <a
        href={downloadUrl}
        download
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        Download Video
      </a>

     <button
  onClick={() => setConfirmClose(true)}
  className="rounded-lg border border-zinc-700 px-6 py-3 text-zinc-300 transition hover:bg-zinc-800"
>
  Close
</button>

    </div>

  </div>
)}


{confirmClose && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
    <div className="w-full max-w-sm rounded-xl bg-zinc-900 p-6 text-center">
      <h3 className="text-xl font-semibold text-white">
        Close export?
      </h3>

      <p className="mt-3 text-zinc-400">
        If you close this window before downloading your clip,
        you may need to export it again.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => setConfirmClose(false)}
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-zinc-300 hover:bg-zinc-800"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setConfirmClose(false);
            setDownloadUrl(null);
          }}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-white hover:bg-red-700"
        >
          Yes, Close
        </button>
      </div>
    </div>
  </div>
)}



          <div className="flex items-center gap-2">
            {exportMessage && (
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                  exportMessage.type === "success"
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                }`}
              >
                {exportMessage.type === "success" ? "✓ " : "✗ "}
                {exportMessage.text}
              </span>
            )}
            <Button
              onClick={handleExport}
              variant="destructive"
              size="sm"
              disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export"}
            </Button>
          </div>
        </div>

        {/* ── Main Content ───────────────────────────────────────── */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">

          {/* ── Left Sidebar ──────────────────────────────────────── */}
          <aside className="w-56 shrink-0 rounded-2xl border border-border bg-card flex flex-col overflow-hidden">
            <div className="p-3 space-y-2 border-b border-border">
              <Button
                variant={activePanel === "subtitles" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => togglePanel("subtitles")}
              >
                <Type className="mr-2 h-4 w-4" />
                Subtitle
              </Button>

              <Button
                variant={activePanel === "music" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => togglePanel("music")}
              >
                <Music className="mr-2 h-4 w-4" />
                Music
              </Button>
            </div>

            {activePanel === "subtitles" && (
              <SubtitlePanel
                subtitles={subtitles}
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
              />
            )}

            {activePanel === "music" && <MusicPanel />}

            {activePanel === "none" && (
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-xs text-muted-foreground text-center">
                  Select Subtitle or Music to start editing
                </p>
              </div>
            )}
          </aside>

          {/* ── Center: Video Preview ────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center min-w-0">

            <div className="flex-1 flex items-center justify-center w-full">
              <div className="relative aspect-[9/16] h-[520px] rounded-3xl overflow-hidden border border-border bg-black shadow-2xl">

                <div className="relative w-full h-full">
  {loading && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )}

  <video
    ref={videoRef}
    src={clip.url}
    className="w-full h-full object-cover"
    playsInline
    onClick={togglePlay}
    onLoadStart={() => setLoading(true)}
    onWaiting={() => setLoading(true)}
    onCanPlay={() => setLoading(false)}
    onCanPlayThrough={() => setLoading(false)}
  />
</div>

                {/* ═══ Subtitle Overlay ═══ */}
                {activeSubtitle && (
                  <div
                    className="absolute left-0 right-0 flex justify-center pointer-events-none px-4"
                    style={{
                      ...getSubtitlePositionStyles(selectedPreset),
                      zIndex: 30,
                    }}
                  >
                    <div className="max-w-[90%]">
                      <SubtitleOverlay
                        subtitle={activeSubtitle}
                        presetKey={selectedPreset}
                        currentTime={currentTime}
                      />
                    </div>
                  </div>
                )}

                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-20"
                    onClick={togglePlay}
                  >
                   {!loading&& <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" />
                      </div>}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="w-full max-w-lg mt-4 px-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={videoDuration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-orange-500"
                />
                <span className="text-xs font-mono text-muted-foreground w-10">
                  {formatTime(videoDuration)}
                </span>
              </div>

              {/* Subtitle regions on timeline */}
              {subtitles.length > 0 && videoDuration > 0 && (
                <div className="relative h-2 mt-1 mx-1">
                  {subtitles.map((sub, i) => {
                    const leftPct = Math.max(0, (sub.start / videoDuration) * 100);
                    const widthPct = Math.max(
                      0.5,
                      ((sub.end - sub.start) / videoDuration) * 100
                    );
                    return (
                      <div
                        key={i}
                        className="absolute h-1.5 rounded-full bg-orange-500/40"
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
