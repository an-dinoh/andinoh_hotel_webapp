"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { TabType, Role } from "@/types/staff.types";
import { hotelService } from "@/services/hotel.service";
import { HotelStaff } from "@/types/hotel.types";
import { toast } from "react-hot-toast";
import StatsCard from "@/components/staff/StatsCard";
import UsersTable from "@/components/staff/UsersTable";
import AdminsTable from "@/components/staff/AdminsTable";
import RolesList from "@/components/staff/RolesList";
import CreateUserModal from "@/components/staff/CreateUserModal";
import CreateAdminModal from "@/components/staff/CreateAdminModal";

function StaffContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>(tabParam || "users");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [staff, setStaff] = useState<HotelStaff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getStaff();
      setStaff(response.results || []);
    } catch (error: any) {
      if (error?.message !== 'Resource not found') {
        console.error("Error fetching staff:", error);
        toast.error(error.message || "Failed to fetch staff");
      }
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await hotelService.getRoles();
      setRoles(response.results || []);
    } catch (error: any) {
      if (error?.message !== 'Resource not found') {
        toast.error(error.message || "Failed to fetch roles");
      }
    } finally {
      setRolesLoading(false);
    }
  };


  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ["users", "admins", "roles"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === staff.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(staff.map((u) => u.id));
    }
  };

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.is_active).length,
    inactive: staff.filter(s => !s.is_active).length,
    pending: staff.filter(s => s.invitation_status === 'pending').length
  };

  const handleCreateClick = () => {
    if (activeTab === "users") {
      setShowCreateUserModal(true);
    } else if (activeTab === "admins") {
      setShowCreateAdminModal(true);
    } else {
      router.push("/staff/roles/create");
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "users":
        return "Create New User";
      case "admins":
        return "Create New Admin";
      case "roles":
        return "Create New Role";
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide pt-8 pb-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Staff</h1>
            <p className="text-[#5C5B59] mt-1">Manage your hotel staff and permissions</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2.5 bg-[#0F75BD] text-sm text-white font-regular rounded-2xl hover:bg-[#0050C8] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {getButtonText()}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Staff", value: stats.total },
            { label: "Active Staff", value: stats.active },
            { label: "Inactive Staff", value: stats.inactive },
            { label: "Pending Invitations", value: stats.pending },
          ].map((stat, index) => (
            <div key={index} className="bg-[#FAFAFB] border border-[#E5E7EB] rounded-[24px] p-6">
              {loading ? (
                <>
                  <div className="w-28 h-4 bg-[#EBEBEB] rounded-[10px] animate-pulse mb-3" />
                  <div className="w-12 h-8 bg-[#EBEBEB] rounded-[10px] animate-pulse" />
                </>
              ) : (
                <>
                  <p className="text-[#5C5B59] text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-[#1A1A1A] tracking-tight">{stat.value}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="border-b border-[#E5E7EB]">
            <div className="flex">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-8 py-4 font-medium text-sm  transition-colors relative ${activeTab === "users"
                  ? "text-[#0F75BD] border-b-2 border-[#0F75BD]"
                  : "text-[#5C5B59] hover:text-[#1A1A1A]"
                  }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("admins")}
                className={`px-8 py-4 font-medium text-sm transition-colors relative ${activeTab === "admins"
                  ? "text-[#0F75BD] border-b-2 border-[#0F75BD]"
                  : "text-[#5C5B59] hover:text-[#1A1A1A]"
                  }`}
              >
                Admins
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`px-8 py-4 font-medium text-sm transition-colors relative ${activeTab === "roles"
                  ? "text-[#0F75BD] border-b-2 border-[#0F75BD]"
                  : "text-[#5C5B59] hover:text-[#1A1A1A]"
                  }`}
              >
                Roles and Permissions
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "users" && (
            <UsersTable
              users={staff}
              roles={roles}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedUsers={selectedUsers}
              onToggleUser={toggleUserSelection}
              onToggleAll={toggleSelectAll}
              loading={loading}
              onRefresh={fetchStaff}
            />
          )}

          {activeTab === "admins" && (
            <AdminsTable
              admins={staff.filter(s => s.role === 'hotel_owner' || s.role === 'hotel_admin' || s.role === 'hotel_manager')}
              roles={roles}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              loading={loading}
              onRefresh={fetchStaff}
            />
          )}

          {activeTab === "roles" && (
            <RolesList
              roles={roles}
              loading={rolesLoading}
              onRefresh={fetchRoles}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSuccess={fetchStaff}
      />
      <CreateAdminModal
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSuccess={fetchStaff}
      />
    </div>
  );
}

export default function StaffPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffContent />
    </Suspense>
  );
}
