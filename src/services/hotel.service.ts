import { apiClient } from '@/utils/api';
import {
  Hotel,
  CreateHotelRequest,
  UpdateHotelRequest,
  Room,
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomFilters,
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingFilters,
  CheckInRequest,
  CheckOutRequest,
  HotelStaff,
  InviteStaffRequest,
  UpdateStaffProfileRequest,
  ChangeStaffRoleRequest,
  ChangePasswordRequest,
  StaffFilters,
  Amenity,
  CreateAmenityRequest,
  Policy,
  CreatePolicyRequest,
  CheckAvailabilityRequest,
  AvailabilityResponse,
  RoomCalendarParams,
  CalendarDay,
  DashboardStats,
  EventSpace,
  CreateEventSpaceRequest,
  UpdateEventSpaceRequest,
  EventSpaceFilters,
  BookingTrend,
  BookingTrendResponse,
  RevenueByRoomType,
  SegmentationResponse,
  WalletStats,
  HotelFeed,
  DeviceRegistration,
  PaginatedResponse,
  Facility,
  PricingRule,
  PhysicalRoom,
  BookingFolio,
  BankAccount,
  WithdrawalRequest,
  ReportJob,
  GlobalSearchResponse,
  SupportTicket,
  CreateSupportTicketRequest,
  StaffActivity,
} from '@/types/hotel.types';

class HotelService {
  // ==================== HOTEL MANAGEMENT ====================

  async getMyHotel(): Promise<Hotel> {
    return apiClient.get<Hotel>('hotels/my-hotel/');
  }

  async getFeed(latitude?: number, longitude?: number): Promise<HotelFeed> {
    return apiClient.get<HotelFeed>('hotels/feed/', {
      params: { latitude, longitude }
    });
  }

  async createHotel(data: CreateHotelRequest): Promise<Hotel> {
    return apiClient.post<Hotel>('hotels/my-hotel/', data);
  }

  async updateHotel(data: UpdateHotelRequest): Promise<Hotel> {
    return apiClient.patch<Hotel>('hotels/my-hotel/', data);
  }

  async deleteHotel(): Promise<void> {
    return apiClient.delete<void>('hotels/my-hotel/');
  }

  async getFacilities(): Promise<Facility[]> {
    return apiClient.get<Facility[]>('hotels/my-hotel/facilities/');
  }

  async createFacility(data: Partial<Facility>): Promise<Facility> {
    return apiClient.post<Facility>('hotels/my-hotel/facilities/', data);
  }

  // ==================== ROOM MANAGEMENT ====================

  async getRooms(filters?: RoomFilters): Promise<PaginatedResponse<Room>> {
    return apiClient.get<PaginatedResponse<Room>>('hotels/rooms/', { params: filters });
  }

  async getRoom(id: string): Promise<Room> {
    return apiClient.get<Room>(`hotels/rooms/${id}/`);
  }

  async createRoom(data: CreateRoomRequest): Promise<Room> {
    return apiClient.post<Room>('hotels/rooms/', data);
  }

  async updateRoom(id: string, data: UpdateRoomRequest): Promise<Room> {
    return apiClient.put<Room>(`hotels/rooms/${id}/`, data);
  }

  async deleteRoom(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/rooms/${id}/`);
  }

  async bulkUpdatePhysicalRooms(data: { room_ids: string[]; status: string; housekeeping_status: string; }): Promise<void> {
    return apiClient.post<void>('hotels/physical-rooms/bulk-update/', data);
  }

  async createPricingRule(typeId: string, data: Partial<PricingRule>): Promise<PricingRule> {
    return apiClient.post<PricingRule>(`hotels/rooms/${typeId}/pricing-rules/`, data);
  }

  // ==================== BOOKING MANAGEMENT ====================

  async getBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    return apiClient.get<PaginatedResponse<Booking>>('hotels/bookings/', { params: filters });
  }

  async getBooking(id: string): Promise<Booking> {
    return apiClient.get<Booking>(`hotels/bookings/${id}/`);
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    return apiClient.post<Booking>('hotels/bookings/', data);
  }

  async updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
    return apiClient.patch<Booking>(`hotels/bookings/${id}/`, data);
  }

  async checkIn(id: string, data: CheckInRequest): Promise<Booking> {
    return apiClient.post<Booking>(`hotels/bookings/${id}/check-in/`, data);
  }

  async checkOut(id: string, data: CheckOutRequest): Promise<Booking> {
    return apiClient.post<Booking>(`hotels/bookings/${id}/check-out/`, data);
  }

  async cancelBooking(id: string): Promise<Booking> {
    return apiClient.post<Booking>(`hotels/bookings/${id}/cancel/`);
  }

  async processPayment(bookingId: string, data: { amount: number; payment_method: string; transaction_id: string }): Promise<void> {
    return apiClient.post<void>(`hotels/bookings/${bookingId}/process-payment/`, data);
  }

  async getFolio(id: string): Promise<BookingFolio> {
    return apiClient.get<BookingFolio>(`hotels/bookings/${id}/folio/`);
  }

  async addIncidental(id: string, data: { service_type: string; amount: string; description: string; }): Promise<void> {
    return apiClient.post<void>(`hotels/bookings/${id}/incidentals/`, data);
  }

  // ==================== STAFF MANAGEMENT ====================

  async getStaff(filters?: StaffFilters): Promise<PaginatedResponse<HotelStaff>> {
    return apiClient.get<PaginatedResponse<HotelStaff>>('hotels/staff/', { params: filters });
  }

  async getStaffById(id: string): Promise<HotelStaff> {
    return apiClient.get<HotelStaff>(`hotels/staff/${id}/`);
  }

  async inviteStaff(data: InviteStaffRequest): Promise<HotelStaff & { temp_password?: string }> {
    return apiClient.post<HotelStaff & { temp_password?: string }>('hotels/staff/', data);
  }

  async activateStaff(staffId: string): Promise<void> {
    return apiClient.post<void>(`hotels/staff/${staffId}/activate/`);
  }

  async changeStaffRole(staffId: string, data: ChangeStaffRoleRequest): Promise<HotelStaff> {
    return apiClient.post<HotelStaff>(`hotels/staff/${staffId}/change-role/`, data);
  }

  async getMyStaffProfile(): Promise<{ staff: HotelStaff; hotel: any; permissions: string[]; is_manager: boolean }> {
    return apiClient.get<{ staff: HotelStaff; hotel: any; permissions: string[]; is_manager: boolean }>('hotels/staff/me/');
  }

  async updateMyStaffProfile(data: UpdateStaffProfileRequest): Promise<HotelStaff> {
    return apiClient.patch<HotelStaff>('hotels/staff/me/update/', data);
  }

  async checkStaffInvitation(email: string): Promise<{ pending: boolean }> {
    return apiClient.get<{ pending: boolean }>('hotels/staff/check-invitation/', { params: { email } });
  }

  async registerStaff(data: any): Promise<HotelStaff> {
    return apiClient.post<HotelStaff>('hotels/staff/register/', data);
  }

  async changeStaffPassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post<void>('hotels/staff/change-password/', data);
  }

  async updateStaff(staffId: string, data: Partial<HotelStaff>): Promise<HotelStaff> {
    return apiClient.patch<HotelStaff>(`hotels/staff/${staffId}/`, data);
  }

  async deleteStaff(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/staff/${id}/`);
  }

  async getRoles(): Promise<PaginatedResponse<any>> {
    return apiClient.get<PaginatedResponse<any>>('hotels/staff/roles/');
  }

  async registerDevice(data: DeviceRegistration): Promise<void> {
    return apiClient.post<void>('customers/devices/', data);
  }

  async deleteRole(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/roles/${id}/`);
  }

  async getPermissions(): Promise<string[]> {
    return apiClient.get<string[]>('hotels/permissions/');
  }

  async createRole(data: { name: string; permissions: string[] }): Promise<any> {
    return apiClient.post<any>('hotels/roles/', data);
  }

  async getRole(id: string): Promise<any> {
    return apiClient.get<any>(`hotels/roles/${id}/`);
  }

  async updateRole(id: string, data: { name: string; permissions: string[] }): Promise<any> {
    return apiClient.put<any>(`hotels/roles/${id}/`, data);
  }

  async getStaffActivity(id: string): Promise<StaffActivity[]> {
    return apiClient.get<StaffActivity[]>(`hotels/staff/${id}/activity/`);
  }

  async getReviews(): Promise<PaginatedResponse<any>> {
    return apiClient.get<PaginatedResponse<any>>('hotels/reviews/');
  }

  // ==================== AVAILABILITY ====================

  async checkAvailability(data: CheckAvailabilityRequest): Promise<AvailabilityResponse> {
    return apiClient.post<AvailabilityResponse>('hotel/api/availability/check/', data);
  }

  async checkRoomAvailability(checkInDate: string, checkOutDate: string): Promise<Room[]> {
    return apiClient.get<Room[]>('hotel/api/availability/rooms/', {
      params: {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      },
    });
  }

  async getRoomCalendar(roomId: string, params?: RoomCalendarParams): Promise<CalendarDay[]> {
    return apiClient.get<CalendarDay[]>(`hotel/api/availability/room/${roomId}/calendar/`, { params });
  }

  // ==================== AMENITIES ====================

  async getAmenities(): Promise<Amenity[]> {
    return apiClient.get<Amenity[]>('hotel/api/amenities/');
  }

  async createAmenity(data: CreateAmenityRequest): Promise<Amenity> {
    return apiClient.post<Amenity>('hotel/api/amenities/', data);
  }

  async updateAmenity(id: string, data: Partial<CreateAmenityRequest>): Promise<Amenity> {
    return apiClient.patch<Amenity>(`hotel/api/amenities/${id}/`, data);
  }

  async deleteAmenity(id: string): Promise<void> {
    return apiClient.delete<void>(`hotel/api/amenities/${id}/`);
  }

  // ==================== POLICIES ====================

  async getPolicies(): Promise<Policy[]> {
    return apiClient.get<Policy[]>('hotels/my-hotel/policies/');
  }

  async createPolicy(data: CreatePolicyRequest): Promise<Policy> {
    return apiClient.post<Policy>('hotels/my-hotel/policies/', data);
  }

  async updatePolicy(id: string, data: Partial<CreatePolicyRequest>): Promise<Policy> {
    return apiClient.patch<Policy>(`hotels/my-hotel/policies/${id}/`, data);
  }

  async deletePolicy(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/my-hotel/policies/${id}/`);
  }

  // ==================== MEDIA UPLOAD ====================

  async uploadHotelImage(formData: FormData): Promise<{ id: string; image: string }> {
    return apiClient.uploadFile<{ id: string; image: string }>('hotel/api/upload/hotel-image/', formData);
  }

  async uploadRoomImage(formData: FormData): Promise<{ id: string; image: string }> {
    return apiClient.uploadFile<{ id: string; image: string }>('hotel/api/upload/room-image/', formData);
  }

  async uploadHotelVideo(formData: FormData): Promise<{ id: string; video: string }> {
    return apiClient.uploadFile<{ id: string; video: string }>('hotel/api/upload/hotel-video/', formData);
  }

  async deleteHotelImage(id: string): Promise<void> {
    return apiClient.delete<void>(`hotel/api/upload/hotel-image/${id}/`);
  }

  async deleteRoomImage(id: string): Promise<void> {
    return apiClient.delete<void>(`hotel/api/upload/room-image/${id}/`);
  }

  // ==================== DASHBOARD & ANALYTICS ====================
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('hotels/dashboard-stats/');
  }

  async getBookingTrends(startDate?: string, endDate?: string): Promise<BookingTrendResponse> {
    return apiClient.get<BookingTrendResponse>('hotels/analytics/booking-trends/', {
      params: { start_date: startDate, end_date: endDate }
    });
  }

  async getRevenueByRoomType(): Promise<RevenueByRoomType[]> {
    return apiClient.get<RevenueByRoomType[]>('hotels/analytics/revenue-by-room-type/');
  }

  async getSegmentation(): Promise<SegmentationResponse> {
    return apiClient.get<SegmentationResponse>('hotels/analytics/segmentation/');
  }

  async generateReport(data: { report_type: string; start_date: string; end_date: string; format: string; }): Promise<any> {
    return apiClient.post<any>('hotels/reports/generate/', data);
  }

  async getReportJob(jobId: string): Promise<ReportJob> {
    return apiClient.get<ReportJob>(`hotels/reports/jobs/${jobId}/`);
  }

  async getWalletStats(): Promise<WalletStats> {
    return apiClient.get<WalletStats>('hotels/wallet/stats/');
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    return apiClient.get<BankAccount[]>('hotels/wallet/bank-accounts/');
  }

  async createBankAccount(data: Partial<BankAccount>): Promise<BankAccount> {
    return apiClient.post<BankAccount>('hotels/wallet/bank-accounts/', data);
  }

  async requestWithdrawal(data: { amount: string; bank_account_id: string; }): Promise<WithdrawalRequest> {
    return apiClient.post<WithdrawalRequest>('hotels/wallet/withdraw/', data);
  }

  // ==================== EVENT SPACE MANAGEMENT ====================

  async getEventSpaces(filters?: EventSpaceFilters): Promise<PaginatedResponse<EventSpace>> {
    return apiClient.get<PaginatedResponse<EventSpace>>('hotels/event-spaces/', { params: filters });
  }

  async getEventSpace(id: string): Promise<EventSpace> {
    return apiClient.get<EventSpace>(`hotels/event-spaces/${id}/`);
  }

  async createEventSpace(data: CreateEventSpaceRequest): Promise<EventSpace> {
    return apiClient.post<EventSpace>('hotels/event-spaces/', data);
  }

  async updateEventSpace(id: string, data: UpdateEventSpaceRequest): Promise<EventSpace> {
    return apiClient.patch<EventSpace>(`hotels/event-spaces/${id}/`, data);
  }

  async deleteEventSpace(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/event-spaces/${id}/`);
  }

  async checkEventSpaceAvailability(id: string, date: string): Promise<any> {
    return apiClient.get<any>(`hotels/event-spaces/${id}/availability/`, { params: { date } });
  }

  async createEventBooking(data: any): Promise<any> {
    return apiClient.post<any>('hotels/event-bookings/', data);
  }

  // ==================== SEARCH & SUPPORT ====================
  async globalSearch(query: string): Promise<GlobalSearchResponse> {
    return apiClient.get<GlobalSearchResponse>('hotels/search/global/', { params: { q: query } });
  }

  async createSupportTicket(data: CreateSupportTicketRequest): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>('support/tickets/', data);
  }
}

export const hotelService = new HotelService();
