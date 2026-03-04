import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

interface Activity {
    id: string;
    type: 'booking' | 'payment' | 'system' | 'staff';
    title: string;
    timestamp: string;
    description: string;
}

interface RecentActivityProps {
    activities?: Activity[];
    loading?: boolean;
}

export default function RecentActivity({ activities = [], loading = false }: RecentActivityProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Recent Activity</h2>
                </div>
            </div>

            <div className="space-y-6 relative">
                {/* Timeline Line */}
                {!loading && activities.length > 0 && (
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />
                )}

                {loading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 relative">
                            <Skeleton width="40px" height="40px" variant="circle" />
                            <div className="flex-1 space-y-2">
                                <Skeleton width="140px" height="14px" />
                                <Skeleton width="100%" height="32px" />
                            </div>
                        </div>
                    ))
                ) : activities.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-[#5C5B59]">No recent activity logged.</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="flex gap-4 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 ${activity.type === 'booking' ? 'bg-green-100 text-green-600' :
                                activity.type === 'payment' ? 'bg-yellow-100 text-yellow-600' :
                                    activity.type === 'staff' ? 'bg-purple-100 text-purple-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {activity.type === 'booking' ? '📅' : activity.type === 'payment' ? '💰' : activity.type === 'staff' ? '👥' : 'ℹ️'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{activity.title}</p>
                                    <span className="text-[10px] text-gray-400 shrink-0">{activity.timestamp}</span>
                                </div>
                                <p className="text-sm text-[#5C5B59] mt-1 leading-relaxed">{activity.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
