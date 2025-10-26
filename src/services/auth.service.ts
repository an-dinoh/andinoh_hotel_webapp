import { apiClient } from '@/utils/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  MessageResponse,
  User,
} from '@/types/auth.types';

class AuthService {
  // ==================== AUTHENTICATION ====================

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/api/auth/register', data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/api/auth/login', data);
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/api/auth/me');
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/auth/api/auth/forgot-password', data);
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/auth/api/auth/verify-otp', data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/auth/api/auth/reset-password', data);
  }

  // ==================== TOKEN MANAGEMENT ====================

  saveAuth(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // ==================== USER ROLE HELPERS ====================

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  isOwner(): boolean {
    return this.getUserRole() === 'owner';
  }

  isManager(): boolean {
    const role = this.getUserRole();
    return role === 'manager' || role === 'owner';
  }

  isReceptionist(): boolean {
    return this.getUserRole() === 'receptionist';
  }

  hasPermission(permission: 'manage_bookings' | 'manage_rooms' | 'view_reports'): boolean {
    const user = this.getUser();
    if (!user) return false;

    // Owners and managers have all permissions
    if (this.isOwner() || this.isManager()) return true;

    // Check specific permissions
    switch (permission) {
      case 'manage_bookings':
        return user.can_manage_bookings || false;
      case 'manage_rooms':
        return user.can_manage_rooms || false;
      case 'view_reports':
        return user.can_view_reports || false;
      default:
        return false;
    }
  }
}

export const authService = new AuthService();
