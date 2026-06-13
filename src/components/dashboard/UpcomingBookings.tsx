import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";
import { Booking } from "@/types/hotel.types";
import { Calendar } from "lucide-react";

interface UpcomingBookingsProps {
    bookings: any[];
    loading?: boolean;
}

export default function UpcomingBookings({ bookings, loading = false }: UpcomingBookingsProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-[#1A1A1A]">Upcoming Check-ins</h2>
                </div>
                <button className="text-xs font-bold text-[#0F75BD] hover:underline">View All</button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-50">
                            <Skeleton width="40px" height="40px" variant="circle" />
                            <div className="flex-1 space-y-2">
                                <Skeleton width="120px" height="14px" />
                                <Skeleton width="80px" height="12px" />
                            </div>
                        </div>
                    ))
                ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100">
                            <Calendar className="w-6 h-6 text-gray-300 stroke-[1.5]" />
                        </div>
                        <p className="text-sm text-[#5C5B59]">No upcoming check-ins for now.</p>
                    </div>
                ) : (
                    bookings.slice(0, 5).map((booking, index) => {
                        const guestName = booking.guest_details?.full_name ||
                            booking.customer_name ||
                            booking.guest_name ||
                            (typeof booking.customer === 'object' && (booking.customer?.full_name || booking.customer?.name)) ||
                            "Guest";

                        return (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group">
                                <div className="w-11 h-11 bg-[#F3F4F6] rounded-full flex items-center justify-center font-bold text-[#1A1A1A] text-sm group-hover:bg-white transition-colors">
                                    {guestName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{guestName}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-[#5C5B59] bg-white border border-gray-100 px-2 py-0.5 rounded-md">
                                            Room {booking.room_number || "TBD"}
                                        </span>
                                        <span className="text-[11px] text-[#5C5B59]">
                                            {new Date(booking.check_in).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-green-600">Pending</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
