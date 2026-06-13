import { Skeleton } from "@/components/ui/Skeleton";
import { Bed, CalendarCheck } from "lucide-react";

interface PerformanceCardProps {
  userName: string;
  userBadge: string;
  averageRating: number;
  completionPercentage: number;
  occupiedRooms: number;
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
  occupiedRooms,
  approvedGigs,
  approvedGigsChange = "-%",
  onViewProfile,
  loading = false
}: PerformanceCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#0F75BD]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
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
          <div className="w-12 h-12 bg-[#0F75BD] text-white font-bold rounded-2xl flex items-center justify-center border border-blue-100/50">
            {userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "HM"}
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
              {loading ? (
                <Skeleton width="40px" height="32px" />
              ) : (
                (typeof averageRating === 'number' ? averageRating.toFixed(1) : "0.0")
              )}
            </span>
            <span className="text-xs font-bold text-[#5C5B59] uppercase tracking-tighter">
              Avg Rating
            </span>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`text-xs ${s <= Math.round(averageRating || 0) ? 'text-orange-400' : 'text-gray-200'}`}>★</span>
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
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="#0F75BD"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="452.39"
                    strokeDashoffset={452.39 - ((completionPercentage || 0) / 100) * 452.39}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#1A1A1A]">
                    {Math.round(completionPercentage || 0)}%
                  </span>
                  <span className="text-[10px] text-[#5C5B59] font-bold uppercase">Occupancy</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-center gap-3 transition-colors hover:bg-gray-50">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100 shrink-0">
            <Bed className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8F8E8D] uppercase tracking-wider">Occupied</p>
            {loading ? (
              <Skeleton width="30px" height="20px" className="mt-0.5" />
            ) : (
              <p className="text-lg font-black text-[#1A1A1A] mt-0.5">{occupiedRooms || 0}</p>
            )}
          </div>
        </div>
        <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex items-center gap-3 transition-colors hover:bg-gray-50">
          <div className="w-10 h-10 bg-blue-50 text-[#0F75BD] rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
            <CalendarCheck className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8F8E8D] uppercase tracking-wider">Bookings</p>
            {loading ? (
              <Skeleton width="30px" height="20px" className="mt-0.5" />
            ) : (
              <p className="text-lg font-black text-[#1A1A1A] mt-0.5">{approvedGigs || 0}</p>
            )}
          </div>
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
