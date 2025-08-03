import React from 'react';

interface MobileTileProps {
  title: string;
  subtitle?: string;
  icon?: string;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const MobileTile: React.FC<MobileTileProps> = ({
  title,
  subtitle,
  icon,
  isSelected = false,
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full min-h-[80px] p-6 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-98 cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm
        ${className}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        {icon && (
          <span className="text-2xl" role="img" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="font-semibold text-gray-800 text-center">
          {title}
        </span>
        {subtitle && (
          <span className="text-sm text-gray-600 text-center">
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
};
