'use client';

import { useQuery } from '@tanstack/react-query';
import { getClip } from '@/lib/api/clip';

export function useClip(jobId: string) {
  const query = useQuery({
    queryKey: ['clip', jobId],
    queryFn: () => getClip(jobId),
    // Keep retrying forever while job is processing — no fixed retry count
    retry: (failureCount, error: any) => {
      // Keep retrying on JOB_NOT_COMPLETED (job still processing)
      if (error?.code === 'JOB_NOT_COMPLETED') return true;
      // Don't retry on other errors (404, 403, etc.)
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 2s, 3s, 4s, 5s... max 8s
      return Math.min(2000 + attemptIndex * 1000, 8000);
    },
    // Don't cache processing responses — always refetch
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });

  // Detect if we're in "processing" state (error is JOB_NOT_COMPLETED)
  const isProcessing =
    query.isError &&
    (query.error as any)?.code === 'JOB_NOT_COMPLETED';

  // Extract status from the error response if available
  const processingStatus = isProcessing
    ? (query.error as any)?.issues?.[0]?.message?.replace(
        'Current status: ',
        ''
      ) || 'processing'
    : undefined;

  return {
    ...query,
    isProcessing,
    processingStatus,
  };
}
