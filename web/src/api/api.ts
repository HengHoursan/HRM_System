import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import pinia from "@/stores";
import { useAuthStore } from "@/stores/auth";

const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api").endsWith('/') 
    ? (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api")
    : (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api") + '/',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 1. Helpers for the refresh state
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 2. Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. The Core Response Interceptor (Clean & Short)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthRequest = config.url.includes("/authentications/");

    // If not a 401 error, or it's a login/refresh request itself, just fail
    if (response?.status !== 401 || isAuthRequest) {
      return Promise.reject(error);
    }

    // Guard & Retry Logic
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(`${api.defaults.baseURL}authentications/refresh`, { refreshToken });
        const newToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        if (res.data.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.data.refreshToken);
        }

        // Sync with Pinia store
        const authStore = useAuthStore(pinia);
        authStore.setAuth({ 
          accessToken: newToken, 
          refreshToken: res.data.data.refreshToken || refreshToken 
        });

        onTokenRefreshed(newToken);
        isRefreshing = false;

        // Retry original request
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshError) {
        isRefreshing = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // If already refreshing, wait for the new token
    return new Promise((resolve) => {
      refreshSubscribers.push((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(api(config));
      });
    });
  }
);

function handleLogout() {
  localStorage.clear();
  if (!window.location.pathname.includes('/login')) {
    window.location.href = "/login";
  }
}

export default api;
