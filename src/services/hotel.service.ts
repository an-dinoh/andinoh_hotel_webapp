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
  WalletTransaction,
  WithdrawalRequest,
  ReportJob,
  GlobalSearchResponse,
  SupportTicket,
  CreateSupportTicketRequest,
  StaffActivity,
} from '@/types/hotel.types';

class HotelService {
  // ==================== HOTEL MANAGEMENT ====================

  async getMyHotel(): Promise<Hotel | null> {
    try {
      return await apiClient.get<Hotel>('hotels/my-hotel/');
    } catch {
      return null;
    }
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

  async bulkUpdatePhysicalRooms(data: { room_ids: string[]; status?: string; housekeeping_status?: string; is_available?: boolean;[key: string]: any }): Promise<void> {
    return apiClient.post<void>('hotels/physical-rooms/bulk-update/', data);
  }

  async getAllPhysicalRooms(filters?: any): Promise<PaginatedResponse<PhysicalRoom>> {
    try {
      // 1. Try the global endpoint first
      return await apiClient.get<PaginatedResponse<PhysicalRoom>>('hotels/physical-rooms/', { params: filters });
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Global physical-rooms endpoint not found (404). Falling back to category-based aggregation...');

        // 2. Fetch all categories (large page size to get all)
        const categories = await this.getRooms({ page_size: 100 });

        // 3. Fetch physical rooms for each category concurrently
        const unitPromises = categories.results.map(category =>
          this.getPhysicalRooms(category.id, { page_size: 100 }).catch(err => {
            console.error(`Failed to fetch units for category ${category.id}:`, err);
            return { count: 0, results: [], next: null, previous: null } as PaginatedResponse<PhysicalRoom>;
          })
        );

        const results = await Promise.all(unitPromises);

        // 4. Flatten and aggregate with normalization and category attachment
        const allUnits = results.flatMap((r, index) => {
          const categoryId = categories.results[index].id;
          return r.results.map(unit => ({
            ...unit,
            room_type: categoryId, // Ensure the link to the category is preserved
            status: unit.status || ((unit as any).is_available ? 'available' : 'occupied')
          }));
        });

        // Note: Pagination/filtering in this fallback is limited
        return {
          count: allUnits.length,
          results: allUnits,
          next: null,
          previous: null
        };
      }
      throw error;
    }
  }

  async getPhysicalRooms(typeId: string, filters?: any): Promise<PaginatedResponse<PhysicalRoom>> {
    return apiClient.get<PaginatedResponse<PhysicalRoom>>(`hotels/rooms/${typeId}/physical-rooms/`, { params: filters });
  }

  async updatePhysicalRoom(id: string, data: Partial<PhysicalRoom>): Promise<PhysicalRoom> {
    try {
      // Map frontend 'status' to backend 'is_available' if necessary
      const payload: any = { ...data };
      if (data.status) {
        payload.is_available = data.status === 'available';
      }

      // Try individual PATCH first
      return await apiClient.patch<PhysicalRoom>(`hotels/physical-rooms/${id}/`, payload);
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn('Individual physical-room PATCH failed. Proxying via bulk-update...');

        const bulkPayload: any = {
          room_ids: [id],
          status: data.status,
          housekeeping_status: data.housekeeping_status,
          is_available: data.status === 'available'
        };

        await this.bulkUpdatePhysicalRooms(bulkPayload);

        // Return updated object instance since bulk-update response body is empty
        return { id, ...data } as PhysicalRoom;
      }
      throw error;
    }
  }

  async deletePhysicalRoom(id: string): Promise<void> {
    try {
      return await apiClient.delete<void>(`hotels/physical-rooms/${id}/`);
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn('Individual physical-room DELETE is not yet implemented on the backend.');
        throw new Error('Deletion is currently not supported by the API. Please contact the backend team.');
      }
      throw error;
    }
  }

  async createPhysicalRoom(typeId: string, data: Partial<PhysicalRoom>): Promise<PhysicalRoom> {
    return apiClient.post<PhysicalRoom>(`hotels/rooms/${typeId}/physical-rooms/`, data);
  }

  async getPricingRules(typeId: string): Promise<PaginatedResponse<PricingRule>> {
    return apiClient.get<PaginatedResponse<PricingRule>>(`hotels/rooms/${typeId}/pricing-rules/`);
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

  async initiatePayment(bookingId: string, redirectUrl: string): Promise<any> {
    return apiClient.post<any>(`bookings/${bookingId}/pay/`, { redirect_url: redirectUrl });
  }

  async verifyPayment(bookingId: string, data: { transaction_id?: string; tx_ref?: string }): Promise<any> {
    return apiClient.post<any>(`bookings/${bookingId}/verify-payment/`, data);
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
    return apiClient.uploadFile<{ id: string; image: string }>('hotel/upload/hotel-image/', formData);
  }

  async uploadRoomImage(formData: FormData): Promise<{ id: string; image: string }> {
    return apiClient.uploadFile<{ id: string; image: string }>('hotel/upload/room-image/', formData);
  }

  async uploadHotelVideo(formData: FormData): Promise<{ id: string; video: string }> {
    return apiClient.uploadFile<{ id: string; video: string }>('hotel/upload/hotel-video/', formData);
  }

  async deleteHotelImage(id: string): Promise<void> {
    return apiClient.delete<void>(`hotel/upload/hotel-image/${id}/`);
  }

  async deleteRoomImage(id: string): Promise<void> {
    return apiClient.delete<void>(`hotel/upload/room-image/${id}/`);
  }

  // ==================== DASHBOARD & ANALYTICS ====================
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const stats = await apiClient.get<DashboardStats>('hotels/dashboard-stats/');
      // Trust the backend's response. Only synthesize if the API throws.
      if (!stats) throw new Error('Empty response');
      return stats;
    } catch (error) {
      console.warn('Dashboard stats endpoint unavailable or incomplete. Synthesizing data...');

      const today = new Date().toISOString().split('T')[0];

      // Fetch data needed for synthesis
      const [allBookings, checkIns, checkOuts, rooms, units] = await Promise.all([
        this.getBookings().catch(() => ({ count: 0, results: [] })),
        this.getBookings({ check_in_from: today, check_in_to: today }).catch(() => ({ count: 0, results: [] })),
        this.getBookings({ check_out_from: today, check_out_to: today }).catch(() => ({ count: 0, results: [] })),
        this.getRooms({ page_size: 100 }).catch(() => ({ count: 0, results: [] })),
        this.getAllPhysicalRooms({ page_size: 100 }).catch(() => ({ count: 0, results: [] })),
      ]);

      const totalBookings = allBookings.count || allBookings.results.length;
      const totalUnits = units.count || units.results.length;
      const occupiedUnits = units.results.filter(u => u.status === 'occupied').length;

      // Calculate revenue if possible (sum of total_amount for all bookings)
      // This is a rough estimation for "Today's Revenue" in synthesize mode
      const todayRevenue = allBookings.results
        .filter(b => b.created_at?.startsWith(today))
        .reduce((sum, b) => sum + parseFloat(b.total_amount || '0'), 0);

      const totalRevenue = allBookings.results
        .reduce((sum, b) => sum + parseFloat(b.total_amount || '0'), 0);

      // Synthesize DashboardStats object
      return {
        today: {
          check_ins: checkIns.count || checkIns.results.length,
          check_outs: checkOuts.count || checkOuts.results.length,
          revenue: todayRevenue,
          pending_tasks: units.results.filter(u => u.housekeeping_status === 'dirty').length
        },
        performance: {
          adr: totalBookings > 0 ? totalRevenue / totalBookings : 0,
          revpar: totalUnits > 0 ? totalRevenue / totalUnits : 0,
          occupancy_rate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
          average_rating: 4.5 // Default placeholder
        },
        volume: {
          total_bookings: totalBookings,
          total_revenue: totalRevenue,
          total_reviews: 0
        },
        room_stats: {
          // Use the actual unit count from the DB, not a sum of category integers (which can be stale)
          total: units.count || units.results.length,
          available: units.results.filter(u => u.status === 'available').length,
          occupied: occupiedUnits
        }
      };
    }
  }

  async getBookingTrends(startDate?: string, endDate?: string): Promise<BookingTrendResponse> {
    try {
      return await apiClient.get<BookingTrendResponse>('hotels/analytics/booking-trends/', {
        params: { start_date: startDate, end_date: endDate }
      });
    } catch {
      return { total_bookings: 0, trends: [] } as unknown as BookingTrendResponse;
    }
  }

  async getRevenueByRoomType(): Promise<RevenueByRoomType[]> {
    try {
      return await apiClient.get<RevenueByRoomType[]>('hotels/analytics/revenue-by-room-type/');
    } catch {
      return [] as unknown as RevenueByRoomType[];
    }
  }

  async getSegmentation(): Promise<SegmentationResponse> {
    try {
      return await apiClient.get<SegmentationResponse>('hotels/analytics/segmentation/');
    } catch {
      return { direct: 0, ota: 0, corporate: 0, walk_in: 0 } as unknown as SegmentationResponse;
    }
  }

  async generateReport(data: { report_type: string; start_date: string; end_date: string; format: string; }): Promise<any> {
    return apiClient.post<any>('hotels/reports/generate/', data);
  }

  async getReportJob(jobId: string): Promise<ReportJob> {
    return apiClient.get<ReportJob>(`hotels/reports/jobs/${jobId}/`);
  }

  async getWalletStats(): Promise<WalletStats> {
    try {
      return await apiClient.get<WalletStats>('hotels/wallet/');
    } catch {
      return {
        balance: '0.00',
        currency: 'NGN',
        total_earnings: '0.00',
        pending_withdrawals: '0.00',
        account_number: '',
        bank_name: '',
      } as unknown as WalletStats;
    }
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

  async getWalletLedger(filters?: any): Promise<PaginatedResponse<WalletTransaction>> {
    return apiClient.get<PaginatedResponse<WalletTransaction>>('hotels/wallet/transactions/', { params: filters });
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
