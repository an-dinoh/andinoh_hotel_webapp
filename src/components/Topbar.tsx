"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Bell, Calendar, CheckCircle, AlertCircle, User, DollarSign, Clock, X, Settings, LogOut, UserCircle, Building2, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationIcon from "@/icons/NotificationIcon";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Topbar() {
  const { currencies, activeCurrency, isLoading, setCurrency } = useCurrency();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "booking",
      title: "New Booking Received",
      message: "John Doe booked a Deluxe Suite for 3 nights",
      time: "5 minutes ago",
      read: false,
      icon: Calendar,
      iconBg: "bg-[#F0F9FF]",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Confirmed",
      message: "₦150,000 received from Sarah Johnson",
      time: "1 hour ago",
      read: false,
      icon: DollarSign,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      type: "checkin",
      title: "Guest Checked In",
      message: "Michael Brown checked into Room 204",
      time: "2 hours ago",
      read: true,
      icon: CheckCircle,
      iconBg: "bg-[#F5F3FF]",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      type: "alert",
      title: "Maintenance Alert",
      message: "Room 305 requires maintenance attention",
      time: "3 hours ago",
      read: true,
      icon: AlertCircle,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-orange-600",
    },
    {
      id: 5,
      type: "user",
      title: "New Staff Member",
      message: "Emily Davis added as Receptionist",
      time: "5 hours ago",
      read: true,
      icon: User,
      iconBg: "bg-[#FEE2E2]",
      iconColor: "text-red-600",
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-20 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
          <input
            type="text"
            placeholder="Search bookings, rooms, guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-11 border border-[#D3D9DD] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent text-gray-800 placeholder:text-[#8F8E8D] placeholder:text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Verified Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl">
          <Shield className="w-4 h-4 text-[#059669]" />
          <span className="text-sm font-semibold text-[#059669]">Verified</span>
        </div>

        {/* Currency Switcher */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl hover:bg-[#F0F9FF] transition-colors">
            <DollarSign className="w-4 h-4 text-[#5C5B59]" />
            <span className="text-sm font-semibold text-[#1A1A1A]">
              {activeCurrency?.code || 'NGN'} ({activeCurrency?.symbol || '₦'})
            </span>
            <ChevronDown className="w-4 h-4 text-[#5C5B59]" />
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xl z-50 invisible group-hover:visible translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <div className="py-2">
              {isLoading ? (
                <div className="px-4 py-2 text-xs text-gray-500">Loading currencies...</div>
              ) : (
                currencies.map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => setCurrency(currency.code)}
                    className={`w-full px-4 py-3 hover:bg-[#FAFAFB] transition-colors flex items-center justify-between text-left ${activeCurrency?.code === currency.code ? 'bg-[#F0F9FF] text-[#0F75BD]' : 'text-[#1A1A1A]'
                      }`}
                  >
                    <span className="text-sm font-semibold">{currency.name}</span>
                    <span className="text-xs font-medium text-[#5C5B59] bg-[#EEF0F2] px-2 py-0.5 rounded-lg">
                      {currency.symbol} {currency.code}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFB] rounded-xl transition-colors"
          >
            <NotificationIcon className="w-6 h-6 text-[#5C5B59]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#0F75BD] text-white text-xs font-medium rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden z-50" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FAFAFB]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#1A1A1A]">Notifications</h3>
                    <p className="text-xs text-[#5C5B59] mt-0.5">{unreadCount} unread notifications</p>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[#5C5B59]" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto scrollbar-hide">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 border-b border-[#E5E7EB] hover:bg-[#FAFAFB] transition-colors cursor-pointer ${!notification.read ? "bg-[#F0F9FF]" : ""
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${notification.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-[#1A1A1A]">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#0F75BD] rounded-full flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-xs text-[#5C5B59] mt-1">{notification.message}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-[#5C5B59]">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-[#FAFAFB] border-t border-[#E5E7EB]">
                <button className="w-full text-center text-sm font-semibold text-[#0F75BD] hover:text-[#0050C8] transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-[#F9FAFB] rounded-2xl transition-all h-12 px-3 border border-transparent hover:border-[#E5E7EB]"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                <span className="text-white text-sm font-bold">AP</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#1A1A1A]">Adeyanju</p>
              <p className="text-xs text-[#5C5B59]">Hotel Owner</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#5C5B59] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden z-50 shadow-xl">
              {/* Profile Header */}
              <div className="px-4 py-4 bg-gradient-to-br from-[#0F75BD] to-[#02A5E6]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                      <span className="text-white text-base font-bold">AP</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Adeyanju</p>
                    <p className="text-xs text-white/80">adeyanju@andinoh.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-[#FAFAFB] transition-colors flex items-center gap-3 text-left group"
                >
                  <div className="w-9 h-9 bg-[#F0F9FF] rounded-xl flex items-center justify-center group-hover:bg-[#0F75BD] transition-colors">
                    <UserCircle className="w-5 h-5 text-[#0F75BD] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">My Profile</p>
                    <p className="text-xs text-[#5C5B59]">View and edit profile</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-[#FAFAFB] transition-colors flex items-center gap-3 text-left group"
                >
                  <div className="w-9 h-9 bg-[#F5F3FF] rounded-xl flex items-center justify-center group-hover:bg-[#0F75BD] transition-colors">
                    <Building2 className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Hotel Settings</p>
                    <p className="text-xs text-[#5C5B59]">Manage your property</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-[#FAFAFB] transition-colors flex items-center gap-3 text-left group"
                >
                  <div className="w-9 h-9 bg-[#FEF3C7] rounded-xl flex items-center justify-center group-hover:bg-[#0F75BD] transition-colors">
                    <Settings className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Account Settings</p>
                    <p className="text-xs text-[#5C5B59]">Privacy and security</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
