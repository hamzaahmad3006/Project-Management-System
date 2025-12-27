import React, { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonFormProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger";
  textColor?: string;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const ButtonForm: React.FC<ButtonFormProps> = ({
  label,
  size = "md",
  variant = "primary",
  textColor = "",
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`
        rounded-md font-medium transition
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${textColor}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
};

export default ButtonForm;
