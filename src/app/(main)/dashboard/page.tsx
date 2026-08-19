"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { DashboardStats, BookingTrendResponse, SegmentationResponse, WalletStats, RevenueByRoomType, Booking } from "@/types/hotel.types";
import { useRouter } from "next/navigation";
import { webSocketService } from "@/services/websocket.service";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDashboard } from "@/contexts/DashboardContext";

// Import dashboard components
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import BookingsOverviewCard from "@/components/dashboard/BookingsOverviewCard";
import RevenueOverviewCard from "@/components/dashboard/RevenueOverviewCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import ReviewsCard from "@/components/dashboard/ReviewsCard";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ErrorState from "@/components/ui/ErrorState";

export default function DashboardPage() {
  const { activeCurrency } = useCurrency();
  const {
    stats,
    trendResponse,
    wallet,
    upcomingBookings,
    reviews,
    activities,
    isLoading,
    isRefreshing,
    error,
    fetchDashboardData
  } = useDashboard();

  const currencySymbol = activeCurrency?.symbol || "₦";
  const router = useRouter();
  const [currentUser] = useState(authService.getUser());

  useEffect(() => {
    // Initial fetch on mount - if we already have data, this will be a background refresh
    fetchDashboardData(!!stats);

    const removeListener = webSocketService.addListener((payload: any) => {
      if (['booking_update', 'inventory_updated', 'hotel_status_update'].includes(payload.type)) {
        // Use background refresh for WebSocket updates
        fetchDashboardData(true);
      }
    });

    return () => {
      removeListener();
    };
  }, [fetchDashboardData, stats]);

  const totalBookings = stats?.volume?.total_bookings || 0;
  const activeBookings = stats?.room_stats?.occupied || 0;
  const totalRevenue = stats?.volume?.total_revenue?.toLocaleString() || "0";
  const occupancyRate = stats?.performance?.occupancy_rate || 0;

  const welcomeActionCards = [
    {
      title: "Manage Bookings",
      description: "View and update current reservations.",
      buttonText: "View Bookings",
      bgColor: "bg-[#E7F2EB]",
      borderColor: "border-[#117C35]",
      textColor: "text-[#117C35]",
      hoverBgColor: "hover:bg-[#117C35]",
      onClick: () => router.push("/bookings"),
    },
    {
      title: "Manage Rooms",
      description: "Update availability, pricing, and inventory.",
      buttonText: "View Rooms",
      bgColor: "bg-[#E6EFF6]",
      borderColor: "border-[#065CA8]",
      textColor: "text-[#065CA8]",
      hoverBgColor: "hover:bg-[#065CA8]",
      onClick: () => router.push("/rooms"),
    },
  ];

  const pendingInspectionsCount = upcomingBookings.filter(b => b.booking_status === "confirmed").length;

  const bookingStats = [
    { label: "Check-ins Today", count: stats?.today?.check_ins || 0, color: "text-green-600", bgColor: "bg-[#E7F2EB]" },
    { label: "Check-outs Today", count: stats?.today?.check_outs || 0, color: "text-orange-600", bgColor: "bg-[#FFF4DF]" },
    { label: "Pending Room Inspections", count: pendingInspectionsCount, color: "text-gray-600", bgColor: "bg-gray-100" },
  ];

  const trendPercentage = trendResponse?.summary?.percentage_change !== undefined
    ? `${trendResponse.summary.percentage_change >= 0 ? '+' : ''}${trendResponse.summary.percentage_change.toFixed(1)}%`
    : "Live";

  const revenueItems = [
    { label: "Today's Revenue", amount: stats?.today?.revenue?.toLocaleString() || "0", percentage: trendPercentage },
    { label: "Available Balance", amount: wallet?.available_balance?.toLocaleString() || "0", percentage: "Live" },
  ];

  const activityTabs = [
    { id: "gigs" as const, label: "Occupancy", count: activeBookings },
    { id: "saved" as const, label: "Room Inspections", count: pendingInspectionsCount },
    { id: "posts" as const, label: "Reviews", count: stats?.performance?.average_rating || 0 },
  ];

  if (error && !stats) {
    return (
      <div className="h-full bg-white flex items-center justify-center p-6">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col lg:flex-row gap-8 px-0 py-8 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 max-w-5xl h-full overflow-y-auto scrollbar-hide pb-8">
        <WelcomeHeader
          userName={currentUser?.full_name || currentUser?.name || "User"}
          actionCards={welcomeActionCards}
          loading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingsOverviewCard
            totalBookings={totalBookings}
            stats={bookingStats}
            loading={isLoading}
          />
          <RevenueOverviewCard
            totalRevenue={totalRevenue}
            items={revenueItems}
            loading={isLoading}
          />
        </div>

        <AnalyticsChart
          series={trendResponse?.series || []}
          currency={currencySymbol}
          loading={isLoading}
        />

        {/* Room Stats - Grid for better visual hierarchy */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Live Room Status</h3>
              <p className="text-sm text-[#5C5B59] mt-1">Real-time inventory overview</p>
            </div>
            <button
              onClick={() => router.push("/rooms")}
              className="text-sm font-semibold text-[#0F75BD] hover:underline px-4 py-2 bg-blue-50 rounded-xl transition-colors"
            >
              Manage Inventory →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Inventory", value: stats?.room_stats?.total || 0, color: "text-[#1A1A1A]", bg: "bg-gray-50" },
              { label: "Available Now", value: stats?.room_stats?.available || 0, color: "text-green-600", bg: "bg-green-50" },
              { label: "Current Stay", value: stats?.room_stats?.occupied || 0, color: "text-orange-600", bg: "bg-[#FFF4DF]/50" },
              { label: "Avg Nightly Rate", value: `${currencySymbol}${stats?.performance?.adr?.toLocaleString() || "0"}`, color: "text-[#0F75BD]", bg: "bg-blue-50" },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-2xl p-6 transition-transform hover:scale-[1.02] duration-300`}>
                <p className="text-[10px] font-bold text-[#5C5B59] uppercase tracking-wider mb-2">{item.label}</p>
                <p className={`text-2xl font-black ${item.color}`}>{isLoading ? "..." : item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <ActivitiesSection
          tabs={activityTabs}
          bookings={upcomingBookings}
          reviews={reviews}
          stats={stats}
          loading={isLoading}
        />
      </div>

      {/* Right Sidebar - Sticky on Desktop */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col gap-8 h-full overflow-y-auto scrollbar-hide pb-8">
        <PerformanceCard
          userName={currentUser?.full_name || currentUser?.name || "User"}
          userBadge={currentUser?.role === 'hotel_owner' ? "Owner" : "Staff"}
          averageRating={stats?.performance?.average_rating || 0}
          completionPercentage={occupancyRate}
          occupiedRooms={stats?.room_stats?.occupied || 0}
          approvedGigs={totalBookings}
          loading={isLoading}
        />

        <UpcomingBookings
          bookings={upcomingBookings}
          loading={isLoading}
        />

        <RecentActivity
          activities={activities}
          loading={isLoading}
        />

        <ReviewsCard reviews={reviews} loading={isLoading} />
      </div>
    </div>
  );
}

