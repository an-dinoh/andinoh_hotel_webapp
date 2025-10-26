"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  DoorOpen,
  DoorClosed,
  TrendingUp,
  Calendar,
  Bed,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { Booking, BookingStatus } from "@/types/hotel.types";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalBookingsToday: 0,
    occupancyRate: 0,
    revenueToday: "0",
    revenueThisWeek: "0",
    pendingBookings: 0,
    confirmedBookings: 0,
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const bookingsData = await hotelService.getBookings({});
      console.log('✅ Bookings response:', bookingsData);

      const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
      setBookings(bookingsArray.slice(0, 10));

      const today = new Date().toISOString().split("T")[0];
      const todayCheckIns = bookingsArray.filter(
        (b) => b.check_in_date === today
      ).length;
      const todayCheckOuts = bookingsArray.filter(
        (b) => b.check_out_date === today
      ).length;
      const todayBookings = bookingsArray.filter(
        (b) => b.created_at.split("T")[0] === today
      ).length;

      const totalRevenue = bookingsArray
        .filter((b) => b.booking_status !== "cancelled")
        .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

      const pendingBookings = bookingsArray.filter(
        (b) => b.booking_status === "pending"
      ).length;

      const confirmedBookings = bookingsArray.filter(
        (b) => b.booking_status === "confirmed"
      ).length;

      setStats({
        todayCheckIns,
        todayCheckOuts,
        totalBookingsToday: todayBookings,
        occupancyRate: 75,
        revenueToday: totalRevenue.toFixed(2),
        revenueThisWeek: totalRevenue.toFixed(2),
        pendingBookings,
        confirmedBookings,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      checked_in: "bg-blue-100 text-blue-700 border-blue-200",
      checked_out: "bg-gray-100 text-gray-700 border-gray-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      no_show: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status];
  };

  const getStatusIcon = (status: BookingStatus) => {
    const icons = {
      confirmed: <CheckCircle2 className="w-3.5 h-3.5" />,
      pending: <Clock className="w-3.5 h-3.5" />,
      checked_in: <DoorOpen className="w-3.5 h-3.5" />,
      checked_out: <DoorClosed className="w-3.5 h-3.5" />,
      cancelled: <XCircle className="w-3.5 h-3.5" />,
      no_show: <AlertCircle className="w-3.5 h-3.5" />,
    };
    return icons[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Here's an overview of your hotel today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
          {/* Check-Ins Today */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Check-Ins Today
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.todayCheckIns}
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-600 font-medium">12%</span>
                  <span className="text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DoorOpen className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Check-Outs Today */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Check-Outs Today
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.todayCheckOuts}
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-blue-600 font-medium">8%</span>
                  <span className="text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DoorClosed className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* New Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  New Bookings
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalBookingsToday}
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-purple-600 font-medium">24%</span>
                  <span className="text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Occupancy Rate
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.occupancyRate}%
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <ArrowDownRight className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-orange-600 font-medium">3%</span>
                  <span className="text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Bed className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-emerald-100">
                Today's Revenue
              </h3>
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            </div>
            <p className="text-3xl font-bold">${stats.revenueToday}</p>
            <p className="mt-2 text-sm text-emerald-100">
              +15% from yesterday
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Bookings
              </h3>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.pendingBookings}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Awaiting confirmation
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Confirmed Bookings
              </h3>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.confirmedBookings}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Ready for check-in
            </p>
          </div>
            </>
          )}
        </div>

        {/* Recent Bookings Table */}
        {loading ? (
          <SkeletonTable rows={10} columns={6} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Latest reservations from your guests
              </p>
            </div>
            <button
              onClick={() => router.push("/bookings")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#002968] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View All
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-sm font-medium">No bookings yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Bookings will appear here once guests make reservations
                      </p>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {booking.booking_reference}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                            {booking.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.customer_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.customer_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.check_in_date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.check_out_date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${booking.total_amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.booking_status
                          )}`}
                        >
                          {getStatusIcon(booking.booking_status)}
                          {booking.booking_status
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
