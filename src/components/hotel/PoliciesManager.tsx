import { useState, useEffect } from "react";
import { Plus, ShieldAlert, CreditCard, Dog, Cigarette, Baby, Info, X, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import Loading from "@/components/ui/Loading";
import { hotelService } from "@/services/hotel.service";
import { Policy, PolicyType } from "@/types/hotel.types";

const policyIcons: Record<PolicyType, React.ElementType> = {
    cancellation: ShieldAlert,
    payment: CreditCard,
    pet: Dog,
    smoking: Cigarette,
    child: Baby,
    other: Info,
};

export default function PoliciesManager() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // New policy form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [policyType, setPolicyType] = useState<PolicyType>("cancellation");

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const data = await hotelService.getPolicies();
            setPolicies(data);
        } catch (error: any) {
            console.error("Error fetching policies:", error);
            toast.error(error.message || "Failed to load policies");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            toast.error("Policy title and description are required");
            return;
        }

        try {
            setSaving(true);
            const newPolicy = await hotelService.createPolicy({
                title,
                description,
                policy_type: policyType,
                is_active: true,
            });

            setPolicies([...policies, newPolicy]);
            toast.success("Policy added successfully");
            setIsModalOpen(false);
            setTitle("");
            setDescription("");
            setPolicyType("cancellation");
        } catch (error: any) {
            console.error("Error creating policy:", error);
            toast.error(error.message || "Failed to add policy");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loading size="md" text="Loading global policies..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Global Policies</h2>
                    <p className="text-gray-500 mt-1">Manage rules, requirements, and policies for your hotel.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Policy
                </button>
            </div>

            {policies.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                    <ShieldCheck className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No policies added yet</p>
                    <p>Define important house rules to ensure guests know what to expect.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {policies.map((policy) => {
                        const Icon = policyIcons[policy.policy_type] || Info;
                        return (
                            <div key={policy.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{policy.title}</h3>
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${policy.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {policy.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm capitalize mb-2">{policy.policy_type} Policy</p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{policy.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Policy Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Policy</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePolicy} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type *</label>
                                <select
                                    value={policyType}
                                    onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
                                >
                                    {Object.keys(policyIcons).map((type) => (
                                        <option key={type} value={type}>
                                            {type.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. 24-Hour Cancellation"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Explain the full details of this policy..."
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
                                    disabled={saving || !title || !description}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                                >
                                    {saving ? "Adding..." : "Add Policy"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
