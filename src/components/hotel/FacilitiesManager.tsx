import { useState, useEffect } from "react";
import { Plus, Wifi, Car, Coffee, Waves, Activity, Baby, Sparkles, Briefcase, HelpCircle, X, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Loading from "@/components/ui/Loading";
import { hotelService } from "@/services/hotel.service";
import { Facility, FacilityCategory } from "@/types/hotel.types";

const categoryIcons: Record<FacilityCategory, React.ElementType> = {
    popular: Sparkles,
    internet: Wifi,
    parking: Car,
    food: Coffee,
    pool: Waves,
    wellness: Activity,
    family: Baby,
    cleaning: Sparkles,
    business: Briefcase,
    other: HelpCircle,
};

export default function FacilitiesManager() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // New facility form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<FacilityCategory>("popular");

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const data = await hotelService.getFacilities();
            setFacilities(data);
        } catch (error: any) {
            console.error("Error fetching facilities:", error);
            toast.error(error.message || "Failed to load facilities");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFacility = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error("Facility name is required");
            return;
        }

        try {
            setSaving(true);
            const newFacility = await hotelService.createFacility({
                name,
                description,
                category,
                is_active: true,
            });

            setFacilities([...facilities, newFacility]);
            toast.success("Facility added successfully");
            setIsModalOpen(false);
            setName("");
            setDescription("");
            setCategory("popular");
        } catch (error: any) {
            console.error("Error creating facility:", error);
            toast.error(error.message || "Failed to add facility");
        } finally {
            setSaving(false);
        }
    };

    // Group facilities by category
    const groupedFacilities = facilities.reduce((acc, facility) => {
        if (!acc[facility.category]) acc[facility.category] = [];
        acc[facility.category].push(facility);
        return acc;
    }, {} as Record<string, Facility[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loading size="md" text="Loading facilities..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Facilities & Amenities</h2>
                    <p className="text-gray-500 mt-1">Manage global amenities available at your property.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Facility
                </button>
            </div>

            {facilities.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No facilities added yet</p>
                    <p>Add the amenities available at your property to show them to guests.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedFacilities).map(([cat, catsFacilities]) => {
                        const Icon = categoryIcons[cat as FacilityCategory] || HelpCircle;
                        return (
                            <div key={cat} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 capitalize border-b border-gray-100 pb-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {cat.replace("_", " ")}
                                </h3>
                                <ul className="space-y-4">
                                    {catsFacilities.map((fac) => (
                                        <li key={fac.id} className="flex justify-between items-start group">
                                            <div>
                                                <p className="font-medium text-gray-900">{fac.name}</p>
                                                {fac.description && <p className="text-sm text-gray-500">{fac.description}</p>}
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${fac.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {fac.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Facility Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Facility</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFacility} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Free High-Speed WiFi"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as FacilityCategory)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
                                >
                                    {Object.keys(categoryIcons).map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description of the facility..."
                                />
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
                                    disabled={saving || !name}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                                >
                                    {saving ? "Adding..." : "Add Facility"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
