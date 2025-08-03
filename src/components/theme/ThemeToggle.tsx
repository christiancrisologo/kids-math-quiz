'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/theme-context';
import type { Theme } from '../../contexts/theme-context';

interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md'
}) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const themes: { value: Theme; label: string; icon: string }[] = [
        { value: 'light', label: 'Light', icon: '☀️' },
        { value: 'dark', label: 'Dark', icon: '🌙' },
        { value: 'system', label: 'System', icon: '💻' },
    ];

    const sizeClasses = {
        sm: 'min-h-[36px] px-2 text-sm',
        md: 'min-h-[44px] px-3 text-base',
        lg: 'min-h-[52px] px-4 text-lg'
    };

    const iconSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const currentTheme = themes.find(t => t.value === theme);

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.value === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].value);
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div
                className={`
          ${sizeClasses[size]}
          bg-white dark:bg-slate-800 
          border border-gray-200 dark:border-slate-600
          rounded-lg 
          flex items-center gap-2 
          ${className}
        `}
            >
                <span className={`${iconSizes[size]} leading-none`}>💻</span>
                <span className="font-medium">System</span>
            </div>
        );
    }

    return (
        <button
            onClick={cycleTheme}
            className={`
        ${sizeClasses[size]}
        bg-white dark:bg-slate-800 
        border border-gray-200 dark:border-slate-600
        rounded-lg 
        flex items-center gap-2 
        transition-all duration-200 
        hover:bg-gray-50 dark:hover:bg-slate-700
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
        active:scale-95
        text-gray-700 dark:text-gray-200
        cursor-pointer
        ${className}
      `}
            aria-label={`Current theme: ${currentTheme?.label}. Click to cycle themes.`}
            title={`Switch theme (current: ${currentTheme?.label})`}
        >
            <span className={`${iconSizes[size]} leading-none`} aria-hidden="true">
                {currentTheme?.icon}
            </span>
            <span className="font-medium">
                {currentTheme?.label}
            </span>
        </button>
    );
};
