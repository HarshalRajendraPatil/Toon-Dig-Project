import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://toondig-backend.onrender.com", // API base URL
  timeout: 60000, // Request timeout (60 seconds)
  headers: {
    "Content-Type": "application/json", // Default headers
  },
  withCredentials: true,
});

// Request Interceptor to add Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Assuming you're storing the token in localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally (e.g., show notifications or redirect to login on 401)
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      // For example, redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
