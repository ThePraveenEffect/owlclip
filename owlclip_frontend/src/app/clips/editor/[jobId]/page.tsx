"use client";

import {useClip} from '@/hooks/useClip';
import { useParams, useSearchParams } from 'next/navigation';
import { ClipEditor } from '@/components/clips/ClipEditor';


export default function EditorPage() {
   const params = useParams();  
   const jobId = params.jobId as string;
   const searchParams = useSearchParams();
   const clipNum = searchParams.get('clip');

   console.log('Clip Number from URL:', clipNum);


  const {data:job, isLoading, error} = useClip(jobId);

   console.log(job);
   

   if (isLoading) return <div>Loading...</div>;
      if (error || !job) return <div>Error loading job</div>;
    
      const clip = job.clips?.[clipNum] ;
      
      if (!clip) return <div>Clip not found</div>;
  
  return (
    <div className="p-8">
     
     
     <ClipEditor clip={clip} jobId={jobId}/>
   
   
   
    </div>
  );
}