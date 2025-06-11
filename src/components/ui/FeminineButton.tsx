// src/components/ui/FeminineButton.tsx
import React from "react";

interface FeminineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

const FeminineButton: React.FC<FeminineButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  type = "button",
  icon,
}) => {
  const baseClasses =
    "rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 focus:ring-pink-500",
    secondary:
      "bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500 focus:ring-purple-400",
    accent:
      "bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 focus:ring-yellow-400",
    outline:
      "bg-transparent border-2 border-pink-400 text-pink-500 hover:bg-pink-50 focus:ring-pink-400",
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-5 py-2",
    large: "px-8 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "hover:shadow-md active:shadow-inner";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${widthClass} ${disabledClasses} ${
        icon ? "flex items-center justify-center gap-2" : ""
      }`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </button>
  );
};

export default FeminineButton;
