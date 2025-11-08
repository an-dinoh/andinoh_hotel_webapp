"use client";

import { useState } from "react";
import { ChevronDown, Plus, TrendingUp } from "lucide-react";
import WalletIcon from "@/icons/WalletIcon";

export default function WalletPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("JAN");
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Mock data for chart
  const chartData = [
    { range: "1 - 4", value: 30 },
    { range: "5 - 9", value: 50 },
    { range: "10 - 14", value: 35 },
    { range: "15 - 19", value: 45 },
    { range: "20 - 24", value: 60 },
    { range: "25 - 29", value: 40 },
    { range: "30", value: 75 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  // Mock transaction data
  const transactions = [
    { id: "CR-120", description: "Payment for Adebanjo", amount: "₦2300", date: "3 May, 2024", status: "Completed" },
    { id: "CR-121", description: "Added to Funds", amount: "-₦670", date: "3 May, 2024", status: "Pending" },
    { id: "CR-122", description: "Payment for Nawas", amount: "₦234", date: "3 May, 2024", status: "Completed" },
    { id: "CR-123", description: "Payment for Lana Byrd", amount: "₦5000", date: "3 May, 2024", status: "Failed" },
    { id: "CR-124", description: "Payment for Jese Leos", amount: "₦2300", date: "3 May, 2024", status: "Completed" },
    { id: "CR-125", description: "Payment for THEMSBERG LLC", amount: "₦560", date: "3 May, 2024", status: "Completed" },
  ];

  const upcomingPayments = [
    { amount: "₦200,000", project: "Product Designing", status: "Ongoing" },
    { amount: "₦550,000", project: "UI/UX", status: "Review" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#0B0A07] mb-8">Wallet</h1>

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Available Balance Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                <h2 className="text-4xl font-bold text-[#0B0A07]">₦222,000</h2>
                <span className="inline-block mt-2 text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  +22%
                </span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Plus size={18} />
                <span className="text-sm font-medium">Add Funds</span>
              </button>
            </div>
          </div>

          {/* Total Spent Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-2">Total Spent</p>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-4xl font-bold text-[#0B0A07]">₦110,000</h2>
                <span className="inline-block mt-2 text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                  -16%
                </span>
              </div>
              {/* Mini chart visualization */}
              <div className="w-32 h-16">
                <svg className="w-full h-full" viewBox="0 0 128 64" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="miniGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 Q20,20 40,35 T80,25 Q100,30 128,15"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M0,40 Q20,20 40,35 T80,25 Q100,30 128,15 L128,64 L0,64 Z"
                    fill="url(#miniGradient)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Spent Chart - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <WalletIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-[#0B0A07]">Total Spent</h3>
              </div>

              {/* Year and Month Selector */}
              <div className="flex items-center gap-2">
                {/* Year Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">{selectedYear}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showYearDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2 min-w-[120px]">
                      {[2024, 2023, 2022, 2021].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setShowYearDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                            year === selectedYear ? "bg-blue-50 text-blue-600 font-semibold" : ""
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Month Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {["JAN", "FEB", "MAR", "APR"].map((month) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedMonth === month
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                  <button className="p-1.5 hover:bg-gray-200 rounded-md">
                    <ChevronDown size={16} className="-rotate-90" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-3xl font-bold text-[#0B0A07]">₦65k</h4>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  +72%
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                <span>100k</span>
                <span>50k</span>
                <span>20k</span>
                <span>10k</span>
                <span>0</span>
              </div>

              {/* Chart */}
              <div className="ml-12 h-full pb-8">
                <div className="relative h-full border-l border-b border-gray-200">
                  {/* Grid lines */}
                  <div className="absolute inset-0">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute w-full border-t border-gray-100"
                        style={{ top: `${i * 25}%` }}
                      />
                    ))}
                  </div>

                  {/* Line Chart */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      points={chartData
                        .map((d, i) => {
                          const x = (i / (chartData.length - 1)) * 100;
                          const y = 100 - (d.value / maxValue) * 100;
                          return `${x}%,${y}%`;
                        })
                        .join(" ")}
                    />
                    {chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 100;
                      const y = 100 - (d.value / maxValue) * 100;
                      return (
                        <circle
                          key={i}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill="#EF4444"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  {chartData.map((d, i) => (
                    <span key={i}>{d.range}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Axis Labels */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span>↑</span>
                <span>y-axis: <strong className="text-[#0B0A07]">Amounts (₦)</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <span>→</span>
                <span>x-axis: <strong className="text-[#0B0A07]">Days</strong></span>
              </div>
            </div>
          </div>

          {/* Upcoming Payments - Takes 1 column */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-[#0B0A07]">Upcoming Payments</h3>
            </div>

            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-base font-bold text-[#0B0A07]">{payment.amount}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Project:</span>
                    <span className="text-sm font-semibold text-[#0B0A07]">{payment.project}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        payment.status === "Ongoing"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0B0A07]">Transaction History</h3>

            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">2024</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {["JAN", "FEB", "MAR", "APR"].map((month) => (
                  <button
                    key={month}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      month === "JAN"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {month}
                  </button>
                ))}
                <button className="p-1.5 hover:bg-gray-200 rounded-md">
                  <ChevronDown size={16} className="-rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{transaction.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{transaction.description}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">{transaction.amount}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing 1-10 of 1000</p>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronDown size={20} className="rotate-90 text-gray-600" />
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-sm">
                1
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                3
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                4
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                24
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronDown size={20} className="-rotate-90 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
