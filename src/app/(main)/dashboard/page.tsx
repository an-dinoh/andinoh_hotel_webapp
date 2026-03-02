"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { DashboardStats, BookingTrendResponse, SegmentationResponse, WalletStats, RevenueByRoomType, Booking } from "@/types/hotel.types";
import { useRouter } from "next/navigation";
import { webSocketService } from "@/services/websocket.service";
import { useCurrency } from "@/contexts/CurrencyContext";

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
  const currencySymbol = activeCurrency?.symbol || "₦";
  const router = useRouter();
  const [currentUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendResponse, setTrendResponse] = useState<BookingTrendResponse | null>(null);
  const [wallet, setWallet] = useState<WalletStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch core stats
      const [statsData, trendsData, walletData, bookingsData] = await Promise.all([
        hotelService.getDashboardStats().catch(() => null),
        hotelService.getBookingTrends().catch(() => null),
        hotelService.getWalletStats().catch(() => null),
        hotelService.getBookings({ booking_status: 'confirmed' }).catch(() => ({ results: [] })),
      ]);

      setStats(statsData);
      setTrendResponse(trendsData);
      setWallet(walletData);
      setUpcomingBookings(bookingsData.results);

      // Mock some real-world activities for the premium feel
      setActivities([
        { id: '1', type: 'booking', title: 'New Booking', timestamp: '2 mins ago', description: 'John Doe booked Deluxe Room for 3 nights.' },
        { id: '2', type: 'payment', title: 'Payment Received', timestamp: '15 mins ago', description: 'Confirmed payment of ₦45,000 for Booking #BK-9021.' },
        { id: '3', type: 'system', title: 'Daily Report Ready', timestamp: '1 hour ago', description: 'The performance report for Feb 28 is now available.' },
        { id: '4', type: currentUser?.role === 'staff' ? 'staff' : 'system', title: 'Room Cleaned', timestamp: '2 hours ago', description: 'Room 204 has been marked as Clean by Housekeeping.' },
      ]);

    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

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
      description: "Add or update available venues.",
      buttonText: "View Spaces",
      bgColor: "bg-[#E6EFF6]",
      borderColor: "border-[#065CA8]",
      textColor: "text-[#065CA8]",
      hoverBgColor: "hover:bg-[#065CA8]",
      onClick: () => router.push("/event-spaces"),
    },
  ];

  const bookingStats = [
    { label: "Check-ins Today", count: stats?.today.check_ins || 0, color: "text-green-600", bgColor: "bg-[#E7F2EB]" },
    { label: "Check-outs Today", count: stats?.today.check_outs || 0, color: "text-orange-600", bgColor: "bg-[#FFF4DF]" },
    { label: "Pending Tasks", count: stats?.today.pending_tasks || 0, color: "text-gray-600", bgColor: "bg-gray-100" },
  ];

  const revenueItems = [
    { label: "Today's Revenue", amount: stats?.today.revenue.toLocaleString() || "0", percentage: "+12%" },
    { label: "Available Balance", amount: wallet?.available_balance.toLocaleString() || "0", percentage: "Live" },
  ];

  const activityTabs = [
    { id: "gigs" as const, label: "Occupancy", count: activeBookings },
    { id: "saved" as const, label: "Tasks", count: stats?.today.pending_tasks || 0 },
    { id: "posts" as const, label: "Reviews", count: stats?.performance.average_rating || 0 },
  ];

  if (error && !stats) {
    return (
      <div className="h-full bg-white flex items-center justify-center p-6">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 max-w-5xl h-full overflow-y-auto scrollbar-hide pb-8">
        <WelcomeHeader
          userName={currentUser?.full_name || currentUser?.name || "User"}
          actionCards={welcomeActionCards}
          loading={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingsOverviewCard
            totalBookings={totalBookings}
            stats={bookingStats}
            loading={loading}
          />
          <RevenueOverviewCard
            totalRevenue={totalRevenue}
            items={revenueItems}
            loading={loading}
          />
        </div>

        <AnalyticsChart
          series={trendResponse?.series || []}
          currency={currencySymbol}
          loading={loading}
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
              { label: "Total Inventory", value: stats?.room_stats.total || 0, color: "text-[#1A1A1A]", bg: "bg-gray-50" },
              { label: "Available Now", value: stats?.room_stats.available || 0, color: "text-green-600", bg: "bg-green-50" },
              { label: "Current Stay", value: stats?.room_stats.occupied || 0, color: "text-orange-600", bg: "bg-[#FFF4DF]/50" },
              { label: "Avg Nightly Rate", value: `${currencySymbol}${stats?.performance.adr?.toLocaleString() || "0"}`, color: "text-[#0F75BD]", bg: "bg-blue-50" },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-2xl p-6 transition-transform hover:scale-[1.02] duration-300`}>
                <p className="text-[10px] font-bold text-[#5C5B59] uppercase tracking-wider mb-2">{item.label}</p>
                <p className={`text-2xl font-black ${item.color}`}>{loading ? "..." : item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <ActivitiesSection tabs={activityTabs} />
      </div>

      {/* Right Sidebar - Sticky on Desktop */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col gap-8 h-full overflow-y-auto scrollbar-hide pb-8">
        <PerformanceCard
          userName={currentUser?.full_name || currentUser?.name || "User"}
          userBadge={currentUser?.role === 'hotel_owner' ? "Owner" : "Staff"}
          averageRating={stats?.performance.average_rating || 0}
          completionPercentage={occupancyRate}
          points={0}
          approvedGigs={totalBookings}
          loading={loading}
        />

        <UpcomingBookings
          bookings={upcomingBookings}
          loading={loading}
        />

        <RecentActivity
          activities={activities}
          loading={loading}
        />

        <ReviewsCard loading={loading} />
      </div>
    </div>
  );
}

