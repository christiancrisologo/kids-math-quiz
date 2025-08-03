'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
    const [mounted, setMounted] = useState(false);

    // Get system preference
    const getSystemTheme = (): ResolvedTheme => {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Resolve the actual theme to apply
    const resolveTheme = (theme: Theme): ResolvedTheme => {
        return theme === 'system' ? getSystemTheme() : theme;
    };

    // Apply theme to document
    const applyTheme = (resolvedTheme: ResolvedTheme) => {
        if (typeof window === 'undefined') return;

        const root = window.document.documentElement;
        root.setAttribute('data-theme', resolvedTheme);

        // Apply/remove dark class for Tailwind
        if (resolvedTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f172a' : '#8B5CF6');
        }
    };

    // Set theme and persist to localStorage
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);

        if (mounted) {
            try {
                localStorage.setItem('theme-preference', newTheme);
            } catch (error) {
                console.warn('Failed to save theme preference:', error);
            }
        }

        const resolved = resolveTheme(newTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
    };

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = (() => {
            try {
                return localStorage.getItem('theme-preference') as Theme;
            } catch {
                return null;
            }
        })();

        const initialTheme = savedTheme || defaultTheme;
        const resolved = resolveTheme(initialTheme);

        setThemeState(initialTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultTheme]);

    // Listen for system theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (theme === 'system') {
                const resolved = getSystemTheme();
                setResolvedTheme(resolved);
                applyTheme(resolved);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const value: ThemeContextType = {
        theme,
        resolvedTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
