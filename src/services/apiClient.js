import { tokenStorage } from "./tokenStorage";
import axios from "axios";

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL_DEV || "http://localhost:8000/api/v1";

// Instance of axios
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // CRITICAL: Allows browser to send & receive httpOnly cookies (refreshToken)
  timeout: 15000, // Abort request if it takes longer than 15 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false; // If multiple requests fail with 401 simultaneously, we only call
let failedQueue = []; // refresh-token ONCE. Other requests wait in this queue.

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // retrieve current access token
    const token = tokenStorage.getAccessToken();

    // attach authorization token
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // If status is 200/201, do nothing and return data
    return response;
  },
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config; // Saves: method, url, headers of the failed call

    // do not call for auth routes (login, register, refresh-token routes)
    const isAuthRoutes =
      originalRequest.url?.includes("/users/login") ||
      originalRequest.url?.includes("/users/register") ||
      originalRequest.url?.includes("/users/refresh-token");

    // check if error is 401 and request hasn't been retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoutes
    ) {
      // case 1: if another request is already refreshing the token -> add in queue this new request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          })
          .catch((err) => Promise.reject(err));
      }

      // case 2: if first request to hit 401 for refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // 1. Save new access token into storage
        tokenStorage.setAccessToken(newAccessToken);

        // 2. Update default Authorization header for all future calls
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        // 3. Resolve all pending requests that were waiting in the queue
        processQueue(null, newAccessToken);

        // 4. Update the current failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 5. RETRY THE ORIGINAL REQUEST AUTOMATICALLY!
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearAll();

        // Broadcast logout event so React auth context can redirect to /login
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        // Release the lock
        isRefreshing = false;
      }
    }
    // Return any other errors (400, 403, 404, 500, etc.) back to the calling component
    return Promise.reject(error);
  },
);
