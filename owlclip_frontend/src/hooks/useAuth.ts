"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth";

export function useAuth(){
       return  useQuery({
        queryKey:["me"],
        queryFn: getMe,
        select: (data) => data?.user,
        retry: 1,
        staleTime: 1000*60*5,
        gcTime: 1000 * 60 * 10,
    });


}