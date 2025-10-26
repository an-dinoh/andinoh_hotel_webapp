"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Bed,
  DollarSign,
  Clock,
  MapPin,
  Users,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Printer,
  Send,
  FileText,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import { hotelService } from "@/services/hotel.service";
import { Booking, BookingStatus, PaymentStatus } from "@/types/hotel.types";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await hotelService.getBooking(bookingId);
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await hotelService.checkIn(bookingId, {
        actual_check_in_time: new Date().toISOString(),
      });
      setShowCheckInModal(false);
      fetchBooking();
    } catch (error) {
      console.error("Error checking in:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await hotelService.checkOut(bookingId, {
        actual_check_out_time: new Date().toISOString(),
      });
      setShowCheckOutModal(false);
      fetchBooking();
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setActionLoading(true);
      await hotelService.cancelBooking(bookingId);
      setShowCancelModal(false);
      fetchBooking();
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: BookingStatus) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle,
        label: "Confirmed",
      },
      checked_in: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: LogIn,
        label: "Checked In",
      },
      checked_out: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: LogOut,
        label: "Checked Out",
      },
      cancelled: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
        label: "Cancelled",
      },
      no_show: {
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: XCircle,
        label: "No Show",
      },
    };
    return configs[status];
  };

  const getPaymentConfig = (status: PaymentStatus) => {
    const configs = {
      paid: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Fully Paid" },
      partial: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Partially Paid" },
      pending: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Payment Pending" },
      refunded: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Refunded" },
    };
    return configs[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading booking details..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
        <p className="text-gray-500 mb-6">The booking you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push("/bookings")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.booking_status);
  const paymentConfig = getPaymentConfig(booking.payment_status);
  const StatusIcon = statusConfig.icon;

  const canCheckIn = booking.booking_status === "confirmed";
  const canCheckOut = booking.booking_status === "checked_in";
  const canCancel = ["pending", "confirmed"].includes(booking.booking_status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-sm text-gray-500 mt-1">Reference: {booking.booking_reference}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {canCheckIn && (
                <button
                  onClick={() => setShowCheckInModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg shadow-emerald-500/25"
                >
                  <LogIn className="w-4 h-4" />
                  Check In
                </button>
              )}
              {canCheckOut && (
                <button
                  onClick={() => setShowCheckOutModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg shadow-orange-500/25"
                >
                  <LogOut className="w-4 h-4" />
                  Check Out
                </button>
              )}
              <button
                onClick={() => router.push(`/bookings/${bookingId}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 font-medium shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${statusConfig.color.replace('text-', 'bg-').replace('100', '200')}`}>
                    <StatusIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Booking Status</p>
                    <span className={`inline-flex items-center gap-2 mt-1 px-4 py-1.5 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Payment Status</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${paymentConfig.color}`}>
                    <DollarSign className="w-4 h-4" />
                    {paymentConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Guest Information</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {booking.customer_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{booking.customer_name}</h3>
                    <p className="text-sm text-gray-500">Primary Guest</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email Address</p>
                      <p className="text-sm font-medium text-gray-900">{booking.customer_email}</p>
                    </div>
                  </div>

                  {booking.customer_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Phone Number</p>
                        <p className="text-sm font-medium text-gray-900">{booking.customer_phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Number of Guests</p>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.number_of_adults} Adults
                        {booking.number_of_children > 0 && `, ${booking.number_of_children} Children`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Stay Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <LogIn className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs font-semibold text-emerald-600 uppercase">Check-In</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(booking.check_in_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {booking.checked_in_at && (
                      <p className="text-xs text-gray-600 mt-1">
                        Checked in: {new Date(booking.checked_in_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <LogOut className="w-4 h-4 text-orange-600" />
                      <p className="text-xs font-semibold text-orange-600 uppercase">Check-Out</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(booking.check_out_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {booking.checked_out_at && (
                      <p className="text-xs text-gray-600 mt-1">
                        Checked out: {new Date(booking.checked_out_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Stay Duration</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {booking.number_of_nights} {booking.number_of_nights === 1 ? "Night" : "Nights"}
                      </p>
                    </div>
                    <Calendar className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <p className="text-sm font-semibold text-gray-700">Special Requests</p>
                    </div>
                    <p className="text-sm text-gray-600">{booking.special_requests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Booking Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Created */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-gray-900">Booking Created</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.created_at || "").toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Confirmed */}
                  {booking.booking_status !== "pending" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        {booking.checked_in_at && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-gray-900">Booking Confirmed</p>
                        <p className="text-sm text-gray-500">Status: Confirmed</p>
                      </div>
                    </div>
                  )}

                  {/* Checked In */}
                  {booking.checked_in_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <LogIn className="w-5 h-5 text-purple-600" />
                        </div>
                        {booking.checked_out_at && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-gray-900">Guest Checked In</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checked_in_at).toLocaleString()}
                        </p>
                        {booking.checked_in_by && (
                          <p className="text-xs text-gray-400 mt-1">By: {booking.checked_in_by}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Checked Out */}
                  {booking.checked_out_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Guest Checked Out</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checked_out_at).toLocaleString()}
                        </p>
                        {booking.checked_out_by && (
                          <p className="text-xs text-gray-400 mt-1">By: {booking.checked_out_by}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancelled */}
                  {booking.booking_status === "cancelled" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Booking Cancelled</p>
                        <p className="text-sm text-gray-500">This booking has been cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
                <h2 className="text-lg font-semibold text-white">Payment Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${parseFloat(booking.total_amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                  <span className="text-lg font-semibold text-emerald-600">
                    ${parseFloat(booking.amount_paid || "0").toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-medium text-gray-700">Balance Due</span>
                  <span className={`text-xl font-bold ${parseFloat(booking.balance_due || "0") > 0 ? "text-orange-600" : "text-emerald-600"}`}>
                    ${parseFloat(booking.balance_due || "0").toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Source: {booking.booking_source}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Room Information</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Bed className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Room ID</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.room}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/rooms/${booking.room}`)}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  View Room Details
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Download className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Download Invoice</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Printer className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Print Details</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Send className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Send Confirmation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <LogIn className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Check-In Guest</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to check in {booking.customer_name}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckInModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Check-In"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-Out Modal */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Check-Out Guest</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to check out {booking.customer_name}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckOutModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg shadow-orange-500/25 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Check-Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-200 font-medium shadow-lg shadow-red-500/25 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
