import { Skeleton } from "@/components/ui/Skeleton";
import { Star } from "lucide-react";

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

interface ReviewsCardProps {
  reviews?: Review[];
  emptyStateMessage?: string;
  loading?: boolean;
}

export default function ReviewsCard({
  reviews = [],
  emptyStateMessage = "No Reviews & Ratings yet!",
  loading = false
}: ReviewsCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
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
      ) : reviews.length > 0 ? (
        <div className="space-y-6 divide-y divide-gray-100">
          {reviews.slice(0, 3).map((review, index) => {
            const reviewerInitials = review.reviewer_name
              ? review.reviewer_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : "G";
            
            const reviewDate = review.created_at
              ? new Date(review.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : "Recent";

            return (
              <div key={review.id || index} className={`pt-4 first:pt-0 group transition-all duration-300`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 text-[#0F75BD] font-bold text-xs rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
                      {reviewerInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#0F75BD] transition-colors">
                          {review.reviewer_name || "Anonymous Guest"}
                        </h4>
                        {review.is_verified && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-0.5">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{reviewDate}</p>
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`text-xs ${
                          s <= (review.rating || 0) ? "text-orange-400" : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pl-12">
                  {review.title && (
                    <h5 className="text-xs font-bold text-[#1A1A1A] mb-1">
                      {review.title}
                    </h5>
                  )}
                  <p className="text-xs text-[#5C5B59] leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
            <Star className="w-8 h-8 text-gray-300 stroke-[1.5]" />
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
