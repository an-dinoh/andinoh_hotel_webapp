import { useState } from "react";
import { X, Loader2, Shield } from "lucide-react";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";
import { StaffRole, Department } from "@/types/hotel.types";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAdminModal({ isOpen, onClose, onSuccess }: CreateAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "hotel_admin" as StaffRole,
    employeeId: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await hotelService.inviteStaff({
        email: formData.email,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        employee_id: formData.employeeId,
        role: formData.role,
        department: 'management',
        hire_date: new Date().toISOString().split('T')[0],
        is_full_time: true,
      });

      toast.success("Administrator invited successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error.message || "Failed to invite administrator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Admin</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new administrator to your hotel team</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1 font-medium">First Name *</label>
                <input
                  type="text"
                  placeholder="Sarah"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
                />
              </div>
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1 font-medium">Last Name *</label>
                <input
                  type="text"
                  placeholder="Williams"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0B0A07] text-sm mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                placeholder="sarah@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1 font-medium">Employee ID *</label>
                <input
                  type="text"
                  placeholder="ADM-001"
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
                />
              </div>
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1 font-medium">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                  className="w-full rounded-xl border border-[#D3D9DD] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjOEY4RThEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="hotel_owner">Hotel Owner</option>
                  <option value="hotel_admin">Hotel Admin</option>
                  <option value="hotel_manager">Hotel Manager</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                Administrators have full access to manage hotel settings, bookings, and staff. An invitation email will be sent with login instructions.
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[#D3D9DD] rounded-xl hover:bg-gray-50 text-gray-800 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#0F75BD] hover:bg-[#0050C8] text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Inviting..." : "Create Admin & Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
