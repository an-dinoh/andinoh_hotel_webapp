"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Users,
  Bed,
  DollarSign,
  CreditCard,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Search,
  Loader2,
} from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { Room, BookingSource } from "@/types/hotel.types";

interface BookingForm {
  room_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_adults: number;
  number_of_children: number;
  booking_source: BookingSource;
  special_requests?: string;
  total_amount: string;
  amount_paid: string;
}

export default function CreateBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<BookingForm>({
    room_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    check_in_date: "",
    check_out_date: "",
    number_of_adults: 1,
    number_of_children: 0,
    booking_source: "walk_in",
    special_requests: "",
    total_amount: "0",
    amount_paid: "0",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (form.check_in_date && form.check_out_date) {
      checkAvailability();
    }
  }, [form.check_in_date, form.check_out_date]);

  useEffect(() => {
    // Auto-calculate total amount when room or dates change
    if (form.room_id && form.check_in_date && form.check_out_date) {
      const room = rooms.find((r) => r.id === form.room_id);
      if (room) {
        const nights = calculateNights(form.check_in_date, form.check_out_date);
        const total = parseFloat(room.price_per_night) * nights;
        setForm((prev) => ({ ...prev, total_amount: total.toFixed(2) }));
      }
    }
  }, [form.room_id, form.check_in_date, form.check_out_date, rooms]);

  const fetchRooms = async () => {
    try {
      const data = await hotelService.getRooms();
      const roomsArray = Array.isArray(data) ? data : [];
      setRooms(roomsArray.filter((r) => r.is_available));
      setAvailableRooms(roomsArray.filter((r) => r.is_available));
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
      setAvailableRooms([]);
    }
  };

  const checkAvailability = async () => {
    if (!form.check_in_date || !form.check_out_date) return;

    try {
      setCheckingAvailability(true);
      const response = await hotelService.checkRoomAvailability(
        form.check_in_date,
        form.check_out_date
      );

      // Filter available rooms based on response
      const available = Array.isArray(response) ? response : [];
      setAvailableRooms(available);
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailableRooms([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const calculateNights = (checkIn: string, checkOut: string): number => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.customer_name.trim()) newErrors.customer_name = "Customer name is required";
    if (!form.customer_email.trim()) newErrors.customer_email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
      newErrors.customer_email = "Invalid email format";
    if (!form.customer_phone.trim()) newErrors.customer_phone = "Phone number is required";
    if (!form.room_id) newErrors.room_id = "Please select a room";
    if (!form.check_in_date) newErrors.check_in_date = "Check-in date is required";
    if (!form.check_out_date) newErrors.check_out_date = "Check-out date is required";

    const checkIn = new Date(form.check_in_date);
    const checkOut = new Date(form.check_out_date);
    if (checkOut <= checkIn) {
      newErrors.check_out_date = "Check-out must be after check-in";
    }

    if (form.number_of_adults < 1) newErrors.number_of_adults = "At least 1 adult required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      const nights = calculateNights(form.check_in_date, form.check_out_date);

      await hotelService.createBooking({
        ...form,
        number_of_nights: nights,
        balance_due: (parseFloat(form.total_amount) - parseFloat(form.amount_paid)).toFixed(2),
      });

      setSuccessMessage("Booking created successfully!");
      setTimeout(() => {
        router.push("/bookings");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      setErrors({
        submit: error?.response?.data?.message || "Failed to create booking. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const nights = form.check_in_date && form.check_out_date
    ? calculateNights(form.check_in_date, form.check_out_date)
    : 0;

  const balanceDue = parseFloat(form.total_amount) - parseFloat(form.amount_paid);

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
              <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new booking</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{errors.submit}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Guest Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.customer_name ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.customer_name && (
                  <p className="mt-1 text-xs text-red-600">{errors.customer_name}</p>
                )}
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="customer_email"
                    value={form.customer_email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.customer_email ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.customer_email && (
                  <p className="mt-1 text-xs text-red-600">{errors.customer_email}</p>
                )}
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="customer_phone"
                    value={form.customer_phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.customer_phone ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="+1234567890"
                  />
                </div>
                {errors.customer_phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.customer_phone}</p>
                )}
              </div>

              {/* Booking Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Source <span className="text-red-500">*</span>
                </label>
                <select
                  name="booking_source"
                  value={form.booking_source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="walk_in">Walk-in</option>
                  <option value="online">Online</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Stay Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="check_in_date"
                    value={form.check_in_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.check_in_date ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.check_in_date && (
                  <p className="mt-1 text-xs text-red-600">{errors.check_in_date}</p>
                )}
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="check_out_date"
                    value={form.check_out_date}
                    onChange={handleInputChange}
                    min={form.check_in_date || new Date().toISOString().split("T")[0]}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.check_out_date ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.check_out_date && (
                  <p className="mt-1 text-xs text-red-600">{errors.check_out_date}</p>
                )}
              </div>

              {/* Number of Adults */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Adults <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="number_of_adults"
                    value={form.number_of_adults}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.number_of_adults ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.number_of_adults && (
                  <p className="mt-1 text-xs text-red-600">{errors.number_of_adults}</p>
                )}
              </div>

              {/* Number of Children */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Children
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="number_of_children"
                    value={form.number_of_children}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Nights Display */}
              {nights > 0 && (
                <div className="md:col-span-2">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm font-medium text-blue-900">
                      Total Stay: <span className="font-bold">{nights}</span> {nights === 1 ? "night" : "nights"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-blue-600" />
                  Room Selection
                </h2>
                {checkingAvailability && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking availability...
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Room <span className="text-red-500">*</span>
                </label>
                <select
                  name="room_id"
                  value={form.room_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.room_id ? "border-red-300" : "border-gray-200"
                  }`}
                  disabled={checkingAvailability}
                >
                  <option value="">Select a room</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_number} - {room.room_type} - ${room.price_per_night}/night
                      {room.max_occupancy && ` (Max ${room.max_occupancy} guests)`}
                    </option>
                  ))}
                </select>
                {errors.room_id && <p className="mt-1 text-xs text-red-600">{errors.room_id}</p>}

                {form.check_in_date && form.check_out_date && availableRooms.length === 0 && !checkingAvailability && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      No rooms available for the selected dates. Please try different dates.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Payment Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      name="total_amount"
                      value={form.total_amount}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      readOnly
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Auto-calculated based on room and nights</p>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      name="amount_paid"
                      value={form.amount_paid}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max={form.total_amount}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                  <span className="text-lg font-bold text-gray-900">${parseFloat(form.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Amount Paid:</span>
                  <span className="text-lg font-semibold text-emerald-600">${parseFloat(form.amount_paid).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-blue-300 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Balance Due:</span>
                  <span className={`text-lg font-bold ${balanceDue > 0 ? "text-orange-600" : "text-emerald-600"}`}>
                    ${balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Special Requests (Optional)
              </h2>
            </div>
            <div className="p-6">
              <textarea
                name="special_requests"
                value={form.special_requests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter any special requests or notes for this booking..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || checkingAvailability}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                "Create Booking"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
