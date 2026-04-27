import axios from 'axios'

// Auth token injection is handled by AuthProvider.tsx request interceptor.
// This file only sets up the base Axios instance.

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 means token is missing/expired — AuthProvider handles sign-out
    if (error.response?.status === 401) {
      console.warn('[api] 401 Unauthorized — token may be expired.');
    }
    // Log request_id from error responses for support
    const requestId = error.response?.data?.request_id;
    if (requestId) {
      console.error(`[api] request_id: ${requestId}`);
    }
    return Promise.reject(error)
  }
)
