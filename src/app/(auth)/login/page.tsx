"use client";

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { FormValidator } from "@/utils/FormValidator";

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    global: "",
    email: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field: keyof LoginFormState, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    // Clear global error when user types
    if (errors.global) {
      setErrors((prev) => ({ ...prev, global: "" }));
    }

    // Validate email field
    if (field === "email") {
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validator = new FormValidator({
      hotelName: "",
      email: form.email,
      password: "",
      confirmPassword: "",
    });

    if (!form.email.trim()) {
      setErrors((prev) => ({ ...prev, global: "Email is required." }));
      return;
    }

    if (!validator.validateEmail(form.email)) {
      setErrors((prev) => ({
        ...prev,
        global: "Please enter a valid email address.",
      }));
      return;
    }

    if (!form.password.trim()) {
      setErrors((prev) => ({ ...prev, global: "Password is required." }));
      return;
    }

    setErrors({ global: "", email: "" });
    console.log("✅ Login form submitted:", { ...form, rememberMe });
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="
      appearance-none 
      w-4 h-4 
      border border-gray-400 
      rounded-sm 
      checked:bg-[#002968] 
      checked:border-[#002968] 
      relative
      transition-colors duration-200
      before:content-[''] 
      before:absolute 
      before:inset-0 
      before:m-auto 
      before:w-[6px] before:h-[10px] 
      before:border-b-2 before:border-r-2 
      before:border-white 
      before:rotate-45 
      checked:before:block 
      before:hidden
    "
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-[#002968] hover:underline font-sm font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {errors.global && (
          <p className="text-red-600 text-sm">{errors.global}</p>
        )}

        <Button text="Sign In" onClick={handleSubmit} />
      </form>

      <p className="text-left text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-[#002968] hover:underline font-sm font-semibold"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
