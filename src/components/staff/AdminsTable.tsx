import React, { useState } from "react";
import { Search, MoreVertical, Edit, Trash2, UserX, Shield, X, Save, Loader2, CheckCircle2 } from "lucide-react";
import { HotelStaff, StaffRole } from "@/types/hotel.types";
import { Role } from "@/types/staff.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";

interface AdminsTableProps {
  admins: HotelStaff[];
  roles: Role[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function AdminsTable({
  admins,
  roles,
  searchTerm,
  onSearchChange,
  loading = false,
  onRefresh,
}: AdminsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<HotelStaff | null>(null);
  const [selectedRole, setSelectedRole] = useState<StaffRole | "">("");
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    role: "" as StaffRole | "",
  });

  const handleAction = (action: string, adminId: string) => {
    setOpenMenuId(null);
    const admin = admins.find(a => a.id === adminId);

    switch (action) {
      case "edit":
        if (admin) {
          const names = admin.full_name.split(" ");
          setSelectedUser(admin);
          setEditForm({
            firstName: names[0] || "",
            lastName: names.slice(1).join(" ") || "",
            role: admin.role,
          });
          setShowEditModal(true);
        }
        break;
      case "deactivate":
        handleToggleStatus(admin);
        break;
      case "delete":
        setSelectedUser(admin || null);
        setShowDeleteModal(true);
        break;
      case "permissions":
        setSelectedUser(admin || null);
        setSelectedRole(admin?.role || "");
        setShowPermissionsModal(true);
        break;
    }
  };

  const handleToggleStatus = async (user: HotelStaff | undefined) => {
    if (!user) return;
    try {
      setSaving(true);
      if (user.is_active) {
        await hotelService.updateStaff(user.id, { is_active: false });
        toast.success(`Admin ${user.full_name} deactivated`);
      } else {
        await hotelService.activateStaff(user.id);
        toast.success(`Admin ${user.full_name} activated`);
      }
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update admin status");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      await hotelService.updateStaff(selectedUser.id, {
        full_name: `${editForm.firstName} ${editForm.lastName}`.trim(),
        role: editForm.role as StaffRole,
      });
      toast.success("Admin updated successfully");
      setShowEditModal(false);
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update admin");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser || !selectedRole) return;
    try {
      setSaving(true);
      await hotelService.changeStaffRole(selectedUser.id, {
        role: selectedRole as StaffRole,
      });
      toast.success("Permissions updated");
      setShowPermissionsModal(false);
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      await hotelService.deleteStaff(selectedUser.id);
      toast.success(`Admin ${selectedUser.full_name} deleted`);
      setShowDeleteModal(false);
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-[#D3D9DD] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0F75BD] animate-spin" />
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFAFB] border-b border-[#E5E7EB]">
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#5C5B59] uppercase">Name</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#5C5B59] uppercase">Email</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#5C5B59] uppercase">Role</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#5C5B59] uppercase">Status</th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#5C5B59] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-[#5C5B59]">
                  No administrators found
                </td>
              </tr>
            ) : (
              admins
                .filter(a =>
                  a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((admin) => (
                  <tr key={admin.id} className="hover:bg-[#FAFAFB] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0F75BD] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {admin.full_name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-[#1A1A1A]">{admin.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#5C5B59]">{admin.email}</td>
                    <td className="py-4 px-4 text-sm text-[#5C5B59] capitalize">
                      {admin.role.replace(/hotel_/g, "").replace(/_/g, " ")}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${admin.is_active
                          ? "bg-[#ECFDF5] text-green-700"
                          : "bg-[#FEF3C7] text-yellow-700"
                          }`}
                      >
                        {admin.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === admin.id ? null : admin.id)}
                          className="p-2 hover:bg-[#FAFAFB] rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-[#5C5B59]" />
                        </button>

                        {openMenuId === admin.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#D3D9DD] rounded-xl shadow-lg z-10 py-2">
                            <button
                              onClick={() => handleAction("edit", admin.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-[#FAFAFB] flex items-center gap-3"
                            >
                              <Edit className="w-4 h-4 text-[#0F75BD]" />
                              Edit Admin
                            </button>
                            <button
                              onClick={() => handleAction("permissions", admin.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-[#FAFAFB] flex items-center gap-3"
                            >
                              <Shield className="w-4 h-4 text-purple-600" />
                              Permissions
                            </button>
                            <button
                              onClick={() => handleAction("deactivate", admin.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-[#FAFAFB] flex items-center gap-3 text-orange-600"
                            >
                              <UserX className="w-4 h-4" />
                              {admin.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <div className="border-t border-[#E5E7EB] my-1"></div>
                            <button
                              onClick={() => handleAction("delete", admin.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-[#E5E7EB] flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Admin</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditForm({ ...editForm, role: e.target.value as StaffRole })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 shadow-sm bg-white"
                >
                  <option value="hotel_manager">Hotel Manager</option>
                  <option value="hotel_admin">Hotel Admin</option>
                  <option value="hotel_owner">Hotel Owner</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 bg-[#0F75BD] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
              <button onClick={() => setShowEditModal(false)} className="px-8 py-3 bg-white border rounded-xl shadow-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPermissionsModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-[#E5E7EB]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#0F75BD] flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-2xl">{selectedUser.full_name?.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Manage Permissions</h2>
                    <p className="text-[#5C5B59] text-sm">{selectedUser.full_name} • {selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setShowPermissionsModal(false)} className="p-2.5 hover:bg-[#F5F5F5] rounded-xl">
                  <X className="w-5 h-5 text-[#5C5B59]" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-[#FAFAFB] overflow-y-auto max-h-[400px]">
              <div className="space-y-3">
                {roles.filter(r => r.name.startsWith('hotel_')).map((role) => (
                  <label
                    key={role.id}
                    className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${selectedRole === role.name ? "border-[#0F75BD] bg-[#E8F4F8]" : "border-[#E5E7EB] hover:border-gray-300 bg-white"}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.name}
                      checked={selectedRole === role.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedRole(e.target.value as StaffRole)}
                      className="mt-1 w-4 h-4 text-[#0F75BD]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-[#0F75BD]" />
                        <h4 className="font-semibold text-[#1A1A1A]">{role.name.replace(/hotel_/g, "").replace(/_/g, " ")}</h4>
                      </div>
                      <p className="text-sm text-[#5C5B59] mb-3">{role.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(role.permissions || []).slice(0, 4).map((p, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-lg text-xs text-[#5C5B59]">
                            <CheckCircle2 className="w-3 h-3 text-[#0F75BD]" />
                            {p.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[#E5E7EB] bg-white flex gap-3">
              <button
                onClick={handleSavePermissions}
                disabled={saving || !selectedRole}
                className="flex-1 px-6 py-3 bg-[#0F75BD] text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-8 py-3 border border-[#D3D9DD] rounded-xl font-medium shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-red-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold">Delete Admin</h2>
            </div>
            <div className="p-8">
              <p>Are you sure you want to delete <span className="font-semibold">{selectedUser.full_name}</span>? This action cannot be undone.</p>
            </div>
            <div className="p-6 bg-red-50 flex gap-3">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Admin
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="px-8 py-3 bg-white border rounded-xl shadow-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
