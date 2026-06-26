'use client';

import { useParams } from 'next/navigation';
import { ClipsDisplay } from '@/components/clips/ClipsDisplay';
import { ProcessingPage } from '@/components/clips/ProcessingPage';
import { useClip } from '@/hooks/useClip';

export default function JobPage() {
  const params = useParams();
  const jobId = params.id as string;

  const { data, error, isProcessing, processingStatus } = useClip(jobId);

  // Show processing page with fake progress bar while job is running
  // Also covers initial loading state — ProcessingPage handles both
  if (!data) {
    if (error && !isProcessing) {
      // Non-processing errors (404, 403, etc.)
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-foreground text-lg font-semibold mb-2">
              Couldn&apos;t load this job
            </p>
            <p className="text-muted-foreground text-sm">
              {(error as Error)?.message || 'Something went wrong'}
            </p>
          </div>
        </div>
      );
    }

    // Loading OR processing — always show ProcessingPage with skeleton background
    return <ProcessingPage jobId={jobId} status={processingStatus} />;
  }

  // Job completed — show clips
  return <ClipsDisplay job={data} jobId={jobId} />;
}
