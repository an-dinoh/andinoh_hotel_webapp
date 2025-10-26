"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Download,
  Users,
  LogIn,
  LogOut,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  Bed,
  MapPin,
  ChevronDown,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { hotelService } from "@/services/hotel.service";
import { Booking, BookingStatus, PaymentStatus, BookingSource } from "@/types/hotel.types";

export default function BookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<BookingSource | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const filters = statusFilter !== "all" ? { booking_status: statusFilter } : {};
      const data = await hotelService.getBookings(filters);
      console.log("✅ Bookings response:", data);

      // Ensure data is an array
      const bookingsArray = Array.isArray(data) ? data : [];
      setBookings(bookingsArray);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Get today's bookings
  const today = new Date().toISOString().split("T")[0];
  const arrivalsToday = bookings.filter((b) => b.check_in_date === today);
  const departuresToday = bookings.filter((b) => b.check_out_date === today);
  const totalBookingsToday = bookings.filter(
    (b) => b.check_in_date === today || b.check_out_date === today
  );

  // Calculate occupancy (mock calculation - adjust based on actual logic)
  const occupancyRate = bookings.filter((b) => b.booking_status === "checked_in").length;

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
    return configs[status];
  };

  const getPaymentConfig = (status: PaymentStatus) => {
    const configs = {
      paid: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Paid" },
      partial: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Partial" },
      pending: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Pending" },
      refunded: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Refunded" },
    };
    return configs[status];
  };

  const getSourceBadge = (source: BookingSource) => {
    const sources = {
      online: { color: "bg-blue-50 text-blue-700", label: "Online" },
      walk_in: { color: "bg-purple-50 text-purple-700", label: "Walk-in" },
      phone: { color: "bg-green-50 text-green-700", label: "Phone" },
      email: { color: "bg-pink-50 text-pink-700", label: "Email" },
    };
    return sources[source];
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter;
    const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter;
    const matchesSource = sourceFilter === "all" || booking.booking_source === sourceFilter;

    return matchesSearch && matchesStatus && matchesPayment && matchesSource;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/bookings/calendar")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow"
              >
                <CalendarIcon className="w-4 h-4" />
                Calendar View
              </button>
              <button
                onClick={() => router.push("/bookings/create")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Plus className="w-4 h-4" />
                New Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
          {/* Total Bookings Today */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Bookings Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookingsToday.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">All activities</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Arrivals Today */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Arrivals Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{arrivalsToday.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <LogIn className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Check-ins expected</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Departures Today */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Departures Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{departuresToday.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <LogOut className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600">Check-outs expected</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <LogOut className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Currently Occupied */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Currently Occupied</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{occupancyRate}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Rooms occupied</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by guest name, email, phone, or booking reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                {/* Payment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "all")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="all">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Source
                  </label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as BookingSource | "all")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="all">All Sources</option>
                    <option value="online">Online</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredBookings.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{bookings.length}</span> bookings
              </p>
              {(statusFilter !== "all" || paymentFilter !== "all" || sourceFilter !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPaymentFilter("all");
                    setSourceFilter("all");
                    setSearchTerm("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <SkeletonTable rows={8} columns={9} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "Get started by creating your first booking or wait for guests to book online."}
              </p>
              <button
                onClick={() => router.push("/bookings/create")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-4 h-4" />
                Create New Booking
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Booking Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Guest Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stay Period
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.booking_status);
                    const paymentConfig = getPaymentConfig(booking.payment_status);
                    const sourceConfig = getSourceBadge(booking.booking_source);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                      >
                        {/* Booking Reference */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {booking.booking_reference.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {booking.booking_reference}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.created_at || "").toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Guest Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {booking.customer_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {booking.customer_name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{booking.customer_email}</span>
                              </div>
                              {booking.customer_phone && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Phone className="w-3 h-3 flex-shrink-0" />
                                  <span>{booking.customer_phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Stay Period */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{new Date(booking.check_in_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <LogOut className="w-3.5 h-3.5 text-orange-600" />
                              <span>{new Date(booking.check_out_date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-600">
                              {booking.number_of_nights} {booking.number_of_nights === 1 ? "night" : "nights"}
                            </p>
                          </div>
                        </td>

                        {/* Guests */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {booking.number_of_adults}
                              </span>
                            </div>
                            {booking.number_of_children > 0 && (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  {booking.number_of_children}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-900">
                              ${parseFloat(booking.total_amount).toFixed(2)}
                            </p>
                            {booking.amount_paid && parseFloat(booking.amount_paid) > 0 && (
                              <p className="text-xs text-emerald-600 font-medium">
                                ${parseFloat(booking.amount_paid).toFixed(2)} paid
                              </p>
                            )}
                            {booking.balance_due && parseFloat(booking.balance_due) > 0 && (
                              <p className="text-xs text-orange-600 font-medium">
                                ${parseFloat(booking.balance_due).toFixed(2)} due
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${paymentConfig.color}`}
                          >
                            <DollarSign className="w-3 h-3" />
                            {paymentConfig.label}
                          </span>
                        </td>

                        {/* Booking Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Source */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${sourceConfig.color}`}
                          >
                            {sourceConfig.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/bookings/${booking.id}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
