"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { DashboardStats } from "@/types/hotel.types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Import dashboard components
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import BookingsOverviewCard from "@/components/dashboard/BookingsOverviewCard";
import RevenueOverviewCard from "@/components/dashboard/RevenueOverviewCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import ReviewsCard from "@/components/dashboard/ReviewsCard";
import ErrorState from "@/components/ui/ErrorState";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [bookingsTrendData, setBookingsTrendData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, trendsData] = await Promise.all([
        hotelService.getDashboardStats(),
        hotelService.getBookingTrends(),
      ]);

      setStats(statsData);

      if (trendsData && trendsData.length > 0) {
        // Take last 7 days for the chart
        const last7Days = trendsData.slice(-7);
        setRevenueData(last7Days.map(t => parseFloat(t.revenue)));
        setBookingsTrendData(last7Days.map(t => t.count));
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      count: stats?.today_check_ins || 0,
      color: "text-green-600",
      bgColor: "bg-[#E7F2EB]",
    },
    {
      label: "Check-outs Today",
      count: stats?.today_check_outs || 0,
      color: "text-orange-600",
      bgColor: "bg-[#FFF4DF]",
    },
    {
      label: "Total Today",
      count: stats?.total_bookings_today || 0,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  const revenueItems = [
    {
      label: "Today's Revenue",
      amount: `₦${parseFloat(stats?.revenue_today || "0").toLocaleString()}`,
    },
    {
      label: "This Week",
      amount: `₦${parseFloat(stats?.revenue_this_week || "0").toLocaleString()}`,
    },
  ];

  const activityTabs = [
    { id: "gigs" as const, label: "Active Bookings", count: stats?.total_bookings_today || 0 },
    { id: "saved" as const, label: "Pending Tasks", count: stats?.pending_tasks || 0 },
    { id: "posts" as const, label: "Monthly Growth", count: stats?.total_bookings_this_month || 0 },
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
            totalBookings={stats?.total_bookings_this_week || 0}
            stats={bookingStats}
          />

          <RevenueOverviewCard
            totalRevenue={`₦${parseFloat(stats?.revenue_this_month || "0").toLocaleString()}`}
            items={revenueItems}
          />
        </div>

        <AnalyticsChart
          revenueData={revenueData}
          gigsData={bookingsTrendData}
        />

        <ActivitiesSection
          tabs={activityTabs}
        />
      </div>

      <div className="hidden lg:block space-y-6 overflow-y-auto scrollbar-hide pt-8 pb-8 w-80 xl:w-96">
        <PerformanceCard
          userName={currentUser?.full_name || currentUser?.name || "User"}
          userBadge={currentUser?.role === 'hotel_owner' ? "Owner" : "Staff"}
          averageRating={0}
          completionPercentage={stats?.current_occupancy_rate || 0}
          points={0}
          approvedGigs={stats?.total_bookings_this_month || 0}
        />

        <ReviewsCard />
      </div>
    </div>
  );
}
