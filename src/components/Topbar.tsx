"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import NotificationIcon from "@/icons/NotificationIcon";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-[80px] bg-white border-b border-gray-200 px-6 flex items-center justify-between overflow-hidden">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 h-[38px] border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Verified badge */}
      <div className="flex items-center justify-center border border-[#117C35] rounded-2xl h-[38px] px-4 bg-[#E7F2EB] ml-4">
        <span className="text-[#117C35] text-sm font-medium">verified</span>
      </div>

      {/* Right Section: Notification + Profile */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification Icon */}
        <button className="relative w-[36px] h-[36px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
          <NotificationIcon className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Section */}
        <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors h-[38px] px-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AP</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Adeyanju</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
