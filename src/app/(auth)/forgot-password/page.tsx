"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { FormValidator } from "@/utils/FormValidator";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    global: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (value: string) => {
    setEmail(value);

    // Clear global error when user types
    if (errors.global) {
      setErrors((prev) => ({ ...prev, global: "" }));
    }

    // Validate email field
    const validator = new FormValidator({
      hotelName: "",
      email: value,
      password: "",
      confirmPassword: "",
    });

    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else if (!validator.validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validator = new FormValidator({
      hotelName: "",
      email: email,
      password: "",
      confirmPassword: "",
    });

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, global: "Email is required." }));
      return;
    }

    if (!validator.validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        global: "Please enter a valid email address.",
      }));
      return;
    }

    setErrors({ global: "", email: "" });
    setIsSubmitted(true);
    console.log("✅ OTP sent to:", email);
    // TODO: Send OTP to email via API
  };

  const handleContinue = () => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto px-6">
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#002968] hover:bg-gray-50 transition-colors mb-6"
        >
          <svg
            className="w-6 h-6 text-[#002968]"
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

        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[#002968] font-semibold hover:underline"
            >
              try again
            </button>
          </p>
        </div>

        <Button text="Continue to Verify OTP" onClick={handleContinue} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <Link
        href="/login"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#002968] hover:bg-gray-50 transition-colors mb-6"
      >
        <svg
          className="w-6 h-6 text-[#002968]"
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

      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-600">
          No worries, we'll send you reset instructions
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          error={errors.email}
        />

        {errors.global && (
          <p className="text-red-600 text-sm">{errors.global}</p>
        )}

        <Button text="Send Reset Link" onClick={handleSubmit} />
      </form>
    </div>
  );
}
