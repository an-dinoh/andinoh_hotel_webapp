"use client";

import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">View detailed insights and reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <BarChart3 className="mx-auto text-blue-600 mb-2" size={40} />
          <h3 className="font-semibold text-gray-900">Revenue Reports</h3>
          <p className="text-sm text-gray-600 mt-1">Coming soon</p>
        </Card>
        <Card className="text-center">
          <TrendingUp className="mx-auto text-green-600 mb-2" size={40} />
          <h3 className="font-semibold text-gray-900">Occupancy Trends</h3>
          <p className="text-sm text-gray-600 mt-1">Coming soon</p>
        </Card>
        <Card className="text-center">
          <DollarSign className="mx-auto text-yellow-600 mb-2" size={40} />
          <h3 className="font-semibold text-gray-900">Financial Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">Coming soon</p>
        </Card>
        <Card className="text-center">
          <Users className="mx-auto text-purple-600 mb-2" size={40} />
          <h3 className="font-semibold text-gray-900">Guest Insights</h3>
          <p className="text-sm text-gray-600 mt-1">Coming soon</p>
        </Card>
      </div>

      <Card>
        <div className="text-center py-12">
          <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Analytics Dashboard Coming Soon
          </h2>
          <p className="text-gray-600">
            Advanced analytics and reporting features will be available here.
          </p>
        </div>
      </Card>
    </div>
  );
}
