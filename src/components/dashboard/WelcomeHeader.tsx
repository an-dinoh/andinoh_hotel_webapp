import { Skeleton } from "@/components/ui/Skeleton";

interface ActionCard {
  title: string;
  description: string;
  buttonText: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  hoverBgColor: string;
  onClick?: () => void;
}

interface WelcomeHeaderProps {
  userName: string;
  date?: Date;
  actionCards: ActionCard[];
  loading?: boolean;
}

export default function WelcomeHeader({
  userName,
  date = new Date(),
  actionCards,
  loading = false
}: WelcomeHeaderProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[#0F75BD] text-white space-y-6 rounded-3xl max-w-7xl mx-auto px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {loading ? (
            <div className="space-y-2">
              <Skeleton width="200px" height="28px" className="bg-white/20" />
              <Skeleton width="300px" height="16px" className="bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold tracking-tight">
                Welcome back {userName}!
              </h1>
              <p className="mt-2 text-sm text-gray-100">
                Here&apos;s what&apos;s happening on your account today:
              </p>
            </>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-regular text-gray-200">Today</p>
          {loading ? (
            <Skeleton width="80px" height="20px" className="mt-1 bg-white/20" />
          ) : (
            <p className="text-sm font-semibold">{formattedDate}</p>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-4 h-32 animate-pulse" />
          ))
        ) : (
          actionCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} border ${card.borderColor} rounded-3xl flex-1 transition cursor-default`}
            >
              <div className="px-4 py-4 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#5C5B59]">
                    {card.description}
                  </p>
                </div>
                <button
                  onClick={card.onClick}
                  className={`border ${card.borderColor} ${card.textColor} text-sm font-medium rounded-2xl h-[38px] px-5 ${card.hoverBgColor} hover:text-white transition-all duration-300`}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
