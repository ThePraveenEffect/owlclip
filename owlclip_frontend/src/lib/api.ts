

export async function apiFetch(
    endpoint:string,
    options?:RequestInit
){

    const api_url= process.env.NEXT_PUBLIC_BACKEND_URL;
    const response =  await fetch(
        `${api_url}${endpoint}`,
        {
            ...options,
            headers:{
                "Content-Type" : "application/json",
                ...(options?.headers || {})
            },
            credentials : "include"
        }
    )

    const data = await response.json();

    console.log(data)

    

    if(!response.ok){
        // console.error("API Error:", data);  
        throw data;
    }

    return data;    

}