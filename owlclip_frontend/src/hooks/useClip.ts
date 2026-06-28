'use client';

import {useQuery} from "@tanstack/react-query";
import {getClip} from "@/lib/api/clip";

export function useClip(jobId: string) {
    return useQuery({
        queryKey: ["clip", jobId],
        queryFn: () => getClip(jobId),
        retry: 1,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}