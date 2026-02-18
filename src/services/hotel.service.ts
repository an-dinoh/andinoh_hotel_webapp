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
  RevenueByRoomType,
} from '@/types/hotel.types';

class HotelService {
  // ==================== HOTEL MANAGEMENT ====================

  async getMyHotel(): Promise<Hotel> {
    return apiClient.get<Hotel>('hotels/my-hotel/');
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

  // ==================== ROOM MANAGEMENT ====================

  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    return apiClient.get<Room[]>('hotels/rooms/', { params: filters });
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

  // ==================== BOOKING MANAGEMENT ====================

  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    return apiClient.get<Booking[]>('hotels/bookings/', { params: filters });
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

  // ==================== STAFF MANAGEMENT ====================

  async getStaff(filters?: StaffFilters): Promise<HotelStaff[]> {
    return apiClient.get<HotelStaff[]>('hotels/staff/', { params: filters });
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
    return apiClient.patch<HotelStaff>(`hotels/staff/${staffId}/change-role/`, data);
  }

  async updateStaff(staffId: string, data: Partial<HotelStaff>): Promise<HotelStaff> {
    return apiClient.patch<HotelStaff>(`hotels/staff/${staffId}/`, data);
  }

  async deleteStaff(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/staff/${id}/`);
  }

  async getRoles(): Promise<any[]> {
    return apiClient.get<any[]>('hotels/roles/');
  }

  async deleteRole(id: string): Promise<void> {
    return apiClient.delete<void>(`hotels/roles/${id}/`);
  }

  async getReviews(): Promise<any[]> {
    return apiClient.get<any[]>('hotels/reviews/');
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
    return apiClient.get<Policy[]>('hotel/api/policies/');
  }

  async createPolicy(data: CreatePolicyRequest): Promise<Policy> {
    return apiClient.post<Policy>('hotel/api/policies/', data);
  }

  async updatePolicy(id: string, data: Partial<CreatePolicyRequest>): Promise<Policy> {
    return apiClient.patch<Policy>(`hotel/api/policies/${id}/`, data);
  }

  async deletePolicy(id: string): Promise<void> {
    return apiClient.delete<void>(`hotel/api/policies/${id}/`);
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

  async getBookingTrends(): Promise<BookingTrend[]> {
    return apiClient.get<BookingTrend[]>('hotels/analytics/booking-trends/');
  }

  async getRevenueByRoomType(): Promise<RevenueByRoomType[]> {
    return apiClient.get<RevenueByRoomType[]>('hotels/analytics/revenue-by-room-type/');
  }

  // ==================== EVENT SPACE MANAGEMENT ====================

  async getEventSpaces(filters?: EventSpaceFilters): Promise<EventSpace[]> {
    return apiClient.get<EventSpace[]>('hotels/event-spaces/', { params: filters });
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
}

export const hotelService = new HotelService();
