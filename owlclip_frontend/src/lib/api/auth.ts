import { apiClient } from "./client";       

export async function getMe(){
    return apiClient("/api/v1/profile/me");
}

export async function refreshSession() {
  return apiClient("/api/v1/auth/refresh", { method: "POST" });
}