import { Skeleton } from "@/components/ui/Skeleton";

interface PerformanceCardProps {
  userName: string;
  userBadge: string;
  averageRating: number;
  completionPercentage: number;
  points: number;
  approvedGigs: number;
  approvedGigsChange?: string;
  onViewProfile?: () => void;
  loading?: boolean;
}

export default function PerformanceCard({
  userName,
  userBadge,
  averageRating,
  completionPercentage,
  points,
  approvedGigs,
  approvedGigsChange = "-%",
  onViewProfile,
  loading = false
}: PerformanceCardProps) {
  // Calculate circular progress stroke offset
  const calculateStrokeOffset = (percentage: number) => {
    const circumference = 2 * Math.PI * 88;
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-gray-600">
          🎚️
        </div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          Performance Insight
        </h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        {loading ? (
          <Skeleton width="48px" height="48px" variant="circle" />
        ) : (
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl border-2 border-white">
            👤
          </div>
        )}
        <div className="flex-1">
          {loading ? (
            <div className="space-y-2">
              <Skeleton width="100px" height="14px" />
              <Skeleton width="60px" height="18px" className="rounded-full" />
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                {userName}
              </h3>
              <span className="inline-block bg-white text-[#0F75BD] border border-blue-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mt-1">
                {userBadge}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Average Ratings Card */}
      <div className="border border-gray-100 bg-white rounded-2xl p-6 mb-6 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500">
              {loading ? <Skeleton width="40px" height="32px" /> : averageRating.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-[#5C5B59] uppercase tracking-tighter">
              Avg Rating
            </span>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`text-xs ${s <= Math.round(averageRating) ? 'text-orange-400' : 'text-gray-200'}`}>⭐</span>
            ))}
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-40 h-40">
            {loading ? (
              <Skeleton width="160px" height="160px" variant="circle" />
            ) : (
              <>
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="#0F75BD"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="452.39"
                    strokeDashoffset={452.39 - (completionPercentage / 100) * 452.39}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#1A1A1A]">
                    {completionPercentage}%
                  </span>
                  <span className="text-[10px] text-[#5C5B59] font-bold uppercase">Occupancy</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-100 bg-gray-50 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#5C5B59] uppercase mb-1">Total Points</p>
          {loading ? <Skeleton width="40px" height="24px" /> : <p className="text-2xl font-black text-[#1A1A1A]">{points}</p>}
        </div>
        <div className="border border-gray-100 bg-gray-50 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#5C5B59] uppercase mb-1">Bookings</p>
          {loading ? <Skeleton width="40px" height="24px" /> : <p className="text-2xl font-black text-[#1A1A1A]">{approvedGigs}</p>}
        </div>
      </div>

      {/* View Profile Button */}
      {!loading && (
        <button
          onClick={onViewProfile}
          className="w-full bg-[#1A1A1A] text-white text-xs py-4 px-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          Property Profile
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}
    </div>
  );
}
