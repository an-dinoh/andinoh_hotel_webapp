"use client";

import { useState } from "react";

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
}

export default function ActivitiesSection({
  tabs,
  initialTab = "gigs",
  emptyStateMessage = "No Active Bookings Yet!"
}: ActivitiesSectionProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>(initialTab);

  return (
    <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-3xl p-6">
      <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6">Your Activities</h2>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-[#0F75BD] border-b-2 border-[#0F75BD]"
                : "text-[#5C5B59] hover:text-[#1A1A1A]"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-32 h-32 bg-gray-200 rounded-3xl flex items-center justify-center mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="h-2 w-16 bg-gray-400 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="h-2 w-16 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
        <p className="text-sm font-regular text-[#1A1A1A]">
          {emptyStateMessage}
        </p>
      </div>
    </div>
  );
}
