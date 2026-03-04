"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp, DollarSign, Users, FileText, Download, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { ReportJob } from "@/types/hotel.types";
import { toast } from "react-hot-toast";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    report_type: "revenue",
    start_date: "",
    end_date: "",
    format: "pdf",
  });
  const [recentJobs, setRecentJobs] = useState<ReportJob[]>([]);

  // Simple polling mechanism for pending jobs
  const updatePendingJobs = useCallback(async () => {
    const pendingJobs = recentJobs.filter(
      job => job.status === "pending" || job.status === "processing"
    );

    if (pendingJobs.length === 0) return;

    let updated = false;
    const newJobs = [...recentJobs];

    for (let i = 0; i < newJobs.length; i++) {
      const job = newJobs[i];
      if (job.status === "pending" || job.status === "processing") {
        try {
          const status = await hotelService.getReportJob(job.id);
          if (status.status !== job.status) {
            newJobs[i] = status;
            updated = true;
          }
        } catch (error) {
          console.error("Failed to fetch job status", error);
        }
      }
    }

    if (updated) {
      setRecentJobs(newJobs);
    }
  }, [recentJobs]);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePendingJobs();
    }, 5000);

    return () => clearInterval(interval);
  }, [updatePendingJobs]);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date) {
      toast.error("Please select a date range");
      return;
    }

    try {
      setLoading(true);
      const newJob = await hotelService.generateReport({
        report_type: form.report_type,
        start_date: form.start_date,
        end_date: form.end_date,
        format: form.format,
      });

      toast.success("Report generation started");
      setRecentJobs(prev => [newJob, ...prev]);
    } catch (error: any) {
      toast.error(error.message || "Failed to start report generation");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "pending":
      case "processing": return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="h-full bg-[#F9FAFB] overflow-y-auto scrollbar-hide pt-8 pb-8 px-6 lg:px-8">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Analytics & Reports</h1>
          <p className="text-[#5C5B59] mt-1">Generate deep insights into your hotel's performance</p>
        </div>

        {/* Top Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Revenue</h3>
              <p className="text-sm text-[#5C5B59] mt-0.5">Financial Tracking</p>
            </div>
          </Card>
          <Card className="p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Occupancy</h3>
              <p className="text-sm text-[#5C5B59] mt-0.5">Room Utilization</p>
            </div>
          </Card>
          <Card className="p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Guests</h3>
              <p className="text-sm text-[#5C5B59] mt-0.5">Demographics & Trends</p>
            </div>
          </Card>
          <Card className="p-6 border border-[#E5E7EB] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Payments</h3>
              <p className="text-sm text-[#5C5B59] mt-0.5">Ledger & Transactions</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Generator Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-[#E5E7EB] shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0F75BD]" />
                  Generate Custom Report
                </h2>
                <p className="text-sm text-[#5C5B59] mt-1">Select parameters to generate an asynchronous report.</p>
              </div>

              <form onSubmit={handleGenerateReport} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Report Type</label>
                  <select
                    value={form.report_type}
                    onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] appearance-none"
                  >
                    <option value="revenue">Revenue & Financials</option>
                    <option value="occupancy">Occupancy & Rooms</option>
                    <option value="guests">Guest Demographics</option>
                    <option value="events">Events & Banqueting</option>
                    <option value="staff">Staff Performance</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Start Date</label>
                    <input
                      type="date"
                      required
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className="w-full border border-[#D3D9DD] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">End Date</label>
                    <input
                      type="date"
                      required
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      className="w-full border border-[#D3D9DD] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Export Format</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        checked={form.format === "pdf"}
                        onChange={() => setForm({ ...form, format: "pdf" })}
                        className="text-[#0F75BD] focus:ring-[#0F75BD]"
                      />
                      <span className="text-sm font-medium text-[#1A1A1A]">PDF</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        checked={form.format === "csv"}
                        onChange={() => setForm({ ...form, format: "csv" })}
                        className="text-[#0F75BD] focus:ring-[#0F75BD]"
                      />
                      <span className="text-sm font-medium text-[#1A1A1A]">CSV / Excel</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0F75BD] text-white rounded-xl font-medium hover:bg-[#0050C8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    Generate Report
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <Card className="p-6 border border-[#E5E7EB] shadow-sm h-full flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Report Jobs</h2>
                  <p className="text-sm text-[#5C5B59] mt-1">Track the status of your generated reports</p>
                </div>
                <button
                  onClick={updatePendingJobs}
                  className="p-2 text-[#0F75BD] hover:bg-blue-50 rounded-xl transition-colors"
                  title="Refresh status"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {recentJobs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E5E7EB] rounded-2xl">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">No Recent Reports</h3>
                  <p className="text-sm text-[#5C5B59]">
                    Reports you generate will appear here while they process in the background.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="p-4 border border-[#E5E7EB] rounded-2xl flex items-center justify-between hover:border-[#0F75BD] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${job.status === 'completed' ? 'bg-green-50' :
                          job.status === 'failed' ? 'bg-red-50' : 'bg-blue-50'
                          }`}>
                          {getStatusIcon(job.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1A1A1A] capitalize">{job.report_type.replace(/_/g, " ")} Report</h4>
                          <div className="flex items-center gap-2 text-xs text-[#5C5B59] mt-1">
                            <span className="capitalize text-gray-700 bg-gray-100 px-2 rounded-md font-medium">{job.format}</span>
                            <span>•</span>
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="capitalize">{job.status}</span>
                          </div>
                        </div>
                      </div>

                      {job.status === 'completed' && job.download_url && (
                        <a
                          href={job.download_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 text-[#0F75BD] hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
