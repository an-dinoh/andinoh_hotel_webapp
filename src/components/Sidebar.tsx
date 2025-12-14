"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Hotel, ChevronLeft, Menu, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";

import LogoutIcon from "@/icons/LogoutIcon";
import BookingIcon from "@/icons/BookingIcon";
import PeopleIcon from "@/icons/PeopleIcon";
import SettingIcon from "@/icons/SettingIcon";
import CalendarIcon from "@/icons/CalendarIcon";
import DashboardIcon from "@/icons/DashboardIcon";
import DangerIcon from "@/icons/DangerIcon";
import HelpIcon from "@/icons/HelpIcon";

import ArrowRightIcon from "@/icons/ArrowRightIcon";
import ArrowLeftIcon from "@/icons/ArrowLeftIcon";
import LogoutModal from "@/components/LogoutModal";
import WalletIcon from "@/icons/WalletIcon";
import MessageIcon from "@/icons/MessageIcon";

const navigationMain = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon, badge: null },
  { name: "My Hotel", href: "/my_hotel", icon: Building2, badge: null },
  { name: "Rooms", href: "/rooms", icon: BookingIcon, badge: null },
  { name: "Bookings", href: "/bookings", icon: CalendarIcon, badge: "3" },
  { name: "Wallet", href: "/wallet", icon: WalletIcon, badge: null },
  { name: "Chats", href: "/chats", icon: MessageIcon, badge: "1" },
  { name: "Staff", href: "/staff", icon: PeopleIcon, badge: null },
];

const navigationSecondary = [
  { name: "Settings", href: "/settings", icon: SettingIcon, badge: null },
  { name: "Reports", href: "/reports", icon: DangerIcon, badge:  null },
  { name: "Help & Support", href: "/help", icon: HelpIcon, badge: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    authService.logout();
    setShowLogoutModal(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white relative">
      {/* Collapse Button - Positioned at top right edge */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-3 z-50 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#5C5B59] hover:bg-[#B3B3B2]/20 hover:text-[#B3B3B2] transition-all duration-200"
      >
        {collapsed ? (
          <ArrowRightIcon className="w-3.5 h-3.5" />
        ) : (
          <ArrowLeftIcon className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Logo Section - Aligned with Topbar height */}
      <div className="h-[80px] flex items-center overflow-hidden">
        {!collapsed ? (
          <div className="flex items-center gap-3 pl-4">
            <div className="w-10 h-10 bg-white border-1 border-[#0F75BD] rounded-xl flex items-center justify-center p-1.5">
              <Image
                src="/logos/ANDINOH.svg"
                alt="Andinoh"
                width={32}
                height={32}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-lg text-[#0B0A07]">Andinoh</h1>
              <p className="text-xs text-[#5C5B59]">Management</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-white border-2 border-[#0F75BD] rounded-xl flex items-center justify-center mx-auto p-1.5">
            <Image
              src="/logos/ANDINOH.svg"
              alt="Andinoh"
              width={32}
              height={32}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Divider to match topbar border */}
      <div className="border-b border-gray-200"></div>

      {/* Navigation */}

      <nav className="px-4 pt-8 space-y-3 overflow-y-auto flex-shrink-0">
        {navigationMain.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center justify-center ${
                !collapsed && "gap-3"
              } ${
                collapsed ? "px-2" : "px-5"
              } py-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive
                  ? "bg-[#0F75BD] text-white"
                  : "text-gray-300 hover:bg-[#EEF0F2] hover:text-[#0F75BD]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-[#5C5B59] group-hover:text-[#0F75BD]"
                }`}
              />

              {!collapsed && (
                <>
                  <span
                    className={`${
                      isActive
                        ? "font-semibold text-[#FFFFFF]"
                        : "font-regular text-[#3C3B39]"
                    } text-sm flex-1 whitespace-nowrap`}
                  >
                    {item.name}
                  </span>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {collapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-6 border-t border-[#E5E7EB] space-y-3"></div>

      {/* Secondary Navigation */}
      <nav className="px-4 space-y-3 overflow-y-auto flex-shrink-0">
        {navigationSecondary.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center justify-center ${
                !collapsed && "gap-3"
              } ${
                collapsed ? "px-2" : "px-5"
              } py-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive
                  ? "bg-[#0F75BD] text-white text-sm"
                  : "text-gray-300 hover:bg-[#EEF0F2] hover:text-[#0F75BD]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-[#5C5B59] group-hover:text-[#0F75BD]"
                }`}
              />

              {!collapsed && (
                <>
                  <span
                    className={`${
                      isActive
                        ? "font-semibold text-[#FFFFFF]"
                        : "font-regular text-[#3C3B39]"
                    } text-sm flex-1 whitespace-nowrap`}
                  >
                    {item.name}
                  </span>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {collapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 my-10 border-t border-[#E5E7EB]"></div>

      {/* Bottom Section */}
      <div className="px-4 pb-4 pt-2 space-y-1">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center ${
            !collapsed && "gap-3"
          } ${
            collapsed ? "px-2" : "px-5"
          } py-3 w-full rounded-xl transition-all duration-300 ease-in-out group hover:bg-red-500/10`}
        >
          <LogoutIcon className="w-5 h-5 text-red-400 group-hover:text-red-300 group-hover:rotate-180 transition-all duration-300" />
          {!collapsed && (
            <span className="font-regular text-sm text-red-400 flex-1 text-left">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-white transition-all duration-300 border-l border-gray-200 ${
          collapsed ? "w-20" : "w-[244px]"
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
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-[#0F75BD] to-[#002968] text-white p-4 rounded-full shadow-2xl shadow-[#0F75BD]/50 z-30 hover:shadow-[#0F75BD]/70 hover:scale-110 transition-all duration-200"
      >
        <Menu size={24} />
      </button>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
