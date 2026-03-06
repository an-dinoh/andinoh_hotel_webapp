"use client";

import React from 'react';
import { Bell, CheckCircle2, Trash2, Clock, Calendar, Shield, User, Building2, ChevronRight, Search, Filter } from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

    const getIconForType = (type: string) => {
        switch (type) {
            case 'booking_update': return Calendar;
            case 'new_chat_message': return User;
            case 'hotel_status_update': return Shield;
            case 'reception_alert': return Bell;
            case 'inventory_updated': return Building2;
            default: return Bell;
        }
    };

    const getStylesForType = (type: string) => {
        switch (type) {
            case 'booking_update': return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" };
            case 'new_chat_message': return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" };
            case 'hotel_status_update': return { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" };
            case 'reception_alert': return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" };
            case 'inventory_updated': return { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" };
            default: return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-100" };
        }
    };

    return (
        <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-12">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#0F75BD]/10 rounded-2xl flex items-center justify-center">
                                <Bell className="w-5 h-5 text-[#0F75BD]" />
                            </div>
                            <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Notifications</h1>
                        </div>
                        <p className="text-[#5C5B59] font-medium">Keep track of all your hotel operations and alerts.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#FAFAFB] border border-[#E5E7EB] hover:border-[#0F75BD] rounded-2xl text-sm font-bold text-[#1A1A1A] transition-all hover:-translate-y-0.5"
                        >
                            <CheckCircle2 className="w-4 h-4 text-[#0F75BD]" />
                            Mark all as read
                        </button>
                        <button
                            onClick={clearNotifications}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] hover:border-rose-200 hover:bg-rose-50 rounded-2xl text-sm font-bold text-rose-600 transition-all hover:-translate-y-0.5"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear all
                        </button>
                    </div>
                </div>

                {/* Filters & Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="col-span-1 md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
                        <input
                            type="text"
                            placeholder="Filter notifications..."
                            className="w-full pl-12 pr-4 py-3.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0F75BD] transition-all"
                        />
                    </div>
                    <div className="flex items-center justify-between px-6 py-3.5 bg-[#F0F9FF] border border-[#0F75BD]/10 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#0F75BD] rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-[#1A1A1A]">Unread Alerts</span>
                        </div>
                        <span className="text-lg font-black text-[#0F75BD]">{unreadCount}</span>
                    </div>
                </div>

                {/* Notifications Feed */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center p-20 bg-[#FAFAFB] border border-[#E5E7EB]/50 rounded-[32px] text-center"
                            >
                                <div className="w-20 h-20 bg-white border border-[#E5E7EB] rounded-3xl flex items-center justify-center mb-6 rotate-6 shadow-sm">
                                    <Bell className="w-10 h-10 text-[#8F8E8D]" />
                                </div>
                                <h3 className="text-xl font-black text-[#1A1A1A] mb-2 tracking-tight">Your feed is empty</h3>
                                <p className="text-[#5C5B59] max-w-xs mx-auto">When important events happen in your hotel, they'll appear here.</p>
                            </motion.div>
                        ) : (
                            notifications.map((notification, index) => {
                                const Icon = getIconForType(notification.type);
                                const styles = getStylesForType(notification.type);
                                return (
                                    <motion.div
                                        layout
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`group relative p-6 bg-white border ${!notification.read ? 'border-[#0F75BD]/30 shadow-[0_10px_30px_rgba(15,117,189,0.04)] bg-gradient-to-r from-[#F0F9FF]/30 to-white' : 'border-[#E5E7EB]/60'} rounded-[28px] hover:border-[#0F75BD] transition-all duration-300 cursor-pointer overflow-hidden`}
                                    >
                                        {!notification.read && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#0F75BD]" />
                                        )}

                                        <div className="flex items-start gap-6">
                                            <div className={`w-14 h-14 ${styles.bg} ${styles.border} border rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`w-6 h-6 ${styles.text}`} />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <h4 className="text-base font-black text-[#1A1A1A] tracking-tight group-hover:text-[#0F75BD] transition-colors">
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#8F8E8D] uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <p className="text-[#5C5B59] text-sm leading-relaxed mb-4">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <div className="px-3 py-1 bg-[#FAFAFB] border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#8F8E8D] uppercase tracking-widest">
                                                        {notification.type.replace('_', ' ')}
                                                    </div>
                                                    <button className="text-[11px] font-black text-[#0F75BD] uppercase tracking-wider hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Manage Action
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="self-center">
                                                <ChevronRight className="w-5 h-5 text-[#E5E7EB] group-hover:text-[#0F75BD] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
