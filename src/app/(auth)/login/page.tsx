"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useState, useMemo } from "react";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    global: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const isFormValid = useMemo(() => {
    return form.email.trim() !== "" && form.password.trim() !== "";
  }, [form.email, form.password]);

  const handleChange = (field: keyof LoginFormState, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    // Clear global error when user types
    if (errors.global) {
      setErrors((prev: any) => ({ ...prev, global: "" }));
    }

    // Validate email field
    if (field === "email") {
      if (value.trim() === "") {
        setErrors((prev: any) => ({ ...prev, email: "" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prev: any) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prev: any) => ({ ...prev, email: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setErrors((prev: any) => ({ ...prev, global: "Email is required." }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors((prev: any) => ({
        ...prev,
        global: "Please enter a valid email address.",
      }));
      return;
    }

    if (!form.password.trim()) {
      setErrors((prev: any) => ({ ...prev, global: "Password is required." }));
      return;
    }

    setErrors({ global: "", email: "" });

    // Prevent double submission
    if (loading) return;

    setLoading(true);

    try {
      const response = await authService.login({
        email: form.email,
        password: form.password,
      });

      if (response && response.access_token) {
        // Save auth data and update global AuthContext
        login(response.access_token, response.user, response.refresh_token);

        toast.success("Login successful!");

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to log in. Please check your credentials.";
      setErrors((prev: any) => ({ ...prev, global: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
          Login
        </h1>
        <p className="text-slate-500 text-sm font-normal leading-relaxed">
          Log in to your account to manage your hotel
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div className="flex justify-end text-xs pt-1">
          <Link
            href="/forgot-password"
            className="text-[#0F75BD] hover:text-[#0050C8] hover:underline font-normal transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {errors.global && (
          <p className="text-red-500 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">{errors.global}</p>
        )}

        <div className="pt-2">
          <Button
            text="Login"
            onClick={handleSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
          />
        </div>
      </form>

      <p className="text-left text-xs text-slate-500 mt-5 pt-3.5 border-t border-slate-100">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#0F75BD] hover:text-[#0050C8] hover:underline font-semibold transition-colors"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
