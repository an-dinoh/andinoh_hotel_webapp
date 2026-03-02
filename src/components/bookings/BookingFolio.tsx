import { useState, useEffect } from "react";
import { Plus, Receipt, Coffee, Car, Wifi, Wine, Utensils, AlertCircle, Save, X, Activity } from "lucide-react";
import { BookingFolio as IBookingFolio, IncidentalCharge } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";

export default function BookingFolio({ bookingId }: { bookingId: string }) {
    const [folio, setFolio] = useState<IBookingFolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);

    // Form state
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [chargeType, setChargeType] = useState<string>("room_service");
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        fetchFolio();
    }, [bookingId]);

    const fetchFolio = async () => {
        try {
            setLoading(true);
            const data = await hotelService.getFolio(bookingId);
            setFolio(data);
        } catch (error: any) {
            console.error("Error fetching folio:", error);
            toast.error(error.message || "Failed to load folio");
        } finally {
            setLoading(false);
        }
    };

    const handleAddIncidental = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) {
            toast.error("Description and amount are required");
            return;
        }

        try {
            setAdding(true);
            await hotelService.addIncidental(bookingId, {
                description,
                amount: amount,
                service_type: chargeType,
            });

            toast.success("Incidental charge added");
            setIsModalOpen(false);
            setDescription("");
            setAmount("");
            setChargeType("room_service");
            setIsPaid(false);
            fetchFolio();
        } catch (error: any) {
            console.error("Error adding incidental:", error);
            toast.error(error.message || "Failed to add charge");
        } finally {
            setAdding(false);
        }
    };

    const getChargeIcon = (type: string) => {
        switch (type) {
            case "room_service": return <Utensils className="w-4 h-4" />;
            case "minibar": return <Wine className="w-4 h-4" />;
            case "laundry": return <Activity className="w-4 h-4" />;
            case "damages": return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <Coffee className="w-4 h-4" />;
        }
    };

    if (loading) {
        return <div className="p-12 flex justify-center"><Loading size="md" text="Loading guest folio..." /></div>;
    }

    if (!folio) {
        return (
            <div className="bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl p-6 flex flex-col items-center justify-center min-h-[50vh]">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">No Folio Found</h3>
                <p className="text-gray-500 text-sm">We couldn't retrieve the folio for this booking.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Guest Folio</h3>
                    <p className="text-sm text-gray-500">Manage room charges, incidentals, and itemized billing</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Charge
                </button>
            </div>

            {folio.incidentals.length === 0 ? (
                <div className="bg-[#F9FAFB] border border-[#D3D9DD] rounded-xl p-12 text-center">
                    <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No incidental charges</p>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        This guest has not accrued any additional charges during their stay.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-[#D3D9DD] rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FAFB] border-b border-[#D3D9DD] text-sm text-gray-600">
                                <th className="p-4 font-semibold text-center w-12"></th>
                                <th className="p-4 font-semibold">Description</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folio.incidentals.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 text-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                                            {getChargeIcon(item.service_type)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900">{item.description}</p>
                                        <p className="text-xs text-gray-500 capitalize">{item.service_type.replace(/_/g, " ")}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(item.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                                    </td>
                                    <td className="p-4 font-semibold text-gray-900">
                                        ₦{parseFloat(item.amount as string).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span
                                            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700"
                                        >
                                            Unpaid
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-[#F9FAFB] border-t border-[#D3D9DD]">
                            <tr>
                                <td colSpan={3} className="p-4 text-right font-semibold text-gray-700">Total Incidentals:</td>
                                <td className="p-4 font-bold text-gray-900 text-lg">
                                    ₦{folio.incidentals.reduce((sum, item) => sum + parseFloat(item.amount), 0).toLocaleString()}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Add Incidental Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Add Incidental Charge</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddIncidental} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Charge Type *</label>
                                <select
                                    value={chargeType}
                                    onChange={(e) => setChargeType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
                                >
                                    <option value="room_service">Room Service</option>
                                    <option value="minibar">Minibar</option>
                                    <option value="laundry">Laundry</option>
                                    <option value="damages">Damages</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <input
                                    type="text"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. 2x Club Sandwich, 1x Cola"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦) *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₦</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="8500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isPaid"
                                    checked={isPaid}
                                    onChange={(e) => setIsPaid(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Guest paid immediately (e.g. cash point of sale)
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding || !description || !amount}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {adding ? "Saving..." : "Apply Charge"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
