
import axios, { type InternalAxiosRequestConfig } from "axios";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const excludedEndpoints = [
  "/auth/login",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
];

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const isExcludedEndpoint = excludedEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isExcludedEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const currentRefresh =
        refreshPromise ??
        (refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        }));

      await currentRefresh;
      console.log("token refreshed successfully!");
      
    } catch (refreshError) {
      window.dispatchEvent(new Event("auth:session-expired"));
      return Promise.reject(refreshError);
    }

    return api(originalRequest);
  }
);

async function refreshSession(): Promise<void> {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
}

export default api;
