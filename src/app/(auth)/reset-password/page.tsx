"use client";

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FormValidator } from "@/utils/FormValidator";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const verified = searchParams.get("verified");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    global: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if user came from OTP verification
    if (!email || verified !== "true") {
      setIsVerified(false);
    } else {
      setIsVerified(true);
    }
  }, [email, verified]);

  const handleChange = (
    field: "password" | "confirmPassword",
    value: string
  ) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    // Clear global error when user types
    if (errors.global) {
      setErrors((prev) => ({ ...prev, global: "" }));
    }

    const validator = new FormValidator({
      hotelName: "",
      email: email || "",
      password: updatedForm.password,
      confirmPassword: updatedForm.confirmPassword,
    });

    // Update password strength
    if (field === "password") {
      setPasswordStrength(validator.getPasswordStrength(value));
    }

    // Validate confirm password field
    if (field === "confirmPassword") {
      const fieldError = validator.validateField("confirmPassword", value);
      setErrors((prev) => ({ ...prev, confirmPassword: fieldError }));
    }

    // Re-validate confirmPassword when password changes
    if (field === "password" && updatedForm.confirmPassword) {
      const confirmError = validator.validateField(
        "confirmPassword",
        updatedForm.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validator = new FormValidator({
      hotelName: "",
      email: email || "",
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    const formErrors = validator.validateForm();

    if (formErrors.global) {
      setErrors((prev) => ({ ...prev, global: formErrors.global || "" }));
      return;
    }

    setErrors({ global: "", confirmPassword: "" });
    setIsSubmitted(true);
    console.log("✅ Password reset successfully for:", email);
    // TODO: Call API to reset password
  };

  if (!isVerified) {
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

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please verify your OTP before resetting your password.
          </p>
        </div>

        <Link href="/forgot-password">
          <Button text="Start Password Reset" onClick={() => {}} />
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Password Reset Successfully
          </h1>
          <p className="text-gray-600">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
        </div>

        <Link href="/login">
          <Button text="Continue to Sign In" onClick={() => {}} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <Link
        href="/verify-otp"
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
          Reset Your Password
        </h1>
        <p className="text-gray-600">
          Enter your new password for{" "}
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        {form.password && (
          <PasswordStrengthIndicator strength={passwordStrength} />
        )}

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />

        {errors.global && (
          <p className="text-red-600 text-sm">{errors.global}</p>
        )}

        <Button text="Reset Password" onClick={handleSubmit} />
      </form>
    </div>
  );
}
