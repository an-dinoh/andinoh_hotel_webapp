"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Plus, X } from "lucide-react";
import { hotelService } from "@/services/hotel.service";

interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

interface RoleForm {
  name: string;
  description: string;
  permissions: string[];
}

export default function CreateRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const [form, setForm] = useState<RoleForm>({
    name: "",
    description: "",
    permissions: [],
  });

  const permissionsData: Permission[] = [
    // Room Management
    { id: "view_rooms", label: "View Rooms", description: "View all rooms and their details", category: "Room Management" },
    { id: "create_rooms", label: "Create Rooms", description: "Add new rooms to the system", category: "Room Management" },
    { id: "edit_rooms", label: "Edit Rooms", description: "Modify room details and settings", category: "Room Management" },
    { id: "delete_rooms", label: "Delete Rooms", description: "Remove rooms from the system", category: "Room Management" },

    // Booking Management
    { id: "view_bookings", label: "View Bookings", description: "View all booking records", category: "Booking Management" },
    { id: "create_bookings", label: "Create Bookings", description: "Create new reservations", category: "Booking Management" },
    { id: "edit_bookings", label: "Edit Bookings", description: "Modify booking details", category: "Booking Management" },
    { id: "cancel_bookings", label: "Cancel Bookings", description: "Cancel existing bookings", category: "Booking Management" },

    // Guest Management
    { id: "view_guests", label: "View Guests", description: "View guest profiles and history", category: "Guest Management" },
    { id: "edit_guests", label: "Edit Guests", description: "Modify guest information", category: "Guest Management" },
    { id: "delete_guests", label: "Delete Guests", description: "Remove guest records", category: "Guest Management" },

    // Staff Management
    { id: "view_staff", label: "View Staff", description: "View all staff members", category: "Staff Management" },
    { id: "create_staff", label: "Create Staff", description: "Add new staff members", category: "Staff Management" },
    { id: "edit_staff", label: "Edit Staff", description: "Modify staff information", category: "Staff Management" },
    { id: "delete_staff", label: "Delete Staff", description: "Remove staff members", category: "Staff Management" },
    { id: "manage_roles", label: "Manage Roles", description: "Create and edit user roles", category: "Staff Management" },

    // Financial
    { id: "view_finances", label: "View Finances", description: "View financial reports and transactions", category: "Financial" },
    { id: "manage_payments", label: "Manage Payments", description: "Process payments and refunds", category: "Financial" },
    { id: "export_reports", label: "Export Reports", description: "Export financial and operational reports", category: "Financial" },

    // Settings
    { id: "view_settings", label: "View Settings", description: "View system settings", category: "Settings" },
    { id: "edit_settings", label: "Edit Settings", description: "Modify system configuration", category: "Settings" },
  ];

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const perms = await hotelService.getPermissions();
        setAvailablePermissions(perms);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setIsLoadingPermissions(false);
      }
    };
    fetchPermissions();
  }, []);

  const activePermissions = availablePermissions.length > 0
    ? permissionsData.filter(p => availablePermissions.includes(p.id))
    : permissionsData;

  const categories = Array.from(new Set(activePermissions.map(p => p.category)));

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Role name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.permissions.length === 0) newErrors.permissions = "At least one permission must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      await hotelService.createRole({
        name: form.name,
        permissions: form.permissions,
      });

      setSuccessMessage("Role created successfully!");
      setTimeout(() => {
        router.push("/staff?tab=roles");
      }, 1500);
    } catch (error) {
      setErrors({
        submit: "Failed to create role. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: "" }));
    }
  };

  const selectAllInCategory = (category: string) => {
    const categoryPermissions = activePermissions
      .filter(p => p.category === category)
      .map(p => p.id);

    const allSelected = categoryPermissions.every(id => form.permissions.includes(id));

    if (allSelected) {
      setForm(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryPermissions.includes(id))
      }));
    } else {
      setForm(prev => ({
        ...prev,
        permissions: Array.from(new Set([...prev.permissions, ...categoryPermissions]))
      }));
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/staff?tab=roles")}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#0F75BD] hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#0F75BD]" />
        </button>

        {/* Header */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Create New Role
          </h1>
          <p className="text-gray-500 text-sm">
            Define a new role with specific permissions
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-4 bg-[#ECFDF5] border border-green-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-700" />
            <p className="text-sm font-semibold text-green-800">
              {successMessage}
            </p>
          </div>
        )}

        {errors.submit && (
          <div className="p-4 bg-[#FEE2E2] border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-sm font-semibold text-red-800">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-8 border border-[#D3D9DD]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="e.g., Front Desk Manager, Housekeeping Staff"
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm ${errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D3D9DD] focus:ring-[#8E9397]"
                    }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[#0B0A07] text-sm mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: "" });
                  }}
                  rows={3}
                  placeholder="Describe the responsibilities and scope of this role..."
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm resize-none ${errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#D3D9DD] focus:ring-[#8E9397]"
                    }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-2xl p-8 border border-[#D3D9DD]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Permissions <span className="text-red-500">*</span>
              </h2>
              <div className="text-sm text-[#5C5B59]">
                {form.permissions.length} selected
              </div>
            </div>

            {errors.permissions && (
              <p className="mb-4 text-sm text-red-600">{errors.permissions}</p>
            )}

            <div className="space-y-6">
              {isLoadingPermissions && (
                <div className="text-gray-500 text-sm py-4">Loading available permissions...</div>
              )}
              {!isLoadingPermissions && categories.map(category => {
                const categoryPerms = activePermissions.filter(p => p.category === category);
                const allSelected = categoryPerms.every(p => form.permissions.includes(p.id));
                const someSelected = categoryPerms.some(p => form.permissions.includes(p.id));

                return (
                  <div key={category} className="border border-[#E5E7EB] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#0F75BD]" />
                        {category}
                      </h3>
                      <button
                        type="button"
                        onClick={() => selectAllInCategory(category)}
                        className="text-sm text-[#0F75BD] hover:text-[#0050C8] font-medium transition-colors"
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryPerms.map(permission => (
                        <label
                          key={permission.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.permissions.includes(permission.id)
                              ? "border-[#0F75BD] bg-[#F0F9FF]"
                              : "border-[#E5E7EB] hover:border-[#D3D9DD] hover:bg-[#FAFAFB]"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="mt-0.5 w-4 h-4 text-[#0F75BD] border-[#D3D9DD] rounded focus:ring-[#0F75BD] focus:ring-offset-0 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-[#1A1A1A]">
                              {permission.label}
                            </div>
                            <div className="text-xs text-[#5C5B59] mt-0.5">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/staff?tab=roles")}
              className="px-6 py-2.5 border border-[#D3D9DD] text-[#1A1A1A] rounded-xl hover:bg-[#FAFAFB] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0F75BD] text-white rounded-xl hover:bg-[#0050C8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
