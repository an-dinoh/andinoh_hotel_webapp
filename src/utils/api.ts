import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return typeof window !== 'undefined' ? '/api/v1' : 'https://api.andinoh.com/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export function extractErrorMessage(error: any, fallback: string = 'An unexpected error occurred'): string {
  if (!error) return fallback;
  if (typeof error === 'string') return error;

  const data = error.response?.data;

  if (data) {
    if (typeof data === 'string') return data;
    if (data.message && typeof data.message === 'string') return data.message;
    if (data.error && typeof data.error === 'string') return data.error;
    if (data.detail && typeof data.detail === 'string') return data.detail;

    // Field-specific DRF error arrays (e.g. otp: ["Invalid OTP"], non_field_errors: [...])
    if (data.otp) {
      return Array.isArray(data.otp) ? data.otp[0] : String(data.otp);
    }
    if (data.non_field_errors) {
      return Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors);
    }
    if (data.new_password) {
      return Array.isArray(data.new_password) ? data.new_password[0] : String(data.new_password);
    }
    if (data.email) {
      return Array.isArray(data.email) ? data.email[0] : String(data.email);
    }

    if (typeof data === 'object') {
      for (const key of Object.keys(data)) {
        const val = data[key];
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
          return val[0];
        }
        if (typeof val === 'string') {
          return val;
        }
      }
    }
  }

  if (error.message && typeof error.message === 'string') return error.message;

  return fallback;
}

// DEBUG logs muted for production

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || getApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds fast timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token to protected requests only
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          // Do NOT attach Authorization header to public auth endpoints
          const isPublicAuthEndpoint =
            config.url?.includes('auth/register') ||
            config.url?.includes('auth/login') ||
            config.url?.includes('auth/google') ||
            config.url?.includes('auth/password-reset');

          const token = localStorage.getItem('token');
          if (token && !isPublicAuthEndpoint) {
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

        // Implementation of basic retry logic (skip retrying CORS / network errors on public endpoints)
        const isPublicEndpoint = config?.url?.includes('/shared/currencies') || config?.url?.includes('currencies');
        if (config && !isPublicEndpoint && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') && error.response) {
          config.__retryCount = config.__retryCount || 0;

          if (config.__retryCount < 2) {
            config.__retryCount += 1;
            const delay = config.__retryCount * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.client(config);
          }
        }

        // Handle 401 Unauthorized - Auth expired or invalid
        if (error.response?.status === 401 && !config._retry) {
          if (typeof window !== 'undefined') {
            const refreshToken = localStorage.getItem('refresh_token');
            const currentPath = window.location.pathname;
            const publicAuthPaths = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'];

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
                // Call raw axios with catch fallback to prevent Next.js DEV overlay popups
                const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                  refresh_token: refreshToken
                }).catch(() => null);

                const responseData = response?.data;
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
              } catch {
                // Refresh failed
              }

              failedQueue.forEach((prom) => prom.reject(error));
              failedQueue = [];
              isRefreshing = false;

              if (!publicAuthPaths.includes(currentPath)) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refresh_token');
                const { toast } = require('react-hot-toast');
                toast.error('Session expired. Please log in again.');
                window.location.href = '/login';
              }
            } else {
              // No refresh token available
              if (!publicAuthPaths.includes(currentPath)) {
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
        let message = extractErrorMessage(error);

        // Rate-limiting / throttling (HTTP 429) - preserve exact backend message if returned
        if (error.response?.status === 429) {
          const backendMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;
          if (!backendMsg) {
            message = 'The server is experiencing high traffic. Please try again in a few moments.';
          }
        }

        // Better error message for timeouts
        if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
          message = 'Request timed out. Please check your connection and try again.';
        }

        // Better error message for network errors
        if (error.code === 'ERR_NETWORK' || !error.response) {
          message = 'Network error. The API server might be unreachable. Please try again.';
        }

        if (error && typeof error === 'object') {
          (error as any).message = message;
          return Promise.reject(error);
        }

        const apiError = new Error(message) as Error & { response?: unknown };
        apiError.response = error.response;
        return Promise.reject(apiError);
      }
    );
  }

  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(endpoint, config).then(
      (response: AxiosResponse<{ data?: T } & Record<string, unknown>>) =>
        response.data.data || (response.data as T)
    );
  }

  post<T>(endpoint: string, data?: Record<string, unknown> | unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(endpoint, data, config).then(
      (response: AxiosResponse<{ data?: T } & Record<string, unknown>>) =>
        response.data.data || (response.data as T)
    );
  }

  put<T>(endpoint: string, data?: Record<string, unknown> | unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(endpoint, data, config).then(
      (response: AxiosResponse<{ data?: T } & Record<string, unknown>>) =>
        response.data.data || (response.data as T)
    );
  }

  patch<T>(endpoint: string, data?: Record<string, unknown> | unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(endpoint, data, config).then(
      (response: AxiosResponse<{ data?: T } & Record<string, unknown>>) =>
        response.data.data || (response.data as T)
    );
  }

  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(endpoint, config).then(
      (response: AxiosResponse<{ data?: T } & Record<string, unknown>>) =>
        response.data.data || (response.data as T)
    );
  }

  // For file uploads
  uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(
      (response: AxiosResponse<{ data?: T } & Record<string, unknown>>) =>
        response.data.data || (response.data as T)
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
