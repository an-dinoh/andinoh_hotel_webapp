"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Hotel,
  Bed,
  Calendar,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Menu,
  Building2,
  User,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";

import LogoutIcon from "@/icons/LogoutIcon";
import BookingIcon from "@/icons/BookingIcon";
import PeopleIcon from "@/icons/PeopleIcon";
import SettingIcon from "@/icons/SettingIcon";
import CalendarIcon from "@/icons/CalendarIcon";
import DashboardIcon from "@/icons/DashboardIcon";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon, badge: null },
  { name: "My Hotel", href: "/my_hotel", icon: Building2, badge: null },
  { name: "Rooms", href: "/rooms", icon: BookingIcon, badge: null },
  { name: "Bookings", href: "/bookings", icon: CalendarIcon, badge: "3" },
  { name: "Staff", href: "/staff", icon: PeopleIcon, badge: null },
  { name: "Analytics", href: "/analytics", icon: BarChart3, badge: null },
  { name: "Settings", href: "/settings", icon: SettingIcon, badge: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">HotelMS</h1>
              <p className="text-xs text-gray-400">Management Suite</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
            <Hotel className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* User Profile Card */}
      {!collapsed && user && (
        <div className="mx-4 mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {user.full_name?.charAt(0)?.toUpperCase() ||
                user.email?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.full_name || user.hotel_name || "Hotel Owner"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-3 py-4 mb-8 space-y-1 overflow-y-auto flex-shrink-0"> 
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              {/* Active Indicator */}
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}

              <item.icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                } transition-colors`}
              />

              {!collapsed && (
                <>
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight size={16} className="text-white/50" />
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-gray-800"></div>

      {/* Bottom Section */}
      <div className="px-3 pb-4 pt-2 space-y-1">
        {/* Collapse Button (Desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="font-medium">Collapse</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
        >
          <LogoutIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-gray-900 transition-all duration-300 shadow-2xl ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="h-screen sticky top-0">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-blue-500/50 z-30 hover:shadow-blue-500/70 hover:scale-110 transition-all duration-200"
      >
        <Menu size={24} />
      </button>
    </>
  );
}
