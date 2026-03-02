"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Plus, Download, TrendingUp, TrendingDown, Calendar, DollarSign, X, FileText, FileSpreadsheet, File, Building2 } from "lucide-react";
import Image from "next/image";
import { hotelService } from "@/services/hotel.service";
import { WalletStats } from "@/types/hotel.types";
import BankAccountsList from "@/components/wallet/BankAccountsList";
import WithdrawalModal from "@/components/wallet/WithdrawalModal";

interface Transaction {
  id: string;
  type: string;
  guest: string;
  room: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod?: string;
  time?: string;
  description?: string;
}

export default function WalletPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBankAccountsModal, setShowBankAccountsModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const stats = await hotelService.getWalletStats();
        setWalletStats(stats);
      } catch (error) {
        console.error("Failed to load wallet stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  // Mock transaction data
  const transactions: Transaction[] = [
    { id: "TXN-001", type: "Room Booking Payment", guest: "John Doe", room: "Suite 201", amount: 45000, date: "Dec 14, 2025", status: "Completed", paymentMethod: "Card", time: "10:30 AM", description: "3-night stay payment" },
    { id: "TXN-002", type: "Room Booking Payment", guest: "Jane Smith", room: "Deluxe 105", amount: 32000, date: "Dec 13, 2025", status: "Completed", paymentMethod: "Bank Transfer", time: "2:15 PM", description: "Standard booking" },
    { id: "TXN-003", type: "Booking Refund", guest: "Mike Johnson", room: "Standard 303", amount: -15000, date: "Dec 12, 2025", status: "Completed", paymentMethod: "Card Refund", time: "11:45 AM", description: "Cancellation refund" },
    { id: "TXN-004", type: "Room Booking Payment", guest: "Sarah Williams", room: "Presidential Suite", amount: 58000, date: "Dec 11, 2025", status: "Pending", paymentMethod: "Pending", time: "9:00 AM", description: "Awaiting payment confirmation" },
    { id: "TXN-005", type: "Room Service Payment", guest: "David Brown", room: "Suite 201", amount: 8000, date: "Dec 10, 2025", status: "Completed", paymentMethod: "Cash", time: "7:30 PM", description: "In-room dining" },
    { id: "TXN-006", type: "Room Booking Payment", guest: "Emily Davis", room: "Deluxe 108", amount: 35000, date: "Dec 10, 2025", status: "Completed", paymentMethod: "Card", time: "1:20 PM", description: "Weekend stay" },
    { id: "TXN-007", type: "Event Booking Payment", guest: "Robert Wilson", room: "Grand Ballroom", amount: 125000, date: "Dec 9, 2025", status: "Completed", paymentMethod: "Bank Transfer", time: "3:45 PM", description: "Corporate event" },
    { id: "TXN-008", type: "Room Booking Payment", guest: "Lisa Anderson", room: "Deluxe 204", amount: 42000, date: "Dec 8, 2025", status: "Completed", paymentMethod: "Card", time: "10:10 AM", description: "Business trip booking" },
    { id: "TXN-009", type: "Room Booking Payment", guest: "James Taylor", room: "Suite 305", amount: 55000, date: "Dec 7, 2025", status: "Completed", paymentMethod: "Card", time: "4:30 PM", description: "Honeymoon package" },
    { id: "TXN-010", type: "Booking Refund", guest: "Patricia Moore", room: "Standard 101", amount: -18000, date: "Dec 6, 2025", status: "Completed", paymentMethod: "Card Refund", time: "12:00 PM", description: "Emergency cancellation" },
    { id: "TXN-011", type: "Room Booking Payment", guest: "Christopher Lee", room: "Presidential Suite", amount: 95000, date: "Dec 5, 2025", status: "Completed", paymentMethod: "Bank Transfer", time: "9:15 AM", description: "VIP booking" },
    { id: "TXN-012", type: "Room Service Payment", guest: "Mary White", room: "Deluxe 210", amount: 12000, date: "Dec 4, 2025", status: "Completed", paymentMethod: "Card", time: "8:45 PM", description: "Room service" },
    { id: "TXN-013", type: "Event Booking Payment", guest: "Daniel Harris", room: "Conference Room A", amount: 75000, date: "Dec 3, 2025", status: "Pending", paymentMethod: "Pending", time: "11:00 AM", description: "Business conference" },
    { id: "TXN-014", type: "Room Booking Payment", guest: "Jennifer Martin", room: "Suite 402", amount: 48000, date: "Dec 2, 2025", status: "Completed", paymentMethod: "Card", time: "2:30 PM", description: "Weekend getaway" },
    { id: "TXN-015", type: "Room Booking Payment", guest: "Thomas Garcia", room: "Deluxe 115", amount: 38000, date: "Dec 1, 2025", status: "Completed", paymentMethod: "Cash", time: "5:00 PM", description: "Standard booking" },
    { id: "TXN-016", type: "Room Booking Payment", guest: "Nancy Rodriguez", room: "Standard 205", amount: 28000, date: "Nov 30, 2025", status: "Completed", paymentMethod: "Card", time: "10:45 AM", description: "Single night stay" },
    { id: "TXN-017", type: "Room Service Payment", guest: "Kevin Martinez", room: "Suite 301", amount: 15000, date: "Nov 29, 2025", status: "Completed", paymentMethod: "Card", time: "9:30 PM", description: "Dinner service" },
    { id: "TXN-018", type: "Event Booking Payment", guest: "Sandra Lopez", room: "Rooftop Terrace", amount: 180000, date: "Nov 28, 2025", status: "Completed", paymentMethod: "Bank Transfer", time: "1:00 PM", description: "Wedding reception" },
    { id: "TXN-019", type: "Room Booking Payment", guest: "Brian Gonzalez", room: "Deluxe 320", amount: 44000, date: "Nov 27, 2025", status: "Completed", paymentMethod: "Card", time: "11:15 AM", description: "Business stay" },
    { id: "TXN-020", type: "Booking Refund", guest: "Karen Hernandez", room: "Suite 105", amount: -22000, date: "Nov 26, 2025", status: "Completed", paymentMethod: "Card Refund", time: "3:20 PM", description: "Change of plans" },
    { id: "TXN-021", type: "Room Booking Payment", guest: "Steven Young", room: "Presidential Suite", amount: 98000, date: "Nov 25, 2025", status: "Completed", paymentMethod: "Bank Transfer", time: "10:00 AM", description: "Executive booking" },
    { id: "TXN-022", type: "Room Booking Payment", guest: "Betty King", room: "Deluxe 112", amount: 36000, date: "Nov 24, 2025", status: "Completed", paymentMethod: "Card", time: "4:15 PM", description: "Family vacation" },
    { id: "TXN-023", type: "Event Booking Payment", guest: "Edward Wright", room: "Banquet Hall", amount: 150000, date: "Nov 23, 2025", status: "Pending", paymentMethod: "Pending", time: "2:00 PM", description: "Gala dinner" },
    { id: "TXN-024", type: "Room Booking Payment", guest: "Dorothy Scott", room: "Suite 208", amount: 52000, date: "Nov 22, 2025", status: "Completed", paymentMethod: "Card", time: "12:30 PM", description: "Anniversary stay" },
    { id: "TXN-025", type: "Room Service Payment", guest: "Ronald Green", room: "Deluxe 405", amount: 9500, date: "Nov 21, 2025", status: "Completed", paymentMethod: "Cash", time: "7:00 PM", description: "Mini bar and snacks" },
  ];

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handleExport = (format: string) => {
    setShowExportModal(false);
    alert(`Exporting report as ${format.toUpperCase()}...`);
    // Implement actual export logic here
  };

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Wallet</h1>
            <p className="text-[#5C5B59] mt-1">Manage your hotel finances and transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBankAccountsModal(true)}
              className="px-4 py-2.5 border border-[#D3D9DD] text-sm text-[#1A1A1A] font-medium rounded-2xl hover:bg-[#FAFAFB] transition-colors flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Bank Accounts
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 bg-[#0F75BD] text-sm text-white font-medium rounded-2xl hover:bg-[#0050C8] transition-colors flex items-center gap-2 w-fit"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F5F5F5] rounded-2xl p-5 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />}
            <p className="text-[#5C5B59] text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">₦{(walletStats?.total_lifetime_revenue || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Lifetime</span>
            </div>
          </div>

          <div className="bg-[#F0F9FF] rounded-2xl p-5 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />}
            <p className="text-[#5C5B59] text-sm mb-1">Total Withdrawals</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">₦{(walletStats?.total_withdrawn || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-600">Withdrawn</span>
            </div>
          </div>

          <div className="bg-[#FEF3C7] rounded-2xl p-5 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />}
            <p className="text-[#5C5B59] text-sm mb-1">Pending Clearance</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">₦{(walletStats?.pending_clearance || 0).toLocaleString()}</p>
            <p className="text-xs text-[#5C5B59] mt-2">Awaiting settlement</p>
          </div>

          <div className="bg-[#F5F3FF] rounded-2xl p-5 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />}
            <p className="text-[#5C5B59] text-sm mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">₦{(walletStats?.available_balance || 0).toLocaleString()}</p>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="text-xs font-medium text-[#0F75BD] mt-2 hover:underline"
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] rounded-xl hover:bg-[#FAFAFB] transition-colors"
            >
              <Calendar className="w-5 h-5 text-[#5C5B59]" />
              <span className="text-sm font-medium text-[#1A1A1A]">{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4 text-[#5C5B59]" />
            </button>

            {showPeriodDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl z-10 py-2 shadow-lg">
                {["Today", "This Week", "This Month", "This Year", "Custom Range"].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowPeriodDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#FAFAFB] transition-colors ${selectedPeriod === period ? "text-[#0F75BD] font-semibold bg-[#E8F4F8]" : "text-[#1A1A1A]"
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                    Guest / Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#5C5B59] uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    onClick={() => setSelectedTransaction(transaction)}
                    className="hover:bg-[#FAFAFB] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#1A1A1A]">{transaction.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#5C5B59]">{transaction.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#1A1A1A]">{transaction.guest}</p>
                      <p className="text-xs text-[#5C5B59]">{transaction.room}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#5C5B59]">{transaction.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "Completed"
                          ? "bg-[#ECFDF5] text-green-700"
                          : transaction.status === "Pending"
                            ? "bg-[#FEF3C7] text-yellow-700"
                            : "bg-[#FEE2E2] text-red-700"
                          }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="flex items-center justify-center gap-2 m-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 rotate-90 text-[#5C5B59] text-xs" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum === 2 && currentPage > 3 && totalPages > 5) {
                    return <span key="dots1" className="px-2 text-[#5C5B59]">...</span>;
                  }
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 2 && totalPages > 5) {
                    return <span key="dots2" className="px-2 text-[#5C5B59]">...</span>;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${currentPage === pageNum
                        ? "bg-[#0F75BD] text-white"
                        : "hover:bg-[#FAFAFB] text-[#1A1A1A] font-regular"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 hover:bg-[#FAFAFB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90 text-[#5C5B59]" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Transaction Details</h2>
                  <p className="text-white/80">{selectedTransaction.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Amount Card */}
              <div className={`p-6 rounded-2xl ${selectedTransaction.amount > 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'}`}>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Transaction Amount</p>
                <p className={`text-4xl font-bold ${selectedTransaction.amount > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedTransaction.amount > 0 ? "+" : ""}₦{Math.abs(selectedTransaction.amount).toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${selectedTransaction.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : selectedTransaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Transaction Type</p>
                  <p className="text-base font-medium text-[#1A1A1A]">{selectedTransaction.type}</p>
                </div>

                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Payment Method</p>
                  <p className="text-base font-medium text-[#1A1A1A]">{selectedTransaction.paymentMethod}</p>
                </div>

                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Guest Name</p>
                  <p className="text-base font-medium text-[#1A1A1A]">{selectedTransaction.guest}</p>
                </div>

                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Room</p>
                  <p className="text-base font-medium text-[#1A1A1A]">{selectedTransaction.room}</p>
                </div>

                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Date</p>
                  <p className="text-base font-medium text-[#1A1A1A]">{selectedTransaction.date}</p>
                </div>

                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Time</p>
                  <p className="text-base font-medium text-[#1A1A1A]">{selectedTransaction.time}</p>
                </div>
              </div>

              {/* Description */}
              {selectedTransaction.description && (
                <div className="p-4 bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl">
                  <p className="text-xs font-semibold text-[#5C5B59] uppercase mb-2">Description</p>
                  <p className="text-sm text-[#1A1A1A]">{selectedTransaction.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-6 py-3 bg-[#0F75BD] text-white rounded-xl hover:bg-[#0050C8] transition-all font-semibold flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button className="flex-1 px-6 py-3 bg-white border border-[#D3D9DD] text-gray-800 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#1A1A1A]">Export Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#5C5B59]" />
              </button>
            </div>
            <p className="text-[#5C5B59] mb-6">Choose a format to export your wallet report</p>

            <div className="space-y-3">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full p-4 border-2 border-[#D3D9DD] rounded-xl hover:border-[#0F75BD] hover:bg-[#E8F4F8] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1A1A1A]">PDF Document</p>
                  <p className="text-sm text-[#5C5B59]">Portable document format</p>
                </div>
              </button>

              <button
                onClick={() => handleExport('excel')}
                className="w-full p-4 border-2 border-[#D3D9DD] rounded-xl hover:border-[#0F75BD] hover:bg-[#E8F4F8] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1A1A1A]">Excel Spreadsheet</p>
                  <p className="text-sm text-[#5C5B59]">Microsoft Excel format (.xlsx)</p>
                </div>
              </button>

              <button
                onClick={() => handleExport('csv')}
                className="w-full p-4 border-2 border-[#D3D9DD] rounded-xl hover:border-[#0F75BD] hover:bg-[#E8F4F8] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <File className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1A1A1A]">CSV File</p>
                  <p className="text-sm text-[#5C5B59]">Comma-separated values</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Accounts Modal */}
      {showBankAccountsModal && (
        <BankAccountsList
          isOpen={showBankAccountsModal}
          onClose={() => setShowBankAccountsModal(false)}
        />
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <WithdrawalModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          availableBalance={walletStats?.available_balance || 0}
        />
      )}
    </div>
  );
}
