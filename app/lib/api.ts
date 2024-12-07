import axios from "axios";

// Base Axios Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000", // Use an environment variable for flexibility
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response, // Return the response as-is if successful
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("[API]: Unauthorized - Token might be invalid or expired.");
      localStorage.removeItem("authToken"); // Clear invalid token
      window.location.href = "/auth/login"; // Redirect to login page
    }
    return Promise.reject(error); // Propagate error to the calling function
  }
);

export default api;
