"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { hotelService } from "@/services/hotel.service";
import { authService } from "@/services/auth.service";
import { toast } from "react-hot-toast";
import {
  ChevronDown,
  Calendar,
  Mail,
  Users,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer,
  Send,
  CreditCard,
  MapPin,
  Sparkles,
  User,
  DollarSign,
  FileText,
  Edit,
  AlertCircle,
  Home,
  Star,
  MessageSquare,
  Receipt,
} from "lucide-react";
import { Booking, BookingStatus } from "@/types/hotel.types";
import BookingFolio from "@/components/bookings/BookingFolio";
import Script from "next/script";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

type BookingDetailTab = "overview" | "guest" | "payment" | "folio" | "activity";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<BookingDetailTab>("overview");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentTxId, setPaymentTxId] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBooking = useCallback(async () => {
    try {
      const data = await hotelService.getBooking(bookingId);
      setBooking(data);
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      toast.error(error.message || "Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, fetchBooking]);

  const handleCheckIn = async () => {
    try {
      const user = authService.getUser();
      if (!user) throw new Error("User not authenticated");

      await hotelService.checkIn(bookingId, {
        staff_id: user.id,
        actual_check_in_time: new Date().toISOString()
      });

      toast.success("Guest checked in successfully");
      setShowCheckInModal(false);
      fetchBooking();
    } catch (error: any) {
      toast.error(error.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const user = authService.getUser();
      if (!user) throw new Error("User not authenticated");

      await hotelService.checkOut(bookingId, {
        staff_id: user.id,
        actual_check_out_time: new Date().toISOString()
      });

      toast.success("Guest checked out successfully");
      setShowCheckOutModal(false);
      fetchBooking();
    } catch (error: any) {
      toast.error(error.message || "Check-out failed");
    }
  };

  const handleCancelBooking = async () => {
    try {
      await hotelService.cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      fetchBooking();
    } catch (error: any) {
      toast.error(error.message || "Cancellation failed");
    }
  };

  const handleProcessPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount) {
      toast.error("Please enter an amount");
      return;
    }

    if (paymentMethod === "online") {
      try {
        setIsProcessingPayment(true);
        const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/bookings/${bookingId}` : '';
        const response = await hotelService.initiatePayment(bookingId, redirectUrl);

        const flutterwaveKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
        if (!flutterwaveKey) {
          throw new Error("Flutterwave public key is not configured");
        }

        const txRef = response?.data?.tx_ref || `ANDINOH-${booking?.booking_reference}-${Date.now()}`;

        window.FlutterwaveCheckout({
          public_key: flutterwaveKey,
          tx_ref: txRef,
          amount: parseFloat(paymentAmount),
          currency: "NGN",
          payment_options: "card, banktransfer, ussd",
          customer: {
            email: booking?.guest_details?.email || "",
            phone_number: booking?.guest_details?.phone_number || "",
            name: booking?.guest_details?.full_name || "",
          },
          customizations: {
            title: "Andinoh Hotels",
            description: `Booking Payment for Ref: ${booking?.booking_reference}`,
            logo: "https://res.cloudinary.com/andinoh/image/upload/v1/assets/logo_wide.png",
          },
          callback: async (data: any) => {
            try {
              const verificationRes = await hotelService.verifyPayment(bookingId, {
                transaction_id: data.transaction_id.toString(),
                tx_ref: data.tx_ref,
              });

              if (verificationRes?.status === "success") {
                toast.success("Payment verified and completed successfully!");
                setShowPaymentModal(false);
                setPaymentAmount("");
                setPaymentTxId("");
                fetchBooking();
              } else {
                toast.error("Payment verification failed. Please contact support.");
              }
            } catch (verifyError: any) {
              toast.error(verifyError.message || "Failed to verify payment");
            } finally {
              setIsProcessingPayment(false);
            }
          },
          onclose: () => {
            setIsProcessingPayment(false);
          },
        });
      } catch (error: any) {
        toast.error(error.message || "Payment initiation failed");
        setIsProcessingPayment(false);
      }
      return;
    }

    try {
      setIsProcessingPayment(true);
      await hotelService.processPayment(bookingId, {
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod,
        transaction_id: paymentTxId
      });
      toast.success("Payment processed successfully");
      setShowPaymentModal(false);
      setPaymentAmount("");
      setPaymentTxId("");
      fetchBooking();
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getStatusConfig = (status: BookingStatus) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
        label: "Confirmed",
      },
      checked_in: {
        color: "bg-emerald-100 text-emerald-700",
        icon: LogIn,
        label: "Checked In",
      },
      checked_out: {
        color: "bg-gray-100 text-gray-700",
        icon: LogOut,
        label: "Checked Out",
      },
      cancelled: {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled",
      },
      no_show: {
        color: "bg-orange-100 text-orange-700",
        icon: XCircle,
        label: "No Show",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (!booking) {
    return (
      <div className="h-full bg-white overflow-y-auto scrollbar-hide">
        <div className="h-full bg-white py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-20 h-20 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-[#0F75BD]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Booking Not Found</h2>
              <p className="text-[#5C5B59] text-sm mb-6">The booking you&apos;re looking for doesn&apos;t exist.</p>
              <button
                onClick={() => router.push("/bookings")}
                className="px-6 py-3 bg-[#0F75BD] text-white rounded-xl hover:bg-[#0050C8] transition-colors font-medium"
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.booking_status);

  const canCheckIn = booking.booking_status === "confirmed";
  const canCheckOut = booking.booking_status === "checked_in";
  const canCancel = ["pending", "confirmed"].includes(booking.booking_status);

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide">
      <div className="h-full bg-white py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.push("/bookings")}
            className="flex items-center gap-2 text-[#0F75BD] hover:text-[#0050C8] font-medium mb-4"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            Back to Bookings
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Booking Details</h1>
            <p className="text-gray-500 text-sm">View and manage booking information</p>
          </div>

          {/* Booking Hero Section */}
          <div className="bg-white rounded-2xl border border-[#D3D9DD] overflow-hidden">
            <div className="bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-6xl">🏨</span>
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                        <span className="text-2xl font-bold text-white">{booking.booking_reference}</span>
                      </div>
                    </div>
                    {/* Standardized guest info from backend */}
                    {(() => {
                      const guestName = booking.guest_details?.full_name || "Guest";
                      return <h2 className="text-4xl font-bold text-white mb-3">{guestName}</h2>;
                    })()}
                    <p className="text-white/90 text-lg max-w-3xl">
                      {booking.number_of_nights} {booking.number_of_nights === 1 ? "Night" : "Nights"} Stay • Room {(booking.room || "N/A").toUpperCase()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-semibold ${statusConfig.color}`}>
                    {statusConfig.label}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-xl">
                    <Sparkles className="w-4 h-4" />
                    {(booking.booking_source || "direct").toUpperCase().replace("_", " ")}
                  </span>
                  <div className="text-white">
                    <span className="text-3xl font-bold">₦{(parseFloat(booking.total_amount) || 0).toLocaleString()}</span>
                    <span className="text-white/80 ml-2">/total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-[#E5E7EB] bg-white">
              <div className="flex gap-1 px-8 overflow-x-auto scrollbar-hide">
                {[
                  { id: "overview" as BookingDetailTab, label: "Overview", icon: FileText },
                  { id: "guest" as BookingDetailTab, label: "Guest Details", icon: User },
                  { id: "folio" as BookingDetailTab, label: "Guest Folio", icon: Receipt },
                  { id: "payment" as BookingDetailTab, label: "Payment", icon: CreditCard },
                  { id: "activity" as BookingDetailTab, label: "Activity Log", icon: Clock },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${activeTab === tab.id
                        ? "text-[#0F75BD] border-b-2 border-[#0F75BD]"
                        : "text-[#5C5B59] hover:text-[#0F75BD]"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl border border-[#D3D9DD] p-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                  <p className="text-sm text-gray-500 mb-6">Complete overview of the reservation and stay details</p>
                </div>

                {/* Stay Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Check-in Card */}
                  <div className="p-6 bg-[#F0F9FF] border border-[#BFDBFE] rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#0F75BD] rounded-xl flex items-center justify-center">
                        <LogIn className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0F75BD] uppercase">Check-In Date</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {new Date(booking.check_in_date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {booking.checked_in_at && (
                      <p className="text-sm text-gray-600">
                        ✓ Checked in at {new Date(booking.checked_in_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  {/* Check-out Card */}
                  <div className="p-6 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-orange-700 uppercase">Check-Out Date</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {new Date(booking.check_out_date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {booking.checked_out_at && (
                      <p className="text-sm text-gray-600">
                        ✓ Checked out at {new Date(booking.checked_out_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="p-6 bg-[#F5F3FF] border border-[#E9D5FF] rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-purple-700 uppercase">Room Number</p>
                        <p className="text-2xl font-bold text-gray-900">{(booking.room || "N/A").toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/rooms/${booking.room}`)}
                      className="text-sm text-purple-700 hover:text-purple-800 font-medium"
                    >
                      View Room Details →
                    </button>
                  </div>

                  {/* Guest Count */}
                  <div className="p-6 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-green-700 uppercase">Total Guests</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {(booking.number_of_adults || 0) + (booking.number_of_children || 0)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {booking.number_of_adults || 0} {(booking.number_of_adults || 0) === 1 ? "Adult" : "Adults"}
                      {(booking.number_of_children || 0) > 0 &&
                        ` • ${booking.number_of_children || 0} ${(booking.number_of_children || 0) === 1 ? "Child" : "Children"}`}
                    </p>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <div className="p-6 bg-[#FAFAFB] border border-[#D3D9DD] rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                      <h4 className="text-sm font-semibold text-gray-800 uppercase">Special Requests</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{booking.special_requests}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {canCheckIn && (
                    <button
                      onClick={() => setShowCheckInModal(true)}
                      className="px-6 py-3 bg-[#0F75BD] text-white rounded-xl hover:bg-[#0050C8] transition-all font-semibold flex items-center gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Check In Guest
                    </button>
                  )}
                  {canCheckOut && (
                    <button
                      onClick={() => setShowCheckOutModal(true)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Check Out Guest
                    </button>
                  )}
                  <button className="px-6 py-3 bg-white border border-[#D3D9DD] text-gray-800 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Booking
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-6 py-3 bg-white border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all font-semibold flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "guest" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Information</h3>
                  <p className="text-sm text-gray-500 mb-6">Contact details and preferences for the primary guest</p>
                </div>

                {/* Guest Profile */}
                <div className="bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {(() => {
                        const guestName = booking.guest_details?.full_name || "Guest";
                        const guestEmail = booking.guest_details?.email || "No email";
                        return (
                          <>
                            <div className="w-16 h-16 bg-[#0F75BD] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                              {guestName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{guestName}</h3>
                              <div className="flex items-center gap-4 mt-1 text-gray-500">
                                <span className="flex items-center gap-1.5 text-sm">
                                  <Mail className="w-4 h-4" />
                                  {guestEmail}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= 5 ? "fill-[#FBB81F] text-[#FBB81F]" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">VIP Guest</span>
                    </div>
                  </div>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-[#D3D9DD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-[#0F75BD]" />
                      <p className="text-xs font-semibold text-gray-500 uppercase">Email Address</p>
                    </div>
                    <p className="text-base font-medium text-gray-900">{booking.guest_details?.email || "No email"}</p>
                  </div>

                  {booking.guest_details?.phone_number && (
                    <div className="p-5 bg-white border border-[#D3D9DD] rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Image src="/icons/call.svg" alt="Phone" width={20} height={20} />
                        <p className="text-xs font-semibold text-gray-500 uppercase">Phone Number</p>
                      </div>
                      <p className="text-base font-medium text-gray-900">{booking.guest_details?.phone_number}</p>
                    </div>
                  )}

                  <div className="p-5 bg-white border border-[#D3D9DD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-[#0F75BD]" />
                      <p className="text-xs font-semibold text-gray-500 uppercase">Stay Duration</p>
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      {booking.number_of_nights} {booking.number_of_nights === 1 ? "Night" : "Nights"}
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-[#D3D9DD] rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-[#0F75BD]" />
                      <p className="text-xs font-semibold text-gray-500 uppercase">Booking Source</p>
                    </div>
                    <p className="text-base font-medium text-gray-900 capitalize">
                      {(booking.booking_source || "direct").replace("_", " ")}
                    </p>
                  </div>
                </div>

                {/* Guest Preferences */}
                <div className="bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-gray-800 uppercase mb-4">Guest Preferences & Services</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#F0F9FF] border border-[#BFDBFE] rounded-xl">
                      <div className="w-2 h-2 bg-[#0F75BD] rounded-full"></div>
                      <span className="text-sm font-medium text-[#0F75BD]">Airport Pickup</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Room Service</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-sm font-medium text-orange-700">Late Check-out</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                  <p className="text-sm text-gray-500 mb-6">Complete billing information and transaction history</p>
                </div>

                {/* Payment Overview */}
                <div className="p-8 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] border-2 border-[#0F75BD]/20 rounded-2xl">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#0F75BD]/20">
                      <span className="text-sm font-semibold text-gray-600 uppercase">Total Amount</span>
                      <span className="text-3xl font-bold text-gray-900">
                        ₦{(parseFloat(booking.total_amount || "0") || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#0F75BD]/20">
                      <span className="text-sm font-semibold text-gray-600 uppercase">Amount Paid</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₦{(parseFloat(booking.amount_paid || "0") || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-gray-700 uppercase">Balance Due</span>
                      <span
                        className={`text-3xl font-bold ${(parseFloat(booking.balance_due || "0") || 0) > 0 ? "text-orange-600" : "text-green-600"
                          }`}
                      >
                        ₦{(parseFloat(booking.balance_due || "0") || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-gray-800 uppercase mb-4">Payment Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Room Rate ({booking.number_of_nights} nights)</span>
                      <span className="font-semibold text-gray-900">
                        ₦{(parseFloat(booking.total_amount || "0") || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Service Charge</span>
                      <span className="font-semibold text-gray-900">₦0</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tax (7.5%)</span>
                      <span className="font-semibold text-gray-900">Included</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold text-gray-800">Grand Total</span>
                      <span className="text-xl font-bold text-[#0F75BD]">
                        ₦{(parseFloat(booking.total_amount || "0") || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Status</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">
                      {booking.payment_status === "paid"
                        ? "Fully Paid"
                        : booking.payment_status === "partial"
                          ? "Partially Paid"
                          : "Pending Payment"}
                    </p>
                  </div>

                  <div className="p-5 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Method</p>
                    <p className="text-lg font-bold text-gray-900">Online Transfer</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {(parseFloat(booking.balance_due || "0") > 0) && (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2"
                    >
                      Process Payment
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-[#0F75BD] font-semibold transition-all">
                    <Download className="w-5 h-5" />
                    Download Invoice
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-[#0F75BD] font-semibold transition-all">
                    <Printer className="w-5 h-5" />
                    Print Receipt
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-[#0F75BD] font-semibold transition-all">
                    <Send className="w-5 h-5" />
                    Email to Guest
                  </button>
                </div>
              </div>
            )}

            {activeTab === "folio" && (
              <BookingFolio bookingId={bookingId} />
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Timeline</h3>
                  <p className="text-sm text-gray-500 mb-6">Complete history of booking events and status changes</p>
                </div>

                <div className="space-y-6">
                  {/* Created */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="pb-8 flex-1">
                      <div className="bg-white border border-[#D3D9DD] rounded-xl p-5">
                        <p className="font-semibold text-gray-900 mb-1">Booking Created</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.created_at || "").toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">via {(booking.booking_source || "direct").replace("_", " ")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Confirmed */}
                  {booking.booking_status !== "pending" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        {(booking.checked_in_at || booking.checked_out_at) && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="pb-8 flex-1">
                        <div className="bg-white border border-[#D3D9DD] rounded-xl p-5">
                          <p className="font-semibold text-gray-900 mb-1">Booking Confirmed</p>
                          <p className="text-sm text-gray-500">Reservation confirmed and room allocated</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checked In */}
                  {booking.checked_in_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <LogIn className="w-6 h-6 text-purple-600" />
                        </div>
                        {booking.checked_out_at && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
                      </div>
                      <div className="pb-8 flex-1">
                        <div className="bg-white border border-[#D3D9DD] rounded-xl p-5">
                          <p className="font-semibold text-gray-900 mb-1">Guest Checked In</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.checked_in_at).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checked Out */}
                  {booking.checked_out_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <LogOut className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white border border-[#D3D9DD] rounded-xl p-5">
                          <p className="font-semibold text-gray-900 mb-1">Guest Checked Out</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.checked_out_at).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancelled */}
                  {booking.booking_status === "cancelled" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white border border-[#D3D9DD] rounded-xl p-5">
                          <p className="font-semibold text-gray-900 mb-1">Booking Cancelled</p>
                          <p className="text-sm text-gray-500">This booking has been cancelled</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-8">
            {/* Basic Info */}
            <div className="bg-white border border-[#D3D9DD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#0F75BD]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Booking Info</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
                  <span className="text-gray-500 text-sm font-medium">Reference</span>
                  <span className="font-semibold text-gray-800">{booking.booking_reference}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
                  <span className="text-gray-500 text-sm font-medium">Room</span>
                  <span className="font-semibold text-gray-800">{(booking.room || "N/A").toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm font-medium">Nights</span>
                  <span className="font-semibold text-gray-800">{booking.number_of_nights}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border border-[#D3D9DD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F5F3FF] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#0F75BD]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Payment</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
                  <span className="text-gray-500 text-sm font-medium">Total</span>
                  <span className="font-semibold text-gray-800">
                    ₦{(parseFloat(booking.total_amount || "0") || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
                  <span className="text-gray-500 text-sm font-medium">Paid</span>
                  <span className="font-semibold text-green-600">
                    ₦{(parseFloat(booking.amount_paid || "0") || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm font-medium">Balance</span>
                  <span
                    className={`font-semibold ${parseFloat(booking.balance_due || "0") > 0 ? "text-orange-600" : "text-green-600"}`}
                  >
                    ₦{parseFloat(booking.balance_due || "0").toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white border border-[#D3D9DD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#0F75BD]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Services</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-[#F0F9FF] border border-[#BFDBFE] rounded-xl">
                  <div className="w-2 h-2 bg-[#0F75BD] rounded-full"></div>
                  <span className="text-sm font-medium text-[#0F75BD]">Free WiFi</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm font-medium text-orange-700">Breakfast</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Room Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {
        showCheckInModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Check-In Guest</h3>
                  <p className="text-sm text-gray-500">Confirm guest arrival</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Are you sure you want to check in <span className="font-bold">{booking.guest_details?.full_name || "this guest"}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCheckInModal(false);
                    alert("Guest checked in successfully!");
                  }}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold"
                >
                  Confirm Check-In
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showCheckOutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Check-Out Guest</h3>
                  <p className="text-sm text-gray-500">Confirm guest departure</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Are you sure you want to check out <span className="font-bold">{booking.guest_details?.full_name || "this guest"}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckOutModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCheckOutModal(false);
                    alert("Guest checked out successfully!");
                  }}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-semibold"
                >
                  Confirm Check-Out
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Are you sure you want to cancel this booking? This will free up the room for other guests.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    alert("Booking cancelled successfully!");
                    router.push("/bookings");
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Process Manual Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  x
                </button>
              </div>
              <form onSubmit={handleProcessPaymentSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₦</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={booking.balance_due || "0"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="pos">POS Terminal</option>
                    <option value="card_online">Online Card (Manual)</option>
                    <option value="online">Online Payment (Flutterwave Inline)</option>
                  </select>
                </div>

                {paymentMethod !== "online" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID/Reference</label>
                    <input
                      type="text"
                      value={paymentTxId}
                      onChange={(e) => setPaymentTxId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. TRX-12345678"
                    />
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment || !paymentAmount}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-semibold disabled:opacity-50"
                  >
                    {isProcessingPayment ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      <Script src="https://checkout.flutterwave.com/v3.js" strategy="lazyOnload" />
    </div >
  );
}
