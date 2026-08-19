"use client";
import { Check } from "lucide-react";

export default function CustomCheckbox({
  accepted,
  onChange,
}: {
  accepted: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!accepted)}
      aria-checked={accepted}
      role="checkbox"
      className={`h-4 w-4 shrink-0 flex items-center justify-center rounded-md border transition-all duration-150 cursor-pointer select-none mt-0.5
        ${
          accepted
            ? "bg-[#0F75BD] border-[#0F75BD] text-white shadow-sm"
            : "border-slate-300 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F75BD]/20"
        }
      `}
    >
      {accepted && <Check className="h-3 w-3 text-white stroke-[3]" />}
    </button>
  );
}
