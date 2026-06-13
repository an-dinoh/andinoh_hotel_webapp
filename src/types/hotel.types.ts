// Hotel Types
export type HotelType = 'luxury' | 'boutique' | 'business' | 'budget' | 'resort' | 'hostel' | 'motel' | 'bed_breakfast';
export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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
  is_verified?: boolean;
  kyc_status?: 'pending' | 'submitted' | 'verified' | 'rejected';
  kyc_submitted_at?: string;
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateHotelRequest extends Partial<CreateHotelRequest> { }

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
  price_per_night?: string;
  room_number?: string;
  weekend_price?: string;
  peak_season_price?: string;
  has_balcony: boolean;
  has_sea_view: boolean;
  has_city_view: boolean;
  is_available: boolean;
  total_rooms: number; // Read-only: dynamic count from backend
  primary_image?: string;
  display_price?: { amount: number; currency: string; };
  availability_summary?: { date: string; rooms_available: number; is_available: boolean; };
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  room_type: string;
  title: string;
  start_date: string;
  end_date: string;
  price_multiplier?: string;
  fixed_price?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'out_of_order';
export type HousekeepingStatus = 'clean' | 'dirty' | 'inspecting' | 'cleaning_in_progress';

export interface PhysicalRoom {
  id: string;
  hotel: string;
  room_type: string;
  room_number: string;
  floor?: string;
  building?: string;
  status: RoomStatus;
  housekeeping_status: HousekeepingStatus;
  notes?: string;
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
  amenities?: string[];
  primary_image?: string;
  weekend_price?: string;
  peak_season_price?: string;
  has_balcony?: boolean;
  has_sea_view?: boolean;
  has_city_view?: boolean;
  total_rooms?: number; // Optional: calculated by backend from physical units
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateRoomRequest extends Partial<CreateRoomRequest> { }

export interface RoomFilters {
  room_type?: RoomType;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  has_balcony?: boolean;
  has_sea_view?: boolean;
  bed_type?: BedType;
  min_occupancy?: number;
  city_id?: string;
  area_id?: string;
  state_id?: string;
  country_id?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  page_size?: number;
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
  guest_details: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  customer: string | any; // Could be UUID or full object
  booking_reference: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  number_of_adults: number;
  number_of_children: number;
  total_amount: string;
  room_charges: string; // Explicitly mentioned as fixed/dynamic now
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
  financials?: {
    room_charges: string;
    incidentals_total: string;
    taxes: string;
    total_amount: string;
    amount_paid: string;
    balance_due: string;
    payment_status: string; // paid, partial, pending
  };
  created_at: string;
  updated_at: string;
}

export interface IncidentalCharge {
  id: string;
  booking: string;
  service_type: string; // e.g. 'minibar'
  amount: string;
  description: string;
  created_at: string;
  added_by?: string;
}

export interface BookingFolio {
  booking_id: string;
  room_charges: string;
  taxes: string;
  incidentals: IncidentalCharge[];
  total_amount: string;
  amount_paid: string;
  balance_due: string;
}

export interface CreateBookingRequest {
  room: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  guest_details: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  check_in_date: string;
  check_out_date: string;
  number_of_adults: number;
  number_of_children: number;
  number_of_nights?: number;
  booking_source: BookingSource;
  special_requests?: string;
  amount_paid?: string;
  balance_due?: string;
  created_by_staff_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateBookingRequest extends Partial<CreateBookingRequest> { }

export interface BookingFilters {
  booking_status?: BookingStatus;
  payment_status?: PaymentStatus;
  check_in_from?: string;
  check_in_to?: string;
  check_out_from?: string;
  check_out_to?: string;
  room?: string;
  booking_source?: BookingSource;
  search?: string;
}

export interface CheckInRequest {
  staff_id: string;
  actual_check_in_time?: string;
}

export interface CheckOutRequest {
  staff_id: string;
  actual_check_out_time?: string;
}

// Staff Types
export type StaffRole = 'owner' | 'manager' | 'receptionist' | 'front_desk_manager' | 'housekeeping' | 'maintenance' | 'other' | 'hotel_owner' | 'hotel_admin' | 'hotel_manager' | 'hotel_staff';
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

export interface Permission {
  id: string;
  name: string; // e.g., "manage_bookings"
  description: string;
}

export interface Role {
  id: string;
  hotel: string;
  name: string;
  permissions: string[]; // List of permission strings
  is_default: boolean;
  created_at: string;
}

export interface StaffActivity {
  id: string;
  staff_member: string;
  action: string;
  description: string;
  ip_address?: string;
  created_at: string;
}

export interface InviteStaffRequest {
  email: string;
  full_name: string;
  employee_id: string;
  role?: StaffRole;
  role_id?: string;
  department: Department | string;
  hire_date?: string;
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
  today: {
    check_ins: number;
    check_outs: number;
    revenue: number;
    pending_tasks: number;
  };
  performance: {
    adr: number;
    revpar: number;
    occupancy_rate: number;
    average_rating: number;
  };
  volume: {
    total_bookings: number;
    total_revenue: number;
    total_reviews: number;
  };
  room_stats: {
    total: number;
    available: number;
    occupied: number;
  };
}

export interface BookingTrend {
  date: string;
  label: string;
  count: number;
  value: number;
}

export interface BookingTrendResponse {
  series: BookingTrend[];
  summary: {
    current_period_total: number;
    previous_period_total: number;
    percentage_change: number;
  };
}

export interface RevenueByRoomType {
  room_type: string;
  revenue: number;
  bookings_count: number;
}

export interface SegmentationResponse {
  by_source: Array<{
    source: string;
    revenue: number;
    count: number;
  }>;
  by_payment: Array<{
    method: string;
    revenue: number;
    count: number;
  }>;
}

export interface WalletStats {
  available_balance: number;
  pending_clearance: number;
  total_lifetime_revenue: number;
  total_withdrawn: number;
}

export interface WalletTransaction {
  id: string;
  hotel: string;
  booking?: string; // UUID linked to booking
  amount: string;
  transaction_type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  gateway_reference?: string; // Flutterwave/Gateway ID
  description?: string;
  created_at: string;
}

export interface BankAccount {
  id: string;
  hotel: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
  created_at: string;
}

export type WithdrawalStatus = 'pending_review' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  hotel: string;
  amount: string;
  bank_account: BankAccount | string;
  reference_id: string;
  status: WithdrawalStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Event Space Types
export type EventSpaceType = 'ballroom' | 'conference_room' | 'meeting_room' | 'banquet_hall' | 'boardroom' | 'outdoor_venue' | 'rooftop_terrace' | 'garden' | 'theater' | 'exhibition_hall';
export type EventType = 'wedding' | 'corporate' | 'conference' | 'seminar' | 'workshop' | 'birthday' | 'anniversary' | 'exhibition' | 'product_launch' | 'gala' | 'networking' | 'other';
export type SetupStyle = 'theater' | 'classroom' | 'banquet' | 'cocktail' | 'u_shape' | 'boardroom' | 'hollow_square' | 'cabaret';

export interface EventSpace {
  id: string;
  hotel: string;
  space_type: EventSpaceType;
  title: string;
  description: string;
  space_size: number; // in sq ft
  max_capacity_theater: number;
  max_capacity_banquet: number;
  max_capacity_cocktail: number;
  min_capacity: number;
  base_rate_per_hour: string;
  base_rate_full_day: string;
  base_rate_half_day: string;
  weekend_rate_multiplier?: number; // e.g., 1.5 for 50% increase
  has_natural_light: boolean;
  has_audio_visual: boolean;
  has_stage: boolean;
  has_dance_floor: boolean;
  has_kitchen_access: boolean;
  has_outdoor_access: boolean;
  ceiling_height: number; // in feet
  is_available: boolean;
  floor_level: string; // e.g., "Ground Floor", "2nd Floor"
  total_spaces: number; // how many of this type exist
  supported_setups?: { style: SetupStyle | string; max_capacity: number; }[];
  created_at: string;
  updated_at: string;
}

export interface CreateEventSpaceRequest {
  hotel: string;
  space_type: EventSpaceType;
  title: string;
  description: string;
  space_size: number;
  max_capacity_theater: number;
  max_capacity_banquet: number;
  max_capacity_cocktail: number;
  min_capacity: number;
  base_rate_per_hour: string;
  base_rate_full_day: string;
  base_rate_half_day: string;
  weekend_rate_multiplier?: number;
  has_natural_light?: boolean;
  has_audio_visual?: boolean;
  has_stage?: boolean;
  has_dance_floor?: boolean;
  has_kitchen_access?: boolean;
  has_outdoor_access?: boolean;
  ceiling_height: number;
  floor_level: string;
  total_spaces: number;
  supported_setups?: { style: string; max_capacity: number; }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateEventSpaceRequest extends Partial<CreateEventSpaceRequest> { }

export interface EventSpaceFilters {
  space_type?: EventSpaceType;
  min_capacity?: number;
  max_capacity?: number;
  min_size?: number;
  max_size?: number;
  has_audio_visual?: boolean;
  has_stage?: boolean;
  is_available?: boolean;
}

export interface EventSpaceImage {
  id: string;
  event_space: string;
  image: string;
  caption?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

// Currency Types
export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  rate: string;
  is_active: boolean;
}

export interface CurrencyConversionResponse {
  from: string;
  to: string;
  amount: number;
  converted_amount: number;
  rate: string;
}

// Feed Types
export interface FeedItem extends Hotel {
  distance?: number;
  weighted_score?: number;
  display_price?: {
    amount: string;
    currency: string;
    label: string;
  };
}

export interface FeedSection {
  id: string;
  title: string;
  type: 'HORIZONTAL_HOTEL_LIST' | 'GRID_HOTEL_LIST';
  items: FeedItem[];
}

export interface HotelFeed {
  personalized_greeting: string;
  sections: FeedSection[];
}

// Flight / Airport Types
export interface Airport {
  id: string;
  name: string;
  iata_code: string;
  city: string;
  country: string;
  is_major: boolean;
}

// Device Types
export interface DeviceRegistration {
  registration_id: string;
  type: 'android' | 'ios' | 'web';
  name: string;
}

// Facility Types
export type FacilityCategory = 'popular' | 'internet' | 'parking' | 'food' | 'pool' | 'wellness' | 'family' | 'cleaning' | 'business' | 'other';
export interface Facility {
  id: string;
  hotel: string;
  name: string;
  description?: string;
  icon?: string;
  category: FacilityCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Reporting Types
export interface ReportJob {
  id: string;
  hotel: string;
  report_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  result_summary?: any;
  start_date?: string;
  end_date?: string;
  format: string;
  created_at: string;
  completed_at?: string;
}

// Support Ticket Types
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'billing' | 'technical' | 'account' | 'feature_request' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  hotel: string;
  subject: string;
  category: TicketCategory;
  message: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateSupportTicketRequest {
  subject: string;
  category: TicketCategory;
  message: string;
  priority: TicketPriority;
}

// Global Search Types
export interface GlobalSearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
}

export interface GlobalSearchResponse {
  results: {
    bookings?: GlobalSearchResultItem[];
    guests?: GlobalSearchResultItem[];
    rooms?: GlobalSearchResultItem[];
    staff?: GlobalSearchResultItem[];
    [key: string]: GlobalSearchResultItem[] | undefined;
  };
}
