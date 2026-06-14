  import { env } from "@/config/env";


  export function doFetch(endpoint:string, options: RequestInit = {}){
      return fetch(`${env.BASE_URL}${endpoint}`, {
      credentials: "include",  
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  }


  export async function apiClient(
  endpoint:string,
  options: RequestInit = {}

  ){

    let response:Response;

    try{
        response = await doFetch(endpoint, options);

    } catch(error){

        console.error("Network error:", error);
          throw new Error("Failed to reach server. Check your connection or backend availability.");
    }

    if( response.status === 401){

      try{
          const refreshResponse = await doFetch("/v1/auth/refresh",{
              method:"POST",
          });

          if (!refreshResponse.ok) {
        throw new Error("Unauthorized. Please log in again.");
      }
          response = await doFetch(endpoint, options);
      } catch(refreshError){
          console.error("Refresh failed:", refreshError);
          throw refreshError;
      }    
    }


    const data = await response.json();

    if(!response.ok){
    const error = new Error(data?.detail || data?.message || `HTTP ${response.status}: API Error`) as Error & { code?: string; issues?: any[] };
    
    if(data?.error) {
      error.code = data.error.code;
      error.issues = data.error.issues;
    }
    
    throw error;
  }

    return data;

  }