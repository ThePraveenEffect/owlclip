import { apiClient } from "./client";       

export async function getMe(){
    return apiClient("/api/v1/profile/me");
}