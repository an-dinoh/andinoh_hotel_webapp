"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";

import { authService } from "@/services/auth.service";
import { extractErrorMessage } from "@/utils/api";
import { toast } from "react-hot-toast";

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isFormValid = useMemo(() => {
    return otp.every((digit) => digit !== "");
  }, [otp]);

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Clear error when user types
    if (error) setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // Actually verify OTP against backend before navigating
      await authService.verifyOTP({ email, otp: otpValue });

      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${otpValue}&verified=true`
      );
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Invalid or expired reset code.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendTimer(60);
    try {
      await authService.forgotPassword({ email });
      toast.success("A new OTP has been sent to your email.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
      setResendTimer(0);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <Link
        href="/forgot-password"
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Verify OTP</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
          Enter the 4-digit code sent to{" "}
          <span className="font-semibold text-slate-800">{email}</span>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center max-w-[280px] mx-auto py-1">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`
                w-11 h-11 sm:w-12 sm:h-12 text-center text-lg font-medium text-slate-900 bg-white
                border rounded-xl outline-none focus:outline-none focus:ring-0
                transition-colors duration-150
                ${error
                  ? "border-red-400 focus:border-red-500"
                  : digit
                    ? "border-[#0F75BD] text-[#0F75BD]"
                    : "border-slate-200 hover:border-slate-300 focus:border-[#0F75BD]"
                }
              `}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-xs font-normal bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>
        )}

        <div className="pt-2">
          <Button
            text="Verify OTP"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
          />
        </div>
      </form>

      <p className="text-left text-xs text-slate-500 mt-5 pt-3.5 border-t border-slate-100">
        Didn&apos;t receive the code?{" "}
        {resendTimer > 0 ? (
          <span className="text-slate-400 font-medium">Resend in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-[#0F75BD] hover:text-[#0050C8] hover:underline font-semibold transition-colors disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </p>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="rounded-2xl p-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <VerifyOTPForm />
    </Suspense>
  );
}
