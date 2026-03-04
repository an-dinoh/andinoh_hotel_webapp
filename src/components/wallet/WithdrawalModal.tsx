import { useState, useEffect } from "react";
import { DollarSign, ShieldAlert, CheckCircle2, Loader2, X, Building2 } from "lucide-react";
import { BankAccount } from "@/types/hotel.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
}

export default function WithdrawalModal({ isOpen, onClose, availableBalance }: WithdrawalModalProps) {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [form, setForm] = useState({
        amount: "",
        bankAccountId: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchBankAccounts();
        }
    }, [isOpen]);

    const fetchBankAccounts = async () => {
        try {
            setLoadingAccounts(true);
            const accounts = await hotelService.getBankAccounts();
            setBankAccounts(accounts || []);
            if (accounts && accounts.length > 0) {
                setForm(prev => ({ ...prev, bankAccountId: accounts[0].id }));
            }
        } catch (error: any) {
            console.error("Error fetching bank accounts:", error);
            toast.error(error.message || "Failed to fetch bank accounts");
        } finally {
            setLoadingAccounts(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amountNum = parseFloat(form.amount);

        if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (amountNum > availableBalance) {
            toast.error("Insufficient funds for this withdrawal");
            return;
        }

        if (!form.bankAccountId) {
            toast.error("Please select a bank account");
            return;
        }

        try {
            setProcessing(true);
            await hotelService.requestWithdrawal({
                amount: form.amount,
                bank_account_id: form.bankAccountId,
            });
            toast.success("Withdrawal request submitted successfully");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit withdrawal request");
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A]">Withdraw Funds</h2>
                        <p className="text-[#5C5B59] text-sm mt-1">Transfer money to your bank account</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-[#5C5B59]" />
                    </button>
                </div>

                <div className="p-6 pt-8">
                    <div className="mb-8 p-5 bg-[#F0F9FF] border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-blue-800 mb-1">Available Balance</span>
                        <span className="text-3xl font-bold text-[#0F75BD]">₦{availableBalance.toLocaleString()}</span>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Amount to Withdraw (₦)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    min="100"
                                    max={availableBalance}
                                    step="1"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    placeholder="e.g. 50000"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium text-gray-900 outline-none focus:ring-2 focus:ring-[#0F75BD] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex justify-between">
                                <span>Select Bank Account</span>
                            </label>

                            {loadingAccounts ? (
                                <div className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 text-[#0F75BD] animate-spin" />
                                    <span className="text-sm text-gray-500">Loading your accounts...</span>
                                </div>
                            ) : bankAccounts.length === 0 ? (
                                <div className="w-full py-3 px-4 border border-orange-200 border-dashed rounded-xl bg-orange-50 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-orange-800">
                                        <ShieldAlert className="w-4 h-4" />
                                        <span className="text-sm font-medium text-orange-800">No bank accounts linked</span>
                                    </div>
                                    <span className="text-xs text-orange-600">Please manage your bank accounts first.</span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={form.bankAccountId}
                                        onChange={(e) => setForm({ ...form, bankAccountId: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-[#0F75BD] focus:border-transparent transition-all appearance-none"
                                    >
                                        {bankAccounts.map((acc) => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.bank_name} - {acc.account_number.slice(-4)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing || bankAccounts.length === 0 || !form.amount}
                                className="w-full py-3.5 bg-[#0F75BD] text-white rounded-xl font-bold text-base hover:bg-[#0050C8] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {processing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                ) : (
                                    <><CheckCircle2 className="w-5 h-5" /> Submit Withdrawal Request</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
