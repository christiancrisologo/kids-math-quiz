'use client';

import { useState, useEffect } from 'react';

interface SliderWithToggleProps {
    label: string;
    icon: string;
    enabled: boolean;
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onEnabledChange: (enabled: boolean) => void;
    onValuesChange: (min: number, max: number) => void;
    disabled?: boolean;
    subtitle?: string;
}

export function SliderWithToggle({
    label,
    icon,
    enabled,
    min,
    max,
    minValue,
    maxValue,
    onEnabledChange,
    onValuesChange,
    disabled = false,
    subtitle
}: SliderWithToggleProps) {
    const [localMin, setLocalMin] = useState(minValue);
    const [localMax, setLocalMax] = useState(maxValue);

    // Update local state when props change
    useEffect(() => {
        setLocalMin(minValue);
        setLocalMax(maxValue);
    }, [minValue, maxValue]);

    const handleMinChange = (value: number) => {
        const newMin = Math.min(value, localMax);
        setLocalMin(newMin);
        onValuesChange(newMin, localMax);
    };

    const handleMaxChange = (value: number) => {
        const newMax = Math.max(value, localMin);
        setLocalMax(newMax);
        onValuesChange(localMin, newMax);
    };

    const isDisabled = disabled || !enabled;

    return (
        <div className={`bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 ${disabled ? 'opacity-50' : ''}`}>
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {label}
                        </h3>
                        {subtitle && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => onEnabledChange(e.target.checked)}
                        disabled={disabled}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {/* Sliders */}
            {enabled && !disabled && (
                <div className="space-y-4">
                    {/* Min Value Slider */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-base font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
                                {localMin}
                            </span>
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Minimum
                                </label>
                                <input
                                    type="range"
                                    min={min}
                                    max={max}
                                    value={localMin}
                                    onChange={(e) => handleMinChange(parseInt(e.target.value))}
                                    disabled={isDisabled}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Max Value Slider */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-base font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
                                {localMax}
                            </span>
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Maximum
                                </label>
                                <input
                                    type="range"
                                    min={min}
                                    max={max}
                                    value={localMax}
                                    onChange={(e) => handleMaxChange(parseInt(e.target.value))}
                                    disabled={isDisabled}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Disabled state message */}
            {(disabled || !enabled) && (
                <div className="text-center py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {disabled ? 'Disabled when questions limit is off' : 'Toggle to enable'}
                    </span>
                </div>
            )}

            <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .slider-thumb:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .slider-thumb:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
        </div>
    );
}
