// Auth Request Models
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword?: string;
}

// Auth Response Models
export interface User {
  id: string;
  supabase_user_id?: string;
  email: string;
  name?: string;
  full_name?: string;
  role?: string;
  phone_number?: string;
  hotel_name?: string;
  hotel_address?: string;
  hotel_license_number?: string;
  inspector_license_number?: string;
  inspector_certification?: string;
  is_active?: boolean;
  is_verified?: boolean;
  can_manage_bookings?: boolean;
  can_manage_rooms?: boolean;
  can_view_reports?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  error: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: User;
    email_confirmation_required: boolean;
  };
  message: string;
}

export interface MessageResponse {
  message: string;
}
