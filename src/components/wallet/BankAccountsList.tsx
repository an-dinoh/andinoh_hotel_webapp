import { useState, useEffect } from "react";
import { Building2, Plus, Trash2, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { BankAccount } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";

interface BankAccountsListProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BankAccountsList({ isOpen, onClose }: BankAccountsListProps) {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingAccount, setAddingAccount] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        bankName: "",
        accountName: "",
        accountNumber: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchBankAccounts();
        }
    }, [isOpen]);

    const fetchBankAccounts = async () => {
        try {
            setLoading(true);
            const accounts = await hotelService.getBankAccounts();
            const accountsList = Array.isArray(accounts)
                ? accounts
                : (accounts as any)?.results && Array.isArray((accounts as any).results)
                    ? (accounts as any).results
                    : [];
            setBankAccounts(accountsList);
        } catch (error: any) {
            console.error("Error fetching bank accounts:", error);
            toast.error(error.message || "Failed to fetch bank accounts");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.bankName || !form.accountName || !form.accountNumber) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setSaving(true);
            await hotelService.createBankAccount({
                bank_name: form.bankName,
                account_name: form.accountName,
                account_number: form.accountNumber,
            });
            toast.success("Bank account added successfully");
            setAddingAccount(false);
            setForm({ bankName: "", accountName: "", accountNumber: "" });
            fetchBankAccounts();
        } catch (error: any) {
            toast.error(error.message || "Failed to add bank account");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">Bank Accounts</h2>
                        <p className="text-[#5C5B59] text-sm mt-1">Manage your linked bank accounts</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-[#5C5B59]" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {addingAccount ? (
                        <form onSubmit={handleAddAccount} className="bg-white p-6 rounded-2xl border border-[#D3D9DD] shadow-sm mb-6">
                            <h3 className="font-semibold text-lg text-[#1A1A1A] mb-4">Add New Bank Account</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Bank Name</label>
                                    <input
                                        type="text"
                                        value={form.bankName}
                                        onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                                        placeholder="e.g. Zenith Bank"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Account Name</label>
                                    <input
                                        type="text"
                                        value={form.accountName}
                                        onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Account Number</label>
                                    <input
                                        type="text"
                                        value={form.accountNumber}
                                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                                        placeholder="e.g. 0123456789"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#0F75BD] focus:border-[#0F75BD]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setAddingAccount(false)}
                                    className="flex-1 px-4 py-2.5 border border-[#D3D9DD] rounded-xl text-[#1A1A1A] font-medium hover:bg-gray-50"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2.5 bg-[#0F75BD] text-white rounded-xl font-medium hover:bg-[#0050C8] flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    Save Account
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-6 flex justify-end">
                            <button
                                onClick={() => setAddingAccount(true)}
                                className="px-4 py-2.5 bg-[#0F75BD] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#0050C8] transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Bank Account
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-[#0F75BD] animate-spin" />
                        </div>
                    ) : bankAccounts.length === 0 && !addingAccount ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No Bank Accounts</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-4">
                                You haven't linked any bank accounts yet.
                            </p>
                            <button
                                onClick={() => setAddingAccount(true)}
                                className="text-[#0F75BD] font-medium hover:underline text-sm"
                            >
                                Add your first bank account
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bankAccounts.map((account) => (
                                <div key={account.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between group hover:border-[#0F75BD] transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#F0F9FF] flex items-center justify-center shrink-0">
                                            <Building2 className="w-6 h-6 text-[#0F75BD]" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1A1A1A]">{account.bank_name}</h4>
                                            <p className="text-sm text-[#5C5B59] mt-0.5">{account.account_name} • {account.account_number}</p>
                                        </div>
                                    </div>
                                    {/* Option to view details or remove in the future */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
