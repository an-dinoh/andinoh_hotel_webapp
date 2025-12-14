interface BookingStat {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

interface BookingsOverviewCardProps {
  totalBookings: number;
  stats: BookingStat[];
}

export default function BookingsOverviewCard({
  totalBookings,
  stats
}: BookingsOverviewCardProps) {
  return (
    <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-3xl p-4 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1 bg-[#E6EFF6] rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#0F75BD]"
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
        <h2 className="text-base font-semibold text-[#1A1A1A]">
          Bookings Overview ({totalBookings})
        </h2>
      </div>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-[0.5px] border-[#C8CFD5] bg-white rounded-2xl px-4 py-3"
          >
            <span className="text-sm font-medium text-[#3C3B39]">
              {stat.label}
            </span>
            <span className={`text-sm font-medium ${stat.color} ${stat.bgColor} px-4 py-1 rounded-lg`}>
              {stat.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
