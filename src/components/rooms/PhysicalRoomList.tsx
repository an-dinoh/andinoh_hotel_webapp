import { useState, useEffect } from "react";
import { Key, Edit, Save, CheckSquare, Square, Plus, X, Loader2 } from "lucide-react";
import { RoomStatus, HousekeepingStatus, PhysicalRoom } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import toast from "react-hot-toast";

export default function PhysicalRoomList({ roomId }: { roomId: string }) {
    const [units, setUnits] = useState<PhysicalRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkStatus, setBulkStatus] = useState<RoomStatus | "">("");
    const [bulkHousekeeping, setBulkHousekeeping] = useState<HousekeepingStatus | "">("");
    const [isUpdating, setIsUpdating] = useState(false);

    // New Unit state
    const [isAdding, setIsAdding] = useState(false);
    const [newRoomNumber, setNewRoomNumber] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                setLoading(true);
                const data = await hotelService.getPhysicalRooms(roomId);
                setUnits(data.results || []);
            } catch (error) {
                console.error("Error fetching physical rooms:", error);
                toast.error("Failed to load room units");
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchUnits();
        }
    }, [roomId]);

    const handleAddUnit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoomNumber.trim()) {
            toast.error("Please enter a room number");
            return;
        }

        try {
            setIsCreating(true);
            const newUnit = await hotelService.createPhysicalRoom(roomId, {
                room_number: newRoomNumber,
                status: "available",
                housekeeping_status: "clean"
            });

            setUnits(prev => [newUnit, ...prev]);
            setNewRoomNumber("");
            setIsAdding(false);
            toast.success(`Room ${newRoomNumber} added successfully`);
        } catch (error: any) {
            console.error("Error creating physical room:", error);
            toast.error(error.message || "Failed to add room unit");
        } finally {
            setIsCreating(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === units.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(units.map((u) => u.id));
        }
    };

    const handleBulkUpdate = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one room unit");
            return;
        }
        if (!bulkStatus || !bulkHousekeeping) {
            toast.error("Please select both a new status and housekeeping state");
            return;
        }

        try {
            setIsUpdating(true);
            await hotelService.bulkUpdatePhysicalRooms({
                room_ids: selectedIds,
                status: bulkStatus as RoomStatus,
                housekeeping_status: bulkHousekeeping as HousekeepingStatus,
            });

            // Update local state to reflect changes
            setUnits((prev) =>
                prev.map((unit) =>
                    selectedIds.includes(unit.id)
                        ? { ...unit, status: bulkStatus as RoomStatus, housekeeping_status: bulkHousekeeping as HousekeepingStatus }
                        : unit
                )
            );

            toast.success(`Successfully updated ${selectedIds.length} units`);
            setSelectedIds([]);
            setBulkStatus("");
            setBulkHousekeeping("");
        } catch (error: any) {
            console.error("Error bulk updating rooms:", error);
            toast.error(error.message || "Failed to update physical rooms");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status: RoomStatus) => {
        switch (status) {
            case "available": return "bg-emerald-100 text-emerald-700";
            case "occupied": return "bg-red-100 text-red-700";
            case "maintenance": return "bg-amber-100 text-amber-700";
            case "out_of_order": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getHousekeepingColor = (status: HousekeepingStatus) => {
        switch (status) {
            case "clean": return "bg-blue-100 text-blue-700";
            case "dirty": return "bg-orange-100 text-orange-700";
            case "inspecting": return "bg-purple-100 text-purple-700";
            case "cleaning_in_progress": return "bg-sky-100 text-sky-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Physical Rooms (Units)</h3>
                    <p className="text-sm text-gray-500">Manage individual room statuses and housekeeping</p>
                </div>
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0F75BD] text-white text-sm font-medium rounded-xl hover:bg-[#0050C8] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Room Unit
                    </button>
                ) : (
                    <button
                        onClick={() => setIsAdding(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                )}
            </div>

            {/* Add Unit Form */}
            {isAdding && (
                <form
                    onSubmit={handleAddUnit}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-6 transition-all animate-in fade-in slide-in-from-top-2"
                >
                    <div className="flex flex-col sm:flex-row items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-blue-800 uppercase tracking-wider ml-1">
                                Room Number / Name
                            </label>
                            <input
                                type="text"
                                value={newRoomNumber}
                                onChange={(e) => setNewRoomNumber(e.target.value)}
                                placeholder="e.g. 101, Suite A, Deluxe-1"
                                autoFocus
                                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isCreating || !newRoomNumber.trim()}
                            className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add Room Unit
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-blue-800 font-medium">
                        <span className="bg-blue-600 text-white min-w-[1.5rem] h-6 flex items-center justify-center rounded-full text-xs">
                            {selectedIds.length}
                        </span>
                        units selected
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value as RoomStatus)}
                            className="px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
                        >
                            <option value="">Set Status...</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="out_of_order">Out of Order</option>
                        </select>

                        <select
                            value={bulkHousekeeping}
                            onChange={(e) => setBulkHousekeeping(e.target.value as HousekeepingStatus)}
                            className="px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
                        >
                            <option value="">Set Housekeeping...</option>
                            <option value="clean">Clean</option>
                            <option value="dirty">Dirty</option>
                            <option value="inspecting">Inspecting</option>
                            <option value="cleaning_in_progress">Cleaning in Progress</option>
                        </select>

                        <button
                            onClick={handleBulkUpdate}
                            disabled={isUpdating || !bulkStatus || !bulkHousekeeping}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Applying..." : "Apply"}
                        </button>
                    </div>
                </div>
            )}

            {/* Units Table */}
            <div className="bg-white border border-[#D3D9DD] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FAFB] border-b border-[#D3D9DD] text-sm text-gray-600">
                                <th className="p-4 w-12">
                                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-blue-600">
                                        {selectedIds.length === units.length ? (
                                            <CheckSquare className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <Square className="w-5 h-5" />
                                        )}
                                    </button>
                                </th>
                                <th className="p-4 font-semibold">Room Number</th>
                                <th className="p-4 font-semibold">Current Status</th>
                                <th className="p-4 font-semibold">Housekeeping</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-medium">Loading units...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : units.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Key className="w-8 h-8 " />
                                            <p className="text-sm">No physical room units found for this type.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                units.map((unit) => (
                                    <tr
                                        key={unit.id}
                                        className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${selectedIds.includes(unit.id) ? "bg-blue-50/50" : ""
                                            }`}
                                    >
                                        <td className="p-4">
                                            <button onClick={() => toggleSelect(unit.id)} className="text-gray-400 hover:text-blue-600">
                                                {selectedIds.includes(unit.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Key className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold text-gray-900">{unit.room_number}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(unit.status)}`}>
                                                {unit.status?.replace(/_/g, " ") || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getHousekeepingColor(unit.housekeeping_status)}`}>
                                                {unit.housekeeping_status?.replace(/_/g, " ") || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
