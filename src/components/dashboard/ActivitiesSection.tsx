"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

type ActivityTab = "gigs" | "saved" | "posts";

interface Tab {
  id: ActivityTab;
  label: string;
  count: number;
}

interface ActivitiesSectionProps {
  tabs: Tab[];
  initialTab?: ActivityTab;
  emptyStateMessage?: string;
  loading?: boolean;
}

export default function ActivitiesSection({
  tabs,
  initialTab = "gigs",
  emptyStateMessage = "No Active Bookings Yet!",
  loading = false,
}: ActivitiesSectionProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>(initialTab);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Property Activities</h2>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl text-[#0F75BD] text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-[#0F75BD] rounded-full animate-pulse" />
          Live Updates
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-50 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id
              ? "text-[#1A1A1A]"
              : "text-[#5C5B59] hover:text-[#1A1A1A]"
              }`}
          >
            {tab.label}
            <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-[10px] text-gray-500 font-black">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F75BD] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <Skeleton width="48px" height="48px" className="rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton width="160px" height="14px" />
                  <Skeleton width="100px" height="10px" />
                </div>
              </div>
              <Skeleton width="60px" height="24px" className="rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 border border-gray-100">
            <span className="text-4xl text-gray-200">📋</span>
          </div>
          <p className="text-sm font-bold text-[#1A1A1A] mb-1">
            {emptyStateMessage}
          </p>
          <p className="text-xs text-[#5C5B59]">Items will appear here as they are created.</p>
        </div>
      )}
    </div>
  );
}
