interface ButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset"; 
}

export default function Button({
  text,
  onClick,
  type = "submit",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-[#002968] text-white py-3 rounded-sm hover:bg-[#0d5f9c] transition-colors font-medium text-sm"
    >
      {text}
    </button>
  );
}
