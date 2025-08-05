import React from 'react';

interface MobileTileProps {
    title: string;
    subtitle?: string;
    icon?: string;
    isSelected?: boolean;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    compact?: boolean; // For quiz option tiles
}

export const MobileTile: React.FC<MobileTileProps> = ({
    title,
    subtitle,
    icon,
    isSelected = false,
    onClick,
    disabled = false,
    className = '',
    compact = false
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-full ${compact ? 'min-h-[60px] p-4' : 'min-h-[80px] p-6'} rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${isSelected
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                    : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-98 cursor-pointer hover:scale-102'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm
        ${className}
      `}
        >
            <div className={`flex ${compact ? 'flex-row items-center justify-start space-x-3' : 'flex-col items-center justify-center space-y-2'}`}>
                {icon && (
                    <span className={`${compact ? 'text-xl' : 'text-2xl'}`} role="img" aria-hidden="true">
                        {icon}
                    </span>
                )}
                <div className={`${compact ? 'text-left' : 'text-center'}`}>
                    <span className={`font-semibold text-gray-800 dark:text-gray-200 ${compact ? 'text-base' : 'text-center'}`}>
                        {title}
                    </span>
                    {subtitle && !compact && (
                        <span className="text-sm text-gray-600 dark:text-gray-400 text-center block mt-1">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};
