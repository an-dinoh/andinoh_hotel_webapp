interface ReviewsCardProps {
  emptyStateMessage?: string;
}

export default function ReviewsCard({
  emptyStateMessage = "No Reviews & Ratings yet!"
}: ReviewsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="w-6 h-6 bg-[#E6EFF6] rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#0F75BD]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          Latest Reviews & Ratings
        </h2>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-22 h-22 bg-gray-200 rounded-3xl flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <p className="text-sm text-[#5C5B59] mt-4 text-center">
          {emptyStateMessage}
        </p>
      </div>
    </div>
  );
}
