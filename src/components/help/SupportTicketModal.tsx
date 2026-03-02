import { useState } from "react";
import { X, Mail, MessageSquare, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A]">Submit Support Ticket</h2>
                        <p className="text-[#5C5B59] text-sm mt-1">Our team will respond to your issue shortly.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shrink-0 shadow-sm border border-transparent hover:border-gray-200">
                        <X className="w-5 h-5 text-[#5C5B59]" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Subject *</label>
                            <input
                                type="text"
                                required
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                placeholder="Brief summary of your issue"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] appearance-none bg-white"
                                >
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing & Payments</option>
                                    <option value="account">Account Management</option>
                                    <option value="feature_request">Feature Request</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Priority</label>
                                <select
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] appearance-none bg-white"
                                >
                                    <option value="low">Low - Minor issue</option>
                                    <option value="medium">Medium - Normal request</option>
                                    <option value="high">High - Important function broken</option>
                                    <option value="urgent">Urgent - System down/Critical</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Description *</label>
                            <textarea
                                required
                                rows={5}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] resize-none"
                                placeholder="Please describe your issue in detail so we can help you better..."
                            />
                        </div>

                        <div className="bg-[#F0F9FF] p-4 rounded-xl flex items-start gap-3 border border-[#E0F2FE]">
                            <AlertCircle className="w-5 h-5 text-[#0F75BD] shrink-0 mt-0.5" />
                            <div className="text-sm text-[#0C5A91]">
                                <p className="font-semibold mb-1">Response Times</p>
                                <p>Urgent tickets are processed within 1 hour. Normal priority tickets usually receive a response within 24 hours.</p>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-[0.5] px-4 py-3 border border-[#D3D9DD] rounded-xl text-[#1A1A1A] font-medium hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-[#0F75BD] text-white rounded-xl font-medium hover:bg-[#0050C8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                ) : (
                                    <><MessageSquare className="w-5 h-5" /> Submit Ticket</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
