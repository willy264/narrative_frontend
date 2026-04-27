import axios from 'axios'
// Firebase auth will be added here to inject tokens

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// TODO: Interceptor for Firebase Auth tokens

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, refresh tokens, etc.
    return Promise.reject(error)
  }
)
