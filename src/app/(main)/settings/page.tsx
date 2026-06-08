"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Bell, Lock, Building2, ChevronRight, Mail, Globe, MapPin, Clock, Star, Upload, Shield, Phone } from "lucide-react";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#0F75BD]" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white border border-gray-100 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Hotel Form state
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

  // Notification states
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailBookings: true,
    smsCheckins: true,
    dailyReports: true,
    weeklyOccupancy: false,
    staffActivity: false,
    guestReviews: false,
  });

  // Password states
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    try {
      // Mock API delay for saving preferences
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Notification preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setUpdatingPassword(true);
    try {
      await hotelService.changeStaffPassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <div className="flex items-center">
          <span
            className="text-[#1A1A1A] font-black text-xl tracking-tight select-none"
            style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "-0.02em" }}
          >
            andinoh
          </span>
          <span
            className="inline-block w-[2px] h-[1.1em] bg-[#0F75BD] ml-[3px] translate-y-[1px]"
            style={{ animation: "blink 1.1s step-start infinite" }}
          />
        </div>
        <p className="mt-4 text-xs font-semibold text-[#8F8E8D] uppercase tracking-widest animate-pulse">
          loading settings
        </p>
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Custom transitions stylesheet */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-gray-100 py-6 shrink-0">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-[#5C5B59] mt-1">Manage your profile, hotel info, notifications, and security</p>
      </div>

      <div className="flex flex-1 overflow-hidden mt-6 gap-8">
        {/* Sidebar Navigation */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          <nav className="space-y-3">
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
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 border ${isActive
                    ? "bg-[#0F75BD] text-white border-[#0F75BD]"
                    : "bg-white/60 text-[#5C5B59] border-transparent hover:bg-white hover:text-[#0F75BD] hover:border-gray-100"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-white/10" : "bg-gray-100/80 text-[#5C5B59]"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-sm ${isActive ? "text-white" : "text-[#1A1A1A]"}`}>
                      {tab.label}
                    </div>
                    <div className={`text-xs ${isActive ? "text-white/80" : "text-[#5C5B59]"}`}>
                      {tab.description}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-white translate-x-1" : "text-[#8F8E8D]"}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-12 pr-4">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Personal Profile</h2>
                  <p className="text-gray-500 text-sm">Manage your personal hotel manager profile</p>
                </div>
                {!editing ? (
                  <Button
                    text="Edit Profile"
                    onClick={() => setEditing(true)}
                    fullWidth={false}
                    className="!h-10 px-5 text-sm"
                  />
                ) : (
                  <div className="flex gap-3">
                    <Button
                      text="Save Changes"
                      onClick={handleSave}
                      loading={saving}
                      disabled={saving}
                      fullWidth={false}
                      className="!h-10 px-5 text-sm"
                    />
                    <Button
                      text="Cancel"
                      onClick={() => setEditing(false)}
                      variant="secondary"
                      fullWidth={false}
                      className="!h-10 px-5 border border-gray-200 bg-white text-gray-800 text-sm hover:bg-gray-50"
                    />
                  </div>
                )}
              </div>

              {/* Profile Card */}
              <div className="bg-white/60 backdrop-blur-md border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="relative w-24 h-24 bg-[#0F75BD] rounded-3xl flex items-center justify-center text-white text-3xl font-black tracking-tight border-2 border-white">
                    {profileForm.fullName ? profileForm.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "AP"}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-lg text-gray-800">Profile Photo</h3>
                  <p className="text-sm text-[#5C5B59] mt-0.5 mb-3">Your initials avatar is automatically generated. Uploading custom photos will be available soon.</p>
                  {editing && (
                    <button className="mx-auto md:mx-0 px-4 py-2 bg-white border border-gray-200 text-[#1A1A1A] font-semibold text-xs rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-[#5C5B59]" />
                      Upload Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Data (Read-only vs Edit) */}
              {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0F75BD]/5 flex items-center justify-center shrink-0 text-[#0F75BD]">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block">Full Name</span>
                      <p className="text-base font-semibold text-gray-800 mt-1">{profileForm.fullName || "—"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0F75BD]/5 flex items-center justify-center shrink-0 text-[#0F75BD]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block">Email Address</span>
                      <p className="text-base font-semibold text-gray-800 mt-1 break-all">{profileForm.email || "—"}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-start gap-4 md:col-span-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0F75BD]/5 flex items-center justify-center shrink-0 text-[#0F75BD]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block">Phone Number</span>
                      <p className="text-base font-semibold text-gray-800 mt-1">{profileForm.phone || "—"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-[#5C5B59]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#5C5B59]" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#5C5B59] bg-gray-100 outline-none cursor-not-allowed"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#5C5B59]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hotel Details Tab */}
          {activeTab === "hotel" && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Hotel Information</h2>
                  <p className="text-gray-500 text-sm">Manage details of your property</p>
                </div>
                {!editing ? (
                  <Button
                    text="Edit Hotel"
                    onClick={() => setEditing(true)}
                    fullWidth={false}
                    className="!h-10 px-5 text-sm"
                  />
                ) : (
                  <div className="flex gap-3">
                    <Button
                      text="Save Changes"
                      onClick={handleSave}
                      loading={saving}
                      disabled={saving}
                      fullWidth={false}
                      className="!h-10 px-5 text-sm"
                    />
                    <Button
                      text="Cancel"
                      onClick={() => setEditing(false)}
                      variant="secondary"
                      fullWidth={false}
                      className="!h-10 px-5 border border-gray-200 bg-white text-gray-800 text-sm hover:bg-gray-50"
                    />
                  </div>
                )}
              </div>

              {!editing ? (
                <div className="space-y-8">
                  {/* General Info Card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500 block">Hotel Name</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.name || "—"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500 block">Description</span>
                        <p className="text-sm text-[#5C5B59] mt-1.5 leading-relaxed">{hotelForm.description || "No description provided."}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Hotel Type</span>
                        <p className="text-base font-semibold text-gray-800 mt-1 capitalize">{hotelForm.hotelType || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Total Rooms</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.totalRooms || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Star Rating</span>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < hotelForm.starRating ? "fill-[#FBB81F] text-[#FBB81F]" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#0F75BD]" />
                      Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-3">
                        <span className="text-sm font-medium text-gray-500 block">Address</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.address || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">City</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.city || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">State</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.state || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Country</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.country || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Postal Code</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.postalCode || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Hours Card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#0F75BD]" />
                      Contact & Operation Hours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Phone Number</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.phone || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Email Address</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.email || "—"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500 block">Website URL</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">
                          {hotelForm.website ? (
                            <a href={hotelForm.website} target="_blank" rel="noopener noreferrer" className="text-[#0F75BD] hover:underline">
                              {hotelForm.website}
                            </a>
                          ) : "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Check-in Time</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.checkInTime || "—"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Check-out Time</span>
                        <p className="text-base font-semibold text-gray-800 mt-1">{hotelForm.checkOutTime || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-8">
                  {/* General */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3">General Info</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Hotel Name</label>
                        <input
                          type="text"
                          value={hotelForm.name}
                          onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Description</label>
                        <textarea
                          value={hotelForm.description}
                          onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                          rows={4}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Hotel Type</label>
                          <select
                            value={hotelForm.hotelType}
                            onChange={(e) => setHotelForm({ ...hotelForm, hotelType: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10"
                          >
                            <option value="luxury">Luxury</option>
                            <option value="boutique">Boutique</option>
                            <option value="business">Business</option>
                            <option value="budget">Budget</option>
                            <option value="resort">Resort</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Star Rating</label>
                          <select
                            value={hotelForm.starRating}
                            onChange={(e) => setHotelForm({ ...hotelForm, starRating: parseInt(e.target.value) })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10"
                          >
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Total Rooms</label>
                          <input
                            type="number"
                            value={hotelForm.totalRooms}
                            onChange={(e) => setHotelForm({ ...hotelForm, totalRooms: parseInt(e.target.value) })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#0F75BD]" />
                      Location Info
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Address</label>
                        <input
                          type="text"
                          value={hotelForm.address}
                          onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">City</label>
                          <input
                            type="text"
                            value={hotelForm.city}
                            onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">State</label>
                          <input
                            type="text"
                            value={hotelForm.state}
                            onChange={(e) => setHotelForm({ ...hotelForm, state: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Country</label>
                          <input
                            type="text"
                            value={hotelForm.country}
                            onChange={(e) => setHotelForm({ ...hotelForm, country: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Postal Code</label>
                          <input
                            type="text"
                            value={hotelForm.postalCode}
                            onChange={(e) => setHotelForm({ ...hotelForm, postalCode: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operation & Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#0F75BD]" />
                      Contact & Operation Info
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Phone</label>
                          <input
                            type="tel"
                            value={hotelForm.phone}
                            onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Email</label>
                          <input
                            type="email"
                            value={hotelForm.email}
                            onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-gray-700 block">Website URL</label>
                          <input
                            type="url"
                            value={hotelForm.website}
                            onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Check-in Time</label>
                          <input
                            type="time"
                            value={hotelForm.checkInTime}
                            onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">Check-out Time</label>
                          <input
                            type="time"
                            value={hotelForm.checkOutTime}
                            onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Notification Preferences</h2>
                  <p className="text-gray-500 text-sm">Choose how you want to be notified about activity</p>
                </div>
                <Button
                  text="Save Preferences"
                  onClick={handleSavePreferences}
                  loading={savingPreferences}
                  disabled={savingPreferences}
                  fullWidth={false}
                  className="!h-10 px-5 text-sm"
                />
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-6 divide-y divide-gray-50">
                {[
                  { key: "emailBookings" as const, label: "Email notifications for new bookings", description: "Get notified when new bookings are made" },
                  { key: "smsCheckins" as const, label: "SMS alerts for check-ins", description: "Receive SMS when guests check in" },
                  { key: "dailyReports" as const, label: "Daily revenue reports", description: "Daily summary of your revenue" },
                  { key: "weeklyOccupancy" as const, label: "Weekly occupancy summaries", description: "Weekly overview of occupancy rates" },
                  { key: "staffActivity" as const, label: "Staff activity alerts", description: "Get notified about staff activities" },
                  { key: "guestReviews" as const, label: "Guest review notifications", description: "When guests leave reviews" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-6">
                    <div className="flex-1">
                      <div className="text-[#1A1A1A] font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-[#5C5B59] mt-0.5">{item.description}</div>
                    </div>
                    <Toggle
                      checked={notificationPreferences[item.key]}
                      onChange={() => setNotificationPreferences(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Security Settings</h2>
                <p className="text-gray-500 text-sm">Manage your password and security credentials</p>
              </div>

              {/* Change Password Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#0F75BD]" />
                  Change Password
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD]"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    text="Update Password"
                    onClick={handleUpdatePassword}
                    loading={updatingPassword}
                    disabled={updatingPassword}
                    fullWidth={false}
                    className="!h-10 px-5 text-sm"
                  />
                </div>
              </div>

              {/* Two-Factor Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#0F75BD]/10 rounded-2xl flex items-center justify-center shrink-0 text-[#0F75BD]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-sm text-[#5C5B59] mt-1 max-w-xl">
                        Add an extra layer of security to your account by requiring a verification code in addition to your password during sign in.
                      </p>
                      <div className="inline-flex items-center gap-1.5 mt-3 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Status: Not Enabled
                      </div>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-[#0F75BD] text-white font-bold text-sm rounded-xl hover:bg-[#0050C8] transition-colors shrink-0">
                    Enable 2FA
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
