"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Key,
    Building2,
    Layers,
    CheckCircle2,
    AlertCircle,
    Wrench,
    Clock,
    Trash2,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PhysicalRoom, RoomStatus, HousekeepingStatus, Room } from "@/types/hotel.types";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface UnitActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: PhysicalRoom | null;
    category?: Room;
    onUpdate: (id: string, data: Partial<PhysicalRoom>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function UnitActionModal({ isOpen, onClose, unit, category, onUpdate, onDelete }: UnitActionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        room_number: "",
        floor: "",
        building: "",
        status: "available" as RoomStatus,
        housekeeping_status: "clean" as HousekeepingStatus,
        notes: ""
    });

    useEffect(() => {
        if (unit) {
            setFormData({
                room_number: unit.room_number,
                floor: unit.floor || "",
                building: unit.building || "",
                status: unit.status,
                housekeeping_status: unit.housekeeping_status,
                notes: unit.notes || ""
            });
        }
    }, [unit]);

    if (!unit) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onUpdate(unit.id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to update unit:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!unit) return;
        if (window.confirm(`Are you sure you want to delete Room ${unit.room_number}?`)) {
            setIsLoading(true);
            try {
                await onDelete(unit.id);
                onClose();
            } catch (error) {
                console.error("Failed to delete unit:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const statusOptions: { value: RoomStatus; label: string; icon: any; color: string }[] = [
        { value: "available", label: "Available", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
        { value: "occupied", label: "Occupied", icon: Clock, color: "text-rose-600 bg-rose-50 border-rose-100" },
        { value: "maintenance", label: "Maintenance", icon: Wrench, color: "text-amber-600 bg-amber-50 border-amber-100" },
        { value: "out_of_order", label: "Out of Order", icon: AlertCircle, color: "text-gray-600 bg-gray-50 border-gray-100" },
    ];

    const housekeepingOptions: { value: HousekeepingStatus; label: string }[] = [
        { value: "clean", label: "Clean" },
        { value: "dirty", label: "Dirty" },
        { value: "inspecting", label: "Inspecting" },
        { value: "cleaning_in_progress", label: "Cleaning" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[32px] shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-[#F3F4F6] flex items-center justify-between bg-white sticky top-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#0F75BD]/10 rounded-2xl text-[#0F75BD]">
                                    <Key className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#1A1A1A]">Manage Room {unit.room_number}</h2>
                                    <p className="text-xs font-bold text-[#5C5B59] uppercase tracking-widest mt-0.5">{category?.title || 'Operational Unit'}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#F3F4F6] rounded-xl transition-colors text-[#5C5B59]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-8">
                                {/* Status Toggle */}
                                <div>
                                    <label className="text-sm font-bold text-[#1A1A1A] mb-4 block">Room Operating Status</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {statusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${formData.status === opt.value
                                                    ? `${opt.color} ring-2 ring-offset-2 ring-[#0F75BD]/20`
                                                    : "bg-white border-[#E5E7EB] text-[#5C5B59] hover:border-[#0F75BD]"
                                                    }`}
                                            >
                                                <opt.icon className="w-4 h-4" />
                                                <span className="text-sm font-bold">{opt.label}</span>
                                                {formData.status === opt.value && <Check className="w-4 h-4 ml-auto" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <InputField
                                        label="Room Number"
                                        value={formData.room_number}
                                        onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                                        icon={<Key className="w-4 h-4" />}
                                        required
                                    />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#1A1A1A]">Housekeeping</label>
                                        <select
                                            value={formData.housekeeping_status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, housekeeping_status: e.target.value as HousekeepingStatus }))}
                                            className="w-full px-4 py-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0F75BD]/20"
                                        >
                                            {housekeepingOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <InputField
                                        label="Floor"
                                        value={formData.floor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                                        icon={<Layers className="w-4 h-4" />}
                                    />
                                    <InputField
                                        label="Building"
                                        value={formData.building}
                                        onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                                        icon={<Building2 className="w-4 h-4" />}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-[#1A1A1A] mb-1.5 block">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Add operational notes for this unit..."
                                        className="w-full px-4 py-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1A1A1A] min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#0F75BD]/20"
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-10 pt-8 border-t border-[#F3F4F6] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 text-rose-600 text-sm font-bold hover:bg-rose-50 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Unit
                                </button>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 text-sm font-bold text-[#5C5B59] hover:text-[#1A1A1A]"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        loading={isLoading}
                                        className="px-8 py-2.5 bg-[#1A1A1A] text-white font-bold rounded-2xl hover:bg-black shadow-lg shadow-black/5"
                                    >
                                        Update Unit
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
