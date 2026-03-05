"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Plus,
    Loader2,
    CheckCircle,
    AlertCircle,
    Key,
    Building2,
    Layers,
    Info,
    ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hotelService } from "@/services/hotel.service";
import { Room, RoomStatus, HousekeepingStatus } from "@/types/hotel.types";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AddUnitPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Room[]>([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);

    const [formData, setFormData] = useState({
        room_number: "",
        room_type_id: "",
        floor: "1",
        building: "",
        status: "available" as RoomStatus,
        housekeeping_status: "clean" as HousekeepingStatus,
        notes: ""
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await hotelService.getRooms();
                setCategories(response.results || []);
                if (response.results?.length > 0) {
                    setFormData(prev => ({ ...prev, room_type_id: response.results[0].id }));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load room categories");
            } finally {
                setIsFetchingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.room_number || !formData.room_type_id) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        try {
            await hotelService.createPhysicalRoom(formData.room_type_id, {
                room_number: formData.room_number,
                floor: formData.floor,
                building: formData.building,
                status: formData.status,
                housekeeping_status: formData.housekeeping_status,
                notes: formData.notes
            });
            toast.success(`Room ${formData.room_number} created successfully!`);
            router.push("/rooms");
        } catch (error: any) {
            console.error("Error creating physical room:", error);
            const errorMsg = error.response?.data?.message || "Failed to create room unit";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper for category preview
    const selectedCategoryData = categories.find(c => c.id === formData.room_type_id);

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-[#F3F4F6] rounded-xl transition-colors text-[#5C5B59]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-[#1A1A1A]">Add New Room Unit</h1>
                            <p className="text-xs font-bold text-[#5C5B59] uppercase tracking-widest mt-0.5">Physical Inventory Provisioning</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF0F2] rounded-xl border border-[#E5E7EB]">
                        <Key className="w-3.5 h-3.5 text-[#0F75BD]" />
                        <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">Operational Unit</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-sm"
                        >
                            <div className="space-y-8">
                                {/* Section: Basic Identity */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-5 bg-[#0F75BD] rounded-full" />
                                        <h2 className="text-lg font-bold text-[#1A1A1A]">Room Identity</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Room Number"
                                            placeholder="e.g. 101, 205-A"
                                            value={formData.room_number}
                                            onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                                            required
                                            icon={<Key className="w-4 h-4" />}
                                        />

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                                                Category Template *
                                                <Info className="w-3.5 h-3.5 text-[#5C5B59] opacity-40" />
                                            </label>
                                            <select
                                                value={formData.room_type_id}
                                                onChange={(e) => setFormData(prev => ({ ...prev, room_type_id: e.target.value }))}
                                                className="w-full px-4 py-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0F75BD]/20 focus:border-[#0F75BD] transition-all disabled:opacity-50 appearance-none bg-no-repeat bg-[right_1rem_center]"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235C5B59' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundSize: '1.25rem' }}
                                                disabled={isFetchingCategories}
                                                required
                                            >
                                                {isFetchingCategories ? (
                                                    <option>Loading categories...</option>
                                                ) : categories.length === 0 ? (
                                                    <option>No categories available</option>
                                                ) : (
                                                    categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.title} ({cat.room_type.toUpperCase()})
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Section: Location */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-5 bg-[#0F75BD] rounded-full" />
                                        <h2 className="text-lg font-bold text-[#1A1A1A]">Location Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Floor Number"
                                            placeholder="e.g. 1"
                                            value={formData.floor}
                                            onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                                            icon={<Layers className="w-4 h-4" />}
                                        />
                                        <InputField
                                            label="Building Name / Wing"
                                            placeholder="e.g. East Wing"
                                            value={formData.building}
                                            onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                                            icon={<Building2 className="w-4 h-4" />}
                                        />
                                    </div>
                                </section>

                                {/* Section: Initial Status */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-5 bg-[#0F75BD] rounded-full" />
                                        <h2 className="text-lg font-bold text-[#1A1A1A]">Initial Status</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-[#1A1A1A]">Operating Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as RoomStatus }))}
                                                className="w-full px-4 py-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1A1A1A]"
                                            >
                                                <option value="available">Available</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="out_of_order">Out of Order</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-[#1A1A1A]">Housekeeping</label>
                                            <select
                                                value={formData.housekeeping_status}
                                                onChange={(e) => setFormData(prev => ({ ...prev, housekeeping_status: e.target.value as HousekeepingStatus }))}
                                                className="w-full px-4 py-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1A1A1A]"
                                            >
                                                <option value="clean">Clean</option>
                                                <option value="dirty">Dirty</option>
                                                <option value="inspecting">Inspecting</option>
                                                <option value="cleaning_in_progress">Cleaning in Progress</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Section: Notes */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-5 bg-[#0F75BD] rounded-full" />
                                        <h2 className="text-lg font-bold text-[#1A1A1A]">Notes & Particulars</h2>
                                    </div>
                                    <textarea
                                        placeholder="Add any specific details about this unit (e.g. extra large balcony, near elevator)..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full px-4 py-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1A1A1A] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#0F75BD]/20 focus:border-[#0F75BD] transition-all"
                                    />
                                </section>
                            </div>

                            <div className="mt-10 pt-8 border-t border-[#F3F4F6] flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 text-sm font-bold text-[#5C5B59] hover:text-[#1A1A1A] transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    loading={isLoading}
                                    className="px-8 py-3 bg-[#0F75BD] text-white font-bold rounded-2xl hover:bg-[#002968] shadow-sm shadow-[#0F75BD]/20"
                                >
                                    Add Room Unit
                                </Button>
                            </div>
                        </motion.form>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-6">
                        <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white">
                            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-[#0F75BD]" />
                                Operational Setup
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs font-bold text-[#0F75BD] uppercase tracking-wider mb-1">Hierarchy Reminder</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        A <b>Category Template</b> defines the price and marketing specs. A <b>Unit</b> is the physical room guests actually check into.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#0F75BD] flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                                        <p className="text-xs text-gray-400">Specify the unique room number or identifier.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#0F75BD] flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                                        <p className="text-xs text-gray-400">Link it to a pre-defined category template.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#0F75BD] flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                                        <p className="text-xs text-gray-400">Set its current operational and cleaning status.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedCategoryData && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#0F75BD]/5 border border-[#0F75BD]/10 rounded-[32px] p-8"
                            >
                                <h3 className="text-sm font-black text-[#0F75BD] uppercase tracking-widest mb-4">Category Preview</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#5C5B59] uppercase tracking-tighter">Title</span>
                                        <span className="text-lg font-black text-[#1A1A1A]">{selectedCategoryData.title}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#5C5B59] uppercase tracking-tighter">Base Rate</span>
                                        <span className="text-xl font-black text-[#1A1A1A]">₦{parseFloat(selectedCategoryData.base_price).toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
