export interface FormState {
  hotelName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  global?: string;
  email?: string;
  confirmPassword?: string;
}

export class FormValidator {
  form: FormState;

  constructor(form: FormState) {
    this.form = form;
  }

  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validatePassword(password: string) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    return regex.test(password);
  }

  getPasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return Math.min(strength, 4);
  }

  validateField(field: keyof FormState, value: string): string {
    if (field === "email") {
      if (value && !this.validateEmail(value)) return "Please enter a valid email.";
    }

    if (field === "confirmPassword") {
      if (value && value !== this.form.password) return "Passwords do not match.";
    }

    return "";
  }

  validateForm(): FormErrors {
    if (!this.validatePassword(this.form.password)) {
      return {
        global:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
      };
    }

    if (!this.validateEmail(this.form.email)) {
      return { global: "Please enter a valid email address." };
    }

    if (this.form.password !== this.form.confirmPassword) {
      return { global: "Passwords do not match." };
    }

    return {};
  }
}
