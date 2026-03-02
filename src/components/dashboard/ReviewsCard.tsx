import { Skeleton } from "@/components/ui/Skeleton";

interface ReviewsCardProps {
  emptyStateMessage?: string;
  loading?: boolean;
}

export default function ReviewsCard({
  emptyStateMessage = "No Reviews & Ratings yet!",
  loading = false
}: ReviewsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">
            Latest Reviews
          </h2>
        </div>
        <button className="text-xs font-semibold text-[#0F75BD] hover:underline">View All</button>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton width="32px" height="32px" variant="circle" />
                <Skeleton width="100px" height="14px" />
              </div>
              <Skeleton width="100%" height="48px" />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
            <span className="text-3xl text-gray-300">⭐</span>
          </div>
          <p className="text-sm font-medium text-[#5C5B59] mt-2 text-center max-w-[180px]">
            {emptyStateMessage}
          </p>
          <p className="text-[11px] text-gray-400 mt-2 text-center">Reviews help build trust with guests.</p>
        </div>
      )}
    </div>
  );
}
