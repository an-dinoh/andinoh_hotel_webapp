"use client";

import { useState } from "react";
import AnalyticsDatePicker from "@/components/ui/AnalyticsDatePicker";

type AnalyticsView = "revenue" | "gigs";

interface AnalyticsChartProps {
  revenueData: number[];
  gigsData: number[];
  currency?: string;
  initialView?: AnalyticsView;
}

export default function AnalyticsChart({
  revenueData,
  gigsData,
  currency = "₦",
  initialView = "revenue"
}: AnalyticsChartProps) {
  const [analyticsView, setAnalyticsView] = useState<AnalyticsView>(initialView);

  // Helper function to generate SVG points from data
  const generateChartPoints = (data: number[], chartHeight: number, chartWidth: number) => {
    if (data.length === 0) return "0,256";

    const maxValue = Math.max(...data, 1);
    const pointSpacing = chartWidth / (data.length - 1 || 1);

    return data
      .map((value, index) => {
        const x = index * pointSpacing;
        const y = chartHeight - (value / maxValue) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const currentData = analyticsView === "revenue" ? revenueData : gigsData;
  const currentValue = analyticsView === "revenue" ? `${currency}0` : "0";

  return (
    <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-3xl p-6 flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Analytics Overview
          </h2>
        </div>
        <AnalyticsDatePicker />
      </div>

      {/* Chart Section */}
      <div className="space-y-6">
        {/* Toggle Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnalyticsView("revenue")}
            className={`px-6 py-2.5 text-sm font-semibold rounded-2xl transition-colors ${
              analyticsView === "revenue"
                ? "bg-[#0F75BD] text-white"
                : "bg-transparent text-[#5C5B59] hover:bg-gray-100"
            }`}
          >
            Total Revenue
          </button>
          <button
            onClick={() => setAnalyticsView("gigs")}
            className={`px-6 py-2.5 text-sm font-medium rounded-2xl transition-colors ${
              analyticsView === "gigs"
                ? "bg-[#0F75BD] text-white"
                : "bg-transparent text-[#5C5B59] hover:bg-gray-100"
            }`}
          >
            Total Bookings
          </button>
        </div>

        {/* Amount and Percentage */}
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold text-[#1A1A1A]">
            {currentValue}
          </h1>
          <span className="text-sm text-[#5C5B59] bg-[#EEF0F2] px-3 py-1 rounded-full">
            -%
          </span>
        </div>

        {/* Chart Container */}
        <div className="relative pt-8 pb-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-[#5C5B59]">
            <span>100k</span>
            <span>50k</span>
            <span>20k</span>
            <span>10k</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 border-l border-b border-gray-200">
            {/* Grid lines */}
            <div className="relative h-64">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-gray-100"
                  style={{ top: `${i * 25}%` }}
                />
              ))}

              {/* Chart line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  points={generateChartPoints(currentData, 256, 512)}
                />
                {/* Dots */}
                {currentData.map((value, i) => {
                  const maxValue = Math.max(...currentData, 1);
                  const x = (i * 512) / (currentData.length - 1 || 1);
                  const y = 256 - (value / maxValue) * 256;
                  return <circle key={i} cx={x} cy={y} r="4" fill="#EF4444" />;
                })}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pt-3 text-xs text-[#5C5B59]">
              <span>1 - 4</span>
              <span>5 - 9</span>
              <span>10 - 14</span>
              <span>15 - 19</span>
              <span>20 - 24</span>
              <span>25 - 29</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* Axis Labels */}
        <div className="flex items-center justify-center gap-8 pt-2 text-sm text-[#5C5B59]">
          <div className="flex items-center gap-2">
            <span>↑</span>
            <span>y-axis: <strong className="font-medium text-[#1A1A1A]">Amount</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>→</span>
            <span>x-axis: <strong className="font-medium text-[#1A1A1A]">Days</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
