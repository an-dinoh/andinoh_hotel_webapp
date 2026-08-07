"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, TrendingUp, DollarSign, Users, FileText, Download,
  Loader2, CheckCircle2, AlertCircle, RefreshCw, Calendar, FileSpreadsheet, ChevronRight
} from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { ReportJob, DashboardStats, BookingTrend, BookingTrendResponse, RevenueByRoomType } from "@/types/hotel.types";
import { toast } from "react-hot-toast";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [form, setForm] = useState({
    report_type: "revenue_monthly",
    start_date: "",
    end_date: "",
    format: "pdf",
  });
  const [recentJobs, setRecentJobs] = useState<ReportJob[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookingTrends, setBookingTrends] = useState<BookingTrendResponse | null>(null);
  const [revenueByRoomType, setRevenueByRoomType] = useState<RevenueByRoomType[]>([]);

  // Metric toggle for SVG chart: 'revenue' | 'bookings'
  const [chartMetric, setChartMetric] = useState<'revenue' | 'bookings'>('revenue');
  // Hovered data point index for tooltip
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Default zeroed stats to prevent crashes when loading or when API returns empty
  const defaultStats: DashboardStats = {
    today: { check_ins: 0, check_outs: 0, revenue: 0, pending_tasks: 0 },
    performance: { adr: 0, revpar: 0, occupancy_rate: 0, average_rating: 0 },
    volume: { total_bookings: 0, total_revenue: 0, total_reviews: 0 },
    room_stats: { total: 0, available: 0, occupied: 0 }
  };

  const emptyTrends: BookingTrendResponse = {
    series: [],
    summary: { current_period_total: 0, previous_period_total: 0, percentage_change: 0 }
  };

  const fetchAnalyticsData = useCallback(async (silent = false) => {
    if (!silent) setAnalyticsLoading(true);
    try {
      const [dashboardStats, trends, roomRev] = await Promise.all([
        hotelService.getDashboardStats().catch(() => defaultStats),
        hotelService.getBookingTrends().catch((err) => {
          console.warn("Booking trends API fetch failed", err);
          return emptyTrends;
        }),
        hotelService.getRevenueByRoomType().catch((err) => {
          console.warn("Revenue by room type API fetch failed", err);
          return [];
        })
      ]);

      setStats(dashboardStats);
      setBookingTrends(trends || emptyTrends);
      setRevenueByRoomType(roomRev || []);
    } catch (error) {
      console.error("Error loading analytics data", error);
      toast.error("Failed to sync latest analytics data");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Simple polling mechanism for pending jobs
  const updatePendingJobs = useCallback(async () => {
    const pendingJobs = recentJobs.filter(
      job => job.status === "pending" || job.status === "processing"
    );

    if (pendingJobs.length === 0) return;

    let updated = false;
    const newJobs = [...recentJobs];

    for (let i = 0; i < newJobs.length; i++) {
      const job = newJobs[i];
      if (job.status === "pending" || job.status === "processing") {
        try {
          const status = await hotelService.getReportJob(job.id);
          if (status.status !== job.status) {
            newJobs[i] = status;
            updated = true;
          }
        } catch (error) {
          console.error("Failed to fetch job status", error);
        }
      }
    }

    if (updated) {
      setRecentJobs(newJobs);
    }
  }, [recentJobs]);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePendingJobs();
    }, 5000);

    return () => clearInterval(interval);
  }, [updatePendingJobs]);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date) {
      toast.error("Please select a date range");
      return;
    }

    try {
      setLoading(true);
      const newJob = await hotelService.generateReport({
        report_type: form.report_type,
        start_date: form.start_date,
        end_date: form.end_date,
        format: form.format,
      });

      toast.success("Report generation started");
      setRecentJobs(prev => [newJob, ...prev]);
    } catch (error: any) {
      toast.error(error.message || "Failed to start report generation");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "done":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F2EB] text-[#117C35] border border-[#E7F2EB]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-50">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case "pending":
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0F75BD] border border-blue-50">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
            <FileText className="w-3.5 h-3.5" />
            Queued
          </span>
        );
    }
  };

  // SVG Chart Dimensions & Computations
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 35;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const currentSeries = bookingTrends?.series || defaultTrends.series;
  const maxMetricVal = Math.max(
    ...currentSeries.map(d => chartMetric === 'revenue' ? d.value : d.count),
    1
  ) * 1.1; // Add 10% spacing at the top

  const getX = (index: number) => {
    if (currentSeries.length <= 1) return paddingLeft;
    return paddingLeft + (index / (currentSeries.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return svgHeight - paddingBottom - (value / maxMetricVal) * chartHeight;
  };

  // Build a curvy Bezier path command
  let linePath = "";
  if (currentSeries.length > 0) {
    const points = currentSeries.map((d, i) => {
      const val = chartMetric === 'revenue' ? d.value : d.count;
      return { x: getX(i), y: getY(val) };
    });

    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
  }

  const activeStats = stats || defaultStats;

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">

      {/* Page Header */}
      <div className="border-b border-gray-100 py-6 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Analytics & Reports</h1>
          <p className="text-[#5C5B59] mt-1">Generate deep insights and view live performance analytics</p>
        </div>
        <button
          onClick={() => fetchAnalyticsData(true)}
          disabled={analyticsLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-[#1A1A1A] font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-600 ${analyticsLoading ? 'animate-spin' : ''}`} />
          Sync Data
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-6 space-y-8 pb-16">

        {/* Shimmers or Top Analytics Overview Grid */}
        {analyticsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 h-32 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-gray-100 rounded-md w-24"></div>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="h-7 bg-gray-100 rounded-md w-36"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Revenue */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Earnings</span>
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight mt-1">
                    ₦{activeStats.volume.total_revenue.toLocaleString()}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-[#0F75BD]/5 text-[#0F75BD] rounded-xl flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-2">
                <span className="bg-emerald-50 px-1.5 py-0.5 rounded">
                  +{bookingTrends?.summary.percentage_change || 0}%
                </span>
                <span className="text-gray-400 font-normal">compared to last week</span>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Occupancy Rate</span>
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight mt-1">
                    {activeStats.performance.occupancy_rate.toFixed(1)}%
                  </h3>
                </div>
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-2 w-full">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(activeStats.performance.occupancy_rate, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ADR */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Average Daily Rate</span>
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight mt-1">
                    ₦{activeStats.performance.adr.toLocaleString()}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-normal">
                Yield index: {activeStats.volume.total_bookings} bookings logged
              </span>
            </div>

            {/* RevPAR */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">RevPAR</span>
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight mt-1">
                    ₦{activeStats.performance.revpar.toLocaleString()}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-normal">
                Inventory base: {activeStats.room_stats.total} total units
              </span>
            </div>
          </div>
        )}

        {/* Charts & Graph Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Booking & Revenue Trends Line Graph (Custom interactive SVG) */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-[420px] relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Booking & Revenue Trends</h3>
                <p className="text-xs text-gray-500 mt-0.5">Track growth and booking velocity</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${chartMetric === 'revenue' ? "bg-white text-[#0F75BD]" : "text-[#5C5B59] hover:text-[#1A1A1A]"
                    }`}
                >
                  Revenue (₦)
                </button>
                <button
                  onClick={() => setChartMetric('bookings')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${chartMetric === 'bookings' ? "bg-white text-[#0F75BD]" : "text-[#5C5B59] hover:text-[#1A1A1A]"
                    }`}
                >
                  Bookings
                </button>
              </div>
            </div>

            {/* SVG Visual Graph Container */}
            <div className="flex-1 w-full relative group/chart">
              {analyticsLoading ? (
                <div className="w-full h-full bg-gray-50/50 rounded-2xl flex items-center justify-center text-sm text-gray-400 font-semibold animate-pulse">
                  Rendering interactive graphs...
                </div>
              ) : (
                <>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="overflow-visible select-none"
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {/* Horizontal Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => (
                      <line
                        key={ratio}
                        x1={paddingLeft}
                        y1={paddingTop + (1 - ratio) * chartHeight}
                        x2={svgWidth - paddingRight}
                        y2={paddingTop + (1 - ratio) * chartHeight}
                        stroke="#F3F4F6"
                        strokeWidth="1"
                        strokeDasharray="4"
                      />
                    ))}

                    {/* Trend Line Path (Curvy & Slim) */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#0F75BD"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dots along the path */}
                    {currentSeries.map((d, i) => {
                      const val = chartMetric === 'revenue' ? d.value : d.count;
                      const cx = getX(i);
                      const cy = getY(val);
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={hoveredPointIndex === i ? "5" : "3"}
                          fill={hoveredPointIndex === i ? "#0F75BD" : "#FFFFFF"}
                          stroke="#0F75BD"
                          strokeWidth="2"
                          className="transition-all duration-150"
                        />
                      );
                    })}

                    {/* Y-axis Labels */}
                    {[0, 0.5, 1.0].map((ratio) => {
                      const gridVal = ratio * maxMetricVal;
                      const formatVal = chartMetric === 'revenue'
                        ? gridVal >= 1000000
                          ? `₦${(gridVal / 1000000).toFixed(1)}M`
                          : `₦${(gridVal / 1000).toFixed(0)}k`
                        : gridVal.toFixed(0);
                      return (
                        <text
                          key={ratio}
                          x={paddingLeft - 8}
                          y={paddingTop + (1 - ratio) * chartHeight + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="#8F8E8D"
                          fontWeight="bold"
                        >
                          {formatVal}
                        </text>
                      );
                    })}

                    {/* X-axis Labels */}
                    {currentSeries.map((d, i) => (
                      <text
                        key={i}
                        x={getX(i)}
                        y={svgHeight - paddingBottom + 18}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#8F8E8D"
                        fontWeight="bold"
                      >
                        {d.label}
                      </text>
                    ))}

                    {/* Hover vertical guide line */}
                    {hoveredPointIndex !== null && hoveredPointIndex >= 0 && hoveredPointIndex < currentSeries.length && (
                      <line
                        x1={getX(hoveredPointIndex)}
                        y1={paddingTop}
                        x2={getX(hoveredPointIndex)}
                        y2={svgHeight - paddingBottom}
                        stroke="#0F75BD"
                        strokeWidth="1"
                        strokeDasharray="3"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Hover Trigger transparent Columns */}
                    {currentSeries.map((_, i) => {
                      const denominator = currentSeries.length - 1;
                      const colWidth = denominator > 0 ? chartWidth / denominator : chartWidth;
                      const colX = getX(i) - colWidth / 2;
                      return (
                        <rect
                          key={i}
                          x={colX}
                          y={paddingTop}
                          width={colWidth}
                          height={chartHeight}
                          fill="transparent"
                          className="cursor-crosshair"
                          onMouseEnter={() => setHoveredPointIndex(i)}
                        />
                      );
                    })}
                  </svg>

                  {/* Absolute HTML Tooltip overlay */}
                  {hoveredPointIndex !== null && hoveredPointIndex >= 0 && hoveredPointIndex < currentSeries.length && currentSeries[hoveredPointIndex] && (
                    <div
                      className="absolute bg-slate-900/95 text-white px-3 py-2 rounded-xl text-xs font-semibold select-none border border-slate-800 -translate-x-1/2 -translate-y-full -mt-2.5 transition-all duration-150 ease-out z-20 pointer-events-none whitespace-nowrap"
                      style={{
                        left: `${(getX(hoveredPointIndex) / svgWidth) * 100}%`,
                        top: `${(getY(chartMetric === 'revenue' ? currentSeries[hoveredPointIndex].value : currentSeries[hoveredPointIndex].count) / svgHeight) * 100}%`
                      }}
                    >
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {currentSeries[hoveredPointIndex].date}
                      </p>
                      <p className="mt-0.5 text-[#02A5E6]">
                        {chartMetric === 'revenue'
                          ? `Revenue: ₦${currentSeries[hoveredPointIndex].value.toLocaleString()}`
                          : `Bookings: ${currentSeries[hoveredPointIndex].count}`
                        }
                      </p>
                      {chartMetric === 'revenue' && (
                        <p className="text-[10px] text-gray-300 mt-0.5 font-normal">
                          Volume: {currentSeries[hoveredPointIndex].count} bookings
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Revenue By Room Type horizontal bar chart */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-[420px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Revenue by Room Type</h3>
              <p className="text-xs text-gray-500 mt-0.5">Income contribution by category</p>
            </div>

            {analyticsLoading ? (
              <div className="space-y-6 flex-1 justify-center flex flex-col animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-100 rounded w-28"></div>
                      <div className="h-4 bg-gray-100 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-around">
                {revenueByRoomType.length === 0 ? (
                  <div className="text-center py-12 text-sm text-gray-400 font-semibold">
                    No room type records found.
                  </div>
                ) : (
                  revenueByRoomType.slice(0, 5).map((room, idx) => {
                    const totalRev = revenueByRoomType.reduce((sum, r) => sum + r.revenue, 0) || 1;
                    const sharePercentage = (room.revenue / totalRev) * 100;

                    // Curated flat solid brand colors
                    const colorStyles = [
                      "bg-[#0F75BD]",
                      "bg-[#10B981]",
                      "bg-[#FBB81F]",
                      "bg-[#6366F1]"
                    ];

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-800 truncate max-w-[150px] capitalize">
                            {room.room_type.replace(/_/g, " ")}
                          </span>
                          <div className="text-right shrink-0">
                            <span className="font-black text-[#1A1A1A]">
                              ₦{room.revenue.toLocaleString()}
                            </span>
                            <span className="text-gray-400 font-medium ml-1">
                              ({room.bookings_count} bookings)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100/50">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${colorStyles[idx % colorStyles.length]}`}
                            style={{ width: `${sharePercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generate Report Form & Background Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Report parameter select Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0F75BD]" />
                  Generate Report
                </h3>
                <p className="text-xs text-[#5C5B59] mt-1.5 mb-6">Choose a report type and date range to download your report.</p>

                <form onSubmit={handleGenerateReport} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Report Type</label>
                    <select
                      value={form.report_type}
                      onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10"
                    >
                      <option value="revenue_monthly">Revenue (Monthly)</option>
                      <option value="revenue_breakdown">Revenue Breakdown</option>
                      <option value="occupancy_rate">Occupancy Rate</option>
                      <option value="guest_demographics">Guest Demographics</option>
                      <option value="booking_analytics">Booking Analytics</option>
                      <option value="kpi_dashboard">KPI Dashboard</option>
                      <option value="staff_activity">Staff Activity</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={form.start_date}
                          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                          className="w-full rounded-2xl border border-gray-200 pl-4 pr-3 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] [color-scheme:light]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">End Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={form.end_date}
                          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                          className="w-full rounded-2xl border border-gray-200 pl-4 pr-3 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] [color-scheme:light]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Export Format</label>
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, format: "pdf" })}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${form.format === "pdf" ? "bg-white text-[#0F75BD] shadow-none" : "text-[#5C5B59] hover:text-[#1A1A1A]"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          PDF
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, format: "csv" })}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${form.format === "csv" ? "bg-white text-[#0F75BD] shadow-none" : "text-[#5C5B59] hover:text-[#1A1A1A]"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          CSV
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#0F75BD] text-white font-bold text-sm rounded-2xl hover:bg-[#0050C8] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Generate Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Background report jobs tracker */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 h-full flex flex-col min-h-[350px]">
              <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Recent Reports</h3>
                  <p className="text-xs text-gray-500 mt-0.5">View and download your recently generated reports</p>
                </div>
                <button
                  onClick={updatePendingJobs}
                  disabled={recentJobs.length === 0}
                  className="p-2 text-[#0F75BD] hover:bg-[#0F75BD]/5 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                  title="Check latest status"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {recentJobs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-3xl bg-gray-50/20">
                  <div className="w-14 h-14 bg-[#0F75BD]/5 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-[#0F75BD]/40" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">No Recent Reports</h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Reports you generate will show up here to download.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-hide max-h-[300px]">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-gray-200 transition-colors bg-white/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${job.status === 'completed' ? 'bg-[#E7F2EB]/50' :
                          job.status === 'failed' ? 'bg-red-50/50' : 'bg-blue-50/50'
                          }`}>
                          {job.format === 'csv'
                            ? <FileSpreadsheet className={`w-5 h-5 ${job.status === 'completed' ? 'text-[#117C35]' : 'text-[#0F75BD]'
                              }`} />
                            : <FileText className={`w-5 h-5 ${job.status === 'completed' ? 'text-[#117C35]' : 'text-[#0F75BD]'
                              }`} />
                          }
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-gray-900 capitalize truncate max-w-[180px] sm:max-w-xs">
                            {job.report_type.replace(/_/g, " ")} Report
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 mt-1 font-medium">
                            <span className="uppercase text-[9px] font-extrabold text-[#0F75BD] bg-blue-50 px-1.5 py-0.5 rounded">
                              {job.format}
                            </span>
                            <span>•</span>
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            {getStatusBadge(job.status)}
                          </div>
                        </div>
                      </div>

                      {job.status === 'completed' && job.download_url && (
                        <a
                          href={job.download_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 text-[#0F75BD] border border-[#0F75BD]/20 hover:border-[#0F75BD] bg-white hover:bg-[#0F75BD]/5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

