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
                    text: 'text-[#1A1A1A]',
                    icon: CheckCircle2,
                    neon: 'bg-emerald-500',
                };
            case 'occupied':
                return {
                    label: 'Occupied',
                    text: 'text-[#1A1A1A]',
                    icon: Clock,
                    neon: 'bg-rose-500',
                };
            case 'maintenance':
                return {
                    label: 'Maintenance',
                    text: 'text-[#1A1A1A]',
                    icon: Hammer,
                    neon: 'bg-amber-500',
                };
            case 'out_of_order':
                return {
                    label: 'Out of Order',
                    text: 'text-[#1A1A1A]',
                    icon: Ban,
                    neon: 'bg-slate-400',
                };
            default:
                return {
                    label: status,
                    text: 'text-[#1A1A1A]',
                    icon: AlertCircle,
                    neon: 'bg-gray-400',
                };
        }
    };

    const getHousekeepingConfig = (status: HousekeepingStatus) => {
        switch (status) {
            case 'clean':
                return { label: 'Clean', color: 'text-[#1A1A1A]', icon: Sparkles };
            case 'dirty':
                return { label: 'Dirty', color: 'text-[#1A1A1A]', icon: Droplets };
            default:
                return { label: status.replace('_', ' '), color: 'text-[#1A1A1A]', icon: Clock };
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
            onClick={() => onEdit?.(unit)}
            className="group relative bg-white rounded-[32px] border border-[#E5E7EB] hover:border-[#0F75BD] transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
        >

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

                    <div className="p-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl group-hover:bg-[#0F75BD] group-hover:text-white transition-colors duration-500">
                        <Key className="w-6 h-6" />
                    </div>
                </div>

                {/* Bento Grid: Status & Housekeeping pills */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Status Pill */}
                    <div className="flex flex-col p-4 rounded-3xl border border-[#E5E7EB] bg-[#FAFAFB] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <StatusIcon className="w-8 h-8" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#5C5B59] mb-3 opacity-50">Room Status</span>
                        <div className="flex items-center gap-2">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.neon} opacity-40`}></span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.neon} border-2 border-white`}></span>
                            </div>
                            <span className={`text-[12px] font-black uppercase tracking-wider ${config.text}`}>
                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* Housekeeping Pill */}
                    <div className="flex flex-col p-4 rounded-3xl border border-[#E5E7EB] bg-[#FAFAFB] relative overflow-hidden">
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
                        className="group/manage flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#0F75BD] rounded-2xl text-white transition-all duration-300"
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
