"use client";

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useState } from "react";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import { FormValidator, FormState } from "@/utils/FormValidator";


export default function ResgisterPage() {
  const [form, setForm] = useState<FormState>({
    hotelName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    global: "",
    email: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");

  const [passwordStrength, setPasswordStrength] = useState(0);

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChange = (field: keyof FormState, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    const validator = new FormValidator(updatedForm);
    const fieldError = validator.validateField(field, value);

    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: fieldError }));
    }

    if (field === "confirmPassword") {
      setErrors((prev) => ({ ...prev, confirmPassword: fieldError }));
    }

    if (field === "password") {
      setPasswordStrength(validator.getPasswordStrength(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validator = new FormValidator(form);
    const formErrors = validator.validateForm();

    if (formErrors.global) {
      setErrors((prev) => ({ ...prev, global: formErrors.global || "" }));
      return;
    }

    console.log("✅ Form submitted:", form);
  };

  return (
    <div className="rounded-2xl p-8">
      <div className="text-left mb-8">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          Register Your Hotel
        </h1>
        <p className="text-gray-500 font-regular text-sm">
          Create your hotel account to manage bookings, rooms, and staff
          effortlessly.
        </p>
      </div>

      <form className="space-y-5">
        <InputField
          label="Hotel Name"
          placeholder="Enter hotel name"
          value={form.hotelName}
          onChange={(e) => handleChange("hotelName", e.target.value)}
        />

        <InputField
          label="Official Email"
          placeholder="Enter hotel email"
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
          label="Password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("password", value);
            const validator = new FormValidator({ ...form, password: value });
            setPasswordStrength(validator.getPasswordStrength(value));
          }}
        />
        {form.password && (
          <PasswordStrengthIndicator strength={passwordStrength} />
        )}

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

        <Button text="Register Hotel" onClick={handleSubmit} />
      </form>
      {errors.global && (
        <p className="text-red-600 text-sm mt-2">{errors.global}</p>
      )}

      <p className="text-left text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#002968] hover:underline font-sm font-semibold"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
