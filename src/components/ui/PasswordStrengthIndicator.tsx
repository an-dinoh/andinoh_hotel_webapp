"use client";

export default function PasswordStrengthIndicator({
  strength,
}: {
  strength: number;
}) {
  const colors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-3">
      <div className="flex gap-2 justify-left">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 w-6 rounded-full transition-colors duration-300 ${
              strength >= level ? colors[strength - 1] : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-xs mt-2 text-gray-600 text-left font-medium">
        {strength > 0 ? labels[strength - 1] : ""}
      </p>
    </div>
  );
}
