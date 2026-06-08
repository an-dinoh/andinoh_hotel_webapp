"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Calendar as CalendarIcon, LogIn, LogOut, CheckCircle, XCircle, Clock, ChevronDown, Loader2 } from "lucide-react";
import { Booking, BookingStatus } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";

// Module-level cache to persist data across client-side page transitions
let cachedBookings: Booking[] = [];
let cachedStats: any = null;
let cachedTotalItems = 0;
let hasLoadedOnce = false;

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(cachedBookings);
  const [stats, setStats] = useState<any>(cachedStats); // Using any to avoid strict type issues with DashboardStats during dev
  const [loading, setLoading] = useState(!hasLoadedOnce);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(cachedTotalItems);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchBookings = async () => {
    try {
      if (!hasLoadedOnce) {
        setLoading(true);
      }

      const filters: any = {
        page: currentPage,
        page_size: itemsPerPage,
      };

      if (statusFilter !== "all") {
        filters.booking_status = statusFilter;
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const [bookingsRes, statsRes] = await Promise.all([
        hotelService.getBookings(filters),
        hotelService.getDashboardStats()
      ]);

      const results = Array.isArray(bookingsRes?.results) ? bookingsRes.results : [];
      setBookings(results);
      setTotalItems(bookingsRes?.count || 0);
      setStats(statsRes);

      // Save to cache
      cachedBookings = results;
      cachedStats = statsRes;
      cachedTotalItems = bookingsRes?.count || 0;
      hasLoadedOnce = true;
    } catch (error: any) {
      // A 404 means the requested page is out of range (e.g. filter narrowed results).
      // Reset to page 1 silently rather than showing an error toast.
      if (error.message === 'Resource not found' || error.response?.status === 404) {
        if (currentPage > 1) {
          setCurrentPage(1);
          return; // useEffect will re-run with page=1
        }
        setBookings([]);
        setTotalItems(0);
      } else {
        console.error("Error fetching bookings:", error);
        toast.error(error.message || "Failed to fetch bookings");
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Stats from backend
  const arrivalsToday = stats?.today?.check_ins || 0;
  const departuresToday = stats?.today?.check_outs || 0;
  const totalBookings = stats?.volume?.total_bookings || 0;
  const activeBookings = stats?.room_stats?.occupied || 0;

  const getStatusConfig = (status: BookingStatus) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle,
        label: "Confirmed",
      },
      checked_in: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: LogIn,
        label: "Checked In",
      },
      checked_out: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: LogOut,
        label: "Checked Out",
      },
      cancelled: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
        label: "Cancelled",
      },
      no_show: {
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: XCircle,
        label: "No Show",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };


  // Use bookings directly since backend handles filtering
  const paginatedBookings = bookings;

  // Total pages from backend based on the count of the current filtered results
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Bookings</h1>
            <p className="text-[#5C5B59] mt-1">Manage your hotel bookings and reservations</p>
          </div>
          <button
            onClick={() => router.push("/bookings/create")}
            className="px-4 py-2.5 bg-[#0F75BD] text-sm text-white font-regular rounded-2xl hover:bg-[#0050C8] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Booking
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: totalBookings, bg: "bg-[#F5F5F5]" },
            { label: "Check-ins Today", value: arrivalsToday, bg: "bg-[#F0F9FF]" },
            { label: "Check-outs Today", value: departuresToday, bg: "bg-[#FEF3C7]" },
            { label: "Active", value: activeBookings, bg: "bg-[#F5F3FF]" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-2xl p-5 relative overflow-hidden`}>
              {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />}
              <p className="text-[#5C5B59] text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters Bar */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings by name, email, or reference..."
              className="w-full pl-10 pr-3 py-2 border border-[#D3D9DD] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
            className="px-4 py-2 border border-[#D3D9DD] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0F75BD] animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-3xl p-16 text-center">
            <div className="w-16 h-16 bg-[#0F75BD]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-[#0F75BD]" />
            </div>
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">No bookings found</h3>
            <p className="text-[#5C5B59] text-sm mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first booking"}
            </p>
            <button
              onClick={() => router.push("/bookings/create")}
              className="px-4 py-2.5 bg-[#0F75BD] text-sm text-white font-regular rounded-2xl hover:bg-[#0050C8] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Booking
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Guest
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Check-in
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Check-out
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Nights
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking: any) => {
                    const statusConfig = getStatusConfig(booking.booking_status);

                    // Use standardized guest_details from backend
                    const guestName = booking.guest_details?.full_name || "Guest";
                    const guestEmail = booking.guest_details?.email || "No email";
                    const guestPhone = booking.guest_details?.phone_number || "";

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-[#FAFAFB] transition-colors cursor-pointer"
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                      >
                        {/* Guest */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0F75BD] rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {guestName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A1A]">
                                {guestName}
                              </p>
                              <p className="text-xs text-[#5C5B59]">
                                {guestEmail}
                              </p>
                              {guestPhone && (
                                <p className="text-[10px] text-[#8F8E8D] mt-0.5">
                                  {guestPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Check-in */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#1A1A1A]">
                            {new Date(booking.check_in_date).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Check-out */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#1A1A1A]">
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Nights */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[#1A1A1A]">{booking.number_of_nights}</p>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            ₦{parseFloat(booking.total_amount).toFixed(2)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/bookings/${booking.id}`);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-[#0F75BD] hover:bg-[#0F75BD]/10 rounded-lg transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 m-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 rotate-90 text-[#5C5B59] text-xs" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum === 2 && currentPage > 3 && totalPages > 5) {
                    return <span key="dots1" className="px-2 text-[#5C5B59]">...</span>;
                  }
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 2 && totalPages > 5) {
                    return <span key="dots2" className="px-2 text-[#5C5B59]">...</span>;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${currentPage === pageNum
                        ? "bg-[#0F75BD] text-white"
                        : "hover:bg-[#FAFAFB] text-[#1A1A1A] font-regular"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 hover:bg-[#FAFAFB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90 text-[#5C5B59]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
