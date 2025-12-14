interface PerformanceCardProps {
  userName: string;
  userBadge: string;
  averageRating: number;
  completionPercentage: number;
  points: number;
  approvedGigs: number;
  approvedGigsChange?: string;
  onViewProfile?: () => void;
}

export default function PerformanceCard({
  userName,
  userBadge,
  averageRating,
  completionPercentage,
  points,
  approvedGigs,
  approvedGigsChange = "-%",
  onViewProfile
}: PerformanceCardProps) {
  // Calculate circular progress stroke offset
  const calculateStrokeOffset = (percentage: number) => {
    const circumference = 2 * Math.PI * 88;
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#E6EFF6] rounded-lg flex items-center justify-center">
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          Your Performance Activities
        </h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#1A1A1A]">
            {userName}
          </h3>
          <span className="inline-block bg-[#E6EFF6] text-[#0F75BD] text-xs font-medium px-3 py-1 rounded-full mt-1">
            {userBadge}
          </span>
        </div>
      </div>

      {/* Average Ratings Card */}
      <div className="border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-2xl font-bold text-orange-500">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-base font-medium text-[#5C5B59]">
            Average Ratings
          </span>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center py-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#3B82F6"
                strokeWidth="12"
                fill="none"
                strokeDasharray="552.92"
                strokeDashoffset={calculateStrokeOffset(completionPercentage)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-[#1A1A1A]">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <p className="text-sm text-[#5C5B59] mt-4 text-center">
            {completionPercentage === 0 ? (
              <>
                No Gig has been
                <br />
                completed yet!
              </>
            ) : (
              `${completionPercentage}% of gigs completed`
            )}
          </p>
        </div>
      </div>

      {/* Points Card */}
      <div className="border border-gray-200 rounded-2xl p-4 mb-4">
        <p className="text-sm text-[#5C5B59] mb-1">Points</p>
        <p className="text-3xl font-bold text-[#1A1A1A]">{points}</p>
      </div>

      {/* Approved Gigs Card */}
      <div className="border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5C5B59] mb-1">Approved Gigs</p>
            <p className="text-3xl font-bold text-[#1A1A1A]">{approvedGigs}</p>
          </div>
          <span className="text-sm text-[#5C5B59]">{approvedGigsChange}</span>
        </div>
      </div>

      {/* View Profile Button */}
      <button
        onClick={onViewProfile}
        className="w-full border border-gray-300 text-sm text-[#1A1A1A] py-3 px-4 rounded-2xl font-regular hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        View Profile
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
