import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotel-api-gateway.onrender.com';

// 🔍 DEBUG: Log environment variable
console.log('🔍 DEBUG - API_BASE_URL:', API_BASE_URL);
console.log('🔍 DEBUG - process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    console.log('🔍 DEBUG - ApiClient constructor baseURL:', baseURL);

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds (Render free tier can be slow on cold start)
    });

    console.log('🔍 DEBUG - axios.defaults.baseURL:', axios.defaults.baseURL);
    console.log('🔍 DEBUG - this.client.defaults.baseURL:', this.client.defaults.baseURL);

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token to all requests
    this.client.interceptors.request.use(
      (config) => {
        // Debug logging
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        console.log('🔍 Full URL:', `${config.baseURL || 'UNDEFINED'}${config.url || 'UNDEFINED'}`);
        console.log('🔍 Base URL:', config.baseURL || 'UNDEFINED');
        console.log('🔍 Endpoint:', config.url || 'UNDEFINED');
        console.log('📦 Request data:', config.data);
        console.log('📦 Request headers:', config.headers);

        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        // Log status and basic info
        console.error('❌ API Error Status:', error?.response?.status);
        console.error('❌ API Error Message:', error?.message);

        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        // Handle 404 errors
        if (error.response?.status === 404) {
          const notFoundError = new Error('Resource not found');
          (notFoundError as any).response = error.response;
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
        }

        // Better error message for network errors
        if (error.code === 'ERR_NETWORK' || !error.response) {
          message = 'Network error. The API server might be unreachable. Please wait 30-60 seconds for it to wake up, then try again.';
        }

        const apiError = new Error(message);
        (apiError as any).response = error.response;
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<any> = await this.client.get(endpoint, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || response.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<any> = await this.client.post(endpoint, data, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || response.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<any> = await this.client.put(endpoint, data, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || response.data;
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<any> = await this.client.patch(endpoint, data, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<any> = await this.client.delete(endpoint, config);
    // API returns: { error: false, data: {...}, message: "..." }
    return response.data.data || response.data;
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
