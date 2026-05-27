import { env } from "@/src/config/env"



export async function apiClient(
endpoint:string,
options: RequestInit = {}

){
    const response = await fetch(
        `${env.BASE_URL}${endpoint}`,{
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
            },

            ...options,
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
      data.detail || "API Error"
    );
    }


    return data;
}