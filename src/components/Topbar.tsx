"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, ChevronDown, Bell, Calendar, CheckCircle, AlertCircle, User, DollarSign, Clock, X, Settings, LogOut, UserCircle, Building2, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationIcon from "@/icons/NotificationIcon";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import GlobalSearchResults from "@/components/search/GlobalSearchResults";
import { hotelService } from "@/services/hotel.service";

export default function Topbar() {
  const { currencies, activeCurrency, isLoading, setCurrency } = useCurrency();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const hotel = await hotelService.getMyHotel();
        setIsVerified(hotel?.is_verified || false);
      } catch (err) {
        setIsVerified(false);
      }
    };
    checkVerification();
  }, []);

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
    <div className="h-20 bg-white border-b border-[#E5E7EB] px-12 md:px-16 lg:px-24 flex items-center justify-between">
      {/* Search Bar — only shown on dashboard */}
      {isDashboard ? (
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
            <input
              type="text"
              placeholder="Search bookings, rooms, guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-11 bg-[#FAFAFB] border border-[#E5E7EB] rounded-[16px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] text-[#1A1A1A] placeholder:text-[#8F8E8D] transition-colors"
            />
            {searchQuery.length >= 3 && (
              <GlobalSearchResults
                query={searchQuery}
                onClose={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Verified/Unverified Badge */}
        {isVerified === null ? (
          <div className="flex items-center gap-2 px-3 h-11 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[16px] animate-pulse">
            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
          </div>
        ) : isVerified ? (
          <div className="flex items-center gap-2 px-3 h-11 bg-[#F0FDF4] border border-[#A7F3D0] rounded-[16px]">
            <Shield className="w-4 h-4 text-[#059669]" />
            <span className="text-sm font-bold text-[#059669]">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 h-11 bg-[#FFFBEB] border border-[#FDE68A] rounded-[16px]">
            <AlertCircle className="w-4 h-4 text-[#D97706]" />
            <span className="text-sm font-bold text-[#D97706]">Unverified</span>
          </div>
        )}

        {/* Currency Switcher */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 h-11 bg-[#FAFAFB] border border-[#E5E7EB] rounded-[16px] hover:bg-[#F3F4F6] transition-all hover:-translate-y-0.5">
            <DollarSign className="w-4 h-4 text-[#5C5B59]" />
            <span className="text-sm font-bold text-[#1A1A1A]">
              {activeCurrency?.code || 'NGN'} ({activeCurrency?.symbol || '₦'})
            </span>
            <ChevronDown className="w-4 h-4 text-[#5C5B59] group-hover:rotate-180 transition-transform duration-300" />
          </button>

          <div className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-xl border border-white/60 rounded-[24px] overflow-hidden z-50 invisible group-hover:visible translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="py-2 bg-white/40">
              {isLoading ? (
                <div className="px-4 py-3 text-xs font-bold text-[#5C5B59] text-center">Loading currencies...</div>
              ) : Array.isArray(currencies) && (
                currencies.map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => setCurrency(currency.code)}
                    className={`w-full px-5 py-3 hover:bg-white/60 transition-colors flex items-center justify-between text-left ${activeCurrency?.code === currency.code ? 'bg-[#F0F9FF]/80 text-[#0F75BD]' : 'text-[#1A1A1A]'
                      }`}
                  >
                    <span className="text-sm font-bold">{currency.name}</span>
                    <span className="text-[10px] font-black tracking-wider text-[#5C5B59] bg-black/5 px-2 py-1 rounded-lg">
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
            className="relative w-11 h-11 flex items-center justify-center bg-[#FAFAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6] rounded-[16px] transition-all hover:-translate-y-0.5"
          >
            <NotificationIcon className="w-[1.125rem] h-[1.125rem] text-[#5C5B59]" />
            {unreadCount > 0 && (
              <div className="absolute top-2 right-2 flex items-center justify-center">
                <span className="absolute w-3 h-3 bg-[#0F75BD] rounded-full animate-ping opacity-75"></span>
                <span className="relative w-3.5 h-3.5 bg-[#0F75BD] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              </div>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-[26rem] bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[32px] overflow-hidden z-50 origin-top-right animate-in fade-in duration-200">
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E5E7EB]/50 bg-white/30 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-[#1A1A1A] text-lg tracking-tight">Notifications</h3>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-[#0F75BD] mt-1">{unreadCount} unread incoming</p>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white rounded-xl transition-all border border-black/5"
                  >
                    <X className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto scrollbar-hide bg-white/10">
                {notifications.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <div className="w-16 h-16 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                      <Bell className="w-8 h-8 text-[#5C5B59]" />
                    </div>
                    <p className="text-sm text-[#1A1A1A] font-bold">You're all caught up</p>
                    <p className="text-xs text-[#5C5B59] mt-1">No new notifications at the moment.</p>
                  </div>
                ) : (
                  notifications.map((notification: Notification) => {
                    const Icon = getIconForType(notification.type);
                    const iconStyles = getStylesForType(notification.type);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-6 py-4 border-b border-[#E5E7EB]/40 hover:bg-white/60 transition-colors cursor-pointer ${!notification.read ? "bg-[#F0F9FF]/60" : ""
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 ${iconStyles.bg} rounded-2xl border border-black/5 flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${iconStyles.color}`} />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-sm text-[#1A1A1A] leading-tight">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#0F75BD] rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className="text-[13px] text-[#5C5B59] mt-1.5 line-clamp-2 leading-relaxed">{notification.message}</p>
                            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-[#8F8E8D] uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white/30 backdrop-blur-md border-t border-[#E5E7EB]/50">
                <button
                  onClick={() => {
                    router.push('/notifications');
                    setShowNotifications(false);
                  }}
                  className="w-full text-center text-sm font-bold text-[#0F75BD] hover:text-[#0050C8] transition-colors"
                >
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
            className="flex items-center gap-3 bg-[#FAFAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6] rounded-[16px] transition-all hover:-translate-y-0.5 h-11 px-3 pl-1.5"
          >
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] rounded-[12px] flex items-center justify-center">
                <span className="text-white text-sm font-black text-center ml-0.5">AP</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full"></div>
            </div>
            <div className="text-left hidden sm:block">
              {/* <p className="text-sm font-bold text-[#1A1A1A] leading-tight">Adeyanju</p> */}
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#5C5B59]">Hotel Owner</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#5C5B59] transition-transform duration-300 ml-1 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[32px] overflow-hidden z-50 origin-top-right animate-in fade-in duration-200">
              {/* Profile Header */}
              <div className="px-6 py-6 bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[18px] flex items-center justify-center border border-white/30">
                      <span className="text-white text-xl font-black text-center ml-0.5">AP</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-white/20 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">Adeyanju</h3>
                    <p className="text-[11px] font-bold tracking-wider text-white/80 mt-0.5">adeyanju@andinoh.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2.5 space-y-1 bg-white/20">
                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full p-3 hover:bg-white/80 rounded-[20px] transition-all flex items-center gap-4 text-left group"
                >
                  <div className="w-11 h-11 bg-[#F0F9FF] border border-[#0F75BD]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0F75BD] transition-all">
                    <UserCircle className="w-5 h-5 text-[#0F75BD] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">My Profile</p>
                    <p className="text-[11px] font-medium text-[#5C5B59] mt-0.5">View and edit details</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full p-3 hover:bg-white/80 rounded-[20px] transition-all flex items-center gap-4 text-left group"
                >
                  <div className="w-11 h-11 bg-[#F5F3FF] border border-purple-600/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-all">
                    <Building2 className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">Hotel Settings</p>
                    <p className="text-[11px] font-medium text-[#5C5B59] mt-0.5">Manage your property</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full p-3 hover:bg-white/80 rounded-[20px] transition-all flex items-center gap-4 text-left group border-t border-transparent"
                >
                  <div className="w-11 h-11 bg-[#FEF3C7] border border-orange-600/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 transition-all">
                    <Settings className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">Account Settings</p>
                    <p className="text-[11px] font-medium text-[#5C5B59] mt-0.5">Privacy and security</p>
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

// Helper functions for notification icons and styles
function getIconForType(type: string) {
  switch (type) {
    case 'booking_update': return Calendar;
    case 'new_chat_message': return User;
    case 'hotel_status_update': return Shield;
    case 'reception_alert': return Bell;
    case 'inventory_updated': return Building2;
    default: return Bell;
  }
}

function getStylesForType(type: string) {
  switch (type) {
    case 'booking_update': return { bg: "bg-blue-50", color: "text-blue-600" };
    case 'new_chat_message': return { bg: "bg-purple-50", color: "text-purple-600" };
    case 'hotel_status_update': return { bg: "bg-green-50", color: "text-green-600" };
    case 'reception_alert': return { bg: "bg-orange-50", color: "text-orange-600" };
    case 'inventory_updated': return { bg: "bg-indigo-50", color: "text-indigo-600" };
    default: return { bg: "bg-gray-50", color: "text-gray-600" };
  }
}
