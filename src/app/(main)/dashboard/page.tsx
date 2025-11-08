"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DoorOpen,
  DoorClosed,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { Booking, BookingStatus } from "@/types/hotel.types";
import AnalyticsDatePicker from "@/components/ui/AnalyticsDatePicker";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analyticsView, setAnalyticsView] = useState<"revenue" | "gigs">("revenue");
  const [activeTab, setActiveTab] = useState<"gigs" | "saved" | "posts">("gigs");

  // Chart data - replace with real data later
  const [revenueData] = useState([0, 0, 0, 0, 0, 0, 0]); // 7 data points for the chart
  const [gigsData] = useState([0, 0, 0, 0, 0, 0, 0]); // 7 data points for the chart
  const [completionPercentage] = useState(0); // 0-100 for circular progress
  const [averageRating] = useState(0); // 0-5 rating

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

  // Helper function to generate SVG points from data
  const generateChartPoints = (data: number[], chartHeight: number, chartWidth: number) => {
    if (data.length === 0) return "0,256"; // Default to bottom if no data

    const maxValue = Math.max(...data, 1); // Avoid division by zero
    const pointSpacing = chartWidth / (data.length - 1 || 1);

    return data
      .map((value, index) => {
        const x = index * pointSpacing;
        const y = chartHeight - (value / maxValue) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Calculate circular progress stroke offset
  const calculateStrokeOffset = (percentage: number) => {
    const circumference = 2 * Math.PI * 88; // r=88
    return circumference - (percentage / 100) * circumference;
  };

  useEffect(() => {
    // if (!authService.isAuthenticated()) {
    //   router.push("/login");
    //   return;
    // }
    // fetchDashboardData();
    setLoading(false);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const bookingsData = await hotelService.getBookings({});
      console.log("✅ Bookings response:", bookingsData);

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
    <div className="min-h-screen bg-white flex flex-row gap-6">
      {/* Header 1 */}
      <div className="bg-white space-y-6 flex-2">
        <div className="bg-[#374C3D] text-white space-y-6 border border-gray-200 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Welcome back Adeyanju!
              </h1>
              <p className="mt-2 text-sm">
                Here’s what’s happening on your account today:
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-regular text-gray-200">Today</p>
              <p className="text-sm font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="flex flex-row gap-6">
            {/* Manage Bookings */}
            <div className="bg-[#E7F2EB] border border-[#117C35] rounded-3xl flex-1 transition hover:shadow-md">
              <div className="px-4 py-4 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Manage Bookings
                  </h2>
                  <p className="mt-1 text-sm text-[#5C5B59]">
                    View and update current reservations.
                  </p>
                </div>
                <button className="border border-[#117C35] text-[#117C35] text-sm font-medium rounded-2xl h-[38px] px-5 hover:bg-[#117C35] hover:text-white transition">
                  View Bookings
                </button>
              </div>
            </div>

            {/* Add Funds */}
            <div className="bg-[#E6EFF6] border border-[#065CA8] rounded-3xl flex-1 transition hover:shadow-md">
              <div className="px-4 py-4 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Manage Event Spaces
                  </h2>
                  <p className="mt-1 text-sm text-[#5C5B59]">
                    Add or update available venues for bookings.
                  </p>
                </div>
                <button className="border border-[#065CA8] text-[#065CA8] text-sm font-medium rounded-2xl h-[38px] px-5 hover:bg-[#065CA8] hover:text-white transition">
                  View Spaces
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white flex flex-row gap-6">
          {" "}
          <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-2xl p-4 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-1 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#0B0A07]">
                Gigs Overview (0)
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-[0.5px] border-[#C8CFD5] bg-white rounded-2xl px-4 py-3">
                <span className="text-sm font-medium text-[#3C3B39]">
                  Completed
                </span>
                <span className="text-sm font-medium text-green-600 bg-[#E7F2EB] px-4 py-1 rounded-lg">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between border-[0.5px] border-[#C8CFD5] bg-white rounded-2xl px-4 py-3">
                <span className="text-sm font-medium text-[#3C3B39]">
                  Ongoing
                </span>
                <span className="text-sm font-medium text-orange-600 bg-[#FFF4DF] px-4 py-1 rounded-lg">
                  0
                </span>
              </div>
              <div className="flex items-center justify-between border-[0.5px] border-[#C8CFD5] bg-white rounded-2xl px-4 py-3">
                <span className="text-sm font-medium text-[#EEF0F2">
                  Negotiating
                </span>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1 rounded-lg">
                  0
                </span>
              </div>
            </div>
          </div>
          {/*  */}
          {/* Revenue Overview ($0) */}
          <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-2xl p-4 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-1 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#0B0A07]">
                Revenue Overview ($0)
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white border-[0.5px] border-[#C8CFD5] rounded-2xl py-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3C3B39] mb-1.5">
                      Available Balance
                    </p>
                    <p className="text-xl font-bold text-[#0B0A07]">$ 0</p>
                  </div>
                  <span className="text-sm text-[#5C5B59] bg-[#EEF0F2] w-8 h-8 flex items-center justify-center rounded-full">
                    -%
                  </span>
                </div>
              </div>

              <div className="bg-white border-[0.5px] border-[#C8CFD5] rounded-2xl py-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3C3B39] mb-1.5">
                      Total Spent
                    </p>
                    <p className="text-xl font-bold text-[#0B0A07]">$ 0</p>
                  </div>
                  <span className="text-sm text-[#5C5B59] bg-[#EEF0F2] w-8 h-8 flex items-center justify-center rounded-full">
                    -%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {} */}
        {/* Analytics Overview */}

        <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-2xl p-4 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-1 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#0B0A07]">
               Analytics Overview
              </h2>
            </div>
            <AnalyticsDatePicker/>
          </div>

          {/* Chart Section */}
          <div className="space-y-6">
            {/* Toggle Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAnalyticsView("revenue")}
                className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                  analyticsView === "revenue"
                    ? "bg-[#002968] text-white"
                    : "bg-transparent text-[#5C5B59] hover:bg-gray-100"
                }`}
              >
                Total Revenue
              </button>
              <button
                onClick={() => setAnalyticsView("gigs")}
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
                  analyticsView === "gigs"
                    ? "bg-[#002968] text-white"
                    : "bg-transparent text-[#5C5B59] hover:bg-gray-100"
                }`}
              >
                Total Gigs
              </button>
            </div>

            {/* Amount and Percentage */}
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-bold text-[#0B0A07]">
                {analyticsView === "revenue" ? "$0" : "0"}
              </h1>
              <span className="text-sm text-[#5C5B59] bg-[#EEF0F2] px-3 py-1 rounded-full">
                -%
              </span>
            </div>

            {/* Chart Container */}
            <div className="relative pt-8 pb-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-[#5C5B59]">
                <span>100k</span>
                <span>50k</span>
                <span>20k</span>
                <span>10k</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-12 border-l border-b border-gray-200">
                {/* Grid lines */}
                <div className="relative h-64">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full border-t border-gray-100"
                      style={{ top: `${i * 25}%` }}
                    />
                  ))}

                  {/* Chart line */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      points={generateChartPoints(
                        analyticsView === "revenue" ? revenueData : gigsData,
                        256,
                        512
                      )}
                    />
                    {/* Dots */}
                    {(analyticsView === "revenue" ? revenueData : gigsData).map((value, i) => {
                      const data = analyticsView === "revenue" ? revenueData : gigsData;
                      const maxValue = Math.max(...data, 1);
                      const x = (i * 512) / (data.length - 1 || 1);
                      const y = 256 - (value / maxValue) * 256;
                      return <circle key={i} cx={x} cy={y} r="4" fill="#EF4444" />;
                    })}
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between pt-3 text-xs text-[#5C5B59]">
                  <span>1 - 4</span>
                  <span>5 - 9</span>
                  <span>10 - 14</span>
                  <span>15 - 19</span>
                  <span>20 - 24</span>
                  <span>25 - 29</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            {/* Axis Labels */}
            <div className="flex items-center justify-center gap-8 pt-4 text-sm text-[#5C5B59]">
              <div className="flex items-center gap-2">
                <span>↑</span>
                <span>y-axis: <strong className="text-[#0B0A07]">Amount</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>→</span>
                <span>x-axis: <strong className="text-[#0B0A07]">Days</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Your Activities Section */}
        <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#0B0A07] mb-6">Your Activities</h2>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("gigs")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "gigs"
                  ? "text-[#002968] border-b-2 border-[#002968]"
                  : "text-[#5C5B59] hover:text-[#0B0A07]"
              }`}
            >
              Gigs (0)
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "saved"
                  ? "text-[#002968] border-b-2 border-[#002968]"
                  : "text-[#5C5B59] hover:text-[#0B0A07]"
              }`}
            >
              Saved Gigs (0)
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "text-[#002968] border-b-2 border-[#002968]"
                  : "text-[#5C5B59] hover:text-[#0B0A07]"
              }`}
            >
              Posts (0)
            </button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 bg-gray-200 rounded-3xl flex items-center justify-center mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="h-2 w-16 bg-gray-400 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="h-2 w-16 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-lg font-medium text-[#0B0A07]">
              No Ongoing Project yet!
            </p>
          </div>
        </div>
      </div>

      {/* Performance & Reviews Section */}
      <div className="space-y-6">
        {/* Your Performance Activities */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0B0A07]">
              Your Performance Activities
            </h2>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#0B0A07]">
                Adeyanju Prasie
              </h3>
              <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mt-1">
                Top 100% Clients
              </span>
            </div>
          </div>

          {/* Average Ratings Card */}
          <div className="border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-2xl font-bold text-orange-500">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-base font-medium text-[#5C5B59]">
                Average Ratings
              </span>
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center py-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="552.92"
                    strokeDashoffset={calculateStrokeOffset(completionPercentage)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#0B0A07]">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#5C5B59] mt-4 text-center">
                {completionPercentage === 0 ? (
                  <>
                    No Gig has been
                    <br />
                    completed yet!
                  </>
                ) : (
                  `${completionPercentage}% of gigs completed`
                )}
              </p>
            </div>
          </div>

          {/* Points Card */}
          <div className="border border-gray-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-[#5C5B59] mb-1">Points</p>
            <p className="text-3xl font-bold text-[#0B0A07]">0</p>
          </div>

          {/* Approved Gigs Card */}
          <div className="border border-gray-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5C5B59] mb-1">Approved Gigs</p>
                <p className="text-3xl font-bold text-[#0B0A07]">0</p>
              </div>
              <span className="text-sm text-[#5C5B59]">-%</span>
            </div>
          </div>

          {/* View Profile Button */}
          <button className="w-full border border-gray-300 text-[#0B0A07] py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            View Profile
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Latest Reviews & Ratings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0B0A07]">
              Latest Reviews & Ratings
            </h2>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 bg-gray-200 rounded-3xl flex items-center justify-center mb-4">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-[#0B0A07]">
              No Reviews & Ratings yet!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
