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
}

export default function WelcomeHeader({
  userName,
  date = new Date(),
  actionCards
}: WelcomeHeaderProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[#374C3D] text-white space-y-6 border border-gray-200 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome back {userName}!
          </h1>
          <p className="mt-2 text-sm">
            Here's what's happening on your account today:
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-regular text-gray-200">Today</p>
          <p className="text-sm font-semibold">{formattedDate}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="flex flex-row gap-6">
        {actionCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} border ${card.borderColor} rounded-3xl flex-1 transition hover:shadow-md`}
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
                className={`border ${card.borderColor} ${card.textColor} text-sm font-medium rounded-2xl h-[38px] px-5 ${card.hoverBgColor} hover:text-white transition`}
              >
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
