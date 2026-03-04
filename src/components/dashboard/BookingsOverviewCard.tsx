import { Skeleton } from "@/components/ui/Skeleton";

interface BookingStat {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

interface BookingsOverviewCardProps {
  totalBookings: number;
  stats: BookingStat[];
  loading?: boolean;
}

export default function BookingsOverviewCard({
  totalBookings,
  stats,
  loading = false
}: BookingsOverviewCardProps) {
  return (
    <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-3xl p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#E6EFF6] rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#0F75BD]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A]">
            Bookings Overview
          </h2>
          {loading ? (
            <Skeleton width="40px" height="14px" className="mt-1" />
          ) : (
            <p className="text-xs text-[#5C5B59] mt-0.5">{totalBookings} Total Reservations</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between border-[0.5px] border-[#C8CFD5] bg-white rounded-2xl px-4 py-4">
              <Skeleton width="100px" height="16px" />
              <Skeleton width="30px" height="24px" className="rounded-lg" />
            </div>
          ))
        ) : (
          (stats || []).map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-[0.5px] border-[#C8CFD5] bg-white rounded-2xl px-4 py-4 hover:border-[#0F75BD] transition-colors group"
            >
              <span className="text-sm font-medium text-[#3C3B39] group-hover:text-[#0F75BD] transition-colors">
                {stat.label}
              </span>
              <span className={`text-sm font-bold ${stat.color} ${stat.bgColor} px-4 py-1.5 rounded-lg`}>
                {stat.count || 0}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
