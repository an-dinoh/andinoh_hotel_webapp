"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Bell, Lock, Building2, ChevronRight, Mail, Globe, MapPin, Clock, Star, Upload, Shield, CreditCard } from "lucide-react";
import Image from "next/image";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";
import { User } from "@/types/auth.types";
import { Hotel } from "@/types/hotel.types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [initialLoading, setInitialLoading] = useState(true);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    description: "",
    hotelType: "",
    starRating: 0,
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    checkInTime: "",
    checkOutTime: "",
    totalRooms: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, hotel] = await Promise.all([
          authService.getCurrentUser(),
          hotelService.getMyHotel().catch(() => null)
        ]);

        if (user) {
          setProfileForm({
            fullName: user.full_name || "",
            email: user.email || "",
            phone: user.phone_number || "",
          });
        }

        if (hotel) {
          setHotelForm({
            name: hotel.name || "",
            description: hotel.description || "",
            hotelType: hotel.hotel_type || "",
            starRating: hotel.star_rating || 0,
            address: hotel.address || "",
            city: hotel.city || "",
            state: hotel.state || "",
            country: hotel.country || "",
            postalCode: hotel.postal_code || "",
            phone: hotel.phone || "",
            email: hotel.email || "",
            website: hotel.website || "",
            checkInTime: hotel.check_in_time || "",
            checkOutTime: hotel.check_out_time || "",
            totalRooms: hotel.total_rooms || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching settings data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon, description: "Manage your personal information" },
    { id: "hotel", label: "Hotel Details", icon: Building2, description: "Update your hotel information" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Configure notification preferences" },
    { id: "security", label: "Security", icon: Lock, description: "Password and security settings" },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "profile") {
        await authService.updateProfile({
          full_name: profileForm.fullName,
          phone_number: profileForm.phone,
        });
        toast.success("Profile updated successfully");
      } else if (activeTab === "hotel") {
        await hotelService.updateHotel({
          name: hotelForm.name,
          description: hotelForm.description,
          hotel_type: hotelForm.hotelType as any,
          star_rating: hotelForm.starRating as any,
          address: hotelForm.address,
          city: hotelForm.city,
          state: hotelForm.state,
          country: hotelForm.country,
          postal_code: hotelForm.postalCode,
          phone: hotelForm.phone,
          email: hotelForm.email,
          website: hotelForm.website,
          check_in_time: hotelForm.checkInTime,
          check_out_time: hotelForm.checkOutTime,
          total_rooms: hotelForm.totalRooms,
        });
        toast.success("Hotel details updated successfully");
      }
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] bg-white py-6">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-[#5C5B59] mt-1">Manage your account and hotel preferences</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-80 border-r border-[#E5E7EB] bg-[#FAFAFB] p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditing(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${isActive
                    ? "bg-[#0F75BD] text-white"
                    : "text-[#5C5B59] hover:bg-white hover:text-[#0F75BD]"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-sm ${isActive ? "text-white" : "text-[#1A1A1A]"}`}>
                      {tab.label}
                    </div>
                    <div className={`text-xs ${isActive ? "text-white/80" : "text-[#5C5B59]"}`}>
                      {tab.description}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-white" : "text-[#5C5B59]"}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-8 pl-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">Personal Profile</h2>
                  <p className="text-[#5C5B59] text-sm mt-1">Update your personal information</p>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-3 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-6 py-3 border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="bg-white rounded-2xl p-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-[#0F75BD] rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                    HM
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mb-3">Update your profile picture</p>
                    {editing && (
                      <button className="px-4 py-2 bg-white border border-[#D3D9DD] text-gray-800 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="bg-white rounded-2xl p-8 space-y-5">
                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium py-2">{profileForm.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium py-2">{profileForm.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium py-2">{profileForm.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hotel Details Tab */}
          {activeTab === "hotel" && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">Hotel Information</h2>
                  <p className="text-[#5C5B59] text-sm mt-1">Manage your hotel details and settings</p>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-3 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-colors"
                  >
                    Edit Hotel
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-6 py-3 border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-2xl p-8 space-y-5">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Hotel Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={hotelForm.name}
                      onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium py-2">{hotelForm.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Description</label>
                  {editing ? (
                    <textarea
                      value={hotelForm.description}
                      onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-[#5C5B59] py-3">{hotelForm.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Hotel Type</label>
                    {editing ? (
                      <select
                        value={hotelForm.hotelType}
                        onChange={(e) => setHotelForm({ ...hotelForm, hotelType: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                      >
                        <option value="luxury">Luxury</option>
                        <option value="boutique">Boutique</option>
                        <option value="business">Business</option>
                        <option value="budget">Budget</option>
                        <option value="resort">Resort</option>
                      </select>
                    ) : (
                      <p className="text-gray-800 font-medium py-2 capitalize">{hotelForm.hotelType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Star Rating</label>
                    {editing ? (
                      <select
                        value={hotelForm.starRating}
                        onChange={(e) => setHotelForm({ ...hotelForm, starRating: parseInt(e.target.value) })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-1 py-3">
                        {[...Array(hotelForm.starRating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#FBB81F] text-[#FBB81F]" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Total Rooms</label>
                    {editing ? (
                      <input
                        type="number"
                        value={hotelForm.totalRooms}
                        onChange={(e) => setHotelForm({ ...hotelForm, totalRooms: parseInt(e.target.value) })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.totalRooms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-8 space-y-5">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  <MapPin className="w-5 h-5 text-[#0F75BD]" />
                  Location
                </h3>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Address</label>
                  {editing ? (
                    <input
                      type="text"
                      value={hotelForm.address}
                      onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium py-2">{hotelForm.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">City</label>
                    {editing ? (
                      <input
                        type="text"
                        value={hotelForm.city}
                        onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">State</label>
                    {editing ? (
                      <input
                        type="text"
                        value={hotelForm.state}
                        onChange={(e) => setHotelForm({ ...hotelForm, state: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Country</label>
                    {editing ? (
                      <input
                        type="text"
                        value={hotelForm.country}
                        onChange={(e) => setHotelForm({ ...hotelForm, country: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.country}</p>
                    )}
                  </div>
                </div>

                <div className="w-1/3">
                  <label className="block text-[#0B0A07] text-sm mb-1">Postal Code</label>
                  {editing ? (
                    <input
                      type="text"
                      value={hotelForm.postalCode}
                      onChange={(e) => setHotelForm({ ...hotelForm, postalCode: e.target.value })}
                      className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium py-2">{hotelForm.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Contact & Operating Hours */}
              <div className="grid grid-cols-2 gap-6">
                {/* Contact */}
                <div className="bg-white rounded-2xl p-8 space-y-5">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Image src="/icons/call.svg" alt="Phone" width={20} height={20} />
                    Contact
                  </h3>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={hotelForm.phone}
                        onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        value={hotelForm.email}
                        onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Website</label>
                    {editing ? (
                      <input
                        type="url"
                        value={hotelForm.website}
                        onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.website}</p>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-white rounded-2xl p-8 space-y-5">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    <Clock className="w-5 h-5 text-[#0F75BD]" />
                    Operating Hours
                  </h3>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Check-in Time</label>
                    {editing ? (
                      <input
                        type="time"
                        value={hotelForm.checkInTime}
                        onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.checkInTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B0A07] text-sm mb-1">Check-out Time</label>
                    {editing ? (
                      <input
                        type="time"
                        value={hotelForm.checkOutTime}
                        onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                        className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium py-2">{hotelForm.checkOutTime}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="max-w-4xl space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Notification Preferences</h2>
                <p className="text-[#5C5B59] text-sm mt-1">Choose how you want to be notified</p>
              </div>

              <div className="bg-white rounded-2xl p-8 space-y-5">
                {[
                  { label: "Email notifications for new bookings", description: "Get notified when new bookings are made" },
                  { label: "SMS alerts for check-ins", description: "Receive SMS when guests check in" },
                  { label: "Daily revenue reports", description: "Daily summary of your revenue" },
                  { label: "Weekly occupancy summaries", description: "Weekly overview of occupancy rates" },
                  { label: "Staff activity alerts", description: "Get notified about staff activities" },
                  { label: "Guest review notifications", description: "When guests leave reviews" },
                ].map((item, index) => (
                  <label key={index} className="flex items-start gap-4 p-4 hover:bg-white rounded-xl transition-colors cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-[#0F75BD] border-[#E5E7EB] rounded mt-0.5 focus:ring-[#0F75BD]" defaultChecked={index < 3} />
                    <div className="flex-1">
                      <div className="text-[#1A1A1A] font-medium">{item.label}</div>
                      <div className="text-sm text-[#5C5B59] mt-0.5">{item.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button className="px-6 py-3 bg-[#0F75BD] text-white font-medium rounded-xl hover:bg-[#0050C8] transition-colors">
                Save Preferences
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="max-w-4xl space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Security Settings</h2>
                <p className="text-[#5C5B59] text-sm mt-1">Manage your password and security preferences</p>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-2xl p-8 space-y-5">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  <Lock className="w-5 h-5 text-[#0F75BD]" />
                  Change Password
                </h3>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0F75BD] focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0F75BD] focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-[#0B0A07] text-sm mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0F75BD] focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                <button className="px-6 py-3 bg-[#0F75BD] text-white font-medium rounded-xl hover:bg-[#0050C8] transition-colors">
                  Update Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#0F75BD]/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#0F75BD]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">Two-Factor Authentication</h3>
                      <p className="text-sm text-[#5C5B59] mt-1">Add an extra layer of security to your account</p>
                      <p className="text-xs text-[#5C5B59] mt-2">Status: <span className="text-red-500 font-medium">Not enabled</span></p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#0F75BD] text-white font-medium rounded-lg hover:bg-[#0050C8] transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
