interface RevenueItem {
  label: string;
  amount: string;
  percentage?: string;
}

interface RevenueOverviewCardProps {
  totalRevenue: string;
  currency?: string;
  items: RevenueItem[];
}

export default function RevenueOverviewCard({
  totalRevenue,
  currency = "₦",
  items
}: RevenueOverviewCardProps) {
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
          Revenue Overview ({currency}{totalRevenue})
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border-[0.5px] border-[#C8CFD5] rounded-2xl py-3 px-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#3C3B39] mb-1.5">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-[#1A1A1A]">
                  {currency} {item.amount}
                </p>
              </div>
              <span className="text-sm text-[#5C5B59] bg-[#EEF0F2] w-8 h-8 flex items-center justify-center rounded-full">
                {item.percentage || "-%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
