"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <label className="block text-[#0B0A07] text-xs sm:text-sm mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border px-3 py-2 pr-9 text-sm text-gray-800 
    focus:outline-none focus:ring-1 focus:border-transparent 
    placeholder:text-[#8F8E8D] placeholder:text-sm
    ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-[#D3D9DD] focus:ring-[#8E9397]"
    }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <span className="text-[#0B0A07] text-xs sm:text-xm font-semibold cursor-pointer select-none">
              {showPassword ? "Hide" : "Show"}
            </span>
          </button>
        )}
      </div>
      <p
        className={`mt-1 text-xs text-red-500 transition-all duration-150 ${
          error ? "h-auto opacity-100" : "h-0 opacity-0"
        }`}
      >
        {error || " "}
      </p>
    </div>
  );
}
