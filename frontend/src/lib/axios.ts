import axios from "axios";
import { API_URL } from "@/utils/apiRoutes";
import { toast } from "@/hooks/use-toast";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add any request headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // window.location.href = "/login";
      // Or use a toast notification to inform the user
      toast({
        title: "Unauthorized",
        description: "Please log in to continue.",
        variant: "destructive",
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
