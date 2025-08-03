import React from 'react';

interface MobileButtonProps {
  variant?: 'primary' | 'secondary' | 'tile' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[56px] px-6 py-3 text-base',
    lg: 'min-h-[72px] px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200',
    tile: 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
