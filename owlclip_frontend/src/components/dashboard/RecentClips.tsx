'use client';

import { Play, Download, MoreHorizontal, Clock, CheckCircle2 } from 'lucide-react';

const clips = [
  {
    id: '1',
    title: 'Best Moments from Podcast #42',
    thumbnail: null,
    duration: '0:42',
    status: 'ready',
    createdAt: '2 hours ago',
    size: '12 MB',
  },
  {
    id: '2',
    title: 'Top 3 Tips for Remote Work',
    thumbnail: null,
    duration: '1:15',
    status: 'ready',
    createdAt: '5 hours ago',
    size: '24 MB',
  },
  {
    id: '3',
    title: 'Why AI Changes Everything',
    thumbnail: null,
    duration: '0:58',
    status: 'processing',
    createdAt: '1 day ago',
    size: '--',
  },
  {
    id: '4',
    title: 'Coding Interview Tips',
    thumbnail: null,
    duration: '1:32',
    status: 'ready',
    createdAt: '2 days ago',
    size: '31 MB',
  },
];

export default function RecentClips() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Clips</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Your latest creations</p>
        </div>
        <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition group cursor-pointer"
          >
            {/* Thumbnail placeholder */}
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-orange-500" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{clip.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {clip.duration}
                </span>
                <span className="text-xs text-muted-foreground">{clip.createdAt}</span>
              </div>
            </div>

            {/* Status + actions */}
            <div className="flex items-center gap-2">
              {clip.status === 'ready' ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                  <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Processing
                </span>
              )}
              {clip.status === 'ready' && (
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
