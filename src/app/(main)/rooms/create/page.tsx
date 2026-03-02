"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Bed,
  Users,
  DollarSign,
  Wifi,
  Tv,
  Coffee,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Sparkles,
} from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { RoomType, BedType } from "@/types/hotel.types";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface RoomForm {
  room_type: RoomType;
  title: string;
  description: string;
  base_price: string;
  max_occupancy: number;
  bed_type: BedType;
  size_sqm: string;
  amenities: string[];
  images: string[];
  is_available: boolean;
}

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<RoomForm>({
    room_type: "standard",
    title: "",
    description: "",
    base_price: "",
    max_occupancy: 2,
    bed_type: "queen",
    size_sqm: "",
    amenities: [],
    images: [],
    is_available: true,
  });

  const roomTypes = [
    { value: "standard", label: "Standard Room", icon: Bed },
    { value: "deluxe", label: "Deluxe Room", icon: Sparkles },
    { value: "suite", label: "Suite", icon: Sparkles },
    { value: "presidential", label: "Presidential Suite", icon: Sparkles },
  ];

  const bedTypes = [
    { value: "single", label: "Single Bed" },
    { value: "double", label: "Double Bed" },
    { value: "twin", label: "Twin Beds" },
    { value: "queen", label: "Queen Bed" },
    { value: "king", label: "King Bed" },
    { value: "sofa_bed", label: "Sofa Bed" },
  ];

  const availableAmenities = [
    { id: "wifi", label: "Free Wi-Fi", icon: Wifi },
    { id: "tv", label: "Smart TV", icon: Tv },
    { id: "coffee", label: "Coffee Maker", icon: Coffee },
    { id: "minibar", label: "Mini Bar", icon: Coffee },
    { id: "safe", label: "In-room Safe", icon: Bed },
    { id: "ac", label: "Air Conditioning", icon: Bed },
    { id: "balcony", label: "Private Balcony", icon: Bed },
    { id: "bathtub", label: "Bathtub", icon: Bed },
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) newErrors.title = "Room title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.base_price || parseFloat(form.base_price) <= 0)
      newErrors.base_price = "Valid price is required";
    if (!form.size_sqm || parseFloat(form.size_sqm) <= 0)
      newErrors.size_sqm = "Valid room size is required";

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

      await hotelService.createRoom({
        hotel: "", // Will be set by backend from authenticated user
        room_type: form.room_type,
        title: form.title,
        description: form.description,
        room_size: parseFloat(form.size_sqm),
        bed_type: form.bed_type,
        max_occupancy: form.max_occupancy,
        max_adults: form.max_occupancy,
        max_children: 0,
        base_price: form.base_price,
      });

      setSuccessMessage("Room created successfully!");
      setTimeout(() => {
        router.push("/rooms");
      }, 1500);
    } catch (error: unknown) {
      setErrors({
        submit:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to create room. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedValue = name === 'room_type' ? value as RoomType : name === 'bed_type' ? value as BedType : value;
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
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
            Add New Room
          </h1>
          <p className="text-gray-500 text-sm">
            Create a new room for your hotel
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-4 bg-[#ECFDF5] border border-green-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-700" />
            <p className="text-sm font-semibold text-green-800">
              {successMessage}
            </p>
          </div>
        )}

        {errors.submit && (
          <div className="p-4 bg-[#FEE2E2] border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-sm font-semibold text-red-800">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="room_type"
                  value={form.room_type}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="Room Title *"
                  type="text"
                  placeholder="e.g., Deluxe Ocean View Suite"
                  value={form.title}
                  onChange={handleInputChange}
                  error={errors.title}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm resize-none ${errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D3D9DD] focus:ring-[#8E9397]"
                    }`}
                  placeholder="Describe the room features, views, and highlights..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Room Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <InputField
                label="Base Price (₦) *"
                type="number"
                placeholder="0.00"
                value={form.base_price}
                onChange={handleInputChange}
                error={errors.base_price}
              />

              <InputField
                label="Max Occupancy"
                type="number"
                placeholder="2"
                value={form.max_occupancy.toString()}
                onChange={handleInputChange}
                error=""
              />

              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Bed Type
                </label>
                <select
                  name="bed_type"
                  value={form.bed_type}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  {bedTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Size (sq m) *"
                type="number"
                placeholder="e.g., 35.5"
                value={form.size_sqm}
                onChange={handleInputChange}
                error={errors.size_sqm}
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Room Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = form.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isSelected
                        ? "bg-[#0F75BD] border-[#0F75BD] text-white"
                        : "bg-white border-[#D3D9DD] text-gray-800 hover:border-[#0F75BD]"
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {amenity.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Status */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Availability
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_available: e.target.checked,
                  }))
                }
                className="w-5 h-5 text-[#0F75BD] border-[#D3D9DD] rounded focus:ring-[#0F75BD]"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">
                  Room is Available for Booking
                </span>
                <p className="text-xs text-gray-500">
                  Guests can book this room immediately
                </p>
              </div>
            </label>
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
                text={loading ? "Creating Room..." : "Create Room"}
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
