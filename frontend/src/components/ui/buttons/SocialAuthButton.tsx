import React from 'react';

export interface SocialAuthButtonProps {
  label: string;
  iconSrc: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  label,
  iconSrc,
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-3
        rounded-md py-2.5 px-4 text-sm font-medium
        bg-white dark:bg-gray-800
        border-2 border-[#E2E4E9] dark:border-gray-700
        text-[#25272D] dark:text-gray-200
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition shadow-sm mb-5
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <img src={iconSrc} className="w-4 h-4" alt={label} />
      {label}
    </button>
  );
};

export default SocialAuthButton;
