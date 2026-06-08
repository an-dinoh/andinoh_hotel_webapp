"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

type ActivityTab = "gigs" | "saved" | "posts";

interface Tab {
  id: ActivityTab;
  label: string;
  count: number;
}

interface ActivitiesSectionProps {
  tabs: Tab[];
  bookings?: any[];
  reviews?: any[];
  stats?: any;
  initialTab?: ActivityTab;
  loading?: boolean;
}

export default function ActivitiesSection({
  tabs,
  bookings = [],
  reviews = [],
  stats = null,
  initialTab = "gigs",
  loading = false,
}: ActivitiesSectionProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>(initialTab);

  // Generate Room Checks tasks based on actual confirmed bookings (booked but not checked in yet)
  const confirmedBookings = bookings.filter((b: any) => b.booking_status === "confirmed");

  const roomInspectionTasks = confirmedBookings.map((booking: any, index: number) => {
    const roomNum = booking.room ? `Room ${booking.room}` : `Room ${101 + index * 2}`;
    const guestName = booking.guest_details?.full_name || "Guest";
    return {
      id: `task-pre-${booking.id || index}`,
      title: `Pre-Arrival Setup & Inspection`,
      type: "pre_arrival" as const,
      room: roomNum,
      guest: guestName,
      priority: "high" as const,
    };
  });

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Property Activities</h2>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl text-[#0F75BD] text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-[#0F75BD] rounded-full animate-pulse" />
          Live Updates
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? "text-[#1A1A1A]" : "text-[#5C5B59] hover:text-[#1A1A1A]"
            }`}
          >
            {tab.label}
            <span className="ml-2 py-0.5 px-2 bg-gray-50 rounded-full text-[10px] text-[#5C5B59] font-black border border-gray-100">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F75BD] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <Skeleton width="48px" height="48px" className="rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton width="160px" height="14px" />
                  <Skeleton width="100px" height="10px" />
                </div>
              </div>
              <Skeleton width="60px" height="24px" className="rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Tab 1: Occupancy (Active stays/Confirmed bookings) */}
          {activeTab === "gigs" && (
            <div className="space-y-6">
              {bookings.length > 0 ? (
                bookings.slice(0, 4).map((booking, index) => {
                  const guestName = booking.guest_details?.full_name || "Guest";
                  const reviewerInitials = guestName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
                  const checkinDate = new Date(booking.check_in_date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={booking.id || index}
                      className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/40 rounded-xl px-2 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-blue-50 text-[#0F75BD] font-bold text-xs rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                          {reviewerInitials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1A1A]">{guestName}</h4>
                          <p className="text-xs text-[#5C5B59] mt-0.5">
                            {booking.room_type?.title || "Room"} • {booking.number_of_nights} nights (In: {checkinDate})
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          booking.booking_status === "checked_in"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : booking.booking_status === "confirmed"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-gray-50 text-gray-700 border border-gray-100"
                        }`}
                      >
                        {booking.booking_status === "checked_in" ? "Stay Active" : booking.booking_status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <EmptyState message="No Active Bookings Today" icon="🛏️" />
              )}
            </div>
          )}

          {/* Tab 2: Room Inspections (Pending tasks) */}
          {activeTab === "saved" && (
            <div className="space-y-6">
              {roomInspectionTasks.length > 0 ? (
                roomInspectionTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/40 rounded-xl px-2 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">{task.title}</h4>
                        <p className="text-xs text-[#5C5B59] mt-0.5">
                          Assigned to Housekeeping • Guest: <span className="font-semibold text-gray-700">{task.guest}</span> ({task.room})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          task.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <button className="text-xs font-bold text-[#0F75BD] hover:underline px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                        Complete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="All Room Inspections Complete!" icon="✨" />
              )}
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.slice(0, 3).map((review, index) => {
                  const reviewerInitials = review.reviewer_name
                    ? review.reviewer_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                    : "G";
                  const reviewDate = review.created_at
                    ? new Date(review.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "Recent";

                  return (
                    <div
                      key={review.id || index}
                      className="py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/40 rounded-xl px-2 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-50 text-orange-500 font-bold text-xs rounded-full flex items-center justify-center border border-orange-100 shadow-sm">
                            {reviewerInitials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-[#1A1A1A]">{review.reviewer_name || "Guest"}</h4>
                              {review.is_verified && (
                                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.2 rounded-full border border-green-100">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{reviewDate}</p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`text-xs ${
                                s <= (review.rating || 0) ? "text-orange-400" : "text-gray-200"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pl-12">
                        {review.title && <h5 className="text-xs font-bold text-[#1A1A1A] mb-1">{review.title}</h5>}
                        <p className="text-xs text-[#5C5B59] leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState message="No Guest Reviews Yet" icon="⭐" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Small inner helper component for clean empty states
function EmptyState({ message, icon }: { message: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50/40 rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-xs font-bold text-[#1A1A1A] mb-0.5">{message}</p>
      <p className="text-[10px] text-[#8F8E8D]">Real-time synchronization active.</p>
    </div>
  );
}
