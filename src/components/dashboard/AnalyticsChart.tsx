"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface AnalyticsChartProps {
  series: Array<{ date: string; label: string; count: number; value: number }>;
  currency?: string;
  loading?: boolean;
}

export default function AnalyticsChart({
  series = [],
  currency = "₦",
  loading = false,
}: AnalyticsChartProps) {
  const [view, setView] = useState<"revenue" | "bookings">("revenue");
  const skeletonHeights = ["70%", "44%", "52%", "22%", "35%", "78%", "72%", "66%", "53%", "77%", "36%", "42%"];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Performance Trends</h2>
          <p className="text-sm text-[#5C5B59] mt-1">Detailed analytics of your property operations</p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button
            onClick={() => setView("revenue")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === "revenue" ? "bg-white text-[#0F75BD]" : "text-[#5C5B59] hover:bg-white/50"
              }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setView("bookings")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === "bookings" ? "bg-white text-[#0F75BD]" : "text-[#5C5B59] hover:bg-white/50"
              }`}
          >
            Bookings
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full flex items-end gap-3 px-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end gap-2 h-full">
              <Skeleton
                width="100%"
                height={skeletonHeights[i % skeletonHeights.length]}
                className="rounded-t-xl bg-blue-50"
              />
            </div>
          ))
        ) : series.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <span className="text-4xl mb-4">📊</span>
            <p className="text-sm font-medium">No performance data available for this period.</p>
          </div>
        ) : (
          series.map((item, i) => {
            const dataProperty = view === "revenue" ? "value" : "count";
            const vals = series.map(s => s[dataProperty]);
            const max = Math.max(...vals, 1);
            const val = item[dataProperty];
            const height = (val / max) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                <div
                  style={{ height: `${Math.max(height, 5)}%` }}
                  className={`${view === 'revenue' ? 'bg-[#E6EFF6] hover:bg-[#0F75BD]' : 'bg-[#E7F2EB] hover:bg-[#117C35]'} rounded-t-xl transition-all duration-500 cursor-pointer relative`}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none z-20 shadow-xl">
                    {view === 'revenue' ? `${currency}${val.toLocaleString()}` : `${val} Bookings`}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1A] rotate-45" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && series.length > 0 && (
        <div className="flex justify-between mt-8 pt-8 border-t border-gray-50 px-4">
          {series.map((item, i) => (
            <span key={i} className="text-[10px] font-bold text-[#5C5B59] uppercase tracking-widest">{item.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
