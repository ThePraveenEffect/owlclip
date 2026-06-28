'use client'

import { useQuery } from '@tanstack/react-query';
import { myClips } from '@/lib/api/clip';

export function useMyClip() {
    return useQuery({
        queryKey: ['my-clips'],
        queryFn: () => myClips(),
        retry: 1,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}