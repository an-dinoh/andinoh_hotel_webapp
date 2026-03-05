"use client";

import React from 'react';
import { Key, PenTool as Tool, CheckCircle2, AlertCircle, Clock, LayoutGrid, Sparkles, Droplets, Hammer, Ban, ChevronRight } from 'lucide-react';
import { PhysicalRoom, RoomStatus, HousekeepingStatus, Room } from '@/types/hotel.types';
import { motion, AnimatePresence } from 'framer-motion';

interface PhysicalRoomCardProps {
    unit: PhysicalRoom;
    category?: Room;
    onEdit?: (unit: PhysicalRoom) => void;
    onStatusChange?: (unit: PhysicalRoom, status: RoomStatus) => void;
}

export default function PhysicalRoomCard({ unit, category, onEdit, onStatusChange }: PhysicalRoomCardProps) {
    const getStatusConfig = (status: RoomStatus) => {
        switch (status) {
            case 'available':
                return {
                    label: 'Available',
                    bg: 'bg-emerald-50/50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-100',
                    icon: CheckCircle2,
                    neon: 'bg-emerald-500',
                    shadow: 'shadow-emerald-200/50'
                };
            case 'occupied':
                return {
                    label: 'Occupied',
                    bg: 'bg-rose-50/50',
                    text: 'text-rose-700',
                    border: 'border-rose-100',
                    icon: Clock,
                    neon: 'bg-rose-500',
                    shadow: 'shadow-rose-200/50'
                };
            case 'maintenance':
                return {
                    label: 'Maintenance',
                    bg: 'bg-amber-50/50',
                    text: 'text-amber-700',
                    border: 'border-amber-100',
                    icon: Hammer,
                    neon: 'bg-amber-500',
                    shadow: 'shadow-amber-200/50'
                };
            case 'out_of_order':
                return {
                    label: 'Out of Order',
                    bg: 'bg-slate-50/50',
                    text: 'text-slate-700',
                    border: 'border-slate-100',
                    icon: Ban,
                    neon: 'bg-slate-500',
                    shadow: 'shadow-slate-200/50'
                };
            default:
                return {
                    label: status,
                    bg: 'bg-gray-50',
                    text: 'text-gray-600',
                    border: 'border-gray-100',
                    icon: AlertCircle,
                    neon: 'bg-gray-400',
                    shadow: 'shadow-gray-200/50'
                };
        }
    };

    const getHousekeepingConfig = (status: HousekeepingStatus) => {
        switch (status) {
            case 'clean':
                return { label: 'Clean', color: 'text-emerald-600', icon: Sparkles, bg: 'bg-emerald-50/30' };
            case 'dirty':
                return { label: 'Dirty', color: 'text-rose-600', icon: Droplets, bg: 'bg-rose-50/30' };
            default:
                return { label: status.replace('_', ' '), color: 'text-blue-600', icon: Clock, bg: 'bg-blue-50/30' };
        }
    };

    const config = getStatusConfig(unit.status);
    const hkConfig = getHousekeepingConfig(unit.housekeeping_status);
    const StatusIcon = config.icon;
    const HKIcon = hkConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
            className="group relative bg-white rounded-[32px] border border-[#E5E7EB]/60 hover:border-[#0F75BD] transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(15,117,189,0.12)] flex flex-col h-full"
        >
            {/* Glossy Backdrop Gradient */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0F75BD]/[0.02] to-transparent pointer-events-none" />

            <div className="p-8 relative z-10 flex flex-col h-full">
                {/* Header: Room ID + Category Tag */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <motion.h3
                            className="text-4xl font-black text-[#1A1A1A] tracking-tighter leading-none"
                        >
                            {unit.room_number.padStart(2, '0')}
                        </motion.h3>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0F75BD]/60" />
                            <p className="text-[10px] font-black text-[#5C5B59] uppercase tracking-[0.2em] opacity-60">
                                {category?.title || 'Unassigned Category'}
                            </p>
                        </div>
                    </div>

                    <div className="p-3 bg-white border border-[#E5E7EB]/50 rounded-2xl shadow-sm group-hover:bg-[#0F75BD] group-hover:text-white transition-colors duration-500">
                        <Key className="w-6 h-6" />
                    </div>
                </div>

                {/* Bento Grid: Status & Housekeeping pills */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Status Pill */}
                    <div className={`flex flex-col p-4 rounded-3xl border ${config.border} ${config.bg} relative overflow-hidden group/pill`}>
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <StatusIcon className="w-8 h-8" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#5C5B59] mb-3 opacity-50">Room Status</span>
                        <div className="flex items-center gap-2">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.neon} opacity-40`}></span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.neon} ${config.shadow} border-2 border-white`}></span>
                            </div>
                            <span className={`text-[12px] font-black uppercase tracking-wider ${config.text}`}>
                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* Housekeeping Pill */}
                    <div className={`flex flex-col p-4 rounded-3xl border border-[#F3F4F6] ${hkConfig.bg} relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <HKIcon className="w-8 h-8" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#5C5B59] mb-3 opacity-50">Housekeeping</span>
                        <div className="flex items-center gap-2">
                            <HKIcon className={`w-3.5 h-3.5 ${hkConfig.color}`} />
                            <span className={`text-[12px] font-black uppercase tracking-wider ${hkConfig.color}`}>
                                {hkConfig.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Floor metadata & "Manage" glass button */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#F3F4F6]">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-[#5C5B59] uppercase tracking-widest opacity-40 mb-1">Location</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#FAFAFB] border border-[#E5E7EB]/40 rounded-full">
                            <LayoutGrid className="w-3 h-3 text-[#0F75BD]" />
                            <span className="text-[10px] font-black text-[#1A1A1A] tracking-wider uppercase">
                                Floor {unit.floor || '01'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onEdit?.(unit)}
                        className="group/manage flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#0F75BD] rounded-2xl text-white transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-[#0F75BD]/20"
                    >
                        <span className="text-[11px] font-black uppercase tracking-wider">Manage</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/manage:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Bottom Vivid Accent Line */}
            <div className={`h-1.5 w-full ${config.neon} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
        </motion.div>
    );
}
