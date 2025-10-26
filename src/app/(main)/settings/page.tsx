"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { User, Bell, Lock, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tabs Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#002968] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="col-span-12 md:col-span-9">
          <Card>
            {activeTab === "account" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                <InputField
                  label="Full Name"
                  value="Hotel Manager"
                  onChange={() => {}}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  value="manager@hotel.com"
                  onChange={() => {}}
                />
                <InputField
                  label="Phone Number"
                  value="+1 234 567 8900"
                  onChange={() => {}}
                />
                <Button text="Save Changes" fullWidth={false} />
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <div className="space-y-3">
                  {[
                    "Email notifications for new bookings",
                    "SMS alerts for check-ins",
                    "Daily revenue reports",
                    "Weekly occupancy summaries",
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-[#002968]" />
                      <span className="text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <Button text="Save Preferences" fullWidth={false} />
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                <InputField
                  label="Current Password"
                  type="password"
                  onChange={() => {}}
                />
                <InputField
                  label="New Password"
                  type="password"
                  onChange={() => {}}
                />
                <InputField
                  label="Confirm New Password"
                  type="password"
                  onChange={() => {}}
                />
                <Button text="Update Password" fullWidth={false} />
              </div>
            )}

            {activeTab === "billing" && (
              <div className="text-center py-12">
                <CreditCard className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Billing Management</h3>
                <p className="text-gray-600">Billing features coming soon</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
