
const backendUri = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL ||"http:localhost:8000";
export const env = {
  BASE_URL : backendUri 
}