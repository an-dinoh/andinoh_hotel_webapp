"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  ArrowRight, 
  Info,
  ExternalLink,
  Plus
} from "lucide-react";
import { Booking, PhysicalRoom, Room, BookingStatus, RoomStatus } from "@/types/hotel.types";
import { motion, AnimatePresence } from "framer-motion";

interface BookingCalendarProps {
  bookings: Booking[];
  physicalRooms: PhysicalRoom[];
  roomCategories: Room[];
  onRefresh: () => void;
}

export default function BookingCalendar({
  bookings,
  physicalRooms,
  roomCategories,
  onRefresh,
}: BookingCalendarProps) {
  const router = useRouter();

  // Calendar display states
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [viewDays, setViewDays] = useState<number>(30); // 7, 14, 30
  const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Column width configuration based on zoom/days view
  const colWidth = useMemo(() => {
    if (viewDays === 7) return 120;
    if (viewDays === 14) return 96;
    return 70; // 30 days view
  }, [viewDays]);

  // Generate list of dates for the horizontal header
  const dates = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < viewDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [startDate, viewDays]);

  // Timeline boundaries
  const timelineStart = useMemo(() => {
    const d = new Date(dates[0]);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [dates]);

  const timelineEnd = useMemo(() => {
    const d = new Date(dates[dates.length - 1]);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [dates]);

  // Map category ID to Category Object for easy lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, Room>();
    roomCategories.forEach((c) => map.set(c.id, c));
    return map;
  }, [roomCategories]);

  // Group physical rooms by their room category
  const groupedRooms = useMemo(() => {
    const groups: { [categoryId: string]: PhysicalRoom[] } = {};
    physicalRooms.forEach((room) => {
      const catId = room.room_type;
      if (!groups[catId]) {
        groups[catId] = [];
      }
      groups[catId].push(room);
    });

    // Sort room numbers within each category
    Object.keys(groups).forEach((catId) => {
      groups[catId].sort((a, b) => a.room_number.localeCompare(b.room_number, undefined, { numeric: true }));
    });

    return groups;
  }, [physicalRooms]);

  // Filter bookings to find "Unassigned" (no physical room, or TBD)
  const unassignedBookings = useMemo(() => {
    return bookings.filter((b) => {
      const hasRoom = b.rooms && b.rooms.length > 0;
      if (!hasRoom) return true;
      // If all rooms are TBD, it is unassigned
      return b.rooms?.every((r: any) => !r.room_number || r.room_number.includes("TBD")) ?? false;
    });
  }, [bookings]);

  // Helper: check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  // Helper: check if two dates are the same calendar day
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Date Navigation handlers
  const handlePrev = () => {
    const nextStart = new Date(startDate);
    nextStart.setDate(startDate.getDate() - viewDays);
    setStartDate(nextStart);
  };

  const handleNext = () => {
    const nextStart = new Date(startDate);
    nextStart.setDate(startDate.getDate() + viewDays);
    setStartDate(nextStart);
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);
  };

  // Status configuration mappings
  const getBookingStatusConfig = (status: BookingStatus) => {
    const configs = {
      pending: {
        bg: "from-amber-50/95 to-amber-100/95 hover:from-amber-100 hover:to-amber-200",
        border: "border-amber-300",
        text: "text-amber-800",
        dot: "bg-amber-500",
        label: "Pending",
      },
      confirmed: {
        bg: "from-sky-50/95 to-sky-100/95 hover:from-sky-100 hover:to-sky-200",
        border: "border-sky-300",
        text: "text-[#0F75BD]",
        dot: "bg-[#0F75BD]",
        label: "Confirmed",
      },
      checked_in: {
        bg: "from-emerald-50/95 to-emerald-100/95 hover:from-emerald-100 hover:to-emerald-200",
        border: "border-emerald-300",
        text: "text-emerald-800",
        dot: "bg-emerald-500",
        label: "Checked In",
      },
      checked_out: {
        bg: "from-gray-50/95 to-gray-100/95 hover:from-gray-100 hover:to-gray-200",
        border: "border-gray-300",
        text: "text-gray-600",
        dot: "bg-gray-500",
        label: "Checked Out",
      },
      cancelled: {
        bg: "from-rose-50/95 to-rose-100/95 hover:from-rose-100 hover:to-rose-200",
        border: "border-rose-300",
        text: "text-rose-800",
        dot: "bg-rose-500",
        label: "Cancelled",
      },
      no_show: {
        bg: "from-orange-50/95 to-orange-100/95 hover:from-orange-100 hover:to-orange-200",
        border: "border-orange-300",
        text: "text-orange-800",
        dot: "bg-orange-500",
        label: "No Show",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getRoomStatusConfig = (status: RoomStatus) => {
    const configs = {
      available: { dot: "bg-emerald-500", text: "text-emerald-700", label: "Available" },
      occupied: { dot: "bg-sky-500", text: "text-sky-700", label: "Occupied" },
      maintenance: { dot: "bg-amber-500", text: "text-amber-700", label: "Maintenance" },
      out_of_order: { dot: "bg-rose-500", text: "text-rose-700", label: "Out of Order" },
    };
    return configs[status] || configs.available;
  };

  // Timeline calculation: placement of booking blocks
  const calculateBlockPosition = (checkInStr: string, checkOutStr: string) => {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    // Normalize hours for precise day offsets (e.g. check-in is 14:00, check-out is 11:00)
    // We treat dates as midday (12:00) to represent standard half-day offsets
    const checkInMid = new Date(checkIn);
    checkInMid.setHours(12, 0, 0, 0);
    const checkOutMid = new Date(checkOut);
    checkOutMid.setHours(12, 0, 0, 0);

    const timelineStartMs = timelineStart.getTime();
    
    // Fractional days relative to timeline start
    const startDayFraction = (checkInMid.getTime() - timelineStartMs) / (1000 * 60 * 60 * 24);
    const endDayFraction = (checkOutMid.getTime() - timelineStartMs) / (1000 * 60 * 60 * 24);

    const totalWidth = viewDays * colWidth;

    // Visual bounds
    const startX = startDayFraction * colWidth;
    const endX = endDayFraction * colWidth;

    // Determine clamping
    const left = Math.max(0, startX);
    const right = Math.min(totalWidth, endX);

    const width = right - left;
    const startsBefore = startX < 0;
    const endsAfter = endX > totalWidth;

    return {
      left,
      width: Math.max(24, width), // minimum size for readability
      startsBefore,
      endsAfter,
      visible: right > 0 && left < totalWidth,
    };
  };

  // Hover Tooltip Handlers
  const handleMouseEnter = (e: React.MouseEvent, booking: Booking) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollContainer = document.getElementById("calendar-scroll-container");
    const containerRect = scrollContainer?.getBoundingClientRect();

    if (containerRect) {
      // Position relative to the container for accurate rendering
      setTooltipPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10,
      });
    } else {
      setTooltipPos({
        x: e.clientX,
        y: e.clientY - 20,
      });
    }
    setHoveredBooking(booking);
  };

  const handleMouseLeave = () => {
    setHoveredBooking(null);
    setTooltipPos(null);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
      {/* 1. Header controls */}
      <div className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FAFAFB]">
        {/* Navigation & Date selector */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#E5E7EB] rounded-2xl p-1 shadow-sm">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-[#FAFAFB] text-[#5C5B59] hover:text-[#1A1A1A] rounded-xl transition-colors"
              title="Previous Range"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 hover:bg-[#FAFAFB] text-sm font-semibold text-[#1A1A1A] rounded-xl transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-[#FAFAFB] text-[#5C5B59] hover:text-[#1A1A1A] rounded-xl transition-colors"
              title="Next Range"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => {
                if (e.target.value) {
                  const d = new Date(e.target.value);
                  d.setHours(0, 0, 0, 0);
                  setStartDate(d);
                }
              }}
              className="pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-sm font-semibold text-[#1A1A1A] hover:bg-[#FAFAFB] focus:outline-none focus:ring-2 focus:ring-[#0F75BD]/20 shadow-sm cursor-pointer"
            />
            <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5B59]" />
          </div>
        </div>

        {/* View Options & Zoom Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#E5E7EB] rounded-2xl p-1 shadow-sm">
            {[
              { label: "Weekly", value: 7 },
              { label: "2 Weeks", value: 14 },
              { label: "Monthly", value: 30 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setViewDays(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  viewDays === opt.value
                    ? "bg-[#0F75BD] text-white shadow-sm"
                    : "text-[#5C5B59] hover:text-[#1A1A1A] hover:bg-[#FAFAFB]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Map Legend */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs bg-white text-[#5C5B59]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-semibold text-[#1A1A1A]">Booking Status:</span>
          {["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"].map((status) => {
            const config = getBookingStatusConfig(status as BookingStatus);
            return (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span>{config.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-semibold text-[#1A1A1A]">Room Unit Status:</span>
          {["available", "occupied", "maintenance", "out_of_order"].map((status) => {
            const config = getRoomStatusConfig(status as RoomStatus);
            return (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                <span>{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Timeline Grid Container */}
      <div 
        id="calendar-scroll-container" 
        className="flex-1 overflow-x-auto relative scrollbar-hide border-b border-[#E5E7EB]"
        style={{ minHeight: "350px" }}
      >
        <div 
          className="flex min-w-full"
          style={{ width: `calc(220px + ${viewDays * colWidth}px)` }}
        >
          {/* A. Sticky Rooms Y-Axis Panel */}
          <div className="w-[220px] bg-white sticky left-0 z-20 flex-shrink-0 border-r border-[#E5E7EB] shadow-[4px_0_12px_-6px_rgba(0,0,0,0.05)]">
            {/* Header spacer cell */}
            <div className="h-20 bg-[#FAFAFB] border-b border-[#E5E7EB] flex items-center px-5 font-semibold text-xs text-[#5C5B59] uppercase tracking-wider">
              Rooms Matrix
            </div>

            {/* Room lists */}
            <div className="divide-y divide-[#E5E7EB]">
              {roomCategories.map((category) => {
                const categoryRooms = groupedRooms[category.id] || [];
                if (categoryRooms.length === 0) return null;

                return (
                  <div key={category.id} className="bg-white">
                    {/* Category Label row */}
                    <div className="h-10 bg-slate-50/70 border-b border-[#E5E7EB] flex items-center px-4">
                      <span className="text-[11px] font-black text-[#0F75BD] uppercase tracking-wider truncate">
                        {category.title}
                      </span>
                    </div>

                    {/* Room Rows */}
                    <div className="divide-y divide-[#E5E7EB]/70">
                      {categoryRooms.map((room) => {
                        const statusConfig = getRoomStatusConfig(room.status);
                        return (
                          <div 
                            key={room.id} 
                            className="h-16 flex items-center justify-between px-5 hover:bg-[#FAFAFB]/80 transition-colors"
                          >
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A]">Room {room.room_number}</p>
                              {room.floor && (
                                <p className="text-[10px] text-[#5C5B59]">Floor {room.floor}</p>
                              )}
                            </div>
                            <span 
                              className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`}
                              title={`Status: ${statusConfig.label}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Scrollable Dates & Bookings Timeline */}
          <div className="flex-1 relative bg-white">
            
            {/* Horizontal Header Row: Dates */}
            <div className="h-20 bg-[#FAFAFB] border-b border-[#E5E7EB] flex relative z-10">
              {dates.map((date, idx) => {
                const weekend = isWeekend(date);
                const today = isToday(date);
                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 flex flex-col items-center justify-center border-r border-[#E5E7EB]/80 transition-colors relative`}
                    style={{ width: `${colWidth}px` }}
                  >
                    {/* Background shading for weekends */}
                    {weekend && <div className="absolute inset-0 bg-[#E5E7EB]/15 pointer-events-none" />}
                    {today && <div className="absolute inset-x-0 top-0 h-1 bg-[#0F75BD] pointer-events-none" />}

                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C5B59]">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span 
                      className={`text-base font-black tracking-tight mt-1 flex items-center justify-center w-7 h-7 rounded-full ${
                        today 
                          ? "bg-[#0F75BD] text-white" 
                          : "text-[#1A1A1A]"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    <span className="text-[9px] text-[#8F8E8D] mt-0.5">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Vertical grid lines (background) */}
            <div className="absolute inset-y-0 left-0 right-0 top-20 pointer-events-none flex">
              {dates.map((date, idx) => {
                const weekend = isWeekend(date);
                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 h-full border-r border-[#E5E7EB]/40 ${
                      weekend ? "bg-[#E5E7EB]/10" : ""
                    }`}
                    style={{ width: `${colWidth}px` }}
                  />
                );
              })}
            </div>

            {/* Rows list corresponding to Sticky left-side Y-Axis */}
            <div className="relative divide-y divide-[#E5E7EB] z-10">
              {roomCategories.map((category) => {
                const categoryRooms = groupedRooms[category.id] || [];
                if (categoryRooms.length === 0) return null;

                return (
                  <div key={category.id}>
                    {/* Category Spacer row to align with left sticky category bar */}
                    <div className="h-10 bg-slate-50/70 border-b border-[#E5E7EB]/70 flex items-center relative">
                      {dates.map((_, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 h-full border-r border-[#E5E7EB]/30"
                          style={{ width: `${colWidth}px` }}
                        />
                      ))}
                    </div>

                    {/* Room row grids */}
                    <div className="divide-y divide-[#E5E7EB]/70">
                      {categoryRooms.map((room) => {
                        // Find bookings assigned to this physical room number
                        const roomBookings = bookings.filter((b) => {
                          if (!b.rooms || b.rooms.length === 0) return false;
                          // Standardize status: cancel or no-show bookings should still be drawn?
                          // For a clean planner view, active bookings (confirmed, checked_in, checked_out) are highest priority.
                          // Let's filter out cancelled/no-shows to avoid clutter, or draw them if they affect room occupancy.
                          if (b.booking_status === "cancelled" || b.booking_status === "no_show") return false;
                          
                          return b.rooms.some((r: any) => r.room_number === room.room_number);
                        });

                        return (
                          <div 
                            key={room.id}
                            className="h-16 relative flex hover:bg-[#FAFAFB]/40 transition-colors"
                          >
                            {/* Render Booking Blocks */}
                            {roomBookings.map((booking) => {
                              const pos = calculateBlockPosition(booking.check_in_date, booking.check_out_date);
                              if (!pos.visible) return null;

                              const statusConfig = getBookingStatusConfig(booking.booking_status);
                              const guestName = booking.guest_details?.full_name || "Guest";

                              return (
                                <motion.div
                                  key={booking.id}
                                  initial={{ opacity: 0, scaleY: 0.8 }}
                                  animate={{ opacity: 1, scaleY: 1 }}
                                  whileHover={{ y: -1, zIndex: 30 }}
                                  onClick={() => router.push(`/bookings/${booking.id}`)}
                                  onMouseEnter={(e) => handleMouseEnter(e, booking)}
                                  onMouseLeave={handleMouseLeave}
                                  className={`absolute top-2.5 h-11 bg-gradient-to-r ${
                                    statusConfig.bg
                                  } border ${
                                    statusConfig.border
                                  } ${
                                    statusConfig.text
                                  } flex items-center justify-between px-3 cursor-pointer shadow-sm select-none transition-all group overflow-hidden ${
                                    pos.startsBefore ? "border-l-dashed rounded-l-none" : "rounded-l-2xl"
                                  } ${
                                    pos.endsAfter ? "border-r-dashed rounded-r-none" : "rounded-r-2xl"
                                  }`}
                                  style={{
                                    left: `${pos.left}px`,
                                    width: `${pos.width}px`,
                                  }}
                                >
                                  {/* Continuity indicators */}
                                  {pos.startsBefore && (
                                    <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-transparent to-current opacity-30 pointer-events-none" />
                                  )}
                                  
                                  <span className="text-xs font-bold truncate z-10 leading-none">
                                    {guestName}
                                  </span>

                                  {pos.width > 70 && (
                                    <span className="text-[9px] font-black opacity-60 ml-1 bg-white/50 px-1.5 py-0.5 rounded-full z-10 leading-none">
                                      {booking.booking_reference}
                                    </span>
                                  )}

                                  {pos.endsAfter && (
                                    <div className="absolute right-0 inset-y-0 w-1.5 bg-gradient-to-l from-transparent to-current opacity-30 pointer-events-none" />
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hover Tooltip Overlay */}
            <AnimatePresence>
              {hoveredBooking && tooltipPos && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y}px`,
                    transform: "translate(-50%, -100%)",
                  }}
                  className="z-50 w-72 bg-white border border-[#E5E7EB] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] pointer-events-none"
                >
                  {/* Tooltip Arrow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-[8px] border-x-transparent border-t-[8px] border-t-white" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-[9px] border-x-transparent border-t-[9px] border-t-[#E5E7EB] -z-10" />

                  {/* Tooltip Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                      <div>
                        <p className="text-[10px] text-[#5C5B59] font-bold uppercase tracking-wider">Ref Code</p>
                        <p className="text-xs font-black text-[#1A1A1A] mt-0.5">{hoveredBooking.booking_reference}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-full text-[10px] font-bold text-[#1A1A1A]`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getBookingStatusConfig(hoveredBooking.booking_status).dot}`} />
                        {getBookingStatusConfig(hoveredBooking.booking_status).label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#1A1A1A]">
                        {hoveredBooking.guest_details?.full_name}
                      </h4>
                      <p className="text-xs text-[#5C5B59] mt-0.5">{hoveredBooking.guest_details?.email}</p>
                      {hoveredBooking.guest_details?.phone_number && (
                        <p className="text-[10px] text-[#8F8E8D] mt-0.5">{hoveredBooking.guest_details?.phone_number}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-[#FAFAFB] p-3 rounded-2xl border border-[#E5E7EB]/60">
                      <div>
                        <span className="text-[9px] font-bold text-[#8F8E8D] uppercase tracking-wider">Check In</span>
                        <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                          {new Date(hoveredBooking.check_in_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#8F8E8D] uppercase tracking-wider">Check Out</span>
                        <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                          {new Date(hoveredBooking.check_out_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div>
                        <span className="text-[10px] text-[#5C5B59] font-semibold">Total Price</span>
                        <p className="font-bold text-[#1A1A1A] mt-0.5">
                          ₦{parseFloat(hoveredBooking.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#5C5B59] font-semibold">Nights</span>
                        <p className="font-bold text-[#1A1A1A] mt-0.5">{hoveredBooking.number_of_nights || 1}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* 4. Unassigned Bookings / Pending Allocation Section */}
      <div className="bg-white border-t border-[#E5E7EB] px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1A1A1A]">Pending Room Allocation</h3>
            <span className="bg-[#0F75BD]/10 text-[#0F75BD] text-xs font-bold px-2 py-0.5 rounded-full">
              {unassignedBookings.length}
            </span>
          </div>
          <p className="text-xs text-[#5C5B59]">
            Bookings without assigned physical room numbers
          </p>
        </div>

        {unassignedBookings.length === 0 ? (
          <div className="bg-[#FAFAFB] border border-dashed border-[#E5E7EB] rounded-2xl p-6 text-center">
            <p className="text-xs text-[#5C5B59]">All active bookings have been assigned to rooms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unassignedBookings.map((booking) => {
              const checkIn = new Date(booking.check_in_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const checkOut = new Date(booking.check_out_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              
              // Find Room category name
              const roomTypeUuid = booking.room;
              const categoryObj = categoryMap.get(roomTypeUuid);
              const roomTypeName = categoryObj?.title || "Unknown Room Category";

              return (
                <div 
                  key={booking.id}
                  className="bg-[#FAFAFB] border border-[#E5E7EB] hover:border-[#0F75BD]/40 hover:bg-white rounded-2xl p-4 transition-all flex flex-col justify-between gap-3 group relative cursor-pointer"
                  onClick={() => router.push(`/bookings/${booking.id}`)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#5C5B59] uppercase tracking-wider">
                        {booking.booking_reference}
                      </span>
                      <span className="text-[10px] font-bold text-[#0F75BD] bg-[#0F75BD]/5 px-2 py-0.5 rounded-md truncate max-w-[120px]" title={roomTypeName}>
                        {roomTypeName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#0F75BD] transition-colors">
                      {booking.guest_details?.full_name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5C5B59] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span>{checkIn}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8F8E8D]" />
                      <span>{checkOut}</span>
                    </div>
                    <button 
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0F75BD] rounded-lg hover:bg-[#0050C8] transition-colors flex items-center gap-1 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/bookings/${booking.id}`);
                      }}
                    >
                      Assign
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
