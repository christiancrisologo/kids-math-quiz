'use client';

import React from 'react';
import { useSystemSettings } from '../../contexts/system-settings-context';
import { MobileTile } from '../ui/MobileTile';
import { useTheme } from '../../contexts/theme-context';
import type { Theme } from '../../contexts/theme-context';

interface SystemSettingsToggleProps {
    setting: 'animations' | 'sounds';
    title: string;
    subtitle: string;
    icon: string;
    className?: string;
}

export const SystemSettingsToggle: React.FC<SystemSettingsToggleProps> = ({
    setting,
    icon,
    title,
    subtitle,
    className = ''
}) => {
    const { settings, updateSetting } = useSystemSettings();
    const isOn = settings[setting];

    const getToggleInfo = () => {
        switch (setting) {
            case 'animations':
                return {
                    title: isOn ? 'Animations ON' : 'Animations OFF',
                    subtitle: isOn ? 'Tap to turn off' : 'Tap to turn on'
                };
            case 'sounds':
                return {
                    title: isOn ? 'Sounds ON' : 'Sounds OFF',
                    subtitle: isOn ? 'Tap to turn off' : 'Tap to turn on'
                };
            default:
                return {
                    title: `${title} ${isOn ? 'ON' : 'OFF'}`,
                    subtitle: isOn ? 'Tap to turn off' : 'Tap to turn on'
                };
        }
    };

    const { title: displayTitle, subtitle: displaySubtitle } = getToggleInfo();

    return (
        <MobileTile
            title={`${icon} ${displayTitle}`}
            subtitle={displaySubtitle}
            isSelected={isOn}
            onClick={() => updateSetting(setting, !isOn)}
            className={className}
        />
    );
};

interface DisplayModeToggleProps {
    className?: string;
}

export const DisplayModeToggle: React.FC<DisplayModeToggleProps> = ({
    className = ''
}) => {
    const { theme, setTheme } = useTheme();

    const themes: { value: Theme; label: string; icon: string }[] = [
        { value: 'light', label: 'Light theme', icon: '☀️' },
        { value: 'dark', label: 'Dark theme', icon: '🌙' },
        { value: 'system', label: 'System theme', icon: '💻' },
    ];

    const currentTheme = themes.find(t => t.value === theme);

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.value === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].value);
    };

    return (
        <MobileTile
            title={`${currentTheme?.icon} ${currentTheme?.label}`}
            subtitle="Tap to cycle themes"
            isSelected={false} // Always show as not selected since it's a cycling button
            onClick={cycleTheme}
            className={className}
        />
    );
};

interface SystemSettingsPanelProps {
    isMobile?: boolean;
    className?: string;
}

export const SystemSettingsPanel: React.FC<SystemSettingsPanelProps> = ({
    isMobile = false,
    className = ''
}) => {
    return (
        <div className={`bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-3 ${className}`}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center text-sm">
                ⚙️ System Settings
            </h3>

            <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {/* Display Mode Toggle */}
                <DisplayModeToggle />

                {/* Animations Setting */}
                <SystemSettingsToggle
                    setting="animations"
                    title="Animations"
                    subtitle="Visual effects & transitions"
                    icon="✨"
                />

                {/* Sounds Setting */}
                <SystemSettingsToggle
                    setting="sounds"
                    title="Sounds"
                    subtitle="Audio feedback & effects"
                    icon="🔊"
                />
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                💡 Settings are saved automatically and persist across sessions
            </div>
        </div>
    );
};
