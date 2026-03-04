import { useCurrency } from "@/contexts/CurrencyContext";
import { Skeleton } from "@/components/ui/Skeleton";

interface RevenueItem {
  label: string;
  amount: string;
  percentage?: string;
}

interface RevenueOverviewCardProps {
  totalRevenue: string;
  currency?: string;
  items: RevenueItem[];
  loading?: boolean;
}

export default function RevenueOverviewCard({
  totalRevenue,
  currency,
  items,
  loading = false
}: RevenueOverviewCardProps) {
  const { activeCurrency } = useCurrency();
  const displayCurrency = currency || activeCurrency?.symbol || "₦";

  return (
    <div className="bg-[#FAFAFB] border-[0.5px] border-[#C8CFD5] rounded-3xl p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A]">
            Revenue Overview
          </h2>
          {loading ? (
            <Skeleton width="60px" height="14px" className="mt-1" />
          ) : (
            <p className="text-xs text-[#5C5B59] mt-0.5">{displayCurrency}{totalRevenue} Total Revenue</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white border-[0.5px] border-[#C8CFD5] rounded-2xl py-4 px-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton width="100px" height="14px" />
                  <Skeleton width="120px" height="24px" />
                </div>
                <Skeleton width="32px" height="32px" variant="circle" />
              </div>
            </div>
          ))
        ) : (
          (items || []).map((item, index) => (
            <div
              key={index}
              className="bg-white border-[0.5px] border-[#C8CFD5] rounded-2xl py-4 px-4 hover:border-[#FBB81F] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#3C3B39] mb-1.5 group-hover:text-[#FBB81F] transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-[#1A1A1A]">
                    {displayCurrency} {item.amount || "0"}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#FBB81F] bg-[#FFF4DF] w-10 h-10 flex items-center justify-center rounded-full">
                  {item.percentage || "0%"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
