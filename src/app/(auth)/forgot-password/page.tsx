"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    global: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = useMemo(() => {
    return email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const handleChange = (value: string) => {
    setEmail(value);

    // Clear global error when user types
    if (errors.global) {
      setErrors((prev) => ({ ...prev, global: "" }));
    }

    // Validate email field
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, global: "Email is required." }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        global: "Please enter a valid email address.",
      }));
      return;
    }

    if (loading) return;

    setErrors({ global: "", email: "" });
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      toast.success("Reset code sent to your email!");
      setIsSubmitted(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send reset code. Please try again.";
      setErrors((prev) => ({ ...prev, global: message }));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  if (isSubmitted) {
    return (
      <div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors mb-5"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
            Check Your Email
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
            We&apos;ve sent a 4-digit reset code to {email}.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please check your inbox and spam folder. The code is valid for 15 minutes.
          </p>
        </div>

        <Button text="Continue to Verify OTP" onClick={handleContinue} />

        <p className="text-left text-xs text-slate-500 mt-5 pt-3.5 border-t border-slate-100">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-[#0F75BD] hover:text-[#0050C8] hover:underline font-semibold transition-colors"
          >
            Try again or change email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors mb-5"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
          Forgot Password?
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          error={errors.email}
        />

        {errors.global && (
          <p className="text-red-500 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">{errors.global}</p>
        )}

        <div className="pt-2">
          <Button
            text="Send Reset Code"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
          />
        </div>
      </form>

      <p className="text-left text-xs text-slate-500 mt-5 pt-3.5 border-t border-slate-100">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-[#0F75BD] hover:text-[#0050C8] hover:underline font-semibold transition-colors"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
