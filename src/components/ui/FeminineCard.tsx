// src/components/ui/FeminineCard.tsx
import React from "react";

interface FeminineCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "soft" | "outlined";
}

const FeminineCard: React.FC<FeminineCardProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const baseClasses = "rounded-xl overflow-hidden";

  const variantClasses = {
    default: "bg-white shadow-lg border border-pink-100",
    soft: "bg-pink-50 shadow-md",
    outlined: "bg-white border-2 border-pink-200",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default FeminineCard;
