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
      <label className="block text-gray-700 text-xs sm:text-sm mb-1">{label}</label>

      <div className="relative">
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full border border-gray-400 rounded-sm px-2.5 py-2 sm:px-3 sm:py-2.5 pr-9 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#002968] focus:border-transparent ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-400"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
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
