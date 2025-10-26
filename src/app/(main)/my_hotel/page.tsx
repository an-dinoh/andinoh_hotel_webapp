"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Edit2,
  Save,
  X,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import { hotelService } from "@/services/hotel.service";
import { Hotel as HotelType, HotelType as HotelCategory } from "@/types/hotel.types";

export default function MyHotelPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    hotel_type: "boutique" as HotelCategory,
    star_rating: 3 as 1 | 2 | 3 | 4 | 5,
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    phone: "",
    email: "",
    website: "",
    check_in_time: "15:00:00",
    check_out_time: "11:00:00",
    total_rooms: 0,
  });

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const data = await hotelService.getMyHotel();
      console.log("✅ Hotel response:", data);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid hotel data received");
      }

      setHotel(data);
      setForm({
        name: data.name || "",
        description: data.description || "",
        hotel_type: data.hotel_type || "boutique",
        star_rating: data.star_rating || 3,
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        postal_code: data.postal_code || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        check_in_time: data.check_in_time || "15:00:00",
        check_out_time: data.check_out_time || "11:00:00",
        total_rooms: data.total_rooms || 0,
      });
    } catch (error: any) {
      console.error("Error fetching hotel:", error);
      if (
        error?.response?.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        console.log("ℹ️ No hotel found - entering creation mode");
        setEditing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("💾 Saving hotel data:", form);

      if (hotel) {
        console.log("🔄 Updating existing hotel");
        await hotelService.updateHotel(form);
      } else {
        console.log("➕ Creating new hotel");
        await hotelService.createHotel(form);
      }

      await fetchHotel();
      setEditing(false);
    } catch (error: any) {
      console.error("Error saving hotel:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save hotel information";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading size="lg" text="Loading hotel information..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cover */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLS41IDM5LjVoNDEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex items-end gap-6 w-full">
            {/* Hotel Logo/Avatar */}
            <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white">
              {hotel ? (
                <Building2 className="w-16 h-16 text-blue-600" />
              ) : (
                <Building2 className="w-16 h-16 text-gray-400" />
              )}
            </div>

            {/* Hotel Info */}
            <div className="flex-1 pb-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                {hotel?.name || "Your Hotel"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {hotel?.city || "City"}, {hotel?.country || "Country"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(hotel?.star_rating || 0)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                {hotel?.total_rooms && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{hotel.total_rooms} Rooms</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="pb-4">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      if (hotel) fetchHotel();
                    }}
                    className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter hotel name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{hotel?.name || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {editing ? (
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your hotel..."
                    />
                  ) : (
                    <p className="text-gray-600">{hotel?.description || "No description"}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hotel Type
                    </label>
                    {editing ? (
                      <select
                        value={form.hotel_type}
                        onChange={(e) => setForm({ ...form, hotel_type: e.target.value as HotelCategory })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="luxury">Luxury</option>
                        <option value="boutique">Boutique</option>
                        <option value="business">Business</option>
                        <option value="budget">Budget</option>
                        <option value="resort">Resort</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{hotel?.hotel_type || "Not set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Star Rating
                    </label>
                    {editing ? (
                      <select
                        value={form.star_rating}
                        onChange={(e) => setForm({ ...form, star_rating: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-1">
                        {[...Array(hotel?.star_rating || 0)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Rooms
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={form.total_rooms}
                        onChange={(e) => setForm({ ...form, total_rooms: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{hotel?.total_rooms || "0"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Location
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Street address"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.address || "Not set"}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    {editing ? (
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{hotel?.city || "Not set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    {editing ? (
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{hotel?.state || "Not set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    {editing ? (
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{hotel?.country || "Not set"}</p>
                    )}
                  </div>
                </div>

                <div className="md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.postal_code}
                      onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.postal_code || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.phone || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.email || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {editing ? (
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.website || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Check-in/Check-out Times */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Operating Hours
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  {editing ? (
                    <input
                      type="time"
                      value={form.check_in_time.slice(0, 5)}
                      onChange={(e) => setForm({ ...form, check_in_time: e.target.value + ":00" })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.check_in_time?.slice(0, 5) || "15:00"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  {editing ? (
                    <input
                      type="time"
                      value={form.check_out_time.slice(0, 5)}
                      onChange={(e) => setForm({ ...form, check_out_time: e.target.value + ":00" })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{hotel?.check_out_time?.slice(0, 5) || "11:00"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            {hotel && (
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Profile Status</h3>
                </div>
                <p className="text-emerald-100 text-sm">
                  Your hotel profile is {hotel.is_active ? "active" : "inactive"} and{" "}
                  {hotel.is_verified ? "verified" : "pending verification"}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
