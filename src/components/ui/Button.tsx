import Loading from "./Loading";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Button({
  text,
  children,
  onClick,
  type = "submit",
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = true,
  size = "md",
  className = "",
}: ButtonProps) {
  const baseStyles =
    "rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2";

  const sizeStyles = {
    sm: "py-2 px-4 text-xs",
    md: "py-3.5 px-6 text-sm",
    lg: "py-6 px-8 text-base",
  };

  const variantStyles = {
    primary:
      "bg-[#0F75BD] text-white hover:bg-[#0050C8] disabled:bg-[#0F75BD]/40 disabled:hover:bg-[#0F75BD]/40 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed",
    success:
      "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {loading && (
        <Loading size="sm" />
      )}
      {loading ? "Processing..." : (children || text)}
    </button>
  );
}
