'use client';

import { useParams } from 'next/navigation';
import { ClipsDisplay } from '@/components/clips/ClipsDisplay';
import { ProcessingPage } from '@/components/clips/ProcessingPage';
import { useClip } from '@/hooks/useClip';

export default function JobPage() {
  const params = useParams();
  const jobId = params.id as string;

  const { data, error} = useClip(jobId);



  // Job completed — show clips
  return <ClipsDisplay job={data} jobId={jobId} />;
}
