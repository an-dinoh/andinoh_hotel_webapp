import { useState } from "react";
import { X, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";
import { CreateSupportTicketRequest } from "@/types/hotel.types";

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SupportTicketModal({ isOpen, onClose, onSuccess }: SupportTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateSupportTicketRequest>({
    subject: "",
    category: "technical",
    message: "",
    priority: "medium",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    try {
      setLoading(true);
      await hotelService.createSupportTicket(form);
      toast.success("Support ticket submitted successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A]">Submit Support Ticket</h2>
            <p className="text-gray-500 text-xs mt-1">Our team will respond to your issue shortly.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shrink-0 border border-transparent hover:border-gray-200 cursor-pointer">
            <X className="w-4 h-4 text-[#5C5B59]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject *</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] placeholder:text-gray-400"
                placeholder="Brief summary of your issue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="account">Account Management</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                <div className="relative">
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10"
                  >
                    <option value="low">Low - Minor issue</option>
                    <option value="medium">Medium - Normal request</option>
                    <option value="high">High - Important function broken</option>
                    <option value="urgent">Urgent - System down/Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A1A] bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] resize-none placeholder:text-gray-400"
                placeholder="Please describe your issue in detail so we can help you better..."
              />
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
              <AlertCircle className="w-4 h-4 text-[#0F75BD] shrink-0 mt-0.5" />
              <div className="text-xs text-[#0C5A91] leading-relaxed">
                <p className="font-bold mb-0.5 text-[#0F75BD]">Response Times</p>
                <p className="text-gray-500 font-medium">Urgent tickets are processed within 1 hour. Normal priority tickets usually receive a response within 24 hours.</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-[0.5] py-3 border border-gray-200 text-gray-700 font-bold text-sm rounded-2xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#0F75BD] text-white font-bold text-sm rounded-2xl hover:bg-[#0050C8] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><MessageSquare className="w-4 h-4" /> Submit Ticket</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
