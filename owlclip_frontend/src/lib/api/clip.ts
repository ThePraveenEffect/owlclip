import { apiClient } from './client';

export async function getClip(jobId: string) {
  return apiClient(`/api/v1/clips/${jobId}`);
}

export async function updateClip(
  jobId: string,
  clipNum: number,
  data: {
    title?: string;
    description?: string;
    hashtags?: string[];
    start_time?: number;
    end_time?: number;
  },
) {
  return apiClient(`/api/v1/clips/${jobId}/clips/${clipNum}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
