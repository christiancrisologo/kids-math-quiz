import React, { forwardRef } from 'react';
import { useIsMobile } from '../../utils/responsive';

interface FractionInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    fullWidth?: boolean;
}

export const FractionInput = forwardRef<HTMLInputElement, FractionInputProps>(({
    value,
    onChange,
    placeholder = "Enter fraction (e.g., 3/4 or 1 2/3)",
    error,
    fullWidth = false
}, ref) => {
    const isMobile = useIsMobile();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            <div className="relative">
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`
            ${fullWidth ? 'w-full' : 'w-auto'}
            ${isMobile ? 'px-4 py-3 text-lg' : 'px-6 py-4 text-xl'}
            text-center border-2 border-gray-300 dark:border-slate-600 
            bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 
            rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
            focus:border-transparent transition-all duration-200
            ${error ? 'border-red-500 dark:border-red-400' : ''}
          `}
                    autoComplete="off"
                    spellCheck="false"
                />

                {/* Helper text */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Examples: 3/4, 1 2/3, 5, 0.5
                </div>
            </div>

            {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                </div>
            )}
        </div>
    );
});

FractionInput.displayName = 'FractionInput';
