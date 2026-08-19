"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
  min?: string;
  step?: string;
  helpText?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  required = false,
  icon,
  min,
  step,
  helpText,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <label className="block text-slate-700 text-xs font-semibold mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={min}
          step={step}
          className={`w-full h-10 rounded-xl border ${icon ? "pl-10" : "px-3.5"} ${isPassword ? "pr-14" : "pr-3.5"} text-sm font-normal text-slate-900 bg-white
    focus:outline-none focus:ring-0 transition-colors duration-150
    placeholder:text-slate-400 placeholder:text-sm placeholder:font-normal
    ${error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-200 hover:border-slate-300 focus:border-[#0F75BD]"
            }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="text-slate-600 text-xs font-normal cursor-pointer select-none">
              {showPassword ? "Hide" : "Show"}
            </span>
          </button>
        )}
      </div>
      {helpText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 font-normal">{helpText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
