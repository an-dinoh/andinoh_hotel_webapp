import { useState } from "react";
import { DollarSign, Plus, Calendar, Percent, X } from "lucide-react";
import { PricingRule } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import toast from "react-hot-toast";

export default function PricingRulesList({ roomTypeId }: { roomTypeId: string }) {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [ruleType, setRuleType] = useState<"multiplier" | "fixed">("multiplier");
    const [value, setValue] = useState("");

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startDate || !endDate || !value) {
            toast.error("Please fill in all required fields");
            return;
        }

        const priceRulePayload: Partial<PricingRule> = {
            title,
            start_date: startDate,
            end_date: endDate,
        };

        if (ruleType === "multiplier") {
            priceRulePayload.price_multiplier = value;
        } else {
            priceRulePayload.fixed_price = value;
        }

        try {
            setSaving(true);
            const newRule = await hotelService.createPricingRule(roomTypeId, priceRulePayload);

            setRules([newRule, ...rules]);
            toast.success("Pricing rule added successfully");
            setIsModalOpen(false);
            setTitle("");
            setStartDate("");
            setEndDate("");
            setValue("");
        } catch (error: any) {
            console.error("Error creating pricing rule:", error);
            toast.error(error.message || "Failed to add pricing rule");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Dynamic Pricing Rules</h3>
                    <p className="text-sm text-gray-500">Manage seasonal rates, weekend pricing, and special events</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Rule
                </button>
            </div>

            {rules.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No pricing rules</p>
                    <p>Add dynamic pricing for peak seasons, holidays, or weekends.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {rules.map((rule, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">{rule.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {rule.start_date} to {rule.end_date}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                        {rule.price_multiplier ? (
                                            <><Percent className="w-3.5 h-3.5" /> Multiplier: {rule.price_multiplier}x</>
                                        ) : (
                                            <><DollarSign className="w-3.5 h-3.5" /> Fixed: ₦{rule.fixed_price}</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${rule.is_active !== false ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                                {rule.is_active !== false ? "Active" : "Inactive"}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Rule Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Create Pricing Rule</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateRule} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event/Season Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Valentine's Day Peak"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type *</label>
                                    <select
                                        value={ruleType}
                                        onChange={(e) => setRuleType(e.target.value as "multiplier" | "fixed")}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="multiplier">Multiplier (e.g. 1.5x)</option>
                                        <option value="fixed">Fixed Price</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={ruleType === "multiplier" ? "1.5" : "35000"}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                {ruleType === "multiplier"
                                    ? "A multiplier of 1.5 increases the base price by 50%."
                                    : "A fixed price will override the standard base price completely for these dates."}
                            </p>

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
                                    disabled={saving || !title || !value}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Create Rule"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
