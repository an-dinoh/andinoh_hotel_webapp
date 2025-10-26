// Hotel Types
export type HotelType = 'luxury' | 'boutique' | 'business' | 'budget' | 'resort' | 'hostel' | 'motel' | 'bed_breakfast';
export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface Hotel {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  hotel_type: HotelType;
  star_rating: StarRating;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  check_in_time: string;  // "15:00:00"
  check_out_time: string; // "11:00:00"
  total_rooms: number;
  logo?: string;
  cover_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHotelRequest {
  name: string;
  description: string;
  hotel_type: HotelType;
  star_rating: StarRating;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  check_in_time: string;
  check_out_time: string;
  total_rooms: number;
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {}

// Room Types
export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential' | 'family' | 'twin' | 'single' | 'double' | 'triple' | 'quad';
export type BedType = 'single' | 'double' | 'queen' | 'king' | 'twin' | 'sofa_bed';

export interface Room {
  id: string;
  hotel: string;
  room_type: RoomType;
  title: string;
  description: string;
  room_size: number;
  bed_type: BedType;
  max_occupancy: number;
  max_adults: number;
  max_children: number;
  base_price: string;
  weekend_price?: string;
  peak_season_price?: string;
  has_balcony: boolean;
  has_sea_view: boolean;
  has_city_view: boolean;
  is_available: boolean;
  total_rooms: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRoomRequest {
  hotel: string;
  room_type: RoomType;
  title: string;
  description: string;
  room_size: number;
  bed_type: BedType;
  max_occupancy: number;
  max_adults: number;
  max_children: number;
  base_price: string;
  weekend_price?: string;
  peak_season_price?: string;
  has_balcony?: boolean;
  has_sea_view?: boolean;
  has_city_view?: boolean;
  total_rooms: number;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

export interface RoomFilters {
  room_type?: RoomType;
  min_price?: number;
  max_price?: number;
  has_balcony?: boolean;
  has_sea_view?: boolean;
  bed_type?: BedType;
  min_occupancy?: number;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type BookingSource = 'online' | 'walk_in' | 'phone' | 'email';

export interface Booking {
  id: string;
  hotel: string;
  room: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_reference: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  number_of_adults: number;
  number_of_children: number;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  booking_source: BookingSource;
  special_requests?: string;
  checked_in_at?: string;
  checked_out_at?: string;
  checked_in_by?: string;
  checked_out_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  room: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_adults: number;
  number_of_children: number;
  booking_source: BookingSource;
  special_requests?: string;
  amount_paid?: string;
  created_by_staff_id?: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {}

export interface BookingFilters {
  booking_status?: BookingStatus;
  payment_status?: PaymentStatus;
  check_in_from?: string;
  check_in_to?: string;
  check_out_from?: string;
  check_out_to?: string;
  room?: string;
  booking_source?: BookingSource;
}

export interface CheckInRequest {
  staff_id: string;
}

export interface CheckOutRequest {
  staff_id: string;
}

// Staff Types
export type StaffRole = 'owner' | 'manager' | 'receptionist' | 'front_desk_manager' | 'housekeeping' | 'maintenance' | 'other';
export type Department = 'front_office' | 'housekeeping' | 'maintenance' | 'management' | 'other';
export type InvitationStatus = 'pending' | 'registered' | 'active' | 'suspended' | 'terminated';

export interface HotelStaff {
  id: string;
  hotel: string;
  email: string;
  full_name: string;
  employee_id: string;
  role: StaffRole;
  department: Department;
  phone?: string;
  invitation_status: InvitationStatus;
  can_manage_bookings: boolean;
  can_manage_rooms: boolean;
  can_view_reports: boolean;
  is_active: boolean;
  is_full_time: boolean;
  hire_date: string;
  salary?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface InviteStaffRequest {
  email: string;
  full_name: string;
  employee_id: string;
  role: StaffRole;
  department: Department;
  hire_date: string;
  salary?: string;
  is_full_time?: boolean;
}

export interface UpdateStaffProfileRequest {
  full_name?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface ChangeStaffRoleRequest {
  role: StaffRole;
  can_manage_bookings?: boolean;
  can_manage_rooms?: boolean;
  can_view_reports?: boolean;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface StaffFilters {
  role?: StaffRole;
  department?: Department;
  invitation_status?: InvitationStatus;
  is_active?: boolean;
}

// Amenity Types
export type AmenityCategory = 'fitness' | 'dining' | 'business' | 'recreation' | 'services' | 'other';

export interface Amenity {
  id: string;
  hotel: string;
  name: string;
  category: AmenityCategory;
  description?: string;
  is_free: boolean;
  additional_cost?: string;
  created_at: string;
}

export interface CreateAmenityRequest {
  name: string;
  category: AmenityCategory;
  description?: string;
  is_free: boolean;
  additional_cost?: string;
}

// Policy Types
export type PolicyType = 'cancellation' | 'payment' | 'pet' | 'smoking' | 'child' | 'other';

export interface Policy {
  id: string;
  hotel: string;
  policy_type: PolicyType;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyRequest {
  policy_type: PolicyType;
  title: string;
  description: string;
  is_active?: boolean;
}

// Media Types
export type ImageType = 'exterior' | 'lobby' | 'restaurant' | 'pool' | 'gym' | 'room' | 'other';

export interface HotelImage {
  id: string;
  hotel: string;
  image: string;
  image_type: ImageType;
  caption?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface RoomImage {
  id: string;
  room: string;
  image: string;
  caption?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

// Availability Types
export interface CheckAvailabilityRequest {
  check_in_date: string;
  check_out_date: string;
  room_type?: RoomType;
  number_of_adults?: number;
  number_of_children?: number;
}

export interface AvailabilityResponse {
  available: boolean;
  available_rooms: Room[];
  message?: string;
}

export interface RoomCalendarParams {
  days?: number;
  start_date?: string;
}

export interface CalendarDay {
  date: string;
  is_available: boolean;
  bookings_count: number;
  available_rooms: number;
}

// Dashboard/Analytics Types
export interface DashboardStats {
  today_check_ins: number;
  today_check_outs: number;
  current_occupancy_rate: number;
  total_bookings_today: number;
  total_bookings_this_week: number;
  total_bookings_this_month: number;
  revenue_today: string;
  revenue_this_week: string;
  revenue_this_month: string;
  pending_tasks: number;
}

export interface BookingTrend {
  date: string;
  count: number;
  revenue: string;
}

export interface RevenueByRoomType {
  room_type: RoomType;
  revenue: string;
  bookings_count: number;
}
