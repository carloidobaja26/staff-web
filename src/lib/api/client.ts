// src/lib/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add this IF your backend returns 200 OK for validation errors
apiClient.interceptors.response.use((response) => {
  if (response.data && response.data.success === false) {
    // Force axios to treat this as an error so it goes to your catch blocks
    return Promise.reject({ response }); 
  }
  return response;
});