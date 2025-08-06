'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// System settings types
export interface SystemSettings {
    animations: boolean;
    sounds: boolean;
}

// Context type definition
interface SystemSettingsContextType {
    settings: SystemSettings;
    updateSetting: (key: keyof SystemSettings, value: boolean) => void;
    resetSettings: () => void;
}

// Default settings
const defaultSettings: SystemSettings = {
    animations: true,
    sounds: true,
};

// Create context
const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

// Provider props
interface SystemSettingsProviderProps {
    children: ReactNode;
    defaultValues?: Partial<SystemSettings>;
}

// System Settings Provider
export function SystemSettingsProvider({
    children,
    defaultValues = {}
}: SystemSettingsProviderProps) {
    const [settings, setSettings] = useState<SystemSettings>({
        ...defaultSettings,
        ...defaultValues
    });
    const [mounted, setMounted] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const loadSettings = () => {
            try {
                const savedSettings = localStorage.getItem('mathquiz-system-settings');
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings) as Partial<SystemSettings>;
                    setSettings(prev => ({
                        ...prev,
                        ...parsed
                    }));
                }
            } catch (error) {
                console.warn('Failed to load system settings:', error);
            }
        };

        loadSettings();
        setMounted(true);
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (!mounted) return;

        try {
            localStorage.setItem('mathquiz-system-settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Failed to save system settings:', error);
        }
    }, [settings, mounted]);

    // Update a specific setting
    const updateSetting = (key: keyof SystemSettings, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Reset all settings to defaults
    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const value: SystemSettingsContextType = {
        settings,
        updateSetting,
        resetSettings,
    };

    return (
        <SystemSettingsContext.Provider value={value}>
            {children}
        </SystemSettingsContext.Provider>
    );
}

// Hook to use system settings
export function useSystemSettings() {
    const context = useContext(SystemSettingsContext);
    if (context === undefined) {
        throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
    }
    return context;
}
