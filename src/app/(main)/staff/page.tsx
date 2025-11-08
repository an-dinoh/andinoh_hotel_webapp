"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";

type TabType = "users" | "admins" | "roles";

interface User {
  id: string;
  name: string;
  email: string;
  category: string;
  status: "active" | "inactive";
  location: string;
  dateAdded: string;
  lastLogin: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: string;
  dateJoined: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
}

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      category: "Hotel Manager",
      status: "active",
      location: "New York, USA",
      dateAdded: "Jan 15, 2024",
      lastLogin: "2 hours ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      category: "Receptionist",
      status: "active",
      location: "Los Angeles, USA",
      dateAdded: "Jan 20, 2024",
      lastLogin: "5 hours ago",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      category: "Housekeeping",
      status: "inactive",
      location: "Chicago, USA",
      dateAdded: "Feb 1, 2024",
      lastLogin: "2 days ago",
    },
  ];

  const admins: Admin[] = [
    {
      id: "1",
      name: "Sarah Williams",
      email: "sarah@example.com",
      status: "active",
      role: "Super Admin",
      dateJoined: "Dec 1, 2023",
    },
    {
      id: "2",
      name: "Tom Brown",
      email: "tom@example.com",
      status: "active",
      role: "Admin",
      dateJoined: "Jan 10, 2024",
    },
  ];

  const roles: Role[] = [
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access with all permissions",
      usersCount: 2,
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Hotel Manager",
      description: "Manage hotel operations and staff",
      usersCount: 5,
      permissions: ["manage_rooms", "manage_bookings", "view_reports"],
    },
    {
      id: "3",
      name: "Receptionist",
      description: "Handle guest check-ins and bookings",
      usersCount: 8,
      permissions: ["manage_bookings", "view_rooms"],
    },
  ];

  const stats = {
    totalUsers: 156,
    activeUsers: 142,
    inactiveUsers: 12,
    deletedUsers: 2,
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your hotel staff and permissions</p>
          </div>
          <button
            onClick={() =>
              activeTab === "users"
                ? setShowCreateUserModal(true)
                : activeTab === "admins"
                ? setShowCreateAdminModal(true)
                : (window.location.href = "/staff/roles/create")
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "users" ? "Create New User" : activeTab === "admins" ? "Create New Admin" : "Create New Role"}
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Active Users</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Inactive Users</p>
            <p className="text-3xl font-bold text-orange-600">{stats.inactiveUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Deleted Users</p>
            <p className="text-3xl font-bold text-red-600">{stats.deletedUsers}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-8 py-4 font-medium transition-colors relative ${
                  activeTab === "users"
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("admins")}
                className={`px-8 py-4 font-medium transition-colors relative ${
                  activeTab === "admins"
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`px-8 py-4 font-medium transition-colors relative ${
                  activeTab === "roles"
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Roles and Permissions
              </button>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option>Category</option>
                    <option>Hotel Manager</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option>Location</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option>Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Location</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date Added</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Last Login</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.category}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.location}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.dateAdded}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                        <td className="py-4 px-4">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing 1-{users.length} of {users.length} users
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search admins..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date Joined</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {admin.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{admin.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{admin.email}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {admin.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{admin.dateJoined}</td>
                        <td className="py-4 px-4">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing 1-{admins.length} of {admins.length} admins
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === "roles" && (
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Roles Grid */}
              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                          <span className="text-sm text-gray-500">
                            {role.usersCount} {role.usersCount === 1 ? "user" : "users"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {permission.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new user to your hotel</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option>Select category</option>
                    <option>Hotel Manager</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="New York, USA"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Create New Admin</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new administrator</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Sarah"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Williams"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option>Select role</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Moderator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
