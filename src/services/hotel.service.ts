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
} from '@/types/hotel.types';

class HotelService {
  // ==================== HOTEL MANAGEMENT ====================

  async getMyHotel(): Promise<Hotel> {
    return apiClient.get<Hotel>('/hotel/api/hotel/me/');
  }

  async createHotel(data: CreateHotelRequest): Promise<Hotel> {
    return apiClient.post<Hotel>('/hotel/api/hotel/', data);
  }

  async updateHotel(data: UpdateHotelRequest): Promise<Hotel> {
    return apiClient.patch<Hotel>('/hotel/api/hotel/me/', data);
  }

  async deleteHotel(): Promise<void> {
    return apiClient.delete<void>('/hotel/api/hotel/me/');
  }

  // ==================== ROOM MANAGEMENT ====================

  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    return apiClient.get<Room[]>('/hotel/api/rooms/', { params: filters });
  }

  async getRoom(id: string): Promise<Room> {
    return apiClient.get<Room>(`/hotel/api/rooms/${id}/`);
  }

  async createRoom(data: CreateRoomRequest): Promise<Room> {
    return apiClient.post<Room>('/hotel/api/rooms/', data);
  }

  async updateRoom(id: string, data: UpdateRoomRequest): Promise<Room> {
    return apiClient.patch<Room>(`/hotel/api/rooms/${id}/`, data);
  }

  async deleteRoom(id: string): Promise<void> {
    return apiClient.delete<void>(`/hotel/api/rooms/${id}/`);
  }

  // ==================== BOOKING MANAGEMENT ====================

  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    return apiClient.get<Booking[]>('/hotel/api/bookings/', { params: filters });
  }

  async getBooking(id: string): Promise<Booking> {
    return apiClient.get<Booking>(`/hotel/api/bookings/${id}/`);
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    return apiClient.post<Booking>('/hotel/api/bookings/', data);
  }

  async updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
    return apiClient.patch<Booking>(`/hotel/api/bookings/${id}/`, data);
  }

  async checkIn(id: string, data: CheckInRequest): Promise<Booking> {
    return apiClient.post<Booking>(`/hotel/api/bookings/${id}/check-in/`, data);
  }

  async checkOut(id: string, data: CheckOutRequest): Promise<Booking> {
    return apiClient.post<Booking>(`/hotel/api/bookings/${id}/check-out/`, data);
  }

  async cancelBooking(id: string): Promise<Booking> {
    return apiClient.post<Booking>(`/hotel/api/bookings/${id}/cancel/`);
  }

  // ==================== STAFF MANAGEMENT ====================

  async getStaff(filters?: StaffFilters): Promise<HotelStaff[]> {
    return apiClient.get<HotelStaff[]>('/hotel/api/staff/', { params: filters });
  }

  async getStaffById(id: string): Promise<HotelStaff> {
    return apiClient.get<HotelStaff>(`/hotel/api/staff/${id}/`);
  }

  async inviteStaff(data: InviteStaffRequest): Promise<HotelStaff & { temp_password?: string }> {
    return apiClient.post<HotelStaff & { temp_password?: string }>('/hotel/api/staff/', data);
  }

  async getMyStaffProfile(): Promise<HotelStaff> {
    return apiClient.get<HotelStaff>('/hotel/api/staff/me/');
  }

  async updateMyStaffProfile(data: UpdateStaffProfileRequest): Promise<HotelStaff> {
    return apiClient.put<HotelStaff>('/hotel/api/staff/me/update/', data);
  }

  async changeStaffRole(staffId: string, data: ChangeStaffRoleRequest): Promise<HotelStaff> {
    return apiClient.post<HotelStaff>(`/hotel/api/staff/${staffId}/change-role/`, data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/hotel/api/staff/me/change-password/', data);
  }

  async deleteStaff(id: string): Promise<void> {
    return apiClient.delete<void>(`/hotel/api/staff/${id}/`);
  }

  // ==================== AVAILABILITY ====================

  async checkAvailability(data: CheckAvailabilityRequest): Promise<AvailabilityResponse> {
    return apiClient.post<AvailabilityResponse>('/hotel/api/availability/check/', data);
  }

  async checkRoomAvailability(checkInDate: string, checkOutDate: string): Promise<Room[]> {
    return apiClient.get<Room[]>('/hotel/api/availability/rooms/', {
      params: {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      },
    });
  }

  async getRoomCalendar(roomId: string, params?: RoomCalendarParams): Promise<CalendarDay[]> {
    return apiClient.get<CalendarDay[]>(`/hotel/api/availability/room/${roomId}/calendar/`, { params });
  }

  // ==================== AMENITIES ====================

  async getAmenities(): Promise<Amenity[]> {
    return apiClient.get<Amenity[]>('/hotel/api/amenities/');
  }

  async createAmenity(data: CreateAmenityRequest): Promise<Amenity> {
    return apiClient.post<Amenity>('/hotel/api/amenities/', data);
  }

  async updateAmenity(id: string, data: Partial<CreateAmenityRequest>): Promise<Amenity> {
    return apiClient.patch<Amenity>(`/hotel/api/amenities/${id}/`, data);
  }

  async deleteAmenity(id: string): Promise<void> {
    return apiClient.delete<void>(`/hotel/api/amenities/${id}/`);
  }

  // ==================== POLICIES ====================

  async getPolicies(): Promise<Policy[]> {
    return apiClient.get<Policy[]>('/hotel/api/policies/');
  }

  async createPolicy(data: CreatePolicyRequest): Promise<Policy> {
    return apiClient.post<Policy>('/hotel/api/policies/', data);
  }

  async updatePolicy(id: string, data: Partial<CreatePolicyRequest>): Promise<Policy> {
    return apiClient.patch<Policy>(`/hotel/api/policies/${id}/`, data);
  }

  async deletePolicy(id: string): Promise<void> {
    return apiClient.delete<void>(`/hotel/api/policies/${id}/`);
  }

  // ==================== MEDIA UPLOAD ====================

  async uploadHotelImage(formData: FormData): Promise<{ id: string; image: string }> {
    return apiClient.uploadFile<{ id: string; image: string }>('/hotel/api/upload/hotel-image/', formData);
  }

  async uploadRoomImage(formData: FormData): Promise<{ id: string; image: string }> {
    return apiClient.uploadFile<{ id: string; image: string }>('/hotel/api/upload/room-image/', formData);
  }

  async uploadHotelVideo(formData: FormData): Promise<{ id: string; video: string }> {
    return apiClient.uploadFile<{ id: string; video: string }>('/hotel/api/upload/hotel-video/', formData);
  }

  async deleteHotelImage(id: string): Promise<void> {
    return apiClient.delete<void>(`/hotel/api/upload/hotel-image/${id}/`);
  }

  async deleteRoomImage(id: string): Promise<void> {
    return apiClient.delete<void>(`/hotel/api/upload/room-image/${id}/`);
  }
}

export const hotelService = new HotelService();
