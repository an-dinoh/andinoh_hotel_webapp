import { useState } from "react";
import { X, Calendar, Clock, Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { EventSpace } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";

interface EventBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    space: EventSpace;
    onSuccess: () => void;
}

export default function EventBookingModal({ isOpen, onClose, space, onSuccess }: EventBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<"unchecked" | "available" | "conflict">("unchecked");
    const [conflicts, setConflicts] = useState<any[]>([]);

    const [form, setForm] = useState({
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        event_date: "",
        start_time: "",
        end_time: "",
        attendees: "",
        setup_style: "Banquet",
        special_requests: "",
    });

    const checkAvailability = async (date: string) => {
        if (!date) return;
        try {
            setCheckingAvailability(true);
            setAvailabilityStatus("unchecked");
            const res = await hotelService.checkEventSpaceAvailability(space.id, date);

            // Assume res.is_available or res.conflicts exists based on standard API 
            if (res && res.conflicts && res.conflicts.length > 0) {
                setAvailabilityStatus("conflict");
                setConflicts(res.conflicts);
            } else {
                setAvailabilityStatus("available");
                setConflicts([]);
            }
        } catch (error) {
            console.error("Failed to check availability", error);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setForm({ ...form, event_date: newDate });
        if (newDate) {
            checkAvailability(newDate);
        } else {
            setAvailabilityStatus("unchecked");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (availabilityStatus === "conflict") {
            toast.error("Cannot book due to scheduling conflicts");
            return;
        }

        try {
            setLoading(true);
            await hotelService.createEventBooking({
                event_space_id: space.id,
                ...form,
                attendees: parseInt(form.attendees) || 0,
            });
            toast.success("Event space booked successfully");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to book event space");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A]">Book Event Space</h2>
                        <p className="text-[#5C5B59] text-sm mt-1">Reserve {space.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shrink-0 shadow-sm border border-transparent hover:border-gray-200">
                        <X className="w-5 h-5 text-[#5C5B59]" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Guest Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.guest_name}
                                    onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={form.guest_email}
                                    onChange={(e) => setForm({ ...form, guest_email: e.target.value })}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                    placeholder="e.g. john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={form.guest_phone}
                                    onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                    placeholder="e.g. +1234567890"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex justify-between">
                                    <span>Number of Attendees *</span>
                                    <span className="text-xs text-gray-500 font-normal">Max: {space.max_capacity_banquet}</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Users className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max={space.max_capacity_banquet}
                                        value={form.attendees}
                                        onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                                        className="w-full border border-[#D3D9DD] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                        placeholder="e.g. 100"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#E5E7EB] pt-6">
                            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Event Schedule</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Event Date *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            required
                                            value={form.event_date}
                                            onChange={handleDateChange}
                                            className="w-full border border-[#D3D9DD] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                        />
                                    </div>

                                    {/* Availability Indicator */}
                                    {checkingAvailability && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Checking availability...
                                        </div>
                                    )}
                                    {availabilityStatus === "available" && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Space is available on this date
                                        </div>
                                    )}
                                    {availabilityStatus === "conflict" && (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Scheduling Conflicts Detected
                                            </div>
                                            <ul className="text-xs text-red-700 space-y-1 list-disc pl-5">
                                                {conflicts.map((c, i) => (
                                                    <li key={i}>{c.time || "Time unavailable"} - {c.description || "Booked"}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Start Time *</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="time"
                                                required
                                                value={form.start_time}
                                                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                                className="w-full border border-[#D3D9DD] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">End Time *</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="time"
                                                required
                                                value={form.end_time}
                                                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                                                className="w-full border border-[#D3D9DD] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#E5E7EB] pt-6 grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Setup Style</label>
                                <select
                                    value={form.setup_style}
                                    onChange={(e) => setForm({ ...form, setup_style: e.target.value })}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] appearance-none"
                                >
                                    <option value="Banquet">Banquet Style</option>
                                    <option value="Theater">Theater Style</option>
                                    <option value="Cocktail">Cocktail / Reception</option>
                                    <option value="Boardroom">Boardroom</option>
                                    <option value="Classroom">Classroom</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Special Requests or Notes</label>
                                <textarea
                                    value={form.special_requests}
                                    onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                                    rows={3}
                                    className="w-full border border-[#D3D9DD] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD] resize-none"
                                    placeholder="Any A/V requirements, catering notes, etc."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
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
                                disabled={loading || availabilityStatus === "conflict"}
                                className="flex-1 px-4 py-3 bg-[#0F75BD] text-white rounded-xl font-medium hover:bg-[#0050C8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                ) : (
                                    <><CheckCircle2 className="w-5 h-5" /> Confirm Booking</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
