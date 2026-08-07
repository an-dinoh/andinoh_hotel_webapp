import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.andinoh.com/api/v1';

// DEBUG logs muted for production

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds (Render free tier can be slow on cold start)
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token and currency to all requests
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const config = error.config;

        // Implementation of basic retry logic
        if (config && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response)) {
          config.__retryCount = config.__retryCount || 0;

          if (config.__retryCount < 2) {
            config.__retryCount += 1;
            // Exponential backoff or just a delay to let the server wake up
            const delay = config.__retryCount * 2000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.client(config);
          }
        }

        // Handle 401 Unauthorized - Auth expired or invalid
        if (error.response?.status === 401 && config && !config._retry) {
          if (typeof window !== 'undefined') {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              config._retry = true;

              if (isRefreshing) {
                return new Promise((resolve, reject) => {
                  failedQueue.push({
                    resolve: (token: string) => {
                      config.headers.Authorization = `Bearer ${token}`;
                      resolve(this.client(config));
                    },
                    reject: (err: any) => {
                      reject(err);
                    }
                  });
                });
              }

              isRefreshing = true;

              try {
                // Call raw axios to prevent infinite interceptor loops
                const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                  refresh_token: refreshToken
                });

                const responseData = response.data;
                // Support both standard envelope or flat structure
                const newAccessToken = responseData?.data?.access_token || responseData?.access_token;
                const newRefreshToken = responseData?.data?.refresh_token || responseData?.refresh_token;

                if (newAccessToken) {
                  localStorage.setItem('token', newAccessToken);
                  if (newRefreshToken) {
                    localStorage.setItem('refresh_token', newRefreshToken);
                  }

                  // Update current request headers and retry
                  config.headers.Authorization = `Bearer ${newAccessToken}`;

                  // Process queued requests
                  failedQueue.forEach((prom) => prom.resolve(newAccessToken));
                  failedQueue = [];
                  isRefreshing = false;

                  return this.client(config);
                }
              } catch (refreshError) {
                // Refresh token is expired or invalid - log out
                failedQueue.forEach((prom) => prom.reject(refreshError));
                failedQueue = [];
                isRefreshing = false;

                const currentPath = window.location.pathname;
                if (!['/login', '/register'].includes(currentPath)) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  localStorage.removeItem('refresh_token');
                  const { toast } = require('react-hot-toast');
                  toast.error('Session expired. Please log in again.');
                  window.location.href = '/login';
                }
                return Promise.reject(refreshError);
              }
            } else {
              // No refresh token available, redirect immediately
              const currentPath = window.location.pathname;
              if (!['/login', '/register'].includes(currentPath)) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refresh_token');
                const { toast } = require('react-hot-toast');
                toast.error('Session expired. Please log in again.');
                window.location.href = '/login';
              }
            }
          }
        }

        // Handle 404 errors
        if (error.response?.status === 404) {
          const notFoundError = new Error('Resource not found') as Error & { response?: unknown };
          notFoundError.response = error.response;
          return Promise.reject(notFoundError);
        }

        // Extract error message
        let message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          error.message ||
          'An unexpected error occurred';

        // Better error message for rate-limiting / throttling (HTTP 429)
        if (error.response?.status === 429 || message.toLowerCase().includes('throttled')) {
          message = 'The server is experiencing high traffic. Please try again in a few moments.';
        }

        // Better error message for timeouts
        if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
          message = 'Request timed out. The server might be starting up (this can take 30-60 seconds on first request). Please try again.';
          if (typeof window !== 'undefined') {
            const { toast } = require('react-hot-toast');
            toast.error(message, { id: 'api-timeout' }); // deduplicate with id
          }
        }

        // Better error message for network errors
        if (error.code === 'ERR_NETWORK' || !error.response) {
          message = 'Network error. The API server might be unreachable. Please wait 30-60 seconds for it to wake up, then try again.';
          if (typeof window !== 'undefined') {
            const { toast } = require('react-hot-toast');
            toast.error(message, { id: 'api-network-error' });
          }
        }

        // Global toast for server errors
        if (error.response?.status && error.response.status >= 500) {
          if (typeof window !== 'undefined') {
            const { toast } = require('react-hot-toast');
            toast.error('Internal server error. Our team has been notified.', { id: 'server-error' });
          }
        }

        const apiError = new Error(message) as Error & { response?: unknown };
        apiError.response = error.response;
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ data?: T } & Record<string, unknown>> = await this.client.get(endpoint, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || (response.data as T);
  }

  async post<T>(endpoint: string, data?: Record<string, unknown> | unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ data?: T } & Record<string, unknown>> = await this.client.post(endpoint, data, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || (response.data as T);
  }

  async put<T>(endpoint: string, data?: Record<string, unknown> | unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ data?: T } & Record<string, unknown>> = await this.client.put(endpoint, data, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || (response.data as T);
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown> | unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ data?: T } & Record<string, unknown>> = await this.client.patch(endpoint, data, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || (response.data as T);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ data?: T } & Record<string, unknown>> = await this.client.delete(endpoint, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || (response.data as T);
  }

  // For file uploads
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<{ data?: T } & Record<string, unknown>> = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || (response.data as T);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
