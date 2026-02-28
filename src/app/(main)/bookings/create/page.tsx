"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { Room, BookingSource } from "@/types/hotel.types";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

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
    if (form.room_id && form.check_in_date && form.check_out_date) {
      const room = rooms.find((r) => r.id === form.room_id);
      if (room && room.price_per_night) {
        const nights = calculateNights(form.check_in_date, form.check_out_date);
        const total = parseFloat(room.price_per_night) * nights;
        setForm((prev) => ({ ...prev, total_amount: total.toFixed(2) }));
      } else if (room) {
        const nights = calculateNights(form.check_in_date, form.check_out_date);
        const total = parseFloat(room.base_price) * nights;
        setForm((prev) => ({ ...prev, total_amount: total.toFixed(2) }));
      }
    }
  }, [form.room_id, form.check_in_date, form.check_out_date, rooms]);

  const fetchRooms = async () => {
    try {
      const response = await hotelService.getRooms();
      const roomsArray = response.results || [];
      setRooms(roomsArray.filter((r) => r.is_available));
      setAvailableRooms(roomsArray.filter((r) => r.is_available));
    } catch {
      setRooms([]);
      setAvailableRooms([]);
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
        room: form.room_id,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date,
        number_of_adults: form.number_of_adults,
        number_of_children: form.number_of_children,
        booking_source: form.booking_source,
        special_requests: form.special_requests,
        amount_paid: form.amount_paid,
        number_of_nights: nights,
        balance_due: (parseFloat(form.total_amount) - parseFloat(form.amount_paid)).toFixed(2),
      });

      setSuccessMessage("Booking created successfully!");
      setTimeout(() => {
        router.push("/bookings");
      }, 1500);
    } catch (err: unknown) {
      setErrors({
        submit: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create booking. Please try again.",
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
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#0F75BD] hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#0F75BD]" />
        </button>

        {/* Header */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Create New Booking
          </h1>
          <p className="text-gray-500 text-sm">
            Fill in the booking details
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-5 bg-[#ECFDF5] border-2 border-green-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-700" />
            <p className="text-sm font-bold text-green-800">{successMessage}</p>
          </div>
        )}

        {errors.submit && (
          <div className="p-5 bg-[#FEE2E2] border-2 border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-700" />
            <p className="text-sm font-bold text-red-800">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Guest Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Full Name *"
                type="text"
                placeholder="John Doe"
                value={form.customer_name}
                onChange={handleInputChange}
                error={errors.customer_name}
              />

              <InputField
                label="Email *"
                type="email"
                placeholder="john@example.com"
                value={form.customer_email}
                onChange={handleInputChange}
                error={errors.customer_email}
              />

              <InputField
                label="Phone *"
                type="tel"
                placeholder="+234 123 456 7890"
                value={form.customer_phone}
                onChange={handleInputChange}
                error={errors.customer_phone}
              />

              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Booking Source
                </label>
                <select
                  name="booking_source"
                  value={form.booking_source}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
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
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Stay Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="check_in_date"
                  value={form.check_in_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:border-transparent ${errors.check_in_date ? "border-red-500 focus:ring-red-500" : "border-[#D3D9DD] focus:ring-[#8E9397]"
                    }`}
                />
                {errors.check_in_date && (
                  <p className="mt-1 text-xs text-red-500">{errors.check_in_date}</p>
                )}
              </div>

              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="check_out_date"
                  value={form.check_out_date}
                  onChange={handleInputChange}
                  min={form.check_in_date || new Date().toISOString().split("T")[0]}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:border-transparent ${errors.check_out_date ? "border-red-500 focus:ring-red-500" : "border-[#D3D9DD] focus:ring-[#8E9397]"
                    }`}
                />
                {errors.check_out_date && (
                  <p className="mt-1 text-xs text-red-500">{errors.check_out_date}</p>
                )}
              </div>

              <InputField
                label="Adults *"
                type="number"
                placeholder="1"
                value={form.number_of_adults.toString()}
                onChange={handleInputChange}
                error={errors.number_of_adults}
              />

              <InputField
                label="Children"
                type="number"
                placeholder="0"
                value={form.number_of_children.toString()}
                onChange={handleInputChange}
                error=""
              />

              {nights > 0 && (
                <div className="md:col-span-2">
                  <div className="p-5 bg-[#E8F4F8] border-2 border-[#0F75BD] rounded-2xl flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-[#0F75BD]" />
                    <p className="text-base font-bold text-[#0F75BD]">
                      Total Stay: {nights} {nights === 1 ? "Night" : "Nights"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room Selection */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Room Selection</h2>
            <div>
              <label className="block text-[#0B0A07] text-sm mb-1">
                Select Room <span className="text-red-500">*</span>
              </label>
              <select
                name="room_id"
                value={form.room_id}
                onChange={handleInputChange}
                className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10 ${errors.room_id ? "border-red-500 focus:ring-red-500" : "border-[#D3D9DD] focus:ring-[#8E9397]"
                  }`}
              >
                <option value="">Select a room</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_number} - {room.room_type} - ₦{room.price_per_night || room.base_price}/night
                  </option>
                ))}
              </select>
              {errors.room_id && <p className="mt-1 text-xs text-red-500">{errors.room_id}</p>}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <InputField
                label="Total Amount"
                type="number"
                placeholder="0.00"
                value={form.total_amount}
                onChange={handleInputChange}
                error=""
              />

              <InputField
                label="Amount Paid"
                type="number"
                placeholder="0.00"
                value={form.amount_paid}
                onChange={handleInputChange}
                error=""
              />
            </div>

            {/* Payment Summary */}
            <div className="p-6 bg-white border-2 border-[#E5E7EB] rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#5C5B59]">Total Amount:</span>
                <span className="text-2xl font-bold text-[#1A1A1A]">₦{parseFloat(form.total_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#5C5B59]">Amount Paid:</span>
                <span className="text-xl font-bold text-green-700">₦{parseFloat(form.amount_paid).toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t-2 border-[#E5E7EB] flex justify-between items-center">
                <span className="text-base font-bold text-[#1A1A1A]">Balance Due:</span>
                <span className={`text-2xl font-bold ${balanceDue > 0 ? "text-orange-600" : "text-green-700"}`}>
                  ₦{balanceDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Special Requests <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
            <textarea
              name="special_requests"
              value={form.special_requests}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm resize-none"
              placeholder="Enter any special requests or notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 bg-white border border-[#D3D9DD] text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <div className="flex-1">
              <Button
                text={loading ? "Creating Booking..." : "Create Booking"}
                type="submit"
                loading={loading}
                disabled={loading}
                fullWidth={true}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
