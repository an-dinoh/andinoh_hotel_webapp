"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Mail,
  Phone,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Award,
  Briefcase,
  ChevronDown,
  Copy,
  Check,
  Key,
  TrendingUp,
  Building2,
  Calendar,
  Eye,
  UserCog,
  AlertCircle,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { hotelService } from "@/services/hotel.service";
import { HotelStaff, StaffRole, Department } from "@/types/hotel.types";

export default function StaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<HotelStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [invitedStaffEmail, setInvitedStaffEmail] = useState("");
  const [copiedPassword, setCopiedPassword] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    full_name: "",
    role: "receptionist" as StaffRole,
    employee_id: "",
    phone: "",
    department: "front_office" as Department,
    hire_date: "",
    is_full_time: true,
    salary: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchStaff();
  }, [roleFilter, statusFilter, departmentFilter]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (roleFilter !== "all") filters.role = roleFilter;
      if (statusFilter !== "all") filters.invitation_status = statusFilter;
      if (departmentFilter !== "all") filters.department = departmentFilter;

      const data = await hotelService.getStaff(filters);
      console.log("✅ Staff response:", data);

      const staffArray = Array.isArray(data) ? data : [];
      setStaff(staffArray);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setSubmitting(true);
      const payload: any = {
        email: inviteForm.email,
        full_name: inviteForm.full_name,
        role: inviteForm.role,
        employee_id: inviteForm.employee_id,
        department: inviteForm.department,
        is_full_time: inviteForm.is_full_time,
      };

      if (inviteForm.phone) payload.phone = inviteForm.phone;
      if (inviteForm.hire_date) payload.hire_date = inviteForm.hire_date;
      if (inviteForm.salary) payload.salary = parseFloat(inviteForm.salary);

      const response: any = await hotelService.inviteStaff(payload);

      // Store temp password and email for success modal
      setTempPassword(response.temp_password || "");
      setInvitedStaffEmail(inviteForm.email);
      setShowInviteModal(false);
      setShowSuccessModal(true);

      // Reset form
      setInviteForm({
        email: "",
        full_name: "",
        role: "receptionist",
        employee_id: "",
        phone: "",
        department: "front_office",
        hire_date: "",
        is_full_time: true,
        salary: "",
      });

      await fetchStaff();
    } catch (error: any) {
      console.error("Error inviting staff:", error);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.email?.[0] || "Failed to invite staff member";
      setErrors({ submit: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const getRoleBadge = (role: StaffRole) => {
    const badges = {
      manager: { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Manager", icon: Award },
      assistant_manager: { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Asst. Manager", icon: Award },
      front_desk_manager: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Front Desk Mgr", icon: Building2 },
      receptionist: { color: "bg-cyan-100 text-cyan-700 border-cyan-200", label: "Receptionist", icon: Users },
      reservations_manager: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "Reservations Mgr", icon: Calendar },
      reservations_agent: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "Reservations", icon: Calendar },
      guest_relations: { color: "bg-pink-100 text-pink-700 border-pink-200", label: "Guest Relations", icon: Users },
      housekeeping_manager: { color: "bg-green-100 text-green-700 border-green-200", label: "Housekeeping Mgr", icon: Shield },
      housekeeping_staff: { color: "bg-green-100 text-green-700 border-green-200", label: "Housekeeping", icon: Shield },
      maintenance: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Maintenance", icon: Shield },
      security: { color: "bg-red-100 text-red-700 border-red-200", label: "Security", icon: Shield },
      customer_service: { color: "bg-teal-100 text-teal-700 border-teal-200", label: "Customer Service", icon: Users },
    };
    return badges[role] || { color: "bg-gray-100 text-gray-700 border-gray-200", label: role, icon: Users };
  };

  const getStatusBadge = (status: string) => {
    const statuses = {
      active: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Active" },
      pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, label: "Pending" },
      registered: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2, label: "Registered" },
      suspended: { color: "bg-orange-100 text-orange-700 border-orange-200", icon: XCircle, label: "Suspended" },
      terminated: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Terminated" },
    };
    return statuses[status] || statuses.pending;
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Stats calculations
  const activeStaff = staff.filter((s) => s.invitation_status === "active" && s.is_active).length;
  const pendingStaff = staff.filter((s) => s.invitation_status === "pending").length;
  const departments = new Set(staff.map((s) => s.department)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <UserPlus className="w-4 h-4" />
              Invite Staff
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
          {/* Total Staff */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{staff.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">All team members</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeStaff}</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">Currently working</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingStaff}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600">Awaiting activation</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{departments}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Briefcase className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Active divisions</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="manager">Manager</option>
                    <option value="assistant_manager">Assistant Manager</option>
                    <option value="front_desk_manager">Front Desk Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="reservations_manager">Reservations Manager</option>
                    <option value="reservations_agent">Reservations Agent</option>
                    <option value="guest_relations">Guest Relations</option>
                    <option value="housekeeping_manager">Housekeeping Manager</option>
                    <option value="housekeeping_staff">Housekeeping Staff</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="customer_service">Customer Service</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="all">All Departments</option>
                    <option value="management">Management</option>
                    <option value="front_office">Front Office</option>
                    <option value="reservations">Reservations</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="customer_service">Customer Service</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="registered">Registered</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredStaff.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{staff.length}</span> staff members
              </p>
              {(roleFilter !== "all" || statusFilter !== "all" || departmentFilter !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setRoleFilter("all");
                    setStatusFilter("all");
                    setDepartmentFilter("all");
                    setSearchTerm("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Staff Table */}
        {loading ? (
          <SkeletonTable rows={8} columns={6} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No staff members found</h3>
              <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "Get started by inviting your first team member to join your hotel."}
              </p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
              >
                <UserPlus className="w-4 h-4" />
                Invite First Staff Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role & Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStaff.map((member) => {
                    const roleBadge = getRoleBadge(member.role);
                    const statusBadge = getStatusBadge(member.invitation_status);
                    const RoleIcon = roleBadge.icon;
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => router.push(`/staff/${member.id}`)}
                      >
                        {/* Staff Member */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {member.full_name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {member.full_name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              {member.phone && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Phone className="w-3 h-3 flex-shrink-0" />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Employee ID */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-mono font-medium">
                            {member.employee_id || "N/A"}
                          </span>
                        </td>

                        {/* Role & Department */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge.color}`}
                            >
                              <RoleIcon className="w-3 h-3" />
                              {roleBadge.label}
                            </span>
                            <p className="text-xs text-gray-600 capitalize flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {member.department_display || member.department?.replace("_", " ")}
                            </p>
                          </div>
                        </td>

                        {/* Permissions */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {member.can_manage_bookings && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                Bookings
                              </span>
                            )}
                            {member.can_manage_rooms && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                                Rooms
                              </span>
                            )}
                            {member.can_view_reports && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                                Reports
                              </span>
                            )}
                            {member.can_handle_complaints && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                                Complaints
                              </span>
                            )}
                            {member.can_manage_rates && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-50 text-pink-700">
                                Rates
                              </span>
                            )}
                            {member.can_manage_staff && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                                Staff
                              </span>
                            )}
                            {!member.permissions?.length && (
                              <span className="text-xs text-gray-400">No permissions</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/staff/${member.id}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Invite Staff Member</h2>
                  <p className="text-sm text-blue-100 mt-0.5">Add a new team member to your hotel</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleInviteStaff} className="p-6 space-y-6">
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.full_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="john@hotel.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.employee_id}
                      onChange={(e) => setInviteForm({ ...inviteForm, employee_id: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="EMP001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Role & Department
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as StaffRole })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="front_desk_manager">Front Desk Manager</option>
                      <option value="manager">Manager</option>
                      <option value="assistant_manager">Assistant Manager</option>
                      <option value="reservations_manager">Reservations Manager</option>
                      <option value="reservations_agent">Reservations Agent</option>
                      <option value="guest_relations">Guest Relations Officer</option>
                      <option value="housekeeping_manager">Housekeeping Manager</option>
                      <option value="housekeeping_staff">Housekeeping Staff</option>
                      <option value="maintenance">Maintenance Staff</option>
                      <option value="security">Security Officer</option>
                      <option value="customer_service">Customer Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={inviteForm.department}
                      onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value as Department })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="front_office">Front Office</option>
                      <option value="management">Management</option>
                      <option value="reservations">Reservations</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                      <option value="customer_service">Customer Service</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      value={inviteForm.hire_date}
                      onChange={(e) => setInviteForm({ ...inviteForm, hire_date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary (Optional)
                    </label>
                    <input
                      type="number"
                      value={inviteForm.salary}
                      onChange={(e) => setInviteForm({ ...inviteForm, salary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="50000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inviteForm.is_full_time}
                        onChange={(e) => setInviteForm({ ...inviteForm, is_full_time: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Full-time Employment</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setErrors({});
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending Invitation..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal with Temp Password */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Invited Successfully!</h3>
              <p className="text-sm text-gray-600 mb-6">
                An account has been created for <span className="font-semibold">{invitedStaffEmail}</span>
              </p>

              <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">Temporary Password</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono font-bold text-blue-900 bg-white px-3 py-2 rounded-lg border border-blue-300">
                    {tempPassword}
                  </code>
                  <button
                    onClick={copyPassword}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {copiedPassword ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-amber-800">
                  <strong>Important:</strong> Send these credentials to {invitedStaffEmail}. They must change their password on first login.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setTempPassword("");
                  setInvitedStaffEmail("");
                  setCopiedPassword(false);
                }}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
