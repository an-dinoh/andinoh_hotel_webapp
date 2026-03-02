"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { DashboardStats, BookingTrendResponse, SegmentationResponse, WalletStats, RevenueByRoomType } from "@/types/hotel.types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { webSocketService } from "@/services/websocket.service";

// Import dashboard components
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import BookingsOverviewCard from "@/components/dashboard/BookingsOverviewCard";
import RevenueOverviewCard from "@/components/dashboard/RevenueOverviewCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { useCurrency } from "@/contexts/CurrencyContext";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import ReviewsCard from "@/components/dashboard/ReviewsCard";
import ErrorState from "@/components/ui/ErrorState";

export default function DashboardPage() {
  const { activeCurrency } = useCurrency();
  const currencySymbol = activeCurrency?.symbol || "₦";
  const router = useRouter();
  const [currentUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);

  // New States for segmented results
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendResponse, setTrendResponse] = useState<BookingTrendResponse | null>(null);
  const [segmentation, setSegmentation] = useState<SegmentationResponse | null>(null);
  const [wallet, setWallet] = useState<WalletStats | null>(null);
  const [revenueByRoomType, setRevenueByRoomType] = useState<RevenueByRoomType[]>([]);

  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, trendsData, segmentationData, walletData, roomTypeData] = await Promise.all([
        hotelService.getDashboardStats(),
        hotelService.getBookingTrends(),
        hotelService.getSegmentation(),
        hotelService.getWalletStats(),
        hotelService.getRevenueByRoomType(),
      ]);

      setStats(statsData);
      setTrendResponse(trendsData);
      setSegmentation(segmentationData);
      setWallet(walletData);
      setRevenueByRoomType(roomTypeData);

    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Listen for real-time updates to refresh dashboard data
    const removeListener = webSocketService.addListener((payload: any) => {
      if (['booking_update', 'inventory_updated', 'hotel_status_update'].includes(payload.type)) {
        fetchDashboardData();
      }
    });

    return () => {
      removeListener();
    };
  }, []);

  const totalBookings = stats?.volume.total_bookings || 0;
  const activeBookings = stats?.room_stats.occupied || 0;
  const totalRevenue = stats?.volume.total_revenue?.toLocaleString() || "0";
  const occupancyRate = stats?.performance.occupancy_rate || 0;

  // Prepare data for components
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
      title: "Manage Event Spaces",
      description: "Add or update available venues for bookings.",
      buttonText: "View Spaces",
      bgColor: "bg-[#E6EFF6]",
      borderColor: "border-[#065CA8]",
      textColor: "text-[#065CA8]",
      hoverBgColor: "hover:bg-[#065CA8]",
      onClick: () => router.push("/event-spaces"),
    },
  ];

  const bookingStats = [
    {
      label: "Check-ins Today",
      count: stats?.today.check_ins || 0,
      color: "text-green-600",
      bgColor: "bg-[#E7F2EB]",
    },
    {
      label: "Check-outs Today",
      count: stats?.today.check_outs || 0,
      color: "text-orange-600",
      bgColor: "bg-[#FFF4DF]",
    },
    {
      label: "Total Today",
      count: (stats?.today.check_ins || 0) + (stats?.today.check_outs || 0),
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  const revenueItems = [
    {
      label: "Today's Revenue",
      amount: stats?.today.revenue.toLocaleString() || "0",
    },
    {
      label: "Potential (Wallet)",
      amount: wallet?.available_balance.toLocaleString() || "0",
    },
  ];

  const activityTabs = [
    { id: "gigs" as const, label: "Occupancy", count: activeBookings },
    { id: "saved" as const, label: "Pending Tasks", count: stats?.today.pending_tasks || 0 },
    { id: "posts" as const, label: "Review Score", count: stats?.performance.average_rating || 0 },
  ];

  if (loading && !stats) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F75BD]"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="h-full bg-white flex items-center justify-center p-6">
        <ErrorState
          message={error}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-row gap-6">
      <div className="bg-white space-y-6 flex-2 overflow-y-auto scrollbar-hide pt-8 pb-8">
        <WelcomeHeader
          userName={currentUser?.full_name || currentUser?.name || "User"}
          actionCards={welcomeActionCards}
        />

        <div className="bg-white flex flex-row gap-6">
          <BookingsOverviewCard
            totalBookings={totalBookings}
            stats={bookingStats}
          />

          <RevenueOverviewCard
            totalRevenue={totalRevenue}
            items={revenueItems}
          />
        </div>

        <AnalyticsChart
          series={trendResponse?.series || []}
          currency={currencySymbol}
        />

        {/* Room Stats — sourced from dashboard-stats endpoint */}
        {stats?.room_stats && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A]">Room Overview</h3>
                <p className="text-xs text-[#5C5B59] mt-0.5">Live availability from your property</p>
              </div>
              <button
                onClick={() => router.push("/rooms")}
                className="text-xs font-medium text-[#0F75BD] hover:underline"
              >
                Manage Rooms →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Rooms", value: stats.room_stats.total, bg: "bg-[#F5F5F5]", text: "text-[#1A1A1A]" },
                { label: "Available", value: stats.room_stats.available || 0, bg: "bg-[#ECFDF5]", text: "text-green-700" },
                { label: "Occupied", value: stats.room_stats.occupied || 0, bg: "bg-[#FEF3C7]", text: "text-orange-700" },
                { label: "Avg. Rate", value: `${currencySymbol}${stats.performance.adr?.toLocaleString() || "0"}`, bg: "bg-[#F0F9FF]", text: "text-[#0F75BD]" },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-xl p-4`}>
                  <p className="text-xs text-[#5C5B59] mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.text}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <ActivitiesSection
          tabs={activityTabs}
        />
      </div>

      <div className="hidden lg:block space-y-6 overflow-y-auto scrollbar-hide pt-8 pb-8 w-80 xl:w-96">
        <PerformanceCard
          userName={currentUser?.full_name || currentUser?.name || "User"}
          userBadge={currentUser?.role === 'hotel_owner' ? "Owner" : "Staff"}
          averageRating={stats?.performance.average_rating || 0}
          completionPercentage={occupancyRate}
          points={0}
          approvedGigs={totalBookings}
        />

        <ReviewsCard />
      </div>
    </div>
  );
}
