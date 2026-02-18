import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://andinoh-backend.onrender.com/api/v1';

// DEBUG logs muted for production

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
    // Request interceptor - Add auth token to all requests
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
      (error) => {
        const { toast } = require('react-hot-toast');

        // Handle 401 Unauthorized - Auth expired or invalid
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            // Only redirect if not already on an auth page to avoid loops
            if (!['/login', '/register'].includes(currentPath)) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              toast.error('Session expired. Please log in again.');
              window.location.href = '/login';
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

        // Better error message for timeouts
        if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
          message = 'Request timed out. The server might be starting up (this can take 30-60 seconds on first request). Please try again.';
          toast.error(message, { id: 'api-timeout' }); // deduplicate with id
        }

        // Better error message for network errors
        if (error.code === 'ERR_NETWORK' || !error.response) {
          message = 'Network error. The API server might be unreachable. Please wait 30-60 seconds for it to wake up, then try again.';
          toast.error(message, { id: 'api-network-error' });
        }

        // Global toast for server errors
        if (error.response?.status && error.response.status >= 500) {
          toast.error('Internal server error. Our team has been notified.', { id: 'server-error' });
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
    const response: AxiosResponse<T> = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
