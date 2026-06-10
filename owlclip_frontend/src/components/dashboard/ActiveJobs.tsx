'use client';

import { FileVideo, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const jobs = [
  {
    id: '1',
    name: 'podcast_episode_42.mp4',
    progress: 62,
    status: 'processing',
    stage: 'Burning subtitles...',
    startedAt: '3 min ago',
  },
  {
    id: '2',
    name: 'youtube_review_2024.mp4',
    progress: 100,
    status: 'completed',
    stage: 'Completed',
    startedAt: '12 min ago',
  },
  {
    id: '3',
    name: 'interview_highlights.mp4',
    progress: 0,
    status: 'queued',
    stage: 'Waiting in queue...',
    startedAt: 'Just now',
  },
];

export default function ActiveJobs() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Active Jobs</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {jobs.filter(j => j.status === 'processing').length} processing now
          </p>
        </div>
        <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                job.status === 'processing' && 'bg-orange-500/10',
                job.status === 'completed' && 'bg-emerald-500/10',
                job.status === 'queued' && 'bg-muted',
              )}>
                {job.status === 'processing' && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
                {job.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {job.status === 'queued' && <FileVideo className="w-5 h-5 text-muted-foreground" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{job.name}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{job.startedAt}</span>
                </div>

                <p className="text-xs text-muted-foreground mt-1">{job.stage}</p>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700 ease-out',
                      job.status === 'processing' && 'bg-gradient-to-r from-orange-500 to-orange-400',
                      job.status === 'completed' && 'bg-emerald-500',
                      job.status === 'queued' && 'bg-muted-foreground/30',
                    )}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">
                    {job.status === 'completed' ? 'Done' : `${job.progress}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
