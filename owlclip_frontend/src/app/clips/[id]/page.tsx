'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ClipsDisplay } from '@/components/clips/ClipsDisplay';
import { ClipsSkeleton } from '@/components/clips/ClipsSkeleton';
import { ProcessingPage } from '@/components/clips/ProcessingPage';
import { useClip } from '@/hooks/useClip';

const STORAGE_KEY = 'owlclip_last_job';

export default function JobPage() {
  const params = useParams();
  const jobId = params.id as string;

  // Persist jobId to sessionStorage so refresh doesn't lose it
  useEffect(() => {
    if (jobId) {
      sessionStorage.setItem(STORAGE_KEY, jobId);
    }
  }, [jobId]);

  const { data, isLoading, error, isProcessing, processingStatus } =
    useClip(jobId);

  // Show skeleton on initial load
  if (isLoading && !isProcessing) return <ClipsSkeleton />;

  // Show processing page with dummy progress bar while job is running
  if (isProcessing) {
    return <ProcessingPage jobId={jobId} status={processingStatus} />;
  }

  // Show error for non-processing errors (404, 403, etc.)
  if (error && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">
            Error loading job
          </p>
          <p className="text-muted-foreground text-sm">
            {(error as Error)?.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  // Job completed — show clips
  if (data) return <ClipsDisplay job={data} jobId={jobId} />;

  // Fallback skeleton
  return <ClipsSkeleton />;
}
