"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import PasswordRequirements from "@/components/ui/PasswordStrengthIndicator";
import TermsAndConditions from "@/components/ui/TermsAndConditions";
import { useState, useMemo } from "react";
import { FormValidator, FormState } from "@/utils/FormValidator";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({
    hotelName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hotelLicenseNumber: "",
  });

  const [errors, setErrors] = useState({
    global: "",
    email: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ✅ Handles field changes
  const handleChange = (field: keyof FormState, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    const validator = new FormValidator(updatedForm);
    const fieldError = validator.validateField(field, value);

    if (field === "email") {
      setErrors((prev: any) => ({ ...prev, email: fieldError }));
    }

    if (field === "confirmPassword") {
      setErrors((prev: any) => ({ ...prev, confirmPassword: fieldError }));
    }


    if (errors.global) {
      setErrors((prev: any) => ({ ...prev, global: "" }));
    }
  };

  const isFormValid = useMemo(() => {
    const allFilled =
      form.hotelName.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.hotelLicenseNumber.trim();

    const passwordsMatch = form.password === form.confirmPassword;
    return allFilled && passwordsMatch && acceptedTerms;
  }, [form, acceptedTerms]);

  // ✅ Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrors((prev: any) => ({
        ...prev,
        global: "Please fill all fields and accept the Terms.",
      }));
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await authService.register({
        email: form.email,
        password: form.password,
        hotel_name: form.hotelName,
        hotel_license_number: form.hotelLicenseNumber,
        role: "hotel", // Correct role for hotel owner
      } as any);

      if (response && response.access_token) {
        // Save auth data and update global AuthContext
        login(response.access_token, response.user, response.refresh_token);

        toast.success("Account created successfully!");

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to register. Please try again.";
      setErrors((prev: any) => ({ ...prev, global: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
          Register
        </h1>
        <p className="text-slate-500 text-sm font-normal leading-relaxed">
          Create your hotel account to manage bookings, rooms, and staff.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          label="Hotel Name"
          placeholder="e.g., Grand View"
          value={form.hotelName}
          onChange={(e) => handleChange("hotelName", e.target.value)}
        />

        <InputField
          label="Email Address"
          placeholder="e.g., hotel@example.com"
          value={form.email}
          onChange={(e) => {
            const email = e.target.value;
            handleChange("email", email);

            const validator = new FormValidator({ ...form, email });
            if (email.trim() === "") {
              setEmailError("");
            } else if (!validator.validateEmail(email)) {
              setEmailError("Please enter a valid email address.");
            } else {
              setEmailError("");
            }
          }}
          error={emailError}
        />

        <InputField
          label="Hotel License Number"
          placeholder="Enter license number"
          value={form.hotelLicenseNumber}
          onChange={(e) => handleChange("hotelLicenseNumber", e.target.value)}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("password", value);
          }}
        />

        <PasswordRequirements password={form.password} />

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("confirmPassword", value);

            if (!value) {
              setConfirmPasswordError("");
            } else if (value !== form.password) {
              setConfirmPasswordError("Passwords do not match.");
            } else {
              setConfirmPasswordError("");
            }
          }}
          error={confirmPasswordError}
        />

        <TermsAndConditions
          accepted={acceptedTerms}
          onChange={setAcceptedTerms}
        />

        <div className="pt-2">
          <Button
            text="Register"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
          />
        </div>
      </form>

      {errors.global && (
        <p className="text-red-500 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 mt-3">{errors.global}</p>
      )}

      <p className="text-left text-xs text-slate-500 mt-5 pt-3.5 border-t border-slate-100">
        Already have an account?{" "}
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
