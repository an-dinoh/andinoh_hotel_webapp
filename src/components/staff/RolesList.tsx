import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit2, Eye, Trash2, Shield, Users, X, CheckCircle2, Loader2 } from "lucide-react";
import { Role } from "@/types/staff.types";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";

interface RolesListProps {
  roles: Role[];
  loading?: boolean;
  onRefresh?: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function RolesList({ roles, loading, onRefresh, searchTerm, onSearchChange }: RolesListProps) {
  const router = useRouter();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleAction = async (action: string, roleId: string, roleName: string) => {
    const role = roles.find(r => r.id === roleId);

    switch (action) {
      case "edit":
        router.push(`/staff/roles/edit/${roleId}`);
        break;
      case "view":
        setSelectedRole(role || null);
        setShowViewModal(true);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete the role "${roleName}"?\n\nThis action cannot be undone and will affect ${role?.usersCount || 0} user(s).`)) {
          try {
            setDeleting(roleId);
            await hotelService.deleteRole(roleId);
            toast.success(`Role "${roleName}" deleted successfully`);
            onRefresh?.();
          } catch (error: any) {
            console.error("Error deleting role:", error);
            toast.error(error.message || "Failed to delete role");
          } finally {
            setDeleting(null);
          }
        }
        break;
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-[#D3D9DD] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent placeholder:text-[#8F8E8D] placeholder:text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-[#D3D9DD]">
          <Loader2 className="w-10 h-10 text-[#0F75BD] animate-spin mb-4" />
          <p className="text-[#5C5B59] font-medium">Loading roles...</p>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-[#D3D9DD]">
          <Shield className="w-12 h-12 text-[#D3D9DD] mb-4" />
          <p className="text-[#5C5B59] font-medium">
            {searchTerm ? "No roles found matching your search" : "No roles defined yet"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => router.push('/staff/roles/create')}
              className="mt-4 text-[#0F75BD] font-medium hover:underline"
            >
              Create your first role
            </button>
          )}
        </div>
      ) : (
        /* Roles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="border border-[#D3D9DD] rounded-2xl p-6 bg-white hover:border-[#0F75BD] transition-all hover:shadow-lg relative overflow-hidden group"
            >
              {deleting === role.id && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#0F75BD] animate-spin" />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#0F75BD]" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAction("view", role.id, role.name)}
                    className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-[#5C5B59]" />
                  </button>
                  <button
                    onClick={() => handleAction("edit", role.id, role.name)}
                    className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors"
                    title="Edit Role"
                  >
                    <Edit2 className="w-4 h-4 text-[#0F75BD]" />
                  </button>
                  <button
                    onClick={() => handleAction("delete", role.id, role.name)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{role.name}</h3>
              <p className="text-sm text-[#5C5B59] mb-4 line-clamp-2">{role.description || "No description provided"}</p>

              <div className="flex items-center gap-2 mb-4 text-sm text-[#5C5B59]">
                <Users className="w-4 h-4" />
                <span>{role.usersCount || 0} {role.usersCount === 1 ? "user" : "users"}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(role.permissions || []).slice(0, 3).map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F9FF] text-[#0F75BD]"
                  >
                    {permission.replace(/_/g, " ")}
                  </span>
                ))}
                {(role.permissions || []).length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#5C5B59]">
                    +{(role.permissions || []).length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Role Modal - Beautiful & Clean */}
      {showViewModal && selectedRole && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Clean White Design */}
            <div className="relative bg-white border-b border-[#E5E7EB]">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#E8F4F8] flex items-center justify-center shadow-sm">
                      <Shield className="w-8 h-8 text-[#0F75BD]" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">{selectedRole.name}</h2>
                      <div className="flex items-center gap-4 text-[#5C5B59]">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{selectedRole.usersCount || 0} {selectedRole.usersCount === 1 ? "user" : "users"}</span>
                        </div>
                        <span className="text-[#D3D9DD]">•</span>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">{(selectedRole.permissions || []).length} permissions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2.5 hover:bg-[#F5F5F5] rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5C5B59]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)] bg-[#FAFAFB]">
              {/* Description */}
              <div className="mb-8 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="text-sm font-semibold text-[#0F75BD] uppercase tracking-wide mb-3">Description</h3>
                <p className="text-[#1A1A1A] leading-relaxed">{selectedRole.description || "No description provided."}</p>
              </div>

              {/* Permissions Grid */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="text-sm font-semibold text-[#0F75BD] uppercase tracking-wide mb-4">
                  Granted Permissions ({(selectedRole.permissions || []).length})
                </h3>

                {(selectedRole.permissions || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedRole.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl hover:bg-[#E8F4F8] hover:border-[#0F75BD] transition-all duration-200 group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#E8F4F8] flex items-center justify-center group-hover:bg-[#0F75BD] transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-[#0F75BD] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-[#1A1A1A] capitalize">
                          {permission.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#5C5B59] italic">No permissions assigned to this role.</p>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[#E5E7EB] p-6 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    router.push(`/staff/roles/edit/${selectedRole.id}?tab=roles`);
                  }}
                  className="flex-1 px-6 py-3 bg-[#0F75BD] text-white rounded-xl hover:bg-[#0050C8] transition-all font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Role
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-8 py-3 border border-[#D3D9DD] text-[#1A1A1A] rounded-xl hover:bg-[#FAFAFB] transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
