"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "../lib/api/auth";

export function useAuth(){
    return  useQuery({
        queryKey:["me"],
        queryFn: getMe,

        retry: false,

        staleTime: 1000*60*5
    })
}