import { useState, useEffect, useCallback } from "react";
import { X, Activity, Clock, ShieldAlert, FileText, UserCircle, Plus } from "lucide-react";
import { StaffActivity } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import Loading from "@/components/ui/Loading";
import { toast } from "react-hot-toast";

interface StaffActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffId: string;
    staffName: string;
}

export default function StaffActivityModal({ isOpen, onClose, staffId, staffName }: StaffActivityModalProps) {
    const [activities, setActivities] = useState<StaffActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = useCallback(async () => {
        try {
            setLoading(true);
            const data = await hotelService.getStaffActivity(staffId);
            setActivities(data);
        } catch (error: any) {
            console.error("Failed to fetch staff activity:", error);
            toast.error(error.message || "Failed to load staff activity log");
        } finally {
            setLoading(false);
        }
    }, [staffId]);

    useEffect(() => {
        if (isOpen && staffId) {
            fetchActivity();
        }
    }, [isOpen, staffId, fetchActivity]);

    const getActionIcon = (action: string) => {
        switch (action?.toLowerCase()) {
            case "login":
            case "logout":
                return <UserCircle className="w-5 h-5 text-blue-500" />;
            case "create":
            case "add":
                return <Plus className="w-5 h-5 text-green-500" />;
            case "update":
            case "edit":
                return <FileText className="w-5 h-5 text-orange-500" />;
            case "delete":
            case "remove":
                return <ShieldAlert className="w-5 h-5 text-red-500" />;
            default:
                return <Activity className="w-5 h-5 text-gray-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[#E5E7EB] flex items-start justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Activity Audit</h2>
                            <p className="text-sm text-gray-500">Activity log for {staffName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <Loading size="md" text="Loading activity history..." />
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No Activity Found</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1">
                                There is no recorded activity for this staff member yet.
                            </p>
                        </div>
                    ) : (
                        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {activities.map((activity, index) => (
                                <div key={activity.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        {getActionIcon(activity.action)}
                                    </div>

                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-gray-900 capitalize px-2.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
                                                {activity.action}
                                            </span>
                                            <time className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(activity.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </time>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                            {activity.description}
                                        </p>
                                        {activity.ip_address && (
                                            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-50">
                                                IP: {activity.ip_address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
